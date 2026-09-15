import { EVENTS } from "@/data/catalog";
import type { EventItem, KindId, SectorId, WeekKindFilter } from "@/data/types";

function matchesQuery(haystack: string, q: string): boolean {
  return haystack.toLowerCase().includes(q);
}

/** Bureau d'affectation = premier secteur. Les tags secondaires sont du contexte, jamais un ticket d'entrée. */
export function primarySector(sectors: SectorId[]): SectorId | undefined {
  return sectors[0];
}

export function inSelection(primary: SectorId | undefined, selected: SectorId[]): boolean {
  if (!selected.length) return true;
  return primary !== undefined && selected.includes(primary);
}

export function filterEvents(
  events: EventItem[],
  opts: { sectors: SectorId[]; query: string; kind?: WeekKindFilter },
): EventItem[] {
  const q = opts.query.trim().toLowerCase();
  return events.filter((e) => {
    if (!inSelection(primarySector(e.sectors), opts.sectors)) return false;
    if (opts.kind && opts.kind !== "all" && e.kind !== (opts.kind as KindId)) return false;
    if (!q) return true;
    const hay = [
      e.title,
      e.lede,
      e.bullets.join(" "),
      e.entities.join(" "),
      e.whyItMatters,
      e.source ?? "",
      e.location ?? "",
    ].join(" ");
    return matchesQuery(hay, q);
  });
}

function rank(e: EventItem): number {
  if (e.flash) return 0;
  if (e.importance === "haute") return 1;
  if (e.importance === "moyenne") return 2;
  return 3;
}

function byAgenda(a: EventItem, b: EventItem): number {
  if (Boolean(a.flash) !== Boolean(b.flash)) return a.flash ? -1 : 1;
  const ta = a.time ?? "";
  const tb = b.time ?? "";
  if (ta && tb) {
    const t = ta.localeCompare(tb);
    if (t !== 0) return t;
  } else if (ta && !tb) return -1;
  else if (!ta && tb) return 1;
  return rank(a) - rank(b);
}

export function eventsByDate(
  dates: string[],
  opts: { sectors: SectorId[]; query: string; kind?: WeekKindFilter },
): Map<string, EventItem[]> {
  const filtered = filterEvents(EVENTS, opts).slice().sort(byAgenda);
  const map = new Map<string, EventItem[]>();
  for (const d of dates) map.set(d, []);
  for (const e of filtered) {
    const list = map.get(e.date);
    if (list) list.push(e);
  }
  return map;
}

export function textMatch(parts: string[], query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return matchesQuery(parts.join(" "), q);
}
