# 10 , Master implementation plan (Phase B, the full build)

> The world-class implementation of the whole architecture on shadcnblocks + the kept visx chart kit + the one token bridge, built to ship with zero errors of any kind. Read 00-ideology-and-design-law.md and 01-component-and-chart-system.md first; this file is the execution brain. The cleanup audit is 11-CLEANUP-AUDIT.md.

## Executive summary

- WHAT: turn the six approved static mockups into the real app, across all 11 page types, to a world-class commercial-SaaS grade, shipping with zero errors of any kind.
- THE KEY FACT: this is a re-skin + vocabulary expansion, NOT a rebuild. Every shadcnblocks block reads the shadcn CSS variables, and those are already mapped to the Atlas palette once in `globals.css`. Install a prop-driven block, never touch its color, feed it view-model props, slot it between the kept visx charts.
- ARCHITECTURE: eight layers, dependency arrow downward only (tokens to token-bridge to shadcn primitives + shadcnblocks to visx chart kit to page kit to view-model composers to data builders to pages). Blocks become owned source in `src/components/blocks/`, scrubbed on intake (de-mock, de-image, de-violate). The honesty boundary stays at the view-model layer; blocks and charts are dumb renderers.
- EXECUTION: W0 foundation (install the base + dep set, confirm the token bridge, do the Tailwind v4 move, build the new wages-range + seasonality-area chart primitives), then one page-type per wave in priority order (cell flagship, then home, country, city, industry, neighbourhood, then the reuse types). Each wave installs named blocks per section, wires the view model, preserves the locked sections, and ends in a Vercel preview link you open plus a review point.
- QA (ships error-free): every wave must pass the automated gates (tsc, prebuild 31/31, verify_page_sections, verify_section_order, no-em-dash, no-source-agency, layering) PLUS graphical QA at 1280 and 375 (via a preview link, no local browser), content + honesty QA, accessibility, performance, link integrity, and a final adversarial review pass. A wave is not done until all pass; nothing promotes to production without your nod.
- KEY DECISIONS (detailed below): Tailwind v3 to v4 as the W0 foundation move; Supastarter cherry-picked later (build owned blocks now, they carry over with low rework); install blocks per-page; preview per wave; the data-honesty gates preserved through the swap.
- CLEANUP: the read-only audit is in 11-CLEANUP-AUDIT.md (SAFE-DELETE vs PROPOSE vs KEEP). The sandbox blocks me from auto-deleting in this folder, so cleanup runs on your explicit go.

## Architecture

The visual upgrade is, structurally, a re-skin and a vocabulary expansion of an architecture that already exists and already passes 31 gates. It is NOT a rebuild. The whole plan rests on one mechanical fact: every shadcnblocks block and every shadcn primitive reads its color, radius, and font from a fixed set of CSS variables, and those variables are already mapped to the Atlas palette once, in `src/app/globals.css`. So "make every page world-class" reduces to "install prop-driven blocks, point them at the existing token bridge, feed them view-model props, and slot them between the kept visx charts." This section fixes the layers, the ownership rules, the chart boundary, the SSR/client boundary, the Tailwind/Supastarter decisions, and the shared chrome.

### A.1 The layered model and the one dependency direction

Eight layers. The dependency arrow points downward only; nothing ever imports upward. `scripts/verify_layering.ts` already enforces the app-to-data half of this (with 14 grandfathered exceptions that migrate when touched, never grow). The upgrade adds the blocks layer and keeps the arrow intact.

```
L0  TOKENS          src/lib/design-tokens.ts          single source of truth (hex, type, radius, motion, z, elevation)
       │            tailwind.config.ts imports L0      (palette + fonts + shadow + z come from L0, not hand-typed)
       ▼
L1  TOKEN BRIDGE    src/app/globals.css :root          ONE map: Atlas tokens -> shadcn CSS variables + --chart-1..5
       │            (--background, --card, --primary, --ring, --radius, --chart-*, --font-display/-sans)
       ▼
L2a SHADCN PRIMS    src/components/ui/*                 button, card, badge, tabs, table, accordion, navigation-menu, sheet, chart...
L2b SHADCNBLOCKS    src/components/blocks/*  (NEW)      hero, feature, pricing, cta, navbar, footer, stats-card, chart-card, data-table
       │            both read ONLY L1 variables; zero per-component color
       ▼
L3  VISX CHART KIT  src/components/kit/charts/*         RangeStrip, Waterfall, ThresholdGauge, ScoreBand, TimelineRibbon,
       │            + the NEW wages range primitive    ComparisonBars, HeatStrip, FootfallGrid, SeverityGlyph, TierBar (re-skinned)
       │            + the PORTED seasonality area       reads L0 chart roles + L1 --chart-*; visx + hand-SVG, no Recharts in the kit
       ▼
L4  PAGE KIT        src/components/kit/*                AnswerFirstMasthead, MoneyGoesBreakdown, Band/Lanes, StickySectionNav,
       │            + kit/blocks, kit/tables,           editorial beats, engraved family, the six-band shell. Composes L2 + L3.
       │            kit/engraved, kit/frame, kit/layout
       ▼
L5  COMPOSERS       src/lib/**/*_view.ts               cell_view.ts (+ country/city/industry siblings): pure data -> section props
       │            src/lib/page-sections.ts,           the locked section order + tone map; gates verify_page_sections / _section_order
       │            src/lib/page-layout/section-order.ts
       ▼
L6  DATA BUILDERS   src/lib/cells.ts, countries.ts,     Supabase via withBudget(); fail-soft; nullable out
       │            cities.ts, scores/, economics/...
       ▼
L7  PAGES           src/app/**/page.tsx                 RSC: server-fetch (getCellBySlug etc.) -> build view model -> render kit sections
```

The load-bearing rule: **a page never imports a block or a chart directly.** A page imports a view model (L5) and the Page Kit section components (L4); the Page Kit is the only layer that knows whether a section is a shadcnblock, a visx chart, or a kit table. This is what keeps "swap the masthead block" or "re-skin a chart" a one-file change that 11 page types inherit for free. The honesty boundary lives at L5/L6 (nullable-in, silence-out, `moneyShown`, never rank across business x geography); blocks and charts at L2/L3 are dumb renderers that draw exactly what they are handed and `return null` on null. No honesty logic ever leaks down into a block.

### A.2 Block ownership, placement, and theming

**Blocks are owned source, not a dependency.** `npx shadcn add @shadcnblocks/{slug}` writes plain typed `.tsx` into the repo; from that moment we own it like any other file. There is no runtime coupling to shadcnblocks, no version pin to track, no license-server call at build. The registry (`components.json` -> `@shadcnblocks` on the `www` host with the bearer key) is an install-time convenience only.

**Placement, by kind:**
- `src/components/ui/*` (L2a) - the shadcn *primitives* a block lists in `registryDependencies` (button, card, badge, separator, tabs, table, avatar, accordion, navigation-menu, sheet, chart). These already exist; pre-installing the base set once resolves every block's deps. shadcn's installer drops new primitives here per `components.json` aliases.
- `src/components/blocks/*` (L2b, **new directory**) - the marketing/app *blocks* (hero, feature, pricing, cta, stats-card, chart-card, data-table, navbar, footer). One file per block, named for its role not its slug (`HomeHero.tsx`, not `hero2.tsx`), so a future "swap hero2 for hero7" is invisible to callers. Each keeps its exported `Props` interface + `defaultProps` spread + `className` passthrough exactly as shipped.
- The Page Kit (L4) is the only consumer of `src/components/blocks/*`. A page never reaches into it.

**Theming with zero per-block recolor.** This is the leverage point and it is already wired. `globals.css :root` maps `--background -> cream-75`, `--card -> cream-50`, `--primary -> atlas-700`, `--ring`, `--border`, `--muted`, `--accent`, `--destructive`, `--radius -> 1rem`, and `--chart-1..5` onto the warm chart roles, all as space-separated RGB triplets so Tailwind's `rgb(var(--token) / <alpha>)` opacity utilities work. shadcnblocks blocks are authored against exactly these variable names. Therefore: **install a block, do not touch its colors.** The single forbidden act in this whole plan is hand-editing a hex into an installed block; `verify_hardcoded_hex` already scans `.tsx` and will fail the build. The map exists once (L1); the entire library inherits the warm look. Atlas is light-only, so there is no `.dark` block override to maintain.

**Three scrub passes on intake**, applied to each block before it is committed to `src/components/blocks/`:
1. **De-mock**: any hardcoded `features[]`, `plans[]`, `quotes[]`, `chartData` shipped in the block is lifted to a prop on the Props interface (some blocks, e.g. `stats5`/`compare1`/`testimonial14`, hardcode content and must be lifted). `defaultProps` keeps a benign placeholder for Storybook only.
2. **De-image**: every CloudFront/Unsplash placeholder is removed and the slot either filled by a real chart/number/screen passed as a prop, or the slot deleted.
3. **De-violate**: strip em-dashes, source-agency names; route any color/spacing/radius/motion literal to a token; confirm 375px no-scroll and AA. The block is now constraint-clean owned source.

**Prop-driven from the view models.** A block is fed only by L5 view-model output. `cell_view.ts` already emits exactly the shapes blocks want: `masthead.stats[]` -> a stats-card row; `moneyGoes[]` -> a chart-card/Waterfall series; `wages[]` -> a data-table or the new range primitive; `nearby[]` -> a compare grid. Where a block's prop shape and the view-model shape differ, the **Page Kit section adapts** (a thin mapper in L4), never the block and never the page. So the data contract stays: builder (L6) -> view (L5) -> kit section (L4) -> block (L2). Add a country/city/industry view model as a sibling of `cell_view.ts` emitting the same section-prop vocabulary, and the blocks light up on every page type with no new block work.

### A.3 The chart layer: keep visx, re-skin, two borrowed shapes, one new primitive

The visx kit (`src/components/kit/charts/*` plus `RangeStrip.tsx` at the kit root) is **kept and re-skinned, never replaced.** It encodes brand law that generic Recharts cannot: one accent, no pie, the cross-currency caveat, direct labels (no legend), tabular numerals, filled + empty states, 375px legibility, and server-renderable SVG. Swapping it for stock charts would silently break the honesty rails (it would crown a cross-currency leader, draw a pie, lose the empty state). The premium upgrade is cosmetic and additive:

