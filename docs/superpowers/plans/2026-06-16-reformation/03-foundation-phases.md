# 03 — Foundation Phases (F1 to F5)

The detailed build phases for the design FOUNDATION of the reformation. These
become the first five phases of the master plan: everything the page-type
reformations (cell, country, city, neighbourhood, home) stand on. They install
and integrate the adopted stack, rebuild the token pipeline in OKLCH, wire the
type system, build the Margin Atlas chart kit, and stand up the six-band layout
shell.

Two grounding facts shape every phase below, both true of the repo today:

1. **The foundation is partly built already.** This is not a greenfield install.
   `src/lib/design-tokens.ts` is the live value authority (warm palette in hex).
   `tailwind.config.ts` imports `tailwindColors` / `fontFamily` / `elevation` /
   `z` from it. `globals.css` carries the shadcn semantic variables as
   space-separated RGB triplets. The chart kit lives at
   `src/components/kit/charts/` with a working nullable-in / silence-out contract
   (`isNum(...) -> return null`), a shared `helpers.tsx`, and an internal
   `/dev/charts` showcase. The visx footprint is already on disk
   (`@visx/axis`, `@visx/gradient`, `@visx/group`, `@visx/scale`, `@visx/shape`,
   `@visx/text` at 3.12), `lucide-react`, several `@radix-ui/react-*` packages,
   and `shadcn` (at 4.10.0) are installed. The foundation phases therefore
   **extend and migrate**, they do not bulldoze.

2. **The reformation changes HOW sections compose, never WHICH sections exist.**
   The five locked section orders (home, UK country, London city, London
   restaurants cell, London neighbourhoods) are immutable. The foundation gives
   the page reformations a richer vocabulary (OKLCH tokens, a fuller chart kit, a
   six-band shell, three reading lanes) so each locked section can transmit
   graphically. No section is added, removed, or reordered here.

A standing rule for all five phases: the work happens on the held branch
(`reform-v2/r6-forward`), never against live production directly, and every
phase ends green on the full gate suite before the next begins.

---

## Stack reconciliation note (read before F1)

The research adopt-list (`00-research-answer-source.md`, Part C) and the live
`package.json` disagree on three points. The plan resolves them as follows, and
F1 implements the resolution:

- **shadcn:** research says pin `shadcn@2.3.0` for a Tailwind 3 project; the repo
  has `shadcn@4.10.0` in devDependencies and is already on Tailwind 3.4. The
  components copied in so far render fine. Resolution: keep using the installed
  CLI for the components already present, but when adding NEW shadcn components in
  F1 use the `shadcn@2.3.0` invocation the research specifies so the generated
  code targets the Tailwind 3 path, then reconcile any drift by hand. Do not
  upgrade Tailwind to 4 in the foundation (Part D recommendation: stay on 3.4).
- **visx:** research says `npm install @visx/visx`; the repo already has the
  individual `@visx/*` subpackages. Resolution: keep the subpackage approach
  (smaller bundles, already wired) and add only the missing subpackages a chart
  needs (`@visx/curve`, `@visx/glyph`, `@visx/tooltip` if/when required). The
  meta-package is optional.
- **fonts:** research offers Fontsource as an alternative to `next/font/google`;
  the repo loads Newsreader + Inter via `next/font/google` in
  `src/app/layout.tsx`. Resolution: keep `next/font/google` for now (it works and
  pins the variable-font slots `--font-display` / `--font-sans`); treat Fontsource
  as a deferred swap, not a foundation requirement. F3 wires the SCALE and figure
  rules on top of the existing font slots rather than re-plumbing font delivery.

---

## F1 — Install and integrate the adopted stack

### Goal

Bring the minimum coherent stack onto the held branch so the later phases have
their tools, verifying Next 15.5 / React 19.2 / Tailwind 3.4 compatibility with
NO peer-dependency conflicts and NO regression to the live gates. The deliverable
of F1 is a clean, installable, green tree, not new UI.

### Research it draws on

