/**
 * scripts/counts.ts , the one place a count about this repo is produced.
 *
 * WHY IT EXISTS. The gate count alone was stated at roughly 78 line locations
 * across 32 files, at TEN different values (25, 26, 31, 53, 58, 95, 98, 99, 101,
 * 102). Every one of those was typed by somebody who had just measured it, and
 * every one was true for a while. That is the whole defect: a number is wrong the
 * moment it is typed, because typing it is the act that decouples it from its
 * source. `docs/loop/artifacts/failure-log.md` records it as the class behind
 * every tick of this loop so far.
 *
 * So documents stop STATING counts and start CARRYING them. Each carrier holds a
 * marked block this script writes, and `--check` fails the chain when a block no
 * longer matches what the repo actually contains.
 *
 * WHAT A CARRIER MAY HOLD, narrowed 2026-08-19 after two consecutive ticks in
 * which this gate went red for a reason nobody cares about. Both firings were
 * file COUNTS moving, tracked files 2,810 to 2,812 to 2,814 as two workers
 * committed, and neither was the gate count, which is the quantity this whole
 * instrument exists to protect and which had not moved at all.
 *
 * This repo already knows where that ends: `verify_stated_totals` records that
 * the obvious version of itself "cried wolf fifteen times in sixteen" and was
 * deliberately narrowed, because a gate that fails for a trivial reason is a
 * gate that gets switched off. So a carrier now holds only counts that are
 * STABLE enough to be worth carrying: gates and routes, both of which change
 * when somebody decides they should. Tracked files, docs and scripts change
 * whenever anybody commits anything, so they are printed by this script on
 * demand and are no longer written into any document.
 *
 * That is a narrowing, not a weakening, and the test is whether the original
 * defect is still caught: the gate count stated at ten different values across
 * 32 files. It is. Nothing that was protected has stopped being protected.
 *
 * THE GATE REGISTRY, `scripts/gates.json` (plan-2026-09-17/02-ERRORS.md, step
 * 15). The fourth thing this script generates, and the first that is a whole
 * file rather than a block: one entry per gate in the GATES array, in the
 * array's order, with the gate's name, script, args, whether it opens a
 * browser, what it ASSERTS (the first sentence of its header), what it READS
 * (every repo path literal in its code) and what it CLAIMS (the literals it
 * bans or requires). `--write` regenerates it and `--check` reds when it no
 * longer matches the scripts, so the `counts-fresh` gate fails the chain on a
 * stale registry the same way it fails on a stale block. Its consumer is
 * `verify_gate_conflicts.ts`, which reds when one gate bans a literal that
 * another requires: with 141 gates the only other way to learn that two
 * disagree is for one to fail after the other was satisfied.
 *
 * HOW A CLAIM IS FOUND, and the registry says which way on every claim:
 *   declared  a line in the gate's header comment reading
 *             `gate-claims: bans "x", "y"; requires "z"` (either half optional).
 *   inferred  every string literal that is a DIRECT element of a list whose
 *             identifier carries the token BAN, BANS, BANNED, FORBIDDEN or
 *             NEVER (`const BANNED = [...]`, `new Set([...])` too), recorded
 *             as a ban. A TOKEN, not a substring: `SMB_SIZE_BANDS`, `divBands`
 *             and `GB_SPORTS_BANDS` contain "BAN" and are size bands, and a
 *             registry calling them ban lists would be a wrong fact in a
 *             generated file. A DIRECT element, not any literal inside: the
 *             vocabulary gate's list is objects (`{ re, word, say: 'say
 *             "revenue"' }`) and the internal-notes gate's is tuples with a
 *             label, and "say revenue" is not a banned string. Such a list
 *             yields nothing here and declares its claims with the line above
 *             when it wants the conflicts check to see them.
 * A gate with neither has `claims: []`, and the summary line on write counts
 * those plainly, so nobody reads a green conflicts check as "no conflicts".
 *
 * MODES
 *   (no args)  print the counts, touch nothing
 *   --write    rewrite every marked block in the carriers and scripts/gates.json
 *   --check    exit 1 if any block or the registry is stale, naming the fix
 *
 * THE GATE LIST IS PARSED WITH `strip_comments`, NOT GREPPED, and the
 * difference is not academic. The GATES array in `prebuild_all.ts` contains 35
 * comment blocks, several of which quote gate registrations verbatim while
 * explaining them. A naive `grep -c '{ name: "'` returns the right answer today
 * BY LUCK, and would drift the first time somebody writes an example in a
 * comment. The repo has a tested stripper for exactly this and it is used here,
 * on the file's TEXT: the runner is never imported, because importing it would
 * run the chain. The gate count is the parsed list's length, so the block and
 * the registry cannot disagree.
 *
 * WHAT IT CANNOT DO, stated: it counts what the repo contains, never whether a
 * count is the RIGHT thing for a document to say. A carrier can hold a perfectly
 * fresh number in a sentence that is nonsense. `tracked files` comes from
 * `git ls-files`, so it is a claim about the index rather than about the working
 * tree: a file that exists and is untracked is invisible here, deliberately,
 * because untracked files are not part of the repo. And `reads` sees a path
 * only when it is written as one literal: `join("src", "app")` names no
 * literal starting with `src/`, a template literal spanning lines is not
 * scanned, and a path built from a variable is invisible. A ban list whose
 * closing bracket the walker cannot find (a regex literal holding a lone `]`)
 * yields nothing rather than a guess.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { stripCommentLines } from "./lib/strip_comments";

const BEGIN = "<!-- counts:begin (generated by scripts/counts.ts, do not edit by hand) -->";
const END = "<!-- counts:end -->";

/** Every document that carries a generated block. Add a file here, not a number. */
const CARRIERS = [
  "CLAUDE.md",
  "docs/verification-protocol.md",
  "docs/loop/02-ORGANISATION-RESEARCH.md",
];

