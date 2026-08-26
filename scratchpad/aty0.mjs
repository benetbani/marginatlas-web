import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/hood-london.html');
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
const r = await p.evaluate(() => {
  const out = [];
  for (const e of document.querySelectorAll('*')) {
    const own = [...e.childNodes].filter(x => x.nodeType===3 && x.textContent.trim()).map(x=>x.textContent.trim()).join(' ');
    if (!own || own.length < 4) continue;
    const b = e.getBoundingClientRect();
    const top = Math.round(b.top + window.scrollY);
    if (top !== 0) continue;
    out.push(`${e.tagName} w=${Math.round(b.width)} h=${Math.round(b.height)}  "${own.slice(0,40)}"`);
  }
  return out.slice(0, 8);
});
r.forEach(x => console.log('  ' + x));
console.log('  total at y=0: ' + r.length);
await b.close();
