/**
 * src/lib/open/opening_page.ts
 *
 * Server-side data builder for the dedicated "what it costs to open a [business]
 * in [place]" page. ONE responsibility: assemble the full opening picture for a
 * single (country, geo, industry) URL triple, reusing the EXACT functions the
 * cell page already uses so the two surfaces can never disagree on a shared
 * number (capital, permits, time, hires, owner take-home, the break-in rating).
 *
 * The contract with the cell page (the source of truth, src/app/[country]/[geo]/
 * [industry]/page.tsx and src/lib/scores/cell_board.ts):
 *
 *   - The cell is resolved with the SAME getCellBySlug call (default size/year),
 *     budget-wrapped.
 *   - The four entry parts are the SAME values the board's "What it takes to
 *     open" section computes: capital is the real trusted startup cost where one
 *     is held AND the cell passes the four-way trust gate, else the modeled,
 *     place-adjusted archetype (placeAdjustedStartupCapital); permits are the
 *     modeled, place-adjusted archetype (placeAdjustedPermitsUsd); time is the
 *     place-invariant modeled weeks (timeToOpenWeeks); first hires is the
 *     place-invariant modeled count plus the warm role hint (firstHiresCount /
 *     firstHiresRoleHint). The place signals (city cost-of-living index, else the
 *     country wage proxy) are resolved exactly as the page resolves them.
 *   - Owner take-home is the SAME figure the page passes to the board, resolved
 *     by the shared source of truth (src/lib/finance/owner_take_home.ts): the
 *     larger of estimateNetProfit(...) -> net_profit and the dollars implied by
 *     the shown 3%-floored net margin, then the larger-firm take-home floor (2x
 *     country average income for 10+ employee bands), London-curated economics
 *     preferred where present (the board prefers them, so we mirror that for the
 *     rating anchor).
 *   - The break-in rating is taken STRAIGHT OFF buildCellBoard (the same
 *     CellBoardResult the masthead reads), so the headline score, band, payback,
 *     and headline are byte-for-byte the cell page's.
 *
 * Comparisons reuse buildAcrossCities (the same trust-gated world-city slate the
 * across page and the extremes hub use); peer scores call computeBreakInRating
 * per column with that column's own inputs, exactly as the break-in leaderboard
 * does (src/lib/extremes/leaderboards.ts breakInRowFromColumn). "Other businesses
 * here" is best-effort: a clean multi-industry-per-geo read only exists for US
 * state geos (getComparableCells), so it resolves there and self-omits (empty
 * array) everywhere else rather than running a fragile or expensive scan.
 *
 * Build-safe by construction: every Supabase read is wrapped in withBudget(), so
 * a slow or failed query degrades that one part (it self-omits) rather than
 * hanging the page. Any sub-part that fails returns its empty/null shape. The
 * function returns null ONLY when the core cell does not resolve or is not a
 * trusted local measurement of the requested activity, so the page can notFound()
 * cleanly without ever rendering a number it cannot stand behind.
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only money.
 */
import {
  getCellBySlug,
  getComparableCells,
  cellUrl,
  withBudget,
  type Cell,
} from "@/lib/cells";
import { isTrustedLocalCell } from "@/lib/cells/trust";
import { slugToIndustry } from "@/lib/taxonomy";
import { iso2ToName } from "@/lib/countries";
import { estimateNetProfit } from "@/lib/finance/net_profit";
import { resolveOwnerTakeHome } from "@/lib/finance/owner_take_home";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import {
  getCityTier,
  getCityCostOfLivingIndex,
  getCityPopulation,
} from "@/lib/cities/city_tier";
import { computeBreakeven } from "@/lib/economics/breakeven";
import {
  estimateWagePerEmployee,
  estimateEmployeesFromFirms,
} from "@/lib/extrapolations/fill_missing";
import industryMarginsJson from "@/lib/finance/industry_margins.json";
import {
  buildCellBoard,
  getLondonEntry,
} from "@/lib/scores/cell_board";
import {
  computeBreakInRating,
  type BreakInRating,
  type BreakInBand,
} from "@/lib/scores/break_in_rating";
import {
  placeAdjustedStartupCapital,
} from "@/lib/markets/startup_capital_archetypes";
import {
  placeAdjustedPermitsUsd,
  timeToOpenWeeks,
  firstHiresCount,
  firstHiresRoleHint,
} from "@/lib/markets/opening_archetypes";
import { densityArchetypePer10k } from "@/lib/markets/density_archetypes";
import {
  buildAcrossCities,
  type CityColumn,
} from "@/lib/markets/across_cities";

