import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync } from "node:fs";
import { spineCellSeed } from "../src/lib/spine-seeds";
import { Masthead } from "../src/components/spine/cell/masthead";
const C = Masthead as unknown as React.FC<{ d: unknown }>;
writeFileSync(process.argv[2], renderToStaticMarkup(React.createElement(C, { d: spineCellSeed })), "utf8");
console.log("  captured", process.argv[2]);
