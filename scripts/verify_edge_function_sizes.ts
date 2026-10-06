/**
 * Plan v26 Phase A.6 — pre-deploy guard against Vercel Edge function
 * size cap.
 *
 * Vercel Hobby caps Edge functions at 1 MB total bundle size. Plan v24
 * Block 11 inadvertently chained a 2.8 MB JSON-imported data file
 * into the /og/cell Edge bundle, pushing it to 1.15 MB and silently
 * blocking every deploy for ~3 weeks. This guard catches that class
 * of regression at postbuild time.
 *
 * WHICH FUNCTIONS ARE EDGE: NEXT'S OWN LIST, NOT A WORD IN THE CODE (2026-10-06). This guard used to call a route "edge"
 * when its compiled route.js held `runtime = "edge"` or the word `EdgeRuntime`. Sentry's core holds that word (its own
 * runtime test, `typeof EdgeRuntime`), so the Stripe webhook, a Node function, became "an Edge function" the day it
 * imported @sentry/nextjs (the deep goal's A2), measured 1,028.4 KB against the Edge cap, and failed the production build
 * of 56dd5b10, though a Node function's limit is 250 MB. Next writes every edge function it built into
 * .next/server/middleware-manifest.json (`functions` for edge routes and pages, `middleware` for the middleware), each
 * with the files it ships; that list is the build's own answer, and it is what is read now. The middleware is measured
 * too: it is an edge function under the same cap, and the old walk of .next/server/app never reached it.
 *
 * THE SIZE IS GZIPPED, as Vercel counts it ("after gzip compression"): the function's files and wasm and assets,
 * concatenated and compressed. Over 1 MB fails; over 900 KB warns.
 *
 * Run: `npx tsx scripts/verify_edge_function_sizes.ts` (the npm postbuild hook runs it after `next build`).
 * Expects .next/ from a build; with no manifest it says so and passes, since the build itself is the check then.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";

const ROOT = process.cwd();
const NEXT_DIR = resolve(ROOT, ".next");
const MANIFEST = resolve(NEXT_DIR, "server", "middleware-manifest.json");
const WARN_BYTES = 900 * 1024;
const HARD_CAP = 1 * 1024 * 1024;

type EdgeEntry = { files?: string[]; wasm?: Array<{ filePath: string }>; assets?: Array<{ filePath: string }>; name?: string; page?: string };
type Manifest = { middleware?: Record<string, EdgeEntry>; functions?: Record<string, EdgeEntry> };

/** The function's shipped files, gzipped together: raw bytes, gzipped bytes, files missing on disk. */
function measure(entry: EdgeEntry): { raw: number; gz: number; missing: string[] } {
  const paths = [...(entry.files ?? []), ...(entry.wasm ?? []).map((w) => w.filePath), ...(entry.assets ?? []).map((a) => a.filePath)];
  const missing: string[] = [];
  const parts: Buffer[] = [];
  for (const rel of paths) {
    const p = resolve(NEXT_DIR, rel);
    if (!existsSync(p)) { missing.push(rel); continue; }
    parts.push(readFileSync(p));
  }
  const all = Buffer.concat(parts);
  return { raw: all.length, gz: gzipSync(all, { level: 9 }).length, missing };
}

function main() {
  if (!existsSync(MANIFEST)) {
    console.log("(skipping edge size guard: .next/server/middleware-manifest.json not present; run after a build)");
    return;
  }
  const manifest = JSON.parse(readFileSync(MANIFEST, "utf8")) as Manifest;
  const entries: Array<{ label: string; entry: EdgeEntry }> = [
    ...Object.entries(manifest.middleware ?? {}).map(([k, e]) => ({ label: `middleware ${k}`, entry: e })),
    ...Object.entries(manifest.functions ?? {}).map(([k, e]) => ({ label: k, entry: e })),
  ];
  if (entries.length === 0) {
    console.log("✓ No Edge functions in the build's manifest.");
    return;
  }

  console.log(`Inspecting ${entries.length} Edge function(s), from Next's middleware-manifest.json:\n`);
  let fail = 0;
  let warn = 0;
  for (const { label, entry } of entries) {
    const { raw, gz, missing } = measure(entry);
    let mark = "✓";
    if (gz > HARD_CAP) { mark = "✗"; fail++; }
    else if (gz > WARN_BYTES) { mark = "~"; warn++; }
    console.log(`  ${mark} ${label.padEnd(40)} ${(gz / 1024).toFixed(1).padStart(8)} KB gzipped (${(raw / 1024).toFixed(1)} KB raw)${missing.length ? `; ${missing.length} listed file(s) not on disk` : ""}`);
  }

  console.log("");
  if (fail > 0) {
    console.error(`✗ ${fail} Edge function(s) exceed the 1 MB Vercel Hobby cap (gzipped).`);
    console.error(`  Switch to Node runtime or trim the import chain.`);
    process.exit(1);
  }
  if (warn > 0) console.warn(`~ ${warn} Edge function(s) within 10% of the 1 MB cap. Watch closely.`);
  console.log(`✓ All Edge functions under ${WARN_BYTES / 1024} KB gzipped.`);
}

main();
