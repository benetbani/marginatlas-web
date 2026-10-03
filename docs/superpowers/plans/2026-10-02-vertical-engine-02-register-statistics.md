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
  rebuilding every table; the slices exported from them were byte-identical to the validated ones).
- Rebuild order, because each step reads the one before: `build_nomis.py` -> `build_demography.py` ->
  `enrich_failure_rates.py` -> `build_editorial.py` -> `draft_stories.py`; `export_for_site.py` last (plan 03 runs it into
  the website).
- Commits: one per task, never pushed by this plan, on the branch `E:/atlas` is on (`p4-seam` on 2026-10-02; if it is on
  its default branch, create `vertical-engine` first). The controlling session commits; a subagent executing a task stops
  before its commit step and reports. Never `--no-verify`.

## File structure

| File | Responsibility |
|---|---|
| `registers/uk/estimators/__init__.py` | marks the package (empty) |
| `registers/uk/estimators/banded.py` | band quantiles, the CDF, the rounding range, the anchor mean, the lognormal model check |
| `registers/uk/estimators/rates.py` | Wilson and Garwood intervals, the publication rule, two-proportion tests, Holm |
| `registers/uk/estimators/survival.py` | the synthetic cohort (survival on the latest year's closure rates) with Greenwood intervals |
| `registers/uk/tests/conftest.py` | puts `registers/uk` on the import path for pytest run from `E:/atlas` |
| `registers/uk/tests/test_*.py` | one test file per estimator, and `test_tables.py` for the built tables' invariants |
| `registers/uk/build_nomis.py` (modify) | quantiles, open-band flags, the median's rounding range, the model check per area |
| `registers/uk/build_demography.py` (modify) | `survival_period` per borough and per trade group |
| `registers/uk/enrich_failure_rates.py` (create) | `uk_rate` per trade: the rate, its interval, the publication flags |
| `registers/uk/build_editorial.py` (modify) | the feed on publishable rates, period survival, the City of London out of demography rankings |
| `registers/uk/draft_stories.py` (modify) | the restaurant draft's sentence says which survival it gives |
| `registers/uk/export_for_site.py` (create) | the slices the website reads, with a SHA-256 manifest |
| `registers/uk/README.md` (modify) | the run order and the new files |

### Task 1: The band estimator

The register gives counts in ten turnover bands and nothing inside a band. Inside a band [L, U) businesses are read as
log-uniform, so the q-quantile in band k is `Q = L (U / L)^((qN - C_{k-1}) / n_k)` and the CDF is the same formula inverted;
the first band is floored at 5k and the open top band capped at 100m, and a quantile in either prints only as "under 50k" or
"over 50m". Each count is rounded to the nearest 5, so the rounding range of a quantile comes from four corner evaluations:
every band below the quantile's band moved one way by 2.5, every band above the other way, the quantile's own band tried
both ways (a quantile is monotone in each count, so the corners are the extremes). `trimmed_mean` is the anchor of plan
03's size rule: the mean sales of businesses in the bands below 5m, each band at its shape's mean: log-flat
`(U - L) / ln(U / L)` by default, flat `(U + L) / 2` or Pareto `L U ln(U / L) / (U - L)`, which bracket the plausible
shapes (Pareto <= geometric mean <= log-flat <= flat in every band), with hard bounds that hold whatever the shape.
`lognormal_fit` maximises
`sum_k n_k ln(Phi((ln U_k - mu)/sigma) - Phi((ln L_k - mu)/sigma))` and runs the G-test: it recovers a true lognormal from
rounded counts and rejects London restaurants at p about 1e-64, which is why pages never print a fitted curve.

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
import math

import pytest

from estimators.banded import empirical_cdf, empirical_quantile, lognormal_fit, rounding_range, trimmed_mean

# London, licensed restaurants (SIC 56101), enterprises by turnover band, March 2026 (Nomis NM_199_1, read 2026-10-02)
RESTAURANTS_LONDON = [625, 800, 2250, 1470, 1245, 725, 500, 140, 75, 30]
# London, hairdressing and other beauty treatment (SIC 96020)
HAIR_BEAUTY_LONDON = [2405, 3740, 2655, 525, 245, 70, 40, 10, 5, 0]
# Camden, the same code: a borough-sized count
HAIR_BEAUTY_CAMDEN = [140, 135, 100, 35, 30, 5, 0, 0, 0, 0]
# Drawn from a lognormal (median 280k, sigma 1) for 7,865 businesses and rounded to 5: a case where the model is true
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
reason; a quantile landing there is marked "above 50,000k". The CDF is the same formula inverted, so the share of businesses
above any sales figure comes from the same assumption as the quantiles.

LOGNORMAL (the model check). A lognormal fitted by maximum likelihood to the band counts:
    log L(mu, sigma) = sum_k n_k * log(Phi((ln U_k - mu)/sigma) - Phi((ln L_k - mu)/sigma))
with the G-test of fit (df = non-empty bands - 3). When the fit holds (p >= 0.01) and its median sits within 10% of the
empirical one, the two agree and the empirical figure prints; when they disagree the figure still prints (it assumes less)
and the disagreement is recorded for review.

ROUNDING, not sampling. The register is a census: there is no sampling error. Its error is that every count is rounded to
the nearest 5. rounding_range() gives the smallest and largest quantile the true counts could produce: each count can be
off by up to 2.5, a quantile falls when counts below it rise or counts above it fall, so the extremes are reached at the
corners where every band below moves one way and every band above the other (the band holding the quantile is tried both
ways).
"""
from __future__ import annotations

import math
from typing import Sequence

from scipy import optimize, stats

# turnover bands in thousands of pounds, [lower, upper); the register's ten
BANDS_K: tuple[tuple[float, float], ...] = (
    (0, 50), (50, 100), (100, 250), (250, 500), (500, 1000), (1000, 2000), (2000, 5000), (5000, 10000), (10000, 50000), (50000, math.inf),
)
FLOOR_K = 5.0
TOP_CAP_K = 100000.0


def _log_edges(k: int) -> tuple[float, float]:
    lo, hi = BANDS_K[k]
    return math.log(max(lo, FLOOR_K)), math.log(min(hi, TOP_CAP_K))


def empirical_quantile(counts: Sequence[float], q: float) -> float | None:
    """The q-quantile of sales in thousands of pounds, or None when there are no businesses."""
    if not 0 < q < 1:
        raise ValueError("q must be strictly between 0 and 1")
    n = float(sum(counts))
    if n <= 0:
        return None
    target = q * n
    cum = 0.0
    for k, c in enumerate(counts):
        if c > 0 and cum + c >= target:
            frac = (target - cum) / c
            a, b = _log_edges(k)
            return math.exp(a + frac * (b - a))
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
    website's bandMeanK (src/lib/uk/pnl/banded.ts), which anchors the profit-and-loss model's size rule."""
    if len(counts) != len(BANDS_K):
        raise ValueError("ten band counts expected")
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
    n = float(sum(counts))
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
    """The smallest and largest q-quantile that counts each within +-half of these could give."""
    base = empirical_quantile(counts, q)
    if base is None:
        return None
    n = float(sum(counts))
    cum = 0.0
    kq = len(counts) - 1
    for k, c in enumerate(counts):
        if c > 0 and cum + c >= q * n:
            kq = k
            break
        cum += c
    out = []
    for low_side in (True, False):
        for at in (-half, half):
            adj = []
            for k, c in enumerate(counts):
                # a printed 0 can hide up to 2 businesses, so an empty band moves like any other (but never below 0)
                if k < kq:
                    adj.append(max(0.0, c + (half if low_side else -half)))
                elif k > kq:
                    adj.append(max(0.0, c - (half if low_side else -half)))
                else:
                    adj.append(max(0.0, c + at))
            v = empirical_quantile(adj, q)
            if v is not None:
                out.append(v)
    return (min(out), max(out)) if out else None


def _phi(z: float) -> float:
    """The standard normal CDF through math.erf: about fifty times faster than scipy.stats.norm.cdf on one number, which
    matters because the model check runs once for every trade in every place (some 4,800 fits)."""
    return 0.5 * (1.0 + math.erf(z / math.sqrt(2.0)))


def lognormal_fit(counts: Sequence[float]) -> dict | None:
    """Maximum-likelihood lognormal for band counts: mu, sigma (of ln sales in thousands), the G statistic and its p-value."""
    nonempty = [k for k, c in enumerate(counts) if c > 0]
    if len(nonempty) < 3:
        return None
    log_edges = [(math.log(lo) if lo > 0 else -math.inf, math.log(hi) if math.isfinite(hi) else math.inf) for lo, hi in BANDS_K]

    def cdf_log(le: float, m: float, s: float) -> float:
        if le == -math.inf:
            return 0.0
        if le == math.inf:
            return 1.0
        return _phi((le - m) / s)

    def band_p(k: int, m: float, s: float) -> float:
        a, b = log_edges[k]
        return cdf_log(b, m, s) - cdf_log(a, m, s)

    def nll(theta: Sequence[float]) -> float:
        m, ls = theta
        s = math.exp(ls)
        return -sum(counts[k] * math.log(max(band_p(k, m, s), 1e-300)) for k in nonempty)

    n = float(sum(counts))
    med = empirical_quantile(counts, 0.5) or 100.0
    res = optimize.minimize(nll, [math.log(med), 0.0], method="Nelder-Mead", options={"xatol": 1e-9, "fatol": 1e-9, "maxiter": 10000})
    m, s = float(res.x[0]), float(math.exp(res.x[1]))
    g = 0.0
    for k in nonempty:
        e = n * band_p(k, m, s)
        g += 2 * counts[k] * math.log(counts[k] / max(e, 1e-300))
    df = len(nonempty) - 3
    p = float(stats.chi2.sf(g, df)) if df > 0 else None
    return {"mu": m, "sigma": s, "median_k": math.exp(m), "g": g, "df": df, "p": p}
```

- [ ] **Step 5: Run it and watch it pass**

```bash
python -m pytest registers/uk/tests/test_banded.py -q
```

Expected: `10 passed`.

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

**Files:**
- Create: `registers/uk/estimators/rates.py`
- Test: `registers/uk/tests/test_rates.py` (create)

- [ ] **Step 1: Write the failing test**

Create `registers/uk/tests/test_rates.py`:

```python
"""Tests for estimators/rates.py. Run: python -m pytest registers/uk/tests -q"""
import pytest

from estimators.rates import garwood, holm, rate_per_1000, two_proportions, wilson


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
```

- [ ] **Step 2: Run it and watch it fail**

```bash
python -m pytest registers/uk/tests/test_rates.py -q
```

Expected: a collection error ending `ModuleNotFoundError: No module named 'estimators.rates'`, exit code 2.

- [ ] **Step 3: Write the implementation**

Create `registers/uk/estimators/rates.py`:

```python
"""
estimators/rates.py: rates per 1,000 with their intervals, when a figure may be published, and whether two differ.

A year of insolvencies x among N live companies is a census count, but the page reads it as a risk ("how likely a restaurant
company is to fail in a year"), and a risk estimated from x events has the uncertainty of x:

  WILSON (the proportion x / N):  centre (p + z^2/2N) / (1 + z^2/N), half-width z sqrt(p(1-p)/N + z^2/4N^2) / (1 + z^2/N).
      Good at small x and never outside [0, 1]; used for every rate per 1,000.
  GARWOOD (an exact Poisson interval for the count x): [chi2(alpha/2; 2x) / 2, chi2(1 - alpha/2; 2x + 2) / 2].
      Used where only the count matters (x insolvencies in a month).
  RELATIVE STANDARD ERROR of a Poisson count: 1 / sqrt(x). A rate prints only from x >= 10 (RSE <= 32%); between 10 and 30
      it prints with "few cases".
  TWO RATES (a duel): the pooled two-proportion z-test; when one page compares many pairs, the p-values are Holm-adjusted
      (sort ascending, multiply the i-th smallest by (m - i + 1), keep them non-decreasing, cap at 1), and a difference is
      "real" at an adjusted p below 0.01.
"""
from __future__ import annotations

import math
from typing import Sequence

from scipy import stats

Z95 = 1.959963984540054


def wilson(x: int, n: int, z: float = Z95) -> tuple[float, float]:
    if n <= 0 or x < 0 or x > n:
        raise ValueError("wilson: need 0 <= x <= n and n > 0")
    p = x / n
    den = 1 + z * z / n
    centre = (p + z * z / (2 * n)) / den
    half = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / den
    # at x = 0 (or x = n) the bound is exactly 0 (or 1); floating point leaves a 1e-19 residue that would print as a figure
    lo = 0.0 if x == 0 else max(0.0, centre - half)
    hi = 1.0 if x == n else min(1.0, centre + half)
    return lo, hi


def garwood(x: int, alpha: float = 0.05) -> tuple[float, float]:
    if x < 0:
        raise ValueError("garwood: a count cannot be negative")
    lo = 0.0 if x == 0 else float(stats.chi2.ppf(alpha / 2, 2 * x)) / 2
    hi = float(stats.chi2.ppf(1 - alpha / 2, 2 * (x + 1))) / 2
    return lo, hi


def rate_per_1000(x: int, n: int) -> dict:
    lo, hi = wilson(x, n)
    rse = 1 / math.sqrt(x) if x > 0 else None
    return {
        "value": round(1000 * x / n, 1),
        "lo": round(1000 * lo, 1),
        "hi": round(1000 * hi, 1),
        "rse": None if rse is None else round(rse, 3),
        "publishable": x >= 10,
        "few_cases": 10 <= x < 30,
    }


def two_proportions(x1: int, n1: int, x2: int, n2: int) -> tuple[float, float]:
    """Pooled two-proportion z statistic and its two-sided p-value."""
    p = (x1 + x2) / (n1 + n2)
    se = math.sqrt(p * (1 - p) * (1 / n1 + 1 / n2))
    if se == 0:
        return 0.0, 1.0
    z = (x1 / n1 - x2 / n2) / se
    return z, float(2 * stats.norm.sf(abs(z)))


def holm(pvalues: Sequence[float]) -> list[float]:
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

Expected: `6 passed`.

- [ ] **Step 5: Commit**

```bash
git add registers/uk/estimators/rates.py registers/uk/tests/test_rates.py
git commit -m "registers/uk: rates with Wilson and Garwood intervals, the 10-case publication rule, two-proportion tests and Holm, test-first" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 3: Survival on current closure rates

For a cohort born in year c, `h_c(t) = 1 - s_c(t)/s_c(t-1)` is its chance of closing in its t-th year. The figure a new owner
needs is survival on today's closure rates: take each year's hazard from the newest cohort that has both ends of that year
and chain them, `S(t) = prod_{j<=t} (1 - h_j)`, with Greenwood's variance `S(t)^2 sum_j h_j / (n_j (1 - h_j))`. With the
2024 tables every hazard is calendar 2024's. Printing each horizon from its own latest cohort instead mixes cohorts and can
rise from one year to the next, which survival cannot do; the test builds exactly that case.

**Files:**
- Create: `registers/uk/estimators/survival.py`
- Test: `registers/uk/tests/test_survival.py` (create)

- [ ] **Step 1: Write the failing test**

Create `registers/uk/tests/test_survival.py`:

```python
"""Tests for estimators/survival.py. Run: python -m pytest registers/uk/tests -q"""
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
    assert [r["survival"] for r in rows] == [0.95, 0.7516, 0.6368, 0.5429, 0.4343]


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
    assert s == [0.95, 0.7125, 0.6874]
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
It cannot rise, it uses the newest evidence for every year, and S(1) equals the latest one-year figure exactly.

GREENWOOD'S VARIANCE gives each S(t) an interval: Var S(t) ~ S(t)^2 * sum_{j <= t} h_j / (n_j (1 - h_j)), n_j being the
businesses at risk at the start of year j in the cohort used for that year. With counts rounded to 5, the interval is a
floor on the uncertainty, not all of it.
"""
from __future__ import annotations

import math


def synthetic_cohort(births: dict[int, int], survivors: dict[int, dict[int, int]], horizon: int = 5) -> list[dict]:
    """births[c] = the cohort's births; survivors[c][t] = still trading t years on. Returns one row per year t."""
    rows = []
    s = 1.0
    var_sum = 0.0
    for t in range(1, horizon + 1):
        usable = [c for c in births if t in survivors.get(c, {}) and (t == 1 or (t - 1) in survivors.get(c, {}))]
        if not usable:
            break
        c = max(usable)
        at_risk = births[c] if t == 1 else survivors[c][t - 1]
        if at_risk <= 0:
            break
        h = 1 - survivors[c][t] / at_risk
        s *= 1 - h
        if 0 < h < 1:
            var_sum += h / (at_risk * (1 - h))
        se = s * math.sqrt(var_sum)
        rows.append({"year": t, "cohort": c, "hazard": round(h, 4), "survival": round(s, 4), "lo": round(max(0.0, s - 1.96 * se), 4), "hi": round(min(1.0, s + 1.96 * se), 4)})
    return rows
```

- [ ] **Step 4: Run it and watch it pass**

```bash
python -m pytest registers/uk/tests/test_survival.py -q
```

Expected: `3 passed`.

- [ ] **Step 5: Commit**

```bash
git add registers/uk/estimators/survival.py registers/uk/tests/test_survival.py
git commit -m "registers/uk: survival on the latest year's closure rates (a synthetic cohort) with Greenwood intervals, test-first" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 4: The invariants every rebuilt table must keep

The builders' edits in tasks 5 to 8 change tables, not functions, so their red-then-green cycle is a test over the built
tables. It pins no figure (the registers refresh monthly and yearly) and only invariants: quantiles in order and bracketing
the median, survival that never rises and sits inside its interval, rates inside their intervals with the publication rule
applied, and a feed that prints only publishable rates and leaves the City of London out of demography rankings.

**Files:**
- Test: `registers/uk/tests/test_tables.py` (create)

- [ ] **Step 1: Write the test**

Create `registers/uk/tests/test_tables.py`:

```python
"""Invariants of the built tables: what every rebuild must keep, whatever month's data it holds. Reads registers/uk/tables,
so it runs after the builders (python -m pytest registers/uk/tests -q). No figure is pinned here: the registers refresh
monthly and yearly; a pinned figure belongs in a builder's own check, not in a test that must hold next month."""
import json
from pathlib import Path

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
            assert lo <= q["q50"] <= hi, (slug, geo)
            assert r["median_turnover_k"] == q["q50"], (slug, geo)
            assert set(r["quantiles_in_open_band"]) <= set(q), (slug, geo)
    assert seen > 0


def test_period_survival_never_rises_and_sits_inside_its_interval():
    d = load("survival_london_and_trades.json")
    curves = [b["survival_period"] for b in d["by_borough"].values()]
    curves += [g["survival_period"] for t in d["by_trade"].values() for g in t["groups"]]
    assert curves
    for c in curves:
        s = [r["survival"] for r in c]
        assert all(a >= b for a, b in zip(s, s[1:]))
        assert all(r["lo"] <= r["survival"] <= r["hi"] for r in c)
        assert [r["year"] for r in c] == list(range(1, len(c) + 1))


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
    assert fail["duel"]["pairs_tested"] == len(fail["top"]) * len(fail["bottom"])
    longest = items["last-longest"]
    assert all("cohort_2019_five_years" in r and r["lo"] <= r["value"] <= r["hi"] for r in longest["top"] + longest["bottom"])
    assert set(items["restaurants-year-one"]["answer"]) == {"after_one_year", "after_five_years", "after_five_years_2019_cohort"}
    for key in ("last-where", "open-close"):
        assert all(r.get("code") != CITY_OF_LONDON for r in items[key]["top"] + items[key]["bottom"]), key
```

- [ ] **Step 2: Run it against today's tables and watch all four fail**

```bash
python -m pytest registers/uk/tests/test_tables.py -q
```

Expected: `4 failed`: a `KeyError: 'turnover_bands_k'`, a `KeyError: 'survival_period'`, an `AssertionError` naming a trade
(no `uk_rate` yet) and an `AssertionError` in the feed test. Tasks 5 to 8 turn them green one by one.

- [ ] **Step 3: Commit**

```bash
git add registers/uk/tests/test_tables.py
git commit -m "registers/uk: the invariants every rebuilt table keeps (failing until the builders carry the estimators)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit.

### Task 5: Turnover quantiles, their rounding range and the model check in `build_nomis.py`

The builder's own median (`median_k`) becomes `empirical_quantile(bands, 0.5)`, the same log-uniform reading, so every
published median stays the same (checked: 4,795 of 4,795); the old function and its `math` import are deleted. Per area it
adds the ten band counts, q10 to q90 (not for an area under 40 enterprises), which of them fall in an open band, the
median's rounding range and the lognormal model check's p-value, with three caveats saying what each is.

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

from estimators.banded import empirical_quantile, lognormal_fit, rounding_range
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
                    if v < 50 or v >= 50000:
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
                "median_range_k": None if rng is None else [round(rng[0], 1), round(rng[1], 1)],
                "lognormal_fit_p": None if (fit is None or fit["p"] is None) else float(f"{fit['p']:.3g}"),
            }
```

- [ ] **Step 5: Edit build_nomis.py**

In `registers/uk/build_nomis.py`, replace:

```python
            "the median is interpolated inside a turnover band on a log scale; it is not printed where an area holds under 40 enterprises",
```

with:

```python
            "the median is interpolated inside a turnover band on a log scale; it is not printed where an area holds under 40 enterprises",
            "quantiles q10 to q90 use the same interpolation (estimators/banded.py); one inside the first band (under 50k) or the open top band (over 50,000k) rests on the 5k floor or the cap and prints only as 'under 50k' or 'over 50m' (quantiles_in_open_band)",
            "median_range_k is the smallest and largest median the true counts could give, each count being rounded to the nearest 5 (the register is a census: rounding, not sampling, is its error)",
            "lognormal_fit_p is a model check, not a figure: real turnover is far from lognormal in most cells (London restaurants p about 1e-64), so pages never print the model",
```

- [ ] **Step 6: Edit build_nomis.py**

In `registers/uk/build_nomis.py`, delete:

```python
import math
```

- [ ] **Step 7: Edit build_nomis.py**

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

- [ ] **Step 8: Rebuild the table**

```bash
python registers/uk/build_nomis.py
```

Expected (about 30 seconds): the last line `built 137 trades x 35 geographies from E:\atlas\cache\uk\nomis\2026-10-02`.

- [ ] **Step 9: Prove every published median is unchanged**

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

- [ ] **Step 10: The turnover invariant turns green**

```bash
python -m pytest registers/uk/tests/test_tables.py -q -k turnover
```

Expected: `1 passed, 3 deselected`.

- [ ] **Step 11: Commit**

```bash
git add registers/uk/build_nomis.py registers/uk/tables/london_trades_by_borough.json
git commit -m "registers/uk: build_nomis carries q10 to q90, the open-band flags, the median's rounding range and the model check; every median unchanged" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 6: Survival on current closure rates in `build_demography.py`

Each borough and each trade group gets `survival_period`: years 1 to 5 from `synthetic_cohort`, each row naming the cohort
its hazard came from. The old `survival` field (each horizon from its own latest cohort) stays for comparison, and the
`horizons` note says which is which and why the period curve prints by default.

**Files:**
- Modify: `registers/uk/build_demography.py`
- Rebuilt: `registers/uk/tables/survival_london_and_trades.json`

- [ ] **Step 1: Edit build_demography.py**

In `registers/uk/build_demography.py`, replace:

```python
import openpyxl
```

with:

```python
import openpyxl

from estimators.survival import synthetic_cohort
```

- [ ] **Step 2: Edit build_demography.py**

In `registers/uk/build_demography.py`, replace:

```python
def main() -> int:
```

with:

```python
def period_curve(per_cohort: dict, key: str) -> list[dict]:
    """Survival on the latest year's closure rates (a synthetic cohort, estimators/survival.py): each year's chance of
    closing from the newest cohort that has both ends of that year, chained. Cannot rise; S(1) equals the latest one-year
    figure. Each row names the cohort it used."""
    births, survivors = {}, {}
    for c in per_cohort:
        row = per_cohort[c].get(key)
        if row and row.get("births"):
            births[int(c)] = row["births"]
            survivors[int(c)] = {t: row[t] for t in range(1, 6) if t in row}
    return synthetic_cohort(births, survivors)


def main() -> int:
```

- [ ] **Step 3: Edit build_demography.py**

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
            "survival": pts,
            "survival_period": period_curve(la, k),
```

- [ ] **Step 4: Edit build_demography.py**

In `registers/uk/build_demography.py`, replace:

```python
            res.append({"group": key, "group_name": gnames[key], "survival": pts, "births_by_cohort": births})
```

with:

```python
            res.append({"group": key, "group_name": gnames[key], "survival": pts, "survival_period": period_curve(sic, key), "births_by_cohort": births})
```

- [ ] **Step 5: Edit build_demography.py**

In `registers/uk/build_demography.py`, replace:

```python
        "horizons": "each horizon from the latest cohort that reaches it: 5y born 2019, 4y born 2020, 3y born 2021, 2y born 2022, 1y born 2023",
```

with:

```python
        "horizons": "survival: each horizon from the latest cohort that reaches it (5y born 2019 to 1y born 2023), which mixes cohorts; survival_period: the chance of still trading after 1 to 5 years on the closure rates of the latest year, chained from each year's newest cohort (prints by default: it cannot rise and it uses the newest evidence for every year)",
```

- [ ] **Step 6: Rebuild the table**

```bash
python registers/uk/build_demography.py
```

Expected: exit code 0.

- [ ] **Step 7: The survival invariant turns green**

```bash
python -m pytest registers/uk/tests/test_tables.py -q -k survival
```

Expected: `1 passed, 3 deselected`.

- [ ] **Step 8: Commit**

```bash
git add registers/uk/build_demography.py registers/uk/tables/survival_london_and_trades.json
git commit -m "registers/uk: build_demography adds survival on the 2024 closure rates (a synthetic cohort) per borough and trade group" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 7: Failure rates with their intervals

`company_failures_by_trade.json` is built by `build_gazette.py`, whose name matching takes minutes and is not re-run here; a
new script adds `uk_rate` to it: the rate per 1,000 live companies, its Wilson interval, the relative standard error and the
two flags. It is idempotent, so the monthly refresh can run it after every Gazette rebuild.

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
    rule = "uk_rate: Wilson 95% interval on insolvencies over live companies; publishable when 10 or more insolvencies (relative standard error 32% or less), 'few cases' from 10 to 29"
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

Expected: `1 passed, 3 deselected`.

- [ ] **Step 4: Commit**

```bash
git add registers/uk/enrich_failure_rates.py registers/uk/tables/company_failures_by_trade.json
git commit -m "registers/uk: failure rates carry a Wilson interval, the relative standard error and the 10-case publication rule" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 8: The home feed on the new statistics in `build_editorial.py`

Four feed items change. "Which trades fail most" ranks only publishable rates (10 insolvencies or more), carries each rate's
interval and "few cases" flag, and records the duel (the top against the bottom, every pair tested, the largest
Holm-adjusted p). "Which trades last longest", "Where firms last" and the restaurant answer use survival on the 2024 closure
rates, with the 2019 cohort's figure beside it. The City of London leaves every ranking built on business demography: its
register is head offices and formation addresses, and on the 2024 rates it would jump from the bottom three to the top.

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
                      floor="10 insolvencies in the year (relative standard error 32% or less)", left_out=left, period="notices October 2025 to September 2026; register of May 2026", source="company_failures_by_trade.json",
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
                         "value": round(per[4]["survival"] * 100, 1), "lo": round(per[4]["lo"] * 100, 1), "hi": round(per[4]["hi"] * 100, 1),
                         "one_year": round(per[0]["survival"] * 100, 1),
                         "cohort_2019_five_years": round(gr["survival"]["5y"] * 100, 1) if gr["survival"].get("5y") is not None else None, "units": births})
    rows.sort(key=lambda x: -x["value"])
    items.append(item(id="last-longest", title="Which trades last longest", unit="of 100 new firms still trading after five years",
                      line="On the closure rates of 2024, still trading after five years.", dimension="trade group", held="place: United Kingdom",
                      floor="1,000 births in the 2019 cohort", left_out=None, period="closure rates of 2024 (cohorts born 2019 to 2023), ONS business demography 2024",
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
                          definition="after_five_years chains each year's closure rate of 2024 (a synthetic cohort); the 2019 cohort's own five years closed fewer of its businesses"))
