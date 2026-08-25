/**
 * verify_gathered_emptiness , E6. A HOLE IS EMPTINESS THAT IS GATHERED.
 *
 * The founder, 2026-08-25: "some sections have huge white space". E2 answered
 * half of that and nothing answered the other half. E2 measures a section's ink
 * against its HEIGHT, so a card whose content sits in its left portion with a
 * dead strip down its right passes as full. The city page passed all twelve of
 * its counters while carrying a 256 by 162 hole.
 *
 * WHAT IT MEASURES: the largest empty rectangle inside each section, found by
 * building an occupancy grid from every inked leaf and sweeping it with the
 * standard largest-rectangle-in-histogram stack.
 *
 * A RECTANGLE RATHER THAN A PERCENTAGE, because coverage says how much of a card
 * is empty and a rectangle says whether the emptiness is GATHERED. Twelve percent
 * scattered between rows is breathing room; the same twelve percent in one block
 * is the hole the eye lands on. No coverage measure separates them.
 *
 * BOTH DIRECTIONS, because the largest empty rectangle by area is usually one
 * text row of ragged right edge: 817px wide, 36px tall, 28% of a short card, and
 * nothing a reader would call white space. Requiring a quarter of the card each
 * way, floored at 120px, separates the set cleanly: thirty-one sections score
 * zero and the rest score 19% and above. The threshold was read off that gap
 * rather than chosen.
 *
 * TWO THINGS DO NOT COUNT, both learned by looking at a picture this had already
 * judged:
 *
 *   A chart's own track. A dot plot whose scale honestly starts at zero leaves
 *   its left side empty, and truncating that axis to fill the space would
 *   exaggerate every difference on it. That is G6's business, not the layout's.
 *
 *   A form that cannot draw in a static preview. The owner-keeps chart and the
 *   district map need a browser runtime to size themselves and emit nothing here.
 *   Judging either from these files has produced a false defect twice. They are
 *   counted as unjudgeable, never as holes, and they are NAMED rather than
 *   counted, because a card that started failing to draw would raise that number
 *   and lower the hole count, and both would read as progress.
 *
 * THIS MEASUREMENT WAS WRONG TWICE BEFORE IT WAS RIGHT, and the comments inside
 * measure() carry both faults where they happened. Read them before trusting a
 * finding: a check that cannot observe the thing it is checking reports that
 * thing absent, confidently, with a figure attached.
 *
 * BLIND SPOT: it cannot tell a hole that is waiting for data from a hole in the
 * design, which is why every finding names its section rather than a count.
 *
 * Usage: node scripts/verify_gathered_emptiness.mjs [--width N] [--crops] [--write-baseline]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { eachPage } from "./lib/measure_pages.mjs";

const BASELINE = "scripts/gathered_emptiness_baseline.json";
const argv = process.argv.slice(2);

/* BOTH WIDTHS, and the baseline is keyed by width. A layout sound at 1280 can
   open a hole at 1440 where the same content has more room to rattle around, and
   1440 is where the range-of-vision complaint bites hardest. Keying by width also
   closes a trap: with one shared baseline, running at a second width compared its
   results against the first width's numbers and the pass or fail meant nothing. */
const WIDTHS = argv.includes("--width")
  ? [Number(argv[argv.indexOf("--width") + 1])]
  : [1280, 1440];

