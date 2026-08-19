# 01 — THE FIVE FAMILIES, SPECIFIED

Three versions each. **A is always the current implementation, unchanged**, so
the founder can see what he already has beside what he might have. The review
says the current version wins more often than not, and the harness must make that
outcome as easy to pick as any other.

---

## V1 — THE DISTRIBUTION. The decision is the axis.

Six charts show a p10/p50/p90 spread and disagree: **two logarithmic, three
linear, one zero-based, one with a tick axis.** Read `RangeStrip`,
`PercentileStrip` and the four others in the graphics inventory before building.

> **CORRECTED 2026-08-19, before any build, by reading the module.** An earlier
> draft of this file described `RangeStrip` as a **linear** track and proposed a
> logarithmic variant as C. **`RangeStrip` is already logarithmic** - domain
> `[max(1, p10*0.85), p90*1.18]`, not zero-based, and the log-ness is **never
> declared to the reader**. C as drafted would have been an alternative to the
> thing that already ships. The three versions below are re-cut around the
> decision that is actually open.

**The six, from the inventory table, so the decision is visible:**

| Implementation | Axis | Zero-based | Scale shared | Tick axis |
|---|---|---|---|---|
| `RangeStrip` | **log** `[p10*0.85, p90*1.18]` | no | per-instance | **no** |
| `PercentileStrip` | **log**, same domain | no | per-instance | no |
| `SpreadBar` | linear `[p10, p90]` | no | **per-row** | no |
| `SpreadStrip` | linear `[p10, p90]` | no | per-instance | no |
| `spine2/Range` | linear **or** log | no | **shared across rows** | **yes** |
| `DistributionVisual` | linear `[0, p90*1.1]` | **yes** | per-instance | no |

| | Version | Specification |
|---|---|---|
| **A** | **Current `RangeStrip`, untouched** | **Log** domain `[max(1, p10*0.85), p90*1.18]`, p50 the only accent, missing quartiles interpolated as midpoints, seven-segment neutral density ramp, separate HTML view below `sm`. **No axis, and the log scale is not declared anywhere.** |
| **B** | **Zero-based linear with a labelled axis** | `DistributionVisual`'s scale convention, `[0, p90*1.1]`, on `RangeStrip`'s geometry, plus `spine2/Range`'s tick axis with min and max labelled. Magnitude becomes readable and the low end collapses on a wide spread. |
| **C** | **Log, but declared, with a labelled axis** | A's log domain, plus a tick axis, plus the compression stated **in words a reader understands** rather than the word "log". Tests whether the defect was the log scale or the silence about it. |

**Two facts for the harness, both from the inventory, neither a preference:**
`RangeStrip` and `PercentileStrip` are near-identical - same log domain, same
padding factors, same `W = 760` geometry - differing only in the "you are here"
marker versus the density ramp and mobile fallback. And **`spine2/Range` is the
only one of the six with a labelled tick axis**, and the only one that shares a
scale across rows.

**The EXTREME state decides this family.** Pick a real trade whose p10 and p90
differ by more than an order of magnitude. On a linear track the low end collapses
to nothing; on a log track the spread reads but the eye is lied to about
magnitude. That contrast is the whole question and the harness must show it.

**State beside each:** the ratio p90/p10, so the founder can see which cases each
version handles.

---

## V2 — THE SINGLE SCORE. The decision is whether a score stands alone.

Five surfaces plot a figure against a fixed 0-100 scale and a band word and
**never against another place's same score, although that data exists**:
`MarginIndexBadge`, `ScoreBand` (callers pass no `peers`), `PowerGauge`,
`DialGauge`, `CoverageBadge`.

| | Version | Specification |
|---|---|---|
| **A** | **Current, unanchored** | Score, band word, fixed scale. Exactly as it ships. |
| **B** | **Same component, `peers` passed** | `ScoreBand` already accepts a `peers` prop that no caller supplies. Pass real peer scores as quiet ink hairlines on the track. **No new component; this is a one-argument change.** |
| **C** | **Bullet graph, Few's specification** | Qualitative bands as **distinct intensities of ONE hue**, dark to light, three bands (Few caps at five and prefers three); the measure as a single dark bar; the comparative as one perpendicular marker. |

