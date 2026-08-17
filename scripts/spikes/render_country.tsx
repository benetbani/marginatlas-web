/**
 * scripts/spikes/render_country.tsx , renders the real country page body with
 * react-dom/server and reads the emitted markup.
 *
 * Why a render and not a grep: charter section 9 note 3, and because the thing
 * being changed is which surface a section sits on, which is an attribute the
 * server emits and a source grep cannot resolve past a conditional.
 *
 * BLIND SPOT, stated. It reads the class attribute the server emits. It cannot
 * tell whether a surface is VISIBLE, and it cannot resolve which of two
 * overlapping grounds wins at paint time. The stacking question was settled
 * separately, on a browser reproduction of the real layering, not here.
 */
import { Writable } from "node:stream";

import * as React from "react";
import { renderToPipeableStream } from "react-dom/server";

// The repo's tsconfig uses the classic JSX runtime for these scripts, so the
// page modules compile to React.createElement and need React in global scope.
(globalThis as unknown as { React: typeof React }).React = React;

/**
 * Render a tree to a single HTML string, waiting for every async server
 * component. renderToStaticMarkup cannot do this: the country page nests
 * components that await, and a sync render throws "a component suspended while
 * responding to synchronous input". onAllReady is the streaming API's promise
 * that nothing is still pending.
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

/**
 * Args are route params: "gb" renders the country page, "gb/london" renders the
 * region page in the same tree. One instrument for both so the two page types
 * are measured the same way rather than by two scripts that drift.
 */
async function main() {
  const slugs = process.argv.slice(2);
  const countryMod = await import("../../src/app/[country]/page");
  const geoMod = await import("../../src/app/[country]/[geo]/page");
  const cellMod = await import("../../src/app/[country]/[geo]/[industry]/page");
  type Renderer = (p: { params: Promise<Record<string, string>> }) => Promise<React.ReactElement>;
  const CountryPage = countryMod.default as unknown as Renderer;
  const GeoPage = geoMod.default as unknown as Renderer;
  const CellPage = cellMod.default as unknown as Renderer;

  for (const slug of slugs) {
    let html = "";
    const parts = slug.split("/");
    try {
      const el =
        parts.length === 3
          ? await CellPage({
              params: Promise.resolve({
                country: parts[0],
                geo: parts[1],
                industry: parts[2],
              }),
            })
          : parts.length === 2
            ? await GeoPage({ params: Promise.resolve({ country: parts[0], geo: parts[1] }) })
            : await CountryPage({ params: Promise.resolve({ country: parts[0] }) });
      html = await renderAll(el as React.ReactElement);
    } catch (e) {
      console.log(`\n=== ${slug}: THREW ${(e as Error).message}`);
      continue;
    }

    /* Scope every figure to <main>. SiteChrome's masthead, newsletter bar and
       footer are shared furniture: counting them credits this page with the
       header's classes and hides the body's own movement in the noise. */
    const m = html.match(/<main\b[^>]*>([\s\S]*)<\/main>/);
    if (m) html = m[1];

    const count = (re: RegExp) => (html.match(re) || []).length;
    const sections = [...html.matchAll(/<section[^>]*id="([^"]+)"/g)].map((m) => m[1]);
    const h2 = [...html.matchAll(/<h2[^>]*class="([^"]*)"[^>]*>([\s\S]*?)<\/h2>/g)];
    const text = html
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z]+;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const words = text ? text.split(" ").length : 0;

    console.log(`\n=== ${slug} ===`);
    console.log(`  bytes                 ${html.length}`);
    console.log(`  visible words         ${words}`);
    console.log(`  atlas-card            ${count(/class="[^"]*\batlas-card\b/g)}`);
    console.log(`  hand-rolled bg-white  ${count(/class="[^"]*\bbg-white\b/g)}`);
    console.log(`  surface-ramp fills    ${count(/class="[^"]*\bbg-paper-\d/g)}`);
    console.log(`  <img>                 ${count(/<img\b/g)}`);
    console.log(`  rgba(255,247,230      ${count(/rgba\(255,247,230/g)}`);
    console.log(`  h1                    ${count(/<h1\b/g)}`);
    console.log(`  h2                    ${h2.length}`);
    const scales = new Set(
      h2.map((m) => (m[1].match(/text-\S+|md:text-\S+/g) || []).join(" ")),
    );
    console.log(`  h2 scales             ${[...scales].join(" | ") || "(none)"}`);
    console.log(`  sample tags           ${count(/eng-sample__tag/g)}`);
    console.log(`  section ids (${sections.length})   ${sections.join(", ")}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
