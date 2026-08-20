# HANDOFF — marginatlas.com: graphics review, architecture review, and the frosted-glass promotion

**Status, 2026-08-20.** 51 commits unpushed on `main`. `npx tsc --noEmit` clean,
`npm run prebuild` **104/104** (3 cell-lattice checks deferred by design, which
are NOT passes). Nothing deployed. The 30-minute unattended loop is **paused**.
The live thread is **promoting the v2 frosted glass to the live pages**: its one
hard blocker is fixed and verified, the design rule is measured, and no glass has
been written into `globals.css` yet.

> **How to use this document.** Read top to bottom once. Then read the files in
> §7 in the given order. Do not start work until you can answer §13. A
> ready-to-paste re-hydration prompt is §14.

---

## 1. TL;DR

marginatlas.com is a global atlas of what a small business earns in a place and
what its owner actually keeps. This session ran three efforts back to back: an
**extensive graphics review** (~150 graphics across four chart kits, ending in
five side-by-side variant pages the founder can open and judge), an
**architecture review** (13 deepening candidates, three executed as pure
deletions totalling 876 lines), and a **frosted-glass investigation** that ends
where the work now stands.

**The single most important thing to know:** the site already contains a
complete, well-built frosted-glass language in `src/styles/atlas-spine.css`, and
it is switched off. The job is not to design glass; it is to promote the material
safely. The one blocker to that — a contrast gate that was **measuring pure
white**, a surface that never renders anywhere — is fixed, proven, and committed.

**Recommended next action:** write the translucency ladder into `globals.css` as
tokens carrying the measured pairing rule, retire `--text-faint`, then render the
homepage on the new material and hand the founder a standalone HTML file to
judge before anything ships.

---

## 2. Mission & success criteria

**Enduring goal**, in the founder's framing: a homepage he wakes up to and thinks
is perfect, with the same design carried across every page type.

**Current tactic**, this session's: make the site stop feeling *"a little bit
schematic and very bland"* by promoting a real frosted-glass material, while
keeping every figure readable.

**The founder's own words that bound the work:**

- On glass: *"the liquid glass is a little bit too much on our site. I think we
  should opt for this frosted glass."*
- On transparency: *"I'm not for very high transparency. I'm for a moving level
  of transparency that gives the design that sort of breathing."*
- On type: *"we should retire these fonts that are not readable… we should opt
  for readability."*
- On execution: *"each should be executed very, very, very well."*
- On scope: *"we only go vertically, so never create 2 similar sister pages, we
  are clearing design and sections now."*
- On judgement: asked whether a modelled figure should be marked, he ruled
  **zero marks, treat it as correct** — while ruling that an invented **band**
  should be marked. Both are recorded in `docs/adr/0001`.

**Hard constraints:** terracotta plus cool neutrals, ONE accent, no green, no
amber, no brown, no cream. Tokens only, no raw hex/px/ms in components. No
em-dashes in user-visible copy. No source-agency names. No URL slug renames.
Presentation must never import from `data/` directly. Never fabricate a figure.
Never raise a ratchet baseline. **Never push — the founder pushes.**

---

## 3. Current state — ground truth

| Component | Status | Notes |
|---|---|---|
| Branch / commits | `main`, **51 unpushed** | 0 behind, clean fast-forward available |
| `npx tsc --noEmit` | clean | verified at the last commit |
| `npm run prebuild` | **104 / 104**, exit 0 | 3 cell-lattice checks **deferred**, not passed |
| Working tree | clean apart from 3 knowns | `.mcp.json` (never commit), `scratchpad/`, and `.agents/skills/glassmorphism/` + `skills-lock.json` from an install |
| The 30-minute loop | **PAUSED** | cron `cb3ba4e9` deleted. `docs/loop/STATE.md` says tick 13 done, next slot 2 |
| Frosted glass | **investigated, not written** | blocker fixed; no glass in `globals.css` yet |
| Contrast gate | **fixed and proven** | `verify_token_contrast.mjs`, two commits |
| Variant pages | **5 built, awaiting the founder's picks** | `E:\atlas\_review-2026-08-19\` |
| Architecture review | 13 candidates raised, **3 executed** | all three pure deletions |
| Deployment | not deployed | production is far behind, and that is expected |

