/* throwaway (C43): the money band's two cards and the band itself, at four
   widths, so a card that grows taller can be checked against what it opens
   beside its neighbour. `Band` sets items-start by design, so a taller card
   leaves the band's short side empty, which C9 and C12 both recorded and which
   no gate reads (verify_gathered_emptiness measures inside cards).
   node scratchpad/loop18_bandvoid.mjs <page.html> */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const f = process.argv[2];
const b = await chromium.launch();
for (const w of [1280, 900, 768, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1200 } });
  await p.goto(pathToFileURL(f).href, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const money = document.querySelector("#money"), cust = document.querySelector("#customers");
    if (!money || !cust) return null;
    const m = money.getBoundingClientRect(), c = cust.getBoundingClientRect();
    const band = money.parentElement.getBoundingClientRect();
    return { money: [Math.round(m.width), Math.round(m.height)], customers: [Math.round(c.width), Math.round(c.height)], band: [Math.round(band.width), Math.round(band.height)] };
  });
  console.log(`@${w}`, JSON.stringify(r));
  await p.close();
}
await b.close();
