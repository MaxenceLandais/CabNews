import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, ScanSearch, X } from "lucide-react";
import { useEffect, useState } from "react";
import { EVENTS, PROMISES } from "@/data/catalog";
import { kindLabel, sectorLabel, type EventItem } from "@/data/types";
import { anticipate } from "@/lib/anticipate";
import { listMyFollows, upsertFollow } from "@/lib/newsroom";
import { useNewsroom } from "@/lib/use-newsroom";
import { useCabinet } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SourceLinks } from "@/components/source-links";

const CONF: Record<EventItem["confidence"], string> = {
  confirme: "Confirmé",
  recurrence: "Récurrence / à confirmer",
  scenario: "Scénario",
};

export function EventDetail() {
  const id = useCabinet((s) => s.selectedEventId);
  const select = useCabinet((s) => s.selectEvent);
  const starred = useCabinet((s) => s.starred);
  const toggleStar = useCabinet((s) => s.toggleStar);
  const notes = useCabinet((s) => s.notes);
  const setNote = useCabinet((s) => s.setNote);
  const forecasts = useCabinet((s) => s.forecasts);
  const { user } = useNewsroom();
  const qc = useQueryClient();
  const [ai, setAi] = useState<string | null>(null);
  const [anticipation, setAnticipation] = useState("");

  const event = EVENTS.find((e) => e.id === id) ?? forecasts.find((e) => e.id === id);

  const follows = useQuery({
    queryKey: ["my-follows", user?.id],
    queryFn: () => listMyFollows(),
    enabled: Boolean(user),
  });
  const followed = Boolean(user)
    ? (follows.data ?? []).some((f) => f.eventId === id && f.kind === "suivi")
    : starred.includes(id ?? "");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") select(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [select]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!event) throw new Error("Événement introuvable");
      return anticipate({
        data: {
          mode: "item",
          title: event.title,
          context: [
            `Date : ${event.date}${event.time ? " " + event.time : ""}`,
            `Secteurs : ${event.sectors.map(sectorLabel).join(", ")}`,
            `Confiance : ${CONF[event.confidence]}`,
            event.lede,
            event.bullets.map((b) => `- ${b}`).join("\n"),
            `Pourquoi : ${event.whyItMatters}`,
            event.followUp ? `Suite : ${event.followUp}` : "",
          ].join("\n"),
        },
      });
    },
    onSuccess: (res) => {
      if (res.ok) setAi(res.text);
      else setAi(`Impossible d’anticiper : ${res.error}`);
    },
  });

  const followMut = useMutation({
    mutationFn: async () => {
      if (!event) return;
      if (user) {
        await upsertFollow({ data: { eventId: event.id, kind: "suivi", remove: followed } });
      }
      toggleStar(event.id);
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["my-follows"] }),
  });

  const anticipateMut = useMutation({
    mutationFn: async () => {
      if (!event || !user) return;
      await upsertFollow({
        data: { eventId: event.id, kind: "anticipation", note: anticipation.trim() || notes[event.id] || "" },
      });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["my-follows"] });
      setAnticipation("");
    },
  });

  if (!event) return null;

  const related = PROMISES.filter((p) => event.relatedPromiseIds?.includes(p.id));

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-bg/60"
      role="presentation"
      onClick={() => select(null)}
    >
      <aside
        className="flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-line bg-surface shadow-[var(--shadow-border)]"
        role="dialog"
        aria-labelledby="event-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <p className="font-mono text-xs tracking-wider text-muted uppercase">
              {event.date}
              {event.time ? ` · ${event.time}` : ""} · {CONF[event.confidence]}
              {event.flash ? " · flash" : ""}
            </p>
            <h2 id="event-title" className="mt-1 font-serif text-2xl leading-snug tracking-tight">
              {event.title}
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md text-muted hover:bg-elevated hover:text-fg"
            onClick={() => select(null)}
            aria-label="Fermer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 px-5 py-5">
          <p className="text-sm leading-relaxed text-fg">{event.lede}</p>

          <div className="flex flex-wrap gap-1.5">
            <Badge>{kindLabel(event.kind)}</Badge>
            {event.sectors.map((s) => (
              <Badge key={s} variant="paper">
                {sectorLabel(s)}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={followed ? "default" : "secondary"}
              onClick={() => followMut.mutate()}
            >
              <Bookmark className={cn("size-4", followed && "fill-current")} />
              {followed ? "Suivi" : "Suivre"}
            </Button>
            <Button
              type="button"
              variant="accent"
              disabled={mutation.isPending}
              onClick={() => {
                setAi(null);
                mutation.mutate();
              }}
            >
              <ScanSearch className="size-4" />
              {mutation.isPending ? "Anticipation…" : "Anticiper"}
            </Button>
          </div>

          <ul className="space-y-2">
            {event.bullets.map((b) => (
              <li key={b} className="flex gap-2 text-sm leading-relaxed">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <section>
            <h3 className="text-xs font-medium tracking-wider text-muted uppercase">Pourquoi ça compte</h3>
            <p className="mt-2 text-sm leading-relaxed text-fg">{event.whyItMatters}</p>
          </section>

          {event.followUp ? (
            <section>
              <h3 className="text-xs font-medium tracking-wider text-muted uppercase">À aller voir</h3>
              <p className="mt-2 text-sm leading-relaxed">{event.followUp}</p>
            </section>
          ) : null}

          {event.entities.length ? (
            <p className="text-xs text-muted">Acteurs : {event.entities.join(" · ")}</p>
          ) : null}

          <section>
            <h3 className="text-xs font-medium tracking-wider text-muted uppercase">Sources</h3>
            <SourceLinks item={event} className="mt-2" />
          </section>

          {related.length ? (
            <section className="rounded-lg bg-elevated p-4">
              <h3 className="text-xs font-medium tracking-wider text-muted uppercase">Promesses liées</h3>
              <ul className="mt-2 space-y-3">
                {related.map((p) => (
                  <li key={p.id}>
                    <p className="text-sm font-medium">
                      {p.actor} — {p.pledge}
                    </p>
                    <p className="mt-1 text-xs text-muted">{p.checkpoint}</p>
                    <SourceLinks item={p} compact className="mt-1" />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section>
            <h3 className="text-xs font-medium tracking-wider text-muted uppercase">Note de pupitre</h3>
            <Textarea
              className="mt-2 min-h-24"
              placeholder="Angle, contact, recoupement…"
              value={notes[event.id] ?? ""}
              onChange={(e) => setNote(event.id, e.target.value)}
            />
          </section>

          {user ? (
            <section>
              <h3 className="text-xs font-medium tracking-wider text-muted uppercase">Envoyer en anticipation</h3>
              <Textarea
                className="mt-2 min-h-20"
                placeholder="Ce que vous anticipez — horizon, chiffre, risque."
                value={anticipation}
                onChange={(e) => setAnticipation(e.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                className="mt-2"
                disabled={anticipateMut.isPending}
                onClick={() => anticipateMut.mutate()}
              >
                {anticipateMut.isPending ? "Envoi…" : "Classer dans mon espace"}
              </Button>
            </section>
          ) : null}

          {ai ? (
            <div className="rounded-lg border border-line bg-elevated p-4">
              <p className="text-xs font-medium tracking-wider text-muted uppercase">Anticipation</p>
              <div className="mt-3 space-y-3 text-sm leading-relaxed whitespace-pre-wrap">{ai}</div>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
