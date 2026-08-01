/**
 * /api/export-csv — single-cell CSV download.
 *
 * Free tier: returns a single row with the cell's headline stats plus
 * a watermark comment line. Paid tiers would unlock variants, sibling
 * cells, time series, etc — gated here when auth is wired.
 *
 * Watermark serves two purposes: tells the downstream tool where the
 * data came from, and discourages bulk-scraping by always including a
 * citation line at the top of every export.
 */

import { NextRequest, NextResponse } from "next/server";
import { getCellBySlug, getCellVariants, buildTimeSeries, slugify } from "@/lib/cells";
import { industryToSlug } from "@/lib/taxonomy";
import { checkRateLimit, clientIp } from "@/lib/rate_limit";
// The canonical tier derivation, the same one the pages use, so an export and a
// page never disagree about how a row was produced. It reads is_synthetic
// first, which is the case that matters most here: getCellBySlug ALWAYS returns
// a cell, synthesizing one from country and activity defaults when the lookup
// chain misses or the database blows its budget. Before this, such a row left
// the site as bare numbers indistinguishable from a measurement.
import { deriveCoverageTier } from "@/components/CoverageIndicator";
// What each tier MEANS, shared with the social card at /og/cell so the two
// cannot drift. They already did once, on the card's `estimated` gloss.
import { COVERAGE_TIER_COPY } from "@/lib/coverage_tier_copy";
import { getSessionTier } from "@/lib/monetization/entitlement";
import { isGatingEnabled, isAuthEnabled } from "@/lib/feature_flags";

// Slug shape — same as /api/go. Anything that doesn't match returns
// 400 fast so a malformed param can't burn a Supabase round-trip.
const SLUG_RE = /^[a-z0-9-]+$/;

