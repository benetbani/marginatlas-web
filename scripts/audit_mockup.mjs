/**
 * scripts/audit_mockup.mjs , THE DESIGN LINTER, mockup driver.
 *
 * verify_lattice guards the numbers. This guards everything else: the defects
 * that only exist once a browser has laid the page out, and that four rounds of
 * human review kept missing. It is the mechanical half of the loop's judgement,
 * so an iteration can never claim "looks good" without evidence.
 *
 * The RULES now live in scripts/lib/design_linter.mjs, shared with
 * scripts/verify_rendered_design.mjs, which points the same pass at the
 * rendered React routes. This file is only the file:// driver.
 *
 *   node scripts/audit_mockup.mjs                 all pages, 1440 + 390
 *   node scripts/audit_mockup.mjs country         one page, both viewports
 *   node scripts/audit_mockup.mjs country 1440    one page, one viewport
 *   node scripts/audit_mockup.mjs --json          machine output only
 *
 * Writes E:/atlas/design/loop/audit/<page>-<w>.json and prints a ranked summary.
 * Exit 1 if any BLOCKER fires. Warnings never fail the run; they are the queue.
 */
import { chromium } from "playwright-core";
import { writeFileSync, mkdirSync } from "node:fs";

import { INPAGE, findChrome, formatReport, tally } from "./lib/design_linter.mjs";

const PAGES = ["cell", "city", "country"];
const OUT = "E:/atlas/design/loop/audit";

const argv = process.argv.slice(2);
const jsonOnly = argv.includes("--json");
const positional = argv.filter((a) => !a.startsWith("--"));
const pages = PAGES.includes(positional[0]) ? [positional[0]] : PAGES;
const widths = positional.find((a) => /^\d+$/.test(a)) ? [Number(positional.find((a) => /^\d+$/.test(a)))] : [1440, 390];

const exe = findChrome();
if (!exe) { console.error("No Chrome found. Set CHROME_EXE."); process.exit(1); }

/* ===========================================================================
   Driver
   =========================================================================== */
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: exe, headless: true });
const ALL = [];

for (const page of pages) {
  for (const width of widths) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    const tab = await ctx.newPage();
    const errors = [];
    tab.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    tab.on("console", (m) => { if (m.type() === "error" && !/_skyline\.jpeg|ERR_FILE_NOT_FOUND/.test(m.text())) errors.push(m.text()); });

    await tab.goto(`file:///E:/atlas/design/mockups/${page}.html`, { waitUntil: "load", timeout: 60000 });
    await tab.waitForTimeout(1200);
    const res = await tab.evaluate(INPAGE);
    for (const e of errors) res.findings.push({ sev: "BLOCKER", code: "JS-ERROR", section: "page", msg: e });
    await ctx.close();

    const report = { page, width, when: new Date().toISOString(), ...res };
    writeFileSync(`${OUT}/${page}-${width}.json`, JSON.stringify(report, null, 2), "utf8");
    ALL.push(report);
  }
}
await browser.close();

const total = { BLOCKER: 0, MAJOR: 0, MINOR: 0 };
for (const r of ALL) {
  const t = tally(r.findings);
  for (const k of Object.keys(total)) total[k] += t[k];
}

if (jsonOnly) {
  console.log(JSON.stringify({ total, reports: ALL }, null, 2));
} else {
  for (const r of ALL) console.log(formatReport(r, `${r.page}.html @ ${r.width}px`));
  console.log(`\n${"=".repeat(74)}`);
  console.log(`TOTAL   ${total.BLOCKER} blocker   ${total.MAJOR} major   ${total.MINOR} minor`);
  console.log(`reports ${OUT}\n`);
}
process.exit(total.BLOCKER > 0 ? 1 : 0);
