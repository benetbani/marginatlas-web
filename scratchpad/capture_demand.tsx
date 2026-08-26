import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync } from "node:fs";
import { spineIndustrySeed } from "../src/lib/spine-seeds";
import { Demand } from "../src/components/spine/industry/industry-view";
const C = Demand as unknown as React.FC<{ d: unknown }>;
const d: any = JSON.parse(JSON.stringify(spineIndustrySeed));
if (process.argv[3] === "live") {
  /* what the live adapter really builds: the spend figure and nothing else. */
  d.demand = { spend_per_head_usd: d.demand?.spend_per_head_usd ?? 38 };
}
writeFileSync(process.argv[2], renderToStaticMarkup(React.createElement(C, { d })), "utf8");
console.log("  captured", process.argv[2], process.argv[3] || "workshop");
