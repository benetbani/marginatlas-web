/**
 * proof_space_render , server-render the "what space costs" band twice: with the
 * bundled sample, and with the data a real London page is built from.
 *
 *   npx tsx --tsconfig scripts/tsconfig.harness.json scripts/proof_space_render.tsx <tag>
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync, mkdirSync } from "node:fs";
import { CommercialSpace } from "../src/components/spine/city/city-view";
import { buildSpineCitySeed } from "../src/lib/spine/adapt_city";
import { spineCitySeed } from "../src/lib/spine-seeds";

const tag = process.argv[2] ?? "after";

async function main() {
  const live: any = await buildSpineCitySeed("london");
  const C = CommercialSpace as unknown as React.FC<{ d: any }>;
  mkdirSync("scratchpad", { recursive: true });
  for (const [name, d] of [["seed", spineCitySeed], ["live", live]] as Array<[string, any]>) {
    const html = renderToStaticMarkup(React.createElement(C, { d }));
    writeFileSync(`scratchpad/space-${name}-${tag}.html`, html, "utf8");
    console.log(`  scratchpad/space-${name}-${tag}.html  ${html.length} bytes`);
  }
}
void main();
