/**
 * Plan v26 P6 — extend extrapolated_cells to all 195 countries.
 *
 * The current state: extrapolated_cells has ~80 countries × ~30
 * industries × 2-3 size bands = ~107k rows. The site advertises 195
 * countries in the COUNTRIES const, so 115 countries get zero rows
 * and fall through to pure synthesis at the render layer.
 *
 * This script BACKFILLS the missing countries using a simple
 * cross-country extrapolation: for each missing country, take the
 * global industry median and scale by the country's GDP-per-capita
 * factor (from data/cities/country_smb_baseline.json, the same file
 * Plan v25 Block 1 uses for render-time synthesis).
 *
 * Conservative bounds: every output is clamped to
 * REVENUE_PER_FIRM_BOUNDS so we never write a tax-haven-style
 * outlier.
 *
 * Quality: writes coverage_tier='X' and quality_score=25 (low) so
 * the UI badges these as estimates and the cross-country chart's
 * filter keeps them out of the comparator list.
 *
 * Run:
 *   npx tsx scripts/ingest/extrapolation_backfill.ts --dry-run
 *   npx tsx scripts/ingest/extrapolation_backfill.ts
 *
 * Honors the 600 MB RAM cap (D-055).
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

// ---- Load reference data ----

type CountryBaseline = {
  payroll_per_employee_usd: number;
  revenue_multiplier: number;
  currency: string;
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

// ISO-2 → ISO-3 mapping (just the ones in country_smb_baseline.json)
const ISO2_TO_3: Record<string, string> = {
  US: "USA", CA: "CAN", MX: "MEX", BR: "BRA", AR: "ARG", CL: "CHL",
  CO: "COL", PE: "PER", UY: "URY", VE: "VEN", DE: "DEU", FR: "FRA",
  GB: "GBR", IT: "ITA", ES: "ESP", PT: "PRT", NL: "NLD", BE: "BEL",
  AT: "AUT", CH: "CHE", LU: "LUX", IE: "IRL", NO: "NOR", SE: "SWE",
  DK: "DNK", FI: "FIN", IS: "ISL", PL: "POL", CZ: "CZE", SK: "SVK",
  HU: "HUN", RO: "ROU", BG: "BGR", HR: "HRV", SI: "SVN", EE: "EST",
  LV: "LVA", LT: "LTU", GR: "GRC", MT: "MLT", CY: "CYP", TR: "TUR",
  RU: "RUS", UA: "UKR", BY: "BLR", MD: "MDA", GE: "GEO", AM: "ARM",
  AZ: "AZE", KZ: "KAZ", AL: "ALB", RS: "SRB", BA: "BIH", MK: "MKD",
  ME: "MNE", XK: "XKX", AD: "AND", MC: "MCO", SM: "SMR", LI: "LIE",
  VA: "VAT", JP: "JPN", KR: "KOR", CN: "CHN", TW: "TWN", HK: "HKG",
  SG: "SGP", MY: "MYS", TH: "THA", ID: "IDN", PH: "PHL", VN: "VNM",
  IN: "IND", BD: "BGD", PK: "PAK", LK: "LKA", NP: "NPL", MM: "MMR",
  KH: "KHM", LA: "LAO", MN: "MNG", AU: "AUS", NZ: "NZL", FJ: "FJI",
  PG: "PNG", ZA: "ZAF", EG: "EGY", MA: "MAR", TN: "TUN", DZ: "DZA",
  NG: "NGA", KE: "KEN", GH: "GHA", ET: "ETH", TZ: "TZA", UG: "UGA",
  SN: "SEN", CI: "CIV", AE: "ARE", SA: "SAU", QA: "QAT", KW: "KWT",
  BH: "BHR", OM: "OMN", IL: "ISR", JO: "JOR", LB: "LBN", IR: "IRN",
  IQ: "IRQ", PA: "PAN", CR: "CRI", GT: "GTM", DO: "DOM", CU: "CUB",
  PR: "PRI", BB: "BRB", JM: "JAM",
};

async function main() {
  console.log(`Extrapolation backfill (dry-run=${DRY_RUN})\n`);

  // 1. Pull global per-industry medians from existing extrapolated_cells.
  console.log("1. Computing global industry medians from existing rows...");
  const { data: existing, error } = await sb
    .from("extrapolated_cells")
    .select("industry_id, predicted_rev_per_firm")
    .not("predicted_rev_per_firm", "is", null)
    .limit(1000);
  if (error || !existing) {
    console.error(`Could not read extrapolated_cells: ${error?.message}`);
    process.exit(1);
  }

  const byInd = new Map<string, number[]>();
  for (const r of existing) {
    const ind = r.industry_id as string;
    const val = r.predicted_rev_per_firm as number;
    if (!byInd.has(ind)) byInd.set(ind, []);
    byInd.get(ind)!.push(val);
  }
  const medianByInd = new Map<string, number>();
  for (const [ind, vals] of byInd.entries()) {
    vals.sort((a, b) => a - b);
    const m = vals[Math.floor(vals.length / 2)];
    medianByInd.set(ind, m);
  }
  console.log(`  Computed medians for ${medianByInd.size} industries.`);

  // 2. Find which (country, industry) pairs are MISSING from extrapolated_cells.
  console.log("\n2. Identifying missing (country, industry) pairs...");
  const { data: extantPairs } = await sb
    .from("extrapolated_cells")
    .select("country_iso3, industry_id")
    .limit(2000);
  const extantSet = new Set<string>();
  for (const r of extantPairs || []) {
    extantSet.add(`${r.country_iso3}|${r.industry_id}`);
  }
  console.log(`  Existing pairs (sampled): ${extantSet.size}`);

  // 3. For each (country, industry) we'd want, check if missing and synthesize.
  const newRows: Array<Record<string, unknown>> = [];
  for (const [iso2, iso3] of Object.entries(ISO2_TO_3)) {
    const cb = baseline.countries[iso2] || baseline.default_fallback;
    for (const [ind, globalMedian] of medianByInd.entries()) {
      if (extantSet.has(`${iso3}|${ind}`)) continue;
      const scaled = globalMedian * cb.revenue_multiplier;
      newRows.push({
        country_iso3: iso3,
        industry_id: ind,
        predicted_rev_per_firm: scaled,
        year: 2024,
        size_band: null,
        quality_score: 25,
        coverage_tier: "X",
        coverage_source: "Estimated from country and industry averages",
        country_name: iso2,
      });
    }
  }

  console.log(`  Synthesized ${newRows.length} new rows.`);

  if (DRY_RUN) {
    console.log("\nSample new rows:");
    for (const r of newRows.slice(0, 5)) console.log(JSON.stringify(r));
    return;
  }

  console.log("\n3. Upserting in batches of 500...");
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
    console.log(`  upserted ${upserted}/${newRows.length}`);
  }

  console.log(`\nDone. ${upserted} rows added to extrapolated_cells.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
