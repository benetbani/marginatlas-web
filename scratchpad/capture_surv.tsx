import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync } from "node:fs";
import { spineIndustrySeed } from "../src/lib/spine-seeds";
import { Survival } from "../src/components/spine/industry/industry-view";
const C = Survival as unknown as React.FC<{ d: unknown }>;
writeFileSync(process.argv[2], renderToStaticMarkup(React.createElement(C, { d: spineIndustrySeed })), "utf8");
console.log("  captured", process.argv[2]);
