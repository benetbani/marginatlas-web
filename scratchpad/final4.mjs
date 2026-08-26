import { chromium } from 'playwright';
const b = await chromium.launch();
for (const n of ['city-london','cell-london-restaurants','industry-restaurants','hood-london']) {
  const p = await b.newPage({ viewport: { width: 1280, height: 1200 } });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/' + n + '.html');
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
  await p.screenshot({ path: `scratchpad/shots-glass/FINAL-${n}.jpeg`, type: 'jpeg', quality: 70, fullPage: true });
  console.log('  ' + n);
  await p.close();
}
await b.close();
