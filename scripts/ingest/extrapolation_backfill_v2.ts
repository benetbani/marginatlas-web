/**
 * Plan v27 Lane A.3 — 4-factor extrapolation backfill.
 *
 * Upgrades extrapolation_backfill.ts (v1) by replacing the single
 * revenue_multiplier with a 4-factor model:
 *
 *   predicted = global_industry_median
 *             * gdp_factor(country)
 *             * cpi_factor(country, sector)
 *             * urbanization_factor(country, sector)
 *             * sector_elasticity_factor(country, sector)
 *
 * Goal: zero missing (country, industry, size_band) triples in
 * extrapolated_cells. Render-time pages can still synthesize as a
 * second-line defence, but the database itself should answer 100%
 * of the COUNTRIES × INDUSTRIES × {small, medium, large} matrix.
 *
 * Run:
 *   npx tsx scripts/ingest/extrapolation_backfill_v2.ts --dry-run
 *   npx tsx scripts/ingest/extrapolation_backfill_v2.ts
 *
 * Honors:
 *   D-055: 600 MB RAM cap (in-memory data is small)
 *   R-002: no source-agency names in coverage_source text
 */
import { config } from "dotenv";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
config({ path: resolve(process.cwd(), ".env.local") });
import { createClient } from "@supabase/supabase-js";

export {}; // module marker

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const VERBOSE = args.includes("--verbose");

// ---- Reference data ----

type CountryBaseline = {
  payroll_per_employee_usd: number;
  revenue_multiplier: number;
  currency: string;
};

type CountryFactors = {
  gdp_per_capita_usd: number;
  cpi_score: number;
  urbanization_pct: number;
  world_bank_region: string;
};

type IndustryFactors = {
  urban_factor: "high" | "neutral" | "low";
  corruption_exposure: "low" | "high";
  tradability: "global" | "regional" | "local";
  sector_elasticity: number;
};

type Industry = {
  id: string;
  name: string;
  sector_id: string;
};

const baseline = JSON.parse(
  readFileSync(
    resolve(process.cwd(), "src/lib/cells/country_smb_baseline.json"),
    "utf-8",
  ),
) as {
  default_fallback: CountryBaseline;
  countries: Record<string, CountryBaseline>;
};

const factors = JSON.parse(
  readFileSync(
    resolve(process.cwd(), "data/economic_indicators/country_factors_v1.json"),
    "utf-8",
  ),
) as {
  default_fallback: CountryFactors;
  countries: Record<string, CountryFactors>;
};

const industryFactors = JSON.parse(
  readFileSync(
    resolve(process.cwd(), "src/lib/cells/industry_factors.json"),
    "utf-8",
  ),
) as {
  default_fallback: IndustryFactors;
  sectors: Record<string, IndustryFactors>;
};

const industriesData = JSON.parse(
  readFileSync(
    resolve(process.cwd(), "src/lib/taxonomy/industries.json"),
    "utf-8",
  ),
) as { industries: Industry[] };

const INDUSTRY_TO_SECTOR = new Map<string, string>();
for (const ind of industriesData.industries) {
  INDUSTRY_TO_SECTOR.set(ind.id, ind.sector_id);
}

// ---- ISO-2 ↔ ISO-3 mapping for all 196 countries ----

