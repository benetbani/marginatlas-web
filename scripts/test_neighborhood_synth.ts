/**
 * Plan v26 Phase B.3.4 — neighborhood synthesis sanity harness.
 *
 * For 10 (city, neighborhood, industry) samples, verify:
 *   - cell renders with revenue / margins / employees
 *   - revenue stays within SMB-physical bounds
 *   - revenue / (employees × wage) ≥ 1.4 (common-sense)
 *   - character multiplier visibly affects revenue
 */
import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import { getCellBySlug } from "../src/lib/cells";
import { getNeighborhood, applyNeighborhoodMultiplier, getMultiplier } from "../src/lib/cities/neighborhoods";
import { slugToIndustry, resolveToMeasuredIndustry } from "../src/lib/taxonomy";

const samples: Array<[string, string, string, string]> = [
  ["us", "new-york", "manhattan", "restaurants"],
  ["us", "new-york", "bronx", "restaurants"],
  ["gb", "london", "central-london", "legal-services"],
  ["gb", "london", "east-london", "software-development"],
  ["fr", "paris", "right-bank-central", "jewelry-stores"],
  ["fr", "paris", "north-periphery", "auto-repair-shops"],
  ["jp", "tokyo", "central", "hotels-lodging"],
  ["jp", "tokyo", "east", "fabricated-metal-mfg"],
  ["de", "berlin", "mitte-central", "cafes-coffee-shops"],
  ["ae", "dubai", "dubai-marina", "hotels-lodging"],
];

async function main() {
  let pass = 0;
  let fail = 0;
  for (const [country, city, nbSlug, industrySlug] of samples) {
    const nb = getNeighborhood(city, nbSlug);
    if (!nb) {
      console.log(`✗ ${country}/${city}/${nbSlug}/${industrySlug} — neighborhood not found`);
      fail++;
      continue;
    }
    const rawInd = slugToIndustry(industrySlug);
    if (!rawInd) {
      console.log(`✗ ${country}/${city}/${nbSlug}/${industrySlug} — industry not in taxonomy`);
      fail++;
      continue;
    }
    const ind = resolveToMeasuredIndustry(rawInd) || rawInd;
    const cityCell = await getCellBySlug(country, city, industrySlug);
    const cell = applyNeighborhoodMultiplier(cityCell, ind.id, nb.character);
    const mult = getMultiplier(ind.id, nb.character);

    const rev = cell.revenue_per_firm || 0;
    const wage = cell.payroll_per_employee || 0;
    const empl = cell.n_employees || 0;
    const ratio = wage && empl ? rev / (empl * wage) : 0;

    const ok =
      rev > 0 &&
      cell.gross_margin != null &&
      cell.operating_margin != null &&
      cell.net_margin != null &&
      ratio >= 1.4;

    const cityRev = cityCell.revenue_per_firm || 0;
    const relative = cityRev ? (rev / cityRev).toFixed(2) : "n/a";

    console.log(
      `${ok ? "✓" : "✗"} ${country}/${city}/${nbSlug}/${industrySlug}`,
    );
    console.log(
      `  char=${nb.character}  mult=${mult.revenue.toFixed(2)}×  rev=$${Math.round(rev).toLocaleString()}  (city $${Math.round(cityRev).toLocaleString()}, ratio×city ${relative})`,
    );
    console.log(
      `  empl=${empl}  wage=$${Math.round(wage).toLocaleString()}  rev/payroll=${ratio.toFixed(2)}`,
    );
    console.log(
      `  margins gross=${((cell.gross_margin || 0) * 100).toFixed(0)}%  op=${((cell.operating_margin || 0) * 100).toFixed(0)}%  net=${((cell.net_margin || 0) * 100).toFixed(0)}%`,
    );
    if (ok) pass++;
    else fail++;
  }
  console.log(`\n${pass}/${samples.length} pass`);
}
main();
