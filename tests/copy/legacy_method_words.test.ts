/**
 * NO STRUCK METHOD WORD AND NO COINED SCORE IN THE COPY OF ANY LIVE PAGE (masterplan step 02, 2026-10-05). His ruling 11 of
 * the interview of 2026-09-26: "no composite, ever"; his copy correction of 2026-09-24 struck the method words. Milestone 1
 * cleaned every COPY string (copy-no-method-words reads src/lib/spine/copy.ts); the older pages print their own literals, and
 * on 2026-10-05 a read of src/ found a 0-100 break-in score on four live routes and "modeled" on a dozen more.
 *
 * WHAT IT READS: every string literal, template text and JSX text in src/app and src/components (src/app/dev and
 * src/app/_design skipped by path from the root), parsed with the TypeScript compiler, so a comment is never read as copy.
 * The words: the plain-copy gate's own list (scripts/harness/check_copy_plain.mjs, parsed as copy-no-method-words parses it,
 * so the two never drift), plus "confidence label" and "coverage chip" (marks no page prints), plus a score label: "/100",
 * "out of 100" and the word "score".
 *
 * ITS BLIND SPOTS, said once. A string is read as copy when it holds a space or starts with a capital; a lone lowercase token
 * ("modelled" as a `kind` value, "score" as a sort key) is code and is not counted, so a visible label of one lowercase word
 * is missed (the harness gates read the renders). Strings compared in code (`=== "..."`, a `case` label), object keys,
 * module paths, type literals and the class, id, key, href and data attributes are code too. A string built at run time
 * from parts is read part by part.
 *
 * A RATCHET PER FILE: scripts/copy/legacy_method_words_baseline.json holds each file's count after step 02's fixes; a
 * file's count may only fall (`--write-baseline` refuses to raise one). `--list` prints every finding.
 *
 * Run: npx tsx tests/copy/legacy_method_words.test.ts [--list] [--write-baseline]
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "legacy-method-words";
const BASELINE = "scripts/copy/legacy_method_words_baseline.json";
const REMEDY = "say it plainly (\"estimated\", \"an estimate\", or nothing) and take a coined score off the page (his ruling 11), never raise the baseline";
const ROOTS = ["src/app", "src/components"];
const SKIP = ["src/app/dev", "src/app/_design"];
let failed = 0;

/* The plain-copy gate's list, parsed from its source: one `["name", /pattern/i],` per line inside inPage(). */
const gateSrc = readFileSync("scripts/harness/check_copy_plain.mjs", "utf8");
const PLAIN: Array<[string, RegExp]> = [...gateSrc.matchAll(/^\s*\["([^"]+)", \/(.+)\/i\],\s*$/gm)].map((m) => [m[1], new RegExp(m[2], "i")]);
if (PLAIN.length < 10 || !PLAIN.some(([w]) => w === "modelled") || !PLAIN.some(([w]) => w === "withheld")) {
  failed++;
  red({ rule: RULE, file: "scripts/harness/check_copy_plain.mjs", detail: `read ${PLAIN.length} banned words from the plain-copy gate, expected its ten`, remedy: "keep the gate's list one `[\"word\", /pattern/i],` a line, or teach this parse its new shape" });
}
const WORDS: Array<[string, RegExp]> = [
  ...PLAIN,
  ["confidence label", /\bconfidence labels?\b/i],
  ["coverage chip", /\bcoverage chips?\b/i],
  ["a score out of 100", /\/\s?100\b|\bout of 100\b/i],
  ["score", /\bscores?\b/i],
];

const CODE_ATTRS = /^(className|class|id|key|href|src|style|role|type|name|as|rel|target|htmlFor|data-[\w-]+)$/;

function files(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name).replace(/\\/g, "/");
    if (SKIP.some((s) => p === s || p.startsWith(`${s}/`))) continue;
    if (statSync(p).isDirectory()) files(p, acc);
    else if (/\.(ts|tsx)$/.test(p) && !/\.d\.ts$/.test(p)) acc.push(p);
  }
  return acc;
}

