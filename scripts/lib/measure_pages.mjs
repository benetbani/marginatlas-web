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
  return (await eachPageAtWidths([width], fn))[0].result;
}

/**
 * The same measurement at several widths, on ONE browser.
 *
 * A gate that needs two widths used to call eachPage twice, which launched and
 * tore down a browser each time. On 2026-08-25 a chain run took three times its
 * usual wall-clock and four gates died on allocation failures, none of them at
 * fault and all of them downstream of the browser work. Halving the launches is
 * not a fix for that on its own, but a second browser to render the same four
 * files is waste whatever the machine is doing.
 *
 * Returns [{ width, result: [{ name, result }] }], newest measurement last.
 */
export async function eachPageAtWidths(widths, fn) {
  const b = await chromium.launch();
  const out = [];
  try {
    for (const width of widths) {
      const perPage = [];
      for (const name of PAGES) {
        const p = await b.newPage({ viewport: { width, height: 1000 } });
        try {
          await p.goto(`file:///E:/atlas/website/docs/loop/artifacts/final-pages/${name}.html`);
          await p.evaluate(() => document.fonts.ready);
          await p.waitForTimeout(400);
          perPage.push({ name, result: await p.evaluate(fn) });
        } finally {
          await p.close();
        }
      }
      out.push({ width, result: perPage });
    }
  } finally {
    /* Closed in a finally so a throw mid-measurement cannot leave a browser
       behind. A stray chromium is invisible until the next run runs short of
       memory and blames a gate that is working. */
    await b.close();
  }
  return out;
}
