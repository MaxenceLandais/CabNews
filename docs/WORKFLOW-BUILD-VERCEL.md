# CabNews — workflow Grok Build + GitHub + Vercel

## Principe

**GitHub `MaxenceLandais/CabNews` (branche `main`) est la source de vérité.**

- Live auto : https://cabnews.vercel.app/ (Vercel redéploie à chaque push sur `main`)
- Preview Grok Build (optionnel) : https://cabnews.grok.me/ (republish manuel seulement)

## Développer avec Grok Build

### Début de session — sync

Coller dans Grok Build :

```
Synchronise entièrement ce projet depuis le dépôt GitHub https://github.com/MaxenceLandais/CabNews, branche main. Remplace le code local par le contenu à jour du repo (y compris src/data). Confirme le dernier commit synchronisé, puis on continue le développement.
```

### Fin de session — push

```
Push tous les changements de cette session vers https://github.com/MaxenceLandais/CabNews sur la branche main. Ne touche pas aux fichiers de données éditoriales (src/data/events.ts, refreshes.ts, sources.ts) sauf si on les a explicitement modifiés ensemble. Résume les fichiers poussés et le SHA du commit.
```

### Après le push

Vercel déploie tout seul en quelques minutes. Vérifier https://cabnews.vercel.app/ — pas besoin de republier `cabnews.grok.me` pour le live partagé.

## Contenu éditorial (MAJ 3×/jour)

Les routines Paris **06:00 / 12:00 / 16:00** mettent à jour le contenu et poussent sur `main`. Elles touchent surtout `src/data/*`.

Évite de laisser Build et le repo diverger longtemps : chaque grosse session Build commence par un sync et finit par un push.
