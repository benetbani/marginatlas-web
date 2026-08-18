# HANDOFF — marginatlas.com, the unattended design loop

**Status, 2026-08-18:** 162 commits sit unpushed on `main` in `E:\atlas\website`. The
20-minute autonomous loop that produced them has been **stopped at the operator's
instruction** ("stop-the-work"); its cron job is deleted and no agents are running. The
tree is clean, `npx tsc --noEmit` is clean, and the prebuild chain is **101/101**.
Nothing has been pushed and nothing is deployed. The operator pushes.

> **How to use this document.** Read top to bottom once. Then read the files in §7 in
> the order given. Do not start work until you can answer the checklist in §13. A
> ready-to-paste re-hydration prompt is §14.

---

## 1. TL;DR

marginatlas.com is a global small-business benchmarks atlas: what a business earns in a
place and what its owner actually keeps. **Nobody visits it yet**, which is a licence to
make bold design changes and a reason to care only about quality, not regression risk.
For roughly two days an unattended loop ran every 20 minutes, dispatching three or four
specialist subagents per tick against a charter written from the founder's own quoted
words. The work was overwhelmingly **defect-finding by rendering pages and reading
pixels**, a capability this project did not have before and which found things no amount
of source reading had: the site's entire footer unpainted on every page, `/industries` a
blank white sheet on a phone across 200 routes, a homepage card printing **$1** beside
"3% net" of $150,000, a chart drawing the opposite of its own caption.

The single most important thing to know: **this codebase's failure mode is a plausible
number or a plausible pixel that nobody checked**, and the antidote installed here is a
set of gates plus a screenshot harness. Recommended next action: **push the 162
commits** (only the operator does this), then answer the two design questions in charter
§13, which are blocking further type work.

---

## 2. Mission & success criteria

**The enduring goal**, in the founder's framing: get marginatlas.com to *"a homepage the
founder wakes up to and thinks is perfect"*, and carry the same design across every page
type.

**The current tactic**: an unattended loop doing design and data-honesty work on the
newest version in the repo, verified by rendering.

**Hard constraints that bound any solution** (all founder rulings, all quoted in the
charter):

| Rule | Charter |
|---|---|
| Work on the repo's newest version. Never chase the live site. | §0.1 |
| Quality over speed. One considered change beats five fast ones. | §0.2 |
| Measure before changing; read the module that produces a number before acting on it. | §0.3 |
| The background photograph is fixed, full-screen, visible at the edges, softened in the centre **by the cards** | §1 |
| Cream is banned outright | §2 (DONE) |
| The H1 is settled and locked | §3 |
| Terracotta plus cool neutrals only. No green, no amber, no brown. | §8 |
| Prefer self-omission to a number you cannot source | §8 |
| **Never push.** The founder pushes. | §9 |

"Done" for a tick: one excellent change, `tsc` clean, prebuild green, the change
rendered and read back, and a commit saying what was wrong and what was measured.

---

## 3. Current state — ground truth

| Component | Status | Notes |
|---|---|---|
| Branch / commits | `main`, **162 unpushed** | Nothing pushed all session, by rule |
| Working tree | Clean | Except `.mcp.json` (intentionally dirty, never commit) |
| `npx tsc --noEmit` | Clean | Verified after the final commit |
| `npm run prebuild` | **101/101** | Verified after the final commit |
| Cream ratchet | **33 across 16 files** | All hex literals counted by value; 28 are `#ffffff` |
| Palette ratchet | **4 across 2 files** | A dev page and the OG card, the latter a documented exclusion |
| Take-home bypasses | **0 unreviewed, 5 reviewed** | Two-bucket design; `unreviewed` must stay empty |
| The loop | **STOPPED** | Cron `7f8722ea` deleted at operator instruction |
| Agents | None running | Two died on a session limit; their work was verified and committed |
| Deployment | Not deployed | Production is far behind and that is expected (§0.1) |

**Believed but NOT proven:** whether the prebuild gates actually run on a Vercel deploy.
There is no `vercel.json`, so the build command is a dashboard setting; if Vercel runs
`next build` directly, the npm `prebuild` hook is bypassed and all 101 gates are skipped
in CI while passing locally. `CLAUDE.md` records the one-line fix and leaves it to the
operator because it is a deploy decision.

