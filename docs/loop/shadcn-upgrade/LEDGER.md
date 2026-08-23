# THE SHADCN UPGRADE LEDGER

**Built:** 2026-08-22, loop iteration 1. **This file is the loop's memory.** Read it
first, every iteration. One surface per iteration. Never reorder it to reach
something easier.

## How to read a row

- **Section** is what a VISITOR reads on the page, not a file name.
- **Form** is what that section is currently built out of.
- **Defect** is `VERIFIED`, `NONE FOUND`, or `NOT CHECKED`. Only `VERIFIED`
  justifies a replacement, and only with the evidence written down.
- **Status** is `TODO` / `DONE-REPLACED` / `DONE-KEPT` / `RETIRED` / `BLOCKED`.

## The named defects that count

Text that scales with its container. Labels that collide. A chart that does not
start at zero. A spread whose ends are invented. Raw hex. A hover as the only
carrier of a number. A shape that does not sum to what it claims. A component
that mounts nowhere.

## Order of reader value, ratified

Cell page first, then industry, city, neighbourhood, country, home, then the
rest. The cell page is the product: a trade in a place. The country page is the
weakest and comes late on purpose.

---

## What a visitor actually sees

**CORRECTED 2026-08-23, and the correction matters for every row in this file.**

This section previously said the cell, industry and city rebuilds were LIVE by
default. **That was wrong, and it was wrong in the way that matters: I read the
per-page switch and not the resolver underneath it.** A page with a shipped
adapter does not default to on; it defaults to FOLLOWING THE MASTER SWITCH, and
the master switch defaults to OFF. Resolved by calling the function rather than
reading it: with nothing set, **all six page types are OFF.**

**And production agrees.** Fetched marginatlas.com/cities/london and
/industries/restaurants: neither carries a single spine marker, and both headings
carry the PRE-SPINE typography classes. **The rebuilt pages are not being served
to anyone.**

**What that means for this ledger, said plainly.** Every "a visitor sees" in the
rows below describes the REBUILT page, which today is reached only in the
workshop. The fixes are not wasted: these pages are the ratified destination and
go live when the founder sets the switches in the hosting dashboard. But no
sentence in this file should be read as "a reader is looking at this today", and
several were written that way before this correction. **The one figure to
re-read in that light is row 37's "251 of 252 city pages": true of the rebuilt
city page, which is not currently served.**

Whether the switches are on in production cannot be read from this repository at
all: they are dashboard settings. The check above is a fetch of the live site,
and that is the only instrument here that can answer it.

---

## 1. CELL PAGE (a trade in a place). The product.

| # | Section a visitor reads | Form today | Defect | Status |
|---|---|---|---|---|
| 1 | Where each $100 of sales goes | 100% stacked bar, legended | **VERIFIED, FIXED** | **DONE-KEPT** |
| 2 | What the owner keeps | **waterfall on the chart library** | VERIFIED, FIXED | **DONE-REPLACED** |
| 3 | When it clears costs | two-marker scale on one domain | **VERIFIED, FIXED** | **DONE-KEPT** |
| 4 | What it costs to open one | three bars on a shared track | **VERIFIED, FIXED** | **DONE-KEPT** |
| 5 | Who this suits | tier band | **NO DATA. Reaches no reader** | **BLOCKED** |
| 6 | When the week fills up | daypart donut | **NO DATA. Reaches no reader** | **BLOCKED** |
| 7 | Who comes in, and how | share bar | **NO DATA. Reaches no reader** | **BLOCKED** |
| 8 | Busy months and quiet months | zero-baseline monthly columns | **VERIFIED, FIXED** | **DONE-KEPT** |
| 9 | Getting to break-even | two-anchor time axis | **1 trade in 138. Latent fault fixed** | **DONE-KEPT** |
| 10 | The same trade, comparable places | **a real table** | **VERIFIED, FIXED** | **DONE-REPLACED** |
| 11 | What the team costs | range brackets | **VERIFIED, FIXED** | **DONE-KEPT** |
| 12 | What to watch | one shared safety scale | **VERIFIED, FIXED** | **DONE-KEPT** |
| 13 | Myth vs. reality | survival curve, folklore struck on it | **VERIFIED, FIXED** | **DONE-KEPT** |
| 14 | Related trades in this place | ranked figure list | **NO DATA. Reaches no reader** | **BLOCKED** |
| 15 | The masthead turnover spread | spread strip, marked | **VERIFIED, FIXED** | **DONE-KEPT** |
| 16 | The masthead headline figure and its scorecard | a wrapping row of tiles | **VERIFIED, FIXED** | **DONE-KEPT** |
| 17 | The currency and format switch | segmented control | **NO DATA. Reaches no reader** | **BLOCKED** |

**Row 2, closed 2026-08-22.** The money identity now runs on the chart library.
The drawing it replaced scaled its own text with its box, so the same labels were
unreadable on a phone and oversized in a wide band, and it carried six raw hex
values. Two further defects were found only by looking at the render: six labels
collided at phone width, then the wrapped second line was silently cut off. A
second, unmounted copy of the same chart was deleted from the kit.

**Row 1, closed 2026-08-22. Kept, and the defect fixed without a block.**

The library answers nothing here. The bar is a flex row of coloured divs whose
widths are percentages: no axis, no scale, nothing to measure, no many-points
problem, and it renders on the server. A charting library would add a
browser-side redraw to a shape CSS does exactly, and would need the same
normalisation anyway.

**The defect it did have was arithmetic, and it was measured.** The five slices
are scaled to sum to exactly 100 as decimals, then each is rounded on its own.
Across 320 realistic splits that lands off 100 in **39% of cases**. Where it
lands SHORT, one split in five, the bar stopped before the end of its own track
and left a pale notch immediately after the terracotta kept slice, on a section
whose entire claim is that these five parts ARE the hundred dollars. A gap there
reads as a sixth cost nobody named.

**A prediction that was wrong, recorded because it is the lesson.** The
arithmetic said the over-100 cases would CLIP the last segment, and the last
segment is the terracotta one. Rendered in a real browser, they do not: flex
shrinks the row back to the track, so those cases were already correct. Only the
short ones were broken. Reasoning about the numbers found half the answer and
named the wrong victim.

**The fix is one prop the component already had and nobody passed.** Widths move
by at most one point. No printed figure changes; the legend still carries the
caller's real numbers.

**And the price of that fix, paid rather than left as a trap.** Normalising is
right for a rounding drift and WRONG for a genuinely broken split: a stack
summing to 70 used to show a third of empty track, and normalised it would draw
as a full, confident, false hundred dollars. So the section now refuses to draw
at all when the gap is bigger than rounding. Tolerance four points against a
measured worst case of one: it fires zero times on today's pipeline, which is
the point. It is for the day the upstream split changes shape.

**Three things this iteration found and did NOT touch, one surface at a time:**

- **The industry page carries the same bar with the same claim** (row 19) and
  the same missing prop. It is a different surface and gets its own iteration.
- **A latent divergence, harmless today.** The waterfall follows the subtype
  picker; this bar does not. On the live page the picker is not wired, so both
  read the same split and agree. **The day subtypes are wired with real data,
  two sections on one page will show the same $100 split with different kept
  slices.** Nothing to fix yet. Everything to remember.
- **A question only the founder can settle.** The printed legend can still read
  33 + 31 + 9 + 23 + 3, which a reader can add to 99. Fixing that means rounding
  the five figures so they sum to 100, which CHANGES a printed figure by up to a
  point. That is a content decision, not a component one, and this loop does not
  make content decisions.

**Row 3, closed 2026-08-22. Kept, and the picture made to agree with its own figures.**

The library answers nothing here either: two markers on a six-pixel track. No
axis, no ticks, no measurement, no many-points problem.

**The defect, and it was the worst kind.** The scale shows break-even as an
orange dot and a typical day as a black tick, and the gap between them is the
room the owner still has. The track's span was the LARGER of the two numbers,
while the typical-day tick was pinned to the right-hand end whatever the numbers
said. So when break-even sits ABOVE a typical day, which is precisely what an
unprofitable trade looks like, the right end became the BREAK-EVEN value and the
tick sitting on it still read "a typical day". **The picture drew a comfortable
cushion on exactly the trades that have none.** Measured: break-even 71 against a
typical 54 put the dot at 96% and the tick at 100%, dot to the LEFT of tick.

**The section already contradicted itself.** The two figure tiles directly below
read zero covers of headroom and 131% of a typical day. Both true. The drawing
above them said otherwise, and the drawing is the half a reader believes.

**A clamp made it worse.** The dot was squeezed into the range 4% to 96%, so
"you cannot break even on an ordinary day" was drawn as "you are nearly there".

**Fixed by positioning both markers from the same span and deleting the clamp.**
The healthy case renders byte-identically, checked at three widths. The
underwater case now puts the tick at 76% and the dot at the end, which reads
correctly. No printed word or figure changed anywhere.

**One raw hex retired**, the track grey, which was a duplicate of a constant the
same file already imports. Identical value, zero visual change. **One left in
place on purpose:** the ring around the dot has no matching token, and swapping
it for the nearest one would change a colour. Mixing a colour change into an
honesty fix makes neither of them falsifiable.

**Adversarial pass.** Removing the clamp lets a marker sit at either end of the
track, where half of it hangs past the edge, so anything clipping would eat half
a dot. Checked the whole ancestor chain: nothing clips, and the card's padding
holds it. The only clipping element on that card is the tile grid below, which
is a sibling.

**A near miss worth recording.** The typical-day figure falls back to the
break-even figure when it is missing, which would print an invented number and
an invented right end. It cannot happen: both numbers come from the same
calculation, so when one is absent the other is too and the whole section is
omitted. Checked rather than assumed, and the fallback is still a loaded gun if
that calculation is ever split.

**Row 4, closed 2026-08-22. THE BARS WERE NOT BEING DRAWN AT ALL.**

The biggest thing found so far, and nothing on this site could see it. The card
shows the three largest setup costs as bars on a shared track, so a reader can
see that the fit-out dwarfs everything under it. **The track and the two smaller
bars have been painting nothing.**

They ask for two greys that are declared ONLY inside the v2 stylesheet's scope,
every selector of which sits under a single class, with no root block anywhere in
that file. This page never enters that scope: the live spine tree does not carry
that class on one element. An undefined custom property makes the whole
declaration invalid, and an invalid background computes to transparent. Read out
of a real browser rather than reasoned about: **rgba(0, 0, 0, 0)** for the track
and both neutral bars.

