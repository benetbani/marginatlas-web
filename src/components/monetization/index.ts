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

export { trackLockClick, trackEmailSignup } from "./analytics";
export type { V34Event } from "./analytics";

/* The paywall modal, its opener and its own copy left on 2026-10-05 (masterplan step 13; his ruling 22: a locked section
   opens no pop-up). Every lock is a link to PRICING_HREF. */
export type { PaywallEntryPoint, PaywallTier } from "./events";

export {
  TIERS,
  CANCEL_ANYTIME_BLOCK,
  METHODOLOGY_LABEL,
  METHODOLOGY_HREF,
  PRICING_HREF,
  PRO_OPENS,
} from "./paywall_copy";
export type { TierSpec } from "./paywall_copy";
