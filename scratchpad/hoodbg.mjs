import { chromium } from 'playwright';
const b = await chromium.launch();
for (const n of ['hood-london','city-london']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 2600 } });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/' + n + '.html');
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  const r = await p.evaluate(() => [...document.querySelectorAll('.spine-frame-layer')].map(e => {
    const s = getComputedStyle(e);
    return { op: s.opacity, img: s.backgroundImage.slice(0, 34), h: Math.round(e.getBoundingClientRect().height) };
  }));
  console.log('  ' + n); r.forEach(x => console.log('     opacity ' + x.op + '  h=' + x.h + '  ' + x.img));
  await p.close();
}
await b.close();
