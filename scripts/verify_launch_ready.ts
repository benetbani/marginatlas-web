/**
 * scripts/verify_launch_ready.ts , THE LAUNCH CHECKLIST, AS A GATE RUN BY HAND
 * (plan-2026-09-17/05-DATA-AND-LAUNCH.md step 50, 2026-09-19; GOAL-PROMPT.md:
 * "Step 50's script prints the launch checklist with a tick or a reason on
 * every line. The first run of it is the plan for the fortnight after").
 *
 * NEVER IN THE CHAIN. It needs the network (production's pages), a secret
 * (the database key from .env.local), a browser (the model-laws list) and the
 * whole chain itself, none of which a chain gate may need. It is registered
 * as `npm run launch:check` and nowhere else.
 *
 * WHAT IT PRINTS: one line per item, `[ok]` or `[no] <reason>`, nine items
 * (a) to (i) in the plan's order, then a last line `LAUNCH READY` or
 * `NOT READY: n reasons`, to stdout and to scratchpad/launch/checklist.txt.
 * Exit 1 on any reason. No colour, no formatter. Progress goes to stderr (or
 * to scratchpad/launch/run-log.txt when stderr is the checklist file itself,
 * so `> checklist.txt 2>&1` still leaves a clean checklist), and every
 * instrument's full output goes to its own file under scratchpad/launch/.
 *
 * EVERY ITEM IS MEASURED BY THE THING ITSELF, never by a document that says it
 * was done:
 *   (a) every page type at its floor on three exemplars: the eighteen pages of
 *       EXEMPLARS (three per surface of the laws checker's FLOOR_BY_SURFACE,
 *       read off that file's text so a surface added there without an
 *       exemplar here is a reason) rendered through the harness's renderer
 *       (scripts/harness/render_page.tsx --list) and their BLOCK FLOOR read
 *       off the laws checker's output (scripts/harness/check_model_laws.mjs,
 *       which prints the count met or not since this step). The 90 countries
 *       with no covered city: the decision is read from MODEL.md 8.2's FLOOR
 *       bracket (plan step 49) and printed; under option A the drawn cities
 *       seat counts toward the floor, as the checker already counts it.
 *   (b) the chain green on the last deploy: `verify:deploy`'s serial chain
 *       (scripts/verify_deploy.mjs, or scratchpad/deploy/chain.txt when it
 *       was written within the last hour, with its age said), every gate
 *       green, none died on memory; then production's home page and the
 *       pages of scripts/harness/pages.json fetched (200, over 10,000 bytes)
 *       and the current build's marker looked for the way deploy_watch.mjs
 *       proves a deploy: a string the pushed code puts on the page, given
 *       with --marker=<string> [--marker-url=/gb]. With no marker the build
 *       is "unverified: no marker", a reason: nothing here claims what
 *       production serves without reading it.
 *   (c) the two database tables present: query_outcomes.ts's own
 *       checkTables(); newsletter_signups and corrections must answer;
 *       saved_cells and subscriptions absent by design are printed as such.
 *   (d) the sample marks on, or the private flag set: verify_sample_switch.ts's
 *       own readFlag() for both flags and areSampleMarksVisible() from
 *       src/lib/feature_flags.ts; the gate's one sentence when both fail.
 *   (e) the a11y report true: scripts/audit/a11y_static_audit.ts run, its
 *       counts compared with the report it wrote (scratchpad/audit/
 *       a11y_static_REPORT.md; the run is trusted, never the file alone).
 *   (f) every door landing: scripts/verify_doors.ts green over the renders.
 *   (g) every DATA requirement marked launch-blocking closed or withheld with
 *       a line: DATA-REQUIREMENTS.md's `- **Launch:** blocking` lines, each
 *       with CLOSED or WITHHELD and the page and card it names.
 *   (h) moneyShown prints no filled or floored figure:
 *       scripts/verify_money_shown_own_rows.ts green, and not vacuously.
 *   (i) the site's counts as printed on the home page agree with the ledger
 *       module at HEAD (src/lib/home/atlas_ledger.ts) and, where the
 *       definition is the same, with data/facts/index.json.
 *
 * THE BLIND SPOTS, stated before the first line is read as a fact.
 *  - (a) reads the harness's static render, not the Next page: a block the
 *    live route adds or drops outside the view is not counted here.
 *  - (b) cannot tell a stale deploy from a current one without a marker; with
 *    one, it proves that one page carries it, exactly as deploy_watch does.
 *    The chain read from a file within the hour is the chain of that hour's
 *    tree, which this script cannot prove is HEAD's; the line says the age.
 *  - (c) and (h) reach the database; a slow table falls back inside the site's
 *    own readers and the money gate names a vacuous run, which is counted as
 *    a reason here and never as a pass.
 *  - (g) reads a document, by the plan's own design: a requirement's status is
 *    a sentence the data track writes; this checks the sentence has the
 *    words, not that the block on the page is withheld (that is (a)'s
 *    renderer and the page gates' business).
 *
 * NEVER LOOSENED TO PASS: a `[no]` on the first run is the plan for the
 * fortnight after (plan step 50's "done means"); the remedy is on the page,
 * the data or the deploy, never in this file.
 *
 * Run, from E:/atlas/website:
 *   npm run launch:check
 *   npx tsx scripts/verify_launch_ready.ts [--marker=<string> [--marker-url=/gb]] [--site=https://marginatlas.com] [--only=a,g]
 * --only runs a subset by hand (a fault plant, a re-fetch after a deploy);
 * its last line says SUBSET and it never writes the checklist file.
 *
 * PLANTED ONCE, 2026-09-19, for the one item that is a parser of its own
 * ((g); the others carry their instruments' own plants): with item 36's
 * `CLOSED` misspelt in a copy of DATA-REQUIREMENTS.md read through
 * --requirements=<path>, (g) printed "NEITHER closed nor withheld: 36 One
 * GDP per person on file..." and the subset exited 1; on the real file it
 * passed. The first run itself was red on (a) and (b) by real findings.
 */
