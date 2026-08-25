# Failure log. Classes, counts, and what would have caught each one.

Newest first. Corrections are appended; the original stays legible.

---

## 2026-08-19, tick 7. Six ticks of corpus, and one class accounts for all six.

**Corpus:** ticks 1 to 6 of this loop, the commits they produced, and the
existing gate headers.

### The classes, extended from the table in `04-FAILURE-REFLECTION.md`

| Class | Instances in ticks 1-6 | Worst instance |
|---|---|---|
| **A typed statement about the codebase that was never checked against it** | **6 of 6 ticks** | the gate count stated at ~78 locations in 32 files at TEN different values |
| A number acted on before its module was read | 1 (tick 3) | `restsOnModeled` grepped past, caught by `tsc` |
| A comment asserting a mechanism that is false | 1 (tick 4) | `LogoWordmark`: "falls through to Georgia when the variable is unset". Invalid is not unset, and invalid discards the whole declaration |
| A prescription written from general research without local measurement | 1 (tick 6) | P1-0 would have added ~320px of height and failed `verify_spacing_scale` |
| One quantity written in two places | **3** (tick 4 font token, tick 5 gate count, tick 7 gate chain) | `prebuild:serial` holding 43 of 102 gates |

### The top class, by both rankings

**By frequency:** class A, six ticks out of six. Every tick so far has found at
least one written statement that measurement contradicted, and in five of the six
the wrong statement was in a document this loop itself wrote or relies on.

**By survival time**, which matters more because it measures what the instruments
cannot see:

| Instance | Survived | Found by |
|---|---|---|
| `--font-display` self-reference | since `7c592e61`, the engraved foundation | reading, then a browser fixture |
| `CLAUDE.md` gate count | since the chain was ~53 gates | a census |
| `prebuild:serial` drift | unknown, at least 59 gates' worth of additions | this tick |
| `LogoWordmark` false fallback claim | since it was written | the same browser fixture |

Nothing in the chain could see any of them. All four are statements ABOUT the
system rather than behaviour OF the system, and the 103 gates read behaviour.

### The three questions, answered for the top class

**What instrument would have caught this on day one?** For the numeric half, a
gate comparing a stated number against the thing it states. For the prose half,
nothing: "same gates, single-process" is a sentence, and no gate reads English.

**Does that instrument exist here, unregistered or unrun?** No. The nearest is
`verify_stated_totals.mjs`, which compares a stated total against the array it
counts, and its header says it was kept deliberately narrow because the obvious
version cried wolf fifteen times in sixteen. That narrowness is why it never
looked at gate counts or npm scripts.

**If it cannot be an instrument, what one-line rule replaces it, and where must
it live to be read at the right moment?** For prose claims about tooling:
**a document may not assert that two things are the same; it may only name the
one thing.** `CLAUDE.md` should say "prebuild:serial runs the same list at
concurrency 1", which is checkable by reading one line of `package.json`, rather
than "same gates", which is a claim about 102 files. That line belongs in
`05-GUARDRAILS.md`, and it is now there.

### What this tick did about it

Deleted the duplicate rather than policing it: `prebuild:serial` now invokes
`prebuild_all.ts --concurrency=1`, so both chains read one array. Added gate 103,
`verify_single_gate_chain`, so a second list cannot grow back. Negative-tested by
re-inducing a three-gate chain.

### Inefficiencies, which count as errors here

Two ticks spent their opening minutes re-deriving counts that were written down
wrongly. Tick 6 spent its whole work budget disproving an instruction rather than
building. Neither is waste in hindsight, because both produced a correction, but
both are the same tax: **something true was not reachable at the moment it was
needed.**

### The loop's own errors, stated

- Tick 1: my step file's "100 stray screenshots" was wrong by a factor of ten.
- Tick 2: my step file's "three bands self-omit" was wrong; all eleven emit.
- Tick 3: I quoted a fallback figure as live behaviour before reading the field
  that made it defensive.
- Tick 5: this loop's own step file stated the gate count as 101 when it was 102,
  one tick after the loop itself added the gate.

