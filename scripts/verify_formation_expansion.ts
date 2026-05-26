/**
 * scripts/verify_formation_expansion.ts
 *
 * Spot-checks that the Wave 1 expansion of business_formation_costs_v1.json
 * actually plugs in to the country page accessor. For 15 newly-added
 * countries (10 Africa + 5 LatAm/Asia), reads the days-to-start through
 * the same code path the country page uses and verifies a real number
 * comes out (not the generic-emerging-market fallback).
 *
 * Run: npx tsx scripts/verify_formation_expansion.ts
 */

import formationJson from "../data/legal/business_formation_costs_v1.json";

type TierRow = {
  tier: string;
  local_term: string;
  setup_cost_usd: number;
  setup_days: number;
  complexity_score?: number;
};

type FormationFile = {
  version: string;
  countries: Record<string, TierRow[]>;
};

const FILE = formationJson as FormationFile;

// 10 Africa + 5 across LatAm/Asia/MENA. These are the canaries.
const SPOT_CHECK_ISO2 = [
  // Top 10 Africa
  "NG", "KE", "ZA", "EG", "GH", "ET", "CM", "DZ", "MA", "TN",
  // LatAm
  "AR", "CL", "CO",
  // Asia / MENA
  "BD", "SA",
];

function pickDaysToStart(tiers: TierRow[]): number | null {
  const soleTrader = tiers.find((t) => t.tier === "Sole Trader");
  const freelancer = tiers.find((t) => t.tier === "Freelancer");
  const llc = tiers.find((t) => t.tier === "LLC");
  const pick =
    (soleTrader && soleTrader.setup_days) ??
    (freelancer && freelancer.setup_days) ??
    (llc && llc.setup_days) ??
    Math.min(...tiers.map((t) => t.setup_days || 999));
  if (typeof pick === "number" && pick > 0 && pick < 999) return pick;
  return null;
}

function main() {
  const totalCountries = Object.keys(FILE.countries).length;
  console.log(`Formation data: ${totalCountries} countries (v${FILE.version})\n`);

  let pass = 0;
  let fail = 0;
  for (const iso of SPOT_CHECK_ISO2) {
    const tiers = FILE.countries[iso];
    if (!tiers || tiers.length === 0) {
      console.log(`  ${iso.padEnd(3)} FAIL  not present`);
      fail++;
      continue;
    }
    const days = pickDaysToStart(tiers);
    if (days == null) {
      console.log(`  ${iso.padEnd(3)} FAIL  no resolvable days-to-start`);
      fail++;
      continue;
    }
    const llc = tiers.find((t) => t.tier === "LLC");
    const llcCost = llc ? `$${llc.setup_cost_usd}` : "n/a";
    console.log(
      `  ${iso.padEnd(3)} OK    days=${String(days).padStart(2)}  llc=${llcCost.padStart(6)}  tiers=${tiers.length}`,
    );
    pass++;
  }

  console.log(`\nResult: ${pass} pass, ${fail} fail`);
  if (fail > 0) process.exit(1);
}

main();
