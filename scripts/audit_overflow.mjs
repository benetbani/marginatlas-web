/**
 * scripts/audit_overflow.mjs , does anything sit outside the sheet it belongs to?
 *
 * The founder's review of 2026-07-26, first and most-stressed item:
 *
 *   "There is a consistent problem ... that you extend the elements of the
 *    sections a little bit beyond this white line, which is not correct.
 *    There should be a little bit of padding, they should be inside ...
 *    everything written on the page should be inside this white margin."
 *
 * and, separately, about tables:
 *
 *   "You have given no padding on the table for the left and right side, so the
 *    tax figure is just written on the edge."
 *
 * Those are two different defects and this script separates them, because the
 * fixes are different:
 *
 *   BREACH  , a descendant's ink crosses OUTSIDE its container's border box.
 *             Always wrong. The thing has escaped the sheet.
 *   FLUSH   , a descendant's ink lands inside the border box but within
 *             MIN_PAD of the edge, i.e. touching the edge with no breathing
 *             room. This is the table complaint.
 *
 * WHY IT MEASURES INK AND NOT BOXES. A block-level element legitimately spans
 * its container's full content width; reporting that would flag every paragraph
 * on the page and the gate would be useless on day one. What the founder can
 * SEE is text and marks. So this walks leaf elements that actually paint
 * (text nodes, and elements with a background or border) and measures those.
 *
 * DELIBERATE EXCLUSIONS, each with a reason:
 *   - Elements the page hides (display:none, zero-size, visibility:hidden).
 *   - Anything inside a horizontal scroller (`.scroll-x`), which is designed to
 *     overflow and is scrolled deliberately.
 *   - Decorative full-bleed layers (a container's own background/rule elements)
 *     are detected by having no text and being exactly as wide as the parent.
 *   - Containers that do not clip and are not sheets (only `.wrap`, `.glass`,
 *     `.panel`, `.card`, `.tb` and friends are treated as sheets, because those
 *     are what draw the white edge the founder is pointing at).
 *
 * Usage:
 *   node scripts/audit_overflow.mjs country
 *   node scripts/audit_overflow.mjs country city cell --width 390
 */
import { chromium } from "playwright-core";
import { existsSync } from "node:fs";

const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const WIDTH = Number(flag("--width", 1440));
/** Ink closer than this to a sheet edge reads as "written on the edge". */
const MIN_PAD = Number(flag("--minpad", 8));
const pages = argv.filter((a, i) => !a.startsWith("--") && argv[i - 1] !== "--width" && argv[i - 1] !== "--minpad");
if (!pages.length) { console.error("usage: node scripts/audit_overflow.mjs <country|city|cell> [...]"); process.exit(1); }

const exe = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
].find((p) => existsSync(p));
if (!exe) { console.error("no chrome"); process.exit(1); }

const browser = await chromium.launch({ executablePath: exe, headless: true });
let breaches = 0, flushes = 0;

