import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const slug = process.argv[2], sel = process.argv[3], out = process.argv[4];
const widths = (process.argv[5] || "1280").split(",").map(Number);
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href;
const b = await chromium.launch();
for (const w of widths) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const el = await p.$(sel);
  if (!el) { console.log(w, "MISS"); await p.close(); continue; }
  const box = await el.boundingBox();
  await p.screenshot({ path: `${out}-${w}.jpeg`, quality: 88, type: "jpeg", fullPage: true,
    clip: { x: Math.max(0, box.x - 10), y: Math.max(0, box.y - 10), width: Math.min(w, box.width + 20), height: box.height + 20 } });
  console.log(w, JSON.stringify(box));
  await p.close();
}
await b.close();
