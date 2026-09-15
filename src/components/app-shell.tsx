import { Link, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";
import type { ReactNode } from "react";
import { LAST_CRAWL } from "@/data/catalog";
import { formatWeekRange } from "@/lib/week";
import { useCabinet } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const NAV = [
  { to: "/", label: "Semaine" },
  { to: "/promesses", label: "Promesses" },
  { to: "/signaux", label: "Signaux" },
  { to: "/nominations", label: "Nominations" },
  { to: "/anniversaires", label: "Anniversaires" },
  { to: "/publications", label: "Publications" },
  { to: "/dataviz", label: "Dataviz" },
  { to: "/carnet", label: "Carnet" },
  { to: "/sources", label: "Sources" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const query = useCabinet((s) => s.query);
  const setQuery = useCabinet((s) => s.setQuery);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="no-print border-b border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-widest text-muted uppercase">
                Prévision éditoriale · jeudi → jeudi
              </p>
              <div className="mt-1 flex items-baseline gap-3">
                <Link to="/" className="font-serif text-4xl leading-none tracking-tight text-fg sm:text-5xl">
                  Cabinet
                </Link>
                <span className="hidden h-px flex-1 bg-accent sm:block sm:w-16 sm:flex-none" aria-hidden />
              </div>
              <p className="mt-2 max-w-xl font-mono text-xs text-muted tabular-nums">
                {formatWeekRange()} · crawl n°4 · {LAST_CRAWL.date.slice(8)} sept. {LAST_CRAWL.time} · 26
                bureaux
              </p>
            </div>
            <label className="relative w-full sm:w-72">
              <span className="sr-only">Rechercher dans le brief</span>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Acteur, deal, chiffre, institut…"
                className="h-11 pl-10"
              />
            </label>
          </div>
          <nav className="flex flex-nowrap gap-1 overflow-x-auto pb-1" aria-label="Rubriques">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "inline-flex h-11 shrink-0 items-center rounded-md px-3 text-sm whitespace-nowrap transition-colors duration-150",
                    active ? "bg-paper text-paper-ink" : "text-muted hover:bg-elevated hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
    </div>
  );
}
