# Deployment (Vercel + Railway)

This repository is set up so the **Next.js frontend** deploys to **Vercel**, while a **PostgreSQL database** (or other Railway services) lives on **Railway**. Content for pages and sermons still comes from **Sanity**; Railway is for relational data when you add it (for example Prisma or Drizzle using `DATABASE_URL`).

## Prerequisites

- [Node.js](https://nodejs.org/) 22.x (see `.nvmrc`; matches CI).
- [Vercel CLI](https://vercel.com/docs/cli): `npm i -g vercel`
- [Railway CLI](https://docs.railway.com/develop/cli): `npm i -g @railway/cli`

## One-time: Railway Postgres

Run these from any directory (Railway is account-scoped; you can link a new project for this church app).

```bash
railway login
railway init
# In the Railway dashboard: New → Database → PostgreSQL, or:
railway add
# Select PostgreSQL when prompted (CLI varies by version).
```

Copy the **`DATABASE_URL`** (or `POSTGRES_URL`) from the Railway service **Variables** tab. You will paste it into Vercel when the application code reads it (see below).

**Private networking:** If later you run a backend on Railway in the same project, you can use the internal URL for lower latency; for Vercel-hosted Next.js, use the **public** `DATABASE_URL` Railway provides unless you use a tunnel or separate API.

## One-time: Vercel project

From the **repository root**:

```bash
vercel login
vercel link
```

Choose your team and create or link the project. Production branch should be `main` (default in Vercel).

## Environment variables on Vercel

In the Vercel dashboard: **Project → Settings → Environment Variables**, add every variable your deployment needs. Copy names from [`.env.example`](.env.example) at minimum:

| Variable | Where it comes from |
|----------|---------------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity project |
| `NEXT_PUBLIC_SITE_URL` | Your production URL, e.g. `https://www.your-church.org` |
| `XAI_API_KEY` | xAI console |
| Optional chat/TTS/vector keys | See `.env.example` |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Optional; enables **shared** rate limits across Vercel function instances |
| `SANITY_WEBHOOK_SECRET` | Secret you define; must match the webhook in Sanity Manage |
| `DATABASE_URL` | Railway Postgres **when** you add server-side DB usage |

Set each for **Production** (and Preview if you use preview deployments).

### Sanity webhook (sermon vectors)

When you use Upstash Vector + `OPENAI_API_KEY`, add a webhook in [Sanity Manage](https://www.sanity.io/manage) → your project → **API** → **Webhooks**:

- **URL:** `https://<your-production-domain>/api/sanity/webhook`
- **Dataset:** same as `NEXT_PUBLIC_SANITY_DATASET`
- **Secret:** generate a long random string; set the same value as `SANITY_WEBHOOK_SECRET` on Vercel
- **Filter:** restrict to sermon document types you index (for example `_type == "sermon"` if that matches your schema), or leave unfiltered only if you accept any document firing the handler

The route verifies the payload with `@sanity/webhook` and re-indexes or deletes vectors for the affected sermon. Without `SANITY_WEBHOOK_SECRET`, the route rejects unsigned requests.

Pull locally after saving (optional):

```bash
vercel env pull .env.local
```

## Deploy frontend (terminal)

**Production:**

```bash
vercel --prod
```

**Preview (branch / PR):**

```bash
vercel
```

`vercel.json` pins `installCommand` to `npm ci` and `buildCommand` to `npm run build` so Vercel matches local and CI behavior.

## CI (GitHub Actions)

Pushes to `main` / `master` and pull requests run lint and build (`.github/workflows/ci.yml`). Vercel can still auto-deploy from GitHub if you connect the repo in the Vercel dashboard (recommended); the CLI is for manual or scripted deploys.

## Railway CLI quick reference

```bash
railway status
railway variables
railway connect postgres   # optional: local psql tunnel (CLI version dependent)
```

## Notes

- This app **does not** read `DATABASE_URL` yet. Adding Prisma/Drizzle or server routes that use Postgres is a separate change; until then, Railway is ready but unused by the Next.js code.
- **Sanity Studio** in this repo (`/studio`) deploys with the same Vercel project unless you split it; ensure `NEXT_PUBLIC_*` Sanity vars are set on Vercel.
