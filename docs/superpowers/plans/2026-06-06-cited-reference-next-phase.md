# The Cited Reference: Next-Phase Execution Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement each phase task-by-task (the proven pattern this session: one fresh subagent per chunk, controller dry-runs + commits + screenshot-verifies + fast-forwards). Steps use checkbox (`- [ ]`) tracking.

**Date:** 2026-06-06. Role: editorial strategist + SaaS creator + master designer.
**Goal:** Turn the now-deep data and the live break-in rating into a shareable, citable reference: a dedicated cost-to-open page type, the score woven through every surface, deeper big-economy data, and a warm-voice craft pass.
**Architecture:** Build on `reform-v2/palette-brick`, reuse the live archetype + score + trust modules, dry-run and screenshot every change on a Vercel preview, fast-forward verified pieces to production. No new data model; everything composes what already ships.
**Tech stack:** Next.js 15.5 App Router, React 19, TypeScript, Tailwind, Supabase Pro, Vercel. Existing modules to reuse: `break_in_rating.ts`, `opening_archetypes.ts`, `startup_capital_archetypes.ts`, `density_archetypes.ts`, `across_cities.ts`, `leaderboards.ts`, `cells/trust.ts`, the board kit.

---

## North star

A buyer, a journalist, or a curious operator lands on Margin Atlas, gets a trustworthy, shareable answer to "what does it take to open and win at X in Y," and cites it. The break-in rating is the one-glance verdict; the cost-to-open page is the shareable artifact; the depth underneath makes it unimpeachable. The 6-month win the founder named is "a trusted reference everyone cites." This phase builds toward exactly that.

## What is already live (so this plan does not repeat it)

Competition density, startup capital, the opening checklist (time / permits / first hires), 55 honest capital fixes, the single 0-100 break-in rating (masthead score + "why" panel, real per-cell take-home, Balanced calibration), the easiest/hardest Extremes rankings, and the homepage break-in beat. The data is deep; the score sits on top; the homepage leads with it.

## The strategic logic (why this order)

The shareable front (Phase 1) converts what we built into reach and citations now, and it is the most concrete next payoff. Weaving the score everywhere (Phase 2) turns a set of pages into one browsable instrument, which is what makes people stay and link. Deeper big-economy data plus the trust finish (Phase 3) is the long-game reference value and the precondition for ever charging. The warm-voice craft pass (Phase 4) runs alongside and turns useful into beloved. Monetization (Phase 5) is deferred per the founder, product-first.

---

## Phase 1 (execute first, detailed): the cost-to-open page, the shareable link-earning artifact

*Why first: concrete, shippable, shareable, and it rides the momentum of the homepage front. It is the founder's growth engine (shareable content) made real.*

**The page:** a dedicated URL per business-and-place, "What it costs to open a [business] in [place]," that assembles the entire entry picture in one scannable, citable surface and leads with a verdict.

**URL + render strategy (avoids a prerender/build explosion):**
- New route `src/app/[country]/[geo]/[industry]/opening/page.tsx`, a sibling of the cell page (additive, no slug renames).
- `generateStaticParams` returns ONLY the curated flagship set (the London curated deep set plus the top cities x top businesses already used elsewhere), so the static build grows by a bounded amount.
- `export const dynamicParams = true` and `export const revalidate = 86400` so every other business-and-place renders on demand and caches (ISR), the same pattern the country pages use.
- `notFound()` (never a stub) when the cell does not resolve or fails the trust gate.

**Data builder:** `src/lib/open/opening_page.ts` (new), one responsibility: assemble the opening picture for a business-and-place.
- Reuse the resolved values the cell board already computes: capital (real `realStartupCostUsd` if trusted, else `placeAdjustedStartupCapital`), `placeAdjustedPermitsUsd`, `timeToOpenWeeks`, `firstHiresCount` + role hint, and `computeBreakInRating(...)` from the real per-cell take-home.
- Add three comparison reads (budget-wrapped, trust-gated, self-omitting): the same business in 3-4 peer places (cheaper / dearer to open), and 2-3 other businesses in the same place (easier / harder to break into), each with its total-to-open and break-in score. Reuse `buildAcrossCities` and the break-in board path; do not recompute the score.
- Returns a typed object; any sub-part that cannot resolve self-omits, the page still renders its core.