- **Re-skin in place** (no API change, every call site intact): tighter type scale, more generous spacing, the shadcn `Card` shell around each chart, gradient fills borrowed from shadcn's area recipe, the shared motion timing. Each primitive keeps reading the L0 chart roles (`colors.chart.primary/kept/cost/baseline/grid/...`) and the L1 `--chart-*` variables, so the re-skin is a styling diff, not a logic diff. The kept per-stat grammar (the "standing renderer" table in plan 01 §5) is unchanged: RangeStrip for spread, Waterfall for the per-$100 split, ThresholdGauge for break-even, ComparisonBars/LikeForLikeBars for peers, TimelineRibbon for first-year, HeatStrip/FootfallGrid/SeverityGlyph for footfall/risk.
- **One new primitive - the wages range row.** Neither shadcn nor the kit has a floating range/dumbbell row. Build it as a `RangeStrip` *sibling* in `kit/charts` (shares the log-axis helpers, the lone-accent median, the empty-state contract), fed by `cell_view.wages[]` (`{role, low?, median?, high?}`). It is the canonical renderer for "pay by role" site-wide.
- **One ported shape - seasonality area.** Port the *shape* of shadcn's `chart-area-gradient` (single atlas series, gradient def, tickless axis), not a drop-in chart, fed by `seasonality.monthly[]`. This is the one place a Recharts dependency is justified.
- **One site-wide vs-world grammar - `ScoreBand` with a global-median peer tick.** Pick this once and reuse it on cell + country + industry so "versus the world" reads identically everywhere. (The engraved country page already has an `eng-vs` static variant; the React `ScoreBand` is the canonical interactive one.) Never a pie, never a cross-geography rank.

**Net new dependency:** `recharts` only (one dep covers the seasonality area and any optional hero radial). It is added once, wrapped `"use client"` at the seasonality/radial component boundary so RSC pages still prerender. The kit stays visx; the two coexist with no overlap of jobs.

### A.4 SSR / client boundary

The site is 615 statically prerendered pages and must stay that way; the LCP and the honesty of the numbers both depend on the page being a server component that fetches, builds the view model, and renders. The rule:

- **Pages (L7), view models (L5), data builders (L6) are server-only.** No `"use client"`, no client data-fetch on a prerendered page (per CLAUDE.md: skeletons live only in client components that fetch via API routes).
- **Blocks and charts default to server components.** A shadcnblocks hero, feature grid, pricing card, footer, stats-card, and every server-renderable visx chart (RangeStrip, Waterfall, ScoreBand, TimelineRibbon - which are pure SVG) render on the server and ship zero JS.
- **`"use client"` is applied only at the leaf that needs interactivity, never at a page or a section wrapper.** The existing 18 client leaves in the kit are the model: the controls (`Slider`, `Segmented`, `ResetAnchor`, `PendingShell`, `OrientationHeader`), `CountUpNumber`, `StickySectionNav`, the switchers (`SubTypeSwitcher`, `VenueSwitcher`, `ZoomControl`), `MakeItYours`, `WatchTray`, `ProfileChip`. New client leaves are limited to: the navbar's mobile `sheet`, a pricing monthly/yearly toggle, any block carousel/tabs, the seasonality area (Recharts is client), and an optional hero radial. Each is an island inside an otherwise-server section.
- **The pattern for a block that ships interactive sub-parts:** keep the block itself a server component and isolate the interactive piece behind its own `"use client"` file, so the block's static markup prerenders and only the toggle hydrates. This preserves the "RSC pages still prerender" guarantee while letting blocks be lively.

### A.5 Tailwind v3 -> v4 and Supastarter integration

**Recommendation: stay on Tailwind v3.4 for the entire visual upgrade. Do NOT migrate to v4 in this plan.**

Rationale. The token bridge is the architecture, and it is implemented as v3-style `:root` RGB triplets consumed via `rgb(var(--token) / <alpha-value>)` in `tailwind.config.ts`. v4 moves config into CSS (`@theme`), changes the color-opacity model, and would force a rewrite of `globals.css` (which now carries the shadcn bridge, the Atlas card system, the warm-frame layer, and the ~800-line engraved almanac token layer) plus a re-audit of all 31 gates (notably `verify_hardcoded_hex`, `verify_typography_consistency`). shadcnblocks blocks install cleanly against the v3 setup we already have. The risk of a v4 migration (subtle color/opacity shifts across 615 pages, gate churn) is pure downside against the goal of "zero errors of any kind." Migrate to v4 as its own isolated track *after* the visual upgrade ships and is signed off, never entangled with it.

This forces a decision on Supastarter, which ships on **Tailwind v4 + better-auth + its own shadcn setup.** Two options:

- *Rebuild-on-it* (port Margin Atlas onto the Supastarter app): rejected. It would force v4 now, replace the auth/data conventions, and risk the 615-page prerender + the honesty rails for boilerplate we mostly do not need on the public pages.
- *Adopt-pieces* (**recommended**): treat Supastarter as a parts bin for the **authenticated product surface only** (account, billing, admin, i18n scaffolding), kept behind the auth boundary and off the critical public-page path. The public 11 page types stay exactly as architected here (v3, the token bridge, the kit, RSC prerender). Adopt Supastarter pieces incrementally, each translated to the v3 token bridge on intake (same scrub passes as a block), and keep better-auth confined to the product surface so it never competes with the public Supabase data layer. This isolates v4/better-auth to a later, bounded track and keeps the visual upgrade single-variable.

Net: **one Tailwind version (v3) for this plan; Supastarter is adopt-pieces, deferred, and walled to the logged-in surface.**

### A.6 Global chrome and how all 11 page types share components

**Chrome from shadcnblocks, owned and themed once.** The top nav (`navbar1`-class, with the mobile `sheet` built in) and the footer (`footer7`-class) install into `src/components/blocks/`, get the three scrub passes, and read the L1 token bridge. They are placed once in `src/app/layout.tsx` (which already mounts the warm-frame gutters + `.atlas-frame-content`), so every route inherits identical chrome. Navbar `menu[]` and footer `sections[]/legal[]` are props fed from a single nav config in `src/lib/`, so the link graph is edited in one place.

**One vocabulary, eleven pages.** The six canonical page types (home, country, city, cell, neighbourhood, industry) and the five that reuse them (region/state, neighbourhood-overview, learn, compare, directory) all compose from the *same* Page Kit (L4) and the *same* locked section spines (`page-sections.ts` + `section-order.ts`). The sharing mechanism is the section-order list per type plus a per-type view model:

- **Section order is data, not layout code.** `PAGE_SECTION_ORDER` keys each page type to an ordered id list; pages render a *subsequence* of it (data-thin sections collapse to nothing - silence-out, never a stub). The two gates (`verify_page_sections`, `verify_section_order`) assert the rendered order is a valid subsequence. Adding a section to a page = adding its id here first, in position. The tone map (`SECTION_TONES`, currently all-white per the SaaS reset) and `getToneClass` give every band its consistent surface.
- **A view model per page type** (cell_view.ts and its country/city/industry/region/neighbourhood siblings) maps raw builder output to the shared section-prop vocabulary. Because the vocabulary is shared, a kit section (and the block behind it) written for one page works on all of them: a stats-card row, a Waterfall, a RangeStrip, a compare grid, a cta panel each appear on multiple page types with one implementation.
- **The six-band shell** (`Band`, `Lanes`, `SectionIndex` in `kit/layout/bands.tsx`) gives every page the same reading rhythm (the 12/6/4 lanes, the quiet sticky index) without altering section order. `StickySectionNav` drops any id whose anchor is absent on mount, so the nav and the rendered sections can never disagree.

The result is a single composition graph: **page (RSC) -> view model (pure) -> Page Kit sections -> {shadcnblocks blocks | visx charts | kit tables} -> token bridge -> tokens.** Re-skin a chart, swap a block, or retheme the palette, and the change propagates to all 11 page types through that one graph, with the gates guarding tokens-only, locked order, honesty, AA, and 375px no-scroll on every build.

---

