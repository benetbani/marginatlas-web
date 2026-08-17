/**
 * verify_no_cream , the cream ban, enforced. A ratchet that only counts down.
 *
 * WHY IT HAD TO BE A NEW GATE. The founder banned cream outright on 2026-08-16:
 * "to remove completely this creamy color from the page. That's totally not
 * allowed." verify_palette_membership already guards the palette and it CANNOT
 * SEE CREAM, by design. Its own comment says so:
 *
 *     "PAPER TONES ARE NOT COLOURS. Above ~93% lightness a tint reads as warm
 *      or cool white whatever its hue: #fff7e6 is 95% and is the cream this
 *      site is printed on."
 *
 * It was deliberately taught to allow cream, back when cream was the paper this
 * site was printed on. #fbfaf7 measures 97.6% lightness and sails through the
 * `l >= 93` early return. So the existing ratchet sitting at 165 was never
 * evidence the purge was working; it could not have moved either way.
 *
 * That is the whole reason this file exists rather than a widened threshold.
 * Lowering that 93 would re-catch every warm and cool white on the site, which
 * is a different and much larger argument, and the gate's comment explicitly
 * warns against "tuning a rule until it passes". A named ban gets a named gate.
 *
 * WHAT IT COUNTS. Two things, because cream reaches the page by two routes:
 *
 *   1. Tailwind utilities, any family: bg-, text-, border-, ring-, fill-,
 *      stroke-, from-, via-, to-, divide-, decoration-, outline-, accent-,
 *      caret-, shadow-. Matching `-cream-<step>` catches families nobody has
 *      thought of yet, which is the point.
 *   2. The ramp's hex values written literally, plus their rgb() forms, since
 *      a colour can enter CSS as either and the rgb() form is how the masthead
 *      carried it (rgba(251, 250, 247, .72)).
 *
 * cream-50 is #ffffff. It is white, not cream, so its NAME is the problem and
 * not its value; it is counted anyway, because leaving 226 usages of a token
 * called cream is how the ramp survives the purge and repopulates.
 *
 * COMMENTS ARE STRIPPED, via scripts/lib/strip_comments, for the reason two
 * other gates in this chain learned the hard way: this very file's header
 * quotes cream hex values, and a gate that fails on the documentation of its own
 * rule is a gate somebody switches off.
 *
 * THE RATCHET. Baseline is per file. A file may shrink freely. It may not grow,
 * a new file may not appear, and an entry that reaches zero must be deleted from
 * the baseline in the same change. Never regenerate the baseline to make this
 * pass: the whole point is that the number goes one way.
 *
 * BLIND SPOT, stated. It reads source text. A cream that arrives through a
 * computed class name, a CSS variable indirection, or a data file is invisible
 * here. It catches the 400-odd that are written down, which is the migration
 * this gate exists to protect.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

import { newCommentState, stripComments } from "./lib/strip_comments";

const PROJECT_ROOT = process.cwd();
const ROOTS = ["src"];
const BASELINE = resolve(PROJECT_ROOT, "scripts/cream_baseline.json");
const SELF = "scripts/verify_no_cream.ts";

/** Any Tailwind utility family, present or future, ending in a cream step. */
const CREAM_TOKEN = /-cream-\d+\b/g;

/**
 * The ramp, as literals. From src/lib/design-tokens.ts, plus the two page
 * grounds that were written as raw values rather than through the token:
 * #fbfaf7 (the old --atlas-surface-paper) and its rgb() form.
 */
const CREAM_LITERALS = [
  "#ffffff", // cream-50, counted for its name, see header
  "#f7f7f8",
  "#f7f6f4",
  "#efeeeb",
  "#e4e2dd",
  "#c3bfb7",
  "#8d887e",
  "#fbfaf7",
];

