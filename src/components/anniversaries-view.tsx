import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ANNIVERSARIES } from "@/data/catalog";
import { sectorLabel } from "@/data/types";
import { textMatch } from "@/lib/filter";
import { useCabinet } from "@/lib/store";
import { daysUntil } from "@/lib/week";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { SectorBar } from "@/components/sector-bar";

const KIND: Record<(typeof ANNIVERSARIES)[number]["kind"], string> = {
  creation: "Création",
  rachat: "Rachat",
  fusion: "Fusion",
  cession: "Cession / arrêt",
  deal: "Deal",
  prise_de_poste: "Prise de poste",
};

export function AnniversariesView() {
  const sectors = useCabinet((s) => s.sectors);
  const query = useCabinet((s) => s.query);
  const list = ANNIVERSARIES.filter((a) => {
    if (sectors.length && !sectors.includes(a.sector)) return false;
    return textMatch([a.title, a.angle, a.entities.join(" ")], query);
  })
    .slice()
    .sort((a, b) => Math.abs(daysUntil(a.date)) - Math.abs(daysUntil(b.date)));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Anniversaires de deals">
        Création, rachat, fusion, prise de poste. « Un an après » est un papier. « X, 10 ans » aussi.
        On les date pour ne plus les rater.
      </PageHeader>
      <SectorBar />
      <ol className="relative space-y-4 border-l border-line pl-6">
        {list.map((a) => {
          const d = daysUntil(a.date);
          const when = d === 0 ? "Aujourd’hui" : d > 0 ? `Dans ${d} j` : `Il y a ${Math.abs(d)} j`;
          return (
            <li key={a.id} className="relative">
              <span className="absolute top-2 -left-[1.62rem] size-2.5 rounded-full bg-accent" />
              <article className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="paper">{KIND[a.kind]}</Badge>
                  <Badge>{sectorLabel(a.sector)}</Badge>
                  {a.years > 0 ? <Badge variant="moyenne">{a.years} ans</Badge> : null}
                  <span className="font-mono text-xs text-muted tabular-nums">
                    {format(new Date(`${a.date}T12:00:00`), "d MMM yyyy", { locale: fr })} · {when}
                  </span>
                </div>
                <h2 className="mt-3 font-serif text-xl leading-snug tracking-tight">{a.title}</h2>
                <p className="mt-2 text-sm leading-relaxed">{a.angle}</p>
                <p className="mt-3 text-xs text-subtle">{a.entities.join(" · ")}</p>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