import { spawnSync } from "node:child_process";
import { existsSync, fstatSync, mkdirSync, readFileSync, statSync, writeFileSync, appendFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { preflight } from "./harness/preflight.mjs";
import { readFlag, SENTENCE } from "./verify_sample_switch";
import { areSampleMarksVisible } from "../src/lib/feature_flags";

const ROOT = process.cwd();
const OUT = "scratchpad/launch";
const CHECKLIST = `${OUT}/checklist.txt`;
const RUN_LOG = `${OUT}/run-log.txt`;
const LAUNCH_LIST = `${OUT}/pages.json`;
const HARNESS_LIST = "scripts/harness/pages.json";
const RENDERER = "scripts/harness/render_page.tsx";
const LAWS = "scripts/harness/check_model_laws.mjs";
const RENDER_DIR = "scratchpad/harness/pages";
const CHAIN_FILE = "scratchpad/deploy/chain.txt";
const CHAIN_FRESH_MS = 60 * 60_000;
/* The loop's documents live in the parent repo (E:/atlas), beside the site: a by-hand script may read there; a chain gate may not. */
const LOOP_DIR = resolve(ROOT, "../design/loop/build");
const MODEL_MD = resolve(LOOP_DIR, "briefs/MODEL.md");
const REQUIREMENTS_MD = resolve(LOOP_DIR, "DATA-REQUIREMENTS.md");
const A11Y_GATE = "scripts/audit/a11y_static_audit.ts";
const A11Y_REPORT = "scratchpad/audit/a11y_static_REPORT.md";
const DOORS_GATE = "scripts/verify_doors.ts";
const MONEY_GATE = "scripts/verify_money_shown_own_rows.ts";
const MIN_PAGE_BYTES = 10_000; // deploy_watch.mjs's floor for a page that drew a body

const argv = process.argv.slice(2);
const arg = (k: string, d: string | null): string | null => { const a = argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const MARKER = arg("marker", null);
const MARKER_URL = arg("marker-url", "/gb")!;
const SITE = arg("site", "https://marginatlas.com")!;
const ONLY = arg("only", null);
/* A copy of the order book for a plant of (g); honoured only in a subset run, so the checklist itself always reads the real file. */
const REQUIREMENTS_OVERRIDE = ONLY ? arg("requirements", null) : null;
const TSX = [process.execPath, "node_modules/tsx/dist/cli.mjs"];

/* ------------------------------------------------------------------------ */
/* THE EXEMPLARS: three per surface, the harness's page first.               */
/* ------------------------------------------------------------------------ */

type Exemplar = { surface: string; slugs: string[]; why: string };
const EXEMPLARS: Exemplar[] = [
  { surface: "country", slugs: ["GB"], why: "the harness's page: forms, a regime, covered cities, authored locals" },
  { surface: "country", slugs: ["AF"], why: "the harness's thin exemplar: no legal form, no regime, no covered city (one of the 90, the cities seat)" },
  { surface: "country", slugs: ["DE"], why: "off GB: forms on file and a covered city (Frankfurt), no authored locals" },
  { surface: "city", slugs: ["london"], why: "the harness's page: curated districts, trade cells, the London entry" },
  { surface: "city", slugs: ["frankfurt"], why: "a covered city off London: no curated districts" },
  { surface: "city", slugs: ["abidjan"], why: "a covered city on the withheld rent ratio (DATA-REQUIREMENTS item 24)" },
  { surface: "cell", slugs: ["gb", "london", "restaurants"], why: "the harness's page: money shown off the London entry" },
  { surface: "cell", slugs: ["us", "california", "cafes-coffee-shops"], why: "a US cell: money on the engine's own row or withheld by the trust gate" },
  { surface: "cell", slugs: ["in", "mumbai", "cafes-coffee-shops"], why: "money not shown: the withheld state on every gated card" },
  { surface: "industry", slugs: ["restaurants"], why: "the harness's page" },
  { surface: "industry", slugs: ["cafes-coffee-shops"], why: "a second shard trade" },
  { surface: "industry", slugs: ["shoe-repair"], why: "a trade on the archetype's default: the cost to open withheld" },
  { surface: "hood", slugs: ["london"], why: "the hub, the harness's page" },
  { surface: "hood", slugs: ["london", "city-of-london"], why: "a district page (plan step 35), the harness's page" },
  { surface: "hood", slugs: ["london", "west-end"], why: "a second district page" },
  { surface: "howto", slugs: ["GB"], why: "the harness's page: the authored locals" },
  { surface: "howto", slugs: ["DE"], why: "forms on file, no authored locals" },
  { surface: "howto", slugs: ["IN"], why: "forms on file, no authored locals" },
];
const stemOf = (p: { surface: string; slugs: string[] }) => `${p.surface}-${p.slugs.join("-")}`;
const nameOf = (p: { surface: string; slugs: string[] }) => `${p.surface} ${p.slugs.join("/")}`;

/** The production path of a harness page, mirroring the routes under src/app: [country]/page.tsx, [country]/how-to-open, (site)/cities/[slug], [country]/[geo]/[industry], (site)/industries/[industry], (site)/cities/[slug]/neighborhoods/[district]. */
function productionPath(p: { surface: string; slugs: string[] }): string {
  const s = p.slugs;
  switch (p.surface) {
    case "country": return `/${s[0].toLowerCase()}`;
    case "howto": return `/${s[0].toLowerCase()}/how-to-open`;
    case "city": return `/cities/${s[0]}`;
    case "cell": return `/${s[0]}/${s[1]}/${s[2]}`;
    case "industry": return `/industries/${s[0]}`;
    case "hood": return s[1] ? `/cities/${s[0]}/neighborhoods/${s[1]}` : `/cities/${s[0]}/neighborhoods`;
    default: return `/${s.join("/")}`;
  }
}

/* ------------------------------------------------------------------------ */
/* THE PLUMBING: progress, the checklist, a subprocess to a file.            */
/* ------------------------------------------------------------------------ */

mkdirSync(OUT, { recursive: true });

/** True when the file descriptor is the file at `path` (the shell redirected it there). */
function fdIsFile(fd: number, path: string): boolean {
  try {
    const a = fstatSync(fd);
    if (!a.isFile() || !existsSync(path)) return false;
    const b = statSync(path);
    return a.dev === b.dev && a.ino === b.ino;
  } catch { return false; }
}
/* Progress to stderr, unless stderr IS the checklist file (the redirect `> checklist.txt 2>&1`), in which case it goes to the run log. */
const stderrIsChecklist = fdIsFile(2, CHECKLIST);
writeFileSync(RUN_LOG, "");
function say(line: string): void {
  appendFileSync(RUN_LOG, line + "\n");
  if (!stderrIsChecklist) process.stderr.write(line + "\n");
}
const stamp = () => new Date().toISOString().slice(11, 19);
const mins = (ms: number) => `${(ms / 60000).toFixed(1)} min`;

/* THE GROUND FIRST: the site root, free memory printed; a wrong ground stops here with the remedy (exit 2). Its one line goes to the run log, not to stdout, which holds the checklist alone. */
{
  const log = console.log;
  console.log = (...parts: unknown[]) => say(`${stamp()} ${parts.map(String).join(" ")}`);
  try { preflight({ name: "verify_launch_ready" }); } finally { console.log = log; }
}

type Item = { id: string; ok: boolean; text: string };
const items: Item[] = [];
const record = (id: string, ok: boolean, text: string) => { items.push({ id, ok, text }); say(`${stamp()} (${id}) ${ok ? "ok" : "NO"}: ${text}`); };

/** Run a command to completion, its whole output to `file`; returns the status (null when it could not be spawned) and the text. */
function run(name: string, cmd: string[], file: string, timeoutMs: number): { status: number | null; text: string; error?: string } {
  say(`${stamp()} ${name}: ${cmd.slice(1).join(" ")} -> ${file}`);
  const t0 = Date.now();
  const r = spawnSync(cmd[0], cmd.slice(1), { encoding: "utf8", maxBuffer: 256 * 1024 * 1024, timeout: timeoutMs, env: process.env });
  const text = `$ ${cmd.join(" ")}\n\n${r.stdout ?? ""}${r.stderr ?? ""}`;
  writeFileSync(file, text);
  const status = r.error ? null : r.status;
  say(`${stamp()} ${name}: exit ${status === null ? `none (${r.error?.message})` : status} in ${mins(Date.now() - t0)}`);
  return { status, text, error: r.error?.message };
}

const num = (s: string) => Number(s.replace(/,/g, ""));
const fmt = (n: number) => n.toLocaleString("en-US");

/* ------------------------------------------------------------------------ */
/* (a) every page type at its floor on three exemplars                       */
/* ------------------------------------------------------------------------ */

function itemA(): void {
  /* The surfaces come from the checker's own FLOOR_BY_SURFACE, read off its text (importing it would run it). */
  const lawsSrc = readFileSync(LAWS, "utf8");
  const m = lawsSrc.match(/const FLOOR_BY_SURFACE = \{([^}]*)\}/);
  const floors: Record<string, number> = {};
  if (m) for (const pair of m[1].matchAll(/(\w+):\s*(\d+)/g)) floors[pair[1]] = Number(pair[2]);
  const surfaces = Object.keys(floors);
  const missing = surfaces.filter((s) => EXEMPLARS.filter((e) => e.surface === s).length < 3);
  if (!surfaces.length || missing.length) {
    record("a", false, `the exemplar list does not cover every surface of ${LAWS}'s FLOOR_BY_SURFACE (${surfaces.join(", ") || "none read"}): ${missing.length ? `${missing.join(", ")} without three exemplars` : "the floors could not be read off the file"}`);
    return;
  }

  /* Render the eighteen through the harness's renderer, one process, the same spawn as pages-fresh. */
  writeFileSync(LAUNCH_LIST, JSON.stringify({ why: "The launch checklist's exemplars (scripts/verify_launch_ready.ts, plan step 50): three pages per surface of FLOOR_BY_SURFACE, rendered by scripts/harness/render_page.tsx --list and measured by check_model_laws.mjs --list. Written by the script on every run.", pages: EXEMPLARS }, null, 2) + "\n");
  const renderStarted = Date.now();
  run("render", [...TSX, "--tsconfig", "scripts/tsconfig.harness.json", "--require", "./scripts/harness/env.cjs", "--require", "./scripts/spikes/stub_next_font.cjs", RENDERER, "--list", LAUNCH_LIST], `${OUT}/render.txt`, 15 * 60_000);
  /* A page rendered when its file is fresh (written after the render started) and whole (over the floor), pages-fresh's own two tests; a stale file from an earlier run is not a render. */
  const rendered = new Map<string, boolean>();
  for (const e of EXEMPLARS) {
    const path = `${RENDER_DIR}/${stemOf(e)}.html`;
    rendered.set(stemOf(e), existsSync(path) && statSync(path).mtimeMs >= renderStarted && statSync(path).size > MIN_PAGE_BYTES);
  }

  /* The decision on the 90, read from MODEL 8.2's FLOOR paragraph (plan step 49) and printed. */
  let decision = "MODEL.md 8.2 not read";
  let optionA = false;
  if (existsSync(MODEL_MD)) {
    const floorPara = readFileSync(MODEL_MD, "utf8").split(/\r?\n/).find((l) => /^\*\*FLOOR: \d+\.\*\*/.test(l)) ?? "";
    const d = floorPara.match(/PLAN STEP 49, DECIDED[^\]]*?OPTION ([A-Z])/);
    if (d) { optionA = d[1] === "A"; decision = `MODEL 8.2's FLOOR bracket: plan step 49 decided option ${d[1]}${optionA ? " (the 90 ship with the cities seat drawn and counted toward the floor)" : " (a country with no covered city is held)"}`; }
    else decision = "MODEL 8.2's FLOOR paragraph carries no plan-step-49 decision";
  } else decision = `${MODEL_MD} not found; the decision on the 90 could not be read`;

  /* The floors, off the checker's output. */
  const laws = run("laws", [process.execPath, LAWS, `--list=${LAUNCH_LIST}`], `${OUT}/laws.txt`, 20 * 60_000);
  if (laws.status === 2 || laws.status === null) {
    record("a", false, `unverified: the laws checker exited ${laws.status ?? "without starting"} before measuring (${basename(`${OUT}/laws.txt`)}: ${(laws.text.split(/\r?\n/).find((l) => /STOP|refused|usage|Error/.test(l)) ?? "no line").trim().slice(0, 160)}); ${decision}`);
    return;
  }
  const below: string[] = [];
  const met: string[] = [];
  const unread: string[] = [];
  for (const e of EXEMPLARS) {
    const stem = stemOf(e);
    const name = nameOf(e);
    if (!rendered.get(stem)) { below.push(`${name} did not render`); continue; }
    const esc = stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const red = laws.text.match(new RegExp(`^\\s*${esc}@[0-9/]+ #page: BLOCK FLOOR: (\\d+) blocks against a floor of (\\d+)`, "m"));
    const ok = laws.text.match(new RegExp(`^\\s*${esc}: BLOCK FLOOR: (\\d+) blocks against a floor of (\\d+), met`, "m"));
    const none = laws.text.match(new RegExp(`^\\s*${esc}: BLOCK FLOOR: no \\[data-block\\]`, "m"));
    const seat = e.surface === "country" && /<div id="cities"[^>]*data-blocked="1"/.test(readFileSync(`${RENDER_DIR}/${stem}.html`, "utf8"));
    if (red) {
      below.push(`${name} ${red[1]} of ${red[2]}${seat ? " (the cities seat drawn)" : ""}`);
    } else if (ok) {
      if (seat && !optionA) below.push(`${name} ${ok[1]} of ${ok[2]} with the cities seat drawn, and the decision read is not option A: held`);
      else met.push(`${name} ${ok[1]} of ${ok[2]}${seat ? " with the cities seat" : ""}`);
    } else if (none) {
      below.push(`${name}: no [data-block] on the render, the count unmeasured`);
    } else {
      unread.push(name);
    }
  }
  const ok = below.length === 0 && unread.length === 0;
  const head = `${met.length} of ${EXEMPLARS.length} exemplars at their floor (${surfaces.map((s) => `${s} ${floors[s]}`).join(", ")}) by ${LAWS}`;
  const detail = [
    below.length ? `below: ${below.join("; ")}` : "",
    unread.length ? `no BLOCK FLOOR line read for: ${unread.join(", ")}` : "",
    met.length ? `met: ${met.join("; ")}` : "",
    decision,
    `output ${OUT}/laws.txt`,
  ].filter(Boolean).join(". ");
  record("a", ok, `${head}. ${detail}`);
}

