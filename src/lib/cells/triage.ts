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
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type TriageEntry = {
  key: string;
  country: string;
  geo_id: string;
  industry_id: string;
  field: string;
  value: number;
  severity: number;
  decision: "suppress" | "override" | "keep" | "review";
  decided_by: "auto" | "founder";
  reasoning: string;
  override_value?: number;
  timestamp: string;
};

type CellShape = {
  revenue_per_firm?: number | null;
  rev_p50?: number | null;
  payroll_per_employee?: number | null;
  n_employees?: number | null;
  n_enterprises?: number | null;
  [k: string]: unknown;
};

const TRIAGE_PATH = resolve(process.cwd(), "data", "quality", "cell_triage_v1.json");

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
  try {
    const raw = readFileSync(TRIAGE_PATH, "utf-8");
    const data = JSON.parse(raw) as { entries: TriageEntry[] };
    for (const e of data.entries) {
      const triple = `${e.country}|${e.geo_id}|${e.industry_id}`;
      if (e.decision === "suppress") {
        suppressed.add(triple);
      } else if (e.decision === "override" && e.override_value != null) {
        if (!overrides.has(triple)) overrides.set(triple, []);
        overrides.get(triple)!.push({ field: e.field, value: e.override_value });
      }
    }
  } catch {
    // No triage file — zero suppressions, zero overrides
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
