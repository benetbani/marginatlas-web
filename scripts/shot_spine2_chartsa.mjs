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

const out = process.argv[2] || "chartsa.jpeg";
const url = "http://localhost:3404/dev/spine2-chartsa";

const browser = await chromium.launch({ executablePath: findChrome(), headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const el = page.locator("#spine2-chartsa");
await el.waitFor({ state: "attached", timeout: 120000 });
await page.addStyleTag({ content: "body>header,body>nav{visibility:hidden!important}" });
await el.scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);
await el.screenshot({ path: out, type: "jpeg", quality: 85 });
console.log("wrote", out);
await browser.close();
