/**
 * scripts/verify_trade_set.ts
 *
 * Prebuild gate , rulebook v1 rule 32: "One shared component and
 * interaction kit, and one fixed set of example businesses (restaurant,
 * grocery, pharmacy, salon, gym, auto repair), reused across all pages.
 * No out-of-context trade examples forced in."
 *
 * ALLOWLIST NOTE: the set is EIGHT since rule 32 v2 (2026-07-12): restaurant,
 * grocery, pharmacy, salon, gym, auto repair, cafe and bar (ALLOWED_RAW
 * below, with the common synonyms collapsing to a canonical member in
 * ALIAS). The first version of this gate held the six of rule 32 v1 and
 * reported cafe and bar like any other out-of-context trade; v2 made them
 * members. If the founder widens or narrows the set again, the fix is a
 * rulebook edit (rule 32 + the changelog), and the ALLOWED_RAW array below
 * should be updated to match , not the other way around.
 *
 * Scans two sources:
 *   1. JSON seed arrays under src/lib/spine-seeds/**\/*.json at the two
 *      canonical example-slate keys (TARGET_KEYS below: everyday_trades,
 *      take_home_trades): a direct array at one of them, OR a `list`/`items`
 *      array nested one level inside an object keyed by one of them (the
 *      seeds' common `{ _meta, read, list: [...] }` wrapper shape).
 *      Elements must look like trade entries (an object carrying a `name`
 *      and/or `slug` string) before being scanned, a shape guard against
 *      false slate detection.
 *
 *      Deliberately NOT scanned: `trades` (competition and benchmark
 *      lists, including `competition.trades` in the country seeds),
 *      `related` (real cell adjacency) and `best_trades` (the
 *      neighborhood-hub per-district lists). They are real per-context
 *      data, deliberately diverse , `best_trades` is the real adapter's
 *      (adapt_hood.ts) ranking from the live per-city trade catalog, never
 *      a fixed set, the opposite of rule 32's "one reused set".
 *   2. PART 3 (plan 2026-10-09, home introduction): the picker's three
 *      examples, HOME_TRY in src/lib/home/destination.ts , the words of
 *      "Or try gyms, salons or cafés in London." (plan 2026-10-10, home
 *      reform), each a link to its London page. The spec draws them from
 *      rule 32's set, so each word is held to it, read from the module
 *      that prints them and never from the form's text; its failures print
 *      under their own heading.
 *      (The form's own placeholder text, "Type a business: ...", is not
 *      scanned: Part 2, which grepped the form, was removed on
 *      2026-07-12 , see below.)
 *
 * Case/plural/accent-insensitive match: lowercase, accents folded ("cafés"
 * is "cafes", plan 2026-10-10), hyphens/underscores/slashes become spaces,
 * then a light depluralize (glasses-style "ies"->"y", trailing "s" stripped
 * otherwise) before comparing to the allowed set.
 *
 * Run: npx tsx scripts/verify_trade_set.ts
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { HOME_TRY } from "../src/lib/home/destination";

const ROOT = process.cwd();
const SEEDS_ROOT = resolve(ROOT, "src", "lib", "spine-seeds");
/** The module Part 3 reads the picker's examples from (HOME_TRY): named as a path literal so the gate registry, which scripts/counts.ts generates from the
 *  literals in each gate's script, lists the file the gate reads (it listed the launcher below, which the gate does not read: final review M7). */
const HOME_TRY_FILE = "src/lib/home/destination.ts";

/* Rule 32 (v2, 2026-07-12): the everyday set is eight, restaurant / grocery /
 * pharmacy / salon / gym / auto repair / cafe / bar, with common synonyms
 * collapsing to a canonical member. Out-of-context trades (dental, law firms,
 * nightclubs, specialty retail) still fail. The recommender launcher is exempt
 * (Part 2 removed below). */
const ALLOWED_RAW = ["restaurant", "grocery", "pharmacy", "salon", "gym", "auto repair", "cafe", "bar"];
/* synonym -> canonical, matched on the normalized form */
const ALIAS: Record<string, string> = {
  "grocery store": "grocery", "convenience shop": "grocery", "convenience store": "grocery",
  "hair and beauty": "salon", "hair beauty": "salon", "hairdresser": "salon", "barber": "salon",
  "fitness": "gym", "sport fitness": "gym", "sports fitness": "gym",
  "pub": "bar", "bar pub": "bar", "coffee shop": "cafe", "coffee": "cafe",
  "mechanic": "auto repair", "car repair": "auto repair", "auto repair shop": "auto repair",
};

