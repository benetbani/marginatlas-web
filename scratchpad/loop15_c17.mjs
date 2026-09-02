/* loop15 C17: the ledger band's first/second, and the page's answer vs its largest count. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const url = pathToFileURL("E:/atlas/website/docs/loop/artifacts/final-pages/home.html").href;
const b = await chromium.launch();
for (const w of [1280, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const px = (el) => parseFloat(getComputedStyle(el).fontSize);
    const box = (el) => { const b = el.getBoundingClientRect(); return { w: Math.round(b.width), h: Math.round(b.height) }; };
    /* the ledger band */
    const h2 = [...document.querySelectorAll("h2")].find((e) => e.textContent.trim() === "What the atlas holds");
    const card = h2.closest(".atlas-card");
    const figs = [...card.querySelectorAll("a > div:first-child")].map((d) => ({ t: d.textContent.trim(), px: px(d), box: box(d), color: getComputedStyle(d).color }));
    const labels = [...card.querySelectorAll("a > div:nth-child(2)")].map((d) => ({ t: d.textContent.trim(), px: px(d) }));
    const closing = card.querySelector("p");
    /* the answer figure: the Specimen's kept figure */
    const answer = [...document.querySelectorAll("div")].find((d) => d.children.length === 0 && /^\$\d+K$/.test(d.textContent.trim()) && px(d) >= 24);
    return {
      ledgerCard: box(card),
      figs, labels,
      closing: { px: px(closing), t: closing.textContent.trim().slice(0, 30) },
      answer: answer ? { t: answer.textContent.trim(), px: px(answer), box: box(answer), color: getComputedStyle(answer).color } : null,
    };
  });
  const biggestCount = Math.max(...r.figs.map((f) => f.px));
  console.log("=== WIDTH", w, "===");
  console.log(" ledger card", JSON.stringify(r.ledgerCard));
  for (const f of r.figs) console.log("   fig", String(f.px).padStart(5), JSON.stringify(f.box).padEnd(20), f.color.padEnd(18), f.t);
  console.log("   labels at", r.labels.map((l) => l.px).join("/"), " closing at", r.closing.px);
  console.log(" ANSWER", r.answer ? `${r.answer.t} at ${r.answer.px}px ${r.answer.color} box ${JSON.stringify(r.answer.box)}` : "NOT FOUND");
  if (r.answer) console.log(` RATIO answer/largest-count = ${(r.answer.px / biggestCount).toFixed(2)}x   (count ${biggestCount}, answer ${r.answer.px})`);
  console.log(` RATIO first/support in band = ${(biggestCount / r.closing.px).toFixed(2)}x`);
  await p.close();
}
await b.close();
