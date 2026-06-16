# 01 — Resource Study

A rigorous read of every resource in the research answer's Part A, interpreted against the real Margin Atlas stack and the locked ground truth. For each resource: what it is, the methodology or lesson we take, an explicit DECISION (ADOPT / REFERENCE-ONLY / SKIP) with a one-line rationale, and for adopted installable resources the exact install command plus integration risk on our Next 15.5 / React 19.2 / Tailwind 3.4 stack.

Three things to hold in mind while reading the decisions:

1. This is a planning document. Nothing here installs or modifies code. The combined install plan stays in Part C of the source and in later plan files; this study only decides and flags.
2. The repo already carries a partial version of the recommended stack, and several installed versions DIVERGE from the research answer. Those divergences are the highest-value findings and are called out per-resource and collected in the currency note at the end. Ground for the divergences: `package.json` (read 2026-06-16).
3. The five locked page types and their fixed section orders are immutable. Every ADOPT below changes HOW a section is composed or visualised, never which sections exist. The chart and token resources feed the six narrative bands; they never re-cut the spine.

Legend: priority shown as the research answer assigned it (must-have / strong / optional), then our decision, which can differ when ground truth overrides the source.

---

## Category 1 — North-star reference products and sites

These are all reference sites with no install surface. The decision for every one is REFERENCE-ONLY by nature; the real work is deciding WHICH lesson each one contributes and which we explicitly decline.

### 1.1 Financial Times Visual and Data Journalism + Visual Vocabulary
- **What it is:** FT's visual-journalism hub plus the Visual Vocabulary poster/tool that maps analytical intent (deviation, correlation, ranking, distribution, part-to-whole, change-over-time, magnitude, spatial, flow) to chart families. Open repo, OFL-ish reference license, still the standard newsroom training artifact.
- **Lesson we take:** the chart-choice law. A statistic's intent should pick its chart, not a designer's taste. This is the single most directly applicable resource because Margin Atlas has a fixed catalogue of statistic types (revenue spread, cost flow, break-even threshold, peer ranking, seasonality, ramp) that map cleanly onto the vocabulary.
- **DECISION: REFERENCE-ONLY (must-have reference).** It is our chart-choice constitution; we encode it as a decision table in a later plan file, not as a dependency.
- **Rationale:** it converts the existing house chart grammar (design-system.md §3.2/§10) from prose into a per-statistic mapping, which is exactly what the six-band composition needs.

### 1.2 Our World in Data + Grapher
- **What it is:** a global-data publication plus its open Grapher charting engine. Calm prose, chart-first explanation, source transparency, reusable chart modules.
- **Lesson we take:** how to make global comparison legible without flattening nuance, and how to disclose source/method at chart level. Directly relevant to the country page (versus the neighbours, versus the world, how far you can reach) and to the methodology trust layer.
- **DECISION: REFERENCE-ONLY (must-have reference).** Study Grapher's source-note and download patterns; do not adopt the engine.
- **Rationale:** Grapher is a whole framework with its own data model; we already have a tokened SVG chart kit, and the honesty boundary requires our own source-disclosure pattern (no source-agency names, a hard constraint Grapher does not respect).

### 1.3 Datawrapper
- **What it is:** a commercial editorial charting SaaS plus an unusually practical chart-type guide. Plain-language titles, minimal legends, accessible palettes, publish-grade defaults.
- **Lesson we take:** the chart-furniture house style: terse titles, one-line subtitles, source captions, compact legends, mobile chart behavior. This is the closest external match to the "publisher-grade default" register we want.
- **DECISION: REFERENCE-ONLY (must-have reference).** House standard for chart titles, captions, legends, and 375px chart behavior.
- **Rationale:** SaaS tool, not a library; its value is the editorial conventions, which we bake into the chart kit's title/caption slots.

### 1.4 The Economist Graphic Detail
- **What it is:** the Economist's data-journalism strand. Limited palettes, high contrast, one dominant color, compact confidence.
- **Lesson we take:** one-color discipline and density without noise. This validates the existing token law (`atlas` is the only loud color; one idea per view; under 5% of surface) from an external authority.
- **DECISION: REFERENCE-ONLY (strong reference).** Discipline reference for terse titles, restrained color hierarchy, and the single-accent rule.
- **Rationale:** publisher reference, no install; it reinforces a rule we already hold rather than introducing a new one.

