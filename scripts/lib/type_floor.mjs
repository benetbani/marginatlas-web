/**
 * scripts/lib/type_floor.mjs , THE TYPE FLOOR'S READER (plan 2026-10-12 rhythm-air-inside, Task 1A; spec
 * E:/atlas/docs/superpowers/specs/2026-10-12-rhythm-air-inside-design.md, sections 2.2 and 3 item 1).
 *
 * Reader text is 14px or larger. The 12px rung stays only for a chart's tick and axis labels and the source and licence line of a page's
 * foot, each place marked in its component with `data-type-allow="<key>"` and named with its reason in scripts/harness/type_floor_allow.json
 * (as src/lib/spine/reader_words.json names its words).
 *
 * READ AS R1 READ (E:/atlas/docs/superpowers/research/2026-10-12-design-goals/R1-rhythm.md, section 0), over a parsed render, no layout engine:
 *   VISIBLE AT 1280  no ancestor-or-self hidden there by a display class (`hidden` unless a wider `sm:` to `xl:` display class shows it,
 *                    `sm:hidden` to `xl:hidden`, `max-2xl:hidden`), `sr-only`, `invisible`, the `hidden` attribute, an inline display:none
 *                    or visibility:hidden, or a closed <details> outside its <summary>; <style>, <script>, <noscript> and <template> hold
 *                    no reader text.
 *   SIZE             the nearest ancestor-or-self that sets one: a size rule of THE ZONES (src/app/globals.css: the open section's title 20,
 *                    the line under a section's figure 14, a share's figure 14, the plus's rows 14) where the element matches it; else its
 *                    size class (the ladder's `text-[length:var(--t-*)]`, `text-xs` to `text-2xl`, a bracketed `text-[Npx]`, the widest
 *                    `sm:` to `xl:` form that applies at 1280); else an SVG `font-size` attribute; none at all reads as 16.
 *   CHARACTERS       the non-space characters of each visible text node.
 * THE MEASURE: characters under 14px outside the allowance over every visible character (`share`, the law, 20% at most), and the same with
 * the allowance counted in (`raw`, R1's own figure, for the before and after table).
 *
 * ITS BLIND SPOT, stated before any number: no layout engine runs, so a size or a display set by a container query (`[@container(...)]:`),
 * by a stylesheet rule outside THE ZONES' size rules, or by a script, is not seen; a form a container query switches counts at both its
 * sizes, in the numerator and the denominator. One width, 1280. It tells a label read from a mark glanced at only by the allowance key.
 */
export const FLOOR_PX = 14;
export const SHARE_MAX = 0.2;
const WIDTH = 1280;
const BP = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };
const RUNG = { mark: 10, micro: 12, body: 14, lead: 16, head: 20, section: 24, focal: 30, answer: 40 };
const TW = { "text-xs": 12, "text-sm": 14, "text-base": 16, "text-lg": 18, "text-xl": 20, "text-2xl": 24 };
const DISPLAY = /^(hidden|block|inline|inline-block|flex|inline-flex|grid|inline-grid|table|table-row|table-cell|contents|flow-root|list-item)$/;
const SKIP = new Set(["STYLE", "SCRIPT", "NOSCRIPT", "TEMPLATE"]);

/** THE ZONES' size rules (src/app/globals.css, THE ZONES): a selector and the size it sets. tests/spine/type_floor.test.ts holds the count to the stylesheet's. */
export const ZONE_SIZES = [
  ["[data-zone] .spine-card:not([data-keep-card]) [data-rail-title]", 20],
  ["[data-zone] .spine-card:not([data-keep-card]) [data-focal-words]", 14],
  ['[data-zone] [data-focal="1"] + p', 14],
  ['[data-zone] [data-archetype="share-bar"] [data-expect-rows] > [data-row] > span:last-child', 14],
  ['[data-zone] [data-archetype="donut"] [data-expect-rows] > [data-row] > span:last-child', 14],
  ["[data-zone] [data-detail-row] > dt", 14],
  ["[data-zone] [data-detail-row] > dt + dd", 14],
];

const classesOf = (el) => (el.getAttribute("class") || "").split(/\s+/).filter(Boolean);

