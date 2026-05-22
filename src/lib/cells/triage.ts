/**
 * Plan v24 Block 1.4 — render-layer triage application.
 *
 * Reads data/quality/cell_triage_v1.json and exposes two helpers:
 *
 *   isCellSuppressed(country, geoId, industryId, field?)
 *     → true if any decision for that key is "suppress"
 *
 *   applyCellOverrides(country, geoId, industryId, cell)
 *     → mutates fields the triage table has explicit overrides for
 *
 * Loaded once at module init. Honest about the file being missing —
 * dev environments without the triage JSON get zero suppressions.
 */
// Plan v24 Block 11 — JSON-import the triage decisions (was previously
// fs-read which broke the Edge runtime build).
//
// Plan v26 P4 — use the SLIMMED file (cell_triage_slim_v1.json) that
// contains only suppress + override entries. The full file had 6156
// entries × ~450 bytes each = 2.8 MB; the slim version has 119
// actionable entries × ~130 bytes = 15.7 KB. The original 2.8 MB
// import was the root cause of the /og/cell Edge bundle hitting the
// 1 MB Vercel Hobby cap. The slim file is small enough that bundling
// it into every server function is irrelevant.
import triageJson from "../../../data/quality/cell_triage_slim_v1.json";

// Plan v26 P4 — slim file shape. Only fields the runtime needs.
type TriageEntry = {
  country: string;
  geo_id: string;
  industry_id: string;
  decision: "suppress" | "override";
  field?: string;
  override_value?: number;
};

type CellShape = {
  revenue_per_firm?: number | null;
  rev_p50?: number | null;
  payroll_per_employee?: number | null;
  n_employees?: number | null;
  n_enterprises?: number | null;
  [k: string]: unknown;
};

type LoadedTriage = {
  // (country, geoId, industryId) → keep-the-cell flag (true if any field is suppressed)
  suppressed: Set<string>;
  // (country, geoId, industryId) → [{ field, override_value }]
  overrides: Map<string, Array<{ field: string; value: number }>>;
};

let cache: LoadedTriage | undefined;

function load(): LoadedTriage {
  if (cache) return cache;
  const suppressed = new Set<string>();
  const overrides = new Map<string, Array<{ field: string; value: number }>>();
  const raw = (triageJson as unknown as { entries?: TriageEntry[] }).entries ?? [];
  for (const e of raw) {
    const triple = `${e.country}|${e.geo_id}|${e.industry_id}`;
    if (e.decision === "suppress") {
      suppressed.add(triple);
    } else if (e.decision === "override" && e.override_value != null && e.field) {
      if (!overrides.has(triple)) overrides.set(triple, []);
      overrides.get(triple)!.push({ field: e.field, value: e.override_value });
    }
  }
  cache = { suppressed, overrides };
  return cache;
}

/**
 * Returns true if the cell at (country, geo_id, industry_id) should be
 * suppressed entirely (return null from getCellBySlug). Used in
 * normalizeRegionalRow and getRegionalCell.
 */
export function isCellSuppressed(
  country: string | null | undefined,
  geoId: string | null | undefined,
  industryId: string | null | undefined,
): boolean {
  if (!country || !geoId || !industryId) return false;
  const triple = `${country.toUpperCase()}|${geoId}|${industryId}`;
  return load().suppressed.has(triple);
}

/**
 * Applies field-level overrides to a cell. Returns a new object with the
 * override values applied. No-op if the cell has no triage entries.
 */
export function applyCellOverrides<T extends CellShape>(
  country: string | null | undefined,
  geoId: string | null | undefined,
  industryId: string | null | undefined,
  cell: T,
): T {
  if (!country || !geoId || !industryId) return cell;
  const triple = `${country.toUpperCase()}|${geoId}|${industryId}`;
  const entries = load().overrides.get(triple);
  if (!entries || entries.length === 0) return cell;
  const out: T = { ...cell };
  for (const { field, value } of entries) {
    (out as Record<string, unknown>)[field] = value;
  }
  return out;
}

/** For diagnostics: count of suppressions loaded. */
export function suppressionCount(): number {
  return load().suppressed.size;
}
