/**
 * sweep_trades: every live trade page of one city, rendered and read, in one
 * command (BACKLOG E7, QUEUE sys:thin-pages-sweep; the goal of 2026-09-24).
 *
 * The harness reads two trade pages (London restaurants and barbershops); the
 * other 136 live London trades are the long tail, and on 2026-09-24 three
 * probes by hand found what the harness never saw there: 44 "Not gathered yet"
 * lines on the cost to open, 121 pages with "Not measured yet" cards, 302
 * page-filter reds. This does the same three steps so every batch can say what
 * it did to the long tail:
 *
 *   1. the live taxonomy's trades (`INDUSTRIES`, never the shard ids, which
 *      hold retired trades) as a render list ROUTED BY URL SLUG
 *      (`industryToSlug`: the cost table is keyed by slug, and an id-routed
 *      render puts a keyed trade in its withheld state);
 *   2. one render process over the list (scripts/harness/render_page.tsx);
 *   3. the page filter over the renders (scripts/harness/check_page_holes.mjs),
 *      its reds counted by width and card, and every absence line counted,
 *      outside the hero and inside it apart: the old words ("Not gathered
 *      yet", "Not measured yet", "Not worked out yet") and, since his copy
 *      correction of 2026-09-24 rewrote them, the plain ones ("Not known
 *      yet", "No ... yet", "We don't know yet", "We don't have ... yet"),
 *      which the old pattern could not see: a sweep run on the new copy
 *      would have read every hero clean (ABSENCE below).
 *
 * NOT A GATE: 138 pages take about ten minutes and the chain must stay fast;
 * it writes its summary to scratchpad/harness/sweep/<iso>-<city>.json so two
 * runs can be compared.
 *
 * usage: npx tsx scripts/sweep_trades.ts [--iso=gb] [--city=london] [--no-render]
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { INDUSTRIES, industryToSlug } from "../src/lib/taxonomy";

const arg = (name: string, dflt: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3) ?? dflt;
const iso = arg("iso", "gb").toLowerCase();
const city = arg("city", "london").toLowerCase();
const render = !process.argv.includes("--no-render");
const OUT = "scratchpad/harness/sweep";
mkdirSync(OUT, { recursive: true });

const pages = INDUSTRIES.map((i) => industryToSlug(i.id)).filter((s): s is string => !!s).map((slug) => ({ surface: "cell", slugs: [iso, city, slug], since: "sweep" }));
const listPath = `${OUT}/${iso}-${city}-list.json`;
writeFileSync(listPath, JSON.stringify({ why: "sweep_trades.ts: every live trade of one city, by URL slug", pages }, null, 2));
const files = pages.map((p) => `scratchpad/harness/pages/cell-${p.slugs.join("-")}.html`);

if (render) {
  const r = spawnSync(process.execPath, ["node_modules/tsx/dist/cli.mjs", "--tsconfig", "scripts/tsconfig.harness.json", "--require", "./scripts/harness/env.cjs", "--require", "./scripts/spikes/stub_next_font.cjs", "scripts/harness/render_page.tsx", "--list", listPath], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const line = (r.stdout + r.stderr).split("\n").find((l) => l.includes("rendered from")) ?? "no render line";
  console.log(`sweep: ${line.trim()}`);
}
const missing = files.filter((f) => !existsSync(f));
if (missing.length) console.log(`sweep: ${missing.length} page(s) have no render: ${missing.slice(0, 5).join(", ")}`);

const holes = spawnSync(process.execPath, ["scripts/harness/check_page_holes.mjs", ...files.filter((f) => existsSync(f))], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
/* THE FILTER MUST HAVE RUN (2026-09-24): a page filter that crashed or refused its preflight printed no reds, and this line read
   that as "0 page-filter reds" on the same 138 renders that held 3 an hour before. No summary line naming every file, no sweep. */
const holesOut = holes.stdout + holes.stderr;
const ran = holesOut.split("\n").find((l) => /^page holes: \d+ page\(s\)/.test(l));
const readFiles = files.filter((f) => existsSync(f)).length;
if (!ran || Number(ran.match(/^page holes: (\d+)/)![1]) !== readFiles) {
  console.error(`sweep: the page filter did not read the ${readFiles} render(s) to its summary (exit ${holes.status}${holes.error ? `, ${holes.error.message}` : ""}); nothing is counted. Its last lines:\n${holesOut.split("\n").slice(-8).join("\n")}`);
  process.exit(2);
}
const reds = holesOut.split("\n").filter((l) => /^  cell-/.test(l));
const byCard = new Map<string, number>();
for (const l of reds) {
  const m = l.match(/@(\d+) #([a-z0-9-]+)/);
  if (!m) continue;
  const key = `${m[1]} #${m[2]}`;
  byCard.set(key, (byCard.get(key) ?? 0) + 1);
}

/* ABSENCE: every way a card says a figure is missing, old and plain (COPY-STYLE.md's absence lines). */
const ABSENCE = /(?:Not (?:gathered|measured|worked out|known) yet|\bNo [^.<]{0,80}?\byet\b|We don't (?:know|have) [^.<]{0,80}?\byet\b)[^.]*\./g;
const ABSENCE_ANY = /Not (?:gathered|measured|worked out|known) yet|\bNo [^.<]{0,80}?\byet\b|We don't (?:know|have) [^.<]{0,80}?\byet\b/;
const absence = new Map<string, number>();
let pagesWithAbsence = 0, heroesWithAbsence = 0;
for (const f of files) {
  if (!existsSync(f)) continue;
  const h = readFileSync(f, "utf8").replace(/<style[\s\S]*?<\/style>/g, "").replace(/<script[\s\S]*?<\/script>/g, "");
  const take = h.indexOf('id="take"');
  const takeEnd = take >= 0 ? h.indexOf(" data-block=", h.indexOf(">", take)) : -1;
  const hero = take >= 0 && takeEnd > take ? h.slice(take, takeEnd) : "";
  const rest = take >= 0 && takeEnd > take ? h.slice(0, take) + h.slice(takeEnd) : h;
  const text = rest.replace(/<[^>]+>/g, " ").replace(/&#x27;/g, "'").replace(/\s+/g, " ");
  const found = [...text.matchAll(ABSENCE)].map((m) => m[0]);
  if (found.length) pagesWithAbsence++;
  for (const s of found) absence.set(s, (absence.get(s) ?? 0) + 1);
  if (ABSENCE_ANY.test(hero.replace(/<[^>]+>/g, " ").replace(/&#x27;/g, "'").replace(/\s+/g, " "))) heroesWithAbsence++;
}

const summary = {
  when: new Date().toISOString(),
  iso, city, pages: pages.length, rendered: files.length - missing.length,
  reds: reds.length,
  redsByCard: Object.fromEntries([...byCard.entries()].sort((a, b) => b[1] - a[1])),
  pagesWithAbsenceOutsideHero: pagesWithAbsence,
  heroesWithAbsence,
  absenceLines: Object.fromEntries([...absence.entries()].sort((a, b) => b[1] - a[1])),
};
const summaryPath = `${OUT}/${iso}-${city}.json`;
writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
console.log(`sweep ${iso}/${city}: ${summary.rendered} of ${summary.pages} live trade pages; ${summary.reds} page-filter reds; absence lines outside the hero on ${pagesWithAbsence} page(s), the hero's state word on ${heroesWithAbsence}`);
for (const [k, v] of [...byCard.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12)) console.log(`  ${String(v).padStart(4)}  ${k}`);
for (const [k, v] of [...absence.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)) console.log(`  ${String(v).padStart(4)}  ${k}`);
console.log(`sweep: summary written to ${summaryPath}`);