**Believed but NOT proven.** Whether the prebuild gates run on a Vercel deploy at
all. There is no `vercel.json`, so the build command is a dashboard setting; if
Vercel runs `next build` directly, the npm `prebuild` hook is bypassed and all
104 gates are skipped in CI while passing locally. Open as **Q3** in
`DECISIONS-NEEDED.md`.

**Stale by our own standard.** `docs/loop/STATE.md` records `prebuild 103/103`.
The chain is 104. The loop ran ticks 9–13 concurrently with this session's work
and its ledger did not pick up the last gate. **The chain is the authority, never
a document.**

**A numbering collision to fix.** `docs/loop/DECISIONS-NEEDED.md` now contains
**two questions numbered Q3** — the loop's "do the gates run on a deploy" and the
one added this session, "typed absence, or self-omission". Renumber before
answering either.

---

## 4. How we got here — the decision trail

**The graphics review came first**, because the founder asked for an extensive
check of every graphic against how SaaS and financial products actually visualise
money, with roughly three options per family and a verdict, explicitly allowing
*"the current version is the best one"*.

Four agents produced the inventories and the practice research. The verdict was
not what the brief expected: **the individual graphics are better than expected
and the problem is multiplicity.** Six percentile-spread charts disagree about
their axis, five draw "where each $100 goes", five month-of-year charts disagree
about whether the baseline is zero or the average, there are nine gauge
geometries, and three components are named `Waterfall` of which the only real one
has no call site while the one that ships is `SteppedWaterfall`. So the
recommendation was **converge, not redesign**.

**Then the variants**, because the founder asked to see the options rather than
read about them. The brief that governs them, `2026-08-19-variants/00-BRIEF.md`,
carries one rule above all others and it exists because of recorded history: this
project already ran a variants-and-pick machine and the founder called the result
*mediocre*. The difference now is structural — **an agent builds the variants,
the founder picks, and no agent may express a preference between A, B and C.**
Every line beside a version is a measured fact.

**Then the architecture review**, which produced 13 candidates and executed the
three that needed no decision. It also produced the two documents this repo had
never had: `CONTEXT.md`, naming the domain, and `docs/adr/0001`, recording the
founder's no-marks ruling so a future review cannot re-suggest what he rejected.

**Then frosted glass**, which is where the session ends. The founder supplied two
setproduct articles, seven links, and a skill to install. The research established
that Liquid Glass **cannot be reproduced on the web** — the refraction lives in
Apple's native rendering stack — which confirms his instinct to reject it. It also
established that glassmorphism on the web is for *accents*, because *"text on
glass depends entirely on whatever sits behind it"*, and ours sits over an
uncontrolled photograph.

**Then the discovery that reframed everything:** the site already has the glass,
in `atlas-spine.css`, switched off.

---

## 5. Hard-won truths & mental model

**The glass is already built and it is switched off.** `src/styles/atlas-spine.css`
holds `.av2 .glass` with all four edge cues the practitioner literature names — a
thin border breaking the edge, a directional highlight band, an inner stroke, and
an elevation shadow — plus `.av2 .panel` as the stabilized plate, plus a ten-step
transparency ladder. Its own section header reads **"DATA SURFACES ARE NEAR-OPAQUE
(glass stays on the frame)"**, which is exactly what the external research
independently concluded. It is imported only by `/dev` pages.

**The glassiness lives in the EDGE, not the see-through.** `--card` in v2 is also
`rgba(255,255,255,.955)`. Measured: the photograph contributes about **1.44% of
its own signal** through a .955 card, moving the card's ground roughly **3.7
levels out of 255** across the entire black-to-white range of the picture. The
material reads from the border and seven inset highlights. This is the single
most useful fact for the founder's "not high transparency" instruction — it is
already proven in his own code.

**The contrast rule is a PAIRING, not a number.** A surface may go only as
translucent as the lightest text token permitted on it. Measured against the
photograph's worst ground: `--n2` clears AA down to **alpha 0.855** and no
further; `--ink` reads **16.57** at that same alpha and **15.35** at 0.75. So
ink-only surfaces can breathe and label-bearing surfaces cannot.

