/**
 * THE COST SIMULATOR'S ARITHMETIC (plan 2026-10-13 cost-simulator, Task 1; spec docs/superpowers/specs/2026-10-13-cost-simulator-design.md,
 * section 3, Gates: "a new engine test pins the break-even arithmetic (F / (1 - v), the owner's pay in F, a loss shown as a loss, payback withheld at
 * a loss) against hand-worked cases for London restaurants and one place outside the UK").
 *
 * THE FIRST SLICE (spec section 2): London's three money trades on model.ts as it stands give the engine's break-even to the penny, its profit at the
 * anchor's sales and the sole trader's keeps of it. THE HAND-WORKED CASES: London restaurants (the register, the valuation, the recipe and the law,
 * summed in the plan's Task 1) and Berlin restaurants (R7 4.1's rows as the files held them on 2026-10-13). Then Review Focus 1, 2 and 4: a loss, a
 * sale that costs all it brings, no sales, extremes.
 * BLIND SPOT, stated: it proves the arithmetic on what it is handed; that a default is the right default is tests/simulator/defaults.test.ts's.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/simulator/engine.test.ts
 */
import type { EngineInputs, EngineResult, Out, Stamp } from "../../src/lib/simulator/engine";
import { pennies } from "../../src/lib/uk/law/money";
import { soleTraderTakeHome } from "../../src/lib/uk/law/take_home";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "calc-engine";
const FILE = "src/lib/simulator/engine.ts";
const REMEDY = "the engine is F / (1 - v) on absolute inputs: every fixed line and the owner's pay in F, each share of a sale in v, a loss printed as a loss, no break-even where a sale costs all it brings, the payback withheld at a loss, nothing filled";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

const est = (src: string): Stamp => ({ src, kind: "estimate" });
const won = (src: string): Stamp => ({ src, kind: "worked out" });
const mine = (key: string): Stamp => ({ src: `calculator:lever:${key}`, kind: "yours" });
const v = (x: number, stamp: Stamp) => ({ v: x, stamp });
const value = (o: Out): number | null => (o.held ? o.value : null);
const reason = (o: Out): string | null => (o.held ? null : o.reason);
/* JSON.stringify writes NaN and Infinity as null, so the scan walks the values. */
const nonFinite = (x: unknown): boolean => (typeof x === "number" ? !Number.isFinite(x) : Array.isArray(x) ? x.some(nonFinite) : x !== null && typeof x === "object" ? Object.values(x as Record<string, unknown>).some(nonFinite) : false);

function blank(): EngineInputs {
  return { area: null, rentPerM2: null, serviceChargePerM2: null, rates: null, lines: [], roles: [], onCost: null, variable: [], runningShare: null, ownerPay: null, targetProfit: null, sales: null, ticket: null, openingCost: null, loan: { amount: null, ratePct: null, years: null }, tax: { law: "none" }, spread: null };
}

/* BERLIN RESTAURANTS, R7 4.1's rows as the files held them on 2026-10-13, in dollars: 22 m2 a worker (data/finance/industry_cost_profile_v1.json,
   food_drink) for the shard's eleven typical heads, the owner's seat among them, is 242 m2; secondary rent 608 and service charge 40 a m2 a year
   (data/facts/city/DE-berlin.json); the city's wage, 4,100 a month (data/economics/city_wage_premium_v1.json), times 12 times each role's index
   (1.15, 1.1, 0.72, 0.62, 0.55, data/facts/industry/restaurants.json); Germany's employer rate 0.197 (src/lib/tax/country_rates_2024.json); food
   32% and fees 4% of each sale and running costs 12% (the restaurants recipe, its line that pays no staff); spend per head 22. */
