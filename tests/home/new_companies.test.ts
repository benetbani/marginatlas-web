/**
 * WHERE NEW COMPANIES OPEN, LATIN AMERICA AND AFRICA (plan 2026-10-08, home sections, section 2; his ideas of 2026-10-08, "LATAM
 * Gems" and "Best of Africa (countries)", with "Rising stars countries" folded in as the audit found it). New limited companies
 * registered in a year per 1,000 people of working age, one year, each region ranked within itself (data/home/new_companies.json,
 * from the new-business series by scripts/data/home/export_home.py).
 *
 * Holds the slice: it is its source's (scripts/lib/home_export.ts), a source this machine lacks ends the last line as deferred; the
 * manifest's row count is its content's; each region's members are the ones the in-repo files give it (the country profile's
 * world_bank_region for Latin America; its continent, or a MENA country whose cities stand in Africa, or one with no city in the
 * list that the export's map places there, for Africa); a member shows only with a figure for the year and a labour force of at
 * least the floor, which says what it does; five or more show in each region; the UK's own figure is there; every member shown has
 * a country page; and, where the series is on this machine, each names the indicator the slice says it is, every figure, the UK's
 * among them, is the source's, read again, and the year is the latest in which both regions show five.
 *
 * Holds the builder (src/lib/home/new_companies.ts): Latin America then Africa, never ranked together; each region's five highest
 * in order, one decimal, the rest behind the plus in order; every row a door to its country's page promising what that page
 * answers; every figure stamped; the card's figure the UK's own; the one line twelve words at most.
 *
 * Holds the drawing (src/components/spine/home/HomeNewCompanies.tsx): the list card's grouped form, Latin America then Africa; each
 * drawn country its flag, its name and its figure at one decimal, a door to its page; the card's figure the UK's, under its label;
 * the rest of each region behind its plus, closed, and no region leaving a lone country there (a plus of one is not drawn); quiet,
 * no accent; every figure stamped; one line.
 *
 * Run: npx tsx tests/home/new_companies.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { holdHomeExport, homePassLine } from "../../scripts/lib/home_export";
import { COUNTRIES } from "../../src/lib/taxonomy";
import { iso2ToName } from "../../src/lib/countries";
import { buildNewCompanies, NEW_COMPANIES_SHOWN, rateDisplay } from "../../src/lib/home/new_companies";
import { SURFACE_ANSWERS } from "../../src/lib/spine/door_kinds";
import { COPY } from "../../src/lib/spine/copy";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HomeNewCompanies } from "../../src/components/spine/home/HomeNewCompanies";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-new-companies";
const FILE = "data/home/new_companies.json";
const REMEDY = "re-run python -P scripts/data/home/export_home.py new_companies, never edit data/home by hand; then draw section 2 from the slice only";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY }); };

/** A source table read as JSON. One that is cut off or damaged is a red of its own, with its path and the remedy, and null: the
 *  checks that need the table are skipped, so the gate ends on its summary and never on a SyntaxError stack. */
function readTable<T>(name: string, path: string): T | null {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    check(`the ${name} table reads as JSON`, false, { file: path, remedy: "restore the source file, then re-run the export" });
    return null;
  }
}

type Member = { iso2: string; value: number | null; labour_force: number | null; shown: boolean };
type Export = { year: number; measure: string; last_updated: string; floor: { measure: string; year: number; at_least: number; why: string }; uk: { iso2: string; value: number }; regions: Array<{ key: string; rule: string; members: Member[] }> };
const REGIONS = ["latam", "africa"] as const;
/* A MENA country is African by where its cities stand in the city list. One with no city there is placed by this map, the export's own
   (MENA_WITHOUT_A_CITY in scripts/data/home/export_home.py), kept here as a second copy so a placement changes in both files or this
   gate fails. On the 2022 figures Libya holds no rate, so placing it in Africa shows nothing new. */
const MENA_WITHOUT_A_CITY: Record<string, "africa" | null> = { LY: "africa", PS: null, SY: null, YE: null };

