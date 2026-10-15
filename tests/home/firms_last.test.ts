/**
 * WHERE NEW FIRMS LAST, THE UK'S CITIES (plan 2026-10-08, home sections, section 1; his idea of 2026-10-08, "Midtier city
 * opportunities Leeds, Austin, Lublin, Malaga", built for the UK's cities, where the data holds it). Of 100 firms born in the
 * table's cohort, how many still traded five years on, per UK city with a page (data/home/city_survival.json, from the business
 * demography tables by scripts/data/home/export_home.py).
 *
 * Holds the slice: it is its source's (scripts/lib/home_export.ts), a source this machine lacks ends the last line as deferred; the
 * manifest's row count is its content's; every UK city with a page is read by its own area code and is drawn or held out with the
 * publisher's reason (a star: over 500 businesses at one postcode), never both and never neither; every share is its two counts'
 * (half up, one decimal, in whole numbers), so none can be typed; the UK's share is the one /gb's survival curve prints
 * (data/sections/survival.json) and London's the one London's pages read (data/uk/registers/survival.json); the shares are of the
 * cohort's fifth year.
 *
 * Holds the builder (src/lib/home/firms_last.ts): the cities highest first; the lead the single highest (a tie features nobody);
 * no held-out city drawn; every row a door to its own city page; every figure stamped from the slice; the UK's tick the slice's;
 * the lead's line twelve words at most with the cohort and its fifth year in it.
 *
 * Holds the /gb render: since plan 2026-10-13 country-page-journey (Task 4) where new firms last stands behind slot 12's plus, one row a
 * city, each a door to its page, the lead stamped. Its card on the UK page (FirmsLast.tsx, plan 2026-10-09) left with the page's old
 * sections in that plan's Task 6, and its drawing's checks with it.
 *
 * Run: npx tsx tests/home/firms_last.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { holdHomeExport, homePassLine } from "../../scripts/lib/home_export";
import { buildSurvival } from "../../src/lib/spine/sections/first_years";
import { buildFirmsLast } from "../../src/lib/home/firms_last";
import { COPY } from "../../src/lib/spine/copy";
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
  /* The ring prints the GB curve's LAST point (home_answers.ts reads buildSurvival("GB").last) and the slice reads the cohort's fifth
     year, so the two are one figure only while the curve's last point is its fifth year. */
  const ring = buildSurvival("GB");
  check(`the UK's share is /gb's survival curve's: the slice's fifth year is ${d.uk.pct} (the ${d.cohort} cohort), the ring prints the curve's last point, year ${ring?.last.year}, ${ring?.last.pct} (the ${ring?.cohort} cohort)`, !!ring && ring.last.year === 5 && ring.cohort === d.cohort && ring.last.pct === d.uk.pct);
  const london = d.cities.find((c) => c.slug === "london");
  const slice = (JSON.parse(readFileSync("data/uk/registers/survival.json", "utf8")) as { areas: Record<string, { births_2019: number; cohort_2019_five_years: number }> }).areas[london?.code ?? ""];
  check(`London's row is the register slice's (${london?.births} births, ${london?.pct} of 100, against ${slice?.births_2019} and ${slice?.cohort_2019_five_years})`, !!london && !!slice && london.births === slice.births_2019 && Math.abs(london.pct / 100 - slice.cohort_2019_five_years) < 0.0005);
}

