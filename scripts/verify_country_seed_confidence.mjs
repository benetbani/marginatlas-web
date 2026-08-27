#!/usr/bin/env node
/**
 * scripts/verify_country_seed_confidence.mjs
 *
 * Finding C1a (2026-08-28 review round on src/lib/spine/adapt_country.ts).
 *
 * WHY STATIC, NOT RUNTIME. buildSpineCountrySeed needs the database
 * (getCellBySlug, through withBudget, for the money block) to resolve, and
 * CLAUDE.md's working method says plainly: "the prebuild chain must never
 * need the network or a secret. A gate that can fail on a blip is a gate that
 * gets switched off." So this gate never calls buildSpineCountrySeed. It
 * reads the adapter's SOURCE and checks two structural honesty rules against
 * the text itself, the same move verify_no_slot_counting and
 * verify_dev_routes_sealed already make for their own rules.
 *
 * RULE 1. Every top-level block the returned seed object assembles must
 * carry a `_meta` with a `confidence` field somewhere in the expression that
 * BUILDS it (plan correction 4). The keys come straight from the file's own
 * `return { ... }` object literal, so a new block added later is picked up
 * without editing this gate. Each key is isolated to its own const's span,
 * from that `const NAME = ...` declaration to the next top-level `const` (or
 * the return statement), so a missing _meta in ONE block cannot hide behind a
 * different block's _meta appearing later in the same file. A binary
 * "somewhere in the whole file" search would not catch that: it would still
 * find A _meta.confidence pattern and call every block honest.
 *
 * RULE 2 (plan correction 1, mechanically enforced, so it cannot regress
 * silently a second time). Two independent checks on the comment-stripped
 * source:
 *   a. no import line names country_profile_v2. Payroll and tax figures come
 *      from src/lib/tax/country_rates.ts only; this file may still call
 *      getCountryProfile (which itself wraps country_profile_v2.json) for
 *      wages, rent, stability and the rest, so the check is on the FILE'S
 *      OWN import statements, not on whether the json name appears anywhere.
 *   b. the field name employer_social_pct, the profile's rival payroll
 *      figure, never appears in the file at all.
 *
 * COMMENTS ARE STRIPPED FIRST with scripts/lib/strip_comments, per CLAUDE.md's
 * own house rule: `line.trim().startsWith("//")` only understands the first
 * line of a block comment, and this adapter's header is mostly prose that
 * names "_meta", "confidence" and "country_profile_v2" while explaining the
 * very rules this gate checks. A naive scan would read its own documentation
 * as the code satisfying the rule.
 *
 * TARGET FILE OVERRIDE, for the negative test. Pass a path as argv[2], or set
 * COUNTRY_SEED_ADAPTER_FILE, to point this gate at a scratch copy instead of
 * the real adapter. This is how the gate is proven to fail on a real defect
 * without ever touching the file it protects: copy the adapter, delete one
 * block's _meta from the COPY, run the gate against the copy's path. Neither
 * override is read by prebuild_all.ts, which always invokes this with zero
 * args against the real file.
 *
 * Run: npx tsx scripts/verify_country_seed_confidence.mjs [path]
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

import { stripCommentLines } from "./lib/strip_comments";

const ROOT = process.cwd();
const TARGET =
  process.argv[2] || process.env.COUNTRY_SEED_ADAPTER_FILE || "src/lib/spine/adapt_country.ts";
const ABS = resolve(ROOT, TARGET);

let failed = 0;
const log = (line) => console.log(line);

if (!existsSync(ABS)) {
  console.error(`FAIL  ${TARGET} does not exist`);
  process.exit(1);
}

const rawLines = readFileSync(ABS, "utf8").split("\n");
const codeLines = stripCommentLines(rawLines);
const code = codeLines.join("\n");

/* ---- Rule 2: plan correction 1, mechanically enforced ------------------ */

