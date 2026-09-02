/* loop15: measure every text node on home, biggest first, plus per-section. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL("E:/atlas/website/docs/loop/artifacts/final-pages/home.html").href;
const b = await chromium.launch();
for (const w of [1280, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  const rows = await p.evaluate(() => {
    const out = [];
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    let n;
    while ((n = walk.nextNode())) {
      const t = (n.textContent || "").trim();
      if (!t) continue;
      const el = n.parentElement;
      if (!el || seen.has(el)) continue;
      seen.add(el);
      const cs = getComputedStyle(el);
      const fs = parseFloat(cs.fontSize);
      if (fs < 17) continue;
      const r = el.getBoundingClientRect();
      // find nearest labelled ancestor section
      let sec = el.closest("section");
      let secName = "";
      if (sec) { const h = sec.querySelector("h1,h2,h3"); secName = h ? h.textContent.trim().slice(0, 40) : (sec.getAttribute("aria-labelledby") || ""); }
      out.push({ fs: +fs.toFixed(1), tag: el.tagName, txt: t.slice(0, 48), color: cs.color, family: cs.fontFamily.split(",")[0], y: Math.round(r.y + scrollY), sec: secName });
    }
    return out.sort((a, b) => b.fs - a.fs);
  });
  console.log("=== WIDTH", w, "=== top 30 by size");
  for (const r of rows.slice(0, 30)) console.log(String(r.fs).padStart(6), r.tag.padEnd(4), r.family.padEnd(14), r.color.padEnd(18), "y=" + String(r.y).padStart(5), "|", r.txt, "  [" + r.sec + "]");
  await p.close();
}
await b.close();