const held = holdHomeExport("new_companies.json", check);
const d = (held?.data ?? null) as Export | null;
if (d && held) {
  const counted = d.regions.reduce((n, r) => n + r.members.length, 0);
  check(`the manifest's rows are the slice's: the UK and ${counted} members (${held.entry.rows})`, held.entry.rows === 1 + counted);
  const profile = (JSON.parse(readFileSync("data/economic_indicators/country_profile_v2.json", "utf8")) as { countries: Record<string, { continent?: string; world_bank_region?: string }> }).countries;
  const cityContinent = new Map<string, string>();
  for (const c of (JSON.parse(readFileSync("data/cities/city_list_v1.json", "utf8")) as { cities: Array<{ iso2: string; continent: string }> }).cities) {
    const k = c.iso2.toUpperCase();
    if (!cityContinent.has(k)) cityContinent.set(k, c.continent);
  }
  const regionOf = (iso2: string, p: { continent?: string; world_bank_region?: string }) => {
    if (p.world_bank_region === "Latin America & Caribbean") return "latam";
    if (p.continent === "Africa") return "africa";
    if (p.continent !== "MENA") return null;
    return cityContinent.has(iso2) ? (cityContinent.get(iso2) === "Africa" ? "africa" : null) : MENA_WITHOUT_A_CITY[iso2] ?? null;
  };
  const noCity = Object.entries(profile).filter(([iso2, p]) => p.continent === "MENA" && !cityContinent.has(iso2)).map(([iso2]) => iso2).sort();
  check(`a MENA country with no city in the list is placed by the map and the map names no other (${noCity.map((i) => `${i}: ${MENA_WITHOUT_A_CITY[i] ?? "not Africa"}`).join(", ") || "none"})`, JSON.stringify(noCity) === JSON.stringify(Object.keys(MENA_WITHOUT_A_CITY).sort()));
  check(`the regions are Latin America and Africa, in that order (${d.regions.map((r) => r.key).join(", ")})`, JSON.stringify(d.regions.map((r) => r.key)) === JSON.stringify(REGIONS));
  for (const key of REGIONS) {
    const want = Object.entries(profile).filter(([iso2, p]) => regionOf(iso2, p) === key).map(([iso2]) => iso2).sort();
    const members = d.regions.find((r) => r.key === key)?.members ?? [];
    check(`${key}: the members are the profile's (${members.length} against ${want.length})`, JSON.stringify(members.map((m) => m.iso2).sort()) === JSON.stringify(want));
    const shown = members.filter((m) => m.shown);
    check(`${key}: a member shows only with a ${d.year} figure and a labour force of ${d.floor.at_least} or more (${shown.length} shown)`, members.every((m) => m.shown === (typeof m.value === "number" && Number.isFinite(m.value) && typeof m.labour_force === "number" && m.labour_force >= d.floor.at_least)));
    check(`${key}: five or more show (${shown.length})`, shown.length >= 5);
  }
  check(`the floor is the labour force of the slice's own year, with its reason (${d.floor.measure}, ${d.floor.year}, ${d.floor.at_least})`, d.floor.year === d.year && d.floor.at_least > 0 && d.floor.why.length > 0);
  check(`the UK's own figure for ${d.year} is there (${d.uk.value})`, d.uk.iso2 === "GB" && Number.isFinite(d.uk.value) && d.uk.value > 0);
  const codes = new Set(COUNTRIES.map((c) => c.code));
  check("every member shown has a country page", d.regions.every((r) => r.members.filter((m) => m.shown).every((m) => codes.has(m.iso2))));

  /* THE SOURCE, READ AGAIN, where it is on this machine. A series that is not is deferred by the holder, and its key ends the last line. */
  const density = held.entry.sources.find((s) => s.key === "density");
  const labour = held.entry.sources.find((s) => s.key === "labour_force");
  check("the manifest names the two series the figures were read from (density, labour_force)", !!density && !!labour);
  if (density && labour && existsSync(density.path) && existsSync(labour.path)) {
    type Row = { country: { id: string }; date: string; value: number | null; indicator?: { id?: string } };
    const table = (name: string, path: string) => {
      const rows = readTable<[unknown, Row[]]>(name, path);
      if (!rows) return null;
      const by = new Map<string, number>();
      const ids = new Set<string>();
      for (const r of rows[1]) {
        ids.add(r.indicator?.id ?? "none");
        if (r.value !== null && r.value !== undefined) by.set(`${r.country.id}:${r.date}`, r.value);
      }
      return { by, id: [...ids].sort().join(", ") };
    };
    const densTable = table("density", density.path), lfTable = table("labour_force", labour.path);
    if (densTable && lfTable) {
      const dens = densTable.by, lf = lfTable.by;
      check(`each series names the indicator the slice says it is (${densTable.id} for ${d.measure}; ${lfTable.id} for ${d.floor.measure})`, densTable.id === d.measure && lfTable.id === d.floor.measure);
      const all = d.regions.flatMap((r) => r.members);
      const wrong = all.filter((m) => (dens.get(`${m.iso2}:${d.year}`) ?? null) !== m.value || (lf.get(`${m.iso2}:${d.year}`) ?? null) !== m.labour_force).map((m) => m.iso2);
      check(`every member's ${d.year} figure and labour force are the source's, read again here${wrong.length ? `: differs on ${wrong.join(", ")}` : ""}`, wrong.length === 0);
      const gb = dens.get(`GB:${d.year}`);
      check(`the UK's ${d.year} figure is the source's, read again here (${d.uk.value} against ${gb ?? "none"})`, gb === d.uk.value);
      const years = [...new Set([...dens.keys()].map((k) => k.split(":")[1]))].sort().reverse();
      const shows = (iso2: string, y: string) => dens.has(`${iso2}:${y}`) && (lf.get(`${iso2}:${y}`) ?? 0) >= d.floor.at_least;
      const latest = years.find((y) => REGIONS.every((key) => (d.regions.find((r) => r.key === key)?.members ?? []).filter((m) => shows(m.iso2, y)).length >= 5) && dens.has(`GB:${y}`));
      check(`the year is the latest in which both regions show five and the UK has a figure (${latest})`, latest === String(d.year));
    }
  }
}

