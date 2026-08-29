/**
 * scripts/spikes/probe_blend_before_after.mjs
 *
 * DID THE 2026-08-29 BLEND FIX CAUSE THE LOW-KEEP TAIL, OR EXPOSE IT?
 *
 * The lattice sweep (probe_keep_lattice_sweep.mjs) found 52 (country, trade)
 * pairs whose owner keep is under a twentieth of the country's median wage,
 * e.g. Mexico restaurants at $221 a year against a $14,400 median. Nothing
 * withholds those: the 6x screen guards the high side only, so they RENDER.
 *
 * The blend fix lowered revenue for many pairs by design, so the honest
 * question is whether it pushed these pairs from plausible into absurd, or
 * whether they were always this low and the sweep is simply the first thing
 * that looked. This runs BOTH blends over the same raw rows and prints them
 * side by side. The old blend is reproduced verbatim from the pre-fix source
 * (commit 360ba4ef), including its lack of label normalisation.
 *
 * Verdict rule: a pair is a REGRESSION only when the old blend gave a
 * plausible figure and the new one gives an absurd one.
 *
 * Run (from website/):
 *   set -a; . ./.env.local >/dev/null 2>&1; set +a
 *   npx tsx scripts/spikes/probe_blend_before_after.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { blendBandsToAllSizesRevenue, SIZE_BAND_ORDER, sizeBandRank } from "@/lib/cells/extrapolated_aggregation";
import { getCountryIndustryFirmDistribution } from "@/lib/cells/fill_defaults";
import { getCatastropheCeiling } from "@/lib/qa/plausibility_suppression";
import { iso2ToIso3 } from "@/lib/countries";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

/** The pre-fix blend, reproduced verbatim from commit 360ba4ef. */
function oldBlend(rows, opts = {}) {
  const { firmDistribution, ceiling } = opts;
  const valid = rows
    .map((r) => ({ band: r.size_band ?? "", rev: r.predicted_rev_per_firm }))
    .filter(
      (r) =>
        typeof r.rev === "number" && isFinite(r.rev) && r.rev > 0 &&
        (ceiling == null || r.rev <= ceiling),
    )
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
  if (byBand.size === 0) return null;
  const bands = [...byBand.entries()];
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

/** The pairs the sweep flagged as implausibly low, worst first. */
const SUBJECTS = [
  ["LI", "hairdressers_beauty"], ["MX", "sports_fitness"], ["LI", "auto_repair_shops"],
  ["RW", "cafes_coffee"], ["MX", "restaurants"], ["IR", "hairdressers_beauty"],
  ["LI", "sports_fitness"], ["SM", "hairdressers_beauty"], ["AD", "hairdressers_beauty"],
  ["MX", "cafes_coffee"], ["SI", "restaurants"], ["MX", "hairdressers_beauty"],
  ["BN", "hairdressers_beauty"], ["LI", "restaurants"], ["SI", "hairdressers_beauty"],
];

const usd = (v) => (v == null ? "null" : `$${Math.round(v).toLocaleString("en-US")}`);
let regressions = 0, preExisting = 0;

for (const [iso2, industryId] of SUBJECTS) {
  const iso3 = iso2ToIso3(iso2);
  const { data } = await supabase
    .from("extrapolated_cells")
    .select("*")
    .eq("country_iso3", iso3)
    .eq("industry_id", industryId)
    .order("year", { ascending: false })
    .limit(60);
  if (!data || data.length === 0) {
    console.log(`\n=== ${iso2} / ${industryId}: NO ROWS (revenue comes from synthesis, not this table) ===`);
    continue;
  }
  const year = data.reduce((y, r) => Math.max(y, r.year || 0), 0);
  const yearRows = data.filter((r) => (r.year || 0) === year);
  const dist = getCountryIndustryFirmDistribution(industryId, iso2);
  const ceiling = getCatastropheCeiling(industryId);
  const mapped = yearRows.map((r) => ({ size_band: r.size_band, predicted_rev_per_firm: r.predicted_rev_per_firm }));
  const uncapped = yearRows.filter((r) => !/scrub:revenue-cap/i.test(String(r.coverage_source ?? "")));
  const newRows = (uncapped.length > 0 ? uncapped : yearRows).map((r) => ({
    size_band: r.size_band, predicted_rev_per_firm: r.predicted_rev_per_firm,
  }));

  const before = oldBlend(mapped, { firmDistribution: dist, ceiling });
  const after = blendBandsToAllSizesRevenue(newRows, { firmDistribution: dist, ceiling });
  const change = before && after ? after / before : null;
  const verdict =
    before != null && after != null && after < before * 0.5
      ? "REGRESSION (new blend much lower)"
      : "pre-existing (blend barely moved it)";
  if (verdict.startsWith("REGRESSION")) regressions += 1; else preExisting += 1;
  console.log(`\n=== ${iso2} / ${industryId} ===`);
  console.log(`  bands: ${yearRows.map((r) => `${r.size_band}=${Math.round(r.predicted_rev_per_firm ?? 0)}`).join("  ")}`);
  console.log(`  firm distribution held: ${dist ? "yes" : "NO"}`);
  console.log(`  BEFORE=${usd(before).padStart(12)}   AFTER=${usd(after).padStart(12)}   ratio=${change ? change.toFixed(2) + "x" : "n/a"}   -> ${verdict}`);
}

console.log(`\n================ VERDICT ================`);
console.log(`  regressions caused by the new blend: ${regressions}`);
console.log(`  pre-existing low figures:            ${preExisting}`);
