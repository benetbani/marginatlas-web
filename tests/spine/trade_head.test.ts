/**
 * The trade page's head and share card (plan 06, task A4): a London trade prints the register's median yearly sales (rounded
 * once through its range, in dollars at the site's pound rate) with its count, a shared code its group's name; a filled
 * revenue (the constant 675,000 on 103 London trades) prints nothing; a row's own revenue off London prints as before.
 *
 * Run: npx tsx tests/spine/trade_head.test.ts
 */
import { tradeHeadFigure } from "../../src/lib/spine/trade_head";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "trade-head";
const FILE = "src/lib/spine/trade_head.ts";
const REMEDY = "keep the head on the register in London and on a read revenue elsewhere; a filled revenue never reaches a head";
let failed = 0;
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

/* London restaurants: 281,941.82 pounds (280,659 to 283,227) x 1.3265 = 373,996 dollars (372,294 to 375,701); half-width 1,704,
   so the unit is 1,000 and the head prints 374,000. */
const rest = tradeHeadFigure({ isLondon: true, slug: "restaurants", revenuePerFirm: 433_000, revenueFilled: false });
check("London restaurants: the register's median, 374,000 dollars, never the row's 433,000", rest !== null && rest.kind === "register" && rest.usd === 374_000);
check("London restaurants: 7,865 registered businesses, an exact code", rest !== null && rest.kind === "register" && rest.enterprises === 7865 && rest.group === null);
/* Barbershops read the shared hair and beauty code: 78,625.81 pounds is 104,297 dollars. */
const barb = tradeHeadFigure({ isLondon: true, slug: "barbershops", revenuePerFirm: 148_000, revenueFilled: true });
check("London barbershops: the code's median, its group named", barb !== null && barb.kind === "register" && barb.group === "hair or beauty business" && barb.usd !== null && Math.abs(barb.usd - 104_000) <= 1_000);
check("London pizzerias (an approximate code): no figure, never the row's", tradeHeadFigure({ isLondon: true, slug: "pizzerias", revenuePerFirm: 675_000, revenueFilled: true }) === null);
check("a filled revenue off London: no figure", tradeHeadFigure({ isLondon: false, slug: "cafes-coffee-shops", revenuePerFirm: 675_000, revenueFilled: true }) === null);
const row = tradeHeadFigure({ isLondon: false, slug: "restaurants", revenuePerFirm: 512_000, revenueFilled: false });
check("a read revenue off London: the row's figure as before", row !== null && row.kind === "row" && row.usd === 512_000);
check("no revenue at all: no figure", tradeHeadFigure({ isLondon: false, slug: "restaurants", revenuePerFirm: null, revenueFilled: false }) === null);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/trade_head: all pass");
