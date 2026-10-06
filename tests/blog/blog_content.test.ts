/**
 * THE BLOG'S FIGURES (P36.1, the rewrites of 2026-10-06; docs/superpowers/plans/2026-10-06-blog-rewrites/PLAN.md, D3 and D4).
 * The seventy posts of April and May printed figures with no source, and ten contradicted the site's own registers; a post now
 * prints a figure only when the free data pack (public/data/uk/<version>/, the tables /data publishes) gives it, and this gate
 * recomputes each one on every build.
 *
 * Holds, for every post in content/blog:
 *   1. a title, a date, a line under the title, a byline and one of the categories (src/lib/blog.ts);
 *   2. every figure the frontmatter lists, recomputed: a pack table's cell (one row by `where`, its `column`, printed `as` the
 *      pages print it, money in dollars at the pinned pound rate), a count of the pack's code map, or a ledger note found word for
 *      word in the named row's leaves_out; an invented illustration is declared `kind: example`, and its post says "imaginary";
 *   3. no digit in the title, the line under it or the body that no listed figure covers (years, dates and the base of a rate,
 *      "of 100", excepted);
 *   4. every listed figure printed in the post;
 *   5. no source-agency name (scripts/lib/agency_tokens.ts) and no em dash in the title, the line under it or the body;
 *   6. every link resolves: a published pack file, a section of About the figures that exists, a published post, a live London
 *      trade page, a page that exists; no link off the site (the sources are named on one page, his R-002 ruling);
 *   7. the foot's data files are exactly the files its figures read.
 * `--plant` feeds deliberately broken posts and fails unless each rule reds.
 *
 * Run: npx tsx tests/blog/blog_content.test.ts [--plant]
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { isBlogCategory } from "../../src/lib/blog";
import { PACK_FILES, PACK_VERSION } from "../../src/lib/data_pack";
import { convertToUsd } from "../../src/lib/finance/fx";
import { usd } from "../../src/lib/spine/money";
import { liveTradeSlug } from "../../src/lib/home/destination";
import { TOP_LEVEL_SEGMENTS } from "../../src/lib/routing/top_level_segments";
import { AGENCY_TOKENS } from "../../scripts/lib/agency_tokens";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "blog-content";
const REMEDY = "print a figure only from the data pack, listed in the post's figures with its file, row, column and form";
const DIR = "content/blog";
const PACK = `public/data/uk/${PACK_VERSION}`;
const PLANT = process.argv.includes("--plant");

/* ---------- the pack, read once ---------- */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((x) => x !== "")) rows.push(row);
      row = [];
    } else cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}
const tables = new Map<string, Record<string, string>[]>();
const table = (file: string) => {
  if (!tables.has(file)) tables.set(file, existsSync(join(PACK, file)) ? parseCsv(readFileSync(join(PACK, file), "utf8")) : []);
  return tables.get(file)!;
};
type CodeMap = { trades: Array<{ slug: string; sic: string[]; match: string }> };
const codeMap = (): CodeMap => JSON.parse(readFileSync(join(PACK, "trades_sic.json"), "utf8")) as CodeMap;
type Ledger = { rows: Array<{ key: string; leaves_out?: string[] }> };
const ledger = (): Ledger => JSON.parse(readFileSync(join(PACK, "ledger.json"), "utf8")) as Ledger;

/* ---------- the forms a figure is printed in, each the pages' own ---------- */
const FORMS: Record<string, (v: number) => string> = {
  /** A share as a whole number of 100: 0.94 reads 94. */
  per100: (v) => String(Math.round(v * 100)),
  /** A share as a percentage: 0.32 reads 32%. */
  pct: (v) => `${Math.round(v * 100)}%`,
  /** A share as a percentage to one decimal: 0.081 reads 8.1%. */
  pct1: (v) => `${(v * 100).toFixed(1)}%`,
  /** A share as a number of 100 to one decimal: 0.293 reads 29.3. */
  per100_1: (v) => (v * 100).toFixed(1),
  /** A number to one decimal as it stands: 28.94 reads 28.9. */
  n1: (v) => v.toFixed(1),
  /** A rate per 1,000 as a rate of 100, one decimal, as the trade pages print it: 28.9 reads 2.9. */
  rate100: (v) => (Math.round(v) / 10).toFixed(1),
  /** A count with its thousands separator: 7865 reads 7,865. */
  int: (v) => Math.round(v).toLocaleString("en-US"),
  /** Thousands of pounds as the pages print money: 556.3 reads $738K. */
  usd_k: (v) => usd(convertToUsd("GBP", v * 1000) ?? Number.NaN),
  /** Pounds as the pages print money: 567 reads $752. */
  usd: (v) => usd(convertToUsd("GBP", v) ?? Number.NaN),
  /** A ratio to two decimals, read as times: 1.17 reads 1.17. */
  x2: (v) => v.toFixed(2),
};