/* ----------------------------------------------------------------------------
 * Industry-margin lookup (the exact shape + helper the cell page uses, so the
 * gross/operating/net inputs handed to buildCellBoard match it).
 * ------------------------------------------------------------------------- */
type IndustryMarginRow = {
  gross_margin: number;
  operating_margin: number;
  asset_intensity?: number;
};
const INDUSTRY_MARGINS = industryMarginsJson as unknown as {
  default_fallback: IndustryMarginRow;
  industries: Record<string, IndustryMarginRow>;
};
function lookupIndustryMargin(industryId: string | null | undefined): IndustryMarginRow {
  if (!industryId) return INDUSTRY_MARGINS.default_fallback;
  return INDUSTRY_MARGINS.industries[industryId] || INDUSTRY_MARGINS.default_fallback;
}

/** A finite, real number (not null, not NaN, not Infinity). */
function isNum(n: number | null | undefined): n is number {
  return n != null && Number.isFinite(n);
}
/** A finite, positive real. */
function isPos(n: number | null | undefined): n is number {
  return typeof n === "number" && Number.isFinite(n) && n > 0;
}

/* ----------------------------------------------------------------------------
 * Public types
 * ------------------------------------------------------------------------- */

/** One of the four entry parts a would-be owner asks about. */
export interface OpeningPart {
  /** The resolved figure (USD for capital/permits, weeks for time, count for hires). */
  value: number;
  /** True when this figure is a modeled archetype rather than a real measurement. */
  modeled: boolean;
}

/** One peer place for the SAME business, for the "same business elsewhere" strip. */
export interface PeerPlace {
  /** Display place name (the resolved cell's geo_name). */
  place: string;
  /** ISO2 country slug (lowercased), for a small flag. */
  country: string;
  /** Link to that place's full cell page for this activity. */
  href: string;
  /** Total one-time cost to open there (capital + permits), USD. */
  totalToOpenUsd: number;
  /** That place's break-in score, 0..100 (higher = easier), or null. */
  score: number | null;
  /** That place's break-in band, or null when unscored. */
  band: BreakInBand | null;
}

/** One other common business in the SAME place, for the "other businesses here" strip. */
export interface OtherBusinessHere {
  /** Display business name. */
  business: string;
  /** Link to that business's full cell page in this place. */
  href: string;
  /** That business's break-in score, 0..100, or null. */
  score: number | null;
  /** That business's break-in band, or null when unscored. */
  band: BreakInBand | null;
}

/** The full opening picture for one (country, geo, industry). */
export interface OpeningPage {
  /** Business (activity) display name, e.g. "Restaurants". */
  businessName: string;
  /**
   * Canonical industry id of the resolved cell (e.g. "restaurants"). The render
   * layer keys the optional dealbreaker line on this; it is the same id every
   * shared lookup on the page already uses.
   */
  industryId: string;
  /** Place display name, e.g. "London". */
  placeName: string;
  /** ISO2 country slug (lowercased). */
  country: string;
  /** Link back to the full cell page for this business-and-place. */
  cellHref: string;
  /** True when the cell is a trusted local measurement (always true here; null otherwise). */
  trusted: true;

  /** The four entry parts, computed exactly as the cell board computes them. */
  capital: OpeningPart;
  permits: OpeningPart;
  time: OpeningPart;
  hires: OpeningPart & { roleHint: string };

  /** Total one-time cost to open: capital + permits, USD. */
  totalToOpenUsd: number;

  /** Real annual owner take-home after tax, USD (page method), or null. */
  takeHomeUsd: number | null;

