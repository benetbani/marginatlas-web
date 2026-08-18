# The 30-minute loop

An unattended loop that runs while the founder sleeps. One tick every 30 minutes,
one step per tick, one excellent change per tick. This directory is the whole
procedure: the rules a tick may never break, the ten steps it rotates through,
and the two files it keeps current so the founder can read the night in one
screen.

**The founder is asleep. The loop never asks a question and never blocks.**
Questions go to `DECISIONS-NEEDED.md` with options and a recommendation, and the
tick takes the smallest reversible step consistent with that recommendation.

---

## Precedence of authority. When two documents disagree, this settles it.

1. The founder, live, in chat.
2. `docs/superpowers/plans/2026-08-17-founder-brief-and-loop-charter.md`. His own
   quoted words. Overrides any agent's judgement.
3. `docs/loop/00-OPERATING-RULES.md`. This loop's invariants.
4. The step file for the current slot.
5. `CLAUDE.md`, `docs/verification-protocol.md`.
6. Everything else in `docs/`, newest first.

A newer founder ruling beats an older document, always. When a tick finds an
older document contradicting a newer ruling, it writes a one-line correction into
the older document in the same commit. An uncorrected contradiction is how a
settled question comes back a third time.

---

## The rotation. 12 slots, six hours, then it repeats.

The tick number is the count of ticks since the loop started, kept in `STATE.md`.
Slot is `((tick - 1) mod 12) + 1`.

| Slot | Step | File |
|---|---|---|
| 1 | Cleanup and census refresh | `01-CLEANUP.md` |
| 2 | Homepage | `10-HOMEPAGE.md` |
| 3 | Claims and indices | `08-CLAIMS-AND-INDICES.md` |
| 4 | Site continuation | `09-SITE-CONTINUATION.md` |
| 5 | Organisation research | `02-ORGANISATION-RESEARCH.md` |
| 6 | Homepage | `10-HOMEPAGE.md` |
| 7 | Failure reflection, then one guardrail | `04-FAILURE-REFLECTION.md` then `05-GUARDRAILS.md` |
| 8 | Site continuation | `09-SITE-CONTINUATION.md` |
| 9 | Claims and indices | `08-CLAIMS-AND-INDICES.md` |
| 10 | Reformation, execute one approved move | `06-REFORMATION.md` |
| 11 | Homepage | `10-HOMEPAGE.md` |
| 12 | Longevity, then subagent doctrine | `03-LONGEVITY.md` then `07-SUBAGENT-DOCTRINE.md` |

Weighting is deliberate: three homepage slots, two site slots and two claims
slots per cycle, because that is what the founder sees when he wakes. The five
meta slots exist because the last two months slowed down and none of the
build slots can fix that on their own.

### Four overrides, checked in this order before the slot is honoured

1. **A dirty tree from a crashed tick** is checkpoint-committed first, whatever
   the slot says.
2. **A red gate** turns the tick into a repair tick. Never build on a red chain.
3. **An in-flight item in `STATE.md`** is finished before a new one is started.
   A half-done change is worth less than nothing.
4. **A founder message** in the transcript beats the rotation entirely.

---

## What a tick looks like

```
orient (2 min)   read STATE.md and the step file, run the health check
work   (18 min)  the step, one change, measured before and after
verify (6 min)   npx tsc --noEmit, npm run prebuild, render what changed
land   (4 min)   commit, update STATE.md and WAKE-UP.md, report 10 lines
```

If the work is not finished at the 18-minute mark, checkpoint-commit whatever
compiles and hand the remainder to `STATE.md` as in-flight. The tree is never
left dirty at the end of a tick.

---

## The files

| File | Role |
|---|---|
| `PROMPT.md` | The paste-in prompt. This is what `/loop 30m` is given. |
| `00-OPERATING-RULES.md` | The invariants. Read every tick. |
| `01`..`10` | The ten steps. Read the one for the current slot, in full. |
| `STATE.md` | The tick ledger. Written every tick. The loop's memory. |
| `WAKE-UP.md` | One screen for the founder. Newest first. Always current. |
| `DECISIONS-NEEDED.md` | Questions the loop refused to answer for him. |
| `artifacts/` | Censuses, screenshots, cached research. Evidence, not prose. |

---

## Stopping it

Say "stop the loop". The tick in flight finishes its commit and its report, and
nothing further is scheduled. Nothing is ever pushed, so stopping costs nothing.
