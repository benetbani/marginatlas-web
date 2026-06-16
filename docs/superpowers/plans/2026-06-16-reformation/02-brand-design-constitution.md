# 02 . Margin Atlas Brand Design Constitution (DRAFT)

Status: DRAFT law for the 2026-06-16 reformation. This document is the single
authority that the reformation builds toward. It synthesises Part B of the
web-research answer (`00-research-answer-source.md`) with the literal token,
section, and honesty ground truth of the live repo (`06-ground-truth.md`).

What this document is: the opinionated, singular visual LAW so we stop
gravitating between two languages (warm SaaS kit vs engraved almanac). It is
deliberately narrow. When a future decision feels open, this document closes it.

What this document is NOT: it does not change which sections exist. The five
locked page types and their fixed, ordered section sets are immutable (founder,
2026-06-16). The reformation changes HOW each section is composed and visualised,
folding the existing sections into six narrative bands. It never adds, removes,
reorders, or renames a section, and it never renames a URL slug.

Authority order when documents disagree: the founder's spoken word, then
`src/lib/design-tokens.ts` (the value authority for every color, type, and scale),
then the locked section spec
(`docs/superpowers/specs/2026-06-16-london-uk-section-architecture.md`), then this
constitution, then the research answer. Hex values quoted below are copied from
the token file; if the token file changes, this document is wrong and gets
corrected, never the reverse.

---

## 1. Design thesis

**Margin Atlas reads like a calm, premium business almanac.** Every page answers
one question with one unmistakable answer, gives one structural reason that answer
is what it is, and names one honest tradeoff. Every visual mark earns trust before
it earns attention.

The thesis in three commitments:

1. **One answer.** A reader lands, and within the first viewport sees the single
   number that the page is about (the typical revenue, the score, the kept share),
   set large and unmissable, with its spread shown beside it. No page makes the
   reader hunt for the point.
2. **One reason.** Right after the answer comes the structural why: the honest
   take, the number in tangible terms, the one explainer that says why this number
   is this number and not another. Reason, not decoration.
3. **One tradeoff.** Every page is honest about what it costs to be right here, in
   this trade, in this place. Where we hold real data we show it. Where we do not,
   we say so plainly (tagged SAMPLE or a calm "still filling in" strip), never a
   fabricated number, never a wall of dashes.

The register sits between a reference work and a quiet editorial. We are not a
trading terminal and not a generic SaaS dashboard. We have the rigour of a data
publication and the warmth of a printed atlas. The north-star feeling: a reader
trusts the page the way they trust a well-set reference book, because nothing on
it is louder than it needs to be and nothing on it is hiding.

This thesis chooses **warm editorial over premium fintech** (research Part D), and
it is the reason the reformation exists: to collapse the two-language split into
one visual language that is engraved frame plus clean data core, warm frame on by
default, applied with the lightest touch on the dense cell page.

---

## 2. The grid and density philosophy

### 2.1 The page is six narrative bands, not an N-section stack

A Margin Atlas page is not experienced as a flat list of sections (18 on the
restaurant cell, 24 on the country page). It is read as a guided reference spread
of **six narrative bands**. Every locked section still exists, still appears in
its own row, in its locked order: the bands are a reading rhythm laid over the
fixed order, not a reordering of it. Each band has a job, a dominant visual, and a
single idea.

The bands, and exactly which **London Restaurants (cell)** sections map into each
(section numbers from the locked spec in `06-ground-truth.md` §2.4):

**Band 1: The Answer.** The page's single number and its spread, plus the tool to
make it yours.
- 0. Make-it-yours calculator (sits directly under the masthead number)
- 1. Masthead: typical revenue + its spread

**Band 2: The Verdict.** The honest human read of that number, in plain and
tangible terms.
- 2. The honest take (verdict + break-in difficulty gauge)
- 3. In plain terms: the number in tangible units

**Band 3: The Economics.** Where the money goes and what is left.
- 4. Where the money goes (per-$100 bar, vermillion tick on the kept row)
- 5. What moves the cost (cost levers)
- 6. What the owner keeps
- 7. Break-even (ThresholdGauge)

**Band 4: The Operating Reality.** What it actually takes to run and survive year
one.
- 8. What to watch: the risks (SeverityGlyph per row)
- 9. Pay by role
- 10. Cost to open
- 11. Through the year (seasonality)
- 12. Your realistic first year (TimelineRibbon)

