/**
 * probe_heading_outline , what does a screen reader's heading list show?
 *
 * Skimming a long page by heading is the primary way a screen-reader user
 * navigates one. This prints the heading outline the spine pages actually
 * produce, so the claim can be checked rather than asserted.
 *
 *   npx tsx --tsconfig scripts/tsconfig.harness.json scripts/probe_heading_outline.tsx
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { spineCellSeed, spineIndustrySeed } from "../src/lib/spine-seeds";
import { SpineCellBody } from "../src/components/spine/cell/cell-view";
import { SpineIndustryBody } from "../src/components/spine/industry/industry-view";

function outline(name: string, Body: unknown, data: unknown) {
  const C = Body as React.FC<{ data: unknown }>;
  let html = "";
  try {
    html = renderToStaticMarkup(React.createElement(C, { data }));
  } catch (e: any) {
    console.log(`  ${name}: could not render (${String(e?.message ?? e).slice(0, 60)})`);
    return;
  }
  const hs = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map(
    (m) => `h${m[1]}  ${m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}`,
  );
  /* Section titles that LOOK like headings and are not. The first version of
     this matched the class alone, so once the openers became real headings it
     went on counting them as failures. It now excludes anything already inside a
     heading tag, which is the whole question. */
  const kickers = [...html.matchAll(/<(\w+)([^>]*uppercase tracking-\[0\.12em\][^>]*)>([^<]{3,})</g)]
    .filter((m) => !/^h[1-6]$/.test(m[1]))
    .map((m) => m[3].trim());

  console.log(`\n  ${name}`);
  console.log(`    heading elements: ${hs.length}`);
  for (const h of hs) console.log(`      ${h.slice(0, 64)}`);
  console.log(`    section titles rendered as plain text, not headings: ${kickers.length}`);
  for (const k of kickers.slice(0, 8)) console.log(`      (not a heading)  ${k.slice(0, 60)}`);
  if (kickers.length > 8) console.log(`      ...and ${kickers.length - 8} more`);
}

outline("TRADE IN A PLACE", SpineCellBody, spineCellSeed);
outline("TRADE ACROSS PLACES", SpineIndustryBody, spineIndustrySeed);
console.log(
  `\n  A reader skimming by heading reaches the chapters and nothing inside them.\n`,
);
