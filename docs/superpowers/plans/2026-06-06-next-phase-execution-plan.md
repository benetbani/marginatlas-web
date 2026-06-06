# Margin Atlas — Next-Phase Execution Plan

**Date:** 2026-06-06. Role: editorial strategist + SaaS creator + master designer.
**Grounding:** the 20-question vision quiz, the standing vision doc (`docs/strategy/2026-06-06-VISION-AND-ROADMAP.md`), and everything observed about the founder's taste: density over vagueness, every claim a real number with a hook, premium and warm over stark, no directory dumps or redundancy, and an absolute no-visibly-wrong-numbers bar.
**Branch model:** build on `reform-v2/palette-brick`, verify on preview, fast-forward verified pieces to production.

## The north star (unchanged)
"The reference atlas of business profitability." Broad as the world, warm and magazine-rich to read, built for buyers and investors to judge **where can I break in and win**, with a pro API as the data product.

## Already live (so this plan does not repeat it)
The board reform, the white-to-warm redesign, activities search + categorization, country small-tables + masthead images + the 6-vs-6 symmetry, the solo-exclusion, the revenue-suppression fix, and this session's new surfaces: the **Extremes hub**, the **business-across-cities comparison pages**, the **magazine mastheads**, and the **data-integrity trust gate**.

## The strategic logic (why this order)
A premium reference cited by buyers, and a paid API, both rest on one thing: the numbers must be unimpeachable. So **trust is the foundation (Phase 1)**. Then the product's actual promise, "where can I break in and win," needs the **score and the data that powers it (Phase 2)**. Then the **remaining decision surfaces (Phase 3)**. Then the **magazine soul (Phase 4)** that makes it beloved, not just useful. Then the **data product (Phase 5)** that monetizes it, and **scale (Phase 6)** that compounds it. Each phase ships a visible payoff; the invisible trust work is framed by what it unlocks.

---

## Phase 1 — Trust: the foundation the whole reference rests on
*Why: buyers cite it and pros pay for the API only if no number is ever visibly wrong. This is non-negotiable and it gates Phases 2 and 5.*

- **1a. One shared trust gate, used everywhere.** Extract `isTrustedLocalCell(cell)` (excludes `is_synthetic`, `coverage_tier === "X"` extrapolated, `geo_level === "country"` aggregates, and industry-id misroutes) from the comparison module and route the homepage beats, the Extremes reads, and any future arbitrary-cell read through it. (The homepage beats currently use a weaker guard and only happen to land clean.) **Dry-run:** list any homepage/extremes row that would change.
- **1b. Tighten the loose per-industry bounds** (`src/lib/qa/smb_bounds.ts`). The audit found ceilings like management consulting at $30M that let clamped values read high (the "$30M typical consultancy"). Tighten conservatively to sane per-industry ceilings. **Dry-run + show** a before/after of every cell whose displayed number changes, before applying. This is the real "no wrong numbers" fix.
- **1c. Currency-as-dollars beyond Mexico.** Suppress the non-MX local-currency band (AU, CA, IL, QA were flagged at 15-50x overstatement) so those cells dash honestly instead of overstating. Dry-run the affected set.
- **1d. Wrong-industry remaps.** Fix the silent mislabels (e.g. `metal_products_mfg -> wood_products_mfg`) and the reverse-map first-write-wins bug that tags all 541 rows as `software_development` on country aggregates.
- **1e. extrapolated_cells band dedupe** (the ~35% layered duplicate bands). The deeper cleanup: a DB migration + pipeline pass, off-peak, dry-run as a SELECT preview first.
- **Payoff:** the worst wrong numbers vanish; the dataset becomes API-grade; the score in Phase 2 is credible.

## Phase 2 — The decisive product: competition density + the market-attractiveness score
*Why: the buyer's chosen number-one view, leaning on ease of entry. This is the literal answer to "where can I break in and win."*

