/* measure candidate strings in the page's own font at the card's own size */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 375, height: 1400 } });
await p.goto(pathToFileURL("E:/atlas/website/docs/loop/artifacts/final-pages/home.html").href, { waitUntil: "load" });
await p.waitForTimeout(300);
const out = await p.evaluate(() => {
  const el = [...document.querySelectorAll("div")].find(e => (e.textContent||"").trim().startsWith("of $503K"));
  const cs = getComputedStyle(el);
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font:${cs.font};letter-spacing:${cs.letterSpacing}`;
  document.body.appendChild(probe);
  const m = (s) => { probe.textContent = s; return Math.round(probe.getBoundingClientRect().width); };
  const col = Math.round(el.getBoundingClientRect().width);
  return { col, font: cs.font, cands: [
    "of $503K taken in, in a typical year",
    "of $503K taken in a typical year",
    "of $503K taken in, in a year",
    "of the $503K it takes in a year",
    "of $503K taken in, a typical year",
  ].map(s => ({ s, w: m(s), fits: m(s) <= col })) };
});
console.log(JSON.stringify(out, null, 1));
await b.close();