Part C adopt-list and combined install block; Part D tradeoffs (stay on Tailwind
3.4, visx + Observable Plot together, Radix/shadcn now / Base UI later, Motion
static-first). The new-to-the-repo packages are: `@observablehq/plot`, `jsdom`
(+ `@types/jsdom`), `d3` (+ `@types/d3`), `style-dictionary`, `culori`,
`@radix-ui/colors`, `motion`, plus any missing `@visx/*` subpackages. Already
present and NOT to be reinstalled: visx core subpackages, `lucide-react`, the
`@radix-ui/react-*` set, `class-variance-authority`, `clsx`, `tailwind-merge`,
`tailwindcss-animate`, `shadcn`.

### Substeps (interpret, design, implement, review, evaluate)

1. **Interpret.** Diff the adopt-list against `package.json`. Produce the exact
   delta to install (the six new runtime/dev libs above) and the list of
   research-named packages already satisfied, so nothing is double-installed and
   no version is downgraded.
2. **Design.** Decide the dependency placement: `style-dictionary` and the
   `@types/*` packages are devDependencies (build-time only); `culori`,
   `d3`, `@observablehq/plot`, `jsdom`, `@radix-ui/colors`, `motion` are runtime
   dependencies (charts and token build import them). Decide React 19 peer
   handling up front (npm may warn on a few peer ranges; record whether
   `--legacy-peer-deps` is needed and why, do not reach for it reflexively).
3. **Implement.** Run the scoped install (only the delta), one group at a time:
   tokens/color (`style-dictionary`, `culori`, `@radix-ui/colors`), charts
   (`@observablehq/plot`, `d3`, `jsdom`, the type packages, any missing
   `@visx/*`), motion (`motion`). Add a thin import-smoke module under
   `scripts/` or a `/dev` probe that imports one symbol from each new package so
   a broken install surfaces immediately rather than at first use.
