/* THROWAWAY. Hand-count the trade-sections preview's declared ideas per COLUMN,
   because verify_form_variety reads only final-pages/*.html and never this file.
   The two trade columns are two pages; split at the "A plumber" heading. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1200 } });
await p.goto(pathToFileURL("E:/atlas/design/TRADE-SECTIONS-AS-BUILT.html").href);
const out = await p.evaluate(() => {
  const cols = [...document.querySelectorAll("div")].filter((d) => {
    const t = d.firstElementChild?.firstElementChild?.textContent?.trim();
    return t === "A restaurant" || t === "A plumber";
  });
  const per = cols.map((c) => {
    const counts = {};
    for (const el of c.querySelectorAll("[data-idea]")) {
      const k = el.getAttribute("data-idea");
      counts[k] = (counts[k] || 0) + 1;
    }
    const crowded = [];
    for (const card of c.querySelectorAll('[class*="rounded-[14px]"][class*="border"]')) {
      const inner = {};
      for (const el of card.querySelectorAll("[data-idea]")) {
        if (el.closest('[class*="rounded-[14px]"][class*="border"]') !== card) continue;
        const k = el.getAttribute("data-idea");
        inner[k] = (inner[k] || 0) + 1;
      }
      for (const [k, n] of Object.entries(inner)) if (n >= 3) crowded.push({ k, n, kicker: (card.textContent||"").trim().replace(/\s+/g," ").slice(0,40) });
    }
    return { name: c.firstElementChild?.firstElementChild?.textContent?.trim(), counts, crowded };
  });
  return per;
});
console.log(JSON.stringify(out, null, 1));
await b.close();
