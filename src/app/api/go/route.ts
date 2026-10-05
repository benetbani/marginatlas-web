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
import { homeDestination } from "@/lib/home/destination";

const SLUG_RE = /^[a-z0-9-]+$/;

/* THE SAME DESTINATION AS THE SCRIPTED FORM (masterplan step 33): src/lib/home/destination.ts answers with or without script, so a
   no-script search lands on the page the scripted one does. Every param is held to a slug, so none can steer a redirect off the
   site; the destination answers only with this site's own paths. */
export function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const slug = (name: string) => { const v = (sp.get(name) || "").trim().toLowerCase(); return SLUG_RE.test(v) ? v : ""; };
  const country = slug("country");
  if (!country) return NextResponse.redirect(new URL("/", request.url), 302);
  const path = homeDestination({ country, city: slug("subdivision"), trade: slug("industry") });
  return NextResponse.redirect(new URL(path, request.url), 302);
}
