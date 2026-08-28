#!/usr/bin/env node
/**
 * verify_full_width_sitewide , D1, EVERY SURFACE A READER CAN WALK, NOT ONLY THE
 * FOUR REFORMED PAGE TYPES.
 *
 * The founder, 2026-08-27, walking the live site: "it says what a typical
 * business brings in state by state... it covers the full width, which is a
 * catastrophe. I've told you multiple times about this rule, and you haven't
 * respected it." On the live homepage. Then, on the live UK country page: "this
 * hexagon... occupies the full width... Then, again, another section with the
 * full width. Then another... another one, another one." His own gloss on the
 * rule: "The ban is site-wide, every live surface, not only the four reformed
 * page types."
 *
 * `verify_section_bands` already held this line for the four rebuilt spine
 * pages. This gate is that same rule read across all seven pages a visitor can
 * actually walk, home, the countries list and the live UK country page included,
 * and it carries the exemptions the founder named in the same conversation that
 * `section-bands` was tightened past: a hero, a closing hand-off, a sanctioned
 * wide table, and a grid of distinct blocks. His own example: "the same
 * benchmarks block by block... six neighborhoods. That's acceptable because
 * those are six different pieces."
 *
 * WHAT COUNTS AS A CANDIDATE. The four rebuilt pages carry glass cards
 * (backdrop-filter) as their section unit, exactly as `section-bands` and the
 * critique dossier already read them. The three legacy pages carry no such
 * markup, so their candidates are the same landmark walk the dossier uses
 * (`section`/`article` bands, with nested-landmark wrappers unwrapped, plus
 * top-level DIV bands with no semantic tag at all, e.g. the newsletter strip
 * between main and the footer). `<nav>` is dropped everywhere it appears
 * (wayfinding, never a reading); `<header>`/`<footer>` are dropped only where
 * they ARE the site's own persistent chrome (the elements sitting directly on
 * `<body>`), because this codebase also uses `<header>` for a page's own intro
 * block (countries-list: "Every country with a page") and that block is a real
 * candidate, not chrome, just because of its tag.
 *
 * THE CONTENT COLUMN is the content-box width of the nearest common ancestor of
 * the real section-level candidates (never the miscellaneous DIV bands like the
 * newsletter strip, which are checked for violations but must not set the scale
 * a page is judged against). On the four rebuilt pages that ancestor is `<main>`
 * and comes out to 1072px at 1280. On the UK country page it is the CONTENT
 * column of the two-up flex row that also holds the sticky contents rail, 812px,
 * not main's own 1072px, because the rail permanently eats into what a section
 * can actually reach. Measuring against main's raw width there would have
 * cleared every real violation on the page instead of catching seventeen of
 * them. Falls back to `document.body`'s own content box when a page has no
 * candidates at all.
 *
 * THE COLUMN IS SET BY CONSENSUS, NOT BY THE EXTREME. The paragraph above names
 * the ancestor and the floor as the two things that fix the column, and a first
 * version fed both of them every sectionCandidate with no vote-counting at all,
 * so one outlier could set the column alone. Demonstrated on country-gb: plant
 * one plain full-width `<section>` as a direct child of `<main>`, a sibling of
 * the two-up flex row, so it sits outside the real 812px column entirely.
 * `nearestCommonAncestor` now has to reach past the flex row to cover it too,
 * which is `<main>` itself, and the safety floor (below) then maxes up to the
 * plant's own width, 1072px. `colW` rose from 812 to 1072, all thirteen real
 * violations measured under 92% of the new denominator, and the run printed 2
 * violations and PASSED, silently un-catching every one of them, worse than
 * doing nothing because it read as improvement. The fix: a candidate's width
 * only gets a vote in setting the column if another candidate agrees with it,
 * within 5%. The consensus width is the widest candidate width with at least
 * one such companion, or the median width when nothing on the page agrees with
 * anything (too few candidates for a "typical" one to exist). A candidate wider
 * than consensus past that same 5% tolerance is dropped from the ancestor walk
 * and the floor, never from the page: it is still measured against the
 * consensus column, which is what turns it into a violation instead of a mask.
 *
 * THE WRAPPER EXEMPTION IS AN INK MEASUREMENT, NOT A BOUNDING BOX. "A full-width
 * section tag with a centered 800px column inside is fine" only has meaning if
 * something measures the 800px column and not the tag. A first version measured
 * the candidate's own background and border as ink, and a plain `bg-white`
 * newsletter strip read as full-width content on every legacy page, which
 * masked every other violation on those pages by inflating the content column
 * itself (that strip was one of the widest things on the page, once inside the
 * denominator its size was hiding everyone narrower than it). The element being
 * judged is never scanned for its own paint, only its descendants, so a
 * decorative background never counts as the reading drawn inside it.
 *
 * THE GRID EXEMPTION IS CHECKED ONE LEVEL DOWN AS WELL AS AT THE CANDIDATE
 * ITSELF. The founder's own calibration case, "the same benchmarks, block by
 * block", is a `<section>` whose direct children are a label (`h2`) and a grid
 * DIV holding six cards; the section itself is `display:block`, never grid, so
 * checking only the candidate's own computed style missed the one case he named
 * as acceptable by example.
 *
 * BLIND SPOT: a candidate whose ink narrowly straddles the 92% line (one UK
 * section measured 746px against a 747px cutoff) can flip a pixel either way
 * with font hinting or a sub-pixel layout change on a different machine. That is
 * a property of measuring a continuous quantity against a hard cutoff, not a
 * bug; a ratchet absorbs a flip of one in either direction without drama.
 *
 * Usage: node scripts/verify_full_width_sitewide.mjs [--write-baseline] [--pages name=path,...]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { requireBrowser } from "./lib/local_only.mjs";

/* A BUILD SERVER HAS NO BROWSER. This gate photographs real pages, so it cannot
   run where chromium is not installed, and trying killed a production deploy on
   2026-08-27. It skips loudly there and runs unchanged on the design machine. */
