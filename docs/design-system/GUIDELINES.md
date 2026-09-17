# Design-System Guidelines

**The authority for any UI work on Margin Atlas.**

Last revised 2026-05-27, shipping with the v1 design system. Read this
before adding a component, before adding a token, before adding a
className that feels like an exception. If you find yourself reaching
past this document, that's the signal to update it instead of working
around it.

---

## 0. What the gates and the harness actually enforce (added 2026-09-17)

This document describes the v1 design system as it shipped on 2026-05-27:
component API conventions, tokens, motion, accessibility floor, the catalog.
Since then the site grew a second, larger layer of enforcement that this
document never absorbed: 142 prebuild gates (`GATES` in
`scripts/prebuild_all.ts`) and four harness scripts that measure a live
render (`scripts/harness/check_archetypes.mjs`, `check_page_holes.mjs`,
`check_model_laws.mjs`, `check_readability.mjs`). Most of that layer is data
integrity, SEO and architecture and belongs to other authority documents
(`docs/architecture/`, `E:/atlas/design/loop/build/briefs/MODEL.md`). The
rows below are the subset that is a design rule: something a person building
a page needs to know about type, color, layout, a row's grammar, a card's
form, copy, or honesty on the page.

**Enforced by** names the gate's short name from `scripts/prebuild_all.ts`
(for example `no-cream`) or `file.mjs: RULE` for a rule inside one of the
four harness scripts (for example `check_archetypes.mjs: UNEQUAL`), or says
the rule is not machine-checkable and why. **Since** is the date given in
that gate's or rule's own comment. Several gates predate this repo's habit
of dating everything and are marked (undated) rather than guessed at. Every
name below was grepped against `scripts/` before this table was written and
resolves to a real gate or a real rule inside one of the four named harness
files.

### 0.1 Type and the figure face

| Rule | Enforced by | Since |
|---|---|---|
| Prose, labels and headings are the body sans (Geist). Every FIGURE is the display face, Space Grotesk, tabular lining numerals, weight 600, defined once in `globals.css` off `--font-num`. | `check_model_laws.mjs: FIGURE FACE` | 2026-09-11 |
| Nine sizes on one ladder (40, 30, 24, 20, 16, 14, 12, 10, and the retired pair do not come back); a size off the ladder is a fault. | `check_archetypes.mjs: LADDER` | (undated; the ladder itself is in `globals.css`) |
| A card's largest text is at least 1.6 times the next size down inside that card; an answer card carries exactly one answer figure. | `check_archetypes.mjs: NO HIERARCHY` | (undated; rule 16) |
| A section card carries exactly one focal figure at 30, and nothing else in it sits between 16 and 30. | `check_model_laws.mjs: FOCAL` | 2026-09-08 |
| A hero fact cell's own figure wraps to at most two lines. | `check_model_laws.mjs: TWO-LINE CELL` | 2026-09-08 |
| A 10px size is for a mark a reader glances at, never a column head or a label a reader must read. | `check_readability.mjs: READ SIZE` | 2026-09-08 |

### 0.2 Color, the accent, and the palette

| Rule | Enforced by | Since |
|---|---|---|
| No cream, no warm paper tint, anywhere on the site. A ratchet: the count may only fall. | `no-cream` | 2026-08-16 (his ruling), gate registered in the 2026-08-17 purge |
| The palette is terracotta plus cool neutrals only: no green, no amber, no brown, checked by hue rather than by class name. | `palette-membership` | 2026-08-09 |
| A color class must resolve to a real step on the current palette; the stock Tailwind ramps were replaced, not extended, so a stray class now emits nothing rather than a stray hue. | `token-steps` | 2026-08-17 |
| No raw hex in a component; pull from `design-tokens.ts`. | `no-hardcoded-hex` | (undated for the core baseline; the `ZERO_BASELINE_FILES` refinement is 2026-07-12) |
| Every color token that carries text clears WCAG AA. | `token-contrast` | measured clean, then negative-tested, 2026-08-08 |
| At most three accent (terracotta) figures on a page, named in advance, one per movement. | `check_page_holes.mjs: ACCENT BUDGET` | 2026-09-07 |
| At most one accent-colored text per card. On a ranked-bars card the accent is a single black pill on the row the card declares its leader, not a color, and the pill sits only where the card's own `data-leader-key` and `data-feature` say it should. | `check_archetypes.mjs: ACCENT` | 2026-09-10 (task 12 and task 14) |
| The accent is derived from the value and a stated threshold at render time, never accepted as a hand-set flag from data. | `derived-accents` | 2026-07-26 |
| A figure drawn against a world track carries one placement line beside it, one fixed wording, one direction, and the track's end is never labelled with whose figure it is. | `check_model_laws.mjs: PLACEMENT` | 2026-09-08 (the ruling behind it is 2026-09-07) |
| Terracotta never appears on a heading, kicker, h1, border, hover state, link at rest, control, pill, icon stroke, or table cell. | not machine-checkable because no gate reads which UI role a color declaration is attached to; the spine's known offenders were corrected by hand and are named in MODEL.md PART 6 | 2026-09-07 |
| At most one loud card per band, no two loud cards on one horizontal level, at least two quiet cards between two loud ones. | not machine-checkable because judging a card's loudness and a page's pacing is a reading of the whole page, not a countable property; `art-direction`'s own section J marks pacing as judgment, not machine-checkable | 2026-08-25 |

