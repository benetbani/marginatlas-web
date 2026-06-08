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

/** Tier metadata. The same object is read by the modal AND the
 * pricing page so the two surfaces never drift. */
export type TierSpec = {
  id: PaywallTier;
  name: "Basic" | "Premium";
  priceMonthly: number; // USD
  priceAnnualPerMonth: number; // USD, the annual plan expressed monthly
  priceAnnualTotal: number; // USD, the actual yearly charge
  description: string; // single paragraph, Part 3.4
};

/** Verbatim from v34 Part 4.1 + Part 3.4. */
export const TIERS: Record<PaywallTier, TierSpec> = {
  basic: {
    id: "basic",
    name: "Basic",
    priceMonthly: 37,
    priceAnnualPerMonth: 31,
    priceAnnualTotal: 372,
    description:
      "Margin Atlas Basic unlocks p25 and p75 across every cell, " +
      "year-over-year changes, source citations on each cost line, " +
      "and saved cells (up to 25). $37/mo. Cancel any time.",
  },
  premium: {
    id: "premium",
    name: "Premium",
    priceMonthly: 77,
    priceAnnualPerMonth: 64,
    priceAnnualTotal: 768,
    description:
      "Margin Atlas Premium adds side-by-side comparison, CSV export, " +
      "email alerts on cell updates, confidence bands, and seasonality. " +
      "$77/mo. Cancel any time.",
  },
};

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
  basic: "Continue with Basic",
  premium: "Continue with Premium",
};

/** Where the primary CTA navigates before Phase D wires Stripe. */
export const PRICING_HREF = "/pricing";
