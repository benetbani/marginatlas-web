import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync } from "node:fs";
import { spineCitySeed } from "../src/lib/spine-seeds";
import { WhereToTrade } from "../src/components/spine/city/where-to-trade";
const C = WhereToTrade as unknown as React.FC<{ d: unknown }>;
const d: any = JSON.parse(JSON.stringify(spineCitySeed));
/* the map needs a browser, so drop the coordinates: the section then renders the
   ranked list alone, which is the half this change touches. */
if (d.where_to_trade?.list) for (const r of d.where_to_trade.list) { delete r.lat; delete r.lng; }
writeFileSync(process.argv[2], renderToStaticMarkup(React.createElement(C, { d })), "utf8");
console.log("  captured", process.argv[2]);
