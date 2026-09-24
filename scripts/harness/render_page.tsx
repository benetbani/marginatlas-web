/* THE HARNESS PAGE RENDERER. Renders one real page from the real adapter and the
   real view into one static HTML file over the site's own compiled stylesheet,
   without Next and without the network, so the page-level checks measure what
   the site would draw. Moved from scratchpad/arch/render_instance.tsx (the
   architecture loop's tool) on 2026-09-05, when the founder asked for a white-
   space filter on sections and the only page the site's emptiness gate never
   read was the country page.
   usage, from E:/atlas/website:
     npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs        scripts/harness/render_page.tsx <surface> <slug...>
     ... render_page.tsx --list [scripts/harness/pages.json]   (every page in the list, one process; a page that does not render is a red)
     surfaces: country <iso2> | city <slug> | cell <country> <geo> <industry> | industry <slug> | hood <city> [<district>]
   The hood surface takes a second slug for a DISTRICT PAGE (plan step 35, 2026-09-19):
   the same body in focus (SpineHoodBody's `focus`), the same adapter, so the stem is
   hood-<city>-<district> and every page gate keys it under the hood floor.
   Writes scratchpad/harness/pages/<surface>-<slugs>.html. No environment file is
   loaded: an adapter that needs a secret to render does not belong in a gate.
   Two charts cannot draw statically (the client-only stepped waterfall and the
   map): grep the markup for a word the card would print before calling it empty. */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
/* Site-root asset paths (src="/cities/x.jpeg") resolve only under a server; a static file needs the public folder spelled out.
   A FILE, NEVER A PAGE (plan step 39, 2026-09-19): `src` is always an asset, but `href="/cities/london"` is a door to a page, and
   until this line the mapping rewrote every such door into a file URL under public/, so a render lied about where its city
   doors went and the `doors` gate could not read them. An href is mapped only when it names a file (an extension). */
const PUBLIC_URL = pathToFileURL(process.cwd() + "/public/").href;
const mapAssets = (html: string) =>
  html
    .replace(/src="\/(cities|spine|flags)\//g, (_m, d) => `src="${PUBLIC_URL}${d}/`)
    .replace(/href="\/(cities|spine|flags)\/([^"]*\.[a-z0-9]{2,5})"/g, (_m, d, file) => `href="${PUBLIC_URL}${d}/${file}"`);
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
import { preflight } from "./preflight.mjs";

/* THE GROUND FIRST (sys:harness-preflight, run 24): the site root, free memory printed; a wrong ground stops here with the remedy. */
preflight({ name: "render_page" });

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

async function renderOne(surface: string, slugs: string[]): Promise<string | null> {
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
  if (!data) { console.log(`  ${surface} ${slugs.join("/")}: NO DATA (the adapter returned nothing; this instance does not render)`); return null; }
  /* The how-to page carries its main landmark in the page file, so the harness
     render wraps the body the same way; without it the filter would find no
     section card under main and pass on nothing. */
  /* The hood surface's second slug is the district in focus; the body draws
     the hub with `focus` unset. A district the scheme does not hold renders
     the hub's own cards with the take, the table and the notes self-omitted
     (the builders return null), which the page gates then red, as they should. */
  const inner = surface === "howto"
    ? React.createElement("main", { className: "mx-auto max-w-[1120px] px-4 py-2 md:px-6" }, React.createElement(C, data))
    : surface === "hood" && slugs[1]
      ? React.createElement(C, { data, focus: slugs[1] })
      : React.createElement(C, { data });
  /* SITECHROME'S MAIN AROUND THE SHELL, as production serves it (the goal's
     A13, 2026-09-24): every route that draws a spine body wraps it in
     SiteChrome (`<main className="relative max-w-content mx-auto px-6 pt-4">`),
     and the bodies no longer carry a main or a gutter of their own, so the
     render measures the widths a visitor gets (1072 of content at 1280, 720 at
     768, 327 at 375; the renders read 343 at 375 before, production 295). The
     how-to route draws no SiteChrome and keeps the main its page file writes. */
  const shelled = selfShelled ? inner : React.createElement(SpineShell as any, null, inner);
  const body = renderToStaticMarkup(surface === "howto" ? shelled : React.createElement("main", { className: "relative max-w-content mx-auto px-6 pt-4" }, shelled));
  mkdirSync("scratchpad/harness/pages", { recursive: true });
  const out = `scratchpad/harness/pages/${surface}-${slugs.join("-")}.html`;
  writeFileSync(out, mapAssets(page(`${surface} ${slugs.join(" ")}`, body)), "utf8");
  console.log(`  ${out}  ${Math.round(body.length / 1024)}KB`);
  return out;
}

/* THE LIST (sys:page-filter-list, the build loop's run 12, 2026-09-06): every
   page whose sections have landed on an archetype is in scripts/harness/pages.json,
   and `--list` renders each in this one process, so the npm script stops
   growing a hand-typed chain of renders (three by run 11). A listed page that
   does not render is a red, because the list says it should. */
const LIST = "scripts/harness/pages.json";
type Listed = { surface: string; slugs: string[]; since?: string };
async function main() {
  const argv = process.argv.slice(2);
  if (argv[0] === "--list") {
    const path = argv[1] ?? LIST;
    const list = JSON.parse(readFileSync(path, "utf8")) as { pages: Listed[] };
    let missing = 0;
    for (const p of list.pages) {
      let out: string | null = null;
      try { out = await renderOne(p.surface, p.slugs); } catch (e: any) { console.log(`  x ${p.surface} ${p.slugs.join(" ")}: ${String(e?.message ?? e)}`); }
      if (!out) { missing++; console.log(`  x NO RENDER: ${p.surface} ${p.slugs.join(" ")} is in ${path} and did not render`); }
    }
    console.log(`render_page --list: ${list.pages.length - missing} of ${list.pages.length} page(s) rendered from ${path}`);
    process.exit(missing ? 1 : 0);
  }
  const [surface, ...slugs] = argv;
  if (!surface || !slugs.length) {
    console.error("usage: render_page.tsx <surface> <slug...> | --list [pages.json]");
    process.exit(2);
  }
  const out = await renderOne(surface, slugs);
  if (!out) process.exit(1);
}
void main();