Only the largest bar survived, because its terracotta is declared a second time
at the page root by the shell. **So a visitor saw one orange bar floating in
white space, on a drawing whose whole point is what it dwarfs.**

**Why no check caught it.** The typecheck cannot see CSS. The raw-hex gate is
happy, because these were tokens, and they were the RIGHT tokens for the
stylesheet they were written against. The palette gate is happy for the same
reason. Every automated check on this repo passes on a bar that does not exist.
It took rendering the thing and asking the browser what colour it had actually
painted.

**The fix keeps the intent exactly.** The neutral is the same value the missing
token held. The track moves by a hair and now matches the break-even track on the
card beside it, which it never did.

**Only two uses of that scoped family existed in the live tree, both on this
card. Both are gone.** The city page family carries several more and is a
different set of rows.

**Adversarial pass, and it found something worth stating.** A grey bar on a grey
track is 2.25 to 1 against the 3 to 1 floor for a meaningful graphic. The value
as originally intended was WORSE at 2.09 to 1, so this is an improvement and
still short. **Not fixed here on purpose:** darkening the bar is a design change,
and mixing one into a repair makes neither falsifiable. Every bar prints its
money figure beside it, so the bar is not the only carrier. Recorded for the
founder.

## 2. INDUSTRY PAGE, opened 2026-08-22

**FOUR OF ITS SECTIONS REACH NO READER**, found by pointing the same instrument
at it that found five dead sections on the cell page. The live adapter names them
in its own source as omitted for want of an honest source: **Payback window, When
a day starts paying, Getting to break-even, and Across the year.** Marked blocked
so no iteration is spent on a page nobody sees. The remaining nine sections are
live.

**Row 31 is VOID: it was a duplicate of row 20.** The industry page carries
fourteen section headings and none of them is a "subtype drill". Row 20, "keep and
cost, trades next door", IS that component; the ledger listed the same surface
twice, once by its reader-facing heading and once by its internal name. Recorded
rather than quietly deleted, so the count of rows stays honest.

**Row 32, closed 2026-08-22. Kept. A band that failed the rule written in its own
comment.**

The section restates the kept figure on the left and offers the one next step on
the right. Its own comment states the rule: **one full-width band, both flanks
carrying content, never a lockup huddled left over a blank right.**

**The recap on the left is OPTIONAL**, and its guard drops it whenever the trade
carries no kept figure. With it gone, the row's spacing rule had a single child to
space and put it at the start, so the band delivered exactly what its comment
forbids: a lone call to action on the left, an empty right. Rendered without the
recap to confirm it rather than reasoning about it. With no recap that block now
spans the row and pushes its own two halves apart. **With the recap present
nothing moves at all.**

**Fourth appearance of a container that splits before it knows what it has to put
in both halves**, after the masthead scorecard, the customer-spend band and the
who-it-suits columns. It is the most repeated structural fault in this loop.

**A SITE-WIDE FINDING, recorded and NOT acted on, because only the founder can
settle it.** The button here turns terracotta on hover. The cell page carries a
comment quoting a ratified ruling: *"the accent never appears on hover"*. **Ten
reader-facing controls across the site use terracotta on hover, including two on
the cell page itself, eleven lines from where that rule is quoted.** Either the
rule means what it literally says and is broken in ten places, or its scope was
the decorative row motif it was written about and not interactive controls. Both
readings are defensible from the text. **Not a row-32 question, and not one to
guess at.**

**The gate chain crashed four gates on this run** with Windows process-abort
codes, one of them printing its own all-clear before dying, at 0.88GB of free
memory. All four pass when run alone. This is the documented flakiness of this
machine, not a code failure, and it is why the serial chain exists.

**Row 30, closed 2026-08-22. THE LIBRARY WINS A THIRD TIME, same defect again.**

Cities down the side, one measure across the top, a header row drawn to look like
one, and **nothing underneath it**: zero table elements, so the words naming the
column were never attached to the figures they name. A screen reader got a city,
a number, a city, a number. Rebuilt on the library's table primitive: **0 to 17**
table elements.

**Three sections have now had exactly this fault**, and the table primitive has
answered all three. It is the only defect in twenty-six rows the library has been
the right answer for, and it has been the right answer every time it appeared.

**Two smaller things went with it.** The figure column was pinned at four and a
half rem, which on a phone spent a third of the row on a two-character number; it
sizes itself now. And **two written-out text sizes joined the ladder**, so the
ratchet moved DOWN again, 416 to 414.

**A BEHAVIOUR CHANGE, stated because it is one.** The link moved from the whole
row to the city name and its arrow, because a row cannot be wrapped in a link
inside a table. **One row in this list carries a link.** The row still lights on
hover, so it still reads as reachable: the hover rule and the one that would
cancel it have equal weight, and the page's own style is written after the
framework's, so the page's wins. Reasoned rather than tested, because a still
photograph cannot show a hover.

**ONE ADDED STRING, flagged:** a screen-reader-only caption. Third time; same call
as rows 10 and 20, and reversible.

Every visible word and figure identical, checked node by node and at two widths.

**Row 29, closed 2026-08-22. Kept. A crossed-out claim that came out over six
lines of one word each.**

**THE DEFECT, and it is the worst-looking one this loop has found.** Each row puts
a piece of folklore, struck through, beside the real figure that kills it. The
claim sat in a flexible column next to one sized to its own contents, and the
block on the right carries a long line of explanation. On a phone that left the
claim about **seventy pixels**, and the claim is a sentence. Photographed at 320:
**"a fat / gross / margin / means / good / profit"**, six lines of one or two
words, struck through. It reads as broken markup rather than as folklore being
crossed out.

At full width it reads perfectly, which is why it survived.

**Fixed with a row that wraps rather than two columns that cannot.** The claim asks
for a sensible width and the pair wraps when it cannot have it, so on a phone the
struck line takes the full row and the figure sits under it. **No breakpoint:** it
wraps when it must, at whatever width that turns out to be. Nothing moves at full
width, checked.

**A CHANGE I MADE AND THEN UNDID.** I moved the figure from a literal twenty
pixels to a smaller named step, on the assumption that twenty was drift. It is
not: twenty IS a step on the ladder, the one named for a section heading. The
ratchet said so by refusing to move when I removed the literal. Restored to the
same value, now written as its token, so the size is unchanged and the literal is
gone. **Nearly shipped a visual change for no reason.**

**Recorded, not touched: this section asserts folklore nobody is shown to hold.**
Both struck claims are hard-coded sentences printed on every trade, whatever the
trade. "Most fail within a year" is a real belief about restaurants; whether it is
a belief about dental practices is a claim in itself. That is a content question
and belongs to the founder.

**And a third copy of the bullet markup**, after the two found in row 28, again
with the same raw colour value. Same shared-primitive pass.

**Row 28, closed 2026-08-22. Kept. The half-empty band again, reached from the
other direction.**

**A LEDGER CORRECTION FIRST.** This row was recorded as "meters". It is not: it is
two columns of bullets, suits on the left and think twice on the right. The label
was written from the design map rather than from the code.

**THE DEFECT.** The card fills its two sides from two different facts about the
trade, and **it runs when EITHER one is present**. So a trade with something to
watch out for and no stated edge, or the reverse, got a full-width band with its
one list wrapping inside the left half and the right half empty. Rendered the
one-sided shape to confirm it, rather than reasoning about it.

**This is the same fault the customer-spend band had in row 21, arrived at from
the opposite direction:** there the second figure was missing upstream and always
will be; here either side can be missing depending on the trade. **Third
appearance of a container that splits before it knows it has anything to put in
both halves**, after the masthead scorecard's empty grid cell.

It splits only when there are two columns of content now. Both-sided shapes render
identically, checked at two widths and byte for byte.

**THREE THINGS FOUND AND DELIBERATELY NOT TOUCHED, all belonging to a
shared-primitive pass rather than to one row:**
1. The bullet primitive carries a **raw colour value** and is used on **four
   reader-facing surfaces**. Swapping it is a four-surface change, which is not a
   thing to do inside a one-surface iteration.
2. **The component's own comment and its code disagree about the accent.** The
   comment says terracotta lives on the "suits" dots. In the code the dots are
   grey and the accent is on the column heading. One of the two is wrong and only
   the founder can say which.
3. The "think twice" list is a **hand-inlined near-copy** of the bullet primitive
   with a hollow dot instead of a filled one. The difference may well be
   deliberate; the duplication is not obviously so.

**Row 27, closed 2026-08-22. NOTHING WAS WRONG WITH IT. No change made.**

The first section in twenty-three rows to come through clean, and it is recorded
with the same evidence a change would need.

**What was checked and what it found.** No raw colour values in the section, only
the card surface it sits on. No text size off the ladder: every one a named step.
No text hidden behind a hover. **No breakpoint rules at all**, so nothing is
pitched at a width no phone reaches. Rendered at 320, 480 and 760 in both the
shapes it can take, and legible in all six.

**And it already gets right the fault that has appeared twice elsewhere in this
loop:** the column count follows the number of facts, so when the live page drops
the third one, as it does, the strip becomes two columns rather than three with a
hole in it.

**The library was not pulled again.** The stats family was examined in row 16: the
blocks are section-wide bands carrying their own heading, which cannot sit inside a
card that already has one. Same conclusion, not re-litigated.

**A nit I claimed and then withdrew.** I expected the three-fact shape to wrap its
middle label at phone width. It does not; all three fit on one line at 320. The
point of photographing a thing is that it can contradict you, and it did.

The only edit to source is an export added so the section can be captured. No
reader-visible change of any kind.

**Row 22, closed 2026-08-22. Kept. The same fault as the other survival curve,
and a trade-off I introduced and am not hiding.**

**A HYPOTHESIS THAT WAS WRONG, checked before acting on it.** The curve draws
itself in with an animation, and the reading printed at its end follows the draw.
If the draw started at zero, the static render would show "100%" and no line at
all. It does not: the hook that drives it returns a finished state unconditionally,
so the server render is complete. Read the hook before believing the chart.

