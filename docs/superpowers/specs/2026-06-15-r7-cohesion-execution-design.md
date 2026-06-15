# R7 Cohesion — Execution Design (the locked direction)

Status: APPROVED by the founder, 2026-06-15 (20-question intake + sign-off).
Builds on: `docs/brand/cohesion-master-plan.md` (the strategy + locked decisions) and
`docs/brand/section-constitution.md` (the section spine). Governs: `docs/verification-protocol.md`
applies to every wave. This document is the EXECUTION contract: what the cohesion waves
build, in what order, and the taste decisions behind them. It exists because the founder's
single biggest risk is "it diverges from what I pictured." These answers are the contract.

---

## 1. The locked direction (from the 2026-06-15 intake)

**Frame and identity**
1. Keep the clean data **cards as the data containers**; unify only the FRAME around them
   (chrome, hero, dividers, type). The cell/city data boards stay the star. [Q1]
2. The warm frame reads as a **clearly-felt warm tint**, never a whisper, never fighting
   content. [Q2]
3. Engraved motifs (compass, contour, skyline) appear as **one quiet moment per page**. [Q3]

**Heroes**
4. Cell / city / industry heroes **keep the answer-first masthead**; only the warm frame
   around them aligns. The lightest engraved touch. [Q4]
5. The country page **keeps its signature engraved skyline** hero. The reference instance. [Q5]
6. The anchor number stays a **confident serif anchor with the RangeStrip spread beside it**;
   sized to anchor, never to shout. [Q6]

**Type**
7. Keep the engraved layer's **dense micro-type** as almanac character. Tokenize the EXACT
   current sizes (no visible re-typeset of `/gb`). [Q7]
8. **One unified token type scale** that both the engraved and SaaS layers draw from; the
   engraved micro / display steps become named tokens in that one scale. [Q8]
9. **Serif showcase FIRST.** Before locking the display face, build a page showing 3-4
   hand-picked display serifs on real Atlas content so the founder chooses by feel. The face
   binds to the `--font-display` slot; the showcase swaps candidates into it. [Q9, overrode the
   "Fraunces is settled" recommendation]

**Seams and the data law**
10. Dividers: **labeled engraved seam on airy pages** (country), **quiet unlabeled rule on
    dense pages** (cell). `AtlasDivider` is the one family; the quiet rule is its lightest
    variant. [Q10]
11. **Data core never carries texture.** Tables, charts, RangeStrip, money-goes, scorecards
    render crisp and opaque on cream. Warmth lives in the frame only. Hard law. [Q11]
12. The scorecard becomes an **engraved hairline card, no drop shadow**. [Q12]

**Philosophy, scope, cadence**
13. When cohesion and distinctiveness conflict: **balance, leaning cohesion** — each page
    type keeps ONE signature moment. [Q13]
14. The **cell (activity-in-place) page is the most special** page type; it is the core
    product surface. [Q14]
15. At 375px, the **anchor number and answer survive prominently** first. [Q15]
16. **Retire the two dead heroes** (`VerdictHero`, `DenseCellHero`, both unused in code).
    `CityHeroV2` stays (the `_design` catalog consumes it). [Q16]
17. Execution order: **serif showcase -> hero frame -> type scale -> engraved shell (airy
    pages) -> Waves B-E adoption -> Wave F**. [Q17]
18. **Trust and drive.** The founder reviews at Wave F, not every wave. I still SEE my own
    work every wave (screenshot to verify) and commit each wave gate-green. [Q18]
19. **Light copy polish is allowed** in passing (e.g. "1days" -> "1 day"); not a copy rewrite
    pass. [Q19, overrode the "freeze copy" recommendation]
20. The founder's biggest fear: **the result drifts from what they pictured.** [Q20]

---

## 2. Execution plan (the waves)

Each wave: build -> verify (tsc + prebuild 31/31 + page-sections / section-order PASS,
no section dropped) -> SEE it (Playwright screenshot, 1280 + 375, exemplar + thin) ->
commit gate-green. The founder's comprehensive review is at Wave F.

- **A.2 dividers** — DONE (`a0a1a1ba`): retired the dead `SectionDivider`; `AtlasDivider`
  is the one divider family; docs synced.
- **A.2.5 serif showcase — DONE (2026-06-15).** Built an ephemeral route rendering a real
  Atlas masthead in four candidate faces (Fraunces, Newsreader, Spectral, Playfair Display)
  loaded via a Google Fonts link. Founder picked **Newsreader**; applied to the
  `--font-display` slot in layout.tsx (next/font), reversing the 2026-06-13 Fraunces move.
  The throwaway route was removed. (next/font crashed the dev font-worker loading the four
  at once, hence the link-based chooser; the single-face layout swap loads fine.)
- **A.3 hero frame** — align the warm frame (hero wash strength = clearly-felt tint, gutters,
  glass chrome) and the eyebrow treatment across page types. Cell/city/industry keep the
  answer-first masthead; country keeps the engraved skyline. Lightest touch, no data-board
  restructure.
- **A.4 type scale** — fold the engraved micro/display sizes into ONE unified token scale
  (exact current values; no visible re-typeset). Swap in the chosen display face once picked.
- **A.5 engraved shell + hygiene** — an `EngravedShell` for the airier page types
  (city / industry / home); the scorecard moves to the engraved hairline (no shadow); the
  cell keeps its data cards. Retire `VerdictHero` + `DenseCellHero`.
- **Waves B-E** — per-page adoption of the unified frame (cell, city, industry + home, learn
  + compare + neighbourhood + directories). The component dedupe (VsWorld / OneThing /
  GutCheck / HonestTake -> engraved canonical) happens here, as each page adopts engraved,
  not in Wave A.
- **Wave F** — all gates green + per-type cohesion QA at 1280 + 375 (screenshot every page
  type) -> one comprehensive preview -> founder review -> single promote. The held engraved
  country fix ships here.

---

## 3. The divergence guard

Because the founder reviews only at Wave F (Q18) and fears divergence most (Q20):

- These 20 answers are the contract. Every wave is checked against them.
- I SEE my own work every wave (Playwright, 1280 + 375) and only commit gate-green.
- Any decision NOT covered by the 20 answers is surfaced to the founder as a clickable
  question, never guessed silently.
- The data core stays untouched in structure; only the frame changes (limits blast radius).
- Nothing reaches production before the Wave F review (the branch is held).

---

## 4. Open / deferred

- **Seam weight on dense pages:** the quiet `AtlasDivider` rule variant is to be built
  (currently only the labeled engraved seam exists). [from Q10]
- **Display face:** DECIDED = Newsreader (2026-06-15, founder pick from the A.2.5 showcase).
- **Data-fill (Sonnet) phase:** real content for the honest-sample sections (operator
  voices, risks, vs-world on the cell; the new lens sections on country) is a separate,
  later thread. This document is visual/structural only.
