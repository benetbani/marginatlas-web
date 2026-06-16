# Margin Atlas Design Reformation, Master Plan (25 phases)

> **For agentic workers:** REQUIRED SUB-SKILL: use superpowers:subagent-driven-development
> to execute this plan phase-by-phase. Each phase is a verified, committed wave.
> Do NOT start Phase 1 until the founder grants permission to execute (see Gate 0).

**Goal:** Replace the drifting, multi-language, dense-and-undirected page design with
one settled visual ideology (the Brand Design Constitution), realised through an
adopted open-source stack, and applied to the five locked London/UK page types so
each dense page reads calm, guided, and world-class, with the right visual for each
statistic.

**Architecture:** Study the research answer and our real repo, ratify one
constitution, build the foundation (OKLCH tokens, type, the visx chart kit, the
six-band layout), reform the five pages onto it, then QA, promote, and govern. The
five locked page types and their fixed ordered section sets are immutable; the
reformation changes HOW sections are composed and visualised (folded into six
narrative bands), never which sections exist or their order.

**Tech stack (reconciled with the real `package.json` in `01-resource-study.md`):**
Next.js 15.5, React 19.2, TypeScript 5 (strict), Tailwind 3.4. Adopt: shadcn
(invoke `2.3.0` for new components), Radix, visx (scoped 3.x subpackages, not the v4
umbrella), Observable Plot + jsdom (build-time only), scoped D3, Style Dictionary,
Culori, Fontsource (deferred; keep `next/font` for now), Lucide (fix pin, retire
Phosphor), Motion (token-bound, reduced-motion-safe).

**The document set this plan governs (all in this folder):**
- `00-research-answer-source.md` , the verbatim web-research answer (the input)
- `00-MASTER-PLAN.md` , this file (the sequence and the law of execution)
- `01-resource-study.md` , every resource interpreted, with ADOPT/REFERENCE/SKIP + the corrected install plan
- `02-brand-design-constitution.md` , the single binding visual ideology (the LAW)
- `03-foundation-phases.md` , the detailed F1 to F5 foundation phases
- `04-page-reform-phases.md` , the detailed P1 to P5 page-reform phases
- `05-qa-governance-phases.md` , the detailed Q1 to Q5 closing phases
- `06-ground-truth.md` , the literal repo schema, locked sections, methodology, constraints

---

## Gate 0: founder permission (the plan does not execute without it)

This whole plan is held until the founder says execute. Nothing in Phases 1 to 25
touches code, installs a package, or changes a page before that. The planning stage
(authoring this document set) is complete; execution is a separate, explicit go.

---

## The standing methodology (every phase obeys this)

Drawn from `docs/verification-protocol.md` and `06-ground-truth.md`. Each phase is a
**verified, committed wave**:

1. **Instruction fidelity.** Do the asked thing. Never silently substitute judgment
   for the constitution or the locked section order; never silently drop a section.
2. **The constitution is law.** When a choice feels open, `02` answers it. Authority
   order on disagreement: founder's word, then `design-tokens.ts`, then the locked
   section spec, then the constitution, then the research answer.
3. **Gates green before commit.** `npx tsc --noEmit` clean, `npm run prebuild` 31/31
   (including `verify_page_sections`, `verify_section_order`, `verify_no_em_dashes`,
   `verify_no_source_agencies`, `verify_no_hardcoded_hex`). Ask before running the
   heavy gates.
4. **SEE every visual change.** Screenshot at 1280 and 375 via the preview/Playwright
   path; never assume. Prototype visual work in a fast static-data `/dev` harness
   first (instant render), then wire the real view-model.
5. **Honesty boundary.** London is the one filled exemplar. Real data where held;
   tagged SAMPLE or a calm "still filling in" strip where not. Never a fabricated
   number, never a wall of dashes.
6. **Hard constraints.** No em-dashes, no source-agency names, tokens only (no raw
   hex/px/ms/font-name/z-index in components), no URL slug renames, WCAG AA, 375 no
   horizontal scroll, never force-push main.
7. **Branch + ship discipline.** All work on `reform-v2/r6-forward`. Nothing
   promotes to production until the single cohesive promote (Wave F, Phase 23).
8. **Per-phase shape:** every phase runs the same five substeps unless noted,
   **Interpret** (what the research/constitution says) , **Analyze** (how it applies
   to our real files) , **Implement** (the change) , **Review** (against the
   constitution's tests + a self/code review) , **Evaluate** (gates + SEE-it +
   honest report), then **commit**.

