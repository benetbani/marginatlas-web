import { chromium } from 'playwright';
const lum = ([r,g,b]) => { const f = c => { c/=255; return c<=0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); };
  return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
const ratio = (a,b) => { const [x,y]=[lum(a),lum(b)].sort((m,n)=>n-m); return (x+0.05)/(y+0.05); };
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/city-london.html');
await p.waitForTimeout(600);
// find every FIGURE (.fig) inside a glass card, sample the pixel behind it
const spots = await p.evaluate(() => {
  const out = [];
  for (const f of document.querySelectorAll('.fig')) {
    const card = f.closest('[style*="backdrop"]') || f.closest('div');
    const s = getComputedStyle(card); if (s.backdropFilter === 'none') continue;
    const r = f.getBoundingClientRect();
    if (r.width < 8 || r.top < 0 || r.bottom > 1000) continue;
    out.push({ x: Math.round(r.left - 6), y: Math.round(r.top + r.height/2),
      color: getComputedStyle(f).color, txt: f.textContent.trim().slice(0,14) });
    if (out.length >= 8) break;
  }
  return out;
});
const buf = await p.screenshot({ clip: { x:0, y:0, width:1280, height:1000 } });
const { createCanvas, loadImage } = await import('canvas').catch(()=>({}));
if (!createCanvas) {
  // fall back: use the browser itself to read pixels from a canvas of the shot
  const b64 = buf.toString('base64');
  const px = await p.evaluate(async ({b64, spots}) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64;
    await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    c.getContext('2d').drawImage(img, 0, 0);
    const ctx = c.getContext('2d');
    return spots.map(s => { const d = ctx.getImageData(s.x, s.y, 1, 1).data; return { ...s, bg: [d[0],d[1],d[2]] }; });
  }, { b64, spots });
  console.log('\n  FIGURE CONTRAST, sampled from the real composited pixels\n');
  for (const s of px) {
    const m = s.color.match(/\d+/g).slice(0,3).map(Number);
    const r = ratio(m, s.bg);
    console.log(`   ${r.toFixed(2).padStart(6)}  ${r>=4.5?'AA pass':(r>=3?'large-only':'FAIL   ')}   rgb(${s.bg.join(',')}) behind  "${s.txt}"`);
  }
}
await b.close();
