/**
 * scripts/verify_no_fixture_in_routes.ts
 *
 * FIXTURES MUST NEVER REACH A READER.
 *
 * `fixtures/` holds placeholder data lifted from the design mockups so that a
 * page type can be built and reviewed before any research has been done. Those
 * numbers are illustrative. They look exactly like real ones , same shape, same
 * fields, same tiers , which is what makes them useful for design and dangerous
 * everywhere else.
 *
 * The whole project rests on never publishing a figure whose arithmetic cannot
 * be shown. A fixture served to a reader would breach that silently, and it
 * would breach it in the most convincing possible form: a page that looks
 * complete and cites its own provenance while every number in it was invented
 * for a mockup.
 *
 * So the separation is enforced rather than remembered:
 *   - real, reconciled data lives in `data/`
 *   - placeholder data lives in `fixtures/`
 *   - nothing under `src/app/` outside the dev and design catalogs may import
 *     from `fixtures/`
 *
 * The dev routes (`src/app/dev/**`) and the design catalog (`src/app/_design/**`)
 * are exempt by design: they exist to render components in isolation and are
 * never linked from the public site.
 *
 * Usage: node --experimental-strip-types scripts/verify_no_fixture_in_routes.ts
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, relative } from "node:path";

const ROOT = resolve(process.cwd(), "src/app");

/** Route trees that exist to show components in isolation, never linked publicly. */
const EXEMPT = [/^src\/app\/dev\//, /^src\/app\/_design\//];

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = resolve(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx)$/.test(name)) acc.push(p);
  }
  return acc;
}

if (!existsSync(ROOT)) {
  console.error("x verify_no_fixture_in_routes: src/app missing. A gate with nothing to read has not passed.");
  process.exit(1);
}

const offenders: string[] = [];
let scanned = 0;
for (const file of walk(ROOT)) {
  const rel = relative(process.cwd(), file).replace(/\\/g, "/");
  if (EXEMPT.some((re) => re.test(rel))) continue;
  scanned++;
  const src = readFileSync(file, "utf8");
  src.split("\n").forEach((line, i) => {
    // an import, a require, or a dynamic import that reaches the fixtures tree
    if (/(?:from\s*["'`]|require\(\s*["'`]|import\(\s*["'`])[^"'`]*fixtures\//.test(line)) {
      offenders.push(`${rel}:${i + 1}  ${line.trim().slice(0, 100)}`);
    }
  });
}

if (offenders.length) {
  console.error(
    `x verify_no_fixture_in_routes: ${offenders.length} route file(s) import placeholder data.\n`,
  );
  for (const o of offenders) console.error("   " + o);
  console.error(
    "\n   fixtures/ holds numbers lifted from design mockups. They are illustrative\n" +
      "   and must never be served. Real data lives in data/.",
  );
  process.exit(1);
}
console.log(
  `verify_no_fixture_in_routes: PASS. ${scanned} public route files, none import fixtures.`,
);
