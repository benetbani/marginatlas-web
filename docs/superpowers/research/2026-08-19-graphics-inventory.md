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

## At a glance

Roughly **150 distinct graphics** across four parallel kits plus page-level
one-offs. The five things a reviewer should know before opening section 3:

1. **Roughly 30 graphics have no mount point at all**, nine of them in `spine2`.
   A further nine are mounted on the live country page but permanently fed
   `notHeld<...>()`, so only their empty states ship. Nine more render only from
   `src/app/_design/`, which is a Next.js private folder and is not routable, so
   they render on no URL whatsoever. **Four of the five `board/charts` are in that
   last category.**

2. **Seven runtime feature gates split the spine pages and the homepage into two
   surfaces each, and which one production serves is not in this repository.**
   63 of 226 live-reachable components sit behind a gate, including the entire
   rebuilt cell page.

3. **The same question is answered five or six times in different code.** Six
   percentile-spread implementations that disagree about the axis, five
   "where each $100 goes", five month-of-year charts that disagree about whether
   the baseline is zero or the average, nine gauge geometries, three components
   named `Waterfall` of which one is a waterfall and it has no call site.

4. **One systemic colour violation, and it is on the default-live country page.**
   `meaningStep` in `kit/engraved/primitives.tsx` colours ten sections with a
   five-step ladder that is **non-monotonic on hue, luminance and saturation at
   once**, whose top two steps are byte-identical, and which is displayed to the
   reader as a legend. Measured figures in section 11.1.

5. **Accessibility is bimodal, not weak.** `RangeStrip`, `Slider`, `SpineMap`,
   `AtlasMark` and `DistributionVisual` carry generated descriptive labels and
   real text fallbacks. Against that, several graphics encode a quantity with **no
   text or aria equivalent at all**: `CitiesGrid`'s 0-5 climate dots,
   `CharacterPanel`'s spectrum node, `CostDrivers`' 1-3 impact ticks,
   `Fitgrid`'s dots, and `sections.tsx`'s month bars, whose label names neither a
   month nor a value.

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

## 1. The second axis: the seven feature gates

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

## 6. The `spine` v1 kit

`src/components/spine/`. The largest family. Everything here is **GATE-ONLY**
except `kit.tsx` / `kit-index.tsx` primitives reached from `/margin-index` and
the reformed homepage.

### 6.1 Reusable primitives in `kit.tsx`

| Graphic | Encodes | Channel | Family | Where | Scale | Labels | A11y |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `Gauge` | any 0-100 score; live feed is ease of entry | Arc sweep angle + needle angle, redundant with the printed number | Gauge/dial | `/dev/decide` only | Zero-based, max hardcoded `100`, geometry `R 74, cx 100, cy 86` | Value at centre, optional end labels | `role="img"`, `"{v} out of 100"` |
| `Donut` | Part-of-whole split. Cell page: share of weekly covers by daypart | Arc length via `strokeDasharray`; colour is categorical identity only | Ring/donut | Cell page (GATE-ONLY), `/dev/spine` | Fixed 100% circumference, `r 54`. **Caps at 5 slices**, 6+ roll into one "Other" | No per-slice labels in the SVG; centre figure only. Percentages live in the caller's swatch list | `role="img"` carrying **only the centre figure, never the slice percentages** |
| `Dots` | Discrete 0..max score (lens score, safety score) | Dot count, filled vs empty pips | Dot/unit | `/dev/spine` only | Zero-based, max defaults `10` | None printed; caller's row carries the score | `role="img"`, `"{score} out of {max}"` |
| `MiniBar` | A single 0-100 percentage | Bar length | Progress meter | `kit-index` Podium, `/dev/decide` | Zero-based, max 100, **unclamped** - `pct > 100` overflows and is silently truncated by `overflow-hidden` | **None.** No axis, no figure | `role="img"`, `"{pct} percent"` - in Podium this announces the **rescaled** figure, not the real keep % |
| `IndexBar` | A percentage, or an index against a top-group baseline of 100 | Bar length + a reference tick at 100 | Bar with reference | **Showcase only** (`/dev/spine-kit`) | Zero-based. `domainMax = isIndex ? Math.max(100, value) : 100` - the domain **extends to meet** an above-baseline value. **Per-instance, so two index rows do not share a scale** | Trailing figure. The tick at 100 is drawn but **carries no printed "100"** | `role="img"` with the index and the baseline |
| `StackBar` | 100%-stacked share split. Live: where each $100 of sales goes; tax share; payment mix | Segment length + **segment order** (size-descending, kept pinned last) + **grey darkness remapped to magnitude** via `GREY_RAMP` | Stacked bar | Cell, industry, `kit-index`, `/dev/spine` (all GATE-ONLY except kit-index) | Zero-based, whole 100. `normalize` divides by the actual sum so 98/101 rounding still fills edge to edge | Optional legend with swatch + label + `{pct}%`. Without a legend each segment carries a native `title` - **hover-only** | `role="img"` with a required `ariaLabel`; every call site passes the full segment list |
| `ShareStack` | A lone percentage given a 2-3 segment shape. Live: how customers order (dine-in / delivery / takeaway) | Segment length; largest carries the accent | Stacked bar | Cell page (GATE-ONLY), showcase | Zero-based, normalised. **Self-omits** below 2 segments or when the sum is more than 2 points off 100 | On-bar labels when **every** segment is >= 24%; otherwise a legend row. Never hover-only | `role="img"` with full data |
| `Waterfall` | "Each row a share of revenue" | Bar length per row | **Bar, misnamed** - no running level, no connectors, no floating bars | `/dev/decide` only | Zero-based, max 100, hard-clamped | Row label + `{pct}%` | `role="img"` on the **inner fill**, so the empty remainder is unlabelled |
| `SpreadStrip` | p10/p50/p90 percentile spread. Live: yearly turnover across comparable rooms | Marker x-position of p50 within p10..p90. **The track carries no magnitude** | Percentile strip | Cell masthead (GATE-ONLY) | **Not zero-based**, domain `[p10, p90]`, per-instance. **Two strips side by side look identical for wildly different spreads** | All three figures printed | `role="img"` with all three |
| `EaseScale` | N labelled markers on one shared scale. Live: risk inverted to safety (`safe = 11 - score`) | Marker x-position on a shared track | Dot-on-track | Cell interactive (GATE-ONLY), `/dev/spine` | Zero-based 0-100, **shared across rows** - the primitive's whole point | Row label, the `word` above each marker, optional end labels | `role="img"` announcing **the word, not the numeric position** |
| `Meter` | A single 0-100 read. Live: break-even utilisation | Bar fill length **plus** a marker dot at the same position (double-encoded) | Progress meter | Industry view (GATE-ONLY) | Zero-based, max 100, **unclamped** | **No value on the meter**; two end labels only | `role="img"`, `"{value} out of 100"` |
| `SpectraTable` | Two-pole character spectra. Live: how business runs here | Marker x-position between poles; in `gradient` mode the track additionally asserts a good direction | Two-pole spectrum | City view (GATE-ONLY), `/dev/spine` | 0-100 **clamped to 5..95**, so a true 0 or 1 is misdrawn inward | Pole labels only. **No printed numeric position anywhere** | `role="img"` announcing a lean word, not the position |
| `PhaseBar` | The first-year path: Fit-out / Ramp / Profit with the break-even week | Segment length on a shared week axis + a tick at break-even | Phase strip (Gantt-like) | Cell + industry (GATE-ONLY) | Zero-based on weeks. `horizon = Math.max(horizonWeeks, breakevenWeek)` - **extends rather than clipping** a late break-even. Self-omits on a null break-even | Floating "Break-even, week {n}" with edge-aware anchoring; axis ends; swatch legend | `role="img"` with full data |
| `StruckLine` | Overlay: a folklore claim drawn as a phantom on the host chart's own scale, struck out | Line path projected through the **host's** `X()`/`Y()`, plus a strike stroke | Annotation overlay | Cell page (GATE-ONLY), showcase | **No scale of its own by design** - the caller projects through the host's identical functions | `line-through` text, default "folklore" | `aria-hidden` - deliberate; the caller folds the claim into the host's label |
| `Spark` | A series given a shape | Line slope + filled area | Line/spark | **NO CALL SITE** | Not zero-based - the data min pins to the baseline | **None at all** | `role="img" aria-label="trend sparkline"` - a static string carrying no data |
| `Timeline` | Milestones on a continuous time axis with phase bands | x-position by real time; band width; stacked lanes for de-collision | Annotated time axis | **NO CALL SITE** (superseded by `PhaseBar`) | Zero-based on time; span derived when 0 | Node labels, axis ends, band labels when >= 46px, a numbered `<ol>` legend for crowded nodes | `role="img" aria-label="milestone timeline"` - static, **no node data reaches it**. The mobile `<ol>` partly compensates |
| `Spectrum` | The earlier two-pole spectrum row | Marker x-position on a three-stop gradient | Two-pole spectrum | **NO CALL SITE** | 0-100, **no clamp** - a 0 sits half outside the track | Pole labels. No numeric value | `role="img"` **omitting the position entirely** |

### 6.2 Reusable primitives in `kit-index.tsx`

