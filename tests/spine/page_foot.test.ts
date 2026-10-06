/**
 * THE PAGE FOOT: REPORT A MISTAKE, AND CHECKED ONLY WHERE A DATE IS HELD (milestone 2, masterplan step 31; QUEUE
 * close:furniture-lines; the credibility doctrine of 2026-10-02: the page foot holds "Report a mistake" and "Checked [date]").
 * Read off the harness renders pages-fresh writes: every spine page type holds one "Report a mistake" link to the correction
 * page with its own path; a page the register slices back (the UK's country page; London, its trades, its districts) holds a
 * "Checked" line equal to the slices' build date, which the manifest must hold (the export writes it since 2026-10-06); no
 * other page holds the line, the UK how-to and the other UK cities' included (their figures are the shard's), and never
 * today's date standing in for a check. The correction page holds the site's one correction form, open, its path filled in,
 * and is never indexed.
 *
 * Run: npx tsx tests/spine/page_foot.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "node:fs";
import { ReportFoot } from "../../src/components/spine/ReportFoot";
import { checkedDateForCity, checkedDateForCountry, REGISTER_BUILT } from "../../src/lib/spine/checked";
import { reportHref } from "../../src/lib/spine/report";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "page-foot";
const FILE = "src/components/spine/ReportFoot.tsx";
const REMEDY = "draw ReportFoot under every spine page with the page's own path, its checked line only from a date the data holds";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };

/* Each harness page, its own path, and whether it is a UK page. */
const PAGES: Array<{ file: string; path: string; dated: boolean }> = [
  { file: "country-GB", path: "/gb", dated: true },
  { file: "country-AF", path: "/af", dated: false },
  { file: "howto-GB", path: "/gb/how-to-open", dated: false },
  { file: "city-london", path: "/cities/london", dated: true },
  { file: "cell-gb-london-restaurants", path: "/gb/london/restaurants", dated: true },
  { file: "cell-gb-london-barbershops", path: "/gb/london/barbershops", dated: true },
  { file: "industry-restaurants", path: "/industries/restaurants", dated: false },
  { file: "hood-london", path: "/cities/london/neighborhoods", dated: true },
  { file: "hood-london-city-of-london", path: "/cities/london/neighborhoods/city-of-london", dated: true },
  { file: "home-gb", path: "/", dated: false },
];
const listed = JSON.parse(readFileSync("scripts/harness/pages.json", "utf8")).pages.map((p: { surface: string; slugs: string[] }) => `${p.surface}-${p.slugs.join("-")}`);
check(`the test reads every page the harness lists (${listed.length})`, listed.length === PAGES.length && listed.every((f: string) => PAGES.some((p) => p.file === f)));

const built = checkedDateForCountry("GB");
check(
  `the register slices carry the day their export ran (${REGISTER_BUILT ?? "none held"}), and the UK's checked date is it`,
  REGISTER_BUILT !== null && built === REGISTER_BUILT,
  "data/uk/registers/manifest.json",
  "run python E:/atlas/registers/uk/export_for_site.py, which writes the day it ran into the manifest's built; never edit the manifest by hand",
);

/* The date only where the slices back the figures: London's pages, never the other UK cities' (their figures are the shard's). */
const CHECKED = "src/lib/spine/checked.ts";
const SCOPE = "print the date only where the register slices back the figures: checkedDateForCountry on the country page, checkedDateForCity with the city's slug on city, trade and district pages, none on the how-to";
check("London's city-level pages carry the date", checkedDateForCity("GB", "london") === REGISTER_BUILT, CHECKED, SCOPE);
check(
  "the other UK cities' pages carry none (Manchester, Birmingham, Leeds, Glasgow, Edinburgh, Bristol)",
  ["manchester", "birmingham", "leeds", "glasgow", "edinburgh", "bristol"].every((city) => checkedDateForCity("GB", city) === null),
  CHECKED,
  SCOPE,
);
check("no other country's page carries one", checkedDateForCountry("DE") === null && checkedDateForCity("DE", "berlin") === null && checkedDateForCountry(null) === null, CHECKED, SCOPE);
for (const [file, kind] of [
  ["src/components/spine/city/city-view.tsx", "city"],
  ["src/components/spine/cell/cell-view.tsx", "city"],
  ["src/components/spine/hood/hood-view.tsx", "city"],
  ["src/components/spine/country/country-view.tsx", "country"],
  ["src/components/spine/country/how-to-view.tsx", "none"],
] as const) {
  const src = readFileSync(file, "utf8");
  const asks = { city: src.includes("checkedDateForCity("), country: src.includes("checkedDateForCountry(") };
  const ok = kind === "none" ? !asks.city && !asks.country : kind === "city" ? asks.city && !asks.country : asks.country && !asks.city;
  check(`${file.split("/").pop()} ${kind === "none" ? "asks no date (its steps, days and fees are the shard's)" : `asks the ${kind} date for its foot`}`, ok, file, SCOPE);
}
for (const p of PAGES) {
  const at = `scratchpad/harness/pages/${p.file}.html`;
  if (!existsSync(at)) { check(`${p.file}: rendered`, false); continue; }
  const h = readFileSync(at, "utf8");
  const links = [...h.matchAll(/<a[^>]*data-report="1"[^>]*href="([^"]+)"|<a[^>]*href="([^"]+)"[^>]*data-report="1"/g)].map((m) => (m[1] ?? m[2]).replace(/&amp;/g, "&"));
  check(`${p.file}: one "Report a mistake" link, to the correction page with ${p.path} (${links.join(" ") || "none"})`, links.length === 1 && links[0] === reportHref(p.path));
  const lines = (h.match(/data-checked="1"/g) ?? []).length;
  check(`${p.file}: ${p.dated && built ? "one checked line, the register's build date" : "no checked line"}`, p.dated && built ? lines === 1 && new RegExp(`datetime="${built}"`, "i").test(h) : lines === 0);
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
