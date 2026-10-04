/**
 * The profit-and-loss model on a worked example: a London barbershop (the register's hair and beauty bands, the official
 * valuation's average London salon, the trade research's shares). The shares are a TEST FIXTURE, not a published figure.
 * Every expected value was computed independently in Python (decimal arithmetic, half-up at the penny, 2026-10-02) and
 * agreed to the penny.
 *
 * Run: npx tsx tests/uk/pnl/model.test.ts
 */
import { afterTaxCostOf, anchorFixed, billAt, breakEvenSales, keepsAt, profitAt, summarise, type PnlInputs } from "../../../src/lib/uk/pnl/model";
import { bestCompanyTakeHome } from "../../../src/lib/uk/law/take_home";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-pnl-model";
const FILE = "src/lib/uk/pnl/model.ts";
const REMEDY = "fix model.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

const barber: PnlInputs = {
  revenueBandsK: [2405, 3740, 2655, 525, 245, 70, 40, 10, 5, 0],
  variable: [
    { key: "commission", share: 0.3, kind: "estimate", source: "fixture" },
    { key: "supplies", share: 0.08, kind: "estimate", source: "fixture" },
  ],
  sized: [{ key: "running costs", share: 0.12, kind: "estimate", source: "fixture" }],
  premises: { rateableValue: 16_657.95, areaM2: 60.8, retailHospitalityLeisure: true, kind: "worked out", source: "fixture" },
  anchorSales: { value: 139_406.36, kind: "worked out", source: "fixture" },
  form: "sole trader",
};

// ---- one business, short run: the average premises and its crew ----
check("the average salon's business: crew and running costs 16,728.76, rent 16,657.95, rates 6,363.34 = 39,750.05 a year", anchorFixed(barber) === 39_750.05);
check("it breaks even at sales of 64,112.98 (39,750.05 / 0.62)", breakEvenSales(barber) === 64_112.98);
check("at its own sales the two readings agree: P(A) = A - variable lines - fixed costs = 46,681.89",
  profitAt(139_406.36, barber) === 46_681.89 && Math.round((139_406.36 - 41_821.91 - 11_152.51 - 39_750.05) * 100) / 100 === 46_681.89);

// ---- across businesses: the size rule ----
const s = summarise(barber)!;
check("sales quartiles 50,174.05 / 78,625.81 / 147,504.75, worked out from counted bands", s.sales.q25 === 50_174.05 && s.sales.q50 === 78_625.81 && s.sales.q75 === 147_504.75 && s.sales.kind === "worked out");
check("61 of 100 registered businesses take at least the break-even (0.6136)", Math.round(s.shareAbove!.value * 10_000) / 10_000 === 0.6136);
check("the share is an estimate because the shares are", s.shareAbove!.kind === "estimate" && s.breakEven.kind === "estimate");
check("the median business's year, line by line: 23,587.74 + 6,290.06 + 9,435.10 + rent 9,395.16 + rates 0.00",
  s.medianBill.lines.map((l) => l.amount).join(",") === "23587.74,6290.06,9435.1,9395.16,0");
check("its room is a 34 m2 share of the average salon at a rateable value of 9,395.16: small business relief takes the whole bill", billAt(78_625.81, barber)[4].amount === 0);
check("the median business's profit 29,917.75, the bill and the profit adding to its sales", s.medianBill.profit === 29_917.75 && Math.round((s.medianBill.lines.reduce((a, l) => a + l.amount, 0) + s.medianBill.profit) * 100) / 100 === 78_625.81);
const flat = summarise(barber, "flat")!;
check("the bands can be read under another shape (ranges.ts runs all three): flat puts the median at 82,653.74 and 0.6430 of businesses above the same break-even",
  flat.sales.q50 === 82_653.74 && Math.round(flat.shareAbove!.value * 10_000) / 10_000 === 0.643 && flat.breakEven.value === 64_112.98);