| Graphic | Encodes | Channel | Family | Where | Scale | Notable |
| --- | --- | --- | --- | --- | --- | --- |
| `CellScaleBar` | "The ONLY legal in-cell bar" for a tabular support figure | Bar length **from the reference tick** when `refValue` is given, else zero-based | Diverging bar / bar | Internal to `DecisionRow` and `CompareTable`. **No shipping page passes a `bar` spec** | **Explicitly non-zero-based and declared**: `domain: [lo, hi]` required | The code documents why: a left-edge fill on a truncated domain drew a 120-vs-76 pair as ~3.7:1 for a true 1.6:1. `aria-hidden` by design |
| `DecisionRow` | One ranked place: **the kept share of revenue**, plus N support signals | Bar length (embedded `StackBar`) + optional `CellScaleBar` + row order | Table-with-bars | **LIVE and ungated** on `/margin-index`; also `/dev/decide`, `/dev/decide-v2` | Zero-based, max 100, **shared across every row** | `keptKnown === false` renders `pct: 0` and a dash rather than "0%" |
| `RankBars` | A labelled entity-scoped ranking | Bar length scaled to the leader + row order + printed figure | Bar | **LIVE** on `/` (reformed homepage branch), `/dev/index-extremes` | Zero-based. Max **derived from data** (`Math.max` of the series) unless overridden. Minimum drawn width 2%, so a near-zero row still shows a stub. Shared across rows | **No mobile stack** - at 375px the 9rem label plus 3.4rem value column squeezes the bar hard |
| `CompareTable` | Entities as columns, decision metrics as rows. Live: peer cities as home-relative deltas in percentage points | **Primarily text with typographic emphasis** - best-per-row is bold terracotta. Geometry only when a row declares `bar`, which no shipping call site does | Table-with-bars (bars currently unused) | City view (GATE-ONLY), `/dev/decide` | Per-row `bar.domain` when supplied. Best-per-row **excludes the home entity by default** | **A11y: NONE on the table** - no `role="table"`, no caption element |
| `Podium` | Top-3 ranked cards on kept share | Bar length (embedded `MiniBar` **rescaled to the leader**) + rank order + card emphasis | Bar, card-embedded | `/dev/decide`, `/dev/decide-v2` | Zero-based but **leader-normalised**: #1 always draws a full bar regardless of its real value | **The bar's length does not match the printed percentage.** Non-leaders greyed with `filter: grayscale(1)` rather than repainted |
| `MarginIndexBadge` | The unified 0-100 composite of keep/ease/risk/demand | Arc length of a ring + the printed number | Ring gauge | **LIVE and ungated** on `/margin-index`; `/dev/decide-v2` | Zero-based, max hardcoded 100. **Self-omits** on null - "no honest score -> render nothing (never a fabricated 0)" | All CSS vars, no raw hex |

### 6.3 `marks.tsx` - the 29-id status glyph set

- **Path** `src/components/spine/marks.tsx`
- **Encodes** Status and provenance, **not data**: the verdict trio
  (`keeps-more` / `keeps-less` / `at-baseline`), the confidence ladder
  (`measured` / `modeled` / `modeled-hatch` / `sample` / `directional`), the trend
  trio, plus lock, badge and bookmark marks.
- **Channel** Fixed hand-drawn geometry. Chevron direction and arrow slope encode
  **sign only, never magnitude**. `modeled` fills a half-circle; `modeled-hatch`
  clips diagonal hatching to it; `sample` is a dashed ring. Nothing is
  data-driven.
- **Where** LIVE, used across cell, city, hood, industry mastheads and the
  homepage. Mixed gated and ungated.
- **Colour** All CSS vars, no raw hex. The house rule "terracotta once per mark,
  only on the meaningful part" holds. The verdict trio does use two hues
  (`keeps-more` in `--terra-text`, `keeps-less` in `--c-ink`) but this is a
  **categorical good-vs-bad pair with no ordered magnitude**, and the chevron
  direction carries the sign redundantly. Not a violation.
- **A11y** **The best in the repo**: `role="img"`, `aria-label`, **and** a real
  `<title>` child. Mask and clip ids are unique per mark so repeats never collide.

### 6.4 Inline graphics in the page views

These are defined inside the view files rather than as separate components.

| Graphic | File | Encodes | Family | Scale | Notable |
| --- | --- | --- | --- | --- | --- |
| RentStrip | `NeighborhoodExplorer.tsx:155` | Each district's **commercial rent as a multiple of the city level**, as deviation from x1.00 | Diverging bar | **Not zero-based - centred on x1.00.** Symmetric span derived with a `0.2` floor so a tight-spread city does not draw full-width bars for trivial deviations. Shared across rows | "Selection never moves the accent... the page's one color keeps one meaning" - both sides of the divergence use the same grey; only rank 1 is terracotta |
| FootfallScale | `NeighborhoodExplorer.tsx:303` | Weekday and weekend **trade intensity** as two positions on one shared axis | Dumbbell / two-marker | Zero-based 0-100 hardcoded; defaults to `{50, 50}` when absent | The busier label is bolded - weight, not colour. Renders on the illustrative seed only (`adapt_hood` omits `footfall` on real data) |
| PriceTierBand | `NeighborhoodExplorer.tsx:345` | A district's **price tier** | Dot/unit, 4 discrete pips | 4 fixed steps; an unrecognised tier silently falls to index 0 | Replaced a continuous Meter that "manufactured false precision (a made-up 28/52/78/96 position for a categorical read)" |
| WalkTrack | `NeighborhoodExplorer.tsx:370` | Walkability / foot-traffic level | Marker on a track | Zero-based 0-100. The categorical fallback maps three words to **literal 30 / 58 / 90**, unknown to **50** | **No printed numeric value**, and the `aria-label` is a static string omitting the value - the number is unavailable to a screen reader |
| RankSlope | `NeighborhoodExplorer.tsx:700` | **Revenue rank against rent rank** per district - the page's myth-buster | Slope / bump chart | Ordinal rank, height derived from the district count | Below `sm` **only two labels survive**, the loudest and the lightest. Long descriptive `aria-label` naming the mechanism |
| WhoSuits | `cell/cell-view.tsx:93` | The four **operator demands** (hours, capital, physical load, hands-on) as Low/Mid/High | Dot/unit, 3 pips | Bucketing hardcoded at `>= 67` and `>= 34` | Replaced continuous Meters - "a drawn position fakes a precision the coarse 20/50/80 honesty steps never had" |
| Seasonality | `cell/cell-view.tsx:209` | **Monthly demand, indexed** | Vertical bar columns | **Zero-based, explicitly** "never floored at the data min". Ceiling `Math.max(100, ...m)` so the 100 rule is always on-canvas | **`preserveAspectRatio="none"` - the columns and month letters stretch and distort as the card widens.** Only peak and trough print values |
| SurvivalSlope | `cell/cell-view.tsx:332` | **Share still trading at years 1/3/5**, with "nine in ten fail" struck across it | Line/spark + annotation | **Zero-based with a hardcoded 0-100 domain.** But **x is ordinal by index, not by elapsed years**, so a Yr1/Yr2/Yr5 series would draw misleadingly | `xMidYMid meet` - letterboxes rather than distorting. **The opposite choice from its Seasonality sibling in the same file** |
| SteppedWaterfall | `cell/money-chapter.tsx:62` | **Where each $100 of sales goes** | **Waterfall - the real one.** Floating bars anchored to the running level, dashed connectors | Zero-based, max hardcoded 100. **The identity always closes to 100** - `OwnerKeeps` rescales with largest-remainder rounding before handing over | At 375px seven columns of `fontSize 9/10` in a 480-unit viewBox scale to roughly 7px on screen |
| BreakEven | `cell/money-chapter.tsx:184` | **Break-even covers per day** against **covers on a typical day** | Two-marker scale | Domain derived: `Math.max(typical, covers, 1)` | Deliberately not a fill bar - "the old headroom fill invented a ceiling" |
| CostToOpen | `cell/money-chapter.tsx:260` | The **three biggest up-front line items** to open | Bar | Zero-based, max = the largest of the top 3 (not the total) | **DEFECT, see section 11.1: the track and the two non-leading bars render invisible in the v1 spine scope.** |
| Wages | `cell/interactive.tsx:134` | **Per-role pay spread** - low, mid, high | Range bracket, track-free | Zero-based with a derived ceiling plus 5% headroom. **Shared across rows**, which is what makes them comparable | **The low and high ends are drawn but never printed** - only the mid. The `aria-label` is the only place all three figures exist |
| TierBand | `city/city-view.tsx:49` | (a) city condition reads; (b) **safety** per risk | Dot/unit, N discrete pips | `steps` defaults 4 | No pip is individually labelled and no numeric value is printed |
| CommercialSpace | `city/city-view.tsx:183` | Each peer city's **commercial rent index as a signed pp delta** against home | 1-D dot strip | **Not zero-based and not centred.** Domain derived with asymmetric padding (`-6`, `+5`). **Zero is not drawn as a reference line** - the home city is identified by colour alone | Labels alternate above/below to de-collide; at narrow widths they can still overlap |
| DemandSize | `city/city-view.tsx:263` | **Resident vs visitor share** of city demand | Stacked bar | Zero-based, whole 100, **raw, not normalised** - if the two do not sum to 100 the bar silently under- or over-fills | Unlike `ShareStack`, which normalises and self-omits |
| Rent-load dot plot | `city/where-to-trade.tsx:118` | Each district's **rent as a multiple of the city average**, ranked lightest first | Dot plot with reference tick | **Not zero-based - the floor is x1** and the ceiling is derived (`Math.max(..., 1.2)`, rounded up). **Inverted so cheaper reads right.** Shared across rows | A previously hardcoded `2.8` ceiling clipped high-spread cities |
| IncomeCurve | `city/chapters.tsx:46` | **Median, top-10% and top-1% household income** | Marked scale / rug plot | **Logarithmic and not zero-based**, with hardcoded `0.28` / `1.12` padding factors. **The log axis is never labelled or announced anywhere in the UI** | `preserveAspectRatio="none"` - **stems and dot circles distort into ellipses**. The printed label row is `justify-between`, so **labels sit at even thirds while the ticks sit at log positions** |
| MarginLadder | `industry/forms.tsx:103` | The **gross to operating to net collapse** - "so the eye SEES 64 collapse to 7" | Vertical bar columns | Zero-based, max implicitly 100 within a fixed 118px container. Shared | The kept bar's numeral is deliberately ink, so the masthead's figure stays the band's only terracotta figure |
| SurvivalCurve (industry) | `industry/forms.tsx:130` | **Share still open** at years 0/1/3/5 | Line/spark | **Zero-based hardcoded 0-100**, and **x is by real year value**, so the 1-3 and 3-5 gaps draw proportionally. The opposite of the cell page's index-based sibling | `preserveAspectRatio="xMidYMid meet"` - explicitly non-distorting. Full data in the label |
| SeasonRibbon | `industry/forms.tsx:187` | **Monthly demand across the year** | Line/spark area ribbon | **Zero baseline but the ceiling is the data max**, so **two trades' ribbons are not comparable in amplitude**. Straight polyline, never smoothed | **`preserveAspectRatio="none"` - distorts.** The clip-path id is **non-unique**, so two on one page would collide. **No numeric values printed anywhere**, and the `aria-label` is static |
| RangeBracket | `industry/forms.tsx:235` | **Payback window in months** | Range bracket | **Not zero-based**, domain `[lo, hi]`, marker clamped 6..94 | A deliberately different idiom from the Benchmark dot scale so the two do not read as one family |
| Benchmark | `industry/industry-view.tsx:108` | **Dollars kept per $100 of customer spend, by trade**, with the all-trades average as a drawn reference | Lollipop / dot plot with reference line | Zero-based, max derived with 12% headroom **and stretched to include the reference** so the tick can never fall off the axis. Shared across rows | The average renders as a **vertical rule, not a dot**, so it never reads as one of the trades. Labelled "All trades / incl. non-food" precisely so it is not read as the average of its own parts |
| MoneySplit | `industry/industry-view.tsx:305` | **Where each $100 goes**, bracketed into variable / fixed / kept | Stacked bar + a proportional bracket | Zero-based, whole 100 for both layers. **The bracket's CSS-grid track widths are the group percentages** | On-bar `{pct}%` printed when `>= 12%` **or when it is the kept slice** - the kept slice is exempted from the width threshold so the card's answer is never the one unlabelled segment. The proportional bracket is dropped below `sm` |