**Note for the builder:** Few's spec independently mandates the single-hue rule
this house already has. C is therefore not a departure from the palette, it is the
palette with a citation behind it.

**State beside each:** whether the reader can answer "is this good, compared to
what?" without leaving the component.

---

## V3 — THE TABLE. The decision is how much structure a financial table needs.

Three measured facts to fix or deliberately not fix: the house tabular-figures
rule at `globals.css:12` is used **zero times**, `Money.tsx` carries none; **no
table anywhere has a sticky header**; **thirteen files contain a `<table>` with
no `scope`.**

| | Version | Specification |
|---|---|---|
| **A** | **Current page-built table, untouched** | Take a real one that ships. Do not tidy it. |
| **B** | **The properties, nothing else** | Same visual weight. Adds: `tabular-nums` on every numeric cell, right-aligned numerics, `<th scope>`, a sticky header row, units in the header rather than repeated per cell. **No bars, no colour, no restyle.** |
| **C** | **B plus one inline bar per numeric column** | The leaderboard treatment. Bar scaled to the column max, single accent, value still printed. |

**The THIN state matters most here.** A two-row table with a sticky header is
worse than one without. The harness must show that, so the founder can decide
whether the header sticks always or only past N rows.

**State beside each:** row count at which the sticky header starts earning its
place, and whether the numbers align digit-for-digit.

---

## V4 — SEASONALITY. The decision is what the baseline means.

Five month-of-year charts **disagree about whether the baseline is zero or the
annual average**, so an identical bar means "this much trade" on one page and
"this much above normal" on another. A reader cannot tell which.

| | Version | Specification |
|---|---|---|
| **A** | **Absolute monthly values, zero-based bars** | The plain reading. Honest, and it loses the pattern when the annual range is narrow. |
| **B** | **Indexed to the annual average, diverging from a zero line** | One hue either side, distinguished by intensity, never two hues. Seasonality is inherently a deviation quantity. |
| **C** | **Absolute bars with the annual average drawn as a reference line** | The hybrid: magnitude stays readable and the deviation is visible against a drawn baseline. |

**Show a narrow-range trade and a strongly seasonal one.** B is unreadable noise
on the first and obviously right on the second; A is the reverse. That is the
decision.

---

## V5 — THE COUNTRY SCORECARD. The decision is whether a page needs one hero number.

The engraved `Scorecard` renders **eight cells at equal weight**. Every other page
type has a dominant figure; the country page is the only one with no signal for
which number matters. Two of its eight cells are deliberately unscored
(`minimum wage` and `population` are passed `score: null, read: null`) and that is
a founder ruling, not an oversight — **preserve it in all three versions.**

| | Version | Specification |
|---|---|---|
| **A** | **Current, eight equal cells** | Untouched. |
| **B** | **One dominant figure, seven demoted** | `AnswerFirstMasthead`'s ratio: the lead figure large, the rest at support weight. The country page's honest lead is what the government takes, per the ratified hero direction. |
| **C** | **One dominant plus three themed clusters** | Lead figure, then the seven grouped under short headings (cost of operating, people, market) rather than a flat eight-cell grid. |

**Constraint:** the charter records country as **blocked on data, not design** —
there is no honest country-level source for a headline hero. So B and C must lead
with a figure the page **already holds**, not a new one. If no held figure can
carry the lead, that is itself the finding and the harness should say so rather
than inventing one.

---

## The harness, per family

One page. Three columns at desktop, stacked at 375. Same data in all three.
Above them, one line naming the decision. Beside each version:

- the state being shown (**typical / thin / extreme**), switchable or stacked
- the measured facts listed under each family above
- **nothing that reads as a recommendation.** No "recommended", no ordering by
  preference, no green tick. A, B, C, in that order, always.

Footer, on every page, one line: **what this harness cannot show.** At minimum
that the webfonts are not loaded in a standalone file, that data bands self-omit
locally when cell lookups exceed their budget to eu-west-1, and that a chart
looking right on this machine's fallback font may set differently in production.
