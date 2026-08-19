/**
 * scripts/verify_no_self_referential_css_vars.ts
 *
 * A CUSTOM PROPERTY MAY NOT REFERENCE ITSELF.
 *
 * WHY THIS EXISTS, measured 2026-08-18. `src/app/globals.css` declared
 *
 *     --font-display: var(--font-display), Newsreader, Georgia, ui-serif, serif;
 *
 * on `:root`, which is the same element next/font's class lands on. Both
 * declarations therefore targeted `<html>` with equal specificity, so the
 * winner was decided by stylesheet order alone.
 *
 * Read in a real browser on a two-order fixture, because this is not something
 * source can tell you:
 *
 *   order A, the :root declaration wins:  --font-display computes to the EMPTY
 *     STRING, and `font-family: var(--font-display)` elements resolve to
 *     "NextFontSans, sans-serif, Inter, ..." , they INHERIT THE BODY SANS.
 *   order B, the font class wins:  the :root declaration is discarded whole,
 *     so its Newsreader/Georgia fallback chain never applies either.
 *
 * Harmful in one order, useless in the other, and no order does what the
 * author meant. That is why this is a hard gate rather than a ratchet: there
 * is no legitimate instance of the pattern.
 *
 * THE PART THAT SURPRISES PEOPLE, and the reason a fallback chain is not a
 * safety net: a self-referential var() is invalid at computed-value time, and
 * that invalidity takes the WHOLE declaration with it. The element does not
 * step to the next family in the list, it inherits. `LogoWordmark` carried a
 * comment claiming it "falls through to Georgia when the variable is unset";
 * unset does fall through, invalid does not, and the two were being confused.
 *
 * WHAT IT CANNOT SEE, stated: it reads declarations in CSS files only. A
 * self-reference assembled at runtime in JavaScript, or one written as an
 * inline style attribute in a component, is invisible here. And it checks the
 * property's own name only: an A-references-B-references-A cycle across two
 * declarations is a real cycle this does not detect. Both are worth adding if
 * either ever bites.
 */
import fs from "node:fs";
import path from "node:path";

const ROOTS = ["src/app", "src/styles", "src/components"];

type Hit = { file: string; line: number; prop: string; text: string };

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".css")) out.push(full);
  }
  return out;
}

function scan(file: string): Hit[] {
  const hits: Hit[] = [];
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    /* A declaration of a custom property, and the value it is given. Comments
       are not stripped: a `--x: var(--x)` written INSIDE a comment is prose
       about this very defect, and this gate's own header would trip it. So the
       match requires the declaration to start the trimmed line, which a
       comment body does not. */
    const m = /^\s*(--[a-zA-Z0-9-]+)\s*:\s*(.+?);?\s*$/.exec(line);
    if (!m) return;
    if (/^\s*\*/.test(line) || line.trim().startsWith("/*")) return;
    const [, prop, value] = m;
    const selfRef = new RegExp(`var\\(\\s*${prop}\\b`);
    if (selfRef.test(value)) {
      hits.push({ file, line: i + 1, prop, text: line.trim().slice(0, 100) });
    }
  });
  return hits;
}

function main() {
  const files = ROOTS.flatMap((r) => walk(r));
  const hits = files.flatMap(scan);

  if (hits.length > 0) {
    console.error(
      `[verify_no_self_referential_css_vars] FAIL: ${hits.length} custom propert${hits.length === 1 ? "y references itself" : "ies reference themselves"}.\n`,
    );
    for (const h of hits) {
      console.error(`  ${h.file}:${h.line}  ${h.prop}`);
      console.error(`    ${h.text}`);
    }
    console.error(
      "\nA self-referential custom property is invalid at computed-value time, which\n" +
        "discards the WHOLE declaration: consumers inherit rather than falling through\n" +
        "to the next name in the list. Give the source value its own slot name and read\n" +
        "that, the way --font-body reads --font-sans.",
    );
    process.exit(1);
  }

  console.log(
    `[verify_no_self_referential_css_vars] PASS: no custom property references itself (${files.length} css files scanned)`,
  );
}

main();
