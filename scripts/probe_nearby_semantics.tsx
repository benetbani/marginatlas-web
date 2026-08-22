/**
 * probe_nearby_semantics , what does the comparison table announce?
 *
 * The section presents places down the side and metrics across the top, with a
 * header row, click-to-sort, and a sorted-direction attribute. It is built out
 * of plain boxes laid out on a grid. There is no table element anywhere in it.
 *
 * Two things follow, and this measures both rather than asserting them:
 *
 *   1. The sorted-direction attribute is placed on a BUTTON. That attribute is
 *      only meaningful on a real column header. On a button it is ignored, so
 *      the announced sort state is nothing.
 *   2. Each value carries a small label naming its column, and that label is
 *      HIDDEN from 640 pixels upward. Above that width the only thing tying a
 *      number to its column is where it sits on screen, which is exactly the
 *      information a screen reader does not have.
 *
 *   npx tsx scripts/probe_nearby_semantics.tsx
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { spineCellSeed } from "../src/lib/spine-seeds";
import { Nearby } from "../src/components/spine/cell/interactive";

function main() {
  const C = Nearby as unknown as React.FC<{ d: unknown }>;
  const html = renderToStaticMarkup(React.createElement(C, { d: spineCellSeed }));

  const tableEls = (html.match(/<(table|thead|tbody|th|td)\b/g) || []).length;
  const ariaSort = (html.match(/aria-sort="[^"]*"/g) || []).length;
  /* Where does each sorted-direction attribute actually sit? */
  const onButton = (html.match(/<button[^>]*aria-sort=/g) || []).length;
  const roleTable = /role="(table|grid|columnheader|rowheader)"/.test(html);

  console.log(`\n  STRUCTURE`);
  console.log(`    table, head, body, header-cell or cell elements : ${tableEls}`);
  console.log(`    any table or column-header role declared        : ${roleTable ? "yes" : "no"}`);
  console.log(`    sorted-direction attributes                     : ${ariaSort}`);
  console.log(`    ...of those, sitting on a button                : ${onButton}   <= ignored there`);

  /* The desktop reading. Strip every element carrying the hide-above-phone
     class, which is what a browser does at 640 pixels and up, then read the
     text that remains. */
  const desktop = html.replace(/<span[^>]*sm:hidden[^>]*>.*?<\/span>/g, "");
  const text = (s: string) =>
    s.replace(/<[^>]+>/g, "").split("").map((t) => t.trim()).filter(Boolean);

  const all = text(html);
  const desk = text(desktop);
  const lost = all.length - desk.length;

  console.log(`\n  WHAT A SCREEN READER GETS ABOVE 640 PIXELS`);
  console.log(`    text nodes on a phone : ${all.length}`);
  console.log(`    text nodes on desktop : ${desk.length}   (${lost} column labels drop out)`);
  console.log(`\n    the desktop reading, in order:`);
  console.log(`      ${desk.slice(0, 22).join("  |  ")}`);
  console.log(`\n    Every figure after the place name is announced with no column name`);
  console.log(`    attached, because the only thing naming it is its position on screen.\n`);
}

main();
