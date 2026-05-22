# Performance static audit (Plan v24 Block 12)

Generated 2026-05-22T03:39:03.587Z.

## Force-dynamic routes

3 routes opt out of static / edge caching:

- `./src/app/admin/anomalies/page.tsx:12`
- `./src/app/admin/review/page.tsx:15`
- `./src/app/status/page.tsx:10`

**Implication**: each force-dynamic route runs server-side on every
request. They bypass the edge cache headers in middleware.ts and
add latency proportional to the rendered work. Consider migrating
to revalidate-based ISR where possible (Plan v17 phase 4.3 already
did most of this).

## Top dependencies by disk size

| Package | Size |
|---|---:|
| next | 133.2 MB |
| @phosphor-icons/react | 31.5 MB |
| typescript | 22.5 MB |
| react-dom | 7.0 MB |
| tailwindcss | 5.3 MB |
| @sentry/nextjs | 2.7 MB |
| @types/node | 2.3 MB |
| simple-statistics | 1.1 MB |
| @supabase/supabase-js | 0.5 MB |
| @types/react | 0.4 MB |
| postcss | 0.2 MB |
| autoprefixer | 0.2 MB |
| react | 0.2 MB |
| gray-matter | 0.0 MB |
| @types/react-dom | 0.0 MB |

## Static chunks total

Total `.next/static/chunks` size: **1485.2 KB**

(Detailed per-route First Load JS sizes are in the `next build`
output; not parsed here.)

## Next steps

- Run Lighthouse on the top 10 cell URLs to capture LCP / CLS / INP.
- Bundle-analyze (`@next/bundle-analyzer`) per-route.
- Measure Sentry source-map injection overhead in production.
