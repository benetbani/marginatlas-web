# Margin Atlas — Architecture

Orient yourself in 10 minutes. Read this before touching code.

---

## Three layers

```
┌──────────────────────────────────────────────────────────────────┐
│  PRESENTATION                                                     │
│    src/app/         46 Next.js routes (App Router)               │
│    src/components/  87 components                                │
│                                                                   │
│    RULE: presentation MUST NOT import from data/ directly.       │
│    All data access goes through src/lib/. Locked by              │
│    scripts/verify_layering.ts.                                   │
└──────────────────────────────────────────────────────────────────┘
                            ↑ imports
┌──────────────────────────────────────────────────────────────────┐
│  DOMAIN                                                           │
│    src/lib/cells.ts          Cell lookup + fallback chain        │
│    src/lib/cost_engine/      Per-line cost computation           │
│    src/lib/economic_profile/ Wages, FX, AU primary data          │
│    src/lib/cells/            Synthesis, time-series, geo, etc.   │
│    src/lib/qa/               Plausibility, SMB bounds            │
│    src/lib/finance/          Cost profile, turnover bands, FX    │
│    src/lib/cities/           City + neighborhood resolution      │
│    src/lib/taxonomy/         Industry + sector classification    │
│    src/lib/feature_flags.ts  Centralised flag accessors          │
│    src/lib/types/index.ts    Re-export every domain type         │
└──────────────────────────────────────────────────────────────────┘
                            ↑ imports
┌──────────────────────────────────────────────────────────────────┐
│  DATA                                                             │
│    data/external/      Raw World Bank CSVs                       │
│    data/economics/     Wages, COL, AOV, etc.                     │
│    data/cities/        City list, signatures, neighborhoods      │
│    data/finance/       Cost profile, turnover bands, ATO         │
│    data/content/       Pre-generated narrative cache             │
│    data/quality/       Audit reports + verified anchors          │
│    Supabase tables:                                               │
│      cells_master, extrapolated_cells, regional_cells,           │
│      cost_stack, sub_industries, local_aliases                   │
└──────────────────────────────────────────────────────────────────┘
```

## How a cell page renders

`/[country]/[geo]/[industry]` → `src/app/[country]/[geo]/[industry]/page.tsx`

1. `getCellBySlug(country, geo, industry)` in `src/lib/cells.ts` walks the
   fallback chain: `cells_master` → `regional_cells` → `extrapolated_cells`
   → `synthesizeCell()`. Returns a `Cell`.
2. `fillMissingFields()` in `src/lib/cells/fill_defaults.ts` populates
   any null derived fields (margins, percentiles, employee counts).
3. `enforceSanity()` → `applyPlausibilitySuppression()` in
   `src/lib/qa/plausibility_suppression.ts` nulls catastrophically
   implausible values (e.g., $1B/firm Liechtenstein furniture).
4. `estimateCostStructure()` in `src/lib/cost_engine/engine.ts` computes
   the cost breakdown. For AU cells with primary-data coverage, it
   reads `getAuPrimaryAnchor()` and uses ATO ratios instead of modelled
   values.
5. The page renders ~12 sections (`KeyBenchmarkBanner`, `DenseCellHero`,
   `RevenueDistribution`, `AnnualCostStack`, ...). Each section reads
   the resulting `Cell` and any contextual data from the domain layer.

## Quality gates

25 prebuild scripts run before every build (~60s wall-clock, currently
serial). Each gate enforces one invariant:

- `verify_taxonomy` — industry IDs match the registry
- `verify_no_em_dashes` — no em-dashes in user-visible source
- `verify_no_source_agencies` — no source agency names in UI (R-002)
- `find_dead_links --strict` — every href resolves
- `verify_cost_share_invariant` — cost shares sum to ~1
- `verify_au_industry_map` — every ATO industry maps to a real MA ID
- `verify_layering` — presentation never imports from `data/` directly
- ... 18 more

Full list in `package.json` → `prebuild`.

## Adding a new feature

1. **Domain logic** lives in `src/lib/<area>/`. Never put it in a component.
2. **Types** go in their canonical home + re-export from `src/lib/types/index.ts`.
3. **Feature flags** go in `src/lib/feature_flags.ts`. Never read `process.env.*` directly from a component.
4. **Currency rates** go in `src/lib/finance/fx.ts`. Never hardcode an FX rate inline.
5. **New data files** go under `data/`. Add a verify gate for their integrity.
6. **New section on the cell page** registers in the page-layout section registry.
7. **Always** wire a verify gate when you add a data file or a new invariant.

## Key constraints

- **No source-agency names in UI** (R-002). Eurostat, BLS, ATO etc. never appear in user-facing copy. Prebuild gate enforces.
- **No em-dashes in user-visible source** (R-020). Comma, period, or colon instead. Prebuild gate enforces.
- **600MB RAM ceiling** for build-time scripts. Stream, don't load.
- **Renaming URL slugs costs months of SEO equity.** Add new URLs alongside; never rename.

