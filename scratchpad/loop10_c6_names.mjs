/* the six trade names measured in the page's own body face at 14px, plus the
   Box padding, so the standing's width can be chosen rather than guessed. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1400 } });
await p.goto(pathToFileURL("E:/atlas/website/docs/loop/artifacts/final-pages/industry-restaurants.html").href, { waitUntil: "load" });
await p.waitForTimeout(300);
const out = await p.evaluate(() => {
  const box = document.getElementById("neighbours");
  const cs = getComputedStyle(box);
  const probe = document.createElement("span");
  probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;font-size:var(--t-body);line-height:1";
  box.appendChild(probe);
  const m = (s, w) => { probe.style.fontWeight = w || "400"; probe.textContent = s; return Math.round(probe.getBoundingClientRect().width); };
  const names = ["Food trucks","Catering & food service contractors","Cafés & coffee shops","Pizzerias","Bars & nightclubs","Pubs & taverns"];
  const figs = ["$90K","$81K","$180K","$201K","$351K","$300K"];
  const probeFig = document.createElement("span");
  probeFig.className = "fig";
  probeFig.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;font-size:var(--t-body);line-height:1";
  box.appendChild(probeFig);
  const mf = (s) => { probeFig.textContent = s; return Math.round(probeFig.getBoundingClientRect().width); };
  return { boxWidth: Math.round(box.getBoundingClientRect().width), padding: cs.padding,
    names: names.map(n => ({ n, w: m(n), bold: m(n, "600") })), figs: figs.map(f => ({ f, w: mf(f) })) };
});
console.log(JSON.stringify(out, null, 1));
await b.close();