export async function GET(req: NextRequest) {
  // Per-IP rate limit. Each call does a getCellBySlug (which can be
  // a 500ms+ Supabase query) plus optionally getCellVariants. Without
  // a cap, a script can pin function CPU on Vercel by looping this
  // endpoint with `?history=1` and varying params to defeat the
  // CDN cache.
  const ip = clientIp(req);
  const rl = checkRateLimit("export-csv", ip, { limit: 20, windowMs: 60_000 });
  if (!rl.allowed) {
    return new NextResponse("Too many requests", {
      status: 429,
      headers: { "Retry-After": String(rl.retryAfter) },
    });
  }

  const url = new URL(req.url);
  const country = (url.searchParams.get("country") || "").toLowerCase();
  const region = (url.searchParams.get("region") || "").toLowerCase();
  const industry = (url.searchParams.get("industry") || "").toLowerCase();
  const includeHistory = url.searchParams.get("history") === "1";

  if (
    !SLUG_RE.test(country) ||
    !SLUG_RE.test(region) ||
    !SLUG_RE.test(industry)
  ) {
    return new NextResponse("Missing or invalid country/region/industry", { status: 400 });
  }
  const cell = await getCellBySlug(country, region, industry);
  if (!cell) {
    return new NextResponse("Not found", { status: 404 });
  }

  const lines: string[] = [];
  // Watermark / citation header
  lines.push(`# Margin Atlas: exported ${new Date().toISOString().slice(0, 10)}`);
  lines.push(`# Source: marginatlas.com/${country}/${region}/${industry}`);
  lines.push(`# Free-tier export. Cite Margin Atlas when used in published work.`);
  lines.push("");
  // The column key. Without it this file is unreadable: "n_enterprises 990"
  // beside "n_employees 4" reads as a contradiction until you know the second
  // is per firm. A number whose unit is not stated is not a published figure.
  lines.push(`# Columns`);
  lines.push(`#   country                   ISO 3166-1 alpha-2`);
  lines.push(`#   region                    city or region`);
  lines.push(`#   industry                  activity`);
  lines.push(`#   year                      reference year`);
  lines.push(`#   size_band                 employee band this row describes; "total" is all bands`);
  lines.push(`#   coverage                  how this row was produced; see below`);
  lines.push(`#   n_enterprises             firms in this cell, count`);
  lines.push(`#   n_employees               employees per firm, typical`);
  lines.push(`#   revenue_per_firm_usd      USD per year, per firm, typical`);
  lines.push(`#   rev_p10_usd .. rev_p90_usd  USD per year, per firm, across the spread`);
  lines.push(`#   payroll_per_employee_usd  USD per year, per employee`);
  lines.push(`#   quality_score             0 to 100, our confidence in this row`);
  lines.push(`#`);
  // The tier is the whole point of the export carrying provenance at all. The
  // four words are the site's own published vocabulary, derived, never a raw
  // database string. An empty cell in the revenue columns plus "modeled" is a
  // truthful pair; the numbers alone were not.
  lines.push(`# coverage values`);
  // Generated from the shared map, not retyped here. Byte-identical to the
  // hand-written block it replaces (the tier name is padded to a column of 11
  // exactly as before); the point is that the wording now has one owner.
  for (const [tier, copy] of Object.entries(COVERAGE_TIER_COPY)) {
    lines.push(`#   ${tier.padEnd(11)}${copy.long}`);
  }
  lines.push("");
  lines.push(
    [
      "country", "region", "industry", "year", "size_band",
      "coverage",
      "n_enterprises", "n_employees",
      "revenue_per_firm_usd", "rev_p10_usd", "rev_p25_usd", "rev_p50_usd",
      "rev_p75_usd", "rev_p90_usd",
      "payroll_per_employee_usd", "quality_score",
    ].join(",")
  );

  function fmt(v: string | number | null | undefined): string {
    if (v == null) return "";
    if (typeof v === "number") return String(v);
    if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
    return v;
  }

  type FetchedCell = NonNullable<typeof cell>;
  function row(c: FetchedCell) {
    return [
      c.country, c.geo_name || "", c.industry_name || industry, c.year, c.size_band || "",
      deriveCoverageTier(c),
      c.n_enterprises, c.n_employees,
      c.revenue_per_firm, c.rev_p10, c.rev_p25, c.rev_p50, c.rev_p75, c.rev_p90,
      c.payroll_per_employee, c.quality_score,
    ].map(fmt).join(",");
  }

  lines.push(row(cell as FetchedCell));

  // Premium gate on the year-by-year history export (Milestone 3, dormant). With
  // the gate off it stays free for everyone, exactly as today. With the gate on
  // the time series is a Premium unlock; a history request is then resolved
  // per-user and never edge-cached (see the cache header below), so one viewer's
  // entitlement is never served to another from the shared cache.
  const historyIsGated = includeHistory && isGatingEnabled() && isAuthEnabled();
  const allowHistory =
    includeHistory && (!historyIsGated || (await getSessionTier()) === "premium");

  if (allowHistory) {
    const variants = await getCellVariants(country, region, industry);
    const ts = buildTimeSeries(variants);
    if (ts.length > 1) {
      lines.push("");
      lines.push("# Time series (typical revenue per firm by year)");
      lines.push("year,revenue_per_firm_usd,n_enterprises,n_employees,payroll_per_employee_usd");
      for (const p of ts) {
        lines.push(
          [p.year, p.revenue_per_firm, p.n_enterprises, p.n_employees, p.payroll_per_employee].map(fmt).join(",")
        );
      }
    }
  } else if (historyIsGated) {
    lines.push("");
    lines.push(
      "# Year-by-year history is a Premium export. Upgrade at marginatlas.com/pricing",
    );
  }

  const filename = `atlas-${slugify(country)}-${slugify(region)}-${industryToSlug(industry)}.csv`;
  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      // The free single-row export stays edge-cached; a per-user gated history
      // response must not be shared across viewers.
      "Cache-Control": historyIsGated ? "private, no-store" : "public, max-age=3600",
    },
  });
}
