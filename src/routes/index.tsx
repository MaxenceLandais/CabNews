import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { WeekBrief } from "@/components/week-brief";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <AppShell>
      <WeekBrief />
    </AppShell>
  );
}
