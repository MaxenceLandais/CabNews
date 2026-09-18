import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { inviteStaff, listTeam } from "@/lib/newsroom";
import { ROLE_IDS, ROLES, roleLabel, type RoleId } from "@/lib/roles";
import { useNewsroom } from "@/lib/use-newsroom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";

export function EquipeView() {
  const { user, isPending, profile, loading } = useNewsroom();
  const qc = useQueryClient();
  const team = useQuery({
    queryKey: ["team"],
    queryFn: () => listTeam(),
    enabled: Boolean(profile?.canManageTeam),
    retry: false,
  });
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<RoleId>("journaliste");
  const invite = useMutation({
    mutationFn: () => inviteStaff({ data: { email, displayName, role } }),
    onSuccess: () => {
      toast.success("Invitation enregistrée");
      setEmail("");
      setDisplayName("");
      void qc.invalidateQueries({ queryKey: ["team"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Impossible d’inviter"),
  });

  if (isPending || loading) return <div className="h-32 animate-pulse rounded-xl bg-surface" />;
  if (!user) return <RedirectToSignIn />;
  if (!profile?.canManageTeam) {
    return (
      <PageHeader title="Équipe">
        Cette page est réservée à la direction. Demandez un accès à landaismaxence.lm@gmail.com.
      </PageHeader>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Équipe">
        Invitations par e-mail. Au premier login (Google, X ou mot de passe), le compte prend le rôle
        prévu. Direction : Maxence Landais. Journaliste : Jeanne Dussueil.
      </PageHeader>

      <form
        className="grid gap-4 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          invite.mutate();
        }}
      >
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="inv-name">Nom</Label>
          <Input id="inv-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="inv-email">E-mail</Label>
          <Input
            id="inv-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="inv-role">Rôle</Label>
          <select
            id="inv-role"
            value={role}
            onChange={(e) => setRole(e.target.value as RoleId)}
            className="h-11 rounded-md border border-line bg-elevated px-3 text-sm"
          >
            {ROLE_IDS.map((id) => (
              <option key={id} value={id}>
                {roleLabel(id)}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={invite.isPending}>
            {invite.isPending ? "Envoi…" : "Inviter dans la rédaction"}
          </Button>
        </div>
      </form>

      <section>
        <h2 className="font-serif text-xl tracking-tight">Rôles</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {ROLES.map((r) => (
            <li key={r.id} className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
              <p className="font-medium">{r.label}</p>
              <p className="mt-1 text-xs text-muted">{r.audience}</p>
              <p className="mt-2 text-sm leading-relaxed">{r.blurb}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-xl tracking-tight">Invitations</h2>
        <ul className="mt-3 divide-y divide-line rounded-xl bg-surface shadow-[var(--shadow-border)]">
          {(team.data?.invites ?? []).map((i) => (
            <li key={i.email} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <div>
                <p className="text-sm font-medium">{i.display_name || i.email}</p>
                <p className="text-xs text-muted">{i.email}</p>
              </div>
              <Badge variant="paper">{roleLabel(i.role)}</Badge>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-xl tracking-tight">Comptes ouverts</h2>
        {(team.data?.members ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-muted">Personne ne s’est encore connecté.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line rounded-xl bg-surface shadow-[var(--shadow-border)]">
            {(team.data?.members ?? []).map((m) => (
              <li key={m.userId} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{m.displayName}</p>
                  <p className="text-xs text-muted">{m.email || "e-mail non communiqué"}</p>
                </div>
                <Badge>{roleLabel(m.role)}</Badge>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
