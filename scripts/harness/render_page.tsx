/* THE HARNESS PAGE RENDERER. Renders one real page from the real adapter and the
   real view into one static HTML file over the site's own compiled stylesheet,
   without Next and without the network, so the page-level checks measure what
   the site would draw. Moved from scratchpad/arch/render_instance.tsx (the
   architecture loop's tool) on 2026-09-05, when the founder asked for a white-
   space filter on sections and the only page the site's emptiness gate never
   read was the country page.
   usage, from E:/atlas/website:
     npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs        scripts/harness/render_page.tsx <surface> <slug...>
     surfaces: country <iso2> | city <slug> | cell <country> <geo> <industry> | industry <slug> | hood <city>
   Writes scratchpad/harness/pages/<surface>-<slugs>.html. No environment file is
   loaded: an adapter that needs a secret to render does not belong in a gate.
   Two charts cannot draw statically (the client-only stepped waterfall and the
   map): grep the markup for a word the card would print before calling it empty. */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
/* Site-root asset paths (src="/cities/x.jpeg") resolve only under a server; a static file needs the public folder spelled out. */
const PUBLIC_URL = pathToFileURL(process.cwd() + "/public/").href;
const mapAssets = (html: string) => html.replace(/(src|href)="\/(cities|spine|flags)\//g, (_m, a, d) => `${a}="${PUBLIC_URL}${d}/`);
import { buildSpineCountrySeed } from "../../src/lib/spine/adapt_country";
import { buildSpineCitySeed } from "../../src/lib/spine/adapt_city";
import { buildSpineCellSeed } from "../../src/lib/spine/adapt_cell";
import { buildSpineIndustrySeed } from "../../src/lib/spine/adapt_industry";
import { buildSpineHoodSeed } from "../../src/lib/spine/adapt_hood";
import { SpineCountryBody } from "../../src/components/spine/country/country-view";
import { SpineCityBody } from "../../src/components/spine/city/city-view";
import { SpineCellBody } from "../../src/components/spine/cell/cell-view";
import { SpineIndustryBody } from "../../src/components/spine/industry/industry-view";
import { SpineHoodBody } from "../../src/components/spine/hood/hood-view";
import { SpineShell } from "../../src/components/spine/shell";
import { HowToBody } from "../../src/components/spine/country/how-to-view";

const CSS_PATH = "scratchpad/pages/site.css";
try {
  execFileSync(process.execPath, ["node_modules/tailwindcss/lib/cli.js", "-i", "src/app/globals.css", "-o", CSS_PATH, "--minify"], { stdio: "pipe" });
} catch {
  /* a stale stylesheet still renders; the harness regenerates it constantly */
}
const css = readFileSync(CSS_PATH, "utf8");
const skyline = existsSync("public/spine/_skyline.jpeg")
  ? `data:image/jpeg;base64,${readFileSync("public/spine/_skyline.jpeg").toString("base64")}`
  : "";

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
${skyline ? `<style>.spine-frame-layer[style*="_skyline"]{background-image:url("${skyline}") !important}</style>` : ""}
</head>
<body class="[--atlas-header-h:85px] md:[--atlas-header-h:93px] lg:[--atlas-header-h:89px]" style="font-family: var(--font-body);">
${body}
</body>
</html>`;
}

async function main() {
  const [surface, ...slugs] = process.argv.slice(2);
  if (!surface || !slugs.length) {
    console.error("usage: render_page.tsx <surface> <slug...>");
    process.exit(2);
  }
  let C: any;
  let data: any;
  let selfShelled = false;
  switch (surface) {
    case "country": C = SpineCountryBody; data = await buildSpineCountrySeed(slugs[0]); break;
    case "city": C = SpineCityBody; data = await buildSpineCitySeed(slugs[0]); break;
    case "cell": C = SpineCellBody; data = await buildSpineCellSeed(slugs[0], slugs[1], slugs[2]); break;
    case "industry": C = SpineIndustryBody; data = await buildSpineIndustrySeed(slugs[0]); break;
    case "hood": C = SpineHoodBody; data = await buildSpineHoodSeed(slugs[0]); selfShelled = true; break;
    case "howto": C = HowToBody; data = { iso2: slugs[0].toUpperCase() }; break;
    default: console.error("unknown surface", surface); process.exit(2);
  }
  if (!data) { console.log(`  ${surface} ${slugs.join("/")}: NO DATA (the adapter returned nothing; this instance does not render)`); return; }
  const inner = React.createElement(C, surface === "howto" ? data : { data });
  const body = renderToStaticMarkup(selfShelled ? inner : React.createElement(SpineShell as any, null, inner));
  mkdirSync("scratchpad/harness/pages", { recursive: true });
  const out = `scratchpad/harness/pages/${surface}-${slugs.join("-")}.html`;
  writeFileSync(out, mapAssets(page(`${surface} ${slugs.join(" ")}`, body)), "utf8");
  console.log(`  ${out}  ${Math.round(body.length / 1024)}KB`);
}
void main();