---

## 7. The `spine2` kit - the rebuilt cell page

`src/components/spine2/`. 28 graphics. **Eleven are dead code.** Everything that
does render is **GATE-ONLY behind `cell`**, except `Place`, `SiteFooter` and
`GlyphIcon`, which reach `/industries` and `/world` ungated.

The live cell page uses only: `AxisDots`, `Calc`, `ColSplit`, `Hundred`,
`MonthDeviation`, `RankBarsV2`, `Roster`, `ShrinkBars`, `StatTiles`, plus two
inline figures.

### 7.1 Live on the cell page (behind the `cell` gate)

| Graphic | Encodes | Channel | Family | Scale | Labels | A11y |
| --- | --- | --- | --- | --- | --- | --- |
| `AxisDots` | (a) **what an owner keeps, city by city**, current city marked as subject; (b) **daily takings the room must make** - committed cost / breaks even / pays you $X | Dot x-position over an explicit domain. Second channel: colour + larger diameter for the `subject` role. Caption text is decollided by a sorted min-gap push, so **captions can move off their dot** while stems stay at true value | Dot/unit, 1-D value strip | **Not zero-based by design.** Domain is a required explicit `[lo,hi]` prop, never inferred. Ch13 derives it as half the observed spread padded onto each end. **Self-omits** unless exactly one `subject` stop exists | Direct figure + name on every mark. No ticks, no legend | **NONE** |
| `Calc` leverage bars | **What one move is worth** - the dollar gain in annual owner take-home from one realistic step on each of six calculator variables | Bar length `abs(gain)/top`. Row order carries the same variable (sorted descending) | Bar / table-with-bars | Zero-based, max derived per instance. **Self-omits when the defaults do not reproduce the page's published take-home** | Direct per row: caption + signed money with a true minus | Sliders have `aria-label`. **The bars have NONE** |
| `ColSplit` | **Every dollar of revenue split top to bottom** (five model lines, `kept` on the owner slice) | Segment height via `flex: value` - exactly proportional. Fill tone is an ordered ramp position | Vertical 100% stacked bar | Zero-based partition. `SUM_TOLERANCE = 2` - **a set summing more than 2 off the total renders NOTHING**. Fixed px column height (420 default) | Direct in-fill name + figure. **A segment under `LABEL_MIN_PX = 18` renders unlabelled and its label falls to the legend** | **NONE** |
| `Hundred` | **Of every 100 restaurants in this city, how many pay their owner the target income or more / less / nothing.** Recomputed live from the hero slider | Dot count, one square per business, in three contiguous labelled blocks | Dot/unit | Counting scale. **Hard integrity gate: if the groups do not sum exactly to the total the component renders nothing** - "a partition with a hole is a lie" | Derived count line + authored sentence per block. Fixed caption naming the encoding | `title` on each mark only |
| `MonthDeviation` | **Twelve monthly revenue values indexed so the year average = 100** | Column height above/below a drawn midline. Direction is a second channel carrying the sign. Peak is derived `argmax`, never passed | Diverging bar | **Not zero-based - the origin is the year average.** Clamp `DEFAULT_SPAN = 36` index points, hardcoded. **A 1.2% minimum-height floor means a zero-deviation month still draws a hairline** | Month initials (**the two Ms and two Js are ambiguous**), one midline label. **No per-bar printed figure** - values live only in `title` | `title` per column. No role, no aria |
| `RankBarsV2` | **Everything it takes to open the doors** - each opening-cost line (fit-out as a range, deposits, licences, kit) plus a total footer | Bar length. **Range rows use a left-offset bar**, so position and length together carry the interval. Row order sorted descending | Bar with inline range variant | Zero-based, shared. Max derived; **the total footer is drawn against that same max, so the total bar typically saturates**. The total renders **only when every input row survived** - "a total over a partial list is a lie" | Direct name + figure per row. No axis, no legend | **NONE** |
| `Roster` | **What a team costs.** The bar is *one person's yearly wage*; the row figure is *the whole line's cost*; the footer is the summed all-in year | Bar length `wage / max(wage)`. **Two different quantities in one row** - that asymmetry is the section's entire insight | Table-with-bars | Zero-based, shared, max derived. Total row renders only when every role has a wage | Direct in-bar figure. **A fixed encoding micro-caption ships inside the component**: "bar is one person, figure is the whole line", hardcoded so it can never describe a different encoding | **NONE** |
| `ShrinkBars` | (a) **where a customer's bill goes**, shrinking through each cost line to the owner's remainder; (b) **business survival by cohort year** | Bar length `remaining / start`. Fill tone steps lighter by index; the final stage swaps to terracotta | Bar (funnel; **not a true waterfall** - each bar is a remaining total, not a delta) | Zero-based, shared, `start` is the 100%. **Monotonicity is asserted - a rising `remaining` throws in dev and returns null in production** ("a lying shrink chart is worse than absence") | Direct in-bar figure. The `note` is a **function** receiving the derived kept share | **Ramp variant IS wrapped in `ChartFigure`** -> real `<figure>` + `<figcaption>`. **Track variant has NONE** |
| `StatTiles` pics | Little pictures under each big number: **orders a day**, **average spend a head**, **days a week open** | `fill` = bar length; `disc` = **angle** (conic sweep); `week` = dot count of 7 | Bespoke mixed: meter, dial, dot chart | Zero-based and clamped. **The numerator is parsed out of the printed string**, so the picture can never disagree with the number above it. Denominator comes from the caller. **Tiles are not on a shared scale** | Big figure + caption. **The pictures carry no labels, ticks or scale statement** | **NONE** |
| `Ch11FirstYear` inline curve | **Cash in the bank month by month through the first year** - from opening, down to the deepest hole, back up through breakeven | Cubic-bezier path, x = month, y = cash, two labelled anchors, translucent area fill | Line with area | **Only three numbers from the data place anything**: deepest month, breakeven month, span. **The curve's shape between them is hardcoded** - four fixed control-point fractions and literal intermediate y-values. The post-breakeven rise is a fixed 12px, not a datum. Y is inverted: `$0` sits near the top and the plot runs down into negative cash | Three y labels, two x labels. Two direct point labels | **The best in the kit**: `role="img"` with a real interpolated `aria-label` carrying values |
| `store.tsx` hero `.rng` | **Where the revenue this room would need lands inside the middle half of the trade.** Moves live with the hero slider | x-position of a 2px tick inside a bar whose ends are p25 and p75 | Bespoke 1-D position marker | **Not zero-based - the domain is the interquartile range itself**, so a room outside the middle half pins to an end and **the marker stops telling the truth about how far outside it is** | Both ends print their figure; a trailing phrase names the domain. **The marker itself is unlabelled** | **NONE** |
| `Place` (`.skyline`) | **Nothing.** The page-identity photo band | No data channel. Photo at 640px, grayscale .6, opacity .5, under a gradient to solid paper | Decorative plate | N/A | None | `aria-hidden="true"` - correct. **But `CellPage.tsx:92` renders a raw `<div className="skyline" />` inline instead of using `Place`, and therefore without the `aria-hidden`** |

### 7.2 Dev-only in `spine2`

