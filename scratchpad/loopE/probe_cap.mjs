import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/country-gb-new.html`).href;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1400 } });
await p.goto(url, { waitUntil: "load" });
await p.evaluate(() => document.fonts.ready);
console.log(await p.evaluate(() => {
  const cap = document.querySelector('#peers p');
  const cs = getComputedStyle(cap);
  return { cls: cap.className, maxW: cs.maxWidth, w: cap.getBoundingClientRect().width, display: cs.display, parent: cap.parentElement.className.slice(0,80) };
}));
await b.close();
