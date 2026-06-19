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
# .env.local
R2R_BASE_URL=http://127.0.0.1:7272
R2R_USERNAME=<ingest-owner email from Codex>
R2R_PASSWORD=<password from Codex>
```

Auth flow: `POST /v2/login` (form) → `POST /v2/rag` with `Authorization: Bearer …`. The client auto re-logins on 401.

If username/password are omitted, the adapter calls `/v2/rag` without Bearer (works on today's local R2R; use creds when auth is enforced).

No change to `src/lib/config.ts` — `ATLAS_API` stays `/api/ask`.

Contract: `docs/LANE_C_WIRING.md` in `atlas-rag`. Mapping in `src/lib/r2rAdapter.ts`.

## Mock API (default)

`POST /api/ask` — body: `{ query, agent, country }`

Returns `noAnswer: true` when the query contains `precio` or `inventario`.

## Deploy

Vercel-ready. Connect [github.com/eldeguate/atlas-ui](https://github.com/eldeguate/atlas-ui) and deploy with no extra config for the mock demo.