```

- [ ] **Step 5: Edit build_editorial.py**

In `registers/uk/build_editorial.py`, replace:

```python
    rows = [{"member": b["name"], "code": code, "value": round(b["survival"]["5y"] * 100, 1), "units": b["births_by_cohort"].get("2019")}
            for code, b in s["by_borough"].items() if code.startswith("E09") and b["survival"].get("5y") is not None and (b["births_by_cohort"].get("2019") or 0) >= 500]
```

with:

```python
    rows = [{"member": b["name"], "code": code, "value": round(b["survival_period"][4]["survival"] * 100, 1), "lo": round(b["survival_period"][4]["lo"] * 100, 1),
             "hi": round(b["survival_period"][4]["hi"] * 100, 1), "units": b["births_by_cohort"].get("2019")}
            for code, b in s["by_borough"].items() if code.startswith("E09") and len(b.get("survival_period") or []) == 5 and (b["births_by_cohort"].get("2019") or 0) >= 500]
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
                      floor="500 births in the 2019 cohort", left_out=None, period="closure rates of 2024", source="survival_london_and_trades.json",
```

- [ ] **Step 7: Edit build_editorial.py**

In `registers/uk/build_editorial.py`, replace:

```python
            for code, b in s["by_borough"].items() if code.startswith("E09") and len(b.get("survival_period") or []) == 5 and (b["births_by_cohort"].get("2019") or 0) >= 500]
