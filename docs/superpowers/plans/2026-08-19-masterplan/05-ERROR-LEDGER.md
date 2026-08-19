# 05 — THE ERROR LEDGER

> Everything this project has already paid for. Organised by **what you are about
> to do**, so it can be consulted in seconds at step S0.4 rather than read once
> and forgotten.
>
> **Append to this file whenever a tick loses time to something.** A trap that
> cost twenty minutes will cost the next agent twenty minutes.

---

## A. Before you touch a BACKGROUND, a wrapper, or anything with z-index

**A1. A `position: static` element is NOT DRAWN.** `AtlasFrame` paints two
`position: fixed` layers at `z-index: 0`. CSS paints positioned z-index-0
descendants *after* in-flow ones, so a static element is not dimmed, not faint —
absent. **This hid the site's entire footer on every page for weeks**: black
ground, wordmark, all five link columns, with every class correct and every gate
green. The site survived only because `ToneBand` and `.atlas-card` happen to be
`relative`. Fixed site-wide by giving `<main>` a `relative`.

**A2. Do not card the homepage section headings.** Measured: the backdrop's
darkest point is luminance **0.4179**, which puts `ink-900` at **7.78:1** there —
clear of AAA. A visual pass nearly restructured eight bands to fix contrast that
was already passing. `atlas-700` under 24px is the real failure at **3.79:1**.

**A3. Measure the contrast against the ACTUAL painted pixel**, not the token you
believe is behind the text. Over a photograph, the token is not the backdrop.

---

## B. Before you MEASURE anything in a browser

**B1. Resizing without reloading lies about height.** `/blog` reported 12,282px
after a resize where a fresh load of the identical file gave **32,114**. Reload
after every resize or the number is fiction.

**B2. Compile the stylesheet AFTER writing the file.** Tailwind emits only the
classes it can see. A class written after the compile emits **no rule** and the
element renders unstyled while looking perfect in source. Cost twice: a
`lg:columns-2` index measured taller at 1280 than at 768, and an
`--atlas-header-h` token read as empty. **If a measurement is impossible or reads
empty, suspect this first.**

**B3. Checking one width is not checking.** Three separate defects existed at
exactly one breakpoint: an anchor offset verified at 1440 left three bands broken;
a country row verified at desktop gave its value column 37px at 375 and sliced
words mid-way; `/industries` was fine at desktop and a **blank white sheet on a
phone across 200 routes**.

**B4. The browser preview pane has a 0x0 hidden viewport.** `.focus()` does
nothing, IntersectionObserver never fires, every layout measurement is zero.
Verify anything interactive in jsdom instead.

**B5. `file:` is blocked.** Serve the scratch directory *and* `public/` over HTTP
from one static server, so `/spine/_skyline.jpeg` resolves at the path the markup
asks for.

**B6. Comparing rounded display values invents defects.** Seven apparent
take-home breaches turned out to be the money formatter abbreviating.

**B7. An SSR render cannot distinguish "rendered identically" from "self-omitted
identically."** Print byte counts per route so an empty render is visible rather
than passing quietly as a match.

---

## C. Before you touch a COLOUR or a TOKEN

**C1. A banned colour hides under a permitted name.** Four times in one session:
`parchment` *was* `cream-300` across 419 call sites; `teal` measured hue 150
(green); `delta.positive` held moss-700; `--pos` held it again. **Check the value,
never the name.**

**C2. Deleted ramps only truly die under `theme.colors` (replace), not
`theme.extend.colors` (merge).**

**C3. A class naming a ramp step that does not exist emits no rule and fails
silently.** That is why `verify_token_steps_exist` exists.

**C4. Do not lower the palette gate's 93% lightness escape to catch cream.** It
re-catches every warm and cool white on the site. That is why `verify_no_cream` is
a separate gate that counts by VALUE, in both hex and rgb notations.

**C5. Good-versus-bad is shown with INTENSITY IN ONE HUE, never two hues.** The
one correct implementation is `src/lib/scores/band_tone.ts`.

---

## D. Before you trust or change a GATE

**D1. Gates lie, and fixing the instrument beats fixing the symptom.**
`verify_palette_membership` knew **three** colour names out of nineteen, so
`bg-emerald-700` was invisible to it; it had never scanned `src/lib`, so it had
never read the file that *defines* the palette; and `strip_comments` treated a
`/*` inside a string literal as a comment opener, blinding every gate in the
chain for 195 lines of one file.

