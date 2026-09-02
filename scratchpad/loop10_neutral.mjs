/* Prove the palette move is visually neutral on a spine page: compare the
   committed render against the new one, computed style by computed style. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const b = await chromium.launch();
const read = async (file) => {
  const p = await b.newPage({ viewport: { width: 1280, height: 1400 } });
  await p.goto(pathToFileURL(file).href, { waitUntil: "load" });
  await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const names = ["--c-card","--c-soft","--c-soft2","--c-border","--c-line-strong","--c-ink","--c-ink2","--c-muted","--terra","--terra-text","--terra-soft","--terra-border","--t-mark","--t-answer"];
    const vars = Object.fromEntries(names.map(n => [n, root.getPropertyValue(n).trim()]));
    const sample = [...document.querySelectorAll("[data-idea]")].slice(0, 8).map((e) => {
      const c = getComputedStyle(e);
      return { idea: e.getAttribute("data-idea"), border: c.borderColor, color: c.color, bg: c.backgroundColor, w: Math.round(e.getBoundingClientRect().width), h: Math.round(e.getBoundingClientRect().height) };
    });
    const fig = document.querySelector(".fig");
    return { vars, sample, figFF: fig ? getComputedStyle(fig).fontFamily.slice(0, 30) : null, figFW: fig ? getComputedStyle(fig).fontWeight : null, bodyH: document.body.scrollHeight };
  });
  await p.close();
  return r;
};
const a = await read(process.argv[2]);
const c = await read(process.argv[3]);
const same = JSON.stringify(a) === JSON.stringify(c);
console.log("IDENTICAL:", same);
if (!same) { console.log("HEAD:", JSON.stringify(a, null, 1)); console.log("NEW :", JSON.stringify(c, null, 1)); }
else console.log(JSON.stringify(a.vars));
await b.close();
