/**
 * Plan v24 Block 5 — page-fill audit driven by Supabase.
 *
 * The production sitemap.xml is unreachable (the `/[country]` catch-all
 * intercepts /sitemap.xml; tracked separately under Block 11). This
 * variant pulls a representative cell sample directly from Supabase
 * using the same selection rule as the sitemap (top regional + manual
 * cities × top industries) and runs section-presence scoring.
 *
 * Outputs (overwriting the page_fill_from_sitemap.ts paths so the
 * downstream sitemap integration uses the freshest list):
 *   - data/audit/page_fill_v1.json
 *   - data/audit/page_fill_REPORT.md
 *   - data/quality/thin_pages_v1.json
 *
 * Run: `npx tsx scripts/audit/page_fill_from_supabase.ts \
 *        --base https://www.marginatlas.com --sample 200`
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { MANUAL_CITY_ALIASES } from "../../src/lib/cities/manual_city_aliases";

config({ path: resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const client = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

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

// `related-cells` only renders for US state cells (getComparableCells
// short-circuits otherwise). `narrative` only renders when an industry
// has a copywritten anchor — many sectors don't yet. For non-US paths
// we score against the core required sections.
const CORE_SECTIONS: Section[] = [
  "revenue-tiles",
  "tax-and-cost-panel",
  "revenue-distribution",
  "across-states",
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
  classification: "ok" | "thin" | "missing-core" | "broken" | "rate-limited";
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
const SAMPLE = parseInt(arg("--sample", "200")!, 10);
const CONCURRENCY = parseInt(arg("--concurrency", "3")!, 10);
const TIMEOUT_MS = parseInt(arg("--timeout", "20000")!, 10);

const HEADERS = {
  // Browser UA — the anti-scrape middleware 403s tool UAs on cell paths.
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Accept: "text/html,*/*;q=0.8",
};

function detectSection(html: string, id: Section): boolean {
  const re = new RegExp(
    `<(?:section|div)\\s+[^>]*id=["']${id}["']`,
    "i",
  );
  return re.test(html);
}

const POLITE_DELAY_MS = parseInt(arg("--delay-ms", "1100")!, 10);

