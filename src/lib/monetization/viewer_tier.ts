/**
 * viewer_tier: the tier type, and the tier a static render assumes.
 *
 * ONE PAID TIER (milestone 2, masterplan step 05; his interview of
 * 2026-09-26, ruling 14: one plan, Pro, $38 a month or $238 a year).
 * The June "basic" / "premium" pair is gone; src/lib/monetization/plan.ts
 * holds the plan and its prices.
 *
 * WHAT READS A TIER (the checkup of 2026-10-08; this header used to call
 * getViewerTier the single read point every page calls once per request,
 * and no page calls it). A static page never asks: the route decides
 * whether a UK page draws its locks (isPaywallOn and lockablePath,
 * src/lib/monetization/pro_route.ts), and a locked level draws a stand-in,
 * never its figures, so no gated value is in cached HTML (v34 Gate D). A
 * signed-in reader's tier is read by getSessionTier
 * (src/lib/monetization/entitlement.ts) in the uncached /pro mirror and in
 * two API routes (cell-take-home, export-csv). getViewerTier and gateValue
 * below have no caller in src: the cell page's gateValue import has been
 * commented out since 2026-05-25; tests/monetization/pro_plan.test.ts and
 * the monetization audit's source check read them.
 *
 * Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 * Part 5.2 (#3 leakage check) + Part 6 Phase D.
 */

export type ViewerTier = "free" | "pro";

/** Phase D stub. Always "free". */
export function getViewerTier(): ViewerTier {
  return "free";
}

/** Convenience: returns `value` if the viewer's tier meets `required`,
 * otherwise null. Caller wraps the rendered field accordingly. */
export function gateValue<T>(
  value: T | null,
  required: ViewerTier,
  current: ViewerTier = getViewerTier(),
): T | null {
  const RANK: Record<ViewerTier, number> = { free: 0, pro: 1 };
  if (RANK[current] >= RANK[required]) return value;
  return null;
}
