/**
 * verify_stated_totals.mjs , a count stated beside the thing it counts.
 *
 * THE DEFECT THIS EXISTS FOR. `data/cities/city_list_v1.json` carried a
 * `totals` block saying 200 and a `continent_split` summing to 200, while its
 * `cities` array held 252. The split even used region codes (NA, EU, MENA) that
 * appear nowhere in the data, which dates it to a plan for the file rather than
 * to the file. Both were dormant: nothing in `src/` read either. That is the
 * only reason a wrong number had not been published.
 *
 * A stated total beside an array is a second home for one fact, and the two
 * drift the first time the array grows. The fix was to delete both blocks
 * rather than recompute them, because a recomputed total goes stale again the
 * next time a city is added, whereas `array.length` cannot.
 *
 * WHY THE CHECK IS NARROW, and this is the important part. The obvious version
 * of this script, compare every totals-shaped object to every array in the
 * file, produced sixteen hits of which fifteen were false. Every `data/quality`
 * report has a `totals` block describing a POPULATION (425,479 cells scanned)
 * beside an array holding a SAMPLE (264 rows). Comparing those is meaningless,
 * and a checker that cries wolf fifteen times out of sixteen gets switched off.
 *
 * So this only fires on the unambiguous case: an explicit numeric `total` (or
 * `count`) sitting in the same object as exactly one array, where the file is
 * not an audit report. That is the shape where the total can only plausibly be
 * counting that array.
 *
 * Usage: node scripts/verify_stated_totals.mjs
 * Exit 1 on any mismatch.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "data");

/* Audit reports legitimately state a population beside a sample. They are
   generated, nothing renders them, and they are not the shape this guards. */
const SKIP_DIRS = new Set(["quality", "audit", "snapshots", "research"]);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(p, out);
    } else if (e.name.endsWith(".json")) {
      out.push(p);
    }
  }
  return out;
}

const problems = [];
const files = fs.existsSync(ROOT) ? walk(ROOT) : [];

for (const file of files) {
  let json;
  try {
    json = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    continue; // a malformed file is another gate's problem
  }
  if (!json || typeof json !== "object" || Array.isArray(json)) continue;

  const arrays = Object.entries(json).filter(([, v]) => Array.isArray(v));
  if (arrays.length !== 1) continue; // ambiguous: which array would it count?
  const [arrayKey, arrayValue] = arrays[0];

  for (const [key, value] of Object.entries(json)) {
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;
    const stated = value.total ?? value.count;
    if (typeof stated !== "number") continue;
    if (stated !== arrayValue.length) {
      problems.push({
        file: path.relative(process.cwd(), file),
        stated: `${key}.${value.total != null ? "total" : "count"} = ${stated}`,
        actual: `${arrayKey}.length = ${arrayValue.length}`,
      });
    }
  }
}

console.log("=== verify_stated_totals ===");
console.log(`  Scanned: ${files.length} files under data/, skipping ${[...SKIP_DIRS].join(", ")}`);

if (problems.length === 0) {
  console.log("  No stated total disagrees with the array beside it.\n");
  console.log("  GATE: PASS");
  process.exit(0);
}

console.log(`  Mismatches: ${problems.length}\n`);
for (const p of problems) {
  console.log(`  ${p.file}`);
  console.log(`    stated ${p.stated}`);
  console.log(`    actual ${p.actual}`);
}
console.log(
  "\n  Fix by deleting the stated total, not by recomputing it. A recomputed\n" +
    "  total goes stale the next time the array grows; array.length cannot.\n",
);
console.log("  GATE: FAIL");
process.exit(1);
