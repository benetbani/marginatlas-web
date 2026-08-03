/**
 * scripts/verify_no_parent_repo_reads.ts
 *
 * NOTHING THE BUILD RUNS MAY READ OUTSIDE THIS REPOSITORY.
 *
 * This is the single most expensive defect in the project's history. Vercel
 * clones only `website/` into `/vercel/path0`. The parent repo, `E:\atlas\`,
 * holds `design/mockups/` and `page-data/` and is NEVER present on a build
 * server. Anything reaching for it works perfectly on the machine where the
 * parent directory happens to sit one level up, and dies on every deploy.
 *
 * It has now killed deploys twice, in two different disguises:
 *
 *   1. Two prebuild scripts read `../design/mockups/*`. Nine deployments died
 *      in about eight seconds each, identically, on commits with unrelated
 *      contents, including one whose only change was deleting an unused file.
 *      Guarded 2026-08-01.
 *
 *   2. FIVE DEV ROUTES read `../page-data/*` with `fs` at module scope. Those
 *      are page components, so they run during "Collecting page data", long
 *      after the gates have passed. Forty consecutive deploys failed. The
 *      error names a path that cannot exist:
 *      `ENOENT: /vercel/page-data/cities/GB-london-neighborhoods.json`.
 *
 * The second one survived an audit I ran specifically looking for the first
 * one, because I searched `scripts/` and never looked in `src/`. The lesson is
 * in the scope below: this gate reads EVERYTHING the build touches, not the
 * place the last instance happened to be.
 *
 * THE SANCTIONED WAY TO USE PARENT DATA IS TO BUNDLE IT. `src/lib/spine-seeds/`
 * exists for exactly this and its own header explains why. A snapshot lives in
 * the repo and pages import it the layered way.
 *
 * WHAT IS ALLOWED. A script that reads the parent for a LOCAL-ONLY purpose
 * (regenerating the scoped stylesheet, auditing the mockups) may do so if it
 * guards with `existsSync` and skips loudly. Those never run on a build server
 * in a way that can fail it. A page or a lib module may not, under any
 * condition, because there is no safe way for a route to lose its data.
 *
 * Usage: npx tsx scripts/verify_no_parent_repo_reads.ts
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";

/** Everything that ends up in a build. `scripts/` is checked separately below
 *  because it is allowed to reach out when it guards. */
const APP_ROOTS = ["src"];

/** A path that climbs out of the repo, or names a parent-repo directory. */
const ESCAPES = [
  /["'`]\.\.\/(?:page-data|design)\//,
  /["'`][A-Za-z]:[\\/]atlas[\\/]/,
  /process\.cwd\(\)\s*,\s*["'`]\.\.\//,
];

type Hit = { file: string; line: number; text: string };

function walk(dir: string, out: string[] = []): string[] {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next") continue;
      walk(p, out);
    } else if ([".ts", ".tsx", ".mjs", ".js"].includes(extname(e.name))) {
      out.push(p);
    }
  }
  return out;
}

/** Strip comments so a file explaining this rule does not trip it. That is not
 *  hypothetical: every file fixed in the second incident carries a comment
 *  naming the path it used to read. */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

const appHits: Hit[] = [];
for (const root of APP_ROOTS) {
  for (const file of walk(root)) {
    const raw = readFileSync(file, "utf8");
    const code = stripComments(raw);
    code.split(/\r?\n/).forEach((line, i) => {
      if (ESCAPES.some((re) => re.test(line))) {
        appHits.push({
          file: relative(process.cwd(), file).replace(/\\/g, "/"),
          line: i + 1,
          text: line.trim().slice(0, 100),
        });
      }
    });
  }
}

/**
 * A script may reach out, but only if it guards and skips, AND only the ones
 * the build actually runs are judged.
 *
 * The registry is the line that matters. `audit_mockup.mjs` reads the mockups
 * unguarded and is completely safe, because it is invoked by `loop_gate.mjs`
 * from a developer's machine and never by `prebuild`. Failing the build over a
 * tool the build does not run is how a gate earns a reputation for crying wolf,
 * and this project has already paid once for a gate nobody trusted.
 */
const registered = new Set(
  [...readFileSync("scripts/prebuild_all.ts", "utf8").matchAll(/script:\s*"([^"]+)"/g)].map(
    (m) => m[1].replace(/\\/g, "/"),
  ),
);

const unguardedScripts: Hit[] = [];
for (const file of walk("scripts")) {
  const rel = relative(process.cwd(), file).replace(/\\/g, "/");
  if (!registered.has(rel)) continue;
  const code = stripComments(readFileSync(file, "utf8"));
  if (!ESCAPES.some((re) => re.test(code))) continue;
  if (/existsSync/.test(code)) continue;
  unguardedScripts.push({
    file: rel,
    line: 0,
    text: "runs in prebuild and reads the parent repo with no existsSync guard",
  });
}

const failures = [...appHits, ...unguardedScripts];

if (failures.length > 0) {
  console.error(
    `x verify_no_parent_repo_reads: ${failures.length} read(s) outside this repository.\n\n` +
      `   Vercel clones only website/. The parent repo is never there, so this\n` +
      `   works on your machine and fails every deploy. It has cost 49 of them.\n\n` +
      `   In src/: bundle the data instead. See src/lib/spine-seeds/, which\n` +
      `   exists for precisely this and explains itself.\n` +
      `   In scripts/: guard with existsSync and skip loudly.\n\n` +
      failures.map((f) => `     ${f.file}${f.line ? ":" + f.line : ""}  ${f.text}`).join("\n"),
  );
  process.exit(1);
}

console.log(
  "verify_no_parent_repo_reads: PASS. Nothing in the build reaches outside the repo.",
);