**THE REAL DEFECT: the whole drawing scaled with the card, text and all.** One
fixed 320-unit picture given the card's full width with no height of its own, so
it scaled uniformly to whatever it landed in. The axis marks are set at eight and
a half units: in a half-band they render near ten pixels, **on a phone card near
six**. The same labels, three sizes apart, for no reason a reader could name.
Photographed at 320, the before is barely legible.

Rebuilt the way the trade-in-a-place survival curve was in row 13: the drawing
holds the PATHS ONLY and stretches, every readable thing is real text laid over
it, and the line keeps a true thickness at any width. **Seven raw colour values
retired**, including a warm grey on a palette whose rule is terracotta plus
strictly cool neutrals.

**THE TRADE-OFF I INTRODUCED, stated rather than buried.** Pinning the height
while the width flexes means **the curve's slope now depends on the card width**:
on a wide band it reads flatter than it used to. The old version held one aspect
ratio at every size, which was the one thing it did right. What it bought with
that was text three sizes apart. The values are printed on the chart, on the
gridlines and at the end, so the shape is supporting rather than the only carrier,
and this is the same trade every responsive chart makes, including the one on the
cell page after row 13. **If the founder wants the aspect held instead, that is a
one-line reversal and the cost comes straight back.**

**Recorded, not changed: the two survival charts disagree about the accent.** This
one draws the whole curve and its fill in terracotta; the cell page's draws the
line in grey and puts the accent on a single node, with a written reason. Changing
an accent policy is a design decision.

Every word and figure byte for byte identical. Ladder held at 416.

**Row 21, closed 2026-08-22. Kept. A band that split itself in half for one
figure.**

**KEPT.** Two figures and two labels. Nothing to measure, no chart at all.

**THE DEFECT: A DIVIDING RULE DRAWN DOWN THE MIDDLE OF NOTHING.** The section is
designed for two figures side by side, spend per head and visits a year. **The
live adapter supplies only the first**; the visits figure is deliberately left out
upstream for want of an honest source, and says so in its own comment. The band
split into two halves regardless, so on every real trade page a reader got one
figure in the left half of a full-width band, the right half empty, and a rule
drawn between them. Verified by rendering the section twice, once with the
workshop shape and once with the shape the adapter actually returns. It splits
only when there are two figures to split now.

**THE FOCAL FIGURE WAS OFF THE LADDER at forty pixels.** This site's ladder has a
step for a section's own focal figure and a larger one reserved for the single
dominant figure of a whole page, and nothing between. This page's dominant figure
already sits on that larger step, so forty was drift between two named sizes. It
is on the section step now, which is **visibly smaller** and is the honest
consequence of putting it on the ladder. Say so to the founder rather than hide
it. **The ratchet moved DOWN, 417 to 416.**

**A second forty-pixel figure exists on this page**, in another section. Left
alone: it is a different row.

Every word and figure byte for byte identical, in both the live and the workshop
shape. Gate chain clean.

**Row 20, closed 2026-08-22. THE LIBRARY WINS FOR THE SECOND TIME, same reason
as the first.**

Trades down the side, two measures across the top, a header row. **Zero table
elements.** No column headers, nothing tying a figure to the word naming it, so
the whole reading was a trade name followed by two bare numbers.

**Worse than the comparison table on the trade-in-a-place page**, which at least
carried a hidden label beside each figure for its phone layout. **This one had
none, at any width.**

Rebuilt on the library's table primitive, the same one row 10 used: 0 table
elements to 21. Real column headers, a real row header per trade.

**The two figure columns also carried fixed widths that changed at a
breakpoint.** They size to their own contents now, which needs no breakpoint and
cannot crush a longer figure. At phone width that is visibly BETTER than before,
not merely equal: the trade names get the room the fixed columns were holding, so
"Full-service casual dining" wraps to two lines instead of three.

**ONE ADDED STRING, flagged:** a screen-reader-only caption naming what the table
is and how it is sorted. No visible text. Same call as row 10 and reversible.

No figure changed. The width ratchet held at 54. Gate chain clean.

**Row 19, closed 2026-08-22. Kept. A well-built stack with one way out.**

**This one is built better than its cousin on the trade-in-a-place page.** The
last stage is the residual of the other three, so the four parts add to exactly a
hundred and rounding cannot escape. Nothing to fix there.

**What CAN escape is a floor.** Every stage is clamped at zero, and measured
margins are under no obligation to arrive in textbook order. Nothing upstream
promises they will: three margins are read independently and rounded
independently. Run the real arithmetic on a ladder whose net sits above its
operating figure and **the four parts total 107**; above its gross figure and they
total **135**.

**And the bar hides it.** It is a flexible row, so it squeezes itself back inside
its own track and looks perfectly fine, while the percentages printed beside it
add to a third more than the hundred dollars the section is about. Rendered and
photographed: the legend reads **52% + 40% + 0% + 15%** under a heading that says
where each $100 goes.

It refuses to draw now. **The tolerance is ONE point, not the four the cell page
uses, and the difference is deliberate:** that stack rounds each slice on its own
and drifts by about a point in ordinary use, while this one is exact by
construction, so anything off here means a floor fired and the ladder is
genuinely inconsistent.

**No normalising here, and that is the point.** Normalising would rescale the 107
back to a hundred and hide exactly the thing worth surfacing. The two sections
look alike and needed opposite treatments.

**A duplicated grey ramp retired:** five values written out again, identical to
the ramp the shared kit already declares, free to drift apart unnoticed. And one
raw ink value tokenised.

**Healthy ladder renders byte for byte identically.** Gate chain clean.

**Row 18, closed 2026-08-22. Kept. Three faults on one row.**

**1. THE SCALE HAD FIFTY-EIGHT PIXELS ON A PHONE.** A name column nailed at 110
and a figure column nailed at 40 leave the drawing almost nothing on a 320 screen,
and the four dots sat so close together that a trade keeping **three times** what
another keeps looked the same as it. The comparison the section exists to make was
not visible on the width most readers use. **Third time this exact fixed-column
fault has appeared**, after the pay brackets and the risk scale.

**2. TRADE NAMES WERE CUT OFF AND THE REST PUT IN A TOOLTIP.** That is not a
carrier on a touch screen: there is no hover, so the end of a trade name simply
did not exist for the reader most likely to be holding a phone. Four of them.
Names wrap now and the tooltips are gone with the need for them.

**3. THE DOTS WERE A WARM GREY**, on a palette whose rule is terracotta plus
strictly cool neutrals. Replaced by the cool neutral of the same weight, which is
also a token rather than a literal. Five raw colour values retired in total.

Identical at 760, transformed at 320. Every word and figure byte for byte
identical. The width ratchet held at 54: the fix adds no breakpoint the gate
counts.

---

**Row 16, closed 2026-08-22. Two of the three readings in the page's own
scorecard were unreadable, and it took FOUR attempts to fix properly.**

**THE DEFECT.** Three fixed columns with no width rule at all, inside a box that
hides its overflow. **"Demanding" printed as "Deman" and the count of firms
already trading here was cut off at its right edge.** The box swallowed the
evidence, so nothing looked broken; the words were simply shorter than they
should have been.

**A stats block was pulled and read.** Its grid stacks below a breakpoint and only
then goes three across, which is the right convention. The block itself is a
section-wide band with its own heading and does not belong inside a masthead, so
**the convention was taken and the block declined.**

**FOUR ATTEMPTS, each one exposed by looking at the next width.**
1. Stacked them below a breakpoint. Fixed the phone. **Photographed at 900 and
   the same word still clipped**, because above the wide breakpoint the row splits
   one and a half to one and hands three tiles about 270 pixels between them.
2. Sized the tile column to its contents instead of a share of the row. Fixed
   both ends. **The width gate then failed the build**: the repo already carries
   54 grids whose second layout is pitched at a width no phone reaches and it
   refuses a 55th. It is right to. Not raised.
3. Replaced the breakpoint with a self-wrapping grid. **Photographed at 480 and
   found a hole**: three tiles fitted two across and the third sat in one cell of
   a two-cell row with the empty half showing the hairline colour through it.
4. A wrapping ROW, whose tiles size to their own contents. A row has no cells to
   leave empty. A fixed minimum width is wrong in both directions at once: big
   enough to protect the word on a half card and it forces a wrap on a full one;
   small enough to keep three across on a full card and it crushes the word
   again. **Sized to their contents they wrap exactly when they must, with no
   number in the stylesheet to get wrong.**

**Verified at 320, 480, 768 and 900, and against the widest content this
scorecard can ever hold**: the longest of its three fixed words and a
seven-figure count of firms, both rendered in full with room to spare.

**No breakpoint was added.** The width ratchet held at 54 and the fixed-width
count moved DOWN, 230 to 229. Every word and figure is byte for byte identical.

**Row 15, closed 2026-08-22. THE OPEN WOUND IS CLOSED, and the answer was that
the mark was being thrown away.**

This row sat open because I could not tell whether the two ends of the turnover
band were measured or invented. **Both, depending on the page.** There are two
paths. One reads the cell's own stored percentiles. The other multiplies the
typical figure by fixed constants, so it draws **the same shape for a restaurant,
a barbershop and a dental practice**, and it is the path London takes.

**The data already knew which was which.** The ruling on invented bands is
explicit: an unmarked band is a claim about spread the figures behind it do not
support. The mark was set correctly at the source and then **discarded one layer
above the strip**, so it never reached the thing that needed it.

It arrives now. The strip prints no percentile words, so nothing a reader SEES
changes; the description read aloud says **"Modelled range from ... to ..."**
instead of stating the range as fact, in the same words the site's other band
component already uses. **The default is modelled**, so a caller that forgets
understates its confidence rather than overstating it.

**A branch that drew on no page at all.** The strip carried a second mode running
its track from grey into the accent colour. It has exactly one caller, that caller
always asked for the plain track, so the accent branch was dead code that also
broke the colour rule the risk scale broke. Retired.

**The three figures under the track** were pushed to the two ends with nothing
stopping them meeting on a narrow masthead. They wrap now. Two raw colours went,
and the track is the same grey as every other track on the page, which it was not.

**Every visible word and figure is byte for byte identical.**

**FOUND WHILE HERE, NOT TOUCHED, and moved to row 16:** the three scorecard tiles
under the headline **clip at phone width**. "Demand" prints as "Deman" and the
firm count is cut off at the right edge. Present in both halves, so it is not a
regression, and it belongs to the next row.

