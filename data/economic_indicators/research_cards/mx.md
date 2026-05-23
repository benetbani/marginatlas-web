# Mexico — country research card

**Last verified:** 2026-05-23
**Tier:** A

## Headline profile

Mexico is the second-largest economy in Latin America, with GDP per capita of $13.9K nominal and ~$23.5K at purchasing power parity. The economy is closely integrated with the US through USMCA, with a large manufacturing and assembly base (auto, electronics) in the north and a service-and-tourism economy in the central and southern regions.

The **defining feature for SMB cost analysis** is the very large informal economy — approximately 53% of total employment per INEGI estimates. This means reported per-firm revenue and employee counts understate real activity by a large margin; the cost engine should treat Mexico's formal-sector data as a lower bound, not a point estimate.

Mexico runs as a **two-tier economy**: a formal sector with wages and benefits comparable to upper-middle-income countries, and a vast informal sector operating at much lower price points. The line shifts by industry: construction is heavily informal (>70%), restaurants somewhere in the middle (~50%), professional services largely formal (<25%).

## Labor market

- **Median wage** (formal full-time): $11K
- **Wage spread**: P25 $6K, P75 $19.5K — wide
- **Minimum wage** (general): MXN 248.93/day, ~$4,900/year (higher in border zone)
- **Employer social contributions** (IMSS + INFONAVIT): 22.5% on top of gross wage
  - IMSS (social security): ~16.5%
  - INFONAVIT (housing): 5%
  - SAR (retirement): 2%
- **Other payroll-related employer cost**: 2.5% (state-level payroll tax, 1-3%)
- **Health insurance**: 7% employer share (within IMSS)
- **Fully-loaded labor multiplier**: 1.32

Hiring norms include constitutionally-protected job security; firing without "justified cause" triggers severance of 3 months' salary + 20 days per year of service. Mexican labor law strongly favors workers — most terminations result in negotiated settlements (~5-8 months total cost is typical).

## Tax regime

- **IVA (VAT)**: 16% standard; 0% on basic foods and medicines
- **Corporate income tax (ISR)**: 30% federal — no state-level corporate income tax
- **Effective corporate tax**: ~25.5% after standard deductions
- **Dividend withholding**: 10%
- **Personal income tax**: progressive, 30% marginal at MXN ~3M (~$150K USD), ~25-28% at $50K USD income level
- **Border zone IVA**: 8% in northern border municipalities

The "border zone" reduced VAT applies to a strip 20-30km from the US border and partially in Quintana Roo (tourism). This is a real distortion for benchmark comparisons across Mexico — northern cities and Cancún operate at lower headline VAT.

## Commercial real estate

- **Tier 1 cities** (Mexico City, Monterrey, Guadalajara): $280/sqm/year
- **Tier 2 cities** (Cancún, Tijuana, Puebla, Querétaro, León): $110/sqm/year
- **Tier 3 cities** (regional capitals, smaller cities): $48/sqm/year
- **Property tax (Predial)**: ~0.3% annual on assessed value (very low; assessments lag market)

Mexico City Polanco and Reforma rents compare to Madrid or Lisbon central rent; suburb and tier-3 rent runs less than half. Commercial leases typically 3-5 year terms with inflation-linked escalation.

## Industry anomalies

- **Construction**: shadow economy ~70% per ILO estimates. Reported per-firm revenue is a small fraction of real activity. Auto-extrapolated SMB construction benchmark should be flagged as "formal-sector lower bound."
- **Restaurants and hospitality**: heavily affected by informal sector at the low end; formal mid-tier restaurants in CDMX and resort cities post comparable margins to South American peers.
- **Tourism (hospitality)**: Cancún, Los Cabos, Puerto Vallarta operate dollar-denominated rates; revenue per firm runs well above the national norm. Apply city-tier multiplier of 1.8-2.5× for hotels in these cities.
- **Manufacturing (Maquiladora)**: heavily concentrated in northern border cities. Per-firm revenue is moderate but value-add is small (assembly model).
- **Professional services**: concentrated in Mexico City and Monterrey; per-firm revenue scaled by client base, often dollar-denominated for multinational clients.

## Internal sources

(NOT exposed in UI — R-002)

- INEGI (Mexican statistical institute) for wage distribution, informal economy, GDP
- SAT (tax authority) for ISR, IVA structure
- IMSS / INFONAVIT for social contribution rates
- World Bank WDI 2024 for cross-country comparison
- CBRE Mexico Q4 2024 for commercial rent
- Transparency International CPI 2024
- IMF Article IV consultations
- ILO informal-economy estimates for Mexico

## Notes for engine integration

- `informal_economy_share_pct: 53` is the headline; for construction, apply 65-75%; for professional services, apply 15-25%. The modifier matrix should reference industry-specific informal-share when computing the "reported-vs-real" gap.
- `commercial_rent_t1_usd_per_sqm_year: 280` reflects Mexico City Polanco / Reforma; for hospitality in resort cities (Cancún, Los Cabos), use $380-450 instead — a city-tier-1-resort sub-category.
- `effective_corporate_tax_pct: 0.255` is the modeled value; in practice, tax-advantaged categories (export, agriculture) run lower; the engine should cap the tax-line clamp at 28%.
- ICP adjustment: increase the COGS share for restaurants and retail by 2-3pp vs global because food and goods import costs run higher (24% imports/GDP).
- **Cancún over Quintana Roo**: when rendering geo headlines, always use the popular city name. Quintana Roo is the state; Cancún is what the world knows.
