/**
 * scripts/verify_type_ladder.ts , the type ladder gate.
 *
 * Founder, 2026-08-21: "a big variability in fonts which is traumatic to the
 * eye, the difference between H1 and the smallest font cannot be so gigantic."
 *
 * Two jobs, and the first is the one that matters most.
 *
 * 1. THE TWO STYLESHEETS MUST DECLARE THE SAME LADDER. This site arrived at 44
 *    sizes precisely because Tailwind's scale and a hand-written pixel scale in
 *    atlas-spine.css each went their own way, and nothing compared them. Two
 *    ladders that agree today and are maintained apart disagree within a month.
 *    A hard check, not a ratchet: there is no acceptable number of steps that
 *    differ.
 *
 * 2. OFF-LADDER SIZES MAY ONLY SHRINK. A ratchet, because the starting count is
 *    large and honest: 2,758 size declarations existed when the ladder landed
 *    and most are not yet on it. Migrating them all at once would be thousands
 *    of untested visual edits. The ratchet stops the number growing while it
 *    comes down.
 *
 * WHY IT READS SOURCE AND NOT A RENDERED PAGE, stated because every instrument
 * here states its blind spot. This sees what a file DECLARES, not what an
 * element COMPUTES. It cannot see inheritance, it cannot see which of two
 * competing rules wins, and it cannot tell a class behind an off flag from one
 * that renders. For "does the site still declare 44 sizes" it is exact. For
 * "does the page look right" the instrument is a screenshot.
 *
 * IT READS CLAMPS, and that is not incidental: the largest type on this site,
 * 86px, lived inside a clamp() and the first census written for this work
 * missed it entirely, reporting 80px as the maximum. Any size inside a clamp
 * counts as a declared size.
 *
 * Run: npx tsx scripts/verify_type_ladder.ts
 */
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";
import { stripCommentLines } from "./lib/strip_comments";

const BASELINE_PATH = "scripts/type_ladder_baseline.json";

/** The ladder, as the single source of truth for this check. */
const LADDER = [10, 11, 12, 14, 16, 18, 20, 24, 30, 48];

/** Tailwind's own scale, in px, so `text-sm` is judged like `text-[14px]`. */
const TW_PX: Record<string, number> = {
  "text-xs": 12, "text-sm": 14, "text-base": 16, "text-lg": 18,
  "text-xl": 20, "text-2xl": 24, "text-3xl": 30, "text-4xl": 36,
  "text-5xl": 48, "text-6xl": 60, "text-7xl": 72, "text-8xl": 96,
  "text-9xl": 128,
};

interface Finding { file: string; px: number }

function collectSizes(): Finding[] {
  const out: Finding[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (statSync(p).isDirectory()) { walk(p); continue; }
      if (![".ts", ".tsx", ".css"].includes(extname(p))) continue;
      const rel = relative(process.cwd(), p).split(sep).join("/");
      const lines = stripCommentLines(readFileSync(p, "utf8").split("\n"));
      for (const line of lines) {
        /* Arbitrary-value classes and raw declarations. */
        for (const m of line.matchAll(/text-\[(\d+(?:\.\d+)?)px\]/g)) out.push({ file: rel, px: parseFloat(m[1]) });
        for (const m of line.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)) out.push({ file: rel, px: parseFloat(m[1]) });
        /* Inside clamp(), which the first census missed and which held the
           largest size on the site. */
        for (const c of line.matchAll(/font-size:\s*clamp\(([^)]*)\)/g)) {
          for (const m of c[1].matchAll(/(\d+(?:\.\d+)?)px/g)) out.push({ file: rel, px: parseFloat(m[1]) });
        }
        /* Tailwind's named steps. */
        for (const [cls, px] of Object.entries(TW_PX)) {
          const re = new RegExp(`(?:^|[\\s"'\`:])${cls}(?![\\w-])`, "g");
          for (const _m of line.matchAll(re)) out.push({ file: rel, px });
        }
      }
    }
  };
  walk("src");
  return out;
}

/** Pull the ten declared steps out of a stylesheet. */
function declaredLadder(file: string): Record<string, string> {
  const src = readFileSync(file, "utf8");
  const found: Record<string, string> = {};
  for (const m of src.matchAll(/--t-(mark|micro|small|body|lead|sub|head|section|focal|answer)\s*:\s*([0-9.]+px)/g)) {
    found[m[1]] = m[2];
  }
  return found;
}

let failed = 0;
const fail = (msg: string, detail?: string) => {
  failed++;
  console.log(`  FAIL  ${msg}`);
  if (detail) console.log(`        ${detail}`);
};
const ok = (msg: string) => console.log(`  ok    ${msg}`);

