/**
 * The one place the visual gates open the rendered spine pages. Every gate that
 * measures a RENDERED page imports this, so a change to how pages are opened
 * lands once.
 *
 * WHICH PAGES (plan step 14b, 2026-09-17): the `fresh` entries of
 * scripts/lib/page_renders.mjs, the six spine surfaces of
 * scripts/harness/pages.json rendered by scripts/harness/render_page.tsx into
 * scratchpad/harness/pages/ by the `pages-fresh` gate at the head of the chain.
 * Until that step this read four snapshots frozen in
 * docs/loop/artifacts/final-pages on 2026-09-08, so a gate here could never see
 * the source being deployed. A gate prints describeRenders(renderEntries(),
 * its name) so its output says what it measured and how old that was, and a
 * listed render that is missing is skipped here and reported by the gate
 * through missingLine(), never opened blind.
 *
 * Each page comes back as { name, key, kind, path, result }: `name` is the
 * harness's stem (country-GB, cell-gb-london-restaurants), `key` the name a
 * gate's baseline was written under before this step (country-gb-new,
 * cell-london-restaurants; the same as `name` elsewhere). A gate keys its
 * ratchet by `key` and prints `name`.
 */
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { pageRenders } from "./page_renders.mjs";

export { describeRenders, nameWithKey, missingLine } from "./page_renders.mjs";

/** The entries these gates read: the six fresh spine renders, with their file state. */
export function renderEntries() {
  return pageRenders({ kinds: ["fresh"] });
}

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
 * not a fix for that on its own, but a second browser to render the same files
 * is waste whatever the machine is doing.
 *
 * Returns [{ width, result: [{ name, key, kind, path, result }] }], newest
 * measurement last. A render that is missing on disk is left out of `result`;
 * the gate reports it from renderEntries().
 */
export async function eachPageAtWidths(widths, fn) {
  const entries = renderEntries().filter((e) => e.exists);
  const b = await chromium.launch();
  const out = [];
  try {
    for (const width of widths) {
      const perPage = [];
      for (const e of entries) {
        const p = await b.newPage({ viewport: { width, height: 1000 } });
        try {
          await p.goto(pathToFileURL(resolve(e.path)).href);
          await p.evaluate(() => document.fonts.ready);
          await p.waitForTimeout(400);
          perPage.push({ name: e.name, key: e.key, kind: e.kind, path: e.path, result: await p.evaluate(fn) });
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
