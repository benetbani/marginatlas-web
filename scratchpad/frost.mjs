import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/city-london.html');
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
const buf = await p.screenshot({ clip: { x: 0, y: 300, width: 1440, height: 300 } });
const px = await p.evaluate(async (b64) => {
  const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const g = c.getContext('2d'); g.drawImage(img, 0, 0);
  const at = (x, y) => { const d = g.getImageData(x, y, 1, 1).data; return `rgb(${d[0]},${d[1]},${d[2]})`; };
  return { farLeftMargin: at(40, 150), nearBand: at(150, 150), insideCard: at(500, 150), rightBand: at(1290, 150), farRight: at(1400, 150) };
}, buf.toString('base64'));
console.log('  sampled across the page at one height:');
for (const [k, v] of Object.entries(px)) console.log('    ' + k.padEnd(16) + v);
await b.close();
