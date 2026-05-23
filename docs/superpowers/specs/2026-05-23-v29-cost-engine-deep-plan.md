# Plan v29 — Deep per-country cost-structure engine

**Status:** drafted 2026-05-23, awaiting approval
**Predecessor:** v28 (margin caps, currency guards, geo overrides, editorial voice)
**Trigger:** founder direction, paraphrased: *"go deeper only on the spending table — research global trends on how personnel, taxes, and the rest take share of revenue. Build a smart engine that extrapolates the waterfall structure for every business class in every country based on multiple factors. Methodical, slow, high-reasoning, way deeper than GDP-per-capita mechanics."*

## The problem with the current waterfall

The existing `estimateNetProfit()` is a thin model:
- Gross margin is **US-anchored** (from `industry_margins.json`) and applied to non-US revenue.
- Payroll is back-derived from a **single country wage multiplier** with no sector adjustment.
- Employer social contributions use a **single country rate** instead of an industry-aware effective rate.
- Fixed costs (rent, insurance, utilities) come from a **single country-level estimate** without industry intensity weights.
- Corporate income tax is the **statutory rate**, ignoring deductions and depreciation regimes.

Result: in low-wage / low-rent countries, the model over-credits operating profit because it subtracts low country-level payroll from US-level gross profit. Hotels in Mexico end up "earning" 40% net margin. Restaurants in Vietnam look like they print money. The Plan v28 caps clamp the headline, but the underlying lines are still wrong — the breakdown still misleads, just within the cap.

**The right fix:** every cost line in the waterfall needs its own country-aware, industry-aware, scale-aware coefficient — anchored where real data exists, extrapolated from multi-factor models where it doesn't.

## Goal

For every (country, industry, size_band) the site can render, produce a **fully decomposed waterfall** where each line is:

1. **Anchored** in a country economic profile + industry cost profile + the interaction between them.
2. **Defended** by a reasoning chain visible to the user on hover/tap (per-line tooltip).
3. **Calibrated** against real data where it exists; shrunk toward the regional model where it doesn't.
4. **Bounded** by per-line sanity caps (not just net-margin).
5. **Audited** continuously — every rendered waterfall produces a per-line confidence score.

The user-facing promise: every dollar in the waterfall has a story behind it that survives "why is this number what it is?" scrutiny.

## Architecture

```
                   ┌─────────────────────────┐
                   │ Country Economic Profile│   ~28 fields per country × 196
                   │       (CEP)             │
                   └────────────┬────────────┘
                                │
                   ┌────────────▼────────────┐
                   │  Industry Cost Profile  │   ~18 fields per industry × 223
                   │        (ICP)            │
                   └────────────┬────────────┘
                                │
                   ┌────────────▼────────────┐
                   │ (Industry × Country)    │   Computed coefficients per
                   │     Modifier Matrix     │   cost line, not hand-curated
                   └────────────┬────────────┘
                                │
                   ┌────────────▼────────────┐
                   │ Waterfall Engine v2     │   13-line decomposition with
                   │ (estimateCostStructure) │   per-line provenance
                   └────────────┬────────────┘
                                │
        ┌───────────┬───────────┼───────────┬──────────────┐
        ▼           ▼           ▼           ▼              ▼
   Cell page    Compare      Calculator   Sanity audit   Editorial
   waterfall    pages        page         dashboard      blurbs
```

## Phase 1 — Country Economic Profile (CEP)

The single source of truth for what a country's cost structure looks like. Combines and supersedes `country_smb_baseline.json` + `country_factors_v1.json`.

### 1.1 Schema definition

Each country gets a row with the following fields. Every field is internal — never named in user copy (R-002).

