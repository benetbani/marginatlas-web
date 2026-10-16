/**
 * check_fact_once , EACH FACT PRINTS ONCE (plan 2026-10-12 rhythm-air-inside, Task 1B; spec E:/atlas/docs/superpowers/specs/2026-10-12-
 * rhythm-air-inside-design.md, sections 2.3 and 3 item 2). On every spine render the chain draws (the country, city, cell, industry, hood and
 * calculator surfaces of scripts/harness/pages.json; the calculator joined on 2026-10-16, release 3 job C, the final review's Important 1, with
 * no repeat), at 1280 and 375, no figure prints twice as one fact, read by scripts/lib/fact_once.mjs (what a
 * printed figure is, what one fact is and is not, and its blind spot). scripts/harness/fact_once_allow.json holds a repeat a standing law
 * forces (none expected): the page, the figure, where it prints, the law and the reason. Not a ratchet. A browser gate: what is visible is
 * what the page computes, so a phone list and the table it stands in for are one printing at each width.
 * THE SCAN SET IS KNOWN APART FROM WHAT WAS READ (the review of Task 1A, carried here by the controller's ruling): a spine surface the list holds
 * no page of is a red, and so is a listed render that reads no printed figure at a width (a spine page always prints figures), so the gate never
 * passes having read nothing.
 * NO ALLOWANCE STANDS UNUSED (release 3 job C, 2026-10-16; the rhythm reform's final review, Important 2): an entry of the allowance file that
 * matched no repeat on its page at either width is a red, and so is an entry naming a page the list does not read, so the file can only hold
 * what a page prints today. An entry that exists for a data state the machine may not render carries `state` ("fallback", a page drawn from
 * the adapters' fallbacks, or "live", none fell back), and is required to match only when the page's render is in that state, read from the
 * state file pages-fresh writes (scratchpad/harness/pages/render_state.json); a stated entry with no state file to read is a red. BLIND
 * SPOT: "fallback" is a count of the query ledger's fallback lines while the page rendered, so it cannot tell which query fell back, and an
 * entry bound to it is checked whenever any query of that page fell back.
 *
 *   node scripts/harness/check_fact_once.mjs --list[=scripts/harness/pages.json]
 */
import { chromium } from "playwright";
import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { preflight } from "./preflight.mjs";
import { requireBrowser } from "../lib/local_only.mjs";
import { factOnceInPage } from "../lib/fact_once.mjs";
import { red, redSummary } from "../lib/red.mjs";

await requireBrowser("fact-once", "each fact prints once (one figure, one provenance) on every spine page in scripts/harness/pages.json");
preflight({ browser: true, name: "check_fact_once" });

const RULE = "fact-once";
const SPINE = ["country", "city", "cell", "industry", "hood", "calculator"];
const WIDTHS = [1280, 375];
const HARNESS_LIST = "scripts/harness/pages.json";
const args = process.argv.slice(2);
const listArg = args.find((a) => a.startsWith("--list"));
const LIST = listArg && listArg.includes("=") ? listArg.slice("--list=".length) : HARNESS_LIST;
const ALLOW_FILE = "scripts/harness/fact_once_allow.json";
const allow = JSON.parse(readFileSync(ALLOW_FILE, "utf8"));
const pages = JSON.parse(readFileSync(LIST, "utf8")).pages.filter((p) => SPINE.includes(p.surface));
const STATE_FILE = "scratchpad/harness/pages/render_state.json";
const STATES = ["fallback", "live"];
const renderState = existsSync(STATE_FILE) ? JSON.parse(readFileSync(STATE_FILE, "utf8")).pages ?? {} : null;
/* WHICH ENTRY MATCHED (the staleness read): the index of every entry that allowed a repeat at any width. */
const used = new Set();
const REMEDY = "keep the figure in the section whose job is to explain it, and elsewhere say it in words without the number or drop that sentence; the hero keeps only the page's answer; two facts that print alike each carry their own data-src (src/lib/spine/provenance.ts); a repeat a standing law forces goes in scripts/harness/fact_once_allow.json with the law named";
const EMPTY_REMEDY = "make the render read its figures: they carry the fig class, a data-src or a data-figure (scripts/lib/fact_once.mjs), and the render is the page (run node node_modules/tsx/dist/cli.mjs scripts/verify_pages_fresh.mjs and fix what it names)";
const RENDER_REMEDY = "run node node_modules/tsx/dist/cli.mjs scripts/verify_pages_fresh.mjs and fix what it names";
/* A SPINE SURFACE THE LIST HOLDS NO PAGE OF (the review of Task 1A): the names in SPINE are the scan set, known apart from the pages found, so a
   surface with none is a red and zero renders read can never print PASS. */