**Untracked and deliberately left:** `scripts/spikes/deadcode_boards_probe.tsx` (a dead
agent's one-shot proof instrument) and `scratchpad/` (shared agent scratch). Neither was
mine to delete.

---

## 4. How we got here — the decision trail

**The loop's authority document was written first.** The founder gave a long voice
review; every ruling was decomposed into checkable requirements and quoted verbatim in
`docs/superpowers/plans/2026-08-17-founder-brief-and-loop-charter.md`. That file
overrides the loop prompt and overrides any agent's judgement. Its §1 background
requirements are labelled B1-B6 precisely so "is the background right" became six
yes/no tests instead of an opinion.

**The pivotal moment was building a screenshot.** For months every background claim was
verified as *declared* rather than *seen*. §9.1 records a recipe that renders a real App
Router route to a file with no dev server. On its first run it found that **the site's
entire footer had not been painted on any page for weeks** — black ground, wordmark, all
five link columns — with every class correct and every gate green. That produced §9.2,
the paint rule: `AtlasFrame` paints fixed layers at `z-index: 0`, so **anything
`position: static` is not drawn at all**. Not dimmed. Absent.

**Every ratified rule became a gate in the same session**, per CLAUDE.md's working
method. Three were built: `verify_no_cream` (the ban was previously unenforceable
because the palette gate returns legal above 93% lightness), `verify_token_steps_exist`
(a class naming a ramp step that does not exist emits no rule and fails silently), and
`verify_take_home_identity` (a printed take-home may never sit below the margin shown
beside it).

**Gates were repeatedly found lying, and fixing the instrument beat fixing the symptom.**
`verify_palette_membership` knew three colour names out of nineteen, so `bg-emerald-700`
was invisible to it; it had never scanned `src/lib`, so it had never read the file that
*defines* the palette; and `strip_comments` treated a `/*` inside a string literal as a
comment opener, blinding every gate in the chain for 195 lines of one file.

**A ratchet stuck at six was rebuilt into two buckets.** The take-home bypass list could
not reach zero because several modules matched the detected *shape* while being
measurably clean. An agent refused the dishonest exit — "importing the resolver into a
formatter to quiet the gate would be dishonest" — and that refusal exposed the design
flaw: a number that can never reach zero gets read as noise. `unreviewed` must now be
empty; `reviewed` carries the evidence per entry.

**The founder's own words that shaped the design work:**
- *"It lacks flavor, it lacks elements. It just has a lot of text, when it should not."*
- *"our pages should not be bloated with text"*
- *"we put everything in those cards"*
- On `/cities`: *"it's just a big list of cities which doesn't end, and it's executed
  completely, completely awful way."* That sentence became the standard later applied to
  `/blog`, which was 32,114px on a phone and is now 6,352.

---

## 5. Hard-won truths & mental model

1. **A `position: static` element is not drawn.** The site survived on `ToneBand` and
   `.atlas-card` happening to be `relative`. Anywhere neither applied, content vanished.
2. **Checking one width is not checking.** Three separate defects existed at exactly one
   breakpoint: an anchor offset verified at 1440 left three bands broken; a country row
   verified at desktop gave its value column 37px at 375 and printed words sliced
   mid-way; `/industries` was fine at desktop and a blank sheet on a phone.
3. **A banned colour hides under a permitted name.** Four times in one session:
   `parchment` *was* `cream-300` across 419 call sites; `teal` measured hue 150 (green);
   `delta.positive` held moss-700; `--pos` held it again.
4. **Comparing rounded display values invents defects.** Seven apparent take-home
   breaches turned out to be the money formatter's abbreviation.
5. **Resizing the viewport without reloading lies about height** — `/blog` reported
   12,282px where a fresh load of the identical file gave 32,114.
6. **Compile the stylesheet AFTER writing the file.** Tailwind emits only classes it can
   see; a class written after the compile emits no rule and renders unstyled. Cost twice
   in one day.
7. **Good-versus-bad is shown with INTENSITY IN ONE HUE**, never two. The one place that
   does it is `src/lib/scores/band_tone.ts`; the palette gate's own header prescribes it.
8. **Vocabulary matters here.** A *cell* is a country x geography x industry x
   sub-industry page; *take-home* is what the owner keeps; *self-omission* is the
   sanctioned response to missing data.

---

## 6. Dead ends — do NOT retry

- **Do not card the homepage section headings.** Measured: the backdrop's darkest point
  is luminance 0.4179, so `ink-900` headings read **7.78:1** there and clear AAA. A
  visual pass nearly restructured eight bands for nothing. (Charter §9.1.1.)
- **Do not assert `take-home == margin x revenue`.** The resolver returns
  `max(structuralNetProfit, marginFloor)` then applies a larger-firm floor. Equality
  fails on correct data. The contract is a floor, in one direction only.
- **Do not "fix" the cell-page data bands that self-omit locally.** Documented latency
  artifact: cell lookups exceed a 4s budget from this machine to eu-west-1. They render
  in production.
- **Do not lower the palette gate's 93% lightness escape** to catch cream. It re-catches
  every warm and cool white on the site. That is why `verify_no_cream` exists separately.
- **Do not import the resolver into a formatter** to empty the take-home bypass list.
  The remaining entries are measurably clean; the list is not meant to reach zero.
- **Do not run `git stash`, `git checkout .` or `reset --hard` while agents run.** They
  are tree-wide and have already swept up two agents' uncommitted work. Use a worktree.
- **Do not touch the H1.** Settled and locked; the argument for changing it has already
  been made and rejected.
- **Do not fold a label into a caption class because they share a size.** One such
  "third duplicate" was `--text-body` at weight 600 and a different role entirely.

---

## 7. Critical files & artifacts (reading order)

| # | Path | Role | Priority |
|---|---|---|---|
| 1 | `docs/superpowers/plans/2026-08-17-founder-brief-and-loop-charter.md` | **THE authority.** Founder's quoted rulings; the screenshot recipe (§9.1); the backdrop measurement (§9.1.1); the paint rule (§9.2); the parallel-agent rules (§9.3); the open design question (§13) | READ FIRST, IN FULL |
| 2 | `CLAUDE.md` | Working method, hard constraints, canonical patterns, outstanding manual actions | Essential |
| 3 | `docs/verification-protocol.md` | The project's definition of done | Essential |
| 4 | `scripts/prebuild_all.ts` | The 101-gate chain; each gate's registration comment says why it exists | High |
| 5 | `src/components/AtlasFrame.tsx`, `src/components/SiteChrome.tsx` | The background and the chrome; where the paint rule bites | High |
| 6 | `src/lib/finance/owner_take_home.ts` | The take-home resolver; the contract three gates protect | High |
| 7 | `src/lib/scores/band_tone.ts` | The one good-versus-bad ladder | High |
| 8 | `scripts/verify_take_home_identity.ts` | Two-part gate; its header explains the two-bucket ratchet | Medium |
| 9 | `src/app/page.tsx` | The homepage, the priority surface | Medium |
| 10 | `docs/superpowers/plans/2026-08-17-cohesion-audit.md` | The §7 cohesion survey | Reference |
| 11 | `docs/brand/design-system.md`, `docs/brand/cohesion-master-plan.md` | The design language. Do not invent a new one. | Reference |

---

## 8. Open threads & next steps

### Committed next step (operator-only)

**Push the 162 commits.** Only the operator does this; the loop is forbidden from
pushing. Verify first with `npx tsc --noEmit` and `npm run prebuild` (expect 101/101).

### Blocked on a founder decision

**Charter §13, the small type.** Two questions, each with three options and a stated
recommendation, written so they can be answered in one word each. **Do not pre-empt
them.**

- *Q1, the floor.* 114 text nodes compute under 12px. There is no site-wide 12px rule
  being broken (checked: `SectionEyebrow`'s comment governs only itself, and none of its
  78 call sites overrides the size). The live decision is the 10px step, 31 nodes, 24 of
  them the character panel's spectrum end labels, which are load-bearing rather than
  decorative. **Recommendation: B** (10px to 10.5px, a size already in the ladder).
- *Q2, the colour.* **82 of the 114 are one token.** `--text-faint` `#87745d` measures
  **4.48:1** on white and 4.35:1 over the card's worst backdrop; AA is 4.5. It misses
  everywhere by about 0.15. The next step down, `--text-muted` at 9.58:1, would collapse
  the quiet tone into the body tone, and nothing exists between them, so any fix must
  *invent* a hex. **Recommendation: B** (accept and write it down so it stops being
  rediscovered).
- Verify: charter §13 records the answer, and `CountryShape`'s private
  `@media (max-width:380px)` block (9.5px rim read, 8px sample tag) is settled by it.

### Ready to pick up

| # | What | Why it matters | Where | How to verify |
|---|---|---|---|---|
| 1 | An aria-label says "All trades average" over a **median** | Screen readers get a false quantity name | `src/components/spine/industry/industry-view.tsx:137` | Render, read the aria-label |
| 2 | The same trade reads `$9` in one block and `8.6%` in another; 6 of 6 rows disagree, worst 0.5pp | One quantity carried at two precisions | `src/lib/spine/adapt_industry.ts` | Render an industry page, compare both blocks |
| 3 | Six `preserveAspectRatio="none"` instances | Circles draw as ellipses; text squashes on one axis | `spine/cell-view.tsx:223`, `spine/city/chapters.tsx:62`, `spine/industry/forms.tsx:204`, `spine/kit.tsx:574`, `spine2/Quad.tsx:149` | Measure rendered aspect ratio at 375/768/1280 |
| 4 | `#newsletter` carries `scroll-mt-20` (80px); the masthead is 85px there | The anchor lands under the bar at 375 and 414 | `src/components/newsletter/NewsletterSignupVariants.tsx` | Jump to `/#newsletter` at 375 |
| 5 | `buildCityBoard` has 0 external references; `buildCountryBoard` has 6, **all from its own gate** | Dead code kept alive by a green gate | `src/lib/scores/`, gate `country-board` | Count references properly (barrel re-exports are the trap), then delete module and gate together |

### Optional / someday

- **Two Supabase migrations written and never applied.** `newsletter_signups` and
  `corrections` do not exist, so every signup and every reader correction has been
  silently discarded while the forms said they worked. `db/migrations/2026-08-16-*.sql`,
  both idempotent, must be run by hand in the SQL Editor. This is the highest-value
  non-code item in the repo.
- `{ "buildCommand": "npm run build" }` in a `vercel.json` would settle whether the gates
  run on deploy.

---

## 9. Constraints, guardrails & operator preferences

- **Never push.** The operator pushes. This held for all 162 commits.
- **Never raise a ratchet baseline to make it pass.** Widening a *detector* is a
  different operation and is permitted only when the rise is arithmetically explained by
  the change; `verify_palette_membership` enforces that distinction in code, across all
  three of its inputs (name list, hue bands, scan roots).
- **Never fabricate a figure**, and never reconcile by averaging. A gap is recoverable, a
  wrong number is not.
- **Never drop an agreed section** without saying so explicitly.
- `.mcp.json` is intentionally dirty; never commit it.
- `npm run build` is not part of the cadence. `npx tsc --noEmit` and `npm run prebuild`
  are.
- **Reporting style the operator wants:** short, under ten lines, leading with what was
  wrong and what was measured. Numbers over adjectives. Corrections stated plainly and
  moved past, not dwelt on. He reads commit messages, so those carry the full reasoning
  while the chat report stays tight.
- He works by voice and in bursts: asks for a loop, sleeps, reads the reports later. He
  wants boldness, not caution: *"the risk is a mediocre-looking product, not a
  regression."*

---

## 10. Environment & reproduction

Working directory `E:\atlas\website` (its own git repo; the parent `E:\atlas\` is the
data-pipeline project). Next.js 15.5, React 19.2, TypeScript 5, Tailwind 3.4, Supabase
(eu-west-1), Vercel.

```bash
cd E:/atlas/website
npx tsc --noEmit          # ~30-60s
npm run prebuild          # 101 gates, parallel, ~90s
```

**Rendering a real route without a dev server** (charter §9.1, the instrument that found
nearly everything):

1. `npx tailwindcss -i src/app/globals.css -o <scratch>/site.css --minify` — **after**
   writing your file, never before.
2. Render the route by awaiting its default export. Routes with Suspense need
   `renderToPipeableStream` with `onAllReady`, not `renderToStaticMarkup`.
3. Three shims, all documented traps rather than defects: `next/font/google` is a
   build-time transform and is not a function at runtime; `useRouter`'s invariant throws
   with no app router mounted (stub the three hooks ONLY, leave `notFound` and `redirect`
   real, or the harness reports a 404 route as rendering); `.css` and image imports must
   be stubbed or the CJS loader tries to parse them as JavaScript.
4. `file:` is blocked in the browser tools. Serve the scratch dir **and** `public/` from
   one static server so `/spine/_skyline.jpeg` resolves at the path the markup asks for.
5. Navigate, `browser_evaluate` to read computed values, screenshot as **jpeg**, read it.
6. Reload after every resize.

Supabase env vars can be stubbed (`https://localhost.invalid`) for render-only work; the
data bands then self-omit, which is expected and must not be "fixed".

---

## 11. Landmines & gotchas

- **Bash heredocs eat backslashes**, and nested code fences break them outright. Use a
  file for anything containing a regex or a fenced block.
- **Playwright writes screenshots to `E:\atlas`** (the parent repo), not the website
  repo. Delete them by name.
- **`scratchpad/` is shared between agents.** Clean up files BY NAME, never remove the
  directory. Same for `scripts/spikes/`, which holds real repo code.
- **`$?` after a pipe reports the last command's status**, not the gate's. Use
  `${PIPESTATUS[0]}`.
- A red gate during parallel work may belong to another agent mid-write. Check whose file
  is failing before reporting it; this happened twice on the take-home gate.
- Prebuild concurrency must stay at or below 4 on Windows; 6 segfaults intermittently.
  Two agents crashed on Windows OOM under parallel concurrency during a `spine2`
  typecheck.
- A stash holding a **pre-deletion** state is a loaded footgun: popping it later silently
  restores lines a commit deliberately removed. One such stash was verified superseded
  (each file diffed against the commit that landed it) before being dropped.

---

## 12. Glossary

| Term | Meaning |
|---|---|
| **cell** | A country x geo x industry x sub-industry page. The flagship page type. |
| **take-home** | What the owner keeps after costs and tax. The site's core number. |
| **the resolver** | `resolveOwnerTakeHome`, which reconciles structural profit with the margin a page actually shows. |
| **ratchet** | A gate baseline that may shrink and never grow. |
| **self-omission** | Rendering nothing rather than a placeholder when data is missing. Sanctioned and preferred. |
| **the frame** | `AtlasFrame`, the fixed site-wide photograph. |
| **the charter** | `docs/superpowers/plans/2026-08-17-founder-brief-and-loop-charter.md`. |
| **spine / spine2** | Successive page-body reform generations, behind feature flags. |
| **the engraved family** | The `eng-*` CSS component set the country page runs on. |
| **band / ToneBand** | A full-width homepage section wrapper. |

---

## 13. Successor verification checklist

You are oriented when you can answer these:

1. Why is `position: static` dangerous on this site, and which two things saved the
   homepage from it?
2. What exact contract does `verify_take_home_identity` assert, and why is it a floor
   rather than an equality?
3. Why does the take-home bypass list have two buckets, and which one must stay empty?
4. What is the single thing you must never do with the 162 commits?
5. Name two dead ends from §6 and why each was ruled out.
6. What are the two questions in charter §13, and what is the recommendation for each?
7. Which two Supabase tables do not exist, and what is being silently discarded?
8. Why must you compile the stylesheet *after* writing a file rather than before?

---

## 14. Re-hydration prompt

Paste this into a fresh chat:

    You are resuming an in-progress effort. Another session prepared a complete handoff
    so you can continue with zero context loss. Do NOT start work yet.

    Project: marginatlas.com (the unattended design + data-honesty loop)
    Working directory: E:\atlas\website
    Handoff dossier (read this FIRST, in full):
      E:\atlas\website\docs\handoff\HANDOFF-marginatlas-2026-08-18.md

    Follow these steps exactly:
    1. Read the dossier at the path above, top to bottom.
    2. Then read these files, in this order (the dossier explains why each matters):
       - docs/superpowers/plans/2026-08-17-founder-brief-and-loop-charter.md
         (IN FULL. It is the founder's own quoted words and overrides your judgement.)
       - CLAUDE.md
       - docs/verification-protocol.md
       - scripts/prebuild_all.ts
       - src/components/AtlasFrame.tsx and src/components/SiteChrome.tsx
       - src/lib/finance/owner_take_home.ts
       - src/lib/scores/band_tone.ts
    3. Do not edit anything, run anything destructive, or make decisions until steps
       1 and 2 are done.
    4. Then prove you are oriented: answer the "Successor verification checklist" in
       section 13 of the dossier in 5-10 lines: the mission, the current state, the
       committed next step, and the top thing you must NOT do. Keep it tight; this is
       a checkpoint, not an essay.
    5. Flag any contradiction or gap you find between the dossier and the actual files.
       The dossier is a point-in-time snapshot; the code is ground truth.
    6. Then stop and wait for my go. The only pre-authorised action is verification
       (npx tsc --noEmit, npm run prebuild).

    Honor the operator preferences and guardrails in the dossier as if they were given
    to you directly. Above all: NEVER push, never raise a ratchet baseline, never
    fabricate a figure, and do not touch the homepage H1. If anything is unclear, ask
    before acting, but only after you have read everything above.