Four self-inflicted instances of the top class in six ticks. The pattern is not
that documents rot slowly. It is that **a number is wrong the moment it is typed,
because typing it is the act that decouples it from its source.**

## 2026-08-25, the emptiness rule only looks one way

The founder's rejection listed "some sections have huge white space" beside
"some sections are totally wide for no reason". Both were answered, and only one
of them was actually answered.

E2 measures a section's INK AGAINST ITS HEIGHT. So a card whose content sits in
its left half and whose right quarter is dead passes, because vertically it is
full. Looked at as a picture, the city page's "What you can open, and where to
take it" is exactly that: a nested white panel, a line of text and a button, and
then a strip of nothing running down the right of the card. The gate reports the
city page clean on every one of its twelve counters, and the picture disagrees.

This is the same shape as the six measurement corrections already recorded above,
with the direction reversed: those were gates reporting faults that were not
there, and this is a gate reporting cleanliness that is not there. The second
kind is worse, because nothing prompts anyone to look.

NOT FIXED IN THIS TICK, deliberately. Two ways to close it and they are not the
same decision: measure horizontal emptiness inside a card, or redesign that one
section. The first is a rule change and belongs in the art direction before any
code; the second is a section rebuild and belongs in an inventory row. Choosing
between them while a gate chain was running is how sections get invented.

## 2026-08-25, the emptiness rule, and two more instruments that could not see

CLOSED the entry above. The fork was decided by a rule already ratified: "each
section should not have a lot of text or a lot of whitespace". Horizontal
emptiness is half of that and nothing measured it, so the rule was written first
and the gate built from a measurement rather than a chosen number.

THEN THE MEASUREMENT WAS WRONG TWICE, and both times the picture said so.

1. It skipped anything under 2px tall. That is every rule, axis and chart track
   on every page. A dot plot whose scale honestly starts at zero read as a 27%
   hole while its own row lines ran straight through the space it was flagging.
2. It tested the TOP and LEFT borders of an element and not the other two. A
   table row rule is a BOTTOM border. So an ordinary two-column table read as a
   45% void between its label column and its figure column, the worst score on
   any of the four pages.

THE SECOND ONE COST A REAL CHANGE. Acting on the 45%, the peer table was moved
to the small side of its band, with a commit message quoting the founder's own
2026-07-05 ruling on a table that was too wide. Then the instrument was fixed and
the same table scored clean AT BOTH WIDTHS. The change had accomplished nothing,
and at the wider size it stopped the myth chart drawing in previews. Reverted.

What saved it was asking a question the number could not answer on its own: was
the improvement the change or the correction? Measuring the OLD layout with the
NEW instrument answered it in one run. That comparison is cheap and it should be
the default whenever a fix and a gate change land near each other.

WHAT THE RULE FOUND ONCE IT COULD SEE: three real holes, of which the district
panel's multiplier readout was a table of labels and figures drawn as bare flex
rows, label hard left, figure hard right, nothing bridging 268px. The written
convention already covers it, F3, hairline rules between rows, and the sibling
peer table has followed it all along, which is exactly why that one never opened
a hole. Fixed. Two remain and both are layout rather than form.

## 2026-08-25, four peer figures are a fixed multiple of one real number

NOT A FAULT, AND NOT MINE TO CHANGE, but it should be said out loud. The trade
page's "same trade, comparable places" table shows Manchester, Edinburgh,
Birmingham and Bristol. Every figure is London's median turnover times a constant
written into the source: 0.7, 0.82, 0.68 and 0.78. Verified against the rendered
page, all four match to the pound.

It is declared. The section carries the sample tag, the code says "invented for
the exemplar (sanctioned)", and it is suppressed for districts. So this is a
ratified choice, not a leak.

It still decides a design question. A void in that card cannot be filled with a
bar, because a bar would draw proportions nobody measured, and in-cell bars were
removed from this very table on a founder verdict. Whether a table naming four
real cities with derived figures should exist at all is his call and is now in
front of him.

