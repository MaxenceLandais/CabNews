import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { NominationsView } from "@/components/nominations-view";

export const Route = createFileRoute("/nominations")({ component: NominationsPage });

function NominationsPage() {
  return (
    <AppShell>
      <NominationsView />
    </AppShell>
  );
}
