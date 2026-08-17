/**
 * audit_generation_seam.mjs , which visual generation every route renders.
 *
 * D1 in the loop backlog, open since Loop 3 and scored 27: v2 pages and legacy
 * pages are two visual products, and a reader crossing between them sees the
 * seam. DESIGN.md carries the COUNTS (10 v2 / 23 SpineShell / 69 legacy). It
 * does not carry the LIST, so nobody can work the seam down without re-deriving
 * it every time. This prints the list.
 *
 * NOT A GATE. It fails nothing and blocks nothing. The seam is a migration to
 * be worked down, not a defect to be rejected, and a gate that failed on it
 * would fail on every build until the last page moved.
 *
 * HOW A ROUTE IS CLASSIFIED. By what it renders, following one level of local
 * component import, because a route file is usually a thin server wrapper and
 * the generation lives in the client component beside it.
 *
 *   v2         , `.av2` scope or the generated atlas-spine stylesheet
 *   spineshell , the previous generation's shell, whose accent is #fb8469
 *   legacy     , the warm token vocabulary in globals.css
 *   plain      , none of the three. Usually a redirect, a handler or a stub.
 *
 * A ROUTE CAN BE TWO AT ONCE and those are the worst cases, so they are printed
 * first: one page carrying two accents is the seam at its most visible.
 *
 * Usage: node scripts/audit_generation_seam.mjs [--json]
 */
import fs from "node:fs";
import path from "node:path";

const SRC = path.join(process.cwd(), "src");
const APP = path.join(SRC, "app");

const MARKERS = [
  ["v2", /\bav2\b|atlas-spine\.css|spine2\//],
  ["spineshell", /\bSpineShell\b|components\/spine\/shell/],
  /* The surface ramp was renamed cream -> paper on 2026-08-17, so the marker
     follows it. Without this the detector quietly loses one of its five signals
     for the legacy vocabulary and starts reporting pages as "plain". */
  ["legacy", /\bparchment\b|\bpaper-\d|\bcocoa-\d|\batlas-[67]00\b|\bink-900\b/],
];

/** Every page.tsx under src/app, as a URL-ish route. */
function routes(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) routes(p, acc);
    else if (e.name === "page.tsx") acc.push(p);
  }
  return acc;
}

/** Local imports one level deep. The generation usually lives next door. */
function neighbours(file) {
  let src = "";
  try { src = fs.readFileSync(file, "utf8"); } catch { return []; }
  const out = [];
  const re = /from\s+["'](\.\.?\/[^"']+|@\/[^"']+)["']/g;
  let m;
  while ((m = re.exec(src))) {
    const spec = m[1];
    const base = spec.startsWith("@/")
      ? path.join(SRC, spec.slice(2))
      : path.resolve(path.dirname(file), spec);
    for (const ext of [".tsx", ".ts", "/index.tsx", "/index.ts"]) {
      const cand = base + ext;
      if (fs.existsSync(cand)) { out.push(cand); break; }
    }
  }
  return out;
}

function generations(file) {
  const seen = new Set();
  const bodies = [file, ...neighbours(file)];
  for (const f of bodies) {
    let s = "";
    try { s = fs.readFileSync(f, "utf8"); } catch { continue; }
    for (const [name, re] of MARKERS) if (re.test(s)) seen.add(name);
  }
  return [...seen];
}

function routeOf(file) {
  const rel = path.relative(APP, path.dirname(file)).split(path.sep).join("/");
  const url = "/" + rel
    .split("/")
    .filter((seg) => !(seg.startsWith("(") && seg.endsWith(")")))
    .join("/");
  return url === "/" ? "/" : url.replace(/\/+$/, "");
}

const files = routes(APP);
const rows = files
  .map((f) => ({ route: routeOf(f), file: path.relative(process.cwd(), f), gens: generations(f) }))
  .sort((a, b) => a.route.localeCompare(b.route));

/* A reader can reach a shipping route. Nobody but the loop reaches /dev, /admin
   or /_design, so counting them in the migration queue overstates the job by
   more than half and buries the pages that actually matter. */
const isDev = (r) => /^\/(dev|admin|_design)(\/|$)/.test(r.route);
const shipping = rows.filter((r) => !isDev(r));
const internal = rows.filter(isDev);

const mixed = rows.filter((r) => r.gens.length > 1);
const by = (g, set = shipping) => set.filter((r) => r.gens.length === 1 && r.gens[0] === g);
const plain = shipping.filter((r) => r.gens.length === 0);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ rows, counts: {
    mixed: mixed.length, v2: by("v2").length,
    spineshell: by("spineshell").length, legacy: by("legacy").length, plain: plain.length,
  } }, null, 2));
} else {
  console.log("=== the generation seam ===");
  console.log(`  ${files.length} routes under src/app\n`);

  console.log(`MIXED , two generations on one page (${mixed.length}). Worst first:`);
  for (const r of mixed) console.log(`  ${r.route}  [${r.gens.join(" + ")}]`);

  console.log(`\nLEGACY only, SHIPPING (${by("legacy").length}) , the migration queue:`);
  for (const r of by("legacy")) console.log(`  ${r.route}`);

  console.log(`\nSPINESHELL only, SHIPPING (${by("spineshell").length}) , previous generation:`);
  for (const r of by("spineshell")) console.log(`  ${r.route}`);

  console.log(`\nV2 only, SHIPPING (${by("v2").length}) , the destination, already there:`);
  for (const r of by("v2")) console.log(`  ${r.route}`);

  console.log(`\nNO MARKER (${plain.length}) , redirects, handlers, stubs:`);
  for (const r of plain) console.log(`  ${r.route}`);

  const shipMixed = mixed.filter((r) => !isDev(r));
  const touchesV2 = shipping.filter((r) => r.gens.includes("v2"));
  const notYet = shipMixed.length + by("legacy").length + by("spineshell").length;
  console.log(`\n=== the queue ===`);
  console.log(`  ${shipping.length} routes a reader can reach, ${internal.length} internal (dev, admin, _design)`);
  console.log(`  ${notYet} shipping routes are not yet v2`);
  console.log(`  ${by("v2").length} shipping routes are v2 and nothing else`);
  console.log(`  ${touchesV2.length} shipping route carries any v2 at all`);
  console.log(`  ${internal.filter((r) => r.gens.includes("v2")).length} internal routes carry v2, which is where the work has gone`);
}