Files referenced (all absolute):
- `E:\atlas\website\docs\superpowers\plans\2026-06-16-visual-upgrade\01-component-and-chart-system.md`
- `E:\atlas\website\src\app\globals.css` (the L1 token bridge + card/frame/engraved layers)
- `E:\atlas\website\src\lib\design-tokens.ts` (L0), `E:\atlas\website\tailwind.config.ts`
- `E:\atlas\website\components.json` (the `@shadcnblocks` registry)
- `E:\atlas\website\src\lib\cells\cell_view.ts` (the L5 composer contract)
- `E:\atlas\website\src\lib\page-layout\section-order.ts` + `E:\atlas\website\src\lib\page-sections.ts` (locked order + gates)
- `E:\atlas\website\src\components\kit\index.ts` (the L4 barrel), `src\components\kit\charts\*`, `src\components\kit\RangeStrip.tsx` (L3), `src\components\ui\*` (L2a)
- New directory to create: `E:\atlas\website\src\components\blocks\` (L2b, owned shadcnblocks blocks)

## Execution plan

This is Phase B: porting the six approved static mockups (`E:/atlas/{home,country-uk,city-london,cell-london-restaurants,industry-restaurants,neighbourhood-west-end}.html`) into the real Next.js app, wiring live data, preserving the locked sections + honesty boundary, and shipping with zero errors. All work on `reform-v2/r6-forward`. Nothing reaches production without the founder's nod.

Two non-negotiables frame everything below: (1) the founder designed the look, the AI ports it 1:1 and wires data, the AI never invents new visuals; (2) the Verification Protocol (`docs/verification-protocol.md`) is the definition of done for every wave: `npx tsc --noEmit` clean, `npm run prebuild` 31/31, `verify_page_sections` + `verify_section_order` PASS, honesty gates intact, SEE-it via a static export the founder opens himself (no browser automation), then founder nod.

### Grounding facts the plan is built on

- Tailwind is currently **3.4.1**; `recharts` and `@tanstack/react-table` are **not installed**; the shadcnblocks registry IS wired (`components.json`, www host, `SHADCNBLOCKS_API_KEY` in `.env.local`).
- The visx kit is already real and on-brand: `src/components/kit/charts/` (RangeStrip, Waterfall, ThresholdGauge, ScoreBand, ComparisonBars, LikeForLikeBars, TimelineRibbon, VisitorSplit, SeverityGlyph, HeatStrip, FootfallGrid, TierBar) plus root kit (`RangeStrip.tsx`, `MakeItYours.tsx`, `HonestTakeBox.tsx`, `SectionEmpty.tsx`, `StillFillingIn.tsx`, `AnswerFirstMasthead.tsx`, `StickySectionNav.tsx`, `MoneyGoesBreakdown.tsx`) and `src/components/MarginWaterfall.tsx`. These are KEPT and re-skinned, never replaced.
- The token map target file is `src/app/globals.css` (not `src/styles/`). The map is in `01-component-and-chart-system.md` section 2.
- Locked sections live in `src/lib/page-sections.ts` + `src/lib/page-layout/section-order.ts`; gates `verify_page_sections` + `verify_section_order` enforce them. The `_design` catalog (`src/app/_design/`) is the mandatory per-primitive story surface.
- The honesty boundary is load-bearing: real / London-UK exemplar / calm placeholder; `moneyShown` gate; trusted-local link-gate; never rank across business×geography; cities the only scored entity; districts never vs whole cities; the consecutive-unheld "still filling in" collapse strip.

---

### W0 , Foundation (shared by every page; nothing ships)

**Goal:** make "upgrade every page type" tractable by doing the one-time leverage work, so every later wave is a paste-port-and-wire, not a research task.

**Tasks**

1. **Tailwind v4 decision: DEFER to v3.4, do NOT migrate now.** The token bridge is identical work in either version (both read CSS variables), and a v4 migration on a 322-component, 33-gate, 615-page app mid-port is a large independent risk that would block every wave. Decision: stay on 3.4 for all of Phase B; the token bridge is written so it is v4-portable (semantic `--background`/`--primary`/`--chart-*` vars in `:root`, referenced via `hsl(var(--x))` in `tailwind.config.ts` `theme.extend.colors`). Supastarter ships on Tailwind v4; the v4 migration is sequenced as its own task at the Supastarter merge (see "Supastarter sequencing"), not threaded through the page waves. Record this as an ADR.
2. **Write THE ONE token bridge** in `src/app/globals.css`: the section-2 map as `:root` shadcn semantic vars (`--background` cream-75, `--card`/`--popover` cream-50, `--foreground` ink-900, `--muted`, `--muted-foreground`, `--border`/`--input` cream-300, `--primary` atlas-700, `--accent` atlas-50, `--ring`, `--secondary`, `--destructive` clay-700, `--chart-1..5` = atlas-500/moss-600/cocoa-500/ink-500/amber-600, `--radius` 1rem) plus `--font-display` Newsreader / `--font-sans` Inter. Source the hex from `src/lib/design-tokens.ts` (no raw hex in the CSS comment-only; values are tokens). This is the single edit that themes the whole block library and every shadcn chart with zero per-block color work.
3. **Pre-install the dep set** so any selected block resolves on `npx shadcn add`:
   - `npm i lucide-react recharts @tanstack/react-table zod react-icons embla-carousel-react`
   - shadcn base parts (one pass resolves most `registryDependencies`):
     `npx shadcn add button card badge separator switch tabs table avatar carousel accordion navigation-menu sheet chart`
   - `recharts` is wrapped `"use client"` wherever used so SSR pages still prerender.
4. **Build the two genuinely-new chart primitives + the one site-wide grammar**, in `src/components/kit/charts/`, each with a `_design` story and filled+empty states, nullable-in / silence-out, server-renderable:
   - **`WageRange` (dumbbell/range row)** , RangeStrip sibling: low-median-high floating rows, median dot in atlas, bar neutral; tabular pay figures. (Neither shadcn nor the kit has this; cell §9, country hire, city customer reuse it.)
   - **`SeasonalityArea`** , port the shadcn `chart-area-gradient` SHAPE only (gradient def, tickless axes), single atlas series, one direct busiest/quietest label. Recharts under the hood, `"use client"`. (Cell §11.)
   - **`ScoreBand` global-median variant** , confirm/extend the existing `ScoreBand` to carry a global-median peer tick as the ONE site-wide "versus the world" grammar reused on cell §15, country §21, city peers, industry. (Likely a prop, not a new file.)
5. **Confirm the lean block set** by fetching each JSON from the registry (www host, Bearer key) to study exact markup before any wave installs it: `hero2, stats-card1, feature43, feature108, pricing2, cta10, navbar1, footer7, chart-card1, data-table1, compare1, testimonial14`. Record which need content lifted to props + honesty-scrubbed (`compare1`, `testimonial14`, any cloudfront image slot).
6. **Re-skin pass on the kept kit** (Card shell, tighter type scale, generous spacing, shared gradient fills, shared motion) , applied centrally so every page inherits it; verify each kit primitive's `_design` story still renders filled + empty.

**Dependencies:** unblocks ALL waves. W2 (token map + base parts) is the hard gate; W1 needs the cell primitives (WageRange, SeasonalityArea) from task 4.
**Effort/size:** Large (3-4 focused days). The single highest-leverage wave.
**Preview/review point:** a `_design` catalog export (the re-skinned kit + the three new/extended primitives, filled + empty) the founder opens. Founder confirms the token look + chart treatments before any page is built. **Gate the page waves on this nod.**

---

### W1 , Cell flagship (London restaurants) , the exemplar that proves the whole system

**Why first:** richest page, most primitives, the filled exemplar; proving the system here de-risks every later wave. Spec: `05-cell.md`.

**Per-section block + chart wiring** (locked order from `page-sections.ts`; data from the cell view model via `getCellBySlug()`):
- §0a masthead , quiet hero + `stats-card1` KPI row + KEEP `RangeStrip`. The one Newsreader hero number (typical revenue/yr, rounded to $1k, tabular), RangeStrip under it with TYPICAL/spread marks, three calm stat tiles. Gated `moneyShown`.
- §0b make-it-yours , KEEP `MakeItYours.tsx` (shadcn `card`+`input`+`switch`), mounts only when real take-home + revenue held.
- §1 honest-take , `cta10` calm panel (buttons omitted) + `ScoreBand` break-in tick.
- §2 narrative , quiet prose block, 65ch, no chart.
- §3 plain-terms , `feature43` icon grid re-skinned as unit cards.
- §4 money , KEEP `Waterfall` (kept row lone atlas-500; never a pie).
- §5 cost-drivers , single-series `ComparisonBars`-family, rides off §4 as a lighter list.
- §6 owner-take-home , KEEP `ScoreBand` / kept-vs-gone bar; optional one re-skinned radial only if it earns the moment.
- §7 break-even , KEEP `ThresholdGauge` (amber-below/moss-above, atlas break-even tick + typical-day tick).
- §8 risks , KEEP `SeverityGlyph` rows.
- §9 wages , **new `WageRange`** dumbbell rows.
- §10 startup-cost , kit stacked primitive / `chart-card1` stacked, one Newsreader total.
- §11 seasonality , **new `SeasonalityArea`**, single atlas series.
- §12 first-year , KEEP `TimelineRibbon` (break-even node the lone vermillion dot).
- §13 nearby , KEEP `LikeForLikeBars` (honesty rail load-bearing; suppressed for districts).
- §14 operator-voices, §15 vs-world , calm `SectionEmpty` / static quote wall on London; vs-world uses the W0 site-wide ScoreBand grammar.
- §16 related , `cta10` / quiet link gallery.

**Locked-section preservation:** every id in `page-sections.ts` renders or routes into the **collapse strip** (`StillFillingIn.tsx`); consecutive unheld sections fold into ONE calm band, never per-section dashed cards. `moneyShown` governs §0a/§0b/§4/§6/§7/§3. London-exemplar sections (§1/§8/§9/§11/§12) self-omit off-exemplar. `suppressInventedPeers` for districts on §13.
**Install commands (only the not-yet-present blocks):** `npx shadcn add @shadcnblocks/stats-card1 @shadcnblocks/cta10 @shadcnblocks/feature43 @shadcnblocks/chart-card1` (then honesty-scrub any image slot).
**Dependencies:** needs W0 complete (token map + WageRange + SeasonalityArea + base parts).
**Effort/size:** Large (3-4 days) , most primitives, the collapse strip, the calculator, both widths.
**Preview/review point:** a static export of `/gb/london/restaurants` (and one thin non-London cell to prove the collapse strip) the founder opens himself. Founder nod required before W2. This wave's pattern (view-model → sections → strip → gates) becomes the template carried forward.

---

### W2 , Home , the commercial front door

**Why second:** proves the marketing/blocks side (hero, varied card grammars, pricing, calm panels) once the data discipline is proven. Spec: `02-home.md`.

**Per-section wiring** (existing home loaders: `loadExampleTiles`, `WorldMapSection`, `loadStateComparisons`, `loadNeighborhoodCards`, `AudienceBand`, `UpgradeTeaser`/`TIERS`, `getAllPosts`, `HomeNewsletter`/`LeadMagnetForm`):
- §1 home-hero , `hero2` (heading + sub + single CTA), `NavigatorForm` preserved verbatim as the in-band primary action, `RotatingWord` kept.
- §2 home-featured tiles , `stats-card1` 3-up, real headline numbers, no change-arrows, self-omits below 3.
- §3 home-city-picker , KEEP bespoke `WorldMapSection` (do not swap).
- §4 state comparison , KEEP `LikeForLikeBars`/`ComparisonBars`, no winner crown, drops if thin.
- §5 neighbourhood cards , Gallery 3-up from real flavor data, no numbers.
- §6 audience , `feature43` 4-up icon grid (PE/consulting framed as clients).
- §7 pricing teaser , `pricing2` mini, prices from `TIERS`, no checkout, one CTA to /pricing.
- §8 blog rail , `feature` gallery cards 3-up, token-gradient fallback covers.
- §9 newsletter , `cta10` panel + a REAL sample-report preview render (never a placeholder cloudfront slot).
- Site chrome: install **`navbar1` + `footer7`** here (shared by every page; mobile sheet built into navbar1).

**Locked-section preservation:** the two fragile data sections (state comparison, neighbourhood cards) self-omit silently when thin; if both fail at once they collapse to one calm strip. Vary the five card grammars (stats/feature/gallery/pricing) so it never reads as a card-wall.
**Install commands:** `npx shadcn add @shadcnblocks/hero2 @shadcnblocks/pricing2 @shadcnblocks/navbar1 @shadcnblocks/footer7` (stats-card1/feature43/cta10 already present from W1).
**Dependencies:** W0; reuses W1's stats-card1/cta10/feature43. navbar1/footer7 become shared chrome for W3-W11.
**Effort/size:** Medium-large (2-3 days) , many sections but mostly editorial, no new charts.
**Preview/review point:** static export of `/` at 1280 + 375. Founder nod.

---

### W3 , Country (United Kingdom) , the densest page, proves the collapse at scale

Spec: `03-country.md`. 25 constitution sections; the design makes it feel like ~12 via weight + the single collapse strip (eight unheld sections → one "Still filling in for {country}" panel).

**Per-section wiring** (kept components + view model `buildCountryView`):
- §1 hero , kept `EngravedHero` re-skinned toward `hero2` proportions, faded `CountryMastheadImage`, `AddToWatch`, the one anchor (small-business tax %).
- §2 scorecard , `stats-card1` grid over kept `Scorecard`, 4-up/2-up, dash + "not held" for null cells.
- §3 shape , KEEP visx `CountryShape` radar (do NOT swap to Recharts); rings labelled weak/fair/strong, sample spokes tagged.
- §4 decisive , kept `SetupStepper` + `data-table1`-style `BusinessFormationCosts` table.
- §7 hire , kept `HiringRead` gauge / held-fact bullets + `ComparisonBars` payroll-vs-neighbours (caveat rail).
- §11 neighbours , kept `Neighbours` like-for-like FACTS table, home column tinted not crowned, caveat fixed.
- §16 cities , kept `CitiesGrid` uniform equal-weight cards (NEVER ranked; country never scores its own cities).
- §17 break-in , kept `EasiestToBreakIn`, ranks ACTIVITIES (allowed), link-gated to trusted-local cells.
- §18 character, §19 locals (UK exemplar), §21 vs-world (site-wide `ScoreBand` global-median), §22 honest-take, §23 gut-check, §24 one-thing, §25 related (`cta10`).
- §5/§6/§8/§10/§12/§13/§14/§20 (licences, cost-signature, talent, opportunity, here-vs-abroad, special-zones, your-life, etc.) , fold into the ONE `StillFillingIn` strip with tagged chips.

**Install commands:** `npx shadcn add @shadcnblocks/data-table1` (stats-card1/cta10 present).
**Dependencies:** W0; reuses the W0 site-wide ScoreBand grammar and the W1 collapse-strip pattern at scale.
**Effort/size:** Large (3 days) , the volume of sections and the collapse-at-scale are the work; most components already exist.
**Preview/review point:** static export of `/gb`. Founder nod.

---

### W4 , City (London) , single-score hero + peers

Spec: `04-city.md`. The Business Climate Score is the one scored entity.

**Per-section wiring** (`buildCityScore`, `buildCityActivities`, `buildCityPeers`, curated data):
- §1 headline , `stats-card1` KPI row under a calm hero + KEEP `ScoreBand`; the **one optional re-skinned shadcn radial** is permitted ONLY for this hero score moment (W0 produced it). Thin cities soften the score to a break-in chip.
- §2 honest-take , `cta10` panel / `SectionEmpty`.
- §3 customer , `chart-card1` stat-pair shell + KEEP `RangeStrip` (London income spread real only; self-omits elsewhere).
- §4 space , KEEP `RealityCheck` character read + small `data-table1`-style dl (index framed as cost character, never a quoted rent).
- §5 visitors , KEEP `VisitorSplit` (one proportion bar, never a pie), always rendered.
- §6 owners-keep , KEEP `OwnerKeepTable`/`LikeForLikeBars`, break-in chip per row, self-omits below 3 real rows.
- §7 best-areas , divided area list + suits pictogram (London) / `SectionEmpty`.
- §8 neighbourhoods , `NeighborhoodCover` cover cards 2-up/4-up.
- §9 changing , KEEP `ContrarianInsight` / `SectionEmpty`.
- §10 peers , KEEP `ComparisonBars` on the shared 0-100 climate scale (cities vs cities only, caveat rail) + `CityPeers` cards; vs-world peer-median rides here with its own empty state.
- §11 one-thing , KEEP `OneThing`.

**Locked-section preservation:** districts never on the city 0-100 scale; consecutive unheld sections (honest-take/best-areas/changing) → one strip; no "best city" crown.
**Install commands:** none new (chart-card1/data-table1/cta10/stats-card1 all present; radial from W0).
**Dependencies:** W0 (radial + ScoreBand grammar); reuses W3 components.
**Effort/size:** Medium (2 days).
**Preview/review point:** static export of `/cities/london` + a thin-city inset proving the softened hero + strip. Founder nod.

---

### W5 , Industry (Restaurants) , verdict hero + model anatomy + cost-stack waterfall

Spec: `07-industry.md`. No London fill; US-state cohort only; the three bar-shaped charts deliberately differentiated.

**Per-section wiring** (`buildActivityView`: masthead, honestTake, verdict, moneyGoes, typicalOperator, stateRows, margin, costDrivers, relatedActivities):
- §1 hero , answer hero (`stats-card1` row under quiet hero) + KEEP `RangeStrip` (US-state revenue band) OR kept-per-$100 fallback; `AtlasPictogram` eyebrow; `ActivityPlacePicker` as the one primary action. No tier chip.
- §2 honest-take , `cta10` / `SectionEmpty`.
- §3 how-it-works , `feature43`/`feature108` re-skinned as `BeatCard` with signal-word dl (the distinctive move, most room).
- §4 money , KEEP `Waterfall`/`MoneyGoesBreakdown` per-$100 (kept moss, costs cocoa; never a pie).
- §5 typical-operator , `PlainTerms` (data-table1 sibling) / `SectionEmpty` below 2 facts.
- §6 where-it-earns , KEEP `LikeForLikeBars` over US states ONLY, honesty rail copy stays, NO cross-country rank.
- §7 margin-waterfall , KEEP `src/components/MarginWaterfall.tsx` , the only true vertical waterfall, the punchline.
- §8 cost-drivers , `CostDrivers` brand block / `feature43`-style impact rows (no new numbers).
- §9 related-links , `cta10`/Gallery sibling tiles (taxonomy rail, NOT a ranking).
- §10 one-thing , `OneThing`.

**Install commands:** `npx shadcn add @shadcnblocks/feature108` (feature43/cta10/stats-card1 present).
**Dependencies:** W0; reuses everything from W1/W2.
**Effort/size:** Medium (2 days).
**Preview/review point:** static export of `/industries/restaurants` + one thin-trade variant (kept-share fallback hero + a `SectionEmpty`). Founder nod.

---

### W6 , Neighbourhood (London West End) , relative-multiplier hero, no absolute money

Spec: `06-neighbourhood.md`. Relative-by-design; the rail-clamp ("2x or more"/"less than half") is load-bearing.

**Per-section wiring** (`getNeighborhoodMultiplier`, flavor, sibling records):
- §1 headline , re-skinned `AnswerFirstMasthead` + a KEEP-kit `ScoreBand`-as-multiplier-gauge (0.4x..3.0x track, city baseline pinned at 1.0x); chip row of `pricing`-style pills (price tier atlas-tinted, economic tags cream).
- §2 honest-take , `cta10` / kit `HonestTakeBox`.
- §3 thrives , KEEP `LikeForLikeBars` (rail-clamped), rows clickable into cells + a `stats-card1`-style one-trade decomposition mini-grid scoped to ONE trade.
- §4 streets-by-street , placeholder → folds into the strip (never invents a street tag).
- §5 who , kit `WhatLocalsKnow` list (real flavor / `SectionEmpty`).
- §6 operating-cost , kit `BreakEvenLine` headline + a one-row `LikeForLikeBars` vs the 1.0x baseline.
- §7 adjacent , kit `LikeForLikeTable` (same rep trade, one city, leader mark allowed).
- §8 prime-streets , 2-col `feature`-grid card grid, mounts only with a curated record.
- §9 ground , 2-col `feature`-style text grid (curated flavor only).
- §10 businesses-here , kit `BeatCard` uniform sibling tiles.
- §11 one-thing , kit `OneThing`.

**Locked-section preservation:** NO absolute money at this altitude; districts never vs whole cities; thin districts fold to ONE strip.
**Install commands:** none new (all blocks present).
**Dependencies:** W0; reuses W1-W5 kit.
**Effort/size:** Small-medium (1.5-2 days) , mostly kit-driven, few new blocks.
**Preview/review point:** static export of `/gb/london/west-end` + the collapsed bare-district grammar in the same doc. Founder nod.

---

### W7 , Reuse types (region/state, learn, compare, directory) , one wave, no new visual vocabulary

The remaining five real page types reuse the SAME components + section spines proven in W1-W6; this wave is wiring, not design.
- **region/state** , reuses the country spine (W3): scorecard, neighbours-style FACTS, cities grid, vs-world, honest-take. State = a country-shaped page scoped to a US state.
- **neighbourhood-overview** (the city's index of districts, distinct from W6's single-district page) , reuses W4 cover-card + W6 sibling-rail grammar.
- **learn** , editorial/blog grammar from W2 (gallery/feature cards, `cta10`, prose blocks); no charts.
- **compare** , `compare1` (content lifted to props + honesty-scrubbed: like-for-like only, no cross-business×geography ranking) + KEEP `LikeForLikeBars`/`Neighbours` FACTS grammar.
- **directory** , `data-table1` + uniform tile grid (no scores, no ranking).

**Install commands:** `npx shadcn add @shadcnblocks/compare1` (then scrub content for honesty rules).
**Dependencies:** all of W0-W6 (these are pure recombinations).
**Effort/size:** Medium (2-3 days for all five, since each is a recombination).
**Preview/review point:** one static export per type. Founder nod. After this nod the full set is ready for the single cohesive promote.

---

### Supastarter sequencing , merged AFTER the page waves, never threaded through them

Supastarter (Next.js SaaS boilerplate: better-auth, billing, admin, marketing, i18n; shadcn + **Tailwind v4**; Supabase DB+storage) is a large independent surface. Threading its auth/Tailwind-v4/i18n changes through the page waves would multiply the blast radius and break the "zero errors" goal. Sequencing:

- **During W0-W7:** Supastarter is NOT in the tree. Page waves target the current app on Tailwind 3.4 with the v4-portable token bridge.
- **Supastarter Wave (after W7 founder nod):** a dedicated branch off `reform-v2/r6-forward`.
  1. Stand up Supastarter in isolation; confirm its auth/billing/admin shells.
  2. **Tailwind v4 migration** happens HERE (Supastarter is v4-native): migrate the token bridge from the v3 `tailwind.config.ts`/`globals.css` form to the v4 `@theme` form. Because the bridge is already semantic-var-based, this is a mechanical re-express, not a re-design.
  3. Port the W1-W7 page components onto the Supastarter shell (they read only semantic vars + the kept kit, so they move cleanly).
  4. Reconcile auth: better-auth vs the existing Supabase access; gate behind a flag.
  5. Full gate re-run + a complete static-export pass at both widths.
- **Effort/size:** Large, treated as its own project phase with its own founder review, not part of the page-build budget.

**Why this order:** it keeps every page wave shippable on the current production stack, isolates the two biggest risks (Tailwind v4 + auth) into one controlled merge, and lets the founder review the visual upgrade fully before the platform swap.

---

### Cross-wave definition of done (run before EVERY wave preview)

1. **Instruction fidelity:** every locked section present, in order; the recommended block/chart per section; the founder's mockup ported 1:1, no invented visuals.
2. **Gates green:** `npx tsc --noEmit` clean; `npm run prebuild` 31/31 (parallel concurrency ≤4 on Windows; use `prebuild:serial` if flaky); `verify_page_sections` + `verify_section_order` PASS; `verify_no_em_dashes`, `verify_no_source_agencies`, `verify_hardcoded_hex`, `verify_cross_geography_guard` PASS.
3. **Honesty boundary:** `moneyShown` gate respected; trusted-local link-gate; never rank across business×geography; cities the only scored entity; districts never vs whole cities; unheld sections → the calm collapse strip, never dashed shells or fake numbers.
4. **Charts:** nullable-in / silence-out; filled + empty states; any Recharts shape wrapped `"use client"` so SSR pages still prerender; each primitive has its `_design` story.
5. **A11y / responsive:** WCAG AA contrast; tabular figures on every number; 44px tap targets; 375px no horizontal scroll; one loud accent (atlas); no gradient text, no side-stripe cards, no identical card-grid repeat, no decorative animation.
6. **SEE it:** deliver a static export the founder opens himself (no browser automation, no dev server). Founder reacts → iterate that page to nod → next wave.
7. **Ship discipline:** all work on `reform-v2/r6-forward`; nothing to production until the single cohesive sign-off after W7.

### Dependency graph (what unblocks what)

```
W0 Foundation (token bridge + deps + WageRange/SeasonalityArea/ScoreBand-global + block study + kit re-skin)
   ├─ W1 Cell        (needs WageRange + SeasonalityArea)        ── proves the pattern + collapse strip
   │     └─ W2 Home  (reuses stats-card1/cta10/feature43; adds navbar1+footer7 = shared chrome)
   │           ├─ W3 Country  (collapse-at-scale; reuses ScoreBand-global)
   │           │     └─ W4 City    (radial hero moment from W0; reuses W3 components)
   │           ├─ W5 Industry (reuses W1/W2; MarginWaterfall)
   │           └─ W6 Neighbourhood (reuses kit)
   │                 └─ W7 Reuse types (region/learn/compare/directory) — pure recombination of W0–W6
   └─ Supastarter Wave (AFTER W7 nod) — Tailwind v4 migration + auth/billing/admin + port page components onto the shell
