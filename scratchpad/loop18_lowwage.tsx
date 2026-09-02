/* throwaway (C29): render the country page for a LOW-WAGE country into the
   scratchpad, so the money grammar can be photographed on a page whose figures
   the change actually moves.
   THIS IS THE ROW'S THIRD TRAP AND THE REASON IT EXISTS: every committed render
   is the United Kingdom, whose minimum wage is $25K and whose median full-time
   pay is $38K, both above the $10,000 boundary, so NO committed photograph
   contains a single figure this change touches. Burkina Faso's minimum wage is
   $1,512 and its median $3,360; the Central African Republic's median is $1,440.
   Those are the two worst cases measured on country_profile_v2.json.
   It writes to scratchpad rather than to docs/loop/artifacts/final-pages,
   deliberately: the eight gated pages are a fixed set and a ninth would be read
   by every visual gate and every baseline.
   node ... scratchpad/loop18_lowwage.tsx [iso2 ...]   (default bf cf) */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { buildSpineCountrySeed } from "../src/lib/spine/adapt_country";
import { SpineCountryBody } from "../src/components/spine/country/country-view";
import { SpineShell } from "../src/components/spine/shell";

const CSS_PATH = "scratchpad/pages/site.css";
execFileSync(
  process.execPath,
  ["node_modules/tailwindcss/lib/cli.js", "-i", "src/app/globals.css", "-o", CSS_PATH, "--minify"],
  { stdio: "pipe" },
);
const css = readFileSync(CSS_PATH, "utf8");
const skyline = `data:image/jpeg;base64,${readFileSync("public/spine/_skyline.jpeg").toString("base64")}`;

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
<style>.spine-frame-layer[style*="_skyline"]{background-image:url("${skyline}") !important}</style>
</head>
<body class="[--atlas-header-h:85px] md:[--atlas-header-h:93px] lg:[--atlas-header-h:89px]" style="font-family: var(--font-body);">
${body}
</body>
</html>`;
}

async function main() {
  const isos = process.argv.slice(2).filter((a) => /^[a-z]{2}$/i.test(a));
  for (const iso of isos.length ? isos : ["bf", "cf"]) {
    const data = await buildSpineCountrySeed(iso.toLowerCase());
    if (!data) {
      console.log(`  ${iso}: no data`);
      continue;
    }
    const body = renderToStaticMarkup(
      React.createElement(SpineShell as any, null, React.createElement(SpineCountryBody as any, { data })),
    );
    const out = `scratchpad/pages/country-${iso.toLowerCase()}.html`;
    writeFileSync(out, page(`${iso.toUpperCase()}, the country page`, body), "utf8");
    console.log(`  ${out.padEnd(40)} ${Math.round(body.length / 1024)}KB`);
  }
}
main();
