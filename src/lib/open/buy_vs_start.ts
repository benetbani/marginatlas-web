/**
 * src/lib/open/buy_vs_start.ts
 *
 * Server-side data builder for the dedicated "is it smarter to BUY an existing
 * [business] in [place] or START one fresh?" page. ONE responsibility: assemble
 * a side-by-side BUY vs START picture for a single (country, geo, industry) URL
 * triple, from what the site holds, through the builders the trade page prints
 * with, so the two surfaces can never disagree.
 *
 * THE START SIDE HOLDS NO CASH FIGURE (2026-10-15, release 2 job A; the
 * controller's ruling, option (c) of /srv/atlas/reports/start-capitals-
 * investigation.md). It printed a start cash, weeks to open and a payback, all
 * from two tables typed by hand with no source (src/lib/markets/startup_capital_
 * archetypes.ts and opening_archetypes.ts), and the verdict leaned "cheaper" or
 * "dearer" by comparing that typed cash with the sale range. Now the START side
 * is read off buildOpeningPage, which holds no typed figure: the stated line
 * where the cash stood, the longest licence wait (the trade page's `03 permits`
 * builder) where the weeks stood, and the trade's years to pay back (the trade
 * page's `04 open` figure) where the typed payback stood, each stamped. The
 * verdict is one line that leans nowhere (buy_side.ts).
 *
 * THE BUY SIDE IS THE TRADE PAGE'S OWN "What one sells for", NOT A SECOND MODEL
 * (2026-10-15, QUEUE open:buy-or-start-typed-multiples). It is a range in
 * currency, the trade's own shard figures sale_exit.multiple_low and
 * sale_exit.multiple_high times this cell's owner take-home, worked out by
 * worthPrice in src/lib/spine/worth_rows.ts (through buySideFor in
 * src/lib/open/buy_side.ts), the one function the trade page's card calls, so
 * the two pages print one pair of numbers and can never disagree.
 * It carries its source stamp (data-src names the shard file and the keys,
 * data-kind says estimate) and the words call it an estimate.
 *
 * Where the shard's figures rest on operating earnings (EBITDA), a figure worked
 * from an owner's take-home would be the wrong base, so the page prints the
 * stated line the trade page's card prints for that trade (COPY.tradeWorth) and
 * no price. A trade whose shard holds no pair prints the same line.
 *
 * MISSING-DATA DISCIPLINE (the founder no-wrong-numbers rule): the BUY side is
 * meaningless without a real owner take-home to multiply, so the builder returns
 * null when the opening page is null (untrusted / unresolved cell) OR when its
 * owner take-home is missing, and the route notFound()s rather than printing an
 * invented sale price. The page draws on the take-home alone (sub_page_gates.ts).
 *
 * Pure-ish: one await on buildOpeningPage (which owns all the Supabase work and
 * is fully budget-wrapped) plus pure arithmetic and copy. No direct Supabase, no
 * React. Constraint-safe: no em-dashes, no source-agency names, USD-only.
 */
import { buildOpeningPage, type StampedFigure } from "@/lib/open/opening_page";
import { COPY } from "@/lib/spine/copy";
import { OPEN_METRICS } from "@/lib/spine/open_rows";
import type { Companion } from "@/components/spine/archetypes/BentoBand";
import { buyOrStartDraws, subPageHref } from "@/lib/open/sub_page_gates";
import { buySideFor, buyVerdict, type BuySide } from "@/lib/open/buy_side";

export type { BuySide } from "@/lib/open/buy_side";

/** A real, finite, positive number. */
function isPos(n: number | null | undefined): n is number {
  return typeof n === "number" && Number.isFinite(n) && n > 0;
}

/* ----------------------------------------------------------------------------
 * Public types
 * ------------------------------------------------------------------------- */

/** The START side: build it fresh. No cash figure is held, so it carries the stated line, the longest licence wait and the trade's years to pay back. */
export interface StartSide {
  /** The stated line where the start cash would stand: no start cost is held. */
  cashLine: string;
  /** The longest licence wait (the trade page's `03 permits`), stamped, or null where the place prints no licence list. */
  longestWait: StampedFigure | null;
  /** The trade's years to pay back (the trade page's `04 open` figure), stamped, or null where the shard holds none. */
  payback: Companion | null;
}

/** The honest catch on each side, named in plain language. */
export interface BuyVsStartCatch {
  /** The upside of starting fresh, one short clause. */
  startUpside: string;
  /** The catch on starting fresh (the ramp, the failure risk), one clause. */
  startCatch: string;
  /** The upside of buying (day-one cash flow), one short clause. */
  buyUpside: string;
  /** The catch on buying (goodwill, inherited problems), one short clause. */
  buyCatch: string;
}

