/**
 * The country hero's rows say what they hold (plan 06, task B1). The United Kingdom's "total effective tax burden" (his words,
 * 2026-08-30) is worked out by the law engine on a stated profit, not typed; the salary row is the typical (median) salary;
 * the admin index carries its scale in its label and its last year, 2020, in its readout (plan 2026-10-13 country-page-journey, Task 3B); the company's own registration days (his ruling of 2026-09-20) are the registering slot's and the peers table's home row's, not the board's (rhythm Task 4).
 * Every country board draws three rows, or every row the country holds when it holds fewer (the controller's ruling of 2026-10-15), checked
 * first on planted boards.
 *
 * Run: npx tsx tests/spine/hero_rows.test.ts
 */
import { buildHeroBoard, heroBoardRows } from "../../src/lib/spine/hero_board";
import { soleTraderTakeHome } from "../../src/lib/uk/law/take_home";
import { buildPeerTable } from "../../src/lib/spine/peer_rows";
import { COUNTRIES } from "../../src/lib/taxonomy";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "hero-rows";
const FILE = "src/lib/spine/hero_board.ts";
const REMEDY = "keep the UK's tax on profit on the law engine and each hero row's label true to its figure";
let failed = 0;
const check = (label: string, ok: boolean, remedy = REMEDY) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy });
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
check("the salary row is the typical salary a month, its unit in its label", row("salary-month")?.label === "Monthly salary");
check("the admin index carries its scale in its label and its last year in its readout", row("admin")?.label === "Admin ease /100" && (row("admin")?.readout ?? "").includes("2020"));
/* EACH FACT PRINTS ONCE (plan 2026-10-12 rhythm-air-inside, Task 4): the company's registration days and fee are the registering slot's, so neither stands on the board. */
check("the board holds no days-to-register row and no cost-to-register row (the registering slot prints them)", !row("llc-days") && !row("llc-cost"));
const de = buildHeroBoard("DE");
check("Germany keeps its regime's rate and its own words", de.answer !== null && de.answerBasis === undefined);

/* THE BOARD'S FLOOR IS THREE ROWS, OR EVERY ROW THE COUNTRY HOLDS WHEN IT HOLDS FEWER (the controller's ruling, 2026-10-15; never an invented
   row). The rows a country holds are the ones the board builder can draw for it (heroBoardRows, one figure each), not a typed list of
   exceptions: Cuba holds two (clean dealing and admin ease; its pay is held back and it has no living cost), so its two pass. A board must
   draw every row it holds and at least min(3, held). The rule is checked first on planted boards, so a floor that can no longer catch a thin
   board, or a board that drops a held row, reds here rather than passing every country; a sweep that read no country is a red, not a pass. */
const BOARD_FLOOR = 3;
type Board = { iso2: string; rows: Array<{ key: string }> };
const boardFault = (b: Board, held: ReadonlyArray<{ key: string }>): string | null => {
  const drawn = new Set(b.rows.map((r) => r.key));
  const dropped = held.filter((r) => !drawn.has(r.key)).map((r) => r.key);
  if (dropped.length) return `${b.iso2} drops held row(s) ${dropped.join(", ")}`;
  if (b.rows.length < Math.min(BOARD_FLOOR, held.length)) return `${b.iso2} draws ${b.rows.length} of ${held.length} held`;
  return null;
};
const gbHeld = heroBoardRows("GB");
check(`Britain holds three rows or more (${gbHeld.length}), so the planted boards below test the floor and not a thin country`, gbHeld.length >= BOARD_FLOOR);
check("the floor catches a planted two-row board where three rows are held", boardFault({ iso2: "PLANTED", rows: gb.rows.slice(0, 2) }, gbHeld) !== null);
const two = gbHeld.slice(0, 2);
check("a planted country that holds two rows passes on its two", boardFault({ iso2: "PLANTED", rows: two }, two) === null);
check("a planted country that holds two rows reds when its board drops one", boardFault({ iso2: "PLANTED", rows: two.slice(0, 1) }, two) !== null);
const faults = COUNTRIES.map((c) => boardFault(buildHeroBoard(c.code), heroBoardRows(c.code))).filter((f): f is string => f !== null);
const fewer = COUNTRIES.map((c) => ({ iso2: c.code, n: heroBoardRows(c.code).length })).filter((c) => c.n < BOARD_FLOOR).map((c) => `${c.iso2} (${c.n})`);
check(`every country board draws every row it holds, three or all it holds when fewer, read on ${COUNTRIES.length} countries; holding fewer than three: ${fewer.join(", ") || "none"}; faults: ${faults.join("; ") || "none"}`, COUNTRIES.length > 0 && faults.length === 0, "draw every row heroBoardRows holds for the country (never a placeholder); a fourth source of a true row goes into heroBoardRows");

const peers = buildPeerTable("GB");
const home = peers?.rows.find((r) => r.home);
check("the peers table's UK row prints the hero's tax and registration days, never two figures for one thing", home !== undefined && home.values.effective_tax_pct === expected && home.values.llc_days === 1);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/hero_rows: all pass");
