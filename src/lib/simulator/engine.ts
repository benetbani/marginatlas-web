/**
 * src/lib/simulator/engine.ts , THE COST SIMULATOR'S ARITHMETIC (plan 2026-10-13 cost-simulator, Task 1; spec
 * docs/superpowers/specs/2026-10-13-cost-simulator-design.md, sections 2 and 3; R7 tables 4.1 and 4.2).
 *
 * ONE BUSINESS, ONE YEAR, ONE CURRENCY (pounds for a UK place, dollars elsewhere: the caller converts). Pure: no file, no database, no clock,
 * so the browser runs it on every lever and the chain proves it offline.
 *
 *   variable share   v  = the shares of each sale spent on goods and running costs
 *   fixed costs      F0 = rent + service charge + rates (England's law, on the rent as the rateable value) + the business's own lines
 *                         + the team (each head's pay and its on-cost) + the loan's repayments
 *   with your pay    F  = F0 + W, W the owner's pay before tax when set
 *   break-even       R* = F / (1 - v), never circular: no input is a share of the sales it answers
 *   profit at R      P  = R - (each share x R, rounded first) - F; a loss stays a loss
 *   after tax (UK)   keeps(W + P) - keeps(W), keeps the legal form's take-home (take_home.ts); a loss pays none; the loan's principal is
 *                    taxed though it is no cost
 *   target           the profit p that leaves T after tax, then (F + p) / (1 - v); before tax outside the UK
 *   payback          the money to open over the month's profit (after tax in the UK), none at a loss
 *   moves            each input up a tenth, or one more head on a role the team holds, the five largest rises in R*
 *
 * A FIGURE IS HELD OR SAYS WHY NOT (`Out`): a missing input names itself in `needs`, shares at or above every pound answer "no-margin", a loss
 * answers "loss" where the payback would stand. Nothing is filled. Each held output carries the kind of the inputs it rests on (combineStamps):
 * "worked out" only when every one is counted, looked up or worked out, an estimate otherwise, and `yours` when any is the reader's own.
 *
 * ITS BLIND SPOT, stated: it computes what it is handed. It cannot tell a rent a year from a month's, a share from a percentage typed as 32,
 * or a default from a guess; the defaults builder and the levers' bounds carry those, and its test pins the arithmetic, not the inputs.
 */
import { pennies, sumPennies } from "@/lib/uk/law/money";
import { businessRates } from "@/lib/uk/law/business_rates";
import { hireAllIn } from "@/lib/uk/law/employer_cost";
import { annuity } from "@/lib/uk/law/loan";
import { soleTraderTakeHome, bestCompanyTakeHome } from "@/lib/uk/law/take_home";
import { UK_2026_27 } from "@/lib/uk/law/params_2026_27";
import { bandCdf } from "@/lib/uk/pnl/banded";
import type { ProvenanceKind, StampKind } from "@/lib/spine/provenance";

export type Stamp = { src: string; kind: StampKind };
export type Held = { v: number; stamp: Stamp };
export type Value = Held | null;
export type Line = { key: string; amountYear: number; stamp: Stamp };
export type Share = { key: string; share: number; stamp: Stamp };
export type Role = { key: string; heads: number; headsStamp: Stamp; payYear: Value };
export type OnCost = { law: "uk"; allowance: boolean } | { rate: Held } | null;
export type Form = "sole trader" | "company";
export type Tax = { law: "uk"; form: Form } | { law: "none" };
export type Spread =
  | { kind: "bands"; revenueBandsK: readonly number[]; stamp: Stamp }
  | { kind: "tenths"; p10: number; p25: number; p50: number; p75: number; p90: number; firms: number; stamp: Stamp };
