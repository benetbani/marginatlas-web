/**
 * src/lib/spine/adapt_cell.ts , the CELL-page real-data adapter (Phase B).
 *
 * Promotes the cell spine surface (/dev/spine-cell body) from its illustrative
 * seed to real, reconciled data behind the isSpineReformEnabled() flag. Server
 * only, pure (no "use client"): it must be awaited from the RSC cell route, never
 * called from a client island.
 *
 * HONESTY RAIL (absolute): every figure is driven from the accessor + finance
 * engines via the SAME call chain the live cell page runs (loadCellView below,
 * shared with the live page so there is one source of truth). Nothing is
 * fabricated. Fields with no honest source are left UNDEFINED in the returned
 * object; the spine components null-guard them so an omitted field renders
 * nothing (never "0" / "undefined" / NaN / a broken block). Prose is reused from
 * the sanctioned cell_view.ts synthesis, never invented here.
 *
 * What is OMITTED on promotion (no honest per-figure source; see the field spec
 * docs/superpowers/specs/2026-07-03-cell-field-provenance-map.md):
 *   - the whole Demand chapter (dayparts / channels / catchment)
 *   - the entire subtype control room (FormatPicker / FormatProvider / ComparePro)
 *   - who_suits numeric dot scales
 *   - per-peer take-home / break-in columns in the peers (name and a typical
 *     year's takings only, the United States' per-state slate; never an
 *     invented peer, plan step 33's fourth dispatch)
 *   - setup / cost-to-open when the cell carries no real setup_costs
 *   - off-London: first_year / wages (cell_view already returns null there,
 *     so they pass through as undefined); the myth block is gone everywhere
 *     (the same dispatch, R5), and so are seasonality and risks (plan step
 *     33's fifth dispatch: `12 market` and `10 watch` read the shard, or
 *     stand seated, on every trade)
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import {
  getCellBySlug,
  getSameIndustryAcrossStates,
  getComparableCells,
  cellUrl,
  withBudget,
} from "@/lib/cells";
import type { Cell } from "@/lib/cells";
import { buildCellRelatedLinks, fetchCellSiblings } from "@/lib/cells/related_links";
import { isTrustedLocalCell } from "@/lib/cells/trust";
import { computeBreakeven } from "@/lib/economics/breakeven";
import { getCityTier } from "@/lib/cities/city_tier";
import { iso2ToName } from "@/lib/countries";
import { estimateNetProfit } from "@/lib/finance/net_profit";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { getCountryProfile } from "@/lib/economic_profile";
import { clampMargin } from "@/lib/finance/margin_floor";
import { resolveOwnerTakeHome } from "@/lib/finance/owner_take_home";
import {
  estimateWagePerEmployee,
  estimateEmployeesFromFirms,
} from "@/lib/extrapolations/fill_missing";
import { buildCellBoard, getLondonEntry } from "@/lib/scores/cell_board";
import { buildCellView } from "@/lib/cells/cell_view";
import type { CellView } from "@/lib/cells/cell_view";
import { slugToIndustry, tradeNounFor } from "@/lib/taxonomy";
import { resolveTradeNet } from "@/lib/spine/trade_net";

/* ------------------------------------------------------------------------- */
/* Shared cell-view loader , the ONE call chain the live cell page also runs. */
/* ------------------------------------------------------------------------- */

/**
 * The resolved cell view plus the engine outputs the callers need. Reuses the
 * exact accessor + finance-engine sequence from the live cell route so the spine
 * adapter and the non-spine page can never disagree on a figure.
 */