```

**Total page-build budget:** ~16-21 focused days across W0-W7, front-loaded into W0 (the leverage) and W1 (the exemplar that templates the rest); each later wave gets cheaper as the kit, the collapse strip, and the per-section grammar carry forward. Supastarter is a separate phase on top.

Files referenced: `E:\atlas\website\src\app\globals.css` (token bridge target), `E:\atlas\website\components.json` (registry), `E:\atlas\website\src\lib\page-sections.ts` + `E:\atlas\website\src\lib\page-layout\section-order.ts` (locked sections), `E:\atlas\website\src\components\kit\charts\` + `E:\atlas\website\src\components\MarginWaterfall.tsx` (kept charts), `E:\atlas\website\src\app\_design\` (catalog stories), `E:\atlas\website\docs\verification-protocol.md` (DoD), specs at `E:\atlas\website\docs\superpowers\plans\2026-06-16-visual-upgrade\02-07*.md` + `08-build-sequence-and-qa.md`.

## Quality assurance

The visual upgrade ships ZERO errors by stacking seven independent layers of defense, each catching a different class of failure. No wave is "done" and no promote happens until every applicable layer is green. The layers run cheapest-first (static gates) to most-expensive-last (human + adversarial review), so most defects die before a human ever looks. The gate names below are the REAL scripts in `scripts/` and `package.json`; do not invent gate names.

### QA-0. Source of truth and where these run

- All commands run from `E:\atlas\website` (the shell CWD resets to `E:\atlas`; prefix Bash with `cd /e/atlas/website &&`).
- All work on branch `reform-v2/r6-forward`. Nothing reaches production without the founder's explicit nod (QA-9 Final ship gate).
- The governing definition of done is `docs/verification-protocol.md` (instruction fidelity, gates, data honesty, SEE it, honest reporting, ship discipline). This QA section operationalizes it for the visual upgrade.
- The honesty boundary is mechanical, not aspirational: real / London-UK exemplar / calm "still filling in" placeholder; `moneyShown` gate; cities the only scored entity; districts never compared to whole cities; never rank across business x geography. The gates that enforce it are named per layer below.

### QA-1. Automated gates (the floor, run on every change)

These are the non-negotiable machine gates. Run the full set before any commit and before every wave sign-off. "31/31" is literal: `scripts/prebuild_all.ts` runs a `GATES` array of exactly 31 entries.

Runnable sequence (in order, all from `E:\atlas\website`):

```
[ ] npx tsc --noEmit                 # TypeScript strict, zero errors. ~30-60s.
[ ] npm run prebuild                  # 31 gates, parallel, concurrency<=4, ~28-30s.
[ ]   (if parallel flaky on Windows) npm run prebuild:serial   # same gates, single-process
[ ] npm run build                     # only with a stated reason / founder permission;
                                      #   confirms SSR prerender of all static pages + postbuild edge-size gate
