/**
 * /api/popular-cell-snapshot — Plan v4.0 Step 15.
 *
 * Returns a single rotating cell snapshot for the home page "First-look
 * numbers" strip. Rotates hourly through a hand-curated list of
 * crowd-pleaser cells so the home page never feels stale.
 *
 * Edge-cached for 1 hour.
 */

import { NextResponse } from "next/server";
import { getCellBySlug } from "@/lib/cells";
import { getPopularRotationSnapshot, findSnapshotCell } from "@/lib/snapshots";

export const revalidate = 3600;

const CACHE_HEADERS = {
  // Edge cache 1h, stale-while-revalidate 24h.
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

/** Rotating set of cells with reliably-good data. */
const ROTATION: { country: string; geo: string; industry: string }[] = [
  { country: "us", geo: "california",           industry: "restaurants" },
  { country: "us", geo: "new-york",             industry: "real-estate-agencies" },
  { country: "us", geo: "florida",              industry: "hairdressers-beauty" },
  { country: "us", geo: "texas",                industry: "auto-repair-shops" },
  { country: "us", geo: "california",           industry: "software-development" },
  { country: "us", geo: "district-of-columbia", industry: "management-consulting" },
  /* Was "metal-products-manufacturing", which is not a slug this taxonomy
     produces. slugToIndustry does not reject it, it fuzzy-matches and returns
     wood_products_mfg, so the German pick in a rotation of "cells with reliably
     good data" was WOOD. The canonical slug is below, and it matches the
     fabricated_metal_mfg example the cell route already prerenders for de21. */
  { country: "de", geo: "germany",              industry: "fabricated-metal-manufacturing" },
  { country: "fr", geo: "france",               industry: "hotels-lodging" },
  { country: "it", geo: "italy",                industry: "restaurants" },
  { country: "jp", geo: "japan",                industry: "restaurants" },
];

export async function GET() {
  const hourBucket = Math.floor(Date.now() / (1000 * 60 * 60));
  const snap = getPopularRotationSnapshot();
  // Read from baked snapshot first; only walk to
  // Supabase if the snapshot is empty or this pick is missing.
  for (let i = 0; i < ROTATION.length; i++) {
    const pick = ROTATION[(hourBucket + i) % ROTATION.length];
    const industrySnapshotKey = pick.industry.replace(/-/g, "_");
    const baked = findSnapshotCell(snap, pick.country, pick.geo, industrySnapshotKey);
    const cell = baked && baked.revenue_per_firm != null
      ? {
          revenue_per_firm: baked.revenue_per_firm,
          n_enterprises: baked.n_enterprises,
          n_employees: baked.n_employees,
          payroll_per_employee: baked.payroll_per_employee,
          year: baked.year,
          industry_name: baked.industry_name,
          geo_name: baked.geo_name,
          country: baked.iso2,
        }
      : await getCellBySlug(pick.country, pick.geo, pick.industry);
    if (cell && cell.revenue_per_firm != null) {
      return NextResponse.json(
        {
          found: true,
          industry: cell.industry_name,
          geo: cell.geo_name,
          country: cell.country,
          year: cell.year,
          revenue_per_firm: cell.revenue_per_firm,
          n_enterprises: cell.n_enterprises,
          n_employees: cell.n_employees,
          payroll_per_employee: cell.payroll_per_employee,
          cellUrl: `/${pick.country}/${pick.geo}/${pick.industry}`,
        },
        { headers: CACHE_HEADERS },
      );
    }
  }
  return NextResponse.json({ found: false }, { headers: CACHE_HEADERS });
}
