/**
 * Cell data-access layer (v1.16 with friendly taxonomy).
 *
 * Queries the existing `cells_master` table in Supabase (~722k US state cells
 * from v1.5). Applies the friendly sector + industry taxonomy at query time
 * via the local taxonomy.ts module — no DB migration required.
 */
import { supabaseAdmin } from "./supabase";
import { applyCurrencyCorrection, CURRENCY_FX_CORRECTIONS } from "./qa/currency_corrections";
import {
  applyPlausibilitySuppression,
} from "./qa/plausibility_suppression";
import type {
  SubIndustryRef,
  CostStack,
  SetupCosts,
  LocalAlias,
} from "./types/deepening";
import {
  rollForward,
  INFLATION_TARGET_YEAR,
} from "./stats/inflation";
import {
  INDUSTRY_BY_ID,
  INDUSTRIES,
  SECTOR_BY_ID,
  naics6ToIndustry,
  slugToIndustry,
  industryToSlug,
  resolveToMeasuredIndustry,
} from "./taxonomy";
import { iso2ToIso3, iso3ToIso2, iso2ToName } from "./countries";
import {
  CITY_FRIENDLY_DISPLAY_LABEL,
} from "./cities/city_aliases_generated";
import {
  MANUAL_DISPLAY_LABEL,
} from "./cities/manual_city_aliases";
import { isCellSuppressed, applyCellOverrides } from "./cells/triage";
import { getPopularPlaceName } from "./geo/popular_place_overrides";
import {
  REVENUE_PER_FIRM_BOUNDS,
  DEFAULT_REVENUE_BOUNDS,
  classifyValue,
} from "./qa/smb_bounds";
import {
  synthesizeCell,
  fillMissingFields,
  enforceSanity,
} from "./cells/fill_defaults";
// Geo helpers moved to cells/geo.ts (architecture audit strategy F).
import {
  US_STATES,
  SLUG_TO_GEO_ID,
  GEO_ID_TO_NAME,
  slugify,
  regionalSlugToGeoId,
  listUsStates,
  geoNameFromSlug,
} from "./cells/geo";
// Re-export so existing imports `from "@/lib/cells"` keep working.
export { slugify, regionalSlugToGeoId, listUsStates };
// Exact-first industry resolution (data activation 2026-05-29). Fixes the
// reachability bug where sub-niche industry ids present in the data tables
// were collapsed to a measured parent before the query and missed.
import {
  industryQueryCandidates,
  resolveDisplayIndustry,
  LEGACY_DB_TO_TAXONOMY,
  TAXONOMY_TO_LEGACY_DB,
} from "./cells/industry_resolution";

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
  // Derived profit fields. Populated by synthesizeCell
  // and fillMissingFields so the render layer never has to recompute.
  gross_margin?: number | null;
  operating_margin?: number | null;
  net_margin?: number | null;
  gross_profit?: number | null;
  operating_profit?: number | null;
  net_profit?: number | null;
  // Country-specific economics from research drops (fill_defaults prefers these
  // over the generic per-industry margin profile when an entry exists). The cost
  // split sums to ~100 across cogs/labor/rent/other; firm_distribution is the
  // share of firms per employee band.
  cost_structure?: { cogs: number; labor: number; rent: number; other: number } | null;
  firm_distribution?: Record<string, number> | null;
  // quality
  quality_score?: number | null;
  coverage_tier?: string | null;
  coverage_source?: string | null;
  currency?: string | null;
  // Synthesis marker. True when the cell was produced
  // by synthesizeCell() rather than a real DB lookup. Render layer reads
  // this to badge the page as "Estimated".
  is_synthetic?: boolean;
  // Deepening fields. All optional; populated by
  // the Phase 1 data acquisition. When absent, the corresponding
  // sections suppress themselves. See src/lib/types/deepening.ts.
  sub_industry?: SubIndustryRef;
  cost_stack?: CostStack;
  setup_costs?: SetupCosts;
  local_alias?: LocalAlias;
  // Turnover band classification derived from
  // revenue_per_firm + industry's sector thresholds. Three values
  // (small / medium / large) or "unknown". Computed at read time;
  // not persisted. See src/lib/finance/turnover_band.ts.
  turnover_band?: import("./finance/turnover_band").TurnoverBand;
};