## 2026-08-25, the third instrument fault in the same rule, and the worst kind

E6 reports a card as UNJUDGEABLE when it holds a large element with no children
and no text, because that is what a chart looks like when it fails to draw. Four
cards came back unjudgeable. Three of them were drawing perfectly well.

An ordinary SVG path has no children and no text by nature. A table's column
definitions report a full-column rectangle and draw nothing at all. Both match
the signature exactly.

THIS IS THE WORST OF THE THREE and it is worth saying why. The first two faults
made the gate shout about holes that were not there, which is annoying and
self-correcting: someone looks, sees nothing, and investigates. This one made the
gate go QUIET about three sections while reporting a number that looked like
diligence. Unjudgeable is the category that hides things. A card that quietly
stopped drawing would raise that count and lower the hole count at the same time,
and both movements read as progress.

Caught by the check this repo already prescribes and I had not applied to my own
instrument: before calling a card empty, grep the markup for a word the card would
print. The survival curve prints its axis labels. The peer table prints its column
of city names. Neither was empty and both had been excused.

One card is genuinely unjudgeable now, and it is the one the preview limits
already document.

THREE FAULTS IN ONE RULE, all found by looking rather than by reasoning. The rule
is still worth having: every hole it found after each correction was real, and one
of them had been sitting on the neighbourhood page for weeks. But the ratio is the
lesson. A new measurement should be assumed wrong until a picture agrees with it,
and the first three pictures disagreed.

## 2026-08-25, the last hole was a typographic fault two rules away

The remaining gathered hole sat on the trade page's break-even card, 190 by 126
of empty at the top right. Every instinct said layout: move the support figures
up, change the split, narrow the card.

IT WAS THE TOOLTIP MARKER. Its class string carried both inline-flex AND grid.
Tailwind emits both declarations and the stylesheet's own source order picks the
winner, which was grid, and grid is BLOCK level. So a marker built to sit inside a
sentence was breaking the line before and after itself. "16 covers ? a day to
break even" rendered as three lines, the sentence never used the width beside it,
and the unused width is what the gate reported. Removing one word from a class
string closed the hole, shortened the card by 60px, and the sentence reads as a
sentence.

SEVEN MARKERS ON THE FOUR LONDON PAGES, seventeen call sites in twelve files,
every one wrong in the same way, and none of it visible to a typecheck, a linter
or any of the 121 gates. It rendered, and it looked deliberate.

THE LESSON IS THE DISTANCE. A measurement pointed at a hole; the cause was two
rules away and in a different component. The temptation was to fix what the
measurement named , the layout , and that fix would have worked, in the sense
that the number would have gone down, while the sentence stayed broken on seven
more places. Ask what CAUSED the shape before rearranging it.

GATED, and negative-tested four ways: the real fault fails it, a deliberate
ternary between two displays passes, a prefixed responsive override passes, and a
synthetic collision fails. The first version of the check did NOT catch the fault
it was written for, because its pattern stopped at the interpolation sitting
between the two colliding words. It was worthless and would have shipped as
reassurance. Negative-testing is the only reason that is not what happened.

## 2026-08-25, five gates failed and four of them were fine

A chain run reported 116 passed, 5 failed. Read at face value that is a bad
regression. Four of the five were the machine, not the code:

  one could not allocate: "VirtualAlloc failed"
  one died on an access violation
  one could not allocate, same message
  one asserted inside a memory reallocation while reading a file

All four passed on their own, immediately after, exit 0 each. The fifth was real
and boring: a generated counts block was stale because a gate had been added.

THE RUN TOOK 665 SECONDS AGAINST A USUAL 225. That is the tell, and it is worth
more than the exit codes: a chain that takes three times as long is not reporting
on the same conditions as the one it is being compared against. Free memory was
under a gigabyte with no browser and no node process running, which means the
pressure was transient and had already passed by the time it was looked at.

WHAT THIS COSTS IF IT IS NOT CAUGHT. A crash exits non-zero and lands in the
failure list beside genuine findings, with a stack trace that looks like evidence.
The instinct is to start fixing the named gates. All four would have been
'repaired' into a state nobody could explain, because there was nothing wrong
with them.

