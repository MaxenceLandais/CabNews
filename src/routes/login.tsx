import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ROLES } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <main className="grid min-h-dvh place-items-center bg-bg text-fg">
        <div className="h-10 w-48 animate-pulse rounded-md bg-elevated" />
      </main>
    );
  }
  if (user) return <Navigate to="/" />;

  return (
    <main className="min-h-dvh bg-bg text-fg">
      <div className="mx-auto grid min-h-dvh max-w-6xl lg:grid-cols-2">
        <section className="flex flex-col justify-between border-b border-line px-6 py-10 sm:px-10 lg:border-r lg:border-b-0 lg:py-14">
          <div>
            <p className="font-mono text-xs tracking-[0.28em] text-muted uppercase">Paris · Rédaction économique</p>
            <h1 className="mt-4 font-serif text-5xl leading-none tracking-tight sm:text-6xl">Cab News</h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-fg/90">
              Le pupitre de prévision d’un titre économique. Huit jours d’agenda, 26 bureaux,
              promesses, signaux, nominations — sourcés, datés, attribués.
            </p>
            <ul className="mt-8 max-w-md space-y-3 text-sm leading-relaxed text-muted">
              <li>Horizon glissant, trois éditions par jour.</li>
              <li>Chaque information porte ses sources, cliquables.</li>
              <li>Espace rédaction : suivi, anticipation, notes de pupitre.</li>
            </ul>
          </div>
          <p className="mt-12 text-xs text-subtle">
            Accès réservé à la rédaction et aux invités dûment inscrits. Les fuites restent
            dans la salle de rédaction.
          </p>
        </section>

        <section className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:py-14">
          <h2 className="font-serif text-2xl tracking-tight">Connexion rédaction</h2>
          <p className="mt-2 text-sm text-muted">
            Compte Direction : landaismaxence.lm@gmail.com · Compte Journaliste :
            jeannedussueil@gmail.com
          </p>
          {authEnabled ? (
            <AuthForms />
          ) : (
            <p className="mt-6 text-sm text-muted">Connexion indisponible pour le moment.</p>
          )}
          <div className="mt-10 border-t border-line pt-6">
            <p className="text-xs tracking-wider text-muted uppercase">Types de comptes</p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {ROLES.map((r) => (
                <li key={r.id}>
                  <p className="text-sm font-medium">{r.label}</p>
                  <p className="text-xs leading-relaxed text-subtle">{r.audience}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

function AuthForms() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email: email.trim(),
          password,
          name: name.trim() || email.split("@")[0] || "Rédaction",
        });
        if (err) throw new Error(err.message ?? "Inscription impossible");
      } else {
        const { error: err } = await authClient.signIn.email({
          email: email.trim(),
          password,
        });
        if (err) throw new Error(err.message ?? "Identifiants incorrects");
      }
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de la connexion");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-6 flex max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        {GROK_PROVIDERS.map((p) => (
          <Button
            key={p.providerId}
            type="button"
            variant="secondary"
            className="w-full justify-center"
            onClick={() => void signIn(p.providerId, { callbackURL: "/" })}
          >
            Continuer avec {p.label}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-3 text-xs tracking-wider text-subtle uppercase">
        <span className="h-px flex-1 bg-line" />
        ou par e-mail
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="flex gap-1 rounded-md bg-elevated p-1">
        <button
          type="button"
          className={`h-9 flex-1 rounded-sm text-sm ${mode === "in" ? "bg-paper text-paper-ink" : "text-muted"}`}
          onClick={() => setMode("in")}
        >
          Se connecter
        </button>
        <button
          type="button"
          className={`h-9 flex-1 rounded-sm text-sm ${mode === "up" ? "bg-paper text-paper-ink" : "text-muted"}`}
          onClick={() => setMode("up")}
        >
          Créer un compte
        </button>
      </div>
      <form className="flex flex-col gap-3" onSubmit={(e) => void onEmail(e)}>
        {mode === "up" ? (
          <div className="grid gap-1.5">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Maxence Landais" />
          </div>
        ) : null}
        <div className="grid gap-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="prenom@redaction.fr"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            autoComplete={mode === "up" ? "new-password" : "current-password"}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? <p className="text-sm text-accent">{error}</p> : null}
        <Button type="submit" className="w-full justify-center" disabled={pending}>
          {pending ? "Ouverture…" : mode === "up" ? "Créer le compte" : "Entrer dans la rédaction"}
        </Button>
      </form>
    </div>
  );
}
