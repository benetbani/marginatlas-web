/**
 * WHERE NEW FIRMS LAST, THE UK'S CITIES (plan 2026-10-08, home sections, section 1; his idea of 2026-10-08, "Midtier city
 * opportunities Leeds, Austin, Lublin, Malaga", built for the UK's cities, where the data holds it). Of 100 firms born in the
 * table's cohort, how many still traded five years on, per UK city with a page (data/home/city_survival.json, from the business
 * demography tables by scripts/data/home/export_home.py).
 *
 * Holds the slice: it is its source's (scripts/lib/home_export.ts), a source this machine lacks ends the last line as deferred; the
 * manifest's row count is its content's; every UK city with a page is read by its own area code and is drawn or held out with the
 * publisher's reason (a star: over 500 businesses at one postcode), never both and never neither; every share is its two counts'
 * (half up, one decimal, in whole numbers), so none can be typed; the UK's share is the one the home's ring prints
 * (data/sections/survival.json) and London's the one London's pages read (data/uk/registers/survival.json); the shares are of the
 * cohort's fifth year.
 *
 * Run: npx tsx tests/home/firms_last.test.ts
 */
import { readFileSync } from "node:fs";
import { holdHomeExport, homePassLine } from "../../scripts/lib/home_export";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-firms-last";
const FILE = "data/home/city_survival.json";
const REMEDY = "re-run python -P scripts/data/home/export_home.py city_survival, never edit data/home by hand; then draw section 1 from the slice only";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY }); };

type Area = { code: string; name_in_table: string; births: number; survived: number; pct: number };
type City = Area & { slug: string; name: string };
type Export = { cohort: number; year: number; table: string; published: string; star_note: string; uk: Area; cities: City[]; held_out: Array<City & { why: string }> };

const held = holdHomeExport("city_survival.json", check);
const d = (held?.data ?? null) as Export | null;
if (held && d) {
  check(`the manifest's rows are the slice's: the UK, ${d.cities.length} drawn and ${d.held_out.length} held out (${held.entry.rows})`, held.entry.rows === 1 + d.cities.length + d.held_out.length);
  /* Of 100, half up to one decimal, in whole numbers so no float can tip a half (the export's Decimal). */
  const share = (survived: number, births: number) => Math.floor((2000 * survived + births) / (2 * births)) / 10;
  const uk = (JSON.parse(readFileSync("data/cities/city_list_v1.json", "utf8")) as { cities: Array<{ slug: string; iso2: string }> }).cities.filter((c) => c.iso2.toUpperCase() === "GB").map((c) => c.slug).sort();
  const drawn = d.cities.map((c) => c.slug);
  const out = d.held_out.map((c) => c.slug);
  check(`every UK city with a page is drawn or held out, never both (drawn ${drawn.join(", ")}; held out ${out.join(", ") || "none"})`, JSON.stringify([...drawn, ...out].sort()) === JSON.stringify(uk) && !drawn.some((s) => out.includes(s)));
  check("a city is held out only where the publisher stars its area, with the reason, and the note on stars is the workbook's", d.held_out.every((c) => c.name_in_table.endsWith("*") && c.why.length > 0) && d.cities.every((c) => !c.name_in_table.endsWith("*")) && /500 businesses/.test(d.star_note));
  check("Birmingham is held out (the publisher's star: over 500 businesses at one postcode)", out.includes("birmingham"));
  const all = [d.uk, ...d.cities, ...d.held_out];
  check(`every share is its two counts' (${all.map((a) => `${a.code} ${a.survived}/${a.births}=${a.pct}`).join("; ")})`, all.every((a) => Number.isInteger(a.births) && Number.isInteger(a.survived) && a.births > 0 && a.survived >= 0 && a.survived <= a.births && a.pct === share(a.survived, a.births)));
  check(`each city is read under its own name in the table (${[...d.cities, ...d.held_out].map((c) => `${c.name}: ${c.name_in_table}`).join("; ")})`, [...d.cities, ...d.held_out].every((c) => c.name_in_table.toLowerCase().includes(c.name.toLowerCase())));
  check(`the shares are of the cohort's fifth year (${d.cohort} to ${d.year}, ${d.table}, published ${d.published})`, d.year - d.cohort === 5 && d.table === "Table 5.1a" && d.published.length > 0);
  const ring = (JSON.parse(readFileSync("data/sections/survival.json", "utf8")) as { GB: { curve: { cohort: number; points: Array<{ year: number; pct: number }> } } }).GB.curve;
  const ringFive = ring.points.find((p) => p.year === 5)?.pct;
  check(`the UK's share is the home's ring's (${d.uk.pct} against ${ringFive}, the ${ring.cohort} cohort)`, ring.cohort === d.cohort && ringFive === d.uk.pct);
  const london = d.cities.find((c) => c.slug === "london");
  const slice = (JSON.parse(readFileSync("data/uk/registers/survival.json", "utf8")) as { areas: Record<string, { births_2019: number; cohort_2019_five_years: number }> }).areas[london?.code ?? ""];
  check(`London's row is the register slice's (${london?.births} births, ${london?.pct} of 100, against ${slice?.births_2019} and ${slice?.cohort_2019_five_years})`, !!london && !!slice && london.births === slice.births_2019 && Math.abs(london.pct / 100 - slice.cohort_2019_five_years) < 0.0005);
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log(homePassLine("home/firms_last", held));
