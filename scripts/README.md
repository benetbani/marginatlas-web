# scripts/ , what runs, what is a tool, and what nothing has called since June

Written 2026-08-19 by the cleanup slot, from `scripts/spikes/script_census.tsx`,
which reads every tracked text file once and answers from one index. Regenerate
rather than hand-edit the counts:

```bash
npx tsx scripts/spikes/script_census.tsx
```

**The census, 2026-08-19: 259 tracked text files under `scripts/`.**

| bucket | n | what it means |
|---|---|---|
| **gate** | 84 | registered in the `GATES` array of `prebuild_all.ts` |
| **npm** | 13 | named by a script in `package.json` |
| **referenced** | 92 | named by some other tracked file, so a reader can find it |
| **orphan** | **70** | named by nothing tracked at all |

The chain has more entries than 84 because 20 of its registrations are test files
under `tests/`, which this census does not count as scripts.

---

## The five that matter most, and they are a decision rather than a cleanup

**Five files are named `verify_*` and no chain runs them:**

```
scripts/verify_aov_city_tier.ts
scripts/verify_enrichment.ts
scripts/verify_formation_expansion.ts
scripts/verify_manual_aliases.ts
scripts/verify_manual_aliases_db.ts
```

They sit beside 84 files with the same prefix that do run. A reader scanning this
directory cannot tell them apart, which is worse than an unnamed one-off: the
name asserts enforcement that does not exist. This repo already has the rule, in
`CLAUDE.md`: **a test file that nothing runs is not coverage, wire it or delete
it.** Raised as **Q9** in `docs/loop/DECISIONS-NEEDED.md` because wiring one may
turn the chain red and deleting one throws away work somebody did.

**One** of them touches Supabase, `verify_manual_aliases_db.ts`, and the chain
must never depend on a secret, so that one cannot simply be registered. The first
draft of this line said two, inferred from the names `_db` and `enrichment`; a
grep says one. Measured beats named, which is the whole point of this directory's
problem.

All five were last touched between **2026-05-22 and 2026-06-07**, so none has
been edited in over two months, and they run from 23 to 117 lines.

---

## The rest of the orphans, classified

- **23 one-shot SQL imports** under `scripts/import/deepening/`, one per trade or
  country. These are spent by design: an import runs once. They are history, not
  bloat, and they stay.
- **17 dry-runs and diagnostics** under `scripts/audit/` (`dryrun_*`, `diag_*`),
  written to answer one question during one investigation. Candidates for the
  attic once somebody confirms the question is closed.
- **The remainder** are seeds, one-time data migrations, and screenshot helpers
  (`shot_fleet.mjs`, `render_previews.mjs`, `crop_mockup.mjs`).

**Nothing has been deleted or moved on the strength of this file.** The census
says what nothing NAMES, which is a claim about attention, not about correctness,
and a script referenced only from a commit message reads here as an orphan.

---

## Where a new script belongs

| you are writing | put it | and |
|---|---|---|
| a rule the build must enforce | `scripts/verify_*.ts` | register it in `prebuild_all.ts` in the same commit, with a comment saying which defect it exists for, and negative-test it first |
| a measurement you will run again | `scripts/spikes/` or the relevant subdirectory | name it in the step file or document that calls for it, so it is not an orphan the day it lands |
| a one-shot that answers one question | `scripts/spikes/` | expect it to be attic'd once the question closes |
| a data import | `scripts/import/` | it is spent after it runs, and it stays as history |

The one thing that is never acceptable is the fifth bucket this directory used to
have: a file named `verify_*` that nothing runs.
