# Visual Asset Integration Map (2026-06-12)

Consolidation plan for the `Margin-Atlas--5` design-export assets into the live repo.
Builds on `docs/brand/_audit/asset-audit.md` (authority for verdict rationale).
Authority stack: `brand-identity.md` > `design-tokens.ts` > this plan.

---

## 0. Pre-conditions and standing constraints

All ported assets must:

- Use tokens only. No raw hex, no raw px, no raw ms, no raw cubic-bezier strings.
  Every colour resolves via a Tailwind class (`text-atlas-700`, `bg-moss-500`) or a
  CSS variable that maps to a token (`var(--atlas-500)` resolved from `design-tokens.ts`).
- Contain no em-dashes in any user-visible string.
- Contain no source-agency names in any user-visible copy.
- Pass `npx tsc --noEmit` after port (apply with permission; do not run build/prebuild autonomously).
- Every interactive primitive: `forwardRef` + `displayName` + `cva` + catalog story on `/_design`.

---

## 1. Canonical source

**All assets sourced from `docs/brand/assets/incoming/Margin-Atlas--5/`** (the files directly
at the root of that folder, not from sub-folders or from sets 17-20).

Sets 17-20 are page-layout references. They carry no assets beyond the motif SVGs and pattern
CSS, which are byte-identical to `--5`. Never port from 17-20 at the asset level.

The one systemic pre-port operation (the retone pass) is documented in section 5.

---

## 2. Asset-by-asset integration plan

### 2.1 Cartographic motif SVGs

**Source files:**
```
Margin-Atlas--5/atlas-grid.svg
Margin-Atlas--5/atlas-columns.svg
Margin-Atlas--5/atlas-crosshatch.svg
Margin-Atlas--5/atlas-pinstripe.svg
Margin-Atlas--5/atlas-rosette.svg
Margin-Atlas--5/atlas-accent.svg
```

**Verdict: REFINE (recolour only)**

**Status:** Partially live. The six SVGs are already in `public/` and the utility CSS is live
in `src/styles/atlas-pattern.css`. The pattern classes (`.atlas-grid`, `.atlas-columns`, etc.)
are wired. One outstanding defect: `atlas-accent.svg` still carries `#D73A14` (orange), not
vermillion; the motif mark hex values are cool gray, not warm taupe. Neither issue has been
corrected in the public copies.

**Repo destination:** `public/` (already correct; these are background-image SVGs fetched by URL).

**Remaining work:**

1. Edit `public/atlas-accent.svg`: replace `#D73A14` (and any `#C2410C` or `#E0451F` accent
   values) with `#e62200` (`atlas-500`).
2. Edit `public/atlas-grid.svg`, `atlas-columns.svg`, `atlas-crosshatch.svg`,
   `atlas-pinstripe.svg`, `atlas-rosette.svg`: replace every `#E0E0E0`, `#EEEEEE`, `#EAEAEA`,
   `#ECECEC`, `#EFEFEF` mark-stroke value with `#e4e2dd` (`parchment` = `cream-300`).
3. In `src/styles/atlas-pattern.css`: the `.atlas-accent` rule currently hardcodes
   `background-color: #ffffff` -- change to `var(--atlas-paper-bg)` for consistency.
   Verify the dark-surface paper color `#2E2418` already in the file matches `ink-800 #2c2015`
   (close but not identical; update to `#2c2015` on next touch).

**Token mapping for this category:**

| SVG value (stale)               | Token target                                       |
|---------------------------------|----------------------------------------------------|
| `#D73A14` accent dots           | `#e62200` (atlas-500)                              |
| `#E0E0E0` / `#EEEEEE` / `#EAEAEA` mark strokes | `#e4e2dd` (parchment = cream-300) |
| `#FAFAFA` or `#ffffff` bg (if hardcoded) | `var(--atlas-paper-bg)` = `cream-50 #ffffff` (light) |
| `#3A3A3A` dark bg (old)         | `#2c2015` (ink-800)                                |

---

### 2.2 Pattern surfaces (atlas-pattern.svg / atlas-pattern-dark.svg / atlas-pattern.css)

**Source files:**
```
Margin-Atlas--5/atlas-pattern.svg
Margin-Atlas--5/atlas-pattern-dark.svg
Margin-Atlas--5/atlas-pattern.css
```

**Verdict: REFINE (rebind to warm tokens)**

