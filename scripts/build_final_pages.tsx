/**
 * build_final_pages , render every page a site visitor can reach whole, with the
 * real stylesheet, into standalone files the founder can open. Four are the
 * rebuilt spine page types on bundled seeds (city, trade, industry, hood); three
 * are the live legacy routes with real data fetches (home, the countries list,
 * the GB country page). See the second render loop below for why the legacy
 * three needed a different renderer than the first four.
 *
 * THE EIGHTH SURFACE IS NOT A PAGE A VISITOR CAN REACH YET, and that is exactly
 * why it is here. `country-gb-new` is the country page being rebuilt behind a
 * shut flag (walk-reform tasks 10 to 18): the real SpineCountryBody over the
 * real adapter seed. Nothing can be judged that cannot be photographed, so the
 * rebuild gets a surface from its first section rather than after its last. The
 * legacy `country-gb` surface stays untouched beside it, because that is what
 * production actually serves until the flag opens.
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
import { renderToStaticMarkup, renderToPipeableStream } from "react-dom/server";
import { Writable } from "node:stream";
import { writeFileSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { buildSpineCitySeed } from "../src/lib/spine/adapt_city";
import { buildSpineCellSeed } from "../src/lib/spine/adapt_cell";
import { buildSpineIndustrySeed } from "../src/lib/spine/adapt_industry";
import { buildSpineHoodSeed } from "../src/lib/spine/adapt_hood";
import { buildSpineCountrySeed } from "../src/lib/spine/adapt_country";
import { SpineCityBody } from "../src/components/spine/city/city-view";
import { SpineCellBody } from "../src/components/spine/cell/cell-view";
import { SpineIndustryBody } from "../src/components/spine/industry/industry-view";
import { SpineHoodBody } from "../src/components/spine/hood/hood-view";
import { SpineCountryBody } from "../src/components/spine/country/country-view";
import { SpineShell } from "../src/components/spine/shell";
import { SiteChrome } from "../src/components/SiteChrome";
import HomePage from "../src/app/page";
import CountriesHub from "../src/app/(site)/countries/page";
import CountryPage from "../src/app/[country]/page";

/* THE STYLESHEET IS REGENERATED, NOT READ FROM A SNAPSHOT, and this cost two
   wrong readings in one session. It used to be a file captured by hand months
   earlier, so any Tailwind class written AFTER that capture simply did not exist
   in the preview: a new reading-measure cap silently did nothing, and a new grid
   template silently collapsed a chart row into three stacked lines. Both looked
   like real defects in the picture and neither was in the page. Tailwind emits
   only the classes the source actually uses, so generating here means the
   preview can never be behind the components it is drawing. */
const CSS_PATH = "scratchpad/pages/site.css";
/* The CLI is invoked through node against the package's own entry point rather
   than through npx: npx resolves to a .cmd shim on Windows, which execFileSync
   cannot spawn without a shell, and a shell here would be one more thing to get
   wrong on the other platform. */
execFileSync(
  process.execPath,
  ["node_modules/tailwindcss/lib/cli.js", "-i", "src/app/globals.css", "-o", CSS_PATH, "--minify"],
  { stdio: "pipe" },
);
const css = readFileSync(CSS_PATH, "utf8");

/* THE ATMOSPHERE PHOTOGRAPH, INLINED. The shell points at a server path, which a
   file:// preview cannot fetch, so every preview built before 2026-08-24 rendered
   the pages over PURE WHITE. That is why the frosted card looked like no card at
   all: glass with nothing behind it is just a rectangle, and I measured contrast
   against a white ground that no reader will ever see. Inlined as data so the
   preview shows the same stack a reader gets. */
