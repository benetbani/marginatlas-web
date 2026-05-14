# Margin Atlas — Website prototype

Next.js 15 (App Router) + Supabase + Tailwind. Wired to the existing Supabase free tier
(US state cells already loaded, 722k rows).

## Stack

- Next.js 15.0.3 (App Router, ISR)
- React 19 RC
- Tailwind CSS 3.4 + custom Tesseract palette
- Supabase JS 2.45
- TypeScript 5

## Architecture

```
src/app/
├── layout.tsx                       Root layout (header, footer, fonts)
├── globals.css                      Tailwind + design tokens
├── page.tsx                         Home (hero, stats, sample cells)
├── pricing/page.tsx                 4-tier pricing (Free / $38 / $78 / $150+)
├── methodology/page.tsx             Sources + tier definitions
├── sitemap.ts                       Auto-generated from cells_master_global
└── [country]/[geo]/[industry]/
    └── page.tsx                     ★ THE TEMPLATE — drives 500k+ pages

src/lib/
├── supabase.ts                      Browser + admin clients
└── cells.ts                         Data-access layer (getCellBySlug, etc.)
```

## How 500k pages work

**One template file** at `src/app/[country]/[geo]/[industry]/page.tsx` handles every cell URL.

```
URL  : /us/california/restaurants
       ↓ Next.js dynamic params resolution
File : app/[country]/[geo]/[industry]/page.tsx
       ↓ getCellBySlug() in lib/cells.ts
DB   : Supabase query
       ↓ ISR cache (7-day revalidate)
HTML : Pre-rendered, cached at edge
```

Updates:
1. Update `cells_master_global` in Supabase
2. ISR cache expires (7 days) or you manually revalidate
3. Page auto-re-renders with fresh data
4. No manual page editing, ever

## Run locally

```bash
cd E:\atlas\website
cp .env.local.example .env.local      # Already done
npm run dev                            # http://localhost:3000
```

Then visit:
- http://localhost:3000/ — home
- http://localhost:3000/pricing — pricing tiers
- http://localhost:3000/methodology — methodology
- http://localhost:3000/us/california/restaurants — a cell page

## Build for production

```bash
npm run build      # static + ISR builds
npm run start      # serve production build locally
```

## Deploy to Vercel

```bash
npx vercel deploy
# or
npx vercel --prod
```

Vercel auto-detects Next.js. Add env vars in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Current data source

The prototype reads from `us_cells_state_master` (already in Supabase free tier).
When `cells_master_global.parquet` is loaded into Supabase Pro, update `lib/cells.ts`
to query `cells_master_global` for full 40+ country coverage.

## What's NOT yet wired (Phase F2+)

- Auth flow (magic link / Google / GitHub)
- Stripe checkout
- Search/filter UX
- Export to CSV/Excel
- AI query layer
- All 500k SEO pages pre-rendered (currently only on-demand)
- API endpoints (Enterprise tier)

These wait for **Supastarter purchase** ($300 one-time) which provides the auth +
billing scaffolding. The current prototype proves the page architecture works.

## Performance budget (target)

- TTFB ≤ 2s cold, ≤ 1s warm
- Lighthouse 95+ on home + pricing
- All cells generate in ≤ 500ms on cold ISR

## Design rules (from CLAUDE.md)

- Background: `#F7FAFC` (ink-50)
- Text: `#0A2540` / `#093877` / `#153457` (ink palette)
- Accent: aquamarine gradient `#35BFD0 → #7EE3EB → #B7F6F8`
- Product name "Margin Atlas" uses `.gradient-name` class
- Rounded corners refined, shadows subtle, no cartoonish UI
- Mobile-first responsive
