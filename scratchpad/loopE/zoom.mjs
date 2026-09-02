import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const [slug, sel, out, W, x0, y0, dx, dy] = process.argv.slice(2);
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +W, height: 1400 }, deviceScaleFactor: 4 });
await p.goto(url, { waitUntil: "load" });
await p.evaluate(() => document.fonts.ready);
const el = await p.$(sel); const box = await el.boundingBox();
await p.screenshot({ path: out, quality: 92, type: "jpeg", fullPage: true,
  clip: { x: box.x + (+x0), y: box.y + (+y0), width: +dx, height: +dy } });
console.log(JSON.stringify(box));
await b.close();
