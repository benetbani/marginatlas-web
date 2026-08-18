# Bloat census, 2026-08-18. Tick 1, slot 1.

The baseline every later cleanup and organisation tick measures against. Numbers
are counted, not estimated, and the method is stated so the next tick can repeat
it rather than re-derive it.

---

## 1. Images at the parent repo root, `E:\atlas\`

**The step file said "100 stray Playwright screenshots". That was wrong by a
factor of ten, and the correction is the useful part of this tick.**

| | count | bytes |
|---|---|---|
| Tracked in the parent repo | **91** | 16,527,005 |
| Untracked | **9** | 1,257,838 |
| Total before | 100 | 17,784,843 |
| Total after this tick | **91** | 16,527,005 |

- The 9 untracked were render-verification leftovers from earlier loop ticks
  (`before-check`, `before-contact`, `before-pricing`, and six `bi-*` before and
  after shots at 1280 and 375). **Deleted**, after confirming zero references:
  seven checked by grep before it timed out, the last two by ripgrep across all
  of `E:\atlas`, no files found.
- The 91 tracked were added on 2026-07-27 in parent commit `d843425`. They are
  agent verification screenshots too, by name (`_pass-cell-hero`, `_idx-cities`,
  `_final-hood-mobile`, `_map-hood`), not the founder's design source images.
  **Left untouched**: they are committed history in a repository this loop does
  not own, and deleting tracked files there is a decision about the parent
  project. Raised as Q6 in `DECISIONS-NEEDED.md`.

**Blind spot:** name and commit date cannot distinguish an agent's verification
screenshot from a design reference the founder saved with the same prefix. The 91
were classified by naming family, not by opening them. If Q6 is answered yes,
the tick that acts on it should sample a dozen visually first.

## 2. The website repo, `E:\atlas\website\`

| Thing | Count | Method |
|---|---|---|
| Tracked files | 2,764 | `git ls-files` |
| `docs/` | 352 | `git ls-files docs/` |
| of which `docs/superpowers/` plans and specs | **121** | |
| `scripts/` | 254 | `git ls-files scripts/` |
| of which registered gates | **101** | `prebuild_all.ts` GATES array |
| so unregistered scripts | **153** | the triage target |
| `src/app/dev/` routes | 37 | |
| `data/` | 1,055 | product data, out of scope |
| `src/app/page.tsx` | 791 lines, 11 declared bands | |
| `src/lib/scores/` modules | 22 | the claims machinery |

**153 scripts that no gate runs** is the largest single unlabelled surface in the
repo, and this repo's own rule is that a check nothing runs is not coverage. That
is the next cleanup slot's work, and it is a triage into gate, instrument and
spent one-shot, not a deletion sweep.

## 3. Untracked residue in the website repo

`scratchpad/` (empty of files at this tick) and `.mcp.json` modified and never
committed by rule. Nothing else. Clean.

---

## What this tick changed

1. Nine files deleted, 1.26 MB, all proven unreferenced.
2. `01-CLEANUP.md` corrected: the disposable set at the parent root is 9, not
   100, and tracked files there are out of scope.
3. `00-OPERATING-RULES.md` gained a guardrail: never run an untargeted grep from
   `E:\atlas`. One did, and it burned ten minutes of a thirty-minute tick before
   timing out. The parent repo holds the data pipeline: `page-data/` alone is
   over a thousand files and `macro/` several hundred more. Use ripgrep with a
   path, or scope to the website repo.

## What the next cleanup slot should take

1. The 153 unregistered scripts, triaged into three buckets with an index at
   `scripts/README.md`.
2. `docs/` archive pass: 352 files, no deletions, `docs/ARCHIVE/` plus a pointer
   in an index, starting with the four handoffs that precede 2026-08-18.
3. `src/app/dev/`, 37 routes, one route per tick.
