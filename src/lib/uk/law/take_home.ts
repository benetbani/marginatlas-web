/**
 * src/lib/uk/law/take_home.ts
 *
 * What an owner keeps from a year's profit after tax, by legal form, 2026-27 rUK.
 *
 * SOLE TRADER. The profit is the owner's income: keep = P - incomeTax(P) - class4(P).
 *
 * LIMITED COMPANY, one director-shareholder, every pound extracted in the year (retaining profit in the company is a
 * different question and is out of scope, stated). For a salary s:
 *   employer NI          er(s) = 15% x max(0, s - 5,000)        (no Employment Allowance: a sole director cannot claim it)
 *   company profit       pi(s) = Pi - s - er(s)                  (must stay >= 0)
 *   corporation tax      ct(s) = CT(pi(s))
 *   dividends            d(s)  = pi(s) - ct(s)
 *   employee NI          ee(s) = class1Primary(s)
 *   income tax           it(s) = incomeTax(s, d(s))
 *   keep(s) = s - ee(s) + d(s) - it(s)
 * Outside the allowance taper keep(s) is continuous and piecewise linear in s (a composition of continuous piecewise-linear
 * schedules), so its maximum on [0, sMax] sits at a breakpoint of one of the schedules or at an end. The search evaluates
 * the salary breakpoints it can name (0, the secondary and primary thresholds, the upper earnings limit, the two income
 * tax thresholds in case a salary meets them, the salaries that put the company profit exactly on a corporation-tax limit,
 * sMax) and a 250-pound grid, then refines to the pound around the best four regions at least 1,000 pounds apart, not only
 * the best one: near a switch between regions (the 5,000 region and the 12,570 one, at about 163,281 of profit) the region
 * that wins after refining is not the one that won before. Ties go to the lower salary. The kinks that depend on salary
 * plus dividends (the taper's) have no name; the grid and the refine find them.
 *
 * INSIDE THE TAPER (adjusted net income 100,000 to 125,140) keep(s) is not continuous: each time adjusted net income
 * crosses an even pound, a whole pound of allowance goes at once and keep drops by up to 40p (the rate on the income that
 * pound now taxes), so keep(s) is a sawtooth there and the search is to the pound, not the penny: at 150,000 of profit the
 * best whole-pound salary is 4,996, 14p better than 5,000. A page prints the salary rounded to the nearest 100 pounds;
 * the engine keeps the exact one.
 */
import { UK_2026_27 as L } from "./params_2026_27";
import { incomeTax } from "./income_tax";
import { class4, employeeClass1, employerClass1 } from "./national_insurance";
import { corporationTax } from "./corporation_tax";
import { pennies, sumPennies } from "./money";

export type SoleTraderTakeHome = { profit: number; incomeTax: number; class4: number; takeHome: number };

function finite(x: number, what: string): void {
  if (!Number.isFinite(x)) throw new RangeError(`${what}: not a finite amount (${x})`);
}

/** What a sole trader keeps of a year's profit after income tax and Class 4; a loss keeps nothing and pays nothing. */
export function soleTraderTakeHome(profit: number): SoleTraderTakeHome {
  finite(profit, "soleTraderTakeHome");
  const p = Math.max(0, profit);
  const it = incomeTax(p).total;
  const c4 = class4(p);
  return { profit, incomeTax: it, class4: c4, takeHome: sumPennies([p, -it, -c4]) };
}

export type CompanyTakeHome = {
  companyProfit: number;
  salary: number;
  employerNi: number;
  profitAfterSalary: number;
  corporationTax: number;
  dividends: number;
  employeeNi: number;
  incomeTax: number;
  takeHome: number;
};

/** What a one-director company's owner keeps with a given salary, the rest paid out as dividends; null when the profit
 *  cannot pay the salary and its employer NI. */
