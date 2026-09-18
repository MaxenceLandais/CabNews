import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { sectorLabel } from "@/data/types";
import { classifyNote, formatClassified } from "@/lib/classify-note";
import { useCabinet } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";

export function MesNotesView() {
  const [text, setText] = useState("");
  const addForecast = useCabinet((s) => s.addForecast);
  const forecasts = useCabinet((s) => s.forecasts);
  const learnedNames = useCabinet((s) => s.learnedNames);

  function send() {
    const raw = text.trim();
    if (raw.length < 12) {
      toast.error("Colle au moins une phrase — agenda, nom, date.");
      return;
    }
    const classified = classifyNote(raw);
    addForecast(classified.event);
    setText("");
    toast.success(`Classé : ${formatClassified(classified)}`);
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Mes Notes">
        Un paragraphe. Un bouton. CabNews classe le jour, le secteur, et pose la puce dans Prévisions
        (À venir). Copie ce que le crawl a manqué — agenda, nomination, visite. On retient les noms et
        les sites pour les récurrences suivantes.
      </PageHeader>

      <form
        className="grid gap-4 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <label htmlFor="note" className="text-sm font-medium">
          Prévision à intégrer
        </label>
        <Textarea
          id="note"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ex. Mardi 22 septembre — visite ArcelorMittal à Fos, source Usine Nouvelle. Ou : leasing PAC, décision Matignon, Les Échos."
          className="min-h-40"
        />
        <div>
          <Button type="submit">Envoyer à Cab News</Button>
        </div>
        <p className="text-xs text-muted">
          Date (mardi 22, 24/09, jeudi…) et secteur sont déduits. Pas d’URL obligatoire — la source
          dans le texte suffit. Espace mutualisé :{" "}
          <Link to="/fuites" className="underline-offset-4 hover:underline">
            Fuites
          </Link>
          .
        </p>
      </form>

      {learnedNames.length ? (
        <p className="text-xs text-muted">
          Noms retenus : {learnedNames.slice(0, 12).join(" · ")}
        </p>
      ) : null}

      <section>
        <h2 className="font-serif text-2xl tracking-tight">Envoyées</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Elles apparaissent aussi dans Prévisions, au jour classé, badge flash.
        </p>
        {!forecasts.length ? (
          <p className="mt-4 text-sm text-muted">Rien encore. Colle la première prévision manquée.</p>
        ) : (
          <ol className="mt-4 grid gap-4">
            {forecasts.map((e) => (
              <li key={e.id} className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="paper">{e.sectors[0] ? sectorLabel(e.sectors[0]) : "—"}</Badge>
                  <span className="font-mono text-xs text-muted">
                    {format(new Date(`${e.date}T12:00:00`), "EEEE d MMMM", { locale: fr })}
                  </span>
                </div>
                <p className="mt-3 font-serif text-lg leading-snug tracking-tight">{e.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{e.lede}</p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
