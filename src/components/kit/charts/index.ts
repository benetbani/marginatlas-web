/**
 * The Atlas chart family (design-system 10.1, ported from the 2026-06-14
 * Claude-design charts).
 *
 * Six data-clean charts that turn the page's numbers into shape without ever
 * becoming chartjunk: they live by the warm-frame-clean-data law (opaque, high
 * contrast, no glass or imagery behind a figure), carry no gridlines / legends /
 * rainbows, label directly, run tabular numerals, reserve the lone vermillion
 * accent for the focal subject, and each reduces to a legible 375px form with no
 * horizontal scroll. Every chart has a filled and an honest "not held yet" empty
 * state; the two that animate (Waterfall, ComparisonBars) do one subtle reveal
 * via the kit's shared motion-safe keyframe, so a reduced-motion reader gets the
 * final state and every chart stays server-renderable.
 *
 * The signature RangeStrip stays at kit root (it predates this folder and is
 * reconciled in place); pages compose it from the kit barrel alongside these.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
export { Waterfall, type WaterfallProps, type WaterfallStep } from "./Waterfall";
export {
  ScoreBand,
  type ScoreBandProps,
  type ScoreBandStop,
  type ScoreTone,
} from "./ScoreBand";
export {
  ComparisonBars,
  type ComparisonBarsProps,
  type ComparisonItem,
} from "./ComparisonBars";
export { HeatStrip, type HeatStripProps, type HeatCell } from "./HeatStrip";
export { FootfallGrid, type FootfallGridProps } from "./FootfallGrid";
export { VisitorSplit, type VisitorSplitProps } from "./VisitorSplit";

// Shared chart helpers (exported so a page can reuse the family's compact-USD
// formatter or the reduced-motion check without redefining them).
export { fmtUsdCompact, isNum as isChartNum, usePrefersReducedMotion } from "./helpers";
