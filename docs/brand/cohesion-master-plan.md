# Cohesion Master Plan (R7)

A site-wide design/architecture audit and the plan to make every page type read as
one authored object. Content is out of scope here; this is visual language,
hierarchy, and structure only. Companion law: [section-constitution.md](section-constitution.md)
(what each page contains). This document governs how it all LOOKS and coheres.

Audit method: a seven-lens critique (brand identity, visual hierarchy, one design
system, cross-page cohesion, information architecture, mobile, distinctiveness),
forced into one consensus. (The parallel-critic run was rate-limited server-side;
the audit was run by the design lead with the same lenses, to be re-verified by an
independent critic pass when the server clears.)

---

## The diagnosis: the site speaks two visual languages

The single biggest cohesion failure is that the site now carries TWO design
languages that do not reconcile:

1. **The warm SaaS kit** (cell, city, industry, home): BeatCard grammar, white
   cards on cream with an elevation scale, RangeStrip / charts / tables, the warm
   frame currently flag-gated OFF in most views.
2. **The engraved almanac** (country, just built): compass rosette, contour
   field, engraved skyline, the clay-to-moss meaning scale, Fraunces display,
   the eng-* section shells.

A reader walking country to city to cell feels two different products. The
supporting failures, by lens:

- **Brand identity:** a split skin. Two motif languages, two card treatments. No
  single identity carries across types.
- **Visual hierarchy:** each page type sets its own heading scale and its own
  first-screen contract. The answer-first discipline is not enforced site-wide.
- **One design system:** duplicate components (VsWorld, OneThing, GutCheck,
  HonestTake exist in BOTH `kit/blocks` and `kit/engraved`), ad-hoc section
  shells, and the unifying warm frame shipped OFF, so the cohesion layer is
  invisible in production.
- **Cross-page:** the chrome (header/footer) is shared, but the section language
  and the framing diverge hard between country and the rest.
- **Information architecture:** the constitution exists, but only the country
  page is wired to it; the other types predate it and improvise.
- **Mobile:** each type improvises its own reflow rather than sharing one rule.
- **Distinctiveness:** the engraved country page is genuinely one-of-a-kind; the
  SaaS pages read closer to generic. The site is most itself where it is engraved.

---

## The decision: one language = engraved frame, clean data core

The site adopts a single visual language, a reconciliation rather than picking one
existing skin whole:

- **The engraved almanac is the IDENTITY layer.** The chrome, the hero and
  section shells, the motifs (compass, contour, rosette, the divider family), the
  meaning scale, the Fraunces display cut, and the honest sample-state become the
  shared vocabulary of every page. This is the distinctive, brand-true direction;
  it is what makes the site un-generic, and it is the founder's chosen look.
- **The data core stays clean.** Tables, charts, the RangeStrip spread, the
  money-goes breakdown, the scorecards, the make-it-yours calculator render
  crisp, opaque, high-contrast on cream. The engraved texture lives only in the
  frame and shells, never behind a number. This is the standing law (warmth in
  the frame, data clean) made site-wide.
- **The warm frame ships ON by default** (gutters + per-category hero wash +
  glass chrome) as the unifying framing layer, the same on every page type.

Net: every page = engraved frame + engraved section shells + the clean data core.
One identity, one hierarchy, one rhythm, with the data always the star.

---

## Global system plan (the foundation wave, build first)

1. **One token + style layer.** Fold the engraved CSS-var layer into the canonical
   design system. One type scale anchored on Fraunces (display) + Inter (text +
   all figures, tabular). One spacing rhythm. One hairline + elevation language.
2. **One set of section shells.** The engraved shell (hairline card, eyebrow,
   compass/contour accents) becomes THE section shell. Reconcile BeatCard to it
   (restyle, do not fork). One divider family (AtlasDivider) site-wide.
3. **Dedupe components.** One VsWorld, one OneThing, one GutCheck, one HonestTake:
   the engraved versions become canonical; the `kit/blocks` duplicates are
   retired or re-pointed. The meaning scale is the one qualitative scale.
4. **Warm frame ON by default** (flip the flag default) so the frame coheres in
   production, with the safeguards intact (gutters collapse below 1100px, never
   behind data).
5. **One answer-first hero contract + one heading scale** applied to every type.
6. **One 375px reflow ruleset** shared by all types.

---

## Per-page-type plan

- **Country** — done; the reference instance of the unified language.
- **Cell / business** — adopt the engraved frame + hero + section shells + the
  divider rhythm; KEEP the clean data core (RangeStrip, money-goes, tables,
  make-it-yours). The lightest engraved touch of any type, so the dense data
  board stays the star.
- **City** — engraved frame + shells + hero; keep ScoreBand / VisitorSplit /
  OwnerKeepTable as the clean data.
- **Industry** — engraved frame + shells; keep the cost-structure / margin data.
- **Home** — engraved frame; reconcile the landing hero into the engraved
  language (the one page allowed extra brand expression).
- **Learn / Compare / Neighbourhood** — engraved frame + shells; clean data core.
- **Directories** (/countries, /cities, /world) — engraved frame; the
  cities-of-the-world map as the hero; engraved uniform tiles.

---

## Execution roadmap (subagent-driven)

Each wave is run with the subagent-driven-development loop (implementer, then
spec review, then code-quality review), gate-green and committed before the next.

- **Wave A, foundation:** the global system plan above (tokens, shells, dedupe,
  frame-on, one hero contract, one reflow rule). Careful + sequential (shared
  files). This is the wave that creates cohesion; everything after is adoption.
- **Wave B:** cell page to the unified language.
- **Wave C:** city page.
- **Wave D:** industry + home.
- **Wave E:** learn + compare + neighbourhood + directories.
- **Wave F:** verify (all gates + a per-type cohesion QA pass at desktop + 375px)
  -> one comprehensive preview across every page type -> promote, once.

---

## Open questions for the founder (the genuine forks)

1. **The unified language** = engraved frame + clean data core, site-wide?
   (Alternatives: go fully engraved including the data, or keep the SaaS kit.)
2. **Warm frame ON by default** everywhere (the photo gutters + hero wash + glass
   chrome as the standard chrome)?
3. **The cell/business page** kept to the lightest engraved touch (frame + hero +
   dividers only) so the data board stays the star?
4. **The country page**: promote it now as the reference, or hold it and promote
   the whole cohesive site in one go at Wave F?

---

## Locked decisions (founder, 2026-06-14)

1. Unified language: **engraved frame + clean data core**, site-wide. Confirmed.
2. Warm frame: **ON by default everywhere** (gutters + hero wash + glass chrome
   become the standard chrome). Confirmed.
3. Cell / business page: **lightest engraved touch** (frame + hero + dividers
   only); the data board stays the star, never cluttered. Confirmed.
4. Country page: **hold the promote**; commit it but ship the whole cohesive site
   together at Wave F. Confirmed.

Wave A (foundation) is built carefully in the main session (shared files, not
parallel-safe); Waves B to E (per-page adoption) run via the subagent loop.
