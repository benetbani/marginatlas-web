#!/usr/bin/env node
/**
 * build_walk_strip , THE WHOLE READER JOURNEY, IN ONE FILE.
 *
 * Every other sheet in this folder judges one page, or one section, in
 * isolation. Nobody has ever been able to open a single file and see the
 * entire walk a real visitor takes, home to countries to a country to a city
 * to a neighbourhood to a trade to that trade everywhere, at every width a
 * reader actually carries. This is that file: one row per page, in walk
 * order, phone next to tablet next to desktop, so a human can judge the whole
 * walk at a glance before anything ships.
 *
 * Reuses the browser plumbing style of build_section_dossier.mjs (launch
 * once, one page per capture, close cleanly) and the embed pattern of
 * build_page_sheet.mjs and build_review_sheet.mjs (base64 JPEG, one offline
 * file, nothing to fetch).
 *
 * Usage: node scripts/build_walk_strip.mjs
 * Reads:  docs/loop/artifacts/final-pages/<slug>.html (7 static renders)
 * Writes: E:/atlas/design/critique/WALK-<date>.html
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { requireBrowser } from "./lib/local_only.mjs";

await requireBrowser(
  "walk-strip",
  "the whole-journey walk strip was not captured, so nobody can eyeball the full reader path before it ships",
);

const { chromium } = await import("playwright");

const OUT_DIR = "E:/atlas/design/critique";
const DATE = new Date().toISOString().slice(0, 10);

/* THE WALK, IN ORDER. This is the path a real visitor actually takes: land on
   home, browse to the countries list, drill into one country, its capital
   city, a neighbourhood in that city, one trade in that neighbourhood, then
   that same trade zoomed out to every place it operates. Order here is the
   whole point of the file, so it is not derived or sorted, it is written down. */
const WALK = [
  { slug: "home", label: "Home" },
  { slug: "countries-list", label: "Countries" },
  { slug: "country-gb", label: "Country, United Kingdom" },
  { slug: "city-london", label: "City, London" },
  { slug: "hood-london", label: "Neighbourhood, London" },
  { slug: "cell-london-restaurants", label: "Trade, restaurants in London" },
  { slug: "industry-restaurants", label: "Trade everywhere, restaurants" },
];

const WIDTHS = [375, 768, 1280];

const ESCAPE_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (ch) => ESCAPE_MAP[ch]);

async function run() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  for (const step of WALK) {
    const src = `docs/loop/artifacts/final-pages/${step.slug}.html`;
    if (!existsSync(src)) {
      throw new Error(`missing source page for the walk: ${src}. The strip needs all seven or it is not the whole walk.`);
    }
  }

  const browser = await chromium.launch();
  const shots = [];

  try {
    for (const step of WALK) {
      const url = `file:///E:/atlas/website/docs/loop/artifacts/final-pages/${step.slug}.html`;
      const row = { ...step, images: {} };
      for (const width of WIDTHS) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        try {
          await page.goto(url);
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(450);
          const buf = await page.screenshot({ type: "jpeg", quality: 60, fullPage: true });
          row.images[width] = buf.toString("base64");
        } finally {
          await page.close();
        }
      }
      shots.push(row);
      console.log(`  captured ${step.slug} at ${WIDTHS.join(", ")}`);
    }
  } finally {
    await browser.close();
  }

  const rows = shots
    .map((row, i) => {
      const cols = WIDTHS.map((w) => {
        const caption = `${row.label} at ${w}`;
        const dataUri = `data:image/jpeg;base64,${row.images[w]}`;
        return `
      <figure>
        <figcaption>${esc(caption)}</figcaption>
        <a href="${dataUri}" target="_blank" rel="noopener">
          <img src="${dataUri}" alt="${esc(caption)}" loading="lazy">
        </a>
      </figure>`;
      }).join("");
      return `
  <section class="walkpage">
    <h2><span class="n">${i + 1}</span> ${esc(row.label)} <span class="slug">${esc(row.slug)}</span></h2>
    <div class="row">${cols}</div>
  </section>`;
    })
    .join("");

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>The walk strip, ${esc(DATE)}</title>
<style>
  :root { color-scheme: light; }
  body { margin:0; background:#f6f5f3; color:#1b1b1a;
         font: 15px/1.5 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
  .wrap { max-width: 1400px; margin: 0 auto; padding: 40px 22px 80px; }
  h1 { font-size: 26px; font-weight: 600; letter-spacing: -.01em; margin: 0 0 6px; }
  .sub { color: #6f6f6d; margin: 0 0 30px; max-width: 74ch; }
  .walkpage { margin: 0 0 40px; }
  h2 { font-size: 18px; font-weight: 600; margin: 0 0 12px; display: flex; align-items: baseline; gap: 10px; }
  .n { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px;
       border-radius: 50%; background: #1b1b1a; color: #fff; font-size: 12px; font-weight: 700; }
  .slug { color: #a3a09a; font-weight: 400; font-size: 13px; }
  .row { display: grid; grid-template-columns: 1fr 1.6fr 2fr; gap: 14px; align-items: start; }
  figure { margin: 0; background: #fff; border: 1px solid #e7e2df; border-radius: 10px; padding: 8px; }
  figcaption { font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: #8c8c8a; margin-bottom: 6px; }
  img { display: block; width: 100%; height: auto; border-radius: 5px; }
  a { display: block; }
  @media (max-width: 900px) { .row { grid-template-columns: 1fr; } }
</style></head><body><div class="wrap">
  <h1>The walk strip</h1>
  <p class="sub">${esc(DATE)}. The whole reader journey, seven pages in the order a visitor actually takes them, phone next to tablet next to desktop, full page every time. Click any picture to open it at full size. Nothing here is judged; it is only shown.</p>
  ${rows}
</div></body></html>`;

  const out = `${OUT_DIR}/WALK-${DATE}.html`;
  writeFileSync(out, html, "utf8");
  const imgCount = shots.reduce((a, r) => a + Object.keys(r.images).length, 0);
  console.log(`\n  wrote ${out}`);
  console.log(`  ${shots.length} pages x ${WIDTHS.length} widths = ${imgCount} images`);
}

run();
