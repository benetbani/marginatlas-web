/**
 * scripts/verify_derived_accents.mjs , M5 IN THE SOURCE.
 *
 * PORT-CONTRACT M5: "the accent is derived, never hand-set."
 *
 *   Terracotta marks THE ANSWER, once per chapter. Country 02 captioned "a
 *   terracotta dot is the top or bottom tenth worldwide" while its dots were
 *   placed by hand, one at the 68th percentile and one at the 6th. The page
 *   stated a rule its own marks broke, and no gate could see it, because the
 *   caption and the mark had no shared source.
 *
 *   The port note is explicit: "never accept an isHighlighted flag from data.
 *   Compute it from the value and the stated threshold, or the rule and the
 *   render will drift the first time the data changes."
 *
 * The rendered linter cannot catch this: a hand-placed accent renders exactly
 * like a derived one. Only the source says which it is. So this gate reads the
 * React kit , AND, since 2026-07-26, the typed data contract behind it. A
 * `CityPeerRow` in spine2_types.ts once grew an `isCurrent?: boolean` field
 * that a component painted straight into its terracotta classes, and this
 * gate reported 41/41 PASS the entire time: it never opened the type file
 * (scope), and its name-denylist did not contain "iscurrent" (vocabulary). A
 * denylist of names can never be complete , see CHECK C.
 *
 *   node scripts/verify_derived_accents.mjs            the spine2 kit
 *   node scripts/verify_derived_accents.mjs src/...    any dir
 *
 * Either way, the spine2 DATA CONTRACT (below, CONTRACT_FILES) is always
 * read too: it is not a scan-target you can point elsewhere or forget to
 * pass, it is the fixed other half of the M5 boundary this gate exists to
 * police.
 *
 * THREE CHECKS
 *
 *   A. THE BAN (fails the build). A prop named isHighlighted / highlighted /
 *      hi / accent (and the obvious spellings) typed as a BARE BOOLEAN on a
 *      DATA ROW type , a type that is exported, or that a props interface
 *      takes an array of. That is the exact shape M5 forbids: the mark
 *      arrives as data instead of being computed from it. Now that
 *      CONTRACT_FILES is part of the scan, this also fires on a banned name
 *      declared directly in the type contract, not only in a component.
 *
 *   B. THE SMELL (warns). Terracotta rendered from a flag rather than from a
 *      computed expression: a class "a" / "hi" / "answer" or a var(--terra*)
 *      gated by a bare prop. Also accent-shaped booleans under other names
 *      (answer, kept, best, peak, marked...). These are heuristics and several
 *      legitimate editorial roles look like them, so they never fail a build.
 *
 *   C. THE SHAPE (fails the build). A and B both key off a fixed list of
 *      names, and a list of names can always be dodged by a name nobody
 *      listed , "isCurrent" was never "isHighlighted". This check does not
 *      look at names at all. It reads CONTRACT_FILES for every boolean field
 *      declared on an EXPORTED type , that is the complete set of booleans
 *      the DATA FILE is allowed to author, whatever they end up being called
 *      , then scans the spine2 components for that exact identifier reaching
 *      a terracotta sink, ungated by any derivation. If a data-authored
 *      boolean reaches a mark, that is the M5 violation, regardless of its
 *      name. See CONTRACT_FILES and MARK_SINK below for what is in scope and
 *      why the adapter is deliberately not treated as a source of authored
 *      names.
 *
 * FALSE-POSITIVE ESCAPE
 *
 *   Append the comment  /* accent-ok *\/  to the property line, or to the line
 *   above it, and all three checks skip it. Use it when the flag genuinely IS
 *   an authored editorial role rather than a threshold restated as a flag,
 *   and say why in the same comment.
 *
 * Exit 1 on an A violation or a C violation , both are the mark arriving as
 * data, one caught by name and one by shape. Warnings (B) print and exit 0:
 * this gate is wired into every build, and a build that fails on a heuristic
 * is a gate people learn to switch off.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, join, relative } from "node:path";

const ROOT = process.cwd();
const TARGET = resolve(ROOT, process.argv[2] ?? "src/components/spine2");
const EXTS = [".tsx", ".ts"]; // a row type can live in a plain .ts beside its component

if (!existsSync(TARGET)) {
  console.error(`x verify_derived_accents: ${TARGET} does not exist. A gate with nothing to read has not passed.`);
  process.exit(1);
}

/**
 * THE SPINE2 DATA CONTRACT. Every field a spine2 component ever sees traces
 * back to one of the exported types in this file , a cell file is parsed
 * against it before anything renders. Reading it closes the scope hole: the
 * gate used to open only the component tree, so `isCurrent?: boolean` could
 * sit on `CityPeerRow` here, invisible, forever.
 *
 * Deliberately a short, EXPLICIT file list , not `src/lib`, not even the rest
 * of `src/lib/cells`. That directory is full of legitimate booleans this
 * gate has no business judging; widening the scan to it would trade one
 * failure mode (silent) for another (a gate that cries wolf until someone
 * disables it). If a second spine2 contract file is ever split out of this
 * one, add it here by name , do not point this at a directory.
 *
 * The adapter (spine2_adapter.ts) is deliberately NOT in this list, and not
 * because it was overlooked. `buildCities` and friends are typed against
 * `CellFile`, i.e. against exactly the types below , they cannot read a field
 * off the cell that this contract does not already declare, so this file is
 * already a complete source of "what the data is allowed to author." The
 * adapter's OWN exported types (CityRow.isCurrent among them) are the
 * DERIVATION OUTPUT: computed once, correctly, from a slug match. Treating
 * those as "authored" would flag the fix along with the bug.
 */
