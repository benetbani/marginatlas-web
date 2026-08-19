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

**Tick 10. No document in this repo states a count any more. It carries one.**
The gate count had been written down at about 78 places across 32 files, at ten
different values, every one typed by somebody who had just measured it correctly.
That is the single defect class behind every tick of this loop.

So `scripts/counts.ts` now measures the repo, three files hold a generated block
instead of a number, and a new gate turns the build red the moment a block goes
stale, telling you the one command that fixes it. The files converted are the
three that matter most: `CLAUDE.md`, which every session reads first and said 95;
the verification protocol, which said 31 and has said 31 since the chain actually
was 31; and the loop's own research file, which described this exact defect and
then committed it twice in two days.

**It proved itself inside the same half hour.** Registering the new gate moved
the count from 103 to 104, and one command corrected all three files at once.
Two files were deliberately left out and are named in the proposal, because a
generated block in a file two workers rewrite every half hour is a collision, not
a fix.

**Tick 9. Your industry page says a trade keeps $9 and 8.6%, in two places, on
one screen.** Measured on restaurants: the benchmark rail and the subtype table
name the same six trades and disagree on every one of them. Fast-casual $9
against 8.6%, Food trucks $12 against 11.5%, Bars $7 against 6.5%. Worst gap half
a point. They descend from the same number: the rail rounds it, the table keeps a
decimal, and nothing reconciles them.

I did not change it, because which one wins is your call rather than a bug with
one right answer, and it changes a printed figure on a live page. It is **Q8**,
and my recommendation is to round the table so both read 9: your design prints
that figure at 64px where a decimal reads badly, the ranking does not move, and
the three-way tie stays a tie.

**Also worth one line:** the same page reads "All trades average" to a screen
reader over a figure that is a **median**. Median 7.920 ships as $8, the mean is
9.126 and would ship as $9, and the trades span about $5 to $12. So the wrong
word is a whole dollar out on a scale one dollar wide. One line to fix, next
claims tick.

**And a correction of my own**, kept because it is the same mistake the loop
keeps finding: my first reading said the 8.6% had no source and the two blocks
described different things. I had read a neighbouring seed file instead of the
module that produces the number. The probe proved me wrong before it reached you.

**Tick 8. Two things we believed about the homepage were wrong, and both in the
same direction: the job was already done.**

**It is 617 words, not 764.** The plan said cut it to 615 and treated that as the
main homepage job. Measured in a browser, what a reader can actually see is 617 on
a desktop and 613 on a phone. The 764 came from counting the server output with
the tags stripped, which includes markup that never appears at any one width. The
target was already met, and a tick that had started cutting would have sailed
straight past it while thinking it was getting closer.

**And "too tall" is three bands, not spacing.** On a phone the page is 9,848px,
and `neighborhoods` (1,568), `catalog-plates` (1,142) and `audience` (1,127) are
**39% of it between them, for 208 words**. Components stacking tall on a narrow
screen, which is a different fix from anything on the list. For scale: the blog
was rejected at 32,114px and cities at 20,459px, so the homepage is not in that
category.

**Good news on the font.** I ran the census that has been pending since you said
the font looked foreign. Exactly two families on the page, Inter and Newsreader,
nothing leaking in, and the display headings resolve to Newsreader rather than
falling back to body type. That confirms the fix by looking at the painted page
rather than at the code.

**All eleven bands paint at both widths and none is invisible**, worth checking
because an unpainted element is how the footer vanished from every page for weeks.

**Two gaps, stated.** No screenshots: the browser pane would not display, so the
page never composited and every attempt timed out. And two agents ran tick 8 at
once because the cron fired mid-tick; nothing was lost, but they both write the
same two ledger files.


**Tick 8. Four of your design rules were being enforced against a 14-line file.**
The gates for eyebrows, bold display type, subsection icons and the
horizontal-bar budget all read `dev/spine-cell`, `dev/spine-city`,
`dev/spine-industry` and `dev/spine-hood`. Those route files are 23 to 27 lines
and hold **one JSX element** each: `<SpineCellBody />`. The body it renders, the
one your live route imports, is 1,486 lines and nothing checked it. Across the
four: 100 lines of wrapper guarded, 3,695 lines of real page unguarded.

Repointed after a dry run proved it would not turn the chain red: zero new
failures, and the bodies do contain what those gates look for, so this is real
coverage and not a vacuous pass. Two things fell out. The bar-budget gate listed
one file **twice**, counting that page's bars double: it read 2 of 2, one phantom
bar from failing your build, and now reads 1 of 2. And on the real bodies it
reads **cell 3/3 and industry 3/3, exactly at your budget**, so one more
horizontal bar on either page fails. Six more gates still point at workshop
files; they are named in the backlog.

**One thing to know about this machine.** The full chain reported all 103 gates
red without running any of them: Windows refused to create processes
(`spawn UNKNOWN`), which also killed a `git commit` and an `npm` invocation
during the same half hour. Every gate I re-ran individually passed. It is a
sibling of the esbuild flake already in the notes, and it is written down so no
future tick reads it as 103 real failures.

**Tick 7. Your fallback gate command was running 43 of 102 checks.** `npm run
prebuild:serial` is documented as "same gates, single-process, use if parallel is
flaky", and the parallel runner is exactly the one that dies intermittently on
this machine. It was a hand-typed chain of 43 script paths that had drifted 59
gates behind the real list: **cream, palette, take-home identity, canonical URLs
and every wired test never ran there**, and it printed only passes. Fixed by
deleting the second list, so it now runs the one list at concurrency 1, plus a
new gate that stops another copy growing back. Chain is 103 and green.

That came out of the night's stock-take, which found **one defect class behind
all six ticks so far: a written statement nobody checked against the code**. Four
of those were in my own loop documents. The lesson is written down as three rules:
never claim two things are the same, only name the one thing; a stated number
carries the date it was measured; a prescription names the measurement it came
from.

**Tick 6. I threw away my own top priority instead of building it.** The list
said the homepage's biggest win was section padding: ours is SaaS-sized, go to
56px, lose a third of the page height. All three parts of that were wrong, and
reading two files was enough to show it. The page already sits at 32px on a phone
and 40px on a desktop, which is *tighter* than the editorial sites the research
admired. The spacing scale we derived from your own mockup **stops at 40**, so 56
would have turned a gate red. And we already did this job in `4ff9d677`, which
removed 1,216px, 18% of the page's height, by collapsing four competing rhythms
into one. Building it would have put about 320px back on.

**Worth knowing why I got it wrong**, because it is a shape that will recur. The
research was right that editorial sites run 32 to 64px and SaaS sites run 96 to
192. I applied it without measuring *our* page. A true general finding, a
backwards local instruction. That correction is now written into the standard
rather than quietly fixed, so the next tick reading "editorial rhythm" cannot
derive it again.

**What is actually still unmeasured:** per-band height. Every band emits, but an
emitted band can still compute to zero height, and nobody has looked at 1280 and
375 with a reload in between. Until that exists, every "too tall" claim on the
list is a guess, including the ones I wrote.


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
