# OG Hustlers React Native Website

This project is a React Native (Expo + Web) website for a store with:

- Contact information tab
- Store locator tab for all stores
- Prices tab for products
- Supabase integration for live data
- Supabase migration-based database initialization

## Run locally

```bash
npm install
npm run web
```

## Environment setup

A `.env` file is included with established variables:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_SUPABASE_CONTACT_TABLE=contact_info
EXPO_PUBLIC_SUPABASE_STORES_TABLE=stores
EXPO_PUBLIC_SUPABASE_PRODUCTS_TABLE=products
```

Replace URL and anon key with your real Supabase project values.

To initialize the remote Supabase database, set:

```env
SUPABASE_DB_URL=postgresql://postgres:password@db.your-project-ref.supabase.co:5432/postgres
```

Then run:

```bash
npm run db:init
```

## Supabase table fields expected

- `contact_info`: `name`, `tagline`, `support_email`, `support_phone`
- `stores`: `id`, `name`, `address`, `phone`, `hours`, `maps_url`
- `products`: `id`, `name`, `price`

If Supabase is not configured or a query fails, the app uses local fallback data.