export type LoadedCellView = {
  cell: Cell;
  cellView: CellView;
  /** The London exemplar entry (GB cells only), or null. */
  londonEconomics: { revenue: number; net_margin_pct: number; owner_take_home: number; firms: number } | null;
  /** Reconciliation values, so the caller can shape the seed + report them. */
  typicalRevenue: number | null;
  netMarginPct: number | null; // 0..100
  ownerTakeHome: number | null;
  firms: number | null;
  breakInScore: number | null;
  breakevenOrdersDaily: number | null;
  typicalOrdersDaily: number | null;
  avgSpendUsd: number | null;
  placeName: string;
  tradeName: string;
  tradeNoun: string;
  isLondon: boolean;
  /** cell_view.ts's own gate, `isLondon || isTrustedLocal`: revenue and take-home are real. The one net builder reads the engine only where this is true (trade_net.ts). */
  moneyShown: boolean;
  /** The same trade in other places, the United States' per-state slate (name and a typical year's takings, real), the home state excluded; empty off the United States. The seed's `nearby` (plan step 33's fourth dispatch, 2026-09-18). */
  peers: Array<{ name: string; href: string; value: number | null }>;
};

/**
 * Load the cell view + the engine outputs for one (country, geo, industry),
 * running the identical chain the live cell page uses (getCellBySlug ->
 * computeBreakeven -> estimateNetProfit -> resolveOwnerTakeHome -> buildCellBoard
 * -> buildCellView), so both surfaces share a single source of truth. Returns
 * null when the cell does not resolve (the caller decides what to do).
 */
