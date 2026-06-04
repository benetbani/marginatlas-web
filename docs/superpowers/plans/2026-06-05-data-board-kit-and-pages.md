# Data Board Kit + Pages Implementation Plan

> **For agentic workers:** execute task-by-task; one subagent per task, review +
> gate + preview between tasks. Steps use `- [ ]`. Traces to the spec
> docs/superpowers/specs/2026-06-05-page-skeletons-design.md.

**Goal:** Rebuild every data page as one consistent "data board" by first
building a small kit of reusable, shadcn-quality primitives, then composing each
page (cell, country, city, global-activity, compare) from that single kit, so
the site is graphically consistent by construction.

**Architecture:** A new `src/components/board/` kit holds the primitives
(format helpers, StatRow/StatGrid, DataSection, ScoreStrip, BoardHero, five
mini-charts, FailureCards). Pure synthesis modules in `src/lib/scores/` produce
the section data (value-or-null rows). Pages import ONLY the kit + a synthesis
module, never bespoke layout. Every section always renders; missing values show
a muted "-". Modeled blocks carry one note. Tokens only.

**Tech Stack:** Next 15.5 / React 19 server components, Tailwind 3.4 + the
design-tokens system, shadcn-style `src/components/ui/*` (forwardRef + cva +
displayName), `@visx/*` for charts (already a dependency), `lucide-react`.

**Verification (project-specific, NON-NEGOTIABLE):** the 8 GB box OOMs on local
`next build` / `tsc` / `prebuild`. So each task is verified by: (1) push the
branch, let Vercel run tsc + prebuild + build (the real gate); (2) screenshot
the affected page with `scripts/shot_preview.mjs <previewUrl> <route> [--mobile]`
using `BYPASS=<token>`; (3) eyeball the screenshot. No local builds. Work on the
`reform-v2/palette-brick` branch; merge to main only on founder approval.

---

## File structure (what each new file owns)

- `src/components/board/format.ts` — value formatters + the missing-value glyph.
- `src/components/board/StatGrid.tsx` — the dense label/value grid + one row.
- `src/components/board/DataSection.tsx` — one always-on section (title, grid,
  show-more cap, modeled note).
- `src/components/board/ScoreStrip.tsx` — single overall score + parts on tap.
- `src/components/board/BoardHero.tsx` — plain wide+small title + score strip +
  switcher slot (the hero-height fix lives here).
- `src/components/board/charts/{SpreadBar,CostBar,SurvivalCurve,CrowdingGauge,RentGauge}.tsx`
  — the five visx mini-charts, each nullable-input.
- `src/components/board/FailureCards.tsx` — the bottom failure block.
- `src/lib/scores/cell_board.ts` — pure: builds the full A-J section list for a
  cell (rows are `{label, value: string|null, hint?, modeled?}`).
- `src/lib/scores/country_board.ts`, `city_board.ts`, `activity_board.ts` — the
  per-page section lists (their slice of the grid).
- Modified pages: `src/app/[country]/[geo]/[industry]/page.tsx` (cell),
  `src/app/[country]/page.tsx` (country), `src/app/cities/[slug]/page.tsx`
  (city), `src/app/industries/[industry]/page.tsx` (global activity),
  `src/app/compare/CompareClient.tsx` (compare).
- `data/london/london_market_v1.json` — extended to fill the curated rows.
- `src/app/_design/page.tsx` — catalog stories for the kit (project rule).

---

## PHASE 1: The kit (graphic-consistency foundation)

### Task 1: format helpers + missing glyph
**Files:** Create `src/components/board/format.ts`.
- [ ] Implement `MISSING = "-"` (a muted plain hyphen; NOT an em-dash) exported
  as the single source for blanks.
- [ ] `fmtUSD(n: number|null|undefined): string` -> `$1.2M` / `$340K` / `$12,000`
  or `MISSING`. `fmtPct(x, {fromFraction})`, `fmtInt(n)`, `fmtNum(n)` all return
  `MISSING` for null/NaN/Infinity. No raw symbols beyond `$` and `%`.
- [ ] `val(v): string` wrapper: any null/empty -> `MISSING`.
**Verify:** imported + used in Task 2; covered by the Vercel build.

### Task 2: StatRow + StatGrid
**Files:** Create `src/components/board/StatGrid.tsx`.
- [ ] `type StatRow = { label: string; value: string | null; hint?: string }`.
- [ ] `StatGrid({ rows }: { rows: StatRow[] })`: `grid grid-cols-2 md:grid-cols-3
  gap-x-6 gap-y-3`. Each cell: label `text-[11px] uppercase tracking-wide
  text-cocoa-500`, value `font-display text-lg font-semibold text-ink-900
  tabular-nums` (when value is null OR `MISSING`, render it `text-cocoa-400`),
  hint `text-[11px] text-cocoa-500`.
- [ ] ALWAYS renders all rows (no filtering). This is the always-show rule.
**Verify:** catalog story (Task 8) + cell preview.

