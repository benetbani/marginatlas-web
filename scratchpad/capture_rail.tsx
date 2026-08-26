import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync } from "node:fs";
import { spineCellSeed } from "../src/lib/spine-seeds";
import { SpineCellBody } from "../src/components/spine/cell/cell-view";
const C = SpineCellBody as unknown as React.FC<{ data: unknown }>;
writeFileSync(process.argv[2], renderToStaticMarkup(React.createElement(C, { data: spineCellSeed })), "utf8");
console.log("  captured", process.argv[2]);
