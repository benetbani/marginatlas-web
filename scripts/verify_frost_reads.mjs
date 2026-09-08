/**
 * verify_frost_reads , NO CARD IS GLASS ANY MORE, AND THAT MUST STAY TRUE.
 *
 * INVERTED 2026-09-08, fix wave Finding 3. This gate used to prove the
 * frosted glass card surface (kit.tsx's old CARD_SURFACE, a translucent white
 * over a blurred photograph) actually read against its background rather than
 * compositing to plain white. Founder, 2026-08-25: "the sections do not have
 * the frost that we need." That premise is gone: the founder's ruling of
 * 2026-09-07 removed both the photograph (AtlasFrame.tsx, SpineShell) and the
 * glass (CARD_SURFACE now paints `var(--c-card)`, a flat, fully opaque white,
 * with no backdrop-filter at all). There is nothing left to sample a frost
 * read from, and a gate that kept asking "does the frost read" would pass
 * vacuously on every page, forever: the same silent-zero failure Finding 2 of
 * this fix wave found in nine other gates that used to detect a card by
 * `backdropFilter !== "none"`.
 *
 * SO THE GATE IS INVERTED RATHER THAN DELETED. Its job now is the opposite
 * assertion: that no card on these pages carries a `backdrop-filter` and that
 * no card's own background is translucent (alpha below 1). Either one
 * returning would be the glass coming back, and this is the one gate whose
 * entire reason to exist is noticing that before a founder does. Same file
 * name, same slot in the chain (`frost-reads` in scripts/prebuild_all.ts), so
 * the gate count does not move.
 *
 * CARD DEFINITION: the harness's own, not a new one
 * (scripts/harness/check_page_holes.mjs): a `main [class*="rounded-[14px]"]`
 * element with client rects, not nested inside another one. Same repoint as
 * the other nine gates in this fix wave's Finding 2, for the same reason:
 * `backdropFilter` can no longer be used to FIND a card, only to judge one
 * once found some other way.
 *
 * BLIND SPOT, stated because this number will be quoted: this only sees the
 * four static pages below, hand-rendered snapshots
 * (docs/loop/artifacts/final-pages) that this chain does not regenerate.
 * A snapshot that predates a source change reads as whatever the snapshot
 * shows, not as what the site currently renders; running
 * `scripts/build_final_pages.tsx` first keeps this current, and this file
 * cannot tell the difference between "the glass came back" and "this
 * snapshot is simply old" on its own. It also cannot see a card built the
 * old way outside these four pages, or a hand-rolled card wrapper that
 * spreads CARD_SURFACE directly without going through `Box` (this fix wave's
 * own report names three such wrappers, still carrying the old --c-border
 * edge, that render on pages this file does not open).
 *
 * Usage: node scripts/verify_frost_reads.mjs
 */
import { chromium } from "playwright";
import { requireBrowser } from "./lib/local_only.mjs";

/* A BUILD SERVER HAS NO BROWSER. This gate photographs real pages, so it cannot
   run where chromium is not installed, and trying killed a production deploy on
   2026-08-27. It skips loudly there and runs unchanged on the design machine. */
await requireBrowser("frost-reads", "whether any card surface has quietly become glass again");

const PAGES = ["city-london", "cell-london-restaurants", "industry-restaurants", "hood-london"];
const MIN_ALPHA = 0.999; // a card's own background must be fully opaque, not merely close to it

const run = async () => {
  const b = await chromium.launch();
  const fails = [];
  let totalCards = 0;
  for (const name of PAGES) {
    const p = await b.newPage({ viewport: { width: 1440, height: 2600 } });
    await p.goto(`file:///E:/atlas/website/docs/loop/artifacts/final-pages/${name}.html`);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    const result = await p.evaluate(() => {
      const cards = [...document.querySelectorAll('main [class*="rounded-[14px]"]')].filter(
        (c) => c.getClientRects().length && !c.parentElement.closest('[class*="rounded-[14px]"]'),
      );
      return cards.map((c) => {
        const s = getComputedStyle(c);
        const bg = s.backgroundColor;
        const m = bg.match(/rgba?\(([^)]+)\)/);
        const parts = m ? m[1].split(",").map((x) => parseFloat(x.trim())) : [];
        const alpha = parts.length === 4 ? parts[3] : 1;
        const label = (c.querySelector("h1, h2, h3")?.textContent || c.textContent || "")
          .trim().replace(/\s+/g, " ").slice(0, 40);
        return { label, backdrop: s.backdropFilter, bg, alpha };
      });
    });
    totalCards += result.length;
    for (const c of result) {
      if (c.backdrop && c.backdrop !== "none") {
        fails.push(`${name}: card "${c.label}" carries backdrop-filter "${c.backdrop}"`);
      }
      if (c.alpha < MIN_ALPHA) {
        fails.push(`${name}: card "${c.label}" background "${c.bg}" is translucent (alpha ${c.alpha})`);
      }
    }
    await p.close();
  }
  await b.close();
  if (fails.length) {
    console.log(`\nx verify_frost_reads: ${fails.length} card(s), of ${totalCards} checked, still (or again) carry glass.`);
    fails.forEach((f) => console.log("     " + f));
    console.log("\n  The founder's ruling of 2026-09-07 removed the photograph and the glass\n  card together. A backdrop-filter or a translucent card fill is that\n  surface coming back, on a page whose ground is now flat grey.\n");
    process.exit(1);
  }
  console.log(`\nPASS verify_frost_reads , ${totalCards} card(s) across ${PAGES.length} pages, none carrying a backdrop-filter or a translucent fill.\n`);
};
void run();