async function probe(path: string): Promise<FillRow> {
  // Polite pacing — middleware caps at 60 req/min per IP.
  await new Promise((res) => setTimeout(res, POLITE_DELAY_MS));
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
  // Score against core sections (always required) to avoid penalising
  // non-US pages for legitimately absent related-cells / narrative.
  const corePresent = CORE_SECTIONS.filter((s) => present.includes(s));
  const fill_score = corePresent.length / CORE_SECTIONS.length;
  let classification: FillRow["classification"];
  if (status === 429) classification = "rate-limited";
  else if (status !== 200) classification = "broken";
  else if (!present.includes("revenue-tiles")) classification = "missing-core";
  else if (fill_score < 0.75) classification = "thin";
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

// Top industry slugs verified to exist in `src/lib/taxonomy/industries.json`.
// "retail-trade", "real-estate", "professional-services", "wholesale-trade"
// are not industries themselves — they're sector groupings. The audit needs
// concrete industry slugs that map to real cells.
const TOP_INDUSTRIES = [
  "restaurants",
  "residential-construction",
  "grocery-stores",
  "hairdressers-beauty",
  "legal-services",
  "auto-repair",
];

async function sampleFromSupabase(target: number): Promise<string[]> {
  // 1. Manual city aliases (top European/Asian cities) × top industries.
  const cityPaths: string[] = [];
  for (const [country, entries] of Object.entries(MANUAL_CITY_ALIASES)) {
    for (const e of entries) {
      for (const ind of TOP_INDUSTRIES.slice(0, 3)) {
        cityPaths.push(`/${country.toLowerCase()}/${e.slug}/${ind}`);
      }
    }
  }

  // 2. Top regional cells (ranked by enterprise count) — broader coverage.
  const { data: regional, error } = await client
    .from("regional_cells")
    .select("country, geo_id, industry_id, n_enterprises, quality_score")
    .gte("n_enterprises", 50)
    .gte("quality_score", 40)
    .order("n_enterprises", { ascending: false, nullsFirst: false })
    .limit(Math.max(target * 3, 500));
  if (error || !regional) {
    console.warn(`  WARN: regional pull failed: ${error?.message}`);
  }
  const regionalPaths: string[] = [];
  for (const r of regional || []) {
    const c = ((r.country as string) || "").toLowerCase();
    const g = ((r.geo_id as string) || "").toLowerCase();
    const i = ((r.industry_id as string) || "").replace(/_/g, "-");
    if (c && g && i) regionalPaths.push(`/${c}/${g}/${i}`);
  }

  // 3. Top US state cells.
  const { data: us } = await client
    .from("cells_master")
    .select("country, geo_id, naics_6, industry_description, n")
    .eq("country", "US")
    .order("n", { ascending: false, nullsFirst: false })
    .limit(300);
  const usPaths: string[] = [];
  for (const r of us || []) {
    // Take a few canonical pairs.
    const state = (r.geo_id as string) || "";
    const ind = ((r.industry_description as string) || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (state.startsWith("US-") && ind.length > 0) {
      // We don't know the URL slug for state without lookup; use industry-key
      // approximation. Better: pair with major state slugs directly.
      usPaths.push(`/us/california/${ind}`);
      usPaths.push(`/us/texas/${ind}`);
      usPaths.push(`/us/new-york/${ind}`);
    }
  }

  // Deduplicate, then sample evenly across the three slices.
  const all = Array.from(
    new Set([...cityPaths, ...regionalPaths, ...usPaths.slice(0, 100)]),
  );
  console.log(
    `  city × top-industry: ${cityPaths.length} | regional: ${regionalPaths.length} | us-state: ${Math.min(usPaths.length, 100)}`,
  );
  console.log(`  total unique: ${all.length}`);

  if (all.length <= target) return all;
  const step = all.length / target;
  return Array.from({ length: target }, (_, i) => all[Math.floor(i * step)]);
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  if (!existsSync(QUALITY_DIR)) mkdirSync(QUALITY_DIR, { recursive: true });

  console.log("Sampling cell URLs from Supabase…");
  const picked = await sampleFromSupabase(SAMPLE);
  console.log(`Probing ${picked.length} URLs against ${BASE} (concurrency=${CONCURRENCY}).\n`);

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
      if (done % 25 === 0 || r.classification !== "ok") {
        console.log(
          `  [${done}/${total}] ${icon} ${r.classification} score=${r.fill_score.toFixed(2)} ${r.path}`,
        );
      }
    },
  );

  const outPath = join(OUT_DIR, "page_fill_v1.json");
  writeFileSync(outPath, JSON.stringify(results, null, 2));

  // Only suppress confidently-thin pages. Rate-limited probes are
  // inconclusive — never suppress on them.
  const thin = results.filter(
    (r) =>
      r.classification === "thin" ||
      r.classification === "missing-core" ||
      r.classification === "broken",
  );
  const thinUrls = thin.map((r) => r.path);
  writeFileSync(
    join(QUALITY_DIR, "thin_pages_v1.json"),
    JSON.stringify(
      { generated_at: new Date().toISOString(), paths: thinUrls },
      null,
      2,
    ),
  );

  const counters: Record<FillRow["classification"], number> = {
    ok: 0,
    thin: 0,
    "missing-core": 0,
    broken: 0,
    "rate-limited": 0,
  };
  for (const r of results) counters[r.classification]++;

  console.log("\n=== Summary ===");
  for (const [k, v] of Object.entries(counters)) {
    if (v > 0)
      console.log(
        `  ${k.padEnd(13)}: ${v} (${((v / results.length) * 100).toFixed(1)}%)`,
      );
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

  const md: string[] = [];
  md.push("# Page-fill audit (Plan v24 Block 5)");
  md.push("");
  md.push(`Generated ${new Date().toISOString()} against ${BASE}.`);
  md.push("");
  md.push(
    `Sample: ${picked.length} cell URLs drawn from Supabase (manual cities × top industries + top regional_cells + top US states).`,
  );
  md.push("");
  md.push("## Summary");
  md.push("");
  for (const [k, v] of Object.entries(counters)) {
    md.push(
      `- ${k}: **${v}** (${((v / results.length) * 100).toFixed(1)}%)`,
    );
  }
  md.push("");
  md.push("## Section presence");
  md.push("");
  for (const [s, n] of Object.entries(sectionCounts)) {
    const pct = ((n / results.length) * 100).toFixed(1);
    md.push(`- ${s}: ${n} (${pct}%)`);
  }
  md.push("");
  md.push("## First 50 thin / missing / broken URLs");
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
  md.push("- `src/app/sitemap.ts` reads via `isPathSuppressed()` at build time");
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
