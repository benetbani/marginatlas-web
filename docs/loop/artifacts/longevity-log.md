# Longevity log. Did we slow down, and is it still true?

---

## 2026-08-19, tick 12. Measured from git, one pass per figure.

**Founder, 2026-08-18:** "we have slowed up considerably". Tested rather than
accepted.

### Throughput

| month | commits | active days | commits/active day |
|---|---|---|---|
| 2026-05 | 528 | 18 | **29.3** |
| 2026-06 | 351 | 18 | 19.5 |
| 2026-07 | 110 | 14 | **7.9** |
| 2026-08 | 429 | 15 | **28.6** |

**The slowdown was real and it was July.** 7.9 commits per active day against
May's 29.3, a 73 percent fall. **August is back to 28.6**, within four percent of
the May peak.

### Commit size

| month | commits with stats | mean insertions | commits over 500 |
|---|---|---|---|
| 2026-05 | 299 of 528 (git segfaulted mid-walk; **partial, not quotable**) | 1,814 | 88 |
| 2026-06 | 350 of 351 | 701 | 58 |
| 2026-07 | 110 of 110 | 569 | 17 |
| 2026-08 | 429 of 429 | **279** | 25 |

Commits have got steadily smaller: **701 to 279 mean insertions** across the
complete months. That is the checkpoint discipline showing up in the data, and it
is the opposite of the batching failure the handoff records.

### The four hypotheses

| # | Hypothesis | Verdict |
|---|---|---|
| 1 | **Re-derivation tax** | **Supported.** Ticks 1, 2, 5, 6 and 11 each opened by correcting a typed claim before any work could start. Move M1 (tick 10) attacks it directly. |
| 2 | **Meta creep** | **KILLED.** Meta file touches as a share of all touches: June **19%**, July **15%**, August **14%**. Falling, not rising. |
| 3 | **Committee dilution** | **Untestable this cycle**, and for a reason worth noting: zero subagents have run in twelve ticks. See the subagent audit below. |
| 4 | **Verification cost** | **Supported, and it is now the largest tax.** The chain is 104 gates at 95 to 160 seconds. Tonight ticks 8, 9 and 11 each ran it two or three times, not because of defects but because of environment faults. |

### What the numbers cannot distinguish

Commit counts measure activity, not value. Tick 6's best work was **deleting its
own top priority** and it produced one commit; tick 11 produced one commit for a
one-class change backed by eleven measurements. Neither is visible here. Pair
every figure above with what it bought.

Also: August's figures include this loop, which is a different working pattern
from a human session. A rate driven by an automaton is not evidence a person got
faster.

---

## Subagent audit, tick 12 (the `07` half of this slot)

**Agents dispatched in twelve ticks: zero.**

That is not a failure of the doctrine, it is the doctrine working: `07` says the
default is fewer agents and more rendering, and the burden of proof is on
dispatching. Reviewed tick by tick, the honest counterfactual is that **two ticks
could have used one agent each**:

- **Tick 9** measured the industry precision defect on `restaurants` only,
  because the machine died before a second slug ran. One agent per slug, with
  exclusive read-only scope, would have covered four.
- **Tick 5's** twenty-page research sweep is the classic parallel-evidence case.

Neither is a taste task, which is the line the doctrine actually draws. Nothing
that touched design was delegated, and nothing should have been.

**The finding for the doctrine:** the rule is holding, and the reason to keep
watching is that a night with zero dispatches and three machine-wide fork
failures suggests the constraint here is not judgement but **process budget**.
Every agent is a process tree on a machine that ran out of them three times
tonight.
