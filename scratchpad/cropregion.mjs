import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 3400 }, deviceScaleFactor: 2 });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/industry-restaurants.html');
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
await p.screenshot({ path: 'scratchpad/shots-glass/overlap.jpeg', type: 'jpeg', quality: 92,
  clip: { x: 150, y: 2740, width: 1150, height: 300 } });
console.log('  cropped');
await b.close();
