import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
mkdirSync('scratchpad/shots-glass', { recursive: true });
const b = await chromium.launch();
const jobs = [
  ['hood-london', 1280], ['hood-london', 375],
  ['cell-london-restaurants', 375],
];
for (const [name, w] of jobs) {
  const p = await b.newPage({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1 });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/' + name + '.html');
  await p.waitForTimeout(600);
  await p.screenshot({ path: `scratchpad/shots-glass/${name}-${w}.jpeg`, type: 'jpeg', quality: 76, fullPage: true });
  console.log('  shot ' + name + ' @' + w);
  await p.close();
}
await b.close();
