/**
 * proof_income_render , server-render "what customers earn here" from the data a
 * real London page is built from, and from the bundled sample.
 *
 *   npx tsx --tsconfig scripts/tsconfig.harness.json scripts/proof_income_render.tsx <tag>
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync, mkdirSync } from "node:fs";
import { IncomeCurve } from "../src/components/spine/city/chapters";
import { buildSpineCitySeed } from "../src/lib/spine/adapt_city";
import { spineCitySeed } from "../src/lib/spine-seeds";

const tag = process.argv[2] ?? "after";

async function main() {
  const live: any = await buildSpineCitySeed("london");
  const C = IncomeCurve as unknown as React.FC<{ d: any }>;
  mkdirSync("scratchpad", { recursive: true });
  for (const [name, d] of [["seed", spineCitySeed], ["live", live]] as Array<[string, any]>) {
    const html = renderToStaticMarkup(React.createElement(C, { d }));
    writeFileSync(`scratchpad/inc-${name}-${tag}.html`, html, "utf8");
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const hex = [...html.matchAll(/#[0-9a-fA-F]{3,6}\b/g)].map((m) => m[0]);
    console.log(`  ${name.padEnd(5)} ${String(html.length).padStart(5)} bytes  raw hex in markup: ${hex.length ? [...new Set(hex)].join(" ") : "none"}`);
    console.log(`        "${text.slice(0, 80)}"`);
  }
}
void main();
