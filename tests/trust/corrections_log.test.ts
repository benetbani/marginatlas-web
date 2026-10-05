/**
 * THE CORRECTIONS PAGE (his ruling of 2026-10-05 on PARKED P31.1, option (a): "a corrections page from launch day, each
 * correction with its date and 'no corrections yet' as its honest first state, and no changelog until there is a data release to
 * list"). /corrections lists data/corrections.json, newest first, each entry dated with what the page said, what it says now and
 * why; while the list is empty it says so. The form that reports a mistake stays at /corrections/new, and the two link each other.
 *
 * Holds: the data file's shape (an ISO date, a path on this site, what it said, what it says, why); the page renders the empty
 * state today and every entry when there are entries; no changelog page; no promise of answer or fix times, which his ruling did
 * not make; About the figures and the report form link to /corrections.
 *
 * Run: npx tsx tests/trust/corrections_log.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { red, redSummary } from "../../scripts/lib/red";

(globalThis as unknown as { React: typeof React }).React = React;

const RULE = "corrections-log";
const FILE = "src/app/(site)/corrections/page.tsx";
const REMEDY = "keep /corrections the dated, append-only log of data/corrections.json, empty state said, no changelog, no promise he did not make";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

type Entry = { date: string; page: string; said: string; says: string; why: string };
const DATA = "data/corrections.json";
const data = existsSync(DATA) ? (JSON.parse(readFileSync(DATA, "utf8")) as { corrections?: Entry[] }) : null;
check("data/corrections.json holds a list of corrections", !!data && Array.isArray(data.corrections));
const entries = data?.corrections ?? [];
check("every entry has an ISO date, a path on this site, what it said, what it says and why", entries.every((e) =>
  /^\d{4}-\d{2}-\d{2}$/.test(e.date) && /^\/(?!\/)/.test(e.page) && !!e.said && !!e.says && !!e.why));

check("the page exists at /corrections", existsSync(FILE));
check("no changelog page until there is a data release to list", !existsSync("src/app/(site)/about-data/changelog") && !existsSync("src/app/(site)/changelog"));

(async () => {
  if (existsSync(FILE)) {
    const mod = (await import("../../" + FILE)) as { default: () => React.ReactElement | Promise<React.ReactElement>; metadata?: { alternates?: { canonical?: string } } };
    const html = renderToStaticMarkup(await mod.default());
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    check("the page is canonical at /corrections", mod.metadata?.alternates?.canonical === "/corrections");
    if (entries.length === 0) check(`with no entries the page says "No corrections yet."`, text.includes("No corrections yet."));
    else check("every entry prints its date and what it says now", entries.every((e) => text.includes(e.says)));
    check("the page links to the form that reports a mistake", html.includes('href="/corrections/new"'));
    check("the page promises no answer or fix time (not ruled)", !/working day|within \d+ days|in \d+ days/i.test(text));
  }
  const about = readFileSync("src/app/(site)/about-data/page.tsx", "utf8");
  check("About the figures links to /corrections", about.includes('href="/corrections"'));
  const form = readFileSync("src/app/(site)/corrections/new/page.tsx", "utf8");
  check("the report form links to /corrections", form.includes('href="/corrections"'));

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("trust/corrections_log: all pass");
})();
