# Register Statistics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the UK register tables into figures with honest uncertainty: band quantiles with their rounding range, failure rates with intervals and a publication floor, survival on current closure rates, and the home feed rebuilt on them.

**Architecture:** A small Python package `registers/uk/estimators/` (banded, rates, survival), each module test-first; the existing builders call it through exact edits; a new script adds intervals to the failures table; table invariants are pinned by a test that runs after every rebuild; `export_for_site.py` writes the slices the website reads.

**Tech Stack:** Python 3.13, numpy and scipy (already used by the builders), pytest.

---

## Before you start (read once)

- Work in `E:/atlas` (the data repository; the website is its own repository inside it, untouched by this plan). Run every
  command from `E:/atlas`.
- The builders read the raw downloads under `E:/atlas/cache/uk/` (git-ignored, present on this machine since 2026-10-02).
  Nothing in this plan fetches anything: the Gazette's fair-use rules (night window, 10 s, named agent) bind only
  `fetch_gazette.py`, which no task runs.
- Tests are pytest files under `registers/uk/tests/`, run from `E:/atlas` with `python -m pytest registers/uk/tests -q`;
  `registers/uk/tests/conftest.py` puts `registers/uk` on the import path so `from estimators.banded import ...` works.
- The tree holds many untracked files that are not this plan's. Every commit names its files; never `git add -A` or `.`.
- The edits to existing builders are given as exact Replace / With pairs. Apply them in the order given: each "Replace"
  block then occurs exactly once (checked on 2026-10-02 by applying them in order to fresh copies of the real builders and
  rebuilding every table, and again on 2026-10-03 after the reviews of every task: every table, draft, the ledger and the
  pack rebuilt, the 75 tests passing, 27 of 28 deliberate faults in the builders' new rules failing them (the 28th, a
  median of exactly 50m flagged in the builder's own words, no table today can show), and plan 03's 158 checks and its
  registers gate passing on the slices exported from them).
- Rebuild order, because each step reads the one before: `build_nomis.py` -> `build_demography.py` ->
  `enrich_failure_rates.py` -> `build_ledger.py` -> `build_pack.py` -> `build_editorial.py` -> `draft_stories.py`;
  `export_for_site.py` last (plan 03 runs it into the website).
- Commits: one per task, never pushed by this plan, on the branch `E:/atlas` is on (`p4-seam` on 2026-10-02; if it is on
  its default branch, create `vertical-engine` first). The controlling session commits; a subagent executing a task stops
  before its commit step and reports. Never `--no-verify`.

## File structure

