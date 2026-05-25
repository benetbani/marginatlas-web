/**
 * brain_data - loader for the brain-skeleton CSV snapshot.
 *
 * Reads the 6 CSVs under data/external/brain-skeleton/ at module-init
 * time, parses them into iso2-keyed maps with latest-year-wins
 * semantics. Memory footprint at runtime: ~1 MB (the CPI file is the
 * largest at 9K rows).
 *
 * All consumers MUST go through this module. Do not fs.readFileSync()
 * the snapshot CSVs directly anywhere else.
 *
 * Source-of-truth contract: see data/external/brain-skeleton/README.md.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const DIR = resolve(process.cwd(), "data/external/brain-skeleton");

// ---------------------------------------------------------------------------
// Minimal CSV reader. The snapshot files are plain WB-style CSVs with no
// quoted commas inside fields, so we use a line.split(",") approach
// rather than pulling in a parser dependency.
// ---------------------------------------------------------------------------

function readCsv(filename: string): Record<string, string>[] {
  const text = readFileSync(resolve(DIR, filename), "utf-8");
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length === 0) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  const out: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(",");
    if (cells.length < headers.length) continue;
    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = (cells[j] || "").trim();
    }
    out.push(row);
  }
  return out;
}

// Pick the row with the latest year for each iso2 key.
function latestByIso2<T extends Record<string, string>>(
  rows: T[],
  yearField = "year",
): Map<string, T> {
  const m = new Map<string, T>();
  for (const r of rows) {
    const iso2 = (r.iso2 || "").toUpperCase();
    if (!iso2) continue;
    const y = parseInt(r[yearField] || "0", 10);
    const existing = m.get(iso2);
    if (!existing) {
      m.set(iso2, r);
      continue;
    }
    const ey = parseInt(existing[yearField] || "0", 10);
    if (y > ey) m.set(iso2, r);
  }
  return m;
}

// ---------------------------------------------------------------------------
// Country master
// ---------------------------------------------------------------------------

export type BrainCountry = {
  iso2: string;
  iso3: string;
  name: string;
  region: string;
  incomeGroup: string;
  currency: string;
};

let _countries: Map<string, BrainCountry> | null = null;

export function getBrainCountries(): Map<string, BrainCountry> {
  if (_countries) return _countries;
  const rows = readCsv("world_bank_countries.csv");
  const m = new Map<string, BrainCountry>();
  for (const r of rows) {
    const iso2 = (r.iso2 || "").toUpperCase();
    if (!iso2) continue;
    m.set(iso2, {
      iso2,
      iso3: (r.iso3 || "").toUpperCase(),
      name: r.name || "",
      region: r.region || "",
      incomeGroup: r.income_group || "",
      currency: r.currency || "",
    });
  }
  _countries = m;
  return m;
}

// ---------------------------------------------------------------------------
// Population
// ---------------------------------------------------------------------------

let _population: Map<string, number> | null = null;

export function getBrainPopulationByIso2(): Map<string, number> {
  if (_population) return _population;
  const rows = readCsv("world_bank_population.csv");
  const latest = latestByIso2(rows);
  const m = new Map<string, number>();
  for (const [iso2, r] of latest) {
    const n = parseFloat(r.population || "");
    if (isFinite(n) && n > 0) m.set(iso2, n);
  }
  _population = m;
  return m;
}

// ---------------------------------------------------------------------------
// GDP per capita (USD)
// ---------------------------------------------------------------------------

let _gdpPerCapita: Map<string, number> | null = null;

export function getBrainGdpPerCapitaByIso2(): Map<string, number> {
  if (_gdpPerCapita) return _gdpPerCapita;
  const rows = readCsv("world_bank_gdp_per_capita.csv");
  const latest = latestByIso2(rows);
  const m = new Map<string, number>();
  for (const [iso2, r] of latest) {
    const n = parseFloat(r.gdp_per_capita_usd || "");
    if (isFinite(n) && n > 0) m.set(iso2, n);
  }
  _gdpPerCapita = m;
  return m;
}

// ---------------------------------------------------------------------------
// Implied FX (local currency per USD)
// ---------------------------------------------------------------------------

let _impliedFx: Map<string, number> | null = null;

export function getBrainImpliedFxByIso2(): Map<string, number> {
  if (_impliedFx) return _impliedFx;
  const rows = readCsv("world_bank_implied_fx.csv");
  const latest = latestByIso2(rows);
  const m = new Map<string, number>();
  for (const [iso2, r] of latest) {
    const n = parseFloat(r.implied_fx_local_per_usd || "");
    if (isFinite(n) && n > 0) m.set(iso2, n);
  }
  _impliedFx = m;
  return m;
}

// ---------------------------------------------------------------------------
// Informal economy share (pct of GDP)
//
// Three columns in the source: dge_pct (dynamic general equilibrium),
// mimic_pct (MIMIC model), informal_pct (the headline blended value).
// We expose the blended value as the headline + the components for
// callers that want to compare or use a specific methodology.
// ---------------------------------------------------------------------------

export type InformalShare = {
  iso2: string;
  iso3: string;
  countryName: string;
  year: number;
  dgePct: number | null;
  mimicPct: number | null;
  informalPct: number | null;
};

let _informal: Map<string, InformalShare> | null = null;

export function getBrainInformalShareByIso2(): Map<string, InformalShare> {
  if (_informal) return _informal;
  const rows = readCsv("informal_share.csv");
  const latest = latestByIso2(rows);
  const m = new Map<string, InformalShare>();
  for (const [iso2, r] of latest) {
    const parseOrNull = (s: string): number | null => {
      const n = parseFloat(s);
      return isFinite(n) ? n : null;
    };
    m.set(iso2, {
      iso2,
      iso3: (r.iso3 || "").toUpperCase(),
      countryName: r.country_name || "",
      year: parseInt(r.year || "0", 10),
      dgePct: parseOrNull(r.dge_pct || ""),
      mimicPct: parseOrNull(r.mimic_pct || ""),
      informalPct: parseOrNull(r.informal_pct || ""),
    });
  }
  _informal = m;
  return m;
}

// ---------------------------------------------------------------------------
// CPI series (2010 = 100)
//
// The file has ~9K rows (long format: iso2, year, cpi). We index by iso2
// and store an inner year->cpi map so callers can compute inflation
// between any two years.
// ---------------------------------------------------------------------------

let _cpi: Map<string, Map<number, number>> | null = null;

export function getBrainCpiByIso2(): Map<string, Map<number, number>> {
  if (_cpi) return _cpi;
  const rows = readCsv("world_bank_cpi.csv");
  const m = new Map<string, Map<number, number>>();
  for (const r of rows) {
    const iso2 = (r.iso2 || "").toUpperCase();
    if (!iso2) continue;
    const y = parseInt(r.year || "0", 10);
    const v = parseFloat(r.cpi_2010_100 || "");
    if (!isFinite(v) || !isFinite(y) || y <= 0) continue;
    if (!m.has(iso2)) m.set(iso2, new Map());
    m.get(iso2)!.set(y, v);
  }
  _cpi = m;
  return m;
}

/** CPI inflation multiplier from `fromYear` to `toYear` for a country.
 * Returns 1.0 if either year is missing. Use to bring a historical
 * nominal amount up to a target year's purchasing power. */
