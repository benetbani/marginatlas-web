import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync } from "node:fs";
import { spineIndustrySeed } from "../src/lib/spine-seeds";
import { Close } from "../src/components/spine/industry/industry-view";
const C = Close as unknown as React.FC<{ d: unknown }>;
const d: any = JSON.parse(JSON.stringify(spineIndustrySeed));
if (process.argv[3] === "norecap") { delete d.margin_index; }
writeFileSync(process.argv[2], renderToStaticMarkup(React.createElement(C, { d })), "utf8");
console.log("  captured", process.argv[2], process.argv[3] || "full");