  /** The single headline break-in rating (straight off buildCellBoard), or null. */
  breakIn: BreakInRating | null;

  comparisons: {
    /** 3-4 peer places for the same business (a cheaper and a dearer contrast). */
    sameBusinessElsewhere: PeerPlace[];
    /** 3-4 other common businesses in this place (best effort; empty when no clean read). */
    otherBusinessesHere: OtherBusinessHere[];
  };

  /** A short, warm one-line verdict (the break-in headline, else a band line). */
  verdict: string;
}

export interface BuildOpeningPageArgs {
  /** Country URL slug (iso2), e.g. "gb". */
  country: string;
  /** Geo URL slug, e.g. "london". */
  geo: string;
  /** Industry URL slug, e.g. "restaurants". */
  industry: string;
}

/* ----------------------------------------------------------------------------
 * Owner take-home: the EXACT page.tsx derivation.
 *
 * page.tsx computes the take-home the board (and the break-in rating) use in
 * three steps, mirrored verbatim here:
 *   1. payrollForMargin: per-firm payroll, with the same unit-detection guard
 *      (n_employees may be total-across-firms or already per-firm).
 *   2. netProfitResult = estimateNetProfit({..., payroll: payrollForMargin}).
 *   3. adjustedNetTakeHome: resolveOwnerTakeHome(...), the single source of truth
 *      shared with the cell page (larger of structural net_profit and the shown
 *      3%-floored-margin dollars, then the larger-firm 2x-income floor).
 *
 * The board itself then prefers the curated London owner_take_home over this for
 * a London cell (cell_board.ts ratingTakeHome). We do NOT need to apply that
 * London preference to the value we PASS to the board (the board does it), but we
 * DO mirror it when reporting takeHomeUsd so the page's headline take-home equals
 * the board's "Owner take-home" row on every cell, London included.
 * ------------------------------------------------------------------------- */
function pageTakeHome(cell: Cell, country: string, geo: string): {
  /** The value page.tsx passes to buildCellBoard as ownerTakeHome (pre-London). */
  ownerTakeHomeForBoard: number | null;
  /** The figure the board's "Owner take-home" row + the rating actually use. */
  resolvedTakeHome: number | null;
  /** Effective corporate tax rate from the waterfall (passed to the board). */
  corporateTaxRate: number | null;
  /** Net margin fraction from the waterfall, pre-board-clamp. */
  netMarginPct: number | null;
} {
  const marginRow = lookupIndustryMargin(cell.industry_id);
  const grossRevenueForMargin = cell.revenue_per_firm ?? cell.rev_p50 ?? null;

  // Step 1: per-firm payroll with the page's unit-detection guard.
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

  // Step 2: the tax-aware net-profit waterfall, same inputs as the page.
  const netProfitResult =
    grossRevenueForMargin && grossRevenueForMargin > 0
      ? estimateNetProfit({
          iso2: country.toUpperCase(),
          geoId: cell.geo_id || geo,
          industryId: cell.industry_id || null,
          sectorId: cell.sector_id || null,
          grossRevenue: grossRevenueForMargin,
          payroll: payrollForMargin,
        })
      : null;
  const netTakeHome = netProfitResult?.net_profit ?? null;
  const rawNetMargin = netProfitResult?.net_margin ?? null;

  // Step 3: the single owner take-home, resolved by the shared source of truth
  // (src/lib/finance/owner_take_home.ts): the larger of the structural after-tax
  // profit and the dollars implied by the SHOWN (3%-floored) net margin, then
  // the larger-firm 2x-income floor for 10+ employee bands. Identical to the
  // cell page, so the two surfaces can never disagree on this number.
  const isLargerFirm =
    !!cell.size_band &&
    ["10-19", "20-49", "50-99", "100+"].includes(cell.size_band);
  const econSnap = getCountryEconomicsSnapshot(country.toUpperCase());
  const annualIncome =
    econSnap.avgMonthlySalary != null ? econSnap.avgMonthlySalary * 12 : null;
  const adjustedNetTakeHome = resolveOwnerTakeHome({
    structuralNetProfit: netTakeHome,
    rawNetMargin,
    revenue: grossRevenueForMargin,
    industryId: cell.industry_id || null,
    isLargerFirm,
    annualIncome,
  });

  // The board prefers the curated London owner_take_home for the "Owner
  // take-home" row and the rating anchor. Mirror that ONLY for the reported
  // resolved take-home (what the user sees as the headline), not for the value
  // we hand the board (the board applies the London preference itself).
  const londonEcon = getLondonEntry(cell)?.economics ?? null;
  const resolvedTakeHome =
    londonEcon && isNum(londonEcon.owner_take_home)
      ? londonEcon.owner_take_home
      : adjustedNetTakeHome;

  return {
    ownerTakeHomeForBoard: adjustedNetTakeHome,
    resolvedTakeHome,
    corporateTaxRate: netProfitResult?.effective_cit_rate ?? null,
    netMarginPct: rawNetMargin,
  };
}

