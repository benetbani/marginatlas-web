import { chromium } from 'playwright';
import { writeFileSync, readFileSync } from 'node:fs';
const b = await chromium.launch();
const shots = {};
for (const [key, name, w, h] of [
  ['city', 'city-london', 1280, 700],
  ['trade', 'cell-london-restaurants', 1280, 700],
  ['across', 'industry-restaurants', 1280, 700],
  ['hood', 'hood-london', 1280, 700],
  ['cityPhone', 'city-london', 390, 900],
  ['hoodPhone', 'hood-london', 390, 900],
]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/' + name + '.html');
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  shots[key] = (await p.screenshot({ type: 'jpeg', quality: 72 })).toString('base64');
  await p.close();
}
await b.close();
writeFileSync('scratchpad/review/shots.json', JSON.stringify(shots));
console.log('  ' + Object.keys(shots).length + ' crops, ' + Math.round(JSON.stringify(shots).length/1024) + 'KB');
