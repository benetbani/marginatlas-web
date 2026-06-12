# The Atlas Design System

**The constitution. Everything visual inherits from this document.** (2026-06-12)

This is the single authoritative design-system document for marginatlas.com. It exists to
end patchwork: no page, component, asset, or animation gets to invent its own rules. The
brand (`docs/brand/brand-identity.md`) defines who Atlas is; this document defines how that
identity becomes pixels, type, color, motion, and components, with enough precision that two
builders working apart produce the same Atlas.

## Authority and precedence

When documents disagree, this is the order of truth:

1. `docs/brand/brand-identity.md`: WHO the brand is. Nothing here may contradict it.
2. **This document**: WHAT the visual system is. The constitution.
3. `src/lib/design-tokens.ts`: the machine-readable token values. The single source of
   truth for every literal value (hex, px, ms, curve). If this document and the token file
   ever disagree on a value, the token file wins and this document gets corrected.
4. `docs/design-system/GUIDELINES.md`: HOW components are engineered (file shape, cva,
   forwardRef, props API, layering, the pre-merge checklist). The engineering rulebook.
5. The design exports under `docs/brand/assets/incoming/Margin-Atlas--5/`: raw material and
   starting vocabulary, refined by the brand. Never gospel. The three audits in
   `docs/brand/_audit/` record what is adopted, refined, and dropped.

Standing constraints that bind every rule below: tokens only (no raw hex/px/ms in
components), no em-dashes in user-facing source, no source-agency names in user-facing copy,
plain operator voice, no fabricated data, no URL slug renames, WCAG AA floor.

---

## 1. Design philosophy

Eight articles. Every design decision on Atlas should be defensible by pointing at one of
these. If a decision cannot be, it is probably wrong.

### Article 1: Trust is the renderer
Atlas owns one word: trustworthy. Every visual choice either earns trust or spends it.
Honest provenance markers, labeled estimates, self-omitting sections when data is thin,
calm empty states that admit gaps, a freshness stamp instead of fake activity counters.
Design honesty is the same discipline as data honesty. Nothing on an Atlas page may look
more certain than the data behind it.