4. **Review.** Confirm no lockfile churn beyond the intended packages; confirm
   `motion` is only ever imported from client components (it is client-only and
   must never enter a server component or a chart's render path); confirm
   `jsdom` is referenced only from Node build scripts, never bundled into a page.
5. **Evaluate.** Run the gates. The install must not change any rendered output,
   so SEE-it is a spot check (the exemplar pages still render unchanged at 1280
   and 375), not a full visual pass.

### Deliverable

An updated `package.json` + lockfile on the held branch with the adopted stack
present, a one-screen install-delta note recorded in this plan folder, and the
import-smoke probe proving every new package resolves under Next 15 / React 19.

### Verification

`npx tsc --noEmit` clean; `npm run prebuild` 31/31 (the install must not break a
gate); `npm run build` once, locally, to prove the new packages bundle and the
615 pages still prerender (this is the one sanctioned build for F1 because adding
runtime deps can only be trusted via a real build); SEE-it spot check that
exemplar pages are visually unchanged at 1280 + 375; commit on the held branch
with an honest message listing exactly what was added and any peer-dep judgment
call.

---

## F2 — Build the OKLCH token pipeline

### Goal

Move the color source of truth from hand-picked hex in `design-tokens.ts` to a
perceptual OKLCH ramp pipeline (Culori generates / audits ramps, Style Dictionary
emits the platform targets), producing `tokens.css`, the Tailwind token feed, and
a new `chartTokens.ts`, WITHOUT changing how the live site looks. The real warm
palette is preserved to the eye; only its derivation and its no-raw-hex
enforcement change.

### Research it draws on

Part A.5 (Style Dictionary, Culori, Radix Colors, Adobe Leonardo, the Datawrapper
chart-color constitution); Part B color and token law (ink / paper / sand /
terracotta single loud accent / moss / amber / red, one loud color per viewport,
no raw hex in components, the `tokens.color` and `tokens.chart` structure); Part D
single-accent discipline. Crucially, the ground truth fixes the values the
pipeline must reproduce: atlas 500 `#e62200` / 700 `#991600`, cream 50/75/100/300,
the ink ladder, cocoa / moss / clay / amber / teal, the `tier` and `delta`
semantic scales, parchment and graphite, and the chart color jobs (vermillion =
the typical value / spotlight, moss = kept / profit, cocoa = structure and costs,
ink tints = neutral mass, parchment = rails / grids, amber = caution, clay =
destructive). The banned colors (cyan / aquamarine, blue) stay banned.

### Substeps (interpret, design, implement, review, evaluate)

1. **Interpret.** Catalog every token currently exported from `design-tokens.ts`
   (the eight palette families, the two semantic scales `tier` / `delta`, the
   standalone parchment / graphite, the `semanticColors` aliases) and every place
   color is consumed (Tailwind via `tailwindColors`, globals.css `:root` RGB
   triplets, and any `chart` color references inside the kit). This is the
   migration contract: the pipeline output must cover all of it, byte-for-byte at
   the eye.
2. **Design.** Define the OKLCH source format: a small set of seed colors (one per
   family anchor) plus lightness stops, from which Culori derives each ramp. Pin
   each derived step to the EXISTING hex (the warm palette is locked, F2 is a
   derivation change, not a recolor) by treating the current hex as the target and
   tuning the OKLCH stops until Culori reproduces them within an imperceptible
   delta; where a current step cannot be reproduced perceptually, keep the
   hand-tuned hex as an override and record why. Design the Style Dictionary
   transforms: one target for `tokens.css` (CSS custom properties, including the
   RGB-triplet form globals.css needs for `rgb(var(--token) / <alpha>)`), one for
   the Tailwind color feed (replacing the literal `tailwindColors` object), one
   for `chartTokens.ts` (the fixed chart color jobs as named exports the kit
   imports). Design the no-raw-hex enforcement: extend the existing
   `verify_hardcoded_hex` gate so a raw hex in a component fails, with the token
   file and the build scripts as the only allowed homes for literal color.
3. **Implement.** Author the OKLCH source (a `tokens/` source dir), the Style
   Dictionary config, and the build script (`npm run tokens:build`, a devDep-only
   Node script). Generate the three outputs. Re-point `tailwind.config.ts` and
   `globals.css` at the generated values (the generated `tokens.css` becomes the
   variable source; `design-tokens.ts` either re-exports the generated values or
   is itself generated, so it stays the importable authority the rest of the
   codebase already depends on). Add `chartTokens.ts` and migrate the kit's
   color references to it. Wire `tokens:build` ahead of the build and document
   that hand-edits go in the source, not the generated files.
4. **Review.** Run a contrast audit with Culori against the WCAG AA floor (4.5:1
   body, 3:1 large + non-text UI) across every text-on-surface and accent-on-paper
   pairing the tokens produce, capturing the result. Confirm the one-loud-color
   rule survives (terracotta is the only loud accent; moss is the only second
   accent; everything else is ink tint / paper / parchment). Confirm the banned
   hues are absent from the generated output.
5. **Evaluate.** Pixel-diff the exemplar pages before vs after (London cell, UK
   country, home) at 1280 + 375. The migration is correct only if the pages look
   the same; any visible shift is a derivation bug to chase, not an accepted
   recolor.

### Deliverable

A `tokens/` OKLCH source, a Style Dictionary config + `tokens:build` script, the
three generated artifacts (`tokens.css`, the Tailwind color feed, `chartTokens.ts`),
a `design-tokens.ts` that now sources from the pipeline while keeping its public
shape, the extended no-raw-hex gate, and a recorded contrast-audit result.

### Verification

`npx tsc --noEmit` clean; `npm run prebuild` 31/31 including the strengthened
`verify_hardcoded_hex`; `npm run tokens:build` reproducible (running it twice
yields an identical tree); SEE-it pixel-parity pass on the three exemplar pages at
1280 + 375 (before/after screenshots side by side, confirmed by eye to be
unchanged); the Culori contrast audit recorded as passing AA; commit on the held
branch.

---

## F3 — Wire the type system

### Goal

Make Newsreader + Inter a real, enforced type SYSTEM rather than two loaded
fonts: the responsive scale, the serif-for-openers / sans-for-everything law,
tabular figures on all data, and the band-opener treatment the six-band layout
(F5) will consume. No font-name is ever hardcoded in a component; everything binds
to the existing `--font-display` / `--font-sans` slots.

### Research it draws on

Part A.4 (Newsreader + Inter, the must-have pairing; Fontsource as deferred);
Part B type system (Newsreader for mastheads / section openers / verdicts / story
pullouts / the largest revenue number; Inter for body / UI / captions / chart
labels / tables / controls / methodology / nav; the `font-variant-numeric:
tabular-nums lining-nums` rule on `.numeric` / `[data-numeric="true"]`; the
`typeScale` of hero / h1 / h2 / h3 / body / small / micro using `clamp(...)`).
Ground truth constraints: serif reserved for H1 to H3, the single masthead anchor
number, pull-quotes, the wordmark, the italic unit suffix; never below 20px; the
existing `fontSize` ladder (xs 12 to 6xl 60) stays the discrete step scale.

### Substeps (interpret, design, implement, review, evaluate)

1. **Interpret.** Inventory current type usage: the `fontFamily` slots and
   `fontSize` ladder in `design-tokens.ts`, the `font-display` / `font-sans`
   Tailwind utilities, and where data numerals currently get `tabular-nums` (the
   charts and tables already do; confirm coverage). Identify the gap the research
   fills: a fluid heading scale (`clamp`) for the hero and band openers, a single
   canonical `.numeric` rule, and a documented band-opener component pattern.
2. **Design.** Define the fluid scale as tokens (hero / h1 / h2 / h3 as `clamp`
   values; body / small / micro as fixed rems) added alongside, not replacing, the
   discrete `fontSize` ladder, so existing call sites keep working while new
   band-level type uses the fluid steps. Design the figure rule: one place
   (`globals.css` base layer) sets `font-variant-numeric: tabular-nums lining-nums`
   on `.numeric` and `[data-numeric="true"]`, and the data primitives carry it by
   default. Design the band-opener: a small typographic component (serif eyebrow
   optional, serif heading at h2/h3, an optional sans standfirst) that the six
   bands open with, enforcing the never-below-20px serif floor.
3. **Implement.** Add the fluid scale tokens and expose them as Tailwind utilities
   (or a small set of heading classes). Add the `.numeric` base rule. Build the
   band-opener component in the kit (it is structure, not data, so it has no
   nullable contract; it simply renders its given strings). Update the type
   showcase at `/dev/font-showcase` to render the full scale, the serif/sans
   split, the tabular-figure proof (numbers aligning in a column), and the band
   opener, so the system is visible in one place.
4. **Review.** Confirm no component hardcodes a font name (the existing typography
   gate, `verify_typography_consistency`, should already guard this; extend it if
   the new utilities need coverage). Confirm the serif never renders below 20px
   anywhere the band opener or headings appear. Confirm Inter carries every
   numeral outside the single masthead anchor.
5. **Evaluate.** SEE the showcase and one real exemplar of each affected band
   (the cell masthead, a country band opener) at 1280 + 375: the hero number reads
   as the display cut, body and tables read as Inter, columns of figures align on
   the decimal, nothing falls below the serif floor, no horizontal scroll at 375.

### Deliverable

The fluid type scale tokens, the canonical `.numeric` figure rule, a band-opener
kit component, an updated `/dev/font-showcase`, and (if needed) an extended
typography gate, all on the held branch.

### Verification

`npx tsc --noEmit` clean; `npm run prebuild` 31/31 including
`verify_typography_consistency`; SEE-it at 1280 + 375 on `/dev/font-showcase` plus
the cell masthead and a country band opener, confirming the serif/sans law,
tabular alignment, the 20px serif floor, and no 375 overflow; commit on the held
branch.

### Dependency note

F4 (charts) and F5 (layout bands) both consume F3's scale and band opener, so F3
lands before them. F3 depends only on F1 (the fonts already load), not on F2,
so F2 and F3 can run in parallel if needed (they touch different token surfaces:
F2 color, F3 type).

---

## F4 — Build the Margin Atlas chart kit

### Goal

Grow the existing chart family at `src/components/kit/charts/` into the full
statistic-to-chart vocabulary the page reformations need, every component built on
visx + d3 + the F2 chart tokens, every one SSR-safe and nullable-in / silence-out,
every one cataloged in the `/dev/charts` showcase, gates green and SEEN at
1280 + 375.

### Research it draws on

Part A.3 (visx primary, Observable Plot + jsdom for static / prototyped charts,
d3 modules as the scale / format / shape math layer; Recharts / nivo / Tremor
explicitly NOT the public chart layer); Part B chart language, which maps each
statistic to a chart type: revenue distribution to an interval dot plot /
percentile band; revenue spread to a labeled min/median/high band; the calculator
to a controlled-input live range band; tangible units to an equivalence card;
cost-structure P&L to a waterfall; cost levers to ranked sensitivity / tornado
bars; owner keeps to a moss-highlighted retained band; break-even to a threshold /
bullet; risks to a severity ladder / matrix; pay by role to an aligned wage table;
cost to open to a range bar; seasonality to a 12-month line / heat strip;
first-year ramp to a step + cumulative sequence; comparable places to a ranked dot
plot / small multiples; versus the world to a percentile dot plot; operator voices
to quote cards; methodology to a source table + confidence badge. Part A.6
references (Tufte give-every-mark-a-job, Bertin position-before-color, the FT
Visual Vocabulary, the Datawrapper chart-type guide) are the QA law for chart
choice.

Ground truth anchors the existing kit: the house grammar (one vermillion idea per
view, under 5% of surface; moss = kept; cocoa = costs; ink tints = neutral mass;
parchment = rails; amber = caution; clay = destructive; always show the spread;
nullable in / silence out), the components already present (RangeStrip, Waterfall,
ScoreBand, ComparisonBars, HeatStrip, FootfallGrid, VisitorSplit, and the five
R7 primitives LikeForLikeBars / ThresholdGauge / TimelineRibbon / SeverityGlyph /
TierBar), the shared `helpers.tsx` (`isNum`, `hasText`, `clamp01`,
`fmtUsdCompact`, `ChartEmpty`, `ChartEyebrow`, `usePrefersReducedMotion`), and the
warm-frame / clean-data law (no glass or imagery behind a number).

### Substeps (interpret, design, implement, review, evaluate)

1. **Interpret.** Map the research chart language onto what the kit already has,
   producing a coverage table: statistic to required chart to existing component
   (or gap). Most distribution / range / break-even / risk / ramp / peer / cost
   needs are already served by the present family; the likely gaps are the
   distribution dot plot / percentile band (a true `RevenueRange` / interval plot
   beyond the current `RangeStrip`), the tornado / ranked-sensitivity cost-lever
   chart, the seasonality 12-month line (distinct from the `HeatStrip`), and the
   versus-the-world percentile dot plot. Confirm each gap against the locked
   section orders so a built chart has a section that consumes it.
2. **Design.** For each gap, design one component to the house contract: a typed
   props shape with every datum nullable; `return null` when data is insufficient
   (never a placeholder chart, per the ground-truth rule and the existing
   `ThresholdGauge` precedent); the visual built so it server-renders (visx draws
   SVG with d3 scales / formats / shapes computed at render time, no client-only
   measurement in the server path; any reveal is a CSS `motion-safe:` keyframe, not
   JS, matching the existing Waterfall / ComparisonBars approach); color drawn only
   from `chartTokens.ts` (F2), with vermillion reserved for the single focal
   subject and meaning never carried by color alone (a label or position always
   co-signals); a 375px form that reflows without horizontal scroll; a filled state
   and an honest `ChartEmpty` state. Decide where Observable Plot + jsdom earns its
   place: static / server-generated methodology graphics and rapid chart-choice
   prototyping, NOT the interactive public component layer (that stays visx).
3. **Implement.** Build each gap component in `src/components/kit/charts/`, export
   it from `charts/index.ts` and the kit barrel, and add it to `/dev/charts` in
   representative states (filled exemplar, thin instance, and the empty state) on
   real-shaped sample content. Reuse `helpers.tsx` rather than redefining guards or
   formatters. Where a chart is better proven first in Observable Plot, generate a
   static SVG into the showcase as a design reference before committing the visx
   version.
4. **Review.** QA each chart against the Visual Vocabulary / Tufte / Bertin law:
   does every mark have a job, is position doing the work before color, is the
   chart the right family for the statistic, is there no legend the direct labels
   could replace, does the spread always show. Confirm SSR (each chart renders in a
   server component with no client boundary required) and the silence-out contract
   (passing nulls yields the empty card, not a crash or a fake bar).
5. **Evaluate.** SEE the full `/dev/charts` showcase at 1280 + 375, plus at least
   one real page that already consumes a reformed chart, confirming: clean opaque
   data core (no texture behind a number), the single-vermillion budget, tabular
   numerals, direct labels, the 375 reflow, and that an empty instance reads as
   intentional scaffolding rather than a broken state.

### Deliverable

The completed chart family in `src/components/kit/charts/` (existing components
plus the built gap components), all exported from the barrel, all consuming
`chartTokens.ts`, the `/dev/charts` showcase extended to every chart in
filled / thin / empty states, and a recorded statistic-to-chart coverage table
mapping the research chart language to real components.

### Verification

`npx tsc --noEmit` clean; `npm run prebuild` 31/31 (including
`verify_render_guards`, `verify_signature_quality`, and the no-raw-hex gate the
charts now satisfy via tokens); SEE-it on `/dev/charts` at 1280 + 375 in all three
states per chart, plus one consuming exemplar page, with eyes confirming the
clean-data law and the silence-out behavior; commit on the held branch.

### Dependency note

F4 depends on F2 (chart tokens) and F3 (the figure rule and band opener the charts
sit under). It does not depend on F5; the charts are built and proven in the
showcase before the layout shell composes them onto pages.

---

## F5 — Build the layout system (six bands, three lanes, the grid)

### Goal

Stand up the structural shell the page reformations compose into: the six
narrative bands, the three reading lanes at desktop, the 12 / 6 / 4 responsive
grid, section banding with consistent vertical rhythm, and a sticky section index.
The shell is a frame the LOCKED sections drop into; it never changes which
sections exist or their order, only how they group and read.

### Research it draws on

Part B grid and density philosophy: the page is a guided reference spread of SIX
bands, not an 18-section stack (the answer / the verdict / the economics / the
operating reality / the comparison field / the trust layer); the 12-column desktop
/ 6-column tablet / 4-column mobile grid; the three reading lanes at 1280+ (a quiet
left rail for section identity and source / method cues, a central editorial column
for the main claim and chart, a right rail for calculators / benchmark cards /
comparison summaries); collapse to one column at 375 with section order preserved
and a compact sticky section index only if it does not obscure reading; the
governing rule of one idea per band (one dominant visual, one crisp claim, one
explanatory paragraph, one trust cue). Part A.6 layout references (NN/g visual
hierarchy and scanning, NN/g whitespace and grids) are the QA law: density is
organized by rhythm and grouping, not by shrinking everything.

Ground truth constraints: the locked section orders for all five page types are
immutable (the six bands are a GROUPING over the locked sections, never a
re-listing); `src/lib/page-sections.ts` is the machine manifest that the spec says
must be rewritten to match the 2026-06-16 orders in the same change as the
reformation; the warm frame (gutters + per-category hero wash + glass chrome) ships
ON by default and collapses below 1100px, never behind data; engraved texture
lives only in the frame and shells, never behind a number; 375px is a designed
layout with no horizontal scroll; the existing kit already carries
`StickySectionNav`, the `frame/` family (`AtlasGutters`, `HeroWash`), and the
`sections.tsx` / `furniture.tsx` section scaffolding to build on.

### Substeps (interpret, design, implement, review, evaluate)

1. **Interpret.** For each of the five page types, map its locked section order
   onto the six bands: which locked sections belong to the answer, the verdict,
   the economics, the operating reality, the comparison field, the trust layer.
   This mapping is a grouping only, it must reproduce the exact locked order within
   and across bands (e.g. the cell order keeps risks up after the money block and
   the prose story low, exactly as locked). Record the mapping as the band contract
   the page reformations will follow. Inventory the existing layout pieces
   (`StickySectionNav`, `frame/AtlasGutters`, `frame/HeroWash`, `sections.tsx`,
   `furniture.tsx`) so the shell extends them rather than duplicating.
2. **Design.** Design the band shell: a `Band` wrapper that takes a band identity
   (one of the six), opens with the F3 band-opener, and enforces the
   one-idea-per-band rhythm (the `sectionSpacing` tokens already define tight /
   base / loose / hero / band gaps; the shell uses `band` between bands and `loose`
   between sections within a band). Design the three-lane layout at 1280+ as a CSS
   grid (left identity rail / center editorial column / right rail), degrading to a
   single column below the lane breakpoint with section order preserved; the lanes
   are a desktop reading aid, not a data dependency, so a section reads correctly
   collapsed. Define the 12 / 6 / 4 column grid as the internal grid each band's
   center column uses. Design the sticky section index off the existing
   `StickySectionNav`, reading the band / section structure, compact at 375 and
   never obscuring reading (it hides or collapses when it would overlap content).
   Keep the warm frame on by default and ensure the lanes sit inside the frame
   gutters, with the gutter collapse (below 1100px) and the lane collapse
   coordinated so data never falls behind imagery.
3. **Implement.** Build the `Band` shell and the three-lane layout primitive in the
   kit (structure, not data, so no nullable contract). Rewrite
   `src/lib/page-sections.ts` (and `src/lib/page-layout/section-order.ts`) to the
   2026-06-16 locked orders and to carry the band grouping, keeping
   `verify_page_sections` / `verify_section_order` as the contract that the orders
   are exactly preserved. Wire the sticky section index to the new structure. Prove
   the shell on a `/dev` layout showcase (a new `/dev` route or an extension of an
   existing one) that renders the six bands with placeholder section blocks and the
   three lanes, at 1280 and 375, before any real page is reformed.
4. **Review.** Confirm `verify_page_sections` and `verify_section_order` pass
   against the rewritten manifest (no section dropped, reordered, or renamed; the
   orders match the locked spec exactly). Confirm the band grouping is purely a
   grouping (diff the flattened band order against the locked order, they must be
   identical). Confirm the lanes collapse cleanly: at 375 it is one column, order
   preserved, no horizontal scroll, the sticky index does not obscure reading, and
   no data sits behind the gutters or the hero wash. QA the rhythm against the NN/g
   law (what does the eye see first / second / third in each band).
5. **Evaluate.** SEE the layout showcase at 1280 + 375, then SEE one real exemplar
   page (the London cell or UK country) re-shelled into the six bands at 1280 + 375,
   confirming: the six-band reading, the three lanes at desktop, the single column
   at mobile with order intact, the sticky index behaving, the warm frame on with
   gutters collapsing correctly, and cohesion with the other page types.

### Deliverable

The `Band` shell + three-lane layout primitive in the kit, the rewritten
`page-sections.ts` / `section-order.ts` matching the 2026-06-16 locked orders with
the six-band grouping, the wired sticky section index, a `/dev` layout showcase,
and a recorded per-page-type section-to-band mapping the reformations follow.

### Verification

`npx tsc --noEmit` clean; `npm run prebuild` 31/31 with `verify_page_sections` and
`verify_section_order` PASS against the rewritten manifest (the gate proves no
section was dropped or reordered); SEE-it at 1280 + 375 on the layout showcase and
one re-shelled exemplar page, eyes confirming the six bands, three lanes, 375
single-column reflow, sticky index, warm-frame gutters, and cross-type cohesion;
commit on the held branch.

### Dependency note

F5 depends on F3 (the band opener and scale) and benefits from F4 (the charts that
fill each band's dominant visual), so it runs last of the five. With F5 complete,
the foundation is whole: tokens (F2), type (F3), charts (F4), and layout (F5) all
stand on the integrated stack (F1), and the page-type reformations begin.

---

## Foundation exit criteria (all five green)

The foundation is done, and the page reformations may begin, when:

- The adopted stack is installed and the tree builds and prerenders all live pages
  with no peer-dependency or gate regression (F1).
- Color is generated from an OKLCH source through Style Dictionary, the warm
  palette is pixel-preserved, no component carries raw hex, and contrast passes AA
  (F2).
- The Newsreader + Inter type system is enforced: the fluid scale, the serif /
  sans law, tabular figures everywhere data lives, the 20px serif floor, and a band
  opener (F3).
- The chart kit covers the research statistic-to-chart language, every chart is
  SSR-safe and silence-out, every chart consumes the chart tokens, and all are seen
  in `/dev/charts` at 1280 + 375 (F4).
- The six-band shell, three reading lanes, 12 / 6 / 4 grid, and sticky index exist,
  the section manifest matches the 2026-06-16 locked orders exactly, and one
  exemplar page reads correctly re-shelled at 1280 + 375 (F5).

Every phase ends on `npx tsc --noEmit` clean, `npm run prebuild` 31/31, SEE-it at
1280 + 375 where the change is visual, an honest report, and a commit on
`reform-v2/r6-forward`. Nothing in the foundation promotes to production: per the
locked decision, the cohesive site ships once at Wave F.
