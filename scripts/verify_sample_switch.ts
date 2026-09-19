/**
 * scripts/verify_sample_switch.ts
 *
 * Prebuild gate, plan step 48 (2026-09-19): THE SAMPLE SWITCH IS A LAUNCH GATE.
 *
 * `areSampleMarksVisible()` (src/lib/feature_flags.ts) defaults to hidden
 * because he is the only reader (his 2026-09-11 switch), and its header says
 * the marks must come back BEFORE anyone else opens the site, or the site
 * asserts modelled figures as measured ones. Nothing noticed the day that
 * flips. This gate does: a build with the marks hidden passes only while the
 * site declares itself private, `NEXT_PUBLIC_SITE_PRIVATE=1`, and fails with
 * the one sentence the plan prescribes otherwise:
 *
 *     the site is not private and the sample marks are off
 *
 * WHERE THE TWO FLAGS ARE READ. The process environment first (Vercel's
 * variables, a shell), then `.env.production` (COMMITTED, the one env file
 * git keeps: it holds public flags only, never a secret, and is the versioned
 * statement "this site is private" that launch day flips in one commit), then
 * `.env.local` (a local override, never committed). Next.js loads the same
 * files for `NEXT_PUBLIC_` values at build, so what this gate reads is what
 * the build bakes in. The chain must never need the network or a secret, and
 * this gate reads neither.
 *
 * THE DEPLOY CHECKLIST LINE (docs/DEPLOY-PACK-spine-flags.md, "Launch day"):
 * the day the site opens, `NEXT_PUBLIC_SITE_PRIVATE` comes off `.env.production`
 * and `NEXT_PUBLIC_SHOW_SAMPLE_MARKS=1` goes in, in the same commit; this gate
 * turns red on any build that does one without the other.
 *
 * This measurement cannot distinguish a flag set in Vercel's dashboard from
 * one in the file: it reads the process environment first, which is where
 * Vercel puts its variables, and prints which source it read.
 *
 * Planted 2026-09-19: with `.env.production` emptied of the private flag and
 * no environment override the gate printed the sentence and exited 1; restored,
 * it passed. Exit 0 on pass, 1 on the sentence.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "..");

type Source = "environment" | ".env.production" | ".env.local" | "unset";

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

function readFlag(name: string): { on: boolean | null; source: Source } {
  const fromEnv = isOn(process.env[name]);
  if (fromEnv != null) return { on: fromEnv, source: "environment" };
  const prod = isOn(parseEnvFile(resolve(ROOT, ".env.production"))[name]);
  if (prod != null) return { on: prod, source: ".env.production" };
  const local = isOn(parseEnvFile(resolve(ROOT, ".env.local"))[name]);
  if (local != null) return { on: local, source: ".env.local" };
  return { on: null, source: "unset" };
}

function main(): number {
  const marks = readFlag("NEXT_PUBLIC_SHOW_SAMPLE_MARKS");
  const priv = readFlag("NEXT_PUBLIC_SITE_PRIVATE");
  const marksOn = marks.on === true; // the flag's default is hidden (feature_flags.ts)
  const sitePrivate = priv.on === true;
  console.log(`sample-switch: sample marks ${marksOn ? "ON" : "OFF"} (${marks.source}); site private ${sitePrivate ? "YES" : "NO"} (${priv.source})`);
  if (marksOn) {
    console.log("sample-switch: PASS (the marks are on; whether the site is private does not matter)");
    return 0;
  }
  if (sitePrivate) {
    console.log("sample-switch: PASS (the marks are off and the site declares itself private; launch day flips both in one commit, see docs/DEPLOY-PACK-spine-flags.md)");
    return 0;
  }
  console.log("sample-switch: FAIL: the site is not private and the sample marks are off");
  console.log("  Remedy: set NEXT_PUBLIC_SHOW_SAMPLE_MARKS=1 (the launch state) or NEXT_PUBLIC_SITE_PRIVATE=1 (the private state) in .env.production; never both off.");
  return 1;
}

process.exit(main());
