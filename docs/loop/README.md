# The continuous loop

A loop that runs unattended and does not stop between ticks. One queue item per
tick, one finished change per tick, four lanes and nothing else: **design, site
functionality, hierarchy, usability.**

This directory is the whole procedure: the rules a tick may never break, the
destination it drives toward, the lanes it rotates through, and the two files it
keeps current so the founder can read a whole run in one screen.

**Nobody is watching. The loop never asks a question and never blocks.** Questions
go to `DECISIONS-NEEDED.md` with three options and a one-word-answerable
recommendation, and the tick takes the smallest reversible step consistent with
that recommendation.

---

## Cadence, and the honest version of "every 30 seconds"

The founder asked for a 30-second repeat. **No scheduler here can express it.**
Cron is five-field and minute-granular; the dynamic scheduler clamps to 60
seconds. The floor is one minute.

**That floor costs almost nothing, because jobs fire only while the session is
idle.** A tick that takes eleven minutes is not interrupted at minute one, and no
second tick starts on top of it. So:

```
* * * * *   ==   "start the next tick within a minute of the last one finishing"
```

That is continuous operation with no overlap and no stampede, which is what a
30-second request actually wants. **A tick is therefore budgeted to one unit of
work, never to a minute.** Anything else produces half-changes, and a half-done
change is worth less than nothing.

Two properties of the scheduler the founder should know:

- **Jobs are session-only.** They live in memory and are gone when the session
  ends. The loop does not survive a restart; it has to be re-armed.
- **Recurring jobs auto-expire after 7 days.**

---

## Precedence of authority. When two documents disagree, this settles it.

1. The founder, live, in chat.
2. `docs/superpowers/plans/2026-08-17-founder-brief-and-loop-charter.md`. His own
   quoted words. Overrides any agent's judgement.
3. `docs/loop/00-OPERATING-RULES.md`. This loop's invariants.
4. `docs/loop/11-PRODUCTION-READINESS.md`. The destination and its numbers.
5. `docs/superpowers/plans/2026-08-19-masterplan/`. What to work on and to what
   standard. `06-BACKLOG.md` is the queue, `01-DESIGN-STANDARD.md` is the bar,
   `03-PROCEDURE.md` is the step-by-step and the review gate.
6. The step file for the current lane.
7. `CLAUDE.md`, `docs/verification-protocol.md`.
8. Everything else in `docs/`, newest first.

A newer founder ruling beats an older document, always. When a tick finds an older
document contradicting a newer ruling, it writes a one-line correction into the
older document **in the same commit**. An uncorrected contradiction is how a
settled question comes back a third time.

---

## The work is queue-driven, not rotation-driven

The 30-minute loop rotated twelve slots because a slow tick needed variety. A
continuous loop does not: it takes **the top unblocked item in
`06-BACKLOG.md`**, every tick, and the ordering of that queue is the plan.

**Lanes, in priority order.** They are the queue's own P-bands, mapped to the
founder's four words:

| Lane | Queue band | Why it sits here |
|---|---|---|
| **0. Instruments** | P0 | Every other measurement is taken by these. The audit found design gates enforcing the rulebook against `/dev` routes no reader can reach, so improving a page while they do that buys nothing |
| **1. Design** | P1, P4 | The homepage first, then cohesion across page types |
| **2. Hierarchy** | P1, P2 | One dominant figure per type; converge duplicate surfaces |
| **3. Functionality** | P3, P5 | Forms, links, keyboard, states. **The 30-minute loop had no functionality lane, which is how two forms came to report success while discarding every submission** |
| **4. Usability** | P5 | Responsive, accessibility, target sizes |

**Periodic, not a lane.** Roughly every twentieth tick, and only when the queue's
top item is blocked:

- `01-CLEANUP.md` — hygiene. Later runs should find little, which is the point.
- `04-FAILURE-REFLECTION.md` then `05-GUARDRAILS.md` — turn the run's worst
  mistake into something that runs. A ratified rule becomes a gate in the same
  tick, or it is written down as not machine-checkable with the reason.

**Out of scope, 2026-08-20, and the step files are retired accordingly:**
`02-ORGANISATION-RESEARCH.md`, `03-LONGEVITY.md` and `08-CLAIMS-AND-INDICES.md`
are kept for their reasoning and are **not scheduled**. `06-REFORMATION.md`
depends on `02` and is dormant with it. `07-SUBAGENT-DOCTRINE.md` is reference,
never a slot. The founder's scope line is *"we should focus only on design, site
functionality, hierarchy, usability"*, and research into where numbers come from
is explicitly excluded.

### Four overrides, checked in this order before the queue is honoured

1. **A dirty tree from a crashed tick** is checkpoint-committed first.
2. **A red gate** turns the tick into a repair tick. Never build on a red chain.
3. **An in-flight item** is finished before a new one is started.
4. **A founder message** in the transcript beats the queue entirely.

`node scripts/loop_status.mjs` checks the first three and exits 2 on any of them.

---

## What a tick looks like

His five verbs, in order. The detail is in `PROMPT.md` and `03-PROCEDURE.md`.

```
ORIENT       one command: node scripts/loop_status.mjs
STUDY        render the target and look at the paint, not the source
UNDERSTAND   one sentence with a number in it, plus the blind-spot line
BRAINSTORM   three options against 01-DESIGN-STANDARD, then pick and say why
IMPROVE      spec it, including RISK: what breaks that is not in the diff
EXECUTE      build, run R1-R19, tsc, prebuild, land it
```

**Orientation is tiered and that is deliberate.** At one tick per minute, reading
the full canon every tick is the whole tick. The canon is read once per session;
the charter is re-read in full whenever the work touches the background, the
palette, the homepage or a page type.

If the work is not finished, checkpoint-commit whatever compiles and hand the rest
to `STATE.md` as in-flight. **The tree is never left dirty at the end of a tick.**

---

## The destination

`11-PRODUCTION-READINESS.md` holds **thirty criteria, each a number that can only
move one way.** Every tick names the criterion it moved, or says plainly that it
moved none. `loop_status.mjs` prints the score.

**A tick that turns an UNMEASURED criterion into a measured OPEN has succeeded.**
The site did not get worse; the loop got honest. Early in a run that is the most
valuable kind of tick there is.

---

## The files

| File | Role |
|---|---|
| `PROMPT.md` | The paste-in. This is what the loop is given every tick |
| `00-OPERATING-RULES.md` | The invariants and the circuit breakers |
| `11-PRODUCTION-READINESS.md` | The destination. Thirty criteria with numbers |
| `STATE.md` | The tick ledger. The loop's memory, written every tick |
| `WAKE-UP.md` | One screen for the founder. Newest first. Always current |
| `DECISIONS-NEEDED.md` | Questions the loop refused to answer for him |
| `01`, `04`, `05`, `09`, `10` | The live step files |
| `02`, `03`, `06`, `07`, `08` | Retired or reference. Kept for reasoning, not scheduled |
| `artifacts/` | Censuses, screenshots, evidence. Not prose |
| `scripts/loop_status.mjs` | The whole orientation, one process, under a second |

---

## Stopping it

Say "stop the loop". The tick in flight finishes its commit and its report, and
nothing further is scheduled. **Nothing is ever pushed, so stopping costs
nothing** and so does letting it run: 52 commits sit unpushed on `main` today and
production is untouched.

The loop also stops itself. `00-OPERATING-RULES.md` §12 lists the five circuit
breakers, of which the two that matter most are: **a red chain that one repair
attempt does not clear stops new work**, and **three consecutive ticks that move
no readiness criterion is grinding**, which is the failure mode that got a
previous run of this project called mediocre.
