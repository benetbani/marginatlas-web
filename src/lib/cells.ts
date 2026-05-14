/**
 * Cell data-access layer (v1.16 with friendly taxonomy).
 *
 * Queries the existing `cells_master` table in Supabase (~722k US state cells
 * from v1.5). Applies the friendly sector + industry taxonomy at query time
 * via the local taxonomy.ts module — no DB migration required.
 */
import { supabaseAdmin } from "./supabase";
import {
  INDUSTRY_BY_ID,
  SECTOR_BY_ID,
  naics6ToIndustry,
  slugToIndustry,
  industryToSlug,
} from "./taxonomy";

export type Cell = {
  // identity
  country: string;
  geo_id: string;
  geo_level: string;
  geo_name: string | null;
  // industry (raw + friendly)
  naics_6?: string | null;
  naics_4?: string | null;
  industry_id?: string | null;
  industry_name?: string | null;
  industry_examples?: string[] | null;
  sector_id?: string | null;
  sector_name?: string | null;
  industry_description?: string | null; // raw native description
  // size + year
  size_band: string | null;
  year: number;
  // metrics
  n_enterprises?: number | null;
  n_employees?: number | null;
  total_revenue?: number | null;
  total_revenue_usd?: number | null;
  revenue_per_firm?: number | null;
  rev_p10?: number | null;
  rev_p25?: number | null;
  rev_p50?: number | null;
  rev_p75?: number | null;
  rev_p90?: number | null;
  payroll_per_employee?: number | null;
  // quality
  quality_score?: number | null;
  coverage_tier?: string | null;
  coverage_source?: string | null;
  currency?: string | null;
};

// US state FIPS code → human name → URL slug
const US_STATES: Record<string, { name: string; slug: string }> = {
  "01": { name: "Alabama", slug: "alabama" },
  "02": { name: "Alaska", slug: "alaska" },
  "04": { name: "Arizona", slug: "arizona" },
  "05": { name: "Arkansas", slug: "arkansas" },
  "06": { name: "California", slug: "california" },
  "08": { name: "Colorado", slug: "colorado" },
  "09": { name: "Connecticut", slug: "connecticut" },
  "10": { name: "Delaware", slug: "delaware" },
  "11": { name: "District of Columbia", slug: "district-of-columbia" },
  "12": { name: "Florida", slug: "florida" },
  "13": { name: "Georgia", slug: "georgia" },
  "15": { name: "Hawaii", slug: "hawaii" },
  "16": { name: "Idaho", slug: "idaho" },
  "17": { name: "Illinois", slug: "illinois" },
  "18": { name: "Indiana", slug: "indiana" },
  "19": { name: "Iowa", slug: "iowa" },
  "20": { name: "Kansas", slug: "kansas" },
  "21": { name: "Kentucky", slug: "kentucky" },
  "22": { name: "Louisiana", slug: "louisiana" },
  "23": { name: "Maine", slug: "maine" },
  "24": { name: "Maryland", slug: "maryland" },
  "25": { name: "Massachusetts", slug: "massachusetts" },
  "26": { name: "Michigan", slug: "michigan" },
  "27": { name: "Minnesota", slug: "minnesota" },
  "28": { name: "Mississippi", slug: "mississippi" },
  "29": { name: "Missouri", slug: "missouri" },
  "30": { name: "Montana", slug: "montana" },
  "31": { name: "Nebraska", slug: "nebraska" },
  "32": { name: "Nevada", slug: "nevada" },
  "33": { name: "New Hampshire", slug: "new-hampshire" },
  "34": { name: "New Jersey", slug: "new-jersey" },
  "35": { name: "New Mexico", slug: "new-mexico" },
  "36": { name: "New York", slug: "new-york" },
  "37": { name: "North Carolina", slug: "north-carolina" },
  "38": { name: "North Dakota", slug: "north-dakota" },
  "39": { name: "Ohio", slug: "ohio" },
  "40": { name: "Oklahoma", slug: "oklahoma" },
  "41": { name: "Oregon", slug: "oregon" },
  "42": { name: "Pennsylvania", slug: "pennsylvania" },
  "44": { name: "Rhode Island", slug: "rhode-island" },
  "45": { name: "South Carolina", slug: "south-carolina" },
  "46": { name: "South Dakota", slug: "south-dakota" },
  "47": { name: "Tennessee", slug: "tennessee" },
  "48": { name: "Texas", slug: "texas" },
  "49": { name: "Utah", slug: "utah" },
  "50": { name: "Vermont", slug: "vermont" },
  "51": { name: "Virginia", slug: "virginia" },
  "53": { name: "Washington", slug: "washington" },
  "54": { name: "West Virginia", slug: "west-virginia" },
  "55": { name: "Wisconsin", slug: "wisconsin" },
  "56": { name: "Wyoming", slug: "wyoming" },
};

