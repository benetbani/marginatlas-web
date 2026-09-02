/* Measure the card's blocks and the empty rectangles step 7 tests for. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const b = await chromium.launch();
for (const w of [1280, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 } });
  await p.goto(pathToFileURL("E:/atlas/website/docs/loop/artifacts/final-pages/home.html").href, { waitUntil: "load" });
  await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const lbl = [...document.querySelectorAll("div")].find(e => (e.textContent||"").trim() === "The owner keeps");
    const card = lbl.closest("a");
    const grid = lbl.parentElement.parentElement;
    const left = lbl.parentElement, right = left.nextElementSibling;
    const bar = card.querySelector('[data-idea="I3"]');
    const g = (e) => { const r = e.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y+scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
    /* the true inked width of a text node, not its box */
    const ink = (e) => { const rg = document.createRange(); rg.selectNodeContents(e); const r = rg.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; };
    const texts = {};
    for (const e of card.querySelectorAll("div,p,h2,span")) {
      const t = (e.textContent||"").trim();
      if (t && e.children.length === 0) texts[t.slice(0,42)] = { ...g(e), ink: ink(e).w, fs: getComputedStyle(e).fontSize };
    }
    const segs = [...bar.children].map(s => ({ w: Math.round(s.getBoundingClientRect().width), bg: getComputedStyle(s).backgroundColor, label: (s.textContent||"").trim() }));
    return { card: g(card), grid: g(grid), left: g(left), right: g(right), bar: g(bar), segs, texts, barBorder: getComputedStyle(bar).borderColor };
  });
  console.log("W=", w, JSON.stringify(r, null, 1));
  await p.close();
}
await b.close();