// An import statement naming country_profile_v2, in any form (default,
// named, type-only). getCountryProfile's own wrapper module is allowed to
// hold this import; THIS adapter is not.
const IMPORT_LINE = /^\s*import\b[^\n]*country_profile_v2/m;
if (IMPORT_LINE.test(code)) {
  failed += 1;
  log(`FAIL  ${TARGET} imports country_profile_v2 directly.`);
  log("      Plan correction 1: payroll and tax figures come from src/lib/tax/country_rates.ts");
  log("      only. Read the profile through getCountryProfile for wages, rent and stability if");
  log("      you need those, but never import the json itself here.");
} else {
  log(`PASS  ${TARGET} does not import country_profile_v2`);
}

const RIVAL_FIELD = /\bemployer_social_pct\b/;
if (RIVAL_FIELD.test(code)) {
  failed += 1;
  log(`FAIL  ${TARGET} reads employer_social_pct, the profile's rival payroll figure.`);
  log("      Plan correction 1: the tax module's employerSocial (src/lib/tax/country_rates.ts)");
  log("      is the only payroll rate this file may read.");
} else {
  log(`PASS  ${TARGET} never reads employer_social_pct`);
}

/* ---- Rule 1: every returned block carries _meta.confidence ------------- */

// The seed's own return statement is the only one this file writes, and it
// is the last construct in the function, so the LAST "return {" in the file
// is unambiguous.
const returnIdx = code.lastIndexOf("return {");
if (returnIdx === -1) {
  failed += 1;
  log(`FAIL  ${TARGET}: no "return {" found, cannot locate the seed's returned object`);
} else {
  const returnBlock = code.slice(returnIdx);
  const closeIdx = returnBlock.indexOf("\n}");
  const objectBody = closeIdx === -1 ? returnBlock : returnBlock.slice(0, closeIdx);

  // One entry per line: shorthand "key," or explicit "key: varName,".
  const entryPattern = /^\s*(\w+)\s*(?::\s*(\w+))?\s*,?\s*$/;
  const entries = [];
  for (const line of objectBody.split("\n").slice(1)) {
    const trimmed = line.trim();
    if (trimmed === "") continue;
    const m = entryPattern.exec(line);
    if (m) entries.push({ key: m[1], varName: m[2] || m[1] });
  }

  if (entries.length === 0) {
    failed += 1;
    log(`FAIL  ${TARGET}: found "return {" but could not parse a single key out of it`);
  } else {
    // Every top-level "const NAME = ..." declaration in the file, in order,
    // by START index, so a block's own span can be bounded by the NEXT one.
    // Matches a type-annotated declaration too (`const x: T = ...`): the
    // lazy [\s\S]*? scans across the annotation, including one that itself
    // wraps multiple lines, to the assignment operator.
    const constPattern = /^ {2}const (\w+)\b[\s\S]*?=/gm;
    const consts = [];
    let cm;
    while ((cm = constPattern.exec(code)) !== null) {
      consts.push({ name: cm[1], start: cm.index });
      // Advance past this match's own start so overlapping "const" text
      // inside a long type annotation cannot be mistaken for a second
      // declaration at the same position.
      constPattern.lastIndex = Math.max(constPattern.lastIndex, cm.index + 1);
    }

    for (const { key, varName } of entries) {
      const declIdx = consts.findIndex((c) => c.name === varName);
      if (declIdx === -1) {
        failed += 1;
        log(`FAIL  ${key}: no "const ${varName} =" declaration found for this returned key`);
        continue;
      }
      const start = consts[declIdx].start;
      const end = declIdx + 1 < consts.length ? consts[declIdx + 1].start : returnIdx;
      const span = code.slice(start, end);
      const hasMetaConfidence = /_meta\s*:\s*\{[^}]*confidence\s*:/.test(span);
      if (hasMetaConfidence) {
        log(`PASS  ${key} (const ${varName}) carries _meta.confidence`);
      } else {
        failed += 1;
        log(`FAIL  ${key} (const ${varName}) has no _meta.confidence in the expression that builds it`);
      }
    }
  }
}

if (failed > 0) {
  console.error(`\nverify_country_seed_confidence: ${failed} failure(s) in ${TARGET}`);
  process.exit(1);
}
log(
  `\nverify_country_seed_confidence: every returned block in ${TARGET} carries _meta.confidence, ` +
    "and the file never reaches into country_profile_v2 for a payroll or tax figure.",
);
process.exit(0);