export async function loadCellView(
  country: string,
  geo: string,
  industry: string,
): Promise<LoadedCellView | null> {
  const cell = await getCellBySlug(country, geo, industry, { sizeBand: null, year: null });
  if (!cell) return null;

  const isUsCell = country.toLowerCase() === "us";

  // Margin waterfall inputs (mirrors the live page's payroll-per-firm detection).
  const grossRevenueForMargin = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  let payrollForMargin: number | null = null;
  if (cell.payroll_per_employee != null && cell.n_employees != null) {
    const empPerFirm =
      cell.n_enterprises && cell.n_enterprises > 0
        ? cell.n_employees < cell.n_enterprises
          ? cell.n_employees
          : cell.n_employees / cell.n_enterprises
        : cell.n_employees;
    const effectiveEmpPerFirm = Math.max(1, empPerFirm);
    payrollForMargin = cell.payroll_per_employee * effectiveEmpPerFirm;
  }
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
  const rawNetMargin = netProfitResult?.net_margin ?? null;
  const netTakeHome = netProfitResult?.net_profit ?? null;

  const isLargerFirm =
    !!cell.size_band && ["10-19", "20-49", "50-99", "100+"].includes(cell.size_band);
  const econSnap = getCountryEconomicsSnapshot(country.toUpperCase());
  const annualIncome = econSnap.avgMonthlySalary != null ? econSnap.avgMonthlySalary * 12 : null;
  const computedNetMargin =
    rawNetMargin != null ? clampMargin(rawNetMargin, "net", cell.industry_id || null) : null;
  const adjustedNetTakeHome = resolveOwnerTakeHome({
    structuralNetProfit: netTakeHome,
    rawNetMargin,
    revenue: grossRevenueForMargin,
    industryId: cell.industry_id || null,
    isLargerFirm,
    annualIncome,
  });

  const cityTier = getCityTier(geo);
  const be = cell.industry_id
    ? computeBreakeven(cell.industry_id, cell.revenue_per_firm ?? cell.rev_p50 ?? null, cityTier)
    : null;
  const employeesEstimate =
    cell.n_employees ?? estimateEmployeesFromFirms(cell.industry_id, cell.n_enterprises);
  const wageEstimate =
    cell.payroll_per_employee ?? estimateWagePerEmployee(country, cell.industry_id, geo);

  const londonEntry = getLondonEntry(cell);

  const { breakInRating } = buildCellBoard({
    cell,
    ownerTakeHome: adjustedNetTakeHome,
    cityPopulation: null,
    cityCostOfLivingIndex: null,
    econ: econSnap,
    londonEntry,
  });

  const Le = londonEntry?.economics ?? null;
  const expectedIndustryId = slugToIndustry(industry)?.id ?? cell.industry_id ?? undefined;
  const trustedLocalCell = isTrustedLocalCell(cell, expectedIndustryId);
  // The credibility screen's yardstick (buildCellView): the country's own
  // median full-time pay, counted only when this country's profile row is
  // actually held (getCountryProfile answers a generic fallback otherwise).
  const countryProfile = getCountryProfile(country.toUpperCase());
  const medianWageUsd =
    countryProfile.iso2.toUpperCase() === country.toUpperCase() &&
    Number.isFinite(countryProfile.median_wage_full_time_usd) &&
    countryProfile.median_wage_full_time_usd > 0
      ? countryProfile.median_wage_full_time_usd
      : null;
  const placeName = cell.geo_name || iso2ToName(country) || country.toUpperCase();
  const tradeName = cell.industry_name || industry.replace(/-/g, " ");
  const tradeNoun = tradeNounFor(tradeName);

  const viewRevenue = Le?.revenue ?? cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  const viewNetMarginPct = Le
    ? Le.net_margin_pct
    : computedNetMargin != null
      ? computedNetMargin * 100
      : null;
  const viewTakeHome = Le?.owner_take_home ?? adjustedNetTakeHome ?? null;
  const viewFirms = Le?.firms ?? cell.n_enterprises ?? null;

  // Same-trade peers: US-state slate (real per-peer revenue). Off the US there
  // are none, and the London exemplar's own UK peers are synthesized INSIDE the
  // view model (name + revenue only), so no fabricated per-peer money leaks.
  const acrossStates = isUsCell
    ? await withBudget(
        getSameIndustryAcrossStates(industry, cell.geo_id, 10),
        [],
        4_000,
        "getSameIndustryAcrossStates",
      )
    : [];
  const nearbyPeers = (isUsCell ? acrossStates : [])
    .filter((c) => (c.geo_name || "") && (c.geo_name || "") !== (cell.geo_name || ""))
    .map((c) => ({
      name: c.geo_name || "",
      href: cellUrl(c),
      value: c.revenue_per_firm ?? c.rev_p50 ?? null,
    }));

  const cellView = buildCellView({
    cell,
    londonEntry,
    placeName,
    tradeName,
    tradeNoun,
    industrySlug: industry,
    typicalRevenue: viewRevenue,
    netMarginPct: viewNetMarginPct,
    ownerTakeHome: viewTakeHome,
    firms: viewFirms,
    breakInRating: breakInRating?.score ?? null,
    isTrustedLocal: trustedLocalCell,
    costStructure: cell.cost_structure ?? null,
    breakevenOrdersDaily: be?.breakevenOrdersDaily ?? null,
    typicalOrdersDaily: be?.currentOrdersDaily ?? null,
    employees: employeesEstimate ?? null,
    wagePerEmployee: wageEstimate ?? null,
    peers: nearbyPeers,
    narrative: null,
    medianWageUsd,
    /* NEVER AN INVENTED PEER (MODEL.md 8.6 `07 peers`; plan step 33's fourth
       dispatch, 2026-09-18): without this, cell_view.ts hands London four
       synthesised UK cities (the London figure times four constants,
       "Invented for the exemplar"), and the trade page's table would print
       a peer with an invented name and an invented figure. The neighbourhood
       route has passed it since the district page; the trade page passes it
       now, and its seed carries the slate below rather than this view's
       `nearby` at all. */
    suppressInventedPeers: true,
  });

  return {
    cell,
    cellView,
    londonEconomics: Le,
    typicalRevenue: viewRevenue,
    netMarginPct: viewNetMarginPct,
    ownerTakeHome: cellView.ownerKeeps?.takeHome ?? null,
    firms: viewFirms,
    breakInScore: breakInRating?.score ?? null,
    breakevenOrdersDaily: be?.breakevenOrdersDaily ?? null,
    typicalOrdersDaily: be?.currentOrdersDaily ?? null,
    avgSpendUsd: be?.aov ?? null,
    placeName,
    tradeName,
    tradeNoun,
    isLondon: cellView.isLondon,
    moneyShown: cellView.isLondon || trustedLocalCell,
    peers: nearbyPeers,
  };
}

/* ------------------------------------------------------------------------- */
/* Small honest helpers.                                                     */
/* ------------------------------------------------------------------------- */

