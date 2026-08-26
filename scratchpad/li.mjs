import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/hood-london.html');
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
const r = await p.evaluate(() => {
  const card = [...document.querySelectorAll('div')].find(e => (e.textContent||'').includes('Ranked by rent load') && getComputedStyle(e).backdropFilter !== 'none');
  const li = card.querySelector('ol > li');
  const s = getComputedStyle(li);
  return { maxWidth: s.maxWidth, width: s.width, marginLeft: s.marginLeft, marginRight: s.marginRight,
           paddingLeft: s.paddingLeft, boxSizing: s.boxSizing, float: s.float, position: s.position,
           parentMaxWidth: getComputedStyle(li.parentElement).maxWidth,
           font: s.fontSize };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
