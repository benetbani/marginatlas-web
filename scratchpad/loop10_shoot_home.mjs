/* photograph one home card by a text needle, at 1280 and 375, with geometry. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const slug = process.argv[2], needle = process.argv[3], out = process.argv[4];
const widths = (process.argv[5] || "1280,375").split(",").map(Number);
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href;
const b = await chromium.launch();
for (const w of widths) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: "load" });
  await p.waitForTimeout(300);
  const box = await p.evaluate((needle) => {
    const el = needle.startsWith("#") ? document.querySelector(needle)
      : [...document.querySelectorAll("h1,h2,h3,div,span")].find((e) => (e.textContent || "").trim().toLowerCase().startsWith(needle.toLowerCase()) && e.children.length === 0);
    if (!el) return null;
    const sec = el.closest("section") || el.closest("a,div");
    const r = (e) => { const b = e.getBoundingClientRect(); return { x: Math.round(b.x + scrollX), y: Math.round(b.y + scrollY), width: Math.round(b.width), height: Math.round(b.height) }; };
    return { sec: r(sec) };
  }, needle);
  if (!box) { console.log(w, "NOT FOUND"); await p.close(); continue; }
  console.log(w, JSON.stringify(box));
  const pad = 10;
  await p.screenshot({ path: `${out}-${w}.jpeg`, quality: 90, type: "jpeg", fullPage: true,
    clip: { x: Math.max(0, box.sec.x - pad), y: Math.max(0, box.sec.y - pad), width: Math.min(w, box.sec.width + pad * 2), height: box.sec.height + pad * 2 } });
  await p.close();
}
await b.close();
