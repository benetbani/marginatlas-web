/**
 * verify_trade_row_names: a trade's name printed as a row is a label, three
 * words or fewer and no parenthetical (the goal's A11, 2026-09-24;
 * DATA-REQUIREMENTS item 71).
 *
 * MODEL PART 5's label law ("three words maximum ... no parenthetical") and
 * 8.5's ROW SENTENCE, which scripts/harness/check_model_laws.mjs reads on the
 * renders ("a label over three words ... is a copy fault"). The laws count
 * words by whitespace, so the ampersand in "Cafés & coffee shops" is one; 54
 * of the 138 live names run over three, and 8 more carry a parenthetical
 * ("Bakeries (retail)"). The renders are a sample (one industry page, the
 * countries and cities in scripts/harness/pages.json); this gate holds the
 * law over every live trade and the builders that print one as a row:
 *
 *   1. every live trade's row name (`tradeRowName`) is three words or fewer, by
 *      the model laws' own count, and carries no parenthetical;
 *   2. `short_name` is set only where the name breaks the law, has fewer words
 *      than the name, is shared by no other live trade and is no trade's full
 *      name, and is set on live trades only;
 *   3. the industry page's `02 benchmark` prints the row name on every row, over
 *      the 138 (every row a live trade since the goal's A10);
 *   4. the country page's `12 money` prints the short name on every bar whose
 *      trade holds one, and every bar keeps the law, over every country in the
 *      harness snapshot;
 *   5. the city page's trade doors print through the helper, read off
 *      adapt_city.ts' source (the adapter pulls a database client in at
 *      import), and each of its everyday slugs' row name keeps the law;
 *   6. no URL moves: the slug of a trade with a short name is its full name's.
 *
 * BLIND SPOT: a card that prints a trade's name as a row without the helper is
 * not found here; the model laws find it on the pages they render. The city
 * doors are held through the adapter's source text, not by running it, so a
 * door relabelled after the map would pass here and fail on the London
 * render. No network, no browser.
 */
import { readFileSync } from "node:fs";
import { red } from "./lib/red";
import { INDUSTRIES, ALL_INDUSTRIES, INDUSTRY_BY_ID, SLUG_TO_INDUSTRY, industryToSlug, tradeRowName } from "../src/lib/taxonomy";
import { buildBenchmark } from "../src/lib/spine/benchmark_rows";
import { marginCardFromSnapshot, snapshotCountries } from "../src/lib/spine/margin_rows";

const RULE = "trade-row-names";
const FILE = "src/lib/taxonomy/industries.json";
const reds: string[] = [];
const fail = (detail: string, remedy: string) => reds.push(red({ rule: RULE, file: FILE, detail, remedy }));
/* The model laws' own count (check_model_laws.mjs, ROW SENTENCE): trimmed, split on whitespace. */
const wordsOf = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const CAP = 3;
/** What breaks the label law in a row name, or null. */
const fault = (s: string): string | null => (wordsOf(s) > CAP ? `${wordsOf(s)} words` : /[()]/.test(s) ? "a parenthetical" : null);

/* 1 and 2. */
const fullNames = new Map(ALL_INDUSTRIES.map((i) => [i.name.trim().toLowerCase(), i.id] as const));
const rowNames = new Map<string, string>();
let shortened = 0;
for (const ind of INDUSTRIES) {
  const row = tradeRowName(ind.id, ind.name);
  const f = fault(row);
  if (f) fail(`${ind.id} prints "${row}" as a row, ${f}`, "give it a `short_name` of three words or fewer, no parenthetical, in industries.json");
  const s = ind.short_name;
  if (s != null) {
    shortened++;
    if (!fault(ind.name)) fail(`${ind.id} has a short name "${s}" beside a name that keeps the law ("${ind.name}")`, "drop it: a name of three words or fewer with no parenthetical is its own row label");
    if (wordsOf(s) >= wordsOf(ind.name)) fail(`${ind.id}'s short name "${s}" is no shorter than "${ind.name}"`, "shorten it");
    const other = fullNames.get(s.trim().toLowerCase());
    if (other && other !== ind.id) fail(`${ind.id}'s short name "${s}" is the full name of ${other}`, "choose a row name no other trade is called");
  }
  const seen = rowNames.get(row.trim().toLowerCase());
  if (seen && seen !== ind.id) fail(`${ind.id} and ${seen} both print "${row}" as a row`, "give one of them a row name of its own");
  rowNames.set(row.trim().toLowerCase(), ind.id);
}
const liveIds = new Set(INDUSTRIES.map((i) => i.id));
for (const ind of ALL_INDUSTRIES) if (ind.short_name != null && !liveIds.has(ind.id)) fail(`${ind.id} is not a live trade and carries a short name`, "set short names on live trades only; a retired trade prints no row");

