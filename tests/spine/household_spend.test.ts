/**
 * WHAT A UK HOUSEHOLD SPENDS, FROM THE SURVEY ITSELF (his ruling of 2026-10-05 on PARKED P04.1, option (a): the data track downloads
 * the Family Spending tables and /gb's household card takes them, with their source). data/sections/household_spend.json holds
 * Table A1's lines (FYE 2025); src/lib/spine/country_spend_rows.ts builds the UK's card from it.
 *
 * Holds: the UK's seven parts are the file's lines as shares of its total, the leftover as everything else, reconciled to 100; the
 * focal is eating out's share of the food money, eating out being catering services (11.1) and never the restaurants and hotels
 * group, which holds hotel stays; every printed figure carries its provenance; the card is held, not modelled; other countries
 * keep their shards; the sources page names the workbook; the render of /gb prints the stamped focal.
 *
 * Run: npx tsx tests/spine/household_spend.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { buildCountrySpend, SPEND_FOOD_IN, SPEND_FOOD_OUT, SPEND_RESIDUAL } from "../../src/lib/spine/country_spend_rows";
import { UK_SOURCES } from "../../src/lib/spine/uk_sources";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "household-spend";
const FILE = "src/lib/spine/country_spend_rows.ts";
const REMEDY = "build the UK's household card from data/sections/household_spend.json (the survey's Table A1), eating out as catering services, every figure stamped";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

type Line = { code: string; name: string; gbp: number };
const official = JSON.parse(readFileSync("data/sections/household_spend.json", "utf8")) as { publisher: string; dataset: string; GB: { total: number; lines: Record<string, Line> } };
const lines = official.GB.lines;
check("the file's eating out is catering services (11.1), never restaurants and hotels (11)", lines[SPEND_FOOD_OUT]?.code === "11.1");

const gb = buildCountrySpend("GB");
check("the UK's card builds", !!gb);
if (gb) {
  /* What the rows must print: each line's share of the total, the leftover as everything else, by largest remainder to 100. */
  const raw = Object.entries(lines).map(([key, l]) => ({ key, pct: (l.gbp / official.GB.total) * 100 }));
  raw.push({ key: SPEND_RESIDUAL, pct: 100 - raw.reduce((n, r) => n + r.pct, 0) });
  const byKey = new Map(gb.rows.map((r) => [r.key, r.value]));
  check(`seven parts, summing to 100 (${gb.rows.map((r) => `${r.key} ${r.value}`).join(", ")})`, gb.rows.length === 7 && gb.rows.reduce((n, r) => n + r.value, 0) === 100);
  check("every part is its line's share of the week, within the rounding", raw.every((r) => Math.abs((byKey.get(r.key) ?? -99) - r.pct) < 1));
  const want = Math.round((lines[SPEND_FOOD_OUT].gbp / (lines[SPEND_FOOD_IN].gbp + lines[SPEND_FOOD_OUT].gbp)) * 100);
  check(`the focal is eating out's share of the food money, ${want}%`, gb.out.figure === `${want}%`);
  check("the card is held, not modelled", gb.tag === "held");
  check("the focal and every part carry their provenance", !!gb.out.prov?.src?.startsWith("sections/household_spend.json:GB") && gb.rows.every((r) => !!r.prov?.src?.startsWith("sections/household_spend.json:GB") && !!r.prov?.kind));
}
const fr = buildCountrySpend("FR");
check("another country keeps its shard (France builds, not from the UK's file)", !!fr && !(fr.out.prov?.src ?? "").includes("household_spend"));

const ons = UK_SOURCES.find((s) => s.key === "ons");
check("the sources page names the workbook and its table", !!ons?.items.some((i) => /workbook 1/i.test(i.title) && /Table A1/.test(i.title)));

const render = "scratchpad/harness/pages/country-GB.html";
if (existsSync(render) && gb) {
  const html = readFileSync(render, "utf8");
  check(`/gb's render prints the focal ${gb.out.figure}, stamped`, new RegExp(`data-src="sections/household_spend\\.json:GB[^"]*"[^>]*>${gb.out.figure.replace("%", "%")}<`).test(html));
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/household_spend: all pass");
