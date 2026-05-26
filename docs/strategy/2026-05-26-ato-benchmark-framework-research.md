# ATO small-business benchmarks: framework lessons for Margin Atlas

**Date:** 2026-05-26
**Source:** Australian Taxation Office, "Benchmarks A-Z" + "Types of benchmarks" + "Benchmarking methodology" + "How we calculate benchmark ratios" + "Industry benchmarks for Taxation statistics 2022-23". Live URLs at the bottom.
**Status:** Research — proposes additions to Margin Atlas, does not change existing surfaces yet.

## 1. What the ATO actually publishes

The ATO's "Small Business Benchmarks" is a public, free, tax-return-derived dataset covering ~100 industries and over 2 million Australian small businesses. The most recent release uses 2023-24 tax-year data, updated annually.

### 1.1 Sector top-level groupings (9)

The A-Z list is internally organised into nine parent industry groups:

1. Accommodation and food
2. Building and construction trade services
3. Education, training, recreation and support services
4. Health care and personal services
5. Manufacturing
6. Other services
7. Professional, scientific and technical services
8. Retail trade
9. Transport, postal and warehousing

This is a slimmer taxonomy than Margin Atlas's 20-visible-sector taxonomy. They have collapsed agriculture into "Other" and absorbed most of finance/real-estate (because the ATO benchmarks are an audit-risk tool, and those industries report differently).

### 1.2 The five "key benchmark" ratios

Every industry gets a published table of these five ratios. All are expressed as a percentage of turnover (revenue ex-GST):

| ATO ratio | What it measures | Margin Atlas equivalent today |
|---|---|---|
| Cost of sales / turnover | Variable input costs as a share of revenue. Excludes labour. | `cogs_share` in industry_cost_profile_v1.json |
| Total expenses / turnover | All operating expenses. Used as the fallback when COGS isn't separately reported (e.g., pure-service businesses). | Inferred: 1 minus net-margin |
| Labour / turnover | Wages + super + payroll tax, as a share of revenue. | `labor_share` |
| Rent / turnover | Lease/rent payments as a share of revenue. | `rent_share` |
| **Motor vehicle expenses / turnover** | Fuel + lease + servicing + depreciation on vehicles. | **Not in MA cost stack today.** |

### 1.3 The "key benchmark" concept (this is the structural insight)

For every industry, the ATO designates **one** of the five ratios as the *key* benchmark — the one most predictive of that industry's true turnover. For restaurants, cafés, retailers, bakeries — businesses with high variable input cost — it's COGS/turnover. For trades, services, agencies — businesses where the people *are* the cost — it's Total expenses/turnover.

Why this matters: an operator who looks at five ratios at once gets paralysed. Picking one *headline* ratio per industry gives the reader a single answer to the question "am I roughly normal?" The other four ratios act as supporting evidence when they cluster around the right neighbourhood.

### 1.4 The turnover-band framework

Every industry's benchmark table has three turnover bands (the exact thresholds differ by industry; common shape is something like ≤$300K / $300K-$1M / $1M+). Within each band, the published "key benchmark range" is the middle 30% of businesses, centred on the average. So a restaurant in the $300K-$1M band sees: "your COGS should be 33-37% of turnover; average is 35%".

**This is fundamentally different from Margin Atlas's size_band, which is an employee-count slice (1-4, 5-9, 10-19, 20-49, 50-249, 250+).** The two are correlated but not identical, and they answer different questions. Employee-count bands answer "how big is this firm?" Turnover bands answer "how much revenue does this firm move?" An operator opening a coffee shop cares about both, but for *benchmarking* — am I normal? — turnover bands are the more actionable axis because revenue is what the operator can directly measure on day one.

### 1.5 Methodology

