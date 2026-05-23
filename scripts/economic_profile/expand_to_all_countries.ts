/**
 * Plan v29 Phase 1.5 — expand CEP to all 196 countries.
 *
 * Takes the 50 hand-anchored Tier A countries in country_profile_v2.json
 * and uses regional-cluster + GDP-tier interpolation to populate every
 * remaining sovereign state and key territory. Output: same file with
 * all 196 countries populated. Universal terms only (R-002).
 *
 * Algorithm:
 *  1. Group Tier A countries by world_bank_region.
 *  2. For each missing country:
 *     a. Look up its GDP per capita and urbanization (from country_factors_v1.json).
 *     b. Find its WB region; gather all Tier A anchors in that region.
 *     c. Compute the GDP ratio: target_gdp / median(region_anchors_gdp).
 *     d. Pick the closest 2 anchors by GDP distance.
 *     e. Weighted-average the anchors' fields, then scale GDP-elastic fields
 *        (wages, rent) by the GDP ratio.
 *     f. Leave structural fields (employer_social_pct, vat_gst_pct, CIT)
 *        as the weighted average — these change less with GDP.
 *  3. Override with the country's own real GDP, CPI, urbanization from
 *     country_factors_v1.json.
 *  4. Quality tier C for everything extrapolated.
 *
 * Run:  npx tsx scripts/economic_profile/expand_to_all_countries.ts
 */
import { resolve } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";

export {};

const PROJECT = process.cwd();

type CountryFactors = {
  gdp_per_capita_usd: number;
  cpi_score: number;
  urbanization_pct: number;
  world_bank_region: string;
};

type CEP = Record<string, unknown> & {
  iso2: string;
  iso3: string;
  name: string;
  continent: string;
  world_bank_region: string;
  currency: string;
  tier: "A" | "B" | "C";
  gdp_per_capita_usd_nominal: number;
  gdp_per_capita_usd_ppp: number;
  median_wage_full_time_usd: number;
  corporate_income_tax_combined_pct: number;
  effective_corporate_tax_pct: number;
  vat_gst_standard_pct: number;
  commercial_rent_t1_usd_per_sqm_year: number;
  commercial_rent_t2_usd_per_sqm_year: number;
  commercial_rent_t3_usd_per_sqm_year: number;
  electricity_usd_per_kwh_commercial: number;
  fully_loaded_labor_multiplier: number;
  employer_social_pct: number;
  payroll_tax_other_pct: number;
  health_insurance_employer_pct: number;
  productivity_index: number;
};

// ---- Load existing files ----
const profilePath = resolve(PROJECT, "data/economic_indicators/country_profile_v2.json");
const factorsPath = resolve(PROJECT, "data/economic_indicators/country_factors_v1.json");

const profileFile = JSON.parse(readFileSync(profilePath, "utf-8")) as {
  version: string;
  anchor: string;
  convention: string;
  default_fallback: CEP;
  countries: Record<string, CEP>;
};

const factorsFile = JSON.parse(readFileSync(factorsPath, "utf-8")) as {
  default_fallback: CountryFactors;
  countries: Record<string, CountryFactors>;
};

