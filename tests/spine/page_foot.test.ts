/**
 * THE PAGE FOOT: REPORT A MISTAKE, AND CHECKED ONLY WHERE A DATE IS HELD (milestone 2, masterplan step 31; QUEUE
 * close:furniture-lines; the credibility doctrine of 2026-10-02: the page foot holds "Report a mistake" and "Checked [date]").
 * Read off the harness renders pages-fresh writes: every spine page type holds one "Report a mistake" link to the correction
 * page with its own path; a UK page holds a "Checked" line equal to the register slices' build date when the manifest holds
 * one, and no page holds the line when none is held (never today's date standing in for a check). The correction page holds
 * the site's one correction form, open, its path filled in, and is never indexed.
 *
 * Run: npx tsx tests/spine/page_foot.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "node:fs";
import { ReportFoot } from "../../src/components/spine/ReportFoot";
import { checkedDateFor, REGISTER_BUILT } from "../../src/lib/spine/checked";
import { reportHref } from "../../src/lib/spine/report";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "page-foot";
const FILE = "src/components/spine/ReportFoot.tsx";
const REMEDY = "draw ReportFoot under every spine page with the page's own path, its checked line only from a date the data holds";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

/* Each harness page, its own path, and whether it is a UK page. */
const PAGES: Array<{ file: string; path: string; uk: boolean }> = [
  { file: "country-GB", path: "/gb", uk: true },
  { file: "country-AF", path: "/af", uk: false },
  { file: "howto-GB", path: "/gb/how-to-open", uk: true },
  { file: "city-london", path: "/cities/london", uk: true },
  { file: "cell-gb-london-restaurants", path: "/gb/london/restaurants", uk: true },
  { file: "cell-gb-london-barbershops", path: "/gb/london/barbershops", uk: true },
  { file: "industry-restaurants", path: "/industries/restaurants", uk: false },
  { file: "hood-london", path: "/cities/london/neighborhoods", uk: true },
  { file: "hood-london-city-of-london", path: "/cities/london/neighborhoods/city-of-london", uk: true },
];
const listed = JSON.parse(readFileSync("scripts/harness/pages.json", "utf8")).pages.map((p: { surface: string; slugs: string[] }) => `${p.surface}-${p.slugs.join("-")}`);
check(`the test reads every page the harness lists (${listed.length})`, listed.length === PAGES.length && listed.every((f: string) => PAGES.some((p) => p.file === f)));

const built = checkedDateFor("GB");
check(`the UK's checked date is the manifest's build date or nothing (${REGISTER_BUILT ?? "none held"})`, built === (REGISTER_BUILT ?? null));
for (const p of PAGES) {
  const at = `scratchpad/harness/pages/${p.file}.html`;
  if (!existsSync(at)) { check(`${p.file}: rendered`, false); continue; }
  const h = readFileSync(at, "utf8");
  const links = [...h.matchAll(/<a[^>]*data-report="1"[^>]*href="([^"]+)"|<a[^>]*href="([^"]+)"[^>]*data-report="1"/g)].map((m) => (m[1] ?? m[2]).replace(/&amp;/g, "&"));
  check(`${p.file}: one "Report a mistake" link, to the correction page with ${p.path} (${links.join(" ") || "none"})`, links.length === 1 && links[0] === reportHref(p.path));
  const lines = (h.match(/data-checked="1"/g) ?? []).length;
  check(`${p.file}: ${p.uk && built ? "one checked line, the register's build date" : "no checked line, no date held"}`, p.uk && built ? lines === 1 && new RegExp(`datetime="${built}"`, "i").test(h) : lines === 0);
}

/* The component itself, both ways, and the correction page's link held to a path on this site. */
const withDate = renderToStaticMarkup(React.createElement(ReportFoot, { path: "/gb", checked: "2026-10-01" }));
const without = renderToStaticMarkup(React.createElement(ReportFoot, { path: "/gb", checked: null }));
check("given a held date, the foot prints it once, as a date", (withDate.match(/data-checked="1"/g) ?? []).length === 1 && /datetime="2026-10-01"/i.test(withDate) && withDate.includes("1 October 2026"));
check("given none, it prints no checked line", !without.includes("data-checked"));
check("the link carries the path, nothing else, and asks crawlers not to follow it", reportHref("/gb/london/restaurants") === "/corrections/new?page=%2Fgb%2Flondon%2Frestaurants" && /rel="nofollow"/.test(without));
check("a path from elsewhere is never carried", reportHref("https://example.com/x") === "/corrections/new" && reportHref("//evil.example") === "/corrections/new");

const page = readFileSync("src/app/(site)/corrections/new/page.tsx", "utf8");
check("the correction page holds the one correction form, open", /<CorrectionForm[^>]*startOpen/.test(page));
check("and is never indexed", /index:\s*false/.test(page));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/page_foot: all pass");
