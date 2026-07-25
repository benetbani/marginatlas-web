/**
 * scripts/crop_mockup.mjs
 *
 * Renders a standalone mockup (design/mockups/<page>.html) straight from file://
 * and slices it into one jpeg per chapter, plus a machine diagnostics pass.
 *
 * The mockups need no dev server, so this does NOT reuse crop_sections.mjs (which
 * drives localhost dev routes and the frozen taste-gate registry). Nothing here
 * touches that registry.
 *
 *   node scripts/crop_mockup.mjs country
 *   node scripts/crop_mockup.mjs country --mobile
 *
 * Output: E:/atlas/design/crops/<page>-mock/<nn>-<slug>.jpeg  (+ _diagnostics.json)
 *
 * deviceScaleFactor stays at 1 and reducedMotion at 'reduce': the fixed skyline
 * plus backdrop-filter makes 2x screenshots time out, and `.rise` starts at
 * opacity:0 under prefers-reduced-motion:no-preference.
 */
import { chromium } from "playwright-core";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";

const PAGES = ["cell", "city", "country"];
const argv = process.argv.slice(2);
const page = argv.find((a) => !a.startsWith("--"));
const mobile = argv.includes("--mobile");
if (!PAGES.includes(page)) {
  console.error(`Usage: node scripts/crop_mockup.mjs <${PAGES.join("|")}> [--mobile]`);
  process.exit(1);
}

const SRC = `file:///E:/atlas/design/mockups/${page}.html`;
const outDir = `E:/atlas/design/crops/${page}-mock${mobile ? "-m" : ""}`;
const width = mobile ? 390 : 1440;

function findChrome() {
  if (process.env.CHROME_EXE && existsSync(process.env.CHROME_EXE)) return process.env.CHROME_EXE;
  for (const c of [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    process.env.LOCALAPPDATA + "/Google/Chrome/Application/chrome.exe",
  ]) if (c && existsSync(c)) return c;
  return null;
}
const exe = findChrome();
if (!exe) { console.error("No Chrome found. Set CHROME_EXE."); process.exit(1); }

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 44).replace(/-+$/, "");

const browser = await chromium.launch({ executablePath: exe, headless: true });
const ctx = await browser.newContext({
  viewport: { width, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: "reduce",
});
const tab = await ctx.newPage();

const consoleErrors = [];
tab.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
tab.on("pageerror", (e) => consoleErrors.push("pageerror: " + e.message));

await tab.goto(SRC, { waitUntil: "load", timeout: 60000 });
await tab.waitForTimeout(1200); // glyph hydration + webfont settle

/* ---------- diagnostics: the things markup review cannot see ---------- */
const diag = await tab.evaluate(() => {
  const doc = document.documentElement;

  // 1. glyphs: rendered size, not merely present. A lost backslash in the size
  //    regex once made every icon silently fall back to 16px for two rounds.
  const glyphs = [...document.querySelectorAll("[data-ico]")].map((el) => {
    const svg = el.querySelector("svg.gi");
    const r = svg ? svg.getBoundingClientRect() : null;
    return {
      id: el.getAttribute("data-ico"),
      want: (el.className.match(/gi-\d+/) || ["(none)"])[0],
      got: r ? Math.round(r.width) : null,
    };
  });
  const missing = glyphs.filter((g) => g.got === null).map((g) => g.id);
  const wrongSize = glyphs
    .filter((g) => g.got !== null && /gi-(\d+)/.test(g.want) && g.got !== +g.want.match(/\d+/)[0])
    .map((g) => `${g.id} wants ${g.want} got ${g.got}px`);
  const tally = {};
  glyphs.forEach((g) => { tally[g.id] = (tally[g.id] || 0) + 1; });

  // 2. horizontal overflow, and which element causes it
  const overflow = [];
  if (doc.scrollWidth > doc.clientWidth + 1) {
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      if (r.right > doc.clientWidth + 1 || r.left < -1) {
        overflow.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || "").toString().slice(0, 60),
          left: Math.round(r.left), right: Math.round(r.right),
        });
      }
    }
  }

  // 3. chapter boundaries for the crops
  const wrap = document.querySelector(".wrap");
  const blocks = [...wrap.children].filter((n) => /^(SECTION|HEADER|FOOTER)$/.test(n.tagName));
  const sections = blocks.map((el) => {
    const r = el.getBoundingClientRect();
    const num = el.querySelector(".chnum");
    const h = el.querySelector("h1,h2,h3");
    return {
      num: num ? num.textContent.trim() : (el.tagName === "HEADER" ? "mast" : el.tagName === "FOOTER" ? "foot" : "hero"),
      heading: h ? h.textContent.trim().replace(/\s+/g, " ").slice(0, 60) : el.tagName.toLowerCase(),
      top: Math.round(r.top + window.scrollY),
      height: Math.round(r.height),
    };
  });

  // 4. empty containers a JS renderer was supposed to fill
  const emptyTargets = [...document.querySelectorAll("[id]")]
    .filter((el) => el.children.length === 0 && !el.textContent.trim() && !/^(INPUT|BUTTON|SVG|IMG)$/.test(el.tagName))
    .map((el) => `#${el.id}`);

  return {
    docHeight: doc.scrollHeight, docWidth: doc.scrollWidth, clientWidth: doc.clientWidth,
    glyphCount: glyphs.length, missingGlyphs: missing, wrongSizeGlyphs: wrongSize,
    glyphReuse: Object.entries(tally).filter(([, n]) => n > 2).sort((a, b) => b[1] - a[1]),
    overflow: overflow.slice(0, 12), sections, emptyTargets,
  };
});

