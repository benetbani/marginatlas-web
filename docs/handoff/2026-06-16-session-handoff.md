# Session handoff, 2026-06-16: design reformation + the pivot to "founder designs, AI ports 1:1"

This is a complete, self-contained handoff for continuing the SAME work in a new
chat in this project. Read it in full, then read the files it points to (the
bootstrap prompt at the very end lists them in order). It is long on purpose.

---

## 0. THE ONE THING THAT MATTERS MOST (read this first, twice)

After a week and many attempts, the founder has concluded, correctly, that **when
the AI invents the visual design, it produces slop** every time: ugly, text-heavy,
poor visual hierarchy, charts that read like tables, a green (moss) that feels off,
"whitespace out of nowhere", not skimmable. This is a consistent pattern across
many mockups, the reformation, and the P1 prototype.

The founder and the AI agreed (clickable interview, end of this session) on a new,
non-negotiable operating pipeline:

> **The founder designs each page in their own design tool (Subframe / Figma / v0 /
> code export). The AI PORTS it 1:1, pixel-for-pixel, then wires the real data.
> The AI does NOT invent, reinterpret, "improve", or add visuals of its own.**

The AI is a strong IMPLEMENTER and a weak visual ORIGINATOR. The job is mechanical
fidelity: match the founder's design's layout, spacing, type, colour, and
components exactly, then swap in the live `cell_view` data.

**The immediate next action when the new chat opens:** the founder will hand over
ONE page design (the London restaurants page), ideally as **code or a live URL**
(best fidelity), possibly a Figma Dev-Mode link, last resort a screenshot. The AI
replicates it exactly and wires the London data. Do not produce another
AI-invented mockup. If the founder has not yet provided the design, ASK for it in
the highest-fidelity form available (code export or live URL beat a screenshot,
because a screenshot forces the AI to eyeball it, which is the failure mode).

Everything else below is context. This pivot overrides the "AI composes the page"
parts of the constitution. The constitution's CONSTRAINTS still hold (tokens,
locked sections, honesty, gates); its COMPOSITION/ideology is now subordinate to
the founder's actual design.

---

## 1. Project at a glance

- **Product:** Margin Atlas (marginatlas.com), a global small-business benchmarks
  site. Every page answers "how much does an X make in Y" with the number, the
  structural reason, and an honest read. ~191 countries, 180+ industries.
- **Root:** `E:\atlas\website` (its own git repo). Parent `E:\atlas` is the
  separate data-pipeline repo. Shell CWD resets to `E:\atlas`; **prefix every Bash
  with `cd /e/atlas/website &&`**.
- **Stack:** Next.js 15.5 (App Router/RSC), React 19.2, TypeScript 5 (strict),
  Tailwind 3.4, Supabase Pro, Vercel, Sentry. Fonts: Newsreader (`--font-display`)
  + Inter (`--font-sans`).
- **Branch:** `reform-v2/r6-forward`. HEAD = `e84b9310`. Production is the older
  R6.5 promote; NOTHING from this session is in production (held for the single
  cohesive Wave F promote).
- **Gates:** green at HEAD (`npx tsc --noEmit` clean, `npm run prebuild` 31/31).
  Ask before running the heavy gates; prefix with `cd /e/atlas/website &&`.

---

## 2. What happened this session (the honest narrative)

1. **Started** continuing R7 section reforms on the live cell page. Committed real
   improvements (commits `3bbabb94`, `81d28ef2`, `d74b4a55`, `68db381f`): the
   plain-terms icon cards, the money block per-$100 bar with a kept tick, the
   honest-take break-in gauge, the break-even gauge, the first-year timeline, the
   nearby ranked bars, and the risks severity ladder. These are LIVE in the code
   on the branch and visible at `/gb/london/restaurants`.
2. **The founder escalated:** the page was still "slop", and the root cause was
   that the repo carried FIVE contradictory design directions (R6.5 warm-frame
   live, the 2026-06-12 saas-refresh amber, the engraved-almanac, the 2026-06-14
   business-cell, the old set_17-20) and the AI kept "gravitating" between them.
3. **Cleanup:** deleted ~200MB of stale, untracked design-export galleries
   (`design-assets/incoming/set_17..20`, `docs/brand/assets/incoming/*` including
   the saas-refresh and Margin-Atlas--N sets) and all scratch mockups/screenshots.
   KEPT: `src/lib/design-tokens.ts`, the authoritative `docs/brand/*.md`, and the
   two newest references (`design-assets/incoming/2026-06-14-claude-design`,
   `2026-06-14-country-engraved`). NOTE: the deleted exports were untracked, so
   they are gone from disk and NOT git-recoverable; the founder can re-export them
   from their design tool.
