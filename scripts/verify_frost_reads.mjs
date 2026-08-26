/**
 * verify_frost_reads , THE FROST MUST HAVE SOMETHING TO REFRACT.
 *
 * Founder, 2026-08-25: "the sections do not have the frost that we need."
 * Measured that day: the ground inside a card composited to rgb(254,255,255),
 * which is white. A backdrop-filter over white is a white rectangle, so the
 * treatment ratified on 2026-08-20 was present in the markup and absent to a
 * reader.
 *
 * BLIND SPOT, stated because this number will be quoted: this samples ONE row of
 * pixels per page at a fixed height. It cannot tell a card that reads as glass
 * everywhere from one that reads as glass only where it was sampled. It is a
 * floor, not a proof.
 *
 * Usage: node scripts/verify_frost_reads.mjs
 */
import { chromium } from "playwright";
import { requireBrowser } from "./lib/local_only.mjs";

/* A BUILD SERVER HAS NO BROWSER. This gate photographs real pages, so it cannot
   run where chromium is not installed, and trying killed a production deploy on
   2026-08-27. It skips loudly there and runs unchanged on the design machine. */
await requireBrowser("frost-reads", "whether the frosted panels still read against their backgrounds");

const PAGES = ["city-london", "cell-london-restaurants", "industry-restaurants", "hood-london"];
const MIN_DELTA = 6; // the card ground must sit at least this far below pure white

const run = async () => {
  const b = await chromium.launch();
  const fails = [];
  for (const name of PAGES) {
    const p = await b.newPage({ viewport: { width: 1440, height: 2600 } });
    await p.goto(`file:///E:/atlas/website/docs/loop/artifacts/final-pages/${name}.html`);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(500);
    /* SAMPLED DOWN THE PAGE, NOT AT ONE PIXEL. The first version took a single
       point at one height and reported the city page as unfrosted: the skyline's
       sky sits in that band and is nearly white at .32 opacity, so there was
       genuinely little to refract THERE while the same page read 21 below white
       lower down. One pixel cannot answer "does the frost read on this page", so
       this takes the median of several heights. */
    /* SAMPLED ON A GRID, NOT DOWN ONE COLUMN. The atmosphere layer is FIXED, so
       the same slice of photograph sits behind the whole scroll; one x position
       therefore reports one part of one image forever. The neighbourhood page's
       street motif is bright sky at x=500, which read as pure white while the
       same page was plainly frosted 200px to either side. Median of the grid. */
    const XS = [300, 500, 700, 900];
    const YS = [400, 1400, 2400];
    const deltas = [];
    for (const y of YS) {
      const shot = await p.screenshot({ clip: { x: 0, y, width: 1440, height: 40 } });
      const row = await p.evaluate(async ({ b64, xs }) => {
        const img = new Image();
        img.src = "data:image/png;base64," + b64;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        const g = c.getContext("2d");
        g.drawImage(img, 0, 0);
        return xs.map((x) => {
          const d = g.getImageData(x, 20, 1, 1).data;
          return 255 - Math.min(d[0], d[1], d[2]);
        });
      }, { b64: shot.toString("base64"), xs: XS });
      deltas.push(...row);
    }
    deltas.sort((a, b) => a - b);
    const median = deltas[Math.floor(deltas.length / 2)];
    if (median < MIN_DELTA) fails.push(`${name}: median ${median} below white over ${deltas.length} samples (${deltas.join(", ")}), needs ${MIN_DELTA}`);
    await p.close();
  }
  await b.close();
  if (fails.length) {
    console.log(`\nx verify_frost_reads: ${fails.length} page(s) where the frost cannot read.`);
    fails.forEach((f) => console.log("     " + f));
    console.log("\n  A backdrop-filter over white is a white rectangle. Either the ground\n  under the cards keeps some of the photograph, or the frost is not there.\n");
    process.exit(1);
  }
  console.log(`\nPASS verify_frost_reads , all ${PAGES.length} pages keep a ground the frost can act on.\n`);
};
void run();
