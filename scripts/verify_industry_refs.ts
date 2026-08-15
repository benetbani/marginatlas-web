/**
 * verify_industry_refs , a hardcoded trade must be the trade you meant.
 *
 * slugToIndustry does not fail on an unknown string. It falls through to a
 * fuzzy token match and RETURNS SOMETHING. So a reference written from memory
 * rather than from the taxonomy does not 404, it silently resolves to a
 * different business:
 *
 *   "metal-products-manufacturing"  ->  wood_products_mfg
 *   "specialty_retail"              ->  specialty_food_production
 *
 * That is this project's worst failure mode by its own reckoning, the one the
 * geo-link gate was written for: another subject's data handed to the reader
 * with nothing on screen to notice. Ids written from memory have now turned up
 * in four separate places (the /learn tags, CHARACTER_HEADLINE on the
 * neighborhood page, the popular-cell rotation, and REP_BY_TAG), which is why
 * this is a gate rather than four fixes.
 *
 * WHAT IT ALLOWS. Fuzzy resolution is fine when it lands on the trade the
 * literal names: "fabricated-metal-mfg" reaching fabricated_metal_mfg is the
 * mechanism working. What is not fine is a DISTINCTIVE TOKEN of the literal
 * going missing from the industry it resolved to. "metal" does not appear
 * anywhere in "wood products manufacturing", and that absence is the signal.
 *
 * So the test is not "did it resolve" (everything resolves) and not "was it
 * fuzzy" (fuzzy is often right). It is "did the thing you named survive the
 * resolution".
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

import {
  INDUSTRY_BY_ID,
  SLUG_TO_INDUSTRY,
  INDUSTRY_SLUG_ALIASES,
  slugToIndustry,
  industryToSlug,
} from "../src/lib/taxonomy";
import { newCommentState, stripComments } from "./lib/strip_comments";

const PROJECT_ROOT = process.cwd();
const SRC = resolve(PROJECT_ROOT, "src");

/**
 * Files whose industry strings are keys into their own lookup table rather
 * than taxonomy references, so they never reach slugToIndustry's fuzzy tier.
 */
const EXEMPT: Array<[string, string]> = [
  [
    "src/lib/learn/articles.ts",
    "relatedIndustryIds are keys into REP_BY_TAG in learn_view, a curated table of 24 tags mapped to a real industry and a representative city. resolveTag consults it first, so these strings are that table's vocabulary, not taxonomy ids",
  ],
];

/** Tokens too generic to carry meaning on their own. */
const STOPWORDS = new Set([
  "services",
  "service",
  "manufacturing",
  "mfg",
  "products",
  "product",
  "shops",
  "shop",
  "stores",
  "store",
  "business",
  "businesses",
  "other",
  "general",
  "misc",
  "and",
]);

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 4 && !STOPWORDS.has(t));
}

type Hit = { file: string; line: number; literal: string; to: string; text: string };

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (p.endsWith(".ts") || p.endsWith(".tsx")) acc.push(p);
  }
  return acc;
}

/** The field shapes the real defects were written in. */
const PATTERNS: RegExp[] = [
  /\bindustry(?:_id|Id|Slug)?\s*:\s*["']([a-z0-9][a-z0-9_-]{2,})["']/g,
];

const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** True when the literal resolves canonically, by alias, or as a literal id. */
function resolvesExactly(v: string): boolean {
  if (INDUSTRY_BY_ID[v]) return true;
  const n = norm(v);
  return !!SLUG_TO_INDUSTRY[n] || !!INDUSTRY_SLUG_ALIASES[n];
}

const exemptSet = new Set(EXEMPT.map(([f]) => f));
const hits: Hit[] = [];

for (const file of walk(SRC)) {
  const rel = file.replace(PROJECT_ROOT, "").replace(/^[\\/]/, "").replace(/\\/g, "/");
  if (rel.includes("lib/taxonomy") || exemptSet.has(rel)) continue;
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
    if (lines[i].includes("allow-industry-ref")) continue;
    for (const re of PATTERNS) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(code)) !== null) {
        const literal = m[1];
        if (resolvesExactly(literal)) continue;
        const ind = slugToIndustry(literal.replace(/_/g, "-"));
        if (!ind) {
          hits.push({
            file: rel,
            line: i + 1,
            literal,
            to: "(nothing)",
            text: lines[i].trim().slice(0, 110),
          });
          continue;
        }
        // Fuzzy, but did the distinctive part of the name survive?
        const want = tokens(literal);
        const got = new Set([...tokens(ind.id), ...tokens(ind.name)]);
        const lost = want.filter((t) => !got.has(t));
        if (want.length > 0 && lost.length > 0) {
          hits.push({
            file: rel,
            line: i + 1,
            literal,
            to: `${ind.id} (${industryToSlug(ind.id)}) , lost "${lost.join('", "')}"`,
            text: lines[i].trim().slice(0, 110),
          });
        }
      }
    }
  }
}

if (hits.length === 0) {
  console.log(
    `[verify_industry_refs] PASS: every hardcoded trade resolves to the trade ` +
      `it names (${EXEMPT.length} documented exemption(s))`,
  );
  process.exit(0);
}

console.error(
  `[verify_industry_refs] FAIL: ${hits.length} trade reference(s) that resolve ` +
    `to a DIFFERENT business:`,
);
for (const h of hits) {
  console.error(`  ${h.file}:${h.line}`);
  console.error(`    "${h.literal}"  ->  ${h.to}`);
}
console.error(
  "\nslugToIndustry never fails; it falls back to a fuzzy token match and " +
    "\nreturns the nearest thing. A reference written from memory therefore " +
    "\nreads as working while pointing at another business. Use the id or the " +
    "\ncanonical slug from the taxonomy, or add an explicit entry to " +
    "\nINDUSTRY_SLUG_ALIASES if the spelling is one readers really use.",
);
process.exit(1);
