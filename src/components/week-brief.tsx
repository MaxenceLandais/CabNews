import { useMutation } from "@tanstack/react-query";
import { addDays, format, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Copy, ScanSearch } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { EVENTS, LAST_CRAWL, SA_HEADLINES, SCENARIOS } from "@/data/catalog";
import {
  kindLabel,
  sectorLabel,
  WEEK_KIND_FILTERS,
  type EventItem,
  type WeekKindFilter,
} from "@/data/types";
import { anticipate } from "@/lib/anticipate";
import { eventsByDate, filterEvents, inSelection, primarySector } from "@/lib/filter";
import { useCabinet } from "@/lib/store";
import { editorialWeekDays, toIsoDate } from "@/lib/week";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventDetail } from "@/components/event-detail";
import { SectorBar } from "@/components/sector-bar";
import { SourceLinks } from "@/components/source-links";

export function WeekBrief() {
  const days = useMemo(() => editorialWeekDays(), []);
  const isos = days.map(toIsoDate);
  const sectors = useCabinet((s) => s.sectors);
  const query = useCabinet((s) => s.query);
  const forecasts = useCabinet((s) => s.forecasts);
  const selectEvent = useCabinet((s) => s.selectEvent);
  const selected = useCabinet((s) => s.selectedEventId);
  const pool = useMemo(() => [...EVENTS, ...forecasts], [forecasts]);
  const [activeDay, setActiveDay] = useState<string | "all">("all");
  const [kind, setKind] = useState<WeekKindFilter>("all");
  const [weekAi, setWeekAi] = useState<string | null>(null);

  const grouped = useMemo(
    () => eventsByDate(isos, { sectors, query, kind }, pool),
    [isos, sectors, query, kind, pool],
  );
  const filtered = useMemo(
    () => filterEvents(pool, { sectors, query, kind }),
    [pool, sectors, query, kind],
  );
  const sectorFiltered = useMemo(
    () => filterEvents(pool, { sectors, query, kind: "all" }),
    [pool, sectors, query],
  );

  const kindsWithCount = useMemo(() => {
    return WEEK_KIND_FILTERS.map((k) => ({
      ...k,
      count:
        k.id === "all"
          ? sectorFiltered.filter((e) => isos.includes(e.date)).length
          : sectorFiltered.filter((e) => isos.includes(e.date) && e.kind === k.id).length,
    })).filter((k) => k.id === "all" || k.count > 0);
  }, [sectorFiltered, isos]);

  const start = days[0];
  const end = days[days.length - 1];
  const inWeek = filtered.filter((e) => isos.includes(e.date));
  const desk =
    sectors.length === 1 ? sectorLabel(sectors[0]!) : sectors.length ? `${sectors.length} bureaux` : null;

  const visibleDays =
    activeDay === "all"
      ? isos.filter((iso) => (grouped.get(iso)?.length ?? 0) > 0 || !sectors.length)
      : isos.filter((d) => d === activeDay);

  const weekMutation = useMutation({
    mutationFn: () =>
      anticipate({
        data: {
          mode: "week",
          title: `Brief de rédaction — semaine du ${start ? format(start, "d MMMM", { locale: fr }) : ""} au ${end ? format(end, "d MMMM yyyy", { locale: fr }) : ""}${desk ? ` — bureau ${desk}` : ""}`,
          context: inWeek
            .map(
              (e) =>
                `[${e.date}${e.time ? " " + e.time : ""}] [${sectorLabel(e.sectors[0]!)}] ${e.title}\n${e.lede}\n${e.bullets.map((b) => "• " + b).join("\n")}`,
            )
            .join("\n\n")
            .slice(0, 5500),
        },
      }),
    onSuccess: (res) => {
      if (res.ok) setWeekAi(res.text);
      else toast.error(res.error);
    },
  });

  function copyBrief() {
    const lines: string[] = [
      `Cab News — brief ${start ? format(start, "d MMM", { locale: fr }) : ""} → ${end ? format(end, "d MMM yyyy", { locale: fr }) : ""}`,
      desk ? `Bureau : ${desk}` : "Tous les bureaux",
      `Édition du ${LAST_CRAWL.date} · ${LAST_CRAWL.time}`,
      "",
    ];
    for (const iso of isos) {
      const list = grouped.get(iso) ?? [];
      if (!list.length) continue;
      const d = days[isos.indexOf(iso)];
      if (!d) continue;
      lines.push(format(d, "EEEE d MMMM", { locale: fr }).toUpperCase());
      list.forEach((e, i) => {
        lines.push(`${String(i + 1).padStart(2, "0")}. ${e.title}`);
        lines.push(`    ${e.lede}`);
      });
      lines.push("");
    }
    void navigator.clipboard.writeText(lines.join("\n"));
    toast.success("Brief copié");
  }

  const todayIso = toIsoDate(new Date());

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <RefreshBanner />

        <SectorBar />

        <div className="no-print flex gap-1 overflow-x-auto pb-1">
          {kindsWithCount.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setKind(k.id)}
              className={cn(
                "inline-flex h-11 shrink-0 items-center gap-2 rounded-md px-3 text-xs font-medium transition-colors duration-150",
                kind === k.id ? "bg-elevated text-fg shadow-[var(--shadow-border-hover)]" : "text-muted hover:text-fg",
              )}
            >
              {k.label}
              <span className="font-mono tabular-nums text-subtle">{k.count}</span>
            </button>
          ))}
        </div>

        <div className="no-print flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 overflow-x-auto pb-1">
            <DayChip
              label="Prévisions"
              count={inWeek.length}
              active={activeDay === "all"}
              onClick={() => setActiveDay("all")}
            />
            {days.map((d, i) => {
              const iso = isos[i] ?? "";
              const count = grouped.get(iso)?.length ?? 0;
              return (
                <DayChip
                  key={iso}
                  label={format(d, "EEE d", { locale: fr })}
                  count={count}
                  active={activeDay === iso}
                  today={iso === todayIso}
                  onClick={() => setActiveDay(iso)}
                />
              );
            })}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={copyBrief}>
              <Copy className="size-3.5" />
              Copier
            </Button>
            <Button
              variant="accent"
              size="sm"
              disabled={weekMutation.isPending}
              onClick={() => {
                setWeekAi(null);
                weekMutation.mutate();
              }}
            >
              <ScanSearch className="size-3.5" />
              {weekMutation.isPending ? "Brief…" : "Brief IA"}
            </Button>
          </div>
        </div>

        {weekAi ? (
          <section className="rounded-xl border border-line bg-elevated p-5">
            <h2 className="font-serif text-lg tracking-tight">Note de conférence</h2>
            <div className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-fg">{weekAi}</div>
          </section>
        ) : null}

        {visibleDays.length === 0 ? (
          <p className="text-sm text-muted">
            Rien sur ce bureau cette semaine. Change de secteur ou ouvre Tous.
          </p>
        ) : (
          visibleDays.map((iso) => {
            const list = grouped.get(iso) ?? [];
            const d = days[isos.indexOf(iso)];
            if (!d) return null;
            return (
              <DaySection
                key={iso}
                date={d}
                iso={iso}
                events={list}
                isToday={iso === todayIso}
                onOpen={selectEvent}
              />
            );
          })
        )}
      </div>

      <aside className="flex w-full flex-col gap-6 lg:sticky lg:top-6 lg:w-80 lg:shrink-0">
        <FlashRail onOpen={selectEvent} />
        <SaRail />
        <HorizonRail />
        <ScenarioRail />
      </aside>

      {selected ? <EventDetail /> : null}
    </div>
  );
}

