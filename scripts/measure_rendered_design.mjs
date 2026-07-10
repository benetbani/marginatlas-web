/**
 * scripts/measure_rendered_design.mjs
 *
 * Measures the RENDERED design of the spine pages and checks it against the
 * budgets in scripts/design_budgets.json. Reading source cannot tell you what a
 * page looks like: a paired width-tier whose child self-omits renders as a solo
 * row, and eighteen ad-hoc font sizes only reveal themselves once weighted by the
 * characters actually set in them. So we measure the DOM.
 *
 * Everything is scoped to <main>, so the site header and footer never pollute the
 * numbers (the "Margin Atlas" wordmark is a 38px focal figure otherwise).
 *
 * Every external request is aborted. This box cannot reach Google Fonts or the
 * Unsplash atmosphere plate, and waiting on them is what hangs a capture. Fonts
 * fall back, which shifts glyph metrics but not the values we assert on
 * (computed px, padding, geometry, overflow).
 *
 * Usage:
 *   npm run dev                                    # in another shell
 *   node scripts/measure_rendered_design.mjs       # writes + checks
 *   node scripts/measure_rendered_design.mjs --json out.json
 *
 * Exit code 1 when a budget is breached, so it can gate a build.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE || "http://localhost:3000";
const EXE = process.env.CHROME_EXE || undefined;
const OUT = process.argv.includes("--json")
  ? process.argv[process.argv.indexOf("--json") + 1]
  : null;

const PAGES = [
  ["country", "/dev/spine"],
  ["city", "/dev/spine-city"],
  ["cell", "/dev/spine-cell"],
  ["industry", "/dev/spine-industry"],
  ["hood", "/dev/spine-hood"],
];

const budgets = JSON.parse(
  fs.readFileSync(path.join(import.meta.dirname, "design_budgets.json"), "utf8"),
);

/** Runs inside the page. Scoped to <main>. Returns plain JSON. */
function probe() {
  const root = document.querySelector("main") || document.body;
  const seen = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== "hidden";
  };

  // A card is the kit Box signature: 14px radius plus a border.
  const cards = [...root.querySelectorAll("div")].filter((el) => {
    const cs = getComputedStyle(el);
    return (
      cs.borderTopLeftRadius === "14px" &&
      parseFloat(cs.borderTopWidth) > 0 &&
      seen(el)
    );
  });

  const cardData = cards.map((el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const shadow = cs.boxShadow;
    return {
      top: Math.round(r.top + window.scrollY),
      w: Math.round(r.width),
      padTop: cs.paddingTop,
      // A drop shadow is any layer that is not marked inset.
      dropShadow:
        shadow !== "none" &&
        shadow.split(/,(?![^(]*\))/).some((l) => !l.includes("inset")),
      chars: (el.innerText || "").trim().length,
    };
  });

  // Bento test, measured on the render: group cards by their top edge.
  const rows = [];
  for (const c of cardData) {
    const row = rows.find((t) => Math.abs(t.top - c.top) <= 24);
    if (row) row.n++;
    else rows.push({ top: c.top, n: 1 });
  }
  const soloRows = rows.filter((r) => r.n === 1).length;

  // Typography, weighted by the characters actually set in each size.
  const sizes = {};
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const t = node.textContent.trim();
    if (!t) continue;
    const el = node.parentElement;
    if (!el || !seen(el)) continue;
    const cs = getComputedStyle(el);
    const px = Math.round(parseFloat(cs.fontSize) * 10) / 10;
    sizes[px] = (sizes[px] || 0) + t.length;
  }

  const focal = [...root.querySelectorAll("*")].filter(
    (el) =>
      seen(el) &&
      el.children.length === 0 &&
      (el.innerText || "").trim() &&
      parseFloat(getComputedStyle(el).fontSize) >= 26,
  );

  return {
    cardCount: cardData.length,
    rowCount: rows.length,
    soloRows,
    soloRowRate: rows.length ? soloRows / rows.length : 0,
    distinctPaddings: [...new Set(cardData.map((c) => c.padTop))],
    dropShadowCards: cardData.filter((c) => c.dropShadow).length,
    maxCharsInACard: Math.max(0, ...cardData.map((c) => c.chars)),
    fontSizeHistogram: Object.entries(sizes)
      .map(([px, chars]) => [Number(px), chars])
      .sort((a, b) => b[1] - a[1]),
    distinctFontSizes: Object.keys(sizes).length,
    focalCount: focal.length,
    pageHeight: Math.round(root.scrollHeight),
    hScroll: document.documentElement.scrollWidth > window.innerWidth + 1,
  };
}