```

Concurrency: `npm run prebuild` defaults to `--concurrency=4`. NEVER raise above 4 on Windows (6 intermittently segfaults: exit 134 / 0xC0000005). If a gate flakes, re-run `prebuild:serial` to confirm it is a real failure, not a resource race.

The 31 gates that must all pass (from `scripts/prebuild_all.ts`), grouped by what they protect:

- Tokens / constraints (the visual-upgrade-critical ones):
  - `no-em-dashes` (`verify_no_em_dashes.ts`) , no em-dash in any user-visible `.tsx`/`.ts` under `src/` or `content/blog/`. Override only with `// allow-em-dash` and a reason.
  - `no-source-agencies` (`verify_no_source_agencies.ts`) , no agency name (Eurostat, ONS, BLS, ATO, etc.) in user-facing copy. Allowlist + `// allow-source-agency` only.
  - `no-hardcoded-hex` (`verify_hardcoded_hex.ts`) , baseline-snapshot gate; blocks any NEW raw hex in `src/app`/`src/components` `.tsx`. Every new block color MUST come through the Atlas->shadcn token map, never an inlined hex. Do NOT reseed the baseline to silence a real new literal.
  - `typography` (`verify_typography_consistency.ts`) , every `h1/h2/h3` with a className must carry a canonical token from `src/lib/ui/typography.ts`, or an explicit `data-typography="custom"` + reason. This is how re-skinned blocks stay on one type scale.
  - `layering` (`verify_layering.ts`) , presentation (`src/app`, `src/components`) must not import `data/*.json` directly; go through `src/lib/`. Do NOT add new allowlist entries; migrate the 14 grandfathered ones when touched.
- Section spine / locked order (must survive the re-skin):
  - `page-sections` (`verify_page_sections.ts`) , every page type renders its full canonical id set (filled or calm placeholder), nothing dropped. Manifest in `src/lib/page-sections.ts`.
  - `section-order` (`verify_section_order.ts`) , rendered `<section id>` blocks are a valid subsequence of `PAGE_SECTION_ORDER` in `src/lib/page-layout/section-order.ts`. No reordering a section without first changing the constitution doc.
- Honesty / data sanity (must not regress while skinning):
  - `cross-geography-guard` (`verify_cross_geography_guard.ts`) , the cross-place money guards stay wired; no new file sorts raw-money across countries.
  - `render-guards` (`verify_render_guards.ts`) , FX correction + plausibility suppression stay invoked in `cells.ts`.
  - `comparative-voice`, `key-benchmark`, `cost-share-invariant`, `turnover-bands`, `wage-source`, `city-wages`, `industry-medians`, `econ-profile-integrity`, `signature-quality`, `deepening`, `monetization-coverage`, `v34-research-rules`, `no-internal-notes`, `au-industry-map`, `au-anchor-render`, plus the cell tests `top-industries-plausibility`, `all-sizes-blend`, `geo-region-name`.
- Routes / structure:
  - `dead-links` (`find_dead_links.ts --strict`) , every literal `href="/..."` resolves to a real route in `src/app/`. Catches deferred-route and typo links.
  - `taxonomy`, `featured-tiles`, `useless-tiles`, `edge-sizes` (postbuild).

Gate is PASS only when `prebuild_all` prints `GATE: PASS` AND `tsc --noEmit` exits 0. A skipped gate is a failed delivery (verification-protocol §4).

Supplementary static audits (NOT in the 31-gate chain, run per-wave for visual/mobile/a11y/perf signal; they emit reports, not pass/fail exit codes):

```
[ ] npx tsx scripts/audit/a11y_static_audit.ts        -> data/audit/a11y_static_REPORT.md
[ ] npx tsx scripts/audit/mobile_static_audit.ts      -> data/audit/mobile_static_REPORT.md
[ ] npx tsx scripts/audit/performance_static_audit.ts -> data/audit/performance_static_REPORT.md
```

Treat any NEW finding these introduce (vs the pre-wave baseline of the same report) as a blocker for that wave.

### QA-2. Graphical QA per page (1280 + 375), without local browser automation

The founder forbids spinning up a local dev server / Playwright to "show work" (too slow, he hates it). So graphical verification has two tracks: an automated build-truth check that needs no human, and a Vercel PREVIEW link the founder opens himself.

