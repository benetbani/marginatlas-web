import { renderToStaticMarkup } from "react-dom/server";
import * as React from "react";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { buildSpineCitySeed } from "../src/lib/spine/adapt_city";
import { SpineCityBody } from "../src/components/spine/city/city-view";
import { SpineShell } from "../src/components/spine/shell";
execFileSync(process.execPath, ["node_modules/tailwindcss/lib/cli.js", "-i", "src/app/globals.css", "-o", "scratchpad/pages/site.css", "--minify"], { stdio: "pipe" });
const css = readFileSync("scratchpad/pages/site.css", "utf8");
const sky = `data:image/jpeg;base64,${readFileSync("public/spine/_skyline.jpeg").toString("base64")}`;
void (async () => {
  for (const c of ["lagos", "dhaka"]) {
    const d: any = await buildSpineCitySeed(c);
    const body = renderToStaticMarkup(React.createElement(SpineShell as any, null, React.createElement(SpineCityBody as any, { data: d })));
    writeFileSync(`scratchpad/pages/${c}.html`, `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"><style>${css}</style><style>.spine-frame-layer[style*="_skyline"]{background-image:url("${sky}") !important}</style></head><body>${body}</body></html>`, "utf8");
    console.log(`  ${c} written`);
  }
})();
