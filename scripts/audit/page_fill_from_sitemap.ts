/**
 * Plan v24 Block 5 — page-fill audit driven by production sitemap.
 *
 * Pulls URLs directly from https://www.marginatlas.com/sitemap.xml
 * (and its sub-sitemaps), samples N cell paths, and runs the same
 * section-presence scoring as `page_fill_audit.ts`. This bypasses the
 * stale `url-inventory.json` which only has 22 cell pages.
 *
 * Output: same files as page_fill_audit.ts.
 *
 * Run: `npx tsx scripts/audit/page_fill_from_sitemap.ts --sample 300`
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

type Section =
  | "narrative"
  | "revenue-tiles"
  | "tax-and-cost-panel"
  | "revenue-distribution"
  | "across-states"
  | "related-cells";

const SECTIONS: Section[] = [
  "narrative",
  "revenue-tiles",
  "tax-and-cost-panel",
  "revenue-distribution",
  "across-states",
  "related-cells",
];

type FillRow = {
  path: string;
  status: number;
  duration_ms: number;
  content_length: number;
  has_h1: boolean;
  sections_present: Section[];
  sections_missing: Section[];
  fill_score: number;
  classification: "ok" | "thin" | "missing-core" | "broken";
};

const ROOT = process.cwd();
const OUT_DIR = resolve(ROOT, "data", "audit");
const QUALITY_DIR = resolve(ROOT, "data", "quality");

const args = process.argv.slice(2);
function arg(name: string, def?: string): string | undefined {
  const idx = args.indexOf(name);
  return idx >= 0 ? args[idx + 1] : def;
}

const BASE = arg("--base", "https://www.marginatlas.com")!;
const SAMPLE = parseInt(arg("--sample", "300")!, 10);
const CONCURRENCY = parseInt(arg("--concurrency", "3")!, 10);
const TIMEOUT_MS = parseInt(arg("--timeout", "15000")!, 10);

const HEADERS = {
  "User-Agent":
    "MarginAtlas-Audit/1.0 (page-fill scorer; +https://www.marginatlas.com)",
  "Accept-Language": "en-US,en;q=0.9",
  Accept: "text/html,application/xml,*/*;q=0.8",
};

function detectSection(html: string, id: Section): boolean {
  const re = new RegExp(
    `<(?:section|div)\\s+[^>]*id=["']${id}["']`,
    "i",
  );
  return re.test(html);
}

async function fetchText(url: string, timeoutMs = TIMEOUT_MS): Promise<string> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { headers: HEADERS, signal: ctrl.signal });
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

function extractUrls(xml: string): string[] {
  const urls: string[] = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    urls.push(m[1].trim());
  }
  return urls;
}

function isCellPath(p: string): boolean {
  const parts = p.split("/").filter(Boolean);
  if (parts.length !== 3) return false;
  if (parts[1] === "industries") return false;
  if (parts[2] === "industries") return false;
  if (parts[0].length !== 2) return false;
  return true;
}

async function loadSitemapUrls(): Promise<string[]> {
  const index = await fetchText(`${BASE}/sitemap.xml`);
  const subSitemaps = extractUrls(index);
  console.log(`Sitemap index: ${subSitemaps.length} sub-sitemaps`);
  const all: string[] = [];
  for (const sm of subSitemaps) {
    try {
      const xml = await fetchText(sm);
      const urls = extractUrls(xml);
      console.log(`  ${sm}: ${urls.length} URLs`);
      all.push(...urls);
    } catch (e) {
      console.warn(`  ${sm}: FAILED to fetch`);
    }
  }
  return all;
}

async function probe(path: string): Promise<FillRow> {
  const url = BASE.replace(/\/$/, "") + path;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const start = Date.now();
  let status = 0;
  let text = "";
  try {
    const res = await fetch(url, {
      headers: HEADERS,
      redirect: "follow",
      signal: ctrl.signal,
    });
    status = res.status;
    text = await res.text();
  } catch {
    status = 0;
  } finally {
    clearTimeout(t);
  }
  const duration_ms = Date.now() - start;
  const content_length = text.length;
  const has_h1 = /<h1[\s>]/.test(text);
  const present: Section[] = [];
  const missing: Section[] = [];
  for (const s of SECTIONS) {
    (detectSection(text, s) ? present : missing).push(s);
  }
  const fill_score = present.length / SECTIONS.length;

  let classification: FillRow["classification"];
  if (status !== 200) classification = "broken";
  else if (!present.includes("revenue-tiles")) classification = "missing-core";
  else if (fill_score < 0.5) classification = "thin";
  else classification = "ok";

  return {
    path,
    status,
    duration_ms,
    content_length,
    has_h1,
    sections_present: present,
    sections_missing: missing,
    fill_score,
    classification,
  };
}

async function runWithConcurrency<T, R>(
  items: T[],
  worker: (item: T) => Promise<R>,
  concurrency: number,
  onProgress?: (done: number, total: number, item: T, r: R) => void,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  let done = 0;
  const runners = Array.from({ length: concurrency }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      results[i] = await worker(items[i]);
      done++;
      onProgress?.(done, items.length, items[i], results[i]);
    }
  });
  await Promise.all(runners);
  return results;
}