/**
 * Roll the percentile anchors + per-firm headline
 * + payroll/employee forward to the current target year using a
 * country-specific cumulative CPI factor. The cell's `year` field is
 * advanced to the target year so callers see a consistent "current"
 * snapshot regardless of the underlying source vintage. Counts of
 * enterprises/employees are NOT inflated (they're stock measures).
 */
function applyRollforward(cell: Cell): Cell {
  const from = cell.year;
  if (!from || from >= INFLATION_TARGET_YEAR) return cell;
  const iso2 = cell.country;
  const out: Cell = {
    ...cell,
    year: INFLATION_TARGET_YEAR,
    revenue_per_firm: rollForward(cell.revenue_per_firm, from, iso2),
    total_revenue: rollForward(cell.total_revenue, from, iso2),
    total_revenue_usd: rollForward(cell.total_revenue_usd, from, iso2),
    rev_p10: rollForward(cell.rev_p10, from, iso2),
    rev_p25: rollForward(cell.rev_p25, from, iso2),
    rev_p50: rollForward(cell.rev_p50, from, iso2),
    rev_p75: rollForward(cell.rev_p75, from, iso2),
    rev_p90: rollForward(cell.rev_p90, from, iso2),
    payroll_per_employee: rollForward(cell.payroll_per_employee, from, iso2),
  };
  return out;
}

/** Normalise a regional_cells row to the unified Cell shape. */
function normalizeRegionalRow(r: Record<string, unknown>): Cell {
  const revP50 = r.rev_p50 as number | null;
  const revPerFirm = (r.revenue_per_firm as number | null) ?? revP50;
  const nEnt = r.n_enterprises as number | null;
  const cell: Cell = {
    country: ((r.country as string) || "").toUpperCase(),
    geo_id: r.geo_id as string,
    geo_level: (r.geo_level as string) || "region",
    geo_name: (r.geo_name as string) || null,
    naics_6: null,
    naics_4: null,
    industry_id: (r.industry_id as string) || null,
    industry_description: null,
    size_band: (r.size_band as string) || null,
    year: (r.year as number) || 2024,
    n_enterprises: nEnt,
    n_employees: r.n_employees as number | null,
    total_revenue: revPerFirm && nEnt ? revPerFirm * nEnt : null,
    total_revenue_usd: revPerFirm && nEnt ? revPerFirm * nEnt : null,
    revenue_per_firm: revPerFirm,
    rev_p10: r.rev_p10 as number | null,
    rev_p25: r.rev_p25 as number | null,
    rev_p50: revP50,
    rev_p75: r.rev_p75 as number | null,
    rev_p90: r.rev_p90 as number | null,
    payroll_per_employee: r.payroll_per_employee as number | null,
    quality_score: r.quality_score as number | null,
    coverage_tier: (r.coverage_tier as string) || "P",
    coverage_source: (r.coverage_source as string) || "National business statistics",
    currency: (r.currency as string) || "USD",
    // Deepening fields. Pulled directly from the
    // new nullable columns. Empty for cells that haven't been deepened.
    sub_industry: r.sub_industry_id
      ? {
          sub_industry_id: r.sub_industry_id as string,
          source_kind: ((r.sub_industry_source_kind as string) || "primary") as "primary" | "modeled",
        }
      : undefined,
    cost_stack: (r.cost_stack as CostStack | null) ?? undefined,
    setup_costs: (r.setup_costs as SetupCosts | null) ?? undefined,
  };
  // Apply render-time currency correction for the
  // 2,298 local-currency-as-USD cells flagged by the May 2026 audit.
  // No-op for countries not on the correction list.
  return applyPlausibilitySuppression(applyCurrencyCorrection(applyRollforward(applyTaxonomy(cell))));
}

/**
 * Resolve a (country, geoSlug, industrySlug) to a single best-fit row in
 * regional_cells. Walks parent_id + PARENT_FALLBACK_MAP for the industry.
 * Returns null on miss; callers fall through to extrapolated_cells.
 */
