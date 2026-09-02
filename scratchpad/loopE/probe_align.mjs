import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/country-gb-new.html`).href;
const b = await chromium.launch();
for (const w of [1280, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const o = await p.evaluate(() => {
    // exact ink box of a text node's glyphs, via Range
    const inkbox = (el) => { const r = document.createRange(); r.selectNodeContents(el); const b = r.getBoundingClientRect();
      return { l: +b.left.toFixed(1), r: +b.right.toFixed(1), t: +b.top.toFixed(1), b: +b.bottom.toFixed(1) }; };
    const money = document.querySelector('#money');
    const rowsEls = [...money.querySelectorAll('a')];
    const heads = [...money.querySelectorAll('span.text-right')].filter(e => /KEPT|TO OPEN/i.test(e.textContent));
    const kept = rowsEls.map(a => inkbox(a.querySelectorAll('.fig')[0]));
    const open = rowsEls.map(a => inkbox(a.querySelectorAll('.fig')[1]));
    const names = rowsEls.map(a => inkbox(a.firstElementChild));
    const cust = document.querySelector('#customers');
    const spans = [...cust.querySelectorAll('*')].filter(e => e.children.length === 0 && e.textContent.trim().length);
    const brk = spans.filter(e => /^\$|tenth|Typical/i.test(e.textContent.trim())).map(e => ({ t: e.textContent.trim(), ...inkbox(e) }));
    const svgs = [...cust.querySelectorAll('svg')].map(s => { const b = s.getBoundingClientRect(); return { vb: s.getAttribute('viewBox'), l:+b.left.toFixed(1), r:+b.right.toFixed(1), t:+b.top.toFixed(1), b:+b.bottom.toFixed(1) }; });
    return {
      moneyBox: (() => { const b = money.getBoundingClientRect(); return { l: b.left, r: b.right }; })(),
      headRights: heads.map(h => ({ t: h.textContent.trim(), ...inkbox(h) })),
      keptRights: kept.map(k => k.r), openRights: open.map(k => k.r), nameLefts: names.map(n => n.l),
      nameRightMax: Math.max(...names.map(n => n.r)), keptLeftMin: Math.min(...kept.map(k => k.l)),
      brk, svgs,
    };
  });
  console.log("=== " + w + " ===\n" + JSON.stringify(o, null, 1));
  await p.close();
}
await b.close();
