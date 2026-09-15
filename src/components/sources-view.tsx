import { useMemo, useState } from "react";
import { CRAWLS, EVENTS, SA_HEADLINES, SOURCES, SOURCE_KIND_LABEL } from "@/data/catalog";
import { sectorLabel, type SourceEntry } from "@/data/types";
import { textMatch } from "@/lib/filter";
import { useCabinet } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";

const KINDS: { id: "all" | SourceEntry["kind"]; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "officiel", label: "Officiel" },
  { id: "agenda", label: "Agendas" },
  { id: "institut", label: "Instituts" },
  { id: "corporate", label: "Corporate" },
  { id: "presse", label: "Presse" },
  { id: "marche", label: "Marché" },
];

export function SourcesView() {
  const query = useCabinet((s) => s.query);
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>("all");
  const list = useMemo(
    () =>
      SOURCES.filter((s) => {
        if (kind !== "all" && s.kind !== kind) return false;
        return textMatch([s.name, s.url, s.usedFor, s.country], query);
      }),
    [kind, query],
  );

  const eventLookup = useMemo(() => new Map(EVENTS.map((e) => [e.id, e.title])), []);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Journal de crawl & sources">
        Toutes les URL utilisées pour le tableau de bord de la semaine. Réactualisé à chaque passe.
        Officiel d’abord, presse en recoupement. Seeking Alpha : titres publics, corps payant — on
        déduit l’entreprise à suivre.
      </PageHeader>

      <section>
        <h2 className="font-serif text-2xl tracking-tight">Seeking Alpha — titres à déduire</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Les articles sont payants. Les titres suffisent : un desk US a vu un problème, un discount,
          un call. On en fait une entreprise à suivre, pas une traduction.
        </p>
        <ul className="mt-4 grid gap-3">
          {SA_HEADLINES.map((h) => (
            <li key={h.id} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
              <p className="font-mono text-xs text-muted uppercase">
                {h.date} · {h.ticker} · {sectorLabel(h.sector)}
              </p>
              <a
                href={h.url}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block font-serif text-lg leading-snug tracking-tight underline-offset-4 hover:underline"
              >
                {h.title}
              </a>
              <p className="mt-2 text-sm leading-relaxed">{h.deduction}</p>
              <p className="mt-2 text-xs text-subtle">À surveiller — {h.watch}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-2xl tracking-tight">Passes de la semaine</h2>
        <ol className="mt-4 grid gap-4">
          {CRAWLS.map((c, i) => (
            <li key={c.id} className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
              <p className="font-mono text-xs tracking-wider text-accent uppercase">
                Crawl n°{CRAWLS.length - i} · {c.date} · {c.time}
              </p>
              <p className="mt-2 text-sm leading-relaxed">{c.summary}</p>
              <p className="mt-2 font-mono text-xs text-subtle tabular-nums">
                {c.sourcesCrawled} sources interrogées · +{c.added.length} puces · {c.revised.length}{" "}
                révisions
              </p>
              <ul className="mt-3 space-y-1.5">
                {c.highlights.map((h) => (
                  <li key={h} className="flex gap-2 text-sm">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-subtle" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              {c.added.length ? (
                <p className="mt-3 text-xs text-muted">
                  Ajouts : {c.added.map((id) => eventLookup.get(id) ?? id).join(" · ")}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-2xl tracking-tight">Annuaire d’URL</h2>
          <p className="font-mono text-xs text-subtle tabular-nums">{list.length} sources</p>
        </div>
        <div className="no-print mt-3 flex gap-1 overflow-x-auto pb-1">
          {KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setKind(k.id)}
              className={cn(
                "inline-flex h-9 shrink-0 items-center rounded-md px-3 text-xs font-medium transition-colors duration-150",
                kind === k.id ? "bg-paper text-paper-ink" : "text-muted hover:bg-elevated hover:text-fg",
              )}
            >
              {k.label}
            </button>
          ))}
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="border-b border-line text-xs tracking-wider text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Pays</th>
                <th className="px-4 py-3 font-medium">Utilisée pour</th>
                <th className="px-4 py-3 font-medium">Crawl</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 align-top">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      {s.name}
                    </a>
                    <p className="mt-1 max-w-xs truncate font-mono text-xs text-subtle">{s.url}</p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Badge variant="paper">{SOURCE_KIND_LABEL[s.kind]}</Badge>
                  </td>
                  <td className="px-4 py-3 align-top whitespace-nowrap text-muted">{s.country}</td>
                  <td className="px-4 py-3 align-top text-muted">{s.usedFor}</td>
                  <td className="px-4 py-3 align-top font-mono text-xs whitespace-nowrap tabular-nums">
                    {s.lastCrawl}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="max-w-2xl text-xs leading-relaxed text-subtle">
        Espace sources grises : prévu au déploiement SaaS, avec authentification des sources
        validées. Non présenté dans cette version destinée aux directions achats médias.
      </p>
    </div>
  );
}
