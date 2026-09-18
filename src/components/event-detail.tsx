import { useMutation } from "@tanstack/react-query";
import { Bookmark, ScanSearch, X } from "lucide-react";
import { useEffect, useState } from "react";
import { EVENTS, PROMISES } from "@/data/catalog";
import { kindLabel, sectorLabel, type EventItem } from "@/data/types";
import { anticipate } from "@/lib/anticipate";
import { useCabinet } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
  const [ai, setAi] = useState<string | null>(null);

  const event = EVENTS.find((e) => e.id === id) ?? forecasts.find((e) => e.id === id);

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
            `Source : ${event.source ?? "n/a"}`,
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
              variant={starred.includes(event.id) ? "default" : "secondary"}
              onClick={() => toggleStar(event.id)}
            >
              <Bookmark className={cn("size-4", starred.includes(event.id) && "fill-current")} />
              {starred.includes(event.id) ? "Suivi" : "Suivre"}
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
            {event.sources?.length ? (
              <ul className="mt-2 space-y-1">
                {event.sources.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-fg underline-offset-4 hover:underline"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : event.source ? (
              <p className="mt-2 text-sm text-muted">Source : {event.source}</p>
            ) : (
              <p className="mt-2 text-sm text-subtle">Source à recouper — pas de lien officiel daté.</p>
            )}
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