export function cpiMultiplier(
  iso2: string,
  fromYear: number,
  toYear: number,
): number {
  const cpi = getBrainCpiByIso2().get(iso2.toUpperCase());
  if (!cpi) return 1.0;
  const a = cpi.get(fromYear);
  const b = cpi.get(toYear);
  if (!isFinite(a as number) || !isFinite(b as number)) return 1.0;
  if (!a || a === 0) return 1.0;
  return (b as number) / a;
}

// ---------------------------------------------------------------------------
// Convenience: full snapshot for a country, the way most callers want it.
// ---------------------------------------------------------------------------

export type BrainCountrySnapshot = {
  iso2: string;
  name: string;
  iso3: string;
  region: string;
  incomeGroup: string;
  currency: string;
  populationLatest: number | null;
  gdpPerCapitaUsdLatest: number | null;
  impliedFxLatest: number | null;
  informalSharePct: number | null;
};

export function getBrainCountrySnapshot(
  iso2: string,
): BrainCountrySnapshot | null {
  const upper = iso2.toUpperCase();
  const country = getBrainCountries().get(upper);
  if (!country) return null;
  const pop = getBrainPopulationByIso2().get(upper) ?? null;
  const gdp = getBrainGdpPerCapitaByIso2().get(upper) ?? null;
  const fx = getBrainImpliedFxByIso2().get(upper) ?? null;
  const inf = getBrainInformalShareByIso2().get(upper)?.informalPct ?? null;
  return {
    iso2: country.iso2,
    name: country.name,
    iso3: country.iso3,
    region: country.region,
    incomeGroup: country.incomeGroup,
    currency: country.currency,
    populationLatest: pop,
    gdpPerCapitaUsdLatest: gdp,
    impliedFxLatest: fx,
    informalSharePct: inf,
  };
}
