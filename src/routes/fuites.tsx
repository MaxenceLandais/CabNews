import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { CarnetView } from "@/components/carnet-view";

export const Route = createFileRoute("/fuites")({ component: FuitesPage });

function FuitesPage() {
  return (
    <AppShell>
      <CarnetView />
    </AppShell>
  );
}
