import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/industry-restaurants.html');
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
const r = await p.evaluate(() => {
  const el = [...document.querySelectorAll('*')].find(e => [...e.childNodes].some(x => x.nodeType===3 && x.textContent.includes('Lease terms misjudged')));
  const head = [...document.querySelectorAll('*')].find(e => [...e.childNodes].some(x => x.nodeType===3 && x.textContent.trim()==='The next move'));
  const det = el && el.closest('details');
  return {
    myth: el ? { rect: el.getBoundingClientRect().toJSON(), display: getComputedStyle(el).display } : null,
    inDetails: !!det, detailsOpen: det ? det.open : null,
    detailsRect: det ? det.getBoundingClientRect().toJSON() : null,
    head: head ? head.getBoundingClientRect().toJSON() : null,
    openDetailsOnPage: document.querySelectorAll('details[open]').length,
    totalDetails: document.querySelectorAll('details').length,
  };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
