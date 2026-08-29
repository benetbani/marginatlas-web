#!/usr/bin/env node
/**
 * verify_no_phone_sideways , LAW M, MACHINE-CHECKED THE DAY IT WAS RULED.
 *
 * Founder, 2026-08-30, verbatim: "on the mobile version there should be no
 * scrolling between left and right. No scrolling left and right." A wide
 * thing RECONFIGURES at phone width; it never slides. The peers table paid
 * for this the same day (overflow-x-auto with a 560px min-width), and an
 * unenforced ruling in this project has always drifted, so the rule became
 * this gate in the same session (working method rule 4).
 *
 * WHAT IT MEASURES, in a real browser at 375x800:
 *   1. The document itself: scrollingElement.scrollWidth must not exceed the
 *      viewport (+1px of tolerance for rounding).
 *   2. Every element: computed overflow-x of auto/scroll AND
 *      scrollWidth > clientWidth + 1 is a live sideways scroller and fails.
 *      An overflow-x:auto that does not actually overflow is dormant, legal.
 *
 * SCOPE, said loudly: the five REBUILT surfaces. The three legacy pages
 * (home, countries-list, country-gb) predate the law and their blueprints are
 * TARGETs; they take this law when their rebuilds land, and until then they
 * are NOT CHECKED here rather than silently passed.
 *
 * Usage: node scripts/verify_no_phone_sideways.mjs [--pages name=path,...]
 */
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { requireBrowser } from "./lib/local_only.mjs";

await requireBrowser("no-phone-sideways", "whether anything on the rebuilt pages scrolls sideways at phone width");
const { chromium } = await import("playwright");

const argv = process.argv.slice(2);
const DEFAULT_PAGES = [
  ["city-london", "docs/loop/artifacts/final-pages/city-london.html"],
  ["hood-london", "docs/loop/artifacts/final-pages/hood-london.html"],
  ["cell-london-restaurants", "docs/loop/artifacts/final-pages/cell-london-restaurants.html"],
  ["industry-restaurants", "docs/loop/artifacts/final-pages/industry-restaurants.html"],
  ["country-gb-new", "docs/loop/artifacts/final-pages/country-gb-new.html"],
];
function readPagesArg() {
  const i = argv.indexOf("--pages");
  if (i < 0) return DEFAULT_PAGES;
  return argv[i + 1].split(",").map((pair) => {
    const eq = pair.indexOf("=");
    return [pair.slice(0, eq), pair.slice(eq + 1)];
  });
}
const PAGES = readPagesArg();

const browser = await chromium.launch();
const failures = [];
for (const [name, path] of PAGES) {
  const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
  await page.goto(pathToFileURL(resolve(path)).href, { waitUntil: "load" });
  /* Charts that draw on rAF settle first; the same wait the dossier uses. */
  await page.waitForTimeout(400);
  const result = await page.evaluate(() => {
    const out = [];
    const doc = document.scrollingElement;
    if (doc && doc.scrollWidth > window.innerWidth + 1) {
      out.push(`the PAGE itself scrolls sideways: ${doc.scrollWidth}px of content in a ${window.innerWidth}px viewport`);
    }
    for (const el of document.querySelectorAll("*")) {
      const cs = getComputedStyle(el);
      if ((cs.overflowX === "auto" || cs.overflowX === "scroll") && el.scrollWidth > el.clientWidth + 1) {
        const tag = el.tagName.toLowerCase();
        const id = el.id ? "#" + el.id : "";
        const cls = typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
        out.push(`<${tag}${id}${cls}> scrolls sideways: ${el.scrollWidth}px inside ${el.clientWidth}px`);
      }
    }
    return out;
  });
  for (const r of result) failures.push(`${name}: ${r}`);
  await page.close();
}
await browser.close();

console.log("  NOT CHECKED here, loudly: home, countries-list, country-gb (legacy; law M binds their rebuilds).");
if (failures.length) {
  console.log("x verify_no_phone_sideways: something slides left-right at 375 (law M bans it).");
  failures.forEach((f) => console.log("     " + f));
  console.log("  A wide thing reconfigures at phone width; it never scrolls sideways.");
  process.exit(1);
}
console.log(`PASS verify_no_phone_sideways. ${PAGES.length} rebuilt pages, nothing scrolls sideways at 375.`);
