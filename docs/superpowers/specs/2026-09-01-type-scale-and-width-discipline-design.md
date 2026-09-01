# Type scale compression and width discipline , design

**Ratified by the founder 2026-09-01** (option "Approved, write it"), from his
2026-08-31 message: "a big variability in fonts which is traumatic to the eye,
the difference between H1 and the smallest font cannot be so gigantic" and "for
each subsection that currently occupies the full width there should be a check
whether it actually deserves full width, full width damages readability a lot in
desktop, in mobile idk it can be seen differently as treatment".

This is sub-project 1 of four decomposed from that message. The other three
(wiring the ten specialised trade sections, the industry margin-reality writing
plus lateral navigation, and the licences priority) get their own specs. Nothing
is dropped; this one leads because it needs no new data and shows on every page.

---

## 1. THE MEASUREMENT THAT SHAPED THE DESIGN

Counted on the rebuilt country page, every size token in the file:

| token | px | uses |
|---|---|---|
| micro | 11 | 26 |
| body | 14 | 26 |
| head | 20 | 6 |
| small | 12 | 4 |
| sub | 18 | 2 |
| focal | 30 | 1 |
| answer | 48 | 1 |

Two readings, and the second is the one that changed the design.

**The range is 4.4x** (11 to 48), which is the founder's stated complaint.

**Two rungs are near-twins carrying almost no load.** 12 sits one pixel from 11
and does a twentieth of its work; 18 sits two pixels from 20 and does a third of
its work. A reader cannot perceive either as a level of hierarchy, so both spend
"a different size" without buying meaning. Seven sizes on one page, five of them
doing real work. That is the variability half of his complaint, and no amount of
ceiling-lowering would have touched it.

---

## 2. THE LADDER, AND WHY EACH NUMBER

| step | px | role |
|---|---|---|
| mark | 10 | marks only. Never a sentence, never a label to read. UNCHANGED |
| micro | **12** | the floor for anything read: axis units, chips, column heads. WAS 11 |
| body | 14 | prose. The default. UNCHANGED |
| lead | 16 | a lede, a card's first line. UNCHANGED |
| head | 20 | ALL headings, h2 and h3. Absorbs the retired 18 |
| section | 24 | chapter openers, and now the page title (h1) |
| focal | 30 | a section's own focal figure. UNCHANGED |
| answer | **40** | the page's one dominant figure. WAS 48 |

RETIRED: `--t-small` (12, folds into micro at the same rendered size) and
`--t-sub` (18, folds into head).

Range: **12 to 40, 3.3x** (was 11 to 48, 4.4x). Read sizes on a typical page:
**five** (was seven).

**Why the floor RISES rather than the ceiling doing all the work.** It
compresses the range from below and makes the smallest text easier to read at
the same time: the 26 smallest labels on the country page get bigger, not
smaller. Lowering the ceiling alone would have compressed the range by making
the answer weaker, which is a worse trade. This supersedes the 2026-08-21 ruling
that set the floor at 11 ("eleven for anything read"); that ruling raised it from
10 and this raises it again, in the same direction, for the same reason.

**Why the ceiling lands at 40 and not 36, derived rather than chosen.** Rule 16
requires the page's answer to be at least 1.6x everything supporting it, and the
page title sits in the same card as the answer on every masthead. At a 40 ceiling
the title takes 24 and the ratio is 1.67x, clearing the rule. At 36 the title
would have to drop to 20, which is the heading size, so titles and headings
would collide across the whole site. 40 is therefore the smallest ceiling that
keeps both laws intact.

**Why the page title moves from 30 to 24.** Today the country masthead shows
"United Kingdom" at 30 beside "20%" at 48, a ratio of 1.6x. Holding the title at
30 under a 40 ceiling gives 1.33x, and the two would compete. Rule 16's own
words: only one of them may be the largest thing on the page. The title is
context; the answer is the point.

---

## 3. THE MIGRATION, IN FOUR VERIFIABLE STEPS

Each step is separately checkable, and steps 2 and 3 must produce ZERO visual
change. That property is what makes the whole change falsifiable.

**Step 1, the values move.** In the one stylesheet that owns the tokens:
micro 11 to 12, sub 18 to 20, answer 48 to 40. `--t-small` stays at 12.
Visual change: small labels up one pixel, subsection headings up two, the
dominant figure down eight. This is the only step a reader sees.

**Step 2, the references collapse.** Every `--t-small` becomes `--t-micro`
(identical rendered value, so a blind sweep is safe here and only here). Every
`--t-sub` is judged PER USE, not swept: a heading use becomes `--t-head`, a
figure use becomes `--t-head`, and a prose use becomes `--t-lead`. The country
page's two `--t-sub` uses are a figure, not a heading, which is why a blind sweep
would have been wrong. Zero visual change, because step 1 already equalised the
values.

