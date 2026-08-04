/**
 * matrix.ts , the pricing feature matrix, in one place.
 *
 * WHY IT MOVED HERE. It was declared inline in `/pricing/page.tsx`, which was
 * fine while there was one pricing surface. There are now two, and the original
 * file's own header states the rule this protects:
 *
 *   "The tier cards and matrix render directly from the same paywall_copy.ts
 *   that the modal uses, so the two surfaces cannot drift."
 *
 * Two copies of a price list is how a site ends up quoting different features
 * on different pages. The values below are byte-identical to what that page
 * declared; nothing was rewritten in the move.
 *
 * WHAT IS LOCKED. v34 Part 4.1, exact. Prices and tier copy live in
 * `paywall_copy.ts` and are not restated here. The v34 rules that bind any
 * surface rendering this:
 *
 *   - tier names Free / Basic / Premium, exact
 *   - annual shown as a monthly equivalent AND the actual yearly total, in the
 *     same line
 *   - no trial copy, no money-back copy, no "contact sales", no opaque
 *     enterprise tier, no charm pricing, no countdown, no scarcity counter
 *   - Basic quietly highlighted, never an aggressive "most popular" badge
 */

export type MatrixCellValue = boolean | string;

export type MatrixRow = {
  group: string;
  label: string;
  /** free / basic / premium, in that order. */
  values: [MatrixCellValue, MatrixCellValue, MatrixCellValue];
};

/** v34 Part 4.1 feature matrix, exact. */
export const MATRIX: MatrixRow[] = [
  // Browsing
  { group: "Browsing", label: "Cell pages (read)",        values: [true, true, true] },
  { group: "Browsing", label: "Median (p50)",             values: [true, true, true] },
  { group: "Browsing", label: "Top decile (p90)",         values: [true, true, true] },
  { group: "Browsing", label: "Bottom decile (p10)",      values: [true, true, true] },
  { group: "Browsing", label: "Headline cost line",       values: [true, true, true] },
  { group: "Browsing", label: "Grand setup-cost total",   values: [true, true, true] },
  { group: "Browsing", label: "City character",           values: [true, true, true] },
  { group: "Browsing", label: "Failure modes",            values: [true, true, true] },
  { group: "Browsing", label: "Tangible units",           values: [true, true, true] },
  { group: "Browsing", label: "If you opened today",      values: [true, true, true] },
  { group: "Browsing", label: "Narrative paragraph",      values: [true, true, true] },

  // Depth (Basic unlocks)
  { group: "Depth",    label: "Lower-mid quartile (p25)", values: [false, true, true] },
  { group: "Depth",    label: "Upper-mid quartile (p75)", values: [false, true, true] },
  { group: "Depth",    label: "Year-over-year deltas",    values: [false, true, true] },
  { group: "Depth",    label: "Source citation per line", values: [false, true, true] },

  // Personal workspace (Basic unlocks)
  { group: "Workspace", label: "Saved cells (watchlist)", values: [false, "25 max", "Unlimited"] },
  { group: "Workspace", label: "Saved searches",          values: [false, true, true] },

  // Power (Premium unlocks)
  { group: "Power",     label: "Cell comparison (side by side)", values: [false, false, true] },
  { group: "Power",     label: "CSV export",                values: [false, false, true] },
  { group: "Power",     label: "Email alerts on cell updates", values: [false, false, true] },
  { group: "Power",     label: "Confidence intervals",      values: [false, false, true] },
  { group: "Power",     label: "Seasonality calendar",      values: [false, false, true] },
  { group: "Power",     label: "Public-company peers panel",values: [false, false, true] },
  { group: "Power",     label: "Equipment shopping list",   values: [false, false, true] },
];

/** paywall_copy.ts describes only the paid tiers, so Free states its own. */
export const FREE_DESCRIPTION =
  "Median, top decile, and bottom decile for every cell. The character " +
  "of every place we cover. No account required.";

/** v34 Part 3.7, the anti-Trading-Economics callout, verbatim. */
export const ANTI_TE_CALLOUT =
  "What we will never do: no auto-trial, no card-required-to-preview, " +
  "no friction to cancel, no surprise renewal-price hikes. The price " +
  "you sign up at is the price you pay until you decide otherwise.";

/** How many rows each tier carries, counted rather than claimed. */
export function includedCount(tierIndex: 0 | 1 | 2): number {
  return MATRIX.filter((r) => r.values[tierIndex] !== false).length;
}
