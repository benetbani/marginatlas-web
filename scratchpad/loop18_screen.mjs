/* throwaway (C29): the first N pixels of a page at a width, as one photograph,
   so a card can be judged in its band rather than in a crop.
   node scratchpad/loop18_screen.mjs <file.html> <out> <width> [y] [h] */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
const [file, out, w, y = "0", h = "1200"] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: 1000 }, deviceScaleFactor: 2 });
await p.goto(pathToFileURL(resolve(file)).href, { waitUntil: "load" });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(250);
await p.screenshot({ path: `${out}-${w}.jpeg`, quality: 88, type: "jpeg", fullPage: true, clip: { x: 0, y: +y, width: +w, height: +h } });
console.log(`${out}-${w}.jpeg`);
await b.close();