4. **Research:** wrote `DESIGN-RESEARCH-PROMPT.md`; the founder ran it in a strong
   web model and pasted back the answer (now `00-research-answer-source.md`): a
   real, cited resource catalog (FT Visual Vocabulary, OWID, Datawrapper, visx,
   Style Dictionary, OKLCH/Culori), a recommended ideology, and an install plan.
5. **Planning:** authored (via a grounded sub-agent workflow) the full reformation
   document set in `docs/superpowers/plans/2026-06-16-reformation/` (the 25-phase
   master plan + the Brand Design Constitution + the resource study + foundation/
   page/QA phase docs + the ground truth). Committed `8de0c15c`.
6. **40-question interview:** the founder ratified the ideology and decisions via a
   clickable interview, recorded in `07-interview-decisions.md`. Two founder
   overrides: money = per-$100 stacked bar (not waterfall); labelled-illustrative
   content is permitted (never dressed as real).
7. **Foundation built (Part III), all committed + gate-green:** F1 install
   (`21ea880f`), F2 chart tokens + OKLCH audit (`382573da`), F3 type system
   (`c122f692`), F4 chart-kit reconciliation (`11866d35`), F5 the six-band layout
   shell (`9ce0cc1a`). The live site is visually UNCHANGED by all of this (it was
   additive plumbing).
8. **P1 prototype:** built `/dev/cell-reform` (`78aa6dd8` + `e84b9310`), the
   reformed cell page composed from the Foundation in six bands with three reading
   lanes. **The founder reviewed it and rejected it as still slop** (ugly,
   competing elements, text bloat, weird green, unintuitive visuals, bad
   hierarchy). This rejection is what triggered the pivot in section 0.
9. **The pivot:** founder-designs / AI-ports-1:1. See section 0.

---

## 3. Current code state (what is built and committed)

All on `reform-v2/r6-forward`, gates green, nothing in production.

- **The token foundation is durable:** `design-tokens.ts` has the warm palette
  (terracotta `atlas`, `cream`, `ink`, `cocoa`, `moss`, `clay`, `amber`, `teal`),
  the `tier`/`delta` semantic scales, plus NEW: the `chart` color roles and the
  `displayScale` (fluid clamp sizes). An OKLCH audit
  (`scripts/tokens/oklch-audit.mjs`) proves the palette is perceptually monotonic
  and WCAG AA.
- **The chart kit exists** at `src/components/kit/charts/` (12 components) and
  `src/components/kit/sections.tsx` (PlainTerms, BreakEvenLine, WagesByRole,
  Seasonality, RealisticFirstYear, SameBusinessNearby), plus
  `MoneyGoesBreakdown.tsx`, `HonestTakeBox.tsx`, `blocks/RiskList.tsx`. Cataloged
  at `/dev/charts`. The founder finds these visuals unintuitive, so under the new
  pipeline they are RAW MATERIAL to be replaced/restyled to match the founder's
  design, not the final look.
- **The layout shell** `src/components/kit/layout/bands.tsx` (`Band`, `Lanes`,
  `SectionIndex`) exists but its composition (the six bands / three lanes) was the
  rejected look; keep it available but expect the founder's design to dictate the
  real layout.
- **`/dev/cell-reform`** is the REJECTED prototype. Keep it only as a reference of
  "what the AI produced unaided" (i.e. what not to repeat); the real page comes
  from porting the founder's design.
- **The live `/gb/london/restaurants`** still uses `CellDecisionStack.tsx` (the old
  stacked layout) with the earlier section reforms. It is the current "best live"
  state, also judged not good enough.

---

## 4. The file map (the role of EVERY relevant file)

### 4.1 The reformation plan + law (docs/superpowers/plans/2026-06-16-reformation/)
- **`README.md`** , index of the doc set; read order.
- **`00-research-answer-source.md`** , the verbatim web-research answer the founder
  pasted: the resource catalog (reference sites, design systems, chart libs, fonts,
  color tooling, layout/density references, icons/motion), the recommended
  ideology, the per-statistic chart matrix, and the install plan with real URLs.
- **`00-MASTER-PLAN.md`** , the 25-phase reformation master plan (Study 1-3,
  Constitution 4-8, Foundation 9-13, Page reform 14-18, QA/Ship/Govern 19-25), with
  the standing methodology (verified committed waves, gates, SEE-it, honesty,
  immutable locked sections). NOTE: the page-reform phases assumed AI composition;
  under the new pivot the composition comes from the founder's design.