/* ------------------------------------------------------------------------ */
/* (b) the chain green on the last deploy, and production reached           */
/* ------------------------------------------------------------------------ */

/** One production page, fetched the way deploy_watch.mjs fetches (the www redirect followed, no cache, 30 s), with its status, byte count, marker hits and archetype census on one line; a zero-byte body prints as bytes=0 and never passes for a page. */
async function fetchPage(path: string): Promise<{ path: string; status: number | null; bytes: number; hits: number; body: string; error?: string; line: string }> {
  const url = new URL(path, SITE).href;
  let status: number | null = null; let body = ""; let error: string | undefined;
  try {
    const r = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(30_000), headers: { "cache-control": "no-cache" } });
    status = r.status; body = await r.text();
  } catch (e) { error = e instanceof Error ? e.message : String(e); }
  const bytes = Buffer.byteLength(body);
  const hits = MARKER ? body.split(MARKER).length - 1 : 0;
  const census = new Map<string, number>();
  for (const mm of body.matchAll(/data-archetype="([a-z-]+)"/g)) census.set(mm[1], (census.get(mm[1]) ?? 0) + 1);
  const line = `${stamp()} ${path.padEnd(44)} ${status ?? "no answer"} bytes=${bytes} hits=${hits}${error ? ` (${error})` : ""}${census.size ? `  archetypes: ${[...census].map(([k, v]) => `${k} ${v}`).join(", ")}` : ""}`;
  return { path, status, bytes, hits, body, error, line };
}

