# CabNews (Cabinet) — documentation des fonctionnalités

> Version documentée le 15 septembre 2026 · Site : https://cabnews.grok.me/ · Repo : https://github.com/MaxenceLandais/CabNews

Cet outil s’appelle **Cabinet** dans l’interface. C’est un outil de **prévision éditoriale** sur un cycle **jeudi → jeudi**, pensé pour une journaliste et un ingénieur : quoi suivre, pourquoi ça compte, pour quel bureau.

---

## 1. À quoi sert CabNews

CabNews n’est pas un agrégateur de dépêches générique. C’est un **brief de rédaction** qui :

- organise la semaine éditoriale (événements, publications, deals, nominations…) ;
- rattache chaque « puce » à un **bureau** (secteur) ;
- distingue le **confirmé**, la **récurrence** et le **scénario** ;
- propose des blocs de veille (Seeking Alpha, horizon 21 jours, scénarios ouverts) ;
- permet de filtrer, chercher, étoiler et annoter pour préparer des papiers.

Public cible : rédaction / cabinet éditorial qui suit l’économie française et européenne (industrie, finance, tech, société, géopolitique).

---

## 2. Accès et navigation générale

### 2.1 Site

URL : **https://cabnews.grok.me/**

En-tête fixe :

- Titre **Cabinet**
- Sous-titre : « Prévision éditoriale · jeudi → jeudi »
- Indication de la **semaine en cours**, n° de crawl, horodatage du dernier crawl, **26 bureaux**
- **Barre de recherche** : « Acteur, deal, chiffre, institut… » (filtre textuel global)
- **Menu de rubriques** (navigation principale)

### 2.2 Menu (rubriques)

| Libellé | Route | Rôle |
|---------|-------|------|
| Semaine | `/` | Brief principal jour par jour |
| Promesses | `/promesses` | Feuilles de route / engagements |
| Signaux | `/signaux` | Signaux faibles |
| Nominations | `/nominations` | Nominations (grandes, mid, multinationales) |
| Anniversaires | `/anniversaires` | Deals, créations, rachats, prises de poste |
| Publications | `/publications` | Insee, BdF, think tanks, classements… |
| Dataviz | `/dataviz` | Propositions de dataviz officielles |
| Carnet | `/carnet` | Détections humaines à imiter |
| Sources | `/sources` | Journal de crawl + URLs |

---

## 3. Les 26 bureaux (secteurs)

Chaque puce a une liste de secteurs. **Le premier secteur = le bureau d’affectation.** Les suivants sont du **contexte** et ne font **pas** entrer la puce dans un autre bureau (règle V3).

Exemple : une puce « marchés » taguée aussi « pétrole / énergie » n’apparaît **pas** si on filtre uniquement Énergie, sauf si Énergie est en premier.

### 3.1 Groupes

**Industrie** : Défense, Aéronautique, Automobile, Énergie, Industrie, Télécoms, Spatial, ETI  
**Éco & finance** : Finances publiques, Budget, Banque d’affaires, M&A, Marchés financiers, Immobilier  
**Tech** : Tech, IA  
**Société** : Éducation, Agriculture, Grande distribution, Médias, Santé, Pharma  
**Monde** : Chine, Russie, États-Unis, Ukraine

### 3.2 Comment filtrer

Sur les écrans concernés (notamment Semaine) :

- **Liste déroulante** : choisir un bureau unique (« Tous les secteurs » pour tout voir).
- **Puces / chips** : cliquer un ou plusieurs bureaux ; « Tous » remet à zéro.
- Le filtre bureau se combine avec la **recherche texte** et les **filtres de type** (éco/marchés, résultats, etc.).

---

## 4. Rubrique Semaine (`/`)

Cœur de l’outil. Affiche les **puces** (événements) de la semaine éditoriale **jeudi → jeudi**.

### 4.1 Structure d’une puce (événement)

Champs typiques :

