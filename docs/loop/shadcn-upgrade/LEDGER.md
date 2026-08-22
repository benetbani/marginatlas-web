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
| 3 | When it clears costs | two-marker scale on one domain | NOT CHECKED | TODO |
| 4 | What it costs to open one | lollipop on a drawn track | NOT CHECKED | TODO |
| 5 | Who this suits | discrete tier band, categorical pips | NOT CHECKED | TODO |
| 6 | When the week fills up | daypart donut | NOT CHECKED | TODO |
| 7 | Who comes in, and how | share bar, 2 to 3 segments | NONE FOUND | **DONE-KEPT** |
| 8 | Busy months and quiet months | zero-baseline monthly columns | NOT CHECKED | TODO |
| 9 | Getting to break-even | two-anchor time axis | NOT CHECKED | TODO |
| 10 | The same trade, comparable places | editorial table, no in-cell bars | NOT CHECKED | TODO |
| 11 | What the team costs | track-free range brackets | NOT CHECKED | TODO |
| 12 | What to watch | severity-marked risk list | NOT CHECKED | TODO |
| 13 | Myth vs. reality | struck-through line pairs | NOT CHECKED | TODO |
| 14 | Related trades in this place | ranked figure list | NOT CHECKED | TODO |
| 15 | The masthead turnover spread | spread strip, p10 / p50 / p90 | **VERIFIED, OPEN** | TODO |
| 16 | The masthead headline figure | one hero-scale number | NOT CHECKED | TODO |
| 17 | The currency and format switch | segmented control | NOT CHECKED | TODO |

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

**Row 7, kept with evidence.** The share bar is a flex row of divs whose widths
are percentages. It has no axis, no scale, nothing to measure, and it renders on
the server. It also already refuses to draw when its segments fail to sum to the
whole. A charting library would add a browser-side redraw and a JavaScript
payload to a shape CSS does exactly. Revisit only if it gains an axis.

**Row 15 is the open wound.** Three separate percentile fans exist across the
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

64 rows. **3 replaced or retired, 5 kept with evidence, 3 blocked, 53 to go.**

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
