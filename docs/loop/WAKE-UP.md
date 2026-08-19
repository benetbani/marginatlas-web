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

**Tick 4. The foreign font: found, proved, fixed.** You said the font on the last
work was foreign. It was. `--font-display` was defined as a reference to itself,
on the same element the font loader writes to. Measured in a browser rather than
argued: in the order where our stylesheet wins, that property computes to
**nothing at all**, and every heading using it silently renders in the body sans.
The Georgia fallback written right beside it never runs, because an invalid
variable throws away the whole line instead of stepping to the next name. Fixed
by giving the font loader its own slot, `--font-serif`, which is precisely how
the body font has always worked. Re-measured in both stylesheet orders after the
fix: correct in both, so it can no longer depend on luck. Added as gate 102 so it
cannot come back. **What I still cannot tell you:** which order production
serves, so I cannot say how many of your live pages a reader sees in the wrong
face.

**Tick 3, claims. Your example, measured.** The break-in word (forgiving,
manageable, demanding, brutal) is built from three sub-scores with weights we
chose, and two things came out of reading it properly. **A 10% error in one input
changes the printed word 14.1% of the time**, across 1,764 combinations. And on
three of the four surfaces, time-to-open has no place argument at all: it is a
per-trade constant, so **24% of that score is identical in every city**. Your
sentence about a trade in a bad city was right, in numbers.

The machinery to be honest about that already exists: the rating carries a
"rests on modeled inputs" flag, **four of the five callers set it true, and
exactly one component on the site actually shows the reader**. That is Q7, and
the loop did not act on it, because these are the function's numbers across a
plausible grid, not a count of your live pages. That count is queued next. One
correction from this tick: my first reading said a missing input invents a
neutral 50 in production. It does not; callers pass a modeled value. The typecheck
caught it.

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
