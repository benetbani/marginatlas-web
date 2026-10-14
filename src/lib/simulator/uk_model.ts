/**
 * src/lib/simulator/uk_model.ts , THE FIRST SLICE: MODEL.TS'S BUSINESS AS THE ENGINE'S INPUTS (plan 2026-10-13 cost-simulator, Task 1; spec section 2,
 * "a first slice (London's three money trades on the model as it stands) proves the engine before the world defaults land"; R7 section 3, "wrap
 * model.ts ... at the defaults it reproduces the trade page's break-even").
 *
 * One business in the average premises at the anchor's sales, model.ts's break-even reading ("the business in the average premises cannot shed its
 * crew when sales dip"): the premises' area and its rent per m2 (the valuation's rateable value over its area, so area times rent is the rateable
 * value to the penny), England's rates by the recipe's multiplier, the recipe's sized lines at the anchor as two fixed lines (the crew, every line
 * whose research driver pays people, and the running costs, the rest, each line rounded first as model.ts rounds it), its variable shares as the
 * shares of each sale, the register's bands as the spread, the legal form's tax. No roles: the crew line pays the team (recipes.ts P1), so a hire
 * the reader adds is on top, costed by the law with the Employment Allowance held spent on that crew. The quartiles' size rule (model.ts billAt at
 * other sales) is not read: the simulator is one business whose fixed costs stay fixed.
 */
import { pennies, sumPennies } from "@/lib/uk/law/money";
import { RECIPES } from "@/lib/uk/pnl/recipes";
import { own } from "@/lib/own";
import { registerSrc } from "@/lib/spine/provenance";
import type { PnlInputs, Share as ModelShare } from "@/lib/uk/pnl/model";
import type { EngineInputs, Line, Stamp } from "./engine";

/** A recipe line whose research driver pays people (recipes.ts P1, "wages"): the crew. */
export const STAFF_DRIVER = /labou?r|payroll|wage|staff/i;

export function ukModelInputs(model: PnlInputs, ctx: { trade: string; geography: string }): EngineInputs {
  const recipe = own(RECIPES, ctx.trade);
  const A = model.anchorSales.value;
  const premises: Stamp = { src: `uk/registers/premises.json:${ctx.trade}:${ctx.geography}`, kind: model.premises.kind };
  const driverOf = (key: string) => recipe?.sized.find((s) => s.key === key)?.driver ?? "";
  const line = (key: string, shares: readonly ModelShare[]): Line[] =>
    shares.length === 0 ? [] : [{ key, amountYear: sumPennies(shares.map((s) => pennies(s.share * A))), stamp: { src: `uk/pnl/recipes.ts:${ctx.trade}:${shares.map((s) => s.key).join("+")} x anchor`, kind: "estimate" } }];
  return {
    area: { v: model.premises.areaM2, stamp: premises },
    rentPerM2: { v: model.premises.rateableValue / model.premises.areaM2, stamp: premises },
    serviceChargePerM2: null,
    rates: { law: "england", retailHospitalityLeisure: model.premises.retailHospitalityLeisure },
    lines: [...line("crew", model.sized.filter((s) => STAFF_DRIVER.test(driverOf(s.key)))), ...line("running", model.sized.filter((s) => !STAFF_DRIVER.test(driverOf(s.key))))],
    roles: [],
    onCost: { law: "uk", allowance: false },
    variable: model.variable.map((s) => ({ key: s.key, share: s.share, stamp: { src: `uk/pnl/recipes.ts:${ctx.trade}:${s.key}`, kind: s.kind } })),
    runningShare: null,
    ownerPay: null,
    targetProfit: null,
    sales: null,
    ticket: null,
    openingCost: null,
    loan: { amount: null, ratePct: null, years: null },
    tax: { law: "uk", form: model.form },
    spread: { kind: "bands", revenueBandsK: model.revenueBandsK, stamp: { src: registerSrc("turnover.json", ctx.trade, ctx.geography), kind: "counted" } },
  };
}
