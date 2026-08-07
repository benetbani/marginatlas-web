# Visual reform , design spec

*2026-08-07. Written after the founder rejected the visual execution of
`/dev/cell2`, `/dev/industry2` and `/dev/hood2`. 44 defects captured in
`design/loop5/FOUNDER-REVIEW-2026-08-07.md`.*

**His verdict:** *"Now the pages are publishable, but they are not digestible.
They feel like statistical reports that are so ugly."*

---

## 1. The diagnosis, measured

Every number here came from a command, not an impression.

| finding | measured | what it means |
|---|---|---|
| `Statblock` used **17** times; next highest **3** | `grep` over the three pages | The label-value list is the default. It is the shape he called *"very disgusting, unreadable"* |
| **46** drawing components exist | `ls src/components/spine2/*.tsx` | The kit was never short. It was not reached for |
| **27** glyphs used of **220** drawn | script over the glyph registry | **193 icons sit unused.** "Too few" is literally true |
| Industry and hood pages render icons at **one size, 18px** | rendered measurement | No hierarchy. An icon that is always the same size carries no meaning |
| **25 of 38** sections exceed 20 words of prose | rendered measurement | Worst: 273w, 110w, 105w, 99w, 92w |
| Hero is **809px** against a real **740px** viewport | measured at three viewports | Fits at 900, overflows a laptop by 69px and a 13-inch by 169px |
| **6** column imbalances over 24px | rendered measurement | Worst gap **313px** on the cell hero, 187px on chapter 06 |

### The five roots

1. **A subsection was treated as a container for facts, not as a drawing.** Any
   time the data had more than one number, `Statblock` was reached for.
2. **Prose was written to patch ambiguous figures.** Ten patched figures is a
   document.
3. **Nothing ever measured a page as a composition.** Every check inspected one
   row, one value, one tap target. None asked "is the hero one screen", "are
   these columns level", "is this bar the right shape for what it encodes".
4. **Earlier rulings decayed because they were never gates.** The struck-through
   rule, the blank-subsection rule and the failure-myth rule were all given
   before and all came back.
5. **Affordance was never checked.** A slider that does not look draggable and a
   link that does not look clickable are correct in the DOM and invisible to
   every existing check.

---

## 2. The four ratified decisions

Taken 2026-08-07.

| | decision |
|---|---|
| **Drawing model** | **A catalogue the founder rules on ONCE.** Ten shapes on one page. He says keep, kill or fix per shape. After that every subsection must use a survivor, and a gate enforces it. He judges shapes, never instances |
| **Text budget** | **One drawing plus at most 20 words of prose.** Hard. Gated. The method chapter is the only exemption |
| **Sequence** | **Catalogue first, built currency-aware**, so nothing is drawn twice |
| **Currencies** | Eight to ten majors, so a reader outside the dollar world reads their own context |

---

## 3. The catalogue

**Ten shapes. Every one already exists** in `design/mockups/atlas.css` or the
`spine2` kit. This is an inventory of what he already drew, not a new
vocabulary. That is the whole point: the failure was not using it.

| # | Shape | What it encodes | Built from | Fixes |
|---|---|---|---|---|
| 1 | **Spend walk** , one unit of money stepped down to what is left | a sequence of subtractions | `Take`, `.cascade` | **Already approved.** Chapter 04 |
| 2 | **Proportional stack** , parts of 100, heights exactly the money | a partition that totals | `Hundred`, `ColSplit`, `SBar` | Chapter 06; the industry hundred |
| 3 | **Month strip** , 12 narrow tall bars above and below a baseline | a value across a year | `MonthDeviation` | **His own fix.** Chapter 10 |
| 4 | **Single answer** , one figure, one qualifier, nothing else | the page's one number | `Fig` | The hero |
| 5 | **Ranked bars, label ON the bar** | few items, ordered | `RankBarsV2`, `ShrinkBars` | I3, the eye-angle defect |
| 6 | **Unit grid** , 100 marks, N shaded | a proportion of a population | `UnitGrid`, `Hundred` | "25 in 100 pay their owner" |
| 7 | **Lever set** , redrawn for affordance | inputs a reader changes | `Calc`, `Ctl`, `TrackBar` | C9, C10, C11, C12, C13 |
| 8 | **Two-way compare** , one axis, this against that | a position among peers | `Matrix`, `.against` | The benchmark block |
| 9 | **Survival curve** | decay over years | `Tline`, `SparkTrend` | Chapter 12, replacing the banned myth block |
| 10 | **Range band** , a value inside its spread | a distribution | `Range`, `Band`, `AxisDots` | Quartiles |

### Banned outright

- **`Statblock` as a default.** Permitted only as a genuine short ledger, hard
  capped at **4 rows**, never as the answer to "I have several numbers". It is
  the single biggest cause of the rejection.
