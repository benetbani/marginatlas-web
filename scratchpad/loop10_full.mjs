import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const slug = process.argv[2], out = process.argv[3];
const widths = (process.argv[4] || "1280,375").split(",").map(Number);
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href;
const b = await chromium.launch();
for (const w of widths) {
  const p = await b.newPage({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: "load" });
  await p.waitForTimeout(400);
  const h = await p.evaluate(() => document.body.scrollHeight);
  const N = Math.ceil(h / 2400);
  for (let i = 0; i < N; i++) {
    await p.screenshot({ path: `${out}-${w}-p${i}.jpeg`, quality: 80, type: "jpeg", fullPage: true,
      clip: { x: 0, y: i * 2400, width: w, height: Math.min(2400, h - i * 2400) } });
  }
  console.log(w, "height", h, "pages", N);
  await p.close();
}
await b.close();
