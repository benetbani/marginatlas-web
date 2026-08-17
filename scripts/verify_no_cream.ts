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
  /* #e4d8c5 and #cbb79c ADDED 2026-08-17, the last two warm values on the
     site. They were `ink-200` and `ink-300`, retoned to true neutrals in
     `f71aa395` after measuring h 36.8 s 36.5% l 83.3% and h 33 s 22% l 70.4%:
     warm sand on a palette that is terracotta plus COOL neutrals, and `ink-200`
     was the form-control border, so it was the most-seen hairline on the site
     after `parchment`.

     They are listed here and in WARM_CREAM together, which is the point: the
     retone moved the ramp, and nothing stopped anyone re-typing either hex by
     hand tomorrow. That is not hypothetical. It is exactly how
     empty-state.tsx kept painting `rgb(247 246 244)` through three passes of
     this purge, by spelling a number instead of reading a token. */
  "#e4d8c5",
  "#cbb79c",
  "#ffffff", // cream-50, counted for its name, see header
  "#f7f7f8",
  "#f7f6f4",
  "#efeeeb",
  "#e4e2dd",
  "#c3bfb7",
  "#8d887e",
  "#fbfaf7",
  /* THE ink AND cocoa RAMPS' TOP TWO STEPS, added 2026-08-17. They were never
     part of the ramp this file was written about, which is exactly why they
     outlived it: #faf4ec and #f0e7d9, held byte for byte by BOTH ramps, 36 call
     sites, 20 of them painting on the cell page. Both are retoned now, so these
     two entries count zero today and exist so that writing either value by hand
     lands a new file in the ratchet instead of on the page. */
  "#faf4ec",
  "#f0e7d9",
];


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
  /* The two retired ink steps, so no token may hold either value under any
     name that does not say cream. RGB_LITERALS below is DERIVED from this set,
     so both notations of both values are covered by these two lines. */
  "#e4d8c5",
  "#cbb79c",
  "#fbfaf7",
  "#f7f6f4",
  "#efeeeb",
  "#e4e2dd",
  "#c3bfb7",
  "#8d887e",
  /* ADDED 2026-08-17, AND THE REASON GENERALISES PAST THESE TWO VALUES.
     #faf4ec and #f0e7d9 were `ink-50`/`ink-100` and, identically,
     `cocoa-50`/`cocoa-100`. Measured h34 s58% l95.3% and h37 s43% l89.6%: warm
     sand, and MORE saturated than any of the six values already listed above.

     This list existed precisely to catch cream under a name that does not say
     cream, and it did not catch these, because the list is written by value and
     a value nobody thought of is a value nobody typed. The check is exact about
     what it holds and silent about what it does not, which is the failure the
     rgb net had a month ago and was fixed by DERIVING it. There is no
     equivalent derivation available here: the set of warm tints on a palette is
     not computable from the palette, it is a judgement about hue and
     saturation. So the honest statement is that this list is complete as of the
     values that have been MEASURED, and the instrument that finds the next one
     is verify_palette_membership widened, not this list extended.

     Why the palette gate did not find them either, since that is the obvious
     next question: it returns legal above 93% lightness, so #faf4ec never
     reached a hue test, and #f0e7d9 at 89.6% reached one and PASSED on the
     `ink/cocoa ladder` band (h 25-45, s <= 45), a band written to permit the
     type ladder and unable to tell a fill from type. Both gates were clean and
     the page painted warm sand 36 times. */
  "#faf4ec",
  "#f0e7d9",
]);

/**
 * The warm values again, in the rgb() notations CSS actually accepts.
 *
 * THIS LIST USED TO BE ONE PATTERN, HAND-WRITTEN, AND IT CAUGHT NOTHING.
 * It matched `rgb(251, 250, 247)`, the old page ground, which the migration
 * deleted. Measured across all of src on 2026-08-17: **zero hits**. The check
 * had quietly become decoration while reading as coverage.
 *
 * Meanwhile `src/components/ui/empty-state.tsx` was painting THREE pre-purge
 * warm values written by hand, one `rgb(247 246 244)` and two
 * `rgba(228, 226, 221, 0.6)`, which are the old 100 step and the old
 * `parchment`. Both tokens were retoned to true neutrals and neither retone
 * reached that file, because it spelled the numbers instead of reading the
 * token. So the one place on the site still literally painting cream was the
 * one place both gates were blind to.
 *
 * Two failures, one cause: a second list, kept by hand, next to the real one.
 * So it is DERIVED from WARM_CREAM now and cannot drift again.
 *
 * TWO DELIBERATE NARROWINGS, both measured before choosing:
 *   - Only the WARM set, not every CREAM_LITERAL. `#f7f7f8` appears as rgb ten
 *     times and is the CURRENT cool ground, so matching it would count the
 *     correct colour as a violation.
 *   - `#ffffff` is excluded for the same reason it is only questionably in the
 *     hex list: it appears as rgb 63 times across 16 files and it is white.
 *     The hex entry is kept because the ramp step that used to be white was
 *     NAMED cream; a plain `rgb(255,255,255)` never was.
 *
 * Both separators are matched. CSS accepts `rgb(a, b, c)` and `rgb(a b c)`,
 * and the literal that actually mattered here used the second form while the
 * old pattern only understood the first.
 */
const RGB_LITERALS = [...WARM_CREAM].map((hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return new RegExp(`rgba?\\(\\s*${r}\\s*[,\\s]\\s*${g}\\s*[,\\s]\\s*${b}\\b`, "gi");
});

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
     * RAMP STEPS. THIS CHECK COULD NOT READ ONE UNTIL 2026-08-17, and that is
     * most of what it was written to read.
     *
     * The name pattern above starts `[A-Za-z_]`, and every step of every ramp
     * in design-tokens.ts is keyed by a NUMBER: `50: "#faf4ec"`. So the check
     * matched top-level named tokens like `parchment` and `graphite` and was
     * structurally blind to `ink[50]`, `paper[100]`, `cocoa[100]` and every
     * other rung. It caught `parchment` and people concluded it worked.
     *
     * Proved rather than assumed: putting #faf4ec back on `ink[50]` and running
     * this file failed on the RATCHET COUNT and not on this check, which is the
     * wrong instrument answering. The ratchet is per-file and only fails when a
     * count GROWS, so a warm value that merely moves between two ramp steps, or
     * that arrives in a file already carrying a literal it can trade against,
     * passes it. This check is the one that is supposed to be absolute.
     *
     * A step's identity is its ramp plus its number, so the ramp name is
     * tracked down the file and the two are joined before the "does the name
     * say cream" test. That keeps the original rule exactly as written: a token
     * may hold a warm cream value only if its own name says cream.
     */
    let ramp: string | null = null;
    code.split("\n").forEach((line, i) => {
      const open = line.match(/^\s*([A-Za-z_][\w]*)\s*:\s*\{/);
      if (open) {
        ramp = open[1];
        return;
      }
      if (/^\s*\},?\s*$/.test(line)) {
        ramp = null;
        return;
      }
      const step = line.match(/^\s*(\d+)\s*:\s*"(#[0-9a-fA-F]{6})"/);
      if (!step) return;
      const value = step[2].toLowerCase();
      const name = `${ramp ?? "?"}-${step[1]}`;
      if (WARM_CREAM.has(value) && !/cream/i.test(name)) {
        hits.push(`${rel}:${i + 1}: ${name} = ${value}`);
      }
    });

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
