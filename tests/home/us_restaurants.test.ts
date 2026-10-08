/**
 * WHERE US RESTAURANTS GREW AND SHRANK (plan 2026-10-08, home sections, section 3; his idea of 2026-10-08, "US biggest winners and
 * losers ranking of top 5 cities bottom 5"). One trade held (full-service restaurants, private establishments), every US metro the
 * site has a city page for, its count in the first and the last year on disk (data/home/us_restaurants.json, from the employment
 * census's parsed files by scripts/data/home/export_home.py).
 *
 * Holds the slice: it is its source's (scripts/lib/home_export.ts), a source this machine lacks ends the last line as deferred; the
 * manifest's row count is its content's; one metro a US city page and under the city's own name; each metro's code a metro area
 * whose published title names the city, no two cities on one code; whole counts in both years; the mark a row may carry withholds
 * employment and pay and never the count (every row keeps its count); five or more metros grew and five or more shrank, so both
 * ends of the ranking stand.
 *
 * Run: npx tsx tests/home/us_restaurants.test.ts
 */
import { readFileSync } from "node:fs";
import { holdHomeExport, homePassLine } from "../../scripts/lib/home_export";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-us-restaurants";
const FILE = "data/home/us_restaurants.json";
const REMEDY = "re-run python -P scripts/data/home/export_home.py us_restaurants, never edit data/home by hand; then draw section 3 from the slice only";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY }); };

type Metro = { slug: string; name: string; area: string; title: string; y_from: number; y_to: number; codes: Array<string | null> };
type Export = { trade: { naics: string; title: string }; ownership: string; from: number; to: number; metros: Metro[] };

const held = holdHomeExport("us_restaurants.json", check);
const d = (held?.data ?? null) as Export | null;
if (held && d) {
  check(`the manifest's rows are the slice's: one a metro (${held.entry.rows} against ${d.metros.length})`, held.entry.rows === d.metros.length);
  const us = (JSON.parse(readFileSync("data/cities/city_list_v1.json", "utf8")) as { cities: Array<{ slug: string; name: string; iso2: string }> }).cities.filter((c) => c.iso2.toUpperCase() === "US");
  check(`one metro a US city page (${d.metros.length} of ${us.length})`, JSON.stringify(d.metros.map((m) => m.slug).sort()) === JSON.stringify(us.map((c) => c.slug).sort()));
  check("each metro under its city's own name", d.metros.every((m) => us.find((c) => c.slug === m.slug)?.name === m.name));
  check("each code is a metro area whose title names the city, and no two cities share one", d.metros.every((m) => /^C\d{4}$/.test(m.area) && / Metro Area$/.test(m.title) && m.title.toLowerCase().includes(m.name.split(",")[0].trim().toLowerCase())) && new Set(d.metros.map((m) => m.area)).size === d.metros.length);
  check(`one trade held, private establishments (${d.trade.naics}, ${d.trade.title}, ${d.ownership})`, d.trade.naics === "722511" && d.ownership === "private");
  check(`whole counts in both years, ${d.from} and ${d.to}`, d.from < d.to && d.metros.every((m) => Number.isInteger(m.y_from) && Number.isInteger(m.y_to) && m.y_from > 0 && m.y_to > 0));
  check(`a row's mark withholds employment and pay, never the count (${d.metros.filter((m) => m.codes.includes("N")).length} rows marked, each with its count)`, d.metros.every((m) => m.codes.length === 2 && m.codes.every((c) => c === null || c === "N")));
  const grew = d.metros.filter((m) => m.y_to > m.y_from).length, shrank = d.metros.filter((m) => m.y_to < m.y_from).length;
  check(`five or more grew and five or more shrank (${grew} and ${shrank})`, grew >= 5 && shrank >= 5);
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log(homePassLine("home/us_restaurants", held));
