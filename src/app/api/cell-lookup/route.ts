/**
 * /api/cell-lookup — server-side cell fetch for the /compare page.
 *
 * Input: ?country=US&industry=restaurants[&region=california]
 * Output: A compact subset of Cell suitable for the board-styled comparison
 * grid, or null when no match.
 *
 * The compare grid mirrors the decisive A/B/C/H/I/J rows of the cell-page
 * board, so this route computes the same derived figures the cell page does,
 * reusing the same canonical helpers (estimateNetProfit + clampMargin for net
 * margin, the founder-rule take-home floor, the curated London entry for the
 * qualitative pricing / rent / labor / survival reads). Computing them here
 * keeps the heavy, server-only finance + Supabase code on the server: the
 * client renders the returned plain numbers and strings with format.ts only.
 *
 * Every derived field self-omits to null when its inputs are absent, so the
 * grid shows an honest dash rather than an invented number.
 */

import { NextRequest, NextResponse } from "next/server";
import { getCellBySlug, getTopCells, slugify } from "@/lib/cells";
import { industryToSlug, INDUSTRY_BY_ID } from "@/lib/taxonomy";
import { estimateNetProfit } from "@/lib/finance/net_profit";
import { clampMargin } from "@/lib/finance/margin_floor";
import { resolveOwnerTakeHome } from "@/lib/finance/owner_take_home";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { getCityPopulation } from "@/lib/cities/city_tier";
import {
  estimateWagePerEmployee,
  estimateEmployeesFromFirms,
} from "@/lib/extrapolations/fill_missing";
import { getLondonEntry } from "@/lib/scores/cell_board";
import { isTrustedLocalCell } from "@/lib/cells/trust";
import { isGatingEnabled } from "@/lib/feature_flags";

// Cache for 1 day on Vercel's edge cache
export const revalidate = 86400;

const CACHE_HEADERS = {
  // Per-query edge caching for the /compare page.
  "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
};

/** The shape the /compare grid consumes per city. */
type CompactCell = {
  country: string;
  region: string | null;
  industry: string;
  year: number | null;
  // A. The numbers
  revenue_per_firm: number | null;
  rev_p10: number | null;
  rev_p25: number | null;
  rev_p50: number | null;
  rev_p75: number | null;
  rev_p90: number | null;
  net_margin: number | null; // share, 0..1
  owner_take_home: number | null; // USD per year, floored as on the cell page
  // B. The market
  n_enterprises: number | null;
  density_per_10k: number | null;
  n_employees: number | null;
  payroll_per_employee: number | null;
  // C / H / I — pricing, location, labor (qualitative reads; London only)
  pricing_power: string | null;
  rent_pressure: string | null;
  rent_share_pct: number | null; // whole-number percent, 0..100
  labor_pressure: string | null;
  payroll_share_pct: number | null; // whole-number percent, 0..100
  // J. Survival (London only)
  survival_yr1: number | null;
  survival_yr3: number | null;
  survival_yr5: number | null;
  quality_score: number | null;
  cellUrl: string | null;
};

/** A finite, real number (not null, not NaN, not Infinity). */
function isNum(n: number | null | undefined): n is number {
  return n != null && Number.isFinite(n);
}

/**
 * Normalise a cost share to a whole-number percent (0..100). The cell
 * cost_structure may arrive as percentages (0..100) or fractions (0..1); a
 * value at or below 1 is treated as a fraction and scaled. Non-finite → null.
 * Matches src/lib/scores/cell_board.ts pctShare so the grid reads identically.
 */
function pctShare(v: number | null | undefined): number | null {
  if (!isNum(v)) return null;
  const pct = v <= 1 ? v * 100 : v;
  return Math.round(pct);
}

/** Competitors per 10k residents, or null. Mirrors the cell-page density math. */
function densityPer10k(
  competitors: number | null | undefined,
  population: number | null | undefined,
): number | null {
  if (!isNum(competitors)) return null;
  if (!isNum(population) || population <= 0) return null;
  return Math.round((competitors / (population / 10000)) * 10) / 10;
}