| Graphic | Encodes | Family | Where | Notable |
| --- | --- | --- | --- | --- |
| `DivergingBars` | How far each row sits from the **average of the set**. Live feed is London district rent multiples | Diverging bar | `/dev/options/scale` | **The scale is absolute, not normalised**: `FULL_SCALE_PCT = 100` hardcoded, so half the track equals a 100% deviation. Clipped rows get a text prefix "at least ", not a visual mark. Wrapper hardcodes `maxWidth: "60%"` - **will read very narrow on a phone** |
| `RulerColumn` | Readings on one shared 0-100 scale. Dot mode: a country/city scorecard as percentiles. Bar mode: twelve "how hard is this for an owner" readings | Dot/unit; table-with-bars | `/dev/city2`, `/dev/country2` | Accent thresholds are named exported constants. The `caption` is a **function of the derived accented set**, so the sentence counts the same rows the marks mark. **Under 560px the dot rail is `display:none` - the visual encoding disappears entirely on mobile.** Bar mode is wrapped in `ChartFigure`; dot mode deliberately is not |
| `SBar` | A one-line proportional split: the all-in tax/social load by part; how a household spends a hundred | Horizontal 100% stacked bar | `/dev/spine2-tracks`, `/dev/catalogue` | `SUM_TOLERANCE = 2`, **but both country call sites compute `total` from the data itself, which defeats the drift check by construction**. Accent budget enforced: at most one terracotta segment. **No in-bar text by contract** - the legend is the sole label carrier |
| `Scale` | Ranked bars against one shared implied track | Bar | `/dev/spine2-tracks` | **No derived max** - the doc is explicit that only the caller knows whether the number is a share of its own max or a position on a stated scale, **so two Scale instances on one page can silently use different scales**. Sorts by value rather than trusting array order, so a caption saying "lightest first" cannot lie |
| `TrackBar` | The shared-track fill sub-atom | Bar atom | Via `Scale` only | Fill colour is deliberately **not** a prop - owned by the parent row's state classes so no caller can hand-set an accent |
| `Range` | Dumbbell range rows on one shared axis. Live dev feed: restaurant annual revenue as p25/median/p75 | Bespoke dumbbell / range plot | `/dev/home3`, `/dev/spine2-tracks`, `/dev/catalogue` | **Not zero-based**; domain required, never inferred. Supports `"log"`, used by `/dev/home3` because the revenue distribution is right-skewed. **The tick axis uses the same `fmt` the caller derives row displays from, so an axis in $K over rows in raw dollars is structurally prevented** |
| `UnitGrid` | Generic unit-mark primitive | Dot/unit | Via `Hundred`; `/dev/catalogue` | `defaultCols` falls back to the largest divisor of the total, so the grid is never ragged |

### 7.3 `spine2` graphics with no call site at all

`Quad`, `HexLens`, `Matrix`, `Fitgrid`, `Hoodcards`, `Wealth`, `Archetypes`,
`SparkTrend`, `Tline`. Nine components, nothing imports them. Full detail in
section 12.

---

## 8. The `kit` family

`src/components/kit/`. Three sub-families: the declared `charts/` family, the
`engraved/` country-page almanac, and `tables/` + `blocks/` + root primitives.

### 8.1 `kit/charts/` - the declared chart family

| Graphic | Encodes | Channel | Family | Where | Scale | Colour | A11y |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `ComparisonBars` | **Business Climate Score (0-100)** for the subject city plus up to 3 peers | Bar length + row order; subject marked by fill and bold label | Bar | LIVE `/cities/[slug]` | Zero-based, max derived per instance, floor 3% | Subject terracotta vs `paper-400` neutral. Clean | `figure role="group"` with a label |
| `LikeForLikeBars` | **Typical annual revenue for the same trade in comparable nearby cities** | Bar length; **row order is the caller's, never re-sorted**; subject also carries the literal word "Here" | Bar | LIVE cell, sub-cell, `/industries/[industry]`, `/learn/[slug]` | Zero-based, derived, floor 2%. Self-omits below 2 rows | Clean; the file notes peers are deliberately `paper-400` not `cocoa-300` | Generated prose naming subject and leader |
| `ThresholdGauge` | **Break-even orders/covers per day**, with a typical day seating the ceiling | Tick x-position + two zone widths meeting exactly at the tick; **arrows as non-colour direction cues** | Linear threshold gauge | LIVE cell, sub-cell, `/industries/[industry]`, `/learn/[slug]` | Floor 0. **Ceiling derived, literal default `value * 1.8`**; the caller overrides to `max(typical*1.2, value*1.6)` | Terracotta vs neutral, and each zone carries a plain word | Generated prose; track and tick `aria-hidden` |
| `ScoreBand` | A single bounded 0-100 score: (a) **Business Climate Score** with peer cities as context ticks; (b) **break-in ease** | Fill length + value-marker x-position + peer-tick x-positions + tone | Progress meter with reference ticks | LIVE `/cities/[slug]`, cell, sub-cell | Zero-based, `outOf` default 100 | **Soft hue violation**: `positive` atlas-700 -> `caution` cocoa-500 -> `negative` cocoa-700. The band word is printed, so meaning is not colour-alone | **Weak: no role, no aria-label** on the root; fill, ticks and marker all `aria-hidden`. The printed text is the only fallback. **Peer ticks are unlabelled** |
| `VisitorSplit` | **Who the money comes from** - the split of a street's trade between residents/workers and passing visitors | Segment width; the dominant side takes the accent | 100% stacked bar (the file explicitly rules out a pie) | LIVE `/cities/[slug]` | Normalised to 100% of the two inputs | Accent follows the **larger** side, so it is a magnitude cue, not good/bad. Clean | `figure role="img"` with both percentages |
| `SeverityGlyph` | **How much a listed risk should worry the reader** - a closed 3-level union | **Unit count plus rising bar heights**, so the ladder reads as a meter before the fill is noticed | Dot/unit | LIVE cell, sub-cell | Geometry hardcoded in a 12x12 viewBox, identical everywhere | **Soft hue violation**: `rare` cocoa-500 -> `watch` clay-500 -> `serious` clay-700. **Strongly mitigated** - the filled-step count carries the level on its own | **Best in the kit**: `role="img"` with the level word |
| `TimelineRibbon` | **The modelled first year**: fit-out and open -> the fragile months -> break-even -> a steady room | **Evenly-spaced position along a hairline - position is ordinal, NOT proportional to elapsed time.** Dot size marks the pivot | Ordinal timeline | LIVE cell, sub-cell, `/industries/[industry]`, `/learn/[slug]` | No value axis. Only the first `emphasis: true` is honoured | Pivot terracotta against a true neutral, and also larger. Clean | Generated prose. **Both the horizontal and vertical markups are in the DOM, so the label is announced twice on some readers** |
| `TierBar` | "Where one value sits in its low-to-high band" | Bar length + tone | Progress meter | **DEV-ONLY `/dev/charts`** | Min 0; **max required from data**; returns null when `max <= min` | **Soft hue violation**: `good` atlas-700 vs `caution` cocoa-500 vs `neutral` cocoa-300 | `role="img"` with a plain position word |
| `Waterfall` | Revenue cascading through each cost to owner take-home | Bar length **plus x-offset at the running balance** | **Waterfall - a real one** | **NO CALL SITE** | Zero-based, derived from `start` | `COST_FILL` cycles ink / cocoa / paper positionally - categorical, encodes nothing ordered | `figure role="group"`; bars unlabelled |
| `HeatStrip` | Footfall/intensity over one sequence | **Colour intensity only** - `opacity = 0.1 + intensity * 0.85`. Cell size does not vary | 1-D heat strip | **NO CALL SITE** | Normalised per instance. **A zero value still paints at 10% opacity** | Single hue at varying opacity. **The canonical compliant ramp** | `figure role="img"` naming the peak |
| `FootfallGrid` | "When is this street busy" - days x hours | **Colour intensity only** | 2-D heatmap | **NO CALL SITE** | Per-instance max. Hour domain hardcoded 8..22 | Single hue. Clean | `figure role="img"` naming peak and quiet |

### 8.2 `kit/engraved/` - the live country page

**This is the default-live surface on `/[country]`** - the `country` gate defaults
OFF and the master flag can never enable it, so the engraved family is what a
reader sees.

**Almost every measured graphic here is fed `notHeld<...>()`.** `OpportunityGap`
(scatter), `SameBusinessAbroad` (diverging bar), `SpecialZones`, `TalentReality`
(gauge), `YourLifeHere` (bars), `WhoHasMoney`'s `MixBar`, `DialGauge` and
`HowFarYouReach`'s gauge strip are all mounted on `/[country]` but permanently
receive not-held data, so **only their SampleState paths ship**. What actually
paints is the frame, the empty state, and a handful of live reads.

