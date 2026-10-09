/**
 * THE PRICING PAGE LEADS WITH THE YEAR (his decision of 2026-10-09: Pro is $48 month to month or $456 a year, and the page leads with the year as "$38 a month, billed yearly"). Rendered with billing dormant (the notify-me link) and with billing live (two checkout buttons), the page prints the headline first, one plain line with the year's total and the saving, and the monthly price one line away, every figure from src/lib/monetization/plan.ts, and no other dollar figure. With billing live, each checkout button posts the interval its label names (the year's "year", the month to month one "month"), read from the data-interval CheckoutButton draws, and the month to month one takes the 44px tap and a name that does not open with "or". While billing is dormant the monthly line sits under the saving line, above the notify-me link.
 *
 * The bans of the v34 rules stay (scripts/verify_v34_research_rules.ts reads the source for them; this reads the page as drawn): no "Most popular" badge, no trial, no countdown, no "Contact sales" tier. Copy is plain: no em dash, no semicolon.
 *
 * Run: npx tsx tests/monetization/pricing_page.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import PricingPage, { metadata } from "../../src/app/(site)/pricing/page";
import { PRO, YEARLY_BY_MONTH_USD, YEARLY_SAVING_USD, priceLine, yearlyHeadline, yearlySavingLine, monthToMonthLine } from "../../src/lib/monetization/plan";
import { red, redSummary } from "../../scripts/lib/red";

/* The page is written for Next's automatic JSX runtime and names no React; this runner compiles JSX to React.createElement, so
   the page reads the one React this file lends it when it renders (as tests/legal/pro_legal.test.ts). */
(globalThis as unknown as { React: typeof React }).React = React;

const RULE = "pricing-page";
const PAGE = "src/app/(site)/pricing/page.tsx";
const PLAN = "src/lib/monetization/plan.ts";
const BUTTON = "src/components/monetization/CheckoutButton.tsx";
/* The page prints words of its own and words from two modules it imports: what Pro opens and the cancel block, and the questions. */
const WORDS = `${PAGE}, src/components/monetization/paywall_copy.ts (what Pro opens, the cancel block) or src/components/billing/PricingFAQ.tsx (the questions)`;
/* EACH CHECK NAMES THE MODULE TO CHANGE. One remedy for every check had a reader of the ban or the copy check sent to "lead the plan
   card with the year", which was not what that check wanted. */
type Fix = { file: string; remedy: string };
const FIX = {
  lead: { file: PAGE, remedy: `in ${PAGE} lead the plan card with the year: yearlyHeadline(), then yearlySavingLine(), then monthToMonthLine(), each read from ${PLAN}` },
  figures: { file: PAGE, remedy: `print every price through ${PLAN} and take any other dollar figure out of ${WORDS}` },
  bans: { file: PAGE, remedy: `take the badge, the Contact sales tier or the countdown out of ${WORDS}, where scripts/verify_v34_research_rules.ts bans each in source` },
  trial: { file: PAGE, remedy: `take the trial offer out of the words above the questions in ${PAGE} or src/components/monetization/paywall_copy.ts, since the first question in src/components/billing/PricingFAQ.tsx says why there is none` },
  plain: { file: PAGE, remedy: `write the line plain, with no em dash and no semicolon, in the module that prints it: ${WORDS}, or the plan's own lines in ${PLAN}` },
  dormant: { file: PAGE, remedy: `in ${PAGE} put the month to month line under the saving line and above the notify-me link, and give no button a price while billing is dormant` },
  checkout: { file: PAGE, remedy: `in ${PAGE} give the year's button interval="year" and the month to month one interval="month", which ${BUTTON} draws as data-interval` },
  monthButton: { file: PAGE, remedy: `in ${PAGE} give the month to month button inline-flex min-h-11 items-center and a hidden (sr-only) "Get Pro " before its visible line` },
  description: { file: PAGE, remedy: `in ${PAGE} build metadata.description from yearlyHeadline() and monthToMonthLine()` },
} satisfies Record<string, Fix>;
let failed = 0;
/* A check may be a value or a function: a function that throws (a name the plan does not export yet) is a failed check. */
const check = (label: string, ok: boolean | (() => boolean), fix: Fix) => {
  let pass = false;
  try { pass = typeof ok === "function" ? ok() : ok; } catch { pass = false; }
  if (pass) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: fix.file, detail: label, remedy: fix.remedy });
};

/* What a visitor reads: the markup without its tags, entities decoded. */
const text = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const dollars = (t: string) => [...new Set([...t.matchAll(/\$\d[\d,]*(?:\.\d+)?/g)].map((m) => m[0]))].sort();
const buttons = (html: string) => [...html.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/g)].map((m) => text(m[1]));
/* Each checkout button as drawn: what it says (label), the markup it says it in (inner), what it does and how it looks. What it
   does is the interval it posts: CheckoutButton draws it as data-interval, so two `interval` props swapped in the page cannot hide
   behind labels that still read right. */
const checkouts = (html: string) => [...html.matchAll(/<button([^>]*)>([\s\S]*?)<\/button>/g)].map((m) => ({
  label: text(m[2]),
  inner: m[2],
  interval: /\bdata-interval="([^"]*)"/.exec(m[1])?.[1] ?? null,
  classes: (/\bclass="([^"]*)"/.exec(m[1])?.[1] ?? "").split(/\s+/),
}));

