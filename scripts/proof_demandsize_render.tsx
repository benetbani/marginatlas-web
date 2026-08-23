/**
 * proof_demandsize_render , server-render the "your customers" band twice: with
 * the bundled sample, and with the data a real city page is built from.
 *
 *   npx tsx --tsconfig scripts/tsconfig.harness.json scripts/proof_demandsize_render.tsx <tag>
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync, mkdirSync } from "node:fs";
import { DemandSize } from "../src/components/spine/city/city-view";
import { buildSpineCitySeed } from "../src/lib/spine/adapt_city";
import { spineCitySeed } from "../src/lib/spine-seeds";

const tag = process.argv[2] ?? "after";

async function main() {
  const live: any = await buildSpineCitySeed("london");
  const C = DemandSize as unknown as React.FC<{ d: any }>;
  mkdirSync("scratchpad", { recursive: true });
  for (const [name, d] of [["seed", spineCitySeed], ["live", live]] as Array<[string, any]>) {
    const html = renderToStaticMarkup(React.createElement(C, { d }));
    writeFileSync(`scratchpad/dem-${name}-${tag}.html`, html, "utf8");
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    console.log(`  ${name.padEnd(5)} ${String(html.length).padStart(5)} bytes   text: "${text.slice(0, 90)}"`);
  }
}
void main();
