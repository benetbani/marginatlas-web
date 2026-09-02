import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/country-gb-new.html`).href;
const b = await chromium.launch();
const lineTexts = (el) => {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const rows = new Map();
  while (walker.nextNode()) {
    const node = walker.currentNode; const t = node.textContent;
    for (let i = 0; i < t.length; i++) {
      const r = document.createRange(); r.setStart(node, i); r.setEnd(node, i + 1);
      const rect = r.getBoundingClientRect(); if (!rect.width && !rect.height) continue;
      const key = Math.round(rect.top);
      rows.set(key, (rows.get(key) || "") + t[i]);
    }
  }
  return [...rows.entries()].sort((a, b) => a[0] - b[0]).map(([, s]) => s);
};
for (const w of [1280, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const res = await p.evaluate(({ src }) => {
    const lineTexts = eval("(" + src + ")");
    const sub = document.querySelector('#take p');
    const clause = document.querySelector('#take .fig').parentElement.querySelector('div:last-child');
    const cap = document.querySelector('#peers p');
    const out = {};
    for (const [name, el] of [["subtitle", sub], ["clause", clause], ["caveat", cap]]) {
      out[name] = { now: lineTexts(el) };
      el.style.textWrap = "balance"; out[name].balance = lineTexts(el);
      el.style.textWrap = "pretty"; out[name].pretty = lineTexts(el);
      el.style.textWrap = "";
    }
    return out;
  }, { src: lineTexts.toString() });
  console.log("=== " + w + " ===");
  for (const k of Object.keys(res)) { console.log(" " + k); for (const m of ["now","balance","pretty"]) console.log("   " + m.padEnd(8) + JSON.stringify(res[k][m])); }
  await p.close();
}
await b.close();
