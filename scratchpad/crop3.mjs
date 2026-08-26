import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [1280, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1000 }, deviceScaleFactor: 2 });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/hood-london.html');
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  const el = await p.evaluateHandle(() => [...document.querySelectorAll('div')].find(e => (e.textContent||'').includes('Ranked by rent load') && getComputedStyle(e).backdropFilter !== 'none'));
  await el.asElement().scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
  await el.asElement().screenshot({ path: `scratchpad/shots-glass/strip-${w}.jpeg`, type: 'jpeg', quality: 90 });
  console.log('  strip @' + w);
  await p.close();
}
await b.close();