---

## The 25 phases at a glance

| # | Part | Phase | Deliverable | Detail doc |
|---|------|-------|-------------|------------|
| 1 | Study | Lock the adopt-list | corrected stack decision | 01 |
| 2 | Study | The chart-choice law | the statistic-to-chart matrix, ratified | 01, 02 §5 |
| 3 | Study | The verified install plan | exact commands vs real tree | 01 |
| 4 | Constitution | Ratify the constitution | founder sign-off on the ideology | 02 |
| 5 | Constitution | Token + OKLCH spec | the implementable token pipeline spec | 02 §4 |
| 6 | Constitution | Type-system spec | the implementable type spec | 02 §3 |
| 7 | Constitution | Chart-kit spec | the component contracts + matrix | 02 §5 |
| 8 | Constitution | Six-band layout spec | section-to-band map for all 5 types | 02 §2 |
| 9 | Foundation | F1 install + integrate the stack | green gates, no conflicts | 03 |
| 10 | Foundation | F2 OKLCH token pipeline | tokens generated, palette pixel-preserved | 03 |
| 11 | Foundation | F3 type system | Newsreader/Inter wired, tabular figures | 03 |
| 12 | Foundation | F4 the visx chart kit | SSR-safe kit, `/dev/charts` showcase | 03 |
| 13 | Foundation | F5 six-band layout system | the shell + grid + lanes + rhythm | 03 |
| 14 | Page reform | P1 London Restaurants cell (template) | the reformed cell, live | 04 |
| 15 | Page reform | P2 United Kingdom country | reformed country | 04 |
| 16 | Page reform | P3 London city | reformed city | 04 |
| 17 | Page reform | P4 London neighbourhoods | reformed neighbourhood | 04 |
| 18 | Page reform | P5 Home | reformed home | 04 |
| 19 | QA | Q1 cross-page cohesion QA | the skim/sameness/one-idea/vocab pass | 05 |
| 20 | QA | Q2 accessibility + correctness | WCAG AA, 375, keyboard, reduced-motion | 05 |
| 21 | QA | Q3 performance | SSR/static charts, bundle, fonts, CLS | 05 |
| 22 | Ship | Q4 founder review + iterate | sign-off on the cohesive whole | 05 |
| 23 | Ship | Wave F: the single cohesive promote | the reformed site live | 05 |
| 24 | Govern | Q5 governance + living constitution | conformance checklist, handoff, retire old | 05 |
| 25 | Rollout | Extend the constitution site-wide | the remaining page types onto the law | 02, 05 |

---

## PART I , STUDY AND DECIDE (Phases 1 to 3)

### Phase 1, Lock the adopt-list
- **Goal:** turn the research catalog into a single committed stack decision for our real tree.
- **Draws on:** `01-resource-study.md` (the ADOPT/REFERENCE/SKIP study + the package.json reconciliation).
- **Substeps:** Interpret every Part-A resource; Analyze each against the installed versions (shadcn 4.10 vs 2.3, visx v4 umbrella vs scoped, lucide pin, tailwind-merge 3 vs 2.6, two icon systems); decide the final adopt-list; record the divergences to resolve; Review the list for conflicts and license issues; Evaluate against the constitution (nothing that forces a second visual language).
- **Deliverable:** the ratified adopt-list section of `01`.
- **Verification:** no installs yet; the decision is the artifact. Founder visibility.
- **Exit:** one written, reconciled adopt-list with no open version conflicts.

### Phase 2, The chart-choice law
- **Goal:** ratify the statistic-to-chart-to-renderer matrix so templates never become a random mix.
- **Draws on:** the FT Visual Vocabulary, Datawrapper chart guide, Tufte, Bertin, NN/g (`01`); the matrix in `02 §5.2`.
- **Substeps:** Interpret the FT vocabulary and Bertin encoding hierarchy; Analyze each statistic our five page types carry against it; confirm the per-statistic chart + chart-kit component + renderer; Review every adjacent pair for distinctness (no two sections read identically); Evaluate against the one-loud-color and direct-label rules.
- **Deliverable:** the ratified §5 matrix (already drafted in `02`).
- **Exit:** every statistic on the five pages has one assigned chart + component + renderer.

