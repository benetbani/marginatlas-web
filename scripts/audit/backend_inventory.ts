/**
 * Backend sanity audit — full inventory of Supabase tables.
 *
 * Per-table:
 *   - total row count
 *   - distinct countries
 *   - row counts per country (top 30)
 *   - distinct industries
 *   - distinct geo levels
 *   - year coverage
 *   - quality_score distribution
 *   - null-rate on key fields
 *
 * Outputs: data/audit/backend_inventory.json + .md report
 * RAM budget: <100MB (D-055 / 600MB cap). Pages 1000 rows at a time,
 * streams counts, never materialises full table in memory.
 */
import { config } from "dotenv";
import { resolve, join } from "node:path";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
config({ path: resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const OUT_DIR = resolve(process.cwd(), "data", "audit");

type TableInventory = {
  table: string;
  total_rows: number | null;
  by_country: Record<string, number>;
  countries_count: number;
  industries_sample: string[];
  industries_count_approx: number;
  geo_levels: Record<string, number>;
  year_min: number | null;
  year_max: number | null;
  null_rates: Record<string, number>;
  quality_distribution: Record<string, number>;
  notes: string[];
};

async function countRows(table: string, filters?: Record<string, unknown>): Promise<number | null> {
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  if (filters) {
    for (const [k, v] of Object.entries(filters)) {
      q = q.eq(k, v);
    }
  }
  const { count, error } = await q;
  if (error) return null;
  return count;
}

async function inventoryCellsMaster(): Promise<TableInventory> {
  const inv: TableInventory = {
    table: "cells_master",
    total_rows: null,
    by_country: {},
    countries_count: 0,
    industries_sample: [],
    industries_count_approx: 0,
    geo_levels: {},
    year_min: null,
    year_max: null,
    null_rates: {},
    quality_distribution: {},
    notes: [],
  };

  inv.total_rows = await countRows("cells_master");

  // Countries
  const us = await countRows("cells_master", { country: "US" });
  if (us != null) inv.by_country["US"] = us;
  inv.countries_count = 1; // cells_master is US-only by design

  // Industry sample (top NAICS-6 by count, capped at 1000 rows)
  const { data: naicsSample } = await supabase
    .from("cells_master")
    .select("naics_6, industry_description")
    .not("naics_6", "is", null)
    .limit(1000);
  const seen = new Set<string>();
  for (const r of naicsSample || []) {
    if (r.naics_6 && !seen.has(r.naics_6 as string)) {
      seen.add(r.naics_6 as string);
      if (inv.industries_sample.length < 30) {
        inv.industries_sample.push(`${r.naics_6} ${(r.industry_description as string)?.slice(0, 60) || ""}`);
      }
    }
  }
  inv.industries_count_approx = seen.size;

  // Year coverage
  const { data: yearRows } = await supabase
    .from("cells_master")
    .select("year")
    .order("year", { ascending: true })
    .limit(1);
  if (yearRows?.[0]?.year) inv.year_min = yearRows[0].year as number;
  const { data: yearRows2 } = await supabase
    .from("cells_master")
    .select("year")
    .order("year", { ascending: false })
    .limit(1);
  if (yearRows2?.[0]?.year) inv.year_max = yearRows2[0].year as number;

  // Null rates on key fields (sampled from first 1000)
  const { data: nullSample } = await supabase
    .from("cells_master")
    .select("n, rev_p10, rev_p50, rev_p90, total_employment, mean_wage_per_employee_usd, quality_score")
    .limit(1000);
  if (nullSample) {
    for (const field of ["n", "rev_p10", "rev_p50", "rev_p90", "total_employment", "mean_wage_per_employee_usd", "quality_score"]) {
      const nullCount = nullSample.filter((r) => (r as Record<string, unknown>)[field] == null).length;
      inv.null_rates[field] = nullCount / nullSample.length;
    }
  }

  // Quality buckets (sampled from first 1000)
  const buckets: Record<string, number> = { lt_30: 0, "30_50": 0, "50_70": 0, "70_85": 0, gte_85: 0 };
  for (const r of nullSample || []) {
    const q = (r as Record<string, unknown>).quality_score as number | null;
    if (q == null) continue;
    if (q < 30) buckets.lt_30++;
    else if (q < 50) buckets["30_50"]++;
    else if (q < 70) buckets["50_70"]++;
    else if (q < 85) buckets["70_85"]++;
    else buckets.gte_85++;
  }
  inv.quality_distribution = buckets;

  inv.notes.push("US-only. NAICS-6 industry codes. State-level (geo_id = US-XX).");
  return inv;
}

async function inventoryRegionalCells(): Promise<TableInventory> {
  const inv: TableInventory = {
    table: "regional_cells",
    total_rows: null,
    by_country: {},
    countries_count: 0,
    industries_sample: [],
    industries_count_approx: 0,
    geo_levels: {},
    year_min: null,
    year_max: null,
    null_rates: {},
    quality_distribution: {},
    notes: [],
  };

  inv.total_rows = await countRows("regional_cells");

  // Per-country counts (sample of countries we expect)
  const COUNTRIES = [
    "US", "GB", "FR", "DE", "IT", "ES", "NL", "BE", "CH", "AT",
    "PL", "PT", "SE", "NO", "DK", "FI", "IE", "GR", "CZ", "HU",
    "RO", "TR", "RU", "JP", "KR", "CN", "IN", "BR", "MX", "AU",
    "NZ", "ZA", "EG", "AR", "CL", "CO", "PE", "MY", "SG", "TH",
    "ID", "PH", "VN", "AE", "SA", "IL", "QA",
  ];
  for (const c of COUNTRIES) {
    const n = await countRows("regional_cells", { country: c });
    if (n != null && n > 0) {
      inv.by_country[c] = n;
    }
  }
  inv.countries_count = Object.keys(inv.by_country).length;

  // Geo levels (sample first 2000)
  const { data: levelSample } = await supabase
    .from("regional_cells")
    .select("geo_level")
    .not("geo_level", "is", null)
    .limit(2000);
  for (const r of levelSample || []) {
    const lvl = (r.geo_level as string) || "unknown";
    inv.geo_levels[lvl] = (inv.geo_levels[lvl] || 0) + 1;
  }

  // Industries (sample distinct)
  const { data: indSample } = await supabase
    .from("regional_cells")
    .select("industry_id")
    .not("industry_id", "is", null)
    .limit(2000);
  const seenInd = new Set<string>();
  for (const r of indSample || []) {
    if (r.industry_id) seenInd.add(r.industry_id as string);
  }
  inv.industries_count_approx = seenInd.size;
  inv.industries_sample = Array.from(seenInd).slice(0, 40);

  // Year
  const { data: y1 } = await supabase.from("regional_cells").select("year").order("year", { ascending: true }).limit(1);
  if (y1?.[0]?.year) inv.year_min = y1[0].year as number;
  const { data: y2 } = await supabase.from("regional_cells").select("year").order("year", { ascending: false }).limit(1);
  if (y2?.[0]?.year) inv.year_max = y2[0].year as number;

  // Null rates
  const { data: nullSample } = await supabase
    .from("regional_cells")
    .select("n_enterprises, rev_p10, rev_p50, rev_p90, n_employees, payroll_per_employee, quality_score")
    .limit(1000);
  if (nullSample) {
    for (const field of ["n_enterprises", "rev_p10", "rev_p50", "rev_p90", "n_employees", "payroll_per_employee", "quality_score"]) {
      const nullCount = nullSample.filter((r) => (r as Record<string, unknown>)[field] == null).length;
      inv.null_rates[field] = nullCount / nullSample.length;
    }
  }

  // Quality bucket
  const buckets: Record<string, number> = { lt_30: 0, "30_50": 0, "50_70": 0, "70_85": 0, gte_85: 0 };
  for (const r of nullSample || []) {
    const q = (r as Record<string, unknown>).quality_score as number | null;
    if (q == null) continue;
    if (q < 30) buckets.lt_30++;
    else if (q < 50) buckets["30_50"]++;
    else if (q < 70) buckets["50_70"]++;
    else if (q < 85) buckets["70_85"]++;
    else buckets.gte_85++;
  }
  inv.quality_distribution = buckets;

  return inv;
}

async function inventoryExtrapolatedCells(): Promise<TableInventory> {
  const inv: TableInventory = {
    table: "extrapolated_cells",
    total_rows: null,
    by_country: {},
    countries_count: 0,
    industries_sample: [],
    industries_count_approx: 0,
    geo_levels: { country: 0 },
    year_min: null,
    year_max: null,
    null_rates: {},
    quality_distribution: {},
    notes: [],
  };

  inv.total_rows = await countRows("extrapolated_cells");

  // Distinct country_iso3 (sample 2000)
  const { data: ccSample } = await supabase
    .from("extrapolated_cells")
    .select("country_iso3")
    .not("country_iso3", "is", null)
    .limit(2000);
  for (const r of ccSample || []) {
    const c = r.country_iso3 as string;
    inv.by_country[c] = (inv.by_country[c] || 0) + 1;
  }
  inv.countries_count = Object.keys(inv.by_country).length;

  // Industries
  const { data: indSample } = await supabase
    .from("extrapolated_cells")
    .select("industry_id")
    .not("industry_id", "is", null)
    .limit(2000);
  const seenInd = new Set<string>();
  for (const r of indSample || []) {
    if (r.industry_id) seenInd.add(r.industry_id as string);
  }
  inv.industries_count_approx = seenInd.size;
  inv.industries_sample = Array.from(seenInd).slice(0, 40);

  // Year
  const { data: y1 } = await supabase.from("extrapolated_cells").select("year").order("year", { ascending: true }).limit(1);
  if (y1?.[0]?.year) inv.year_min = y1[0].year as number;
  const { data: y2 } = await supabase.from("extrapolated_cells").select("year").order("year", { ascending: false }).limit(1);
  if (y2?.[0]?.year) inv.year_max = y2[0].year as number;

  // Null rates
  const { data: nullSample } = await supabase
    .from("extrapolated_cells")
    .select("predicted_rev_per_firm, quality_score, coverage_tier")
    .limit(1000);
  if (nullSample) {
    for (const field of ["predicted_rev_per_firm", "quality_score", "coverage_tier"]) {
      const nullCount = nullSample.filter((r) => (r as Record<string, unknown>)[field] == null).length;
      inv.null_rates[field] = nullCount / nullSample.length;
    }
  }

  inv.notes.push("Country-level extrapolations. country_iso3 only (no sub-national).");
  return inv;
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  console.log("Probing Supabase tables...\n");

  console.log("1/3 cells_master...");
  const cm = await inventoryCellsMaster();
  console.log(`  total: ${cm.total_rows}, industries: ${cm.industries_count_approx}, year: ${cm.year_min}-${cm.year_max}`);

  console.log("2/3 regional_cells...");
  const rc = await inventoryRegionalCells();
  console.log(`  total: ${rc.total_rows}, countries: ${rc.countries_count}, industries: ${rc.industries_count_approx}`);

  console.log("3/3 extrapolated_cells...");
  const ec = await inventoryExtrapolatedCells();
  console.log(`  total: ${ec.total_rows}, countries: ${ec.countries_count}, industries: ${ec.industries_count_approx}`);

  const inventory = [cm, rc, ec];
  writeFileSync(
    join(OUT_DIR, "backend_inventory.json"),
    JSON.stringify(inventory, null, 2),
  );

  // Markdown report
  const md: string[] = [];
  md.push("# Backend inventory");
  md.push("");
  md.push(`Generated ${new Date().toISOString()}.`);
  md.push("");
  for (const t of inventory) {
    md.push(`## ${t.table}`);
    md.push("");
    md.push(`- Total rows: **${t.total_rows?.toLocaleString() || "unknown"}**`);
    md.push(`- Countries with data: ${t.countries_count}`);
    md.push(`- Industries (approx distinct): ${t.industries_count_approx}`);
    if (t.year_min !== null && t.year_max !== null) {
      md.push(`- Year range: ${t.year_min} - ${t.year_max}`);
    }
    md.push("");
    if (Object.keys(t.geo_levels).length > 0) {
      md.push("### Geo levels (sample)");
      md.push("");
      for (const [lvl, n] of Object.entries(t.geo_levels)) {
        md.push(`- ${lvl}: ${n}`);
      }
      md.push("");
    }
    md.push("### Top countries by row count");
    md.push("");
    const sorted = Object.entries(t.by_country).sort((a, b) => b[1] - a[1]);
    for (const [c, n] of sorted.slice(0, 25)) {
      md.push(`- ${c}: ${n.toLocaleString()}`);
    }
    md.push("");
    md.push("### Null rates (sampled from 1000 rows)");
    md.push("");
    for (const [field, rate] of Object.entries(t.null_rates)) {
      md.push(`- ${field}: ${(rate * 100).toFixed(1)}% null`);
    }
    md.push("");
    md.push("### Quality_score distribution (sampled)");
    md.push("");
    for (const [b, n] of Object.entries(t.quality_distribution)) {
      md.push(`- ${b}: ${n}`);
    }
    md.push("");
    if (t.industries_sample.length > 0) {
      md.push("### Industry sample");
      md.push("");
      for (const i of t.industries_sample.slice(0, 25)) {
        md.push(`- ${i}`);
      }
      md.push("");
    }
    if (t.notes.length > 0) {
      md.push("### Notes");
      md.push("");
      for (const n of t.notes) md.push(`- ${n}`);
      md.push("");
    }
  }
  writeFileSync(join(OUT_DIR, "backend_inventory.md"), md.join("\n"));

  console.log(`\n→ ${join(OUT_DIR, "backend_inventory.json")}`);
  console.log(`→ ${join(OUT_DIR, "backend_inventory.md")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
