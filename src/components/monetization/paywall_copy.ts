/**
 * Locked microcopy lexicon for the v34 paywall modal.
 *
 * Every string the modal renders comes from this file. No founder-
 * editable strings live in component JSX. This is the single source
 * of truth referenced by:
 *
 *   - PaywallModalRoot.tsx (modal rendering)
 *   - the pricing page (mirrored tier copy)
 *   - the Phase N regression tests (asserts copy is on disk)
 *
 * Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 * Part 3 (locked microcopy) + Part 4 (tier matrix).
 */

import type { PaywallEntryPoint, PaywallTier } from "./events";
import { PRO, priceLine } from "@/lib/monetization/plan";

/** Headline shown at the top of the modal. Names the JOB the user
 * is trying to do (not the tier). Per Part 3.3. */
export const MODAL_HEADLINES: Record<PaywallEntryPoint, string> = {
  cell_distribution_p25_p75: "See the full distribution",
  cell_yoy_delta: "See year-over-year change",
  cell_source_citation: "See sources behind every line",
  cell_confidence_band: "See confidence bands",
  cell_seasonality: "See the seasonality calendar",
  cell_peers: "See public-company peers",
  cell_equipment: "See the equipment shopping list",
  cell_owner_take_home: "See what an owner keeps",
  industry_topregions_p25_p75: "See the full quartiles",
  industry_truncated_regions: "See every region we cover",
  city_topindustries_p25_p75: "See the full quartiles",
  city_truncated_industries: "See every industry we cover",
  calculator_brackets: "See your full bracket position",
  compare_side_by_side: "Compare cells side by side",
  watchlist_add: "Save this cell to your watchlist",
  export_csv: "Export this cell to CSV",
  alerts_setup: "Get alerts when this cell updates",
  sector_deep_comparison: "Compare the whole sector",
  generic: "Unlock more depth",
};

/** THE ONE PLAN (masterplan step 12; his interview of 2026-09-26, ruling 14: one plan, Pro, $38 a month or $238 a year). Every
 * figure here is read from src/lib/monetization/plan.ts, never typed, so a price printed anywhere is the plan's own (gate
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
    description: `Pro opens the rest of every UK chapter, ${priceLine("month")} or ${priceLine("year")}.`,
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

/** Cancel button label inside the modal. */
export const DISMISS_LABEL = "Not now";

/** Primary CTA label. Per Part 3.2. */
export const PRIMARY_CTA: Record<PaywallTier, string> = {
  pro: "Continue with Pro",
};

/** Where the primary CTA navigates before Phase D wires Stripe. */
export const PRICING_HREF = "/pricing";
