/**
 * scripts/spikes/measure_home_bands.tsx , counts the homepage bands that
 * actually EMIT, band by band, from the real src/app/page.tsx.
 *
 * WHY IT EXISTS. The founder's standing complaint is that the homepage is
 * "very deficitary and bland" and asks for "at least 10 sections". The page
 * DECLARES eleven bands, and that was the only number anybody had. It is not
 * the number he is looking at: three of the eleven are data bands that render
 * nothing when their lookup does not resolve, and until `data-band` landed
 * nothing in the DOM said which band was which, because ToneBand emitted an
 * anonymous div and three separate bands share the tone "home-featured".
 *
 * WHAT IT MEASURES. Per band, in document order: whether it emitted markup at
 * all, its visible word count, its character count, and the first heading it
 * carries. Words are counted after tags and entities are stripped, so a band
 * full of markup and empty of language reads as zero.
 *
 * BLIND SPOTS, and they are the reason this is an instrument rather than a
 * verdict:
 *   1. SSR only. Anything that appears on hydration is invisible here.
 *   2. It proves what the server EMITS, never what the browser PAINTS. A band
 *      that emits markup can still compute to zero height. That is a
 *      screenshot's question and it is the next tick's.
 *   3. Data bands self-omit from this machine because cell lookups exceed
 *      their budget to eu-west-1. An absence here is NOT evidence the band is
 *      absent in production, and must never be "fixed" by softening the omit.
 *   4. Band chunks are cut at each `data-band` marker, so a band's chunk
 *      includes the closing tags of the band before the next marker. That
 *      inflates character counts by a few dozen and cannot inflate word counts.
 *
 * Run:
 *   npx tsx --env-file=.env.local --require ./scripts/spikes/stub_next_font.cjs \
 *     scripts/spikes/measure_home_bands.tsx
 */
import { Writable } from "node:stream";

import * as React from "react";
import { renderToPipeableStream } from "react-dom/server";

(globalThis as unknown as { React: typeof React }).React = React;

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

/** The bands the page declares, in source order. Kept here so a band deleted
 *  from the page shows up as MISSING rather than silently shrinking the list. */
const DECLARED = [
  "hero",
  "specimen",
  "example-tiles",
  "ledger",
  "catalog-plates",
  "world-map",
  "state-comparison",
  "neighborhoods",
  "audience",
  "blog-rail",
  "newsletter",
];

function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  const mod = await import("../../src/app/page");
  const Home = mod.default as unknown as () => Promise<React.ReactElement>;
  const html = await renderAll(await Home());

  const marker = /data-band="([a-z-]+)"/g;
  const hits: { band: string; at: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = marker.exec(html)) !== null) hits.push({ band: m[1], at: m.index });

  const rows = hits.map((h, i) => {
    const end = i + 1 < hits.length ? hits[i + 1].at : html.length;
    const chunk = html.slice(h.at, end);
    const text = visibleText(chunk);
    const heading = /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/.exec(chunk);
    return {
      band: h.band,
      chars: chunk.length,
      words: text ? text.split(" ").length : 0,
      heading: heading ? visibleText(heading[1]).slice(0, 44) : "",
    };
  });

  const emitted = new Set(rows.map((r) => r.band));
  const missing = DECLARED.filter((b) => !emitted.has(b));

  console.log(`\nHOMEPAGE BANDS, rendered ${new Date().toISOString().slice(0, 10)}`);
  console.log(`declared ${DECLARED.length}   emitted ${rows.length}   absent ${missing.length}\n`);
  console.log("band                chars   words  heading");
  for (const r of rows) {
    console.log(
      `${r.band.padEnd(18)} ${String(r.chars).padStart(6)} ${String(r.words).padStart(6)}  ${r.heading}`,
    );
  }
  if (missing.length) console.log(`\nABSENT: ${missing.join(", ")}`);
  const totalWords = rows.reduce((n, r) => n + r.words, 0);
  console.log(`\ntotal visible words on the page: ${totalWords}`);
  console.log(
    "NOT a paint measurement: an emitted band can still compute to zero height, and a band absent here may render in production.",
  );
}

void main();