const SLUG_TO_GEO_ID: Record<string, string> = Object.fromEntries(
  Object.entries(US_STATES).map(([fips, v]) => [v.slug, `US-${fips}`])
);
const GEO_ID_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(US_STATES).map(([fips, v]) => [`US-${fips}`, v.name])
);

export function slugify(s: string | null | undefined): string {
  if (!s) return "";
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/** Add industry_id / industry_name / sector via taxonomy. */
function applyTaxonomy(c: Cell): Cell {
  const industryId = c.industry_id ?? naics6ToIndustry(c.naics_6);
  if (industryId) {
    const ind = INDUSTRY_BY_ID[industryId];
    if (ind) {
      c.industry_id = ind.id;
      c.industry_name = ind.name;
      c.industry_examples = ind.examples;
      c.sector_id = ind.sector_id;
      const sec = SECTOR_BY_ID[ind.sector_id];
      if (sec) c.sector_name = sec.name;
    }
  }
  return c;
}

function normalizeRow(r: Record<string, unknown>): Cell {
  const cell: Cell = {
    country: (r.country as string) || "US",
    geo_id: r.geo_id as string,
    geo_level: (r.geo_level as string) || "state",
    geo_name: GEO_ID_TO_NAME[r.geo_id as string] || (r.geo_name as string) || null,
    naics_6: r.naics_6 as string | null,
    naics_4: r.naics_4 as string | null,
    industry_description: r.industry_description as string | null,
    size_band: (r.size_band as string) || null,
    year: r.year as number,
    n_enterprises: r.n as number | null,
    n_employees: r.total_employment as number | null,
    total_revenue: r.rev_p50 && r.n ? (r.rev_p50 as number) * (r.n as number) : null,
    total_revenue_usd: r.rev_p50 && r.n ? (r.rev_p50 as number) * (r.n as number) : null,
    revenue_per_firm: r.rev_p50 as number | null,
    rev_p10: r.rev_p10 as number | null,
    rev_p25: r.rev_p25 as number | null,
    rev_p50: r.rev_p50 as number | null,
    rev_p75: r.rev_p75 as number | null,
    rev_p90: r.rev_p90 as number | null,
    payroll_per_employee: r.mean_wage_per_employee_usd as number | null,
    quality_score: r.quality_score as number | null,
    coverage_tier: r.coverage_tier as string | null,
    coverage_source: r.coverage_source as string | null,
    currency: (r.currency as string) || "USD",
  };
  return applyTaxonomy(cell);
}

export type CellSelector = {
  sizeBand?: string | null;
  year?: number | null;
};

/** Resolve a (country / geo / industry) URL slug to a single best-fit cell. */
export async function getCellBySlug(
  countrySlug: string,
  geoSlug: string,
  industrySlug: string,
  selector: CellSelector = {}
): Promise<Cell | null> {
  const country = countrySlug.toUpperCase();
  if (country !== "US") return null; // For now, only US data is in Supabase

  const geoId = SLUG_TO_GEO_ID[geoSlug.toLowerCase()];
  if (!geoId) return null;

  // First try friendly industry slug → industry_id → matching NAICS-3 prefix
  const ind = slugToIndustry(industrySlug);
  if (ind && (ind.naics_3 || []).length) {
    // Build OR-list of NAICS-3 prefixes
    const naics3Prefixes = (ind.naics_3 || []).map((n) => `${n}%`);
    let q = supabaseAdmin
      .from("cells_master")
      .select("*")
      .eq("country", "US")
      .eq("geo_id", geoId)
      .order("year", { ascending: false, nullsFirst: false })
      .order("n", { ascending: false, nullsFirst: false })
      .limit(1);
    if (selector.sizeBand) q = q.eq("size_band", selector.sizeBand);
    if (selector.year) q = q.eq("year", selector.year);
    const orClauses = naics3Prefixes.map((p) => `naics_6.like.${p}`).join(",");
    q = q.or(orClauses);
    const { data, error } = await q;
    if (!error && data && data.length > 0) {
      return normalizeRow(data[0] as Record<string, unknown>);
    }
  }

  // Fallback: fuzzy industry_description search
  const fuzzy = industrySlug.replace(/-/g, "%");
  let q2 = supabaseAdmin
    .from("cells_master")
    .select("*")
    .eq("country", "US")
    .eq("geo_id", geoId)
    .ilike("industry_description", `%${fuzzy}%`)
    .order("year", { ascending: false, nullsFirst: false })
    .order("n", { ascending: false, nullsFirst: false })
    .limit(1);
  if (selector.sizeBand) q2 = q2.eq("size_band", selector.sizeBand);
  if (selector.year) q2 = q2.eq("year", selector.year);
  const { data, error } = await q2;
  if (error || !data || data.length === 0) return null;
  return normalizeRow(data[0] as Record<string, unknown>);
}

/** All matching cells (same geo + same industry-group) across size_bands and years. */
export async function getCellVariants(
  countrySlug: string,
  geoSlug: string,
  industrySlug: string
): Promise<Cell[]> {
  const country = countrySlug.toUpperCase();
  if (country !== "US") return [];
  const geoId = SLUG_TO_GEO_ID[geoSlug.toLowerCase()];
  if (!geoId) return [];

  const ind = slugToIndustry(industrySlug);
  if (!ind || !(ind.naics_3 || []).length) return [];

  const naics3Prefixes = (ind.naics_3 || []).map((n) => `${n}%`);
  const orClauses = naics3Prefixes.map((p) => `naics_6.like.${p}`).join(",");
  const { data, error } = await supabaseAdmin
    .from("cells_master")
    .select("*")
    .eq("country", "US")
    .eq("geo_id", geoId)
    .or(orClauses)
    .order("year", { ascending: false, nullsFirst: false })
    .order("n", { ascending: false, nullsFirst: false })
    .limit(200);
  if (error || !data) return [];
  return data.map((r) => normalizeRow(r as Record<string, unknown>));
}

/** Distinct size bands present for a given (geo, industry). */
export function distinctSizeBands(cells: Cell[]): string[] {
  const seen = new Set<string>();
  for (const c of cells) if (c.size_band) seen.add(c.size_band);
  return Array.from(seen);
}

/** Distinct years present for a given (geo, industry). */
export function distinctYears(cells: Cell[]): number[] {
  const seen = new Set<number>();
  for (const c of cells) if (c.year) seen.add(c.year);
  return Array.from(seen).sort((a, b) => b - a);
}

/** All US states (for region switcher). */
export function listUsStates(): { name: string; slug: string }[] {
  return Object.values(US_STATES).sort((a, b) => a.name.localeCompare(b.name));
}

/** Top N cells globally (for sitemap + homepage features). */
export async function getTopCells(limit = 100): Promise<Cell[]> {
  const { data, error } = await supabaseAdmin
    .from("cells_master")
    .select("*")
    .eq("country", "US")
    .not("industry_description", "is", null)
    .order("total_employment", { ascending: false, nullsFirst: false })
    .limit(limit);
  if (error || !data) return [];
  return data.map((r) => normalizeRow(r as Record<string, unknown>));
}

/** Comparable cells: same state, different industries. */
export async function getComparableCells(
  state: string | null,
  excludeNaics6?: string,
  limit = 8
): Promise<Cell[]> {
  if (!state) return [];
  const fipsEntry = Object.entries(US_STATES).find(([, v]) => v.name === state);
  if (!fipsEntry) return [];
  const geoId = `US-${fipsEntry[0]}`;

  let q = supabaseAdmin
    .from("cells_master")
    .select("*")
    .eq("country", "US")
    .eq("geo_id", geoId)
    .not("industry_description", "is", null)
    .order("total_employment", { ascending: false, nullsFirst: false })
    .limit(limit);
  if (excludeNaics6) q = q.neq("naics_6", excludeNaics6);

  const { data, error } = await q;
  if (error || !data) return [];
  return data.map((r) => normalizeRow(r as Record<string, unknown>));
}

/** Build URL from a Cell. */
export function cellUrl(c: Cell): string {
  const country = c.country.toLowerCase();
  const geoSlug = c.geo_name ? slugify(c.geo_name) : "";
  const industrySlug = c.industry_id
    ? industryToSlug(c.industry_id)
    : slugify(c.industry_description || c.naics_6 || "");
  return `/${country}/${geoSlug}/${industrySlug}`;
}
