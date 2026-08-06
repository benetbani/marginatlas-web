---
name: Margin Atlas
description: A global small-business benchmarks site. Two design generations coexist; the v2 spine system is the destination and the warm legacy system is what most of the site still ships.
colors:
  # ---- V2, THE DESTINATION. Scoped to .av2, in src/styles/atlas-spine.css ----
  # GENERATED from design/mockups/atlas.css. Never edit the generated file.
  white: "#ffffff"
  paper: "#f7f7f8"
  ink: "#0d0d0e"
  ink-2: "#4a4a4d"
  muted: "#5f5f67"
  faint: "#8c8c94"
  n1: "#57575b"
  n2: "#6f6f74"
  n3: "#9a9a9e"
  n4: "#c0c0c4"
  n5: "#dededf"
  terra: "#c23a22"
  terra-deep: "#9e2e1b"
  terra-bright: "#d4573c"
  # ---- LEGACY, still live on ~260 files. In src/app/globals.css ----
  legacy-cream-50: "#FEFBF6"
  legacy-parchment: "#E8DDC7"
  legacy-cocoa-700: "#78350F"
  legacy-atlas-600: "#C2410C"
surfaces:
  card: "rgba(255,255,255,.955)"
  air: "rgba(255,255,255,.40)"
spacing:
  scale: "2 4 6 8 10 12 14 16 18 20 22 26 32 40"
---

# Design System: Margin Atlas

## 0. READ THIS FIRST. There are two systems, and this file used to describe only one.

Until 2026-08-03 this document described the warm legacy palette (cream,
parchment, cocoa, burnt amber) as if it were the whole system, and never
mentioned the v2 spine system at all. Its stated rule was **"Warm-only. No cool
grays."** The v2 system is **cool neutrals plus terracotta**. Those are direct
opposites, so any agent reading the old version would confidently build in the
superseded generation.

**There are THREE, not two.** The first version of this correction said two, and
that was wrong within the hour. Counted 2026-08-03 by route:

| | **v2 spine** | **SpineShell** | **legacy warm** |
|---|---|---|---|
| Routes | **10** | **23** | **69** |
| Accent | `--terra` **`#c23a22`** | `--terra` **`#fb8469`** | `atlas-600` **`#C2410C`** |
| Neutrals | cool (`#57575b`…) | its own warm-grey set | cream, parchment, cocoa |
| Defined in | `src/styles/atlas-spine.css`, generated | **inline `<style>` in `src/components/spine/shell.tsx`** | `src/app/globals.css` |
| Status | **ratified, the target** | previous generation | oldest, deprecated |

**Three different terracottas.** `#c23a22` is the ratified one. `#fb8469` is a
light coral that only exists inside a template literal in one component file,
which is why no palette audit ever found it.

**Routes mix generations.** The counts sum past the route total because a single
page can use two at once. **The home page is the worst case: it renders inside
`SpineShell` (generation two) while styling its own content with `parchment` and
`text-atlas-700` (generation three).** Two palettes, one page, neither of them
the ratified one.

## 0.1 The number that actually matters: v2 ships on nothing

Measured 2026-08-03 by `node scripts/audit_generation_seam.mjs`, which
classifies each route by what it renders, following one level of local import
because a route file is usually a thin wrapper over the component that carries
the generation.

```
97 routes under src/app
49 a reader can reach, 48 internal (dev, admin, _design)

48 shipping routes are not yet v2
 0 shipping routes are v2 and nothing else
 1 shipping route carries any v2 at all
12 internal routes carry v2, which is where the work has gone
```

**Read the third line twice.** The route counts in the table above are easy to
misread as "the new system is partly live". It is not live anywhere. Every v2
page built so far sits behind `/dev`, reachable by nobody. The one shipping
route that touches v2 is `/[country]/[geo]/[industry]`, the cell page, and it
carries **all three generations at once**.

**What this means for planning.** Building another v2 page at a dev route does
not reduce the seam; it adds to the pile waiting behind it. The bottleneck is
promotion, which is the founder's call and nobody else's: flags, and what he
rules on. Anyone picking up design work should know that before choosing what to
build.

**The eight mixed routes, worst first**, since a single page carrying two
accents is the seam at its most visible:

