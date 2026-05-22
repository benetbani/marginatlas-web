/**
 * Plan v24 Block 5 — page-fill audit.
 *
 * Crawls a sample of cell URLs, parses the rendered HTML, and scores
 * each page on which canonical sections actually rendered with
 * content. Outputs `data/audit/page_fill_v1.json` (per-URL fill score)
 * plus `data/audit/page_fill_REPORT.md` (human-readable summary) and
 * `data/quality/thin_pages_v1.json` (URLs to suppress from sitemap).
 *
 * Section markers checked:
 *   - section#narrative              (story-first hero copy)
 *   - section#revenue-tiles          (mean / median / p90 tiles)
 *   - section#tax-and-cost-panel     (net profit summary)
 *   - section#revenue-distribution   (distribution visual)
 *   - div#across-states              (cross-region strip)
 *   - section#related-cells          (related cell tiles)
 *
 * fill_score = number of sections present / number of sections expected.
 * thin pages: fill_score < 0.50 OR no revenue-tiles section OR HTTP non-200.
 *
 * Sample selection: top 5,000 entries from data/audit/url-inventory.json
 * filtered to cell paths (3 segments: /country/geo/industry). All other
 * URL classes (static, hubs, country landings) are skipped — they're
 * not subject to the cell-page section model.
 *
 * Run: `npx tsx scripts/audit/page_fill_audit.ts \
 *        --base https://www.marginatlas.com --sample 500`
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "node:fs";
import { resolve, join } from "node:path";

type UrlEntry = { path: string; source: string; origin?: string };

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
const INVENTORY = resolve(OUT_DIR, "url-inventory.json");

const args = process.argv.slice(2);
function arg(name: string, def?: string): string | undefined {
  const idx = args.indexOf(name);
  return idx >= 0 ? args[idx + 1] : def;
}

const BASE = arg("--base", "http://localhost:3000")!;
const SAMPLE = parseInt(arg("--sample", "300")!, 10);
const CONCURRENCY = parseInt(arg("--concurrency", "3")!, 10);
const TIMEOUT_MS = parseInt(arg("--timeout", "15000")!, 10);

const HEADERS = {
  "User-Agent":
    "MarginAtlas-Audit/1.0 (page-fill scorer; +https://www.marginatlas.com)",
  "Accept-Language": "en-US,en;q=0.9",
  Accept: "text/html,*/*;q=0.8",
};

function detectSection(html: string, id: Section): boolean {
  // Two reasonable matches: <section id="X" ...> and <div id="X" ...>.
  // Use anchored regex to avoid matching inside attributes or comments.
  const re = new RegExp(
    `<(?:section|div)\\s+[^>]*id=["']${id}["']`,
    "i",
  );
  return re.test(html);
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

function isCellPath(p: string): boolean {
  if (!p.startsWith("/")) return false;
  const parts = p.split("/").filter(Boolean);
  if (parts.length !== 3) return false;
  // Excludes /[country]/industries hubs and /[country]/[geo]/industries hubs.
  if (parts[1] === "industries") return false;
  if (parts[2] === "industries") return false;
  // Skip /coverage, /sectors, /world, /you etc.
  if (parts[0].length !== 2) return false;
  return true;
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
  if (!existsSync(INVENTORY)) {
    console.error(
      `✗ Inventory missing at ${INVENTORY}. Run enumerate_urls.ts first.`,
    );
    process.exit(1);
  }
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  if (!existsSync(QUALITY_DIR)) mkdirSync(QUALITY_DIR, { recursive: true });

  const inv = JSON.parse(readFileSync(INVENTORY, "utf-8")) as UrlEntry[];
  const cellUrls = inv.filter((u) => isCellPath(u.path));
  console.log(
    `Inventory: ${inv.length} URLs total, ${cellUrls.length} are cell pages.`,
  );

  const picked = sample(cellUrls, SAMPLE);
  console.log(`Sampling ${picked.length} cell URLs (every ${(cellUrls.length / picked.length).toFixed(1)}th).`);
  console.log(`Probing against ${BASE} at concurrency=${CONCURRENCY}.\n`);

  const results = await runWithConcurrency(
    picked.map((u) => u.path),
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
      if (done % 25 === 0 || r.classification !== "ok") {
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
  console.log(`  ok           : ${counters.ok}`);
  console.log(`  thin         : ${counters.thin}`);
  console.log(`  missing-core : ${counters["missing-core"]}`);
  console.log(`  broken       : ${counters.broken}`);

  // Build markdown report
  const md: string[] = [];
  md.push("# Page-fill audit (Plan v24 Block 5)");
  md.push("");
  md.push(`Generated ${new Date().toISOString()} against ${BASE}.`);
  md.push("");
  md.push(`Sample: ${picked.length} of ${cellUrls.length} cell URLs.`);
  md.push("");
  md.push("## Summary");
  md.push("");
  md.push(`- ok: **${counters.ok}** (${((counters.ok / results.length) * 100).toFixed(1)}%)`);
  md.push(`- thin: **${counters.thin}** (fill_score < 0.5 but core sections present)`);
  md.push(`- missing-core: **${counters["missing-core"]}** (revenue-tiles not rendered)`);
  md.push(`- broken: **${counters.broken}** (HTTP non-200)`);
  md.push("");
  md.push("## Section-presence breakdown");
  md.push("");
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
  for (const [s, n] of Object.entries(sectionCounts)) {
    const pct = ((n / results.length) * 100).toFixed(1);
    md.push(`- ${s}: ${n} (${pct}%)`);
  }
  md.push("");
  md.push("## First 30 thin/missing/broken URLs");
  md.push("");
  for (const r of thin.slice(0, 30)) {
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
  console.log(`→ ${join(QUALITY_DIR, "thin_pages_v1.json")} (${thinUrls.length} URLs suppressed)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
