import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { MesNotesView } from "@/components/mes-notes-view";

export const Route = createFileRoute("/notes")({ component: NotesPage });

function NotesPage() {
  return (
    <AppShell>
      <MesNotesView />
    </AppShell>
  );
}