/* Accents fold away first, so "cafés" is "cafes" (plan 2026-10-10, home reform): decomposed, the combining marks (U+0300 to
   U+036F) dropped. */
const foldAccents = (s: string): string =>
  [...s.normalize("NFD")].filter((c) => { const n = c.codePointAt(0) ?? 0; return n < 0x300 || n > 0x36f; }).join("");

function normalize(s: string): string {
  let t = foldAccents(s.toLowerCase()).trim();
  t = t.replace(/[&-_/]+/g, " ");
  t = t.replace(/\s+/g, " ").trim();
  if (t.endsWith("ies") && t.length > 3) t = t.slice(0, -3) + "y";
  else if (t.endsWith("s") && !t.endsWith("ss") && t.length > 1) t = t.slice(0, -1);
  return t;
}
const ALLOWED = new Set(ALLOWED_RAW.map(normalize));
function isAllowedTrade(raw: string): boolean {
  const n = normalize(raw);
  return ALLOWED.has(n) || ALLOWED.has(ALIAS[n] ?? "");
}

/* ------------------------------------------------------------------------- */
/* Part 1: JSON seed slate scanning.                                          */
/* ------------------------------------------------------------------------- */

/* Only the CANONICAL example-slate keys. `trades` (competition/benchmark),
 * `related` (real cell adjacency), and `best_trades` (per-district ranking) are
 * real per-context data, deliberately diverse, judged by the taste panel for
 * universality, not by this mechanical slate gate. Rule 32 governs the reused
 * everyday illustration set, which lives in these two keys. */
const TARGET_KEYS = new Set(["everyday_trades", "take_home_trades"]);
const WRAPPER_KEYS = new Set(["list", "items"]);

type Hit = { keyPath: string; raw: string; slug?: string };

function looksLikeTradeEntry(el: unknown): el is { name?: string; slug?: string } {
  if (!el || typeof el !== "object") return false;
  const o = el as Record<string, unknown>;
  return typeof o.name === "string" || typeof o.slug === "string";
}

function scanArrayForOffenders(arr: unknown[], keyPath: string, out: Hit[]): void {
  if (arr.length === 0 || !arr.every(looksLikeTradeEntry)) return; // shape guard
  arr.forEach((el, i) => {
    const o = el as { name?: string; slug?: string };
    const raw = o.name ?? (o.slug ? o.slug.replace(/-/g, " ") : "");
    if (!raw || isAllowedTrade(raw)) return;
    out.push({ keyPath: `${keyPath}[${i}]`, raw, slug: o.slug });
  });
}

function walkSeedTree(node: unknown, keyPath: string, parentKey: string, out: Hit[]): void {
  if (Array.isArray(node)) {
    node.forEach((item, i) => walkSeedTree(item, `${keyPath}[${i}]`, "", out));
    return;
  }
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      if (key.startsWith("_")) continue; // _meta/_note/_identity: provenance, not content
      const childPath = keyPath ? `${keyPath}.${key}` : key;
      if (Array.isArray(value)) {
        const isDirectTarget = TARGET_KEYS.has(key);
        const isWrappedTarget = WRAPPER_KEYS.has(key) && TARGET_KEYS.has(parentKey);
        if (isDirectTarget || isWrappedTarget) scanArrayForOffenders(value, childPath, out);
        value.forEach((item, i) => walkSeedTree(item, `${childPath}[${i}]`, key, out));
      } else {
        walkSeedTree(value, childPath, key, out);
      }
    }
  }
}

function walkSeedDir(dir: string, acc: string[] = []): string[] {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkSeedDir(p, acc);
    else if (p.endsWith(".json")) acc.push(p);
  }
  return acc;
}