| Graphic | Encodes | Channel | Family | Live with data? | Scale | Notable |
| --- | --- | --- | --- | --- | --- | --- |
| `CountryShape` | A country's profile across **six** judgment lenses (reward, cost, entry, people, demand, risk), each 0..1 | **Radius along each spoke**; polygon **area** as the emergent read | Radar / spider | Yes | Zero-based from the hub, hardcoded `R = 116`, rings at 1/3, 2/3, 1. Same scale for every country | **Live copy defect**: the doc comment and the `aria-label` still say **nine** lenses. `momentum`, `path` and `edge` were removed from `LENS_ORDER` but not from the accessible label, which reads "Nine-lens country shape" over a six-spoke figure. No numbers anywhere, deliberately |
| `Scorecard` | Up to eight country economic metrics (GDP per capita, tax rate) | **Colour intensity/hue only** via `meaningStep`. No length, no position - the figure is type | Metric grid (borderline graphic) | Yes | No spatial scale | Not-held cells print an en dash and the literal "not held". **A11y: NONE**, but all meaning is real text |
| `GroundUnderYou` FactorBar | **The footing a small operator stands on**: low corruption, ease of operating, plus two hardcoded sample rows (political stability, currency, both `score: 0.5`) | Bar length + a surveyor's marker + `meaningStep` fill | Bar with position marker | Partly - two of four rows are tagged samples | Zero-based 0..1, floor 3%, ticks hardcoded at 20/40/60/80 | **No number printed anywhere** - the read word is the only figure. Was **de-SVG'd 2026-08-18**; the in-file comment records the old `preserveAspectRatio="none"` marker rendering as a 4.37:1 ellipse (7.6x4.4px at 375, 19.2x4.4px at 1280) |
| `WhoHasMoney` PowerGauge | **Spending power**, blended from net wealth, salary and cost of living | Station x-position on a five-band track; the bands are the `MEANING` ladder rendered literally as five adjacent swatches | Linear position gauge | Yes | 0..1 clamped, five equal bands | **Only the two end rungs are labelled** - the three middle bands are unlabelled. The band track keeps `preserveAspectRatio="none"` deliberately (a scale may stretch), but **the station node was moved out to HTML 2026-08-18** because a round mark cannot survive it |
| `CitiesGrid` climate dots | **Per-city climate on a 0..5 dot scale** | Dot count + `meaningStep` intensity | Dot/unit | Yes | Max hardcoded 5, same on every card | **A11y: NONE, and this is the worst case in the kit** - a 0-5 quantity with no numeric label, no role, no aria and no text equivalent at all |
| `CharacterPanel` spectrum bars | **Country character on bipolar spectra** - two panels, "Dealing with government" and "Dealing with people" | Node x-position on a hairline; three fixed ticks | Bipolar position marker | Yes | 0..1 clamped 5..95 so the node never sits on an end | **No number printed.** A spectrum position is deliberately not good-or-bad, so the single accent is correct. **A11y: NONE** - the node position is unreadable to a screen reader |
| `VsWorld` (engraved) | **This country against a global median** - live feed is GDP per capita | Two bar lengths + a signed delta chip | Bar, 2-row | Yes | Zero-based, derived, `max * 1.08` headroom | **Name-collides with `blocks/VsWorld`**; both are exported from `kit/index.ts`. See section 10 |
| `HiringRead` pay bars | **The legal wage floor against typical pay for the role**, both annual gross | Bar length | Bar | Yes | Zero-based; **ceiling derived as `typical * 1.15`**. Both bars share it, so they are directly comparable | Terracotta marks the subject, cocoa the reference - categorical. Clean. **A11y: NONE**, but figures are real text |
| `SetupStepper` | **The register-a-business route** - ordered formation steps with days and fees | **Ordinal position only.** Days and fees are printed, never drawn | Stepper / traverse | Yes | N/A. Traverse insets are exactly half a column at each end, true for any step count | **De-SVG'd 2026-08-18.** The comment records the old `preserveAspectRatio="none"` rendering the node as 8x18px at 375 and 21.2x18 at 1280, with nodes at 2.5/50/97.5% over cards centred at 16.7/50/83.3% |
| `OpportunityGap` | Trades on **x = how much money is around**, **y = how thin the trade supply is**; the top-right quadrant is "room to move" | True scatter (x and y position) + dot radius for labelled examples + a quadrant area wash | Scatter | **No** - `notHeld` | Both axes zero-based 0..1, hardcoded 320-unit box, capped at 40 dots and 3 labels | **End-labels only, no ticks** - a reader cannot read a value off either axis. **All axis text is SVG `<text>` at 10 viewBox units**, so at a 280px column it renders near 8.7px. The doc comment still says "faint moss"; the code is `--accent-subtle` |
| `SameBusinessAbroad` | **Owner take-home for one identical trade in two countries** | **Mirrored bar length from a central meridian** | Diverging bar | **No** - `notHeld` | Zero-based, both sides share one derived max, so the mirror is honest | **Hue violation**: the delta tone is `--accent` when more here vs `--clay-600` when less. All text lives outside the SVG, which is the right pattern |
| `TalentReality` gauge, `HowFarYouReach` gauge, `DialGauge`, `YourLifeHere`, `MixBar` | Talent signals; reach indicators; **days to hire**; lived-reality dimensions; **what locals spend on** | Arc sweep + needle; arc sweep + needle; arc sweep + needle; bar length + node; bar length | Gauges and bars | **No** - all `notHeld` or passed `null` | `DialGauge` max hardcoded 60. `TalentReality` is `width="72" height="46"` **hardcoded px, never scales** | `DialGauge` puts its value in an SVG `<text>` **inside an `aria-hidden` svg**, so the number is not in the accessibility tree at all. **`MixBar` applies the `meaningStep` ladder to share-of-spend, a quantity with no valence** - a 10% row prints maroon and an 80% row terracotta |
| `CompassRosette`, `ContourField`, `RouteLine`, `StampSeal`, `GateMotif`, `EngravedHero` | **Nothing.** Brand ornament, topographic texture, a surveyor's traverse, a council stamp, a zone gate, a procedural city engraving | Fixed or sine-driven linework | Bespoke ornament | Ornaments yes; `EngravedHero` has **NO CALL SITE** | N/A | `StampSeal` prints `ATLAS REGISTRY` at **7 viewBox units on a 100-unit box, so roughly 3.2 CSS px at `size={46}`** - the same defect `CountryShape` and `WhoHasMoney` were fixed for, still live here. `EngravedHero` uses `preserveAspectRatio="xMidYMax slice"`, correct for a bleed image |

### 8.3 `kit/tables/`, `kit/blocks/` and the root primitives

| Graphic | Encodes | Channel | Family | Where | Scale | Notable |
| --- | --- | --- | --- | --- | --- | --- |
| **`RangeStrip`** | **THE signature graphic.** The distribution of a figure across firms - p10/p25/p50/p75/p90 with an optional "you are here" marker. Live feeds: typical revenue and take-home spreads on cell, sub-cell, industry and city pages; **local household income spread** on `/cities/[slug]`; owner take-home with the reader's own scenario in `MakeItYoursPanel` | **x-position on a log axis**, a seven-segment density ramp as **colour intensity**, an IQR band, and two vertical ticks | Distribution / percentile strip | LIVE cell, sub-cell, `/cities/[slug]`, `/compare`, `/industries/[industry]`, `/learn/[slug]` | **Log, not linear, and not zero-based**: `lo = max(1, p10*0.85)`, `hi = p90*1.18`. Missing quartiles are **interpolated** as midpoints | **The reference implementation for the house colour rule.** `GRADIENT_TONES` are all true neutrals, symmetric and strictly monotonic inward. The in-file comment records the 2026-08-18 fix off a non-monotonic ramp that ended in a warm tan. Ships a **separate HTML view below `sm`** because at a 361px column the 14px SVG figures painted at 6.6px |
| **`MoneyGoesBreakdown`** | **Where each $100 of sales goes** | Stacked segment width + a labelled tick at the kept slice's centre | Stacked bar | LIVE `/industries/[industry]`, `/learn/[slug]`, cell, sub-cell | Normalised to the actual total. **Self-omits outside a believable decomposition** - returns null when the total is below 80 or above 120 | **The second reference implementation.** `COST_FILL` is five true neutrals (s=0%), monotonic darkest-first, luminances recorded in the file. **Printed dollars use largest-remainder apportionment so the column sums to exactly 100** - the comment records the bug it fixed, where a heading promising $100 printed 101 and 99 |
| `OwnerKeepTable` take-home bar | **Owner take-home per year, per trade**, in one city | Row order + a faint underlaid bar + weight emphasis on the top row | Table-with-bars | LIVE `/cities/[slug]` | Zero-based but **outlier-capped, not max-based**: `cap = median * 1.6`, so any trade above that saturates at 100% | Below `sm` the card list drops the bar entirely |
| `sections.tsx` Seasonality | **Relative demand across the 12 months** | Bar height in px + accent on the peak | Column chart | LIVE cell, sub-cell | Zero-based, derived, **ceiling hardcoded 56px, floor 6px** | **Single-letter month labels, so J/M/A/J repeat and the axis is ambiguous.** No numeric value printed anywhere. `aria-label="Relative demand by month, busiest month marked."` **names no month and no value** |
| `sections.tsx` WagesByRole rails | **Pay by role** - low/median/high | Rail edge x-positions + a median tick | Range track | LIVE cell, sub-cell | **Shared across every row**, so rows are comparable. Not zero-based - the floor is the lowest observed value | A hand-rolled twin of `tables/helpers.tsx` `RangeTrack`. **The rail's endpoints are unlabelled**, unlike `RangeTable` which prints them. **A11y: NONE** |
| `Slider` track fill | **Your annual rent / payroll / monthly draw** (with a tick at the typical value); **per-metric weight 0..100** in `WeightedCompare` | Filled bar length | Progress meter (control) | LIVE cell, sub-cell, `/compare` | `MakeItYours` derives `max = typical * 2`; `WeightedCompare` uses 0..100 step 5 | **The strongest a11y in the repo**: real `<input type="range">` with `aria-valuetext`, wired `<label>` and `<output>`, a second exact numeric input with its own label, a visible focus ring, and `motion-reduce` on the thumb |
| `CostDrivers` ImpactTicks | **What moves the cost** for a trade - a lever's relative magnitude on a 1-to-3 scale, plus a direction | Unit count with rising heights; the arrow is a direction glyph | Dot/unit | LIVE `/industries/[industry]`, cell, sub-cell | Hardcoded 3 steps, default 1 | The direction gloss prints **only when the block holds both directions**, and both live call sites hardcode `direction: "down"`, so on the real pages it is suppressed. **The impact level has no text or aria equivalent whatsoever** - the file carries a correction noting a removed false claim that a visually-hidden label existed |
| `VsWorld` (blocks) | **The city's own 0-100 Business Climate Score against the peer median** | Two bar lengths + a signed delta as tinted text | Bar, 2-row | LIVE `/cities/[slug]` | Zero-based, derived, floor 4% | **Soft hue violation** on the delta: `text-atlas-700` above vs `text-cocoa-900` below. Mitigated - the signed number and the word both carry it. Doc comment still describes moss/amber |
| `InlineBar`, `RangeTrack` | Proportional cost split; a low/median/high range on a shared domain | Bar length; edge and tick x-positions | Bar; range track | Via `CostSplitTable` and `RangeTable`, **neither of which has a call site** | `RangeTrack`'s domain is **shared across rows**, so tracks are comparable, but **not zero-based**, so a short span is visually exaggerated | Both are `role="presentation"`, with the printed figure as the fallback |
| `StreetLine` | **Nothing.** A deterministic abstract street motif | Polyline vertex heights from `(seed*7 + x*3) % 12` | Ornament | Only the empty state renders (`streets={null}`) | N/A | Explicitly "decorative only" and "never invents a measurement", but it is **pseudo-data with no referent drawn as a line chart** - a reader could mistake it for data. Correctly `aria-hidden` |
| `WeightedCompare` | A personalised comparison: places scored 0..100 from live per-metric weights the reader sets | **The only geometric channel is the `Slider` track fill.** Scores and ranks are text; rows and columns do not reorder | Table-with-bars (weakly) | **DEV-ONLY** `/dev/decide-v2` | Weights 0..100 step 5; scores out of a hardcoded 100; per-metric min-max normalisation over the columns present | **Refuses to crown a true tie** - `leadKey` is null unless the top score strictly exceeds the second |
| `CostSplitTable`, `RangeTable`, `WageRangeTracks` | Where each $100 goes; pay range by role; pay range by role again | Bar length; range track; range track | Table-with-bars | **NO CALL SITE** (first two); **DEV-ONLY** (third) | `CostSplitTable` scales to the **largest line, not the total**, so its bars are a relative-to-biggest read, not shares of 100 | See section 10 on duplication |

