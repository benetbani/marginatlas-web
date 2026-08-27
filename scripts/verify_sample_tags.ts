/**
 * scripts/verify_sample_tags.ts
 *
 * Prebuild gate , rulebook v1 rule 4 (the honesty gate): "Anything modeled
 * or sampled carries a visible SampleTag. A modeled figure presented as
 * real is the worst defect in the system."
 *
 * For every seed JSON under src/lib/spine-seeds/ that carries a
 * `_meta.confidence` block (at any nesting depth) equal to "placeholder"
 * or "modeled", this resolves which component(s) render that seed and
 * asserts that AT LEAST ONE file in that render group references
 * `SampleTag` (import or JSX usage , a file-level check, not a
 * per-section one: the task's own resolution is heuristic and file-level
 * granularity is what "seedfile -> component" in the brief asks for).
 *
 * RESOLUTION (seed file -> render group), derived by grepping which
 * surface file imports each src/lib/spine-seeds/index.ts export
 * (spineCellSeed -> spine-cell/cell-view.tsx, spineCitySeed ->
 * spine-city/city-view.tsx, spineHoodSeed -> spine-hood/hood-view.tsx
 * (which itself imports and mounts NeighborhoodExplorer.tsx , included in
 * its render group), spineIndustrySeed -> spine-industry/industry-view.tsx,
 * SPINE_COUNTRIES -> src/components/spine/country/country-view.tsx). A render
 * group is every .tsx file in the same dev-route directory (mirrors
 * verify_bar_budget's per-page-type grouping), since a directory's
 * masthead/chapters/forms files commonly share one Movement/Head/Rail
 * `sample` convention.
 *
 * THE COUNTRIES MAPPING CHANGED 2026-08-28 (finding C1b), and it is worth
 * saying why it was wrong before. It used to point at the workshop preview,
 * src/app/dev/spine/page.tsx, which renders these same JSON seeds directly
 * and has always carried SampleTag, so this gate read PASS no matter what the
 * live country page would ever mark. The country page now has a real adapter
 * (src/lib/spine/adapt_country.ts) and a real body under src/components/spine,
 * so the render group this gate checks has to be the file that determines
 * what a reader sees, not a workshop file that never ships to one.
 *
 * A NEW seed file under an unrecognized subdirectory resolves to nothing
 * and is reported as a WARN (ambiguous), never silently skipped and never
 * a hard fail on a guess.
 *
 * Exemption: a line containing `// allow-unmarked: <reason>` ANYWHERE in
 * the render group's files suppresses the hard fail for that seed file
 * (reported as an accepted exemption, not silently dropped).
 *
 * SCOPE NOTE: only "placeholder" and "modeled" trigger this gate, per the
 * task brief's literal wording. A few seed sections carry a THIRD value,
 * "mixed" (part real, part carried-over illustrative , e.g. GB-london.json
 * trades._meta), which arguably also deserves a SampleTag under rule 4's
 * spirit but is intentionally out of scope here; widen SAMPLE_CONFIDENCES
 * below if the founder wants it included.
 *
 * Run: npx tsx scripts/verify_sample_tags.ts
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = process.cwd();
const SEEDS_ROOT = resolve(ROOT, "src", "lib", "spine-seeds");

/** Per the task brief's literal wording; see the SCOPE NOTE above re: "mixed". */
const SAMPLE_CONFIDENCES = new Set(["placeholder", "modeled"]);

function tsxIn(dir: string): string[] {
  const abs = resolve(ROOT, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => join(dir, f).replace(/\\/g, "/"));
}

/**
 * seed-file directory -> its render group. Filename-sensitive for the
 * cities/ directory, which holds both the city seed and the (differently
 * rendered) neighborhoods seed.
 *
 * THE GROUPS MOVED ON 2026-08-09 AND THIS GATE CAUGHT IT, correctly, by
 * failing. Four page bodies (cell, city, hood, industry) lived under
 * src/app/dev/ and were imported from there by live routes. They moved to
 * src/components/spine/<type>/ with their filenames intact. This resolver still
 * pointed at the old folders, which by then held only a layout.tsx and a
 * four-line page.tsx, so it correctly reported that nothing in the group
 * mentions SampleTag: the group it was looking at no longer rendered anything.
 *
 * BOTH LOCATIONS ARE LISTED rather than swapping one for the other. The dev
 * preview routes still exist and still render these page types for founder
 * review, and a group is "every file that could put this seed on a screen".
 * tsxIn() returns [] for a directory that does not exist, so a folder retiring
 * later costs nothing here.
 */
