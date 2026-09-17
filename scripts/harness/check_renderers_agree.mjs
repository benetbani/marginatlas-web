/**
 * THE TWO RENDERERS CANNOT DIVERGE (plan step 25, 2026-09-17).
 *
 * The story sheet (render_archetypes.tsx) and the page renderer
 * (render_page.tsx) drew the same card under different stylesheets for weeks:
 * the page mounted SpineShell and its inline rules, the sheet did not, so
 * every figure on the sheet was in the body face while the page had the
 * display face, and nobody's photographs showed the truth. Both now render
 * through the shell and one global stylesheet. This check keeps it so.
 *
 * It opens ONE card both ways, the London districts card, which lives on the
 * sheet as ranked-bars/london:districts and on the city page as #districts,
 * reads the computed styles a drift would change first, and reds on any
 * difference:
 *
 *   the figure:      font-family, font-weight, font-variant-numeric, font-size
 *   the card:        border-color, background-color, border-radius
 *   the kicker:      font-family, letter-spacing, text-transform
 *
 * usage: node scripts/harness/check_renderers_agree.mjs
 *        (after both renders exist: npm run harness writes them; the driver
 *         runs this last in the full run)
 *
 * BLIND SPOT, stated: this compares one card at one width. A rule that only
 * a different card's markup would exercise (a pill, a flag, a track) is not
 * covered; the choice of card is the one whose figure face bug started this,
 * and adding cards is one line each in CARDS below. It reads computed styles,
 * so a rule present in both stylesheets but overridden by a class on one side
 * only is caught; a rule that affects no measured property is not.
 */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve, join } from "node:path";
import { existsSync } from "node:fs";
import { preflight } from "./preflight.mjs";

preflight({ browser: true, name: "check_renderers_agree" });

const ROOT = process.cwd();
const SHEET = resolve(ROOT, "scratchpad/harness/archetypes.html");
const PAGE = resolve(ROOT, "scratchpad/harness/pages/city-london.html");

/* Each entry: one card, how to find it on the sheet and on the page. */
const CARDS = [
  { name: "london districts", sheet: '[data-stories="ranked-bars"] [data-story="london:districts"] [data-archetype="ranked-bars"]', page: '#districts[data-archetype="ranked-bars"], #districts [data-archetype="ranked-bars"], #districts' },
];

const PROPS = {
  figure: ["font-family", "font-weight", "font-variant-numeric", "font-size"],
  card: ["border-top-color", "background-color", "border-top-left-radius"],
  kicker: ["font-family", "letter-spacing", "text-transform"],
};

for (const f of [SHEET, PAGE]) if (!existsSync(f)) { console.error(`renderers-agree: missing ${f}; run npm run harness first`); process.exit(2); }

const b = await chromium.launch();
async function read(file, sel) {
  const p = await (await b.newContext({ viewport: { width: 1280, height: 1200 } })).newPage();
  await p.goto(pathToFileURL(file).href, { waitUntil: "load" });
  await p.evaluate(() => document.fonts && document.fonts.ready);
  const out = await p.evaluate(({ sel, PROPS }) => {
    const card = document.querySelector(sel);
    if (!card) return { error: `no element for ${sel}` };
    const pick = (el, props) => el ? Object.fromEntries(props.map((k) => [k, getComputedStyle(el).getPropertyValue(k).trim()])) : null;
    /* The card is the element carrying data-archetype, never a story wrapper:
       the sheet's story caption is also uppercase and sat one level up, and
       the first run of this check compared the caption with the page's kicker
       and called it a drift. The kicker is the Rail's h3 on both sides. */
    const box = card.matches("[data-archetype]") ? card : card.querySelector("[data-archetype]") ?? card;
    const fig = box.querySelector(".fig");
    const kicker = box.querySelector("h3");
    return { figure: pick(fig, PROPS.figure), card: pick(box, PROPS.card), kicker: pick(kicker, PROPS.kicker) };
  }, { sel, PROPS });
  await p.context().close();
  return out;
}

let reds = 0;
for (const c of CARDS) {
  const s = await read(SHEET, c.sheet);
  const g = await read(PAGE, c.page);
  if (s.error || g.error) { console.log(`renderers-agree: ${c.name}: ${s.error ?? ""} ${g.error ?? ""}`.trim()); reds++; continue; }
  for (const part of Object.keys(PROPS)) {
    if (!s[part] || !g[part]) { console.log(`renderers-agree: ${c.name}: the ${part} was not found on ${!s[part] ? "the sheet" : "the page"}`); reds++; continue; }
    for (const k of PROPS[part]) {
      if (s[part][k] !== g[part][k]) { console.log(`renderers-agree: ${c.name}: ${part} ${k} differs: sheet "${s[part][k]}" against page "${g[part][k]}"`); reds++; }
    }
  }
}
await b.close();
if (reds) { console.log(`renderers-agree: ${reds} difference(s); the story sheet and the page renderer have drifted apart. Both must load the same stylesheet through the same shell.`); process.exit(1); }
console.log(`renderers-agree: ${CARDS.length} card(s) render the same both ways (figure, card, kicker at 1280)`);
