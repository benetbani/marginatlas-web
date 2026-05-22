# Backend inventory

Generated 2026-05-22T09:54:23.109Z.

## cells_master

- Total rows: **unknown**
- Countries with data: 1
- Industries (approx distinct): 717

### Top countries by row count


### Null rates (sampled from 1000 rows)

- n: 0.0% null
- rev_p10: 14.0% null
- rev_p50: 14.0% null
- rev_p90: 14.0% null
- total_employment: 0.0% null
- mean_wage_per_employee_usd: 0.0% null
- quality_score: 0.0% null

### Quality_score distribution (sampled)

- lt_30: 0
- 30_50: 0
- 50_70: 68
- 70_85: 237
- gte_85: 695

### Industry sample

- 42495 Paint, Varnish, and Supplies Merchant Wholesalers
- 424950 Paint, Varnish, and Supplies Merchant Wholesalers
- 51213 Motion Picture and Video Exhibition
- 515 Broadcasting (except Internet)
- 517311 Wired Telecommunications Carriers
- 519 Other Information Services
- 5191 Other Information Services
- 51912 Libraries and Archives
- 52212 Savings Institutions
- 53 Real Estate and Rental and Leasing
- 532284 Recreational Goods Rental
- 541213 Tax Preparation Services
- 54199 All Other Professional, Scientific, and Technical Services
- 561210 Facilities Support Services
- 56131 Employment Placement Agencies and Executive Search Services
- 56162 Security Systems Services
- 62111 Offices of Physicians
- 623210 Residential Intellectual and Developmental Disability Facili
- 71394 Fitness and Recreational Sports Centers
- 721211 RV (Recreational Vehicle) Parks and Campgrounds
- 722 Food Services and Drinking Places
- 81142 Reupholstery and Furniture Repair
- 8123 Drycleaning and Laundry Services
- 81233 Linen and Uniform Supply
- 81293 Parking Lots and Garages

### Notes

- US-only. NAICS-6 industry codes. State-level (geo_id = US-XX).

## regional_cells

- Total rows: **unknown**
- Countries with data: 37
- Industries (approx distinct): 2

### Geo levels (sample)

- county: 971
- lad: 29

### Top countries by row count

- ES: 14,386
- JP: 6,951
- DE: 6,522
- PL: 3,036
- AT: 2,833
- RU: 2,640
- CN: 2,640
- IN: 2,112
- IL: 2,112
- BE: 1,618
- CH: 1,584
- KR: 1,584
- ID: 1,584
- PH: 1,584
- RO: 1,548
- HU: 1,390
- SE: 1,386
- TR: 1,320
- ZA: 1,320
- MY: 1,320
- VN: 1,320
- SA: 1,320
- PT: 1,176
- CZ: 1,139
- NZ: 1,056

### Null rates (sampled from 1000 rows)

- n_enterprises: 0.0% null
- rev_p10: 100.0% null
- rev_p50: 100.0% null
- rev_p90: 100.0% null
- n_employees: 1.7% null
- payroll_per_employee: 1.7% null
- quality_score: 0.0% null

### Quality_score distribution (sampled)

- lt_30: 0
- 30_50: 0
- 50_70: 0
- 70_85: 0
- gte_85: 1000

### Industry sample

- air_transport_carriers
- auto_dealers_gas

## extrapolated_cells

- Total rows: **107,734**
- Countries with data: 4
- Industries (approx distinct): 2

### Geo levels (sample)

- country: 0

### Top countries by row count

- : 264
- ABW: 264
- AFE: 264
- AFG: 208

### Null rates (sampled from 1000 rows)

- predicted_rev_per_firm: 0.0% null
- quality_score: 0.0% null
- coverage_tier: 0.0% null

### Quality_score distribution (sampled)


### Industry sample

- air_transport_carriers
- auto_dealers_gas

### Notes

- Country-level extrapolations. country_iso3 only (no sub-national).