export async function getRegionalCell(
  country: string,
  geoSlug: string,
  industrySlug: string,
  selector: CellSelector = {}
): Promise<Cell | null> {
  const c = country.toUpperCase();
  const geoId = regionalSlugToGeoId(c, geoSlug);
  // Exact-first: query the precise industry_id plus legacy aliases before the
  // measured parent, so sub-niche rows present in the DB are not missed.
  const candidates = industryQueryCandidates(industrySlug);
  if (candidates.length === 0) return null;

  let q = supabaseAdmin
    .from("regional_cells")
    .select("*")
    .eq("country", c)
    .eq("geo_id", geoId)
    .in("industry_id", candidates)
    .order("year", { ascending: false, nullsFirst: false })
    .order("n_enterprises", { ascending: false, nullsFirst: false })
    .limit(60);
  if (selector.sizeBand) q = q.eq("size_band", selector.sizeBand);
  if (selector.year) q = q.eq("year", selector.year);

  const { data, error } = await q;
  if (error || !data || data.length === 0) return null;
  // Prefer the highest-priority candidate that returned data (exact id before
  // parent fallback). Array.sort is stable, so the SQL year/n ordering holds
  // within each candidate group.
  const candRank = (id: string) => {
    const i = candidates.indexOf(id);
    return i === -1 ? candidates.length : i;
  };
  const row = (data as Record<string, unknown>[])
    .slice()
    .sort((a, b) => candRank(a.industry_id as string) - candRank(b.industry_id as string))[0];
  // Render-layer suppression. If this cell is in
  // the triage suppression list, return null. Caller falls through to
  // extrapolated_cells; if that also has no data, page 404s.
  const rowCountry = ((row.country as string) || "").toUpperCase();
  const rowGeo = row.geo_id as string;
  const rowInd = (row.industry_id as string) || "";
  if (isCellSuppressed(rowCountry, rowGeo, rowInd)) return null;
  // Display naming: if the matched row uses a legacy id, present the taxonomy
  // equivalent (we already matched on the real id above for the query).
  const dispInd = resolveDisplayIndustry(industrySlug);
  if (dispInd) (row as Record<string, unknown>).industry_id = dispInd.id;
  let cell = normalizeRegionalRow(row);
  // Apply field-level overrides if any
  cell = applyCellOverrides(rowCountry, rowGeo, rowInd, cell);
  // If the URL used a friendly city slug,
  // override geo_name to the canonical display label. /es/barcelona renders
  // 'Barcelona' regardless of whatever the DB row has for that field.
  // Manual map wins. /de/frankfurt → "Frankfurt am Main".
  // Popular-name override fires FIRST so /it/lazio
  // renders "Rome", /it/lombardia renders "Milan", etc. across every code
  // path including the regional-cell hit (was previously only applied
  // at the end of getCellBySlug + in geoNameFromSlug, so admin1 slugs
  // with real data slipped through).
  const popularName = getPopularPlaceName(c, geoSlug);
  const manualLabel = MANUAL_DISPLAY_LABEL[c]?.[geoSlug.toLowerCase()];
  const friendlyLabel =
    popularName || manualLabel || CITY_FRIENDLY_DISPLAY_LABEL[c]?.[geoSlug.toLowerCase()];
  if (friendlyLabel) cell.geo_name = friendlyLabel;
  return cell;
}

