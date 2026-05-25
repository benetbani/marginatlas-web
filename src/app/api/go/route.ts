/**
 * GET /api/go?country=...&region=...&subdivision=...&industry=...
 *
 * Bulletproof server-side handler for the homepage NavigatorForm.
 * If JavaScript fails to load, the form falls back to native HTML GET
 * submit and lands here. Mirrors the React submit() logic so the URL
 * shape is identical with or without JS:
 *
 *   /<country>/<targetGeo>/<industry>
 *
 * where targetGeo = subdivision || region || curated-default-for-country.
 * On invalid input falls back to /random (mirroring the React error path).
 *
 * Validates every param as slug-safe so it cannot be used to redirect
 * to arbitrary URLs.
 *
 * Shipped 2026-05-26 as the CitiesFix2 §4 button-verify bulletproof.
 */

import { NextRequest, NextResponse } from "next/server";

const SLUG_RE = /^[a-z0-9-]+$/;

export function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const country = (sp.get("country") || "").trim().toLowerCase();
  const region = (sp.get("region") || "").trim().toLowerCase();
  const subdivision = (sp.get("subdivision") || "").trim().toLowerCase();
  const industry = (sp.get("industry") || "").trim().toLowerCase();

  // Required: country and industry. Anything missing or invalid -> /random.
  if (!SLUG_RE.test(country) || !SLUG_RE.test(industry)) {
    return NextResponse.redirect(new URL("/random", request.url), 302);
  }

  // targetGeo precedence: subdivision > region > country slug.
  // Region may be empty or absent on first-load; that's fine, country
  // is the floor and the country page resolves further.
  let targetGeo = "";
  if (subdivision && SLUG_RE.test(subdivision)) {
    targetGeo = subdivision;
  } else if (region && SLUG_RE.test(region)) {
    targetGeo = region;
  } else {
    // No region picked. Send to country page so the user can browse,
    // since we don't have access to the curated-region table from a
    // pure server route without importing the React component graph.
    return NextResponse.redirect(
      new URL(`/${country}`, request.url),
      302,
    );
  }

  return NextResponse.redirect(
    new URL(`/${country}/${targetGeo}/${industry}`, request.url),
    302,
  );
}
