/**
 * The UK's sources on one page, linked from every UK page's foot (plan 06, task B4; his ruling of 2026-10-04 on R-002: "One
 * sources page"). The list is held to the repository's records: every section file's publisher has an entry, every register slice
 * a page reads has one, and no attribution line is anything but the two the ledger states (a licence the records do not name is
 * never printed). The foot draws on a UK page and nowhere else; About the figures carries the section it links to; and the
 * source-agencies gate allows the one module and watches the UK publishers' names everywhere else.
 *
 * Run: npx tsx tests/spine/uk_sources.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { UK_SOURCES, UK_REGISTER_SOURCE, UK_SOURCES_FOOT, OGL_LINE, ONS_LINE, WORLD_SOURCES } from "../../src/lib/spine/uk_sources";
import { SourcesFoot } from "../../src/components/spine/SourcesFoot";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "uk-sources";
const FILE = "src/lib/spine/uk_sources.ts";
const REMEDY = "name every UK source the records hold in uk_sources.ts, with its attribution line only where the records name its licence, and keep the foot on every UK page";
let failed = 0;
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

/* EVERY PUBLISHER THE SECTION FILES NAME */
const publishers: string[] = [];
const walk = (o: unknown): void => {
  if (Array.isArray(o)) { o.forEach(walk); return; }
  if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) { if (k === "publisher" && typeof v === "string") publishers.push(v); else walk(v); }
};
for (const f of readdirSync("data/sections").filter((n) => n.endsWith(".json"))) walk(JSON.parse(readFileSync(join("data/sections", f), "utf8")));
const unnamed = publishers.filter((p) => !UK_SOURCES.some((s) => s.names.some((n) => p.startsWith(n))));
check(`every publisher the section files name has an entry (${publishers.length} read)${unnamed.length ? `: missing ${unnamed.join(" | ")}` : ""}`, publishers.length > 0 && unnamed.length === 0);

/* EVERY REGISTER SLICE A PAGE READS */
const manifest = JSON.parse(readFileSync("data/uk/registers/manifest.json", "utf8")) as { files: Record<string, unknown> };
const srcFiles: string[] = [];
const collect = (dir: string) => { for (const n of readdirSync(dir, { withFileTypes: true })) { const p = join(dir, n.name); if (n.isDirectory()) collect(p); else if (/\.(ts|tsx)$/.test(n.name)) srcFiles.push(p); } };
collect("src");
const read = Object.keys(manifest.files).filter((f) => srcFiles.some((p) => readFileSync(p, "utf8").includes(`registers/${f}`)));
const keys = new Set(UK_SOURCES.map((s) => s.key));
const orphan = read.filter((f) => !keys.has(UK_REGISTER_SOURCE[f] ?? ""));
check(`every register slice a page reads has its publisher's entry (${read.join(", ")})${orphan.length ? `: missing ${orphan.join(", ")}` : ""}`, read.length >= 3 && orphan.length === 0);