const browser = await chromium.launch(EXE ? { executablePath: EXE } : {});
const out = {};
const failures = [];

for (const [name, route] of PAGES) {
  out[name] = {};
  for (const width of [1360, 390]) {
    const ctx = await browser.newContext({ viewport: { width, height: 1200 } });
    const page = await ctx.newPage();
    await page.route("**/*", (r) =>
      r.request().url().startsWith(BASE) ? r.continue() : r.abort(),
    );
    try {
      await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForFunction(() => document.querySelectorAll("h2").length > 0, {
        timeout: 45000,
      });
      await page.waitForTimeout(400);
      out[name][width] = await page.evaluate(probe);
    } catch (e) {
      out[name][width] = { error: String(e).slice(0, 160) };
    }
    await ctx.close();
    if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  }

  const wide = out[name][1360];
  const narrow = out[name][390];
  if (wide && !wide.error) {
    const b = budgets.perPage[name] || budgets.default;
    const fail = (msg) => failures.push(`${name}: ${msg}`);
    if (wide.soloRowRate > b.maxSoloRowRate)
      fail(`solo-row rate ${(wide.soloRowRate * 100).toFixed(0)}% > ${b.maxSoloRowRate * 100}%`);
    if (wide.maxCharsInACard > b.maxCharsInACard)
      fail(`a card holds ${wide.maxCharsInACard} chars > ${b.maxCharsInACard}`);
    if (wide.pageHeight > b.maxPageHeight)
      fail(`page height ${wide.pageHeight}px > ${b.maxPageHeight}px`);
    if (wide.distinctFontSizes > budgets.default.maxDistinctFontSizes)
      fail(`${wide.distinctFontSizes} distinct font sizes > ${budgets.default.maxDistinctFontSizes}`);
    if (wide.dropShadowCards > 0)
      fail(`${wide.dropShadowCards} cards carry a drop shadow (hairline, no shadow)`);
  }
  if (narrow && !narrow.error && narrow.hScroll) failures.push(`${name}: horizontal scroll at 390px`);
}

await browser.close();
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2));

for (const [name] of PAGES) {
  const d = out[name]?.[1360];
  if (!d || d.error) {
    console.log(`${name.padEnd(9)} ERROR ${d?.error ?? "no data"}`);
    // An errored page has NOT passed. It could not be measured, so it cannot be
    // within budget. Counting it as a failure stops a dead dev server (or a
    // runtime crash) from printing a false PASS.
    failures.push(`${name}: could not render/measure (${d?.error ?? "no data"})`);
    continue;
  }
  console.log(
    `${name.padEnd(9)} cards ${String(d.cardCount).padStart(2)}  solo ${String(
      Math.round(d.soloRowRate * 100),
    ).padStart(3)}%  sizes ${String(d.distinctFontSizes).padStart(2)}  maxCard ${String(
      d.maxCharsInACard,
    ).padStart(4)}ch  h ${d.pageHeight}px`,
  );
}

if (failures.length) {
  console.error(`\nDESIGN BUDGET BREACHED (${failures.length}):`);
  for (const f of failures) console.error("  x " + f);
  process.exit(1);
}
console.log("\nmeasure_rendered_design: PASS. Every page is within budget.");
