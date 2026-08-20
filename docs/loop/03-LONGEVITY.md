# 03. Longevity. Why this slowed down, and what survives the next six months.

> **RETIRED 2026-08-20, NOT DELETED.** The founder narrowed the loop to four
> lanes: *"we should focus only on design, site functionality, hierarchy,
> usability"*. It asks why the project slowed down. Valuable, and not design, functionality, hierarchy or usability.
> **This file is no longer scheduled.** It is kept for its reasoning and its
> measured numbers, which stay true. Nothing here may be revived without a
> founder ruling that widens the scope. See `docs/loop/README.md`.

**Founder:** "brainstorming on the best practices of how this whole procedure can
be applied in the long term because we have slowed up considerably".

The complaint is the most important sentence in the brief, because everything
else in this loop is downstream of it. A procedure that produces one good tick
and cannot sustain sixteen is not a procedure.

---

## First, measure the slowdown. Do not theorise about it.

Nothing here may be asserted from feel. Compute, from git and from the documents:

| Metric | How |
|---|---|
| Commits per active day, by month | `git log --since` grouped |
| Median lines changed per commit, by month | rising numbers mean batching, which loses work |
| Time from session start to first source edit | read the handoffs, which record it implicitly |
| Documents that must be read before a first edit | the reading order in the current handoff, counted |
| Ratio of meta commits to product commits | docs, plans and gates against `src/` |
| Reversals | commits that undo an earlier commit, by month |

Write the table to `docs/loop/artifacts/velocity-<date>.md`. Six months of git
history is available and it is the only honest witness here.

**Blind spot, state it every time:** commit counts measure activity, not value. A
tick that deletes a wrong number is worth more than five that add sections. Pair
every velocity number with what it bought.

---

## The four hypotheses to test, and how to kill each one

1. **Re-derivation tax.** Every session re-reads 352 documents' worth of context
   before it can act. Test: count the reading order in the last four handoffs.
   Killed if the reading order is short and stable.
2. **Meta creep.** The work has drifted from the product into gates, plans and
   documents about plans. Test: the meta-to-product commit ratio by month. Killed
   if it is flat.
3. **Committee dilution.** Design by panel produces the average of several
   opinions, which is exactly the "mediocre" the founder rejected. Test: compare
   the accept rate of single-author design work against panel-reviewed work in
   the handoff record. This one has already been ruled on once and the ruling is
   in `07-SUBAGENT-DOCTRINE.md`.
4. **Verification cost.** The cadence is `tsc` plus 101 gates, roughly 150
   seconds, on every tick, and rising with every gate added. Test: gate count and
   wall-clock by month. If this is the answer, the fix is scoped verification for
   small changes plus the full chain before a commit, not fewer gates.

Use `superpowers:brainstorming` for the generative half. Use the measurements to
kill hypotheses, not to decorate them.

---

## What this step must output, every time it runs

**One page**, appended to `docs/loop/artifacts/longevity-log.md`, containing:

1. The measured table.
2. Which hypothesis the numbers support and which they killed.
3. **One change to the procedure**, written directly into the step file it
   affects, in this same tick. A recommendation that lives only in this log is
   the exact failure this step is trying to name.

A brainstorm that ends without editing a step file did not happen.

---

## The long-term shape, tested against these questions

- Does this procedure still work if the founder is away for two weeks?
- Does it still work when the gate chain reaches 150?
- Does a new session, with none of tonight's context, reach a first correct edit
  in under ten minutes?
- Can any tick be resumed by a different agent from `STATE.md` alone?

If the answer to any of these is no, that is the change to make, and it outranks
whatever else this step was going to propose.

## Forbidden

- Proposing a new document as the fix for too many documents, unless it replaces
  at least two by name.
- Any change to the loop's rules that weakens the verification cadence, the "never
  push" rule, or the honesty rules. Speed is never bought with those.

## Done test

**"I measured the slowdown, I named which hypothesis the numbers support, and I
edited exactly one step file as a result."**