/** The full BUY vs START picture for one (country, geo, industry). */
export interface BuyVsStart {
  /** Business (activity) display name, e.g. "Restaurants". */
  businessName: string;
  /** Canonical industry id of the resolved cell. */
  industryId: string;
  /** Place display name, e.g. "London". */
  placeName: string;
  /** ISO2 country slug (lowercased). */
  country: string;
  /** Link back to the full cell page for this business-and-place. */
  cellHref: string;
  /**
   * THE ADDRESS THIS PAGE WAS ASKED AT, /{country}/{geo}/{industry}, carried from the opening page it stands on (OpeningPage.pageHref: the request's own three parts, the lookup
   * this page's gate was asked). A link to the trade page is spelled from it and never from `cellHref`: that is cellUrl(cell), built from the cell's display label, and where the
   * label does not slugify back to the request's geo (/mx/mx-roo is labelled "Quintana Roo") it is another address, whose lookup falls to the extrapolated row (the review of
   * 2026-10-12, I1).
   */
  pageHref: string;
  /** Link to the cost-to-open page for this business-and-place (the START detail): `pageHref` and /opening, so it draws where this page's own gate passed. */
  openingHref: string;

  /** The start-fresh side, the live cost-to-open numbers re-framed. */
  start: StartSide;
  /** The buy-existing side: the trade's sale range, or the stated line. */
  buy: BuySide;

  /** The honest two-sided catch. */
  catches: BuyVsStartCatch;

  /** One line with no lean on the cash: which side holds a figure, and that it is an estimate (buy_side.ts). */
  verdict: string;
}

export interface BuildBuyVsStartArgs {
  /** Country URL slug (iso2), e.g. "gb". */
  country: string;
  /** Geo URL slug, e.g. "london". */
  geo: string;
  /** Industry URL slug, e.g. "restaurants". */
  industry: string;
}

/* ----------------------------------------------------------------------------
 * Catch copy
 *
 * The two catches live in the page's "honest read" section (BuyVsStartCatches),
 * so neither side is sold blind there. The BUY range and the one-line verdict on
 * the cash are src/lib/open/buy_side.ts's, pure over the shards.
 * ------------------------------------------------------------------------- */

/**
 * The fixed two-sided catch copy. Plain, warm, honest. No em-dashes. Same on
 * every page because the trade-off itself is the same: build cheap but wait
 * through a ramp, or buy cash flow but pay for goodwill and inherit the problems.
 */
function buildCatches(): BuyVsStartCatch {
  return {
    startUpside: "you build it your way and pay nothing for goodwill",
    startCatch:
      "you wait through the ramp, with no cash flow until you find your feet, and most of the failure risk sits in those first couple of years",
    buyUpside: "you skip the ramp and inherit cash flow from day one",
    buyCatch:
      "you pay for someone else's goodwill, and you inherit their problems, the stale lease, the tired kit, the reason they sold",
  };
}

/* ----------------------------------------------------------------------------
 * The builder
 * ------------------------------------------------------------------------- */

/**
 * Assemble the BUY vs START picture for one (country, geo, industry), or null
 * when the cell cannot be trusted. The START side is read straight off
 * buildOpeningPage (which self-gates on trust), so this returns null whenever
 * that does, AND whenever the owner take-home is missing (no defensible BUY
 * price without a take-home to multiply). Every shared figure is reused, never
 * re-derived, so the two surfaces cannot drift.
 */
export async function buildBuyVsStart(
  args: BuildBuyVsStartArgs,
): Promise<BuyVsStart | null> {
  const { country, geo, industry } = args;

  // The START side stands on the opening page, resolved through the same
  // trust-gated builder. Null here means the cell did not resolve or is not a
  // trusted local measurement, so we notFound() exactly as that page does.
  const opening = await buildOpeningPage({ country, geo, industry });
  if (!opening) return null;
  if (!buyOrStartDraws(opening)) return null;

  // No-wrong-numbers gate. The BUY range multiplies the owner take-home, so a
  // missing take-home means no defensible sale price: return null rather than
  // invent one.
  const takeHome = opening.takeHomeUsd;
  if (!isPos(takeHome)) return null;

  const industryId = opening.industryId;

  // START side: no cash figure is held, so the stated line stands where it was; the longest licence wait and the years to pay back
  // are the opening page's own, stamped (the payback is the second of the trade page's two first-year figures).
  const start: StartSide = {
    cashLine: COPY.buyOrStart.startCash,
    longestWait: opening.longestWait,
    /* Found by the figure's own metric in its stamp, never by its words: a copy edit cannot empty the row (review of 2026-10-15, Minor 10). */
    payback: opening.earning.find((c) => c.prov?.src.endsWith(`:${OPEN_METRICS.payback}`)) ?? null,
  };

  // BUY side: the trade's own sale range off its shard, times this cell's take-home, through the one function the trade page's card calls.
  const buy = buySideFor(industryId, takeHome);

  const catches = buildCatches();
  const verdict = buyVerdict(buy);

  // The cost-to-open page lives at this page's own address and /opening, never at cellHref and /opening: that is the cell's label spelling (/mx/quintana-roo/... for
  // /mx/mx-roo/...), review of 2026-10-12, I1. Link the START detail there so a reader can drill into the full opening breakdown.
  const openingHref = subPageHref(opening.pageHref, "opening");

  return {
    businessName: opening.businessName,
    industryId,
    placeName: opening.placeName,
    country: opening.country,
    cellHref: opening.cellHref,
    pageHref: opening.pageHref,
    openingHref,
    start,
    buy,
    catches,
    verdict,
  };
}
