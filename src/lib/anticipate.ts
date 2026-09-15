import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  mode: z.enum(["item", "week"]),
  title: z.string().min(1).max(240),
  context: z.string().min(1).max(6000),
});

export const anticipate = createServerFn({ method: "POST" })
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "L’anticipation n’est pas disponible dans cet environnement." };
    }

    const system =
      data.mode === "week"
        ? `Tu es chef de service à La Tribune. Tu rédiges un brief de rentrée pour la conférence de rédaction.
Réponds en français, ton factuel, sec, utile. Pas de mise en forme marketing.
Rigueur de bureau : si le titre indique un secteur (Tech, Défense, etc.), tu ne sors PAS de ce bureau. Une puces BCE ou pétrole n'a rien à faire dans Tech. Les tags secondaires (logiciel dans l'auto, defense-tech dans le Gifas) ne justifient pas un changement de rubrique.
Seeking Alpha : les titres payants sont des détections, pas des papiers à traduire.
Structure EXACTEMENT :
## Une phrase d'ouverture
## Priorités du jour (5 puces max)
## Scénarios à tenir
## Questions à poser (sources)
## Ce qu'on ne couvre pas (et pourquoi)
Interdits : emoji, superlatifs, "il est important de". Dates en français.`
        : `Tu es chef de service à La Tribune. Tu anticipes un sujet pour un journaliste.
Réponds en français, ton factuel, sec, utile.
Reste dans le bureau d'affectation du sujet. N'invente pas un angle pétrole/BCE pour une puces tech.
Seeking Alpha : déduire à partir du titre, ne pas inventer le corps payant.
Structure EXACTEMENT :
## Angle
## Ce qu'on sait / ce qu'on ne sait pas
## Scénarios (central, plausible, queue)
## Questions à poser
## Papiers possibles (brève / décryptage / enquête)
Interdits : emoji, invention de citations, noms de sources privées.`;

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 900,
        temperature: 0.4,
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: `${data.title}\n\n${data.context}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false as const, error: `Anticipation indisponible (${res.status}).` };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { ok: false as const, error: "Réponse vide." };
    return { ok: true as const, text };
  });