**A worst-case bound is sound for blur, and needs a separate argument for
saturate.** A Gaussian blur is a convex combination, so it can never fall below
the darkest input pixel — bound the photograph once and the bound holds for every
radius forever. `saturate()` is a colour matrix: it preserves *linear* luma but
NOT WCAG relative luminance, and moves it in both directions. It is bounded here
only because the darkest pixel is `rgb(1,2,0)`, luminance .0005, and nothing can
go below black.

**`position: static` is not drawn.** `AtlasFrame` paints two fixed layers at
`z-index: 0`; CSS paints positioned z-index-0 descendants after in-flow ones. A
static element is absent, not dimmed. This hid the entire footer for weeks.

**`backdrop-filter` creates a Backdrop Root.** If any ancestor of a glass element
gains `opacity`, `filter`, `mask`, `mix-blend-mode` or `will-change`, the fixed
photograph drops out of that element's backdrop and the glass silently becomes a
flat panel over nothing, with no error. **Checked: our `opacity: 0.32` and
`filter` sit on the photo layer itself, a fixed `aria-hidden` sibling, not an
ancestor. The trap does not currently bite.**

**Render and count; never census from a registry.** `PAGE_SECTION_ORDER` lists 7
cell sections; the cell page renders 34. That registry produced one wrong
conclusion in the masterplan already.

**A green gate is evidence the gate ran, not that the site is correct.** Several
gates in this chain have been measured lying.

---

## 6. Dead ends — do NOT retry

1. **Liquid Glass.** Cannot be reproduced on the web; the refraction is native to
   Apple's compositor. The founder has also ruled it out by name.
2. **`prefers-reduced-transparency` as the accessibility answer.** Safari does not
   support it in any version through 27, and WebKit has a standards position
   against implementing it. **The default must be safe on its own.** Use Apple's
   two-alpha `@supports (backdrop-filter: initial)` pattern instead.
3. **Any of the seven supplied links.** Six are IGNORE, one is a structural idea
   only. Two are SwiftUI-only. The installed `glassmorphism` skill contains **no
   CSS at all** — grepping it for `backdrop|blur|rgba|filter|saturate|box-shadow`
   returns two hits, both the word "blur" in its own prose — and injects
   `#1856FF`, Plus Jakarta Sans and a green/amber semantic set. **Recommend
   uninstalling it.**
4. **Any Tailwind glass plugin.** The only npm package is pre-1.0, Tailwind-4
   only, zero-star, `NOASSERTION`-licensed with a 404 homepage, and replaces
   about ten lines of `theme.extend`. It also re-opens the "deleted ramp still
   emits a live rule" failure the palette replacement was written to close.
5. **Every high-star Liquid Glass repo**, including the 5,946-star one: WebGL or
   SVG displacement, runtime JS, client components, and four of the top ten carry
   no licence file.
6. **Carding the homepage section headings.** Measured: the backdrop's darkest
   point is luminance 0.4179, putting `ink-900` at 7.78:1 there, clear of AAA.
7. **Asserting take-home equals margin × revenue.** `resolveOwnerTakeHome` returns
   a FLOOR. Equality fails on correct data.
8. **"Fixing" the cell data bands that self-omit locally.** Documented latency
   artifact: cell lookups exceed a 4s budget from this machine to eu-west-1.
9. **Text-shadow to rescue contrast on glass.** No contrast formula counts it.
   WCAG G18 counts a *border*, and its own worked example is a plate.
10. **A per-figure "modelled" mark.** Ruled out by the founder; see `docs/adr/0001`.
11. **`git stash` / `checkout .` / `reset --hard` / `commit --amend`** while other
    agents run. All are branch-wide. The amend one retargeted another agent's
    commit earlier today.

---

## 7. Critical files & artifacts — the map and the reading order

