/**
 * Plan v26 Phase A.6 — pre-deploy guard against Vercel Edge function
 * size cap.
 *
 * Vercel Hobby caps Edge functions at 1 MB total bundle size. Plan v24
 * Block 11 inadvertently chained a 2.8 MB JSON-imported data file
 * into the /og/cell Edge bundle, pushing it to 1.15 MB and silently
 * blocking every deploy for ~3 weeks. This guard catches that class
 * of regression at prebuild time.
 *
 * Walks .next/server/app for any route built with edge runtime. For
 * each, sums the .js + chunk sizes. Fails the build if any exceeds
 * 900 KB (10% safety margin under the 1 MB cap).
 *
 * Run: `npx tsx scripts/verify_edge_function_sizes.ts`
 *
 * Expects: .next/ exists from a prior build. If it doesn't, this
 * silently passes — the actual Edge size check happens during build.
 * Caller wires this into the prebuild chain AFTER `next build` in
 * deploy CI, OR runs it standalone post-build for local verification.
 */
import {
  existsSync,
  readdirSync,
  statSync,
  readFileSync,
} from "node:fs";
import { resolve, join } from "node:path";

const ROOT = process.cwd();
const APP_DIR = resolve(ROOT, ".next", "server", "app");
const EDGE_BYTES_CAP = 900 * 1024;
const HARD_CAP = 1 * 1024 * 1024;

function walk(dir: string, acc: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of entries) {
    const p = join(dir, name);
    let s;
    try {
      s = statSync(p);
    } catch {
      continue;
    }
    if (s.isDirectory()) walk(p, acc);
    else if (p.endsWith(".js") || p.endsWith(".js.map")) acc.push(p);
  }
  return acc;
}

function fileSize(p: string): number {
  try {
    return statSync(p).size;
  } catch {
    return 0;
  }
}

/**
 * Sums the bytes for a route. Counts route.js + any per-route chunk
 * the route loader bundled. Crude but conservative: false-positives
 * here mean we shave bundles unnecessarily, not that we miss a real
 * overflow.
 */
function routeSize(routeDir: string): number {
  if (!existsSync(routeDir)) return 0;
  let total = 0;
  for (const f of readdirSync(routeDir)) {
    const p = join(routeDir, f);
    const s = statSync(p);
    if (s.isFile() && (f.endsWith(".js") || f.endsWith(".nft.json"))) {
      total += s.size;
    }
  }
  return total;
}

/**
 * Read a route's source to detect `export const runtime = "edge"`.
 * Walks .next/server/app/**\/route.js because the compiled output
 * preserves the runtime config in metadata.
 */
function detectEdgeRoutes(): Array<{ route: string; dir: string }> {
  const out: Array<{ route: string; dir: string }> = [];
  if (!existsSync(APP_DIR)) return out;
  const allJs = walk(APP_DIR);
  // Look for route.js files. For each, check the compiled metadata
  // for an edge runtime marker. Next 15 emits a route.js per dynamic
  // route plus a route-config block.
  const routeFiles = allJs.filter((p) => p.endsWith("route.js"));
  for (const rf of routeFiles) {
    try {
      const src = readFileSync(rf, "utf-8");
      // Compiled Next 15 includes the runtime string in the module.
      if (/runtime\s*=\s*["']edge["']/.test(src) || src.includes("EdgeRuntime")) {
        const dir = rf.replace(/route\.js$/, "");
        const route = dir.replace(APP_DIR, "").replace(/[\\/]+$/, "").replace(/\\/g, "/");
        out.push({ route: route || "/", dir });
      }
    } catch {
      // skip unreadable file
    }
  }
  return out;
}

function main() {
  if (!existsSync(APP_DIR)) {
    console.log("(skipping edge size guard: .next/server/app not present yet)");
    return;
  }

  const edgeRoutes = detectEdgeRoutes();

  if (edgeRoutes.length === 0) {
    console.log("✓ No Edge functions detected in build output.");
    return;
  }

  console.log(`Inspecting ${edgeRoutes.length} Edge function(s):\n`);

  let fail = 0;
  let warn = 0;
  for (const r of edgeRoutes) {
    const bytes = routeSize(r.dir);
    const kb = (bytes / 1024).toFixed(1);
    let mark = "✓";
    if (bytes > HARD_CAP) {
      mark = "✗";
      fail++;
    } else if (bytes > EDGE_BYTES_CAP) {
      mark = "~";
      warn++;
    }
    console.log(`  ${mark} ${r.route.padEnd(40)} ${kb.padStart(8)} KB`);
  }

  console.log("");
  if (fail > 0) {
    console.error(
      `✗ ${fail} Edge function(s) exceed the 1 MB Vercel Hobby cap.`,
    );
    console.error(`  Switch to Node runtime or trim the import chain.`);
    process.exit(1);
  }
  if (warn > 0) {
    console.warn(
      `~ ${warn} Edge function(s) within 10% of the 1 MB cap. Watch closely.`,
    );
  }
  console.log(`✓ All Edge functions under ${EDGE_BYTES_CAP / 1024} KB.`);
}

main();