export type EngineInputs = {
  area: Value;
  rentPerM2: Value;
  serviceChargePerM2: Value;
  rates: { law: "england"; retailHospitalityLeisure: boolean } | null;
  lines: readonly Line[];
  roles: readonly Role[];
  onCost: OnCost;
  /** The shares of each sale spent on goods; null where none is held (the break-even waits for it); [] where the trade spends none. */
  variable: readonly Share[] | null;
  runningShare: Value;
  ownerPay: Value;
  targetProfit: Value;
  sales: Value;
  ticket: Value;
  openingCost: Value;
  loan: { amount: Value; ratePct: Value; years: Value };
  tax: Tax;
  spread: Spread | null;
};
export type Reason = "needs" | "no-margin" | "no-sales" | "loss" | "no-ticket" | "no-opening" | "no-target" | "no-tax" | "no-spread" | "beyond-spread" | "out-of-reach";
export type Out = { held: true; value: number; kind: ProvenanceKind; yours: boolean } | { held: false; reason: Reason; needs?: string[] };
export type BillLine = { key: string; year: number; part: "variable" | "fixed" | "owner"; kind: ProvenanceKind; yours: boolean; src: string };
export type Move = { key: string; rise: number; kind: ProvenanceKind; yours: boolean };
export type EngineResult = {
  bill: BillLine[];
  billAt: "sales" | "break-even" | null;
  variableShare: Out;
  fixedYear: Out;
  breakEven: Out;
  breakEvenBusiness: Out;
  targetSales: Out;
  profit: Out;
  profitAfterTax: Out;
  marginBefore: Out;
  marginAfter: Out;
  customersADay: Out;
  shareAbove: Out;
  salesRank: Out;
  firms: number | null;
  paybackMonths: Out;
  perHundred: Out;
  moves: Move[];
};

/** An adult hire, 22 or over and under State Pension age (employer_cost.ts enrols them in the pension). */
const ADULT_AGE = 30;
const DAYS = 365;
const STEP = 1.1;
const MAX_HEADS = 1000;
export const MOVES_MAX = 5;
const RATES_LAW: Stamp = { src: "uk/law/business_rates.ts", kind: "worked out" };
const HIRE_LAW: Stamp = { src: "uk/law/employer_cost.ts:hireAllIn", kind: "worked out" };
const TAX_LAW: Stamp = { src: "uk/law/take_home.ts", kind: "worked out" };

const ok = (x: number | null | undefined): x is number => typeof x === "number" && Number.isFinite(x) && x >= 0;
const val = (h: Value): number | null => (h && ok(h.v) ? h.v : null);

/** The kind an output takes from the stamps it rests on: "worked out" when every one is counted, looked up or worked out, else an estimate
 *  (resting on nothing too); `yours` when any is the reader's own. */
export function combineStamps(stamps: readonly Stamp[]): { kind: ProvenanceKind; yours: boolean } {
  const yours = stamps.some((s) => s.kind === "yours");
  const firm = stamps.length > 0 && stamps.every((s) => s.kind === "counted" || s.kind === "looked up" || s.kind === "worked out");
  return { kind: firm ? "worked out" : "estimate", yours };
}

/** One stamp for a line built from several inputs: their sources joined, "yours" when any is the reader's, else the kind they combine to. */
function joined(stamps: readonly Stamp[]): Stamp {
  const c = combineStamps(stamps);
  return { src: stamps.map((s) => s.src).join(" x "), kind: c.yours ? "yours" : c.kind };
}

const held = (value: number, stamps: readonly Stamp[]): Out => ({ held: true, value, ...combineStamps(stamps) });
const none = (reason: Reason, needs?: string[]): Out => (needs && needs.length > 0 ? { held: false, reason, needs } : { held: false, reason });

function shareLines(i: EngineInputs): { shares: Share[]; v: number } {
  const goods = (i.variable ?? []).filter((s) => Number.isFinite(s.share) && s.share >= 0);
  const run = val(i.runningShare);
  const shares = run !== null && i.runningShare ? [...goods, { key: "running", share: run, stamp: i.runningShare.stamp }] : goods;
  return { shares, v: shares.reduce((a, s) => a + s.share, 0) };
}

