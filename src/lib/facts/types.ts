/**
 * src/lib/facts/types.ts , the shape every caller of the warehouse shares.
 *
 * One Fact is one measured value for one entity, optionally one row inside that
 * entity, one metric, one period. This mirrors page-data/schema/metrics.json and
 * is the contract an MCP tool or a public API would expose verbatim.
 */

/** Stable entity keys, per the 2026-07-03 warehouse design. */
export type EntityType = "country" | "city" | "neighborhood" | "industry" | "cell";

/** How much to trust a value. ONE scale, replacing four across the codebase. */
export type FactTag = "held" | "modeled" | "extrapolated" | "placeholder";

export type Fact = {
  entityType: EntityType;
  /** iso2 | iso2-slug | iso2-city-district | industry_id | iso2[-city]-industry */
  entityId: string;
  /** The row inside a collection metric, e.g. "shoreditch". Empty for scalars. */
  rowKey: string;
  /** A name from the closed vocabulary. Collection metrics contain ".*". */
  metric: string;
  value: number | string;
  unit: string | null;
  tag: FactTag;
  /** Calibrated confidence, 0..1. */
  c: number;
  period: string;
  methodId: string;
};

/** What a caller asks for. Every field narrows; omitting one means "any". */
export type FactQuery = {
  entityType?: EntityType;
  entityId?: string;
  /** Exact names, or a prefix ending in "." to take a whole domain. */
  metrics?: string[];
  rowKey?: string;
  period?: string;
  /** Drop anything below this confidence. Omit to take everything. */
  minConfidence?: number;
};