**Status:** Partially live. The two SVGs are in `public/`; `src/styles/atlas-pattern.css` is
the live CSS. The light surfaces were intentionally set to plain white by a founder directive
(2026-06-06 "white-reset"). The dark-surface pattern is active. The seven-surface system
(`.atlas-paper`, `-dim`, `-card`, three dark variants, six motif utility classes) is in place.

**Repo destination:** SVGs in `public/` (already); CSS in `src/styles/atlas-pattern.css`
(already).

**Remaining work:**

1. Recolour pattern mark fills/strokes in both `atlas-pattern.svg` and `atlas-pattern-dark.svg`
   from cool gray values to warm taupe (`#e4e2dd`) in the light variant, and near-white
   translucent in the dark variant.
2. Ensure `--atlas-paper-bg-dark` in `atlas-pattern.css` reads `#2c2015` (ink-800), matching
   the token, not `#2E2418` (the current file has `#2E2418`).
3. The light-mode "white-reset" (pattern removed) is a deliberate product decision, not a bug.
   Keep it: `.atlas-paper`, `.atlas-paper-dim`, `.atlas-paper-card` remain flat white.
   The dark variants retain the pattern.

---

### 2.3 atlas-icons (UI / section icons, 40 glyphs)

**Source files:**
```
Margin-Atlas--5/atlas-icons.js   (primary: structured manifest with metadata)
Margin-Atlas--5/atlas-icons.svg  (SVG sprite + display sheet; secondary reference)
```

**Verdict: ADOPT**

**Repo destination:** `src/components/brand/icons/`

**Files to create:**

```
src/components/brand/icons/atlas-icons-data.ts   -- typed manifest (ported from atlas-icons.js)
src/components/brand/icons/AtlasIcon.tsx          -- React primitive
src/components/brand/icons/index.ts              -- barrel export
```

**Conversion: atlas-icons.js -> typed React component**

`atlas-icons.js` exports an array of `{ id, group, label, blurb, body }` objects (the `body`
is the raw SVG path/circle/polyline markup for that glyph). Port to TypeScript:

```ts
// atlas-icons-data.ts
export type AtlasIconId =
  | "startup-cost" | "owner-keeps" | "revenue" | "range" | "cost-breakdown"
  | "wages" | "break-even" | "seasonality" | "first-year" | "competition"
  | "taxes" | "register-cost" | "red-tape" | "hiring" | "min-wage"
  | "spending-power" | "commercial-rent" | "free-zone" | "airport" | "tourist"
  | "best-areas" | "neighborhood" | "compare" | "vs-world" | "corruption"
  | "locals-know" | "honest-take" | "contrarian" | "myth-reality" | "who-for"
  | "gut-check" | "worked-example" | "operator-voices" | "freshness" | "flag"
  | "bookmark" | "watch" | "calculator" | "methodology" | "search";

export type AtlasIconGroup =
  | "financial" | "market" | "location" | "editorial" | "interface";

export interface AtlasIconDef {
  id: AtlasIconId;
  group: AtlasIconGroup;
  label: string;
  blurb: string;
  body: string; // raw SVG path elements (viewBox 0 0 32 32)
}

export const ATLAS_ICONS: AtlasIconDef[] = [ /* ... port from atlas-icons.js ... */ ];
```

`AtlasIcon.tsx` (the React primitive):

- Props: `id: AtlasIconId`, `size?: number` (default 24), `className?: string`,
  `aria-label?: string`, `aria-hidden?: boolean`
- Renders a `<svg>` with `viewBox="0 0 32 32"`, `width={size}`, `height={size}`,
  `stroke="currentColor"`, `fill="none"`, `strokeWidth={1.6}`, `strokeLinecap="round"`,
  `strokeLinejoin="round"`.
- The accent class (`.a` stroke, `.af` fill) from the export maps to `text-atlas-500`
  (Tailwind class) applied to the path element, not hardcoded hex.
- Icon-only usage: require `aria-label` when `aria-hidden` is not `true`. Enforce at
  TypeScript level via a discriminated union prop type.
- `forwardRef` + `displayName="AtlasIcon"`.

**No SVG sprite shipped to production.** The sprite (`atlas-icons.svg`) is the preview
artifact; the React component renders inline SVG from the data manifest, giving tree-shaking
and typed references. The sprite stays in `docs/brand/assets/incoming/Margin-Atlas--5/` as
the design reference only.

**Catalog story:** add an `AtlasIcon` grid to `src/app/_design/page.tsx` showing all 40 glyphs
at 24px with labels, grouped by the five logical groups.

