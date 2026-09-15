import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { SignalsView } from "@/components/signals-view";

export const Route = createFileRoute("/signaux")({ component: SignauxPage });

function SignauxPage() {
  return (
    <AppShell>
      <SignalsView />
    </AppShell>
  );
}