function berlin(): EngineInputs {
  const wage = 4100 * 12;
  const role = (key: string, heads: number, index: number) => ({ key, heads, headsStamp: est(`facts/industry/restaurants.json:roles.${key}`), payYear: v(pennies(wage * index), est(`economics/city_wage_premium_v1.json:berlin x ${index}`)) });
  return {
    ...blank(),
    area: v(242, est("finance/industry_cost_profile_v1.json:food_drink.sqm_per_fte x 11")),
    rentPerM2: v(608, est("facts/city/DE-berlin.json:realestate.rent_secondary_usd_sqm_yr")),
    serviceChargePerM2: v(40, est("facts/city/DE-berlin.json:realestate.service_charge_usd_sqm_yr")),
    roles: [role("owner_or_general_manager", 0, 1.15), role("head_chef_or_kitchen_lead", 1, 1.1), role("line_and_prep_cook", 4, 0.72), role("server_or_front_of_house", 4, 0.62), role("dishwasher_or_kitchen_porter", 1, 0.55)],
    onCost: { rate: v(0.197, est("tax/country_rates_2024.json:DE.employer_social")) },
    variable: [{ key: "food and drink", share: 0.32, stamp: est("uk/pnl/recipes.ts:restaurants:food and drink") }, { key: "marketing and delivery fees", share: 0.04, stamp: est("uk/pnl/recipes.ts:restaurants:marketing and delivery fees") }],
    runningShare: v(0.12, est("uk/pnl/recipes.ts:restaurants:utilities, supplies, running costs")),
    ticket: v(22, est("facts/industry/restaurants.json:demand.spend_per_head_usd")),
  };
}

