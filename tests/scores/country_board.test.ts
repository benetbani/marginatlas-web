/**
 * tests/scores/country_board.test.ts
 * Plain assertion test for the reformed country board. Run:
 *   npx tsx tests/scores/country_board.test.ts
 */
import { buildCountryBoard } from "@/lib/scores/country_board";

let failures = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error("  x " + msg);
    failures++;
  }
}

const econ = {
  gdpPerCapita: 50000,
  avgMonthlySalary: 4000,
  netWealthPerAdult: 120000,
  selfEmploymentPct: 15,
  daysToStart: 7,
  inflationPctYoy: 3.2,
};

// 1. Five sections, in the shared demand-first order.
{
  const keys = buildCountryBoard({ econ }).map((s) => s.key);
  assert(keys.length === 5, "country board has five sections");
  assert(
    JSON.stringify(keys) ===
      JSON.stringify(["demand", "labor", "market", "friction", "survival"]),
    "sections run demand, labor, market, friction, survival",
  );
}

// 2. Demand section leads with market size, purchasing power, customer wealth.
{
  const demand = buildCountryBoard({ econ }).find((s) => s.key === "demand");
  assert(demand != null, "a demand section exists");
  const labels = (demand?.rows ?? []).map((r) => r.label);
  assert(labels.includes("Market size"), "demand has a market-size slot");
  assert(labels.includes("Purchasing power"), "demand has purchasing power");
  assert(labels.includes("Customer wealth"), "demand has customer wealth");
  const pp = demand?.rows.find((r) => r.label === "Purchasing power");
  assert(pp?.value != null && pp.value.startsWith("$50"), "purchasing power reads GDP per capita");
  const cw = demand?.rows.find((r) => r.label === "Customer wealth");
  assert(cw?.value != null && cw.value.includes("120"), "customer wealth reads net wealth per adult");
}

// 3. Inflation is gone everywhere (no price-stability row).
{
  const allLabels = buildCountryBoard({ econ }).flatMap((s) => s.rows.map((r) => r.label));
  assert(!allLabels.includes("Price stability"), "no inflation / price-stability row remains");
}

// 4. GDP and net wealth are not duplicated outside the demand section.
{
  const board = buildCountryBoard({ econ });
  const labor = board.find((s) => s.key === "labor");
  const market = board.find((s) => s.key === "market");
  assert(!(labor?.rows ?? []).some((r) => r.label === "GDP per capita"), "GDP per capita moved out of labor");
  assert(!(market?.rows ?? []).some((r) => r.label === "Household savings"), "net wealth moved out of market");
}

// 5. Null econ still yields the full five-section scaffold with dashes.
{
  const board = buildCountryBoard({ econ: null });
  assert(board.length === 5, "null econ still yields five sections");
  const demand = board.find((s) => s.key === "demand");
  assert((demand?.rows ?? []).every((r) => r.value == null), "null econ dashes every demand row");
}

if (failures > 0) {
  console.error(`\ncountry_board.test: FAIL (${failures} assertion(s))`);
  process.exit(1);
}
console.log("country_board.test: PASS. Country board demand-first, inflation dropped, no duplication.");
