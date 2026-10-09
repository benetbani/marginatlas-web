/**
 * THE HOME PAGE'S PRO SAID ONCE, ITS NOTEBOOK, AND THE LAUNCH CHECK'S COUNTS (milestone 3, masterplan steps 35 and 36; his ruling 23
 * of 2026-09-26: "a quiet band after the search and the UK answers: what Pro opens, the price, one button"). The Pro band draws
 * only while the paywall's switch is on, its prices through the plan and the year first (his decision of 2026-10-09), one button
 * to /pricing; the notebook is the newest post of each category; and the launch check's item (i) reads the live home's band and
 * passes the rebuilt home, which prints no counts since his instruction of 2026-10-07 ("reform home drastically";
 * tests/trust/home_shape.test.ts holds that).
 *
 * Run: npx tsx tests/home/home_bands.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { ProBand } from "../../src/components/spine/home/ProBand";
import { priceLine, yearlyByMonthLine } from "../../src/lib/monetization/plan";
import { buildNotebook, NOTEBOOK_SIZE } from "../../src/lib/home/notebook";
import { BLOG_CATEGORIES, getAllPosts } from "../../src/lib/blog";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-bands";
const FILE = "src/components/spine/home/home-view.tsx";
const REMEDY = "draw Pro only with the paywall's switch on, its prices through the plan; keep the launch check reading the live home's band and passing the rebuilt home that prints no counts";
let failed = 0;
/* A check may be a value or a function: a function that throws (a name the plan does not export yet) is a failed check. */
const check = (label: string, ok: boolean | (() => boolean)) => {
  let pass = false;
  try { pass = typeof ok === "function" ? ok() : ok; } catch { pass = false; }
  if (pass) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

const set = (on: boolean) => { process.env.NEXT_PUBLIC_AUTH_ENABLED = on ? "1" : ""; process.env.NEXT_PUBLIC_PAYWALL = on ? "1" : ""; };
set(false);
const off = renderToStaticMarkup(React.createElement(ProBand));
set(true);
const on = renderToStaticMarkup(React.createElement(ProBand));
set(false);
check("nothing about Pro prints while the switch is off", off === "");
/* His decision of 2026-10-09: the year leads. The focal figure is the year by the month, then the year's total billed yearly, then
   the month to month price, every figure through the plan, and one button to /pricing. */
check("with the switch on: the year leads (the year by the month at the focal rung, then the year billed yearly, then month to month), all through the plan, one button to /pricing", () => {
  const focal = /data-focal="1"[^>]*>([^<]*)</.exec(on)?.[1];
  const atYear = on.indexOf(priceLine("year"));
  return focal === yearlyByMonthLine() && atYear > -1 && on.indexOf(priceLine("month")) > atYear
    && /Billed yearly/.test(on) && /Month to month/.test(on)
    && (on.match(/href="\/pricing"/g) ?? []).length === 1 && (on.match(/<a /g) ?? []).length === 1;
});

/* The notebook (masterplan step 36; since the checkup of 2026-10-06 the newest post of each category, four at most, text first). */
const notebook = buildNotebook();
const posts = getAllPosts();
const want = BLOG_CATEGORIES.map((c) => posts.find((p) => p.category === c)).filter((p): p is NonNullable<typeof p> => !!p).slice(0, NOTEBOOK_SIZE);
check(`the notebook shows the newest post of each category, four at most (${notebook.map((c) => c.slug).join(", ")})`, JSON.stringify(notebook.map((c) => c.slug)) === JSON.stringify(want.map((p) => p.slug)) && notebook.length === Math.min(NOTEBOOK_SIZE, want.length));
check("each card a different category, each a published post", new Set(notebook.map((c) => c.category)).size === notebook.length && notebook.every((c) => posts.some((p) => p.slug === c.slug)));

const launch = readFileSync("scripts/verify_launch_ready.ts", "utf8");
check("the launch check's item (i) reads the live home's band and passes the rebuilt home only while it prints no stamped count", /What the atlas holds/.test(launch) && /data-composition="zones"/.test(launch) && /atlas_ledger\\\.ts:/.test(launch));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("home/home_bands: all pass");
