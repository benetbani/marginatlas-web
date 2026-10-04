/**
 * The country hero's rows say what they hold (plan 06, task B1). The United Kingdom's "total effective tax burden" (his words,
 * 2026-08-30) is worked out by the law engine on a stated profit, not typed; the salary row is the typical (median) salary;
 * the admin index carries its last year, 2020; the days row is the company's own registration days (his ruling of 2026-09-20).
 *
 * Run: npx tsx tests/spine/hero_rows.test.ts
 */
import { buildHeroBoard } from "../../src/lib/spine/hero_board";
import { soleTraderTakeHome } from "../../src/lib/uk/law/take_home";
import { buildPeerTable } from "../../src/lib/spine/peer_rows";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "hero-rows";
const FILE = "src/lib/spine/hero_board.ts";
const REMEDY = "keep the UK's tax on profit on the law engine and each hero row's label true to its figure";
let failed = 0;
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

/* 51,785 dollars of median full-time pay at 1.3265 is 39,039.01 pounds of profit. */
const gbp = 51_785 / 1.3265;
const t = soleTraderTakeHome(gbp);
const expected = Math.round(((t.incomeTax + t.class4) / gbp) * 100);
const gb = buildHeroBoard("GB");
check(`the UK's tax on profit is the engine's income tax and national insurance on 39,039 pounds: ${expected}%`, gb.answer?.value === `${expected}%` && expected === 18);
check("the words under it state the profit and the form", gb.answerBasis === "on $52K of profit, a sole trader under Self Assessment");
check("the label stays his: total effective tax burden", gb.answer?.label === "Total effective tax burden");
const row = (key: string) => gb.rows.find((r) => r.key === key);
check("the salary row is the typical salary (a median)", row("salary-month")?.label === "Typical salary");
check("the admin index carries its last year", row("admin")?.label === "Admin ease, 2020");
check("the days row is the company's registration days: 1 day in the UK", row("llc-days")?.label === "Days to register" && row("llc-days")?.value === "1");
const de = buildHeroBoard("DE");
check("Germany keeps its regime's rate and its own words", de.answer !== null && de.answerBasis === undefined);

const peers = buildPeerTable("GB");
const home = peers?.rows.find((r) => r.home);
check("the peers table's UK row prints the hero's tax and registration days, never two figures for one thing", home !== undefined && home.values.effective_tax_pct === expected && home.values.llc_days === 1);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/hero_rows: all pass");
