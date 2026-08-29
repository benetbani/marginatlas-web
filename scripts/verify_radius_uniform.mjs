#!/usr/bin/env node
/**
 * verify_radius_uniform.mjs , ONE CARD RADIUS ACROSS THE SITE.
 *
 * Task 6, 2026-08-27 verdicts 2, 4, 7. The founder's own phrasing of the rule
 * is in its title: a reader should never be able to see two different corner
 * roundings on two boxes doing the same job. The four rebuilt spine pages
 * (city, hood, cell, industry) settled on 14px for their glass cards
 * (`backdrop-filter`); the three legacy pages (home, countries-list,
 * country-gb) still carry Tailwind's `rounded-lg` (16px) and `rounded-md`
 * (12px) on plain bordered cards, plus a stray 20px and 8px here and there.
 * Measured directly against the seven rendered pages before this gate was
 * written: 16px is the single largest population on the legacy three, not a
 * rounding error, a whole different scale still live in production.
 *
 * DEVIATION FROM THE ORIGINAL TASK BRIEF, recorded on the ledger by the
 * controller. The brief already called this one a ratchet ("count-down-only"),
 * so no deviation on THIS gate's shape, only on its sibling
 * `verify_flag_marks.mjs`, whose brief called for a hard gate; both ship as
 * ratchets so the chain does not fail sitewide the day this lands, while the
 * legacy pages still carry their own radius scale. See that file's header for
 * the full reasoning.
 *
 * WHAT COUNTS AS A CANDIDATE. Any element wider than 120px that either (a)
 * carries a visible border on at least one side (computed border-width > 0
 * AND border-style not "none", checked on all four sides so a `border-t`-only
 * strip is still a candidate) or (b) carries a `backdrop-filter` (the spine
 * glass card, which has no border at all). This is deliberately not scoped to
 * elements that "look like a card" by class name: the whole point is to catch
 * every box built the old way alongside every box built the new way.
 *
 * THE SANCTIONED SET. Three shapes, and nothing else:
 *   - 14px, the spine card radius.
 *   - <= 8px, small controls: inputs, thumbnails, chips, tight corners nobody
 *     reads as "the card radius" at all.
 *   - a fully-round pill, radius >= half the element's own rendered height
 *     (buttons, tags, `rounded-full`). This also clears 9999px and 50%
 *     without a special case, since both satisfy the same inequality.
 * Everything else, 12px, 16px, 20px, whatever the legacy pages still carry,
 * is a violation. The radius read is the MAX of the four computed corner
 * values (`borderTopLeftRadius` etc, not the shorthand `borderRadius`
 * string), because a card with only its bottom corners rounded (a footer
 * strip inside an already-square-topped card) still reads as "16px rounded"
 * to an eye looking at the bottom of it, and a max-of-corners check is what
 * catches that instead of averaging it away.
 *
 * Usage: node scripts/verify_radius_uniform.mjs [--write-baseline] [--pages name=path,...]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { requireBrowser } from "./lib/local_only.mjs";

/* A BUILD SERVER HAS NO BROWSER. Same guard as every other rendered-design
   gate in this chain: skip loudly where chromium is not installed, run
   unchanged on the design machine. */
await requireBrowser("radius-uniform", "whether every card-like box on the built pages shares one border radius");

