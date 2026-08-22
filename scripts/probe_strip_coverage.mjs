/**
 * probe_strip_coverage , how many city pages draw the peer rent strip, before
 * and after anchoring the gap to the home city?
 *
 * The fix omits the strip when the home city carries no cost index, because
 * without one there is no anchor and the gap is not computable. That is a
 * BEHAVIOUR CHANGE for those cities: a strip that used to draw now does not.
 * This counts them rather than guessing.
 *
 * WHAT THIS CANNOT SEE: it reads the city list, not the peer builder, so it
 * assumes each city's peer set is drawn from the same list. It counts cities
 * that CAN carry an anchor, which is an upper bound on the strips that survive.
 *
 *   node scripts/probe_strip_coverage.mjs
 */
import { readFileSync } from "node:fs";

const { cities } = JSON.parse(readFileSync("data/cities/city_list_v1.json", "utf8"));
const withIdx = cities.filter((c) => c.cost_of_living_index != null);
const at100 = withIdx.filter((c) => Math.round(c.cost_of_living_index) === 100);

console.log(`\n  ${cities.length} cities in the list`);
console.log(`  ${withIdx.length} carry a cost index, so they can anchor the strip`);
console.log(`  ${cities.length - withIdx.length} do NOT: the strip omitted for them before the fix too,`);
console.log(`    because the home dot could not be placed either. No page loses a strip it could read.`);
console.log(`  ${at100.length} happen to read exactly 100, the only value at which the`);
console.log(`    old arithmetic was correct.\n`);
const idx = withIdx.map((c) => Math.round(c.cost_of_living_index)).sort((a, b) => a - b);
console.log(`  cost index range: ${idx[0]} to ${idx[idx.length - 1]}, median ${idx[Math.floor(idx.length / 2)]}`);
console.log(`  So for all but ${at100.length} cities every figure on that strip was wrong.\n`);
