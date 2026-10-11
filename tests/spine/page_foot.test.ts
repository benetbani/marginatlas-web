/**
 * THE PAGE FOOT: REPORT A MISTAKE, AND CHECKED ONLY WHERE A DATE IS HELD (milestone 2, masterplan step 31; QUEUE
 * close:furniture-lines; the credibility doctrine of 2026-10-02: the page foot holds "Report a mistake" and "Checked [date]").
 * Read off the harness renders pages-fresh writes: every spine page type holds one "Report a mistake" link to the correction
 * page with its own path; a page the register slices back (the UK's country page; London's city page; the London trade pages
 * of the trades the registers match) holds a "Checked" line equal to the slices' build date, which the manifest must hold
 * (the export writes it since 2026-10-06); no other page holds the line, the UK how-to, London's district pages, the London
 * trades the registers do not match and the other UK cities' included (no export dates their figures), and never today's
 * date standing in for a check. The correction page holds the site's one correction form, open, its path filled in, and is
 * never indexed. Since plan 2026-10-10 (the home reformed to ship, Task 6; the critique's P1.12) the home holds the line too: its
 * worked example prints the London restaurant page's figures, so its foot asks that page's date.
 *
 * Run: npx tsx tests/spine/page_foot.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { ReportFoot } from "../../src/components/spine/ReportFoot";
import { SourcesFoot } from "../../src/components/spine/SourcesFoot";
import { checkedDateForCity, checkedDateForCountry, checkedDateForTrade, REGISTER_BUILT } from "../../src/lib/spine/checked";
import { reportHref } from "../../src/lib/spine/report";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "page-foot";
const FILE = "src/components/spine/ReportFoot.tsx";
const REMEDY = "draw ReportFoot under every spine page with the page's own path, its checked line only from a date the data holds";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };

/* Each harness page, its own path, and whether it carries the checked date. */
const PAGES: Array<{ file: string; path: string; dated: boolean }> = [
  { file: "country-GB", path: "/gb", dated: true },
  { file: "country-AF", path: "/af", dated: false },
  { file: "howto-GB", path: "/gb/how-to-open", dated: false },
  { file: "city-london", path: "/cities/london", dated: true },
  { file: "cell-gb-london-restaurants", path: "/gb/london/restaurants", dated: true },
  { file: "cell-gb-london-barbershops", path: "/gb/london/barbershops", dated: true },
  { file: "industry-restaurants", path: "/industries/restaurants", dated: false },
  { file: "hood-london", path: "/cities/london/neighborhoods", dated: false },
  { file: "hood-london-city-of-london", path: "/cities/london/neighborhoods/city-of-london", dated: false },
  { file: "home-gb", path: "/", dated: true },
  { file: "openings-world", path: "/new-businesses", dated: false },
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

/* The date only where the slices back the figures: London's city page and its matched trades, never the other UK cities'. */
const CHECKED = "src/lib/spine/checked.ts";
const SCOPE = "print the date only where the register slices back the figures: checkedDateForCountry on the country page, checkedDateForCity on a city page, checkedDateForTrade on a trade page, none on the how-to or the district pages";
const OTHER_UK = ["manchester", "birmingham", "leeds", "glasgow", "edinburgh", "bristol"];
check("London's city page carries the date", checkedDateForCity("GB", "london") === REGISTER_BUILT, CHECKED, SCOPE);
check("a London trade the registers match carries it (restaurants, barbershops)", checkedDateForTrade("GB", "london", "restaurants") === REGISTER_BUILT && checkedDateForTrade("GB", "london", "barbershops") === REGISTER_BUILT, CHECKED, SCOPE);
check("a London trade the registers do not match carries none (locksmiths, bike repair)", checkedDateForTrade("GB", "london", "locksmiths") === null && checkedDateForTrade("GB", "london", "bike-repair-shops") === null, CHECKED, SCOPE);
check(
  "the other UK cities' pages carry none (Manchester, Birmingham, Leeds, Glasgow, Edinburgh, Bristol)",
  OTHER_UK.every((city) => checkedDateForCity("GB", city) === null && checkedDateForTrade("GB", city, "restaurants") === null),
  CHECKED,
  SCOPE,
);
check("no other country's page carries one", checkedDateForCountry("DE") === null && checkedDateForCity("DE", "berlin") === null && checkedDateForTrade("DE", "berlin", "restaurants") === null && checkedDateForCountry(null) === null, CHECKED, SCOPE);
for (const [file, kind] of [
  ["src/components/spine/city/city-view.tsx", "city"],
  ["src/components/spine/cell/cell-view.tsx", "trade"],
  ["src/components/spine/hood/hood-view.tsx", "none"],
  ["src/components/spine/country/country-view.tsx", "country"],
  ["src/components/spine/country/how-to-view.tsx", "none"],
  ["src/components/spine/home/home-view.tsx", "trade"],
] as const) {
  const src = readFileSync(file, "utf8");
  const asks = { city: src.includes("checkedDateForCity("), country: src.includes("checkedDateForCountry("), trade: src.includes("checkedDateForTrade(") };
  const ok = (["city", "country", "trade"] as const).every((k) => asks[k] === (k === kind));
  check(`${file.split("/").pop()} ${kind === "none" ? "asks no date (no export dates its figures)" : `asks the ${kind} date for its foot`}`, ok, file, SCOPE);
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
check("given none, it prints no checked line", !without.includes("data-checked")); check("the foot stands 24px clear of what follows it, as it stands 24px under the last band, and that 24px is padding inside the band (pb-6), not a margin outside it: the newsletter bar's hairline touched it, 0px, on every spine page (critique pass 2, P0.3, the first photograph of the home inside its chrome), and a margin left the 24px bare white under the band (critique pass 3, fix round D2, item P2.5)", /<p data-page-foot[^>]*\bpb-6\b/.test(without) && !/<p data-page-foot[^>]*\bmb-/.test(without), FILE, "give ReportFoot's paragraph pb-6, the 24px under its line, as padding so the band reaches the newsletter bar; it was mb-6");
check("the link carries the path, nothing else, and asks crawlers not to follow it", reportHref("/gb/london/restaurants") === "/corrections/new?page=%2Fgb%2Flondon%2Frestaurants" && /rel="nofollow"/.test(without));
check("a path from elsewhere is never carried", reportHref("https://example.com/x") === "/corrections/new" && reportHref("//evil.example") === "/corrections/new");

/* THE FOOT LINES' BAND (critique pass 3, fix round D2, item P2.5): the licence line and the Report line stand outside the spine body, on the
   column's grey (--c-ground) with the frame's white at the column's sides (the gutters on a phone), so they read as a grey box with its edges
   showing. They are painted as one band, edge to edge, with the zones' own bleed (THE ZONES in globals.css: a border image's sideways outset) in
   the tint, and their spacing is padding inside the band so it runs unbroken from the last zone to the newsletter bar: a margin is a gap the
   background does not paint. BLIND SPOT: this reads the source; the round's probe reads the pixels at the column's side in a browser. */
const classesOf = (html: string, hook: string) => (new RegExp(`<p ${hook}[^>]*class="([^"]*)"`).exec(html)?.[1] ?? "").replace(/&amp;/g, "&").split(" ");
const licenceClasses = classesOf(renderToStaticMarkup(React.createElement(SourcesFoot, { iso2: "GB" })), "data-sources-foot");
const reportClasses = classesOf(without, "data-page-foot");
const noMargin = (c: string[]) => !c.some((k) => /^(\[\[data-sources-foot\]\+&\]:)?-?m[tbxylr]?-/.test(k));
check(`the licence line's spacing is padding inside the band (pt-6, the 24px under the last zone it had as mt-6) and the Report line's is padding too (pt-6 and pb-6, pt-2 straight under the licence line): no margin on either, so no gap is left unpainted (${licenceClasses.filter((k) => /^p[tb]-/.test(k)).join(" ")} | ${reportClasses.filter((k) => /p[tb]-/.test(k)).join(" ")})`, licenceClasses.includes("pt-6") && noMargin(licenceClasses) && reportClasses.includes("pt-6") && reportClasses.includes("pb-6") && reportClasses.includes("[[data-sources-foot]+&]:pt-2") && noMargin(reportClasses), "src/components/spine/SourcesFoot.tsx", "give the licence line pt-6 and the Report line pt-6 pb-6 [[data-sources-foot]+&]:pt-2 in place of their margins, so the band under the last zone is one run of padding and the zones' bleed paints all of it");
/* EVERY SITE THAT CARRIES A FOOT HOOK, not only the two components: the openings view draws its own licence-link line (the link alone, the UK's
   licence sentence not covering its two outside sources) with the same `data-sources-foot` hook and a margin of its own, which the band painted
   around, a white gap under the last zone. The scan reads every .tsx under src for a tag carrying either hook and its class string. BLIND SPOT:
   it reads a literal className, so a class list built in a variable would not be seen; the three sites hold literals. */
const tsxUnder = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? tsxUnder(`${dir}/${e.name}`) : e.name.endsWith(".tsx") ? [`${dir}/${e.name}`] : []));
const footSites = tsxUnder("src").flatMap((f) => [...stripCommentLines(readFileSync(f, "utf8").split("\n")).join("\n").matchAll(/<p data-(sources|page)-foot\b[^>]*?className="([^"]*)"/g)].map((m) => ({ file: f, hook: m[1], classes: m[2].split(" ") })));
const marginSites = footSites.filter((s) => !noMargin(s.classes)).map((s) => `${s.file} (${s.hook})`);
check(`every tag that carries a foot hook spaces itself with padding, never a margin (${footSites.length} sites: ${footSites.map((s) => s.file.split("/").pop()).join(", ")}${marginSites.length ? `; a margin on ${marginSites.join(", ")}` : ""})`, footSites.length >= 3 && marginSites.length === 0, marginSites[0]?.split(" ")[0] ?? "src/components/spine/openings/openings-view.tsx", "give the openings view's own licence-link line pt-6 in place of its mt-6, as SourcesFoot has it, so the band paints the 24px under the last zone");
const css = readFileSync("src/app/globals.css", "utf8");
const band = /\[data-sources-foot\],\s*\[data-page-foot\]\s*\{([^}]*)\}/.exec(css)?.[1] ?? "";
const bandDecl = Object.fromEntries(band.split(";").map((d) => d.trim()).filter(Boolean).map((d) => [d.slice(0, d.indexOf(":")).trim(), d.slice(d.indexOf(":") + 1).trim()]));
const CSS_REMEDY = "in THE ZONES (src/app/globals.css) add `[data-sources-foot], [data-page-foot] { background: var(--zone-tint); border-image-source: conic-gradient(var(--zone-tint) 0 0); border-image-slice: 0 fill; border-image-width: 0; border-image-outset: 0 100vmax; }`, the zones' own bleed in the tint";
check("globals.css paints the foot lines as one band edge to edge with the zones' own bleed in the tint: background --zone-tint, a border image of the same colour (slice 0 fill, width 0) and a sideways outset of 100vmax, none above or below", bandDecl["background"] === "var(--zone-tint)" && bandDecl["border-image-source"] === "conic-gradient(var(--zone-tint) 0 0)" && bandDecl["border-image-slice"] === "0 fill" && bandDecl["border-image-width"] === "0" && bandDecl["border-image-outset"] === "0 100vmax", "src/app/globals.css", CSS_REMEDY);
check("the band is written in longhand and carries no `//`: the production build's CSS minimizer parses as SCSS, where the border-image shorthand's \"fill 0 // 0 100vmax\" opens a line comment (\"Missed semicolon\", the first deploy of 2026-10-04)", band.length > 0 && !/border-image\s*:/.test(band) && !band.includes("//"), "src/app/globals.css", CSS_REMEDY);

const page = readFileSync("src/app/(site)/corrections/new/page.tsx", "utf8");
check("the correction page holds the one correction form, open", /<CorrectionForm[^>]*startOpen/.test(page));
check("and is never indexed", /index:\s*false/.test(page));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/page_foot: all pass");