/**
 * Best-effort 1-based line number for a JSON string value (JSON strings are
 * single-line). A bare value string can repeat verbatim elsewhere in a
 * 1000+ line seed (e.g. GB.json's "Cafe" appears once at line 566 in an
 * unrelated section AND again at line 1008 inside competition.trades), so
 * the search is anchored to the outermost key of the reported keyPath (e.g.
 * "competition" for "competition.trades[0]") , that key's own `"key":`
 * position is searched for first, and the value lookup starts from there,
 * landing on the occurrence actually inside the flagged section rather
 * than the first same-named string anywhere in the file.
 */
function lineOfValue(raw: string, value: string, keyPath: string): string {
  const anchorKey = keyPath.split(/[.[]/)[0];
  let searchFrom = 0;
  if (anchorKey) {
    const anchorMatch = new RegExp(`"${anchorKey}"\\s*:`).exec(raw);
    if (anchorMatch) searchFrom = anchorMatch.index;
  }
  const needle = JSON.stringify(value);
  let idx = raw.indexOf(needle, searchFrom);
  if (idx === -1) idx = raw.indexOf(needle); // fallback: unanchored, whole file
  if (idx === -1) return "?";
  return String(raw.slice(0, idx).split("\n").length);
}

let violations = 0;
const jsonReport: string[] = [];

for (const abs of walkSeedDir(SEEDS_ROOT)) {
  const rel = abs.replace(/\\/g, "/").replace(ROOT.replace(/\\/g, "/") + "/", "");
  const raw = readFileSync(abs, "utf-8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    jsonReport.push(`${rel}: invalid JSON, skipped (${err instanceof Error ? err.message : String(err)})`);
    continue;
  }
  const hits: Hit[] = [];
  walkSeedTree(parsed, "", "", hits);
  for (const h of hits) {
    const line = lineOfValue(raw, h.raw, h.keyPath);
    const slugNote = h.slug ? ` (slug: ${h.slug})` : "";
    jsonReport.push(`${rel}:${line}: "${h.raw}"${slugNote} at ${h.keyPath} , outside the rule-32 set`);
    violations++;
  }
}

/* Part 2 REMOVED (rule 32 v2, 2026-07-12): the recommender launcher
 * (src/components/NavigatorForm.tsx) is EXEMPT. Its job is to show the product
 * spans ANY business, so its input examples (law firms, software, barbers,
 * plumbers) are a deliberate breadth demo, not a spine example slate. It is no
 * longer scanned, and no constant here names it: one that did (kept "for documentation") made the gate registry list it as a read the gate
 * never made, while the module Part 3 does read, HOME_TRY_FILE above, went unlisted (fix round F1, the final review's M7). */

/* PART 3 (plan 2026-10-09, home introduction): the picker's line is no longer a breadth demo. It is the home's three examples, each a
 * link to its London page, and the spec draws them from rule 32's set, so they are held to it, read from the module that prints them
 * (src/lib/home/destination.ts HOME_TRY), never from the form's text. */
const triesReport: string[] = [];
for (const t of HOME_TRY) {
  if (isAllowedTrade(t.word)) continue;
  triesReport.push(`"${t.word}" (${t.trade}) , outside the rule-32 set`);
  violations++;
}
console.log(`verify_trade_set: the picker's examples , ${HOME_TRY.map((t) => t.word).join(", ")}`);

console.log(`verify_trade_set: allowed set , ${ALLOWED_RAW.join(", ")}`);

if (jsonReport.length > 0) {
  console.error("\nSeed slate offenders:");
  for (const line of jsonReport) console.error(`  ${line}`);
}
if (triesReport.length > 0) {
  console.error(`\nPicker example offenders (HOME_TRY, ${HOME_TRY_FILE}):`);
  for (const line of triesReport) console.error(`  ${line}`);
}

if (violations > 0) {
  console.error(`\n✗ ${violations} out-of-context trade example(s) found.`);
  console.error("  Rulebook rule 32 (v2): one fixed set of example businesses (restaurant,");
  console.error("  grocery, pharmacy, salon, gym, auto repair, cafe, bar), reused everywhere. Replace");
  console.error("  the offending name/slug with one from that set, or fix the rulebook first");
  console.error("  if the set itself should widen.");
  process.exit(1);
}

console.log("✓ Every scanned example-trade slate stays inside the rule-32 set.");
