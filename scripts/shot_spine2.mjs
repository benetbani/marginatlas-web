/**
 * scripts/shot_spine2.mjs
 *
 * One-shot verification screenshot of the spine2 catalog story at /dev/spine2.
 * Pattern from scripts/crop_sections.mjs (playwright-core + local Chrome).
 *
 * Usage: node scripts/shot_spine2.mjs [outPath]   (dev server must be running)
 *        PREVIEW_PORT env overrides :3000.
 */
import { chromium } from "playwright-core";
import { existsSync } from "node:fs";

function findChrome() {
  const candidates = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    process.env.LOCALAPPDATA + "/Google/Chrome/Application/chrome.exe",
  ];
  for (const c of candidates) if (c && existsSync(c)) return c;
  throw new Error("Chrome not found");
}

const out = process.argv[2] || "spine2-catalog.png";
const port = process.env.PREVIEW_PORT || "3000";
const url = `http://localhost:${port}/dev/spine2`;

const browser = await chromium.launch({ executablePath: findChrome(), headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const el = page.locator("#spine2");
await el.waitFor({ state: "attached", timeout: 120000 });
// The root layout's sticky site header overlays the top of the element
// screenshot; it is not part of the .av2 system, so hide it for the shot.
await page.addStyleTag({ content: "body>header,body>nav{visibility:hidden!important}" });
await el.scrollIntoViewIfNeeded();
await page.waitForTimeout(1200); // fonts settle
await el.screenshot({ path: out, type: "png" });
console.log("wrote", out);
await browser.close();