| Champ | Signification |
|-------|----------------|
| Date / heure | Quand ça tombe dans l’agenda |
| Titre | Accroche éditoriale |
| Chapô (lede) | Ce qu’il faut retenir en une phrase |
| Puces / bullets | Détails factuels |
| Kind (type) | Éco/marchés, Résultats, Meeting, Visite, Publication, Nomination, Deadline, Deal/M&A, Signal faible, Anniversaire, Classement, Politique |
| Secteurs | Bureau primaire + tags secondaires |
| Importance | haute / moyenne / veille |
| Confiance | confirmé / récurrence / scénario |
| Entités | Acteurs (entreprises, personnes, institutions) |
| Why it matters | Pourquoi c’est un papier |
| Follow-up | Suite à surveiller |
| Sources | Labels + URLs |
| Flash | Mise à jour urgente (prioritaire dans l’ordre) |

### 4.2 Filtres de type (semaine)

Chips du type : Toute la semaine, Éco/marchés, Résultats, Meetings, Visites, Publications, Nominations, Deals, Deadlines — avec **compteurs** selon le bureau sélectionné.

### 4.3 Navigation par jour

- Vue **toute la semaine** ou **un jour** à la fois.
- Ordre d’affichage : flashes d’abord, puis par heure, puis par importance.

### 4.4 Détail d’une puce

Clic sur une puce → panneau de détail (EventDetail) : lecture complète, contexte, liens, actions locales (selon UI : notes / favoris).

### 4.5 Blocs complémentaires (souvent en bas / côté de la semaine)

- **Seeking Alpha** : titres publics (corps souvent payant). On déduit l’entreprise et l’angle depuis le titre. Source type : fil France Seeking Alpha.
- **Horizon 21 jours** : dates déjà dans le viseur au-delà de la semaine.
- **Scénarios ouverts** : questions politiques / marché sans deadline ferme, avec hypothèse « centrale ».

### 4.6 Aide rédactionnelle IA (si activée)

Fonction d’**anticipation / brief** (bouton type ScanSearch) : génère un texte de brief de rédaction à partir des puces filtrées de la semaine (copiable). Utile pour démarrer une conférence de rédaction.

### 4.7 Favoris et notes (persistés localement)

Le navigateur mémorise (localStorage via Zustand) :

- **starred** : puces étoilées ;
- **notes** : notes personnelles par id de puce.

Ces données restent sur la machine / le navigateur de l’utilisateur (pas un compte multi-appareils cloud dans la version documentée ici).

---

## 5. Promesses (`/promesses`)

Suivi des **engagements** d’élus ou d’entreprises.

Champs typiques :

- Acteur + rôle
- Texte de l’engagement
- Date d’annonce / deadline
- Statut : en cours, tenu, manqué, expire bientôt, à vérifier
- Secteur (bureau)
- Checkpoint (comment vérifier)
- Sources

Usage éditorial : transformer une promesse en **papier de suivi** ou en **checklist** avant un discours / une AG / des résultats.

---

## 6. Signaux (`/signaux`)

**Signaux faibles** : indices précoces (titres, mouvements, bruits de marché) qui ne sont pas encore des « événements calendaires » durs.

Usage : anticipation d’angles, watchlist d’entreprises, alertes soft avant qu’un sujet ne bascule en une de la Semaine.

---

## 7. Nominations (`/nominations`)

Suivi des nominations (grandes entreprises, mid-market, multinationales, institutions).

Usage : portraits, lectures politiques d’un organigramme, lien avec pipeline / stratégie (ex. R&D Sanofi, CIB BNP).

---

## 8. Anniversaires (`/anniversaires`)

Dates anniversaires : création, rachat, fusion, cession, deal, prise de poste — avec **nombre d’années**, angle éditorial, entités, secteur.

Usage : « bilans à froid », chroniques « un an après », papiers de contexte.

---

## 9. Publications (`/publications`)

Calendrier / suivi des **publications statistiques et institutionnelles** : Insee, Banque de France, Agreste, ARCEP, think tanks, classements (PISA, etc.).

