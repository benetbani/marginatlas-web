import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/hood-london.html');
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
const r = await p.evaluate(() => {
  const card = [...document.querySelectorAll('div')].find(e => (e.textContent||'').includes('Ranked by rent load') && getComputedStyle(e).backdropFilter !== 'none');
  const btn = card.querySelector('button');
  const out = [];
  let e = btn;
  while (e && e !== card.parentElement) {
    const s = getComputedStyle(e), b = e.getBoundingClientRect();
    out.push(`${e.tagName.toLowerCase()}${e.className ? '.' + String(e.className).split(' ').slice(0,3).join('.') : ''}  w=${Math.round(b.width)}  display=${s.display}  width=${s.width}`);
    e = e.parentElement;
  }
  return out;
});
r.forEach(x => console.log('  ' + x));
await b.close();
