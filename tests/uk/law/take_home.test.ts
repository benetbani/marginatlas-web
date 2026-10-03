/**
 * What an owner keeps after tax, sole trader and company, and the company's best salary.
 * Expected values computed independently in Python on a 10-pound salary grid (2026-10-02).
 *
 * Run: npx tsx tests/uk/law/take_home.test.ts
 */
import { soleTraderTakeHome, companyTakeHome, bestCompanyTakeHome } from "../../../src/lib/uk/law/take_home";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-law-take-home";
const FILE = "src/lib/uk/law/take_home.ts";
const REMEDY = "fix take_home.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

check("sole trader on 30,000 keeps 25,468.20", soleTraderTakeHome(30_000).takeHome === 25_468.2);
check("sole trader on 60,000 keeps 46,111.40", soleTraderTakeHome(60_000).takeHome === 46_111.4);
check("sole trader on 100,000 keeps 69,311.40", soleTraderTakeHome(100_000).takeHome === 69_311.4);
check("sole trader on 150,000 keeps 92,040.40", soleTraderTakeHome(150_000).takeHome === 92_040.4);
check("a loss keeps nothing and pays nothing", soleTraderTakeHome(-3_000).takeHome === 0);

const c = companyTakeHome(60_000, 12_570)!;
check("company 60,000, salary 12,570: employer NI 1,135.50", c.employerNi === 1135.5);
check("profit after salary 46,294.50, corporation tax 8,795.96", c.profitAfterSalary === 46_294.5 && c.corporationTax === 8795.96);
check("dividends 37,498.54", c.dividends === 37_498.54);
check("keeps 46,091.20", c.takeHome === 46_091.2);
check("a salary the profit cannot pay is refused", companyTakeHome(10_000, 20_000) === null);
const c30 = companyTakeHome(60_000, 30_000)!;
check("company 60,000, salary 30,000: employee NI 1,394.40 comes off, the owner keeps 43,902.00", c30.employeeNi === 1394.4 && c30.takeHome === 43_902);

const cases: Array<[number, number, number]> = [
  [30_000, 12_570, 24_403.45],
  [60_000, 12_570, 46_091.2],
  [100_000, 12_570, 65_209.63],
];
for (const [profit, salary, keep] of cases) {
  const b = bestCompanyTakeHome(profit);
  check(`company ${profit}: best salary ${salary}, keeps ${keep}`, b.salary === salary && b.takeHome === keep);
}
// Inside the allowance taper each even pound of adjusted net income takes a whole pound of allowance, so keep(salary) is a
// sawtooth and the best salary sits off the kink: at 150,000 it is 4,996, 14p better than 5,000 (85,321.30 against
// 85,321.16; the best of every whole-pound salary from 4,750 to 5,250, computed independently). Only the refine finds it.
const b150 = bestCompanyTakeHome(150_000);
check("company 150,000: the refine finds salary 4,996, keeping 85,321.30 (5,000 keeps 85,321.16)", b150.salary === 4_996 && b150.takeHome === 85_321.3);
// When salary below the allowance beats corporation tax, the best salary is the whole profit less its employer NI, found
// to the penny: whole pounds would stop at 11,041 and keep 11,041.61.
const small = bestCompanyTakeHome(11_947.9);
check("company 11,947.90: the best salary is all of it less its NI, 11,041.65 to the penny, kept whole", small.salary === 11_041.65 && small.takeHome === 11_041.65);
// The search is at least as good as every salary on a 10-pound grid (a brute-force check).
let beaten = false;
for (const profit of [45_000, 80_000, 120_000]) {
  const b = bestCompanyTakeHome(profit);
  for (let s = 0; s <= profit; s += 10) {
    const r = companyTakeHome(profit, s);
    if (r && r.takeHome > b.takeHome + 1e-9) beaten = true;
  }
}
check("no salary on a 10-pound grid beats the search (45k, 80k, 120k)", !beaten);
check("at 100,000 a sole trader keeps more than a company (69,311.40 against 65,209.63)", soleTraderTakeHome(100_000).takeHome > bestCompanyTakeHome(100_000).takeHome);
const refuses = (f: () => unknown) => { try { f(); return false; } catch { return true; } };
check("an amount that is not finite is refused, never kept as zero", refuses(() => soleTraderTakeHome(-Infinity)) && refuses(() => companyTakeHome(60_000, -Infinity)) && refuses(() => companyTakeHome(Number.NaN, 0)) && refuses(() => bestCompanyTakeHome(Infinity)));
check("a company with a loss has no feasible salary and is refused", refuses(() => bestCompanyTakeHome(-5_000)));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/take_home: all pass");