async function itemB(): Promise<{ home: string | null }> {
  /* THE CHAIN: the file within the hour, with its age, else the serial run. */
  let chainText = "";
  let chainNote = "";
  const fresh = existsSync(CHAIN_FILE) && Date.now() - statSync(CHAIN_FILE).mtimeMs < CHAIN_FRESH_MS;
  if (fresh) {
    chainText = readFileSync(CHAIN_FILE, "utf8");
    chainNote = `read from ${CHAIN_FILE}, written ${mins(Date.now() - statSync(CHAIN_FILE).mtimeMs)} ago`;
  } else {
    const t0 = Date.now();
    const r = run("chain", [process.execPath, "scripts/verify_deploy.mjs"], `${OUT}/chain-run.txt`, 45 * 60_000);
    /* verify_deploy writes chain.txt only once the chain has run; a refusal (exit 2) or a crash leaves the old file, which is not this run's. */
    const written = existsSync(CHAIN_FILE) && statSync(CHAIN_FILE).mtimeMs >= t0;
    if (r.status === 2) chainNote = `the chain refused to start (exit 2, the preflight: ${(r.text.split(/\r?\n/).find((l) => /free memory|STOP/.test(l)) ?? "").trim().slice(0, 140)})`;
    else chainNote = `run now by scripts/verify_deploy.mjs (exit ${r.status ?? r.error}), ${written ? `written to ${CHAIN_FILE}` : `and ${CHAIN_FILE} was not written by it`}`;
    chainText = written ? readFileSync(CHAIN_FILE, "utf8") : "";
  }
  const ran = chainText.match(/Ran: (\d+) \/ (\d+) gates(.*)/);
  const passed = chainText.match(/Passed: (\d+)/);
  const failed = chainText.match(/Failed: (\d+)(?: \((\d+) by TIMEOUT\))?/);
  const died = chainText.match(/Died on memory: (\d+)/);
  const deferred = chainText.match(/Deferred: (\d+) check\(s\) could not run \(([^)]*)\)/);
  /* The failed gates by name, off the chain's own per-gate lines (`✗ name  12.3s  TIMEOUT`), so the reason names them. */
  const failedGates = [...chainText.matchAll(/^\s+✗ (\S+)\s+([\d.]+)s(?:\s+(TIMEOUT|MEMORY))?/gm)].map((mm) => `${mm[1]}${mm[3] ? ` by ${mm[3]} after ${mm[2]} s` : ""}`);
  const summaryRead = !!(ran && passed && failed && died);
  const wholeChain = !!ran && ran[1] === ran[2] && !/subset/.test(ran[3]);
  const chainGreen = summaryRead && wholeChain && Number(failed![1]) === 0 && Number(died![1]) === 0 && /GATE: PASS/.test(chainText);
  const chainWords = summaryRead
    ? `${passed![1]} of ${ran![2]} gates passed, ${failed![1]} failed${failed![2] ? ` (${failed![2]} by TIMEOUT)` : ""}${failedGates.length ? ` (${failedGates.join(", ")})` : ""}, ${died![1]} died on memory${wholeChain ? "" : " (a subset, not the chain)"}${deferred ? `, ${deferred[1]} check(s) deferred inside ${deferred[2]} (not passes, the gate says)` : ""}`
    : "no chain summary could be read";

  /* PRODUCTION: the home page and the harness's pages, each fetched and read. */
  const listed = JSON.parse(readFileSync(HARNESS_LIST, "utf8")).pages as Array<{ surface: string; slugs: string[] }>;
  const targets: Array<{ name: string; path: string }> = [{ name: "home", path: "/" }, ...listed.map((p) => ({ name: nameOf(p), path: productionPath(p) }))];
  const fetched: Array<{ name: string; path: string; status: number | null; bytes: number; hits: number; error?: string }> = [];
  let home: string | null = null;
  const log: string[] = [];
  for (const t of targets) {
    const f = await fetchPage(t.path);
    fetched.push({ name: t.name, ...f });
    if (t.name === "home" && f.status === 200 && f.bytes > MIN_PAGE_BYTES) home = f.body;
    log.push(f.line);
  }
  writeFileSync(`${OUT}/fetch.txt`, log.join("\n") + "\n");
  for (const l of log) say(l);
  const bad = fetched.filter((f) => f.status !== 200 || f.bytes <= MIN_PAGE_BYTES);
  const served = `${fetched.length - bad.length} of ${fetched.length} pages answer 200 with a body (${SITE}: home ${fetched[0].status ?? "no answer"}, ${fmt(fetched[0].bytes)} bytes)${bad.length ? `; not served: ${bad.map((f) => `${f.path} ${f.status ?? f.error ?? "no answer"} ${f.bytes} bytes`).join(", ")}` : ""}`;
  let marker: string;
  let markerOk = false;
  if (!MARKER) marker = `the current build's marker is unverified: no marker (pass --marker=<a string HEAD puts on the page and the previous deploy did not> --marker-url=${MARKER_URL}, the way deploy:watch proves a deploy)`;
  else {
    const at = fetched.find((f) => f.path === MARKER_URL);
    markerOk = !!at && at.status === 200 && at.hits > 0;
    marker = at ? `the marker ${JSON.stringify(MARKER)} ${markerOk ? `is on ${MARKER_URL} (${at.hits} hit${at.hits === 1 ? "" : "s"})` : `is NOT on ${MARKER_URL} (${at.status ?? at.error}, ${at.hits} hits): production does not serve the build that carries it`}` : `--marker-url=${MARKER_URL} is not among the fetched pages`;
  }
  const ok = chainGreen && bad.length === 0 && markerOk;
  record("b", ok, `chain ${chainGreen ? "green" : "NOT green"}: ${chainWords} (${chainNote}); production: ${served}; ${marker}`);
  return { home };
}