function sample<T>(arr: T[], n: number): T[] {
  if (arr.length <= n) return arr.slice();
  const out: T[] = [];
  const step = arr.length / n;
  for (let i = 0; i < n; i++) {
    out.push(arr[Math.floor(i * step)]);
  }
  return out;
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  if (!existsSync(QUALITY_DIR)) mkdirSync(QUALITY_DIR, { recursive: true });

  const allUrls = await loadSitemapUrls();
  const cellUrls = allUrls
    .map((u) => {
      try {
        const u2 = new URL(u);
        return u2.pathname;
      } catch {
        return null;
      }
    })
    .filter((p): p is string => !!p && isCellPath(p));

  console.log(
    `\nSitemap: ${allUrls.length} total URLs, ${cellUrls.length} are cell pages.`,
  );

  const picked = sample(cellUrls, SAMPLE);
  console.log(`Sampling ${picked.length} cell URLs.`);
  console.log(`Probing against ${BASE} at concurrency=${CONCURRENCY}.\n`);

  const results = await runWithConcurrency(
    picked,
    probe,
    CONCURRENCY,
    (done, total, _path, r) => {
      const icon =
        r.classification === "ok"
          ? "✓"
          : r.classification === "thin"
            ? "~"
            : r.classification === "missing-core"
              ? "□"
              : "✗";
      if (done % 50 === 0 || r.classification !== "ok") {
        console.log(
          `  [${done}/${total}] ${icon} ${r.classification} score=${r.fill_score.toFixed(2)} ${r.path}`,
        );
      }
    },
  );

  const outPath = join(OUT_DIR, "page_fill_v1.json");
  writeFileSync(outPath, JSON.stringify(results, null, 2));

  const thin = results.filter(
    (r) =>
      r.classification === "thin" ||
      r.classification === "missing-core" ||
      r.classification === "broken",
  );
  const thinUrls = thin.map((r) => r.path);
  writeFileSync(
    join(QUALITY_DIR, "thin_pages_v1.json"),
    JSON.stringify({ generated_at: new Date().toISOString(), paths: thinUrls }, null, 2),
  );

  const counters: Record<FillRow["classification"], number> = {
    ok: 0,
    thin: 0,
    "missing-core": 0,
    broken: 0,
  };
  for (const r of results) counters[r.classification]++;

  console.log("\n=== Summary ===");
  for (const [k, v] of Object.entries(counters)) {
    if (v > 0)
      console.log(`  ${k.padEnd(13)}: ${v} (${((v / results.length) * 100).toFixed(1)}%)`);
  }

  const sectionCounts: Record<Section, number> = {
    narrative: 0,
    "revenue-tiles": 0,
    "tax-and-cost-panel": 0,
    "revenue-distribution": 0,
    "across-states": 0,
    "related-cells": 0,
  };
  for (const r of results) {
    for (const s of r.sections_present) sectionCounts[s]++;
  }
  console.log("\n=== Section presence ===");
  for (const [s, n] of Object.entries(sectionCounts)) {
    const pct = ((n / results.length) * 100).toFixed(1);
    console.log(`  ${s.padEnd(22)}: ${n} (${pct}%)`);
  }

  // Markdown report
  const md: string[] = [];
  md.push("# Page-fill audit (Plan v24 Block 5)");
  md.push("");
  md.push(`Generated ${new Date().toISOString()} against ${BASE}.`);
  md.push("");
  md.push(
    `Sample: ${picked.length} of ${cellUrls.length} cell URLs from the production sitemap.`,
  );
  md.push("");
  md.push("## Summary");
  md.push("");
  md.push(
    `- ok: **${counters.ok}** (${((counters.ok / results.length) * 100).toFixed(1)}%)`,
  );
  md.push(
    `- thin: **${counters.thin}** (fill_score < 0.5 but core sections present)`,
  );
  md.push(
    `- missing-core: **${counters["missing-core"]}** (revenue-tiles not rendered)`,
  );
  md.push(`- broken: **${counters.broken}** (HTTP non-200)`);
  md.push("");
  md.push("## Section presence");
  md.push("");
  for (const [s, n] of Object.entries(sectionCounts)) {
    const pct = ((n / results.length) * 100).toFixed(1);
    md.push(`- ${s}: ${n} (${pct}%)`);
  }
  md.push("");
  md.push("## First 50 thin/missing/broken URLs");
  md.push("");
  for (const r of thin.slice(0, 50)) {
    md.push(
      `- ${r.classification} (score ${r.fill_score.toFixed(2)}, HTTP ${r.status}): ${r.path}`,
    );
    if (r.sections_missing.length > 0) {
      md.push(`  - missing: ${r.sections_missing.join(", ")}`);
    }
  }
  md.push("");
  md.push("## Wired into");
  md.push("");
  md.push("- `data/quality/thin_pages_v1.json` — sitemap excludes these URLs");
  md.push("- `src/app/sitemap.ts` reads the suppression list at build time");
  md.push("");
  writeFileSync(join(OUT_DIR, "page_fill_REPORT.md"), md.join("\n"));

  console.log(`\n→ ${outPath}`);
  console.log(`→ ${join(OUT_DIR, "page_fill_REPORT.md")}`);
  console.log(
    `→ ${join(QUALITY_DIR, "thin_pages_v1.json")} (${thinUrls.length} URLs suppressed)`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
