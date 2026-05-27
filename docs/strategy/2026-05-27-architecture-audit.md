# Architecture audit: senior-engineer walk-in

**Date:** 2026-05-27
**Auditor stance:** Senior engineer who just joined the team. Read the code cold. No prior knowledge of "Plan v32 Sprint G" or "Phase 0Q" allowed.
**Constraint:** Do not change functionality. Only upgrade quality, scalability, maintainability.

---

## Part 1 — Architecture as it stands today

### 1.1 Data flow, end-to-end

```
┌─────────────────────────────────────────────────────────────────┐
│ SOURCES                                                          │
│  - data/external/brain-skeleton/*.csv  (World Bank raw)         │
│  - data/economics/*.json               (curated economic data)  │
│  - data/economic_indicators/*.json     (country profiles)       │
│  - data/cities/*.json                  (city + signature data)  │
│  - data/finance/*.json                 (cost profiles, ATO)     │
│  - data/legal/*.json                   (business formation)     │
│  - data/quality/*.json                 (audit reports)          │
│  - data/content/*.json                 (narratives)             │
│  - Supabase tables:                                             │
│       cells_master, extrapolated_cells, regional_cells          │
│       cost_stack, sub_industries, local_aliases                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ DOMAIN LAYER (src/lib/)                                          │
│                                                                  │
│  cells.ts (1,321 lines)            ← god-module                 │
│   ├ DB lookup (getCellBySlugRaw)                                │
│   ├ Regional / extrapolated fallback chain                      │
│   ├ Plausibility suppression (applyPlausibilitySuppression)     │
│   ├ Sanity (enforceSanity)                                      │
│   ├ Synthesis (synthesizeCell)                                  │
│   ├ Time-series (buildTimeSeries)                               │
│   ├ Variants (getCellVariants)                                  │
│   ├ Cross-country / state lookups                               │
│   ├ Geo-name + US state mapping                                 │
│   ├ Manual city alias overrides                                 │
│   └ Top-industries aggregation passthrough                      │
│                                                                  │
│  cost_engine/engine.ts (524 lines)                              │
│   ├ Country / industry / city-tier modifiers                    │
│   ├ Per-line cost computation (cogs, labour, rent, etc.)        │
│   ├ AU primary-data override (Phase 1d, 2026-05-27)             │
│   ├ Provenance + confidence per line                            │
│   └ Net margin clamp                                            │
│                                                                  │
│  economic_profile/                                              │
│   ├ wages.ts                  (median_monthly_wage source)      │
│   ├ city_wages.ts             (per-city wage premiums)          │
│   ├ industry_medians.ts       (verified industry medians)       │
│   ├ au_primary_loader.ts      (ATO override resolver)           │
│   ├ au_industry_map.ts        (ATO slug → MA industry mapping)  │
│   ├ types.ts                  (CountryEconomicProfile)          │
│   └ index.ts                  (top-level export)                │
│                                                                  │
│  cells/  (six smaller helpers)                                  │
│   ├ fill_defaults.ts          (fillMissingFields + synthesize)  │
│   ├ top_industries_aggregation.ts                               │
│   ├ trend_synthesizer.ts                                        │
│   ├ triage.ts                                                   │
│   ├ country_smb_baseline.json                                   │
│   └ industry_factors.json                                       │
│                                                                  │
│  qa/                                                            │
│   ├ plausibility_suppression.ts  (refactored Phase 4)           │
│   ├ smb_bounds.ts                                               │
│   ├ industry_operating_units.ts                                 │
│   └ industry_baselines.ts                                       │
│                                                                  │
│  extrapolations/                                                │
│   └ fill_missing.ts           (estimate-wage / employee count)  │
│                                                                  │
│  cities/, finance/, content/, monetization/, learn/, geo/,      │
│  tax/, format/, regions/, check/, etc.                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ PRESENTATION (src/app/ + src/components/)                        │
│                                                                  │
│  46 routes:                                                      │
│   /, /[country]/[geo]/[industry], /cities/[slug], /world, etc.  │
│                                                                  │
│  87 components, including:                                       │
│   - KeyBenchmarkBanner, TurnoverBandChip, AuPrimaryDataBadge    │
│   - CitySignaturePanel, CountrySignaturePanel                   │
│   - DenseCellHero, RevenueDistribution, AnnualCostStack         │
│   - 5 specialised sections (TangibleUnits, FailureModes, …)     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ QUALITY GATES (24 prebuild scripts, ~60s wall-clock, serial)     │
│  taxonomy, em-dashes, agencies, dead-links, featured-tiles,     │
│  render-guards, deepening, monetization, v34-research, internal │
│  notes, top-industries plausibility, useless-tiles, typography, │
│  signature, cost-share invariant, key-benchmark assignment,     │
│  comparative voice, turnover bands, wage SoT, city wages,       │
│  industry medians, econ-profile integrity, AU industry map,     │
│  AU primary anchor render                                       │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Routes and their domain dependencies

- **Country pages** (`/[country]`) read `country_profile_v2.json`, signature, city list, neighborhoods.
- **City pages** (`/cities/[slug]`) read `city_list_v1.json` directly + signature + neighborhoods.
- **Cell pages** (`/[country]/[geo]/[industry]`) are the heaviest surface: 57 imports, ~12 sections, every domain module reaches here.
- **/check** is a stand-alone client tool wired to `check/verdict_engine.ts`.
- **/world** + **/coverage** are map-driven indexes.

### 1.3 Build / runtime split

- **Build-time:** 24-gate prebuild verifies data integrity, ~60s serial.
- **Run-time:** cell pages compute cost structure on every request via `estimateCostStructure()`. Plausibility, sanity, AU override, comparative-voice generation all happen on the request path.

---

## Part 2 — Critical problem areas (the senior-engineer code smells)

### 2.1 Dual-form modules — the biggest readability tax

Five modules exist as BOTH a top-level `.ts` file AND a same-named subdirectory:

| Top-level file | Subdir | Imports of file | Imports of dir |
|---|---|---|---|
| `src/lib/cells.ts` (1,321 lines) | `src/lib/cells/` (6 files) | 32 | 5 |
| `src/lib/cities.ts` (262 lines) | `src/lib/cities/` (8 files) | ~10 | ~20 |
| `src/lib/tax.ts` (259 lines) | `src/lib/tax/` (12 files) | n/a | n/a |
| `src/lib/images.ts` (152 lines) | `src/lib/images/` (5 files) | n/a | n/a |
| `src/lib/taxonomy.ts` (802 lines) | `src/lib/taxonomy/` (4 files) | n/a | n/a |

A newcomer asks "where does `getCellBySlug` live?" — the answer is `cells.ts`, but `cells/fill_defaults.ts` exists too. They're related but not in a single import-tree. The pattern looks like "started flat, grew into a folder, never moved the original." Every newcomer pays the same tax figuring out which one to read first.

**Maintainability cost:** every fix to a cell concept requires the developer to check both files.

### 2.2 `cells.ts` is a god module

1,321 lines, ~15 distinct responsibilities (DB IO, fallback chain, sanity, synthesis, time-series, variants, cross-country, geo-name, US states, manual aliases, top-industries, …). It's both the gravitational centre of the codebase and the place where every new feature accretes.

**Scalability cost:** every new lookup path adds another responsibility here. The file will be 2,000 lines within months at the current trajectory. Build times suffer (every import of `@/lib/cells` pulls the whole thing into the page bundle).

### 2.3 Presentation imports the data layer directly

Six components / pages bypass the domain layer and read JSON straight from `data/`:

```
src/app/cities/page.tsx        → ../../../data/cities/city_list_v1.json
src/app/countries/page.tsx     → direct JSON imports
src/app/decide/page.tsx        → direct JSON imports
src/components/cities/BusinessFormationCosts.tsx → direct
src/components/cities/CitySignaturePanel.tsx     → direct
src/components/home/TopCitiesMosaic.tsx          → direct
```

**Architectural cost:** the data shape becomes a hard contract for the renderer. A rename in the JSON breaks the component directly. The domain layer (which exists for exactly this reason) gets bypassed for "convenience".

### 2.4 The cell-page file imports 57 modules

`src/app/[country]/[geo]/[industry]/page.tsx` opens with 57 imports. This is fragility — any one of those imports breaking blocks the entire heaviest page on the site. It's also a navigation tax: figuring out "where does this component come from?" is a multi-step lookup every time.

**Refactor target:** the cell page should orchestrate sections via a registry, not by hand-importing each section. The `page-layout/section-registry.ts` exists; it's not driving the cell page.

### 2.5 Internal vocabulary leaking into code comments

**145 comments in src/ reference "Plan v" / "Phase".** Examples seen during this audit: "Plan v32 Sprint G — annual cost stack", "ATO Phase 4 — comparative voice", "v34 Phase C — wire 32 lock placements".

These are project-management artefacts, not engineering documentation. A newcomer reads "Plan v32 Sprint G" and has no idea what that means. They become noise in `git blame`, in code review, and during reading.

**Maintainability cost:** the comment density is high but the signal density is low. The "why" of the code is buried under the "when" of the project.

### 2.6 Feature flags scattered

13 `process.env.*` checks across the codebase. Each is one line, each in a different file:

```
NEXT_PUBLIC_AU_PRIMARY_DATA  → src/lib/economic_profile/au_primary_loader.ts
NEXT_PUBLIC_ACCOUNT_PREVIEW  → src/app/account/page.tsx
COMPARATIVE_VOICE_STRICT     → scripts/verify_comparative_voice.ts
…
```

**Scalability cost:** no single registry. No way to list "which features are flagged on / off in this deploy?" The next feature flag will be the 14th file to grep for.

### 2.7 Hardcoded conversion rates

`au_primary_loader.ts` has `const AUD_PER_USD = 1.5384` hardcoded. There's no central FX module. The next currency that needs conversion will be the second hardcoded value.

**Maintainability cost:** FX rates drift. When the AUD rate moves 3%, someone has to remember to update this single line. There's no gate, no documentation of the source, no "last reviewed" date.

### 2.8 Type definitions scattered across the codebase

Types live in:
- `src/lib/cells.ts` (Cell)
- `src/lib/types/deepening.ts` (CostStack, SetupCosts)
- `src/lib/economic_profile/types.ts` (CountryEconomicProfile)
- `src/lib/cost_engine/engine.ts` (SectorICP, KeyBenchmark — private)
- `src/lib/qa/plausibility_suppression.ts` (PlausibilityFlags)
- `src/lib/check/verdict_engine.ts` (CheckInput, CheckVerdict)
- `src/lib/economic_profile/au_primary_loader.ts` (AuPrimaryAnchor)

**Maintainability cost:** no `src/lib/types/index.ts`. The newcomer has no single index to scan for "what are the domain shapes?"

### 2.9 Quality-gate chain runs serially

24 prebuild scripts run via `&& \` chaining in `package.json`. Wall-clock: ~60s. They're independent — each reads its own files, none depend on another's output.

**Performance cost:** the build is gated by the SUM of script times, not the MAX. A future 30-second script makes every CI run 30s slower for everyone.

### 2.10 The cells.ts → fill_defaults.ts → plausibility_suppression.ts chain is conceptually muddy

Three modules cooperate to produce a "valid" Cell:
1. `getCellBySlug()` in `cells.ts` does the lookup
2. `fillMissingFields()` in `cells/fill_defaults.ts` populates derived values
3. `enforceSanity()` in `fill_defaults.ts` calls `applyPlausibilitySuppression()` in `qa/plausibility_suppression.ts`

The three steps are sequential but their boundaries are unclear. "Sanity" overlaps with "plausibility". "Fill" overlaps with both. The newcomer can't quickly answer "which one nulls out implausible revenue?"

### 2.11 Scripts/ has 93 files across 6 subdirectories with no obvious organising principle

`scripts/` contains:
- 25+ verify scripts (root)
- `scripts/audit/` — 20+ scripts that overlap with verify
- `scripts/data/` — bulk writers
- `scripts/db/` — Supabase-touching scripts
- `scripts/content/` — narrative generation
- `scripts/generate/` — SQL generators
- `scripts/images/` — image import
- `scripts/import/` — bulk SQL ingest

The taxonomy isn't strict — `find_dead_links.ts` is in `scripts/audit/` but it's a prebuild gate. `verify_signature_quality.ts` is in `scripts/` root but is conceptually an audit. New scripts get added wherever feels closest.

---

## Part 3 — Refactoring strategies, ranked by ROI

### Strategy A — **Centralise feature flags** (~30 min, low risk, high readability win)

Create `src/lib/feature_flags.ts` as the single source of truth. Every `process.env.NEXT_PUBLIC_*` check moves through this module. The module exports typed accessors:

```typescript
export function isAuPrimaryDataEnabled(): boolean
export function isAccountPreviewEnabled(): boolean
export function isComparativeVoiceStrict(): boolean
```

New flags get added in one place. The newcomer reading the module gets a complete picture of "what's flagged on / off?"

### Strategy B — **Centralise FX rates** (~30 min, low risk, prevents drift)

Create `src/lib/finance/fx.ts` as the source of truth for currency conversion rates. Every hardcoded rate moves into a single dictionary with `source` + `last_reviewed_at` metadata. The cost engine, AU loader, and any future currency conversion all read from it. Add a quarterly review note to the file.

### Strategy C — **Types index** (~20 min, no risk, navigation win)

Create `src/lib/types/index.ts` that re-exports every domain type. Newcomers do one `cmd-click` to find the shape they're looking for. No imports change.

### Strategy D — **Architecture doc** (~1 hour, no risk, onboarding win)

Write `docs/architecture/README.md` with the diagram from §1.1 above, the layering rules (presentation must not import `data/`), and the convention for new modules. Link it from `CLAUDE.md`. Next newcomer gets oriented in 10 min instead of 2 hours.

### Strategy E — **Parallelise prebuild gates** (~1 hour, low risk, build-time win)

Replace the `&& \`-chained `prebuild` script with a single `scripts/prebuild_all.ts` that runs the gates in parallel via `Promise.all` (each gate is already a self-contained subprocess). Wall-clock drops from ~60s to ~15s.

### Strategy F — **Decompose `cells.ts`** (~1 day, medium risk, biggest long-term win)

Split the god-module along its natural seams:

```
src/lib/cells/
  ├ types.ts             (Cell + selectors)
  ├ lookup.ts            (getCellBySlug + the fallback chain)
  ├ synthesis.ts         (synthesizeCell)
  ├ time_series.ts       (buildTimeSeries)
  ├ variants.ts          (getCellVariants, getSameIndustryAcross*)
  ├ geo.ts               (US-state mapping, friendly aliases)
  ├ fill_defaults.ts     (already exists, expand role)
  └ index.ts             (re-export public API for backward compat)
