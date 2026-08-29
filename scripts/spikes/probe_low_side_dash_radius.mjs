/**
 * scripts/spikes/probe_low_side_dash_radius.mjs
 *
 * MEASURE BEFORE CHANGING A SHARED CHOKEPOINT.
 *
 * The net-effect measurement showed the blend change fixed 531 pairs and moved
 * 8 from a guarded-high wrong (withheld, reader sees nothing) into an
 * unguarded-low wrong (printed, reader sees a false figure). Those 8 sit in
 * rich micro-states (AD, SM, BN, MO, BS, SI) whose extrapolated rows are
 * shared placeholders: auto repair resolves to exactly $41,551 and gyms to
 * exactly $50,921 in every one of them, the same values Chad and Albania get,
 * where they are plausible.
 *
 * The discriminator is therefore country WEALTH, which the codebase already
 * has a test for: isRelativeRevenueOutlier dashes revenue that is too HIGH for
 * (industry global median x country wealth multiplier), at a ratified 2.5x.
 * There is no low-side mirror. Adding one would catch these, at the revenue
 * layer, so the whole waterfall dashes together.
 *
 * But that test lives in the suppression chokepoint every read path runs, so
 * the blast radius must be known BEFORE the rule is written, not after. This
 * changes nothing; it reports what a low-side mirror WOULD dash at several
 * candidate thresholds, so the threshold is chosen against data.
 *
 * Run (from website/):
 *   set -a; . ./.env.local >/dev/null 2>&1; set +a
 *   npx tsx scripts/spikes/probe_low_side_dash_radius.mjs
 */
import { COUNTRIES, industryToSlug } from "@/lib/taxonomy";
import { getCellBySlug, slugify } from "@/lib/cells";
import { relativeRevenueNormalized } from "@/lib/qa/plausibility_suppression";
import { getCountryProfile } from "@/lib/economic_profile";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { ownerTakeHomeForCell } from "@/lib/scores/country_board";

const TRADES = ["restaurants", "grocery_stores", "hairdressers_beauty", "sports_fitness", "auto_repair_shops", "cafes_coffee"];
const CONCURRENCY = 8;
const isNum = (v) => v != null && Number.isFinite(v);
/** The 8 pairs the blend change moved into printed-low. Must be caught. */
const MUST_CATCH = new Set([
  "AD:sports_fitness", "AD:auto_repair_shops", "BS:auto_repair_shops", "BN:auto_repair_shops",
  "MO:auto_repair_shops", "SM:sports_fitness", "SM:auto_repair_shops", "SI:auto_repair_shops",
]);

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
      const ratio = relativeRevenueNormalized(cell.industry_id, cell.country, rev);
      const snap = getCountryEconomicsSnapshot(code);
      const annualIncome = isNum(snap.avgMonthlySalary) ? snap.avgMonthlySalary * 12 : null;
      const keep = ownerTakeHomeForCell(cell, annualIncome);
      const p = getCountryProfile(code);
      const median = p.iso2.toUpperCase() === code && isNum(p.median_wage_full_time_usd) ? p.median_wage_full_time_usd : null;
      rows.push({ code, industryId, rev, ratio, keep, median, keepRatio: isNum(keep) && isNum(median) && median > 0 ? keep / median : null });
    } catch { /* skip */ }
    if (rows.length % 200 === 0) console.log(`  ...${rows.length}`);
  }
}
console.log(`Measuring low-side dash radius over ${jobs.length} pairs...\n`);
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const judgeable = rows.filter((r) => isNum(r.ratio));
console.log(`\n=========== ${judgeable.length} pairs have a wealth-normalized ratio ===========`);
const sorted = judgeable.map((r) => r.ratio).sort((a, b) => a - b);
const at = (p) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
console.log(`  ratio (revenue / wealth-expected): p05=${at(0.05).toFixed(3)}  p10=${at(0.1).toFixed(3)}  p25=${at(0.25).toFixed(3)}  p50=${at(0.5).toFixed(2)}  p90=${at(0.9).toFixed(2)}`);

console.log(`\n  threshold   would dash   of which are the 8 regressions   collateral (keep was already ok)`);
for (const div of [2.5, 3, 4, 5, 6, 8, 10]) {
  const t = 1 / div;
  const dashed = judgeable.filter((r) => r.ratio < t);
  const caught = dashed.filter((r) => MUST_CATCH.has(`${r.code}:${r.industryId}`)).length;
  const collateral = dashed.filter((r) => isNum(r.keepRatio) && r.keepRatio >= 0.05 && r.keepRatio <= 6).length;
  console.log(`  rev < exp/${String(div).padEnd(4)} ${String(dashed.length).padStart(9)}   ${String(caught).padStart(6)} / 8                     ${String(collateral).padStart(6)}`);
}

console.log(`\n  the 8 regressions, with their ratios:`);
for (const key of MUST_CATCH) {
  const [code, ind] = key.split(":");
  const r = judgeable.find((x) => x.code === code && x.industryId === ind);
  console.log(`    ${key.padEnd(28)} ${r ? `ratio=${r.ratio.toFixed(3)}  rev=$${Math.round(r.rev).toLocaleString("en-US")}  keep/median=${r.keepRatio?.toFixed(3)}` : "NO RATIO (no global median for this trade)"}`);
}
