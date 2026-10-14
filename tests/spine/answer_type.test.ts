/**
 * ONE ANSWER TYPE A LIST, THE READING (plan 2026-10-13 country-page-journey, Task 1C; spec sections 3 and 6): scripts/lib/answer_type.mjs over
 * jsdom fixtures: the value classes, the unit in a cell, the fold's two to eight rows, the undeclared list, the slot's own type; ranges,
 * thresholds, pence, magnitudes and a unit carried by the label or the fold's head are read as the figure they are, never as a mix.
 * BLIND SPOT, stated: fixtures prove the reading, not the pages; the pages are the `answer-type` gate's, over the renders pages-fresh writes.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/answer_type.test.ts
 */
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { readAnswerTypes, classifyRow } from "../../scripts/lib/answer_type.mjs";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "answer-type-reader";
const LIB = "scripts/lib/answer_type.mjs";
const GATE = "scripts/harness/check_answer_type.mjs";
const REMEDY = "read a row's class from its value, and for a bare number from its label or its fold's head (the header of scripts/lib/answer_type.mjs); a list of one declared type, its units out of the cells";
let failed = 0;
const check = (label: string, ok: boolean, file = LIB, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };

const doc = (inner: string) => new JSDOM(`<!doctype html><html><body><main>${inner}</main></body></html>`).window.document;
const row = (label: string, value: string, extra = "") => `<div data-row="r"${extra}><dt data-label>${label}</dt><dd data-value>${value}</dd></div>`;
const list = (type: string, rows: string) => `<div data-archetype="fact-rows" data-answer="${type}"><dl>${rows}</dl></div>`;
const fold = (type: string, head: string, rows: string) => `<div data-archetype="detail-panel" data-fold="answer" data-answer="${type}"><details><summary><span data-label>${head}</span></summary><dl>${rows.replace(/data-row="r"/g, "data-detail-row")}</dl></details></div>`;
const found = (inner: string, opts: { requireDeclared?: boolean } = {}) => readAnswerTypes(doc(inner), opts).findings.map((f: { rule: string }) => f.rule).sort().join(",");

check("money: a dollar figure and a pound figure are one class", found(list("money", row("Fee", "$133") + row("Wage floor, an hour", "£12.71"))) === "");
check("a word in a money list is the wrong type", found(list("money", row("Fee", "$133") + row("Online", "Free"))) === "WRONG TYPE");
check("time: bare numbers under labels that end with their unit", found(list("time", row("Accounts, months", "9") + row("Tax return, months", "12"))) === "");
check("a unit in the cell is a red of its own, the class still time", found(list("time", row("Accounts", "9 months"))) === "UNIT IN CELL");
check("share: a range of percents and a percent", found(list("share", row("Card readers", "1.69% to 1.75%") + row("Late interest", "8%"))) === "");
check("money: a threshold, a range, a magnitude and pence", found(list("money", row("Debt Relief Order", "Under £50,000") + row("Start-up loan", "£500 to £25,000") + row("Parting, 10 years", "$13K") + row("Business rates", "43.2p"))) === "");
check("a word in a time list is the wrong type (Next day)", found(list("time", row("Card payouts", "Next day"))) === "WRONG TYPE");
check("position: placed figures of any unit", found(`<div data-hero-rows data-answer="position">${row("Clean dealing /100", "71", ' data-placed="clean-dealing"')}${row("Monthly salary", "$4,315", ' data-placed="salary"')}</div>`) === "");
check("an unplaced figure in a position list is the wrong type", found(`<div data-hero-rows data-answer="position">${row("Monthly salary", "$4,315")}</div>`) === "WRONG TYPE");
check("state: words from a closed list", found(list("state", row("Taking on staff", "Moderate") + row("Letting go", "Easy"))) === "");
check("a time in a state list is the wrong type and a unit in a cell", found(list("state", row("Tax code", "21 days"))) === "UNIT IN CELL,WRONG TYPE");
check("a dated pair holds its date", found(`<div data-answer="dated-pair"><div data-row="c"><span>1 Apr 2026</span><span data-label>Minimum wage</span><span data-value>£12.21</span></div></div>`) === "");
check("a dated pair without a date is the wrong type", found(`<div data-answer="dated-pair"><div data-row="c"><span data-label>Minimum wage</span><span data-value>£12.21</span></div></div>`) === "WRONG TYPE");
check("a fold of one row is under two", found(fold("money", "Customer pay by city", row("London", "$65K"))) === "FOLD ROWS");
check("a fold of nine rows is over eight", found(fold("money", "Customer pay by city", Array.from({ length: 9 }, (_, i) => row(`City ${i}`, `$${i + 1}K`)).join(""))) === "FOLD ROWS");
check("a fold of three rows stands", found(fold("money", "Customer pay by city", row("London", "$65K") + row("Leeds", "$42K") + row("Bristol", "$44K"))) === "");
check("an undeclared fact-rows list is a red where a declaration is required", found(`<div data-archetype="fact-rows"><dl>${row("A", "$1")}</dl></div>`, { requireDeclared: true }) === "UNDECLARED");
check("and no red where it is not", found(`<div data-archetype="fact-rows"><dl>${row("A", "$1")}</dl></div>`) === "");
check("a score's unit in its cell is a red (71 /100)", found(`<div data-hero-rows data-answer="position">${row("Clean dealing", "71 /100", ' data-placed="clean-dealing"')}</div>`) === "UNIT IN CELL");
check("a slot whose own rows declare another type than the slot", found(`<div data-slot="hire" data-answer="money">${list("share", row("Rate", "8%"))}</div>`) === "SLOT TYPE");
check("a rate per hundred under its label is a share", found(list("share", row("Vacancies per 100 jobs", "2.8"))) === "");
check("a range of years under its label is time", found(list("time", row("Director ban, years", "2 to 15"))) === "");
check("a fold's head can carry the unit of its bare numbers", found(fold("time", "The steps, in days", row("Registration", "1") + row("Bank account", "21"))) === "");
check("a bare count in a money list is the wrong type", found(list("money", row("Steps in all", "5"))) === "WRONG TYPE");
check("the page's answer marker (data-answer=\"1\", older than this reading) is not read as a list", found(`<div data-answer="1"><span data-value>18%</span></div>`) === "" && readAnswerTypes(doc(`<div data-answer="1"><span data-value>18%</span></div>`)).lists === 0);
check("the classes by name", classifyRow({ value: "$1" }) === "money" && classifyRow({ value: "8%" }) === "share" && classifyRow({ value: "Easy" }) === "state" && classifyRow({ value: "3", label: "Notice, weeks" }) === "time" && classifyRow({ value: "3" }) === "count" && classifyRow({ value: "71", placed: true }) === "position" && classifyRow({ value: "–" }) === null);

/* THE GATE'S WIRING. */
const gate = stripCommentLines(readFileSync(GATE, "utf8").split(/\r?\n/)).join("\n");
check("the gate reads the country surface of the harness list statically, requires every list declared, and reds an empty scan", /surface === "country"/.test(gate) && /requireDeclared: true/.test(gate) && /new JSDOM\(/.test(gate) && !/chromium/.test(gate) && /no country render/.test(gate) && /read no list/.test(gate), GATE, "read the country renders of scripts/harness/pages.json with jsdom, requireDeclared, and red a list with no country page, a missing render or a render with no list");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/answer_type: all pass");
