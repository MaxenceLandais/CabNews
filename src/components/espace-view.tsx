import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { EVENTS } from "@/data/catalog";
import { SECTOR_GROUPS, sectorLabel, type SectorId } from "@/data/types";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { listMyDesks, listMyFollows, toggleMyDesk, upsertFollow } from "@/lib/newsroom";
import { roleLabel } from "@/lib/roles";
import { useNewsroom } from "@/lib/use-newsroom";
import { useCabinet } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { SourceLinks } from "@/components/source-links";

export function EspaceView() {
  const { user, isPending, profile, loading } = useNewsroom();
  const qc = useQueryClient();
  const selectEvent = useCabinet((s) => s.selectEvent);
  const forecasts = useCabinet((s) => s.forecasts);
  const notes = useCabinet((s) => s.notes);

  const desks = useQuery({
    queryKey: ["my-desks", user?.id],
    queryFn: () => listMyDesks(),
    enabled: Boolean(user),
  });
  const follows = useQuery({
    queryKey: ["my-follows", user?.id],
    queryFn: () => listMyFollows(),
    enabled: Boolean(user),
  });

  const toggleDesk = useMutation({
    mutationFn: (sectorId: string) => toggleMyDesk({ data: { sectorId } }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["my-desks"] }),
  });
  const dropFollow = useMutation({
    mutationFn: (payload: { eventId: string; kind: "suivi" | "anticipation" }) =>
      upsertFollow({ data: { ...payload, remove: true } }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["my-follows"] }),
    onError: () => toast.error("Impossible de retirer ce suivi"),
  });

  if (isPending || loading) {
    return <div className="h-32 animate-pulse rounded-xl bg-surface" />;
  }
  if (!user) return <RedirectToSignIn />;

  const pool = [...forecasts, ...EVENTS];
  const suivis = (follows.data ?? []).filter((f) => f.kind === "suivi");
  const anticipations = (follows.data ?? []).filter((f) => f.kind === "anticipation");
  const noteEntries = Object.entries(notes).filter(([, v]) => v.trim());

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Mon espace">
        Tout ce que vous avez mis en suivi ou en anticipation. Les bureaux cochés deviennent votre
        pupitre. Rien n’est partagé avec les autres comptes, hors direction.
      </PageHeader>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <p className="font-mono text-xs tracking-wider text-muted uppercase">Compte</p>
        <h2 className="mt-1 font-serif text-2xl tracking-tight">
          {profile?.displayName || user.displayName || "Rédaction"}
        </h2>
        <p className="mt-1 text-sm text-muted">{profile?.email || user.primaryEmail}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="paper">{profile ? roleLabel(profile.role) : "…"}</Badge>
          {profile?.canSeeFuites ? <Badge>Fuites</Badge> : <Badge variant="veille">Sans fuites</Badge>}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl tracking-tight">Bureaux en suivi</h2>
        <p className="mt-1 text-sm text-muted">Cochez les desks que vous couvrez. Ils restent dans votre espace.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {SECTOR_GROUPS.map((g) => (
            <div key={g.id} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
              <p className="text-xs tracking-wider text-muted uppercase">{g.label}</p>
              <ul className="mt-2 space-y-1">
                {g.sectors.map((id) => {
                  const on = desks.data?.includes(id);
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        className="flex h-10 w-full items-center justify-between rounded-sm px-2 text-left text-sm hover:bg-elevated"
                        onClick={() => toggleDesk.mutate(id)}
                      >
                        <span>{sectorLabel(id as SectorId)}</span>
                        <span className={on ? "text-accent" : "text-subtle"}>{on ? "Suivi" : "—"}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <FollowList
        title="En suivi"
        empty="Rien en suivi. Ouvrez une prévision et cliquez Suivre."
        rows={suivis}
        pool={pool}
        onOpen={selectEvent}
        onRemove={(eventId) => dropFollow.mutate({ eventId, kind: "suivi" })}
      />
      <FollowList
        title="En anticipation"
        empty="Aucune anticipation enregistrée. Ouvrez une prévision, écrivez l’angle, envoyez."
        rows={anticipations}
        pool={pool}
        onOpen={selectEvent}
        onRemove={(eventId) => dropFollow.mutate({ eventId, kind: "anticipation" })}
      />

      <section>
        <h2 className="font-serif text-xl tracking-tight">Notes de pupitre</h2>
        {noteEntries.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Les notes prises sur une prévision apparaissent ici.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {noteEntries.map(([id, note]) => {
              const ev = pool.find((e) => e.id === id);
              return (
                <li key={id} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
                  <p className="font-serif text-lg leading-snug">{ev?.title ?? id}</p>
                  <p className="mt-2 text-sm leading-relaxed">{note}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {profile?.canManageTeam ? (
        <p className="text-sm">
          <Link to="/equipe" className="underline-offset-4 hover:underline">
            Gérer l’équipe →
          </Link>
        </p>
      ) : null}
    </div>
  );
}

function FollowList({
  title,
  empty,
  rows,
  pool,
  onOpen,
  onRemove,
}: {
  title: string;
  empty: string;
  rows: { eventId: string; note: string }[];
  pool: { id: string; title: string; lede: string; source?: string; sources?: { label: string; url: string }[] }[];
  onOpen: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <section>
      <h2 className="font-serif text-xl tracking-tight">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {rows.map((r) => {
            const ev = pool.find((e) => e.id === r.eventId);
            return (
              <li key={`${r.eventId}-${title}`} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
                <button type="button" className="text-left" onClick={() => onOpen(r.eventId)}>
                  <p className="font-serif text-lg leading-snug">{ev?.title ?? r.eventId}</p>
                  {ev?.lede ? <p className="mt-1 text-sm text-muted">{ev.lede}</p> : null}
                </button>
                {r.note ? <p className="mt-2 text-sm">{r.note}</p> : null}
                {ev ? <SourceLinks item={ev} compact className="mt-2" /> : null}
                <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => onRemove(r.eventId)}>
                  Retirer
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
