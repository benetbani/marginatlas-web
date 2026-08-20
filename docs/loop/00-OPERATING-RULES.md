# 00. Operating rules. Read these first, every tick, before the step file.

These are invariants. A step file may add to them and may never relax them.

---

## 1. The seven things a tick may never do

1. **Never push.** The founder pushes. Commits accumulate on `main` locally. This
   held for 162 commits and it holds tonight.
2. **Never deploy**, never run `npm run build`, never touch Vercel.
3. **Never raise a ratchet baseline to make a gate pass.** Widening a detector is
   a different operation, permitted only when the rise is arithmetically
   explained by the change, and it is stated in the commit message.
4. **Never fabricate a figure**, never reconcile two figures by averaging them,
   never publish a number without a traceable input. A gap is recoverable, a
   wrong number is not. Self-omission is always the sanctioned answer.
5. **Never touch the homepage H1.** Settled and locked, charter section 3.
6. **Never run `git stash`, `git checkout .`, `git reset --hard`, or any
   tree-wide revert.** They have already swept up two agents' work. To isolate a
   typecheck, use a worktree.
7. **Never delete anything outside the attic rule** in `01-CLEANUP.md`. Move to
   `E:\atlas\_attic\<date>\`, do not destroy.

## 2. The unattended rule. He is asleep, so never block.

A tick never asks a question and never stops to wait. When a real decision
appears:

1. Write it into `DECISIONS-NEEDED.md`: the question in one sentence, three
   options, the measurement behind each, and a recommendation answerable in one
   word.
2. Then act on the recommendation **only if the action is reversible and touches
   no locked value.** Locked values today: the H1, the background treatment in
   charter section 1, cream stays banned, terracotta plus cool neutrals only,
   never push.
3. If the action is not reversible, or it touches a locked value, do nothing on
   that thread and take the next item in the step file instead.

Do not pre-empt a question already open. **Ten are open in `DECISIONS-NEEDED.md`
today, and two of them are both numbered Q3** (the loop's "do the gates run on a
deploy" and the architecture review's "typed absence, or self-omission").
Renumber before adding an eleventh. This line used to say "the two questions in
charter section 13"; those are now Q1 and Q2 in the decisions file, and the count
moved five times while the sentence did not.

## 3. Verification cadence. Every tick, no exceptions.

```bash
cd /e/atlas/website && npx tsc --noEmit
cd /e/atlas/website && npm run prebuild
```

- `tsc` must be clean. `prebuild` must pass **at the count the chain itself
  reports**. This line used to quote 102 and was stale within four ticks, which
  is the whole argument: **the chain is the authority on the gate count, never a
  document that quotes one, and a count reading low is how a missing gate hides.**
  The current number is carried in the generated block in `CLAUDE.md`, kept honest
  by `verify_counts_fresh` and printed by `node scripts/loop_status.mjs`. Do not
  type it here again.
- `cell-lattice` reports **3 deferred** checks. That is its own honest output and
  it is not a failure. Deferred is not passed.
- **The Windows flake is real and it is not a red gate.** A gate that fails with
  a Go runtime trace and `TransformError: The service was stopped` is esbuild
  dying under parallel load, not an assertion failing. Re-run that one gate alone
  from `E:\atlas\website` before reporting anything red. Observed 2026-08-18 on
  `no-slot-counting`, which passed instantly on its own.
- Prebuild concurrency stays at or below 4 on Windows.
- **The Bash CWD resets to `E:\atlas`, the parent repo.** Prefix every command
  with `cd /e/atlas/website`. A gate run without it fails with
  `ERR_MODULE_NOT_FOUND` and looks like a defect.
- **MEASURE IN ONE PROCESS. Never loop a command per commit, per file, or per
  row.** Added tick 12, from evidence produced by breaking it: a
  `git log | while read h; do git show ...; done` over 1,000 commits spawned
  thousands of processes, timed out at ten minutes, and left the shell reporting
  `MEM_COMMIT failed, Win32 error 1455` and `fork: Resource temporarily
  unavailable`. **That is the same fault family that stopped ticks 8 and 9 dead**
  (`spawn UNKNOWN`, `0xC000012D`), so the machine-wide failures this loop has
  been treating as weather are at least partly self-inflicted.
  The same figures came back in **one** `git log --shortstat` piped to `awk`, in
  under two seconds. One git process, one awk. If a measurement needs N
  subprocesses where N is a row count, it is written wrong.
- **Never run an untargeted `grep -r` from `E:\atlas`.** That is the data
  pipeline: `page-data/` alone is over a thousand files, `macro/` several hundred
  more. One such search burned ten minutes of a thirty-minute tick and then timed
  out, on 2026-08-18. Use the Grep tool, which is ripgrep, or scope the path to
  the website repo.

## 4. Measure before you change. The four rules that predate this loop.

1. **Read the module that produces a number before acting on the number.** Six
   measurement artifacts have died to skipping this.
2. **State the instrument's blind spot before quoting it.** Write the sentence
   "this measurement cannot distinguish X from Y". If you cannot write it, the
   measurement is not ready to act on.
3. **One change, one verification, before the next change.** Two fixes landing
   together and coming out wrong leaves neither falsifiable.
4. **A ratified rule becomes a gate in the same tick**, or it is written down as
   not machine-checkable with the reason.

## 5. Rendering is how this project finds defects. Declared is not seen.

The screenshot harness (charter section 9.1) found the unpainted site footer, a
blank `/industries` on a phone, and a chart drawing the opposite of its caption.
Any tick that changes something visible renders it and reads it back.

The recipe, no dev server:

1. Write your file **first**.
2. `npx tailwindcss -i src/app/globals.css -o <scratch>/site.css --minify`.
   **After** writing, never before: Tailwind emits only classes it can see, and a
   class written after the compile emits no rule and renders unstyled. This has
   cost twice.
3. Render the route by awaiting its default export. Routes with Suspense need
   `renderToPipeableStream` with `onAllReady`.
4. Three shims, all documented traps: `next/font/google` is a build-time
   transform and is not a function at runtime; stub the three router hooks only
   and leave `notFound` and `redirect` real, or a 404 route reports as rendering;
   stub `.css` and image imports.
5. `file:` is blocked in the browser tools. Serve the scratch dir **and**
   `public/` from one static server so `/spine/_skyline.jpeg` resolves.
6. Screenshot as jpeg at **1280 and 375**, and Read them. **Reload after every
   resize**, or the height you measure is fiction (12,282px measured against
   32,114px on a fresh load of the identical file).

Blind spots to state when quoting it: SSR only, so anything that appears on
hydration is absent; the data bands self-omit from this machine because cell
lookups exceed a 4s budget to eu-west-1, and that absence is never a finding;
and it proves what the browser paints, never that the founder likes it.

## 6. The paint rule. Read before touching any background.

`AtlasFrame` paints two `position: fixed` layers at `z-index: 0`, the first an
opaque white base. **Anything `position: static` is not drawn at all.** Not
dimmed. Absent. `<main>` is `relative` in `SiteChrome`, which covers page
content, but any new fixed, floating or portalled surface must be positioned or
it sinks behind the photograph.

Two more measured facts that stop this being re-argued:

- **Ink on the backdrop is fine at any size.** The backdrop's darkest point is
  luminance 0.4179, so `ink-900` reads 7.78:1 and clears AAA. Do not card the
  homepage section headings.
- **Terracotta on the backdrop is fine only above roughly 24px.** Below that it
  needs `atlas-800` or a card.

## 7. Commits

One commit per landed change, incremental, never batched. Every agent that
batched has lost work; every agent that checkpointed has kept it.

The message carries the full reasoning, because the founder reads commit
messages and reads them more carefully than chat:

```
<area>: <what was wrong, in his words if he said it>