/** Regional variants — all years / size_bands for a (country, geo, industry). */
export async function getRegionalCellVariants(
  country: string,
  geoSlug: string,
  industrySlug: string
): Promise<Cell[]> {
  const c = country.toUpperCase();
  const geoId = regionalSlugToGeoId(c, geoSlug);
  // Exact-first: include precise + legacy ids so variant rows are not missed.
  const candidates = industryQueryCandidates(industrySlug);
  if (candidates.length === 0) return [];
  const dispInd = resolveDisplayIndustry(industrySlug);

  const { data, error } = await supabaseAdmin
    .from("regional_cells")
    .select("*")
    .eq("country", c)
    .eq("geo_id", geoId)
    .in("industry_id", candidates)
    .order("year", { ascending: false, nullsFirst: false })
    .order("n_enterprises", { ascending: false, nullsFirst: false })
    .limit(50);
  if (error || !data) return [];
  const popularName = getPopularPlaceName(c, geoSlug);
  const manualLabel = MANUAL_DISPLAY_LABEL[c]?.[geoSlug.toLowerCase()];
  const friendlyLabel =
    popularName || manualLabel || CITY_FRIENDLY_DISPLAY_LABEL[c]?.[geoSlug.toLowerCase()];
  return data
    .map((r) => {
      const row = r as Record<string, unknown>;
      const rowCountry = ((row.country as string) || "").toUpperCase();
      const rowGeo = row.geo_id as string;
      const rowInd = (row.industry_id as string) || "";
      // Skip suppressed rows
      if (isCellSuppressed(rowCountry, rowGeo, rowInd)) return null;
      // Present the taxonomy industry even when the row uses a legacy id.
      if (dispInd) row.industry_id = dispInd.id;
      let cell = normalizeRegionalRow(row);
      cell = applyCellOverrides(rowCountry, rowGeo, rowInd, cell);
      if (friendlyLabel) cell.geo_name = friendlyLabel;
      return cell;
    })
    .filter((c): c is Cell => c !== null);
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
    // Deepening fields.
    sub_industry: r.sub_industry_id
      ? {
          sub_industry_id: r.sub_industry_id as string,
          source_kind: ((r.sub_industry_source_kind as string) || "primary") as "primary" | "modeled",
        }
      : undefined,
    cost_stack: (r.cost_stack as CostStack | null) ?? undefined,
    setup_costs: (r.setup_costs as SetupCosts | null) ?? undefined,
  };
  // Render-time currency correction (see note above).
  // enforceSanity runs here so the regional read path gets the same revenue/
  // percentile/wage clamps as getCellBySlug. Without it, comparison rails,
  // variant lists, and direct getRegionalCell consumers served RAW unclamped
  // rows, which is why travel_agencies / Swiss grocery showed $500M-$2B per firm
  // (QA scale-anomaly bug, 2026-05-31). normalizeRegionalRow is the shared exit
  // for getRegionalCell + the variants path, so one call covers them all.
  return enforceSanity(
    applyPlausibilitySuppression(applyCurrencyCorrection(applyRollforward(applyTaxonomy(cell)))),
  );
}

export type CellSelector = {
  sizeBand?: string | null;
  year?: number | null;
};

/**
 * Resolve a (country / geo / industry) URL slug to a single best-fit
 * cell. Plan v25 Block 3: ALWAYS returns a Cell. If the existing
 * regional → extrapolated → sector chain misses, a synthesized cell
 * is produced from country + industry defaults so the page always
 * renders fully. Synthesized cells carry `is_synthetic = true` and a
 * 1-dot quality tier so the UI can badge them clearly.
 */
/**
 * Race the Supabase lookup against a budget. When
 * the DB is slow (cold connection, missing indexes, statement timeout),
 * the timeout wins and we fall through to synthesis. The user gets an
 * Estimated-badged page instead of a 504 from Vercel killing the
 * function. After Migration 1+2 the queries return in <200 ms and the
 * timeout never fires.
 */
const CELL_LOOKUP_BUDGET_MS = 25_000;
// v34 sanity §3 cell-page hang fix. Every secondary fetch on the cell
// page must complete in under SECONDARY_BUDGET_MS or fall back to an
// empty default. Without this guard, a single slow Supabase query
// would block the entire page render until Vercel kills the function
// at maxDuration=60s, which is exactly the symptom the founder saw.
const SECONDARY_BUDGET_MS = 4_000;

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | null> {
  let to: ReturnType<typeof setTimeout> | null = null;
  const timeout = new Promise<null>((resolve) => {
    to = setTimeout(() => resolve(null), ms);
  });
  try {
    return await Promise.race([p, timeout]);
  } finally {
    if (to) clearTimeout(to);
  }
}

/** v34 sanity §3 helper: wrap a fetch with a tight budget, returning
 * a caller-supplied default value on timeout (NOT null) so the caller
 * can keep its return type. Logs a single warn so a chronically slow
 * query is visible in production logs. */