| # | Path | Role | Priority |
|---|---|---|---|
| 1 | `docs/superpowers/plans/2026-08-17-founder-brief-and-loop-charter.md` | **THE authority.** The founder's own quoted rulings, the screenshot recipe, the paint rule, the parallel-agent rules | READ FIRST, IN FULL |
| 2 | `CONTEXT.md` | The domain language. Figure, Origin, Band, Regime, self-omission, the workshop | Essential |
| 3 | `docs/adr/0001-figures-carry-no-visible-origin-mark.md` | The no-marks ruling and its consequence | Essential |
| 4 | `CLAUDE.md` | Working method, hard constraints, the generated counts block | Essential |
| 5 | `docs/superpowers/research/2026-08-20-frosted-glass-implementation.md` | 1,181 lines. The arithmetic that makes .955 not glass; the ladder; the font verdict | **The live thread** |
| 6 | `docs/superpowers/research/2026-08-20-glass-ecosystem-scan.md` | What to take and avoid; the contrast-tooling gap | High |
| 7 | `src/styles/atlas-spine.css` lines 165-210 | The glass that already exists: `.glass`, `.panel`, the edge craft | **High** |
| 8 | `scripts/verify_token_contrast.mjs` | The fixed gate. Its header carries the whole bounding argument | High |
| 9 | `docs/superpowers/research/2026-08-19-GRAPHICS-REVIEW.md` | The ten families, three options each, and the eleven things NOT to vary | High |
| 10 | `docs/superpowers/plans/2026-08-19-variants/00-BRIEF.md` + `01-SPECS.md` | The rule that no agent picks, and the five specs | High |
| 11 | `docs/superpowers/plans/2026-08-19-masterplan/` (7 files) | Design standard, page dossiers, procedure, consolidation, error ledger, backlog | Reference |
| 12 | `docs/loop/` (README, 00-OPERATING-RULES, STATE, WAKE-UP, DECISIONS-NEEDED) | The paused loop's doctrine and memory | Reference |
| 13 | `E:\atlas\_review-2026-08-19\index.html` | **The founder-facing deliverable.** Links all five variant pages | Give to the founder |

---

## 8. Open threads & next steps

### Committed next step — the frosted-glass promotion

1. **Write the translucency ladder into `globals.css` as tokens**, carrying the
   pairing rule. *Where:* `src/app/globals.css`. *Why:* the founder asked for "a
   moving level of transparency"; today there are effectively two steps and
   everything sits at .955, which is why it reads flat. *Verify:*
   `node scripts/verify_token_contrast.mjs` passes at every declared step, and
   fails when a step is paired with a token that cannot survive it.
2. **Retire `--text-faint`.** *Where:* `src/app/globals.css:835`. *Why:* it
   measures **4.33** against the card's real ground — failing AA **today**, at the
   shipped alpha, on **82 of 114** small text nodes — and it is cocoa, which is
   brown, which charter §8 bans. This is the founder's *"retire the fonts that are
   not readable"*, and it is a colour token rather than a font. *Verify:* the
   contrast gate, and a render at 1280 and 375.
3. **Port the edge craft to the live card**, not the transparency. *Where:*
   `.atlas-card` in `globals.css`, taking the border and inset lights from
   `.av2 .glass`. *Verify:* render the homepage and read it back at both widths.
4. **Add the two-alpha `@supports` fallback**, Apple's pattern, NOT
   `prefers-reduced-transparency`. *Verify:* the no-blur branch is a designed
   state, not an accident.