/** The one runner, and the whole-file artifact generated from its GATES array. */
const THE_LIST = "scripts/prebuild_all.ts";
const REGISTRY = "scripts/gates.json";

type Counts = {
  gates: number;
  trackedFiles: number;
  routes: number;
  docs: number;
  scripts: number;
};

/** One GATES entry as written in prebuild_all.ts. */
type GateEntry = { name: string; script: string; args: string[]; browser: boolean };

type Claim = {
  kind: "bans" | "requires";
  string: string;
  source: "declared" | "inferred";
  /** `gate-claims` for a declared claim; the list's identifier for an inferred one. */
  via: string;
};

type RegistryEntry = GateEntry & { asserts: string; reads: string[]; claims: Claim[] };

type Registry = { $comment: string; gates: RegistryEntry[] };

/** The registry's own summary, printed on write and on a passing check. */
type RegistrySummary = {
  gates: number;
  browser: number;
  parentRepo: number;
  noHeader: number;
  noClaims: number;
};

const NO_HEADER = "no header sentence: write one";
const PARENT_REPO_TAG = "parent repo";
/** The roots a `reads` literal may start with, repo-relative. */
const READ_ROOTS = ["src", "data", "docs", "public", "scratchpad", "scripts", "tests", "db", "content"];
/** A literal that reaches the parent repository, by the same two shapes
 *  `verify_no_parent_repo_reads` names: a drive path into atlas, or a climb. */
const PARENT_READ = /^(?:[A-Za-z]:[\\/]atlas[\\/]|\.\.\/(?:design|page-data)\/)/;
/** Identifier tokens that make a list a ban list. */
const BAN_TOKENS = new Set(["ban", "bans", "banned", "forbidden", "never"]);

function gitLines(args: string[]): string[] {
  const out = execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return out.split("\n").filter(Boolean);
}

/* ---- the GATES array, read as text ------------------------------------- */