| File | Responsibility |
|---|---|
| `registers/uk/estimators/__init__.py` | marks the package (empty) |
| `registers/uk/estimators/banded.py` | band quantiles, which of them print in words, the CDF, the rounding range, the anchor mean, the lognormal model check |
| `registers/uk/estimators/rounding.py` | `half_up`: a printed figure rounded the website's way (pennies at any number of places) |
| `registers/uk/estimators/rates.py` | Wilson and Garwood intervals, the publication rule, two-proportion tests, Holm |
| `registers/uk/estimators/survival.py` | the synthetic cohort (survival on the latest year's closure rates) with Greenwood intervals |
| `registers/uk/tests/conftest.py` | puts `registers/uk` on the import path for pytest run from `E:/atlas` |
| `registers/uk/tests/test_*.py` | one test file per estimator; `test_tables.py` for the built tables' invariants; `test_demography.py`, `test_drafts.py` and `test_export.py` for the builders' own rules |
| `registers/uk/build_nomis.py` (modify) | quantiles, open-band flags, the median's rounding range (rounded outward), the model check per area, plain caveats |
| `registers/uk/build_demography.py` (modify) | `survival_period` per borough and per trade group (twelve decimals), shares rounded half up, the City of London flagged as never ranked |
| `registers/uk/enrich_failure_rates.py` (create) | `uk_rate` per trade: the rate, its interval, the publication flags |
| `registers/uk/build_editorial.py` (modify) | the feed on publishable rates, period survival, the City of London out of demography rankings by the table's flag, no open-band median among the takings |
| `registers/uk/draft_stories.py` (modify) | each draft says which survival a figure is, marks few cases, rounds half up and names what is not ranked; it can write into a scratch folder |
| `registers/uk/export_for_site.py` (create) | the slices the website reads, with a SHA-256 manifest; a stale table is refused |
| `registers/uk/README.md` (modify) | the run order and the new files |
| `registers/uk/build_ledger.py` (modify) | the ledger's rows for the turnover quantiles, survival on current closure rates and the rates' intervals |
| `registers/uk/build_pack.py` (modify) | the data pack's survival and failure columns from the same |

### Task 1: The band estimator

The register gives counts in ten turnover bands and nothing inside a band. Inside a band [L, U) businesses are read as
log-uniform, so the q-quantile in band k is `Q = L (U / L)^((qN - C_{k-1}) / n_k)` and the CDF is the same formula inverted;
the first band is floored at 5k and the open top band capped at 100m, and a quantile in either prints only as "under 50k" or
"over 50m" (`in_open_band`; one exactly on 50k or 50m rests on neither and prints as a figure). Each count is rounded to the nearest 5, so the rounding range of a quantile is its smallest and largest value
over the box of counts each within 2.5 of the printed ones. The quantile is the smallest x at which
`sum_k c_k (G_k(x) - q) >= 0` (`G_k(x)` the share of band k below x); for any x that sum is linear in the counts, so its
largest value over the box sits at a corner where every band below some m is high and every band from m on is low: the
range is the smallest and largest quantile over those 22 threshold corners, equal to trying all 1,024 (the test does).
The first version tried only the corners split at the band holding the printed quantile, and missed the extreme wherever the
quantile can move to another band: 288 of the 2,597 London cells (five businesses a band with an empty band between:
136k to 1,587k where the counts allow 100k to 5,612k). Counts are checked: ten of them, finite and not negative (a NaN
total once came back as an empty area). `trimmed_mean` is the anchor of plan
03's size rule: the mean sales of businesses in the bands below 5m, each band at its shape's mean: log-flat
`(U - L) / ln(U / L)` by default, flat `(U + L) / 2` or Pareto `L U ln(U / L) / (U - L)`, which bracket the plausible
shapes (Pareto <= geometric mean <= log-flat <= flat in every band), with hard bounds that hold whatever the shape.
`lognormal_fit` maximises
`sum_k n_k ln(Phi((ln U_k - mu)/sigma) - Phi((ln L_k - mu)/sigma))` and runs the G-test with 10 - 1 - 2 = 7 degrees of
freedom (an empty band is still a cell of the fit; the first version counted only the non-empty ones): it recovers a true
lognormal from rounded counts and rejects London restaurants at p about 1e-64, which is why pages never print a fitted curve.
The review of 2026-10-03 found every figure right and the test too loose: nothing pinned the 5k floor, the 100,000k cap or
band 9's edges in the quantile (a 1k floor would move 1,404 stored quantiles), the rule for a quantile landing exactly on a
count (the smallest x: with `>` for `>=`, 26 stored quantiles move), the range at other quantiles and margins or far from
the quantile's band, or the fit's own figures. The test now pins them all from independent computation, and three changes
went in: a quantile on an edge is the edge exactly (`L (U / L)^frac`, not exp of the logs, which gave 50.000000000000014);
the normal CDF goes through erfc, with a band wholly above the centre as a difference of upper tails, so a lopsided fit
stays the maximum-likelihood one (one band far above the rest stalled at twice its G); and a sales figure that is not a
number is refused, with the counts checked as numbers with a finite total. All 47 deliberate faults on the module fail.

**Files:**
- Create: `registers/uk/estimators/__init__.py`
- Create: `registers/uk/tests/conftest.py`
- Create: `registers/uk/estimators/banded.py`
- Test: `registers/uk/tests/test_banded.py` (create)

- [ ] **Step 1: Create the package and the test path**

Create `registers/uk/estimators/__init__.py` (empty file).

Create `registers/uk/tests/conftest.py`:

```python
"""Lets the tests import estimators/ when pytest runs from E:/atlas (python -m pytest registers/uk/tests)."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
```

- [ ] **Step 2: Write the failing test**

Create `registers/uk/tests/test_banded.py`:

```python
"""Tests for estimators/banded.py. Run: python -m pytest registers/uk/tests -q"""
import itertools
import math

import pytest

from estimators.banded import FLOOR_K, empirical_cdf, empirical_quantile, in_open_band, lognormal_fit, rounding_range, trimmed_mean

# London, licensed restaurants (SIC 56101), enterprises by turnover band, March 2026 (Nomis NM_199_1, read 2026-10-02)
RESTAURANTS_LONDON = [625, 800, 2250, 1470, 1245, 725, 500, 140, 75, 30]
# London, hairdressing and other beauty treatment (SIC 96020)
HAIR_BEAUTY_LONDON = [2405, 3740, 2655, 525, 245, 70, 40, 10, 5, 0]
# Camden, the same code: a borough-sized count
HAIR_BEAUTY_CAMDEN = [140, 135, 100, 35, 30, 5, 0, 0, 0, 0]
# A lognormal's expected counts (median 280k, sigma 1) for 7,865 businesses, rounded to 5: a case where the model is
# true, so recovering it measures the rounding to 5 only (a real sample of that size would add about 1% of sampling error)
SYNTHETIC = [335, 860, 2385, 2075, 1410, 605, 180, 15, 0, 0]


def test_median_matches_the_published_table():
    assert round(empirical_quantile(RESTAURANTS_LONDON, 0.5), 1) == 281.9
    assert round(empirical_quantile(HAIR_BEAUTY_LONDON, 0.5), 1) == 78.6


def test_quantiles_increase_with_q():
    qs = [empirical_quantile(RESTAURANTS_LONDON, q) for q in (0.1, 0.25, 0.5, 0.75, 0.9)]
    assert qs == sorted(qs)
    assert [round(q, 1) for q in qs] == [57.5, 124.6, 281.9, 759.1, 1923.1]


def test_cdf_inverts_the_quantile():
    for q in (0.1, 0.25, 0.5, 0.75, 0.9):
        x = empirical_quantile(HAIR_BEAUTY_LONDON, q)
        assert abs(empirical_cdf(HAIR_BEAUTY_LONDON, x) - q) < 1e-9


def test_share_above_100k():
    assert round(1 - empirical_cdf(RESTAURANTS_LONDON, 100), 3) == 0.819
    assert round(1 - empirical_cdf(HAIR_BEAUTY_LONDON, 100), 3) == 0.366


def test_rounding_range_is_narrow_for_london_and_wide_for_a_borough():
    lo, hi = rounding_range(RESTAURANTS_LONDON, 0.5)
    assert round(lo, 1) == 280.3 and round(hi, 1) == 283.5
    lo, hi = rounding_range(HAIR_BEAUTY_CAMDEN, 0.5)
    assert round(lo, 1) == 73.9 and round(hi, 1) == 81.1
    assert (hi - lo) / empirical_quantile(HAIR_BEAUTY_CAMDEN, 0.5) > 0.09


def test_lognormal_recovered_when_true():
    fit = lognormal_fit(SYNTHETIC)
    assert fit["df"] == 7  # ten bands, less one, less two fitted: the two empty bands are cells of the fit too
    assert abs(fit["median_k"] - 280) < 1.0
    assert abs(fit["sigma"] - 1.0) < 0.01
    assert fit["p"] > 0.01


def test_lognormal_rejected_on_real_restaurants():
    fit = lognormal_fit(RESTAURANTS_LONDON)
    assert fit["p"] < 1e-10  # chains make the top far heavier than a lognormal: the pages never print the model


def test_empty_and_bad_input():
    assert empirical_quantile([0] * 10, 0.5) is None
    assert empirical_cdf([0] * 10, 100) is None
    with pytest.raises(ValueError):
        empirical_quantile(RESTAURANTS_LONDON, 1.0)
    assert lognormal_fit([10, 0, 0, 0, 0, 0, 0, 0, 0, 0]) is None


def test_trimmed_mean_anchors_the_size_rule():
    m, lo, hi = trimmed_mean(HAIR_BEAUTY_LONDON)
    assert round(m, 5) == 139.40636 and round(lo, 2) == 88.46 and round(hi, 2) == 207.18
    m, lo, hi = trimmed_mean(RESTAURANTS_LONDON)
    assert round(m, 5) == 597.44087 and lo < m < hi
    assert math.isclose(trimmed_mean([0, 0, 50, 0, 0, 0, 0, 0, 0, 0])[0], 150 / math.log(2.5))
    assert trimmed_mean([0, 0, 0, 0, 0, 0, 0, 3, 2, 1]) is None
    with pytest.raises(ValueError):
        trimmed_mean(RESTAURANTS_LONDON, upto_band=10)


def test_trimmed_mean_under_the_three_band_shapes():
    flat, logflat, pareto = (trimmed_mean(HAIR_BEAUTY_LONDON, shape=s)[0] for s in ("flat", "log-flat", "pareto"))
    assert round(pareto, 5) == 130.83117 and round(logflat, 5) == 139.40636 and round(flat, 5) == 148.43879
    assert round(trimmed_mean(RESTAURANTS_LONDON, shape="flat")[0], 5) == 629.47308
    assert round(trimmed_mean(RESTAURANTS_LONDON, shape="pareto")[0], 5) == 566.21168
    with pytest.raises(ValueError):
        trimmed_mean(RESTAURANTS_LONDON, shape="normal")


def test_rounding_range_finds_an_extreme_in_another_band():
    # five businesses a band with an empty band between: the median can fall to 100k or rise to 5,612k; trying only the
    # median's own band saw 136k to 1,587k
    lo, hi = rounding_range([5, 5, 5, 5, 5, 5, 0, 5, 5, 0], 0.5)
    assert round(lo, 1) == 100.0 and round(hi, 1) == 5612.3


def test_rounding_range_equals_trying_every_corner():
    # the extremes over the box of possible counts sit at its corners, so all 1,024 of them give the exact answer
    for counts in ([5, 5, 5, 5, 5, 5, 0, 5, 5, 0], HAIR_BEAUTY_CAMDEN, [10, 0, 5, 0, 15, 0, 5, 0, 0, 5], [0, 5, 0, 0, 10, 5, 0, 0, 5, 0]):
        values = [v for signs in itertools.product((-2.5, 2.5), repeat=10)
                  if (v := empirical_quantile([max(0.0, c + d) for c, d in zip(counts, signs)], 0.5)) is not None]
        lo, hi = rounding_range(counts, 0.5)
        assert math.isclose(lo, min(values)) and math.isclose(hi, max(values))


def test_counts_must_be_ten_finite_and_not_negative():
    bad_counts = ([1] * 9, [1] * 11, [5, -5] + [0] * 8, [5, math.nan] + [0] * 8, [5, math.inf] + [0] * 8)
    readers = (lambda c: empirical_quantile(c, 0.5), lambda c: empirical_cdf(c, 100), lambda c: rounding_range(c, 0.5), lognormal_fit, trimmed_mean)
    for counts in bad_counts:
        for read in readers:
            with pytest.raises(ValueError):
                read(counts)


def test_floor_cap_and_top_band_edges():
    assert round(empirical_quantile(HAIR_BEAUTY_LONDON, 0.1), 4) == 12.6499  # 5 x 10^(969.5 / 2405): the first band floored at 5k
    assert empirical_cdf(HAIR_BEAUTY_LONDON, 4) == 0.0
    assert round(empirical_cdf(HAIR_BEAUTY_LONDON, 25), 6) == 0.173391
    assert math.isclose(empirical_quantile([0] * 9 + [10], 0.5), math.sqrt(50000 * 100000))  # the open top band capped at 100,000k
    assert math.isclose(empirical_quantile([0] * 8 + [10, 0], 0.5), math.sqrt(10000 * 50000))  # band 9 is 10,000 to 50,000
    assert empirical_cdf([0] * 9 + [10], 1e9) == 1.0


def test_a_quantile_on_a_count_takes_the_smallest_x_and_an_edge_is_exact():
    tie = [5, 0, 5] + [0] * 7  # the share below is 0.5 from 50k to 100k: the median is the smallest x, 50k
    assert empirical_quantile(tie, 0.5) == 50.0
    assert math.isclose(empirical_cdf(tie, 75), 0.5)


def test_rounding_range_at_other_quantiles_other_margins_and_far_thresholds():
    lo, hi = rounding_range(RESTAURANTS_LONDON, 0.9)
    assert (round(lo, 2), round(hi, 2)) == (1904.23, 1942.33)
    lo, hi = rounding_range(RESTAURANTS_LONDON, 0.1)
    assert (round(lo, 2), round(hi, 2)) == (57.26, 57.71)
    lo, hi = rounding_range(HAIR_BEAUTY_CAMDEN, 0.5, half=2.0)
    assert (round(lo, 2), round(hi, 2)) == (74.38, 80.13)
    lo, hi = rounding_range([0, 0, 0, 0, 0, 0, 0, 5, 5, 5], 0.5)  # seven empty bands below can each hide 2.5
    assert (round(lo, 1), round(hi, 1)) == (250.0, 56123.1)
    lo, hi = rounding_range([5, 5, 5, 0, 5, 0, 5, 5, 0, 0], 0.5)  # nursing and elderly care, City of London
    assert (round(lo, 1), round(hi, 1)) == (79.4, 5000.0)
    for bad in (math.nan, -1.0, math.inf):
        with pytest.raises(ValueError):
            rounding_range(HAIR_BEAUTY_CAMDEN, 0.5, half=bad)


def test_lognormal_figures_are_pinned():
    fit = lognormal_fit(RESTAURANTS_LONDON)
    assert round(fit["mu"], 4) == 5.7509 and round(fit["sigma"], 4) == 1.3962
    assert round(fit["g"], 1) == 316.6 and math.isclose(fit["p"], 1.695e-64, rel_tol=2e-3)
    fit = lognormal_fit(SYNTHETIC)
    assert abs(fit["median_k"] / 280 - 1) < 1e-3 and abs(fit["sigma"] - 1) < 1e-3  # the plan's 0.1%
    assert round(fit["g"], 2) == 2.82 and round(fit["p"], 3) == 0.901
    assert lognormal_fit([10, 5] + [0] * 8) is None  # two bands cannot fit two parameters
    far = lognormal_fit([100, 0, 5, 0, 0, 0, 0, 0, 0, 5000])  # nearly everyone in the open top band: the fit's centre runs off
    assert far is not None and far["mu"] > 0  # and its median is not an OverflowError


def test_trimmed_mean_with_an_explicit_band_count():
    assert round(trimmed_mean(HAIR_BEAUTY_LONDON, upto_band=3)[0], 5) == 85.38844
    with pytest.raises(ValueError):
        trimmed_mean(HAIR_BEAUTY_LONDON, upto_band=0)


def test_q_must_be_strictly_inside_zero_one():
    for q in (0.0, 1.0, -0.1, math.nan):
        with pytest.raises(ValueError):
            empirical_quantile(HAIR_BEAUTY_LONDON, q)


def test_a_sales_figure_or_a_count_that_is_not_a_number_is_refused():
    with pytest.raises(ValueError):
        empirical_cdf(HAIR_BEAUTY_LONDON, math.nan)
    for bad in (["5"] + [0] * 9, [1e308] * 10):  # a string; counts whose total is not finite
        with pytest.raises(ValueError):
            empirical_quantile(bad, 0.5)


def test_a_lopsided_fit_stays_the_maximum_likelihood_one():
    fit = lognormal_fit([5, 5000, 0, 0, 0, 5, 0, 0, 0, 0])  # one band far above the rest: the 1 + erf form stalled at twice this G
    assert round(fit["mu"], 4) == 4.2682 and round(fit["sigma"], 4) == 0.1749 and round(fit["g"], 1) == 1546.2


def test_a_quantile_off_the_floor_and_the_cap_prints_as_a_figure():
    assert in_open_band(49.99) and in_open_band(FLOOR_K) and in_open_band(50000.01)
    assert not in_open_band(50.0) and not in_open_band(787.2) and not in_open_band(50000.0)
    # a band that ends exactly on the median, the next band empty of the half below, puts the median on the 50m edge
    assert empirical_quantile([0, 0, 0, 0, 0, 0, 0, 0, 5, 5], 0.5) == 50000.0
```

- [ ] **Step 3: Run it and watch it fail**

```bash
python -m pytest registers/uk/tests/test_banded.py -q
```

Expected: a collection error ending `ModuleNotFoundError: No module named 'estimators.banded'`, exit code 2.

- [ ] **Step 4: Write the implementation**

Create `registers/uk/estimators/banded.py`:

```python
"""
estimators/banded.py: quantiles and shares from counts in turnover bands (the register's only view of a trade's sales).

The data are interval-censored: the register says how many businesses fall in each band (0 to 49k, 50 to 99k, ...) and
nothing inside a band. Two estimators, used for different jobs:

EMPIRICAL (what the pages print). Inside a band [L, U) the businesses are spread evenly on a log scale (sales are close to
log-uniform at this resolution), so the q-quantile in band k is
    Q(q) = L * (U / L) ** ((q * N - C_{k-1}) / n_k)
where N is all businesses, C_{k-1} the businesses below band k and n_k the band's own count. The first band starts at 0,
where a log scale has no floor: it is floored at 5k (a register entry turning over less than 5k a year is a dormant or PAYE-only
unit, and the floor moves only quantiles that fall in the first band). The open top band is capped at 100,000k for the same
reason. A quantile below 50k or above 50,000k rests on the floor or the cap, so a page prints it only in words ("under 50k",
"over 50m": in_open_band); one exactly on either edge rests on neither and prints as a figure. The CDF is the same
formula inverted, so the share of businesses above any sales figure comes from the same assumption as the quantiles.

LOGNORMAL (the model check). A lognormal fitted by maximum likelihood to the band counts:
    log L(mu, sigma) = sum_k n_k * log(Phi((ln U_k - mu)/sigma) - Phi((ln L_k - mu)/sigma))
with the G-test of fit, df = 10 - 1 - 2 = 7: the fit is the multinomial's over all ten bands, so an empty band is still a
cell (its observed 0 adds nothing to G, its expected count is in the fit). The p-value is stored with each cell as a model
check (lognormal_fit_p, to three significant figures, so threshold the unrounded p, not the stored one: a cell at
p = 0.0099953 stores 0.01); nothing prints it, and the empirical figure prints whatever it says (it assumes less). The
normal CDF is computed through erfc, which keeps its digits in the lower tail, and a band lying wholly above the centre
as a difference of two upper tails, so the fit stays the maximum-likelihood one on lopsided counts (the 1 + erf form
cancelled there, and the clamp it needed put a false barrier in the likelihood).

ROUNDING, not sampling. The register is a census: there is no sampling error. Its error is that every count is rounded to
the nearest 5. rounding_range() gives the smallest and largest quantile the true counts could produce, each count being off
by up to 2.5 (never below 0). It is exact: the quantile is the smallest x at which sum_k c_k (G_k(x) - q) >= 0, G_k(x)
being the share of band k below x, and for any x that sum is linear in the counts, so its largest value over the box of
possible counts is at a corner where every band below some m is high and every band from m on is low (the band holding x
on whichever side its share below x puts it). The smallest possible quantile is therefore the smallest over the eleven such
corners, and the largest the same with the sides swapped: twenty-two evaluations, equal to trying all 1,024 corners.
Trying only the corners split at the band that holds the printed quantile misses the extreme whenever the quantile can move
to another band: on the London table of 2026-10-02 it did in 288 of 2,597 cells (five businesses a band with an empty band
between: 136k to 1,587k where the counts allow 100k to 5,612k).

COUNTS are the ten band counts, numbers, finite and not negative, with a finite total; anything else is refused (a NaN
total compared false with every bound and the quantile came back None as if the area were empty). A sales figure that is
not a number is refused too (it read as nobody below it). A quantile is the smallest x at which the share below reaches q,
so where a band ends exactly on the target with empty bands above, it is that band's upper edge; a quantile on an edge is
the edge itself, exactly (L (U / L)^frac, not exp of the logs, which left 50.000000000000014).
"""
from __future__ import annotations

import math
import numbers
from typing import Sequence

from scipy import optimize, stats

# turnover bands in thousands of pounds, [lower, upper); the register's ten
BANDS_K: tuple[tuple[float, float], ...] = (
    (0, 50), (50, 100), (100, 250), (250, 500), (500, 1000), (1000, 2000), (2000, 5000), (5000, 10000), (10000, 50000), (50000, math.inf),
)
FLOOR_K = 5.0
TOP_CAP_K = 100000.0


def in_open_band(x_k: float) -> bool:
    """Whether a quantile rests on the 5k floor (below 50k) or the 100,000k cap (above 50,000k), so it prints only in words;
    an edge itself (50k or 50,000k exactly) rests on neither."""
    return x_k < BANDS_K[0][1] or x_k > BANDS_K[-1][0]


def _counts(counts: Sequence[float]) -> list[float]:
    if len(counts) != len(BANDS_K):
        raise ValueError("ten band counts expected")
    if not all(isinstance(c, numbers.Real) and not isinstance(c, bool) for c in counts):
        raise ValueError(f"band counts must be numbers: {list(counts)}")
    out = [float(c) for c in counts]
    # a NaN or an infinite count makes the total so, and so does a sum that overflows
    if any(c < 0 for c in out) or not math.isfinite(sum(out)):
        raise ValueError(f"band counts must be finite and not negative, with a finite total: {list(counts)}")
    return out


def _log_edges(k: int) -> tuple[float, float]:
    lo, hi = BANDS_K[k]
    return math.log(max(lo, FLOOR_K)), math.log(min(hi, TOP_CAP_K))


def empirical_quantile(counts: Sequence[float], q: float) -> float | None:
    """The q-quantile of sales in thousands of pounds, or None when there are no businesses."""
    if not 0 < q < 1:
        raise ValueError("q must be strictly between 0 and 1")
    counts = _counts(counts)
    n = sum(counts)
    if n <= 0:
        return None
    target = q * n
    cum = 0.0
    for k, c in enumerate(counts):
        if c > 0 and cum + c >= target:
            frac = (target - cum) / c
            low, high = max(BANDS_K[k][0], FLOOR_K), min(BANDS_K[k][1], TOP_CAP_K)
            return low * (high / low) ** frac  # the header's formula: at frac 0 or 1, the edge itself
        cum += c
    return None


def _shape_mean(low: float, high: float, shape: str) -> float:
    if shape == "flat":
        return (low + high) / 2
    if shape == "log-flat":
        return (high - low) / math.log(high / low)
    if shape == "pareto":
        return low * high * math.log(high / low) / (high - low)
    raise ValueError(f"unknown band shape: {shape}")


def trimmed_mean(counts: Sequence[float], upto_band: int = 7, shape: str = "log-flat") -> tuple[float, float, float] | None:
    """The mean sales of the businesses in bands 1 to upto_band, in thousands of pounds, each band at its shape's mean, the
    first band from the 5k floor. Shapes inside a band [L, U): "log-flat" (density ~ 1/x, the reading the quantiles use),
    mean (U - L) / ln(U / L); "flat" (density ~ 1), mean (U + L) / 2; "pareto" (density ~ 1/x^2, a right-skewed tail), mean
    L U ln(U / L) / (U - L). The default stops below 5m: an enterprise above it is mostly a chain, whose turnover is every
    site's, not one site's. Returns (mean, lo, hi), lo and hi bounding the mean whatever the shape inside each band (every
    business on its band's lower or upper edge, the first band from 0); None when those bands hold nobody. Equal to the
    website's bandMeanK (src/lib/uk/pnl/banded.ts, built in plan 03), which anchors the profit-and-loss model's size rule."""
    counts = _counts(counts)
    if not 1 <= upto_band < len(BANDS_K):
        raise ValueError("upto_band must be 1 to 9 (the top band is open)")
    n = total = lo = hi = 0.0
    for k in range(upto_band):
        low, high = BANDS_K[k]
        n += counts[k]
        total += counts[k] * _shape_mean(max(low, FLOOR_K), high, shape)
        lo += counts[k] * low
        hi += counts[k] * high
    return (total / n, lo / n, hi / n) if n > 0 else None


def empirical_cdf(counts: Sequence[float], x_k: float) -> float | None:
    """The share of businesses with sales below x_k (thousands of pounds)."""
    if math.isnan(x_k):
        raise ValueError("empirical_cdf: the sales figure is not a number")
    counts = _counts(counts)
    n = sum(counts)
    if n <= 0:
        return None
    if x_k <= 0:
        return 0.0
    lx = math.log(max(x_k, FLOOR_K))
    below = 0.0
    for k, c in enumerate(counts):
        a, b = _log_edges(k)
        if lx >= b:
            below += c
        elif lx > a:
            below += c * (lx - a) / (b - a)
    return min(1.0, below / n)


def rounding_range(counts: Sequence[float], q: float, half: float = 2.5) -> tuple[float, float] | None:
    """The smallest and largest q-quantile that counts each within +-half of these could give (exact: see the header)."""
    if not (math.isfinite(half) and half >= 0):
        raise ValueError(f"rounding_range: half must be a number of businesses, 0 or more ({half})")
    if empirical_quantile(counts, q) is None:
        return None
    counts = _counts(counts)
    out = []
    for m in range(len(counts) + 1):  # the bands below m move one way, the bands from m the other
        for below in (half, -half):
            # a printed 0 can hide businesses (2 of a whole count; the plans allow 2.5, decision 7), so an empty band moves like any other, never below 0
            adj = [max(0.0, c + below) if k < m else max(0.0, c - below) for k, c in enumerate(counts)]
            v = empirical_quantile(adj, q)
            if v is not None:
                out.append(v)
    return (min(out), max(out)) if out else None


SQRT2 = math.sqrt(2.0)


def _phi(z: float) -> float:
    """The standard normal CDF through math.erfc, which keeps its digits in the lower tail where 1 + erf(z) cancels; far
    faster than scipy.stats.norm.cdf on one number, which matters because the model check runs once for every trade in
    every place (some 2,600 fits)."""
    return 0.5 * math.erfc(-z / SQRT2)


def lognormal_fit(counts: Sequence[float]) -> dict | None:
    """Maximum-likelihood lognormal for band counts: mu, sigma (of ln sales in thousands), the G statistic and its p-value."""
    counts = _counts(counts)
    nonempty = [k for k, c in enumerate(counts) if c > 0]
    if len(nonempty) < 3:
        return None
    log_edges = [(math.log(lo) if lo > 0 else -math.inf, math.log(hi) if math.isfinite(hi) else math.inf) for lo, hi in BANDS_K]

    def band_p(k: int, m: float, s: float) -> float:
        a, b = log_edges[k]
        za = -math.inf if a == -math.inf else (a - m) / s
        zb = math.inf if b == math.inf else (b - m) / s
        if za > 0:  # the band lies wholly above the centre: a difference of two upper tails keeps its digits
            return 0.5 * (math.erfc(za / SQRT2) - math.erfc(zb / SQRT2))
        return _phi(zb) - _phi(za)

    def nll(theta: Sequence[float]) -> float:
        m, ls = theta
        s = math.exp(ls)
        return -sum(counts[k] * math.log(max(band_p(k, m, s), 1e-300)) for k in nonempty)

    n = sum(counts)
    med = empirical_quantile(counts, 0.5) or 100.0
    res = optimize.minimize(nll, [math.log(med), 0.0], method="Nelder-Mead", options={"xatol": 1e-9, "fatol": 1e-9, "maxiter": 10000})
    m, s = float(res.x[0]), float(math.exp(res.x[1]))
    g = 0.0
    for k in nonempty:
        e = n * band_p(k, m, s)
        g += 2 * counts[k] * math.log(counts[k] / max(e, 1e-300))
    df = len(BANDS_K) - 3
    p = float(stats.chi2.sf(g, df)) if df > 0 else None
    return {"mu": m, "sigma": s, "median_k": math.exp(m) if m < 700 else math.inf, "g": g, "df": df, "p": p}
```

- [ ] **Step 5: Run it and watch it pass**

```bash
python -m pytest registers/uk/tests/test_banded.py -q
```

Expected: `22 passed`.

- [ ] **Step 6: Commit**

```bash
git add registers/uk/estimators/__init__.py registers/uk/tests/conftest.py registers/uk/estimators/banded.py registers/uk/tests/test_banded.py
git commit -m "registers/uk: the band estimator (quantiles, CDF, rounding range, the anchor mean, the lognormal model check), test-first" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 2: Rates, intervals and the publication rule

A year's insolvencies x among N live companies, read as a risk, gets the Wilson 95% interval (exact 0 and 1 at the edges,
where the formula leaves a floating-point crumb); a count alone gets Garwood's exact Poisson interval
`[chi2(0.025; 2x)/2, chi2(0.975; 2x + 2)/2]`. The relative standard error of a count is `1/sqrt(x)`, so a rate prints only
from 10 cases (RSE 32% or less) and carries "few cases" from 10 to 29. A duel between the highest and the lowest trade is
tested with the pooled two-proportion z-test; the home page compares every top member with every bottom member, so the
p-values are Holm-adjusted (sort ascending, multiply the i-th smallest by m - i + 1, keep them non-decreasing, cap at 1).
Every printed figure rounds the website's way, through `half_up` in `estimators/rounding.py`: pennies at any number of
places, half away from zero after 1e-7 of the last unit (Python's `round` sends an exact binary half to the even digit:
41 insolvencies among 4,000 companies is exactly 10.25 per 1,000, which it prints 10.2 where the website prints 10.3; on
100,000 numbers `half_up` and the website's pennies agree to the digit). Counts are whole and within their totals, or
refused. The test pins both edges of the publication rule, the exact top edge of Wilson's interval, a duel with no events
on either side and Holm's cap. Its review of 2026-10-03 added what still passed: a one-sided or a 1 - cdf p-value (the
duel's p is two-sided, and in the tail it is 2.0539e-109, not 0.0), Holm returning values in sorted order instead of the
caller's, Garwood at another level, the rse rounded by Python, and half_up at scale (12,345,678.125 to 12,345,678.13). Holm
now refuses a p-value that is not a number from 0 to 1 (a NaN turned the smallest p into 1.0), and an interval's z and
alpha are checked.

**Files:**
- Create: `registers/uk/estimators/rounding.py`
- Create: `registers/uk/estimators/rates.py`
- Test: `registers/uk/tests/test_rates.py` (create)

- [ ] **Step 1: Write the failing test**

Create `registers/uk/tests/test_rates.py`:

```python
"""Tests for estimators/rates.py. Run: python -m pytest registers/uk/tests -q"""
import pytest

from estimators.rates import garwood, holm, rate_per_1000, two_proportions, wilson
from estimators.rounding import half_up


def test_wilson_on_restaurant_failures():
    lo, hi = wilson(1259, 43634)
    assert round(1000 * lo, 3) == 27.324 and round(1000 * hi, 3) == 30.466


def test_wilson_never_leaves_zero_to_one():
    lo, hi = wilson(0, 500)
    assert lo == 0.0 and round(1000 * hi, 3) == 7.624
    with pytest.raises(ValueError):
        wilson(5, 3)


def test_garwood_known_values():
    assert [round(v, 4) for v in garwood(3)] == [0.6187, 8.7673]
    assert [round(v, 4) for v in garwood(0)] == [0.0, 3.6889]


def test_publication_rule():
    assert rate_per_1000(3, 2148)["publishable"] is False  # indie bookshops: 1.4 per 1,000 rests on 3 cases
    r = rate_per_1000(1259, 43634)
    assert r == {"value": 28.9, "lo": 27.3, "hi": 30.5, "rse": 0.028, "publishable": True, "few_cases": False}
    assert rate_per_1000(12, 5000)["few_cases"] is True


def test_duel_is_real():
    z, p = two_proportions(1259, 43634, 25, 18790)  # restaurants against dental practices, the 2026-10-02 counts
    assert round(z, 2) == 22.22 and p < 1e-100


def test_holm():
    assert [round(v, 4) for v in holm([0.01, 0.04, 0.03])] == [0.03, 0.06, 0.06]


def test_publication_rule_at_its_edges():
    assert rate_per_1000(9, 5000)["publishable"] is False and rate_per_1000(10, 5000)["publishable"] is True
    assert rate_per_1000(10, 5000)["few_cases"] is True and rate_per_1000(29, 5000)["few_cases"] is True
    assert rate_per_1000(30, 5000)["few_cases"] is False


def test_figures_round_as_the_website_rounds():
    # 41 of 4,000 is exactly 10.25 per 1,000: Python's round gives 10.2 (half to even), the website's pennies 10.3
    assert rate_per_1000(41, 4000)["value"] == 10.3
    assert half_up(2.675, 2) == 2.68 and half_up(-2.5, 0) == -3.0
    assert half_up(0.03 * 18_544.5, 2) == 556.34  # 556.335 stored a hair low: the 1e-7 allowance is what rounds it up
    assert half_up(-0.004, 2) == 0.0 and str(half_up(-0.004, 2)) == "0.0"


def test_wilson_at_the_top_edge():
    lo, hi = wilson(500, 500)
    assert hi == 1.0 and round(1000 * lo, 3) == 992.376
    assert wilson(10, 10)[1] == 1.0  # the formula's top is 0.9999999999999999 here: the edge is set, not computed


def test_no_events_on_either_side_is_no_difference():
    assert two_proportions(0, 100, 0, 200) == (0.0, 1.0)


def test_counts_must_be_whole_and_within_their_totals():
    for bad in (lambda: wilson(2.5, 10), lambda: wilson(float("nan"), 10), lambda: wilson(-1, 10), lambda: garwood(1.5),
                lambda: two_proportions(0, 0, 1, 10), lambda: two_proportions(11, 10, 1, 10), lambda: half_up(float("inf"), 1)):
        with pytest.raises(ValueError):
            bad()


def test_holm_caps_at_one():
    assert holm([0.6, 0.7]) == [1.0, 1.0]


def test_two_proportions_p_is_two_sided_and_exact_in_the_tail():
    z, p = two_proportions(30, 1000, 20, 1000)
    assert round(z, 4) == 1.4322 and round(p, 4) == 0.1521  # two-sided (one-sided: 0.0760)
    assert two_proportions(20, 1000, 30, 1000) == (-z, p)    # swapping the sides flips z, never p
    assert 2.053e-109 < two_proportions(1259, 43634, 25, 18790)[1] < 2.054e-109  # the tail itself, not 1 - cdf (0.0)


def test_holm_returns_the_callers_order():
    assert [round(v, 4) for v in holm([0.04, 0.01, 0.03])] == [0.06, 0.03, 0.06]
    assert [round(v, 4) for v in holm([0.5, 0.001])] == [0.5, 0.002]


def test_holm_refuses_what_is_not_a_p_value():
    for bad in ([0.01, float("nan")], [0.04, float("nan"), 0.01], [-0.1], [1.5]):
        with pytest.raises(ValueError):
            holm(bad)


def test_garwood_at_one_and_at_another_level():
    assert [round(v, 4) for v in garwood(1)] == [0.0253, 5.5716]
    assert [round(v, 4) for v in garwood(3, 0.10)] == [0.8177, 7.7537]


def test_an_interval_needs_a_positive_z_and_an_alpha_between_0_and_1():
    for bad in (lambda: wilson(3, 100, float("nan")), lambda: wilson(3, 100, 0), lambda: garwood(3, 1.5), lambda: garwood(3, 0.0), lambda: garwood(3, float("nan"))):
        with pytest.raises(ValueError):
            bad()


def test_rate_fields_below_the_rule_and_at_a_binary_tie():
    assert rate_per_1000(9, 5000)["few_cases"] is False
    assert rate_per_1000(0, 500)["rse"] is None
    assert rate_per_1000(256, 10000)["rse"] == 0.063  # 1/16 = 0.0625 exactly: the website gives 0.063, Python's round 0.062


def test_half_up_where_the_allowance_vanishes_and_at_a_knife_edge():
    assert half_up(12_345_678.125, 2) == 12345678.13 and half_up(2_000_000_000.5, 0) == 2000000001.0
    assert half_up(39059.254999999, 2) == 39059.26  # the allowance added after scaling, as the website does
    assert half_up(4503599627370497.0, 0) == 4503599627370497.0


def test_the_second_side_and_empty_totals_are_refused():
    for bad in (lambda: two_proportions(1, 10, 11, 10), lambda: two_proportions(1, 10, 1, 0), lambda: wilson(0, 0)):
        with pytest.raises(ValueError):
            bad()
```

- [ ] **Step 2: Run it and watch it fail**

```bash
python -m pytest registers/uk/tests/test_rates.py -q
```

Expected: a collection error ending `ModuleNotFoundError: No module named 'estimators.rates'`, exit code 2.

- [ ] **Step 3: Write the implementation**

Create `registers/uk/estimators/rounding.py`:

```python
"""
estimators/rounding.py: the one way a register figure is rounded for print, the website's way.

The website rounds money with pennies() in src/lib/uk/law/money.ts: half away from zero, after adding 1e-7 of the last unit,
so a decimal half that binary floating point stores a hair low (2.675 is 2.67499999999999982...) still rounds up. Python's
round() differs twice: it sends an exact binary half to the even digit (round(10.25, 1) is 10.2, where a page prints 10.3),
and it rounds a stored-low half down (round(2.675, 2) is 2.67). half_up() is pennies() at any number of places, computed in
the same order with the same doubles, so the registers and the website print the same digits for the same number.
"""
from __future__ import annotations

import math


def half_up(x: float, places: int) -> float:
    """x rounded to `places` decimals, half away from zero, never -0.0 (which a formatter prints as -0)."""
    if not math.isfinite(x):
        raise ValueError(f"half_up: not a finite number ({x})")
    scale = 10 ** places
    v = abs(x) * scale + 1e-7
    q = math.floor(v)
    if v - q >= 0.5:  # Math.round in the website: the nearest integer, a half going up
        q += 1
    return 0.0 if q == 0 else math.copysign(q / scale, x)
```

Create `registers/uk/estimators/rates.py`:

```python
"""
estimators/rates.py: rates per 1,000 with their intervals, when a figure may be published, and whether two differ.

A year of insolvencies x among N live companies is a census count, but the page reads it as a risk ("how likely a restaurant
company is to fail in a year"), and a risk estimated from x events has the uncertainty of x:

  WILSON (the proportion x / N):  centre (p + z^2/2N) / (1 + z^2/N), half-width z sqrt(p(1-p)/N + z^2/4N^2) / (1 + z^2/N).
      Good at small x and never outside [0, 1]; used for every rate per 1,000.
  GARWOOD (an exact Poisson interval for the count x): [chi2(alpha/2; 2x) / 2, chi2(1 - alpha/2; 2x + 2) / 2].
      For a count alone, with no total to divide by (x insolvencies in a month); nothing in the registers calls it yet.
  RELATIVE STANDARD ERROR of a Poisson count: 1 / sqrt(x). A rate prints only from x >= 10 (RSE <= 32%); between 10 and 30
      it prints with "few cases".
  TWO RATES (a duel): the pooled two-proportion z-test; when one page compares many pairs, the p-values are Holm-adjusted
      (sort ascending, multiply the i-th smallest by (m - i + 1), keep them non-decreasing, cap at 1), returned in the
      caller's order. A reader may call a difference real at an adjusted p below 0.01; the feed stores the largest adjusted
      p of the pairs it shows and leaves the call to the reader. A p-value under about 1e-300 underflows to 0.0.

Counts are whole numbers: a part count, a negative one or one that is not a number is refused (a NaN slipped through every
comparison and came back as the interval [0, 1]); so is a z or an alpha that cannot make an interval, and a p-value
outside 0 to 1 (a NaN among Holm's inputs sorted to the wrong place and turned the smallest p into 1.0). Printed figures
round as the website rounds (estimators/rounding.py).
"""
from __future__ import annotations

import math
from typing import Sequence

from scipy import stats

from .rounding import half_up

Z95 = 1.959963984540054


def _count(v: float, what: str) -> int:
    f = float(v)
    if not f.is_integer() or f < 0:
        raise ValueError(f"{what}: {v} is not a count")
    return int(f)


def wilson(x: int, n: int, z: float = Z95) -> tuple[float, float]:
    x, n = _count(x, "wilson"), _count(n, "wilson")
    if not (math.isfinite(z) and z > 0):
        raise ValueError(f"wilson: z must be a positive number ({z})")
    if n <= 0 or x > n:
        raise ValueError("wilson: need 0 <= x <= n and n > 0")
    p = x / n
    den = 1 + z * z / n
    centre = (p + z * z / (2 * n)) / den
    half = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / den
    # at x = 0 (or x = n) the bound is exactly 0 (or 1); floating point leaves a residue (up to 1e-16, and negative at x = 0
    # for some n) that a caller printing wilson() unrounded would show as a figure
    lo = 0.0 if x == 0 else max(0.0, centre - half)
    hi = 1.0 if x == n else min(1.0, centre + half)
    return lo, hi


def garwood(x: int, alpha: float = 0.05) -> tuple[float, float]:
    x = _count(x, "garwood")
    if not 0 < alpha < 1:
        raise ValueError(f"garwood: alpha must be between 0 and 1 ({alpha})")
    lo = 0.0 if x == 0 else float(stats.chi2.ppf(alpha / 2, 2 * x)) / 2
    hi = float(stats.chi2.ppf(1 - alpha / 2, 2 * (x + 1))) / 2
    return lo, hi


def rate_per_1000(x: int, n: int) -> dict:
    lo, hi = wilson(x, n)
    rse = 1 / math.sqrt(x) if x > 0 else None
    return {
        "value": half_up(1000 * x / n, 1),
        "lo": half_up(1000 * lo, 1),
        "hi": half_up(1000 * hi, 1),
        "rse": None if rse is None else half_up(rse, 3),
        "publishable": x >= 10,
        "few_cases": 10 <= x < 30,
    }


def two_proportions(x1: int, n1: int, x2: int, n2: int) -> tuple[float, float]:
    """Pooled two-proportion z statistic and its two-sided p-value."""
    x1, n1, x2, n2 = (_count(v, "two_proportions") for v in (x1, n1, x2, n2))
    if n1 <= 0 or n2 <= 0 or x1 > n1 or x2 > n2:
        raise ValueError("two_proportions: need 0 <= x <= n and n > 0 on both sides")
    p = (x1 + x2) / (n1 + n2)
    se = math.sqrt(p * (1 - p) * (1 / n1 + 1 / n2))
    if se == 0:
        return 0.0, 1.0
    z = (x1 / n1 - x2 / n2) / se
    return z, float(2 * stats.norm.sf(abs(z)))


def holm(pvalues: Sequence[float]) -> list[float]:
    if not all(0.0 <= float(p) <= 1.0 for p in pvalues):  # a NaN fails both comparisons
        raise ValueError("holm: every p-value must be a number from 0 to 1")
    m = len(pvalues)
    order = sorted(range(m), key=lambda i: pvalues[i])
    adjusted = [0.0] * m
    running = 0.0
    for rank, i in enumerate(order):
        running = max(running, min(1.0, (m - rank) * pvalues[i]))
        adjusted[i] = running
    return adjusted
```

- [ ] **Step 4: Run it and watch it pass**

```bash
python -m pytest registers/uk/tests/test_rates.py -q
```

Expected: `20 passed`.

- [ ] **Step 5: Commit**

```bash
git add registers/uk/estimators/rounding.py registers/uk/estimators/rates.py registers/uk/tests/test_rates.py
git commit -m "registers/uk: rates with Wilson and Garwood intervals, the 10-case publication rule, two-proportion tests and Holm, test-first" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 3: Survival on current closure rates

For a cohort born in year c, `h_c(t) = 1 - s_c(t)/s_c(t-1)` is its chance of closing in its t-th year. The figure a new owner
needs is survival on today's closure rates: take each year's hazard from the newest cohort that has both ends of that year
and chain them, `S(t) = prod_{j<=t} (1 - h_j)`, with Greenwood's variance `S(t)^2 sum_j h_j / (n_j (1 - h_j))`. With the
2024 tables every hazard is calendar 2024's. Printing each horizon from its own latest cohort instead mixes cohorts and can
rise from one year to the next, which survival cannot do; the test builds exactly that case. It also pins the Greenwood
bounds (computed independently with exact fractions), stops the curve at a year no cohort has, never uses a cohort without
the year before, and refuses survivors that rise or fall below zero; figures round the website's way. Its review of
2026-10-03 found the arithmetic exact and four things to change. Greenwood's variance is 0 where nothing has closed or
everyone has, which printed "100%, from 100% to 100%": there the interval is now the exact one (with no closure so far,
the lower limit is 0.025^(1 / n), n the fewest at risk in any year so far; once a year closes everyone, the upper limit is
1 - 0.025^(1 / n) for the n at risk then). The counts are checked from the cohort's births through every year read, before
the curve can stop on nobody at risk (a rise from 0 and a rise behind the year read went through). Shares are rounded to
six decimals, or to `digits` (the builder stores twelve): printed as percentages to one decimal, four decimals rounded
again got about one figure in twenty a tenth off, and six still one in two thousand (the review of tasks 6 to 8 found
group 561's five-year upper limit, 0.29949967, stored as 0.2995 and printed 30.0 for 29.9). And eight tests pin the clip, half-up ties, the hazards, the horizon, the order of the cohorts, year one's births, a
cohort without year one, and the zero-width cases; a sixteenth pins twelve decimals against six. All 17 deliberate faults
on the module fail.

**Files:**
- Create: `registers/uk/estimators/survival.py`
- Test: `registers/uk/tests/test_survival.py` (create)

- [ ] **Step 1: Write the failing test**

Create `registers/uk/tests/test_survival.py`:

```python
"""Tests for estimators/survival.py. Run: python -m pytest registers/uk/tests -q

Every expected figure was computed apart from the module, with exact fractions for S and Greenwood's sum, 60-digit
decimals for the square roots and the exact limits, and half-up rounding of the exact value to six decimals."""
import pytest

from estimators.rounding import half_up
from estimators.survival import synthetic_cohort

BIRTHS = {2019: 1000, 2020: 1000, 2023: 1000}
SURVIVORS = {
    2019: {1: 900, 2: 700, 3: 600, 4: 500, 5: 400},
    2020: {1: 910, 2: 720, 3: 610, 4: 520},
    2023: {1: 950},
}


def test_synthetic_cohort_uses_the_newest_cohort_for_each_year():
    rows = synthetic_cohort(BIRTHS, SURVIVORS)
    assert [r["cohort"] for r in rows] == [2023, 2020, 2020, 2020, 2019]
    assert [r["survival"] for r in rows] == [0.95, 0.751648, 0.636813, 0.542857, 0.434286]


def test_synthetic_cohort_never_rises():
    rows = synthetic_cohort(BIRTHS, SURVIVORS)
    s = [r["survival"] for r in rows]
    assert all(a >= b for a, b in zip(s, s[1:]))
    assert all(r["lo"] <= r["survival"] <= r["hi"] for r in rows)


def test_mixing_cohorts_rises_where_the_synthetic_curve_cannot():
    births = {2021: 1000, 2022: 1000, 2023: 1000}
    survivors = {2021: {1: 900, 2: 850, 3: 820}, 2022: {1: 800, 2: 600}, 2023: {1: 950}}
    mixed = [survivors[2023][1] / 1000, survivors[2022][2] / 1000, survivors[2021][3] / 1000]  # each horizon's newest cohort
    assert mixed == [0.95, 0.6, 0.82] and mixed[2] > mixed[1]  # a curve that rises: survival cannot do that
    s = [r["survival"] for r in synthetic_cohort(births, survivors, horizon=3)]
    assert s == [0.95, 0.7125, 0.687353]


def test_greenwood_interval():
    rows = synthetic_cohort(BIRTHS, SURVIVORS)
    assert [(r["lo"], r["hi"]) for r in rows] == [(0.936492, 0.963508), (0.724379, 0.778918), (0.606417, 0.66721), (0.511351, 0.574363), (0.402702, 0.46587)]


def test_the_hazard_is_each_years_chance_of_closing():
    rows = synthetic_cohort(BIRTHS, SURVIVORS)
    assert [r["hazard"] for r in rows] == [0.05, 0.208791, 0.152778, 0.147541, 0.2]  # 1/20, 19/91, 11/72, 9/61, 1/5


def test_the_interval_is_clipped_to_zero_and_one():
    top = synthetic_cohort({2023: 20}, {2023: {1: 19}})[0]      # 19 of 20: Greenwood's hi is 1.045519
    assert (top["survival"], top["lo"], top["hi"]) == (0.95, 0.854481, 1.0)
    bottom = synthetic_cohort({2023: 20}, {2023: {1: 1}})[0]    # 1 of 20: Greenwood's lo is -0.045519
    assert (bottom["survival"], bottom["lo"], bottom["hi"]) == (0.05, 0.0, 0.145519)


def test_figures_round_half_up_not_half_even():
    row = synthetic_cohort({2019: 128}, {2019: {1: 127}})[0]  # a hazard of 1/128 = 0.0078125 exactly: Python's round gives 0.007812
    assert (row["hazard"], row["survival"]) == (0.007813, 0.992188)


def test_where_nothing_closed_the_interval_is_the_exact_one():
    # Greenwood's variance is 0 here and would print 100%, from 100% to 100%; the exact lower limit is 0.025^(1/n),
    # n the fewest at risk in any year so far
    assert [(r["survival"], r["lo"], r["hi"]) for r in synthetic_cohort({2019: 1000}, {2019: {1: 1000}})] == [(1.0, 0.996318, 1.0)]
    rows = synthetic_cohort({2019: 400, 2020: 1000}, {2019: {1: 400, 2: 400}, 2020: {1: 1000}})
    assert [(r["cohort"], r["survival"], r["lo"]) for r in rows] == [(2020, 1.0, 0.996318), (2019, 1.0, 0.99082)]
    rows = synthetic_cohort({2019: 1000, 2020: 400}, {2019: {1: 1000, 2: 1000}, 2020: {1: 400}})  # the fewest at risk came first
    assert [(r["cohort"], r["survival"], r["lo"]) for r in rows] == [(2020, 1.0, 0.99082), (2019, 1.0, 0.99082)]


def test_where_everyone_closed_the_interval_is_the_exact_one_and_the_curve_ends():
    rows = synthetic_cohort({2019: 1000}, {2019: {1: 900, 2: 0}})
    assert [(r["hazard"], r["survival"], r["lo"], r["hi"]) for r in rows] == [(0.1, 0.9, 0.881406, 0.918594), (1.0, 0.0, 0.0, 0.00409)]
    rows = synthetic_cohort({2019: 1000}, {2019: {1: 0, 2: 0}})  # nobody left to observe a second year
    assert [(r["year"], r["survival"], r["hi"]) for r in rows] == [(1, 0.0, 0.003682)]


def test_the_horizon_cuts_the_curve():
    rows = synthetic_cohort({2019: 1000}, {2019: {1: 900, 2: 800, 3: 700}}, horizon=2)
    assert [r["year"] for r in rows] == [1, 2]


def test_a_missing_year_ends_the_curve():
    rows = synthetic_cohort({2019: 1000}, {2019: {1: 900, 2: 800, 4: 600, 5: 500}})  # year 3 withheld
    assert [r["year"] for r in rows] == [1, 2]


def test_the_order_of_the_cohorts_does_not_matter():
    rows = synthetic_cohort({2023: 1000, 2020: 1000, 2019: 1000}, SURVIVORS)  # newest first
    assert [r["cohort"] for r in rows] == [2023, 2020, 2020, 2020, 2019]
    assert [r["survival"] for r in rows] == [0.95, 0.751648, 0.636813, 0.542857, 0.434286]


def test_year_one_starts_from_the_births_of_the_cohort_it_uses():
    births = {2021: 1100, 2022: 1200, 2023: 900}  # every cohort differs; 2023 has no survivors yet
    rows = synthetic_cohort(births, {2021: {1: 990}, 2022: {1: 1020}})
    assert [(r["cohort"], r["survival"]) for r in rows] == [(2022, 0.85)]  # 1020 / 1200


def test_a_cohort_without_the_year_before_is_not_used():
    rows = synthetic_cohort({2019: 1000, 2021: 1000}, {2019: {1: 900, 2: 800, 3: 700}, 2021: {1: 950, 3: 850}})
    assert [r["cohort"] for r in rows] == [2021, 2019, 2019]
    rows = synthetic_cohort({2019: 1000, 2022: 1000}, {2019: {1: 900, 2: 800}, 2022: {2: 700}})
    assert [(r["cohort"], r["survival"]) for r in rows] == [(2019, 0.9), (2019, 0.8)]


def test_counts_that_rise_or_fall_below_zero_are_refused():
    for births, survivors in (
        ({2019: 1000}, {2019: {1: 900, 2: 950}}),                                      # a rise between the years read
        ({2019: 1000}, {2019: {1: -5}}),                                                # below zero
        ({2019: 1000}, {2019: {1: 0, 2: 10}}),                                          # a rise from nobody
        ({2020: 1000, 2021: 1000}, {2020: {1: 900, 2: -5, 3: 100}, 2021: {1: 920, 2: 800}}),  # below zero, in a year not read
        ({2020: 1000, 2021: 1000}, {2020: {1: 900, 2: 950, 3: 700}, 2021: {1: 920, 2: 800}}),  # a rise behind the year read
    ):
        with pytest.raises(ValueError, match="synthetic_cohort"):
            synthetic_cohort(births, survivors)


def test_twelve_decimals_keep_a_share_on_its_side_of_a_printed_tenth():
    # 29,949,967 of 100,000,000 still trading after a year is 29.949967%, which prints 29.9; stored to six decimals it
    # becomes 0.2995 and prints 30.0 (group 561's five-year upper limit in the 2024 tables does exactly this)
    six = synthetic_cohort({2023: 100_000_000}, {2023: {1: 29_949_967}})[0]
    twelve = synthetic_cohort({2023: 100_000_000}, {2023: {1: 29_949_967}}, digits=12)[0]
    assert six["survival"] == 0.2995 and half_up(six["survival"] * 100, 1) == 30.0
    assert twelve["survival"] == 0.29949967 and half_up(twelve["survival"] * 100, 1) == 29.9
    assert twelve["hazard"] == 0.70050033 and twelve["lo"] < twelve["survival"] < twelve["hi"]
```

- [ ] **Step 2: Run it and watch it fail**

```bash
python -m pytest registers/uk/tests/test_survival.py -q
```

Expected: a collection error ending `ModuleNotFoundError: No module named 'estimators.survival'`, exit code 2.

- [ ] **Step 3: Write the implementation**

Create `registers/uk/estimators/survival.py`:

```python
"""
estimators/survival.py: one survival curve from several birth cohorts, without mixing them into a curve that can rise.

The statistics office reports, for each year's new businesses (a cohort), how many are still trading one to five years on.
The latest cohort to reach each horizon is a different one (five years: born 2019; one year: born 2023). Printing each
horizon from its own latest cohort mixes cohorts, and the curve it draws can go UP from one year to the next.

THE SYNTHETIC COHORT (a period life table). For each year t, the chance of closing during year t given trading at t - 1 is
taken from the latest cohort that has both points:
    h_t = 1 - s_c(t) / s_c(t - 1)          (s_c(0) = the cohort's births)
and the curve is the product of the year-by-year chances of staying open:
    S(t) = prod_{j <= t} (1 - h_j)
It cannot rise, it uses the newest evidence for every year, and S(1) equals the latest one-year figure exactly. A year no
usable cohort has ends the curve there (the years after a gap are not chained across it), and so does a year whose newest
cohort has nobody left at risk.

GREENWOOD'S VARIANCE gives each S(t) an interval: Var S(t) ~ S(t)^2 * sum_{j <= t} h_j / (n_j (1 - h_j)), n_j being the
businesses at risk at the start of year j in the cohort used for that year, and the 95% interval S +- 1.96 sd, clipped to
[0, 1]. With counts rounded to 5, the interval is a floor on the uncertainty, not all of it. Greenwood's variance is 0
where nothing has closed (S = 1) or everyone has (S = 0), which would print a certainty the counts do not have ("100%,
from 100% to 100%"); there the interval is the exact one. With no closure in any year so far, the likeliest way for S to
be as low as L is one year carrying all of it, so the lower limit is L = 0.025^(1 / n_min), n_min the fewest at risk in
any year so far (for one year this is Clopper-Pearson's exact limit); once a year closes everyone, S can be no more than
that year's own upper limit, 1 - 0.025^(1 / n) for the n at risk then.

THE COUNTS a curve reads are checked: from a cohort's births through every year the curve uses, its counts must not rise
or fall below zero, or the cohort is refused (ValueError). True counts never rise; published ones can, because each count
is rounded on its own (the workbook's notes say so): in the 2024 tables eight cohort rows in five small groups rise. The
builder decides what to do with a refused group.

Each row: year, cohort, hazard (that year's chance of closing), survival, and lo and hi (its 95% interval), shares rounded
half up to `digits` decimals (estimators/rounding.py): six by default, twelve where a builder stores them. A page prints a
share as a percentage to one decimal, so a stored share is rounded twice: stored to four decimals, about one figure in
twenty would print a tenth off (0.41449 stored as 0.4145 prints 41.5 for 41.4); six leave about one in two thousand
(group 561's five-year upper limit in the 2024 tables, 0.29949967, stored as 0.2995, printed 30.0 for 29.9); twelve,
about one in two thousand million.
"""
from __future__ import annotations

import math

from .rounding import half_up

Z = 1.96
TAIL = 0.025  # each side of a 95% interval


def synthetic_cohort(births: dict[int, int], survivors: dict[int, dict[int, int]], horizon: int = 5, digits: int = 6) -> list[dict]:
    """births[c] = the cohort's births; survivors[c][t] = still trading t years on. Returns one row per year t, its shares
    rounded half up to `digits` decimals."""
    rows = []
    s = 1.0
    var_sum = 0.0
    n_min = math.inf  # the fewest at risk in any year so far
    n_zero = None     # those at risk in the year that closed everyone
    for t in range(1, horizon + 1):
        usable = [c for c in births if t in survivors.get(c, {}) and (t == 1 or (t - 1) in survivors.get(c, {}))]
        if not usable:
            break
        c = max(usable)
        seq = [births[c]] + [survivors[c][j] for j in range(1, t + 1) if j in survivors[c]]
        if seq[0] < 0 or any(not 0 <= b <= a for a, b in zip(seq, seq[1:])):
            raise ValueError(f"synthetic_cohort: cohort {c} rises or falls below zero from its births to year {t}: {seq}")
        at_risk = births[c] if t == 1 else survivors[c][t - 1]
        if at_risk <= 0:
            break
        h = 1 - survivors[c][t] / at_risk
        s *= 1 - h
        n_min = min(n_min, at_risk)
        if 0 < h < 1:
            var_sum += h / (at_risk * (1 - h))
        if h == 1 and n_zero is None:
            n_zero = at_risk
        se = s * math.sqrt(var_sum)
        lo, hi = max(0.0, s - Z * se), min(1.0, s + Z * se)
        if s == 1.0:
            lo = TAIL ** (1 / n_min)
        elif s == 0.0:
            hi = 1 - TAIL ** (1 / n_zero)
        rows.append({"year": t, "cohort": c, "hazard": half_up(h, digits), "survival": half_up(s, digits), "lo": half_up(lo, digits), "hi": half_up(hi, digits)})
    return rows
```

- [ ] **Step 4: Run it and watch it pass**

```bash
python -m pytest registers/uk/tests/test_survival.py -q
```

Expected: `16 passed`.

- [ ] **Step 5: Commit**

```bash
git add registers/uk/estimators/survival.py registers/uk/tests/test_survival.py
git commit -m "registers/uk: survival on the latest year's closure rates (a synthetic cohort) with Greenwood intervals, test-first" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 4: The invariants every rebuilt table must keep

The builders' edits in tasks 5 to 8 change tables, not functions, so their red-then-green cycle is a test over the built
tables. It pins no figure (the registers refresh monthly and yearly) and only invariants: quantiles in order and bracketing
the median, and every stored turnover field equal to the estimators' own output on the stored counts (the quantiles, which
of them print in words, the median's range rounded outward, the thin rule); survival that never rises, sits inside its
interval and is stored to twelve decimals, with only the City of London never ranked; rates inside their intervals with
the publication rule applied; and a feed that prints only publishable rates, keeps its survival items full, leaves the
City of London out of demography rankings and says so, ranks no open-band median among the takings, and reads from the
figures which way the 2019 cohort differs. Its review of 2026-10-03 broke 20 rebuilds on purpose and 17 passed the first
version; this one is checked against 28 deliberate faults in the builders' new rules and fails all but one, which no table
today can show (a median of exactly 50m flagged in the builder's own words).

**Files:**
- Test: `registers/uk/tests/test_tables.py` (create)

- [ ] **Step 1: Write the test**

Create `registers/uk/tests/test_tables.py`:

```python
"""Invariants of the built tables: what every rebuild must keep, whatever month's data it holds. Reads registers/uk/tables,
so it runs after the builders (python -m pytest registers/uk/tests -q). No figure is pinned here: the registers refresh
monthly and yearly; a pinned figure belongs in a builder's own check, not in a test that must hold next month."""
import json
import math
from pathlib import Path

from estimators.banded import empirical_quantile, in_open_band, rounding_range
from estimators.rounding import half_up

TABLES = Path(__file__).resolve().parent.parent / "tables"
CITY_OF_LONDON = "E09000001"


def load(name: str) -> dict:
    return json.loads((TABLES / name).read_text(encoding="utf-8"))


def test_turnover_quantiles_are_ordered_and_bracket_the_median():
    d = load("london_trades_by_borough.json")
    seen = 0
    for slug, t in d["trades"].items():
        for geo, r in t["by_geography"].items():
            assert len(r["turnover_bands_k"]) == 10, (slug, geo)
            q = r["turnover_quantiles_k"]
            if q is None:
                continue
            seen += 1
            assert q["q10"] <= q["q25"] <= q["q50"] <= q["q75"] <= q["q90"], (slug, geo)
            lo, hi = r["median_range_k"]
            assert lo - 0.05 <= q["q50"] <= hi + 0.05, (slug, geo)  # the stored median is rounded to a tenth, the range outward to the pound
            assert r["median_turnover_k"] == q["q50"], (slug, geo)
            assert set(r["quantiles_in_open_band"]) <= set(q), (slug, geo)
    assert seen > 0


def test_period_survival_never_rises_and_sits_inside_its_interval():
    d = load("survival_london_and_trades.json")
    assert all(b["ranked"] == (code != CITY_OF_LONDON) and bool(b["not_ranked_because"]) == (code == CITY_OF_LONDON) for code, b in d["by_borough"].items())
    curves = [b["survival_period"] for b in d["by_borough"].values()]
    curves += [g["survival_period"] for t in d["by_trade"].values() for g in t["groups"]]
    assert curves
    for c in curves:
        s = [r["survival"] for r in c]
        assert all(a >= b for a, b in zip(s, s[1:]))
        assert all(r["lo"] <= r["survival"] <= r["hi"] for r in c)
        assert [r["year"] for r in c] == list(range(1, len(c) + 1))
    assert sum(len(c) == 5 for c in curves) >= 0.9 * len(curves)  # a refused group is withheld (empty); most curves are whole
    shares = [r[k] for c in curves for r in c for k in ("survival", "lo", "hi")]
    assert all(half_up(x, 12) == x for x in shares) and sum(half_up(x, 6) != x for x in shares) > 0.9 * len(shares)  # twelve decimals: a page rounds once


def test_failure_rates_carry_their_interval_and_the_publication_rule():
    d = load("company_failures_by_trade.json")
    rated = 0
    for slug, v in d["trades"].items():
        r = v.get("uk_rate")
        if r is None:
            assert not v.get("uk_live_companies") or v.get("uk_insolvent") is None, slug
            continue
        rated += 1
        assert r["lo"] <= r["value"] <= r["hi"], slug
        assert r["publishable"] == (v["uk_insolvent"] >= 10), slug
        assert r["few_cases"] == (10 <= v["uk_insolvent"] < 30), slug
    assert rated > 0


def test_feed_prints_only_publishable_rates_and_leaves_the_city_out_of_demography():
    items = {i["id"]: i for i in load("editorial_feed.json")["items"]}
    fail = items["fail-most"]
    assert fail["floor"].startswith("10 insolvencies")
    assert all(r["lo"] <= r["value"] <= r["hi"] for r in fail["top"] + fail["bottom"])
    assert all(r["insolvent"] >= 10 and r["few_cases"] == (r["insolvent"] < 30) for r in fail["top"] + fail["bottom"])
    assert fail["duel"]["pairs_tested"] == len(fail["top"]) * len(fail["bottom"])
    longest = items["last-longest"]
    assert longest["top"] and longest["bottom"] and items["last-where"]["top"] and items["last-where"]["bottom"]
    assert all("cohort_2019_five_years" in r and r["lo"] <= r["value"] <= r["hi"] for r in longest["top"] + longest["bottom"])
    rest = items["restaurants-year-one"]
    assert set(rest["answer"]) == {"after_one_year", "after_five_years", "after_five_years_2019_cohort"}
    assert ("closed fewer" in rest["definition"]) == (rest["answer"]["after_five_years_2019_cohort"] > rest["answer"]["after_five_years"])
    nb = load("london_trades_by_borough.json")["trades"]
    takings = items["takings"]["top"] + items["takings"]["bottom"]
    assert takings and all("q50" not in nb[r["trades"][0]]["by_geography"]["E12000007"]["quantiles_in_open_band"] for r in takings)  # an open-band median prints in words
    boroughs = {c: b for c, b in load("survival_london_and_trades.json")["by_borough"].items() if c.startswith("E09")}
    for key in ("last-where", "open-close"):
        assert [x["code"] for x in items[key]["not_ranked"]] == [CITY_OF_LONDON], key
        assert all(r["code"] != CITY_OF_LONDON for r in items[key]["top"] + items[key]["bottom"]), key
    assert items["open-close"]["members"] == sum(1 for b in boroughs.values() if b["ranked"] and b["active_2024"])
    assert items["last-where"]["members"] + items["last-where"]["left_out"] == sum(1 for b in boroughs.values() if b["ranked"])


QUANTILES = {"q10": 0.1, "q25": 0.25, "q50": 0.5, "q75": 0.75, "q90": 0.9}


def test_turnover_fields_are_the_estimators_own_on_the_stored_counts():
    d = load("london_trades_by_borough.json")
    checked = 0
    for slug, t in d["trades"].items():
        for geo, r in t["by_geography"].items():
            where = (slug, geo)
            b = r["turnover_bands_k"]
            assert len(b) == 10 and all(isinstance(c, int) and not isinstance(c, bool) and c >= 0 for c in b), where
            assert r["thin"] == (r["enterprises"] < 40), where
            q = r["turnover_quantiles_k"]
            if r["thin"] or sum(b) == 0:
                assert (q is None and r["median_range_k"] is None and r["lognormal_fit_p"] is None
                        and r["median_turnover_k"] is None and r["quantiles_in_open_band"] == []), where
                continue
            assert abs(sum(b) - r["enterprises"]) <= 25, where  # each count rounded to 5 on its own
            assert set(q) == set(QUANTILES), where
            for name, p in QUANTILES.items():
                v = empirical_quantile(b, p)
                assert q[name] == round(v, 1), (where, name)
                assert (name in r["quantiles_in_open_band"]) == in_open_band(v), (where, name)
            lo, hi = rounding_range(b, 0.5)
            assert r["median_range_k"] == [math.floor(lo * 1000) / 1000, math.ceil(hi * 1000) / 1000], where
            assert r["median_range_k"][0] <= empirical_quantile(b, 0.5) <= r["median_range_k"][1], where
            assert r["under_100k_share"] == round((b[0] + b[1]) / sum(b), 3), where
            p = r["lognormal_fit_p"]
            assert (p is None) == (sum(1 for c in b if c > 0) < 3) and (p is None or 0 <= p <= 1), where
            checked += 1
    assert checked > 0
```

- [ ] **Step 2: Run it against today's tables and watch all five fail**

```bash
python -m pytest registers/uk/tests/test_tables.py -q
```

Expected: `5 failed`: a `KeyError: 'turnover_bands_k'` in both turnover tests, a `KeyError: 'ranked'`, an `AssertionError`
naming a trade (no `uk_rate` yet) and an `AssertionError` in the feed test. Tasks 5 to 8 turn them green one by one.

- [ ] **Step 3: Commit**

```bash
git add registers/uk/tests/test_tables.py
git commit -m "registers/uk: the invariants every rebuilt table keeps (failing until the builders carry the estimators)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit.

### Task 5: Turnover quantiles, their rounding range and the model check in `build_nomis.py`

The builder's own median (`median_k`) becomes `empirical_quantile(bands, 0.5)`, the same log-uniform reading, so every
published median stays the same (checked: 4,795 of 4,795); the old function is deleted. Per area it adds the ten band
counts, q10 to q90 (not for an area under 40 enterprises), which of them print in words (`in_open_band`), the median's
rounding range and the lognormal model check's p-value, with plain caveats saying what each is (the ledger prints them on
About the figures, and the drafts in their articles). The range is stored rounded outward to the pound: rounded to the
nearest 100 pounds, an end could fall inside the median it must hold. The shared-code caveat loses its file name.

**Files:**
- Modify: `registers/uk/build_nomis.py`
- Rebuilt: `registers/uk/tables/london_trades_by_borough.json`, `registers/uk/tables/london_trades_by_borough.csv`

- [ ] **Step 1: Edit build_nomis.py**

In `registers/uk/build_nomis.py`, replace:

```python
from pathlib import Path
```

with:

```python
from pathlib import Path

from estimators.banded import empirical_quantile, in_open_band, lognormal_fit, rounding_range
```

- [ ] **Step 2: Edit build_nomis.py**

In `registers/uk/build_nomis.py`, replace:

```python
def latest_raw() -> Path:
```

with:

```python
QUANTILES = {"q10": 0.1, "q25": 0.25, "q50": 0.5, "q75": 0.75, "q90": 0.9}


def thin_count(enterprises: int) -> bool:
    return enterprises < 40


def latest_raw() -> Path:
```

- [ ] **Step 3: Edit build_nomis.py**

In `registers/uk/build_nomis.py`, replace:

```python
            n_bands = sum(th.get(b, 0) for b in TURNOVER_BANDS)
            med = median_k(th)
```

with:

```python
            n_bands = sum(th.get(b, 0) for b in TURNOVER_BANDS)
            bands = [th.get(str(i), 0) for i in range(1, 11)]
            med = empirical_quantile(bands, 0.5) if n_bands else None
            quants, open_q = {}, []
            if n_bands and not thin_count(ent):
                for name, q in QUANTILES.items():
                    v = empirical_quantile(bands, q)
                    quants[name] = round(v, 1)
                    if in_open_band(v):
                        open_q.append(name)
            rng = rounding_range(bands, 0.5) if (n_bands and not thin_count(ent)) else None
            fit = lognormal_fit(bands) if (n_bands and not thin_count(ent)) else None
```

- [ ] **Step 4: Edit build_nomis.py**

In `registers/uk/build_nomis.py`, replace:

```python
                "units_by_staff": staff,
                "thin": thin,
            }
```

with:

```python
                "units_by_staff": staff,
                "thin": thin,
                "turnover_bands_k": bands,
                "turnover_quantiles_k": quants or None,
                "quantiles_in_open_band": open_q,
                # outward to the pound, so the stored range always holds the median and never narrows it
                "median_range_k": None if rng is None else [math.floor(rng[0] * 1000) / 1000, math.ceil(rng[1] * 1000) / 1000],
                "lognormal_fit_p": None if (fit is None or fit["p"] is None) else float(f"{fit['p']:.3g}"),
            }
```

- [ ] **Step 5: Edit build_nomis.py**

In `registers/uk/build_nomis.py`, replace:

```python
            "a shared SIC code gives the whole group's figure (trades_sic.json, match 'shared' or 'approx')",
            "the median is interpolated inside a turnover band on a log scale; it is not printed where an area holds under 40 enterprises",
```

with:

```python
            "where several trades share one SIC code, or a trade's code is only near it, the figure is the whole code's",
            "the median is interpolated inside a turnover band on a log scale; neither it nor the quarter and tenth points are printed where an area holds under 40 enterprises (the register's own total)",
            "the quarter and tenth points of sales are read the same way; one below 50k or above 50m rests on an assumed floor or ceiling, so it prints only as 'under 50k' or 'over 50m'",
            "the range around the median is the lowest and highest median the true counts could give, each count being off by up to 2.5 because counts are rounded to the nearest 5 (the register is a census: rounding, not sampling, is its error); it does not cover where inside its band the median sits",
            "a smooth curve fitted to the bands is kept only as a check and never printed: real takings are far from such a curve in most places, London restaurants most of all",
```

- [ ] **Step 6: Edit build_nomis.py**

In `registers/uk/build_nomis.py`, delete (with the blank lines that follow it):

```python
def median_k(h: dict[str, int]) -> float | None:
    n = sum(h.get(b, 0) for b in TURNOVER_BANDS)
    if n == 0:
        return None
    cum = 0
    for b, (lo, hi) in TURNOVER_BANDS.items():
        c = h.get(b, 0)
        if cum + c >= n / 2:
            frac = (n / 2 - cum) / c if c > 0 else 0
            lo_ = max(lo, 5)
            hi_ = hi + 1
            return math.exp(math.log(lo_) + frac * (math.log(hi_) - math.log(lo_)))
        cum += c
    return None
```

- [ ] **Step 7: Rebuild the table**

```bash
python registers/uk/build_nomis.py
```

Expected (about 30 seconds): the last line `built 137 trades x 35 geographies from E:\atlas\cache\uk\nomis\2026-10-02`.

- [ ] **Step 8: Prove every published median is unchanged**

```bash
python -c "
import json, subprocess
old = json.loads(subprocess.run(['git', 'show', 'HEAD:registers/uk/tables/london_trades_by_borough.json'], capture_output=True, check=True).stdout)
new = json.load(open('registers/uk/tables/london_trades_by_borough.json', encoding='utf-8'))
rows = [(s, g) for s, t in new['trades'].items() for g in t['by_geography']]
same = sum(old['trades'][s]['by_geography'][g]['median_turnover_k'] == new['trades'][s]['by_geography'][g]['median_turnover_k'] for s, g in rows)
print(f'{same} of {len(rows)} medians unchanged')
"
```

Expected: `4795 of 4795 medians unchanged`, and `git diff --stat registers/uk/tables/london_trades_by_borough.csv` prints
nothing (the CSV's columns are unchanged).

- [ ] **Step 9: The turnover invariant turns green**

```bash
python -m pytest registers/uk/tests/test_tables.py -q -k turnover
```

Expected: `2 passed, 3 deselected`.

- [ ] **Step 10: Commit**

```bash
git add registers/uk/build_nomis.py registers/uk/tables/london_trades_by_borough.json
git commit -m "registers/uk: build_nomis carries q10 to q90, the open-band flags, the median's rounding range and the model check; every median unchanged" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 6: Survival on current closure rates in `build_demography.py`

Each borough and each trade group gets `survival_period`: years 1 to 5 from `synthetic_cohort`, each row naming the cohort
its hazard came from, stored to twelve decimals so a page rounds it once. The old `survival` field (each horizon from its
own latest cohort) stays for comparison, and the `horizons` note says which is which and why the period curve prints by
default. Published counts can rise from one year to the next (each is rounded on its own; five small groups do in the 2024
workbook, none of the groups our trades use): the estimator refuses such a group, its curve is left empty so nothing prints
it, and the run says which group and why, once per group, instead of stopping the whole build. Every share is stored
rounded half up (`share`): Python's `round` gave 0.487 for group 869's 1,365 of 2,800, which the feed then printed 48.7 for
48.8. The City of London is flagged in the table itself as never ranked, with the reason (its register counts head offices
and formation addresses: on the 2024 rates it would top London's five-year survival while its 2019 cohort sat in the bottom
three), so the feed, the export and every page read one rule.

**Files:**
- Modify: `registers/uk/build_demography.py`
- Test: `registers/uk/tests/test_demography.py` (create)
- Rebuilt: `registers/uk/tables/survival_london_and_trades.json`

- [ ] **Step 1: Write the test**

Create `registers/uk/tests/test_demography.py`:

```python
"""The survival builder's own rule on small inputs: a share is stored rounded half up, so a page rounds it once (python -m
pytest registers/uk/tests -q)."""
import build_demography


def test_a_survival_share_is_rounded_half_up_once():
    assert build_demography.share(1365, 2800) == 0.488  # group 869's five years; Python's round gives 0.487
    assert build_demography.share(3150, 5600) == 0.563  # Camden's three years; Python's round gives 0.562
    pts, births = build_demography.curve({"2019": {"869": {"name": "Other human health activities", "births": 2800, 5: 1365}}}, "869")
    assert pts == {"5y": 0.488} and births["2019"] == 2800


def test_only_the_city_of_london_is_never_ranked():
    assert set(build_demography.NOT_RANKED) == {"E09000001"} and build_demography.NOT_RANKED["E09000001"]
```

- [ ] **Step 2: Run it and watch it fail**

```bash
python -m pytest registers/uk/tests/test_demography.py -q
```

Expected: `2 failed`, each with `AttributeError: module 'build_demography' has no attribute` (`share`, then `NOT_RANKED`).

- [ ] **Step 3: Edit build_demography.py**

In `registers/uk/build_demography.py`, replace:

```python
import openpyxl
```

with:

```python
import openpyxl

from estimators.rounding import half_up
from estimators.survival import synthetic_cohort
```

- [ ] **Step 4: Edit build_demography.py**

In `registers/uk/build_demography.py`, replace:

```python
            pts[f"{h}y"] = round(row[h] / row["births"], 3)
```

with:

```python
            pts[f"{h}y"] = share(row[h], row["births"])
```

- [ ] **Step 5: Edit build_demography.py**

In `registers/uk/build_demography.py`, replace:

```python
def main() -> int:
```

with:

```python
# The City of London never ranks among boroughs on business demography (survival, births, closures): its register is
# dominated by head offices and formation addresses, so its figures describe paperwork, not the shops on its streets.
# Measured 2026-10-02: on the 2024 closure rates it would top London's five-year survival (47.8 of 100) while its 2019
# cohort sat in the bottom three (32.5). Its rows stay, with the reason, for a page that prints the City on its own.
NOT_RANKED = {"E09000001": "its register counts head offices and formation addresses, not the shops on its streets"}


def share(part: float, whole: float) -> float:
    """A share stored to three decimals, rounded half up the website's way, so a page printing it as a percentage to one
    decimal rounds it once (Python's round gives 0.487 for group 869's 1,365 of 2,800, which then printed 48.7 for 48.8)."""
    return half_up(part / whole, 3)


def period_curve(per_cohort: dict, key: str) -> list[dict]:
    """Survival on the latest year's closure rates (a synthetic cohort, estimators/survival.py): each year's chance of
    closing from the newest cohort that has both ends of that year, chained. Cannot rise; S(1) equals the latest one-year
    figure. Each row names the cohort it used; shares are stored to twelve decimals, so a page rounds them once. Published
    counts can rise from one year to the next (each is rounded on its own; five small groups do in the 2024 workbook, none
    of the groups our trades use): the estimator refuses such a group, its curve is left empty so nothing prints it, and
    the run says which group and why."""
    births, survivors = {}, {}
    for c in per_cohort:
        row = per_cohort[c].get(key)
        if row and row.get("births"):
            births[int(c)] = row["births"]
            survivors[int(c)] = {t: row[t] for t in range(1, 6) if t in row}
    try:
        return synthetic_cohort(births, survivors, digits=12)
    except ValueError as e:
        print(f"survival_period withheld for {key}: {e}")
        return []


def five(row: dict) -> tuple:
    """The five-year figure on the latest closure rates beside the 2019 cohort's own, for the run's printout."""
    per = row.get("survival_period") or []
    return (round(per[4]["survival"], 3) if len(per) == 5 else None, (row.get("survival") or {}).get("5y"))


def main() -> int:
```

- [ ] **Step 6: Edit build_demography.py**

In `registers/uk/build_demography.py`, replace:

```python
        by_borough[k] = {
            "name": names[k],
            "survival": pts,
```

with:

```python
        by_borough[k] = {
            "name": names[k],
            "ranked": k not in NOT_RANKED,
            "not_ranked_because": NOT_RANKED.get(k),
            "survival": pts,
            "survival_period": period_curve(la, k),
```

- [ ] **Step 7: Edit build_demography.py**

In `registers/uk/build_demography.py`, replace:

```python
            "birth_rate_2024": round(births24[k] / active24[k], 3) if births24.get(k) and active24.get(k) else None,
            "death_rate_2024": round(deaths24[k] / active24[k], 3) if deaths24.get(k) and active24.get(k) else None,
```

with:

```python
            "birth_rate_2024": share(births24[k], active24[k]) if births24.get(k) and active24.get(k) else None,
            "death_rate_2024": share(deaths24[k], active24[k]) if deaths24.get(k) and active24.get(k) else None,
```

- [ ] **Step 8: Edit build_demography.py**

In `registers/uk/build_demography.py`, replace:

```python
    by_trade = {}
```

with:

```python
    by_trade, periods = {}, {}
```

- [ ] **Step 9: Edit build_demography.py**

In `registers/uk/build_demography.py`, replace:

```python
            res.append({"group": key, "group_name": gnames[key], "survival": pts, "births_by_cohort": births})
```

with:

```python
            if key not in periods:
                periods[key] = period_curve(sic, key)  # once per group: a group several trades share is read once
            res.append({"group": key, "group_name": gnames[key], "survival": pts, "survival_period": periods[key], "births_by_cohort": births})
```

- [ ] **Step 10: Edit build_demography.py**

In `registers/uk/build_demography.py`, replace:

```python
        "horizons": "each horizon from the latest cohort that reaches it: 5y born 2019, 4y born 2020, 3y born 2021, 2y born 2022, 1y born 2023",
```

with:

```python
        "horizons": "survival: each horizon from the latest cohort that reaches it (5y born 2019 to 1y born 2023), which mixes cohorts; survival_period: the chance of still trading after 1 to 5 years on the closure rates of the latest year, chained from each year's newest cohort (prints by default: it cannot rise and it uses the newest evidence for every year)",
```

- [ ] **Step 11: Edit build_demography.py**

In `registers/uk/build_demography.py`, replace:

```python
    lon = by_borough.get("E12000007") or {}
    print("London:", lon.get("survival"), "| England:", by_borough.get("E92000001", {}).get("survival"))
    for slug in ["restaurants", "cafes-coffee-shops", "barbershops", "accounting-tax", "dry-cleaning-laundry"]:
        print(slug, [(g["group"], g["group_name"], g["survival"]) for g in by_trade[slug]["groups"]])
```

with:

```python
    print("five years on the 2024 closure rates, then the 2019 cohort's own: London", five(by_borough.get("E12000007") or {}),
          "| England", five(by_borough.get("E92000001") or {}))
    for slug in ["restaurants", "cafes-coffee-shops", "barbershops", "accounting-tax", "dry-cleaning-laundry"]:
        print(slug, [(g["group"], g["group_name"], five(g)) for g in by_trade[slug]["groups"]])
    withheld = sorted(k for k, v in periods.items() if not v) + sorted(k for k, v in by_borough.items() if not v["survival_period"])
    print(f"period curves: {len(periods)} groups and {len(by_borough)} areas; withheld: {withheld or 'none'}")
```

- [ ] **Step 12: Rebuild the table**

```bash
python registers/uk/build_demography.py
```

Expected: exit code 0; among the lines it prints, `restaurants [('561', 'Restaurants and mobile food service activities',
(0.293, 0.391))]` (five years on the 2024 closure rates, then the 2019 cohort's own), and last `period curves: 76 groups
and 38 areas; withheld: none`.

- [ ] **Step 13: The builder's rule and the survival invariant turn green**

```bash
python -m pytest registers/uk/tests/test_demography.py registers/uk/tests/test_tables.py::test_period_survival_never_rises_and_sits_inside_its_interval -q
```

Expected: `3 passed`.

- [ ] **Step 14: Commit**

```bash
git add registers/uk/build_demography.py registers/uk/tests/test_demography.py registers/uk/tables/survival_london_and_trades.json
git commit -m "registers/uk: build_demography adds survival on the 2024 closure rates (a synthetic cohort) per borough and trade group, shares rounded half up, the City of London never ranked" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 7: Failure rates with their intervals

`company_failures_by_trade.json` is built by `build_gazette.py`, whose name matching takes minutes and is not re-run here; a
new script adds `uk_rate` to it: the rate per 1,000 live companies, its Wilson interval, the relative standard error and the
two flags. It is idempotent, so the monthly refresh can run it after every Gazette rebuild. Its caveat is in plain words: the
ledger prints it on About the figures, and the drafts in their articles.

**Files:**
- Create: `registers/uk/enrich_failure_rates.py`
- Rebuilt: `registers/uk/tables/company_failures_by_trade.json`

- [ ] **Step 1: Write the script**

Create `registers/uk/enrich_failure_rates.py`:

```python
"""
enrich_failure_rates.py: add each trade's interval, relative standard error and publication flags to the failures table.

Reads tables/company_failures_by_trade.json (built by build_gazette.py, whose name matching takes minutes and is not re-run
here) and adds, per trade, `uk_rate`: the insolvencies a year per 1,000 live companies with its Wilson 95% interval, the
relative standard error of the count (1 / sqrt(x)) and two flags: publishable (x >= 10) and few_cases (10 <= x < 30). The
rules and their reasons are in estimators/rates.py. Idempotent: running it twice gives the same file.
"""
from __future__ import annotations

import json
from pathlib import Path

from estimators.rates import rate_per_1000

HERE = Path(__file__).resolve().parent
TABLE = HERE / "tables" / "company_failures_by_trade.json"


def main() -> int:
    d = json.loads(TABLE.read_text(encoding="utf-8"))
    n_pub = n_all = 0
    for v in d["trades"].values():
        x, n = v.get("uk_insolvent"), v.get("uk_live_companies")
        if not n or x is None:
            v["uk_rate"] = None
            continue
        v["uk_rate"] = rate_per_1000(x, n)
        n_all += 1
        n_pub += v["uk_rate"]["publishable"]
    rule = "each rate per 1,000 live companies carries a 95% interval; it prints only where the year holds 10 or more insolvencies, and from 10 to 29 it is marked 'few cases'"
    if rule not in d["caveats"]:
        d["caveats"].append(rule)
    TABLE.write_text(json.dumps(d, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"rates: {n_all} trades, {n_pub} publishable")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

- [ ] **Step 2: Run it twice**

```bash
python registers/uk/enrich_failure_rates.py
```

Expected: `rates: 137 trades, 117 publishable`. Run the same command again: the same line, and
`git diff --stat registers/uk/tables/company_failures_by_trade.json` shows the same change as after the first run
(idempotent).

- [ ] **Step 3: The failures invariant turns green**

```bash
python -m pytest registers/uk/tests/test_tables.py -q -k failure
```

Expected: `1 passed, 4 deselected`.

- [ ] **Step 4: Commit**

```bash
git add registers/uk/enrich_failure_rates.py registers/uk/tables/company_failures_by_trade.json
git commit -m "registers/uk: failure rates carry a Wilson interval, the relative standard error and the 10-case publication rule" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 8: The home feed on the new statistics in `build_editorial.py`

Six feed items change. "Which trades fail most" ranks only publishable rates (10 insolvencies or more), carries each rate's
interval and "few cases" flag, and records the duel (the top against the bottom, every pair tested, the largest
Holm-adjusted p). "Which trades last longest", "Where firms last" and the restaurant answer use survival on the 2024 closure
rates, with the 2019 cohort's figure beside it, and the restaurant answer says in plain words what its five-year figure is
and which way the 2019 cohort differs (read from the figures, never assumed). The City of London leaves every ranking built
on business demography by the table's own flag (task 6), and the two borough items name it with the reason. Survival
percentages round once, the website's way (`half_up` on the twelve-decimal shares). "Typical takings" ranks no median that
prints in words (under 50k or over 50m): couriers' 44.6k rested on the 5k floor. The fail-most floor and the survival
period read in plain words, with no source named.

**Files:**
- Modify: `registers/uk/build_editorial.py`
- Rebuilt: `registers/uk/tables/editorial_feed.json`

- [ ] **Step 1: Edit build_editorial.py**

In `registers/uk/build_editorial.py`, replace:

```python
from pathlib import Path
```

with:

```python
from pathlib import Path

from estimators.rates import holm, two_proportions
from estimators.rounding import half_up
```

- [ ] **Step 2: Edit build_editorial.py**

In `registers/uk/build_editorial.py`, replace:

```python
        if r["uk_live_companies"] < 2000:
            left += 1
            continue
        rows.append({"member": g["label"], "sic": list(key), "trades": g["trades"], "shared": g["shared"], "value": r["uk_insolvent_per_1000"], "units": r["uk_live_companies"], "insolvent": r["uk_insolvent"]})
    rows.sort(key=lambda x: -x["value"])
    items.append(item(id="fail-most", title="Which trades fail most", unit="insolvencies a year per 1,000 companies",
                      line="Insolvencies in a year per 1,000 live companies, UK.", dimension="trade", held="place: United Kingdom",
                      floor="2,000 live companies", left_out=left, period="notices October 2025 to September 2026; register of May 2026", source="company_failures_by_trade.json",
                      refresh="monthly (the Gazette)", top=distinct(rows, 6), bottom=list(reversed(distinct(list(reversed(rows)), 4))), members=len(rows)))
```

with:

```python
        rate = r.get("uk_rate")
        if not rate or not rate["publishable"]:
            left += 1  # under 10 insolvencies: the rate rests on too few cases to print (estimators/rates.py)
            continue
        rows.append({"member": g["label"], "sic": list(key), "trades": g["trades"], "shared": g["shared"], "value": rate["value"], "lo": rate["lo"], "hi": rate["hi"],
                     "few_cases": rate["few_cases"], "units": r["uk_live_companies"], "insolvent": r["uk_insolvent"]})
    rows.sort(key=lambda x: -x["value"])
    top, bottom = distinct(rows, 6), list(reversed(distinct(list(reversed(rows)), 4)))
    tests = [two_proportions(a["insolvent"], a["units"], b["insolvent"], b["units"])[1] for a in top for b in bottom]
    duel = {"top": top[0]["member"], "bottom": bottom[-1]["member"], "pairs_tested": len(tests), "max_holm_p": max(holm(tests)) if tests else None}
    items.append(item(id="fail-most", title="Which trades fail most", unit="insolvencies a year per 1,000 companies",
                      line="Insolvencies in a year per 1,000 live companies, UK.", dimension="trade", held="place: United Kingdom",
                      floor="10 insolvencies in the year", left_out=left, period="notices October 2025 to September 2026; register of May 2026", source="company_failures_by_trade.json",
                      refresh="monthly (the Gazette)", top=top, bottom=bottom, duel=duel, members=len(rows)))
```

- [ ] **Step 3: Edit build_editorial.py**

In `registers/uk/build_editorial.py`, replace:

```python
            if gr["group"] in seen or gr["survival"].get("5y") is None:
                continue
            seen.add(gr["group"])
            births = gr["births_by_cohort"].get("2019")
            if not births or births < 1000:
                continue
            rows.append({"member": gr["group_name"], "group": gr["group"], "trades": sorted(x["slug"] for x in trades if any(gg["group"] == gr["group"] for gg in (s["by_trade"].get(x["slug"]) or {}).get("groups", []))), "value": round(gr["survival"]["5y"] * 100, 1), "one_year": round(gr["survival"]["1y"] * 100, 1), "units": births})
    rows.sort(key=lambda x: -x["value"])
    items.append(item(id="last-longest", title="Which trades last longest", unit="of 100 new firms still trading after five years",
                      line="Firms born in 2019 still trading in 2024, UK.", dimension="trade group", held="place: United Kingdom",
                      floor="1,000 births in the 2019 cohort", left_out=None, period="cohort 2019, ONS business demography 2024",
```

with:

```python
            per = gr.get("survival_period") or []
            if gr["group"] in seen or len(per) < 5:
                continue
            seen.add(gr["group"])
            births = gr["births_by_cohort"].get("2019")
            if not births or births < 1000:
                continue
            rows.append({"member": gr["group_name"], "group": gr["group"], "trades": sorted(x["slug"] for x in trades if any(gg["group"] == gr["group"] for gg in (s["by_trade"].get(x["slug"]) or {}).get("groups", []))),
                         "value": half_up(per[4]["survival"] * 100, 1), "lo": half_up(per[4]["lo"] * 100, 1), "hi": half_up(per[4]["hi"] * 100, 1),
                         "one_year": half_up(per[0]["survival"] * 100, 1),
                         "cohort_2019_five_years": half_up(gr["survival"]["5y"] * 100, 1) if gr["survival"].get("5y") is not None else None, "units": births})
    rows.sort(key=lambda x: -x["value"])
    items.append(item(id="last-longest", title="Which trades last longest", unit="of 100 new firms still trading after five years",
                      line="On the closure rates of 2024, still trading after five years.", dimension="trade group", held="place: United Kingdom",
                      floor="1,000 births in the 2019 cohort", left_out=None, period="closure rates of 2024 (cohorts born 2019 to 2023)",
```

- [ ] **Step 4: Edit build_editorial.py**

In `registers/uk/build_editorial.py`, replace:

```python
                          floor=None, left_out=None, period="cohorts 2019 (five years) and 2023 (one year)", source="survival_london_and_trades.json",
                          refresh="yearly", answer={"after_one_year": rest["one_year"], "after_five_years": rest["value"]}))
```

with:

```python
                          floor=None, left_out=None, period="closure rates of 2024; the 2019 cohort for comparison", source="survival_london_and_trades.json",
                          refresh="yearly", answer={"after_one_year": rest["one_year"], "after_five_years": rest["value"], "after_five_years_2019_cohort": rest["cohort_2019_five_years"]},
                          definition=survival_definition(rest["value"], rest["cohort_2019_five_years"])))
```

- [ ] **Step 5: Edit build_editorial.py**

In `registers/uk/build_editorial.py`, replace:

```python
    rows = [{"member": b["name"], "code": code, "value": round(b["survival"]["5y"] * 100, 1), "units": b["births_by_cohort"].get("2019")}
            for code, b in s["by_borough"].items() if code.startswith("E09") and b["survival"].get("5y") is not None and (b["births_by_cohort"].get("2019") or 0) >= 500]
```

with:

```python
    boroughs = {code: b for code, b in s["by_borough"].items() if code.startswith("E09")}
    not_ranked = [{"member": b["name"], "code": code, "why": b["not_ranked_because"]} for code, b in boroughs.items() if not b["ranked"]]
    rows = [{"member": b["name"], "code": code, "value": half_up(b["survival_period"][4]["survival"] * 100, 1), "lo": half_up(b["survival_period"][4]["lo"] * 100, 1),
             "hi": half_up(b["survival_period"][4]["hi"] * 100, 1), "units": b["births_by_cohort"].get("2019")}
            for code, b in boroughs.items() if b["ranked"] and len(b.get("survival_period") or []) == 5 and (b["births_by_cohort"].get("2019") or 0) >= 500]
```

- [ ] **Step 6: Edit build_editorial.py**

In `registers/uk/build_editorial.py`, replace:

```python
                      line="Firms born in 2019 still trading in 2024, by borough.", dimension="borough", held="trade: all trades",
                      floor="500 births in the 2019 cohort", left_out=None, period="cohort 2019", source="survival_london_and_trades.json",
```

with:

```python
                      line="On the closure rates of 2024, still trading after five years.", dimension="borough", held="trade: all trades",
                      floor="500 births in the 2019 cohort", left_out=len(boroughs) - len(not_ranked) - len(rows), not_ranked=not_ranked,
                      period="closure rates of 2024", source="survival_london_and_trades.json",
```

- [ ] **Step 7: Edit build_editorial.py**

In `registers/uk/build_editorial.py`, replace:

```python
    rows = [{"member": b["name"], "code": code, "born": round(b["birth_rate_2024"] * 100, 1), "closed": round(b["death_rate_2024"] * 100, 1), "units": b["active_2024"]}
            for code, b in s["by_borough"].items() if code.startswith("E09") and b.get("active_2024")]
```

with:

```python
    rows = [{"member": b["name"], "code": code, "born": half_up(b["birth_rate_2024"] * 100, 1), "closed": half_up(b["death_rate_2024"] * 100, 1), "units": b["active_2024"]}
            for code, b in boroughs.items() if b["ranked"] and b.get("active_2024")]
```

- [ ] **Step 8: Edit build_editorial.py**

In `registers/uk/build_editorial.py`, replace:

```python
                      floor=None, left_out=None, period="2024", source="survival_london_and_trades.json", refresh="yearly",
```

with:

```python
                      floor=None, left_out=None, not_ranked=not_ranked, period="2024", source="survival_london_and_trades.json", refresh="yearly",
```

- [ ] **Step 9: Edit build_editorial.py**

In `registers/uk/build_editorial.py`, replace:

```python
def main() -> int:
```

with:

```python
def survival_definition(period: float, cohort: float | None) -> str:
    """What the restaurant item's five-year figure is, in plain words; which way the 2019 cohort differs is read from the
    figures, never assumed."""
    s = "after five years: the chance of closing in 2024 at each age from one to five, applied in turn"
    if cohort is None or cohort == period:
        return s
    return s + f"; the businesses born in 2019 lived through years that closed {'fewer' if cohort > period else 'more'} of them"


def main() -> int:
```

- [ ] **Step 10: Edit build_editorial.py**

In `registers/uk/build_editorial.py`, replace:

```python
        if (lon.get("enterprises") or 0) < 500:
            left += 1
            continue
        rows.append({"member": g["label"], "sic": list(key), "trades": g["trades"], "shared": g["shared"], "value_gbp_k": lon["median_turnover_k"], "units": lon["enterprises"]})
```

with:

```python
        if (lon.get("enterprises") or 0) < 500:
            left += 1
            continue
        if "q50" in (lon.get("quantiles_in_open_band") or []):  # a median under 50k or over 50m prints only in words
            left += 1
            continue
        rows.append({"member": g["label"], "sic": list(key), "trades": g["trades"], "shared": g["shared"], "value_gbp_k": lon["median_turnover_k"], "units": lon["enterprises"]})
```

- [ ] **Step 11: Edit build_editorial.py**

In `registers/uk/build_editorial.py`, replace:

```python
floor="500 enterprises", left_out=left, period=nb.get("snapshot"), source="london_trades_by_borough.json",
```

with:

```python
floor="500 enterprises, and a median from 50k to 50m", left_out=left, period=nb.get("snapshot"), source="london_trades_by_borough.json",
```

- [ ] **Step 12: Rebuild the feed**

```bash
python registers/uk/build_editorial.py
```

Expected: exit code 0 and one line per feed item.

- [ ] **Step 13: The feed invariant turns green, and the full suite passes**

```bash
python -m pytest registers/uk/tests -q
```

Expected: `65 passed`.

- [ ] **Step 14: Read the four changed items**

```bash
python -c "
import json
items = {i['id']: i for i in json.load(open('registers/uk/tables/editorial_feed.json', encoding='utf-8'))['items']}
f = items['fail-most']; print(f['floor'], '|', f['members'], 'members,', f['left_out'], 'left out |', f['duel'])
print([(r['member'], r['value'], r['lo'], r['hi']) for r in f['top'][:2]], [(r['member'], r['value'], r['few_cases']) for r in f['bottom'][-1:]])
print(items['restaurants-year-one']['answer'])
w = items['last-where']; print(w['members'], w['left_out'], [x['member'] for x in w['not_ranked']], [(r['member'], r['value']) for r in w['top'][:1] + w['bottom'][-1:]])
"
```

Expected, on the tables of 2026-10-02 (a later Gazette month moves the rates, not the shape):

```
10 insolvencies in the year | 76 members, 31 left out | {'top': 'Restaurants', 'bottom': 'Dental practices', 'pairs_tested': 24, 'max_holm_p': 6.40721251356562e-25}
[('Restaurants', 28.9, 27.3, 30.5), ('Public houses and bars', 26.0, 24.3, 27.8)] [('Dental practices', 1.3, True)]
{'after_one_year': 94.0, 'after_five_years': 29.3, 'after_five_years_2019_cohort': 39.1}
32 0 ['City of London'] [('Richmond upon Thames', 44.9), ('Newham', 29.9)]
```

- [ ] **Step 15: Commit**

```bash
git add registers/uk/build_editorial.py registers/uk/tables/editorial_feed.json
git commit -m "registers/uk: the feed ranks publishable rates with intervals and a Holm-tested duel, survival on 2024 closure rates, the City of London out of demography rankings, no open-band median among the takings" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 9: The blog drafts say what each figure is

`draft_stories.py` turns each feed item into a draft. A survival figure on the 2024 closure rates is no cohort's history,
so the words "on the closure rates of 2024" go wherever one prints (the lead and the column), and the column of units says
it counts the 2019 cohort's births; the restaurant sentence gives the 2019 cohort's figure beside the period one, with
takeaways named (group 561 holds them), and the feed's definition under it. A rate resting on 10 to 29 insolvencies prints
"(few cases)", every figure rounds half up the website's way (Python's format rounds 52.5 to 52), a member left unranked is
named with its reason, and the script can write into a folder given as its argument, so its test never touches the
drafts folder. The test also proves that no field or file name reaches the text a reader would see.

**Files:**
- Modify: `registers/uk/draft_stories.py`
- Test: `registers/uk/tests/test_drafts.py` (create)
- Regenerated: `design/loop/build/goal-2026-10-02/drafts/blog/*.md`

- [ ] **Step 1: Write the test**

Create `registers/uk/tests/test_drafts.py`:

```python
"""The blog drafts print each figure as the feed holds it: rounded half up, with its basis and its few-cases mark, and no
field or file name where a reader would see it. Reads registers/uk/tables and writes the drafts into pytest's scratch
folder (python -m pytest registers/uk/tests -q)."""
import json
import re

import build_demography
import draft_stories
from estimators.rounding import half_up

CITY_OF_LONDON = "E09000001"


def test_a_draft_figure_is_rounded_half_up():
    assert draft_stories.fmt(52.5, "of 100 live companies under two years old") == "53"
    assert draft_stories.fmt(0.125, "of 100", 2) == "0.13"
    assert draft_stories.fmt(787.25, "thousand pounds a year, the middle business") == "£787.3k"


def test_the_drafts_say_what_each_figure_is(tmp_path):
    assert draft_stories.main(tmp_path) == 0
    items = {i["id"]: i for i in json.loads((draft_stories.T / "editorial_feed.json").read_text(encoding="utf-8"))["items"]}
    drafts = {p.stem: p.read_text(encoding="utf-8") for p in tmp_path.glob("*.md")}
    assert set(drafts) == set(items)
    lines = {}
    for key, text in drafts.items():
        reader = text.split("\n---\n", 1)[1].split("## Before publishing")[0]  # what a reader of the article would see
        assert not re.search(r"\w_\w|\.py\b", reader), key  # no field or file name
        lines[key] = reader.strip().splitlines()
    for key in ("last-longest", "last-where"):  # survival on 2024's closure rates is no cohort's history
        lead, header = lines[key][2], lines[key][4]
        assert "still trading after five years, on the closure rates of 2024." in lead, lead
        assert ", on the closure rates of 2024 | Born in 2019 |" in header, header
    fail = items["fail-most"]
    assert any(r["few_cases"] for r in fail["top"] + fail["bottom"])
    for r in fail["top"] + fail["bottom"]:
        row = next(x for x in lines["fail-most"] if x.startswith(f"| {r['member']} | "))
        assert ("(few cases)" in row) == r["few_cases"], row
    assert ("(few cases)" in lines["fail-most"][2]) == (fail["top"][0]["few_cases"] or fail["bottom"][-1]["few_cases"])
    a = items["restaurants-year-one"]["answer"]
    one, five, cohort = (f"{half_up(a[k], 0):.0f}" for k in ("after_one_year", "after_five_years", "after_five_years_2019_cohort"))
    assert lines["restaurants-year-one"][2] == (f"On the closure rates of 2024, of 100 new restaurants, cafes, takeaways and food stalls in the UK, {one} would "
                                                f"still be trading after one year and {five} after five. Of every 100 that opened in 2019, {cohort} were still trading five years on.")
    for key in ("last-where", "open-close"):
        assert f"City of London is not ranked: {build_demography.NOT_RANKED[CITY_OF_LONDON]}." in lines[key], key
```

- [ ] **Step 2: Run it and watch it fail**

```bash
python -m pytest registers/uk/tests/test_drafts.py -q
```

Expected: `2 failed`: `AssertionError: assert '52' == '53'` and `TypeError: main() takes 0 positional arguments but 1 was
given`.

- [ ] **Step 3: Edit draft_stories.py**

In `registers/uk/draft_stories.py`, replace:

```python
Reads tables/editorial_feed.json (built by build_editorial.py) and the caveats of each item's source table; writes
design/loop/build/goal-2026-10-02/drafts/blog/<id>.md. A draft is never published by this script: articles wait until after
```

with:

```python
Reads tables/editorial_feed.json (built by build_editorial.py) and the caveats of each item's source table; writes
design/loop/build/goal-2026-10-02/drafts/blog/<id>.md, or into the folder given as the first argument (the tests write into
a scratch folder). A draft is never published by this script: articles wait until after
```

- [ ] **Step 4: Edit draft_stories.py**

In `registers/uk/draft_stories.py`, replace:

```python
import json
from pathlib import Path
```

with:

```python
import json
import re
import sys
from pathlib import Path

from estimators.rounding import half_up
```

- [ ] **Step 5: Edit draft_stories.py**

In `registers/uk/draft_stories.py`, replace:

```python
def fmt(v, unit: str, decimals: int = 0) -> str:
    """One decimal count per column (MODEL PART 5): the caller passes the item's count."""
    if v is None:
        return "n/a"
    if "pounds" in unit and "thousand" in unit:
        return f"£{v:,.1f}k"
    if "pounds" in unit:
        return f"£{v:,.0f}"
    return f"{v:,.{decimals}f}"
```

with:

```python
def fmt(v, unit: str, decimals: int = 0) -> str:
    """One decimal count per column (MODEL PART 5): the caller passes the item's count. Rounded half up, the website's way
    (Python's format rounds 0.125 to 0.12 and 52.5 to 52)."""
    if v is None:
        return "n/a"
    if "pounds" in unit and "thousand" in unit:
        return f"£{half_up(v, 1):,.1f}k"
    if "pounds" in unit:
        return f"£{half_up(v, 0):,.0f}"
    return f"{half_up(v, decimals):,.{decimals}f}"


def basis(item: dict) -> str:
    """Survival on a year's closure rates is no cohort's history: the words go wherever its figure prints."""
    m = re.match(r"closure rates of \d{4}", item.get("period") or "")
    return f", on the {m.group(0)}" if m else ""


def mark(r: dict) -> str:
    """A rate resting on 10 to 29 cases prints with its mark (estimators/rates.py)."""
    return " (few cases)" if r.get("few_cases") else ""
```

- [ ] **Step 6: Edit draft_stories.py**

In `registers/uk/draft_stories.py`, replace:

```python
    words = unit_words(unit)
    out.append(f"| {head} | {words[0].upper() + words[1:]} | Based on |")
    out.append("|---|---|---|")
    for part in ("top", "bottom"):
        for r in item.get(part, []):
            base = r.get("units")
            d = decimals_of(item)
            out.append(f"| {r['member']} | {fmt(value(r), unit, d)} | {base:,} |" if base else f"| {r['member']} | {fmt(value(r), unit, d)} | |")
```

with:

```python
    words = unit_words(unit)
    born = re.search(r"births in the (\d{4}) cohort", item.get("floor") or "")  # a survival item counts that cohort's births
    based = f"Born in {born.group(1)}" if born else "Based on"
    out.append(f"| {head} | {words[0].upper() + words[1:]}{basis(item)} | {based} |")
    out.append("|---|---|---|")
    for part in ("top", "bottom"):
        for r in item.get(part, []):
            base = r.get("units")
            d = decimals_of(item)
            figure = fmt(value(r), unit, d) + mark(r)
            out.append(f"| {r['member']} | {figure} | {base:,} |" if base else f"| {r['member']} | {figure} | |")
```

- [ ] **Step 7: Edit draft_stories.py**

In `registers/uk/draft_stories.py`, replace:

```python
        return (f"Of 100 new restaurants, cafes and food stalls in the UK, {a['after_one_year']:.0f} were still trading after one year "
                f"and {a['after_five_years']:.0f} after five.")
```

with:

```python
        one, five, cohort = (f"{half_up(a[k], 0):.0f}" for k in ("after_one_year", "after_five_years", "after_five_years_2019_cohort"))
        return (f"On the closure rates of 2024, of 100 new restaurants, cafes, takeaways and food stalls in the UK, {one} would "
                f"still be trading after one year and {five} after five. Of every 100 that opened in 2019, {cohort} were still "
                "trading five years on.")
```

- [ ] **Step 8: Edit draft_stories.py**

In `registers/uk/draft_stories.py`, replace:

```python
    d = decimals_of(item)
    s = f"{top[0]['member']}: {fmt(value(top[0]), unit, d)} {unit_words(unit)}."
    if bottom:
        s += f" {bottom[-1]['member']}: {fmt(value(bottom[-1]), unit, d)}."
```

with:

```python
    d = decimals_of(item)
    s = f"{top[0]['member']}: {fmt(value(top[0]), unit, d)}{mark(top[0])} {unit_words(unit)}{basis(item)}."
    if bottom:
        s += f" {bottom[-1]['member']}: {fmt(value(bottom[-1]), unit, d)}{mark(bottom[-1])}."
```

- [ ] **Step 9: Edit draft_stories.py**

In `registers/uk/draft_stories.py`, replace:

```python
def main() -> int:
    feed = json.loads((T / "editorial_feed.json").read_text(encoding="utf-8"))
    OUT.mkdir(parents=True, exist_ok=True)
```

with:

```python
def main(out: Path = OUT) -> int:
    feed = json.loads((T / "editorial_feed.json").read_text(encoding="utf-8"))
    out.mkdir(parents=True, exist_ok=True)
```

- [ ] **Step 10: Edit draft_stories.py**

In `registers/uk/draft_stories.py`, replace:

```python
        body = [f"# {item['title']}", "", first_line(item), ""]
```

with:

```python
        body = [f"# {item['title']}", "", first_line(item), ""]
        if item.get("definition"):
            body += [item["definition"][0].upper() + item["definition"][1:] + ".", ""]
```

- [ ] **Step 11: Edit draft_stories.py**

In `registers/uk/draft_stories.py`, replace:

```python
            body.append(f"Chosen from {item['members']} members" + (f"; {item['left_out']} left out under the floor or on an approximate code." if item.get("left_out") else "."))
            body.append("")
```

with:

```python
            body.append(f"Chosen from {item['members']} members" + (f"; {item['left_out']} left out under the floor or on an approximate code." if item.get("left_out") else "."))
            body.append("")
        for x in item.get("not_ranked") or []:
            body += [f"{x['member']} is not ranked: {x['why']}.", ""]
```

- [ ] **Step 12: Edit draft_stories.py**

In `registers/uk/draft_stories.py`, replace:

```python
        (OUT / f"{item['id']}.md").write_text("\n".join(fm + body), encoding="utf-8")
```

with:

```python
        (out / f"{item['id']}.md").write_text("\n".join(fm + body), encoding="utf-8")
```

- [ ] **Step 13: Edit draft_stories.py**

In `registers/uk/draft_stories.py`, replace:

```python
    raise SystemExit(main())
```

with:

```python
    raise SystemExit(main(Path(sys.argv[1]) if len(sys.argv) > 1 else OUT))
```

- [ ] **Step 14: Run the test and watch it pass**

```bash
python -m pytest registers/uk/tests/test_drafts.py -q
```

Expected: `2 passed`.

- [ ] **Step 15: Regenerate the drafts**

```bash
python registers/uk/draft_stories.py
```

Expected: one `draft: <id>` line per feed item. `git diff --stat design/loop/build/goal-2026-10-02/drafts/blog` lists six
files whose figures or words change: fail-most, last-longest, last-where, open-close, restaurants-year-one and takings. The
other six change only their `generated:` line, which carries the feed's build date (task 8 rebuilt the feed).

- [ ] **Step 16: Read the restaurant sentence**

```bash
grep -n "closure rates of 2024, of 100" design/loop/build/goal-2026-10-02/drafts/blog/restaurants-year-one.md
```

Expected: one line reading `On the closure rates of 2024, of 100 new restaurants, cafes, takeaways and food stalls in the
UK, 94 would still be trading after one year and 29 after five. Of every 100 that opened in 2019, 39 were still trading
five years on.`

- [ ] **Step 17: Commit**

```bash
git add registers/uk/draft_stories.py registers/uk/tests/test_drafts.py design/loop/build/goal-2026-10-02/drafts/blog
git commit -m "registers/uk: the blog drafts say what each figure is (2024 closure rates, few cases, half up, the City not ranked)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 10: The slices the website reads

The website's chain must never read another repository or the network, so the figures it prints from the registers are
copied in, sliced to what the pages use, and fingerprinted: `export_for_site.py` writes four slices and a manifest of each
file's SHA-256 (plan 03, task 1 runs it into the website and adds the gate that recomputes the hashes). A stale or
half-built table is refused, never exported as nulls: its review found that a failures table without its rates exported
137 null rates and the gate passed. The survival slice holds London and its boroughs with the City's flag and the 2019
births the floors read. This task creates the script and proves it into a scratch folder.

**Files:**
- Create: `registers/uk/export_for_site.py`
- Test: `registers/uk/tests/test_export.py` (create)

- [ ] **Step 1: Write the test**

Create `registers/uk/tests/test_export.py`:

```python
"""The export writes the four slices the website reads, each hashed as written, and refuses a stale table rather than
exporting nulls. Reads registers/uk/tables and writes into pytest's scratch folder, never the website (python -m pytest
registers/uk/tests -q)."""
import hashlib
import json
import shutil

import pytest

import export_for_site

TABLES = export_for_site.T
CITY_OF_LONDON = "E09000001"


def test_the_export_writes_four_slices_as_hashed(tmp_path):
    out = tmp_path / "registers"
    assert export_for_site.main(out) == 0
    manifest = json.loads((out / "manifest.json").read_text(encoding="utf-8"))
    assert sorted(manifest["files"]) == ["failures.json", "premises.json", "survival.json", "turnover.json"]
    assert sorted(p.name for p in out.iterdir()) == ["failures.json", "manifest.json", "premises.json", "survival.json", "turnover.json"]
    for name, m in manifest["files"].items():
        raw = (out / name).read_bytes()
        assert b"\r" not in raw and hashlib.sha256(raw).hexdigest() == m["sha256"], name
    sv = json.loads((out / "survival.json").read_text(encoding="utf-8"))
    assert len(sv["areas"]) == 34 and all(c == "E12000007" or c.startswith("E09") for c in sv["areas"])
    assert [c for c, a in sv["areas"].items() if not a["ranked"]] == [CITY_OF_LONDON] and sv["areas"][CITY_OF_LONDON]["not_ranked_because"]
    assert all(len(g["period"]) in (0, 5) and "births_2019" in g for g in list(sv["groups"].values()) + list(sv["areas"].values()))
    fl = json.loads((out / "failures.json").read_text(encoding="utf-8"))
    assert all(v["uk_rate"] is not None for v in fl["trades"].values() if v["uk_live_companies"])


BREAKAGES = {
    "a failure rate never computed": ("company_failures_by_trade.json", lambda d: next(v for v in d["trades"].values() if v["uk_live_companies"]).pop("uk_rate")),
    "a null rate for a trade with live companies": ("company_failures_by_trade.json", lambda d: next(v for v in d["trades"].values() if v["uk_live_companies"]).update(uk_rate=None)),
    "a borough without its period curve": ("survival_london_and_trades.json", lambda d: d["by_borough"]["E09000002"].pop("survival_period")),
    "a group with a short curve": ("survival_london_and_trades.json", lambda d: d["by_trade"]["restaurants"]["groups"][0]["survival_period"].pop()),
    "an area that does not say whether it ranks": ("survival_london_and_trades.json", lambda d: d["by_borough"][CITY_OF_LONDON].pop("ranked")),
    "no London premises row": ("london_premises_value_by_borough.json", lambda d: d["areas"].pop("E12000007")),
    "a turnover row without its range": ("london_trades_by_borough.json", lambda d: next(iter(d["trades"].values()))["by_geography"]["E12000007"].pop("median_range_k")),
}


@pytest.mark.parametrize("breakage", sorted(BREAKAGES))
def test_the_export_refuses_a_stale_table_and_writes_nothing(tmp_path, monkeypatch, breakage):
    tables = tmp_path / "tables"
    tables.mkdir()
    for name in ("london_trades_by_borough.json", "london_premises_value_by_borough.json", "survival_london_and_trades.json", "company_failures_by_trade.json"):
        shutil.copy2(TABLES / name, tables / name)
    name, edit = BREAKAGES[breakage]
    d = json.loads((tables / name).read_text(encoding="utf-8"))
    edit(d)
    (tables / name).write_text(json.dumps(d), encoding="utf-8")
    monkeypatch.setattr(export_for_site, "T", tables)
    with pytest.raises(SystemExit, match="export refused"):
        export_for_site.main(tmp_path / "registers")
    assert not (tmp_path / "registers").exists()
```

- [ ] **Step 2: Run it and watch it fail**

```bash
python -m pytest registers/uk/tests/test_export.py -q
```

Expected: `1 error` while collecting, `ModuleNotFoundError: No module named 'export_for_site'`.

- [ ] **Step 3: Write the script**

Create `registers/uk/export_for_site.py`:

```python
"""
export_for_site.py: the slices of the register tables the website reads, written into the website repo with a manifest.

The website's build never reads the network or another repo (its chain must run on Vercel), so the figures it prints from
the registers are copied in, sliced to what the pages use, and fingerprinted: the website's registers gate
(scripts/verify_uk_registers.ts, added by plan 03) recomputes every file's SHA-256 against manifest.json, so a hand edit to
a figure fails the chain. Every file is written with LF line ends and hashed as written; the website pins
data/uk/registers/*.json to LF in its .gitattributes, or a Windows checkout would rewrite them.

A stale or half-built table is refused, never exported as nulls: each geography's turnover fields, the London and England
premises rows, every survival curve and every failure rate where a trade has live companies must be there. Rebuild the
tables in the README's run order, then export again.

Writes (default target E:/atlas/website/data/uk/registers, or the folder given as the first argument):
  turnover.json   per trade (by slug: trades that share a code carry the same rows) and geography: the ten band counts, q10
                  to q90, the open-band flags, the median's range, enterprises, premises and the thin flag (London, England
                  and the 33 boroughs)
  premises.json   the valuation date, each trade's kind of premises (trade_category), and the London and England rows of
                  the valuation statistics per kind (count, floorspace, value per m2)
  survival.json   per SIC group and per area (London and its 33 boroughs): the period curve (survival on the latest year's
                  closure rates), the 2019 cohort's five-year figure for comparison and its births (the feed's floors read
                  them); each area says whether it ranks (the City of London does not, and says why); trade_groups maps
                  each trade to its groups
  failures.json   per trade: the year's insolvencies, live companies and the rate with its interval and flags
  manifest.json   each file's SHA-256, row count and the source table's own date line (for survival and failures, the
                  table's source line, which names its source: for the Sources page only)
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
T = HERE / "tables"
DEFAULT_TARGET = Path(r"E:\atlas\website\data\uk\registers")
LONDON, ENGLAND = "E12000007", "E92000001"
TURNOVER_FIELDS = ("name", "enterprises", "local_units", "thin", "turnover_bands_k", "turnover_quantiles_k", "quantiles_in_open_band", "median_range_k")


def load(name: str) -> dict:
    return json.loads((T / name).read_text(encoding="utf-8"))


def need(ok: bool, what: str) -> None:
    if not ok:
        raise SystemExit(f"export refused: {what}; rebuild the tables in the README's run order, then export again")


def curve(row: dict, where: str) -> list:
    c = row.get("survival_period")
    need(isinstance(c, list) and len(c) in (0, 5), f"{where} has no whole period curve")  # empty: a group the estimator refused
    return c


def write(target: Path, name: str, obj: dict, rows: int, manifest: dict, dated: str) -> None:
    text = json.dumps(obj, indent=1, ensure_ascii=False, sort_keys=True) + "\n"
    (target / name).write_text(text, encoding="utf-8", newline="\n")
    manifest["files"][name] = {"sha256": hashlib.sha256(text.encode("utf-8")).hexdigest(), "rows": rows, "data": dated}


def main(target: Path = DEFAULT_TARGET) -> int:
    print(f"exporting into {target}")
    nb = load("london_trades_by_borough.json")
    turnover, rows = {}, 0
    for slug, t in nb["trades"].items():
        per = {}
        for geo, r in t["by_geography"].items():
            if not (geo in (LONDON, ENGLAND) or geo.startswith("E09")):
                continue
            need(all(k in r for k in TURNOVER_FIELDS), f"turnover row {slug} {geo} lacks a field")
            per[geo] = {k: r[k] for k in TURNOVER_FIELDS}
            rows += 1
        need(LONDON in per and ENGLAND in per, f"turnover {slug} has no London or England row")
        turnover[slug] = {"sic": t["sic"], "match": t["match"], "by_geography": per}

    pv = load("london_premises_value_by_borough.json")
    need(LONDON in pv["areas"] and ENGLAND in pv["areas"], "the premises table has no London or England row")
    premises = {"valuation_date": pv["valuation_date"], "trade_category": pv["trade_scat"], "rows": {g: pv["areas"][g] for g in (LONDON, ENGLAND)}}

    sv = load("survival_london_and_trades.json")
    groups, areas = {}, {}
    for t in sv["by_trade"].values():
        for g in t["groups"]:
            groups[g["group"]] = {"name": g["group_name"], "period": curve(g, f"group {g['group']}"), "cohort_2019_five_years": g["survival"].get("5y"),
                                  "births_2019": g["births_by_cohort"].get("2019")}
    for code, b in sv["by_borough"].items():
        if code == LONDON or code.startswith("E09"):
            need("ranked" in b, f"area {code} does not say whether it ranks")
            areas[code] = {"name": b["name"], "period": curve(b, f"area {code}"), "cohort_2019_five_years": b["survival"].get("5y"),
                           "births_2019": b["births_by_cohort"].get("2019"), "ranked": b["ranked"], "not_ranked_because": b["not_ranked_because"]}
    need(len(areas) == 34, f"survival holds {len(areas)} of London and its 33 boroughs")
    trade_groups = {slug: [g["group"] for g in t["groups"]] for slug, t in sv["by_trade"].items()}

    fl = load("company_failures_by_trade.json")
    failures = {}
    for slug, v in fl["trades"].items():
        need("uk_rate" in v and (v["uk_rate"] is not None or not v["uk_live_companies"]), f"failures {slug} has live companies and no rate (run enrich_failure_rates.py)")
        failures[slug] = {k: v[k] for k in ("sic", "match", "uk_live_companies", "uk_insolvent", "uk_rate")}

    target.mkdir(parents=True, exist_ok=True)
    manifest: dict = {"what": "Slices of E:/atlas/registers/uk/tables the website reads; do not edit by hand", "built_by": "E:/atlas/registers/uk/export_for_site.py", "files": {}}
    write(target, "turnover.json", {"snapshot": nb["snapshot"], "trades": turnover}, rows, manifest, nb["snapshot"])
    write(target, "premises.json", premises, sum(len(r["categories"]) for r in premises["rows"].values()), manifest, pv["valuation_date"])
    write(target, "survival.json", {"source": sv["source"], "groups": groups, "areas": areas, "trade_groups": trade_groups}, len(groups) + len(areas), manifest, sv["source"])
    write(target, "failures.json", {"source": fl["source"], "trades": failures}, len(failures), manifest, fl["source"])
    (target / "manifest.json").write_text(json.dumps(manifest, indent=1, sort_keys=True) + "\n", encoding="utf-8", newline="\n")
    for name, m in manifest["files"].items():
        print(f"{name}: {m['rows']} rows, {m['sha256'][:12]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_TARGET))
```

- [ ] **Step 4: Run the test and watch it pass**

```bash
python -m pytest registers/uk/tests/test_export.py -q
```

Expected: `8 passed`.

- [ ] **Step 5: Export into a scratch folder**

```bash
python registers/uk/export_for_site.py "$(mktemp -d)"
```

Expected, after the scratch folder's name, on the tables of 2026-10-03 (hashes change when a table is refreshed):

```
turnover.json: 4795 rows, 51d1dbb39e5a
premises.json: 42 rows, 4bdd8332330c
survival.json: 110 rows, 2675b0544984
failures.json: 137 rows, 12ceff334174
```

- [ ] **Step 6: Commit**

```bash
git add registers/uk/export_for_site.py registers/uk/tests/test_export.py
git commit -m "registers/uk: export_for_site writes the slices the website reads with a SHA-256 manifest, and refuses a stale table" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 11: The README says the new run order

**Files:**
- Modify: `registers/uk/README.md`

- [ ] **Step 1: Edit README.md**

In `registers/uk/README.md`, replace:

```markdown
**Run order:** `fetch_nomis.py`, `fetch_fsa.py`, `fetch_misc.py`, `fetch_gazette.py`; then the `build_*.py` scripts in any order
(`build_companies.py`, `build_formations.py` and `build_gazette.py` read the FSA snapshot for London's postcode districts, so run `build_fsa.py` first;
`build_editorial.py` reads every table, so it runs last).
Every fetch was approved by the founder on 2026-10-02; re-running skips files already on disk.
```

with:

```markdown
**Run order:** `fetch_nomis.py`, `fetch_fsa.py`, `fetch_misc.py`, `fetch_gazette.py` (every fetch was approved by the founder
on 2026-10-02; re-running skips files already on disk); then the `build_*.py` scripts that read the downloads
(`build_companies.py`, `build_formations.py` and `build_gazette.py` read the FSA snapshot for London's postcode districts, so run `build_fsa.py` first);
then `enrich_failure_rates.py` (after every `build_gazette.py`); then `build_ledger.py` and `build_pack.py`, which copy every
table's caveats; then `build_editorial.py`, which reads every table; then `draft_stories.py`; then `export_for_site.py`, which
writes the slices the website reads into `E:/atlas/website/data/uk/registers` (or into the folder given as its argument) and
refuses a table that is stale or half built.
Tests: `python -m pytest registers/uk/tests -q` from `E:/atlas` (the estimators, the builders' own rules, and the invariants of
the built tables).

**Estimators (`estimators/`):** `banded.py` (band quantiles, the CDF, the rounding range of a quantile, which quantiles print
in words, the anchor mean, the lognormal model check), `rates.py` (Wilson and Garwood intervals, the 10-case publication rule,
two-proportion tests, Holm), `survival.py` (survival on the latest year's closure rates with Greenwood intervals),
`rounding.py` (a printed figure rounded the website's way). Their formulas are in each module's docstring and in
`E:/atlas/website/docs/superpowers/plans/2026-10-02-vertical-engine-00-master.md`.
```

- [ ] **Step 2: Edit README.md**

In `registers/uk/README.md`, replace:

```markdown
VAT/PAYE-registered businesses, premises, median VAT turnover, share under 100k, premises by staff size |
```

with:

```markdown
VAT/PAYE-registered businesses, premises, the ten turnover band counts, median VAT turnover with the tenth and quarter points and the median's range, share under 100k, premises by staff size |
```

- [ ] **Step 3: Edit README.md**

In `registers/uk/README.md`, replace:

```markdown
| `survival_london_and_trades.json` | 1 to 5-year survival of new businesses per London borough (all trades) and per trade's SIC group (UK); 2024 births and deaths per borough |
```

with:

```markdown
| `survival_london_and_trades.json` | survival of new businesses after 1 to 5 years on the 2024 closure rates, with intervals, and each cohort's own figure, per London borough (all trades; the City of London never ranks) and per trade's SIC group (UK); 2024 births and deaths per borough |
```

- [ ] **Step 4: Edit README.md**

In `registers/uk/README.md`, replace:

```markdown
solvent closures per trade, UK and London districts, per 1,000 live companies |
```

with:

```markdown
solvent closures per trade, UK and London districts, per 1,000 live companies, with a 95% interval, printed from 10 insolvencies |
```

- [ ] **Step 5: Run the whole suite once more**

```bash
python -m pytest registers/uk/tests -q
```

Expected: `75 passed`.

- [ ] **Step 6: Commit**

```bash
git add registers/uk/README.md
git commit -m "registers/uk: README gives the run order with the estimators, the rates, the ledger, the drafts and the export" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 12: The ledger and the data pack describe the figures the pages print

`build_ledger.py` writes `tables/ledger.json`, the source of About the figures: one row per kind of figure, how it is
made, and the table's caveats. Its rows still described survival as each cohort's survivors over its births and listed no
rates, and `build_pack.py` wrote the data pack's survival columns from the mixed-cohort curve, so the About page and the
pack would disagree with the printed figures. The rows now say how the turnover quantiles, survival on current closure
rates and the rates' intervals are made, and the pack carries the period curve, its five-year interval, the 2019 cohort's
own figure, the ranked flag and each rate's interval and flags. The pack is written to the git-ignored cache and published
by nobody until the founder sets the free line.

**Files:**
- Modify: `registers/uk/build_ledger.py`, `registers/uk/build_pack.py`
- Rebuilt: `registers/uk/tables/ledger.json` (the pack goes to `E:/atlas/cache/uk/pack/<version>/`, ignored by git)

- [ ] **Step 1: Edit build_ledger.py**

In `registers/uk/build_ledger.py`, replace:

```python
    ("uk.turnover.median", "The middle business's yearly turnover per trade and borough", "worked out",
     "the median read from the official counts by turnover band, interpolated on a log scale inside its band; withheld under 40 enterprises",
     "london_trades_by_borough.json", ["median_turnover_k", "thin"], "ons", "yearly"),
```

with:

```python
    ("uk.turnover.median", "The middle business's yearly turnover per trade and borough, with the quarter and tenth points", "worked out",
     "read from the official counts by turnover band, on a log scale inside the band; a point below 50,000 pounds or above 50 million prints in words; the range around the middle is the lowest and highest the rounded counts allow; withheld under 40 enterprises",
     "london_trades_by_borough.json", ["median_turnover_k", "turnover_quantiles_k", "quantiles_in_open_band", "median_range_k", "turnover_bands_k", "thin"], "ons", "yearly"),
```

- [ ] **Step 2: Edit build_ledger.py**

In `registers/uk/build_ledger.py`, replace:

```python
     "the survivors of each birth cohort over its births, from the published counts", "survival_london_and_trades.json",
     ["survival", "births_by_cohort"], "ons", "yearly (November)"),
```

with:

```python
     "on the latest year's closure rates: each year's chance of closing, from the newest cohort with both ends of that year, applied in turn, with a 95% interval; the 2019 cohort's own five years beside it; the City of London never ranks",
     "survival_london_and_trades.json", ["survival_period", "survival", "births_by_cohort", "ranked"], "ons", "yearly (November)"),
```

- [ ] **Step 3: Edit build_ledger.py**

In `registers/uk/build_ledger.py`, replace:

```python
     "insolvency notices over twelve months, matched by company name to the register, over the trade's live companies",
     "company_failures_by_trade.json", ["uk_insolvent", "uk_live_companies", "uk_insolvent_per_1000"], "gazette", "monthly"),
```

with:

```python
     "insolvency notices over twelve months, matched by company name to the register, over the trade's live companies, with a 95% interval; printed from 10 insolvencies in the year, marked few cases from 10 to 29",
     "company_failures_by_trade.json", ["uk_insolvent", "uk_live_companies", "uk_rate"], "gazette", "monthly"),
```

- [ ] **Step 4: Edit build_pack.py**

In `registers/uk/build_pack.py`, replace:

```python
def main() -> int:
```

with:

```python
def period(row: dict) -> list:
    """The period curve's five years (survival on the latest closure rates) and the five-year interval; blank if withheld."""
    per = row.get("survival_period") or []
    return [r["survival"] for r in per] + [per[4]["lo"], per[4]["hi"]] if len(per) == 5 else [None] * 7


def rate(v: dict) -> list:
    """A trade's insolvency rate interval and flags; blank where no rate was computed."""
    r = v.get("uk_rate")
    return [r["lo"], r["hi"], r["publishable"], r["few_cases"]] if r else [None] * 4


def main() -> int:
```

- [ ] **Step 5: Edit build_pack.py**

In `registers/uk/build_pack.py`, replace:

```python
    counts["survival_by_borough.csv"] = write("survival_by_borough.csv",
        ["code", "borough", "survival_1y", "survival_2y", "survival_3y", "survival_4y", "survival_5y", "births_2024", "deaths_2024", "active_2024"],
        ((code, b["name"], *(b["survival"].get(k) for k in ("1y", "2y", "3y", "4y", "5y")), b.get("births_2024"), b.get("deaths_2024"), b.get("active_2024"))
         for code, b in s["by_borough"].items()))
```

with:

```python
    curve_cols = ["survival_1y", "survival_2y", "survival_3y", "survival_4y", "survival_5y", "survival_5y_lo", "survival_5y_hi", "cohort_2019_survival_5y", "births_2019"]
    counts["survival_by_borough.csv"] = write("survival_by_borough.csv",
        ["code", "borough", "ranked", *curve_cols, "births_2024", "deaths_2024", "active_2024"],
        ((code, b["name"], b["ranked"], *period(b), b["survival"].get("5y"), b["births_by_cohort"].get("2019"), b.get("births_2024"), b.get("deaths_2024"), b.get("active_2024"))
         for code, b in s["by_borough"].items()))
```

- [ ] **Step 6: Edit build_pack.py**

In `registers/uk/build_pack.py`, replace:

```python
            rows.append((g["group"], g["group_name"], *(g["survival"].get(k) for k in ("1y", "2y", "3y", "4y", "5y")), g["births_by_cohort"].get("2019")))
    counts["survival_by_trade_group.csv"] = write("survival_by_trade_group.csv",
        ["sic_group", "group_name", "survival_1y", "survival_2y", "survival_3y", "survival_4y", "survival_5y", "births_2019"], rows)
```

with:

```python
            rows.append((g["group"], g["group_name"], *period(g), g["survival"].get("5y"), g["births_by_cohort"].get("2019")))
    counts["survival_by_trade_group.csv"] = write("survival_by_trade_group.csv", ["sic_group", "group_name", *curve_cols], rows)
```

- [ ] **Step 7: Edit build_pack.py**

In `registers/uk/build_pack.py`, replace:

```python
        ["trade", "sic", "match", "uk_live_companies", "uk_insolvent", "uk_solvent", "uk_insolvent_per_1000", "london_insolvent", "london_solvent"],
        ((t, " ".join(v["sic"]), v["match"], v.get("uk_live_companies"), v.get("uk_insolvent"), v.get("uk_solvent"), v.get("uk_insolvent_per_1000"),
          (v.get("london") or {}).get("insolvent"), (v.get("london") or {}).get("solvent")) for t, v in fl["trades"].items()))
```

with:

```python
        ["trade", "sic", "match", "uk_live_companies", "uk_insolvent", "uk_solvent", "uk_insolvent_per_1000", "rate_lo", "rate_hi", "publishable", "few_cases",
         "london_insolvent", "london_solvent"],
        ((t, " ".join(v["sic"]), v["match"], v.get("uk_live_companies"), v.get("uk_insolvent"), v.get("uk_solvent"), v.get("uk_insolvent_per_1000"), *rate(v),
          (v.get("london") or {}).get("insolvent"), (v.get("london") or {}).get("solvent")) for t, v in fl["trades"].items()))
```

- [ ] **Step 8: Rebuild the ledger and the pack**

```bash
python registers/uk/build_ledger.py
python registers/uk/build_pack.py
```

Expected: fourteen ledger lines (`uk.survival` among them), then `pack <version>: 13 files` with `survival_by_borough.csv:
38 rows`, `survival_by_trade_group.csv: 76 rows` and `failures_by_trade.csv: 137 rows`.

- [ ] **Step 9: Read the rows that changed**

```bash
python -c "
import json
rows = {r['key']: r for r in json.load(open('registers/uk/tables/ledger.json', encoding='utf-8'))['rows']}
for k in ('uk.turnover.median', 'uk.survival', 'uk.failures'): print(k, rows[k]['fields'])
"
```

Expected:

```
uk.turnover.median ['median_turnover_k', 'turnover_quantiles_k', 'quantiles_in_open_band', 'median_range_k', 'turnover_bands_k', 'thin']
uk.survival ['survival_period', 'survival', 'births_by_cohort', 'ranked']
uk.failures ['uk_insolvent', 'uk_live_companies', 'uk_rate']
```

- [ ] **Step 10: Commit**

```bash
git add registers/uk/build_ledger.py registers/uk/build_pack.py registers/uk/tables/ledger.json
git commit -m "registers/uk: the ledger and the data pack describe survival on current closure rates, the turnover quantiles and the rates' intervals" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.
