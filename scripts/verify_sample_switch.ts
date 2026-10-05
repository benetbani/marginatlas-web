/**
 * scripts/verify_sample_switch.ts
 *
 * Prebuild gate, plan step 48 (2026-09-19), rewritten by masterplan step 38 (2026-10-05) to hold HIS RULING 5 (the interview of
 * 2026-09-26): "the sample marks stay off; the quiet notes and 'About the figures' carry the honesty."
 *
 * WHAT IT HOLDS. `areSampleMarksVisible()` (src/lib/feature_flags.ts) defaults to hidden since his switch of 2026-09-11. The gate
 * of 2026-09-19 made launch day turn the marks back on; ruling 5 reversed that, so the old launch step (delete the private line,
 * add `NEXT_PUBLIC_SHOW_SAMPLE_MARKS=1`) would have broken his ruling, and deleting the private line alone failed every build. The
 * rule now, in this order:
 *
 *   1. the marks ON fail, whatever else holds (ruling 5): "the sample marks are on, and ruling 5 keeps them off";
 *   2. the site private (`NEXT_PUBLIC_SITE_PRIVATE=1`, today) passes;
 *   3. the site public passes only while ruling 5's honesty stands in source, the three things that carry it once the word
 *      "sample" is gone: the half-filled mark beside a masthead's foot line (AnswerCard), the mark's own label "An estimate"
 *      (marks.tsx), and About the figures' "How to read a figure" (`#reading`, about-data/page.tsx); a public site without one of
 *      them fails with `SENTENCE` and the missing ones named.
 *
 * Launch day is one line now: `NEXT_PUBLIC_SITE_PRIVATE=1` comes off `.env.production`, and nothing is added
 * (docs/DEPLOY-PACK-spine-flags.md, "Launch day").
 *
 * WHERE THE TWO FLAGS ARE READ. The process environment first (Vercel's variables, a shell), then `.env.production` (COMMITTED,
 * the one env file git keeps: it holds public flags only, never a secret, and is the versioned statement "this site is private"),
 * then `.env.local` (a local override, never committed). Next.js loads the same files for `NEXT_PUBLIC_` values at build, so what
 * this gate reads is what the build bakes in. The chain must never need the network or a secret, and this gate reads neither.
 *
 * BLIND SPOTS. It cannot distinguish a flag set in Vercel's dashboard from one in the file: it reads the process environment
 * first, which is where Vercel puts its variables, and prints which source it read. The honesty check reads source text, so it
 * proves the three pieces are written, not that a page draws them (the harness's renders and the page gates read what is drawn).
 *
 * PLANTED 2026-10-05 (masterplan step 38), each case once: the marks on through the environment, red; the site public through
 * the environment (`NEXT_PUBLIC_SITE_PRIVATE=0`) with the three pieces in source, green; the site public with each piece taken out
 * of a scratch copy read through `--root=<dir>`, red three times, each naming its piece; restored, green.
 *
 * THE READERS ARE EXPORTED (plan step 50, 2026-09-19): the launch checklist (scripts/verify_launch_ready.ts, by hand, never in the
 * chain) reads the flags through `readFlag` and judges them through `judge`, so there is one parser of the env files and one rule.
 * `main()` runs only when this file is the entry point.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "..");

export type Source = "environment" | ".env.production" | ".env.local" | "unset";

/** The sentence for a public site without ruling 5's honesty, printed by this gate and by the launch checklist. */
export const SENTENCE = "the site is public and ruling 5's honesty is not all in place";
/** The sentence for the marks on. */
export const MARKS_ON = "the sample marks are on, and ruling 5 keeps them off";

/** RULING 5'S HONESTY, IN SOURCE: what carries it once the sample word is gone. Each a file and the text that proves it is there. */
export const HONESTY: ReadonlyArray<{ file: string; needle: RegExp; what: string }> = [
  { file: "src/components/spine/archetypes/AnswerCard.tsx", needle: /foot\.modeled \? <AtlasMark id="modeled"/, what: "the half-filled mark beside a masthead's foot line (AnswerCard)" },
  { file: "src/components/spine/marks.tsx", needle: /modeled: "An estimate"/, what: "the mark's own label, An estimate (marks.tsx)" },
  { file: "src/app/(site)/about-data/page.tsx", needle: /<h2 id="reading"/, what: "About the figures' How to read a figure, #reading (about-data/page.tsx)" },
];

