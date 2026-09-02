import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const b = await chromium.launch();
for (const f of ["c5-shell", "c5-noshell"]) {
  const p = await b.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });
  await p.goto(pathToFileURL(`E:/atlas/website/scratchpad/loop10/${f}.html`).href, { waitUntil: "load" });
  await p.waitForTimeout(200);
  const r = await p.evaluate(() => {
    const bar = document.querySelector('[data-idea="I3"]');
    const cs = getComputedStyle(bar);
    const lab = bar.querySelector("span");
    const leg = bar.parentElement.querySelector("div:not([data-idea])");
    const root = getComputedStyle(document.documentElement);
    return {
      border: cs.borderColor, borderW: cs.borderTopWidth,
      barH: bar.getBoundingClientRect().height,
      onBarLabel: lab ? { text: lab.textContent, color: getComputedStyle(lab).color, fs: getComputedStyle(lab).fontSize, ff: getComputedStyle(lab).fontFamily.slice(0,40) } : null,
      legendColor: leg ? getComputedStyle(leg.querySelector("span")).color : null,
      legendFs: leg ? getComputedStyle(leg.querySelector("span")).fontSize : null,
      vars: { cBorder: root.getPropertyValue("--c-border"), cInk: root.getPropertyValue("--c-ink"), cInk2: root.getPropertyValue("--c-ink2"), tMark: root.getPropertyValue("--t-mark"), tMicro: root.getPropertyValue("--t-micro"), terra: root.getPropertyValue("--terra") },
    };
  });
  console.log(f, JSON.stringify(r, null, 1));
  const boxes = await p.evaluate(() => [...document.querySelectorAll("section")].map((s,i)=>{const r=s.getBoundingClientRect();return {i,x:Math.round(r.x),y:Math.round(r.y+scrollY),w:Math.round(r.width),h:Math.round(r.height)};}));
  for (const bx of boxes) await p.screenshot({ path: `scratchpad/loop10/${f}-s${bx.i}.jpeg`, quality: 92, type: "jpeg", fullPage: true, clip: { x: bx.x-6, y: bx.y-6, width: bx.w+12, height: bx.h+12 } });
  await p.close();
}
await b.close();
