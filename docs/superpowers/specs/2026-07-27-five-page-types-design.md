# Five page types, complete by construction , design
*Approved 2026-07-27.*

---

## What this is

Bring every page type to the v2 standard: **country, city, industry,
neighbourhood, home**. The trade (cell) page is already there and is the
reference.

Two founder rulings shape everything below.

**1. Placeholder data is correct for now.** This is a design exercise, not a
research one. Real reconciled figures come later; nothing here waits on them.

**2. A page is always complete.** Its shape never varies from place to place.
Where a figure is missing the section still renders and **states what it lacks**,
in place, as a designed state. This inverts the current behaviour and is the
foundation the rest is built on.

---

## Why the inversion matters more than it looks

`M9 self-omit` is in all 44 spine2 components as `if (!data) return null`. It is
why the real trade page renders **17 chapters, not 21**: four sections vanish
because their data does not exist.

That was a defensible rule , never show a hole. The founder's ruling is a better
one for a lattice of hundreds of places: **a page whose shape changes by place
teaches a reader that some places are second class**, and a reader cannot tell a
missing section from a section that was never designed.

The replacement is not "show nothing", it is "show the absence, deliberately".
The gap becomes content: what is not published here, and that we know it.

**Consequence:** every one of the five page types must be built on the new rule,
so the inversion lands before any of them. Building city on the old rule and
converting later means converting five page types instead of one kit.

---

## Architecture

### Phase 0 , the completeness inversion

**A gap primitive.** One component, used by every section that can lack data. It
must read as intentional rather than broken, must never take the terracotta
accent (it is not the answer), must say what is absent and, where the reason is
known, why. It replaces `return null`.

**A mechanical sweep.** Every `if (!data) return null` in `src/components/spine2`
becomes a gap render. Roughly 44 components; each is a small, local, verifiable
change.

**Contract update.** `PORT-CONTRACT.md` M9 is rewritten from self-omit to
state-the-gap, with the founder's reasoning recorded, because M9 is cited across
the component headers and those citations become wrong the moment the behaviour
changes.

**A gate.** No spine2 component may return null for missing data. Negative-tested
before it is trusted, per the standing rule that a gate which has never failed is
not a gate.

### Phase 1 , fixtures lifted from the mockups

Pages must render complete without real data. The mockups already carry
illustrative values , `$620K`, `52 orders`, `$38`. Those become the fixture.

Two things fall out of that choice:

- **The fixture is the port's fidelity test.** If the React page prints the same
  numbers as the mockup, the port is faithful by construction, and a drift shows
  up as a number that changed rather than as a subjective judgement about a
  screenshot.
- **Fake data cannot be mistaken for real.** Fixtures live outside
  `data/cells/`, which holds only reconciled files. A gate asserts no fixture is
  ever loaded by a live route.

### Phase 2 , city and country

Both already have ratified mockups the founder has reviewed, so no new design
decisions. Each needs: a schema, an adapter, chapter components, a page
assembly, and verification against the frozen crops.

Deliberately before Phase 3: porting a second and third page type proves the kit
generalises **before** three new designs are invented on top of it. If the kit
does not generalise, that is far cheaper to learn against a design already
approved.

### Phase 3 , design industry, neighbourhood and home

These have no current-generation design. They are drawn as mockups , the same
artifact the founder reviews , and go through his eye **one at a time**, not as
three finished pages.

**This is the highest-risk phase in the plan and it is where the previous
rejection came from.** A week of AI-invented design was thrown out. The mitigation
is procedural: propose, show, get a verdict, iterate. Never build three and
present them.

### Phase 4 , port those three

Same pipeline as Phase 2 once each design has a verdict.

---

## Cross-cutting

- **The micro-icon set** (220 glyphs, merged) supplies the visual language for
  good/bad and high/low. It is what lets a country page stop editorialising, so
  it earns its place in Phase 2 rather than later.
- **The founder's open review items** , the staff ladder around minimum wage, a
  donut for who-has-money, the hiring section, the "how long it takes to open"
  graphic , land with the country port.
- **Four icon redraws** are outstanding: `accelerating`/`slowing` and
  `fast`/`slow` collide at 13px, `at-the-median` collapses into `neutral-flat`,
  and `steady` reads as "next".

---

## What this design deliberately does not do

- **No real data.** No research waves, no reconciliation, no provenance filling.
  Explicitly deferred by the founder.
- **No deploy, no flag flips.** Everything stays behind the existing flags.
- **No new page types beyond the five.** Region and the remaining flags are out
  of scope and their existence is a separate question.

---

## Risks

| risk | mitigation |
|---|---|
| **Phase 3 is unbounded** until the founder sees it | one design at a time, his verdict gates each |
| The inversion touches 44 components | mechanical, gated, and done before anything is built on it |
| Fixtures leak into a live route | they live outside `data/cells/` and a gate asserts it |
| The kit does not generalise past the trade page | Phase 2 finds out, against an approved design, before Phase 3 |

---

## Sizing

Phases 0 to 2 are days to two weeks. **Phase 3 cannot be sized** until the
founder has seen the first design; it depends entirely on how many rounds his eye
takes. Phase 4 follows Phase 3 and is a known quantity.