/** The string literals on one code line, in order, unquoted. Single-line only. */
const LITERAL = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\\n]|\\.)*)`/g;

function unescape(raw: string): string {
  return raw.replace(/\\(.)/g, (_, c: string) => (c === "n" ? "\n" : c === "t" ? "\t" : c));
}

function literalsIn(code: string): string[] {
  const out: string[] = [];
  for (const m of code.matchAll(LITERAL)) out.push(unescape(m[1] ?? m[2] ?? m[3] ?? ""));
  return out;
}

/** GATES entries in prebuild_all.ts, comments stripped so a quoted example cannot count. */
function parseGates(): GateEntry[] {
  const lines = fs.readFileSync(THE_LIST, "utf8").split("\n");
  const code = stripCommentLines(lines);
  const start = code.findIndex((l) => /^\s*const GATES\s*:\s*Gate\[\]\s*=\s*\[/.test(l));
  if (start === -1) throw new Error(`[counts] ${THE_LIST} holds no \`const GATES: Gate[] = [\` line`);
  const entries: GateEntry[] = [];
  for (let i = start + 1; i < code.length; i++) {
    const line = code[i];
    if (/^\s*\];/.test(line)) break;
    if (!/^\s*\{\s*name:\s*"/.test(line)) continue;
    /* Every entry is one line today; an entry that grows a second line is
       gathered up to its closing brace so a field on line two is not lost. */
    let text = line;
    let j = i;
    while (!/\}\s*,?\s*$/.test(text) && j + 1 < code.length) text += " " + code[++j];
    i = j;
    const name = /name:\s*"((?:[^"\\]|\\.)*)"/.exec(text)?.[1];
    const script = /script:\s*"((?:[^"\\]|\\.)*)"/.exec(text)?.[1];
    if (name === undefined || script === undefined) {
      throw new Error(`[counts] ${THE_LIST}:${i + 1}: a GATES entry without a name or a script: ${text.trim()}`);
    }
    const argsText = /args:\s*\[([^\]]*)\]/.exec(text)?.[1] ?? "";
    entries.push({
      name: unescape(name),
      script: unescape(script),
      args: literalsIn(argsText),
      browser: /\bbrowser:\s*true\b/.test(text),
    });
  }
  return entries;
}

/* ---- what one gate asserts, reads and claims --------------------------- */

/** The leading block comment's prose, `*` gutters removed, or null. */
function leadingHeader(src: string): string | null {
  const trimmed = src.replace(/^﻿/, "").replace(/^(?:#![^\n]*\n)?\s*/, "");
  if (!trimmed.startsWith("/*")) return null;
  const close = trimmed.indexOf("*/");
  if (close === -1) return null;
  return trimmed
    .slice(2, close)
    .replace(/^\*+/, "")
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, "").replace(/\s+$/, ""))
    .join("\n");
}

/** A line that is furniture rather than prose: the file's own name, or a usage line. */
const FURNITURE = /^(?:\S+\.(?:ts|tsx|mjs|js)|(?:Run|Usage):.*)$/;

/**
 * The first sentence of a header, trimmed to 200 characters. Ends at the first
 * `.`, `!` or `?` that is followed by white space (so `.ts` and `2.5` do not
 * end it), skipping the abbreviations this repo's headers actually use.
 */
function firstSentence(header: string): string | null {
  const lines = header.split("\n").map((l) => l.trim());
  while (lines.length > 0 && (lines[0] === "" || FURNITURE.test(lines[0]))) lines.shift();
  const text = lines
    .join(" ")
    .replace(/[ --]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return null;
  const re = /[.!?]["')\]]*(?=\s|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const upTo = text.slice(0, m.index + 1);
    /* Neither an abbreviation nor a list number ("...data: 1. getCities...") ends a sentence. */
    if (/\b(?:e\.g|i\.e|vs|approx)\.$/i.test(upTo) || /(?:^|\s)\d{1,2}\.$/.test(upTo)) continue;
    return text.slice(0, m.index + m[0].length).slice(0, 200);
  }
  return text.slice(0, 200);
}

/** A vitest-style title, for a file under tests/ that has no header. */
function firstTestTitle(code: string): string | null {
  const m = /\b(?:describe|test|it)\(\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`)/.exec(code);
  return m ? unescape(m[1] ?? m[2] ?? m[3] ?? "") : null;
}

/** Every repo path literal in the code half, plus the parent-repo tag. */
function readsOf(codeLines: string[]): string[] {
  const out = new Set<string>();
  for (const line of codeLines) {
    for (const lit of literalsIn(line)) {
      if (READ_ROOTS.some((root) => lit.startsWith(root + "/"))) out.add(lit);
      if (PARENT_READ.test(lit)) {
        out.add(lit);
        out.add(PARENT_REPO_TAG);
      }
    }
  }
  return [...out].sort();
}

/** Does this identifier carry a ban token? Split on `_` and camel boundaries. */
function isBanIdentifier(id: string): boolean {
  return id
    .split(/_|(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/)
    .some((tok) => BAN_TOKENS.has(tok.toLowerCase()));
}

/**
 * The top-level pieces of a bracketed list body, split at depth-0 commas with
 * strings respected. Returns null when the closing bracket never comes.
 */
function listPieces(code: string, open: number): string[] | null {
  const pieces: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let start = open + 1;
  for (let k = open; k < code.length; k++) {
    const ch = code[k];
    if (quote) {
      if (ch === "\\") k++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === "[" || ch === "{" || ch === "(") depth++;
    else if (ch === "]" || ch === "}" || ch === ")") {
      depth--;
      if (depth === 0) {
        pieces.push(code.slice(start, k));
        return pieces;
      }
    } else if (ch === "," && depth === 1) {
      pieces.push(code.slice(start, k));
      start = k + 1;
    }
  }
  return null;
}

const LIST_HEAD = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=\n]*?)?=\s*(?:new\s+Set\s*\(\s*)?\[/g;

/** Inferred bans: direct string elements of every ban-named list. */
function inferredClaims(code: string): Claim[] {
  const out: Claim[] = [];
  for (const m of code.matchAll(LIST_HEAD)) {
    const id = m[1];
    if (!isBanIdentifier(id)) continue;
    const pieces = listPieces(code, m.index! + m[0].length - 1);
    if (!pieces) continue;
    for (const raw of pieces) {
      const piece = raw.trim();
      if (!/^(?:"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\\n]|\\.)*`)$/.test(piece)) continue;
      out.push({ kind: "bans", string: literalsIn(piece)[0], source: "inferred", via: id });
    }
  }
  return out;
}

