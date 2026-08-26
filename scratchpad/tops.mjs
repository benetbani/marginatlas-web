import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [name, h] of [['city-london', 320], ['industry-restaurants', 820]]) {
  const p = await b.newPage({ viewport: { width: 1280, height: h }, deviceScaleFactor: 2 });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/' + name + '.html');
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  await p.screenshot({ path: `scratchpad/shots-glass/top-${name}.jpeg`, type: 'jpeg', quality: 88 });
  console.log('  ' + name);
  await p.close();
}
await b.close();
