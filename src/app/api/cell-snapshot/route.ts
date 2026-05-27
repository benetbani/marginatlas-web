/**
 * /api/cell-snapshot — lightweight endpoint for featured-cell tiles.
 *
 * Input: ?country=us&geo=california&industry=restaurants
 * Output: { revenue_per_firm, n_enterprises, quality_score, year, found }
 *
 * Used by the home-page 12-tile featured grid (Plan v3.0 §N). The home
 * page server-component runs 12 of these in parallel before render so
 * the tiles ship with real numbers and no client-side flash.
 */

import { NextRequest, NextResponse } from "next/server";
import { getCellBySlug } from "@/lib/cells";

export const revalidate = 86400;

const CACHE_HEADERS = {
  // Edge-cache snapshot JSON for 6h with 24h stale.
  "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const country = (url.searchParams.get("country") || "").toLowerCase();
  const geo = (url.searchParams.get("geo") || "").toLowerCase();
  const industry = (url.searchParams.get("industry") || "").toLowerCase();
  if (!country || !geo || !industry) {
    return NextResponse.json({ found: false }, { status: 400 });
  }
  const cell = await getCellBySlug(country, geo, industry);
  if (!cell) {
    return NextResponse.json({ found: false }, { headers: CACHE_HEADERS });
  }
  return NextResponse.json(
    {
      found: true,
      revenue_per_firm: cell.revenue_per_firm,
      n_enterprises: cell.n_enterprises,
      quality_score: cell.quality_score,
      year: cell.year,
    },
    { headers: CACHE_HEADERS },
  );
}
