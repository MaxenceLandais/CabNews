import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";
import { SECTORS, sectorLabel, type SectorId } from "@/data/types";
import { addLesson, listLessons } from "@/lib/veille";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";

const EMPTY = {
  detected: "",
  sourceUrl: "",
  sourceName: "",
  sector: "tech" as SectorId,
  angle: "",
  missed: "",
};

export function CarnetView() {
  const qc = useQueryClient();
  const [form, setForm] = useState(EMPTY);
  const lessons = useQuery({ queryKey: ["veille-lessons"], queryFn: () => listLessons() });

  const save = useMutation({
    mutationFn: () => addLesson({ data: form }),
    onSuccess: () => {
      toast.success("Détection enregistrée — le brief de la semaine suivante imitera le geste");
      setForm(EMPTY);
      void qc.invalidateQueries({ queryKey: ["veille-lessons"] });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Impossible d’enregistrer. Vérifie l’URL et les champs."),
  });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Fuites">
        Espace mutualisé rédacteurs / lecteurs. Une fuite = un fait + le site référence + le bureau
        + l’angle. Les angles morts du silicium se rattrapent ici.
      </PageHeader>

      <form
        className="grid gap-4 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <h2 className="font-serif text-xl tracking-tight">Nouvelle détection</h2>
        <div className="grid gap-2">
          <Label htmlFor="detected">Ce que tu as vu</Label>
          <Textarea
            id="detected"
            required
            minLength={12}
            value={form.detected}
            onChange={(e) => setForm({ ...form, detected: e.target.value })}
            placeholder="Titre, chiffre, silence d’agenda, écart entre un communiqué et un call…"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="sourceName">Site référence</Label>
            <Input
              id="sourceName"
              required
              value={form.sourceName}
              onChange={(e) => setForm({ ...form, sourceName: e.target.value })}
              placeholder="Seeking Alpha, AdC, UKMTO, Insee…"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sourceUrl">URL</Label>
            <Input
              id="sourceUrl"
              type="url"
              required
              value={form.sourceUrl}
              onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
              placeholder="https://…"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sector">Bureau (26)</Label>
          <select
            id="sector"
            value={form.sector}
            onChange={(e) => setForm({ ...form, sector: e.target.value as SectorId })}
            className="h-11 w-full rounded-md border border-line bg-elevated px-3 text-sm text-fg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {SECTORS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="angle">Angle papier</Label>
          <Textarea
            id="angle"
            required
            minLength={12}
            value={form.angle}
            onChange={(e) => setForm({ ...form, angle: e.target.value })}
            placeholder="Ce qu’il faut écrire. Et ce qu’il ne faut pas écrire."
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="missed">Ce que le brief a manqué (optionnel)</Label>
          <Textarea
            id="missed"
            value={form.missed}
            onChange={(e) => setForm({ ...form, missed: e.target.value })}
            placeholder="L’angle mort. La rubrique qui a fuité. Le titre qu’on a classé dans le mauvais bureau."
            className="min-h-24"
          />
        </div>
        <div>
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? "Enregistrement…" : "Enregistrer la détection"}
          </Button>
        </div>
      </form>

      <section>
        <h2 className="font-serif text-2xl tracking-tight">Gestes à imiter</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Chaque ligne est un réflexe de veille. Semaine après semaine, le brief s’aligne dessus.
        </p>
        {lessons.isLoading ? (
          <p className="mt-4 text-sm text-muted">Chargement du carnet…</p>
        ) : lessons.isError ? (
          <p className="mt-4 text-sm text-accent">
            {lessons.error instanceof Error ? lessons.error.message : "Le carnet n’a pas pu être chargé."}
          </p>
        ) : !lessons.data?.length ? (
          <p className="mt-4 text-sm text-muted">Le carnet est vide. Colle la première détection.</p>
        ) : (
          <ol className="mt-4 grid gap-4">
            {lessons.data.map((l) => (
              <li key={l.id} className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="paper">{sectorLabel(l.sector as SectorId)}</Badge>
                  <span className="font-mono text-xs text-muted">
                    {format(new Date(l.createdAt), "d MMM yyyy, HH:mm", { locale: fr })} · {l.sourceName}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed">{l.detected}</p>
                <p className="mt-3 text-sm leading-relaxed">
                  <span className="text-muted">Angle — </span>
                  {l.angle}
                </p>
                {l.missed ? (
                  <p className="mt-3 text-sm leading-relaxed">
                    <span className="text-muted">Manqué — </span>
                    {l.missed}
                  </p>
                ) : null}
                <a
                  href={l.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-xs text-muted underline-offset-4 hover:text-fg hover:underline"
                >
                  {l.sourceUrl}
                </a>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
