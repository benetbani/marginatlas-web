/**
 * Plan v28 Lane E — page sanity audit.
 *
 * Hits a representative sample of cell pages on the live site, parses
 * out the headline numbers (revenue per firm, median wage, net margin
 * if shown), and runs them through the same reasonableness checks the
 * page will apply at render. Outputs a triage list of violations.
 *
 * Run:
 *   npx tsx scripts/audit/page_sanity_audit.ts
 *   npx tsx scripts/audit/page_sanity_audit.ts --live
 *     # --live hits production URLs; otherwise the script analyzes the
 *     # database state directly via Supabase queries.
 */
import { config } from "dotenv";
import { resolve } from "node:path";
import { writeFileSync } from "node:fs";
config({ path: resolve(process.cwd(), ".env.local") });
import { createClient } from "@supabase/supabase-js";
import { checkReasonableness } from "../../src/lib/qa/reasonableness";
import marginCapsJson from "../../src/lib/finance/margin_caps.json";
import industriesJson from "../../src/lib/taxonomy/industries.json";

export {};

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type Cap = { typical_low: number; typical_high: number; investigate: number; hard_cap: number };
const CAPS = marginCapsJson as { default_fallback: Cap; sectors: Record<string, Cap> };
const INDUSTRY_TO_SECTOR = new Map<string, string>();
for (const ind of (industriesJson as { industries: Array<{ id: string; sector_id: string }> }).industries) {
  INDUSTRY_TO_SECTOR.set(ind.id, ind.sector_id);
}

type Issue = {
  table: string;
  iso3: string;
  industry: string;
  size_band: string | null;
  code: string;
  message: string;
  values: Record<string, number | string>;
};

const issues: Issue[] = [];

// Only SMB-relevant size bands. The GE250 band is explicitly above-SMB
// scale (enterprises with 250+ employees) and lives outside the SMB
// benchmark universe. TOTAL is an aggregate that doesn't represent a
// single firm size.
const SMB_SIZE_BANDS = new Set([
  "0-9", "10-19", "20-49", "50-249",
  "small", "medium", "large",
  null,
]);

// Country ISO3 prefix sanity: real sovereign states are 3-letter ISO-3166.
// "AFE", "MAR" (here meaning African region aggregates), "ARB", "ECS" are
// World Bank regional groupings, not countries — skip them.
const NON_COUNTRY_AGGREGATE_CODES = new Set([
  "AFE", "AFW", "ARB", "EAP", "EAR", "ECA", "ECS", "EMU", "EUU", "FCS",
  "HIC", "HPC", "IBD", "IBT", "IDA", "IDB", "IDX", "LAC", "LCN", "LDC",
  "LIC", "LMC", "LMY", "LTE", "MEA", "MIC", "NAC", "OED", "OSS", "PRE",
  "PSS", "PST", "SAS", "SSA", "SSF", "SST", "TEA", "TEC", "TLA", "TMN",
  "TSA", "TSS", "UMC", "WLD",
]);

async function probeExtrapolated() {
  console.log("Probing extrapolated_cells (SMB bands + sovereign states only)...");
  let from = 0;
  const PAGE = 1000;
  let probed = 0;
  let skippedAggregate = 0;
  let skippedSizeBand = 0;
  while (true) {
    const { data, error } = await sb
      .from("extrapolated_cells")
      .select("country_iso3, industry_id, predicted_rev_per_firm, size_band")
      .range(from, from + PAGE - 1);
    if (error) {
      console.error(`  error: ${error.message}`);
      return;
    }
    if (!data || data.length === 0) break;
    for (const r of data) {
      const sizeBand = (r.size_band as string) || null;
      if (!SMB_SIZE_BANDS.has(sizeBand)) {
        skippedSizeBand++;
        continue;
      }
      const iso3 = r.country_iso3 as string;
      if (NON_COUNTRY_AGGREGATE_CODES.has(iso3)) {
        skippedAggregate++;
        continue;
      }
      const rev = r.predicted_rev_per_firm as number | null;
      const issuesHere = checkReasonableness({
        iso2: null,
        industryId: r.industry_id as string,
        revenuePerFirm: rev,
      });
      for (const i of issuesHere) {
        issues.push({
          table: "extrapolated_cells",
          iso3,
          industry: r.industry_id as string,
          size_band: sizeBand,
          code: i.code,
          message: i.message,
          values: i.values || {},
        });
      }
      probed++;
    }
    from += PAGE;
    if (data.length < PAGE) break;
    if (from >= 50000) break;
  }
  console.log(`  Probed ${probed} SMB rows; skipped ${skippedSizeBand} non-SMB size bands and ${skippedAggregate} WB-regional aggregates.`);
  console.log(`  SMB issues found: ${issues.length}`);
}

