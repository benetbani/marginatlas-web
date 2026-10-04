/**
 * UK survival by trade group (data/uk/registers/survival.json): the period curve at one, three and five years with its
 * interval, and the 2019 starters' five-year record, for a trade that maps to exactly one group; nothing for a trade that
 * maps to two groups or none, and nothing for a group with no plain name.
 *
 * Run: npx tsx tests/uk/registers/survival.test.ts
 */
import { tradeSurvivalUk, SURVIVAL_GROUP_NAME } from "../../../src/lib/uk/registers/survival";
import survivalJson from "../../../data/uk/registers/survival.json";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-trade-survival";
const FILE = "src/lib/uk/registers/survival.ts";
const REMEDY = "fix survival.ts; a group without a plain name in SURVIVAL_GROUP_NAME gets one from its official name, never from a trade's";
let failed = 0;
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

const r = tradeSurvivalUk("restaurants");
check("restaurants: one group, 561, named in plain words", r !== null && r.group === "561" && r.groupName === "restaurants and mobile food");
check("restaurants: period survival 0.940, 0.503 and 0.293 at one, three and five years", r !== null && [r.period[1].survival, r.period[3].survival, r.period[5].survival].map((x) => x.toFixed(3)).join(",") === "0.940,0.503,0.293");
check("restaurants: each period figure inside its interval", r !== null && [1, 3, 5].every((t) => { const p = r.period[t as 1 | 3 | 5]; return p.lo <= p.survival && p.survival <= p.hi; }));
check("restaurants: the 2019 starters, 0.391 after five years", r !== null && r.cohort2019Five.toFixed(3) === "0.391");
const b = tradeSurvivalUk("barbershops");
check("barbershops: the group of other personal services, 960", b !== null && b.group === "960" && b.groupName === "other personal services");
check("bakeries map to two groups: no single figure", tradeSurvivalUk("bakeries-retail") === null);
check("a trade with no group: nothing", tradeSurvivalUk("pool-service-maintenance") === null);
check("an unknown trade: nothing", tradeSurvivalUk("no-such-trade") === null);

/* Every group name is five words at most, so the survival card's foot stays inside the copy gate's twelve. */
const long = Object.entries(SURVIVAL_GROUP_NAME).filter(([, n]) => n.split(/\s+/).length > 5).map(([g, n]) => `${g} "${n}"`);
check(`every group name is five words at most${long.length ? `: ${long.join(", ")}` : ""}`, long.length === 0);

/* Every group a trade maps to alone has a plain name, so no survival prints without saying whose it is. */
type S = { trade_groups: Record<string, string[]> };
const single = new Set(Object.values((survivalJson as unknown as S).trade_groups).filter((g) => g.length === 1).map((g) => g[0]));
const unnamed = [...single].filter((g) => !SURVIVAL_GROUP_NAME[g]).sort();
check(`every single trade group has a plain name${unnamed.length ? `: missing ${unnamed.join(", ")}` : ""}`, unnamed.length === 0);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/registers/survival: all pass");
