/**
 * verify_cross_geography_guard - prebuild gate (data-sanity, 2026-06-13).
 *
 * THE FAILURE THIS GUARDS: the founder named "supermarkets in Uganda make more
 * than those in the Netherlands". The root cause was surfaces that rank or
 * leader-mark RAW USD money across countries, where a figure is not adjusted
 * for local prices, so a poorer country can appear to out-earn a richer one.
 * The repo's shared trust gate is `isTrustedLocalCell` (src/lib/cells/trust.ts)
 * plus the median-relative fence in activity_board.ts; the fix was to route
 * every cross-place money surface through one of those, and to keep US states
 * (one currency, one price level) in a separate cohort from foreign countries.
 *
 * This gate has two layers:
 *
 *   1. INVARIANTS. Assert the specific guards added on 2026-06-13 are still in
 *      place on the four surfaces that carried the bug. These are exact-string
 *      checks with zero false positives; if a refactor removes a guard, the
 *      gate names the file and the missing token so it cannot silently regress.
 *
 *   2. HEURISTIC TRIPWIRE. Flag any NEW file under src/app or src/components
 *      that sorts by a raw-money field AND pulls a cross-country collection,
 *      without referencing any trust token. Conservative by design (it only
 *      fires when both signals are present and no guard token is found), with a
 *      per-line opt-out `// allow-cross-geo` for a reviewed exception.
 *
 * Run: npx tsx scripts/verify_cross_geography_guard.ts
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const PROJECT_ROOT = process.cwd();
const rel = (p: string) => p.replace(PROJECT_ROOT, ".").replace(/\\/g, "/");

type Failure = { file: string; detail: string };
const failures: Failure[] = [];

/** Read a repo-relative file, or null when absent. */
function read(relPath: string): string | null {
  const abs = resolve(PROJECT_ROOT, relPath);
  if (!existsSync(abs)) return null;
  try {
    return readFileSync(abs, "utf-8");
  } catch {
    return null;
  }
}

/**
 * Assert that `file` contains every `needle`. A missing file or a missing
 * needle records a failure naming exactly what to restore.
 */
function mustContain(relPath: string, needles: string[], why: string): void {
  const src = read(relPath);
  if (src == null) {
    failures.push({
      file: relPath,
      detail: `expected file is missing (it carries a cross-geography guard: ${why})`,
    });
    return;
  }
  for (const needle of needles) {
    if (!src.includes(needle)) {
      failures.push({
        file: relPath,
        detail: `missing guard token \`${needle}\` (${why})`,
      });
    }
  }
}

/** Assert a file does NOT exist (a deleted cross-geo footgun must stay gone). */
function mustNotExist(relPath: string, why: string): void {
  if (existsSync(resolve(PROJECT_ROOT, relPath))) {
    failures.push({
      file: relPath,
      detail: `this dead cross-geography component was deleted on 2026-06-13 and must not return without the trust gate (${why})`,
    });
  }
}

// --- Layer 1: invariants on the four fixed surfaces -------------------------

// 1. The /compare API must gate absolute-money fields with the trust helper, so
//    an extrapolated / country-level read no longer emits revenue or take-home.
mustContain(
  "src/app/api/cell-lookup/route.ts",
  ["isTrustedLocalCell", "moneyTrusted"],
  "money fields must dash for untrusted / extrapolated / country-level cells",
);

// 2. The /compare grid must suppress the leader mark and the biggest-difference
//    callout when columns span countries, and show the price caveat.
mustContain(
  "src/app/(site)/compare/CompareClient.tsx",
  ["spansCountries", "not adjusted for local prices"],
  "no cross-country leader mark; show the price caveat",
);

// 3. The city-vs-city page must label its modeled bars and keep the caveat.
mustContain(
  "src/app/(site)/compare/cities/[pair]/page.tsx",
  ["not adjusted for local prices"],
  "the modeled side-by-side bars must carry the local-price caveat",
);

