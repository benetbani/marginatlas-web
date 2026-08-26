import { chromium } from 'playwright';
const b = await chromium.launch();
for (const n of ['city-london','cell-london-restaurants','industry-restaurants','hood-london']) {
  const p = await b.newPage({ viewport: { width: 375, height: 1200 } });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/' + n + '.html');
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  await p.screenshot({ path: `scratchpad/shots-glass/P375-${n}.jpeg`, type: 'jpeg', quality: 68, fullPage: true });
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  const over = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  console.log(`  ${n.padEnd(26)} ${h}px tall  ${over ? 'HORIZONTAL SCROLL' : 'no h-scroll'}`);
  await p.close();
}
await b.close();
