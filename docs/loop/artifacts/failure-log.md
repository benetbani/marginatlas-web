# Failure log. Classes, counts, and what would have caught each one.

Newest first. Corrections are appended; the original stays legible.

---

## 2026-08-19, tick 7. Six ticks of corpus, and one class accounts for all six.

**Corpus:** ticks 1 to 6 of this loop, the commits they produced, and the
existing gate headers.

### The classes, extended from the table in `04-FAILURE-REFLECTION.md`

| Class | Instances in ticks 1-6 | Worst instance |
|---|---|---|
| **A typed statement about the codebase that was never checked against it** | **6 of 6 ticks** | the gate count stated at ~78 locations in 32 files at TEN different values |
| A number acted on before its module was read | 1 (tick 3) | `restsOnModeled` grepped past, caught by `tsc` |
| A comment asserting a mechanism that is false | 1 (tick 4) | `LogoWordmark`: "falls through to Georgia when the variable is unset". Invalid is not unset, and invalid discards the whole declaration |
| A prescription written from general research without local measurement | 1 (tick 6) | P1-0 would have added ~320px of height and failed `verify_spacing_scale` |
| One quantity written in two places | **3** (tick 4 font token, tick 5 gate count, tick 7 gate chain) | `prebuild:serial` holding 43 of 102 gates |

### The top class, by both rankings

**By frequency:** class A, six ticks out of six. Every tick so far has found at
least one written statement that measurement contradicted, and in five of the six
the wrong statement was in a document this loop itself wrote or relies on.

**By survival time**, which matters more because it measures what the instruments
cannot see:

| Instance | Survived | Found by |
|---|---|---|
| `--font-display` self-reference | since `7c592e61`, the engraved foundation | reading, then a browser fixture |
| `CLAUDE.md` gate count | since the chain was ~53 gates | a census |
| `prebuild:serial` drift | unknown, at least 59 gates' worth of additions | this tick |
| `LogoWordmark` false fallback claim | since it was written | the same browser fixture |

Nothing in the chain could see any of them. All four are statements ABOUT the
system rather than behaviour OF the system, and the 103 gates read behaviour.

### The three questions, answered for the top class

**What instrument would have caught this on day one?** For the numeric half, a
gate comparing a stated number against the thing it states. For the prose half,
nothing: "same gates, single-process" is a sentence, and no gate reads English.

**Does that instrument exist here, unregistered or unrun?** No. The nearest is
`verify_stated_totals.mjs`, which compares a stated total against the array it
counts, and its header says it was kept deliberately narrow because the obvious
version cried wolf fifteen times in sixteen. That narrowness is why it never
looked at gate counts or npm scripts.

**If it cannot be an instrument, what one-line rule replaces it, and where must
it live to be read at the right moment?** For prose claims about tooling:
**a document may not assert that two things are the same; it may only name the
one thing.** `CLAUDE.md` should say "prebuild:serial runs the same list at
concurrency 1", which is checkable by reading one line of `package.json`, rather
than "same gates", which is a claim about 102 files. That line belongs in
`05-GUARDRAILS.md`, and it is now there.

### What this tick did about it

Deleted the duplicate rather than policing it: `prebuild:serial` now invokes
`prebuild_all.ts --concurrency=1`, so both chains read one array. Added gate 103,
`verify_single_gate_chain`, so a second list cannot grow back. Negative-tested by
re-inducing a three-gate chain.

### Inefficiencies, which count as errors here

Two ticks spent their opening minutes re-deriving counts that were written down
wrongly. Tick 6 spent its whole work budget disproving an instruction rather than
building. Neither is waste in hindsight, because both produced a correction, but
both are the same tax: **something true was not reachable at the moment it was
needed.**

### The loop's own errors, stated

- Tick 1: my step file's "100 stray screenshots" was wrong by a factor of ten.
- Tick 2: my step file's "three bands self-omit" was wrong; all eleven emit.
- Tick 3: I quoted a fallback figure as live behaviour before reading the field
  that made it defensive.
- Tick 5: this loop's own step file stated the gate count as 101 when it was 102,
  one tick after the loop itself added the gate.

Four self-inflicted instances of the top class in six ticks. The pattern is not
that documents rot slowly. It is that **a number is wrong the moment it is typed,
because typing it is the act that decouples it from its source.**

## 2026-08-25, the emptiness rule only looks one way

The founder's rejection listed "some sections have huge white space" beside
"some sections are totally wide for no reason". Both were answered, and only one
of them was actually answered.

E2 measures a section's INK AGAINST ITS HEIGHT. So a card whose content sits in
its left half and whose right quarter is dead passes, because vertically it is
full. Looked at as a picture, the city page's "What you can open, and where to
take it" is exactly that: a nested white panel, a line of text and a button, and
then a strip of nothing running down the right of the card. The gate reports the
city page clean on every one of its twelve counters, and the picture disagrees.

This is the same shape as the six measurement corrections already recorded above,
with the direction reversed: those were gates reporting faults that were not
there, and this is a gate reporting cleanliness that is not there. The second
kind is worse, because nothing prompts anyone to look.

NOT FIXED IN THIS TICK, deliberately. Two ways to close it and they are not the
same decision: measure horizontal emptiness inside a card, or redesign that one
section. The first is a rule change and belongs in the art direction before any
code; the second is a section rebuild and belongs in an inventory row. Choosing
between them while a gate chain was running is how sections get invented.