How it is verified:
1. Automated build truth (no browser): `npm run build` must prerender every static page with no error and no warning (SSR prerender intact, QA-5). Any ported chart that uses a client-only library is wrapped `"use client"` and accepts nullable-in / silence-out, so a missing data field can never throw at prerender. The `no-hardcoded-hex` + `typography` + `section-order` + `page-sections` gates already prove token-only color, one type scale, and full spine in source.
2. Vercel preview deploy (the human eyes): deploy a PREVIEW (never production) and hand the founder the preview URL plus a viewing checklist. The founder opens it on a real device. We do NOT screenshot via a local server. For our own internal pre-founder pass we may render the deployed PREVIEW URL (not localhost) in the Playwright MCP at 1280 and 375 to catch the gross breakages before spending the founder's attention. The standalone-HTML mockup route (Phase A artifacts) is the fallback when no preview is warranted.

Per-page visual checklist (run at 1280 desktop AND 375 mobile, on a filled exemplar London/UK page AND a thin instance):

```
[ ] One focal point: a single clear answer-first element per page; eye lands there first
[ ] Hierarchy reads top-down: hero verdict -> supporting sections -> calm footer; no two
    sections competing for "loudest"
[ ] One loud accent (atlas) only; no second loud color; no gradient text; no side-stripe
    accent borders; no identical card-grid repeated down the page
[ ] Spacing on the one scale: consistent section rhythm, no cramped/colliding blocks
[ ] No overflow at 375: zero horizontal scroll; no element clipped off-screen
[ ] Nothing broken / blank / washed-out / overlapping; every chart either renders or is
    cleanly absent (never an empty axis frame, never raw undefined/NaN)
[ ] Token-only color: backgrounds, text, borders, chart series all from the token map
[ ] Tabular figures on EVERY number (aligned digits in tables, ranges, stats cards)
[ ] Tap targets >= 44x44 on mobile; charts legible (not a desktop chart crushed to 375)
[ ] Calm placeholder ("still filling in") shown for unheld sections, not a fabricated number
[ ] Cohesion: this page type matches the others (one shell, one divider family, warm frame on)
```

Each wave produces this checklist filled in, plus the preview URL, before the founder is asked to look.

### QA-3. Content QA (honesty boundary, copy)

Per page, on both an exemplar and a thin instance:

```
[ ] Honesty boundary holds: every figure is real, OR a clearly-tagged London/UK exemplar,
    OR a calm placeholder. Zero fabricated real-looking numbers.
[ ] moneyShown discipline: money only where the trusted-local link-gate allows it
[ ] Like-for-like only: no ranking across business x geography; cities the only scored
    entity; a district is NEVER compared against a whole city
[ ] No visibly-wrong number: common-sense pass on every figure (no "$1.8B average grocery
    store", no poorer-country-out-earns-richer artifact). Backed by cross-geography-guard +
    render-guards gates.
[ ] No badmouthing an industry; consulting / PE framed as clients, not subjects
[ ] Copy proofread: spelling, grammar, no placeholder lorem, no internal note leaked
    (no-internal-notes gate), no em-dash (no-em-dashes gate), no agency name
    (no-source-agencies gate)
[ ] Voice: quiet editorial register; plain human copy; no hype
```

### QA-4. Accessibility (WCAG AA)

```
[ ] Contrast: text + UI on its background meets AA (4.5:1 body, 3:1 large/UI). Verify on
    the deployed preview with the browser a11y inspector or an axe run against the preview
    URL (NOT localhost). Re-skinned tokens are the highest-risk regression here.
[ ] Focus states: every interactive element has a visible focus ring (token-driven), never
    outline:none with no replacement
[ ] Keyboard: full keyboard traverse of nav, links, tabs, accordions, any disclosure; no
    trap; logical tab order matches visual order
[ ] Tap targets: >= 44x44 on mobile (mobile_static_audit flags the obvious ones)
[ ] Reduced motion: any motion respects prefers-reduced-motion; no essential info conveyed
    by motion alone; no decorative animation (it is banned anyway)
[ ] Semantics: headings nested in order; icon-only controls have aria-label; images have
    alt (decorative alt=""); inputs labelled. a11y_static_audit.ts catches the source-level
    cases; the preview axe pass catches runtime contrast/focus.
```

### QA-5. Performance

```
[ ] SSR prerender intact: npm run build prerenders all static pages with no error; no page
    silently flipped to force-dynamic. Any newly dynamic route is a regression (perf audit
    lists force-dynamic routes).
[ ] LCP: the hero/verdict is the LCP element and is server-rendered (not lazy); measured on
    the Vercel preview (real CDN), target good LCP. No layout shift from late charts.
[ ] Bundle: First Load JS per route does not regress materially vs baseline; client-only
    chart libs are code-split behind "use client", not pulled into shared chunks. Compare
    the build route table + performance_static_audit before/after.
[ ] Images: next/image (or the existing image pipeline) with width/height to reserve space;
    no unbounded raw <img>; hero art is sized for 375 and 1280; no data behind imagery.
[ ] Edge size: postbuild verify_edge_function_sizes.ts stays green.
```

### QA-6. Link / route integrity

```
[ ] dead-links --strict green (no broken internal href). Part of the 31 gates.
[ ] No URL slug renames (SEO equity). New routes only, never rename.
[ ] On the deployed preview, smoke the six canonical page types + the long-tail reuse types
    (region/state, neighbourhood-cell, neighbourhood-overview, learn, compare, directory):
    each loads, 200s, renders its spine. The trusted-local link-gate is respected (no
    /opening links on untrusted aggregate cells).
[ ] Cross-link sanity: nearby/related/peers links point at like-for-like targets only.
```

### QA-7. Adversarial review pass (the breaker)

After a page passes QA-1 through QA-6, a separate reviewer (a fresh agent or a second pass with no attachment to the build) actively tries to break each page on the deployed preview. Goal: find the one defect the builder is blind to. The breaker runs, per page:

```
[ ] Thin / empty data: open the emptiest real instance. Does any section render a broken
    chart, an empty axis, "NaN", "undefined", "$0", or a fabricated stand-in? It must be a
    calm placeholder or cleanly absent.
[ ] Extreme data: largest + smallest real values. Do numbers overflow their container, break
    tabular alignment, or push the layout past 375 width?
[ ] Honesty attack: hunt for ANY cross-geography comparison, any district-vs-city, any
    business-x-geography ranking, any money shown where the link-gate forbids it.
[ ] Resize sweep: 320 / 360 / 375 / 768 / 1024 / 1280 / 1440. Any overflow, overlap, or
    illegible crush at any width is a fail.
[ ] Keyboard-only + screen-reader spot check on the most interactive page (cell).
[ ] Cohesion attack: put two page types side by side. Do they look like one product (one
    shell, type scale, divider family, accent), or like two designs?
[ ] Reduced-motion + dark/forced-colors if applicable.
[ ] Copy attack: read every line aloud for cringe, hype, em-dash, agency name, badmouthing,
    typo.
```

The breaker files each finding as a blocker. The wave is not done until the breaker finds nothing new.

### QA-8. Definition of done per wave

A wave (one page type per `08-build-sequence-and-qa.md`: Foundation, then cell, home, country, city, industry, neighbourhood) is DONE only when ALL of the following are true and committed green on `reform-v2/r6-forward`:

```
[ ] Instruction fidelity: every discrete ask for this wave enumerated and done, or the
    deviation explicitly flagged with a reason (verification-protocol §0). No silent
    substitution, no dropped/reordered/renamed section.
[ ] Matches its page spec (02-07): every locked section present, in order; the recommended
    block/chart per section; density + collapse rules applied.
[ ] QA-1 green: tsc clean; prebuild 31/31; the three static audits show no new finding.
[ ] QA-2 graphical checklist filled at 1280 + 375, exemplar + thin, with the preview URL.
[ ] QA-3 content + QA-4 a11y + QA-5 perf + QA-6 links checklists all ticked.
[ ] QA-7 adversarial pass found nothing new (or all findings fixed and re-passed).
[ ] Founder opened the preview for this wave and reacted; iterated to his nod before the
    next wave starts (waves do not stack unreviewed).
[ ] The wave's commit is green; the Foundation token map + shared primitives carry forward
    unchanged or with an intentional, documented bump.
[ ] Honest report written: what is real vs exemplar vs deferred, judgment calls, residual
    risks.
```

### QA-9. Final ship gate (before ANY promote to production)

Run once, after all waves are individually done, as the last thing before promote. Promote is forbidden until every line is true:

```
[ ] All seven page-type waves DONE per QA-8, all on reform-v2/r6-forward.
[ ] Full clean run on a fresh checkout: npx tsc --noEmit (0 errors) + npm run prebuild
    (31/31, GATE: PASS) + npm run build (all static pages prerendered, postbuild edge-size
    green). No skipped gate, no --no-verify, no force-push.
[ ] One cohesive PREVIEW deploy of the whole site (not per-wave fragments). The 11 public
    page types load and render their spine; the six canonical exemplars + thin instances
    checked at 1280 + 375.
[ ] Honesty boundary verified across the live preview: cross-geography-guard + render-guards
    + cross-geo content sweep all clean; no fabricated number anywhere; cities the only
    scored entity; districts never vs cities.
[ ] Accessibility: AA contrast + focus + keyboard + reduced-motion confirmed on the preview
    (axe against the preview URL, not localhost).
[ ] Performance: LCP good on the preview CDN; no route regressed to force-dynamic; bundle
    not materially worse; no prerender lost.
[ ] Links: dead-links --strict green; no slug renamed; all internal routes 200 on preview.
[ ] Final adversarial pass over the cohesive preview found nothing new.
[ ] The founder opened THIS preview and gave the single cohesive sign-off, in writing.
[ ] Promote: confirm the target Vercel project, deploy the same commit that was previewed,
    re-smoke production after promote. Production never falls behind verified branch work.
```

Only when QA-9 is fully ticked and the founder has nodded does the upgrade promote. Anything less is, per the verification protocol, not a delivery.

---

Grounding notes for the parent plan (not part of the section, but load-bearing):
- The "31/31" claim is real: `E:\atlas\website\scripts\prebuild_all.ts` defines exactly 31 gates in its `GATES` array (I counted the entries; `npm run prebuild` runs them parallel at concurrency 4).
- Every gate name used above is a real script: `E:\atlas\website\scripts\verify_*.ts` and `E:\atlas\website\scripts\audit\find_dead_links.ts`. The full list and the serial chain are in `E:\atlas\website\package.json`.
- The static (non-gate) visual/mobile/a11y/perf audits exist at `E:\atlas\website\scripts\audit\{a11y_static_audit,mobile_static_audit,performance_static_audit}.ts`; they emit reports under `data/audit/`, they are NOT in the 31-gate chain, and they are source-level heuristics (a real a11y/perf pass needs the deployed preview).
- The definition-of-done and honesty-boundary language is anchored to `E:\atlas\website\docs\verification-protocol.md` and `E:\atlas\website\docs\superpowers\plans\2026-06-16-visual-upgrade\08-build-sequence-and-qa.md`.

