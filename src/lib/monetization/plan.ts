/**
 * src/lib/monetization/plan.ts
 *
 * THE ONE PRO PLAN (milestone 2; his interview of 2026-09-26: ruling 13, Pro sells depth; 20, checkout first and no trial; 33,
 * dollars everywhere; and his decision of 2026-10-09, which replaced ruling 14's price: Pro costs $48 a month or $456 a year, and
 * the pricing page leads with the year as "$38 a month, billed yearly"). One paid plan. Every price the site prints and every
 * Stripe price id the code reads comes from this file, so no page can print a price this file does not hold.
 *
 * Two prices are held, the month's and the year's. Every other figure is worked out from them here and never typed beside them:
 * the year by the month (456 / 12 = 38) and what the year saves against twelve months at the month's price (12 x 48 - 456 = 120,
 * which is 20.8 percent). The lines below are the only way those figures are written; the one-price gate reds on a price typed
 * anywhere else, and tests/monetization/pricing_page.test.ts holds what the page prints.
 *
 * The price ids are read by name at call time, never cached: unset means billing is dormant, and every caller answers 503 or
 * draws its "not open yet" state rather than guessing.
 */
export const PRO = { name: "Pro", monthlyUsd: 48, yearlyUsd: 456 } as const;

/** What a month of the yearly plan comes to: the year's price over its twelve months. */
export const YEARLY_BY_MONTH_USD: number = PRO.yearlyUsd / 12;

/** What paying for the year at once saves against twelve months at the month's price. */
export const YEARLY_SAVING_USD: number = PRO.monthlyUsd * 12 - PRO.yearlyUsd;

export type BillingInterval = "month" | "year";

type Env = Record<string, string | undefined>;

/** The Stripe price id for an interval, or null when it is not set. */
export function proPriceId(interval: BillingInterval, env: Env = process.env): string | null {
  const raw = interval === "year" ? env.STRIPE_PRICE_PRO_ANNUAL : env.STRIPE_PRICE_PRO_MONTHLY;
  const id = (raw ?? "").trim();
  return id ? id : null;
}

/** The interval a Stripe price id belongs to, or null when it is not one of Pro's two. */
export function intervalOfPrice(priceId: string | null | undefined, env: Env = process.env): BillingInterval | null {
  if (!priceId) return null;
  if (priceId === proPriceId("month", env)) return "month";
  if (priceId === proPriceId("year", env)) return "year";
  return null;
}

/** A dollar figure the way a price is written: whole dollars when whole, otherwise to the cent. */
function usd(n: number): string {
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

/** The one way a price is written: "$48 a month", "$456 a year". */
export function priceLine(interval: BillingInterval): string {
  return interval === "year" ? `${usd(PRO.yearlyUsd)} a year` : `${usd(PRO.monthlyUsd)} a month`;
}

/** The year by the month: "$38 a month". */
export function yearlyByMonthLine(): string {
  return `${usd(YEARLY_BY_MONTH_USD)} a month`;
}

/** THE LEAD (his decision of 2026-10-09): the year, written by the month and billed once a year, "$38 a month, billed yearly". */
export function yearlyHeadline(): string {
  return `${yearlyByMonthLine()}, billed yearly`;
}

/** The one plain line under the lead: the year's total and the saving, "$456 a year, $120 less than twelve months at $48." */
export function yearlySavingLine(): string {
  return `${priceLine("year")}, ${usd(YEARLY_SAVING_USD)} less than twelve months at ${usd(PRO.monthlyUsd)}.`;
}

/** The month's price, one line away: "or $48 month to month". */
export function monthToMonthLine(): string {
  return `or ${usd(PRO.monthlyUsd)} month to month`;
}