**Row 13, closed 2026-08-22. Kept. A chart that refused to grow, and clipped its
own figures when it shrank.**

**KEPT.** Three points and a line. No axis machinery, nothing to measure.

**THE DEFECT, and it is the opposite of the year chart's.** This was one fixed
320-unit drawing given the card's full width with its height pinned and its shape
**locked**. A locked shape does not stretch, it scales to FIT, and with the height
already at its limit it never scales at all. So past about 320 pixels the chart
drew at its native size and **sat in the middle of the card with blank space on
both sides**, a half-width drawing in a full-width band. Below 320 it shrank
everything together, and at phone width the first reading **clipped from "74%" to
"4%"** against the edge of its own box.

**Unlocking the shape alone would have repeated the year chart's fault**, where
every letter got stretched sideways. So the drawing now holds the PATHS ONLY and
stretches freely, and every readable thing, the three readings, the year names,
and the struck folklore words, is real text laid over it. The line keeps a true
thickness while the box stretches. The horizontal scale is the only one that
moves, so a percentage puts a mark exactly on its path point, and the two heights
come from one constant so they cannot drift apart.

**Caught by photographing the fix, not by writing it:** once the chart filled the
card, the first and last readings hung half outside it and one year name wrapped
onto two lines. The end labels now anchor inward, the same rule the break-even
marker and the risk scale already use. **Third time that fault has appeared in
this loop.**

**Seven raw colour values retired.** The text is byte for byte identical.
Fills the card at 760, legible at 320, gate chain clean.

**Row 12, closed 2026-08-22. Kept. Three faults, one of them a rule this site
wrote down and then broke.**

**KEPT.** A dot on a track. No axis, no scale, nothing to measure.

**1. THE TRACK FADED INTO THE ACCENT.** Every scale ran a gradient from grey into
a pale terracotta at the safe end. That breaks the site's one hard colour rule
twice: **the accent marks the answer and nothing else**, and decoration never
sits on top of data. It also restated what the two words underneath already say.
And it could not even be seen: the fade's two ends measure **1.01 to 1** against
each other, where 3 to 1 is the floor for a graphic that carries meaning. It was
a rule broken in exchange for nothing. Five gradients in the render, four gone;
the one left is the card's own surface.

**2. THE END LABELS COLLIDED ON A PHONE.** Caught by photographing it at 320:
"RISKIER" and "SAFER" printed as **RISKIERSAFER**, jammed together with no gap,
because the name column was a fixed 150 pixels and left the scale almost nothing.
The column is fluid below the breakpoint now and the two words separate.

**3. THE VALUE ABOVE EACH MARKER WAS CENTRED ON IT**, so a reading at either end
pushed half the label outside the card. A reading of 10 puts the marker at the
far right, which real data can produce. Anchored away from the ends, the same fix
as the break-even marker two rows up.

**Two stray colours retired** with the gradient. **The text is byte for byte
identical**, checked node by node.

**Scope checked before touching the shared piece:** the scale is used in three
places and the other two are workshop routes, so exactly one reader surface moves.

**Row 11, closed 2026-08-22. Kept. The spread was invisible on a phone.**

**The nearest thing in the catalogue was pulled and read**, a chart plotting one
series over months against a fixed target band. That answers "how did we do
against target", not "what is the range from lowest to highest pay for this
role". Different question, different shape, and it arrives with a card heading
and a hover tooltip. Examined, not suitable.

**KEPT.** Four absolutely placed marks in a row: no axis, no scale, nothing to
measure, and it renders on the server.

**THE DEFECT, found by photographing it at phone width.** The row gave a fixed
120 pixels to the role name and 56 to the figure. On a 320 screen that leaves the
drawing **forty pixels**, and it drew as a dot. The one thing this card exists to
show, how far pay stretches from the lowest to the highest for each role, was not
shown at all on the width most readers use. Below the breakpoint the bracket now
takes its own full-width line under the role and its figure. Above it, nothing
moves: the two render identically at 760.

**Four raw greys retired** for the token this project already uses for a neutral
mark, four values apart in a single channel. **Five text sizes put on the ladder**,
and the ratchet moved DOWN again, 419 to 417.

**The text is byte for byte identical**, checked by comparing the two renders node
by node rather than by eye.

**Adversarial pass.** The phone layout reorders the row with a layout rule, which
changes the order a screen reader reads relative to what is seen. Counted the
focusable elements in the section: **zero**, so nothing can affect tab order, and
the spoken sequence stays coherent either way.

**TWO THINGS DELIBERATELY LEFT, both the founder's call because both change what
a reader reads:**

1. **NINE FIGURES ON THIS CARD CANNOT BE READ BY ANYONE LOOKING AT IT.** Every
   bracket has a low end and a high end. Neither is printed. They exist only in
   the description a screen reader hears, and the scale carries no numbers, so a
   sighted reader cannot recover a single one of them. Counted, not estimated:
   fourteen figures are spoken, five are printed, **nine are spoken only**.
2. **Three figures are printed twice on the same card.** The block at the top
   takes the first three roles and the rows below take all five, so three mid
   figures appear in both. Eight money figures are printed and only five are
   distinct.

**Also recorded: this section appears on London pages only.** Off London the
figure source returns nothing and the whole card omits itself.

**Row 10, closed 2026-08-22. THE FIRST ROW WHERE THE LIBRARY GENUINELY WON.**

The section puts places down the side and metrics across the top, with a header
row, click-to-sort, and a sort-direction attribute. **It was a grid of plain
boxes with not one table element in it.** Measured before touching anything:

| | before | after |
|---|---|---|
| table, head, body, header-cell, cell elements | **0** | 28 |
| sort-direction attributes sitting on a button, where the attribute is discarded | **4 of 4** | 0 of 4 |
| column labels that disappear above 640 pixels | 16 | 16 |

**Why that last row is the defect.** Every figure carries a small label naming
its column, and that label is hidden on anything wider than a phone, because on a
wide screen the column header is supposed to do the naming. There was no column
header, only a box drawn to look like one. So the desktop reading was a place
name and then four bare numbers: **"Birmingham, $340K, $39K, 11.5c, 5"**, with
nothing saying which was which. **The phone reading was better than the desktop
one.**

**Rebuilt on the library's own table primitive**, which was already installed and
unused here. Real column headers, a real row header per place, the sort state on
the header that announces it. The small labels stay for the phone layout, and
above it the structure carries the meaning.

**Proved by rendering both, not by reproducing either.** The before is the shipped
component's own server render, captured before the change. The after is the new
one's. The styling is the project's real compiled output for exactly those two
renders. **They are visually indistinguishable at 320, 645 and 760 pixels.**

**An instrument fault, found and fixed mid-iteration.** The first sheet laid the
three widths out as fixed-width columns inside one wide page. This section's phone
layout is a media query on the VIEWPORT, so all three columns rendered as desktop
and the stacked phone layout was invisible. Every earlier sheet in this loop
tested container-relative CSS, where the two are equivalent; this one is not. The
sheet is now one full-width column photographed at three viewport widths.

**One visual regression I introduced and caught by looking:** the place names
shrank a step. Restored to body size, re-rendered, re-photographed.

**ONE ADDED STRING, flagged rather than slipped through.** The table now carries a
screen-reader-only caption naming what it is and how it is sorted. It adds no
visible text and it is the correct element for a table, but it is an addition and
the founder may reverse it.

**The ratchet moved DOWN again, 420 to 419**, because two off-ladder sizes went
with the rewrite.

**Also recorded: the table-semantics gate is blind to this whole class.** It only
inspects files that contain a table element, so a grid of boxes impersonating a
table is invisible to it, and it reported a clean pass on this file for months.

**Row 9, closed 2026-08-22. Kept. It reaches one trade in 138, and it raises a
question only the founder can answer.**

The library answers nothing: three blocks in a row and a dot. No axis, no scale
beyond a straight line, nothing to measure.

**REACH, measured.** The bar needs a ramp-to-break-even figure, and exactly ONE
trade carries one. The guard that produces it deliberately refuses to borrow that
figure across trades, which is correct, so on the other 137 the section omits
itself entirely. Nobody is being misled. Almost nobody is being served either.

**THE QUESTION, and this loop must not answer it.** The figure is named "ramp to
break-even, months" and reads 6. The drawing counts those six months from week
ZERO, which is the day the lease is signed, and the modelled time to open is 16
weeks. So the picture gives the trade **ten weeks of actual trading** before it
breaks even.

Either the field means "from signing", in which case the drawing is right and the
field is badly named, or it means "from opening", in which case break-even belongs
at week 42 and **the chart is sixteen weeks optimistic**. Nothing in this
repository settles it. Guessing would be fabricating a figure, so it is written
down and left.

**WHAT WAS FIXED: a fault that could not fire yet.** The break-even marker lived
inside the track, and the track hides its overflow so its ends stay rounded. A
marker is centred on its position, so at either extreme half of it was eaten by
the rounding it shared a box with. It reaches an extreme whenever break-even
lands at or past the end of the horizon: any ramp of a year or more. The one
trade that has a ramp puts the marker at the halfway mark, so **it cannot fire
today, and it would fire the day a slower trade gets a figure**, which is the only
day anyone would have seen it.

The marker now sits outside the clipping box. **Today's case renders identically
at all three widths**, which is the proof that nothing a reader currently sees
changed.

**Row 8, closed 2026-08-22. The year chart was being stretched sideways.**

**THE PAID BLOCK WAS PULLED AND READ, for the first time in this loop.** The
closest candidate is a vertical bar chart in a card. It is built on the same
charting library this repo already installed, so it offers no new capability, and
after refusing what it ships switched on, the rounded tops, the hover tooltip
carrying the values, the axis ticks, the card heading duplicating the section
heading above it, and the accent colour on every single month against the rule
that no month may ever be featured, nothing of it would have remained. Recorded
as examined, not assumed.

**The defect.** The chart was a fixed three-hundred-unit picture given the card's
full width, with its height pinned and its aspect ratio deliberately unlocked. So
it scaled HORIZONTALLY ONLY. Every letter in it, the month initials, the axis
mark, the two values, was 1.07 times too wide in a phone column and **2.53 times
too wide in a full band**, against no vertical change at all. Not merely resized:
the wrong shape.