<what was measured, with the numbers>
<what changed>
<what was verified, and the blind spot of that verification>
```

Never `--no-verify`. Never `--no-gpg-sign`. `.mcp.json` is intentionally dirty
and is never committed.

## 8. Reporting to him

Under ten lines. Lead with what was wrong and what was measured. Numbers over
adjectives. Corrections stated plainly once and moved past. Then update
`WAKE-UP.md`, which is the file he actually reads first.

## 9. Subagents

Governed by `07-SUBAGENT-DOCTRINE.md`. The short version, binding on every tick:
at most three concurrent, exclusive file ownership per agent, taste is never
delegated, and every agent's returned number is a claim to be verified before it
reaches a commit message.

## 10. Scope. Four lanes, and research is no longer one of them.

**Superseded 2026-08-20 by the founder**, who narrowed the loop to four lanes and
struck the research budget by name:

> *"we should focus only on design, site functionality, hierarchy, usability"*
> *"do not lose time on thinking where to find statistics and so on"*

**In scope:** design, site functionality, hierarchy, usability.

**Out of scope, and not to be worked around:** where to find statistics, data
coverage, new sources, ingest, research into what numbers exist, SEO keyword work,
marketing. **The Semrush budget in the previous version of this section is
withdrawn**, not paused: a tick that spends credits on search demand is spending
them outside the founder's stated scope. If a queue item cannot proceed without
new data, it is not a design item; mark it `[?]` and take the next one.

Web research remains permitted **when it serves one of the four lanes** — a CSS
mechanism, a WCAG technique, how a comparable product solves a layout — and any
source that will be cited is still captured to `docs/loop/artifacts/research/`
with its URL and the date it was read.

**Never put a source-agency name into user-facing copy.** Internal documents may
name sources freely; components may not. Gate: `verify_no_source_agencies`.

## 11. The 2026-08-19 rulings, and where the work now comes from

Newer than the charter, so they win where they touch it. Both quoted.

> *"we only go vertically, so never create 2 similar sister pages, we are
> clearing design and sections now"*

> *"The design, the visual hierarchy, the functionality of the elements is the
> main priority. Like, the site is not being visited by anyone, so you have to
> give this in mind."*

**What they bind a tick to:**

- **No new surfaces.** Deepen what exists. Where two surfaces overlap, converge
  on the better one. Redirect, never delete: `/browse` to `/world` is the
  first-party precedent, already in this repo.
- **Say DUPLICATE SURFACE, never "sister page."** This repo already uses "sister
  page" to mean two instances of the SAME template that are required to match.
  Reusing the phrase would invert existing comments and gates.
- **Cut words, not sections.** Section membership and order are gated contracts
  and the charter forbids dropping an agreed section. "Not bloated with text"
  means fewer words inside a section, and prose replaced by elements.
- **No traffic means no regression risk.** The risk is a mediocre-looking
  product, not a broken one. Be bold.

**The work now comes from a queue.** Build slots take the top unblocked item in
`docs/superpowers/plans/2026-08-19-masterplan/06-BACKLOG.md` and update it at the
end of the tick. The standard to build to is `01-DESIGN-STANDARD.md` in the same
directory; the step-by-step and the 13-check review gate are `03-PROCEDURE.md`.

**Two traps that already cost this plan once:**

1. **Render and count; never census from a registry.** `PAGE_SECTION_ORDER`
   lists 7 cell sections. The cell page renders 34. An earlier pass concluded
   from the registry that page depth was inverted against the ratified page
   ranking. It is not.
2. **A green gate is evidence the gate ran, not that the site is correct.** Ten
   design gates currently scan `dev/` bodies no reader can reach; the
   route-chrome gate passes two routes because their files mention the word in a
   comment. Repairing instruments is P0 for exactly this reason.

---

## 12. Circuit breakers. New, because this loop ticks sixty times faster.

The 30-minute loop ran 12 ticks in six hours and a human saw the output between
runs. A continuous loop can run 300 ticks in the same window with nobody looking.
**Everything below exists to stop it doing 300 ticks of the wrong thing**, and
the first three are checked mechanically by `node scripts/loop_status.mjs`, which
exits 2 on any of them.

1. **Dirty tree.** A tick that finds unexpected uncommitted files checkpoint
   commits them before taking new work, whatever the queue says. The known-dirty
   set is `.mcp.json`, `scratchpad/`, `.agents/` and `skills-lock.json`; anything
   else means a tick crashed mid-write.
2. **Red chain.** The tick becomes a repair tick. **Never build on a red chain.**
   If one repair attempt does not clear it, stop taking new work entirely, write
   the state into `STATE.md`, and keep repairing until it is green. A loop that
   keeps building on a red chain manufactures commits nobody can bisect.
3. **More than one item in flight.** Converge before opening a third. A half-done
   change is worth less than nothing, and two of them are worth less than that.
4. **Grinding.** Either of these means stop and change lane:
   - the same section touched twice within ten ticks with no new measurement
     between them;
   - three consecutive ticks that move no criterion in
     `11-PRODUCTION-READINESS.md`.

   Write what was learned into `05-ERROR-LEDGER.md` first. **This is the specific
   failure that got a previous run of this project called "mediocre":** an
   adversarial pass always finds one more nit, so a loop optimising against it
   never terminates. Converge, do not grind.
5. **Twenty ticks with no founder message.** Keep going, but make the next
   `WAKE-UP.md` entry a summary of the whole run rather than of the last tick. He
   reads one screen, and twenty tick-entries is not one screen.

**Two breakers that are deliberately NOT here.** A commit-count ceiling, because
nothing is ever pushed and 52 unpushed commits have cost nothing; and a
wall-clock limit, because a tick is budgeted to a unit of work and a long tick is
usually a thorough one, not a stuck one. If a tick is genuinely stuck, breaker 1
catches it on the next fire.
