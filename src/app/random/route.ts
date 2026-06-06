/**
 * /random — Plan v4.0 Step 17.
 *
 * Redirects to a random cell from the top-200 highest-traffic measured
 * cells. Deterministic-per-hour rotation so the edge cache stays warm.
 *
 * Excludes corp_only industries unless ?pro=1 is present.
 */

import { NextRequest, NextResponse } from "next/server";
import { getTopCells, cellUrl } from "@/lib/cells";
import { INDUSTRY_BY_ID, isExcludedSolo } from "@/lib/taxonomy";

export const revalidate = 600; // 10 minutes

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const allowCorp = url.searchParams.get("pro") === "1";

  let top = await getTopCells(200);
  if (!top || top.length === 0) {
    return NextResponse.redirect(new URL("/us/california/restaurants", req.url));
  }

  // Excluded-solo activities never land in /random, even with ?pro=1.
  top = top.filter((c) => {
    if (!c.industry_id) return true;
    const ind = INDUSTRY_BY_ID[c.industry_id];
    return !ind || !isExcludedSolo(ind);
  });

  if (!allowCorp) {
    top = top.filter((c) => {
      if (!c.industry_id) return true;
      const ind = INDUSTRY_BY_ID[c.industry_id];
      const audience = ind?.audience ?? "smb_friendly";
      return audience === "smb_core" || audience === "smb_friendly";
    });
  }
  if (top.length === 0) {
    return NextResponse.redirect(new URL("/us/california/restaurants", req.url));
  }

  // Deterministic-per-hour pick so the edge cache key stays stable for the
  // 10-minute revalidate window.
  const hourSeed = Math.floor(Date.now() / (1000 * 60 * 10));
  const pick = top[hourSeed % top.length];
  const path = cellUrl(pick);
  return NextResponse.redirect(new URL(path, req.url));
}
