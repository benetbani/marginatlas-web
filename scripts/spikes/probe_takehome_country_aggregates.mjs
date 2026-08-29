/**
 * scripts/spikes/probe_takehome_country_aggregates.mjs
 *
 * EVIDENCE PROBE for the 2026-08-29 take-home defect: country-aggregate cells
 * (gb/united-kingdom/sports-fitness and friends) print owner take-homes at
 * 8x-13x the country's median full-time pay on the live trade pages, while the
 * rebuilt country page withholds the same figures behind its 6x-median
 * credibility screen (src/lib/spine/adapt_country.ts).
 *
 * WHAT THIS PRINTS, per (country, geo, industry):
 *   1. The resolved cell's identity fields (geo_level, coverage_tier,
 *      is_synthetic, coverage_source) so we can see WHICH lookup path served it
 *      and whether the trust gate should have caught it.
 *   2. The trade page's exact take-home derivation (estimateNetProfit ->
 *      resolveOwnerTakeHome over cell.revenue_per_firm).
 *   3. What the spine cell seed would render (owner block present or omitted).
 *   4. The plausibility-guard readings for the same revenue: the absolute
 *      catastrophe ceiling, the industry global median, and the
 *      wealth-normalized relative ratio, so we can see why the existing
 *      suppression chokepoint did not dash it.
 *   5. The country's median full-time pay and the 6x screen verdict.
 *
 * Run (from website/):
 *   set -a; . ./.env.local >/dev/null 2>&1; set +a
 *   npx tsx scripts/spikes/probe_takehome_country_aggregates.mjs
 */
import { getCellBySlug } from "@/lib/cells";
import { isTrustedLocalCell } from "@/lib/cells/trust";
import { slugToIndustry } from "@/lib/taxonomy";
import { estimateNetProfit } from "@/lib/finance/net_profit";
import { resolveOwnerTakeHome } from "@/lib/finance/owner_take_home";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { getCountryProfile } from "@/lib/economic_profile";
import {
  relativeRevenueNormalized,
  getCatastropheCeiling,
} from "@/lib/qa/plausibility_suppression";
import { getIndustryGlobalMedian } from "@/lib/economic_profile/industry_medians";
import { buildSpineCellSeed } from "@/lib/spine/adapt_cell";

const SUBJECTS = [
  ["gb", "united-kingdom", "sports-fitness"],
  ["gb", "united-kingdom", "grocery-stores"],
  ["gb", "united-kingdom", "auto-repair-shops"],
  ["gb", "gb", "sports-fitness"],
  ["td", "chad", "sports-fitness"],
  ["al", "albania", "sports-fitness"],
];

const usd = (v) => (v == null ? "null" : `$${Math.round(v).toLocaleString("en-US")}`);

for (const [country, geo, industry] of SUBJECTS) {
  console.log(`\n=============== /${country}/${geo}/${industry} ===============`);
  const cell = await getCellBySlug(country, geo, industry, { sizeBand: null, year: null });
  if (!cell) {
    console.log("  cell: NULL (route would 404)");
    continue;
  }
  console.log(
    `  identity: industry_id=${cell.industry_id}  geo_id=${cell.geo_id}  geo_level=${cell.geo_level}  size_band=${cell.size_band}`,
  );
  console.log(
    `  stamps:   coverage_tier=${cell.coverage_tier}  quality=${cell.quality_score}  is_synthetic=${!!cell.is_synthetic}  _revenueSuppressed=${!!cell._revenueSuppressed}`,
  );
  console.log(`  source:   ${cell.coverage_source}`);
  console.log(
    `  money:    revenue_per_firm=${usd(cell.revenue_per_firm)}  rev_p50=${usd(cell.rev_p50)}  n_emp=${cell.n_employees}  n_ent=${cell.n_enterprises}  payroll/emp=${usd(cell.payroll_per_employee)}`,
  );

  const expectedId = slugToIndustry(industry)?.id ?? cell.industry_id ?? undefined;
  console.log(`  trust:    isTrustedLocalCell=${isTrustedLocalCell(cell, expectedId)} (expected=${expectedId})`);

  // The trade page's exact derivation.
  const revenue = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  let takeHome = null;
  let netMargin = null;
  if (revenue != null && revenue > 0) {
    let payroll = null;
    if (cell.payroll_per_employee != null && cell.n_employees != null) {
      const empPerFirm =
        cell.n_enterprises && cell.n_enterprises > 0
          ? cell.n_employees < cell.n_enterprises
            ? cell.n_employees
            : cell.n_employees / cell.n_enterprises
          : cell.n_employees;
      payroll = cell.payroll_per_employee * Math.max(1, empPerFirm);
    }
    const net = estimateNetProfit({
      iso2: country.toUpperCase(),
      geoId: cell.geo_id || geo,
      industryId: cell.industry_id || null,
      sectorId: cell.sector_id || null,
      grossRevenue: revenue,
      payroll,
    });
    netMargin = net.net_margin;
    const econ = getCountryEconomicsSnapshot(country.toUpperCase());
    const annualIncome = econ.avgMonthlySalary != null ? econ.avgMonthlySalary * 12 : null;
    const isLargerFirm =
      !!cell.size_band && ["10-19", "20-49", "50-99", "100+"].includes(cell.size_band);
    takeHome = resolveOwnerTakeHome({
      structuralNetProfit: net.net_profit,
      rawNetMargin: net.net_margin,
      revenue,
      industryId: cell.industry_id || null,
      isLargerFirm,
      annualIncome,
    });
  }
  console.log(
    `  engine:   revenue=${usd(revenue)}  net_margin=${netMargin == null ? "null" : (netMargin * 100).toFixed(1) + "%"}  ownerTakeHome=${usd(takeHome)}`,
  );

  // What the spine seed (the rendered page body) carries.
  const seed = await buildSpineCellSeed(country, geo, industry);
  const owner = seed?.owner;
  console.log(
    `  rendered: owner block=${owner ? `SHOWN take_home=${usd(owner.take_home_usd)} margin=${owner.margin_pct}%` : "self-omitted"}`,
  );

  // Why the existing plausibility chokepoint kept it.
  const ceiling = getCatastropheCeiling(cell.industry_id);
  const globalMedian = getIndustryGlobalMedian(cell.industry_id);
  const relRatio = relativeRevenueNormalized(cell.industry_id, cell.country, revenue);
  console.log(
    `  guards:   abs ceiling=${usd(ceiling)}  industry global median=${usd(globalMedian)}  relative ratio=${relRatio == null ? "null (guard skipped)" : relRatio.toFixed(2) + "x (dash above 2.5x)"}`,
  );

  // The country-page credibility screen's yardstick.
  const profile = getCountryProfile(country.toUpperCase());
  const held = profile.iso2.toUpperCase() === country.toUpperCase();
  const medianWage = held ? profile.median_wage_full_time_usd : null;
  const verdict =
    takeHome != null && medianWage != null
      ? takeHome > 6 * medianWage
        ? `FAILS 6x screen (${(takeHome / medianWage).toFixed(1)}x median)`
        : `passes 6x screen (${(takeHome / medianWage).toFixed(1)}x median)`
      : "screen cannot run (no median or no take-home)";
  console.log(`  screen:   median wage=${usd(medianWage)}  -> ${verdict}`);
}