/* THE BUILDER (plan Task 9). */
const built = buildFirmsLast();
check("section 1 builds", !!built);
if (built && d) {
  const want = [...d.cities].sort((a, b) => b.pct - a.pct || a.name.localeCompare(b.name));
  check(`the cities run highest first (${built.rows.map((r) => `${r.name} ${r.display}`).join(", ")})`, JSON.stringify(built.rows.map((r) => r.key)) === JSON.stringify(want.map((c) => c.slug)) && built.rows.every((r, i) => r.value === want[i].pct && r.display === want[i].pct.toFixed(1)));
  check(`the lead is the single highest, ${built.lead.figure} (${built.lead.key})`, built.lead.key === want[0].slug && built.lead.figure === want[0].pct.toFixed(1) && want[0].pct > want[1].pct);
  check("no city held out is drawn", !built.rows.some((r) => d.held_out.some((h) => h.slug === r.key)));
  check("every row opens its own city page", built.rows.every((r) => r.href === `/cities/${r.key}`));
  check("every figure says where it came from", [built.lead.prov, ...built.rows.map((r) => r.prov)].every((p) => p.src.startsWith("home/city_survival.json:") && p.kind === "worked out"));
  check(`the UK's tick is the slice's UK share (${built.uk.value}), keyed "${built.uk.label}"`, built.uk.value === d.uk.pct && built.uk.label === COPY.home.firmsLast.ukKey);
  const words = built.lead.words.split(/\s+/).filter(Boolean).length;
  check(`the lead's line is twelve words at most, no semicolon, the cohort and its fifth year in it ("${built.lead.words}")`, words <= 12 && !built.lead.words.includes(";") && built.lead.words.includes(String(d.cohort)) && built.lead.words.includes(String(d.year)) && built.lead.words.startsWith(want[0].name));
  check(`the title is four words at most ("${COPY.home.firmsLast.kicker}")`, COPY.home.firmsLast.kicker.split(/\s+/).length <= 4);
  /* THE LONE TWO THIRDS' ONE EXPOSURE (plan 2026-10-11 gb-ch04-lone-state): beside the duel the card is a half, under half the page's width,
     and wraps its lead line; alone it is the column's width at 768 and two thirds from 1024, where the page laws' TEXT WIDE reds a run of
     sixty characters or more that measures over half the width (scripts/harness/check_page_laws.mjs:275). The lead's line, for the longest
     city name the slice draws, stays under sixty. */
  const longest = [...d.cities].sort((a, b) => b.name.length - a.name.length || a.name.localeCompare(b.name))[0];
  const widest = longest ? COPY.home.firmsLast.words.replace("{city}", longest.name).replace("{cohort}", String(d.cohort)).replace("{year}", String(d.year)) : "";
  check(`the lead's line stays under sixty characters for the longest city name the slice draws ("${widest}", ${widest.length})`, !!longest && widest.length < 60, { file: "src/lib/spine/copy.ts", remedy: "keep COPY.home.firmsLast.words under sixty characters for the longest city name: alone in its level the card is wide enough for TEXT WIDE to read the line" });
}

/* THE UK PAGE'S RENDER (plan 2026-10-13 country-page-journey, Task 4): where new firms last stands behind slot 12's plus, "By city", each city
   a row that opens its page, the lead stamped. */
const VIEW_AT = { file: "src/lib/spine/slots/last.ts", remedy: "keep where new firms last behind slot 12's plus as one row a city, stamped, each a door to its page" };
const gbRender = existsSync("scratchpad/harness/pages/country-GB.html") ? readFileSync("scratchpad/harness/pages/country-GB.html", "utf8") : "";
if (gbRender && built) {
  const slot = gbRender.slice(gbRender.indexOf('data-slot="lasting"'), gbRender.indexOf('data-slot="exit"'));
  const fold = slot.slice(slot.indexOf(`>${COPY.journey.more.byCity}<`));
  check("/gb draws where new firms last behind slot 12's plus, one row a city, the lead stamped, each a door", slot.length > 0 && fold.length > 0 && new RegExp(`data-src="home/city_survival\\.json:${built.lead.key}"`).test(fold) && built.rows.every((r) => fold.includes(`href="${r.href}"`)), VIEW_AT);
} else if (!gbRender) console.log("DEFER  scratchpad/harness/pages/country-GB.html is not rendered here; the /gb render's checks did not run");

/* OFF THE HOME (plan 2026-10-09, home introduction, Task 10): the section is drawn on the page it belongs on, and the home no longer
   draws it. */
const homeRender = existsSync("scratchpad/harness/pages/home-gb.html") ? readFileSync("scratchpad/harness/pages/home-gb.html", "utf8") : "";
if (homeRender) check("the home render no longer carries the section", !/id="firms-last"/.test(homeRender), { file: "src/components/spine/home/home-view.tsx", remedy: "take where new firms last out of SpineHomeBody's zones" });

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log(homePassLine("home/firms_last", held));
