/**
 * Analytics for monetization events.
 *
 * Uses Microsoft Clarity (already loaded site-wide via layout.tsx)
 * as the event sink. Zero new dependencies. Privacy-respecting
 * because Clarity's own data handling is documented + we send only
 * categorical event metadata (entry point, tier), never user
 * inputs or PII.
 *
 * Events fired:
 *   v34_lock_click       (entry, tier) — any lock primitive clicked
 *   v34_paywall_open     (entry, tier) — paywall modal opened
 *   v34_paywall_cta      (entry, tier) — modal primary CTA clicked
 *   v34_paywall_dismiss  (entry)       — modal dismissed
 *   v34_email_signup     (source)      — email captured anywhere
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
  | "v34_paywall_open"
  | "v34_paywall_cta"
  | "v34_paywall_dismiss"
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

export function trackPaywallOpen(
  entry: PaywallEntryPoint,
  tier: PaywallTier,
): void {
  fire("v34_paywall_open", { entry, tier });
}

export function trackPaywallCta(
  entry: PaywallEntryPoint,
  tier: PaywallTier,
): void {
  fire("v34_paywall_cta", { entry, tier });
}

export function trackPaywallDismiss(entry: PaywallEntryPoint): void {
  fire("v34_paywall_dismiss", { entry });
}

export function trackEmailSignup(source: string): void {
  fire("v34_email_signup", { source });
}
