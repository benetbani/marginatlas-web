# THE GRAPHICS REVIEW

**Every graphic on marginatlas.com, checked against how financial products
actually visualise money, with three options and a verdict for each family.**

2026-08-19. Analysis only: **nothing was changed and nothing was built.**

Sources, all produced today and all in `docs/superpowers/research/`:

| File | What it holds |
|---|---|
| `2026-08-19-graphics-inventory.md` | ~150 graphics, 193 rows, 15 sections, built on a render graph |
| `2026-08-19-financial-dataviz-practice.md` | 770 lines. Stripe, Ramp, Xero, QuickBooks, Baremetrics, Koyfin, FT; Cleveland-McGill, Few, Correll |
| `2026-08-19-tables-forms-inventory.md` | tables, forms, and a 55-surface stat census |
| `2026-08-19-graphics-rendered-observations.md` | what I measured on the painted page |

---

## 0. THE HEADLINE, in four sentences

**The individual graphics are better than expected. The problem is that there
are five of each.** The bar primitives are arithmetically correct, zero-based
and directly labelled, which is the top of the perceptual accuracy ranking, and
the founder's instinct that "maybe the current version is the best one" is right
more often than not. **What is wrong is not quality but multiplicity**: six
percentile-spread charts that disagree about their axis, five "where each $100
goes", five month-of-year charts that disagree about their baseline, nine gauge
geometries, and three components named `Waterfall` of which the only real one
has no call site. **And roughly a third of the graphics render nowhere at all.**

So the recommendation is overwhelmingly **converge, do not redesign.**

---

## 1. WHAT THE RESEARCH SAYS, and it points the same way

The single most repeated finding across Stripe, Ramp, Xero and QuickBooks is
**not "more charts"** but the opposite:

> **A table or list is the primary surface; charts are summaries hung above it.**

Stripe leads with tables and treats charts as summaries. Xero and QuickBooks draw
a P&L as **a table with a percent-of-revenue column, never a chart.** Ramp is
described as finance dashboards being to-do lists wearing charts. **Nobody
serious draws a cost base as a pie.** Density is survived through typography and
alignment, not colour.

Three evidence points that change specific decisions here:

- **Cleveland-McGill replicates but is a tie-breaker, not a law.** Zeng and Battle
  (CHI 2023, 59 papers) document real contradictions, including that pies read as
  *area* rather than angle and that bar-length bias varies with aspect ratio.
- **The zero-baseline rule is half-unsupported.** Correll, Bertini and Franconeri
  found truncation inflated perceived severity in **both** bars and lines with no
  significant difference, and break markers did not help. Bars-at-zero is
  uncontested; "lines may crop" is a choice to overstate.
- **Gauges: no controlled study of decision quality exists.** The case against is
  expert judgement plus the perceptual ranking. That is enough to prefer a bullet
  graph, not enough to call a radial form a defect.

**And one gift.** Few's bullet-graph specification independently mandates exactly
this house's palette rule: qualitative ranges as **distinct intensities from dark
to light of a single hue**, for colourblind safety, capped at five bands and
ideally three. The one-hue rule has been house preference; it now has an
authoritative citation.

---

## 2. THE FAMILIES. Three options and a verdict for each.

### FAMILY A — The cost breakdown, "where each $100 goes"

**Five implementations.** `MoneyGoesBreakdown` is the reference: a segmented bar
plus a ruled table, every row anchored to a stated $100 whole, cost rows in a
**monotonic neutral ladder** and the "Kept" row the sole accent.

| | Option | Assessment |
|---|---|---|
| **A1** | **Keep `MoneyGoesBreakdown`, retire the other four** | **CHOSEN.** It already matches what Xero and QuickBooks do, and its per-$100 denominator is a better idea than either of them: it makes every row anchored by construction. |
| A2 | Waterfall from revenue down to take-home | Rejected as the primary. A waterfall shows a *sequence of deductions*; readers must track a running balance. The per-$100 table needs no running total. Keep as a secondary on the cell page only. |
| A3 | Stacked bar alone, no table | Rejected. Loses exact values, and part-to-whole judgement in a stacked bar is area comparison, which is low on the accuracy ranking. |

**Change to recommend even to the chosen version:** add the percent-of-revenue
column explicitly rather than leaving it implied by the $100 framing. Xero and
QuickBooks both print it, and it costs one column.