**Band 5: The Comparison Field.** How this place sits against its peers and the
world.
- 13. The same business nearby (LikeForLikeBars)
- 15. Versus the world

**Band 6: The Trust Layer.** The human voices, the prose, the takeaway, the
lineage.
- 14. Operator voices
- 16. The story in plain words (a quiet prose beat, kept low)
- 17. One thing to remember
- 18. Related

The same six bands organise the other four page types over their own locked
orders. The mapping principle is constant: Answer, then Verdict, then Economics,
then Operating Reality, then Comparison, then Trust. For the **country (UK)** page,
At-a-glance and the nine-lens shape open the Answer/Verdict bands; cost-and-rules
through talent and reach are Economics and Operating Reality; neighbours, the
opportunity gap, same-business-abroad, versus-the-world are the Comparison field;
the honest take, gut-check, one-thing, and related close as Trust. For the **city
(London)** page, the Hero + Business Climate Score is the Answer, the customer and
tourist-vs-local reads are the Verdict, space-costs and owners-keep are the
Economics, best-areas and neighbourhoods and changing are the Operating Reality,
peer cities are the Comparison, and operator voices plus one-thing are Trust. The
**home** page and **neighbourhood** page band the same way over their shorter
orders. (Band assignments for the non-cell types are guidance for composition, not
a new contract; the contract remains the locked section order.)

### 2.2 The one-idea-per-band law

The governing rule that makes density feel calm: **one idea per band**. Within a
band, the eye meets things in a fixed order, every time, on every page type:

1. **Title** (what this is)
2. **Number** (the one figure that matters here)
3. **Reason** (one paragraph, why)
4. **Caveat** (one honest qualifier or source cue)

A band has one dominant visual, one crisp claim, one explanatory paragraph, one
trust cue. When a band is tempted toward a second loud visual or a competing
number, that is the signal to either demote it to a supporting tint/label or move
it to its own row inside the band. Dense information becomes calm only when the
hierarchy is visible: the reader should always know what to look at first, second,
third.

### 2.3 The grid: 12 / 6 / 4 columns

- **Desktop (>= 1280px, the `xl` breakpoint):** 12-column grid.
- **Tablet (768 to 1279px):** 6-column grid.
- **Mobile (< 768px, designed at 375px):** 4-column grid, single reading lane.

Vertical rhythm uses the existing `sectionSpacing` token scale (tight 1rem, base
1.5rem, loose 2rem, hero 3rem, band 4rem). The `band` spacing token (4rem) is the
gap that separates the six narrative bands; sections within a band sit at `loose`
or `base`. This is how the reader feels the band boundaries without a heavy rule.

### 2.4 The three reading lanes at >= 1280px

At desktop width the 12-column grid resolves into three reading lanes:

- **Left rail (quiet, ~2 to 3 cols):** section identity and source/method cues.
  The band name, the small-caps section label, the confidence/tier badge, the
  "where this comes from" note. This rail is Inter, muted ink, never loud. It is
  the spine that tells the reader where they are in the spread.
- **Central editorial column (~6 to 7 cols):** the main claim and its dominant
  visual. The masthead number, the chart, the verdict paragraph, the prose. This
  is where the eye lives. Newsreader voice for openers and verdicts, Inter for
  everything scanned.
- **Right rail (~3 to 4 cols):** the calculator, the benchmark card, the
  comparison summary, the "make it yours" controls, the peer dot-plot summary.
  Interactive and reference affordances live here so the central column stays a
  clean read.

The rails are quiet by construction. The loud color (atlas vermillion) lives in
the central column where the answer is, almost never in the rails.

### 2.5 The 375px collapse

At 375px everything collapses to one column. The rules are non-negotiable
(they are also hard constraints, see §6):

- Section order is preserved exactly. Nothing is dropped or reordered to fit.
- No horizontal scroll. The serif headline, the anchor number, and the spread all
  survive a 375px column.
- Tables reflow to labeled bar lists (never a horizontally scrolling table).
- Left-rail identity cues move inline above each section as a compact label.
- Right-rail tools move inline, in their band position, full width.
- A compact sticky section index is allowed only if it does not obscure reading;
  if it competes with the content, it does not ship.

---

## 3. Type law

Two faces, two jobs. **Newsreader is the almanac voice. Inter is everything
scanned.** No component hardcodes a font name; everything binds to the token slot
(`var(--font-display)` for serif, `var(--font-sans)` for sans). The serif face is
interim and FACE-NOT-FINAL (the cohesion plan names Fraunces as a candidate); the
LAW below is about the role each slot plays, so it survives a face swap.

