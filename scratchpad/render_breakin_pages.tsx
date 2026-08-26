/**
 * scratchpad/render_breakin_pages.tsx , renders the real cell page and the real
 * opening page to standalone HTML files so they can be served and screenshotted
 * per charter section 9.1. No dev server involved.
 *
 * Usage:
 *   npx dotenv -e .env.local -- npx tsx --require scripts/spikes/stub_next_font.cjs \
 *     scratchpad/render_breakin_pages.tsx <outdir> <cssfile>
 *
 * BLIND SPOT, stated: SSR pass only. Anything that appears on hydration is
 * absent, and the cell page's data bands self-omit from this machine because the
 * cell lookups exceed the 4s budget to eu-west-1. Their absence is a documented
 * latency artifact, never a layout finding.
 */
import { Writable } from "node:stream";
import * as fs from "node:fs";
import * as path from "node:path";

import { config } from "dotenv";

// Env before any module that builds a Supabase client at import time.
config({ path: path.resolve(process.cwd(), ".env.local") });

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

const TARGETS: { name: string; params: Record<string, string>; mod: string }[] = [
  {
    name: "opening",
    mod: "../src/app/[country]/[geo]/[industry]/opening/page",
    params: { country: "us", geo: "california", industry: "restaurants" },
  },
  {
    name: "cell",
    mod: "../src/app/[country]/[geo]/[industry]/page",
    params: { country: "us", geo: "california", industry: "restaurants" },
  },
];

async function main() {
  const outDir = path.resolve(process.argv[2]);
  const cssFile = path.resolve(process.argv[3]);
  const css = fs.readFileSync(cssFile, "utf8");
  fs.mkdirSync(outDir, { recursive: true });

  for (const t of TARGETS) {
    let html = "";
    try {
      const mod = await import(t.mod);
      const Page = mod.default as unknown as (p: {
        params: Promise<Record<string, string>>;
      }) => Promise<React.ReactElement>;
      const el = await Page({ params: Promise.resolve(t.params) });
      html = await renderAll(el as React.ReactElement);
    } catch (e) {
      console.log(`${t.name}: THREW ${(e as Error).message}`);
      continue;
    }
    const doc = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t.name}</title><style>${css}</style></head><body>${html}</body></html>`;
    const file = path.join(outDir, `${t.name}.html`);
    fs.writeFileSync(file, doc, "utf8");
    const why = (html.match(/Why this rating/g) || []).length;
    console.log(
      `${t.name}: ${html.length} bytes -> ${file}   "Why this rating" x${why}`,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