```

with:

```python
            for code, b in s["by_borough"].items() if code.startswith("E09") and code not in DEMOGRAPHY_EXCLUDED and len(b.get("survival_period") or []) == 5 and (b["births_by_cohort"].get("2019") or 0) >= 500]
```

- [ ] **Step 8: Edit build_editorial.py**

In `registers/uk/build_editorial.py`, replace:

```python
            for code, b in s["by_borough"].items() if code.startswith("E09") and b.get("active_2024")]
```

with:

```python
            for code, b in s["by_borough"].items() if code.startswith("E09") and code not in DEMOGRAPHY_EXCLUDED and b.get("active_2024")]
```

- [ ] **Step 9: Edit build_editorial.py**

In `registers/uk/build_editorial.py`, replace:

```python
def main() -> int:
```

with:

```python
# The City of London is left out of every ranking built on business demography (survival, births, closures): its register
# is dominated by head offices and formation addresses, so its figures describe paperwork, not the shops on its streets.
# Measured 2026-10-02: on the 2024 closure rates it would top the five-year survival ranking (47.8 of 100) while its 2019
# cohort sat in the bottom three (32.5). Premises and hygiene rankings keep it: those count real premises.
DEMOGRAPHY_EXCLUDED = {"E09000001"}


def main() -> int:
```

- [ ] **Step 10: Rebuild the feed**

```bash
python registers/uk/build_editorial.py
```

Expected: exit code 0 and one line per feed item.

- [ ] **Step 11: The feed invariant turns green, and the full suite passes**

```bash
python -m pytest registers/uk/tests -q
```

Expected: `23 passed`.

- [ ] **Step 12: Read the four changed items**

```bash
python -c "
import json
items = {i['id']: i for i in json.load(open('registers/uk/tables/editorial_feed.json', encoding='utf-8'))['items']}
f = items['fail-most']; print(f['floor'], '|', f['members'], 'members,', f['left_out'], 'left out |', f['duel'])
print([(r['member'], r['value'], r['lo'], r['hi']) for r in f['top'][:2]], [(r['member'], r['value'], r['few_cases']) for r in f['bottom'][-1:]])
print(items['restaurants-year-one']['answer'])
w = items['last-where']; print(w['members'], [(r['member'], r['value']) for r in w['top'][:1] + w['bottom'][-1:]])
"
```

Expected, on the tables of 2026-10-02 (a later Gazette month moves the rates, not the shape):

```
10 insolvencies in the year (relative standard error 32% or less) | 76 members, 31 left out | {'top': 'Restaurants', 'bottom': 'Dental practices', 'pairs_tested': 24, 'max_holm_p': 6.40721251356562e-25}
[('Restaurants', 28.9, 27.3, 30.5), ('Public houses and bars', 26.0, 24.3, 27.8)] [('Dental practices', 1.3, True)]
{'after_one_year': 94.0, 'after_five_years': 29.3, 'after_five_years_2019_cohort': 39.1}
32 [('Richmond upon Thames', 44.9), ('Newham', 29.9)]
```

- [ ] **Step 13: Commit**

```bash
git add registers/uk/build_editorial.py registers/uk/tables/editorial_feed.json
git commit -m "registers/uk: the feed ranks publishable rates with intervals and a Holm-tested duel, survival on 2024 closure rates, the City of London out of demography rankings" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 9: The blog drafts say which survival they give