THE CHECK: before acting on a chain failure, look at the wall-clock and the
failure TEXT, not just the count. An allocation failure, an access violation or
an assertion inside a memory routine is an environment report, not a finding.
Re-run the named gates alone before touching a line.

Reduced the browser work that plausibly contributed: the emptiness gate measured
two widths by launching two browsers to render the same four files twice. It now
opens one, and the shared helper closes it in a finally so a throw cannot leave a
stray browser behind, which is invisible until the next run goes short of memory
and blames a gate that is working.

## 2026-08-25, the table conventions, and a rule that was itself wrong

Section J lists F2 to F8 as held by nothing but attention. These pages are largely
tables, so that was the largest unchecked surface left. Probed all three real
tables, deliberately reporting FACTS rather than verdicts, because three
instruments written this week were wrong on their first reading and two of them
shouted about faults that were not there.

Four things came out of three tables, and only one was a page fault.

ONE REAL FAULT. The trades-next-door table carried an explicit instruction to draw
no rule between its rows, cancelling the one the table primitive draws by default.
Six trades down the left, two figures hard right, 300px of nothing between a name
and its number with no line to follow. Both sibling tables have carried row rules
all along; this was the odd one out. Fixed.

TWO ARTIFACTS. The peer table's header read as "not uppercase" and "two sizes".
The label spans are all one size and the lowercase is a unit in parentheses; the
larger figure belongs to a wrapper whose children override it. Measuring the CELL
rather than the rendered label is what produced both.

AND THE RULE ITSELF WAS WRONG. F5 said the best value "in a column" takes the
accent. The city peer table puts METRICS down the side and CITIES across the top,
so its winner is per ROW. Reading it column-wise reported a correct table as three
separate faults. The rule now names the comparison rather than the axis, and says
which way it runs in each orientation.

THAT IS THE ONE WORTH REMEMBERING. Every other correction this week was an
instrument disagreeing with a page. This was a RULE disagreeing with a page, and a
rule is the thing everything else is measured against. It had been written down,
reviewed and quoted, and it was still only true for half the tables it governed.
When a check and a page disagree, the rule is the third thing that can be at
fault, and it is the one nobody checks.

A LIMIT, RECORDED. The emptiness rule does not hold for tables. A right-aligned
figure's CELL spans its whole column, so the space reads as inked even when it
looks empty. That is why the trades table never appeared as a hole while looking
exactly like one. For a table, the row-rule convention is the rule that holds.

## 2026-08-25, a chart port, and the three faults it dragged out of a gate

THE PORT. The rank slope on the neighbourhood page was one fixed picture handed
the card's width with no height of its own, so it scaled uniformly and took its
words and its dots with it. Dots read 5.5px at 1280 and 3.5px at 375 against a
rule that says 6px at every size. The caption rendered near five pixels on a
phone. The code had already conceded the point by hiding five of the seven
district names below the small breakpoint, because at that size they were smears.
The survival curve had been given the fix months earlier and carries a note about
it; this chart never received it.

Now: 6px dots and identical label sizes at both widths, and all seven names on a
phone instead of two. The names were hidden because they were illegible, not
because they were noise, and that reason is gone.

THEN IT DRAGGED THREE FAULTS OUT OF THE ACCENT COUNTER, and the sequence is the
interesting part, because each one only became visible after the one before it.

1. THE PORT'S COUNT JUMPED FROM 2 TO 4 WITH NO COLOUR CHANGED. The old chart drew
   its terracotta as SVG fill and stroke. The counter reads CSS colour. So every
   accent drawn in SVG anywhere on this site was invisible to it: a chart could
   paint its entire finding in the accent and score zero. Moving the same marks
   to real elements is what made them appear.

2. WITH SIGHT, ITS COLLAPSING WAS WRONG. The comment said boxes within 24px; the
   code compared top-left CORNERS. A label sitting beside its own dot scored as
   two separate marks whenever their corners were far apart, which for a
   right-aligned label is always. Now edge distance, and transitive, because one
   mark can be drawn as a chain: a name, a dot, a line across a plot, a dot, a
   name, tracing ONE district. That is one thing claiming to be the answer.

