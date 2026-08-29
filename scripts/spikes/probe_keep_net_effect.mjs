/**
 * scripts/spikes/probe_keep_net_effect.mjs
 *
 * THE NET EFFECT of the 2026-08-29 blend change, measured over the whole
 * country x everyday-trade lattice rather than argued from six examples.
 *
 * The lattice sweep showed the post-fix state: 14 pairs still withheld by the
 * 6x screen, 52 pairs implausibly low. The before/after spot check showed the
 * new blend is what lowered several of those. Neither answers the only
 * question that decides whether the shipped change was right: how many pairs
 * were wrong BEFORE, how many are wrong NOW, and which pairs moved from a
 * GUARDED wrong (too high, withheld, reader sees nothing) into an UNGUARDED
 * wrong (too low, printed, reader sees a false figure).
 *
 * That last category is the one that matters. A figure that is wrong and
 * hidden costs a reader nothing. A figure that is wrong and shown is the
 * defect this whole task exists to remove, and it would be self-deception to
 * count the high side fixed while quietly opening the low side.
 *
 * Method: one raw-band read per pair, both blends computed over the same rows,
 * both revenues run through the SAME finance chain the page runs
 * (estimateNetProfit -> resolveOwnerTakeHome), both keeps judged against the
 * country's median full-time pay. Pairs whose revenue does not come from
 * extrapolated_cells at all (a country with real regional rows, e.g. MX) are
 * reported separately: the blend cannot have moved them.
 *
 * Run (from website/):
 *   set -a; . ./.env.local >/dev/null 2>&1; set +a
 *   npx tsx scripts/spikes/probe_keep_net_effect.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { COUNTRIES, industryToSlug } from "@/lib/taxonomy";
import { getCellBySlug, slugify } from "@/lib/cells";
import { blendBandsToAllSizesRevenue, SIZE_BAND_ORDER, sizeBandRank } from "@/lib/cells/extrapolated_aggregation";
import { getCountryIndustryFirmDistribution } from "@/lib/cells/fill_defaults";
import { getCatastropheCeiling } from "@/lib/qa/plausibility_suppression";
import { estimateNetProfit } from "@/lib/finance/net_profit";
import { resolveOwnerTakeHome } from "@/lib/finance/owner_take_home";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { getCountryProfile } from "@/lib/economic_profile";
import { iso2ToIso3 } from "@/lib/countries";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const TRADES = ["restaurants", "grocery_stores", "hairdressers_beauty", "sports_fitness", "auto_repair_shops", "cafes_coffee"];
const HIGH = 6;          // the founder's ratified high-side cap
const LOW = 1 / 20;      // "not a livelihood" floor, for measurement only here
const CONCURRENCY = 6;
const isNum = (v) => v != null && Number.isFinite(v);

/** The pre-fix blend, verbatim from commit 360ba4ef. */
function oldBlend(rows, opts = {}) {
  const { firmDistribution, ceiling } = opts;
  const valid = rows
    .map((r) => ({ band: r.size_band ?? "", rev: r.predicted_rev_per_firm }))
    .filter((r) => typeof r.rev === "number" && isFinite(r.rev) && r.rev > 0 && (ceiling == null || r.rev <= ceiling))
    .sort((a, b) => {
      const r = sizeBandRank(a.band) - sizeBandRank(b.band);
      if (r !== 0) return r;
      if (a.band !== b.band) return a.band.localeCompare(b.band);
      return b.rev - a.rev;
    });
  if (valid.length === 0) return null;
  const canonical = valid.filter((r) => SIZE_BAND_ORDER.includes(r.band));
  const pool = canonical.length > 0 ? canonical : valid;
  const byBand = new Map();
  for (const { band, rev } of pool) if (!byBand.has(band)) byBand.set(band, rev);
  const bands = [...byBand.entries()];
  if (bands.length === 0) return null;
  if (bands.length === 1) return bands[0][1];
  let wSum = 0, acc = 0;
  for (const [band, rev] of bands) {
    const share = firmDistribution?.[band];
    const w = typeof share === "number" && isFinite(share) && share > 0 ? share : 0;
    if (w > 0) { acc += w * rev; wSum += w; }
  }
  if (wSum > 0) return acc / wSum;
  return bands.reduce((s, [, rev]) => s + rev, 0) / bands.length;
}

/** Run the page's finance chain over one revenue for one cell. */
function keepFor(cell, revenue, annualIncome) {
  if (!isNum(revenue) || revenue <= 0) return null;
  let payroll = null;
  if (isNum(cell.payroll_per_employee) && isNum(cell.n_employees)) {
    const empPerFirm =
      isNum(cell.n_enterprises) && cell.n_enterprises > 0
        ? cell.n_employees < cell.n_enterprises ? cell.n_employees : cell.n_employees / cell.n_enterprises
        : cell.n_employees;
    payroll = cell.payroll_per_employee * Math.max(1, empPerFirm);
  }
  const net = estimateNetProfit({
    iso2: cell.country.toUpperCase(), geoId: cell.geo_id || null,
    industryId: cell.industry_id || null, sectorId: cell.sector_id || null,
    grossRevenue: revenue, payroll,
  });
  return resolveOwnerTakeHome({
    structuralNetProfit: net.net_profit, rawNetMargin: net.net_margin, revenue,
    industryId: cell.industry_id || null,
    isLargerFirm: !!cell.size_band && ["10-19", "20-49", "50-99", "100+"].includes(cell.size_band),
    annualIncome,
  });
}

