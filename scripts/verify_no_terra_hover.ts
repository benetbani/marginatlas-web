/**
 * scripts/verify_no_terra_hover.ts
 *
 * NO TERRACOTTA ON A HOVER (milestone 3, masterplan step 36; MODEL.md PART 6: "TERRACOTTA NEVER APPEARS on ... a hover state";
 * specified in E:/atlas/design/loop/build/goal-2026-10-02/FLOW.md, "found on the way", and never built until now). Reads every
 * source file under src/components/spine for a `hover:` or `group-hover:` utility that names a terracotta token: the spine's
 * `--terra` variables, or the brand's `atlas-` ramp (atlas-700 is the brand red). A ratchet, per file, seeded at the count of
 * 2026-10-05 for the older views (kit.tsx's plus, BarList's rows, the country page's rail, the pager, the atlas index) and at zero
 * for every file not in the seed, the home page among them; a count only falls.
 *
 * BLIND SPOT, stated: it reads class strings in source, so a hover colour set in a stylesheet (globals.css) or composed at run
 * time from parts passes; the spine's hovers are utilities today.
 *
 *   npx tsx scripts/verify_no_terra_hover.ts [--write-baseline]
 */
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { stripCommentLines } from "./lib/strip_comments";
import { red, redSummary } from "./lib/red";

const RULE = "no-terra-hover";
const ROOT = "src/components/spine";
const BASELINE = "scripts/no_terra_hover_baseline.json";
const REMEDY = "hover in ink (var(--c-ink) or var(--c-ink2)), never in terracotta (MODEL.md PART 6)";
const HOVER = /(?:^|[\s"'`{])(?:group-)?hover:[^\s"'`}]*(?:--terra|atlas-\d)/g;

const files: string[] = [];
const walk = (dir: string) => {
  for (const n of readdirSync(dir).sort()) {
    const p = join(dir, n).replace(/\\/g, "/");
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|mjs)$/.test(n)) files.push(p);
  }
};
walk(ROOT);

const counts: Record<string, number> = {};
const where: Record<string, string[]> = {};
for (const f of files) {
  const code = stripCommentLines(readFileSync(f, "utf8").split("\n"));
  code.forEach((line, i) => {
    for (const m of line.matchAll(HOVER)) {
      counts[f] = (counts[f] ?? 0) + 1;
      (where[f] ||= []).push(`${f}:${i + 1} ${m[0].trim()}`);
    }
  });
}

const stored: Record<string, number> = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")).files ?? {} : {};
if (process.argv.includes("--write-baseline")) {
  const raised = Object.keys(counts).filter((f) => existsSync(BASELINE) && (counts[f] ?? 0) > (stored[f] ?? 0));
  if (raised.length) { console.error(`x ${RULE}: --write-baseline refused, these files would rise: ${raised.join(", ")}`); process.exit(1); }
  const body = { why: "Terracotta on a hover state per file under src/components/spine, seeded 2026-10-05 (masterplan step 36); only falls. A file not listed holds zero.", files: Object.fromEntries(Object.entries(counts).sort()) };
  writeFileSync(BASELINE, JSON.stringify(body, null, 2) + "\n", "utf8");
  console.log(`${RULE}: baseline written, ${Object.values(counts).reduce((a, b) => a + b, 0)} hover(s) in ${Object.keys(counts).length} file(s)`);
  process.exit(0);
}

let failed = 0;
for (const f of files) {
  const n = counts[f] ?? 0;
  const base = stored[f] ?? 0;
  if (n > base) {
    failed++;
    red({ rule: RULE, file: f, detail: `${n} terracotta hover(s) against a baseline of ${base}: ${(where[f] ?? []).slice(0, 3).join("; ")}`, remedy: REMEDY });
  }
}
const total = Object.values(counts).reduce((a, b) => a + b, 0);
const fell = Object.keys(stored).filter((f) => (counts[f] ?? 0) < stored[f]);
if (failed > 0) { redSummary(RULE, failed, REMEDY, "files over their baseline"); process.exit(1); }
console.log(`PASS ${RULE}: ${total} terracotta hover(s) in ${Object.keys(counts).length} file(s), none over its baseline${fell.length ? `; fell in ${fell.join(", ")} (run with --write-baseline to lock it in)` : ""}`);