/* Billing is live only when accounts are on and a Stripe secret is set; a marker stands in for the secret in this render, and
   nothing is sent anywhere. */
const saved = { auth: process.env.NEXT_PUBLIC_AUTH_ENABLED, paywall: process.env.NEXT_PUBLIC_PAYWALL, stripe: process.env.STRIPE_SECRET_KEY };
const restore = (k: "NEXT_PUBLIC_AUTH_ENABLED" | "NEXT_PUBLIC_PAYWALL" | "STRIPE_SECRET_KEY", v: string | undefined) => { if (v === undefined) delete process.env[k]; else process.env[k] = v; };
const render = (live: boolean) => {
  process.env.NEXT_PUBLIC_AUTH_ENABLED = live ? "1" : "";
  process.env.NEXT_PUBLIC_PAYWALL = "";
  process.env.STRIPE_SECRET_KEY = live ? "pricing-page-test-marker" : "";
  try { return renderToStaticMarkup(React.createElement(PricingPage)); } finally {
    restore("NEXT_PUBLIC_AUTH_ENABLED", saved.auth);
    restore("NEXT_PUBLIC_PAYWALL", saved.paywall);
    restore("STRIPE_SECRET_KEY", saved.stripe);
  }
};

const states: Array<[string, boolean]> = [["billing dormant", false], ["billing live", true]];
const pages = states.map(([name, live]) => ({ name, live, html: render(live) }));
const planFigures = () => [YEARLY_BY_MONTH_USD, PRO.yearlyUsd, YEARLY_SAVING_USD, PRO.monthlyUsd].map((n) => `$${n}`).sort();

for (const { name, live, html } of pages) {
  const t = text(html);
  const at = (s: string) => t.indexOf(s);
  check(`${name}: the plan card leads with the year, "$38 a month, billed yearly", before what Pro opens`, () => at(yearlyHeadline()) > -1 && at(yearlyHeadline()) < at("What Pro opens"), FIX.lead);
  check(`${name}: one plain line follows with the year's total and the saving`, () => at(yearlySavingLine()) > at(yearlyHeadline()) && at(yearlySavingLine()) < at("What Pro opens"), FIX.lead);
  check(`${name}: the monthly price is one line away, "or $48 month to month", after the year`, () => at(monthToMonthLine()) > at(yearlySavingLine()) && at(monthToMonthLine()) < at("What Pro opens"), FIX.lead);
  check(`${name}: the dollar figures are exactly the plan's own (${planFigures().join(", ")}), none typed on the page`, () => JSON.stringify(dollars(t)) === JSON.stringify(planFigures()), FIX.figures);
  check(`${name}: no "Most popular" badge, no "Contact sales" tier, no countdown`, !/most popular|contact sales|countdown/i.test(t), FIX.bans);
  check(`${name}: no trial offered above the questions (the first question below explains why there is none)`, () => { const aboveQuestions = t.slice(0, t.indexOf("Honest answers")); return aboveQuestions.length > 0 && !/trial/i.test(aboveQuestions); }, FIX.trial);
  check(`${name}: plain copy, no em dash and no semicolon`, !t.includes("\u2014") && !t.includes(";"), FIX.plain);
  const b = buttons(html);
  if (live) {
    const cs = checkouts(html);
    /* The label and the interval it posts agree: the year's button posts "year", the month to month one posts "month". */
    const named = (label: string) => { const hits = cs.filter((x) => x.label.includes(label)); return hits.length === 1 ? hits[0] : null; };
    check(`${name}: the first checkout is the year, the second the month, one click from the line`, () => b[0].includes(priceLine("year")) && b[1].includes(monthToMonthLine()), FIX.checkout);
    check(`${name}: the button labelled "${priceLine("year")}" posts "year"`, () => named(priceLine("year"))?.interval === "year", FIX.checkout);
    check(`${name}: the button labelled "${monthToMonthLine()}" posts "month"`, () => named(monthToMonthLine())?.interval === "month", FIX.checkout);
    /* A screen reader says a button's name alone, so the month button must not open with "or": "Get Pro " is hidden text before
       the visible line. And it takes the site's 44px tap (scripts/harness/check_page_laws.mjs, TAP SIZE), as the year's pill does by its padding. */
    check(`${name}: the month button's accessible name opens "Get Pro", hidden, and not "or"`, () => b[1] === `Get Pro ${monthToMonthLine()}` && cs[1].inner.startsWith('<span class="sr-only">Get Pro </span>'), FIX.monthButton);
    check(`${name}: the month button takes the 44px tap (min-h-11, inline-flex, items-center)`, () => ["min-h-11", "inline-flex", "items-center"].every((c) => cs[1].classes.includes(c)), FIX.monthButton);
  } else {
    check(`${name}: the monthly line sits under the saving line, above the notify-me link, and no button carries a price`, () =>
      at(yearlySavingLine()) < at(monthToMonthLine()) && at(monthToMonthLine()) < at("Notify me when Pro opens") && at("Notify me when Pro opens") < at("What Pro opens") && !b.some((x) => /\$\d/.test(x)), FIX.dormant);
  }
}

check("the page's description leads with the year and gives the month to month price", () =>
  String(metadata.description).includes(yearlyHeadline()) && String(metadata.description).includes(monthToMonthLine()), FIX.description);

if (failed > 0) { redSummary(RULE, failed, "change the module each finding above names", "checks failed"); process.exit(1); }
console.log("monetization/pricing_page: all pass");