### Phase 3, The verified install plan
- **Goal:** produce the exact, correct install commands for our tree (the research's commands are partly wrong for us).
- **Draws on:** `01`'s currency/compat note.
- **Substeps:** Interpret the research's combined install block; Analyze it against `package.json`; produce the corrected commands (what to add, what is already present, what to pin); Review for peer-dependency and React-19-types issues; Evaluate that gates would stay green.
- **Deliverable:** the corrected install block in `01`.
- **Exit:** a copy-pasteable, conflict-free install plan ready for Phase 9.

---

## PART II , RATIFY THE CONSTITUTION (Phases 4 to 8)

### Phase 4, Ratify the Brand Design Constitution
- **Goal:** make `02` the single binding law, signed off, so the gravitation ends.
- **Draws on:** `02` in full.
- **Substeps:** Interpret the thesis, the six bands, the type/color/chart laws, the forbid-list; Analyze each against our real tokens and locked sections (already reconciled); present to the founder for the one strategic sign-off (warm editorial over fintech; the six-band model; the one-loud-color law; the serif role); Review for any contradiction with the locked spec; Evaluate and lock.
- **Deliverable:** `02` marked ratified (DRAFT to LAW) on founder sign-off.
- **Exit:** the founder has approved the ideology. This is the one design decision asked of them; the rest is execution against it.

### Phase 5, Token + OKLCH spec
- **Goal:** turn `02 §4` into an implementable token-pipeline spec.
- **Substeps:** Interpret the warm palette + role mapping + one-loud-color law; Analyze the current `design-tokens.ts` + `tailwind.config.ts` + `globals.css` derivation; design the Culori-to-Style-Dictionary OKLCH pipeline that pixel-preserves the palette and emits `tokens.css` + the Tailwind feed + `chartTokens.ts`; Review the chart-token roles; Evaluate WCAG AA on every pairing.
- **Deliverable:** the token spec section (in `03` F2, detailed there).
- **Exit:** a build-ready token plan that does not recolor the brand.

### Phase 6, Type-system spec
- **Goal:** turn `02 §3` into an implementable type spec.
- **Substeps:** Interpret the two-face, two-job law and the responsive scale; Analyze the current `next/font` wiring; design the display/scanned tiers, the 20px serif floor, the tabular-figures rule; Review against the cohesion plan's face-not-final note; Evaluate legibility at 375.
- **Deliverable:** the type spec section (in `03` F3).
- **Exit:** a build-ready type plan.

### Phase 7, Chart-kit spec
- **Goal:** turn `02 §5` into the component contracts for the visx kit.
- **Substeps:** Interpret the named kit + the matrix; Analyze what already exists in `src/components/kit/charts` (the nullable-in/silence-out primitives); design the component contracts (props, the spread-always rule, the chart-token consumption, SSR-safety); Review against Tufte/Bertin QA; Evaluate the `/dev/charts` catalog requirement.
- **Deliverable:** the chart-kit spec section (in `03` F4).
- **Exit:** a build-ready chart-kit plan, reusing existing primitives.

### Phase 8, Six-band layout spec
- **Goal:** turn `02 §2` into the section-to-band map for all five page types.
- **Substeps:** Interpret the six bands + the three reading lanes + the 12/6/4 grid + the one-idea-per-band law; Analyze each page type's locked section order; map every section into a band (order unchanged) for cell, country, city, neighbourhood, home; Review the 375 collapse rules; Evaluate that no section moves.
- **Deliverable:** the layout + mapping spec (in `04`, per page).
- **Exit:** every locked section of every page has a band and a lane, with order intact.

---

## PART III , BUILD THE FOUNDATION (Phases 9 to 13)

Detailed substeps, files, and verification for each live in `03-foundation-phases.md`.
Each is a committed wave: Interpret, Analyze, Implement, Review, Evaluate (tsc +
prebuild 31/31 + SEE-it where visual), commit.

- **Phase 9, F1 install + integrate the stack.** Add only what is missing (`@observablehq/plot`, `jsdom`, `d3`, `style-dictionary`, `culori`, `@radix-ui/colors`, `motion`), reconcile shadcn/visx/font/lucide divergences, verify Next15/React19/Tailwind3 compatibility, gates still green. Exit: clean install, no conflicts, gates green, committed.
- **Phase 10, F2 the OKLCH token pipeline.** Culori ramps to Style Dictionary, emit `tokens.css` + Tailwind feed + `chartTokens.ts`, pixel-preserve the warm palette, enforce no-raw-hex. Exit: tokens generated, the live site visually identical, gates green.
- **Phase 11, F3 the type system.** Wire the display/scanned tiers, the scale, tabular figures, the band opener style. Exit: type law in force, SEEN at 1280/375, gates green.
- **Phase 12, F4 the visx chart kit.** Build/grow the SSR-safe, nullable-in/silence-out, token-themed kit per the matrix, cataloged in `/dev/charts`. Exit: every matrix component renders in the showcase at 1280/375, gates green.
- **Phase 13, F5 the six-band layout system.** Build the band shell, the three reading lanes, the 12/6/4 grid, section banding, vertical rhythm, the sticky index; rewrite `page-sections.ts` to the locked orders. Exit: the shell renders a sample page in bands at 1280/375, `verify_section_order` + `verify_page_sections` green.

---

## PART IV , REFORM THE PAGES (Phases 14 to 18)

Detailed per-page substeps live in `04-page-reform-phases.md`. The pattern is constant:
map the locked sections into the six bands (order never changed), assign each section
its chart from the matrix, build a static-data prototype in a `/dev` harness, run the
constitution's skim/sameness/one-idea tests, wire the real view-model, verify (gates +
SEE 1280/375 + honesty), commit.