## Decisions, brainstorm and risks

This section records the load-bearing choices for Phase B (the live-app port), each with the options weighed, a recommendation, and the reasoning. The governing instinct throughout: this is a staged, gated migration on `reform-v2/r6-forward` where the cheapest reversible path that protects the honesty gates and the existing visx kit wins over the cleaner-on-paper rebuild. Nothing here changes the approved look (the six static mockups); it decides how that look reaches the live app with zero errors.

### D1. Tailwind v3 to v4 migration timing

**Where we are.** The app is on `tailwindcss@3.4.1` with a `tailwind.config.ts` that imports its scale from `src/lib/design-tokens.ts`, a `globals.css` that uses `@tailwind base/components/utilities` and two pre-`@tailwind` `@import` bespoke CSS files, the shadcn token map already written as space-separated RGB triplets under `@layer base`, and `tailwindcss-animate`. shadcnblocks Pro ships v4-first markup; Supastarter is v4-native; the shadcn registry assumes v4.

**Options.**
- **(A) Migrate to v4 NOW, as Wave-0 foundation, before any block install.** One disruptive change, done while the surface area is smallest, so every block we install lands already v4-correct.
- **(B) Stay on v3 for the whole Phase B port, migrate later.** Install blocks and hand-convert their `@theme`/v4 idioms back to v3 config as we go.
- **(C) Defer entirely and let the Supastarter adoption carry the v4 jump** (Supastarter is v4-native, so taking its shell brings v4 with it).

**Recommendation: (A), migrate to v4 as the very first Phase-B task, on its own commit, gated, before installing a single block.** 

**Reasoning.** The blast radius is real but bounded and it only grows with every v3-flavored line we add. The concrete v3->v4 work for this repo: (1) replace `@tailwind base/components/utilities` with `@import "tailwindcss"` and move the two bespoke `@import`s to the top (already correct order today, low risk); (2) port `tailwind.config.ts`'s `theme.extend` into the CSS-first `@theme` block, or keep the JS config alive via `@config` (v4 still supports it) as a transitional bridge; (3) the `rgb(var(--token) / <alpha-value>)` color declarations and the RGB-triplet token map are already v4-shaped, so the color system survives almost untouched, which is the single biggest de-risker here; (4) swap `tailwindcss-animate` for `tw-animate-css` (the v4-maintained fork shadcn now uses); (5) re-verify the `shadow-subtle/card/lift/modal`, `--radius` calc chain, and `tabular-figures` utility layer. Option B forces us to translate v4 idioms backward on every block forever, which is more total work and a permanent source of subtle drift (a block's `size-*`, `@theme` colors, or default-border-color change behaves differently under v3). Option C couples the framework jump to the Supastarter integration, the single highest-risk event in the plan, which violates "change one big thing at a time." Doing v4 first and alone means each subsequent block install is verified against the final framework, the prebuild gates (`verify_hardcoded_hex`, `verify_typography_consistency`) re-baseline once, and we never pay the translation tax. **Guardrail:** the v4 migration is its own PR/preview with a single definition of done (`tsc` clean, prebuild 31/31, the six mockups visually unchanged at 1280 and 375, light-only theming intact since Atlas has no `.dark`). If anything in the bespoke `homepage-visual-tokens.css` / `atlas-pattern.css` cascade breaks, that is the moment to catch it, not three waves deep.

### D2. Supastarter integration: rebuild vs cherry-pick, and when

**Where we are.** Supastarter arrives *later*. It is a Next.js SaaS boilerplate (auth/billing/admin/marketing/i18n on shadcn + Tailwind v4, Supabase for DB+storage) with its **own** auth via better-auth. Our app already runs Supabase (`@supabase/ssr`, `@supabase/supabase-js`), Stripe, Sentry, the 11 page types, the visx kit, the locked section system, and 31 prebuild gates. The 11 public page types are the product; auth/billing/admin are not yet built here.

**Options.**
- **(A) Rebuild the app *on* Supastarter** (Supastarter becomes the new root; we move our pages/components/gates into it).
- **(B) Cherry-pick Supastarter's shell/admin/billing/i18n *into* the current app** (keep our app as the root; lift in only the SaaS plumbing we lack).
- **(C) Hybrid: keep the public marketing/data site as-is, mount the authenticated SaaS surface (account/billing/admin) as a separate route group seeded from Supastarter.**

**Recommendation: (B), cherry-pick, executed as a LATER wave AFTER the visual upgrade ships; treat Supastarter as a parts donor, not a new foundation.** Specifically the (C) flavor of (B): lift the auth/billing/admin/i18n route groups in as an additive `(app)` segment alongside the existing public pages, never rehoming the public pages under Supastarter's structure.

**Reasoning.** Our public pages *are* the differentiated product: the honesty gates, the visx kit, the section constitution, the data pipeline, the 31 prebuild checks. None of that exists in Supastarter and all of it would have to be re-threaded through a rebuild, with every URL slug at risk (slug renames are a hard constraint, and SEO is the business). A rebuild also adopts better-auth as the auth system, which would sit *beside* our existing Supabase usage and could fork session handling, RLS assumptions, and the Supabase client wiring we already depend on; that is a large, error-prone surface to reconcile under a "zero errors" mandate. Cherry-picking inverts the risk: we take only the pieces we genuinely lack (billing UI, admin, i18n scaffolding, the marketing shell components if better than ours) and graft them onto a foundation whose gates already pass. **Timing is the key rework-minimizer:** because we are choosing v4 now (D1) and Supastarter is v4-native, the framework will already match when Supastarter lands, so the integration is component-and-route work, not a framework reconciliation on top of an auth migration on top of a port. Doing the visual upgrade first also means the design system and token map are settled before Supastarter's shadcn components arrive, so we re-skin its blocks through the *same* one-token-map (D4) we will have already proven on nine block families. **Sequencing rule to bank now:** finish and ship the visual upgrade -> then integrate Supastarter additively -> never block a visual wave waiting on Supastarter, and never let Supastarter's opinions (its auth, its file layout, its theme defaults) overwrite a settled public-page decision. If better-auth is ever adopted, it is its own isolated migration with its own gate run, decided when Supastarter is actually in hand, not pre-committed here.

### D3. Install-all-blocks-up-front vs install-per-page

**Options.**
- **(A) Install every candidate block up front** (the Wave-0 list: hero2, stats-card1, feature43, pricing2, cta10, navbar1, footer7, chart-card1, data-table1, plus everything specs 02-07 might reference).
- **(B) Install per page/per wave**, pulling each block only when the wave that needs it begins.
- **(C) Install-to-study up front into a scratch location, then promote per wave** (fetch the markup early to learn it, but only land a block in the real tree when a wave consumes it).

**Recommendation: (C), the study-early / promote-per-wave hybrid.** Fetch the confirmed Wave-0 slug set once into a throwaway `_scratch/blocks-study/` (gitignored) so we can read exact markup while planning, but only run `npx shadcn add @shadcnblocks/{slug}` into the real tree at the wave that uses the block, and only for the slugs that wave actually consumes.

**Reasoning.** The plan's own method is "fetch the block to study its exact markup, then hand-port faithfully," so we need early access to markup, that part favors up-front. But *landing* every block up front pollutes the tree with components no page imports yet, inflates the surface that `verify_hardcoded_hex` / `verify_typography_consistency` / `tsc` must scan, and risks dead code shipping. Pure per-wave (B) loses the cross-wave consistency benefit of seeing the whole block vocabulary before committing to the first one. (C) gets both: study the full vocabulary in Wave 0, but each wave's PR adds only the blocks it renders, each immediately tokenized and prop-driven before commit, so every installed block is live, themed, and gated the moment it exists. The Wave-1 (Cell) flagship intentionally leans hardest on the visx kit rather than blocks, so the first block-heavy install is actually Wave-2 (Home), giving us a clean foundation wave to validate the install-and-tokenize loop on chart-card1/stats-card1 before the marketing blocks arrive.

### D4. Where installed blocks live, and how they stay prop-driven and token-themed

**Options for location.**
- **(A)** Let `npx shadcn add` drop them at its default and import from there.
- **(B)** A dedicated `src/components/blocks/` namespace, mirroring the existing `src/components/kit/` and `src/components/ui/` split.

**Recommendation: (B) `src/components/blocks/`, and treat every installed block as a starting-point to be *adapted into a prop-driven, token-only Atlas component*, never imported raw at the page level.**

**Reasoning.** The repo already has a clean three-tier component grammar: `ui/` (shadcn primitives), `kit/` (the bespoke Atlas viz + section components, including the visx `kit/charts/`), and the page renderers. Installed blocks are a fourth, distinct category and deserve their own namespace so provenance is obvious and the gates can reason about them. The discipline that keeps them safe:
- **Token-only on arrival.** Because the one-token-map already drives `--background/--foreground/--primary/--chart-1..5/--radius`, a freshly installed block inherits the warm Atlas skin with zero color edits, *provided* it reads only shadcn semantic vars. The install step's acceptance check is exactly the `verify_hardcoded_hex` gate: any raw hex/px/ms the block ships with is rewritten to a token before commit. No block lands with a literal color.
- **Prop-driven, no inline copy.** Blocks ship with hardcoded demo strings and arrays. Each is refactored so all content arrives via props/typed data, with `nullable-in / silence-out` semantics matching the kit, so the same block renders filled, exemplar, or the calm `SectionEmpty` placeholder. Page renderers pass data; blocks never embed it.
- **Charts stay ours.** shadcnblocks has no honesty-railed charts, so any block that *contains* a chart is stripped to its card/layout chrome and the data core is filled by the existing visx kit (re-skinned, not replaced). The 76 shadcn v4 charts remain a *style cookbook* (gradient defs, tickless axes, ChartContainer theming) we borrow recipes from, not drop-in components. This keeps RangeStrip, Waterfall, ScoreBand, the seasonality area, etc. as the single source of charted truth.
- **`"use client"` discipline.** Any block or chart with interactivity is wrapped client-side so the SSR data pages still prerender, preserving the server-renderable rule.

