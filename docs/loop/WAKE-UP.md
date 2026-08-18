# WAKE-UP. One screen. Read this first.

Maintained by every tick. Newest first. Numbers, not adjectives. If it takes more
than one screen, it is written wrong.

---

## Before the loop started, 2026-08-18

**Three things you did not know, all verified against the code:**

1. **Your 162 commits are pushed.** `origin/main` is at `6fc88e3e`, the same
   commit as local `HEAD`, ref written 05:42. The handoff written six minutes
   earlier says they are unpushed. Nothing else needs doing there.
2. **A likely cause for "the font was foreign".** `globals.css:882` declares
   `--font-display` as a reference to itself, while the two properties next to it
   reference `--font-sans`. If that is what it looks like, every engraved display
   heading has been falling back to body type. It is a hypothesis with an exact
   test and the loop tests it in its first site slot rather than assuming it.
3. **Three documents state a wrong gate count.** `CLAUDE.md` says 95, the
   verification protocol says 31, the chain is 101. A stale number is read with
   trust, which is why the loop now repairs them.

**Verified tonight:** `npx tsc --noEmit` clean. `npm run prebuild` 101 gates,
100 passed in the parallel run and the one red was esbuild dying under Windows
load, which passed instantly when re-run alone. Three checks in `cell-lattice`
are deferred by design and are not passes.

**What the loop will do while you sleep**, in rotation, one thing per 30 minutes:
the homepage three times per cycle, the site and the claims reform twice each,
and five slots on why this slowed down. It never pushes, never deploys, never
touches the H1, and never asks you a question. Anything that needs you is in
`DECISIONS-NEEDED.md`, answerable in one word each.

---

## Tonight's log

**Tick 2, homepage.** Wrong: nothing could count your homepage sections. The band
wrapper emitted an anonymous div, three bands share one tone name, and the only
number anybody had was "eleven declared". Measured, with real data: **eleven
declared, eleven emitted, none absent**, 764 visible words, and nine of the
eleven bands sit between 59 and 76 words. Changed: every band now carries a name
in the DOM, so height and presence are measurable, and the count assumption in my
own step file is corrected. **The finding: your homepage is not short of
sections, it is flat.** Eleven bands of the same weight read as one even column,
which is the mechanical shape of "bland". The quietest band, the world map at 14
words, is the only one that shows inventory instead of describing it.

**Tick 1, cleanup.** Wrong: my own step file called 100 images at `E:\atlas\`
stray screenshots. Measured: 91 of them are TRACKED in the parent repo, 16.5 MB,
committed 2026-07-27; only 9 were untracked leftovers, 1.26 MB, and all 9 were
proved unreferenced. Changed: the 9 are gone, the step file's figure is
corrected, and the real bloat baseline is written down: 153 scripts that no gate
runs, 352 documents, 37 dev routes. Those 91 tracked images are Q6 and they are
yours, because the loop does not delete tracked files in a repo it does not own.
