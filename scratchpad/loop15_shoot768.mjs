import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL("E:/atlas/website/docs/loop/artifacts/final-pages/home.html").href;
const b = await chromium.launch();
for (const w of [768, 900]) {
  const p = await b.newPage({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const box = await p.evaluate(() => {
    const h2 = [...document.querySelectorAll("h2")].find((e) => e.textContent.trim() === "What the atlas holds");
    const c = h2.closest(".atlas-card").getBoundingClientRect();
    return { x: Math.round(c.x), y: Math.round(c.y + scrollY), width: Math.round(c.width), height: Math.round(c.height) };
  });
  await p.screenshot({ path: `scratchpad/loop15/c17-${w}.jpeg`, quality: 88, type: "jpeg", fullPage: true, clip: { x: box.x - 10, y: box.y - 10, width: box.width + 20, height: box.height + 20 } });
  console.log(w, JSON.stringify(box));
  await p.close();
}
await b.close();
