/**
 * src/lib/monetization/plan.ts
 *
 * THE ONE PRO PLAN (milestone 2; his interview of 2026-09-26: ruling 13, Pro sells depth; 14, the price; 20, checkout first and
 * no trial; 33, dollars everywhere). One paid plan. Every price the site prints and every Stripe price id the code reads comes
 * from this file, so no page can print a price this file does not hold.
 *
 * The price ids are read by name at call time, never cached: unset means billing is dormant, and every caller answers 503 or
 * draws its "not open yet" state rather than guessing.
 */
export const PRO = { name: "Pro", monthlyUsd: 38, yearlyUsd: 238 } as const;

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

/** The one way a price is written: "$38 a month", "$238 a year". */
export function priceLine(interval: BillingInterval): string {
  return interval === "year" ? `$${PRO.yearlyUsd} a year` : `$${PRO.monthlyUsd} a month`;
}
