/**
 * verify_no_slot_counting , the coverage report counts SLOTS, not facts.
 *
 * data/quality/coverage_v2.json carries 264 country rows and 169 of them are an
 * empty grid: 264 cells (44 industries x 6 size bands), zero geographies, no
 * confidence tier, no quality score, year_range [null, null]. Allocated, never
 * filled.
 *
 * So `regional_cells + extrapolated_cells` is an allocation count, and every
 * surface that read it as an evidence count published a number that does not
 * exist:
 *
 *   /coverage/<iso2>  credited Australia with 80,992 benchmarks (80,728 hold a
 *                     tier) and ran its tier bars against that denominator, so
 *                     they summed short of 100% on 52 of 94 countries
 *   /coverage         listed World Bank aggregates as countries and inflated
 *                     the same 52
 *   /world            counted Andorra, Armenia, Bahrain, Kuwait, Montenegro and
 *                     Paraguay as covered on 264 phantom cells each, and
 *                     credited each with the 44 activities the empty grid was
 *                     shaped for
 *
 * The test that separates the two is whether a cell carries a confidence tier.
 * sum(tiers) is the evidence count; the stored totals are not.
 *
 * This gate bans the expression itself, because the bug is not a wrong constant
 * anywhere, it is one arithmetic expression that reads as obviously correct.
 * Route everything through lib/coverage/report, which already applies the tier
 * test, canonicalises ISO-3 and agency codes, and drops rows the site cannot
 * name.
 *
 * Per-line opt-out: append `// allow-slot-count` with a reason. Legitimate when
 * you are genuinely reporting allocation, e.g. an admin view of pipeline
 * capacity rather than a reader-facing benchmark count.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

import { newCommentState, stripComments } from "./lib/strip_comments";

const PROJECT_ROOT = process.cwd();
const SCAN_DIRS = ["src"].map((d) => resolve(PROJECT_ROOT, d));

/**
 * The two field names joined by `+` on one line, in either order.
 *
 * The first attempt tried to model the receiver as an optional `\w+\.` prefix
 * and missed `report!.countries[0].extrapolated_cells + ...` because a real
 * expression carries non-null assertions and index access. Matching the two
 * identifiers and the operator, and not trying to parse what sits between them,
 * catches every spelling.
 *
 * The word boundaries are load-bearing. Without them this matched an admin
 * audit view summing `regional_cells_scanned + ... + extrapolated_cells_scanned`,
 * which are scan tallies from a different pipeline and a different question.
 * Underscore is a word character, so \b keeps the suffixed names out.
 */
const SLOT_SUM =
  /(\bregional_cells\b[^\n]{0,60}\+[^\n]{0,60}\bextrapolated_cells\b)|(\bextrapolated_cells\b[^\n]{0,60}\+[^\n]{0,60}\bregional_cells\b)/;

type Hit = { file: string; line: number; text: string };

function walk(dir: string, acc: string[] = []): string[] {
  let entries: string[] = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of entries) {
    // Skipped by PATH, never by bare name: a name-matched skip once hid three
    // real directories from a sibling gate for months.
    if (name === "node_modules" || name === ".next") continue;
    const p = join(dir, name);
    let s;
    try {
      s = statSync(p);
    } catch {
      continue;
    }
    if (s.isDirectory()) walk(p, acc);
    else if (p.endsWith(".ts") || p.endsWith(".tsx")) acc.push(p);
  }
  return acc;
}

const hits: Hit[] = [];

for (const dir of SCAN_DIRS) {
  for (const file of walk(dir)) {
    let src: string;
    try {
      src = readFileSync(file, "utf-8");
    } catch {
      continue;
    }
    const lines = src.split("\n");
    // Prose describing the banned expression is not the banned expression, and
    // this file's own docstring is the proof: the first version of this gate
    // flagged its own explanation.
    const state = newCommentState();
    for (let i = 0; i < lines.length; i++) {
      const code = stripComments(lines[i], state);
      if (lines[i].includes("allow-slot-count")) continue;
      if (SLOT_SUM.test(code)) {
        hits.push({
          file: file.replace(PROJECT_ROOT, "."),
          line: i + 1,
          text: lines[i].trim().slice(0, 140),
        });
      }
    }
  }
}

if (hits.length === 0) {
  console.log(
    "[verify_no_slot_counting] PASS: no surface adds allocated cells to " +
      "measured ones",
  );
  process.exit(0);
}

console.error(
  `[verify_no_slot_counting] FAIL: ${hits.length} slot-count expression(s):`,
);
for (const h of hits) console.error(`  ${h.file}:${h.line}: ${h.text}`);
console.error(
  "\nregional_cells + extrapolated_cells counts allocated cells, including " +
    "\n169 report rows that hold nothing at all. Use getCoverageRows() or " +
    "\ngetCoverageFor() from @/lib/coverage/report, whose cellCount is the " +
    "\nnumber of cells carrying a confidence tier. If you really do mean " +
    "\nallocation, append // allow-slot-count with a reason.",
);
process.exit(1);
