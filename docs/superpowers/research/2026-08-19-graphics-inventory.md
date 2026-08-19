# The graphics inventory, 2026-08-19

Every chart, bar, gauge, meter, map, sparkline, waterfall, plate and bespoke SVG
figure in `E:\atlas\website`, with what it encodes, how it encodes it, and where
it actually renders.

This is the substrate for the design review that asks, per graphic, "is this the
best way to show this?" It answers only the prior question: **what is there, and
what does it claim to show.** It passes no judgement on fitness.

Companion file, written from the rendered page rather than from source:
`docs/superpowers/research/2026-08-19-graphics-rendered-observations.md`. Where
this file says "static reading cannot tell", that file is the one that can.

---

## 0. How "where it renders" was established, and why the obvious method is wrong

The naive method - grep for a component name, or follow `import` edges from a
route - gives the wrong answer in this repo, in **both** directions. Both traps
fired during this inventory and both are recorded here so the numbers can be
re-derived rather than believed.

### Trap 1: the barrel makes dead components look site-wide

`src/app/layout.tsx` imports `@/components/kit`, and `kit/index.ts` re-exports
`kit/charts/index.ts`, which re-exports every chart in the family. Under plain
import-reachability, **every chart in `kit/charts/` is reachable from the root
layout, therefore from all 15 live route groups.** That is how `Waterfall`,
`HeatStrip` and `FootfallGrid` first appeared as "site-wide" graphics. They are
not. They are re-exported, not rendered.

The import chain that creates the illusion:

```
app/(site)/cities/[slug]/page.tsx
  -> components/kit/index.ts          (export { ... } from "./charts")
  -> components/kit/charts/index.ts   (export { Waterfall } from "./Waterfall")
  -> components/kit/charts/Waterfall.tsx
```

Every edge in that chain is an `export ... from`. Nothing mounts the component.
Confirm the barrel is the only referrer:

```bash
cd /e/atlas/website && grep -rn "from \"./Waterfall\"\|Waterfall" src --include=*.ts --include=*.tsx -l
```

### Trap 2: name-grep makes dead components look alive

Grepping `<Waterfall` finds
`src/app/(site)/download/2026-benchmarks/page.tsx:192`. That page does **not**
import the kit chart - it defines its own local `function Waterfall()` at line
219 of the same file. A same-name local component. Grep cannot see the
difference; a binding table can.

### The method actually used

A **render graph**, not an import graph. An edge `A -> B` exists only when file
`A` both imports the binding and mounts it as JSX (`<B ...>`), with imports
resolved through barrel re-exports back to the defining file. Reachability is
then computed from the App Router entrypoints.

Each graphic below therefore carries one of four statuses:

| Status | Meaning |
| --- | --- |
| **LIVE** | Mounted, transitively, from a non-`/dev` non-`_design` route entry |
| **DEV-ONLY** | Mounted only from a route under `src/app/dev/` |
| **DESIGN-ONLY** | Mounted only from `src/app/_design/`. **`_design` is a Next.js private folder (leading underscore) and is not routable at all**, and `next.config.js` sets no `pageExtensions` override. DESIGN-ONLY therefore means *renders nowhere*, dev included. |
| **NO CALL SITE** | Nothing in `src/` mounts it. Reachable only as a barrel re-export, or not at all. |

Counts, over `src/components/**`, from the render graph:

```
LIVE 226 | NO-CALL-SITE 65 | DESIGN-ONLY 31 | DEV-ONLY 21
```

Restricted to files that actually draw something (contain `<svg`, `viewBox`, or a
data-driven CSS `width`/`height`), the candidate set is **130 files**, of which
105 are under `src/components/`:

