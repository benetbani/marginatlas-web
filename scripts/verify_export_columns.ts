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
import { red, redSummary } from "./lib/red";

const RULE = "export-columns";
const ROUTE_REL = "src/app/api/export-csv/route.ts";

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
/* Every failure names the route file and the line of the column or the field it
   is about (plan-2026-09-17/02-ERRORS.md, step 16); a failure about the whole
   file names it with no line. */
type Failure = { line?: number; detail: string; remedy: string };
const failures: Failure[] = [];
const lineOf = (needle: RegExp | string): number | undefined => {
  const at = typeof needle === "string" ? src.indexOf(needle) : src.search(needle);
  return at === -1 ? undefined : src.slice(0, at).split("\n").length;
};

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
  failures.push({
    detail: "no columns found at all; the export's shape changed and this gate can no longer see it, and a gate that cannot find its subject passes forever",
    remedy: "emit the header as an array literal joined with commas or as one literal comma-separated string, the two shapes this gate reads",
  });
}

for (const c of [...columns].sort()) {
  if (!ALLOWED.has(c)) {
    failures.push({
      line: lineOf(`"${c}"`),
      detail: `column "${c}" is emitted and is not on the allowlist`,
      remedy: "drop the column, or if it is safe to publish add it to ALLOWED in scripts/verify_export_columns.ts and say why",
    });
  }
}

/* 2. No raw provenance field may be referenced. */
for (const pat of FORBIDDEN_FIELDS) {
  const re = new RegExp(pat);
  if (re.test(src)) {
    failures.push({
      line: lineOf(re),
      detail: `references a forbidden provenance field matching /${pat}/; a raw string can carry a source-agency name no gate has vetted`,
      remedy: "emit the derived tier via deriveCoverageTier() instead",
    });
  }
}

if (failures.length) {
  console.error(
    "verify_export_columns: /api/export-csv is public and unauthenticated. Its column\n" +
      "   list is a publishing decision, not an implementation detail.",
  );
  for (const f of failures) red({ rule: RULE, file: ROUTE_REL, line: f.line, detail: f.detail, remedy: f.remedy });
  redSummary(RULE, failures.length, `fix each line named above in ${ROUTE_REL}`, "in the public CSV export");
  process.exit(1);
}

console.log(`verify_export_columns: PASS. ${columns.size} column(s) checked, all allowlisted.`);