### D5. Deploy / preview strategy

**Constraints.** No local browser to show the founder (hard preference: too slow, hated). All work on `reform-v2/r6-forward`. Nothing to production without the founder's nod. Windows parallel-prebuild concurrency must stay <=4.

**Recommendation: one Vercel preview deployment per wave, off `reform-v2/r6-forward`, as the founder's review surface; local verification is gates-plus-static-export only, never a live local browser walkthrough for the founder.**

**Reasoning.** Vercel previews are the sanctioned way to let the founder "SEE it" without a local dev server, and they match the Verification Protocol's "preview -> founder nod -> promote" loop. Per-wave (not per-commit-spam) keeps the review cadence aligned to the wave structure and gives one stable URL per page type to react to. Our own verification before requesting a preview stays local and headless: `npx tsc --noEmit`, `npm run prebuild` (31/31, concurrency capped at 4 on Windows), `verify_page_sections` + `verify_section_order`, and where a visual check is needed we produce a static export the founder opens himself rather than driving a browser for him. Production stays untouched: previews accumulate on the branch, and only after the single cohesive sign-off does anything promote. This also means a broken wave never reaches prod and the rollback is just "don't promote that preview."

### D6. Preserving the data-honesty gates while swapping in shadcnblocks chrome

This is the highest-stakes correctness concern, because the blocks bring *visual* opinions and our honesty rules are *structural and semantic*. The swap must be chrome-only.

**Recommendation: treat shadcnblocks as cosmetic shells that wrap, but never bypass, the existing honesty machinery; the gates run unchanged and are the acceptance bar for every wave.** Concretely:
- **Section order and presence are untouchable.** Blocks fill the slots defined by `src/lib/page-sections.ts` and `src/lib/page-layout/section-order.ts`; a block is a *presentation* of a locked section, never a new section or a reorder. `verify_page_sections` and `verify_section_order` must stay green, so changing what sections exist still requires editing the constitution doc first. A pretty block cannot smuggle in a section the constitution does not list, and cannot let a page self-omit one (every section is always present, filled or calm-placeholder).
- **The honesty boundary rides on data, not chrome.** Real / London-UK-exemplar / calm placeholder is decided by the data layer's nullable-in/silence-out, upstream of the block. A block given null content renders the calm "still filling in" strip, never a fabricated real-looking number. The `moneyShown` gate, the trusted-local link-gate, "never rank across business x geography," "cities are the only scored entity," and "districts never vs whole cities" are all enforced in the data/render-guard layer and in the prebuild gates, all of which run regardless of which block draws the box.
- **Charts keep their rails because they stay ours (D4).** Since the honesty-railed charts remain the visx kit, the cross-currency caveat, no-pie, direct-labels, tabular-numerals, and filled+empty rules survive the re-skin intact.
- **Lexical gates apply to block-sourced strings.** `verify_no_em_dashes`, `verify_no_source_agencies`, and `verify_no_internal_notes` scan installed blocks too, so any demo copy that ships with an em-dash or a source-agency name is caught before commit.

The net rule: a block can change how a section *looks*; it can never change what a section *claims* or whether it is *allowed to claim it*. If a gate fails after a block lands, the block adapts to the gate, never the reverse.

### D7. Ambitious-but-safe enhancements worth considering

Each weighed against the zero-error mandate and the no-local-browser constraint.

- **Visual-regression harness, RECOMMEND (lightweight version).** A small Playwright-screenshot diff that captures the six canonical page types at 1280 and 375 per preview and diffs against an approved baseline. This is the highest-leverage addition: it is exactly the automated guard against *graphical* regressions that "zero errors of any kind (graphical...)" demands, and it runs headless in CI/preview, so it never violates the no-local-browser-for-the-founder rule (it shows *us* diffs, the founder still reviews the live preview). Keep it small: six pages, two widths, baseline updated only on founder sign-off. Avoid a heavy cloud-snapshot service for now.
- **Storybook / component catalog, RECOMMEND a thin route-based catalog, NOT full Storybook.** Full Storybook is a second build system, a v4/Next-15/React-19 compatibility surface, and ongoing maintenance, disproportionate to an 11-page-type site. Instead extend the existing dev-route pattern (there is already a `/dev/charts` showcase precedent) into a `/dev/catalog` that renders each adapted block in filled / exemplar / empty states. It reuses the real app's build, tokens, and gates (so it cannot drift from production behavior), costs almost nothing, and doubles as the install-and-tokenize verification surface for D3/D4. These dev routes must be excluded from production routing/sitemap.
- **Motion polish, RECOMMEND minimal and token-bound; default OFF for decoration.** `motion` (Framer) v12 is already a dependency. The design law bans decorative animation, so the recommendation is: no entrance/scroll-reveal theatrics, only functional micro-motion (focus, disclosure, tab transitions) using token-bound durations/easings (no raw `ms` in components), all gated by `prefers-reduced-motion`. This adds polish without tripping the "can it be quieter" lead-designer test or the no-decorative-animation rule.
- **Accessibility automation, RECOMMEND.** Fold an axe-core pass into the same preview check that runs the visual-regression diff, asserting WCAG AA and 375px no-horizontal-scroll programmatically rather than by eye. This directly serves the "zero accessibility errors" goal and is cheap to bolt onto the existing headless harness.
- **Performance budget, RECOMMEND a soft budget, not a blocking gate yet.** Track bundle size and the existing `verify_edge_function_sizes` postbuild check; add a soft per-page JS-size watch so a heavy block install is visible before it becomes a regression. Keep it advisory during the port to avoid blocking waves on tuning; harden it to a gate before the production promote.
- **Design-token contract test, RECOMMEND (cheap insurance).** A tiny test asserting the one-token-map's keys exist and resolve (every `--chart-1..5`, the semantic set, `--radius`) so a v4 migration or a Supastarter theme import can never silently drop a token the whole block library depends on. This is the structural backstop for D1 and D4.

### D8. Risks, mitigations, and rollback

All work is on `reform-v2/r6-forward`; nothing reaches production without the founder's nod, so the ultimate rollback for every risk below is "do not promote the preview," and the branch can always be reset to the last green wave commit.

| # | Risk | Likelihood / impact | Mitigation | Rollback |
|---|------|---------------------|------------|----------|
| R1 | Tailwind v4 migration breaks the bespoke cascade (`homepage-visual-tokens.css`, `atlas-pattern.css`, the `tabular-figures` layer, the `shadow-*`/`--radius` chain). | Med / High | v4 as an isolated first PR (D1); token-contract test (D7); the six mockups as a before/after visual baseline; keep `@config` bridge available so the JS token config can stay alive during transition. | Revert the single v4 commit; the branch returns to v3 with zero block work lost (blocks come after). |
| R2 | An installed block ships raw hex/px/ms or hardcoded copy that slips a gate. | Med / Med | Install-then-tokenize is a single atomic step per block; `verify_hardcoded_hex` + the lexical gates are the install acceptance bar (D4, D6); `blocks/` namespace makes provenance auditable. | Block adapts to the gate or is dropped for that section; no page-level dependency on a raw block, so removal is local. |
| R3 | A block silently violates the honesty boundary (renders a real-looking number where data is null, or implies a banned comparison). | Low / Critical | Honesty lives in the data layer, not the block (D6); nullable-in/silence-out; `moneyShown`, cross-geography, section-presence gates run unchanged; visual-regression + manual founder review catch the rest. | Restore the kit/`SectionEmpty` rendering for that slot; the block is chrome-only so reverting is a one-line swap. |
| R4 | Charts lose their honesty rails when re-skinned. | Low / High | Charts stay the visx kit (D4); shadcn charts used only as a style cookbook; chart contract preserved (no-pie, cross-currency caveat, filled+empty, tabular). | Charts were never replaced, so there is nothing to roll back; re-skin is CSS-token-level and revertible. |
| R5 | Supastarter integration forces slug renames, an auth fork (better-auth vs our Supabase), or a framework reconciliation. | Med / High | Cherry-pick additively, later, after v4 and after the visual ship (D2); never rehome public pages; better-auth adoption is a separate gated decision made with Supastarter in hand. | Supastarter pieces land in an isolated `(app)` route group; if integration misbehaves, drop that group, the public site is untouched. |
| R6 | Windows parallel-prebuild exceeds concurrency 4 and flakes the gate run. | Med / Low | Cap `prebuild_all.ts` concurrency at 4; `prebuild:serial` exists as a deterministic fallback for diagnosing a flaky parallel run. | Run `prebuild:serial`; no rollback needed, it is a verification-path issue, not a code change. |
| R7 | Scope creep / the AI invents visuals beyond the approved mockups. | Med / High | The mockups are the contract; every wave hand-ports the approved composition 1:1; the four lead-designer questions and the per-wave founder preview are the stop-gate; visual-regression baseline anchors "approved." | Iterate the single wave file back to the approved mockup; only one page type is ever in flight per wave. |
| R8 | A wave passes gates but reads as off / cringe / too loud to the founder. | Med / Med | Per-wave preview + founder reaction loop (closer/off, bolder/quieter) built into the cadence (D5); hardest-and-exemplar-first ordering proves the system on the richest page before the rest. | Iterate that wave only; later waves inherit the corrected foundation, so a fix compounds forward rather than requiring rework. |
| R9 | Token drift between the static mockups, globals.css, and a future Supastarter theme. | Low / Med | One-token-map is the single source of truth (D4); token-contract test (D7); Supastarter's theme is mapped onto our tokens, never the reverse. | Re-point any drifted consumer back to the canonical token; the map is the only place values live. |
| R10 | Dev catalog / scratch study blocks leak into production routing or bundle. | Low / Med | `_scratch/blocks-study/` gitignored; `/dev/*` catalog routes excluded from sitemap/robots and verified absent from the production build. | Remove the dev route; it was never linked from public pages. |

**Standing rollback posture:** every wave is one commit (or a tight commit run) behind a preview URL; the founder reviews the preview; only after the single cohesive sign-off does the whole branch promote. Until then, any wave can be reverted in isolation, the v4 foundation can be reverted as one commit, and the public production site is never the thing being changed. The plan is built so that the worst realistic outcome of any single decision is "reset the branch to the last green wave and try that one page again," not a production incident.
