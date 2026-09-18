# CabNews — workflow Grok Build + GitHub + Vercel + Grok Bot

## Principe

**GitHub `MaxenceLandais/CabNews` (branche `main`) est la source de vérité.**

- Live auto : https://cabnews.vercel.app/ (Vercel redéploie à chaque push sur `main`)
- Preview Grok Build (optionnel) : https://cabnews.grok.me/ (republish manuel seulement)
- Repo : **privé** par défaut (Jeanne en collaboratrice). Public seulement pendant une fenêtre courte de sync Build.

## Processus qui marche (validé 2026-09-18)

Grok Build ne lit pas correctement le repo **privé** (404) et ne **pousse** pas de façon fiable (« pas d’écriture »), même avec l’app GitHub Grok installée. Le chemin stable est :

1. **Grok Bot** : passe le repo en **public** (fenêtre courte).
2. **Grok Build** : **sync seul** depuis `main` (pas de features dans le même prompt).
3. **Grok Build** : développement UI / features.
4. **Toi** : télécharge le **zip** du projet Build → envoie-le à **Grok Bot** (chat ou Drive CabNews).
5. **Grok Bot** : pousse sur `main` → Vercel met à jour https://cabnews.vercel.app/
6. **Grok Bot** : remet le repo en **privé**.

Ne compte **pas** sur « Push depuis Build » pour l’instant.

### Prompt sync (Build) — après passage en public

```
Synchronise entièrement ce projet depuis le dépôt GitHub https://github.com/MaxenceLandais/CabNews, branche main. Remplace le code local par le contenu à jour du repo (y compris src/data). Confirme le dernier commit synchronisé, puis STOP. Ne développe rien encore.
```

### Ensuite — features (Build, prompt séparé)

Un second tour pour l’UI / produit. Ne pas combiner sync + features + push.

### Fin de session — zip → Bot

Exporter / télécharger le projet depuis Build, l’envoyer à Grok Bot avec :

```
Voici le zip Build de la session CabNews. Pousse sur MaxenceLandais/CabNews main, vérifie le SHA, puis remets le repo en privé.
```

## Contenu éditorial (MAJ 3×/jour)

Les routines Paris **06:00 / 12:00 / 16:00** (Grok Bot) mettent à jour le contenu et poussent sur `main` **même si le repo est privé**. Elles touchent surtout `src/data/*` (et éventuellement `horizon.ts` selon le modèle).

Évite qu’un zip Build écrase une MAJ toute fraîche : synchronise Build juste après une MAJ, ou dis à Bot de fusionner avec prudence si une MAJ est passée pendant la session Build.

## Qui fait quoi

| Rôle | Qui |
|------|-----|
| Source de vérité | GitHub `main` |
| Live | Vercel → cabnews.vercel.app |
| UI / mobile / PWA | Grok Build (puis zip → Bot) |
| Push GitHub fiable | Grok Bot |
| Privé ↔ public temporaire | Grok Bot |
| MAJ éditoriales 3×/jour | Grok Bot (routines) |

## Source inbox (open feeds → Bot MAJ)

Avant chaque MAJ Paris (**06 / 12 / 16**), l’Action [`cabnews-inbox`](../.github/workflows/cabnews-inbox.yml) collecte des flux ouverts (Insee, Sénat, info.gouv, BCE, Bercy HTML, BdF `data-href`, …) dans `inbox/sources/`.

- **Pas de LLM** dans Actions — collecte mécanique uniquement.
- Bot lit d’abord **`inbox/sources/LATEST.json`** (détail : [`INBOX-SOURCES.md`](./INBOX-SOURCES.md)).
- Horaires Action (CEST) ≈ **05:45 / 11:45 / 15:45** Paris (`cron` UTC `45 3,9,13 * * *` ; en CET ~1h plus tôt).
- Commits inbox uniquement, message avec `[skip ci]`, pour ne pas boucler ni republier Vercel pour du brut.

Local : `npm run inbox:fetch`.

