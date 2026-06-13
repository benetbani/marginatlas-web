/**
 * The Atlas Page Kit (design-system 12.2).
 *
 * The shared vocabulary every page composes from: answer-first masthead, the
 * honest-take through-line, the signature range strip, the per-$100 money
 * breakdown, the editorial beats, the structured data sections, the comparison
 * grammar, the sticky nav, and the closing furniture. Each is tokens-only,
 * nullable-input, self-omitting, plain-voiced. Pages import from here.
 */
export { RangeStrip, type RangeStripProps } from "./RangeStrip";
export { HonestTakeBox, type HonestTakeBoxProps } from "./HonestTakeBox";
export {
  AnswerFirstMasthead,
  type AnswerFirstMastheadProps,
  type MastheadAnchor,
  type MastheadSpread,
  type MastheadStat,
} from "./AnswerFirstMasthead";
export { CountUpNumber, type CountUpNumberProps } from "./CountUpNumber";
export { formatWithSpec, type NumberFormatSpec } from "./numberFormat";
export {
  MoneyGoesBreakdown,
  type MoneyGoesBreakdownProps,
  type MoneyGoesItem,
} from "./MoneyGoesBreakdown";

// Editorial beats
export {
  BeatCard,
  GutCheck,
  RealityCheck,
  RightForWrongFor,
  WhatLocalsKnow,
  ContrarianInsight,
  MythVsReality,
  type MythPair,
} from "./editorial";

// Structured data sections
export {
  PlainTerms,
  type PlainTermItem,
  BreakEvenLine,
  WagesByRole,
  type WageRole,
  Seasonality,
  RealisticFirstYear,
  SameBusinessNearby,
  type NearbyRow,
} from "./sections";

// Comparison grammar
export {
  LikeForLikeTable,
  type LikeForLikeColumn,
  type LikeForLikeRow,
  WageRangeTracks,
  type WageTrack,
} from "./comparison";

// Navigation + furniture
export { StickySectionNav, type NavSection } from "./StickySectionNav";
export { FreshnessStamp, FlagIt } from "./furniture";
export { SectionEmpty, type SectionEmptyProps } from "./SectionEmpty";
