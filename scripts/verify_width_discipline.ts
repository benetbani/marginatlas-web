/**
 * scripts/verify_width_discipline.ts , two width ratchets.
 *
 * Founder, 2026-08-21: "on the desktop, some icons and sections are very wide
 * for the eye, so the eye has to do like an angle to read all of it", and "in
 * mobile the look is always stacked with one card after another where there is
 * a good opportunity that we can put two cards in the same row".
 *
 * 1. COMPETING PROSE CAPS MAY ONLY SHRINK. Measured 2026-08-21: TWENTY
 *    different width conventions in reader-facing code. The dominant one is
 *    max-w-2xl at 123 uses, which is a fixed 672px and therefore roughly 96
 *    characters at 14px type, so the paragraphs that LOOKED capped were among
 *    the widest on the page. A rem cap is a width, not a measure. Only 14
 *    declarations use a real character-based measure and they use EIGHT
 *    different values between them.
 *
 * 2. A PHONE PAIRING MUST NOT BE AIMED PAST EVERY PHONE. `sm:` is 640px.
 *    Phones are 375 to 430. A grid that goes two-up at `sm:` is a pairing that
 *    has never once fired on a phone, and there were 48 of them in
 *    reader-facing code, including the small number tiles the founder
 *    specifically asked to pair. This ratchet stops a 49th being written.
 *
 * BOTH ARE RATCHETS, NOT HARD GATES, and deliberately so: the starting numbers
 * are large and honest, and migrating them all at once would be hundreds of
 * untested visual edits. The ratchet stops the numbers growing while they come
 * down.
 *
 * BLIND SPOT, stated because this number will be quoted. This reads what a file
 * DECLARES. It cannot see which of two competing caps wins on a real element,
 * it cannot see inheritance, and it cannot tell a class behind an off flag from
 * one that renders. For "how many conventions does the source declare" it is
 * exact. For "how wide is that paragraph" the instrument is a browser, and the
 * browser said: median 71 characters before this work, 58 after.
 *
 * Run: npx tsx scripts/verify_width_discipline.ts [--write-baseline]
 */
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";
import { stripCommentLines } from "./lib/strip_comments";

const BASELINE_PATH = "scripts/width_discipline_baseline.json";

/** Every fixed-width cap that competes with the one reading measure. */
const REM_CAPS = [
  "max-w-xs", "max-w-sm", "max-w-md", "max-w-lg", "max-w-xl", "max-w-2xl",
  "max-w-3xl", "max-w-4xl", "max-w-5xl", "max-w-6xl", "max-w-7xl", "max-w-prose",
];

const isWorkshop = (f: string) => f.startsWith("src/app/dev/") || f.includes("/_design/");

interface Counts { remCaps: number; chCaps: number; smPairings: number }

function collect(): { total: Counts; byFile: Record<string, Counts> } {
  const byFile: Record<string, Counts> = {};
  const total: Counts = { remCaps: 0, chCaps: 0, smPairings: 0 };

  const walk = (dir: string) => {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (statSync(p).isDirectory()) { walk(p); continue; }
      if (![".ts", ".tsx", ".css"].includes(extname(p))) continue;
      const rel = relative(process.cwd(), p).split(sep).join("/");
      if (isWorkshop(rel)) continue; // the workshop has no reader
      const lines = stripCommentLines(readFileSync(p, "utf8").split("\n"));
      const c: Counts = { remCaps: 0, chCaps: 0, smPairings: 0 };
      for (const line of lines) {
        for (const cls of REM_CAPS) {
          const re = new RegExp(`(?:^|[\\s"'\`:])${cls}(?![\\w-])`, "g");
          for (const _ of line.matchAll(re)) c.remCaps++;
        }
        for (const _ of line.matchAll(/max-w-\[\d+ch\]/g)) c.chCaps++;
        /* Two-up (or wider) aimed at a breakpoint no phone reaches. */
        for (const _ of line.matchAll(/\bsm:grid-cols-[2-9]\b/g)) c.smPairings++;
      }
      if (c.remCaps || c.chCaps || c.smPairings) byFile[rel] = c;
      total.remCaps += c.remCaps;
      total.chCaps += c.chCaps;
      total.smPairings += c.smPairings;
    }
  };
  walk("src");
  return { total, byFile };
}

const { total, byFile } = collect();

console.log(
  `\n  reader-facing: ${total.remCaps} fixed-width caps, ${total.chCaps} real reading measures, ` +
    `${total.smPairings} pairings aimed past every phone\n`,
);

if (process.argv.includes("--write-baseline")) {
  writeFileSync(BASELINE_PATH, JSON.stringify({ total, byFile }, null, 2) + "\n");
  console.log(`  wrote ${BASELINE_PATH}`);
  process.exit(0);
}

let failed = 0;
const fail = (m: string, d?: string) => { failed++; console.log(`  FAIL  ${m}`); if (d) console.log(`        ${d}`); };
const ok = (m: string) => console.log(`  ok    ${m}`);

if (!existsSync(BASELINE_PATH)) {
  fail("no baseline", `run: npx tsx ${process.argv[1]} --write-baseline`);
} else {
  const base = JSON.parse(readFileSync(BASELINE_PATH, "utf8")) as { total: Counts; byFile: Record<string, Counts> };

  const grew = (key: keyof Counts, label: string) => {
    if (total[key] > base.total[key]) {
      const files = Object.entries(byFile)
        .filter(([f, c]) => c[key] > (base.byFile[f]?.[key] ?? 0))
        .map(([f, c]) => `${f}: ${base.byFile[f]?.[key] ?? 0} -> ${c[key]}`);
      fail(`${label} GREW, ${base.total[key]} -> ${total[key]}`, files.slice(0, 10).join("\n        "));
    } else {
      ok(
        total[key] < base.total[key]
          ? `${label} shrank, ${base.total[key]} -> ${total[key]}. Re-run with --write-baseline to lock it in`
          : `${label} held at ${total[key]}`,
      );
    }
  };

  grew("remCaps", "fixed-width caps competing with the reading measure");
  grew("smPairings", "pairings aimed at a breakpoint no phone reaches");

  /* This one may only GROW: more real reading measures is the direction of
     travel, so a drop means someone replaced a measure with a fixed width. */
  if (total.chCaps < base.total.chCaps) {
    fail(`real reading measures FELL, ${base.total.chCaps} -> ${total.chCaps}`,
      "A character cap was replaced by a fixed width. That is the defect, not the fix.");
  } else ok(`real reading measures at ${total.chCaps}`);
}

console.log(failed === 0 ? "\n  PASS\n" : `\n  ${failed} FAILED\n`);
process.exit(failed === 0 ? 0 : 1);