---

## 9. Page-level and one-off graphics

Graphics that live outside the four kits, on or near the routes they serve.

### 9.1 Live

| Graphic | Path | Encodes | Channel | Family | Where | Scale | Notable |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `MarginWaterfall` | `src/components/MarginWaterfall.tsx` | **Gross, operating and net margin**, each as a share of revenue | Bar length (CSS width %), three stacked full-width tracks | **Bar, not a waterfall.** No connectors, no floating bars, no cumulative offsets, despite the name | LIVE `/industries/[industry]`, ungated | **Not zero-to-100.** Gross is pinned to 100% and everything is measured against it (`part / gross`). **The denominator is per-instance, so two industries with identical net margins draw different bar lengths** | Fallbacks hardcoded `0.42 / 0.10 / 0.05`. Heights hardcoded 44px |
| `CoverageBadge` | `src/components/CoverageBadge.tsx` | **Data confidence for a cell** - `quality_score` 0-100 rebinned to 1-5 | Dot count, **plus fill colour carrying a second, different quantity**: the coverage tier | Dot/unit | LIVE `/[country]/[geo]/[industry]` | Max hardcoded 5. **Floor of 1, so a score of 0 still lights one dot**; null defaults to 3 | The word beside it prints only for the two confident tiers - **`estimated` and `modeled` print no word at all**. The `aria-label` reports the dot count but **not the tier, which is what the colour carries** |
| `CellDecisionStack` OwnerKeeps bar | `src/components/cells/CellDecisionStack.tsx` | **Of every sales dollar, the cents the owner keeps vs the cents costs take** | Bar length, two segments | Two-segment 100% stacked bar | LIVE `/[country]/[geo]/[industry]` and `/[sub]` | Clamped with hardcoded rails `Math.max(2, Math.min(98, kept))`. **The label prints the unclamped value, so bar and number can disagree at the rails** | `role="img"` with a full sentence |
| `Specimen` kept-share bar | `src/components/home/Specimen.tsx` | **The share of one real business's revenue that reaches the owner** | Bar length | Single-segment bar | LIVE `/` | Zero-based, max implicitly 100. **No clamp** - a >100 or negative value would overflow or vanish | Deliberately unlabelled: "No axis, no legend, no percentage floating beside it". The figure lives in the sentence below |
| `CatalogPlates` | `src/components/home/CatalogPlates.tsx` | Per collection: **how many entities the atlas measures and how many qualify** for the collection's rule | Dot count + dot radius + fill. **Position encodes nothing** - it is a deterministic irrational-step scatter used as texture | Dot/unit, bespoke plate | LIVE `/` | `MAX_MARKS = 260`, so **a collection over 260 under-draws silently**. Lit selection is modular, not exact, so **the drawn lit count can differ from the stated qualifying count** | SVG carries `role="img"` **and** `aria-hidden="true"` on the same element - the net effect is correct (the wrapping anchor speaks) but the `role` is dead |
| `CitySignaturePanel` SpectrumBar | `src/components/cities/CitySignaturePanel.tsx` | **Six cultural spectra**, each 1-10 (punctuality, openness to foreigners, directness, corruption rejection, ambition). Explicitly framed as "closer to one side", not good/bad | Handle x-position on a gradient track | Bespoke spectrum | **Currently dark.** Both call sites gate on `showInstitutions`, and the one live call site passes `false` | Domain hardcoded 1-10, range hardcoded 5%-95%. **Not zero-based** - a value of 1 sits at 5% | **No numeric value is printed anywhere** - the reading exists solely as handle position. **A11y: NONE.** A screen reader gets the two end-labels and nothing else. **See section 11 for the hue question** |
| `CitySignaturePanel` ScoreBar | same file | **Six government/institution scores** 0-10, higher = better for business | Bar length | Progress meter | Same gate - currently dark | Zero-based, max hardcoded 10, shared across rows | The file documents removing a hue ramp: "The bar's LENGTH already carries the value. The hue on top of it asserted a verdict". **A11y: NONE on the bar**, but `{v}/10` is real text |
| `BusinessFormationCosts` ComplexityDots | `src/components/cities/BusinessFormationCosts.tsx` | **How hard a legal tier is to register** - complexity 1-5 | Dot count | Dot/unit in a table | LIVE `/[country]` | Max hardcoded 5, shared | Word bands live **only** in `title`/`aria-label`, never printed. The parent table is `overflow-x-auto` after this column was found clipped entirely at 375px |
| `NeighborhoodCover` | `src/components/cities/NeighborhoodCover.tsx` | **Nothing.** A generated illustration standing in for a district photograph | Deterministic pseudo-random geometry seeded from the place key: three nested contour rings, a drifting route, a compass rosette | Bespoke generated cartographic plate | LIVE `/cities/[slug]`, `/[country]/[geo]/[industry]` | N/A. 6 gradient pairs; the index wraps, and `spreadCoverIndexes` stops a row of covers repeating a ramp | `preserveAspectRatio="xMidYMid slice"` - **crops rather than distorting**, so it composes at both tile and banner heights. `aria-hidden`, correctly decorative |
| `NeighborhoodOverview` ranked trade rows | `src/components/NeighborhoodOverview.tsx` | **Revenue for a trade in this district as a multiple of the same trade's city baseline** | **Row order plus the fill colour of the figure. No geometry at all** | Rank-ordered colour-coded list | LIVE `/[country]/[geo]/[industry]` | No visual scale. `pctLabel` prints honest rails rather than false precision ("2x or more", "less than half") | Every row prints its own figure, so **nothing is carried by colour alone**. See section 11 |
| `AtlasIcon` / `AtlasPictogram` / `AtlasSpot` / `LogoMark` | `src/components/brand/*` | **Nothing.** Categorical identity: 40 UI glyphs, trade/venue marks, 12 editorial spots, the compass logo | Line drawing on a 32-unit grid (48 for marks); `stroke="currentColor"` | Bespoke icon/illustration systems | LIVE site-wide | N/A | A11y is conditional and correct throughout: `role="img"` only when an `aria-label` is passed, otherwise `aria-hidden`. Two notes: `AtlasIcon`'s header says "1.6 stroke" but the code sets `1.9`; `LogoMark`'s centre core is a **raw hex `#FFFFFF`** that will not invert on a dark surface |

### 9.2 Dev-only and unroutable

| Graphic | Path | Encodes | Family | Where | Notable |
| --- | --- | --- | --- | --- | --- |
| `DistributionVisual` | `src/components/DistributionVisual.tsx` | **Revenue distribution for a cell** - p10, p50, p90 | Bespoke band + median rule | DEV-ONLY `/dev/distribution-states` | **The best a11y in the codebase**: `role="img"` with a full sentence built from formatted money, plus a `<title>` on the marker and `aria-hidden` on all three visual labels. Labels are collision-resolved by `ResizeObserver` with a 12px gap and a priority order |
| `CityYearStrip` | `src/components/city2/page/CityYearStrip.tsx` | **Visitor volume by month as deviation from a year average of 100** | Diverging bar | DEV-ONLY `/dev/city2` | Deliberately not zero-based, and the header argues it: "Drawn from zero, twelve bars between 82 and 118 are twelve near-identical bars. Drawn from the average, the season is the shape." **Each city is normalised to its own extreme, so strips are not comparable across cities.** Hard 60% max-width cap |
| `GhostBar` | `src/components/monetization/GhostBar.tsx` | **A deliberately withheld value.** Occupies the geometric slot of a real bar so the reader sees the shape without the number | Bar mark primitive | `/dev/lock-states` and `_design/monetized`. **Not mounted on any production page** | Colours are **raw rgba literals, not tokens**. The `onClick` sits on a bare `<g>` - **not keyboard reachable and not announced as interactive** |
| `CityHeroV2` StylizedPlaceholder | `src/components/v2/CityHeroV2.tsx` | **Nothing - but it reads as a bar chart.** The bar heights are a hardcoded literal array, identical for every city | Bespoke illustration that borrows chart grammar | DESIGN-ONLY, `_design/v2-review`. **Renders on no URL** | **The highest-risk item in this sweep if it were ever revived**: a decorative element using the exact visual grammar of a data chart, on a page whose other content is real data. A11y: NONE, and the city-name div duplicates the `<h1>` |
| `LondonRoadmap` | `src/components/v2/LondonRoadmap.tsx` | **Nothing.** A hand-authored editorial map of central London | Bespoke illustrated map: several hundred literal block polygons, 5 parks, ~30 road polylines, a 130-point Thames path, 12 district labels | DESIGN-ONLY. **Renders on no URL** | No data binding of any kind. At small widths the 11px labels do not reflow and will crowd |

### 9.3 Things that look like graphics and are not

Worth naming because a review will otherwise go looking for them:

- **`home/AtlasLedger.tsx`** has **no share bars**. Its header states it: "No
  icons, no bars, no boxes." Four figures separated by hairline dividers.
- **`monetization/QuartileMarkers.tsx`** renders **five equal-width grid
  columns - the positions are not value-proportional**, despite the header
  claiming free users "see the SHAPE of the distribution". No geometry encodes
  anything.
