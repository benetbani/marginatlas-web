/**
 * free_paid_map: the single declaration of what a Free, Basic, or Premium
 * viewer sees on a cell page.
 *
 * This is DATA, not wiring. It carries no render logic and touches no page, so
 * it is safe to land and review on its own. The cell-page wiring that reads it
 * is a deliberate, separately-tested follow-up: an earlier gating attempt
 * (QuartileMarkers + gateValue) caused a cell-page load failure and was
 * reverted on 2026-05-25, so gating must be re-introduced field by field with
 * its own verification, not in one sweep.
 *
 * Philosophy (founder + v34): Free always gets the HEADLINE ANSWER, so the page
 * is useful and shareable on its own. Paid tiers unlock DEPTH (full cost
 * decomposition, hidden quartiles, comparisons, exports). The locked state is
 * shown, never hidden: the interface stays visible under fog or behind a key,
 * Statista / Glassdoor style, so the reader sees that more exists.
 *
 * Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 */

import type { ViewerTier } from "./viewer_tier";

/** Stable ids for every gateable surface on the cell page. */
export type GatedFieldId =
  // Free hook (the shareable answer)
  | "hero_typical_revenue"
  | "hero_percentile_band"
  | "headline_employees"
  | "headline_wage"
  | "headline_profit_kept"
  | "editorial_narrative"
  | "activity_character"
  | "coverage_badge"
  // Basic depth
  | "cost_stack_full"
  | "net_profit_waterfall"
  | "breakeven_orders"
  | "distribution_inner_quartiles"
  | "across_states_full"
  // Premium depth
  | "size_band_switch"
  | "multi_year_trend"
  | "peer_multicell_table"
  | "tax_overlay_detail"
  | "csv_export";

export type GateRule = {
  /** Minimum tier that can see the real value. */
  required: ViewerTier;
  /** How the locked state should present when the viewer is below `required`. */
  treatment: "open" | "redacted" | "fog" | "ghost-bar" | "banner";
  /** One-line reason, for the design catalog + future copy. */
  note: string;
};

/**
 * The map. Everything not listed defaults to free/open.
 */
export const FREE_PAID_MAP: Record<GatedFieldId, GateRule> = {
  // ----- Free: the headline answer, always open -----
  hero_typical_revenue: { required: "free", treatment: "open", note: "The core answer. Always free and shareable." },
  hero_percentile_band: { required: "free", treatment: "open", note: "Bottom 10 / typical / top 10. The free spread." },
  headline_employees: { required: "free", treatment: "open", note: "People working. Free context stat." },
  headline_wage: { required: "free", treatment: "open", note: "Wage per employee. Free context stat." },
  headline_profit_kept: { required: "free", treatment: "open", note: "Headline net margin. Free." },
  editorial_narrative: { required: "free", treatment: "open", note: "The prose lead. Free, drives time on page." },
  activity_character: { required: "free", treatment: "open", note: "How this business makes money. Free." },
  coverage_badge: { required: "free", treatment: "open", note: "Confidence worn openly. Always free." },

  // ----- Basic: the operating depth -----
  cost_stack_full: { required: "basic", treatment: "fog", note: "Full annual cost decomposition under fog; summary 3 lines stay free." },
  net_profit_waterfall: { required: "basic", treatment: "fog", note: "Step-by-step take-home waterfall." },
  breakeven_orders: { required: "basic", treatment: "fog", note: "Orders-per-day to break even panel." },
  distribution_inner_quartiles: { required: "basic", treatment: "ghost-bar", note: "p25 and p75 ghosted; p10/p50/p90 axis stays readable." },
  across_states_full: { required: "basic", treatment: "banner", note: "Top rows free, full ranked table behind a calm banner." },

  // ----- Premium: power tools -----
  size_band_switch: { required: "premium", treatment: "redacted", note: "Switch size bands (1-4 .. 100+)." },
  multi_year_trend: { required: "premium", treatment: "fog", note: "Multi-year series when coverage supports it." },
  peer_multicell_table: { required: "premium", treatment: "banner", note: "Multi-cell comparison power table." },
  tax_overlay_detail: { required: "premium", treatment: "fog", note: "Full post-tax overlay detail." },
  csv_export: { required: "premium", treatment: "redacted", note: "Download / API access." },
};

const RANK: Record<ViewerTier, number> = { free: 0, basic: 1, premium: 2 };

/** True when `viewer` may see the real value for `id`. */
export function canSee(id: GatedFieldId, viewer: ViewerTier): boolean {
  return RANK[viewer] >= RANK[FREE_PAID_MAP[id].required];
}

/** The locked treatment to render for `id` given `viewer` (open when allowed). */
export function treatmentFor(id: GatedFieldId, viewer: ViewerTier): GateRule["treatment"] {
  return canSee(id, viewer) ? "open" : FREE_PAID_MAP[id].treatment;
}
