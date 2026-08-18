# 01. Cleanup. Remove bloat without destroying evidence.

**Founder:** "cleanup of working directory from bloat and unnecessary materials".

Slot 1 of 12, so roughly once per six hours. The first run is the big one; later
runs should take ten minutes and find little, which is the point.

---

## The measured starting position, 2026-08-18

| Where | Count | Note |
|---|---|---|
| `E:\atlas\` root, stray `.jpeg/.png` | **100** | Playwright writes screenshots to the PARENT repo, not the website repo. Two months of them. |
| `website/` tracked files | 2,764 | |
| `website/docs/` | **352 files** | of which `docs/superpowers/` is **121** plans and specs |
| `website/scripts/` | **254 files** | of which **101** are the gate chain. The rest are one-shots and instruments, unlabelled. |
| `website/src/app/dev/` | **37 routes** | prototype surfaces, some three generations old |
| `website/data/` | 1,055 files | mostly `data/facts/*`, real product data, leave alone |

**352 documents and 121 plans is not neutral.** It is the direct cause of the
slowdown that `03-LONGEVITY.md` exists to fix: every session pays a re-derivation
tax before it can touch a file, and three of those documents currently contradict
each other. Cleaning this is not tidying, it is buying back tick time.

---

## THE ATTIC RULE. Nothing is destroyed.

```
E:\atlas\_attic\<YYYY-MM-DD>\<original-relative-path>
```

- Untracked files that are not on the disposable list get **moved to the attic**,
  never deleted. The founder empties the attic, or does not.
- Tracked files are **deleted in git** only when: nothing references them (proved
  with `strip_comments` applied, not a naive grep), the gates stay green, and the
  proof is in the commit message. Git is the recovery path.
- **Never `rm -rf` a directory.** Never remove `scratchpad/` or `scripts/spikes/`
  as directories; they are shared and hold real repo code. Clean by name.
- Every attic move is listed in the commit message, by count and by kind.

The only disposable list, deletable outright:
`E:\atlas\*.jpeg|*.jpg|*.png` at the repo root that are Playwright output,
`*.log`, `.next/cache`, `node_modules/.cache`, and files the loop itself wrote to
`docs/loop/artifacts/` more than three days ago.

---

## Procedure

1. **Census before touching.** Write `docs/loop/artifacts/bloat-census-<date>.md`:
   counts by directory, largest files, and for each candidate group a one-line
   verdict. A census is cheap and it is the only way a later tick can tell what
   changed.
2. **The 100 stray screenshots** in `E:\atlas\`. Confirm they are Playwright
   output (name pattern, dimensions, no reference from any tracked file), then
   delete outright. Record the count. Then fix the cause: any harness this loop
   writes puts screenshots in `docs/loop/artifacts/shots/`, never the parent repo.
3. **`scripts/` triage, 254 files, three buckets.** Label each in a single index
   at `scripts/README.md`:
   - **gate** (101, registered in `prebuild_all.ts`): keep, never touch here.
   - **instrument** (re-runnable, used by a step file): keep and name its owner.
   - **one-shot** (a spike that has served): attic.
   A script nothing runs and nothing documents is the definition of bloat, and a
   test file nothing runs is not coverage.
4. **`docs/` triage, 352 files.** Do not delete a single one. Create
   `docs/ARCHIVE/<year>-<quarter>/` and move superseded documents there with a
   one-line pointer left in `docs/INDEX.md` saying what superseded them. A handoff
   from May is history, not authority, and it should stop looking like authority.
5. **`src/app/dev/`, 37 routes.** Classify: live workbench, superseded prototype,
   dead. Superseded prototypes go to the attic as a whole route folder, one route
   per tick, gates green after each. `verify_dev_routes_sealed` already ensures
   none of them ship, so this is cost, not risk.
6. **The untracked residue** in `website/`: `scratchpad/` contents by name,
   anything in `scripts/spikes/` that is a spent one-shot.
7. Commit. One commit per group, never one giant sweep, so any single move can be
   reverted without unpicking the others.

---

## Forbidden here

- Deleting anything in `data/`, `content/blog/`, `public/`, or `db/migrations/`.
- Deleting a doc because it looks stale. Archive it with a pointer.
- Touching `.mcp.json`.
- "Cleaning up" a file that is failing a gate. That is a repair, not a cleanup,
  and it belongs to whichever step owns the file.

## Done test

One sentence, true or false: **"Every file I moved is recoverable, every file I
deleted was proved to be Playwright output or a cache, and the census records the
before and after counts."**
