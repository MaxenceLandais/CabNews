import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { PUBLICATIONS } from "@/data/catalog";
import { sectorLabel } from "@/data/types";
import { textMatch } from "@/lib/filter";
import { useCabinet } from "@/lib/store";
import { cn } from "@/lib/utils";
import { daysUntil } from "@/lib/week";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { SectorBar } from "@/components/sector-bar";

export function PublicationsView() {
  const sectors = useCabinet((s) => s.sectors);
  const query = useCabinet((s) => s.query);
  const [onlyRankings, setOnlyRankings] = useState(false);
  const list = PUBLICATIONS.filter((p) => {
    if (onlyRankings && !p.ranking) return false;
    if (sectors.length && !sectors.includes(p.sector)) return false;
    return textMatch([p.title, p.publisher, p.whyItMatters], query);
  })
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Rapports, baromètres, classements">
        Insee, Banque de France, Rexecode, OFCE, Terra Nova, Montaigne, PISA, Heritage, IMD, FMI,
        OCDE. On les date par récurrence de mise en ligne, pas par communiqué de dernière minute.
      </PageHeader>
      <SectorBar />
      <div className="no-print">
        <button
          type="button"
          onClick={() => setOnlyRankings((v) => !v)}
          className={cn(
            "inline-flex h-9 items-center rounded-full px-3 text-xs font-medium transition-colors duration-150",
            onlyRankings ? "bg-paper text-paper-ink" : "text-muted hover:bg-elevated hover:text-fg",
          )}
        >
          Classements seulement
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="border-b border-line text-xs tracking-wider text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Publication</th>
              <th className="px-4 py-3 font-medium">Éditeur</th>
              <th className="px-4 py-3 font-medium">Secteur</th>
              <th className="px-4 py-3 font-medium">Pourquoi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => {
              const d = daysUntil(p.date);
              return (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 align-top font-mono text-xs whitespace-nowrap tabular-nums">
                    {format(new Date(`${p.date}T12:00:00`), "d MMM", { locale: fr })}
                    {p.time ? ` · ${p.time}` : ""}
                    <div className="text-subtle">{d >= 0 ? `J-${d}` : `J+${Math.abs(d)}`}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <p className="font-medium leading-snug">{p.title}</p>
                    <p className="mt-1 text-xs text-subtle">{p.recurrence}</p>
                    {p.ranking ? (
                      <Badge variant="warn" className="mt-1">
                        classement
                      </Badge>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 align-top whitespace-nowrap">{p.publisher}</td>
                  <td className="px-4 py-3 align-top">
                    <Badge variant="paper">{sectorLabel(p.sector)}</Badge>
                  </td>
                  <td className="max-w-xs px-4 py-3 align-top text-muted">
                    {p.whyItMatters}
                    {p.previous ? <p className="mt-1 text-xs text-subtle">{p.previous}</p> : null}
                    {p.sources?.length ? (
                      <p className="mt-1">
                        {p.sources.map((s) => (
                          <a
                            key={s.url}
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mr-2 text-xs underline-offset-4 hover:text-fg hover:underline"
                          >
                            {s.label}
                          </a>
                        ))}
                      </p>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