function teamLines(i: EngineInputs): { lines: Line[]; needs: string[] } {
  const lines: Line[] = [];
  const needs: string[] = [];
  const staffed = i.roles.filter((r) => Number.isFinite(r.heads) && r.heads > 0);
  if (staffed.length > 0 && !i.onCost) needs.push("oncost");
  let allowance = i.onCost && "law" in i.onCost && i.onCost.allowance ? UK_2026_27.class1Secondary.employmentAllowance : 0;
  for (const r of staffed) {
    if (r.heads > MAX_HEADS) { needs.push(`heads:${r.key}`); continue; }
    const pay = val(r.payYear);
    if (pay === null || !r.payYear) { needs.push(`pay:${r.key}`); continue; }
    if (!i.onCost) continue;
    let amount: number;
    let cost: Stamp;
    if ("law" in i.onCost) {
      /* Each head through the law in turn, a part head at that part of the pay, the Employment Allowance spent once across them. */
      const parts: number[] = [];
      const hire = (gross: number) => { const c = hireAllIn({ gross, age: ADULT_AGE, allowanceRemaining: allowance }); allowance = pennies(allowance - c.allowanceUsed); parts.push(c.allIn); };
      const whole = Math.floor(r.heads + 1e-9);
      for (let k = 0; k < whole; k++) hire(pay);
      if (r.heads - whole > 1e-6) hire(pennies(pay * (r.heads - whole)));
      amount = sumPennies(parts);
      cost = HIRE_LAW;
    } else {
      amount = pennies(pennies(pay + pennies(pay * i.onCost.rate.v)) * r.heads);
      cost = i.onCost.rate.stamp;
    }
    lines.push({ key: `team:${r.key}`, amountYear: amount, stamp: joined([r.headsStamp, r.payYear.stamp, cost]) });
  }
  return { lines, needs };
}

function loanLine(i: EngineInputs): { line: Line | null; needs: boolean; principal: number } {
  const amount = val(i.loan.amount);
  if (amount === null || amount === 0 || !i.loan.amount) return { line: null, needs: false, principal: 0 };
  const rate = val(i.loan.ratePct), years = val(i.loan.years);
  if (rate === null || years === null || years < 1 || !i.loan.ratePct || !i.loan.years) return { line: null, needs: true, principal: 0 };
  const months = Math.round(years * 12);
  const a = annuity({ principal: amount, annualRatePct: rate, months });
  /* The first year's repayments; the principal among them is the amount less the balance after twelve payments. */
  const r = rate / 100 / 12;
  const balance = r === 0 ? amount - (amount / months) * 12 : amount * (1 + r) ** 12 - (a.monthly * ((1 + r) ** 12 - 1)) / r;
  return { line: { key: "loan", amountYear: pennies(a.monthly * 12), stamp: joined([i.loan.amount.stamp, i.loan.ratePct.stamp, i.loan.years.stamp]) }, needs: false, principal: pennies(Math.max(0, amount - balance)) };
}

function fixedLines(i: EngineInputs): { lines: Line[]; needs: string[]; outOfReach: boolean; principal: number } {
  const lines: Line[] = [];
  const needs: string[] = [];
  let outOfReach = false;
  const area = val(i.area), rent = val(i.rentPerM2);
  if (area === null) needs.push("area");
  if (rent === null) needs.push("rent");
  if (area !== null && rent !== null && i.area && i.rentPerM2) {
    const r = pennies(area * rent);
    lines.push({ key: "rent", amountYear: r, stamp: joined([i.area.stamp, i.rentPerM2.stamp]) });
    if (i.rates) {
      if (r >= UK_2026_27.businessRates.highValueThreshold) outOfReach = true;
      else lines.push({ key: "rates", amountYear: businessRates({ rateableValue: r, retailHospitalityLeisure: i.rates.retailHospitalityLeisure }).bill, stamp: joined([i.area.stamp, i.rentPerM2.stamp, RATES_LAW]) });
    }
    const sc = val(i.serviceChargePerM2);
    if (sc !== null && sc > 0 && i.serviceChargePerM2) lines.push({ key: "service", amountYear: pennies(area * sc), stamp: joined([i.area.stamp, i.serviceChargePerM2.stamp]) });
  }
  for (const l of i.lines) if (ok(l.amountYear)) lines.push({ key: `line:${l.key}`, amountYear: pennies(l.amountYear), stamp: l.stamp });
  const team = teamLines(i);
  lines.push(...team.lines);
  needs.push(...team.needs);
  const loan = loanLine(i);
  if (loan.line) lines.push(loan.line);
  if (loan.needs) needs.push("loan");
  return { lines, needs, outOfReach, principal: loan.principal };
}