- **Phase 14, P1 London Restaurants cell (the template).** The 18 locked sections + the calculator into the six bands; the canonical proof of the constitution; prototype then wire `/gb/london/restaurants`.
- **Phase 15, P2 United Kingdom country.** The 24-section country order into the bands.
- **Phase 16, P3 London city.** The 12-section city order into the bands.
- **Phase 17, P4 London neighbourhoods.** The 9-section neighbourhood order into the bands.
- **Phase 18, P5 Home.** The 9-section home order into the bands (home keeps its extra brand freedom).

Each page exits when: it reads in six bands, every locked section present in order,
every statistic on its assigned chart, honest where data is not held, gates green,
SEEN at 1280 and 375, committed. Nothing promotes yet.

---

## PART V , QA, SHIP, GOVERN (Phases 19 to 25)

Detailed substeps live in `05-qa-governance-phases.md`.

- **Phase 19, Q1 cross-page cohesion QA.** Run the five-types-by-six-bands matrix against the skim test, the sameness test, the one-idea-per-band test, and the chart-vocabulary-consistency test, at 1280 and 375. Fix every flagged band. Exit: all five pages pass all four tests.
- **Phase 20, Q2 accessibility + correctness.** WCAG AA contrast on the warm palette, 375 no horizontal scroll, tabular figures, no-color-alone encoding (Bertin), keyboard/focus on the Radix-backed controls, reduced-motion. Exit: a clean a11y pass, gates green.
- **Phase 21, Q3 performance.** SSR/static-first charts, the visx/d3 bundle weight, font delivery, CLS reserved. Exit: budgets met, no regression.
- **Phase 22, Q4 founder review + iterate.** Present the cohesive whole (all five reformed pages) for the founder's review; iterate on the single coherent base, not from scratch. Exit: founder sign-off to promote.
- **Phase 23, Wave F: the single cohesive promote.** One verified promote brings the reformed cohesive site (the engraved-frame-clean-data language, the held country fix, the reformed pages) live. Exit: production shows the reformed site; gates green; honest report.
- **Phase 24, Q5 governance + living constitution.** Make `02` the living law; write a one-page conformance checklist for any new page or chart; retire the last old-direction artifacts and references; update the handoff. Exit: the constitution governs all future work; the old languages are gone.
- **Phase 25, Extend the constitution site-wide.** Roll the same six-band, chart-kit, token, and type law to the remaining page types beyond the five pilots (industry, compare, learn, directories), each a verified committed wave under the constitution. Exit: the whole site reads as one cohesive, world-class language.

---

## Self-review (against the founder directive and the research answer)

- **Coverage:** every category of the research answer maps to a phase (study to adopt-list and chart law; ideology to the constitution; install/token/type/chart/layout to the foundation; the five pages to page reform; QA/a11y/perf/promote/governance to the close). The 25 phases exceed the 20-phase ask, each with interpret/analyze/implement/review/evaluate substeps.
- **Grounded, not gravitating:** the constitution is singular and forbids the second language; the resource study reconciles the research's install commands with the real tree; the locked sections and honesty boundary are carried verbatim from the repo.
- **Methodology fidelity:** every phase is a verified, committed wave with gates + SEE-it; nothing ships before the founder review and the single cohesive promote (Wave F).
- **Permission-gated:** Gate 0 holds the entire plan until the founder says execute.
