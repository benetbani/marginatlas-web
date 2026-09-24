/**
 * check_copy_plain: a card talks plainly (his correction of 2026-09-24,
 * evening; design/loop/build/goal-2026-09-24/COPY-STYLE.md).
 *
 * His words: "bullshit subtitles, bullshit mechanical sentences", "the
 * disclaimers are so disgusting", "subtitle, undertitle, disclaimer, body text
 * all competing and all making the card unreadable", "avoid words like
 * modelled, withheld". Measured that evening on the seven UK main pages: 76
 * cards, 127 small supporting lines, 38 cards carrying a method word.
 *
 * On every page in scripts/harness/pages.json, at 1280 and 375, every section
 * card is read as a visitor sees it (a closed plus's rows are not read):
 *
 *   BANNED       a method word in the card's visible text: modelled, modeled,
 *                withheld, on file, not gathered, not measured, "typical for
 *                the trade anywhere", "the model", placeholder, "as on the
 *                opening card", "worked from" (one per word per card);
 *   LINES        more than one small supporting line under the figure (a line
 *                is a paragraph at the micro rung, 13px or less; the notes of
 *                a prose card are its content and are not counted), one red
 *                per line past the first;
 *   TITLE LONG   a card title over four words;
 *   LINE LONG    a supporting line over twelve words;
 *   SEMICOLON    a supporting line holding a semicolon (a line is one
 *                sentence).
 *
 * A per-page ratchet (copy_plain_baseline.json), seeded at the first
 * measurement and falling only; the rewrite drives it to zero.
 *
 * BLIND SPOT: it reads words and counts, not meaning; a plain line that says
 * nothing passes. What a line should say is COPY-STYLE.md's, and the rewrite's.
 *
 *   node scripts/harness/check_copy_plain.mjs --list [--write-baseline]
 */
import { chromium } from "playwright";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { basename } from "node:path";
import { preflight } from "./preflight.mjs";
import { requireBrowser } from "../lib/local_only.mjs";

await requireBrowser("harness-copy-plain", "the plain-copy laws of 2026-09-24 (method words, one supporting line, short titles and lines) on every page in scripts/harness/pages.json");
preflight({ browser: true, name: "check_copy_plain" });

const WIDTHS = [1280, 375];
const args = process.argv.slice(2);
const listArg = args.find((a) => a === "--list" || a.startsWith("--list="));
const LIST = listArg && listArg.includes("=") ? listArg.slice("--list=".length) : "scripts/harness/pages.json";
const listed = listArg ? JSON.parse(readFileSync(LIST, "utf8")).pages.map((p) => `scratchpad/harness/pages/${p.surface}-${p.slugs.join("-")}.html`) : [];
const files = [...args.filter((a) => !a.startsWith("--")), ...listed];
if (files.length === 0) { console.error("usage: node scripts/harness/check_copy_plain.mjs <rendered.html ...> | --list[=pages.json] [--write-baseline]"); process.exit(2); }

function inPage() {
  const BANNED = [
    ["modelled", /\bmodell?ed\b/i],
    ["withheld", /\bwithheld\b/i],
    ["on file", /\bon file\b/i],
    ["not gathered", /\bnot gathered\b/i],
    ["not measured", /\bnot measured\b/i],
    ["typical for the trade anywhere", /typical for the trade anywhere/i],
    ["the model", /\bthe model\b/i],
    ["placeholder", /\bplaceholder\b/i],
    ["as on the opening card", /as on the opening card/i],
    ["worked from", /\bworked from\b/i],
  ];
  const TITLE_MAX = 4, LINE_MAX = 12, MICRO_MAX = 13.5;
  const CARD = "main [data-card]";
  const cards = [...document.querySelectorAll(CARD)].filter((c) => c.getClientRects().length && !c.parentElement.closest(CARD));
  const idOf = (card) => card.id || card.querySelector("[id]")?.id || (card.querySelector("h1,h2,h3")?.textContent || "").trim().toLowerCase().slice(0, 30) || "card";
  const hidden = (el) => { const d = el.closest("details"); if (d && !d.open) { const sum = d.querySelector(":scope > summary"); if (!sum || !sum.contains(el)) return true; } const s = getComputedStyle(el); return !el.getClientRects().length || s.visibility === "hidden" || s.display === "none"; };
  const words = (t) => t.trim().split(/\s+/).filter(Boolean).length;
  const reds = [];
  const red = (id, rule, msg) => reds.push({ id, rule, msg });
  for (const card of cards) {
    const id = idOf(card);
    /* The visible text, as a visitor reads it. */
    const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
    let text = "";
    for (let n = walker.nextNode(); n; n = walker.nextNode()) { if (n.parentElement && !hidden(n.parentElement)) text += " " + n.textContent; }
    text = text.replace(/\s+/g, " ");
    for (const [name, re] of BANNED) if (re.test(text)) red(id, "BANNED", `"${name}" in the card's text`);
    const title = card.querySelector("h3");
    if (title && !hidden(title) && words(title.textContent) > TITLE_MAX) red(id, "TITLE LONG", `"${title.textContent.trim()}", ${words(title.textContent)} words`);
    const lines = [...card.querySelectorAll("p")].filter((p) => !hidden(p) && !p.closest("table,li,dl,[role='table'],[data-note]") && parseFloat(getComputedStyle(p).fontSize) <= MICRO_MAX && p.textContent.trim());
    lines.slice(1).forEach((p) => red(id, "LINES", `a supporting line past the first: "${p.textContent.trim().slice(0, 70)}"`));
    for (const p of lines) {
      const t = p.textContent.trim();
      if (words(t) > LINE_MAX) red(id, "LINE LONG", `${words(t)} words: "${t.slice(0, 70)}"`);
      if (t.includes(";")) red(id, "SEMICOLON", `"${t.slice(0, 70)}"`);
    }
  }
  return { reds, cards: cards.length };
}