/* ------------------------------------------------------------------------ */
/* (c) the two database tables present                                       */
/* ------------------------------------------------------------------------ */

async function itemC(): Promise<void> {
  /* .env.local the way the money gate loads it (node's own reader); the values are never printed. */
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) { try { process.loadEnvFile(".env.local"); } catch { /* no env file: makeClient says so */ } }
  const q = await import("./query_outcomes");
  const client = q.makeClient();
  if (!client) { record("c", false, "no NEXT_PUBLIC_SUPABASE_URL and key in the environment or .env.local; the tables could not be asked"); return; }
  let rows: Awaited<ReturnType<typeof q.checkTables>>;
  try { rows = await q.checkTables(client.db); } catch (e) { record("c", false, `query_outcomes' checkTables threw: ${e instanceof Error ? e.message : String(e)}`); return; }
  writeFileSync(`${OUT}/tables.txt`, rows.map(q.tableLine).join("\n") + "\n");
  for (const r of rows) say(`${stamp()}${q.tableLine(r)}`);
  const must = ["newsletter_signups", "corrections"];
  const byName = new Map(rows.map((r) => [r.name, r]));
  const missingMust = must.filter((n) => byName.get(n)?.state !== "ok");
  const errors = rows.filter((r) => r.state === "error" || r.state === "nocount");
  const offs = rows.filter((r) => r.state === "off");
  const oks = rows.filter((r) => r.state === "ok");
  const ok = missingMust.length === 0 && errors.length === 0;
  const words = [
    must.map((n) => { const r = byName.get(n); return r?.state === "ok" ? `${n} ${fmt(r.count!)} rows` : `${n} ${r ? `${r.state}${r.message ? `: ${r.message}` : ""}` : "not in the list"}`; }).join(", "),
    `the other tables: ${oks.filter((r) => !must.includes(r.name)).map((r) => `${r.name} ${fmt(r.count!)}`).join(", ")}`,
    offs.length ? `${offs.map((r) => r.name).join(" and ")} absent by design (${offs.map((r) => r.off).join("; ")}), not reasons` : "",
    errors.filter((r) => !must.includes(r.name)).length ? `in error: ${errors.filter((r) => !must.includes(r.name)).map((r) => `${r.name} (${r.message ?? r.state})`).join(", ")}` : "",
    `with the ${client.role.split(" (")[0]}`,
  ].filter(Boolean).join("; ");
  record("c", ok, words);
}

/* ------------------------------------------------------------------------ */
/* (d) the sample marks on, or the private flag set                          */
/* ------------------------------------------------------------------------ */