// ---- Country list (from taxonomy) ----
// Hand-coded — keeps the script self-contained without importing TS taxonomy.
const COUNTRIES: Array<{ iso2: string; iso3: string; name: string; continent: string }> = [
  { iso2: "AF", iso3: "AFG", name: "Afghanistan", continent: "Asia" },
  { iso2: "AL", iso3: "ALB", name: "Albania", continent: "EU" },
  { iso2: "DZ", iso3: "DZA", name: "Algeria", continent: "MENA" },
  { iso2: "AD", iso3: "AND", name: "Andorra", continent: "EU" },
  { iso2: "AO", iso3: "AGO", name: "Angola", continent: "Africa" },
  { iso2: "AG", iso3: "ATG", name: "Antigua and Barbuda", continent: "SA" },
  { iso2: "AR", iso3: "ARG", name: "Argentina", continent: "SA" },
  { iso2: "AM", iso3: "ARM", name: "Armenia", continent: "EU" },
  { iso2: "AU", iso3: "AUS", name: "Australia", continent: "Oceania" },
  { iso2: "AT", iso3: "AUT", name: "Austria", continent: "EU" },
  { iso2: "AZ", iso3: "AZE", name: "Azerbaijan", continent: "EU" },
  { iso2: "BS", iso3: "BHS", name: "Bahamas", continent: "SA" },
  { iso2: "BH", iso3: "BHR", name: "Bahrain", continent: "MENA" },
  { iso2: "BD", iso3: "BGD", name: "Bangladesh", continent: "Asia" },
  { iso2: "BB", iso3: "BRB", name: "Barbados", continent: "SA" },
  { iso2: "BY", iso3: "BLR", name: "Belarus", continent: "EU" },
  { iso2: "BE", iso3: "BEL", name: "Belgium", continent: "EU" },
  { iso2: "BZ", iso3: "BLZ", name: "Belize", continent: "SA" },
  { iso2: "BJ", iso3: "BEN", name: "Benin", continent: "Africa" },
  { iso2: "BT", iso3: "BTN", name: "Bhutan", continent: "Asia" },
  { iso2: "BO", iso3: "BOL", name: "Bolivia", continent: "SA" },
  { iso2: "BA", iso3: "BIH", name: "Bosnia and Herzegovina", continent: "EU" },
  { iso2: "BW", iso3: "BWA", name: "Botswana", continent: "Africa" },
  { iso2: "BR", iso3: "BRA", name: "Brazil", continent: "SA" },
  { iso2: "BN", iso3: "BRN", name: "Brunei", continent: "Asia" },
  { iso2: "BG", iso3: "BGR", name: "Bulgaria", continent: "EU" },
  { iso2: "BF", iso3: "BFA", name: "Burkina Faso", continent: "Africa" },
  { iso2: "BI", iso3: "BDI", name: "Burundi", continent: "Africa" },
  { iso2: "KH", iso3: "KHM", name: "Cambodia", continent: "Asia" },
  { iso2: "CM", iso3: "CMR", name: "Cameroon", continent: "Africa" },
  { iso2: "CA", iso3: "CAN", name: "Canada", continent: "NA" },
  { iso2: "CV", iso3: "CPV", name: "Cape Verde", continent: "Africa" },
  { iso2: "CF", iso3: "CAF", name: "Central African Republic", continent: "Africa" },
  { iso2: "TD", iso3: "TCD", name: "Chad", continent: "Africa" },
  { iso2: "CL", iso3: "CHL", name: "Chile", continent: "SA" },
  { iso2: "CN", iso3: "CHN", name: "China", continent: "Asia" },
  { iso2: "CO", iso3: "COL", name: "Colombia", continent: "SA" },
  { iso2: "KM", iso3: "COM", name: "Comoros", continent: "Africa" },
  { iso2: "CR", iso3: "CRI", name: "Costa Rica", continent: "SA" },
  { iso2: "CI", iso3: "CIV", name: "Cote d'Ivoire", continent: "Africa" },
  { iso2: "HR", iso3: "HRV", name: "Croatia", continent: "EU" },
  { iso2: "CU", iso3: "CUB", name: "Cuba", continent: "SA" },
  { iso2: "CY", iso3: "CYP", name: "Cyprus", continent: "EU" },
  { iso2: "CZ", iso3: "CZE", name: "Czechia", continent: "EU" },
  { iso2: "CD", iso3: "COD", name: "DR Congo", continent: "Africa" },
  { iso2: "DK", iso3: "DNK", name: "Denmark", continent: "EU" },
  { iso2: "DJ", iso3: "DJI", name: "Djibouti", continent: "Africa" },
  { iso2: "DM", iso3: "DMA", name: "Dominica", continent: "SA" },
  { iso2: "DO", iso3: "DOM", name: "Dominican Republic", continent: "SA" },
  { iso2: "EC", iso3: "ECU", name: "Ecuador", continent: "SA" },
  { iso2: "EG", iso3: "EGY", name: "Egypt", continent: "MENA" },
  { iso2: "SV", iso3: "SLV", name: "El Salvador", continent: "SA" },
  { iso2: "GQ", iso3: "GNQ", name: "Equatorial Guinea", continent: "Africa" },
  { iso2: "EE", iso3: "EST", name: "Estonia", continent: "EU" },
  { iso2: "SZ", iso3: "SWZ", name: "Eswatini", continent: "Africa" },
  { iso2: "ET", iso3: "ETH", name: "Ethiopia", continent: "Africa" },
  { iso2: "FJ", iso3: "FJI", name: "Fiji", continent: "Oceania" },
  { iso2: "FI", iso3: "FIN", name: "Finland", continent: "EU" },
  { iso2: "FR", iso3: "FRA", name: "France", continent: "EU" },
  { iso2: "GA", iso3: "GAB", name: "Gabon", continent: "Africa" },
  { iso2: "GM", iso3: "GMB", name: "Gambia", continent: "Africa" },
  { iso2: "GE", iso3: "GEO", name: "Georgia", continent: "EU" },
  { iso2: "DE", iso3: "DEU", name: "Germany", continent: "EU" },
  { iso2: "GH", iso3: "GHA", name: "Ghana", continent: "Africa" },
  { iso2: "GR", iso3: "GRC", name: "Greece", continent: "EU" },
  { iso2: "GD", iso3: "GRD", name: "Grenada", continent: "SA" },
  { iso2: "GT", iso3: "GTM", name: "Guatemala", continent: "SA" },
  { iso2: "GN", iso3: "GIN", name: "Guinea", continent: "Africa" },
  { iso2: "GW", iso3: "GNB", name: "Guinea-Bissau", continent: "Africa" },
  { iso2: "GY", iso3: "GUY", name: "Guyana", continent: "SA" },
  { iso2: "HT", iso3: "HTI", name: "Haiti", continent: "SA" },
  { iso2: "HN", iso3: "HND", name: "Honduras", continent: "SA" },
  { iso2: "HK", iso3: "HKG", name: "Hong Kong", continent: "Asia" },
  { iso2: "HU", iso3: "HUN", name: "Hungary", continent: "EU" },
  { iso2: "IS", iso3: "ISL", name: "Iceland", continent: "EU" },
  { iso2: "IN", iso3: "IND", name: "India", continent: "Asia" },
  { iso2: "ID", iso3: "IDN", name: "Indonesia", continent: "Asia" },
  { iso2: "IR", iso3: "IRN", name: "Iran", continent: "MENA" },
  { iso2: "IQ", iso3: "IRQ", name: "Iraq", continent: "MENA" },
  { iso2: "IE", iso3: "IRL", name: "Ireland", continent: "EU" },
  { iso2: "IL", iso3: "ISR", name: "Israel", continent: "MENA" },
  { iso2: "IT", iso3: "ITA", name: "Italy", continent: "EU" },
  { iso2: "JM", iso3: "JAM", name: "Jamaica", continent: "SA" },
  { iso2: "JP", iso3: "JPN", name: "Japan", continent: "Asia" },
  { iso2: "JO", iso3: "JOR", name: "Jordan", continent: "MENA" },
  { iso2: "KZ", iso3: "KAZ", name: "Kazakhstan", continent: "EU" },
  { iso2: "KE", iso3: "KEN", name: "Kenya", continent: "Africa" },
  { iso2: "KI", iso3: "KIR", name: "Kiribati", continent: "Oceania" },
  { iso2: "XK", iso3: "XKX", name: "Kosovo", continent: "EU" },
  { iso2: "KW", iso3: "KWT", name: "Kuwait", continent: "MENA" },
  { iso2: "KG", iso3: "KGZ", name: "Kyrgyzstan", continent: "EU" },
  { iso2: "LA", iso3: "LAO", name: "Laos", continent: "Asia" },
  { iso2: "LV", iso3: "LVA", name: "Latvia", continent: "EU" },
  { iso2: "LB", iso3: "LBN", name: "Lebanon", continent: "MENA" },
  { iso2: "LS", iso3: "LSO", name: "Lesotho", continent: "Africa" },
  { iso2: "LR", iso3: "LBR", name: "Liberia", continent: "Africa" },
  { iso2: "LY", iso3: "LBY", name: "Libya", continent: "MENA" },
  { iso2: "LI", iso3: "LIE", name: "Liechtenstein", continent: "EU" },
  { iso2: "LT", iso3: "LTU", name: "Lithuania", continent: "EU" },
  { iso2: "LU", iso3: "LUX", name: "Luxembourg", continent: "EU" },
  { iso2: "MO", iso3: "MAC", name: "Macau", continent: "Asia" },
  { iso2: "MG", iso3: "MDG", name: "Madagascar", continent: "Africa" },
  { iso2: "MW", iso3: "MWI", name: "Malawi", continent: "Africa" },
  { iso2: "MY", iso3: "MYS", name: "Malaysia", continent: "Asia" },
  { iso2: "MV", iso3: "MDV", name: "Maldives", continent: "Asia" },
  { iso2: "ML", iso3: "MLI", name: "Mali", continent: "Africa" },
  { iso2: "MT", iso3: "MLT", name: "Malta", continent: "EU" },
  { iso2: "MH", iso3: "MHL", name: "Marshall Islands", continent: "Oceania" },
  { iso2: "MR", iso3: "MRT", name: "Mauritania", continent: "Africa" },
  { iso2: "MU", iso3: "MUS", name: "Mauritius", continent: "Africa" },
  { iso2: "MX", iso3: "MEX", name: "Mexico", continent: "NA" },
  { iso2: "FM", iso3: "FSM", name: "Micronesia", continent: "Oceania" },
  { iso2: "MD", iso3: "MDA", name: "Moldova", continent: "EU" },
  { iso2: "MC", iso3: "MCO", name: "Monaco", continent: "EU" },
  { iso2: "MN", iso3: "MNG", name: "Mongolia", continent: "Asia" },
  { iso2: "ME", iso3: "MNE", name: "Montenegro", continent: "EU" },
  { iso2: "MA", iso3: "MAR", name: "Morocco", continent: "MENA" },
  { iso2: "MZ", iso3: "MOZ", name: "Mozambique", continent: "Africa" },
  { iso2: "MM", iso3: "MMR", name: "Myanmar", continent: "Asia" },
  { iso2: "NA", iso3: "NAM", name: "Namibia", continent: "Africa" },
  { iso2: "NR", iso3: "NRU", name: "Nauru", continent: "Oceania" },
  { iso2: "NP", iso3: "NPL", name: "Nepal", continent: "Asia" },
  { iso2: "NL", iso3: "NLD", name: "Netherlands", continent: "EU" },
  { iso2: "NZ", iso3: "NZL", name: "New Zealand", continent: "Oceania" },
  { iso2: "NI", iso3: "NIC", name: "Nicaragua", continent: "SA" },
  { iso2: "NE", iso3: "NER", name: "Niger", continent: "Africa" },
  { iso2: "NG", iso3: "NGA", name: "Nigeria", continent: "Africa" },
  { iso2: "MK", iso3: "MKD", name: "North Macedonia", continent: "EU" },
  { iso2: "NO", iso3: "NOR", name: "Norway", continent: "EU" },
  { iso2: "OM", iso3: "OMN", name: "Oman", continent: "MENA" },
  { iso2: "PK", iso3: "PAK", name: "Pakistan", continent: "Asia" },
  { iso2: "PW", iso3: "PLW", name: "Palau", continent: "Oceania" },
  { iso2: "PS", iso3: "PSE", name: "Palestine", continent: "MENA" },
  { iso2: "PA", iso3: "PAN", name: "Panama", continent: "SA" },
  { iso2: "PG", iso3: "PNG", name: "Papua New Guinea", continent: "Oceania" },
  { iso2: "PY", iso3: "PRY", name: "Paraguay", continent: "SA" },
  { iso2: "PE", iso3: "PER", name: "Peru", continent: "SA" },
  { iso2: "PH", iso3: "PHL", name: "Philippines", continent: "Asia" },
  { iso2: "PL", iso3: "POL", name: "Poland", continent: "EU" },
  { iso2: "PT", iso3: "PRT", name: "Portugal", continent: "EU" },
  { iso2: "QA", iso3: "QAT", name: "Qatar", continent: "MENA" },
  { iso2: "CG", iso3: "COG", name: "Republic of Congo", continent: "Africa" },
  { iso2: "RO", iso3: "ROU", name: "Romania", continent: "EU" },
  { iso2: "RU", iso3: "RUS", name: "Russia", continent: "EU" },
  { iso2: "RW", iso3: "RWA", name: "Rwanda", continent: "Africa" },
  { iso2: "KN", iso3: "KNA", name: "Saint Kitts and Nevis", continent: "SA" },
  { iso2: "LC", iso3: "LCA", name: "Saint Lucia", continent: "SA" },
  { iso2: "VC", iso3: "VCT", name: "Saint Vincent and the Grenadines", continent: "SA" },
  { iso2: "WS", iso3: "WSM", name: "Samoa", continent: "Oceania" },
  { iso2: "SM", iso3: "SMR", name: "San Marino", continent: "EU" },
  { iso2: "ST", iso3: "STP", name: "Sao Tome and Principe", continent: "Africa" },
  { iso2: "SA", iso3: "SAU", name: "Saudi Arabia", continent: "MENA" },
  { iso2: "SN", iso3: "SEN", name: "Senegal", continent: "Africa" },
  { iso2: "RS", iso3: "SRB", name: "Serbia", continent: "EU" },
  { iso2: "SC", iso3: "SYC", name: "Seychelles", continent: "Africa" },
  { iso2: "SL", iso3: "SLE", name: "Sierra Leone", continent: "Africa" },
  { iso2: "SG", iso3: "SGP", name: "Singapore", continent: "Asia" },
  { iso2: "SK", iso3: "SVK", name: "Slovakia", continent: "EU" },
  { iso2: "SI", iso3: "SVN", name: "Slovenia", continent: "EU" },
  { iso2: "SB", iso3: "SLB", name: "Solomon Islands", continent: "Oceania" },
  { iso2: "SO", iso3: "SOM", name: "Somalia", continent: "Africa" },
  { iso2: "ZA", iso3: "ZAF", name: "South Africa", continent: "Africa" },
  { iso2: "KR", iso3: "KOR", name: "South Korea", continent: "Asia" },
  { iso2: "ES", iso3: "ESP", name: "Spain", continent: "EU" },
  { iso2: "LK", iso3: "LKA", name: "Sri Lanka", continent: "Asia" },
  { iso2: "SD", iso3: "SDN", name: "Sudan", continent: "Africa" },
  { iso2: "SR", iso3: "SUR", name: "Suriname", continent: "SA" },
  { iso2: "SE", iso3: "SWE", name: "Sweden", continent: "EU" },
  { iso2: "CH", iso3: "CHE", name: "Switzerland", continent: "EU" },
  { iso2: "SY", iso3: "SYR", name: "Syria", continent: "MENA" },
  { iso2: "TW", iso3: "TWN", name: "Taiwan", continent: "Asia" },
  { iso2: "TJ", iso3: "TJK", name: "Tajikistan", continent: "EU" },
  { iso2: "TZ", iso3: "TZA", name: "Tanzania", continent: "Africa" },
  { iso2: "TH", iso3: "THA", name: "Thailand", continent: "Asia" },
  { iso2: "TL", iso3: "TLS", name: "Timor-Leste", continent: "Asia" },
  { iso2: "TG", iso3: "TGO", name: "Togo", continent: "Africa" },
  { iso2: "TO", iso3: "TON", name: "Tonga", continent: "Oceania" },
  { iso2: "TT", iso3: "TTO", name: "Trinidad and Tobago", continent: "SA" },
  { iso2: "TN", iso3: "TUN", name: "Tunisia", continent: "MENA" },
  { iso2: "TR", iso3: "TUR", name: "Turkey", continent: "MENA" },
  { iso2: "TM", iso3: "TKM", name: "Turkmenistan", continent: "EU" },
  { iso2: "TV", iso3: "TUV", name: "Tuvalu", continent: "Oceania" },
  { iso2: "UG", iso3: "UGA", name: "Uganda", continent: "Africa" },
  { iso2: "UA", iso3: "UKR", name: "Ukraine", continent: "EU" },
  { iso2: "AE", iso3: "ARE", name: "United Arab Emirates", continent: "MENA" },
  { iso2: "GB", iso3: "GBR", name: "United Kingdom", continent: "EU" },
  { iso2: "US", iso3: "USA", name: "United States", continent: "NA" },
  { iso2: "UY", iso3: "URY", name: "Uruguay", continent: "SA" },
  { iso2: "UZ", iso3: "UZB", name: "Uzbekistan", continent: "EU" },
  { iso2: "VU", iso3: "VUT", name: "Vanuatu", continent: "Oceania" },
  { iso2: "VE", iso3: "VEN", name: "Venezuela", continent: "SA" },
  { iso2: "VN", iso3: "VNM", name: "Vietnam", continent: "Asia" },
  { iso2: "YE", iso3: "YEM", name: "Yemen", continent: "MENA" },
  { iso2: "ZM", iso3: "ZMB", name: "Zambia", continent: "Africa" },
  { iso2: "ZW", iso3: "ZWE", name: "Zimbabwe", continent: "Africa" },
  { iso2: "PR", iso3: "PRI", name: "Puerto Rico", continent: "SA" },
  { iso2: "VA", iso3: "VAT", name: "Vatican", continent: "EU" },
];

