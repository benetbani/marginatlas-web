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
export { StillFillingIn, groupSectionStack, type StillFillingInSection } from "./StillFillingIn";

// Interaction controls — the reusable agency primitives (P1-P5) the switchers,
// the make-it-yours calculator, the watch/compare tray, and the zoom control all
// compose from. Controls act on the visible numbers in place, respond at the
// action's tempo, stay reversible with the canonical value beside any adjusted
// one, keep the reader oriented, and stay disclosed-not-displayed.
export { Slider, type SliderProps } from "./controls/Slider";
export { ResetAnchor, type ResetAnchorProps } from "./controls/ResetAnchor";
export { PendingShell, type PendingShellProps } from "./controls/PendingShell";
export {
  OrientationHeader,
  type OrientationHeaderProps,
  type OrientationItem,
} from "./controls/OrientationHeader";
export {
  Segmented,
  type SegmentedProps,
  type SegmentedOption,
} from "./controls/Segmented";
