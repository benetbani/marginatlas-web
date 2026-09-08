/**
 * READABILITY, MEASURED (the founder, 2026-09-08: "the page still has problems
 * in readability"). Four faults, all measurable from a render, none of which
 * any existing check can see. Run at three widths over every page in
 * scripts/harness/pages.json.
 *
 *  MEASURE      a paragraph over 78 characters per line loses the reader
 *               between the end of one line and the start of the next.
 *  CONTRAST     body text under 4.5:1 against the surface behind it, which is
 *               the WCAG AA floor the repo already claims to hold.
 *  LEADING      line height under 1.35x the font size for any text over two
 *               lines.
 *  READ SIZE    text under 12px that carries words a reader must read. Ten is
 *               for marks, which is the token file's own rule.
 *
 * BLIND SPOT, stated before it is trusted: contrast is computed against the
 * nearest ancestor with a non-transparent background, so a figure over a
 * gradient or an image reports against the layer under it and not what the eye
 * sees. Every page ground is now a flat token, so this holds today and would
 * stop holding the day an image returns.
 *
 * usage: node scripts/harness/check_readability.mjs <rendered.html ...>
 *        node scripts/harness/check_readability.mjs --list[=pages.json]
 */
import { chromium } from "playwright";
import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { basename } from "node:path";
import { preflight } from "./preflight.mjs";

preflight({ browser: true, name: "check_readability" });

const WIDTHS = [1280, 768, 375];
const args = process.argv.slice(2);
const listArg = args.find((a) => a === "--list" || a.startsWith("--list="));
const LIST = listArg && listArg.includes("=") ? listArg.slice("--list=".length) : "scripts/harness/pages.json";
const listed = listArg ? JSON.parse(readFileSync(LIST, "utf8")).pages.map((p) => `scratchpad/harness/pages/${p.surface}-${p.slugs.join("-")}.html`) : [];
const files = [...args.filter((a) => !a.startsWith("--")), ...listed];
if (files.length === 0) { console.error("usage: node scripts/harness/check_readability.mjs <rendered.html ...> | --list"); process.exit(2); }

function inPage() {
  const lum = (c) => {
    const m = c.match(/\d+(\.\d+)?/g);
    if (!m) return null;
    const [r, g, b] = m.slice(0, 3).map((v) => { const s = Number(v) / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const behind = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      if (bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) return bg;
      n = n.parentElement;
    }
    return "rgb(255, 255, 255)";
  };
  const out = [];
  const cards = [...document.querySelectorAll('main [class*="rounded-[14px]"]')].filter((c) => c.getClientRects().length && !c.parentElement.closest('[class*="rounded-[14px]"]'));
  for (const card of cards) {
    const id = card.id || card.querySelector("[id]")?.id || "card";
    for (const el of card.querySelectorAll("*")) {
      if (el.children.length || !el.getClientRects().length) continue;
      const text = (el.textContent || "").trim();
      if (text.length < 25) continue;
      const cs = getComputedStyle(el);
      const size = parseFloat(cs.fontSize);
      const lh = parseFloat(cs.lineHeight) || size * 1.2;
      const w = el.getBoundingClientRect().width;
      const lines = Math.max(1, Math.round(el.getBoundingClientRect().height / lh));
      const cpl = lines > 0 ? Math.round(text.length / lines) : text.length;
      const l1 = lum(cs.color), l2 = lum(behind(el));
      const ratio = l1 == null || l2 == null ? 21 : (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const snip = text.slice(0, 28);
      if (cpl > 78) out.push({ id, rule: "MEASURE", detail: `${cpl} characters a line over ${Math.round(w)}px, past 78 ("${snip}")` });
      if (ratio < 4.5) out.push({ id, rule: "CONTRAST", detail: `${ratio.toFixed(2)} to 1 against what is behind it, under 4.5 ("${snip}")` });
      if (lines > 2 && lh / size < 1.35) out.push({ id, rule: "LEADING", detail: `line height ${(lh / size).toFixed(2)} of the font size over ${lines} lines, under 1.35 ("${snip}")` });
      if (size < 12) out.push({ id, rule: "READ SIZE", detail: `${size}px carrying ${text.length} characters a reader must read ("${snip}")` });
    }
  }
  return out;
}

const reds = [];
const browser = await chromium.launch();
for (const file of files) {
  const name = basename(file).replace(/\.html$/, "");
  if (!existsSync(file)) { reds.push({ name, w: "all", id: "-", rule: "NO RENDER", detail: "the list names this page and no render exists" }); continue; }
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    const found = await page.evaluate(inPage);
    for (const f of found) reds.push({ name, w, ...f });
    console.log(`${name}@${w}: ${found.length} readability red(s)`);
    await ctx.close();
  }
}
await browser.close();
console.log(`readability: ${files.length} page(s) x ${WIDTHS.length} widths, ${reds.length} red(s)`);
for (const r of reds) console.log(`  ${r.name}@${r.w} #${r.id}: ${r.rule}: ${r.detail}`);
process.exit(reds.length ? 1 : 0);