// 4. The activity "where it works" table must split into like-for-like cohorts
//    rather than print one global rank that mixes states and countries.
mustContain(
  "src/lib/scores/activity_board.ts",
  ["cohort"],
  "place rows must carry a like-for-like cohort tag",
);
mustContain(
  "src/app/(site)/industries/[industry]/page.tsx",
  ["stateRows", "bandSummary"],
  "the revenue band + 'where it earns most' must come from the trusted US-state " +
    "cohort only; the extrapolated country cohort was retired (its per-firm " +
    "revenue is not trustworthy enough to rank or to headline)",
);

// 5. The deleted dead footguns must stay deleted (they sorted raw cross-country
//    revenue with no trust gate).
mustNotExist(
  "src/components/comparison/MultiCellComparisonTable.tsx",
  "ranked raw cross-country revenue",
);
mustNotExist(
  "src/components/comparison/CountryComparisonPage.tsx",
  "ranked raw cross-country money",
);
mustNotExist(
  "src/components/comparison/IndustryComparisonPage.tsx",
  "ranked raw cross-country money",
);

// --- Layer 2: heuristic tripwire for new cross-country money rankings --------

const SCAN_DIRS = ["src/app", "src/components"].map((d) =>
  resolve(PROJECT_ROOT, d),
);

// A sort whose comparator touches one of these is a money sort.
const MONEY_TOKENS = [
  "revenue",
  "take_home",
  "takeHome",
  "net_profit",
  "netProfit",
  "owner_take_home",
  "payroll_per_employee",
];

// Files that pull one of these are reaching across countries.
const CROSS_COUNTRY_TOKENS = [
  "acrossCountries",
  "AcrossCountries",
  "getSameIndustryAcrossCountries",
  "cross_country",
  "crossCountry",
];

// Any one of these means the file already routes through a recognized guard.
const TRUST_TOKENS = [
  "isTrustedLocalCell",
  "summarizeActivityPlaces",
  "withinFence",
  "spansCountries",
  "cohort",
  "clipOutliers",
];

function walk(dir: string, acc: string[] = []): string[] {
  let entries: string[] = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of entries) {
    const p = join(dir, name);
    let s;
    try {
      s = statSync(p);
    } catch {
      continue;
    }
    if (s.isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      walk(p, acc);
    } else if (p.endsWith(".tsx") || p.endsWith(".ts")) {
      acc.push(p);
    }
  }
  return acc;
}

const has = (src: string, tokens: string[]) => tokens.some((t) => src.includes(t));

for (const dir of SCAN_DIRS) {
  for (const file of walk(dir)) {
    const src = read(rel(file).slice(2)); // strip leading "./"
    if (src == null) continue;
    if (src.includes("allow-cross-geo")) continue; // reviewed exception
    if (!src.includes(".sort(")) continue;
    if (!has(src, CROSS_COUNTRY_TOKENS)) continue;
    if (has(src, TRUST_TOKENS)) continue; // already guarded

    // Confirm at least one sort sits near a money token (same or next 2 lines),
    // so a non-money sort in a cross-country file does not false-positive.
    const lines = src.split("\n");
    let moneySort = false;
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].includes(".sort(")) continue;
      const window = lines.slice(i, i + 3).join("\n");
      if (MONEY_TOKENS.some((t) => window.includes(t))) {
        moneySort = true;
        break;
      }
    }
    if (moneySort) {
      failures.push({
        file: rel(file),
        detail:
          "sorts by a raw-money field across countries with no trust gate. " +
          "Route the figures through isTrustedLocalCell / the cohort split, or " +
          "if this is genuinely within one price regime, append // allow-cross-geo on the sort line.",
      });
    }
  }
}

// --- Report -----------------------------------------------------------------

if (failures.length === 0) {
  console.log(
    "[verify_cross_geography_guard] PASS: cross-place money is gated; no " +
      "unguarded cross-country money ranking found.",
  );
  process.exit(0);
}

console.error(
  `[verify_cross_geography_guard] FAIL: ${failures.length} issue(s):`,
);
for (const f of failures) {
  console.error(`  ${f.file}: ${f.detail}`);
}
console.error(
  "\nWhy: raw USD figures are not price-adjusted, so ranking them across " +
    "countries lets a poorer place appear to out-earn a richer one. Gate the " +
    "money with isTrustedLocalCell or keep US states and countries in separate " +
    "cohorts.",
);
process.exit(1);