## Where things live

| Need to find... | Look in |
|---|---|
| The `Cell` type | `src/lib/cells.ts` (re-exported from `src/lib/types/index.ts`) |
| Cost-engine logic | `src/lib/cost_engine/engine.ts` |
| Country economic profile | `src/lib/economic_profile/` |
| Wage data | `src/lib/economic_profile/wages.ts` (country) + `city_wages.ts` (city) |
| AU primary-data override | `src/lib/economic_profile/au_primary_loader.ts` |
| Industry / sector registry | `src/lib/taxonomy.ts` + `src/lib/taxonomy/` |
| City resolver | `src/lib/cities.ts` + `src/lib/cities/` |
| Cell-page route | `src/app/[country]/[geo]/[industry]/page.tsx` |
| Prebuild chain | `package.json` → `prebuild` |
| Data fidelity audit | `docs/strategy/2026-05-26-data-fidelity-audit.md` |
| Architecture audit | `docs/strategy/2026-05-27-architecture-audit.md` |

## Known debt (and where it's documented)

- **`cells.ts` is 1,146 lines** (down from 1,321 after the 2026-05-27
  audit). `cells/geo.ts` and `cells/time_series.ts` are extracted;
  the deeper split of `lookup.ts` / `synthesis.ts` / `variants.ts`
  is deferred because those functions share private helpers that
  need an `_internal.ts` module first. `cells.ts` stays as a thin
  re-export so 32+ external imports don't break.
- **14 grandfathered layering violations** in the layering gate's
  allowlist (`scripts/verify_layering.ts`). Each is a page or
  component that imports `data/*.json` directly. Migration is a
  separate cleanup wave.
- **Prebuild chain is parallel now** (`scripts/prebuild_all.ts`,
  shipped 2026-05-27): ~28s for 25 gates, down from ~60s serial.
  The old chain is still available as `npm run prebuild:serial` for
  debugging.

See `docs/strategy/2026-05-27-architecture-audit.md` for the full
audit + refactoring roadmap.

## Scale checklist (where we are vs. millions of users)

What's already in place — no action needed:

- **Edge caching** via middleware `Cache-Control: public, s-maxage=21600,
  stale-while-revalidate=86400` on every deterministic public route
  (homepage, cells, cities, sectors, industries, learn, methodology,
  country + state landings, neighborhood pages). Every cache HIT after
  the first bypasses the function entirely.
- **ISR** via `export const revalidate = N` on each page — 6h on the
  cell page, 12h on neighborhood, 24h on the homepage. Backstop for
  edge-cache eviction.
- **Region pinning**. Vercel functions pin to `fra1`; Supabase Pro is
  in `eu-west-1`. Round-trip stays <20ms.
- **Static prerender** of the top 500 cells via `generateStaticParams`.
  These never hit the function on a cold request.
- **Layering enforcement** via `verify_layering.ts` keeps presentation
  out of `data/*.json` so the runtime path is predictable.
- **Rate limit map is bounded** (`src/middleware.ts` BUCKET_HIGH_WATER)
  so a long-lived Edge runtime instance won't OOM under sustained
  unique-IP traffic.

What's pending — apply before serious traffic:

- **Supabase indexes** — `db/migrations/2026-05-27-perf-indexes.sql`
  is staged but not yet applied. Without them, `getNudgeNeighbor`
  and `getSameIndustryAcrossStates` time out at the 4s budget on
  ~3% of cell-page renders. After applying, those queries drop to
  ~30-80ms and the timeouts disappear. Run in the Supabase SQL
  Editor one statement at a time (CONCURRENTLY can't be wrapped
  in a transaction). See the file header for expected per-query
  speedups.
- **Runtime slow-query observability**. `withBudget` logs to
  `console.warn` on timeout; that ends up in Vercel function logs
  but isn't aggregated. Sentry is already installed
  (`@sentry/nextjs`); wiring `withBudget` to also emit a
  `Sentry.captureMessage` on timeout would give an alertable
  dashboard. Two-line change in `src/lib/cells.ts`.
- **Distributed rate-limit**. The in-memory `BUCKET` is per-Edge-
  runtime-instance. Vercel may run multiple instances under load;
  each has its own counter so the true rate limit is
  `PAGE_LIMIT × instance_count`. For consistent enforcement,
  swap for Upstash Redis (free tier handles thousands of req/s)
  and use `Pipeline.incr` with a TTL. Only worth it once we
  measurably hit the 60/min limit on a real user.

What's overkill — don't build yet:

- Read replicas, sharding, GraphQL layer, k8s, message queue.
  Supabase Pro on a properly-indexed cells_master handles
  100M+ queries/day without breaking a sweat. We're nowhere near
  the wall.
