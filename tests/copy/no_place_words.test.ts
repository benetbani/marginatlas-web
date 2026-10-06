/**
 * NO PLACE SUMMED UP IN A WORD OR TWO (his ruling of 2026-09-07; MODEL.md PART 9 clause 19; QUEUE city:invented-words-elsewhere,
 * closed 2026-10-06). His words, on the London districts card that called South London "gentrifying": "You should never do it
 * for city districts, to just summarize them in one or two words. It should never happen." Task 13 (2026-09-10) took the word
 * off that card only; the same wires fed chips, an eyebrow, a table column and stock sentences on the trade-in-a-district
 * page, the recommender, the region page and the older city pages until 2026-10-06, and nothing replaced any of them.
 *
 * WHAT IT READS: every .ts and .tsx file under src/ (src/app/dev and src/app/_design skipped by path from the root, the
 * workshop and not the shop, as legacy-method-words skips them), parsed with the TypeScript compiler, so a comment is never
 * read. Four wires, each by name:
 *   1. tagLabel           no function, constant or import of that name: it turned an engine tag into a chip's words.
 *   2. a tag's words      no `Record<NeighborhoodTag, string>` (bare, Partial or Readonly): a table of words per tag.
 *   3. a tag's sentence   no function taking a NeighborhoodTag that returns a string literal or a template: the stock clause
 *                         per tag ("the business core wins outright", "Strong daytime worker base").
 *   4. a district's class a property read `.character` (the one-word class of data/cities/neighborhoods_v1.json) only where
 *                         code uses it: a call's argument, an index, a comparison, a test, or a step to a deeper property
 *                         (`COPY.character.people`). Anywhere it would become words (a JSX child or attribute, a template, a
 *                         string method, an object's field, a return) is red, and so is the argument of a call named
 *                         for words (labelFor, formatClass).
 * The checker proves itself first on fixtures of each wire, failing and passing, so a parse that stops seeing a wire fails.
 *
 * ITS BLIND SPOT, said once: it reads the source, not the page. A class renamed before it reaches the page (`const kind =
 * n.character` is red, but data copied into a new field upstream of src/ is not seen), a class taken out by destructuring
 * (`const { character } = nb`: without types the parse cannot tell it from the hood page's card of authored notes, a prop of
 * the same name, so it is not read), or words typed as literals per district, are not wires it names. A district's words come only from authored, sourced notes per district (DATA-REQUIREMENTS
 * item 6, its addendum), never from a tag or a class; this gate writes none.
 *
 * Run: npx tsx tests/copy/no_place_words.test.ts [--list]
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "no-place-words";
const REMEDY = "print the district's name and its figures, never a word or two that sums it up, and let nothing stand in the word's place (his ruling of 2026-09-07)";
const ROOT = "src";
const SKIP = ["src/app/dev", "src/app/_design"];
let failed = 0;

type Hit = { file: string; line: number; wire: string; text: string };

/* A call whose name says it turns its argument into words. */
const TEXT_CALLEE = /label|format|title|capitali[sz]e|human|pretty|display|words?/i;

/* String methods: reading the class through one of these still makes words of it. */
const STRING_METHODS = new Set(["replace", "replaceAll", "toLowerCase", "toUpperCase", "toLocaleLowerCase", "toLocaleUpperCase", "trim", "trimStart", "trimEnd", "slice", "substring", "substr", "split", "concat", "padStart", "padEnd", "charAt", "at", "normalize", "repeat"]);

function unwrap(n: ts.Node): ts.Node {
  let p = n.parent;
  let c: ts.Node = n;
  while (p && (ts.isParenthesizedExpression(p) || ts.isNonNullExpression(p) || ts.isAsExpression(p) || ts.isSatisfiesExpression(p))) { c = p; p = p.parent; }
  return c;
}

/** True when the read `x.character` is used as code (argument, index, comparison, test, deeper step), not as words. */
function classUsedAsCode(access: ts.PropertyAccessExpression): boolean {
  const node = unwrap(access);
  const p = node.parent;
  if (!p) return true;
  if (ts.isPropertyAccessExpression(p) && p.expression === node) return !STRING_METHODS.has(p.name.text);
  if (ts.isElementAccessExpression(p)) return p.argumentExpression === node;
  if (ts.isCallExpression(p)) {
    if (!p.arguments.includes(node as ts.Expression)) return false;
    /* An argument steers code, unless the call's own name says it makes words of it (labelFor, formatClass, toTitle). */
    const callee = ts.isPropertyAccessExpression(p.expression) ? p.expression.name.text : ts.isIdentifier(p.expression) ? p.expression.text : "";
    return !TEXT_CALLEE.test(callee);
  }
  if (ts.isBinaryExpression(p)) {
    const k = p.operatorToken.kind;
    if ([ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsToken, ts.SyntaxKind.InKeyword].includes(k)) return true;
    if (k === ts.SyntaxKind.AmpersandAmpersandToken && p.left === node) return true;
    return false;
  }
  if (ts.isConditionalExpression(p)) return p.condition === node;
  if (ts.isPrefixUnaryExpression(p) && p.operator === ts.SyntaxKind.ExclamationToken) return true;
  if (ts.isIfStatement(p) || ts.isWhileStatement(p)) return true;
  if (ts.isSwitchStatement(p) || ts.isCaseClause(p)) return true;
  if (ts.isTypeOfExpression(p)) return true;
  return false;
}

