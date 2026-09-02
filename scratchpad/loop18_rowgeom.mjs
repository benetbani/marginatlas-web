/* throwaway (C43): the internal geometry of the country money grid's row, at a
   narrow width and a phone width. It settles whether the two lines of a wrapped
   row are kerned more tightly than the rows are spaced (step 7): measured, the
   gap BETWEEN the two flex lines is 0 and the gap between two rows is 20px of
   padding plus a hairline, so the rhythm is unambiguous.
   node scratchpad/loop18_rowgeom.mjs */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const b = await chromium.launch();
for (const w of [900, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1200 } });
  await p.goto(pathToFileURL("E:/atlas/website/docs/loop/artifacts/final-pages/country-gb-new.html").href, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const rows = [...document.querySelectorAll("#money a")];
    const out = [];
    for (const a of rows) {
      const name = a.firstElementChild, readings = a.lastElementChild;
      const nb = name.getBoundingClientRect(), rb = readings.getBoundingClientRect(), ab = a.getBoundingClientRect();
      out.push({ row: Math.round(ab.height), nameTop: Math.round(nb.top - ab.top), nameH: Math.round(nb.height), gap: Math.round(rb.top - nb.bottom), readH: Math.round(rb.height) });
    }
    const rowGap = rows.length > 1 ? Math.round(rows[1].getBoundingClientRect().top - rows[0].getBoundingClientRect().bottom) : null;
    return { out, rowGap, pad: getComputedStyle(rows[0]).paddingTop };
  });
  console.log(`@${w}  padding ${r.pad}  gap between rows (border only) ${r.rowGap}`);
  r.out.slice(0, 2).forEach((o) => console.log("   ", JSON.stringify(o)));
  await p.close();
}
await b.close();