/* ----------------------------------------------------------------------------
 * comparisons.sameBusinessElsewhere
 *
 * Reuse buildAcrossCities (the trust-gated world-city slate) for THIS activity,
 * drop the current place, score each peer column with computeBreakInRating using
 * that column's own inputs (the exact breakInRowFromColumn recipe the break-in
 * leaderboard uses), then choose a small set that contrasts a cheaper-to-open and
 * a dearer-to-open place. Self-omits (empty array) when it cannot resolve.
 * ------------------------------------------------------------------------- */
function peerFromColumn(
  industryId: string,
  col: CityColumn,
  currentHref: string,
): PeerPlace | null {
  // Drop the current place (same cell href) so the page never compares to itself.
  if (col.href === currentHref) return null;
  const total =
    (isPos(col.startupCostUsd) ? col.startupCostUsd : 0); // permits not exposed on the column; capital is the entry figure here
  if (!isPos(total)) return null;
  // Score the peer exactly as the break-in leaderboard does: the column's modeled
  // place-adjusted capital, the column's trusted-real take-home as the anchor,
  // the modeled place-invariant weeks for the trade, the real local density where
  // the column holds one else the modeled archetype. Permits ride at the module's
  // zero default (the column does not expose a permits figure), matching the hub.
  const rating = computeBreakInRating({
    startupCapitalUsd: col.startupCostUsd,
    permitsUsd: null,
    annualOwnerTakeHomeUsd: col.takeHome,
    timeToOpenWeeks: timeToOpenWeeks(industryId),
    densityPer10k: col.densityPer10k ?? densityArchetypePer10k(industryId),
    restsOnModeled: true,
  });
  return {
    place: col.name,
    country: col.country,
    href: col.href,
    totalToOpenUsd: Math.round(total),
    score: rating?.score ?? null,
    band: rating?.band ?? null,
  };
}

async function resolveSameBusinessElsewhere(
  industryId: string,
  currentHref: string,
): Promise<PeerPlace[]> {
  const across = await withBudget(
    buildAcrossCities(industryId),
    null,
    8_000,
    `opening:across:${industryId}`,
  );
  if (!across) return [];
  const peers = across.cities
    .map((c) => peerFromColumn(industryId, c, currentHref))
    .filter((p): p is PeerPlace => p !== null);
  if (peers.length === 0) return [];

  // Contrast a cheaper-to-open and a dearer-to-open place. Sort by total cost
  // ascending, then take the two cheapest and the two dearest, de-duplicated and
  // capped at four, preserving a cheapest -> dearest reading order.
  const byCost = [...peers].sort((a, b) => a.totalToOpenUsd - b.totalToOpenUsd);
  if (byCost.length <= 4) return byCost;
  const picked = [byCost[0], byCost[1], byCost[byCost.length - 2], byCost[byCost.length - 1]];
  const seen = new Set<string>();
  const out: PeerPlace[] = [];
  for (const p of picked) {
    if (seen.has(p.href)) continue;
    seen.add(p.href);
    out.push(p);
  }
  return out;
}