function keepsOf(x: number, form: Form): number {
  if (x <= 0) return x;
  return form === "sole trader" ? soleTraderTakeHome(x).takeHome : bestCompanyTakeHome(x).takeHome;
}

/** What the owner keeps of a year's profit under the UK law, W already drawn: keeps(W + P) - keeps(W). A loss pays no tax; `addBack`, the
 *  year's loan principal, is taxed though it is no cost. Outside the UK the profit as it stands. */
export function afterTaxProfit(profit: number, ownerPay: number, tax: Tax, addBack = 0): number {
  if (tax.law !== "uk") return profit;
  const taxable = pennies(profit + addBack);
  if (taxable <= 0) return profit;
  return pennies(keepsOf(pennies(ownerPay + taxable), tax.form) - keepsOf(ownerPay, tax.form) - addBack);
}

/** The year's profit that leaves `target` after tax, searched to the pound (the law steps, so no closed form); null past 100 million. */
export function profitForAfterTax(target: number, ownerPay: number, tax: Tax, addBack = 0): number | null {
  if (!(target > 0)) return 0;
  if (tax.law !== "uk") return pennies(target);
  let lo = 0;
  let hi = Math.max(1000, target);
  while (hi < 1e8 && afterTaxProfit(hi, ownerPay, tax, addBack) < target) hi *= 2;
  if (afterTaxProfit(hi, ownerPay, tax, addBack) < target) return null;
  while (hi - lo > 1) { const mid = (lo + hi) / 2; if (afterTaxProfit(mid, ownerPay, tax, addBack) >= target) hi = mid; else lo = mid; }
  return Math.ceil(hi);
}

/** The break-even alone, for the moves: null where any input it needs is missing or a sale costs all it brings. */
function breakEvenOf(i: EngineInputs): number | null {
  const { v } = shareLines(i);
  const fx = fixedLines(i);
  if (fx.outOfReach || fx.needs.length > 0 || i.variable === null || v >= 1) return null;
  return pennies(pennies(sumPennies(fx.lines.map((l) => l.amountYear)) + (val(i.ownerPay) ?? 0)) / (1 - v));
}

function candidates(i: EngineInputs): Array<{ key: string; inputs: EngineInputs; stamps: Stamp[] }> {
  const up = (h: Value): Value => (h && ok(h.v) ? { v: h.v * STEP, stamp: h.stamp } : h);
  const out: Array<{ key: string; inputs: EngineInputs; stamps: Stamp[] }> = [];
  if (val(i.area) && i.area) out.push({ key: "area", inputs: { ...i, area: up(i.area) }, stamps: [i.area.stamp] });
  if (val(i.rentPerM2) && i.rentPerM2) out.push({ key: "rent", inputs: { ...i, rentPerM2: up(i.rentPerM2) }, stamps: [i.rentPerM2.stamp] });
  if (val(i.serviceChargePerM2) && i.serviceChargePerM2) out.push({ key: "service", inputs: { ...i, serviceChargePerM2: up(i.serviceChargePerM2) }, stamps: [i.serviceChargePerM2.stamp] });
  for (const l of i.lines) if (ok(l.amountYear) && l.amountYear > 0) out.push({ key: `line:${l.key}`, inputs: { ...i, lines: i.lines.map((x) => (x === l ? { ...x, amountYear: x.amountYear * STEP } : x)) }, stamps: [l.stamp] });
  const paid = i.roles.filter((r) => r.heads > 0 && val(r.payYear) !== null);
  for (const r of paid) out.push({ key: `hire:${r.key}`, inputs: { ...i, roles: i.roles.map((x) => (x === r ? { ...x, heads: x.heads + 1 } : x)) }, stamps: [r.headsStamp, ...(r.payYear ? [r.payYear.stamp] : [])] });
  if (paid.length > 0) out.push({ key: "pay", inputs: { ...i, roles: i.roles.map((x) => ({ ...x, payYear: up(x.payYear) })) }, stamps: paid.flatMap((r) => (r.payYear ? [r.payYear.stamp] : [])) });
  if (i.variable && i.variable.some((s) => s.share > 0)) out.push({ key: "goods", inputs: { ...i, variable: i.variable.map((s) => ({ ...s, share: s.share * STEP })) }, stamps: i.variable.map((s) => s.stamp) });
  if (val(i.runningShare) && i.runningShare) out.push({ key: "running", inputs: { ...i, runningShare: up(i.runningShare) }, stamps: [i.runningShare.stamp] });
  if (val(i.ownerPay) && i.ownerPay) out.push({ key: "owner", inputs: { ...i, ownerPay: up(i.ownerPay) }, stamps: [i.ownerPay.stamp] });
  if (val(i.loan.amount) && i.loan.amount) out.push({ key: "loan", inputs: { ...i, loan: { ...i.loan, amount: up(i.loan.amount) } }, stamps: [i.loan.amount.stamp] });
  return out;
}

