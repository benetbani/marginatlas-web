#!/usr/bin/env node
/**
 * shoot_live , photograph a HYDRATED page. The instrument the chart migration
 * cannot proceed without.
 *
 * ================== WHY THIS EXISTS, AND WHY THE OTHER ONE IS NOT ENOUGH ====
 *
 * `scripts/shoot.mjs` renders a route with `react-dom/server` into a static
 * file and serves it. No JavaScript ever runs. That is fine for layout, type and
 * colour, and it is USELESS for anything that draws itself in the browser.
 *
 * recharts measures the DOM. Under the static harness every chart renders as an
 * empty box, by construction, not by accident. The bar chart written on
 * 2026-08-21 sat committed and unverified for exactly this reason, and the whole
 * shadcn migration is charts. So: no live screenshot, no verifiable migration.
 *
 * WHY A SCRIPT AND NOT THE MCP. The Playwright MCP is what
 * `docs/verification-protocol.md` names, and it disconnected mid-session on
 * 2026-08-21 and did not come back. An instrument that can vanish between two
 * tool calls is not an instrument you can build a migration on. `playwright` is
 * already a dependency here (^1.60.0) and Chromium is already downloaded, so
 * this owns its own browser and depends on nothing outside the repo.
 *
 * ============================== USAGE ======================================
 *
 *   node scripts/shoot_live.mjs <url> <outDir> [options]
 *
 *   --widths 1280,375       viewports to shoot. Default 1280,375
 *   --wait-for "<selector>" wait for this before shooting. Use it for charts
 *   --settle 1200           extra ms after load. Default 800
 *   --prefix AFTER-         filename prefix
 *   --full false            viewport-only instead of full page
 *   --timeout 180000        per-navigation budget. The dev server here has been
 *                           measured at 67s for a cold homepage
 *
 * Example, the one this was built for:
 *   node scripts/shoot_live.mjs http://localhost:3210/dev/trade-sections \
 *     docs/loop/artifacts/charts --wait-for ".recharts-bar-rectangle"
 *
 * ============================== TRAPS ======================================
 *
 * RELOAD AFTER EVERY RESIZE. This script navigates again for each width rather
 * than resizing in place, because a bare resize does not re-run layout the way a
 * fresh load does: 12,282px against 32,114px measured on the same file. Do not
 * "optimise" that away.
 *
 * IT REPORTS WHAT IT WAITED FOR AND WHETHER IT ARRIVED. A screenshot of a chart
 * that had not drawn yet is worse than no screenshot, because it looks like
 * evidence. If `--wait-for` times out, the shot is still taken and the result is
 * marked `waitedFor: MISSING`. Read the output, not just the image.
 *
 * IT DOES NOT START A SERVER. Point it at one that is already running. Mixing
 * "start a server" and "take a picture" into one tool is how the previous
 * instrument ended up unable to serve any route but the homepage.
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const argv = process.argv.slice(2);
const [url, outDir] = argv;

if (!url || !outDir) {
  console.error('usage: node scripts/shoot_live.mjs <url> <outDir> [--widths 1280,375] [--wait-for "sel"]');
  process.exit(2);
}

const opt = (name, fallback) => {
  const i = argv.indexOf("--" + name);
  return i === -1 ? fallback : argv[i + 1];
};

const widths = String(opt("widths", "1280,375")).split(",").map((w) => parseInt(w, 10));
const waitFor = opt("wait-for", null);
const settle = parseInt(opt("settle", "800"), 10);
const prefix = opt("prefix", "");
const fullPage = String(opt("full", "true")) !== "false";
const timeout = parseInt(opt("timeout", "180000"), 10);

mkdirSync(outDir, { recursive: true });

const results = [];

const browser = await chromium.launch({ headless: true });

try {
  for (const width of widths) {
    /* A FRESH CONTEXT PER WIDTH, not a resize. See the trap note in the header:
       a bare resize does not re-run layout the way a load does, and a height
       measured after one is fiction. */
    const ctx = await browser.newContext({
      viewport: { width, height: width < 700 ? 812 : 900 },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();

    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e.message).slice(0, 160)));

    const t0 = Date.now();
    await page.goto(url, { waitUntil: "networkidle", timeout });

    let waited = "n/a";
    if (waitFor) {
      try {
        await page.waitForSelector(waitFor, { timeout: 30000, state: "attached" });
        waited = "found";
      } catch {
        /* NOT a silent pass. A picture of a chart that never drew looks exactly
           like a picture of a chart, which is the failure this line exists to
           make loud. */
        waited = "MISSING";
      }
    }

    await page.waitForTimeout(settle);

    const file = join(outDir, `${prefix}${width}.jpeg`);
    await page.screenshot({ path: file, fullPage, type: "jpeg", quality: 90 });

    const dims = await page.evaluate(() => ({
      scrollHeight: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    results.push({
      width,
      file,
      seconds: +((Date.now() - t0) / 1000).toFixed(1),
      waitedFor: waited,
      height: dims.scrollHeight,
      /* The 375 overflow check, free, because we are already here. */
      horizontalOverflow: dims.scrollWidth > dims.clientWidth
        ? `${dims.scrollWidth} > ${dims.clientWidth}`
        : false,
      pageErrors: errors.slice(0, 3),
    });

    await ctx.close();
  }
} finally {
  await browser.close();
}

for (const r of results) {
  const flag = r.waitedFor === "MISSING" ? "  !! WAIT TARGET NEVER APPEARED" : "";
  console.log(
    `  ${String(r.width).padStart(4)}  ${r.height}px tall  ${r.seconds}s  ` +
      `wait:${r.waitedFor}${r.horizontalOverflow ? `  OVERFLOW ${r.horizontalOverflow}` : ""}${flag}`,
  );
  if (r.pageErrors.length) r.pageErrors.forEach((e) => console.log(`        page error: ${e}`));
  console.log(`        ${r.file}`);
}

writeFileSync(join(outDir, "shoot-report.json"), JSON.stringify(results, null, 2) + "\n");

/* Exit non-zero when a requested wait target never appeared, so a CI or a loop
   cannot mistake an empty chart for a verified one. */
process.exit(results.some((r) => r.waitedFor === "MISSING") ? 1 : 0);
