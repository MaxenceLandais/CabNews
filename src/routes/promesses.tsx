import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PromisesBoard } from "@/components/promises-board";

export const Route = createFileRoute("/promesses")({ component: PromessesPage });

function PromessesPage() {
  return (
    <AppShell>
      <PromisesBoard />
    </AppShell>
  );
}