- **Source:** Aggregated, anonymised lodged tax returns + activity statements. Australian Business Number (ABN) required, valid lodgement required.
- **Range construction:** 30% of the population around the per-band average. Industry-specific factors (clusters, reporting patterns) flex the range width.
- **Refresh cadence:** Annual.
- **Exclusions:** Loss-makers, dormant/inactive entities, and structural-shift businesses (e.g., franchisees of dominant chains where the ratio is dictated by the franchisor, not the operator). Activity-statement-derived ratios (GST-free sales, non-capital purchases) were retired in 2017 with the introduction of Simpler BAS.

### 1.6 The audit-risk lens

The original purpose of the benchmarks was *cash-economy detection*. A bricklayer reporting 4% cost of sales when the industry runs 18-22% is implicitly under-declaring revenue. The ATO uses falling-outside-range as an audit-targeting signal.

This is operationally hostile (the ATO is hunting tax cheats) but the user experience the ATO ships is actually useful: *"compare your business now"* is a free interactive tool that lets a small operator type their numbers in and see, on the spot, where they sit relative to peers. That's a strong product hook for a benchmarking site.

## 2. What Margin Atlas does today vs the ATO model

Mapping our current shape to theirs:

| Dimension | Margin Atlas today | ATO model |
|---|---|---|
| Primary axis | Country × geo × industry × employee-count band | Industry × turnover band (single country) |
| Output ratios | Revenue per firm, revenue per employee, wages per employee, net margin estimate, cost stack (cogs / labor / rent / energy / marketing / software / insurance / other) | 5 ratios, one designated "key" per industry |
| Range shown | Median + p25/p75 distribution | 30% band centred on the average |
| Operator-facing framing | "Typical revenue, employment, and wages" | "Where does your business stand" |
| Interactive comparison | `/compare` (industry × country side-by-side) | "Compare your business now" — enter your numbers, get a verdict |
| Sub-industry depth | 30 sub-industry candidates seeded, 0 ready | Many ATO industries are themselves sub-industries (e.g., "Bricklaying services" is its own benchmark, separate from "Cement rendering") |
| Cash-economy framing | Not present | Central |

## 3. Five things Margin Atlas should steal

### 3.1 Add a "key benchmark" designation per industry

One ratio per industry, called out as the headline number. The other ratios stay visible but as supporting context. This is a content-and-design change, not a data change — the data is already in `industry_cost_profile_v1.json`.

Implementation: extend `IndustryCostProfile` with a `key_benchmark` field (one of `cogs`, `labor`, `total_expenses`, `rent`, `motor_vehicle`), and surface the chosen ratio in the cell-page hero. Restaurants → COGS as headline; law firms → Labour as headline; plumbing → Total Expenses as headline.

**Impact:** the cell page stops being a wall of equivalent numbers and starts answering a specific question.

### 3.2 Add a "turnover band" axis alongside employee-count

This is the bigger lift. Today our breakdown axis is `size_band ∈ {0, 1-4, 5-9, 10-19, 20-49, 50-249, 250+}` (employee count). Add a parallel `turnover_band ∈ {≤$X, $X-$Y, $Y+}` where the thresholds are industry-calibrated (the ATO does exactly this — bricklaying's bands are different from retail's).

Why both: opening a coffee shop, you don't know your headcount yet; you know your target revenue. Turnover bands are the more actionable axis pre-launch. Employee bands are the more actionable axis for an operator who already has a payroll.

Implementation:
1. New column on `cells_master`: `turnover_band` derived from `revenue_per_firm` quantiles per industry.
2. New segmentation: when a user lands on a cell page, infer the relevant turnover band from the typical revenue, but let them switch.
3. Industry-specific thresholds in a new file `data/finance/turnover_bands_v1.json`.

**Impact:** a coffee-shop operator with $200K projected revenue gets a different (and more accurate) cost stack than one with $1.5M projected revenue, even though both fall in the "1-4 employees" band today.

### 3.3 Add motor-vehicle expenses to the cost stack

