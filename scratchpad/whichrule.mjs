import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/hood-london.html');
await p.waitForTimeout(300);
const r = await p.evaluate(() => {
  const card = [...document.querySelectorAll('div')].find(e => (e.textContent||'').includes('Ranked by rent load') && getComputedStyle(e).backdropFilter !== 'none');
  const li = card.querySelector('ol > li');
  const hits = [];
  for (const sheet of document.styleSheets) {
    let rules; try { rules = sheet.cssRules; } catch { continue; }
    const walk = (rs) => { for (const r of rs) {
      if (r.cssRules) { walk(r.cssRules); continue; }
      if (!r.selectorText || !r.style || !r.style.maxWidth) continue;
      try { if (li.matches(r.selectorText)) hits.push(r.selectorText + ' { max-width: ' + r.style.maxWidth + ' }'); } catch {}
    }};
    walk(rules);
  }
  return hits;
});
r.forEach(x => console.log('  ' + x));
if (!r.length) console.log('  no stylesheet rule matches; it is inline or inherited');
await b.close();