**Token mapping (accent class):**

| Export class | CSS value (stale) | Token                   |
|--------------|-------------------|-------------------------|
| `.a` stroke  | `#C2410C`         | `currentColor` with parent `text-atlas-500` |
| `.af` fill   | `#C2410C`         | `fill-atlas-500`        |

---

### 2.4 atlas-pictograms (business / venue pictograms, 64 marks)

**Source files:**
```
Margin-Atlas--5/atlas-pictograms.js   (primary)
Margin-Atlas--5/atlas-pictograms.svg  (reference only)
```

**Verdict: ADOPT**

**Repo destination:** `src/components/brand/pictograms/`

**Files to create:**

```
src/components/brand/pictograms/atlas-pictograms-data.ts
src/components/brand/pictograms/AtlasPictogram.tsx
src/components/brand/pictograms/index.ts
```

**Conversion:** Identical pattern to `AtlasIcon`. Port the 64-mark manifest from
`atlas-pictograms.js` to a typed `AtlasPictogramDef[]` (same fields: `id`, `group`,
`label`, `body`). Groups: `food-drink`, `health-personal-care`, `retail-shops`,
`trades-home-services`, `professional-creative`, `hospitality-leisure`, `venues` (7 groups,
maps to the taxonomy in `src/lib/taxonomy.ts`).

The `AtlasPictogram` component follows the same shape as `AtlasIcon`:
`forwardRef`, `displayName="AtlasPictogram"`, same accent-class resolution.

Both families (icons + pictograms) share the same grid, stroke, and `currentColor` convention,
so they compose on the same surface without a separate design decision.

**Catalog story:** grid of all 64 pictograms at 32px, grouped by trade family, labeled.

---

### 2.5 atlas-spots (editorial spot illustrations, 12 pieces)

**Source files:**
```
Margin-Atlas--5/atlas-spots.js   (primary: 12 structured illustration objects)
Margin-Atlas--5/atlas-spots.svg  (poster sheet; reference only)
```

**Verdict: REFINE (retone wash hex to tokens)**

**Repo destination:** `src/components/brand/spots/`

**Files to create:**

```
src/components/brand/spots/atlas-spots-data.ts
src/components/brand/spots/AtlasSpot.tsx
src/components/brand/spots/index.ts
```

**Conversion:**

`atlas-spots.js` exports 12 objects: `{ id, title, caption, vb, body }` where `body` is a
self-contained SVG fragment. `vb` is the `viewBox` (varies per illustration). Port to:

```ts
export type AtlasSpotId =
  | "honest-take" | "audience-operator" | "audience-analyst" | "audience-scout"
  | "audience-expat" | "neighborhood-street" | "vs-world" | "opening-abroad"
  | "free-zone" | "airport-venue" | "locals-know" | "first-year"
  | "reality-check" | "benchmarks-cover" | "calculator";

export interface AtlasSpotDef {
  id: AtlasSpotId;
  title: string;
  caption: string;
  viewBox: string;
  body: string; // SVG path + shape markup
}
```

`AtlasSpot.tsx` props: `id: AtlasSpotId`, `width?: number`, `className?: string`,
`aria-label?: string`. Renders `<svg viewBox={def.viewBox} ...>` with `dangerouslySetInnerHTML`
for the body, guarded by a server-only render path (spots are editorial decoration, not
interactive). `forwardRef` + `displayName="AtlasSpot"`.

**Retone before porting:** in `atlas-spots.js`, replace:

| Export hex   | Token hex  | Token name          |
|--------------|------------|---------------------|
| `#E0451F`    | `#e62200`  | `atlas-500`         |
| `#991600`    | `#991600`  | `atlas-700` (already correct) |
| `#5F7D55`    | `#6f8f25`  | `moss-500`          |
| `Newsreader` (font name) | `var(--font-display)` | display font token |

The ink line elements already use `currentColor` or `#211810` (ink-900); leave those as
`currentColor` so the spots inherit from their container's text colour.

---

### 2.6 atlas-dataviz.js + atlas-charts.js (chart grammar)

**Source files:**
```
Margin-Atlas--5/atlas-dataviz.js   (distribution curve, engraved globe, sub-type switcher)
Margin-Atlas--5/atlas-charts.js    (distribution histogram, ranking bars, trend line, scatter)
```

