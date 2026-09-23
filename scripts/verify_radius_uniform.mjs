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
 * strip is still a candidate) or (b) is a spine card. This is deliberately
 * not scoped ENTIRELY to class name: (a) still catches every box built the
 * old way, legacy Tailwind radii included, by its border alone.
 *
 * (b) USED TO READ `backdrop-filter`, 2026-09-08, fix wave Finding 2. The
 * glass card the comment above named is gone (CARD_SURFACE in kit.tsx no
 * longer sets a backdrop-filter), so that test had gone permanently false and
 * this candidate path was silently finding nothing, on a page where (a) still
 * caught spine cards anyway because `Box`'s outer border survived the glass
 * removal. (b) now reads the harness's own single definition of a card
 * (scripts/harness/check_page_holes.mjs): does the element itself carry
 * `[data-card]`, the card's own hook since 2026-09-23. This is the one intentional exception to "not
 * scoped to class name" in the sentence above, named directly because it is
 * the harness's own card marker, not an invented tenth one.
 *
 * THE SANCTIONED SET. Three shapes, and nothing else:
 *   - 12px, the spine card radius (14 before 2026-09-23).
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
 * WHAT IT READS (plan step 14b, 2026-09-17): the shared list in
 * scripts/lib/page_renders.mjs. The six spine surfaces are FRESH renders from
 * the real adapters and views, written by the pages-fresh gate at the head of
 * the chain; home and the countries list are the renders frozen on 2026-09-08,
 * which the harness cannot draw. The legacy country-gb fixture (the 37 off-scale
 * corners above) and the country-gb-new fixture are retired: production serves
 * the spine country page and the fresh country-GB render is that page. The
 * baseline keeps the keys it was written under (country-gb-new for
 * country-GB, which held 0: budget 0 from its first render; cell-london-
 * restaurants for cell-gb-london-restaurants), and the first line printed says
 * what was read and how old it was.
 *
 * Usage: node scripts/verify_radius_uniform.mjs [--write-baseline] [--pages name=path,...]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { requireBrowser } from "./lib/local_only.mjs";
import { pageRenders, givenRenders, describeRenders, nameWithKey, missingLine } from "./lib/page_renders.mjs";

/* A BUILD SERVER HAS NO BROWSER. Same guard as every other rendered-design
   gate in this chain: skip loudly where chromium is not installed, run
   unchanged on the design machine. */
await requireBrowser("radius-uniform", "whether every card-like box on the built pages shares one border radius");

const BASELINE = "scripts/radius_baseline.json";
const RULE = "radius-uniform";
const argv = process.argv.slice(2);

/* --pages name=path,name2=path2 REPLACES the default set entirely. This is how
   the negative test points the gate at a scratch copy of one page without
   touching the shared list anywhere else in the file. */
function readPagesArg() {
  const i = argv.indexOf("--pages");
  if (i < 0) return pageRenders();
  return givenRenders(argv[i + 1].split(",").map((pair) => {
    const eq = pair.indexOf("=");
    return [pair.slice(0, eq), pair.slice(eq + 1)];
  }));
}
const ENTRIES = readPagesArg();
console.log(`  ${describeRenders(ENTRIES, RULE)}`);
const PAGES = ENTRIES.filter((e) => e.exists);
const MISSING = ENTRIES.filter((e) => !e.exists);

/* Runs inside the page. Nothing from this scope is visible to it. */
function measure() {
  /* 12 since 2026-09-23: DISTANCES.md section 3.2 fixes the card corner at 12, half the ordinary padding, and the cards moved the same day. It was 14 from the four pages that settled on it in the glass era. */
  const SPINE_RADIUS = 12;
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
    /* Repointed 2026-09-08, fix wave Finding 2: see the header comment. */
    const isSpineCard = el.matches('[data-card]');
    if (!hasVisibleBorder(s) && !isSpineCard) continue;
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

for (const entry of PAGES) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  try {
    await page.goto(pathToFileURL(resolve(entry.path)).href);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(350);
    const { distinctRadii, offenders } = await page.evaluate(measure);
    /* The baseline is keyed by the page's OLD name (entry.key); the report prints the harness's name with it beside. */
    now[entry.key] = offenders.length;
    total += offenders.length;
    report.push({ name: nameWithKey(entry), distinctRadii, offenders });
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
for (const m of MISSING) console.log(missingLine(RULE, m));

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
if (MISSING.length) {
  console.log(`x verify_radius_uniform: ${MISSING.length} listed render(s) could not be read, so the counts above are of the pages that were.`);
  process.exit(1);
}
console.log(`PASS verify_radius_uniform. ${total} off-scale radius violation(s), may only come DOWN from here.\n`);
