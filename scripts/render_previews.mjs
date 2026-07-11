/**
 * scripts/render_previews.mjs
 *
 * The review-cycle render step (E:\atlas\rules\REVIEW-CYCLE.md step 1), made permanent.
 * Renders ONE dev route through a real browser (React streaming resolves), inlines all
 * same-origin CSS, strips scripts/stylesheets, neutralizes the offline Unsplash bg, and
 * writes a self-contained HTML the founder opens himself.
 *
 * Usage:  node scripts/render_previews.mjs <page> [date]
 *         <page> = cell | city | country | industry | hood | home
 *         PREVIEW_PORT env overrides the default :3000.
 * Needs:  the dev server running. ONE page per invocation,
 *         the 8GB box cannot hold a fresh compile + headless Chrome for all six at once.
 * Output: E:\atlas\previews\candidate\<page>-<date>.html
 */
import { chromium } from "playwright-core";
import { writeFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const ROUTES = {
  cell: "/dev/spine-cell",
  city: "/dev/spine-city",
  country: "/dev/spine",
  industry: "/dev/spine-industry",
  hood: "/dev/spine-hood",
  home: "/dev/home2",
};

const page = process.argv[2];
if (!ROUTES[page]) {
  console.error(`Usage: node scripts/render_previews.mjs <${Object.keys(ROUTES).join("|")}> [date]`);
  process.exit(1);
}
const date = process.argv[3] || new Date().toISOString().slice(0, 10);
const out = `E:/atlas/previews/candidate/${page}-${date}.html`;

function findChrome() {
  if (process.env.CHROME_EXE && existsSync(process.env.CHROME_EXE)) return process.env.CHROME_EXE;
  const candidates = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    process.env.LOCALAPPDATA + "/Google/Chrome/Application/chrome.exe",
  ];
  for (const c of candidates) if (c && existsSync(c)) return c;
  try {
    // playwright's own cached chromium, if installed
    const list = execSync("npx playwright install --dry-run chromium 2>&1", { encoding: "utf8" });
    const m = /browsers[\\/].*?chrome(?:\.exe)?/i.exec(list);
    if (m) return m[0];
  } catch {}
  return null;
}

const exe = findChrome();
if (!exe) { console.error("No Chrome found. Set CHROME_EXE."); process.exit(1); }

const browser = await chromium.launch({ executablePath: exe, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const tab = await ctx.newPage();
const PORT = process.env.PREVIEW_PORT || "3000";
await tab.goto(`http://localhost:${PORT}${ROUTES[page]}`, { waitUntil: "networkidle", timeout: 120000 });
await tab.waitForSelector("h2", { timeout: 60000 });
// let streaming + fonts settle
await tab.waitForTimeout(1500);

const html = await tab.evaluate(async () => {
  // inline all same-origin stylesheets into one <style>
  let css = "";
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) css += rule.cssText + "\n";
    } catch { /* cross-origin: skip */ }
  }
  document.querySelectorAll('link[rel="stylesheet"], script').forEach((el) => el.remove());
  // neutralize remote background images (offline-safe)
  document.querySelectorAll("[style]").forEach((el) => {
    if (/url\(.*unsplash/i.test(el.getAttribute("style") || "")) el.style.backgroundImage = "none";
  });
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
  return document.documentElement.outerHTML;
});

writeFileSync(out, "<!doctype html>\n" + html, "utf8");
console.log(`written ${out} (${Math.round(html.length / 1024)} KB)`);
await browser.close();
