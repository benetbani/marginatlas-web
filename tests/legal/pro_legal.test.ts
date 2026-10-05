/**
 * THE TERMS OF PRO, DRAFTED FOR HIS APPROVAL (milestone 2, masterplan step 30; his interview of 2026-09-26, ruling 34): the drafts
 * in src/lib/legal/pro_legal.ts are one source for the three legal pages from launch day and for the file he approves. Held here:
 * the terms carry the cancelling and refunds section at #refunds; the 14-day right says the checkout's consent line word for word;
 * the prices print through the plan; no em dash and no semicolon a reader sees; every fact about him is a marked gap, never a
 * value; and the pages draw the drafts only when the paywall's switch is on, their current text until then.
 *
 * Run: npx tsx tests/legal/pro_legal.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { PRO_LEGAL, PRO_TERMS, PRO_PRIVACY, PRO_COOKIES, gapsIn, toMarkdown } from "../../src/lib/legal/pro_legal";
import { CONSENT_LINE } from "../../src/lib/monetization/checkout_params";
import { priceLine } from "../../src/lib/monetization/plan";
import TermsPage from "../../src/app/(site)/terms/page";
import PrivacyPage from "../../src/app/(site)/privacy/page";
import CookiesPage from "../../src/app/(site)/cookies/page";
import PricingPage from "../../src/app/(site)/pricing/page";
import { red, redSummary } from "../../scripts/lib/red";

/* The legal pages are written for Next's automatic JSX runtime and name no React; this runner compiles JSX to
   React.createElement, so the pages read the one React this file lends them when they render (as tests/spine/places_doors). */
(globalThis as unknown as { React: typeof React }).React = React;

const RULE = "pro-legal";
const FILE = "src/lib/legal/pro_legal.ts";
const REMEDY = "keep the drafts the one source of the legal pages from launch day: #refunds in the terms, the consent line word for word, prices from the plan, gaps marked [HIS: ...], drawn only when the paywall is on";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

const all = (d: (typeof PRO_LEGAL)[number]) => d.blocks.flatMap((b) => [b.heading, ...b.paragraphs.map((p) => p.text)]).join("\n");
check(`three drafts, the terms, privacy and cookies (${PRO_LEGAL.map((d) => d.key).join(", ")})`, JSON.stringify(PRO_LEGAL.map((d) => d.key)) === JSON.stringify(["terms", "privacy", "cookies"]));
const refunds = PRO_TERMS.blocks.find((b) => b.id === "refunds");
check("the terms carry \"Cancelling and refunds\" at #refunds", refunds?.heading === "Cancelling and refunds");
check("the 14-day right says the checkout's consent line word for word", all(PRO_TERMS).includes(CONSENT_LINE));
check(`the prices print through the plan (${priceLine("month")}, ${priceLine("year")})`, all(PRO_TERMS).includes(priceLine("month")) && all(PRO_TERMS).includes(priceLine("year")));
check("no price is typed in the module", !/\$\s?\d/.test(readFileSync(FILE, "utf8").replace(/\$\{[^}]*\}/g, "")));
for (const d of PRO_LEGAL) {
  check(`${d.key}: no em dash`, !all(d).includes("\u2014") && !d.standfirst.includes("\u2014"));
  check(`${d.key}: no semicolon a reader sees`, !/;/.test(all(d)) && !d.standfirst.includes(";"));
  check(`${d.key}: every gap is closed and marked [HIS: ...]`, (all(d).match(/\[HIS:/g) ?? []).length === gapsIn(d).length);
}
check("who we are is his to fill: the terms name no business, only a gap", (PRO_TERMS.blocks.find((b) => b.id === "who-we-are")?.paragraphs ?? []).some((p) => /\[HIS: /.test(p.text)));
console.log(`      gaps for him: ${PRO_LEGAL.flatMap((d) => gapsIn(d)).length} (${PRO_LEGAL.map((d) => `${d.key} ${gapsIn(d).length}`).join(", ")})`);

/* The export he reads: every document and every heading, one source. */
const md = toMarkdown(PRO_LEGAL);
check("the export holds every draft's title and every heading", PRO_LEGAL.every((d) => md.includes(`# ${d.title}`) && d.blocks.every((b) => md.includes(`## ${b.heading}`))));

/* The pages: the drafts only when the switch is on (accounts and the paywall together), their current text until then. */
const html = (C: () => React.ReactElement) => renderToStaticMarkup(React.createElement(C));
const set = (on: boolean) => { process.env.NEXT_PUBLIC_AUTH_ENABLED = on ? "1" : ""; process.env.NEXT_PUBLIC_PAYWALL = on ? "1" : ""; };
set(false);
const off = { terms: html(TermsPage), privacy: html(PrivacyPage), cookies: html(CookiesPage), pricing: html(PricingPage) };
set(true);
const on = { terms: html(TermsPage), privacy: html(PrivacyPage), cookies: html(CookiesPage), pricing: html(PricingPage) };
set(false);
const mark = (d: (typeof PRO_LEGAL)[number]) => d.blocks[d.blocks.length - 1].heading;
check("the terms draw the draft with the switch on, #refunds included", on.terms.includes('id="refunds"') && on.terms.includes(mark(PRO_TERMS)));
check("and their current text with it off", !off.terms.includes('id="refunds"') && off.terms.includes("Everything that is free today stays free."));
check("privacy draws the draft with the switch on, its current text off", on.privacy.includes(mark(PRO_PRIVACY)) && !off.privacy.includes(mark(PRO_PRIVACY)));
check("cookies draw the draft with the switch on, their current text off", on.cookies.includes(mark(PRO_COOKIES)) && !off.cookies.includes(mark(PRO_COOKIES)));
check("each page shows the date the draft carries when on", [on.terms, on.privacy, on.cookies].every((h) => h.includes(`Last updated ${PRO_TERMS.updated}`)));
check("the pricing page links to the terms' cancelling section only when on", on.pricing.includes('href="/terms#refunds"') && !off.pricing.includes('href="/terms#refunds"'));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("legal/pro_legal: all pass");
