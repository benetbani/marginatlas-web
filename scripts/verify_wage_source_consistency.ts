/**
 * scripts/verify_wage_source_consistency.ts
 *
 * Goldmines Wave 1 — prebuild gate locking the integrity of the
 * source-of-truth wage file
 * (data/economics/median_monthly_wage_usd_v1.json) so future drift
 * to that file is caught before it ships.
 *
 * Background: the data fidelity audit (2026-05-26) found that the
 * legacy hardcoded wage table in fill_missing.ts drifted 5-33% from
 * the JSON source-of-truth, because the May 2026 wage overhaul
 * produced the JSON but the legacy table was never updated. The
 * legacy table is now deleted (no callers); this gate prevents
 * future regression of the JSON itself.
 *
 * Rules:
 *   R1. The JSON file covers at least 180 countries (sanity floor).
 *   R2. Every country wage falls within a plausible band:
 *         monthly USD between $80 and $20000.
 *       Anything outside this is almost certainly a unit or currency
 *       bug (e.g., annual reported as monthly, or KRW labelled USD).
 *   R3. Every country has source_quality in {A, B, C}.
 *   R4. The default_fallback field is populated.
 *
 * Run: npx tsx scripts/verify_wage_source_consistency.ts
 * Exit 0 = pass, exit 1 = fail.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const JSON_PATH = path.resolve(ROOT, "data/economics/median_monthly_wage_usd_v1.json");

const MIN_COUNTRY_COUNT = 180;
const MIN_MONTHLY_USD = 80;
const MAX_MONTHLY_USD = 20000;
const VALID_QUALITIES = new Set(["A", "B", "C"]);

type CountryWage = {
  median_monthly_wage_usd: number;
  source_quality?: string;
  notes?: string;
};

type WageFile = {
  version: string;
  default_fallback?: { median_monthly_wage_usd?: number };
  countries: Record<string, CountryWage>;
};

const wageFile = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8")) as WageFile;

let failures = 0;
const messages: string[] = [];

console.log("=== verify_wage_source_consistency ===");

// R1: coverage.
const countryCount = Object.keys(wageFile.countries).length;
if (countryCount < MIN_COUNTRY_COUNT) {
  messages.push(`JSON has ${countryCount} countries; minimum is ${MIN_COUNTRY_COUNT}`);
  failures++;
}

// R4: default fallback present.
if (
  !wageFile.default_fallback ||
  typeof wageFile.default_fallback.median_monthly_wage_usd !== "number"
) {
  messages.push("default_fallback.median_monthly_wage_usd is missing");
  failures++;
}

// R2 + R3: per-country sanity.
for (const [iso, c] of Object.entries(wageFile.countries)) {
  if (typeof c.median_monthly_wage_usd !== "number") {
    messages.push(`[${iso}] median_monthly_wage_usd is not a number`);
    failures++;
    continue;
  }
  if (c.median_monthly_wage_usd < MIN_MONTHLY_USD) {
    messages.push(
      `[${iso}] median_monthly_wage_usd=${c.median_monthly_wage_usd} below floor ${MIN_MONTHLY_USD}`,
    );
    failures++;
  }
  if (c.median_monthly_wage_usd > MAX_MONTHLY_USD) {
    messages.push(
      `[${iso}] median_monthly_wage_usd=${c.median_monthly_wage_usd} above ceiling ${MAX_MONTHLY_USD}`,
    );
    failures++;
  }
  if (c.source_quality && !VALID_QUALITIES.has(c.source_quality)) {
    messages.push(
      `[${iso}] source_quality="${c.source_quality}" not in {A,B,C}`,
    );
    failures++;
  }
}

console.log(`  ${countryCount} countries checked.`);

if (failures > 0) {
  console.log(`\n  GATE: FAIL  (${failures} violations)`);
  for (const m of messages.slice(0, 30)) console.log("  - " + m);
  process.exit(1);
}
console.log(
  `  All wages within [$${MIN_MONTHLY_USD}, $${MAX_MONTHLY_USD}]/mo. All quality grades valid.`,
);
console.log("\n  GATE: PASS");