/** A present, non-empty qualitative string, else null (so the row blanks). */
function textOrNull(s: string | null | undefined): string | null {
  return typeof s === "string" && s.trim().length > 0 ? s : null;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const country = (url.searchParams.get("country") || "").toUpperCase();
  const industryId = url.searchParams.get("industry") || "";
  const region = (url.searchParams.get("region") || "").toLowerCase();

  if (!country || !industryId || !INDUSTRY_BY_ID[industryId]) {
    return NextResponse.json(
      { cell: null, reason: "missing or invalid country/industry" },
      { headers: CACHE_HEADERS },
    );
  }
  const industrySlug = industryToSlug(industryId);

  // US: state-level data from cells_master. Default to california.
  // Non-US: country-level extrapolated cells (Phase F is live).
  let regionSlug = region;
  if (country === "US" && !regionSlug) regionSlug = "california";
  if (country !== "US") regionSlug = country.toLowerCase(); // not used for non-US lookup, just passed through

  const cell = await getCellBySlug(country.toLowerCase(), regionSlug, industrySlug);
  if (!cell) {
    return NextResponse.json({ cell: null, reason: "no_match" }, { headers: CACHE_HEADERS });
  }

  // -- Curated London entry. Present only on GB cells in the dataset. Carries
  // the qualitative pricing / rent / labor / survival reads and, when set, the
  // modeled London economics the board prefers over country-fallback figures.
  const londonEntry = getLondonEntry(cell);
  const LE = londonEntry?.economics ?? null;

  // -- Trust gate. A country-level / extrapolated (tier "X") / synthetic read is
  // not a local measurement we can stand behind: returning its modeled revenue
  // and take-home under a place title is what let an extrapolated read claim a
  // poorer country out-earns a richer one. So we resolve trust once here and
  // dash every absolute-money field (revenue, the spread, take-home, wage) when
  // the cell is not trusted. Curated London (modeled economics present, or a
  // tier-P lad measurement) is trusted, so its filled exemplar is unaffected.
  // Counts and ratios (density, employees, margin, cost shares) keep their
  // existing per-field guards.
  const moneyTrusted =
    LE != null || isTrustedLocalCell(cell, cell.industry_id || undefined);

  // -- A. Typical revenue + spread. On a London cell prefer the modeled
  // London revenue and derive its p10/p90 the same way the board does.
  const typicalRevenue = LE
    ? LE.revenue
    : cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  const revP10 = LE ? LE.revenue * 0.5 : cell.rev_p10 ?? null;
  const revP90 = LE ? LE.revenue * 1.8 : cell.rev_p90 ?? null;

  // -- A. Net margin + owner take-home. Same path as the cell page: estimate
  // the net-profit waterfall from the typical revenue and the typical firm's
  // payroll, clamp the margin, then floor the take-home for larger firms.
  const grossRevenueForMargin = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  let payrollForMargin: number | null = null;
  if (cell.payroll_per_employee != null && cell.n_employees != null) {
    const empPerFirm =
      cell.n_enterprises && cell.n_enterprises > 0
        ? cell.n_employees < cell.n_enterprises
          ? cell.n_employees // already per-firm
          : cell.n_employees / cell.n_enterprises
        : cell.n_employees;
    const effectiveEmpPerFirm = Math.max(1, empPerFirm);
    payrollForMargin = cell.payroll_per_employee * effectiveEmpPerFirm;
  }
  const netProfitResult =
    grossRevenueForMargin && grossRevenueForMargin > 0
      ? estimateNetProfit({
          iso2: country,
          geoId: cell.geo_id || regionSlug,
          industryId: cell.industry_id || null,
          sectorId: cell.sector_id || null,
          grossRevenue: grossRevenueForMargin,
          payroll: payrollForMargin,
        })
      : null;

  // Net margin: London modeled figure when present, else the clamped waterfall
  // margin. Defensive floor never lets a sub-3% net margin reach the grid.
  const netMargin =
    LE && isNum(LE.net_margin_pct)
      ? LE.net_margin_pct / 100
      : netProfitResult != null
        ? clampMargin(netProfitResult.net_margin, "net", cell.industry_id || null)
        : null;

  // Owner take-home: London modeled figure when present, else the ONE shared
  // resolver (src/lib/finance/owner_take_home.ts), exactly as the cell page
  // does.
  //
  // WHAT WAS WRONG. This route printed estimateNetProfit().net_profit RAW,
  // floored only by the larger-firm 2x-income rule, into the same grid column
  // set as a net margin the line above runs through clampMargin, whose floor is
  // 3%. So the compare grid could show a revenue, "3% net" beside it, and a
  // take-home worth a fraction of 3% of that revenue, or a NEGATIVE one. The
  // header of this file already claimed parity with the cell page, and the cell
  // page has resolved its take-home through the shared module since that module
  // was written for exactly this contradiction.
  //
  // Measured over the pure estimator, sweeping 243 activities x 12 countries x
  // 6 revenue levels x 3 size bands (52,488 combinations): the two derivations
  // agreed on 44.8% and differed on 55.2%. Worst case printed minus $124,500
  // beside "3% net" of $2,500,000, which the cell page renders as $75,000, a
  // $199,500 gap on one row. Neither derivation ever omitted where the other
  // printed. That sweep covers the PARAMETER SPACE, not the live cell
  // population: it cannot say how many compared cities print the pair, only how
  // much of the input shape the two disagreed over.
  //
  // isLargerFirm is genuinely resolved here (unlike the homepage beats and the
  // across-cities columns, which pass false because their all-sizes slates
  // carry no size band): a compare cell can be a 10+ employee band, and the 2x
  // floor is the founder rule for exactly those. It is never applied to 1-4 or
  // 5-9, which is what the explicit band list below guarantees.
  //
  // The curated London branch is deliberately NOT routed through the resolver.
  // Its take-home is already revenue x net_margin_pct by construction:
  // src/lib/london/market.ts closes that identity at load, so LE.owner_take_home
  // and the LE.net_margin_pct printed beside it cannot contradict each other.
  const econSnap = getCountryEconomicsSnapshot(country);
  const annualIncome =
    econSnap.avgMonthlySalary != null ? econSnap.avgMonthlySalary * 12 : null;
  const isLargerFirm =
    !!cell.size_band &&
    ["10-19", "20-49", "50-99", "100+"].includes(cell.size_band);
  const ownerTakeHome =
    LE && isNum(LE.owner_take_home)
      ? LE.owner_take_home
      : resolveOwnerTakeHome({
          structuralNetProfit: netProfitResult?.net_profit ?? null,
          rawNetMargin: netProfitResult?.net_margin ?? null,
          revenue: grossRevenueForMargin,
          industryId: cell.industry_id || null,
          isLargerFirm,
          annualIncome,
        });

  // -- B. Competitors + density. A country-level fallback cell carries a
  // national firm count, not a local one, so suppress it under a city title.
  // A London cell with modeled economics overrides this with the real London
  // firm count and the per-10k density on London's resident population.
  const cityPopulation = getCityPopulation(regionSlug);
  const isLocalCell = LE != null || cell.geo_level !== "country";
  const competitors = LE
    ? LE.firms
    : isLocalCell
      ? cell.n_enterprises ?? null
      : null;
  const density = LE
    ? densityPer10k(LE.firms, getCityPopulation("london"))
    : densityPer10k(competitors, cityPopulation);

  // -- H / I. Cost shares from the cell's cost_structure (rent + labor), read
  // as whole-number percents the same way the board does.
  const rentSharePct = cell.cost_structure
    ? pctShare(cell.cost_structure.rent)
    : null;
  const payrollSharePct = cell.cost_structure
    ? pctShare(cell.cost_structure.labor)
    : null;

  // Wage per employee: measured, else the same extrapolation fallback the
  // cell-page tiles use (never a blank when an estimate is computable).
  const wagePerEmployee =
    cell.payroll_per_employee ??
    estimateWagePerEmployee(country, cell.industry_id, regionSlug);
  const employees =
    cell.n_employees ??
    estimateEmployeesFromFirms(cell.industry_id, cell.n_enterprises);

  const L = londonEntry;
  const compact: CompactCell = {
    country: cell.country,
    region: cell.geo_name,
    industry: cell.industry_name || industryId,
    year: cell.year,
    revenue_per_firm: moneyTrusted ? typicalRevenue : null,
    rev_p10: moneyTrusted ? revP10 : null,
    rev_p25: moneyTrusted ? cell.rev_p25 ?? null : null,
    rev_p50: moneyTrusted ? cell.rev_p50 ?? null : null,
    rev_p75: moneyTrusted ? cell.rev_p75 ?? null : null,
    rev_p90: moneyTrusted ? revP90 : null,
    net_margin: netMargin,
    // Paywall gate (Milestone 2, dormant): the Compare grid is fed by this
    // edge-cached PUBLIC response, so per-user gating is impossible here. When
    // the gate is on we redact the figure for everyone; an entitled viewer's
    // browser re-fetches the real number per cell from the authed reveal API.
    owner_take_home: isGatingEnabled() || !moneyTrusted ? null : ownerTakeHome,
    n_enterprises: competitors,
    density_per_10k: density,
    n_employees: employees ?? null,
    payroll_per_employee: moneyTrusted ? wagePerEmployee ?? null : null,
    pricing_power: L ? textOrNull(L.pricing_power) : null,
    rent_pressure: L ? textOrNull(L.rent_pressure) : null,
    rent_share_pct: rentSharePct,
    labor_pressure: L ? textOrNull(L.labor_pressure) : null,
    payroll_share_pct: payrollSharePct,
    survival_yr1: L && isNum(L.survival?.yr1) ? L.survival.yr1 : null,
    survival_yr3: L && isNum(L.survival?.yr3) ? L.survival.yr3 : null,
    survival_yr5: L && isNum(L.survival?.yr5) ? L.survival.yr5 : null,
    quality_score: cell.quality_score ?? null,
    cellUrl: cell.geo_name
      ? `/${cell.country.toLowerCase()}/${slugify(cell.geo_name)}/${industrySlug}`
      : null,
  };

  // Suppress unused-import warning by referencing getTopCells in a no-op path.
  void getTopCells;

  return NextResponse.json({ cell: compact }, { headers: CACHE_HEADERS });
}