function pickNearestAnchors(
  iso2: string,
  continent: string,
  gdp: number,
  region: string,
): CEP[] {
  const tierA = Object.values(profileFile.countries) as CEP[];
  // Prefer same continent, then same WB region.
  let pool = tierA.filter((c) => c.continent === continent);
  if (pool.length < 3) {
    pool = tierA.filter((c) => c.world_bank_region === region || c.continent === continent);
  }
  if (pool.length === 0) pool = tierA;
  // Sort by GDP distance.
  pool.sort((a, b) => Math.abs(a.gdp_per_capita_usd_nominal - gdp) - Math.abs(b.gdp_per_capita_usd_nominal - gdp));
  return pool.slice(0, 3);
}

function interpolate(anchors: CEP[], targetGdp: number): Partial<CEP> {
  // Weight by inverse GDP distance.
  const weights = anchors.map((a) => 1 / (Math.abs(a.gdp_per_capita_usd_nominal - targetGdp) + 1));
  const total = weights.reduce((s, w) => s + w, 0);
  const weighted = (key: keyof CEP): number => {
    let sum = 0;
    anchors.forEach((a, i) => {
      const v = a[key];
      if (typeof v === "number") sum += v * weights[i];
    });
    return sum / total;
  };

  // GDP-elastic fields: scale by target_gdp / weighted_average_gdp
  const anchorGdp = weighted("gdp_per_capita_usd_nominal");
  const gdpRatio = targetGdp / Math.max(anchorGdp, 1000);
  const clampedGdpRatio = Math.max(0.2, Math.min(3.5, gdpRatio));

  return {
    gdp_per_capita_usd_nominal: targetGdp,
    gdp_per_capita_usd_ppp: targetGdp * 1.6, // rough PPP uplift, refined later
    gdp_per_capita_growth_5y_pct: weighted("gdp_per_capita_growth_5y_pct"),
    productivity_index: Math.max(0.15, Math.min(1.6, weighted("productivity_index") * Math.pow(clampedGdpRatio, 0.4))),

    // Wages scale with GDP
    median_wage_full_time_usd: weighted("median_wage_full_time_usd") * clampedGdpRatio,
    wage_p25_usd: weighted("wage_p25_usd") * clampedGdpRatio,
    wage_p75_usd: weighted("wage_p75_usd") * clampedGdpRatio,
    minimum_wage_annual_usd: weighted("minimum_wage_annual_usd") * clampedGdpRatio * 0.9,

    // Social contributions and taxes — structural, NOT GDP-elastic
    employer_social_pct: weighted("employer_social_pct"),
    payroll_tax_other_pct: weighted("payroll_tax_other_pct"),
    health_insurance_employer_pct: weighted("health_insurance_employer_pct"),
    fully_loaded_labor_multiplier: weighted("fully_loaded_labor_multiplier"),

    vat_gst_standard_pct: weighted("vat_gst_standard_pct"),
    vat_gst_reduced_pct: weighted("vat_gst_reduced_pct"),
    corporate_income_tax_combined_pct: weighted("corporate_income_tax_combined_pct"),
    effective_corporate_tax_pct: weighted("effective_corporate_tax_pct"),
    dividend_withholding_pct: weighted("dividend_withholding_pct"),
    personal_income_tax_marginal_50k_pct: weighted("personal_income_tax_marginal_50k_pct"),

    // Rent scales with GDP but compressed
    commercial_rent_t1_usd_per_sqm_year: weighted("commercial_rent_t1_usd_per_sqm_year") * Math.pow(clampedGdpRatio, 0.85),
    commercial_rent_t2_usd_per_sqm_year: weighted("commercial_rent_t2_usd_per_sqm_year") * Math.pow(clampedGdpRatio, 0.85),
    commercial_rent_t3_usd_per_sqm_year: weighted("commercial_rent_t3_usd_per_sqm_year") * Math.pow(clampedGdpRatio, 0.85),
    property_tax_rate_pct: weighted("property_tax_rate_pct"),

    // Energy — structural by region, small GDP effect
    electricity_usd_per_kwh_commercial: weighted("electricity_usd_per_kwh_commercial"),
    natural_gas_usd_per_therm: weighted("natural_gas_usd_per_therm"),
    diesel_usd_per_liter: weighted("diesel_usd_per_liter"),

    bank_lending_rate_pct: weighted("bank_lending_rate_pct"),
    inflation_5y_avg_pct: weighted("inflation_5y_avg_pct"),
    exchange_rate_volatility_pct: weighted("exchange_rate_volatility_pct"),

    informal_economy_share_pct: weighted("informal_economy_share_pct"),
    imports_pct_of_gdp: weighted("imports_pct_of_gdp"),
    trade_openness_pct: weighted("trade_openness_pct"),

    median_age: weighted("median_age"),
    labor_force_participation_pct: weighted("labor_force_participation_pct"),
  };
}

