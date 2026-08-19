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

**Tick 5. The file you read first is sending every session to the wrong two
folders.** `CLAUDE.md` tells each new session to read
`docs/design-system/GUIDELINES.md` as "authority for any UI work" and
`docs/architecture/README.md` as the map. GUIDELINES was last committed
**2026-05-28**, architecture is one file untouched since **2026-05-27**. And it
is worse than old: `TOKENS.md` in that folder carries **25 references to moss,
amber, teal and cream** — the ramps we deleted on 17 August and now have gates
against. So the reading order we hand every session teaches a palette the chain
rejects.

Also measured: `plans/` is 91 files and **78 of them are from June**, so a
folder whose name reads forward-looking is 86% archive. And this step's own file
claimed the chain was 101 gates. It is **102**. Four documents state that one
number at four different values, and the document describing that exact defect
was one of the four. Fixed.

**The proposal says do not reorganise, and that refusal is the finding.** Of the
78 June plans, 55 are linked to from elsewhere and 21 are not, so a tidy-up
repoints 55 files to save you some scrolling while the 21 cost nothing. The
research agreed from the other side: Google and Diataxis disagree about where
documents should live, but lychee, Vale, cog and tfplugindocs all agree on
making a document unable to be wrong. And Kubernetes settles it — they put
status in a machine-readable file, and their own README still lists checking it
as something they *want*. A status field lies exactly as easily as a sentence.

So: generate the counts, make `CLAUDE.md` name things instead of restating
them, and give old records a status line. Nothing moves.


**Morning of the 19th, outside the rotation. A master plan, researched.** You
asked for the whole project pushed forward on design, so four agents ran at
once: three on external research, one auditing what this repo actually is.

**The numbers that matter.** Your homepage is **764 words across 11 bands**. The
homepages that read as confident are Arc 180, Vercel 400, Notion 575, Clerk 720,
so the target is **615 across 10**. Height has one dial and it is not content:
editorial section padding runs 32 to 64px, ours runs SaaS scale at up to 192, and
56/40 removes about a third of the page **without deleting a word**. Replacing
prose hedges with numeric ranges is nearly free in reader trust (d=-0.03) while
vague hedging costs seven times that (d=-0.21, N=5,780, includes a live BBC
field test).

**Why design first on a numbers product:** design look drives **46.1%** of
credibility judgements against **14.3%** for accuracy of the information (Fogg,
N=2,684). For most readers the presentation is the proof.

**The order of work changed because of one audit finding.** Ten design gates scan
`dev/` bodies no reader can reach; the chrome gate passes two routes because
their files mention the word in a comment; the contrast gate measures an opaque
card when the real one is 95.5% white over a photo with a multiply noise layer on
top. The rulebook has been enforced against the workshop. Repairing the
instruments is now P0, ahead of the homepage, because otherwise the homepage work
is unprotected.

**Tick 4's work was stranded and is now safe.** It sat uncommitted for 13.5
hours. Verified and landed as `2179bcb2`.

**Two things I got wrong and corrected before they reached you**, both kept in
writing so they are not rediscovered a third time: page depth is NOT inverted
(the registry says 7 cell sections, the page renders **34**, so render and
count), and `/extremes` is NOT a duplicate of `/margin-index` (disjoint design
systems, different algorithms, different resolvers). The real near-duplicate is
`/margin-index` against `/dev/decide-v2`, and it may be your intended paid
tier, so it is a question rather than a merge.

Plan: `docs/superpowers/plans/2026-08-19-masterplan/`. Queue: `06-BACKLOG.md`.


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
