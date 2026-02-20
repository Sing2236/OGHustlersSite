# OG Hustlers Payload CMS

This app is the content-admin backend for the public Expo site.

## What it manages

- `site-settings` (brand name, tagline, support contact, hero copy)
- `products` (name, category, price, availability)
- `stores` (address, phone, hours, maps URL)
- `news` (publishable updates / announcements)
- `pages` (editable website page content blocks)

All content is stored in Supabase Postgres using Payload's Postgres adapter.

## 1) Environment

Create `cms/.env` from `cms/.env.example` and set:

- `PAYLOAD_SECRET`
- `PAYLOAD_DATABASE_URI` (or `SUPABASE_DB_URL`)
- `NEXT_PUBLIC_SERVER_URL`
- `PAYLOAD_DB_SSL_NO_VERIFY` (set `true` only if your network injects self-signed TLS certs)

Use your Supabase Postgres connection string, for example:

`postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require`

## 2) Install and run

```bash
cd cms
npm install
npm run dev
```

Admin UI:

`http://localhost:3001/admin`

First run will prompt you to create the initial admin user.

## 3) Production workflow

1. Edit content in Payload admin.
2. Payload writes directly to Supabase Postgres.
3. Public site reads this content via Payload REST API (`/api/*`).
