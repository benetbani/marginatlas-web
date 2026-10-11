#!/usr/bin/env node
/**
 * scripts/verify_main_landmark.mjs
 *
 * EVERY SHIPPING PAGE NEEDS A MAIN LANDMARK.
 *
 * Most routes get theirs from <SiteChrome>, which renders the masthead, a
 * <main>, and the footer. Three pages were promoted OUT of SiteChrome to carry
 * their own chrome, and nothing replaced the landmark. Measured on production
 * 2026-08-09: /world, /industries and the v2 cell page were the only shipping
 * pages emitting no <main> at all.
 *
 * It is invisible in a browser and it is not cosmetic. A screen reader user
 * navigating by landmark has no content region to jump to, and a skip link has
 * nothing to skip to.
 *
 * IT CHECKS FOR ABSENCE, AND FOR ONE NEST, NOT FOR A SECOND LANDMARK IN GENERAL, AND THE MISSING RULE IS WHY. The first version
 * also refused MORE than one landmark, to catch the nested-main mistake I nearly
 * made by turning SpineShell's wrapper into a main while three pages already
 * nest their own inside it. That rule produced exactly one finding and it was
 * false: src/app/page.tsx contains two <main> tags on MUTUALLY EXCLUSIVE return
 * branches, the flag-on spine body and the flag-off chrome, and production
 * serves exactly one. A source scan cannot see a branch.
 *
 * So it was removed rather than tuned quiet. A rule whose only output was a
 * false positive is not a rule that needs a threshold, and the duplicate-landmark
 * risk is caught properly by counting <main> in the SERVED HTML, which needs the
 * network and therefore cannot live in this chain.
 *
 * ONE NARROW NEST IS READ, BECAUSE A SCAN CAN SEE IT (truth-fixes round 3A, 2026-10-11). A page under the (site) group has no branch
 * that skips its layout: src/app/(site)/layout.tsx draws SiteChrome around whatever the page returns, and SiteChrome's <main> is the
 * page's landmark. So a <main> written in such a page is a second landmark inside the first, on every request, and the scan reds on
 * it. src/app/(site)/margin-index/page.tsx wrote one until that day and this gate could not see it. The rule stops at the group: a page
 * elsewhere that renders SiteChrome and writes a <main> of its own may do so on a branch the other never takes (src/app/page.tsx is
 * the case above), which a source scan cannot tell apart.
 *
 * STATED BLIND SPOT: this reads source, and it reads the PAGE FILE ONLY: code() is
 * given each page.tsx and nothing the page imports, a layout included. So a <main>
 * written in a component, one level down or three, is not seen. A page outside
 * the (site) group that draws its landmark in a view component reads as having
 * none (a red to answer in the page, or to exempt below with its reason), and a
 * page under (site) whose component writes a second <main> passes unseen. Nothing
 * hides one today: SiteChrome's is the only <main> a component under src/components
 * writes (git grep, 2026-10-12). The production check that found this in the first
 * place is the stronger instrument and it needs the network, which this chain must
 * never require.
 * TWO NAMES ARE READ BY PATH FROM THE ROOT, NEVER BY A BARE FOLDER NAME (truth-fixes
 * round 3A2, the review's M4): the (site) group is src/app/(site)/, so a folder that
 * merely ends in (site) is not it, and src/app/dev is the one folder skipped, so a
 * page in a folder named dev anywhere else is read like any other.
 *
 *   node scripts/verify_main_landmark.mjs
 */
import fs from "node:fs";
import path from "node:path";

const APP = "src/app";
/** The group whose layout draws SiteChrome, and the one folder of routes that never ship: both by path from the root. */
const SITE_GROUP = "src/app/(site)/";
const DEV = "src/app/dev";

/* Pages that legitimately render no main landmark, each with its reason.
   Do NOT add a row here to silence a failure: the point of the list is that
   every entry is a decision somebody defended. */
const EXEMPT = {
  "src/app/embed/[country]/[geo]/[industry]/page.tsx":
    "an embed rendered inside someone else's document, which owns its own landmarks",
  "src/app/_design/page.tsx": "_design is a Next private folder, not routable",
  "src/app/_design/monetized/page.tsx": "same private catalog",
  "src/app/_design/v2-review/page.tsx": "same private catalog",
  "src/app/[country]/[geo]/[industry]/page.tsx":
    "KNOWN GAP, not a decision. The v2 branch renders CellPage inside SpineShell, and " +
    "three pages already nest their own main in that shell, so the landmark has to go " +
    "inside CellPage rather than the shell. That is the ratified v2 design surface and " +
    "wants its own change, not a drive-by. Remove this line when it lands.",
};

/** Everything that is chrome rather than a page body. */
const PROVIDERS = ["SiteChrome"];

function code(file) {
  return fs
    .readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/(^|[^:'"\\])\/\/.*$/gm, "$1");
}

function pages(dir = APP, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name).replace(/\\/g, "/");
    if (e.isDirectory()) {
      if (p !== DEV) pages(p, out);
    } else if (e.name === "page.tsx") out.push(p);
  }
  return out;
}

let failed = 0;
const missing = [];
const nested = [];
let checked = 0;

for (const page of pages()) {
  if (page in EXEMPT) continue;
  const src = code(page);
  checked++;
  const inGroup = page.startsWith(SITE_GROUP);
  const rendersProvider = PROVIDERS.some((p) => new RegExp(`<${p}[\\s>]`).test(src));
  const own = (src.match(/<main[\s>]/g) || []).length;
  if (own === 0 && !inGroup && !rendersProvider) missing.push(page);
  /* Under (site) the layout draws SiteChrome, whose <main> is the landmark: a page's own <main> is a second one, nested inside it. */
  if (own > 0 && inGroup) nested.push(page);
}

console.log(`main-landmark: ${checked} shipping page(s) checked, ${Object.keys(EXEMPT).length} exempt by name`);

if (missing.length) {
  failed++;
  console.error(`\nx ${missing.length} page(s) render NO main landmark:\n`);
  for (const p of missing) console.error(`  ${p}`);
  console.error(
    `\n  Wrap the page body in <main>, closing before the footer. A screen reader\n` +
      `  navigating by landmark has nothing to jump to without it.`,
  );
}

if (nested.length) {
  failed++;
  console.error(`\nx ${nested.length} page(s) under the (site) group write a <main> of their own, nested inside the one SiteChrome draws:\n`);
  for (const p of nested) console.error(`  ${p}`);
  console.error(
    `\n  Make the page's outer <main> a <div> with the same classes. The (site) layout draws SiteChrome, whose\n` +
      `  <main> is the page's one landmark, and a second one inside it splits what a screen reader jumps to.`,
  );
}

if (failed > 0) {
  console.error(`main-landmark: ${failed} failure(s)`);
  process.exit(1);
}
console.log("main-landmark: every shipping page has one, and none under (site) writes a second");
process.exit(0);