- **The struck-through sentence with a rule over it.** Raised three times.
- **Blank subsections.** Every slot renders something. His instruction is
  explicit: *"Try to write something in all of them, even if it is not true,
  because we care about the visual aspect."* On a dev route that means a
  `SampleTag` figure; on a shipping route it means the shape renders with a
  stated gap, never an empty panel.
- **Prose expanders** such as *"show the same thing in plain words"*.
- **A subsection whose content is only text.**

---

## 4. The rules, and every one is gated

A rule that is not a gate decays. That is root cause 4 and it is not repeated
here.

### 4.1 Text budget , `verify_subsection_text`

**One drawing plus at most 20 words of prose per subsection.**

- Counted over `<p>` text inside a `section`, which is prose. Figures, labels,
  axis text and the caption on a drawing are not prose and do not count.
- **One exemption:** the method chapter, which exists to be read.
- Current state: **25 of 38 sections fail.** That is the work.

### 4.2 Icon scale , raise it and widen it

He said **"too small and too few"**, and 193 unused glyphs make the second half
literally true.

| role | today | ratified |
|---|---|---|
| chapter or section head | 18 | **24** |
| inline in a row | 13 | **16** |
| tile or card mark | 24 | **32** |
| **drawing anchor** (new) | , | **40** |
| pricing tick | 14 | 14, unchanged, it sits in a 74px column |

**And an icon must mean something.** A page that uses one glyph at one size has
decoration, not a system. The rule: **within a page, no glyph repeats across two
different chapters.** With 220 drawn there is no excuse, and it converts the
library from ornament into a wayfinding vocabulary.

### 4.3 Composition , `verify_composition`

The three things nothing has ever measured.

- **The hero fits one screen at 740px.** Measured at 1440x740, not 900. Today it
  is 809.
- **Columns inside one section are level**, within 24px. Today there are 6
  breaches, worst 313px. His own fix is the ratified one: **widen one column to
  compensate** rather than letting one run long.
- **Table content never touches the sheet edge.** Minimum 12px inside. Raised on
  two separate pages.

### 4.4 Affordance , `verify_affordance`

- **A slider must read as draggable**: a handle at least 28px, a visible track,
  and a grab cursor. His words: *"the visual effect does not make them dominant
  enough"*, and *"the icon you have chosen for the lever does not look like a
  lever at all"*.
- **A link must read as clickable.** On the hood page the districts are anchors
  and look like text.
- **Every input states its unit.** *"Staff cost"* must say per year or per
  month. Mixing an annual figure with "orders a day" in one panel is the defect.

### 4.5 Copy

- The hero states the answer. It does not explain the methodology. Both
  sentences he called catastrophic were methodology in the hero.
- No robotic provenance prose in a reading position. The industry provenance
  line is the named example.
- Freshness reads **"Updated 2026"**, small, top right. Not "Reviewed July 2026".

---

## 5. Currencies

**Ten.** His eight, plus two chosen to cover the largest remaining readerships.

| | | |
|---|---|---|
| USD | dollar | the base every figure is already held in |
| EUR | euro | |
| GBP | pound | |
| CNY | yuan | |
| JPY | yen | |
| RUB | rouble | |
| BRL | Brazilian real | |
| INR | Indian rupee | |
| **IDR** | Indonesian rupiah | fourth most populous country, no major currency near it |
| **NGN** | Nigerian naira | the largest African readership, and the site already cites Lagos |

**Why this shapes the catalogue rather than following it.** `Rs 51,00,000` and
`Rp 9.500.000` are far longer than `$618K`. A drawing whose label column is
tuned to a dollar figure breaks on a rupiah one. **Every catalogue shape is
therefore built and reviewed against both a short and a long figure**, which is
exactly why the sequence decision was catalogue-first.

Rates are **pinned and dated**, never live. A benchmark that moves because a
currency moved is not a benchmark. The pinned rate and its date render with the
figure, which is the same provenance discipline every other number carries.

---

## 6. What is not in dispute

He named one thing he likes: **chapter 04, the spend walk.** A drawing that
carries its own meaning, needs no paragraph, and puts each number on the thing
it describes rather than in a column beside it.

**That is the bar for all ten.** Where a catalogue shape cannot meet it, the
shape is wrong, not the data.

---

## 7. Delivery

| phase | output | who judges |
|---|---|---|
| **1** | The catalogue page. Ten shapes, each rendered twice, once with `$618K` and once with `Rp 9.500.000` | **He rules once:** keep / kill / fix |
| **2** | The four gates, written against the survivors | automated |
| **3** | Cell page rebuilt from the catalogue. 25 defects | he reviews the page |
| **4** | Trade and neighbourhood pages rebuilt | he reviews |
| **5** | Currency switcher wired through | automated |

**Phase 1 is the only thing that needs him, and it needs him once.** Everything
after is enforced.

### Blocked

**The background photograph.** He supplied it in chat; it cannot be written to
disk from there. It needs a path, for example `design/mockups/bg.jpg`. The v2
system already has the background layer (`Place`, `public/spine/london.jpeg`),
so this is a one-line swap once the file exists.
