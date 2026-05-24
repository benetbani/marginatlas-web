-- ============================================================================
-- Phase 1, Cell #2: US x Cafes / Coffee Shops (NAICS 722515)
-- ============================================================================
--
-- Sources (2024-2025):
--   - Multiple coffee-shop benchmark sources (Toast POS Coffee Report,
--     Specialty Coffee Association industry data, 7shifts industry survey):
--     median independent revenue           = ~$500K/year
--     operating costs as share of sales    = 75%-85%
--     net margin after all expenses        = 7%-10%
--   - Coffee-shop startup cost guides (UpMenu, Toast, Barista Life,
--     Crimson Cup, 2024):
--     total startup                        = $80K-$300K typical
--     equipment share of startup           = 25%-35%
--     buildout                             = $75-$250/sq ft
--     espresso machine                     = $8K-$25K
--     permits and licenses                 = $500-$5K
--
-- Cost stack against $500K typical revenue:
--   rent_occupancy        12.0%  = $60,000  (higher % than restaurants;
--                                            cafes need foot-traffic locations)
--   payroll_total         35.0%  = $175,000 (barista wages + manager)
--   cost_of_goods_sold    29.0%  = $145,000 (coffee + milk + pastries)
--   utilities             3.0%   = $15,000  (espresso machine + refrigeration)
--   marketing_acquisition 2.0%   = $10,000  (cafes lean on foot traffic)
--   insurance_professional 4.0%  = $20,000
--   equipment_maintenance 5.0%   = $25,000  (espresso machine service)
--   regulatory_licensing  1.0%   = $5,000
--   ------------------------------------
--   total operating              = $455,000
--   implied operating margin     = $45,000 = 9% (matches the 7-10% net
--                                          reported across the industry)
--
-- Setup cost block:
--   Box 1 - Registration + licensing total = $3,000
--   Box 2 - Capital fit-out total          = $175,000
--   Grand total                            = $178,000
--   Payback                                = ~47 months at 9% margin
--
-- Scope: NAICS 722515 (snack and non-alcoholic beverage bars). This
-- code covers coffee shops, juice bars, ice cream stands. Most of the
-- data above is coffee-shop specific; the cost stack is a reasonable
-- proxy for the broader 722515 category.
--
-- Quality grade: B
-- ============================================================================

UPDATE cells_master
SET cost_stack = '{
  "rent_occupancy": 60000,
  "payroll_total": 175000,
  "cost_of_goods_sold": 145000,
  "utilities": 15000,
  "marketing_acquisition": 10000,
  "insurance_professional": 20000,
  "equipment_maintenance": 25000,
  "regulatory_licensing": 5000,
  "refreshed_at": "2026-05-24",
  "source_note": "US national independent coffee-shop benchmark. Cost ratios from Toast POS Coffee Report 2024 and Specialty Coffee Association data applied against $500K typical annual revenue. Rent share runs higher than restaurants because cafes require high foot-traffic locations.",
  "grade": "B"
}'::jsonb
WHERE country = 'US'
  AND naics_6 = '722515';

UPDATE cells_master
SET setup_costs = '{
  "registration": {
    "business_registration_fee": 200,
    "industry_licenses_fee": 1500,
    "professional_license_fee": 0,
    "insurance_bond_initial": 1000,
    "certifications_initial": 300,
    "total_estimated": 3000,
    "source_note": "US national average for an LLC plus food handler, health, and business permits. Cafes are simpler to license than full-service restaurants; no liquor license."
  },
  "capital": {
    "property_fitout": 100000,
    "equipment_initial": 50000,
    "initial_inventory": 5000,
    "working_capital_reserve_months": 4,
    "lease_deposit": 15000,
    "pre_opening_marketing": 5000,
    "total_estimated": 175000,
    "source_note": "Mid-range build-out for a 1,200 sq ft seated cafe. Equipment dominated by espresso machine ($15K), grinders, refrigeration, POS. Excludes drive-thru option (adds $50K-$100K)."
  },
  "payback_months_estimate": 47,
  "refreshed_at": "2026-05-24",
  "grade": "B"
}'::jsonb
WHERE country = 'US'
  AND naics_6 = '722515';
