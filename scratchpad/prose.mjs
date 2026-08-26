import { chromium } from 'playwright';
const b = await chromium.launch();
for (const name of ['city-london','cell-london-restaurants','industry-restaurants','hood-london']) {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/' + name + '.html');
  await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const seen = new Set(), out = [];
    for (const e of document.querySelectorAll('p,li,span,div,h1,h2,h3,summary')) {
      const own = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim().replace(/\s+/g,' ');
      if (own.length < 30 || seen.has(own)) continue;
      seen.add(own); out.push(own);
    }
    return out;
  });
  console.log('\n################ ' + name + '  (' + r.length + ' passages)');
  r.forEach(t => console.log('  * ' + t));
  await p.close();
}
await b.close();
