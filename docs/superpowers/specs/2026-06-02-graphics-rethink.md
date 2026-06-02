# Graphics rethink + new-file placement (2026-06-02)

Status: review draft. No live render changed. A review surface was built at
`/_design/v2-review?key=<ADMIN_KEY>`. This doc is the thinking behind it.

## TL;DR

Two questions were asked: can the new files be added somewhere, and how should the
whole-page graphics be rethought.

1. **New files: nothing ships as is.** All 8 net-new export files are skip or phase-2
   (redundant, or a hard-ban violation, or a palette conflict). The 6 idle `v2`
   components are visually strong but carry the same two defects: hardcoded hex and a
   blue tier dot that is off the warm palette. None is a free win.
2. **The real win is not a component, it is a pattern.** The v2 set is valuable as
   evidence of a sharper editorial style (display headings, tier dots, hairline stat
   rows). The forward move is to lift those into a small set of tokenized primitives and
   a single warm tier-color scale, then apply them across the live surfaces. That fixes
   the root cause (ad hoc colors, inconsistent rhythm) instead of bolting on one screen.

## Root cause finding (the thread that ties it together)

There is no canonical tier-color scale in `design-tokens.ts`. So each surface invents
its own. The live pages lean on amber + moss + clay; the v2 components hardcode
`#1F8A4C` green, `#2563EB` blue, `#D73A14` vermillion, `#3A3A3A` graphite. The blue is
the visible symptom of a missing token, not a one-off mistake. Fix the token and the v2
components become shippable and every future surface stays on brand by default.

Proposed addition to `src/lib/design-tokens.ts` (additive, nothing consumes it yet, so
it is safe to land on its own):

```
tier.deep    -> atlas-700  (measured, primary)
tier.good    -> atlas-500  (regional)
tier.starter -> clay-500   (thin)
tier.modeled -> cocoa-700  (estimated)
```

All warm, all already in the palette. The blue and green get retired. Every tier dot,
scorecard badge, and coverage chip then reads from one place.

## Part 1: new files, the verdict

| File (export unless noted) | What it is | Verdict | Why |
|---|---|---|---|
| `RolePay.tsx` | pay by role | SKIP | Salary by role. Hard founder steer against salary content. |
| `MethodologyBlock.tsx` | methodology meta | SKIP | Takes a `sources` string. Risks naming source agencies (gate `verify_no_source_agencies`). `/about-data` already covers it. |
| `CostStructure.tsx` | P and L stacked bar | SKIP | Redundant. Live `SmartWaterfall` is a richer 13-line waterfall with confidence dots. |
| `PeerCells.tsx` | peer grid | PHASE 2 | Needs a peer fetch layer and a browse page that does not exist. Revisit if a peer page is greenlit. |
| `BlogCoverCard.tsx` | blog covers | SKIP | Demo-hardcoded SVGs for 3 fixed slugs. Cannot be data driven without a rewrite. |
| `DecadeArticleLayout.tsx` | longform | SKIP | Superseded by the live `editorial/LongformArticle.tsx` in Atlas tokens. |
| `styles/atlas-reform.css` | texture + palette | SKIP | Redefines `--atlas-*` with a conflicting terracotta palette under the same names. Would repaint the site. |
| niche districts HTML mockup | district markers + persona cards | PHASE 2 | Clever vocabulary, but demo-only and styled by the conflicting CSS. Rebuild in Atlas tokens if a niche-signals surface is greenlit. |

One genuine idea is buried in the last row: a **niche-signals / neighborhood-persona**
treatment for the cell or neighborhood page. It is not a file to add; it is a feature to
design fresh if wanted.

## Part 2: the v2 components, per-component fix list

All six already live in `src/components/v2`. Live preview of four is at
`/_design/v2-review`. To promote any, do these fixes first, then wire behind a before
and after on its route.

| Component | Replaces (live) | Fix list before it can ship |
|---|---|---|
| `CountryScorecardV2` | `CountryAtAGlance` + `CountrySignaturePanel` on `/[country]` | tokenize 8 hex values; swap blue tier dot for `tier.good`; it self-renders from props so it would need a small server wrapper that feeds it `getCountryEconomicsSnapshot` data. Strongest candidate. |
| `CoverageHubV2` | nothing live (coverage redirects) | tokenize 5 hex; warm tier dots. Could become the real `/coverage` hub. No v1 to displace, so lowest risk to ship. |
| `CityHeroV2` | `CityHero` on the cell page | tokenize ~12 hex; warm dot; decide the photo story (it expects a remote `photoUrl`, falls back to a placeholder). The live `CityHero` is pattern/photo aware already, so this is a real swap decision, not a gap. |
| `SectorCardV2` | `SectorMasterMenu` tiles | client component + ResizeObserver + icon function prop; tokenize hex. Marginal gain over the live tiles. Skip unless the homepage sector grid is being reworked anyway. |
| `FeaturedCardV2` | `FeaturedCellTile` | fixed 280x180 box, icon prop, hex, blue dot. The live tile self-fetches real numbers; this is a styling-only alternate. Skip. |
| `LondonRoadmap` | nothing (decorative) | London specific and fully hardcoded. Phase 2, only if a hand-drawn city motif is wanted. |

