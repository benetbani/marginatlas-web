#!/usr/bin/env node
/**
 * verify_flag_marks.mjs , COUNTRY FLAGS ARE RECTANGLES, NEVER ROUNDED, ALWAYS
 * LEGIBLE.
 *
 * Task 6, 2026-08-27 verdicts 2, 4, 7. A flag with rounded corners reads as a
 * chip, not a national symbol; a flag rendered a few pixels tall reads as
 * noise. Both are live on the site today.
 *
 * DEVIATION FROM THE ORIGINAL TASK BRIEF, decided by the controller and
 * recorded on the project ledger. The brief specified this as a HARD gate
 * with no baseline, on the read that there were exactly two violators to
 * fix. Measured directly against the seven rendered pages before this gate
 * was written, the real count is wider than that: `countries-list` alone
 * carries 194 flags at `rounded-sm` (8px), and small flag marks under the
 * 14px legibility floor show up on the home page and inside `country-gb`'s
 * peers table, not only in the one place the brief named. A hard gate here
 * would fail the whole chain from today until every one of those is
 * repaired, and none of those repairs are this task's job, they are later
 * tasks. So this ships as a RATCHET, exactly like `verify_radius_uniform.mjs`
 * and `verify_full_width_sitewide.mjs` before it: honest counts recorded per
 * page, may only come down, never raised to make a build pass. The one hard
 * requirement carried over from the brief: the `country-gb` baseline MUST
 * reach 0 in a later task, once the legacy country page's peers table is
 * rebuilt.
 *
 * WHAT COUNTS AS A CANDIDATE. Every `img` or `svg` on the page whose `src`,
 * `class`, `aria-label`, `alt`, or `title` mentions a country flag (`/flag/i`
 * against each of those attributes, checked separately, plus a path match
 * for `img` sources under `/flags/` for services that never put the word
 * "flag" in the filename). An `svg`'s own nested `<title>` element counts
 * too, since that is where an inline SVG usually carries its accessible name
 * instead of an `aria-label`.
 *
 * THE VIOLATION TEST. Two independent reasons, either one is enough:
 *   - border-radius > 0, read as the MAX of the four computed corners so a
 *     flag rounded on only two corners still counts, checked on the flag
 *     element itself AND on its direct parent (a flag is very often an `img`
 *     inside a `span` or `div` that carries the actual rounding via
 *     `overflow: hidden`, and a check that only reads the `img`'s own style
 *     would clear every one of those while the rendered shape is still
 *     rounded).
 *   - rendered height < 14px, the floor below which a flag's own detail
 *     (stripes, a small emblem) stops being legible rather than merely small.
 *
 * Usage: node scripts/verify_flag_marks.mjs [--write-baseline] [--pages name=path,...]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { requireBrowser } from "./lib/local_only.mjs";

/* A BUILD SERVER HAS NO BROWSER. Same guard as every other rendered-design
   gate in this chain: skip loudly where chromium is not installed, run
   unchanged on the design machine. */
await requireBrowser("flag-marks", "whether every country flag on the built pages is a rectangle and legible");

const BASELINE = "scripts/flags_baseline.json";
const argv = process.argv.slice(2);

const DEFAULT_PAGES = [
  ["home", "docs/loop/artifacts/final-pages/home.html"],
  ["countries-list", "docs/loop/artifacts/final-pages/countries-list.html"],
  ["country-gb", "docs/loop/artifacts/final-pages/country-gb.html"],
  ["city-london", "docs/loop/artifacts/final-pages/city-london.html"],
  ["hood-london", "docs/loop/artifacts/final-pages/hood-london.html"],
  ["cell-london-restaurants", "docs/loop/artifacts/final-pages/cell-london-restaurants.html"],
  ["industry-restaurants", "docs/loop/artifacts/final-pages/industry-restaurants.html"],
  /* The country page being rebuilt behind a shut flag, with no baseline entry
     and none coming: `base[page] ?? 0` holds it at zero from its first render.
     The legacy country page carries 6 violations in its peers table and must
     reach 0; the page replacing it may never start above 0. */
  ["country-gb-new", "docs/loop/artifacts/final-pages/country-gb-new.html"],
];

/* --pages name=path,name2=path2 REPLACES the default set entirely. This is how
   the negative test points the gate at a scratch copy of one page without
   touching the seven-page default anywhere else in the file. */
