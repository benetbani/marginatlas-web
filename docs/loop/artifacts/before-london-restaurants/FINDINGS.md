# Baseline — the London restaurant page, 2026-08-21, before any change

Phase 0 of `docs/superpowers/plans/2026-08-21-scope-taxonomy-and-surface-reform.md`.
Rendered from the real route, stylesheet compiled after the render, spine sheet
appended, served on one origin, driven with the Playwright MCP.

## Measured

| | 1280 | 375 |
|---|---|---|
| Page height | **9,079px** (about 10 screens) | **12,802px** (about 16 screens) |
| Content width | 1,265 | **371** |
| Viewport width | 1,265 | 360 |
| Horizontal overflow | none | **yes, 11px** |
| Sections | 21 | 21 |
| Type family | Geist, resolving correctly | same |

## Findings

**1. The page scrolls sideways on a phone.** 371px of content in a 360px
viewport. The culprit is the currency switcher, "Show numbers in: USD EUR GBP JPY
CAD AUD": a label plus six pills on one unwrapped line. It sits outside any
section, so it is chrome rather than content. This closes readiness criterion G14
for this page type, which was previously measured only on the homepage.

**2. The last section repeats the second section word for word.** `#honest-take`
near the top and `#one-thing` at the close both read: *"The headline revenue is
real, but a London restaurant is a wages-and-rent business, not a high-margin
one."* The dossier recorded this defect for 252 city pages. It is on the trade
page too, and it was not previously known to be.

**3. THE SECTION COUNT CORRECTS THE PLAN. 21, not 7.** The plan asserted the
trade page has seven sections, taken from `CELL_PAGE_SECTIONS` in
`src/lib/page-layout/section-order.ts`. That list is **stale**: it names
`revenue-tiles`, `revenue-distribution`, `margin-waterfall` and
`tax-and-cost-panel`, none of which render. What actually renders, in order:

    honest-take, narrative, plain-terms, money, cost-drivers, owner-take-home,
    break-even, wages, startup-cost, seasonality, first-year, nearby,
    operator-voices, risks, vs-world, locals, contrarian, myths, fit,
    gut-check, one-thing

**Consequence for Phase 6, and it is material.** The plan said there was "plenty
of room" for ten new sections. There is not: 21 plus 10 is 31, which runs
straight into the founder's own complaint that pages are unskimmable. Several of
his requested sections must **replace** rather than **add**:

| His request | The section it should absorb |
|---|---|
| Burglary, lawsuit, penalty risk | `risks` (already exists) |
| Pay as a share of takings | `wages` (already exists, currently the four hardcoded wage tables) |
| Personas by wealth, resident type, age | `locals` (already exists) |
| Four-plus-one onward rail | `nearby` (already exists, currently the fixed multipliers) |

Six of the 21 are opinion sections clustered at the close: `operator-voices`,
`contrarian`, `myths`, `fit`, `gut-check`, `one-thing`. That is where the length
is, and `one-thing` is already a duplicate (finding 2).

**4. Both of the founder's named defects are visually confirmed.** `wages`
renders "Head chef $52,000 / Server $28,000 / Kitchen porter $24,000", the
hardcoded table that is identical across every cafe, bar, bakery and restaurant.
`nearby` renders Manchester, Birmingham, Leeds and Bristol, the four fixed
multipliers.

## Instrument notes, so the next run does not re-pay for these

- **The masthead is `position: sticky`, and a full-page screenshot paints a
  sticky element wherever the viewport happened to be.** The first pair of shots
  had a second masthead dropped into the middle of the page, hiding content. That
  is the instrument, not the site. The fixture now carries a `<style
  id="shot-overrides">` block setting it `relative`. **Not `static`:** static is
  not painted at all on this site, because the fixed photograph paints over it.
- **`browser_evaluate` after a resize blanks the page**, and the recovery
  navigation **resets the viewport to the window default** (measured: 1536 wide
  when 375 was asked for). A height read after that recovery is a desktop height
  wearing a phone label. Verify `window.innerWidth` before trusting any
  post-recovery measurement, or avoid the evaluate entirely, which is why the
  sticky override moved into the fixture.
- **`scripts/shoot.mjs` cannot serve a non-homepage route.** It re-renders the
  homepage as its first step and takes no route argument.
  `scripts/serve_shot.mjs` is the serve half on its own, and renders nothing, so
  it can never overwrite the render being looked at.
- Cell lookups exceeded the 4s budget once during the render
  (`getNudgeNeighbor`). That is the documented local trap: data bands self-omit
  from this machine and render in production. **Never a layout finding.**

## What this baseline cannot tell you

It is a server-side render, so anything that appears only after the page becomes
interactive is absent. It proves what the browser paints. It does not prove the
founder likes it.