function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}
/** Round a 0..100 margin to a whole percent, or undefined if not real. */
function pctOrUndef(v: number | null | undefined): number | undefined {
  return isNum(v) ? Math.round(v) : undefined;
}
/** Map cell_view masthead tier + break-in score to the 0..100 the masthead reads. */
function breakInWord(score: number | null): "Manageable" | "Demanding" | "Brutal" | undefined {
  if (!isNum(score)) return undefined;
  return score >= 45 ? "Manageable" : score >= 30 ? "Demanding" : "Brutal";
}

/* ------------------------------------------------------------------------- */
/* The adapter , reshape LoadedCellView into the spine cell seed shape.       */
/* ------------------------------------------------------------------------- */

/**
 * Build the real-data spine cell seed for one (country, geo, industry). Every
 * filled field is driven from the accessor / finance engines via loadCellView;
 * every field without an honest source is left undefined so the spine components
 * render nothing there. Returns undefined when the cell does not resolve (the
 * route falls back to notFound() upstream, matching the non-spine page).
 */
/**
 * Strip internal markers from a reader-facing provenance sentence.
 *
 * These lines are authored in the data, not here, so a marker added upstream
 * reaches a reader with nothing in between. Cuts a trailing pipe-separated
 * segment that is a bare key:value token, which is what internal markers look
 * like, and leaves prose alone: "Estimated from regional patterns | see note"
 * keeps its second half, "Estimated from regional patterns | scrub:x-2026-05-31"
 * loses it.
 */
function sanitiseProvenance(line: string | null | undefined): string | null {
  if (!line) return null;
  const parts = String(line).split("|").map((p) => p.trim()).filter(Boolean);
  const kept = parts.filter((p) => !/^[a-z][\w-]*:[\w.\-/]+$/i.test(p));
  return kept.length ? kept.join(" | ") : null;
}

