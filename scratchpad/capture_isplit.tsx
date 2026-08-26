import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync } from "node:fs";
import { spineIndustrySeed } from "../src/lib/spine-seeds";
import { MoneySplit } from "../src/components/spine/industry/industry-view";
const C = MoneySplit as unknown as React.FC<{ d: unknown }>;
const d: any = JSON.parse(JSON.stringify(spineIndustrySeed));
if (process.argv[3] === "broken") {
  /* the ladder that makes the floor fire: parts totalling 107 */
  d.money_split.items = [
    { name: "Direct cost of sales", pct: 40, kept: false, group: "variable" },
    { name: "Running the business", pct: 52, kept: false, group: "variable" },
    { name: "Fixed costs and tax", pct: 0, kept: false, group: "fixed" },
    { name: "Owner keeps", pct: 15, kept: true, group: "kept" },
  ];
}
writeFileSync(process.argv[2], renderToStaticMarkup(React.createElement(C, { d })), "utf8");
console.log("  captured", process.argv[2], process.argv[3] || "");