const ISO2_TO_3: Record<string, string> = {
  AF: "AFG", AL: "ALB", DZ: "DZA", AD: "AND", AO: "AGO", AG: "ATG",
  AR: "ARG", AM: "ARM", AU: "AUS", AT: "AUT", AZ: "AZE", BS: "BHS",
  BH: "BHR", BD: "BGD", BB: "BRB", BY: "BLR", BE: "BEL", BZ: "BLZ",
  BJ: "BEN", BT: "BTN", BO: "BOL", BA: "BIH", BW: "BWA", BR: "BRA",
  BN: "BRN", BG: "BGR", BF: "BFA", BI: "BDI", KH: "KHM", CM: "CMR",
  CA: "CAN", CV: "CPV", CF: "CAF", TD: "TCD", CL: "CHL", CN: "CHN",
  CO: "COL", KM: "COM", CR: "CRI", CI: "CIV", HR: "HRV", CU: "CUB",
  CY: "CYP", CZ: "CZE", CD: "COD", DK: "DNK", DJ: "DJI", DM: "DMA",
  DO: "DOM", EC: "ECU", EG: "EGY", SV: "SLV", GQ: "GNQ", EE: "EST",
  SZ: "SWZ", ET: "ETH", FJ: "FJI", FI: "FIN", FR: "FRA", GA: "GAB",
  GM: "GMB", GE: "GEO", DE: "DEU", GH: "GHA", GR: "GRC", GD: "GRD",
  GT: "GTM", GN: "GIN", GW: "GNB", GY: "GUY", HT: "HTI", HN: "HND",
  HK: "HKG", HU: "HUN", IS: "ISL", IN: "IND", ID: "IDN", IR: "IRN",
  IQ: "IRQ", IE: "IRL", IL: "ISR", IT: "ITA", JM: "JAM", JP: "JPN",
  JO: "JOR", KZ: "KAZ", KE: "KEN", KI: "KIR", XK: "XKX", KW: "KWT",
  KG: "KGZ", LA: "LAO", LV: "LVA", LB: "LBN", LS: "LSO", LR: "LBR",
  LY: "LBY", LI: "LIE", LT: "LTU", LU: "LUX", MO: "MAC", MG: "MDG",
  MW: "MWI", MY: "MYS", MV: "MDV", ML: "MLI", MT: "MLT", MH: "MHL",
  MR: "MRT", MU: "MUS", MX: "MEX", FM: "FSM", MD: "MDA", MC: "MCO",
  MN: "MNG", ME: "MNE", MA: "MAR", MZ: "MOZ", MM: "MMR", NA: "NAM",
  NR: "NRU", NP: "NPL", NL: "NLD", NZ: "NZL", NI: "NIC", NE: "NER",
  NG: "NGA", MK: "MKD", NO: "NOR", OM: "OMN", PK: "PAK", PW: "PLW",
  PS: "PSE", PA: "PAN", PG: "PNG", PY: "PRY", PE: "PER", PH: "PHL",
  PL: "POL", PT: "PRT", QA: "QAT", CG: "COG", RO: "ROU", RU: "RUS",
  RW: "RWA", KN: "KNA", LC: "LCA", VC: "VCT", WS: "WSM", SM: "SMR",
  ST: "STP", SA: "SAU", SN: "SEN", RS: "SRB", SC: "SYC", SL: "SLE",
  SG: "SGP", SK: "SVK", SI: "SVN", SB: "SLB", SO: "SOM", ZA: "ZAF",
  KR: "KOR", ES: "ESP", LK: "LKA", SD: "SDN", SR: "SUR", SE: "SWE",
  CH: "CHE", SY: "SYR", TW: "TWN", TJ: "TJK", TZ: "TZA", TH: "THA",
  TL: "TLS", TG: "TGO", TO: "TON", TT: "TTO", TN: "TUN", TR: "TUR",
  TM: "TKM", TV: "TUV", UG: "UGA", UA: "UKR", AE: "ARE", GB: "GBR",
  US: "USA", UY: "URY", UZ: "UZB", VU: "VUT", VE: "VEN", VN: "VNM",
  YE: "YEM", ZM: "ZMB", ZW: "ZWE", PR: "PRI", VA: "VAT",
};

// ---- 4-factor formula ----

const REVENUE_BOUNDS = { min: 8000, max: 25_000_000 };
const GLOBAL_GDP_PER_CAPITA_REFERENCE = 35000;

function rawGdpRatio(cf: CountryFactors): number {
  return Math.max(0.15, Math.min(3.0, cf.gdp_per_capita_usd / GLOBAL_GDP_PER_CAPITA_REFERENCE));
}

// Single combined GDP × elasticity factor. Power-law: high-elasticity sectors
// (software, finance) amplify the GDP differential; low-elasticity sectors
// (haircuts, repair) compress it. Always positive; clamps prevent runaway.
function gdpElasticityFactor(cf: CountryFactors, ind: IndustryFactors): number {
  const ratio = rawGdpRatio(cf);
  const raised = Math.pow(ratio, ind.sector_elasticity);
  return Math.max(0.1, Math.min(5.0, raised));
}

function cpiFactor(cf: CountryFactors, ind: IndustryFactors): number {
  if (ind.corruption_exposure === "low") return 1.0;
  // High-corruption-exposure sectors: cleaner-governance countries report
  // closer to true revenue (less shadow economy), so they get a slight premium.
  return 0.7 + 0.6 * (cf.cpi_score / 100);
}

function urbanizationFactor(cf: CountryFactors, ind: IndustryFactors): number {
  const deviation = (cf.urbanization_pct - 50) / 50; // -1..+1
  if (ind.urban_factor === "high") return 1.0 + 0.4 * deviation;
  if (ind.urban_factor === "low") return 1.0 - 0.4 * deviation;
  return 1.0;
}

