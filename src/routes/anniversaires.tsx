import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { AnniversariesView } from "@/components/anniversaries-view";

export const Route = createFileRoute("/anniversaires")({ component: AnniversairesPage });

function AnniversairesPage() {
  return (
    <AppShell>
      <AnniversariesView />
    </AppShell>
  );
}