function RefreshBanner() {
  const c = LAST_CRAWL;
  return (
    <Link
      to="/sources"
      className="flex flex-col gap-1 rounded-xl bg-surface px-4 py-3 shadow-[var(--shadow-border)] transition-colors duration-150 hover:shadow-[var(--shadow-border-hover)]"
    >
      <p className="font-mono text-xs tracking-wider text-accent uppercase">
        Refresh du jour · {c.time}
      </p>
      <p className="text-sm leading-snug text-fg">{c.summary}</p>
      <p className="font-mono text-xs text-subtle tabular-nums">
        {c.sourcesCrawled} sources · +{c.added.length} puces · {c.revised.length} révisions · journal dans
        Sources
      </p>
    </Link>
  );
}

function DayChip({
  label,
  count,
  active,
  today,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  today?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-11 shrink-0 items-center gap-2 rounded-md px-3 text-xs font-medium capitalize transition-colors duration-150",
        active ? "bg-paper text-paper-ink" : "text-muted hover:bg-elevated hover:text-fg",
        today && !active && "border-b-2 border-accent",
      )}
    >
      {label}
      <span className={cn("font-mono tabular-nums", active ? "text-paper-ink/70" : "text-subtle")}>
        {count}
      </span>
    </button>
  );
}

function DaySection({
  date,
  iso,
  events,
  isToday,
  onOpen,
}: {
  date: Date;
  iso: string;
  events: EventItem[];
  isToday: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <section id={`day-${iso}`} className="scroll-mt-4">
      <header className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
        <h2 className="font-serif text-2xl capitalize tracking-tight">
          {format(date, "EEEE d MMMM", { locale: fr })}
        </h2>
        <p className="font-mono text-xs text-muted tabular-nums">
          {isToday ? <span className="mr-2 text-accent uppercase">Aujourd’hui</span> : null}
          {events.length} puce{events.length > 1 ? "s" : ""}
        </p>
      </header>
      {events.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Rien de filtré ce jour-là.</p>
      ) : (
        <ol className="mt-4 divide-y divide-line">
          {events.map((e, i) => {
            const primary = primarySector(e.sectors);
            const extra = e.sectors.slice(1);
            return (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => onOpen(e.id)}
                  className={cn(
                    "flex w-full gap-3 rounded-lg py-4 text-left transition-colors duration-150 hover:bg-elevated/50",
                    e.flash && "border-l-2 border-accent pl-3",
                  )}
                >
                  <span className="w-7 shrink-0 font-mono text-xs text-subtle tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {e.time ? (
                        <span className="font-mono text-xs text-muted tabular-nums">{e.time}</span>
                      ) : null}
                      {e.flash ? <Badge variant="haute">flash</Badge> : null}
                      <Badge>{kindLabel(e.kind)}</Badge>
                      {primary ? <Badge variant="paper">{sectorLabel(primary)}</Badge> : null}
                      {e.confidence !== "confirme" ? (
                        <Badge variant="warn">{e.confidence === "recurrence" ? "récurrence" : "scénario"}</Badge>
                      ) : null}
                    </div>
                    <p className="mt-1.5 font-serif text-lg leading-snug tracking-tight">{e.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-fg/90">{e.lede}</p>
                    <p className="mt-2 text-xs text-subtle">
                      {extra.length ? `Aussi : ${extra.map(sectorLabel).join(" · ")} · ` : ""}
                      {e.entities.slice(0, 2).join(", ")}
                    </p>
                    <SourceLinks
                      item={e}
                      compact
                      className="mt-2"
                      onNavigate={(ev) => ev.stopPropagation()}
                    />
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

function FlashRail({ onOpen }: { onOpen: (id: string) => void }) {
  const sectors = useCabinet((s) => s.sectors);
  const forecasts = useCabinet((s) => s.forecasts);
  const flashes = [...forecasts, ...EVENTS].filter((e) => e.flash && inSelection(primarySector(e.sectors), sectors)).slice(
    0,
    4,
  );
  if (!flashes.length) return null;
  return (
    <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
      <h2 className="font-serif text-lg tracking-tight">Dernière minute</h2>
      <p className="mt-1 text-xs text-muted">Dernière édition — même filtre bureau.</p>
      <ul className="mt-4 space-y-3">
        {flashes.map((e) => (
          <li key={e.id}>
            <button type="button" onClick={() => onOpen(e.id)} className="text-left">
              <p className="font-mono text-xs text-accent tabular-nums uppercase">
                {e.date.slice(8)}/{e.date.slice(5, 7)}
                {e.time ? ` · ${e.time}` : ""}
              </p>
              <p className="mt-0.5 text-sm leading-snug">{e.title}</p>
            </button>
            <SourceLinks item={e} compact className="mt-1" />
          </li>
        ))}
      </ul>
    </section>
  );
}

function SaRail() {
  const sectors = useCabinet((s) => s.sectors);
  const list = SA_HEADLINES.filter((h) => inSelection(h.sector, sectors)).slice(0, 6);
  if (!list.length) return null;
  return (
    <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
      <h2 className="font-serif text-lg tracking-tight">Seeking Alpha</h2>
      <p className="mt-1 text-xs text-muted">
        Titres publics, corps payant. On déduit l’entreprise à suivre.
      </p>
      <ul className="mt-4 space-y-4">
        {list.map((h) => (
          <li key={h.id}>
            <p className="font-mono text-xs text-muted uppercase">
              {h.ticker} · {sectorLabel(h.sector)}
            </p>
            <a
              href={h.url}
              target="_blank"
              rel="noreferrer"
              className="mt-0.5 block text-sm leading-snug underline-offset-4 hover:underline"
            >
              {h.title}
            </a>
            <p className="mt-1 text-xs text-muted">{h.deduction}</p>
          </li>
        ))}
      </ul>
      <a
        href="https://seekingalpha.com/market-outlook/global-investing/analysis/france"
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block text-xs text-muted underline-offset-4 hover:text-fg hover:underline"
      >
        Fil France Seeking Alpha
      </a>
    </section>
  );
}

function HorizonRail() {
  const sectors = useCabinet((s) => s.sectors);
  const today = startOfDay(new Date());
  const horizon = addDays(today, 21);
  const weekEnd = addDays(today, 7);
  const forecasts = useCabinet((s) => s.forecasts);
  const upcoming = [...EVENTS, ...forecasts].filter((e) => {
    if (!inSelection(primarySector(e.sectors), sectors)) return false;
    const d = startOfDay(new Date(`${e.date}T12:00:00`));
    return d > weekEnd && d <= horizon;
  }).slice(0, 5);
  if (!upcoming.length) return null;

  return (
    <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
      <h2 className="font-serif text-lg tracking-tight">À venir</h2>
      <p className="mt-1 text-xs text-muted">Au-delà des 8 jours, déjà dans le viseur.</p>
      <ul className="mt-4 space-y-3">
        {upcoming.map((e) => (
          <li key={e.id} className="text-sm">
            <p className="font-mono text-xs text-muted tabular-nums uppercase">{e.date}</p>
            <p className="leading-snug">{e.title}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ScenarioRail() {
  const sectors = useCabinet((s) => s.sectors);
  const list = SCENARIOS.filter((s) => inSelection(s.sector, sectors));
  if (!list.length) return null;
  return (
    <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
      <h2 className="font-serif text-lg tracking-tight">Scénarios ouverts</h2>
      <p className="mt-1 text-xs text-muted">Deadlines politiques et de marché, sans date ferme.</p>
      <ul className="mt-4 space-y-4">
        {list.map((s) => (
          <li key={s.id}>
            <p className="text-sm font-medium leading-snug">{s.question}</p>
            <p className="mt-1 text-xs text-muted">{s.nextCatalyst}</p>
            <p className="mt-2 text-xs text-subtle">
              Central : {s.hypotheses.find((h) => h.likelihood === "central")?.label}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
