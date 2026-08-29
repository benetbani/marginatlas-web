/**
 * scripts/spikes/probe_dump_keep_lattice.mjs
 *
 * Dump one row per (country, everyday trade) with everything a threshold
 * question needs: resolved revenue, the page's owner keep, the country's
 * median full-time pay, and the wealth-normalized revenue ratio. Written once
 * to JSON so candidate screens can be evaluated instantly instead of by
 * re-sweeping 1164 database reads for every question asked.
 *
 * Run (from website/):
 *   set -a; . ./.env.local >/dev/null 2>&1; set +a
 *   npx tsx scripts/spikes/probe_dump_keep_lattice.mjs <out.json>
 */
import { writeFileSync } from "node:fs";
import { COUNTRIES, industryToSlug } from "@/lib/taxonomy";
import { getCellBySlug, slugify } from "@/lib/cells";
import { relativeRevenueNormalized } from "@/lib/qa/plausibility_suppression";
import { getCountryProfile } from "@/lib/economic_profile";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { ownerTakeHomeForCell } from "@/lib/scores/country_board";
import { isTrustedLocalCell } from "@/lib/cells/trust";

const TRADES = ["restaurants","grocery_stores","hairdressers_beauty","sports_fitness","auto_repair_shops","cafes_coffee"];
const CONCURRENCY = 8;
const isNum = (v) => v != null && Number.isFinite(v);
const OUT = process.argv[2] || "keep_lattice.json";

const jobs = [];
for (const c of COUNTRIES) {
  const code = String(c.code || c.iso2 || "").toUpperCase();
  if (!code || code === "US") continue;
  for (const t of TRADES) jobs.push({ code, name: c.name || code, industryId: t });
}

const rows = [];
let cursor = 0;
async function worker() {
  while (cursor < jobs.length) {
    const { code, name, industryId } = jobs[cursor++];
    try {
      const cell = await getCellBySlug(code.toLowerCase(), slugify(name), industryToSlug(industryId), { sizeBand: null, year: null });
      if (!cell) continue;
      const rev = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
      const snap = getCountryEconomicsSnapshot(code);
      const annualIncome = isNum(snap.avgMonthlySalary) ? snap.avgMonthlySalary * 12 : null;
      const keep = ownerTakeHomeForCell(cell, annualIncome);
      const p = getCountryProfile(code);
      const median = p.iso2.toUpperCase() === code && isNum(p.median_wage_full_time_usd) && p.median_wage_full_time_usd > 0 ? p.median_wage_full_time_usd : null;
      rows.push({
        code, industryId, rev, keep, median,
        keepRatio: isNum(keep) && keep > 0 && isNum(median) ? keep / median : null,
        wealthRatio: relativeRevenueNormalized(cell.industry_id, cell.country, rev),
        tier: cell.coverage_tier ?? null,
        trusted: isTrustedLocalCell(cell, cell.industry_id ?? undefined),
      });
    } catch { /* skip */ }
    if (rows.length % 250 === 0) console.log(`  ...${rows.length}`);
  }
}
console.log(`Dumping ${jobs.length} pairs...`);
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
writeFileSync(OUT, JSON.stringify(rows, null, 0));
console.log(`\nwrote ${rows.length} rows to ${OUT}`);
