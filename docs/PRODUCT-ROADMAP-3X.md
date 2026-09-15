# CabNews — feuille de route : 3 MAJ / jour + mobile

Décision produit (15 sept. 2026) : sortir du gel **jeudi → jeudi** figé.

## Objectif

Application **mobile-first** de prévision d’actualité :

- vision **jour par jour** ;
- synthèse **semaine** des sujets les plus importants ;
- filtres par **domaines / bureaux** sélectionnés ;
- **3 réactualisations / jour** (heure de Paris) : **06:00**, **12:00**, **16:00** ;
- affichage permanent de l’**horaire de dernière mise à jour**.

## État actuel (baseline)

- Données éditoriales surtout dans `src/data/*.ts` (événements, signaux, etc.).
- « Crawl » = métadonnée manuelle (`CRAWLS` / `LAST_CRAWL` dans `src/data/refreshes.ts`), pas un scrappeur autonome en prod.
- Site live : https://cabnews.grok.me/
- Code : https://github.com/MaxenceLandais/CabNews (privé)

## Cadence opérationnelle (assistants)

Routines Grok Bot (Europe/Paris, **tous les jours**) :

| Slot | Heure | Routine |
|------|-------|---------|
| Matin | 06:00 | CabNews MAJ 06h |
| Midi | 12:00 | CabNews MAJ 12h |
| Après-midi | 16:00 | CabNews MAJ 16h |

Chaque passe doit : balayer les 26 bureaux, intégrer les nouveaux flux, mettre à jour `LAST_CRAWL` (date + heure Paris), pousser le repo, et rendre l’horodatage visible dans l’UI.

## Travaux produit / tech restants

1. **Pipeline de collecte** réel (sources officielles + titres SA + presse) → écriture structurée des puces.
2. **UI « Dernière MAJ »** claire (header + page Sources), fuseau Paris.
3. **Mobile / PWA** : navigation pouce, brief du jour en premier, semaine en second.
4. **Filtres bureau** partageables (`?bureau=`).
5. Déploiement automatique après chaque push (Grok Build et/ou autre hébergeur).

## Liens

- Site : https://cabnews.grok.me/
- Drive idées Jeanne : https://drive.google.com/drive/folders/1tL7jXs-IRqG7V2vC21OdaNDiLT9n335I
- Doc fonctionnalités : `docs/FONCTIONNALITES.md`
