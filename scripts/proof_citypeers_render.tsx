/**
 * proof_citypeers_render , render the whole city page and cut out the closing
 * chapter, before and after.
 *
 *   npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/proof_citypeers_render.tsx <tag>
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync, mkdirSync } from "node:fs";
import { SpineCityBody } from "../src/components/spine/city/city-view";
import { buildSpineCitySeed } from "../src/lib/spine/adapt_city";

const tag = process.argv[2] ?? "after";
const CITIES = ["london", "new-york"];

/** From the closing chapter's divider to the end of the page. */
function closing(html: string) {
  const i = html.indexOf("The next move");
  if (i < 0) return "";
  const open = html.lastIndexOf('<div class="mb-3 mt-12"', i);
  return html.slice(open >= 0 ? open : i);
}

async function main() {
  mkdirSync("scratchpad", { recursive: true });
  for (const slug of CITIES) {
    const d: any = await buildSpineCitySeed(slug);
    const html = renderToStaticMarkup(React.createElement(SpineCityBody as any, { data: d }));
    const seg = closing(html);
    writeFileSync(`scratchpad/cp-${slug}-${tag}.html`, seg, "utf8");
    const t = seg.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    console.log(`  ${slug.padEnd(9)} ${String(seg.length).padStart(5)} bytes   "${t.slice(0, 96)}"`);
  }
}
void main();