/* Runs inside the page. Nothing from this scope is visible to it. */
function measure() {
  const COLS = 48;
  const ROW_PX = 6;

  const cards = [...document.querySelectorAll("div")].filter(
    (e) => getComputedStyle(e).backdropFilter !== "none",
  );
  const outer = cards.filter((c) => !cards.some((o) => o !== c && o.contains(c)));

  const out = [];
  for (const c of outer) {
    const cb = c.getBoundingClientRect();
    const cs = getComputedStyle(c);
    const x0 = cb.left + parseFloat(cs.paddingLeft);
    const x1 = cb.right - parseFloat(cs.paddingRight);
    const y0 = cb.top + parseFloat(cs.paddingTop);
    const y1 = cb.bottom - parseFloat(cs.paddingBottom);
    const W = x1 - x0, H = y1 - y0;
    if (W < 40 || H < 40) continue;

    /* A LARGE CHILDLESS, TEXTLESS ELEMENT IS THE SIGNATURE OF A CHART THAT FAILED
       TO DRAW, and it is ALSO the signature of an ordinary SVG path, which has no
       children and no text by nature. Without the svg exclusion this waved three
       real charts through as unjudgeable, and unjudgeable is the category that
       hides things: a card that stopped drawing would raise that count and lower
       the hole count, and both would read as progress. Verified by grepping the
       markup for a word each card prints, which is the check this repo already
       prescribes before calling any card empty. */
    let blank = false;
    for (const e of c.querySelectorAll("*")) {
      /* SVG interiors and table column definitions match the signature and are not
         failures: a path has no children and no text by nature, and a <col> is pure
         structure that reports a full-column rect while drawing nothing. Between
         them they accounted for three of the four cards this first called
         unjudgeable, every one of which drew correctly. */
      if (e.closest("svg") || e.tagName === "COL" || e.tagName === "COLGROUP") continue;
      if (e.children.length || (e.textContent || "").trim()) continue;
      const b = e.getBoundingClientRect();
      if (b.width * b.height > 20000) { blank = true; break; }
    }

    const nRows = Math.max(1, Math.round(H / ROW_PX));
    const grid = Array.from({ length: nRows }, () => new Uint8Array(COLS));
    for (const e of c.querySelectorAll("*")) {
      const d = e.closest("details");
      if (d && !d.open && !e.closest("summary")) continue;
      const s = getComputedStyle(e);
      const drawn =
        [...e.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim()) ||
        e.tagName === "svg" || e.tagName === "IMG" ||
        s.backgroundColor !== "rgba(0, 0, 0, 0)" ||
        parseFloat(s.borderTopWidth) > 0 || parseFloat(s.borderLeftWidth) > 0 ||
        /* ALL FOUR EDGES. Testing only top and left missed every table row, because
           a row rule is a BOTTOM border, so a perfectly ordinary two-column table
           read as a 45% void between its label column and its figure column, the
           worst score on any page. It was never a hole. A layout change had been
           made to fix it and had to be reverted. */
        parseFloat(s.borderBottomWidth) > 0 || parseFloat(s.borderRightWidth) > 0;
      if (!drawn) continue;
      const b = e.getBoundingClientRect();
      /* A HAIRLINE IS DRAWN INK. Skipping anything under 2px threw away every rule,
         axis and chart track on every page, which is how a dot plot whose scale
         honestly starts at zero read as a 27% hole while its own row lines ran
         straight through the space being flagged. */
      if (b.height <= 0.5 || b.width <= 0.5) continue;
      const ca = Math.max(0, Math.floor(((b.left - x0) / W) * COLS));
      const cz = Math.min(COLS - 1, Math.ceil(((b.right - x0) / W) * COLS) - 1);
      const ra = Math.max(0, Math.floor((b.top - y0) / ROW_PX));
      const rz = Math.min(nRows - 1, Math.ceil((b.bottom - y0) / ROW_PX) - 1);
      for (let r = ra; r <= rz; r++) for (let k = ca; k <= cz; k++) grid[r][k] = 1;
    }

    /* Filtering MAXIMAL rectangles by the shape floor is sound: any qualifying
       rectangle sits inside a maximal one, and that container is at least as large
       in both directions. */
    const minCols = Math.max(1, Math.ceil(COLS * 0.25), Math.ceil((120 / W) * COLS));
    const minRows = Math.max(1, Math.ceil(nRows * 0.25), Math.ceil(120 / ROW_PX));
    const heights = new Int32Array(COLS);
    let best = 0, box = null;
    for (let r = 0; r < nRows; r++) {
      for (let k = 0; k < COLS; k++) heights[k] = grid[r][k] ? 0 : heights[k] + 1;
      const stack = [];
      for (let k = 0; k <= COLS; k++) {
        const h = k === COLS ? 0 : heights[k];
        let start = k;
        while (stack.length && stack[stack.length - 1].h >= h) {
          const t = stack.pop();
          const wc = k - t.k;
          if (t.h * wc > best && t.h >= minRows && wc >= minCols) {
            best = t.h * wc;
            box = { col: t.k, cols: wc, row: r - t.h + 1, rows: t.h };
          }
          start = t.k;
        }
        stack.push({ k: start, h });
      }
    }

    const rail = c.querySelector("h2, h3, [class*=rail]");
    const label = ((rail && rail.textContent) || c.textContent || "").trim().replace(/\s+/g, " ").slice(0, 44);
    out.push({
      label, blank,
      pct: Math.round((best / (COLS * nRows)) * 100),
      w: box ? Math.round((box.cols / COLS) * W) : 0,
      h: box ? box.rows * ROW_PX : 0,
      side: box ? (box.col + box.cols >= COLS - 1 ? "right" : box.col <= 0 ? "left" : "middle") : "-",
      hole: box
        ? {
            x: x0 + window.scrollX + (box.col / COLS) * W,
            y: y0 + window.scrollY + box.row * ROW_PX,
            w: (box.cols / COLS) * W,
            h: box.rows * ROW_PX,
          }
        : null,
      card: { x: cb.left + window.scrollX, y: cb.top + window.scrollY, w: cb.width, h: cb.height },
    });
  }
  return out;
}