function readPagesArg() {
  const i = argv.indexOf("--pages");
  if (i < 0) return DEFAULT_PAGES;
  return argv[i + 1].split(",").map((pair) => {
    const eq = pair.indexOf("=");
    return [pair.slice(0, eq), pair.slice(eq + 1)];
  });
}
const PAGES = readPagesArg();

/* Runs inside the page. Nothing from this scope is visible to it. */
function measure() {
  const MIN_HEIGHT = 14;

  function isVisible(el) {
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return false;
    const s = getComputedStyle(el);
    return s.display !== "none" && s.visibility !== "hidden";
  }

  /* The max of the four computed corners, not the shorthand string, so a
     flag rounded on only two corners still counts. */
  function maxCornerRadius(s) {
    const corners = [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius];
    return Math.max(...corners.map((c) => parseFloat(c) || 0));
  }

  function isFlagMark(el) {
    const flagRe = /flag/i;
    const src = el.getAttribute("src") || "";
    const attrs = [
      src,
      el.getAttribute("class") || "",
      el.getAttribute("aria-label") || "",
      el.getAttribute("alt") || "",
      el.getAttribute("title") || "",
    ];
    if (el.tagName === "SVG") {
      const t = el.querySelector("title");
      if (t) attrs.push(t.textContent || "");
    }
    return attrs.some((a) => flagRe.test(a)) || /\/flags\//i.test(src);
  }

  const candidates = [...document.querySelectorAll("img, svg")].filter((el) => isVisible(el) && isFlagMark(el));

  const results = candidates.map((el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    const ownR = Math.round(maxCornerRadius(s));
    const wrapper = el.parentElement;
    const wrapperR = wrapper ? Math.round(maxCornerRadius(getComputedStyle(wrapper))) : 0;
    const h = Math.round(r.height);
    const reasons = [];
    if (ownR > 0) reasons.push(`radius ${ownR}px on the flag itself`);
    if (wrapperR > 0) reasons.push(`radius ${wrapperR}px on its wrapper (<${wrapper.tagName.toLowerCase()}>)`);
    if (h < MIN_HEIGHT) reasons.push(`height ${h}px, below the ${MIN_HEIGHT}px legibility floor`);
    const label = el.getAttribute("alt") || el.getAttribute("aria-label") || el.getAttribute("title")
      || (el.tagName === "SVG" ? el.querySelector("title")?.textContent : "")
      || el.getAttribute("src") || "(unlabeled flag mark)";
    return { tag: el.tagName.toLowerCase(), w: Math.round(r.width), h, reasons, label: String(label).trim().slice(0, 48) };
  });

  return { total: results.length, offenders: results.filter((r) => r.reasons.length > 0) };
}

const { chromium } = await import("playwright");
const browser = await chromium.launch();
const now = {};
const report = [];
let total = 0;

for (const [name, relPath] of PAGES) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  try {
    await page.goto(pathToFileURL(resolve(relPath)).href);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(350);
    const { total: totalMarks, offenders } = await page.evaluate(measure);
    now[name] = offenders.length;
    total += offenders.length;
    report.push({ name, totalMarks, offenders });
  } finally {
    await page.close();
  }
}
await browser.close();

for (const { name, totalMarks, offenders } of report) {
  console.log(`\n  ${name}  ${totalMarks} flag mark(s) found, ${offenders.length} violation(s)`);
  offenders.forEach((o) => console.log(`     <${o.tag}>  ${o.w}x${o.h}px  ${o.reasons.join("; ")}  "${o.label}"`));
}
console.log(`\n  ${total} flag violation(s) across ${PAGES.length} page(s).\n`);

if (argv.includes("--write-baseline")) {
  writeFileSync(BASELINE, JSON.stringify(now, null, 2) + "\n");
  console.log(`  wrote ${BASELINE}\n`);
  process.exit(0);
}

let base;
try {
  base = JSON.parse(readFileSync(BASELINE, "utf8"));
} catch {
  console.error(`x verify_flag_marks: no baseline at ${BASELINE}. Create it with --write-baseline.`);
  process.exit(1);
}

const grew = Object.entries(now).filter(([k, v]) => v > (base[k] ?? 0));
if (grew.length) {
  console.log("x verify_flag_marks: flag violations GREW.");
  console.log("This baseline may only come DOWN. Do not raise it to make this pass.\n");
  grew.forEach(([k, v]) => console.log(`     ${k}: ${base[k] ?? 0} -> ${v}`));
  process.exit(1);
}
console.log(`PASS verify_flag_marks. ${total} flag violation(s), may only come DOWN from here.\n`);