const CONTRACT_FILES_EXPECTED = ["src/lib/cells/spine2_types.ts"];
const CONTRACT_FILES = CONTRACT_FILES_EXPECTED.map((p) => resolve(ROOT, p)).filter(existsSync);
if (CONTRACT_FILES.length < CONTRACT_FILES_EXPECTED.length) {
  const missing = CONTRACT_FILES_EXPECTED.filter((p) => !existsSync(resolve(ROOT, p)));
  console.error(
    `x verify_derived_accents: expected contract file(s) missing , ${missing.join(", ")}. ` +
      `Check B still runs on the component tree, but check C (the shape check) would silently ` +
      `have zero authored names to test against, which is the same failure mode as never opening ` +
      `the file at all. Update CONTRACT_FILES_EXPECTED if the contract moved.`
  );
  process.exit(1);
}

/** Names the contract bans outright when they arrive as bare booleans. */
const BANNED = new Set(["ishighlighted", "highlighted", "hi", "accent", "isaccent", "ishi", "hilite", "hl"]);
/** Accent-shaped names that are often a legitimate authored role. Warn only. */
const SMELLS = new Set(["answer", "kept", "best", "isbest", "peak", "ispeak", "marked", "emphasis", "featured", "top", "winner", "primary"]);
/** What a terracotta mark looks like in this stylesheet, for checks A and B. */
const TERRA_SINK = /var\(--terra|["'](?:a|hi|answer|terra)["']|\bterra\b/;
/**
 * The wider sink vocabulary for CHECK C only. TERRA_SINK's quoted-token list
 * ("a" / "hi" / "answer" / "terra") does not cover every mark class in the
 * kit , the exact defect this gate was built for used "k" and "on"
 * (src/components/spine2/page/Ch13Cities.tsx), neither of which TERRA_SINK
 * matches. Confirmed against the stylesheet before adding them:
 *
 *   src/styles/atlas-spine.css
 *     .av2 table.tb td.k                  { color: var(--terra-deep); ... }
 *     .av2 table.tb tr.on td:first-child   { box-shadow: inset 3px 0 0 var(--terra); ... }
 *
 * i.e. inside the hand-rolled `table.tb` shape (Ch13Cities, and the same
 * pattern in Matrix/Fitgrid per Ch13Cities' own header comment), `.k` and
 * `.on` ARE the row-answer mark. Bare, elsewhere in the sheet, both classes
 * are also used for un-accented state , dot/pip/week trackers paint `.on` in
 * `--ink` or `--n2`, never `--terra`, and `.k` is a generic small-caption
 * utility used a dozen times over. That is exactly why these two tokens are
 * their own constant instead of being folded into TERRA_SINK: widening
 * TERRA_SINK itself would also widen check B's name-list warning to every
 * one of those unrelated states. Check C only fires when the SAME line's
 * gate is ALSO a name the data contract is allowed to author , a small,
 * enumerable set , so the wider vocabulary is safe here in a way it would
 * not be for a fixed name list. Audited against the current tree (see the
 * negative-test report) and it adds zero matches on the clean kit.
 */
const MARK_SINK = /var\(--terra|["'](?:a|hi|answer|terra|k|on)["']|\bterra\b/;
/** An object field assigned from any of these was COMPUTED, not passed in. */
const DERIVED_OPS = /===|!==|>=|<=|[<>]|\(|\[|\+|-|\*|\/|\.length|Math\./;
/** A gate expression carrying a comparison is a derivation, not a flag.
 *  Parens are deliberately NOT in this list: every className sits inside
 *  cn(...), and treating that paren as evidence of derivation let the one
 *  real prop-painted accent in the kit through. */
const DERIVED_GATE = /===|!==|>=|<=|\s<\s|\s>\s|\.length|Math\./;
const ESCAPE = "accent-ok";

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (EXTS.some((e) => p.endsWith(e))) acc.push(p);
  }
  return acc;
}

/** Index the type/interface declarations in a file so a property line knows
 * what declares it. Extracted verbatim from the original inline version so
 * the contract-file pass (CHECK C prep, below) can reuse the exact same
 * brace-depth walk instead of carrying a second, driftable copy of it. */
function parseTypeDecls(lines) {
  const decls = []; // { name, exported, start, end }
  for (let i = 0; i < lines.length; i++) {
    const m = /^(export\s+)?(?:type|interface)\s+([A-Za-z0-9_]+)/.exec(lines[i]);
    if (!m) continue;
    let depth = 0, end = i;
    for (let j = i; j < lines.length; j++) {
      depth += (lines[j].match(/[{[]/g) || []).length - (lines[j].match(/[}\]]/g) || []).length;
      if (j > i || /[{[]/.test(lines[j])) { end = j; if (depth <= 0) break; }
    }
    decls.push({ name: m[2], exported: Boolean(m[1]), start: i, end });
  }
  return decls;
}

/** Every bare-boolean field declaration in a file, line-anchored or inline.
 * Extracted verbatim from the original inline version. Two matchers, because
 * one is not enough: the line-anchored form catches the normal multi-line
 * declaration; the inline form catches a compact single-line type alias ,
 * `type Row = { label: string; isHighlighted: boolean }` , which a negative
 * test proved the anchored matcher walks straight past. */
function findBooleanFieldHits(lines) {
  const hits = []; // [lineIndex, propName]
  for (let i = 0; i < lines.length; i++) {
    const anchored = /^\s*(?:readonly\s+)?([A-Za-z0-9_]+)\??\s*:\s*boolean\s*[;,]?\s*(?:\/\/.*)?$/.exec(lines[i]);
    if (anchored) { hits.push([i, anchored[1]]); continue; }
    /* inline: only inside a braced declaration line, so a function signature
       like (x: boolean) => y is not mistaken for a data contract */
    if (!/[{]/.test(lines[i])) continue;
    for (const m of lines[i].matchAll(/(?:[{;,]\s*)(?:readonly\s+)?([A-Za-z0-9_]+)\??\s*:\s*boolean\s*(?=[;,}])/g)) {
      hits.push([i, m[1]]);
    }
  }
  return hits;
}

const violations = [];
const warnings = [];
let propsScanned = 0, typesScanned = 0, sinksScanned = 0;
let filesScanned = 0, contractFilesScanned = 0;
/** lowercased boolean field name -> "file:line TypeName.field" of its FIRST
 * declaration. Built while walking CONTRACT_FILES below; this is the full
 * vocabulary CHECK C tests components against. See CHECK C for why this is
 * a shape check rather than another name list. */
const authoredBoolFields = new Map();

const files = [...walk(TARGET)];
for (const cf of CONTRACT_FILES) if (!files.includes(cf)) files.push(cf);

for (const file of files) {
  filesScanned++;
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  const src = readFileSync(file, "utf8");
  const lines = src.split("\n");
  const escaped = (i) => lines[i]?.includes(ESCAPE) || lines[i - 1]?.includes(ESCAPE);

  /* ---- index the type declarations so a property knows what declares it ---- */
  const decls = parseTypeDecls(lines);
  typesScanned += decls.length;
  const declAt = (i) => decls.find((d) => i >= d.start && i <= d.end);

  /* A props interface is where the outside world hands data in. A type it
     takes an ARRAY of is a data row, whatever it is called. */
  const propsDecls = decls.filter((d) => /Props$/.test(d.name));
  const rowTypes = new Set();
  for (const p of propsDecls) {
    const body = lines.slice(p.start, p.end + 1).join("\n");
    for (const m of body.matchAll(/([A-Za-z0-9_]+)\s*\[\]|(?:Readonly)?Array<\s*([A-Za-z0-9_]+)\s*>/g)) {
      rowTypes.add(m[1] || m[2]);
    }
  }

  /* ---- CHECK A + the name half of B ----
     Two matchers, because one is not enough. The line-anchored form catches the
     normal multi-line declaration. The inline form catches a compact single-line
     type alias , `type Row = { label: string; isHighlighted: boolean }` , which
     a negative test proved the anchored matcher walks straight past. A ban that
     only holds for one formatting style is not a ban. */
  const propHits = findBooleanFieldHits(lines);

  /* ---- CHECK C prep: collect the DATA-authorable boolean vocabulary ----
     Only for CONTRACT_FILES (currently just spine2_types.ts). Every boolean
     field on an EXPORTED type there is a name the data file is allowed to
     set , unlike check A's isRow test, there is no Props/array-of-Row
     indirection to resolve here: in a contract file, exported IS the
     contract. This is what lets check C catch ANY name, not just the
     BANNED/SMELLS lists. */
  if (CONTRACT_FILES.includes(file)) {
    contractFilesScanned++;
    for (const [i, prop] of propHits) {
      const d = declAt(i);
      if (!d || !d.exported) continue;
      const key = prop.toLowerCase();
      if (!authoredBoolFields.has(key)) authoredBoolFields.set(key, `${rel}:${i + 1}  ${d.name}.${prop}`);
    }
  }

  for (const [i, prop] of propHits) {
    propsScanned++;
    const key = prop.toLowerCase();
    if (!BANNED.has(key) && !SMELLS.has(key)) continue;
    if (escaped(i)) continue;
    const d = declAt(i);
    if (!d) continue;
    /* A DATA ROW type is one the outside world fills: exported (a public data
       contract) or taken as an array by a props interface. A local type used
       for values the component itself computed (Quad's PlacedPoint) is not,
       and marking it would punish the correct pattern. */
    const isRow = d.exported || rowTypes.has(d.name);
    const where = `${rel}:${i + 1}  ${d.name}.${prop}`;
    if (!isRow) continue;
    if (BANNED.has(key)) {
      violations.push(`${where} , a bare boolean named "${prop}" on a data row type. M5: the mark is computed from the value and the stated threshold, never passed in. Replace it with the rule (a threshold constant, or an accent descriptor the caption also reads), or annotate /* ${ESCAPE} *\/ with the reason.`);
    } else {
      warnings.push(`${where} , accent-shaped boolean on a data row type. Legitimate only if it is an authored editorial ROLE, not a threshold restated as a flag (M5). Annotate /* ${ESCAPE} *\/ to settle it.`);
    }
  }

  /* ---- CHECK B: terracotta painted from a flag ---- */
  const propNames = new Set();
  for (const p of propsDecls) {
    for (const l of lines.slice(p.start, p.end + 1)) {
      const pm = /^\s*(?:readonly\s+)?([A-Za-z0-9_]+)\??\s*:/.exec(l);
      if (pm) propNames.add(pm[1]);
    }
  }
  const computedHere = new Set();
  for (const l of lines) {
    // const isBest = ... / let x = ... / field: <expression>
    const c = /^\s*(?:const|let|var)\s+([A-Za-z0-9_]+)\s*=/.exec(l);
    if (c) computedHere.add(c[1]);
    const f = /^\s*([A-Za-z0-9_]+)\s*:\s*(.+)$/.exec(l);
    if (f && DERIVED_OPS.test(f[2])) computedHere.add(f[1]);
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*(\*|\/\/|\/\*)/.test(line)) continue;         // comments describe the rule
    if (!TERRA_SINK.test(line)) continue;
    if (escaped(i)) continue;
    for (const op of ["&&", "?"]) {
      let at = -1;
      while ((at = line.indexOf(op, at + 1)) !== -1) {
        const after = line.slice(at + op.length);
        if (!TERRA_SINK.test(after)) continue;
        const before = line.slice(0, at);
        const g = /([A-Za-z0-9_$.?]+)\s*$/.exec(before);
        if (!g) continue;
        const gate = g[1];
        sinksScanned++;
        /* A call result (`isAccented(r, accent) && "hi"`) never reaches here:
           the gate regex will not match a trailing ")". What is left to rule
           out is a comparison. */
        if (DERIVED_GATE.test(before.slice(Math.max(0, before.length - 60)))) continue;
        const field = gate.split(/[.?]/).filter(Boolean).pop();
        if (!field || computedHere.has(field) || computedHere.has(gate)) continue;
        if (!propNames.has(field) && !propNames.has(gate)) continue;   // not prop-sourced
        warnings.push(`${rel}:${i + 1} , terracotta is painted from the prop "${gate}" rather than a computed expression. M5: compute the mark, or annotate /* ${ESCAPE} *\/.`);
        break;
      }
    }
  }
}

/* ---- CHECK C: shape , any authored boolean reaching a mark, by any name ----
   Hole 2 was structural: BANNED/SMELLS is a name denylist, and a denylist
   can never enumerate every name a future isCurrent-shaped field might take.
   This check does not read names at all. For every spine2 COMPONENT file
   (not the contract files themselves , they render nothing), it asks: does
   an identifier whose last segment is a name in authoredBoolFields (built
   above, straight from the contract) reach a MARK_SINK, ungated by any
   derivation? If so, M5 is broken regardless of what the field is called ,
   unlike check B's name-heuristic warning, this one fails the build, same
   severity as check A.

   Deliberately does NOT require the gate to be a top-level declared prop the
   way check B does (`propNames.has(...)`): the real defect reads a row field
   through an array , `r.isCurrent` inside `rows.map(r => ...)` , and
   `isCurrent` is never itself a top-level Props field, only a field of the
   row type the array holds. Requiring propNames membership here would miss
   exactly the pattern this check exists to catch. */
let shapeSinksScanned = 0;
if (authoredBoolFields.size > 0) {
  for (const file of walk(TARGET)) {
    const rel = relative(ROOT, file).replace(/\\/g, "/");
    const src = readFileSync(file, "utf8");
    const lines = src.split("\n");
    const escaped = (i) => lines[i]?.includes(ESCAPE) || lines[i - 1]?.includes(ESCAPE);

    const computedHere = new Set();
    for (const l of lines) {
      const c = /^\s*(?:const|let|var)\s+([A-Za-z0-9_]+)\s*=/.exec(l);
      if (c) computedHere.add(c[1]);
      const f = /^\s*([A-Za-z0-9_]+)\s*:\s*(.+)$/.exec(l);
      if (f && DERIVED_OPS.test(f[2])) computedHere.add(f[1]);
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^\s*(\*|\/\/|\/\*)/.test(line)) continue;
      if (!MARK_SINK.test(line)) continue;
      if (escaped(i)) continue;
      for (const op of ["&&", "?"]) {
        let at = -1;
        while ((at = line.indexOf(op, at + 1)) !== -1) {
          const after = line.slice(at + op.length);
          if (!MARK_SINK.test(after)) continue;
          const before = line.slice(0, at);
          const g = /([A-Za-z0-9_$.?]+)\s*$/.exec(before);
          if (!g) continue;
          const gate = g[1];
          shapeSinksScanned++;
          if (DERIVED_GATE.test(before.slice(Math.max(0, before.length - 60)))) continue;
          const field = gate.split(/[.?]/).filter(Boolean).pop();
          if (!field || computedHere.has(field) || computedHere.has(gate)) continue;
          const key = field.toLowerCase();
          if (!authoredBoolFields.has(key)) continue;
          const provenance = authoredBoolFields.get(key);
          violations.push(
            `${rel}:${i + 1}  "${gate}" , the boolean field "${field}" is authored on the data contract (${provenance}) and reaches a terracotta mark here. M5: a boolean the data file can set must never paint the mark, whatever it is called. Compute the mark locally instead (e.g. an id/slug match against the page's own subject), or annotate /* ${ESCAPE} *\/ with the reason.`
          );
          break;
        }
      }
    }
  }
}

/* -------------------------------------------------------------- report ---- */
console.log(`\nverify_derived_accents  (${relative(ROOT, TARGET).replace(/\\/g, "/")} + ${contractFilesScanned} contract file${contractFilesScanned === 1 ? "" : "s"})\n` + "=".repeat(74));
console.log(`  scanned ${filesScanned} files , ${typesScanned} type declarations, ${propsScanned} boolean props, ${sinksScanned} terracotta expressions (checks A/B)`);
console.log(`  contract: ${CONTRACT_FILES.map((f) => relative(ROOT, f).replace(/\\/g, "/")).join(", ")}`);
console.log(`  shape check (C): ${authoredBoolFields.size} data-authored boolean name${authoredBoolFields.size === 1 ? "" : "s"} [${[...authoredBoolFields.keys()].join(", ")}], ${shapeSinksScanned} candidate sink${shapeSinksScanned === 1 ? "" : "s"} examined`);

if (warnings.length) {
  console.log(`\n  ${warnings.length} warning${warnings.length > 1 ? "s" : ""} (do not fail the build; they are the queue):`);
  for (const w of warnings) console.log("  warn  " + w);
}

if (violations.length) {
  console.log("");
  for (const v of violations) console.log("  FAIL  " + v);
  console.log(`\n${violations.length} M5 violation${violations.length > 1 ? "s" : ""}: a hand-set accent in the kit.\n`);
  process.exit(1);
}
console.log(`\nM5 holds: no accent flag arrives as data.\n`);
