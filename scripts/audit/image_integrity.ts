/**
 * Plan v24 Block 8 — image quality + integrity audit.
 *
 * Probes every URL in the image manifests with a HEAD request and
 * confirms:
 *   - HTTP 200 (or 200 after redirect)
 *   - Content-Type starts with "image/"
 *   - Content-Length is sane (rejects 0 byte and >25MB hero JPEGs)
 *
 * Manifests scanned:
 *   - data/images/cities_manifest.json
 *   - data/images/countries_manifest.json
 *   - data/images/industries_manifest.json
 *   - data/images/sectors_manifest.json
 *   - data/images/country_industry_v1.json (flat array variant)
 *
 * Outputs:
 *   data/audit/image_integrity_v1.json
 *   data/audit/image_integrity_REPORT.md
 *   data/quality/broken_images_v1.json (URLs to drop from manifests)
 *
 * Run: `npx tsx scripts/audit/image_integrity.ts --concurrency 6`
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "node:fs";
import { resolve, join } from "node:path";

const ROOT = process.cwd();
const IMAGES_DIR = resolve(ROOT, "data", "images");
const AUDIT_DIR = resolve(ROOT, "data", "audit");
const QUALITY_DIR = resolve(ROOT, "data", "quality");

const args = process.argv.slice(2);
function arg(name: string, def?: string): string | undefined {
  const idx = args.indexOf(name);
  return idx >= 0 ? args[idx + 1] : def;
}

const CONCURRENCY = parseInt(arg("--concurrency", "6")!, 10);
const TIMEOUT_MS = parseInt(arg("--timeout", "10000")!, 10);
// Wikimedia returns 429 above ~5 req/sec from a single UA. Pace politely.
const POLITE_DELAY_MS = parseInt(arg("--delay-ms", "300")!, 10);

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

type ImageEntry = {
  url: string;
  source?: string;
  attribution?: string;
  license?: string;
  width?: number;
  height?: number;
  description?: string;
};

type ProbeRow = {
  url: string;
  manifest: string;
  key: string;
  status: number;
  duration_ms: number;
  content_type: string;
  content_length: number | null;
  classification:
    | "ok"
    | "404"
    | "5xx"
    | "non-image"
    | "redirect-loop"
    | "timeout"
    | "oversized"
    | "empty"
    | "rate-limited";
};

async function probeOne(
  url: string,
  manifest: string,
  key: string,
): Promise<ProbeRow> {
  await new Promise((res) => setTimeout(res, POLITE_DELAY_MS));
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const start = Date.now();
  let status = 0;
  let contentType = "";
  let contentLength: number | null = null;
  try {
    let res = await fetch(url, {
      method: "HEAD",
      headers: HEADERS,
      redirect: "follow",
      signal: ctrl.signal,
    });
    status = res.status;
    contentType = res.headers.get("content-type") || "";
    const cl = res.headers.get("content-length");
    contentLength = cl ? parseInt(cl, 10) : null;
    // Some image CDNs (Wikipedia) reject HEAD; retry with GET if HEAD 4xx.
    if (status >= 400 && status !== 404) {
      res = await fetch(url, {
        method: "GET",
        headers: HEADERS,
        redirect: "follow",
        signal: ctrl.signal,
      });
      status = res.status;
      contentType = res.headers.get("content-type") || contentType;
      const cl2 = res.headers.get("content-length");
      contentLength = cl2 ? parseInt(cl2, 10) : contentLength;
      // Drain body to release the connection.
      void (await res.arrayBuffer());
    }
  } catch {
    status = 0;
  } finally {
    clearTimeout(t);
  }
  const duration_ms = Date.now() - start;

  let classification: ProbeRow["classification"];
  if (status === 0) classification = "timeout";
  else if (status === 429) classification = "rate-limited";
  else if (status === 404) classification = "404";
  else if (status >= 500) classification = "5xx";
  else if (status >= 300 && status < 400) classification = "redirect-loop";
  else if (status >= 400) classification = "404"; // group 4xx other than 429
  else if (!contentType.startsWith("image/")) classification = "non-image";
  else if (contentLength === 0) classification = "empty";
  else if (contentLength != null && contentLength > 25_000_000)
    classification = "oversized";
  else classification = "ok";

  return {
    url,
    manifest,
    key,
    status,
    duration_ms,
    content_type: contentType,
    content_length: contentLength,
    classification,
  };
}

async function runWithConcurrency<T, R>(
  items: T[],
  worker: (item: T) => Promise<R>,
  concurrency: number,
  onProgress?: (done: number, total: number, r: R) => void,
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
      onProgress?.(done, items.length, results[i]);
    }
  });
  await Promise.all(runners);
  return results;
}

function flattenManifest(
  manifestName: string,
  data: unknown,
): Array<{ url: string; manifest: string; key: string }> {
  const out: Array<{ url: string; manifest: string; key: string }> = [];
  if (Array.isArray(data)) {
    for (const e of data as ImageEntry[]) {
      if (e?.url) out.push({ url: e.url, manifest: manifestName, key: "" });
    }
    return out;
  }
  if (data && typeof data === "object") {
    for (const [key, val] of Object.entries(
      data as Record<string, unknown>,
    )) {
      if (Array.isArray(val)) {
        for (const e of val as ImageEntry[]) {
          if (e?.url) out.push({ url: e.url, manifest: manifestName, key });
        }
      }
    }
  }
  return out;
}

async function main() {
  if (!existsSync(AUDIT_DIR)) mkdirSync(AUDIT_DIR, { recursive: true });
  if (!existsSync(QUALITY_DIR)) mkdirSync(QUALITY_DIR, { recursive: true });

  const manifests = [
    "cities_manifest.json",
    "countries_manifest.json",
    "industries_manifest.json",
    "sectors_manifest.json",
    "country_industry_v1.json",
  ];

  const allTargets: Array<{ url: string; manifest: string; key: string }> = [];
  for (const f of manifests) {
    const p = join(IMAGES_DIR, f);
    if (!existsSync(p)) {
      console.warn(`  WARN: ${f} missing — skipping`);
      continue;
    }
    const raw = readFileSync(p, "utf-8");
    const data = JSON.parse(raw);
    const entries = flattenManifest(f, data);
    console.log(`  ${f}: ${entries.length} URLs`);
    allTargets.push(...entries);
  }

  // Dedupe by URL — many manifests share identical Wikimedia images.
  const seen = new Map<string, { url: string; manifest: string; key: string }>();
  for (const t of allTargets) {
    if (!seen.has(t.url)) seen.set(t.url, t);
  }
  const targets = Array.from(seen.values());
  console.log(
    `\nDeduped: ${targets.length} unique URLs (from ${allTargets.length} entries).`,
  );
  console.log(`Probing at concurrency=${CONCURRENCY} (timeout=${TIMEOUT_MS}ms).\n`);

  const results = await runWithConcurrency(
    targets,
    (t) => probeOne(t.url, t.manifest, t.key),
    CONCURRENCY,
    (done, total, r) => {
      if (r.classification !== "ok") {
        console.log(`  [${done}/${total}] ${r.classification} ${r.status} ${r.url.slice(0, 80)}`);
      } else if (done % 100 === 0) {
        console.log(`  [${done}/${total}] ok`);
      }
    },
  );

  writeFileSync(
    join(AUDIT_DIR, "image_integrity_v1.json"),
    JSON.stringify(results, null, 2),
  );

  // Suppress only confidently-broken URLs. Rate-limited probes are
  // inconclusive and must not enter the cleanup list.
  const broken = results.filter(
    (r) => r.classification !== "ok" && r.classification !== "rate-limited",
  );
  const brokenUrls = broken.map((r) => r.url);
  writeFileSync(
    join(QUALITY_DIR, "broken_images_v1.json"),
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        urls: brokenUrls,
        // Keep details for the manifest-cleanup pass.
        entries: broken.map((r) => ({
          url: r.url,
          manifest: r.manifest,
          key: r.key,
          status: r.status,
          classification: r.classification,
        })),
      },
      null,
      2,
    ),
  );

  const counters: Record<ProbeRow["classification"], number> = {
    ok: 0,
    "404": 0,
    "5xx": 0,
    "non-image": 0,
    "redirect-loop": 0,
    timeout: 0,
    oversized: 0,
    empty: 0,
    "rate-limited": 0,
  };
  for (const r of results) counters[r.classification]++;

  console.log("\n=== Summary ===");
  for (const [k, v] of Object.entries(counters)) {
    if (v > 0)
      console.log(`  ${k.padEnd(14)}: ${v} (${((v / results.length) * 100).toFixed(1)}%)`);
  }

  // Group broken by manifest for the report.
  const byManifest: Record<string, ProbeRow[]> = {};
  for (const r of broken) {
    if (!byManifest[r.manifest]) byManifest[r.manifest] = [];
    byManifest[r.manifest].push(r);
  }

  const md: string[] = [];
  md.push("# Image integrity audit (Plan v24 Block 8)");
  md.push("");
  md.push(`Generated ${new Date().toISOString()}.`);
  md.push("");
  md.push(`Probed ${results.length} unique image URLs across ${manifests.length} manifests.`);
  md.push("");
  md.push("## Summary");
  md.push("");
  for (const [k, v] of Object.entries(counters)) {
    if (v > 0)
      md.push(`- ${k}: **${v}** (${((v / results.length) * 100).toFixed(1)}%)`);
  }
  md.push("");
  md.push("## Broken by manifest");
  md.push("");
  for (const [m, rows] of Object.entries(byManifest)) {
    md.push(`### ${m}`);
    md.push("");
    md.push(`${rows.length} broken entries.`);
    md.push("");
    for (const r of rows.slice(0, 25)) {
      md.push(
        `- ${r.classification} (HTTP ${r.status}): \`${r.key || "(flat)"}\` ${r.url.slice(0, 100)}`,
      );
    }
    if (rows.length > 25) md.push(`- … and ${rows.length - 25} more`);
    md.push("");
  }
  md.push("## Cleanup mechanism");
  md.push("");
  md.push(
    "Broken URLs are listed in `data/quality/broken_images_v1.json`. " +
      "A future block should add a render-layer filter that excludes any " +
      "image whose URL appears in that list. Until then the audit data " +
      "is purely diagnostic.",
  );
  md.push("");
  writeFileSync(join(AUDIT_DIR, "image_integrity_REPORT.md"), md.join("\n"));

  console.log(`\n→ ${join(AUDIT_DIR, "image_integrity_v1.json")}`);
  console.log(`→ ${join(AUDIT_DIR, "image_integrity_REPORT.md")}`);
  console.log(`→ ${join(QUALITY_DIR, "broken_images_v1.json")} (${brokenUrls.length} URLs)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
