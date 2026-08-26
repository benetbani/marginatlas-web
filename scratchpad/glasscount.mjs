import { chromium } from 'playwright';
const b = await chromium.launch();
let total = 0;
for (const n of ['city-london','cell-london-restaurants','industry-restaurants','hood-london']) {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/' + n + '.html');
  await p.waitForTimeout(300);
  const c = await p.evaluate(() => [...document.querySelectorAll('*')].filter(e => getComputedStyle(e).backdropFilter !== 'none').length);
  console.log('  ' + n.padEnd(26) + c); total += c;
  await p.close();
}
console.log('  ' + 'TOTAL'.padEnd(26) + total);
await b.close();
