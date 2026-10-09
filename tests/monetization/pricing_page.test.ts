/**
 * THE PRICING PAGE LEADS WITH THE YEAR (his decision of 2026-10-09: Pro is $48 month to month or $456 a year, and the page leads with the year as "$38 a month, billed yearly"). Rendered with billing dormant (the notify-me link) and with billing live (two checkout buttons), the page prints the headline first, one plain line with the year's total and the saving, and the monthly price one line away, every figure from src/lib/monetization/plan.ts, and no other dollar figure.
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
const FILE = "src/app/(site)/pricing/page.tsx";
const REMEDY = "lead the plan card with the year: its headline (yearlyHeadline), then the year's total and the saving (yearlySavingLine), then the monthly price one line away (monthToMonthLine), every figure from plan.ts and none other";
let failed = 0;
/* A check may be a value or a function: a function that throws (a name the plan does not export yet) is a failed check. */
const check = (label: string, ok: boolean | (() => boolean)) => {
  let pass = false;
  try { pass = typeof ok === "function" ? ok() : ok; } catch { pass = false; }
  if (pass) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

/* What a visitor reads: the markup without its tags, entities decoded. */
const text = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const dollars = (t: string) => [...new Set([...t.matchAll(/\$\d[\d,]*(?:\.\d+)?/g)].map((m) => m[0]))].sort();
const buttons = (html: string) => [...html.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/g)].map((m) => text(m[1]));

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
  check(`${name}: the plan card leads with the year, "$38 a month, billed yearly", before what Pro opens`, () => at(yearlyHeadline()) > -1 && at(yearlyHeadline()) < at("What Pro opens"));
  check(`${name}: one plain line follows with the year's total and the saving`, () => at(yearlySavingLine()) > at(yearlyHeadline()) && at(yearlySavingLine()) < at("What Pro opens"));
  check(`${name}: the monthly price is one line away, "or $48 month to month", after the year`, () => at(monthToMonthLine()) > at(yearlySavingLine()) && at(monthToMonthLine()) < at("What Pro opens"));
  check(`${name}: the dollar figures are exactly the plan's own (${planFigures().join(", ")}), none typed on the page`, () => JSON.stringify(dollars(t)) === JSON.stringify(planFigures()));
  check(`${name}: no "Most popular" badge, no "Contact sales" tier, no countdown`, !/most popular|contact sales|countdown/i.test(t));
  check(`${name}: no trial offered above the questions (the first question below explains why there is none)`, () => { const aboveQuestions = t.slice(0, t.indexOf("Honest answers")); return aboveQuestions.length > 0 && !/trial/i.test(aboveQuestions); });
  check(`${name}: plain copy, no em dash and no semicolon`, !t.includes("\u2014") && !t.includes(";"));
  const b = buttons(html);
  if (live) {
    check(`${name}: the first checkout is the year, the second the month, one click from the line`, () => b[0].includes(priceLine("year")) && b[1] === monthToMonthLine());
  } else {
    check(`${name}: the notify-me link leads and no checkout button carries a price`, () => at("Notify me when Pro opens") > -1 && at("Notify me when Pro opens") < at(monthToMonthLine()) && !b.some((x) => /\$\d/.test(x)));
  }
}

check("the page's description leads with the year and gives the month to month price", () =>
  String(metadata.description).includes(yearlyHeadline()) && String(metadata.description).includes(monthToMonthLine()));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("monetization/pricing_page: all pass");
