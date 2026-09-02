import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const slug = process.argv[2];
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href;
const b = await chromium.launch();
for (const w of [1280, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 } });
  await p.goto(url, { waitUntil: "load" });
  await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const lbl = [...document.querySelectorAll("div")].find(e => (e.textContent||"").trim() === "Takes in");
    const card = lbl && lbl.closest("a");
    const sec = card && card.closest("section");
    const g = (e) => { if(!e) return null; const b=e.getBoundingClientRect(); return {x:Math.round(b.x),y:Math.round(b.y+scrollY),w:Math.round(b.width),h:Math.round(b.height)};};
    const texts = {};
    for (const t of ["Takes in","The owner keeps"]) {
      const el = [...document.querySelectorAll("div")].find(e => (e.textContent||"").trim() === t);
      texts[t] = g(el);
    }
    const figs = [...card.querySelectorAll("div")].filter(e => /^\$\d/.test((e.textContent||"").trim()) && e.children.length===0).map(e=>({t:e.textContent.trim(), ...g(e), fs: getComputedStyle(e).fontSize}));
    const rail = card.querySelector('[role="img"]');
    const fill = rail && rail.firstElementChild;
    const p_ = card.querySelector("p");
    const h2 = card.querySelector("h2");
    return { section: g(sec), card: g(card), texts, figs, rail: g(rail), fill: g(fill), para: {...g(p_), fs: p_?getComputedStyle(p_).fontSize:null}, h2: {...g(h2), fs: h2?getComputedStyle(h2).fontSize:null},
      cardPad: card ? getComputedStyle(card).padding : null };
  });
  console.log("W=", w, JSON.stringify(r, null, 1));
  await p.close();
}
await b.close();