/** True when the literal is code, not copy: a module path, a key, a type, a comparison, a code attribute. */
function isCode(node: ts.Node): boolean {
  let n: ts.Node = node;
  /* A template's parts belong to the template. */
  if (ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n)) n = n.parent.parent ?? n.parent;
  const p = n.parent;
  if (!p) return false;
  if (ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || ts.isExternalModuleReference(p) || ts.isImportTypeNode(p)) return true;
  if (ts.isCallExpression(p) && (p.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(p.expression) && p.expression.text === "require"))) return true;
  if (ts.isLiteralTypeNode(p)) return true;
  if ((ts.isPropertyAssignment(p) || ts.isPropertySignature(p) || ts.isPropertyDeclaration(p) || ts.isMethodDeclaration(p)) && p.name === n) return true;
  if (ts.isElementAccessExpression(p) && p.argumentExpression === n) return true;
  if (ts.isCaseClause(p)) return true;
  if (ts.isBinaryExpression(p) && [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsToken].includes(p.operatorToken.kind)) return true;
  if (ts.isJsxAttribute(p) && CODE_ATTRS.test(p.name.getText())) return true;
  if (ts.isJsxExpression(p) && p.parent && ts.isJsxAttribute(p.parent) && CODE_ATTRS.test(p.parent.name.getText())) return true;
  return false;
}

type Finding = { file: string; line: number; word: string; text: string };
const findings: Finding[] = [];
let read = 0;
const scanned = files(ROOTS[0]).concat(files(ROOTS[1]));
for (const file of scanned) {
  const src = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const visit = (node: ts.Node): void => {
    let text: string | null = null;
    let jsx = false;
    if (ts.isJsxText(node)) { text = node.text; jsx = true; }
    else if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) text = node.text;
    else if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) text = node.text;
    if (text !== null && text.trim() && !isCode(node)) {
      const t = text.replace(/\s+/g, " ").trim();
      /* Copy holds a space or starts with a capital; a lone lowercase token is a key or a value (the blind spot above). */
      if (jsx || /\s/.test(t) || /^[A-Z]/.test(t)) {
        read++;
        for (const [word, re] of WORDS) {
          if (!re.test(t)) continue;
          findings.push({ file, line: src.getLineAndCharacterOfPosition(node.getStart(src)).line + 1, word, text: t.slice(0, 110) });
          break;
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(src);
}

const counts: Record<string, number> = {};
for (const f of findings) counts[f.file] = (counts[f.file] ?? 0) + 1;
const sorted = Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));

if (process.argv.includes("--list")) for (const f of findings) console.log(`${f.file}:${f.line}  [${f.word}]  ${JSON.stringify(f.text)}`);

const stored: Record<string, number> | null = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : null;
if (process.argv.includes("--write-baseline")) {
  const raised = stored ? Object.keys(sorted).filter((f) => sorted[f] > (stored[f] ?? 0)) : [];
  if (raised.length) {
    console.error(`x ${RULE}: refusing to write a baseline that raises a file's count; a baseline may only come down.`);
    for (const f of raised) console.error(`     ${f}: ${stored?.[f] ?? 0} -> ${sorted[f]}`);
    process.exit(1);
  }
  writeFileSync(BASELINE, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`wrote ${BASELINE}: ${findings.length} finding(s) in ${Object.keys(sorted).length} file(s)`);
  process.exit(0);
}

if (scanned.length < 300 || read < 3000) {
  failed++;
  red({ rule: RULE, file: "tests/copy/legacy_method_words.test.ts", detail: `read ${read} strings in ${scanned.length} files`, remedy: "check the walk still reaches src/app and src/components" });
}
if (!stored) {
  failed++;
  red({ rule: RULE, file: BASELINE, detail: "no baseline", remedy: "seed it once with --write-baseline after the fixes" });
} else {
  for (const [file, n] of Object.entries(sorted)) {
    if (n <= (stored[file] ?? 0)) continue;
    failed++;
    const first = findings.find((f) => f.file === file);
    red({ rule: RULE, file, line: first?.line, detail: `${n} finding(s) against a baseline of ${stored[file] ?? 0}, first: [${first?.word}] ${JSON.stringify(first?.text)}`, remedy: REMEDY });
  }
}
if (failed > 0) { redSummary(RULE, failed, REMEDY, "files carry more struck words or score labels than their baseline"); process.exit(1); }
console.log(`PASS  ${read} copy strings in ${scanned.length} files; ${findings.length} finding(s), none above its file's baseline (run --list for the work queue)`);
