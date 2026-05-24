/**
 * Bulk cost-stack SQL generator (Phase 1, Sprint G).
 *
 * Reads INDUSTRY_BASELINES from src/lib/qa/industry_baselines.ts.
 * For each industry, writes a SQL file under
 * scripts/import/deepening/_bulk/<industry>_global.sql.
 *
 * Each generated file contains three UPDATE statements:
 *   - regional_cells (non-US, sub-national)
 *   - cells_master (US state/county)
 *   - extrapolated_cells (country-level fallback)
 *
 * Every UPDATE has a "grade A/B protected" WHERE clause so hand-
 * researched cells are never overwritten.
 *
 * Industry-id to NAICS-6 mapping (for cells_master only). Add to this
 * map when an industry needs a US-specific NAICS code. industry_id
 * names like "restaurants" with NAICS 722511/722513 require manual
 * mapping; others get a single code or skip cells_master entirely.
 *
 * Country construction-cost multipliers (used to scale setup costs)
 * live inline in the generated SQL as CASE statements.
 *
 * Run: `npx tsx scripts/generate/bulk_cost_stack_sql.ts`
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { INDUSTRY_BASELINES, type IndustryBaseline } from "../../src/lib/qa/industry_baselines";

const ROOT = process.cwd();
const OUT_DIR = resolve(ROOT, "scripts/import/deepening/_bulk");

// Industry -> NAICS code(s) on cells_master. Industries not in this
// map skip the cells_master UPDATE entirely (their US data lives in
// regional_cells with industry_id, or doesn't exist at the state level).
const INDUSTRY_TO_NAICS: Record<string, string[]> = {
  restaurants: ["722511", "722513"],
  cafes_coffee: ["722515"],
  hairdressers_beauty: ["812112"],
  barbershops: ["812111"],
  auto_repair_shops: ["811111", "811112", "811118"],
  hotels_lodging: ["721110"],
  dental_practices: ["621210"],
  doctors_clinics: ["621111", "621112"],
  legal_services: ["541110"],
  accounting_tax: ["541211", "541219"],
  real_estate_agencies: ["531210"],
  residential_construction: ["236115", "236116", "236117", "236118"],
  grocery_stores: ["445110"],
  clothing_stores: ["458110"],
  sports_fitness: ["713940"],
  veterinary_pet_care: ["541940"],
};

// Per-country construction / cost-of-doing-business multipliers
// applied to USD setup-cost baselines. US = 1.0. Sourced rough
// approximations from Turner Construction International Cost Survey,
// World Bank Doing Business, and CBRE construction-cost reports.
const COUNTRY_COST_MULT: Record<string, number> = {
  US: 1.0, CH: 1.40, NO: 1.30, JP: 1.30, SG: 1.20, AU: 1.25, GB: 1.20,
  DE: 1.15, FR: 1.10, NL: 1.15, SE: 1.20, CA: 1.05, AT: 1.10,
  DK: 1.20, FI: 1.15, BE: 1.15, IE: 1.10, IL: 1.00, AE: 0.95,
  KR: 0.95, IT: 0.90, ES: 0.85, NZ: 1.10, PT: 0.70, GR: 0.65,
  CZ: 0.60, PL: 0.55, HU: 0.55, CL: 0.55, CN: 0.55, MY: 0.50,
  MX: 0.50, AR: 0.45, BR: 0.45, ZA: 0.45, TH: 0.45, TR: 0.40,
  CO: 0.40, PE: 0.40, PH: 0.40, MA: 0.35, IN: 0.30, ID: 0.30,
  VN: 0.30, EG: 0.30, KE: 0.30, NG: 0.25, PK: 0.25, BD: 0.25,
};

function caseStatement(baseUsd: number, multipliers: Record<string, number>): string {
  const cases = Object.entries(multipliers)
    .map(([country, mult]) => `      WHEN '${country}' THEN ${Math.round(baseUsd * mult)}`)
    .join("\n");
  // Default for unlisted countries: 0.50 multiplier
  return `CASE country\n${cases}\n      ELSE ${Math.round(baseUsd * 0.5)}\n    END`;
}

function ratioToJsonbBuild(
  baseline: IndustryBaseline,
  revColumn: string,
  grade: "C" | "D",
  contextNote: string,
): string {
  return `jsonb_build_object(
  'rent_occupancy',         ROUND(${revColumn} * ${baseline.rent_occupancy}),
  'payroll_total',          ROUND(${revColumn} * ${baseline.payroll_total}),
  'cost_of_goods_sold',     ROUND(${revColumn} * ${baseline.cost_of_goods_sold}),
  'utilities',              ROUND(${revColumn} * ${baseline.utilities}),
  'marketing_acquisition',  ROUND(${revColumn} * ${baseline.marketing_acquisition}),
  'insurance_professional', ROUND(${revColumn} * ${baseline.insurance_professional}),
  'equipment_maintenance',  ROUND(${revColumn} * ${baseline.equipment_maintenance}),
  'regulatory_licensing',   ROUND(${revColumn} * ${baseline.regulatory_licensing}),
  'refreshed_at',           '2026-05-24',
  'source_note',            '${baseline.source_note} ${contextNote}',
  'grade',                  '${grade}'
)`;
}

function buildSetupCostsCase(baseline: IndustryBaseline): string {
  return `jsonb_build_object(
  'registration', jsonb_build_object(
    'business_registration_fee', 200,
    'industry_licenses_fee', 1500,
    'professional_license_fee', 0,
    'insurance_bond_initial', 1500,
    'certifications_initial', 300,
    'total_estimated', ${caseStatement(baseline.setup_registration_usd, COUNTRY_COST_MULT)},
    'source_note', 'Registration + licensing scaled from US baseline by country construction-cost index.'
  ),
  'capital', jsonb_build_object(
    'property_fitout', ${caseStatement(baseline.setup_capital_usd * 0.60, COUNTRY_COST_MULT)},
    'equipment_initial', ${caseStatement(baseline.setup_capital_usd * 0.25, COUNTRY_COST_MULT)},
    'initial_inventory', 10000,
    'working_capital_reserve_months', ${baseline.working_capital_months},
    'lease_deposit', ${caseStatement(baseline.setup_capital_usd * 0.06, COUNTRY_COST_MULT)},
    'pre_opening_marketing', 8000,
    'total_estimated', ${caseStatement(baseline.setup_capital_usd, COUNTRY_COST_MULT)},
    'source_note', 'Capital fit-out scaled from US baseline by country construction-cost index.'
  ),
  'payback_months_estimate', NULL,
  'refreshed_at', '2026-05-24',
  'grade', 'C'
)`;
}

function buildSqlFile(industryId: string, baseline: IndustryBaseline): string {
  const naicsCodes = INDUSTRY_TO_NAICS[industryId];
  const naicsClause = naicsCodes && naicsCodes.length > 0
    ? `naics_6 IN (${naicsCodes.map((c) => `'${c}'`).join(", ")})`
    : null;

  const out: string[] = [];

  // Header
  out.push(`-- ============================================================================`);
  out.push(`-- BULK IMPORT: ${industryId} cost-stack worldwide (Grade C extrapolation)`);
  out.push(`-- ============================================================================`);
  out.push(`-- Generated by scripts/generate/bulk_cost_stack_sql.ts`);
  out.push(`-- Industry baseline: src/lib/qa/industry_baselines.ts`);
  out.push(`-- Source: ${baseline.source_note}`);
  out.push(`-- Safe to re-run. Grade A/B cells are NOT overwritten.`);
  out.push(``);

  // 1. regional_cells (non-US)
  out.push(`-- 1. regional_cells (non-US sub-national rows)`);
  out.push(`UPDATE regional_cells`);
  out.push(`SET cost_stack = ${ratioToJsonbBuild(baseline, "rev_p50", "C", "Country revenue captures local price level implicitly.")}`);
  out.push(`WHERE industry_id = '${industryId}'`);
  out.push(`  AND rev_p50 IS NOT NULL`);
  out.push(`  AND rev_p50 > 0`);
  out.push(`  AND (cost_stack IS NULL OR cost_stack->>'grade' IN ('C', 'D'));`);
  out.push(``);
  out.push(`UPDATE regional_cells`);
  out.push(`SET setup_costs = ${buildSetupCostsCase(baseline)}`);
  out.push(`WHERE industry_id = '${industryId}'`);
  out.push(`  AND rev_p50 IS NOT NULL`);
  out.push(`  AND (setup_costs IS NULL OR setup_costs->>'grade' IN ('C', 'D'));`);
  out.push(``);

  // 2. cells_master (US only, requires NAICS mapping)
  if (naicsClause) {
    out.push(`-- 2. cells_master (US state/county rows, NAICS ${naicsCodes!.join(" + ")})`);
    out.push(`UPDATE cells_master`);
    out.push(`SET cost_stack = ${ratioToJsonbBuild(baseline, "rev_p50", "C", "US state-level cell.")}`);
    out.push(`WHERE country = 'US'`);
    out.push(`  AND ${naicsClause}`);
    out.push(`  AND rev_p50 IS NOT NULL`);
    out.push(`  AND rev_p50 > 0`);
    out.push(`  AND (cost_stack IS NULL OR cost_stack->>'grade' IN ('C', 'D'));`);
    out.push(``);
    out.push(`UPDATE cells_master`);
    out.push(`SET setup_costs = ${buildSetupCostsCase(baseline)}`);
    out.push(`WHERE country = 'US'`);
    out.push(`  AND ${naicsClause}`);
    out.push(`  AND rev_p50 IS NOT NULL`);
    out.push(`  AND (setup_costs IS NULL OR setup_costs->>'grade' IN ('C', 'D'));`);
    out.push(``);
  } else {
    out.push(`-- 2. cells_master skipped (no NAICS mapping for ${industryId})`);
    out.push(``);
  }

  // 3. extrapolated_cells (country-level fallback)
  out.push(`-- 3. extrapolated_cells (country-level fallback)`);
  out.push(`UPDATE extrapolated_cells`);
  out.push(`SET cost_stack = ${ratioToJsonbBuild(baseline, "predicted_rev_per_firm", "D", "Country-level extrapolation; coarser than regional_cells.")}`);
  out.push(`WHERE industry_id = '${industryId}'`);
  out.push(`  AND predicted_rev_per_firm IS NOT NULL`);
  out.push(`  AND predicted_rev_per_firm > 0`);
  out.push(`  AND (cost_stack IS NULL OR cost_stack->>'grade' IN ('C', 'D'));`);
  out.push(``);

  return out.join("\n");
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  let written = 0;
  for (const [industryId, baseline] of Object.entries(INDUSTRY_BASELINES)) {
    const sql = buildSqlFile(industryId, baseline);
    const path = resolve(OUT_DIR, `${industryId}_global.sql`);
    writeFileSync(path, sql, "utf-8");
    console.log(`  wrote ${path.replace(ROOT, ".")} (${(sql.length / 1024).toFixed(1)} KB)`);
    written++;
  }
  console.log(`\n✓ Generated ${written} bulk SQL files in ${OUT_DIR.replace(ROOT, ".")}/.`);
  console.log(`  Each file is safe to run in Supabase SQL Editor. Run order does not matter.`);
}

main();
