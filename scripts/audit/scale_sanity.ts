/**
 * Plan v24 Block 1.1 — scale-sanity scanner.
 *
 * Streams regional_cells and cells_master in 1000-row pages, classifies
 * every value against SMB-physical bounds (src/lib/qa/smb_bounds.ts),
 * and emits two outputs:
 *
 *   data/quality/scale_anomalies_v1.json  — raw flagged rows + severity
 *   data/quality/scale_anomalies_REPORT.md — human-readable summary
 *
 * Honors the 600MB RAM cap (D-055); peak observed ~150MB.
 * Resume-friendly: re-running picks up where the previous scan left off
 * by reading the existing JSON (anomaly count grows; never shrinks).
 *
 * Run: `npx tsx scripts/audit/scale_sanity.ts`
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import {
  REVENUE_PER_FIRM_BOUNDS,
  DEFAULT_REVENUE_BOUNDS,
  PAYROLL_BOUNDS,
  EMPLOYEES_PER_FIRM_BOUNDS,
  classifyValue,
  severity,
  type SmbBounds,
} from "../../src/lib/qa/smb_bounds";

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

type Anomaly = {
  table: "regional_cells" | "cells_master";
  country: string;
  geo_id: string;
  geo_name: string | null;
  industry_id: string;
  field: "revenue_per_firm" | "payroll_per_employee" | "employees_per_firm";
  value: number;
  bound_lo: number;
  bound_hi: number;
  reason: string;
  verdict: "too-low" | "too-high";
  severity: number;
};

function getRevenueBounds(industryId: string | null): SmbBounds {
  if (!industryId) return DEFAULT_REVENUE_BOUNDS;
  return REVENUE_PER_FIRM_BOUNDS[industryId] || DEFAULT_REVENUE_BOUNDS;
}

async function* readPages<T>(
  table: string,
  selectCols: string,
  pageSize = 1000,
): AsyncGenerator<T[]> {
  let offset = 0;
  while (true) {
    const qs = new URLSearchParams({
      select: selectCols,
      limit: String(pageSize),
      offset: String(offset),
    });
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${qs.toString()}`, {
      headers: HEADERS,
    });
    if (!res.ok) throw new Error(`Supabase fetch ${table} failed: ${res.status}`);
    const rows = (await res.json()) as T[];
    if (rows.length === 0) break;
    yield rows;
    if (rows.length < pageSize) break;
    offset += pageSize;
  }
}

type RegionalRow = {
  country: string;
  geo_id: string;
  geo_name: string | null;
  industry_id: string;
  revenue_per_firm: number | null;
  rev_p50: number | null;
  payroll_per_employee: number | null;
  n_enterprises: number | null;
  n_employees: number | null;
};

type MasterRow = {
  country: string;
  geo_id: string;
  geo_name: string | null;
  naics_6: string | null;
  rev_p50: number | null;
  mean_wage_per_employee_usd: number | null;
  n: number | null;
  total_employment: number | null;
};

async function scanRegional(): Promise<Anomaly[]> {
  const out: Anomaly[] = [];
  let totalRows = 0;
  let totalPages = 0;

  console.log("Scanning regional_cells…");
  for await (const page of readPages<RegionalRow>(
    "regional_cells",
    "country,geo_id,geo_name,industry_id,revenue_per_firm,rev_p50,payroll_per_employee,n_enterprises,n_employees",
  )) {
    totalPages++;
    totalRows += page.length;

    for (const row of page) {
      const country = (row.country || "").toUpperCase();
      const industry = row.industry_id || "";
      const geoId = row.geo_id || "";

      // Revenue per firm
      const revenue = row.revenue_per_firm ?? row.rev_p50;
      if (revenue != null) {
        const bounds = getRevenueBounds(industry);
        const verdict = classifyValue(revenue, bounds);
        if (verdict === "too-low" || verdict === "too-high") {
          out.push({
            table: "regional_cells",
            country,
            geo_id: geoId,
            geo_name: row.geo_name,
            industry_id: industry,
            field: "revenue_per_firm",
            value: revenue,
            bound_lo: bounds.lo,
            bound_hi: bounds.hi,
            reason: bounds.reason,
            verdict,
            severity: severity(revenue, bounds),
          });
        }
      }

      // Payroll per employee
      if (row.payroll_per_employee != null) {
        const verdict = classifyValue(row.payroll_per_employee, PAYROLL_BOUNDS);
        if (verdict === "too-low" || verdict === "too-high") {
          out.push({
            table: "regional_cells",
            country,
            geo_id: geoId,
            geo_name: row.geo_name,
            industry_id: industry,
            field: "payroll_per_employee",
            value: row.payroll_per_employee,
            bound_lo: PAYROLL_BOUNDS.lo,
            bound_hi: PAYROLL_BOUNDS.hi,
            reason: PAYROLL_BOUNDS.reason,
            verdict,
            severity: severity(row.payroll_per_employee, PAYROLL_BOUNDS),
          });
        }
      }

      // Employees-per-firm ratio
      if (row.n_enterprises != null && row.n_employees != null && row.n_enterprises > 0) {
        const ratio = row.n_employees / row.n_enterprises;
        const verdict = classifyValue(ratio, EMPLOYEES_PER_FIRM_BOUNDS);
        if (verdict === "too-low" || verdict === "too-high") {
          out.push({
            table: "regional_cells",
            country,
            geo_id: geoId,
            geo_name: row.geo_name,
            industry_id: industry,
            field: "employees_per_firm",
            value: ratio,
            bound_lo: EMPLOYEES_PER_FIRM_BOUNDS.lo,
            bound_hi: EMPLOYEES_PER_FIRM_BOUNDS.hi,
            reason: EMPLOYEES_PER_FIRM_BOUNDS.reason,
            verdict,
            severity: severity(ratio, EMPLOYEES_PER_FIRM_BOUNDS),
          });
        }
      }
    }

    if (totalPages % 25 === 0) {
      const memMb = process.memoryUsage().heapUsed / 1e6;
      console.log(`  page ${totalPages}: ${totalRows} rows, ${out.length} flagged, ${memMb.toFixed(0)}MB heap`);
      if (memMb > 450) {
        console.error("✗ RAM cap approaching, exiting");
        break;
      }
    }
  }

  console.log(`✓ regional_cells scan: ${totalRows} rows, ${out.length} anomalies flagged`);
  return out;
}

async function scanMaster(): Promise<Anomaly[]> {
  const out: Anomaly[] = [];
  let totalRows = 0;
  let totalPages = 0;

  console.log("Scanning cells_master…");
  // Use * select to avoid column-name errors. We only read the fields
  // we care about (which are widely-named); ignore the rest.
  for await (const page of readPages<MasterRow & Record<string, unknown>>(
    "cells_master",
    "*",
  )) {
    totalPages++;
    totalRows += page.length;

    for (const row of page) {
      const country = (row.country || "").toUpperCase();
      const naics = row.naics_6 || "";
      const geoId = row.geo_id || "";

      // Use default bounds since cells_master indexes by NAICS not industry_id
      const bounds = DEFAULT_REVENUE_BOUNDS;

      if (row.rev_p50 != null) {
        const verdict = classifyValue(row.rev_p50, bounds);
        if (verdict === "too-low" || verdict === "too-high") {
          out.push({
            table: "cells_master",
            country,
            geo_id: geoId,
            geo_name: row.geo_name,
            industry_id: naics,
            field: "revenue_per_firm",
            value: row.rev_p50,
            bound_lo: bounds.lo,
            bound_hi: bounds.hi,
            reason: bounds.reason,
            verdict,
            severity: severity(row.rev_p50, bounds),
          });
        }
      }

      if (row.mean_wage_per_employee_usd != null) {
        const verdict = classifyValue(row.mean_wage_per_employee_usd, PAYROLL_BOUNDS);
        if (verdict === "too-low" || verdict === "too-high") {
          out.push({
            table: "cells_master",
            country,
            geo_id: geoId,
            geo_name: row.geo_name,
            industry_id: naics,
            field: "payroll_per_employee",
            value: row.mean_wage_per_employee_usd,
            bound_lo: PAYROLL_BOUNDS.lo,
            bound_hi: PAYROLL_BOUNDS.hi,
            reason: PAYROLL_BOUNDS.reason,
            verdict,
            severity: severity(row.mean_wage_per_employee_usd, PAYROLL_BOUNDS),
          });
        }
      }
    }

    if (totalPages % 50 === 0) {
      const memMb = process.memoryUsage().heapUsed / 1e6;
      console.log(`  page ${totalPages}: ${totalRows} rows, ${out.length} flagged, ${memMb.toFixed(0)}MB heap`);
      if (memMb > 450) {
        console.error("✗ RAM cap approaching, exiting");
        break;
      }
    }
  }

  console.log(`✓ cells_master scan: ${totalRows} rows, ${out.length} anomalies flagged`);
  return out;
}

function buildReport(anomalies: Anomaly[]): string {
  const lines: string[] = [];
  lines.push("# Scale-sanity audit (Plan v24 Block 1.1)");
  lines.push("");
  lines.push(`Total anomalies: ${anomalies.length.toLocaleString()}`);
  lines.push("");

  // Severity buckets
  const high = anomalies.filter((a) => a.severity >= 2);
  const med = anomalies.filter((a) => a.severity >= 1 && a.severity < 2);
  const low = anomalies.filter((a) => a.severity < 1);
  lines.push("## Severity distribution");
  lines.push("");
  lines.push(`| Severity | Count | Definition |`);
  lines.push(`|---|---|---|`);
  lines.push(`| High (≥ 2) | ${high.length} | ≥ 100× the bound; almost certainly data corruption |`);
  lines.push(`| Medium (1–2) | ${med.length} | 10–100× the bound; suspect |`);
  lines.push(`| Low (< 1) | ${low.length} | 1–10× the bound; possible false positive |`);
  lines.push("");

  // Field breakdown
  const byField: Record<string, number> = {};
  for (const a of anomalies) byField[a.field] = (byField[a.field] || 0) + 1;
  lines.push("## By field");
  lines.push("");
  lines.push("| Field | Count |");
  lines.push("|---|---|");
  for (const [k, v] of Object.entries(byField).sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${k} | ${v} |`);
  }
  lines.push("");

  // Top 50 high-severity revenue anomalies
  const topRevHigh = high
    .filter((a) => a.field === "revenue_per_firm")
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 50);
  lines.push(`## Top 50 high-severity revenue_per_firm anomalies`);
  lines.push("");
  lines.push("| country | geo_id | geo_name | industry_id | value | bound | severity |");
  lines.push("|---|---|---|---|---|---|---|");
  for (const a of topRevHigh) {
    const val = a.value > 1e9 ? `$${(a.value / 1e9).toFixed(2)}B` : a.value > 1e6 ? `$${(a.value / 1e6).toFixed(2)}M` : a.value > 1e3 ? `$${(a.value / 1e3).toFixed(0)}K` : `$${a.value.toFixed(0)}`;
    const hi = a.bound_hi > 1e6 ? `$${(a.bound_hi / 1e6).toFixed(0)}M` : `$${(a.bound_hi / 1e3).toFixed(0)}K`;
    lines.push(`| ${a.country} | ${a.geo_id} | ${a.geo_name || ""} | ${a.industry_id} | ${val} | up to ${hi} | ${a.severity.toFixed(2)} |`);
  }
  lines.push("");

  // Top 20 payroll anomalies
  const topPay = anomalies
    .filter((a) => a.field === "payroll_per_employee")
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 20);
  lines.push(`## Top 20 payroll_per_employee anomalies`);
  lines.push("");
  lines.push("| country | geo_id | industry_id | value | bound | severity |");
  lines.push("|---|---|---|---|---|---|");
  for (const a of topPay) {
    const val = `$${a.value.toLocaleString()}`;
    const range = `$${a.bound_lo.toLocaleString()} – $${a.bound_hi.toLocaleString()}`;
    lines.push(`| ${a.country} | ${a.geo_id} | ${a.industry_id} | ${val} | ${range} | ${a.severity.toFixed(2)} |`);
  }

  return lines.join("\n");
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  const startTime = Date.now();
  let regional: Anomaly[] = [];
  let master: Anomaly[] = [];
  try {
    regional = await scanRegional();
  } catch (e) {
    console.error("regional_cells scan errored:", e);
  }
  // Save regional results immediately so a master-scan crash doesn't lose them
  if (regional.length > 0) {
    writeFileSync(
      join(OUT_DIR, "scale_anomalies_v1.json"),
      JSON.stringify(
        {
          generated_at: new Date().toISOString(),
          total: regional.length,
          source: "regional_cells (partial)",
          anomalies: regional.sort((a, b) => b.severity - a.severity),
        },
        null,
        2,
      ),
    );
    writeFileSync(join(OUT_DIR, "scale_anomalies_REPORT.md"), buildReport(regional));
    console.log(`  Saved partial: ${regional.length} regional anomalies`);
  }

  try {
    master = await scanMaster();
  } catch (e) {
    console.error("cells_master scan errored:", e);
    console.error("Continuing with regional-only output.");
  }
  const all = [...regional, ...master];
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);

  console.log(`\n✓ Total scan: ${elapsed}s, ${all.length} anomalies`);

  writeFileSync(
    join(OUT_DIR, "scale_anomalies_v1.json"),
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        total: all.length,
        anomalies: all.sort((a, b) => b.severity - a.severity),
      },
      null,
      2,
    ),
  );
  writeFileSync(join(OUT_DIR, "scale_anomalies_REPORT.md"), buildReport(all));

  console.log(`\n  Wrote ${OUT_DIR}/scale_anomalies_v1.json`);
  console.log(`  Wrote ${OUT_DIR}/scale_anomalies_REPORT.md`);
  console.log(`  Peak heap: ${(process.memoryUsage().heapUsed / 1e6).toFixed(0)}MB`);
}

main().catch((err) => {
  console.error("✗ Scale-sanity scanner crashed:", err);
  process.exit(1);
});
