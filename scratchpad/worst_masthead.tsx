import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync } from "node:fs";
import { spineCellSeed } from "../src/lib/spine-seeds";
import { Masthead } from "../src/components/spine/cell/masthead";
/* The widest the three tiles can ever get: the longest of the three fixed words
   for breaking in, and a seven-figure count of firms. */
const d: any = JSON.parse(JSON.stringify(spineCellSeed));
d.headline.break_in_0_100 = 60;   // -> "Manageable", the longest of the three
d.headline.n_firms = 1284000;     // -> "1,284,000"
const C = Masthead as unknown as React.FC<{ d: unknown }>;
writeFileSync(process.argv[2], renderToStaticMarkup(React.createElement(C, { d })), "utf8");
console.log("  worst case captured");
