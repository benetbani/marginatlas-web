/**
 * scripts/data/parse_au_primary_benchmarks.ts
 *
 * Backend Phase 1 — Australia flagship parser.
 *
 * Reads the ATO Small Business Benchmarks data file from
 * data/finance/au_primary_benchmarks_v1.{xlsx,pdf} (whichever the
 * founder dropped) and writes the parsed JSON to
 * data/finance/au_primary_benchmarks_v1.json in our canonical schema.
 *
 * The parser is split into three concerns so each can be tested:
 *   1. Detect: which input file is present?
 *   2. Parse: XLSX → rows OR PDF → rows.
 *   3. Map + validate: ATO industry name → MA industry_id; per-band
 *      ratios sane (0-1, monotonic, etc.).
 *
 * Run: npx tsx scripts/data/parse_au_primary_benchmarks.ts
 *
 * Output:
 *   data/finance/au_primary_benchmarks_v1.json
 *
 * Exit codes:
 *   0  parsed cleanly
 *   1  parse failure (file missing, format unrecognized, validation
 *      failed)
 *   2  partial parse (some industries failed mapping; warnings emitted)
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const XLSX_PATH = path.resolve(ROOT, "data/finance/au_primary_benchmarks_v1.xlsx");
const PDF_PATH = path.resolve(ROOT, "data/finance/au_primary_benchmarks_v1.pdf");
const OUT_PATH = path.resolve(ROOT, "data/finance/au_primary_benchmarks_v1.json");

type Band = {
  /** Lower turnover bound in AUD inclusive. */
  min_aud: number;
  /** Upper turnover bound in AUD exclusive; null = open-ended. */
  max_aud: number | null;
  /** Cost of sales / turnover, low-high range as 0-1 fractions. */
  cogs_to_turnover?: { low: number; high: number };
  /** Total expenses / turnover. */
  total_expenses_to_turnover?: { low: number; high: number };
  /** Labour / turnover. */
  labour_to_turnover?: { low: number; high: number };
  /** Rent / turnover. */
  rent_to_turnover?: { low: number; high: number };
  /** Motor vehicle / turnover. */
  motor_vehicle_to_turnover?: { low: number; high: number };
};

type AustralianIndustry = {
  /** ATO display name (e.g., "Bakeries and hot bread shops"). */
  ato_name: string;
  /** ANZSIC division/class code if available. */
  anzsic?: string;
  /** Margin Atlas industry id (resolved by the mapping table). */
  industry_id?: string;
  /** Which ratio the ATO designates as the headline. */
  key_benchmark?: "cogs" | "labor" | "rent" | "motor_vehicle" | "total_expenses";
  /** One row per turnover band; 2-3 bands per industry typical. */
  bands: Band[];
};

type ParsedFile = {
  version: string;
  source: string;
  source_file: string;
  source_year: string;
  parsed_at: string;
  industries: AustralianIndustry[];
};

function detectInputFile(): { path: string; kind: "xlsx" | "pdf" } | null {
  if (fs.existsSync(XLSX_PATH)) return { path: XLSX_PATH, kind: "xlsx" };
  if (fs.existsSync(PDF_PATH)) return { path: PDF_PATH, kind: "pdf" };
  return null;
}

function parseXlsx(_p: string): AustralianIndustry[] {
  // Implementation lands when the file is in hand. Two libraries available:
  //   1. exceljs (pure JS, full XLSX) — most likely choice
  //   2. xlsx-populate (similar)
  // The parser walks the ATO sheet structure (one row per industry-band
  // tuple) and produces the AustralianIndustry shape above.
  throw new Error(
    "XLSX parser not yet implemented. Add exceljs to package.json " +
      "and wire the row-walker once the data file is available.",
  );
}

function parsePdf(_p: string): AustralianIndustry[] {
  // Implementation lands when the file is in hand. Uses pdf-parse
  // for text extraction, then a regex pipeline to peel out the
  // benchmark tables per industry heading.
  throw new Error(
    "PDF parser not yet implemented. Add pdf-parse to package.json " +
      "and wire the section-walker once the data file is available.",
  );
}

function main() {
  const input = detectInputFile();
  if (!input) {
    console.error("✗ No input file found.");
    console.error("");
    console.error("Drop the ATO benchmarks export at either:");
    console.error("  " + XLSX_PATH);
    console.error("  " + PDF_PATH);
    console.error("");
    console.error("See data/finance/au_primary_benchmarks_v1.README.md");
    process.exit(1);
  }

  console.log("=== Parsing AU primary benchmarks ===");
  console.log(`Input: ${input.path} (${input.kind})`);
  console.log("");

  let industries: AustralianIndustry[];
  try {
    industries =
      input.kind === "xlsx" ? parseXlsx(input.path) : parsePdf(input.path);
  } catch (err: unknown) {
    console.error("✗ Parse failed:");
    console.error("  " + (err as Error).message);
    process.exit(1);
  }

  // Validation pass.
  const issues: string[] = [];
  for (const ind of industries) {
    if (!ind.ato_name) issues.push(`Industry missing ato_name`);
    if (!ind.bands || ind.bands.length === 0) {
      issues.push(`${ind.ato_name}: no bands`);
      continue;
    }
    for (const band of ind.bands) {
      const ratios: Array<["cogs", typeof band.cogs_to_turnover]> = [
        ["cogs", band.cogs_to_turnover],
      ];
      for (const [name, r] of ratios) {
        if (!r) continue;
        if (r.low < 0 || r.high > 1 || r.low > r.high) {
          issues.push(`${ind.ato_name} band ${band.min_aud}: ${name} range out of bounds (${r.low}-${r.high})`);
        }
      }
    }
  }
  if (issues.length > 0) {
    console.warn(`! Validation warnings: ${issues.length}`);
    for (const i of issues.slice(0, 20)) console.warn("  - " + i);
  }

  const out: ParsedFile = {
    version: "1.0.0",
    source: "Small Business Benchmarks A-Z",
    source_file: input.path,
    source_year: "2023-24",
    parsed_at: new Date().toISOString(),
    industries,
  };
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + "\n", "utf-8");
  console.log(`Wrote ${industries.length} industries to ${OUT_PATH}.`);
  if (issues.length > 0) process.exit(2);
}

main();