### 3.1 Newsreader (the display / serif slot): the almanac voice

Reserved for the parts that make the product feel like a printed almanac:

- Page mastheads and the wordmark.
- Section openers (the band/section title that introduces a claim).
- Verdicts (the honest take headline, the one-thing-to-remember).
- Pull-quotes and story pullouts (operator voices headline, the prose beat).
- The single largest number on the page: the masthead anchor (typical revenue,
  the score), plus the italic unit suffix on that anchor.

Newsreader is **never set below 20px**. It never sets body text, table figures,
captions, labels, controls, or chart text. If a serif string is being scanned
rather than read, it is in the wrong slot.

### 3.2 Inter (the sans slot): everything scanned

Body copy, all UI, captions, chart labels and axes, every table, all controls,
methodology, navigation, and every numeral outside the single masthead anchor.

### 3.3 Tabular figures law

All numeric UI sets with tabular, lining figures so columns align and numbers do
not jitter as they change in the calculator. Every data numeral outside the
masthead anchor is Inter with `tabular-nums`.

```css
.numeric,
[data-numeric="true"] {
  font-variant-numeric: tabular-nums lining-nums;
}
```

### 3.4 The responsive type scale

The fluid scale from research Part B, reconciled with the token file's `fontSize`
ladder. The fluid `clamp()` sizes govern the editorial display tier (mastheads,
section openers); the fixed token sizes govern the scanned tier (body and below),
where predictability matters more than fluidity.

Editorial / display tier (Newsreader, fluid):

```ts
const displayScale = {
  hero: "clamp(2.75rem, 6vw, 5.25rem)", // masthead anchor / homepage hero
  h1:   "clamp(2rem, 4vw, 3.5rem)",     // page masthead
  h2:   "clamp(1.5rem, 2.5vw, 2.25rem)",// band / section opener
  h3:   "clamp(1.125rem, 1.5vw, 1.375rem)", // sub-opener (>= 20px floor holds)
}
```

Scanned tier (Inter, fixed token sizes from `design-tokens.ts`):

```ts
const textScale = {
  body:  "1rem",     // base 16/24
  small: "0.875rem", // sm 14/20  (captions, secondary)
  micro: "0.75rem",  // xs 12/16  (labels, source cues, badges)
}
```

The 20px floor on the serif slot means `h3` at its smallest clamp value still
resolves at or above 20px; any heading that would fall below 20px is Inter, not
Newsreader.

---

## 4. Color and token law

We keep our **real warm palette**. The research recommends a warm restraint
palette with named roles (ink, paper, sand, terracotta, moss, amber, red); our
token file already IS that palette, with real values. This section binds the
research's semantic role names to our actual tokens and re-expresses them as OKLCH
semantic tokens. The hex below is the current value authority, copied from
`src/lib/design-tokens.ts`; the OKLCH expression is the target representation
(generated and audited per §4.4), perceptually equal to the hex, not a new color.

### 4.1 The real palette, mapped to research role names

All hex lowercase, quoted from the token file. Research role on the left, our
token family and the operative values on the right.

- **Paper (surfaces):** `cream`. Card/popover `cream-50 #ffffff`; app ground
  `cream-75 #fbfaf7`; muted sand surface `cream-100 #f7f6f4`; hairline
  `cream-300 #e4e2dd` (= `parchment`).
- **Ink (primary text):** `ink`. Headline `ink-900 #211810`; secondary
  `ink-700 #463726` (= `graphite`); muted `ink-500 #7d6c58`.
- **Sand / structure-and-costs (the neutral mass of a breakdown):** `cocoa`.
  `cocoa-500 #87745d`, `cocoa-700 #534231`. This is the neutral data mass color,
  distinct from ink text.
- **Terracotta (the one loud accent):** `atlas`. Mark/surface accent
  `atlas-500 #e62200`; text/headline accent `atlas-700 #991600`; light wash
  `atlas-300 #fb8469`; hover/pressed `atlas-600 #c11c00`. atlas-700 is the only
  atlas value allowed on text; atlas-500 is for marks and surfaces, never body.
- **Moss (positive / owner-keeps, the ONLY secondary accent):** `moss`.
  `moss-700 #4a6018` (kept / above-par), `moss-500 #6f8f25`.
- **Amber (caution / below-par):** `amber`. `amber-700 #8a510a`,
  `amber-600 #b06a08`.
