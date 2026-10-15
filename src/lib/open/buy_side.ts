/**
 * src/lib/open/buy_side.ts
 *
 * THE BUY SIDE OF THE BUY-OR-START PAGE, pure over the local shards (2026-10-15, QUEUE open:buy-or-start-typed-multiples): the price a
 * buyer might pay, in currency, and the one line on the cash. Split out of buy_vs_start.ts so a gate can run it on every shard without a
 * database (buy_vs_start.ts imports the opening builder, which imports the Supabase client, which cannot load without its secrets).
 *
 * THE PRICE IS THE TRADE PAGE'S OWN "What one sells for", NOT A SECOND MODEL. It is a range in currency: the trade's shard figures
 * sale_exit.multiple_low and sale_exit.multiple_high times the cell's owner take-home, worked out by worthPrice in
 * src/lib/spine/worth_rows.ts, the one function the trade page's card calls, so the two pages print one pair of numbers and can never
 * disagree. It carries its source stamp (data-src names the shard file and the keys, data-kind says estimate) and the words call it an
 * estimate. Never a multiple, which clause 15 keeps out of a printed price.
 *
 * Where the shard's figures rest on operating earnings (EBITDA), a figure worked from an owner's take-home would be the wrong base, so
 * the page prints the stated line the trade page's card prints for that trade (COPY.tradeWorth) and no price. A trade whose shard holds
 * no pair prints the same line.
 *
 * No number is typed in this file but the verdict's dead-band and the zeros and ones of arithmetic: tests/open/buy_price_held.test.ts
 * keeps a price constant, a floor or a table by slug out of it.
 */
import { worthPrice } from "@/lib/spine/worth_rows";
import { COPY } from "@/lib/spine/copy";
import { usd } from "@/lib/spine/money";
import type { Provenance } from "@/lib/spine/provenance";

/** A real, finite, positive number. */
function isPos(n: number | null | undefined): n is number {
  return typeof n === "number" && Number.isFinite(n) && n > 0;
}

/**
 * The verdict leans only OUTSIDE this band around the start cash: buying is called dearer only when even the low end of the sale range is
 * more than this far over it, cheaper only when even the high end is more than this far under, and anything between reads as overlapping.
 * It decides a lean and never a price.
 */
const DEAD_BAND = 0.15;

/**
 * The BUY side: skip the build, buy the cash flow. An estimate, stamped.
 *  - "range": a low and a high in currency, the trade's own sale range (worthPrice), with `prov` naming where they were read.
 *  - "stated": no price. `line` is the plain stated line the trade page's card prints (COPY.tradeWorth) and `prov` is null.
 */
export interface BuySide {
  state: "range" | "stated";
  /** The low end of what a buyer might pay, USD to the dollar, or null in the stated state. */
  lowUsd: number | null;
  /** The high end, USD to the dollar, or null in the stated state. */
  highUsd: number | null;
  /** The stated line that stands where the range would, or null when a range stands. */
  line: string | null;
  /** Where the range came from (data-src, data-kind), or null when no range stands. */
  prov: Provenance | null;
}

/**
 * The BUY side for one trade and one owner take-home: the trade page's own sale range (worthPrice), stamped, or the stated line.
 * Pure over the local shard, so the gate runs it on every shard without a database.
 */
export function buySideFor(industryId: string, takeHomeUsd: number | null | undefined): BuySide {
  const price = worthPrice(industryId, takeHomeUsd);
  if (price && price.state === "strip" && isPos(price.low) && isPos(price.high)) {
    return { state: "range", lowUsd: price.low, highUsd: price.high, line: null, prov: { src: price.src, kind: "estimate" } };
  }
  /* Operating-earnings basis, a trade with no pair, or no take-home: the card's own stated line, and no figure. */
  const c = COPY.tradeWorth;
  const line = price && price.state === "withheld" ? c.withheld : c.otherBasis;
  return { state: "stated", lowUsd: null, highUsd: null, line, prov: null };
}

/**
 * The page's meta description, which Open Graph and Twitter reuse: the question, the start cash, and where a range stands the buy range as an estimate.
 * Pure, so the gate runs it on a priced and an unpriced trade; the buy figure in it is the range text and nothing typed. Where the shard cannot price
 * the trade the sentence is left out and the description names the start cash alone.
 */
export function buyMetaDescription(businessLower: string, placeName: string, startCashText: string, buy: BuySide): string {
  const range = buyRangeText(buy);
  const clause = range ? ` Buying might cost ${range}, an estimate.` : "";
  return `Is it smarter to buy an existing ${businessLower} in ${placeName} or start one fresh? Starting costs about ${startCashText}.${clause} The cash, the wait, and the honest catch on both sides.`;
}

/**
 * The range as it prints: the trade page's own money grammar (src/lib/spine/money.ts, the one `14 worth` draws its two marks with), so
 * the same two figures read the same on both pages ("$86K to $171K"). Null in the stated state.
 */
export function buyRangeText(buy: BuySide): string | null {
  if (buy.state !== "range" || !isPos(buy.lowUsd) || !isPos(buy.highUsd)) return null;
  return `${usd(buy.lowUsd)} to ${usd(buy.highUsd)}`;
}

/**
 * The verdict's four lines, each one sentence of twelve words or fewer. The cheaper line keeps the caution the old verdict carried beside a low price
 * ("a low price is exactly when to look hardest at what you are buying"), since it is the line a reader gets first where the range sits under the start cash.
 */
const VERDICT = {
  dearer: "On this estimate, buying costs more cash than starting fresh.",
  cheaper: "Estimate: buying costs less cash than starting, so check what you buy.",
  overlap: "This estimate overlaps the cost to start, so cash does not decide.",
  noPrice: "Cash does not decide this one without a sale price.",
};

/**
 * One line on the cash. The sale RANGE is compared with the start cash:
 *  - buying costs more only when the LOW end is over the start cash by more than the dead-band (the cheapest buy still costs more);
 *  - buying costs less only when the HIGH end is under the start cash by more than the dead-band (the dearest buy still costs less);
 *  - anything between is an overlap and the line leans nowhere.
 * With no range (the stated state) there is no cash to compare, so the line says so and leans nowhere. Never a claim the figures do not make.
 */
export function buyVerdict(startCashUsd: number, buy: BuySide): string {
  if (buy.state !== "range" || !isPos(buy.lowUsd) || !isPos(buy.highUsd) || !isPos(startCashUsd)) return VERDICT.noPrice;
  /* The gap against the band, never the band's own sum or difference with the start cash: 100000 * (1 + 0.15) is 114999.99999999999, so a low end exactly on the band would lean. */
  const band = startCashUsd * DEAD_BAND;
  if (buy.lowUsd - startCashUsd > band) return VERDICT.dearer;
  if (startCashUsd - buy.highUsd > band) return VERDICT.cheaper;
  return VERDICT.overlap;
}
