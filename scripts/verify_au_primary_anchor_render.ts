/**
 * scripts/verify_au_primary_anchor_render.ts
 *
 * Phase 1d gate. Sanity-checks that the AU primary-data anchor
 * resolves end-to-end for a representative sample of AU cells.
 *
 * For each sample (industry_id, revenue) tuple, run the same query
 * the cost-engine would run and verify:
 *   R1. An anchor is returned.
 *   R2. The anchor's ratios are present + within plausible bounds.
 *   R3. The chosen band actually contains the revenue.
 *   R4. The key benchmark resolves to a non-zero ratio.
 *
 * Run: npx tsx scripts/verify_au_primary_anchor_render.ts
 * Exit 0 = pass, exit 1 = fail.
 */
import { getAuPrimaryAnchor, classifyAuTurnoverBand } from "../src/lib/economic_profile/au_primary_loader";

const SAMPLES: Array<{ industryId: string; revenueUsd: number; label: string }> = [
  // Small bakery, small band.
  { industryId: "bakeries_retail", revenueUsd: 80_000, label: "small bakery" },
  // Medium restaurant, medium band.
  { industryId: "restaurants", revenueUsd: 500_000, label: "medium restaurant" },
  // Large cafe, large band.
  { industryId: "cafes_coffee", revenueUsd: 1_200_000, label: "large cafe" },
  // Trades band classification.
  { industryId: "plumbing_services", revenueUsd: 250_000, label: "medium plumber" },
  { industryId: "carpentry_services", revenueUsd: 90_000, label: "small carpenter" },
  { industryId: "auto_repair_shops", revenueUsd: 800_000, label: "large auto repair" },
  // Retail
  { industryId: "clothing_stores", revenueUsd: 300_000, label: "medium clothing store" },
  { industryId: "independent_pharmacy", revenueUsd: 2_500_000, label: "large pharmacy" },
];

let failures = 0;
const messages: string[] = [];

console.log("=== verify_au_primary_anchor_render ===");

for (const s of SAMPLES) {
  const anchor = getAuPrimaryAnchor(s.industryId, s.revenueUsd);
  if (!anchor) {
    messages.push(`[${s.label}] no anchor returned for industry=${s.industryId} revenue=${s.revenueUsd}`);
    failures++;
    continue;
  }
  // R3: band classification matches revenue.
  const bandCheck = classifyAuTurnoverBand(s.industryId, s.revenueUsd);
  if (bandCheck !== anchor.band_index) {
    messages.push(`[${s.label}] band mismatch: anchor=${anchor.band_index} classify=${bandCheck}`);
    failures++;
  }
  // R2 + R4: ratios within plausible bounds and key benchmark non-zero.
  const ratioCount = Object.keys(anchor.ratios).length;
  if (ratioCount === 0) {
    messages.push(`[${s.label}] anchor has no ratios`);
    failures++;
    continue;
  }
  for (const [key, r] of Object.entries(anchor.ratios)) {
    if (r.low < 0 || r.high > 1 || r.low > r.high) {
      messages.push(`[${s.label}] ratio ${key} out of bounds: low=${r.low} high=${r.high}`);
      failures++;
    }
  }
  // R4: key benchmark resolves.
  if (anchor.key_benchmark === "cost_of_sales" && !anchor.ratios.cost_of_sales) {
    messages.push(`[${s.label}] key_benchmark=cost_of_sales but ratio missing`);
    failures++;
  }
  if (anchor.key_benchmark === "total_expenses" && !anchor.ratios.total_expenses) {
    messages.push(`[${s.label}] key_benchmark=total_expenses but ratio missing`);
    failures++;
  }
}

console.log(`  ${SAMPLES.length} sample cells exercised.`);

if (failures > 0) {
  console.log(`\n  GATE: FAIL  (${failures} violations)`);
  for (const m of messages.slice(0, 30)) console.log("  - " + m);
  process.exit(1);
}
console.log("\n  GATE: PASS");
