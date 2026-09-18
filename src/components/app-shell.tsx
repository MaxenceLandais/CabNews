import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Search } from "lucide-react";
import { type ReactNode, useSyncExternalStore } from "react";
import { LAST_CRAWL } from "@/data/catalog";
import { SECTOR_GROUPS, sectorLabel, type SectorId } from "@/data/types";
import { signOut } from "@/lib/auth/client";
import { hasGateSessionMarker } from "@/lib/auth/gate-session-marker";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { roleLabel } from "@/lib/roles";
import { useNewsroom } from "@/lib/use-newsroom";
import { formatFrSlash, formatWeekRange } from "@/lib/week";
import { useCabinet } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PRIMARY_NAV = [
  { to: "/", label: "Prévisions" },
  { to: "/promesses", label: "Promesses" },
  { to: "/signaux", label: "Signaux" },
] as const;

const REDACTION_NAV = [
  { to: "/nominations", label: "Nominations" },
  { to: "/anniversaires", label: "Anniversaires" },
  { to: "/publications", label: "Publications" },
  { to: "/dataviz", label: "Dataviz" },
  { to: "/notes", label: "Mes notes" },
  { to: "/sources", label: "Sources" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const query = useCabinet((s) => s.query);
  const setQuery = useCabinet((s) => s.setQuery);
  const { profile } = useNewsroom();
  const redactionActive = REDACTION_NAV.some((i) => pathname === i.to || pathname.startsWith(`${i.to}/`))
    || pathname === "/fuites"
    || pathname === "/carnet";

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="no-print border-b border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-[0.22em] text-muted uppercase">
                Rédaction économique · Paris
              </p>
              <div className="mt-1 flex items-baseline gap-3">
                <Link to="/" className="font-serif text-4xl leading-none tracking-tight text-fg sm:text-5xl">
                  Cab News
                </Link>
                <span className="hidden h-px flex-1 bg-accent sm:block sm:w-16 sm:flex-none" aria-hidden />
              </div>
              <p className="mt-2 max-w-xl font-mono text-xs text-fg tabular-nums">
                {formatWeekRange()}
              </p>
              <p className="mt-1 max-w-xl font-mono text-xs text-muted tabular-nums">
                Édition du {formatFrSlash(LAST_CRAWL.date)} · {LAST_CRAWL.time} (Paris)
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
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
              <AccountSlot />
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-1" aria-label="Rubriques">
            {PRIMARY_NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname === item.to;
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
            <DesksMenu />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex h-11 items-center gap-1 rounded-md px-3 text-sm",
                    redactionActive ? "bg-paper text-paper-ink" : "text-muted hover:bg-elevated hover:text-fg",
                  )}
                >
                  Rédaction
                  <ChevronDown className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Le journal</DropdownMenuLabel>
                {REDACTION_NAV.map((item) => (
                  <DropdownMenuItem key={item.to} asChild>
                    <Link to={item.to}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
                {profile?.canSeeFuites ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/fuites">Fuites</Link>
                    </DropdownMenuItem>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      <footer className="no-print border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Cab News · Cabinet de rédaction économique · Paris</p>
          <p>Sources officielles en priorité. Toute puce est datée et attribuée.</p>
        </div>
      </footer>
    </div>
  );
}

function DesksMenu() {
  const sectors = useCabinet((s) => s.sectors);
  const setOnlySector = useCabinet((s) => s.setOnlySector);
  const clearSectors = useCabinet((s) => s.clearSectors);
  const label =
    sectors.length === 1 ? sectorLabel(sectors[0]!) : sectors.length ? `${sectors.length} bureaux` : "Bureaux";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-11 items-center gap-1 rounded-md px-3 text-sm",
            sectors.length ? "bg-paper text-paper-ink" : "text-muted hover:bg-elevated hover:text-fg",
          )}
        >
          {label}
          <ChevronDown className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-[min(70vh,28rem)] w-64 overflow-y-auto">
        <DropdownMenuItem onSelect={() => clearSectors()}>Tous les bureaux</DropdownMenuItem>
        <DropdownMenuSeparator />
        {SECTOR_GROUPS.map((g) => (
          <div key={g.id}>
            <DropdownMenuLabel>{g.label}</DropdownMenuLabel>
            {g.sectors.map((id) => {
              const sid = id as SectorId;
              const on = sectors.includes(sid);
              return (
                <DropdownMenuItem
                  key={sid}
                  className={on ? "text-fg" : ""}
                  onSelect={() => setOnlySector(sid)}
                >
                  <span className="flex-1">{sectorLabel(sid)}</span>
                  {on ? <span className="text-xs text-accent">actif</span> : null}
                </DropdownMenuItem>
              );
            })}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const subscribeToNothing = () => () => {};
const noGateOnServer = () => false;

function AccountSlot() {
  const { user, isPending } = useCurrentUserState();
  const { profile } = useNewsroom();
  const gateSession = useSyncExternalStore(subscribeToNothing, hasGateSessionMarker, noGateOnServer);

  if (isPending) {
    return <div className="h-11 w-28 animate-pulse rounded-md bg-elevated" />;
  }
  if (!user) {
    return (
      <Link
        to="/login"
        className="inline-flex h-11 items-center rounded-md bg-paper px-4 text-sm text-paper-ink"
      >
        Connexion
      </Link>
    );
  }

  const name = profile?.displayName || user.displayName || user.primaryEmail || "Compte";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex h-11 max-w-56 items-center gap-2 rounded-md bg-elevated px-3 text-sm"
        >
          <span className="grid size-7 place-items-center rounded-full bg-paper text-xs font-medium text-paper-ink">
            {name.charAt(0).toUpperCase()}
          </span>
          <span className="hidden truncate sm:inline">{name}</span>
          <ChevronDown className="size-4 text-subtle" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{profile ? roleLabel(profile.role) : "Rédaction"}</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to="/espace">Mon espace</Link>
        </DropdownMenuItem>
        {profile?.canManageTeam ? (
          <DropdownMenuItem asChild>
            <Link to="/equipe">Équipe</Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        {!gateSession ? (
          <DropdownMenuItem
            onSelect={() => {
              void signOut().catch(() => undefined);
            }}
          >
            Se déconnecter
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem disabled>Session active</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