/* ----------------------------------------------------------------------------
 * comparisons.otherBusinessesHere (BEST EFFORT)
 *
 * The only clean multi-industry-per-geo read in the codebase is
 * getComparableCells(stateName, excludeNaics6) - other industries in the SAME US
 * state, by firm count. It is US-state only (it resolves the state by geo_name).
 * For a US-state cell we resolve a few peers, score each with the SAME board math
 * (so the score equals what that peer's own cell masthead shows), and return
 * them. For every non-US / non-state cell there is no clean read, so we return an
 * empty array and the page omits that strip. We do NOT build a whole-DB scan.
 * ------------------------------------------------------------------------- */
function scoreCellLikeBoard(peer: Cell): { score: number | null; band: BreakInBand | null } {
  // Mirror the cell page's own resolution for this peer so the score equals the
  // peer's masthead score: build that peer's board and read its rating.
  const marginRow = lookupIndustryMargin(peer.industry_id);
  const country = peer.country;
  const geo = peer.geo_id || "";
  const typicalRevenue = peer.revenue_per_firm ?? peer.rev_p50 ?? null;

  const th = pageTakeHome(peer, country, geo);
  const econSnap = getCountryEconomicsSnapshot(country.toUpperCase());
  const peerGeoSlug = peer.geo_name ? slugForGeo(peer) : null;
  const cityCostOfLivingIndex = getCityCostOfLivingIndex(peerGeoSlug);
  const cityPopulation = getCityPopulation(peerGeoSlug);

  const be = peer.industry_id
    ? computeBreakeven(peer.industry_id, typicalRevenue, getCityTier(peerGeoSlug))
    : null;
  const employeesEstimate =
    peer.n_employees ?? estimateEmployeesFromFirms(peer.industry_id, peer.n_enterprises);
  const wageEstimate =
    peer.payroll_per_employee ?? estimateWagePerEmployee(country, peer.industry_id, geo);

  const { breakInRating } = buildCellBoard({
    cell: peer,
    typicalRevenue,
    revP10: peer.rev_p10 ?? null,
    revP90: peer.rev_p90 ?? null,
    grossMarginPct: marginRow.gross_margin ?? null,
    operatingMarginPct: marginRow.operating_margin ?? null,
    netMarginPct: th.netMarginPct,
    ownerTakeHome: th.ownerTakeHomeForBoard,
    breakevenOrdersDaily: be?.breakevenOrdersDaily ?? null,
    typicalOrdersDaily: be?.currentOrdersDaily ?? null,
    peopleWorking: employeesEstimate ?? null,
    wagePerEmployee: wageEstimate ?? null,
    cityPopulation,
    cityCostOfLivingIndex,
    econ: econSnap,
    corporateTaxRate: th.corporateTaxRate,
    costStructure: peer.cost_structure ?? null,
    londonEntry: getLondonEntry(peer),
  });
  return { score: breakInRating?.score ?? null, band: breakInRating?.band ?? null };
}

/** Best-effort geo slug for a peer cell (US state cells carry geo_name = state). */
function slugForGeo(cell: Cell): string {
  // For US state peers, getComparableCells returns cells whose geo_name is the
  // state name; the cost-of-living / population lookups key on a CITY slug, so a
  // state slug simply returns null (the place-adjust falls back to the country
  // proxy, exactly as the cell page does for a state slug). cellUrl already
  // slugifies geo_name, so reuse its geo segment.
  const url = cellUrl(cell);
  const parts = url.split("/").filter(Boolean);
  return parts[1] ?? "";
}

async function resolveOtherBusinessesHere(cell: Cell): Promise<OtherBusinessHere[]> {
  // Clean read only for US state cells (getComparableCells resolves the state by
  // geo_name). Non-US and non-state cells: no clean multi-industry read, omit.
  if (cell.country.toUpperCase() !== "US") return [];
  if (!cell.geo_name) return [];
  const peers = await withBudget(
    getComparableCells(cell.geo_name, cell.naics_6 || undefined, 6),
    [],
    5_000,
    `opening:comparable:${cell.geo_name}`,
  );
  if (peers.length === 0) return [];

  const out: OtherBusinessHere[] = [];
  const seenNames = new Set<string>();
  const seenHrefs = new Set<string>();
  for (const peer of peers) {
    if (out.length >= 4) break;
    const name = peer.industry_name || peer.industry_description || peer.naics_6;
    if (!name) continue;
    const href = cellUrl(peer);
    // De-duplicate: getComparableCells can return several cells_master rows that
    // resolve to the same broad sector name or the same cell href; show each
    // business once so the strip never reads as a repeated row.
    const nameKey = name.toLowerCase();
    if (seenNames.has(nameKey) || seenHrefs.has(href)) continue;
    seenNames.add(nameKey);
    seenHrefs.add(href);
    const { score, band } = scoreCellLikeBoard(peer);
    out.push({ business: name, href, score, band });
  }
  return out;
}

