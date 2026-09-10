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
 * THE VIOLATION TEST. Five independent reasons, any one is enough; the first
 * two are the original test, the next is the 2026-09-07 floor raise described
 * below, and the last two are the 2026-09-11 same-width law:
 *   - border-radius > 0, read as the MAX of the four computed corners so a
 *     flag rounded on only two corners still counts, checked on the flag
 *     element itself AND on a direct parent that is actually the flag's FRAME
 *     (a flag is very often an `img` inside a `span` or `div` that carries the
 *     actual rounding via `overflow: hidden`, and a check that only reads the
 *     `img`'s own style would clear every one of those while the rendered
 *     shape is still rounded).
 *   - rendered height not one of `--flag-hero` / `--flag-row`, the two rungs
 *     `CountryFlag.tsx` sizes from; a legibility floor alone could not tell a
 *     flag obeying that law from one merely tall enough.
 *   - rendered width not one of `--flag-hero-w` / `--flag-row-w`, the two width
 *     rungs, read sideways exactly as the height is read.
 *   - `object-fit` not `contain` (or `scale-down`), which is what proves the
 *     flag is FITTED into that one box rather than stretched or cropped to it.
 *
 * WHAT COUNTS AS A FRAME, narrowed 2026-09-02 against the two real cases on
 * this site rather than by argument. The original clause read the radius of
 * ANY direct parent, and that made the gate unable to see its own fix. On the
 * countries list every flag's direct parent is the country TILE: a 195x63
 * link at `rounded-lg`, `overflow: visible`, whose nearest rounded corner sits
 * 150px from the flag's right edge. It cannot clip the flag, and while it was
 * counted, unrounding all 194 flags would have moved the number 194 to 194.
 * A ratchet that cannot come down when the fault is repaired stops recording
 * the fault and starts recording the instrument. Contrast the genuine frame,
 * `country-gb`'s `.eng-neigh__flag`: a 17x11 span around a 15x9 flag,
 * `overflow: hidden`, radius 2px, whose corner IS the flag's corner.
 * So a parent's radius counts only when the parent either CLIPS (computed
 * overflow hidden / clip / scroll / auto on either axis) or FITS, its border
 * box within 2px of the flag's on all four sides. Both of those describe the
 * frame the original clause was written for; neither describes a card that
 * merely contains a flag among other content. Verified with --pages against a
 * scratch page carrying one of each.
 *
 * THE FLOOR RAISED 2026-09-07, from "at least 14px" to "one of the two rungs",
 * because a component-side fix landed the same day: `CountryFlag.tsx` now
 * sizes every flag from `--flag-hero` (40px) or `--flag-row` (20px), width
 * auto, `object-contain`, never a third height. A 14px floor could not tell a
 * flag obeying that law from one sitting at 27px on its way to somewhere else,
 * so a rendered height is now checked against the two tokens exactly (read
 * live from `:root`, not retyped here, so the gate cannot drift from the
 * values `globals.css` actually ships) rather than against a minimum.
 *
 * THE RATIO CLAUSE BECAME THE WRONG LAW, 2026-09-11, and is replaced rather
 * than relaxed. It read: "a flag's rendered box must match its own natural
 * ratio", which is exactly right while width is `auto`, and it caught the
 * `aspect-[3/2] object-cover` distortion this file exists for. The founder then
 * ruled the opposite of its premise: "all-flags-same-width-please-madatory-
 * always". Every flag now renders in a box 1.5x its rung wide, so a square flag
 * and a ribbon both sit in a 3:2 box on purpose, and the old clause would have
 * failed every flag in the world that is not 3:2, at every site on the
 * property, for obeying the law. Its two jobs are now done by two clauses that
 * can both be true at once: the WIDTH is a token (one width, everywhere, which
 * is the ruling), and `object-fit` is `contain` (the flag is fitted into that
 * box with air, never stretched or cropped into it, which is the distortion
 * protection the ratio clause was really providing). Distortion is therefore
 * still impossible, and it is now impossible structurally rather than
 * measured after the fact.
 *
 * WHAT THIS PAIR CANNOT SEE, said before it is trusted: `contain` plus one
 * width guarantees the flag's proportions and the box's uniformity, and says
 * nothing about how much air is in the box. A rung set to 10:1 would pass both
 * clauses and draw every flag as a hairline in a wide empty frame. The 1.5x
 * ratio that keeps the air sane lives in globals.css next to the tokens, and is
 * a LOOK judgement the founder makes from a photograph, not a number a gate can
 * derive.
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
  /* THE TWO RUNGS, READ LIVE FROM :root RATHER THAN RETYPED, so this gate
     cannot drift from the values globals.css actually ships (MODEL.md PART 3:
     `--flag-hero` 40px, `--flag-row` 20px, and no third rung). A page that
     has not been rebuilt against these tokens yet defines neither variable;
     that resolves to NaN, and NaN fails every comparison below, which is the
     correct verdict for a page still carrying the old fixed-aspect flag. */
  const rootStyle = getComputedStyle(document.documentElement);
  const tokenPx = (name) => parseFloat(rootStyle.getPropertyValue(name));
  const ALLOWED_HEIGHTS = [tokenPx("--flag-hero"), tokenPx("--flag-row")];
  /* THE SAME TWO RUNGS, READ SIDEWAYS (2026-09-11). See the header note: the
     ratio clause this replaces is now the wrong law.
     A PAGE THAT DEFINES NEITHER TOKEN PREDATES THE LAW, and is reported as
     UNMEASURED rather than failed. That is the opposite of how the HEIGHT
     clause treats a missing token, and the difference is deliberate: these are
     PRE-BUILT snapshots with their stylesheet inlined at capture time, so a
     missing width token says "this file was rendered before the law existed",
     which is a fact about the snapshot. A missing HEIGHT token means something
     else entirely, since that law predates every snapshot here, so its absence
     really does mean a page carrying the old fixed-aspect flag. The skip is
     printed by name below, never silent, and it disappears the moment the
     artifacts are regenerated. */
  const ALLOWED_WIDTHS = [tokenPx("--flag-hero-w"), tokenPx("--flag-row-w")];
  const WIDTH_LAW_KNOWN = ALLOWED_WIDTHS.some((v) => Number.isFinite(v));
  const HEIGHT_TOLERANCE = 1; // subpixel rounding, never a third rung

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
    /* A parent is the flag's FRAME only if it clips it or fits it. See the
       header note: a card that merely contains a flag rounds its own corners,
       not the flag's, and counting those made the fix invisible. */
    let wrapperR = 0;
    if (wrapper) {
      const ws = getComputedStyle(wrapper);
      const wr = wrapper.getBoundingClientRect();
      const clips = /hidden|clip|scroll|auto/.test(ws.overflowX) || /hidden|clip|scroll|auto/.test(ws.overflowY);
      const fits =
        Math.abs(r.left - wr.left) <= 2 &&
        Math.abs(r.top - wr.top) <= 2 &&
        Math.abs(wr.right - r.right) <= 2 &&
        Math.abs(wr.bottom - r.bottom) <= 2;
      if (clips || fits) wrapperR = Math.round(maxCornerRadius(ws));
    }
    const h = Math.round(r.height);
    const reasons = [];
    if (ownR > 0) reasons.push(`radius ${ownR}px on the flag itself`);
    if (wrapperR > 0) reasons.push(`radius ${wrapperR}px on its frame (<${wrapper.tagName.toLowerCase()}>)`);
    if (!ALLOWED_HEIGHTS.some((allowed) => Number.isFinite(allowed) && Math.abs(h - allowed) <= HEIGHT_TOLERANCE)) {
      reasons.push(`height ${h}px, not one of the two flag tokens (--flag-hero 40px, --flag-row 20px)`);
    }
    /* SAME WIDTH: the rendered width is one of the two width tokens, exactly
       as the height above is one of the two height tokens. This clause REPLACED
       a ratio check on 2026-09-11 and the replacement is the whole point, so
       the old rule is written down rather than quietly dropped: it failed any
       flag whose rendered box did not match its own natural ratio, which was
       the right law while width was `auto` and is the wrong one now that the
       founder has ruled every flag the same width
       ("all-flags-same-width-please-madatory-always"). Under the new law a
       non-3:2 flag's box does NOT match its ratio by design, so the old clause
       would have failed about 40% of the world's flags for obeying the law. */
    const w = Math.round(r.width);
    if (WIDTH_LAW_KNOWN && !ALLOWED_WIDTHS.some((allowed) => Number.isFinite(allowed) && Math.abs(w - allowed) <= HEIGHT_TOLERANCE)) {
      reasons.push(`width ${w}px, not one of the two flag tokens (--flag-hero-w 60px, --flag-row-w 30px)`);
    }
    /* NOT DISTORTED, which the ratio clause used to prove as a side effect and
       something still has to. A fixed box can hold a flag two ways: fitted
       inside it with air (`contain`), or filled and cropped (`cover`), or
       stretched to the box (`fill`, the default). Only the first keeps the
       flag's own proportions, so the fitting mode is read directly from the
       computed style rather than inferred from the rendered box, which under
       `contain` reports the BOX and tells you nothing about the pixels inside
       it. `scale-down` is accepted: it is `contain` for anything larger than
       the box, which every flag SVG is. */
    if (el.tagName === "IMG") {
      const fit = s.objectFit;
      if (fit !== "contain" && fit !== "scale-down") {
        reasons.push(`object-fit: ${fit}; a flag in a fixed box is fitted with air (contain), never stretched or cropped to fill it`);
      }
    }
    const label = el.getAttribute("alt") || el.getAttribute("aria-label") || el.getAttribute("title")
      || (el.tagName === "SVG" ? el.querySelector("title")?.textContent : "")
      || el.getAttribute("src") || "(unlabeled flag mark)";
    return { tag: el.tagName.toLowerCase(), w, h, reasons, label: String(label).trim().slice(0, 48) };
  });

  return { total: results.length, offenders: results.filter((r) => r.reasons.length > 0), widthLawKnown: WIDTH_LAW_KNOWN };
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
    const { total: totalMarks, offenders, widthLawKnown } = await page.evaluate(measure);
    now[name] = offenders.length;
    total += offenders.length;
    report.push({ name, totalMarks, offenders, widthLawKnown });
  } finally {
    await page.close();
  }
}
await browser.close();

