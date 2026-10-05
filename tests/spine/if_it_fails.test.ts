/**
 * WHAT FAILING COSTS (milestone 2, masterplan step 28; his ruling 28 of 2026-09-26; DATA-REQUIREMENTS item 76): the builder
 * against the law it reads (data/uk/law/if_it_fails.json, from the research of 2026-10-02, section 76), the research's worked
 * examples (76.8 A to E) and the figures /gb's paperwork card already prints (data/sections/rules.json, GB).
 *
 * Run: npx tsx tests/spine/if_it_fails.test.ts
 */
import { readFileSync } from "node:fs";
import { buildIfItFails, IF_IT_FAILS, monthsOfDays } from "../../src/lib/spine/sections/if_it_fails";
import { statutoryNoticeWeeks, statutoryRedundancyPay } from "../../src/lib/uk/law/redundancy";
import { pennies, sumPennies } from "../../src/lib/uk/law/money";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "if-it-fails";
const FILE = "src/lib/spine/sections/if_it_fails.ts";
const REMEDY = "build the section from data/uk/law/if_it_fails.json, every cell naming its sourced field, the research's examples reproduced, nothing the paperwork card prints";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };
const v = <T>(key: string) => IF_IT_FAILS.fields[key]?.value as T;

const s = buildIfItFails();
check("the section builds", !!s);
const printed: string[] = [];
if (s) {
  check(`the figure is the months until a bankrupt sole trader is freed, the research's 12 (${s.focal.months})`, s.focal.months === 12);
  check("the figure says it was looked up in the law file's discharge field", s.focal.prov.kind === "looked up" && s.focal.prov.src === "uk/law/if_it_fails.json:discharge_months");
  const order = ["home", "debt-relief", "liquidation-fees", "liquidation-time", "wrongful-trading", "director-ban", "guarantee", "directors-loan"];
  check(`a cell for each of the rest: item 76's and the plan's two (${s.rows.map((r) => r.key).join(", ")})`, JSON.stringify(s.rows.map((r) => r.key)) === JSON.stringify(order));
  const cell = (key: string) => s.rows.find((r) => r.key === key);
  check("the home can be sold, within the trustee's 3 years", cell("home")?.value === "Can be sold" && /\b3 years\b/.test(cell("home")?.note ?? ""));
  check("the Debt Relief Order's limit, debts under £50,000", cell("debt-relief")?.value === "Under £50,000");
  check("a liquidation's fees, the sample's median £12,937, against its £5,798 of assets, from 2017", cell("liquidation-fees")?.value === "£12,937" && /£5,798/.test(cell("liquidation-fees")?.note ?? "") && /2017/.test(cell("liquidation-fees")?.note ?? ""));
  check(`its time, 712 days in whole months, 23 (${cell("liquidation-time")?.value}), stamped worked out`, cell("liquidation-time")?.value === "23 months" && monthsOfDays(712) === 23 && cell("liquidation-time")?.prov?.kind === "worked out");
  check("wrongful trading, no cap", cell("wrongful-trading")?.value === "No cap");
  check("the director ban, 2 to 15 years", cell("director-ban")?.value === "2 to 15 years");
  check("a guarantee survives the company", cell("guarantee")?.value === "Survives");
  check("the director's loan charge from 6 April 2026, 35.75%", cell("directors-loan")?.value === "35.75%");
  const fields = IF_IT_FAILS.fields as Record<string, { source_url?: string }>;
  check("every cell names the law field it reads, and every such field carries an https source", s.rows.every((r) => { const key = r.prov?.src.split(":")[1]; return !!key && /^https:\/\//.test(fields[key]?.source_url ?? ""); }));
  check("every label is three words at most", s.rows.every((r) => r.label.split(/\s+/).length <= 3));
  check("every note is one line of twelve words at most, with no semicolon or em dash", s.rows.every((r) => !!r.note && r.note.split(/\s+/).length <= 12 && !/[;\u2014]/.test(r.note)));
  check("no struck method word in a label or a note", s.rows.every((r) => !/\bmodell?ed\b|\bwithheld\b|\bon file\b|\bnot gathered\b|\bnot measured\b|\bthe model\b|\bplaceholder\b|\bworked from\b/i.test(`${r.label} ${r.note}`)));
  check("never the same glyph twice in the card, and at most eight glyph rows (ICONS.md, rules 3 and 10)", new Set(s.rows.map((r) => r.icon)).size === s.rows.length && s.rows.length <= 8 && s.rows.every((r) => !!r.icon));
  check("the solvent close is read by no cell", s.rows.every((r) => !/strike_off|solvent_liquidation/.test(r.prov?.src ?? "")));
  printed.push(`${s.focal.months} months`, ...s.rows.map((r) => String(r.value)));
}

/* THE RESEARCH'S WORKED EXAMPLES (76.8), each sum from the file's own fields, to the penny. */
const strike = v<{ online: number; paper: number }>("strike_off_fee_gbp");
const mvl = v<{ remuneration_median_gbp: number; pre_appointment_median_gbp: number; cost_pct_of_assets: number }>("solvent_liquidation");
check(`A: striking off costs 13 online (${strike.online}), the two medians of a solvent liquidation sum to 4,250 (${sumPennies([mvl.remuneration_median_gbp, mvl.pre_appointment_median_gbp])}), 1.8% of 100,000 is 1,800 (${pennies((100_000 * mvl.cost_pct_of_assets) / 100)})`, strike.online === 13 && sumPennies([mvl.remuneration_median_gbp, mvl.pre_appointment_median_gbp]) === 4250 && pennies((100_000 * mvl.cost_pct_of_assets) / 100) === 1800);
const cvl = v<{ median_fees_gbp: number; median_assets_gbp: number; creditors_paid_nothing_pct: number }>("liquidation_cost_local");
const upFront = sumPennies([v<number>("petition_court_fee_gbp"), v<number>("petition_deposit_gbp")]);
const or = v<{ administration: number; general: number }>("official_receiver_fees_gbp");
check(`B: a liquidation's median fees 12,937 against assets of 5,798, nothing to creditors in 86%, a ban of 2 to 15 years, the name barred 5 years`, cvl.median_fees_gbp === 12937 && cvl.median_assets_gbp === 5798 && cvl.creditors_paid_nothing_pct === 86 && v<number>("disqualification_years_min") === 2 && v<number>("disqualification_years_max") === 15 && v<number>("name_reuse_years") === 5);
check(`B: a creditor's petition costs 352 + 2,600 = 2,952 up front (${upFront}), the official receiver takes 6,000 + 7,200 = 13,200 (${sumPennies([or.administration, or.general])})`, upFront === 2952 && sumPennies([or.administration, or.general]) === 13200);
const loan = v<{ from_2026: number; from_2022: number }>("directors_loan_charge_pct");
check(`C: on a loan of 20,000 the charge is 7,150 from 6 April 2026 (${pennies((20_000 * loan.from_2026) / 100)}) and 6,750 before (${pennies((20_000 * loan.from_2022) / 100)})`, pennies((20_000 * loan.from_2026) / 100) === 7150 && pennies((20_000 * loan.from_2022) / 100) === 6750);
/* D is the law engine's (the hire card prints its ceiling); the section prints none of its figures. */
const d1 = statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 4, weeklyPay: 500 }).pay;
const d2 = statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 4, weeklyPay: 800 }).pay;
const d3 = statutoryRedundancyPay({ ageAtDismissal: 61, wholeYears: 20, weeklyPay: 800 }).pay;
const notice = statutoryNoticeWeeks(48) * 500;
check(`D: a barber aged 30 after 4 years at 500 a week, 2,000 and 2,000 of notice (${d1}, ${notice}); at 800, capped, 3,004 (${d2}); the ceiling 22,530 (${d3})`, d1 === 2000 && notice === 2000 && d2 === 3004 && d3 === 22530);
check("D's figures are the hire card's: the section prints none of them", ![d1, d2, d3].some((n) => printed.some((p) => p.includes(n.toLocaleString("en-GB")))));
const dro = v<{ debts_under_gbp: number; assets_under_gbp: number; fee_gbp: number }>("debt_relief_order");
const iva = v<{ creditors_pct: number; years: number[] }>("individual_voluntary_arrangement");
check(`E: bankruptcy costs 680, frees in 12 months, stays on the credit file 6 years, the home dealt with within 3`, v<number>("bankruptcy_fee_gbp") === 680 && v<number>("discharge_months") === 12 && v<number>("credit_file_years") === 6 && v<{ years: number }>("home_protected").years === 3);
check(`E: 25,000 of debts and no assets fit a Debt Relief Order, at no fee; an arrangement needs 75% of creditors over 5 or 6 years`, 25_000 < dro.debts_under_gbp && 0 < dro.assets_under_gbp && dro.fee_gbp === 0 && iva.creditors_pct === 75 && JSON.stringify(iva.years) === "[5,6]");

