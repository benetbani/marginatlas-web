import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const { getCellBySlug } = await import("../src/lib/cells");
  const cases: [string, string, string][] = [
    ["ke", "kenya", "restaurants"],
    ["ke", "kenya", "hairdressers-beauty"],
    ["ch", "switzerland", "hairdressers-beauty"],
    ["ng", "nigeria", "grocery-stores"],
  ];
  for (const [c, g, i] of cases) {
    try {
      const cell = await getCellBySlug(c, g, i);
      const net = cell.net_margin != null ? (cell.net_margin * 100).toFixed(0) + "%" : "null";
      console.log(`${c}/${i}: net=${net} cost=${JSON.stringify(cell.cost_structure)} firms=${JSON.stringify(cell.firm_distribution)}`);
    } catch (e) {
      console.log(`${c}/${i}: ERROR ${(e as Error).message}`);
    }
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