```typescript
type CountryEconomicProfile = {
  iso2: string;
  iso3: string;
  name: string;
  continent: string;
  world_bank_region: string;
  currency: string;

  // === GDP & development ===
  gdp_per_capita_usd_nominal: number;       // World Bank WDI 2024
  gdp_per_capita_usd_ppp: number;           // World Bank WDI 2024
  gdp_per_capita_growth_5y_pct: number;     // 5-year CAGR
  productivity_index: number;               // OECD GDP per hour worked, normalized to global median = 1.0

  // === Labor cost structure ===
  median_wage_full_time_usd: number;        // Annual gross, full-time SMB-weighted
  wage_p25_usd: number;                     // 25th percentile
  wage_p75_usd: number;                     // 75th percentile
  minimum_wage_annual_usd: number;          // National or weighted regional minimum
  employer_social_pct: number;              // Employer-side social contributions
  payroll_tax_other_pct: number;            // Other payroll-related employer costs
  health_insurance_employer_pct: number;    // Mandatory or near-mandatory employer share
  fully_loaded_labor_multiplier: number;    // (1 + employer_social + payroll_tax + health) — full cost of 1 wage dollar

  // === Tax regime ===
  vat_gst_standard_pct: number;             // Default standard VAT/GST rate
  vat_gst_reduced_pct: number | null;       // Common reduced rate (food, hospitality)
  corporate_income_tax_combined_pct: number;// Federal + sub-national weighted
  effective_corporate_tax_pct: number;      // Accounting for deductions (typically 70-85% of statutory)
  dividend_withholding_pct: number;         // For owner take-home modeling
  personal_income_tax_marginal_50k_pct: number; // Marginal rate at $50K USD income

  // === Real estate / occupancy ===
  commercial_rent_t1_usd_per_sqm_year: number; // Tier-1 city commercial rent
  commercial_rent_t2_usd_per_sqm_year: number; // Tier-2 city
  commercial_rent_t3_usd_per_sqm_year: number; // Tier-3 / smaller cities
  property_tax_rate_pct: number;            // Annual property tax on commercial space

  // === Energy & inputs ===
  electricity_usd_per_kwh_commercial: number;
  natural_gas_usd_per_therm: number;
  diesel_usd_per_liter: number;             // Proxy for logistics cost

  // === Capital & finance ===
  bank_lending_rate_pct: number;            // Average commercial SMB lending rate
  inflation_5y_avg_pct: number;             // Past 5-year average CPI
  exchange_rate_volatility_pct: number;     // For currency-risk premium

  // === Institutional quality ===
  corruption_perception_index: number;      // CPI 2024 (0-100)
  ease_of_doing_business_index: number;     // World Bank EoDB historical (1-100)
  informal_economy_share_pct: number;       // ILO / IMF estimates; 0-100

  // === Trade / openness ===
  imports_pct_of_gdp: number;               // Import dependency
  trade_openness_pct: number;               // (Exports + Imports) / GDP

  // === Demography / urbanization ===
  urbanization_pct: number;
  median_age: number;
  labor_force_participation_pct: number;
};
```

### 1.2 Data population — per-country research

This is the **methodical, slow** part the founder asked for. Each country gets a dedicated research pass that anchors every field to a defensible reference. Process:

- **Tier A (top 30 by GDP)**: 30-45 min per country. Hand-research each field, cross-reference at least two sources per number.
- **Tier B (next 60)**: 15-20 min per country. Anchor on Tier A neighbors + spot-check with one source.
- **Tier C (remaining ~106)**: 5-8 min per country. Inherit from regional cluster (e.g., Sub-Saharan Africa Tier C inherits from Kenya/Nigeria/Ghana median, then per-country overrides for known divergences).

Output: `data/economic_indicators/country_profile_v2.json` — supersedes the current two files.

### 1.3 Per-country research card

For Tier A and Tier B, each country also gets a markdown card documenting the reasoning:

```
data/economic_indicators/research_cards/de.md
data/economic_indicators/research_cards/mx.md
...
```

Each card has:
- Headline economic profile (3-paragraph summary)
- Labor market notes (wage dispersion, hiring norms, severance)
- Tax regime notes (VAT particulars, corporate tax structure)
- Commercial real estate notes (T1/T2 split, popular cities, lease norms)
- Industry-specific anomalies (e.g., "Germany's Mittelstand inflates the per-firm revenue in manufacturing categories")
- Internal-source list (R-002: NOT exposed in UI)

