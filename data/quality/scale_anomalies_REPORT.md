# Scale-sanity audit (Plan v24 Block 1.1)

Total anomalies: 11,325

## Severity distribution

| Severity | Count | Definition |
|---|---|---|
| High (≥ 2) | 349 | ≥ 100× the bound; almost certainly data corruption |
| Medium (1–2) | 1348 | 10–100× the bound; suspect |
| Low (< 1) | 9628 | 1–10× the bound; possible false positive |

## By field

| Field | Count |
|---|---|
| revenue_per_firm | 9074 |
| payroll_per_employee | 1384 |
| employees_per_firm | 867 |

## Top 50 high-severity revenue_per_firm anomalies

| country | geo_id | geo_name | industry_id | value | bound | severity |
|---|---|---|---|---|---|---|
| CH | CH-CITY-lugano | Lugano | grocery_stores | $1.87B | up to $10M | 2.27 |
| MC | MC-CITY-monaco | Monaco | electricity_gas_utilities | $8.74B | up to $50M | 2.24 |
| CH | CH-CITY-lugano | Lugano | veterinary_pet_care | $868.38M | up to $5M | 2.24 |
| LI | LI-CITY-vaduz | Vaduz | grocery_stores | $1.33B | up to $10M | 2.12 |
| MC | MC-CITY-monaco | Monaco | broadcasting_telecom | $6.10B | up to $50M | 2.09 |
| LI | LI-CITY-schaan | Schaan | grocery_stores | $1.20B | up to $10M | 2.08 |
| LI | LI-CITY-vaduz | Vaduz | electricity_gas_utilities | $5.72B | up to $50M | 2.06 |
| LI | LI-CITY-schaan | Schaan | electricity_gas_utilities | $5.17B | up to $50M | 2.01 |

## Top 20 payroll_per_employee anomalies

| country | geo_id | industry_id | value | bound | severity |
|---|---|---|---|---|---|
| RO | RO32 | water_waste | $4,769,444.44 | $3,000 – $200,000 | 1.38 |
| RO | RO32 | water_waste | $4,769,444.44 | $3,000 – $200,000 | 1.38 |
| RO | RO32 | water_waste | $3,920,512.82 | $3,000 – $200,000 | 1.29 |
| FR | FRF2 | chemical_pharma_mfg | $3,820,000 | $3,000 – $200,000 | 1.28 |
| FR | FRF2 | chemical_pharma_mfg | $3,820,000 | $3,000 – $200,000 | 1.28 |
| FR | FRE2 | broadcasting_telecom | $2,800,000 | $3,000 – $200,000 | 1.15 |
| NO | NO0A | textile_apparel_mfg | $2,187,500 | $3,000 – $200,000 | 1.04 |
| FR | FRY | water_waste | $281.85 | $3,000 – $200,000 | 1.03 |
| NL | NL42 | chemical_pharma_mfg | $2,091,943.13 | $3,000 – $200,000 | 1.02 |
| FR | FRC1 | wholesale_food | $2,081,818.18 | $3,000 – $200,000 | 1.02 |
| FR | FRC1 | wholesale_food | $2,081,818.18 | $3,000 – $200,000 | 1.02 |
| SK | SK03 | veterinary_pet_care | $324.68 | $3,000 – $200,000 | 0.97 |
| ES | ES64 | grocery_stores | $333.33 | $3,000 – $200,000 | 0.95 |
| FR | FR1 | water_waste | $1,678,584.94 | $3,000 – $200,000 | 0.92 |
| FR | FR10 | water_waste | $1,678,584.94 | $3,000 – $200,000 | 0.92 |
| NL | NL11 | chemical_pharma_mfg | $1,536,708.86 | $3,000 – $200,000 | 0.89 |
| RO | RO4 | water_waste | $1,483,720.93 | $3,000 – $200,000 | 0.87 |
| RO | RO4 | water_waste | $1,483,720.93 | $3,000 – $200,000 | 0.87 |
| RO | RO22 | auto_dealers_gas | $1,433,333.33 | $3,000 – $200,000 | 0.86 |
| RO | RO22 | auto_dealers_gas | $1,433,333.33 | $3,000 – $200,000 | 0.86 |