-- ============================================================================
-- Phase 1, Cell #3: GB x Restaurants (industry_id = 'restaurants')
-- ============================================================================
--
-- Sources (2024):
--   - UK Hospitality 2024 operating-cost ratios:
--     food costs           = ~30% of sales
--     labour costs         = 25%-35% (use 30% mid; rises to 35% in fine dining)
--     rent + occupancy     = 8%-12% of sales (use 10% mid)
--     marketing            = 3%-6% (Chartered Institute of Marketing rec)
--   - ONS / industry research (2023-2024):
--     average independent restaurant turnover = £1.2M/year
--     conversion: GBP/USD ~1.26 in 2024
--     equivalent in USD                       = ~$1,500,000
--     net margin (independent)                = 4%-6%
--   - UK restaurant startup-cost guides (Toast UK, Square UK, 2024):
--     total startup typical                   = £100K-£500K
--     fit-out + kitchen                       = £150K-£300K
--     premises license + food premises reg    = £100-£1,500
--
-- Cost stack against $1,500,000 typical revenue (GBP-equivalent values
-- already converted to USD; UK regional_cells stores values in USD per
-- the existing data pipeline, confirmed via the May 2024 currency audit
-- which did NOT flag GB):
--
--   rent_occupancy        10.0% = $150,000
--   payroll_total         30.0% = $450,000
--   cost_of_goods_sold    30.0% = $450,000
--   utilities             1.2%  = $18,000  (~£1.2K/mo per UK averages)
--   marketing_acquisition 4.0%  = $60,000
--   insurance_professional 4.0% = $60,000
--   equipment_maintenance 5.0%  = $75,000
--   regulatory_licensing  1.0%  = $15,000
--   ------------------------------------
--   total operating              = $1,278,000
--   implied op margin            = $222,000 = 15% before depreciation /
--                                          interest / owner draw; the 4%-6%
--                                          net per ONS data fits the gap.
--
-- Setup cost block:
--   Box 1 - Registration + licensing total = $4,000
--   Box 2 - Capital fit-out total          = $422,000
--   Grand total                            = $426,000
--   Payback                                = ~68 months at 5% margin
--
-- Scope: industry_id = 'restaurants' on every GB row in regional_cells.
--
-- Quality grade: B
-- ============================================================================

UPDATE regional_cells
SET cost_stack = '{
  "rent_occupancy": 150000,
  "payroll_total": 450000,
  "cost_of_goods_sold": 450000,
  "utilities": 18000,
  "marketing_acquisition": 60000,
  "insurance_professional": 60000,
  "equipment_maintenance": 75000,
  "regulatory_licensing": 15000,
  "refreshed_at": "2026-05-24",
  "source_note": "UK national independent restaurant benchmark. Cost ratios from UK Hospitality 2024 data applied against typical £1.2M annual revenue (=$1.5M USD). London prime-location rent would push the rent line significantly higher; this is a UK national average, not a London-specific cell.",
  "grade": "B"
}'::jsonb
WHERE country = 'GB'
  AND industry_id = 'restaurants';

UPDATE regional_cells
SET setup_costs = '{
  "registration": {
    "business_registration_fee": 20,
    "industry_licenses_fee": 1500,
    "professional_license_fee": 0,
    "insurance_bond_initial": 2000,
    "certifications_initial": 500,
    "total_estimated": 4000,
    "source_note": "UK Ltd company registration (£12 with Companies House) plus food premises registration, premises license, and Level 2/3 Food Hygiene certification for staff."
  },
  "capital": {
    "property_fitout": 250000,
    "equipment_initial": 100000,
    "initial_inventory": 20000,
    "working_capital_reserve_months": 4,
    "lease_deposit": 40000,
    "pre_opening_marketing": 12000,
    "total_estimated": 422000,
    "source_note": "Mid-range build-out for a 1,500-2,500 sq ft UK casual restaurant. Fit-out costs comparable to US figures; lease deposit reflects typical 3-month security on a £150K/year lease. Excludes any premium for a London prime-location lease."
  },
  "payback_months_estimate": 68,
  "refreshed_at": "2026-05-24",
  "grade": "B"
}'::jsonb
WHERE country = 'GB'
  AND industry_id = 'restaurants';
