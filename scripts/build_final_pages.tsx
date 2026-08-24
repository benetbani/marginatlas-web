/**
 * build_final_pages , render the four rebuilt page types whole, with the real
 * stylesheet, into standalone files the founder can open.
 *
 * WHAT THESE FILES CANNOT SHOW, and it has already misled me once. They are STATIC
 * markup with no React runtime. Anything that draws itself in the browser draws
 * nothing here: the money waterfall on the trade page is a chart library that
 * measures the DOM, so its card appears EMPTY in every one of these previews
 * whether or not it is empty on a real page.
 *
 * On 2026-08-24 I read that empty card as a defect, diagnosed it, and only caught
 * the mistake when the SAME test said a card that should draw also did not. Do not
 * judge a chart card from these files. Judge data from the data, and charts from a
 * running page.
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync, readFileSync } from "node:fs";
import { buildSpineCitySeed } from "../src/lib/spine/adapt_city";
import { buildSpineCellSeed } from "../src/lib/spine/adapt_cell";
import { buildSpineIndustrySeed } from "../src/lib/spine/adapt_industry";
import { buildSpineHoodSeed } from "../src/lib/spine/adapt_hood";
import { SpineCityBody } from "../src/components/spine/city/city-view";
import { SpineCellBody } from "../src/components/spine/cell/cell-view";
import { SpineIndustryBody } from "../src/components/spine/industry/industry-view";
import { SpineHoodBody } from "../src/components/spine/hood/hood-view";
import { SpineShell } from "../src/components/spine/shell";

const css = readFileSync("scratchpad/pages/site.css", "utf8");

/* THE WRAPPER IS THE WHOLE POINT, and the first version of this file did not have
   it. A spine route renders <SpineShell><Body/></SpineShell>, and the shell
   carries the frame, the background and the type scope. Rendering the body alone
   produced a page with no padding, no card surfaces, and BOTH the desktop table
   and the phone card stack visible at once, because there was no viewport meta
   either. It looked like a terminal readout. That was the harness, not the page. */
function page(title: string, body: string) {
  return `<!doctype html>
<html lang="en" style="--font-sans: Geist, ui-sans-serif, system-ui, sans-serif; --font-serif: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap">
<style>${css}</style>
</head>
<body class="[--atlas-header-h:85px] md:[--atlas-header-h:93px] lg:[--atlas-header-h:89px]" style="font-family: var(--font-body);">
${body}
</body>
</html>`;
}

async function main() {
  const jobs: Array<[string, string, unknown, any]> = [
    ["city-london", "London, the city page", SpineCityBody, await buildSpineCitySeed("london")],
    ["cell-london-restaurants", "Restaurants in London, the trade page", SpineCellBody, await buildSpineCellSeed("gb", "london", "restaurants")],
    ["industry-restaurants", "Restaurants, across places", SpineIndustryBody, await buildSpineIndustrySeed("restaurants")],
    ["hood-london", "London neighbourhoods", SpineHoodBody, await buildSpineHoodSeed("london")],
  ];
  for (const [slug, title, C, data] of jobs) {
    if (!data) { console.log(`  ${slug}: no data`); continue; }
    const body = renderToStaticMarkup(
      React.createElement(SpineShell as any, null, React.createElement(C as any, { data })),
    );
    writeFileSync(`docs/loop/artifacts/final-pages/${slug}.html`, page(title, body), "utf8");
    console.log(`  ${slug.padEnd(26)} ${Math.round(body.length / 1024)}KB`);
  }
}
void main();
