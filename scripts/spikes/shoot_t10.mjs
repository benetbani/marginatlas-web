import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const OUT = process.argv[2];
const url = pathToFileURL("E:/atlas/website/docs/loop/artifacts/final-pages/country-gb-new.html").href;
const b = await chromium.launch();
for (const w of [375, 768, 1280, 1600]) {
  const p = await b.newPage({ viewport: { width: w, height: 1000 }, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: "networkidle" });
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${OUT}/t10-${w}.png`, fullPage: true });
  // measure the masthead geometry
  const m = await p.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; };
    const fs = (el) => el ? Math.round(parseFloat(getComputedStyle(el).fontSize) * 10) / 10 : null;
    const answer = [...document.querySelectorAll(".fig")].find((e) => /%$/.test(e.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) > 30);
    const nav = q('nav[aria-label="On this page"]');
    const card = q("#take");
    return {
      docW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      card: r(card),
      h1: { box: r(q("h1")), size: fs(q("h1")), weight: q("h1") && getComputedStyle(q("h1")).fontWeight },
      answer: { text: answer && answer.textContent, box: r(answer), size: fs(answer), color: answer && getComputedStyle(answer).color },
      components: [...document.querySelectorAll("#take .fig")].map((e) => ({ t: e.textContent.trim(), s: fs(e), box: r(e) })),
      navVisible: nav ? getComputedStyle(nav).display !== "none" : "absent",
      navBox: nav && getComputedStyle(nav).display !== "none" ? r(nav) : null,
      tiles: [...document.querySelectorAll("#take div[class*=flex-]")].map((e) => ({ t: e.textContent.trim().slice(0, 40), box: r(e), clipped: e.scrollWidth > e.clientWidth + 1 })),
      overflowX: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log(w, JSON.stringify(m, null, 1));
  await p.close();
}
await b.close();
