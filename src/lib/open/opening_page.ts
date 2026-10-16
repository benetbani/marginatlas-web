/**
 * src/lib/open/opening_page.ts
 *
 * Server-side data builder for the dedicated "what it takes to open a [business]
 * in [place]" page. ONE responsibility: assemble the opening picture for a
 * single (country, geo, industry) URL triple from what the site HOLDS, through
 * the builders the trade page already prints with, so the two surfaces can
 * never disagree on a shared figure.
 *
 * NO TYPED START FIGURE (2026-10-15, release 2 job A; the controller's ruling,
 * option (c) of /srv/atlas/reports/start-capitals-investigation.md). Until this
 * date the page printed a total to open, capital, permits in dollars, weeks,
 * first hires and a payback, all read from two tables typed by hand with no
 * source (src/lib/markets/startup_capital_archetypes.ts and
 * opening_archetypes.ts), with an 80,000 fill on the 44 live trades the capital
 * table did not key and a "place adjustment" that was the national wage proxy
 * on every US state. In their place the page prints:
 *
 *   - the licences the trade needs, each with its typical wait in days and its
 *     fee band, through buildPermits (src/lib/spine/permits_rows.ts), the trade
 *     page's own `03 permits` builder; the longest wait leads the page;
 *   - the trade's months to break even and years to pay back, through
 *     buildOpenFoot (src/lib/spine/open_rows.ts), the trade page's own `04 open`
 *     figures (first_year.* on the shard);
 *   - the owner take-home, the cell page's own derivation (below);
 *   - the same business in other places, each with its owner take-home, off
 *     buildAcrossCities (the across page's slate).
 *
 * Every printed figure carries its stamp (src/lib/spine/provenance.ts). The
 * shard figures are the trade's, modelled (R12), and say estimate.
 *
 * Build-safe by construction: every Supabase read is wrapped in withBudget(), so
 * a slow or failed query degrades that one part (it self-omits) rather than
 * hanging the page. The function returns null ONLY when the core cell does not
 * resolve or is not a trusted local measurement of the requested activity, so the
 * page can notFound() cleanly without ever rendering a number it cannot stand
 * behind.
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only money.
 */
import {
  getCellBySlug,
  cellUrl,
  withBudget,
  type Cell,
} from "@/lib/cells";
import { isTrustedLocalCell } from "@/lib/cells/trust";
import { tradePageHref } from "@/lib/open/sub_page_gates";
import { clampMargin } from "@/lib/finance/margin_floor";
import { slugToIndustry } from "@/lib/taxonomy";
import { iso2ToName } from "@/lib/countries";
import { estimateNetProfit } from "@/lib/finance/net_profit";
import { resolveOwnerTakeHome } from "@/lib/finance/owner_take_home";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { getLondonEntry } from "@/lib/scores/cell_board";
import { buildAcrossCities, type CityColumn } from "@/lib/markets/across_cities";
import { buildPermits, type PermitsData } from "@/lib/spine/permits_rows";
import { buildOpenFoot } from "@/lib/spine/open_rows";
import type { Companion } from "@/components/spine/archetypes/BentoBand";
import type { Provenance } from "@/lib/spine/provenance";
import { COPY } from "@/lib/spine/copy";

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

/** A printed figure and where it was read (data-src, data-kind on the figure). */
export interface StampedFigure {
  /** The figure as it prints ("75 days", "$62K"). */
  figure: string;
  prov: Provenance;
}

/** One peer place for the SAME business, for the "same business elsewhere" strip. */
export interface PeerPlace {
  /** Display place name (the resolved cell's geo_name). */
  place: string;
  /** ISO2 country slug (lowercased), for a small flag. */
  country: string;
  /** Link to that place's full cell page for this activity. */
  href: string;
  /** That place's owner take-home a year, USD: the across page's own column figure. */
  takeHomeUsd: number;
  /** Where the take-home was worked out. */
  prov: Provenance;
}

