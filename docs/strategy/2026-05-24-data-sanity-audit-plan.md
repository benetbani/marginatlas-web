# Data sanity audit — master plan (v32, Sprint E)

> Founder mandate: "do possibly thousands of checks on business revenue
> for different kinds of situations." Confirm that the numbers Atlas
> publishes are not just defensible structurally, but defensible *to a
> human reader who lives in that country and that industry*. Build the
> plan first; do NOT execute until the plan is approved.

---

## Why this exists

Three founder-flagged risks made this audit necessary, not optional:

1. **Recency.** Atlas markets itself on "current numbers." If a cell on
   the live site is showing 2018 data because the ingestion pipeline
   never refreshed it, the brand promise is broken before any
   monetization conversation can start.
2. **Scale absurdity.** Cases like "average software firm in Region X
   makes $500M" turn up in the live site. That is statistically
   impossible for a small-business benchmark and immediately destroys
   credibility with any reader who knows the industry.
3. **Suspected currency confusion.** Founder hypothesis: in some
   countries the underlying value is in *national currency* but gets
   rendered with a "$" prefix as if it were USD. A Japanese firm with
   ¥50M revenue showing as "$50M" is the same kind of catastrophe as
   #2 — same wrong number, but with a deeper systemic cause.

The point of this audit is not to "improve accuracy by 10%." The point
is to find the cells that look stupid and *kill or correct them before
a paying customer screenshots one*.

## Scope and constraints

- **In scope:** every visible industry (192) × every covered country
  (≈194), spot-checked at multiple resolutions (national, city,
  sub-industry). Every variable on a cell page: revenue per firm,
  employees per firm, payroll per employee, owner take-home,
  net-profit margin, sample size.
- **Out of scope (for now):**
  - The Smart Waterfall / NetProfitWaterfall breakdown logic. We've
    already audited it. Don't re-do.
  - The industry crosswalk publication (founder explicit: "we cannot
    give away secrets").
  - The blog posts about methodology.
- **Constraint:** read-only against production data. Any corrections
  go through the existing correction-PR flow, not direct DB writes.

## Threat model — what kinds of wrongness are we hunting?

These are the failure modes the audit is designed to detect. Each gets
its own check pass in Phase 2 below.

### Severity-1 (data is *wrong*, not just imprecise)

| # | Failure mode | Example | How we'd detect |
|---|---|---|---|
| T1 | Currency unit confusion (national → USD mis-render) | ¥5M Japanese revenue rendered as "$5M" | Compare reported USD against a reasonable USD bound for the same industry in a similar PPP-adjacent country |
| T2 | Order-of-magnitude scale error | "average software firm in Albania = $500M" | Plausibility bounds per industry, ratio check vs country GDP / GDP-per-capita |
| T3 | Mis-mapped industry (NAICS/NACE collision) | "Restaurants" cell actually carrying "Hotels" data | Cross-check headline number against the sector median in the same country |
| T4 | Stale year stamped as current | 2018 source presented as 2024 | Source-year audit; flag any cell whose underlying year is older than N |
| T5 | Sample-size = 0 / 1 cell published as real | "Average bakery in Tuvalu" with N=0 | Suppress cells below threshold; flag any published cell with N<5 |
| T6 | Negative or zero margin reported as "typical" | "Typical owner take-home = $0" | Margin floors |

### Severity-2 (data is internally inconsistent)

| # | Failure mode | How we'd detect |
|---|---|---|
| T7 | Employees × wage ≠ payroll (within ±20%) | Internal-coherence ratio check |
| T8 | Payroll > revenue (impossible for a healthy firm) | Ratio test, flag any payroll/revenue > 1 |
| T9 | Country-level total ≠ sum of sub-national | Aggregate vs leaf reconciliation |
| T10 | Time series with a single-period spike >5× | YoY delta check |

### Severity-3 (data looks plausible in isolation but breaks under comparison)

| # | Failure mode | How we'd detect |
|---|---|---|
| T11 | Neighbor incoherence | Cluster countries by region + GDP-per-capita; flag any cell more than Nx away from the cluster median |
| T12 | PPP violation | Low-cost country with higher USD revenue than a high-cost neighbor in the same industry |
| T13 | Cross-resolution incoherence | City revenue >> country-rolled revenue for the same industry |
| T14 | Outlier without explanation | Cell flagged as significantly off-pattern but no methodology note |

### Severity-4 (display-layer issues, not data issues)

| # | Failure mode | How we'd detect |
|---|---|---|
| T15 | Number rounded to misleading precision | "$1.0M" when raw was $987K → display tells the same story; but "$1M" when raw was $750K is too generous |
| T16 | Currency symbol wrong in display | Local cell rendering "€" when source was USD |
| T17 | "Estimated" badge missing on a modeled cell | Coverage-tier-chip audit |

## Sampling strategy

We can't manually eyeball ~37,000+ cells (192 industries × 194 countries =
37,248 minimum). We CAN test them programmatically against the rules
above. For human review:

