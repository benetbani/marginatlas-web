/**
 * The London trade hero and sales strip (plan 06, task A5; his rulings of 2026-10-04): break-even and the middle owner's keeps
 * from the engine on the three trades whose money prints (restaurants, nail salons, sports and fitness), the register's
 * typical yearly sales and counts on every other London trade with a register row, every money figure rounded once in
 * dollars at the site's pound rate; the strip the register's quartiles.
 *
 * Run: npx tsx tests/spine/london_trade_hero.test.ts
 */
import { londonTradeHero, londonTradeStrip, londonMoneyPrints } from "../../src/lib/spine/london_trade_hero";
import { tradeHeroFacts } from "../../src/lib/spine/trade_hero_facts";
import { buildTradeSpread } from "../../src/lib/spine/trade_spread_rows";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "london-trade-hero";
const FILE = "src/lib/spine/london_trade_hero.ts";
const REMEDY = "keep the London hero on the engine (three trades) and the register (every other); never the curated model or the City of London's row";
let failed = 0;
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

check("money prints on restaurants, nail salons and sports and fitness, and not on barbershops (utilities lumped with rent)", londonMoneyPrints("restaurants") && londonMoneyPrints("nail-salons") && londonMoneyPrints("sports-fitness") && !londonMoneyPrints("barbershops"));

/* Restaurants: break-even 556,017.36 pounds (535,523.20 to 577,038.50) is 737,557 dollars (710,372 to 765,442); half-width 27,535,
   so the unit is 10,000 and it prints 740,000. Keeps 13,756.27 (11,198.28 to 16,056.34) is 18,248 (14,855 to 21,299): 18,000. */
const r = londonTradeHero("restaurants");
check("restaurants: break-even leads, $740K a year to carry an average London restaurant", r !== null && r.kind === "breakEven" && r.answer.label === "Sales to break even" && r.answer.value === "$740K" && r.answer.basis === "a year, to carry an average London restaurant");
const cell = (key: string) => r?.cells.find((c) => c.key === key);
check("restaurants: 32 of 100 registered restaurants take that much", cell("above")?.value === "32 of 100" && cell("above")?.label === "Take that much");
check("restaurants: the middle one keeps $18K as a sole trader, an estimate", cell("keeps")?.value === "$18K" && cell("keeps")?.note === "as a sole trader, an estimate");
check("restaurants: 7,865 registered businesses", cell("firms")?.value === "7,865");
check("restaurants: the company's keeps under the plus beside the sole trader's", r !== null && r.detail !== null && r.detail.rows.length === 2 && r.detail.rows[1].value === "$18K");
check("restaurants: the foot names the register, no source agency", r !== null && r.foot === "Registered businesses in London, March 2026.");

/* Barbershops: no money (utilities lumped with rent until plan 07); the register's typical yearly sales of the shared code. */
const b = londonTradeHero("barbershops");
check("barbershops: typical yearly sales lead, $104K, the middle hair or beauty business", b !== null && b.kind === "sales" && b.answer.label === "Typical yearly sales" && b.answer.value === "$104K" && b.answer.basis === "the middle hair or beauty business in London");
check("barbershops: 9,695 registered, every hair or beauty business, and 63 of 100 take under $133K", b !== null && b.cells.find((c) => c.key === "firms")?.value === "9,695" && b.cells.find((c) => c.key === "firms")?.note === "every hair or beauty business" && b.cells.find((c) => c.key === "under")?.label === "Take under $133K" && b.cells.find((c) => c.key === "under")?.value === "63 of 100");
check("barbershops: no plus", b !== null && b.detail === null);
check("pizzerias (an approximate code): no London hero", londonTradeHero("pizzerias") === null);

/* The strip: restaurants' quartiles 124,596.43, 281,941.82 and 759,125.14 pounds, rounded once in dollars. */
const s = londonTradeStrip("restaurants");
check("restaurants: three marks, the lower quarter, the middle and the upper quarter", s !== null && s.marks.map((m) => m.key).join(",") === "q25,typical,q75");
check("restaurants: the middle mark is the head's figure, 374,000", s !== null && s.marks[1].value === 374_000);
check("restaurants: the strip's basis", s !== null && s.basis === "Yearly sales of registered businesses in London.");
const bs = londonTradeStrip("barbershops");
check("barbershops: the strip's basis names the group", bs !== null && bs.basis === "Yearly sales of every hair or beauty business in London.");

/* The masthead and the strip take the London branch from the seed the adapter builds. */
const seed = { meta: { trade: "Restaurants", city: "London", iso2: "GB", money_shown: false }, london: londonTradeHero("restaurants"), london_strip: londonTradeStrip("restaurants") };
const f = tradeHeroFacts(seed);
check("the masthead reads the London block: $740K, three cells, the plus, no net", f !== null && f.answer?.value === "$740K" && f.cells.length === 3 && f.detail !== null && f.net === null);
const sp = buildTradeSpread(seed);
check("the strip reads the London block: three counted marks, not modelled", sp !== null && sp.marks.length === 3 && sp.modelled === false && sp.sample === false);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/london_trade_hero: all pass");
