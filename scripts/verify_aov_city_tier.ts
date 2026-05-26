/**
 * scripts/verify_aov_city_tier.ts
 *
 * Spot-checks that Wave 2's AOV city-tier multiplier produces sane
 * numbers across activity × tier combinations. Compares unadjusted
 * baseline AOV to the tier-adjusted AOV and prints the breakeven
 * orders-per-day for each.
 *
 * Run: npx tsx scripts/verify_aov_city_tier.ts
 */
import { computeBreakeven } from "../src/lib/economics/breakeven";

type Case = {
  activity: string;
  revenue: number;
  tier: 1 | 2 | 3 | null;
  label: string;
};

const CASES: Case[] = [
  { activity: "restaurants", revenue: 800000, tier: 1, label: "Restaurants @ NYC tier-1" },
  { activity: "restaurants", revenue: 800000, tier: 2, label: "Restaurants @ Berlin tier-2" },
  { activity: "restaurants", revenue: 800000, tier: 3, label: "Restaurants @ Sofia tier-3" },
  { activity: "restaurants", revenue: 800000, tier: null, label: "Restaurants @ unknown (neutral)" },
  { activity: "hotels_lodging", revenue: 2000000, tier: 1, label: "Hotels @ Singapore tier-1" },
  { activity: "hotels_lodging", revenue: 2000000, tier: 3, label: "Hotels @ Sofia tier-3" },
  { activity: "barbershops", revenue: 180000, tier: 1, label: "Barbershop @ London tier-1" },
  { activity: "barbershops", revenue: 180000, tier: 3, label: "Barbershop @ Lagos tier-3" },
  { activity: "legal_services", revenue: 500000, tier: 1, label: "Legal services @ tier-1" },
  { activity: "legal_services", revenue: 500000, tier: 3, label: "Legal services @ tier-3" },
];

function fmt(n: number, digits = 0): string {
  return n.toFixed(digits);
}

function main() {
  console.log(
    "AOV city-tier multiplier spot-check\n" +
      "Activity × tier        |  Baseline AOV  |   Mult  |  Adj AOV  |  Breakeven /day\n" +
      "-----------------------+----------------+---------+-----------+-----------------",
  );
  let fail = 0;
  for (const c of CASES) {
    const r = computeBreakeven(c.activity, c.revenue, c.tier);
    if (!r) {
      console.log(`${c.label.padEnd(35)}  COMPUTE FAILED`);
      fail++;
      continue;
    }
    console.log(
      `${c.label.padEnd(34)} |     $${fmt(r.baselineAov).padStart(6)}    |  ${fmt(r.cityTierMultiplier, 2)}   |   $${fmt(r.aov, 1).padStart(6)}  |     ${fmt(r.breakevenOrdersDaily, 1).padStart(6)}`,
    );
  }
  if (fail > 0) {
    console.log(`\n${fail} cases failed.`);
    process.exit(1);
  }
  console.log(`\n${CASES.length}/${CASES.length} cases produced valid breakeven breakdowns.`);
}

main();
