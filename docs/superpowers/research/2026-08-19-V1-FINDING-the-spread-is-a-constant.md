# V1 FINDING: four spread regimes feed one graphic, and they differ by 15x

**Title corrected 2026-08-19, before this reached the founder.** The first draft
of this file was called "the distribution chart is drawing a constant" and led
with that claim. **It was wrong, because I queried the wrong table.** The
correction is kept in full in section 5 rather than deleted, because the way it
was wrong is the useful part.

Measured against the live database and the three modules that produce the
numbers.

---

## 1. The corrected picture: four regimes, one graphic

`RangeStrip` plots p10 / p25 / p50 / p75 / p90 of revenue across firms. Four
different things can be behind it, depending which code path a cell takes:

| Source | Shape | Typical p90/p10 | Reaches the reader via |
|---|---|---:|---|
| **`cells_master`** | **real, variable** | **median 53.7x**, widest **315.6x**, tightest 18.8x | 6 call sites in `src/lib/cells.ts` |
| `regional_cells` | 4 fixed fans; 90.7% are `0.40/0.65/1.45/2.10` | **5.25x** | 2 call sites |
| `fill_defaults.ts:80` `PCT_MULTIPLIERS` | one fixed fan `0.25/0.55/1.85/3.4` | **13.6x** | whenever a stored percentile is null |
| `cell_view.ts:202` (London) | one fixed fan `0.50/0.72/1.35/1.80` | **3.6x** | `isLondon && isNum(typicalRevenue)` |

**The finding is the 15x gap between the narrowest regime and the widest.** A
London strip is drawn from a 3.6x fan. A `cells_master` strip is drawn from a
real distribution whose median width is 53.7x. **They render identically**, and
nothing on the strip tells a reader which one they are looking at.

The same trade in two cities can therefore be drawn as narrow or wide purely by
which table answered, not by anything true about the businesses.

### Measured detail on the two fixed-fan tables

`regional_cells`, 4,000 rows with non-null p10 and p90:

| Fan (p10 / p25 / p75 / p90, over p50) | Rows | Share | p90/p10 |
|---|---:|---:|---:|
| `0.400 / 0.650 / 1.450 / 2.100` | 3,628 | **90.7%** | 5.25x |
| `1.000 / 1.000 / 1.000 / 1.000` | 219 | 5.5% | 1.00x |
| `0.400 / 0.650 / 1.000 / 1.000` | 152 | 3.8% | 2.50x |
| `5.535 / 8.995 / 20.066 / 29.061` | 1 | 0.03% | 5.25x |

Two consequences that follow arithmetically. **The 3.8% group draws p50, p75 and
p90 at the same x position**, so the upper half of the strip is a flat line
against the right edge, in 152 cells. And the 5.5% flat group is handled
correctly and does not render: `RangeStrip` guards `p90 <= p10` and returns null,
so those cells self-omit.

`cells_master`, 1,000 rows: **14 distinct ratios**, which is quantised but not
constant. Fourteen shapes across a thousand cells is consistent with percentiles
derived **per industry** and applied across geographies, which is a legitimate
method. It is not consistent with a per-cell measurement.

---

## 2. The provenance gap, which is narrow, deliberate and documented

This is not a hidden fabrication, and the finding is more interesting than that.
`fill_defaults.ts:505-509` says so in its own words: a filled figure is *"not an
observation of this place, so the marker below stops it inheriting the row's
provenance label; deriveCoverageTier reads `_revenueFilled` and will not return
'measured' for such a cell."*

**The gap is at lines 517-520**, and it is deliberate and documented:

> *"Only the headline carries the marker. A row whose own `revenue_per_firm` was
> read but whose percentile spread was filled around it still publishes a
> measured headline, and that is the figure the label is about."*

Defensible scoping **for the headline**. The consequence for the graphic is the
finding: **a cell can be labelled measured while the spread drawn beneath it is a
synthetic fan**, and `RangeStrip` renders a fan and a real distribution
identically.

---

## 3. V1 is NOT blocked. The three states all exist in real data.

The first draft concluded V1 could not be built because there was nothing to
plot. That was wrong. With `cells_master` in scope, the states are:

| State | Real source | p90/p10 |
|---|---|---:|
| **TYPICAL** | a `cells_master` cell at the median | **53.7x** |
| **THIN** | a `regional_cells` cell on the 90.7% fan, or a flat row that self-omits | 5.25x, or null |
| **EXTREME** | the widest `cells_master` cell, US-02 | **315.6x** |

**And the axis question becomes live rather than moot.** At 315.6x a linear axis
genuinely collapses the low end to nothing, which is exactly the contrast the V1
brief says should decide the family. The first draft killed that question on the
strength of the wrong table.

---

## 4. What the decision is, stated without a preference

- **Option 1. Mark the spread's provenance**, extending the `_revenueFilled` idea
  to the percentiles so a synthetic fan is visibly a fan. The mechanism already
  exists for the headline.
- **Option 2. Do not draw a spread that is a fixed fan.** Self-omit the way the
  5.5% flat rows already self-omit.
- **Option 3. Reconcile the four regimes**, so the shape does not depend on which
  table answered.
- **Option 4. Treat the fan as an explicitly modelled band** rather than a
  measurement, and say so on the graphic.

Not mutually exclusive: 1 and 3 compose; 2 and 4 compose.

---

## 5. How the first draft was wrong, kept because it is the useful part

I pulled 4,000 rows from `regional_cells`, found four shapes, and concluded the
signature graphic draws a constant. The conclusion was false for the table that
actually serves most reads.

**Three things caused it, and all three are recorded traps in this project:**

1. **I queried the table I could reach, not the table the code reads.** A `cells`
   query 404'd with a hint naming `cells_master`; I moved to `regional_cells`
   without checking which one the six live call sites use. `cells.ts` reads
   `cells_master` at six sites and `regional_cells` at two.
2. **My paging helper swallowed HTTP errors and reported them as "no rows".**
   When I did finally query `cells_master`, it returned "no rows" and I nearly
   accepted that as evidence of absence. It was a 400: I had asked for
   `rev_p25`/`rev_p75` in a column list that failed for an unrelated reason, and
   `grab()` returned null on `!r.ok`, which the caller printed as "no rows".
   **An instrument that reports failure and emptiness in the same words will
   eventually be believed about the wrong one.**
3. **The claim was interesting, which is exactly when to slow down.** "The
   signature graphic draws a constant" is a headline. Headlines earn a second
   query against the primary source before they are written down.

The corrected numbers came from probing the schema directly and printing the HTTP
status, rather than from a helper that hides it.

---

## 6. What this measurement still cannot distinguish

- **It cannot distinguish per-industry derivation from per-cell measurement.**
  Fourteen shapes across a thousand `cells_master` rows is consistent with a
  national industry distribution applied across geographies. That is a legitimate
  method and it is not the same as measuring these firms.
- It reads at most 4,000 rows of `regional_cells` and 1,000 of `cells_master`,
  paged. It is not the whole table and the tail may differ.
- It says nothing about whether the **headline** revenue figures are sound. Those
  carry their own provenance marker and this finding does not touch them.
- It cannot tell which regime any given live page actually hits without rendering
  that page, because the branch depends on `moneyShown`, `isLondon` and null-ness
  at read time.