**Rebuilt in layout instead**, so the bars stretch and the text does not move. It
stays on the server with no JavaScript, which the charting library could not have
done. Four raw hex values retired with it.

**Three faults in my own rebuild, each caught by a different check.**
1. A fixed pixel gap between columns looked right on a phone and turned the wide
   band into a solid block of bars. Caught by photographing it. The columns now
   hold the same 64% proportion the old drawing used.
2. The axis mark and its dashed rule were positioned from two different boxes and
   sat about eighteen pixels apart, an axis label pointing at nothing. Caught by
   the adversarial pass. Both now share one offset and cannot drift.
3. **The type ladder ratchet failed the build.** The old sizes lived inside a
   scaled picture, so eight units there was not eight pixels on screen; as real
   text they were three sizes below the ladder floor. Not raised. All three moved
   onto the ladder's smallest step, which also made a stray size on a workshop
   route visible and fixed. **The ratchet moved DOWN, 421 to 420, and is locked
   there.**

**One string changed, flagged rather than slipped through.** The description read
by a screen reader used to name the peak month only, through a hard-coded test for
December that read "the peak month" for every other cell. It now states the
busiest and quietest readings, both of which are printed on the chart already. No
visible word or figure moved.

**Rows 5, 6, 7, 14 and 17, closed 2026-08-22. FIVE SECTIONS REACH NO READER.**

Row 5 was the surface of this iteration, and researching it turned up something
larger. **A third of the trade page does not exist for a visitor.**

**How this was established, by rendering rather than reading.** The page body was
rendered twice from the same component: once with the workshop data, once with
the shape the live adapter actually returns. The live adapter leaves four keys
undefined, on purpose, each with a written reason in its own source, and each one
gates a whole section. Compared by section heading, which is what a reader
actually sees:

| section | a visitor gets it |
|---|---|
| Who this suits | **no** |
| When the week fills up | **no** |
| Who comes in, and how | **no** |
| Related trades in this place | **no** |
| The size and format switch | **no** |

**The page that ships is 31% smaller than the page the design describes.**

**A CORRECTION TO THIS LEDGER.** Row 7 was recorded last iteration as kept with
evidence, on the assumption it was a live reader surface. **It is not.** The
component judgement stands, and the claim that a visitor sees it was wrong. This
is exactly the failure the ledger is supposed to prevent, so it is corrected in
place rather than quietly.

**Nothing is broken and nothing should be deleted.** These are ratified sections,
correctly written, correctly self-omitting when their data is absent, which is
the behaviour this codebase asks for. What is missing is upstream.

**And nothing should be invented to fill them.** "Who this suits" wants a low,
middle or high reading on four demands of the owner. The nearest data on hand is
a list of sentences about who the trade suits. Turning sentences into positions
on a scale is fabricating figures, which is a hard stop. The adapter's own source
already flags this trade-off and declines it, correctly.

**One consequence worth holding.** The size and format switch is one of the five.
The money waterfall follows that switch and the hundred-dollar bar does not, so
the day it is wired, two sections on this page will disagree about the same
split. Recorded twice now, under rows 1 and 17.

**Row 15 is the open wound.**

Three separate percentile fans exist across the
site, each inventing a different spread from the same kind of figure, and one of
them was drawn on a logarithmic axis while labelled like a linear one. The axis
and the default were corrected on 2026-08-21. **What has not been settled is
whether the p10 and p90 ends are measured or modelled on the cell masthead.** No
block fixes that. It is a data-honesty question and it outranks any component
swap on this page.

---

## 2. INDUSTRY PAGE (a trade across places)

| # | Section a visitor reads | Form today | Defect | Status |
|---|---|---|---|---|
| 18 | Kept per $100, by trade | dots on a shared scale | **VERIFIED, FIXED** | **DONE-KEPT** |
| 19 | Where each $100 goes | stacked bar, guarded | **VERIFIED, FIXED** | **DONE-KEPT** |
| 20 | Keep and cost, trades next door | **a real table** | **VERIFIED, FIXED** | **DONE-REPLACED** |
| 21 | What a customer spends | one or two figures | **VERIFIED, FIXED** | **DONE-KEPT** |
| 22 | Five-year survival | survival curve | **VERIFIED, FIXED** | **DONE-KEPT** |
| 23 | Payback window | phase bar | **NO DATA. Reaches no reader** | **BLOCKED** |
| 24 | When a day starts paying | two-marker scale | **NO DATA. Reaches no reader** | **BLOCKED** |
| 25 | Getting to break-even | phase bar | **NO DATA. Reaches no reader** | **BLOCKED** |
| 26 | Across the year | season ribbon | **NO DATA. Reaches no reader** | **BLOCKED** |
| 27 | The typical operator | fact strip | **NONE FOUND** | **DONE-KEPT** |
| 28 | Who it suits | two bullet columns | **VERIFIED, FIXED** | **DONE-KEPT** |
| 29 | What people get wrong | struck claim, real figure | **VERIFIED, FIXED** | **DONE-KEPT** |
| 30 | The rent, city by city | **a real table** | **VERIFIED, FIXED** | **DONE-REPLACED** |
| 31 | ~~The subtype drill~~ | **DUPLICATE of row 20** | not a surface | **VOID** |
| 32 | The close | recap plus one next step | **VERIFIED, FIXED** | **DONE-KEPT** |

---

## THE SIX SWEEPS, 2026-08-24: WHAT READING ONE SECTION AT A TIME COULD NOT SEE

The founder, away from his computer: *"continue on your own... optimization.
Look. Critic the pages. Try to understand mistakes. Overlapping. Idiotic mistakes
and so on."* Overlapping and cross-page faults are structurally invisible to this
loop, which reads one surface per iteration on purpose. Every cross-cutting thing
it has found was found BY ACCIDENT. Six sweeps, run against fifteen real pages
rendered through the real adapters: eight cities on four continents, three trade
pages, three trade-across-places pages, one neighbourhood page.

**FOUR OF THE SIX CARRY A CALIBRATION CASE**: pointed at a fault already confirmed
by hand, and if they miss it their zeroes mean nothing. All four passed.

**EVERY ONE OF THE SIX NEEDED ITS FIRST RESULT THROWN AWAY.** Four separate bugs in
my own instruments, in one session:

1. The figure sweep allowed a bare trailing comma, so "$100," counted as a
   different number from "$100".
2. The same sweep took its COUNT from a pattern and its EVIDENCE from a plain
   substring search, so "$8" was located inside "$180K" and it printed a
   quotation that had nothing to do with the figure it named. **A right count
   beside wrong evidence is worse than being wrong twice.**
3. The cross-page sweep grouped every trade page under "world" and reported three
   conflicts that were three different trades honestly differing. It had invented
   its own finding, against a ratified rule of this site.
4. The scale-end sweep asked whether a clamp appeared ANYWHERE IN THE FILE, so a
   `Math.max` three hundred lines away marked a scale as safe. It reported ONE
   file. The honest answer is FIFTEEN. **A sweep that reassures is worse than no
   sweep.**

**THE FIRST DRAFT OF A SWEEP IS ALWAYS TOO FORGIVING.** That now has four data
points and belongs in the standing notes.

### What they found

| sweep | result |
|---|---|
| sections that reach no reader | **23 of 48**, just under half the spine |
| chapter headings opening onto nothing | 4, all the closing chapter of a city page |
| the same figure printed twice on a page | 1 genuine: the pay ladder, twice, on every trade page |
| the same claim disagreeing across pages | 0, and 0 agreements: the pages never make the same claim twice |
| marks that can fall outside their box | 15 files, ~26 placements |
| drawings that stretch their own geometry | **0. That fault is finished.** |

**A CORRECTION I OWE.** One of the three sections the paid library was used on, the
rent city-by-city table on the trade-across-places page, is in the dead list.
Confirmed structurally: the module omits the one figure that section requires,
with "no honest source" written beside it, so it can never draw for any trade.
**The honest count of library wins a reader can see is TWO, not three**, and I have
been reporting three.

**THIRD TIME A DECISION MADE AGAINST THE BUNDLED SAMPLE IS WRONG AGAINST THE REAL
DATA.** The pay card repeats its three figures and a note defends the repeat:
"removing the repeat takes a figure off the page". The sample carries FIVE pay
roles, so on the sample that holds. **Every real cell carries exactly THREE**, so
the two blocks are identical and removing the top one takes nothing away. After
the peer strip's arithmetic and the spending pool's empty card, the pattern is
established: **the sample is not a small version of the real thing, it is a
different shape, and it is consistently the flattering one.**

### The triage, and what it saved

Every candidate was confirmed against the module that feeds it, because a title
absent from fifteen renders may be a sampling accident while a field the adapter
drops unconditionally is dropped for everyone.

