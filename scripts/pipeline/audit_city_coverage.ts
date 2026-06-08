/**
 * scripts/pipeline/audit_city_coverage.ts
 *
 * City-data pipeline, step 1: the coverage audit.
 *
 * Scans every city in the master list against the CITY-SPECIFIC data a city page
 * deserves, reports per-city what is real-and-city-specific vs missing, and writes
 * a PRIORITISED BACKLOG (data/cities/_pipeline/coverage.json) the fill loop works
 * one city at a time. Reads only static JSON (no DB, no network); instant and safe.
 * It changes nothing live: it only measures and orders the work.
 *
 * IMPORTANT semantics (learned from the data, not assumed):
 *   - The signature panel RESOLVES as a country baseline (country_signature_v1,
 *     196 countries) merged with a city override (city_signature_v1, 59 cities).
 *     So almost every city already RENDERS a panel, but mostly with GENERIC
 *     country data: only 1 city has its own sectors and 55 their own demographics.
 *     The gap the loop fills is the CITY-SPECIFIC layer (a secondary city showing
 *     its country's sectors instead of its own is the thing to fix), so this audit
 *     measures the city OVERRIDE, not the inherited fallback.
 *   - Every city already has a neighborhood SCHEME (3-5 sub-areas). The gap there
 *     is DEPTH: the new neighborhood economics (streets, rent, spend, drivers,
 *     dynamics, designed 2026-06-08), which exists for no city yet.
 *
 * Fill targets (what the loop produces, all city-specific and real):
 *   board_economics   city_list salary + cost-of-living index + tourist arrivals
 *                     (the board + score read these; missing => dashes).
 *   demographics      the city's OWN foreign-born + foreign-owned percents.
 *   sectors           the city's OWN three signature sectors (not the country's).
 *   nbhd_economics    NEW: per-neighborhood prime streets, rent vs city, spend per
 *                     visit, demand-driver mix, time-of-day/week dynamics.
 *
 * Run: npx tsx scripts/pipeline/audit_city_coverage.ts
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";

const ROOT = process.cwd();
const DATA = resolve(ROOT, "data", "cities");

function loadJson<T>(rel: string): T {
  return JSON.parse(readFileSync(resolve(DATA, rel), "utf-8")) as T;
}

type CityRecord = {
  slug: string;
  name: string;
  iso2: string;
  tier: number;
  avg_gross_salary_usd_year?: number;
  cost_of_living_index?: number;
  tourist_arrivals_m?: number;
};
type SignatureEntry = {
  foreign_born_pct?: number;
  foreign_owned_pct?: number;
  signature_sectors?: unknown[];
};
type Scheme = { scheme?: string; neighborhoods?: unknown[] };

const cities = loadJson<{ cities: CityRecord[] }>("city_list_v1.json").cities;
const cityOverride = loadJson<{ cities: Record<string, SignatureEntry> }>(
  "city_signature_v1.json",
).cities;
const countryBaseline = loadJson<{ countries: Record<string, SignatureEntry> }>(
  "country_signature_v1.json",
).countries;
const schemes = loadJson<{ cities: Record<string, Scheme> }>(
  "neighborhoods_v1.json",
).cities;

function has(n: number | null | undefined): boolean {
  return typeof n === "number" && Number.isFinite(n);
}
function ownSectors(slug: string): boolean {
  const s = cityOverride[slug];
  return !!s && Array.isArray(s.signature_sectors) && s.signature_sectors.length >= 3;
}
function ownDemographics(slug: string): boolean {
  const s = cityOverride[slug];
  return !!s && has(s.foreign_born_pct) && has(s.foreign_owned_pct);
}

/** A city-specific fill target the loop produces. */
type TableCheck = { key: string; label: string; present: (c: CityRecord) => boolean };

const TABLES: TableCheck[] = [
  {
    key: "board_economics",
    label: "Board economics (salary, cost index, tourism)",
    present: (c) =>
      has(c.avg_gross_salary_usd_year) &&
      has(c.cost_of_living_index) &&
      has(c.tourist_arrivals_m),
  },
  {
    key: "demographics",
    label: "City-specific demographics (own foreign-born/owned)",
    present: (c) => ownDemographics(c.slug),
  },
  {
    key: "sectors",
    label: "City-specific signature sectors (own, not country)",
    present: (c) => ownSectors(c.slug),
  },
  {
    key: "nbhd_economics",
    label: "Neighborhood economics (streets, spend, drivers, dynamics)",
    present: () => false, // NEW vertical: no city holds this yet.
  },
];

type CityCoverage = {
  slug: string;
  name: string;
  iso2: string;
  tier: number;
  present: string[];
  missing: string[];
  completeness: number;
  /** Context, not a fill target: does a country baseline exist so a panel renders
   *  at all (even if generic) while the city-specific layer is still missing. */
  signature_renders: boolean;
};

const coverage: CityCoverage[] = cities.map((c) => {
  const present: string[] = [];
  const missing: string[] = [];
  for (const t of TABLES) (t.present(c) ? present : missing).push(t.key);
  return {
    slug: c.slug,
    name: c.name,
    iso2: c.iso2,
    tier: c.tier,
    present,
    missing,
    completeness: present.length / TABLES.length,
    signature_renders: !!countryBaseline[c.iso2.toUpperCase()],
  };
});

// Fill priority: flagship tier first, then least-complete first within a tier,
// then alphabetical for a stable, resumable order.
const backlog = [...coverage].sort((a, b) => {
  if (a.tier !== b.tier) return a.tier - b.tier;
  if (a.completeness !== b.completeness) return a.completeness - b.completeness;
  return a.slug.localeCompare(b.slug);
});

// --- report ---------------------------------------------------------------
console.log("");
console.log("=".repeat(78));
console.log("CITY DATA COVERAGE AUDIT (city-specific fill targets)");
console.log("=".repeat(78));
console.log(`Cities: ${cities.length}`);
for (const t of TABLES) {
  const n = coverage.filter((c) => c.present.includes(t.key)).length;
  console.log(
    `  ${t.label.padEnd(56)} ${String(n).padStart(3)}/${cities.length}  ${Math.round((n / cities.length) * 100)}%`,
  );
}
const fully = coverage.filter((c) => c.missing.length === 0).length;
const schemesPresent = cities.filter(
  (c) => (schemes[c.slug]?.neighborhoods?.length ?? 0) >= 3,
).length;
const renders = coverage.filter((c) => c.signature_renders).length;
console.log("  " + "-".repeat(70));
console.log(`  Context: signature panel renders (country baseline)     ${renders}/${cities.length}`);
console.log(`  Context: neighborhood scheme present (>= 3 sub-areas)    ${schemesPresent}/${cities.length}`);
console.log(`  ${"FULLY city-specific (all four targets)".padEnd(56)} ${String(fully).padStart(3)}/${cities.length}`);

console.log("");
console.log("Next 15 in the fill backlog (flagship + thinnest first):");
for (const c of backlog.slice(0, 15)) {
  console.log(`  ${c.slug.padEnd(20)} T${c.tier}  missing: ${c.missing.join(", ")}`);
}

const outPath = resolve(DATA, "_pipeline", "coverage.json");
if (!existsSync(dirname(outPath))) mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(
  outPath,
  JSON.stringify(
    {
      version: "1",
      table_keys: TABLES.map((t) => ({ key: t.key, label: t.label })),
      total_cities: cities.length,
      fully_complete: fully,
      backlog,
    },
    null,
    2,
  ),
);
console.log("");
console.log(`Backlog written: ${outPath.replace(ROOT, ".")}  (${backlog.length} cities)`);
console.log("");