type Figure = {
  text?: string;
  kind?: "example" | "note";
  file?: string;
  where?: Record<string, string>;
  column?: string;
  as?: string;
  count?: Record<string, string>;
  key?: string;
};

/** What a figure entry computes to, or the reason it cannot. */
function recompute(f: Figure): { value?: string; file?: string; fault?: string } {
  if (f.kind === "example") return {};
  if (f.kind === "note") {
    const row = ledger().rows.find((r) => r.key === f.key);
    if (!row) return { fault: `no ledger row "${f.key}"` };
    return (row.leaves_out ?? []).some((l) => l.includes(String(f.text))) ? { value: f.text, file: "ledger.json" } : { fault: `"${f.text}" is not in ledger row "${f.key}"` };
  }
  if (f.file === "trades_sic.json" && f.count) {
    const want = f.count;
    const n = codeMap().trades.filter((t) => Object.entries(want).every(([k, v]) => (k === "sic" ? t.sic.includes(v) : String((t as Record<string, unknown>)[k]) === v))).length;
    return { value: String(n), file: f.file };
  }
  if (!f.file || !f.where || !f.column || !f.as) return { fault: "a figure needs file, where, column and as (or kind)" };
  if (!PACK_FILES.some((p) => p.file === f.file)) return { fault: `${f.file} is not a published pack file` };
  const rows = table(f.file).filter((r) => Object.entries(f.where!).every(([k, v]) => r[k] === String(v)));
  if (rows.length !== 1) return { fault: `${f.file} has ${rows.length} rows where ${JSON.stringify(f.where)}` };
  const raw = rows[0][f.column];
  if (raw === undefined) return { fault: `${f.file} has no column ${f.column}` };
  const form = FORMS[f.as];
  if (!form) return { fault: `no form "${f.as}"` };
  const v = Number(raw);
  if (!Number.isFinite(v) || raw === "") return { fault: `${f.file} ${f.column} is "${raw}" where ${JSON.stringify(f.where)}` };
  return { value: form(v), file: f.file };
}

/* ---------- the prose ---------- */
const MONTH = "(?:January|February|March|April|May|June|July|August|September|October|November|December)";
/* A thousands comma is a comma followed by three digits, so "94, 70" reads as two numbers, never "94," (found 2026-10-06 by the
   first rewrite: a list of figures failed as loose digits). */
const TOKEN = /(?:\$|£)?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?(?:K|M|B|%)?/g;
/** The words a reader reads: the title, the line under it and the body, links' targets and code taken out. */
function proseOf(title: string, excerpt: string, body: string): string {
  return [title, excerpt, body]
    .join("\n")
    .replace(/`[^`]*`/g, " ")
    .replace(/\]\([^)]*\)/g, "]")
    .replace(/<[^>]+>/g, " ");
}
/** The digits allowed without a figure: years, dates and the base of a rate. */
function withoutAllowed(text: string): string {
  return text
    .replace(new RegExp(`\\b\\d{1,2} ${MONTH} (?:19|20)\\d{2}\\b`, "g"), " ")
    .replace(new RegExp(`\\b${MONTH} (?:19|20)\\d{2}\\b`, "g"), " ")
    .replace(/\b(?:of|in|per) 100\b/gi, " ")
    .replace(/\b20[0-3]\d\b/g, " ");
}

/* ---------- the links ---------- */
const aboutData = readFileSync("src/app/(site)/about-data/page.tsx", "utf8");
const pageExists = (seg: string) => ["src/app", "src/app/(site)"].some((d) => existsSync(join(d, seg, "page.tsx")));
function linkFault(href: string, posts: Set<string>): string | null {
  if (/^https?:/.test(href)) return `${href} leaves the site (sources are named on About the figures)`;
  const [path, hash] = href.split("#");
  const parts = path.split("/").filter(Boolean);
  if (parts[0] === "data" && parts.length === 4 && parts[1] === "uk") return parts[2] === PACK_VERSION && PACK_FILES.some((f) => f.file === parts[3]) ? null : `${href} is no published pack file`;
  if (parts[0] === "about-data" && parts.length === 1) return !hash || aboutData.includes(`id="${hash}"`) ? null : `${href}: About the figures has no section #${hash}`;
  if (parts[0] === "blog" && parts.length === 2) return posts.has(parts[1]) ? null : `${href} is no published post`;
  if (parts[0] === "gb" && parts.length === 1) return null;
  if (parts[0] === "gb" && parts[1] === "london" && parts.length === 2) return null;
  if (parts[0] === "gb" && parts[1] === "london" && parts.length === 3) return liveTradeSlug(parts[2]) === parts[2] ? null : `${href}: ${parts[2]} is no live trade`;
  if (parts[0] === "industries" && parts.length === 2) return liveTradeSlug(parts[1]) === parts[1] ? null : `${href}: ${parts[1]} is no live trade`;
  if (parts.length === 1 && TOP_LEVEL_SEGMENTS.has(parts[0]) && pageExists(parts[0])) return null;
  return `${href} is no page this gate knows`;
}

