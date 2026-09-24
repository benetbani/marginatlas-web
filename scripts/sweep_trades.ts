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
 *      its reds counted by width and card, and every absence line ("Not
 *      gathered yet", "Not measured yet", "Not worked out yet") counted,
 *      outside the hero and inside it apart.
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
const reds = (holes.stdout + holes.stderr).split("\n").filter((l) => /^  cell-/.test(l));
const byCard = new Map<string, number>();
for (const l of reds) {
  const m = l.match(/@(\d+) #([a-z0-9-]+)/);
  if (!m) continue;
  const key = `${m[1]} #${m[2]}`;
  byCard.set(key, (byCard.get(key) ?? 0) + 1);
}

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
  const found = [...text.matchAll(/Not (?:gathered|measured|worked out) yet[^.]*\./g)].map((m) => m[0]);
  if (found.length) pagesWithAbsence++;
  for (const s of found) absence.set(s, (absence.get(s) ?? 0) + 1);
  if (/Not (?:gathered|measured|worked out) yet/.test(hero)) heroesWithAbsence++;
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
