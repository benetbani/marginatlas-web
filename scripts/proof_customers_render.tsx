/**
 * proof_customers_render , cut the "who buys, and when" chapter out of a real
 * city page, server rendered, so the empty container in it can be photographed.
 *
 *   npx tsx --tsconfig scripts/tsconfig.harness.json scripts/proof_customers_render.tsx <tag>
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync, mkdirSync } from "node:fs";
import { SpineCityBody } from "../src/components/spine/city/city-view";
import { buildSpineCitySeed } from "../src/lib/spine/adapt_city";

const tag = process.argv[2] ?? "after";

/** From the chapter heading to the start of the next chapter. */
function slice(html: string, title: string) {
  const i = html.indexOf(title);
  if (i < 0) return "";
  const openH2 = html.lastIndexOf("<div class=\"mb-3 mt-12\"", i);
  const from = openH2 >= 0 ? openH2 : i;
  const next = html.indexOf("<div class=\"mb-3 mt-12\"", i + title.length);
  return html.slice(from, next > 0 ? next : html.length);
}

async function main() {
  mkdirSync("scratchpad", { recursive: true });
  for (const slug of ["tokyo", "london"]) {
    const d: any = await buildSpineCitySeed(slug);
    const html = renderToStaticMarkup(React.createElement(SpineCityBody as any, { data: d }));
    const seg = slice(html, "Who buys, and when");
    writeFileSync(`scratchpad/cust-${slug}-${tag}.html`, seg, "utf8");
    const emptyRails = (seg.match(/md:flex-row[^"]*"><\/div>/g) ?? []).length;
    console.log(`  ${slug.padEnd(7)} ${String(seg.length).padStart(5)} bytes   empty containers drawn: ${emptyRails}`);
  }
}
void main();
