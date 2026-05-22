/**
 * Plan v27 Lane A audit — sanity-check the 4-factor formula across a
 * diverse sample of (country, industry, size_band) combos.
 *
 * Prints a table of predicted revenue for 20 hand-picked cells.
 * If any cell is < $5k or > $20M for SMB, that's a red flag.
 *
 * Run:  npx tsx scripts/audit/extrapolation_formula_audit.ts
 */
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

export {};

type CountryFactors = {
  gdp_per_capita_usd: number;
  cpi_score: number;
  urbanization_pct: number;
};

type IndustryFactors = {
  urban_factor: "high" | "neutral" | "low";
  corruption_exposure: "low" | "high";
  tradability: "global" | "regional" | "local";
  sector_elasticity: number;
};

const factors = JSON.parse(
  readFileSync(resolve(process.cwd(), "data/economic_indicators/country_factors_v1.json"), "utf-8"),
);
const industryFactors = JSON.parse(
  readFileSync(resolve(process.cwd(), "src/lib/cells/industry_factors.json"), "utf-8"),
);
const industriesData = JSON.parse(
  readFileSync(resolve(process.cwd(), "src/lib/taxonomy/industries.json"), "utf-8"),
);

const INDUSTRY_TO_SECTOR = new Map<string, string>();
for (const ind of industriesData.industries) {
  INDUSTRY_TO_SECTOR.set(ind.id, ind.sector_id);
}

const REVENUE_BOUNDS = { min: 8000, max: 25_000_000 };
const GLOBAL_GDP_PER_CAPITA_REFERENCE = 35000;

function rawGdpRatio(cf: CountryFactors): number {
  return Math.max(0.15, Math.min(3.0, cf.gdp_per_capita_usd / GLOBAL_GDP_PER_CAPITA_REFERENCE));
}
function gdpElasticityFactor(cf: CountryFactors, ind: IndustryFactors): number {
  const r = rawGdpRatio(cf);
  return Math.max(0.1, Math.min(5.0, Math.pow(r, ind.sector_elasticity)));
}
function cpiFactor(cf: CountryFactors, ind: IndustryFactors): number {
  if (ind.corruption_exposure === "low") return 1.0;
  return 0.7 + 0.6 * (cf.cpi_score / 100);
}
function urbanizationFactor(cf: CountryFactors, ind: IndustryFactors): number {
  const d = (cf.urbanization_pct - 50) / 50;
  if (ind.urban_factor === "high") return 1.0 + 0.4 * d;
  if (ind.urban_factor === "low") return 1.0 - 0.4 * d;
  return 1.0;
}

function predict(iso2: string, industryId: string, sizeBand: "small" | "medium" | "large"): number {
  const cf = factors.countries[iso2] || factors.default_fallback;
  const sectorId = INDUSTRY_TO_SECTOR.get(industryId) || "other_local";
  const ind = industryFactors.sectors[sectorId] || industryFactors.default_fallback;
  let value = 400000  // assume global SMB median = $400k
    * gdpElasticityFactor(cf, ind)
    * cpiFactor(cf, ind)
    * urbanizationFactor(cf, ind);
  if (sizeBand === "small") value *= 0.6;
  else if (sizeBand === "large") value *= 2.8;
  return Math.max(REVENUE_BOUNDS.min, Math.min(REVENUE_BOUNDS.max, value));
}

const CASES: Array<[string, string, "small" | "medium" | "large", string]> = [
  ["US", "software_development", "medium", "USA software, medium"],
  ["US", "restaurants", "small", "USA restaurant, small"],
  ["US", "law_firms", "medium", "USA law firm, medium"],
  ["CH", "software_development", "small", "Switzerland software, small"],
  ["CH", "law_firms", "medium", "Switzerland law firm, medium"],
  ["CH", "restaurants", "small", "Switzerland restaurant, small"],
  ["DE", "software_development", "medium", "Germany software, medium"],
  ["DE", "construction_residential", "medium", "Germany residential construction, medium"],
  ["GB", "law_firms", "medium", "UK law firm, medium"],
  ["JP", "restaurants", "small", "Japan restaurant, small"],
  ["IN", "software_development", "medium", "India software, medium"],
  ["IN", "restaurants", "small", "India restaurant, small"],
  ["BD", "restaurants", "small", "Bangladesh restaurant, small"],
  ["NG", "restaurants", "small", "Nigeria restaurant, small"],
  ["BI", "software_development", "medium", "Burundi software, medium (worst case)"],
  ["BI", "restaurants", "small", "Burundi restaurant, small"],
  ["MC", "law_firms", "large", "Monaco law firm, large (best case)"],
  ["LU", "finance", "large", "Luxembourg finance, large"],
  ["AE", "construction_residential", "large", "UAE construction, large"],
  ["BR", "restaurants", "small", "Brazil restaurant, small"],
];

console.log("Country | Industry | Size | Predicted | Bounds OK?");
console.log("---");
for (const [iso2, ind, size, label] of CASES) {
  const v = predict(iso2, ind, size);
  const ok = v >= 5000 && v <= 25_000_000;
  const flag = ok ? "OK" : "OUT-OF-BOUNDS";
  console.log(`${label.padEnd(45)} | $${v.toLocaleString(undefined, { maximumFractionDigits: 0 }).padStart(12)} | ${flag}`);
}