export function companyTakeHome(companyProfit: number, salary: number): CompanyTakeHome | null {
  finite(companyProfit, "companyTakeHome");
  finite(salary, "companyTakeHome");
  const s = pennies(salary); // a negative salary is refused below, by incomeTax
  const er = employerClass1(s);
  const pi = pennies(companyProfit - s - er);
  if (pi < 0) return null;
  const ct = corporationTax(pi);
  const d = pennies(pi - ct);
  const ee = employeeClass1(s);
  const it = incomeTax(s, d).total;
  return {
    companyProfit,
    salary: s,
    employerNi: er,
    profitAfterSalary: pi,
    corporationTax: ct,
    dividends: d,
    employeeNi: ee,
    incomeTax: it,
    takeHome: sumPennies([s, -ee, d, -it]),
  };
}

/** How many regions the refine visits, and how far apart their centres must be (pounds of salary). */
const REFINE_REGIONS = 4;
const REGION_GAP = 1_000;

/** The largest salary the profit can pay with its employer NI (bisection on a decreasing function). */
function maxSalary(companyProfit: number): number {
  let lo = 0;
  let hi = Math.max(0, companyProfit);
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (companyTakeHome(companyProfit, mid)) lo = mid;
    else hi = mid;
  }
  // to the penny (the best salary can be the whole profit less its NI, e.g. 11,041.65); the 1e-6 keeps a float a hair
  // under a whole penny (61,716.99999 for 617.17) from losing that penny
  return Math.floor(lo * 100 + 1e-6) / 100;
}

/** The salary at which the company's profit after salary equals `target`, or null when no salary gets there. */
function salaryForCompanyProfit(companyProfit: number, target: number, sMax: number): number | null {
  const at = (s: number) => companyProfit - s - employerClass1(s);
  if (at(0) < target || at(sMax) > target) return null;
  let lo = 0;
  let hi = sMax;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (at(mid) > target) lo = mid;
    else hi = mid;
  }
  return pennies(lo);
}

/** The salary that leaves the owner the most, searched to the pound; a loss has no feasible salary and is refused (so is
 *  a profit that is not finite, by companyTakeHome). */
export function bestCompanyTakeHome(companyProfit: number): CompanyTakeHome {
  const sMax = maxSalary(companyProfit);
  const named = [
    0,
    L.class1Secondary.secondaryThreshold,
    L.class1Primary.primaryThreshold,
    L.class1Primary.upperEarningsLimit,
    L.incomeTax.taperThreshold,
    L.incomeTax.additionalRateThreshold,
    sMax,
    salaryForCompanyProfit(companyProfit, L.corporationTax.lowerLimit, sMax),
    salaryForCompanyProfit(companyProfit, L.corporationTax.upperLimit, sMax),
  ];
  const candidates = new Set<number>();
  for (const s of named) if (s !== null && s >= 0 && s <= sMax) candidates.add(s);
  for (let s = 0; s <= sMax; s += 250) candidates.add(s);
  const better = (a: CompanyTakeHome | null, b: CompanyTakeHome | null) =>
    !!a && (!b || a.takeHome > b.takeHome || (a.takeHome === b.takeHome && a.salary < b.salary));
  const evaluated: CompanyTakeHome[] = [];
  for (const s of candidates) {
    const r = companyTakeHome(companyProfit, s);
    if (r) evaluated.push(r);
  }
  if (evaluated.length === 0) throw new Error(`bestCompanyTakeHome: no feasible salary for profit ${companyProfit}`);
  const ranked = evaluated.sort((a, b) => b.takeHome - a.takeHome || a.salary - b.salary);
  const centres: number[] = [];
  for (const r of ranked) {
    if (centres.every((c) => Math.abs(c - r.salary) >= REGION_GAP)) centres.push(r.salary);
    if (centres.length === REFINE_REGIONS) break;
  }
  let winner: CompanyTakeHome = ranked[0];
  for (const centre of centres) {
    for (let s = Math.max(0, centre - 250); s <= Math.min(sMax, centre + 250); s++) {
      const r = companyTakeHome(companyProfit, s);
      if (r && better(r, winner)) winner = r;
    }
  }
  return winner;
}
