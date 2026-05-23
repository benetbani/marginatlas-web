# Germany — country research card

**Last verified:** 2026-05-23
**Tier:** A

## Headline profile

Germany is the largest economy in the European Union and the world's third- or fourth-largest by nominal GDP, with GDP per capita of roughly $52.7K nominal and $63K at purchasing power parity. The economy is heavily industrial-exporter weighted, dominated by automotive, chemicals, machinery, and pharmaceuticals. Productivity is well above the global median (~1.35× the global SMB median).

The **Mittelstand** — small and medium-sized industrial firms, often family-owned, often globally competitive — is the distinguishing feature of the German SMB economy. These firms post per-firm revenue several multiples above what cost structure alone would predict, because they often dominate niche international markets in components, specialty machinery, and precision instruments.

Growth has been sluggish since 2018 (energy-cost crisis, demographic decline, manufacturing weakness). 5-year GDP per capita CAGR ~1.1%. The macroeconomic story is "stable but stagnant."

## Labor market

- **Median wage** (full-time, SMB-weighted): $49K
- **Wage spread**: P25 $36K, P75 $68K — relatively compressed by global standards
- **Minimum wage**: €12.41/hour (2024), ~$26.5K annualized for full-time
- **Employer social contributions**: 19.4% on top of gross wage (pension 9.3%, unemployment 1.3%, health 7.3%, long-term care 1.5%)
- **Other payroll-related employer cost**: ~1.2% (accident insurance)
- **Health insurance**: 7.3% employer share (one of the highest)
- **Fully-loaded labor multiplier**: 1.27

Hiring norms include strong worker protections, statutory severance (typically 0.5 month's pay per year of service), works councils, and notice periods that scale with tenure. Effective cost of letting go an employee with 5+ years tenure is meaningfully higher than headline severance suggests — informal practice is to negotiate a settlement (typically 0.5-1.0× annual salary).

## Tax regime

- **VAT (Mehrwertsteuer)**: 19% standard; 7% reduced (food, books, hotels)
- **Corporate income tax**: combined 30% (15% federal Körperschaftsteuer + 5.5% solidarity surcharge thereon + ~15% Gewerbesteuer at municipal level, varies by city — Berlin ~30%, Munich ~32%, Frankfurt ~31%)
- **Effective corporate tax**: ~24.5% (well below statutory due to deductions, depreciation, R&D credits)
- **Dividend withholding**: 26.375% (25% Kapitalertragsteuer + solidarity)
- **Personal income tax**: 30% marginal at $50K USD income

VAT is recoverable for businesses on inputs. The Gewerbesteuer (trade tax) varies materially by municipality and is a real lever for location decisions — Bavaria and Baden-Württemberg cities run higher rates than smaller eastern cities.

## Commercial real estate

- **Tier 1 cities** (Munich, Frankfurt, Hamburg, Düsseldorf, Berlin core): $480/sqm/year average commercial rent
- **Tier 2 cities** (Cologne, Stuttgart, Hanover, Leipzig, Dortmund): $220/sqm/year
- **Tier 3 cities** (regional cities, suburbs): $130/sqm/year
- **Property tax**: 0.35% annual (Grundsteuer; reform 2025 changes the base but average stays similar)

Commercial leases in Germany are typically 5-10 year terms with index-linked escalation. Rent is much more affordable than UK or France for equivalent space.

## Industry anomalies

- **Manufacturing categories**: per-firm revenue runs well above the formula prediction because of the Mittelstand. Adjust auto-generated extrapolation by +30-50% for fabricated_metal_mfg, machinery_mfg, primary_metal_mfg.
- **Restaurants and food service**: lower margins than global average because labor share is high (28-32% of revenue is typical, vs 25% global) — the 19.4% employer social piles on.
- **Construction**: shadow economy share is meaningful (~12% per IAW Tübingen estimates); reported revenue under-counts real activity. Cap auto-applied to net margin at 16% (vs 18% global).
- **Healthcare practices**: heavily insurance-reimbursed; revenue ceiling is structural rather than price-discoverable.
- **Software services**: clusters in Berlin and Munich; per-firm revenue lower than US/UK because the freelance market is mature and per-engagement rates are anchored by mature client base.

## Internal sources

(NOT exposed in UI — R-002)

- World Bank WDI 2024 for GDP, urbanization, productivity proxies
- OECD Tax Database 2024 for corporate income tax, VAT
- Destatis (Federal Statistical Office) for wage distribution, employment
- BMF (German finance ministry) for tax structure
- IW Köln / IAB for labor market detail
- CBRE / JLL Q4 2024 reports for commercial rent benchmarks
- Transparency International CPI 2024 for governance
- IMF WEO for inflation and growth

## Notes for engine integration

- `employer_social_pct: 0.194` is the headline rate but Berlin/Munich operate ~21% effective in some sectors; the modifier matrix should apply a city-tier bump.
- `commercial_rent_t1_usd_per_sqm_year` for Munich runs higher than Berlin (~$580 vs $440 in 2024). The single figure ($480) is a Tier-1 average; city-level overrides in the sub-country layer (Phase 6) will refine.
- `corporate_income_tax_combined_pct: 0.30` is the standard combined; for the modifier, use `effective_corporate_tax_pct: 0.245` so the waterfall doesn't double-count deductions.
- Adjust ICP labor share UP by 4-6pp for hospitality and retail; the high employer-side burden compresses margins more than the average country.
