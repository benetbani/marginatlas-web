import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const [slug, sel, out, W] = process.argv.slice(2);
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +W, height: 1400 }, deviceScaleFactor: 2 });
await p.goto(url, { waitUntil: "load" });
await p.evaluate(() => document.fonts.ready);
const box = await p.evaluate((sel) => { const e = document.querySelector(sel).parentElement; const b = e.getBoundingClientRect();
  return { x: b.x + scrollX, y: b.y + scrollY, width: b.width, height: b.height }; }, sel);
await p.screenshot({ path: out, quality: 88, type: "jpeg", fullPage: true,
  clip: { x: Math.max(0, box.x - 8), y: Math.max(0, box.y - 8), width: Math.min(+W, box.width + 16), height: box.height + 16 } });
console.log(JSON.stringify(box));
await b.close();
