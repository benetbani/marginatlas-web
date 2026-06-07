/**
 * THROWAWAY DIAGNOSTIC — owner take-home waterfall instrumentation.
 *
 * Root-cause diagnosis for the implausibly-negative net_profit bug on a broad
 * set of trusted city cells (Paris cafe, NY hotels, Berlin dental, etc.). NOT
 * wired into the app. Read-only against Supabase via getCellBySlug (the same
 * call the cell page uses).
 *
 * For each cell it prints:
 *   - raw inputs (revenue_per_firm, rev_p50, size_band, n_employees,
 *     n_enterprises, payroll_per_employee, sector_id, industry_id)
 *   - the derived employees-per-firm + payrollForMargin (page.tsx replica)
 *   - the sqm used + rentUsdPerSqm used (fixed_costs.ts replica)
 *   - the FULL net_profit waterfall (estimateNetProfit)
 *   - the DISPLAYED take-home = adjustedNetTakeHome (page.tsx larger-firm floor)
 *     and the clampMargin'd net margin, so we see displayed-vs-raw.
 *
 * Run: npx tsx scripts/audit/diag_takehome_waterfall.ts
 */
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });

// Relative imports (not @/ alias) — tsx does not reliably resolve the tsconfig
// path alias for standalone runs (proven pattern in the other audit scripts).
type CellLike = {
  country: string;
  geo_id: string;
  geo_name: string | null;
  size_band: string | null;
  industry_id?: string | null;
  sector_id?: string | null;
  revenue_per_firm?: number | null;
  rev_p50?: number | null;
  n_enterprises?: number | null;
  n_employees?: number | null;
  payroll_per_employee?: number | null;
};