/** The pieces of ruling 5's honesty missing under `root` (the repo, or a scratch copy for a plant). */
export function honestyMissing(root: string = ROOT): string[] {
  return HONESTY.filter((h) => {
    const path = resolve(root, h.file);
    return !existsSync(path) || !h.needle.test(readFileSync(path, "utf8"));
  }).map((h) => h.what);
}

/** The rule, in its order: the marks on fail; private passes; public passes only with nothing missing. */
export function judge(marksOn: boolean, sitePrivate: boolean, missing: string[]): { pass: boolean; why: string } {
  if (marksOn) return { pass: false, why: MARKS_ON };
  if (sitePrivate) return { pass: true, why: "the marks are off and the site declares itself private" };
  if (missing.length) return { pass: false, why: `${SENTENCE}: missing ${missing.join("; ")}` };
  return { pass: true, why: "the site is public, the marks are off by ruling 5, and its honesty stands (the mark beside the foot line, An estimate, #reading)" };
}

/** Parse a dotenv file into a map: KEY=VALUE lines, quotes stripped, comments and blanks skipped. */
function parseEnvFile(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!existsSync(path)) return out;
  for (const raw of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    out[key] = value;
  }
  return out;
}

/** The same truthiness parseFlag in feature_flags.ts applies: "1", "true", "on", "yes" are on. */
function isOn(value: string | undefined): boolean | null {
  if (value == null) return null;
  const v = value.trim().toLowerCase();
  if (v === "") return null;
  if (v === "1" || v === "true" || v === "on" || v === "yes") return true;
  if (v === "0" || v === "false" || v === "off" || v === "no") return false;
  return null;
}

export function readFlag(name: string): { on: boolean | null; source: Source } {
  const fromEnv = isOn(process.env[name]);
  if (fromEnv != null) return { on: fromEnv, source: "environment" };
  const prod = isOn(parseEnvFile(resolve(ROOT, ".env.production"))[name]);
  if (prod != null) return { on: prod, source: ".env.production" };
  const local = isOn(parseEnvFile(resolve(ROOT, ".env.local"))[name]);
  if (local != null) return { on: local, source: ".env.local" };
  return { on: null, source: "unset" };
}

function main(): number {
  const rootArg = process.argv.slice(2).find((a) => a.startsWith("--root="));
  const root = rootArg ? resolve(rootArg.slice("--root=".length)) : ROOT;
  const marks = readFlag("NEXT_PUBLIC_SHOW_SAMPLE_MARKS");
  const priv = readFlag("NEXT_PUBLIC_SITE_PRIVATE");
  const marksOn = marks.on === true; // the flag's default is hidden (feature_flags.ts)
  const sitePrivate = priv.on === true;
  const missing = honestyMissing(root);
  console.log(`sample-switch: sample marks ${marksOn ? "ON" : "OFF"} (${marks.source}); site private ${sitePrivate ? "YES" : "NO"} (${priv.source}); ruling 5's honesty in source: ${HONESTY.length - missing.length} of ${HONESTY.length}${root !== ROOT ? ` (read under ${root})` : ""}`);
  const verdict = judge(marksOn, sitePrivate, missing);
  if (verdict.pass) {
    console.log(`sample-switch: PASS (${verdict.why})`);
    return 0;
  }
  console.log(`sample-switch: FAIL: ${verdict.why}`);
  console.log(marksOn
    ? "  Remedy: take NEXT_PUBLIC_SHOW_SAMPLE_MARKS off (ruling 5: the marks stay off; the quiet notes and About the figures carry the honesty)."
    : "  Remedy: put back what is missing (the mark beside AnswerCard's foot line, marks.tsx's An estimate, about-data's #reading), or keep NEXT_PUBLIC_SITE_PRIVATE=1 until it is.");
  return 1;
}

if (require.main === module) process.exit(main());