/** Declared claims: `gate-claims: bans "x", "y"; requires "z"` lines in the header. */
function declaredClaims(header: string | null): Claim[] {
  const out: Claim[] = [];
  if (!header) return out;
  for (const line of header.split("\n")) {
    const m = /^\s*gate-claims:\s*(.*)$/i.exec(line);
    if (!m) continue;
    for (const half of m[1].split(";")) {
      const h = /^\s*(bans|requires)\b\s*(.*)$/i.exec(half);
      if (!h) continue;
      const kind = h[1].toLowerCase() as Claim["kind"];
      for (const s of literalsIn(h[2])) out.push({ kind, string: s, source: "declared", via: "gate-claims" });
    }
  }
  return out;
}

function dedupeClaims(claims: Claim[]): Claim[] {
  const seen = new Set<string>();
  return claims.filter((c) => {
    const key = `${c.kind} ${c.string}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function describe(gate: GateEntry): RegistryEntry {
  if (!fs.existsSync(gate.script)) {
    throw new Error(`[counts] gate "${gate.name}" names ${gate.script}, which does not exist`);
  }
  const src = fs.readFileSync(gate.script, "utf8");
  const header = leadingHeader(src);
  const codeLines = stripCommentLines(src.split("\n"));
  const code = codeLines.join("\n");
  const asserts =
    (header ? firstSentence(header) : null) ??
    (gate.script.startsWith("tests/") ? firstTestTitle(code) : null) ??
    NO_HEADER;
  return {
    ...gate,
    asserts,
    reads: readsOf(codeLines),
    claims: dedupeClaims([...declaredClaims(header), ...inferredClaims(code)]),
  };
}

function buildRegistry(gates: GateEntry[]): Registry {
  return {
    $comment:
      `Generated by \`npx tsx scripts/counts.ts --write\` from the GATES array in ${THE_LIST}; ` +
      "do not edit by hand, the counts-fresh gate reds when this file is stale. " +
      "One entry per gate in the array's order. `asserts` is the first sentence of the script's " +
      "header; `reads` is every repo path literal in its code (`parent repo` tags a read outside " +
      "this repository); `claims` is what it bans or requires, `declared` by a `gate-claims:` header " +
      "line or `inferred` from a ban-named list. Read by scripts/verify_gate_conflicts.ts.",
    gates: gates.map(describe),
  };
}

function renderRegistry(reg: Registry): string {
  return JSON.stringify(reg, null, 2) + "\n";
}

function summarise(reg: Registry): RegistrySummary {
  const g = reg.gates;
  return {
    gates: g.length,
    browser: g.filter((e) => e.browser).length,
    parentRepo: g.filter((e) => e.reads.includes(PARENT_REPO_TAG)).length,
    noHeader: g.filter((e) => e.asserts === NO_HEADER).length,
    noClaims: g.filter((e) => e.claims.length === 0).length,
  };
}

function summaryLine(s: RegistrySummary): string {
  return (
    `[counts] ${REGISTRY}: ${s.gates} gates, ${s.browser} open a browser, ` +
    `${s.parentRepo} read the parent repo, ${s.noHeader} have no header sentence, ` +
    `${s.noClaims} carry no claims (the conflicts check cannot see those)`
  );
}

/* ---- the counts and the carriers --------------------------------------- */

function measure(gates: GateEntry[]): Counts {
  const tracked = gitLines(["ls-files"]);
  return {
    gates: gates.length,
    trackedFiles: tracked.length,
    routes: tracked.filter((f) => /^src\/app\/.*\/page\.tsx$/.test(f) || f === "src/app/page.tsx")
      .length,
    docs: tracked.filter((f) => f.startsWith("docs/")).length,
    scripts: tracked.filter((f) => f.startsWith("scripts/")).length,
  };
}

/** The block body. One fact per line, each naming how it was counted. */
function render(c: Counts): string {
  return [
    BEGIN,
    `- **${c.gates}** gates in the prebuild chain (\`GATES\` in \`scripts/prebuild_all.ts\`, comments stripped)`,
    `- **${c.routes}** App Router page routes`,
    "",
    `Generated by \`npx tsx scripts/counts.ts --write\`. Do not type these numbers anywhere; carry this block instead.`,
    END,
  ].join("\n");
}

function replaceBlock(text: string, block: string): string | null {
  const i = text.indexOf(BEGIN);
  const j = text.indexOf(END);
  if (i === -1 || j === -1 || j < i) return null;
  return text.slice(0, i) + block + text.slice(j + END.length);
}

function main() {
  const args = process.argv.slice(2);
  const write = args.includes("--write");
  const check = args.includes("--check");
  const gates = parseGates();
  const counts = measure(gates);
  const block = render(counts);
  const registry = buildRegistry(gates);
  const registryText = renderRegistry(registry);
  const summary = summarise(registry);

  if (!write && !check) {
    console.log(block);
    console.log(summaryLine(summary));
    return;
  }

  const stale: string[] = [];
  const missing: string[] = [];

  for (const file of CARRIERS) {
    if (!fs.existsSync(file)) {
      missing.push(file);
      continue;
    }
    const text = fs.readFileSync(file, "utf8");
    const next = replaceBlock(text, block);
    if (next === null) {
      missing.push(file);
      continue;
    }
    if (next !== text) {
      if (write) fs.writeFileSync(file, next);
      else stale.push(file);
    }
  }

  /* The registry is a whole generated file, so "stale" is "differs from what
     the scripts say now", and a missing file is simply stale. Line endings are
     normalised before comparing so a checkout that rewrote them cannot red. */
  const onDisk = fs.existsSync(REGISTRY) ? fs.readFileSync(REGISTRY, "utf8").replace(/\r\n/g, "\n") : null;
  if (onDisk !== registryText) {
    if (write) fs.writeFileSync(REGISTRY, registryText);
    else stale.push(REGISTRY);
  }

  if (missing.length > 0) {
    console.error(
      `[counts] FAIL: ${missing.length} carrier(s) have no counts block: ${missing.join(", ")}`,
    );
    console.error(`Add the markers, then run: npx tsx scripts/counts.ts --write`);
    process.exit(1);
  }

  if (check && stale.length > 0) {
    console.error(`[counts] FAIL: ${stale.length} generated file(s) are stale:`);
    for (const f of stale) {
      console.error(
        f === REGISTRY
          ? `  ${f} (the gate registry no longer matches the GATES array and the gate scripts)`
          : `  ${f} (a stale counts block)`,
      );
    }
    /* cog's --check-fail-msg, copied on purpose: a failure that does not name the
       command that fixes it costs the reader a search every single time. */
    console.error(`\nFix with: npx tsx scripts/counts.ts --write`);
    process.exit(1);
  }

  console.log(
    write
      ? `[counts] wrote ${CARRIERS.length} carrier(s) and ${REGISTRY}: ${counts.gates} gates, ${counts.trackedFiles} tracked files, ${counts.routes} routes`
      : `[counts] PASS: ${CARRIERS.length} carrier(s) and ${REGISTRY} current (${counts.gates} gates, ${counts.trackedFiles} tracked files, ${counts.docs} docs, ${counts.scripts} scripts, ${counts.routes} routes)`,
  );
  console.log(summaryLine(summary));
}

main();