const RGB_LITERALS = [/rgba?\(\s*251\s*,\s*250\s*,\s*247/gi];

/**
 * CREAM WEARING ANOTHER NAME. A hard check, not part of the ratchet.
 *
 * The ratchet above counts the WORD "cream", and on 2026-08-17 that was proved
 * insufficient in the worst way: `parchment` was `#e4e2dd`, which is not merely
 * close to `cream-300`, it IS `cream-300`, and design-tokens said so in its own
 * comment. So did `--border` and `--input` in globals.css (228 226 221 is the
 * same colour in decimal), `--parchment` in homepage-visual-tokens.css, and
 * chart.grid. Cream had FIVE names, and 419 call sites wore one of the four
 * without the word in it, against 35 that had it.
 *
 * A name-based ratchet can never see that. So this checks VALUES: no token may
 * hold a warm cream value unless its own name says cream.
 *
 * #ffffff and #f7f7f8 are deliberately NOT in this list. cream-50 is white, and
 * white is legitimately the card surface everywhere; #f7f7f8 is the cool neutral
 * the grounds were migrated ONTO, blue-leaning rather than warm. Flagging either
 * would produce noise and teach people to silence the gate. What is listed here
 * is the warm tints only, which are what "creamy" means.
 */
const WARM_CREAM = new Set([
  "#fbfaf7",
  "#f7f6f4",
  "#efeeeb",
  "#e4e2dd",
  "#c3bfb7",
  "#8d887e",
]);

const TOKEN_FILES = [
  "src/lib/design-tokens.ts",
  "src/app/globals.css",
  "src/styles/homepage-visual-tokens.css",
];

/** Any token assignment: `name: "#hex"` in TS, `--name: #hex` in CSS. */
function aliasedCream(): string[] {
  const hits: string[] = [];
  for (const rel of TOKEN_FILES) {
    const abs = resolve(PROJECT_ROOT, rel);
    if (!existsSync(abs)) continue;
    const state = newCommentState();
    const code = readFileSync(abs, "utf-8")
      .split("\n")
      .map((l) => stripComments(l, state))
      .join("\n");

    const patterns = [
      /([A-Za-z_][\w-]*)\s*:\s*"(#[0-9a-fA-F]{6})"/g,
      /(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{6})/g,
    ];
    for (const re of patterns) {
      for (const m of code.matchAll(re)) {
        const name = m[1];
        const value = m[2].toLowerCase();
        if (WARM_CREAM.has(value) && !/cream/i.test(name)) {
          hits.push(`${rel}: ${name} = ${value}`);
        }
      }
    }

    /**
     * THE SAME EVASION, ONE NOTATION LATER. Found 2026-08-17, and it was live:
     * `--secondary: 247 246 244` and `--accent: 247 246 244` were cream-100,
     * and `--muted: 228 226 221` was cream-300, all three in the bare-decimal
     * form Tailwind's `rgb(var(--x) / <alpha-value>)` syntax requires. So
     * `bg-secondary`, `bg-accent` and `bg-muted` painted warm sand while the
     * ratchet above, which matches the word and a list of HEX literals, and the
     * hex-only check above this, both reported clean.
     *
     * `parchment` taught that cream hides behind a name. This is the same
     * colour hiding behind a NOTATION, which is worth stating separately: it is
     * not enough to enumerate the names a value might wear, the spellings of
     * the value have to be enumerated too.
     */
    for (const m of code.matchAll(/(--[\w-]+)\s*:\s*(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\s*;/g)) {
      const name = m[1];
      const hex =
        "#" +
        [m[2], m[3], m[4]]
          .map((v) => Number(v).toString(16).padStart(2, "0"))
          .join("");
      if (WARM_CREAM.has(hex) && !/cream/i.test(name)) {
        hits.push(`${rel}: ${name} = ${m[2]} ${m[3]} ${m[4]} (= ${hex}, decimal form)`);
      }
    }
  }
  return hits;
}

type Counts = Record<string, number>;

function walk(dir: string, acc: string[] = []): string[] {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(tsx?|css)$/.test(name)) acc.push(p);
  }
  return acc;
}

function countCream(src: string): number {
  const state = newCommentState();
  const code = src
    .split("\n")
    .map((l) => stripComments(l, state))
    .join("\n");

  let n = (code.match(CREAM_TOKEN) || []).length;
  const lower = code.toLowerCase();
  for (const lit of CREAM_LITERALS) {
    let i = 0;
    for (;;) {
      const at = lower.indexOf(lit, i);
      if (at === -1) break;
      n++;
      i = at + lit.length;
    }
  }
  for (const re of RGB_LITERALS) n += (code.match(re) || []).length;
  return n;
}

function scan(): Counts {
  const counts: Counts = {};
  for (const root of ROOTS) {
    for (const file of walk(resolve(PROJECT_ROOT, root))) {
      const rel = file.replace(PROJECT_ROOT, "").replace(/^[\\/]/, "").replace(/\\/g, "/");
      if (rel === SELF) continue;
      let src: string;
      try {
        src = readFileSync(file, "utf-8");
      } catch {
        continue;
      }
      const n = countCream(src);
      if (n > 0) counts[rel] = n;
    }
  }
  return counts;
}

