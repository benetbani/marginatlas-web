/* loop15: measure the empty rectangle under the unheld catalogue cell. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL("E:/atlas/website/docs/loop/artifacts/final-pages/home.html").href;
const b = await chromium.launch();
for (const w of [1280, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const grid = document.querySelector('[data-idea="I5"]');
    if (!grid) return { err: "no I5" };
    const card = grid.closest(".atlas-card");
    const cells = [...grid.children].map((c) => {
      const b = c.getBoundingClientRect();
      return { t: (c.textContent || "").trim().slice(0, 26), w: Math.round(b.width), h: Math.round(b.height), x: Math.round(b.x), y: Math.round(b.y + scrollY) };
    });
    const gb = grid.getBoundingClientRect();
    const cb = card.getBoundingClientRect();
    return { card: { w: Math.round(cb.width), h: Math.round(cb.height) }, grid: { w: Math.round(gb.width), h: Math.round(gb.height) }, cells };
  });
  console.log("W", w, JSON.stringify(r, null, 1));
  await p.close();
}
await b.close();
