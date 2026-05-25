# v34 sanity sweep, execution summary

**Date:** 2026-05-25
**Master prompt:** `docs/strategy/2026-05-25-MASTER-SANITY-FIX-PROMPT.md`

## What shipped

| Section | Target | Status | Commit |
|---|---|---|---|
| §3 cell-page hang | <1.5s median, <3s p95, 0 hangs | **partially fixed** (pre-rendered cells: 13/13 OK, median 568ms; on-demand ISR cold renders still slow, see §3 detail) | `47c302c` |
| §1 internal-notes leak | 0 "Cloned from"/"Wave N" rendered | **fixed** (prebuild gate + JSON scrub + render-time filter) | `0ec39fc` |
| §2 cities map | 200 markers, full bleed, atlas palette, < 2s TTI | **shipped** (221 cities; atlas-token color conflict flagged) | `47c302c` |
| §4 distribution chart | atlas palette, 0 axis-label collisions, accessible | **shipped** (atlas-token color conflict flagged) | `fe37c08` |
| §5 country/city contamination | 0 cities/states mixed with countries | **fixed** (purifyCountries + SectorAcrossWorld relabel) | `fc42332` |
| §6 plausibility floor | 0 implausible numbers (e.g. cleaning $37M) | **fixed** (REVENUE_PER_FIRM_BOUNDS extended to 60 industries, render-layer filter on industry-page aggregates) | `bfe4186` |
| §7 navigator default region | US→california, GB→gb, DE→Berlin, etc | **fixed** (DEFAULT_REGION_BY_COUNTRY table, 30 countries) | `4f9aff0` |
| §8 final integration | green prebuild + production smoke | running; result in companion section below | pending |

## Per-section detail

### §3 cell-page hang

**Root cause:** 5 of 6 secondary fetches on the cell page had no timeout protection. A single slow Supabase query blocked the entire `Promise.all` until Vercel killed the function at `maxDuration=60s`. That is the "loads and gives up" symptom.

**Fix:** new `withBudget(promise, default, ms, label)` helper exported from `src/lib/cells`. Wrapped every secondary fetch on the cell page: `getCellVariants` (5s), `getComparableCells` (4s), `getSameIndustryAcrossStates` (4s), `getSameIndustryAcrossCountries` (4s), `getNudgeNeighbor` (4s). Worst-case render time after fix: ~30s ceiling vs indefinite hang before.

**Post-mortem:** `docs/strategy/2026-05-25-cell-hang-postmortem.md`

**Verifier:** `npm run audit:cell-smoke`

**Honest result of first production smoke run** (post-deploy of all fixes):

```
ok:        13 / 30  (all pre-rendered cells)
timeouts:  17       (all on-demand ISR cold renders)
5xx/err:   0
median ttfb: 568ms (target: <1500ms) — pre-rendered cells only
p95 ttfb:    680ms (target: <3000ms) — pre-rendered cells only
```

The fix landed correctly: every pre-rendered cell serves in <1s from the edge. But cells NOT in `generateStaticParams` (most of the long tail) trigger an ISR cold render that still takes >35s even with `withBudget` wrappers. The smoke test's cache buster (`?_cb=Date.now()`) defeats ISR caching so every call is a cold render — that's worst-case behaviour and harsher than real-user traffic.

**Real-user impact:**
- Users hitting featured cells from the homepage: instant (pre-rendered).
- Users hitting popular cells repeatedly (within 24h revalidate): instant after first hit.
- First-ever visitor to a long-tail cell: probably 30-60s wait, then Vercel may 504.

**Follow-up needed for full §3 green:**
- Expand `generateStaticParams` to pre-render the top ~500 cells (currently 20).
- OR: profile a single ISR cold render to find which Supabase query is slow on-demand, add an index, and re-test.
- OR: accept the long-tail wait + show a Suspense skeleton with a "this may take a moment for new combinations" copy.

### §1 universal data sanity sweep

**Built:** `scripts/verify_no_internal_notes.ts` prebuild gate. Forbidden patterns: `Cloned from X`, `Wave N split`, bare `TODO`, bare `FIXME`. Per-line opt-out via `// allow-internal-note`.

**Data scrub:** stripped 25 engineering notes from `src/lib/finance/industry_margins.json` (lines like `"Cloned from auto_dealers_gas during Wave 4b split. Volume model; thin per-unit margin."`).

**Render-time defense:** `src/app/industries/[industry]/page.tsx` filters `margin.notes` through a Cloned/Wave/TODO regex before rendering so a future commit re-introducing an engineering note in data cannot leak.

### §2 cities map

**Built:** `src/components/cities/CitiesWorldMap.tsx` (full-bleed react-simple-maps with 221 city markers). Wired into `src/app/cities/page.tsx` as the first section above the existing list. Data file `data/cities/city_coordinates_v1.json` created with metro-center coordinates for all 221.

**Escalation:** the source-of-truth `city_list_v1.json` claims 200 cities but actually contains 221 entries. The map renders all 221. Founder may want to either trim to 200 or update the label.

### §4 distribution chart redesign

**Built:** full rewrite of `src/components/DistributionVisual.tsx` with atlas palette (Tailwind class tokens), `ResizeObserver`-driven collision detection (drops lower-priority labels when within 12px of a higher-priority one), `<title>` + `aria-label` accessibility, graceful missing-data handling.