/* ---- 1. The two stylesheets must agree. Hard. ---- */
const A = declaredLadder("src/app/globals.css");
const B = declaredLadder("src/styles/atlas-spine.css");
const STEPS = ["mark", "micro", "small", "body", "lead", "sub", "head", "section", "focal", "answer"];

const missingA = STEPS.filter((s) => !A[s]);
const missingB = STEPS.filter((s) => !B[s]);
if (missingA.length) fail("globals.css is missing ladder steps", missingA.join(", "));
else ok("globals.css declares all ten steps");
if (missingB.length) fail("atlas-spine.css is missing ladder steps", missingB.join(", "));
else ok("atlas-spine.css declares all ten steps");

const drifted = STEPS.filter((s) => A[s] && B[s] && A[s] !== B[s]);
if (drifted.length) {
  fail(
    "the two stylesheets declare DIFFERENT values for the same step",
    drifted.map((s) => `--t-${s}: ${A[s]} vs ${B[s]}`).join(", "),
  );
} else ok("both stylesheets declare the same ten values");

const wrongValue = STEPS.filter((s, i) => A[s] && A[s] !== `${LADDER[i]}px`);
if (wrongValue.length) {
  fail(
    "a declared step does not match the ladder this gate enforces",
    wrongValue.map((s) => `--t-${s}: ${A[s]}`).join(", "),
  );
} else ok("every declared step matches the ladder");

/* ---- 2. Off-ladder sizes may only shrink. ---- */
const all = collectSizes();
const offLadder = all.filter((f) => !LADDER.includes(f.px));

const byFile: Record<string, number> = {};
for (const f of offLadder) byFile[f.file] = (byFile[f.file] ?? 0) + 1;

const sizes = [...new Set(all.map((f) => f.px))].sort((a, b) => a - b);
const readable = sizes.filter((s) => s >= 11);
console.log(
  `\n  ALL OF src:  ${all.length} declarations, ${sizes.length} distinct, ` +
    `${sizes[0]}px to ${sizes[sizes.length - 1]}px ` +
    `(read-text range ${(sizes[sizes.length - 1] / readable[0]).toFixed(2)}x)`,
);

/* READER-FACING ONLY, reported separately and deliberately. The workshop
   (src/app/dev) has no URL and no reader, and folding it into one number is how
   a gate ends up reporting a figure nobody can act on: the readiness ledger
   already records four gates that "mix workshop paths into the same verdict as
   reader paths, which inflates counts". Both numbers are printed so neither can
   be quoted without the other. */
const isWorkshop = (f: string) => f.startsWith("src/app/dev/") || f.includes("/_design/");
const readerAll = all.filter((f) => !isWorkshop(f.file));
const readerSizes = [...new Set(readerAll.map((f) => f.px))].sort((a, b) => a - b);
const readerReadable = readerSizes.filter((s) => s >= 11);
console.log(
  `  READER-FACING: ${readerAll.length} declarations, ${readerSizes.length} distinct, ` +
    `${readerSizes[0]}px to ${readerSizes[readerSizes.length - 1]}px ` +
    `(read-text range ${(readerSizes[readerSizes.length - 1] / readerReadable[0]).toFixed(2)}x)`,
);
const readerOff = offLadder.filter((f) => !isWorkshop(f.file)).length;
console.log(
  `\n  ${offLadder.length} off the ladder in ${Object.keys(byFile).length} files ` +
    `(${readerOff} of them reader-facing)\n`,
);

if (process.argv.includes("--write-baseline")) {
  writeFileSync(BASELINE_PATH, JSON.stringify({ total: offLadder.length, files: byFile }, null, 2) + "\n");
  console.log(`  wrote ${BASELINE_PATH} at ${offLadder.length}`);
  process.exit(0);
}

if (!existsSync(BASELINE_PATH)) {
  fail("no baseline", `run: npx tsx ${process.argv[1]} --write-baseline`);
} else {
  const base = JSON.parse(readFileSync(BASELINE_PATH, "utf8")) as { total: number; files: Record<string, number> };
  if (offLadder.length > base.total) {
    const grown = Object.entries(byFile)
      .filter(([f, n]) => n > (base.files[f] ?? 0))
      .map(([f, n]) => `${f}: ${base.files[f] ?? 0} -> ${n}`);
    fail(
      `off-ladder sizes GREW, ${base.total} -> ${offLadder.length}`,
      grown.slice(0, 12).join("\n        ") +
        "\n        A ratchet counts down only. Use a ladder step, or state why in the plan.",
    );
  } else {
    ok(
      offLadder.length < base.total
        ? `off-ladder sizes shrank, ${base.total} -> ${offLadder.length}. Re-run with --write-baseline to lock it in`
        : `off-ladder sizes held at ${offLadder.length}`,
    );
  }
}

console.log(failed === 0 ? "\n  PASS\n" : `\n  ${failed} FAILED\n`);
process.exit(failed === 0 ? 0 : 1);
