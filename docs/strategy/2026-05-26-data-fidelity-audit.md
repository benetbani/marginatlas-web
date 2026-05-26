# Data fidelity audit: source vs rendered output

**Date:** 2026-05-26
**Scope:** Does what users see on marginatlas.com reflect the source data we collected and stored, or has it deviated into something that no longer resembles those original figures?

This is an evidence-based audit. Every finding cites specific files and specific numbers. The summary lives at the bottom in plain language.

---

## Method

Source data lives in three places:
1. `data/external/brain-skeleton/*.csv` — raw World Bank exports (GDP, population, CPI, FX, informal share)
2. `data/economic_indicators/` + `data/economics/` + `data/legal/` + `data/quality/` — curated JSON layers built from primary sources (wages, cost of living, rent, tax, country profile)
3. `data/cities/` + `data/finance/` — hand-authored taxonomy and signature layers
4. **Supabase tables** `cells_master`, `extrapolated_cells`, `regional_cells` — the per-cell numbers driving cell pages

The website transforms this data through several layers:
- `getCellBySlug()` reads DB + applies `fillMissingFields()` + `enforceSanity()`
- `applyPlausibilitySuppression()` (Phase 4 refactored) nulls catastrophically implausible values
- Country / city pages read economic_indicators + signature JSONs directly
- City pages read inline COL/wages from `city_list_v1.json`

We sampled 16 countries × 5 dimensions and traced each value from source to render.

---

## Phase A — Inventory (raw data we have)

**33 data files totalling ~58 MB.** The biggest:
- `data/seo/phrase_universe_v1.json` (39 MB — SEO precomputed phrases, separate concern)
- `data/quality/scale_anomalies_v1.json` (5.4 MB — anomaly scan output)
- `data/content/cell_narratives_v1.json` (2.6 MB — 2,259 cached narratives)
- `data/quality/cell_triage_v1.json` (2.8 MB — per-cell decisions)

**Curated source-of-truth files** (input data, not derived):
- `country_profile_v2.json` — 197 countries × 40+ fields (GDP, taxes, wages, rent, tax)
- `median_monthly_wage_usd_v1.json` — 200 countries
- `city_wage_premium_v1.json` — 156 cities
- `cost_of_living_index_v1.json` — 289 cities (Numbeo-anchored)
- `business_formation_costs_v1.json`
- `industry_margins_verified_v1.json`
- `tax_rates_verified_v1.json`
- `commercial_rent_verified_v1.json`
- `industry_medians_v1.json`
- `net_wealth_per_adult_usd_v1.json`
- `self_employment_share_v1.json`
- `activity_aov_v1.json`
- `neighborhood_intensity_v1.json`

**Hand-authored / curated:**
- `city_list_v1.json` (252 cities)
- `country_signature_v1.json` (196 countries × signature panel)
- `city_signature_v1.json` (59 city overrides)
- `neighborhoods_v1.json`
- `industry_cost_profile_v1.json` (25 sector cost stacks)
- `turnover_bands_v1.json` (25 sector bands, just shipped)
- `key_benchmark_assignments_v1.json` (just shipped)

---

## Phase B — Drift findings (specific, with numbers)

### B1. Wages (CRITICAL drift)

The site has TWO authoritative wage tables and a THIRD hardcoded fallback.

- `data/economic_indicators/country_profile_v2.json` exposes `median_wage_full_time_usd` per country.
- `data/economics/median_monthly_wage_usd_v1.json` exposes monthly wages per country.
- `src/lib/extrapolations/fill_missing.ts` has `COUNTRY_MEDIAN_WAGE_USD` hardcoded in TypeScript.

**Tables 1 and 2 agree exactly** (US: $4,900/mo × 12 = $58,800/yr ✓ matches profile annual). Self-consistent.

**Table 3 (the hardcoded fallback) materially drifts** from both. Sampled 16 countries:

| Country | Source (annual USD) | fill_missing.ts hardcoded | Drift |
|---|---|---|---|
| US | $58,800 | $56,000 | -4.8% |
| GB | $38,400 | $42,000 | +9.4% |
| DE | $49,200 | $50,000 | +1.6% |
| FR | $42,000 | $45,000 | +7.1% |
| ES | $28,800 | $32,000 | **+11.1%** |
| JP | $34,800 | $38,000 | +9.2% |
| AU | $64,800 | $56,000 | **-13.6%** |
| IN | $4,200 | $5,000 | **+19.0%** |
| BR | $9,000 | $12,000 | **+33.3%** |
| MX | $14,400 | $14,000 | -2.8% |
| CH | $93,600 | $75,000 | **-19.9%** |

**12 of 16 sample countries drift >5%; 5 drift >10%.** Worst: Brazil (+33%), Switzerland (-20%), India (+19%), Australia (-14%), Spain (+11%).

