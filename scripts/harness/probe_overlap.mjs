/**
 * THE OVERLAP PROBE: every element that crosses a section card from outside
 * it, with its position, stacking and background. The tool that proved a
 * white block in a photograph was the capture and not the page (2026-09-05).
 * Moved from scratchpad/arch/overlap_probe.mjs on run 6 of the build loop.
 *
 * usage: node scripts/harness/probe_overlap.mjs <rendered.html> <id> [width]
 */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const [, , file, id, w = "768"] = process.argv;
if (!file || !id) { console.error("usage: probe_overlap.mjs <rendered.html> <id> [width]"); process.exit(2); }
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: Number(w), height: 1200 } });
const p = await ctx.newPage();
await p.goto(pathToFileURL(resolve(file)).href, { waitUntil: "load" });
await p.evaluate(() => document.fonts && document.fonts.ready);
const res = await p.evaluate((id) => {
  const card = document.getElementById(id);
  if (!card) return "no card";
  card.scrollIntoView();
  const c = card.getBoundingClientRect();
  const hits = [];
  for (const el of document.querySelectorAll("body *")) {
    if (card.contains(el) || el.contains(card)) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const ix = Math.min(c.right, r.right) - Math.max(c.left, r.left), iy = Math.min(c.bottom, r.bottom) - Math.max(c.top, r.top);
    if (ix > 4 && iy > 4) {
      const cs = getComputedStyle(el);
      hits.push({ tag: el.tagName, cls: String(el.className).slice(0, 80), pos: cs.position, z: cs.zIndex, bg: cs.backgroundColor, rect: [Math.round(r.left), Math.round(r.top - c.top), Math.round(r.width), Math.round(r.height)], text: (el.textContent || "").trim().slice(0, 40) });
    }
  }
  return { card: [Math.round(c.left), Math.round(c.width), Math.round(c.height)], hits: hits.filter((h) => !/static/.test(h.pos) || h.bg !== "rgba(0, 0, 0, 0)").slice(0, 12) };
}, id);
console.log(JSON.stringify(res, null, 1));
await b.close();
