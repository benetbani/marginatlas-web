/**
 * The one place the visual gates open the built pages. Every gate that measures
 * a RENDERED page imports this, so a change to how pages are opened lands once.
 *
 * The pages come from scripts/build_final_pages.tsx, which regenerates the
 * stylesheet on every run. Run that first or the measurement describes an older
 * page than the one on disk.
 */
import { chromium } from "playwright";

export const PAGES = ["city-london", "cell-london-restaurants", "industry-restaurants", "hood-london"];

export async function eachPage(width, fn) {
  const b = await chromium.launch();
  const out = [];
  for (const name of PAGES) {
    const p = await b.newPage({ viewport: { width, height: 1000 } });
    await p.goto(`file:///E:/atlas/website/docs/loop/artifacts/final-pages/${name}.html`);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(400);
    out.push({ name, result: await p.evaluate(fn) });
    await p.close();
  }
  await b.close();
  return out;
}