Margin Atlas's cost stack has cogs / labor / rent / energy / marketing / software / insurance / other_overhead. There is no transport / motor-vehicle line. For trades (plumber, electrician, carpenter, builder), motor vehicle is a 4-8% line item — the same order of magnitude as marketing or insurance — and it's the ATO's single best cash-economy detection signal because it's easy to under-report.

Implementation: add `motor_vehicle_share` to `industry_cost_profile_v1.json`, defaulting to 0 for office-based industries and 0.03-0.07 for trades. Re-distribute `other_overhead_share` to absorb the new line.

**Impact:** trades cost stacks become accurate; cell pages for plumbers, electricians, etc. stop hand-waving "other overhead 22%".

### 3.4 Build an interactive "Compare your business" tool

The ATO's killer UX hook. An operator types in:
- My country / city
- My industry
- My annual turnover (or "what I expect to make")
- My monthly rent
- My headcount and total wages

…and the tool returns:
- COGS: you're at X%, typical is Y-Z%, you're under/over/normal.
- Labour: ditto.
- Rent: ditto.
- One sentence: "your biggest deviation is rent; you are paying significantly above typical for this metro at this revenue. Consider negotiating or relocating."

This already partially exists at `/calculator` but as a forward planner (predict revenue from inputs), not a backward checker (validate my real numbers against peers). The ATO version is more directly useful because it answers the operator's actual question: *am I normal?*

Implementation: new route `/check` or repurpose `/calculator` with an "I already operate" mode.

**Impact:** the strongest acquisition + monetisation lever on the site. People sign up because they want the answer; we capture the lead.

### 3.5 Add a "key benchmark range" band visualisation on the distribution chart

The cell page's distribution chart today shows the p25-p50-p75 of revenue per firm. Add a shaded "key benchmark range" band that highlights the middle 30% (or whatever band the user selected) and renders the operator's own data point if they've used the Compare tool.

This is a small chart-component change with a big psychological payoff: instead of an abstract distribution, the user sees "here's where 30% of similar businesses sit, here's where you sit."

## 4. Net-new industry categories from the ATO A-Z list

Sample of distinctive ATO benchmark industries that are *not* one-to-one in Margin Atlas's taxonomy, ranked by how much they would extend our coverage:

| ATO industry | Closest current MA industry | Recommended action |
|---|---|---|
| Cement rendering | Currently bundled into "building-construction" | **Split out** — different cost profile (low COGS, high labour) |
| Carpet laying services | Bundled into flooring/general construction | Split out as a separate sub-industry |
| Cabinet makers | Bundled into manufacturing | Split out — distinct cost shape from bulk furniture mfg |
| Catering services | Bundled into restaurants today | Split — much lower rent share, much higher MV/transport |
| Chicken shops | Bundled into fast food | Split — visible global pattern (Australia, Trinidad, US South) |
| Cleaning services — building/industrial | Bundled into cleaning generally | Split — B2B contract structure differs from residential |
| Cleaning services — carpet/upholstery | Bundled into cleaning generally | Split — equipment-heavy sub-niche |
| Alarm systems installation (fire/security) | Bundled into electrical | Split — high-margin, recurring monitoring revenue |
| Air conditioning, refrigeration, heating | Bundled into HVAC | Already covered, but with the ATO's COGS/labour split |
| Bricklaying / Blocklaying | Bundled into construction | Split each — different turnover bands |
| Cement rendering | Bundled into construction | Split |
| Architectural services | We have it | ATO benchmarks confirm: labour-heavy, low COGS |
| Bottle shops and liquor retailing | Bundled into "alcohol retail" | Split — distinct from grocery |
| Coffee shops vs Cafés | We may conflate | Split — ATO treats them differently (coffee shops higher beverage COGS, cafés have food labour) |
| Cake shops and patisseries | Bundled into bakeries | Split — cake shops have higher labour, lower bread COGS |