These cards become the institutional memory of the project. They're the "high-reasoning, methodical, per-country" deliverable the founder asked for.

### 1.4 Quality bands

Per-field confidence: each numeric field carries an internal quality flag:
- `A` — sourced and cross-referenced
- `B` — sourced, single reference
- `C` — interpolated from regional cluster
- `D` — generic fallback

When the engine renders a waterfall, the worst-quality line drives the per-page confidence score.

## Phase 2 — Industry Cost Profile (ICP)

What share of revenue each industry typically allocates to each cost line, before country adjustments.

### 2.1 Schema

```typescript
type IndustryCostProfile = {
  industry_id: string;
  sector_id: string;
  parent_id: string | null;       // Sub-niche inheritance

  // === Cost-line shares (decimals; sum ≈ 1.0 minus net margin) ===
  cogs_share: number;             // Cost of goods sold
  labor_share: number;            // Direct labor; full-FTE-weighted
  rent_share: number;             // Commercial occupancy
  energy_share: number;           // Electricity, gas, fuel
  marketing_share: number;        // Customer acquisition / sales
  software_share: number;         // SaaS, IT, telecom
  insurance_share: number;        // Liability, property, workers' comp
  other_overhead_share: number;   // Accounting, legal, bank fees, supplies

  // === Intensity flex parameters (how lines respond to country economic factors) ===
  cogs_import_dependency: number; // 0 (all local) to 1 (all imported) — flexes with country trade openness
  labor_skill_intensity: number;  // 0 (unskilled) to 1 (highly skilled) — flexes with wage dispersion
  rent_location_dependency: number; // 0 (location-agnostic) to 1 (foot-traffic-driven) — flexes with commercial rent
  energy_intensity: number;       // 0 (light) to 1 (heavy) — flexes with electricity cost
  capital_intensity: number;      // gross fixed assets / annual revenue (0-3+)
  productivity_elasticity: number; // 0 (output linear with labor) to 1.5 (output scales faster than labor)

  // === SMB-specific notes ===
  typical_employees_small: number;   // FTE for "small" size band
  typical_employees_medium: number;
  typical_employees_large: number;
  smb_friendly: "yes" | "mixed" | "no"; // Does SMB representation exist?

  // === Margin envelope (already in margin_caps.json — referenced here) ===
  net_margin_typical_low: number;
  net_margin_typical_high: number;
  net_margin_hard_cap: number;
};
```

### 2.2 Population

All 223 industries get an ICP row. Population strategy:

- **Direct-measured industries** (~40 top ones with US Census + Eurostat data): hand-calibrated cost-line shares.
- **Inherited industries** (sub-niches like "specialty bakery"): inherit from parent ("artisan bakery"); minor overrides.
- **Sector-fallback industries** (~120 with no direct cost-line data): inherit from sector-median cost profile.

Output: `data/finance/industry_cost_profile_v1.json`.

### 2.3 ICP audit

For every industry, sum the cost shares + an assumed net margin and verify it lands in [0.95, 1.05]. Any industry where shares don't add up gets flagged and re-balanced.

## Phase 3 — Industry × Country modifier matrix

How does each cost line shift when an industry from the ICP is placed in a country from the CEP? This is the heart of the smart engine.

### 3.1 Modifier algebra

For each (industry I, country C, cost line L):

```
adjusted_share(L) = base_share(L) × country_factor(L, C) × interaction_factor(L, I, C)
```

Where `country_factor` is the country-level effect on this cost line (derived from CEP) and `interaction_factor` is the industry-specific sensitivity to that country effect (derived from ICP flex parameters).

### 3.2 Per-line modifiers

**COGS**:
```
cogs_country_factor = 1.0
  + 0.4 × (country.imports_pct_of_gdp - 0.4)         // import-heavy economies have higher input cost
  + 0.2 × (country.exchange_rate_volatility_pct)     // FX volatility adds cost premium
  + 0.5 × (industry.cogs_import_dependency × country.tariff_weighted_avg)
```