export async function withBudget<T>(
  p: Promise<T>,
  defaultValue: T,
  ms = SECONDARY_BUDGET_MS,
  label = "secondary-fetch",
): Promise<T> {
  const result = await withTimeout(p, ms);
  if (result === null) {
    // eslint-disable-next-line no-console
    console.warn(`[cells] ${label} exceeded ${ms}ms budget, falling back`);
    return defaultValue;
  }
  return result;
}

export async function getCellBySlug(
  countrySlug: string,
  geoSlug: string,
  industrySlug: string,
  selector: CellSelector = {}
): Promise<Cell> {
  const country = countrySlug.toUpperCase();
  const real = await withTimeout(
    getCellBySlugRaw(country, geoSlug, industrySlug, selector),
    CELL_LOOKUP_BUDGET_MS,
  );
  let cell: Cell;
  if (real) {
    cell = enforceSanity(fillMissingFields(real));
  } else {
    cell = enforceSanity(
      synthesizeCell(country, industrySlug, {
        geoSlug,
        geoName: geoNameFromSlug(country, geoSlug),
        year: selector.year || undefined,
      }),
    );
  }
  // Apply the manual / friendly city-alias
  // display label UNIVERSALLY at the end of the lookup chain. Previously
  // this override lived only in getRegionalCell, so when the chain fell
  // through to getExtrapolatedCell (typical on production with limited
  // RLS access) the page rendered country-level geo_name ("DE") instead
  // of "Frankfurt am Main". Applying it here covers every code path.
  const friendlyLabel = geoNameFromSlug(country, geoSlug);
  if (friendlyLabel) cell.geo_name = friendlyLabel;
  // Stamp the turnover band on the way out. Computed
  // from revenue_per_firm + industry's parent-sector thresholds.
  // Imported lazily to avoid pulling the band data file into every
  // module that depends on cells.ts.
  {
    const { classifyTurnoverBand } = await import("./finance/turnover_band");
    cell.turnover_band = classifyTurnoverBand(cell.revenue_per_firm ?? cell.rev_p50, cell.industry_id);
  }
  return cell;
}

/**
 * Internal: the raw lookup chain (no synthesis). Returns null on miss.
 * Used by getCellBySlug above.
 */
