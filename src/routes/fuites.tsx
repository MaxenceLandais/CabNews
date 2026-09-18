import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { CarnetView } from "@/components/carnet-view";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useNewsroom } from "@/lib/use-newsroom";

export const Route = createFileRoute("/fuites")({ component: FuitesPage });

function FuitesPage() {
  return (
    <AppShell>
      <FuitesGate />
    </AppShell>
  );
}

function FuitesGate() {
  const { user, isPending, profile, loading } = useNewsroom();
  if (isPending || loading) return <div className="h-32 animate-pulse rounded-xl bg-surface" />;
  if (!user) return <RedirectToSignIn />;
  if (!profile?.canSeeFuites) {
    return (
      <div className="max-w-lg">
        <h1 className="font-serif text-3xl tracking-tight">Fuites</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Réservé à la direction, aux chefs et aux journalistes. Les lecteurs et les invités n’y ont
          pas accès.
        </p>
        <Link to="/espace" className="mt-4 inline-block text-sm underline-offset-4 hover:underline">
          Retour à mon espace
        </Link>
      </div>
    );
  }
  return <CarnetView />;
}
