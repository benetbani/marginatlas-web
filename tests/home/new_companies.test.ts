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
 * Run: npx tsx tests/home/new_companies.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { holdHomeExport, homePassLine } from "../../scripts/lib/home_export";
import { COUNTRIES } from "../../src/lib/taxonomy";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-new-companies";
const FILE = "data/home/new_companies.json";
const REMEDY = "re-run python -P scripts/data/home/export_home.py new_companies, never edit data/home by hand; then draw section 2 from the slice only";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY }); };

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
    const table = (path: string) => {
      const by = new Map<string, number>();
      const ids = new Set<string>();
      for (const r of (JSON.parse(readFileSync(path, "utf8")) as [unknown, Row[]])[1]) {
        ids.add(r.indicator?.id ?? "none");
        if (r.value !== null && r.value !== undefined) by.set(`${r.country.id}:${r.date}`, r.value);
      }
      return { by, id: [...ids].sort().join(", ") };
    };
    const densTable = table(density.path), lfTable = table(labour.path);
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

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log(homePassLine("home/new_companies", held));
