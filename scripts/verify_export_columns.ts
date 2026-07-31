/**
 * scripts/verify_export_columns.ts
 *
 * WHAT LEAVES THE SITE AS A FILE IS STILL PUBLISHING.
 *
 * `/api/export-csv` is public and unauthenticated. Anyone with the URL gets a
 * CSV. That makes its column list a publishing decision, and publishing
 * decisions on this project are governed by rules that a route handler does not
 * otherwise inherit:
 *
 *   - no source-agency name may reach a reader (`verify_no_source_agencies`),
 *   - no figure may be published whose provenance cannot be shown.
 *
 * The obvious way to add provenance to the export is to emit `coverage_source`.
 * THAT IS A TRAP, and it is why this gate exists. Two of its three values are
 * our own safe sentences, written for display. The third comes straight off the
 * database row:
 *
 *     src/lib/cells.ts:215
 *     coverage_source: (r.coverage_source as string) || "National business statistics"
 *
 * Nobody in this repository can say what that column holds for every row. If it
 * holds an agency name for any of them, the export publishes it, and the gate
 * that exists to prevent exactly that only reads components and copy.
 *
 * So the export emits a DERIVED tier from our own controlled vocabulary, via
 * `deriveCoverageTier`, and never a raw provenance string. This gate makes that
 * structural rather than remembered.
 *
 * WHAT IT CHECKS.
 *   1. Every column the export emits is on the allowlist below.
 *   2. The export never references a raw provenance field at all.
 *
 * Adding a column means adding it here, deliberately, which is the point.
 *
 * Usage: npx tsx scripts/verify_export_columns.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROUTE = resolve(process.cwd(), "src/app/api/export-csv/route.ts");

/**
 * Columns the export is permitted to emit.
 * `coverage` is the DERIVED tier (measured / regional / estimated / modeled),
 * not a database string. See the note above before adding anything.
 */
const ALLOWED = new Set([
  "country",
  "region",
  "industry",
  "year",
  "size_band",
  "coverage",
  "n_enterprises",
  "n_employees",
  "revenue_per_firm_usd",
  "rev_p10_usd",
  "rev_p25_usd",
  "rev_p50_usd",
  "rev_p75_usd",
  "rev_p90_usd",
  "payroll_per_employee_usd",
  "quality_score",
]);

/**
 * Fields that must never appear in the export at all, raw or derived.
 * `sources` and `notes` are marked "NEVER rendered" / internal in
 * spine2_types.ts; `coverage_source` can carry an unvetted database string.
 */
const FORBIDDEN_FIELDS = ["coverage_source", "\\.sources\\b", "\\.notes\\b"];

const src = readFileSync(ROUTE, "utf8");
const failures: string[] = [];

/* 1. Collect the column names the file emits. Two shapes are used: an array
      literal joined with commas, and a literal comma-separated header string. */
const columns = new Set<string>();

for (const m of src.matchAll(/\[([^\]]*?)\]\s*\.join\(","\)/gs)) {
  for (const lit of m[1].matchAll(/"([a-z0-9_]+)"/g)) columns.add(lit[1]);
}
for (const m of src.matchAll(/"([a-z0-9_]+(?:,[a-z0-9_]+)+)"/g)) {
  for (const c of m[1].split(",")) columns.add(c);
}

if (columns.size === 0) {
  failures.push(
    "Found no columns at all. The export's shape changed and this gate can no\n" +
      "      longer see it, which is a failure: a gate that cannot find its subject\n" +
      "      passes forever.",
  );
}

for (const c of [...columns].sort()) {
  if (!ALLOWED.has(c)) {
    failures.push(
      `Column "${c}" is emitted but not on the allowlist.\n` +
        `      If it is safe to publish, add it to ALLOWED in this file and say why.`,
    );
  }
}

/* 2. No raw provenance field may be referenced. */
for (const pat of FORBIDDEN_FIELDS) {
  const re = new RegExp(pat);
  if (re.test(src)) {
    failures.push(
      `The export references a forbidden provenance field matching /${pat}/.\n` +
        `      Emit the derived tier via deriveCoverageTier() instead. A raw string\n` +
        `      can carry a source-agency name that no gate here has vetted.`,
    );
  }
}

if (failures.length) {
  console.error(`x verify_export_columns: ${failures.length} problem(s) in the public CSV export.\n`);
  for (const f of failures) console.error("   " + f);
  console.error(
    "\n   /api/export-csv is public and unauthenticated. Its column list is a\n" +
      "   publishing decision, not an implementation detail.",
  );
  process.exit(1);
}

console.log(`verify_export_columns: PASS. ${columns.size} column(s) checked, all allowlisted.`);