/* ---------- one post ---------- */
type Post = { slug: string; data: Record<string, unknown>; body: string };
function faultsOf(post: Post, posts: Set<string>): string[] {
  const out: string[] = [];
  const d = post.data;
  const title = typeof d.title === "string" ? d.title : "";
  const excerpt = typeof d.excerpt === "string" ? d.excerpt : "";
  if (!title) out.push("no title");
  if (!excerpt) out.push("no line under the title (excerpt)");
  if (typeof d.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(d.date)) out.push("no date as YYYY-MM-DD");
  if (typeof d.author !== "string" || !d.author.trim()) out.push("no byline (author)");
  if (!isBlogCategory(d.category)) out.push(`no category of the list (${String(d.category)})`);

  const figures = (Array.isArray(d.figures) ? d.figures : []) as Figure[];
  const prose = proseOf(title, excerpt, post.body);
  const tokens = new Set(withoutAllowed(prose).match(TOKEN) ?? []);
  const texts = new Set<string>();
  const filesRead = new Set<string>();
  for (const f of figures) {
    const text = String(f.text ?? "");
    if (!text || (text.match(TOKEN) ?? [])[0] !== text) { out.push(`figure "${text}" is not one printed number`); continue; }
    texts.add(text);
    const r = recompute(f);
    if (r.fault) out.push(`figure "${text}": ${r.fault}`);
    else if (r.value !== undefined && r.value !== text) out.push(`figure "${text}" recomputes to "${r.value}" (${f.file} ${f.column ?? ""} ${JSON.stringify(f.where ?? f.count ?? f.key)})`);
    if (r.file) filesRead.add(r.file);
    if (!prose.match(TOKEN)?.includes(text)) out.push(`figure "${text}" is listed and never printed`);
  }
  if (figures.some((f) => f.kind === "example") && !/\bimaginary\b/i.test(post.body)) out.push("an invented illustration (kind: example) in a post that never says imaginary");
  const loose = [...tokens].filter((t) => !texts.has(t));
  if (loose.length) out.push(`digits no listed figure covers: ${loose.join(", ")}`);

  const said = `${title}\n${excerpt}\n${post.body}`;
  const named = AGENCY_TOKENS.filter((a) => said.includes(a));
  if (named.length) out.push(`names a source agency: ${named.join(", ")}`);
  if (said.includes(String.fromCharCode(0x2014))) out.push("an em dash");

  const hrefs = [
    ...[...post.body.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]),
    ...((Array.isArray(d.behind) ? d.behind : []) as Array<{ href?: string }>).map((l) => String(l.href ?? "")),
    ...(d.method && typeof d.method === "object" ? [String((d.method as { href?: string }).href ?? "")] : []),
    ...((Array.isArray(d.data) ? d.data : []) as string[]).map((f) => `/data/uk/${PACK_VERSION}/${f}`),
  ];
  for (const h of hrefs) { const f = linkFault(h, posts); if (f) out.push(`link ${f}`); }

  const listed = new Set((Array.isArray(d.data) ? d.data : []) as string[]);
  const unread = [...listed].filter((f) => !filesRead.has(f));
  const unlisted = [...filesRead].filter((f) => !listed.has(f));
  if (unread.length) out.push(`the foot lists data no figure reads: ${unread.join(", ")}`);
  if (unlisted.length) out.push(`figures read data the foot does not list: ${unlisted.join(", ")}`);
  return out;
}

