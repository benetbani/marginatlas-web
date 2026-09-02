import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/country-gb-new.html`).href;
const b = await chromium.launch();
for (const w of [1280, 1024, 900, 768, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const o = await p.evaluate(() => {
    const R = (e) => { const b = e.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; };
    const money = document.querySelector('#money'), cust = document.querySelector('#customers'), ch = document.querySelector('#character');
    const chBand = ch ? ch.parentElement : null;
    const chCards = chBand ? [...chBand.children].map(R) : null;
    // bracket internals
    const br = cust ? cust.querySelector('[data-idea="I12"]') || cust.querySelector('svg')?.closest('div') : null;
    const figs = cust ? [...cust.querySelectorAll('.fig, span, div')].filter(e => /^\$[\d,\.KM]+$/.test(e.textContent.trim()) && e.children.length === 0).map(e => ({ t: e.textContent.trim(), ...R(e) })) : null;
    const svg = cust ? cust.querySelector('svg') : null;
    return { moneyBand: R(money.parentElement), money: R(money), cust: cust ? R(cust) : null,
      charBand: chBand ? R(chBand) : null, charCards: chCards,
      brFigs: figs, svg: svg ? R(svg) : null };
  });
  console.log("=== " + w + " ===\n" + JSON.stringify(o));
  await p.close();
}
await b.close();