async function probeRegional() {
  console.log("\nProbing regional_cells...");
  let from = 0;
  const PAGE = 1000;
  let probed = 0;
  const startCount = issues.length;
  while (true) {
    const { data, error } = await sb
      .from("regional_cells")
      .select("country, industry_id, geo_id, revenue_per_firm, payroll_per_employee, n_employees, n_enterprises, size_band")
      .range(from, from + PAGE - 1);
    if (error) {
      console.error(`  error: ${error.message}`);
      return;
    }
    if (!data || data.length === 0) break;
    for (const r of data) {
      const iso2 = (r.country as string) || "?";
      const sizeBand = (r.size_band as string) || null;
      if (!SMB_SIZE_BANDS.has(sizeBand)) continue;
      const issuesHere = checkReasonableness({
        iso2,
        industryId: r.industry_id as string,
        revenuePerFirm: r.revenue_per_firm as number | null,
        payrollPerEmployee: r.payroll_per_employee as number | null,
        totalEmployees: r.n_employees as number | null,
        totalEnterprises: r.n_enterprises as number | null,
      });
      for (const i of issuesHere) {
        issues.push({
          table: "regional_cells",
          iso3: iso2,
          industry: r.industry_id as string,
          size_band: sizeBand,
          code: i.code,
          message: i.message,
          values: { ...(i.values || {}), geo_id: (r.geo_id as string) || "?" },
        });
      }
      probed++;
    }
    from += PAGE;
    if (data.length < PAGE) break;
    if (from >= 30000) break;
  }
  console.log(`  Probed ${probed} regional_cells rows; found ${issues.length - startCount} issues.`);
}

async function main() {
  await probeExtrapolated();
  await probeRegional();

  // Aggregate
  const byCode = new Map<string, number>();
  const bySeverity = { block: 0, warn: 0 };
  for (const i of issues) {
    byCode.set(i.code, (byCode.get(i.code) || 0) + 1);
  }
  // Note: severity isn't recorded in the issue rows above; derive from code.
  const BLOCK_CODES = new Set(["rev_too_high_for_smb", "labor_share_absurd", "currency_likely_local"]);
  for (const i of issues) {
    if (BLOCK_CODES.has(i.code)) bySeverity.block++;
    else bySeverity.warn++;
  }

  console.log("\n=== Audit summary ===");
  console.log(`Total issues: ${issues.length}`);
  console.log(`  Block-severity: ${bySeverity.block}`);
  console.log(`  Warn-severity:  ${bySeverity.warn}`);
  console.log("\nBy code:");
  for (const [code, count] of [...byCode.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${code.padEnd(28)} ${count}`);
  }

  console.log("\nTop 20 block-severity issues:");
  const blocks = issues.filter((i) => BLOCK_CODES.has(i.code)).slice(0, 20);
  for (const i of blocks) {
    console.log(`  ${i.table} ${i.iso3} ${i.industry} ${i.size_band || ""} :: ${i.code}`);
  }

  // Write full report
  const reportPath = resolve(process.cwd(), "data/audit/page_sanity_audit_v1.json");
  writeFileSync(reportPath, JSON.stringify({
    generated_at: new Date().toISOString(),
    total_issues: issues.length,
    by_severity: bySeverity,
    by_code: Object.fromEntries(byCode),
    issues,
  }, null, 2));
  console.log(`\nFull report: ${reportPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
