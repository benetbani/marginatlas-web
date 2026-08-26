import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/cell-london-restaurants.html');
await p.waitForTimeout(500);
const box = await p.evaluate(() => {
  const el = [...document.querySelectorAll('*')].find(e => (e.textContent||'').includes('What to watch') && e.children.length < 40 && e.getBoundingClientRect().width > 300);
  const r = el.getBoundingClientRect();
  window.scrollTo(0, r.top + window.scrollY - 40);
  return null;
});
await p.waitForTimeout(300);
const el = await p.evaluateHandle(() => [...document.querySelectorAll('*')].find(e => (e.textContent||'').includes('What to watch') && e.children.length < 40 && e.getBoundingClientRect().width > 300));
await el.asElement().screenshot({ path: 'scratchpad/shots-glass/risks.jpeg', type: 'jpeg', quality: 88 });
console.log('  cropped the risk card');
await b.close();