await requireBrowser("full-width-sitewide", "whether any single reading spans the whole content column");

const BASELINE = "scripts/fullwidth_baseline.json";
const argv = process.argv.slice(2);

const DEFAULT_PAGES = [
  ["home", "docs/loop/artifacts/final-pages/home.html"],
  ["countries-list", "docs/loop/artifacts/final-pages/countries-list.html"],
  ["country-gb", "docs/loop/artifacts/final-pages/country-gb.html"],
  ["city-london", "docs/loop/artifacts/final-pages/city-london.html"],
  ["hood-london", "docs/loop/artifacts/final-pages/hood-london.html"],
  ["cell-london-restaurants", "docs/loop/artifacts/final-pages/cell-london-restaurants.html"],
  ["industry-restaurants", "docs/loop/artifacts/final-pages/industry-restaurants.html"],
  /* The country page being rebuilt behind a shut flag. It holds NO baseline
     entry and is not getting one: `base[page] ?? 0` makes its budget zero, so
     the rebuilt page has to be clean from its first render rather than
     inheriting a legacy page's allowance. That is the whole point of reading it
     here from the first section onward instead of after the last. */
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
  const THRESH = 0.92;

  function isVisible(el) {
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return false;
    const s = getComputedStyle(el);
    return s.display !== "none" && s.visibility !== "hidden";
  }
  function inDead(el) {
    const d = el.closest("details");
    return !!d && !d.open && !el.closest("summary");
  }

  /* THE TRUE CONTENT WIDTH OF A BLOCK: the union of every leaf inside it that
     actually draws something, the same "drawn" test verify_gathered_emptiness.mjs
     uses. The candidate's OWN background and border are never counted, only its
     descendants', so a wrapper's own paint can never masquerade as the reading
     drawn inside it. */
  function inkBox(el) {
    let minL = Infinity, maxR = -Infinity, any = false;
    const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (ownText) {
      const b = el.getBoundingClientRect();
      if (b.width > 0 && b.height > 0) { any = true; minL = Math.min(minL, b.left); maxR = Math.max(maxR, b.right); }
    }
    for (const e of el.querySelectorAll("*")) {
      if (inDead(e)) continue;
      const s = getComputedStyle(e);
      if (s.display === "none" || s.visibility === "hidden") continue;
      const drawn =
        [...e.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim()) ||
        e.tagName === "IMG" || e.tagName === "SVG" || e.tagName === "CANVAS" ||
        s.backgroundColor !== "rgba(0, 0, 0, 0)" ||
        parseFloat(s.borderTopWidth) > 0 || parseFloat(s.borderLeftWidth) > 0 ||
        parseFloat(s.borderBottomWidth) > 0 || parseFloat(s.borderRightWidth) > 0;
      if (!drawn) continue;
      const b = e.getBoundingClientRect();
      if (b.width <= 0 || b.height <= 0) continue;
      any = true;
      if (b.left < minL) minL = b.left;
      if (b.right > maxR) maxR = b.right;
    }
    return any ? maxR - minL : 0;
  }

  function contentBoxWidth(el) {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight);
  }

  /* Walks up from the first element until it finds one that contains every
     other candidate. Always resolves: documentElement contains everything. */
  function nearestCommonAncestor(elements) {
    if (!elements.length) return null;
    let e = elements[0];
    while (e) {
      if (elements.every((el) => e.contains(el))) return e;
      e = e.parentElement;
    }
    return null;
  }

  /* THE SIX NEIGHBORHOODS EXEMPTION. Checked at the candidate itself AND one
     level down, because the founder's own calibration case is a label (h2)
     sitting beside, not inside, the grid it introduces. "Comparable size" is
     read generously (narrowest child at least 40% of the widest) so a grid
     whose last row has one short leftover card still qualifies. */
  function looksLikeGrid(node) {
    const s = getComputedStyle(node);
    const isFlexRow = (s.display === "flex" || s.display === "inline-flex") && s.flexDirection === "row";
    const isGrid = s.display === "grid" || s.display === "inline-grid";
    if (!isFlexRow && !isGrid) return false;
    const kids = [...node.children].filter(isVisible);
    if (kids.length < 3) return false;
    const widths = kids.map((k) => k.getBoundingClientRect().width);
    const max = Math.max(...widths), min = Math.min(...widths);
    return min >= max * 0.4;
  }
  function isGridExempt(el) {
    if (looksLikeGrid(el)) return true;
    for (const child of el.children) {
      if (isVisible(child) && looksLikeGrid(child)) return true;
    }
    return false;
  }

  const isDecor = (el) => el.getAttribute("aria-hidden") === "true";
  const isBand = (el) => el.getBoundingClientRect().width > 20 && el.getBoundingClientRect().height > 20;

  /* THE LEGACY THREE HAVE NO SPINE MARKUP, same tell build_section_dossier.mjs
     uses: they wrap in <SiteChrome>, header and footer both present. */
  const isLegacy = !!document.querySelector("header") && !!document.querySelector("footer");
  let sectionCandidates = [];
  let extraCandidates = [];

  if (isLegacy) {
    const globalChromeRoots = [...document.body.children].filter((e) => ["HEADER", "FOOTER"].includes(e.tagName));
    const inGlobalChrome = (el) => globalChromeRoots.some((r) => r.contains(el));

    /* NAV is dropped wherever it sits, top level or nested. A breadcrumb trail
       and an in-page contents rail are wayfinding wherever they appear, and
       letting a NAV nested inside the global header through once dragged the
       common ancestor all the way out to <body>, because that nav lived outside
       <main> entirely. HEADER and FOOTER are dropped only when they ARE the
       site's own persistent chrome (sitting directly on body); a page-authored
       <header> nested in main (countries-list: "Every country with a page") is
       real content and is not swept out just because of its tag. */
    const landmarks = [...document.querySelectorAll("header, footer, nav, section, article")]
      .filter((el) => !isDecor(el) && isBand(el) && el.tagName !== "NAV" && !inGlobalChrome(el));
    const landmarkChildren = (el) => landmarks.filter((o) => o !== el && el.contains(o)
      && !landmarks.some((m) => m !== el && m !== o && el.contains(m) && m.contains(o)));
    const bands = [];
    const visit = (el) => {
      const kids = landmarkChildren(el);
      const ownH = el.getBoundingClientRect().height;
      const kidsH = kids.reduce((a, k) => a + k.getBoundingClientRect().height, 0);
      if (kids.length >= 2 && kidsH >= ownH * 0.75) { kids.forEach(visit); return; }
      bands.push(el);
    };
    landmarks.filter((el) => !landmarks.some((o) => o !== el && o.contains(el))).forEach(visit);

    /* A visible band with no semantic tag at all, e.g. the newsletter strip
       between main and the footer. These are real candidates to CHECK, but they
       must never set the content column: a one-off promo strip that happens to
       be wide is not "what a section on this page is allowed to reach". */
    const covered = (el) => landmarks.some((l) => el.contains(l) || l.contains(el)) || inGlobalChrome(el);
    const divBands = [];
    for (const root of [document.body, document.querySelector("main")]) {
      if (!root) continue;
      for (const el of [...root.children]) {
        if (el.tagName !== "DIV" || isDecor(el) || !isBand(el) || covered(el) || divBands.includes(el)) continue;
        divBands.push(el);
      }
    }
    sectionCandidates = bands;
    extraCandidates = divBands;
  } else {
    const cards = [...document.querySelectorAll("div")].filter((e) => getComputedStyle(e).backdropFilter !== "none");
    sectionCandidates = cards.filter((c) => !cards.some((o) => o !== c && o.contains(c)));
  }

  /* CONSENSUS WIDTH: the widest candidate width that at least one other
     candidate agrees with (within 5%), or the median width when nothing on the
     page agrees with anything. Read the file comment above this function's
     call site for the demonstration that made this necessary. */
  function consensusWidth(candidates) {
    const TOL = 0.05;
    const widths = candidates.map((c) => c.getBoundingClientRect().width).filter((w) => w > 0);
    if (!widths.length) return 0;
    const shared = widths.filter((w) => widths.filter((o) => Math.abs(o - w) <= w * TOL).length >= 2);
    if (shared.length) return Math.max(...shared);
    const sorted = [...widths].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }
  const consensus = consensusWidth(sectionCandidates);
  const isOutlier = (c) => consensus > 0 && c.getBoundingClientRect().width > consensus * 1.05;
  const coreCandidates = sectionCandidates.filter((c) => !isOutlier(c));
  /* An empty core (every candidate somehow reads as an outlier of the others,
     which the tolerance above should never actually produce) falls back to the
     full set rather than losing the ancestor and floor altogether. */
  const ancestorPool = coreCandidates.length ? coreCandidates : sectionCandidates;

  const ancestor = nearestCommonAncestor(ancestorPool);
  const bodyFallback = () => {
    const b = document.body, s = getComputedStyle(b);
    return b.getBoundingClientRect().width - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight);
  };
  let colW = ancestor ? contentBoxWidth(ancestor) : bodyFallback();
  /* SAFETY FLOOR: the column can never be narrower than the widest CONSENSUS
     content it contains. A child wider than its own ancestor's content box
     should be impossible in normal flow, but nothing here depends on that
     holding. An outlier never raises this floor: letting it do so is exactly
     what made the outlier disappear instead of getting caught, per the
     demonstration above. */
  for (const c of ancestorPool) colW = Math.max(colW, c.getBoundingClientRect().width);

  function evaluate(c) {
    const r = c.getBoundingClientRect();
    const ratio = colW > 0 ? r.width / colW : 0;
    let reason = null, fail = false;
    if (ratio >= THRESH) {
      if (c.closest("[data-hero], [data-terminus], [data-wide-table]")) reason = "sanctioned (data-hero/terminus/wide-table)";
      else if (isGridExempt(c)) reason = "grid of distinct blocks";
      else {
        const ink = inkBox(c);
        if (ink < colW * THRESH) reason = `wrapper, true content only ${Math.round(ink)}px`;
        else fail = true;
      }
    }
    const label = (c.querySelector("h1, h2, h3")?.textContent || c.textContent || "")
      .trim().replace(/\s+/g, " ").slice(0, 48);
    return { tag: c.tagName.toLowerCase(), w: Math.round(r.width), pct: Math.round(ratio * 100), fail, reason, label };
  }

  const all = [...sectionCandidates.map(evaluate), ...extraCandidates.map(evaluate)];
  return { colW: Math.round(colW), sections: all };
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
    const { colW, sections } = await page.evaluate(measure);
    const offenders = sections.filter((s) => s.fail);
    now[name] = offenders.length;
    total += offenders.length;
    report.push({ name, colW, offenders });
  } finally {
    await page.close();
  }
}
await browser.close();