check("margin at the median 38.05%, the median business's own profit over its own sales", Math.round(s.marginAtMedian * 10_000) / 10_000 === 0.3805 && s.marginAtMedian === s.medianBill.profit / s.sales.q50);
check("the business at each sales quartile keeps 17,396.00 / 25,407.33 / 39,819.57 after tax", s.keeps.q25 === 17_396 && s.keeps.q50 === 25_407.33 && s.keeps.q75 === 39_819.57);
check("in order, and an estimate", s.keeps.q25 <= s.keeps.q50 && s.keeps.q50 <= s.keeps.q75 && s.keeps.kind === "estimate");
check("1,000 more cost a year takes 740.00 from the median business's owner (20% income tax and 6% Class 4 come back)", afterTaxCostOf(1_000, 78_625.81, barber) === 740);
check("as a company the median business keeps the company optimum on 29,917.75, less than a sole trader",
  keepsAt(78_625.81, { ...barber, form: "company" }) === bestCompanyTakeHome(29_917.75).takeHome && bestCompanyTakeHome(29_917.75).takeHome < 25_407.33);

// ---- a loss is a loss ----
const heavy: PnlInputs = { ...barber, sized: [{ key: "staff", share: 0.6, kind: "estimate", source: "fixture" }] };
check("with staff at 60% of sales the lower-quartile business loses 4,991.92 and keeps the loss, untaxed", profitAt(50_174.05, heavy) === -4_991.92 && keepsAt(50_174.05, heavy) === -4_991.92);

check("the company form keeps a loss as a loss too, never searched for a salary", keepsAt(50_174.05, { ...heavy, form: "company" }) === -4_991.92);

// ---- a quartile in an open band says so (its business's money prints only in words) ----
check("no barbershop quartile rests on the floor or the cap: q25 50,174.05 is a figure", s.sales.open?.q25 === false && s.sales.open?.q50 === false && s.sales.open?.q75 === false);
const floorQ25 = summarise({ ...barber, revenueBandsK: [3405, 3740, 2655, 525, 245, 70, 40, 10, 5, 0] })!;
check("1,000 more businesses under 50k put the lower quartile at 30,493.85, under 50k: open, the median and upper quartile not", floorQ25.sales.q25 === 30_493.85 && floorQ25.sales.open?.q25 === true && floorQ25.sales.open?.q50 === false && floorQ25.sales.open?.q75 === false);

// ---- the rent line says what it is at every size ----
check("at the anchor's sales the rent is the average premises' own: 16,657.95, its source as given", billAt(139_406.36, barber)[3].amount === 16_657.95 && billAt(139_406.36, barber)[3].source === "fixture");
check("at the median the rent is the size rule's share and says so: 9,395.16 for 34 m2", billAt(78_625.81, barber)[3].source === "fixture, scaled to this business's sales: 34 m2 at the same rent per m2 (the size rule)" && billAt(78_625.81, barber)[3].kind === "worked out");

// ---- profit falls with sales only where the law steps ----
let onlyAtTheStep = true;
for (let r = 10_000; r < 1_000_000; r += 500) {
  if (profitAt(r + 500, barber) < profitAt(r, barber)) {
    const rvBefore = (16_657.95 * r) / 139_406.36, rvAfter = (16_657.95 * (r + 500)) / 139_406.36;
    if (!(rvBefore < 51_000 && rvAfter >= 51_000)) onlyAtTheStep = false;
  }
}
check("from 10k to 1m of sales, profit falls only where the rateable value crosses 51,000 (the multiplier's step)", onlyAtTheStep);

// ---- what the model refuses ----
let threw = 0;
try { profitAt(50_000, { ...barber, sized: [{ key: "x", share: 0.7, kind: "estimate", source: "fixture" }] }); } catch { threw++; }
try { profitAt(50_000, { ...barber, anchorSales: { value: 0, kind: "worked out", source: "fixture" } }); } catch { threw++; }
check("shares that leave nothing of a pound, and an anchor of no sales, are refused", threw === 2);
const refuses = (f: () => unknown) => { try { f(); return false; } catch { return true; } };
check("shares that take exactly the whole pound, and a negative share, are refused too",
  refuses(() => profitAt(50_000, { ...barber, variable: [{ key: "x", share: 0.5, kind: "estimate", source: "fixture" }], sized: [{ key: "y", share: 0.5, kind: "estimate", source: "fixture" }] }))
  && refuses(() => profitAt(50_000, { ...barber, sized: [{ key: "x", share: -0.1, kind: "estimate", source: "fixture" }] })));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/pnl/model: all pass");
