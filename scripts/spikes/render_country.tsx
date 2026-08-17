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

async function main() {
  const slugs = process.argv.slice(2);
  const mod = await import("../../src/app/[country]/page");
  const Page = mod.default as unknown as (p: {
    params: Promise<{ country: string }>;
  }) => Promise<React.ReactElement>;

  for (const slug of slugs) {
    let html = "";
    try {
      const el = await Page({
        params: Promise.resolve({ country: slug }),
      });
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
    console.log(`  bg-cream-*            ${count(/class="[^"]*\bbg-cream-\d/g)}`);
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