- **`01-resource-study.md`** , every research resource interpreted with an
  ADOPT/REFERENCE/SKIP decision and the install plan reconciled against the REAL
  `package.json` (e.g. shadcn is already 4.10 not 2.3, visx is scoped 3.x not the
  v4 umbrella). Use this before installing anything.
- **`02-brand-design-constitution.md`** , the design LAW: the warm-editorial-almanac
  thesis, the six narrative bands, the three reading lanes, the type law, the warm
  OKLCH token law (one loud colour), the statistic-to-chart-to-renderer matrix, the
  five north-stars, a forbid-list. Its CONSTRAINTS (tokens, honesty, no second
  loud colour, locked sections) still hold; its COMPOSITION/ideology is now
  subordinate to the founder's actual design (the pivot). Quotes the real token
  values.
- **`03-foundation-phases.md`** , the detailed F1-F5 foundation phases (install,
  OKLCH token pipeline, type, chart kit, layout). Mostly executed.
- **`04-page-reform-phases.md`** , the detailed P1-P5 page-reform phases (cell,
  country, city, neighbourhood, home), one band-mapping per page. Under the pivot,
  the "build a prototype" step becomes "port the founder's design".
- **`05-qa-governance-phases.md`** , the detailed Q1-Q5 closing phases (cohesion QA,
  accessibility, performance, founder review, the single cohesive Wave F promote,
  governance).
- **`06-ground-truth.md`** , the literal repo schema: the exact token palette + fonts,
  the locked section order for each of the 5 page types, the verification
  methodology + gates, the honesty boundary, the hard constraints, what is live vs
  held. The most factual reference.
- **`07-interview-decisions.md`** , the 40 founder-ratified design decisions (feeling,
  type, colour, density, charts, stack, scope, honesty, execution), plus the two
  amendments (per-$100 money chart; labelled-illustrative content). These are the
  founder's settled preferences; respect them even as the design now comes from
  the founder's tool.
- **`08-chart-kit-reconciliation.md`** , maps each matrix statistic to its existing
  chart-kit component, the nullable-in/silence-out contract, and the
  tokenization-during-page-reform plan.