/** A value type that is words: `string`, a string literal, or a union holding one (never a table nested inside, `Record<string, number>`). */
function isWordsType(t: ts.TypeNode): boolean {
  if (t.kind === ts.SyntaxKind.StringKeyword) return true;
  if (ts.isLiteralTypeNode(t)) return ts.isStringLiteral(t.literal) || ts.isNoSubstitutionTemplateLiteral(t.literal);
  if (ts.isTemplateLiteralTypeNode(t)) return true;
  if (ts.isParenthesizedTypeNode(t)) return isWordsType(t.type);
  if (ts.isUnionTypeNode(t)) return t.types.some(isWordsType);
  return false;
}

function mentionsTag(t: ts.TypeNode | undefined, src: ts.SourceFile): boolean {
  return !!t && /\bNeighborhoodTag\b/.test(t.getText(src));
}

/** The string-producing returns of one function, not of the functions nested inside it. */
function returnsWords(fn: ts.SignatureDeclaration & { body?: ts.Node }): boolean {
  const body = fn.body;
  if (!body) return false;
  const isWords = (e: ts.Expression | undefined): boolean => {
    if (!e) return false;
    let x: ts.Expression = e;
    while (ts.isParenthesizedExpression(x) || ts.isAsExpression(x)) x = x.expression;
    if (ts.isStringLiteral(x) || ts.isNoSubstitutionTemplateLiteral(x) || ts.isTemplateExpression(x)) return true;
    if (ts.isConditionalExpression(x)) return isWords(x.whenTrue) || isWords(x.whenFalse);
    if (ts.isBinaryExpression(x) && [ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken, ts.SyntaxKind.PlusToken].includes(x.operatorToken.kind)) return isWords(x.left) || isWords(x.right);
    return false;
  };
  if (!ts.isBlock(body)) return isWords(body as ts.Expression);
  let found = false;
  const walk = (n: ts.Node): void => {
    if (found) return;
    if (n !== body && (ts.isFunctionLike(n) || ts.isClassLike(n))) return;
    if (ts.isReturnStatement(n) && isWords(n.expression)) { found = true; return; }
    ts.forEachChild(n, walk);
  };
  walk(body);
  return found;
}

export function check(file: string, text: string): Hit[] {
  const src = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const hits: Hit[] = [];
  const hit = (n: ts.Node, wire: string): void => {
    hits.push({ file, line: src.getLineAndCharacterOfPosition(n.getStart(src)).line + 1, wire, text: n.getText(src).replace(/\s+/g, " ").slice(0, 100) });
  };
  const visit = (n: ts.Node): void => {
    /* 1. tagLabel, declared, imported or exported under that name. */
    if ((ts.isFunctionDeclaration(n) || ts.isVariableDeclaration(n)) && n.name && ts.isIdentifier(n.name) && n.name.text === "tagLabel") hit(n.name, "tagLabel");
    if ((ts.isImportSpecifier(n) || ts.isExportSpecifier(n)) && (n.name.text === "tagLabel" || n.propertyName?.getText(src) === "tagLabel")) hit(n, "tagLabel");
    /* 2. A table of words per tag. */
    if (ts.isTypeReferenceNode(n) && n.typeName.getText(src) === "Record" && n.typeArguments?.length === 2) {
      const [k, v] = n.typeArguments;
      if (/^\s*NeighborhoodTag\s*$/.test(k.getText(src)) && isWordsType(v)) hit(n, "a tag's words");
    }
    /* 3. A function from a tag to a sentence. */
    if ((ts.isFunctionDeclaration(n) || ts.isArrowFunction(n) || ts.isFunctionExpression(n) || ts.isMethodDeclaration(n)) && n.parameters.some((p) => mentionsTag(p.type, src)) && returnsWords(n)) {
      hit(n.name ?? n, "a tag's sentence");
    }
    /* 4. A district's class read as words. */
    if (ts.isPropertyAccessExpression(n) && n.name.text === "character" && !classUsedAsCode(n)) hit(n, "a district's class");
    ts.forEachChild(n, visit);
  };
  visit(src);
  return hits;
}