5. **Render and hand over.** Export the homepage on the new material into
   `E:\atlas\_review-2026-08-19\` so the founder judges before anything ships.

### Blocked on the founder

- **Nine-plus questions in `docs/loop/DECISIONS-NEEDED.md`**, including the two
  numbered Q3. The ones that touch this thread: the 10px type floor, `--text-faint`,
  and typed-absence versus self-omission.
- **The five variant pages** await A/B/C picks. Nothing downstream of them should
  be built until he chooses.

### Ready to pick up, from the architecture review

| # | What | Deletion-test N |
|---|---|---|
| 1 | `verify_counts_fresh.ts` is a pure pass-through; the runner already supports `args` | N=0, the file vanishes |
| 2 | The gate self-test harness. **1 of 104 gates is tested**; `isPaletteLegal` was exported for testing and has zero importers | N=10 and rising |
| 3 | The scan set as a module: 56 hand-rolled walkers, 5 encodings of "the workshop" | N ≥ 20 |
| 4 | Finish `strip_comments` adoption: 11 line-based and 8 regex re-derivations | 14 today, ~34 after |
| 5 | The ratchet as a module: 6 baselines, 6 formats, 4 raise policies, 2 that write unconditionally | N=6 |
| 6 | Provenance module + the data seam (candidates 1 and 4, one conversation) | see §5 |

### Optional / someday

- **Two Supabase migrations, written and never applied.** `newsletter_signups`
  and `corrections` do not exist, so every signup and reader correction is
  silently discarded while the forms report success. `db/migrations/2026-08-16-*.sql`,
  both idempotent, must be run by hand in the SQL Editor. **This is live and
  losing data.**
- Thirteen chart headers cite a `design-system §10.1/§10.2` that does not exist.

---

## 9. Constraints, guardrails & operator preferences

- **Never push.** The founder pushes. This held for all 51 commits.
- **Never raise a ratchet baseline.** Widening a *detector* is different and is
  permitted only when the rise is arithmetically explained.
- **Never fabricate a figure**, and never reconcile by averaging.
- **Never drop an agreed section.** "Cut text" means fewer words inside a section
  and prose replaced by elements — section membership is a gated contract.
- `.mcp.json` is intentionally dirty. Never commit it.
- `npm run build` is not part of the cadence. `npx tsc --noEmit` and
  `npm run prebuild` are.
- **Reporting style he wants:** short, under ten lines, leading with what was
  wrong and what was measured. Numbers over adjectives. Corrections stated plainly
  and moved past. He reads commit messages, so those carry the full reasoning
  while the chat report stays tight.
- **He wants to SEE things.** Standalone `.html` files he opens himself, or a
  URL. He has said explicitly that a dev server and a browser session are not how
  he wants to look at work.
- He works by voice and in bursts, often answering with a single word ("go",
  "idk-you-move-forward", "show-me-tradeoffs"). When he says he does not know,
  **give him concrete options with consequences attached**, not open design
  questions — that failed once this session and he said so.
- **Boldness over caution:** the risk is a mediocre-looking product, not a
  regression. Nobody visits the site yet.

---

## 10. Environment & reproduction

Working directory `E:\atlas\website` — its own git repo on `main`, remote
`github.com/benetbani/marginatlas-web`. The parent `E:\atlas\` is the
data-pipeline repo, on branch `p4-seam`, **with no git remote**. Next.js 15.5,
React 19.2, TypeScript 5, Tailwind 3.4, Supabase (eu-west-1), Vercel.

```bash
cd /e/atlas/website
npx tsc --noEmit
npm run prebuild
npx tsx scripts/counts.ts --write     # after anything that changes a repo count
node scripts/verify_token_contrast.mjs
```

**Rendering any route to a standalone file, no dev server:**

```bash
npx tsx --env-file=.env.local --require ./scripts/spikes/stub_next_font.cjs \
  scripts/spikes/render_home_to_scratch.tsx <out-dir> "<route/module/path>"
