import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [375, 1280]) {
  const p = await b.newPage({ viewport: { width: w, height: 1000 }, deviceScaleFactor: 2 });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/cell-london-restaurants.html');
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  const el = await p.evaluateHandle(() => {
    const c = [...document.querySelectorAll('div')].filter(e => (e.textContent||'').includes('What to watch') && getComputedStyle(e).backdropFilter !== 'none');
    return c[c.length - 1];
  });
  await el.asElement().scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
  await el.asElement().screenshot({ path: `scratchpad/shots-glass/risks-${w}.jpeg`, type: 'jpeg', quality: 88 });
  console.log('  risks @' + w);
  await p.close();
}
await b.close();
