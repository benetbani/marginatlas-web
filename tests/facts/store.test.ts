/**
 * The Fact accessor answers a FactQuery.
 *
 * Run: npx tsx tests/facts/store.test.ts
 */
import { queryFacts, loadFacts, factValue } from "../../src/lib/facts/store";
import type { Fact } from "../../src/lib/facts/types";

const SAMPLE: Fact[] = [
  { entityType: "country", entityId: "GB", rowKey: "", metric: "tax.total_pct", value: 30.5, unit: "pct", tag: "held", c: 0.9, period: "2026", methodId: "researched" },
  { entityType: "country", entityId: "GB", rowKey: "shoreditch", metric: "cities.list.*.market_index_vs_capital", value: 88, unit: "index", tag: "modeled", c: 0.5, period: "2026", methodId: "mice_v1" },
  { entityType: "country", entityId: "FR", rowKey: "", metric: "tax.total_pct", value: 34.1, unit: "pct", tag: "held", c: 0.8, period: "2026", methodId: "researched" },
];

let failed = 0;
const check = (label: string, ok: boolean, detail = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` :: ${detail}` : ""}`);
};

loadFacts(SAMPLE);

check("entityId narrows", queryFacts({ entityId: "GB" }).length === 2);
check("exact metric narrows", queryFacts({ metrics: ["tax.total_pct"] }).length === 2);
check("prefix takes a domain", queryFacts({ metrics: ["cities."] }).length === 1);
check("rowKey narrows", queryFacts({ rowKey: "shoreditch" }).length === 1);
check("rowKey empty-string narrows to scalars", queryFacts({ rowKey: "" }).length === 2);
check("minConfidence drops the weak", queryFacts({ minConfidence: 0.7 }).length === 2);
check("empty query returns everything", queryFacts({}).length === 3);
check("no match is an empty array, never null", Array.isArray(queryFacts({ entityId: "ZZ" })));
check("factValue finds a scalar", factValue("GB", "tax.total_pct")?.value === 30.5);
check("factValue returns null when absent", factValue("GB", "nope.at.all") === null);

/* A PLACEHOLDER NEVER LEAVES THE STORE UNASKED (2026-09-23 night; store.ts's
   header). One placeholder beside the set: every read drops it by default,
   the ask returns it, and nothing else in the set moves. */
const PLACEHOLDER: Fact = { entityType: "city", entityId: "GB-london", rowKey: "", metric: "demand.spend_per_capita_usd", value: 22000, unit: "usd", tag: "placeholder", c: 0.1, period: "2026", methodId: "placeholder" };
loadFacts([...SAMPLE, PLACEHOLDER]);
check("a placeholder is dropped by default", queryFacts({ entityId: "GB-london" }).length === 0);
check("a placeholder is dropped from an empty query", queryFacts({}).length === 3);
check("a placeholder comes back when asked", queryFacts({ entityId: "GB-london", placeholders: "include" }).length === 1);
check("the ask takes the whole set with it", queryFacts({ placeholders: "include" }).length === 4);
check("factValue refuses a placeholder by default", factValue("GB-london", "demand.spend_per_capita_usd") === null);
check("factValue returns a placeholder when asked", factValue("GB-london", "demand.spend_per_capita_usd", { placeholders: "include" })?.tag === "placeholder");
check("a held figure beside it is untouched", factValue("GB", "tax.total_pct")?.value === 30.5);

if (failed > 0) {
  console.error(`facts/store: ${failed} failures`);
  process.exit(1);
}
console.log("facts/store: all pass");
