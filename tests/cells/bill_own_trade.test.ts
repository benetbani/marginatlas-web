/**
 * A bill to open prints only on the trade it was written for (plan 06, task A3). The United Kingdom's restaurant bill
 * (scripts/import/deepening/gb/restaurants.sql, nine lines, 426,020) reached cafes, bars, bakeries, food trucks, ice cream,
 * pizzerias, pubs, tea houses, personal training and yoga through the measured-parent fallback: the cell loader now marks
 * such a row (`_fromParentIndustry`) and every reader of the bill refuses it.
 *
 * Run: npx tsx tests/cells/bill_own_trade.test.ts
 */
import { setupItemsFromCell } from "../../src/lib/spine/setup_items";
import { hasSetupCostData } from "../../src/components/sections/SetupCostBlock";
import type { Cell } from "../../src/lib/cells";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "bill-own-trade";
const FILE = "src/lib/spine/setup_items.ts";
const REMEDY = "keep the parent mark (src/lib/cells.ts getRegionalCell) and its refusal in every reader of setup_costs";
let failed = 0;
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

/* The restaurant bill's capital and registration lines as the import wrote them (nine non-zero lines, 426,020 in all). */
const RESTAURANT_BILL = {
  capital: { property_fitout: 250_000, equipment_initial: 100_000, initial_inventory: 20_000, lease_deposit: 40_000, pre_opening_marketing: 12_000, total_estimated: 422_000 },
  registration: { business_registration_fee: 20, industry_licenses_fee: 1_500, insurance_bond_initial: 2_000, certifications_initial: 500, total_estimated: 4_020 },
} as unknown as Cell["setup_costs"];

const own = setupItemsFromCell({ setup_costs: RESTAURANT_BILL });
check("the restaurants page keeps its own bill: nine lines, 426,020", own !== undefined && own.items.length === 9 && own.items.reduce((a, i) => a + i.usd, 0) === 426_020);
check("a cafe holding the restaurants row through the parent fallback prints no bill", setupItemsFromCell({ setup_costs: RESTAURANT_BILL, _fromParentIndustry: "restaurants" }) === undefined);
const asCell = (extra: Partial<Cell>) => ({ setup_costs: RESTAURANT_BILL, ...extra }) as unknown as Cell;
check("the older setup block refuses the parent's bill too", hasSetupCostData(asCell({ _fromParentIndustry: "restaurants" })) === false && hasSetupCostData(asCell({})) === true);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("cells/bill_own_trade: all pass");
