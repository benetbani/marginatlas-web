import { renderToStaticMarkup } from "react-dom/server";
import * as React from "react";
import { buildSpineCellSeed } from "../src/lib/spine/adapt_cell";
import { buildSpineIndustrySeed } from "../src/lib/spine/adapt_industry";
import { buildSpineHoodSeed } from "../src/lib/spine/adapt_hood";
import { SpineCellBody } from "../src/components/spine/cell/cell-view";
import { SpineIndustryBody } from "../src/components/spine/industry/industry-view";
import { SpineHoodBody } from "../src/components/spine/hood/hood-view";

const CELLS: Array<[string, string, string]> = [
  ["gb","london","restaurants"], ["ng","lagos","restaurants"], ["bd","dhaka","restaurants"],
  ["in","mumbai","cafes-coffee-shops"], ["br","sao-paulo","grocery-stores"], ["al","tirana","restaurants"],
];
const INDUSTRIES = ["restaurants","cafes-coffee-shops","grocery-stores","hairdressers-beauty","auto-repair-shops"];
const HOODS = ["london","lagos","mumbai","sao-paulo"];

const chars = (h: string) => h.replace(/<script[\s\S]*?<\/script>/g,"").replace(/<style[\s\S]*?<\/style>/g,"").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim().length;

void (async () => {
  console.log("  TRADE PAGES");
  for (const [c,g,t] of CELLS) {
    const d: any = await buildSpineCellSeed(c,g,t).catch(() => null);
    if (!d) { console.log(`     ${(g+"/"+t).padEnd(30)} no page`); continue; }
    const h = renderToStaticMarkup(React.createElement(SpineCellBody as any, { data: d }));
    console.log(`     ${(g+"/"+t).padEnd(30)} ${String(chars(h)).padStart(5)} chars`);
  }
  console.log("\n  ACROSS-PLACES PAGES");
  for (const i of INDUSTRIES) {
    const d: any = await buildSpineIndustrySeed(i).catch(() => null);
    if (!d) { console.log(`     ${i.padEnd(30)} no page`); continue; }
    const h = renderToStaticMarkup(React.createElement(SpineIndustryBody as any, { data: d }));
    console.log(`     ${i.padEnd(30)} ${String(chars(h)).padStart(5)} chars`);
  }
  console.log("\n  NEIGHBOURHOOD PAGES");
  for (const c of HOODS) {
    const d: any = await buildSpineHoodSeed(c).catch(() => null);
    const n = d?.districts?.length ?? 0;
    console.log(`     ${c.padEnd(30)} ${n} district(s)${n ? "" : "  no page"}`);
  }
})();
