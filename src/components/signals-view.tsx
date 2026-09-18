import { SIGNALS } from "@/data/catalog";
import { sectorLabel, type WeakSignalItem } from "@/data/types";
import { inSelection, primarySector, textMatch } from "@/lib/filter";
import { useCabinet } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { SectorBar } from "@/components/sector-bar";

const RISK: Record<WeakSignalItem["risk"], { label: string; variant: "haute" | "warn" | "moyenne" | "veille" }> = {
  faillite: { label: "Proche d’une faillite", variant: "haute" },
  acquereur: { label: "Cherche un acquéreur", variant: "warn" },
  deal: { label: "Deal en vue", variant: "moyenne" },
  "sous-tension": { label: "Sous tension", variant: "veille" },
  macro: { label: "Macro", variant: "veille" },
};

export function SignalsView() {
  const sectors = useCabinet((s) => s.sectors);
  const query = useCabinet((s) => s.query);
  const list = SIGNALS.filter((s) => {
    if (sectors.length && !inSelection(primarySector(s.sectors), sectors)) return false;
    return textMatch([s.title, s.thesis, s.watch, s.entities.join(" ")], query);
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Signaux faibles">
        Esprit de déduction : données économiques + actualités de bureau. On anticipe l’entreprise
        en mauvaise posture, le deal, le décret. Pas un fil d’actu — une thèse + des preuves.
      </PageHeader>
      <SectorBar />
      {list.length === 0 ? (
        <p className="text-sm text-muted">Aucun signal sur ce filtre.</p>
      ) : (
        <ul className="grid gap-4">
          {list.map((s) => {
            const r = RISK[s.risk];
            return (
              <li key={s.id} className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={r.variant}>{r.label}</Badge>
                  {s.sectors.slice(0, 3).map((sec) => (
                    <Badge key={sec} variant="paper">
                      {sectorLabel(sec)}
                    </Badge>
                  ))}
                </div>
                <h2 className="mt-3 font-serif text-xl leading-snug tracking-tight">{s.title}</h2>
                <p className="mt-3 text-sm leading-relaxed">{s.thesis}</p>
                <ul className="mt-3 space-y-1.5">
                  {s.evidence.map((e) => (
                    <li key={e} className="flex gap-2 text-sm text-fg/90">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-subtle" />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm leading-relaxed">
                  <span className="text-muted">À surveiller — </span>
                  {s.watch}
                </p>
                <p className="mt-3 text-xs text-subtle">
                  {s.entities.join(" · ")} · {s.source}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
