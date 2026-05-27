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

- **`cells.ts` is 1,321 lines**, scheduled for decomposition into
  `cells/lookup.ts`, `cells/synthesis.ts`, `cells/variants.ts`,
  `cells/time_series.ts`, `cells/geo.ts`. The file currently stays as
  a thin re-export so 32+ external imports don't break.
- **13 grandfathered layering violations** in the layering gate's
  allowlist. Each is a page or component that imports `data/*.json`
  directly. Migration is a separate cleanup wave.
- **145 "Plan v / Phase / Sprint" comments** are project-management
  noise polluting engineering documentation. Mechanical sweep
  pending.
- **Prebuild chain runs serially** (~60s). Parallelisation drops
  this to ~15s.

See `docs/strategy/2026-05-27-architecture-audit.md` for the full
audit + refactoring roadmap.
