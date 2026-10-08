# Margin Atlas — Architecture

Orient yourself in 10 minutes. Read this before touching code.

---

## Three layers

```
┌──────────────────────────────────────────────────────────────────┐
│  PRESENTATION                                                     │
│    src/app/         App Router routes (count: CLAUDE.md block)   │
│    src/components/  ui/ (system), spine/ (the page bodies)       │
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

Rewritten by the checkup of 2026-10-08: until then this section described the page of May
(`KeyBenchmarkBanner`, `DenseCellHero`, `AnnualCostStack`), which the route no longer draws.

1. The route decides whether the page draws locked: `isPaywallOn()` and
   `lockablePath()` (`src/lib/monetization/pro_route.ts`; UK pages only, his
   rulings 18 and 27). A page is cached for every reader, so it never knows the
   reader; the middleware sends a signed-in reader to the uncached `/pro` mirror.
2. `renderCellRoute()` (`cell_spine.tsx`, beside the page) builds the page's data
   with `buildSpineCellSeed()` (`src/lib/spine/adapt_cell.ts`), which reads the
   cell through `getCellBySlug()` in `src/lib/cells.ts` (the fallback chain:
   `cells_master`, then `regional_cells`, then `extrapolated_cells`, then
   `synthesizeCell()`) with the fact shards and the finance engines. No cell,
   `notFound()`.
3. `SpineCellBody` (`src/components/spine/cell/cell-view.tsx`) draws the page
   from that seed, its sections built on the archetypes in
   `src/components/spine/archetypes/`; a locked level draws a stand-in, never
   its figures (`src/components/spine/LockedSection.tsx`,
   `src/lib/monetization/levels.ts`).

The page body of May still sits below the spine branch in `page.tsx`, reached
only when `NEXT_PUBLIC_SPINE_REFORM_CELL=0` turns the spine off.

## Quality gates

The gate chain (`GATES` in `scripts/prebuild_all.ts`; its count in the generated block of
`CLAUDE.md`; each gate's header sentence and reads in the generated `scripts/gates.json`)
runs before every build: on Vercel through npm's prebuild hook, locally with
`npm run verify:deploy`. Its timings, local and on Vercel, are measured in the newest
`docs/checkup/<date>.md`, never typed here. Each gate enforces one invariant, for example:

- `verify_taxonomy` — industry IDs match the registry
- `verify_no_em_dashes` — no em-dashes in user-visible source
- `verify_no_source_agencies` — no source agency names in UI (R-002)
- `find_dead_links --strict` — every href resolves
- `verify_cost_share_invariant` — cost shares sum to ~1
- `verify_au_industry_map` — every ATO industry maps to a real MA ID
- `verify_layering` — presentation never imports from `data/` directly
- ... and the rest, listed with what each asserts in `scripts/gates.json`.

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
| Prebuild chain | `scripts/prebuild_all.ts` (`GATES`), its registry `scripts/gates.json` |
| Data fidelity audit | `docs/strategy/2026-05-26-data-fidelity-audit.md` |
| Architecture audit | `docs/strategy/2026-05-27-architecture-audit.md` |

## Known debt (and where it's documented)

- **`cells.ts` is one of the largest domain files** (its size and the
  other files over 1,000 lines are measured in the newest checkup ledger;
  the 1,146 typed here in May had become 1,503 by 2026-10-08).
  `cells/geo.ts` and `cells/time_series.ts` are extracted;
  the deeper split of `lookup.ts` / `synthesis.ts` / `variants.ts`
  is deferred because those functions share private helpers that
  need an `_internal.ts` module first. `cells.ts` stays as a thin
  re-export so its many importers don't break.
- **Grandfathered layering violations** in the layering gate's
  allowlist (`scripts/verify_layering.ts`, which prints how many). Each
  is a page or component that imports `data/*.json` directly. An entry
  only shrinks: since 2026-10-08 an entry whose file is gone or clean
  is a red.
- **The prebuild chain** (`scripts/prebuild_all.ts`): parallel at
  concurrency 4 by default (Vercel), serial on this 8 GB machine
  (`npm run prebuild:serial`, or `npm run verify:deploy` to a file).
  Timings in the newest checkup ledger.

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

- **Supabase indexes**: `db/migrations/2026-05-27-perf-indexes.sql`
  was APPLIED on 2026-06-02 (CLAUDE.md, "Manual actions outstanding";
  until 2026-10-08 this line still said "not yet applied"). If high CPU
  or timeouts recur, check the indexes still exist before anything else.
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