async function main(): Promise<void> {
  const E = await import("../../src/lib/simulator/engine").catch(() => null);
  const U = await import("../../src/lib/simulator/uk_model").catch(() => null);
  check("the engine is there", !!E);
  check("the first slice's adapter is there", !!U, "src/lib/simulator/uk_model.ts");
  if (!E || !U) { redSummary(RULE, failed, REMEDY, "modules missing"); process.exit(1); }
  const L = await import("../../src/lib/uk/pnl/london");
  const M = await import("../../src/lib/uk/pnl/model");
  const results: unknown[] = [];
  const run = (i: EngineInputs) => { const r = E.simulate(i); results.push(r); return r; };

  /* LONDON RESTAURANTS BY HAND: the register's mean under 5m, 597,440.87 (turnover.json, E12000007); the average premises, 1,656,000 m2 over
     8,170 premises at 362 a m2 (premises.json) = 73,374.79 of rent; rates at 43p on it = 31,551.16; the recipe's staff 30% and running 12% of the
     anchor = 179,232.26 and 71,692.90; F = 355,851.11; v = 32% + 4%; R* = 355,851.11 / 0.64 = 556,017.36. */
  const m = L.londonTradeInputs("restaurants");
  check("model.ts builds London restaurants", !!m, "src/lib/uk/pnl/london.ts");
  if (!m) { redSummary(RULE, failed, REMEDY, "no London inputs"); process.exit(1); }
  const london = U.ukModelInputs(m, { trade: "restaurants", geography: "E12000007" });
  const lr = run(london);
  const line = (key: string) => lr.bill.find((b) => b.key === key)?.year ?? null;
  check(`the anchor is 597,440.87 (${m.anchorSales.value})`, m.anchorSales.value === 597440.87, "src/lib/uk/pnl/inputs.ts");
  check(`London's bill by hand: rent 73,374.79, rates 31,551.16, staff 179,232.26, running 71,692.90 (${line("rent")}, ${line("rates")}, ${line("line:crew")}, ${line("line:running")})`, line("rent") === 73374.79 && line("rates") === 31551.16 && line("line:crew") === 179232.26 && line("line:running") === 71692.9);
  check(`F = 355,851.11 and R* = 355,851.11 / (1 - 0.36) = 556,017.36 (${value(lr.fixedYear)}, ${value(lr.breakEven)})`, value(lr.fixedYear) === 355851.11 && value(lr.breakEven) === 556017.36);
  check(`with no sales the bill stands at the break-even and the margin waits for sales (${lr.billAt}, ${reason(lr.marginBefore)})`, lr.billAt === "break-even" && reason(lr.marginBefore) === "no-sales" && reason(lr.profit) === "no-sales");
  check(`each 100 of fixed cost needs 156.25 of sales (${value(lr.perHundred)})`, value(lr.perHundred) === 156.25);
  check(`the outputs rest on the recipe's shares, so they are estimates, and nothing is the reader's (${lr.breakEven.held ? `${lr.breakEven.kind}, ${lr.breakEven.yours}` : "withheld"})`, lr.breakEven.held && lr.breakEven.kind === "estimate" && !lr.breakEven.yours);

  /* THE FIRST SLICE: London's three money trades against model.ts as it stands. */
  for (const slug of ["restaurants", "nail-salons", "sports-fitness"]) {
    const mm = L.londonTradeInputs(slug);
    if (!mm) { check(`${slug}: model.ts builds London's inputs`, false, "src/lib/uk/pnl/london.ts"); continue; }
    const at = mm.anchorSales.value;
    const r = run(U.ukModelInputs(mm, { trade: slug, geography: "E12000007" }));
    const rA = run({ ...U.ukModelInputs(mm, { trade: slug, geography: "E12000007" }), sales: v(at, won("anchor")) });
    check(`${slug}: the break-even is model.ts's to the penny (${value(r.breakEven)} against ${M.breakEvenSales(mm)})`, value(r.breakEven) === M.breakEvenSales(mm));
    check(`${slug}: the profit at the anchor's sales is model.ts's (${value(rA.profit)} against ${M.profitAt(at, mm)})`, value(rA.profit) === M.profitAt(at, mm));
    check(`${slug}: the sole trader keeps model.ts's keeps of it (${value(rA.profitAfterTax)} against ${M.keepsOfProfit(M.profitAt(at, mm), "sole trader")})`, value(rA.profitAfterTax) === M.keepsOfProfit(M.profitAt(at, mm), "sole trader"));
    check(`${slug}: the share of firms above the break-even is model.ts's (${value(r.shareAbove)} against ${M.shareAboveBreakEven(mm)})`, value(r.shareAbove) === M.shareAboveBreakEven(mm));
  }

  /* THE REGISTER'S BANDS PLACE THE BREAK-EVEN AND THE SALES, log-flat inside a band (banded.ts): 556,017.36 lies in the 500k to 1m band. */
  const cdfAt = (x: number) => (5145 + (1245 * Math.log(x / 500000)) / Math.log(2)) / 7860;
  const lA = run({ ...london, sales: v(597440.87, won("anchor")) });
  check(`firms above London's break-even, by hand: 1 - (5,145 + 1,245 x log2(556,017.36 / 500,000)) / 7,860 (${value(lr.shareAbove)}), of ${lr.firms} firms`, Math.abs((value(lr.shareAbove) ?? -1) - (1 - cdfAt(556017.36))) < 1e-9 && lr.firms === 7860);
  check(`the anchor's sales sit above ${Math.round(cdfAt(597440.87) * 100)}% of the firms (${value(lA.salesRank)})`, Math.abs((value(lA.salesRank) ?? -1) - cdfAt(597440.87)) < 1e-9);

  /* BERLIN BY HAND: the team 64,781.64 + 4 x 42,402.53 + 4 x 36,513.29 + 32,390.82 = 412,835.74 (each head's pay plus 19.7% of it, rounded
     first); rent 242 x 608 = 147,136; service 242 x 40 = 9,680; F = 569,651.74; v = 0.48; R* = 569,651.74 / 0.52 = 1,095,484.12; customers a day
     1,095,484.12 / 22 / 365 = 136.4. */
  const b = run(berlin());
  const team = b.bill.filter((x) => x.key.startsWith("team:")).reduce((a, x) => a + Math.round(x.year * 100), 0) / 100;
  check(`Berlin's team, rent and service: 412,835.74, 147,136, 9,680 (${team}, ${b.bill.find((x) => x.key === "rent")?.year}, ${b.bill.find((x) => x.key === "service")?.year})`, team === 412835.74 && b.bill.find((x) => x.key === "rent")?.year === 147136 && b.bill.find((x) => x.key === "service")?.year === 9680);
  check(`no rates outside England (${b.bill.some((x) => x.key === "rates")})`, !b.bill.some((x) => x.key === "rates"));
  check(`Berlin's F 569,651.74, v 0.48, R* 1,095,484.12 (${value(b.fixedYear)}, ${value(b.variableShare)}, ${value(b.breakEven)})`, value(b.fixedYear) === 569651.74 && Math.abs((value(b.variableShare) ?? 0) - 0.48) < 1e-12 && value(b.breakEven) === 1095484.12);
  check(`136 customers a day (${value(b.customersADay)})`, Math.round(value(b.customersADay) ?? 0) === 136);
  check(`the owner's seat costs nothing at nought heads (${b.bill.some((x) => x.key === "team:owner_or_general_manager")})`, !b.bill.some((x) => x.key === "team:owner_or_general_manager"));

  /* THE OWNER'S PAY IN F: 40,000 before tax lifts the break-even to 609,651.74 / 0.52 = 1,172,407.19; without it, 1,095,484.12. */
  const bw = run({ ...berlin(), ownerPay: v(40000, mine("owner")) });
  check(`the owner's pay is in F (${value(bw.breakEven)} with, ${value(bw.breakEvenBusiness)} without)`, value(bw.breakEven) === 1172407.19 && value(bw.breakEvenBusiness) === 1095484.12);
  check("the owner's pay is a line of the bill, and an output resting on it says it is the reader's", bw.bill.some((x) => x.key === "owner" && x.year === 40000 && x.part === "owner") && bw.breakEven.held && bw.breakEven.yours && !(bw.breakEvenBusiness.held && bw.breakEvenBusiness.yours));

  /* REVIEW FOCUS 1, A LOSS: at 800,000 the shares take 384,000 and F 569,651.74, so the year loses 153,651.74; the payback waits. */
  const loss = run({ ...berlin(), sales: v(800000, mine("sales")), openingCost: v(300000, mine("opening")) });
  check(`a loss is printed as a loss (${value(loss.profit)}, margin ${value(loss.marginBefore)})`, value(loss.profit) === -153651.74 && Math.abs((value(loss.marginBefore) ?? 0) + 0.192064675) < 1e-9);
  check(`no payback at a loss, and the bill stands at the reader's sales (${reason(loss.paybackMonths)}, ${loss.billAt})`, reason(loss.paybackMonths) === "loss" && loss.billAt === "sales" && loss.bill.find((x) => x.key === "share:food and drink")?.year === 256000);
  check(`outside the UK the margin after tax says why it is missing (${reason(loss.marginAfter)})`, reason(loss.marginAfter) === "no-tax" && reason(loss.profitAfterTax) === "no-tax");
  const pay = run({ ...berlin(), sales: v(1500000, mine("sales")), openingCost: v(300000, mine("opening")) });
  check(`the payback: 300,000 over 210,348.26 / 12 a month is 17.1, so 18 months (${value(pay.paybackMonths)})`, value(pay.paybackMonths) === 18);

  /* REVIEW FOCUS 1, A SALE THAT COSTS ALL IT BRINGS: no break-even is printed and no division by nothing or by a negative happens. */
  for (const total of [1.05, 1]) {
    const r2 = run({ ...berlin(), variable: [{ key: "goods", share: total - 0.12, stamp: est("t") }], sales: v(800000, mine("sales")) });
    check(`shares summing to ${total}: no break-even, no customers a day, no sales per 100 (${reason(r2.breakEven)}, ${reason(r2.customersADay)}, ${reason(r2.perHundred)}), the year a loss (${value(r2.profit)})`, reason(r2.breakEven) === "no-margin" && reason(r2.customersADay) === "no-margin" && reason(r2.perHundred) === "no-margin" && (value(r2.profit) ?? 0) < 0 && r2.moves.length === 0);
  }

  /* REVIEW FOCUS 2, NO SALES: cleared (null) and typed as 0. */
  for (const sales of [null, v(0, mine("sales"))]) {
    const r = run({ ...berlin(), sales, openingCost: v(300000, mine("opening")) });
    check(`sales ${sales ? "0" : "cleared"}: the margin, the profit and the payback wait for sales, the break-even and customers a day still print (${reason(r.marginBefore)}, ${reason(r.profit)}, ${reason(r.paybackMonths)}, ${value(r.breakEven)}, ${r.billAt})`, reason(r.marginBefore) === "no-sales" && reason(r.profit) === "no-sales" && reason(r.paybackMonths) === "no-sales" && value(r.breakEven) === 1095484.12 && r.customersADay.held && r.billAt === "break-even");
  }

  /* TAX: the UK law on top of the owner's draw; a loss pays none; the profit that leaves a target after tax. */
  const sole = { law: "uk" as const, form: "sole trader" as const };
  check(`with 20,000 drawn, 10,000 more profit keeps st(30,000) - st(20,000) (${E.afterTaxProfit(10000, 20000, sole)})`, E.afterTaxProfit(10000, 20000, sole) === pennies(soleTraderTakeHome(30000).takeHome - soleTraderTakeHome(20000).takeHome));
  check("a loss pays no tax", E.afterTaxProfit(-5000, 0, sole) === -5000);
  const p = E.profitForAfterTax(20000, 0, sole);
  const lt = run({ ...london, targetProfit: v(20000, mine("target")) });
  check(`20,000 after tax needs a profit p within two pounds, and sales of (F + p) / 0.64 (${p}, ${value(lt.targetSales)})`, p !== null && E.afterTaxProfit(p, 0, sole) >= 20000 && E.afterTaxProfit(p - 2, 0, sole) < 20000 && value(lt.targetSales) === pennies((355851.11 + p) / 0.64));
  const bt = run({ ...berlin(), targetProfit: v(50000, mine("target")) });
  check(`outside the UK the target stands before tax: (569,651.74 + 50,000) / 0.52 = 1,191,637.96 (${value(bt.targetSales)})`, value(bt.targetSales) === 1191637.96);

  /* WHAT MOVES IT MOST: each input up a tenth or one more hire, the five largest rises. */
  check(`Berlin: a second head chef moves it most, 634,433.38 / 0.52 - 1,095,484.12 = 124,580.07 (${b.moves[0]?.key} ${b.moves[0]?.rise})`, b.moves[0]?.key === "hire:head_chef_or_kitchen_lead" && b.moves[0]?.rise === 124580.07);
  check("no role at nought heads is a move, at most five moves, largest first", !b.moves.some((x) => x.key === "hire:owner_or_general_manager") && b.moves.length <= E.MOVES_MAX && b.moves.every((x, k) => k === 0 || b.moves[k - 1].rise >= x.rise));
  check(`London: dearer goods first, 355,851.11 / 0.604 - 556,017.36 = 33,140.11, five moves and no hire (${lr.moves.map((x) => `${x.key} ${x.rise}`).join(", ")})`, lr.moves.length === 5 && lr.moves[0].key === "goods" && lr.moves[0].rise === 33140.11 && !lr.moves.some((x) => x.key.startsWith("hire:")));

  /* SPREADS: a trusted cell's tenths, read straight between its five points, and nothing past them. */
  const tenths = { kind: "tenths" as const, p10: 100000, p25: 200000, p50: 300000, p75: 400000, p90: 500000, firms: 40, stamp: est("cells:x") };
  const base = { ...blank(), area: v(100, est("t")), rentPerM2: v(1000, est("t")), variable: [{ key: "goods", share: 0.5, stamp: est("t") }], spread: tenths };
  const t = run({ ...base, lines: [{ key: "fixed", amountYear: 25000, stamp: est("t") }] });
  check(`a break-even of 250,000 between the 25th and 50th points is above 37.5% of the firms (${value(t.breakEven)}, ${value(t.shareAbove)})`, value(t.breakEven) === 250000 && Math.abs((value(t.shareAbove) ?? 0) - 0.625) < 1e-12 && t.firms === 40);
  const far = run({ ...base, lines: [{ key: "fixed", amountYear: 200000, stamp: est("t") }] });
  check(`a break-even past the 90th point is not placed (${reason(far.shareAbove)})`, reason(far.shareAbove) === "beyond-spread");
  check(`no spread, no share (${reason(b.shareAbove)})`, reason(b.shareAbove) === "no-spread");

  /* KINDS: an output is worked out only when every input is counted, looked up or worked out; a reader's figure is "yours" on the output. */
  check("counted and looked up combine to worked out", JSON.stringify(E.combineStamps([{ src: "a", kind: "counted" }, { src: "b", kind: "looked up" }])) === JSON.stringify({ kind: "worked out", yours: false }));
  check("an estimate makes an estimate, and so does nothing", E.combineStamps([{ src: "a", kind: "counted" }, est("b")]).kind === "estimate" && E.combineStamps([]).kind === "estimate");
  check("a reader's figure makes an estimate that is the reader's", JSON.stringify(E.combineStamps([mine("area"), { src: "b", kind: "counted" }])) === JSON.stringify({ kind: "estimate", yours: true }));
  const ly = run({ ...london, area: v(250, mine("area")) });
  check("London with the reader's floor space: the break-even and the rent line say they rest on the reader's figure", ly.breakEven.held && ly.breakEven.yours && ly.bill.find((x) => x.key === "rent")?.yours === true);

  /* REVIEW FOCUS 4, EXTREMES: nothing throws and nothing prints NaN or Infinity. */
  const extremes: Array<[string, EngineInputs, (r: EngineResult) => boolean]> = [
    ["5,000 m2 at 362 puts the rateable value past the law's 500,000", { ...london, area: v(5000, mine("area")) }, (r) => reason(r.breakEven) === "out-of-reach"],
    ["a negative rent is no rent", { ...berlin(), rentPerM2: v(-5, mine("rent")) }, (r) => !r.breakEven.held && (r.breakEven.needs ?? []).includes("rent")],
    ["a pay that is not a number is no pay", { ...berlin(), roles: berlin().roles.map((x) => (x.heads > 0 ? { ...x, payYear: v(Number.NaN, mine("pay")) } : x)) }, (r) => !r.breakEven.held && (r.breakEven.needs ?? []).some((n) => n.startsWith("pay:"))],
    ["a loan with no years asks for them", { ...berlin(), loan: { amount: v(40000, mine("loanAmount")), ratePct: v(7.5, est("t")), years: v(0, mine("loanYears")) } }, (r) => !r.breakEven.held && (r.breakEven.needs ?? []).includes("loan")],
    ["two and a half heads under the UK law", { ...london, roles: [{ key: "cook", heads: 2.5, headsStamp: mine("team:cook"), payYear: v(28000, est("t")) }] }, (r) => (r.bill.find((x) => x.key === "team:cook")?.year ?? 0) > 2 * 28000],
    ["a million heads", { ...berlin(), roles: [{ key: "cook", heads: 1e6, headsStamp: mine("team:cook"), payYear: v(30000, est("t")) }] }, (r) => !r.breakEven.held && (r.breakEven.needs ?? []).includes("heads:cook")],
    ["sales of a trillion", { ...berlin(), sales: v(1e12, mine("sales")) }, (r) => r.profit.held],
    /* The lever's top (Task 5's bounds): bestCompanyTakeHome walks salaries in 250 steps, so the search's cost grows with the target. */
    ["a company's target of 250,000", { ...london, tax: { law: "uk", form: "company" }, targetProfit: v(250000, mine("target")) }, (r) => r.targetSales.held],
  ];
  for (const [label, inputs, ok] of extremes) {
    let r: EngineResult | null = null;
    try { r = run(inputs); } catch (e) { check(`${label}: no throw (${(e as Error).message})`, false); continue; }
    check(`${label}: ${JSON.stringify(r.breakEven)}`, ok(r));
  }
  check(`no output of the ${results.length} runs holds NaN or Infinity`, results.length > 0 && !results.some(nonFinite));

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("simulator/engine: all pass");
  process.exit(0);
}

main().catch((e) => { console.error("x calc-engine crashed:", e); process.exit(1); });
