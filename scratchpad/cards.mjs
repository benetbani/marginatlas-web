import { chromium } from 'playwright';
const b = await chromium.launch();
for (const name of ['hood-london','city-london']) {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/' + name + '.html');
  await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    const out = {};
    for (const e of document.querySelectorAll('div,section,article')) {
      const s = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      if (r.width < 180 || r.height < 40) continue;
      const hasBorder = s.borderTopWidth !== '0px';
      const bg = s.backgroundColor;
      if (!hasBorder || bg === 'rgba(0, 0, 0, 0)') continue;
      const k = `${bg} | radius ${s.borderTopLeftRadius} | pad ${s.paddingTop} | blur ${s.backdropFilter} | shadow ${s.boxShadow === 'none' ? 'none' : 'yes'}`;
      out[k] = (out[k] || 0) + 1;
    }
    return out;
  });
  console.log('\n  ' + name);
  for (const [k, n] of Object.entries(r).sort((a,b)=>b[1]-a[1])) console.log('    ' + String(n).padStart(3) + '  ' + k);
  await p.close();
}
await b.close();