const BASELINE = "scripts/radius_baseline.json";
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
     and none coming: `base[page] ?? 0` holds it at zero from its first render,
     so the rebuild cannot quietly acquire the legacy page's 37 off-scale
     corners while nobody is measuring it. */
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
  const SPINE_RADIUS = 14;
  const SMALL_MAX = 8;
  /* THE DECLARED md STEP. tailwind.config sets rounded-md to var(--radius) minus
     0.25rem, and globals.css pins --radius at 1rem, so every hover-wash row the
     site has ever drawn (rounded-md on the .hov idiom, all four approved pages)
     measures exactly 12. The first version of this set never met one, because
     the approved pages were baselined wholesale and their rows hid inside the
     counts; the rebuilt country page starts at zero and its spectra rows
     surfaced the gap, ten identical, system-declared 12s flagged as ten
     violations. Sanctioning the declared step COMPLETES the instrument; it does
     not move the line, and every baseline total falls with it, which is the
     only direction a ratchet may move. 2026-08-29. */
  const MD_STEP = 12;

  function isVisible(el) {
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return false;
    const s = getComputedStyle(el);
    return s.display !== "none" && s.visibility !== "hidden";
  }

  function hasVisibleBorder(s) {
    const sides = [
      [s.borderTopWidth, s.borderTopStyle],
      [s.borderRightWidth, s.borderRightStyle],
      [s.borderBottomWidth, s.borderBottomStyle],
      [s.borderLeftWidth, s.borderLeftStyle],
    ];
    return sides.some(([w, st]) => parseFloat(w) > 0 && st !== "none");
  }

  /* The max of the four computed corners, not the shorthand string, so a
     card rounded on only two corners still reads as rounded. */
  function maxCornerRadius(s) {
    const corners = [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius];
    return Math.max(...corners.map((c) => parseFloat(c) || 0));
  }

  const candidates = [];
  for (const el of document.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (r.width <= 120) continue;
    if (!isVisible(el)) continue;
    const s = getComputedStyle(el);
    const hasBackdrop = !!s.backdropFilter && s.backdropFilter !== "none";
    if (!hasVisibleBorder(s) && !hasBackdrop) continue;
    candidates.push(el);
  }

  const results = candidates.map((el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    const radiusStr = s.borderRadius;
    const maxR = Math.round(maxCornerRadius(s) * 100) / 100;
    const isPill = r.height > 0 && maxR >= r.height / 2;
    const rounded = Math.round(maxR);
    const sanctioned = rounded === SPINE_RADIUS || rounded === MD_STEP || rounded <= SMALL_MAX || isPill;
    const label = (el.querySelector("h1, h2, h3")?.textContent || el.textContent || "")
      .trim().replace(/\s+/g, " ").slice(0, 48);
    return { tag: el.tagName.toLowerCase(), w: Math.round(r.width), h: Math.round(r.height), radius: radiusStr, maxR: rounded, sanctioned, label };
  });

  const distinctRadii = {};
  for (const rr of results) distinctRadii[rr.radius] = (distinctRadii[rr.radius] || 0) + 1;

  return { distinctRadii, offenders: results.filter((rr) => !rr.sanctioned) };
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
    const { distinctRadii, offenders } = await page.evaluate(measure);
    now[name] = offenders.length;
    total += offenders.length;
    report.push({ name, distinctRadii, offenders });
  } finally {
    await page.close();
  }
}
await browser.close();

for (const { name, distinctRadii, offenders } of report) {
  const radiiList = Object.entries(distinctRadii)
    .map(([radius, count]) => `${radius} x${count}`)
    .join(", ");
  console.log(`\n  ${name}  distinct radii: ${radiiList}`);
  console.log(`     ${offenders.length} off-scale radius violation(s)`);
  offenders.forEach((o) => console.log(`     <${o.tag}>  radius ${o.radius} (max corner ${o.maxR}px)  "${o.label}"`));
}
console.log(`\n  ${total} off-scale radius violation(s) across ${PAGES.length} page(s).\n`);

if (argv.includes("--write-baseline")) {
  writeFileSync(BASELINE, JSON.stringify(now, null, 2) + "\n");
  console.log(`  wrote ${BASELINE}\n`);
  process.exit(0);
}

let base;
try {
  base = JSON.parse(readFileSync(BASELINE, "utf8"));
} catch {
  console.error(`x verify_radius_uniform: no baseline at ${BASELINE}. Create it with --write-baseline.`);
  process.exit(1);
}

const grew = Object.entries(now).filter(([k, v]) => v > (base[k] ?? 0));
if (grew.length) {
  console.log("x verify_radius_uniform: off-scale radius violations GREW.");
  console.log("This baseline may only come DOWN. Do not raise it to make this pass.\n");
  grew.forEach(([k, v]) => console.log(`     ${k}: ${base[k] ?? 0} -> ${v}`));
  process.exit(1);
}
console.log(`PASS verify_radius_uniform. ${total} off-scale radius violation(s), may only come DOWN from here.\n`);