function itemD(): void {
  const marks = readFlag("NEXT_PUBLIC_SHOW_SAMPLE_MARKS");
  const priv = readFlag("NEXT_PUBLIC_SITE_PRIVATE");
  const visible = areSampleMarksVisible();
  const marksOn = marks.on === true;
  const sitePrivate = priv.on === true;
  const readings = `areSampleMarksVisible() ${visible} in this process; the build's reading: sample marks ${marksOn ? "ON" : "OFF"} (${marks.source}), site private ${sitePrivate ? "YES" : "NO"} (${priv.source})`;
  if (marksOn) record("d", true, `the sample marks are on; ${readings}`);
  else if (sitePrivate) record("d", true, `the marks are off and the site declares itself private; launch day flips both in one commit (docs/DEPLOY-PACK-spine-flags.md, the sample-switch gate holds it); ${readings}`);
  else record("d", false, `${SENTENCE}; ${readings}`);
}

/* ------------------------------------------------------------------------ */
/* (e) the a11y report true                                                  */
/* ------------------------------------------------------------------------ */

function itemE(): void {
  const r = run("a11y", [...TSX, A11Y_GATE], `${OUT}/a11y.txt`, 10 * 60_000);
  const pass = r.text.match(/GATE: PASS\s+4 checks, (\d+) findings across (\d+) files/);
  const fail = r.text.match(/x a11y_static: (\d+) finding\(s\)/);
  const scanned = r.text.match(/Scanning (\d+) source files/);
  const counters: Record<string, number> = {};
  for (const mm of r.text.matchAll(/^\s+([a-z-]+)\s*: (\d+)$/gm)) counters[mm[1]] = Number(mm[2]);
  const runFindings = pass ? Number(pass[1]) : fail ? Number(fail[1]) : null;
  const runFiles = pass ? Number(pass[2]) : scanned ? Number(scanned[1]) : null;
  if (r.status !== 0 || runFindings === null || runFiles === null) {
    record("e", false, `the a11y gate ${r.status === 0 ? "printed no readable verdict" : `exited ${r.status ?? r.error}`}${runFindings ? ` with ${runFindings} finding(s)` : ""} (${OUT}/a11y.txt)`);
    return;
  }
  if (!existsSync(A11Y_REPORT)) { record("e", false, `the gate ran (${runFindings} findings across ${runFiles} files) but wrote no report at ${A11Y_REPORT}`); return; }
  const report = readFileSync(A11Y_REPORT, "utf8");
  const repFiles = report.match(/Scanned (\d+) TS\/TSX source files/);
  const repCounters: Record<string, number> = {};
  for (const mm of report.matchAll(/^- \*\*([a-z-]+)\*\*: (\d+)$/gm)) repCounters[mm[1]] = Number(mm[2]);
  const repTotal = Object.values(repCounters).reduce((n, v) => n + v, 0);
  const disagree: string[] = [];
  if (!repFiles || Number(repFiles[1]) !== runFiles) disagree.push(`files ${repFiles ? repFiles[1] : "unread"} in the report against ${runFiles} in the run`);
  for (const [k, v] of Object.entries(counters)) if (repCounters[k] !== v) disagree.push(`${k} ${repCounters[k] ?? "unread"} in the report against ${v} in the run`);
  const ok = runFindings === 0 && disagree.length === 0;
  record("e", ok, `${runFindings === 0 ? "the gate ran green" : `the gate found ${runFindings}`}: ${runFindings} finding(s) across ${runFiles} files (${Object.entries(counters).map(([k, v]) => `${k} ${v}`).join(", ")}); the report ${A11Y_REPORT} ${disagree.length ? `DISAGREES: ${disagree.join("; ")}` : `says the same (${repFiles ? repFiles[1] : "?"} files, ${repTotal} findings)`}`);
}

/* ------------------------------------------------------------------------ */
/* (f) every door landing                                                    */
/* ------------------------------------------------------------------------ */

function itemF(): void {
  const r = run("doors", [...TSX, DOORS_GATE, `--out=${OUT}/doors.txt`], `${OUT}/doors-run.txt`, 10 * 60_000);
  const count = r.text.match(/(\d+) anchors walked; (\d+) unverifiable/);
  const verdict = r.text.match(/ok doors: (.*)/);
  const reds = [...r.text.matchAll(/^x doors .*$/gm)].map((mm) => mm[0].trim());
  const ok = r.status === 0 && !!verdict;
  record("f", ok, ok
    ? `${verdict![1].trim()}; the walk in ${OUT}/doors.txt`
    : `the doors gate exited ${r.status ?? r.error}${count ? ` after walking ${count[1]} anchors (${count[2]} unverifiable)` : ""}: ${reds.length ? `${reds.length} red(s), the first: ${reds[0].slice(0, 200)}` : "no verdict line"} (${OUT}/doors-run.txt)`);
}

/* ------------------------------------------------------------------------ */
/* (g) every launch-blocking DATA requirement closed or withheld with a line */
/* ------------------------------------------------------------------------ */