| route | generations |
|---|---|
| `/[country]/[geo]/[industry]` | **v2 + spineshell + legacy** |
| `/` | spineshell + legacy |
| `/[country]` | spineshell + legacy |
| `/[country]/[geo]` | spineshell + legacy |
| `/cities/[slug]` | spineshell + legacy |
| `/cities/[slug]/neighborhoods` | spineshell + legacy |
| `/industries/[industry]` | spineshell + legacy |
| `/_design` | v2 + legacy (internal) |

Run the script for the full queue. It is **not a gate**: the seam is a migration
to be worked down, and a gate failing on it would fail every build until the
last page moved.

**Which to use.** Anything new, or any page being rebuilt: **v2**. Touch the
older tokens only for a surgical fix to a page that has not migrated.

---

# PART ONE , THE V2 SPINE SYSTEM (the destination)

## 1. Where it comes from, and the rule governing edits

`src/styles/atlas-spine.css` is **GENERATED** from `design/mockups/atlas.css` in
the parent repository, by `node scripts/scope_atlas_css.mjs`, which scopes every
rule under `.av2`.

**Never edit the generated file.** A gate fails the build when the source has
moved and the copy has not been regenerated. It has already caught that, on the
person who wrote it.

The mockups are the founder's design. **The loop ports and proposes; it does not
invent.** A new visual is a review artifact in `design/loop4/reviews/` awaiting
his verdict, never a commit.

## 2. Surfaces. There are exactly two.

His rule, verbatim, 2026-08-01:

> "We should have only 2 levels, card and not card. Text should always be in
> some form of card, stronger white; when no card we have a lighter version of
> white which makes the same image in the background more visible, that's it."

| token | value | takes it |
|---|---|---|
| `--card` | `rgba(255,255,255,.955)` | **anything holding text** |
| `--air` | `rgba(255,255,255,.40)` | surfaces that only sit over the background image |

**What it replaced:** fourteen distinct white alphas, arrived at one
reasonable-looking value at a time.

**A gradient of white cannot exist here.** A gradient across white IS a range of
levels. The glass look lives in the blur, the border and the inset highlights;
the fill carries the level.

**A bordered box that holds text is a card and must have a fill.** Twelve
containers had a border, a radius, and no fill, which is the failure the rule
names: it looks like a card and behaves like bare background.

**Not surfaces:** borders, inset highlights, shadows, swatches, bars, focus
rings. They use white at alpha as an EDGE EFFECT and create no level a reader
perceives.

**Gate:** `verify_two_surface_levels`. Any raw white in a `background`
declaration fails the build, whatever its alpha, because a third value is how
the fourteenth arrived.

## 3. Colour

**Terracotta and cool neutrals. Nothing else.** Amber and green were removed
sitewide; good and bad are carried by **words and position**, never by hue.

- `--terra` `#c23a22` is the only accent. **Terracotta marks the answer, once
  per chapter.** Twice is no focal point.
- `--n1` to `--n5`, the neutral ramp, coolest first.
- `--faint` `#8c8c94` is **NON-TEXT ONLY**. `color: var(--faint)` on a glyph a
  reader must read is a legibility bug by definition.
- `--muted` `#5f5f67` is the one quiet text tone, and there is deliberately not
  a second: between it and the AA floor is barely a stop and a half of
  luminance, so two tones there is a flat step pretending to be hierarchy.
  **Quiet versus quieter is carried by size and weight.**
- Lines are **black at low alpha**, never a named tint, so they hold over a map.

**Colour strategy: Restrained.** Tinted neutrals plus one accent under 10%.

## 4. Spacing

```
2  4  6  8  10  12  14  16  18  20  22  26  32  40
```

**Measured 2026-08-02:** 39 distinct non-zero values across 418 declarations, a
continuous run from 1 to 20 with no gaps. A continuum, not a scale. **The steps
above are the peaks that were already there**, not an ideal ladder imposed on
them.

**The 418 existing values are deliberately NOT retrofitted.** Snapping them
moves a ratified design by up to 3px in tight components, where an odd value is
often an optical correction rather than drift, and only the founder can tell
which.

**Gate:** `verify_spacing_scale`, scoped to the React kit the loop writes.
Eleven spine-2 values are grandfathered and printed on every run, because
spine-2 ports the ratified cell mockup and a 7 there may faithfully carry a 7 he
drew. **No new entry may be added.**