**Components (board-kit visual language, tokens only, mobile-first):**
- `OpeningHero`: the headline verdict, total-to-open (capital + permits) as the hero number, the break-in rating badge beside it, the band word, and a one-line warm verdict ("Forgiving to enter, if you can stand the crowd").
- `OpeningChecklist`: the four-part checklist (capital, time, permits, first hires), reusing the existing "What it takes to open" rows.
- `OpeningPayback`: the payback math in plain words ("On a typical owner take-home of $X, you are back to profit in about Y years"), reusing `paybackYears`.
- `OpeningComparisons`: two compact strips, "Cheaper / dearer to open elsewhere" and "Easier / harder businesses to break into here," each linking onward.
- A quiet share/cite affordance and clear cross-links back to the cell, the comparison page, and Extremes.

**SEO + sharing:** `generateMetadata` per page (title "What it costs to open a [business] in [place]", description carrying the total and the score), an Open Graph card, and a sitemap entry for the flagship set. This is the citation/link surface.

**Cross-links in (so the page gets discovered):** a "See the full opening guide" link from the cell's "What it takes to open" section; a link from the homepage break-in beat rows; a link from the comparison page and the Extremes rows.

**Discipline:** dry-run the assembled data for ~10 representative combos (show the totals, scores, paybacks, and comparison rows) before wiring the render; screenshot desktop + mobile on preview; run the gates (em-dashes, source-agencies, useless-tiles, tokens, section-order, render-guards); fast-forward to production; confirm live.

**Payoff:** a shareable, citable page per business-and-place that answers "what does it take to open here" in one glance, the growth and link-earning front.

## Phase 2: weave the break-in rating through every surface (one connected instrument)

*Why: the score is the product's verdict; it should be everywhere a buyer looks, and every surface should cross-link into the others so the site browses like one instrument.*

- **Comparison pages** (`across_cities.ts` + `/industries/[industry]/across`): add the break-in rating as a column and a ranking dimension ("where it is easiest to break into this business"). Inputs already exist on `CityColumn`.
- **Activity pages**: show the score per place and a "easiest places to break into this business" rail; retire the legacy country rail that the geography selector now overlaps.
- **Country and city pages**: a "the easiest businesses to break into here" panel (top break-in scores for that place), trust-gated.
- **Cross-linking pass**: cell <-> comparison <-> cost-to-open <-> extremes <-> country/city, no dead ends.
- **Discipline:** each surface dry-run + screenshot-verified before ship.
- **Payoff:** the verdict is omnipresent and the site becomes browsable, not a set of islands.

## Phase 3: big-economy depth + the trust finish (the antidote to thin, the long-game)

*Why: depth was the founder's #1, and an unimpeachable dataset is the precondition for citation and for ever charging.*

- **Big-economy depth:** prioritize the largest economies; fill the highest-traffic business-and-place gaps, real where the data holds, modeled-and-labelled where it does not, always sanity-bounded and trust-gated.
- **Trust finish (the outstanding Phase 1 items from the prior plan):**
  - **Currency-as-USD beyond Mexico:** suppress the overstated non-MX local-currency bands (the AU / CA / IL / QA 15x-50x overstatements) so those cells dash honestly. Dry-run the affected set first.
  - **Wrong-industry remaps:** fix the silent mislabels and the reverse-map first-write-wins bug that tags country aggregates as one activity.
  - **extrapolated_cells band dedupe:** the layered duplicate/junk bands, a DB migration + pipeline pass, off-peak, SELECT-preview dry-run first, founder applies the migration.
- **Discipline:** every data change dry-run + shown before it ships; the no-visibly-wrong-numbers bar is absolute.
- **Payoff:** the reference becomes citable and API-grade.

## Phase 4: the warm-voice and craft pass (useful -> beloved)

*Why: the founder was emphatic about a warm mentor voice and a true publication feel; it is what turns a tool into a reference people love.*

- A short register guide, then a systematic warm-voice pass across cell / country / city / activity / cost-to-open microcopy and the break-in and verdict headlines (name the catch, kindly).
- Imagery, typography, and layout polish toward a publication feel, within tokens and the no-stock-imagery rule.
- **Discipline:** copy-only and style-only changes still screenshot-verified; do not churn already-liked, founder-tuned copy.

