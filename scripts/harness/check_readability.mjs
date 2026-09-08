/**
 * READABILITY, MEASURED (the founder, 2026-09-08: "the page still has problems
 * in readability"). Four faults, all measurable from a render, none of which
 * any existing check can see. Run at three widths over every page in
 * scripts/harness/pages.json.
 *
 *  MEASURE      a paragraph over 78 characters per line loses the reader
 *               between the end of one line and the start of the next.
 *               Card-scoped; strings under 25 characters are skipped, a
 *               short string has no measure to speak of.
 *  CONTRAST     text under 4.5:1 against the surface behind it, which is the
 *               WCAG AA floor the repo already claims to hold. The ONLY rule
 *               of the four that also runs OUTSIDE cards, anywhere in
 *               `main`, because the page ground shows through there and
 *               nowhere else (2026-09-08 review, FINDING B). Strings under
 *               25 characters are still skipped, inside or outside a card.
 *  LEADING      line height under 1.35x the font size for any text over two
 *               lines. Card-scoped; strings under 25 characters are skipped.
 *  READ SIZE    text under 12px that carries words a reader must read. Ten is
 *               for marks, which is the token file's own rule. Card-scoped,
 *               and the ONLY rule of the four with NO character floor: a
 *               10px label is the violation this rule exists to catch no
 *               matter how few words it carries (2026-09-08 review, FINDING
 *               C: the 25-character floor was hiding exactly the short
 *               labels the token file's own comment rules out, "for marks a
 *               reader glances at, never for a sentence... never a label to
 *               read").
 *
 * WHAT CHANGED, 2026-09-08 REVIEW WAVE (a reviewer read this file against the
 * fixture and the three real pages; findings A-H, F is report-only and
 * changed no code, its number lives in the task report, not here):
 *   A. MEASURE used to average text.length across an estimated line count
 *      (height / line-height, rounded), which a short final line always
 *      drags down: two lines of 150 and 6 characters averaged to 78 and
 *      passed a 78 ceiling; five lines of 86 with a 20-character tail
 *      averaged to 73.6 and passed too. It now takes a Range over the
 *      element's own text, reads one ClientRect per actual rendered line
 *      box (the true line count, no rounding), walks every character
 *      against those boxes, and reports the LONGEST line's real character
 *      count, not a mean diluted by the tail.
 *   B. --c-muted was 3.77:1 against --c-ground, under the 4.5 floor this
 *      repo claims, invisible to this file because it never looked outside
 *      a card. --c-muted is darkened in globals.css (see that file's
 *      comment for the computed ratios) and CONTRAST alone now also scans
 *      outside cards, anywhere in `main`.
 *   C. READ SIZE dropped the 25-character floor; the other three keep it.
 *   D. CONTRAST now composites the text's own color alpha and the CSS
 *      opacity of every ancestor (opacity nests: a translucent panel inside
 *      an already-faded wrapper is fainter than either alone) against a
 *      `behind()` that itself composites every ancestor's background
 *      through its own alpha and the same cumulative opacity, rather than
 *      taking the first non-transparent hit as solid and the text's own
 *      alpha as 1.
 *   E. LEADING no longer assumes 1.2x the font size when line-height
 *      computes to the string "normal". It measures the gap between
 *      consecutive line-box tops, from the same Range finding A added,
 *      which needs two gaps (three lines) to exist, exactly the case where
 *      LEADING can fire at all; below that the assumption was never read by
 *      anything and is left in place only so the value is never NaN.
 *   G. MEASURE's own detail string now states the line count alongside the
 *      characters-per-line figure, so a single-line caption cannot be
 *      mistaken for a wrapped paragraph without re-running anything.
 *
 * NOT A LETTERED FINDING, FOUND WHILE VERIFYING D: every viewport this file
 * opens now emulates prefers-reduced-motion, because D made CONTRAST read
 * text color's own alpha, and this repo fades every h1 and the paragraph
 * right after it on load (globals.css, "hero-rise", 480ms). Without this,
 * a run could catch that paragraph mid-fade and read a color that was never
 * a design choice, only a timing accident; two runs on the same file gave
 * two different ratios (2.24, then 2.82) before this was added, and the same
 * file has given the same reading every time since. This repo's own
 * animation is already gated behind that exact media query, so reduced
 * motion does not hide it, it only skips a transition and measures the
 * settled state a reader actually reads.
 *
 * BLIND SPOTS, stated before this is trusted, and there is more than one:
 *
 *   THE SURFACE. Contrast now composites color and background alpha plus
 *   CSS opacity, but not a CSS filter, a blend mode, a backdrop-filter, or
 *   an actual raster image or gradient painted behind text; those still
 *   report against whatever flat color sits under them in markup, not what
 *   the eye sees. Every page ground is a flat token today, so this holds,
 *   and would stop holding the day an image returns.
 *
 *   THE SCOPE. MEASURE, LEADING and READ SIZE only ever look inside a card
 *   (`main [class*="rounded-[14px]"]`). A caption under a figure, a
 *   wayfinding label, a section eyebrow, anything outside a card, is
 *   invisible to those three rules no matter how it renders: too tight a
 *   wrap, too small a size, too long a line. Only CONTRAST was widened,
 *   because a color pair is either legible or it is not wherever it sits,
 *   while a line length or a line height is a property of a paragraph, and
 *   outside a card this repo also renders furniture a paragraph rule has no
 *   business reading.
 *
 *   THE ELEMENT FILTER. Every rule only looks at a leaf, an element with
 *   zero element children (`el.children.length === 0`). A paragraph broken
 *   by an inline link, a bolded word, or any other inline tag has element
 *   children and is skipped entirely, at all four rules, even though a
 *   reader experiences it as one paragraph that wraps, has a color, and has
 *   a line height like any other.
 *
 *   THE FLOOR. MEASURE, CONTRAST and LEADING still skip any string under 25
 *   characters (2026-09-08 review, FINDING C kept this for three of the
 *   four on purpose: a short string genuinely has no measure or leading to
 *   speak of, and CONTRAST was left matching them rather than carved out on
 *   its own). A short string can still fail contrast for real; this file
 *   will not catch it there.
 *
 *   READING ORDER. The per-line character split (finding A) walks
 *   characters in DOM order and assumes each next character's line box sits
 *   at or below the previous one, true for the left-to-right, unfloated
 *   text this repo renders. A right-to-left run, a float, or justified text
 *   with an irregular line start could break that assumption silently.
 *
 * SKIPPED ON PURPOSE (2026-09-08, prior fix wave): any element whose own box,
 * or an ancestor's box, is collapsed to the standard screen-reader-only
 * shape, position absolute, width and height at or under 1px, overflow
 * hidden. That is how this repo removes text from sight while keeping it in
 * the accessibility tree: Tailwind's `sr-only` utility, found in this repo on
 * `<caption className="sr-only">` in the peers tables
 * (src/components/spine/archetypes/CompareTable.tsx,
 * src/components/spine/cell/interactive.tsx,
 * src/components/spine/industry/where-pays.tsx) and on assorted labels and
 * status spans elsewhere. This is a shape check on computed style, not a name
 * check on the class string, so a renamed utility class still gets caught;
 * it will NOT catch a future hiding technique that keeps the box full-size
 * (for example text pushed off-screen with a large negative offset), which
 * is a real remaining blind spot, not a solved one.
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
  const parseColor = (c) => {
    const m = c && c.match(/[\d.]+/g);
    if (!m) return null;
    const [r, g, b, a] = m.map(Number);
    return { r, g, b, a: a === undefined ? 1 : a };
  };
  const lumOf = ({ r, g, b }) => {
    const f = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const compositeOver = (fg, alpha, bg) => ({
    r: fg.r * alpha + bg.r * (1 - alpha),
    g: fg.g * alpha + bg.g * (1 - alpha),
    b: fg.b * alpha + bg.b * (1 - alpha),
  });
  // FINDING D: walks from the document root down to el's own parent,
  // compositing each ancestor's background-color at that ancestor's OWN
  // alpha channel times the cumulative CSS opacity above it. A translucent
  // background no longer reads as the first solid hit; it blends with
  // whatever sits behind it, all the way down to a white canvas.
  const behind = (el) => {
    const chain = [];
    for (let n = el.parentElement; n; n = n.parentElement) chain.push(n);
    let result = { r: 255, g: 255, b: 255 };
    let cumulativeOpacity = 1;
    for (let i = chain.length - 1; i >= 0; i--) {
      const cs = getComputedStyle(chain[i]);
      const op = parseFloat(cs.opacity);
      cumulativeOpacity *= Number.isNaN(op) ? 1 : op;
      const bg = parseColor(cs.backgroundColor);
      if (bg && bg.a > 0) result = compositeOver(bg, bg.a * cumulativeOpacity, result);
    }
    return result;
  };
  const ancestorOpacity = (el) => {
    let product = 1;
    for (let n = el; n; n = n.parentElement) {
      const op = parseFloat(getComputedStyle(n).opacity);
      product *= Number.isNaN(op) ? 1 : op;
    }
    return product;
  };
  const contrastOf = (el, cs) => {
    const fg = parseColor(cs.color);
    const bg = behind(el);
    const effAlpha = (fg ? fg.a : 1) * ancestorOpacity(el);
    const l1 = fg ? lumOf(compositeOver(fg, effAlpha, bg)) : null;
    const l2 = lumOf(bg);
    return l1 == null ? 21 : (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  const hiddenFromSight = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      if (cs.position === "absolute" && parseFloat(cs.width) <= 1 && parseFloat(cs.height) <= 1 && cs.overflow === "hidden") return true;
      n = n.parentElement;
    }
    return false;
  };
  // FINDING A: the true line geometry. A Range over the element's own text
  // gives one ClientRect per rendered line box, the real line count with no
  // rounding, and walking every character against those boxes gives the
  // real per-line character split.
  const lineRectsOf = (el) => {
    const r = document.createRange();
    r.selectNodeContents(el);
    return [...r.getClientRects()].filter((rc) => rc.width > 0.5 && rc.height > 0.5);
  };
  const lineCharCounts = (el, lineRects) => {
    const counts = new Array(lineRects.length).fill(0);
    const nodes = [...el.childNodes].filter((n) => n.nodeType === 3);
    if (!nodes.length || !lineRects.length) return counts;
    const tops = lineRects.map((rc) => Math.round(rc.top));
    const range = document.createRange();
    let li = 0;
    for (const node of nodes) {
      for (let i = 0; i < node.nodeValue.length; i++) {
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const rc = range.getClientRects()[0];
        if (!rc) continue;
        const top = Math.round(rc.top);
        while (li < tops.length - 1 && top > tops[li] + 1) li++;
        counts[li]++;
      }
    }
    return counts;
  };

  const out = [];
  const CARD = 'main [class*="rounded-[14px]"]';
  const cards = [...document.querySelectorAll(CARD)].filter((c) => c.getClientRects().length && !c.parentElement.closest('[class*="rounded-[14px]"]'));
  for (const card of cards) {
    const id = card.id || card.querySelector("[id]")?.id || "card";
    for (const el of card.querySelectorAll("*")) {
      if (el.children.length || !el.getClientRects().length) continue;
      const text = (el.textContent || "").trim();
      if (!text.length) continue;
      if (hiddenFromSight(el)) continue;
      const cs = getComputedStyle(el);
      const size = parseFloat(cs.fontSize);
      const snip = text.slice(0, 28);
      // FINDING C: READ SIZE alone has no character floor.
      if (size < 12) out.push({ id, rule: "READ SIZE", detail: `${size}px carrying ${text.length} characters a reader must read ("${snip}")` });
      if (text.length < 25) continue; // MEASURE/CONTRAST/LEADING: too short to have a measure or a leading
      const ratio = contrastOf(el, cs);
      if (ratio < 4.5) out.push({ id, rule: "CONTRAST", detail: `${ratio.toFixed(2)} to 1 against what is behind it, under 4.5 ("${snip}")` });
      const lineRects = lineRectsOf(el);
      const lines = Math.max(1, lineRects.length);
      const counts = lineCharCounts(el, lineRects);
      const cpl = counts.length ? Math.max(...counts) : text.length;
      const w = el.getBoundingClientRect().width;
      if (cpl > 78) out.push({ id, rule: "MEASURE", detail: `${cpl} characters a line over ${Math.round(w)}px across ${lines} line(s), past 78 ("${snip}")` });
      // FINDING E: the used line-height, measured, not assumed, whenever it
      // can matter (LEADING never fires at two lines or fewer, and two
      // gaps, i.e. three lines, is exactly what this needs to measure one).
      const gaps = lineRects.slice(1).map((rc, i) => rc.top - lineRects[i].top);
      const measuredLh = gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : null;
      const lh = cs.lineHeight === "normal" ? measuredLh ?? size * 1.2 : parseFloat(cs.lineHeight);
      if (lines > 2 && lh / size < 1.35) out.push({ id, rule: "LEADING", detail: `line height ${(lh / size).toFixed(2)} of the font size over ${lines} lines, under 1.35 ("${snip}")` });
    }
  }

  // FINDING B, part 2: CONTRAST alone widens outside cards, to every leaf in
  // `main` that a card does not already cover. See the header comment for
  // why the other three rules stay card-scoped.
  for (const el of document.querySelectorAll("main *")) {
    if (el.children.length || !el.getClientRects().length) continue;
    if (el.closest(CARD)) continue;
    const text = (el.textContent || "").trim();
    if (text.length < 25) continue;
    if (hiddenFromSight(el)) continue;
    const cs = getComputedStyle(el);
    const ratio = contrastOf(el, cs);
    if (ratio < 4.5) {
      const id = el.closest("[id]")?.id || "outside";
      out.push({ id, rule: "CONTRAST", detail: `${ratio.toFixed(2)} to 1 against what is behind it, under 4.5 ("${text.slice(0, 28)}")` });
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
    // reducedMotion: this repo fades an entrance animation on every h1 and
    // the paragraph right after it (globals.css, "hero-rise", 480ms), gated
    // behind the same prefers-reduced-motion media query Playwright's option
    // sets. Found live during the 2026-09-08 review: without this, CONTRAST's
    // new alpha-awareness (FINDING D) can catch that paragraph mid-fade and
    // score it against whatever opacity the animation happened to be at when
    // this ran, a real reading of a fake, timing-dependent moment, not the
    // settled state a reader actually reads. Reduced motion skips the
    // animation entirely, so the element renders at its plain, final opacity.
    const ctx = await browser.newContext({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
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
