import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const w = Number(process.argv[2] || 1280);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: w, height: 1400 } });
await p.goto(pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/hood-london.html`).href, { waitUntil: "load" });
const out = await p.evaluate(() => {
  const lad = document.querySelector('[data-idea="I4"]');
  if (!lad) return null;
  const box = lad.getBoundingClientRect();
  const rows = [...lad.querySelectorAll("li")].map((li) => {
    const spans = [...li.querySelectorAll("div,span")].filter((e) => e.children.length === 0 && e.textContent.trim());
    return spans.map((s) => {
      const r = s.getBoundingClientRect();
      const range = document.createRange(); range.selectNodeContents(s);
      const tr = range.getBoundingClientRect();
      const lh = parseFloat(getComputedStyle(s).lineHeight) || 16;
      return { t: s.textContent.trim().slice(0, 40), box: Math.round(r.width), ink: Math.round(tr.width), lines: Math.round(tr.height / lh), size: getComputedStyle(s).fontSize };
    });
  });
  const blurb = document.querySelector("#detail p, #detail div");
  return { ladder: { w: Math.round(box.width), h: Math.round(box.height) }, rows };
});
console.log(JSON.stringify(out, null, 1));
await b.close();