`draft_stories.py` turns each feed item into a draft. Its restaurant sentence says "were still trading", which reads as a
cohort fact; with the period figure it must say "on the closure rates of 2024" and give the 2019 cohort's figure beside it.

**Files:**
- Modify: `registers/uk/draft_stories.py`
- Regenerated: `design/loop/build/goal-2026-10-02/drafts/blog/*.md`

- [ ] **Step 1: Edit draft_stories.py**

In `registers/uk/draft_stories.py`, replace:

```python
        return (f"Of 100 new restaurants, cafes and food stalls in the UK, {a['after_one_year']:.0f} were still trading after one year "
                f"and {a['after_five_years']:.0f} after five.")
```

with:

```python
        return (f"On the closure rates of 2024, of 100 new restaurants, cafes and food stalls in the UK, {a['after_one_year']:.0f} would still "
                f"be trading after one year and {a['after_five_years']:.0f} after five; of those born in 2019, "
                f"{a['after_five_years_2019_cohort']:.0f} were.")
```

- [ ] **Step 2: Regenerate the drafts**

```bash
python registers/uk/draft_stories.py
```

Expected: one `draft: <id>` line per feed item. `git diff --stat design/loop/build/goal-2026-10-02/drafts/blog` lists six
files: fail-most, last-longest, last-where, open-close, restaurants-year-one and takings (its source table gained three
caveats); the other six drafts are unchanged.

