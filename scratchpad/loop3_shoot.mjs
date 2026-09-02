/* throwaway: photograph one card (by #id or by kicker text) at 1280 and 375,
   plus the whole band it sits in, and report its measured geometry. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";

const page_ = process.argv[2];                    // final-page slug
const needle = process.argv[3];                   // kicker text to locate
const out = process.argv[4];                      // output prefix
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${page_}.html`).href;
const b = await chromium.launch();
for (const w of [1280, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: "load" });
  await p.waitForTimeout(250);
  const box = await p.evaluate((needle) => {
    const h = needle.startsWith("#") ? document.querySelector(needle) : [...document.querySelectorAll("h3,h2")].find((e) => e.textContent.trim().toLowerCase() === needle.toLowerCase()) || [...document.querySelectorAll("h3,h2")].find((e) => e.textContent.trim().toLowerCase().includes(needle.toLowerCase()));
    if (!h) return null;
    let card = h.matches && h.matches("div[class*='rounded']") ? h : h.closest("section,article,div[class*='rounded']");
    // climb to the card surface (the Box), then to its band parent
    let el = h;
    for (let i = 0; i < 8 && el; i++) { el = el.parentElement; if (el && /rounded-\[/.test(el.className || "")) { card = el; break; } }
    const band = card && card.parentElement;
    const r = (e) => { const b = e.getBoundingClientRect(); return { x: Math.round(b.x + scrollX), y: Math.round(b.y + scrollY), width: Math.round(b.width), height: Math.round(b.height) }; };
    return { card: r(card), band: band ? r(band) : null, cls: (card.className || "").slice(0, 120) };
  }, needle);
  if (!box) { console.log(w, "NOT FOUND"); await p.close(); continue; }
  console.log(w, JSON.stringify(box));
  const pad = 12;
  const clip = { x: Math.max(0, box.card.x - pad), y: Math.max(0, box.card.y - pad), width: Math.min(w, box.card.width + pad * 2), height: box.card.height + pad * 2 };
  await p.screenshot({ path: `${out}-${w}.jpeg`, quality: 88, type: "jpeg", clip, fullPage: true });
  if (box.band) {
    const bclip = { x: Math.max(0, box.band.x - pad), y: Math.max(0, box.band.y - pad), width: Math.min(w, box.band.width + pad * 2), height: box.band.height + pad * 2 };
    await p.screenshot({ path: `${out}-band-${w}.jpeg`, quality: 88, type: "jpeg", clip: bclip, fullPage: true });
  }
  await p.close();
}
await b.close();