function movesOf(i: EngineInputs, base: number): Move[] {
  const out: Move[] = [];
  for (const c of candidates(i)) {
    const be = breakEvenOf(c.inputs);
    if (be === null) continue;
    const rise = pennies(be - base);
    if (rise > 0) out.push({ key: c.key, rise, ...combineStamps(c.stamps) });
  }
  return out.sort((a, b) => b.rise - a.rise || a.key.localeCompare(b.key)).slice(0, MOVES_MAX);
}

/** Where a sales figure stands among the place's firms: the share below it; null with no spread; NaN past a trusted cell's tenths. */
function placed(s: Spread | null, x: number): number | null {
  if (!s) return null;
  if (s.kind === "bands") return bandCdf(s.revenueBandsK, x / 1000);
  if (x < s.p10 || x > s.p90) return Number.NaN;
  const pts: Array<[number, number]> = [[s.p10, 0.1], [s.p25, 0.25], [s.p50, 0.5], [s.p75, 0.75], [s.p90, 0.9]];
  for (let k = 1; k < pts.length; k++) {
    const [x0, q0] = pts[k - 1], [x1, q1] = pts[k];
    if (x <= x1) return x1 > x0 ? q0 + ((x - x0) / (x1 - x0)) * (q1 - q0) : q1;
  }
  return 0.9;
}

const billOf = (s: Stamp) => (s.kind === "yours" ? { kind: "estimate" as ProvenanceKind, yours: true, src: s.src } : { kind: s.kind, yours: false, src: s.src });

