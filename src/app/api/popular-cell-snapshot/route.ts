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

export const revalidate = 3600;

/** Rotating set of cells with reliably-good data. */
const ROTATION: { country: string; geo: string; industry: string }[] = [
  { country: "us", geo: "california",           industry: "restaurants" },
  { country: "us", geo: "new-york",             industry: "real-estate-agencies" },
  { country: "us", geo: "florida",              industry: "hairdressers-beauty" },
  { country: "us", geo: "texas",                industry: "auto-repair-shops" },
  { country: "us", geo: "california",           industry: "software-development" },
  { country: "us", geo: "district-of-columbia", industry: "management-consulting" },
  { country: "de", geo: "germany",              industry: "metal-products-manufacturing" },
  { country: "fr", geo: "france",               industry: "hotels-lodging" },
  { country: "it", geo: "italy",                industry: "restaurants" },
  { country: "jp", geo: "japan",                industry: "restaurants" },
];

export async function GET() {
  const hourBucket = Math.floor(Date.now() / (1000 * 60 * 60));
  // Try the bucket's pick; if it has no data, walk the rotation until something resolves.
  for (let i = 0; i < ROTATION.length; i++) {
    const pick = ROTATION[(hourBucket + i) % ROTATION.length];
    const cell = await getCellBySlug(pick.country, pick.geo, pick.industry);
    if (cell && cell.revenue_per_firm != null) {
      return NextResponse.json({
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
      });
    }
  }
  return NextResponse.json({ found: false });
}
