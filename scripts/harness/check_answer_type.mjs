/**
 * check_answer_type , ONE ANSWER TYPE A LIST (plan 2026-10-13 country-page-journey, Task 1C; spec sections 3 and 6). On every country render
 * the chain draws (the country entries of scripts/harness/pages.json), every list declares its type and holds rows of that type alone, its
 * units out of the cells, each fold two to eight rows, each slot's own rows its type; read by scripts/lib/answer_type.mjs, whose header
 * states what a class is and its blind spot. Not a ratchet. No browser: it parses the renders pages-fresh writes, so it also runs on Vercel.
 *
 *   node scripts/harness/check_answer_type.mjs --list[=scripts/harness/pages.json]
 */
import { existsSync, readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { preflight } from "./preflight.mjs";
import { readAnswerTypes } from "../lib/answer_type.mjs";
import { red, redSummary } from "../lib/red.mjs";

preflight({ name: "check_answer_type" });

const RULE = "answer-type";
const args = process.argv.slice(2);
const listArg = args.find((a) => a.startsWith("--list"));
const LIST = listArg && listArg.includes("=") ? listArg.slice("--list=".length) : "scripts/harness/pages.json";
const pages = JSON.parse(readFileSync(LIST, "utf8")).pages.filter((p) => p.surface === "country").map((p) => `${p.surface}-${p.slugs.join("-")}`);
const REMEDY = "give each list its slot's type (data-answer) and its rows one class: a row of another type moves behind the plus in its own list under its own head; a unit goes into the label or the head; a fold holds two to eight rows";
const reds = [];
if (pages.length === 0) reds.push({ file: LIST, detail: "no country render in the list: the gate read nothing", remedy: "keep the country entries in scripts/harness/pages.json" });
for (const name of pages) {
  const file = `scratchpad/harness/pages/${name}.html`;
  if (!existsSync(file)) { reds.push({ file, detail: `${name}: no country render to read`, remedy: "run node node_modules/tsx/dist/cli.mjs scripts/verify_pages_fresh.mjs and fix what it names" }); continue; }
  const doc = new JSDOM(readFileSync(file, "utf8").replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")).window.document;
  const r = readAnswerTypes(doc, { requireDeclared: true });
  console.log(`  ${name}: ${r.lists} list(s), ${r.rows} row(s), ${r.findings.length} finding(s)`);
  if (r.lists === 0) reds.push({ file, detail: `${name}: the gate read no list on this render`, remedy: REMEDY });
  for (const f of r.findings) reds.push({ file, detail: `${name} #${f.where}: ${f.rule}: ${f.detail}`, remedy: REMEDY });
}
for (const f of reds) red({ rule: RULE, ...f });
if (reds.length) { redSummary(RULE, reds.length, REMEDY, `${pages.length} country render(s)`); process.exit(1); }
console.log(`PASS answer-type: ${pages.length} country render(s), every list one type.`);