export function simulate(i: EngineInputs): EngineResult {
  const { shares, v } = shareLines(i);
  const fx = fixedLines(i);
  const W = val(i.ownerPay) ?? 0;
  const wStamps = i.ownerPay && W > 0 ? [i.ownerPay.stamp] : [];
  const needs = [...fx.needs, ...(i.variable === null ? ["goods"] : [])];
  const blocked: Out | null = fx.outOfReach ? none("out-of-reach") : needs.length > 0 ? none("needs", needs) : null;
  const gap: Out | null = blocked ?? (v >= 1 ? none("no-margin") : null);
  const fixedStamps = fx.lines.map((l) => l.stamp);
  const shareStamps = shares.map((s) => s.stamp);
  const costStamps = [...fixedStamps, ...shareStamps, ...wStamps];
  const F0 = sumPennies(fx.lines.map((l) => l.amountYear));
  const F = pennies(F0 + W);
  const breakEven = gap ?? held(pennies(F / (1 - v)), costStamps);
  const breakEvenBusiness = gap ?? held(pennies(F0 / (1 - v)), [...fixedStamps, ...shareStamps]);
  const fixedYear = fx.outOfReach ? none("out-of-reach") : fx.needs.length > 0 ? none("needs", fx.needs) : held(F, [...fixedStamps, ...wStamps]);
  const variableShare = i.variable === null ? none("needs", ["goods"]) : held(v, shareStamps);
  const perHundred = i.variable === null ? none("needs", ["goods"]) : v >= 1 ? none("no-margin") : held(100 / (1 - v), shareStamps);

  const R = val(i.sales);
  const hasSales = R !== null && R > 0 && !!i.sales;
  const salesStamps = hasSales && i.sales ? [i.sales.stamp] : [];
  const atSales = (x: number) => shares.map((s) => ({ key: `share:${s.key}`, year: pennies(s.share * x), stamp: s.stamp }));
  const P = !blocked && hasSales ? pennies((R as number) - sumPennies([...atSales(R as number).map((l) => l.year), F])) : null;
  const stamps = [...costStamps, ...salesStamps];
  const uk = i.tax.law === "uk";
  const Pt = P !== null && uk ? afterTaxProfit(P, W, i.tax, fx.principal) : null;
  const profit = blocked ?? (P === null ? none("no-sales") : held(P, stamps));
  const marginBefore = blocked ?? (P === null ? none("no-sales") : held(P / (R as number), stamps));
  const profitAfterTax = blocked ?? (P === null ? none("no-sales") : Pt === null ? none("no-tax") : held(Pt, [...stamps, TAX_LAW]));
  const marginAfter = blocked ?? (P === null ? none("no-sales") : Pt === null ? none("no-tax") : held(Pt / (R as number), [...stamps, TAX_LAW]));

  const T = val(i.targetProfit);
  let targetSales: Out;
  if (gap) targetSales = gap;
  else if (T === null || !i.targetProfit) targetSales = none("no-target");
  else {
    const p = profitForAfterTax(T, W, i.tax, fx.principal);
    targetSales = p === null ? none("out-of-reach") : held(pennies((F + p) / (1 - v)), [...costStamps, i.targetProfit.stamp, ...(uk ? [TAX_LAW] : [])]);
  }

  const ticket = val(i.ticket);
  const customersADay = !breakEven.held ? breakEven : ticket === null || ticket <= 0 || !i.ticket ? none("no-ticket") : held(breakEven.value / ticket / DAYS, [...costStamps, i.ticket.stamp]);

  const firms = !i.spread ? null : i.spread.kind === "bands" ? i.spread.revenueBandsK.reduce((a, c) => a + c, 0) : i.spread.firms;
  const spreadStamps = i.spread ? [i.spread.stamp] : [];
  const among = (x: number, base: Stamp[], above: boolean): Out => {
    const c = placed(i.spread, x);
    if (c === null) return none("no-spread");
    if (Number.isNaN(c)) return none("beyond-spread");
    return held(above ? 1 - c : c, [...base, ...spreadStamps]);
  };
  const shareAbove = !breakEven.held ? breakEven : among(breakEven.value, costStamps, true);
  const salesRank = !hasSales ? none("no-sales") : among(R as number, salesStamps, false);

  const opening = val(i.openingCost);
  const month = Pt ?? P;
  const paybackMonths = opening === null || opening <= 0 || !i.openingCost ? none("no-opening") : !profit.held ? profit : (month as number) <= 0 ? none("loss") : held(Math.ceil(opening / ((month as number) / 12)), [...stamps, i.openingCost.stamp, ...(uk ? [TAX_LAW] : [])]);

  const billSales = hasSales ? (R as number) : breakEven.held ? breakEven.value : null;
  const bill: BillLine[] = [
    ...(billSales !== null ? atSales(billSales).map((l) => ({ key: l.key, year: l.year, part: "variable" as const, ...billOf(l.stamp) })) : []),
    ...fx.lines.map((l) => ({ key: l.key, year: l.amountYear, part: "fixed" as const, ...billOf(l.stamp) })),
    ...(W > 0 && i.ownerPay ? [{ key: "owner", year: W, part: "owner" as const, ...billOf(i.ownerPay.stamp) }] : []),
  ];

  return {
    bill,
    billAt: hasSales ? "sales" : breakEven.held ? "break-even" : null,
    variableShare, fixedYear, breakEven, breakEvenBusiness, targetSales, profit, profitAfterTax, marginBefore, marginAfter,
    customersADay, shareAbove, salesRank, firms, paybackMonths, perHundred,
    moves: gap || !breakEven.held ? [] : movesOf(i, breakEven.value),
  };
}