/** A class's min-width breakpoint (0 for none) and its utility; null for any other variant (hover:, after:, group-open:, max-*:, [@container(...)]:). A colon inside brackets belongs to the utility. */
export function splitClass(cls) {
  let depth = 0;
  let cut = -1;
  for (let i = 0; i < cls.length; i++) {
    const ch = cls[i];
    if (ch === "[") depth++;
    else if (ch === "]") depth--;
    else if (ch === ":" && depth === 0) cut = i;
  }
  if (cut === -1) return { bp: 0, util: cls };
  const prefix = cls.slice(0, cut);
  return prefix in BP ? { bp: BP[prefix], util: cls.slice(cut + 1) } : null;
}

/** Hidden at 1280 by the element's own attributes or classes. */
export function hiddenHere(el) {
  if (el.hasAttribute("hidden")) return true;
  const style = (el.getAttribute("style") || "").replace(/\s+/g, "").toLowerCase();
  if (style.includes("display:none") || style.includes("visibility:hidden")) return true;
  let display = null;
  let at = -1;
  for (const c of classesOf(el)) {
    if (c === "sr-only" || c === "invisible" || c === "max-2xl:hidden") return true;
    const s = splitClass(c);
    if (!s || s.bp > WIDTH || !DISPLAY.test(s.util)) continue;
    if (s.bp >= at) { display = s.util; at = s.bp; }
  }
  return display === "hidden";
}

/** A text node visible at 1280. */
export function visibleHere(textNode) {
  let prev = null;
  for (let el = textNode.parentElement; el; prev = el, el = el.parentElement) {
    const tag = el.tagName.toUpperCase();
    if (SKIP.has(tag) || hiddenHere(el)) return false;
    if (tag === "DETAILS" && !el.hasAttribute("open") && !(prev && prev.tagName.toUpperCase() === "SUMMARY")) return false;
  }
  return true;
}

function classSize(cls) {
  const s = splitClass(cls);
  if (!s || s.bp > WIDTH) return null;
  let m = /^text-\[length:var\(--t-(mark|micro|body|lead|head|section|focal|answer)\)\]$/.exec(s.util);
  if (m) return RUNG[m[1]];
  if (s.util in TW) return TW[s.util];
  m = /^text-\[(\d+(?:\.\d+)?)px\]$/.exec(s.util);
  return m ? Number(m[1]) : null;
}

/** The size an element sets itself, or null. */
export function ownSize(el) {
  for (const [sel, px] of ZONE_SIZES) if (el.matches(sel)) return px;
  let size = null;
  let at = -1;
  for (const c of classesOf(el)) {
    const v = classSize(c);
    if (v == null) continue;
    const bp = splitClass(c).bp;
    if (bp >= at) { size = v; at = bp; }
  }
  if (size != null) return size;
  const fs = el.getAttribute("font-size");
  return fs && /^\d+(\.\d+)?$/.test(fs) ? Number(fs) : null;
}

/** A text node's size: its nearest ancestor that sets one, else 16. */
export function sizeOf(textNode) {
  for (let el = textNode.parentElement; el; el = el.parentElement) {
    const v = ownSize(el);
    if (v != null) return v;
  }
  return 16;
}

const placeOf = (el) => {
  const block = el.closest("[data-block]");
  const arch = el.closest("[data-archetype]");
  return `${block ? `#${block.getAttribute("data-block")}` : "page"}${arch ? ` ${arch.getAttribute("data-archetype")}` : ""}`;
};

/** Reads one parsed render. `allowKeys`: the keys of scripts/harness/type_floor_allow.json. */
export function readTypeFloor(doc, allowKeys) {
  const root = doc.querySelector("main") || doc.body;
  const walker = doc.createTreeWalker(root, 4);
  let chars = 0;
  let small = 0;
  let allowed = 0;
  const runs = new Map();
  const unknown = new Set();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const c = (n.textContent.match(/\S/g) || []).length;
    if (!c || !n.parentElement || !visibleHere(n)) continue;
    chars += c;
    const size = sizeOf(n);
    if (size >= FLOOR_PX) continue;
    const host = n.parentElement.closest("[data-type-allow]");
    const key = host ? host.getAttribute("data-type-allow") : null;
    if (key && allowKeys.has(key)) { allowed += c; continue; }
    if (key) unknown.add(key);
    small += c;
    const at = `${size}px ${placeOf(n.parentElement)}`;
    runs.set(at, (runs.get(at) || 0) + c);
  }
  return { chars, small, allowed, share: chars ? small / chars : 0, raw: chars ? (small + allowed) / chars : 0, runs: [...runs.entries()].sort((a, b) => b[1] - a[1]), unknownKeys: [...unknown] };
}
