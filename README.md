# Atlas UI (Lane C)

Spanish pilot chat UI for Grupo UMA. Ships with a mock API; point at R2R with one env var.

## Run locally

```bash
cd ~/projects/atlas-ui
npm install
cp .env.example .env.local   # optional — mock works without it
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Converge on R2R (one line)

Client always calls `POST /api/ask`. The route proxies to R2R when configured:

```bash
# .env.local or Vercel → Settings → Environment Variables
R2R_BASE_URL=http://127.0.0.1:7272
```

No change to `src/lib/config.ts` — `ATLAS_API` stays `/api/ask`.

R2R response mapping lives in `src/lib/r2rAdapter.ts` (`mapR2RToAskResponse` → `{ answer, citations, validUntil, noAnswer }`).

## Mock API (default)

`POST /api/ask` — body: `{ query, agent, country }`

Returns `noAnswer: true` when the query contains `precio` or `inventario`.

## Deploy

Vercel-ready. Connect [github.com/eldeguate/atlas-ui](https://github.com/eldeguate/atlas-ui) and deploy with no extra config for the mock demo.