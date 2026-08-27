#!/usr/bin/env node
/**
 * scripts/ship_check.mjs , THE ONLY SANCTIONED GATE BEFORE A GO-LIVE RECOMMENDATION.
 *
 * WHY. Work was recommended live without the whole reader journey ever being
 * photographed, and the founder rejected the result. This script is the fix:
 * no go-live recommendation may be made unless every one of the three checks
 * below passes, in this order, and every failure is reported at once (not
 * just the first one hit), in plain language a founder can act on without
 * reading code.
 *
 * Checks, in order:
 *   1. WALK STRIP FRESH   the newest design/critique/WALK-*.html exists and
 *      is not older than the newest commit that touched src/. A strip taken
 *      before the last code change shows a page that no longer exists.
 *   2. CHAIN CLEAN        the gate-chain log named with --chain actually
 *      finished, in full, with nothing failing: a "REAL EXIT CODE: 0" line
 *      and a "Ran: N / N gates" line where both numbers match.
 *   3. DOSSIER COVERS THE WALK   the newest design/critique/dossier-*.json
 *      carries exactly the seven walk pages, including home, countries-list
 *      and country-gb. Fewer than seven means part of the journey was never
 *      captured.
 *
 * On PASS, prints the founder checklist: the walk strip path to deliver, the
 * reminder that nothing flips without the founder's APPROVE, and the
 * reminder that the go-live message itself must carry the strip.
 *
 * Usage:
 *   node scripts/ship_check.mjs --chain <path-to-gate-chain-log>
 *
 * Exit code is the only thing an automated caller should trust: 0 means every
 * check passed, 1 means at least one did not. Read exit codes from a file
 * (redirect, then read), never from a pipe: a pipe reports the exit code of
 * whatever is last in the pipeline, not of this script.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const CRITIQUE_DIR = "E:/atlas/design/critique";
const WALK_PATTERN = /^WALK-.*\.html$/i;
const DOSSIER_PATTERN = /^dossier-.*\.json$/i;
const REQUIRED_PAGES = ["home", "countries-list", "country-gb"];
const WALK_PAGE_COUNT = 7;

function parseArgs(argv) {
  const out = { chain: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--chain") out.chain = argv[i + 1] ?? null;
  }
  return out;
}

/** The newest file in CRITIQUE_DIR matching `pattern`, or null if none exist. */
function newestMatching(pattern) {
  if (!existsSync(CRITIQUE_DIR)) return null;
  const files = readdirSync(CRITIQUE_DIR).filter((f) => pattern.test(f));
  if (files.length === 0) return null;
  let newest = null;
  for (const file of files) {
    const full = path.join(CRITIQUE_DIR, file);
    const stat = statSync(full);
    if (!newest || stat.mtimeMs > newest.mtimeMs) newest = { file, full, mtimeMs: stat.mtimeMs };
  }
  return newest;
}

function humanTime(ms) {
  return new Date(ms).toISOString();
}

const failures = [];

/* ---------- 1. WALK STRIP FRESH ---------- */
const walk = newestMatching(WALK_PATTERN);
if (!walk) {
  failures.push(
    `WALK STRIP MISSING. There is no walk strip at all (design/critique/WALK-*.html). ` +
      `Nobody has photographed the whole reader journey, home through country through city ` +
      `through neighbourhood through trade, so there is nothing to check freshness against. ` +
      `Run build_walk_strip.mjs first.`,
  );
} else {
  let srcCommitEpoch = null;
  let srcCommitHash = null;
  try {
    const raw = execFileSync("git", ["log", "-1", "--format=%H%x09%ct", "--", "src/"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
    }).trim();
    if (raw) {
      const [hash, epoch] = raw.split("\t");
      srcCommitHash = hash;
      srcCommitEpoch = parseInt(epoch, 10);
    }
  } catch {
    failures.push(
      `WALK STRIP FRESHNESS UNKNOWN. Could not ask git for the newest commit touching src/ ` +
        `(the git command itself failed). Freshness cannot be confirmed, so this counts as a ` +
        `refusal, not a pass.`,
    );
  }

  if (srcCommitEpoch != null && !Number.isNaN(srcCommitEpoch)) {
    const walkEpoch = Math.floor(walk.mtimeMs / 1000);
    if (walkEpoch < srcCommitEpoch) {
      failures.push(
        `WALK STRIP STALE. The walk strip is older than the newest code change. ` +
          `Strip "${walk.file}" was captured ${humanTime(walk.mtimeMs)}, but src/ was last ` +
          `changed at ${humanTime(srcCommitEpoch * 1000)} in commit ${srcCommitHash?.slice(0, 12)}. ` +
          `The strip shows a page that no longer exists. Re-run build_walk_strip.mjs and try again.`,
      );
    }
  }
}

