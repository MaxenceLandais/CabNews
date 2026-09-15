import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { SourcesView } from "@/components/sources-view";

export const Route = createFileRoute("/sources")({ component: SourcesPage });

function SourcesPage() {
  return (
    <AppShell>
      <SourcesView />
    </AppShell>
  );
}
