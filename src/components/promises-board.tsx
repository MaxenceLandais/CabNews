import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PROMISES } from "@/data/catalog";
import { sectorLabel, type PromiseStatus } from "@/data/types";
import { textMatch } from "@/lib/filter";
import { useCabinet } from "@/lib/store";
import { daysUntil } from "@/lib/week";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { SectorBar } from "@/components/sector-bar";
import { SourceLinks } from "@/components/source-links";

const STATUS: Record<PromiseStatus, { label: string; variant: "haute" | "ok" | "warn" | "moyenne" | "veille" }> = {
  manque: { label: "Non tenue", variant: "haute" },
  expire_bientot: { label: "Deadline proche", variant: "warn" },
  en_cours: { label: "En cours", variant: "moyenne" },
  a_verifier: { label: "À vérifier", variant: "veille" },
  tenu: { label: "Tenue", variant: "ok" },
};

export function PromisesBoard() {
  const sectors = useCabinet((s) => s.sectors);
  const query = useCabinet((s) => s.query);
  const list = PROMISES.filter((p) => {
    if (sectors.length && !sectors.includes(p.sector)) return false;
    return textMatch([p.actor, p.pledge, p.checkpoint, p.role], query);
  })
    .slice()
    .sort((a, b) => a.deadline.localeCompare(b.deadline));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Promesses & feuilles de route">
        Linguistique de l’engagement : « je m’engage », « nous garantirons », « pas touche à »,
        horizon court ou long. X, médias, discours, congrès. Une promesse non tenue à date est un
        papier.
      </PageHeader>
      <SectorBar />
      {list.length === 0 ? (
        <p className="text-sm text-muted">Aucune promesse sur ce filtre.</p>
      ) : (
        <ul className="grid gap-4">
          {list.map((p) => {
            const st = STATUS[p.status];
            const d = daysUntil(p.deadline);
            return (
              <li key={p.id} className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={st.variant}>{st.label}</Badge>
                  <Badge variant="paper">{sectorLabel(p.sector)}</Badge>
                  <span className="font-mono text-xs text-muted tabular-nums">
                    Échéance {format(new Date(`${p.deadline}T12:00:00`), "d MMM yyyy", { locale: fr })}
                    {d >= 0 ? ` · J-${d}` : ` · J+${Math.abs(d)}`}
                  </span>
                </div>
                <h2 className="mt-3 font-serif text-xl leading-snug tracking-tight">{p.actor}</h2>
                <p className="text-xs text-muted">{p.role}</p>
                <p className="mt-3 text-sm leading-relaxed">
                  <span className="text-muted">Promesse — </span>
                  {p.pledge}
                </p>
                <p className="mt-3 text-sm leading-relaxed">
                  <span className="text-muted">Où en est-on — </span>
                  {p.checkpoint}
                </p>
                <p className="mt-3 text-xs text-subtle">
                  Promis le {format(new Date(`${p.pledgedOn}T12:00:00`), "d MMM yyyy", { locale: fr })}
                </p>
                <SourceLinks item={p} compact className="mt-2" />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