/* THE BUILDER (plan Task 10). */
const built = buildNewCompanies();
check("section 2 builds", !!built);
if (built && d) {
  const one = (v: number) => Math.round(v * 10) / 10;
  check("a small rate prints in two decimals, never nought", rateDisplay(0.0245092032058038) === "0.02" && rateDisplay(0.113132873298748) === "0.1" && rateDisplay(10.8180967387068) === "10.8");
  check("Latin America first, then Africa, never ranked together", JSON.stringify(built.groups.map((g) => g.key)) === JSON.stringify(["latam", "africa"]));
  for (const g of built.groups) {
    const want = (d.regions.find((r) => r.key === g.key)?.members ?? []).filter((m) => m.shown && typeof m.value === "number").sort((a, b) => (b.value as number) - (a.value as number) || a.iso2.localeCompare(b.iso2));
    check(`${g.name}: its ${NEW_COMPANIES_SHOWN} highest, in order (${g.rows.map((r) => `${r.name} ${r.value.toFixed(1)}`).join(", ")})`, g.rows.length === NEW_COMPANIES_SHOWN && g.rows.every((r, i) => r.iso2 === want[i].iso2 && r.value === one(want[i].value as number)));
    check(`${g.name}: the rest behind the plus, in order ("${g.more}")`, g.rest.length === want.length - NEW_COMPANIES_SHOWN && g.rest.every((r, i) => r.value === rateDisplay(want[i + NEW_COMPANIES_SHOWN].value as number)) && g.rest.every((r, i) => r.label === iso2ToName(want[i + NEW_COMPANIES_SHOWN].iso2)) && g.more === COPY.home.newCompanies.more.replace("{n}", String(g.rest.length)).replace("{region}", g.name));
    check(`${g.name}: no rate prints as nought`, [...g.rows.map((r) => r.value.toFixed(1)), ...g.rest.map((r) => r.value)].every((s) => Number(s) > 0));
    check(`${g.name}: every row opens its country's page and promises what that page answers`, g.rows.every((r) => r.href === `/${r.iso2.toLowerCase()}` && r.lands === SURFACE_ANSWERS.country));
    check(`${g.name}: every figure says where it came from`, [...g.rows.map((r) => r.prov), ...g.rest.map((r) => r.prov)].every((p) => p.src.startsWith("home/new_companies.json:") && p.kind === "looked up"));
  }
  check(`the card's figure is the UK's own, ${built.uk.value}`, built.uk.value === one(d.uk.value) && built.uk.prov.src === "home/new_companies.json:GB");
  const line = COPY.home.newCompanies.basis.replace("{year}", String(built.year));
  check(`the one line is twelve words at most, no semicolon ("${line}")`, line.split(/\s+/).length <= 12 && !line.includes(";") && built.year === d.year);
  check(`the title is four words at most ("${COPY.home.newCompanies.kicker}")`, COPY.home.newCompanies.kicker.split(/\s+/).length <= 4);
}