for (const { name, colW, offenders } of report) {
  console.log(`\n  ${name}  (content column ${colW}px at 1280)  ${offenders.length} full-width violation(s)`);
  offenders.forEach((o) => console.log(`     ${o.pct}%  ${String(o.w).padStart(4)}px  <${o.tag}>  "${o.label}"`));
}
console.log(`\n  ${total} full-width violation(s) across ${PAGES.length} page(s).\n`);

if (argv.includes("--write-baseline")) {
  writeFileSync(BASELINE, JSON.stringify(now, null, 2) + "\n");
  console.log(`  wrote ${BASELINE}\n`);
  process.exit(0);
}

let base;
try {
  base = JSON.parse(readFileSync(BASELINE, "utf8"));
} catch {
  console.error(`x verify_full_width_sitewide: no baseline at ${BASELINE}. Create it with --write-baseline.`);
  process.exit(1);
}

const grew = Object.entries(now).filter(([k, v]) => v > (base[k] ?? 0));
if (grew.length) {
  console.log("x verify_full_width_sitewide: full-width violations GREW.");
  console.log("This baseline may only come DOWN. Do not raise it to make this pass.\n");
  grew.forEach(([k, v]) => console.log(`     ${k}: ${base[k] ?? 0} -> ${v}`));
  process.exit(1);
}
console.log(`PASS verify_full_width_sitewide. ${total} full-width violation(s), may only come DOWN from here.\n`);