function main(): void {
  const counts = scan();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  /* --init REFUSES TO RAISE, added 2026-08-17.
     It used to overwrite unconditionally, which made the ratchet only as strong
     as whoever ran it last: one `--init` after an accidental increase and the
     new, higher count becomes the guarantee. The palette gate has refused this
     from the start and says why in its own source; this one did not, and the
     coordinator noticed only when tightening 414 to 413 by hand.

     A ratchet whose baseline can move either way is not a ratchet. */
  if (process.argv.includes("--init")) {
    if (existsSync(BASELINE)) {
      const prev: Counts = JSON.parse(readFileSync(BASELINE, "utf-8")).files || {};
      const prevTotal = Object.values(prev).reduce((a, b) => a + b, 0);
      const rising = Object.entries(counts).filter(([f, n]) => (prev[f] ?? 0) < n);
      if (total > prevTotal || rising.length > 0) {
        console.error(
          `[verify_no_cream] refusing to raise the baseline: ${prevTotal} -> ${total}.`,
        );
        for (const [f, n] of rising) {
          console.error(`  ${f}: ${prev[f] ?? 0} -> ${n}`);
        }
        console.error(
          "\nThe founder banned cream outright. This ratchet counts DOWN only.\n" +
            "Remove the cream instead of recording it.",
        );
        process.exit(1);
      }
    }
    writeFileSync(BASELINE, JSON.stringify({ files: counts }, null, 2) + "\n");
    console.log(
      `[verify_no_cream] baseline written: ${total} cream reference(s) in ${Object.keys(counts).length} file(s)`,
    );
    return;
  }

  if (!existsSync(BASELINE)) {
    console.error("[verify_no_cream] no baseline. Run with --init once, then commit it.");
    process.exit(1);
  }

  const base: Counts = JSON.parse(readFileSync(BASELINE, "utf-8")).files || {};
  const baseTotal = Object.values(base).reduce((a, b) => a + b, 0);

  const aliases = aliasedCream();

  const grown: string[] = [];
  const added: string[] = [];
  const stale: string[] = [];

  for (const [file, n] of Object.entries(counts)) {
    const was = base[file];
    if (was == null) added.push(`${file}: ${n} new`);
    else if (n > was) grown.push(`${file}: ${was} -> ${n}`);
  }
  for (const file of Object.keys(base)) {
    if (!counts[file]) stale.push(file);
  }

  if (aliases.length > 0) {
    console.error(
      "[verify_no_cream] FAIL: a token holds a warm cream value under a name" +
        "\nthat does not say cream. This is how the ban is evaded without" +
        "\nanything in this ratchet moving:\n",
    );
    for (const a of aliases) console.error(`  ${a}`);
    console.error(
      "\nOn 2026-08-17 `parchment` WAS cream-300, exactly, across 419 call" +
        "\nsites, while only 35 usages had the word cream in them. Retone the" +
        "\nvalue to a true neutral; do not rename the token.",
    );
    process.exit(1);
  }

  if (grown.length === 0 && added.length === 0 && stale.length === 0) {
    console.log(
      `[verify_no_cream] PASS: ${total} cream reference(s) in ` +
        `${Object.keys(counts).length} file(s), baseline ${baseTotal}. Ratchet holding.`,
    );
    return;
  }

  if (grown.length || added.length) {
    console.error("[verify_no_cream] FAIL: cream grew.\n");
    for (const g of grown) console.error(`  grew   ${g}`);
    for (const a of added) console.error(`  new    ${a}`);
    console.error(
      "\nThe founder banned cream outright: \"remove completely this creamy\n" +
        "color from the page. That's totally not allowed.\" This ratchet only\n" +
        "counts down. Do NOT regenerate the baseline to clear this.\n" +
        "Note verify_palette_membership cannot help you here: it returns legal\n" +
        "for anything above 93% lightness, and cream is 97.6%.",
    );
  }

  if (stale.length) {
    console.error(
      `\n[verify_no_cream] ${stale.length} baseline entr(y/ies) reached zero:\n`,
    );
    for (const f of stale) console.error(`  ${f}`);
    console.error(
      "\nGood. Delete them from scripts/cream_baseline.json in the same change,\n" +
        "so the ratchet keeps counting down and cannot silently re-fill.",
    );
  }

  process.exit(1);
}

main();
