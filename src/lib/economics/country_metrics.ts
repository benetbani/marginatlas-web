/**
 * country_metrics.ts
 *
 * Single accessor for the country-page hero tiles + cost-of-doing-
 * business strip. Reads from:
 *   - data/external/brain-skeleton (WB CSVs): GDP/cap, CPI, informal share
 *   - data/economics/net_wealth_per_adult_usd_v1.json (hand-curated)
 *   - data/economics/self_employment_share_v1.json (hand-curated)
 *   - data/legal/business_formation_costs_v1.json (days to start)
 *   - data/cities/city_list_v1.json (avg gross salary aggregation)
 *
 * Every field has a documented fallback chain so the country page never
 * renders a zero or "n/a" tile when there's a reasonable extrapolation.
 *
 * Country-page rebuild §1 + §2 (2026-05-25).
 *
 * Per R-002, no source-agency name appears in any user-visible string;
 * this module returns numbers and qualitative descriptors only. The
 * country page renders those with the guiding-word system; the source
 * is referenced indirectly via the methodology page link.
 */

import netWealthJson from "../../../data/economics/net_wealth_per_adult_usd_v1.json";
import selfEmpJson from "../../../data/economics/self_employment_share_v1.json";
import formationJson from "../../../data/legal/business_formation_costs_v1.json";
import cityListJson from "../../../data/cities/city_list_v1.json";
import {
  getBrainGdpPerCapitaByIso2,
  getBrainCpiByIso2,
  getBrainInformalShareByIso2,
} from "../external/brain_data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CountryEconomicsSnapshot = {
  /** GDP per capita, USD, latest year. */
  gdpPerCapita: number | null;
  /** Average gross monthly salary, USD. */
  avgMonthlySalary: number | null;
  /** Median net wealth per adult, USD. */
  netWealthPerAdult: number | null;
  /** Self-employment share of total employment, percent (0-100). */
  selfEmploymentPct: number | null;
  /** Typical days to register a sole-trader business. */
  daysToStart: number | null;
  /** CPI year-over-year, percent (e.g. 2.4 for 2.4%). */
  inflationPctYoy: number | null;
};

// ---------------------------------------------------------------------------
// JSON file shapes
// ---------------------------------------------------------------------------

type NetWealthFile = {
  values_usd_median_per_adult: Record<string, number>;
  regional_fallback_usd_median_per_adult: Record<string, number>;
};
type SelfEmpFile = {
  values_pct: Record<string, number>;
  regional_fallback_pct: Record<string, number>;
};
type FormationTier = { tier: string; setup_days: number };
type FormationFile = {
  countries: Record<string, FormationTier[]>;
};
type CityFile = {
  cities: Array<{
    iso2: string;
    tier?: number;
    pop_m?: number;
    avg_gross_salary_usd_year?: number;
  }>;
};

const NET_WEALTH = netWealthJson as NetWealthFile;
const SELF_EMP = selfEmpJson as SelfEmpFile;
const FORMATION = formationJson as FormationFile;
const CITIES = cityListJson as CityFile;

// ---------------------------------------------------------------------------
// Per-iso2 derived tables (built once at module load).
// ---------------------------------------------------------------------------

/**
 * Country-level avg gross monthly salary aggregated from the city list.
 * For each iso2 with >= 2 cities, take the population-weighted mean of
 * the cities' avg_gross_salary_usd_year, then / 12 for monthly.
 *
 * Countries with < 2 cities fall through to the GDP-based heuristic.
 */
const SALARY_BY_ISO2: Map<string, number> = (() => {
  const groups = new Map<string, Array<{ pop: number; salary: number }>>();
  for (const c of CITIES.cities) {
    const iso = (c.iso2 || "").toUpperCase();
    if (!iso) continue;
    const sal = c.avg_gross_salary_usd_year;
    if (typeof sal !== "number" || sal <= 0) continue;
    const pop = typeof c.pop_m === "number" && c.pop_m > 0 ? c.pop_m : 0.5;
    if (!groups.has(iso)) groups.set(iso, []);
    groups.get(iso)!.push({ pop, salary: sal });
  }
  const out = new Map<string, number>();
  for (const [iso, rows] of groups.entries()) {
    if (rows.length < 2) continue;
    let totalW = 0;
    let totalS = 0;
    for (const r of rows) {
      totalW += r.pop;
      totalS += r.pop * r.salary;
    }
    if (totalW > 0) out.set(iso, totalS / totalW);
  }
  return out;
})();