/** The opening picture for one (country, geo, industry). */
export interface OpeningPage {
  /** Business (activity) display name, e.g. "Restaurants". */
  businessName: string;
  /**
   * Canonical industry id of the resolved cell (e.g. "restaurants"). The render
   * layer keys the optional dealbreaker line on this; it is the same id every
   * shared lookup on the page already uses.
   */
  industryId: string;
  /** Place display name, e.g. "California". */
  placeName: string;
  /** ISO2 country slug (lowercased). */
  country: string;
  /** Link back to the full cell page for this business-and-place. */
  cellHref: string;
  /**
   * THE ADDRESS THIS PAGE WAS ASKED AT, /{country}/{geo}/{industry}, from the request's own three parts (the review of 2026-10-12, I1). A door to
   * a sibling page (/buy-or-start) is spelled from it, never from `cellHref`: that is cellUrl(cell), built from the cell's display label, and
   * where the label does not slugify back to the request's geo (/mx/mx-roo is labelled "Quintana Roo") it is another address, whose lookup falls
   * to the extrapolated row, which the trust gate refuses. Asked the same lookup this page was, the sibling draws where this page's gate passed.
   */
  pageHref: string;
  /** True when the cell is a trusted local measurement (always true here; null otherwise). */
  trusted: true;

  /** The licences the trade needs: the trade page's `03 permits` builder, stamped; null where the place prints none (a UK page) or the shard holds none. */
  permits: PermitsData | null;
  /** The longest licence wait, the page's lead figure, or null with no licence to wait for. */
  longestWait: StampedFigure | null;
  /** Months to break even and years to pay back: the trade page's `04 open` figures off the shard, stamped; empty where the trade holds no shard. */
  earning: Companion[];

  /** Real annual owner take-home after tax, USD (page method), or null. */
  takeHomeUsd: number | null;
  /** Where the take-home was worked out, or null with no take-home. */
  takeHomeProv: Provenance | null;

  comparisons: {
    /** Up to four peer places for the same business: the two whose owners keep most and the two whose owners keep least. */
    sameBusinessElsewhere: PeerPlace[];
  };