- [ ] **Step 3: Read the restaurant sentence**

```bash
grep -n "closure rates of 2024, of 100" design/loop/build/goal-2026-10-02/drafts/blog/restaurants-year-one.md
```

Expected: one line reading `On the closure rates of 2024, of 100 new restaurants, cafes and food stalls in the UK, 94 would
still be trading after one year and 29 after five; of those born in 2019, 39 were.`

- [ ] **Step 4: Commit**

```bash
git add registers/uk/draft_stories.py design/loop/build/goal-2026-10-02/drafts/blog
git commit -m "registers/uk: the blog drafts name the survival they give (2024 closure rates, the 2019 cohort beside it)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 10: The slices the website reads

The website's chain must never read another repository or the network, so the figures it prints from the registers are
copied in, sliced to what the pages use, and fingerprinted: `export_for_site.py` writes four slices and a manifest of each
file's SHA-256 (plan 03, task 1 runs it into the website and adds the gate that recomputes the hashes). This task creates
the script and proves it into a scratch folder.

**Files:**
- Create: `registers/uk/export_for_site.py`

- [ ] **Step 1: Write the script**

Create `registers/uk/export_for_site.py`:

```python
"""
export_for_site.py: the slices of the register tables the website reads, written into the website repo with a manifest.

The website's build never reads the network or another repo (its chain must run on Vercel), so the figures it prints from
the registers are copied in, sliced to what the pages use, and fingerprinted: website/scripts/verify_uk_registers.ts
recomputes every file's SHA-256 against manifest.json, so a hand edit to a figure fails the chain.

Writes (default target E:/atlas/website/data/uk/registers, or the path given as the first argument):
  turnover.json   per trade code set and geography: the ten band counts, q10 to q90, the open-band flags, the median's
                  rounding range, enterprises (London, England and the 33 boroughs)
  premises.json   per kind of premises: the London and England rows of the valuation statistics (count, floorspace, value
                  per m2) and the valuation date
  survival.json   per SIC group and per borough: the period curve (survival on the latest year's closure rates) and the
                  2019 cohort's five-year figure for comparison
  failures.json   per trade: the year's insolvencies, live companies and the rate with its interval and flags
  manifest.json   each file's SHA-256, row count and the source table's own date line
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
T = HERE / "tables"
DEFAULT_TARGET = Path(r"E:\atlas\website\data\uk\registers")
KEEP_GEOS = ("E12000007", "E92000001")


def load(name: str) -> dict:
    return json.loads((T / name).read_text(encoding="utf-8"))


def write(target: Path, name: str, obj: dict, rows: int, manifest: dict, dated: str) -> None:
    text = json.dumps(obj, indent=1, ensure_ascii=False, sort_keys=True) + "\n"
    (target / name).write_text(text, encoding="utf-8", newline="\n")
    manifest["files"][name] = {"sha256": hashlib.sha256(text.encode("utf-8")).hexdigest(), "rows": rows, "data": dated}


def main() -> int:
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_TARGET
    target.mkdir(parents=True, exist_ok=True)
    manifest: dict = {"what": "Slices of E:/atlas/registers/uk/tables the website reads; do not edit by hand", "built_by": "E:/atlas/registers/uk/export_for_site.py", "files": {}}

    nb = load("london_trades_by_borough.json")
    turnover, rows = {}, 0
    for slug, t in nb["trades"].items():
        per = {}
        for geo, r in t["by_geography"].items():
            if not (geo in KEEP_GEOS or geo.startswith("E09")):
                continue
            per[geo] = {k: r.get(k) for k in ("name", "enterprises", "local_units", "thin", "turnover_bands_k", "turnover_quantiles_k", "quantiles_in_open_band", "median_range_k")}
            rows += 1
        turnover[slug] = {"sic": t["sic"], "match": t["match"], "by_geography": per}
    write(target, "turnover.json", {"snapshot": nb["snapshot"], "trades": turnover}, rows, manifest, nb["snapshot"])

    pv = load("london_premises_value_by_borough.json")
    premises = {"valuation_date": pv["valuation_date"], "trade_category": pv["trade_scat"], "rows": {g: pv["areas"][g] for g in KEEP_GEOS if g in pv["areas"]}}
    write(target, "premises.json", premises, sum(len(r["categories"]) for r in premises["rows"].values()), manifest, pv["valuation_date"])

    sv = load("survival_london_and_trades.json")
    groups, boroughs = {}, {}
    for t in sv["by_trade"].values():
        for g in t["groups"]:
            groups[g["group"]] = {"name": g["group_name"], "period": g.get("survival_period"), "cohort_2019_five_years": g["survival"].get("5y")}
    for code, b in sv["by_borough"].items():
        boroughs[code] = {"name": b["name"], "period": b.get("survival_period"), "cohort_2019_five_years": b["survival"].get("5y")}
    trade_groups = {slug: [g["group"] for g in t["groups"]] for slug, t in sv["by_trade"].items()}
    write(target, "survival.json", {"source": sv["source"], "groups": groups, "boroughs": boroughs, "trade_groups": trade_groups}, len(groups) + len(boroughs), manifest, sv["source"])

    fl = load("company_failures_by_trade.json")
    failures = {slug: {k: v.get(k) for k in ("sic", "match", "uk_live_companies", "uk_insolvent", "uk_rate")} for slug, v in fl["trades"].items()}
    write(target, "failures.json", {"source": fl["source"], "trades": failures}, len(failures), manifest, fl["source"])

    (target / "manifest.json").write_text(json.dumps(manifest, indent=1, sort_keys=True) + "\n", encoding="utf-8", newline="\n")
    for name, m in manifest["files"].items():
        print(f"{name}: {m['rows']} rows, {m['sha256'][:12]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

- [ ] **Step 2: Export into a scratch folder**

```bash
python registers/uk/export_for_site.py "$(mktemp -d)"
```

Expected, on the tables of 2026-10-02 (hashes change when a table is refreshed):

```
turnover.json: 4795 rows, 68bf73750597
premises.json: 42 rows, 4bdd8332330c
survival.json: 114 rows, b5257411f3e0
failures.json: 137 rows, 12ceff334174
```

- [ ] **Step 3: Commit**

```bash
git add registers/uk/export_for_site.py
git commit -m "registers/uk: export_for_site writes the slices the website reads with a SHA-256 manifest" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 11: The README says the new run order

**Files:**
- Modify: `registers/uk/README.md`

- [ ] **Step 1: Update the run order**

In `registers/uk/README.md`, replace:

```markdown
**Run order:** `fetch_nomis.py`, `fetch_fsa.py`, `fetch_misc.py`, `fetch_gazette.py`; then the `build_*.py` scripts in any order
(`build_companies.py`, `build_formations.py` and `build_gazette.py` read the FSA snapshot for London's postcode districts, so run `build_fsa.py` first;
`build_editorial.py` reads every table, so it runs last).
```

with:

```markdown
**Run order:** `fetch_nomis.py`, `fetch_fsa.py`, `fetch_misc.py`, `fetch_gazette.py`; then the `build_*.py` scripts
(`build_companies.py`, `build_formations.py` and `build_gazette.py` read the FSA snapshot for London's postcode districts, so run `build_fsa.py` first);
then `enrich_failure_rates.py` (after every `build_gazette.py`); then `build_editorial.py`, which reads every table; then
`draft_stories.py`; then `export_for_site.py`, which writes the slices the website reads into `E:/atlas/website/data/uk/registers`.
Tests: `python -m pytest registers/uk/tests -q` from `E:/atlas` (the estimators, and the invariants of the built tables).

**Estimators (`estimators/`):** `banded.py` (band quantiles, the CDF, the rounding range of a quantile, the anchor mean,
the lognormal model check), `rates.py` (Wilson and Garwood intervals, the 10-case publication rule, two-proportion tests,
Holm), `survival.py` (survival on the latest year's closure rates with Greenwood intervals). Their formulas are in each
module's docstring and in `E:/atlas/website/docs/superpowers/plans/2026-10-02-vertical-engine-00-master.md`.
```

- [ ] **Step 2: Run the whole suite once more**

```bash
python -m pytest registers/uk/tests -q
```

Expected: `23 passed`.

- [ ] **Step 3: Commit**

```bash
git add registers/uk/README.md
git commit -m "registers/uk: README gives the run order with the estimators, the rates, the drafts and the export" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.