**Step 3, the dead tokens go.** `--t-small` and `--t-sub` are deleted from the
stylesheet, and a gate fails the build if either returns. A retired token that
still resolves is a rung people keep stepping on.

**Step 4, the page titles drop.** Every page whose h1 uses `--t-focal` (or an
off-ladder size, which the city page's 36px h1 does) moves to `--t-section`.
This closes the city masthead's recorded off-ladder debt as a side effect.

---

## 4. THE WIDTH TEST

**What is actually broken, measured.** The four rebuilt pages carry ZERO
unsanctioned full-width sections today. The entire debt is on the three legacy
pages: home 8, countries-list 2, country-gb 13. Those 23 die with rebuilds that
are already specified as target blueprints, and this project does not touch
them; it records that they are the rebuilds' job.

So the work here is to justify the SANCTIONED wide bands, one at a time, and to
write the test down so the next one is argued rather than assumed.

**THE TEST. A band earns the full column only if it passes one of two, and then
still obeys the third.**

1. **The comparison test.** The reader must scan ACROSS the band to compare
   things that only mean something side by side: a real table with three or more
   compared subjects. The country peers table passes. A row of unrelated figures
   does not, because nothing is being compared, and the eye pays the traverse
   cost for no reading.
2. **The chrome test.** It is the page's opening (one answer, stated once) or its
   closing hand-off (doors out). Neither asks the eye to traverse a row of data.
3. **And in both cases: the words stay inside the reading measure.** A full-width
   band may hold a narrow paragraph; it may never hold a 100-character line. The
   68ch measure ratified 2026-08-21 already governs this and is not changed here.

Anything failing both 1 and 2 takes a band split from the sanctioned set.

**THE DESKTOP/MOBILE STATEMENT, which the law currently does not make at all.**
The founder: "full width damages readability a lot in desktop, in mobile idk it
can be seen differently as treatment." At phone width every band is full-bleed by
nature, because the column IS the screen; there is no traverse cost and no
alternative. The width ban is therefore a DESKTOP rule, and the law must say so
in its own text rather than leaving a reader of the law to infer it. This is a
clarification of existing behaviour, not a change to it: nothing in the code
moves for this statement.

---

## 5. BLAST RADIUS, AND WHAT COULD GO WRONG

**Everything renders through these tokens**, including the three legacy pages
this project otherwise leaves alone. That is intended: the founder's complaint
was site-wide. The legacy pages get smaller dominant figures and slightly larger
small text, which moves them toward the reformed pages, not away.

**The named risks, each with its check:**

- *Headings flatten.* Folding 18 into 20 removes a heading level where one was
  genuinely in use. Step 2 judges every `--t-sub` use individually rather than
  sweeping, and any use that was carrying real h3-under-h2 hierarchy is reported
  rather than silently flattened.
- *The answer stops dominating.* Every masthead is re-photographed at 375 and
  1280 and read; the blueprint conformance gate independently counts answer-class
  figures above 36px, and 40 still clears that threshold while 30 correctly does
  not.
- *A gate encodes an old number.* The conformance gate's 36px probe, the art
  direction's coverage claim, and all five blueprint CONSTANTS blocks name the
  ladder. Every one is amended in the same wave, blueprint before code, or the
  gates enforce a retired law.
- *The city page's 36px h1.* It is off-ladder today and recorded as debt; step 4
  closes it. If it were left, the site would carry a size that exists on no rung
  after the ladder had just been tightened.

---

## 6. QUALITY CHECKS (the founder asked for these by name)

1. `npx tsc --noEmit`, exit 0.
2. The full gate chain, every gate passed, the real exit code captured to a file
   and read, never piped.
3. All eight surfaces re-rendered and re-photographed at 375 and 1280, and the
   mastheads OPENED and READ, not merely regenerated.
4. Steps 2 and 3 must produce byte-identical rendered HTML except where a
   token name changed; any other diff is a defect and stops the wave.
5. A new gate: the retired tokens may not reappear.
6. A new gate or a written not-machine-checkable note: the ladder in the
   stylesheet and the ladder in the five blueprints must agree.
7. The adversarial panel on every changed page before the founder sees anything.
8. One review sheet, before and after at both widths, and the walk strip.

---

## 7. WHAT THIS SPEC DELIBERATELY DOES NOT DO

- It does not touch the three legacy pages' unsanctioned full-width bands. They
  are their rebuilds' work and saying otherwise would be a second vertical.
- It does not change the 10px mark step. A mark is not read, and the founder's
  2026-08-21 ruling separating marks from read text stands.
- It does not change the reading measure.
- It does not resolve the city masthead's five-point conflict with its
  constitution, which is a standing founder question. It only fixes that h1's
  SIZE, which is unambiguous debt either way.