### 4.2 Other planning + spec docs
- **`docs/superpowers/specs/2026-06-16-london-uk-section-architecture.md`** , THE
  LOCKED section ORDER and per-section visual treatment for the 5 page types,
  decided over two clickable interviews. The section ORDER is an immutable
  contract; any design (including the founder's) must keep every section, in order.
- **`docs/superpowers/specs/2026-06-16-london-restaurant-prototype-brief.md`** , the
  earlier files-first brief for the restaurant prototype (superseded by the
  reformation docs, kept for history).
- **`DESIGN-RESEARCH-PROMPT.md`** (repo root) , the heavy web-research prompt the
  founder ran to get `00-research-answer-source.md`. Reusable for further research.

### 4.3 Authoritative brand/design docs (docs/brand/)
- **`cohesion-master-plan.md`** , the prior "one visual language" (engraved frame +
  clean data core, warm frame on by default). Background for the constitution.
- **`section-constitution.md`** , the per-page-type section spine (the source of the
  locked orders).
- **`design-system.md`** , the chart grammar (section 10), the colour jobs, spacing,
  elevation. **`brand-identity.md`** , the brand voice + visual law. **The other
  `docs/brand/*.md`** (brand-direction-quiz, design-improvement-pipeline,
  pipeline-*, pipelines-control, visual-assets, design-tool-prompts) are the
  operating-model/pipeline notes; read as needed, not core to the pivot.

### 4.4 The code (what was touched/created this session)
- **`src/lib/design-tokens.ts`** , THE single source of truth for every colour,
  font, size, radius, shadow, motion value. Added the `chart` color roles
  (§4.2 of the constitution) and the `displayScale` (fluid clamp display sizes).
  Components must read tokens, never raw hex.
- **`src/app/globals.css`** , global styles + the shadcn CSS variables (warm-skinned).
  Added the `.tabular-figures` / `[data-numeric]` rule (tabular lining figures).
- **`scripts/tokens/oklch-audit.mjs`** , a Culori audit that proves the warm palette
  is perceptually monotonic and WCAG AA. Run: `node scripts/tokens/oklch-audit.mjs`.
- **`src/components/kit/layout/bands.tsx`** , the layout shell: `Band` (a thematic
  band), `Lanes` (the three reading lanes, collapsing 12/6/4), `SectionIndex` (the
  sticky "on this page"). Exported from the kit barrel.
- **`src/components/kit/index.ts`** , the kit barrel (re-exports). Added the layout
  exports.
- **`src/components/kit/charts/*.tsx`** (ComparisonBars, FootfallGrid, HeatStrip,
  LikeForLikeBars, ScoreBand, SeverityGlyph, ThresholdGauge, TierBar,
  TimelineRibbon, VisitorSplit, Waterfall, + `helpers.tsx`) , the chart kit. The
  spotlight fill was migrated to the `bg-chart-primary` token (1:1). These are the
  reusable viz the founder finds unintuitive; under the pivot, restyle/replace to
  match the founder's design.
- **`src/components/kit/sections.tsx`** , the reformed data sections (PlainTerms
  icon cards, BreakEvenLine threshold, RealisticFirstYear ribbon, WagesByRole
  rails, Seasonality bars, SameBusinessNearby ranked bars).
- **`src/components/kit/MoneyGoesBreakdown.tsx`** , the per-$100 money bar with the
  vermillion "KEPT" tick on the kept row (the founder's chosen money chart).
- **`src/components/kit/HonestTakeBox.tsx`** , the honest-take section with a generic
  `gauge` slot (used for the break-in ScoreBand).
- **`src/components/kit/blocks/RiskList.tsx`** , the risks section as a SeverityGlyph
  ladder.
- **`src/components/cells/CellDecisionStack.tsx`** , the LIVE cell-page body composer.
  Maps the `CELL_SECTIONS` manifest into the kit sections; wired the risks,
  owner-keeps kept-vs-gone, break-even value/typical/unit, honest-take gauge. This
  is what `/gb/london/restaurants` currently renders.
- **`src/lib/cells/cell_view.ts`** , the cell page VIEW MODEL: maps a resolved cell +
  its London entry into kit section props. Added `breakEven.value/typical/unit`,
  `firstYear.milestones`, `honestTake.breakInScore`, the `risks` field + the
  `londonRisks` builder. Carries the HONESTY BOUNDARY (London is the one filled
  exemplar; sanctioned invented editorial; never fabricate; unheld data is honest
  or labelled-illustrative). When porting the founder's design, this is where the
  real data comes from.
- **`src/app/dev/cell-reform/page.tsx`** , the REJECTED P1 prototype. Reference only
  for "what the AI produced unaided". Will be replaced by porting the founder's
  design.
- **`src/app/dev/charts/page.tsx`** , the chart-kit showcase (internal, noindex).
- **`package.json` / `package-lock.json`** , the installed foundation stack: d3,
  motion (runtime); @observablehq/plot, jsdom, culori, @radix-ui/colors,
  style-dictionary, @types/d3, @types/jsdom (build-time). visx (scoped 3.x),
  lucide-react already present; @phosphor-icons to retire (use Lucide only).

### 4.5 Methodology + project index
- **`docs/verification-protocol.md`** , THE definition of done: instruction
  fidelity, gates (`tsc` + `prebuild` 31/31), data honesty, SEE-it at 1280 + 375,
  honest reporting, ship discipline. Apply before every delivery.
- **`CLAUDE.md`** , the project index + the hard constraints (no em-dashes, no
  source-agency names, tokens only, no URL slug renames, WCAG AA, 375 no horizontal
  scroll, never force-push main, `cd /e/atlas/website` prefix, concurrency <=4 on
  Windows).
- **`docs/handoff/INDEX.md`** + the prior handoffs (`2026-06-14`, `2026-06-12`) ,
  the handoff history. THIS file supersedes them as the current state.

### 4.6 Memory (auto-loaded each session, C:\Users\benet\.claude\projects\E--atlas\memory\)
- **`MEMORY.md`** , the memory index.
- **`project_reformation_constitution.md`** , the ratified reformation/constitution
  memory (the active design law). NOTE: it predates the "founder designs, AI ports"
  pivot; the new chat should UPDATE it to record the pivot.
- **`feedback_verification_protocol.md`**, **`project_section_constitution.md`**,
  **`dev_verification_gotchas.md`** (Windows local-dev traps: cd-prefix, the heavy
  cell route crashes the dev server, the live Next server runs on :3000 while the
  preview proxy claims :3210, Playwright resize occasionally closes the page,
  curl gets 403 from middleware so pre-warm routes with a browser User-Agent),
  **`project_marginatlas_direction.md`**, **`feedback_common_sense_comparisons.md`**
  , the standing user/feedback/project memories. Read the recalled ones.

---

## 5. Hard constraints + the honesty boundary (always)
- Tokens only (no raw hex/px/ms/font-name/z-index in components); atlas terracotta
  is the one loud accent; amber is caution-only; moss is the only second accent
  (and the founder finds it slightly off, so use it minimally).
- No em-dashes in user-visible source; no source-agency names; no URL slug renames.
- WCAG AA; 375px no horizontal scroll; tabular figures on data.
- The five locked page types and their section orders are immutable; any design
  must keep every section, in order (see the section-architecture spec).
- Honesty: London is the filled exemplar; real data where held; unheld sections are
  a calm "still filling in" strip OR labelled-illustrative content (visibly tagged,
  composed quotes NOT attributed to real named people), NEVER fabricated-as-real.
- All work on `reform-v2/r6-forward`; nothing to production before the founder
  reviews the cohesive whole (the single Wave F promote).

---

## 6. What NOT to do (the failure modes that wasted a week)
- Do NOT invent the visual design. Port the founder's. (Section 0.)
- Do NOT work from a screenshot when code or a URL is available (eyeballing is the
  failure). Ask for code/URL.
- Do NOT gravitate between old design directions; the old exports are deleted on
  purpose.
- Do NOT produce text-heavy sections, "tables pretending to be charts", or
  unintuitive visuals; if the founder's design is sparse and visual, match that.
- Do NOT promote anything to production without the founder's review.
- Do NOT run the heavy dev route blindly; it crashes. Use a static `/dev` route or
  pre-warm with a browser User-Agent (see the gotchas memory).

---

## 7. The immediate next step
The founder will hand over ONE page design (the London restaurants page), as code
or a URL. PORT IT EXACTLY, then wire the live `cell_view` London data. That is the
test of the new pipeline. If the design has not arrived, ask for it in the
highest-fidelity form. Build nothing AI-invented.

---

## 8. THE BOOTSTRAP PROMPT (paste this into the new chat)

> You are continuing senior implementation work on **Margin Atlas**
> (`E:\atlas\website`, its own git repo on branch `reform-v2/r6-forward`; parent
> `E:\atlas` is the data-pipeline repo). The shell CWD resets to `E:\atlas`; prefix
> every Bash with `cd /e/atlas/website &&`. Do NOT write code, run a build, install
> anything, or change a page yet.
>
> FIRST, read these in order and hold them as context:
> 1. `docs/handoff/2026-06-16-session-handoff.md` (this is the current handoff,
>    read it IN FULL, especially section 0, the operating pivot)
> 2. `docs/verification-protocol.md` (the definition of done)
> 3. `CLAUDE.md` (project index + hard constraints)
> 4. `docs/superpowers/plans/2026-06-16-reformation/README.md` then, in its order,
>    `02-brand-design-constitution.md`, `06-ground-truth.md`,
>    `07-interview-decisions.md`, `01-resource-study.md`, `00-MASTER-PLAN.md`,
>    `08-chart-kit-reconciliation.md` (the design law, the real schema, the
>    ratified decisions, the stack, the plan, the kit map)
> 5. `docs/superpowers/specs/2026-06-16-london-uk-section-architecture.md` (the
>    immutable locked section order per page type)
> 6. `src/lib/design-tokens.ts` (the token source of truth) and
>    `src/lib/cells/cell_view.ts` (the cell page data + the honesty boundary)
> 7. Your auto-loaded memory files, especially `project_reformation_constitution.md`
>    and `dev_verification_gotchas.md`
>
> THE GOVERNING RULE (handoff section 0): the founder designs each page in their own
> tool; you PORT it 1:1 (pixel-for-pixel) and wire the real data. You do NOT invent,
> reinterpret, or "improve" the visuals. The AI inventing visuals is what failed for
> a week; do not repeat it.
>
> Then do three things: (a) in about 6 lines, state the current state (Foundation
> built + committed, the P1 prototype rejected, the pivot to founder-designs / you-
> port); (b) ask the founder to hand over the one page design (the London
> restaurants page) in the highest-fidelity form they have, code or a live URL
> beats a Figma link beats a screenshot, and explain why; (c) once you have it, port
> it exactly and wire the `cell_view` London data, verifying with the gates
> (`npx tsc --noEmit`, `npm run prebuild` 31/31) and SEEing it at 1280 and 375.
> Never silently substitute your own design judgment for the founder's design or
> drop a locked section. Honesty boundary holds: never fabricate data as real;
> unheld data is honest or labelled-illustrative.
