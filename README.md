# Cabinet — prévision éditoriale

Outil de rédaction **jeudi → jeudi** : événements économiques, résultats, visites, promesses, signaux faibles, nominations, dataviz officielles, titres Seeking Alpha.

Construit pour une journaliste et un ingénieur. 26 bureaux. Un filtre = un bureau. Les tags secondaires (pétrole dans une puces marchés, logiciel dans l’auto) ne polluent plus la sélection.

Repo : [MaxenceLandais/CabNews](https://github.com/MaxenceLandais/CabNews)

## Lancer en local

```bash
npm install
npm run dev
```

L’app écoute sur `http://localhost:8080`.

```bash
npm run typecheck
npm run build
```

## Rubriques

| Route | Contenu |
|---|---|
| `/` | Semaine jeudi → jeudi, puces du jour, Seeking Alpha |
| `/promesses` | Feuilles de route élus / entreprises |
| `/signaux` | Signaux faibles |
| `/nominations` | Grandes, mid, multinationales |
| `/anniversaires` | Deals, créations, rachats |
| `/publications` | Insee, BdF, think tanks, classements |
| `/dataviz` | 5 propositions officielles de la semaine |
| `/carnet` | Détections humaines à imiter |
| `/sources` | Journal de crawl + URL |

## Règle de filtrage (V3)

Le **premier secteur** d’une puces est le bureau d’affectation. Les autres tags sont du contexte. Tech ne sort pas la BCE ni le pétrole.

## Seeking Alpha

Les articles sont payants. On déduit sur le **titre** : entreprise à suivre, bureau, angle. Source : [fil France](https://seekingalpha.com/market-outlook/global-investing/analysis/france).

## Carnet de veille

Coller une détection (fait + URL + bureau + angle). La semaine suivante, le brief imite le geste.

## Stack

TanStack Start, React 19, Tailwind v4, Zustand, Zod, Recharts, Postgres (Neon en prod, PGLite en local).
