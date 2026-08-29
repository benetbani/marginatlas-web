/**
 * scripts/spikes/probe_extrap_bands.mjs
 *
 * Raw-band evidence for the 2026-08-29 take-home defect: print every
 * extrapolated_cells row for the affected (country, industry) pairs, so we can
 * see whether the chain-scale revenue is one junk band a correct blend could
 * step around, or the same wrong-scale figure at every band (in which case no
 * blend can save it and withholding is the only honest fix).
 *
 * Run (from website/):
 *   set -a; . ./.env.local >/dev/null 2>&1; set +a
 *   npx tsx scripts/spikes/probe_extrap_bands.mjs
 */
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const SUBJECTS = [
  ["GBR", "sports_fitness"],
  ["GBR", "grocery_stores"],
  ["GBR", "auto_repair_shops"],
  ["TCD", "sports_fitness"],
  ["ALB", "sports_fitness"],
];

const usd = (v) => (v == null ? "null" : `$${Math.round(v).toLocaleString("en-US")}`);

for (const [iso3, industryId] of SUBJECTS) {
  const { data, error } = await supabase
    .from("extrapolated_cells")
    .select("*")
    .eq("country_iso3", iso3)
    .eq("industry_id", industryId)
    .order("year", { ascending: false })
    .limit(60);
  console.log(`\n========= ${iso3} / ${industryId} =========`);
  if (error) {
    console.log("  ERROR:", error.message);
    continue;
  }
  if (!data || data.length === 0) {
    console.log("  no rows");
    continue;
  }
  // Print the column names once so we know the full shape.
  if (iso3 === "GBR" && industryId === "sports_fitness") {
    console.log("  columns:", Object.keys(data[0]).join(", "));
  }
  for (const r of data) {
    console.log(
      `  year=${r.year}  band=${String(r.size_band).padEnd(6)}  rev/firm=${usd(r.predicted_rev_per_firm).padStart(14)}  quality=${r.quality_score}  tier=${r.coverage_tier}  source=${r.coverage_source ?? r.extrapolation_source ?? ""}`,
    );
  }
}