## 5. Type, radius, line-height , MEASURED, PROPOSED, NOT APPLIED

| primitive | distinct | uses | state |
|---|---|---|---|
| font-size | **24** | 219 | proposal: collapse to 11 |
| border-radius | **15** | 101 | proposal: collapse to 6 |
| line-height | **15** | 34 | proposal: collapse to 7 |
| font-weight | 3 | 138 | **already clean** |
| z-index | 5 | 12 | **already clean** |

**Thirteen font sizes live inside a six-pixel band**, 9 to 15 in half-steps,
flat distribution. **A flat distribution is the signature of drift, not
hierarchy**: a real scale has peaks, because a designer reaches for the same step
repeatedly. Nobody perceives 12px against 12.5px.

Proposal and before/after renders:
`design/loop4/reviews/2026-08-02-type-radius-scale-PROPOSAL.md`.

## 5.1 Motion , APPLIED 2026-08-04. Three tokens.

```
--t-fast  90ms   colour and background
--t-move  150ms  transform
--t-slow  200ms  a width or a rail
```

Fourteen raw durations replaced. 140 snapped to 150; 180 and 220 to 200. Every
move is under 20ms and imperceptible.

**Two are deliberately left raw and are not drift.** `280ms` on two selectors,
and `750ms` on `.rise`, which is the page entrance. **Changing an entrance is a
design decision, not a tidy-up**, and it is the founder's.

The rest of this section is the measurement that produced those three tokens.

## 5.1b How the motion scale was arrived at

The Loop 4 plan listed motion as undefined, "durations and easings currently
per-component". **It is not.** One block near the end of `atlas.css` owns every
transition in the system, with a `prefers-reduced-motion` twin beside it, under
a stated rule:

> one timing scale for chrome, and **nothing that carries data is ever
> animated**

That rule is the important half and it is already obeyed. What moves is
chrome: a hover background, a summary marker, an expander's chevron. **No chart,
figure, bar or rail animates**, which is what makes "nothing that moves is
required to read the page" true rather than aspirational.

**Measured 2026-08-03: 8 durations across 17 uses.**

```
  3  90ms      5  150ms     3  200ms     2  280ms
  1  140ms     1  180ms     1  220ms     1  750ms
```

**The peaks are 90, 150 and 200.** The strays sit within 20ms of a peak, and
20ms is well under what anyone perceives: 140 is 150, 180 and 220 are 200.

**Proposed scale: 90 / 150 / 200 / 280.** 90 for colour and background, 150 for
transform, 200 for a width or a rail, 280 for the one deliberately slower move.
`750ms` is a single use and needs a reason or a home.

**Easings: 2, and that is already right.** `ease-out` for the fast chrome
transitions, `cubic-bezier(.2,.7,.2,1)` for transform. No bounce, no elastic,
nothing that overshoots.

## 5.2 Focus , DEFINED ALREADY

Also listed as missing, also present:

```css
:where(a,button,summary,input[type=range],.archetypes .pc,.archetypes .mixbar i):focus-visible{
  outline:2px solid var(--terra);outline-offset:3px;border-radius:6px}
```

**The three `outline:none` declarations are not a defect.** Each sits on a range
slider, where the browser's default outline lands on the track and reads as a
box around a line. The `:where()` rule above puts the outline back on every one
of them, so the removal is paired with a replacement rather than being a hole.
Its own comment records why it exists: *"There was no focus state in the entire
stylesheet."*

## 5.3 Elevation , APPLIED 2026-08-04, and this section was wrong

**What this section used to say was wrong, and reading the selectors is what
showed it.** It claimed 10 drop shadows falling into "a hairline lift" family
and "a panel lift" family, and proposed collapsing them to two levels matching
the two surfaces.

There is no hairline card family. **All six of those shadows are on slider
thumbs and map pins**, at `atlas.css` 238, 240, 653, 1176, 1180 and 1810. Every
one is a small round control that has to read as liftable against a 3px track.
Collapsing them into a card-elevation token would have been a category error,
and the previous version of this file would have caused it.

**What was applied:** one token, `--lift-control: 0 1px 5px rgba(0,0,0,.3)`,
replacing four values that sat within 1px of blur and 0.11 of alpha of each
other. The modal value, not their average. It is for small controls and **must
never be used as a card elevation.**