const now = {};
const lines = [];
const cannotJudge = [];
const runs = [];
let unjudgeable = 0;
let measured = 0;

for (const width of WIDTHS) {
  const pages = await eachPage(width, measure);
  runs.push({ width, pages });
  for (const { name, result } of pages) {
    let holes = 0;
    for (const s of result) {
      measured++;
      if (s.blank) {
        unjudgeable++;
        cannotJudge.push(`${width}px  ${name} "${s.label}"`);
        continue;
      }
      if (!s.hole) continue;
      holes++;
      lines.push(
        `  E6  ${width}px  ${String(s.pct).padStart(3)}%  ${String(s.w).padStart(4)}x${String(s.h).padEnd(4)} ${s.side.padEnd(7)} ${name} "${s.label}"`,
      );
    }
    now[`${width}:${name}:holes`] = holes;
  }
}

if (argv.includes("--crops")) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  for (const { width, pages } of runs) {
    for (const { name, result } of pages) {
      const found = result.filter((s) => !s.blank && s.hole);
      if (!found.length) continue;
      const page = await browser.newPage({ viewport: { width, height: 1200 } });
      await page.goto(`file:///E:/atlas/website/docs/loop/artifacts/final-pages/${name}.html`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);
      for (const s of found) {
        await page.evaluate((h) => {
          const d = document.createElement("div");
          d.style.cssText = `position:absolute;left:${h.x}px;top:${h.y}px;width:${h.w}px;height:${h.h}px;outline:2px dashed #c2410c;background:rgba(194,65,12,0.10);z-index:9999;pointer-events:none`;
          document.body.appendChild(d);
        }, s.hole);
      }
      for (const s of found) {
        const slug = `${width}-${name}-${s.label}`.replace(/[^a-z0-9]+/gi, "-").slice(0, 52);
        await page.screenshot({
          path: `scratchpad/shots-glass/HOLE-${slug}.jpeg`,
          type: "jpeg",
          quality: 86,
          fullPage: true,
          clip: {
            x: Math.max(0, s.card.x - 12),
            y: Math.max(0, s.card.y - 12),
            width: Math.min(width, s.card.w + 24),
            height: s.card.h + 24,
          },
        });
        console.log(`  drew HOLE-${slug}.jpeg`);
      }
      await page.close();
    }
  }
  await browser.close();
}

if (argv.includes("--write-baseline")) {
  writeFileSync(BASELINE, JSON.stringify(now, null, 2) + "\n");
  console.log(`  wrote ${BASELINE}\n`);
  process.exit(0);
}

const base = JSON.parse(readFileSync(BASELINE, "utf8"));
const grew = Object.entries(now).filter(([k, v]) => v > (base[k] ?? 0));
lines.forEach((l) => console.log(l));
if (grew.length) {
  console.log("x verify_gathered_emptiness: gathered holes GREW. This baseline may only come DOWN.");
  grew.forEach(([k, v]) => console.log(`     ${k}: ${base[k] ?? 0} -> ${v}`));
  process.exit(1);
}
const total = Object.values(now).reduce((a, b) => a + b, 0);
console.log(
  `PASS verify_gathered_emptiness. ${total} gathered hole(s) over ${measured - unjudgeable} section-measurements at ${WIDTHS.join("px and ")}px; ${unjudgeable} could not be judged from a static preview.\n`,
);
cannotJudge.forEach((c) => console.log(`  not judged  ${c}`));