### Article 2: A calm canvas where accents mark meaning
The surface is warm cream paper; the text is warm ink. Color never decorates. Vermillion
appears only where it carries meaning: the typical value, the leader in a like-for-like
comparison, the honest take, the one action that matters. If you can remove a color without
losing information, remove it. (Brand: "Color's job: a calm canvas where accents MARK
MEANING, never decorate.")

### Article 3: Full but calm
Atlas pages are generous and complete, not minimal. Density is welcome; chaos is not. The
page stays calm through organization: consistent section rhythm, hairline structure,
alternating band surfaces, a sticky jump nav on long pages, and only the deepest technical
material collapsed. We show everything and organize it, rather than hiding it.

### Article 4: The modern almanac
The visual world is a beautiful modern atlas / field almanac: cartographic heritage with
modern execution. A whisper of paper and engraving on a fundamentally clean surface. The
heritage is a soul, never a costume: no sepia filters, no parchment cosplay, no antique
typefaces. Editorial magazine with cartographic heritage, executed with current tools.

### Article 5: Answer first, spread always
The eye hits the answer in one line plus the key number before anything else. One confident
anchor number per masthead, sized to anchor and never to shout, and the spread shown beside
it (seven gradations, not a lone average). Numbers below the masthead are treated as equals.
There is no giant hero stat culture on Atlas.

### Article 6: Restraint is the signature
The rarest things on the page are what make it recognizable: the single stroke of
vermillion, the one quiet motif surface, the one animated element. Atlas is recognizable at
a glance precisely because it refuses to do most things. When in doubt, do less, and do it
exactly.

### Article 7: Dignity for every subject
Every place and every trade is shown with equal care: a Tokyo sushi counter and a Lagos
market stall get the same craft. No condescension toward a "humble" trade, no exotic
spectacle, no stock gloss. The imagery, pictograms, and illustrations exist to honor real
work, not to decorate a database.

### Article 8: Mobile is a first-class page, not a squeezed one
Roughly half the audience reads on a phone. The serif headline, the anchor number, and the
spread must survive a 375px column by design. Tables reflow into labeled bar lists, tiles
stack into chips, breadcrumbs collapse. A layout that only works wide is half a layout.

---

## 2. The borrowed discipline

Atlas adopts the Refactoring UI methodology wholesale, and distills named principles from
four houses whose craft matches our ambitions. These are working rules, not mood-board
references.

### 2.1 Refactoring UI (the base methodology)

1. **Hierarchy through weight and color before size.** To emphasize, prefer a heavier
   weight or a darker ink step; to de-emphasize, prefer a lighter ink step (ink-700,
   ink-500) or smaller measure. Reach for font-size changes last. Most Atlas hierarchy
   problems are solved with ink-900 vs ink-700 vs cocoa-500, not with bigger text.
2. **De-emphasize to emphasize.** If the anchor number does not stand out, quiet its
   neighbors instead of inflating it. Mute the labels, lighten the secondary stats, and the
   anchor wins without growing.
3. **Spacing is the first grouping tool; borders are the last.** Use proximity and white
   space to group, surface shifts (cream-50 card on cream-100 paper) second, hairlines
   third, boxes last. Start with too much space and remove until it tightens.
4. **Limit the palette of every value.** Color steps, type sizes, spacing, radii, shadows,
   durations: all come from the fixed token scales. A designer choosing from eight options
   is consistent; one choosing from infinity is not.
5. **Never grey text on colored or tinted surfaces.** On atlas-50 tints, moss-100 chips, or
   any non-paper surface, use a darker tone of the surface family or the ink ladder, never a
   literal opacity-faded grey.
6. **Labels are a last resort.** Format the data so it explains itself: "$387K a year"
   needs no "Annual revenue:" label. Where a label is needed, it is the small uppercase
   tracked eyebrow style, quiet and secondary to the value.

### 2.2 From Stripe

1. **Numbers are typography.** Every numeral in a data context is set in tabular figures,
   right-aligned in columns, with consistent decimal and unit treatment. Currency signs and
   magnitude suffixes are set smaller than the digits so the digits carry (the split-number
   treatment). A misaligned column of numbers is a bug.
2. **Detail states are designed, not defaulted.** Hover, focus, active, disabled, loading,
   empty, and error are explicit design surfaces on every primitive. A component without a
   designed disabled state is unfinished (see section 12.3).
3. **One visual language across marketing and product.** The homepage, the cell page, the
   pricing page, and the report covers all speak the same token system. There is no
   "marketing site style" vs "app style" on Atlas.

### 2.3 From Linear

1. **Speed is a design property.** The interface must feel instant: hover responses at
   150ms, state changes at 200ms, nothing slower than 400ms, no blocking spinners for
   sub-second waits (use calm skeletons). Motion may never make Atlas feel slower.
2. **One accent, neutral everything else.** Linear proves a product can feel premium with a
   nearly monochrome surface and a single disciplined accent. Atlas's version: ink on cream,
   vermillion rare. Resist every urge to add a second loud color.
3. **Keyboard and focus are product features.** Every interactive element is reachable in
   source order, every focus ring visible, escape always dismisses. Polish that breaks
   keyboard use is not polish.

### 2.4 From The Pudding / FiveThirtyEight

1. **Annotate the takeaway on the chart itself.** The reader should get the finding from
   the visualization without consulting prose: the typical marker is labeled, the leader
   cell is marked, the "you are here" is drawn. Axes alone are not communication.
2. **Show uncertainty honestly.** Distributions, ranges, and confidence tiers are the
   default presentation; a lone point estimate is the exception that needs justification.
   The 7-gradation range strip exists because the spread IS the story.
3. **Charts only when the shape matters.** If the insight is a single number, set the
   number in type. A chart must earn its place by showing a shape (a distribution, a trend,
   a composition) that type cannot.

### 2.5 From The Economist

1. **A strict house chart style.** One chart grammar, one palette of fixed color jobs, one
   axis treatment, one caption style. Any Atlas chart, cropped out of context, should be
   recognizable as Atlas. No chart gets to freelance its colors.
2. **Headlines assert the finding, not the topic.** "A Lisbon cafe keeps about EUR 22k a
   year," not "Lisbon cafe revenue data." Section titles and chart titles state what the
   reader will learn.
3. **Density with dignity.** High information density carried by hairline rules, small
   consistent type, and restrained color. The Economist proves a dense page can feel
   authoritative rather than cluttered; Atlas's "full but calm" is the same bet.

---

## 3. Color

The palette is fixed. Token source: `colors` and `semanticColors` in
`src/lib/design-tokens.ts`. Hex values below are documentation of those tokens; components
never type hex.

### 3.1 The palette families and their jobs

| Family | Job | Key steps |
|---|---|---|
| `cream` | Paper. All surfaces. | 50 `#ffffff` warm white (cards), 100 `#f7f6f4` warm sand (page paper), 300 `#e4e2dd` hairlines |
| `ink` | Text. The warm brown-black ladder. | 900 `#211810` headlines, 800 body-dark, 700 `#463726` secondary, 500 `#7d6c58` muted |
| `cocoa` | Muted copy + the "structure and costs" data color. | 500 `#87745d`, 700 `#534231` |
| `atlas` | THE accent. Vermillion. Rare, meaningful. | 700 `#991600` deep vermillion-maroon (accent text, headlines, primary), 500 `#e62200` bright vermillion (marks, fills, surfaces), 50 `#fff1ee` tint |
| `moss` | The ONLY secondary accent. Positive, kept, profit. | 700 `#4a6018` text, 500 `#6f8f25` marks, 100 surface |
| `clay` | Destructive / strong danger. Deep maroon, deliberately distinct from brand red. | 700 `#5c1813` text, 100 surface |
| `amber` | Warning / caution / soft danger. | 700 `#8a510a` text, 600 marks, 100 surface |
| `parchment` | Standalone border token (= cream-300). | `#e4e2dd` |
| `graphite` | Standalone secondary-text token (= ink-700). | `#463726` |
| `teal` | Grandfathered muted-sage data accent. Under 5% of any surface; never in new brand expression without explicit justification. | 500 `#4d7c64` |

Semantic scales (never re-invent these):

- `colors.tier`: data-confidence. Vermillion saturation = confidence, draining to cocoa:
  `deep` = atlas-700, `good` = atlas-500, `starter` = atlas-300, `modeled` = cocoa-500.
  This is the ONE place tier color lives. It explicitly retires the old green/blue coverage
  dots. Use `<TierDot>`.
- `colors.delta`: above/at-par/caution/below = moss-700 / ink-700 / amber-600 / amber-700.
  Note "below par" is amber (a warning), never brand red; brand red is not a scold.

### 3.2 The fixed color jobs (the dataviz grammar)

These assignments are constitutional. They come from the adopted export grammar ("Seven
ways the Atlas shows a number") and they are what keeps color meaningful site-wide:

| Color | Its one job in data |
|---|---|
| Vermillion (`atlas`) | The typical value, the spotlight, you-are-here, the leader cell in a like-for-like table, the single primary action |
| Moss | Profit, what is kept, the positive delta |
| Cocoa | Structure and costs, the neutral mass of a breakdown |
| Ink tints | Neutral data mass, axes, labels |
| Parchment | Rails, grids, hairlines, track backgrounds |
| Amber | Caution, watch, below-par |
| Clay | Destructive actions and hard errors only |

### 3.3 Rules

1. **Vermillion budget: one idea per view.** A single screenful gets one vermillion
   subject (an anchor number, OR a leader column, OR a primary button). If two compete,
   demote one to ink. Aim for vermillion on well under 5% of any rendered view.
2. **`atlas-700` is the text accent; `atlas-500` is the mark/surface accent.** Bright
   vermillion as body-size text is forbidden (contrast and tone both fail); use it for
   fills, dots, ticks, and large display moments verified at 3:1.
3. **Moss is the only secondary brand accent.** Clay and amber are functional status
   colors, not brand expression. They appear in alerts, warnings, and destructive controls,
   never as decoration or theming.
4. **The canvas is always warm.** Page paper is cream-100, cards are cream-50, hairlines
   parchment. Stark white-on-grey (`#ffffff` canvas with cool `#e5e5e5` rules) is the
   off-brand "dialect B" from the exports and is banned; so are all cool neutral greys.
5. **The stale export ramps are banned.** Any burnt-orange (`#9A3412`, `#C2410C`,
   `#D7642E`, `#D73A14`, `#E0451F`, `#A55C00`, `#D47706`) maps to the `atlas` tokens; the
   off-moss `#5F7D55` maps to `moss`; cool greys map to `parchment`/`ink`. The full conform
   map lives in `docs/brand/_audit/asset-audit.md` section 3.
6. **Cyan/aquamarine is banned outright** (reserved for the founder's other product).
   Blue is retired everywhere (the old blue tier dot, the old `--regional #2563EB`).
7. **Gradients only encode data.** A multi-stop vermillion-to-cocoa gradient is legal only
   where each stop is a named value (the per-$100 cost stack, a range rail). Never in
   backgrounds, buttons, or hero fills.
8. **Pick by intent first.** Prefer the semantic aliases (`bg-background`, `text-foreground`,
   `border-border`, `bg-primary`, `text-muted`) over raw palette classes wherever an intent
   alias exists.

---

## 4. Typography

### 4.1 The two voices and the open slot

| Role | Slot | Current interim face | Status |
|---|---|---|---|
| Display serif | `var(--font-display)` (`font-display` / `font-serif`) | Newsreader (fallback Georgia) | **FACE NOT FINAL.** The founder is re-evaluating; a font-showcase page with 3-4 hand-picked serif candidates on a real Atlas page is planned. Everything in this document binds to the SLOT. |
| Body sans | `var(--font-sans)` (`font-sans`) | Inter (system fallbacks) | Stable direction: a clean humanist sans for long text and dense numerals. |

Constitutional consequence: **no component, chart, or asset may hardcode a font family
name.** The export `atlas-charts.js` hardcoding "Newsreader" is the named anti-pattern.
When the signature face is chosen, the slot swaps and the entire site follows. The chosen
display face must be distinctive enough to be recognizable as Atlas (the brand calls for a
signature face worth investing in), warm, confident, timeless, and must carry tabular or
lining figures well at display sizes.

### 4.2 Where each voice speaks

- **Display serif:** H1, H2, H3; the single anchor number in a masthead; pull-quotes and
  the drop-cap on long-form Learn pages; the wordmark; the italic unit suffix ("a year").
  The serif never appears below 20px.
- **Body sans:** everything else. All body copy, labels, tables, captions, UI controls,
  and every numeral outside the masthead anchor. Data numerals always with `tabular-nums`.

### 4.3 The type scale

Token source: `fontSize` in `design-tokens.ts`. The scale is fixed; pick from it, never
invent sizes.

| Token | Size / line | Role |
|---|---|---|
| `xs` | 12 / 16 | Captions, coordinate labels, footnotes. The floor; nothing smaller exists. |
| `sm` | 14 / 20 | Secondary UI text, table meta, eyebrows (uppercase + tracking) |
| `base` | 16 / 24 | Body default |
| `lg` | 18 / 28 | Ledes, emphasized body |
| `xl` | 20 / 28 | H4-equivalent, card titles |
| `2xl` | 24 / 32 | H3 |
| `3xl` | 30 / 36 | H2 |
| `4xl` | 36 / 40 | H1 (mobile), section display |
| `5xl` | 48 / 1 | H1 (desktop), anchor numbers |
| `6xl` | 60 / 1 | The masthead anchor number ceiling, desktop only |

H1 and the anchor number use fluid `clamp()` between their mobile and desktop steps; the
clamp endpoints must be scale tokens.

### 4.4 Type rules

1. **Weights are a fixed set:** 400 (body), 500 (medium emphasis, UI labels), 600
   (semibold headings/values), 700 (rare, display only). Nothing else loads.
2. **Hierarchy by weight and ink step before size** (section 2.1). A data row emphasizes
   its value with 600 + ink-900 against 400 + ink-700 labels, same size.
3. **The eyebrow** is the canonical section opener: `sm` or `xs`, uppercase, tracked
   (`tracking-wide`+), atlas-700 or ink-500, above a serif heading, optionally carrying the
   place/category provenance (FOOD & DRINK · MADRID · SPAIN). Use `SectionEyebrow`.
4. **The split-number treatment** for money: currency sign and magnitude suffix set one to
   two steps smaller than the digits, the italic serif unit ("a year") smaller still. The
   digits carry.
5. **One anchor number per masthead**, serif, confident, never larger than `6xl`. All
   other numbers on the page are set in sans at their row's size: numbers are equals below
   the fold.
6. **Real headings only.** `<h1>`-`<h4>` with a sane outline; never a styled div
   (GUIDELINES 7.1). One `<h1>` per page.
7. **Measure:** body text lines at 60-75 characters; never full-bleed paragraphs across
   the wide container.
8. **No em-dashes in user-facing copy.** Period, comma, colon. (R-020, gated.)

---

## 5. Spacing

### 5.1 The scales

Two layers, both fixed:

- **Component scale:** Tailwind's 4px base scale. The blessed steps for component
  interiors are 4, 8, 12, 16, 24, 32 (`p-1` through `p-8`). Prefer the next step up when
  unsure; cramped reads as untrustworthy.
- **Section rhythm:** the `sectionSpacing` tokens for vertical page composition:

| Token | Value | Use |
|---|---|---|
| `tight` | 16px | Inside a sub-section: heading to its first row |
| `base` | 24px | Between elements within a section |
| `loose` | 32px | Between sections inside one band |
| `hero` | 48px | Between major page bands |
| `band` | 64px | Between the masthead and the first content band |

### 5.2 Spacing rules

1. **Group by space, not by box.** Related items sit closer to each other than to anything
   else; that proximity is the grouping. Reach for a hairline only when space alone fails,
   and a bordered box only when a hairline fails.
2. **Asymmetric by meaning:** a heading sits closer to the content it introduces (below it)
   than to the section it ends (above it). Section spacing above a heading is at least one
   step larger than below it.
3. **Bands breathe equally.** Alternating cream-100 / cream-50 bands use consistent
   internal padding (`hero` top and bottom at desktop, `loose` on mobile) so the page has a
   steady pulse.
4. **Touch targets:** interactive elements are at least 44x44px on touch layouts, achieved
   with padding, not magic margins.
5. **No magic numbers.** A `mt-[13px]` is a bug. If a layout genuinely needs a non-scale
   value twice, it becomes a token first.

---

## 6. Radius

Token source: `radius` in `design-tokens.ts`. Driven by `--radius: 1rem` in globals.css.

| Token | Value | Use |
|---|---|---|
| `sm` | 8px | Small chips, tight controls, table-cell highlights |
| `md` | 12px | Inputs, segmented controls, small cards |
| `lg` | 16px | Cards, panels: the default surface radius |
| `xl` | 20px | Hero surfaces, large feature panels |
| `2xl` | 24px | Rare oversized surfaces (modals, report covers) |
| `full` | 9999px | Pills, badges, and ALL buttons (the Atlas button convention) |

Rules: buttons are `rounded-full`, always (a quiet signature). Nested radii step down (a
`lg` card contains `md` or `sm` children, never another `lg` flush to its edge). Never mix
two radii on sibling cards in one grid.

---

## 7. Elevation

Token source: `elevation` in `design-tokens.ts`. The philosophy: **Atlas is paper, and
paper lies nearly flat.** Hairlines carry structure; shadow communicates interactivity and
layering only. A page where everything floats is a page where nothing does.

| Token | Use | Notes |
|---|---|---|
| `flat` | Default. Bands, tables, in-flow panels | Structure via parchment hairlines + surface shifts |
| `subtle` | Resting interactive cards, sticky bars when scrolled | Barely-there lift |
| `card` | The standard paper card (the NavigatorForm style) | Two-layer soft shadow; the workhorse |
| `lift` | Hover state of interactive cards; dropdowns, popovers | Communicates "you can pick this up" |
| `modal` | Dialogs, command palette, drawers | The only heavy shadow; one per screen at most |

Rules: shadows are neutral-warm and soft (the token values), never colored, never harsh.
Elevation always pairs with the z-index scale (`z` tokens: base 0, raised 10, sticky 20,
dropdown 30, overlay 40, tooltip 50, modal 60, toast 70); no `z-9999`. Do not stack two
shadowed surfaces directly on each other; if a card sits in a card, the inner one is flat
with a hairline.

---

## 8. The cartographic motif system

The signature through-line device: a subtle cartographic thread (fine rules, coordinate
labels, engraved texture) running quietly across every page, so any Atlas page is
recognizable at a glance. This is an identity device, not decoration, and it works only if
it stays scarce.

### 8.1 The vocabulary (adopted from the exports, retoned)

Canonical sources in `docs/brand/assets/incoming/Margin-Atlas--5/`; ported, retoned copies
live with the decorative utilities (`src/styles/homepage-visual-tokens.css` and
`src/styles/atlas-pattern.css`).

| Motif | Asset | Character | Tile |
|---|---|---|---|
| Measurement grid | `atlas-grid.svg` | Dotted survey grid | 40px |
| Crosshatch | `atlas-crosshatch.svg` | Pencilled engraving hatch | 14px |
| Pinstripe | `atlas-pinstripe.svg` | Fine diagonal financial rule | 12px |
| Columns | `atlas-columns.svg` | Newsprint vertical rules | 60px |
| Compass rosette | `atlas-rosette.svg` | The rare dingbat ornament | 160px |
| Accent dot field | `atlas-accent.svg` | Sparse micro-dots, the only motif with vermillion | 80px |
| Paper pattern | `atlas-pattern.svg` / `.css` | Star/compass paper field + the seven masked surfaces | 80px |

Plus the live in-repo devices: the hairline-and-diamond `SectionDivider` (the `.atlas-rule`
with a centered diamond), coordinate-style eyebrow labels, the engraved neighborhood street
map (the city/neighborhood signature), and the graticule globe (ornament only, see 8.3).

**Retone is mandatory before use:** motif marks print in `parchment` (#e4e2dd) on cream,
never in the export's cool greys; the accent-dot field's dots in `atlas-500`. Contour-line
treatments follow the same rule: parchment strokes, vermillion only for a single labeled
point.

### 8.2 Where the motif lives (and how much)

The budget: **at most one motif surface per page band, and most bands have none.** The
default Atlas band is plain cream. A reader should sense the cartographic thread, not see a
pattern catalog.

- **Page mastheads:** may carry one faint motif surface (grid or paper pattern) behind the
  band, masked so it fades before any dense content. Coordinate-style eyebrow above the H1.
- **Section seams:** the diamond rule (`SectionDivider`) between major bands. This is the
  most frequent motif appearance and is intentionally tiny.
- **City / neighborhood pages:** the engraved street map is the signature visual: parchment
  stipple blocks, fine road lines, heavier ink water, district names in vermillion
  small-caps as the only color. One per page.
- **Empty states and 404:** the crosshatch surface signals "unfinished by design"
  (the under-construction states); the rosette may appear as the 404 dingbat.
- **Report covers, OG images, the wordmark:** the rosette and grid may be more present
  here; print-like artifacts can afford one step more heritage than the live page.
- **Footers:** a faint columns or grid strip is acceptable site-wide chrome.

### 8.3 Motif rules

1. Motif contrast stays below text contrast: a motif must never compete with content for
   the eye. If a screenshot's first read is "pattern," it is too loud.
2. Never place a motif behind dense data (tables, charts, the per-$100 stack).
3. Never stack two motifs, and never tint a motif with the accent (the accent-dot field is
   the single sanctioned exception, used sparingly).
4. The graticule globe is the house ornament: a rare masthead or spot decoration that must
   NEVER masquerade as a real data layer or become a recurring hero.
5. Motifs ship as tokenized CSS utilities (the `.atlas-*` classes); pages do not inline
   their own SVG backgrounds.

---

## 9. Iconography, pictograms, illustration

Three families, one hand. All adopted from the `Margin-Atlas--5` exports (see
`docs/brand/_audit/asset-audit.md` for verdicts), all conformed to tokens on port.

### 9.1 UI icons (the 40-icon `ma-` system)

- Source: `atlas-icons.js` (the structured manifest; the sprite is secondary). One family:
  32-unit grid, 1.6 stroke, rounded joins, `currentColor`.
- One icon per recurring section and action (startup-cost, owner-keeps, range, break-even,
  honest-take, gut-check, flag, watch, calculator, methodology, search, ...): every
  recurring section gets its quiet, consistent mark.
- The accent classes (`.a` stroke / `.af` fill) bind to the vermillion token and appear
  only where the accent carries meaning within the glyph. At most one accent per icon.
- Sizes: 16 / 20 / 24px. Default rendering: ink-700; interactive states may shift to
  ink-900 or atlas-700.
- Decorative icons next to text take `aria-hidden="true"`; icon-only buttons MUST have an
  `aria-label`.
- **Never mix icon families.** No new icon library dependencies (the exports' Phosphor
  assumption is dropped); additions are drawn into the `ma-` family on its grid or not at
  all.

### 9.2 Business pictograms (the 64-mark trade set)

- Source: `atlas-pictograms.js`. Same grid and stroke as the UI icons, a touch more
  character, never cartoonish. 60 trades + 4 venues (high street, mall, airport, station).
- Job: trade identity only: category tiles, the sub-type switcher, cell-list rows, peer
  cards. Never as decoration scattered around prose.
- Same color discipline as UI icons (currentColor + rare token accent).

### 9.3 Editorial spot illustrations (the 12-piece set)

- Source: `atlas-spots.js` (each piece a self-contained object; the poster SVG is preview
  only). Confident ink line over soft, slightly misregistered washes: the almanac-print
  hand.
- Washes retoned to tokens: vermillion `atlas-500`, moss token, cocoa, cream.
- Job: the editorial beats (the honest take, who-it's-for, vs-the-world, what-locals-know,
  the first year, the reality check, the report cover, the calculator). Maximum one spot
  per page band; spots mark recurring brand moments, they do not illustrate every section.
- No new whimsy: no mascots, no faces as caricature, no clip-art energy. Additions match
  the line weight, framing, and dignity of the set.

### 9.4 Photography

- Documentary style: real places, real crafts, dignified, never stock-like. Natural warm
  color, lightly toned toward the brand; no heavy filters (the duotone city-masthead
  treatment is explicitly dropped).
- Honest sourcing: curated or commissioned real photography wherever possible; labeled if
  not; NEVER pass a generic or AI image off as a specific real place.
- Equal care for every place and trade (Article 7).

---

## 10. Data visualization

The chart system is one grammar (adopted from `atlas-dataviz.js` + `atlas-charts.js`,
consolidated and retoned; the export duplication collapses into one builder set).

### 10.1 The chart inventory

| Component | Shape | Job |
|---|---|---|
| Range strip | 7-gradation horizontal strip, typical marker | THE signature spread display. Always 7 gradations, never just low/typical/high. |
| Distribution curve | Histogram + smoothed curve + IQR band + typical marker | Where most land vs the long tail |
| Per-$100 stack | Horizontal stacked bar over a ruled line-item table | Where the money goes; the kept row is the one vermillion/moss moment |
| Wage range tracks | Per-row parchment rail + fill + median tick | Pay by role, consistent with the range strip language |
| Like-for-like bars / table | Restrained bar-dot rows; comparison table where the leader cell takes the vermillion tint | Same business across comparable places |
| Trend area | Quiet area line | Only where a real trend exists |
| Positioning quadrant | Scatter with median guides | Revenue x margin placement |
| Score gauge + sub-bars + seg-10 | Radial gauge, sub-score bars | Cities only (cities remain the only scored entity) |

### 10.2 Chart rules

1. **Charts only when the shape matters** (section 2.4). A single number is typography.
2. **Always show the spread.** Any "typical" value renders with its range strip or
   distribution; a lone average is a half-truth.
3. **The fixed color jobs apply with no exceptions** (section 3.2). One vermillion subject
   per chart.
4. **Annotate the takeaway on the chart**: label the typical marker, mark the leader, name
   the kept row. Prefer direct labels over legends.
5. **Like-for-like only, never shame.** Comparisons hold one axis constant; divergent bars
   and ranked lists never become an absolute "best places" ranking and never badmouth a
   place or trade. The leader is marked; nobody is painted as the loser.
6. **Honest axes.** Baselines at zero for bars; no truncated drama. Log positioning (the
   range strip) is fine because it is positional, not proportional, and is clamped (8-92%).
7. **Numerals:** sans, `tabular-nums`, right-aligned in tables; units in the label not
   repeated per row.
8. **Nullable in, silence out.** Every viz accepts nullable inputs and returns `null` when
   data is insufficient. No placeholder charts, no NaN, nothing fabricated.
9. **Tier honesty everywhere:** data displays carry their confidence tier (`<TierDot>` +
   word) in the quiet top-right convention adopted from the export hero.
10. **Fonts and colors come from tokens** (the chart-grammar files hardcoding faces and
    hex was the export's worst habit; it does not survive the port).

---

## 11. Motion

The brand sentence: **quiet and precise, like turning a page. Never bouncy or flashy.**
Token source: `duration` and `easing` in `design-tokens.ts`; helpers in `src/lib/motion.ts`;
primitives in `src/components/ui/motion/` (`FadeIn`, `SlideUp`, `Stagger`).

### 11.1 The budget

| Token | Value | Use |
|---|---|---|
| `instant` | 0ms | Reduced-motion fallbacks, immediate state |
| `fast` | 150ms | Hover, focus |
| `base` | 200ms | Most state transitions (tabs, accordions, dropdowns) |
| `slow` | 300ms | Enter / exit, section reveals |
| `deliberate` | 400ms | The largest transitions (count-up tail, draw-ons) |

Hard ceiling 450ms; nothing ever exceeds 500ms. Exits run at 60-70% of their enter
duration. Easing: `out` for entering, `in` for exiting, `inOut` for in-place morphs,
`spring` ONLY for tactile confirmations (pressed button, toast arrival, the saved check);
`linear` only for indeterminate progress.

### 11.2 The sanctioned motion vocabulary

Adopted from the export motion set (`atlas-motion.js` / `atlas-motion2.js`) as reference
implementations, re-pointed at the tokens:

- Scroll-into-view: gentle fade-and-rise (`FadeIn` / `SlideUp`), once, not on every scroll.
- The hero count-up: on the masthead anchor number ONLY, ease-out, settling within
  `deliberate`.
- Sub-type switch: a quiet cross-fade of the readout (same chrome, different reality).
- Range-strip / sparkline draw-on: once, left to right, on first reveal.
- Freshness pulse: one quiet beat, never looping.
- The living map: a faint breath on covered places; subtle enough to miss.
- Tactile micro-confirms: tab underline slide, copy-confirm, saved check.
- Calm card shimmer for loading (skeletons, not spinners, for layout-shaped waits).

### 11.3 Motion rules

1. Animate `opacity` and `transform` only. Never width/height/top/left.
2. One or two animated elements per view, maximum. Decorative motion is noise.
3. Stagger lists at 30-50ms per item, capped at 480ms total (`stagger()`).
4. Every animation respects `prefers-reduced-motion` (`motion-reduce:animate-none` or the
   media query). Non-negotiable; the guard lives at the component boundary.
5. No bounce, no confetti, no parallax, no looping ornaments, no spinning globes.
6. Motion must serve comprehension (what changed, where it came from, what was confirmed).
   If the page works equally well with the animation off, the animation is decoration:
   remove it.

---

## 12. Components

### 12.1 The system today (`src/components/ui/`)

The catalogued, documented, accessible foundation. Everything composes from tokens; the
catalog page (`src/app/_design/`) IS the documentation. Current inventory:

`Accordion`, `Badge`, `BarList`, `Button` (the reference implementation), `Card` (+
subparts), `Disclosure`, `EmptyState`, `ErrorState`, `InlineLink`, `Money`, `Number`,
`PageShell`, `Percent`, `Pill`, `ProgressBar`, `SectionEyebrow`, `Separator`, `Skeleton`,
`Spinner`, `StatCard`, `StatRow`, `Tabs`, `TierDot`, `Tooltip`; motion: `FadeIn`,
`SlideUp`, `Stagger`.

Domain primitives (Atlas-specific, wrap system primitives): `CoverageIndicator`,
`TurnoverBandChip`, `CategoryChip`, `TypicalFirmCard`, `DenseCellHero`, `SectionDivider`,
`LogoWordmark`, `CountryFlag`, `SectorIcon`, and the empty-state bundle
(`src/components/empty/`).

### 12.2 The Atlas Page Kit (the build queue, from the master plan)

The shared vocabulary every page composes from (master plan Phase 0.2). Each is tokens-only,
nullable-input, self-omitting, plain-voiced, and catalogued before use. The
`atlas-components.css` export is the authoritative visual spec for most of these; it is a
SPEC to translate into cva/Tailwind primitives, never a stylesheet to ship.

`AnswerFirstMasthead` (bottom line + anchor number + switcher mount), `HonestTakeBox` (THE
through-line; sits right after the headline numbers), `RangeStrip` (7 gradations),
`MoneyGoesBreakdown` (per-$100), `SubTypeSwitcher` (client island, at the title, reframes
the page), `StickySectionNav`, `FreshnessStamp`, `FlagIt`, `GutCheck`, `PlainTerms`,
`RightForWrongFor`, `LocalEdge`, `ContrarianInsight`, `MythVsReality`, `OperatorVoices`,
`CountUpNumber`, `ScrollReveal`, `CaptiveVenueNote`, `FreeZoneNote`, plus the comparison
kit (`SplitHero`, `StatBand`/`StatRow`, `DivergentBars`, `EditorialBlock`,
`CrossLinkRibbon`) and the score set (gauge, sub-bars, seg-10) for cities.

### 12.3 The state contract

A component is not done until every applicable state is designed and demonstrated in the
catalog:

| State | Requirement |
|---|---|
| Default | The resting design |
| Hover | `fast` transition; surface or ink shift; `lift` elevation on interactive cards |
| Focus | The visible ring: `focus-visible:ring-2 ring-ring/40 ring-offset-2`. Never removed, ever |
| Active / pressed | A perceptible press (ink deepens or `spring` micro-scale) |
| Disabled | Reduced contrast that still passes 3:1 for its borders; `cursor-not-allowed`; never invisible |
| Loading | Skeleton shapes (parent owns `role="status"` + sr-only label) or button spinner with preserved width |
| Empty | An honest, calm empty state: what is missing, why, and the nearest useful path. No exclamation marks |
| Error | `role="alert"`, plain words, a retry where retrying can work |

Engineering shape (forwardRef, displayName, cva, named exports, props API, the third-
consumer rule, the decision tree) is governed by `docs/design-system/GUIDELINES.md` and is
not duplicated here.

### 12.4 Composition rules

- Movement is upward only: application wraps domain, domain wraps system, system reads
  tokens. A system primitive importing from sections is broken architecture.
- Variants are few (about three; more than five means it is two components).
- Two completely different layouts are two primitives, not one `layout` prop.
- Every new primitive lands with a catalog story and the pre-merge checklist
  (GUIDELINES section 8) before any page uses it.

---

## 13. Layout, grid, responsive

### 13.1 The page anatomy

Every Atlas page follows one skeleton:

1. **Masthead band**: coordinate eyebrow (category · place · country) + provenance tier
   chip top-right; serif H1 (a question or an assertion); the answer line; the anchor
   number with its spread; an optional quiet stat row. Answer-first, always.
2. **The honest take** immediately after the headline numbers.
3. **Content bands**: full and generous, alternating cream-100 / cream-50, each opened by
   the eyebrow + serif heading + lede rhythm, separated at the major seams by the diamond
   rule.
4. **The closing furniture**: related links, the freshness stamp, FlagIt, a light next
   step.

### 13.2 Grid and containers

- Content container: `max-w-6xl mx-auto` with `px-4` (mobile) to `px-8` (desktop) gutters.
- Long-form prose (Learn) narrows to a reading measure (~`max-w-2xl`/`max-w-3xl`) inside
  the container.
- Composition is a 12-column mental model: data sections typically split 7/5 or 8/4
  (narrative beside numbers); card grids run 3-up desktop, 2-up tablet, 1-up mobile.
- Bands are full-bleed in background, contained in content.

### 13.3 Responsive rules

Breakpoints (tokens): sm 640, md 768, lg 1024, xl 1280, 2xl 1536. Design mobile-first;
375px is a designed layout, verified before merge (the checklist screenshots it).

Mobile reflow patterns (adopted from the export's mobile frames, which treat the phone as
first-class):

- The serif headline and anchor number survive at clamp-reduced sizes; the spread tiles
  stack into compact chips.
- Data tables reflow into labeled horizontal-bar lists (the waterfall list pattern), never
  into horizontally-scrolling tables for primary content.
- Breadcrumbs collapse to "Home > ... > current".
- The sticky jump nav becomes a compact select or chip row.
- Touch targets 44px minimum; hover-only affordances always have a tap equivalent.

### 13.4 Long pages

- Sticky in-page jump nav (quiet, `raised` z-level) on every long page.
- Only the deepest technical sections collapse by default (methodology detail, full data
  tables); everything else is visible. We organize, we do not hide.
- Section names are consistent across page types (the content map's fixed vocabulary), so
  the jump nav reads the same everywhere.

---

## 14. Accessibility floor (WCAG AA, non-negotiable)

1. **Contrast:** 4.5:1 minimum for body text, 3:1 for large text (24px+, or 19px bold) and
   for non-text UI (borders of inputs, focus rings, icons that carry meaning). Known-good
   pairs: ink-900 / ink-800 on any cream; atlas-700 on cream-50 (passes AA at all sizes);
   moss-700, clay-700, amber-700 as text on cream surfaces. atlas-500 is NOT body text;
   verify 3:1 where it appears at display size. ink-500 (muted) is for secondary text at
   14px+ on cream-100 and must be checker-verified anywhere else. Every new pairing gets a
   checker pass before merge.
2. **Focus:** every interactive element renders the visible ring (section 12.3). If the
   ring looks wrong, fix the surrounding design, never the ring.
3. **Keyboard:** Tab order = source order; Escape dismisses dialogs/popovers; arrow keys on
   composite widgets (tabs, accordions, the sub-type switcher); no keyboard traps.
4. **Semantics:** real headings in outline order; `role="status"` (polite) on loading,
   `role="alert"` (assertive) on errors; landmarks (`main`, `nav`, `footer`) on every page.
5. **Labels:** icon-only controls carry `aria-label`; decorative icons and motifs carry
   `aria-hidden="true"`; charts ship an accessible text summary (the takeaway sentence) so
   the finding does not live only in pixels.
6. **Motion:** `prefers-reduced-motion` honored by every animation (section 11.3); the
   count-up, draw-ons, and the living map all degrade to their final frame.
7. **Color independence:** no meaning carried by color alone. The leader cell is also
   marked, the tier dot also says its word, deltas also carry a sign or arrow.
8. **Text:** 12px floor (captions only); body 16px; line height at least 1.5 for prose;
   text resizable to 200% without loss.

---

## 15. DO / DON'T

**DO**

- Open every section with the eyebrow + serif heading + lede rhythm.
- Show the spread (7 gradations) with every typical value.
- Put the honest take right after the headline numbers.
- Mark exactly one thing per view in vermillion, and make it the thing that matters.
- Use moss only for what is kept, earned, or positive.
- Use parchment hairlines and spacing for structure; shadows for interactivity.
- Set every data numeral in tabular figures, right-aligned in columns.
- Label the takeaway on the chart itself.
- Carry the tier word + dot wherever a number's confidence varies.
- Reflow tables into labeled bar lists on mobile.
- Use the `ma-` icon and pictogram families, recolored only through tokens.
- Keep motion under 450ms, easing soft, reduced-motion guarded.
- Admit gaps in plain words and route the reader somewhere useful.
- Pull every value from `design-tokens.ts`; add a token when one is missing.

**DON'T**

- Don't type a hex, px, ms, easing curve, font name, or z-index in a component. Ever.
- Don't use em-dashes in user-facing copy, or source-agency names anywhere user-facing.
- Don't use the stale export ramps (burnt orange `#9A3412`/`#C2410C`/`#D7642E`/`#D73A14`,
  off-moss `#5F7D55`, cool greys) or the white-and-cold-grey canvas. Retone to tokens.
- Don't use cyan/aquamarine (banned), blue tier dots (retired), or invent new status hues.
- Don't put two vermillion subjects on one screen, or use vermillion to scold (below-par is
  amber).
- Don't decorate with gradients; a gradient is legal only when each stop encodes a named
  value.
- Don't put motifs behind data, stack motifs, or let the globe pose as a data layer.
- Don't build a giant hero stat; the anchor is confident, not a shout, and numbers below
  the fold are equals.
- Don't ship a chart when a number in type says it; don't ship a lone average when a
  spread exists.
- Don't rank across mixed axes, shame a place or trade, or compare anything that is not
  like-for-like.
- Don't fabricate: no fake-real numbers, no placeholder charts pretending to be data, no
  AI imagery passed off as a real place, no invented quotes, no "X people viewing".
- Don't remove or restyle focus rings, suppress reduced-motion guards, or use a styled div
  as a heading.
- Don't mix icon families, add icon dependencies, or freelance a new illustration style.
- Don't animate layout properties, loop ornaments, bounce, or exceed two animated elements
  per view.
- Don't speak corporate. "What you'll clear after rent and staff," never an optimization
  buzzword. Plain local names ("kebab shop").

---

## 16. The export vocabulary (what we adopted, in one view)

The design exports are the starting vocabulary, refined by the brand. Full reasoning in
`docs/brand/_audit/asset-audit.md` (assets), `design-audit.md` (page components), and
`screenshot-audit.md` (visual reads). Canonical set: `Margin-Atlas--5`. Sets 17-20 are
stale page iterations: never port from them.

| Vocabulary | Source | Status |
|---|---|---|
| 40 UI icons (`ma-`) | `atlas-icons.js` | ADOPT (accent class bound to vermillion token) |
| 64 trade/venue pictograms | `atlas-pictograms.js` | ADOPT (same conform) |
| Data-viz motif kit | `atlas-dataviz.js` | REFINE (retone vars, dedupe with charts) |
| Chart grammar (4 types) | `atlas-charts.js` | REFINE (tokens for all literals, consolidate) |
| 12 spot illustrations | `atlas-spots.js` | REFINE (retone washes) |
| Motion set (8 + 20) | `atlas-motion.js`, `atlas-motion2.js` | ADOPT as reference impls (token timings, reduced-motion guards) |
| Component furniture | `atlas-components.css` | REFINE as SPEC: translate to cva/Tailwind primitives, never ship the CSS |
| Token dialect | `atlas-reform.css` | DROP (Rosetta map only; the live tokens supersede it) |
| 6 cartographic motifs | `atlas-grid/columns/crosshatch/pinstripe/rosette/accent.svg` | REFINE (recolor to parchment/vermillion) |
| Paper surfaces | `atlas-pattern.svg/.css` (+ dark) | REFINE (rebind to warm cream tokens) |

The one systemic conform pass (the stale-palette token map) is in the asset audit, section
3. Apply it mechanically on every port; it changes no verdict.

---

## 17. Governance

- **Amendments:** this document changes by PR, with the reason stated, the same way
  GUIDELINES section 10 prescribes. Working around the constitution silently is the one
  unforgivable design sin; if a rule is wrong, change the rule in the open.
- **The token file is the value authority** (section "Authority and precedence"). New
  values enter `design-tokens.ts` first, this document second, components third.
- **The catalog is the proof.** Nothing described here is real until it renders on
  `src/app/_design/` in every variant and state.
- **The font slot stays open** until the showcase decision; any document or component that
  hardcodes the interim face name is out of compliance today.
- **Verification:** every visual change rides the standing discipline: dry-run and show
  before data/render changes, preview-verify (gates + tsc), desktop + mobile screenshots,
  founder try on high-stakes surfaces. No autonomous builds.

One breath, to close: warm cream paper, warm ink, one rare stroke of vermillion that always
means something, a quiet moss for what is kept, a signature serif (face pending) over a
humanist sans, seven gradations for every spread, a cartographic whisper in the margins,
motion like a turning page, and honesty in every state of every component. That is Atlas,
and everything inherits from it.
