/**
 * Plan v17 Phase 1.3 — Report generator.
 *
 * Reads data/audit/probe-results.json and writes a human-readable
 * markdown report at data/audit/REPORT.md.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

type Classification =
  | "ok" | "slow" | "empty" | "not-found" | "server-error"
  | "redirect-loop" | "timeout" | "blocked";

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

const OUT_DIR = resolve(process.cwd(), "data", "audit");
const RESULTS = join(OUT_DIR, "probe-results.json");
const REPORT = join(OUT_DIR, "REPORT.md");

function main() {
  if (!existsSync(RESULTS)) {
    console.error(`✗ probe-results.json missing. Run probe_urls.ts first.`);
    process.exit(1);
  }
  const results = JSON.parse(readFileSync(RESULTS, "utf-8")) as Result[];
  const total = results.length;
  const counters: Record<Classification, number> = {
    ok: 0, slow: 0, empty: 0, "not-found": 0, "server-error": 0, "redirect-loop": 0, timeout: 0, blocked: 0,
  };
  for (const r of results) counters[r.classification]++;

  const slow = results
    .filter((r) => r.classification === "slow" || r.classification === "ok")
    .sort((a, b) => b.duration_ms - a.duration_ms)
    .slice(0, 20);

  const failing = results.filter(
    (r) => r.classification !== "ok" && r.classification !== "slow" && r.classification !== "blocked",
  );

  const lines: string[] = [];
  lines.push(`# Audit report`);
  lines.push("");
  lines.push(`Probed ${total} URLs.`);
  lines.push("");
  lines.push(`## Summary`);
  lines.push("");
  lines.push(`| Class | Count |`);
  lines.push(`|---|---|`);
  for (const [k, v] of Object.entries(counters)) {
    if (v > 0) lines.push(`| ${k} | ${v} |`);
  }
  lines.push("");

  lines.push(`## Top 20 slowest URLs`);
  lines.push("");
  lines.push(`| ms | status | path |`);
  lines.push(`|---|---|---|`);
  for (const r of slow) {
    lines.push(`| ${r.duration_ms} | ${r.status} | \`${r.path}\` |`);
  }
  lines.push("");

  if (failing.length > 0) {
    lines.push(`## Failures (${failing.length})`);
    lines.push("");
    for (const c of ["server-error", "not-found", "empty", "timeout", "redirect-loop"] as const) {
      const group = failing.filter((r) => r.classification === c);
      if (group.length === 0) continue;
      lines.push(`### ${c} (${group.length})`);
      lines.push("");
      lines.push(`| path | status | ms | content | h1? | origin |`);
      lines.push(`|---|---|---|---|---|---|`);
      for (const r of group) {
        lines.push(
          `| \`${r.path}\` | ${r.status} | ${r.duration_ms} | ${r.content_length}B | ${r.has_h1 ? "y" : "n"} | ${r.origin ?? r.source} |`,
        );
      }
      lines.push("");
    }
  } else {
    lines.push(`## Failures`);
    lines.push("");
    lines.push(`None.`);
    lines.push("");
  }

  lines.push(`## Suggested actions`);
  lines.push("");
  if (counters["server-error"] > 0) {
    lines.push(`- **server-error**: read the route handler at the origin. Likely a Supabase query throwing or a missing env var. Wrap in try/catch with a fallback.`);
  }
  if (counters["not-found"] > 0) {
    lines.push(`- **not-found**: the page's data layer returned null. Either add the slug to PARENT_FALLBACK_MAP or change the link source to a valid slug.`);
  }
  if (counters["empty"] > 0) {
    lines.push(`- **empty**: page rendered but with no <h1> or under 1kB body. Likely a server component returned null or threw silently. Add a default render path.`);
  }
  if (counters["timeout"] > 0) {
    lines.push(`- **timeout**: Supabase query or external API stalled. Add a 5s timeout to the data layer and a fallback render path.`);
  }
  if (counters["slow"] > 0) {
    lines.push(`- **slow**: cacheable but not cached. Set \`Cache-Control: public, s-maxage=21600, stale-while-revalidate=86400\` or restore ISR via S-100.`);
  }
  lines.push("");

  writeFileSync(REPORT, lines.join("\n"));
  console.log(`✓ Report written to ${REPORT}`);
  console.log(`  ${total} probed | ${counters.ok} ok | ${counters.slow} slow | ${failing.length} failures`);
}

main();