**Verdicts:** `atlas-dataviz.js` REFINE (retone/dedupe); `atlas-charts.js` REFINE (retone/dedupe).
These two are consolidated into one chart library during the port (the distribution chart is
duplicated across both; one canonical implementation is kept).

**Repo destination:** `src/components/charts/`

The existing `src/components/charts/PercentileStrip.tsx` is already there; the new files extend
that directory.

**Files to create:**

```
src/components/charts/ChartTokens.ts          -- token constants for chart use
src/components/charts/DistributionChart.tsx   -- unified distribution (merges dataviz + charts)
src/components/charts/RankingChart.tsx        -- horizontal ranking bars
src/components/charts/TrendChart.tsx          -- area trend line
src/components/charts/ScatterQuadrant.tsx     -- positioning scatter / quadrant
src/components/charts/GraticuleGlobe.tsx      -- engraved-atlas globe (from dataviz)
src/components/charts/SubTypeSwitcher.tsx     -- dine-in/takeaway/delivery reframer
src/components/charts/index.ts               -- barrel export
```

**Conversion rules:**

1. `ChartTokens.ts` is not a new token file; it is a thin re-export of the palette values
   already in `design-tokens.ts` under the names the chart components reference:
   ```ts
   import { colors } from "@/lib/design-tokens";
   export const SPOT   = colors.atlas[500];   // #e62200
   export const SPOTD  = colors.atlas[700];   // #991600
   export const MOSS   = colors.moss[500];    // #6f8f25
   export const IQR_BG = colors.atlas[50];    // #fff1ee
   export const PAPER  = colors.cream[100];   // #f7f6f4
   // etc.
   ```
   Chart components import from `ChartTokens.ts`, never hardcode hex.

