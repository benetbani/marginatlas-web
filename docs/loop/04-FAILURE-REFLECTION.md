# 04. Failure reflection. What this system gets wrong, in classes, with counts.

**Founder:** "reflection on errors and inefficiencies of the system".

Paired with `05-GUARDRAILS.md` in slot 7: this step finds the class, that step
turns it into something that runs. Reflection that does not end in a rule is a
diary.

---

## The corpus to mine

- The last 100 commits on `main`, message and diff.
- `docs/handoff/HANDOFF-marginatlas-2026-08-18.md` sections 5, 6 and 11.
- The charter's section 9.3 and its "known local traps".
- Every gate header in `scripts/verify_*`, because each one is a defect that
  already happened once and was expensive enough to encode.
- `docs/loop/artifacts/` from previous ticks, including this loop's own mistakes.

---

## The known classes, already paid for. Extend this table, do not rewrite it.

| Class | Example | Currently caught by |
|---|---|---|
| A plausible number nobody checked | `$1` printed beside "3% net" of $150,000 | `verify_take_home_identity` |
| A plausible pixel nobody looked at | the entire site footer unpainted for weeks | only a screenshot |
| An instrument that cannot see its subject | the palette gate returns legal above 93% lightness, so it could never see cream | `verify_no_cream`, added separately |
| A banned thing under a permitted name | `parchment` WAS `cream-300`, identical hex, 419 call sites | value moved first, then call sites |
| A regex that assumes class order | `rounded ... border ... bg-white` reported zero hand-rolled cards while six rendered | presence tests, order-free |
| A measurement taken at one width | three defects each living at exactly one breakpoint | render at 1280 and 375 |
| A stale document read with trust | "95 gates" against a 101-gate chain | nothing yet |
| Work batched and lost | two agents' uncommitted work swept by a stash | checkpoint commits |
| A gate skipping real source | skip-by-name skipped three directories of live pages | skip by path from root |

---

## Procedure

1. **Classify, do not narrate.** Every defect found in the corpus goes into an
   existing class or opens a new one. A class needs a name, a count, and one
   concrete instance with a file path.
2. **Count.** Which class is most expensive tonight: by frequency, and separately
   by how long it survived undetected. Those two rankings are usually different
   and the second one matters more, because a defect that survives is a defect
   the instruments cannot see.
3. **For the top class, answer three questions in writing.**
   - What instrument would have caught this on day one?
   - Does that instrument exist in this repo, unregistered or unrun?
   - If it cannot be an instrument, what one-line rule replaces it and where does
     that line have to live to be read at the right moment?
4. **Inefficiencies count as errors here.** A tick spent re-deriving a fact that
   was already written down is a defect of the same family: something true was
   not reachable at the moment it was needed.
5. Append to `docs/loop/artifacts/failure-log.md`, newest first, then hand the top
   class straight to `05-GUARDRAILS.md` in the same tick.

---

## The honesty clause

This step includes the loop's own errors, and they are the most valuable entries
because they are the freshest. If a previous tick reported something that later
proved wrong, it is written here in one line with the correction, and it is not
dwelt on. A system that cannot record its own misses will keep making them.

## Forbidden

- Blaming a person or an agent. The unit of analysis is the class of defect and
  the instrument that missed it.
- Any entry without a file path or a number.
- Rewriting history in a previous artifact. Corrections are appended, and the
  original stays legible.

## Done test

**"Tonight's top defect class has a count, an instance with a file path, and a
named instrument that would have caught it, and it has been handed to 05."**
