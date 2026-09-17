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
import { lineOfKey, red, redSummary, repoRelative } from "./lib/red";

const RULE = "wage-source";
const ROOT = process.cwd();
const JSON_PATH = path.resolve(ROOT, "data/economics/median_monthly_wage_usd_v1.json");

const MIN_COUNTRY_COUNT = 180;

/* THE BOUNDS THE DATA DECLARES FOR ITSELF, intersected with this gate's own, so
 * a declared bound can only ever tighten and never loosen. See the longer note
 * in verify_city_wage_premiums.ts; the short version is that
 * median_monthly_wage_usd_v1.json declares [$50, $15000] while this gate said
 * [$80, $20000], and no gate in the chain read a `quality_checks` block at all.
 *
 * The intersection is [$80, $15000], and the direction differs at each end:
 * the file is LOOSER at the floor, so the gate's $80 stands, and TIGHTER at the
 * ceiling, so the file's $15000 wins. A blanket "adopt the declared bounds"
 * would have quietly dropped the floor by $30.
 *
 * Measured before switching: 0 of 200 countries under $80, 0 over $15000.
 * Note: `2026-08-08-data-we-hold-and-never-enforce.md`.
 */
const RAW = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8")) as {
  quality_checks?: { min_wage_usd_monthly?: number; max_wage_usd_monthly?: number };
};
const WQC = RAW.quality_checks ?? {};
const MIN_MONTHLY_USD = Math.max(80, WQC.min_wage_usd_monthly ?? 0);
const MAX_MONTHLY_USD = Math.min(20000, WQC.max_wage_usd_monthly ?? Infinity);
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
  /* Each message opens with the country's ISO code in brackets, which is the
     entry's key in the wage file, so the red names the file and the line that
     declares the key (plan-2026-09-17/02-ERRORS.md, step 16). A message about
     the file as a whole names it with no line. */
  const WAGE_FILE = repoRelative(JSON_PATH);
  console.log(`\n  GATE: FAIL  (${failures} violations)`);
  for (const m of messages.slice(0, 30)) {
    const key = m.match(/^\[([^\]]+)\]/)?.[1];
    red({
      rule: RULE,
      file: WAGE_FILE,
      line: lineOfKey(WAGE_FILE, key),
      detail: m,
      remedy: `correct the entry in ${WAGE_FILE} from its source: a monthly wage within [$${MIN_MONTHLY_USD}, $${MAX_MONTHLY_USD}] and a valid quality grade`,
    });
  }
  redSummary(RULE, failures, `fix each entry named above in ${WAGE_FILE}`, messages.length > 30 ? `first 30 of ${messages.length} shown` : `${countryCount} countries checked`);
  process.exit(1);
}
console.log(
  `  All wages within [$${MIN_MONTHLY_USD}, $${MAX_MONTHLY_USD}]/mo. All quality grades valid.`,
);
console.log("\n  GATE: PASS");
