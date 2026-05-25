/**
 * GET /api/go — server-side redirect endpoint for the NavigatorForm.
 *
 * Founder reported the NavigatorForm submit button has been failing
 * to navigate in production across multiple iterations, despite the
 * code reading correctly. Theory: the React/Next.js client-side path
 * (router.push, even window.location.href triggered inside a click
 * handler) is failing somewhere we can't reach from the client.
 *
 * Nuclear option: the form on `/` is now a native HTML `<form
 * action="/api/go" method="get">`. The BROWSER submits the form as a
 * GET request to this route. No JavaScript involved in the submit
 * path. This route constructs the destination URL on the server and
 * returns a 302 redirect. The browser follows.
 *
 * This is the most well-tested primitive in the web platform.
 * It cannot silently fail.
 *
 * Query params:
 *   country   — ISO2 country code, e.g. "US"
 *   region    — region slug, optional
 *   city      — subdivision slug, optional
 *   industry  — industry id (DB id, not slug)
 *
 * If industry is missing, redirect to /random.
 */

import { NextRequest, NextResponse } from "next/server";
import { COUNTRIES, INDUSTRIES, industryToSlug } from "@/lib/taxonomy";
import { getRegionsForCountry } from "@/lib/regions/regions-by-country";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest): NextResponse {
  const params = request.nextUrl.searchParams;
  const country = (params.get("country") || "").trim().toUpperCase();
  const region = (params.get("region") || "").trim();
  const city = (params.get("city") || "").trim();
  const industryRaw = (params.get("industry") || "").trim();

  // Fallback: anything missing -> /random.
  if (!industryRaw || !country) {
    return NextResponse.redirect(new URL("/random", request.url), 302);
  }

  // Validate industry against the taxonomy (be lenient: accept the id
  // OR the slug). If neither matches, fall through to /random.
  const industry =
    INDUSTRIES.find((i) => i.id === industryRaw) ||
    INDUSTRIES.find((i) => industryToSlug(i.id) === industryRaw);
  if (!industry) {
    return NextResponse.redirect(new URL("/random", request.url), 302);
  }

  // Validate country.
  const validCountry = COUNTRIES.find((c) => c.code === country);
  if (!validCountry) {
    return NextResponse.redirect(new URL("/random", request.url), 302);
  }

  // Resolve region. If the user picked one, use it. Otherwise grab
  // the first non-empty region for the country (matches the old
  // client-side fallback exactly).
  let resolvedRegion = region;
  if (!resolvedRegion) {
    const opts = getRegionsForCountry(country, validCountry.name);
    const first = opts.find((o) => o.value);
    if (first) {
      resolvedRegion = first.value;
    } else if (country === "US") {
      resolvedRegion = "california";
    } else {
      resolvedRegion = validCountry.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
  }

  const targetGeo = city || resolvedRegion;
  const indSlug = industryToSlug(industry.id);
  const path = `/${country.toLowerCase()}/${targetGeo}/${indSlug}`;

  return NextResponse.redirect(new URL(path, request.url), 302);
}
