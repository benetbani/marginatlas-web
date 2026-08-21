/**
 * tests/taxonomy/merges.test.ts
 *
 * Gate for the merge map (src/lib/taxonomy/merges.ts).
 *
 * WHY IT IS GATED. Merging is the second half of the founder's 2026-08-21
 * ruling on the activity list, and the half he attached a fear to: "The issue
 * is long term SEO/AEO, that scares me." Every merged slug must keep answering
 * and must land, in ONE hop, on a page that exists.
 *
 * THE CHECK THAT MATTERS MOST IS THE CHAIN CHECK. A survivor that is itself
 * merged away sends a reader two hops, and search engines treat a chain as a
 * soft 404. Nothing about the code would break; the map would simply be quietly
 * wrong, which is the failure mode this whole effort exists to remove.
 */
import { MERGES, survivorOf, isMerged } from "../../src/lib/taxonomy/merges";
import { isInScope } from "../../src/lib/taxonomy/scope_rules";
import { ALL_INDUSTRIES } from "../../src/lib/taxonomy";

let failed = 0;

function check(name: string, ok: boolean, detail?: string) {
  if (ok) {
    console.log(`  ok    ${name}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name}`);
    if (detail) console.log(`        ${detail}`);
  }
}

const byId = new Map(ALL_INDUSTRIES.map((i) => [i.id, i]));
const pairs = Object.entries(MERGES);

console.log(`\n  ${pairs.length} merges\n`);

/* Both halves must name a real activity. A typo on either side is silent:
   survivorOf returns the id unchanged and nothing errors. */
const badFrom = pairs.filter(([from]) => !byId.has(from));
check("every merged id is a real activity", badFrom.length === 0, badFrom.map(([f]) => f).join(", "));

const badTo = pairs.filter(([, to]) => !byId.has(to));
check("every survivor is a real activity", badTo.length === 0, badTo.map(([f, t]) => `${f} -> ${t}`).join(", "));

/* THE CHAIN CHECK. */
const chains = pairs.filter(([, to]) => to in MERGES);
check(
  "no survivor is itself merged away",
  chains.length === 0,
  chains.map(([f, t]) => `${f} -> ${t} -> ${MERGES[t]}`).join(", "),
);

const selfMerge = pairs.filter(([from, to]) => from === to);
check("nothing merges into itself", selfMerge.length === 0, selfMerge.map(([f]) => f).join(", "));

/* A SURVIVOR MUST BE IN SCOPE. Merging a live trade onto one the scope rules
   retired would send every reader of both to the directory, silently losing two
   activities where the intent was to lose one. */
const retiredSurvivors = pairs.filter(([, to]) => {
  const ind = byId.get(to);
  return ind ? !isInScope(ind).inScope : false;
});
check(
  "no survivor is an activity the scope rules retired",
  retiredSurvivors.length === 0,
  retiredSurvivors.map(([f, t]) => `${f} -> ${t} (retired)`).join(", "),
);

/* The reverse: merging away something already retired is harmless but is dead
   weight, and a dead rule reads as coverage while providing none. */
const alreadyRetired = pairs.filter(([from]) => {
  const ind = byId.get(from);
  return ind ? !isInScope(ind).inScope : false;
});
check(
  "nothing merges away an activity the scope rules already retired",
  alreadyRetired.length === 0,
  alreadyRetired.map(([f]) => f).join(", "),
);

console.log("\n  -- the founder's own example --");
check(
  "lingerie folds into clothing",
  survivorOf("lingerie_intimates") === "clothing_stores",
  survivorOf("lingerie_intimates"),
);
check("a surviving activity returns itself", survivorOf("restaurants") === "restaurants");
check("isMerged agrees with the map", isMerged("lingerie_intimates") && !isMerged("restaurants"));

console.log("\n  -- the trades he pointed at --");
check("Plumbing services folds into Plumbers", survivorOf("plumbing_services") === "plumbers");
check("Landscaping services folds into Landscaping & lawn care", survivorOf("landscaping_services") === "landscaping_lawn");
check("Roofing services folds into Roofers", survivorOf("roofing_services") === "roofers");

console.log("\n  -- the deliberate KEEPS, so a later sweep does not quietly take them --");
/* Each of these looks mergeable and is not, for a reason recorded in the map's
   own comments. Asserting them means a future tidy-up has to argue with a
   failing gate rather than with nobody. */
for (const kept of [
  "pizzerias", // an oven and a dough process are a different capital shape
  "pubs_taverns", // food-led, licensed differently, often freehold
  "ice_cream_shops", // different equipment, a season rather than a week
  "massage_therapy", // clinical, different room and licence
  "garden_centers", // seasonal and land-hungry
  "watch_jewelry_repair", // a workshop trade, not a retail one
]) {
  check(`${kept} is deliberately NOT merged`, !isMerged(kept));
}

console.log("\n  -- the outcome --");
const live = ALL_INDUSTRIES.filter((i) => isInScope(i).inScope && !isMerged(i.id));
console.log(`        ${ALL_INDUSTRIES.length} in the file -> ${live.length} published`);
check(
  "the published list is meaningfully shorter than 184",
  live.length < 155,
  `${live.length} published`,
);
check(
  "the published list did not collapse to nothing",
  live.length > 100,
  `${live.length} published`,
);

console.log(failed === 0 ? "\n  all pass" : `\n  ${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
