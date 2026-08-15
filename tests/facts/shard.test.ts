/**
 * Widening a shard into Facts.
 *
 * Run: npx tsx tests/facts/shard.test.ts
 */
import { shardToFacts } from "../../src/lib/facts/shard";

let failed = 0;
const check = (label: string, ok: boolean, detail = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` :: ${detail}` : ""}`);
};

const facts = shardToFacts({
  entityType: "country",
  entityId: "GB",
  facts: [
    { rowKey: "", metric: "tax.total_pct", value: 30.5, unit: "pct", tag: "held", c: 0.9, period: "latest", methodId: "researched" },
    { rowKey: "soho", metric: "cities.list.*.slug", value: "soho", unit: null, tag: "nonsense", c: 0.2, period: "latest", methodId: "mice_v1" },
  ],
});

check("every fact gets the wrapper's entityType", facts.every((f) => f.entityType === "country"));
check("every fact gets the wrapper's entityId", facts.every((f) => f.entityId === "GB"));
check("a known tag survives", facts[0].tag === "held");
check("an unknown tag becomes placeholder, never a guess", facts[1].tag === "placeholder");
check("the row key is preserved", facts[1].rowKey === "soho");
check("a null unit stays null", facts[1].unit === null);
check("a numeric value stays numeric", facts[0].value === 30.5);
check("a string value stays a string", facts[1].value === "soho");
check("an empty shard yields an empty array", shardToFacts({ entityType: "city", entityId: "GB-london", facts: [] }).length === 0);

const unknownEntity = shardToFacts({ entityType: "planet", entityId: "MARS", facts: [
  { rowKey: "", metric: "x.y", value: 1, unit: null, tag: "held", c: 1, period: "latest", methodId: "m" },
]});
check("an unrecognised entityType is rejected, not coerced", unknownEntity.length === 0);

if (failed > 0) {
  console.error(`facts/shard: ${failed} failures`);
  process.exit(1);
}
console.log("facts/shard: all pass");
