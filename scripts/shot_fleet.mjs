/**
 * scripts/shot_fleet.mjs , screenshot the spine2 catalog routes.
 * Completes the verification the interrupted fleets never reached.
 *
 *   node scripts/shot_fleet.mjs 3410 serverb hard client
 */
import { chromium } from "playwright-core";
import { mkdirSync, existsSync } from "node:fs";

const [port, ...names] = process.argv.slice(2);
const exe = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
].find((p) => existsSync(p));
if (!exe) { console.error("no chrome"); process.exit(1); }

const out = "E:/atlas/design/loop/fleet-shots";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ executablePath: exe, headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1, reducedMotion: "reduce",
});
const tab = await ctx.newPage();
const errs = [];
tab.on("pageerror", (e) => errs.push(e.message));

for (const n of names) {
  const url = `http://localhost:${port}/dev/spine2-${n}`;
  try {
    await tab.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await tab.waitForTimeout(1400);
    await tab.screenshot({ path: `${out}/${n}.jpeg`, fullPage: true, type: "jpeg", quality: 86 });
    const h = await tab.evaluate(() => document.documentElement.scrollHeight);
    console.log(`${n.padEnd(10)} ok  ${h}px`);
  } catch (e) {
    console.log(`${n.padEnd(10)} ERR ${e.message.split("\n")[0]}`);
  }
}
await browser.close();
console.log(errs.length ? "PAGE ERRORS: " + [...new Set(errs)].join(" | ") : "no page errors");
