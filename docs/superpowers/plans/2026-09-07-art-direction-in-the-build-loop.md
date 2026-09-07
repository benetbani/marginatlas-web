# Art Direction in the Build Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every section is designed before it is built (why it exists, what it emphasises, what it leaves out, how it sits in the page), the page has one emphasis budget instead of an accent on every card, the harness measures hierarchy at page level, and the founder gets one picture and eight plain lines per run.

**Architecture:** Three layers. (1) Briefs as files: one page brief (`design/loop/build/briefs/city.md`) carrying the reader's walk, the loud moments and the rhythm, plus one block per section (why, takeaway, loud or quiet, hidden, relation, hierarchy ladder, the change it implies); written in a new loop stage S1.5 DIRECT and read by the judge in S7. (2) Emphasis decided by the page, not the card: the builders stop marking accents where the page brief says quiet, so the three loud moments (where, who, what) are the only terracotta figures on the page. (3) The harness gains page-level checks (ACCENT BUDGET, NO LEAD, WALL) and one stitched picture of the whole page per run with the accent moments outlined, so hierarchy is measured and seen, not asserted.

**Tech Stack:** Next.js 15 / React 19 / TypeScript / Tailwind 3.4 (`E:\atlas\website`); the archetypes in `src/components/spine/archetypes/`; the harness in `scripts/harness/` (Playwright, node ESM); the loop's files in `E:\atlas\design\loop\build\`; the founder's words in `E:\atlas\rules\FOUNDER-VERDICTS.md`.

**Working rules that bind every task:** every shell command begins with `cd /e/atlas/website &&` or `cd /e/atlas &&`; every verification goes to a file under `scratchpad/` and its exit code is read; no em dash, no hex, no pixel in a component; commits by file name, never `git add -A`, never push; a photograph is a viewport capture; one change, one verification.

---

## What the founder said (2026-09-07), the ruling this plan serves

> "an art director is missing from a lot of your work, the graphics don't know what to emphasize, how to emphasize, how to show by not showing, how to design world class design effectively. that's quite a problem to be honest, you should think for each section, why, how, how to make it better, how it will relate to the page, visual hierarchy, etc. the harness and architecture can be improved further as a whole thing." And: "make my life easier."

