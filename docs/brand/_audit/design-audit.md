# Design audit: the Margin Atlas design-tool exports (2026-06-12)

Audit of the designed page components and design docs in the design-tool export sets under
`docs/brand/assets/incoming/Margin-Atlas*/`, read against the brand
(`docs/brand/brand-identity.md`), the content map
(`docs/superpowers/specs/2026-06-11-page-content-map.md`), the master plan
(`docs/superpowers/plans/2026-06-12-atlas-master-execution-plan.md`), the existing tokens
(`src/lib/design-tokens.ts`), and the design-system guidelines
(`docs/design-system/GUIDELINES.md`).

Purpose: extract the layout + hierarchy patterns, the per-page-type section designs, the
strongest components worth porting to the real `src/`, the off-brand bits to drop, and how the
designs map to the page-type content map. The brand is the source of truth; the exports are raw
material, not gospel.

---

## 0. What is in the exports, and which set to trust

There are 10 export sets. They split into two generations:

- **Base `Margin-Atlas` + `--1..--5` (the asset + component generation).** Each set ACCRETES.
  The named design files (`homepage.jsx`, `dense-cell-hero.jsx`, `cell-page-sections.jsx`,
  `comparison-pages.jsx`, `comparison-primitives.jsx`, the V2 `.tsx` components, the design
  `.md` docs, the cartographic-motif SVGs) live at the ROOT of each set folder, not in `src/`.
  `Margin-Atlas--5` is the most complete: it is the only set that carries `atlas-components.css`,
  `atlas-spots.svg`, `atlas-pictograms.svg`, and the full implemented-TSX tree under `src/`
  (real, token-using versions of DenseCellHero, the comparison pages, the empty states, mobile
  bundle, newsletter, billing). Use `Margin-Atlas--5` as the canonical reference; fall back to
  the base set only for the design `.md` docs (HOMEPAGE / DENSE_CELL_HERO / COMPARISON /
  EMPTY_STATES), which are identical across sets.
- **Sets `--17..--20` (later page-design iterations).** Same file names, later visual passes.
  Per the standing memory note (`project_visual_ports_stale.md`) sets 17-20 are pre-refactor and
  must NOT be ported from directly (they regress the repo). Treat them as inspiration only; do
  not lift code.

**Already-ported status (important):** much of the strongest material is ALREADY in the real
repo. `src/components/DenseCellHero.tsx` exists (299 lines, the set-5 component, already retoned
to the real vermillion token). `src/components/v2/` already contains `CityHeroV2`,
`CountryScorecardV2`, `CoverageHubV2`, `FeaturedCardV2`, plus `SectorCardV2` and `LondonRoadmap`.
`src/components/HomepageHero.tsx`, `HomepageEditorialBlocks.tsx`, `RotatingWords.tsx`,
`SectionDivider.tsx`, `empty/`, `mobile/`, `newsletter/` all exist. So this audit is less "port
these from scratch" and more "the porting drifted; here is what to keep, what to finish, and what
to drop."

---

## 1. The single biggest finding: two visual dialects, only one on-brand

The exports contain TWO incompatible visual systems. Reconciling them is the central job.

### Dialect A: the warm cartographic almanac (cream + ink + accent), the on-brand one
Used by `dense-cell-hero.jsx` / `DenseCellHero.tsx`, `cell-page-sections.jsx`, `homepage.jsx`,
`comparison-primitives.jsx`, `empty-states.jsx`, `atlas-components.css`, `atlas-reform.css`.

