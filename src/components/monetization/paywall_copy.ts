/**
 * Locked microcopy lexicon for the v34 locks and the pricing page.
 *
 * No founder-editable strings live in component JSX. This is the
 * single source of truth referenced by:
 *
 *   - the lock primitives (the plan's name, the pricing link)
 *   - the pricing page and the home teaser (the plan, what Pro opens)
 *   - the Phase N regression tests (asserts copy is on disk)
 *
 * The paywall modal's own strings (its headlines, its call to action and
 * its dismiss label) left with the modal on 2026-10-05: his ruling 22 of
 * 2026-09-26, a locked section opens no pop-up (masterplan step 13).
 *
 * Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 * Part 3 (locked microcopy) + Part 4 (tier matrix).
 */

import type { PaywallTier } from "./events";
import { PRO, yearlyHeadline } from "@/lib/monetization/plan";

/** THE ONE PLAN (masterplan step 12; his interview of 2026-09-26, ruling 14: one plan, Pro; its price his decision of 2026-10-09).
 * Every figure here is read from src/lib/monetization/plan.ts, never typed, so a price printed anywhere is the plan's own (gate
 * one-price). The June Basic and Premium tiers, and their $37, $77, $372 and $768, are gone. */
export type TierSpec = {
  id: PaywallTier;
  name: typeof PRO.name;
  priceMonthly: number; // USD
  priceAnnualTotal: number; // USD, the actual yearly charge
  description: string; // one plain sentence
};

export const TIERS: Record<PaywallTier, TierSpec> = {
  pro: {
    id: "pro",
    name: PRO.name,
    priceMonthly: PRO.monthlyUsd,
    priceAnnualTotal: PRO.yearlyUsd,
    description: `Pro opens the rest of every UK chapter, ${yearlyHeadline()}.`,
  },
};

/** WHAT PRO OPENS (ruling 13, Pro sells depth; ruling 18, half of every UK chapter): the list the pricing page and the home
 * teaser print, one source. The four sections take their own titles as steps 22 to 29 build them. */
export const PRO_OPENS: readonly string[] = [
  "the second half of every chapter on UK pages",
  "the lease, by law",
  "one hire, all in",
  "what failing costs",
  "opening from abroad",
];

/** Cancel-anytime block. Verbatim from Numbeo (teardown §G). Part 3.6. */
export const CANCEL_ANYTIME_BLOCK =
  "Subscriptions renew automatically. Cancel any time. " +
  "No long-term commitment. No surprise charges.";

/** Trust line label. Linked to /about-data. Part 3.5. */
export const METHODOLOGY_LABEL = "Methodology";
export const METHODOLOGY_HREF = "/about-data";

/** Where every lock links (masterplan step 13; his ruling 22: a locked section opens no pop-up). */
export const PRICING_HREF = "/pricing";
