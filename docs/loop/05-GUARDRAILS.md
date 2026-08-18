# 05. Guardrails. Turn last tick's lesson into something that runs.

**Founder:** "pragmatic guidelines and guardrails that will be written in the
procedural steps of the whole directory".

Runs immediately after `04-FAILURE-REFLECTION.md`, in the same tick, on the class
that step named. The project rule this implements is already in `CLAUDE.md`: **a
ratified rule becomes a gate in the same session, or it is written down as not
machine-checkable with the reason.** Four founder rulings came back a second time
purely because they lived in a conversation.

---

## The ladder. Take the highest rung the defect allows.

1. **A gate** in `scripts/prebuild_all.ts`. Preferred, always. It runs whether or
   not anybody remembers it.
2. **A test** wired into the chain. Same protection, different shape.
3. **A ratchet** when the current state cannot be zero: it may shrink, never
   grow. Two buckets when a flat count would be misread, the way
   `take_home_bypass_baseline.json` splits `unreviewed` from `reviewed`.
4. **A line in the step file where the defect happens.** Not in a general
   document, in the specific step, at the point of use.
5. **Written down as unenforceable, with the reason.** A legitimate outcome, and
   far better than a rule nobody can check. Say what would make it checkable.

---

## Rules for writing a gate here, all learned the hard way

- **Negative-test it before registering it.** Induce the defect, watch the gate
  fail, remove the defect, watch it pass. A gate that has never failed is a gate
  that has never been shown to work.
- **Prove it can see its subject.** The palette gate never scanned `src/lib`, so
  it had never read the file that defines the palette. State which paths the gate
  walks and check that walk against an independent enumeration.
- **Use `scripts/lib/strip_comments`.** Every source-scanning gate depends on it.
  A gate that reads its own explanatory comment as evidence is worse than no gate.
- **Never assume class order** in a Tailwind class string. Test presence.
- **Never require the network or a secret.** The chain must run offline. A gate
  that can fail on a blip is a gate that gets switched off.
- **Fail in both directions where possible.** The strongest gate in this repo
  fails if the list rots and also if the list over-reaches.
- **Say what it cannot see**, in the header, in one sentence. Every gate here
  carries that line and it is the most useful line in the file.
- **Register it** in `prebuild_all.ts` with a comment saying what defect it exists
  for, and update the expected count. The chain is the authority on the count.

---

## Where a guardrail goes when it is not a gate

Into the step file that owns the moment. Guidelines drift to the top of general
documents where they are read once and forgotten. A guardrail is read at the
moment it bites, or it is not read.

Format, one line, testable, no adjectives:

```
- Render at 375 as well as 1280. Three separate defects have lived at exactly
  one breakpoint.
```

Not: "be careful about responsive design".

---

## Procedure

1. Take the class from `04`.
2. Choose the highest rung of the ladder it allows and say why the rung above was
   not possible.
3. Build it. Negative-test it. Register it, or write the line into the step file.
4. Update the gate count everywhere it is stated, and prefer to make it generated
   rather than typed. Stale counts are themselves a defect class.
5. Commit the guardrail on its own, with the defect it prevents named in the
   message.

## Forbidden

- Adding a gate that fails today. A gate lands green or as a ratchet at today's
  measured number, never as a red line for a future tick to trip over.
- Raising an existing baseline to accommodate a new rule.
- Writing a guardrail that restates an existing one. Check first; duplicated
  rules diverge.

## Done test

**"The defect class from 04 now has something that runs, it has been
negative-tested, and it is registered where it will be read at the moment it
matters."**