/* ---------- crops ---------- */
mkdirSync(outDir, { recursive: true });
const clipW = Math.min(width, diag.clientWidth);
const written = [];
for (let i = 0; i < diag.sections.length; i++) {
  const s = diag.sections[i];
  const y = Math.min(s.top, diag.docHeight - 2);
  const height = Math.max(1, Math.min(s.height, 4000, diag.docHeight - y));
  const id = `${String(i).padStart(2, "0")}-${s.num.replace(/\W/g, "") || "x"}-${slugify(s.heading) || "untitled"}`;
  const buf = await tab.screenshot({
    fullPage: true, clip: { x: 0, y, width: clipW, height }, type: "jpeg", quality: 88,
  });
  writeFileSync(`${outDir}/${id}.jpeg`, buf);
  written.push({ id, ...s, kb: Math.round(buf.length / 1024) });
}
await browser.close();

const report = { page, viewport: width, src: SRC, consoleErrors, ...diag, crops: written };
writeFileSync(`${outDir}/_diagnostics.json`, JSON.stringify(report, null, 2), "utf8");

/* ---------- console summary ---------- */
console.log(`\n${page}.html @ ${width}px   ${diag.docHeight}px tall   ${written.length} blocks -> ${outDir}\n`);
console.log(`glyphs        ${diag.glyphCount} rendered, ${diag.missingGlyphs.length} missing, ${diag.wrongSizeGlyphs.length} wrong size`);
if (diag.missingGlyphs.length) console.log(`  MISSING     ${[...new Set(diag.missingGlyphs)].join(", ")}`);
if (diag.wrongSizeGlyphs.length) console.log(`  WRONG SIZE  ${diag.wrongSizeGlyphs.slice(0, 8).join(" | ")}`);
console.log(`overflow      ${diag.docWidth > diag.clientWidth + 1 ? `YES  doc ${diag.docWidth} vs client ${diag.clientWidth}` : "none"}`);
for (const o of diag.overflow) console.log(`  ${o.tag}.${o.cls}  ${o.left}..${o.right}`);
console.log(`empty targets ${diag.emptyTargets.length ? diag.emptyTargets.join(", ") : "none"}`);
console.log(`js errors     ${consoleErrors.length ? consoleErrors.join(" | ") : "none"}`);
console.log(`\nglyphs used 3+ times: ${diag.glyphReuse.map(([k, n]) => `${k}x${n}`).join("  ") || "none"}\n`);
for (const w of written) console.log(`  ${w.id.padEnd(52)} ${String(w.height).padStart(5)}px  ${String(w.kb).padStart(4)}kb`);