  /** A short line under the lead figure: what the page holds. */
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

/**
 * Where an owner take-home was worked out: the shared take-home builder (src/lib/finance/owner_take_home.ts) over the row at this address.
 * An estimate, the engine's keeps (provenance.ts names them so).
 */
export function takeHomeProvFor(href: string): Provenance {
  return { src: `finance/owner_take_home:${href}`, kind: "estimate" };
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
  /* A MARGIN AT THE FLOOR PRINTS NO TAKE-HOME (QUEUE opening:floor-take-home,
     2026-09-19). The trade page's money law (cell_view.ts, trust:revenue-filled)
     withholds the take-home where the shown margin is the clamp's floor, because
     the floor times the revenue is the floor's figure and not the place's; this
     page derived the same dollars and printed them on three own-revenue hotel
     cells at 3 percent. Where the raw margin sits under the floor and no
     curated London entry holds a take-home of its own, both take-homes are
     null: the payback card self-omits and the board refuses to score, which is
     the repo's rule for a figure it cannot stand behind. */
  const floored =
    isNum(rawNetMargin) &&
    clampMargin(rawNetMargin, "net", cell.industry_id || null) > rawNetMargin;
  const londonTakeHome = londonEcon && isNum(londonEcon.owner_take_home) ? londonEcon.owner_take_home : null;
  const resolvedTakeHome = londonTakeHome ?? (floored ? null : adjustedNetTakeHome);

  return {
    ownerTakeHomeForBoard: londonTakeHome != null || !floored ? adjustedNetTakeHome : null,
    resolvedTakeHome,
    corporateTaxRate: netProfitResult?.effective_cit_rate ?? null,
    netMarginPct: rawNetMargin,
  };
}

/* ----------------------------------------------------------------------------
 * comparisons.sameBusinessElsewhere
 *
 * Reuse buildAcrossCities (the trust-gated world-city slate the across page
 * prints) for THIS activity, drop the current place, and keep the places whose
 * column holds an owner take-home: the two whose owners keep most and the two
 * whose owners keep least, so the strip reads as a contrast. The figure is the
 * across page's own column figure. Self-omits (empty array) when it cannot
 * resolve.
 * ------------------------------------------------------------------------- */
function peerFromColumn(col: CityColumn, currentHref: string): PeerPlace | null {
  // Drop the current place (same cell href) so the page never compares to itself.
  if (col.href === currentHref) return null;
  if (!isPos(col.takeHome)) return null;
  return {
    place: col.name,
    country: col.country,
    href: col.href,
    takeHomeUsd: Math.round(col.takeHome),
    prov: takeHomeProvFor(col.href),
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
    .map((c) => peerFromColumn(c, currentHref))
    .filter((p): p is PeerPlace => p !== null);
  if (peers.length === 0) return [];

  // The two places whose owners keep most and the two whose owners keep least,
  // read from most to least, de-duplicated and capped at four.
  const byKeep = [...peers].sort((a, b) => b.takeHomeUsd - a.takeHomeUsd);
  if (byKeep.length <= 4) return byKeep;
  const picked = [byKeep[0], byKeep[1], byKeep[byKeep.length - 2], byKeep[byKeep.length - 1]];
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
 * verdict
 * ------------------------------------------------------------------------- */
/* What the page holds, said once under the lead figure. Until 2026-10-15 it named "the cost, the calendar, and the first crew",
   three typed figures that left the page that day. */
function buildVerdict(): string {
  return COPY.opening.verdict;
}

/* ----------------------------------------------------------------------------
 * The builder
 * ------------------------------------------------------------------------- */

/**
 * Assemble the opening picture for one (country, geo, industry), or null when the
 * core cell does not resolve or is not a trusted local measurement of the
 * requested activity. Every figure is a held one, read through the builder the
 * trade page prints it with; every secondary read is budget-wrapped and
 * self-omits on a miss.
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
  // than rendering numbers it cannot stand behind. (Same gate the across page
  // and the extremes hub apply.)
  const requestedIndustry = slugToIndustry(industry);
  const expectedIndustryId = requestedIndustry?.id ?? cell.industry_id ?? undefined;
  if (!isTrustedLocalCell(cell, expectedIndustryId)) return null;
  // After the gate the cell carries a real industry_id; guard for the type system.
  if (!cell.industry_id) return null;
  const industryId = cell.industry_id;

  // 3. Owner take-home (the page's exact derivation, incl. floor + London).
  const th = pageTakeHome(cell, country, geo);

  // 4. The licences and the two first-year figures, through the trade page's own builders.
  const permits = buildPermits(industryId, country);
  /* The lead is the longest wait among the licences every shop needs, never a conditional one such as a liquor licence "(if serving
     alcohol)" (fix round 1, M-3); the list below still prints every licence with its wait. */
  const lead = permits?.longestRequired ? permits.cells.find((c) => c.key === permits.longestRequired!.key) ?? null : null;
  const longestWait: StampedFigure | null =
    lead && lead.prov && typeof lead.value === "string" ? { figure: lead.value, prov: lead.prov } : null;
  const earning = buildOpenFoot(industryId);

  // 5. The same business elsewhere (budget-wrapped, self-omits on a miss).
  const cellHref = cellUrl(cell);
  const sameBusinessElsewhere = await resolveSameBusinessElsewhere(industryId, cellHref);

  const placeName =
    cell.geo_name || iso2ToName(country) || country.toUpperCase();
  const businessName =
    cell.industry_name || requestedIndustry?.name || industry.replace(/-/g, " ");
  const takeHomeUsd = isNum(th.resolvedTakeHome) && th.resolvedTakeHome > 0 ? Math.round(th.resolvedTakeHome) : null;

  return {
    businessName,
    industryId,
    placeName,
    country: country.toLowerCase(),
    cellHref,
    pageHref: tradePageHref(country, geo, industry),
    trusted: true,
    permits: permits && permits.cells.length > 0 ? permits : null,
    longestWait,
    earning,
    takeHomeUsd,
    takeHomeProv: takeHomeUsd != null ? takeHomeProvFor(tradePageHref(country, geo, industry)) : null,
    comparisons: { sameBusinessElsewhere },
    verdict: buildVerdict(),
  };
}