let unmeasured = 0;
for (const { name, totalMarks, offenders, widthLawKnown } of report) {
  console.log(`\n  ${name}  ${totalMarks} flag mark(s) found, ${offenders.length} violation(s)`);
  offenders.forEach((o) => console.log(`     <${o.tag}>  ${o.w}x${o.h}px  ${o.reasons.join("; ")}  "${o.label}"`));
  /* NAMED, NEVER SILENT. A snapshot rendered before the same-width law has no
     width token in its inlined stylesheet, so that half of the test cannot run
     on it, and the zero above must never be read as a clean bill for a rule
     that did not execute. */
  if (totalMarks > 0 && !widthLawKnown) {
    unmeasured += 1;
    console.log("     WIDTH UNMEASURED HERE: this snapshot's inlined stylesheet predates --flag-row-w / --flag-hero-w.");
  }
}
if (unmeasured > 0) {
  console.log(`\n  ! the same-width law was UNMEASURED on ${unmeasured} of ${PAGES.length} page(s), not passed.`);
  console.log("    Those artifacts predate it. Regenerate them to measure it here:");
  console.log("      npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/build_final_pages.tsx");
  console.log("    (it fetches live data, so it needs the Supabase env vars set.)");
  console.log("    The law IS measured live at three widths meanwhile, by the harness:");
  console.log("      check_archetypes.mjs MARK SIZE, and check_model_laws.mjs FLAG.");
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
