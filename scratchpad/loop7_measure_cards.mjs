/* THROWAWAY. Step zero of loop run 7, the MEASUREMENT half.
 *
 * OptionCards' catalogue entry stakes the whole form on one claim: "every
 * card's figure sits on ONE shared baseline and every card's hairline at ONE
 * shared height, whatever the name's length." The first version of the form was
 * rejected precisely because a long name shoved one card's figure out of line,
 * so the claim is read off the rendered DOM rather than judged by eye.
 *
 * For every OptionCards set in the harness it prints, per set:
 *   - each card's figure top and the max-min delta in pixels
 *   - each card's hairline top and the max-min delta in pixels
 *   - each card's own box top and height (so an uneven set is visible too)
 *
 * Run: node scratchpad/loop7_measure_cards.mjs
 */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";

const url = pathToFileURL("E:/atlas/website/scratchpad/loop7/optioncards.html").href;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1400, height: 1200 }, deviceScaleFactor: 1 });
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(400);

const out = await p.evaluate(() => {
  const round = (n) => Math.round(n * 100) / 100;
  const sets = [...document.querySelectorAll('[data-idea="I6"]')];
  return sets.map((set) => {
    const probe = set.closest("[data-probe]");
    const cards = [...set.querySelectorAll('[role="listitem"]')];
    const figs = cards.map((c) => {
      const f = c.querySelector(".fig");
      return f ? round(f.getBoundingClientRect().top + scrollY) : null;
    });
    const rules = cards.map((c) => {
      /* The hairline is the borderTop on the meaning paragraph. */
      const r = [...c.querySelectorAll("p")].find((e) => getComputedStyle(e).borderTopWidth !== "0px");
      return r ? round(r.getBoundingClientRect().top + scrollY) : null;
    });
    const boxes = cards.map((c) => {
      const r = c.getBoundingClientRect();
      return { top: round(r.top + scrollY), h: round(r.height), w: round(r.width) };
    });
    const spread = (xs) => {
      const v = xs.filter((x) => x != null);
      return v.length ? round(Math.max(...v) - Math.min(...v)) : null;
    };
    /* How many visual ROWS the set wrapped into: distinct card tops. A wrap and
       a broken baseline are two different faults and must be measured apart, so
       the deltas are taken WITHIN each row as well as across the whole set. */
    const rowKeys = [...new Set(boxes.map((x) => Math.round(x.top)))].sort((a, b) => a - b);
    const perRow = rowKeys.map((k) => {
      const idx = boxes.map((x, i) => (Math.round(x.top) === k ? i : -1)).filter((i) => i >= 0);
      return {
        n: idx.length,
        figDelta: spread(idx.map((i) => figs[i])),
        ruleDelta: spread(idx.map((i) => rules[i])),
        heightDelta: spread(idx.map((i) => boxes[i].h)),
      };
    });
    /* The width of the row the wrap orphans onto, against the set's own width,
       which is step 7's empty-rectangle test applied to the form itself. */
    const setW = round(set.getBoundingClientRect().width);
    return {
      probe: probe ? probe.getAttribute("data-probe") : "?",
      cards: cards.length,
      rows: rowKeys.length,
      setW,
      perRow,
      figTops: figs,
      figDelta: spread(figs),
      ruleTops: rules,
      ruleDelta: spread(rules),
      cardHeights: boxes.map((x) => x.h),
      cardWidths: boxes.map((x) => x.w),
      heightDelta: spread(boxes.map((x) => x.h)),
    };
  });
});

for (const s of out) {
  /* THE CRAFT CLAIM is about cards a reader compares side by side, so it is
     judged WITHIN a row. A wrap is a separate fault and is named separately. */
  const rowBad = s.perRow.some((r) => (r.figDelta ?? 0) > 0.5 || (r.ruleDelta ?? 0) > 0.5);
  const wrapped = s.rows > 1;
  const verdict = rowBad ? "BASELINE-FAIL" : wrapped ? "WRAPPED......" : "ok..........." ;
  console.log(
    `${verdict} ${String(s.probe).padEnd(14)} cards=${s.cards} rows=${s.rows} setW=${s.setW} ` +
      `| WITHIN-ROW fig=[${s.perRow.map((r) => r.figDelta).join("|")}] rule=[${s.perRow.map((r) => r.ruleDelta).join("|")}] ` +
      `h=[${s.perRow.map((r) => r.heightDelta).join("|")}] ` +
      `| ACROSS-SET fig=${s.figDelta}px rule=${s.ruleDelta}px ` +
      `| cardW=[${s.cardWidths.join(",")}]`,
  );
}
console.log(`\n${out.length} sets measured. A set that renders nothing does not appear here.`);
await b.close();
