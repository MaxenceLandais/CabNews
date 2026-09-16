# CabNews — espace idées pour Jeanne

Bienvenue. Ce dossier Drive (et ce fichier dans le repo) sert à **comprendre CabNews** et à **noter des idées produit / éditoriales**.

## Accès essentiels

| Quoi | Lien |
|------|------|
| **Site web live (à utiliser)** | https://cabnews.vercel.app/ |
| **Preview Grok Build** (optionnel) | https://cabnews.grok.me/ |
| **Code source (GitHub, privé)** | https://github.com/MaxenceLandais/CabNews |
| **Dossier Drive partagé** | https://drive.google.com/drive/folders/1tL7jXs-IRqG7V2vC21OdaNDiLT9n335I |
| **Doc fonctionnalités (détaillée)** | [FONCTIONNALITES.md](./FONCTIONNALITES.md) |

Tu as les droits **éditeur** sur le Drive : tu peux y créer des Docs, Sheets, commentaires, etc.

## Comment travailler

1. Ouvre le site live https://cabnews.vercel.app/ et parcours chaque rubrique du menu.
2. Lis la [documentation des fonctionnalités](./FONCTIONNALITES.md) (copie Drive ↔ GitHub possible).
3. Dépose tes idées dans le Drive (fichier « Idées » ou nouveaux Docs) : UX, angles éditoriaux, données manquantes, bugs ressentis.
4. Quand une idée est validée, Maxence la reporte dans le code (souvent via Grok Build, puis push GitHub).

## Qui fait quoi (workflow)

| Rôle | Outil | Responsabilité |
|------|--------|----------------|
| **Source de vérité** | GitHub `main` | Tout le code et les données |
| **Développement UI / mobile / PWA** | Grok Build | Features produit ; sync depuis GitHub en début de session, push vers GitHub en fin |
| **Mises à jour éditoriales** | Routines 06h / 12h / 16h (Paris) | Contenu (`src/data/*`) + push automatique |
| **Mise en ligne** | Vercel | Redeploy auto à chaque push sur `main` → https://cabnews.vercel.app/ |
| **Preview Build** | Grok Build → `cabnews.grok.me` | Uniquement si republish manuel ; ce n’est plus le lien à partager |

Règle simple : le lien à ouvrir et à partager, c’est **toujours** https://cabnews.vercel.app/.

## Synchronisation doc

Le fichier `docs/FONCTIONNALITES.md` du repo et le Google Doc du même nom dans le Drive doivent rester alignés. Pour mettre à jour :

- **Drive → GitHub** : copier-coller le contenu du Doc dans `docs/FONCTIONNALITES.md`, commit/push.
- **GitHub → Drive** : ouvrir le Markdown sur GitHub, coller dans le Doc Drive.