**What was deliberately not touched:**

- **The composite glass treatments.** `inset 2px 2px .5px -2px
  rgba(255,255,255,.96), 0 10px 30px -20px rgba(0,0,0,.4)` and its siblings are
  edge highlight plus drop, tuned together. They are the glass look, not a
  shadow scale, and pulling the drop out of one destroys it.
- **The 34 border and rule shadows.** Unchanged, and see below.

### box-shadow used as a border is deliberate, do not "fix" it

34 uses are **not elevation at all**: `0 0 0 1px var(--terra-line)`, `inset 0
1px 0 var(--grp-rule)`, and similar. A 1px ring drawn with `box-shadow` costs no
layout box, which a `border` does. **They are correct and they are not part of
any elevation scale.** Any future audit that collapses "all box-shadows" will
destroy 34 working borders.

**One observation, not a change:** `inset 3px 0 0 var(--terra)`, a 3px
terracotta left stripe, appears on 4 selectors. General frontend guidance treats
a coloured side stripe as a reflex to avoid. **It is in the founder's ratified
mockup, so it stays.** Recorded here so nobody removes it as a lint.

## 5.3b The old proposal, kept for the reasoning

**Measured 2026-08-03: 10 distinct drop shadows across 13 uses.** Nearly every
shadow in the system is unique, which is drift by definition.

They fall into two families and nothing sits between them:

| family | values found | uses |
|---|---|---|
| **a hairline lift** | `0 1px 5px rgba(0,0,0,.3)`, `0 1px 5px rgba(0,0,0,.24)`, `0 1px 4px rgba(0,0,0,.3)`, `0 1px 4px rgba(0,0,0,.35)` | 6 |
| **a panel lift** | `0 10px 30px -20px`, `0 10px 24px -14px`, `0 18px 44px -24px`, `0 2px 8px` | 7 |

**Proposal: two levels, because there are two surfaces.** A card lifts, air does
not, and there is no third. Four values within a 1px blur and 0.11 alpha of each
other are one value that drifted; the same holds at the panel end.

**Not applied.** Same discipline as type and radius: these sit in a ratified
mockup, and a shadow tuned by eye against a specific background is exactly where
an odd value is an optical correction rather than drift. **The founder rules.**

### box-shadow used as a border is deliberate, do not "fix" it

34 further uses are **not elevation at all**: `0 0 0 1px var(--terra-line)`,
`inset 0 1px 0 var(--grp-rule)`, and similar. A 1px ring drawn with `box-shadow`
costs no layout box, which a `border` does. **They are correct and they are not
part of the elevation scale.** Any future audit that collapses "all box-shadows"
will destroy 34 working borders.

**One observation, not a change:** `inset 3px 0 0 var(--terra)`, a 3px
terracotta left stripe, appears on 4 selectors. General frontend guidance treats
a coloured side stripe as a reflex to avoid. **It is in the founder's ratified
mockup, so it stays.** Recorded here so nobody removes it as a lint.

## 5.4 Icon sizing , two sizes, and 4 stray uses

**Measured 2026-08-03: 18px (23), 13px (12), 16px (3), 24px (2).**

**The scale is 18 and 13.** 18 for a section or chapter header, 13 for a glyph
inline in a row.

**APPLIED, not merely proposed**, because unlike type and radius these values
are loop-authored rather than ratified: the three 16px uses in
`city2/page/CityPage.tsx` all sat inline in a `.row .nm`, which is the 13 case,
and are now 13. **Now 18px (24) and 13px (15), carrying 39 of 41 uses.**

The remaining two 24px uses are on card tiles, where a larger glyph may be
deliberate. Left alone rather than snapped, and named here so the next audit
does not have to rediscover them.

## 5.5 The row, and the two defects it hides

**Every rule for `.row` is scoped `.statblock .row`. There is no bare `.row`
rule.** A row without a `.statblock` ancestor gets no grid, no columns and no
separation: its spans render fused, and the page reads *"Young
professionals15%"* or *"Londonmeasured16,765"*.

**It looks like ordinary prose.** Nothing is missing, the words are just joined.
Measured 2026-08-03: **125 of the city page's 129 rows**, on a page that had
been delivered as complete. TypeScript cannot see it and no gate can.

