/**
 * A bill to open prints only on the trade it was written for (plan 06, task A3). The United Kingdom's restaurant bill
 * (scripts/import/deepening/gb/restaurants.sql, nine lines, 426,020) reached cafes, bars, bakeries, food trucks, ice cream,
 * pizzerias, pubs, tea houses, personal training and yoga through the measured-parent fallback: the cell loader now marks
 * such a row (`_fromParentIndustry`) and every reader of the bill refuses it.
 *
 * Run: npx tsx tests/cells/bill_own_trade.test.ts
 */
import { setupItemsFromCell } from "../../src/lib/spine/setup_items";
import { buildOpen } from "../../src/lib/spine/open_rows";
import { hasSetupCostData } from "../../src/components/sections/SetupCostBlock";
import type { Cell } from "../../src/lib/cells";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "bill-own-trade";
const FILE = "src/lib/spine/setup_items.ts";
const REMEDY = "keep the parent mark (src/lib/cells.ts getRegionalCell) and its refusal in every reader of setup_costs";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE, remedy = REMEDY) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file, detail: label, remedy });
};

/* The restaurant bill's capital and registration lines as the import wrote them (nine non-zero lines, 426,020 in all). */
const RESTAURANT_BILL = {
  capital: { property_fitout: 250_000, equipment_initial: 100_000, initial_inventory: 20_000, lease_deposit: 40_000, pre_opening_marketing: 12_000, total_estimated: 422_000 },
  registration: { business_registration_fee: 20, industry_licenses_fee: 1_500, insurance_bond_initial: 2_000, certifications_initial: 500, total_estimated: 4_020 },
  grade: "B",
} as unknown as Cell["setup_costs"];

const own = setupItemsFromCell({ setup_costs: RESTAURANT_BILL, country: "GB" });
check("the restaurants page keeps its own bill: nine lines, 426,020, the UK's", own !== undefined && own.items.length === 9 && own.items.reduce((a, i) => a + i.usd, 0) === 426_020 && own.scope === "GB");
check("a cafe holding the restaurants row through the parent fallback prints no bill", setupItemsFromCell({ setup_costs: RESTAURANT_BILL, _fromParentIndustry: "restaurants", country: "GB" }) === undefined);
const asCell = (extra: Partial<Cell>) => ({ setup_costs: RESTAURANT_BILL, ...extra }) as unknown as Cell;
check("the older setup block refuses the parent's bill too", hasSetupCostData(asCell({ _fromParentIndustry: "restaurants" })) === false && hasSetupCostData(asCell({})) === true);

/* WHOSE BILL IT IS (plan 2026-10-11 held-bill-provenance): one bill per country, grade B where typed by hand; the bulk files' grade C bill sets US lines everywhere. */
const SCOPE = "a bill prints only as its country's estimate: setup_items.ts passes a grade A or B row with its country, open_rows.ts prints it under COPY.tradeOpen.heldScope, stamped setup_costs:<trade>:<country>";
const graded = (grade?: string) => ({ ...RESTAURANT_BILL, grade }) as unknown as Cell["setup_costs"];
check("a grade C bill (US lines in every country) prints no lines", setupItemsFromCell({ setup_costs: graded("C"), country: "GB" }) === undefined, FILE, SCOPE);
check("a bill with no grade prints no lines", setupItemsFromCell({ setup_costs: graded(), country: "GB" }) === undefined, FILE, SCOPE);

/* THE CARD SAYS WHOSE IT IS (the same plan): the UK's bill under its words on every UK place, every figure stamped an estimate, the card marked modelled. */
const OPEN = "src/lib/spine/open_rows.ts";
const seed = (setup: unknown, geo: string, city: string) => ({ meta: { iso2: "GB", geo, city, industry: "restaurants", industry_id: "restaurants" }, setup });
const placed = [["london", "London"], ["manchester", "Manchester"], ["liverpool", "Liverpool"]].map(([g, c]) => buildOpen(seed(own, g, c)));
check("London, Manchester, Liverpool: $426K under 'A UK-wide estimate', stamped setup_costs:restaurants:GB, an estimate, marked modelled", placed.every((o) => o?.state === "held" && o.figure === "$426K" && o.focalWords === "A UK-wide estimate" && o.prov?.src === "setup_costs:restaurants:GB" && o.prov.kind === "estimate" && o.rows.every((r) => r.prov?.kind === "estimate") && o.confidence === "modeled" && o.sample), OPEN, SCOPE);
check("a bill that names no country prints no bill", buildOpen(seed({ items: own?.items }, "liverpool", "Liverpool"))?.state !== "held", OPEN, SCOPE);
check("a bill of a country with no words prints no bill", buildOpen(seed({ ...own, scope: "FR" }, "liverpool", "Liverpool"))?.state !== "held", OPEN, SCOPE);

/* THE US BILL PRINTS NONE FOR NOW (review tf-review-2 I-1; QUEUE us:cells-master-parent-mark): a US state page reads cells_master, and that path never marks a row
   borrowed from a parent trade (the parent tier of the US match, src/lib/cells.ts), so a sub-niche that lands on the restaurants row would print the full-service
   bill as "A US-wide estimate", stamped as its own trade. Only the UK's bill has words until the US path marks a parent's row. */
const COPY_FILE = "src/lib/spine/copy.ts";
const US_BILL = "keep US out of COPY.tradeOpen.heldScope until the US path marks a row it borrows from a parent trade (cells_master in src/lib/cells.ts, QUEUE us:cells-master-parent-mark): unmarked, a sub-niche such as pizzerias would print the full-service bill as 'A US-wide estimate', stamped as its own trade";
const usPizzerias = buildOpen({ meta: { iso2: "US", geo: "california", city: "California", industry: "pizzerias", industry_id: "pizzerias" }, setup: { ...own, scope: "US" } });
check("a US bill prints no held bill, because the US path borrows a parent's row unmarked (QUEUE us:cells-master-parent-mark)", usPizzerias?.state !== "held", COPY_FILE, US_BILL);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("cells/bill_own_trade: all pass");
