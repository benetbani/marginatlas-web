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

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const country = (url.searchParams.get("country") || "").toLowerCase();
  const region = (url.searchParams.get("region") || "").toLowerCase();
  const industry = (url.searchParams.get("industry") || "").toLowerCase();
  const includeHistory = url.searchParams.get("history") === "1";

  if (!country || !region || !industry) {
    return new NextResponse("Missing country/region/industry", { status: 400 });
  }
  const cell = await getCellBySlug(country, region, industry);
  if (!cell) {
    return new NextResponse("Not found", { status: 404 });
  }

  const lines: string[] = [];
  // Watermark / citation header
  lines.push(`# Margin Atlas — exported ${new Date().toISOString().slice(0, 10)}`);
  lines.push(`# Source: marginatlas.com/${country}/${region}/${industry}`);
  lines.push(`# Free-tier export. Cite Margin Atlas when used in published work.`);
  lines.push("");
  lines.push(
    [
      "country", "region", "industry", "year", "size_band",
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
      c.n_enterprises, c.n_employees,
      c.revenue_per_firm, c.rev_p10, c.rev_p25, c.rev_p50, c.rev_p75, c.rev_p90,
      c.payroll_per_employee, c.quality_score,
    ].map(fmt).join(",");
  }

  lines.push(row(cell as FetchedCell));

  if (includeHistory) {
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
  }

  const filename = `atlas-${slugify(country)}-${slugify(region)}-${industryToSlug(industry)}.csv`;
  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