- **`sections/AnnualCostStack.tsx`** is a table with the share printed as text,
  no bars, and **zero importers**.
- **`app/(site)/compare/CompareClient.tsx`** has **no inline quantity graphics**.
  Its only SVGs are a chevron, a reset arrow and a padlock. It hosts `RangeStrip`
  and the kit `Slider`.
- **`spine2/Statblock`, `Tiles`, `Reading`, `Ledger`, `Method`, `Take`,
  `TierPill`, `SwatchLegend`, `Band`, `Myth`, `Qa`, `Voices`, `Zonecard`** are
  all text-only atoms.

---

## 10. Duplication across the kits

The four kits are not four styles of one thing. They are **four independent
answers to the same handful of questions**, and several of the questions are
answered five or six times.

### 10.1 The percentile spread - six implementations

The single most duplicated read in the repo. Every one of these shows a
distribution with a typical value marked, and no two agree on the axis.

| Implementation | Path | Axis | Zero-based? | Scale shared? | Labels |
| --- | --- | --- | --- | --- | --- |
| `RangeStrip` | `kit/RangeStrip.tsx` | **Log**, `[p10*0.85, p90*1.18]` | No | Per-instance | All three figures + eyebrows; separate mobile HTML view |
| `PercentileStrip` | `charts/PercentileStrip.tsx` | **Log**, `[p10*0.85, p90*1.18]` | No | Per-instance | All three + a "YOU" marker; p25/p75 drawn but never named |
| `SpreadBar` | `board/charts/SpreadBar.tsx` | **Linear**, `[p10, p90]` | No | **Per-row** | **None inside the SVG** |
| `SpreadStrip` | `spine/kit.tsx` | **Linear**, `[p10, p90]` | No | Per-instance | All three figures |
| `Range` | `spine2/Range.tsx` | Linear **or log**, domain required | No | **Shared across rows, with a tick axis** | Row label + mid; a real tick axis |
| `DistributionVisual` | `DistributionVisual.tsx` | **Linear**, `[0, p90*1.1]` | **Yes** | Per-instance | All three, collision-resolved by `ResizeObserver` |

`RangeStrip` and `PercentileStrip` are near-identical: same log domain, same
padding factors, same nested-interval grammar, same `W = 760` geometry. They
differ in that `PercentileStrip` has the "you are here" marker and `RangeStrip`
has the density ramp and the mobile HTML fallback. **`spine2/Range` is the only
one of the six with a labelled tick axis**, and the only one that shares a scale
across rows.

### 10.2 "Where each $100 goes" - five implementations

| Implementation | Path | Family | Notable |
| --- | --- | --- | --- |
| `MoneyGoesBreakdown` | `kit/MoneyGoesBreakdown.tsx` | Stacked bar | Largest-remainder apportionment so the column sums to exactly 100 |
| `SteppedWaterfall` | `spine/cell/money-chapter.tsx` | **True waterfall** | Floating bars on the running level, dashed connectors |
| `ColSplit` | `spine2/ColSplit.tsx` | **Vertical** stacked bar | `SUM_TOLERANCE = 2`, renders nothing outside it |
| `StackBar` / `MoneySplit` | `spine/kit.tsx`, `spine/industry/industry-view.tsx` | Stacked bar + proportional bracket | Grey darkness remapped to magnitude |
| `CostBar` | `board/charts/CostBar.tsx` | Stacked bar | **Renders nowhere.** No labels at all |

Plus `CostSplitTable` (`kit/tables/`, no call site) makes six, and it is the odd
one out: **it scales to the largest line rather than the total**, so its bars are
not shares of $100 at all.

### 10.3 Three components named `Waterfall`, only one of which is a waterfall

- `kit/charts/Waterfall.tsx` - **a real waterfall** (bar length plus x-offset at
  the running balance). **No call site.**
- `spine/kit.tsx` `Waterfall` - **not a waterfall.** Independent zero-anchored
  bars, no running level, no connectors. Renders on `/dev/decide`.
- `MarginWaterfall.tsx` - **not a waterfall.** Three independent proportional
  bars. **This is the one that renders on a live route** (`/industries/[industry]`).

The real waterfall in the repo that actually ships is `SteppedWaterfall` in
`spine/cell/money-chapter.tsx`, which is not named waterfall.

### 10.4 Two components named `SurvivalCurve`, two named `VsWorld`, two named `Seasonality`

- **`SurvivalCurve`**: `board/charts/SurvivalCurve.tsx` (renders nowhere; x-axis
  hardcoded `[1,5]`) and `spine/industry/forms.tsx` (LIVE; **x by real year
  value**, so the gaps draw proportionally). A third, `SurvivalSlope` in
  `spine/cell/cell-view.tsx`, is **x ordinal by index**, so it would draw a
  Yr1/Yr2/Yr5 series misleadingly. Three survival charts, three different x-axis
  treatments.
- **`VsWorld`**: `kit/blocks/VsWorld.tsx` (city page) and `kit/engraved/Compare.tsx`
  (country page). **Both are exported from `kit/index.ts`** - a live name
  collision in the barrel.
- **`Seasonality`**: `kit/sections.tsx` (px-height columns, 56px ceiling),
  `spine/cell/cell-view.tsx` (SVG columns, `preserveAspectRatio="none"`),
  `spine/industry/forms.tsx` `SeasonRibbon` (area ribbon, also `none`),
  `spine2/MonthDeviation` (diverging from the year average),
  `city2/CityYearStrip` (diverging, dev-only). **Five month-of-year charts, and
  they disagree about whether the baseline is zero or the average.**

### 10.5 The pay-range track - three implementations

`kit/tables/helpers.tsx` `RangeTrack`, `kit/sections.tsx` `WagesByRole` (a
hand-rolled twin), and `kit/comparison.tsx` `WageRangeTracks` (built on
`RangeTrack`). Plus `spine/cell/interactive.tsx` `Wages`, which is track-free
brackets. All four show low/median/high pay by role. Only `RangeTable` prints the
rail's endpoints.

### 10.6 Gauges

`spine/kit.tsx` `Gauge` (semicircle, needle), `board/charts/CrowdingGauge` and
`RentGauge` (half-circle arcs, **byte-near duplicates of each other**),
`kit/engraved/Setup.tsx` `DialGauge` (270-degree sweep), `HowFarYouReach`
`ReachGauge` (200-degree sweep), `TalentReality` `Gauge` (semicircle),
`kit/charts/ThresholdGauge` (linear), `WhoHasMoney` `PowerGauge` (linear),
`spine/kit-index.tsx` `MarginIndexBadge` (ring). **Nine gauge implementations
across five sweep geometries.** Only `MarginIndexBadge` and `ThresholdGauge`
render on an ungated live route with real data.

---

## 11. The house colour rule: which graphics encode an ordered quantity in more than one hue

The rule is stated in `src/lib/scores/band_tone.ts`: *show good-versus-bad with
intensity and position instead of hue*, one hue draining to a cool neutral. That
file is a correct four-step ladder and every band pill routes through it.

**The reference implementations** are `kit/RangeStrip.tsx` and
`kit/MoneyGoesBreakdown.tsx`. Both use true neutrals only, monotonic in
luminance, with the deltas measured and recorded in the file.

### 11.1 The one systemic violation: `meaningStep`

`src/components/kit/engraved/primitives.tsx:84-90` defines a single five-step
ladder that colours **ten sections of the live `/[country]` page**:

```bash
cd /e/atlas/website && grep -rln "meaningStep" src/components
# Compare.tsx  CountryShape.tsx  GroundUnderYou.tsx  HowFarYouReach.tsx
# OpportunityGap.tsx  Scorecard.tsx  TalentReality.tsx  WhoHasMoney.tsx
# YourLifeHere.tsx  (+ two barrels)
```

Measured, not asserted. Foreground channel, ordered worst to best:

| Step | Token | Hex | Hue | Sat | Rel. luminance |
| --- | --- | --- | --- | --- | --- |
| 0 worst | `--clay-600` | `#73211a` | 4.7 | 63% | 0.0481 |
| 1 | `--ink-900` | `#211810` | 28.2 | 35% | **0.0101** |
| 2 | `--cocoa-700` | `#534231` | 30.0 | 26% | 0.0596 |
| 3 | `--accent` | `#991600` | 8.6 | 100% | 0.0735 |
| 4 best | `--accent` | `#991600` | 8.6 | 100% | 0.0735 |

**It is non-monotonic on all three perceptual channels.** Hue runs
4.7 -> 28.2 -> 30.0 -> 8.6, out and back. Luminance runs
0.048 -> **0.010** -> 0.060 -> 0.074, so **the second-worst step is by far the
darkest thing on the ladder**. Saturation runs 63 -> 35 -> 26 -> 100.

Two further consequences: **steps 3 and 4 are byte-identical in both `fg` and
`dot`**, so a five-step ladder resolves to four distinguishable foregrounds, the
top two separated only by their background. And on the dot channel, `cocoa-500`
(0.1843) and `atlas-500` (0.1797) are **the same weight**, distinguishable only
by saturation, 18% against 100%.

The file's own header explains the ladder was rewritten *because* the previous
version was a red-to-green ramp. The replacement still crosses four named ramps.
It is also invisible to `verify_palette_membership`, which reads hex and rgb
literals and `moss|amber|orange` class names, not `var(--...)` token references.

**`WhoHasMoney`'s `PowerGauge` renders this ladder literally**, as five adjacent
band swatches, and `GroundUnderYou`'s `FootingLegend` prints it as a legend
between the words "Shaky" and "Firm". So the non-monotonic ramp is not only used,
it is displayed to the reader as the key.

Worse: **`WhoHasMoney`'s `MixBar` applies the ladder to share-of-spend**, a
quantity with no good-or-bad direction at all. A 10% row prints maroon and an 80%
row prints terracotta, asserting a verdict the data does not carry.

### 11.2 Clear violations outside `meaningStep`