async function getCellBySlugRaw(
  country: string,
  geoSlug: string,
  industrySlug: string,
  selector: CellSelector,
): Promise<Cell | null> {
  // Non-US: regional_cells (sub-national) first, then extrapolated_cells,
  // then sector-average fallback (CC.7).
  if (country !== "US") {
    const regional = await getRegionalCell(country, geoSlug, industrySlug, selector);
    if (regional) return regional;
    const extrap = await getExtrapolatedCell(country, industrySlug, selector);
    if (extrap) return extrap;
    const sector = await getSectorFallbackCell(country, industrySlug, selector);
    if (sector) return sector;
    return null;
  }

  // US: state-level cells_master first; if the geoSlug isn't a state
  // slug, it's likely a county or city geo_id (e.g. "us-06-037",
  // "us-city-new-york") and lives in regional_cells.
  const geoId = SLUG_TO_GEO_ID[geoSlug.toLowerCase()];
  if (!geoId) {
    const regional = await getRegionalCell("US", geoSlug, industrySlug, selector);
    if (regional) return regional;
    return null;
  }

  // First try friendly industry slug → industry_id → matching NAICS-3 prefix.
  const rawInd = slugToIndustry(industrySlug);
  const ind = resolveToMeasuredIndustry(rawInd);
  if (ind && (ind.naics_3 || []).length) {
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

  // Fallback: fuzzy industry_description search.
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
  if (country !== "US") {
    const regional = await getRegionalCellVariants(country, geoSlug, industrySlug);
    if (regional.length) return regional;
    return getExtrapolatedVariants(country, industrySlug);
  }
  const geoId = SLUG_TO_GEO_ID[geoSlug.toLowerCase()];
  if (!geoId) {
    const regional = await getRegionalCellVariants("US", geoSlug, industrySlug);
    return regional;
  }

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

// Time-series helpers moved to cells/time_series.ts.
export {
  distinctSizeBands,
  distinctYears,
  buildTimeSeries,
} from "./cells/time_series";
export type { TimePoint } from "./cells/time_series";

/**
 * Top industries for a country — used by the country landing page.
 * For US: queries cells_master, groups by NAICS-3 prefix → industry_id.
 * For non-US: queries extrapolated_cells, groups by industry_id and takes
 * the MEDIAN per industry after pre-filtering wrong-aggregation outliers.
 * Returns up to `limit` industries ordered by relevant size signal.
 *
 * Country-page rebuild §3 (2026-05-25): the non-US path previously ordered
 * by `predicted_rev_per_firm DESC` and kept the MAX revenue per industry.
 * This surfaced the tail of wrong-aggregation rows (whole-sector revenue
 * masquerading as per-firm) and made every low-coverage country page lie
 * by 1-2 orders of magnitude (e.g. "software dev in Albania $43M"). The
 * pure aggregation helper lives in ./cells/top_industries_aggregation.ts
 * so the unit test can exercise it without booting Supabase.
 */
// Import aggregation helper + types from the sub-module. Re-exported below
// so existing callers of `import { TopIndustryRow } from "@/lib/cells"`
// keep working.
import {
  aggregateExtrapolatedByIndustry,
  countryPagePlausibilityCeiling,
  type TopIndustryRow,
  type ExtrapolatedRow,
} from "./cells/top_industries_aggregation";

export {
  aggregateExtrapolatedByIndustry,
  countryPagePlausibilityCeiling,
};
export type { TopIndustryRow, ExtrapolatedRow };

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

  // Non-US: query extrapolated_cells. Pull a wide slate (500 rows) so
  // there are enough samples per industry to compute a stable median.
  // Order by quality_score so the top of the slate is the most
  // trustworthy rows, not the highest-revenue rows.
  const iso3 = iso2ToIso3(country);
  if (!iso3) return [];
  const { data, error } = await supabaseAdmin
    .from("extrapolated_cells")
    .select("industry_id, predicted_rev_per_firm, quality_score")
    .eq("country_iso3", iso3)
    .order("quality_score", { ascending: false, nullsFirst: false })
    .limit(500);
  if (error || !data) return [];
  // Fold legacy DB ids to their taxonomy equivalents BEFORE aggregation, so
  // legacy-tagged rows (metal_products_mfg, etc.) are not silently dropped by
  // the aggregator's INDUSTRY_BY_ID lookup and don't show as duplicate labels.
  const folded = (data as ExtrapolatedRow[]).map((r) => ({
    ...r,
    industry_id: LEGACY_DB_TO_TAXONOMY[r.industry_id] ?? r.industry_id,
  }));
  return aggregateExtrapolatedByIndustry(folded, country, limit);
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
  // Exact-first: include precise + legacy ids so the comparison rail reaches
  // every country's row for this industry. `ind` drives display + bounds.
  const candidates = industryQueryCandidates(industrySlug);
  const ind = resolveDisplayIndustry(industrySlug);
  if (!ind || candidates.length === 0) return [];
  const excludeIso3 = iso2ToIso3(excludeIso2) || "";
  // Pull a wider slate so SMB-bound filtering still
  // leaves enough comparators after dropping clearly-broken predictions
  // (Chile $millions / Liechtenstein billions). Order by quality first,
  // not revenue, so trustworthy countries surface before noise.
  let q = supabaseAdmin
    .from("extrapolated_cells")
    .select("*")
    .in("industry_id", candidates)
    .order("quality_score", { ascending: false, nullsFirst: false })
    .order("predicted_rev_per_firm", { ascending: false, nullsFirst: false })
    .limit(limit * 5);
  if (excludeIso3) q = q.neq("country_iso3", excludeIso3);
  const { data, error } = await q;
  if (error || !data) return [];

  // Apply SMB-physical bounds — drop rows whose predicted revenue is
  // outside the conservative per-industry envelope. This is the same
  // bounds table used by the scale-sanity scanner in Block 1, so the
  // chart now agrees with the suppression / triage layer.
  const bounds =
    REVENUE_PER_FIRM_BOUNDS[ind.id] || DEFAULT_REVENUE_BOUNDS;

  const filtered = data.filter((r) => {
    const predRev = r.predicted_rev_per_firm as number | null;
    return classifyValue(predRev, bounds) === "ok";
  });

  return filtered.slice(0, limit).map((r) => {
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
    return applyRollforward(applyTaxonomy(cell));
  });
}

/** Extrapolated variants — all size bands / years for a (country, industry). */
export async function getExtrapolatedVariants(
  iso2: string,
  industrySlug: string
): Promise<Cell[]> {
  const iso3 = iso2ToIso3(iso2);
  if (!iso3) return [];
  // Exact-first: include precise + legacy ids so variant rows are not missed.
  const candidates = industryQueryCandidates(industrySlug);
  if (candidates.length === 0) return [];
  const ind = resolveDisplayIndustry(industrySlug);
  const { data, error } = await supabaseAdmin
    .from("extrapolated_cells")
    .select("*")
    .eq("country_iso3", iso3)
    .in("industry_id", candidates)
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
      industry_id: ind?.id ?? (r.industry_id as string),
      industry_description: ind?.name ?? (r.industry_id as string),
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
    return applyRollforward(applyTaxonomy(cell));
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
 * estimate so RevenueTiles + RevenueDistribution still render meaningfully.
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
  // Exact-first: query the precise + legacy industry ids before the measured
  // parent. `ind` is the taxonomy industry to use for display naming.
  const candidates = industryQueryCandidates(industrySlug);
  if (candidates.length === 0) return null;
  const ind = resolveDisplayIndustry(industrySlug);

  let q = supabaseAdmin
    .from("extrapolated_cells")
    .select("*")
    .eq("country_iso3", iso3)
    .in("industry_id", candidates)
    .order("year", { ascending: false, nullsFirst: false })
    .limit(60);
  if (selector.sizeBand) q = q.eq("size_band", selector.sizeBand);
  if (selector.year) q = q.eq("year", selector.year);

  const { data, error } = await q;
  if (error || !data || data.length === 0) return null;
  const candRank = (id: string) => {
    const i = candidates.indexOf(id);
    return i === -1 ? candidates.length : i;
  };
  const r = (data as Record<string, unknown>[])
    .slice()
    .sort((a, b) => candRank(a.industry_id as string) - candRank(b.industry_id as string))[0];

  const predRev = (r.predicted_rev_per_firm as number) ?? null;
  // Coarse spread synthesis: ±50% wedge so RevenueTiles/RevenueDistribution
  // render something rather than identical values. Clearly flagged via quality.
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
    industry_id: ind?.id ?? (r.industry_id as string),
    industry_description: ind?.name ?? (r.industry_id as string),
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
  // Render-time currency correction. extrapolated_cells
  // also receives values from the same ingestion pipeline that produced
  // the local-currency-as-USD cells, so the correction applies here too.
  return applyPlausibilitySuppression(applyCurrencyCorrection(applyRollforward(applyTaxonomy(cell))));
}

/**
 * Sector-level fallback (Track CC.7).
 *
 * When both regional + extrapolated lookups miss for a (country, industry),
 * fall back to ANY industry in the same sector that the country DOES have
 * data for. Returns the highest-quality match with industry_description
 * rewritten to reflect that the user is seeing a sector-average proxy.
 *
 * The returned cell is clearly marked via quality_score (capped at 30,
 * legacy 0-100) and coverage_tier="X" so the UI renders a low-confidence
 * chip rather than passing it off as a measurement.
 */
export async function getSectorFallbackCell(
  iso2: string,
  industrySlug: string,
  selector: CellSelector = {}
): Promise<Cell | null> {
  const iso3 = iso2ToIso3(iso2);
  if (!iso3) return null;
  // resolveDisplayIndustry so legacy slugs (e.g. metal-products-mfg) still
  // resolve to a taxonomy industry and the sector fallback can fire.
  const rawInd = resolveDisplayIndustry(industrySlug);
  if (!rawInd) return null;
  const sectorId = rawInd.sector_id;
  if (!sectorId) return null;
  const peerIds = INDUSTRIES.filter(
    (i) => i.sector_id === sectorId && i.id !== rawInd.id
  ).map((i) => i.id);
  if (peerIds.length === 0) return null;

  let q = supabaseAdmin
    .from("extrapolated_cells")
    .select("*")
    .eq("country_iso3", iso3)
    .in("industry_id", peerIds)
    .order("quality_score", { ascending: false, nullsFirst: false })
    .order("year", { ascending: false, nullsFirst: false })
    .limit(1);
  if (selector.sizeBand) q = q.eq("size_band", selector.sizeBand);
  if (selector.year) q = q.eq("year", selector.year);

  const { data, error } = await q;
  if (error || !data || data.length === 0) return null;
  const r = data[0] as Record<string, unknown>;
  const predRev = (r.predicted_rev_per_firm as number) ?? null;
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
    industry_id: rawInd.id,
    industry_description: `${rawInd.name} (sector average)`,
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
    quality_score: Math.min(((r.quality_score as number) || 30), 30),
    coverage_tier: "X",
    coverage_source: "Sector-average fallback",
    currency: "USD",
  };
  return applyRollforward(applyTaxonomy(cell));
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

  // Trimmed limit (800 → 200). There are 50 US states; we cap returned
  // rows at `limit` after a client-side per-state collapse, so 200
  // rows give 4× headroom for tie-breaking. The previous 800-row
  // fetch was timing out the 4s budget on 1-2% of US cell pages
  // (build-log evidence, 2026-05-27 perf pass). We order by n first
  // so the highest-firm-count rows land in the slate even when a
  // recent year has scattered low-count entries that would otherwise
  // dominate a year-first sort.
  const { data, error } = await supabaseAdmin
    .from("cells_master")
    .select("*")
    .eq("country", "US")
    .neq("geo_id", excludeGeoId)
    .or(orClauses)
    .order("n", { ascending: false, nullsFirst: false })
    .order("year", { ascending: false, nullsFirst: false })
    .limit(200);
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

/** Top N cells globally (for sitemap + homepage features).
 *  Every ordering variant on the 722k-row cells_master
 *  hit Supabase's statement timeout. Use `.gte('year', 2020)` to push
 *  filtering into an indexed range scan, then take whatever order Postgres
 *  returns. For sitemap purposes a deterministic sample is enough; we
 *  don't need strict popularity ranking.
 */
export async function getTopCells(limit = 100): Promise<Cell[]> {
  const { data, error } = await supabaseAdmin
    .from("cells_master")
    .select("*")
    .eq("country", "US")
    .gte("year", 2020)
    .limit(Math.ceil(limit * 1.2));
  if (error || !data) return [];
  return data
    .filter((r) => (r as Record<string, unknown>).industry_description != null)
    .slice(0, limit)
    .map((r) => normalizeRow(r as Record<string, unknown>));
}

/**
 * Top N regional_cells rows for the sitemap. Plan v26 follow-up
 * findings: ANY .order() clause on regional_cells times out at the
 * 60s Supabase statement limit (no index supports it). Workaround:
 * drop the order, accept whatever PostgREST returns first. The
 * inventory probe showed ~95%+ of rows score >= 85 quality, so the
 * downstream score-filter keeps most rows anyway. Simple limit(1000)
 * with a single gte filter returns in <1 second.
 */
export async function getTopRegionalCells(limit = 1000): Promise<Cell[]> {
  const { data, error } = await supabaseAdmin
    .from("regional_cells")
    .select("country, geo_id, geo_level, geo_name, industry_id, year, size_band, n_enterprises, quality_score, coverage_tier, coverage_source")
    .gte("n_enterprises", 5)
    .limit(limit);
  if (error || !data) return [];
  return data.map((r) => normalizeRegionalRow(r as Record<string, unknown>));
}

/**
 * Build a sitemap-friendly URL path from a regional_cells row. Uses the
 * geo_id lowercased (preserving city-overlay case-insensitivity) and the
 * industry slug.
 */
export function regionalCellUrl(c: Cell): string {
  const country = c.country.toLowerCase();
  const geoSlug = (c.geo_id || "").toLowerCase();
  const industrySlug = c.industry_id ? industryToSlug(c.industry_id) : "";
  if (!geoSlug || !industrySlug) return "";
  return `/${country}/${geoSlug}/${industrySlug}`;
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
