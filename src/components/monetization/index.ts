/**
 * v34 monetization primitives — Phase A exports.
 *
 * Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 */
export { LockPill } from "./LockPill";
export type { LockPillProps } from "./LockPill";

export { BlurredOverlay } from "./BlurredOverlay";
export type { BlurredOverlayProps } from "./BlurredOverlay";

export { TruncatedTease } from "./TruncatedTease";
export type { TruncatedTeaseProps } from "./TruncatedTease";

export { RedactedNumber } from "./RedactedNumber";
export type { RedactedNumberProps } from "./RedactedNumber";

export { GhostBar } from "./GhostBar";
export type { GhostBarProps } from "./GhostBar";

export {
  openPaywall,
  OPEN_PAYWALL_EVENT,
} from "./events";
export type {
  PaywallEntryPoint,
  PaywallTier,
  OpenPaywallDetail,
} from "./events";
