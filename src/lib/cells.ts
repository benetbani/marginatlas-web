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
  resolveToMeasuredIndustry,
} from "./taxonomy";
import { iso2ToIso3, iso3ToIso2, iso2ToName } from "./countries";

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

  // Non-US: fall through to extrapolated_cells (Phase F data).
  if (country !== "US") {
    return getExtrapolatedCell(country, industrySlug, selector);
  }

  const geoId = SLUG_TO_GEO_ID[geoSlug.toLowerCase()];
  if (!geoId) return null;

  // First try friendly industry slug → industry_id → matching NAICS-3 prefix.
  // Sub-niche industries (parent_id set) resolve up to the parent's NAICS-3,
  // since the sub-niche itself isn't in the raw US cell data.
  const rawInd = slugToIndustry(industrySlug);
  const ind = resolveToMeasuredIndustry(rawInd);
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
  if (country !== "US") return getExtrapolatedVariants(country, industrySlug);
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

export type TimePoint = {
  year: number;
  revenue_per_firm: number | null;
  n_enterprises: number | null;
  n_employees: number | null;
  payroll_per_employee: number | null;
};

/**
 * Collapse variants into a one-row-per-year time series — picks the row
 * with the largest n_enterprises in each year (proxy for the "all sizes"
 * aggregate when a true total row is not present).
 */
export function buildTimeSeries(cells: Cell[]): TimePoint[] {
  const byYear = new Map<number, Cell>();
  for (const c of cells) {
    if (!c.year) continue;
    const prev = byYear.get(c.year);
    if (!prev || (c.n_enterprises ?? 0) > (prev.n_enterprises ?? 0)) {
      byYear.set(c.year, c);
    }
  }
  return Array.from(byYear.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, c]) => ({
      year,
      revenue_per_firm: c.revenue_per_firm ?? null,
      n_enterprises: c.n_enterprises ?? null,
      n_employees: c.n_employees ?? null,
      payroll_per_employee: c.payroll_per_employee ?? null,
    }));
}

