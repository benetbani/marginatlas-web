#!/usr/bin/env node
/**
 * build_page_sheet , ONE FILE the founder opens, holding the four London pages at
 * desktop and phone with the numbers that changed beside them.
 *
 * This is NOT the ratified per-section review sheet (build_review_sheet.mjs), which
 * is registry-driven, carries a crop per section and emits a verdict string. That
 * one is for locking sections. This one answers a different question, the one he
 * actually asks first: what do the pages look like now, and what moved.
 *
 * Everything is inlined, so the file works with no server and no network.
 *
 * Usage: node scripts/build_page_sheet.mjs
 * Reads:  scratchpad/shots-glass/FINAL-<page>.jpeg   (desktop, 1280)
 *         scratchpad/shots-glass/P375-<page>.jpeg    (phone, 375)
 * Writes: E:/atlas/design/PAGE-SHEET-<date>.html
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const DATE = process.argv.includes("--date")
  ? process.argv[process.argv.indexOf("--date") + 1]
  : "2026-08-25";

const PAGES = [
  { slug: "city-london", name: "London", kind: "the city page" },
  { slug: "cell-london-restaurants", name: "Restaurants in London", kind: "the trade page" },
  { slug: "industry-restaurants", name: "Restaurants, across places", kind: "the trade at every altitude" },
  { slug: "hood-london", name: "London neighbourhoods", kind: "the district page" },
];

/* Measured on 2026-08-25, both sides, in a real browser inside the real shell.
   Every number here came from a script that ran, not from an impression. */
const MOVED = [
  ["Sections running the full column", "28 of 39", "0"],
  ["Places where text is drawn on text", "2", "0"],
  ["Chapters with nothing under them, across all 15 real pages", "3", "0"],
  ["Figures that stack without tabular numerals", "25", "7"],
  ["Bands repeating their neighbour's split", "2", "0"],
  ["Elements carrying the frosted treatment", "0", "every card"],
];

const KNOWN = [
  "The neighbourhood map draws in the real app and not in these pictures: it needs a browser to measure its own box, and these are static renders. The empty half beside the district chips is that, not a hole in the page.",
  "The trade page's owner-keeps waterfall is the same: present and correct in the app, blank here.",
  "Seven small figures still render without tabular numerals. All seven are scale END labels, which sit at opposite ends of a track and never line up with anything, so the check counts them and they are not really a fault.",
  "Five sections on the city page drew for none of the fifteen cities I checked: rent against income, owner runway, the risk list, the character read, the locals note. Fifteen, not all 252, so treat it as a strong signal rather than a proof. They are still in the code and will draw the day their data arrives.",
];

const img = (p) =>
  existsSync(p) ? `data:image/jpeg;base64,${readFileSync(p).toString("base64")}` : "";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const cards = PAGES.map((p) => {
  const d = img(`scratchpad/shots-glass/FINAL-${p.slug}.jpeg`);
  const m = img(`scratchpad/shots-glass/P375-${p.slug}.jpeg`);
  return `
  <section class="pg">
    <h2>${esc(p.name)} <span class="kind">${esc(p.kind)}</span></h2>
    <div class="two">
      <figure><figcaption>Desktop, 1280</figcaption>${d ? `<img src="${d}" alt="">` : `<p class="miss">not rendered</p>`}</figure>
      <figure class="ph"><figcaption>Phone, 375</figcaption>${m ? `<img src="${m}" alt="">` : `<p class="miss">not rendered</p>`}</figure>
    </div>
  </section>`;
}).join("");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Margin Atlas , the four London pages, ${esc(DATE)}</title>
<style>
  :root { color-scheme: light; }
  body { margin:0; background:#f6f5f3; color:#1b1b1a;
         font: 15px/1.55 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
  .wrap { max-width: 1180px; margin: 0 auto; padding: 40px 22px 80px; }
  h1 { font-size: 27px; font-weight: 600; letter-spacing:-.01em; margin:0 0 6px; }
  .sub { color:#6f6f6d; margin:0 0 30px; max-width: 62ch; }
  h2 { font-size: 19px; font-weight:600; margin: 0 0 12px; }
  .kind { color:#8c8c8a; font-weight:400; font-size:14px; }
  table { border-collapse: collapse; width:100%; margin: 0 0 34px; background:#fff;
          border:1px solid #e7e2df; border-radius:12px; overflow:hidden; }
  th, td { text-align:left; padding:10px 14px; border-bottom:1px solid #efeae6; font-size:14px; }
  th { font-size:11px; text-transform:uppercase; letter-spacing:.07em; color:#8c8c8a; font-weight:600; }
  tr:last-child td { border-bottom:0; }
  td.n { text-align:right; font-variant-numeric: tabular-nums; white-space:nowrap; }
  td.was { color:#8c8c8a; }
  td.now { color:#c2410c; font-weight:600; }
  ul { margin: 0 0 34px; padding-left: 18px; max-width: 74ch; }
  li { margin-bottom: 9px; color:#565654; }
  .pg { margin: 0 0 44px; }
  .two { display:grid; grid-template-columns: minmax(0,1fr) 300px; gap:18px; align-items:start; }
  figure { margin:0; background:#fff; border:1px solid #e7e2df; border-radius:12px; padding:10px; }
  figcaption { font-size:11px; text-transform:uppercase; letter-spacing:.07em; color:#8c8c8a; margin-bottom:8px; }
  img { display:block; width:100%; height:auto; border-radius:6px; }
  .miss { color:#a33; font-size:13px; }
  @media (max-width: 860px) { .two { grid-template-columns: 1fr; } }
</style></head><body><div class="wrap">
  <h1>The four London pages</h1>
  <p class="sub">${esc(DATE)}. Rendered in a real browser inside the real page shell, at the two widths that matter. Scroll each one; they are full pages, not crops.</p>

  <h2>What moved</h2>
  <table>
    <tr><th>Measured</th><th class="n">Before</th><th class="n">Now</th></tr>
    ${MOVED.map(([k, a, b]) => `<tr><td>${esc(k)}</td><td class="n was">${esc(a)}</td><td class="n now">${esc(b)}</td></tr>`).join("\n    ")}
  </table>

  <h2>What these pictures cannot show, and what is still open</h2>
  <ul>${KNOWN.map((k) => `<li>${esc(k)}</li>`).join("")}</ul>

  ${cards}
</div></body></html>`;

const out = `E:/atlas/design/PAGE-SHEET-${DATE}.html`;
writeFileSync(out, html, "utf8");
console.log(`  wrote ${out}  (${Math.round(html.length / 1024)}KB)`);