/* ----------------------------------------------------------------------------
 * verdict
 * ------------------------------------------------------------------------- */
const BAND_VERDICT: Record<BreakInBand, string> = {
  forgiving:
    "One of the friendlier rooms to enter: low to get into and quick to earn back, if you can stand out.",
  manageable:
    "A fair price of entry and a payback you can plan around, doable on a real budget with eyes open.",
  demanding:
    "Earning it back takes a while and the build is real, so come in funded and patient.",
  brutal:
    "Heavy to open and a long road back to profit, a hard room to break into without deep pockets.",
};

function buildVerdict(breakIn: BreakInRating | null): string {
  if (breakIn?.headline) return breakIn.headline;
  if (breakIn?.band) return BAND_VERDICT[breakIn.band];
  // No defensible rating (no take-home or no capital): a quiet, honest line that
  // names the entry cost as the read without overselling.
  return "The numbers below are what it takes to open here, the cost, the calendar, and the first crew.";
}

/* ----------------------------------------------------------------------------
 * The builder
 * ------------------------------------------------------------------------- */

/**
 * Assemble the opening picture for one (country, geo, industry), or null when the
 * core cell does not resolve or is not a trusted local measurement of the
 * requested activity. Mirrors the cell page's resolution exactly so every shared
 * number agrees; every secondary read is budget-wrapped and self-omits on a miss.
 */