/**
 * Days-to-start lookup. Prefers Sole-Trader tier when present; falls back
 * to LLC tier; falls back to the minimum of all tiers for the country.
 */
const DAYS_TO_START_BY_ISO2: Map<string, number> = (() => {
  const out = new Map<string, number>();
  for (const [iso, tiers] of Object.entries(FORMATION.countries || {})) {
    if (!Array.isArray(tiers) || tiers.length === 0) continue;
    const soleTrader = tiers.find((t) => t.tier === "Sole Trader");
    const freelancer = tiers.find((t) => t.tier === "Freelancer");
    const llc = tiers.find((t) => t.tier === "LLC");
    const pick =
      (soleTrader && soleTrader.setup_days) ??
      (freelancer && freelancer.setup_days) ??
      (llc && llc.setup_days) ??
      Math.min(...tiers.map((t) => t.setup_days || 999));
    if (typeof pick === "number" && pick > 0 && pick < 999) {
      out.set(iso.toUpperCase(), pick);
    }
  }
  return out;
})();

// ---------------------------------------------------------------------------
// Region inference (for fallbacks). Uses the brain country master.
// ---------------------------------------------------------------------------

/**
 * Map a brain `region` string (which is the source's region grouping)
 * to the key shape used in the fallback tables.
 */
function regionKey(region: string): keyof NetWealthFile["regional_fallback_usd_median_per_adult"] | null {
  const r = region.toLowerCase();
  if (r.includes("sub-saharan africa") || r.includes("africa")) return "Africa";
  if (r.includes("latin america") || r.includes("caribbean"))
    return "Latin_America_Caribbean";
  if (r.includes("europe") && r.includes("central asia")) {
    // brain bucket: Europe & Central Asia — too coarse. We split by
    // income group elsewhere; here, return the Western bucket so the
    // fallback is conservative.
    return "Western_Europe";
  }
  if (r.includes("north america")) return "North_America";
  if (r.includes("middle east") || r.includes("north africa")) return "MENA";
  if (r.includes("south asia")) return "South_Asia";
  if (r.includes("east asia") || r.includes("pacific")) return "East_Asia_Pacific";
  return null;
}

// ---------------------------------------------------------------------------
// Salary heuristic: when no city-aggregate exists, derive from GDP/cap.
// Salary share of GDP/cap varies by income tier:
//   OECD high-income: ~0.45
//   Upper-middle EM:  ~0.35
//   Lower-middle EM:  ~0.25
//   Low income:       ~0.18
// ---------------------------------------------------------------------------

function salaryShareForGdp(gdpPerCapita: number): number {
  if (gdpPerCapita >= 30000) return 0.45;
  if (gdpPerCapita >= 15000) return 0.4;
  if (gdpPerCapita >= 7000) return 0.32;
  if (gdpPerCapita >= 3000) return 0.25;
  return 0.18;
}

// ---------------------------------------------------------------------------
// Inflation YoY. Latest CPI value / previous CPI value - 1.
// Uses the brain CPI series (2010 = 100). Falls back to null if either
// year is missing.
// ---------------------------------------------------------------------------

function latestInflationPctYoy(iso2: string): number | null {
  const cpi = getBrainCpiByIso2().get(iso2);
  if (!cpi) return null;
  const years = Array.from(cpi.keys()).sort((a, b) => b - a);
  if (years.length < 2) return null;
  const latestYear = years[0];
  const prevYear = latestYear - 1;
  const latest = cpi.get(latestYear);
  const prev = cpi.get(prevYear);
  if (!latest || !prev || prev === 0) return null;
  const pct = (latest / prev - 1) * 100;
  if (!isFinite(pct)) return null;
  // Clamp visually: hyperinflations (Venezuela 1000%+) make the strip
  // unreadable. Cap at 999 for display safety.
  if (pct > 999) return 999;
  if (pct < -50) return -50;
  return Math.round(pct * 10) / 10;
}