2. Each chart component renders with Canvas or inline SVG (matching the export's approach).
   Props accept nullable data (`values?: number[] | null`, `p10?: number | null`, etc.) and
   return `null` when data is insufficient -- the canonical pattern from `CLAUDE.md`.

3. `DistributionChart` is the single canonical implementation, superseding both the
   `atlas-dataviz.js` distribution and the `atlas-charts.js` histogram. The Catmull-Rom
   smooth curve logic and IQR band from `atlas-dataviz.js` are preferred (better math).

4. `GraticuleGlobe` (the engraved cartographic globe): this is a pure SVG decoration, not a
   data primitive. It renders the parallels/meridians, equator, vermillion city nodes, and
   dashed great-circle route from `atlas-dataviz.js`. It takes `cities?: Array<{lat,lng,label}>`
   and a `routePairs?: Array<[string,string]>` prop. Animation (the route draw-on) is wired in
   `atlas-motion.js`; the React version applies `prefers-reduced-motion` guard.

5. Font references: `atlas-charts.js` hardcodes `Newsreader` and `JetBrains Mono`. Replace
   all font-name strings with CSS variable reads: `getComputedStyle(el).getPropertyValue('--font-display')`
   for display, `getComputedStyle(el).getPropertyValue('--font-mono')` for mono. For Canvas-
   rendered text, pass the font via a prop so the server can control it.

6. `prefers-reduced-motion`: every animated chart wraps its animation path in
   `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and renders the static
   final state when true.

**Retone summary for charts:**

| Export literal           | Token to use                                  |
|--------------------------|-----------------------------------------------|
| `SPOT="#C2410C"`         | `colors.atlas[500]` = `#e62200`               |
| `SPOTD="#9A3412"`        | `colors.atlas[700]` = `#991600`               |
| `MOSS="#5F7D55"`         | `colors.moss[500]` = `#6f8f25`                |
| `#FBEDE4` IQR bg         | `colors.atlas[50]` = `#fff1ee`                |
| `#E4DBCD` paper          | `colors.cream[200]` = `#efeeeb`               |
| `var(--atlas-600) #C2410C` | `colors.atlas[600]` = `#c11c00`            |
| `var(--ink-900)`         | already correct: `colors.ink[900]` = `#211810`|
| hardcoded `Newsreader`   | `var(--font-display)`                         |
| inline `cubic-bezier`    | `easing.out` from `design-tokens.ts`          |
| inline `ms` durations    | `duration.*` from `design-tokens.ts`          |

---

### 2.7 atlas-motion.js + atlas-motion2.js (motion language)

**Source files:**
```
Margin-Atlas--5/atlas-motion.js   (8 core animations)
Margin-Atlas--5/atlas-motion2.js  (20 extended interactions)
```

**Verdict: ADOPT (as reference implementations; wire tokens and reduced-motion guard)**

These are **reference implementations only**, not drop-in scripts. The live repo's motion
system is `src/lib/motion.ts` (token exports) + `src/components/ui/motion/` (React primitives).

**Repo destination for ported primitives:** `src/components/ui/motion/`

**Existing motion primitives:** `FadeIn.tsx`, `SlideUp.tsx`, `Stagger.tsx` (already in repo).
The exports add 11 more interaction patterns not yet in the system.

**Files to create (from the motion exports):**

From `atlas-motion.js` (8 patterns):

```
src/components/ui/motion/CountUp.tsx          -- hero number count-up (ease-out cubic)
src/components/ui/motion/SubTypeFade.tsx      -- sub-type cross-fade (dine-in/takeaway)
src/components/ui/motion/ScrollReveal.tsx     -- IntersectionObserver-gated reveal
```

(The "living graticule globe" animation is part of `GraticuleGlobe.tsx` in charts, not a
standalone motion primitive. The replay trigger is a prop on that component.)

From `atlas-motion2.js` (20 patterns; only 8 are primitive-grade; the rest are one-off page
interactions for charts or the gauge):

```
src/components/ui/motion/ScoreGauge.tsx       -- radial Atlas-score gauge (SVG arc)
src/components/ui/motion/ProgressBar.tsx      -- determinate loading bar (replaces Spinner for progress)
src/components/ui/motion/OdometerNumber.tsx   -- number-roll / odometer animation
src/components/ui/motion/SparklineDraw.tsx    -- SVG path draw-on sparkline
src/components/ui/motion/TabIndicator.tsx     -- tab-underline slide
```

(The multi-step stepper and copy-confirm are application-level interactions, not re-usable
primitives at this stage. Port when a third consumer appears, per the GUIDELINES §2 rule.)

**Wiring all motion primitives to tokens:**

- Every `cubic-bezier(...)` literal -> `easing.out` / `easing.in` / `easing.inOut` from
  `src/lib/design-tokens.ts` (imported via `src/lib/motion.ts`).
- Every `Nms` duration literal -> `duration.fast` / `duration.base` / `duration.slow` /
  `duration.deliberate` (the exports range 160-440ms; map to the nearest token step).
- Every motion component applies `motion-reduce:animate-none` (Tailwind) OR checks
  `prefers-reduced-motion` via `window.matchMedia` and skips the animation.

**`prefers-reduced-motion` pattern for these components:**

```tsx
const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// In useEffect / animation trigger:
if (prefersReduced) {
  // set final state immediately, no animation
  return;
}
```

For server-rendered contexts, skip the animation (default to static) and hydrate on the client.

---

### 2.8 atlas-components.css (component-furniture library)

**Source file:**
```
Margin-Atlas--5/atlas-components.css
```

**Verdict: REFINE -- use as SPEC, build React/Tailwind primitives; do not ship the CSS as-is**

This file is the **authoritative blueprint** for which Atlas-specific primitives to build and
what their visual measurements are. It is not added to the repo as a stylesheet.

**Repo destination for ported primitives:** `src/components/ui/` (system layer).

The CSS defines ~25 component classes. The following map to primitives that do not yet exist
in `src/components/ui/` and have broad reuse across the page types defined in the page-content
map:

**Priority 1 -- needed for current and near-future page builds:**

| `components.css` class         | React primitive to build                        | dest file                                    |
|--------------------------------|-------------------------------------------------|----------------------------------------------|
| `.atlas-score-gauge`           | `ScoreGauge` (already in motion plan above)     | `src/components/ui/motion/ScoreGauge.tsx`    |
| `.atlas-range-strip`           | `RangeStrip`                                    | `src/components/ui/RangeStrip.tsx`           |
| `.atlas-per100-stack`          | `Per100Stack`                                   | `src/components/ui/Per100Stack.tsx`          |
| `.atlas-kpi-band`              | `KpiBand`                                       | `src/components/ui/KpiBand.tsx`              |
| `.atlas-verdict-callout`       | `VerdictCallout`                                | `src/components/ui/VerdictCallout.tsx`       |
| `.atlas-breakdown-bar-list`    | `BreakdownBarList`                              | `src/components/ui/BreakdownBarList.tsx`     |
| `.atlas-comparison-table`      | `ComparisonTable`                               | `src/components/ui/ComparisonTable.tsx`      |
| `.atlas-scorecard-grid`        | `ScorecardGrid`                                 | `src/components/ui/ScorecardGrid.tsx`        |

**Priority 2 -- build when the page section consuming them is built:**

| `components.css` class         | React primitive                                 |
|--------------------------------|-------------------------------------------------|
| `.atlas-featured-insight-card` | `FeaturedInsightCard`                           |
| `.atlas-pricing-tiers`         | `PricingTiers`                                  |
| `.atlas-for-you-not`           | `ForYouNotPanel`                                |
| `.atlas-country-scorecard`     | `CountryScorecard` (extend existing country components) |
| `.atlas-methodology-callout`   | `MethodologyCallout`                            |
| `.atlas-top-movers`            | `TopMovers`                                     |

**Components already live in `src/components/ui/` that overlap with `components.css`:**

| `components.css` class         | Existing primitive                              | Action      |
|--------------------------------|-------------------------------------------------|-------------|
| `.atlas-panel`                 | `Card` + `CardContent`                          | compose     |
| `.atlas-pill` / `.atlas-marker`| `Pill`                                          | use as-is   |
| `.atlas-table`                 | native `<table>` with Tailwind classes          | use as-is   |
| `.atlas-stat-block`            | `StatCard`, `StatRow`                           | compose     |
| `.atlas-hero-header`           | page-level, not a primitive (use `<h1>`)        | no action   |
| `.atlas-chart-frame`           | wrap the chart components from 2.6              | compose     |

**Building new primitives (required shape per GUIDELINES §4):**

Every new primitive from `components.css`:
- Lives in `src/components/ui/<name>.tsx`
- `forwardRef` + `displayName` + `cva`
- All colour, spacing, radius, and shadow values from `design-tokens.ts` tokens only
- `--moss: #5F7D55` in `components.css` -> `colors.moss[500]` = `#6f8f25` (retone)
- `--atlas-*` vars in `components.css` -> resolve against the live palette (see retone map below)
- Catalog story in `src/app/_design/page.tsx`
- State coverage: default / hover / focus / disabled / empty / error where applicable

---

### 2.9 atlas-reform.css

**Source file:**
```
Margin-Atlas--5/atlas-reform.css
```

**Verdict: DROP (use as Rosetta map only)**

Do not add to the repo. The live token system (`src/lib/design-tokens.ts`) is the canonical
token source. `atlas-reform.css` carries the stale orange ramp and must not be imported.

**Its one value as reference:** it defines the `--atlas-*` / `--ink-*` / `--cream-*`
CSS variable names that the other `--5` assets reference. During any port, translate those
names against the retone map in section 5 of this plan.

---

## 3. Repo location summary

```
public/
  atlas-accent.svg         -- REFINE (recolour #D73A14 -> #e62200)
  atlas-columns.svg        -- REFINE (recolour gray marks -> parchment)
  atlas-crosshatch.svg     -- REFINE (recolour)
  atlas-grid.svg           -- REFINE (recolour)
  atlas-pinstripe.svg      -- REFINE (recolour)
  atlas-rosette.svg        -- REFINE (recolour)
  atlas-pattern.svg        -- REFINE (recolour marks)
  atlas-pattern-dark.svg   -- REFINE (recolour marks)

src/styles/
  atlas-pattern.css        -- REFINE (fix --atlas-paper-bg-dark to ink-800 #2c2015)

src/components/brand/
  LogoMark.tsx             -- already live
  LogoWordmark.tsx         -- already live
  icons/
    atlas-icons-data.ts    -- ADOPT (port from atlas-icons.js, typed)
    AtlasIcon.tsx          -- ADOPT (new React primitive)
    index.ts
  pictograms/
    atlas-pictograms-data.ts  -- ADOPT (port from atlas-pictograms.js, typed)
    AtlasPictogram.tsx        -- ADOPT (new React primitive)
    index.ts
  spots/
    atlas-spots-data.ts    -- REFINE (port from atlas-spots.js, retoned)
    AtlasSpot.tsx          -- REFINE (new React component)
    index.ts

src/components/ui/
  RangeStrip.tsx           -- REFINE (from components.css spec)
  Per100Stack.tsx          -- REFINE (from components.css spec)
  KpiBand.tsx              -- REFINE (from components.css spec)
  VerdictCallout.tsx       -- REFINE (from components.css spec)
  BreakdownBarList.tsx     -- REFINE (from components.css spec)
  ComparisonTable.tsx      -- REFINE (from components.css spec)
  ScorecardGrid.tsx        -- REFINE (from components.css spec)
  motion/
    FadeIn.tsx             -- already live
    SlideUp.tsx            -- already live
    Stagger.tsx            -- already live
    CountUp.tsx            -- ADOPT (from atlas-motion.js)
    SubTypeFade.tsx        -- ADOPT (from atlas-motion.js)
    ScrollReveal.tsx       -- ADOPT (from atlas-motion.js)
    ScoreGauge.tsx         -- REFINE (from atlas-motion2.js)
    ProgressBar.tsx        -- ADOPT (from atlas-motion2.js)
    OdometerNumber.tsx     -- ADOPT (from atlas-motion2.js)
    SparklineDraw.tsx      -- ADOPT (from atlas-motion2.js)
    TabIndicator.tsx       -- ADOPT (from atlas-motion2.js)

src/components/charts/
  PercentileStrip.tsx      -- already live
  ChartTokens.ts           -- REFINE (re-export of design-tokens.ts, no new hex)
  DistributionChart.tsx    -- REFINE (unified from dataviz.js + charts.js)
  RankingChart.tsx         -- REFINE (from atlas-charts.js)
  TrendChart.tsx           -- REFINE (from atlas-charts.js)
  ScatterQuadrant.tsx      -- REFINE (from atlas-charts.js)
  GraticuleGlobe.tsx       -- REFINE (from atlas-dataviz.js)
  SubTypeSwitcher.tsx      -- REFINE (from atlas-dataviz.js)
  index.ts

docs/brand/assets/incoming/Margin-Atlas--5/
  [all source files stay here as design reference; nothing deleted]
  atlas-reform.css         -- DROP as import (reference only for Rosetta map)
  atlas-components.css     -- DROP as import (spec blueprint only)
  atlas-icons.svg          -- reference only (sprite; not used in production)
  atlas-pictograms.svg     -- reference only
  atlas-spots.svg          -- reference only
```

---

## 4. Design-token mapping (the single conform pass)

Apply this map in every port. This is the complete retone from `atlas-reform.css`'s stale
palette to the live token values in `design-tokens.ts`.

| Export value (stale)          | Appears in                                    | Live token (`design-tokens.ts`)            | Tailwind class or CSS var             |
|-------------------------------|-----------------------------------------------|--------------------------------------------|---------------------------------------|
| `--atlas-700` `#9A3412`       | reform, components, dataviz, charts           | `colors.atlas[700]` = `#991600`            | `text-atlas-700` / `bg-atlas-700`     |
| `--atlas-600` `#C2410C`       | eyebrows, spot accent, chart SPOT             | `colors.atlas[600]` = `#c11c00`            | `text-atlas-600`                      |
| `--atlas-500` `#D7642E`       | fills, meters, focus ring                     | `colors.atlas[500]` = `#e62200`            | `text-atlas-500` / `bg-atlas-500`     |
| `--atlas-50`  `#FBEDE4`       | IQR band, soft bg tints                       | `colors.atlas[50]` = `#fff1ee`             | `bg-atlas-50`                         |
| `#D73A14`                     | atlas-accent.svg dots                         | `colors.atlas[500]` = `#e62200`            | SVG fill literal                      |
| `#E0451F`                     | atlas-spots.js washes                         | `colors.atlas[500]` = `#e62200`            | SVG fill literal                      |
| `#C2410C` (SPOT in charts)    | atlas-charts.js                               | `colors.atlas[500]` = `#e62200`            | `ChartTokens.SPOT`                    |
| `#9A3412` (SPOTD in charts)   | atlas-charts.js                               | `colors.atlas[700]` = `#991600`            | `ChartTokens.SPOTD`                   |
| `--moss` `#5F7D55`            | components.css, charts, spots                 | `colors.moss[500]` = `#6f8f25`             | `text-moss-500` / `bg-moss-500`       |
| `--good #16A34A`              | reform.css qualitative                        | `colors.moss[700]` = `#4a6018`             | `text-moss-700` (positive/success)    |
| `--warn #CA8A04`              | reform.css qualitative                        | `colors.amber[600]` = `#b06a08`            | `text-amber-600`                      |
| `--bad #B91C1C`               | reform.css qualitative                        | `colors.clay[500]` = `#8c2b22`             | `text-clay-500`                       |
| `--regional #2563EB`          | reform.css (blue; retired)                    | retire; use `colors.tier.good` `#e62200`   | `text-atlas-500`                      |
| `#E0E0E0`/`#EEEEEE`/`#EAEAEA`| motif SVG marks                               | `colors.parchment` = `#e4e2dd`             | SVG stroke literal                    |
| `#FAFAFA` paper-bg (light)    | atlas-pattern.css                             | `colors.cream[100]` = `#f7f6f4` (or `#ffffff` per white-reset) | `var(--atlas-paper-bg)` |
| `#3A3A3A` / `#2E2418` dark bg | atlas-pattern.css                             | `colors.ink[800]` = `#2c2015`              | `var(--atlas-paper-bg-dark)`          |
| `Newsreader` (hardcoded)      | charts.js, spots.svg                          | `var(--font-display)`                      | CSS variable                          |
| `JetBrains Mono` (hardcoded)  | charts.js                                     | `var(--font-mono)` (if defined) or `font-mono` Tailwind | CSS variable           |
| inline `cubic-bezier(...)`    | motion.js, motion2.js, charts.js              | `easing.out` etc. from `design-tokens.ts`  | via `src/lib/motion.ts` TRANSITION    |
| inline `Nms` durations        | motion.js, motion2.js                         | `duration.fast/base/slow/deliberate`       | via `src/lib/motion.ts`               |

---

## 5. Build order

The audit recommended this sequence; this plan endorses it with the repo context factored in.

| Step | What                                          | Why first                                              |
|------|-----------------------------------------------|--------------------------------------------------------|
| 1    | Recolour motif SVGs + fix atlas-pattern.css   | Trivial edits; unlocks the cartographic through-line. The SVGs are already in `public/` and the CSS is in `src/styles/`. No new components, no TypeScript. |
| 2    | AtlasIcon + AtlasPictogram families           | Highest reuse; needed by section headers, cell-page sections, and taxonomy displays immediately. Pure ADOPT -- minimal retone work. |
| 3    | Component primitives from components.css spec | Highest structural leverage: RangeStrip, Per100Stack, KpiBand, VerdictCallout, BreakdownBarList, ComparisonTable, ScorecardGrid are the building blocks of every cell/country page section in the page-content-map. |
| 4    | Charts: DistributionChart + supporting types  | The data pages need charts. Consolidate dataviz+charts here. |
| 5    | AtlasSpot illustrations                       | Editorial layer; needed for section openers and the "honest take" blocks. Retone pass required before port. |
| 6    | Motion primitives                             | Wire CountUp, ScrollReveal, SubTypeFade, ScoreGauge, OdometerNumber; extend existing motion/. |

---

## 6. What is explicitly NOT ported

| File / category                          | Reason                                                       |
|------------------------------------------|--------------------------------------------------------------|
| `atlas-reform.css`                       | Stale token source; superseded by `design-tokens.ts`         |
| `atlas-components.css` (as stylesheet)  | Spec blueprint only; live system is React/Tailwind/cva       |
| `atlas-icons.svg`, `atlas-pictograms.svg`, `atlas-spots.svg` (sprites) | Reference only; inline SVG via React data manifest is the production path |
| Any `.tsx`/`.jsx`/`.html` in `Margin-Atlas--5/` | Page-design work, out of scope for this asset plan |
| Page-design `.md` docs (HOMEPAGE.md etc.)| Separate page-layout audit                                   |
| Sets 17-20 (any file)                    | Asset-identical to `--5`; page-design reference only         |
| `README.md` inside `--5`                 | Stale palette + stale font list; ignore                      |
| `atlas-motion.js` / `atlas-motion2.js` as shipped scripts | Reference impls only; ported to typed React primitives |

---

## 7. Verification before any port ships

For each component ported from this plan:

- [ ] No raw hex, px, ms, or cubic-bezier in the component source
- [ ] All colour via Tailwind class or `colors.*` import from `design-tokens.ts`
- [ ] All motion timing via `duration.*` / `easing.*` from `design-tokens.ts`
- [ ] `forwardRef` + `displayName` + `cva` for any ui/ primitive
- [ ] Catalog story added to `src/app/_design/page.tsx`
- [ ] `motion-reduce:animate-none` or `prefers-reduced-motion` guard on every animated element
- [ ] No em-dashes in user-visible strings
- [ ] `npx tsc --noEmit` clean (run with permission)
- [ ] WCAG AA contrast verified for every colour pair introduced
