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

export { QuartileMarkers } from "./QuartileMarkers";

export { MoreDepthBanner } from "./MoreDepthBanner";
export type { MoreDepthBannerProps } from "./MoreDepthBanner";

export {
  trackLockClick,
  trackPaywallOpen,
  trackPaywallCta,
  trackPaywallDismiss,
  trackEmailSignup,
} from "./analytics";
export type { V34Event } from "./analytics";

export {
  openPaywall,
  OPEN_PAYWALL_EVENT,
} from "./events";
export type {
  PaywallEntryPoint,
  PaywallTier,
  OpenPaywallDetail,
} from "./events";

export { PaywallModalRoot } from "./PaywallModalRoot";
export {
  TIERS,
  MODAL_HEADLINES,
  CANCEL_ANYTIME_BLOCK,
  METHODOLOGY_LABEL,
  METHODOLOGY_HREF,
  PRIMARY_CTA,
  PRICING_HREF,
} from "./paywall_copy";
export type { TierSpec } from "./paywall_copy";
