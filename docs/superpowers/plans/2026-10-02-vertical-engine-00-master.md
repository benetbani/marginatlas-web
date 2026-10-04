# The Vertical Engine (London and the UK): Logic, Formulas and Polish. Master Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This master plan is the specification and the order. Its tasks live in plans 01 to 04, written in full (every code block there was run and passed on 2026-10-02), and in plans 05 to 07, outlined in section 5 and written in full once 01 to 03 have landed, because their code consumes those interfaces.

**Goal:** Replace every curated, constant or invented money figure on the London/UK vertical with a formula a reader can check: exact where the law is exact, honest about rounding where the data are banded, labelled where an estimate is unavoidable, and printed no finer than it is known.

**Architecture:** Four pure layers, each tested to the penny before anything reads it. (1) `src/lib/uk/law`: UK tax, National Insurance, rates, lease duty, redundancy and loans for 2026-27, every parameter in one dated file. (2) `E:/atlas/registers/uk/estimators`: statistics on the registers (band quantiles and means, rounding ranges, rate intervals, survival on current closure rates) feeding the existing table builders. (3) `src/lib/uk/pnl`: the money of one trade in one place, from measured premises, the register's sales and a per-trade recipe, with take-home after tax and a range on every headline figure. (4) `src/lib/uk/present`: how many digits a figure may print, columns, shares, ranks with ties. Pages (plan 06) read only layer 3 and 4 outputs.

