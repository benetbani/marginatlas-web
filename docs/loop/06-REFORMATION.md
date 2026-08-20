# 06. Reformation. Execute one approved move, prove it, leave a pointer.

> **RETIRED 2026-08-20, NOT DELETED.** The founder narrowed the loop to four
> lanes: *"we should focus only on design, site functionality, hierarchy,
> usability"*. It executes moves that 02 proposes, and 02 is retired, so it has no input.
> **This file is no longer scheduled.** It is kept for its reasoning and its
> measured numbers, which stay true. Nothing here may be revived without a
> founder ruling that widens the scope. See `docs/loop/README.md`.

**Founder:** "reformation, improvement, optimization of the working directory and
related parts".

`02-ORGANISATION-RESEARCH.md` writes the list. This step executes exactly one
item from it per tick, top of the list first. One move per tick is not caution,
it is falsifiability: when a move breaks something, there is no doubt which move
did it.

---

## Entry conditions

- `docs/loop/artifacts/org-proposal.md` exists and has an unexecuted item.
- Gates are green at the start of the tick. Never reorganise on a red chain.
- The move has a blast-radius number. No number, no move; send it back to 02.

If the list is empty, this tick becomes a homepage tick instead and says so.

---

## Procedure for a move

1. **Count the references properly, before moving anything.** With
   `strip_comments` applied, and remembering that **barrel re-exports hide the
   real count**: the dossier records `buildCountryBoard` showing 6 references, all
   six from its own gate, which is zero real consumers wearing a green tick.
2. **Move with git**, so history follows the file: `git mv`, never copy and
   delete. A move that loses `git log` for a file has destroyed the only record of
   why it exists.
3. **Repoint every reference in the same commit.** A move and its fixups split
   across two commits leaves the repo broken in between, and this repo's history
   is read.
4. **Leave a pointer** where a human or a future session will look for the old
   thing: a one-line stub, an entry in `docs/INDEX.md`, or a redirect. Do not
   leave a copy; leave a pointer.
5. **Verify**: `tsc` clean, `prebuild` 101/101, and for anything that could touch
   a rendered page, render it. Moving a document cannot break a render, so say so
   and skip it honestly rather than pretending to have checked.
6. **Commit alone**, with the blast radius, the reference count before and after,
   and the pointer left behind.

---

## The kinds of move this step is for

| Kind | Rule specific to it |
|---|---|
| Archiving a superseded document | Never delete. `docs/ARCHIVE/`, plus a pointer naming what superseded it. |
| Deleting dead code | Delete the module and its gate together. A gate keeping dead code alive is worse than the dead code. |
| Splitting an overloaded file | Only when a named boundary exists. "It is long" is not a boundary. |
| Generating a number that was typed | The highest-value kind here. Gate counts, file counts, status pointers. |
| Retiring a dev route | One route folder per tick, gates green after each. |
| Renaming for one vocabulary | Value first, then call sites, the way the cream purge did it. |

---

## The rename lesson, because this step will hit it again

The cream purge is the reference execution and its shape is reusable: **move the
value under the old name first, verify nothing changed visually, then migrate the
call sites, then delete the name.** Three separate reversible steps. Doing it in
one commit means a colour change and a rename are entangled and neither can be
reviewed.

And the check must be scoped to the right place: one of the businesses this atlas
covers is an ice cream shop, so grepping rendered markup for the word "cream"
fails on the product's own subject matter. Check attributes, not documents.

## Forbidden

- Two moves in one tick.
- Any move that cannot be described in one sentence.
- Touching `data/`, `content/blog/`, `public/`, `db/migrations/` or `src/app/api/`
  in a reorganisation. Those are product surface, not housekeeping.
- Changing a URL slug. SEO equity rides on existing URLs; add, never rename.

## Done test

**"One move landed, every reference was repointed in the same commit, a pointer
was left behind, and the gates are green."**
