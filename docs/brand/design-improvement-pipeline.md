# The design-improvement pipeline

How the Margin Atlas design keeps getting better after a build round, and the
methodology that makes information-dense pages actually digestible. This is the
repeatable loop the founder asked for: not a one-off polish, a process.

Companion docs: [design-system.md](design-system.md) (the constitution),
[pipeline-fable.md](pipeline-fable.md) / [pipeline-sonnet.md](pipeline-sonnet.md)
(the build operating model), and the research synthesis at
[_pipeline/2026-06-14-design-direction-research-synthesis.md](_pipeline/2026-06-14-design-direction-research-synthesis.md).

---

## Part 1: the digestibility methodology (how a dense page stays readable)

The Atlas pages are deliberately full, not minimal. Density is the product.
Calm comes from organization, never from hiding content. The seven moves that
carry it:

1. **Answer first.** The bottom line and the key number sit in the first frame.
   Everything else is the detail behind that answer. A reader who stops after
   the masthead still leaves with the answer.
2. **The warm-frame, clean-data law.** Warmth (photography, the hero wash, the
   glass chrome, the gutters) lives in the FRAME, around the reading column. The
   data column stays cream and opaque, high-contrast. No number ever sits on
   imagery or behind glass. This is non-negotiable and gate-adjacent.
3. **One grammar, repeated.** One card surface + one elevation scale, one type
   scale, one table system, one chart family, consistent section names across
   page types. A reader learns the page once and reads every page faster.
4. **Charts only when the shape matters.** A distribution or a spread earns a
   chart; a lone figure does not. The signature RangeStrip shows the spread at
   ~7 gradations so a typical number never stands alone. Everything else is the
   number, plainly set.
5. **Grouped emptiness, never a wall.** Every required section is always present.
   Where data is not yet held, a run of three or more empties collapses into one
   calm "still filling in" strip that still names and anchors each section. Thin
   pages read honest-and-tidy, never broken, never a stack of dashed cards.
6. **Progressive disclosure for depth only.** The deepest, most technical
   sections collapse by default; everything else is visible. Sticky in-page nav
   + the zoom ladder let a reader move without scrolling blindly.
7. **Plain operator language.** Covers, tickets, footfall, "what you keep after
   rent and staff" - never EBITDA-speak. The copy is a sharp friend with the
   numbers, with honest opinions backed by the data.

A page is not done until it carries at least one genuinely unique thing (a data
point or a perspective) found nowhere else. If it has nothing unique, it is not
finished.

---

## Part 2: the improvement loop (the repeatable cycle)

Run this loop each round. It is the same shape whether one component or a whole
page type is changing.

```
  CATALOG  ->  BUILD  ->  GATE  ->  PREVIEW  ->  QA  ->  REFINE  ->  (repeat)
```

1. **Catalog.** Every kit primitive has a live story in the catalog at
   `/dev/kit` (and the design stories under `src/app/_design`). New work starts
   by reading the catalog so it reuses the grammar instead of reinventing it.
2. **Build in verified waves.** File-disjoint changes fan out (the workflow
   model); the lead consolidates the barrel and does the cross-page wiring. Each
   primitive is nullable-input and self-omits or shows an honest empty state.
3. **Gate.** `npx tsc --noEmit` + `npm run prebuild` (31 gates) + the section
   gate (`verify_page_sections`) must all be green before anything is committed.
   The gates encode the constitution: no raw hex/px/ms, no em-dashes, no
   source-agency names, the layering direction, typography consistency, the
   section contract, the comparative-voice rules. Green gates are the floor, not
   the finish line.
4. **Preview.** One comprehensive Vercel preview across every page type, with the
   warm frame flag on. The build runs near the database, so data renders the way
   production will. (Local dev under-renders data tables; never QA data on it.)
5. **QA, per page type.** Walk the checklist in Part 3 on a filled exemplar
   (London / the UK) AND a thin instance (a low-coverage country/city), at
   1280px and at 375px. The thin instance is where regressions hide.
6. **Refine.** What QA finds becomes the next wave's work-list. A completeness
   critic pass asks the one question that closes the loop: what is missing - a
   section unhonoured, a number unverified, a state untested?

Promotion to production is a deliberate, separate step, taken only after the
preview is reviewed and signed off. Production is never allowed to silently fall
behind verified branch work.

---

## Part 3: the per-page QC checklist

Run on a filled exemplar and a thin instance, desktop and 375px.

- **Answer-first:** the masthead carries the bottom line + the key number in the
  first frame; nothing above it competes.
- **The law:** no data sits on imagery/glass; the column is opaque cream; warmth
  is only in the frame.
- **Section contract:** every required section renders (filled or grouped-empty);
  none is missing; none self-omits silently; the sticky nav and the rendered
  anchors agree.
- **No visibly-wrong number:** every figure passes a common-sense and
  like-for-like check; no cross business-x-geography rank; no fabricated detail;
  honest dashes where a datum is not held.
- **One grammar:** cards, type scale, tables, charts all read from the one
  system; no ad-hoc surface or arbitrary value.
- **375px:** no horizontal scroll; tables reflow to the stacked form; the frame
  gutters collapse; the masthead stacks; touch targets are comfortable.
- **Interaction:** the make-it-yours marker tracks and resets; the watch/compare
  tray pins and clears; the zoom ladder links only altitudes that resolve (no
  404); switchers re-derive the page.
- **Accessibility:** AA contrast on every pairing; visible focus rings; no
  opacity-faded ink; reduced-motion respected.
- **Voice:** plain operator language; an honest take present; one genuinely
  unique thing on the page.

---

## Part 4: where the design goes next (the standing backlog)

The architecture is built; these deepen it as the data and craft land.

- **Fill the brand blocks with real content.** Operator voices, risks, street
  character, and the long tail of licences/min-wage/vs-world fill as the
  data-fill (Sonnet) phase and the raw-perspectives pipeline produce them. Each
  block already self-omits to an honest line until then.
- **Curated gutter photography.** The frame's `.atlas-placephoto` hook takes real
  place photography per category; until curated, the warm cartographic wash
  carries it. This is a curation task, not an architecture one.
- **Venue and special-zone economics.** The venue switch and special-zone reads
  (captive-venue premiums, free zones) land where the economics genuinely differ
  and the data supports them.
- **The exemplar bar.** London/UK stays the fully-filled reference; every new
  section is proven on the exemplar first, then allowed to self-omit elsewhere.
- **Motion budget.** Restrained, meaning-carrying only. Every animation must
  serve clarity; reduced-motion always gets the final state.

The standard is relentless originality, held on every page. The pipeline exists
to keep raising the floor without ever letting a page ship cold.