The general lesson: the ATO splits at a sub-industry resolution that operators *recognise*. "Plumber" is too coarse; "blocked-drain specialist" might be too narrow. The ATO's resolution — bricklaying vs blocklaying vs cement rendering — is the sweet spot.

This validates the deepening plan already in flight (`docs/strategy/2026-05-24-industry-deepening-master-plan.md`) and gives us a free target list of ~20 industries to split out.

## 5. Better framing language to import

The ATO's narrative voice is more direct than Margin Atlas's. Steal:

- **"Where does your business stand?"** — much better than "Typical revenue for this industry"
- **"You should fall within the key benchmark range"** — actionable verb. Margin Atlas tends to passive: "Typical operators report..."
- **"If you fall outside the range, your business may have room to improve."** — frames deviation as opportunity, not anomaly
- **"This benchmark is most accurate when predicting business turnover"** — explicit about which signal is the *predictor*

Suggested editorial pass on every cell-page hero copy: rewrite from descriptive to direct-comparative. The data doesn't change; the question the page is answering does.

## 6. What NOT to copy

- **The audit-risk framing.** Margin Atlas is a benchmarking site, not an enforcement tool. The ATO's "outside the range → audit risk" lens would alarm operators and is the wrong vibe.
- **The single-country anchor.** The ATO is correctly Australia-only. Margin Atlas's value is the multi-country comparison; we should not collapse to one country to copy them.
- **The tax-return data source.** ATO has direct access to filings. We don't. Our parallel data sources (Eurostat SBS, US Census BDS, World Bank Enterprise Surveys) are coarser but globally available. The lesson is the framework, not the data pipe.

## 7. Concrete near-term actions (sequenced)

These are listed in order of expected leverage relative to effort.

1. **Add `key_benchmark` field to `IndustryCostProfile`.** ~30 minutes. Designate one ratio per industry. Render the chosen ratio in the cell-page hero.
2. **Add `motor_vehicle_share` to the cost stack.** ~1 hour. Re-balance `other_overhead_share`. Trades industries get visibly better cost profiles.
3. **Rewrite cell-page hero copy from "typical" to "where you stand"** voice. ~2 hours of copy work + a prebuild verify rule that flags passive-voice fallback.
4. **Split the ~20 ATO sub-industries into MA's taxonomy.** Already on the deepening plan; ATO's A-Z list becomes the founder's reference target list.
5. **Build the interactive "Compare your business" tool.** ~1 week. New route `/check`. Hook into the existing cost-stack data. Pair with email capture.
6. **Add `turnover_band` axis alongside `size_band`.** ~2 weeks. The biggest data lift. Requires defining per-industry thresholds, recomputing cell metrics by band, exposing a switcher in the UI. Defer until 1-5 are shipped.

## 8. Sources

- [ATO — Benchmarks A-Z](https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/small-business-benchmarks/benchmarks-a-z)
- [ATO — Types of small business benchmarks](https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/small-business-benchmarks/types-of-benchmarks)
- [ATO — Benchmarking methodology](https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/small-business-benchmarks/small-business-benchmarks-methodology-and-ratio-calculations/benchmarking-methodology)
- [ATO — How we calculate benchmark ratios](https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/small-business-benchmarks/small-business-benchmarks-methodology-and-ratio-calculations/how-we-calculate-benchmark-ratios)
- [ATO — Compare your business now](https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/small-business-benchmarks/compare-your-business-now)
- [ATO — Industry benchmarks (Taxation statistics 2022-23)](https://www.ato.gov.au/about-ato/research-and-statistics/in-detail/taxation-statistics/taxation-statistics-2022-23/statistics/industry-benchmarks)
- [ATO — Media release: 100 industries](https://www.ato.gov.au/media-centre/ato-releases-new-small-business-benchmarks-for-100-industries)
- Third-party explainers consulted for context: Calxa, withaccounting.com.au, Moula, Cotchy, Hospitality Magazine.