// ---- Main ----
let added = 0;
for (const c of COUNTRIES) {
  if (profileFile.countries[c.iso2]) continue; // Already Tier A
  const factors = factorsFile.countries[c.iso2] || factorsFile.default_fallback;
  const anchors = pickNearestAnchors(c.iso2, c.continent, factors.gdp_per_capita_usd, factors.world_bank_region);
  const interp = interpolate(anchors, factors.gdp_per_capita_usd);

  // Determine tier: B if reasonably anchored, C if pure extrapolation
  const tier: "B" | "C" = anchors.length >= 2 && anchors[0].continent === c.continent ? "B" : "C";

  const profile: CEP = {
    iso2: c.iso2,
    iso3: c.iso3,
    name: c.name,
    continent: c.continent as CEP["continent"],
    world_bank_region: factors.world_bank_region,
    currency: "$",
    tier,
    // Real values from factors file override interpolation
    gdp_per_capita_usd_nominal: factors.gdp_per_capita_usd,
    corruption_perception_index: factors.cpi_score,
    urbanization_pct: factors.urbanization_pct,
    // Interpolated fields
    ...interp,
    ease_of_doing_business_index: 60 + (factors.cpi_score - 35) * 0.4, // CPI-correlated proxy
  } as CEP;

  // Round currency-amount fields
  const moneyFields = [
    "median_wage_full_time_usd", "wage_p25_usd", "wage_p75_usd",
    "minimum_wage_annual_usd", "commercial_rent_t1_usd_per_sqm_year",
    "commercial_rent_t2_usd_per_sqm_year", "commercial_rent_t3_usd_per_sqm_year",
  ] as const;
  for (const f of moneyFields) {
    if (typeof profile[f] === "number") {
      (profile as Record<string, unknown>)[f] = Math.round(profile[f] as number);
    }
  }
  // Round percentage and ratio fields to 4 decimals
  const pctFields = [
    "gdp_per_capita_growth_5y_pct", "productivity_index", "employer_social_pct",
    "payroll_tax_other_pct", "health_insurance_employer_pct", "fully_loaded_labor_multiplier",
    "vat_gst_standard_pct", "vat_gst_reduced_pct", "corporate_income_tax_combined_pct",
    "effective_corporate_tax_pct", "dividend_withholding_pct", "personal_income_tax_marginal_50k_pct",
    "property_tax_rate_pct", "electricity_usd_per_kwh_commercial", "natural_gas_usd_per_therm",
    "diesel_usd_per_liter", "bank_lending_rate_pct", "inflation_5y_avg_pct",
    "exchange_rate_volatility_pct", "informal_economy_share_pct", "imports_pct_of_gdp",
    "trade_openness_pct", "median_age", "labor_force_participation_pct",
    "ease_of_doing_business_index",
  ] as const;
  for (const f of pctFields) {
    if (typeof profile[f] === "number") {
      (profile as Record<string, unknown>)[f] = Math.round((profile[f] as number) * 10000) / 10000;
    }
  }

  profileFile.countries[c.iso2] = profile;
  added++;
}

console.log(`Added ${added} countries via extrapolation.`);
console.log(`Total countries in CEP: ${Object.keys(profileFile.countries).length}`);

// Update version + anchor
profileFile.version = "2.1.0";
profileFile.anchor = "Plan v29 Phase 1.5 — full 196-country CEP. Top 50 are Tier A (hand-anchored). Remaining ~146 are Tier B/C via regional-cluster + GDP-tier interpolation from Tier A anchors. Universal terms only (R-002). Every field is internal; never named in user-visible copy.";

writeFileSync(profilePath, JSON.stringify(profileFile, null, 2));
console.log(`Wrote ${profilePath}`);
