/**
 * ONE PRICE, WRITTEN ONCE (milestone 2; masterplan step 12; his decision of 2026-10-09 over ruling 14's price): Pro's $48, $456 and $38 are typed in plan.ts only, and no older price stands anywhere.
 * His interview of 2026-09-26 (ruling 14) made it one plan, Pro, and his decision of 2026-10-09 priced it $48 a month or $456 a
 * year, led with as $38 a month, billed yearly, which replaced the $238 year. The June plans (Basic $37 and Premium $77, their
 * annual $31 and $64 a month, $372 and $768 a year), the older $19, $78 and $150 and the $238 year still stood in a dozen files.
 * This walks src/, content/ and README.md, comments stripped, and reds on:
 *  - an old price literal anywhere;
 *  - a $38, $48 or $456 literal outside src/lib/monetization/plan.ts (a price prints through PRO, priceLine or the plan's
 *    other lines, never typed twice; the saving between them is checked on the rendered page, tests/monetization/pricing_page.test.ts);
 *  - the words Basic and Premium outside the monetization and billing folders where they meant the June tiers (elsewhere they
 *    mean other things: the kit's budget tier, the decide page's "Premium pricing").
 *
 * Run: npx tsx tests/monetization/one_price.test.ts [--list]
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "one-price";
const REMEDY = "print the price through PRO, priceLine or the plan's other lines (src/lib/monetization/plan.ts); the June tiers, their prices and the $238 year are gone";
const ROOTS = ["src", "content"];
const SKIP = ["src/app/dev", "src/app/_design"];
const PLAN = "src/lib/monetization/plan.ts";
const TIER_WORDS_ALLOWED = [
  "src/components/monetization/",
  "src/components/billing/",
  "src/components/home/UpgradeTeaser.tsx",
  "src/components/account/",
  "src/app/(site)/account/",
  "src/app/(site)/pricing/",
  "src/lib/pricing/",
  "src/lib/monetization/",
];

/* A figure in thousands or millions ($150K, $31K) is a benchmark, not a price. $238 is the year ruling 14 priced and the
   decision of 2026-10-09 replaced; Pro's three printed prices are the month ($48), the year ($456) and the year by the month
   ($38), all written once, in plan.ts. */
const OLD_PRICES = /\$(?:37|77|31|64|372|768|78|150|238)(?![\d.,KkMmBb])|\$19\/mo/;
const PRO_PRICES = /\$(?:38|48|456)(?![\d.,KkMmBb])/;
const TIER_WORDS = /\b(?:Basic|Premium)\b/;

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name).replace(/\\/g, "/");
    if (p.includes("node_modules") || SKIP.some((s) => p === s || p.startsWith(`${s}/`))) continue;
    if (statSync(p).isDirectory()) walk(p, acc);
    /* Code and prose; the data files hold benchmarks (a $38 dinner in the London seed), never the plan's price. */
    else if (/\.(ts|tsx|md|mdx)$/.test(p)) acc.push(p);
  }
  return acc;
}

type Finding = { file: string; line: number; what: string; text: string };
const findings: Finding[] = [];
const files = [...ROOTS.flatMap((r) => (existsSync(r) ? walk(r) : [])), "README.md"].filter((f) => existsSync(f));
for (const file of files) {
  const raw = readFileSync(file, "utf8").split("\n");
  const lines = /\.(ts|tsx)$/.test(file) ? stripCommentLines(raw) : raw;
  lines.forEach((l, i) => {
    if (OLD_PRICES.test(l)) findings.push({ file, line: i + 1, what: "an old price", text: l.trim() });
    if (PRO_PRICES.test(l) && file !== PLAN) findings.push({ file, line: i + 1, what: "Pro's price typed outside plan.ts", text: l.trim() });
    if (TIER_WORDS.test(l) && /\.(ts|tsx)$/.test(file) && TIER_WORDS_ALLOWED.some((d) => file.startsWith(d)) && /\b(?:Basic|Premium)\b/.test(l)) {
      findings.push({ file, line: i + 1, what: "a June tier's name", text: l.trim() });
    }
  });
}

if (process.argv.includes("--list")) for (const f of findings) console.log(`${f.file}:${f.line}  [${f.what}]  ${f.text.slice(0, 140)}`);
for (const f of findings) red({ rule: RULE, file: f.file, line: f.line, detail: `${f.what}: ${f.text.slice(0, 100)}`, remedy: REMEDY });
if (files.length < 500) {
  red({ rule: RULE, file: "tests/monetization/one_price.test.ts", detail: `read only ${files.length} files`, remedy: "check the walk still reaches src and content" });
  process.exit(1);
}
if (findings.length > 0) { redSummary(RULE, findings.length, REMEDY, "old prices or tier names remain"); process.exit(1); }
console.log(`PASS  ${files.length} files: no old price, Pro's price only in plan.ts, no June tier name where it meant a tier`);
