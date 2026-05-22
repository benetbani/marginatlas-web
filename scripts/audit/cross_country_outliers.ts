/**
 * Plan v24 Block 1.2 — cross-country outlier detector.
 *
 * For each industry, computes the global median revenue across all
 * countries with data, then flags countries whose revenue deviates more
 * than 10x in either direction. Severity = log10 of the deviation
 * ratio.
 *
 * Different from scale_sanity.ts: that one catches absolute SMB-physical
 * violations. This one catches RELATIVE outliers within an industry.
 *
 * Output:
 *   data/quality/cross_country_outliers_v1.json
 *   data/quality/industry_medians_v1.json
 *   data/quality/cross_country_outliers_REPORT.md
 *
 * Honors 600MB RAM cap (D-055).
 *
 * Run: `npx tsx scripts/audit/cross_country_outliers.ts`
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = process.cwd();
const OUT_DIR = resolve(ROOT, "data", "quality");

function loadEnvLocal() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  try {
    const text = readFileSync(resolve(ROOT, ".env.local"), "utf-8");
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq < 0) continue;
      const key = line.slice(0, eq).trim();
      const value = line.slice(eq + 1).trim();
      if (key === "SUPABASE_SERVICE_ROLE_KEY" && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        process.env.SUPABASE_SERVICE_ROLE_KEY = value;
      }
    }
  } catch {
    /* ignore */
  }
}
loadEnvLocal();

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://npfqasdghbffqgmzgxzr.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
if (!SUPABASE_KEY) {
  console.error("✗ SUPABASE_SERVICE_ROLE_KEY missing");
  process.exit(1);
}
const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

const DEVIATION_THRESHOLD = 10; // 10x median in either direction
const MIN_COUNTRIES_PER_INDUSTRY = 8; // require at least 8 data points for a stable median

type Row = {
  country: string;
  geo_id: string;
  geo_name: string | null;
  industry_id: string;
  revenue_per_firm: number | null;
  rev_p50: number | null;
};

type Outlier = {
  country: string;
  geo_id: string;
  geo_name: string | null;
  industry_id: string;
  value: number;
  median: number;
  ratio: number;
  severity: number; // log10(ratio), positive = too-high, negative = too-low
  countries_in_sample: number;
};