/* NOTHING THE PAPERWORK CARD PRINTS (clause 66: an obvious thing repeated). Its "To close" view is this subject's twin: the
   strike-off's fee, on paper too, its notice and its quiet period, as values with their units; and no sum of money the card
   prints on either view. The "To run" view's deadlines are filing dates, another fact: the tax return's 12 months is not the
   bankruptcy's 12, so durations are held to the closing view alone. */
type Rule = { key: string; value: { gbp?: number; months?: number; days?: number }; note?: string };
const RULES = JSON.parse(readFileSync("data/sections/rules.json", "utf8")).GB as Record<string, Rule[]>;
const pounds = (t: string) => [...t.matchAll(/£([\d,]+)/g)].map((m) => Number(m[1].replace(/,/g, "")));
const cardMoney = new Set<number>();
for (const r of [...RULES.closing, ...RULES.filings]) { if (r.value.gbp != null) cardMoney.add(r.value.gbp); for (const n of pounds(r.note ?? "")) cardMoney.add(n); }
const closingSpans = RULES.closing.filter((r) => r.value.months != null).map((r) => `${r.value.months} month${r.value.months === 1 ? "" : "s"}`);
check(`no sum of money the paperwork card prints (${[...cardMoney].join(", ")})`, printed.length > 0 && printed.every((p) => pounds(p).every((n) => !cardMoney.has(n))));
check(`no span of its closing view (${closingSpans.join(", ")})`, printed.every((p) => !closingSpans.some((c) => new RegExp(`(^|\\D)${c}\\b`).test(p))));

