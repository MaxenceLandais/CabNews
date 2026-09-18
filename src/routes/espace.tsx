import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { EspaceView } from "@/components/espace-view";

export const Route = createFileRoute("/espace")({ component: EspacePage });

function EspacePage() {
  return (
    <AppShell>
      <EspaceView />
    </AppShell>
  );
}
