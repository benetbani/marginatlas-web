/**
 * The Atlas table family - the one table system, ported from the Claude-design
 * table-system.css (.atbl-*) into real React + Tailwind, tokens-only.
 *
 * One grammar: a single hairline under the header, whitespace row grouping (no
 * gridlines, no zebra), right-aligned tabular figures, the quiet terracotta
 * leader tint, the honest dash, the faint warm hover wash, the caption-with-
 * diamond. Every variant carries the mandatory 375px stacked reflow.
 *
 *   AtlasTable       the metric-row x place-column primitive (renders both the
 *                    desktop table and the stacked reflow from one data shape)
 *   ComparisonTable  like-for-like, leader tint, noLeaderMark opt-out, framed
 *   OwnerKeepTable   trades ranked by owner take-home, break-in chip, % net
 *   CostSplitTable   the where-each-$100-goes labeled bar-table
 *   RangeTable       low / median / high per row, the range-strip language
 *   WeightedCompare  per-metric weight slider + lock, live re-rank (client)
 *
 * Plus the shared atoms (TableShell, MeaningChip, InlineBar, RangeTrack) and
 * the small format helpers, so a page can compose a one-off table in the same
 * grammar without re-deriving it.
 */
export {
  AtlasTable,
  type AtlasTableProps,
  type AtlasColumn,
  type AtlasRow,
} from "./AtlasTable";
export {
  ComparisonTable,
  type ComparisonTableProps,
  type ComparisonColumn,
  type ComparisonRow,
} from "./ComparisonTable";
export {
  OwnerKeepTable,
  type OwnerKeepTableProps,
  type OwnerKeepTrade,
} from "./OwnerKeepTable";
export {
  CostSplitTable,
  type CostSplitTableProps,
  type CostSplitRow,
} from "./CostSplitTable";
export {
  RangeTable,
  type RangeTableProps,
  type RangeTableRow,
} from "./RangeTable";
export {
  WeightedCompare,
  type WeightedCompareProps,
  type WeightedColumn,
  type WeightedMetric,
} from "./WeightedCompare";

// Shared atoms + format helpers (compose a one-off table in the same grammar).
export {
  TableShell,
  type TableShellProps,
  MeaningChip,
  type ChipTone,
  InlineBar,
  RangeTrack,
  figureCellClass,
  type FigureTone,
  resolveLeaderKey,
  money,
  moneyFull,
  percent,
  DASH,
  isNum,
  hasText,
} from "./helpers";