function itemG(): void {
  const file = REQUIREMENTS_OVERRIDE ? resolve(REQUIREMENTS_OVERRIDE) : REQUIREMENTS_MD;
  if (!existsSync(file)) { record("g", false, `${file} not found; the order book is in the parent repo and could not be read`); return; }
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  type Req = { n: number; title: string; launch: string; blocking: boolean; closed: boolean; withheld: boolean; pages: string[]; cards: string[]; cardsNamePage: boolean };
  const reqs: Req[] = [];
  let heading: { n: number; title: string } | null = null;
  const PAGE_WORD = /\b(country|city|trade|industry|neighbou?rhood|hood|how-?to|home|every page)\b/gi;
  for (const line of lines) {
    const h = line.match(/^## (\d+)\. (.+)$/);
    if (h) { heading = { n: Number(h[1]), title: h[2].trim() }; continue; }
    const l = line.match(/^- \*\*Launch:\*\* (.+)$/);
    if (!l || !heading) continue;
    const launch = l[1].trim();
    const blocking = /^blocking/i.test(launch);
    const cards = [...launch.matchAll(/`(\d{2} [a-z-]+)`/g)].map((mm) => mm[1]);
    const pages = [...new Set([...launch.matchAll(PAGE_WORD)].map((mm) => mm[1].toLowerCase()))];
    /* The heading's own (page:card, ...) pairs name the block when the line names it in words only. */
    const headPairs = [...heading.title.matchAll(/\b(country|city|trade|industry|neighbou?rhood|hood|howto):([a-z-]+)/g)].map((mm) => `${mm[1]} ${mm[2]}`);
    reqs.push({ n: heading.n, title: heading.title, launch, blocking, closed: /\bCLOSED\b/.test(launch), withheld: /\bWITHHELD\b/.test(launch), pages, cards: cards.length ? cards : headPairs, cardsNamePage: cards.length === 0 });
  }
  const blocking = reqs.filter((r) => r.blocking);
  const closed = blocking.filter((r) => r.closed);
  const withheld = blocking.filter((r) => !r.closed && r.withheld);
  const neither = blocking.filter((r) => !r.closed && !r.withheld);
  const unplaced = withheld.filter((r) => r.pages.length === 0);
  const notBlocking = reqs.filter((r) => !r.blocking);
  const ok = blocking.length > 0 && neither.length === 0 && unplaced.length === 0;
  /* The page and card the line names: `6 (country 16 locals)`; a card named by the heading already carries its page (`32 (country glance)`). */
  const where = (r: Req) => `${r.n} (${r.cards.length && r.cardsNamePage ? r.cards.join(", ") : `${r.pages.join("/")}${r.cards.length ? ` ${r.cards.join(", ")}` : ""}`})`;
  const words = [
    `${blocking.length} item(s) marked launch-blocking in ${REQUIREMENTS_OVERRIDE ? `${file} (a copy, not the order book; a subset run)` : "DATA-REQUIREMENTS.md"}${reqs.length ? "" : " (no Launch lines read at all)"}`,
    closed.length ? `CLOSED: ${closed.map((r) => r.n).join(", ")}` : "",
    withheld.length ? `WITHHELD with a line: ${withheld.map(where).join("; ")}` : "",
    neither.length ? `NEITHER closed nor withheld: ${neither.map((r) => `${r.n} ${r.title}`).join("; ")}` : "",
    unplaced.length ? `withheld but naming no page and card: ${unplaced.map((r) => `${r.n} ${r.title}`).join("; ")}` : "",
    notBlocking.length ? `not blocking: ${notBlocking.map((r) => r.n).join(", ")}` : "",
  ].filter(Boolean).join(". ");
  record("g", ok, words);
}

/* ------------------------------------------------------------------------ */
/* (h) moneyShown prints no filled or floored figure                         */
/* ------------------------------------------------------------------------ */

function itemH(): void {
  const r = run("money", [...TSX, MONEY_GATE], `${OUT}/money.txt`, 15 * 60_000);
  const counts = r.text.match(/walked (\d+): resolved (\d+), synthetic (\d+), trusted (\d+), money shown (\d+) \(London entry (\d+)\), filled (\d+), floored (\d+)/);
  const notOk = r.text.match(/query outcomes not ok: (\d+)/);
  const vacuous = /EVERY WALKED CELL RESOLVED SYNTHETIC/.test(r.text);
  const pass = /money-shown-own-rows: PASS/.test(r.text);
  const reds = [...r.text.matchAll(/^x money-shown-own-rows .*$/gm)].map((mm) => mm[0].trim());
  const ok = r.status === 0 && pass && !vacuous;
  const countWords = counts ? `${counts[1]} routes walked, ${counts[2]} resolved, ${counts[5]} show money (${counts[6]} off the London entry), ${counts[7]} filled and ${counts[8]} floored rows withheld` : "no counts line read";
  record("h", ok, ok
    ? `the gate passed: ${countWords}; query outcomes not ok ${notOk ? notOk[1] : "?"}`
    : `${vacuous ? "the gate proved nothing: every walked cell resolved synthetic (the database did not answer)" : `the gate exited ${r.status ?? r.error}`}: ${countWords}${reds.length ? `; ${reds.length} red(s), the first: ${reds[0].slice(0, 200)}` : ""} (${OUT}/money.txt)`);
}

/* ------------------------------------------------------------------------ */
/* (i) the home page's counts are the site's own                             */
/* ------------------------------------------------------------------------ */

async function itemI(home: string | null): Promise<void> {
  const { getAtlasLedger } = await import("../src/lib/home/atlas_ledger");
  const l = getAtlasLedger();
  const index = JSON.parse(readFileSync("data/facts/index.json", "utf8")) as { index: Record<string, number> };
  const kinds: Record<string, string[]> = {};
  for (const k of Object.keys(index.index)) { const [kind, ...rest] = k.split("/"); (kinds[kind] ||= []).push(rest.join("/")); }
  const idxCities = new Set((kinds.city ?? []).map((s) => s.replace(/^[A-Z]{2}-/, "")));
  const cityList = JSON.parse(readFileSync("data/cities/city_list_v1.json", "utf8")) as { cities: Array<{ slug: string }> };
  const listSlugs = cityList.cities.map((c) => c.slug);
  const cityMismatch = listSlugs.filter((s) => !idxCities.has(s)).length + [...idxCities].filter((s) => !listSlugs.includes(s)).length;
  const indexWords = `data/facts/index.json holds ${idxCities.size} city entities (${cityMismatch === 0 ? "the same " + fmt(listSlugs.length) + " as the city list" : `${cityMismatch} differ from the city list`}), ${(kinds.country ?? []).length} country entities against ${l.countriesTotal} with a page, ${(kinds.industry ?? []).length} trade shards against the ${l.trades} the taxonomy shows`;
  const moduleWords = `the ledger module at HEAD: ${fmt(l.benchmarks)} benchmarks, ${l.countriesMeasured} countries of ${l.countriesTotal}, ${l.cities} cities with ${fmt(l.districts)} districts, ${l.trades} trades`;
  if (!home) { record("i", false, `the home page was not fetched (see (b)), so what it prints could not be read; ${moduleWords}; ${indexWords}`); return; }
  const at = home.indexOf("What the atlas holds");
  const band = at === -1 ? "" : home.slice(at, at + 6000);
  const printed: Record<string, { figure: number; note: string }> = {};
  for (const mm of band.matchAll(/>([\d,]+)<\/div><div[^>]*>(Benchmarks|Countries|Cities|Trades)<\/div><div[^>]*>([^<]*)<\/div>/g)) printed[mm[2]] = { figure: num(mm[1]), note: mm[3].trim() };
  const need = ["Benchmarks", "Countries", "Cities", "Trades"];
  if (at === -1 || need.some((n) => !printed[n])) { record("i", false, `the home page as served carries no readable ledger band ("What the atlas holds" ${at === -1 ? "absent" : "present, the figures unread"}); ${moduleWords}; ${indexWords}`); return; }
  const total = num(printed.Countries.note.match(/of ([\d,]+)/)?.[1] ?? "0");
  const districts = num(printed.Cities.note.match(/^([\d,]+) districts/)?.[1] ?? "0");
  const diffs: string[] = [];
  if (printed.Benchmarks.figure !== l.benchmarks) diffs.push(`benchmarks ${fmt(printed.Benchmarks.figure)} printed, ${fmt(l.benchmarks)} at HEAD`);
  if (printed.Countries.figure !== l.countriesMeasured) diffs.push(`countries ${printed.Countries.figure} printed, ${l.countriesMeasured} at HEAD`);
  if (total !== l.countriesTotal) diffs.push(`countries with a page ${total} printed, ${l.countriesTotal} at HEAD`);
  if (printed.Cities.figure !== l.cities) diffs.push(`cities ${printed.Cities.figure} printed, ${l.cities} at HEAD`);
  if (districts !== l.districts) diffs.push(`districts ${fmt(districts)} printed, ${fmt(l.districts)} at HEAD`);
  if (printed.Trades.figure !== l.trades) diffs.push(`trades ${printed.Trades.figure} printed, ${l.trades} at HEAD`);
  if (printed.Cities.figure !== idxCities.size || cityMismatch) diffs.push(`cities ${printed.Cities.figure} printed, ${idxCities.size} city entities in data/facts/index.json${cityMismatch ? ` (${cityMismatch} slugs differ)` : ""}`);
  const ok = diffs.length === 0;
  record("i", ok, `the home page prints ${fmt(printed.Benchmarks.figure)} benchmarks, ${printed.Countries.figure} countries of ${total} with a page, ${printed.Cities.figure} cities with ${fmt(districts)} districts, ${printed.Trades.figure} trades${ok ? ", as the ledger module computes at HEAD" : `; DISAGREES: ${diffs.join("; ")}; ${moduleWords}`}; ${indexWords}`);
}

/* ------------------------------------------------------------------------ */
/* THE RUN                                                                   */
/* ------------------------------------------------------------------------ */

async function main(): Promise<number> {
  const started = Date.now();
  const head = spawnSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8" }).stdout?.trim() || "HEAD unread";
  say(`${stamp()} launch checklist at ${head}, ${new Date().toISOString()}; instruments write to ${OUT}/`);

  const order = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
  /* --only=<ids> runs a subset by hand (a plant, a re-fetch after a deploy) and is never the checklist: nothing is written to the checklist file and the last line says so. */
  const only = ONLY ? new Set(ONLY.split(",").map((s) => s.trim()).filter(Boolean)) : null;
  const wanted = (id: string) => !only || only.has(id);
  if (only) { const unknown = [...only].filter((id) => !order.includes(id)); if (unknown.length) { process.stdout.write(`--only names no item: ${unknown.join(", ")} (the items are ${order.join(", ")})\n`); return 2; } }

  /* (d) is read before anything loads .env.local into this process, so the flag sources it prints are the build's. */
  if (wanted("d")) itemD();
  if (wanted("a")) itemA();
  let home: string | null = null;
  if (wanted("b")) home = (await itemB()).home;
  else if (wanted("i")) { const f = await fetchPage("/"); say(f.line); home = f.status === 200 && f.bytes > MIN_PAGE_BYTES ? f.body : null; }
  if (wanted("c")) await itemC();
  if (wanted("e")) itemE();
  if (wanted("f")) itemF();
  if (wanted("g")) itemG();
  if (wanted("h")) itemH();
  if (wanted("i")) await itemI(home);

  const titles: Record<string, string> = {
    a: "every page type at its floor on three exemplars",
    b: "the chain green on the last deploy, and production serving it",
    c: "the two database tables present",
    d: "the sample marks on, or the private flag set",
    e: "the a11y report true",
    f: "every door landing",
    g: "every launch-blocking data requirement closed or withheld with a line",
    h: "moneyShown prints no filled or floored figure",
    i: "the home page's counts are the site's own",
  };
  const lines: string[] = [`launch checklist: marginatlas.com at website ${head}, ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC, ${mins(Date.now() - started)} (scripts/verify_launch_ready.ts, plan step 50)${only ? `; a SUBSET by --only=${[...only].join(",")}, not the checklist` : ""}`];
  let reasons = 0;
  for (const id of order) {
    if (!wanted(id)) continue;
    const it = items.find((x) => x.id === id);
    if (!it) { reasons++; lines.push(`[no] (${id}) ${titles[id]}: not measured (the script did not reach it)`); continue; }
    if (!it.ok) reasons++;
    lines.push(`[${it.ok ? "ok" : "no"}] (${id}) ${titles[id]}: ${it.text}`);
  }
  if (only) lines.push(`SUBSET ${[...only].join(",")}: ${reasons === 0 ? "no reason" : `${reasons} reason${reasons === 1 ? "" : "s"}`}; not the checklist, nothing written to ${CHECKLIST}`);
  else lines.push(reasons === 0 ? "LAUNCH READY" : `NOT READY: ${reasons} reason${reasons === 1 ? "" : "s"}`);
  const text = lines.join("\n") + "\n";
  /* The file, unless stdout already is that file (the shell's redirect), in which case the print below writes it; a subset never writes it. */
  if (!only && !fdIsFile(1, CHECKLIST)) writeFileSync(CHECKLIST, text);
  process.stdout.write(text);
  return reasons === 0 ? 0 : 1;
}

main().then((code) => process.exit(code)).catch((e) => {
  say(`${stamp()} verify_launch_ready crashed: ${e instanceof Error ? e.stack ?? e.message : String(e)}`);
  process.stdout.write(`NOT READY: the checklist crashed before the last line (${e instanceof Error ? e.message : String(e)}); see ${RUN_LOG}\n`);
  process.exit(1);
});
