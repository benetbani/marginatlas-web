/**
 * check_type_floor , NO READER TEXT UNDER 14PX (plan 2026-10-12 rhythm-air-inside, Task 1A; spec
 * E:/atlas/docs/superpowers/specs/2026-10-12-rhythm-air-inside-design.md, section 3 item 1). On each spine render the chain draws (the
 * country, city, cell, industry, hood and calculator surfaces of scripts/harness/pages.json; the home is project 3's, the how-to page an appendix,
 * /new-businesses no spine view; the calculator joined on 2026-10-16, release 3 job C, the final review's Important 1, and read 0 characters
 * outside the allowance), the characters under 14px outside the allowance list are 20% or less of the characters visible at 1280.
 * Read as scripts/lib/type_floor.mjs reads (R1's method); its blind spot, stated there and printed here: no container query, no stylesheet
 * rule outside THE ZONES' size rules, one width. scripts/harness/type_floor_allow.json names each place the 12px rung stays (a chart's tick
 * and axis labels, the source and licence line of a page's foot) with its reason; a component marks the place with data-type-allow="<key>",
 * and a key the list does not name is a red. Not a ratchet: the 20% is the law. No browser: it parses the renders pages-fresh writes.
 * THE SCAN SET IS KNOWN APART FROM WHAT WAS FOUND (the review of Task 1A): a spine surface the list holds no page of is a red too, so a list that
 * names none of them reads no render and cannot pass; until then it printed "PASS type-floor: 0 render(s)".
 *
 * A RENDER THAT READ NO CHARACTER IS A RED TOO (Task 3, the standing empty-scan ruling): a share over no characters is 0 and would pass, so a render
 * with no visible character at 1280 says "no visible character read, so nothing was measured". `--dir=<folder>` names the renders' folder (default
 * scratchpad/harness/pages), which tests/spine/type_floor.test.ts uses to plant an empty render on a temp tree.
 *
 *   node scripts/harness/check_type_floor.mjs --list[=scripts/harness/pages.json] [--dir=scratchpad/harness/pages]
 */
import { existsSync, readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { preflight } from "./preflight.mjs";
import { readTypeFloor, FLOOR_PX, SHARE_MAX } from "../lib/type_floor.mjs";
import { red, redSummary } from "../lib/red.mjs";

preflight({ name: "check_type_floor" });

const RULE = "type-floor";
const SPINE = ["country", "city", "cell", "industry", "hood", "calculator"];
const HARNESS_LIST = "scripts/harness/pages.json";
const dirArg = process.argv.slice(2).find((a) => a.startsWith("--dir="));
const PAGES_DIR = dirArg ? dirArg.slice("--dir=".length) : "scratchpad/harness/pages";
const args = process.argv.slice(2);
const listArg = args.find((a) => a.startsWith("--list"));
const LIST = listArg && listArg.includes("=") ? listArg.slice("--list=".length) : HARNESS_LIST;
const ALLOW_FILE = "scripts/harness/type_floor_allow.json";
const allowKeys = new Set(JSON.parse(readFileSync(ALLOW_FILE, "utf8")).map((e) => e.key));
const pages = JSON.parse(readFileSync(LIST, "utf8")).pages.filter((p) => SPINE.includes(p.surface));
const REMEDY = `set the text at var(--t-body) with its leading pair (14 on 20); a chart's tick or axis label, or the foot's source line, keeps 12 only under data-type-allow with its key named in ${ALLOW_FILE}`;
const reds = [];
/* A SPINE SURFACE THE LIST HOLDS NO PAGE OF (the review of Task 1A): the names in SPINE are the scan set, known apart from the pages found, so a surface
   with none is a red and zero renders read can never print PASS. */
const bare = SPINE.filter((s) => !pages.some((p) => p.surface === s));
for (const s of bare) reds.push({ file: LIST, detail: `no page of the ${s} surface in ${LIST}, so no ${s} render was read`, remedy: `add a page of the ${s} surface to ${HARNESS_LIST}, the list the chain's harness gates read` });
console.log(`type-floor: ${pages.length} spine render(s) at 1280, read as scripts/lib/type_floor.mjs reads (R1's method; blind to container queries and to stylesheet rules outside THE ZONES' size rules)`);
for (const p of pages) {
  const name = `${p.surface}-${p.slugs.join("-")}`;
  const file = `${PAGES_DIR}/${name}.html`;
  if (!existsSync(file)) { reds.push({ file, detail: `${name}: no render`, remedy: "run node node_modules/tsx/dist/cli.mjs scripts/verify_pages_fresh.mjs and fix what it names" }); continue; }
  const doc = new JSDOM(readFileSync(file, "utf8").replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")).window.document;
  const r = readTypeFloor(doc, allowKeys);
  if (!r.chars) { reds.push({ file, detail: `${name}: no visible character read at 1280, so nothing was measured`, remedy: "the render drew no text under main (or none visible at 1280): run node node_modules/tsx/dist/cli.mjs scripts/verify_pages_fresh.mjs and fix what it names" }); continue; }
  const pct = (100 * r.share).toFixed(1);
  console.log(`  ${name}: ${r.small} of ${r.chars} visible characters under ${FLOOR_PX}px outside the allowance (${pct}%); ${r.allowed} allowed; raw ${(100 * r.raw).toFixed(1)}% (R1's figure)`);
  for (const [at, c] of r.runs.slice(0, 8)) console.log(`      ${String(c).padStart(5)}  ${at}`);
  if (r.share > SHARE_MAX) reds.push({ file, detail: `${name}: ${pct}% of the visible characters under ${FLOOR_PX}px, over ${SHARE_MAX * 100}% (largest: ${r.runs.slice(0, 3).map(([at, c]) => `${at} ${c}`).join("; ")})`, remedy: REMEDY });
  for (const key of r.unknownKeys) reds.push({ file: ALLOW_FILE, detail: `${name}: data-type-allow="${key}" names no entry of the allowance list`, remedy: `name the place with its reason in ${ALLOW_FILE}, or lift the text to 14` });
}
for (const f of reds) red({ rule: RULE, ...f });
if (reds.length) {
  /* The count line is the one a truncated tail keeps, so it names the remedy of each kind of finding present: the list's when a surface is missing, the text's when a render is over. */
  const fix = [bare.length ? `add a page of each missing surface (${bare.join(", ")}) to ${HARNESS_LIST}` : "", reds.length > bare.length ? REMEDY : ""].filter(Boolean).join("; ");
  redSummary(RULE, reds.length, fix, `${pages.length} render(s)`);
  process.exit(1);
}
console.log(`PASS type-floor: ${pages.length} render(s) at or under ${SHARE_MAX * 100}% under ${FLOOR_PX}px.`);
