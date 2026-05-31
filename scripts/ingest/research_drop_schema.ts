/**
 * research_drop_schema.ts — the shared types + validation for a "research drop":
 * the structured JSON we convert heavy-research-model output into before loading
 * it into the database. See docs/research-ingestion.md.
 *
 * Pure (no DB, no env), so both the validator and the loader import it and the
 * unit test can exercise it offline.
 */

export type Confidence = "observed" | "modeled" | "low";

export type CostStructurePct = {
  cogs?: number;
  labor?: number;
  rent?: number;
  utilities?: number;
  tax?: number;
  fuel?: number;
  materials?: number;
  marketing?: number;
  other?: number;
};

export type SizeBandDrop = {
  band: string;
  revenue_per_firm_local: number | null;
  net_margin_pct_low: number | null;
  net_margin_pct_high: number | null;
  margin_basis?: string;
  cost_structure_pct?: CostStructurePct;
  share_of_firms_pct?: number | null;
  share_of_revenue_pct?: number | null;
  n_employees_typical?: number | null;
  confidence?: Confidence;
  source: string;
};

export type RegionalVariationDrop = {
  region: string;
  revenue_multiplier_vs_national: number;
  confidence?: Confidence;
  source: string;
};

export type ActivityDrop = {
  industry_id: string;
  currency: string;
  fx_to_usd: number;
  fx_date?: string;
  size_bands: SizeBandDrop[];
  regional_variation?: RegionalVariationDrop[];
};

export type ResearchDrop = {
  schema: "research-drop/v1";
  country_iso2: string;
  sector_cluster: string;
  source_model?: string;
  captured_at: string;
  confidence_default?: Confidence;
  activities: ActivityDrop[];
};

/** Canonical DB size_band values the loader normalizes drop bands to. */
export const CANONICAL_BANDS = [
  "1-4", "5-9", "10-19", "20-49", "50-99", "100+",
] as const;

/** Map the looser band labels a research drop may use to canonical bands. */
export function normalizeBand(raw: string): string | null {
  const b = raw.trim().toLowerCase().replace(/\s+/g, "");
  const map: Record<string, string> = {
    solo: "1-4",
    "1": "1-4",
    "1-4": "1-4",
    "2-4": "1-4",
    "1-9": "5-9",
    "5-9": "5-9",
    "10-19": "10-19",
    "10-49": "20-49",
    "20-49": "20-49",
    "20-99": "20-49",
    "50-99": "50-99",
    "50-299": "100+",
    "100+": "100+",
    "100-299": "100+",
    "300+": "100+",
    "500+": "100+",
  };
  return map[b] ?? null;
}

/** confidence -> quality_score (0-100) + coverage_tier used on the DB row. */
export function confidenceToQuality(c: Confidence | undefined): {
  quality_score: number;
  coverage_tier: string;
} {
  switch (c) {
    case "observed":
      return { quality_score: 70, coverage_tier: "M" };
    case "low":
      return { quality_score: 25, coverage_tier: "X" };
    case "modeled":
    default:
      return { quality_score: 45, coverage_tier: "X" };
  }
}

export type ValidationIssue = { level: "error" | "warn"; path: string; msg: string };

/**
 * Validate a parsed research drop. Returns issues; callers treat any "error" as
 * a hard fail. `knownIndustryIds` is passed in so this stays pure (the validator
 * script supplies the taxonomy set).
 */
export function validateResearchDrop(
  drop: unknown,
  knownIndustryIds: Set<string>,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const err = (path: string, msg: string) =>
    issues.push({ level: "error", path, msg });
  const warn = (path: string, msg: string) =>
    issues.push({ level: "warn", path, msg });

  if (typeof drop !== "object" || drop === null) {
    err("$", "drop is not an object");
    return issues;
  }
  const d = drop as Record<string, unknown>;
  if (d.schema !== "research-drop/v1") err("schema", 'must be "research-drop/v1"');
  if (typeof d.country_iso2 !== "string" || !/^[A-Z]{2}$/.test(d.country_iso2 as string))
    err("country_iso2", "must be a 2-letter uppercase ISO code");
  if (typeof d.captured_at !== "string") err("captured_at", "required date string");
  if (!Array.isArray(d.activities) || d.activities.length === 0)
    err("activities", "must be a non-empty array");

  const activities = Array.isArray(d.activities) ? (d.activities as ActivityDrop[]) : [];
  activities.forEach((a, i) => {
    const ap = `activities[${i}]`;
    if (!a.industry_id) err(`${ap}.industry_id`, "required");
    else if (!knownIndustryIds.has(a.industry_id))
      err(`${ap}.industry_id`, `"${a.industry_id}" not in taxonomy`);
    if (!a.currency) err(`${ap}.currency`, "required");
    if (typeof a.fx_to_usd !== "number" || a.fx_to_usd <= 0)
      err(`${ap}.fx_to_usd`, "must be a positive number");
    if (!Array.isArray(a.size_bands) || a.size_bands.length === 0)
      err(`${ap}.size_bands`, "must be a non-empty array");

    (a.size_bands ?? []).forEach((b, j) => {
      const bp = `${ap}.size_bands[${j}]`;
      if (!b.band || normalizeBand(b.band) === null)
        err(`${bp}.band`, `unrecognized band "${b.band}"`);
      if (!b.source) err(`${bp}.source`, "every figure needs a source");
      if (b.revenue_per_firm_local != null && b.revenue_per_firm_local <= 0)
        err(`${bp}.revenue_per_firm_local`, "must be positive when present");
      if (
        b.net_margin_pct_low != null &&
        b.net_margin_pct_high != null &&
        b.net_margin_pct_low > b.net_margin_pct_high
      )
        err(`${bp}.net_margin`, "low > high");
      for (const k of ["net_margin_pct_low", "net_margin_pct_high"] as const) {
        const v = b[k];
        if (v != null && (v < -50 || v > 90))
          warn(`${bp}.${k}`, `margin ${v}% is implausible for an SMB`);
      }
      if (b.cost_structure_pct) {
        const sum = Object.values(b.cost_structure_pct).reduce(
          (acc, v) => acc + (typeof v === "number" ? v : 0),
          0,
        );
        if (sum < 80 || sum > 120)
          warn(`${bp}.cost_structure_pct`, `sums to ${sum}%, expected ~100`);
      }
    });
  });

  return issues;
}
