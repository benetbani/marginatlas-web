/**
 * Analytics for monetization events.
 *
 * CLARITY LEFT THE SITE ON 2026-10-04 (milestone 1, M2; his interview of
 * 2026-09-26, answer 7: cookie-free analytics, no banner), so `fire` finds no
 * `window.clarity` and sends nothing. The events stay named here for Pro
 * (milestone 2), where a cookie-free sink is chosen with the paywall; until
 * then every call is a no-op by the guard below.
 *
 * Events fired:
 *   v34_lock_click       (entry, tier) — any lock primitive clicked
 *   v34_email_signup     (source)      — email captured anywhere
 *
 * The paywall modal's three events (opened, its call to action, dismissed) left
 * with the modal on 2026-10-05 (masterplan step 13; his ruling 22: no pop-up).
 *
 * Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 * Part 6 Phase H + Part 10 (live-experiment variables).
 */

import type { PaywallEntryPoint, PaywallTier } from "./events";

type ClarityFn = (action: string, ...args: unknown[]) => void;

declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

export type V34Event =
  | "v34_lock_click"
  | "v34_email_signup";

/** Fire a custom Clarity event. No-op when Clarity is not loaded
 * (e.g. local dev, ad blockers). */
function fire(event: V34Event, payload: Record<string, string>): void {
  if (typeof window === "undefined") return;
  const clarity = window.clarity;
  if (typeof clarity !== "function") return;
  try {
    // Clarity's custom-event API: clarity('event', 'event-name')
    clarity("event", event);
    // Plus per-tag metadata so we can filter in the dashboard.
    for (const [key, value] of Object.entries(payload)) {
      clarity("set", `v34_${key}`, value);
    }
  } catch {
    // Never throw from analytics.
  }
}

export function trackLockClick(
  entry: PaywallEntryPoint,
  tier: PaywallTier,
): void {
  fire("v34_lock_click", { entry, tier });
}

export function trackEmailSignup(source: string): void {
  fire("v34_email_signup", { source });
}