async function* readPages(): AsyncGenerator<Row[]> {
  let offset = 0;
  const pageSize = 1000;
  while (true) {
    const qs = new URLSearchParams({
      select: "country,geo_id,geo_name,industry_id,revenue_per_firm,rev_p50",
      limit: String(pageSize),
      offset: String(offset),
    });
    const res = await fetch(`${SUPABASE_URL}/rest/v1/regional_cells?${qs.toString()}`, {
      headers: HEADERS,
    });
    if (!res.ok) throw new Error(`Supabase fetch failed: ${res.status}`);
    const rows = (await res.json()) as Row[];
    if (rows.length === 0) break;
    yield rows;
    if (rows.length < pageSize) break;
    offset += pageSize;
  }
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return (sorted[mid - 1] + sorted[mid]) / 2;
  return sorted[mid];
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  // First pass: collect all revenue values grouped by (industry, country)
  // Use country-level aggregate (median across geos within country) so a
  // country with many counties doesn't dominate the global median.
  console.log("Pass 1: building per-(industry, country) revenue distributions…");
  const byIndCountry = new Map<string, Map<string, number[]>>();
  let totalRows = 0;
  let totalPages = 0;

  for await (const page of readPages()) {
    totalPages++;
    totalRows += page.length;
    for (const r of page) {
      const country = (r.country || "").toUpperCase();
      const industry = r.industry_id || "";
      const value = r.revenue_per_firm ?? r.rev_p50;
      if (!country || !industry || value == null || value <= 0) continue;
      if (!byIndCountry.has(industry)) byIndCountry.set(industry, new Map());
      const inner = byIndCountry.get(industry)!;
      if (!inner.has(country)) inner.set(country, []);
      inner.get(country)!.push(value);
    }
    if (totalPages % 25 === 0) {
      const memMb = process.memoryUsage().heapUsed / 1e6;
      console.log(`  page ${totalPages}: ${totalRows} rows, ${byIndCountry.size} industries, ${memMb.toFixed(0)}MB heap`);
      if (memMb > 450) {
        console.error("✗ RAM cap approaching, exiting");
        break;
      }
    }
  }
  console.log(`✓ Pass 1: ${totalRows} rows scanned`);

  // Second pass: for each industry, compute country medians and the global median
  console.log("Pass 2: computing country medians + global median per industry…");
  const industryMedians: Record<string, { global_median: number; country_medians: Record<string, number>; sample_size: number }> = {};
  for (const [industry, countryMap] of byIndCountry) {
    if (countryMap.size < MIN_COUNTRIES_PER_INDUSTRY) continue;
    const countryMedians: Record<string, number> = {};
    for (const [country, values] of countryMap) {
      countryMedians[country] = median(values);
    }
    const globalMedian = median(Object.values(countryMedians));
    industryMedians[industry] = {
      global_median: globalMedian,
      country_medians: countryMedians,
      sample_size: countryMap.size,
    };
  }
  console.log(`✓ ${Object.keys(industryMedians).length} industries with enough countries for a stable median`);

  // Third pass: flag outliers (cells whose country median deviates > 10x from global)
  console.log("Pass 3: flagging outliers…");
  const outliers: Outlier[] = [];
  for (const [industry, info] of Object.entries(industryMedians)) {
    if (info.global_median <= 0) continue;
    for (const [country, countryMedian] of Object.entries(info.country_medians)) {
      const ratio = countryMedian / info.global_median;
      if (ratio < 1 / DEVIATION_THRESHOLD || ratio > DEVIATION_THRESHOLD) {
        // Find a representative geo_id + name from the original rows
        const countryRows = byIndCountry.get(industry)?.get(country) || [];
        // Re-scan for the country's name (we lost it in aggregation)
        // For simplicity, use the country code as the name reference
        outliers.push({
          country,
          geo_id: "(country-level aggregate)",
          geo_name: null,
          industry_id: industry,
          value: countryMedian,
          median: info.global_median,
          ratio,
          severity: Math.log10(Math.max(ratio, 1 / ratio)),
          countries_in_sample: info.sample_size,
        });
        countryRows; // silence unused
      }
    }
  }
  outliers.sort((a, b) => b.severity - a.severity);
  console.log(`✓ ${outliers.length} outlier flags`);

  // Output
  writeFileSync(
    join(OUT_DIR, "industry_medians_v1.json"),
    JSON.stringify(
      { generated_at: new Date().toISOString(), industries: industryMedians },
      null,
      2,
    ),
  );
  writeFileSync(
    join(OUT_DIR, "cross_country_outliers_v1.json"),
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        deviation_threshold: DEVIATION_THRESHOLD,
        min_countries_per_industry: MIN_COUNTRIES_PER_INDUSTRY,
        total: outliers.length,
        outliers,
      },
      null,
      2,
    ),
  );

  // Markdown report
  const lines: string[] = [];
  lines.push("# Cross-country outliers (Plan v24 Block 1.2)");
  lines.push("");
  lines.push(`Total outliers: ${outliers.length}`);
  lines.push(`Deviation threshold: ${DEVIATION_THRESHOLD}x median`);
  lines.push(`Minimum countries per industry for comparison: ${MIN_COUNTRIES_PER_INDUSTRY}`);
  lines.push("");
  lines.push("## Top 50 by severity");
  lines.push("");
  lines.push("| industry | country | country-median | global-median | ratio | severity | n-countries |");
  lines.push("|---|---|---|---|---|---|---|");
  for (const o of outliers.slice(0, 50)) {
    const cm = o.value > 1e6 ? `$${(o.value / 1e6).toFixed(2)}M` : `$${(o.value / 1e3).toFixed(0)}K`;
    const gm = o.median > 1e6 ? `$${(o.median / 1e6).toFixed(2)}M` : `$${(o.median / 1e3).toFixed(0)}K`;
    lines.push(`| ${o.industry_id} | ${o.country} | ${cm} | ${gm} | ${o.ratio.toFixed(2)}x | ${o.severity.toFixed(2)} | ${o.countries_in_sample} |`);
  }
  writeFileSync(join(OUT_DIR, "cross_country_outliers_REPORT.md"), lines.join("\n"));

  console.log(`\n  Wrote ${OUT_DIR}/industry_medians_v1.json`);
  console.log(`  Wrote ${OUT_DIR}/cross_country_outliers_v1.json`);
  console.log(`  Wrote ${OUT_DIR}/cross_country_outliers_REPORT.md`);
  console.log(`  Peak heap: ${(process.memoryUsage().heapUsed / 1e6).toFixed(0)}MB`);
}

main().catch((err) => {
  console.error("✗ Cross-country outlier scanner crashed:", err);
  process.exit(1);
});