const bare = SPINE.filter((s) => !pages.some((p) => p.surface === s));
const found = new Map();
const missing = [];
const empty = new Map();
const browser = await chromium.launch();
for (const p of pages) {
  const name = `${p.surface}-${p.slugs.join("-")}`;
  const file = `scratchpad/harness/pages/${name}.html`;
  if (!existsSync(file)) { missing.push(file); continue; }
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(resolve(file)).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    const r = await page.evaluate(factOnceInPage);
    console.log(`${name}@${w}: ${r.figures} printed figure(s), ${r.reds.length} repeat(s)`);
    /* A RENDER THAT READS NO PRINTED FIGURE (the same ruling): a spine page always prints figures, so a read of none is a gate that cannot see, never a clean page. */
    if (r.figures === 0) {
      if (!empty.has(name)) empty.set(name, []);
      empty.get(name).push(w);
    }
    for (const x of r.reds) {
      const hit = allow.findIndex((e) => e.page === name && e.figure === x.figure && e.where === x.where);
      if (hit >= 0) { used.add(hit); continue; }
      const key = `${name}|${x.rule}|${x.figure}|${x.where}`;
      if (!found.has(key)) found.set(key, { name, ...x, widths: [] });
      found.get(key).widths.push(w);
    }
    await ctx.close();
  }
}
await browser.close();
for (const s of bare) red({ rule: RULE, file: LIST, detail: `no page of the ${s} surface in ${LIST}, so no ${s} render was read`, remedy: `add a page of the ${s} surface to ${HARNESS_LIST}, the list the chain's harness gates read` });
for (const f of missing) red({ rule: RULE, file: f, detail: "no render", remedy: RENDER_REMEDY });
for (const [name, widths] of empty) red({ rule: RULE, file: `scratchpad/harness/pages/${name}.html`, detail: `${name}: no printed figure read at ${widths.join(" and ")}, and a spine page always prints figures, so nothing was read`, remedy: EMPTY_REMEDY });
/* THE REMEDY NAMES THE SECTION THAT KEEPS IT (the spec's section 3 item 2; `keep`, scripts/lib/fact_once.mjs says how it is chosen). */
const keepRemedy = (x) => (x.keep
  ? `keep "${x.figure}" in ${x.keep}${x.where.includes(" and ") ? `, and where it prints again (${x.where.split(" and ").filter((s) => s !== x.keep).join(", ")}) say it in words without the number or drop that sentence` : ": its focal or its row prints it, not both"}; ${REMEDY}`
  : `choose which of ${x.where} explains "${x.figure}" and keep it there; ${REMEDY}`);
for (const x of found.values()) red({ rule: RULE, file: `scratchpad/harness/pages/${x.name}.html`, detail: `${x.rule}: "${x.figure}" prints in ${x.where}${x.src ? ` (data-src ${x.src})` : " (no data-src)"} at ${x.widths.join(" and ")}`, remedy: keepRemedy(x) });
/* THE UNUSED ALLOWANCES. A page whose render is missing is already a red above and its entries are not judged twice. */
const read = new Set(pages.map((p) => `${p.surface}-${p.slugs.join("-")}`).filter((n) => !missing.includes(`scratchpad/harness/pages/${n}.html`)));
const listed = new Set(pages.map((p) => `${p.surface}-${p.slugs.join("-")}`));
const stale = [];
const notThisState = [];
allow.forEach((e, i) => {
  const at = `${ALLOW_FILE} entry ${i + 1} (${e.page}, "${e.figure}" in ${e.where})`;
  if (e.state !== undefined && !STATES.includes(e.state)) { stale.push({ at, detail: `its state "${e.state}" is none of ${STATES.join(", ")}` }); return; }
  if (!listed.has(e.page)) { stale.push({ at, detail: `names a page ${LIST} does not hold, so no render can match it` }); return; }
  if (!read.has(e.page)) return;
  if (e.state) {
    if (!renderState) { stale.push({ at, detail: `is bound to the "${e.state}" state and ${STATE_FILE} does not exist, so the state of the render is unknown` }); return; }
    const now = renderState[e.page]?.state;
    if (!now) { stale.push({ at, detail: `is bound to the "${e.state}" state and ${STATE_FILE} holds no state for ${e.page}` }); return; }
    if (now !== e.state) { notThisState.push(`entry ${i + 1} (${e.page}, ${e.where}) holds in the ${e.state} state; this render is ${now}`); return; }
  }
  if (!used.has(i)) stale.push({ at, detail: `matched no repeat on ${e.page} at ${WIDTHS.join(" or ")}${e.state ? ` in its own state (${e.state})` : ""}: the page no longer prints it, so the allowance is a standing permission` });
});
for (const n of notThisState) console.log(`  not required here: ${n}`);
const STALE_REMEDY = "delete the entry if the page no longer prints the repeat in any state; if it prints it only in another data state, give the entry that state (\"fallback\" or \"live\") and say so in its reason";
for (const x of stale) red({ rule: RULE, file: ALLOW_FILE, detail: `${x.at} ${x.detail}`, remedy: STALE_REMEDY });
console.log(`fact-once allowances: ${allow.length} entr${allow.length === 1 ? "y" : "ies"}, ${used.size} matched a repeat, ${notThisState.length} bound to a state these renders are not in, ${stale.length} unused or unreadable`);
const total = bare.length + missing.length + empty.size + found.size + stale.length;
if (total) {
  /* The count line is the one a truncated tail keeps, so it names the remedy of each kind of finding present. */
  const fix = [
    bare.length ? `add a page of each missing surface (${bare.join(", ")}) to ${HARNESS_LIST}` : "",
    missing.length ? RENDER_REMEDY : "",
    empty.size ? EMPTY_REMEDY : "",
    found.size ? REMEDY : "",
    stale.length ? STALE_REMEDY : "",
  ].filter(Boolean).join("; ");
  redSummary(RULE, total, fix, `${pages.length} render(s) x ${WIDTHS.length} widths`);
  process.exit(1);
}
console.log(`PASS fact-once: ${pages.length} render(s) at ${WIDTHS.join(" and ")}, each fact printed once.`);
