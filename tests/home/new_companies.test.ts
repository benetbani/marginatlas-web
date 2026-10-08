/**
 * WHERE NEW COMPANIES OPEN, LATIN AMERICA AND AFRICA (plan 2026-10-08, home sections, section 2; his ideas of 2026-10-08, "LATAM
 * Gems" and "Best of Africa (countries)", with "Rising stars countries" folded in as the audit found it). New limited companies
 * registered in a year per 1,000 people of working age, one year, each region ranked within itself (data/home/new_companies.json,
 * from the new-business series by scripts/data/home/export_home.py).
 *
 * Holds the slice: it is its source's (scripts/lib/home_export.ts); each region's members are the ones the in-repo files give it (the
 * country profile's world_bank_region for Latin America; its continent, or a MENA country whose cities stand in Africa, for
 * Africa); a member shows only with a figure for the year and a labour force over the floor, which carries its reason; five or more
 * show in each region; the UK's own figure is there; every member shown has a country page; and, where the series is on this
 * machine, every figure is the source's, read again, and the year is the latest in which both regions show five.
 *
 * Run: npx tsx tests/home/new_companies.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { holdHomeExport } from "../../scripts/lib/home_export";
import { COUNTRIES } from "../../src/lib/taxonomy";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-new-companies";
const FILE = "data/home/new_companies.json";
const REMEDY = "re-run python -P scripts/data/home/export_home.py new_companies, never edit data/home by hand; then draw section 2 from the slice only";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

type Member = { iso2: string; value: number | null; labour_force: number | null; shown: boolean };
type Export = { year: number; measure: string; last_updated: string; floor: { measure: string; year: number; at_least: number; why: string }; uk: { iso2: string; value: number }; regions: Array<{ key: string; rule: string; members: Member[] }> };
const REGIONS = ["latam", "africa"] as const;

const held = holdHomeExport("new_companies.json", check);
const d = (held?.data ?? null) as Export | null;
if (d && held) {
  const profile = (JSON.parse(readFileSync("data/economic_indicators/country_profile_v2.json", "utf8")) as { countries: Record<string, { continent?: string; world_bank_region?: string }> }).countries;
  const cityContinent = new Map<string, string>();
  for (const c of (JSON.parse(readFileSync("data/cities/city_list_v1.json", "utf8")) as { cities: Array<{ iso2: string; continent: string }> }).cities) {
    const k = c.iso2.toUpperCase();
    if (!cityContinent.has(k)) cityContinent.set(k, c.continent);
  }
  const regionOf = (iso2: string, p: { continent?: string; world_bank_region?: string }) =>
    p.world_bank_region === "Latin America & Caribbean" ? "latam" : p.continent === "Africa" || (p.continent === "MENA" && cityContinent.get(iso2) === "Africa") ? "africa" : null;
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

  /* THE SOURCE, READ AGAIN, where it is on this machine. */
  const density = held.entry.sources.find((s) => s.key === "density");
  const labour = held.entry.sources.find((s) => s.key === "labour_force");
  if (density && labour && existsSync(density.path) && existsSync(labour.path)) {
    type Row = { country: { id: string }; date: string; value: number | null };
    const table = (path: string) => {
      const by = new Map<string, number>();
      for (const r of (JSON.parse(readFileSync(path, "utf8")) as [unknown, Row[]])[1]) if (r.value !== null && r.value !== undefined) by.set(`${r.country.id}:${r.date}`, r.value);
      return by;
    };
    const dens = table(density.path), lf = table(labour.path);
    const all = d.regions.flatMap((r) => r.members);
    const wrong = all.filter((m) => (dens.get(`${m.iso2}:${d.year}`) ?? null) !== m.value || (lf.get(`${m.iso2}:${d.year}`) ?? null) !== m.labour_force).map((m) => m.iso2);
    check(`every member's ${d.year} figure and labour force are the source's, read again here${wrong.length ? `: differs on ${wrong.join(", ")}` : ""}`, wrong.length === 0 && dens.get(`GB:${d.year}`) === d.uk.value);
    const years = [...new Set([...dens.keys()].map((k) => k.split(":")[1]))].sort().reverse();
    const shows = (iso2: string, y: string) => dens.has(`${iso2}:${y}`) && (lf.get(`${iso2}:${y}`) ?? 0) >= d.floor.at_least;
    const latest = years.find((y) => REGIONS.every((key) => (d.regions.find((r) => r.key === key)?.members ?? []).filter((m) => shows(m.iso2, y)).length >= 5) && dens.has(`GB:${y}`));
    check(`the year is the latest in which both regions show five and the UK has a figure (${latest})`, latest === String(d.year));
  } else console.log("NOTE  the new-business series is not on this machine; its figures were not read again here");
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("home/new_companies: all pass");
