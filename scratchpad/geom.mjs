import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/hood-london.html');
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
const r = await p.evaluate(() => {
  const card = [...document.querySelectorAll('div')].find(e => (e.textContent||'').includes('Ranked by rent load') && getComputedStyle(e).backdropFilter !== 'none');
  const cb = card.getBoundingClientRect();
  const hdr = [...card.querySelectorAll('div')].find(e => (e.textContent||'').includes('City x1.00'));
  const hb = hdr.getBoundingClientRect();
  const btn = card.querySelector('button');
  const bb = btn.getBoundingClientRect();
  const track = btn.querySelector('div[role="img"]') || btn.children[2];
  const tb = track.getBoundingClientRect();
  const val = btn.children[btn.children.length - 1].getBoundingClientRect();
  return {
    card: [Math.round(cb.left), Math.round(cb.right), Math.round(cb.width)],
    headerCell: [Math.round(hb.left), Math.round(hb.right)],
    row: [Math.round(bb.left), Math.round(bb.right)],
    barTrack: [Math.round(tb.left), Math.round(tb.right)],
    valueCell: [Math.round(val.left), Math.round(val.right)],
  };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
