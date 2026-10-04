/**
 * The survival card on a UK trade page reads the UK's own survival (plan 06, task A2): the period figures at one, three and
 * five years, each rounded once through its interval, the 2019 starters beside them, and a foot naming the group; no card
 * on a UK trade without a single group; the trade's shard off the UK, unchanged.
 *
 * Run: npx tsx tests/spine/lasts_uk.test.ts
 */
import { buildLasts } from "../../src/lib/spine/lasts_rows";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "uk-survival-card";
const FILE = "src/lib/spine/lasts_rows.ts";
const REMEDY = "keep buildLasts's UK branch on src/lib/uk/registers/survival.ts; never print a shard's world figure on a UK page";
let failed = 0;
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

const uk = buildLasts("restaurants", "place", { iso2: "GB", slug: "restaurants" });
check("London restaurants: 94, 50 and 29 of 100 at one, three and five years, at recent rates", uk !== null && uk.values.yr1 === 94 && uk.values.yr3 === 50 && uk.values.yr5 === 29);
check("London restaurants: 39 of the 2019 starters after five years", uk !== null && uk.cohort2019 === 39);
check("London restaurants: the foot names the group", uk !== null && uk.foot === "Per 100 that open, recent rates, UK restaurants and mobile food.");
check("London restaurants: the demography's own figures", uk !== null && uk.confidence === "measured");
check("a UK trade in two groups (bakeries) draws no card", buildLasts("bakeries_retail", "place", { iso2: "GB", slug: "bakeries-retail" }) === null);
const de = buildLasts("restaurants", "place", { iso2: "DE", slug: "restaurants" });
check("Berlin restaurants: the shard's figures as before, no 2019 starters", de !== null && de.cohort2019 === undefined && de.confidence === "modeled");
const world = buildLasts("restaurants", "world");
check("the industry page: the shard's figures as before", world !== null && world.confidence === "modeled" && world.values.yr5 === de!.values.yr5);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/lasts_uk: all pass");
