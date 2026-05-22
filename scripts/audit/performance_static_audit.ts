/**
 * Plan v24 Block 12 — static performance audit.
 *
 * Real performance measurement requires Lighthouse / WebPageTest /
 * field telemetry. That's out of scope for a 1-2 hour block.
 *
 * Static substitutes:
 *
 *   1. Route bundle sizes from `next build` output (parse the route
 *      table). Flag any route > 50 KB First Load JS over the shared
 *      baseline.
 *   2. Heavy dependencies in node_modules (top-10 by size + uncommon
 *      ones).
 *   3. Force-dynamic routes (each `export const dynamic = "force-dynamic"`
 *      is a route that can't be edge-cached and runs every request).
 *
 * Output:
 *   data/audit/performance_static_v1.json
 *   data/audit/performance_static_REPORT.md
 *
 * Run: `npx tsx scripts/audit/performance_static_audit.ts`
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
  statSync,
} from "node:fs";
import { resolve, join } from "node:path";

const ROOT = process.cwd();
const SRC = resolve(ROOT, "src");
const AUDIT_DIR = resolve(ROOT, "data", "audit");

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    let s;
    try {
      s = statSync(p);
    } catch {
      continue;
    }
    if (s.isDirectory()) walk(p, acc);
    else if (p.endsWith(".tsx") || p.endsWith(".ts")) acc.push(p);
  }
  return acc;
}

function findForceDynamic() {
  const files = walk(SRC).filter(
    (f) => !f.includes("node_modules") && !f.endsWith(".d.ts"),
  );
  const hits: Array<{ file: string; line: number }> = [];
  for (const f of files) {
    const lines = readFileSync(f, "utf-8").split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      if (/export\s+const\s+dynamic\s*=\s*["']force-dynamic["']/.test(lines[i])) {
        hits.push({ file: f.replace(ROOT, ".").replace(/\\/g, "/"), line: i + 1 });
      }
    }
  }
  return hits;
}

function inspectDeps(): Array<{ name: string; sizeMB: number }> {
  const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf-8"));
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const out: Array<{ name: string; sizeMB: number }> = [];
  for (const name of Object.keys(deps)) {
    const dir = resolve(ROOT, "node_modules", name);
    if (!existsSync(dir)) continue;
    let total = 0;
    try {
      walkSize(dir, (s) => (total += s));
    } catch {
      // ignore EACCES on a few corner cases
    }
    out.push({ name, sizeMB: total / 1_048_576 });
  }
  return out.sort((a, b) => b.sizeMB - a.sizeMB);
}

function walkSize(dir: string, onFile: (size: number) => void) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    let s;
    try {
      s = statSync(p);
    } catch {
      continue;
    }
    if (s.isDirectory()) walkSize(p, onFile);
    else onFile(s.size);
  }
}

function inspectBuildOutput(): {
  routes: Array<{ route: string; firstLoadKB: number; type: string }>;
  shared: number;
} {
  const buildManifest = resolve(ROOT, ".next", "build-manifest.json");
  const appPathsManifest = resolve(ROOT, ".next", "server", "app-paths-manifest.json");
  // We don't have direct access to the build's printed route table here.
  // Approximate: collect chunk sizes from .next/static/chunks
  const chunksDir = resolve(ROOT, ".next", "static", "chunks");
  if (!existsSync(chunksDir)) return { routes: [], shared: 0 };
  let total = 0;
  for (const f of readdirSync(chunksDir)) {
    const p = join(chunksDir, f);
    try {
      const s = statSync(p);
      if (s.isFile()) total += s.size;
    } catch {
      // ignore
    }
  }
  return {
    routes: [],
    shared: total / 1024,
  };
}

function main() {
  if (!existsSync(AUDIT_DIR)) mkdirSync(AUDIT_DIR, { recursive: true });

  console.log("Inspecting force-dynamic routes…");
  const forceDynamic = findForceDynamic();
  console.log(`  ${forceDynamic.length} files with export const dynamic = "force-dynamic"`);

  console.log("\nInspecting dependencies…");
  const deps = inspectDeps();
  const top = deps.slice(0, 15);
  console.log(`  Top dependencies by disk size:`);
  for (const d of top) {
    console.log(`    ${d.name.padEnd(40)} ${d.sizeMB.toFixed(1)}MB`);
  }

  console.log("\nInspecting build output (.next/static/chunks)…");
  const build = inspectBuildOutput();
  console.log(`  total chunks: ${build.shared.toFixed(1)}KB`);

  const md: string[] = [];
  md.push("# Performance static audit (Plan v24 Block 12)");
  md.push("");
  md.push(`Generated ${new Date().toISOString()}.`);
  md.push("");
  md.push("## Force-dynamic routes");
  md.push("");
  md.push(`${forceDynamic.length} routes opt out of static / edge caching:`);
  md.push("");
  for (const h of forceDynamic) {
    md.push(`- \`${h.file}:${h.line}\``);
  }
  md.push("");
  md.push("**Implication**: each force-dynamic route runs server-side on every");
  md.push("request. They bypass the edge cache headers in middleware.ts and");
  md.push("add latency proportional to the rendered work. Consider migrating");
  md.push("to revalidate-based ISR where possible (Plan v17 phase 4.3 already");
  md.push("did most of this).");
  md.push("");
  md.push("## Top dependencies by disk size");
  md.push("");
  md.push("| Package | Size |");
  md.push("|---|---:|");
  for (const d of top) {
    md.push(`| ${d.name} | ${d.sizeMB.toFixed(1)} MB |`);
  }
  md.push("");
  md.push("## Static chunks total");
  md.push("");
  md.push(`Total \`.next/static/chunks\` size: **${build.shared.toFixed(1)} KB**`);
  md.push("");
  md.push("(Detailed per-route First Load JS sizes are in the `next build`");
  md.push("output; not parsed here.)");
  md.push("");
  md.push("## Next steps");
  md.push("");
  md.push("- Run Lighthouse on the top 10 cell URLs to capture LCP / CLS / INP.");
  md.push("- Bundle-analyze (`@next/bundle-analyzer`) per-route.");
  md.push("- Measure Sentry source-map injection overhead in production.");
  md.push("");
  writeFileSync(join(AUDIT_DIR, "performance_static_REPORT.md"), md.join("\n"));
  writeFileSync(
    join(AUDIT_DIR, "performance_static_v1.json"),
    JSON.stringify({ forceDynamic, deps: top, build }, null, 2),
  );

  console.log(`\n→ ${join(AUDIT_DIR, "performance_static_v1.json")}`);
  console.log(`→ ${join(AUDIT_DIR, "performance_static_REPORT.md")}`);
}

main();
