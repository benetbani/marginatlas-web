/**
 * proof_cell_sections , the sheet that answers "which sections does a visitor
 * actually get on a trade page?"
 *
 * The page body is rendered twice from the SAME component: once with the
 * bundled workshop data, once with the shape the live adapter really returns.
 * The adapter leaves four keys undefined, on purpose, each with a written
 * reason, and each of those gates a whole section.
 *
 *   npx tsx scripts/proof_cell_sections.tsx
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { spineCellSeed } from "../src/lib/spine-seeds";
import { SpineCellBody } from "../src/components/spine/cell/cell-view";

const OUT = "docs/loop/artifacts/cell-sections/which-sections-a-visitor-gets.html";

const OMITTED: Array<[string, string]> = [
  ["demand", "the whole demand chapter, with the reason given as omitted"],
  ["subtypes", "the size and format picker, omitted"],
  ["who_suits", "the numeric scales, omitted"],
  ["related", "no honest source for the per-sibling kept figure"],
];

const SECTIONS: Array<[string, string]> = [
  ["Where each $100 of sales goes", ""],
  ["What the owner keeps", ""],
  ["When it clears costs", ""],
  ["What it costs to open one", ""],
  ["Who this suits", "who_suits"],
  ["When the week fills up", "demand"],
  ["Who comes in, and how", "demand"],
  ["Busy months and quiet months", ""],
  ["Getting to break-even", ""],
  ["The same trade, comparable places", ""],
  ["What the team costs", ""],
  ["What to watch", ""],
  ["Myth vs. reality", ""],
  ["Related trades in this place", "related"],
];

function main() {
  /* The body's props are optional with a default, which makes the element
     factory's overload resolution pick the no-props signature. The component is
     typed `data?: any`, so this cast asserts nothing that is not already true. */
  const Body = SpineCellBody as unknown as React.FC<{ data: unknown }>;
  const seedHtml = renderToStaticMarkup(React.createElement(Body, { data: spineCellSeed }));
  const live: any = JSON.parse(JSON.stringify(spineCellSeed));
  for (const [k] of OMITTED) delete live[k];
  const liveHtml = renderToStaticMarkup(React.createElement(Body, { data: live }));

  const rows = SECTIONS.map(([name, gate]) => {
    const inSeed = seedHtml.includes(name);
    const inLive = liveHtml.includes(name);
    const dead = inSeed && !inLive;
    return `<tr class="${dead ? "dead" : ""}">
      <td>${name}</td>
      <td class="c">${inSeed ? "yes" : "no"}</td>
      <td class="c ${dead ? "no" : ""}">${inLive ? "yes" : "no"}</td>
      <td class="why">${dead ? `waiting on ${gate}` : ""}</td>
    </tr>`;
  }).join("\n");

  const deadCount = SECTIONS.filter(([n]) => seedHtml.includes(n) && !liveHtml.includes(n)).length;
  const shrink = Math.round((1 - liveHtml.length / seedHtml.length) * 100);

  const html = `<!doctype html>
<meta charset="utf-8">
<title>Which sections a visitor gets</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box}
  body{margin:0;padding:36px 24px 60px;background:#fafaf9;color:#1b1b1a;
       font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.55}
  h1{font-size:24px;font-weight:500;letter-spacing:-.01em;margin:0 0 12px}
  p{max-width:68ch;color:#57575b;margin:0 0 10px}
  .big{font-size:15px;color:#1b1b1a}
  .wrap{overflow-x:auto;margin-top:26px;max-width:820px}
  table{border-collapse:collapse;width:100%;min-width:520px;background:#fff;
        border:1px solid #e7e2df;border-radius:10px;overflow:hidden}
  th,td{text-align:left;padding:9px 14px;border-bottom:1px solid #f0ece9;font-size:13px}
  th{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#8c8c8a;font-weight:500;background:#fbfaf9}
  tr:last-child td{border-bottom:0}
  td.c{text-align:center;width:96px;color:#6f6f6d}
  td.c.no{color:#c2410c;font-weight:500}
  td.why{color:#8c8c8a;font-size:12px}
  tr.dead td:first-child{color:#c2410c}
  footer{margin-top:30px;font-size:12px;color:#8c8c8a;max-width:68ch}
  /* AT PHONE WIDTH THE COLUMN THAT MATTERS WAS SCROLLING OFF. The table sat in a
     horizontal scroller with a 520px floor, so a reader on a phone saw "Section"
     and "Workshop", which is the column that always says yes, and had to swipe to
     reach the only interesting answer. The workshop column is dropped instead:
     it carries one value for every row, so nothing is lost by hiding it. Caught
     by photographing this sheet at 320 wide, not by reading it. */
  @media (max-width:560px){
    table{min-width:0}
    th,td{padding:8px 10px;font-size:12px}
    td.c{width:58px}
    th:nth-child(2), td:nth-child(2){display:none}
    th:nth-child(4), td:nth-child(4){display:none}
  }
</style>
<h1>Which sections a visitor actually gets</h1>
<p class="big">The trade page is rendered twice here, from the same component. Once with the
workshop data, where everything is switched on. Once with the shape the live page
really receives.</p>
<p><b>${deadCount} sections exist in the design, exist in the code, and reach no reader.</b>
They are not broken. Nothing feeds them. The page that ships is ${shrink}% smaller
than the one the design describes.</p>
<div class="wrap">
<table>
  <tr><th>Section</th><th>Workshop</th><th>A visitor gets it</th><th>Why not</th></tr>
  ${rows}
</table>
</div>
<p style="margin-top:22px"><b>The size and format switch is missing too.</b> It is not a
section with a heading, so it is not in the table, but it is gated on the same
missing data. That matters more than it looks: the money waterfall follows that
switch and the hundred-dollar bar does not, so the day it arrives, two sections
on this page will disagree about the same split.</p>
<p><b>Nothing here should be invented to fill the gaps.</b> One of these sections
wants a low, middle or high reading on four demands of the owner. The nearest
data on hand is a list of sentences about who the trade suits. Turning sentences
into numbers on a scale would be making figures up, which is the one thing this
site is built not to do.</p>
<footer>Rendered on the server from the live page body, with the four keys the
adapter documents as omitted. No browser involved.</footer>
`;

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, html, "utf8");
  console.log(`  ${deadCount} dead sections | live page is ${shrink}% smaller than the workshop one`);
  console.log(`  wrote ${OUT}`);
}

main();
