# WAKE-UP. One screen. Read this first.

Maintained by every tick. Newest first. Numbers, not adjectives. If it takes more
than one screen, it is written wrong.

---

## Tick 19, 2026-08-20. The country page had no design budget at all.

**What was wrong:** the rule limiting how many bar charts a country page may carry
was being enforced against a prototype in the workshop. The country page a visitor
actually gets was covered by nothing.

**What was measured:** across all 105 checks, 11 mention a workshop file and **none
of them looks ONLY at the workshop**. The alarming version of this problem was
fixed two weeks ago; what was left was one line, and it is now closed.

**What changed:** the real country page is now inside the budget, and it fits with
room to spare. One decision left to you rather than guessed: six checks cover a
homepage file that only renders when a Vercel switch is on. This repo cannot read
that switch, so the coverage stays. Nothing on the site itself changed.

---

## Tick 18, 2026-08-20. The loop was reading a quarter of its own to-do list.

**What was wrong:** the tool that tells each tick what to work on required every
item's title to fit on one line. Titles are sentences, so they wrap.

**What was measured: 65 items in the file, 48 read, 17 invisible.** Including the
one item marked in-progress, so for four ticks the tool said nothing was in
progress and the rule that says finish it first had nothing to point at. The last
four ticks picked work off a shortened list without knowing it was shortened.

**What changed:** the tool reads wrapped titles now, and it counts the items a
second way and stops the tick if the two counts disagree. That second count is
the part that matters: this is the third time in five ticks something written for
a person was invisible to something reading it, and the first fix that catches
the next one. Nothing on the site changed this tick.

---

## Tick 17, 2026-08-20. The site now has an accessibility gate. It had none.

**What was wrong:** an accessibility audit had been sitting in the repo, written
and never connected to anything. The plan said to wire it in. Wiring it as written
would have added a check that **cannot fail**, and its only complaint was wrong.

**What was measured:** it reported three problems and **all three were correct
code** , inputs wrapped in their own label, which is valid and needs nothing else.
The audit read one line at a time so it could not see the wrapper.

**What changed:** detector fixed, comment handling added, made able to fail, and
registered. Chain 104 -> 105, all green. Proved it still catches real problems by
feeding it a file full of them. **It checks four patterns in the source; it does
not see colour contrast, keyboard order or focus. Do not read green as accessible.**

---

## Tick 16, 2026-08-20. Half the gate copies are gone.

**What was wrong:** seven gates still carried their own private comment parser,
and the recipe for converting them had a trap that only shows up at the call site.

**What was measured:** reading all seven first, **three of them do not read lines
in order at all**, so the recipe would have broken them while looking correct. One
of the private copies already held a fix the shared module was missing until this
morning: it knew a URL is not a comment, and the module every gate depends on did
not.

**What changed:** a helper that strips a whole file once and hands back an array,
so the trap stops existing for everyone. Three more gates converted, four of eight
now done, 17 private copies left across the chain. Chain 104/104, tests 17/17.

---

## Tick 15, 2026-08-20. Eight gates skip real code, and scan prose instead.

**What was wrong:** eight gates decide what is a comment by how a line LOOKS, so a
line starting `/*` or ending `*/}` is skipped whole even when it holds real code.

**What was measured:** across 696 files, **42 lines of real code invisible** to all
eight, and **9,033 lines of comment prose scanned as code** by them. My own
measuring script was wrong twice before those numbers held, and both fixes are
written down.

**What changed:** one gate converted, not eight, so any flip is attributable. Seven
to go, with the recipe and its one trap recorded. Also found a scan-list entry
listed twice, which doubled that file's violation count; the same duplicate was
found in a sibling gate at tick 8 and nobody checked the rest. Chain 104/104.

---

## Tick 14, 2026-08-20. The gates could not see URLs.

**What was wrong:** the shared comment-stripper every source gate depends on
treated the `//` in `https://` as the start of a comment and threw away the rest
of the line.

