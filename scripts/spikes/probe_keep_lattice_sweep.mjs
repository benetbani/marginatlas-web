/**
 * scripts/spikes/probe_keep_lattice_sweep.mjs
 *
 * THE COVERAGE QUESTION the six-pair probe cannot answer: the 2026-08-29 blend
 * fix changed the all-sizes revenue for EVERY non-US country trade page, and
 * the 6x-median keep screen now guards every one of them. Six pairs proved the
 * named defects are gone. This sweeps the whole country x everyday-trade
 * lattice and answers three things a spot check cannot:
 *
 *   1. How many pairs would STILL be withheld by the screen (i.e. how much
 *      wrong-scale revenue is left upstream, now hidden rather than printed).
 *      A withheld figure is honest but it is still a hole; this is the backlog.
 *   2. Whether the fix over-corrected: pairs whose keep is now implausibly LOW
 *      (under a twentieth of the median wage) are a different kind of wrong.
 *   3. The ratio distribution, so the 6x line can be judged against real data
 *      rather than argued about in the abstract.
 *
 * It runs the REAL chain (getCellBySlug -> ownerTakeHomeForCell), the same one
 * the country funnel and the trade pages run, so what it reports is what a
 * reader would get. It renders nothing and writes nothing.
 *
 * Run (from website/):
 *   set -a; . ./.env.local >/dev/null 2>&1; set +a
 *   npx tsx scripts/spikes/probe_keep_lattice_sweep.mjs
 */
import { COUNTRIES, industryToSlug } from "@/lib/taxonomy";
import { getCellBySlug } from "@/lib/cells";
import { ownerTakeHomeForCell } from "@/lib/scores/country_board";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { getCountryProfile } from "@/lib/economic_profile";
import { slugify } from "@/lib/cells";

const EVERYDAY_TRADE_IDS = [
  "restaurants",
  "grocery_stores",
  "hairdressers_beauty",
  "sports_fitness",
  "auto_repair_shops",
  "cafes_coffee",
];

const CREDIBLE_KEEP_CAP = 6;
/** Below this share of the median wage a keep is too thin to be a livelihood. */
const IMPLAUSIBLY_LOW = 1 / 20;
const CONCURRENCY = 8;

const isNum = (v) => v != null && Number.isFinite(v);
const usd = (v) => (v == null ? "n/a" : `$${Math.round(v).toLocaleString("en-US")}`);

/** Every (country, trade) job, skipping the US (its own measured path). */
const jobs = [];
for (const c of COUNTRIES) {
  const code = String(c.code || c.iso2 || "").toUpperCase();
  if (!code || code === "US") continue;
  const name = c.name || code;
  for (const industryId of EVERYDAY_TRADE_IDS) {
    jobs.push({ code, name, industryId });
  }
}

async function run({ code, name, industryId }) {
  const placeGeo = slugify(name);
  const slug = industryToSlug(industryId);
  let cell = null;
  try {
    cell = await getCellBySlug(code.toLowerCase(), placeGeo, slug, { sizeBand: null, year: null });
  } catch {
    return { code, name, industryId, status: "error" };
  }
  if (!cell) return { code, name, industryId, status: "no_cell" };

  const snap = getCountryEconomicsSnapshot(code);
  const annualIncome = isNum(snap.avgMonthlySalary) ? snap.avgMonthlySalary * 12 : null;
  const keep = ownerTakeHomeForCell(cell, annualIncome);

  const profile = getCountryProfile(code);
  const held = profile.iso2.toUpperCase() === code;
  const median =
    held && isNum(profile.median_wage_full_time_usd) && profile.median_wage_full_time_usd > 0
      ? profile.median_wage_full_time_usd
      : null;

  if (!isNum(keep) || keep <= 0) {
    return { code, name, industryId, status: "no_keep", revenue: cell.revenue_per_firm ?? null };
  }
  if (median == null) {
    return { code, name, industryId, status: "no_median", keep, revenue: cell.revenue_per_firm ?? null };
  }
  const ratio = keep / median;
  const status =
    ratio > CREDIBLE_KEEP_CAP ? "withheld" : ratio < IMPLAUSIBLY_LOW ? "too_low" : "ok";
  return { code, name, industryId, status, keep, median, ratio, revenue: cell.revenue_per_firm ?? null };
}

const results = [];
let cursor = 0;
async function worker() {
  while (cursor < jobs.length) {
    const job = jobs[cursor++];
    results.push(await run(job));
    if (results.length % 100 === 0) {
      console.log(`  ...${results.length} / ${jobs.length}`);
    }
  }
}
console.log(`Sweeping ${jobs.length} (country, trade) pairs at concurrency ${CONCURRENCY}...\n`);
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const by = (s) => results.filter((r) => r.status === s);
const withheld = by("withheld").sort((a, b) => b.ratio - a.ratio);
const tooLow = by("too_low").sort((a, b) => a.ratio - b.ratio);
const ok = by("ok");

console.log(`\n================ RESULT over ${results.length} pairs ================`);
console.log(`  ok (keep inside 0.05x..6x median):  ${ok.length}`);
console.log(`  WITHHELD by the 6x screen:          ${withheld.length}`);
console.log(`  implausibly LOW (under 0.05x):      ${tooLow.length}`);
console.log(`  no median held (screen cannot run): ${by("no_median").length}`);
console.log(`  no keep derivable:                  ${by("no_keep").length}`);
console.log(`  no cell / error:                    ${by("no_cell").length + by("error").length}`);

if (withheld.length > 0) {
  console.log(`\n--- STILL WITHHELD (upstream revenue remains wrong-scale), worst 25 ---`);
  for (const r of withheld.slice(0, 25)) {
    console.log(
      `  ${r.ratio.toFixed(1).padStart(6)}x  ${r.code} ${String(r.industryId).padEnd(20)} keep=${usd(r.keep).padStart(12)}  median=${usd(r.median).padStart(10)}  rev=${usd(r.revenue)}`,
    );
  }
  const countries = [...new Set(withheld.map((r) => r.code))];
  const trades = {};
  for (const r of withheld) trades[r.industryId] = (trades[r.industryId] ?? 0) + 1;
  console.log(`\n  spread: ${countries.length} countries; by trade: ${Object.entries(trades).map(([k, v]) => `${k}=${v}`).join("  ")}`);
}

if (tooLow.length > 0) {
  console.log(`\n--- IMPLAUSIBLY LOW (a different wrong), worst 15 ---`);
  for (const r of tooLow.slice(0, 15)) {
    console.log(
      `  ${r.ratio.toFixed(3).padStart(7)}x  ${r.code} ${String(r.industryId).padEnd(20)} keep=${usd(r.keep).padStart(10)}  median=${usd(r.median).padStart(10)}  rev=${usd(r.revenue)}`,
    );
  }
}

const ratios = results.filter((r) => isNum(r.ratio)).map((r) => r.ratio).sort((a, b) => a - b);
if (ratios.length > 0) {
  const at = (p) => ratios[Math.min(ratios.length - 1, Math.floor(ratios.length * p))];
  console.log(
    `\n  ratio distribution (keep / median wage): p10=${at(0.1).toFixed(2)}x  p50=${at(0.5).toFixed(2)}x  p90=${at(0.9).toFixed(2)}x  max=${ratios[ratios.length - 1].toFixed(1)}x`,
  );
}
