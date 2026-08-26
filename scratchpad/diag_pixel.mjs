import { chromium } from "playwright";
const PAGES = ["city-london", "cell-london-restaurants", "industry-restaurants", "hood-london"];
const b = await chromium.launch();
for (const name of PAGES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto(`file:///E:/atlas/website/docs/loop/artifacts/final-pages/${name}.html`);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  // The gate clips (0,300,1440,300) then samples LOCAL (500,150) -> ABS (500,450)
  const info = await p.evaluate(() => {
    const el = document.elementFromPoint(500, 450);
    if (!el) return null;
    const chain = [];
    let cur = el;
    let depth = 0;
    while (cur && depth < 6) {
      const s = getComputedStyle(cur);
      chain.push({
        tag: cur.tagName,
        cls: (cur.className || "").toString().slice(0, 80),
        bg: s.backgroundColor,
        backdrop: s.backdropFilter,
        opacity: s.opacity,
        rect: cur.getBoundingClientRect ? [Math.round(cur.getBoundingClientRect().left), Math.round(cur.getBoundingClientRect().top), Math.round(cur.getBoundingClientRect().width), Math.round(cur.getBoundingClientRect().height)] : null,
      });
      cur = cur.parentElement;
      depth++;
    }
    return chain;
  });
  console.log(`\n=== ${name} @ (500,450) ===`);
  console.log(JSON.stringify(info, null, 1));
  await p.close();
}
await b.close();
