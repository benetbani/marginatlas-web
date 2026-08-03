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
