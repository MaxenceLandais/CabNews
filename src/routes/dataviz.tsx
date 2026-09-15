import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { DatavizView } from "@/components/dataviz-view";

export const Route = createFileRoute("/dataviz")({ component: DatavizPage });

function DatavizPage() {
  return (
    <AppShell>
      <DatavizView />
    </AppShell>
  );
}
