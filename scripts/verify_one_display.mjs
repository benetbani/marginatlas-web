/**
 * verify_one_display , AN ELEMENT DECLARES ONE DISPLAY, NOT TWO.
 *
 * Two display utilities on one element compile to two CSS declarations and the
 * STYLESHEET's own source order picks the winner, not the order they are written
 * in. Nothing warns. A typecheck cannot see it. It renders, it looks deliberate,
 * and it is wrong everywhere the component is used.
 *
 * FOUND 2026-08-25 on the tooltip marker, which carried both inline-flex and
 * grid. Grid won, and grid is BLOCK level, so a marker meant to sit inside a
 * sentence was breaking the line before and after itself. On the trade page that
 * turned "16 covers ? a day to break even" into three lines and left 190 by 126
 * of the card empty beside it, which is how it was noticed at all: as a hole,
 * two rules away from its cause. Seven markers on the four London pages,
 * seventeen call sites in twelve files, every one wrong the same way.
 *
 * WHAT IT CHECKS, and the shape matters. Each STRING LITERAL inside a className
 * expression is checked on its own:
 *
 *   `inline-flex ${x} grid`      FAILS. One literal, two displays, and the
 *                                interpolation between them is why the first
 *                                attempt at this check saw nothing: a regex that
 *                                stopped at ${ never reached the second word.
 *   cond ? "flex" : "grid"       PASSES. Two literals, one display each, which is
 *                                a deliberate switch and not a collision.
 *
 * PREFIXED UTILITIES ARE IGNORED. `block md:flex` is two rules at two widths and
 * is the entire point of the prefix. Only bare utilities collide.
 *
 * BLIND SPOT: it reads source, not rendered CSS, so it cannot see a collision
 * assembled at runtime from variables, and it cannot see one where a display
 * arrives through a shared class string defined elsewhere. It catches the literal
 * case, which is the one that happened.
 *
 * Usage: node scripts/verify_one_display.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const DISPLAY = new Set([
  "block", "inline-block", "inline", "flex", "inline-flex", "grid", "inline-grid",
  "table", "inline-table", "table-cell", "table-row", "flow-root", "contents",
  "list-item", "hidden",
]);

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!/node_modules|\.next/.test(p)) walk(p);
    } else if (/\.tsx?$/.test(e.name)) files.push(p);
  }
})("src");

/* Pull the whole className expression, brace-balanced, then read the string
   literals out of it one at a time. */
function classExpressions(src) {
  const out = [];
  const re = /className\s*=\s*/g;
  let m;
  while ((m = re.exec(src))) {
    let i = m.index + m[0].length;
    if (src[i] === "{") {
      let depth = 0;
      const start = i;
      for (; i < src.length; i++) {
        if (src[i] === "{") depth++;
        else if (src[i] === "}") {
          depth--;
          if (depth === 0) { out.push(src.slice(start + 1, i)); break; }
        }
      }
    } else if (src[i] === '"' || src[i] === "'") {
      const q = src[i];
      const end = src.indexOf(q, i + 1);
      if (end > 0) out.push(src.slice(i, end + 1));
    }
  }
  return out;
}

function literalsIn(expr) {
  const out = [];
  const re = /`([^`]*)`|"([^"]*)"|'([^']*)'/g;
  let m;
  while ((m = re.exec(expr))) {
    const lit = m[1] ?? m[2] ?? m[3] ?? "";
    /* An interpolation is removed, NOT treated as a boundary: the two colliding
       utilities sat on either side of one. */
    out.push(lit.replace(/\$\{[^}]*\}/g, " "));
  }
  return out;
}

const findings = [];
for (const f of files) {
  const src = readFileSync(f, "utf8");
  const lineStarts = [];
  { let n = 0; for (const l of src.split("\n")) { lineStarts.push(n); n += l.length + 1; } }
  const lineOf = (idx) => { let lo = 0; for (let i = 0; i < lineStarts.length; i++) if (lineStarts[i] <= idx) lo = i; return lo + 1; };

  for (const expr of classExpressions(src)) {
    for (const lit of literalsIn(expr)) {
      const hits = lit.split(/\s+/).filter((t) => DISPLAY.has(t));
      if (hits.length > 1) {
        findings.push(`${f}:${lineOf(src.indexOf(expr))}  ${[...new Set(hits)].join(" + ")}`);
      }
    }
  }
}

if (findings.length) {
  console.log("x verify_one_display: an element declares more than one display, and the stylesheet decides which wins.");
  findings.forEach((x) => console.log(`     ${x}`));
  process.exit(1);
}
console.log(`PASS verify_one_display. ${files.length} files, no element declaring two displays in one class string.\n`);
