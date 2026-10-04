/**
 * The cost to open at the city's prices and no licence list in another country's terms on a UK page (plan 06, task A6).
 *
 * Run: npx tsx tests/spine/uk_open_permits.test.ts
 */
import { buildPermits } from "../../src/lib/spine/permits_rows";
import { buildOpen } from "../../src/lib/spine/open_rows";
import { buildRivals } from "../../src/lib/spine/rivals_rows";
import { startupCapitalArchetypeKeyed } from "../../src/lib/markets/startup_capital_archetypes";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "uk-open-permits";
const FILE = "src/lib/spine/open_rows.ts";
const REMEDY = "keep the keyed figure at the place's factor with its estimate line, and no shard licence list on a GB page";
let failed = 0;
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

check("a UK trade page prints no shard licence list", buildPermits("restaurants", "GB") === null && buildPermits("barbershops", "gb") === null);
check("off the UK the list stands as before", buildPermits("restaurants", "DE") !== null);

const ny = startupCapitalArchetypeKeyed("barbershops");
check("the barbershop's keyed figure is New York's 60,000", ny === 60_000);
const london = buildOpen({ meta: { industry: "barbershops", industry_id: "barbershops", geo: "london", city: "London" } });
check("London barbershops: 60,000 at London's factor of 0.75 is 45,000", london !== null && london.state === "baseline" && london.value === 45_000 && london.figure === "$45K");
check("London barbershops: the basis calls it an estimate at London prices", london !== null && london.basis === "An estimate at London prices.");
const nowhere = buildOpen({ meta: { industry: "barbershops", industry_id: "barbershops" } });
check("no city: the keyed figure and its own basis, as before", nowhere !== null && nowhere.value === 60_000 && nowhere.basis !== "An estimate at London prices.");
const unkeyed = buildOpen({ meta: { industry: "shoe-repair", industry_id: "shoe_repair", geo: "london", city: "London" } });
check("an unkeyed trade never prints the 80,000 default", unkeyed === null || unkeyed.state !== "baseline");

const rivals = buildRivals({
  meta: { trade: "Barbershops", geo: "london", city: "London" },
  rivals: { list: ["restaurants", "cafes-coffee-shops", "nail-salons", "dry-cleaning-laundry", "bakeries-retail"].map((slug) => ({ name: slug, slug, href: `/gb/london/${slug}` })) },
});
const restRow = rivals?.rows.find((r) => r.key === "restaurants");
check("the other trades' figures take London's factor too", restRow !== undefined && restRow.value === Math.round(startupCapitalArchetypeKeyed("restaurants")! * 0.75));
check("the other trades say estimates at London prices once: on the basis, or leading the withheld count when one stands", rivals !== null && (rivals.withheldLine ? rivals.withheldLine.startsWith("Estimates at London prices.") && rivals.basis === "" : rivals.basis === "Estimates at London prices."));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/uk_open_permits: all pass");
