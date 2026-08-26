import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
await p.goto('file:///E:/atlas/design/PAGE-SHEET-2026-08-25.html');
await p.waitForTimeout(800);
const r = await p.evaluate(() => ({
  imgs: [...document.images].length,
  broken: [...document.images].filter(i => !i.naturalWidth).length,
  h: document.documentElement.scrollHeight,
  hscroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
}));
console.log('  images ' + r.imgs + ', broken ' + r.broken + ', page ' + r.h + 'px, h-scroll ' + r.hscroll);
await p.screenshot({ path: 'scratchpad/shots-glass/sheet-top.jpeg', type: 'jpeg', quality: 88, clip: { x:0, y:0, width:1280, height:1000 } });
await b.close();
