/**
 * Custom DOM events that wire the v34 lock primitives to the
 * paywall modal that ships in Phase B.
 *
 * Decoupling rationale: the primitives are pure presentation
 * components that work in Storybook and in test pages without
 * the modal root being mounted. The modal root listens for
 * `atlas:open-paywall` on window and renders accordingly.
 *
 * Pre-Phase-B: the listener is not yet mounted; the dispatch is
 * a no-op. Primitives still render the lock CTA. This is correct
 * for the gate: Phase A ships the primitives independently.
 */

export type PaywallEntryPoint =
  | "cell_distribution_p25_p75"
  | "cell_yoy_delta"
  | "cell_source_citation"
  | "cell_confidence_band"
  | "cell_seasonality"
  | "cell_peers"
  | "cell_equipment"
  | "cell_owner_take_home"
  | "industry_topregions_p25_p75"
  | "industry_truncated_regions"
  | "city_topindustries_p25_p75"
  | "city_truncated_industries"
  | "calculator_brackets"
  | "compare_side_by_side"
  | "watchlist_add"
  | "export_csv"
  | "alerts_setup"
  | "sector_deep_comparison"
  | "generic";

export type PaywallTier = "basic" | "premium";

export type OpenPaywallDetail = {
  entry: PaywallEntryPoint;
  tier: PaywallTier;
};

export const OPEN_PAYWALL_EVENT = "atlas:open-paywall";

export function openPaywall(detail: OpenPaywallDetail): void {
  if (typeof window === "undefined") return;
  // Fire analytics inside openPaywall so EVERY lock
  // primitive emits the same event automatically. Importing inline
  // avoids a circular dep and keeps the analytics layer optional.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  import("./analytics").then((mod) => {
    mod.trackLockClick(detail.entry, detail.tier);
  }).catch(() => {
    // Analytics is non-essential; never throw.
  });
  window.dispatchEvent(new CustomEvent(OPEN_PAYWALL_EVENT, { detail }));
}
