# 07. Subagents, and why the design work keeps failing.

**Founder:** "reflection on subagents and the fact that the design work is always
failing and very slow to progress".

He is right, and the record says why. This file is the ruling, not a discussion.

---

## The diagnosis. Five causes, each with its own fix.

**1. Design by committee produces the average of several opinions.** A panel was
built, run twice, and the verdict was "mediocre". An adversarial panel also
asymptotes: it will always find one more nit, so grinding on it never converges
and never ships.
**Fix: taste is never delegated and never averaged. One mind holds the surface
for the whole tick.** The panel may be used once, to catch mechanical breaches,
never to decide whether something looks good.

**2. Invented visuals.** A week of AI-invented design was rejected outright. The
standing rule from that rejection is that the design comes from a reference the
founder has already accepted, and the machine ports it faithfully.
**Fix: every design change cites its source** in the commit message: an existing
ratified component, the engraved kit, `docs/brand/design-system.md`, or one of
his own files. "I thought this looked better" is not a source.

**3. Verified as declared, not as seen.** For months every visual claim was a
class name, not a pixel. The screenshot harness found the entire footer unpainted
on its first run.
**Fix: no design tick claims anything without a rendered before and after at 1280
and 375.** If it was not rendered, it did not happen.

**4. Work batched, then lost.** Every agent that batched has lost some; every
agent that checkpoint-committed has kept all of it.
**Fix: checkpoint-commit is a condition of the brief, not a virtue.**

**5. Parallel agents in one working tree.** One stash swept two other agents'
work. Two agents in one file produce a merge neither intended.
**Fix: exclusive file ownership, declared in the brief, and no tree-wide git
command, ever.**

---

## What subagents ARE for

- **Evidence gathering.** Census a directory, count occurrences, read six files
  and return one table. Cheap, parallel, no judgement.
- **Mechanical edits with exclusive ownership.** The same change across many
  files, where the change is fully specified before dispatch.
- **Adversarial verification of a factual claim.** "Try to refute this: X".
  Factual, never aesthetic.
- **Rendering and measuring.** Screenshot a route, read computed styles, report
  numbers.

## What subagents are NOT for

- Deciding whether something looks good.
- Choosing a colour, a size, a spacing, or a layout.
- Writing user-facing copy that carries the founder's voice.
- Anything where the brief cannot state, in advance, what a correct return looks
  like.

---

## The brief template. Every dispatch uses it. No exceptions.

```
GOAL        one sentence, and what "done" means as a checkable statement
OWNS        the exact files you may write. Nothing else. If you need another
            file, stop and report instead of taking it.
READ FIRST  docs/loop/00-OPERATING-RULES.md, plus the specific files that matter
RETURN      the exact shape: a table, a number, a diff summary. Not an essay.
FORBIDDEN   push, deploy, git stash / checkout . / reset --hard, raising any
            baseline, inventing a figure, touching the H1, any file you do not own
VERIFY      cd /e/atlas/website && npx tsc --noEmit, then the gate that covers
            your files. Report the Windows esbuild flake as a flake, not a red.
COMMIT      checkpoint-commit before you finish, always, even if partial
BLIND SPOT  state what your measurement cannot distinguish
```

## Hard limits

- **At most three concurrent**, because prebuild concurrency is capped at 4 on
  Windows and two agents typechecking in parallel have already caused an OOM.
- **Never two agents in one file.** Ownership is exclusive and declared.
- **Never an agent that runs the full chain while another is mid-write.** A red
  gate during parallel work may belong to somebody else; check whose file is
  failing before reporting it. This has happened twice.
- **An agent's report is a claim, not a fact.** Verify any number before it
  reaches a commit message, `WAKE-UP.md`, or the founder. Agents have reported
  results that were wrong in both directions.

## How this step spends its own slot

Once per cycle it audits the last cycle's dispatches and answers three questions
in `docs/loop/artifacts/subagent-log.md`:

1. How many agents ran, how many returned something used, how many were wasted?
2. Did any design decision get made by more than one mind? If yes, name it, and
   name what it cost.
3. What could have been done by the main thread faster than dispatching at all?

Then it edits this file, or the design step files, with what it learned. **The
default answer is fewer agents and more rendering**, and the burden of proof is
on dispatching, not on doing it directly.

## Done test

**"Every agent I ran had exclusive file ownership and a checkable return, no
aesthetic decision was delegated, and every design claim I am making was
rendered."**