| Graphic | Where | The split |
| --- | --- | --- |
| `ui/progress-bar.tsx` | LIVE `/coverage/[iso2]`, `/decide/[activity]/[city]` | `success` atlas-500 -> `warning` cocoa-500 -> `danger` clay-700, three ramps. **And on `/coverage` the intensity runs backwards between the top two tiers**: A maps to `success` (`bg-atlas-500`) while B maps to `default` (`bg-atlas-700`), so the better tier is the lighter fill. The page's own comment still describes the retired "deep green / amber" palette |
| `SpineMap` `tone` | LIVE but GATE-ONLY on 4 routes | `dotFill = p.tone === "ink" ? INK : TERRA_ACCENT` - an above/below-baseline reading split across `#c2410c` and `#1b1b1a`, **hardcoded hex, not tokens**. Mitigated: dot size already carries the continuous magnitude, the split is at a meaningful drawn reference (the city rate), and the two differ strongly in luminance so it survives greyscale |
| `CityDistrictMap` | DEV-ONLY `/dev/city2` | Five ordered wealth bands split between three cool greys and two terracottas, **and the grey half is non-monotonic in lightness**: `--n4` (lightest) is the worst band, `--n2` (darkest) is the middle band, then it jumps back up to the lighter `--terra-bright`. A reader decoding "darker = more" gets the wrong answer at the midpoint |
| `SameBusinessAbroad` | `/[country]`, but `notHeld` | Delta tone `--accent` vs `--clay-600` |

### 11.3 Soft violations - two ramps, but redundantly encoded

These split an ordered quantity across two named ramps, but a second channel
carries the same information, so meaning never rides on colour alone.

- **`kit/charts/SeverityGlyph`** - cocoa-500 -> clay-500 -> clay-700, but the
  **filled-step count carries the level independently**. The strongest mitigation
  in the set.
- **`kit/charts/ScoreBand`** - atlas-700 -> cocoa-500 -> cocoa-700, but the band
  **word is printed**.
- **`kit/charts/TierBar`** - atlas-700 vs cocoa-500 vs cocoa-300, but fill width
  carries the position. Dev-only anyway.
- **`kit/blocks/VsWorld`** - `text-atlas-700` above vs `text-cocoa-900` below, but
  the signed number and the word both carry it.
- **`board/charts/CrowdingGauge` and `RentGauge`** - cocoa-300 -> cocoa-500 ->
  clay-500. Two of three steps share a hue and the third jumps ramps. **Renders
  nowhere.**
- **`NeighborhoodOverview.multColor`** - `atlas-700` premium vs `clay-600`
  suppressed vs `cocoa-700` near par. Technically three ramps, **practically
  inert**: atlas-700 is hue 7 and clay-600 is hue 5, near-identical reds, and
  every row prints its own figure. The file records that the premium step was
  green until 2026-08-17 and that `verify_palette_membership` could not see it
  because it reads hex literals and class names, not token-object reads. **That
  blind spot still applies to `clay[600]` here.**
- **`CitySignaturePanel.SpectrumBar`** - a five-stop gradient running
  `atlas-600 -> atlas-200 -> parchment -> paper-450 -> graphite`, two hue families
  at the two poles. Mitigated by intent (the quantity is declared non-ordinal),
  and **currently dark** - the one live call site passes `showInstitutions={false}`.

### 11.4 Clean

The whole `spine2` kit (28 graphics, terracotta plus one achromatic neutral ramp
throughout), the whole `spine` v1 bar/dot/stack family (`GREY_RAMP`, `GREYS`,
`DP_GREYS` for magnitude with terracotta reserved for a single semantic accent),
`kit/RangeStrip`, `kit/MoneyGoesBreakdown`, `ui/bar-list` (`RANK_RAMP` is four
steps of one ramp, and the file says so: "The shade ENCODES rank, so it stays
honest, not decorative"), `board/CostBar`, `board/DriverBar`,
`board/SurvivalCurve`, `charts/PercentileStrip`, `ui/tier-dot`, and both world
maps.

---

## 12. Graphics with no live call site

### 12.1 Nothing in `src/` mounts them

| Graphic | Path | What it was for |
| --- | --- | --- |
| `Waterfall` | `kit/charts/Waterfall.tsx` | The real waterfall. Barrel-exported only |
| `HeatStrip` | `kit/charts/HeatStrip.tsx` | Footfall over one sequence |
| `FootfallGrid` | `kit/charts/FootfallGrid.tsx` | Days x hours heatmap |
| `CostSplitTable` | `kit/tables/CostSplitTable.tsx` | Where each $100 goes, as a table |
| `RangeTable` | `kit/tables/RangeTable.tsx` | Pay range by role |
| `EngravedHero` | `kit/engraved/EngravedHero.tsx` | Procedural city engraving |
| `LicenceList` | `kit/blocks/LicenceList.tsx` | Licence check marks |
| `ProfileChip`, `venue-notes`, `WeightedCompare` | `kit/` | Popover, note cards, weighted table |
| `BarList` | `ui/bar-list.tsx` | Ranked density comparisons |
| `Spark`, `Timeline`, `Spectrum` | `spine/kit.tsx` | Sparkline, milestone axis, two-pole spectrum. **Still registered in the `GRAPHIC_TYPES` dev tripwire** |
| `Quad`, `HexLens`, `Matrix`, `Fitgrid`, `Hoodcards`, `Wealth`, `Archetypes`, `SparkTrend`, `Tline` | `spine2/` | Opportunity scatter, radar, licence matrix, trade-district fit grid, district cards, wealth-band spread, population archetypes, ten-year sparks, opening gantt |
| `CountryMastheadImage`, `AnnualCostStack`, `SubIndustryPicker`, `TurnoverBandChip` | various | Masthead photo, cost table, picker, chip |

That is **roughly 30 graphics with no mount point**, nine of them in `spine2`
alone. Every one was checked for barrel re-export: the render graph resolves
`export ... from` chains back to the defining file, so a component reached only
through `kit/index.ts` correctly reads as unmounted.

### 12.2 Mounted, but permanently fed not-held data

These render on `/[country]`, which is the default-live country surface, but the
page passes `notHeld<...>()`, so **only their empty states ship**:

`OpportunityGap` (scatter), `SameBusinessAbroad` (diverging bar), `SpecialZones`
+ `GateMotif`, `TalentReality`'s `Gauge`, `YourLifeHere`'s bars, `WhoHasMoney`'s
`MixBar`, `DialGauge` (also always passed `daysToHire={null}`), and
`HowFarYouReach`'s gauge strip.

This is a distinct and more interesting category than "unused": the section
frames, headings and empty states are on the live page, and a reader sees the
shape of a chart that has never held a number.

### 12.3 Renders on no URL at all

`board/charts/CostBar`, `CrowdingGauge`, `RentGauge`, `SurvivalCurve`,
`v2/CityHeroV2`, `v2/LondonRoadmap`, `board/BoardHero`, `board/FailureCards`,
`board/ScoreStrip` - all reachable only from `src/app/_design/`, which is a
Next.js private folder and is not routable.

---

## 13. What this inventory cannot distinguish

Stated plainly, because a measurement that cannot name its blind spot is not
ready to act on.

1. **A component that renders but is visually empty looks identical in source to
   one that renders well.** Static reading cannot tell which quantities actually
   resolve at runtime. Section 12.2 is the part of this I could establish, because
   the country page passes a literal `notHeld<...>()` that is greppable. Where a
   value arrives from an accessor at request time, I cannot tell whether it is
   there. `SpineMap`'s `signal` defaulting to `50`, `WalkTrack`'s unknown word
   defaulting to `50`, and `FootfallScale` defaulting to `{50, 50}` are three
   places where **absent data silently renders as a mid-scale reading**, and
   nothing in the source distinguishes that from a real 50.

2. **Which surface production actually serves is not in this repository.** Seven
   runtime gates split the spine pages and the homepage into two surfaces each.
   With no environment variables set every gate resolves OFF. The live values are
   Vercel project settings. **63 of 226 live-reachable components sit behind a
   gate**, including the entire `spine2` cell page. If the `cell` gate is off,
   twelve of the graphics in section 7.1 are not on the site.

3. **The render graph tracks JSX mounts, not every way a component can reach the
   page.** A component passed as a value (`component: Foo`), resolved through a
   dynamic string key, or mounted via `next/dynamic` with a computed path would be
   missed. I found no such case in the graphic set, but I did not prove their
   absence.

4. **"Renders" is not "is visible".** A graphic can be mounted and then hidden by
   CSS at a breakpoint. Two cases surfaced only because the files say so:
   `RulerColumn`'s dot rail is `display:none` below 560px, so **the encoding
   disappears entirely on mobile**; `OwnerKeepTable`'s card list drops its bar
   below `sm`. There may be others I did not catch, because finding them means
   reading every media query in `atlas-spine.css` and `globals.css` against every
   graphic.

5. **Rendered size is not source size.** SVG text sized in viewBox units shrinks
   with the container, and several files carry measured evidence of this
   (`RangeStrip` figures painting at 6.6px in a 361px column; `StampSeal`'s
   `ATLAS REGISTRY` at roughly 3.2 CSS px). I recorded the cases the files
   document and the ones where the arithmetic is obvious. **I did not measure any
   of them.** The companion file
   `2026-08-19-graphics-rendered-observations.md` is the instrument for that.

6. **Colour claims are computed from tokens, not from pixels.** Section 11's hue
   and luminance figures are calculated from the hex values the tokens resolve to
   in `globals.css`. Whether a given fill is legible on the surface it actually
   lands on is a render question, and `band_tone.ts` says so itself: "a class
   string is not a pixel".

7. **This is an inventory, not a judgement.** Nothing here says a graphic is the
   wrong form for its quantity. Where I recorded a defect - a non-monotonic ramp,
   a per-row scale that makes every bar the same length, an axis that is
   logarithmic and says so nowhere - that is a factual property of the code, not a
   verdict on the design.
