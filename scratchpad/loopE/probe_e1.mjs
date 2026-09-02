import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/country-gb-new.html`).href;
const b = await chromium.launch();
for (const w of [1280, 1024, 900, 768, 640, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const out = await p.evaluate(() => {
    const R = (e) => { const b = e.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; };
    const L = (el) => { const rg = document.createRange(); rg.selectNodeContents(el);
      const rects = [...rg.getClientRects()].filter(x => x.width > 1 && x.height > 1);
      const ys = [...new Set(rects.map(x => Math.round(x.top)))];
      return ys.map(y => { const rs = rects.filter(x => Math.round(x.top) === y); return Math.round(Math.max(...rs.map(a=>a.right)) - Math.min(...rs.map(a=>a.left))); }); };
    const cities = document.querySelector('#cities');
    const grid = cities.querySelector('.grid');
    const tiles = [...grid.children];
    const trunc = tiles.map(t => [...t.querySelectorAll('span.truncate')].map(s => ({ t: s.textContent, cut: s.scrollWidth > s.clientWidth + 0.5, sw: s.scrollWidth, cw: s.clientWidth })));
    const peers = document.querySelector('#peers');
    const cap = peers.querySelector('p');
    const tbl = peers.querySelector('table');
    const heads = tbl ? [...tbl.querySelectorAll('th')].map(th => [th.textContent.trim(), ...R(th)]) : null;
    return {
      citiesBand: R(cities.parentElement), citiesCard: R(cities), grid: R(grid),
      tiles: tiles.map(R), trunc,
      peersCard: R(peers),
      tableVisible: tbl ? getComputedStyle(tbl.closest('div')).display : null,
      heads,
      cap: cap ? { box: R(cap), lines: L(cap) } : null,
    };
  });
  console.log("=== " + w + " ===\n" + JSON.stringify(out));
  await p.close();
}
await b.close();