### Task 3: DataSection (the consistency unit)
**Files:** Create `src/components/board/DataSection.tsx`.
- [ ] `type Section = { key: string; title: string; rows: StatRow[]; modeled?: boolean; chart?: React.ReactNode }`.
- [ ] Render: `SectionEyebrow` title; the optional `chart` above the grid;
  `StatGrid` of the first 8 rows; if `rows.length > 8`, a "show more" toggle
  (client island) revealing the rest; if `modeled`, a `text-[11px] text-cocoa-500`
  note "Modeled from national business demography. Directional." UNDER the grid.
- [ ] The section ALWAYS renders even if every value is `MISSING`.
- [ ] "show more" is the only client piece; keep it a tiny `"use client"`
  wrapper so the section stays a server component otherwise.
**Verify:** catalog story + cell preview (a section with >8 rows shows the toggle).

### Task 4: ScoreStrip
**Files:** Create `src/components/board/ScoreStrip.tsx`.
- [ ] Props: `{ overall: number|null; parts: {label:string; score:number|null}[] }`.
- [ ] Render the single overall 0-100 number big (band tone via the existing
  tier/score color helper), label "Atlas score". The four `parts` are hidden
  behind a "details" disclosure (tap to expand into a row of small score chips).
- [ ] Banding + colors come from the existing scores tokens; no new hex.
**Verify:** catalog story + cell preview (collapsed by default, expands on tap).

### Task 5: BoardHero (includes the hero-height fix)
**Files:** Create `src/components/board/BoardHero.tsx`.
- [ ] Props: `{ title: string; score: ScoreStripProps; switcher?: React.ReactNode }`.
- [ ] Title is a plain `<h1>` sized SMALLER and WIDER than the current cell hero
  so the board shows above the fold: `font-display text-2xl md:text-3xl
  font-semibold tracking-tight text-ink-900` (down from the 4xl-6xl rotating
  hero), `max-w-none`, left-aligned, tight top/bottom padding (`pt-6 pb-3`).
- [ ] Below the title: the ScoreStrip + the optional `switcher` on one compact
  row. No verdict sentence.
- [ ] The animated rotating question is NOT used here (home page only).
**Verify:** cell preview at desktop + 390px mobile; confirm the first data
section is visible without scrolling on desktop.

### Task 6: the five mini-charts (visx, nullable-input)
**Files:** Create `src/components/board/charts/SpreadBar.tsx`, `CostBar.tsx`,
`SurvivalCurve.tsx`, `CrowdingGauge.tsx`, `RentGauge.tsx`.
- [ ] Each takes typed nullable props and returns `null` when its data is null
  (the parent section still renders its rows). SpreadBar: p10/median/p90 as a
  horizontal range bar. CostBar: cost-share stacked bar (rent/labor/COGS/other).
  SurvivalCurve: a 1/3/5-year line. CrowdingGauge + RentGauge: small arc gauges
  (0-100 banded). All visx, tokens only, `motion-reduce` safe, fixed compact
  height (~64-96px), aria-labels.
**Verify:** catalog stories + cell preview.

### Task 7: FailureCards
**Files:** Create `src/components/board/FailureCards.tsx`.
- [ ] Props: `{ cards: {title:string; body:string}[] }`. Renders the bottom
  "what kills weak operators" block as compact cards. Blunt voice; no em-dashes.
**Verify:** catalog story + cell preview.

### Task 8: catalog stories
**Files:** Modify `src/app/_design/page.tsx`.
- [ ] Add a "Data board" section showing StatGrid, DataSection (full + all-blank
  + >8-rows), ScoreStrip (collapsed/expanded), BoardHero, each chart, and
  FailureCards, in every state. (Project rule: kit primitives need a catalog
  story.)
**Verify:** `/_design` preview (ADMIN_KEY-gated).
**COMMIT + PUSH Phase 1; gate on Vercel; screenshot `/_design`.**

---

## PHASE 2: Cell page on the kit

### Task 9: full A-J synthesis
**Files:** Create `src/lib/scores/cell_board.ts`; reuse/replace
`src/lib/scores/cell_dashboard.ts`.
- [ ] Pure `buildCellBoard(input): Section[]` producing ALL of A-J in fixed
  order, every row present, `value: null` where data is missing (the component
  turns null into `MISSING`). Inputs: the cell, the computed money values, the
  country econ snapshot, cost_structure/cost_stack/setup_costs, cityPopulation,
  the London entry (extended in Phase 3), and the scoreSet.
- [ ] Mark `modeled: true` on B,C,D,F,G,H(part),I(part),J. Attach the chart node
  to the right section (A->SpreadBar+CostBar, B->CrowdingGauge, H->RentGauge,
  J->SurvivalCurve).
**Verify:** cell preview shows all 10 sections, dashes where missing.

### Task 10: rebuild the cell page top
**Files:** Modify `src/app/[country]/[geo]/[industry]/page.tsx`.
- [ ] Replace the current hero + CellDashboard wiring with `BoardHero`
  (plain title "[Activity] in [Place]") + the A-J `DataSection`s (from
  `buildCellBoard`) + `FailureCards` at the bottom. Keep the deep-dive sections
  below OR fold the ones now duplicated (founder review decides which stay).