## Phase 5 (deferred, per the founder): the data product

*Why: product-first; monetization much later.*

- The freemium-depth line (gate the deepest data) and, after it, a documented, versioned, rate-limited pro API over cells, scores, comparisons, and rankings.

---

## Sequencing, dependencies, discipline

- **Order:** Phase 1, then 2, then 3, with Phase 4 as a continuous pass and Phase 5 deferred.
- **Dependency:** nothing in 1-4 blocks on new infrastructure; all compose live modules. Phase 5 depends on Phase 3 trust.
- **Per-phase execution:** each phase is decomposed into subagent tasks at execution time (subagent-driven-development), exactly as this session has run: one fresh subagent per chunk, controller dry-runs the data, screenshots the render on a preview, runs the gates, fast-forwards to production, confirms live.
- **The standing rules, unchanged:** dry-run + show before any data or render change; the absolute no-visibly-wrong-numbers bar; warm, honest, premium voice; lead with the answer; never a directory dump; tokens only; no em-dashes or source-agency names in user-visible source; no slug renames; precise per-file staging (never a wholesale `git add`).

## Recommended kickoff

**Phase 1, the cost-to-open page**, immediately: it is the most concrete next payoff, it is shareable and link-earning, and it converts everything already built into reach. I would execute it as: (1) build + dry-run the `opening_page.ts` data builder, (2) build the route + components, (3) screenshot desktop + mobile, (4) ship, (5) wire the cross-links, then move to Phase 2.

---

## Progress log

**2026-06-07 (during Phase 1) — a live lead-metric bug found and FIXED to production (commit `15c823d2`, shipped in `ea52118d`).** Building the cost-to-open data builder surfaced that owner take-home (the lead metric) was printing implausible NEGATIVES on a broad set of live cells (Paris cafe -$250K, NY hotels -$476K, Chicago auto -$370K, ~21 of 35 sampled). A live breach of the no-wrong-numbers bar, pre-existing and unnoticed. Founder approved "fix the foundation now."
- **Root cause:** (A) `enforceSanity` (`src/lib/cells/fill_defaults.ts`) overwrote the region-TOTAL `n_employees` with an inflated per-firm cap, which the page trusted as per-firm, overstating payroll 2x-5x; (B) `estimateNetProfit` has an upper margin clamp but no lower floor, so stacked costs drove it deeply negative; (C) the take-home logic was DUPLICATED in `page.tsx` and `opening_page.ts`, and the display vs the score read different values.
- **Fix:** (A) divide region total to per-firm BEFORE the affordability cap; (B+C) one shared `src/lib/finance/owner_take_home.ts` `resolveOwnerTakeHome()` used by BOTH the cell page and the cost-to-open builder, returning `max(structural net profit, clampMargin(net margin) x revenue)` then the larger-firm floor, so display and score always agree and nothing prints negative. Verified: 21/35 negatives to 0, healthy cells a proven no-op (35,574-combo equivalence), break-in score lights up across cities, all gates + build green, live cells confirmed positive.
- **Noted follow-up (Phase 3 refinement, not blocking):** the `hospitality = 1200 sqm` floorplate in `fixed_costs.ts` over-states rent for small inns, so NY hotels floors to ~$19K rather than reading structurally. Right-size the hospitality sqm (or scale sqm to revenue) to lift it off the floor.

**Phase 1 resume point:** the `opening_page.ts` data builder is DONE and now uses the shared take-home (so every previously-negative cell reads positive there too). The dry-run is clean. NEXT is step (2): build the route (`src/app/[country]/[geo]/[industry]/opening/page.tsx`, flagship-prerendered + ISR) and the components (`OpeningHero`, `OpeningChecklist`, `OpeningPayback`, `OpeningComparisons`), screenshot, ship, then cross-link.

**Vision refinement folded in (2026-06-07 third taste pass, see `docs/strategy/2026-06-06-VISION-AND-ROADMAP.md`):** design as a CLEAN DATA TOOL not a magazine; craft into the CELL PAGES; a real freemium-depth business model is a THIS-YEAR goal (premium depth gated), not deferred; method kept private; tagged estimates (not dashes) when unsure. Build the cost-to-open page in the clean-data-tool register accordingly.