/* THE DRAWING (plan Task 13): the list card's grouped form, the two regions in order, each drawn country its flag, its name and its
   figure, a door to its page; the rest behind each plus, closed; quiet (no accent); every figure stamped; one line. A red here is the
   component's to put right (the slice and the builder are held above), so its finding names HomeNewCompanies and the laws it is
   drawn by, and never the export. */
const DRAWN_AT = { file: "src/components/spine/home/HomeNewCompanies.tsx", remedy: "draw section 2 as HomeNewCompanies holds it, the list card's grouped form with Latin America then Africa never ranked together, a country its flag and its name and a door to its page (MarkList's clause 5), quiet with no accent, every figure stamped" };
if (built) {
  /* CountryFlag is written for Next's automatic JSX runtime and names no React; this runner compiles JSX to React.createElement, so
     the flags read the one React this file lends them (as tests/spine/uk_sources.test.ts lends it to the About page). */
  (globalThis as unknown as { React: typeof React }).React = React;
  const html = renderToStaticMarkup(React.createElement(HomeNewCompanies, { nc: built }));
  check("the section is the list card's grouped form, Latin America then Africa", /id="new-companies"/.test(html) && /data-archetype="mark-list"/.test(html) && /data-form="groups"/.test(html) && html.indexOf('data-group="latam"') !== -1 && html.indexOf('data-group="africa"') > html.indexOf('data-group="latam"'), DRAWN_AT);
  const drawn = built.groups.reduce((s, g) => s + g.rows.length, 0);
  check(`each drawn country is its flag, its name and its figure, a door to its page (${drawn})`, (html.match(/<a [^>]*data-row=/g) ?? []).length === drawn && (html.match(/flagcdn\.com\//g) ?? []).length === drawn && html.split(`data-lands="${SURFACE_ANSWERS.country}"`).length - 1 === drawn, DRAWN_AT);
  check("the card's figure is the UK's, under its label, and every drawn rate prints at one decimal", new RegExp(`--t-focal[^>]*data-src="home/new_companies\\.json:GB"[^>]*>${built.uk.value.toFixed(1).replace(".", "\\.")}<`).test(html) && html.includes(`>${COPY.home.newCompanies.headline}<`) && built.groups.every((g) => g.rows.every((r) => html.includes(`>${r.value.toFixed(1)}</span>`))), DRAWN_AT);
  check("the rest of each region stands behind its plus, closed", (html.match(/<details/g) ?? []).length === built.groups.filter((g) => g.rest.length >= 2).length && !/<details[^>]*\bopen\b/.test(html), DRAWN_AT);
  check("no region leaves exactly one country behind the plus (a plus of one is not drawn, so that country would vanish)", built.groups.every((g) => g.rest.length !== 1), { file: "src/components/spine/home/HomeNewCompanies.tsx", remedy: "draw a lone leftover as a sixth row, in the builder and the drawing together" });
  check("no figure in the accent (a quiet section)", !/(?:^|[\s"])text-\[var\(--terra-text\)\]/.test(html), DRAWN_AT);
  const figs = [...html.matchAll(/<[^>]+class="[^"]*\bfig\b[^"]*"[^>]*>/g)].map((m) => m[0]);
  const rest = built.groups.reduce((s, g) => s + (g.rest.length >= 2 ? g.rest.length : 0), 0);
  check(`every figure says where it came from (${figs.length}: the UK's, ${drawn} drawn, ${rest} behind the plus)`, figs.length === 1 + drawn + rest && figs.every((f) => /data-src="home\/new_companies\.json:/.test(f) && /data-kind="looked up"/.test(f)), DRAWN_AT);
  const title = /<h3[^>]*>([^<]*)<\/h3>/.exec(html)?.[1] ?? "";
  check(`the title is the copy's, four words at most ("${title}")`, title === COPY.home.newCompanies.kicker && title.split(/\s+/).length <= 4, DRAWN_AT);
  check("one supporting line, the measure said once", (html.match(/<p /g) ?? []).length === 1 && html.includes(COPY.home.newCompanies.basis.replace("{year}", String(built.year))), DRAWN_AT);
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log(homePassLine("home/new_companies", held));