Usage : préparer les papiers « chiffre du jour », recouper Bercy / agences, anticiper les notes de conjoncture.

---

## 10. Dataviz (`/dataviz`)

Propositions de **visualisations** à partir de sources officielles (typiquement ~5 propositions pour la semaine).

Usage : brief graphiste / data, idées d’infographies, pas seulement du texte.

---

## 11. Carnet (`/carnet`)

**Carnet de veille humaine** : coller une détection (fait + URL + bureau + angle). L’idée produit : la semaine suivante, le brief **imite le geste** (réplique le type de détection).

Usage pour Jeanne : noter ce qu’elle « voit » avant que ce soit dans les flux automatisés ; former le produit à son regard éditorial.

---

## 12. Sources (`/sources`)

Journal de **crawl** : quelles sources ont été lues, URLs, horodatage (ex. crawl n°4).

Usage : transparence / audit éditorial (« d’où vient cette puce ? »), maintenance de la couverture.

---

## 13. Recherche globale

La barre de recherche en en-tête filtre sur titre, chapô, bullets, entités, « why it matters », source, lieu — **insensible à la casse**.

Se combine avec les filtres bureau et type.

---

## 14. Modèle de confiance et d’importance

| Confiance | Lecture éditoriale |
|-----------|-------------------|
| confirmé | Fait / date / publication ancrée |
| récurrence | Rendez-vous attendu (Conseil des ministres, adjudications AFT…) |
| scénario | Hypothèse / titre Seeking Alpha / lecture anticipée |

| Importance | Lecture |
|------------|--------|
| haute | Priorité conférence de rédaction |
| moyenne | À suivre |
| veille | Watchlist |

Les **flashes** passent devant dans l’agenda du jour.

---

## 15. Stack technique (pour contexte)

- TanStack Start, React 19, Tailwind v4
- Zustand (état UI + persist favoris/notes)
- Zod, Recharts
- Postgres (Neon en prod, PGLite en local)
- Données éditoriales principalement dans `src/data/` (events, promises, signals, etc.)

Lancer en local (développeurs) :

```bash
npm install
npm run dev   # http://localhost:8080
npm run typecheck
npm run build
```

---

## 16. Limites actuelles (utiles pour les idées)

À connaître pour proposer des améliorations :

- Pas encore de **mode « Aujourd’hui »** ultra-compact (brief 60 secondes) dédié.
- Filtres bureau **sans URL partageable** du type `?bureau=defense` (à date).
- Favoris / notes **locaux au navigateur**, pas un espace collaboratif temps réel dans l’app.
- Seeking Alpha : **titres** seulement (corps payant) — la valeur est dans la déduction d’angle.
- La doc produit vit aussi dans le **Drive partagé** ; le code est sur **GitHub privé**.

---

## 17. Idées déjà envisagées (backlog produit)

Issues / directions discutées côté Maxence :

1. Bandeau **aujourd’hui** + brief 60 s
2. Filtres bureau **cliquables avec URL** partageable
3. **Sources + horodatage + type** plus visibles sur chaque puce
4. Actions : suivre / mettre dans briefing matin / exporter Markdown-PDF
5. Scénarios avec **statut** (central / hausse / baisse) et liens depuis les puces
6. Indicateur de fraîcheur + mobile
7. Pipeline éditorial quotidien (génération J / J+1)

Jeanne peut enrichir cette liste dans le Drive (« Idées »).

---

## 18. Glossaire rapide

| Terme | Sens |
|-------|------|
| Puce | Un item d’agenda / brief (événement) |
| Bureau | Un des 26 secteurs d’affectation |
| Tag secondaire | Secteur non primaire (contexte) |
| Crawl | Passage de collecte / MAJ des sources |
| Semaine éditoriale | Du jeudi au jeudi suivant |
| Flash | Mise à jour urgente |
| Scénario ouvert | Question stratégique sans date ferme |

---

*Document maintenu pour synchronisation Drive ↔ GitHub. Toute évolution majeure de l’UI doit être reflétée ici.*
