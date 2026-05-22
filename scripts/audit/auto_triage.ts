/**
 * Plan v24 Block 1.3.d — auto-triage suppress for severity-high anomalies.
 *
 * Reads:
 *   data/quality/scale_anomalies_v1.json (from Block 1.1)
 *
 * Writes:
 *   data/quality/cell_triage_v1.json — { entries: [{ key, decision, ... }] }
 *   data/quality/triage_preview_REPORT.md — human-readable preview
 *
 * Auto-decision rules:
 *   - severity >= 2 (≥ 100x out of bounds) → suppress
 *   - severity in [1, 2) (10x-100x) → review (founder decides via UI)
 *   - severity < 1 (within 10x) → keep (likely false positive)
 *
 * Resume-friendly: if cell_triage_v1.json exists, existing decisions
 * are preserved; new anomalies get auto-classified.
 *
 * Run: `npx tsx scripts/audit/auto_triage.ts`
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = process.cwd();
const OUT_DIR = resolve(ROOT, "data", "quality");

const SEV_SUPPRESS = 2.0;
const SEV_REVIEW = 1.0;

type Anomaly = {
  table: string;
  country: string;
  geo_id: string;
  geo_name: string | null;
  industry_id: string;
  field: string;
  value: number;
  bound_lo: number;
  bound_hi: number;
  reason: string;
  verdict: "too-low" | "too-high";
  severity: number;
};

type TriageDecision = "suppress" | "override" | "keep" | "review";

type TriageEntry = {
  /** Composite key: `${country}|${geo_id}|${industry_id}|${field}` */
  key: string;
  country: string;
  geo_id: string;
  industry_id: string;
  field: string;
  value: number;
  severity: number;
  decision: TriageDecision;
  decided_by: "auto" | "founder";
  reasoning: string;
  override_value?: number;
  timestamp: string;
};

function entryKey(a: Anomaly): string {
  return `${a.country}|${a.geo_id}|${a.industry_id}|${a.field}`;
}

function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  const anomaliesPath = join(OUT_DIR, "scale_anomalies_v1.json");
  if (!existsSync(anomaliesPath)) {
    console.error("✗ Run scale_sanity.ts first to generate scale_anomalies_v1.json");
    process.exit(1);
  }

  const anomalies = (
    JSON.parse(readFileSync(anomaliesPath, "utf-8")) as { anomalies: Anomaly[] }
  ).anomalies;

  // Load existing triage decisions, if any
  const triagePath = join(OUT_DIR, "cell_triage_v1.json");
  const existing = new Map<string, TriageEntry>();
  if (existsSync(triagePath)) {
    const data = JSON.parse(readFileSync(triagePath, "utf-8")) as { entries: TriageEntry[] };
    for (const e of data.entries) existing.set(e.key, e);
  }

  // For each anomaly, auto-classify if not already decided
  const now = new Date().toISOString();
  let newAuto = 0;
  let kept = 0;
  for (const a of anomalies) {
    const key = entryKey(a);
    if (existing.has(key)) {
      kept++;
      continue;
    }
    let decision: TriageDecision;
    let reasoning: string;
    if (a.severity >= SEV_SUPPRESS) {
      decision = "suppress";
      reasoning = `Severity ${a.severity.toFixed(2)} ≥ ${SEV_SUPPRESS}; ${a.field}=${a.value} is ${Math.pow(10, a.severity).toFixed(0)}x outside the bound. Auto-suppressed.`;
    } else if (a.severity >= SEV_REVIEW) {
      decision = "review";
      reasoning = `Severity ${a.severity.toFixed(2)}; in the review zone. Founder decides.`;
    } else {
      decision = "keep";
      reasoning = `Severity ${a.severity.toFixed(2)}; within ${Math.pow(10, a.severity).toFixed(1)}x of the bound. Likely false positive.`;
    }
    existing.set(key, {
      key,
      country: a.country,
      geo_id: a.geo_id,
      industry_id: a.industry_id,
      field: a.field,
      value: a.value,
      severity: a.severity,
      decision,
      decided_by: "auto",
      reasoning,
      timestamp: now,
    });
    newAuto++;
  }

  const entries = Array.from(existing.values()).sort((a, b) => b.severity - a.severity);
  writeFileSync(
    triagePath,
    JSON.stringify(
      { generated_at: now, total: entries.length, entries },
      null,
      2,
    ),
  );

  // Report
  const byDecision: Record<TriageDecision, number> = {
    suppress: 0,
    override: 0,
    keep: 0,
    review: 0,
  };
  for (const e of entries) byDecision[e.decision]++;

  const lines: string[] = [];
  lines.push("# Triage preview (Plan v24 Block 1.3)");
  lines.push("");
  lines.push(`Total triage decisions: ${entries.length}`);
  lines.push(`New auto-classifications this run: ${newAuto}`);
  lines.push(`Pre-existing decisions kept: ${kept}`);
  lines.push("");
  lines.push("## Decisions");
  lines.push("");
  lines.push("| Decision | Count | Rule |");
  lines.push("|---|---|---|");
  lines.push(`| suppress | ${byDecision.suppress} | Severity ≥ ${SEV_SUPPRESS} (auto) |`);
  lines.push(`| review | ${byDecision.review} | Severity in [${SEV_REVIEW}, ${SEV_SUPPRESS}) (founder decides) |`);
  lines.push(`| keep | ${byDecision.keep} | Severity < ${SEV_REVIEW} (likely false positive) |`);
  lines.push(`| override | ${byDecision.override} | Manual override applied |`);
  lines.push("");

  // Top 30 of each decision
  const suppress = entries.filter((e) => e.decision === "suppress").slice(0, 30);
  if (suppress.length > 0) {
    lines.push(`## Top ${Math.min(30, byDecision.suppress)} of ${byDecision.suppress} suppressions`);
    lines.push("");
    lines.push("| country | geo_id | industry_id | field | value | severity |");
    lines.push("|---|---|---|---|---|---|");
    for (const e of suppress) {
      const val =
        e.value > 1e9
          ? `$${(e.value / 1e9).toFixed(2)}B`
          : e.value > 1e6
          ? `$${(e.value / 1e6).toFixed(2)}M`
          : e.value > 1e3
          ? `$${(e.value / 1e3).toFixed(0)}K`
          : `$${e.value.toFixed(0)}`;
      lines.push(`| ${e.country} | ${e.geo_id} | ${e.industry_id} | ${e.field} | ${val} | ${e.severity.toFixed(2)} |`);
    }
    lines.push("");
  }

  writeFileSync(join(OUT_DIR, "triage_preview_REPORT.md"), lines.join("\n"));

  console.log(`✓ Wrote ${triagePath}`);
  console.log(`  Total entries: ${entries.length}`);
  console.log(`  Suppress: ${byDecision.suppress} | Review: ${byDecision.review} | Keep: ${byDecision.keep}`);
}

main();