function predictRevenue(
  globalMedian: number,
  iso2: string,
  industryId: string,
  sizeBand: "small" | "medium" | "large" | null,
): { value: number; quality: number } {
  const cf = factors.countries[iso2] || factors.default_fallback;
  const sectorId = INDUSTRY_TO_SECTOR.get(industryId) || "other_local";
  const ind = industryFactors.sectors[sectorId] || industryFactors.default_fallback;

  let value = globalMedian
    * gdpElasticityFactor(cf, ind)
    * cpiFactor(cf, ind)
    * urbanizationFactor(cf, ind);

  // Size band scaling: small = 0.6x, medium = 1.0x, large = 2.8x of base median.
  if (sizeBand === "small") value *= 0.6;
  else if (sizeBand === "large") value *= 2.8;

  // Hard clamp to physical-SMB bounds.
  value = Math.max(REVENUE_BOUNDS.min, Math.min(REVENUE_BOUNDS.max, value));

  // Quality: starts at 15 (baseline synthetic), bumped by clean governance
  // (up to +10 for high-CPI countries), but never above 40 (synthetic ceiling).
  const quality = Math.min(40, 15 + Math.floor(cf.cpi_score / 10));

  return { value, quality };
}

// ---- Main ----

async function main() {
  console.log(`Extrapolation backfill v2 (dry-run=${DRY_RUN})\n`);

  // 1. Load all existing (country, industry, size_band) triples.
  console.log("1. Loading existing extrapolated_cells triples...");
  const existingSet = new Set<string>();
  let from = 0;
  const PAGE = 1000;
  while (true) {
    const { data, error } = await sb
      .from("extrapolated_cells")
      .select("country_iso3, industry_id, size_band")
      .range(from, from + PAGE - 1);
    if (error) {
      console.error(`  load error: ${error.message}`);
      process.exit(1);
    }
    if (!data || data.length === 0) break;
    for (const r of data) {
      existingSet.add(`${r.country_iso3}|${r.industry_id}|${r.size_band || "null"}`);
    }
    from += PAGE;
    if (data.length < PAGE) break;
  }
  console.log(`  Loaded ${existingSet.size} existing triples.`);

  // 2. Compute global per-industry medians from existing rows.
  console.log("\n2. Computing global industry medians...");
  const medians = new Map<string, number>();
  for (const ind of industriesData.industries) {
    // For known industries with existing data, pull from extrapolated_cells.
    const { data: indRows } = await sb
      .from("extrapolated_cells")
      .select("predicted_rev_per_firm")
      .eq("industry_id", ind.id)
      .not("predicted_rev_per_firm", "is", null)
      .limit(500);
    if (indRows && indRows.length > 0) {
      const vals = indRows.map((r) => r.predicted_rev_per_firm as number).sort((a, b) => a - b);
      medians.set(ind.id, vals[Math.floor(vals.length / 2)]);
    } else {
      // Fallback default for never-seen industries: $400k SMB global median.
      medians.set(ind.id, 400000);
    }
  }
  console.log(`  Computed medians for ${medians.size} industries.`);

  // 3. Enumerate the full target matrix.
  console.log("\n3. Enumerating target matrix...");
  const SIZE_BANDS: Array<"small" | "medium" | "large" | null> = ["small", "medium", "large"];
  const newRows: Array<Record<string, unknown>> = [];
  let alreadyHave = 0;
  for (const iso2 of Object.keys(ISO2_TO_3)) {
    const iso3 = ISO2_TO_3[iso2];
    for (const ind of industriesData.industries) {
      const median = medians.get(ind.id) || 400000;
      for (const sb of SIZE_BANDS) {
        const key = `${iso3}|${ind.id}|${sb || "null"}`;
        if (existingSet.has(key)) {
          alreadyHave++;
          continue;
        }
        const { value, quality } = predictRevenue(median, iso2, ind.id, sb);
        newRows.push({
          country_iso3: iso3,
          industry_id: ind.id,
          size_band: sb,
          predicted_rev_per_firm: value,
          year: 2024,
          quality_score: quality,
          coverage_tier: "X",
          coverage_source: "Estimated from country and industry averages",
          country_name: iso2,
        });
      }
    }
  }
  console.log(`  Target matrix: ${Object.keys(ISO2_TO_3).length} countries x ${industriesData.industries.length} industries x ${SIZE_BANDS.length} size bands`);
  console.log(`  Existing: ${alreadyHave}`);
  console.log(`  To synthesize: ${newRows.length}`);

  if (DRY_RUN) {
    console.log("\nSample new rows:");
    for (const r of newRows.slice(0, 8)) console.log(JSON.stringify(r));
    return;
  }

  console.log("\n4. Upserting in batches of 500...");
  const BATCH = 500;
  let upserted = 0;
  for (let i = 0; i < newRows.length; i += BATCH) {
    const batch = newRows.slice(i, i + BATCH);
    const { error: upErr } = await sb
      .from("extrapolated_cells")
      .upsert(batch, {
        onConflict: "country_iso3,industry_id,year,size_band",
      });
    if (upErr) {
      console.error(`  batch ${i}-${i + batch.length} error: ${upErr.message}`);
      continue;
    }
    upserted += batch.length;
    if (upserted % 5000 === 0 || upserted === newRows.length) {
      console.log(`  upserted ${upserted}/${newRows.length}`);
    }
  }

  console.log(`\nDone. ${upserted} rows added to extrapolated_cells.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
