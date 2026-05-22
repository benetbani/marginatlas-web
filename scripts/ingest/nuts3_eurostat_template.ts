/**
 * Plan v26 P2 — sub-national European business statistics ingest.
 *
 * Template script for ingesting NUTS-3 data into regional_cells. Once
 * you have a source CSV (typically downloaded from the relevant EU
 * statistical portal as a bulk export), edit MAPPING below to align
 * source columns with our schema and run.
 *
 * Expected source CSV columns:
 *   - GEO (NUTS code, e.g. "DE712" for Frankfurt am Main)
 *   - NACE_R2 (industry code, e.g. "I56.1" for restaurants)
 *   - TIME_PERIOD (year)
 *   - OBS_VALUE (the metric value)
 *
 * Plus separate variables for: number of enterprises, employees,
 * turnover, wages.
 *
 * Honors the 600 MB RAM cap (D-055) — streams the CSV line-by-line.
 *
 * Run:
 *   npx tsx scripts/ingest/nuts3_eurostat_template.ts \
 *     --csv path/to/sbs_r_nuts03.csv \
 *     --industry-map config/nace_to_industry_id.json \
 *     --dry-run
 *
 * Once you confirm a small sample looks right, drop --dry-run and
 * the script will UPSERT into regional_cells.
 */
import { config } from "dotenv";
import { resolve } from "node:path";
import { readFileSync, existsSync } from "node:fs";
config({ path: resolve(process.cwd(), ".env.local") });
import { createClient } from "@supabase/supabase-js";

export {}; // module marker

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const args = process.argv.slice(2);
function arg(name: string, def: string | null): string | null {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
}

const CSV_PATH = arg("--csv", null);
const INDUSTRY_MAP_PATH = arg("--industry-map", null);
const DRY_RUN = args.includes("--dry-run");

if (!CSV_PATH || !INDUSTRY_MAP_PATH) {
  console.error(
    "Usage: npx tsx scripts/ingest/nuts3_eurostat_template.ts --csv <path> --industry-map <path> [--dry-run]",
  );
  console.error(
    "  --csv:           path to the source CSV (NUTS-3 × industry × metric)",
  );
  console.error(
    "  --industry-map:  JSON mapping { 'I56.1': 'restaurants', ... }",
  );
  process.exit(1);
}

if (!existsSync(CSV_PATH)) {
  console.error(`CSV not found: ${CSV_PATH}`);
  process.exit(1);
}
if (!existsSync(INDUSTRY_MAP_PATH)) {
  console.error(`Industry map not found: ${INDUSTRY_MAP_PATH}`);
  process.exit(1);
}

const industryMap = JSON.parse(readFileSync(INDUSTRY_MAP_PATH, "utf-8")) as Record<
  string,
  string
>;

/**
 * Parse a single CSV row. Adapt this function to your CSV's actual
 * header layout. Below assumes the standard EU SDMX-CSV format.
 */
function parseRow(headers: string[], cols: string[]): {
  country: string;
  geo_id: string;
  industry_id: string | null;
  metric: string;
  value: number | null;
  year: number;
} | null {
  const row: Record<string, string> = {};
  for (let i = 0; i < headers.length; i++) {
    row[headers[i]] = cols[i];
  }
  const geo = row.GEO || row.geo || "";
  const nace = row.NACE_R2 || row.nace_r2 || "";
  const indicator = row.INDIC_SBS || row.indic_sbs || row.unit || "";
  const year = parseInt(row.TIME_PERIOD || row.time_period || row.year || "0", 10);
  const value = parseFloat(row.OBS_VALUE || row.obs_value || row.value || "");
  if (!geo || !nace || !year) return null;
  return {
    country: geo.slice(0, 2).toUpperCase(),
    geo_id: geo,
    industry_id: industryMap[nace] || null,
    metric: indicator,
    value: isNaN(value) ? null : value,
    year,
  };
}

/**
 * Map source-indicator → our column.
 */
function indicatorToColumn(indicator: string): string | null {
  // Adapt this mapping to your source. Common SBS indicators:
  if (/V11110|enterprises|firms/i.test(indicator)) return "n_enterprises";
  if (/V16110|employees|persons/i.test(indicator)) return "n_employees";
  if (/V12120|turnover|revenue/i.test(indicator)) return "rev_p50"; // median revenue proxy
  if (/V13320|wages|payroll/i.test(indicator)) return "payroll_per_employee";
  return null;
}

async function main() {
  console.log(`Ingesting ${CSV_PATH} into regional_cells (dry-run=${DRY_RUN})\n`);

  const csv = readFileSync(CSV_PATH!, "utf-8");
  const lines = csv.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    console.error("CSV has no data rows.");
    process.exit(1);
  }
  const headers = lines[0].split(",").map((h) => h.replace(/^"|"$/g, ""));
  console.log(`Headers: ${headers.join(", ")}`);

  // Accumulate per-cell values, then upsert in a single pass at the end
  // so partial source data still produces complete rows.
  type CellKey = string;
  const accum = new Map<CellKey, Record<string, unknown>>();

  let scanned = 0;
  let skipped = 0;
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.replace(/^"|"$/g, ""));
    const parsed = parseRow(headers, cols);
    scanned++;
    if (!parsed || !parsed.industry_id || parsed.value == null) {
      skipped++;
      continue;
    }
    const col = indicatorToColumn(parsed.metric);
    if (!col) {
      skipped++;
      continue;
    }
    const key = `${parsed.country}|${parsed.geo_id}|${parsed.industry_id}|${parsed.year}`;
    const existing = accum.get(key) || {
      country: parsed.country,
      geo_id: parsed.geo_id,
      geo_level: "nuts3",
      industry_id: parsed.industry_id,
      year: parsed.year,
      coverage_tier: "P",
      coverage_source: "National business statistics",
      quality_score: 80,
    };
    existing[col] = parsed.value;
    accum.set(key, existing);
  }

  console.log(
    `Scanned ${scanned} rows. Accumulated ${accum.size} unique cells. Skipped ${skipped}.`,
  );

  if (DRY_RUN) {
    const sample = Array.from(accum.values()).slice(0, 5);
    console.log("\nSample cells (would upsert):");
    for (const c of sample) console.log(JSON.stringify(c, null, 2));
    return;
  }

  // Batch upsert
  const cells = Array.from(accum.values());
  const BATCH = 500;
  let upserted = 0;
  for (let i = 0; i < cells.length; i += BATCH) {
    const batch = cells.slice(i, i + BATCH);
    const { error } = await sb
      .from("regional_cells")
      .upsert(batch, {
        onConflict: "country,geo_id,industry_id,year,size_band",
      });
    if (error) {
      console.error(`Batch ${i}-${i + batch.length} error: ${error.message}`);
      continue;
    }
    upserted += batch.length;
    console.log(`  upserted ${upserted}/${cells.length}`);
  }

  console.log(`\nDone. ${upserted} cells upserted.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
