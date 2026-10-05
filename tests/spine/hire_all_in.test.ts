/**
 * ONE HIRE, ALL IN (milestone 2, masterplan step 22; his ruling 28 of 2026-09-26; DATA-REQUIREMENTS item 77): the builder's
 * figures against the research's worked examples (E:/atlas/design/loop/build/research/2026-10-02-pro-sections-uk-law.md: 77.4
 * A and B; the parting bill by 76.5's rules and 76.8 D), every expected value in pounds, to the penny.
 *
 * Run: npx tsx tests/spine/hire_all_in.test.ts
 */
import { buildHireAllIn, partingBill, PARTING_AGE } from "../../src/lib/spine/sections/hire_all_in";
import { convertToUsd } from "../../src/lib/finance/fx";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "hire-all-in";
const FILE = "src/lib/spine/sections/hire_all_in.ts";
const REMEDY = "compute the hire from the law engine (src/lib/uk/law) so it reproduces the research's worked examples to the penny";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

// Example A (77.4): the National Living Wage, 37.5 hours a week.
const a = buildHireAllIn({ allowance: true });
const aNo = buildHireAllIn({ allowance: false });
check(`A: gross 24,784.50 (${a.gross.gbp})`, a.gross.gbp === 24784.5);
check(`A: all in with the Employment Allowance 25,340.84 (${a.allIn.gbp})`, a.allIn.gbp === 25340.84);
check(`A: all in without it 28,308.52 (${aNo.allIn.gbp})`, aNo.allIn.gbp === 28308.52);
check(`A: 1,740 hours worked, 52 weeks less 5.6 of holiday at 37.5 (${a.workedHours})`, a.workedHours === 1740);
check(`A: an hour worked costs 14.56 with the allowance (${a.perWorkedHour.gbp})`, a.perWorkedHour.gbp === 14.56);
check(`A: and 16.27 without (${aNo.perWorkedHour.gbp})`, aNo.perWorkedHour.gbp === 16.27);

// Example B (77.4): 30,000 a year.
const b = buildHireAllIn({ gross: 30000, allowance: true });
const bNo = buildHireAllIn({ gross: 30000, allowance: false });
check(`B: all in with the allowance 30,712.80 (${b.allIn.gbp})`, b.allIn.gbp === 30712.8);
check(`B: all in without it 34,462.80 (${bNo.allIn.gbp})`, bNo.allIn.gbp === 34462.8);

// The parting bill at example A's week (476.625), aged 35: redundancy (none under two years, s.155) plus notice in lieu (s.86).
const at = (years: number) => a.parting.find((p) => p.years === years);
check(`aged ${PARTING_AGE}, after 1 year: no redundancy, one week's notice, 476.63 (${at(1)?.gbp})`, at(1)?.redundancy === 0 && at(1)?.notice === 476.63 && at(1)?.gbp === 476.63);
check(`after 3 years: three weeks of each, 1,429.88 and 1,429.88, 2,859.76 (${at(3)?.gbp})`, at(3)?.redundancy === 1429.88 && at(3)?.notice === 1429.88 && at(3)?.gbp === 2859.76);
check(`after 10 years: ten weeks of each, 4,766.25 and 4,766.25, 9,532.50 (${at(10)?.gbp})`, at(10)?.redundancy === 4766.25 && at(10)?.notice === 4766.25 && at(10)?.gbp === 9532.5);

// 76.8 D: a barber aged 30, 4 full years, 500 a week: 2,000 of redundancy and 2,000 of notice; at 800 a week the redundancy
// week is capped at 751 (3,004); twenty years all at 41 or over is the ceiling, 22,530.
const d = partingBill({ weeklyPay: 500, age: 30, years: 4 });
check(`D: 2,000 of redundancy and 2,000 of notice (${d.redundancy}, ${d.notice})`, d.redundancy === 2000 && d.notice === 2000 && d.total === 4000);
check(`D: at 800 a week the redundancy is capped, 3,004 (${partingBill({ weeklyPay: 800, age: 30, years: 4 }).redundancy})`, partingBill({ weeklyPay: 800, age: 30, years: 4 }).redundancy === 3004);
const cap = a.extras.find((r) => r.key === "redundancy-cap");
check(`D: the ceiling, 22,530 (${cap?.value})`, cap?.value === "£22,530");
const rtw = a.extras.find((r) => r.key === "right-to-work");
check(`the right-to-work penalty, 45,000 a worker, 60,000 repeated (77.2) (${rtw?.value}; ${rtw?.note})`, rtw?.value === "£45,000" && /£60,000/.test(String(rtw?.note)));

// Dollars through the site's FX module, never a typed rate; provenance on every figure.
check("the hour in dollars is the FX module's conversion of the pounds", a.perWorkedHour.usd === convertToUsd("GBP", 14.56));
check("every computed figure says it was worked out", [a.allIn, a.perWorkedHour, ...a.parting].every((m) => m.prov.kind === "worked out" && m.prov.src.startsWith("uk/law/")));
check("every extra carries its provenance", a.extras.every((r) => !!r.prov && r.prov.src.startsWith("uk/law/")));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/hire_all_in: all pass");
