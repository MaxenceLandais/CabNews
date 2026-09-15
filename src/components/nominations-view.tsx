import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { NOMINATIONS } from "@/data/catalog";
import { sectorLabel, type NominationItem } from "@/data/types";
import { textMatch } from "@/lib/filter";
import { useCabinet } from "@/lib/store";
import { cn } from "@/lib/utils";
import { daysUntil } from "@/lib/week";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { SectorBar } from "@/components/sector-bar";

const SCOPE: Record<NominationItem["scope"], string> = {
  france: "France · grand groupe",
  international: "International",
  eti: "ETI / mid-cap",
};

const FILTERS = [
  { id: "all", label: "Toutes" },
  { id: "france", label: "France" },
  { id: "eti", label: "ETI" },
  { id: "international", label: "International" },
] as const;

export function NominationsView() {
  const sectors = useCabinet((s) => s.sectors);
  const query = useCabinet((s) => s.query);
  const [scope, setScope] = useState<(typeof FILTERS)[number]["id"]>("all");
  const list = NOMINATIONS.filter((n) => {
    if (scope !== "all" && n.scope !== scope) return false;
    if (sectors.length && !sectors.includes(n.sector)) return false;
    return textMatch([n.person, n.role, n.organization, n.whyItMatters], query);
  }).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Nominations">
        Grandes et moyennes entreprises, multinationales. Un n°2, un CFO, un architecte de programme
        disent la stratégie plus tôt qu’un communiqué de résultats.
      </PageHeader>
      <SectorBar />
      <div className="no-print flex gap-1 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setScope(f.id)}
            className={cn(
              "inline-flex h-9 shrink-0 items-center rounded-md px-3 text-xs font-medium transition-colors duration-150",
              scope === f.id ? "bg-paper text-paper-ink" : "text-muted hover:bg-elevated hover:text-fg",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <p className="text-sm text-muted">Aucune nomination sur ce filtre.</p>
      ) : (
        <ul className="grid gap-4">
          {list.map((n) => {
            const d = daysUntil(n.date);
            const when = d === 0 ? "Aujourd’hui" : d > 0 ? `Dans ${d} j` : `Il y a ${Math.abs(d)} j`;
            return (
              <li key={n.id} className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="paper">{SCOPE[n.scope]}</Badge>
                  <Badge>{sectorLabel(n.sector)}</Badge>
                  <span className="font-mono text-xs text-muted tabular-nums">
                    {format(new Date(`${n.date}T12:00:00`), "d MMM yyyy", { locale: fr })} · {when}
                  </span>
                </div>
                <h2 className="mt-3 font-serif text-xl leading-snug tracking-tight">{n.person}</h2>
                <p className="text-sm text-muted">
                  {n.role} · {n.organization}
                </p>
                {n.previous ? <p className="mt-1 text-xs text-subtle">Précédent : {n.previous}</p> : null}
                <p className="mt-3 text-sm leading-relaxed">{n.whyItMatters}</p>
                {n.sources?.length ? (
                  <ul className="mt-3 flex flex-wrap gap-x-3">
                    {n.sources.map((s) => (
                      <li key={s.url}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-muted underline-offset-4 hover:text-fg hover:underline"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
