-- ============================================================================
-- Phase 1, Cell #1: US x Restaurants (NAICS 722511, full-service)
-- ============================================================================
--
-- Sources (all 2024 data, primary):
--   - National Restaurant Association 2024 Operations Survey:
--     food/beverage cost = 32.0% of sales (full-service median)
--     labor + benefits   = 36.5% of sales (full-service median)
--     occupancy / rent   = 5.7%  of sales (full-service median)
--     other expenses     = ~25%  of sales (utilities, marketing, insurance,
--                                          equipment, regulatory, G&A)
--     pre-tax income     = 1.1%-4.3% of sales (full-service median by size)
--   - Industry-aggregated revenue benchmarks (2024-2025):
--     full-service typical revenue per location = $1.1M to $1.2M
--     median = $750K to $1.2M
--   - Restaurant startup cost surveys (multiple sources, 2024):
--     total startup = $275K to $425K average, $175K to $750K full range
--     buildout/renovation = $5K to $50K+ (kitchen + dining + signage)
--     equipment           = $40K to $150K commercial kitchen + POS + cooling
--     licensing           = $500 to $3K base, $5K to $500K liquor (excluded
--                           from base estimate; counted separately if needed)
--     lease deposit       = 2-6 months rent
--     working capital     = 3-6 months operating expenses
--
-- Cost stack derived against typical revenue of $1,100,000 / year:
--   rent_occupancy        $1.1M x 5.7%   = $63K   (NRA primary)
--   payroll_total         $1.1M x 36.5%  = $400K  (NRA primary)
--   cost_of_goods_sold    $1.1M x 32.0%  = $350K  (NRA primary)
--   utilities             $1.1M x 3.5%   = $40K   (allocated from "other 25%")
--   marketing_acquisition $1.1M x 3.0%   = $35K   (allocated from "other 25%")
--   insurance_professional $1.1M x 4.5%  = $50K   (allocated from "other 25%")
--   equipment_maintenance $1.1M x 4.5%   = $50K   (allocated from "other 25%")
--   regulatory_licensing  $1.1M x 1.4%   = $15K   (allocated from "other 25%")
--   ------------------------------------
--   total annual operating               = $1.003M
--   implied operating margin             = ~$97K (9%); gap to NRA 1.1%-4.3%
--                                          pre-tax median is consistent
--                                          with depreciation + interest +
--                                          owner draw not captured in the
--                                          8-line stack.
--
-- Setup cost block:
--   Box 1 - Registration + licensing total ~ $4,500
--   Box 2 - Capital fit-out total          ~ $325,000
--   Grand total                            ~ $330,000
--   Payback (setup / revenue x 5% margin)  ~ 6 years = 72 months
--
-- Scope: applies to NAICS 722511 (full-service restaurants) rows in
-- cells_master. State-level rent and wage variation NOT yet adjusted;
-- the source_note on every cell makes this explicit so users know the
-- number is a US national benchmark, not a California-specific cell.
--
-- Quality grade: B (mostly primary; allocation of "other 25%" is
-- documented but partly modeled).
--
-- Safe to re-run: UPDATE is idempotent (always sets the same value).
-- ============================================================================

-- Step 1: cost stack on full-service restaurant cells (NAICS 722511)
UPDATE cells_master
SET cost_stack = '{
  "rent_occupancy": 63000,
  "payroll_total": 400000,
  "cost_of_goods_sold": 350000,
  "utilities": 40000,
  "marketing_acquisition": 35000,
  "insurance_professional": 50000,
  "equipment_maintenance": 50000,
  "regulatory_licensing": 15000,
  "refreshed_at": "2026-05-24",
  "source_note": "US national full-service restaurant benchmark. Cost ratios from National Restaurant Association 2024 Operations Survey applied against typical $1.1M annual revenue. State-level rent and wage variation not yet incorporated.",
  "grade": "B"
}'::jsonb
WHERE country = 'US'
  AND naics_6 = '722511';

-- Step 2: setup costs on the same cells
UPDATE cells_master
SET setup_costs = '{
  "registration": {
    "business_registration_fee": 200,
    "industry_licenses_fee": 2500,
    "professional_license_fee": 0,
    "insurance_bond_initial": 1500,
    "certifications_initial": 300,
    "total_estimated": 4500,
    "source_note": "US national average for an LLC plus food service, health, and fire permits. Liquor license NOT included (range $5K-$500K state-dependent)."
  },
  "capital": {
    "property_fitout": 200000,
    "equipment_initial": 80000,
    "initial_inventory": 15000,
    "working_capital_reserve_months": 4,
    "lease_deposit": 20000,
    "pre_opening_marketing": 10000,
    "total_estimated": 325000,
    "source_note": "Mid-range build-out cost for a 2,500-3,500 sq ft full-service restaurant. Kitchen + dining + signage + POS + opening inventory. Excludes any acquisition premium for an existing location."
  },
  "payback_months_estimate": 72,
  "refreshed_at": "2026-05-24",
  "grade": "B"
}'::jsonb
WHERE country = 'US'
  AND naics_6 = '722511';

-- ============================================================================
-- Verification: confirm the update touched the expected rows.
-- Run this after the UPDATEs to spot-check.
-- ============================================================================
-- SELECT COUNT(*) AS cells_updated
-- FROM cells_master
-- WHERE country = 'US'
--   AND naics_6 = '722511'
--   AND cost_stack IS NOT NULL
--   AND setup_costs IS NOT NULL;