- [ ] PRESERVE generateMetadata (the richer SEO title stays), Dataset/FAQ/
  Breadcrumb JSON-LD, the section-order gate ids, the take-home floor, ISR.
- [ ] The visible h1 is plain; the meta title stays "[Activity] in [Place]:
  revenue, margins, survival, competition".
**Verify:** push; Vercel green; screenshot `/gb/london/restaurants` desktop +
mobile; confirm board-above-fold + all sections + dashes.
**COMMIT + PUSH Phase 2.**

---

## PHASE 3: Fill London (deep-first)

### Task 11: extend the London dataset
**Files:** Modify `data/london/london_market_v1.json`; extend the London type in
`cell_board.ts`.
- [ ] For each of the 20 activities, fill the curated rows for B,C,D,F,G,H,I,J
  (pricing ceiling/WTP/premium/dispersion/tourism; deformation components;
  friction; demand mix; rent level/high-street/catchment; hiring/turnover/
  owner-dependence; survival detail/seasonality/min-viable-scale). Real UK/London
  benchmarks, ranges where honest. Dry-run = the committed JSON shown to the
  founder before merge.
**Verify:** `/gb/london/restaurants` now shows mostly-filled sections (few dashes).
**COMMIT + PUSH Phase 3.**

---

## PHASE 4: Country + City on the kit

### Task 12: country page
**Files:** Create `src/lib/scores/country_board.ts`; modify `src/app/[country]/page.tsx`.
- [ ] `buildCountryBoard`: climate(E) + tax(E) + friction(F) + labor(I) +
  survival-baseline(J) + market-structure-summary(B) sections (rows value-or-null).
- [ ] Page = BoardHero (plain "[Country]") + those sections + the
  regions-and-cities list (each region a heading, cities as clickable chips,
  regions NOT links) + (no best/worst table here).
**Verify:** screenshot `/gb`.

### Task 13: city page
**Files:** Create `src/lib/scores/city_board.ts`; modify `src/app/cities/[slug]/page.tsx`.
- [ ] `buildCityBoard`: demand(G) + rent/location(H) + saturation(B) +
  survival-baseline(J). Page = BoardHero + those + the activities-in-this-city
  table ranked by owner take-home (best + hardest), rows link to cells.
**Verify:** screenshot `/cities/london`.
**COMMIT + PUSH Phase 4.**

---

## PHASE 5: Global Activity + Compare

### Task 14: global activity page
**Files:** Create `src/lib/scores/activity_board.ts`; modify `src/app/industries/[industry]/page.tsx`.
- [ ] Cost-shape ratios (A, structural) + a low-to-high revenue RANGE across
  covered cities (never a single worldwide average) + structure/pricing/labor/
  survival archetypes (B/C/I/J) + a "where it works" places table. BoardHero
  plain title. Fix the index-page copy that oversells worldwide revenue.
**Verify:** screenshot `/industries/restaurants`.

### Task 15: compare page
**Files:** Modify `src/app/compare/CompareClient.tsx` (+ helpers).
- [ ] Same business across up to 3 cities; the decisive rows (A,B,C,H,I,J) side
  by side using StatGrid columns; the single biggest differentiator; SpreadBar
  per city.
**Verify:** screenshot a compare URL.
**COMMIT + PUSH Phase 5.**

---

## PHASE 6: Guardrails + consistency sweep

### Task 16: extend guardrails
**Files:** Modify `src/lib/finance/margin_floor.ts` + add bounds in the board
synthesis.
- [ ] Net-margin floor/ceiling per activity; survival bounded (1yr >= 3yr >=
  5yr, sane bands); competitor-density sanity cap; reuse SMB plausibility bounds.
  All trim silently, no apology.
**Verify:** spot-check a few cells for any wrong-looking number.

### Task 17: consistency sweep
- [ ] Screenshot every page type (home, country, city, cell, global activity,
  compare, calculator) desktop + mobile; confirm one consistent board language
  (same StatGrid, same section rhythm, same score strip, same dashes). Fix drift.
**Verify:** the screenshot set.
**COMMIT + PUSH Phase 6; this is the founder review point before merge to main.**

---

## Self-review (spec coverage)

- Maximal data board + always-show + dashes: Tasks 2,3,9. PASS.
- Single overall score on top: Task 4. PASS.
- No verdict sentence; failure cards at bottom: Tasks 5,7,10. PASS.
- Money first + section order: Task 9. PASS.
- 5 mini-charts incl rent gauge: Task 6. PASS.
- Cap + show-more: Task 3. PASS.
- USD, all-sizes default, per-block modeled note: Tasks 1,3,9. PASS.
- Plain title + hero-height fix: Task 5,10. PASS.
- Country (climate + regions/cities, no best/worst); City (best/worst by
  take-home); Global activity (shape + range); Compare (same business across
  cities): Tasks 12,13,14,15. PASS.
- Guardrails: Task 16. PASS.
- London deep-first: Phase 3 before other places. PASS.
- Graphic consistency: the kit (Phase 1) is built and composed everywhere before
  any page-specific layout. PASS.