### 1.5 The Pudding
- **What it is:** a narrative data-essay publication. Strong at guided reading: section pacing, annotation, visual reveals.
- **Lesson we take:** pacing for the few sections that are genuinely narrative: the story in plain words, operator voices, the first-year ramp. Use it for momentum, not for the dense data board.
- **DECISION: REFERENCE-ONLY (strong reference), scoped.** Apply only to the prose/ramp/voices beats; explicitly NOT to the economics band.
- **Rationale:** Pudding's scroll-driven spectacle conflicts with "static first" and "never make motion necessary to understand a number." Borrow pacing, refuse the spectacle.

### 1.6 Reuters Graphics
- **What it is:** Reuters' graphics desk. Plain labels, sober hierarchy, no ornamental clutter; strong on risk, geography, and "what changed."
- **Lesson we take:** concise risk visuals, severity ordering, source-forward trust blocks. Feeds the cell's "what to watch" (SeverityGlyph) and the country "where the margin leaks."
- **DECISION: REFERENCE-ONLY (strong reference).** Model for severity ordering and risk visuals.
- **Rationale:** publisher reference; its severity-ordering lesson maps onto the locked SeverityGlyph primitive without any dependency.

**Category 1 verdict:** zero installs. Adopt FT Visual Vocabulary, OWID, and Datawrapper as the three governing references for chart choice, source disclosure, and chart furniture respectively; Economist/Reuters/Pudding as discipline and pacing references.

---

## Category 2 — Open-source design systems and component libraries

### 2.1 shadcn/ui (pinned to the Tailwind 3 path, `shadcn@2.3.0`)
- **What it is:** copy-in (not dependency) accessible component code built on Radix + Tailwind. Components land in our tree as owned source, so tokens and markup stay ours.
- **Lesson we take:** accessible, editable primitives without importing a visual opinion, which is exactly right for a product that needs a custom editorial skin over the engraved-almanac identity.
- **DECISION: ADOPT, with a hard pin and a guard.** Use the CLI to scaffold only the primitives we lack (dialog, popover, select; possibly command/sheet/skeleton), then re-skin every generated file to semantic tokens before it touches a page.
- **Install:** `npx shadcn@2.3.0 init` then `npx shadcn@2.3.0 add dialog popover select` (add others only as a section needs them).
- **Integration risk: HIGH friction, and a live divergence.** The repo's `package.json` already lists `shadcn` as a devDependency at `^4.10.0`. The research answer (and the v3 shadcn docs) explicitly require `2.3.0` for Tailwind 3 projects; the v4 CLI assumes Tailwind 4 (`@theme`, the new `globals.css` shape, CSS-first config) and will mis-scaffold or rewrite `tailwind.config.ts`/`globals.css` if run as-is. Action required before any `add`: invoke via the pinned `npx shadcn@2.3.0`, never the installed `4.10.0`, and confirm the generated files do not introduce raw hex/px (which would fail `verify_hardcoded_hex`). Also: React 19 peer-dependency prompts during `init` are expected; resolve them rather than forcing `--legacy-peer-deps` blindly.