Recommended order if you want to promote any: **CoverageHubV2 first** (no v1 to break),
then **CountryScorecardV2** (clear upgrade to a live surface), both after the tier-token
lands. Hold the rest.

## Part 3: whole-page graphics rethink, surface by surface

Grounded in the live routes. Each item is a concrete, token-safe move. Priority P1 (high
impact, low risk) to P3.

### Homepage (`src/app/page.tsx`)
- **P1. One eyebrow system.** Sections (WorldMap, Sectors, Featured, Blog) each label
  themselves differently. Add a single `SectionEyebrow` primitive (uppercase, tracked,
  `atlas-700`) and use it on every band. Cheap, instantly more composed.
- **P2. The "cities placeholder" band is a literal placeholder.** Replace the cartographic
  London stand-in with either the real city picker or a generalized warm cartographic
  motif. Today it reads as unfinished.
- **P2. Featured grid rhythm.** The 6 featured tiles and the sector tiles use different
  card shells. Unify on one card primitive (radius `rounded-lg`, `elevation.card`,
  parchment border) so the page has one card, not three.

### Cell page (`src/app/[country]/[geo]/[industry]/page.tsx`)
- **P1. Chapter rhythm.** ~35 stacked sections read as one long scroll. Introduce a
  spacing scale (e.g. 48 between sections, 24 within) and the `SectionEyebrow` so the
  page reads as chapters: the number, where the money goes, the spread, the context.
- **P2. Hero confidence word.** The coverage word ("Measured data" / "Regional
  benchmark") that replaced the Atlas Score is good. Give it a warm tier dot from the new
  token so it carries a quiet color signal, not just text.
- **P3. Distribution + waterfall share a visual language.** `DistributionVisual` and
  `SmartWaterfall` use different bar treatments. Align bar radius, label type, and the
  amber fill so the two charts feel like one family.

### Country page (`src/app/[country]/page.tsx`)
- **P1. This is where `CountryScorecardV2` earns its place.** The live stack
  (`CountryAtAGlance` + `CountryStatsStrip` + `CountrySignaturePanel`) is three separate
  blocks; the scorecard composes the same data into one denser, more editorial card.
  Promote it here after the tier token lands.
- **P2. Region grid.** The admin-1 grid is plain links. A light card with a coverage dot
  per region would match the rest of the system.

### Sector pages, cities, compare, blog
- **P2. Sector landing.** Reuse the unified card primitive from the homepage so sector
  and home feel continuous.
- **P3. Compare.** `/compare` is functional but utilitarian. A split-hero header (two
  geos, a divergent bar) would lift it; the export's comparison `_primitives` are stale,
  so build fresh in tokens.
- **Blog.** Already upgraded to `LongformArticle`. Leave the article body. The index page
  could use the unified card; skip `BlogCoverCard`.

### Cross-cutting primitives to add (the actual deliverable)
1. `tier` color tokens in `design-tokens.ts` (Part 2 root cause).
2. `SectionEyebrow` primitive (eyebrow label).
3. One `StatRow` primitive: a label and a tabular-nums value under a hairline, the
   pattern the v2 cards use well. Replaces several ad hoc stat rows.
4. One card shell primitive so home, sector, featured, and region cards are one thing.

These four are small, additive, fully on brand, and each is independently shippable with
a `/_design` story. They are worth more than promoting any single v2 screen, because they
raise every surface at once.

## Sequencing

- **S1.** Land the `tier` tokens + `SectionEyebrow` + `StatRow` + card shell as
  design-system primitives, each with a `/_design` catalog story. No live page changes
  yet. Pure additive.
- **S2.** Apply the eyebrow + spacing rhythm to the homepage and cell page behind a
  before and after preview.
- **S3.** Promote `CoverageHubV2` (new `/coverage` hub) and `CountryScorecardV2` (country
  page), both now reading the tier token, each shown before and after.
- **S4.** Optional: compare-page split hero; niche-signals feature if wanted.

Every step: branch, build, show before and after, founder approves, then commit. No
em-dashes, no source-agency names, tokens only, layering and section-order gates hold.

## Guardrails carried from the prior spec
- Do not port from `design-assets/incoming/set_17..20`. It is stale (see the 2026-06-01
  spec port audit). These v2 components are repo files, a different thing.
- No `npm run build` / `prebuild` / `tsc` without explicit permission.
- No live render change without a before and after shown first.