/* ---------- 2. CHAIN CLEAN ---------- */
const args = parseArgs(process.argv.slice(2));
if (!args.chain) {
  failures.push(
    `CHAIN LOG NOT NAMED. ship_check needs --chain <path> pointing at the file the gate chain ` +
      `wrote its output to. Nothing about the gate chain was checked because no file was named.`,
  );
} else if (!existsSync(args.chain)) {
  failures.push(
    `CHAIN LOG MISSING. The gate-chain log named ("${args.chain}") does not exist. There is no ` +
      `record that the full gate chain ran, let alone that it ran clean.`,
  );
} else {
  const chainText = readFileSync(args.chain, "utf8");
  const exitLine = chainText.match(/^.*REAL EXIT CODE:.*$/m);
  const ranLine = chainText.match(/^.*Ran:\s*(\d+)\s*\/\s*(\d+)\s*gates.*$/m);
  const exitIsZero = /REAL EXIT CODE:\s*0\b/.test(chainText);
  const ranIsFull = !!ranLine && ranLine[1] === ranLine[2];

  if (!exitIsZero || !ranIsFull) {
    const bits = [`CHAIN NOT CLEAN. The gate chain recorded in "${args.chain}" did not finish clean.`];
    bits.push(
      exitLine
        ? `It found: "${exitLine[0].trim()}".`
        : `It found no "REAL EXIT CODE" line at all, so the chain's real result is unknown.`,
    );
    bits.push(
      ranLine
        ? `It found: "${ranLine[0].trim()}".`
        : `It found no "Ran: N / N gates" line at all, so it cannot confirm every gate ran.`,
    );
    failures.push(bits.join(" "));
  }
}

/* ---------- 3. DOSSIER COVERS THE WALK ---------- */
const dossier = newestMatching(DOSSIER_PATTERN);
if (!dossier) {
  failures.push(
    `DOSSIER MISSING. There is no page dossier at all (design/critique/dossier-*.json), so ` +
      `nobody can confirm the whole seven-page walk was captured.`,
  );
} else {
  let parsed = null;
  try {
    parsed = JSON.parse(readFileSync(dossier.full, "utf8"));
  } catch {
    failures.push(
      `DOSSIER UNREADABLE. "${dossier.file}" is not valid JSON, so it cannot be confirmed to ` +
        `cover the seven-page walk.`,
    );
  }

  if (parsed) {
    const pages = Array.isArray(parsed.pages) ? parsed.pages : [];
    const pageIds = pages.map((p) => p && p.page).filter(Boolean);
    const missingRequired = REQUIRED_PAGES.filter((id) => !pageIds.includes(id));

    if (pageIds.length !== WALK_PAGE_COUNT || missingRequired.length > 0) {
      const bits = [
        `DOSSIER INCOMPLETE. "${dossier.file}" does not cover the whole seven-page walk.`,
        `It carries ${pageIds.length} page(s)${pageIds.length ? ` (${pageIds.join(", ")})` : ""}.`,
      ];
      if (missingRequired.length > 0) bits.push(`Missing required page(s): ${missingRequired.join(", ")}.`);
      failures.push(bits.join(" "));
    }
  }
}

/* ---------- verdict ---------- */
if (failures.length > 0) {
  console.error(`SHIP CHECK: REFUSED (${failures.length} reason${failures.length === 1 ? "" : "s"})\n`);
  failures.forEach((f, i) => console.error(`${i + 1}. ${f}\n`));
  console.error(`This cannot ship. Fix the reason(s) above and run ship_check again.`);
  process.exit(1);
} else {
  console.log(`SHIP CHECK: PASS\n`);
  console.log(`Founder checklist before recommending go-live:`);
  console.log(`  1. Deliver the walk strip: ${walk.full.replace(/\\/g, "/")}`);
  console.log(`  2. Nothing flips without the founder's APPROVE.`);
  console.log(`  3. The go-live message itself must contain the strip. No strip in the message, no recommendation.`);
  process.exit(0);
}
