/* throwaway: replay verify_art_direction's H4 collection and show EVERY
   occurrence it counts, with the element, its size, its section and its y, plus
   which element the hero exemption landed on.
   node scratchpad/loop17_h4.mjs <slug> [width] */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";

const slug = process.argv[2];
const width = Number(process.argv[3] ?? 1440);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width, height: 1000 } });
await p.goto(pathToFileURL(`E:/atlas/website/docs/loop/artifacts/final-pages/${slug}.html`).href);
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(400);
const out = await p.evaluate(() => {
  const inDeadDetails = (el) => {
    for (let n = el; n; n = n.parentElement) {
      if (n.tagName === "DETAILS" && !n.open) return true;
    }
    return false;
  };
  let exemptEl = null, max = 0;
  for (const e of document.querySelectorAll("[data-hero='1'] *")) {
    const bb = e.getBoundingClientRect();
    if (bb.width < 1 || bb.height < 1) continue;
    if (![...e.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim())) continue;
    const fs = parseFloat(getComputedStyle(e).fontSize) || 0;
    if (fs > max) { max = fs; exemptEl = e; }
  }
  const desc = (el) => {
    const id = el.closest("[id]")?.id || "";
    return `<${el.tagName.toLowerCase()}${el.className ? " ." + String(el.className).split(" ")[0] : ""}> in #${id || "?"}`;
  };
  const rows = [];
  const seen = new Map();
  for (const e of document.querySelectorAll("*")) {
    if (inDeadDetails(e)) continue;
    const own = [...e.childNodes].filter((x) => x.nodeType === 3 && x.textContent.trim())
      .map((x) => x.textContent.trim()).join(" ").replace(/\s+/g, " ");
    if (own.length < 4) continue;
    const rb = e.getBoundingClientRect();
    if (rb.width < 1 || rb.height < 1) continue;
    if (/^sample$/i.test(own)) continue;
    const isExempt = e === exemptEl;
    if (!/\d/.test(own)) continue;
    const top = rb.top + window.scrollY;
    if (top > 900) continue;
    const card = e.closest("[data-hero='1']") || e.closest("div[style*='backdrop']") || e.closest("main > div") || document.body;
    if (!seen.has(card)) seen.set(card, seen.size + 1);
    rows.push({ own, top: Math.round(top), fs: Math.round(parseFloat(getComputedStyle(e).fontSize) || 0), card: seen.get(card), where: desc(e), exempt: isExempt });
  }
  return { exempt: exemptEl ? { text: exemptEl.textContent.trim().slice(0, 40), fs: max, where: desc(exemptEl) } : null, rows };
});
await p.close();
await b.close();
console.log(`\n${slug} @${width}`);
console.log("hero exemption:", JSON.stringify(out.exempt));
const groups = new Map();
for (const r of out.rows) {
  if (!groups.has(r.own)) groups.set(r.own, []);
  groups.get(r.own).push(r);
}
for (const [text, rs] of groups) {
  const cards = new Set(rs.filter((r) => !r.exempt).map((r) => r.card));
  const ys = new Set(rs.filter((r) => !r.exempt).map((r) => r.top));
  const fires = cards.size > 1 && ys.size > 1;
  if (!fires && rs.length < 2) continue;
  console.log(`\n  "${text.slice(0, 50)}"  ${fires ? "*** FIRES ***" : "(quiet)"}`);
  for (const r of rs) console.log(`      y=${String(r.top).padStart(4)} ${String(r.fs).padStart(3)}px card#${r.card}${r.exempt ? " EXEMPT" : ""}  ${r.where}`);
}
