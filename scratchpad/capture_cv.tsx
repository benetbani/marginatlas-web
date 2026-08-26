import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync } from "node:fs";
import { spineCitySeed } from "../src/lib/spine-seeds";
import { CityVerdict } from "../src/components/spine/city/city-view";
const C = CityVerdict as unknown as React.FC<{ d: unknown }>;
writeFileSync(process.argv[2], renderToStaticMarkup(React.createElement(C, { d: spineCitySeed })), "utf8");
console.log("  captured", process.argv[2]);
