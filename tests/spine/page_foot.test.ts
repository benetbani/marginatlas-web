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
import { DepthNotify } from "../../src/components/spine/interact/DepthNotify";
import { ComboField } from "../../src/components/ComboField";
import { COPY } from "../../src/lib/spine/copy";
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
  /* Cambodia and Germany joined the harness list for the replicability test (plan 2026-10-13 country-page-journey, Task 1B). */
  { file: "country-KH", path: "/kh", dated: false },
  { file: "country-DE", path: "/de", dated: false },
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
const footSites = tsxUnder("src").flatMap((f) => [...stripCommentLines(readFileSync(f, "utf8").split("\n")).join("\n").matchAll(/<(?:p|form)\b[^>]*?\bdata-(sources|page)-foot\b[^>]*?className="([^"]*)"/g)].map((m) => ({ file: f, hook: m[1], classes: m[2].split(" ") })));
const marginSites = footSites.filter((s) => !noMargin(s.classes)).map((s) => `${s.file} (${s.hook})`);
check(`every tag that carries a foot hook spaces itself with padding, never a margin (${footSites.length} sites: ${footSites.map((s) => s.file.split("/").pop()).join(", ")}${marginSites.length ? `; a margin on ${marginSites.join(", ")}` : ""})`, footSites.length >= 3 && marginSites.length === 0, marginSites[0]?.split(" ")[0] ?? "src/components/spine/openings/openings-view.tsx", "give the openings view's own licence-link line pt-6 in place of its mt-6, as SourcesFoot has it, so the band paints the 24px under the last zone");
/* THE THIN PAGE'S NOTIFY FORM IS IN THE BAND TOO (fix round F1, group G9; the D2 review's Minor 2). On a thin page DepthNotifyFoot follows the Report line, and its form stood on a
   margin (mt-6) on the column's own ground: the band ended above it, so below the Report line the grey narrowed back to the column for 24px and the form, the box with its edges
   showing that P2.5 had removed. The form and its "sent" line carry the same hook and pad themselves (the 24px that was the form's margin is padding now, and 24px under it
   as the Report line has under it), so the foot is one band from the last zone to the newsletter bar. The home's ask, the form with a place to choose, is a card's content and
   no foot, and takes no hook. The scan above reads <p> and <form> tags in any attribute order. BLIND SPOT: the idle form is read from its markup and the sent line from the
   source (it shows only after a post); the pixels are the round's probe's (scratchpad/home-reform/f1_g9_foot.mjs, a thin city page at 1280 and 375). */
const notifyWords = { ...COPY.depthNotify, label: COPY.depthNotify.label.replace("{place}", "Abidjan") };
const notifyIdle = renderToStaticMarkup(React.createElement(DepthNotify, { source: "depth:/cities/abidjan", words: notifyWords }));
const notifyChoices = renderToStaticMarkup(React.createElement(DepthNotify, { words: notifyWords, choices: [{ label: "London", source: "depth:/cities/london" }] }));
const notifyClasses = (/<form data-depth-notify="" data-page-foot="[^"]*"[^>]*class="([^"]*)"/.exec(notifyIdle)?.[1] ?? "").split(" ").filter(Boolean);
const notifySites = footSites.filter((s) => s.file.endsWith("DepthNotify.tsx"));
const NOTIFY_AT = { file: "src/components/spine/interact/DepthNotify.tsx", remedy: "give the thin page's form and its sent line data-page-foot with pt-6 pb-6 in place of mt-6, so the band that paints the licence and Report lines runs on under them to the newsletter bar; the form with `choices` (the home's ask) takes no hook" };
check(`the thin page's notify form is in the foot band: data-page-foot, pt-6 and pb-6 and no margin (${notifyClasses.filter((k) => /^(p[tb]|m[tb])-/.test(k)).join(" ") || "no hook found"}), and its sent line is another site of the hook (${notifySites.length} sites in DepthNotify.tsx)`, notifyClasses.includes("pt-6") && notifyClasses.includes("pb-6") && noMargin(notifyClasses) && notifySites.length === 2 && notifySites.every((s) => s.classes.includes("pt-6") && s.classes.includes("pb-6") && noMargin(s.classes)), NOTIFY_AT.file, NOTIFY_AT.remedy);
check("the home's ask (the form with a place to choose) is a card's content and takes no foot hook", notifyChoices.includes("data-depth-notify") && !notifyChoices.includes("data-page-foot"), NOTIFY_AT.file, NOTIFY_AT.remedy);
/* THE THIN PAGE'S FORM STACKS UNDER 640 (fix round F2, item F1-notify; the F1 report's concern 1 and the final review's M11). At 375 the address field shared a row with the label ("Notify me when
   Abidjan reaches this depth") and stood about 56px wide ("Your"), the button wrapping under it: a flex-1 item has a basis of 0, so it never forced a wrap. Under 640 the label has its
   row, the field its own (w-full, flex-none, so its basis is the whole row, and min-w-0, as the footer's newsletter bar keeps its field inside the screen at 320) and the button its own
   under it, as wide as the field; from 640 it is the row it was (sm:w-auto sm:flex-1 sm:max-w-xs, the button its own width). The home's ask already stacks. BLIND SPOT: this reads
   classes; the field's width at 320 and 375 is the browser's (scratchpad/home-reform/f2_notify_probe.mjs on a thin city page). */
const tagClass = (html: string, tag: "input" | "button" | "select") => (new RegExp(`<${tag}\\b[^>]*?class="([^"]*)"`).exec(html)?.[1] ?? "").split(" ").filter(Boolean);
const notifyField = tagClass(notifyIdle, "input"), notifyButton = tagClass(notifyIdle, "button");
check(`under 640 the thin page's field has a row of its own and the button its own under it, and from 640 they share the row as before (field: ${notifyField.filter((k) => /^(sm:)?(w-|flex-|max-w-|min-w-)/.test(k)).join(" ")}; button: ${notifyButton.filter((k) => /^(sm:)?w-/.test(k)).join(" ")})`, ["w-full", "flex-none", "min-w-0", "sm:w-auto", "sm:flex-1", "sm:max-w-xs"].every((k) => notifyField.includes(k)) && !notifyField.includes("flex-1") && ["w-full", "sm:w-auto"].every((k) => notifyButton.includes(k)), NOTIFY_AT.file, "under 640 give the thin page's address field w-full flex-none min-w-0 (its own row: a flex-1 item has a basis of 0 and shared the label's row at 56px) and the button w-full, and from 640 sm:w-auto sm:flex-1 sm:max-w-xs on the field and sm:w-auto on the button");
/* THE THIN PAGE'S FIELD AND ITS LABEL TAKE THE PICKER'S (fix round F3, item M13; the final review, part 3). Round F2 (P2.5) took /compare's Region select and /you's labels, select and revenue
   input to the picker's label and field; this form stayed on the old system on every thin city and trade page: its address field on the --c-border edge (1.29:1 on white, 1.19:1 on the foot band) in 14px type (iOS
   Safari zooms the page into a field under 16px), its placeholder at 2.54:1, and its label in the body ink. The field takes the field of that round (48px, the card's corner, the control token's 3:1
   edge, 16px under 768 and 14 from it, an ink hover) and, as an input with a placeholder, the placeholder that round gave /you's revenue input (muted, normal weight), with NO focus style of its
   own, so the floor in globals.css draws the 2px ink ring. The label takes the picker's own type, read from the rendered ComboField and not typed here, WITHOUT its mb-2 block: that pair stacks a
   label over a field, and this form lays itself out (a flex row from 640 with items-center, where the margin lifted the label's middle 4px above the field's, measured; stacked under 640 with
   gap-3, where it opened the label's gap to 20px from 12), so the label carries no margin and the form's gap places it. The layout classes round F2 gave the field stay (the check above reads
   them). BLIND SPOT: this reads class names in the markup; the edge's contrast, the 16px under 768, the label's middle against the field's and the ring on a Tab are the browser's
   (scratchpad/home-reform/f3_probe.mjs on a thin city page), and a class that a later rule overrode would read as present. */
const pickerLabel = /<label for="country" class="([^"]*)"/.exec(renderToStaticMarkup(React.createElement(ComboField, { id: "country", label: "Country", options: [{ value: "GB", label: "United Kingdom" }], value: "GB", onChange: () => {} })))?.[1] ?? "";
const pickerType = pickerLabel.split(" ").filter((k) => k && k !== "block" && !/^-?m[tbxylr]?-/.test(k));
const notifyLabel = (/<label for="depth-notify-email" class="([^"]*)"/.exec(notifyIdle)?.[1] ?? "").split(" ").filter(Boolean);
const labelFaults = [
  ...pickerType.filter((k) => !notifyLabel.includes(k)).map((k) => `lacks ${k}`),
  ...notifyLabel.filter((k) => /^-?m[tbxylr]?-|^text-\[length:|^text-\[var\(--c-ink\)\]$/.test(k)).map((k) => `has ${k}`),
];
check(`the thin page's label is the picker's own type, "${pickerType.join(" ")}", with no margin of its own, so the form's gap places it (${labelFaults.join("; ") || notifyLabel.join(" ")})`, pickerType.length >= 3 && labelFaults.length === 0, NOTIFY_AT.file, "give the thin page's <label htmlFor=\"depth-notify-email\"> the picker's label type, the class ComboField draws for its own (text-sm font-medium text-[var(--c-ink2)]) and not its mb-2 block, which stack a label over a field and misplace it in this form's row (4px above the field's middle from 640, a 20px gap for 12 under it): the form's own gap-3 and items-center place it");
const FIELD_TOKENS = ["h-12", "w-full", "rounded-xl", "border", "border-[var(--control-line)]", "bg-white", "px-4", "text-base", "font-medium", "md:text-sm", "text-[var(--c-ink)]", "hover:border-[var(--c-ink2)]", "placeholder:font-normal", "placeholder:text-[var(--c-muted)]"];
const fieldLacks = FIELD_TOKENS.filter((k) => !notifyField.includes(k)).map((k) => `lacks ${k}`);
const FAINT_FIELD = /^(?:focus|focus-visible|focus-within):|--c-border|--c-card|--t-body|^min-h-|^rounded-(?!xl$)|^px-(?!4$)/;
const fieldForeign = notifyField.filter((k) => FAINT_FIELD.test(k)).map((k) => `has ${k}`);
check(`the thin page's address field is the picker's field: 48px, the 12px corner, the control token's edge, 16px under 768 and 14 from it, an ink hover, the muted placeholder in normal weight, no focus style of its own and none of the faint field's classes (${[...fieldLacks, ...fieldForeign].join("; ") || `all ${FIELD_TOKENS.length}`})`, notifyField.length > 0 && fieldLacks.length === 0 && fieldForeign.length === 0, NOTIFY_AT.file, "give the thin page's address field the picker's field, h-12 w-full rounded-xl border border-[var(--control-line)] bg-white px-4 text-base font-medium text-[var(--c-ink)] transition-colors placeholder:font-normal placeholder:text-[var(--c-muted)] hover:border-[var(--c-ink2)] md:text-sm, then the form's own layout classes, with no focus: or focus-visible: class of its own (the floor in globals.css draws the 2px ink ring)");
/* THE BUTTON IS AS TALL AS THE FIELD, AND THE HOME'S ASK TAKES THE PICKER'S FIELD TOO (fix round F3, item M13, its second commit: the button and the home's ask, decided after the first commit's report). The first commit made the
   thin page's field 48px and left the button at min-h-11, 44px: in the row from 640 the button's edges stood 2px inside the field's, and stacked under 640 it was 4px short of the field (the picker's own button is h-12). The
   button takes min-h-12, the field's own 3rem, at every width, in the one `button` class both forms share. The home's ask, the form with a place to choose (drawn by HomeNewsletter on the live home), had its place list and its
   address on the shared faint field (the --c-border edge, 14px type, min-h-11): both take the picker's field as the thin page's address does, the place list without the placeholder pair (a select has no placeholder, as the
   sister forms' selects have none), no focus style of their own, so the floor draws the 2px ink ring; its labels keep their own type and spacing (the grid's gap-2). BLIND SPOT: this reads class names in the markup; that the
   heights agree and that the edge and the 16px under 768 hold are the browser's (scratchpad/home-reform/f3_probe.mjs on a thin city page, f3b_ask_probe.mjs on the ask). */
const choicesSelect = tagClass(notifyChoices, "select"), choicesInput = tagClass(notifyChoices, "input"), choicesButton = tagClass(notifyChoices, "button");
const heightTokens = (c: string[]) => c.filter((k) => /^(?:min-)?h-\d/.test(k)).join(" ") || "none";
check(`the button is as tall as the field, the field's own 3rem, at every width: the thin page's field ${heightTokens(notifyField)}, its button ${heightTokens(notifyButton)}, the home's ask's field ${heightTokens(choicesInput)} and button ${heightTokens(choicesButton)}`, notifyField.includes("h-12") && choicesInput.includes("h-12") && [notifyButton, choicesButton].every((c) => c.includes("min-h-12") && !c.includes("min-h-11")), NOTIFY_AT.file, "give the notify forms' button min-h-12 in place of min-h-11 (the one `button` class both forms share), the height of the picker's field (h-12, 48px): at min-h-11 it stood 2px inside the field's edges in the row and 4px short of it stacked");
const asked: Array<[string, string[], string[]]> = [["place list", choicesSelect, FIELD_TOKENS.filter((k) => !k.startsWith("placeholder:"))], ["address", choicesInput, FIELD_TOKENS]];
const askFaults = asked.flatMap(([who, cls, want]) => [...want.filter((k) => !cls.includes(k)).map((k) => `${who} lacks ${k}`), ...cls.filter((k) => FAINT_FIELD.test(k)).map((k) => `${who} has ${k}`)]);
check(`the home's ask takes the picker's field on its place list and its address: 48px, the 12px corner, the control token's edge, 16px under 768 and 14 from it, an ink hover, the address's placeholder muted in normal weight, no focus style of its own and none of the faint field's classes (${askFaults.join("; ") || "both"})`, choicesSelect.length > 0 && choicesInput.length > 0 && askFaults.length === 0, NOTIFY_AT.file, "give the select and the address input of the form with a place to choose (the choices branch of src/components/spine/interact/DepthNotify.tsx) the picker's field, h-12 w-full min-w-0 rounded-xl border border-[var(--control-line)] bg-white px-4 text-base font-medium text-[var(--c-ink)] transition-colors hover:border-[var(--c-ink2)] md:text-sm, and the address input the placeholder pair (placeholder:font-normal placeholder:text-[var(--c-muted)]), with no focus: class of their own");
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
