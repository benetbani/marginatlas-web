/* THROWAWAY. Photograph one card of the TRADE-SECTIONS surface at 1280 and 375,
 * plus the band it sits in, and report its measured geometry.
 *
 * The sixth run's findings name a `loop6_shoot_trade.mjs` that was never left in
 * the tree, so this is that file rebuilt. It exists because
 * `scratchpad/loop3_shoot.mjs` reads `docs/loop/artifacts/final-pages/*.html`
 * and EVERY wave-B row but B8 renders into
 * `E:/atlas/design/TRADE-SECTIONS-AS-BUILT.html` instead, which holds TWO trade
 * columns in one document, so a card has to be found by column as well as by
 * text.
 *
 * Usage:
 *   node scratchpad/loop7_shoot_trade.mjs <0=restaurant|1=plumber> "<kicker>" <out-prefix>
 *
 * TWO TRAPS IT ALREADY PAYS FOR, carried from loop3_shoot: a Playwright clip is
 * relative to the VIEWPORT unless `fullPage: true` is set, and a loose text
 * match hits the wrong card. These cards carry no ids, so the match is on the
 * kicker's exact text.
 */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { mkdirSync } from "node:fs";

const col = Number(process.argv[2] ?? 0);
const needle = process.argv[3];
const out = process.argv[4];
mkdirSync(out.slice(0, out.lastIndexOf("/")), { recursive: true });
const url = pathToFileURL("E:/atlas/design/TRADE-SECTIONS-AS-BUILT.html").href;
const b = await chromium.launch();
for (const w of [1280, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 }, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: "load" });
  await p.waitForTimeout(300);
  const box = await p.evaluate(
    ({ needle, col }) => {
      /* The two trade columns are the two children of the stacking flex box. */
      const columns = [...document.querySelectorAll("div")].filter(
        (d) => d.parentElement && getComputedStyle(d.parentElement).flexDirection === "column" && d.querySelector("h3, [class*='tracking']"),
      );
      const root = document.body;
      const heads = [...root.querySelectorAll("*")].filter(
        (e) => e.children.length === 0 && e.textContent.trim().toLowerCase() === needle.toLowerCase(),
      );
      const h = heads[col] ?? heads[0];
      if (!h) return { found: heads.length };
      let card = h;
      for (let i = 0; i < 8 && card; i++) {
        card = card.parentElement;
        if (card && /rounded-\[/.test(card.className || "")) break;
      }
      if (!card) return null;
      const band = card.parentElement;
      const r = (e) => {
        const q = e.getBoundingClientRect();
        return { x: Math.round(q.x + scrollX), y: Math.round(q.y + scrollY), width: Math.round(q.width), height: Math.round(q.height) };
      };
      return { n: heads.length, card: r(card), band: band ? r(band) : null };
    },
    { needle, col },
  );
  if (!box || !box.card) {
    console.log(w, "NOT FOUND", JSON.stringify(box));
    await p.close();
    continue;
  }
  console.log(w, JSON.stringify(box));
  const pad = 12;
  await p.screenshot({
    path: `${out}-${w}.jpeg`,
    quality: 90,
    type: "jpeg",
    fullPage: true,
    clip: { x: Math.max(0, box.card.x - pad), y: Math.max(0, box.card.y - pad), width: Math.min(w, box.card.width + pad * 2), height: box.card.height + pad * 2 },
  });
  if (box.band) {
    await p.screenshot({
      path: `${out}-band-${w}.jpeg`,
      quality: 90,
      type: "jpeg",
      fullPage: true,
      clip: { x: Math.max(0, box.band.x - pad), y: Math.max(0, box.band.y - pad), width: Math.min(w, box.band.width + pad * 2), height: box.band.height + pad * 2 },
    });
  }
  await p.close();
}
await b.close();