### 0.3 Layout, rhythm and full width

| Rule | Enforced by | Since |
|---|---|---|
| Full width is reserved for exactly three sections a page: the opening, one table, the close. Site-wide, on every live surface, not only the four reformed page types. | `fullwidth-sitewide` | 2026-08-27, narrowed to exactly three by his 2026-09-08 ruling ("three stands", R1) |
| No lone card in a band; a band with one child is a fault. | `check_model_laws.mjs: LONE CARD` | 2026-09-08 (the ruling is 2026-09-07) |
| Rows of equivalent elements are the same height, to the pixel, by construction. | `check_archetypes.mjs: UNEQUAL` (card-pager, city-cards, tiers-table, spectra-table, kv-grid, compare-table, mark-list rows) | 2026-09-04 (ruling 7) |
| A page's block count clears its page type's floor: 21 country, 17 city, 16 trade, 12 industry, 7 neighbourhood (provisional). | `check_model_laws.mjs: BLOCK FLOOR` | 2026-09-08, five floors since 2026-09-17 |
| The largest empty rectangle inside a card stays under a quarter of the card each way, floored at 120px. Equal heights are fixed by pairing or filling content, never by unstretching a card. | `gathered-emptiness` (static artefacts), `check_page_holes.mjs: WHITE SPACE` (a live page), `check_archetypes.mjs: LONE STAT` (a story) | 2026-08-25 |
| A card with no order for the eye (no text size at least 1.4x its own median) is a fault, except the four forms a ruling makes even: `compare-table`, `card-pager`, `pay-bars`, `terminus`. | `check_page_holes.mjs: NO LEAD` | 2026-09-07 |
| A card's text density stays under 0.55 characters per pixel of width per 100 pixels of height; past that it is a wall of prose. | `check_page_holes.mjs: WALL` | 2026-09-07 (ruling 15) |
| One prose section per page; a second `data-editorial` section loses its exemption from the density rule. | `art-direction` | 2026-09-12 (R9), folded 2026-09-17 |
| Nothing scrolls sideways and nothing truncates to a single letter on a phone or tablet. | `no-phone-sideways`, and `check_archetypes.mjs: BOTCHED MOBILE` / `check_page_holes.mjs: BOTCHED MOBILE` for the same fault on a live render | 2026-08-30 |
| A drawing that declares how many rows it holds draws every one of them at every width. | `check_archetypes.mjs: ROWS CUT`, `check_page_holes.mjs: ROWS CUT` | (undated; the sheet's copy of the page-filter rule) |
| One card radius across the whole site. | `radius-uniform` | 2026-08-27 (task 6) |
| An element declares one CSS `display` value, never two colliding in the same class string. | `one-display` | found and gated 2026-08-25 |
| A drawing that carries a measurement (a fixed viewBox) never stretches its own geometry; it is given a fixed height too. | `no-scaling-drawings` | reached zero 2026-08-24 |
| A mark placed by percentage stays inside its own track; nothing hangs off the end of a scale. | `scale-end-clamps` | (undated; "the 2026-08 loop") |
| Spacing lands on the ladder's own rungs, not a guess at the moment of writing. | `spacing-scale` | measured 2026-08-02 |
| The icon scale is five sizes (18, 13, 24, 14, 16) and the radius scale is four tokens plus three named exceptions on the current v2 surface; nothing else. | `v2-scales` | (undated; DESIGN.md's scale, measured against the surface) |
| The two stylesheets (Tailwind and the spine CSS) declare the same type ladder; an off-ladder size may only shrink, never grow. | `type-ladder` | founder, 2026-08-21 |
| A prose-width cap and a phone/tablet grid-pairing breakpoint may only shrink toward one true measure; `sm:` two-up pairings (which never fire on an actual phone) may not grow. | `width-discipline` | founder, 2026-08-21 |
| A page's declared visual forms stay under its page type's cap; sameness itself is counted, not only whether each individual form is legal. | `form-variety` | 2026-09-01 |
| A page's rendered sections match its own blueprint's SPINE table exactly, in order, with no unknown section and no missing one. | `blueprint-conformance` | 2026-08-29 |
| A section is replaced, never deleted; sentences are cut, sections are not. | not fully machine-checkable beyond the block floor above, which catches a page falling below its count; a gate cannot distinguish a deliberate cut from a floor violation on its own | 2026-09-07 (decision 3) |

### 0.4 The grammar of a row

| Rule | Enforced by | Since |
|---|---|---|
| A label is three words maximum (two for a spectra trait name), a noun phrase, one line at every width. | `check_model_laws.mjs: ROW SENTENCE`, `model-laws-copy` | 2026-09-08 (the ruling is 2026-09-07) |
| A label sits in the very next column after its figure; never separated by leftover width, and never a `justify-between` row on a card wider than 420px. | `check_model_laws.mjs: LABEL GAP` | 2026-09-08 |
| One unit per column, said once in the column head, never mixed and never repeated in a cell. | `check_model_laws.mjs: UNIT MIX` | 2026-09-08 |
| A comparison table prints absolutes only: no "same," no signed or percent difference, no multiple, no bare word where a figure belongs, and the home row is never crowned as the best. | `check_model_laws.mjs: BANNED WORDS`, `model-laws-copy` | 2026-09-08 |
| A label never stands where a number goes; a cell that cannot hold an honest figure is withheld with a stated line, never filled with a word. | `check_archetypes.mjs: NO FIGURE` (mark-list rows) | 2026-09-10 (his words) |
| Featuring one member of a set requires a reason a reader would accept; a ranking is not automatically an answer. | `check_archetypes.mjs: ACCENT` (the ranked-bars pill and its `data-feature` declaration) | 2026-09-10 (task 14) |
| A district row carries no adjective, tag word, or one-word summary; `tagLabel()` feeds nothing. | `check_model_laws.mjs: DISTRICT ADJECTIVE` | 2026-09-08 (unmeasured on a live page today; the free-text markup it watches for was deleted, so the rule stands as a guard against its return) |
| A wealth or population read ships as one of a small set of named bands from a closed, capped vocabulary, never as an index number. | `district-wealth`, `district-mix`, `population-mix` | ratified 2026-07-31 |
| Business subtypes: at most ten per trade, repeat frequency banded rather than counted. | `subtypes` | ratified 2026-07-31 |
| Every string on a card is read aloud before it ships; known-bad shapes (a bare comparative, an invented index name, a unit with no subject) are refused even when no word on a banned list appears. | `model-laws-copy: BANNED CONSTRUCTION` | 2026-09-10 |
| Six or more ranked members are read top to bottom as a table, never left to right as columns; a name prints once, not once in the chart and once in a notes list. | not machine-checkable; a page's reading order is judged by eye | 2026-09-07 |
| A row that navigates carries an arrow and a hover; a row that does not carries neither. | not machine-checkable from a static render; no gate distinguishes a clickable row from a static one by behavior | 2026-09-07 |

### 0.5 Cards and forms the harness defends

| Rule | Enforced by | Since |
|---|---|---|
| City cards in one row share a height, by construction; no city name clips in either direction on a phone; a card reads taller than it is wide; nothing on it is drawn larger than the city's own name. | `check_archetypes.mjs: UNEQUAL`, `BOTCHED MOBILE`, `NOT TALL`, `WRONG FORM`, `NO HIERARCHY` (city-cards) | 2026-09-10 (task B11) |
| No page and no card carries a background photograph, with one named exception: the city card's own placeholder image, declared in exactly one file. | `no-background-photo` | banned 2026-09-07, the city-card exception is 2026-09-11 |
| Where the city card does carry its placeholder photograph, the city name clears 4.5:1 contrast against the photograph's darkest region, composited from the real overlay layers rendered on the page. | `check_archetypes.mjs: CONTRAST` (city-cards) | 2026-09-11 |
| No card is glass any more: no `backdrop-filter`, no translucent card background. | `frost-reads` | required until 2026-09-07, inverted to ban it 2026-09-08 |
| A bento cluster holds three or four cells, tiles its rectangle with no gap and no overlap, and does not open a hole when it collapses to a narrower grid. | `check_archetypes.mjs: CELL COUNT`, `TILING`, `NO HOLE ON COLLAPSE` (bento-band) | 2026-09-10 |
| A universal list card's rows are one height by construction, the drawn row count matches the declared count, and a withheld member is named rather than left blank. | `check_archetypes.mjs: UNEQUAL`, `ROWS CUT`, `NO FIGURE` (mark-list) | 2026-09-10 (task B3) |
| A universal list card's marks, where present, are all one height and one width, letterboxed rather than stretched. | `check_archetypes.mjs: MARK MISSING`, `MARK SIZE` (mark-list) | 2026-09-10, the width half 2026-09-11 |
| An income breakdown's segments plus net sum to 100 within tolerance; no segment renders under six pixels wide; the legend names exactly the drawn segments, no more and no fewer. | `check_archetypes.mjs: DOES NOT ADD UP`, `SLIVER`, `LEGEND MISMATCH` (income-breakdown) | 2026-09-10 (task 11) |
| A detail panel (the plus) is closed on arrival, its summary is one line, and nothing behind it is a graphic; a figure already visible collapsed is never repeated inside it. | `check_archetypes.mjs: OPEN ON LOAD`, `SUMMARY WRAP`, `HIDDEN GRAPHIC` | review wave 2026-09-08 |
| A terminus carries at most three doors and one pill, doors start with distinct words, and a door holds to one line from tablet width up. | `check_archetypes.mjs: OVERLOAD`, `NO HIERARCHY`, `REPETITION`, `BOTCHED MOBILE` (terminus) | (undated in this file) |
| A ranked-bars card's tracks share one left edge and one length, and its bars rise in the order of their own values. | `check_archetypes.mjs: TRACKS ADRIFT`, `OUT OF ORDER` | 2026-09-10 (task 13) |
| A figure drawn against a world track never rises above the world-maximum rule drawn on the same card. | `check_archetypes.mjs: WORLD MAX` | (undated in this file) |
| A section-level answer card draws no h1; a page-level one draws exactly one. | `check_archetypes.mjs: HEADLINE` | 2026-09-08 (run 23) |
| A subtitle promising registration renders only when a registration cell actually renders. | `check_archetypes.mjs: PROMISE` | (undated in this file) |
| No micro-label repeats inside one card. | `check_archetypes.mjs: REPETITION` | (undated in this file) |
| A note list caps at five notes, a label holds to one line, and a fact holds to four lines. | `check_archetypes.mjs: WALL OF TEXT`, `OVERLOAD` (note-list) | 2026-08-27 (the wall-of-text verdict) |

### 0.6 Flags and imagery

| Rule | Enforced by | Since |
|---|---|---|
| A flag is a rectangle: never rounded, never stretched or cropped, always tall enough to read. | `flag-marks` | 2026-08-27 (task 6) |
| Every flag on the site renders at one fixed width from a token, fitted inside that box with `object-fit: contain` (letterboxed) rather than stretched to fill it. | `check_model_laws.mjs: FLAG`, `check_archetypes.mjs: MARK SIZE` (a flag used as a list mark) | 2026-09-11 |
| No stock photography; a frozen allowlist of the files that already reference one may only shrink, never grow. | `no-stock-imagery` | ratchet frozen against the 2026-06-06 overhaul plan's rule |

### 0.7 Copy, honesty and language

| Rule | Enforced by | Since |
|---|---|---|
| No em dashes in user-visible source; period, comma or colon instead. Already stated in section 7.3 above. | `no-em-dashes` | (undated in the gate's own comment; Plan v16 Block G) |
| No source-agency name (a national statistics body, a named index provider) in user-facing copy; a public export emits a derived coverage tier, never a raw provenance field. | `no-source-agencies`, `export-columns` | (undated; Plan v18 / R-002) for the copy ban, 2026-07-31 for the export |
| No banned trade jargon in rendered copy: "turnover," "covers," "percentage points," and "net margin" specifically at city or country altitude. | `banned-vocabulary` | 2026-07-27 |
| A sentence already found false and deleted may not reappear elsewhere on the page. | `retired-claims` | (undated; found twice in one session) |
| No sentence-initial descriptive-voice opener ("Typical operators...", "Most firms..."). | `comparative-voice` | ATO Phase 4 (undated) |
| A modelled or sampled figure's mark is hidden behind one site-wide switch, default off, never deleted string by string; flipping it must bring every mark back at once. | `sample-tags` keeps the mechanism wired; the switch itself is `areSampleMarksVisible()` in `src/lib/feature_flags.ts` | rulebook v1 rule 4; the switch is 2026-09-11 |
| A modelled figure is never shown as real; a blocked section ships filled and labelled sample rather than a page of dashes. | `sample-tags`, `archetype-copy` (the TAG check) | rulebook v1 rule 4 |
| A fill value equal to a data file's own default is withheld with a stated line rather than printed as an observed figure. | `shared-revenue` covers the case of one fill shared across countries; the general rule is not fully machine-checked beyond that case | 2026-09-12 (R11), the shared-revenue gate itself 2026-08-01 |
| No raw population figure printed as a headline, and no section titled "easiest to start." | not machine-checkable; these are two named bans a person checks against MODEL.md PART 9 clause 34 | 2026-09-07 |
| No unknowable metric asserted as a figure, and no conclusion sentence in a header, subtitle, or footer; every section is understandable from its graphic alone. | not machine-checkable in general; `comparative-voice` and `retired-claims` catch known instances of the shape | 2026-09-07 |

### 0.8 Readability and accessibility beyond section 4.2

| Rule | Enforced by | Since |
|---|---|---|
| A paragraph's longest rendered line stays under 78 characters, measured from the real line boxes, not estimated from height. | `check_readability.mjs: MEASURE` | founder, 2026-09-08 |
| Text clears 4.5:1 against what is actually behind it, compositing the text's own alpha and every ancestor's background and opacity, not just the first solid color found. | `check_readability.mjs: CONTRAST` | 2026-09-08 |
| Line height is at least 1.35 times the font size for any text over two lines. | `check_readability.mjs: LEADING` | 2026-09-08 |
| Every table header a reader can reach declares which cells it labels (`scope`), except a self-closing corner cell that labels nothing. | `table-semantics` | measured at zero, 2026-08-21 |
| Every image has alt text, every icon-only control has an aria-label, no link reads "click here," and every input has a label. | `a11y-static` | wired 2026-08-20 |
| Every shipping page reaches an h1 within three import hops of its own file. | `page-has-h1` | (undated; found on `/margin-index`) |

### 0.9 Process guards behind the design system itself

These are not rules a page shows a reader; they are what keeps the two
layers above from drifting apart again the way this document drifted from
them. Listed because "the authority for any UI work" now includes the
mechanism that keeps an authority document honest, not only the rules it
states.

| Rule | Enforced by | Since |
|---|---|---|
| The prebuild gate list exists in exactly one place; no second hand-written chain may enumerate gate scripts. | `single-gate-chain` | 2026-08-19 |
| A generated count (like the gate count at the top of `CLAUDE.md`) is regenerated, never hand-typed. | `counts-fresh` | 2026-08-19 |
| The section census, which sections a page actually renders, is generated from source, never hand-maintained in a document. | `census-fresh` | 2026-09-17 |
| Every spine section sits on a cataloged archetype, or is named with a reason in the exceptions file; the exception set only shrinks. | `archetype-coverage` | 2026-09-06 (run 9) |
| A review round may only improve on the round before it, per page. | `critique-rounds` | 2026-08-27 |
| A claim that a gate holds a rule is checked against what actually runs, not assumed from a document. | `art-direction-coverage` | 2026-08-25 |
| An approved design-registry section is locked once approved (its crop hash cannot change silently). | `registry` | (undated) |

---

## 1. The mental model

The design system is **what's documented and rendered on `/_design`**.
If it isn't there, it isn't a primitive yet: it's either application
code or it's debt waiting for a refactor.

Three layers, top down:

| Layer | Lives in | What's here |
|---|---|---|
| **Application** | `src/app/`, `src/components/sections/`, `src/components/empty/`, page-specific files in `src/components/` | Pages, sections, domain-specific compositions. Consumes the system. Does NOT define new tokens. |
| **Domain primitives** | `src/components/` (root level files like `CoverageIndicator`, `KeyBenchmarkBanner`) | Atlas-specific widgets that wrap system primitives with business semantics. Reuse the system; never bypass it. |
| **System primitives** | `src/components/ui/` and `src/components/ui/motion/` | The catalogued, documented, accessible, themable foundation. Buttons, pills, skeletons, money, etc. Everything composes from tokens. |
| **Tokens** | `src/lib/design-tokens.ts` | The atomic values. Color, type, spacing, radius, elevation, motion, z-index. Single source of truth. `tailwind.config.ts` imports from here. |

Movement is **upward only**: domain wraps system, application wraps
domain. A system primitive that imports from `src/components/sections/`
is broken architecture, full stop. The `verify_layering` gate enforces
the application-to-data boundary; we trust authorial judgment for
domain-to-system but flag it in PR review.

---

## 2. Decision tree: do I need a new primitive?

```
Want to build something?
│
├─ Is it on /_design already?
│   └─ YES → use it. End.
│
├─ Can two existing primitives compose into what you need?
│   └─ YES → compose them in your application code. End.
│       (e.g. <EmptyState> + <InlineLink> for a "no data, try X" panel)
│
├─ Is the visual unique to one page?
│   └─ YES → keep it page-local in src/components/sections/.
│       Do NOT add it to ui/. End.
│
├─ Will three or more independent surfaces use it?
│   └─ NO  → reconsider; build it in the page that needs it first,
│           promote to ui/ only when the third consumer appears.
│   └─ YES → it's a primitive. Build it in ui/.
│              See §4 for what every primitive must satisfy.
```

The "third consumer" rule is the only one worth memorizing. Premature
primitives ossify the wrong API. Lived-in code is easier to refactor
than scattered abstractions.

---

## 3. Tokens versus arbitrary values

**The rule:** if you're typing a hex code, a pixel value, a duration in
ms, an easing curve, or a z-index number, **stop**. Open
`src/lib/design-tokens.ts` and find the token. If the token doesn't
exist, ask whether you should add one (most cases) or whether your
value is one-off enough to deserve an inline override (rare).

### Concretely

| You're writing | Reach for |
|---|---|
| `text-[#D73A14]` | `text-atlas-500` |
| `bg-[#F5F5F5]` | ~~`bg-cream-100`~~ `bg-paper-100`. STRUCK 2026-09-17: the `cream` family was renamed `paper` on 2026-08-17 (founder ruling of 2026-08-16, "remove completely this creamy color from the page"); `cream-100` resolves to no rule today. Gates: `no-cream`, `token-steps`. See the table at the top. |
| `style={{ borderRadius: 16 }}` | `rounded-lg` (which resolves to `--radius` = 16px) |
| `style={{ boxShadow: "0 1px 3px..." }}` | `style={{ boxShadow: elevation.card }}` from `@/lib/design-tokens` |
| `transition: all 0.2s ease` | `transition-colors` (built-in) or `style={{ transition: TRANSITION.base }}` from `@/lib/motion` |
| `style={{ zIndex: 9999 }}` | `style={{ zIndex: z.modal }}` from `@/lib/design-tokens` |

### When inline overrides ARE acceptable

- One-off width/height for a specific layout shape (e.g. `width="220px"` on a Skeleton inside a custom hero)
- Decorative SVG inline styles (gradients, masks)
- Page-specific spotlight effects that don't reuse

If the override appears twice, it's a token in waiting. Add it to
`design-tokens.ts` and migrate both sites.

---

## 4. What every primitive must satisfy

A primitive lives in `src/components/ui/`. Before it gets there:

### 4.1 File shape

```tsx
/**
 * src/components/ui/<name>.tsx
 *
 * One-paragraph intent: what the primitive is for, when to reach
 * for it, when to use a sibling instead. Link to the relevant
 * ui-ux-pro-max priority section (§1 accessibility, §2 touch, etc.)
 * when applicable.
 *
 * Design system Phase X, YYYY-MM-DD.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const xVariants = cva("base classes", {
  variants: { ... },
  defaultVariants: { ... },
});

export interface XProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof xVariants> {
  // explicit props with JSDoc on each
}

const X = React.forwardRef<HTMLElement, XProps>(
  ({ className, ...props }, ref) => (
    <element ref={ref} className={cn(xVariants({ ... }), className)} {...props} />
  ),
);
X.displayName = "X";

export { X, xVariants };
```

Mandatory:
- `forwardRef` for any element that might receive a parent ref
- `displayName` set explicitly (React DevTools, error stacks)
- `cva` for any variant-bearing primitive (use `Button` as the reference)
- Named export, not default (consistent with shadcn pattern)
- The variants object exported alongside (lets consumers extend or compose)

### 4.2 Accessibility floor (WCAG AA)

Every primitive must satisfy:

- **Contrast**: 4.5:1 for body text on its surface, 3:1 for large text and non-text borders. Use a contrast checker on every variant before shipping. ~~The atlas-700 / cream-50 pair passes AA at all sizes; verify if you stray.~~ STRUCK 2026-09-17: `cream-50` never existed as a token value of its own; it was `#ffffff` (plain white) under a name that said cream, and that step was deleted outright in the 2026-08-17 purge rather than renamed, because white already has its own name. The atlas-700 / white pair passes AA at all sizes (same value, correct name); verify if you stray. Gate: `token-contrast`.
- **Focus**: every interactive primitive renders `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2`. Never remove a focus ring; if it's visually wrong, the rest of the design is wrong, not the ring.
- **Keyboard**: every interactive element reachable by Tab in source order; Escape dismisses dialogs/popovers; arrow keys for radix-based components.
- **Roles**: `role="status"` on loading regions (polite); `role="alert"` on errors (assertive). Don't hand-roll either; use the primitives that already set them (`Spinner`, `ErrorState`).
- **Labels**: icon-only buttons MUST have `aria-label`. Real headings (`<h1>`–`<h4>`) for any title, never a styled div. `aria-hidden="true"` on icons whose meaning is duplicated by adjacent text.
- **Reduced motion**: any animation must include `motion-reduce:animate-none` (Tailwind) or check `prefers-reduced-motion` via media query.

### 4.3 State coverage

A primitive isn't done until it handles:

- Default / hover / focus / active / disabled
- Loading (where applicable: buttons, forms)
- Empty (where applicable: lists, data displays)
- Error (where applicable: fetches)

If you can't articulate what the disabled state looks like, you haven't
finished the primitive.

### 4.4 Catalog story

Add a section to `src/app/_design/page.tsx` showing the primitive in
every variant and every state. The catalog IS the documentation. If
the catalog wouldn't show it cleanly, the primitive's API is too
complicated and needs simplification before shipping.

---

## 5. Props API conventions

### Names

| Concept | Prop name | Type |
|---|---|---|
| Visual tone variant | `variant` | string literal union |
| Size | `size` | `"sm" \| "md" \| "lg"` (md is default) |
| Element override (polymorphic) | `as` | `React.ElementType` |
| Wrap any element | `asChild` | `boolean`; uses Radix Slot |
| Override label for assistive tech | `srLabel` or `aria-label` | string |
| Heading level | `headingLevel` | `2 \| 3 \| 4` |
| Loading flag | `loading` | `boolean` |
| Disabled flag | `disabled` | inherited from element |
| Click handler | `onClick` | inherited |

Never invent a new prop name for a concept that already has one
above. New primitive that takes a tone? It's `variant`, not `kind` /
`flavor` / `type`.

### Slot patterns

Three patterns. Pick by intent:

1. **Single child**: primitive renders its children:
   `<Card>{...}</Card>`. Trivial.

2. **Composed parts**: primitive has named subparts:
   `<Card><CardHeader><CardTitle/></CardHeader></Card>`. Use when
   the primitive has structural slots that consumers need to control.
   Match the existing `Card` / `CardHeader` / `CardContent` pattern.

3. **`asChild` polymorphism**: primitive merges its styling into
   whatever child you pass. Built on Radix Slot. Use when a primitive
   needs to BE a link / button / other element while keeping its
   styles. `Button` and `Pill` both support `asChild`. Don't add it
   speculatively; only when a consumer actually needs it.

### What goes in the props vs. composition

If a configuration affects ONE aspect of the primitive, it's a prop.
If it changes the SHAPE of the primitive (renders extra elements,
restructures the layout), it's almost always a composed subpart.

| Configuration | Prop or composition |
|---|---|
| Color / size / tone | prop (`variant`, `size`) |
| Whether to show a trailing icon | prop (`showExternalIcon`) |
| Custom icon | prop (`icon` ReactNode) |
| Extra section beneath the body | composition (extend with subparts, do NOT add `extraSection` props) |
| Loading state | prop (`loading`) |
| Two completely different layouts | two primitives, not one with `layout="..."` |

---

## 6. Motion

Defaults that consumers should rarely override:

- Duration `fast` (150ms) for hover / focus
- Duration `base` (200ms) for state transitions (accordions, dropdowns)
- Duration `slow` (300ms) for enter / exit
- Easing `out` for entering, `in` for exiting (exit should be 60-70% of enter duration)
- `spring` for natural-feel interactions (pressed buttons, toasts)

Hard rules:

- Animate `opacity` and `transform` only. Never width / height / top / left.
- Every motion primitive applies `motion-reduce:animate-none`.
- One or two animated elements per view max. Decorative motion is noise.
- Stagger lists at 30-50ms per item, cap at 480ms total.

Pick from `src/components/ui/motion/*` first (`FadeIn`, `SlideUp`,
`Stagger`). Only reach for raw CSS keyframes when you have a documented
reason none of those fits.

---

## 7. Anti-patterns we don't ship

These are documented because they kept appearing in PR review:

### 7.1 The "styled div" headline

```tsx
// Wrong
<div className="text-2xl font-semibold">Section title</div>

// Right
<h2 className="text-2xl font-semibold">Section title</h2>
```
Headings are real `<h2>` / `<h3>` / `<h4>`. Screen readers and AI
crawlers both depend on the outline. The visual class is incidental.

### 7.2 Inline hex codes

```tsx
// Wrong
<span style={{ color: "#952509" }}>...</span>

// Right
<span className="text-atlas-700">...</span>
```
If it's not in `colors`, ask why. Then either add a token or fix the
intent.

### 7.3 The mystery em-dash

```tsx
// Wrong (also fails the prebuild gate). Written here as the &mdash;
// entity, not the raw character, so this guide's own text stays at
// zero em dashes (struck 2026-09-17, see the table at the top).
<p>Atlas is a small-business benchmark &mdash; it covers ~150 countries.</p>

// Right
<p>Atlas is a small-business benchmark. It covers ~150 countries.</p>
```
Em-dashes are banned in user-visible source (R-020). Use period,
comma, or colon. JSDoc + inline code comments are exempt; the
`verify_no_em_dashes` gate catches the rest.

### 7.4 The orphan Skeleton

```tsx
// Wrong: Skeleton renders without a role, screen readers don't know
// anything is loading
<Skeleton variant="block" />

// Right: parent owns the role/aria-live, sr-only label, lays out
// the shape composition
<div role="status" aria-live="polite">
  <span className="sr-only">Loading benchmark…</span>
  <Skeleton variant="block" />
</div>
```
Skeleton is the SHAPE. The PARENT owns the status semantics. Use
`LoadingSkeleton` for canonical page-layout skeletons that bundle
both.

### 7.5 The "good enough" focus ring

Removing or suppressing focus rings to "clean up the design" is a
WCAG fail. The ring exists for keyboard users. Make the rest of the
design accommodate it.

### 7.6 Speculative `variant="..."` proliferation

Three variants are usually right. Seven means you've baked design
decisions into your API that should have been composition. If a
primitive has more than five non-default variants, it's two
primitives.

---

## 8. Pre-merge checklist

Before requesting review on a PR that touches `src/components/ui/`:

- [ ] tsc clean: `npx tsc --noEmit`
- [ ] Prebuild clean: `npm run prebuild` (or `npm run prebuild:serial` if the parallel runner is flaky on your machine)
- [ ] New / changed primitive has a story on `/_design`
- [ ] Variants visible in catalog
- [ ] Loading / empty / error states demonstrated where applicable
- [ ] Focus ring visible at default zoom
- [ ] Contrast AA verified against every surface the primitive renders on
- [ ] Reduced-motion preview tested (browser devtools → emulate `prefers-reduced-motion: reduce`)
- [ ] Mobile preview at 375px width
- [ ] No raw hex / pixel / ms values; all from `design-tokens.ts` or its derivatives
- [ ] No em-dashes in user-visible copy
- [ ] No new `cva` enum value without a catalog example

---

## 9. Where everything lives (file map)

| Concern | File / dir |
|---|---|
| Plan + roadmap | `docs/design-system/PLAN.md` |
| Current inventory | `docs/design-system/INVENTORY.md` |
| Token reference | `docs/design-system/TOKENS.md` |
| This guidelines doc | `docs/design-system/GUIDELINES.md` |
| Typed tokens (single source of truth) | `src/lib/design-tokens.ts` |
| Motion helpers (TRANSITION, stagger) | `src/lib/motion.ts` |
| Tailwind config (imports tokens) | `tailwind.config.ts` |
| Global CSS variables (shadcn aliases) | `src/app/globals.css` |
| Decorative-utility classes | `src/styles/homepage-visual-tokens.css` |
| System primitives | `src/components/ui/` |
| Motion primitives | `src/components/ui/motion/` |
| Catalog page | `src/app/_design/page.tsx` (ADMIN_KEY-gated) |
| Legacy state components (delegate to ui/) | `src/components/EmptyState.tsx`, `LoadingSkeleton.tsx`, `empty/*` |
| Domain primitives | `src/components/CoverageIndicator.tsx`, `TurnoverBandChip.tsx`, etc. |

---

## 10. When this document is wrong

If you find yourself fighting the guidelines, that's a signal: either
the design system is missing a piece, or this document hasn't kept up
with reality. Don't work around it silently:

1. Open a PR that updates this document alongside the change.
2. Explain in the PR why the existing rule was wrong.
3. Add the new rule, the new primitive, or the new exception with a
   dated note explaining its scope.

The design system is a living artifact. The cost of letting it drift
is everyone else having to guess what's "blessed" and what's freelance.
The cost of keeping it current is one PR comment per change.