- Cream/parchment surfaces, warm ink text, one accent, serif display + tabular sans numbers,
  fine parchment rules, eyebrow-over-serif-H2 section heads. This IS the brand
  ("editorial magazine with cartographic heritage", "warm cream, ink, a rare stroke of
  vermillion, a distinctive serif").
- BUT the accent in these files drifted AMBER/TERRACOTTA, not vermillion. They hardcode
  `--atlas-700: #A55C00` / `#9A3412` and `--atlas-500: #D47706` / `#D7642E`. The brand and the
  real `design-tokens.ts` want VERMILLION: `atlas-500 = #e62200`, `atlas-700 = #991600`. The
  amber reads as a different brand. Every place these files say "amber editorial eyebrow" or
  use `#D97706` / `#D47706` / `#A55C00`, that is OFF-BRAND and must resolve to the real `atlas`
  token on port. (The already-ported `DenseCellHero.tsx` was correctly retoned to `text-atlas-700`
  on the way in, which is the proof this is the right move.)

### Dialect B: the white editorial newspaper (white + neutral gray + Newsreader + vermillion)
Used by `CountryScorecardV2.tsx`, `CityHeroV2.tsx`, `FeaturedCardV2.tsx`, `CoverageHubV2.tsx`,
`DecadeArticleLayout.tsx`, `BlogCoverCard.tsx`.

- Pure white `#FFFFFF` background, neutral grays `#3A3A3A` / `#E5E5E5` / `#DDDDDD`, Newsreader
  serif, vermillion `#D73A14` + maroon `#952509` as the accent, hairline dividers, drop-cap and
  CSS-counter article typography.
- This is genuinely beautiful and the vermillion accent is RIGHT, but the white-and-cold-gray
  canvas CONTRADICTS the brand's "Light, warm, paper-like (cream/parchment), not stark white".
  The grays are cold; the brand is warm. The right move is to keep the editorial STRUCTURE
  (hairlines, the serif-name-first scorecard, the drop cap, the numbered-section article) and
  re-skin onto the warm cream/ink token ladder. The real ports of these (`src/components/v2/*`)
  carry the white+gray canvas and the off-brand dot hexes inward; that is unfinished work
  (see section 6).

**Verdict:** Dialect A's PALETTE/SURFACE + Dialect B's EDITORIAL STRUCTURE, both retoned to the
real vermillion `atlas` token and the warm cream ladder, is the target. Neither export dialect is
shippable as-is.

---

## 2. Layout + visual-hierarchy patterns worth keeping (cross-cutting)

These recur across the exports and are on-brand. They map directly onto the master plan's Atlas
Page Kit.

1. **Eyebrow over serif-H2 over lede.** `SectionHeader` in `cell-page-sections.jsx`: a small
   uppercase tracked eyebrow (accent), then a `clamp()` display-serif H2, then a cocoa lede.
   This is the consistent section-head rhythm and matches `src/components/ui/section-eyebrow.tsx`.
   KEEP as the canonical section header; it satisfies "consistent section names across page types".
2. **Serif on H1 + the one hero number only; sans + `tabular-nums` everywhere else.** Stated
   explicitly in `DenseCellHero.tsx` ("Display serif lives only on H1 and the hero number"). This
   is the right discipline and matches the brand's "NOT a single highlighted hero number" caveat
   only loosely: the export DOES emphasize one hero number, which the content map wants softened
   ("numbers treated equally"). Keep the serif/tabular split; dial the hero-number size down so it
   anchors without shouting.
3. **The split number + suffix treatment.** `splitRevenue()` renders `$ / 387 / K / "a year"` as
   separately-sized spans (big number, smaller sign/suffix, italic serif "a year"). Elegant,
   reusable, already in the repo. KEEP.
4. **Percentile band with a log-positioned typical marker.** `DenseCellHero` lays Bottom-10 /
   Typical / Top-10 on a single hairline strip with the typical tick log-positioned and clamped to
   8-92%. This is the seed of the master plan's `RangeStrip`, but the export only shows 3 points.
   The content map and design layer demand **7 gradations** ("7 scales"). `atlas-components.css`
   `.rstrip` already implements the 7-segment version. PORT the 7-segment `.rstrip`, not the
   3-point band.
5. **Coverage chip = dot + word, top-right of the masthead.** Consistent across DenseCellHero,
   CityHeroV2, FeaturedCardV2, CountryScorecardV2, CoverageHubV2. KEEP the pattern; FIX the colors
   (section 6).
6. **Full but calm: generous max-width container (`max-w-6xl` / `mx-auto`), alternating
   cream-50 / parchment section backgrounds to chunk a long page.** Matches "pages are FULL and
   generous, kept calm by organization, not by hiding content." KEEP.
7. **Hairline dividers + the diamond rule.** `atlas-rule` with a center `◆` mark between homepage
   bands; thin parchment `h-px` dividers inside sections. On-brand cartographic restraint. KEEP.

---

## 3. Per-page-type section designs (what each export gives each page type)

### BUSINESS / CELL page (the flagship)
Strongest, most complete coverage. Maps cleanly to the content-map BUSINESS page.
- `DenseCellHero.tsx`: sector tag + flag + geo eyebrow, coverage chip, serif question H1,
  "Includes:" subniche line, hero number, percentile band, then a one-line stat strip
  (employees / median wage / net margin / Atlas Score). This is the `AnswerFirstMasthead` seed.
  GAP vs content map: no one-line honest VERDICT sentence, no `SubTypeSwitcher` mount, no
  count-up. The hero leads with the number, not the plain-English bottom line the content map
  wants first.
- `cell-page-sections.jsx` -> `WhereTheMoneyGoes` (stacked per-$100 bar + line-item table with
  share / amount / notes), `WhatPeopleEarn` (role pay table with per-row range bars and a median
  tick), `PeerCells` (3-up comparison cards: kind label, coverage, title, typical/margin/firms
  strip), `MethodologyBlock` (coverage tier, firms, last-updated, confidence, sources, improve
  CTA). These map to content-map items 6 (where the money goes), 9 (wages by role), 13 (same
  business nearby), and the methodology surface.
- `atlas-components.css` is the richest seam here: it has READY CSS for nearly every remaining
  Atlas Page Kit primitive the master plan lists: `.rstrip` (7-gradation RangeStrip), `.stack` +
  `.pnl` (MoneyGoesBreakdown per-$100), `.verdict` (the honest-take / reality-check callout with
  a star rate), `.twocol .yes/.no` (RightForWrongFor), `.glance` (at-a-glance strip), `.gauge` +
  `.sbars` + `.seg10` (Atlas Score), `.kpis` (KPI band), `.callout` (methodology / freshness),
  `.feat` (featured insight), `.ccard` (country scorecard), `.ctbl` (like-for-like comparison
  table with a `.win` column highlight), `.tiers` (pricing). This single file is the highest-value
  artifact in the whole export for Phase 0.2.
- MISSING vs the content map (none of the exports build these): the plain-English verdict line,
  `PlainTerms` ("about 320 coffees a day"), break-even survival line, itemized startup cost,
  seasonality, realistic first year, `GutCheck` 3-question, `SubTypeSwitcher`, `OperatorVoices`,
  `LocalEdge` / `ContrarianInsight` / `MythVsReality`, `FlagIt`, `FreshnessStamp`. The exports
  give the data-display furniture; the brand/voice through-line elements are not designed yet.

### COUNTRY page
- `CountryScorecardV2.tsx`: flag + serif name, tier chip, ONE editorial blurb that frames what
  Atlas can and cannot answer (tiered by coverage), a 3-stat row (industries / cities / year
  range), then two parallel deep-link columns (top industries, top cities), and a methodology
  link. Clean, honest, answer-first. Maps to the country page's hero + decisive-read + cities.
  GAP: none of the new content-map country sections (compare-to-neighbours, how-hard-to-hire +
  min-wage, how-long-to-get-going steps/days) are designed. Country is "architecture-first /
  placeholder-friendly" per the build rule, so this is expected; the scorecard is a good shell.
- `comparison-primitives.jsx` `DivergentBars` (the butterfly chart) is the design for
  "compare to neighbours" when it is built.

### CITY page
- `CityHeroV2.tsx`: country line, serif city name, editorial blurb, a 4-stat hairline row
  (population / metro GDP / median wage / SMB density), a typical-revenue anchor + coverage chip,
  and a square duotone editorial photo on the right (grayscale + vermillion multiply). Maps to the
  city masthead + "the board". NOTE: the duotone photo treatment conflicts with the memory note
  `project_visual_ports_stale.md` lineage and with the already-shipped Task A ("drop city masthead
  photo filter") -- the heavy filter was deliberately removed in the real city page. Do not
  re-introduce the duotone. GAP: the new city sections (local customer / commercial rent / tourist
  vs local / best areas / how-it-is-changing) are not designed here.

### INDUSTRY page
- `comparison/IndustryComparisonPage` (referenced in COMPARISON.md, in set-5 `src/`) +
  `DivergentBars` give the "where this earns most across comparable cities" ranked view. The
  "what a typical one looks like" section is not separately designed; reuse the cell hero's
  TypicalFirmCard shape (already in the real repo as `TypicalFirmCard.tsx`).

### NEIGHBOURHOOD page
- Not directly designed in the audited files. `atlas-components.css` `.ctbl` (adjacent-area
  like-for-like) and `.glance` cover the "compare to adjacent" and "how pricey to operate" rows.
  Build from the kit.

### LEARN page
- `DecadeArticleLayout.tsx` is the long-form template: series eyebrow, serif title, italic deck,
  hairline byline, cover frame, drop-cap first paragraph, CSS-counter numbered `<h2>` sections,
  blockquote with accent left-rule, figure + figcaption, related-in-series list, newsletter slot.
  Excellent editorial bones for Learn / "Decade of" / "from the notebook". This is the best
  structural artifact for any prose page. PORT the structure, re-skin to warm tokens, swap the
  inline `<style>` block for tokenized CSS.
- `BlogCoverCard.tsx`: hand-drawn line-art SVG covers (Tokyo counter, Paris jewellery, NYC taxis)
  with a cream fade, a vermillion READ tag, serif title. On-brand "documentary line-art" feel and
  a strong original device. The art is bespoke per-post (not scalable to every cell), so treat it
  as a curated editorial flourish, not a system primitive.

### COMPARE page
- `comparison-primitives.jsx`: `SplitHero` (two halves + a VS pill on a diagonal seam; solid
  variant for countries/industries, photo variant for cities), `StatBand` / `StatRow` (side-by-side
  values with a delta chip and a win arrow), `DivergentBars` (the butterfly), `EditorialBlock`
  ("what this means"), `CrossLinkRibbon` ("keep comparing"). COMPARISON.md ties all four comparison
  page types to this one shared visual language. The content map explicitly wants "where each one
  WINS, balanced, never this-one-is-bad"; the export's win-arrow + delta chip is fine, but the
  divergent bars must be capped to like-for-like (one axis constant) and must never imply an
  absolute ranking. KEEP the primitives; enforce the like-for-like + no-shaming guard already
  built for the homepage.

### EMPTY STATES
- `empty-states.jsx` + EMPTY_STATES.md: `CellDataMissingEmpty` (honest "we don't have X for Y yet"
  + nearest-covered fallback chips), `SectorUnderConstructionEmpty` (corp_only / mixed_caution,
  hatched parchment bg signalling "by design"), `ComingSoonPlaceholderCard` (silent, no CTA),
  `PageNotFoundRedesign` (big 404 + six escape-hatch tiles + report-broken-link). Calm, honest,
  no exclamation marks, no startup voice. Already ported to `src/components/empty/`. This bundle is
  on-brand and matches the "admit gaps honestly" + "see something off? flag it" brand moves. KEEP.

---

## 4. The strongest components worth porting to `src/` (ranked)

1. **`atlas-components.css` (set 5) -- the single highest-leverage artifact.** It is a near-complete
   stylesheet for the Atlas Page Kit: range strip (7-gradation), per-$100 cost stack + P&L list,
   verdict callout, for-you/not two-column, at-a-glance strip, score gauge + sub-bars + seg-10,
   KPI band, comparison table with win-column, country scorecard, pricing tiers, featured card,
   callout. It correctly assigns the two accents their jobs: **vermillion = spotlight / typical /
   leader, moss = profit / kept / positive** -- which exactly matches the real `colors.moss` +
   `colors.atlas` intent. PORT the patterns as tokenized React primitives into `src/components/ui/`
   (do NOT ship raw CSS classes; translate to `cva` + tokens per GUIDELINES). This is the bridge
   from "exports" to the master-plan kit.
2. **`DenseCellHero` -- already in `src/`.** Keep; finish it toward `AnswerFirstMasthead` (add the
   verdict line, the SubTypeSwitcher mount, soften the hero number, the count-up).
3. **`DecadeArticleLayout` -- the prose template.** Port structure, re-skin to warm tokens,
   tokenize the embedded CSS.
4. **The comparison primitives (`SplitHero`, `StatBand`/`StatRow`, `DivergentBars`,
   `EditorialBlock`, `CrossLinkRibbon`).** Port as the shared comparison kit; the real repo already
   has a `comparison/` folder to receive them.
5. **`cell-page-sections` (WhereTheMoneyGoes, WhatPeopleEarn, PeerCells, MethodologyBlock).** Port
   the layouts; back them with the kit primitives from #1 so they share one visual language rather
   than re-rolling inline-styled tables.
6. **The empty-state bundle -- already in `src/components/empty/`.** Keep.
7. **`CountryScorecardV2`, `CityHeroV2`, `FeaturedCardV2`, `CoverageHubV2` -- already in
   `src/components/v2/`.** Keep the structure; FINISH the token migration (section 6).
8. **The cartographic-motif SVGs** (`atlas-grid`, `atlas-crosshatch`, `atlas-pinstripe`,
   `atlas-rosette`, `atlas-columns`, `atlas-accent`, `atlas-pattern`) + the homepage decorative
   primitives (`.atlas-dot-grid`, `.atlas-spotlight`, `.atlas-editorial-line`, `.atlas-pipeline`,
   `.atlas-rule`). These deliver the "subtle cartographic motif running quietly across every page"
   identity device. PORT the ones that survive a retone to cream/vermillion into
   `src/styles/homepage-visual-tokens.css` (which already exists and is the documented home for
   decorative primitives). Use sparingly per the brand's restraint.
9. **`atlas-icons.svg` + `atlas-pictograms.svg` + `atlas-spots.svg`** (set 5): the line-icon system,
   the business-category pictograms, the editorial spot illustrations. These are Track B assets.
   Integrate opportunistically as bundles, keep them tokenized vermillion-on-ink.

---

## 5. Off-brand bits to DROP or fix before any port

1. **The amber/terracotta accent drift.** Every `#A55C00` / `#9A3412` / `#D47706` / `#D7642E` /
   `#D97706` in `atlas-reform.css`, `cell-page-sections.jsx`, `homepage.jsx`, `dense-cell-hero.jsx`
   must become the real `atlas` vermillion token (`atlas-700 #991600` / `atlas-500 #e62200`). The
   brand is vermillion, not terracotta. This is the most pervasive fix.
2. **The cold white + neutral-gray canvas** of the V2 / editorial components (`#FFFFFF`,
   `#3A3A3A`, `#E5E5E5`, `#DDDDDD`). Replace white with cream (`cream-50/100`), grays with the
   warm `ink` / `cocoa` ladder, hairlines with `parchment`. The brand is warm paper, never stark
   white.
3. **Hardcoded coverage-dot hexes** (`#1F8A4C` green, `#2563EB` blue, `#B45309`/`#D73A14` amber)
   in CityHeroV2 / FeaturedCardV2 / CountryScorecardV2 / CoverageHubV2. `design-tokens.ts` has a
   canonical `tier` scale (vermillion-saturation = confidence, draining to cocoa) that EXPLICITLY
   states it "retires the v2 components' hardcoded blue dot." The green/blue tier dots are
   off-brand (the brand allows ONE secondary, moss, with a fixed positive job, not a blue/green
   tier palette). Migrate all coverage/tier dots to `colors.tier` + `src/components/ui/tier-dot.tsx`
   (which already exists).
4. **The city masthead duotone photo** (grayscale + vermillion multiply) in `CityHeroV2`. Conflicts
   with shipped Task A ("drop city masthead photo filter"). Do not re-introduce a heavy filter.
5. **The "amber editorial eyebrow" framing** in COMPARISON.md and the inline
   `.atlas-editorial-line { background: #D97706 }` left-rule. Retone to vermillion. The class is
   already defined in the real `homepage-visual-tokens.css`; align both to the token.
6. **The single dominant "hero number"** emphasis. The content map and design layer say numbers
   are treated EQUALLY and there is NOT a single highlighted hero stat per page. The exports lean
   into one big hero number (DenseCellHero, FeaturedCardV2). Soften: keep a confident anchor, not a
   giant shout, and let the range strip + per-$100 stack carry equal weight.
7. **Inline-styled `.jsx` prototypes** (`SEC_TOKENS` objects, `style={{}}` everywhere, `window.X`
   globals, `onMouseEnter` color swaps). These are prototype-runtime artifacts, NOT shippable. On
   port, every value becomes a token, every component becomes `forwardRef` + `cva` + `displayName`
   per GUIDELINES, hover states become Tailwind/`transition-colors`, and headings become real
   `<h2>/<h3>` (some prototypes use styled `<p className="display">` for headings -- the GUIDELINES
   §7.1 "styled div headline" anti-pattern).
8. **Phosphor `@phosphor-icons/react` dependency** assumed across the exports. The real repo has
   its own `src/components/icons/` + `SectorIcon`. Prefer the existing icon layer; do not add a new
   icon dependency just to match the export.
9. **Sets `--17..--20`** wholesale: do not port code from them (stale, pre-refactor, regressive).

---

## 6. The concrete unfinished-port finding (actionable now)

The V2 editorial components were ported into `src/components/v2/` but the token migration was left
half-done. `src/components/v2/CityHeroV2.tsx` (and its siblings) STILL hardcode the off-brand
coverage dots:

```
const COVERAGE: Record<CoverageTier, { dot: string; anchor: string }> = {
  measured: { dot: "#1F8A4C", anchor: "measured" },
  regional: { dot: "#2563EB", anchor: "regional" },
  estimated: { dot: "#B45309", anchor: "estimated" },
};
```

`design-tokens.ts` already declares the canonical replacement (`colors.tier.deep/good/starter/modeled`)
and an unused `src/components/ui/tier-dot.tsx` primitive, and the token comment says this scale
retires exactly these hardcoded dots. So the fix is mechanical and overdue: swap the four v2
components' inline dot hexes for `colors.tier` (or `<TierDot>`), and swap their white/gray canvas
for the cream/ink ladder. This closes the gap between the shipped-but-drifted ports and the
brand-correct tokens. It is also a GUIDELINES §7.2 ("inline hex codes") violation living in the
repo today.

---

## 7. How the designs map to the content-map page types (summary table)

| Content-map page type | Export design artifact(s) | State | Biggest gap |
|---|---|---|---|
| BUSINESS / CELL | DenseCellHero, cell-page-sections, atlas-components.css | Hero + data furniture ported; kit CSS not yet primitives | verdict line, PlainTerms, break-even, startup cost, seasonality, first-year, GutCheck, SubTypeSwitcher, voice/through-line elements |
| COUNTRY | CountryScorecardV2, DivergentBars | Scorecard ported (drifted tokens) | new sections are placeholder-phase (compare-neighbours, hire, time-to-open) |
| CITY | CityHeroV2 | Ported (drifted tokens, duotone to drop) | local-customer, rent, tourist-vs-local, best-areas, changing |
| INDUSTRY | IndustryComparisonPage, DivergentBars, TypicalFirmCard | Comparison shell exists | typical-operator + earns-most-ranked sections |
| NEIGHBOURHOOD | atlas-components.css (.ctbl, .glance) only | Not designed | whole page; build from kit on neighborhood_flavor_v1.json |
| LEARN | DecadeArticleLayout, BlogCoverCard | Strong prose template (drifted tokens) | worked-example P&L, related-trades, live-benchmark link |
| COMPARE | comparison-primitives (SplitHero/StatBand/DivergentBars/EditorialBlock/CrossLinkRibbon) | Primitives designed | enforce like-for-like + no-shaming; where-each-wins copy |
| EMPTY / 404 | empty-states bundle | Ported, on-brand | none |

---

## 8. Recommended order of operations (feeds Phase 0.2 of the master plan)

1. Translate `atlas-components.css` (set 5) into tokenized `src/components/ui/` primitives, in this
   order, because they unblock the flagship: `RangeStrip` (the 7-gradation `.rstrip`),
   `MoneyGoesBreakdown` (`.stack` + `.pnl`), `HonestTakeBox` (`.verdict`), `RightForWrongFor`
   (`.twocol`), the Atlas Score gauge (`.gauge`/`.sbars`), the like-for-like comparison table
   (`.ctbl` with the win column). Catalog each in `src/app/_design/` before use.
2. Finish the V2 token migration (section 6): tier dots -> `colors.tier`, canvas -> cream/ink.
3. Port `DecadeArticleLayout` structure, re-skinned to warm tokens, for Learn.
4. Port the comparison primitives behind the existing `comparison/` folder, with the like-for-like
   guard.
5. Bring the cartographic-motif SVGs + decorative primitives into
   `src/styles/homepage-visual-tokens.css`, retoned, used sparingly.
6. Everything inherits the real `design-tokens.ts` (vermillion + cream + moss). No raw hex, no
   em-dashes, no source-agency names, real `<h2>` headings, `cva` + `forwardRef` per GUIDELINES.

The exports gave Atlas a complete, beautiful set of DATA-DISPLAY furniture and one excellent prose
template. What they did NOT design is the brand/voice through-line (honest-take, gut-check,
plain-terms, operator-voices, flag-it, freshness). The CSS for the honest-take/verdict and
for-you/not boxes exists in `atlas-components.css`; the COPY and behavior do not. That is the real
remaining design work, and it is exactly what the master plan's Phase 0.2 kit is for.
