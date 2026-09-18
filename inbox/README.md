# inbox/

Raw open-source snapshots for CabNews MAJ enrichment.

- **`sources/`** — JSON dumps from `npm run inbox:fetch` / GitHub Action `cabnews-inbox`
- Prefer **`sources/LATEST.json`** (see [`docs/INBOX-SOURCES.md`](../docs/INBOX-SOURCES.md))
- Stamped files older than 14 days are pruned by the fetch script
- Not editorial content — Bot curates into `src/data/*`
