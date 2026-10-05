/**
 * The lock primitives' shared names: where a lock sits (PaywallEntryPoint,
 * which the click analytics reads) and the plan it opens (PaywallTier).
 *
 * Until 2026-10-05 this file also dispatched `atlas:open-paywall`, the window
 * event the paywall modal listened for. His ruling 22 of 2026-09-26 (a locked
 * section opens no pop-up) took the modal out in masterplan step 13: every lock
 * is now a link to the pricing page, so nothing dispatches and nothing listens.
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

/** One paid tier since masterplan step 12 (his ruling 14: one plan, Pro). */
export type PaywallTier = "pro";
