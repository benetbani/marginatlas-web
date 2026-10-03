/**
 * What an owner keeps after tax, sole trader and company, and the company's best salary.
 * Expected values computed independently in Python (decimal, half-up at the penny; the best salaries by a whole-pound
 * search over every salary the profit can pay), 2026-10-02 and 2026-10-03.
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
const loss = soleTraderTakeHome(-3_000);
check("a loss keeps nothing and pays nothing, and the record keeps the loss", loss.takeHome === 0 && loss.incomeTax === 0 && loss.class4 === 0 && loss.profit === -3_000);

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
  check(`company ${profit.toLocaleString("en-GB")}: best salary ${salary.toLocaleString("en-GB")}, keeps ${keep.toLocaleString("en-GB")}`, b.salary === salary && b.takeHome === keep);
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
const tiny = bestCompanyTakeHome(617.17);
check("a profit under the secondary threshold is paid out whole as salary, to the penny: 617.17", tiny.salary === 617.17 && tiny.takeHome === 617.17);
// Against a whole-pound search over every salary the profit can pay (computed independently in Python): the search keeps at
// least as much, and at most a few pence more when it lands on a named breakpoint between whole pounds. Near 163,281 the
// best region switches from the 12,570 salary to the 5,000 one: refining only the first winner kept 89,396.54, not 89,396.72.
const oracle: Array<[number, number]> = [[135_000, 80_577.86], [163_281, 89_396.72], [200_000, 106_022.49], [250_000, 129_065.96]];
for (const [profit, keep] of oracle) {
  const got = bestCompanyTakeHome(profit).takeHome;
  check(`company ${profit.toLocaleString("en-GB")}: keeps at least the best whole-pound salary's ${keep.toLocaleString("en-GB")}`, got >= keep && got - keep < 0.05);
}
// In the marginal relief band a pound of salary (15% employer NI, then 47%) costs less than a pound of dividends (26.5%
// corporation tax, then 39.35%), so from about 200,000 the best salary leaves exactly the small-profits limit in the company.
const b200 = bestCompanyTakeHome(200_000);
check("company 200,000: the best salary, 131,086.96, leaves exactly 50,000 in the company and keeps 106,022.49", b200.salary === 131_086.96 && b200.profitAfterSalary === 50_000 && b200.takeHome === 106_022.49);
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
check("a negative salary is refused, never paid as zero", refuses(() => companyTakeHome(60_000, -500)));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/take_home: all pass");