**D2. Detector widening has three inputs** — name list, hue bands, scan roots.
Widening one and not the others leaves a hole.

**D3. Never raise a ratchet baseline to make it pass.** Widening a *detector* is a
different operation, permitted only when the rise is arithmetically explained.

**D4. A ratchet that can never reach zero gets read as noise.** The take-home
bypass list was stuck at six because several modules matched the detected *shape*
while being measurably clean. Rebuilt into two buckets: `unreviewed` must be
empty, `reviewed` carries per-entry evidence.

**D5. Do not import the resolver into a formatter to quiet a gate.** An agent
correctly refused this as dishonest, and that refusal is what exposed D4.

**D6. A gate count that reads low is how a missing gate hides.** The chain is the
authority, not any document that quotes a number.

**D7. My own palette-guard regression test once FAILED to catch an injected
`bg-emerald-500`** — inherited bug: `const was = base.files[f]; if (was != null…)`
skipped files with no baseline entry. Fixed to `?? 0`. **Test your test.**

---

## E. Before you touch a NUMBER

**E1. `resolveOwnerTakeHome` returns a FLOOR, not an equality:**
`max(structuralNetProfit, clampMargin(rawNetMargin) * revenue)`, then a
larger-firm floor. Asserting `take-home == margin × revenue` fails on correct
data.

**E2. Never fabricate a figure and never reconcile by averaging.** A gap is
recoverable; a wrong number is not.

**E3. Self-omission is the sanctioned response to missing data**, and it is
preferred over a placeholder.

**E4. Do not "fix" the cell-page data bands that self-omit locally.** Documented
latency artifact: cell lookups exceed a 4s budget from this machine to eu-west-1.
They render in production. Do not raise the budget, add caching, or soften the
self-omit.

**E5. Read the module that produces a number before acting on it.** Six
measurement artifacts have died to skipping this step.

---

## F. Before you run anything TREE-WIDE (parallel agents share one checkout)

**F1. NEVER `git stash`, `git checkout .`, or `git reset --hard`.** Tree-wide, not
file-wide. One agent stashed to isolate a typecheck and swept up two other agents'
uncommitted work. Use a separate worktree to isolate.

**F2. A stash holding a PRE-DELETION state is a loaded footgun.** Popping it later
silently restores lines a commit deliberately removed. Before dropping one, prove
it superseded by diffing each file against the commit that landed it.

**F3. `tsc` and `prebuild` are tree-wide too.** A red gate may belong to another
agent mid-write — this happened twice on the take-home gate. Check whose file is
failing before reporting it.

**F4. Checkpoint-commit.** Every agent that batched has lost work; every agent
that checkpointed has kept all of it.

**F5. NEVER `git commit --amend` on this branch.** Added 2026-08-19. An agent
committed, another agent committed in the gap before it went back to fix its own
message, and the `--amend` **retargeted the other agent's commit and overwrote
its message**. `--amend` rewrites whatever `HEAD` points at *now*, not the
commit you made. It is the same class of error as `git stash`: an operation that
looks file-scoped and is actually branch-scoped.

Nothing was lost, and the recovery is worth recording because it is the right
one. The agent detected it immediately, restored the message byte-for-byte, and
did **not** rebase afterwards to tidy a cosmetic stray character on its own
commit, on the grounds that rewriting history again while another agent is
mid-edit is the exact hazard it had just caused. **Verified independently rather
than taken on report:** `f62d645c` (pre-amend) and `9ead9988` (restored) have the
identical tree hash `77286760` and byte-identical messages, and the pre-amend
commit survives dangling.

If you must fix a message, make a new empty commit that says so, or leave it.
A cosmetic defect in a commit subject costs nothing. A rewritten shared history
costs somebody else's work.

**F5. Prebuild concurrency ≤ 4 on Windows.** 6 segfaults intermittently. Two
agents crashed on Windows OOM under parallel concurrency during a `spine2`
typecheck.

---

## G. Tooling traps on this machine

