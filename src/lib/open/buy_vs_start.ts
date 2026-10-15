/**
 * src/lib/open/buy_vs_start.ts
 *
 * Server-side data builder for the dedicated "is it smarter to BUY an existing
 * [business] in [place] or START one fresh?" page. ONE responsibility: assemble
 * a side-by-side BUY vs START picture for a single (country, geo, industry) URL
 * triple, reusing the EXACT live numbers the cost-to-open page already computes
 * so the START side can never disagree with the rest of the site.
 *
 * The START side is NOT re-derived here. It is read STRAIGHT OFF buildOpeningPage
 * (src/lib/open/opening_page.ts), which itself mirrors the cell page's resolution
 * exactly: the total one-time cost to open (capital + permits), the time to open
 * (modeled weeks), the break-in payback in years (off buildCellBoard), and the
 * owner take-home (the page's shared source of truth). So every START figure on
 * this page is byte-for-byte the cost-to-open page's, and through it the cell
 * page's. We add nothing to the START side; we only RE-FRAME it as one half of a
 * buy-or-build decision.
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
 * This file used to hold the price in its own hands: 153 multiples typed by slug
 * with no source, a blanket default, a band, a price floor and ceiling, and an
 * asset floor of 40% of the start cost that set the printed price on half the
 * pages the note "about 2x owner earnings" sat beside. All of it is gone, and
 * tests/open/buy_price_held.test.ts keeps it out: no number is typed in this
 * file or in buy_side.ts (the pure buy side, split out so the gate can run it
 * without the Supabase client) but the verdict's dead-band and the zeros and
 * ones of arithmetic.
 *
 * Where the shard's figures rest on operating earnings (EBITDA), a figure worked
 * from an owner's take-home would be the wrong base, so the page prints the
 * stated line the trade page's card prints for that trade (COPY.tradeWorth) and
 * no price. A trade whose shard holds no pair prints the same line.
 *
 * MISSING-DATA DISCIPLINE (the founder no-wrong-numbers rule): the BUY side is
 * meaningless without a real owner take-home to multiply, and the START side is
 * meaningless without a real cost to open. So the builder returns null when the
 * opening page is null (untrusted / unresolved cell) OR when its owner take-home
 * is missing OR when its total-to-open is missing, and the route notFound()s
 * rather than printing an invented sale price. Every shared number is reused, not
 * re-derived, so the two surfaces can never drift.
 *
 * NOT FIXED HERE, and said so: the START cash (src/lib/markets/startup_capital_
 * archetypes.ts and opening_archetypes.ts) is still one typed capital per trade
 * with no source. The verdict compares a stamped sale range with it, so it leans
 * only outside a dead-band and says estimate; the start side is its own ticket.
 *
 * Pure-ish: one await on buildOpeningPage (which owns all the Supabase work and
 * is fully budget-wrapped) plus pure arithmetic and copy. No direct Supabase, no
 * React. Constraint-safe: no em-dashes, no source-agency names, USD-only.
 */
import { buildOpeningPage } from "@/lib/open/opening_page";
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

/** The START side: build it fresh, the live cost-to-open numbers, re-framed. */
export interface StartSide {
  /** Cash needed up front: the total one-time cost to open, USD (capital + permits). */
  cashNeededUsd: number;
  /** Modeled weeks from the decision to opening day. */
  timeToOpenWeeks: number;
  /**
   * Years to earn the entry cost back once open (the break-in payback), or null
   * when the cell has no defensible rating. This is the ramp AFTER opening.
   */
  paybackYears: number | null;
  /** True (the start cost is always at least partly modeled archetype). */
  modeled: true;
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

  /** One line that leans only outside the dead-band, or says there is no sale price. */
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
 * when the START side cannot be trusted. The START side is read straight off
 * buildOpeningPage (which mirrors the cell page exactly and self-gates on trust),
 * so this returns null whenever that does, AND whenever the owner take-home or
 * the total-to-open is missing (no defensible BUY price without a take-home to
 * multiply, no defensible START cash without a cost to open). Every shared number
 * is reused, never re-derived, so the two surfaces cannot drift.
 */
export async function buildBuyVsStart(
  args: BuildBuyVsStartArgs,
): Promise<BuyVsStart | null> {
  const { country, geo, industry } = args;

  // The START side is the cost-to-open page's numbers, resolved through the same
  // trust-gated builder. Null here means the cell did not resolve or is not a
  // trusted local measurement, so we notFound() exactly as that page does.
  const opening = await buildOpeningPage({ country, geo, industry });
  if (!opening) return null;
  if (!buyOrStartDraws(opening)) return null;

  // No-wrong-numbers gate. The BUY range multiplies the owner take-home, so a
  // missing take-home means no defensible sale price: return null rather than
  // invent one. The START cash is the total to open, so a missing/non-positive
  // total is equally undefensible.
  const takeHome = opening.takeHomeUsd;
  if (!isPos(takeHome)) return null;
  if (!isPos(opening.totalToOpenUsd)) return null;

  const industryId = opening.industryId;

  // START side: re-frame the live cost-to-open numbers. The payback (the ramp
  // after opening) rides off the break-in rating, null when the cell is unscored.
  const start: StartSide = {
    cashNeededUsd: Math.round(opening.totalToOpenUsd),
    timeToOpenWeeks: opening.time.value,
    paybackYears:
      opening.breakIn && isPos(opening.breakIn.paybackYears)
        ? opening.breakIn.paybackYears
        : null,
    modeled: true,
  };

  // BUY side: the trade's own sale range off its shard, times this cell's take-home, through the one function the trade page's card calls.
  const buy = buySideFor(industryId, takeHome);

  const catches = buildCatches();
  const verdict = buyVerdict(start.cashNeededUsd, buy);

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