**Tech Stack:** TypeScript 5 run by `tsx` (the repo's test idiom: a script printing PASS lines and red findings through `scripts/lib/red`, wired into the gate chain in `scripts/prebuild_all.ts`); Python 3.13 with numpy, scipy and pytest for the registers; Next.js 15 static pages.

---

## 0. What "the vertical" is, and why this plan

The vertical is **London and the UK plus the home page** (product direction of 2026-06-22): `/gb`, `/cities/london`, the 138 trade pages `/gb/london/<trade>`, the UK parts of `/industries/<trade>`, and `/`.

Its money figures today, from the labels audit of 2026-10-02 (`E:/atlas/design/loop/build/research/2026-10-02-labels-audit-uk-pages.md`):

- the owner's take-home is a curated revenue times a curated margin (`src/lib/london/market.ts`), called "after tax" in `src/lib/london/take_home.ts` while no tax is computed;
- the sales band is the typical revenue times 0.5 and 1.8 for every trade (`src/lib/cells/cell_view.ts`, "THE LONDON BAND IS INVENTED");
- 103 trade pages carry a constant "~$675K typical revenue" in their head (`src/app/[country]/[geo]/[industry]/page.tsx`);
- one restaurant's start-up bill is copied onto ten other trades by a parent fallback;
- "Total effective tax burden 20%" is a typed constant (`src/lib/tax/smb_effective_rates.ts`, GB `effective_rate: 0.2`);
- survival is the trade's world-typical shard, not the UK's;
- the engine's own net margins were negative for four of six UK trades and floored at 3%, which manufactured the keeps (money engine finding, 2026-09-04).

The registers now hold what nobody else publishes in this cut (`E:/atlas/registers/uk/tables`), and the law of 2026-27 is researched with URLs and quotes (`research/2026-10-02-pro-sections-uk-law.md`, `research/2026-10-02-guides-hub-and-sources.md`). This plan turns both into formulas.

## 1. What the validation of 2026-10-02 established

Every code block in plans 01 to 04 was written to a scratch copy of the repo layout and run: 450 TypeScript checks pass (law 168, profit and loss 200, presentation 82; counted again on 2026-10-04, after every law and presentation test was hardened against deliberate faults, every review's fixes were in, and the final review's fixes after them), `tsc --strict` is clean, and every new test's red names a file, a rule and a remedy by the gate-reds census's own classifier (20 of 20 scripts). The builder edits were applied in order to fresh copies of the real builders, every table rebuilt, and the Python tests pass on the rebuilt tables (75 since 2026-10-03, when every table was rebuilt again after the reviews of plan 02's tasks: the exported slices changed only where the fixes meant them to, 288 rounding ranges widened to their true extremes, the median's range stored rounded outward, the survival shares stored to twelve decimals and rounded half up, five feed figures moving a tenth to their correctly rounded digit (group 869's 2019 cohort 48.7 to 48.8, restaurants' five-year upper limit 30.0 to 29.9 among them), and plan 03's 200 checks and its registers gate pass on them; 27 of 28 deliberate faults in the builders' new rules fail the tests, the 28th showing on no table today). An independent Python implementation (decimal arithmetic, half-up at the penny) agreed with the TypeScript to the penny on every money figure below.

Validation also corrected two things in the first draft of this plan, recorded so they are not re-made:

- **The profit model held one business's fixed costs constant across the whole sales distribution.** The register's quartiles are different businesses of different sizes, so that printed a London restaurant at the lower quartile losing about 140,000, an artifact. Section 3.14 replaces it with the size rule. A finding that came from the same mistake is withdrawn: "London salon premises cost 29% of sales against the research's 15%" divided the average salon's rent and rates by the median business's sales, two different businesses. On one footing, the average salon's premises cost 16.5% of its occupier's sales.
- **The precision rule rounded to the first power of ten at least the range's whole width**, which printed a take-home of 13,756 (known to 11,534 to 15,558) as 10,000. Section 3.17 uses the measurement convention instead: 14,000.
- **Vehicle repair was given the national rates multipliers.** The official qualifying-uses page names garages (MOT and repair for visiting members of the public) as retail, hospitality or leisure (read 2026-10-03), so the auto-repair recipe takes the 38.2p and 43p multipliers.

The figures the validation produced are findings in their own right:

| Finding | Number |
|---|---|
| The band estimator reproduces the published medians | 4,795 of 4,795 trade x geography medians unchanged |
| Real turnover is not lognormal | the fit is rejected (p < 0.01) in 1,382 of 2,587 cells (3.10); London restaurants p = 1.7e-64 |
| London restaurants' sales, q10 to q90 | 57.5k, 124.6k, 281.9k, 759.1k, 1,923.1k (the invented band said 0.5x and 1.8x of one figure) |
| Rounding is the register's only error: small in London, not in a borough | London restaurants' median 280.7k to 283.2k; Camden's hair and beauty median 74.4k to 80.1k (each count within 2 of the truth, decision 7) |
| Survival on today's closure rates is lower than the 2019 cohort's in most trades | restaurants and food stalls 29.3 of 100 after five years (2019 cohort: 39.1); personal services 43.4 (51.4); London all trades about the same, 38.3 (38.2); other human health activities higher, 52.8 (48.8) |
| The City of London is a registration artefact | on 2024's rates it would top London's five-year survival (47.8) while its 2019 cohort sat in the bottom three (32.5) |
| A sole trader keeps at least as much as a one-director company that pays everything out in the year, at every profit from 1,000 to 400,000 except 60,142 to 60,506 | there the company keeps up to 15.33 more (at 60,249); up to 5,000 the two keep the same; 100k: 69,311.40 against 65,209.63; the company's best salary is 12,570 up to 100k, about 5,000 at 150k, and from about 200k the salary that leaves exactly 50,000 in the company (131,086.96 on 200k) |
| One living-wage hire, all in | 28,308.52 a year; 25,340.84 where the Employment Allowance is claimable |
| Failure rates that can be printed | 117 of 137 trades have 10 or more insolvencies; dental practices' 1.3 rests on 25 cases ("few cases"); indie bookshops' 1.4 on 3 (not printable) |
| The money of seven London trades (3.14, the table in 3.15) | the business at the median keeps 13,756 (restaurants) to 39,216 (dental practices) after tax; 32 to 61 of 100 registered businesses reach the break-even of the average premises' business |
| Grocers do not match their premises | the valuation's 540 convenience stores (369 m2 on average) are not the register's 6,935 grocers: the recipe fails both screens and is withheld |

## 2. Principles: the mathematics of honesty

**P1. Every figure is a function of named inputs, and its kind is the kind of its weakest input.** Kinds: counted (straight from a register), looked up (a price or rule read on a named page on a date), worked out (arithmetic on the first two), estimate (judgement, basis stated).

```
kind(f(x1 .. xn)) = estimate     if any xi is an estimate
                  = worked out   otherwise, once arithmetic is done
                  = kind(x1)     when one input is passed through untouched
```

Arithmetic never launders an estimate (`src/lib/uk/pnl/kinds.ts`).

**P2. A register is a census.** It has no sampling error. Its errors are rounding (counts to the nearest 5), coverage (the 54% of businesses registered for neither VAT nor PAYE are absent) and classification (one code for barbers, hairdressers, nail, brow and lash). A census figure carries a rounding range, not a confidence interval. A sampling-style interval is used only when a figure is read as a propensity ("the chance a restaurant company fails in a year"), a model of the population behind the census.

**P3. Quantiles pass through increasing functions.** If `g` is increasing then `Q_{g(X)}(q) = g(Q_X(q))`. Take-home is increasing in profit (every marginal tax rate is below 100%), and under the size rule profit rises with sales except where the rates law bites faster than sales grow: at the 51,000 step (business rates rise by about 2,448) and, for a trade whose scaled premises cross it, through the small business relief taper (rateable values 12,000 to 15,000), where the whole bill arrives over 3,000 of value (London restaurants lose 3,352.15 of profit between 97,715 and 122,200 of sales; found by the review of plan 03's model on 2026-10-04). So the figure "the business at the median keeps K" is exact, but it equals the median of take-home only where profit rises on both sides: the lower-quartile restaurant (124,596.43 of sales) keeps 6,263.39, more than only 12.5 of 100 registered restaurants, not 25. Pages say "the business at", which is always true, and never "a quarter keep less than".

**P4. Itemised parts are rounded first and summed.** A bill printed as lines adds up to its printed total (`sumPennies`). Shares of a whole are integers that sum to the whole (largest remainder).

**P5. Like for like.** One dimension varies, the other is held: trades in one place, or places for one trade. A member shares the rank of the group above when its interval overlaps that group's leader's; otherwise it starts a new group, whose leader the data can tell apart from the leader above (3.17).

**P6. No clamp manufactures a number.** No margin floor, no fill value, no cap that becomes a figure. A figure that cannot be computed honestly is withheld with its reason.

**P7. Every formula states its invariants and the tests prove them:** continuity where the law is continuous (corporation tax, the relief taper, income tax outside the allowance taper), the steps where the law steps (the rates multiplier at 51,000, the allowance's 40p steps), monotonicity, marginal rates in [0, 1), identities (sales = bill + profit; the two readings of the profit model agree at the anchor).

**P8. Precision follows knowledge.** A figure prints at the place of the leading digit of its uncertainty's half-width, and never past three significant figures (3.17).

**P9. Costs that describe one business describe the same business.** A premises cost, a crew and a level of sales are combined only when they belong to one business of one size (3.14). This is the principle the first draft broke.

## 3. The formulas

### 3.1 Money

`pennies(x)` rounds half away from zero at two places with a 1e-7 penny guard. The guard is needed: 0.03 x 18,544.50 (the pension minimum on a living-wage year) is 556.335 in decimal but 556.33499999999992269... in binary, and times 100 it stays below the half, so plain rounding prints 556.33 where every payroll prints 556.34 (0.15 x 19,784.50 = 2,967.675 survives only by luck: its product times 100 lands exactly on the half). `sumPennies` adds rounded lines as integer pence. `bandedTax(x, bands)` taxes slices, each rounded, summed.

### 3.2 Income tax (rUK, 2026-27)

Personal allowance with the taper (1 pound for every complete 2 pounds of adjusted net income ANI above 100,000):

```
PA(ANI) = 12,570                                        ANI <= 100,000
        = max(0, 12,570 - floor((ANI - 100,000) / 2))   otherwise   (zero from 125,140)
```

The allowance is set against non-savings income first, then dividends. Bands fill in order with taxable non-savings income T_n, then dividends on top:

```
tax_n = 20% x min(T_n, 37,700) + 40% x clamp(T_n, 37,700, 125,140) + 45% x max(0, T_n - 125,140)
dividends: the first 500 at 0% (using band), then 10.75% / 35.75% / 39.35% from position T_n + 500
```

The marginal rate of non-savings income is 0, 20%, 40%, then **60% between 100,000 and 125,140** (each pound of income costs 40p and withdraws 50p of allowance taxed at 40p in the pound), then 45%. The schedule never falls, and inside the taper it is not continuous: each even pound of excess takes a whole pound of allowance at once, a 40p step of tax (12,570 steps from 100,002 to 125,140; over each 2 pounds the tax rises 1.20, the 60%). Everywhere else the last penny before a pound moves the tax by a penny at most; the tests assert both, the steps exactly. The steps matter for the company optimiser (3.5).

### 3.3 National Insurance (2026-27, annual basis)

```
Class 4 (sole trader):          6% x clamp(P, 12,570, 50,270) + 2% x max(0, P - 50,270)
Class 1 primary (employee):     8% x clamp(G, 12,570, 50,270) + 2% x max(0, G - 50,270)
Class 1 secondary (employer):  15% x max(0, G - 5,000)         (under 21 and apprentices under 25: 15% x max(0, G - 50,270))
Employment Allowance:          net = max(0, sum_i er_i - 10,500) for a business that can claim it
```

The allowance is one budget, so its allocation cannot change the bill: `sum_i er_i - min(A, sum_i er_i)` depends only on the sum. A company whose only NI-liable employee is its director cannot claim. Payroll runs on period thresholds; the annual basis differs by about a pound on 30,000, stated.

### 3.4 Corporation Tax (FY2026, one company, 12 months)

```
CT(P) = 19% x P                                   P <= 50,000
      = 25% x P - (3/200) x (250,000 - P)         50,000 < P <= 250,000
      = 25% x P                                   P > 250,000
```

Between the limits `CT(P) = 0.265 P - 3,750`: marginal 26.5%, average rising from 19% to 25%. Continuity at both limits holds only for the fraction 3/200, which plan 01, task 1 reads on the official page.

### 3.5 What the owner keeps, by legal form

Sole trader: `K_st(P) = P - IT(P) - C4(P)`. One-director company extracting everything in the year, salary s:

```
er(s) = 15% x max(0, s - 5,000)            pi(s) = Pi - s - er(s)  >= 0
ct(s) = CT(pi(s))                          d(s)  = pi(s) - ct(s)
K_co(Pi) = max over s in [0, s_max] of  s - ee(s) + d(s) - IT(s, d(s))
```

Outside the allowance taper every schedule is continuous and piecewise linear in s, so `K_co` is too, and its maximum is at a breakpoint or an end: 5,000, 12,570, 50,270, the two salaries that put `pi(s)` on a corporation-tax limit, and `s_max` (kept to the penny); the taper's kinks depend on salary plus dividends and have no name. The search evaluates the named salaries and a 250-pound grid, then refines to the pound around the best four regions at least 1,000 apart (refining only the first winner missed the switch from the 12,570 region to the 5,000 one at 163,281 of profit, by 18p); a brute-force 10-pound grid never beats it, and an independent whole-pound search over every payable salary agrees at 135,000, 163,281, 200,000 and 250,000 (tested). In the marginal relief band a pound of salary (15% employer NI, then 47% at the additional rate) costs less than a pound of dividends (26.5% corporation tax, then 39.35%), so from about 200,000 the best salary leaves exactly 50,000 in the company. Inside the taper `K_co` drops by up to 40p at each even pound of adjusted net income (a sawtooth), which the refine to the pound handles (150,000: 4,996, 14p better than 5,000), so pages print the salary to the nearest 100.

| Profit | Sole trader keeps | Company keeps | Company's best salary |
|---|---|---|---|
| 30,000 | 25,468.20 | 24,403.45 | 12,570 |
| 60,000 | 46,111.40 | 46,091.20 | 12,570 |
| 100,000 | 69,311.40 | 65,209.63 | 12,570 |
| 150,000 | 92,040.40 | 85,321.30 | 4,996 |
| 200,000 | 118,540.40 | 106,022.49 | 131,086.96 (leaves 50,000 in the company) |
| 250,000 | 145,040.40 | 129,065.97 | 174,565.22 (leaves 50,000 in the company) |

Across every profit from 1,000 to 400,000 the sole trader keeps at least as much except in one window, 60,142 to 60,506, where the company keeps up to 15.33 more (at 60,249); up to 5,000 the two keep the same. A first sweep in steps of 1,000 missed the window and said "always"; the task review's step-10 scan found it, and an independent check confirmed it.

Retaining profit in the company, pension contributions and a spouse's salary are out of scope and stated: they are the questions a Pro reader asks next.

### 3.6 One hire, all in

```
allIn = G + er(G) - allowanceUsed + pension(G)
pension(G) = 3% x max(0, min(G, 50,270) - 6,240)   when aged 22 to State Pension age and G > 10,000
```

Worked: the living wage at 37.5 hours, 52 weeks: 24,784.50; employer NI 2,967.68; pension 556.34; all in 28,308.52, or 25,340.84 with the allowance (which covers 3.54 such staff). Sick, maternity and paternity pay are contingent; employers' liability insurance has no official price; both stay outside the yearly figure, stated.

### 3.7 Business rates (England, 2026-27, RV < 500,000)

```
m(RV) = 38.2p (retail, hospitality, leisure) or 43.2p,  RV < 51,000
      = 43p or 48p,                                      51,000 <= RV < 500,000
f(RV) = 1 (RV <= 12,000);  (15,000 - RV) / 3,000 (12,000 < RV < 15,000);  0 (RV >= 15,000)
bill  = RV x m(RV) x (1 - f(RV))
```

`f` is continuous; `m` steps: at 51,000 a bill rises by about 2,448 for one pound of value (51,000 x 4.8p). Read on 2026-10-03 (`docs/uk-law/2026-27-readings.md`): relief applies at the 38.2p multiplier (the official pages support it and a billing council states it); hair and beauty salons, restaurants, bakers and cafes, gyms and garages qualify as retail, hospitality or leisure, and dentistry is excluded. Garages were the plan's one wrong expectation; the auto-repair recipe now takes the 38.2p and 43p multipliers.

### 3.8 Tax on a lease's rent

```
NPV = sum_{i=1..n} r_i / 1.035^i,  r_i for i > 5 = the highest of r_1 .. r_5
SDLT: 0% to 150,000, 1% to 5,000,000, 2% above;   LTT (Wales): 0% to 225,000, 1% to 2,000,000, 2% above
```

25,000 a year for 10 years: NPV 207,915.13, SDLT 579.15; for 5 years, NPV 112,876.31, nothing.

### 3.9 Redundancy, notice and loans

Redundancy: two whole years needed; each of the last (up to) 20 years earns 0.5, 1 or 1.5 weeks by the age held throughout it (under 22, 22 to 40, 41 and over); a week's pay capped at 751; the maximum 22,530. Notice: none under a month, one week to two years, a week per whole year to twelve. A loan of A at annual rate R over n months: `A r / (1 - (1 + r)^-n)`, `r = R / 12`; 25,000 at 7.5% over 60 months is 500.95 a month.

### 3.10 Sales from the register's turnover bands

The register gives counts n_1 .. n_10 in bands [L_k, U_k): 0-50k, 50-100k, 100-250k, 250-500k, 500k-1m, 1-2m, 2-5m, 5-10m, 10-50m, over 50m. Inside a band, sales are read as log-uniform:

```
Q(q) = L_k (U_k / L_k)^((qN - C_{k-1}) / n_k)     for the band where the cumulative count first reaches qN
F(x) = (C_{k-1} + n_k (ln x - ln L_k) / (ln U_k - ln L_k)) / N
```

The first band is floored at 5k and the open top band capped at 100m; a quantile in either prints only as "under 50k" or "over 50m". F inverts Q exactly (tested).

**Rounding range.** Each count is within 2 of the truth: a whole count rounded to the nearest 5 (decision 7, ruled 2026-10-04; the plans first used 2.5, the bound for a count that could be fractional). The quantile is the smallest x with `sum_k c_k (G_k(x) - q) >= 0`, `G_k(x)` the share of band k below x; for any x that sum is linear in the counts, so its largest value over the box of possible counts sits at a corner where every band below some m is high and every band from m on is low. The range is the smallest and largest quantile over those 22 threshold corners, which equals trying all 1,024 (tested). The first draft split the corners only at the band holding the printed quantile and missed the extreme in 288 of the 2,597 cells of the London table (its boroughs, London and England), wherever the quantile can move to another band (five businesses a band with an empty band between: 136k to 1,587k where the counts allow 100k to 5,612k).

**The anchor mean**, used by the size rule (3.14): the mean sales of the businesses in bands 1 to 7 (below 5m, because an enterprise above 5m is mostly a chain whose turnover is every site's). Each band contributes its mean under a shape:

```
log-flat (density ~ 1/x, the quantiles' reading):  (U - L) / ln(U / L)       the logarithmic mean Lm
flat     (density ~ 1):                             (U + L) / 2               the arithmetic mean
Pareto   (density ~ 1/x^2, a right-skewed tail):    L U ln(U / L) / (U - L)   = G^2 / Lm, G = sqrt(L U)
```

Since G <= Lm <= (L + U)/2 (the classic mean inequality), Pareto <= G <= log-flat <= flat in every band: the three bracket the plausible shapes. Hard bounds (every business on its band's lower or upper edge) hold whatever the shape. London hair and beauty: 130.83k, 139.41k, 148.44k (hard bounds 88.46k to 207.18k); restaurants 566.21k, 597.44k, 629.47k.

**Why not a fitted curve.** A lognormal fitted by maximum likelihood to the interval-censored counts, `ln L = sum_k n_k ln(Phi((ln U_k - mu)/sigma) - Phi((ln L_k - mu)/sigma))`, recovers a true lognormal from rounded counts to within 0.1% (tested), and the G-test (10 - 1 - 2 = 7 degrees of freedom: an empty band is still a cell of the fit) rejects it in 1,382 of 2,587 real cells (on the unrounded p; the stored three-figure p reads 0.01 for three of them): chains make the top far heavier. The fit stays in the tables as a model check (`lognormal_fit_p`), never on a page.

### 3.11 Rates and their intervals

A year's insolvencies x among N live companies, read as a risk:

```
Wilson 95%:   centre (p + z^2/2N) / (1 + z^2/N),  half-width z sqrt(p(1-p)/N + z^2/4N^2) / (1 + z^2/N),   p = x/N
Garwood:      [chi2(0.025; 2x)/2, chi2(0.975; 2x+2)/2]   for a count alone
RSE:          1 / sqrt(x)
```

Printed when x >= 10 (RSE <= 32%), marked "few cases" from 10 to 29. A duel (the highest against the lowest) uses the pooled two-proportion z-test; the home page compares 24 pairs, so p-values are Holm-adjusted (sort ascending, multiply the i-th smallest by m - i + 1, keep non-decreasing, cap at 1). Restaurants (1,259 of 43,634) against dental practices (25 of 18,790): z = 22.2, the largest adjusted p of the 24 pairs 6.4e-25.

### 3.12 Survival: cohort or current rates

For cohort c, `s_c(t)` businesses still trade t years on; `h_c(t) = 1 - s_c(t)/s_c(t-1)`. The figure a would-be owner needs is survival on today's closure rates (a period life table):

```
h_t = h_{c(t)}(t), c(t) = the newest cohort with both t-1 and t observed
S(t) = prod_{j<=t} (1 - h_j)
Var S(t) ~ S(t)^2 sum_{j<=t} h_j / (n_j (1 - h_j))       (Greenwood; n_j = at risk at the start of year j)
```

With the 2024 tables every h_t is calendar 2024's. Printing each horizon from its own latest cohort mixes cohorts and can rise (tested). Restaurants: 29.3 on 2024's rates against 39.1 for the 2019 cohort; on 2024's rates the chance of closing in each of years two to four is 0.25 to 0.28. Pages print the period figure and the 2019 cohort's once beside it. Shares are stored to twelve decimals and rounded half up, so a page rounds once (stored to six, restaurants' five-year upper limit 0.29949967 printed 30.0 for 29.9). The City of London is flagged in the table as never ranked, with the reason: on 2024's rates it would top London's five-year survival (47.8) while its 2019 cohort sat in the bottom three (32.5).

### 3.13 Densities and their denominators

`per 10,000 = 10,000 x local units / residents`, numerator and denominator for the same place and year: the 33 boroughs' mid-2024 population (a new fetch, section 6). The city page's "371 per 10,000" divides 531,000 modelled firms by the 14.3 million metro: both halves wrong. Local units (premises) count shops on streets better than enterprises (registered offices).

### 3.14 The money of a trade in a place: the size rule

The register's quartiles are different businesses of different sizes, so one business's fixed costs cannot be carried across them (P9). Two readings of one set of costs answer two different questions.

**Inputs.** The register's bands (counted); the anchor sales A, the log-flat anchor mean (3.10, worked out); the average premises of the trade's kind in the place, area = floorspace / count and rent proxy RV_A = rv_per_m2 x area (the valuation's estimate of a year's rent at April 2021, worked out); from the recipe (3.15), a variable share v (each pound of sales spent on goods, supplies, commission, delivery fees) and a sized share s (staff and running costs), both estimates.

**The size rule.** Across businesses, premises, staff and running costs grow in proportion to sales, anchored where the premises are measured: under it, the business with sales A occupies the average premises (mean area goes with mean sales when area is proportional to sales and one enterprise has one site, which the 5m cut approximates).

**Across businesses** (what owners of different sizes keep), for sales R:

```
RV(R)  = RV_A x R / A                              the business's rent proxy
rates  = rates(RV(R))                              the law (3.7) on its own value: small business relief and the 51,000 step apply
P(R)   = R - v R - s R - RV(R) - rates(RV(R))      every line rounded first (P4)
K(R)   = P - tax(P) when P > 0;  P when P <= 0     by legal form (3.5); a loss stays a loss, untaxed
figures: K(Q(0.25)), K(Q(0.5)), K(Q(0.75)), "the business at each sales quartile"; margin at the median P(Q50)/Q50
```

**One business, short run** (break-even: the business in the average premises cannot shed its crew when sales dip):

```
F_A        = s A + RV_A + rates(RV_A)              its fixed costs a year
R*         = F_A / (1 - v)                         its break-even sales
share      = 1 - F(R*)                             the registered businesses taking at least that
```

At its own sales the readings agree, `P(A) = (1 - v) A - F_A` (tested). For the barbershop, P is increasing except at the rates step: a sweep from 10k to 1m finds the only falls exactly where the scaled value crosses 51,000 (tested). It is not so for every trade: where the scaled premises cross the relief taper (rateable values 12,000 to 15,000), profit falls there too (restaurants, sports and fitness, dental practices; P3). The marginal view a lever shows: one more pound of cost a year takes `1 - tau'(P)` from the owner (at the median barbershop, 1,000 more costs the owner 740).

**Ranges.** The band shape (3.10) sets the anchor, the register's quartiles and the share above break-even, so every headline figure is recomputed with all of them read under each of the three shapes (`ranges.ts`; decision 9, ruled 2026-10-04: consistent ranges); the log-flat run is the figure, the other two its range, and the range sets its print (3.17). On London the anchor moves about 6% either way; break-even rests on the anchor alone, so its range is the anchor's. The hard bounds would be uninformative (the median restaurant from a loss of 13,568 to keeping 24,772, a profit of 29,059), which is why the shapes, not the bounds, set the range.

**Worked, London barbershops** (the hair and beauty code's bands; the average salon 60.8 m2, RV 16,657.95, rates 6,363.34; A = 139,406.36): the average salon's business has fixed costs of 39,750.05 and breaks even at 64,112.98 (62,453 to 65,861 across shapes); 61 of 100 registered businesses take that. The business at the median takes 78,625.81, occupies a 34 m2 share of the average salon at a rateable value of 9,395.16, which small business relief clears of rates, and keeps 25,407.33 after tax (23,743 to 26,986 across the shapes, its own sales 74,243 to 82,654), which would print 25,000 (its recipe lumps utilities with rent, so no page prints the barbershop's money until plan 07; 3.15).

### 3.15 Recipes: research shares by one protocol

A recipe is built from the trade's research file (`data/facts/industry/<trade>.json`, its cost drivers as shares of sales) by a written protocol (`src/lib/uk/pnl/recipes.ts`): each driver takes exactly one class (variable; commission, counted only on the employed producers because the owner's chair is paid by the profit; premises, dropped because rent and rates are measured; sized); the owner's pay is never a line; `utilitiesCarried` is true only when a driver other than the premises one names utilities. The recipe gate proves the protocol from the research file itself and screens the London result: at least a quarter of registered businesses reach break-even (a trade whose average premises needs more than three in four of its businesses take is a mismatch, not a finding), and the median business's margin lies in (0, 60%).

Seven trades pass (London, sole trader, slices of 2026-10-02):

| Trade | Average premises (valuation) | Break-even, average premises' business | Above it | Margin at the median | Business at the median keeps | Utilities carried |
|---|---|---|---|---|---|---|
| barbershops | 61 m2, RV 16,658 | 64,113 | 61 of 100 | 38.1% | 25,407 (23,743 to 26,986) | no |
| nail-salons | 61 m2, RV 16,658 | 68,806 | 57 of 100 | 29.7% | 20,559 | yes |
| restaurants | 203 m2, RV 73,375 | 556,017 | 32 of 100 | 5.0% | 13,756 (11,198 to 16,056) | yes |
| bakeries-retail | 90 m2, RV 27,956 (cafes) | 351,741 | 36 of 100 | 16.8% | 30,399 | no |
| sports-fitness | 305 m2, RV 55,732 | 275,028 | 34 of 100 | 23.3% | 30,960 | yes |
| auto-repair-shops | 261 m2, RV 26,342 | 213,360 | 39 of 100 | 21.6% | 29,164 | no |
| dental-practices | 144 m2, RV 45,605 | 198,711 | 47 of 100 | 26.5% | 39,216 | no |

Margins exceed the research files' net margins for a reason that is the point: the owner's own labour is in the profit (the research pays a wage to every chair), and research "net" is after tax and depreciation. Where utilities are not carried (the research lumps them with rent), the margin is overstated by them, a few per cent of sales, until plan 07's energy line; until then a page prints no money for those four trades. The London loader withholds with a reason, data first: no bands for the trade's code; no kind of premises (hotels, bars, cleaners); premises valued in one of the valuation's three bulk classes, shops, offices, or factories, workshops and warehouses (dry cleaners, accountants, cabinet makers: an average over unlike occupiers); under 100 premises of the kind (veterinary clinics: the valuation's rounding moves the average area by more than a tenth); or no recipe (grocers, food trucks).

The premises and the businesses are different counts of different things, and the ratio says how well the anchor can match them: valuation premises over register local units in London are 0.85 for restaurants, 1.04 for surgeries, 1.26 for bakeries (valued as cafes, a wider kind), 0.34 for vehicle repair, 0.29 for gyms, 0.18 for salons (most hair and beauty businesses have no salon of their own) and 0.06 for convenience stores (which is why grocers fail).

### 3.16 What it costs to open

```
capex = area x fit-out per m2 + equipment (supplier prices) + deposit months x rent / 12
      + registrations and licences (looked up) + opening stock + marketing + k months of F_A (working capital)
```

Each line carries its kind; a range is the sum of the low lines and the sum of the high lines (conservative, no correlation assumed). This replaces the New York-index table printed unadjusted on about 83 trade pages. Specified here; built in plan 06 with the research per trade.

### 3.17 Comparison and presentation

- **Honest unit (the measurement convention).** A figure with range [lo, hi] prints at the place of the leading digit of its half-width, `u = 10^floor(log10((hi - lo)/2))`, never past three significant figures. The printed figure lies within its range widened by half a unit. London restaurants' median 281.9k (280.7k to 283.2k) prints 282,000; Camden's 76.4k (74.4k to 80.1k) prints 76,000; the median restaurant's take-home 13,756 (11,198 to 16,056) prints 14,000; an exact law figure prints three significant figures on a card and its pennies in an itemised bill.
- **One decimal count per column** (MODEL PART 5).
- **Largest remainder** for shares of a whole.
- **Ranks with ties:** a member is level with the group above when its interval overlaps the interval of that group's leader; overlap is conservative (non-overlapping 95% intervals imply p below about 0.006 for equal standard errors, up to about 0.05 when one error is a hundred times the other). By construction every member overlaps its own group's leader, no leader overlaps the leader above, and a rank never improves down the list; it is a rule about leaders, not every pair (28.9, 12 and 11 with intervals 27.3 to 30.5, 11 to 13 and 2 to 29 rank 1, 2, 2), so a page marks the top group by rank. Members with the same figure are taken lowest-reaching interval first, then highest-reaching, so no rank depends on the order of the rows.
- **Set statistics without fills:** a set's median uses members whose figure is their own; fills are counted and left out (PART 9 clause 46).
- **Placement in tenths** (`src/lib/spine/placement.ts`, unchanged): `n = floor(10 x strictly lower / total)`, ties not lower, clamped to nine; already defended by `tests/spine/placement.test.ts` over every pair up to 200 members.

### 3.18 Owners' own numbers (specification for plan 05)

Groups publish at 10 reports or more, with no report above half the group's total (dominance). Banded answers (sales, owner pay) use 3.10's estimator on the group's band counts; numeric answers use the Harrell-Davis quantile, a weighted average of order statistics with weights `W_i = I_{i/n}(a, b) - I_{(i-1)/n}(a, b)`, `a = q(n+1)`, `b = (1-q)(n+1)`, `I` the regularised incomplete beta (smoother than one order statistic at n = 10 to 30). A report more than 4 x 1.4826 x MAD from its group's median is held for review. Figures print as the 25th, 50th and 75th percentiles to two significant figures, never a mean, minimum or maximum; a borough falls back to London and then the UK with the step named.

## 4. The figure inventory of the vertical

| Page | Figure | Today | Target formula | Kind | Plan |
|---|---|---|---|---|---|
| trade (138) | head: typical revenue | constant 675K on 103 | register median (3.10), honest unit (3.17) | worked out | 02, 04, 06 |
| trade | sales a year | 0.5x and 1.8x | q25, q50, q75 (q10, q90 where not in an open band) | worked out | 02, 03, 06 |
| trade | firms trading here | curated, tagged measured | register enterprises and local units | counted | 06 |
| trade | margin, owner keeps | curated margin x revenue, no tax | 3.14 with a recipe, after tax by form, with its range | estimate | 01, 03, 06 |
| trade | break-even, share above it | none | 3.14 | estimate | 03, 06 |
| trade | how many survive | world shard | period survival of the trade's group (3.12) | worked out | 02, 06 |
| trade | failures a year | none | rate with interval (3.11) | worked out | 02, 06 |
| trade | cost to open | NYC index, copied bill | component sum (3.16) | estimate | 06 |
| trade | licences | US-style list | UK guides' steps | looked up | 06 |
| country | tax burden | constant 20% | 3.5 at the trade's median profit, both forms | worked out | 01, 06 |
| country | a full-time hire | NI only | 3.6 | worked out | 01, 06 |
| country | start-up loan | lever (correct) | 3.9, moved into the law engine | worked out | 01 |
| country | world medians | fill values | 3.17 | worked out | 04, 06 |
| city | businesses per 10,000 | modelled firms over the metro | 3.13 | worked out | 06 |
| city | rent by district | multipliers | valuation statistics per borough | worked out | 06 |
| city | survival by borough | none | 3.12, City of London excluded | worked out | 02, 06 |
| home | the editorial feed | built 2026-10-02 | 3.11 and 3.12 applied | worked out | 02 |

## 5. The plans and their order

| Plan | File | Builds | Depends on | Done when |
|---|---|---|---|---|
| 01 | `2026-10-02-vertical-engine-01-uk-law.md` | the readings; `src/lib/uk/law/*`; ten gates | nothing | 168 law checks pass in the chain; the readings recorded and matching |
| 02 | `2026-10-02-vertical-engine-02-register-statistics.md` | `registers/uk/estimators/*`, builder edits, rates, the feed, drafts, the export | nothing | 75 pytest tests pass on rebuilt tables; 4,795 medians unchanged; the ledger and pack describe the printed figures |
| 03 | `2026-10-02-vertical-engine-03-profit-and-loss.md` | the slices and their gate; `src/lib/uk/pnl/*` | 01, 02 | 193 checks across 7 test files and the `uk-registers` gate, each planted and green |
| 04 | `2026-10-02-vertical-engine-04-presentation.md` | `src/lib/uk/present/*` | nothing | 81 presentation checks pass |
| 05 | owners' numbers statistics (outline below) | `src/lib/uk/owners/*`, the aggregate view | the owner-numbers schema (SPEC-2026-10-02) | written after 03 |
| 06 | the vertical wired (outline below) | the truth rows on the pages, through builders | 01 to 04 | written after 03; verified on renders when the browser tools return |
| 07 | the energy line (outline below) | a measured utilities line for the trades whose research lumps it with rent | 03, a reading or download (section 6) | written after 03 |

Plans 01, 02 and 04 can run in parallel; 03 needs 01 (the law) and 02 (the export).

**Plan 05, outline.** `src/lib/uk/owners/percentiles.ts`: `bandPercentiles(counts)` reusing `pnl/banded.ts`; `harrellDavis(values, q)` with the regularised incomplete beta by a continued fraction; `dominance(values)` (max over sum <= 0.5); `madOutliers(values, k = 4)`; `publishable(group)`. Tests with hand-computed Harrell-Davis values for n = 10 and 20, cross-checked against `scipy.stats.mstats.hdquantiles`. The aggregate view computes only these outputs.

**Plan 06, outline.** One task per truth row of QUEUE section I, each a builder change with a pure-function test, then a render check: (a) the trade head reads the register median through `honestRound`, never `revenue_per_firm` (`src/app/[country]/[geo]/[industry]/page.tsx:273`), computing the median from the slice's band counts (`bandQuantile`), not the table's median stored to £100, so it is rounded once (a stored figure rounded again to the 1,000 prints about one median in twenty a thousand off), and a median below 50k or above 50m (`in_open_band`) prints only in words; (b) the parent-fallback bill is withheld unless the held bill's trade is the page's trade; (c) the sales strip prints the register quartiles computed from the slice's band counts (rounded once, as in (a)) with the open-band words, and a quartile in an open band prints no money for its business either (its sales rest on the floor or the cap; `PnlSummary.sales.open` says which, and the barbershops' and nail salons' lower quartile, 50.17k, is 25 businesses from resting on the floor); (d) "how many survive" reads `survival.json`'s period curve with the 2019 cohort beside it, and ranks only the boroughs (E09 codes) whose `ranked` is true (not the City of London, which says why; London's own row also says `ranked: true`, and it is the whole, printed beside a borough ranking, never in it); (e) the hero's tax figure is `K_st` and `K_co` at the trade's median profit; (f) London is Greater London (`E12000007`) everywhere; (g) a trade prints money only when `londonWithholding(slug)` is null and its recipe carries utilities, otherwise it says why once, in the page's honesty line; (h) money figures print `honestRound(mid, lo, hi)` from `londonTradeRanges`; (i) a contract test for the new engine beside `take-home-identity`: keeps never exceed profit, profit plus the bill equals sales (the existing gate's Part B does not see the new modules, which derive take-home from tax, not from a margin). Render checks wait for the browser tools. A page must also carry what the money modules cannot: the register's match for the trade (barbershops and nail salons read one shared code, 96020, every hair and beauty business: the figure is the code's, and the page says so); the range covers the band shape only, while a recipe's shares move a figure more (counting the barbershop's apprentice moves its keeps by 8.6%, more than the band shapes' 6.6% below and 6.2% above), so the word "estimate" stays beside the digits; the outer quartiles' keeps carry no range of their own; and the four trades whose recipes lump utilities with rent print no money until plan 07 ((g) holds that rule, not the modules). Found on the way, for its truth pass: the feed's "youngest" and "kitchens score five" shares are stored to three decimals and printed as whole percentages (stored one place finer than printed: about one figure in twenty a point off; toy stores' 0.525 prints 52 or 53 by the rounding rule, and neither is known true), so they need the counts; the food tables' caveats name their source and reach the ledger, so About the figures waits for R-002; the demography workbook's multiple-registration mark (Camden, Hackney, Islington in every cohort) is dropped by the builder and belongs in the page's honesty line. Found by the final review (2026-10-04): the feed's takings item and its draft print London medians to the 100, four significant figures, where 3.17 allows far less (hotels' 787.2k is known to 30.3k either side and prints 790,000) and P5 ties the top two (pharmacies' 781.8k, 18.2k either side): the takings rows carry no range (the rate and survival rows do), so give them `median_range_k` when the feed is exported to the website, and print every feed and draft figure through 3.17 and P5; rates per 1,000 and survival shares print one decimal per column (P8 with the column rule: dental practices' 1.3, 0.9 to 2.0, needs the decimal), which `honestRound` cannot give, its units stopping at 1; the London business rate supplement, out of scope in `business_rates.ts` ('above 75,000'), reaches the restaurants' upper quartile (scaled rateable value 93,232): at 2p in the pound it costs 1,864.64 a year and the business keeps 26,815.76, not 28,195.60 (26,800, not 28,200, printed), so read its 2026-27 rate and threshold and add it, or print no money for a London business above the threshold; a sales lever stops below a scaled rateable value of 500,000 (`businessRates` refuses it; the barbershop reaches it at 4.18m of sales); a lever printing whole pounds rounds the exact repayment once, not `annuity().monthly` again (7,500 at 6% over a year: 645.4982 prints 645, its 645.50 would print 646); before a page prints a tapered rates bill, read the small business rate relief order on whether the taper is continuous (dental practices' lower quartile, at a scaled 14,108, is the first such figure), and before a page states Employment Allowance eligibility, settle the director rule's reading (the law engine takes it as `canClaim`).

**Plan 07, outline: the energy line.** For the four trades whose research lumps utilities with rent (barbershops, bakeries, auto repair, dental), `utilities(R) = area(R) x (e_elec x p_elec + e_fuel x p_fuel)`: area from the size rule, energy use per m2 for the valuation's kind of premises (the government's non-domestic energy statistics, matched by premises category), prices per kWh for small non-domestic users (the government's quarterly energy prices). A reading task records each value with its page and date; a test proves the arithmetic on synthetic inputs; the recipes then carry `utilitiesCarried: true` and the gate's expected figures are recomputed in Python first.

## 6. Prerequisites, data and approvals

| Need | For | Status |
|---|---|---|
| Mid-2024 population of the 33 boroughs (Nomis NM_2002_1, OGL) | 3.13 densities | a new download: needs his OK |
| UK Annual Business Survey by SIC (turnover, purchases, employment costs; OGL) | recipes from UK shares instead of the research files' (mostly US) shares | a new download: needs his OK |
| Non-domestic energy use per m2 by premises type, and small-business energy prices | plan 07 | a reading, or a download if only a file holds it: his OK if so |
| ASHE by occupation and region (OGL) | wages where a recipe needs them | a new download: needs his OK |
| Valuation statistics for the 2026 list (April 2024 values), when published | the rent proxy's date | watch |
| His free Companies House API key | survival by detailed trade and district | asked before |
| The readings of plan 01, task 1 | the corporation-tax fraction, rates multipliers and relief, which trades qualify as retail, hospitality or leisure | done 2026-10-03: every value matches; garages qualify (the plan expected not) |

## 7. Decisions that are his

1. **The headline figure on a trade page.** Recommendation: "a business needs X a year to carry the average London [premises]; Y of 100 registered businesses take that" as the headline, with the business at the median's take-home beside it and the quartiles under the plus. The break-even pair holds up best across the band shapes and says the most a would-be owner needs.
2. **Which legal form the take-home uses.** Recommendation: the sole trader's (the commonest form for these trades), the company's under the plus.
3. **Printing "a company that pays everything out keeps less than a sole trader".** True at every profit from 1,000 to 400,000 on the 2026-27 law except a window of 365 pounds of profit around 60,000 where the company leads by at most 15.33 (3.5), and against common advice (which assumes profit left in the company). It assumes the director is the company's only employee, so no Employment Allowance; a company with staff can claim it, which narrows the gap (the median barbershop's company owner keeps 25,164.87 with it, 24,343.99 without, against the sole trader's 25,407.33). Recommendation: two figures, never a sentence that says always.
4. **Survival, period or cohort first.** Recommendation: period (what a new owner faces), the 2019 cohort's once beside it.
5. **Currency on UK pages.** The engine works in pounds; recommendation: pounds on UK pages, the dollar under the plus at one dated rate.
6. **The downloads in section 6.** Recommendation: the Annual Business Survey first (it replaces the research shares with UK ones for every trade at once), then the borough population.
7. **How far a rounded count can be from the truth. RULED 2026-10-04: 2.** The register's counts are whole numbers rounded to the nearest 5, so each is within 2 of the truth (2.5 is the bound for a count that could be fractional, the cautious margin the plans first used). Every rounding range narrowed (London restaurants 280.3k to 283.5k became 280.7k to 283.2k; Camden hair and beauty 73.9k to 81.1k became 74.4k to 80.1k, both still printing 282,000 and 76,000), and 299 of the London table's 2,597 medians (its boroughs, London and England) print one digit finer, 260 of them as a different figure.
8. **Which total the 40-business rule reads. RULED 2026-10-04: the register's own total**, as built. In 83 cells that pass, the ten band counts (each rounded to 5 on its own) sum to under 40; the published count decides.
9. **How wide a money figure's range is. RULED 2026-10-04: consistent ranges.** Each band shape is read through the anchor, the register's quartiles and the share above break-even together. Every take-home range widened (break-even's does not move, since it rests on the anchor alone, and the share above can narrow: restaurants 32.1 to 32.4 of 100 instead of 31.3 to 33.0): the median barbershop's take-home 23,743 to 26,986 instead of 24,952 to 25,830 (it would print 25,000, not 25,400); nail salons 19,165 to 21,889; restaurants 11,198 to 16,056 instead of 11,534 to 15,558 (still 14,000).

## 8. The verification standard

A formula ships when: (1) every worked example from its official page reproduces to the penny; (2) an independent implementation (Python for the law and the money, TypeScript for the statistics) agrees to the penny on the same inputs; (3) its invariants are swept (continuity, monotonicity, identities); (4) every gate that guards it has been planted with its fault and gone red. The scratch validation of 2026-10-02 did (1) to (4) for plans 01 to 04 (the plants: the rounding guard removed, a recipe share changed, a grocery recipe added, a register slice edited by hand, a module removed); each plan's steps repeat the plants in the repository.

## 9. What this engine cannot see, stated once

Businesses outside the registers; a business whose costs differ from its recipe; the recipes' shares themselves (estimates from research files, mostly not UK); premises whose size does not follow sales (the size rule's assumption); the match between the valuation's premises and the register's businesses (different counts of different things, 3.15); Scottish income tax; corporation-tax limits for associated companies and short periods; transitional rates relief and the London supplement; utilities for the four trades that lump them with rent (until plan 07); rent after April 2021 until the 2026 list's statistics land. Each appears in the module that would need it, never in a card.
