/**
 * THE TERMS OF PRO, DRAFTED FOR HIS APPROVAL (milestone 2, masterplan step 30; his interview of 2026-09-26, ruling 34): the drafts
 * in src/lib/legal/pro_legal.ts are one source for the three legal pages from launch day and for the file he approves. Held here:
 * the terms carry the cancelling and refunds section at #refunds; the 14-day right says the checkout's consent line word for word;
 * the prices print through the plan; no em dash and no semicolon a reader sees; every fact about him is a marked gap, never a
 * value; and the pages draw the drafts only when the paywall's switch is on, their current text until then.
 *
 * AND NEVER A DRAFT WITH A GAP (plan 2026-10-10, the home reformed to ship, Task 8; the spec's decision 11, the ship audit's 5.1):
 * with the switch on, a page whose draft still holds a [HIS: ...] gap draws its text of today (LegalDraft's required `now`), so no
 * gap can print; the pricing page links to #refunds only once the terms' draft is drawn; the launch checklist's item (j) is a reason
 * while the switch is on and a gap remains. The privacy draft names Sentry in the live page's own words. FIX ROUND 8: item (j) is
 * also a reason while it cannot see the switch (launch day sets it in Vercel's dashboard, which the terminal that runs launch:check
 * cannot read) and a gap remains; the privacy draft says what the email list holds and why.
 *
 * Run: npx tsx tests/legal/pro_legal.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { PRO_LEGAL, PRO_TERMS, PRO_PRIVACY, PRO_COOKIES, SENTRY_LEAD, SENTRY_WORDS, EMAIL_LIST_LEAD, EMAIL_LIST_WORDS, draftReady, gapsIn, legalLaunchLine, toMarkdown, type LegalDoc } from "../../src/lib/legal/pro_legal";
import { LegalDraft } from "../../src/components/LegalDraft";
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
const REMEDY = "keep the drafts the one source of the legal pages from launch day: #refunds in the terms, the consent line word for word, prices from the plan, gaps marked [HIS: ...], drawn only when the paywall is on and the draft holds no gap";
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
check("the privacy draft names Sentry in the live page's words", all(PRO_PRIVACY).includes(`**${SENTRY_LEAD}** ${SENTRY_WORDS}`) && /Sentry receives the error reports/.test(all(PRO_PRIVACY)));
check("the privacy draft promises no newsletter it cannot send", !/newsletter/i.test(all(PRO_PRIVACY)));
/* FIX ROUND 8 (Task 8's review; he reads these words before any deploy). The Sentry words said "the reports carry no name or email"
   while a server report carried the request's cookies, and the session cookie holds the email: the code now drops them
   (sentry.server.config.ts) and the words say what a report holds. The list's sentence said "Nothing else is attached to it" while
   the row also holds the day and the form, and it named one purpose where two forms collect an address. */
check("the Sentry words promise no 'no name', 'no email' or 'no personal data', and say what a server report leaves out", !/\bno (?:name|email|personal data)\b/i.test(SENTRY_WORDS) && SENTRY_WORDS.includes("without cookies or location") && SENTRY_WORDS.includes("anything written in an address or an error message goes with it"));
check("the privacy draft says what the email list holds beside the address, both forms and the three reasons for it, in the live page's words (tests/trust/launch_guards.test.ts pins them whole)", typeof EMAIL_LIST_LEAD === "string" && typeof EMAIL_LIST_WORDS === "string" && all(PRO_PRIVACY).includes(`**${EMAIL_LIST_LEAD}** ${EMAIL_LIST_WORDS}`) && EMAIL_LIST_WORDS.includes("when a place you asked about gains depth") && EMAIL_LIST_WORDS.includes("the place form"));
console.log(`      gaps for him: ${PRO_LEGAL.flatMap((d) => gapsIn(d)).length} (${PRO_LEGAL.map((d) => `${d.key} ${gapsIn(d).length}`).join(", ")})`);

/* The export he reads: every document and every heading, one source. */
const md = toMarkdown(PRO_LEGAL);
check("the export holds every draft's title and every heading", PRO_LEGAL.every((d) => md.includes(`# ${d.title}`) && d.blocks.every((b) => md.includes(`## ${b.heading}`))));

/* A draft with a gap is never drawn: LegalDraft draws `now` for it, and the draft itself once every gap is filled. */
const fill = (d: LegalDoc): LegalDoc => ({ ...d, blocks: d.blocks.map((b) => ({ ...b, paragraphs: b.paragraphs.map((p) => ({ ...p, text: p.text.replace(/\[HIS: [^\]]+\]/g, "Filled") })) })) });
const NOW = React.createElement("p", null, "TODAY'S TEXT");
const drawn = (d: LegalDoc) => renderToStaticMarkup(React.createElement(LegalDraft, { doc: d, now: NOW }));
check("draftReady is true only for a draft with no gap", (!draftReady(PRO_TERMS)) === (gapsIn(PRO_TERMS).length > 0) && draftReady(fill(PRO_TERMS)));
check("LegalDraft draws today's text for a draft with a gap, and no gap", gapsIn(PRO_TERMS).length === 0 || (drawn(PRO_TERMS).includes("TODAY") && !drawn(PRO_TERMS).includes("[HIS:")));
check("LegalDraft draws a filled draft, #refunds and all, and not today's text", drawn(fill(PRO_TERMS)).includes('id="refunds"') && !drawn(fill(PRO_TERMS)).includes("TODAY"));

