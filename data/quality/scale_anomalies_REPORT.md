# Scale-sanity audit (Plan v24 Block 1.1)

Total anomalies: 13,455

## Severity distribution

| Severity | Count | Definition |
|---|---|---|
| High (≥ 2) | 149 | ≥ 100× the bound; almost certainly data corruption |
| Medium (1–2) | 1655 | 10–100× the bound; suspect |
| Low (< 1) | 11651 | 1–10× the bound; possible false positive |

## By field

| Field | Count |
|---|---|
| revenue_per_firm | 11556 |
| payroll_per_employee | 1235 |
| employees_per_firm | 664 |

## Top 50 high-severity revenue_per_firm anomalies

| country | geo_id | geo_name | industry_id | value | bound | severity |
|---|---|---|---|---|---|---|
| MC | MC-CITY-monaco | Monaco | cleaning_services | $362.24M | up to $2M | 2.38 |
| CH | CH-CITY-geneva | Geneva | veterinary_pet_care | $1.08B | up to $5M | 2.33 |
| CH | CH-CITY-basel | Basel | grocery_stores | $2.09B | up to $10M | 2.32 |
| CH | CH-CITY-lausanne | Lausanne | grocery_stores | $2.02B | up to $10M | 2.30 |
| CH | CH-CITY-basel | Basel | veterinary_pet_care | $972.59M | up to $5M | 2.29 |
| CH | CH-CITY-bern | Bern | grocery_stores | $1.94B | up to $10M | 2.29 |
| MC | MC-CITY-monaco | Monaco | grocery_stores | $1.91B | up to $10M | 2.28 |
| CH | CH-CITY-lausanne | Lausanne | veterinary_pet_care | $937.86M | up to $5M | 2.27 |
| CH | CH-CITY-lugano | Lugano | grocery_stores | $1.87B | up to $10M | 2.27 |
| US | US-CITY-san-francisco | San Francisco | travel_agencies | $917.34M | up to $5M | 2.26 |
| US | US-CITY-san-francisco | San Francisco | travel_agencies | $917.34M | up to $5M | 2.26 |
| US | US-CITY-san-francisco | San Francisco | travel_agencies | $917.34M | up to $5M | 2.26 |
| US | US-CITY-boston | Boston | travel_agencies | $819.06M | up to $5M | 2.21 |
| US | US-CITY-boston | Boston | travel_agencies | $819.06M | up to $5M | 2.21 |
| US | US-CITY-seattle | Seattle | travel_agencies | $819.06M | up to $5M | 2.21 |
| US | US-CITY-boston | Boston | travel_agencies | $819.06M | up to $5M | 2.21 |
| US | US-CITY-seattle | Seattle | travel_agencies | $819.06M | up to $5M | 2.21 |
| CH | CH-CITY-geneva | Geneva | travel_agencies | $818.97M | up to $5M | 2.21 |
| CH | CH-CITY-basel | Basel | travel_agencies | $739.71M | up to $5M | 2.17 |
| US | US-CITY-miami | Miami | travel_agencies | $720.77M | up to $5M | 2.16 |
| US | US-CITY-chicago | Chicago | travel_agencies | $720.77M | up to $5M | 2.16 |
| CH | CH-CITY-lausanne | Lausanne | travel_agencies | $713.30M | up to $5M | 2.15 |
| US | US-CITY-philadelphia | Philadelphia | travel_agencies | $688.01M | up to $5M | 2.14 |
| US | US-CITY-atlanta | Atlanta | travel_agencies | $688.01M | up to $5M | 2.14 |
| US | US-CITY-dallas | Dallas | travel_agencies | $688.01M | up to $5M | 2.14 |
| US | US-CITY-atlanta | Atlanta | travel_agencies | $688.01M | up to $5M | 2.14 |
| US | US-CITY-houston | Houston | travel_agencies | $688.01M | up to $5M | 2.14 |
| US | US-CITY-houston | Houston | travel_agencies | $688.01M | up to $5M | 2.14 |
| US | US-CITY-philadelphia | Philadelphia | travel_agencies | $688.01M | up to $5M | 2.14 |
| US | US-CITY-phoenix | Phoenix | travel_agencies | $655.25M | up to $5M | 2.12 |
| US | US-CITY-phoenix | Phoenix | travel_agencies | $655.25M | up to $5M | 2.12 |
| AU | AU-CITY-sydney | Sydney | travel_agencies | $545.56M | up to $5M | 2.04 |
| AU | AU-CITY-canberra | Canberra | travel_agencies | $545.56M | up to $5M | 2.04 |
| IL | IL-CITY-tel-aviv | Tel Aviv | travel_agencies | $536.83M | up to $5M | 2.03 |
| CH | CH-CITY-basel | Basel | electricity_gas_utilities | $5.34B | up to $50M | 2.03 |
| CH | CH-CITY-geneva | Geneva | cleaning_services | $160.14M | up to $2M | 2.03 |
| SM | SM-CITY-city-of-san-marino | City of San Marino | travel_agencies | $533.06M | up to $5M | 2.03 |
| SM | SM-CITY-city-of-san-marino | City of San Marino | travel_agencies | $533.06M | up to $5M | 2.03 |
| CH | CH-CITY-lausanne | Lausanne | electricity_gas_utilities | $5.15B | up to $50M | 2.01 |

## Top 20 payroll_per_employee anomalies

| country | geo_id | industry_id | value | bound | severity |
|---|---|---|---|---|---|
| NL | NL23 | food_beverage_mfg | $79.87 | $3,000 – $200,000 | 1.57 |
| FR | FRY5 | warehousing_storage | $4,800,000 | $3,000 – $200,000 | 1.38 |
| RO | RO32 | water_waste | $3,920,512.82 | $3,000 – $200,000 | 1.29 |
| IT | ITI2 | veterinary_pet_care | $251.89 | $3,000 – $200,000 | 1.08 |
| IT | ITI2 | veterinary_pet_care | $251.89 | $3,000 – $200,000 | 1.08 |
| NO | NO0A | textile_apparel_mfg | $2,187,500 | $3,000 – $200,000 | 1.04 |
| SK | SK03 | media_publishing | $280.11 | $3,000 – $200,000 | 1.03 |
| FR | FRY | water_waste | $281.85 | $3,000 – $200,000 | 1.03 |
| NL | NL42 | chemical_pharma_mfg | $2,091,943.13 | $3,000 – $200,000 | 1.02 |
| SK | SK03 | veterinary_pet_care | $298.51 | $3,000 – $200,000 | 1.00 |
| SK | SK03 | veterinary_pet_care | $298.51 | $3,000 – $200,000 | 1.00 |
| NO | NO06 | food_beverage_mfg | $1,953,594.77 | $3,000 – $200,000 | 0.99 |
| FR | FR1 | water_waste | $1,678,584.94 | $3,000 – $200,000 | 0.92 |
| FR | FR10 | water_waste | $1,678,584.94 | $3,000 – $200,000 | 0.92 |
| NL | NL11 | chemical_pharma_mfg | $1,536,708.86 | $3,000 – $200,000 | 0.89 |
| IT | ITI3 | veterinary_pet_care | $407.33 | $3,000 – $200,000 | 0.87 |
| IT | ITI3 | veterinary_pet_care | $407.33 | $3,000 – $200,000 | 0.87 |
| RO | RO22 | auto_dealers_gas | $1,433,333.33 | $3,000 – $200,000 | 0.86 |
| RO | RO22 | auto_dealers_gas | $1,433,333.33 | $3,000 – $200,000 | 0.86 |
| BG | BG32 | water_waste | $443.95 | $3,000 – $200,000 | 0.83 |