async function run(): Promise<void> {
  const { getCellBySlug } = await import("../../src/lib/cells");
  const { estimateNetProfit } = await import("../../src/lib/finance/net_profit");
  const { clampMargin } = await import("../../src/lib/finance/margin_floor");
  const { getCountryEconomicsSnapshot } = await import(
    "../../src/lib/economics/country_metrics"
  );
  // Raw JSONs to replicate fixed_costs.ts internals (sqm + rentUsdPerSqm),
  // which are not exported from the module.
  const rentJson = (await import("../../src/lib/finance/commercial_rent_2024.json")).default as {
    default_fallback_usd_per_sqm_per_year: number;
    country_medians: Record<string, number>;
    cities: Record<string, { usd_per_sqm_per_year: number }>;
  };

  // typicalSqm table — copied verbatim from fixed_costs.ts so the script's sqm
  // matches the production one exactly.
  const TYPICAL_SQM_BY_SECTOR: Record<string, number> = {
    food_drink: 150,
    retail_shops: 120,
    hospitality: 1200,
    beauty_wellness: 80,
    health_clinics: 180,
    professional_services: 120,
    software_tech: 100,
    creative_media: 90,
    real_estate: 70,
    events_entertainment: 200,
    trades_home: 120,
    other_local: 200,
    cultural: 350,
    education_instruction: 280,
    pet_services: 150,
    transport_small: 400,
    repair: 110,
    manufacturing_artisan: 600,
    construction: 200,
    farming_food_production: 900,
  };
  const DEFAULT_SQM = 200;
  const typicalSqm = (sectorId: string | null | undefined): number =>
    sectorId ? TYPICAL_SQM_BY_SECTOR[sectorId] ?? DEFAULT_SQM : DEFAULT_SQM;

  const rentUsdPerSqm = (iso2: string, geoId: string | null | undefined): number => {
    if (geoId) {
      const direct = rentJson.cities[geoId];
      if (direct) return direct.usd_per_sqm_per_year;
      const upper = geoId.toUpperCase();
      if (rentJson.cities[upper]) return rentJson.cities[upper].usd_per_sqm_per_year;
    }
    return (
      rentJson.country_medians[iso2.toUpperCase()] ??
      rentJson.default_fallback_usd_per_sqm_per_year
    );
  };

  type Target = { label: string; country: string; geo: string; industry: string; broken: boolean };
  const TARGETS: Target[] = [
    // BROKEN set
    { label: "Paris cafe", country: "fr", geo: "paris", industry: "cafes-coffee-shops", broken: true },
    { label: "New York hotels", country: "us", geo: "new-york", industry: "hotels-lodging", broken: true },
    { label: "Berlin dental", country: "de", geo: "berlin", industry: "dental-practices", broken: true },
    { label: "Chicago auto repair", country: "us", geo: "chicago", industry: "auto-repair-shops", broken: true },
    { label: "LA hairdressers", country: "us", geo: "los-angeles", industry: "hairdressers-beauty", broken: true },
    { label: "Madrid cleaning", country: "es", geo: "madrid", industry: "cleaning-services", broken: true },
    // WORKING set (for comparison)
    { label: "Tokyo software dev", country: "jp", geo: "tokyo", industry: "software-development", broken: false },
    { label: "London restaurants", country: "gb", geo: "london", industry: "restaurants", broken: false },
    // US-state cells expected positive
    { label: "Texas restaurants (state)", country: "us", geo: "texas", industry: "restaurants", broken: false },
    { label: "Ohio auto repair (state)", country: "us", geo: "ohio", industry: "auto-repair-shops", broken: false },
    { label: "California hairdressers (state)", country: "us", geo: "california", industry: "hairdressers-beauty", broken: false },
  ];

  for (const t of TARGETS) {
    console.log("\n" + "=".repeat(92));
    console.log(`${t.broken ? "[BROKEN?] " : "[WORKING?] "}${t.label}  ->  /${t.country}/${t.geo}/${t.industry}`);
    console.log("=".repeat(92));

    let cell: CellLike;
    try {
      cell = (await getCellBySlug(t.country, t.geo, t.industry)) as CellLike;
    } catch (e) {
      console.log("  FETCH ERROR:", (e as Error).message);
      continue;
    }

    const iso2 = t.country.toUpperCase();
    const geoId = cell.geo_id || t.geo;

    // ---- Raw inputs ----
    console.log("  RAW INPUTS");
    console.log(`    geo_id=${cell.geo_id}  geo_name=${cell.geo_name}  size_band=${cell.size_band}`);
    console.log(`    industry_id=${cell.industry_id}  sector_id=${cell.sector_id}`);
    console.log(`    revenue_per_firm=${fmt(cell.revenue_per_firm)}  rev_p50=${fmt(cell.rev_p50)}`);
    console.log(`    n_enterprises=${fmt(cell.n_enterprises)}  n_employees=${fmt(cell.n_employees)}  payroll_per_employee=${fmt(cell.payroll_per_employee)}`);

    // ---- payrollForMargin — page.tsx replica (lines 339-349) ----
    const grossRevenueForMargin = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
    let empPerFirm: number | null = null;
    let effectiveEmpPerFirm: number | null = null;
    let payrollForMargin: number | null = null;
    if (cell.payroll_per_employee != null && cell.n_employees != null) {
      empPerFirm =
        cell.n_enterprises && cell.n_enterprises > 0
          ? cell.n_employees < cell.n_enterprises
            ? cell.n_employees // already per-firm
            : cell.n_employees / cell.n_enterprises
          : cell.n_employees;
      effectiveEmpPerFirm = Math.max(1, empPerFirm);
      payrollForMargin = cell.payroll_per_employee * effectiveEmpPerFirm;
    }
    console.log("  DERIVED (page.tsx replica)");
    console.log(`    grossRevenueForMargin=${fmt(grossRevenueForMargin)}`);
    console.log(`    empPerFirm(raw)=${fmt(empPerFirm)}  effectiveEmpPerFirm=${fmt(effectiveEmpPerFirm)}  payrollForMargin=${fmt(payrollForMargin)}`);

    // ---- sqm + rent (fixed_costs.ts replica) ----
    const sqm = typicalSqm(cell.sector_id);
    const rentRate = rentUsdPerSqm(iso2, geoId);
    console.log(`    typicalSqm=${sqm}  rentUsdPerSqm=${fmt(rentRate)}  =>  rentCost=${fmt(sqm * rentRate)}`);

    if (!grossRevenueForMargin || grossRevenueForMargin <= 0) {
      console.log("  net profit: SKIPPED (no revenue)");
      continue;
    }

    // ---- Full waterfall ----
    const wf = estimateNetProfit({
      iso2,
      geoId,
      industryId: cell.industry_id || null,
      sectorId: cell.sector_id || null,
      grossRevenue: grossRevenueForMargin,
      payroll: payrollForMargin,
    });
    console.log("  WATERFALL (estimateNetProfit)");
    console.log(`    gross_revenue   = ${fmt(wf.gross_revenue)}`);
    console.log(`    - cogs          = ${fmt(wf.cogs)}`);
    console.log(`    = gross_profit  = ${fmt(wf.gross_profit)}`);
    console.log(`    - payroll       = ${fmt(wf.payroll)}`);
    console.log(`    - employer_soc  = ${fmt(wf.employer_social)}`);
    console.log(`    = operating_pft = ${fmt(wf.operating_profit)}`);
    console.log(`    fixed_costs: rent=${fmt(wf.fixed_costs.rent)} prop_tax=${fmt(wf.fixed_costs.property_tax)} ins=${fmt(wf.fixed_costs.insurance)} util=${fmt(wf.fixed_costs.utilities)} sw=${fmt(wf.fixed_costs.software)} other=${fmt(wf.fixed_costs.other_overhead)} TOTAL=${fmt(wf.fixed_costs.total)}`);
    console.log(`    = pre_tax_profit= ${fmt(wf.pre_tax_profit)}`);
    console.log(`    - corp_inc_tax  = ${fmt(wf.corporate_income_tax)}  (rate ${(wf.effective_cit_rate * 100).toFixed(1)}%)`);
    console.log(`    = NET_PROFIT    = ${fmt(wf.net_profit)}   raw_net_margin=${(wf.raw_net_margin * 100).toFixed(1)}%  margin_clamped=${wf.margin_clamped}`);

    // ---- Displayed take-home (page.tsx larger-firm floor, lines 363-384) ----
    const netTakeHome = wf.net_profit;
    const isLargerFirm =
      !!cell.size_band && ["10-19", "20-49", "50-99", "100+"].includes(cell.size_band);
    const econSnap = getCountryEconomicsSnapshot(iso2);
    const annualIncome =
      econSnap.avgMonthlySalary != null ? econSnap.avgMonthlySalary * 12 : null;
    const takeHomeFloor = isLargerFirm && annualIncome ? annualIncome * 2 : null;
    const adjustedNetTakeHome =
      takeHomeFloor != null && netTakeHome != null && netTakeHome < takeHomeFloor
        ? takeHomeFloor
        : netTakeHome;
    const computedNetMargin = clampMargin(wf.net_margin, "net", cell.industry_id || null);
    console.log("  DISPLAY-SIDE");
    console.log(`    isLargerFirm=${isLargerFirm}  annualIncome=${fmt(annualIncome)}  takeHomeFloor=${fmt(takeHomeFloor)}`);
    console.log(`    netTakeHome(raw)=${fmt(netTakeHome)}  =>  adjustedNetTakeHome(DISPLAYED + fed to break-in)=${fmt(adjustedNetTakeHome)}`);
    console.log(`    computedNetMargin(clamped, %)=${(computedNetMargin * 100).toFixed(1)}%   <-- the MARGIN row shows this (looks healthy) while take-home row shows the dollars above`);
  }

  console.log("\nDONE.");
}

function fmt(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "null";
  return Math.round(n).toLocaleString("en-US");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
