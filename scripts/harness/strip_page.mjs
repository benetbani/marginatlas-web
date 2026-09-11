/**
 * THE WHOLE-PAGE PHOTOGRAPH, for judging composition rather than a card.
 *
 * shoot_page.mjs photographs one card and its band. Nothing photographed the
 * WHOLE page, so nobody could answer the only question composition asks: does
 * this read as a composed page or as a stack of identical slabs. Built on
 * 2026-09-11 for the country page's re-composition, because the founder's
 * question ("how have you actually updated the architecture skeletons") is a
 * whole-page question and a band crop cannot answer it.
 *
 * IT IS STILL A VIEWPORT CAPTURE, which is this folder's law (doctrine 7: a
 * full-page capture paints a white block over the page's fixed atmosphere
 * layers, so none is taken). The trick is that the viewport is GROWN to the
 * document's own height before the shutter, so the clip is the viewport and
 * the fixed layers paint against a viewport that is the whole page. No
 * stitching, no repeated atmosphere, nothing composited.
 *
 * usage: node scripts/harness/strip_page.mjs <surface> <slug> [widths] [out-prefix]
 *        node scripts/harness/strip_page.mjs <file.html> [widths] [out-prefix]
 *   widths default 1280,375 (the two the founder judges). Writes
 *   <out>-<w>.jpeg at device scale 1 and prints each document height.
 */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";
import { existsSync, mkdirSync } from "node:fs";
import { preflight } from "./preflight.mjs";

preflight({ browser: true, name: "strip_page" });

const argv = process.argv.slice(2);
if (argv.length === 0) {
  console.error("usage: strip_page.mjs <surface> <slug> [widths] [out-prefix]  |  <file.html> [widths] [out-prefix]");
  process.exit(2);
}

/* A PAGE IS NAMED THE WAY THE FILTER NAMES IT, so a caller never has to know
   where render_page puts its output: `country GB` resolves to the filter's own
   render. A path is taken as given. */
let target;
let rest;
if (/\.html?$/i.test(argv[0])) {
  target = argv[0];
  rest = argv.slice(1);
} else {
  const [surface, slug] = argv;
  if (!slug) {
    console.error("strip_page: a surface needs its slug, as in `country GB`");
    process.exit(2);
  }
  target = `scratchpad/harness/pages/${surface}-${slug}.html`;
  rest = argv.slice(2);
}
if (!existsSync(resolve(target))) {
  console.error(`strip_page: ${target} is not on disk; run \`npm run harness:page\` first so the page is rendered from the real adapters`);
  process.exit(2);
}

const widths = (rest[0] || "1280,375").split(",").map(Number);
const out = rest[1] || `scratchpad/harness/strips/${target.split(/[\\/]/).pop().replace(/\.html?$/i, "")}`;
mkdirSync(dirname(resolve(out)), { recursive: true });

const url = pathToFileURL(resolve(target)).href;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const CAP = 12000;

const b = await chromium.launch();
for (const w of widths) {
  const ctx = await b.newContext({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1, userAgent: UA });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "load", timeout: 60000 });
  /* BOTH FACES BY NAME BEFORE THE SHUTTER, for shoot_page's own reason: a face
     nothing has drawn yet is still loading when `fonts.ready` resolves, and a
     photograph printing a fallback looks like a finished page. */
  await p.evaluate(async () => {
    if (!document.fonts) return;
    for (const wt of [400, 500, 600, 700]) {
      await Promise.allSettled([document.fonts.load(`${wt} 16px Geist`), document.fonts.load(`${wt} 16px 'Space Grotesk'`)]);
    }
    await document.fonts.ready;
  });
  await p.evaluate(async () => {
    for (const im of document.images) {
      im.loading = "eager";
      try { await im.decode(); } catch { /* the capture goes on */ }
    }
  });
  const h = await p.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
  const height = Math.min(h, CAP);
  await p.setViewportSize({ width: w, height });
  await p.waitForTimeout(300);
  const file = `${out}-${w}.jpeg`;
  await p.screenshot({ path: file, type: "jpeg", quality: 72, clip: { x: 0, y: 0, width: w, height } });
  console.log(`${file}  ${w}x${height}${h > CAP ? ` (document ${h}, clipped at ${CAP})` : ""}`);
  await ctx.close();
}
await b.close();