/* The file: no coined score, and every field its page, its quote and its day, its numbers in its quote. */
const raw = readFileSync("data/uk/law/if_it_fails.json", "utf8");
const parsed = JSON.parse(raw) as { fields: Record<string, { value: unknown; source_url?: string; quote?: string; checked?: string }> };
check("no ease score in the data file", !/ease|_0_100|score/i.test(JSON.stringify(parsed.fields)));
check("no score in what the builder returns", !/score|ease_|_0_100/i.test(JSON.stringify(s)));
check("every field in the data file has its page, its quote and its day", Object.values(parsed.fields).every((f) => /^https:\/\//.test(f.source_url ?? "") && !!f.quote && /^\d{4}-\d{2}-\d{2}$/.test(f.checked ?? "")));
const numbers = (x: unknown): number[] => (typeof x === "number" ? [x] : Array.isArray(x) ? x.flatMap(numbers) : x && typeof x === "object" ? Object.values(x).flatMap(numbers) : []);
const unquoted = Object.entries(parsed.fields).flatMap(([k, f]) => numbers(f.value).filter((n) => n !== 0 && !(f.quote ?? "").includes(n.toLocaleString("en-GB")) && !(f.quote ?? "").includes(String(n))).map((n) => `${k}:${n}`));
check(`every number a field holds stands in its quote (${unquoted.join(", ") || "all"})`, unquoted.length === 0);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/if_it_fails: all pass");
