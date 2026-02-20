# OG Hustlers Site

Professional Expo web storefront with a Payload CMS admin backend and Supabase Postgres storage.

## Architecture

- `App.js` (Expo web frontend shown to customers)
- `cms/` (Payload CMS admin for owner/staff editing)
- Supabase Postgres (database for Payload collections)
- Supabase CLI via `npx supabase` for DB workflows

## What can be edited in CMS

- Products and vape pricing
- News posts
- Page content blocks
- Store locations/hours
- Site settings (brand, tagline, support, promo bar text)

## Environment setup

Create `.env` from `.env.example` in the repo root.

Create `cms/.env` from `cms/.env.example`.

Important:

- Use your Supabase **publishable** key in `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Keep `SUPABASE_SECRET_KEY` server-side only (never `EXPO_PUBLIC_*`).
- Set `SUPABASE_DB_URL` / `PAYLOAD_DATABASE_URI` with your real DB password.

## Local development

Frontend:

```bash
npm install
npm run web
```

CMS:

```bash
npm run cms:install
npm run cms:dev
```

CMS admin runs at:

`http://localhost:3001/admin`

Set frontend CMS API target with:

`EXPO_PUBLIC_CMS_URL=http://localhost:3001`

## Supabase CLI

Check CLI:

```bash
npm run supabase:version
```

Push SQL migrations in `supabase/migrations`:

```bash
npm run db:init
```

Or use linked-project flow:

```bash
npm run db:init:cli
```

## GitHub Pages deployment

Build static export + prepare `docs/`:

```bash
npm run build:pages
```

Automatic deploy workflow:

- `.github/workflows/deploy-pages.yml`
- Runs on push to `main`
- Publishes built `docs/` artifact to GitHub Pages
