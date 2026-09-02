import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/country-gb-new.html`).href;
const NAMES = ["Ho Chi Minh City","Rio de Janeiro","San Francisco","Washington DC","Buenos Aires","Philadelphia","Johannesburg","Birmingham","London"];
const b = await chromium.launch();
for (const [w, rule] of [[1024,"repeat(auto-fill,minmax(8.5rem,1fr))"],[1280,"repeat(auto-fill,minmax(8.5rem,1fr))"],[1024,"CURRENT"],[375,"CURRENT2"]]) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const res = await p.evaluate(({ NAMES, rule }) => {
    const g = document.querySelector('#cities .grid');
    const proto = g.children[0].cloneNode(true);
    g.innerHTML = "";
    for (const n of NAMES) { const c = proto.cloneNode(true); const spans=c.querySelectorAll('span.truncate'); spans[0].textContent=n; spans[1].textContent="Region"; g.appendChild(c); }
    if (rule.startsWith("repeat")) g.style.gridTemplateColumns = rule;
    else if (rule === "CURRENT2") g.style.gridTemplateColumns = "repeat(2,minmax(0,1fr))";
    const out=[]; for (const c of g.children) { const s=c.querySelector('span.truncate');
      out.push({ name:s.textContent, tile:Math.round(c.getBoundingClientRect().width), need:s.scrollWidth, have:s.clientWidth, cut:s.scrollWidth>s.clientWidth+0.5 }); }
    return out;
  }, { NAMES, rule });
  console.log(`--- ${w} ${rule} --- tile=${res[0].tile}`);
  for (const r of res) console.log(`  ${r.cut?"CUT ":"ok  "} ${r.name.padEnd(18)} need ${r.need} have ${r.have}`);
  await p.close();
}
await b.close();