**SIX ROWS CLOSED IN ONE BATCH, all genuine data gaps, all correctly
self-omitting:** 41 and 42 (the adapter omits cost-to-open with "no honest
source", and its own comment says this drops the section), 43 (risks omitted), 44
(character omitted), 45 (locals omitted), 51 (the neighbourhood adapter supplies
only two fields, districts and meta). **Six iterations that would have found
nothing.**

**ROW 46 IS NOT A DATA GAP. IT IS A BUG, AND THE SWEEP IS THE ONLY REASON IT WAS
FOUND.** The peer comparison table adds a row only when some peer carries a field
of a given name. The four calls pass DISPLAY keys, "rent", "spend", "income",
"vis". The data fields are `rent_index`, `spend_index`, `median_income_usd`,
`visitors_m`. **The check therefore never finds anything, no row is ever added,
and the component returns null before it draws.** Reproduced in isolation against
both shapes of data this site has: **it cannot render for ANY input, sample
included.** A fully written comparison table, four rows, four measures, that has
never once appeared on a page. Fixed in the next iteration, on its own commit.

**ROW 47 IS DOWNSTREAM OF IT.** The closing chapter holds that table and one other
card; on four of eight cities the other card omits too, so the chapter is a
heading above nothing. Fixing 46 may fix 47 on those four, which is checked there
and not assumed here.

**Row 40 is mislabelled** in this file as "month bars". It is a two-segment share
bar, and its two figures claim to sum to 100 with nothing checking that they do.
Fourth mislabel.

---

**Row 38b, 2026-08-23. NOTHING CHANGED, and the most useful thing in the iteration
is the edit I reverted.**

**What a visitor sees.** A card headed "Rent against income": one large figure,
"61% of a median income goes to a year of one-bed rent", and under a rule the two
figures it comes from, the monthly rent and the yearly income.

**It reaches no reader.** The module that builds a real city page drops the whole
cost-of-living block, reason written in: no honest source. **Checked on eight
cities across four continents, London included: it draws nothing on every one.**
Eleventh section this loop has found that reaches nobody. **KEPT, unchanged.**

**The library's nearest block would undo the best decision in this card.** The
catalogue holds a card of almost exactly this shape: a big figure, then labelled
rows with values. It puts a coloured dot beside each row, cycling a five-colour
ramp, and **the first colour in that ramp is this site's one accent.** That puts
the accent on "One-bed rent". This card's author deliberately took the accent OFF
it, on a written rule: **the accent marks the answer, and a cost is not an
answer.** Adopting the block would have to re-break that.

**A number a reader can check, that does not always survive checking. Recorded,
not fixed.** The third figure is worked out from the other two, so a reader can
verify it. Both printed figures are rounded and the percentage is computed from
the unrounded ones. **The rent carries an extra decimal on purpose** and the card's
own note says why: so the two sides reconcile. **The income beside it does not.**
Swept 2.96 million plausible pairs: **52.7% agree, 40.4% are out by a point, 5.2%
by two, 1.7% by three or more, worst case 9 points** (rent $1,151 shown as $1K
against income $12,411 shown as $12K: the card says 111%, the figures say 120%).
That is a low-income city, a shape this site covers. **Not fixed: the fix means
printing a figure differently, and this card prints to nobody.**

**THE EDIT THAT LOOKED FREE AND WAS NOT. This is the finding worth keeping.** The
one improvement in reach was moving the big percentage off Tailwind's size scale
onto the site's own ladder. **Both are thirty pixels, so it should have changed
nothing. Measured in a browser, the card grew nine pixels.** Tailwind's step also
sets a LINE HEIGHT; the ladder token sets a size only, so the swap left the line
height to inherit. Pairing it with a tight line height, which is what the only
other card on that ladder step does, makes the card six pixels SHORTER instead,
and makes this card's spacing differ from its neighbour in the same band. Neither
is neutral, and neither is worth it on a card no reader reaches. **Reverted; the
rendered card is byte-identical to how the iteration found it, and the reason is
written into the code where the next person will meet it.**

**That generalises, and it is why this row was worth an iteration.** **414 sizes
wait to be moved onto that ladder, and not one of them is a find and replace.**
The ratchet was left exactly where it was.

**Gates: 114 passed, 0 failed.** Typecheck clean. The only change in the source is
a comment.

**Row 38a, 2026-08-23. THE LABELS WERE NOT UNDER THEIR MARKS, and the error grew
with the card.**

**What a visitor sees.** Three incomes marked on one scale: the median, the top
tenth, the top hundredth. The gaps between them are enormous, so the scale
squeezes, which is right. Under it, three labels naming those three marks.

**The marks sat at their real places on that scale. The labels were spread evenly
across the row**, one at each end and one in the middle. Two different rules, so
they drifted further apart the wider the card got.

**Measured in a browser, not eyeballed.** The word "Median" and its figure sat **82
pixels** from the mark it names at phone width and **258 pixels** at reading width,
more than a third of the card. At that size a reader scanning left to right met
the Median label, then the Top 10% label, and only then the median's own mark.
Top 10% was out by 43, 71 and 119 pixels at the three widths. **All now zero.**

**The last label keeps a few pixels on purpose**: its mark is almost at the right
edge, so a label centred on it would hang off the card. **That fault, a mark or a
label centred at the very end of a scale with half of it outside the box, is now
the most repeated one this loop has found: four scales.** It is pinned inside the
edge instead.

**Second defect: the whole drawing grew with the card.** It was one fixed picture
stretched to whatever width it was given, so every part of it stretched. Measured:
**the marker dots went from a 2.5 pixel radius on a phone to 6.9 at reading
width**; the plot from 67 pixels tall to 182, for three ticks needing about fifty.
**The card was 301 pixels tall at reading width and is 172 now, and the 129 that
went was empty.** Positions are a proportion now; everything drawn is a fixed size.

**Third defect: four raw colour codes**, typed into the drawing instead of taken
from the palette, so they could not follow it anywhere. All four are palette
entries now. Three hex values remain in the rendered markup and none belongs to
this section: two are the card's own gradient and one is the accent's shared
constant.

**Fourth, found by asking what could break it.** The card admits itself on the
median alone and then needs all three figures to place its marks. A missing tail
figure falls back to zero, and on a logarithmic scale a zero is not a position, it
is negative infinity. **Checked across ten cities: exactly ONE, London, draws this
card at all**; the other nine hold no median and it omits. None reaches the broken
state. Unreached is not impossible, so it now draws nothing rather than a mark it
cannot place, or three marks out of order. **Fourth "correct by coincidence" this
week.**

**NOT A LIBRARY BLOCK, and the check is on the record.** The catalogue holds **141
items** matching a scale, a range or a gauge. The nearest by description, a
value-against-target chart, turned out on inspection to be **ten months of invented
revenue with a band across it**: wrong shape, and content that would be deleted on
arrival. Nothing in 3,968 blocks draws three labelled points on a squeezing scale.
Same call as the two other charts this loop rebuilt by hand, for the same reason.

**Reader text byte-identical on both the real page and the sample**, and the
description a screen reader hears is word for word the one that was there.
**Gates: 114 passed, 0 failed.** Typecheck clean.

**Row 39, 2026-08-23. THIRD MISLABEL, AND THE LEDGER WAS TWO SECTIONS SHORT.**

**What this row actually is.** Not a section: a chapter divider, like row 36. Its
chapter is built to hold FOUR cards, and **only two of them were ever written into
this file.** "What customers earn here" and "Rent against income" have been in the
page since it was built and have never had a row. They have numbers now, 38a and
38b, placed where they belong rather than appended, and **neither was touched this
iteration.**

**The divider's own guard is sound, and I can say exactly how narrowly.**
Rendered eight real cities and measured what follows each chapter heading:
this chapter carries between 67 and 132 characters on every one of them, so it
never opens onto nothing. But the guard passes on the presence of a *proxy field*
rather than on whether any card will draw, and it survives only because every city
happens to hold that field. **Correct by coincidence, not by construction. Third
of these now**, after row 35's crowding and row 38's neighbouring bar.

**What was wrong, measured.** The two right-hand cards sit in a container that
splits the row between them. **Both can leave, and the container was drawn
anyway.** On seven of the eight cities it ended the chapter holding nothing, and
the spacing above it still applied. Measured in a browser, not eyeballed: the
Tokyo chapter is **260 pixels tall before and 244 after** at phone width, **239 and
223** at both wider sizes. **Sixteen pixels of nothing, at every width.** London,
where one half does draw, measures identical to the pixel before and after.

**The fix is written as "hide me if I am empty" rather than as a list of
conditions**, on purpose: the two cards decide for themselves whether to draw, and
any condition restated on the container would be a copy of their guards, free to
drift from them. It cannot hide a container that has anything in it.

**MY OWN SHEET CANCELLED THE FIX IT WAS DRAWN TO SHOW.** The first draft tinted
the empty container pink to point at it. That tint outranked the fix, forced the
container back on in **both** cards, and the two then measured identically at 244
pixels, which I nearly reported as "no change". The tint is gone and the gap is
shown by the outline and the measured heights instead. **Fifth false measurement
this loop, and the first that would have hidden a real result rather than invented
one.**

**What the chapter actually contains on a real page, and it is thin.** The
spending pool: omitted everywhere (row 38). How seasonal it is: drawn. What
customers earn: **London only**. Rent against income: **nowhere, London
included.** So a heading promising who buys and when opens, on seven of eight
cities, onto a single small card showing what share of the town is visitors. **The
heading is authored copy and was not rewritten**, on the same reasoning as row
36's dead props: the words are a ratified choice and changing them is not this
loop's call.

**Gates: 114 passed, 0 failed.** Typecheck clean. Reader text byte-identical on
both cities; the only markup change is one rule.

**Row 38, 2026-08-23. A CARD THAT DREW ITS TITLE AND NOTHING ELSE, on every city
page checked.**

**What it is meant to be.** Two cards side by side: how much money is in the town
on the left, how much of it is residents against visitors on the right. The left
card carries a headline figure, dollars spent per resident a year, and under a
rule a second figure, how many millionaires live there.

**Neither figure has a source, so both are dropped before the page is built, and
the card was drawn anyway.** A reader got a bordered card containing the words
"The spending pool" and, underneath them, nothing at all.

**Counted, not asserted: eight cities across four continents, and all eight.**
London, Tokyo, New York, Sao Paulo, Berlin, Mumbai, Lagos, Sydney. Not one holds
either figure. The two fields are set unconditionally or not at all by the module
that builds the page, so a sample settles it.

**A heading is not content.** The card leaves when its figures do, which is what
every other card on this page already does. **The guard also gained the
millionaire count**, because a city holding only that figure used to lose it.

**Nothing else moved and the sample proves it:** that pair renders byte for byte
identical. Three words leave the real page, "The spending pool", and they are the
title of the box that was empty. No figure changed either way and nothing was
added. Photographed at four widths; the card beside it takes the row on its own.

**NOT REPLACED, and the library is the reason to say so out loud.** The catalogue
carries **29 stat cards** and the closest, pulled and read, does exactly this job:
a label, a big number, a percentage against last year. It ships **a green arrow
for up and a red one for down**, a card title that repeats the section heading
above it, a bold Tailwind-step figure and a fixed narrow width. Two live hues is
a hard stop here, and stripping them takes the block's reason to exist with them;
what remains is what is already on the page, rendered on the server in the right
tokens. **No block fixes a missing guard.**

**RECORDED FOR ROW 40 AND DELIBERATELY NOT ACTED ON.** The card beside this one
draws a bar of two segments whose widths are per cent, so it claims to sum to
100, and **there is no guard that it does.** The two figures are rounded
independently upstream, which is precisely how a pair like that drifts off its
own total. Measured on the same eight cities: **all eight close at exactly 100.**
So it is correct today by luck, not by logic, the same shape as row 35's label
crowding. Row 40 starts with this evidence in hand.

**Also noted while reading the shared kit, for the sweep and not for this row:**
the spectrum primitive carries **raw hex in the component** (a three-stop gradient
and a ring colour). Raw hex is a named defect in this loop and a stated hard
constraint of the repo.

**Gates: 114 passed, 0 failed.** Typecheck clean.

**Row 37, 2026-08-23. THE WORST NUMBER THIS LOOP HAS FOUND: a comparison that
was wrong on 251 of 252 city pages, and inverted on the ones that mattered.**

**Row 37 itself is quiet, and I will give it first so it is not lost.** The lease
terms card is three facts with their figures: deposit, typical lease length,
rent-free fit-out. It is well built and **it reaches no reader.** The module that
feeds a real city page drops all three fields on purpose, with the reason written
in: no numeric source. It draws in the workshop sample and nowhere else. **KEPT,
unchanged.** Tenth section found this loop that reaches nobody. One small thing
noted and NOT changed: two of its three rows carry their unit on the figure ("3
mo") and the third carries it in the label ("typical lease, years", figure "5 to
10"). A card no reader sees is the last place to spend a change.

**Reading the module that feeds it is what found the real thing.** The card sits
beside the peer rent strip, row 35, which I passed two iterations ago and marked
blocked for crowded labels. **I measured that row against the bundled sample and
never against a real city page, and the sample is the one shape in which the bug
is invisible.** Exactly the failure the working method names first: read the
module that produces a number before acting on the number.

**What the strip did.** It reads each peer as a signed gap from the home city, and
it worked that gap out by **subtracting a fixed 100 from a cost index.** That is a
gap from home only while home reads exactly 100. The bundled sample is built that
way. Real data is not.

**Counted, not asserted. The site carries 252 cities. Exactly ONE of them, New
York, reads 100.** So on 251 of 252 city pages every figure on that strip was
wrong. The typical city reads 52 and was drawn **48 points below itself.** The
lowest, Alexandria, was drawn **80 points below itself.**

**And it did not merely shift the numbers, it reversed them.** On London: Los
Angeles was drawn 11 points CHEAPER than London when the source has it 14 points
DEARER. A reader comparing rent got the answer backwards. Munich, which carries
the identical index to London, was drawn 25 points below it instead of level.

**The fix was already in the file.** The peer TABLE three hundred lines down has
always subtracted the home city's index for this same figure. The strip is the
only place that subtracted a constant. It now does what the table does, keeping
its own sign convention. **The bundled sample renders byte for byte identical**,
which is the proof that only the arithmetic moved.

**Two more things fell out of looking at it.** The home city's terracotta dot,
the single accent this whole site allows and the entire point of the strip, was
being **painted over by a grey peer** whenever two cities shared an index. It is
drawn on top now; one class, no reordering, so no label changed sides. And the
"?" gloss beside the axis ended with the typed-in words "the London rent level",
so **on 251 pages it named London while the axis above it named the city you were
actually reading.** It takes the name from the page now, checked on London, Tokyo
and Sao Paulo. That gloss lives inside a tooltip, so no screenshot and no content
diff can see it: it was checked by reading the value off the element tree.

**What is still blocked, and now certain rather than lucky.** At phone width the
words Paris and Munich run together above the axis. Identical before and after.
London and Munich share a cost index, so for London this crowding is structural,
not a matter of which peers turn up. It cannot be fixed by arithmetic: separating
labels needs their width in pixels and this section is drawn on the server. Both
ways out change what the section looks like. **Founder call, as recorded in row 35.**

**A false measurement caught in my own instrument, again.** The probe checking
the gloss used a pattern whose leading "the" matched the one at the start of the
sentence, so it captured the whole clause and reported a mismatch on three cities
that were all correct. Checked by inclusion now.

**Gates: 114 passed, 0 failed.** An earlier run of the same chain crashed two
gates on memory exhaustion; the clean run is the one quoted.

**Row 36, 2026-08-23. THE BIGGEST STRUCTURAL FIND SINCE THE TABLES: no spine page
had a heading outline.**

**A LEDGER CORRECTION FIRST.** This row was written as "What space costs, a figure
group". It is neither: it is a chapter divider, and its two sections are rows 35
and 37. Second mislabel of this kind, after row 28's "meters". Both came from
reading the design map instead of the code when the ledger was built.

**What the divider turned out to open onto.** Every section opener in the spine
rendered a plain span. Not one of them was a heading element. So a page carried a
heading for its own name and one for each chapter, **and nothing at all for the
fourteen sections inside them.** Skimming by heading is the primary way a
screen-reader user reads a long page, and on these pages it reached the chapter
names and stopped.

**Counted, not asserted: 6 heading elements on the trade page, now 21. Eight on
the trade-across-places page, now 22.** Every section is reachable, and the
outline runs h1, h2 chapters, h3 sections with **zero skipped levels** on both.

**Nothing a sighted reader sees moved, and that is provable rather than
eyeballed:** the two renders carry byte-identical text AND byte-identical class
strings. The tag is the entire change. Photographed at two widths to confirm the
browser agrees.

**A change I made and reversed inside the same iteration.** I removed the
typography gate's opt-out from the chapter heading, calling it an exemption taken
for nothing. The gate then failed. The canonical heading tokens it wants are the
**pre-spine serif scale**, a display serif at Tailwind step sizes in an ink-900
colour, and a spine heading on the v2 ladder cannot wear them. So every spine
heading must opt out. Restored, with the explanation the typography file itself
asks for and did not have.

**Two dead props documented rather than deleted.** The chapter divider accepts an
eyebrow and an icon and draws neither. **15 of 23 call sites pass an eyebrow, 22
pass an icon.** The eyebrow is banned by a ratified rule with its own gate, so
voiding it is correct. The icon rule covers the section openers, not chapters, and
its gate scans exactly those two tags. Both are dead by design, so the code is
right and only its silence was wrong. **The props stay:** those words and icon
names are authored choices, and deleting 37 of them because today's rules do not
render them is not this loop's call. **The section openers discard a `verdict`
too, passed by 10 callers.** All of it is the founder's to decide.

**A false measurement I caught in my own instrument.** The probe that counts
not-headings matched on a class name, so the moment the openers became real
headings it went on counting them as failures. Fixed to exclude anything already
inside a heading tag; it now reports zero.

**The gate chain crashed four gates**, three with Windows process-abort codes, at
memory exhaustion. All four pass alone. Third time in four rows.

**Row 35, 2026-08-23. BLOCKED. A defect reproduced and deliberately not fixed.**

The strip puts each peer city as a dot on one axis, labelled with its name and its
gap from the home city. To stop labels colliding it puts every other one above the
axis and the rest below, **alternating by position in the list**. That works only
while the values happen to be spread.

**REPRODUCED, not theorised.** Three peers within a few points of each other put
two of them on the same side with almost no gap. At phone width the labels run
together: **"ParisDublin"** over **"-22pp8pp"**. Photographed.

**And today's data clears by about four pixels.** Measured from the render: two
same-side labels roughly 48 pixels apart, each about 45 wide. That is luck, not
logic. One more peer, or a different sort order, and it reads like the broken one.
European rent indices genuinely cluster, so this is not a rare shape.

**WHY IT IS BLOCKED RATHER THAN FIXED, and each alternative was considered:**
- **Alternate by distance instead of index.** No help: with three in a cluster, two
  still share a side whichever rule picks the sides.
- **Assign more lanes.** Needs each label's width. A label's width is pixels and its
  position is a percentage, and the two cannot be reconciled without measuring in a
  browser. This section renders on the server and takes no measurements, which is
  a virtue of it, not an oversight.
- **Drop to a stacked list below some width**, or **move every label off the axis
  into a wrapped row beneath it**. Both work. Both change what the section looks
  like, and **this section carries a written rule that the finding lives on the
  marker strip.** Changing that is a design decision.

**So it is written down with its reproduction and left.** Redesigning a section
around a rule the founder wrote, without asking, is the failure this whole project
was set up to stop.

**Source untouched except one word:** the section is exported so it can be
captured. No reader-visible change.

**The gate chain crashed one gate again**, printing its own PASS lines before
dying, at 0.44GB free. It passes alone. Second time in three rows; this machine
cannot hold the chain and a browser at once.

**Row 34, closed 2026-08-22. Kept. A three-cell strip that would not fit three
across.**

**SECOND CANDIDATE FROM THE SWEEP OPENED, AND ALSO NOT A TABLE.** Two for two.
The pinned grid here is a focal figure beside a strip of three facts, not rows
against columns. The sweep's caveat is holding up: it finds pinned grids, and
pinned grids are not all tables.

**The defect it did have, photographed at 320.** Three fixed columns in a phone
card leave each cell about fifty pixels. **"the baseline" printed as "the
bas..."** with nothing to recover it from, and the middle tag wrapped onto two
lines while its neighbours did not, so that cell's figure and name dropped below
the other two. **Three truncations in one strip, none with a tooltip.**

Cells sized to their contents, wrapping when they must. **Nothing truncates now:
three to zero.** The hairlines come from the gap rather than a divider rule, which
is what stops a wrapped line beginning with one. Same shape the masthead scorecard
uses, and for the same reason. At full width nothing moves.

**Recorded, not changed: this section is London only.** Off London the district set
is left undefined upstream and the whole card omits itself, which the adapter says
in its own comment.

**Row 33, closed 2026-08-22. THE FIRST CANDIDATE THE SWEEP NAMED, AND IT IS NOT A
TABLE.**

The sweep flagged this file for a pinned grid. Opened, that grid is the map
sitting beside the list, not tabular data. **A false positive on the first one
checked**, exactly as the sweep's own caveat said would happen, and worth stating
before the other eleven are reported as if they were confirmed.

**What it did have is worse than a missing table.** The file's own headline called
this a map "cross-linked on hover" with the list beside it. **That cross-link was
never built.** The map component takes points, a fit padding, a select callback, a
label, a class and a height. It has **no prop for an externally highlighted
point**, so nothing the list did could ever have reached it.

**And the machinery for it was still there, doing a stylesheet's job.** A piece of
state holding the hovered district, two mouse handlers, and an inline background
applied to the matching row. That background is `var(--c-soft)`: **the exact value
the shared hover class on the same element already applies.** So the state
reproduced a CSS rule, re-rendering every row in the list on every mouse move
across it, for a connection that does not exist.

All of it is gone, **and with the last piece of state went the client boundary**:
the section renders on the server now. The two renders are byte for byte
identical, all 10,725 of them, which is the proof that nothing a reader sees was
riding on it. The sentence claiming the cross-link is removed rather than left to
mislead.

**WIRING IT PROPERLY IS A REAL FEATURE AND WAS NOT ATTEMPTED.** It needs a new prop
on the map and a browser to verify in, and this machine cannot keep a dev server
alive. Written down instead of half-built.

**An instrument was fixed on the way:** the render harness could not load this
section at all, because the map imports a stylesheet only a bundler can read. The
harness config now aliases it to an empty module, so any section carrying a map
can be rendered from now on.

---

## THE SWEEP, 2026-08-22: WHERE THE LIBRARY ACTUALLY LANDS

Three times in this loop the paid library has been the right answer, and all
three were the same defect: a section that puts things down the side and measures
across the top, with a header row drawn to look like one and no table underneath
it. Rather than wait for the ledger to reach the rest, the codebase was swept for
that one signature.

**Twelve more reader-facing candidates.** Not verdicts: the instrument cannot tell
a grid holding tabular data from a grid holding a layout, so each has to be
opened. But the shape of the run ahead is now known rather than guessed:

| where | files |
|---|---|
| city page | 4 files, 7 pinned grids |
| neighbourhood explorer | 1 file, 4 pinned grids |
| the shared spine kit | 2 files, 9 pinned grids, used by every page |
| cell and industry leftovers | 5 files |

**This corrects an impression these reports were giving.** Twenty-seven rows in,
the library had won three times and I had been reporting, accurately but
narrowly, that the blocks mostly did not fit. They fit in exactly one recurring
place, and that place turns out to be **common**: the sweep says up to fifteen
sections in total, of which three are done.

The ledger order needs no change. Row 33 is one of the twelve.

---

## 3. CITY PAGE

| # | Section a visitor reads | Form today | Defect | Status |
|---|---|---|---|---|
| 33 | Where to trade, by district | map beside a ranked list | **VERIFIED, FIXED** | **DONE-KEPT** |
| 34 | The rent, district by district | focal plus a wrapping strip | **VERIFIED, FIXED** | **DONE-KEPT** |
| 35 | Rent against peer cities | dots on one axis | **VERIFIED: WRONG NUMBERS, FIXED** | **FIXED, crowding still BLOCKED** |
| 36 | ~~What space costs~~ chapter divider, and the whole spine heading system | **VERIFIED, FIXED** | **DONE-KEPT** |
| 37 | The lease terms | fact table | **VERIFIED: reaches no reader** | **DONE-KEPT** |
| 38 | The spending pool | figure group | **VERIFIED: an empty card** | **DONE-KEPT, guarded** |
| 38a | What customers earn here | income scale | **VERIFIED: labels off their marks, geometry scaling, raw hex** | **DONE-REPLACED, rebuilt** |
| 38b | Rent against income | ratio rail | **VERIFIED: reaches no reader; identity gap recorded** | **DONE-KEPT** |
| 39 | ~~Who buys, and when~~ chapter divider, and the container at its foot | **VERIFIED: a rail drawn around nothing** | **DONE-KEPT, guarded** |
| 40 | How seasonal it is | share bar, NOT month bars | **alive on 8 of 8; sum unguarded** | TODO |
| 41 | Lowest bar to entry | featured card | **VERIFIED by sweep: reaches no reader** | **DONE-KEPT** |
| 42 | Next-easiest, and the cost to open | plain table | **VERIFIED by sweep: reaches no reader** | **DONE-KEPT** |
| 43 | Where the risks sit | risk list | **VERIFIED by sweep: reaches no reader** | **DONE-KEPT** |
| 44 | How business runs here | fact list | **VERIFIED by sweep: reaches no reader** | **DONE-KEPT** |
| 45 | What locals know | editorial block | **VERIFIED by sweep: reaches no reader** | **DONE-KEPT** |
| 46 | Peer cities, side by side | comparison table | **VERIFIED: A BUG. Cannot render for ANY input** | TODO, next |
| 47 | The pick, and where to take it | closing block | **VERIFIED: chapter empty on 4 of 8 cities** | TODO |

---

## 4. NEIGHBOURHOOD PAGE

| # | Section a visitor reads | Form today | Defect | Status |
|---|---|---|---|---|
| 48 | What rent takes, district by district | ranked rows | NOT CHECKED | TODO |
| 49 | The revenue myth | revenue rank against rent rank | NOT CHECKED | TODO |
| 50 | Compare districts, up to three | compare tray | NOT CHECKED | TODO |
| 51 | Weekday and weekend footfall | paired toggle | **VERIFIED by sweep: reaches no reader** | **DONE-KEPT** |

---

## 5. COUNTRY PAGE

**Its rebuild is switched OFF, so readers still see the older page.** Do not
spend an iteration on the rebuilt version until it is switched on. Rows will be
enumerated when that changes.

| # | Section a visitor reads | Form today | Defect | Status |
|---|---|---|---|---|
| 52 | The whole country page | pre-rebuild, flag off | NOT CHECKED | BLOCKED, flag off |

---

## 6. HOME

**Hard stop territory.** The headline is locked and the band order is ratified.
842 hero, bento and feature blocks exist in the library and NONE of them are in
scope. A hero block arrives wanting to replace both. Any change here is a design
conversation with pictures, not a block install.

| # | Section a visitor reads | Form today | Defect | Status |
|---|---|---|---|---|
| 53 | The headline and the band order | locked | LOCKED | **BLOCKED, ratified** |

---

## 7. EVERYTHING ELSE, ranked

| # | Page a visitor reads | Defect | Status |
|---|---|---|---|
| 54 | Pricing | no monthly / yearly switch exists | VERIFIED | TODO |
| 55 | The Margin Index leaderboard, score ring | NONE FOUND | **DONE-KEPT** |
| 56 | Compare cities | NOT CHECKED | TODO |
| 57 | The where-to-open recommender | NOT CHECKED | TODO |
| 58 | Calculator | NOT CHECKED | TODO |
| 59 | Browse, cities index, countries index, extremes | NOT CHECKED | TODO |
| 60 | Blog and learn | NOT CHECKED | TODO |
| 61 | Methodology, about the data, coverage, FAQ | NOT CHECKED | TODO |
| 62 | Download the benchmarks | NONE FOUND | **DONE-KEPT** |
| 63 | Contact, status, legal | NOT CHECKED | TODO |
| 64 | Sign-in | there is no sign-in surface at all | VERIFIED | **BLOCKED, other plan** |

**Row 55, kept with evidence.** The score ring is 44 pixels wide, renders on the
server, and appears dozens of times on one page. A charting library redraws each
one in the browser after the page arrives. It would cost a JavaScript payload and
a browser-side redraw per row to produce the same picture.

**Row 62, kept with evidence.** The waterfall on that page is an ILLUSTRATION of
what is inside the download, drawn once at one fixed size, on a page that ships
as pure server HTML with no JavaScript at all. Swapping it would add JavaScript
to redraw a picture that is already correct.

**Row 64 belongs to the accounts work, not this loop.** It is listed so that work
starts from a block instead of another hand-built form.

---

## RETIRED

| what | why |
|---|---|
| The second waterfall in the chart kit | Fully written, exported from two barrels, mounted on ZERO pages |

## The count

**COUNTED, NOT TYPED, from 2026-08-23. Run `node scripts/count_ledger.mjs`
and paste the result; do not hand-edit these figures.**

```
  66 rows
    TODO               14
    BLOCKED            12
    KEPT/FIXED         34
    REPLACED/RETIRED    5
    VOID                1
```

**Twenty to fourteen in one pass on 2026-08-24**, six rows closed by the sweeps
rather than by six iterations. See "THE SIX SWEEPS" below.

**The line this replaces was wrong on three of its four figures.** It said 7
replaced, 13 blocked and 17 to go, against a real 5, 12 and 20. Nobody mistyped
it once: it was edited by hand at the end of thirty-odd iterations and drifted a
little each time, which is exactly how the gate count in `CLAUDE.md` reached ten
different values across 32 files. **A ledger that lies about how much is left
produces a wrong plan**, and this one had been under-reporting the remaining work
by three sections.

**The count went UP by two on 2026-08-23.** Row 39 turned out to be a chapter
divider whose chapter holds four cards, and only two of them were ever written
into this file. The missing pair is listed as 38a and 38b rather than by
renumbering, so every number already used in this file still points where it did.

Twelve blocked: eleven on missing data, and ONE on a design decision that is the
founder's to make.

Two sweep candidates opened, neither a table. The sweep finds pinned grids; a
pinned grid is a table only sometimes, and the count of twelve should be read as
an upper bound until each is opened.

THE INDUSTRY PAGE IS DONE. Its fourteen sections are closed or blocked: four
blocked on missing data, one void as a duplicate, the rest fixed or kept.

All THREE library wins are the same defect: a table built without a table. Nothing
else in twenty-six rows has needed a block.

One of those eighteen needed NO change at all. Twenty-three rows in, that is the
first.

BOTH library wins so far are the same defect: a table built without a table.
That is worth remembering when the remaining rows are triaged.

THE CELL PAGE IS DONE. All seventeen of its rows are closed or blocked. Five are
blocked on missing data, not on design, and no component from any library moves
them.

A pattern worth naming: THREE separate charts have now been found placing a mark
or a label centred on its own value at the very end of a scale, where half of it
falls outside the box. It is the single most repeated defect in this codebase.

Five of those blocked rows are the trade page sections that reach no reader.
They are blocked on DATA, not on design, and no component from any library
changes that.

## Standing notes for every iteration

- The licence key is live. All 3,968 blocks pull. The index is public; the
  blocks are not.
- Never run the installer with the overwrite flag. It has already destroyed a
  customised file in this project once.
- The gate chain is 114 gates. Run it serially; this machine is short of memory
  and the parallel run fails differently on each attempt.
- **A typecheck is not a render.** Both real defects in the money waterfall were
  invisible to every automated check and obvious the moment it was drawn.
- The dev server dies repeatedly under half a gigabyte of free memory. Render to
  a standalone sheet and say the browser check did not run.