**A run of rows belongs in:**

```jsx
<div className="panel pad rise">   {/* BOTH classes on ONE element */}
  <div className="statblock">
```

`.panel.pad > .statblock` is the rule that strips the inner border so a card
does not render inside a card. **`<div className="panel"><div className="pad">`
does not match that selector**, which is exactly what the city page had.

**Never fix this by adding a bare `.row` rule.** The stylesheet is the founder's
design; the call site is the loop's, so the call site moves.

### The value slot is a 78px figure column

`--val-col` is `78px`, tuned for `$414K`. **A longer string is clipped silently,
mid-word, with no ellipsis:** *"24% of hou"*, *"Low spare"*, *"Best in Shore"*.
51 values across the three v2 pages were clipped; one was a whole paragraph
needing 1036px.

**The rule: the value slot takes the figure. The qualifier goes in the name's
`.s`,** which has room. Where the value is genuinely a short phrase rather than
a figure, widen `--val-col` on that row, which is what the variable is for.
**Widening it to hold prose is the same mistake as putting prose there.**

**Tool:** `node scripts/audit_row_layout.mjs`. Not a prebuild gate: both defects
are invisible in source and need a laid-out page, so it wants a running dev
server.

## 6. Stacking and non-overlap

| layer | z-index |
|---|---|
| content | auto |
| a label clearing its own chart | 2 |
| chapter rail, jump sheet | 15 |
| masthead | 20 |

A new layer picks one of these. **It does not invent a number.**

**Where two things can collide, the label yields, never the data.** A pill is
clamped inside the band it annotates. Where two labels would collide, one is
dropped rather than both shrinking: two overlapping labels are unreadable, one
label and a gap is readable and honest about the gap. **CSS can clamp, it cannot
detect a collision**, so anything needing runtime measurement is the component's
stated invariant.

## 7. Fonts

Geist for text, Space Grotesk for figures. **Numbers are `tabular-nums`
everywhere**, hard rule, so figures line up across rows and do not shimmer.

---

# PART TWO , THE LEGACY SYSTEM (deprecated, still shipping)

Kept because 260 files render it and a surgical fix to an unmigrated page needs
its vocabulary. **Nothing new is built in it.**

- **Surfaces:** `cream-50` `#FEFBF6` page, `cream-100` sections, white cards,
  `parchment` `#E8DDC7` borders.
- **Text:** `ink-900` `#1A1A1A` primary, `cocoa-700` `#78350F` secondary.
- **Accent:** burnt amber `#D97706` / `#C2410C`, under 10% of a screen.
- **Type:** Tiempos display, Inter body with `ss01, cv11`.
- **Elevation:** flat at rest, warm tinted shadow on `.card:hover` only, never
  `rgba(0,0,0,...)`.

**Known violations, all on the home page, each contradicting an anti-reference
in `PRODUCT.md`:** glassmorphism on the hero card, cinematic city b-roll behind
it, an identical three-card grid, and a superlative with no basis above the fold.

---

# PART THREE , RULES THAT OUTLIVE BOTH SYSTEMS

Product rules, not visual ones. They survive any repaint.

- **The denominator is the story.** No nominal figure without the unit that makes
  it real. **A design that lets the eye land on a big number without its
  qualifier has failed.**
- **A missing figure states its absence.** Never a dash, a zero, an "N/A", or a
  vanished section. **A page is always complete; its shape never varies by
  place.**
- **Every figure carries its provenance**, derived and never authored. The tier
  says which route a figure came down; it does not certify the figure is right.
- **No em dashes.** Commas, colons, semicolons, periods, parentheses. Not `--`.
- **No first person**, anywhere, including FAQ answers.
- **No source-agency names** in anything a reader sees.
- **Banned vocabulary:** "turnover", "covers", "pp", "percentage points", "net
  margin".
- **Never rename a URL slug.**
- **No raw hex, px or ms in components.** Tokens, or a documented exemption.
  Image routes are exempt because a canvas cannot read a custom property, and
  even there the map reads its ramp from the stylesheet at runtime rather than
  copying it.
- **Answer first, controls below.** Ratified decision 13.
- **Tap targets 40px minimum.**
- **Nothing that moves is required to read the page.**
