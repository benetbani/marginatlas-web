/**
 * Cell data-access layer.
 *
 * Queries the existing `cells_master` table in Supabase (already loaded from
 * the v1.5 build — ~722k US state cells). Falls back to alternative names
 * if the primary schema doesn't match.
 *
 * Production schema (cells_master columns):
 *   country, geo_id, geo_level, naics_6, naics_4, naics_3, naics_2, nace_4,
 *   isic_4, industry_description, size_band, year, coverage_tier,
 *   coverage_source, n, rev_p10..p90, emp_per_firm_mean,
 *   payroll_per_firm_mean_usd, mean_wage_per_employee_usd, total_employment,
 *   total_payroll_usd, quality_score, fit_method, currency, commentary
 */
import { supabaseAdmin } from "./supabase";

export type Cell = {
  country: string;
  geo_id: string;
  geo_level: string;
  geo_name: string | null;
  naics_6?: string | null;
  naics_4?: string | null;
  naics_2digit?: string | null;
  industry_description?: string | null;
  size_band: string | null;
  year: number;
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

// Slug → geo_id reverse lookup
const SLUG_TO_GEO_ID: Record<string, string> = Object.fromEntries(
  Object.entries(US_STATES).map(([fips, v]) => [v.slug, `US-${fips}`])
);

const GEO_ID_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(US_STATES).map(([fips, v]) => [`US-${fips}`, v.name])
);

/** Slugify a name for URL use. */
export function slugify(s: string | null | undefined): string {
  if (!s) return "";
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Normalize a raw cells_master row into our Cell type. */
function normalizeRow(r: any): Cell {
  return {
    country: r.country || "US",
    geo_id: r.geo_id,
    geo_level: r.geo_level || "state",
    geo_name: GEO_ID_TO_NAME[r.geo_id] || r.geo_name || null,
    naics_6: r.naics_6,
    naics_4: r.naics_4,
    naics_2digit: r.naics_2,
    industry_description: r.industry_description,
    size_band: r.size_band,
    year: r.year,
    n_enterprises: r.n,
    n_employees: r.total_employment,
    total_revenue: r.rev_p50 && r.n ? r.rev_p50 * r.n : null,
    total_revenue_usd: r.rev_p50 && r.n ? r.rev_p50 * r.n : null,
    revenue_per_firm: r.rev_p50,
    rev_p10: r.rev_p10,
    rev_p25: r.rev_p25,
    rev_p50: r.rev_p50,
    rev_p75: r.rev_p75,
    rev_p90: r.rev_p90,
    payroll_per_employee: r.mean_wage_per_employee_usd,
    quality_score: r.quality_score,
    coverage_tier: r.coverage_tier,
    coverage_source: r.coverage_source,
    currency: r.currency || "USD",
  };
}

/** Resolve a (country-slug, geo-slug, industry-slug) URL to a cells_master row. */
export async function getCellBySlug(
  countrySlug: string,
  geoSlug: string,
  industrySlug: string
): Promise<Cell | null> {
  const country = countrySlug.toUpperCase();
  if (country !== "US") return null; // For now, only US works on free tier

  const geoId = SLUG_TO_GEO_ID[geoSlug.toLowerCase()];
  if (!geoId) return null;

  // Industry slug must fuzzy-match `industry_description`. We turn "restaurants"
  // into a wildcard search.
  const fuzzy = industrySlug.replace(/-/g, "%");

  const { data, error } = await supabaseAdmin
    .from("cells_master")
    .select("*")
    .eq("country", "US")
    .eq("geo_id", geoId)
    .ilike("industry_description", `%${fuzzy}%`)
    .order("year", { ascending: false, nullsFirst: false })
    .order("n", { ascending: false, nullsFirst: false })
    .limit(1);

  if (error) {
    console.error("[cells] getCellBySlug error:", error.message);
    return null;
  }
  if (!data || data.length === 0) return null;
  return normalizeRow(data[0]);
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
  if (error) {
    console.error("[cells] getTopCells error:", error.message);
    return [];
  }
  if (!data) return [];
  return data.map(normalizeRow);
}

/** Comparable cells: same state, different industries. */
export async function getComparableCells(
  state: string | null,
  excludeNaics6?: string,
  limit = 8
): Promise<Cell[]> {
  if (!state) return [];
  // Resolve state name back to geo_id
  const stateGeoId = Object.entries(GEO_ID_TO_NAME).find(
    ([_, name]) => name === state
  )?.[0];
  if (!stateGeoId) return [];

  let q = supabaseAdmin
    .from("cells_master")
    .select("*")
    .eq("country", "US")
    .eq("geo_id", stateGeoId)
    .not("industry_description", "is", null)
    .order("total_employment", { ascending: false, nullsFirst: false })
    .limit(limit);
  if (excludeNaics6) q = q.neq("naics_6", excludeNaics6);
  const { data, error } = await q;
  if (error) return [];
  if (!data) return [];
  return data.map(normalizeRow);
}
