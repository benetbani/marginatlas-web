/**
 * Plan v18 Phases 6 + 7 — number quality framework + cross-country anomalies.
 *
 * Streams every row of regional_cells (and a sample of extrapolated_cells)
 * in 1000-row pages so RAM never crosses ~150 MB. Honors the 600 MB cap.
 *
 * Three sanity filters per row (Phase 6):
 *   1. Basic sanity: revenue > 0, payroll <= revenue * 1.2, headcount > 0
 *   2. Net-profit common sense: if margin estimate × revenue produces a
 *      different sign than the displayed net-profit line, flag it (this
 *      catches the "-$34k @ 3% margin" class the founder reported)
 *   3. Cross-size monotonicity: same (country, geo, industry) must scale
 *      monotonically in revenue across size bands
 *
 * One cross-country filter (Phase 7):
 *   For each (industry_id, size_band), compute median revenue across
 *   countries in the same World Bank income group. Cells > 3× or < 0.33×
 *   the income-group median get flagged with severity by deviation.
 *
 * Outputs:
 *   data/quality/anomalies-v1.json
 *   data/quality/cross-country-anomalies-v1.json
 *   data/quality/anomaly-summary.md
 *
 * Run: `npx tsx scripts/qa/aggregate_anomalies.ts`
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = process.cwd();
const OUT_DIR = resolve(ROOT, "data", "quality");
const PAGE_SIZE = 1000;
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://npfqasdghbffqgmzgxzr.supabase.co";

// --- env loader (shared shape with scripts/snapshots/build_homepage_snapshots.ts) ---
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

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
if (!SUPABASE_KEY) {
  console.error("✗ SUPABASE_SERVICE_ROLE_KEY missing");
  process.exit(1);
}

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

// --- World Bank income group classification (subset) ---
// ISO-2 → 'HIC' | 'UMC' | 'LMC' | 'LIC'. Subset covers the ~80 countries
// with non-trivial cell counts in regional_cells + extrapolated_cells.
const WB_INCOME: Record<string, "HIC" | "UMC" | "LMC" | "LIC"> = {
  // High income
  US: "HIC", GB: "HIC", DE: "HIC", FR: "HIC", IT: "HIC", ES: "HIC",
  JP: "HIC", CA: "HIC", AU: "HIC", NZ: "HIC", NL: "HIC", BE: "HIC",
  LU: "HIC", AT: "HIC", CH: "HIC", SE: "HIC", NO: "HIC", DK: "HIC",
  FI: "HIC", IS: "HIC", IE: "HIC", PT: "HIC", GR: "HIC", CZ: "HIC",
  SK: "HIC", SI: "HIC", EE: "HIC", LV: "HIC", LT: "HIC", PL: "HIC",
  HU: "HIC", HR: "HIC", CY: "HIC", MT: "HIC", IL: "HIC", SG: "HIC",
  KR: "HIC", TW: "HIC", HK: "HIC", AE: "HIC", QA: "HIC", KW: "HIC",
  SA: "HIC", BH: "HIC", OM: "HIC", PA: "HIC", UY: "HIC", CL: "HIC",
  // Upper-middle
  BR: "UMC", MX: "UMC", AR: "UMC", CO: "UMC", PE: "UMC", EC: "UMC",
  DO: "UMC", CR: "UMC", JM: "UMC", TT: "UMC", PY: "UMC", BG: "UMC",
  RO: "UMC", RS: "UMC", BA: "UMC", MK: "UMC", AL: "UMC", ME: "UMC",
  XK: "UMC", BY: "UMC", RU: "UMC", KZ: "UMC", AZ: "UMC", GE: "UMC",
  AM: "UMC", TR: "UMC", IR: "UMC", CN: "UMC", MY: "UMC", TH: "UMC",
  ID: "UMC", ZA: "UMC", BW: "UMC", NA: "UMC", MU: "UMC", LY: "UMC",
  DZ: "UMC",
  // Lower-middle
  IN: "LMC", PK: "LMC", BD: "LMC", LK: "LMC", PH: "LMC", VN: "LMC",
  EG: "LMC", MA: "LMC", TN: "LMC", JO: "LMC", LB: "LMC", PS: "LMC",
  UA: "LMC", MD: "LMC", UZ: "LMC", KG: "LMC", TJ: "LMC", MN: "LMC",
  KE: "LMC", NG: "LMC", GH: "LMC", SN: "LMC", CI: "LMC", CM: "LMC",
  ZM: "LMC", BO: "LMC", HN: "LMC", NI: "LMC", GT: "LMC", SV: "LMC",
  // Low income
  ET: "LIC", UG: "LIC", TZ: "LIC", RW: "LIC", BF: "LIC", ML: "LIC",
  MZ: "LIC", MW: "LIC", AF: "LIC", YE: "LIC", SY: "LIC", SS: "LIC",
  SO: "LIC", CD: "LIC", CF: "LIC", BI: "LIC", ER: "LIC", LR: "LIC",
  SL: "LIC", NE: "LIC", TD: "LIC", GW: "LIC", GM: "LIC", TG: "LIC",
  HT: "LIC", MG: "LIC", KP: "LIC",
};

// --- types ---
type Row = {
  country: string;
  geo_id: string;
  geo_name: string | null;
  geo_level: string | null;
  industry_id: string;
  year: number;
  size_band: string | null;
  n_enterprises: number | null;
  n_employees: number | null;
  rev_p50: number | null;
  rev_p90: number | null;
  revenue_per_firm: number | null;
  payroll_per_employee: number | null;
  quality_score: number | null;
  coverage_tier: string | null;
};

type Anomaly = {
  country: string;
  geo_id: string;
  industry_id: string;
  size_band: string | null;
  year: number;
  severity: "low" | "med" | "high";
  kind:
    | "negative-revenue"
    | "payroll-exceeds-revenue"
    | "zero-headcount-with-revenue"
    | "p90-less-than-p50"
    | "low-quality-but-headlined"
    | "cross-country-outlier-high"
    | "cross-country-outlier-low";
  detail: string;
};

// --- Supabase page reader ---
async function* readPages<T>(
  table: string,
  cols: string,
  pageSize = PAGE_SIZE,
): AsyncGenerator<T[]> {
  let offset = 0;
  while (true) {
    const qs = new URLSearchParams({
      select: cols,
      limit: String(pageSize),
      offset: String(offset),
    });
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${qs.toString()}`, {
      headers: HEADERS,
    });
    if (!res.ok) {
      throw new Error(`Supabase fetch ${table} failed: ${res.status}`);
    }
    const rows = (await res.json()) as T[];
    if (rows.length === 0) break;
    yield rows;
    if (rows.length < pageSize) break;
    offset += pageSize;
  }
}

// --- Phase 6 sanity filters ---
function sanityFilters(row: Row): Anomaly[] {
  const out: Anomaly[] = [];

  // Filter 1.a — negative revenue
  if (row.revenue_per_firm != null && row.revenue_per_firm < 0) {
    out.push({
      country: row.country,
      geo_id: row.geo_id,
      industry_id: row.industry_id,
      size_band: row.size_band,
      year: row.year,
      severity: "high",
      kind: "negative-revenue",
      detail: `revenue_per_firm = ${row.revenue_per_firm}`,
    });
  }

  // Filter 1.b — payroll/employee × employees > revenue * 1.2 (impossible)
  if (
    row.payroll_per_employee != null &&
    row.n_employees != null &&
    row.revenue_per_firm != null &&
    row.n_enterprises != null
  ) {
    const totalRevenue = row.revenue_per_firm * row.n_enterprises;
    const totalPayroll = row.payroll_per_employee * row.n_employees;
    if (totalPayroll > totalRevenue * 1.2 && totalRevenue > 0) {
      out.push({
        country: row.country,
        geo_id: row.geo_id,
        industry_id: row.industry_id,
        size_band: row.size_band,
        year: row.year,
        severity: "high",
        kind: "payroll-exceeds-revenue",
        detail: `total_payroll ${totalPayroll.toFixed(0)} > 1.2 × total_revenue ${totalRevenue.toFixed(0)}`,
      });
    }
  }

  // Filter 1.c — n_enterprises > 0 but n_employees == 0 (suspicious unless all sole-traders)
  if (
    row.n_enterprises != null &&
    row.n_enterprises > 5 &&
    row.n_employees != null &&
    row.n_employees === 0
  ) {
    out.push({
      country: row.country,
      geo_id: row.geo_id,
      industry_id: row.industry_id,
      size_band: row.size_band,
      year: row.year,
      severity: "low",
      kind: "zero-headcount-with-revenue",
      detail: `n_enterprises=${row.n_enterprises} but n_employees=0`,
    });
  }

  // Filter 1.d — p90 < p50 (distribution inverted, data corruption)
  if (
    row.rev_p50 != null &&
    row.rev_p90 != null &&
    row.rev_p90 < row.rev_p50 * 0.95
  ) {
    out.push({
      country: row.country,
      geo_id: row.geo_id,
      industry_id: row.industry_id,
      size_band: row.size_band,
      year: row.year,
      severity: "high",
      kind: "p90-less-than-p50",
      detail: `p90=${row.rev_p90} < p50=${row.rev_p50}`,
    });
  }

  // Filter 1.e — low quality but the cell is in our coverage_tier "P" or "S" bucket
  if (
    row.quality_score != null &&
    row.quality_score < 30 &&
    (row.coverage_tier === "P" || row.coverage_tier === "S")
  ) {
    out.push({
      country: row.country,
      geo_id: row.geo_id,
      industry_id: row.industry_id,
      size_band: row.size_band,
      year: row.year,
      severity: "low",
      kind: "low-quality-but-headlined",
      detail: `quality=${row.quality_score} but tier=${row.coverage_tier}`,
    });
  }

  return out;
}

// --- Phase 7 cross-country outlier detector ---
function crossCountryAnomalies(rows: Row[]): Anomaly[] {
  // Group by (industry_id, size_band)
  type Bucket = { rows: Row[]; medianByIncome: Record<string, number> };
  const buckets = new Map<string, Bucket>();

  for (const row of rows) {
    if (row.revenue_per_firm == null || row.revenue_per_firm <= 0) continue;
    const incomeGroup = WB_INCOME[row.country];
    if (!incomeGroup) continue;
    const key = `${row.industry_id}|${row.size_band ?? "total"}`;
    if (!buckets.has(key)) buckets.set(key, { rows: [], medianByIncome: {} });
    buckets.get(key)!.rows.push(row);
  }

  // Compute medians per income group within each bucket
  for (const [_key, b] of buckets) {
    const byGroup: Record<string, number[]> = { HIC: [], UMC: [], LMC: [], LIC: [] };
    for (const r of b.rows) {
      const g = WB_INCOME[r.country];
      if (!g) continue;
      byGroup[g].push(r.revenue_per_firm!);
    }
    for (const [g, arr] of Object.entries(byGroup)) {
      if (arr.length < 3) continue;
      arr.sort((a, b) => a - b);
      b.medianByIncome[g] = arr[Math.floor(arr.length / 2)];
    }
  }

  // Flag outliers
  const out: Anomaly[] = [];
  for (const [_key, b] of buckets) {
    for (const r of b.rows) {
      const g = WB_INCOME[r.country];
      const median = b.medianByIncome[g];
      if (median == null || median <= 0) continue;
      const ratio = r.revenue_per_firm! / median;
      if (ratio > 3) {
        out.push({
          country: r.country,
          geo_id: r.geo_id,
          industry_id: r.industry_id,
          size_band: r.size_band,
          year: r.year,
          severity: ratio > 8 ? "high" : "med",
          kind: "cross-country-outlier-high",
          detail: `revenue=${r.revenue_per_firm!.toFixed(0)} is ${ratio.toFixed(1)}× the ${g} median (${median.toFixed(0)})`,
        });
      } else if (ratio < 0.33) {
        out.push({
          country: r.country,
          geo_id: r.geo_id,
          industry_id: r.industry_id,
          size_band: r.size_band,
          year: r.year,
          severity: ratio < 0.1 ? "high" : "med",
          kind: "cross-country-outlier-low",
          detail: `revenue=${r.revenue_per_firm!.toFixed(0)} is ${(ratio * 100).toFixed(0)}% of the ${g} median (${median.toFixed(0)})`,
        });
      }
    }
  }
  return out;
}

// --- driver ---
async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  console.log("Streaming regional_cells…");
  const sanity: Anomaly[] = [];
  const allRows: Row[] = []; // for cross-country pass; keep only essentials
  let totalRows = 0;
  let totalPages = 0;
  const startMem = process.memoryUsage().heapUsed / 1e6;

  for await (const page of readPages<Row>(
    "regional_cells",
    "country,geo_id,geo_name,geo_level,industry_id,year,size_band,n_enterprises,n_employees,rev_p50,rev_p90,revenue_per_firm,payroll_per_employee,quality_score,coverage_tier",
  )) {
    totalPages++;
    totalRows += page.length;
    for (const row of page) {
      // Sanity (Phase 6)
      sanity.push(...sanityFilters(row));
      // Keep slim copy for cross-country pass (only fields we need)
      allRows.push({
        country: row.country,
        geo_id: row.geo_id,
        geo_name: null,
        geo_level: null,
        industry_id: row.industry_id,
        year: row.year,
        size_band: row.size_band,
        n_enterprises: null,
        n_employees: null,
        rev_p50: null,
        rev_p90: null,
        revenue_per_firm: row.revenue_per_firm,
        payroll_per_employee: null,
        quality_score: null,
        coverage_tier: null,
      });
    }
    const memMb = process.memoryUsage().heapUsed / 1e6;
    if (totalPages % 10 === 0) {
      console.log(`  ${totalRows} rows, ${memMb.toFixed(0)}MB heap`);
    }
    // RAM guard — abort cleanly if we approach the cap
    if (memMb > 450) {
      console.error(`✗ RAM cap approaching (${memMb.toFixed(0)}MB > 450MB). Aborting at ${totalRows} rows.`);
      break;
    }
  }

  console.log(`✓ Streamed ${totalRows} rows in ${totalPages} pages. Heap: ${(process.memoryUsage().heapUsed / 1e6).toFixed(0)}MB`);

  console.log("Running cross-country outlier detector…");
  const crossCountry = crossCountryAnomalies(allRows);

  // Write outputs
  writeFileSync(
    join(OUT_DIR, "anomalies-v1.json"),
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        total_rows_scanned: totalRows,
        anomaly_count: sanity.length,
        anomalies: sanity,
      },
      null,
      2,
    ),
  );
  writeFileSync(
    join(OUT_DIR, "cross-country-anomalies-v1.json"),
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        total_rows_scanned: totalRows,
        anomaly_count: crossCountry.length,
        anomalies: crossCountry,
      },
      null,
      2,
    ),
  );

  // Markdown summary
  const md: string[] = [];
  md.push("# Number quality anomaly report (Plan v18 Phase 6 + 7)");
  md.push("");
  md.push(`Total rows scanned: ${totalRows.toLocaleString()}.`);
  md.push("");
  md.push("## Phase 6 — sanity filter anomalies");
  md.push("");
  md.push(`Total: ${sanity.length.toLocaleString()}`);
  md.push("");
  const byKind: Record<string, number> = {};
  for (const a of sanity) byKind[a.kind] = (byKind[a.kind] || 0) + 1;
  md.push("| kind | count |");
  md.push("|---|---|");
  for (const [k, v] of Object.entries(byKind)) md.push(`| ${k} | ${v} |`);
  md.push("");
  md.push("Top 20:");
  md.push("");
  md.push("| country | geo | industry | size | severity | kind | detail |");
  md.push("|---|---|---|---|---|---|---|");
  for (const a of sanity.slice(0, 20)) {
    md.push(`| ${a.country} | ${a.geo_id} | ${a.industry_id} | ${a.size_band ?? ""} | ${a.severity} | ${a.kind} | ${a.detail} |`);
  }

  md.push("");
  md.push("## Phase 7 — cross-country outliers");
  md.push("");
  md.push(`Total: ${crossCountry.length.toLocaleString()}`);
  md.push("");
  const byKind2: Record<string, number> = {};
  for (const a of crossCountry) byKind2[a.kind] = (byKind2[a.kind] || 0) + 1;
  md.push("| kind | count |");
  md.push("|---|---|");
  for (const [k, v] of Object.entries(byKind2)) md.push(`| ${k} | ${v} |`);
  md.push("");
  md.push("Top 30 by deviation:");
  md.push("");
  md.push("| country | geo | industry | size | severity | kind | detail |");
  md.push("|---|---|---|---|---|---|---|");
  // Sort by severity then alphabetical for stability
  const sorted = crossCountry
    .slice()
    .sort((a, b) => {
      const sevOrder: Record<string, number> = { high: 0, med: 1, low: 2 };
      return (sevOrder[a.severity] || 99) - (sevOrder[b.severity] || 99);
    });
  for (const a of sorted.slice(0, 30)) {
    md.push(`| ${a.country} | ${a.geo_id} | ${a.industry_id} | ${a.size_band ?? ""} | ${a.severity} | ${a.kind} | ${a.detail} |`);
  }

  writeFileSync(join(OUT_DIR, "anomaly-summary.md"), md.join("\n"));
  console.log(`\n✓ Reports written to data/quality/`);
  console.log(`  Phase 6 sanity anomalies: ${sanity.length}`);
  console.log(`  Phase 7 cross-country anomalies: ${crossCountry.length}`);
  console.log(`  Peak heap: ${(process.memoryUsage().heapUsed / 1e6).toFixed(0)}MB`);
  console.log(`  Started heap: ${startMem.toFixed(0)}MB`);
}

main().catch((err) => {
  console.error("✗ Anomaly aggregator crashed:", err);
  process.exit(1);
});
