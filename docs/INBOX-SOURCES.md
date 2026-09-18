# CabNews — source inbox (open feeds)

Mechanical collection of **open** institutional feeds into `inbox/sources/`.  
**No LLM** in GitHub Actions. Grok Bot remains editor-in-chief for the MAJ routines (06:00 / 12:00 / 16:00 Europe/Paris).

## Why

Reduce rediscovery tokens: Bot reads a fresh snapshot of titles/URLs/summaries instead of re-crawling the same official sites every MAJ.

## Read order (Bot)

1. **Always start with** [`inbox/sources/LATEST.json`](../inbox/sources/LATEST.json) — duplicate of the latest stamped snapshot.
2. Optionally open the matching stamped file `inbox/sources/YYYY-MM-DDTHH-mm-Paris.json` if you need an older run (kept ≤ 14 days).
3. Treat items as **raw input only**: select, verify, and rewrite for editorial quality. Do not paste blindly into `src/data/*`.

## Snapshot shape

```json
{
  "schemaVersion": 1,
  "generatedAt": "2026-09-18T10:00:00.000Z",
  "generatedAtParis": "2026-09-18T12-00-Paris",
  "timezone": "Europe/Paris",
  "sources": [
    { "id": "insee-publications", "ok": true, "itemCount": 20, "url": "…" }
  ],
  "itemCount": 42,
  "items": [
    {
      "id": "insee-publications:a1b2c3d4e5f60718",
      "title": "…",
      "url": "https://…",
      "source": "insee-publications",
      "fetchedAt": "2026-09-18T10:00:00.000Z",
      "summary": "optional short text"
    }
  ]
}
```

## Schedule

Workflow [`.github/workflows/cabnews-inbox.yml`](../.github/workflows/cabnews-inbox.yml):

| Mode | When |
|------|------|
| cron (UTC) | `45 3,9,13 * * *` |
| CEST (UTC+2) Paris | ≈ **05:45 / 11:45 / 15:45** (primary) |
| CET (UTC+1) Paris | ≈ 04:45 / 10:45 / 14:45 (1h early vs target) |
| manual | `workflow_dispatch` |

Precedes Bot MAJs so `LATEST.json` is warm before 06 / 12 / 16 Paris.

## Local run

```bash
npm run inbox:fetch
```

Writes under `inbox/sources/` (Node 20+, native `fetch`, no extra deps).

## Allowlist (curated)

Stable open sources first; soft-fail per source (one dead feed does not fail the job if ≥1 source succeeds).

| id | Notes |
|----|--------|
| `insee-flux-national` | Insee RSS `/fr/flux/1` |
| `insee-publications` | Insee RSS `/fr/flux/2` |
| `senat-presse` | Sénat communiqués RSS |
| `info-gouv` | info.gouv.fr actualités RSS |
| `ecb-press` | BCE press RSS |
| `economie-presse` | Light HTML listing scrape (WordPress feed is 403) |
| `bdf-actualites` | Light HTML via `data-href` cards |
| `vie-publique-rss` | Often bot-gated — soft-fail |
| `assemblee-rss` | Often 404 — soft-fail |

Assemblée / Sénat **calendar** feeds and Vie publique / service-public are unstable from Actions egress; kept as soft-fail probes when present, not hard requirements.

## Anti-loop

Commits touch **only** `inbox/` with message `… [skip ci]`. Push path filters ignore inbox-only noise for this workflow’s `push` trigger (schedule + dispatch + script/workflow changes only).


## Activer le workflow GitHub Actions (one-shot)

Le fichier runtime attendu est `.github/workflows/cabnews-inbox.yml`.

Le PAT `gh` actuel n’a **pas** le scope **`workflow`**, donc impossible de pousser ce chemin via API/git depuis Bot.
Copie officielle versionnée : [`docs/cabnews-inbox.workflow.yml`](./cabnews-inbox.workflow.yml).

**Activation (une fois), en local avec un token `workflow` :**

```bash
mkdir -p .github/workflows
cp docs/cabnews-inbox.workflow.yml .github/workflows/cabnews-inbox.yml
git add .github/workflows/cabnews-inbox.yml
git commit -m "ci(inbox): enable cabnews-inbox Action"
git push origin main
```

Ou GitHub UI → Add file → créer `.github/workflows/cabnews-inbox.yml` (compte MaxenceLandais) en collant le contenu du template.

Ensuite : Actions → **cabnews-inbox** → **Run workflow**.