3. WITH SIGHT AND CORRECT COLLAPSING, IT COUNTED THE ICONS. Every section icon
   carries terracotta details two to five pixels across inside a fourteen-pixel
   glyph, ten of them on one page, and the moment SVG paint became visible every
   section on the site read as over-marked. An icon is chrome. It is not claiming
   to be the answer to anything.

Findings went 9, then 18, then 7. Only the last number describes the pages.

THE PATTERN WORTH KEEPING. Fixing an instrument does not converge in one step. A
blind spot hides the faults BEHIND it, so correcting sight surfaces a second fault
that was always there and never reachable. Budget for the cascade: the first
correction is not the last one, and the count in between is not a regression.

LEFT OPEN, DELIBERATELY: whether a section icon should carry the accent at all is
C5's question, colour on chrome, and it has NOT been examined. It is excluded from
the answer-budget because it is not an answer, which settles the counting and
settles nothing about the design.

## 2026-08-25, the exemption that was being claimed for the wrong figures

The tabular-numerals check carries an honest note about its own blind spot: it
cannot tell a figure that STACKS from one that stands alone, so a scale's two END
labels get counted and are not really a fault. That note is true.

The claim built on top of it was not. Seven figures were failing and the standing
summary, repeated in a founder-facing document, was that all seven were scale end
labels and none was worth spending on. Measured today by printing each one with
its position: THREE of them are the survival chart's 0%, 50% and 100%, sitting in
one column at the same left edge, three deep. That is not an end label. It is the
exact case the rule exists for, a column of figures scanned vertically where
proportional numerals make equal values look unequal.

The other four are genuinely standalone and the note holds for them.

FOURTH CARRIED CLAIM THIS WEEK THAT DID NOT SURVIVE BEING MEASURED, and they
share a shape. A true observation about an instrument's limit gets written down.
Then a count is attributed to that limit WITHOUT CHECKING which items the count
contains. The limit is real, the attribution is a guess, and the guess inherits
the credibility of the limit. It reads as diligence: the blind spot is named, so
the number beside it looks accounted for.

THE CHECK IS CHEAP: print the items, not the count. Three lines of code named all
seven in one run and the answer was visible immediately. Any time a number is
explained away by a documented limit, list what is actually in it.

## 2026-08-25, a line that stopped short, and why nobody saw it

The survival curve's stroke ended just past year three, with a rounded cap, while
the area fill and the end dot carried on to year five. It had been doing that for
months.

THE CAUSE. A dash length was computed by summing the path's segments IN VIEWBOX
UNITS and handed to a stroke drawn with non-scaling-stroke, which measures its
dashes in SCREEN units. The box stretches horizontally and not vertically, so the
rendered path is about half as long again as the sum that was measured, and the
dash covered two thirds of it. Wider card, shorter line , which is the opposite of
what anyone would guess, and it means the fault was WORST on the widest screens.

It was a reveal animation that no longer animates. The draw fraction has been
pinned at 1 for months so crawlers and fast scrolls could not catch a curve
mid-draw. That fix left the dash in place, doing nothing but truncating.

WHY IT SURVIVED. At normal size the truncation does not read as a broken line. It
reads as the curve flattening out, which is exactly what a survival curve does in
its later years, so the defect wore the shape of the data. It became obvious the
moment the card was captured at three times its size: a rounded stroke cap sitting
in open space is not something a chart does on purpose.

THE PRACTICE THIS ARGUES FOR. Looking at a picture catches what a gate cannot.
Looking at a picture ZOOMED catches what a picture cannot. Anything drawn with a
stroke, a cap or a sub-pixel rule should be looked at above 1x at least once,
because at 1x a two-pixel wrongness is indistinguishable from an intention.

The other chart on this site using a dasharray is a donut with proportional dashes
and no scaling conflict. Checked, not assumed.
