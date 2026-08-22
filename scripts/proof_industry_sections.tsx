/**
 * proof_industry_sections , which sections of the trade-across-places page does a
 * visitor actually get?
 *
 * The same instrument that found five dead sections on the cell page, pointed at
 * the industry page: render the body twice from one component, once with the
 * workshop data and once with the shape the live adapter really returns, then
 * compare by section heading.
 *
 * RUN IT WITH THE HARNESS CONFIG. Page components rely on Next's automatic JSX
 * runtime and do not import React themselves, so outside Next they need it
 * switched on explicitly:
 *
 *   npx tsx --tsconfig scripts/tsconfig.harness.json scripts/proof_industry_sections.tsx
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { spineIndustrySeed } from "../src/lib/spine-seeds";
import { SpineIndustryBody } from "../src/components/spine/industry/industry-view";

const OUT = "docs/loop/artifacts/industry-sections/which-sections-a-visitor-gets.html";

const SECTIONS = [
  "Kept per $100, by trade",
  "Where each $100 goes",
  "Keep and cost, trades next door",
  "What a customer spends",
  "Five-year survival",
  "Payback window",
  "When a day starts paying",
  "Getting to break-even",
  "Across the year",
  "The typical operator",
  "Who it suits",
  "What people get wrong",
  "The close",
];

function main() {
  const Body = SpineIndustryBody as unknown as React.FC<{ data: unknown }>;
  const seedHtml = renderToStaticMarkup(React.createElement(Body, { data: spineIndustrySeed }));

  /* Every top-level key the seed carries, dropped one at a time, tells us which
     section each one gates. Then the live shape is whatever the adapter builds. */
  const keys = Object.keys(spineIndustrySeed as any);
  const gatedBy: Record<string, string[]> = {};
  for (const k of keys) {
    const d: any = JSON.parse(JSON.stringify(spineIndustrySeed));
    delete d[k];
    let html = "";
    try { html = renderToStaticMarkup(React.createElement(Body, { data: d })); } catch { continue; }
    const lost = SECTIONS.filter((s) => seedHtml.includes(s) && !html.includes(s));
    if (lost.length) gatedBy[k] = lost;
  }

  console.log(`\n  WHICH KEY HOLDS UP WHICH SECTION\n`);
  for (const [k, v] of Object.entries(gatedBy)) {
    console.log(`    ${k.padEnd(16)} ${v.join(", ")}`);
  }
  const ungated = SECTIONS.filter((s) => seedHtml.includes(s) && !Object.values(gatedBy).flat().includes(s));
  console.log(`\n    always drawn:    ${ungated.join(", ") || "(none)"}`);
  const absent = SECTIONS.filter((s) => !seedHtml.includes(s));
  if (absent.length) console.log(`\n    not in the workshop render at all: ${absent.join(", ")}`);

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, `<!doctype html><meta charset=utf-8><title>industry sections</title><pre>${JSON.stringify(gatedBy, null, 2)}</pre>`, "utf8");
}

main();