// ---------------------------------------------------------------------------
// Public accessor
// ---------------------------------------------------------------------------

export function getCountryEconomicsSnapshot(
  iso2: string,
): CountryEconomicsSnapshot {
  const key = iso2.toUpperCase();
  const gdp = getBrainGdpPerCapitaByIso2().get(key) ?? null;

  // Avg monthly salary: city-aggregate first; GDP-heuristic fallback.
  let avgMonthlySalary: number | null = null;
  const cityAggYearly = SALARY_BY_ISO2.get(key);
  if (typeof cityAggYearly === "number" && cityAggYearly > 0) {
    avgMonthlySalary = Math.round(cityAggYearly / 12);
  } else if (typeof gdp === "number" && gdp > 0) {
    const share = salaryShareForGdp(gdp);
    avgMonthlySalary = Math.round((gdp * share) / 12);
  }

  // Net wealth per adult: hand-curated table first; regional fallback.
  let netWealthPerAdult: number | null =
    NET_WEALTH.values_usd_median_per_adult[key] ?? null;
  if (netWealthPerAdult == null) {
    // Try region from brain country master via informal share's
    // attached country (no direct region accessor in brain_data — use
    // the GDP-tier heuristic as a coarse stand-in).
    if (typeof gdp === "number" && gdp > 0) {
      if (gdp >= 40000) netWealthPerAdult = 100000;
      else if (gdp >= 20000) netWealthPerAdult = 50000;
      else if (gdp >= 10000) netWealthPerAdult = 20000;
      else if (gdp >= 5000) netWealthPerAdult = 8000;
      else if (gdp >= 2000) netWealthPerAdult = 3000;
      else netWealthPerAdult = 1000;
    }
  }

  // Self-employment share: hand-curated first; informal-share-derived
  // fallback (informal share is broader but correlated).
  let selfEmploymentPct: number | null = SELF_EMP.values_pct[key] ?? null;
  if (selfEmploymentPct == null) {
    const inf = getBrainInformalShareByIso2().get(key);
    if (inf && typeof inf.informalPct === "number") {
      // Self-employment is typically 50-80% of informal share for
      // emerging markets; use 60% as a midpoint.
      selfEmploymentPct = Math.round(inf.informalPct * 0.6);
    }
  }

  const daysToStart = DAYS_TO_START_BY_ISO2.get(key) ?? null;
  const inflationPctYoy = latestInflationPctYoy(key);

  return {
    gdpPerCapita: gdp,
    avgMonthlySalary,
    netWealthPerAdult,
    selfEmploymentPct,
    daysToStart,
    inflationPctYoy,
  };
}

// ---------------------------------------------------------------------------
// Convenience formatters for display.
// ---------------------------------------------------------------------------

export function fmtSalaryMonthly(usd: number | null): string {
  if (usd == null) return "-";
  if (usd >= 10000) return `$${Math.round(usd / 1000)}K`;
  if (usd >= 1000) return `$${(usd / 1000).toFixed(1)}K`;
  return `$${Math.round(usd)}`;
}

export function fmtWealthPerAdult(usd: number | null): string {
  if (usd == null) return "-";
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
  if (usd >= 1000) return `$${Math.round(usd / 1000)}K`;
  return `$${usd}`;
}

export function fmtGdpPerCapita(usd: number | null): string {
  if (usd == null) return "-";
  if (usd >= 1000) return `$${Math.round(usd / 1000)}K`;
  return `$${Math.round(usd)}`;
}

export function fmtPct(pct: number | null, digits = 0): string {
  if (pct == null) return "-";
  return `${pct.toFixed(digits)}%`;
}

export function fmtDays(days: number | null): string {
  if (days == null) return "-";
  if (days <= 1) return "1 day";
  if (days <= 7) return `${days} days`;
  if (days <= 30) return `${Math.round(days / 7)} weeks`;
  return `${Math.round(days / 30)} months`;
}