function resolveRenderGroup(seedRelPath: string): { label: string; files: string[] } | null {
  const parts = seedRelPath.split("/");
  const dir = parts[parts.length - 2];
  const base = parts[parts.length - 1];
  const group = (name: string, extra: string[] = []) => [
    ...tsxIn(`src/components/spine/${name}`),
    ...tsxIn(`src/app/dev/spine-${name}`),
    ...extra,
  ];
  if (dir === "cells") return { label: "spine-cell", files: group("cell") };
  if (dir === "cities" && base.includes("neighborhoods")) {
    return {
      label: "spine-hood",
      files: group("hood", ["src/components/spine/NeighborhoodExplorer.tsx"]),
    };
  }
  if (dir === "cities") return { label: "spine-city", files: group("city") };
  if (dir === "industries") return { label: "spine-industry", files: group("industry") };
  if (dir === "countries") {
    // Finding C1b (2026-08-28 review round). Points at the real body,
    // src/components/spine/country/country-view.tsx, not the workshop preview
    // that used to sit here. See the header note above for why the swap.
    return {
      label: "spine (country)",
      files: ["src/components/spine/country/country-view.tsx"],
    };
  }
  return null;
}

function walkSeedDir(dir: string, acc: string[] = []): string[] {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkSeedDir(p, acc);
    else if (p.endsWith(".json")) acc.push(p);
  }
  return acc;
}

/** True if any `_meta` object anywhere in the tree carries a triggering confidence. */
function hasSampleWorthyMeta(node: unknown): boolean {
  if (Array.isArray(node)) return node.some(hasSampleWorthyMeta);
  if (node && typeof node === "object") {
    const o = node as Record<string, unknown>;
    const meta = o["_meta"];
    if (meta && typeof meta === "object") {
      const confidence = (meta as Record<string, unknown>)["confidence"];
      if (typeof confidence === "string" && SAMPLE_CONFIDENCES.has(confidence)) return true;
    }
    for (const [key, value] of Object.entries(o)) {
      if (key === "_meta") continue; // already checked above
      if (hasSampleWorthyMeta(value)) return true;
    }
  }
  return false;
}

type Verdict = "pass" | "fail" | "warn" | "exempt";
type Result = { seedFile: string; verdict: Verdict; detail: string };

const results: Result[] = [];

for (const abs of walkSeedDir(SEEDS_ROOT)) {
  const rel = abs.replace(/\\/g, "/").replace(ROOT.replace(/\\/g, "/") + "/", "");
  const raw = readFileSync(abs, "utf-8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    results.push({ seedFile: rel, verdict: "warn", detail: `invalid JSON, skipped (${err instanceof Error ? err.message : String(err)})` });
    continue;
  }
  if (!hasSampleWorthyMeta(parsed)) continue; // nothing modeled/placeholder here, not this gate's concern

  const group = resolveRenderGroup(rel);
  if (!group) {
    results.push({ seedFile: rel, verdict: "warn", detail: "carries placeholder/modeled data but no known render-group mapping; verify manually" });
    continue;
  }

  let hasSampleTag = false;
  let hasExemption = false;
  let exemptionReason = "";
  for (const f of group.files) {
    const fAbs = resolve(ROOT, f);
    if (!existsSync(fAbs)) continue;
    const content = readFileSync(fAbs, "utf-8");
    if (content.includes("SampleTag")) hasSampleTag = true;
    const exemptMatch = /allow-unmarked:\s*(.+)/.exec(content);
    if (exemptMatch) {
      hasExemption = true;
      exemptionReason = exemptMatch[1].trim();
    }
  }

  if (hasSampleTag) {
    results.push({ seedFile: rel, verdict: "pass", detail: `${group.label} , SampleTag referenced` });
  } else if (hasExemption) {
    results.push({ seedFile: rel, verdict: "exempt", detail: `${group.label} , allow-unmarked: ${exemptionReason}` });
  } else {
    results.push({
      seedFile: rel,
      verdict: "fail",
      detail: `${group.label} (${group.files.join(", ")}) , no file in this group ever mentions SampleTag`,
    });
  }
}

const fails = results.filter((r) => r.verdict === "fail");
const warns = results.filter((r) => r.verdict === "warn");
const exempt = results.filter((r) => r.verdict === "exempt");
const passes = results.filter((r) => r.verdict === "pass");

console.log(`verify_sample_tags: ${results.length} seed file(s) carry placeholder/modeled data`);
for (const r of passes) console.log(`  PASS   ${r.seedFile} , ${r.detail}`);
for (const r of exempt) console.log(`  EXEMPT ${r.seedFile} , ${r.detail}`);
for (const r of warns) console.log(`  WARN   ${r.seedFile} , ${r.detail}`);
for (const r of fails) console.error(`  FAIL   ${r.seedFile} -> ${r.detail}`);

if (fails.length > 0) {
  console.error(`\n✗ ${fails.length} seed file(s) with modeled/placeholder data render through a`);
  console.error("  component that never mentions SampleTag. Rulebook v1 rule 4: a modeled");
  console.error("  figure presented as real is the worst defect in the system. Either wire");
  console.error("  SampleTag into the render group, or add // allow-unmarked: <reason>.");
  process.exit(1);
}

console.log("\n✓ Every seed carrying modeled/placeholder data renders through a component that references SampleTag (or is exempted).");