**What was measured:** 64 lines across 34 files, **4,179 characters**, invisible
to all 14 gates that use it. The worst hid 513 characters of `globals.css:707`,
**including a hex colour**, on a line the hardcoded-hex gate exists to read. The
backlog also said 12 gates roll their own detection; recounted, it is **21**.

**What changed:** one guard, a `//` after `:` is a URL scheme and not a comment.
Five tests added, and one existing test that asserted the opposite was corrected.
Chain still 104/104. **The colour is still invisible for a second reason** , it is
written `%23241b11` and the detector needs a literal `#` , filed as P0-15.

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

**Tick 13. Five files in your repo are named like build gates and nothing runs
them.** `verify_aov_city_tier`, `verify_enrichment`, `verify_formation_expansion`,
`verify_manual_aliases`, `verify_manual_aliases_db`. They sit in the same folder
as 84 files with the same prefix that do run on every build, so nobody reading
that folder can tell which is which. A name that claims enforcement it does not
have is worse than no file. None has been edited since early June; only one of
them needs the database, so only one is barred from joining the chain. That is
**Q9**, and I did not act on it, because wiring a gate that turns out to fail
would leave the build red for the next tick.

Around that: **259 scripts, 84 gates, 13 wired to npm, 92 findable from some
other file, and 70 that nothing names at all.** Of the 70, 23 are one-shot data
imports that are supposed to be spent, so they stay as history. The rest are
old dry-runs and diagnostics. Nothing was deleted or moved: this was the triage
your cleanup step asked for, and it now lives in `scripts/README.md` along with
where a new script belongs so the pile stops growing.

**Tick 12. You said we had slowed up considerably. Measured: true, and it was
July.** Commits per active day ran **29.3 in May, 19.5 in June, 7.9 in July, and
28.6 in August**. July was a 73% collapse; August is back within four percent of
the May peak. The work also got smaller: mean insertions per commit fell from 701
in June to **279 in August**, which is the checkpointing habit showing up in the
data rather than in a promise.

**The tempting explanation is wrong.** Meta work, docs and gates and tests, is
not eating the project: its share of everything touched fell 19% to 15% to 14%
across those months. The real tax now is verification: 104 gates, a minute and a
half to two and a half minutes per run, and three ticks tonight ran it two or
three times because the machine faulted, not because anything was broken.

**And the machine faults are partly my fault.** I measured commit sizes with a
loop that ran one git command per commit, a thousand times. It timed out after
ten minutes and left the shell unable to start processes at all, which is exactly
the failure that stopped two earlier ticks dead. The same numbers came back from
a single command in under two seconds. That is now a rule in the loop's operating
file: measure in one process, never once per row.

**One tidy-up:** two invisible control characters I wrote into a loop document in
tick 10 are gone. Three attempts to remove them appeared to fail and I nearly
blamed the other agent for locking the file; the file was fine and my quoting was
wrong.

**Tick 11. The tallest thing on your phone homepage was decoration.** The
neighbourhood band is 1,568px on a 375-wide screen, six cards carrying **32 words
between them**. In each 215px card, **80px is a gradient strip with a pictogram
and no text** at all: 37% of the card, six times over.

I did not delete it, because you asked for more elements and not fewer. I made it
proportionate to a phone: 48px below 640, unchanged at 80 above. The band drops to
1,376px and the page to 9,656px, and **the desktop page is still exactly 5,933px**,
so nothing you have already approved has moved.

**The backlog had aimed me at the wrong band, and measuring first is what caught
it.** It said cut the audience band from 1,127px to under 700. Measured: 533px of
that is your seven-row pricing matrix, which is content, and the obvious fix
(two columns for its four cards) saves **six pixels**, because the cards double in
height when the titles wrap. That target is not reachable without deleting
something real, and now that is written down rather than assumed.

**One thing waiting on eyes.** Putting the neighbourhood cards in two columns on
a phone measures at **940px, a 40% cut of the tallest band**. I did not land it:
it changes how six cards look, the pane still refuses to render a screenshot, and
I will not ship a look I cannot see.

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