### Stratified manual sample (target: ~600 cells reviewed by eye)

| Strata | Cells | Why |
|---|---|---|
| **G7 × top 20 SMB industries** | 140 | Highest-traffic geography, lowest tolerance for error |
| **EU member states × top 10 industries** | 270 | Currency edge cases (EUR vs local), highest exposure to PPP comparisons |
| **CIS + Balkans × top 10 industries** | 150 | High historical extrapolation quality risk; founder explicit concern |
| **Asia tier-1 (JP/KR/CN/IN/ID/SG) × top 10** | 60 | Currency mis-render risk (non-Latin-script currencies) |
| **Africa top 10 (NG/ZA/KE/EG/MA/...) × top 5** | 50 | Sparse-data, modeled-cell risk |
| **Latin America top 10 × top 10** | 100 | Inflation-heavy currencies (ARS, BRL, VES) |
| **Micro-states (LI/MC/AD/SM/MT/CY/LU) × top 5** | 35 | Sample-size-N=0 risk |
| **Total manual eyeball** | ~600 | |

### Programmatic full-sweep (target: 100% of published cells)

Every cell that the site can render gets the rule-library applied.
Output: a CSV ranked by severity score. The 600 manual reviews are
seeded from the highest-severity rows.

### Cross-resolution sample (target: 100 random country↔city pairs)

Pick a random country×industry, compute the implied city-level
distribution, compare to the published city values. Flag deltas > Xx.

## Sanity-check rule library

Each rule is a function `(cell) → {severity, evidence}`. Rules in
priority order:

### Rule 1: Plausibility bounds (T1, T2)

For each industry, hard-coded USD bounds for typical revenue per firm.
A small bakery should be in `[$30K, $5M]`. A small software firm in
`[$50K, $25M]`. A neighborhood law firm in `[$80K, $20M]`. Etc.

```
flag if revenue_per_firm < industry.min_usd
flag if revenue_per_firm > industry.max_usd × country_multiplier
```

where `country_multiplier` allows reasonable spread (e.g. 3× for US,
1× for Albania).

Source: build the bounds table from US Census County Business Patterns
+ Eurostat SBS small-firm bands. Estimate ~3 hours to compile a first
version covering top 30 industries; iterate.

### Rule 2: Neighbor coherence (T11, T12)

Cluster countries into 12-15 macro-regions (Northern Europe, Southern
Europe, MENA, etc.). For each cell, compute the cluster median for the
same industry. Flag any cell more than 5× the median or less than 1/5.

### Rule 3: PPP coherence (T12)

Compute `revenue_per_firm / GDP_per_capita_PPP` for each cell. Should
cluster within an industry. Outliers > 3 sigma get flagged.

### Rule 4: Internal coherence (T7, T8)

```
flag if abs(employees × payroll_per_employee - total_payroll) / total_payroll > 0.20
flag if total_payroll > revenue
flag if employees < 1
```

### Rule 5: Sample-size threshold (T5)

```
flag with severity HIGH if N < 5
flag with severity MEDIUM if N < 20
```

Cells under `N < 5` should be hidden from default view, full stop. The
Coverage tier should already do this but the audit confirms.

### Rule 6: Source-year freshness (T4)

```
flag if year_published - source_year > 3
```

Founder explicit: Atlas sells "recent data." 2021 data on a page that
loaded in 2026 is a brand problem.

### Rule 7: Cross-resolution (T13)

For each country×industry where we have both country-rolled and
city-level data:

```
expected_country_median ≈ median(city_medians, weighted by city employment share)
flag if abs(actual - expected) / expected > 0.30
```

### Rule 8: Display-layer rendering (T15, T16)

Snapshot test: render the cell to a string, assert it contains the
correct currency symbol per the country's currency. Catches the
case where the symbol is hardcoded "$".

### Rule 9: Margin floor (T6)

```
flag if owner_take_home < 0
flag if owner_take_home / revenue < 0.005   (anyone clearing less than 0.5% of revenue isn't a small-business owner; they're a salaried employee)
```

### Rule 10: Time-series stability (T10)

For cells with multi-year data:

```
yoy = (year_t / year_t-1)
flag if yoy > 5 or yoy < 0.2     (unless a documented one-off)
```

## Tooling

Build these in this order. Each is a separate small TypeScript file
under `scripts/audit/`:

| Order | Script | Output | Effort |
|---|---|---|---|
| 1 | `audit_plausibility.ts` | CSV of cells failing Rule 1 | half day |
| 2 | `audit_currency_rendering.ts` | CSV of cells failing Rule 8 | half day |
| 3 | `audit_internal_coherence.ts` | CSV of cells failing Rule 4 | quarter day |
| 4 | `audit_sample_size.ts` | CSV of cells failing Rule 5 | quarter day |
| 5 | `audit_neighbor_coherence.ts` | CSV of cells failing Rule 2 | 1 day (cluster setup) |
| 6 | `audit_ppp_coherence.ts` | CSV of cells failing Rule 3 | half day |
| 7 | `audit_cross_resolution.ts` | CSV of cells failing Rule 7 | half day |
| 8 | `audit_freshness.ts` | CSV of cells failing Rule 6 | quarter day |
| 9 | `audit_master.ts` | Master CSV combining all flags, severity-ranked | quarter day |

Each script accepts `--country=XX --industry=Y --severity=high` for
narrowing. All write to `delivery/audit/YYYY-MM-DD-<rule>.csv`.

## Output format (the master CSV)

| Column | Type | Notes |
|---|---|---|
| `cell_id` | string | country_iso2 + geo_id + industry_id |
| `country` | string | for sorting |
| `industry` | string | for sorting |
| `geo_name` | string | city or region name if not the country |
| `severity` | enum | SEV1 / SEV2 / SEV3 / SEV4 |
| `rule_id` | string | R1 / R2 / R8 / ... |
| `rule_name` | string | "plausibility-bounds" etc. |
| `current_value` | number | what the cell currently shows |
| `expected_range` | string | "[$50K, $5M]" or "cluster median ± 5x" |
| `delta` | number | how far off the cell is |
| `evidence` | string | one-line human-readable explanation |
| `suggested_fix` | enum | suppress / re-extrapolate / correct-source / display-only-fix |

Triage starts with SEV1 sorted by traffic (i.e. fix California
restaurants before fixing Tuvalu bakeries).

## Phase plan

### Phase 0: Confirm the currency-bug hypothesis (priority: blocker)

Before anything else. The founder explicitly suspects national currencies
are being rendered as USD. If true, this is a SEV-1 systemic bug
affecting potentially thousands of cells. Steps:

1. Trace the data path from `cells_master` / `extrapolated_cells` to
   the page rendering. Identify where currency conversion happens
   (if at all).
2. Pick 10 known-fact cells from non-USD countries (Japan restaurant,
   Germany construction, Brazil software, etc.).
3. For each: extract the raw DB value, the conversion (if any), and
   the final rendered string. Confirm whether the raw value is in
   local currency or pre-converted USD.
4. If pre-converted USD: verify the exchange-rate source and date.
5. If raw local: this is the bug. Patch the rendering layer.

Estimate: 1 day investigation + however long the fix takes if a bug
is confirmed. **Do this first; everything else depends on it.**

### Phase 1: Build the rule library (Rules 1-10)

Tooling phase. ~3-4 days. No data inspection yet, just the scripts.

### Phase 2: First full sweep

Run all 9 rules against all visible cells. Produce master CSV.
Expected output: thousands of flags, mostly SEV3-4. Triage starts.

### Phase 3: SEV-1 fix pass

Walk the SEV1 rows top-down by traffic. For each:
1. Is it actually wrong? (manual eyeball)
2. What's the root cause? (which extrapolation rule produced it,
   or which source has the bad value)
3. Fix: suppress the cell, correct the source, or correct the
   extrapolation logic.
4. Re-run rule to confirm green.

### Phase 4: SEV-2 fix pass

Same loop, lower priority.

### Phase 5: Manual eyeball pass (the 600-cell stratified sample)

Things the rules can't catch — visual judgment, "does this LOOK right
to a human?" — handled here.

### Phase 6: Lock-in

- Convert every rule into a prebuild gate (like `verify_no_em_dashes`)
- Any future cell that violates a rule blocks the build
- Run the master script on every deploy

## Currency bug — specific investigation track

Sub-plan inside Phase 0. Things to specifically check:

1. **`src/lib/format/money.ts`** — `fmtMoney(v, sym = "$")`. The
   default `sym = "$"` is the smoking gun. If callers don't pass an
   explicit symbol, every number gets "$" regardless of country.

2. **Cell page rendering** — every call site that uses `fmtMoney(cell.revenue_per_firm)`
   without a currency symbol parameter. Grep for them. There are
   likely many.

3. **Storage layer** — does `cells_master.rev_p50` store USD or local?
   Same question for `extrapolated_cells.predicted_rev_per_firm`. If
   the answer is "depends on the source country," that's the bug.

