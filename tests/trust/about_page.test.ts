/**
 * WHO RUNS THIS: /about (his ruling of 2026-10-05 on PARKED P0.2, option (a): "a short about page with his name and why the site
 * exists"). The page names him, says why the site exists and how a figure is checked, and leads to the contact form, About the
 * figures, the corrections log and the data pack. It states nothing he has not given: no background, photo, company, funding,
 * advertising or AI-assistance claim until he supplies them (CREDIBILITY.md's draft lines are his to edit).
 *
 * Holds: the page at /about, canonical, naming a person (never "Margin Atlas team"); its links; no claim on the list above; /about a
 * known top-level address, in the sitemap; the footer's Trust column leads to /about, /corrections and /data.
 *
 * Run: npx tsx tests/trust/about_page.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TOP_LEVEL_SEGMENTS } from "../../src/lib/routing/top_level_segments";
import { red, redSummary } from "../../scripts/lib/red";

(globalThis as unknown as { React: typeof React }).React = React;

const RULE = "about-page";
const FILE = "src/app/(site)/about/page.tsx";
const REMEDY = "keep /about naming him with only what he has given, linked from the footer, in the sitemap and the edge's list";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

check("/about is a known top-level address", TOP_LEVEL_SEGMENTS.has("about"));
check("the sitemap lists /about", readFileSync("src/app/sitemap.ts", "utf8").includes("/about`"));
const chrome = readFileSync("src/components/SiteChrome.tsx", "utf8");
check("the footer leads to /about, /corrections and /data", ['href="/about"', 'href="/corrections"', 'href="/data"'].every((h) => chrome.includes(h)));

(async () => {
  if (!existsSync(FILE)) { check("the page exists at /about", false); }
  else {
    const mod = (await import("../../" + FILE)) as { default: () => React.ReactElement; metadata?: { alternates?: { canonical?: string } } };
    const html = renderToStaticMarkup(mod.default());
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    check("the page is canonical at /about", mod.metadata?.alternates?.canonical === "/about");
    check("the page names him", text.includes("Benet Bani"));
    check('no anonymous "team" signature', !/Margin Atlas team/i.test(text));
    check("the page leads to the contact form, About the figures, the corrections log and the data pack",
      ['href="/contact"', 'href="/about-data"', 'href="/corrections"', 'href="/data"'].every((h) => html.includes(h)));
    check("no claim he has not given (funding, advertising, AI assistance, background, accreditation)",
      !/subscriber|advertis|affiliate|\bAI\b|artificial intelligence|accredited|official statistics|years of experience|former|founded in/i.test(text));
  }
  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("trust/about_page: all pass");
})();