for (const name of pages) {
  const page = await browser.newPage({ viewport: { width: WIDTH, height: 1000 } });
  /* A bare name is one of the three mockups; anything containing a slash or
     ending .html is a path, so older generations under previews/ and
     page-previews/ can be measured against the same bar. */
  const url = /[/\\]|\.html$/.test(name)
    ? `file:///${name.replace(/\\/g, "/").replace(/^\/*/, "").replace(/^(?![A-Za-z]:)/, "E:/atlas/")}`
    : `file:///E:/atlas/design/mockups/${name}.html`;
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(600);

  const found = await page.evaluate((MIN_PAD) => {
    /* Only things that actually DRAW the white edge the founder is pointing at.
       `.grp`, `.band` and `.take` were in this list on the first pass and every
       one of their hits was a false positive: they are ROWS inside a panel, so
       their content correctly starts at the row's own left edge, already inset
       by the panel's padding. Treating a row as a sheet reported 9 defects on
       ch03 where the crop plainly shows correct inset. Rows are not sheets. */
    const SHEET = ".wrap,.glass,.panel,.card,.bento,.tb";
    const out = [];

    const paints = (el) => {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length);
      if (hasText) return true;
      const bg = cs.backgroundColor;
      const painted = (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") ||
        cs.backgroundImage !== "none" ||
        parseFloat(cs.borderTopWidth) + parseFloat(cs.borderRightWidth) +
        parseFloat(cs.borderBottomWidth) + parseFloat(cs.borderLeftWidth) > 0;
      return painted && el.children.length === 0;
    };

    const label = (el) => {
      const t = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 44);
      const cls = el.className && typeof el.className === "string"
        ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
      return `${el.tagName.toLowerCase()}${cls}${t ? ` "${t}"` : ""}`;
    };

    for (const el of document.querySelectorAll("*")) {
      if (!paints(el)) continue;
      /* Anything inside a genuinely scrollable ancestor is REACHABLE, so it is
         not the defect the founder is describing. This was originally written
         as `el.closest(".scroll-x")`, matching one class by name, and that
         misreported the whole `.matrix` licence grid as breaching: `.matrix`
         already carries `overflow-x:auto`, so its columns scroll. Detecting the
         computed style instead of a class name is the difference between
         measuring the property and guessing at the markup that usually
         expresses it. */
      let scrollable = false;
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        const ox = getComputedStyle(a).overflowX;
        if (ox === "auto" || ox === "scroll") { scrollable = true; break; }
      }
      if (scrollable) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;

      /* A fixed or sticky element's containing block is the viewport, not the
         sheet it happens to be nested inside, so measuring it against the sheet
         is meaningless. The first run of this script reported 60 breaches and
         every one of them was the `position:fixed` chapter rail sitting in the
         right margin exactly where it is designed to sit. A gate that cries
         wolf is as bad as one that is silent, so this is checked BEFORE the
         sheet lookup rather than filtered out of the report afterwards. */
      let fixed = false;
      for (let a = el; a && a !== document.body; a = a.parentElement) {
        const p = getComputedStyle(a).position;
        if (p === "fixed" || p === "sticky") { fixed = true; break; }
      }
      if (fixed) continue;

      const sheet = el.parentElement && el.parentElement.closest(SHEET);
      if (!sheet || sheet === el) continue;
      const sr = sheet.getBoundingClientRect();
      const scs = getComputedStyle(sheet);
      // Decorative full-bleed layer: no text, exactly the sheet's width.
      const hasText = (el.textContent || "").trim().length > 0;
      if (!hasText && Math.abs(r.width - sr.width) < 1.5) continue;

      const padL = parseFloat(scs.paddingLeft) || 0;
      const padR = parseFloat(scs.paddingRight) || 0;
      const inL = sr.left + padL, inR = sr.right - padR;

      const overL = inL - r.left;   // >0 = sticks out to the left
      const overR = r.right - inR;  // >0 = sticks out to the right

      // BREACH is measured against the sheet's BORDER box, not its padding box.
      const bL = sr.left - r.left, bR = r.right - sr.right;
      if (bL > 0.5 || bR > 0.5) {
        out.push({ kind: "BREACH", by: Math.round(Math.max(bL, bR)), side: bL > bR ? "left" : "right",
          el: label(el), sheet: label(sheet) });
        continue;
      }
      // FLUSH: inside the box, but hard against the edge.
      const gapL = r.left - sr.left, gapR = sr.right - r.right;
      const gap = Math.min(gapL, gapR);
      if (gap < MIN_PAD) {
        out.push({ kind: "FLUSH", by: Math.round(gap), side: gapL < gapR ? "left" : "right",
          el: label(el), sheet: label(sheet) });
      }
    }
    return out;
  }, MIN_PAD);

  const b = found.filter((f) => f.kind === "BREACH");
  const f = found.filter((f) => f.kind === "FLUSH");
  breaches += b.length; flushes += f.length;

  console.log(`\n${"=".repeat(74)}\n${name}.html  @ ${WIDTH}px   min padding ${MIN_PAD}px\n${"=".repeat(74)}`);
  if (!found.length) console.log("  clean , nothing outside its sheet, nothing on the edge");
  for (const x of b) console.log(`  BREACH ${String(x.by).padStart(3)}px ${x.side.padEnd(5)} ${x.el}\n         inside ${x.sheet}`);
  for (const x of f) console.log(`  FLUSH  ${String(x.by).padStart(3)}px ${x.side.padEnd(5)} ${x.el}\n         inside ${x.sheet}`);
  await page.close();
}

console.log(`\n${breaches} breach, ${flushes} flush`);
await browser.close();
process.exit(breaches > 0 ? 1 : 0);