/* ---------- run ---------- */
let failed = 0;
const fault = (file: string, detail: string) => { failed++; red({ rule: RULE, file, detail, remedy: REMEDY }); };
const files = existsSync(DIR) ? readdirSync(DIR).filter((f) => f.endsWith(".md")) : [];
const posts: Post[] = files.map((f) => { const { data, content } = matter(readFileSync(join(DIR, f), "utf8")); return { slug: f.slice(0, -3), data, body: content }; });
const slugs = new Set(posts.map((p) => p.slug));

if (PLANT) {
  /* Each plant is a sound post broken one way; the gate passes only if every plant reds. */
  const sound: Post = {
    slug: "plant",
    data: { title: "How long restaurants last", excerpt: "Of 100 new restaurants, 94 still trade after a year.", date: "2026-10-06", author: "Margin Atlas", category: "survival and failure", ai: true,
      figures: [{ text: "94", file: "survival_by_trade_group.csv", where: { sic_group: "561" }, column: "survival_1y", as: "per100" }],
      data: ["survival_by_trade_group.csv"], behind: [{ label: "Restaurants in London", href: "/gb/london/restaurants" }] },
    body: "Of 100 new restaurants, 94 still trade after a year.",
  };
  /* [what is broken, the post, the words its own fault must carry] */
  const quiet = { ...sound.data, excerpt: "Most restaurants still trade after a year." };
  const plants: Array<[string, Post, string]> = [
    ["a wrong figure", { ...sound, data: { ...quiet, figures: [{ ...(sound.data.figures as Figure[])[0], text: "95" }] }, body: "Of 100 new restaurants, 95 still trade after a year." }, "recomputes to"],
    ["a digit with no figure", { ...sound, body: sound.body + " About 40 close in year two." }, "digits no listed figure covers: 40"],
    ["a figure never printed", { ...sound, data: quiet, body: "Most restaurants still trade after a year." }, "never printed"],
    ["no category", { ...sound, data: { ...sound.data, category: "news" } }, "no category"],
    ["an agency named", { ...sound, body: sound.body + " The Office for National Statistics counts them." }, "names a source agency"],
    ["a link off the site", { ...sound, body: sound.body + " [More](https://example.com)." }, "leaves the site"],
    ["a dead trade link", { ...sound, body: sound.body + " [See](/gb/london/no-such-trade)." }, "no live trade"],
    ["a missing section", { ...sound, body: sound.body + " [Method](/about-data#no-such-section)." }, "has no section"],
    ["data the foot leaves out", { ...sound, data: { ...sound.data, data: [] } }, "the foot does not list"],
    ["an example never called imaginary", { ...sound, data: { ...sound.data, figures: [...(sound.data.figures as Figure[]), { text: "$5M", kind: "example" }] }, body: sound.body + " One makes $5M." }, "never says imaginary"],
  ];
  const soundFaults = faultsOf(sound, slugs);
  if (soundFaults.length) fault("tests/blog/blog_content.test.ts", `the sound plant reds: ${soundFaults.join("; ")}`);
  for (const [label, p, expected] of plants) {
    const got = faultsOf(p, slugs);
    const hit = got.find((g) => g.includes(expected));
    if (!hit) fault("tests/blog/blog_content.test.ts", `the plant "${label}" did not red on "${expected}" (got: ${got.join("; ") || "nothing"})`);
    else console.log(`PLANT ${label}: red as it should (${hit})`);
  }
} else {
  for (const p of posts) {
    const got = faultsOf(p, slugs);
    for (const g of got) fault(`${DIR}/${p.slug}.md`, g);
    if (got.length === 0) console.log(`PASS  ${p.slug} (${(Array.isArray(p.data.figures) ? p.data.figures.length : 0)} figures)`);
  }
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, PLANT ? "plants failed" : "posts failed"); process.exit(1); }
console.log(PLANT ? "blog/blog_content --plant: every plant red" : `blog/blog_content: all ${posts.length} posts pass`);
