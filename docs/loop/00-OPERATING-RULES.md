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

Do not pre-empt the two questions already open in charter section 13. They are
his.

## 3. Verification cadence. Every tick, no exceptions.

```bash
cd /e/atlas/website && npx tsc --noEmit
cd /e/atlas/website && npm run prebuild
```

- `tsc` must be clean. `prebuild` must be **101/101**. The chain is the
  authority on the gate count, not any document that quotes it. A count reading
  low is how a missing gate hides.
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

## 10. Research budget

- **Semrush**: aggressive on new questions, never repetitive. Every response is
  cached to `docs/loop/artifacts/semrush/`. Check the cache before every call. A
  repeated query is a wasted credit, and breadth is what the founder is paying
  for.
- **Web research**: any source that will be cited gets captured to
  `docs/loop/artifacts/research/` with its URL and the date it was read.
- **Never put a source-agency name into user-facing copy.** Internal documents
  may name sources freely; components may not. Gate: `verify_no_source_agencies`.
