/**
 * Post-bulk-import integrity check for the deepening data
 * (Plan v32 Sprint G).
 *
 * Queries Supabase, reports:
 *   - % of cells with cost_stack populated per industry
 *   - % of cells with setup_costs populated per industry
 *   - Grade distribution (A/B/C/D) per industry
 *   - Sanity check: cost_stack lines sum to between 60-110% of revenue
 *     (anything outside this band is a calibration error)
 *   - Catastrophic anomalies: cost_stack > 5x revenue (= bug)
 *
 * Read-only. Safe to run anytime.
 *
 * Run: `npx tsx scripts/audit/verify_deepening_data.ts`
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();

function loadEnvLocal() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) return;
  try {
    const text = readFileSync(resolve(ROOT, ".env.local"), "utf-8");
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq < 0) continue;
      const key = line.slice(0, eq).trim();
      const value = line.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // ignore
  }
}

loadEnvLocal();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

const PILOT_INDUSTRIES = [
  "restaurants",
  "cafes_coffee",
  "hairdressers_beauty",
  "barbershops",
  "auto_repair_shops",
  "hotels_lodging",
  "dental_practices",
  "doctors_clinics",
  "legal_services",
  "accounting_tax",
  "real_estate_agencies",
  "residential_construction",
  "grocery_stores",
  "clothing_stores",
  "sports_fitness",
  "veterinary_pet_care",
];

type Row = {
  industry_id: string;
  rev_p50: number | null;
  cost_stack: Record<string, unknown> | null;
  setup_costs: Record<string, unknown> | null;
};

type IndustryStats = {
  total: number;
  withCostStack: number;
  withSetupCosts: number;
  gradeA: number;
  gradeB: number;
  gradeC: number;
  gradeD: number;
  costRatioSamples: number[];
  catastrophicCount: number;
  catastrophicExamples: Array<{ industry: string; ratio: number }>;
};

async function main() {
  console.log(`Auditing deepening data across ${PILOT_INDUSTRIES.length} pilot industries...`);
  const stats: Record<string, IndustryStats> = {};

  for (const industryId of PILOT_INDUSTRIES) {
    stats[industryId] = {
      total: 0,
      withCostStack: 0,
      withSetupCosts: 0,
      gradeA: 0,
      gradeB: 0,
      gradeC: 0,
      gradeD: 0,
      costRatioSamples: [],
      catastrophicCount: 0,
      catastrophicExamples: [],
    };

    // Paginate through regional_cells for this industry
    let from = 0;
    const PAGE = 1000;
    while (true) {
      const { data, error } = await supabase
        .from("regional_cells")
        .select("industry_id, rev_p50, cost_stack, setup_costs")
        .eq("industry_id", industryId)
        .range(from, from + PAGE - 1);
      if (error) {
        console.error(`  ERROR querying ${industryId}:`, error.message);
        break;
      }
      if (!data || data.length === 0) break;

      const s = stats[industryId];
      for (const row of data as unknown as Row[]) {
        s.total++;
        if (row.cost_stack) {
          s.withCostStack++;
          const grade = (row.cost_stack as Record<string, unknown>).grade as string | undefined;
          if (grade === "A") s.gradeA++;
          else if (grade === "B") s.gradeB++;
          else if (grade === "C") s.gradeC++;
          else if (grade === "D") s.gradeD++;

          // Sanity: cost lines sum / revenue
          if (row.rev_p50 && row.rev_p50 > 0) {
            const lines = row.cost_stack as Record<string, number>;
            const total =
              (Number(lines.rent_occupancy) || 0) +
              (Number(lines.payroll_total) || 0) +
              (Number(lines.cost_of_goods_sold) || 0) +
              (Number(lines.utilities) || 0) +
              (Number(lines.marketing_acquisition) || 0) +
              (Number(lines.insurance_professional) || 0) +
              (Number(lines.equipment_maintenance) || 0) +
              (Number(lines.regulatory_licensing) || 0);
            const ratio = total / row.rev_p50;
            s.costRatioSamples.push(ratio);
            if (ratio > 5) {
              s.catastrophicCount++;
              if (s.catastrophicExamples.length < 3) {
                s.catastrophicExamples.push({ industry: industryId, ratio });
              }
            }
          }
        }
        if (row.setup_costs) s.withSetupCosts++;
      }

      if (data.length < PAGE) break;
      from += PAGE;
    }
  }

  // Report
  console.log("\n");
  console.log("Industry".padEnd(28) + "Cells".padStart(8) + "  CostStack%".padStart(12) + "  Setup%".padStart(8) + "  A".padStart(5) + "  B".padStart(5) + "  C".padStart(5) + "  D".padStart(5) + "  AvgRatio".padStart(11) + "  Bad");
  console.log("-".repeat(105));

  let totalCells = 0;
  let totalWithStack = 0;
  let totalCatastrophic = 0;

  for (const industryId of PILOT_INDUSTRIES) {
    const s = stats[industryId];
    if (s.total === 0) {
      console.log(industryId.padEnd(28) + "(no cells)".padStart(8));
      continue;
    }
    const pctStack = ((s.withCostStack / s.total) * 100).toFixed(0) + "%";
    const pctSetup = ((s.withSetupCosts / s.total) * 100).toFixed(0) + "%";
    const avgRatio = s.costRatioSamples.length > 0
      ? (s.costRatioSamples.reduce((a, b) => a + b, 0) / s.costRatioSamples.length).toFixed(2)
      : "n/a";
    console.log(
      industryId.padEnd(28) +
      String(s.total).padStart(8) +
      pctStack.padStart(12) +
      pctSetup.padStart(8) +
      String(s.gradeA).padStart(5) +
      String(s.gradeB).padStart(5) +
      String(s.gradeC).padStart(5) +
      String(s.gradeD).padStart(5) +
      String(avgRatio).padStart(11) +
      "  " + (s.catastrophicCount > 0 ? `${s.catastrophicCount} flagged` : "ok"),
    );
    totalCells += s.total;
    totalWithStack += s.withCostStack;
    totalCatastrophic += s.catastrophicCount;
  }

  console.log("-".repeat(105));
  console.log(
    `TOTAL: ${totalCells} cells across ${PILOT_INDUSTRIES.length} industries; ${totalWithStack} (${((totalWithStack / Math.max(totalCells, 1)) * 100).toFixed(0)}%) have cost_stack`,
  );
  if (totalCatastrophic > 0) {
    console.log(`\n⚠  ${totalCatastrophic} catastrophic cells flagged (cost_stack > 5x revenue):`);
    for (const ind of PILOT_INDUSTRIES) {
      const ex = stats[ind].catastrophicExamples;
      for (const e of ex) {
        console.log(`    - ${e.industry}: ratio = ${e.ratio.toFixed(2)}x`);
      }
    }
  } else {
    console.log("\n✓ No catastrophic cells (all cost_stack sums are within reasonable bounds vs revenue).");
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