**Labor (gross wage)**:
```
labor_wage_per_fte =
  country.median_wage_full_time_usd
  × industry.labor_skill_intensity_adjustment(country.wage_p75 / country.median_wage)
  × industry.productivity_elasticity_factor(country.productivity_index)
```

**Labor (fully loaded)**:
```
fully_loaded_labor = labor_wage_per_fte × country.fully_loaded_labor_multiplier
```

**Rent**:
```
rent_per_firm =
  industry.sqm_per_fte × typical_employees(size_band)
  × country.commercial_rent_at_city_tier(city_tier)
  × industry.rent_location_dependency
```

**Energy**:
```
energy_per_firm =
  industry.energy_intensity
  × country.electricity_usd_per_kwh_commercial
  × typical_firm_revenue × scaling_factor
```

**Insurance**:
```
insurance_share =
  industry.insurance_base
  × country.commercial_liability_premium_multiplier
  × scale_factor(typical_employees(size_band))
```

**Marketing**:
```
marketing_share = industry.marketing_base × country.digital_ad_cost_index
```

**Software / tech**:
```
software_share = industry.software_base × country.usd_purchasing_power_adjustment
```

**Corporate income tax**:
```
effective_tax_share =
  country.effective_corporate_tax_pct
  × pre_tax_profit_share
  × industry_specific_deduction_factor
```

### 3.3 Modifier table generation

The modifier matrix is computed at build time, not hand-curated:

```
scripts/finance/generate_modifier_matrix.ts
  → outputs data/finance/modifier_matrix_v1.json
  → 223 industries × 196 countries × 8 cost lines = ~349,000 cells
```

### 3.4 Top-50 hand-curated exceptions

The auto-generated matrix is the baseline. On top, hand-curated exceptions handle the 50 highest-divergence cells where the formula misses real-world structure:

- German Mittelstand manufacturing: capital intensity adjustment
- Japanese restaurants: labor share is lower than Western equivalent due to higher productivity
- US software: marketing share is much higher than global because of paid-acquisition norms
- Mexican construction: informal labor share adjustment
- Singapore finance: tax adjustment for offshore booking
- (~45 more)

These exceptions live in `data/finance/modifier_exceptions_v1.json` and override the auto-generated matrix when present.

## Phase 4 — Waterfall Engine v2

Refactor `estimateNetProfit()` to use the full CEP × ICP × modifier pipeline.

### 4.1 New shape

```typescript
type WaterfallV2 = {
  // Inputs
  industry_id: string;
  iso2: string;
  city_slug: string | null;
  city_tier: 1 | 2 | 3;
  size_band: "small" | "medium" | "large";
  gross_revenue_usd: number;

  // Lines (each carries dollar value + share + provenance + confidence)
  lines: {
    gross_revenue: WaterfallLine;
    cogs: WaterfallLine;
    gross_profit: WaterfallLine;
    direct_labor: WaterfallLine;
    employer_social: WaterfallLine;
    rent: WaterfallLine;
    energy: WaterfallLine;
    insurance: WaterfallLine;
    software_tech: WaterfallLine;
    marketing: WaterfallLine;
    other_overhead: WaterfallLine;
    operating_profit: WaterfallLine;
    corporate_tax: WaterfallLine;
    net_profit: WaterfallLine;
  };

  // Aggregates
  net_margin: number;
  raw_net_margin: number;        // pre-clamp, for audit
  margin_clamped: boolean;
  margin_flagged: boolean;

  // Per-page confidence
  confidence_score: number;       // 0-100
  weakest_line: keyof WaterfallV2["lines"];
};

type WaterfallLine = {
  usd: number;
  share_of_revenue: number;
  provenance: string;             // 1-sentence "why this number" for tooltip
  confidence: "A" | "B" | "C" | "D";
};
```

### 4.2 Engine API

```typescript
estimateCostStructure(input: {
  iso2: string;
  industryId: string;
  citySlug?: string;
  sizeBand: "small" | "medium" | "large";
  grossRevenue: number;
}): WaterfallV2
```

### 4.3 Per-line provenance

Every line carries a one-sentence "why" string. Example for German hotel:

- `direct_labor.provenance = "Germany's median hospitality wage is $34K, fully-loaded at 1.21× including 19.4% employer social contributions."`
- `rent.provenance = "Tier-1 German commercial rent averages $315/sqm/year; hospitality requires ~6.5 sqm per FTE plus public-area allowance."`

These render as tooltips on hover/tap. The user always knows why each line is what it is.

### 4.4 Per-line bounds

Every line gets a sanity range and gets clamped if outside:
- `direct_labor`: [10%, 65%] of revenue
- `cogs`: [5%, 75%]
- `rent`: [0.5%, 25%]
- `operating_profit_pre_tax`: [-10%, 60%]
- (etc.)

Clamps trigger the `margin_flagged` flag.

## Phase 5 — Calibration loop

Where real data exists, use it to calibrate the model.

### 5.1 Calibration anchors

- US: full BLS + Census data on cost shares by industry — anchor every US cell.
- EU NUTS-2: Eurostat structural business statistics — anchor every EU regional cell.
- Japan, UK, Canada, Australia: national stats data — anchor major cities.

### 5.2 Shrinkage estimator

For each (sector, region) pair, compute:

```
shrinkage_factor[sector, region] =
  mean(real_share / model_share) over anchored countries in region
```

Then for any unanchored country in the same region, multiply the model share by the shrinkage factor. This is a Bayesian-flavored "regional shrinkage" that pulls the auto-generated estimate toward the anchored cluster.

### 5.3 Re-run cadence

Calibration runs once per quarter as fresh data lands. Output is checked into the repo so render-time is fast.

## Phase 6 — Sub-country layer

Add city-tier and neighborhood multipliers on top of the country-level result.

### 6.1 City-tier multipliers

For each Tier-1 / Tier-2 / Tier-3 city, the rent and wage lines get a city-specific multiplier:
- New York vs USA: rent × 2.8, wage × 1.4
- London vs UK: rent × 2.6, wage × 1.3
- Mumbai vs India: rent × 1.9, wage × 1.4
- (200 cities total)

### 6.2 Neighborhood layer

For 23 cities with neighborhood schemes, additional multipliers per neighborhood character (already in `character_multipliers_v1.json` — extended to apply to the waterfall, not just revenue).

### 6.3 Bounds at sub-country layer

City and neighborhood adjustments are bounded so a single multiplier can't push a line past its per-industry envelope.

## Phase 7 — UI

Surface the smart engine on every cell page.

### 7.1 Waterfall display upgrade

The current `NetProfitWaterfall` component gets:
- Per-line tooltip with provenance string
- Per-line confidence indicator (4 tiers, color-coded)
- "Why this looks different in this country" callout for any line that diverges > 30% from the global industry mean

### 7.2 "What changes here" sidebar

For high-tier cells, a small sidebar surfaces the 2-3 lines that most diverge from the global industry baseline:

```
WHAT MAKES THIS COUNTRY DIFFERENT FOR HOSPITALITY:
• Labor 38% (vs global 32%) — fully-loaded labor cost is 18% higher here
• Rent 6.5% (vs global 9%) — commercial rent is meaningfully cheaper
• Tax 24% (vs global 22%) — corporate tax slightly above the OECD mean
```

### 7.3 Confidence indicator

Per-page confidence score (0-100) shown as a small chip near the waterfall. Below 60: a banner that says "Some lines in this breakdown are extrapolated from regional data; see methodology."

### 7.4 Methodology deep-link

Each tooltip and the confidence chip deep-link into `/methodology/cost-structure`, a new page that explains the engine layer-by-layer.

## Phase 8 — Audit & ops

Continuous quality control.

### 8.1 Per-country sanity report

Nightly script that walks all 196 countries × top 30 industries, runs them through the engine, and outputs a report flagging:
- Any line outside its bounds
- Any country where multiple industries land at the same clamped value (suggests a CEP error)
- Per-country margin distribution vs global expectations

Output: `data/audit/cost_engine_audit_DATE.json`.

### 8.2 Per-line drill-down dashboard