const band = (keep, median) => {
  if (!isNum(keep) || keep <= 0 || !isNum(median)) return "none";
  const r = keep / median;
  return r > HIGH ? "high" : r < LOW ? "low" : "ok";
};

const jobs = [];
for (const c of COUNTRIES) {
  const code = String(c.code || c.iso2 || "").toUpperCase();
  if (!code || code === "US") continue;
  for (const t of TRADES) jobs.push({ code, name: c.name || code, industryId: t });
}

const out = [];
let cursor = 0;
async function worker() {
  while (cursor < jobs.length) {
    const { code, name, industryId } = jobs[cursor++];
    try {
      const cell = await getCellBySlug(code.toLowerCase(), slugify(name), industryToSlug(industryId), { sizeBand: null, year: null });
      if (!cell) { out.push({ code, industryId, kind: "no_cell" }); continue; }
      const snap = getCountryEconomicsSnapshot(code);
      const annualIncome = isNum(snap.avgMonthlySalary) ? snap.avgMonthlySalary * 12 : null;
      const p = getCountryProfile(code);
      const median = p.iso2.toUpperCase() === code && isNum(p.median_wage_full_time_usd) && p.median_wage_full_time_usd > 0 ? p.median_wage_full_time_usd : null;

      const { data } = await supabase.from("extrapolated_cells").select("*")
        .eq("country_iso3", iso2ToIso3(code)).eq("industry_id", industryId)
        .order("year", { ascending: false }).limit(60);

      const afterRev = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
      let beforeRev = afterRev;
      let fromTable = false;
      if (data && data.length > 0) {
        const yr = data.reduce((y, r) => Math.max(y, r.year || 0), 0);
        const yearRows = data.filter((r) => (r.year || 0) === yr);
        const dist = getCountryIndustryFirmDistribution(industryId, code);
        const ceiling = getCatastropheCeiling(industryId);
        const ob = oldBlend(yearRows.map((r) => ({ size_band: r.size_band, predicted_rev_per_firm: r.predicted_rev_per_firm })), { firmDistribution: dist, ceiling });
        const uncapped = yearRows.filter((r) => !/scrub:revenue-cap/i.test(String(r.coverage_source ?? "")));
        const nb = blendBandsToAllSizesRevenue((uncapped.length ? uncapped : yearRows).map((r) => ({ size_band: r.size_band, predicted_rev_per_firm: r.predicted_rev_per_firm })), { firmDistribution: dist, ceiling });
        // The cell path applies a rollforward on top of the blend; recover its
        // factor from the shipped value so the BEFORE figure is comparable.
        if (isNum(ob) && isNum(nb) && nb > 0 && isNum(afterRev)) {
          beforeRev = ob * (afterRev / nb);
          fromTable = true;
        }
      }
      out.push({
        code, industryId, kind: "pair", fromTable, median,
        before: band(keepFor(cell, beforeRev, annualIncome), median),
        after: band(keepFor(cell, afterRev, annualIncome), median),
        beforeRev, afterRev,
      });
    } catch { out.push({ code, industryId, kind: "error" }); }
    if (out.length % 150 === 0) console.log(`  ...${out.length} / ${jobs.length}`);
  }
}
console.log(`Measuring net effect over ${jobs.length} pairs...\n`);
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const pairs = out.filter((r) => r.kind === "pair" && r.median != null);
const tally = (k) => ({ high: pairs.filter((p) => p[k] === "high").length, low: pairs.filter((p) => p[k] === "low").length, ok: pairs.filter((p) => p[k] === "ok").length });
const B = tally("before"), A = tally("after");

console.log(`\n============ NET EFFECT over ${pairs.length} judgeable pairs ============`);
console.log(`                    BEFORE      AFTER`);
console.log(`  ok             ${String(B.ok).padStart(8)}   ${String(A.ok).padStart(8)}`);
console.log(`  too high (withheld, hidden from the reader)  ${String(B.high).padStart(4)}  ->  ${String(A.high).padStart(4)}`);
console.log(`  too low  (PRINTED to the reader)             ${String(B.low).padStart(4)}  ->  ${String(A.low).padStart(4)}`);

const newlyLow = pairs.filter((p) => p.after === "low" && p.before !== "low");
const fixed = pairs.filter((p) => p.before === "high" && p.after === "ok");
const brokeGuardedToPrinted = pairs.filter((p) => p.before === "high" && p.after === "low");
console.log(`\n  pairs FIXED (too high -> ok):                 ${fixed.length}`);
console.log(`  pairs newly too low:                          ${newlyLow.length}`);
console.log(`  of those, moved GUARDED-high -> PRINTED-low:  ${brokeGuardedToPrinted.length}   <-- the regression that matters`);
if (brokeGuardedToPrinted.length > 0) {
  console.log(`\n  worst of them:`);
  for (const p of brokeGuardedToPrinted.slice(0, 15)) {
    console.log(`    ${p.code} ${String(p.industryId).padEnd(20)} rev ${Math.round(p.beforeRev).toLocaleString("en-US")} -> ${Math.round(p.afterRev).toLocaleString("en-US")}`);
  }
}
console.log(`\n  (pairs whose revenue is not from extrapolated_cells, blend cannot have moved them: ${pairs.filter((p) => !p.fromTable).length})`);
