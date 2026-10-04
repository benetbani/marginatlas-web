/**
 * Which spine pages a search engine may index (milestone 1, M10; his interview of 2026-09-26, answer 6: "UK pages + every page at
 * its floor; thin pages noindexed until they reach it").
 *
 * Run: npx tsx tests/seo/indexable.test.ts
 */
import { readFileSync } from "node:fs";
import { isIndexable, isUkPage, floorStanding, robotsFor } from "../../src/lib/seo/indexable";
import { floorsFromLaws } from "../../scripts/lib/block_count.mjs";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "indexable";
const FILE = "src/lib/seo/indexable.ts";
const REMEDY = "index a UK page and any spine page the floor census counted at its floor; nothing else; rerun the census after a block change";
let failed = 0;
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

/* UK PAGES INDEX, WHATEVER THEIR COUNT */
for (const p of ["/gb", "/gb/how-to-open", "/gb/london/restaurants", "/gb/manchester/restaurants", "/cities/london", "/cities/manchester", "/cities/london/neighborhoods", "/cities/london/neighborhoods/west-end", "/GB/London/Restaurants/"]) {
  check(`a UK page indexes: ${p}`, isUkPage(p) && isIndexable(p));
}
for (const p of ["/fr", "/cities/paris", "/industries/restaurants", "/us/california/restaurants"]) check(`not a UK page: ${p}`, !isUkPage(p));

/* ELSEWHERE, THE CENSUS AND THE FLOOR */
type Census = { floors: Record<string, number>; pages: Record<string, { surface: string; blocks: number }> };
const census = JSON.parse(readFileSync("data/seo/floor_census.json", "utf8")) as Census;
const entries = Object.entries(census.pages);
const at = entries.find(([, e]) => e.blocks >= census.floors[e.surface]);
const below = entries.find(([, e]) => e.blocks < census.floors[e.surface]);
check(`a page counted at its floor indexes${at ? ` (${at[0]}, ${at[1].blocks} of ${census.floors[at[1].surface]})` : ""}`, !!at && isIndexable(at[0]) && floorStanding(at[0])?.atFloor === true);
check(`a page counted under its floor does not${below ? ` (${below[0]}, ${below[1].blocks} of ${census.floors[below[1].surface]})` : ""}`, !below || (!isIndexable(below[0]) && floorStanding(below[0])?.atFloor === false));
check("a spine page the census never counted does not index (noindex on the rest)", !isIndexable("/zz/nowhere/nothing") && floorStanding("/zz/nowhere/nothing") === null);
check("the robots value: indexed or not, links always followed", JSON.stringify(robotsFor("/gb")) === '{"index":true,"follow":true}' && JSON.stringify(robotsFor("/zz/nowhere/nothing")) === '{"index":false,"follow":true}');
check("no UK page is in the census (they index by his rule, uncounted)", entries.every(([p]) => !isUkPage(p)));

/* THE CENSUS'S FLOORS ARE THE MODEL LAWS' OWN: a floor moved since the census was written makes it stale. */
const laws = floorsFromLaws(readFileSync("scripts/harness/check_model_laws.mjs", "utf8")) as Record<string, number>;
check(`the census's floors are the model laws' (${JSON.stringify(census.floors)})`, JSON.stringify(census.floors) === JSON.stringify(laws));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("seo/indexable: all pass");
