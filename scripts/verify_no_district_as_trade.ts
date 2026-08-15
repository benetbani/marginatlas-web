/**
 * verify_no_district_as_trade , a district slug is not an industry slug.
 *
 * The route tree puts a district in the THIRD position of a four-segment URL:
 *
 *   /{country}/{geo}/{industry}            a trade in a place
 *   /{country}/{city}/{district}/{trade}   a trade in a district
 *
 * So a three-segment path ending in a district lands on the TRADE route with
 * the district slug where an industry belongs. Of the 194 district slugs in
 * neighborhoods_v1.json, 191 answer 404 there and three answer 200 with a trade
 * page: "Back to Garden District" opened building and garden supply stores,
 * Business Bay opened office and business support, Short North opened
 * short-term rental management.
 *
 * That one wrong shape had been copied to FIVE call sites before this gate
 * existed: the neighbourhood cell page's onward nav and its breadcrumb (which
 * also published it as BreadcrumbList JSON-LD), every district card on all 252
 * city pages, every card on the neighbourhoods hub, and the district picker's
 * "Everything in {district}" link. Fixing four of them and missing the fifth is
 * what made this worth automating rather than repeating.
 *
 * WHAT IT MATCHES. A template-literal path of exactly three interpolated or
 * literal segments whose LAST segment is a district-shaped variable: n.slug,
 * nb.slug, neighborhood, district, hood. Naming is the only signal available
 * without types, and it is a reliable one here because these variables are
 * named for what they hold.
 *
 * The right destination is /cities/{city}/neighborhoods#{district}, the hub
 * entry that actually holds the district, or no link at all.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

import { newCommentState, stripComments } from "./lib/strip_comments";

const PROJECT_ROOT = process.cwd();
const SRC = resolve(PROJECT_ROOT, "src");

/**
 * Exactly `/${a}/${b}/${c}` and then the closing backtick, where c names a
 * district.
 *
 * Each segment is [^}]* rather than [^`]*, which is load-bearing. The first
 * version allowed a segment to swallow later interpolations, so it matched
 * `/${iso2}/${city}/${district}/${trade}` , the CORRECT four-segment form ,
 * and reported seven false positives on the paths this gate exists to protect.
 * Requiring the backtick immediately after the third `}` is what separates
 * "district in the trade slot" from "district in its own slot".
 */
const DISTRICT_AS_TRADE =
  /`\/\$\{[^}]*\}\/\$\{[^}]*\}\/\$\{[^}]*\b(n\.slug|nb\.slug|neighborhood|neighbourhood|district|hood)[^}]*\}`/;

type Hit = { file: string; line: number; text: string };

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (p.endsWith(".ts") || p.endsWith(".tsx")) acc.push(p);
  }
  return acc;
}

const hits: Hit[] = [];

for (const file of walk(SRC)) {
  const rel = file.replace(PROJECT_ROOT, "").replace(/^[\\/]/, "").replace(/\\/g, "/");
  let src: string;
  try {
    src = readFileSync(file, "utf-8");
  } catch {
    continue;
  }
  const state = newCommentState();
  const lines = src.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const code = stripComments(lines[i], state);
    if (lines[i].includes("allow-district-path")) continue;
    if (DISTRICT_AS_TRADE.test(code)) {
      hits.push({ file: rel, line: i + 1, text: lines[i].trim().slice(0, 120) });
    }
  }
}

if (hits.length === 0) {
  console.log(
    "[verify_no_district_as_trade] PASS: no district slug sits in the industry position",
  );
  process.exit(0);
}

console.error(
  `[verify_no_district_as_trade] FAIL: ${hits.length} path(s) putting a ` +
    `district where a trade belongs:`,
);
for (const h of hits) console.error(`  ${h.file}:${h.line}\n    ${h.text}`);
console.error(
  "\nThree segments is the TRADE route. A district there mostly 404s, and " +
    "\nsometimes opens another business at 200, which is worse. Link to " +
    "\n/cities/{city}/neighborhoods#{district}, or do not link.",
);
process.exit(1);
