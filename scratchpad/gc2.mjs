import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
let total = 0;
for (const n of ['city-london','cell-london-restaurants','industry-restaurants','hood-london']) {
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/' + n + '.html');
  const c = await p.evaluate(() => [...document.querySelectorAll('*')].filter(e => getComputedStyle(e).backdropFilter !== 'none').length);
  console.log('  ' + n.padEnd(26) + c); total += c;
}
console.log('  ' + 'TOTAL'.padEnd(26) + total);
await b.close();
