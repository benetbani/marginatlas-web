/**
 * scripts/audit_gate_reds.mjs , does every gate's red name a file, a rule and
 * a remedy? A static census of the chain's failure text, and a ratchet on it.
 *
 * WHY. plan-2026-09-17/02-ERRORS.md, step 16: "Every red names a file, a line,
 * a rule and a remedy." A chain run printed "cream grew 5 to 6" and the line
 * cost a deploy and a search; "x no-cream src/app/globals.css:1099: #fffaf8
 * in .focal. Remedy: use a token" would have cost a minute. Nobody can plant
 * 142 faults to read 142 reds, so this reads the gates' SOURCE instead: for
 * each script in the GATES array it collects the text that can reach a
 * non-zero exit and asks three questions of it.
 *
 *   path?    does it print a file: a `${file}`-style interpolation (with a
 *            `:${line}` when there is one), a constant that holds a path, a
 *            path literal, or a call to scripts/lib/red with a `file` field
 *   rule?    does it name the rule: the gate's chain name, the script's stem,
 *            a rule word in capitals, or a red() call (which takes the rule)
 *   remedy?  does it say what to do: "Remedy:", "Fix with", "run", "replace",
 *            "use the token" and a generous list more; the phrase matched is
 *            printed so the credit can be checked
 *
 * The GATES array is PARSED OUT OF prebuild_all.ts's text, never imported:
 * importing it runs the chain. Comments are stripped first with
 * scripts/lib/strip_comments, because that array's comments quote gate
 * registrations verbatim, and so do many gates' headers quote their own reds.
 *
 * WHAT "THE TEXT THAT CAN REACH A NON-ZERO EXIT" MEANS HERE, since it is a
 * static guess about control flow: every string literal that starts within
 * twenty lines above a `process.exit(<not 0>)`, `process.exitCode =` or
 * `throw new Error`, within the statement of a call to a helper named like
 * fail/red/problem/violation or a `.push(` into an array named like
 * reds/errors/violations/grown/stale, or within the ten lines after such a
 * helper's declaration. A gate that spawns another script with `tsx` (the
 * counts-fresh wrapper) has that child's text read too, one level down.
 *
 * WHAT THIS MEASUREMENT CANNOT DISTINGUISH, stated before it is quoted:
 *   - a path printed on a PASS line that happens to sit inside a window from
 *     one printed on the red (credit given falsely: the census is lenient);
 *   - `${f}` naming a file from `${f}` naming a figure (it credits by the
 *     variable's NAME, never its value; the evidence column shows which);
 *   - a red printed by a child process it did not follow, a helper imported
 *     from another module, or a `${msg}` whose text was built elsewhere (no
 *     credit given: the census is strict there);
 *   - a remedy verb used as prose ("this file should never...") from an
 *     imperative remedy (credit given; the phrase is printed to be judged).
 * So a `yes` is a claim with its evidence beside it, and a `no` is a gate to
 * open; neither is a proof. The planted-fault proofs in the step's report are
 * the proofs, and there are two of them, not 142.
 *
 * TESTS. Files under tests/ are in the chain too. The brief for this script
 * believed they were vitest files, whose failure output names file and line
 * by construction; they are not. They are self-running tsx scripts with a
 * hand-rolled `check`/`assert` that prints `FAIL <name>` or `x <message>`
 * and nothing else, so their reds name no file and no line at all. They are
 * classified like every other gate, marked `test` in the kind column, and
 * counted, with the split shown at the foot, because a census that skipped
 * a quarter of the chain on a false premise would not be a census.
 *
 * THE RATCHET. `--write-baseline` writes the three counts to
 * scripts/gate_reds_baseline.json. Without the flag the script exits 1 when
 * any count is ABOVE its stored number, and 0 otherwise, including when no
 * baseline exists yet (the first run is the baseline's own evidence). A
 * baseline falls and never rises: a count that fell is written down by the
 * change that lowered it, never regenerated to clear a red.
 *
 * Run:  npx tsx scripts/audit_gate_reds.mjs [--write-baseline] [--verbose]
 *       (plain `node` runs it too: the stripper is imported by its .ts name,
 *       which node 22.18+ strips natively)
 * Chain entry, once the controller adds it to the GATES array:
 *       { name: "gate-reds-ratchet", script: "scripts/audit_gate_reds.mjs" }
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { stripCommentLines } from "./lib/strip_comments.ts";
import { red, redSummary } from "./lib/red.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHAIN = "scripts/prebuild_all.ts";
const BASELINE = "scripts/gate_reds_baseline.json";
const RULE = "gate-reds-ratchet";
const WRITE = process.argv.includes("--write-baseline");
const VERBOSE = process.argv.includes("--verbose");

/** Lines above a non-zero exit whose literals count as failure text. */
const WINDOW_ABOVE_EXIT = 20;
/** Lines after a red helper's declaration whose literals count as its body. */
const HELPER_BODY = 10;
/** Longest statement a helper call or a push is followed to the end of. */
const STATEMENT_MAX = 12;