const reds = [];
const browser = await chromium.launch();
for (const file of files) {
  const name = basename(file).replace(/\.html$/, "");
  if (!existsSync(file)) { reds.push({ page: name, w: "all", id: "-", rule: "NO RENDER", msg: "the list names this page and no render exists under scratchpad/harness/pages" }); continue; }
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    const walk = await page.evaluate(inPage);
    if (walk.cards === 0) reds.push({ page: name, w, id: "page", rule: "NO SECTIONS", msg: "no section card found under main" });
    for (const r of walk.reds) reds.push({ page: name, w, ...r });
    console.log(`${name}@${w}: ${walk.cards} cards, ${walk.reds.length} red(s)`);
    await ctx.close();
  }
}
await browser.close();
const byRule = {};
for (const r of reds) byRule[r.rule] = (byRule[r.rule] ?? 0) + 1;
console.log(`copy plain: ${files.length} page(s) x ${WIDTHS.length} widths, ${reds.length} red(s) (${Object.entries(byRule).map(([k, v]) => `${k} ${v}`).join(", ") || "none"})`);
for (const r of reds) console.log(`  ${r.page}@${r.w} #${r.id}: ${r.rule}: ${r.msg}`);

/* THE PER-PAGE RATCHET: seeded at the first measurement, falling only. */
const BASELINE = "scripts/harness/copy_plain_baseline.json";
const WRITE_BASELINE = args.includes("--write-baseline");
const byPage = {};
for (const r of reds) byPage[r.page] = (byPage[r.page] ?? 0) + 1;
let base = null;
try { base = JSON.parse(readFileSync(BASELINE, "utf8")); } catch { base = null; }
const seeding = base === null;
base = base ?? {};
const over = [], under = [];
for (const name of files.map((f) => basename(f, ".html"))) {
  const have = byPage[name] ?? 0, allowed = base[name] ?? 0;
  if (have > allowed) over.push(`${name}: ${have} against a baseline of ${allowed}`);
  else if (have < allowed) under.push(`${name}: ${have}, baseline ${allowed} can fall`);
}
let exit = 0;
if (over.length && !(WRITE_BASELINE && seeding)) { console.log(`copy plain RATCHET: ${over.length} page(s) over their baseline: ${over.join("; ")}. Remedy: rewrite the card to COPY-STYLE.md; never raise the entry`); exit = 1; }
if (WRITE_BASELINE) {
  for (const name of files.map((f) => basename(f, ".html"))) { const have = byPage[name] ?? 0; if (seeding || !(name in base) || have < base[name]) base[name] = have; }
  for (const k of Object.keys(base)) if (base[k] === 0) delete base[k];
  writeFileSync(BASELINE, JSON.stringify(base, null, 2) + String.fromCharCode(10));
  console.log(`copy plain RATCHET: baseline ${seeding ? "seeded" : "written"} to ${BASELINE}${under.length ? ` (lowered: ${under.join("; ")})` : ""}; an entry never rises`);
} else if (under.length) console.log(`copy plain RATCHET: ${under.join("; ")} (run with --write-baseline to lower it)`);
process.exit(exit);