- **2a. Competition-density dataset.** A real firms-per-resident / saturation read per business-and-place, the chosen next dataset and the "room to enter" signal. Build from `n_enterprises` + population where held; curate/enrich the gaps; label modeled where modeled. Sanity-capped so it never reads absurd.
- **2b. The market-attractiveness score.** A first-class score per cell, ease-of-entry-weighted: setup cost, institutional friction, competition density, and the reward (owner take-home) balanced against the difficulty. The comparison page's "where to break in" (reward-per-difficulty) is the working prototype, formalize it into one scoring module. Decide explicitly: reframe the existing Atlas opportunity score toward ease-of-entry, or add this as a distinct "Break-in score" (recommend the latter, clearly named, so the two reads do not blur).
- **2c. Surface it.** A clear, beautiful score badge on every cell masthead, a "why this score" breakdown of the ease-of-entry components, and the score as a ranking dimension in the Extremes hub and the comparison pages. Warm copy: "Getting in here is [forgiving/brutal] because..." with the catch.
- **Payoff:** the buyer gets a one-glance "is this worth entering" read everywhere, and a new ranking/filter axis.

## Phase 3 — The remaining decision surfaces
*Why: completes the new-page-types the quiz chose and connects the site into something addictive.*

- **3a. Cost-to-open pages** (the other chosen page type): the full checklist per business-and-place: capital to start (have it via setup cost), realistic time to open, permits and licensing cost, and first hires. Permits and first-hires need a directional curation (a per-place permit-cost band, a per-business first-hire count), labelled modeled. A dedicated surface, cross-linked from cells and comparison.
- **3b. Weave the score and the cross-links through every surface** so a buyer can move cell -> comparison -> cost-to-open -> extremes without dead ends. The site should feel like one connected, browsable instrument.
- **3c. Retire the activity-page legacy country rail** (it now overlaps the new selector).

## Phase 4 — The magazine soul: warm voice + full editorial
*Why: the quiz was emphatic, warm mentor voice and full-editorial feel, the thing that turns a useful tool into a beloved reference.*

- **4a. Warm-voice pass, site-wide.** Systematically move the microcopy registers from blunt toward an encouraging mentor, without losing the honesty (still name the killer, but kindly). A register guide plus a pass over cell / country / city / activity copy.
- **4b. The editorial story layer.** Real written notes on flagship pages, "what it is actually like to run X in Y," the human texture under the numbers. Start with a template plus a curated first set (the flagship cities and businesses), expandable.
- **4c. Imagery and craft.** Tune the masthead intensity toward bolder where it stays legible, extend tasteful imagery, refine typography and layout toward a true publication feel.

## Phase 5 — The data product: API + the free/paid line
*Why: the chosen monetization, free site for reach, paid API for pros.*

- **5a. The API.** Structured, documented, rate-limited access to cells, scores, comparisons, and rankings. Versioned, stable shapes.
- **5b. The free/paid architecture.** Free site for reach and citation; the API (and bulk/segment exports) as the paid layer. Define gating, pricing, and the upgrade path.
- **5c. Curate the new agency activities** (the earlier decision): modeled economics for the agency businesses, labelled modeled, adding coverage the buyer audience asks for.

## Phase 6 — Programmatic scale + growth
*Why: the chosen growth engine, the SEO flywheel across the broad map.*

- **6a. Scale the new page types programmatically** across every business-and-place (comparison, cost-to-open, the score), within the trust gate so scale never ships a wrong number.
- **6b. SEO and internal linking** as the flywheel; sitemaps for the new surfaces.
- **6c. Distribution:** the Extremes hub and the editorial stories as the shareable, linkable, citation-earning front.

---

## Sequencing, dependencies, risks
- **Hard dependency:** Phase 2 (the score) and Phase 5 (the API) both require Phase 1 (trust). Do 1 first, at least 1a/1b/1c.
- **Founder-rule:** every data change in Phases 1, 2, 3a, 5c gets a dry-run and a visible before/after before it ships (you have approved this rule repeatedly).
- **Taste alignment:** every new surface leads with the answer (dashboard-first), carries real numbers, names the catch, reads warm and premium, and never a directory dump.
- **Risk:** the editorial story layer (4b) and the API (5) are the largest net-new builds; stage them, do not big-bang.

## What I would execute first (recommended kickoff)
**Phase 1a + 1b**, immediately: harden the trust gate everywhere, then dry-run and tighten the loose bounds. It is fast, it is the foundation, and it makes everything that follows credible. Then **Phase 2** (competition density -> the break-in score), the decisive product. The magazine soul (Phase 4) runs alongside as a continuous voice-and-craft pass.