export async function buildSpineCellSeed(
  country: string,
  geo: string,
  industry: string,
): Promise<any> {
  const loaded = await loadCellView(country, geo, industry);
  if (!loaded) return undefined;

  const {
    cell,
    cellView: v,
    netMarginPct,
    ownerTakeHome,
    firms,
    breakInScore,
    placeName,
    tradeName,
    moneyShown,
    peers,
    breakevenOrdersDaily,
    typicalOrdersDaily,
  } = loaded;
  /* THE TRADE'S TAXONOMY ID, resolved once here the way the character lookup
     resolved it (the URL slug is hyphenated, the shards and the lookups are
     keyed by the underscored id), and carried on the seed so the view's
     builders (the suits, the shard readers) never guess it a second time. */
  const industryId: string | undefined = slugToIndustry(industry)?.id ?? cell.industry_id ?? undefined;

  const countryName = iso2ToName(country) || country.toUpperCase();

  /* -- meta ---------------------------------------------------------------- */
  // Provenance from the cell's real coverage_source (NEVER the seed's
  // "illustrative" line). Kept short and agency-name-free by the accessor.
  const meta = {
    iso2: country.toUpperCase(),
    geo,
    industry,
    city: placeName,
    country_name: countryName,
    trade: tradeName,
    /* THE PROVENANCE LINE IS SANITISED, BECAUSE IT COMES FROM DATA AND NOT FROM
       CODE. Found by rendering a trade page for a city that is not the exemplar:
       Mumbai cafes printed "Estimated from regional patterns |
       scrub:revenue-cap-2026-05-31" to a reader. That token is an internal
       marker, and the gate that catches internal notes scans SOURCE, so a note
       carried in a database field walks straight past it. Anything after a pipe
       that looks like an internal key is cut, and the sentence keeps its meaning. */
    provenance_line: sanitiseProvenance(cell.coverage_source) || "Modeled from national business statistics.",
    /* THE MONEY GATE ON THE SEED (plan step 33's first dispatch, 2026-09-18):
       cell_view.ts's `moneyShown`, so the masthead's facts and the spread's
       builder (trade_hero_facts.ts, trade_spread_rows.ts) can say which state
       the card is in without re-deriving the trust rule. */
    money_shown: moneyShown,
    industry_id: industryId,
  };

  /* -- net: THE ONE BUILDER'S FIGURE (trade_net.ts, R7, DATA-REQUIREMENTS
     item 58; plan step 33's first dispatch, 2026-09-18) ------------------
     The engine's `netMarginPct` where money is shown; else the shard's
     ladder unless it is the 42 / 10 / 5 fill; else the sector profile's
     residual. Every reader of a net on the page reads THIS block: the
     masthead's companion cell now, `05 split` at its own dispatch. The old
     `margins.net_pct` below is the engine's figure alone and stays for the
     readers this dispatch does not touch (OwnerKeeps reads it as a fallback);
     it leaves with them. */
  const net = industryId ? resolveTradeNet(industryId, { moneyShown, netMarginPct }) : null;

  /* -- headline ------------------------------------------------------------ */
  // The spread is the masthead's p10/p50/p90; break-in as a 0..100 for the word.
  const spread = v.masthead.spread;
  const headline = {
    answer: v.masthead.answer ?? v.masthead.title,
    rev_p10_usd: isNum(spread?.p10) ? Math.round(spread!.p10!) : undefined,
    rev_p50_usd: isNum(spread?.p50) ? Math.round(spread!.p50!) : undefined,
    rev_p90_usd: isNum(spread?.p90) ? Math.round(spread!.p90!) : undefined,
    /* WHERE THE BAND'S SHAPE CAME FROM, carried instead of dropped. One of the
       two paths that builds this spread multiplies the typical figure by fixed
       constants, so it draws the same shape for every trade. The ruling on
       invented bands says that must be marked; the mark was being discarded
       here, one layer above the component that needs it. */
    rev_spread_basis: spread && "basis" in spread && spread.basis ? spread.basis : "measured",
    break_in_0_100: isNum(breakInScore) ? Math.round(breakInScore) : undefined,
    n_firms: isNum(firms) ? Math.round(firms) : undefined,
  };

  /* -- margins ------------------------------------------------------------- */
  const margins = { net_pct: pctOrUndef(netMarginPct) };

  /* -- owner (the hero take-home) ------------------------------------------ */
  const owner = isNum(ownerTakeHome)
    ? {
        take_home_usd: Math.round(ownerTakeHome),
        margin_pct: pctOrUndef(netMarginPct),
        surface_line: v.narrative ?? undefined,
      }
    : undefined;

  /* -- verdict (the honest-take prose) ------------------------------------- */
  const verdict = v.honestTake
    ? {
        break_in_line: v.honestTake.verdict,
        // The crowded line reuses the first honest-take point when present; else
        // a plain, number-free consequence line (no fabricated figure).
        crowded_line:
          v.honestTake.points[0] ??
          v.honestTake.body ??
          "A new operator competes for the same customers from day one.",
      }
    : undefined;

  /* -- money_split (the $100 cost stack; kept slice = net margin) ----------
     ROUNDED AS A SET, NOT ONE AT A TIME. Each share used to go through its own
     Math.round, and five independent roundings do not have to add up. Measured on
     the real London pages: the raw shares sum to 100.00 in every case, and after
     rounding, restaurants came to 30 + 34 + 15 + 15 + 5 = NINETY-NINE, while hair
     salons and cafes happened to land on 100. Correct by luck on two of three and
     wrong on the flagship.

     It matters beyond the arithmetic: the card holding this is a waterfall whose
     own code refuses to draw at all when the split does not close to the opening
     figure. A lost point costs the reader the whole section.

     The fix is the standard apportionment method: floor every share, then hand the
     leftover points to the largest fractional parts. It has the property this needs,
     which is that it REPRODUCES the naive result wherever the naive result already
     closed. Verified against all three real pages: hair salons and cafes come out
     byte for byte as before, restaurants gains its missing point on the largest
     remainder. No share moves by more than one. */
  const roundToTotal = (values: number[], total: number): number[] => {
    const floors = values.map((x) => Math.floor(x));
    let left = total - floors.reduce((a, b) => a + b, 0);
    const order = values
      .map((x, i) => ({ i, frac: x - Math.floor(x) }))
      .sort((a, b) => b.frac - a.frac);
    const out = floors.slice();
    for (const { i } of order) {
      if (left <= 0) break;
      out[i] += 1;
      left -= 1;
    }
    return out;
  };
  const moneySplit =
    v.moneyGoes && v.moneyGoes.length > 0
      ? (() => {
          const pcts = roundToTotal(
            v.moneyGoes.map((m) => m.perHundred),
            100,
          );
          return {
            surface_line: v.narrative ?? undefined,
            items: v.moneyGoes.map((m, i) => ({
              name: m.label,
              pct: pcts[i],
              kept: !!m.kept,
            })),
          };
        })()
      : undefined;

  /* -- cost_drivers (the margin levers) ------------------------------------ */
  const costDrivers =
    v.costDrivers && v.costDrivers.length > 0
      ? v.costDrivers.map((c) => ({ name: c.label, note: c.note ?? "" }))
      : undefined;

  /* -- break_even: THE ENGINE'S SHARE (`08 clears`, MODEL.md 8.6; plan step
     33's fourth dispatch, 2026-09-18) -------------------------------------
     `share_pct` is computeBreakeven()'s own ratio, breakevenOrdersDaily over
     currentOrdersDaily, unrounded, carried where money is shown (8.6: the
     engine where `moneyShown`, else the shard, which clears_rows.ts reads
     itself). The two rounded counts stay beside it for the shape the bundled
     dev seed holds; nothing on the page reads them since the ring card
     retired (money-chapter.tsx). clears_rows.ts's header says why this share
     is the trade's figure and not the city's: the takings cancel out of the
     ratio. */
  const engineShare =
    moneyShown && isNum(breakevenOrdersDaily) && isNum(typicalOrdersDaily) && breakevenOrdersDaily > 0 && typicalOrdersDaily > 0
      ? (breakevenOrdersDaily / typicalOrdersDaily) * 100
      : undefined;
  const breakEven =
    engineShare != null || (v.breakEven && isNum(v.breakEven.value))
      ? {
          share_pct: engineShare,
          covers_per_day: v.breakEven && isNum(v.breakEven.value) ? v.breakEven.value : undefined,
          typical_covers_per_day: v.breakEven && isNum(v.breakEven.typical) ? v.breakEven.typical : undefined,
          surface_line: v.breakEven ? v.breakEven.detail ?? v.breakEven.headline : undefined,
        }
      : undefined;

  /* -- wages (London exemplar only; null off London -> undefined) ---------- */
  const wages =
    v.wages && v.wages.length > 0
      ? {
          surface_line: undefined,
          roles: v.wages.map((w) => ({
            role: w.role,
            low_usd: isNum(w.low) ? w.low : isNum(w.median) ? w.median : 0,
            mid_usd: isNum(w.median) ? w.median : isNum(w.low) ? w.low : 0,
            high_usd: isNum(w.high) ? w.high : isNum(w.median) ? w.median : 0,
          })),
        }
      : undefined;

  /* -- seasonality: GONE (`12 market`, MODEL.md 8.6; plan step 33's fifth
     dispatch, 2026-09-18). The block carried the London file's monthly
     multipliers (cell_view's `seasonality.monthly`, London only) for the old
     `#seasonality` columns; the bento's swing cell reads the shard's
     `seasonality.swing_pct` for 243 trades (market_rows.ts). Nothing builds
     the block now. --------------------------------------------------------- */

  /* -- first_year (London only) -------------------------------------------- */
  const firstYear =
    v.firstYear && v.firstYear.milestones && v.firstYear.milestones.length > 0
      ? {
          read: v.firstYear.headline ?? undefined,
          // cell_view milestones carry a text `at` tag (e.g. "Mo 6-9"), not a
          // week number. The spine Timeline needs week positions we do not hold
          // honestly, so map to evenly spaced weeks across the year and flag the
          // break-even node (the ONE emphasis cell_view marks). No fabricated
          // dates: the labels + read are real; the positions are an even spread.
          milestones: v.firstYear.milestones.map((mi, i, arr) => ({
            week: Math.round(((i + 1) / arr.length) * 52),
            label: mi.label,
            kind: mi.emphasis ? "breakeven" : "normal",
          })),
          phases: undefined,
        }
      : undefined;

  /* -- myth: GONE (`09 lasts`, MODEL.md 8.6; plan step 33's fourth dispatch,
     2026-09-18). The block carried the London file's survival triple
     (getLondonEntry().survival, 20 activities) with a folklore claim for the
     old `#myth` card, a slope with the claim struck across it; both the
     slope and the sentence are banned (R5), the card retired, and `09` reads
     the shard's triple for 243 trades (lasts_rows.ts), never the London
     file. Nothing builds the block now. --------------------------------- */

  /* -- risks: GONE (`10 watch`, MODEL.md 8.6; the same dispatch). The block
     mapped cell_view's four London risks (titles authored for every
     storefront trade, a severity word each) to invented 1..10 scores (8 / 6
     / 3) for the old `#risks` dot plot; none is a held cause of closure with
     a share for one trade, so `10 watch` stands as the drawn blocked seat
     until DATA-REQUIREMENTS item 53 lands, and nothing builds the block. -- */

  /* -- nearby: THE SLATE, NEVER AN INVENTED PEER (`07 peers`, MODEL.md 8.6;
     plan step 33's fourth dispatch, 2026-09-18) ---------------------------
     The United States' per-state slate from loadCellView (one row per state,
     the home state excluded, name and `revenue_per_firm` real), carried
     whenever it resolved and not through cell_view.ts's `nearby`, which is
     gated on the home cell's own money and, without `suppressInventedPeers`,
     held London's four synthesised cities. The peers' figures are other
     cells' measured takings, so the home cell's trust gate is not theirs;
     the home row is trade_peer_rows.ts's own, off `meta` and `headline`,
     and its figure is gated there on `money_shown`. Off the United States
     the slate is empty and the block is absent, which the builder reads as
     "no peer resolved" and seats the table with its stated line (M19). */
  const nearby =
    peers.length > 0
      ? {
          surface_line: undefined,
          places: peers.filter((p) => p.name).map((p) => ({
            name: p.name,
            home: false,
            rev_p50_usd: isNum(p.value) && p.value > 0 ? Math.round(p.value) : undefined,
          })),
        }
      : undefined;

  /* -- setup (only when the cell holds real setup_costs; else undefined) ---- */
  // setupItemsFromCell returns undefined when no real line item is present, so
  // this is the honest omit: cost-to-open + payback derive from these items, and
  // a cell with no setup_costs contributes nothing rather than a fabricated $0.
  const setup = setupItemsFromCell(cell);

  /* -- rivals: THE SIBLING TRADES IN THIS PLACE (`13 rivals`, MODEL.md 8.6;
     plan step 33's sixth dispatch, 2026-09-18) ---------------------------
     `otherTradesHere` from related_links.ts, the one resolver the legacy
     page's related tail already runs: every row a trade that HOLDS a cell at
     this place, round-tripped through the destination route's own resolver
     before it is emitted (the module's header says why nothing here is
     assembled from a slug and hoped over), capped at six (PER_CATEGORY_CAP),
     the solo-professional and corporate-only trades kept out as they are
     everywhere else. Two reads, both budget-wrapped and fail-soft, so a slow
     table costs the list and never the page: the regional siblings off the
     United States, the state's comparable cells on it (the legacy page's own
     two reads, 200 rows because a state's rows repeat per year, size band
     and grain, measured there). The list carries the trade's slug, its name
     and its verified href and NOTHING ELSE; the cost to open per sibling is
     rivals_rows.ts's to look up (the archetype by key, R3), never a figure
     carried here. The old `related` block (a keep-percent column with no
     honest per-sibling source) stays retired; this is its honest half. Off
     the database (the copy gates, a render with the table down) the list is
     empty and the card stands in its withheld state with the count. */
  const isUsCell = country.toLowerCase() === "us";
  const [cellSiblings, usOtherTradeRows] = await Promise.all([
    isUsCell ? Promise.resolve({ sameTradeElsewhere: [], otherTradesHere: [] }) : fetchCellSiblings(country, geo, industry),
    isUsCell
      ? withBudget(getComparableCells(cell.geo_name || "", cell.naics_6 || undefined, 200), [] as Cell[], 4_000, "getComparableCells")
      : Promise.resolve([] as Cell[]),
  ]);
  const rivalLinks = buildCellRelatedLinks({
    cell,
    countrySlug: country,
    geoSlug: geo,
    industrySlug: industry,
    tradeName,
    placeName,
    siblings: cellSiblings,
    usSameTradeRows: [],
    usOtherTradeRows,
  }).otherTradesHere;
  const rivals = {
    list: rivalLinks
      .filter((l) => typeof l.tradeSlug === "string" && typeof l.tradeName === "string")
      .map((l) => ({ name: l.tradeName as string, slug: l.tradeSlug as string, href: l.href })),
  };

  /* -- OMITTED entirely (no honest source): demand, subtypes, who_suits,
        related keep-% column. Leaving them undefined makes the spine components
        render nothing (guarded). ------------------------------------------- */

  /* -- who this suits: READ BY THE VIEW, NOT CARRIED HERE (plan step 33's
     first dispatch, 2026-09-18). The authored trade character (the lookup in
     src/lib/content/activity_character.ts, 243 activities keyed by the
     underscored taxonomy id, connected across altitudes on 2026-08-24) fed a
     `trade_character` block for the imported WhoItSuits card; `02 suits`
     (suits_rows.ts) reads the same lookup by `meta.industry_id` and the
     checks bank by `meta.iso2`, pure over the files, so the block left the
     seed with the card. ------------------------------------------------- */

  return {
    meta,
    headline,
    margins,
    net: net ?? undefined,
    verdict,
    money_split: moneySplit,
    cost_drivers: costDrivers,
    owner,
    break_even: breakEven,
    wages,
    // seasonality: undefined  (retired with `#seasonality`; `12 market` reads the shard)
    first_year: firstYear,
    // myth: undefined  (retired with `#myth`; `09 lasts` reads the shard)
    // risks: undefined  (retired with `#risks`; `10 watch` is the drawn blocked seat)
    nearby,
    setup,
    rivals,
    // demand: undefined  (Demand chapter omitted)
    // subtypes: undefined  (FormatPicker control room omitted)
    // who_suits: undefined  (numeric scales omitted; rightWrong bullets could
    //   be surfaced later, but the seed's WhoSuits reads scales, so omit here)
    // related: undefined  (keep-% column has no honest per-sibling source)
  };
}

/** Build the setup line items from a cell's real setup_costs block. Only called
 * when hasSetupCostData(cell) is true, so at least one line is real. */
function setupItemsFromCell(cell: Cell): { surface_line?: string; items: Array<{ name: string; usd: number }> } | undefined {
  const setup = cell.setup_costs;
  if (!setup) return undefined;
  const items: Array<{ name: string; usd: number }> = [];
  const reg = setup.registration;
  const cap = setup.capital;
  const push = (name: string, usd: number | undefined) => {
    if (isNum(usd) && usd > 0) items.push({ name, usd: Math.round(usd) });
  };
  if (cap) {
    push("Fit-out", cap.property_fitout);
    push("Equipment", cap.equipment_initial);
    push("Initial inventory", cap.initial_inventory);
    push("Lease deposit", cap.lease_deposit);
    push("Pre-opening marketing", cap.pre_opening_marketing);
  }
  if (reg) {
    push("Business registration", reg.business_registration_fee);
    push("Industry licences", reg.industry_licenses_fee);
    push("Professional licences", reg.professional_license_fee);
    push("Insurance and bonds", reg.insurance_bond_initial);
    push("Certifications", reg.certifications_initial);
  }
  if (items.length === 0) return undefined;
  return { items };
}
