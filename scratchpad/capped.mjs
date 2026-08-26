import { chromium } from 'playwright';
const b = await chromium.launch();
for (const n of ['city-london','cell-london-restaurants','industry-restaurants','hood-london']) {
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/' + n + '.html');
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    let prose = 0, structural = [], total = 0;
    for (const li of document.querySelectorAll('main li')) {
      const s = getComputedStyle(li);
      if (s.maxWidth === 'none') continue;
      total++;
      const parentW = li.parentElement.getBoundingClientRect().width;
      const cap = parseFloat(s.maxWidth);
      const squeezed = parentW - cap > 12;
      const isStructural = !!li.querySelector('button,a,svg,table,[role="img"]') || getComputedStyle(li.firstElementChild || li).display.includes('grid');
      if (!squeezed) continue;
      if (isStructural) structural.push(Math.round(parentW - cap)); else prose++;
    }
    return { total, prose, structural: structural.length, lost: structural.length ? Math.max(...structural) : 0 };
  });
  console.log(`  ${n.padEnd(26)} ${String(r.total).padStart(3)} capped list items, ${String(r.structural).padStart(2)} of them structural and squeezed (up to ${r.lost}px lost), ${r.prose} prose`);
  await p.close();
}
await b.close();