4. **Extrapolation pipeline** — when synthesizing a cell for a new
   country, what currency does the synthesized value live in?

5. **Country page CountryAtAGlance** — the new at-a-glance row I just
   built uses `fmtMoney(medianRev)` without a symbol. If `medianRev`
   is in local currency for that country, the rendered "$" is wrong.

6. **Tax overlay** — when the post-tax breakdown waterfall runs,
   does it work in the source currency or USD? If the input is
   local currency and the displayed waterfall claims USD, the chain
   is broken.

The investigation produces a single document at
`docs/strategy/2026-05-24-currency-bug-finding.md` with: confirmed
bug yes/no, blast radius, proposed fix, regression test.

## Other prone-to-error areas (lower priority but worth flagging)

| Area | Risk |
|---|---|
| Employee count vs firm count vs establishment count | Three different denominators get confused, especially for chain businesses (1 firm, many establishments) |
| Owner take-home calculation for non-incorporated firms | The post-CIT logic assumes the firm pays corporate tax; sole proprietors don't |
| Tax overlay for VAT-only countries (Switzerland-ish) | The corporate-tax overlay misses VAT and other regional taxes |
| Sub-industry rollups | When we extrapolate "Restaurants" to a country, what does the implicit sub-industry distribution look like? Worth a sanity check |
| Year-of-data drift | If country A's data is 2024 and country B's is 2021, comparing them is a category error. The Compare tool should warn |
| Cell-page YoY arrows | Some cell pages show YoY arrows. If we don't actually have time-series data for that cell, what's the arrow showing? |
| Featured tile snapshot freshness | `featured_snapshot.json` is baked at build time. If the underlying data changed and we never rebuilt, the homepage is stale |

## Acceptance criteria (when do we declare "done")

The audit is "done" for this sprint when:

1. **Phase 0** complete: currency bug either confirmed-and-fixed, or
   confirmed-not-a-bug, with documented evidence.
2. **Phases 1-2** complete: all 9 rules built and run; master CSV
   produced and committed under `delivery/audit/`.
3. **Phase 3** complete: every SEV-1 row triaged. Outcomes per row
   recorded in the master CSV (fixed / suppressed / accepted-with-note).
4. **Phase 6** complete: at least 3 of the 9 rules wired as prebuild
   gates so future regressions block deploys.
5. **Founder sign-off** on the master CSV summary: the SEV-1 count is
   zero, the SEV-2 count is below an agreed threshold.

Items 4 (the manual eyeball) and 5 (SEV-2 fixes) can spill into
the next sprint without blocking ship.

## What ships out of this sprint (artifacts)

- `scripts/audit/*.ts` — the 9 audit scripts
- `delivery/audit/2026-05-24-master.csv` — flag inventory
- `docs/strategy/2026-05-24-currency-bug-finding.md` — Phase 0 report
- Cell-page rendering fixes (per the master CSV)
- 3+ prebuild gates added to `package.json`
- Updated `2026-05-24-quality-audit-and-reformation.md` cross-linking
  this audit

## Risks and unknowns

- **Risk:** the rule library will have false positives. Especially
  Rule 1 (plausibility bounds) and Rule 11 (neighbor coherence) are
  fuzzy by nature. Expect to spend half of Phase 3 calibrating
  thresholds instead of fixing data.
- **Risk:** some "wrong-looking" cells are actually correct (e.g.
  Luxembourg legal services genuinely averages $5M+ per firm because
  the firm count is tiny and skewed). Manual review is the safety net.
- **Unknown:** the size of the master CSV. Could be 200 flags, could
  be 20,000. The latter implies a much bigger sprint than scoped here.

## Open questions for the founder before execution starts

1. **Plausibility-bounds table:** OK for me to build the first version
   from US/EU benchmarks and iterate? Or do you want to hand-curate?
2. **Suppression authority:** if a cell looks wrong but the root cause
   isn't fixable in this sprint, am I authorized to flip it from
   "displayed" to "hidden" / "estimated"? Or must each one go through
   you?
3. **Sub-industry depth:** do we audit sub-industries (4-digit NAICS)
   or only the parent industries (2-3 digit)? Sub-industries multiply
   the cell count by ~5x.
4. **Vercel quota:** the audit scripts run locally against the DB, so
   they don't hit Vercel functions. Good. But the *re-deploy* after
   any cell fix will trigger ISR revalidations. Worth coordinating
   with the Pro-plan upgrade timing.

---

When you approve this plan, kick off Phase 0 first (the currency-bug
investigation) before anything else. That single answer changes the
shape of the rest of the sprint.
