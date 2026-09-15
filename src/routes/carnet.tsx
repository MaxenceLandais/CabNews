import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { CarnetView } from "@/components/carnet-view";

export const Route = createFileRoute("/carnet")({ component: CarnetPage });

function CarnetPage() {
  return (
    <AppShell>
      <CarnetView />
    </AppShell>
  );
}
