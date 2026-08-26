import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync } from "node:fs";
import { spineIndustrySeed } from "../src/lib/spine-seeds";
import { Operator } from "../src/components/spine/industry/industry-view";
const C = Operator as unknown as React.FC<{ d: unknown }>;
const d: any = JSON.parse(JSON.stringify(spineIndustrySeed));
if (process.argv[3] === "live") {
  /* the live adapter drops the sale multiple: no honest source at this altitude */
  delete d.operator.sale_multiple_low;
  delete d.operator.sale_multiple_high;
}
writeFileSync(process.argv[2], renderToStaticMarkup(React.createElement(C, { d })), "utf8");
console.log("  captured", process.argv[2], process.argv[3] || "workshop");