npx tailwindcss -i src/app/globals.css -o <out-dir>/site.css --minify
```

**Compile the stylesheet AFTER writing the file, never before.** Tailwind emits
only classes it can see. Serve the out-dir *and* `public/` over one HTTP origin;
`file:` is blocked. Reload after every resize.

---

## 11. Landmines & gotchas

- **The Bash CWD resets to `E:\atlas`**, the parent repo. Prefix every command
  with `cd /e/atlas/website &&`. Hit three times this session.
- **Bash heredocs and shell-quoted `node -e` break on apostrophes, backticks and
  nested fences.** Write a script file instead. Hit four times.
- **`$?` after a pipe reports the last command's status.** Use `${PIPESTATUS[0]}`.
- **`git ls-files 'src/app/**/page.tsx'` silently drops `src/app/page.tsx`** — a
  git pathspec glob does not match at depth 1.
- **A crude path grep matches namesakes.** `scores/country_verdict` versus
  `countries/country_verdict` produced a wrong dead-code count until resolved by
  exact import specifier.
- **Prebuild concurrency ≤ 4 on Windows.** Running a `tsx` render concurrently
  with the chain produced `VirtualAlloc failed`.
- **One prebuild run reported exit 1 with no failing gate and did not reproduce.**
  Re-run alone before believing a red.
- **The Browser pane will not composite when hidden** — every screenshot attempt
  times out at 5s. Measure through the DOM instead.
- **`scratchpad/` and `scripts/spikes/` are shared.** Clean up by name, never
  remove the directory.

---

## 12. Glossary

| Term | Meaning |
|---|---|
| **Cell** | country x geography x industry x sub-industry. The flagship page type |
| **Take-home** | what the owner keeps after costs and tax. Resolved by a FLOOR, not an equality |
| **Figure** | one published number with its unit and period |
| **Origin** | where a Figure came from, **per figure, never per cell** |
| **Band** | the spread of a Figure across firms, p10 to p90 |
| **Regime** | which rule produced a Band. Nine code paths produce one |
| **Self-omission** | rendering nothing rather than a placeholder. Ratified; never soften it |
| **The frame** | `AtlasFrame`, the fixed full-screen photograph |
| **The workshop** | `/dev` and `_design`. Built and served, robots-disallowed, no public link |
| **Gate / ratchet** | one check in the prebuild chain / a baseline that may only shrink |
| **Stabilized plate** | the inner near-opaque layer of a glass stack that protects content |

---

## 13. Successor verification checklist

You are oriented when you can answer these:

1. Where does the site's frosted glass already exist, and why is it not visible?
2. Why is `--card` at `.955` "glass in name only", and what number proves it?
3. What was `verify_token_contrast.mjs` actually measuring before it was fixed,
   and what two defects combined to cause that?
4. What is the pairing rule, and what is the lowest legal alpha for a surface
   carrying `--n2`?
5. Why does the convexity bound cover `blur()` but not `saturate()`, and why is
   the bound still valid here?
6. What is the one rule that governs the five variant pages, and what recorded
   history is it defending against?
7. Name three dead ends from §6 and why each was ruled out.
8. What must you never do with the 51 commits?

---

## 14. Re-hydration prompt

    You are resuming an in-progress effort. Another session prepared a complete
    handoff so you can continue with zero context loss. Do NOT start work yet.

    Project: marginatlas.com — graphics review, architecture review, and the
             frosted-glass promotion
    Working directory: E:\atlas\website
    Handoff dossier (read this FIRST, in full):
      E:\atlas\website\docs\handoff\HANDOFF-marginatlas-2026-08-20.md

    Follow these steps exactly:
    1. Read the dossier at the path above, top to bottom.
    2. Then read these files, in this order (the dossier explains why each matters):
       - docs/superpowers/plans/2026-08-17-founder-brief-and-loop-charter.md
         (IN FULL. It is the founder's own quoted words and overrides your judgement.)
       - CONTEXT.md
       - docs/adr/0001-figures-carry-no-visible-origin-mark.md
       - CLAUDE.md
       - docs/superpowers/research/2026-08-20-frosted-glass-implementation.md
       - src/styles/atlas-spine.css, lines 165-210
       - scripts/verify_token_contrast.mjs (read its header argument in full)
       - docs/superpowers/research/2026-08-19-GRAPHICS-REVIEW.md
    3. Do not edit anything, run anything destructive, or make decisions until
       steps 1 and 2 are done.
    4. Then prove you are oriented: answer the "Successor verification checklist"
       in section 13 of the dossier in 5-10 lines. Keep it tight; this is a
       checkpoint, not an essay.
    5. Flag any contradiction or gap between the dossier and the actual files. The
       dossier is a point-in-time snapshot; the code is ground truth. You should
       expect to find at least one: docs/loop/STATE.md records the gate count as
       103 and the chain is 104.
    6. Then stop and wait for my go, EXCEPT for the committed next step in section
       8, which is pre-authorised: writing the translucency ladder into
       globals.css and retiring --text-faint. If you begin it, say what you are
       about to do first.

    Honor the operator preferences and guardrails in the dossier as if they were
    given to you directly. Above all: NEVER push, never raise a ratchet baseline,
    never fabricate a figure, never touch the homepage H1, and never let an agent
    express a preference between the A/B/C variants — the founder picks those. If
    anything is unclear, ask before acting, but only after you have read
    everything above.