- **Red / destructive (used less often than amber, hard errors only):** `clay`.
  `clay-700 #5c1813`. Note clay is a deep maroon, deliberately distinct from the
  brand red (atlas), so "destructive" never reads as "brand."
- **Cool counterweight (< 5% of surface):** `teal`. `teal-500 #4d7c64`. Use
  sparingly; it is a muted sage, not a data hue.

**Banned:** cyan and aquamarine (reserved for the founder's other product); blue
is retired everywhere. No raw blue, ever.

### 4.2 Semantic and chart token roles

The semantic aliases (from the token file's `semanticColors`), unchanged:
`background` = cream-75, `foreground` = ink-900, `card` = cream-50, `primary` =
atlas-700, `border` = cream-300, `ring` = atlas-700, `success` = moss-700,
`danger` = clay-700, `warning` = amber-700, `muted` = ink-500.

Two constitutional semantic scales that components must consume, never re-invent:

- **`tier`** (data-confidence): `deep #991600` (atlas-700, measured),
  `good #e62200` (atlas-500, regional), `starter #fb8469` (atlas-300, thin),
  `modeled #87745d` (cocoa-500, estimated).
- **`delta`**: `positive #4a6018` (moss-700, above par), `atpar #463726`
  (ink-700, neutral, NOT brand-red), `caution #b06a08` (amber-600, watch),
  `negative #8a510a` (amber-700, below par = warning, not brand-red).

Chart token roles (the chart grammar's fixed color jobs, constitutional):

```ts
tokens.color.chart = {
  primary:  "var(--color-atlas-500)",  // the typical value / you-are-here / spotlight
  kept:     "var(--color-moss-700)",   // profit / kept / positive delta
  cost:     "var(--color-cocoa-500)",  // structure and costs, the neutral breakdown mass
  baseline: "var(--color-ink-500)",    // neutral data mass / axes / muted labels
  grid:     "var(--color-cream-300)",  // rails / gridlines / hairlines / track backgrounds
  caution:  "var(--color-amber-600)",  // caution / below-par
  danger:   "var(--color-clay-700)",   // destructive / hard errors only
}
```

### 4.3 The one-loud-color-per-viewport rule

Atlas vermillion is the only loud color, and it carries **one idea per view, under
5% of surface**. If vermillion is already carrying the main story in a viewport
(the masthead number, the you-are-here cell, the single primary action), then
every comparison and secondary mark in that viewport reaches for ink tints,
parchment, texture, position, length, and direct labels **before** it reaches for
another hue. Moss is the only sanctioned second accent, and only for its one job
(kept / positive). Categorical multi-hue palettes are allowed only for true
multi-category comparisons, and even then position, order, and labels must carry
the meaning before color does (research Part D; Bertin's encoding hierarchy in
§5.4). No meaning is ever carried by color alone (WCAG, §6).

### 4.4 No raw hex in components; OKLCH source of truth

Components never type a hex, px, ms, easing curve, font name, or z-index. They
consume semantic tokens only, pulled from `design-tokens.ts` (or `motion.ts` for
motion). The token ramps are authored and audited in **OKLCH** (perceptually even
steps), generated with Culori, exported through Style Dictionary to `tokens.css`,
the Tailwind token config, and the TypeScript chart-token export from one OKLCH
source. Every foreground/background pairing is audited against WCAG AA (4.5:1 body,
3:1 large text and non-text UI) before it ships. The OKLCH re-expression must be
perceptually equal to the current hex; this is a representation change for
durability and ramp quality, not a recolor of the brand.

---

## 5. The chart language

One house chart grammar. Every statistic on every page maps to a known chart type
and a known renderer. This is the internal "chart choice law," adapted from the FT
Visual Vocabulary and Datawrapper's chart-type guidance, so page templates never
become a random mix of bars, cards, and prose.

### 5.1 The renderer law

- **visx** is the primary renderer for all product charts: server-renderable SVG,
  token-themeable, React 19 friendly. Everything a reader sees on a page is a visx
  chart unless there is a specific reason otherwise.
- **Observable Plot + jsdom** is the secondary renderer, for static generated
  charts: methodology graphics, server-generated fallback SVGs, and fast chart
  prototyping during design. Not the interactive product layer.
- **D3 modules** (`d3-array`, `d3-scale`, `d3-format`, `d3-shape`) are the math
  and formatting layer inside visx components. D3 is geometry and data transforms,
  never DOM mutation; charts stay React/SVG and token-themeable.

Tufte and Bertin govern QA (§5.4): every mark earns its place, direct labels over
legends, small multiples for peer and country comparisons, and encoding by
position and length before color.

### 5.2 The decision matrix (statistic -> chart -> renderer)

Each row maps a statistic that appears on our pages to its chart form, the
Margin Atlas chart-kit component, and the renderer.

| Statistic on the page | Chart form | Chart-kit component | Renderer |
| --- | --- | --- | --- |
| Typical revenue + its spread (masthead) | Min/median/high band with labeled percentile anchors | `RevenueRange` (RangeStrip family) | visx |
| Revenue distribution across instances | Interval dot plot / percentile band / compact box hybrid | `RevenueRange` | visx |
| Make-it-yours calculator | Controlled inputs + live range band (one chart, not a dashboard) | `RevenueRange` driven by calculator state | visx |
| Number in tangible units | Compact equivalence card; pictorial only when it clarifies scale | `TangibleUnits` (icon-unit cards) | static / no chart |
| Where the money goes (PRIMARY, founder pick Q17) | Per-$100 stacked bar, vermillion tick on the kept row | `MoneyGoesBreakdown` | visx |
| Where the money goes (optional secondary read) | Waterfall from revenue to owner take | `CostWaterfall` | visx |
| What moves the cost (levers) | Ranked sensitivity bars / tornado | `TornadoLevers` | visx |
| What the owner keeps | Large retained figure + moss-highlighted take-home band | `OwnerKeepBand` (OwnerKeepTable) | visx |
| Break-even | Threshold band / bullet with fixed-cost marker | `BreakEvenBand` (ThresholdGauge) | visx |
| Risks / what to watch | Severity ladder / ordered severity list | `SeverityGlyph` ladder | visx |
| Pay by role | Aligned role table with wage-context bands | `RolePayRails` (wage rails) | static / Inter table |
| Cost to open | Range bar with category callouts | `CostToOpenRange` | visx |
| Seasonality / through the year | 12-month line or heat strip (never a decorative calendar) | `SeasonalityLine` / `SeasonalityHeatStrip` | visx |
| Realistic first year (ramp) | Step sequence + cumulative line | `RampSequence` (TimelineRibbon) | visx |
| Comparable places nearby | Ranked dot plot / small-multiple cards | `PeerDotPlot` (LikeForLikeBars) | visx |
| Versus the world | Percentile dot plot (choropleth only if geography itself matters) | `PeerDotPlot` world mode | visx |
| Nine-lens country shape | Radar / nine-lens spine | `NineLensRadar` | visx |
| Opportunity gap | Scatter (opportunity vs saturation) | `OpportunityScatter` | visx |
| Business Climate Score (city) | Engraved gauge / dial | `ScoreDial` (engraved gauge) | visx |
| Tourist vs local money split | Two-part split bar | `VisitorSplit` | visx |
| Character / spectrum | Position-on-spectrum marker | `CharacterSpectrum` | visx |
| Operator voices | Quote cards with metadata (not icons posing as evidence) | `OperatorVoices` | static / no chart |
| Methodology / lineage | Source table + confidence badge + calculation lineage | `MethodologyTable` + tier badge | static / Inter table |

### 5.3 The Margin Atlas chart kit (the named components)

The canonical component family the reformation builds and maintains. New visuals
join this kit; we do not invent one-off charts per section. The kit reconciles the
research's proposed names with the primitives already locked in the spec
(LikeForLikeBars, ThresholdGauge, TimelineRibbon, SeverityGlyph, TierBar, plus the
existing RangeStrip, MoneyGoesBreakdown, engraved gauges/dials, nine-lens radar,
opportunity scatter, ComparisonBars, VisitorSplit, OwnerKeepTable, setup
route-line, character spectrum, seasonality bars, wage rails):

- `RevenueRange`: typical value and spread; the masthead and distribution.
- `CostWaterfall`: revenue-to-owner flow; per-$100 part-to-whole summary.
- `BreakEvenBand`: threshold/bullet with the fixed-cost marker.
- `PeerDotPlot`: comparable places and versus-the-world.
- `SeasonalityLine` / `SeasonalityHeatStrip`: through-the-year.
- `RampSequence`: first-year step sequence plus cumulative line.
- `TornadoLevers`: ranked cost sensitivity.
- `OwnerKeepBand`: retained amount with the moss take-home band.
- `SeverityGlyph`: the risk ladder.
- `NineLensRadar`: the country nine-lens shape.
- `OpportunityScatter`: the opportunity gap.
- `ScoreDial`: the engraved Business Climate Score.
- `VisitorSplit`, `CharacterSpectrum`, `RolePayRails`, `CostToOpenRange`,
  `TangibleUnits`, `LikeForLikeBars`, `TierBar`: the remaining locked primitives.

Every chart-kit component: accepts nullable inputs; returns `null` (graceful
silent omission, no placeholder chart) when data is insufficient; always shows the
full spread (the seven gradations, never a single point pretending to be the
whole); reads color exclusively from the chart token roles in §4.2; sets all
numerals in Inter `tabular-nums`; renders crisp, opaque, and high-contrast on
cream, with engraved texture only in the frame and shells, **never behind a
number**.

### 5.4 Chart QA law (Tufte + Bertin + the house grammar)

Before any chart ships:

- Every mark has a job (Tufte): no decorative gridlines, no chart junk, direct
  labels preferred over legends.
- Encoding hierarchy (Bertin): position first, length second, color only to mark
  role or status, never as the sole carrier of meaning.
- Small multiples for peer and country comparisons rather than one overloaded
  chart.
- Plain-language chart titles and short notes (Datawrapper register); compact
  legends or none; the source/confidence cue sits in the left rail or as a small
  caption, never crowding the data.
- The vermillion budget holds: one idea per view, under 5% of surface.

---

## 6. The five north-stars, and exactly what we steal

Five reference products define the bar. We steal a specific, named discipline from
each, and nothing more (we do not copy their look).

1. **Financial Times (Visual and Data Journalism + Visual Vocabulary).** Steal the
   disciplined chart vocabulary and the "explain the claim first" order. The Visual
   Vocabulary becomes our internal chart-choice law (the §5.2 matrix is its
   adaptation). Steal restrained color and a strong headline hierarchy that holds
   up under density.

2. **Our World in Data (and Grapher).** Steal global-comparison clarity and source
   transparency: calm prose paired with a chart-first explanation, visible
   source/method, and reusable chart modules. This is the model for the
   versus-the-world band and for the methodology/lineage trust cue.

3. **Datawrapper.** Steal publisher-grade chart defaults: plain-language titles and
   subtitles, minimal legends, accessible color practice, source captions, and
   sane mobile chart behavior. Datawrapper is the house standard for how a chart is
   captioned and how it behaves at 375px.

4. **The Economist (Graphic Detail).** Steal one-color discipline and compact
   editorial confidence: a single dominant color, high contrast, terse titles,
   high information density without visual noise. This is the direct ancestor of
   our one-loud-color-per-viewport rule.

5. **The Pudding.** Steal guided pacing, used selectively. For the bands that need
   narrative momentum (the first-year ramp, operator voices, the prose-story beat),
   borrow section pacing and annotation so the reader is moved through a sequence
   of claims. Used sparingly, low on the page, never to animate a number for
   spectacle.

---

## 7. What this constitution forbids (so we stop gravitating)

- No second visual language. There is one: engraved frame plus clean data core,
  warm frame on by default, lightest engraved touch on the cell page. The warm SaaS
  kit and the engraved almanac are not two options; they are one language now.
- No serif below 20px; no serif on scanned text, tables, labels, or controls.
- No second loud color. Atlas vermillion carries one idea per viewport, under 5%
  of surface; moss is the only sanctioned second accent, for its one job.
- No blue, no cyan, no aquamarine.
- No raw hex, px, ms, easing, font-name, or z-index in components.
- No fabricated content presented AS real measured data, ever; no wall of dashes.
  Unheld sections MAY be filled with labelled illustrative content (plausible
  numbers, and composed operator voices that are NOT attributed to real named
  people), always visibly tagged as illustrative or sample (the London-exemplar
  pattern, founder Q33/Q34), or shown as a calm "still filling in" strip; `[FRAME]`
  sections keep an honest empty state. The line is bright: illustrative is always
  labelled, and nothing fabricated is ever dressed as a real measurement.
- No section added, removed, reordered, or renamed; no URL slug renamed. The bands
  re-compose the locked order, they never change it.
- No texture, imagery, or motion behind a number; motion is for state, disclosure,
  and orientation only, respects reduced-motion, and is never required to
  understand a figure.
- No horizontal scroll at 375px; tables reflow to labeled bar lists.

This is the law. When a future choice feels open, it is answered here.