Internal-only admin page at `/admin/cost-engine` that lets me click any (industry, country) and see the full reasoning chain. Cross-reference against the audit report for triage.

### 8.3 Operator review queue

Flagged cells get added to a review queue. Each entry includes the raw values, the clamp/flag reason, and a one-click "accept as is" or "investigate" action.

### 8.4 Re-run cadence

- Engine code changes: re-run sanity audit immediately, full calibration on next deploy.
- New country data: re-run calibration for that country only.
- Quarterly: full re-run, refresh the per-country research cards.

## Sequencing

**Methodical, slow.** Roughly 8 weeks at sustainable pace.

| Phase | Effort | Weeks | Output |
|-------|--------|-------|--------|
| 1 — CEP schema + population | 25 hr | W1-W2 | `country_profile_v2.json` + 90 research cards |
| 2 — ICP schema + population | 15 hr | W2-W3 | `industry_cost_profile_v1.json` |
| 3 — Modifier matrix | 12 hr | W3-W4 | `modifier_matrix_v1.json` + exceptions |
| 4 — Engine v2 | 18 hr | W4-W5 | New `estimateCostStructure()` |
| 5 — Calibration loop | 10 hr | W5-W6 | Anchored shrinkage factors |
| 6 — Sub-country layer | 8 hr | W6 | City-tier + neighborhood multipliers |
| 7 — UI | 12 hr | W6-W7 | Waterfall display upgrade + "what changes" sidebar |
| 8 — Audit + ops | 10 hr | W7-W8 | Nightly audit + admin drill-down |

Total: ~110 hours over 8 weeks. The "slow, methodical" pace lets the per-country research cards land thoughtfully rather than as a sprint.

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| CEP data quality varies wildly by country | Per-field quality flags (A/B/C/D); render layer surfaces confidence |
| ICP cost shares are noisy at sub-industry level | Inherit from parent; fall back to sector median |
| Modifier matrix produces unexpected outputs | Per-line bounds + audit script + flag for review |
| Calibration over-fits to anchored countries | Use shrinkage estimator with regularization, not pure error correction |
| UI complexity scares users | Default to compact view; tooltips are opt-in; confidence chip is small |
| 8-week timeline is long | Ship phase by phase; users see improvement each phase, not just at the end |
| User-visible source agencies leak into UI (R-002) | Pre-build lint sweep before every commit |

## Acceptance criteria

- [ ] Every (country, industry, size_band) the site can render has a full WaterfallV2 result.
- [ ] Every line in every waterfall carries provenance text and a confidence rating.
- [ ] Per-page confidence score ≥ 60 for at least 75% of pages site-wide.
- [ ] No waterfall produces a clamped line that visibly disagrees with the breakdown.
- [ ] Per-country research cards exist for Tier A + Tier B (90 countries).
- [ ] Nightly audit produces < 100 flagged cells across all cells.
- [ ] Methodology page documents the engine with worked examples.

## Anti-scope (what this plan deliberately does NOT do)

- No LLM-generated provenance text. Templates only.
- No real-time data ingestion. All CEP / ICP data is checked into the repo.
- No per-firm-size cost-share variation beyond the three bands.
- No multi-currency simultaneous display (USD remains the canonical unit).
- No tax-advice or financial-advice claims; the disclaimer stays prominent.
- No new database tables — everything fits in JSON content files.
- No replacement of the existing margin_caps from Plan v28; those layer on top.

## Locked decisions (approved 2026-05-23)

1. **Tier A scope**: **50 countries** — top 30 by GDP + 20 key emerging markets.
2. **Research cards**: **internal-only** for faster ship; publish in v30 if useful.
3. **Confidence chip**: **visible to all visitors** — transparency is the moat.
4. **Calibration**: **Bayesian shrinkage from day one** — more defensible long-term.
5. **Sub-country layer**: **Phase 6 as drafted** — country engine ships first, sub-country layers on top.

## What ships next session

Phase 1.1 + 1.2 Tier A: define the full CEP schema, then research and populate the top 30 countries with thoroughly-anchored fields. This is the foundation everything else builds on.