### 2.2 Radix Primitives
- **What it is:** unstyled, accessible interaction primitives (dialog, popover, tabs, tooltip, accordion, select, etc.).
- **Lesson we take:** hard interaction accessibility (focus management, keyboard, ARIA) without a visual style, ideal for dense disclosure-heavy pages.
- **DECISION: ADOPT (already partially in use).** Continue using Radix, preferably through shadcn wrappers to avoid duplicating abstraction layers. Add only the primitives a locked section actually needs.
- **Install (only what's missing):** `npm install @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-select`.
- **Integration risk: LOW, with a note.** The repo already ships `@radix-ui/react-accordion`, `-separator`, `-slot`, `-tabs`, `-tooltip` (all `^1.x`, React-19-compatible). Dialog/popover/select are NOT yet installed but are assumed by the research's shadcn add-list, so they arrive either directly or via shadcn. Keep all Radix packages on aligned `1.x` majors to avoid mixed-version context bugs. No raw-hex risk (Radix ships no color).

### 2.3 Base UI
- **What it is:** newer unstyled-accessible primitive set from people behind Radix/Floating UI/MUI; v1.0 late 2025.
- **Lesson we take:** a credible future primitive layer, philosophically identical to Radix.
- **DECISION: SKIP for this reformation (revisit at Tailwind 4).**
- **Rationale:** the research's own tradeoff says Radix/shadcn now, Base UI later; switching primitives while also fixing the visual ideology adds system risk for no current benefit.

### 2.4 React Aria Components
- **What it is:** Adobe's style-free, best-in-class accessible interaction library (Apache-2.0).
- **Lesson we take:** the gold standard for complex interactions (comboboxes, advanced tables, date controls, keyboard-heavy flows).
- **DECISION: SKIP now; keep as a named fallback for premium-tier tools.**
- **Rationale:** a different component philosophy from Radix/shadcn; none of the five locked page types currently needs a control beyond Radix's sweet spot. Adopting it now means maintaining two interaction philosophies.

### 2.5 Ark UI
- **What it is:** multi-framework accessible primitives, strongest inside a Panda CSS / Chakra ecosystem.
- **DECISION: SKIP.**
- **Rationale:** overlaps Radix and pulls toward a second styling philosophy; we are committed to Tailwind 3 + tokens. No reason to run two primitive layers.

### 2.6 Tailwind UI Catalyst
- **What it is:** paid Tailwind Plus React component kit, app/SaaS-flavored.
- **DECISION: SKIP (REFERENCE-ONLY at most).**
- **Rationale:** paid, and its default register is premium SaaS, the exact look the reformation is moving AWAY from (the two-language split is the headline failure being closed). Use only as a private reference for form/table density, never as a visual base.

**Category 2 verdict:** ADOPT shadcn (pinned `2.3.0`) + Radix (extend the existing install). Everything else SKIP. The single biggest risk in this category is the installed `shadcn@4.10.0` devDependency silently being used instead of the pinned `2.3.0`.

---

## Category 3 — Chart and data-visualization libraries

### 3.1 visx
- **What it is:** Airbnb's low-level React + SVG visualization primitives. v4 (`@visx/visx`) supports React 18/19.
- **Lesson we take:** build a coherent bespoke editorial chart language from primitives rather than inheriting a dashboard look. This is the right foundation for the locked primitives (RangeStrip, MoneyGoesBreakdown, ThresholdGauge, LikeForLikeBars, TimelineRibbon, SeverityGlyph, TierBar, the opportunity scatter, the nine-lens radar).
- **DECISION: ADOPT as the primary product chart renderer (already in use).**
- **Install:** the repo already uses scoped sub-packages, which is the correct, leaner pattern. Add only missing scopes as charts need them, e.g. `npm install @visx/curve @visx/grid` if a primitive requires them. Do NOT install the `@visx/visx` metapackage.
- **Integration risk: LOW, but the install command in the source is wrong for us.** `package.json` already carries `@visx/axis|gradient|group|scale|shape|text` at `^3.12.0`. The research recommends `npm install @visx/visx` (the v4 umbrella). Adopting the umbrella would (a) duplicate already-installed scopes, (b) jump a major (3.x to 4.x) with possible API drift, and (c) bloat the bundle by pulling every scope. RECOMMENDATION: stay on the scoped `^3.12.0` packages, add scopes individually, and keep all `@visx/*` on one aligned minor. visx is RSC-friendly as long as we keep client-only helpers (e.g. `useParentSize`/`ParentSize`, tooltip portals) inside client boundaries and render the static SVG on the server.

### 3.2 Observable Plot + JSDOM
- **What it is:** a high-level grammar-of-graphics library (ISC) plus JSDOM for headless SVG generation in Node.
- **Lesson we take:** the fastest way to prove a chart form is correct and to generate static editorial/methodology SVGs server-side.
- **DECISION: ADOPT as the secondary, build-time/static renderer (not yet installed).**
- **Install:** `npm install @observablehq/plot jsdom` and `npm install -D @types/jsdom`.
- **Integration risk: MEDIUM, scoped to tooling.** Not installed today. Keep Plot OUT of the public interactive component path; use it only in scripts (prototyping, static methodology graphics, server-generated fallback SVGs) so it never enters the page bundle. JSDOM in a Node script is safe; JSDOM must never be imported into an RSC/edge path. Verify the generated SVG passes `verify_hardcoded_hex` (Plot emits literal colors by default, so all generated SVG must be post-processed to tokens or generated with token values injected).

### 3.3 D3 modules
- **What it is:** the canonical data/geometry toolkit (ISC). Used here as math, not as a DOM layer.
- **Lesson we take:** treat D3 as the scale/format/array/shape layer inside visx charts; never let it mutate the DOM.
- **DECISION: ADOPT as the geometry/format layer (partially present, see risk).**
- **Install:** `npm install d3 d3-array d3-scale d3-format d3-shape` (or just the scoped modules actually used) and `npm install -D @types/d3`.
- **Integration risk: LOW.** `d3` is NOT a top-level dependency today, though `@visx/scale` and `@visx/shape` already wrap `d3-scale`/`d3-shape` transitively. To avoid pulling the full `d3` umbrella for a few helpers, prefer scoped installs (`d3-array`, `d3-format`) over the monolith. RSC-safe (pure functions). Keeping D3 as pure math is what keeps charts token-themeable and server-renderable.

### 3.4 Recharts
- **What it is:** a popular conventional React chart library (MIT). Lines/bars out of the box; default look drifts toward dashboard.
- **DECISION: SKIP for public pages; allow only for internal/admin tooling.**
- **Rationale:** the brief explicitly rejects a dashboard feel, and Recharts gives far less control over the editorial chart grammar than visx, which we already run. React 19 support is "generally supported but an active concern," another reason not to put it on public pages.

### 3.5 Unovis
- **What it is:** F5's multi-framework chart library (Apache-2.0) with CSS-variable theming.
- **DECISION: SKIP (revisit only for a future premium interactive dashboard).**
- **Rationale:** less bespoke than visx; public-page SSR fit is unproven per the source. No current locked section needs it.

### 3.6 nivo
- **What it is:** polished React/D3 chart components (MIT) with known Next App Router / RSC friction.
- **DECISION: SKIP.**
- **Rationale:** many nivo charts require client boundaries, which conflicts with the static-first requirement, and it pushes toward a component-gallery look. Direct conflict with our SSR-first chart architecture.

### 3.7 Tremor
- **What it is:** Tailwind + React dashboard component kit (Apache-2.0).
- **DECISION: SKIP (do not adopt; reference-only for card/density patterns).**
- **Rationale:** the source itself flags maintenance risk on React-19/Tailwind-current stacks, and it is a dashboard kit, the look we are explicitly leaving. Highest maintenance-risk item in the catalogue; adopting it would be a regression.

**Category 3 verdict:** ADOPT visx (keep scoped `^3.12.0`, NOT `@visx/visx` v4), Observable Plot + JSDOM (build-time only), D3 (scoped helpers). SKIP Recharts, Unovis, nivo, Tremor. The install commands in the source over-install for us (umbrella visx, full d3); prefer scoped packages.

---

## Category 4 — Typography

### 4.1 Newsreader + Inter
- **What it is:** an OFL serif designed for content-rich screen reading (Newsreader) paired with an OFL UI sans with tabular numerals (Inter).
- **Lesson we take:** warm editorial authority from the serif, dense UI clarity and tabular numbers from the sans; the discipline is to keep the serif to masthead/section/verdict and never let it run the whole interface.
- **DECISION: ADOPT / KEEP (this is already the bound pairing), with the face-not-final caveat.**
- **Install:** no change required if staying on the current `var(--font-sans)` / `var(--font-display)` slots. If we move to package-pinned self-hosting: `npm install @fontsource-variable/newsreader @fontsource-variable/inter`.
- **Integration risk: LOW, with one open brand decision.** Ground truth flags Newsreader as the INTERIM display face (FACE NOT FINAL; the cohesion plan names Fraunces as the candidate). So: keep Inter as the body/numeral law (settled), but treat the display slot as provisional. Whatever face wins binds to the `--font-display` slot; no component hardcodes a font name (a hard constraint). Self-hosting via Fontsource is the safer production path than `next/font/google` (the dev-memory notes a `next/font` dev-worker crash, so throwaway font tests should use a plain Google Fonts link, not `next/font`).

### 4.2 Source Serif 4 + Source Sans 3
- **What it is:** Adobe's OFL serif/sans superfamily; a more neutral, institutional register.
- **DECISION: SKIP (named fallback only).**
- **Rationale:** the brand has chosen warmth over neutrality; this is only relevant if the brand pivots institutional, which is not this reformation. Keep documented as the fallback if Newsreader/Fraunces both read too literary.

### 4.3 IBM Plex family
- **What it is:** IBM's OFL Sans/Serif/Mono/Condensed superfamily.
- **DECISION: SKIP as the primary; CONSIDER Plex Mono narrowly.**
- **Rationale:** Plex is less warm than the chosen direction, so it is wrong as the main pairing. The one genuinely useful slice is a mono for source IDs / methodology metadata / compact table numerals, but introducing a third typeface needs founder sign-off and risks typographic incoherence. Defer; do not adopt in this reformation.

### 4.4 Fontsource
- **What it is:** npm-packaged, version-pinned self-hosted font delivery (preserves upstream OFL).
- **Lesson we take:** explicit, versionable font assets instead of remote Google-hosted delivery; removes surprise from remote font changes and the `next/font` dev crash.
- **DECISION: ADOPT as the delivery mechanism (when the display face is finalized).**
- **Install:** `npm install @fontsource-variable/inter` now is safe (Inter is settled); add the display-face package once the Newsreader-vs-Fraunces decision lands.
- **Integration risk: LOW.** Self-hosting through Fontsource is production-friendly on Vercel and avoids the `next/font/google` dev-worker crash noted in dev memory. Wire it to the existing `--font-sans` / `--font-display` CSS variables so no component changes; the swap is purely at the font-face declaration layer.

**Category 4 verdict:** KEEP Inter as settled body/numeral law; treat the display face as provisional (Newsreader interim, Fraunces candidate, decided by the founder, bound to the slot). ADOPT Fontsource as the delivery path. SKIP Source and Plex as primaries; hold Plex Mono and Source as documented fallbacks only.

---

## Category 5 — Color and design tokens

### 5.1 Style Dictionary
- **What it is:** a token build system (Apache-2.0): define tokens once, export to CSS variables, Tailwind, TypeScript, etc.
- **Lesson we take:** one source of truth that enforces "no raw hex in components" and stays durable as page types multiply.
- **DECISION: ADOPT cautiously, as a build-time generator over the EXISTING token file.**
- **Install:** `npm install -D style-dictionary`.
- **Integration risk: MEDIUM, mostly migration cost.** `src/lib/design-tokens.ts` is already the value authority and `tailwind.config.ts` already imports from it; the layering rule (`verify_layering`) treats tokens as the base layer. Style Dictionary must SLOT UNDER the existing system (generate `design-tokens.ts` / a `tokens.css` from an OKLCH source), not replace the hand-authored file wholesale, or it will churn every ramp and break `verify_hardcoded_hex` / `verify_typography_consistency` if outputs drift from the locked hex values. Recommendation: introduce it as a generator that REPRODUCES the current palette first (a no-op diff), then use it to extend, so the locked hex values in ground truth stay byte-stable until deliberately changed.

### 5.2 Radix Colors
- **What it is:** accessible 12-step color scales (MIT) with built-in interaction states.
- **Lesson we take:** a calibration reference for tonal steps, hover/focus/neutral surfaces.
- **DECISION: REFERENCE-ONLY (do not adopt wholesale).**
- **Rationale:** the palette is bespoke (terracotta/cream/moss/amber/ink/cocoa/clay), and the token file already defines full ramps and semantic aliases. Importing Radix Colors wholesale would fight the brand. The research's own note says use it as a scaffold for step structure, not as the palette. Install only if we want it as a build-time calibration input; even then it is a dev reference, not a component dependency.

### 5.3 Culori
- **What it is:** a Node color library (MIT) with OKLCH support, interpolation, and color-difference math.
- **Lesson we take:** build perceptually even OKLCH ramps and audit contrast programmatically instead of hand-picking hex.
- **DECISION: ADOPT as a build-time/audit utility (not a runtime dependency).**
- **Install:** `npm install culori`.
- **Integration risk: LOW.** Pure Node, used in token scripts only; never imported into a component (so no layering or bundle concern). Pairs with Style Dictionary: Culori generates/audits OKLCH ramps, Style Dictionary emits the platform tokens. Use it specifically to verify the existing amber/moss/clay scales meet WCAG AA before any palette change ships.

### 5.4 Adobe Leonardo
- **What it is:** an accessible-contrast palette generator (Apache-2.0) for UI and data-viz color.
- **DECISION: REFERENCE-ONLY (design-token development tool, not a dependency).**
- **Rationale:** useful to prove the warm palette can hit contrast without going muddy (especially amber caution and moss positive), but Culori covers our programmatic need in-repo. Use Leonardo's web tool during token design; do not add it to the runtime.

### 5.5 Datawrapper "Colors in Data Vis Style Guides" (article)
- **What it is:** a 2025 practical guide to turning brand colors into chart colors without wrecking legibility.
- **Lesson we take:** document palette USE (primary/neutral/positive/caution/comparison/disabled), accessibility, and worked examples, not just swatches.
- **DECISION: REFERENCE-ONLY (must-have reference).** It is the template for the Margin Atlas "chart color constitution," which we already have in skeletal form (design-system.md §3.2/§10 fixed color jobs).
- **Rationale:** a reading, not a tool; it sharpens the existing fixed-color-jobs doc.

### 5.6 USWDS Color System
- **What it is:** the US government design system's contrast-grade color tokens (mostly public-domain).
- **DECISION: REFERENCE-ONLY (mental model).**
- **Rationale:** visually wrong for Margin Atlas, but its contrast-grade discipline (think in foreground/background pairings, not taste) is a useful frame while building OKLCH tokens. No adoption.

**Category 5 verdict:** ADOPT Style Dictionary (as a no-op-first generator under the existing token file) and Culori (build-time audit). REFERENCE-ONLY for Radix Colors, Leonardo, the Datawrapper color article, and USWDS. The cardinal risk: any token generator must reproduce the locked hex values first and only then extend, or it breaks the hardcoded-hex and typography gates.

---

## Category 6 — Layout, grid, density, and hierarchy

All six are books or articles; none install. Each contributes a QA lens.

### 6.1 Tufte, The Visual Display of Quantitative Information
- **Lesson we take:** give every mark a job; reduce chart junk; prefer direct labels and small multiples. Not minimalism for its own sake.
- **DECISION: REFERENCE-ONLY (must-have).** Becomes the chart-QA checklist: remove decorative marks, direct-label over legend, small multiples for peer/country comparison.
- **Rationale:** directly supports the "engraved texture lives only in the frame, never behind a number" rule and the under-5%-surface accent budget.

### 6.2 Bertin, Semiology of Graphics
- **Lesson we take:** encode with position, size, value, texture, color, orientation, shape, in that priority. Do not overload color.
- **DECISION: REFERENCE-ONLY (must-have).** Foundation for the chart-token encoding hierarchy: position first, length second, color only to clarify role/status.
- **Rationale:** it is the theoretical justification for the single-accent token law and for using ink tints/position before adding hues.

### 6.3 FT Visual Vocabulary (as a book/decision tool)
- **Lesson we take:** a shared selection vocabulary that stops templates becoming a random mix of bars/cards/prose.
- **DECISION: REFERENCE-ONLY (must-have).** Convert into the Margin Atlas chart decision tree (range, ranking, correlation, part-to-whole, change, distribution, flow).
- **Rationale:** same artifact as 1.1, here in its decision-tool role; it is the backbone of the chart-language plan file.

### 6.4 Datawrapper 40 Chart Types Guide
- **Lesson we take:** a pragmatic, production-framed complement to the FT vocabulary; explains choices in shipping terms.
- **DECISION: REFERENCE-ONLY (strong).** Use during template reviews to prevent pie/donut misuse and over-complicated comparisons.
- **Rationale:** a checklist for editors/engineers, not a dependency.

### 6.5 NN/g, Visual Hierarchy and Scanning
- **Lesson we take:** translate editorial taste into testable hierarchy: what does the eye see first, second, third. Dense pages need visible prioritization, not equal-weight sections.
- **DECISION: REFERENCE-ONLY (must-have).** QA every one of the six bands against the first/second/third-glance question.
- **Rationale:** operationalizes "one idea per band" and "title first, number second, reason third, caveat fourth."

### 6.6 NN/g, Whitespace and Grids
- **Lesson we take:** organize density with rhythm and grouping, not by shrinking everything; the grid guides reading and comparison and survives 375px.
- **DECISION: REFERENCE-ONLY (strong).** Underwrites the 12/6/4-column grid and the three reading lanes (quiet left rail / editorial center / right rail), collapsing to one column at 375px while preserving section order.
- **Rationale:** supports the locked 375px constraint (designed layout, no horizontal scroll) and the warm-gutter behavior (gutters collapse below 1100px, never behind data).

**Category 6 verdict:** zero installs; six QA lenses. Tufte + Bertin + FT Vocabulary + NN/g Hierarchy are the must-have lenses that govern chart QA and band hierarchy; the Datawrapper guide and NN/g Whitespace are strong supports for template review and the grid.

---

## Category 7 — Motion, icons, and inspiration galleries

### 7.1 Motion (formerly Framer Motion)
- **What it is:** the React/JS animation library (MIT) under its new branding.
- **Lesson we take:** guide dense pages with gentle disclosure, section transitions, and calculator state changes; never animate charts for spectacle.
- **DECISION: ADOPT, tightly scoped and reduced-motion-safe (not yet installed).**
- **Install:** `npm install motion`.
- **Integration risk: MEDIUM.** Client-only (each animated component needs a client boundary, which fights the static-first/RSC default), and the existing system already centralizes motion in `motion.ts` with a hard duration ceiling (never >500ms; deliberate 400). So: Motion is allowed ONLY for accordion reveal, calculator transitions, sticky-index affordances, and orientation micro-interactions; it must read durations/easings from `motion.ts` tokens (no hardcoded ms, a hard constraint), and every use must honor `prefers-reduced-motion`. Never make motion necessary to read a number. Confirm it does not introduce raw-ms values that fail the token gates.

### 7.2 Lucide (lucide-react)
- **What it is:** a clean, restrained, tree-shakable SVG icon set (ISC).
- **Lesson we take:** quiet, consistent icons that do not overpower typography or charts; right register for an editorial data product.
- **DECISION: ADOPT as the single icon system (already installed) — but resolve a version and a duplication issue.**
- **Install:** already present. Action is to verify/align the version, not to add.
- **Integration risk: MEDIUM, two concrete problems.** (1) `package.json` pins `lucide-react` at `^1.16.0`, an unusually low major; current lucide-react is a much higher major. This is likely a mis-pin or a fork; before standardizing on Lucide, confirm the installed package is the real, current `lucide-react` and bump if it is stale, since icon-name coverage and React-19 support differ across majors. (2) `@phosphor-icons/react` (^2.1.10) is ALSO installed, so the repo currently ships two icon systems, which the research explicitly warns against. Decision: standardize on Lucide and plan to retire Phosphor (or formally scope Phosphor to a single justified use), rather than letting both coexist.

### 7.3 Phosphor Icons
- **What it is:** a warmer, more illustrative icon family (MIT), broader/more expressive than Lucide.
- **DECISION: SKIP / RETIRE.**
- **Rationale:** it is already installed and is the cause of the two-icon-system inconsistency. The research warns against mixing it with Lucide. Standardize on Lucide; remove or tightly justify Phosphor in a cleanup pass (out of scope for the chart/token work, flag for a follow-up).

### 7.4 Iconoir
- **What it is:** a broad, slightly more editorial outline icon set (MIT).
- **DECISION: SKIP.**
- **Rationale:** a Lucide alternative, not a complement; adopting it would repeat the two-system problem we are trying to close. Note as a possible swap-in only if Lucide is ever judged too generic.

### 7.5 Data Viz Project (gallery)
- **What it is:** a broad visualization taxonomy beyond dashboard defaults.
- **DECISION: REFERENCE-ONLY (strong).** Use during exploration for uncommon forms (ranges, deviations, uncertainty, sequence) when a card or bar is not the right metaphor.
- **Rationale:** inspiration, not production patterns.

### 7.6 Observable Plot Gallery + D3 Gallery
- **What it is:** worked-example galleries that connect visual ideas to real implementation.
- **DECISION: REFERENCE-ONLY (strong), implementation reference.** Use for small multiples, dot plots, distributions, annotated time series, then restyle through tokens.
- **Rationale:** pairs with the Plot/D3 ADOPT decisions in Category 3; the galleries are how we prototype, the kit is where the pattern lands.

### 7.7 Information is Beautiful Awards
- **What it is:** an editorial data-viz awards gallery.
- **DECISION: REFERENCE-ONLY (optional).** Bookmark for quarterly design reviews and concept exploration.
- **Rationale:** much award work is too bespoke for a repeatable product system; inspiration only.

**Category 7 verdict:** ADOPT Motion (scoped, token-bound, reduced-motion-safe) and Lucide (already installed; fix the version and retire Phosphor). SKIP Iconoir. Galleries and IIB Awards are inspiration references. The actionable risk here is the lucide-react `^1.16.0` pin and the coexisting Phosphor install.

---

## Verification of currency / compat — flags to re-check before any install

These are the divergences and frictions to resolve before the install plan in Part C is executed. Each is grounded in `package.json` (read 2026-06-16) or the research answer's own caveats.

1. **shadcn CLI version mismatch (HIGH).** `package.json` devDependency `shadcn@^4.10.0` vs the required `shadcn@2.3.0` for Tailwind 3. The v4 CLI assumes Tailwind 4 and will mis-scaffold `tailwind.config.ts` / `globals.css`. Always invoke `npx shadcn@2.3.0`, and audit every generated file for raw hex/px before commit (gates `verify_hardcoded_hex`, `verify_typography_consistency`).

2. **Tailwind 3 vs Tailwind 4 (HIGH, strategic).** Stay on Tailwind 3.4 for this reformation per Part D. Every tool that has a "4-first" default (shadcn, some chart/theming docs) must be used in its 3-compatible path. Do not let any install pull a Tailwind-4 assumption into `globals.css` or PostCSS config.

3. **tailwind-merge major mismatch (MEDIUM).** `package.json` has `tailwind-merge@^3.6.0`; the research's combined block pins `tailwind-merge@2.6.0`. v3 changed its internal config shape around Tailwind 4. Re-check that the installed v3 still resolves our Tailwind-3 class conflicts correctly when shadcn components (which call `twMerge`) land; if it misbehaves, pin to `2.6.0` as the source advises.

4. **visx v3-scoped vs v4-umbrella (MEDIUM).** Repo runs scoped `@visx/*@^3.12.0`; the source says `npm install @visx/visx` (v4 umbrella). Do NOT adopt the umbrella: it duplicates installed scopes, jumps a major, and bloats the bundle. Keep scoped `3.x`, add scopes individually, hold one aligned minor.

5. **lucide-react version (MEDIUM).** Pinned at `^1.16.0`, far below current lucide-react majors. Confirm this is the genuine current package (not stale/forked) before standardizing; bump if stale (icon coverage and React-19 support vary by major).

6. **Two icon systems coexist (MEDIUM).** Both `lucide-react` and `@phosphor-icons/react@^2.1.10` are installed. The research warns against mixing. Standardize on Lucide; retire or tightly scope Phosphor in a cleanup pass.

7. **React 19 type packages lag (MEDIUM).** `react`/`react-dom` are `^19.2.6` but `@types/react`/`@types/react-dom` are `^18`. shadcn/Radix/visx are React-19-capable, but the React-18 types can surface false `tsc` errors (the gate is `npx tsc --noEmit` clean). Bump the React types to 19 before scaffolding new typed components, or expect spurious type friction.

8. **Recharts / nivo / Tremor React-19 + RSC friction (confirms SKIP).** The source flags Recharts React-19 support as "an active concern," nivo as requiring client boundaries under the App Router, and Tremor as a maintenance risk on current stacks. All three are SKIP; this note records WHY so the decision is not revisited casually. visx + Plot + D3 avoid all three frictions.

9. **Observable Plot + JSDOM emit literal colors (MEDIUM, tooling).** Plot defaults to hardcoded colors; any generated SVG must be token-injected or post-processed before it can live in the repo without failing `verify_hardcoded_hex`. Keep Plot/JSDOM strictly in build scripts, never in an RSC/edge path.

10. **Style Dictionary must be a no-op-first generator (MEDIUM).** `src/lib/design-tokens.ts` is the live value authority with locked hex values; `tailwind.config.ts` imports it and `verify_layering` treats it as the base. A token generator must first REPRODUCE the current palette byte-for-byte, then extend, or it churns ramps and breaks the hex/typography gates.

11. **Motion is client-only and must read motion tokens (MEDIUM).** Adding Motion means client boundaries (vs static-first default) and a risk of hardcoded ms/easing that fail the token gates. Bind every animation to `motion.ts` durations/easings, respect `prefers-reduced-motion`, never exceed the 450/500ms ceiling, never make motion load-bearing for a number.

12. **next/font dev crash (LOW, known).** Dev memory records a `next/font` dev-worker crash; prefer Fontsource self-hosting for production font delivery, and a plain Google Fonts link for throwaway font experiments. Inter is settled; the display face (Newsreader interim vs Fraunces candidate) is a founder decision still open and must bind to the `--font-display` slot, not a hardcoded name.

13. **Display face not final (LOW, brand).** Newsreader is the interim display face; Fraunces is the named candidate. Do not hardcode either; finalize via the founder, then deliver through the Fontsource slot. Inter as body/numeral law is settled.

---

## 120-word summary

This study reads all 41 Part-A resources against the live stack. Net adopt-list: shadcn (pinned 2.3.0, not the installed 4.10.0), Radix (extend), visx (keep scoped 3.x, NOT the v4 umbrella), Observable Plot + JSDOM (build-time only), scoped D3, Style Dictionary (no-op-first), Culori, Fontsource, Lucide (fix the 1.16.0 pin, retire Phosphor), and Motion (token-bound, reduced-motion-safe). Everything else is reference-only or skip. The north-stars (FT Visual Vocabulary, OWID, Datawrapper) and the Tufte/Bertin/NN/g lenses govern chart choice and band hierarchy without installs. The highest-value findings are version divergences: shadcn 4.10 vs 2.3, visx v4 umbrella, tailwind-merge 3 vs 2.6, lucide 1.16, React-18 types on React 19, and two coexisting icon systems.