/* The checker proves itself: each wire seen where it is, and not seen where code merely steers by the class. */
const FIXTURES: Array<{ name: string; tsx: boolean; code: string; wires: string[] }> = [
  { name: "tagLabel declared", tsx: false, code: `export function tagLabel(t: NeighborhoodTag): string { return "Financial CBD"; }`, wires: ["tagLabel", "a tag's sentence"] },
  { name: "tagLabel imported", tsx: false, code: `import { tagLabel } from "@/lib/economics/neighborhood_multipliers";`, wires: ["tagLabel"] },
  { name: "words per tag", tsx: false, code: `const L: Partial<Record<NeighborhoodTag, string>> = { tourist_zone: "Tourist trade" };`, wires: ["a tag's words"] },
  { name: "if-chain sentence", tsx: false, code: `function why(tags: NeighborhoodTag[]): string { if (tags.includes("financial_cbd")) { return "the business core wins outright"; } return \`the quieter address\`; }`, wires: ["a tag's sentence"] },
  { name: "chip text", tsx: true, code: `const C = ({ n }: any) => <span>{n.character.replace(/-/g, " ")}</span>;`, wires: ["a district's class"] },
  { name: "eyebrow child", tsx: true, code: `const C = ({ nb }: any) => <div>{nb.character}</div>;`, wires: ["a district's class"] },
  { name: "attribute", tsx: true, code: `const C = ({ nb }: any) => <Band breakIn={nb.character} />;`, wires: ["a district's class"] },
  { name: "carried on a row", tsx: false, code: `const row = { name: n.name, character: n.character };`, wires: ["a district's class"] },
  { name: "template", tsx: false, code: "const s = `${n.name}, ${n.character}`;", wires: ["a district's class"] },
  { name: "a formatter's argument", tsx: false, code: `const t = labelFor(n.character); const u = formatClass(nb.character);`, wires: ["a district's class", "a district's class"] },
  { name: "steers the engine", tsx: false, code: `const cell = applyNeighborhoodMultiplier(cityCell, ind.id, nb.character);`, wires: [] },
  { name: "an index", tsx: false, code: `const h = CHARACTER_HEADLINE[n.character] || null;`, wires: [] },
  { name: "a comparison and a test", tsx: false, code: `if (n.character === "tourist") {} const k = n.character ? 1 : 0; const z = !n.character;`, wires: [] },
  { name: "a deeper step", tsx: true, code: `const C = () => <Rail kicker={COPY.character.people.kicker} />;`, wires: [] },
  { name: "a number per tag", tsx: false, code: `function rent(tags: NeighborhoodTag[]): number { return tags.length ? 1.2 : 1; } const W: Record<NeighborhoodTag, number> = {} as any;`, wires: [] },
  { name: "a table per tag", tsx: false, code: `const T: Partial<Record<NeighborhoodTag, Record<string, number>>> = {};`, wires: [] },
  { name: "words or nothing per tag", tsx: false, code: `const U: Record<NeighborhoodTag, string | undefined> = {} as any;`, wires: ["a tag's words"] },
];
for (const f of FIXTURES) {
  const got = check(`fixture.${f.tsx ? "tsx" : "ts"}`, f.code).map((h) => h.wire).sort();
  const want = [...f.wires].sort();
  if (JSON.stringify(got) !== JSON.stringify(want)) {
    failed++;
    red({ rule: RULE, file: "tests/copy/no_place_words.test.ts", detail: `the checker failed its own fixture "${f.name}": saw [${got.join(", ")}], expected [${want.join(", ")}]`, remedy: "mend the checker before trusting its pass" });
  }
}

function files(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name).replace(/\\/g, "/");
    if (SKIP.some((s) => p === s || p.startsWith(`${s}/`))) continue;
    if (statSync(p).isDirectory()) files(p, acc);
    else if (/\.(ts|tsx)$/.test(p) && !/\.d\.ts$/.test(p)) acc.push(p);
  }
  return acc;
}

const scanned = files(ROOT);
const hits = scanned.flatMap((f) => check(f, readFileSync(f, "utf8")));
if (process.argv.includes("--list")) for (const h of hits) console.log(`${h.file}:${h.line}  [${h.wire}]  ${h.text}`);
if (scanned.length < 600) {
  failed++;
  red({ rule: RULE, file: "tests/copy/no_place_words.test.ts", detail: `read ${scanned.length} files under src/`, remedy: "check the walk still reaches src/app, src/components and src/lib" });
}
for (const h of hits) {
  failed++;
  red({ rule: RULE, file: h.file, line: h.line, detail: `${h.wire}: ${h.text}`, remedy: REMEDY });
}
if (failed > 0) { redSummary(RULE, failed, REMEDY, "a page can still sum a place up in a word or two"); process.exit(1); }
console.log(`PASS  ${scanned.length} files under src/, ${FIXTURES.length} fixtures: no tagLabel, no words or sentence per tag, no district class read as words`);