**What is true today, measured on the London city page:** eight cards wear a terracotta figure (the verdict, the districts' leader, the earnings mark, the premises mark, the spending pool's $22K, the lowest bar to entry's cost, the owner's runway, the people table's dots). Eight loud spots on one page is no hierarchy: nothing leads. Sections were paired for equal heights and filled to fit, so a card's content was decided by its neighbour's height, not by what a reader needs. The judge (S7) checks each card in eight blocks after the build, but nothing before the build says what the section is for and what it must not do.

---

## File structure

**Created**
- `E:\atlas\design\loop\build\briefs\city.md`: the city page's composition brief and its fifteen section blocks. One file per page; the section blocks live in the page file because they are read together.
- `E:\atlas\design\loop\build\briefs\README.md`: the brief's form, so every page brief has the same seven headings.
- `scripts/harness/fixtures/hierarchy.html`: a fixture with three faults (four accent figures, a card with no lead, a wall of text) proving the three new page checks.
- `scripts/harness/page_strip.mjs`: stitches viewport captures of every card on a rendered page into one tall picture with the accent moments outlined; `npm run strip:page`.

**Modified**
- `E:\atlas\rules\FOUNDER-VERDICTS.md`: the founder's words of 2026-09-07 appended verbatim under a dated heading (append only).
- `E:\atlas\design\loop\build\DOCTRINE.md`: stage S1.5 DIRECT; the judge's block 0 (the brief); the report's register; the closing message.
- `E:\atlas\design\loop\build\QUEUE.md`: the new rows `city:brief`, `city:emphasis`, `sys:page-hierarchy`, `sys:page-strip`; the remaining city rows made dependent on the brief.
- `scripts/harness/check_page_holes.mjs`: three page-level checks, ACCENT BUDGET, NO LEAD, WALL.
- `src/lib/spine/range_rows.ts`: the city strips built quiet (no accented mark) when the brief says so.
- `src/lib/spine/district_rows.ts` and `src/components/spine/archetypes/RankedBars.tsx`: `emphasis` on the ranked bars (quiet: the leader bold in ink, no terracotta text).
- `src/components/spine/city/city-view.tsx` and `src/components/spine/city/chapters.tsx`: the three kit figures in terracotta (spending pool, lowest bar to entry, runway) to ink until their rows land.
- `package.json`: `strip:page`.
- `E:\atlas\design\loop\build\REPORT.md`: the eight-line form.

---

### Task 0: The founder's words, verbatim, into the verdicts file

**Files:**
- Modify: `E:\atlas\rules\FOUNDER-VERDICTS.md` (append at the end)

- [ ] **Step 1: Append the dated heading and the words**

Write `scratchpad/arch/append_verdict_0907.py` with the Write tool (a heredoc with quotes inside is the trap the loop paid for twice):

```python
import io
p = r"E:\atlas\rules\FOUNDER-VERDICTS.md"
s = io.open(p, encoding="utf-8").read().rstrip("\n")
s += '''

## Art direction, 2026-09-07 (verbatim, in chat, after run 25)

- 2026-09-07 | "an art director is missing from a lot of your work, the graphics don't know what to emphasize, how to emphasize, how to show by not showing, how to design world class design effectively"
- 2026-09-07 | "that's quite a problem to be honest, you should think for each section, why, how, how to make it better, how it will relate to the page, visual hierarchy, etc"
- 2026-09-07 | "the harness and architecture can be improved further as a whole thing"
- 2026-09-07 | "make my life easier" (on the loop's reports: plain words, no jargon)
'''
io.open(p, "w", encoding="utf-8", newline="\n").write(s + "\n")
print("appended")
```

Run: `cd /e/atlas/website && python scratchpad/arch/append_verdict_0907.py`
Expected: `appended`

- [ ] **Step 2: Check nothing else in the file changed**

Run: `cd /e/atlas && git diff --stat -- rules/FOUNDER-VERDICTS.md`
Expected: `1 file changed, 8 insertions(+)` (eight lines added, none removed)

- [ ] **Step 3: Commit**

```bash
cd /e/atlas && git add rules/FOUNDER-VERDICTS.md && git commit -m "rules: the founder's art-direction words of 2026-09-07, verbatim"
```

---

### Task 1: The brief's form, and the city page's brief

**Files:**
- Create: `E:\atlas\design\loop\build\briefs\README.md`
- Create: `E:\atlas\design\loop\build\briefs\city.md`

- [ ] **Step 1: Write the form**

`E:\atlas\design\loop\build\briefs\README.md`:

```markdown
# Briefs: the design of a section before it is built

One file per page. The page block first, then one block per section, in
the order the reader meets them. Written in stage S1.5 DIRECT, before any
code; read by the judge in S7; a section whose build contradicts its brief
is a fault, whichever is wrong, and the run says which.

## The page block

- THE WALK: what the reader asks first, second, third, and which section
  answers each. Five lines at most.
- THE LOUD MOMENTS: at most three figures on the page in the accent, each
  named with the question it answers. Everything else is ink. (The founder's
  people-table dots are his ruling and do not count.)
- THE RHYTHM: the sections in order, each marked loud or quiet, so two loud
  cards never sit on one level and a reader gets a rest between answers.
- NOT SHOWN: what the page deliberately leaves out, and why.

## The section block (seven headings, every one filled)

1. WHY: the reader's question this section answers, in their words.
2. THE TAKEAWAY: the one sentence a reader should leave with. If it needs
   two sentences, the section is two sections or too much.
3. LOUD OR QUIET: which, and what carries the emphasis if loud (one figure,
   one mark). A quiet section has a lead (bold, larger) but no accent.
4. HIDDEN: what the data holds that the section does not draw, and why
   (repeats a neighbour, no basis, noise).
5. RELATION: what came before it, what comes after, and what it must not
   repeat from either.
6. THE LADDER: lead, support, whisper. Which elements sit at which rung
   (size and weight), so the eye has an order.
7. THE CHANGE: the concrete difference between the section as built and
   the section this brief asks for, in one or two lines. "None" is allowed
   and must be argued.
```

- [ ] **Step 2: Write the city page's brief**

`E:\atlas\design\loop\build\briefs\city.md`. This is the art direction the founder asked for, section by section, written from the London render of run 25 and the founder's rulings:

```markdown
# The city page: the brief (written 2026-09-07 from the London render of run 25)

## The page

THE WALK. A reader lands on a city asking: (1) is this city cheap or dear
to open in, and where inside it; (2) who will buy from me here and what
will it cost me to be here; (3) what could I open, and where do I go next.
The masthead and the verdict answer (1); the districts, quick reads and
peers sharpen it; earnings, premises, the spending pool and the season
answer (2); character and locals colour it; the trades and the close
answer (3).

THE LOUD MOMENTS (three, the only terracotta figures on the page):
- WHERE: the verdict's lightest rent load (x1.20, South London).
- WHO: the typical customer's pay on the earnings strip.
- WHAT: the cheapest trade to open, in the trades section.
Everything else is ink, with a bold lead where a card needs one.

THE RHYTHM, top to bottom: masthead quiet (identity) · verdict LOUD ·
districts quiet · quick reads quiet · peers quiet · earnings LOUD ·
premises quiet · spending pool quiet · season quiet · character quiet (the
founder's dots) · trades LOUD · risks quiet · locals quiet · close quiet.
No two loud cards on one level; at least two quiet cards between loud ones.

NOT SHOWN: the district map (no coordinates; data requirement 16); the
owner's runway and the risks until a city holds real notes (they draw
London's placeholders today); the second accent the districts card wore
until run 25 (it restated the verdict's figure two inches below it).

## 1. Masthead (city-take)

1. WHY: which city is this, and what is the one number that frames it.
2. THE TAKEAWAY: "London, in the United Kingdom: 15% of people here work
   for themselves" (whatever the seed's answer tile is).
3. LOUD OR QUIET: quiet. The name and the photograph are the identity; the
   answer figure is the lead in ink. The accent is saved for the verdict.
4. HIDDEN: the tiles the quick reads already carry (the builder drops them).
5. RELATION: first on the page; the verdict below it must not repeat its
   figure, and does not.
6. THE LADDER: lead = the answer figure (40); support = the name (24) and
   the cells' figures (20); whisper = labels, the provenance line (12).
7. THE CHANGE: none. Built on the answer card at page level (run 8, ink
   since run 23's verdict took the accent). Argued: the photograph is the
   loudest thing here by nature, so a second loud figure would fight it.

## 2. The verdict (verdict)

1. WHY: where inside this city is rent lightest, and how wide is the spread.
2. THE TAKEAWAY: "South London carries the lightest rent load, x1.20 the
   city average; the West End the heaviest at x3.00."
3. LOUD OR QUIET: LOUD. The one figure x1.20 in the accent; the two cells
   in ink.
4. HIDDEN: the five districts between the ends (the districts card's job).
5. RELATION: under the masthead; the districts card below shows the ladder
   the verdict names the ends of, so the districts card must not accent the
   same x1.20 again (it did until this brief; see 3).
6. THE LADDER: lead = x1.20 (40, accent); support = the two cells' figures
   (20); whisper = the kicker, the labels, the sample marks.
7. THE CHANGE: none to the card. The modelled mark stays until measured
   district rents arrive (data requirement 15).

## 3. By district (districts)

1. WHY: what does the whole ladder look like between the two ends, and what
   is each district known for.
2. THE TAKEAWAY: "Two districts sit within a tenth of the cheapest; then the
   ladder jumps by two thirds; the West End trio sits near x3."
3. LOUD OR QUIET: QUIET. The lightest bar is the lead (full tint, its figure
   bold in ink); no terracotta text, because the verdict already said
   x1.20 in the accent two inches above. The shape of the ladder is the
   point, not one bar.
4. HIDDEN: the door to the districts page (the close carries it); the map
   (no coordinates).
5. RELATION: after the verdict (the ends), beside the quick reads (the city's
   profile); before the peers (other cities). It must not restate the
   verdict's figure loudly, and must not draw a second ranking form (the
   neighbourhood page's bars are the same form now, one idea one form).
6. THE LADDER: lead = the lightest bar and its figure (16 bold); support =
   the other figures (16) and the names (12); whisper = the notes list, the
   basis, the top rule's words.
7. THE CHANGE: `emphasis="quiet"` on the ranked bars for this card: the
   leader's figure in ink, bold; the leader bar full tint, the rest light.
   One prop, Task 4.

## 4. Quick reads (lenses)

1. WHY: in one glance, what kind of market is this (deep or thin, costly or
   cheap, local or visited).
2. THE TAKEAWAY: "London: deep demand, high income, costly, deep talent,
   visited, large."
3. LOUD OR QUIET: quiet. Six dots on six tracks; the founder's approved form.
4. HIDDEN: the numbers behind the ranks (a rank between two poles is the
   honest read; the figures are on other cards).
5. RELATION: beside the districts; the peers table below puts three of these
   reads beside other cities, so the two agree by construction (same seed).
6. THE LADDER: lead = the trait names (16); support = the dots; whisper =
   the poles (12), the foot (the registration days).
7. THE CHANGE: none. Argued: run 16 built it to the founder's rule 34
   correction; it reads as a profile at a third width, which is its job.

## 5. Peer cities (peers)

1. WHY: is this city a better or worse bet than the cities like it.
2. THE TAKEAWAY: "Munich matches London on cost and pay; Paris is dearer
   and poorer; Los Angeles cheaper and richer."
3. LOUD OR QUIET: quiet. The best figure per column bold; the home row shaded.
4. HIDDEN: the raw indices (read as differences beside the home city, which
   is what a reader compares).
5. RELATION: after the city's own profile, before the money chapter; the
   country page's peers table is the same form, so a reader who has seen
   one reads the other.
6. THE LADDER: lead = the bold best figures; support = the names with
   flags; whisper = the caption.
7. THE CHANGE: the caption from four sentences to two: keep the units line
   and "higher is better in every column"; drop the peer-picking sentence
   into the copy gate's why. The founder praised this table for saying
   little. (A copy change in `COPY.cityPeers.caveat`, its own small row.)

## 6. What customers earn here (earnings)

1. WHY: who will buy from me and what do they have to spend.
2. THE TAKEAWAY: "A typical customer here earns about £x a year; the bottom
   tenth £y, the top tenth £z."
3. LOUD OR QUIET: LOUD. The typical mark's figure in the accent (the page's
   WHO). The two ends in ink.
4. HIDDEN: the top 1% (dropped in run 11, derived twice over).
5. RELATION: opens the money chapter; the premises strip beside it answers
   "what it costs me" in the same strip form, quiet, so the two read as a
   pair: what they have, what I pay.
6. THE LADDER: lead = the typical figure (20, accent); support = the end
   figures (16); whisper = the spread word, the basis, the modelled note.
7. THE CHANGE: none to the drawing. The accent is already on the typical
   mark; the brief makes it one of the three and keeps it.

## 7. What premises cost to run (premises)

1. WHY: what will a shop cost me a year here, by district class.
2. THE TAKEAWAY: "A square metre of shop runs from £a in smaller cities to
   £b in the biggest; London sits in the biggest."
3. LOUD OR QUIET: QUIET. The city's own class is the lead, bold in ink; no
   accent (the earnings figure beside it is the loud one on this level).
4. HIDDEN: the three tier averages' basis words beyond one line.
5. RELATION: beside earnings; below the peers; the spending pool under it
   must not repeat the rent figure.
6. THE LADDER: lead = the city's class mark (bold); support = the other two
   marks; whisper = the basis.
7. THE CHANGE: the city premises strip built without an accented mark
   (`accent: false` on every mark in `buildCityPremisesStrip`; the lead by
   weight). Task 4.

## 8. The spending pool (#3) and How seasonal it is (seasonal)

1. WHY: how much money is spent here per person, and does it come all year.
2. THE TAKEAWAY: "$22K spent per resident a year, up x% on last year; a
   third of the year's trade comes in the high season."
3. LOUD OR QUIET: quiet. Two figures as a key-value pair; the season as two
   cells (high season share, low season share), not a bar: the founder
   called the split near-universal and its bar distorted (C8), and the
   page's third bar-family slot is worth more elsewhere.
4. HIDDEN: the stacked bar; the growth arrow glyph (the word "up" or "down"
   with the figure is the honest form, the founder's C6 ruling on lone
   numbers).
5. RELATION: after premises; before character. Two small quiet cards on one
   level (1-1), equal by construction.
6. THE LADDER: lead = the $ figure (20, ink bold); support = the growth and
   the season shares (16); whisper = labels.
7. THE CHANGE: both on the key-value grid, one card ("The money here") with
   four cells: spent per resident, change on last year, high-season share,
   low-season share. The row `city:demand`. The page's bar count returns to
   one (the districts).

## 9. Dealing with the state, Dealing with people (character, #10)

1. WHY: what is it like to deal with officials here, and with customers and
   staff.
2. THE TAKEAWAY: "Officials: slow but predictable; people: warm, informal,
   cash-happy" (the six traits per table).
3. LOUD OR QUIET: quiet, with the founder's terracotta dots on the people
   table (ruling 14, his, not counted in the budget).
4. HIDDEN: nothing; every trait is named with explanatory poles (ruling 14).
5. RELATION: the colour chapter, after the money; before the trades.
6. THE LADDER: lead = the trait names; support = the dots and foot figures;
   whisper = the poles.
7. THE CHANGE: none. Built to the founder's 2026-08-30 words in run 14.

## 10. Trades with local figures (trades), Lowest bar to entry (#6), Next-easiest (#7)

1. WHY: what could I actually open here, and what is the cheapest way in.
2. THE TAKEAWAY: "Six trades have London figures; a barber is the cheapest
   to open at £x; the next three cost £y to £z."
3. LOUD OR QUIET: LOUD, once: the cheapest trade's cost to open in the
   accent (the page's WHAT). The other trades in ink.
4. HIDDEN: the funnel of chips repeated as three cards (three cards say one
   thing three ways today: the chips, the lowest bar, the next-easiest);
   the break-in score, which the founder's unknowable-metric ban covers
   when it is a composite.
5. RELATION: the last chapter before the close; the close's doors lead to
   the trade pages, so this section must not carry its own doors per trade
   twice (once in the pager, once in the list).
6. THE LADDER: lead = the cheapest trade's cost (24, accent); support = the
   other trades' costs (16) and names; whisper = the basis.
7. THE CHANGE: one section, not three: the card pager without images, each
   trade a card with its cost to open and its door, the cheapest first and
   accented; the lowest-bar and next-easiest cards deleted with their kit
   markup. The row `city:trades`.

## 11. Where the risks sit (#8), What locals know (locals), Your own living costs (#2)

1. WHY: what should I watch out for, what do locals say, can I live here on
   what I make.
2. THE TAKEAWAY: for London today, nothing: the notes are placeholders and
   the runway is a modelled rent figure.
3. LOUD OR QUIET: quiet, when they draw.
4. HIDDEN: all three until a city holds real notes (data requirement for
   city notes); a placeholder note is a fabricated place detail.
5. RELATION: after the trades; before the close. Empty chapter today, so the
   chapter heading self-omits with them.
6. THE LADDER: lead = the note labels; support = the facts; whisper = none.
7. THE CHANGE: the note list from `locals_notes.json` keyed by city,
   self-omitting until notes exist; the runway and the risks recorded as
   data rows and their kit components deleted. The row `city:locals`.

## 12. The close (close)

1. WHY: where do I go from here.
2. THE TAKEAWAY: three doors: start in South London; every district of
   London; open a business in the United Kingdom; and the compare pill.
3. LOUD OR QUIET: quiet; doors are chrome.
4. HIDDEN: a door per trade (the trades section carries those).
5. RELATION: last; it must not repeat a door a section above already opened
   (the districts card's door went in run 25 for this reason).
6. THE LADDER: lead = the first door; support = the others; whisper = the
   pill.
7. THE CHANGE: none.
```

- [ ] **Step 3: Commit**

```bash
cd /e/atlas && git add design/loop/build/briefs/README.md design/loop/build/briefs/city.md && git commit -m "build loop: the brief's form and the city page's brief (art direction, 2026-09-07)"
```

---

### Task 2: The doctrine learns the DIRECT stage, the brief in the judge, and the plain report

**Files:**
- Modify: `E:\atlas\design\loop\build\DOCTRINE.md` (sections 4, 7, 8, 10)

- [ ] **Step 1: Write the patch script**

`scratchpad/arch/patch_doctrine_direct.py` (Write tool):

```python
import io
p = r"E:\atlas\design\loop\build\DOCTRINE.md"
s = io.open(p, encoding="utf-8").read()
def rep(old, new):
    global s
    assert s.count(old) == 1, old[:60]; s = s.replace(old, new)
rep("- S2 BUILD.", """- S1.5 DIRECT (the founder's ruling of 2026-09-07: "think for each section, why, how, how to make it better, how it will relate to the page, visual hierarchy"). Before any code, the section's block in `briefs/<page>.md` is written or re-read: why, the takeaway, loud or quiet by the page's budget, hidden, relation, the ladder, the change. A row whose block is missing is not built. A section that would be a fourth loud moment on its page is quiet, or a loud one gives way, and the brief says which.
- S2 BUILD.""")
rep("- Judge in the architecture doctrine's blocks (1 warrant, 2 figures, 3 honesty, 4 words, 5 form, 6 layout, 7 colour and tokens, 8 universality), and write \\"COULD BE WRONG BECAUSE\\".",
    "- Judge first against the section's brief (block 0: does the picture say the takeaway, at the rung the ladder gave it, loud or quiet as the page's budget says, with the hidden things hidden), then in the architecture doctrine's blocks (1 warrant, 2 figures, 3 honesty, 4 words, 5 form, 6 layout, 7 colour and tokens, 8 universality), and write \\"COULD BE WRONG BECAUSE\\".")
rep("""REPORT.md is one plain page: the bold paragraph first (what is built, what
was found, what was verified, what is committed), then "What is built",
"What the harness found and fixed", "One thing the pictures show", "Next".
No file paths except this loop's own files. The founder's second person,
plain words, no corporate register.""",
"""REPORT.md is eight lines a friend who designs would say, in this order: what
changed on the page (one line, the section and the difference a reader
sees); why (one line); what is loud on the page now and what went quiet (one
line); what was left out and why (one line); what the tests say (one line,
counts allowed); what the picture shows that the tests cannot (one line);
what is next (one line); what you can settle with one line in VERDICTS.txt
(one line). No file paths, no rule names, no gate names, no run numbers in
the body. The founder's second person. The run's closing message in chat is
the report's eight lines and the page picture (section 7, the strip), and
nothing else: "make my life easier" (2026-09-07).""")
io.open(p, "w", encoding="utf-8", newline="\n").write(s); print("doctrine patched")
```

- [ ] **Step 2: Run it**

Run: `cd /e/atlas/website && python scratchpad/arch/patch_doctrine_direct.py`
Expected: `doctrine patched`

- [ ] **Step 3: Read the three places back**

Run: `cd /e/atlas/design/loop/build && grep -n 'S1.5 DIRECT\|block 0\|eight lines' DOCTRINE.md`
Expected: three lines, one per change.

- [ ] **Step 4: Commit**

```bash
cd /e/atlas && git add design/loop/build/DOCTRINE.md && git commit -m "build loop: the DIRECT stage, the brief in the judge, the eight-line report (the founder's ruling of 2026-09-07)"
```

---

### Task 3: The page filter measures hierarchy: ACCENT BUDGET, NO LEAD, WALL

**Files:**
- Modify: `scripts/harness/check_page_holes.mjs` (the `inPage` function and the red loop)
- Create: `scripts/harness/fixtures/hierarchy.html`

- [ ] **Step 1: Write the fixture, three faults on one page**

`scripts/harness/fixtures/hierarchy.html` (the classes mirror the site's cards: a `rounded-[14px]` card under `main`; the stylesheet is not needed because the checks read computed styles the inline styles set):

```html
<!doctype html><html><head><meta charset="utf-8"><style>
:root { --terra-text: rgb(180, 70, 40); --c-ink: rgb(20, 20, 20); }
main { max-width: 1120px; margin: 0 auto; }
.card { border-radius: 14px; border: 1px solid #ddd; padding: 20px; margin: 32px 0; }
.card.rounded-\[14px\] {}
.fig { font-size: 20px; }
.loud { color: var(--terra-text); }
p { font-size: 14px; }
</style></head><body><main>
<section id="a" class="rounded-[14px] card"><div class="fig loud">x1.20</div><p>one</p></section>
<section id="b" class="rounded-[14px] card"><div class="fig loud">$22K</div><p>two</p></section>
<section id="c" class="rounded-[14px] card"><div class="fig loud">£4,000</div><p>three</p></section>
<section id="d" class="rounded-[14px] card"><div class="fig loud">31%</div><p>four: the fourth accent on one page</p></section>
<section id="e" class="rounded-[14px] card"><p>no lead</p><p>every line here is fourteen pixels</p><p>and nothing leads</p></section>
<section id="f" class="rounded-[14px] card" style="width:400px"><div class="fig">A lead</div><p>WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL WALL</p></section>
</main></body></html>
```

- [ ] **Step 2: Run the checker on the fixture before the change, to see it pass wrongly**

Run: `cd /e/atlas/website && node scripts/harness/check_page_holes.mjs scripts/harness/fixtures/hierarchy.html > scratchpad/hierarchy-before.txt 2>&1; echo "exit $?"`
Expected: `exit 0` and `page holes: 1 page(s) x 3 widths, 0 red(s)` in the file. The fixture's faults are invisible today; that is the point.

- [ ] **Step 3: Add the three measurements inside `inPage`**

In `scripts/harness/check_page_holes.mjs`, inside `inPage()`, replace the line

```js
  return { out, cut, pageScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 };
```

with

```js
  /* THE PAGE'S HIERARCHY (the founder's art-direction ruling of 2026-09-07):
     ACCENT BUDGET counts every text element in the accent colour on the page
     (a mark the founder ruled, like the people table's dots, carries
     data-founder-accent and is not counted); NO LEAD finds a card whose
     largest text is under 1.4 times its median text size, a card with no
     order for the eye; WALL finds a card whose text runs over 0.55 characters
     per pixel of card width per 100 pixels of height, a wall of prose
     (ruling 15). */
  const accentRgb = (() => { const d = document.createElement("div"); d.style.color = "var(--terra-text)"; document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; })();
  const accents = [...document.querySelectorAll("main *")].filter((el) => el.getClientRects().length && el.children.length === 0 && (el.textContent || "").trim() && !el.closest("[data-founder-accent]") && getComputedStyle(el).color === accentRgb).map((el) => (el.closest('[class*="rounded-[14px]"]')?.id || "card") + ": " + (el.textContent || "").trim().slice(0, 16));
  const hierarchy = [];
  for (const card of cards) {
    const id = card.id || card.querySelector("[id]")?.id || "card";
    const sizes = [...card.querySelectorAll("*")].filter((el) => el.getClientRects().length && el.children.length === 0 && (el.textContent || "").trim()).map((el) => parseFloat(getComputedStyle(el).fontSize)).sort((a, b) => a - b);
    if (sizes.length >= 3) { const median = sizes[Math.floor(sizes.length / 2)]; const lead = sizes[sizes.length - 1]; if (lead / median < 1.4) hierarchy.push({ id, rule: "NO LEAD", detail: `largest text ${lead}px against a median of ${median}px, under 1.4x` }); }
    const cb = card.getBoundingClientRect(); const chars = (card.textContent || "").replace(/\s+/g, " ").trim().length; const density = chars / (cb.width * cb.height / 100);
    if (density > 0.55) hierarchy.push({ id, rule: "WALL", detail: `${chars} characters in a ${Math.round(cb.width)}x${Math.round(cb.height)} card, ${density.toFixed(2)} per pixel of width per 100 of height` });
  }
  return { out, cut, accents, hierarchy, pageScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 };
```

- [ ] **Step 4: Report them as reds**

In the same file, replace

```js
    const { out, cut, pageScroll } = await page.evaluate(inPage);
    for (const c of cut) red(name, w, c.id, `ROWS CUT: the chart declares ${c.expect} rows and draws ${c.drawn}`);
```

with

```js
    const { out, cut, accents, hierarchy, pageScroll } = await page.evaluate(inPage);
    for (const c of cut) red(name, w, c.id, `ROWS CUT: the chart declares ${c.expect} rows and draws ${c.drawn}`);
    const BUDGET = 3;
    if (accents.length > BUDGET && w === WIDTHS[0]) red(name, w, "page", `ACCENT BUDGET: ${accents.length} accent figures on one page, over ${BUDGET} (${accents.join("; ")})`);
    if (w === WIDTHS[0]) for (const h of hierarchy) red(name, w, h.id, `${h.rule}: ${h.detail}`);
```

(`WIDTHS` is the checker's own `[1280, 768, 375]`; the two page-level rules run once, at the widest width, because a phone stacks what a desktop lays side by side and the counts do not change.)

- [ ] **Step 5: Run the checker on the fixture, expect three reds**

Run: `cd /e/atlas/website && node scripts/harness/check_page_holes.mjs scripts/harness/fixtures/hierarchy.html > scratchpad/hierarchy-after.txt 2>&1; echo "exit $?"; grep -E 'ACCENT BUDGET|NO LEAD|WALL' scratchpad/hierarchy-after.txt`
Expected: `exit 1`; one `ACCENT BUDGET: 4 accent figures`, one `NO LEAD` on card `e`, one `WALL` on card `f`.

- [ ] **Step 6: Run the page filter on the three real pages and read what it says about London today**

Run: `cd /e/atlas/website && npm run harness:page > scratchpad/harness-page-hierarchy.txt 2>&1; echo "exit $?"; grep -E 'ACCENT BUDGET|NO LEAD|WALL' scratchpad/harness-page-hierarchy.txt`
Expected: `exit 1` with `ACCENT BUDGET: 8 accent figures` on city-london (the count measured for this plan; the list names the eight cards). Any NO LEAD or WALL line is a finding for the brief, written into `briefs/city.md` under the section's block 7. The country and how-to pages may also red on the budget; each is a row of its own (`country:emphasis`, `howto:emphasis`) with the same brief form.

- [ ] **Step 7: Commit the checker and the fixture (the red on London stands until Task 4 lands; the chain does not run the page filter, so the commit is clean for the chain)**

```bash
cd /e/atlas/website && git add scripts/harness/check_page_holes.mjs scripts/harness/fixtures/hierarchy.html && git commit -m "harness: the page filter measures hierarchy (ACCENT BUDGET, NO LEAD, WALL), proved on a fixture"
```

---

### Task 4: The city page's emphasis, three loud moments

**Files:**
- Modify: `src/components/spine/archetypes/RankedBars.tsx` (an `emphasis` prop)
- Modify: `src/lib/spine/district_rows.ts` (nothing; the view passes the prop)
- Modify: `src/components/spine/city/where-to-trade.tsx` (`emphasis="quiet"`)
- Modify: `src/lib/spine/range_rows.ts` (`buildCityPremisesStrip`: no accented mark)
- Modify: `src/components/spine/city/city-view.tsx:205` and `:370` (terracotta to ink)
- Modify: `src/components/spine/city/chapters.tsx:94` (terracotta to ink)
- Modify: `src/components/spine/archetypes/stories.tsx` (the London districts story passes `emphasis="quiet"`, so the sheet draws what the page draws)

- [ ] **Step 1: The ranked bars learn to be quiet**

In `RankedBars.tsx`, add to `RankedBarsProps`:

```ts
  /** "loud": the leader's figure in the accent (a page's loud moment). "quiet": the leader bold in ink, its bar full tint; no accent text (the page brief's budget, 2026-09-07). */
  emphasis?: "loud" | "quiet";
```

add `emphasis = "loud"` to the destructured parameters, and change the two colour expressions:

```tsx
// the figure above the bar
style={{ marginBottom: 6, color: isLeader && emphasis === "loud" ? "var(--terra-text)" : "var(--c-ink)", fontWeight: isLeader ? 600 : 500 }}
// the phone table's figure
<span style={{ color: isLeader && emphasis === "loud" ? "var(--terra-text)" : "var(--c-ink)", fontWeight: isLeader ? 600 : 500 }}>{fmt(r.value)}</span>
```

The bar's own fill (`var(--terra)` for the leader, `var(--terra-border)` for the rest) stays: a filled bar is a mark, not a figure, and the budget counts figures.

- [ ] **Step 2: The district card and its story go quiet**

In `where-to-trade.tsx`, add `emphasis="quiet"` to the `<RankedBars` call. In `stories.tsx`, in the `city.map` block of `RankedBarsStories`, add `emphasis="quiet"` to its `<RankedBars` call.

- [ ] **Step 3: The premises strip goes quiet**

In `range_rows.ts`, in `buildCityPremisesStrip`, where the city's tier mark is built with `accent: true`, set `accent: false` and keep `bold: true` if the strip's mark type has it; if it has no weight field, add `bold?: boolean` to the mark type and let `RangeStrip.tsx` render `font-semibold` for a bold mark where it renders the accent colour for an accented one (the same conditional, a weight instead of a colour). Read the strip's mark type first: `cd /e/atlas/website && grep -n 'accent' src/lib/spine/range_rows.ts src/components/spine/archetypes/RangeStrip.tsx`.

- [ ] **Step 4: The three kit figures go to ink**

`city-view.tsx:205`: `text-[var(--terra-text)]` becomes `text-[var(--c-ink)]` on the spending pool's figure. `city-view.tsx:370`: the same on the lowest bar's cost. `chapters.tsx:94`: the same on the runway. Each is a one-token edit; these cards are replaced by their rows later (Task 5) and the brief says they are quiet either way.

- [ ] **Step 5: Typecheck, then the harness, each to a file**

Run: `cd /e/atlas/website && npx tsc --noEmit > scratchpad/tsc-emphasis.txt 2>&1; echo "exit $?"`
Expected: `exit 0`

Run: `cd /e/atlas/website && npm run harness > scratchpad/harness-emphasis.txt 2>&1; echo "exit $?"; grep -E 'archetype harness:|page holes|ACCENT BUDGET|NO LEAD|WALL' scratchpad/harness-emphasis.txt`
Expected: `exit 0`; `0 design red(s)` on the sheet; `page holes: 3 page(s) x 3 widths, 0 red(s)`; no ACCENT BUDGET line for city-london (three accents: the verdict, the earnings typical mark, and the trades' cheapest once Task 5's trades row lands; until then two).

Note for the sheet: the ranked-bars ACCENT rule in `check_archetypes.mjs` says exactly one accent text per ranked-bars card at 1280. A quiet card has none. Change that rule to `if (r.accents > 1)` for ranked bars and add `if (r.accents === 0 && !card.hasAttribute("data-quiet"))`... simpler and honest: have `RankedBars` stamp `data-emphasis={emphasis}` on its Box and have the rule read it: `const quiet = card.getAttribute("data-emphasis") === "quiet"; if (!quiet && r.accents !== 1) red(...); if (quiet && r.accents !== 0) red(r.inst, w, "ACCENT", "a quiet card wears the accent");`. The collector must copy the attribute: in `inPage`, after `r.state = ...`, add `r.emphasis = card.getAttribute("data-emphasis") || "";` and use `r.emphasis` in the rule.

- [ ] **Step 6: Photograph the districts card and the page strip (Task 6's tool, if built; else `shoot:page`) and read them**

Run: `cd /e/atlas/website && npm run shoot:page -- scratchpad/harness/pages/city-london.html "#districts" scratchpad/photos/emphasis-districts "1280,375" > scratchpad/shoot-emphasis.txt 2>&1; echo "exit $?"`
Expected: `exit 0`. Open both with the Read tool. The leader's figure is bold ink; the leader bar full tint. Judge against `briefs/city.md` block 3.

- [ ] **Step 7: Commit, both repos**

```bash
cd /e/atlas/website && git add src/components/spine/archetypes/RankedBars.tsx src/components/spine/city/where-to-trade.tsx src/components/spine/archetypes/stories.tsx src/lib/spine/range_rows.ts src/components/spine/archetypes/RangeStrip.tsx src/components/spine/city/city-view.tsx src/components/spine/city/chapters.tsx scripts/harness/check_archetypes.mjs && git commit -m "city: three loud moments; the districts and premises quiet, the kit figures in ink; ranked bars take an emphasis"
```

Then the loop's record (LEDGER, QUEUE row `city:emphasis` DONE, PAGES, STATE, REPORT in the eight-line form) and the parent commit as every run does.

---

### Task 5: The remaining city rows, each built to its brief

Each of these is one loop run in the existing stage order, with S1.5 now reading the block in `briefs/city.md` before S2. The bar is the same as every row: harness green, filter clean, the copy gate green on a lettered fixture, the exception deleted, photographed and judged against the brief, recorded.

**5a. `city:demand` (brief block 8).** One key-value grid card, `id="money-here"`, kicker `COPY.cityDemand.kicker` = "The money here", four cells: spent per resident a year, change on last year (the word "up" or "down" with the percent, never an arrow glyph), high-season share, low-season share. Builder `src/lib/spine/demand_rows.ts` exporting `buildCityDemandCells(seed): KvCell[] | null` (null under two cells). The `DemandSize` component and its stacked bar deleted from `city-view.tsx`; the two exceptions `city-view.tsx#3` and `#seasonal` deleted; the band `1-1` with the premises strip's neighbour rebalanced by the probe. Fixture for the copy gate: a seed with `spend_per_capita_usd: 22000`, `growth_pct: 3`, `high_season_share: 0.34`; expect four cells, the change cell's value `up 3%`.

**5b. `city:trades` (brief block 10).** The card pager without images: `buildCityTradeCards(seed)` in `src/lib/spine/trade_cards.ts`, one card per trade with a London figure, the cost to open as the figure, the cheapest first and `accent: true` on it only, each card a door to the trade's page proved by the copy gate's route scan; the `TradesHere` and both `LowestBar` cards deleted with their kit markup; exceptions `#trades`, `#6`, `#7` deleted. The page's third loud moment lands here. The `CardPager` archetype needs `image` optional if it is not already (read `CardPager.tsx` first: `grep -n 'image' src/components/spine/archetypes/CardPager.tsx`).

**5c. `city:locals` (brief block 11).** `NoteList` from `data/archetypes/locals_notes.json` keyed by city slug, `buildCityLocalsNotes(slug)` in `locals_rows.ts` beside the country builder, self-omitting until a city holds notes; `CityRisks`, `OwnerRunway` and `Locals` deleted from the view; exceptions `#8`, `#2`, `#locals` deleted; the chapter heading "What to watch" self-omits when its band draws nothing (the `Movement` guard already exists for empty chapters; read `city-view.tsx` around the risks band).

**5d. `kv-grid:tag-line` (found in run 23).** The modelled mark beside the label, where the two-line reserve absorbs it; the notes' tops added to the harness's UNEQUAL rule; every masthead re-photographed.

**5e. `city:PAGE-2`.** Every band re-measured with `npm run probe:page`, the band table in PAGES.md rewritten by hand, the census rewritten, the kit components with no caller left deleted, and the page strip (Task 6) opened and judged against the page block of the brief: three loud, the rhythm as written.

---

### Task 6: One picture of the whole page per run, with the loud moments outlined

**Files:**
- Create: `scripts/harness/page_strip.mjs`
- Modify: `package.json` (`"strip:page": "node scripts/harness/page_strip.mjs"`)

- [ ] **Step 1: Write the tool**

`scripts/harness/page_strip.mjs`:

```js
/* THE PAGE STRIP (the founder's "make my life easier", 2026-09-07): every card
   on a rendered page captured from the viewport at one width, stacked into
   one tall picture at a readable scale, with every accent figure outlined so
   the page's hierarchy is seen in one look. Viewport captures only: a
   full-page shot paints a white block over the atmosphere layers.
   usage: node scripts/harness/page_strip.mjs <rendered.html> <out.jpeg> [width=1280] */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { preflight } from "./preflight.mjs";

/* THE GROUND FIRST (sys:harness-preflight, run 24). */
preflight({ browser: true, name: "page_strip" });

const [, , file, out = "scratchpad/harness/shots/page-strip.jpeg", widthArg = "1280"] = process.argv;
if (!file) { console.error("usage: node scripts/harness/page_strip.mjs <rendered.html> <out.jpeg> [width]"); process.exit(2); }
const width = Number(widthArg);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
await p.goto(pathToFileURL(resolve(file)).href);
await p.evaluate(() => document.fonts && document.fonts.ready);
await p.evaluate(async () => { for (const im of document.images) { im.loading = "eager"; try { await im.decode(); } catch { /* the capture goes on */ } } });
/* outline every accent figure in the page's own accent colour, two pixels, so the loud moments read at a glance */
const accents = await p.evaluate(() => {
  const d = document.createElement("div"); d.style.color = "var(--terra-text)"; document.body.appendChild(d); const rgb = getComputedStyle(d).color; d.remove();
  let n = 0;
  for (const el of document.querySelectorAll("main *")) {
    if (!el.getClientRects().length || el.children.length || !(el.textContent || "").trim()) continue;
    if (getComputedStyle(el).color !== rgb || el.closest("[data-founder-accent]")) continue;
    el.style.outline = "2px solid " + rgb; el.style.outlineOffset = "4px"; n++;
  }
  return n;
});
const cards = await p.evaluate(() => [...document.querySelectorAll('main [class*="rounded-[14px]"]')].filter((c) => c.getClientRects().length && !c.parentElement.closest('[class*="rounded-[14px]"]')).map((c) => { const r = c.getBoundingClientRect(); return { id: c.id || "card", x: r.left, y: r.top + scrollY, w: r.width, h: r.height }; }));
/* capture each card from the viewport, then stack the buffers with a canvas in a second page */
const shots = [];
for (const c of cards) {
  await p.evaluate((y) => window.scrollTo(0, Math.max(0, y - 16)), c.y);
  await p.waitForTimeout(50);
  const r = await p.evaluate((id) => { const el = document.getElementById(id) || document.querySelector('main [class*="rounded-[14px]"]'); const b = el.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: Math.min(b.height, 880) }; }, c.id);
  const buf = await p.screenshot({ clip: { x: r.x, y: r.y, width: r.w, height: r.h }, type: "png" });
  shots.push({ id: c.id, w: r.w, h: r.h, png: buf.toString("base64") });
}
const stitcher = await b.newPage({ viewport: { width, height: 900 } });
await stitcher.setContent(`<body style="margin:0;background:#f4f1ea"><canvas id="c"></canvas></body>`);
const dataUrl = await stitcher.evaluate(async (shots) => {
  const GAP = 24, SCALE = 0.5;
  const imgs = await Promise.all(shots.map((s) => new Promise((ok) => { const im = new Image(); im.onload = () => ok(im); im.src = "data:image/png;base64," + s.png; })));
  const W = Math.max(...shots.map((s) => s.w)) * SCALE, H = shots.reduce((a, s) => a + s.h * SCALE + GAP, GAP);
  const c = document.getElementById("c"); c.width = W + 2 * GAP; c.height = H; const g = c.getContext("2d");
  g.fillStyle = "#f4f1ea"; g.fillRect(0, 0, c.width, c.height);
  let y = GAP;
  imgs.forEach((im, i) => { g.drawImage(im, GAP, y, shots[i].w * SCALE, shots[i].h * SCALE); y += shots[i].h * SCALE + GAP; });
  return c.toDataURL("image/jpeg", 0.8);
}, shots);
const { writeFileSync, mkdirSync } = await import("node:fs");
mkdirSync(resolve(out, ".."), { recursive: true });
writeFileSync(out, Buffer.from(dataUrl.split(",")[1], "base64"));
console.log(`page strip: ${cards.length} cards, ${accents} accent figures outlined, ${out}`);
await b.close();
```

- [ ] **Step 2: The npm script**

In `package.json`, after `"photo:diff"`, add `"strip:page": "node scripts/harness/page_strip.mjs",`.

- [ ] **Step 3: Prove it on London**

Run: `cd /e/atlas/website && npm run strip:page -- scratchpad/harness/pages/city-london.html scratchpad/harness/shots/city-london-strip.jpeg > scratchpad/strip.txt 2>&1; echo "exit $?"; tail -1 scratchpad/strip.txt`
Expected: `exit 0`; `page strip: 14 cards, N accent figures outlined` (N is 8 before Task 4, 2 or 3 after). Open the picture with the Read tool: one tall column of cards at half scale, the accent figures outlined.

- [ ] **Step 4: The gate that keeps every harness script on its ground already covers the new file**

Run: `cd /e/atlas/website && npx tsx scripts/verify_harness_preflight.ts > scratchpad/gate-preflight-strip.txt 2>&1; echo "exit $?"; cat scratchpad/gate-preflight-strip.txt`
Expected: `exit 0`; `11 scripts check their ground first; 0 red(s)`.

- [ ] **Step 5: Commit**

```bash
cd /e/atlas/website && git add scripts/harness/page_strip.mjs package.json && git commit -m "harness: one picture of the whole page per run, the accent figures outlined (strip:page)"
```

From this commit on, every run's closing message carries the strip, sent with SendUserFile, and the eight lines. Nothing else.

---

### Task 7: The queue and the state, so the loop takes these in order

**Files:**
- Modify: `E:\atlas\design\loop\build\QUEUE.md`
- Modify: `E:\atlas\design\loop\build\STATE.md`

- [ ] **Step 1: The rows, in the order the loop takes them**

Insert into QUEUE.md section B (systems) and section C (the city page), with a Write-tool python script that asserts each anchor once:

```
| city:brief | PAGE | the city page's brief, written and committed | Task 1 of the 2026-09-07 plan: briefs/README.md and briefs/city.md, the page block and fifteen section blocks, every heading filled; the doctrine's S1.5 (Task 2) | TODO (plan 2026-09-07, run 26) |
| sys:page-hierarchy | SYSTEM | the page filter measures hierarchy | Task 3: ACCENT BUDGET (three per page), NO LEAD (1.4x), WALL; proved on fixtures/hierarchy.html; the London count read | TODO (plan 2026-09-07, run 27) |
| city:emphasis | SECTION | three loud moments on the city page | Task 4: ranked bars take an emphasis; districts and premises quiet; the three kit figures in ink; the sheet's ranked-bars ACCENT rule reads data-emphasis; the filter's budget green on London | TODO (plan 2026-09-07, run 28) |
| sys:page-strip | SYSTEM | one picture of the whole page per run | Task 6: strip:page, the accent figures outlined; from then on the closing message is the eight lines and the strip | TODO (plan 2026-09-07, run 29) |
```

and the existing rows `city:demand`, `city:trades`, `city:locals`, `kv-grid:tag-line`, `city:PAGE-2` gain the words "built to briefs/city.md block N" in their done-means column (blocks 8, 10, 11, and the page block for PAGE-2).

- [ ] **Step 2: STATE.md's next step names Task 0 and Task 1 as run 26's work**

Set `next-step:` to: "the debug pass first; then city:brief (the 2026-09-07 plan, Tasks 0 to 2): the founder's words appended verbatim, briefs/README.md and briefs/city.md written, the doctrine's S1.5 DIRECT, the judge's block 0 and the eight-line report; no code that run".

- [ ] **Step 3: Commit**

```bash
cd /e/atlas && git add design/loop/build/QUEUE.md design/loop/build/STATE.md && git commit -m "build loop: the art-direction rows queued (plan 2026-09-07)"
```

---

## Self-review

**Spec coverage.** The founder's four sentences map to: "think for each section, why, how, better, relation, hierarchy" = Task 1 (the brief with seven headings, filled for fifteen sections) and Task 2 (the stage that makes it mandatory and the judge that reads it); "the graphics don't know what to emphasize, how to emphasize, show by not showing" = Task 1's page block (three loud moments, the hidden lists) and Task 4 (the emphasis applied); "the harness and architecture can be improved as a whole" = Task 3 (page-level hierarchy measured) and Task 6 (the page seen whole); "make my life easier" = Task 2's eight-line report and Task 6's one picture. The remaining city rows (Task 5) are the existing plan's, now each bound to a brief block.

**Placeholder scan.** Task 4 Step 3 tells the engineer to read the strip's mark type before editing because the field name was not verified while writing this plan; the two alternatives are both spelled out. Task 5 gives each row its builder name, file, fixture and exceptions but not its full code, because each row is a loop run with the stage procedure already written in DOCTRINE.md; the code of the last four rows (runs 22 to 25) is the pattern and is in the ledger by file.

**Type consistency.** `emphasis?: "loud" | "quiet"` is the prop's name in Task 4 Steps 1, 2 and 5 and in the queue row; `data-emphasis` is the attribute in Step 5 and the checker; `data-founder-accent` is the attribute in Task 3 and Task 6; `preflight({ browser: true, name })` matches `scripts/harness/preflight.mjs` as committed in run 24; `buildCityPremisesStrip` is the builder committed in run 13.