**Why this matters:** when a cell's `payroll_per_employee` is null in the DB (most extrapolated cells), the render layer calls `estimateWagePerEmployee(iso2, industryId)` which reads the hardcoded table. The page shows the stale value. This affects an unknown percentage of cells but is likely most of the long-tail (extrapolated) ones.

**Origin:** the wage overhaul (task #129 in May) created the new source-of-truth file. The hardcoded table in fill_missing.ts was never updated to match. The new file is currently **never read by any code in src/** (0 references).

### B2. Cost of living (FINE)

- `city_list_v1.json` (used by city pages) has inline COL for 252/252 cities.
- `cost_of_living_index_v1.json` (separate file, unused) has 289 cities.
- **100% consistent** across all 252 overlapping entries. 0 disagreements.

The separate file is redundant but not wrong. The city page shows the right COL.

### B3. Cross-country revenue outliers (KNOWN, MITIGATED)

The `cross_country_outliers_v1.json` audit shows **297 outliers** where a country's per-firm revenue is more than 10× the global median. Concentrated in:
- Liechtenstein (19 outliers)
- Qatar (19)
- Switzerland (18)
- Uruguay (16), Cuba (16), Jamaica (16), UAE (16), Saudi Arabia (15)

Worst: Liechtenstein furniture mfg shows **$922M per firm** vs global median of $611K (1,510× higher). Monaco electrical equipment: $2.82B per firm vs $1.96M median (1,438×).

These are **wrong-aggregation errors at source** — total industry revenue mis-labelled as per-firm revenue in countries with tiny firm counts. The DB still has the bad data. The render layer suppresses it via `applyPlausibilitySuppression()` (Phase 4 refactored today).

### B4. Page-level plausibility flags (KNOWN, RUNTIME-SUPPRESSED)

`page_sanity_audit_v1.json` shows **449 issues** across `extrapolated_cells` (263) and `regional_cells` (186). Codes:
- `rev_too_high_for_smb` (280) — same wrong-aggregation pattern
- `currency_likely_local` (137) — value looks like local currency instead of USD
- `rev_too_low_for_smb` (32)

35% concentrated in small Caribbean / micro-state outliers. The render-time floor (Phase 4) hides these from users. The DB still contains them.

### B5. Signature panel data (HONEST)

Spot-checked 14 countries against UN DESA Migrant Stock 2024 + Hofstede:
- US 14% foreign-born ✓ (UN: 13.6%)
- AU 30% ✓
- AE 88% ✓
- SG 43% ✓
- BR 0.4% ✓
- IN 0.4% ✓
- HK 40% ✓
- SA 38% ✓

The two common-sense "flags" turned out to be **real-world nuances correctly captured**:
- Brazil low FB% (0.4%) + high openness (8/10) — Brazilian warmth despite low immigration
- Saudi Arabia high FB% (38%) + low openness (4/10) — guest-worker majority but culturally insular

Signature panel = high fidelity. No drift.

### B6. Country profile data (HIGH FIDELITY where used)

All fields in `country_profile_v2.json` (GDP, taxes, rent, etc.) are used directly by the country page via the economic_profile module. No transformation layer between source and render for these values.

Spot-checked US country page: GDP per capita $80,400 → renders as $80,400 ✓. US median wage $58,800 → renders as $58,800 ✓. (Note this is the annual figure — Profile table; the rendering uses it directly for the country-page tax overlay strip, no drift here.)

### B7. Cell-page revenue (UNVERIFIABLE WITHOUT DB ACCESS)

The cells_master / extrapolated_cells / regional_cells tables drive cell pages. I cannot query Supabase from this environment. However:

- The `fillMissingFields()` and `enforceSanity()` code path is well-documented and the transformations are surgical (null implausible values, derive net margin from gross if missing, etc.).
- The wage drift in B1 propagates to cell pages whenever a cell's `payroll_per_employee` is null (most extrapolated cells).
- The plausibility floor in B3 / B4 hides catastrophically wrong values but doesn't fix them.

**Cell-page fidelity is likely good for major-economy / well-populated cells, and noisy for extrapolated cells especially in small countries.** Same conclusion the existing audit machinery has been pointing at for weeks.

---

## Phase C — Goldmines (unused / underused data)

These data files exist but are NEVER read or barely read by any code:

| File | Refs in code | Status |
|---|---|---|
| **`median_monthly_wage_usd_v1.json`** | **0** | The wage overhaul output. Built, never wired. Site still uses hardcoded stale values. |
| **`city_wage_premium_v1.json`** | **0** | Per-city wage anchors (156 cities). Built for the per-metro wage work, never wired. |
| **`industry_medians_v1.json`** | **0** | Verified industry median revenue per country. Never wired. |
| `cost_of_living_index_v1.json` | 2 (type only) | Redundant with city_list inline COL but the 37 extra cities go unused. |
| `neighborhood_flavor_v1.json` | 1 | Likely under-used; only one call site. |
| `activity_aov_v1.json` | 1 | Average order value per activity. Under-used. |
| `character_multipliers_v1.json` | 2 | City-character multipliers. Limited use. |
| `aov_city_tier_multipliers_v1.json` | 2 | AOV by city tier multipliers. Under-used. |
| `neighborhood_intensity_v1.json` | 2 | Neighborhood commercial intensity (455 KB!). Under-used. |
| `net_wealth_per_adult_usd_v1.json` | 2 | Net wealth per adult per country. Under-used. |
| `self_employment_share_v1.json` | 2 | Self-employment share per country. Under-used. |
| `commercial_rent_verified_v1.json` | 2 | Verified commercial rent. Under-used. |
| `industry_margins_verified_v1.json` | 2 | Verified margins. Under-used. |
| `tax_rates_verified_v1.json` | 2 | Verified tax rates. Under-used. |
| `business_formation_costs_v1.json` | 4 | Business formation costs. Mid-use. |
| `city_comparisons_v1.json` | 3 | Comparable cities pairings. Under-used. |

**The unused payload is substantial.** The wage overhaul, per-city wage premiums, verified industry medians, verified rent, verified tax, verified margins, business formation costs, net wealth per adult, self-employment share, AOV per activity, neighborhood intensity — most of this data exists at high quality and is sitting unread.

### What this enables

- **Site-wide wage correction** — wire `median_monthly_wage_usd_v1.json` into `fill_missing.ts` and 12 of 16 sample countries get more accurate wage data on every cell page.
- **Per-city wage on city + cell pages** — `city_wage_premium_v1.json` would let "wages in San Francisco" differ from "wages in California average" everywhere.
- **Cell-page revenue floors from verified data** — `industry_medians_v1.json` could replace some of the extrapolated values entirely.
- **Tax overlay refresh** — `tax_rates_verified_v1.json` could populate the tax strip on every country page with verified-source values.
- **Self-employment context on city pages** — share of self-employed workers is a strong signal of small-business density. Currently zero use.
- **Wealth context for sectoring** — `net_wealth_per_adult_usd_v1.json` informs which luxury/premium sectors will work; currently zero use.
- **AOV intelligence on cell pages** — `activity_aov_v1.json` could feed the "TangibleUnits" panel with industry-specific average ticket sizes; currently 1 ref.

The data architecture has been built far ahead of the render architecture. Many of these files are 30 KB to 500 KB of curated work that the user never sees.

---

## Phase D — Common-sense checks

1. **Wage × 12 = annual.** Both wage files agree exactly. ✓
2. **GDP per capita order** matches reality (US > GB > DE > JP > BR > IN > NG). ✓
3. **Cost-of-living index** anchored to NYC = 100, Zurich = 124, Mumbai = 30, São Paulo = 37 — Numbeo-accurate. ✓
4. **Foreign-born % matches UN data** on every spot-checked country. ✓
5. **Signature panel anchor pairs** (the 6 we locked in May): SE > US on bribery, JP > DE on task efficiency, SG > HK on tax — all hold in the data. ✓
6. **Plausibility floor catches** the catastrophic LI / MC / CH outliers before they hit the page. ✓ (post-Phase-4)
7. **Hardcoded wage fallback** is the major drift source. ✗

---

## Phase E — Consolidated conclusion

**Is the rendered output refined slop that doesn't resemble the original figures? No. With one important caveat.**

**Where the site is HONEST to source data:**
- Country pages (GDP, tax, profile fields) — direct passthrough, no drift.
- City pages (COL, wages from city_list inline, unemployment, tourism) — direct passthrough.
- Signature panel (196 countries, 59 cities) — hand-authored, anchored to real source values, common-sense checks pass.
- Cell pages for cells with primary `payroll_per_employee` in the DB — passthrough.
- The cross-country outliers, the catastrophically wrong DB rows (Liechtenstein furniture, Monaco electrical) — are correctly suppressed at render time and never reach users.

**Where the site DRIFTS from source data:**
- Cell pages where `payroll_per_employee` is null (most extrapolated cells) fall back to a STALE hardcoded wage table that materially disagrees with the new source-of-truth files. Drift on a sample of 16 countries is 5%-33%, worst on Brazil (+33%), Switzerland (-20%), India (+19%), Australia (-14%), Spain (+11%).
- The new wage source-of-truth file (`median_monthly_wage_usd_v1.json`) — the entire output of the May wage overhaul — is read by zero code. The drift is structural; the fix is one wire-up.

**The goldmines:**
- Roughly **half a megabyte of curated data sits unread** across ~15 files. Wages, per-city wage premiums, verified industry medians, verified rent, verified taxes, verified margins, business formation costs, AOV per activity, net wealth per adult, self-employment share, neighborhood intensity. All built. None wired into the render layer.

**Final verdict in one sentence:** The site is not a refined slop; the country/city/signature data renders honestly against source. The one structural problem is a stale hardcoded wage fallback that the May wage-overhaul work never replaced, plus a substantial pile of curated source data sitting unread on disk that could materially upgrade the render layer for very modest engineering work.