const skyline = `data:image/jpeg;base64,${readFileSync("public/spine/_skyline.jpeg").toString("base64")}`;

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
<style>.spine-frame-layer[style*="_skyline"]{background-image:url("${skyline}") !important}</style>
</head>
<body class="[--atlas-header-h:85px] md:[--atlas-header-h:93px] lg:[--atlas-header-h:89px]" style="font-family: var(--font-body);">
${body}
</body>
</html>`;
}

/* WHAT THESE PREVIEWS CANNOT SHOW, AND IT HAS COST TWO FALSE DEFECTS.
 *
 * The output is STATIC MARKUP. React never hydrates it, so anything that needs a
 * runtime measurement renders its server output and no more. Concretely:
 *
 *   AtlasWaterfall     wrapped in shadcn's ChartContainer, which wraps recharts'
 *                      ResponsiveContainer. With no measured width it emits the
 *                      container and NONE of its children, so "What the owner
 *                      keeps" on the trade page shows a heading, a disclosure and
 *                      a tall blank between them. It draws correctly in
 *                      production. Verified 2026-08-24 by computing the identity
 *                      the chart guards on: 31+34+15+15 = 95 against a keep of 5,
 *                      which closes, so the guard is not what emptied it. The
 *                      giveaway is that the words "Sales" and "Keeps" appear in
 *                      the markup ZERO times, so the chart is absent rather than
 *                      blank.
 *   SpineMap           "use client" + maplibre. The neighbourhood page's map
 *                      panel is therefore an empty half beside the district
 *                      chips. Production draws it.
 *
 * Charts built from divs or inline SVG DO appear, which is what makes this
 * dangerous: most of the page looks right, so the two that cannot draw read as
 * broken rather than as absent. BEFORE CALLING A CARD EMPTY, grep the markup for
 * a word the card would print. */
async function main() {
  const jobs: Array<[string, string, unknown, any]> = [
    ["city-london", "London, the city page", SpineCityBody, await buildSpineCitySeed("london")],
    ["cell-london-restaurants", "Restaurants in London, the trade page", SpineCellBody, await buildSpineCellSeed("gb", "london", "restaurants")],
    ["industry-restaurants", "Restaurants, across places", SpineIndustryBody, await buildSpineIndustrySeed("restaurants")],
    ["hood-london", "London neighbourhoods", SpineHoodBody, await buildSpineHoodSeed("london")],
    // The rebuild, rendered exactly the way its four siblings are: the real body
    // over the real seed. It is one section wide today and grows a section per
    // task; the legacy country-gb below is untouched and stays the shipped page.
    ["country-gb-new", "United Kingdom, the rebuilt country page", SpineCountryBody, await buildSpineCountrySeed("gb")],
  ];
  /* THE HOOD VIEW MOUNTS ITS OWN SHELL and its header says so in as many words:
     "do not double-wrap it at the route". This harness wrapped all four alike, so
     every preview of that page carried TWO atmosphere photos and TWO readable
     bands stacked on each other. Production was always correct; only the picture
     lied, which is the worse of the two because the picture is what gets read. */
  const SELF_SHELLED = new Set(["hood-london"]);
  for (const [slug, title, C, data] of jobs) {
    if (!data) { console.log(`  ${slug}: no data`); continue; }
    const inner = React.createElement(C as any, { data });
    const body = renderToStaticMarkup(
      SELF_SHELLED.has(slug) ? inner : React.createElement(SpineShell as any, null, inner),
    );
    writeFileSync(`docs/loop/artifacts/final-pages/${slug}.html`, page(title, body), "utf8");
    console.log(`  ${slug.padEnd(26)} ${Math.round(body.length / 1024)}KB`);
  }

  /* THE THREE SURFACES ABOVE COULD NOT REACH. A site visitor can land on seven
     page types; the loop above only ever rendered four. Home, the countries
     list and the legacy GB country page are the LIVE ROUTES' own component
     trees, not bundled-seed bodies, and two of the three fetch real data the
     way the four jobs above never had to.
     renderToStaticMarkup CANNOT render them. It is a synchronous renderer, and
     an async server component returns a Promise rather than a React node, which
     throws "A component suspended while responding to synchronous input" the
     instant renderToStaticMarkup reaches it. Home is `async function HomePage`
     itself; the legacy country page is worse, because CountryPage the DEFAULT
     EXPORT is a plain sync function that returns
     `<SiteChrome><CountryPageBody/></SiteChrome>` with the async body left
     UNAWAITED inside the tree, so even `await CountryPage(props)` only resolves
     the outer call and leaves the inner Promise for the renderer to trip on.
     This is not a new problem: scripts/spikes/render_country.tsx and
     scripts/spikes/render_home_to_scratch.tsx hit exactly this wall rendering
     these same two route files and solved it the same way, `renderAll` below is
     that solution, reused rather than reinvented a third time. */
  function renderAll(el: React.ReactElement): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const sink = new Writable({
        write(chunk, _enc, cb) {
          chunks.push(Buffer.from(chunk));
          cb();
        },
      });
      sink.on("finish", () => resolve(Buffer.concat(chunks).toString("utf8")));
      const { pipe, abort } = renderToPipeableStream(el, {
        onAllReady() {
          pipe(sink);
        },
        onError(e) {
          abort();
          reject(e);
        },
      });
    });
  }

  /* Output slugs per the brief, exactly: home, countries-list, country-gb.
     Each entry is an async THUNK rather than a resolved element, mirroring
     scripts/spikes/render_country.tsx and render_home_to_scratch.tsx: `await`
     the default export's own call first (a no-op for the two that are already
     plain sync functions, real work for HomePage which awaits its own data
     loaders), THEN hand the result to renderAll so it only has to wait out
     whatever async server component is still nested inside, and so a bad slug
     throwing NEXT_NOT_FOUND surfaces inside the try block below rather than as
     an unhandled rejection (the route working correctly, not the harness
     breaking). */
  const extraJobs: Array<[string, string, () => Promise<React.ReactElement>]> = [
    ["home", "Home", async () => await HomePage()],
    [
      "countries-list",
      "All countries",
      // /countries has no <SiteChrome> of its own. Production wraps it via
      // src/app/(site)/layout.tsx, which this harness never runs, so the wrap
      // happens here by hand, the same reason the four jobs above wrap in
      // SpineShell explicitly.
      async () => React.createElement(SiteChrome as any, null, React.createElement(CountriesHub as any)),
    ],
    [
      "country-gb",
      "United Kingdom, the legacy country page",
      // Flags default OFF in this harness (no NEXT_PUBLIC_SPINE_REFORM* var is
      // set in .env.local), and isSpineReformEnabledFor("country") hardcodes its
      // own master-flag override to false besides, so this always takes the
      // LEGACY branch, never the illustrative spine scaffold. Confirmed by
      // reading src/lib/feature_flags.ts, not assumed.
      async () => await CountryPage({ params: Promise.resolve({ country: "gb" }) }),
    ],
  ];

  for (const [slug, title, build] of extraJobs) {
    let body: string;
    try {
      const el = await build();
      body = await renderAll(el);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`  ${slug}: THREW ${msg}`);
      continue;
    }
    writeFileSync(`docs/loop/artifacts/final-pages/${slug}.html`, page(title, body), "utf8");
    console.log(`  ${slug.padEnd(26)} ${Math.round(body.length / 1024)}KB`);
  }
}
void main();
