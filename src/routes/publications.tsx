import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PublicationsView } from "@/components/publications-view";

export const Route = createFileRoute("/publications")({ component: PublicationsPage });

function PublicationsPage() {
  return (
    <AppShell>
      <PublicationsView />
    </AppShell>
  );
}