**G1. The Bash CWD resets to `E:\atlas`** — the PARENT repo, on branch `p4-seam`,
with no git remote. Prefix every command with `cd /e/atlas/website &&` or you will
inspect, and possibly commit to, the wrong repository. *(Hit again on 2026-08-19
while checking the push remote.)*

**G2. Bash heredocs eat backslashes and break outright on nested code fences.**
Use the Write tool for anything with a regex or a fenced block. *(Hit again
2026-08-18 writing the handoff dossier.)*

**G3. Playwright writes screenshots to `E:\atlas`**, not the website repo.

**G4. `scratchpad/` and `scripts/spikes/` are SHARED.** Clean up by name; never
remove the directory. `scripts/spikes/` holds real tracked repo code.

**G5. `$?` after a pipe reports the last command's status.** Use `${PIPESTATUS[0]}`.

**G6. `.mcp.json` is intentionally dirty. Never commit it.**

**G7. A Python line-based edit once cut 80 lines instead of 21** because the end
matcher hit the wrong brace. Use the Edit tool for structured edits.

**G8. `next/font/google` is a build-time transform** and is not a function at
runtime — shim it. Stub the three router hooks ONLY; leave `notFound` and
`redirect` real, or the harness reports a 404 route as rendering. Stub `.css` and
image imports or the CJS loader parses them as JavaScript.

---

## H. Judgement traps

**H1. An adversarial panel asymptotes.** It will always find one more nit. A
previous run of this project was called *"mediocre"* after exactly this grinding.
Converge: ship when the checks pass and the adversary has nothing with a NUMBER.

**H2. Do not fold two things together because they share a size.** A reported
"same caption role spelled three ways" was actually two — the third was a label at
`--text-body` weight 600, a different role entirely.

**H3. Agent-reported findings are not automatically true.** Corrected in one
session: a claimed "12px floor is broken" (0 of 78 call sites override the size),
and a reported 117px masthead band that could not be reproduced. Verify before
passing a finding on to the founder.

**H4. Do not touch the H1.** Settled and locked. The argument for changing it has
already been made and rejected.

**H5. A whole-page pass cannot be reviewed honestly.** Both of this project's
rejections were of whole-page passes. Work in sections.

---

## I. Dead ends — do not retry

1. Carding the homepage section headings (see A2).
2. Asserting take-home equals margin × revenue (see E1).
3. "Fixing" the locally self-omitting cell data bands (see E4).
4. Lowering the palette gate's lightness escape to catch cream (see C4).
5. Importing the resolver into a formatter to empty the bypass list (see D5).
6. `git stash` while agents are running (see F1).
7. Touching the H1 (see H4).
8. Folding a label into a caption class because they share a size (see H2).
9. Iterating a throwaway raw-HTML mockup instead of the real Next.js page — the
   original documented cause of a week of rejected work.
10. Inventing a new icon language. The kit has `AtlasIcon`, `AtlasSpot`, trade
    icons and spine glyphs. Same logic covers new type steps, card treatments and
    motion patterns.

---

## J. Open questions, unanswered

**J1. The type floor** (charter §13 Q1). 114 text nodes compute under 12px. The
live decision is the 10px step, 31 nodes, 24 of them the character panel's
spectrum end labels — load-bearing, not decorative. Recommendation on file: **B**
(10px → 10.5px, a size already in the ladder).

**J2. The quiet-text colour** (charter §13 Q2). **82 of the 114 are one token.**
`--text-faint` `#87745d` measures **4.48:1** on white, 4.35:1 over the card's
worst backdrop; AA is 4.5. It misses everywhere by ~0.15. The next step down,
`--text-muted` at 9.58:1, would collapse quiet into body, and nothing exists
between them — any fix must *invent* a hex. Recommendation on file: **B** (accept
and document it, so it stops being rediscovered).

**J3. Do the prebuild gates run on deploy?** No `vercel.json`, so the build
command is a dashboard setting. If Vercel runs `next build` directly, the npm
`prebuild` hook is bypassed and all gates are skipped in CI while passing locally.
One line settles it: `{ "buildCommand": "npm run build" }`.

**J4. Two Supabase migrations written and never applied.** `newsletter_signups`
and `corrections` do not exist, so every signup and every reader correction is
silently discarded while the forms report success.
`db/migrations/2026-08-16-*.sql`, both idempotent, must be run by hand.
**Now live on production, so this is actively losing data.**