const rel = (p) => path.relative(ROOT, p).replace(/\\/g, "/");
const read = (p) => readFileSync(path.resolve(ROOT, p), "utf8");

/* ------------------------------------------------------------------ GATES */

/** The GATES array as rows {name, script, args, browser}, from the file's text. */
function parseGates(text) {
  const lines = stripCommentLines(text.split("\n"));
  const start = lines.findIndex((l) => /^\s*const GATES\s*:\s*Gate\[\]\s*=\s*\[/.test(l));
  if (start === -1) throw new Error(`${CHAIN}: no \`const GATES: Gate[] = [\` line`);
  const gates = [];
  for (let i = start + 1; i < lines.length; i++) {
    const l = lines[i];
    if (/^\s*\];/.test(l)) break;
    const m = l.match(/^\s*\{\s*name:\s*"([^"]+)"\s*,\s*script:\s*"([^"]+)"(.*)\}\s*,?\s*$/);
    if (!m) continue;
    const rest = m[3];
    /* The args are the literals inside `args: [...]` only: an entry's other
       string fields (`phase: "first"`, plan step 14b) are not arguments. */
    const argsText = /args:\s*\[([^\]]*)\]/.exec(rest)?.[1] ?? "";
    const args = [...argsText.matchAll(/"([^"]*)"/g)].map((x) => x[1]);
    gates.push({ name: m[1], script: m[2], args, browser: /browser:\s*true/.test(rest), line: i + 1 });
  }
  return gates;
}

/* ------------------------------------------------------------ RED TEXT */