/* 3. Every row: since the goal's A10 the set is the sector's live trades, so
   no row can be a retired or merged member without a row name of its own. */
let benchRows = 0;
for (const ind of INDUSTRIES) {
  const b = buildBenchmark(ind.id);
  for (const r of b?.rows ?? []) {
    benchRows++;
    const want = tradeRowName(String(r.key), INDUSTRY_BY_ID[String(r.key)]?.name ?? String(r.name));
    if (r.name !== want) fail(`the benchmark on ${ind.id} prints "${r.name}" for ${r.key}, not its row name "${want}"`, "print the row through tradeRowName (benchmark_rows.ts)");
    const f = fault(String(r.name));
    if (f) fail(`the benchmark on ${ind.id} prints "${r.name}", ${f}`, "print the row through tradeRowName");
  }
}

/* 4. Where the trade holds a short name the bar prints it; every bar keeps the
   law. A bar whose trade holds none prints the name the row brought, which is
   the cell's own: on the 2026-09-04 snapshot Kosovo's hairdressers row is a
   "Cleaning services" cell, a fallback the credibility screen withholds there
   today (QUEUE country:money-fallback-cell), so this rule does not assert the
   taxonomy's name on it. */
let moneyRows = 0;
const countries = snapshotCountries();
for (const iso2 of countries) {
  const card = marginCardFromSnapshot(iso2);
  for (const r of card?.rows ?? []) {
    moneyRows++;
    const ind = SLUG_TO_INDUSTRY[r.key] ?? INDUSTRY_BY_ID[r.key];
    if (ind?.short_name != null && r.name !== ind.short_name) fail(`the money bars for ${iso2} print "${r.name}" for ${r.key}, not its row name "${ind.short_name}"`, "print the bar through tradeRowName (margin_rows.ts)");
    const f = fault(r.name);
    if (f) fail(`the money bars for ${iso2} print "${r.name}", ${f}`, "print the bar through tradeRowName");
  }
}

/* 5. The city doors, read as source: adapt_city.ts pulls a database client in
   at import, and a gate must never need a secret (CLAUDE.md), so the set is
   read off the file's own literal and the door's label off its map. */
const cityAdapter = readFileSync("src/lib/spine/adapt_city.ts", "utf8");
const everyday = [...(cityAdapter.match(/EVERYDAY_TRADES[^=]*=\s*new Set\(\[([\s\S]*?)\]\)/)?.[1] ?? "").matchAll(/"([^"]+)"/g)].map((m) => m[1]);
if (everyday.length === 0) fail("the city adapter's EVERYDAY_TRADES literal was not found", "keep the set a literal in adapt_city.ts, or point this gate at its new home");
if (!/name:\s*tradeRowName\(/.test(cityAdapter)) fail("the city adapter's trade doors do not print through tradeRowName", "name the door through tradeRowName (adapt_city.ts, trades_here)");
for (const slug of everyday) {
  const ind = SLUG_TO_INDUSTRY[slug] ?? INDUSTRY_BY_ID[slug];
  if (!ind) continue;
  const row = tradeRowName(slug, ind.name);
  const f = fault(row);
  if (f) fail(`the city doors' slug ${slug} prints "${row}", ${f}`, "give the trade a short name");
}

/* 6. */
const slugOfName = (name: string) => name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
for (const ind of INDUSTRIES) if (ind.short_name != null && industryToSlug(ind.id) !== slugOfName(ind.name)) fail(`${ind.id}'s slug is "${industryToSlug(ind.id)}", not its full name's "${slugOfName(ind.name)}"`, "never derive a slug from the short name: URLs do not move");

if (reds.length) {
  console.error(`verify_trade_row_names: ${reds.length} red(s) above`);
  process.exit(1);
}
console.log(`verify_trade_row_names: ${INDUSTRIES.length} live trades, ${shortened} with a short name, every row name ${CAP} words or fewer with no parenthetical, and its own; ${benchRows} benchmark rows over the ${INDUSTRIES.length} and ${moneyRows} money bars over ${countries.length} countries print it; the city doors print it over their ${everyday.length} slugs; no slug moved.`);
