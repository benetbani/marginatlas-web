/**
 * Plan v17 Phase 1.2 — HTTP prober.
 *
 * Reads data/audit/url-inventory.json, probes each URL against a target
 * base, and writes data/audit/probe-results.json with per-URL status +
 * timing + classification.
 *
 * Run: `npx tsx scripts/audit/probe_urls.ts --base https://www.marginatlas.com`
 *      `npx tsx scripts/audit/probe_urls.ts --base http://localhost:3000 --strict`
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

type Url = { path: string; source: string; origin?: string };
type Classification =
  | "ok"
  | "slow"
  | "empty"
  | "not-found"
  | "server-error"
  | "redirect-loop"
  | "timeout"
  | "blocked";
type Result = {
  path: string;
  source: string;
  origin?: string;
  status: number;
  duration_ms: number;
  content_length: number;
  has_h1: boolean;
  classification: Classification;
  error_snippet?: string;
};

const ROOT = process.cwd();
const OUT_DIR = resolve(ROOT, "data", "audit");
const INVENTORY = resolve(OUT_DIR, "url-inventory.json");

const args = process.argv.slice(2);
function arg(name: string, def?: string): string | undefined {
  const idx = args.indexOf(name);
  return idx >= 0 ? args[idx + 1] : def;
}
function flag(name: string): boolean {
  return args.includes(name);
}

const BASE = arg("--base", "http://localhost:3000")!;
const STRICT = flag("--strict");
const CONCURRENCY = parseInt(arg("--concurrency", "4")!, 10);
const TIMEOUT_MS = parseInt(arg("--timeout", "10000")!, 10);
const SLOW_THRESHOLD_MS = parseInt(arg("--slow-ms", "1500")!, 10);

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Accept: "text/html,application/json,*/*;q=0.8",
};

const ERROR_MARKERS = [
  "Application error",
  "<title>500</title>",
  "This page could not be found",
  "ERR_",
  "Internal Server Error",
];

function classify(r: Omit<Result, "classification">): Classification {
  if (r.status === 0) return "timeout";
  if (r.status === 403 || r.status === 451) return "blocked";
  if (r.status === 404) return "not-found";
  if (r.status >= 500) return "server-error";
  if (r.status >= 300 && r.status < 400) return "redirect-loop"; // we follow; if we end up here we got 30x in final response
  if (r.duration_ms > TIMEOUT_MS) return "timeout";
  if (r.content_length < 1024 && !r.path.startsWith("/api/")) return "empty";
  if (!r.has_h1 && !r.path.startsWith("/api/") && !r.path.endsWith(".xml") && !r.path.endsWith(".txt"))
    return "empty";
  if (r.duration_ms > SLOW_THRESHOLD_MS) return "slow";
  return "ok";
}

async function probe(u: Url): Promise<Result> {
  const url = BASE.replace(/\/$/, "") + u.path;
  const isApi = u.path.startsWith("/api/");
  const method = u.path === "/api/newsletter" || u.path === "/api/ask" ? "POST" : "GET";

  const body = method === "POST"
    ? u.path === "/api/ask"
      ? JSON.stringify({ question: "audit probe ping" })
      : JSON.stringify({ email: "audit@marginatlas.test" })
    : undefined;

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const start = Date.now();
  let status = 0;
  let text = "";
  try {
    const res = await fetch(url, {
      method,
      headers: { ...HEADERS, ...(body ? { "Content-Type": "application/json" } : {}) },
      body,
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
  const errSnippet = ERROR_MARKERS.find((m) => text.includes(m));
  const partial: Omit<Result, "classification"> = {
    path: u.path,
    source: u.source,
    origin: u.origin,
    status,
    duration_ms,
    content_length,
    has_h1,
    error_snippet: errSnippet,
  };
  return { ...partial, classification: classify(partial) };
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

async function main() {
  if (!existsSync(INVENTORY)) {
    console.error(`✗ Inventory missing at ${INVENTORY}. Run enumerate_urls.ts first.`);
    process.exit(1);
  }
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  const inv = JSON.parse(readFileSync(INVENTORY, "utf-8")) as Url[];
  console.log(`Probing ${inv.length} URLs against ${BASE}…`);
  const results = await runWithConcurrency(inv, probe, CONCURRENCY, (done, total, item, r) => {
    const icon =
      r.classification === "ok" ? "✓" :
      r.classification === "slow" ? "~" :
      r.classification === "blocked" ? "▢" : "✗";
    if (done % 25 === 0 || r.classification !== "ok") {
      console.log(`  [${done}/${total}] ${icon} ${r.status} ${r.duration_ms}ms ${item.path}`);
    }
  });
  const outPath = join(OUT_DIR, "probe-results.json");
  writeFileSync(outPath, JSON.stringify(results, null, 2));

  const counters: Record<Classification, number> = {
    ok: 0, slow: 0, empty: 0, "not-found": 0, "server-error": 0, "redirect-loop": 0, timeout: 0, blocked: 0,
  };
  for (const r of results) counters[r.classification]++;
  console.log("\n=== Summary ===");
  for (const [k, v] of Object.entries(counters)) {
    if (v > 0) console.log(`  ${k}: ${v}`);
  }

  const failing = results.filter(
    (r) => r.classification !== "ok" && r.classification !== "slow" && r.classification !== "blocked",
  );
  if (STRICT && failing.length > 0) {
    console.error(`\n✗ Strict mode: ${failing.length} non-ok results.`);
    for (const f of failing.slice(0, 20)) {
      console.error(`  ${f.classification}: ${f.path} (HTTP ${f.status}, ${f.duration_ms}ms)`);
    }
    process.exit(1);
  }
}

main();