/* NO LICENCE THE RECORDS DO NOT NAME */
const lines = new Set([OGL_LINE, ONS_LINE]);
check("every attribution line is the ledger's own (the statistics office's or the licence's), or none", UK_SOURCES.every((s) => s.attribution === null || lines.has(s.attribution)));
check("every entry says what the pages print from it", UK_SOURCES.every((s) => s.items.length > 0 && s.items.every((i) => i.prints.trim() && i.title.trim())));
check("every link is a secure address or none", UK_SOURCES.every((s) => s.items.every((i) => i.url === null || /^https:\/\//.test(i.url))));
check("one entry a publisher", new Set(UK_SOURCES.map((s) => s.publisher)).size === UK_SOURCES.length);

/* THE HOME'S SOURCES OUTSIDE THE UK (plan 2026-10-08, home sections 2 and 3): each says what the home prints from it, links
   securely or not at all, prints no attribution its record does not name, and no key is two entries across the two lists. */
check(`the world list names the home's two sources (${WORLD_SOURCES.map((s) => s.key).join(", ")})`, WORLD_SOURCES.length === 2 && WORLD_SOURCES.every((s) => s.items.length > 0 && s.items.every((i) => i.prints.trim() && i.title.trim() && (i.url === null || /^https:\/\//.test(i.url)))));
check("no world source prints an attribution line its record does not name", WORLD_SOURCES.every((s) => s.attribution === null));
check("one key an entry across both lists", new Set([...UK_SOURCES, ...WORLD_SOURCES].map((s) => s.key)).size === UK_SOURCES.length + WORLD_SOURCES.length);
check("the statistics office's entry says the home prints its cities' survival, and the notices' entry the notices read", UK_SOURCES.some((s) => s.key === "ons" && s.items.some((i) => /by city/.test(i.prints))) && UK_SOURCES.some((s) => s.key === "gazette" && s.items.some((i) => /notices/.test(i.prints))));

/* THE NEW COMPANIES' FLOOR, IN WORDS (the review of the new companies' slice): the list leaves out countries with a labour force
   under the slice's floor (data/home/new_companies.json, floor.at_least), and a reader must be able to find that here, so the
   entry says it in words and the words are held to the slice's own figure. */
const floor = (JSON.parse(readFileSync("data/home/new_companies.json", "utf8")) as { floor: { at_least: number } }).floor.at_least;
const newCompanies = WORLD_SOURCES.flatMap((s) => s.items).find((i) => i.title.includes("IC.BUS.NDNS.ZS"));
check(`the new companies' entry says the slice's floor in words (${floor})`, floor === 1000000 && newCompanies !== undefined && newCompanies.prints.includes("under one million"));

/* THE FOOT */
const gb = renderToStaticMarkup(React.createElement(SourcesFoot, { iso2: "GB" }));
check("the foot draws on a UK page with the licence's sentence", gb.includes(OGL_LINE.replace(/'/g, "&#x27;")) && gb.includes("data-sources-foot"));
check("the foot links to the one sources section", gb.includes(`href="${UK_SOURCES_FOOT.href}"`) && UK_SOURCES_FOOT.href === "/about-data#sources");
check("the foot names no source", UK_SOURCES.every((s) => !gb.includes(s.publisher)));
check("the foot draws nothing off the UK (Germany)", renderToStaticMarkup(React.createElement(SourcesFoot, { iso2: "DE" })) === "");
const views = ["src/components/spine/country/country-view.tsx", "src/components/spine/city/city-view.tsx", "src/components/spine/cell/cell-view.tsx", "src/components/spine/country/how-to-view.tsx", "src/components/spine/hood/hood-view.tsx"];
const footless = views.filter((v) => !/<SourcesFoot iso2=\{/.test(readFileSync(v, "utf8")));
check(`every UK spine view draws the foot under its bands${footless.length ? `: missing in ${footless.join(", ")}` : ""}`, footless.length === 0);

async function thePage() {
  /* THE PAGE IT LINKS TO. The route is written for Next's automatic JSX runtime and names no React; this runner compiles JSX to
     React.createElement, so the page reads the one React this file lends it, loaded after the loan. */
  (globalThis as unknown as { React: typeof React }).React = React;
  const { default: AboutDataPage } = await import("../../src/app/(site)/about-data/page");
  const about = renderToStaticMarkup(React.createElement(AboutDataPage));
  check("About the figures carries the section the foot links to", /id="sources"/.test(about));
  const absent = UK_SOURCES.filter((s) => !about.includes(s.publisher.replace(/'/g, "&#x27;")));
  check(`the section names every source${absent.length ? `: missing ${absent.map((s) => s.publisher).join(", ")}` : ""}`, absent.length === 0);
  check("the section prints the statistics office's own attribution line", about.includes(ONS_LINE));
  const absentWorld = WORLD_SOURCES.filter((s) => !about.includes(s.publisher.replace(/'/g, "&#x27;")));
  check(`the section names the home's sources outside the UK${absentWorld.length ? `: missing ${absentWorld.map((s) => s.publisher).join(", ")}` : ""}`, absentWorld.length === 0);

  /* THE GATE THAT KEEPS THE NAMES HERE */
  const gate = readFileSync("scripts/verify_no_source_agencies.ts", "utf8");
  /* The names live in scripts/lib/agency_tokens.ts since 2026-10-06, shared with the blog's gate; the allowlist stays in the gate. */
  const names = readFileSync("scripts/lib/agency_tokens.ts", "utf8");
  check("the source-agencies gate allows the one module", gate.includes(`"${FILE}"`));
  check("the source-agencies gate watches the UK publishers' names", ["Office for National Statistics", "Valuation Office", "VisitBritain"].every((t) => names.includes(`"${t}"`)));

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("spine/uk_sources: all pass");
}

thePage().catch((e) => { console.error(e); process.exit(1); });
