import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import { getCellBySlug } from "../src/lib/cells";

async function main() {
  const cell = await getCellBySlug("de", "frankfurt", "restaurants");
  console.log("Resolved cell for /de/frankfurt/restaurants:");
  console.log(`  country: ${cell.country}`);
  console.log(`  geo_id: ${cell.geo_id}`);
  console.log(`  geo_name: ${cell.geo_name}`);
  console.log(`  geo_level: ${cell.geo_level}`);
  console.log(`  industry_id: ${cell.industry_id}`);
  console.log(`  industry_name: ${cell.industry_name}`);
  console.log(`  revenue_per_firm: $${(cell.revenue_per_firm || 0).toLocaleString()}`);
  console.log(`  payroll_per_employee: $${(cell.payroll_per_employee || 0).toLocaleString()}`);
  console.log(`  n_employees: ${cell.n_employees}`);
  console.log(`  is_synthetic: ${cell.is_synthetic}`);
  console.log(`  coverage_tier: ${cell.coverage_tier}`);
  console.log(`  coverage_source: ${cell.coverage_source}`);
}
main();
