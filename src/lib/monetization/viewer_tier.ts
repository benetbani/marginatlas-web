/**
 * viewer_tier — server-side resolver for the current viewer's tier.
 *
 * v34 Phase D stub. Always returns "free" today. Phase D will read
 * the Stripe customer record from the session cookie + db lookup
 * and return "basic" / "premium" accordingly.
 *
 * This file is the SINGLE READ POINT for tier on the server. Cell
 * pages, industry pages, city pages all call this once per request
 * and decide what to send to the client. That decision is what
 * satisfies the v34 Gate D (no leaked values): if the viewer is
 * Free, gated values must never be rendered into the DOM, even if
 * the gated lock-pill UI then asks them to unlock.
 *
 * Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 * Part 5.2 (#3 leakage check) + Part 6 Phase D.
 */

export type ViewerTier = "free" | "basic" | "premium";

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
  const RANK: Record<ViewerTier, number> = { free: 0, basic: 1, premium: 2 };
  if (RANK[current] >= RANK[required]) return value;
  return null;
}
