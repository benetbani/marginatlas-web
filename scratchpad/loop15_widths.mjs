/* loop15: does any ledger figure or label overflow its own column, at any width? */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL("E:/atlas/website/docs/loop/artifacts/final-pages/home.html").href;
const b = await chromium.launch();
for (const w of [375, 640, 768, 900, 1024, 1280, 1440]) {
  const p = await b.newPage({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const h2 = [...document.querySelectorAll("h2")].find((e) => e.textContent.trim() === "What the atlas holds");
    const card = h2.closest(".atlas-card");
    const out = [];
    for (const a of card.querySelectorAll("a")) {
      const cw = a.getBoundingClientRect().width;
      const cs = getComputedStyle(a);
      const inner = cw - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      for (const d of a.children) {
        /* measure the real text width with a range, not the block's own width */
        const rg = document.createRange();
        rg.selectNodeContents(d);
        const tw = rg.getBoundingClientRect().width;
        out.push({ t: d.textContent.trim().slice(0, 14), text: Math.round(tw), col: Math.round(inner), over: tw > inner + 0.5 });
      }
    }
    return out;
  });
  const bad = r.filter((x) => x.over);
  console.log(String(w).padStart(5), bad.length === 0 ? "ok, nothing overflows its column" : "OVERFLOW: " + bad.map((x) => `"${x.t}" ${x.text}px in ${x.col}px`).join(" | "));
  await p.close();
}
await b.close();