const HELPER_NAMES = /\b(?:fail|red|problem|violation|violate|die|bad|offend|report|flag|complain)\w*/i;
const RED_ARRAYS = /\b\w*(?:red|fail|error|problem|violation|offend|issue|hit|bad|grown|added|stale|missing|extra|leak|breach|finding|broken|wrong|dead|unknown|orphan|rogue)\w*\.push\(/i;

/**
 * A regex literal masked to `/re/`, line by line, so a backtick or a quote
 * inside one (`/href=\{`(\/[^`]*)`\}/g` in find_dead_links.ts) cannot open a
 * string that runs for a hundred lines. A regex literal is taken to be a `/`
 * that follows an operator, a bracket or the line's start, which is the usual
 * heuristic and the one the division sign never satisfies.
 */
function maskRegexLiterals(line) {
  return line.replace(
    /(^|[=(,:;!&|?{}[\s])\/(?![/*])((?:[^/\\\n[]|\\.|\[(?:[^\]\\\n]|\\.)*\])+)\/([gimsuyd]*)/g,
    (m, before, body, flags) => `${before}/re/${flags}`,
  );
}

/** Every string literal in the stripped text, with the line it starts on. */
function literals(code) {
  const out = [];
  const masked = code.split("\n").map(maskRegexLiterals).join("\n");
  const re = /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/g;
  let m;
  while ((m = re.exec(masked))) {
    const startLine = masked.slice(0, m.index).split("\n").length;
    out.push({ line: startLine, text: m[0].slice(1, -1) });
  }
  return out;
}

/** The statement that starts at line i ends at the first line closing it. */
function statementEnd(lines, i) {
  for (let j = i; j < Math.min(lines.length, i + STATEMENT_MAX); j++) {
    const t = lines[j].trim();
    if (/\);?\s*$/.test(t) || /;\s*$/.test(t)) return j;
  }
  return Math.min(lines.length - 1, i + STATEMENT_MAX);
}

/**
 * The line ranges whose literals count as failure text, and why each does.
 * Returns [{from, to, why}].
 */
function redWindows(lines) {
  const wins = [];
  lines.forEach((l, i) => {
    if (/process\.exit\(\s*(?!0\s*\))/.test(l) || /process\.exitCode\s*=/.test(l) || /throw new Error/.test(l)) {
      wins.push({ from: Math.max(0, i - WINDOW_ABOVE_EXIT), to: i, why: "exit" });
    }
    if (/\b(?:failed|failures|fails|errors|problems|bad|reds|violations|nBad|failCount|badCount|errorCount)\s*(?:\+\+|\+=)/.test(l)) {
      wins.push({ from: Math.max(0, i - WINDOW_ABOVE_EXIT), to: i, why: "counter" });
    }
    const decl = l.match(/(?:function\s+(\w+)\s*\(|(?:const|let)\s+(\w+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|\w+)\s*=>)/);
    if (decl && HELPER_NAMES.test(decl[1] ?? decl[2] ?? "")) {
      wins.push({ from: i, to: Math.min(lines.length - 1, i + HELPER_BODY), why: "helper" });
    }
    const call = l.match(/(?:^|[^\w.])(\w+)\s*\(/);
    if (call && HELPER_NAMES.test(call[1]) && !/^(?:function|const|let|if|for|while|switch)$/.test(call[1])) {
      wins.push({ from: i, to: statementEnd(lines, i), why: "helper call" });
    }
    if (RED_ARRAYS.test(l)) wins.push({ from: i, to: statementEnd(lines, i), why: "push" });
  });
  return wins;
}

/** `const NAME = "<path>"` and friends, resolved for `${NAME}` in the reds. */
function pathConstants(code) {
  const out = new Map();
  const re = /(?:const|let)\s+([A-Za-z_]\w*)\s*(?::\s*string)?\s*=\s*(?:(?:path\.)?(?:resolve|join)\([^;]*?)?["'`]([^"'`]+)["'`]/g;
  let m;
  while ((m = re.exec(code))) {
    if (looksLikePath(m[2])) out.set(m[1], m[2]);
  }
  return out;
}

function looksLikePath(s) {
  return /^(?:\.?\.?\/)?(?:src|scripts|data|docs|tests|public|db|content|design)\b/.test(s)
    || /\.(?:tsx?|mjs|cjs|css|json|md|html)$/.test(s)
    || /^\.env/.test(s);
}

/** The failure text of one script: the literals inside the red windows. */
function failureText(code) {
  const lines = code.split("\n");
  const wins = redWindows(lines);
  const lits = literals(code);
  const kept = lits.filter((lit) => wins.some((w) => lit.line - 1 >= w.from && lit.line - 1 <= w.to));
  return { text: kept.map((k) => k.text).join("\n"), windows: wins.length, literals: kept.length };
}

/** The one script a wrapper spawns under tsx, if any (one level). */
function spawnedChild(code) {
  /* Only a real spawn counts: the `["tsx", "<path>"]` argument form, or an
     `npx tsx <path>` string on a line that calls spawn or exec. A remedy that
     SAYS "run npx tsx scripts/x.ts" is advice to the reader, not a child. */
  const arr = code.match(/["']tsx["']\s*,\s*["']([\w./-]+\.(?:ts|mjs))["']/);
  if (arr) return arr[1];
  for (const line of code.split("\n")) {
    if (!/\b(?:spawn|spawnSync|exec|execSync|execFileSync)\b/.test(line)) continue;
    const m = line.match(/npx tsx\s+([\w./-]+\.(?:ts|mjs))/);
    if (m) return m[1];
  }
  return null;
}

/* ------------------------------------------------------- CLASSIFICATION */

/* An interpolation whose expression names a file: a bare `${file}`, `${rel}`,
   `${f}`, a member like `${h.file}`, or an identifier ending in File or Path
   (`${r.seedFile}`, `${BASELINE_PATH}`). Credit is by the NAME of the variable,
   which the header says plainly. */
const PATHISH = /\$\{[^}]*\b(?:\w*(?:file|files|path|paths)|rel|relpath|abs|fname|filename|loc|location|where|target|carrier|src|source|display|list|self|baseline|f|p|route|page|entry|module|mod|spec)\b[^}]*\}/i;
const LITERAL_PATH = /(?:^|[^\w/.-])((?:src|scripts|data|docs|tests|public|db|content|design)(?:\/[\w.\-[\]()]+)+|[\w.-]+\.(?:tsx?|mjs|cjs|css|json|md|html))(?=$|[^\w/])/g;

const CAPS_STOP = new Set([
  "FAIL", "FAILED", "FAILS", "PASS", "PASSED", "ERROR", "ERRORS", "WARN", "WARNING", "NOTE", "TODO", "HTTP", "HTTPS", "JSON", "HTML",
  "CSS", "TSX", "MJS", "TRUE", "FALSE", "NULL", "SKIP", "SKIPPED", "ONLY", "AND", "NOT", "THE", "THIS", "THAT", "WITH", "FROM",
  "INTO", "NEVER", "ALWAYS", "MUST", "EVERY", "ALL", "NONE", "ANY", "WILL", "WHAT", "WHEN", "WHERE", "WHICH", "HOW", "WHY",
  "THESE", "THOSE", "THEM", "THEY", "THEIR", "HERE", "THERE", "THEN", "THAN", "ALSO", "BOTH", "EACH", "SOME", "SUCH", "SAME",
  "MORE", "MOST", "LESS", "MANY", "MUCH", "VERY", "JUST", "EVEN", "STILL", "BEEN", "HAVE", "HAS", "HAD", "DOES", "DID", "DONE",
  "ARE", "WAS", "WERE", "CAN", "COULD", "SHOULD", "WOULD", "MAY", "MIGHT", "BUT", "FOR", "NOR", "YET", "ABOUT", "AFTER", "BEFORE",
  "UTF", "URL", "API", "CLI", "CI", "PR", "OK", "NAN", "ENOENT", "ENOMEM", "TIMEOUT", "MB", "KB", "GB", "PX", "REM", "USD", "GBP",
  "EUR", "AUD", "ISO", "SEO", "DIV", "IMG", "SVG", "PNG", "JPEG", "JPG", "BEGIN", "END", "TSC", "GATES", "GATE", "TEST", "TESTS",
  "FIX", "FIXME", "XXX", "HACK", "WIP", "DRAFT", "NOTES", "PATH", "FILE", "LINE", "ROOT", "HEAD", "MAIN", "DEV", "PROD", "ENV",
  "DIFFERENT", "EXCEPT", "BASELINE", "BASELINES", "INSTEAD", "EXACTLY", "REAL", "LIVE", "ONCE", "TWICE", "MEASURED", "PROVED",
  "NEW", "OLD", "ZERO", "FIRST", "LAST", "ONE", "TWO", "THREE", "WHOLE", "SILENT", "SILENTLY", "LOUD", "CHECKS", "CHECK", "COUNT",
]);

/**
 * A generous list of remedy phrases, each on a word boundary so that "put"
 * cannot be credited to "output" nor "add" to "added": generous in vocabulary,
 * exact in form. The phrase matched is printed beside the credit.
 */
const REMEDY_PHRASES = [
  /Remedy:/, /\bfix with\b/i, /\bfix:/i, /\bto fix\b/i, /\bfix (?:it|this|that|them|by)\b/i, /^\s*Fix\b/im, /\brun:/i,
  /\brun (?:it|the|this|npx|npm|node|with|`)/i, /\bnpx tsx\b/, /\bnpm run\b/, /--write\b/, /--init\b/, /--update\b/, /\breplace\b/i,
  /\blower\b/i, /\bdeclare\b/i, /\buse the token\b/i, /\buse var\(/i, /\buse a token\b/i, /\buse one of\b/i, /\binstead\b/i,
  /\bremove\b/i, /\bdelete\b/i, /\badd\b/i, /\brename\b/i, /\bmove\b/i, /\bupdate\b/i, /\brefresh\b/i, /\brotate\b/i, /\bretone\b/i,
  /\bregenerate\b/i, /\brevert\b/i, /\bwrap\b/i, /\bswitch\b/i, /\bchange\b/i, /\bedit\b/i, /\bneeds? to\b/i, /\bha(?:s|ve) to\b/i,
  /\bcommit\b/i, /\braise\b/i, /\bwiden\b/i, /\bnarrow\b/i, /\bsplit\b/i, /\bextend\b/i, /\bshrink\b/i, /\bpick\b/i, /\bchoose\b/i,
  /\bconvert\b/i, /\bmigrate\b/i, /\brebuild\b/i, /\brestore\b/i, /\binstall\b/i, /\bregister\b/i, /\bwire\b/i, /\bunwire\b/i,
  /\bretire\b/i, /\bshould\b/i, /\bmust\b/i, /\bdrop\b/i, /\bcut\b/i, /\btrim\b/i, /\bshorten\b/i, /\bwrite\b/i,
  /\bset (?:it|the|them|a)\b/i, /\bmake (?:it|the|them)\b/i, /\bkeep (?:it|the|them)\b/i, /\bgive (?:it|the|them)\b/i,
  /\bpoint (?:it|the|them)\b/i,
];

function classify(gate, code, extra, meta) {
  const ft = failureText(code);
  let text = ft.text;
  let via = "";
  if (extra) {
    text += "\n" + failureText(extra.code).text;
    via = ` (via ${extra.path})`;
  }
  const consts = pathConstants(code + (extra ? "\n" + extra.code : ""));
  const ev = { path: null, line: null, rule: null, remedy: null };

  /* path: a red() call with a file field is a path by construction. */
  /* A call to scripts/lib/red: `red({ ... })`, an aliased `redLine({ ... })`
     or `formatRed({ ... })`. The object literal may hold `${...}` inside its
     strings, so one level of nested braces is allowed before the closing one. */
  const redCall = (code + (extra?.code ?? "")).match(/\b(?:red\w*|formatRed)\(\s*\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}/s);
  if (redCall && /\bfile\b/.test(redCall[1])) {
    ev.path = "red({file})";
    if (/\bline\b/.test(redCall[1])) ev.line = "red({line})";
  }
  if (!ev.path) {
    const fl = text.match(/\$\{([^}]*)\}:\$\{([^}]*)\}/);
    if (fl && PATHISH.test(`\${${fl[1]}}`)) { ev.path = `\${${fl[1]}}:\${${fl[2]}}`; ev.line = `\${${fl[2]}}`; }
  }
  if (!ev.path) {
    const p = text.match(PATHISH);
    if (p) ev.path = p[0].length > 40 ? p[0].slice(0, 37) + "..." : p[0];
  }
  if (!ev.path) {
    for (const [name, value] of consts) {
      if (text.includes(`\${${name}}`)) { ev.path = `\${${name}}=${value}`; break; }
    }
  }
  if (!ev.path) {
    for (const m of text.matchAll(LITERAL_PATH)) {
      const before = text.slice(Math.max(0, m.index - 12), m.index);
      if (/(?:tsx|node|run)\s*$/.test(before)) continue; /* a command, not the finding's file */
      ev.path = m[1];
      break;
    }
  }
  if (ev.path && !ev.line) {
    if (/\$\{[^}]*\b(?:line|lineNo|lineNumber|ln|row|i \+ 1|idx \+ 1|n \+ 1)\b[^}]*\}/.test(text)) ev.line = "${line}";
  }

  /* rule */
  const stem = path.basename(gate.script).replace(/\.(?:ts|mjs|tsx)$/, "").replace(/\.test$/, "");
  const names = new Set([gate.name, stem, stem.replace(/^verify_/, ""), stem.replace(/_/g, "-"), stem.replace(/^verify_/, "").replace(/_/g, "-")]);
  if (redCall && /\brule\b/.test(redCall[1])) ev.rule = "red({rule})";
  if (!ev.rule && /\bredSummary\(/.test(code + (extra?.code ?? ""))) ev.rule = "redSummary(rule)";
  if (!ev.rule) for (const n of names) if (n.length >= 3 && text.includes(n)) { ev.rule = n; break; }
  if (!ev.rule) {
    const prose = text.replace(/\$\{[^}]*\}/g, " ");
    const caps = [...prose.matchAll(/\b[A-Z][A-Z_-]{3,}\b/g)].map((m) => m[0]).filter((w) => !CAPS_STOP.has(w) && !/^[A-Z]+\d/.test(w));
    if (caps.length) ev.rule = `caps ${caps[0]}`;
  }

  /* remedy */
  if (redCall && /\bremedy\b/.test(redCall[1])) ev.remedy = "red({remedy})";
  if (!ev.remedy && /\bredSummary\(/.test(code + (extra?.code ?? ""))) ev.remedy = "redSummary(remedy)";
  if (!ev.remedy) {
    for (const re of REMEDY_PHRASES) {
      const m = text.match(re);
      if (m) { ev.remedy = m[0].trim(); break; }
    }
  }

  return { ev, via, windows: ft.windows, literals: ft.literals, text };
}

/* ------------------------------------------------------------------ MAIN */

function main() {
  const chain = read(CHAIN);
  const gates = parseGates(chain);
  if (gates.length === 0) throw new Error(`${CHAIN}: parsed 0 gates; the array's shape changed`);

  const rows = [];
  for (const g of gates) {
    const abs = path.resolve(ROOT, g.script);
    const kind = g.script.startsWith("tests/") ? "test" : "gate";
    if (!existsSync(abs)) {
      rows.push({ gate: g.name, script: g.script, kind, missing: true });
      continue;
    }
    const code = stripCommentLines(read(g.script).split("\n")).join("\n");
    let extra = null;
    const child = spawnedChild(code);
    if (child && child !== g.script && existsSync(path.resolve(ROOT, child))) {
      extra = { path: child, code: stripCommentLines(read(child).split("\n")).join("\n") };
    }
    const c = classify(g, code, extra, { kind });
    rows.push({ gate: g.name, script: g.script, kind, ...c.ev, via: c.via, windows: c.windows, literals: c.literals, text: c.text });
  }

  /* the table */
  const w = { gate: Math.max(4, ...rows.map((r) => r.gate.length)), kind: 4 };
  const cell = (v) => (v ? `yes ${v}` : "no");
  const pad = (s, n) => String(s).padEnd(n);
  console.log(`gate reds: ${rows.length} gates in ${CHAIN} (${rows.filter((r) => r.kind === "test").length} of them tests under tests/)`);
  console.log("");
  console.log(`${pad("gate", w.gate)}  ${pad("kind", w.kind)}  ${pad("path?", 34)}  ${pad("rule?", 26)}  remedy?`);
  console.log(`${"-".repeat(w.gate)}  ${"-".repeat(w.kind)}  ${"-".repeat(34)}  ${"-".repeat(26)}  ${"-".repeat(22)}`);
  for (const r of rows) {
    if (r.missing) {
      console.log(`${pad(r.gate, w.gate)}  ${pad(r.kind, w.kind)}  MISSING FILE ${r.script}`);
      continue;
    }
    const pathCell = r.path ? `yes ${r.path}${r.line ? ` +line ${r.line}` : ""}` : "no";
    console.log(`${pad(r.gate, w.gate)}  ${pad(r.kind, w.kind)}  ${pad(pathCell.slice(0, 34), 34)}  ${pad(cell(r.rule).slice(0, 26), 26)}  ${cell(r.remedy).slice(0, 22)}${r.via}`);
    if (VERBOSE) {
      console.log(`    windows ${r.windows}, literals ${r.literals}`);
      for (const l of r.text.split("\n").slice(0, 12)) console.log(`    | ${l.slice(0, 110)}`);
    }
  }

  /* the foot */
  const present = rows.filter((r) => !r.missing);
  const lacking = {
    no_path: present.filter((r) => !r.path),
    no_rule: present.filter((r) => !r.rule),
    no_remedy: present.filter((r) => !r.remedy),
  };
  const counts = { no_path: lacking.no_path.length, no_rule: lacking.no_rule.length, no_remedy: lacking.no_remedy.length };
  const tests = {
    no_path: lacking.no_path.filter((r) => r.kind === "test").length,
    no_rule: lacking.no_rule.filter((r) => r.kind === "test").length,
    no_remedy: lacking.no_remedy.filter((r) => r.kind === "test").length,
  };
  const missing = rows.filter((r) => r.missing);
  console.log("");
  console.log(`no path:   ${counts.no_path} of ${present.length} (${tests.no_path} tests)`);
  console.log(`no rule:   ${counts.no_rule} of ${present.length} (${tests.no_rule} tests)`);
  console.log(`no remedy: ${counts.no_remedy} of ${present.length} (${tests.no_remedy} tests)`);
  for (const key of ["no_path", "no_rule", "no_remedy"]) {
    const list = lacking[key];
    if (list.length) console.log(`  ${key}: ${list.map((r) => r.gate + (r.kind === "test" ? " (test)" : "")).join(", ")}`);
  }
  if (missing.length) {
    console.log("");
    for (const r of missing) {
      red({ rule: RULE, file: CHAIN, detail: `gate ${r.gate} names ${r.script}, which does not exist`, remedy: "point the entry at the script that replaced it, or remove the entry" });
    }
  }

  /* the ratchet */
  const absBaseline = path.resolve(ROOT, BASELINE);
  if (WRITE) {
    const out = { no_path: counts.no_path, no_rule: counts.no_rule, no_remedy: counts.no_remedy, gates: present.length, tests, written: new Date().toISOString().slice(0, 10) };
    writeFileSync(absBaseline, JSON.stringify(out, null, 2) + "\n");
    console.log("");
    console.log(`gate reds: baseline written to ${BASELINE}: no_path ${counts.no_path}, no_rule ${counts.no_rule}, no_remedy ${counts.no_remedy}`);
    process.exit(missing.length ? 1 : 0);
  }
  if (!existsSync(absBaseline)) {
    console.log("");
    console.log(`gate reds: no baseline at ${BASELINE}; these counts are the first reading. Write it with --write-baseline.`);
    process.exit(missing.length ? 1 : 0);
  }
  const base = JSON.parse(readFileSync(absBaseline, "utf8"));
  let rose = 0;
  for (const key of ["no_path", "no_rule", "no_remedy"]) {
    if (typeof base[key] !== "number") continue;
    if (counts[key] > base[key]) {
      rose++;
      const culprits = lacking[key].map((r) => r.gate).join(", ");
      red({
        rule: RULE,
        file: BASELINE,
        detail: `${key} rose from ${base[key]} to ${counts[key]}; gates lacking it: ${culprits}`,
        remedy: `print the red through scripts/lib/red (red({ rule, file, line, detail, remedy })) in the gate you added or changed; never raise the baseline`,
      });
    }
  }
  if (rose) {
    redSummary(RULE, rose, `use scripts/lib/red in the new or changed gate so its red names a file, a rule and a remedy; the baseline in ${BASELINE} only falls`, `baseline ${base.no_path}/${base.no_rule}/${base.no_remedy}, now ${counts.no_path}/${counts.no_rule}/${counts.no_remedy}`);
    process.exit(1);
  }
  console.log("");
  console.log(`gate reds: PASS, no_path ${counts.no_path} (baseline ${base.no_path}), no_rule ${counts.no_rule} (baseline ${base.no_rule}), no_remedy ${counts.no_remedy} (baseline ${base.no_remedy}); the ratchet holds`);
  if (counts.no_path < base.no_path || counts.no_rule < base.no_rule || counts.no_remedy < base.no_remedy) {
    console.log(`  a count fell: lower the baseline with --write-baseline in this change, so it cannot re-fill`);
  }
  process.exit(missing.length ? 1 : 0);
}

main();
