/**
 * scripts/spikes/render_home_to_scratch.tsx , writes the real homepage body to a
 * standalone HTML document so a browser can MEASURE it.
 *
 * WHY IT EXISTS. `measure_home_bands.tsx` counts what the server EMITS and says
 * so in its own blind-spot 2: "a band that emits markup can still compute to
 * zero height. That is a screenshot's question and it is the next tick's." This
 * is that instrument. `docs/loop/09-SITE-CONTINUATION.md` section B4 asks for the
 * same thing from the other direction: anything under 40px that is not a rule or
 * a spacer is a candidate for "elements are missing".
 *
 * WHAT IT DOES. Renders `src/app/page.tsx` with react-dom/server, then wraps the
 * markup in a minimal document that links a Tailwind build. It writes both to the
 * scratch directory given as argv[2]. It measures nothing itself: measuring is
 * the browser's job, and mixing the two is how a render harness starts reporting
 * verdicts it cannot see.
 *
 * ORDER MATTERS. Compile the stylesheet AFTER this script writes, never before.
 * Tailwind emits only the classes it can see, so a class written after the
 * compile emits no rule and the element renders unstyled while looking correct in
 * source. That has cost this project twice.
 *
 * BLIND SPOTS, stated because the numbers this enables will be quoted.
 *   1. NO LAYOUT, NO FRAME. `src/app/layout.tsx` is not rendered, so AtlasFrame's
 *      two fixed z-index-0 layers are absent. Band heights do not depend on them,
 *      but anything that reads as "is it painted at all" does, and that question
 *      cannot be answered here. See charter section 9.2.
 *   2. NO REAL FONTS, AND THE FIXTURE COMPENSATES DELIBERATELY. The next/font
 *      stub returns `--font-stub`, so the two slots are never set. Measured
 *      2026-08-19: with them unset, EVERY element on the page resolved to
 *      "Times New Roman", the browser default, because nothing in this fixture
 *      applies a family at all. Heights measured in the wrong font are wrong
 *      heights, so the wrapper now sets `--font-sans` and `--font-serif` to the
 *      same fallback stacks next/font would supply and puts `--font-body` on the
 *      body. THE SLOTS MUST GO ON <html>, NOT <body>, and that is not a style
 *      preference. `--font-body` is declared on `:root` as
 *      `var(--font-sans), Inter, ...`, and a `var()` naming an UNSET property
 *      with no fallback is invalid at computed-value time, which voids the whole
 *      declaration. Measured: with the slots on <body>, `--font-body` computed
 *      to the EMPTY STRING on :root and every element fell to the browser
 *      default. Same defect class as 2179bcb2, one element up. Setting them on
 *      <html> resolved 171 elements to Inter and 61 to Newsreader, two families,
 *      and moved the page height 5,864 to 5,933px at 1280. That 69px is the
 *      difference between measuring in the right font and the wrong one. It is still NOT what a reader sees: the
 *      webfonts are not loaded here, so this resolves to whatever sans and serif
 *      the machine has. A font census run on this document measures the FALLBACK.
 *      It can still prove the absence of the self-reference defect fixed in
 *      2179bcb2, because an unset variable falls through while an invalid one
 *      does not.
 *   3. SSR ONLY. Anything that appears on hydration is invisible.
 *   4. Data bands self-omit from this machine because cell lookups exceed their
 *      budget to eu-west-1. A short band here is NOT evidence of a short band in
 *      production, and must never be "fixed" by softening the omit.
 *
 * Run:
 *   npx tsx --env-file=.env.local --require ./scripts/spikes/stub_next_font.cjs \
 *     scripts/spikes/render_home_to_scratch.tsx <scratch-dir>
 */
import { Writable } from "node:stream";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import * as React from "react";
import { renderToPipeableStream } from "react-dom/server";

(globalThis as unknown as { React: typeof React }).React = React;

/**
 * Render to a single string, waiting for every async server component.
 * renderToStaticMarkup cannot do this: the homepage nests components that await,
 * and a sync render throws "a component suspended while responding to
 * synchronous input". onAllReady is the streaming API's promise that nothing is
 * still pending.
 */
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

async function main() {
  const outDir = process.argv[2];
  if (!outDir) {
    console.error("usage: render_home_to_scratch.tsx <scratch-dir> [route-module, default \"page\"]");
    process.exit(1);
  }
  mkdirSync(outDir, { recursive: true });

  /* argv[3] is an optional route module path relative to src/app, so this
     renders any route rather than only the homepage. Added 2026-08-19 for the
     graphics review, and deliberately as a PARAMETER rather than a sixth
     spike: the backlog already carries P3-8, "five render spikes each
     re-derive the same harness". */
  const routeArg = process.argv[3] || "page";
  const mod = await import("../../src/app/" + routeArg);
  const Route = mod.default as unknown as (p?: unknown) => Promise<React.ReactElement>;
  const body = await renderAll(await Route({}));

  /* The wrapper mirrors what the real layout puts around the page: the content
     column token and the header-height token the masthead offset reads. It does
     NOT include AtlasFrame; see blind spot 1. */
  const doc = `<!doctype html>
<html lang="en" style="--font-sans: Inter, ui-sans-serif, system-ui, sans-serif; --font-serif: Newsreader, Georgia, ui-serif, serif;">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>home measurement fixture</title>
<link rel="stylesheet" href="./site.css">
</head>
<body class="[--atlas-header-h:85px] md:[--atlas-header-h:93px] lg:[--atlas-header-h:89px]" style="font-family: var(--font-body);">
<main class="relative">
${body}
</main>
</body>
</html>
`;

  const outName = (routeArg === "page" ? "home" : routeArg.replace(/\/page$/, "").replace(/[^a-z0-9]+/gi, "-")) + ".html";
  writeFileSync(join(outDir, outName), doc, "utf8");
  const bands = [...body.matchAll(/data-band="([a-z-]+)"/g)].map((m) => m[1]);
  console.log(`wrote ${join(outDir, outName)}`);
  console.log(`bands emitted: ${bands.length}`);
  console.log(bands.join(" "));
  console.log(
    "\nNOT a measurement. Compile site.css into the same directory AFTER this, serve it, and measure in a browser.",
  );
}

void main();
