/**
 * GET /decide/go?activity=...&city=...
 *
 * Bulletproof form-submit handler for the /decide landing page picker.
 * Mirrors the /api/go pattern used by NavigatorForm: native HTML form
 * GET-submits here, we 302 to /decide/[activity]/[city]. Works without
 * any client JS.
 *
 * Validates both params; falls back to /decide on invalid input.
 */

import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const activity = (sp.get("activity") || "").trim().toLowerCase();
  const city = (sp.get("city") || "").trim().toLowerCase();

  // Defensive: only allow slug-safe characters (alphanumerics + dash).
  // Anything else, send back to the landing page.
  if (!/^[a-z0-9-]+$/.test(activity) || !/^[a-z0-9-]+$/.test(city)) {
    return NextResponse.redirect(new URL("/decide", request.url), 302);
  }

  const target = new URL(`/decide/${activity}/${city}`, request.url);
  return NextResponse.redirect(target, 302);
}