```

The `cells.ts` file becomes a thin re-export so existing 32 callers don't break. Same public API.

### Strategy G — **Add a layering lint rule** (~1 hour, no risk, prevents future drift)

A new prebuild gate `verify_layering.ts` that asserts:
- `src/app/` and `src/components/` MUST NOT import from `data/` directly
- All data access goes through `src/lib/`

Catches the next layering violation at PR time, not after it ships.

### Strategy H — **Drop "Plan v / Phase" noise from code comments** (~2 hours, no risk, signal density win)

The internal-vocabulary references are noise. Move the project-management history to the strategy docs (already where it belongs); keep the engineering "why" inline. A regex sweep + manual review on 145 lines.

---

## Part 4 — What I'm shipping NOW

Following the constraint ("do not change functionality, only upgrade quality"), I'm shipping the lowest-risk highest-leverage refactors in this audit pass:

1. **A: Feature flags module** — collect all 13 env checks into `src/lib/feature_flags.ts`.
2. **B: FX module** — extract the hardcoded `AUD_PER_USD` into `src/lib/finance/fx.ts` with metadata.
3. **C: Types index** — `src/lib/types/index.ts` re-exporting every domain type.
4. **G: Layering gate** — `verify_layering.ts` to enforce presentation never imports from `data/` directly. **Note:** the 6 existing violations identified in §2.3 will be tolerated initially via an explicit allowlist so we don't break production while doing the cleanup.

**Deferred to next audit cycle** (separate session, more risk):
- D (architecture doc): adjacent but its own writing pass
- E (parallelise prebuild): mechanical, lower urgency
- F (decompose cells.ts): biggest win but biggest risk; deserves its own focused work
- H (drop "Plan v" noise): low-priority cosmetic sweep

All four shipping refactors:
- preserve every existing function signature
- do not touch business logic
- pass the existing 24-gate prebuild
- add 1 new gate (layering), bringing the chain to 25

### Follow-up pass (2026-05-27 evening, same date)

After the four above shipped clean, the deferred strategies D, E, H, and a partial F were executed in sequence:

- **D shipped**: `docs/architecture/README.md` written. Three-layer diagram, cell-page render flow, where-things-live table.
- **E shipped**: `scripts/prebuild_all.ts` is a worker-pool runner (concurrency=6 default). `package.json` `prebuild` script now invokes it. Wall-clock dropped from ~60s serial to ~28s parallel for 25 gates. Old serial chain preserved as `prebuild:serial` for debugging.
- **H shipped**: `scripts/strip_plan_comments.ts` codemod swept src/lib, src/app, src/components. 117 files touched, 240 PM-prefix strips, 1 line dropped. Two "v34 Phase X reverted" sites were manually preserved (the date / revert info is engineering-substantive). Codemod is idempotent.
- **F partially shipped**: `cells/geo.ts` (174 lines) and `cells/time_series.ts` (58 lines) extracted. `cells.ts` dropped from 1,321 → 1,146 lines. Re-exports preserve every call site. The remaining 3 modules (`lookup.ts`, `synthesis.ts`, `variants.ts`) were deferred because the variant + lookup functions share a dense web of private helpers (`applyRollforward`, `applyTaxonomy`, `normalizeRow`, `normalizeRegionalRow`) that would also need an `_internal.ts` module. The "careful upgrade" constraint argued for stopping at the two clean extractions rather than starting the deeply-coupled split this session.

State after the follow-up pass:
- 5 of 8 strategies fully shipped (A, B, C, G, D, E, H)
- 1 partially shipped (F, ~14% of cells.ts size reduction)
- 0 deferred

---

## Part 5 — Why this isn't every refactor I could do

The user constraint was explicit: "do not change functionality". A senior engineer who just joined a codebase doesn't refactor the god-module on day one. The right move is to:

1. Document the current state (this doc)
2. Surface the smells without flattening every wall
3. Ship the low-risk, high-leverage cleanup
4. Earn the right to do the harder refactor by demonstrating taste on the easy one

If the founder approves the architecture doc + the four refactors above, then strategies F (decompose cells.ts) and E (parallelise prebuild) become the natural next session. Until then, the codebase ships as-is with four new readability wins layered on top.