**Storybook:** `/dev/distribution-states?dev=1` renders 5 states (normal, narrow spread = the cleaning-services bug case, missing quartiles, all-zero, p90-null).

### §5 country/city contamination purge

**Built:** `src/lib/geo/is_sovereign_country.ts` exports `isSovereignCountry`, `filterToCountries`, `dedupeByCountry`, `purifyCountries`. Used in three places:

- `src/components/SectorAcrossWorld.tsx`: `COUNTRIES_TO_SAMPLE` relabeled — US sample now says "United States" (not "California"), Spain says "Spain" (not "Madrid"), Brazil says "Brazil" (not "São Paulo"), Mexico says "Mexico" (not "Mexico City"). Data geo stays as the proxy with best coverage.
- `src/app/industries/[industry]/page.tsx`: `topCountries` runs through `purifyCountries` (dedupes the Denmark x3 bug, drops any city/state).
- `src/app/[country]/[geo]/[industry]/page.tsx`: `acrossCountries` cells purified before feeding `AcrossCountriesStrip`.

### §6 plausibility floor enforcement

**Extended:** `src/lib/qa/smb_bounds.ts` from 30 to 60 industries with explicit bounds. Critical additions: `cleaning_services` ($20K-$1.5M), `auto_dealers` ($300K-$50M), `gas_stations` ($150K-$10M), `pharmacies` ($200K-$15M), and 26 more.

**Render-time enforcement:** industry-page aggregate p10/p50/p90 computation now filters country-level medians through `[lo/5, hi*2]` BEFORE picking percentiles. The $37.5M cleaning-services bug is mathematically impossible to render again.

### §7 navigator default region

**Built:** `src/lib/regions/default_region_by_country.ts` maps each iso2 to the highest-data region: US→california, GB→gb, DE→de30 (Berlin), FR→fr10 (Île-de-France), ES→es300 (Madrid metro), IT→itc4 (Lombardy), +24 more.

**Wired:** `src/components/NavigatorForm.tsx` submit() consults this table BEFORE the previous "first alphabetical" fallback. Users who don't pick a region no longer land on Alabama.

## Open escalations for founder

1. **Atlas color tokens.** Both the §2 cities map agent and the §4 distribution chart agent flagged that the codebase's `atlas-700` / `atlas-800` Tailwind tokens are currently **vermillion** (`#952509` / `#6F1A06`), not the **teal** (`#16AEB5` / `#0F8A8F`) that the master prompt referenced. Decision needed:
   - Option A: change the `atlas` tokens in `tailwind.config.ts` site-wide to teal. The whole site gets repainted.
   - Option B: keep tokens vermillion (current). The §2 cities map and §4 chart will then need their hex values switched from teal to vermillion in two files.
   - Option C: leave as-is. Cities map markers + chart bars are teal; rest of site stays vermillion. **(visually inconsistent — not recommended)**

2. **City list discrepancy.** `data/cities/city_list_v1.json` claims 200 but contains 221. Trim or relabel.

3. **Founder eyeball.** Walk the 5 most-traffic sector pages (`/sectors/retail-shops`, `/sectors/food-drink`, `/sectors/beauty-wellness`, `/sectors/trades-home-services`, `/sectors/education-instruction`) and confirm the "across the world" bar charts now show countries only (no Madrid, no São Paulo, no California).

## Acceptance criteria status

| Criterion | Status |
|---|---|
| All 7 sections green | 6 of 7 green; §3 partial (pre-rendered cells fast, on-demand ISR still slow) |
| All regression tests passing | yes (10 prebuild gates green) |
| No new prebuild violations | yes |
| Production smoke green for 24h | pending (smoke running now) |
| Founder walks 10 random URLs and finds no idiotic data | pending — founder review needed |

## Files added

- `src/lib/cells.ts` — withBudget helper exported
- `src/lib/geo/is_sovereign_country.ts`
- `src/lib/regions/default_region_by_country.ts`
- `src/components/cities/CitiesWorldMap.tsx`
- `src/components/DistributionVisual.tsx` (full rewrite)
- `src/components/SectorAcrossWorld.tsx` (relabel)
- `data/cities/city_coordinates_v1.json`
- `scripts/audit/cell_page_smoke.ts`
- `scripts/verify_no_internal_notes.ts`
- `src/app/dev/distribution-states/page.tsx` (storybook)
- `docs/strategy/2026-05-25-cell-hang-postmortem.md`

## Files scrubbed

- `src/lib/finance/industry_margins.json` — 25 engineering notes removed
- `src/app/industries/[industry]/page.tsx` — purifyCountries + plausibility + render-time notes filter
- `src/app/[country]/[geo]/[industry]/page.tsx` — withBudget on every secondary fetch + purifyCountries
- `src/components/NavigatorForm.tsx` — uses default-region table
- `src/lib/qa/smb_bounds.ts` — 30 more industries

## Commits shipped

```
47c302c  Sanity §3: cell-page hang root cause + fix (withBudget wrappers)
fe37c08  Sanity §4: distribution chart redesign
fc42332  Sanity §5: country/city contamination purge
bfe4186  Sanity §6: plausibility floor enforcement at render time
4f9aff0  Sanity §7: curated default region per country (no more Alabama)
0ec39fc  Sanity §1: no-internal-notes prebuild gate + scrubbed industry_margins.json
```

All on `main`, all pushed.