---

### FAMILY B — The distribution (p10 / p50 / p90)

**Six implementations that disagree about the axis: two log, three linear, one
zero-based, and only one has a tick axis.** That is the single worst
inconsistency found.

| | Option | Assessment |
|---|---|---|
| **B1** | **Standardise on `RangeStrip`, one linear scale, p50 the only accent** | **CHOSEN.** It is the site's stated anti-lone-figure device and it works: p50 anchors p10 and p90 so no figure is ever alone. It is already live on seven routes. |
| B2 | Box plot | **Rejected outright.** Box plots are misread through heuristic reasoning that is "very difficult to overcome", and the effect is found in experts too. |
| B3 | Three numbers, no graphic (Baremetrics' instinct) | Viable and worth keeping as the **compact variant** where vertical space is tight. It is honest and it never distorts. Not the primary, because the strip communicates spread at a glance. |

**The decision the founder must make is the axis, not the form.** Six charts, two
of them logarithmic, showing the same kind of quantity, is a correctness problem:
a reader who learns to read one learns to misread another.

---

### FAMILY C — The single score, and the nine gauges

Nine distinct gauge geometries exist. `ThresholdGauge` is, despite its name, a
**linear meter** encoding by position along a common scale, which is the
strongest channel. `MarginIndexBadge` is a ring. `DialGauge` is a needle.

| | Option | Assessment |
|---|---|---|
| **C1** | **Bullet graph as the single form for "value against a target or band"** | **CHOSEN** where a target exists. Few's spec, one hue at three intensities, is directly citable and matches the palette rule exactly. |
| C2 | Keep a radial form for the badge, as texture | **Acceptable, with conditions.** A ring restating a printed number is decoration doing no harm. Conditions: no tick marks implying precision, one hue, and never the only carrier of the value. |
| C3 | Kill all radial forms | Rejected as overreach. No controlled study supports it, and the ring badge is a recognisable object on a leaderboard. |

**The real finding here is not the geometry.** It is that these scores are
**structurally unanchored**: `MarginIndexBadge`, `ScoreBand` with no peers,
`PowerGauge`, `DialGauge` and `CoverageBadge` each plot a figure against a fixed
0-100 or 0-5 scale and a band word, **never against another place's same score,
even though that data exists.** Adding one peer tick to `ScoreBand` (it already
supports a `peers` prop that callers do not pass) is the cheapest high-value
change in this entire review.

---

### FAMILY D — Ranked lists and leaderboards

| | Option | Assessment |
|---|---|---|
| **D1** | **Row + bar + printed value, sorted, bar scaled to the leader** | **CHOSEN.** This is what `TierBar`, `RankRow` and `DecisionRow` already do, and it is what Stripe does. Verified arithmetically: $138K = 100%, $96K = 69.57%, $18K = 13.04%. |
| D2 | Table with no bars | The purist option, and defensible for lookup. Rejected because the bar costs nothing and makes rank pre-attentive. |
| D3 | Dot plot | Better for tightly clustered values; worse for magnitude. Keep in reserve for the case where the top and bottom differ by under 20%. |

**Change to recommend:** `TierBar` renders with **no accent at all** — no
highlight of the subject row. `LikeForLikeBars` does highlight the subject. Two
components, same job, opposite decisions. Pick the highlight.

---

### FAMILY E — One place against a benchmark

| | Option | Assessment |
|---|---|---|
| **E1** | **`VsWorld`: two bars plus a computed delta badge** | **CHOSEN.** Fully anchored by construction, and the delta badge is the accent. This is the pattern the rest of the site should borrow. |
| E2 | A single bar with a reference line | Compact, good in a table cell. Keep as the inline variant. |
| E3 | Index the benchmark to 100 | Rejected for this audience. It hides the currency amount, which is the thing an owner came for. |

---

### FAMILY F — The headline figure

**Two masthead systems that disagree about hierarchy.** `AnswerFirstMasthead`
enforces a real size ratio (anchor `text-4xl/5xl` against stats at `text-lg`).
The engraved country `Scorecard` renders **all eight cells at equal weight**, so
the country page has **no visual signal for which number matters** — the only
page type without one.

| | Option | Assessment |
|---|---|---|
| **F1** | **`AnswerFirstMasthead`'s ratio everywhere: one dominant figure, everything else demoted** | **CHOSEN.** It matches the research exactly: large number, small label, small comparison, at most one word-sized graphic. |
| F2 | Equal-weight scorecard | Rejected as a primary. It is a *reference table* pretending to be a hero. |
| F3 | Dominant figure plus sparkline | Rejected: we have no time series for most quantities, and a sparkline with three points is noise. |

---

### FAMILY G — Tables. The biggest gap, and the cheapest wins.

Three measured facts:

1. **The house tabular-figures rule (`globals.css:12`) is used ZERO times.** Three
   unrelated mechanisms deliver it instead, and **`Money.tsx` — the one component
   whose entire job is printing money — carries none.**
2. **No table anywhere has a sticky header row.** One has a sticky label column.
3. **Thirteen files contain a `<table>` with no `scope` at all**, while the kit
   primitives that get semantics right are barely used.

| | Option | Assessment |
|---|---|---|
| **G1** | **One table primitive: right-aligned numerics, tabular figures, `<th scope>`, sticky header, units in the header** | **CHOSEN.** Every one of these is uncontested in the research and none is a design question. |
| G2 | Keep page-built tables, add the properties in place | Rejected: thirteen files, and it will drift again. |
| G3 | Add inline bars to every numeric cell | Rejected as a default. Good on a leaderboard, noise in a reference table. Make it opt-in. |

**This family is where the review's value is concentrated.** The graphics are
mostly right; the tables are missing properties that cost nothing and that every
financial product in the study set has.

---

### FAMILY H — The waterfall, and a naming trap

**Three components named `Waterfall`.** One is actually a waterfall and **has no
call site.** The one that ships is called `SteppedWaterfall`. A third is a local
function inside `download/2026-benchmarks/page.tsx`.

| | Option | Assessment |
|---|---|---|
| **H1** | **Keep one waterfall, on the cell page only, as the secondary to Family A** | **CHOSEN.** |
| H2 | Waterfall as the primary cost view | Rejected, see A2. |
| H3 | Remove waterfalls entirely | Rejected. The revenue-to-take-home walk is the one place a reader genuinely wants the sequence. |

---

### FAMILY I — Seasonality / month-of-year

**Five implementations that disagree about whether the baseline is zero or the
average.** That is not a style difference: a reader cannot tell whether a bar
means "this much trade" or "this much above normal".

| | Option | Assessment |
|---|---|---|
| **I1** | **Index to the annual average, diverging from a zero line, one hue either side by intensity** | **CHOSEN.** Seasonality is inherently a deviation quantity, and the honest encoding says so. |
| I2 | Absolute monthly values, zero-based bars | Defensible and simpler; loses the pattern in the noise when the annual range is narrow. |
| I3 | Line chart | Rejected: twelve discrete periods are categories, not a continuum. |

---

### FAMILY J — Maps

Multiple map components (`WorldMapPicker`, `WorldMapClient`, `CitiesWorldMap`,
`CityDistrictMap`, `SpineMap`). The founder has already ruled the homepage map
should be **smaller**.

| | Option | Assessment |
|---|---|---|
| **J1** | **Map as a navigation device, not an analytical one** | **CHOSEN.** It answers "is my place here", which is a door, not an analysis. It should be small and it should not try to encode a quantity. |
| J2 | Choropleth encoding a metric | Rejected. Area distorts by country size, and our coverage is uneven enough that a choropleth would read as a data claim we cannot support. |
| J3 | Dot map, one dot per covered place | Worth considering as the honest coverage picture: it shows density without implying the whole country is measured. |

---

## 3. THE FOUR THINGS TO FIX REGARDLESS OF ANY REDESIGN

**1. The `meaningStep` colour ladder is broken, and it is on the default-live
country page.** Ten engraved sections are coloured by a ladder that is
**non-monotonic on all three perceptual channels**: hue 4.7 → 28.2 → 30.0 → 8.6;
luminance .048 → **.010** → .060 → .074, so the *second* step is the darkest
thing on the page; saturation 63 → 35 → 26 → 100. **Steps 3 and 4 are
byte-identical**, so five rungs resolve to four. `PowerGauge` renders it as five
swatches and `FootingLegend` **prints it to the reader as a key** — the broken
ramp is shown as the legend explaining itself. Figures computed from the tokens,
not asserted.

**2. Brown is inside the charts.** `#87745D` and `#C3B39C` (the cocoa ramp) act
as bar tones, not just text. Charter §8 bans brown. As text it is a palette
question; as a bar tone it is also an **encoding** question, because it puts a
second hue into charts whose rule is intensity in one hue.

**3. Figures appear alone.** The stat census found the pattern everywhere: every
homepage KPI tile grid, every coverage-counter band, and every single-score
gauge. The counter-examples exist and are good — `RangeStrip`, `Specimen`,
`VsWorld`, `MoneyGoesBreakdown`, `CheckResult`, `Neighbours`, the `/decide`
podium. **The fix is to extend the pattern the site already has, not to invent
one.**

**4. Roughly a third of the graphics render nowhere.** ~30 have no mount point.
Nine more are mounted on the live country page but permanently fed `notHeld()`,
so the frame and empty state ship and the chart has never held a number. Nine
render only from `_design`, a Next private folder, so they appear on **no URL at
all** — including four of the five `board/charts`.

---

## 4. WHAT NOT TO CHANGE

Stated plainly, because the instruction was not to change everything:

- **The bar primitives.** Zero-based, max-normalised, directly labelled. Verified
  arithmetically. These are correct and should be left alone.
- **`RangeStrip` and `PercentileStrip`.** The anti-lone-figure device works.
- **`MoneyGoesBreakdown`.** Monotonic neutral ladder, single accent on "Kept".
- **`VsWorld`, `Neighbours`, `CheckResult`, the `/decide` podium.** Anchored by
  construction, with an explicit code comment about honest bar scaling.
- **`ThresholdGauge`.** A linear meter with a misleading name. Rename at most.
- **Direct labelling over legends**, already the norm here.
- **The div-and-CSS approach to bars.** It inherits the type system, it reflows,
  and it cannot suffer the `preserveAspectRatio="none"` distortion the backlog
  records at six SVG sites. Its accessibility gap is genuinely mitigated by every
  value being printed as text.

---

## 5. RECOMMENDED ORDER, by value against effort

| # | Change | Why it is first |
|---|---|---|
| 1 | Tabular figures on `Money.tsx` and every numeric column | One property, zero design risk, and the cheapest credibility win available |
| 2 | Fix or retire the `meaningStep` ladder | It is live, it is shown to the reader as a legend, and it is measurably broken |
| 3 | Pass `peers` to `ScoreBand` | The prop already exists; it turns five unanchored scores into anchored ones |
| 4 | One axis convention for all six distribution charts | Two of them are logarithmic; this is a correctness issue |
| 5 | One table primitive, with `scope` and a sticky header | Thirteen files currently get semantics wrong |
| 6 | Decide the seasonality baseline once | Five charts, two meanings, no way for a reader to tell |
| 7 | Retire the ~30 graphics with no call site | Dead surface makes every inventory lie |
| 8 | Give the country `Scorecard` a dominant figure | It is the only page type with no hierarchy signal |

---

## 6. WHAT THIS REVIEW CANNOT SEE

- **Marketing pages show a best case, not a typical screen.** Mercury's and
  Ramp's homepages had no charts at all. Much of the practice research is
  third-party design analysis rather than authenticated product screens.
- **Perceptual studies measure reading precision, not trust or beauty** — which is
  what the founder is actually asking about. Nothing here can settle taste.
- **Nine research pages were unfetchable**, including the Cleveland-McGill primary
  and the fintech typography source, so **currency placement is left explicitly
  unresolved.** They are listed as unread rather than summarised from memory.
- **Only one of the four chart kits was rendered and looked at.** `board/charts`,
  `spine2` and `ui` have no showcase anywhere, so their verdicts rest on code
  reading plus the render graph.
- **Sample content only.** Empty, negative, single-item and long-list states are
  the untested half of every primitive.
- **Which surface production actually serves is not in this repo.** Seven runtime
  gates resolve OFF with no env vars set; the live values are Vercel settings. 63
  of 226 live-reachable components sit behind a gate, including the entire
  rebuilt cell page.
- **No screenshots.** The Browser pane would not composite, so every measurement
  here is DOM geometry and computed style: precise about number, silent about
  whether it looks good. **That judgement is the founder's and this review does
  not attempt it.**