/** All US states (for region switcher). */
export function listUsStates(): { name: string; slug: string }[] {
  return Object.values(US_STATES).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Top industries for a country — used by the country landing page.
 * For US: queries cells_master, groups by NAICS-3 prefix → industry_id.
 * For non-US: queries extrapolated_cells, groups by industry_id.
 * Returns up to `limit` industries ordered by relevant size signal.
 */
export type TopIndustryRow = {
  industry_id: string;
  industry_name: string;
  revenue_per_firm: number | null;
  n_enterprises: number | null;
};

export async function getTopIndustriesForCountry(
  iso2: string,
  limit = 12
): Promise<TopIndustryRow[]> {
  const country = iso2.toUpperCase();
  if (country === "US") {
    const { data, error } = await supabaseAdmin
      .from("cells_master")
      .select("naics_6, n, rev_p50")
      .eq("country", "US")
      .not("naics_6", "is", null)
      .order("n", { ascending: false, nullsFirst: false })
      .limit(1500);
    if (error || !data) return [];
    const byIndustry = new Map<string, { n: number; rev: number; count: number }>();
    for (const r of data) {
      const naics = (r.naics_6 as string) || "";
      const indId = naics6ToIndustry(naics);
      if (!indId) continue;
      const cur = byIndustry.get(indId) || { n: 0, rev: 0, count: 0 };
      cur.n += (r.n as number) || 0;
      cur.rev += (r.rev_p50 as number) || 0;
      cur.count += 1;
      byIndustry.set(indId, cur);
    }
    const rows: TopIndustryRow[] = [];
    for (const [indId, v] of byIndustry.entries()) {
      const ind = INDUSTRY_BY_ID[indId];
      if (!ind) continue;
      const a = ind.audience || "smb_friendly";
      if (a !== "smb_core" && a !== "smb_friendly") continue;
      rows.push({
        industry_id: indId,
        industry_name: ind.name,
        revenue_per_firm: v.count > 0 ? v.rev / v.count : null,
        n_enterprises: v.n,
      });
    }
    rows.sort((a, b) => (b.n_enterprises ?? 0) - (a.n_enterprises ?? 0));
    return rows.slice(0, limit);
  }

  // Non-US: query extrapolated_cells
  const iso3 = iso2ToIso3(country);
  if (!iso3) return [];
  const { data, error } = await supabaseAdmin
    .from("extrapolated_cells")
    .select("industry_id, predicted_rev_per_firm")
    .eq("country_iso3", iso3)
    .order("predicted_rev_per_firm", { ascending: false, nullsFirst: false })
    .limit(200);
  if (error || !data) return [];
  const seen = new Map<string, number>();
  for (const r of data) {
    const id = r.industry_id as string;
    const rev = (r.predicted_rev_per_firm as number) || 0;
    if (!seen.has(id) || (seen.get(id) || 0) < rev) seen.set(id, rev);
  }
  const rows: TopIndustryRow[] = [];
  for (const [id, rev] of seen.entries()) {
    const ind = INDUSTRY_BY_ID[id];
    if (!ind) continue;
    const a = ind.audience || "smb_friendly";
    if (a !== "smb_core" && a !== "smb_friendly") continue;
    rows.push({
      industry_id: id,
      industry_name: ind.name,
      revenue_per_firm: rev,
      n_enterprises: null,
    });
  }
  return rows.slice(0, limit);
}

/**
 * Pick a stronger-coverage neighbor cell for the nudge bar.
 * Returns a "go here instead" target when the current cell has poor data,
 * or null when the current cell is fine.
 */
export async function getNudgeNeighbor(
  current: Cell
): Promise<{ url: string; geo_name: string; country: string } | null> {
  // Only nudge when quality is low or n_enterprises is missing/very small.
  const qual = current.quality_score ?? 50;
  const tiny = (current.n_enterprises ?? 0) < 100;
  if (qual >= 50 && !tiny) return null;
  if (!current.industry_id) return null;
  const indSlug = industryToSlug(current.industry_id);

  // Find the cell for the same industry with the largest n_enterprises across
  // covered geos (US states first, then countries via extrapolated_cells).
  const ind = INDUSTRY_BY_ID[current.industry_id];
  if (!ind) return null;
  const naics3 = ind.naics_3 || [];
  if (naics3.length === 0) return null;
  const orClauses = naics3.map((p) => `naics_6.like.${p}%`).join(",");
  const { data, error } = await supabaseAdmin
    .from("cells_master")
    .select("geo_id, n, rev_p50")
    .eq("country", "US")
    .or(orClauses)
    .order("n", { ascending: false, nullsFirst: false })
    .limit(5);
  if (error || !data || data.length === 0) return null;
  const top = data[0];
  const geoId = (top.geo_id as string) || "";
  if (!geoId.startsWith("US-") || geoId === current.geo_id) return null;
  const fips = geoId.slice(3);
  const stateRow = US_STATES[fips];
  if (!stateRow) return null;
  return {
    url: `/us/${stateRow.slug}/${indSlug}`,
    geo_name: stateRow.name,
    country: "US",
  };
}

/**
 * Same industry across other countries — for non-US cell pages and country
 * landing pages. Returns top N highest-revenue cells matching the same
 * industry across all covered countries (extrapolated_cells table).
 */
export async function getSameIndustryAcrossCountries(
  industrySlug: string,
  excludeIso2: string,
  limit = 10
): Promise<Cell[]> {
  const rawInd = slugToIndustry(industrySlug);
  const ind = resolveToMeasuredIndustry(rawInd);
  if (!ind) return [];
  const excludeIso3 = iso2ToIso3(excludeIso2) || "";
  let q = supabaseAdmin
    .from("extrapolated_cells")
    .select("*")
    .eq("industry_id", ind.id)
    .order("predicted_rev_per_firm", { ascending: false, nullsFirst: false })
    .limit(limit + 1);
  if (excludeIso3) q = q.neq("country_iso3", excludeIso3);
  const { data, error } = await q;
  if (error || !data) return [];

  return data.slice(0, limit).map((r) => {
    const iso3 = (r.country_iso3 as string) || "";
    const iso2 = iso3ToIso2(iso3) || iso3.slice(0, 2);
    const predRev = (r.predicted_rev_per_firm as number) ?? null;
    const cell: Cell = {
      country: iso2,
      geo_id: iso3,
      geo_level: "country",
      geo_name: (r.country_name as string) || iso2,
      naics_6: null,
      industry_id: ind.id,
      industry_name: ind.name,
      industry_description: ind.name,
      size_band: (r.size_band as string) || null,
      year: (r.year as number) || 2024,
      n_enterprises: null,
      revenue_per_firm: predRev,
      rev_p50: predRev,
      quality_score: (r.quality_score as number) || 40,
      coverage_tier: (r.coverage_tier as string) || "X",
      coverage_source: (r.coverage_source as string) || "Estimated from regional patterns",
      currency: "USD",
    };
    return applyTaxonomy(cell);
  });
}

/** Extrapolated variants — all size bands / years for a (country, industry). */
export async function getExtrapolatedVariants(
  iso2: string,
  industrySlug: string
): Promise<Cell[]> {
  const iso3 = iso2ToIso3(iso2);
  if (!iso3) return [];
  const ind = slugToIndustry(industrySlug);
  if (!ind) return [];
  const { data, error } = await supabaseAdmin
    .from("extrapolated_cells")
    .select("*")
    .eq("country_iso3", iso3)
    .eq("industry_id", ind.id)
    .order("year", { ascending: false, nullsFirst: false })
    .limit(50);
  if (error || !data) return [];
  return data.map((r) => {
    const predRev = (r.predicted_rev_per_firm as number) ?? null;
    const cell: Cell = {
      country: iso2.toUpperCase(),
      geo_id: iso3,
      geo_level: "country",
      geo_name: (r.country_name as string) || iso2ToName(iso2),
      naics_6: null,
      naics_4: null,
      industry_id: ind.id,
      industry_description: ind.name,
      size_band: (r.size_band as string) || null,
      year: (r.year as number) || 2024,
      n_enterprises: null,
      n_employees: null,
      revenue_per_firm: predRev,
      rev_p50: predRev,
      quality_score: (r.quality_score as number) || 40,
      coverage_tier: (r.coverage_tier as string) || "X",
      coverage_source: (r.coverage_source as string) || "Estimated from regional patterns",
      currency: "USD",
    };
    return applyTaxonomy(cell);
  });
}

/**
 * Read a country-level extrapolated cell. Maps the friendly industry slug
 * to industry_id, the iso2 country code to iso3, and pulls the row from
 * extrapolated_cells. Returns a Cell-shaped object so the rest of the
 * cell page can render it without special-casing.
 *
 * Note: extrapolated_cells holds a single point estimate (predicted_rev_per_firm),
 * not a distribution. We synthesize a coarse spread (±50%) around the point
 * estimate so the histogram + DistributionBars still render meaningfully.
 * The synthesized spread is clearly marked "estimated" via coverage_tier=X
 * and quality_score=40, so the UI shows a 2-star quality badge.
 */
export async function getExtrapolatedCell(
  iso2: string,
  industrySlug: string,
  selector: CellSelector = {}
): Promise<Cell | null> {
  const iso3 = iso2ToIso3(iso2);
  if (!iso3) return null;
  // Same parent-fallback policy as US: sub-niches resolve up to their parent.
  const rawInd = slugToIndustry(industrySlug);
  const ind = resolveToMeasuredIndustry(rawInd);
  if (!ind) return null;

  let q = supabaseAdmin
    .from("extrapolated_cells")
    .select("*")
    .eq("country_iso3", iso3)
    .eq("industry_id", ind.id)
    .order("year", { ascending: false, nullsFirst: false })
    .limit(1);
  if (selector.sizeBand) q = q.eq("size_band", selector.sizeBand);
  if (selector.year) q = q.eq("year", selector.year);

  const { data, error } = await q;
  if (error || !data || data.length === 0) return null;
  const r = data[0] as Record<string, unknown>;

  const predRev = (r.predicted_rev_per_firm as number) ?? null;
  // Coarse spread synthesis: ±50% wedge so DistributionBars/Histogram render
  // something rather than five identical bars. Clearly flagged via quality.
  const p10 = predRev != null ? predRev * 0.4 : null;
  const p25 = predRev != null ? predRev * 0.65 : null;
  const p50 = predRev;
  const p75 = predRev != null ? predRev * 1.45 : null;
  const p90 = predRev != null ? predRev * 2.1 : null;

  const cell: Cell = {
    country: iso2.toUpperCase(),
    geo_id: iso3,
    geo_level: "country",
    geo_name: (r.country_name as string) || iso2ToName(iso2),
    naics_6: null,
    naics_4: null,
    industry_id: ind.id,
    industry_description: ind.name,
    size_band: (r.size_band as string) || null,
    year: (r.year as number) || 2024,
    n_enterprises: null,
    n_employees: null,
    total_revenue: null,
    total_revenue_usd: null,
    revenue_per_firm: predRev,
    rev_p10: p10,
    rev_p25: p25,
    rev_p50: p50,
    rev_p75: p75,
    rev_p90: p90,
    payroll_per_employee: null,
    quality_score: (r.quality_score as number) || 40,
    coverage_tier: (r.coverage_tier as string) || "X",
    coverage_source: (r.coverage_source as string) || "Estimated from regional patterns",
    currency: "USD",
  };
  return applyTaxonomy(cell);
}

/**
 * Same industry, different states — for the "How this industry compares
 * across the country" strip. Returns up to N highest-employment cells
 * matching the same NAICS-3 prefixes as the focus industry.
 */
export async function getSameIndustryAcrossStates(
  industrySlug: string,
  excludeGeoId: string,
  limit = 10
): Promise<Cell[]> {
  // Only meaningful when the caller is on a US-state cell. The excludeGeoId
  // for US cells is "US-XX" (XX = FIPS); for extrapolated non-US cells it's
  // the iso3 (e.g. "DEU"). Short-circuit anything else.
  if (!excludeGeoId.startsWith("US-")) return [];
  const ind = slugToIndustry(industrySlug);
  if (!ind || !(ind.naics_3 || []).length) return [];
  const naics3Prefixes = (ind.naics_3 || []).map((n) => `${n}%`);
  const orClauses = naics3Prefixes.map((p) => `naics_6.like.${p}`).join(",");

  // Pull a bunch (Supabase can't dedupe by state in one call), then collapse client-side.
  const { data, error } = await supabaseAdmin
    .from("cells_master")
    .select("*")
    .eq("country", "US")
    .neq("geo_id", excludeGeoId)
    .or(orClauses)
    .order("year", { ascending: false, nullsFirst: false })
    .order("n", { ascending: false, nullsFirst: false })
    .limit(800);
  if (error || !data) return [];

  const rows = data.map((r) => normalizeRow(r as Record<string, unknown>));
  // Collapse to one row per state, keep highest-n
  const byState = new Map<string, Cell>();
  for (const c of rows) {
    if (!c.geo_id) continue;
    const prev = byState.get(c.geo_id);
    if (!prev || (c.n_enterprises ?? 0) > (prev.n_enterprises ?? 0)) {
      byState.set(c.geo_id, c);
    }
  }
  return Array.from(byState.values())
    .sort((a, b) => (b.n_enterprises ?? 0) - (a.n_enterprises ?? 0))
    .slice(0, limit);
}

/**
 * Sector-level rank: how does this industry compare to other industries
 * in the same state by firm count? Returns { rank, total, totalEnterprises }.
 */
export async function getIndustryRankInState(
  geoId: string,
  currentNaics6: string | null
): Promise<{ rank: number; total: number } | null> {
  if (!geoId || !currentNaics6) return null;
  const { data, error } = await supabaseAdmin
    .from("cells_master")
    .select("naics_6, n")
    .eq("country", "US")
    .eq("geo_id", geoId)
    .not("naics_6", "is", null)
    .order("n", { ascending: false, nullsFirst: false })
    .limit(2000);
  if (error || !data) return null;
  // Collapse to one row per NAICS-6 (largest n)
  const byNaics = new Map<string, number>();
  for (const r of data) {
    const code = (r.naics_6 as string) || "";
    const n = (r.n as number) || 0;
    if (!byNaics.has(code) || (byNaics.get(code) || 0) < n) {
      byNaics.set(code, n);
    }
  }
  const sorted = Array.from(byNaics.entries()).sort((a, b) => b[1] - a[1]);
  const idx = sorted.findIndex(([code]) => code === currentNaics6);
  if (idx < 0) return null;
  return { rank: idx + 1, total: sorted.length };
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
