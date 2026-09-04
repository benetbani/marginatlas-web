/* THE HARNESS RENDERER. Renders the archetype stories to one static HTML file
   over the site's own compiled stylesheet, without Next and without the
   network, so the checks measure what the site would draw.
   usage, from E:/atlas/website:
     npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/harness/render_archetypes.tsx
   writes scratchpad/harness/archetypes.html and instances.json */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { AnswerCardStories, pickAnswerCardInstances } from "../../src/components/spine/archetypes/stories";

const CSS_PATH = "scratchpad/pages/site.css";
try {
  execFileSync(process.execPath, ["node_modules/tailwindcss/lib/cli.js", "-i", "src/app/globals.css", "-o", CSS_PATH, "--minify"], { stdio: "pipe" });
} catch {
  /* a stale stylesheet still renders */
}
const css = readFileSync(CSS_PATH, "utf8");
const instances = pickAnswerCardInstances();
const body = renderToStaticMarkup(
  <main className="mx-auto max-w-[1120px] px-4 py-10">
    <AnswerCardStories instances={instances} />
  </main>,
);
const html = `<!doctype html><html lang="en" style="--font-sans: Geist, ui-sans-serif, system-ui, sans-serif; --font-serif: Space Grotesk, ui-sans-serif, system-ui, sans-serif;"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Archetype stories</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Space+Grotesk:wght@500;600&display=swap"><style>${css}</style></head><body class="bg-[var(--c-bg)] text-[var(--c-ink)]">${body}</body></html>`;
mkdirSync("scratchpad/harness", { recursive: true });
writeFileSync("scratchpad/harness/archetypes.html", html);
writeFileSync("scratchpad/harness/instances.json", JSON.stringify(instances, null, 2));
console.log("rendered", instances.length, "instances:", instances.map((i) => i.iso2).join(" "));
