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

Verified this iteration, not assumed. The cell, industry and city page rebuilds
are LIVE by default: their flag resolves to on unless an environment variable
turns them off, and nothing in the local environment turns them off. The country
and region rebuilds default to OFF, so those readers still see the older pages.
**Every country and region row below therefore describes a page nobody is
looking at yet, and ranks accordingly.**

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
| 10 | The same trade, comparable places | editorial table, no in-cell bars | NOT CHECKED | TODO |
| 11 | What the team costs | track-free range brackets | NOT CHECKED | TODO |
| 12 | What to watch | severity-marked risk list | NOT CHECKED | TODO |
| 13 | Myth vs. reality | struck-through line pairs | NOT CHECKED | TODO |
| 14 | Related trades in this place | ranked figure list | **NO DATA. Reaches no reader** | **BLOCKED** |
| 15 | The masthead turnover spread | spread strip, p10 / p50 / p90 | **VERIFIED, OPEN** | TODO |
| 16 | The masthead headline figure | one hero-scale number | NOT CHECKED | TODO |
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
| 18 | Kept per $100, by trade | margin ladder | NOT CHECKED | TODO |
| 19 | Where each $100 goes | stacked bar | NOT CHECKED | TODO |
| 20 | Keep and cost, trades next door | comparison rows | NOT CHECKED | TODO |
| 21 | What a customer spends | figure with range | NOT CHECKED | TODO |
| 22 | Five-year survival | survival curve, line on zero baseline | NOT CHECKED | TODO |
| 23 | Payback window | phase bar | NOT CHECKED | TODO |
| 24 | When a day starts paying | two-marker scale | NOT CHECKED | TODO |
| 25 | Getting to break-even | phase bar | NOT CHECKED | TODO |
| 26 | Across the year | season ribbon | NOT CHECKED | TODO |
| 27 | The typical operator | fact list | NOT CHECKED | TODO |
| 28 | Who it suits | meters | NOT CHECKED | TODO |
| 29 | What people get wrong | struck line pairs | NOT CHECKED | TODO |
| 30 | Where the trade pays, place by place | ranked list with rent load | NOT CHECKED | TODO |
| 31 | The subtype drill | nested breakdown | NOT CHECKED | TODO |
| 32 | The close | editorial block | NOT CHECKED | TODO |

---

## 3. CITY PAGE

| # | Section a visitor reads | Form today | Defect | Status |
|---|---|---|---|---|
| 33 | Where to trade, by district | district table | NOT CHECKED | TODO |
| 34 | The rent, district by district | ranked rows | NOT CHECKED | TODO |
| 35 | Rent against peer cities | comparison bars | NOT CHECKED | TODO |
| 36 | What space costs | figure group | NOT CHECKED | TODO |
| 37 | The lease terms | fact table | NOT CHECKED | TODO |
| 38 | The spending pool | figure group | NOT CHECKED | TODO |
| 39 | Who buys, and when | mixed | NOT CHECKED | TODO |
| 40 | How seasonal it is | month bars | NOT CHECKED | TODO |
| 41 | Lowest bar to entry | featured card | NOT CHECKED | TODO |
| 42 | Next-easiest, and the cost to open | plain table | NOT CHECKED | TODO |
| 43 | Where the risks sit | risk list | NOT CHECKED | TODO |
| 44 | How business runs here | fact list | NOT CHECKED | TODO |
| 45 | What locals know | editorial block | NOT CHECKED | TODO |
| 46 | Peer cities, side by side | comparison table | NOT CHECKED | TODO |
| 47 | The pick, and where to take it | closing block | NOT CHECKED | TODO |

---

## 4. NEIGHBOURHOOD PAGE

| # | Section a visitor reads | Form today | Defect | Status |
|---|---|---|---|---|
| 48 | What rent takes, district by district | ranked rows | NOT CHECKED | TODO |
| 49 | The revenue myth | revenue rank against rent rank | NOT CHECKED | TODO |
| 50 | Compare districts, up to three | compare tray | NOT CHECKED | TODO |
| 51 | Weekday and weekend footfall | paired toggle | NOT CHECKED | TODO |

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

64 rows. **3 replaced or retired, 8 kept with evidence, 8 blocked, 45 to go.**

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