```bash
cd /e/atlas/website && { grep -rlE '<svg|viewBox' src --include=*.tsx; \
  grep -rlE 'width:\s*`?\$\{|style=\{\{[^}]*width|height:\s*`?\$\{' src --include=*.tsx; } \
  | sort -u | wc -l    # 130
```

---

## 1. The second axis: the six feature gates

"LIVE" is necessary but not sufficient. Six live routes branch at runtime on
`isSpineReformEnabledFor(page)` from `src/lib/feature_flags.ts`, and each branch
renders a **completely different set of graphics**. Two parallel surfaces exist
on the same URLs.

```bash
cd /e/atlas/website && grep -rn "isSpineReformEnabledFor" src/app --include=*.tsx | grep -v "^src/app/dev"
```

| Live route | Gate | Gate ON renders | Gate OFF renders | Master flag can enable? |
| --- | --- | --- | --- | --- |
| `/[country]` | `country` | `SpineCountry` = **`@/app/dev/spine/page`**, a dev route module imported into a live page | legacy country body (the `kit/engraved/*` family) | **No** - illustrative, master is hard-blocked |
| `/[country]/[geo]` | `region` | `SpineCityBody` with no data argument | legacy region body | **No** - illustrative |
| `/[country]/[geo]/[industry]` | `cell` | Spine 2 `CellPage` when `loadSpine2Cell` finds a reconciled file, else spine v1 `SpineCellBody` | legacy cell body | Yes |
| `/cities/[slug]` | `city` | `SpineCityBody` | legacy city body | Yes |
| `/cities/[slug]/neighborhoods` | `hood` | `SpineHoodBody` (London only; other cities fall through) | legacy hood body | Yes |
| `/industries/[industry]` | `industry` | `SpineIndustryBody` | legacy industry body | Yes |

A **seventh** gate sits on the homepage and is not part of the spine family:
`isHomeReformEnabled()` = `NEXT_PUBLIC_HOME_REFORM`, default OFF
(`src/app/page.tsx:288`). ON renders `home/home2-view.tsx`; OFF renders the
legacy homepage. Both mount `WorldMapClient`, so the world map survives the
branch, but the rest of the homepage graphics do not.

**What the repo cannot tell us.** With no environment variables set, every gate
resolves OFF - `resolveSpinePage` falls back to `isSpineReformEnabled()`, which is
`parseFlag(process.env.NEXT_PUBLIC_SPINE_REFORM, false)`. The per-page variables
are commented out in `.env.example`, absent from `.env.local`, and there is no
`vercel.json`. **The live values live in the Vercel project settings and are not
in this repository.** Whether the spine surface or the legacy surface is what
marginatlas.com actually serves today cannot be determined by reading the code.

**63 of the 226 live-reachable components are reachable only through a gated
branch.** They are marked `GATE-ONLY` below. Reproduce with the `gated` command
of the render-graph script.

Consequence for the review: the cell page's entire Spine 2 chapter kit
(`spine2/*`, chapters `Ch01`-`Ch21`) is GATE-ONLY behind `cell`. If that gate is
off in production, **none of the ~20 spine2 graphics below are on the live site**,
and the legacy cell body's graphics are what readers see.

---

## 2. How to read the inventory

One entry per graphic. A graphic is anything that encodes a quantity in geometry
(an SVG shape, or a data-driven CSS `width`/`height`), plus maps and bespoke
figures. Text-only badges, chips, pills and stat cards are excluded and named at
the end of each section.

`GATE-ONLY` means the route is live but the graphic sits behind one of the seven
feature gates in section 1, so its presence on the production site cannot be
confirmed from the repository.

---

## 3. Maps

Five map surfaces. Two are real cartographic projections rendered from TopoJSON,
two are MapLibre raster embeds, and one of the five is the only map that puts a
quantity on the geography at all on a live route.

### 3.1 WorldMapPicker - the homepage country picker

- **Path** `src/components/WorldMapPicker.tsx`
- **Encodes** Nothing. **No quantity is on this map.** It is a country-selection
  control: click a country, route to `/{iso2}`.
- **Channel** Navigation only. Fill is pure interaction state (`fillFor()`):
  selected `atlas-700`, pressed `atlas-600`, hovered `atlas-500`, all others
  `paper-200`.
- **Family** Bespoke interactive political basemap.
- **Where** LIVE on `/`. Chain: `app/page.tsx:540` -> `home/WorldMapSection.tsx`
  -> `home/WorldMapClient.tsx` -> `WorldMapPicker`. Also mounted directly by
  `home/home2-view.tsx:167`, so it survives the homepage gate either way.
- **Projection** `react-simple-maps`, `geoNaturalEarth1`, `projectionConfig scale:
  175`, TopoJSON `countries-110m` served locally from `/geo/countries-110m.json`
  (~250 paths). Antarctica (`id 010`) forced to parchment at `opacity 0.55`;
  Western Sahara (`732`) gets a dashed stroke.
- **Scale** No value axis. Zoom only: `MIN_ZOOM 1`, `MAX_ZOOM 6`, `ZOOM_STEP 1.5`.
- **Labels** No country labels printed. Hover tooltip shows the name. Fallback
  grid prints 30 bare ISO2 codes.
- **Colour** 6 values, all tokens. No ordered quantity, so no hue question.
- **Responsive** `viewBox` 980x470 with `width:100%, height:auto`. Default
  `preserveAspectRatio`, no distortion. `vectorEffect: non-scaling-stroke`.
- **A11y** Strong. `role="application"` plus arrow-key/Enter navigation,
  per-country `role="button"` and `aria-label`, labelled zoom buttons,
  `role="region"` fallback. Gap: the hover tooltip has no `aria-live`.

### 3.2 CitiesWorldMap - the /cities hero

- **Path** `src/components/cities/CitiesWorldMap.tsx`
- **Encodes** Nothing. Marker position is the city's real lat/lon. It answers
  "which cities are covered", not "how much".
- **Channel** Navigation only. **Marker radius is constant per zoom
  (`2.5 / pos.zoom`), not data-driven** - the size channel is spent on legibility
  rather than on a quantity.
- **Family** Bespoke dot-on-basemap locator.
- **Where** LIVE on `/cities`, mounted at `app/(site)/cities/page.tsx:310`. Not
  gated.
- **Projection** `geoEqualEarth`, `PROJECTION_SCALE 193.81`, `PROJECTION_CENTER
  [0, 6.886]`, both derived by fitting the 176 inhabited countries. Antarctica
  filtered out entirely.
- **Scale** No value axis. Zoom clamped 1..4; coordinates clamped to y `[-55, 75]`.
- **Labels** No printed city labels. Hover/focus tooltip with flag emoji and name.
  One instruction chip reading "Click a city".
- **Colour** 5 values. One accent for all markers, no ordered quantity.
- **Responsive** `viewBox` 1100x480 inside `aspect-[1100/480]` - the aspect ratio
  is deliberately matched to the viewBox to kill letterboxing.
- **A11y** Good. `role="region"`, every marker a real `<a>` with
  `aria-label="{name}, {iso2}"`. Gap: no `<title>` on the SVG.

### 3.3 SpineMap - proportional-symbol map, the only live map carrying a quantity

- **Path** `src/components/spine/SpineMap.tsx`
- **Encodes** Reusable primitive. `signal` is a 0..100 scalar whose meaning is set
  per call site:
  - `spine/city/where-to-trade.tsx:72` - **`signal: 50`, a hardcoded constant.**
    On the London-districts map every dot is therefore the same size and the size
    channel carries nothing. Only the printed `rent x{n} the city level` is real.
  - `spine/NeighborhoodExplorer.tsx:650` - lightness of the lease,
    `20 + ((hi - rent) / span) * 80`.
  - `app/dev/spine/page.tsx:1045` - market reach against the top city = 100.
  - `app/dev/index-world/page.tsx:204` - the margin an owner keeps.
- **Channel** **Two channels.** (1) Dot diameter `12 + (sig / 100) * 12`, i.e.
  12px..24px - linear in *diameter* but read as *area*, so a 2x signal paints
  roughly 4x the ink. (2) Hue: `tone: "terra" | "ink"`, documented as above or
  below the page's baseline.
- **Family** Bespoke proportional-symbol (graduated point) map over a MapLibre
  raster basemap (Carto Positron `light_nolabels`, no API key).
- **Where** LIVE but **GATE-ONLY** on four routes: `/[country]` (gate `country`),
  `/[country]/[geo]` (gate `region`), `/cities/[slug]` (gate `city`),
  `/cities/[slug]/neighborhoods` (gate `hood`). Also `/dev/index-world`,
  `/dev/spine`, `/dev/spine-city`, `/dev/spine-hood`.
- **Scale** **Does not start at zero.** Domain hardcoded 0..100 with a clamp;
  range is the literal 12..24px, so signal 0 still paints a 12px dot. A missing
  `signal` **defaults to `50`** and paints a mid-size dot rather than a null
  state. The 12..24 ramp is shared across every instance, but the *meaning* of
  0..100 is per-call-site, so two SpineMaps are not comparable with each other.
- **Labels** Direct label beside every dot, greedily decluttered by signal rank
  using label bounding boxes. Popup prints name, `signalLabel`, sub. Optional
  legend card shows two literal swatch circles, 8px and 16px - **a size key with
  no numbers on it.**
- **Colour** Two data fills, **hardcoded hex rather than tokens**: `TERRA_ACCENT
  "#c2410c"` and `INK "#1b1b1a"`. **HUE VIOLATION**, see section 8. The canvas
  also carries `filter: sepia(.10) saturate(.92) brightness(1.02)`.
- **Responsive** Fixed Tailwind heights (`h-[440px] md:h-[560px]`; the country
  page overrides to `h-[300px] md:h-[360px]`). Markers are DOM elements at fixed
  px, so they do not scale with the container.
- **A11y** The best in the repo. `role="application"`, every marker a real
  `<button>` with an `aria-label`, `map.keyboard.enable()`, and a **full text
  fallback**: until `ready` (server render, no-JS, or no-WebGL - the constructor
  is wrapped in try/catch) an overlay lists every point as a clickable pill.
  Honours `prefers-reduced-motion`.

### 3.4 CityDistrictMap - district wealth pins

- **Path** `src/components/city2/CityDistrictMap.tsx`
- **Encodes** Resident wealth of each district against the city's own average, in
  five ordered bands (`well-below` .. `well-above`); `null` means not read yet.
  The popup adds rent against the city rate.
- **Channel** **Marker fill colour only.** Pin size is constant
  (`.dmpin{width:14px;height:14px}`), so nothing is encoded in geometry. A null
  band renders transparent with a dashed border.
- **Family** Choropleth-by-proxy - point symbols coloured by band. The file is
  explicit that it draws no district boundaries, and that the pin sits on the
  district's high street rather than its centroid.
- **Where** **DEV-ONLY**, `/dev/city2`. Chain: `app/dev/city2/page.tsx:25` ->
  `city2/page/CityPage.tsx:522` -> `CityDistrictMap`. No production route.
- **Scale** Five discrete stops, deliberately not a gradient. Shared across all
  pins in one map. Extent per-instance via `LngLatBounds` in the constructor.
- **Labels** Direct label beside every pin, haloed. Legend below listing only the
  bands actually present. The heading names the comparison explicitly.
- **Colour** Five fills read at runtime from CSS custom properties so map and
  legend cannot drift. **HUE VIOLATION plus a non-monotonic lightness ramp**, see
  section 8.
- **Responsive** Fixed pixel height, `360px` (`atlas-spine.css:1834`); width
  fluid. `cooperativeGestures: true` guards page scroll on touch.
- **A11y** Strong. `role="application"` with a descriptive label, every pin a real
  `<button>` carrying its band in the `aria-label`, legend `aria-hidden` (safe,
  since the band is in each pin's label), and a text fallback: on failure the
  district list below "carries every fact the map does".

### 3.5 What no map does

No map in the repo is a **polygon choropleth** and none is a **cartogram**. The
one map that encodes a quantity on a live route (SpineMap) does it with symbol
size, and its single largest call site passes a constant. On the country page the
quantity a reader most wants on a map - where the money actually is - is not on
one.

---

## 4. The `board` chart kit - four of five render nowhere

`src/components/board/charts/`. Five charts. **Only `SpreadBar` reaches a live
route.** The other four are mounted only from `src/app/_design/page.tsx`, and
`_design` is a Next.js private folder, so they render on no URL at all - not even
in dev.

### 4.1 SpreadBar - LIVE

- **Path** `src/components/board/charts/SpreadBar.tsx`
- **Encodes** The p10..p90 range of a distribution with the median marked. Live
  feed at `app/(site)/industries/[industry]/across/page.tsx:495`: **annual revenue
  per firm** for one trade in one city, one bar per city row.
- **Channel** x-position along a horizontal track. `scaleLinear({ domain: [p10,
  p90], range: [padX, W - padX] })`; median a vertical rule, endpoints two ticks.
- **Family** Range/interval strip; closest standard family is a one-dimensional
  box plot.
- **Where** LIVE, `/industries/[industry]/across`. Ungated. Also mounted in
  `_design`.
- **Scale** **Not zero-based, and per-row rather than shared.** The domain is
  `[p10, p90]`, so the track always spans the full width. In the across-cities
  table **every city's bar is drawn exactly the same length**, whatever its real
  spread; only the `$` endpoints printed underneath distinguish a tight
  distribution from a wide one. The only comparable information is the median's
  relative position inside its own range. Geometry hardcoded `W 320`, `H 64`.
  Returns `null` when `p90 <= p10`.
- **Labels** **None inside the SVG.** The across page prints the endpoints in a
  separate sibling row. The median value is never printed next to its marker.
- **Colour** 3: `fill-parchment` track, `stroke-atlas-500` median,
  `stroke-cocoa-500` ticks. Roles, not ranks. No hue violation.
- **Responsive** `viewBox` plus `h-auto w-full` inside `max-w-[400px]`. Default
  `preserveAspectRatio`.
- **A11y** `role="img"` with a **value-free** label: "Spread from the bottom tenth
  to the top tenth, with the median marked." No figure, no unit, no place name -
  **a screen-reader user hears the identical sentence for every city in the
  table.**

### 4.2 CostBar - DESIGN-ONLY, renders nowhere

- **Path** `src/components/board/charts/CostBar.tsx`
- **Encodes** Where revenue goes - each cost line as a share of revenue.
- **Channel** Segment width along one horizontal bar; fill cycles
  `SEGMENT_FILLS[i % n]`, so colour encodes segment identity, not magnitude.
- **Family** 100% stacked bar.
- **Where** `_design/page.tsx:68` only. **Renders on no URL.**
- **Scale** Zero-based by construction, but **normalised**: segments always fill
  the full `W = 320`, so shares summing to 70% and to 100% look identical.
- **Labels** **None at all.** No legend, no ticks, no direct labels. The only text
  is the `aria-label`.
- **Colour** 5 fills: `fill-atlas-500`, `fill-cocoa-500`, `fill-cocoa-300`,
  `fill-parchment`, `fill-atlas-300`. Categories, not a scale. No hue violation.
- **Responsive** `viewBox` plus `h-auto w-full`, `max-w-[400px]`.
- **A11y** `role="img"` with the full data in the label ("Cost shares of revenue:
  rent 28%, labour 31%, ...").

### 4.3 CrowdingGauge and 4.4 RentGauge - DESIGN-ONLY, near-duplicates

- **Paths** `src/components/board/charts/CrowdingGauge.tsx`,
  `src/components/board/charts/RentGauge.tsx`
- **Encodes** CrowdingGauge: market crowding 0..100, higher = more crowded = less
  room. RentGauge: rent-to-revenue pressure 0..100, higher = rent eats more of
  revenue. Both are the inverse framing of a positive score, and both say so.
- **Channel** Arc sweep angle (`@visx/shape` `Arc`, `-PI/2` to `+PI/2`), **plus a
  second redundant channel**: fill darkness steps at the literal thresholds
  `v >= 66` and `v >= 33`.
- **Family** Half-circle gauge/dial.
- **Where** `_design/page.tsx:70` and `:71` only. **Render on no URL.**
- **Scale** Zero-based, max hardcoded to the literal `100`. Fixed domain, so
  shared across instances. `W 120`, `H 72`, `outer 52`, `inner 38`.
- **Labels** One direct label - the rounded value at the centre. No "/100", no
  endpoints, no ticks, no legend, no threshold key.
- **Colour** 4 fills each; value fill is `fill-cocoa-300` -> `fill-cocoa-500` ->
  `fill-clay-500`. **PARTIAL HUE VIOLATION**, see section 8.
- **Responsive** `viewBox` plus `h-auto w-full` inside a **fixed-width**
  `figure w-[150px]`.
- **A11y** `role="img"` with the figure and the polarity in the label. Returns
  `null` on a non-finite value.
- **Duplication** These two files are byte-near duplicates apart from the label
  string. See section 7.

### 4.5 SurvivalCurve (board) - DESIGN-ONLY

- **Path** `src/components/board/charts/SurvivalCurve.tsx`
- **Encodes** Share of businesses in the trade still trading at years 1, 3 and 5.
- **Channel** Slope / line position (`@visx/shape` `LinePath`), one dot per real
  point. Missing years are dropped, not interpolated.
- **Family** Three-point line.
- **Where** `_design/page.tsx:69` only. **Renders on no URL.** Note there is a
  **second, different** `SurvivalCurve` at
  `src/components/spine/industry/forms.tsx:130` which *is* live - see section 7.
- **Scale** **Zero-based on y and hardcoded on both axes**: x `domain [1, 5]`, y
  `domain [0, 100]`, so curves stay comparable across pages by design. Returns
  `null` with fewer than two real points.
- **Labels** **None.** No ticks, no year labels, no percent labels, no legend.
- **Colour** 2: `stroke-parchment` baseline, `stroke-atlas-500` line and dots. No
  hue violation.
- **Responsive** `viewBox` plus `h-auto w-full`, `max-w-[400px]`.
- **A11y** `role="img"` with the full series in the label.

### 4.6 DriverBar - LIVE, inline inside BreakInScore

- **Path** `src/components/board/BreakInScore.tsx` lines 136-170 (non-exported,
  inside `BreakInWhy`)
- **Encodes** The three sub-scores the break-in rating blends, each 0..100, higher
  = easier: **Payback** (capital plus permits over annual owner take-home),
  **Speed to open** (weeks from decision to opening day), **Room to enter**
  (competitors per 10,000 residents).
- **Channel** CSS bar length, `width: {pct}%`, clamped 0..100.
- **Family** Progress meter, three side by side.
- **Where** LIVE, `/[country]/[geo]/[industry]/opening`. Ungated.
- **Scale** Zero-based, max hardcoded `100`, shared across all three bars.
  **Important distortion the file documents itself:** the three bars are drawn
  equal width but the blend is **not** equal - `break_in_rating` weights payback
  at 0.58 against 0.24 and 0.18. The geometry implies a three-way average the
  reader cannot reproduce; the mitigation is a sentence, not a visual.
- **Labels** Direct labels above each bar: the uppercase driver name left, the
  rounded score right. Footnote: "Each runs 0 to 100, higher is easier, and
  payback counts for most of it."
- **Colour** 2: `bg-parchment` track, `bg-atlas-500` fill. One accent at one
  intensity for all three. No hue violation.
- **Responsive** CSS percentage fill; fixed `h-1.5` track.
- **A11y** **NONE on the bar.** No `role="progressbar"`, no `aria-valuenow`, no
  `aria-label`, no `aria-hidden` on the decorative track. The label and value are
  real text beside it, so the information is reachable, but the geometry is
  unannotated.

### 4.7 MastheadImage - LIVE, atmosphere only

- **Path** `src/components/board/MastheadImage.tsx`
- **Encodes** Nothing. One resolved place photo behind a masthead.
- **Channel** No data channel. `object-cover` at `opacity-20` with
  `grayscale(0.55) contrast(1.02) saturate(0.7)` and a three-stop
  `rgba(255,247,230, ...)` wash. That literal is a warm cream, an inline `rgba()`
  rather than a token, which sits against the 2026-08-17 cream purge.
- **Family** Photographic plate.
- **Where** Mounted by `countries/CountryMastheadImage.tsx:37`. **NO CALL SITE**
  for `CountryMastheadImage` itself - see section 9.
- **Labels** None, deliberately: no attribution string is ever rendered (R-002).
- **A11y** `aria-hidden` on the wrapper, `alt=""`, `pointer-events-none`. Returns
  `null` when `!src`.

---

## 5. The `ui` kit

Only two files in `src/components/ui/` encode magnitude geometrically.

### 5.1 ProgressBar - LIVE

- **Path** `src/components/ui/progress-bar.tsx`
- **Encodes** Reusable primitive. Live feeds:
  - `app/(site)/coverage/[iso2]/page.tsx:169` - the share of a country's cells in
    each confidence tier A/B/C/D, `max={100}`.
  - `app/(site)/decide/[activity]/[city]/page.tsx:383` - **expected net margin**
    for a neighbourhood, `max={maxMargin}` hoisted out of the map so the three
    cards share one scale.
- **Channel** CSS bar length plus a `tone` colour.
- **Family** Progress meter.
- **Where** LIVE on `/coverage/[iso2]` and `/decide/[activity]/[city]`. Ungated.
- **Scale** Zero-based; `max` defaults to `100`; clamped by default. On `/decide`
  the scale is deliberately shared across the three cards - the page comments it:
  "a 12% bar next to an 18% bar actually looks 2/3 as long".
- **Labels** Optional only, and **neither call site passes them**; both print
  their figure in a sibling element instead.
- **Colour** 5 tones. **HUE VIOLATION plus a reversed intensity step**, see
  section 8.
- **Responsive** CSS percentage fill, fixed px track heights.
- **A11y** `role="progressbar"` with `aria-valuenow/min/max`, but **no
  `aria-label` or `aria-labelledby` at either call site**, so the bar announces a
  bare number with no name.

### 5.2 BarList - NO CALL SITE

- **Path** `src/components/ui/bar-list.tsx`
- **Encodes** Reusable ranked-metric list. The header's stated use case is density
  comparisons: "A pharmacy density of 3.5 vs a doctor density of 0.48 (7x gap) is
  invisible in a table; obvious here". **It is fed nothing today.**
- **Channel** Bar length as a CSS percentage, plus optionally colour intensity for
  rank (`RANK_RAMP` = `atlas-700/600/500/400`), plus row order.
- **Family** Table-with-bars.
- **Where** **NO CALL SITE.** Nothing in `src/` imports it. The other "bar-list"
  matches in the repo are prose in `spine/hood/hood-view.tsx:22`,
  `spine/kit-index.tsx:222` and `spine/NeighborhoodExplorer.tsx:19` describing
  *different* components.
- **Scale** Zero-based **with a floor**: `Math.max(2, (value / max) * 100)`, so a
  true zero still paints a 2%-wide bar. Max derived per instance, shared across
  rows within one list.
- **Labels** Direct labels on every row: name, optional caption, formatted value
  right-aligned in `tabular-nums`.
- **Colour** One fill by default; up to four in gradient mode, all from the single
  atlas ramp. **No hue violation** - the file states it: "The shade ENCODES rank,
  so it stays honest, not decorative."
- **Responsive** CSS percentage widths, fixed px bar heights, CSS grid row.
- **A11y** Track is `aria-hidden="true"`; name and value text carry the meaning.

### 5.3 PercentileStrip - LIVE

- **Path** `src/components/charts/PercentileStrip.tsx`
- **Encodes** The distribution of **annual revenue across firms in one cell** -
  p10, p25, p50, p75, p90 - with an optional "you are here" marker for the
  visitor's own revenue.
- **Channel** x-position on a **logarithmic** axis, with nested rectangle extents
  for the two ranges and vertical rules for the median and for "you".
- **Family** Nested-interval / percentile strip; closest standard family is a
  one-dimensional box plot.
- **Where** LIVE, `/calculator`, mounted at `components/CalculatorForm.tsx:346`.
  Also `/dev/calculator`. Ungated.
- **Scale** **Log axis, not zero-based, and undeclared.** `lo = max(1, p10 * 0.85)`,
  `hi = p90 * 1.18`, so the domain is padded 15% below and 18% above and the strip
  always fills the same width whatever the real spread. Values outside the domain
  are clamped, so a user revenue far above p90 pins to the right edge. **Nothing
  on the graphic tells the reader the axis is not linear.**
- **Labels** The richest in the repo. Literal strings "BOTTOM 10%", "TOP 10%",
  "TYPICAL", "YOU", each with its formatted value beneath. **p25/p75 are drawn but
  never labelled or named.**
- **Colour** 6, separating roles rather than ranks; the one ordered relationship
  (full range -> middle half) runs `paper-350` -> `atlas-200`, neutral to a single
  tinted accent. No hue violation.
- **Responsive** `viewBox` 760x92 plus `w-full h-auto`. Fixed `fontSize` values
  scale with the viewBox, so labels shrink proportionally at narrow widths.
- **A11y** `role="img"` naming p10, p50 and p90. **The "you" value is absent from
  the label** - the visitor's own marker, the reason the chart is on the
  calculator, is not announced. p25/p75 are absent too.

---
