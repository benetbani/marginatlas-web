/**
 * /api/cell-lookup — server-side cell fetch for the /compare page.
 *
 * Input: ?country=US&industry=restaurants[&region=california]
 * Output: A compact subset of Cell suitable for table rendering, or
 * null when no match (e.g. for non-US countries until Phase F is live).
 */

import { NextRequest, NextResponse } from "next/server";
import { getCellBySlug, getTopCells, slugify } from "@/lib/cells";
import { industryToSlug, INDUSTRY_BY_ID } from "@/lib/taxonomy";

// Cache for 1 day on Vercel's edge cache
export const revalidate = 86400;

const CACHE_HEADERS = {
  // Per-query edge caching for the /compare page.
  "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
};

type CompactCell = {
  country: string;
  region: string | null;
  industry: string;
  year: number | null;
  revenue_per_firm: number | null;
  rev_p10: number | null;
  rev_p25: number | null;
  rev_p50: number | null;
  rev_p75: number | null;
  rev_p90: number | null;
  n_enterprises: number | null;
  n_employees: number | null;
  payroll_per_employee: number | null;
  quality_score: number | null;
  // Employees_per_firm derived field removed
  // (n_enterprises denominator is unreliable).
  cellUrl: string | null;
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const country = (url.searchParams.get("country") || "").toUpperCase();
  const industryId = url.searchParams.get("industry") || "";
  const region = (url.searchParams.get("region") || "").toLowerCase();

  if (!country || !industryId || !INDUSTRY_BY_ID[industryId]) {
    return NextResponse.json(
      { cell: null, reason: "missing or invalid country/industry" },
      { headers: CACHE_HEADERS },
    );
  }
  const industrySlug = industryToSlug(industryId);

  // US: state-level data from cells_master. Default to california.
  // Non-US: country-level extrapolated cells (Phase F is live).
  let regionSlug = region;
  if (country === "US" && !regionSlug) regionSlug = "california";
  if (country !== "US") regionSlug = country.toLowerCase(); // not used for non-US lookup, just passed through

  const cell = await getCellBySlug(country.toLowerCase(), regionSlug, industrySlug);
  if (!cell) {
    return NextResponse.json({ cell: null, reason: "no_match" }, { headers: CACHE_HEADERS });
  }

  const compact: CompactCell = {
    country: cell.country,
    region: cell.geo_name,
    industry: cell.industry_name || industryId,
    year: cell.year,
    revenue_per_firm: cell.revenue_per_firm ?? null,
    rev_p10: cell.rev_p10 ?? null,
    rev_p25: cell.rev_p25 ?? null,
    rev_p50: cell.rev_p50 ?? null,
    rev_p75: cell.rev_p75 ?? null,
    rev_p90: cell.rev_p90 ?? null,
    n_enterprises: cell.n_enterprises ?? null,
    n_employees: cell.n_employees ?? null,
    payroll_per_employee: cell.payroll_per_employee ?? null,
    quality_score: cell.quality_score ?? null,
    cellUrl: cell.geo_name
      ? `/${cell.country.toLowerCase()}/${slugify(cell.geo_name)}/${industrySlug}`
      : null,
  };

  // Suppress unused-import warning by referencing getTopCells in a no-op path
  void getTopCells;

  return NextResponse.json({ cell: compact }, { headers: CACHE_HEADERS });
}