export async function buildOpeningPage(
  args: BuildOpeningPageArgs,
): Promise<OpeningPage | null> {
  const { country, geo, industry } = args;

  // 1. Resolve the cell exactly as the cell page does (default size/year).
  const cell = await withBudget(
    getCellBySlug(country, geo, industry, { sizeBand: null, year: null }),
    null,
    25_000,
    `opening:cell:${country}/${geo}/${industry}`,
  );
  if (!cell) return null;

  // 2. Trust gate. The requested activity id is the friendly slug's industry, so
  // a misrouted slug, a synthesized stand-in, an extrapolated-tier cell, or a
  // country aggregate under a city slug all fail and the page notFound()s rather
  // than rendering numbers it cannot stand behind. (Same gate the across page,
  // the extremes hub, and the cell board's capital/density branches apply.)
  const requestedIndustry = slugToIndustry(industry);
  const expectedIndustryId = requestedIndustry?.id ?? cell.industry_id ?? undefined;
  if (!isTrustedLocalCell(cell, expectedIndustryId)) return null;
  // After the gate the cell carries a real industry_id; guard for the type system.
  if (!cell.industry_id) return null;
  const industryId = cell.industry_id;

  // 3. Place signals, resolved exactly as the page resolves them.
  const econSnap = getCountryEconomicsSnapshot(country.toUpperCase());
  const cityCostOfLivingIndex = getCityCostOfLivingIndex(geo);
  const cityPopulation = getCityPopulation(geo);
  const countryWageProxy =
    econSnap && isNum(econSnap.avgMonthlySalary)
      ? econSnap.avgMonthlySalary * 12
      : null;

  // 4. Owner take-home (the page's exact derivation, incl. floor + London).
  const th = pageTakeHome(cell, country, geo);

  // 5. The four entry parts, computed the SAME way the board computes them.
  //    Capital: real trusted startup cost where held AND trusted-local, else the
  //    modeled, place-adjusted archetype. No real per-cell startup source exists
  //    yet (page passes no realStartupCostUsd), so in practice this is modeled,
  //    but we keep the real-first gate so the day a trusted figure lands the two
  //    surfaces still agree.
  const realStartupCostUsd: number | null = null; // mirrors page.tsx (no real source)
  const hasRealStartupCost =
    isPos(realStartupCostUsd) && isTrustedLocalCell(cell);
  const modeledCapital = placeAdjustedStartupCapital({
    industryId,
    costOfLivingIndex: cityCostOfLivingIndex,
    avgYearlySalary: countryWageProxy,
  });
  const capitalUsd = hasRealStartupCost
    ? (realStartupCostUsd as number)
    : modeledCapital;
  const capitalModeled = !hasRealStartupCost;

  const permitsUsd = placeAdjustedPermitsUsd({
    industryId,
    costOfLivingIndex: cityCostOfLivingIndex,
    avgYearlySalary: countryWageProxy,
  });
  const timeWeeks = timeToOpenWeeks(industryId);
  const hiresN = firstHiresCount(industryId);
  const hiresHint = firstHiresRoleHint(industryId);

  const totalToOpenUsd = Math.round(capitalUsd + permitsUsd);

  // 6. The break-in rating: straight off buildCellBoard, so the headline score,
  //    band, payback, and headline are byte-for-byte the cell page's. We hand the
  //    board the SAME inputs page.tsx hands it (margins, the pre-London
  //    take-home, the breakeven + people figures, the place signals, the cost
  //    structure, the London entry), and read breakInRating from the result.
  const marginRow = lookupIndustryMargin(industryId);
  const typicalRevenue = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  const be = computeBreakeven(industryId, typicalRevenue, getCityTier(geo));
  const employeesEstimate =
    cell.n_employees ?? estimateEmployeesFromFirms(industryId, cell.n_enterprises);
  const wageEstimate =
    cell.payroll_per_employee ?? estimateWagePerEmployee(country, industryId, geo);

  const { breakInRating } = buildCellBoard({
    cell,
    typicalRevenue,
    revP10: cell.rev_p10 ?? null,
    revP90: cell.rev_p90 ?? null,
    grossMarginPct: marginRow.gross_margin ?? null,
    operatingMarginPct: marginRow.operating_margin ?? null,
    netMarginPct: th.netMarginPct,
    ownerTakeHome: th.ownerTakeHomeForBoard,
    breakevenOrdersDaily: be?.breakevenOrdersDaily ?? null,
    typicalOrdersDaily: be?.currentOrdersDaily ?? null,
    peopleWorking: employeesEstimate ?? null,
    wagePerEmployee: wageEstimate ?? null,
    cityPopulation,
    cityCostOfLivingIndex,
    econ: econSnap,
    corporateTaxRate: th.corporateTaxRate,
    costStructure: cell.cost_structure ?? null,
    realStartupCostUsd,
    londonEntry: getLondonEntry(cell),
  });

  // 7. Comparisons (each budget-wrapped, each self-omits on a miss).
  const cellHref = cellUrl(cell);
  const [sameBusinessElsewhere, otherBusinessesHere] = await Promise.all([
    resolveSameBusinessElsewhere(industryId, cellHref),
    resolveOtherBusinessesHere(cell),
  ]);

  const placeName =
    cell.geo_name || iso2ToName(country) || country.toUpperCase();
  const businessName =
    cell.industry_name || requestedIndustry?.name || industry.replace(/-/g, " ");

  return {
    businessName,
    industryId,
    placeName,
    country: country.toLowerCase(),
    cellHref,
    trusted: true,
    capital: { value: Math.round(capitalUsd), modeled: capitalModeled },
    permits: { value: Math.round(permitsUsd), modeled: true },
    time: { value: timeWeeks, modeled: true },
    hires: { value: hiresN, modeled: true, roleHint: hiresHint },
    totalToOpenUsd,
    takeHomeUsd: isNum(th.resolvedTakeHome) ? Math.round(th.resolvedTakeHome) : null,
    breakIn: breakInRating,
    comparisons: { sameBusinessElsewhere, otherBusinessesHere },
    verdict: buildVerdict(breakInRating),
  };
}
