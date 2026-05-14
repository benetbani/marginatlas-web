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

type CompactCell = {
  country: string;
  region: string | null;
  industry: string;
  year: number | null;
  revenue_per_firm: number | null;
  rev_p10: number | null;
  rev_p90: number | null;
  n_enterprises: number | null;
  n_employees: number | null;
  payroll_per_employee: number | null;
  quality_score: number | null;
  // employees_per_firm derived
  employees_per_firm: number | null;
  cellUrl: string | null;
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const country = (url.searchParams.get("country") || "").toUpperCase();
  const industryId = url.searchParams.get("industry") || "";
  const region = (url.searchParams.get("region") || "").toLowerCase();

  if (!country || !industryId || !INDUSTRY_BY_ID[industryId]) {
    return NextResponse.json({ cell: null, reason: "missing or invalid country/industry" });
  }
  const industrySlug = industryToSlug(industryId);

  // Only US has state-level cell data in cells_master right now.
  // For other countries, return null until Phase F (extrapolated_cells) is live.
  if (country !== "US") {
    return NextResponse.json({ cell: null, reason: "country_pending" });
  }

  let regionSlug = region;
  if (!regionSlug) {
    // Pick a sensible default: California is the most common opener.
    regionSlug = "california";
  }

  const cell = await getCellBySlug(country.toLowerCase(), regionSlug, industrySlug);
  if (!cell) {
    return NextResponse.json({ cell: null, reason: "no_match" });
  }

  const empPerFirm =
    cell.n_employees && cell.n_enterprises ? cell.n_employees / cell.n_enterprises : null;

  const compact: CompactCell = {
    country: cell.country,
    region: cell.geo_name,
    industry: cell.industry_name || industryId,
    year: cell.year,
    revenue_per_firm: cell.revenue_per_firm ?? null,
    rev_p10: cell.rev_p10 ?? null,
    rev_p90: cell.rev_p90 ?? null,
    n_enterprises: cell.n_enterprises ?? null,
    n_employees: cell.n_employees ?? null,
    payroll_per_employee: cell.payroll_per_employee ?? null,
    quality_score: cell.quality_score ?? null,
    employees_per_firm: empPerFirm,
    cellUrl: cell.geo_name
      ? `/${cell.country.toLowerCase()}/${slugify(cell.geo_name)}/${industrySlug}`
      : null,
  };

  // Suppress unused-import warning by referencing getTopCells in a no-op path
  void getTopCells;

  return NextResponse.json({ cell: compact });
}
