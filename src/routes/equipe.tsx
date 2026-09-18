import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { EquipeView } from "@/components/equipe-view";

export const Route = createFileRoute("/equipe")({ component: EquipePage });

function EquipePage() {
  return (
    <AppShell>
      <EquipeView />
    </AppShell>
  );
}
