/**
 * Plan v26 Phase B — neighborhood data layer.
 *
 * Loads the neighborhood scheme (data/cities/neighborhoods_v1.json) and
 * character multiplier table (data/cities/character_multipliers_v1.json),
 * exposes:
 *
 *   getNeighborhoodsForCity(citySlug) → Neighborhood[] | null
 *   getNeighborhood(citySlug, neighborhoodSlug) → Neighborhood | null
 *   getMultiplier(industryId, character) → { revenue, firms }
 *   applyNeighborhoodMultiplier(cell, industryId, character) → Cell
 *
 * Resolution chain at route render time:
 *   1. Look up the city in neighborhoods_v1.json
 *   2. Resolve the neighborhood from the URL slug → character
 *   3. Look up city-level cell via getCellBySlug (existing chain)
 *   4. Apply (industry, character) multiplier
 *   5. Re-enforce SMB-physical bounds + common-sense math
 *
 * RAM-bounded (D-055 / 600 MB cap): the JSON files are small (single
 * digit KB), inlined into the bundle at import time, no Supabase
 * queries here.
 */
import neighborhoodsJson from "../../../data/cities/neighborhoods_v1.json";
import multipliersJson from "../../../data/cities/character_multipliers_v1.json";
import type { Cell } from "../cells";
import {
  REVENUE_PER_FIRM_BOUNDS,
  DEFAULT_REVENUE_BOUNDS,
} from "../qa/smb_bounds";

export type NeighborhoodCharacter =
  | "central-business"
  | "affluent-residential"
  | "mid-residential"
  | "working-residential"
  | "industrial"
  | "tourist"
  | "mixed-urban"
  | "academic";

export type Neighborhood = {
  slug: string;
  name: string;
  character: NeighborhoodCharacter;
  description?: string;
};

type CityScheme = {
  scheme: "α-macro" | "β-subdivisions" | "γ-none";
  neighborhoods: Neighborhood[];
};

type NeighborhoodsFile = {
  cities: Record<string, CityScheme>;
};

type Multiplier = { revenue: number; firms: number };

type MultipliersFile = {
  default_per_character: Record<NeighborhoodCharacter, Multiplier>;
  industries: Record<string, Partial<Record<NeighborhoodCharacter, Multiplier>>>;
};

const NEIGHBORHOODS = neighborhoodsJson as unknown as NeighborhoodsFile;
const MULTIPLIERS = multipliersJson as unknown as MultipliersFile;

/**
 * Get the full neighborhood list for a city. Returns null if the city
 * doesn't have a neighborhood scheme defined (Tier 3 cities, or any
 * city without an entry in neighborhoods_v1.json).
 */
export function getNeighborhoodsForCity(
  citySlug: string,
): Neighborhood[] | null {
  const slug = citySlug.toLowerCase();
  const city = NEIGHBORHOODS.cities[slug];
  if (!city) return null;
  return city.neighborhoods;
}

/**
 * Look up a single neighborhood by (city, neighborhood) slug pair.
 * Returns null if either is missing.
 */
export function getNeighborhood(
  citySlug: string,
  neighborhoodSlug: string,
): Neighborhood | null {
  const list = getNeighborhoodsForCity(citySlug);
  if (!list) return null;
  return (
    list.find((n) => n.slug === neighborhoodSlug.toLowerCase()) || null
  );
}

/**
 * Resolve the (industry, character) multiplier. Falls back to the
 * per-character default if the industry isn't explicitly mapped.
 */
export function getMultiplier(
  industryId: string,
  character: NeighborhoodCharacter,
): Multiplier {
  const industryMap = MULTIPLIERS.industries[industryId];
  const fromIndustry = industryMap?.[character];
  if (fromIndustry) return fromIndustry;
  return (
    MULTIPLIERS.default_per_character[character] || {
      revenue: 1.0,
      firms: 1.0,
    }
  );
}

/**
 * Apply the neighborhood-character multiplier to a city-level cell.
 * Returns a NEW cell — does not mutate the input. Scales revenue,
 * percentiles, and n_enterprises. Payroll and employees stay flat
 * (wage doesn't vary by neighborhood; employees-per-firm is a
 * structural measure).
 *
 * SMB-bound enforcement: scaled revenue is clamped back into the
 * per-industry bounds so a 1.5x multiplier on an already-high cell
 * doesn't blow past the SMB envelope.
 */
export function applyNeighborhoodMultiplier(
  cell: Cell,
  industryId: string,
  character: NeighborhoodCharacter,
): Cell {
  const m = getMultiplier(industryId, character);
  const out: Cell = { ...cell };
  const bounds =
    REVENUE_PER_FIRM_BOUNDS[industryId] || DEFAULT_REVENUE_BOUNDS;

  // Clamp helper
  const clamp = (v: number | null | undefined) => {
    if (v == null) return v;
    const scaled = v * m.revenue;
    return Math.max(bounds.lo, Math.min(bounds.hi, scaled));
  };

  out.revenue_per_firm = clamp(cell.revenue_per_firm) ?? cell.revenue_per_firm;
  out.rev_p10 = clamp(cell.rev_p10) ?? cell.rev_p10;
  out.rev_p25 = clamp(cell.rev_p25) ?? cell.rev_p25;
  out.rev_p50 = clamp(cell.rev_p50) ?? cell.rev_p50;
  out.rev_p75 = clamp(cell.rev_p75) ?? cell.rev_p75;
  out.rev_p90 = clamp(cell.rev_p90) ?? cell.rev_p90;

  if (out.n_enterprises != null) {
    out.n_enterprises = Math.max(
      1,
      Math.round(out.n_enterprises * m.firms),
    );
  }

  // Recompute derived profits from new revenue.
  if (out.revenue_per_firm != null) {
    if (out.gross_margin != null)
      out.gross_profit = out.revenue_per_firm * out.gross_margin;
    if (out.operating_margin != null)
      out.operating_profit = out.revenue_per_firm * out.operating_margin;
    if (out.net_margin != null)
      out.net_profit = out.revenue_per_firm * out.net_margin;
  }

  return out;
}