/* The pages: the drafts only when the switch is on (accounts and the paywall together) and the draft is whole, their current text
   otherwise. */
const html = (C: () => React.ReactElement) => renderToStaticMarkup(React.createElement(C));
const set = (on: boolean) => { process.env.NEXT_PUBLIC_AUTH_ENABLED = on ? "1" : ""; process.env.NEXT_PUBLIC_PAYWALL = on ? "1" : ""; };
set(false);
const off = { terms: html(TermsPage), privacy: html(PrivacyPage), cookies: html(CookiesPage), pricing: html(PricingPage) };
set(true);
const on = { terms: html(TermsPage), privacy: html(PrivacyPage), cookies: html(CookiesPage), pricing: html(PricingPage) };
set(false);
const mark = (d: (typeof PRO_LEGAL)[number]) => d.blocks[d.blocks.length - 1].heading;
const showsDraft = (page: string, d: LegalDoc) => page.includes(mark(d)) && page.includes(`Last updated ${d.updated}`);
for (const [key, d] of [["terms", PRO_TERMS], ["privacy", PRO_PRIVACY], ["cookies", PRO_COOKIES]] as const) {
  check(`${key}: with the switch on, the draft only if it is whole (${gapsIn(d).length} gaps), never a gap on the page`, (draftReady(d) ? showsDraft(on[key], d) : !showsDraft(on[key], d)) && !on[key].includes("[HIS:"));
  check(`${key}: with the switch off, today's text`, !showsDraft(off[key], d) && !off[key].includes("[HIS:"));
}
check("the terms with the switch off say everything free stays free", off.terms.includes("Everything that is free today stays free."));
check("each page hands LegalDraft today's text (`now`), so none can print a gap", ["terms", "privacy", "cookies"].every((k) => new RegExp(`<LegalDraft doc=\\{PRO_${k.toUpperCase()}\\} now=\\{now\\}`).test(readFileSync(`src/app/(site)/${k}/page.tsx`, "utf8"))));
check("the pricing page links to the terms' cancelling section only when the switch is on and the terms' draft is drawn", /isPaywallOn\(\) && draftReady\(PRO_TERMS\) \? \(/.test(readFileSync("src/app/(site)/pricing/page.tsx", "utf8")) && on.pricing.includes('href="/terms#refunds"') === draftReady(PRO_TERMS) && !off.pricing.includes('href="/terms#refunds"'));

/* The launch checklist's item (j). */
const filled = PRO_LEGAL.map(fill);
check("legalLaunchLine is a reason while the switch is on and a gap remains", PRO_LEGAL.flatMap((d) => gapsIn(d)).length === 0 || !legalLaunchLine(true).ok);
check("it is no reason while the switch is off, and none once every gap is filled", legalLaunchLine(false).ok && legalLaunchLine(true, filled).ok);
/* FIX ROUND 8: launch day sets the switches in Vercel's dashboard, which the terminal that runs launch:check cannot read, so a
   switch no source answers is unknown (null), never off. */
check("legalLaunchLine cannot see the switch: a reason while a gap remains, and it says so", PRO_LEGAL.flatMap((d) => gapsIn(d)).length === 0 || (!legalLaunchLine(null).ok && legalLaunchLine(null).text.startsWith("cannot see Vercel's switches: fill the gaps first, or measure /terms on production")));
check("an unseen switch is no reason once every gap is filled, and it names no state it did not read", legalLaunchLine(null, filled).ok && !/paywall is off/.test(legalLaunchLine(null).text));
const launch = readFileSync("scripts/verify_launch_ready.ts", "utf8");
check("launch:check runs item (j) on the module's own judge over the two switches as readFlag reads them, before anything loads .env.local", /async function itemJ\(\): Promise<void> \{\s*const switches = readPaywallSwitches\(/.test(launch) && /legalLaunchLine\(switches\.on\)/.test(launch) && !/legalLaunchLine\(isPaywallOn\(\)\)/.test(launch) && /const order = \[[^\]]*"j"\]/.test(launch) && /if \(wanted\("d"\)\) itemD\(\);\s*if \(wanted\("j"\)\) await itemJ\(\);/.test(launch));
const launchFlat = launch.replace(/\r?\n\s*\*\s*/g, " "); /* the comment's line breaks do not split a phrase */
check("launch:check states the blind spot: a switch set only in Vercel's dashboard is unknown to it", /cannot see a variable set only in Vercel's dashboard/.test(launchFlat) && /measures production's \/terms/.test(launchFlat));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("legal/pro_legal: all pass");
