/**
 * THE MASTHEAD, PUBLISHING READY (plan docs/superpowers/plans/2026-10-10-home-reform, Task 1, in the design repo; the spec
 * docs/superpowers/specs/2026-10-10-home-reform-design.md, decisions 4 to 6 and section 3; the critique's section 5; the ship audit's
 * 1.1 to 1.14 and its menu spec, 1c). What every page's chrome holds:
 *   - a skip link first, landing on <main id="main" tabindex="-1">;
 *   - the bar: the wordmark, `<nav aria-label="Primary">` with the seven names of src/lib/nav.ts in order, the page being read marked
 *     `aria-current="page"` with a 2px ink underline, Search always in its slot (hidden and out of reach on the home until the picker
 *     leaves the screen), the account link and the Pricing pill only while their switches are on, nothing terracotta, 8px above and
 *     below its controls under 768 (the 60px bar) and 24px from;
 *   - the sheet under 1280: a constant "Menu" name with `aria-expanded`, its panel always in the document and `hidden` while shut, on
 *     the bar's column, its height capped to the viewport less the bar and scrollable, 48px rows in the spec's order (Search, the seven
 *     names, About the figures and Who runs this, then the account and Pricing rows only while on), closing on Escape with focus back
 *     on the toggle, on a tap outside, on a row, and when the window reaches 1280; the account entry of the bar and of the sheet reads
 *     the session ONCE between them (one client, one getUser, however many entries stand on the page) and, while it does, holds the
 *     width of the longer of its two words, Account, unseen (plan Task 7, amendment 8c; the Task 1 review's m2);
 *   - the footer: `<nav aria-label="Footer">`, its first column the same seven names, heads in sentence case, 44px rows on a phone,
 *     no version string, the year beside the publisher, Pricing only while the paywall is on; one name per destination across the bar,
 *     the sheet, the footer and the breadcrumbs (no page calls the trades' destination "Activities");
 *   - the height token by width (src/app/layout.tsx), the focus floor, scroll-padding-top, the one text red and the control-line
 *     token (src/app/globals.css); the 404 inside the chrome with true lines (src/app/not-found.tsx); no Phosphor barrel anywhere in
 *     SiteChrome's import graph (the 404's header records a static export killed by one);
 *   - no per-anchor offset that repeats the bar: a browser adds an element's scroll-margin-top to the page's scroll-padding-top (the
 *     bar's height and 8px of air), so src holds no numeric scroll-mt-<n>, no scroll-margin property other than zero, and no
 *     arbitrary scroll-mt-[...] but the ones OTHER_STICKY names for a second sticky element above the target (the legacy cell page's
 *     106px; the workshop, src/app/dev, is outside the rule).
 * HOW: SiteChrome rendered server-side, the switches set per render in process.env (src/lib/feature_flags.ts reads them at render, as
 * tests/legal/pro_legal.test.ts sets them) and the page's address handed in through Next's own pathname context; the sheet mounted in
 * jsdom and pressed. BLIND SPOT, stated: this reads classes and a mounted tree, never pixels: the bar's measured heights, the sheet's
 * scroll on a short screen and the ring's look are the browser gates' (plan Task 9). The anchor scan reads class names and
 * declarations as written: it cannot see a class assembled at run time or an offset a script adds, and it cannot tell a second
 * sticky element from a bar (the review of the page does). jsdom has no matchMedia; a stand-in answers.
 * Run: npx tsx tests/chrome/masthead.test.ts
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

/* React ships `act` in its development build only, and a build server sets NODE_ENV=production (tests/spine/setup_tiers_expand.test.ts
   records the deploy that cost); React reads the variable when it is first loaded, so it is set before the first import below. */
Object.assign(process.env, { NODE_ENV: "development" });

const RULE = "masthead";
const CHROME = "src/components/SiteChrome.tsx";
const SHEET = "src/components/MobileNav.tsx";
const NAVFILE = "src/lib/nav.ts";
const LAYOUT = "src/app/layout.tsx";
const CSS = "src/app/globals.css";
const NOT_FOUND = "src/app/not-found.tsx";
const REMEDY = "keep the chrome to the spec's section 3: the names from src/lib/nav.ts, Pricing and the account link only behind their switches, the skip link and <main id=\"main\">, the sheet's panel always in the document, the footer matched";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: at?.file ?? CHROME, detail: label, remedy: at?.remedy ?? REMEDY });
};
const code = (f: string) => stripCommentLines(readFileSync(f, "utf8").split("\n")).join("\n");
const WANT_NAMES = ["Countries", "Cities", "Trades", "Compare", "Tools", "Extremes", "Blog"];
const WANT_HREFS = ["/countries", "/cities", "/industries", "/compare", "/tools", "/extremes", "/blog"];

/* Every <a> in a stretch of markup: its href, its visible words (tags out), and its whole opening tag. */
type A = { href: string; text: string; tag: string };
const anchors = (html: string): A[] =>
  [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map((m) => ({
    href: /\bhref="([^"]*)"/.exec(m[1])?.[1] ?? "",
    text: m[2].replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/\s+/g, " ").trim(),
    tag: `<a${m[1]}>`,
  }));
/* The markup between an element's opening tag and the end of the element that opens with `open` (the first one after `from`). */
const slice = (html: string, open: RegExp, close: string): string => {
  const m = open.exec(html);
  if (!m) return "";
  const end = html.indexOf(close, m.index);
  return end < 0 ? html.slice(m.index) : html.slice(m.index, end + close.length);
};

async function main() {
  /* ---------------- 1. THE LIST, THE TOKEN, THE STYLESHEET, THE GRAPH (source) ---------------- */
  check(`${NAVFILE} exists`, existsSync(NAVFILE), { file: NAVFILE, remedy: "create src/lib/nav.ts with NAV, SHEET_TRUST and currentNav (plan Task 1)" });
  if (!existsSync(NAVFILE)) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  const { NAV, SHEET_TRUST, currentNav, HELD_COUNTRIES, NAV_IDLE, NAV_CURRENT, NAV_ENTRY, FREE_DATA, barFrom } = (await import("../../src/lib/nav")) as typeof import("../../src/lib/nav");
  check(`NAV is the seven names in the bar's order (${NAV.map((n) => n.label).join(", ")})`, JSON.stringify(NAV.map((n) => n.label)) === JSON.stringify(WANT_NAMES) && JSON.stringify(NAV.map((n) => n.href)) === JSON.stringify(WANT_HREFS), { file: NAVFILE });
  check(`the sheet's trust rows are About the figures and Who runs this (${SHEET_TRUST.map((n) => n.label).join(", ")})`, JSON.stringify(SHEET_TRUST) === JSON.stringify([{ href: "/about-data#reading", label: "About the figures" }, { href: "/about", label: "Who runs this" }]), { file: NAVFILE });
  const marks: Array<[string | null, string | null]> = [["/", null], [null, null], ["/blog/what-a-cafe-makes", "/blog"], ["/cities/london", "/cities"], ["/industries/restaurants", "/industries"], ["/gb", "/countries"], ["/gb/london", "/countries"], ["/gb/london/restaurants", "/countries"], ["/og", null], ["/zz", null], ["/uk", null], ["/about", null], ["/compare", "/compare"]];
  const wrongMarks = marks.filter(([p, want]) => currentNav(p) !== want).map(([p, want]) => `${p}: ${currentNav(p)} (want ${want})`);
  check(`currentNav marks the page's own name, a held country's pages Countries, the home and a code the site does not hold nothing${wrongMarks.length ? `: ${wrongMarks.join("; ")}` : ""}`, wrongMarks.length === 0, { file: NAVFILE, remedy: "mark Countries only for a first part that HELD_COUNTRIES holds (the 404 at /zz or /uk marks nothing)" });
  /* The list the mark reads is a copy of the middleware's (HELD_COUNTRIES in src/lib/routing/edge_not_found.ts, built from COUNTRIES), because the
     taxonomy module is client weight in the bar: this holds the two equal, both ways. */
  const { COUNTRIES } = (await import("../../src/lib/taxonomy")) as typeof import("../../src/lib/taxonomy");
  const wantHeld = COUNTRIES.map((c) => c.code.toLowerCase()).sort();
  const haveHeld = [...(HELD_COUNTRIES ?? [])].sort();
  const lacks = wantHeld.filter((c) => !haveHeld.includes(c));
  const extra = haveHeld.filter((c) => !wantHeld.includes(c));
  check(`the countries the bar knows are the site's own: HELD_COUNTRIES is the codes of COUNTRIES, lowercased (${wantHeld.length}${lacks.length ? `; missing ${lacks.join(" ")}` : ""}${extra.length ? `; not held ${extra.join(" ")}` : ""})`, wantHeld.length > 100 && lacks.length === 0 && extra.length === 0, { file: NAVFILE, remedy: "write the codes of COUNTRIES (src/lib/taxonomy.ts), lowercased, into HELD_COUNTRIES in src/lib/nav.ts; it is a copy because importing the taxonomy added 94 KB (22 KB gzipped) to the bar's client chunk" });
  /* A page is named as the bar names it (the Trades page was titled "All activities"). */
  const titleOf = (href: string): string => {
    const f = ["src/app/(site)", "src/app"].map((root) => `${root}${href}/page.tsx`).find((p) => existsSync(p));
    if (!f) return "";
    const src = code(f);
    const at = src.indexOf("export const metadata");
    return /\btitle:\s*"([^"]+)"/.exec(src.slice(at < 0 ? 0 : at))?.[1] ?? "";
  };
  const unnamed = NAV.filter((n) => !titleOf(n.href).toLowerCase().includes(n.label.toLowerCase())).map((n) => `${n.label} (${n.href}) is titled "${titleOf(n.href)}"`);
  check(`each name in the bar is in its own page's title${unnamed.length ? `: ${unnamed.join("; ")}` : ""}`, unnamed.length === 0, { file: NAVFILE, remedy: "title the page with the bar's name for it, as All countries and All cities are (the address stays)" });
  /* The two class strings that dress a name live in a module a server file may import. */
  const navLinksSrc = code("src/components/NavLinks.tsx");
  const headerAuthSrc = code("src/components/HeaderAuth.tsx");
  check("NAV_IDLE, NAV_CURRENT and NAV_ENTRY are exported from src/lib/nav.ts, no client file exports them, and the readers import them from there (HeaderAuth.tsx its NAV_ENTRY since item P2.7)", typeof NAV_IDLE === "string" && typeof NAV_CURRENT === "string" && !/export\s+const\s+NAV_(?:IDLE|CURRENT)\b/.test(navLinksSrc) && /import\s*\{[^}]*\bNAV_ENTRY\b[^}]*\}\s*from\s*"@\/lib\/nav"/.test(headerAuthSrc) && /import\s*\{[^}]*\bNAV_CURRENT\b[^}]*\}\s*from\s*"@\/lib\/nav"/.test(navLinksSrc), { file: "src/components/NavLinks.tsx", remedy: "move NAV_IDLE and NAV_CURRENT into src/lib/nav.ts and import them from there (a server file importing a constant from a \"use client\" file gets a reference, not the string)" });

  const layout = code(LAYOUT);
  check("the header height token reads 61px under 768 and 93px from (the 60px bar under its 1px rule)", /\[--atlas-header-h:61px\] md:\[--atlas-header-h:93px\]/.test(layout) && !/xl:\[--atlas-header-h/.test(layout), { file: LAYOUT, remedy: "set the <html> className token to [--atlas-header-h:61px] md:[--atlas-header-h:93px]" });
  const css = code(CSS);
  check("globals.css draws the focus floor: :focus-visible, 2px ink, 2px off", /:focus-visible\s*\{\s*outline:\s*2px solid var\(--c-ink\);\s*outline-offset:\s*2px;\s*\}/.test(css), { file: CSS });
  check("the black footer's ring is white", /footer\.bg-black :focus-visible\s*\{\s*outline-color:\s*white;\s*\}/.test(css), { file: CSS });
  check("the page scrolls a target clear of the bar with 8px of air under it: scroll-padding-top is the height token and 8px", /scroll-padding-top:\s*calc\(var\(--atlas-header-h\)\s*\+\s*8px\);/.test(css), { file: CSS, remedy: "set html { scroll-padding-top: calc(var(--atlas-header-h) + 8px); }: a jump lands clear of the bar's border, 8px below it, and not flush against it" });
  check("one text red: --terra-text is #991600, and #c2410c is nowhere in the stylesheet", /--terra-text:\s*#991600;/.test(css) && !/#c2410c/i.test(css), { file: CSS, remedy: "re-point --terra-text to #991600 and read it where #c2410c was written" });
  check("--control-line is #8f8f8b, a control's 3:1 edge", /--control-line:\s*#8f8f8b;/.test(css), { file: CSS });
  check("the bar's edge is --c-border", /\.atlas-glass-chrome\s*\{[^}]*border-bottom:\s*1px solid var\(--c-border\);/.test(css), { file: CSS });

  /* THE ANCHORS (fix round 1, group 1; widened in the closing cleanup of plan 2026-10-10, item 2). The scroll-padding-top above is the
     bar's whole height and 8px of air, and a browser ADDS an element's own scroll-margin-top to it, so an offset written before the
     page carried that padding lands every target a whole bar too low: about 189px from the top at 768 and up, where the bar ends at
     93. The scan named only the values the first fix round had removed (scroll-mt-20, 24, 28 and 32, and a stylesheet's 56px and up),
     so any other offset passed. Now: no numeric scroll-mt-<n> (nor the scroll-m-<n> and scroll-my-<n> that set the same top), no
     scroll-margin property with a value other than zero in a stylesheet, a style object or an arbitrary property, and an arbitrary
     scroll-mt-[...] only where OTHER_STICKY names its file and its value and the second sticky element it clears. The workshop
     (src/app/dev) and the v0 token sheet are outside the site and outside this rule. */
  const OFFSET_REMEDY = "the global scroll-padding-top clears the bar, so write no scroll-margin of your own; the one exception is an offset for a second sticky element, an arbitrary scroll-mt-[Npx] named with its file and the element it clears in OTHER_STICKY (tests/chrome/masthead.test.ts)";
  const OTHER_STICKY: Array<{ file: string; value: string; clears: string }> = [
    { file: "src/app/[country]/[geo]/[industry]/page.tsx", value: "106px", clears: "the legacy cell page's DimensionSwitcher, a second sticky bar of a data-driven height (the path does not serve while NEXT_PUBLIC_SPINE_REFORM_CELL is forced on)" },
  ];
  const NUMERIC_CLASS = /(?<![\w-])-?scroll-m[ty]?-(?!0(?![\w.]))\d+(?:\.\d+)?(?![\w-])/g;
  const ARBITRARY_CLASS = /(?<![\w-])-?scroll-m[ty]?-\[([^\]]*)\]/g;
  const MARGIN_PROPERTY = /(?<![\w-])(?:scroll-margin(?:-[a-z]+)*|scrollMargin(?:[A-Z][A-Za-z]*)?)\s*:\s*["']?([^;"'}\]\n,]*)/g;
  const ZERO = /^\s*(?:(?:0+(?:\.0+)?(?:px|rem|em|%|vh|vw)?|initial|unset)\s*)+$/i;
  /** Every offset a line writes: a numeric class, an arbitrary class (with its value), or a scroll-margin property that is not zero. */
  const offsetsIn = (line: string): Array<{ what: string; arbitrary?: string }> => {
    const found: Array<{ what: string; arbitrary?: string }> = [];
    for (const m of line.matchAll(NUMERIC_CLASS)) found.push({ what: m[0] });
    for (const m of line.matchAll(ARBITRARY_CLASS)) found.push({ what: m[0], arbitrary: m[1] });
    for (const m of line.matchAll(MARGIN_PROPERTY)) if (m[1].trim() !== "" && !ZERO.test(m[1])) found.push({ what: `${m[0].split(":")[0].trim()}: ${m[1].trim()}` });
    return found;
  };
  const srcFiles: string[] = [];
  const walkSrc = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = `${dir}/${e.name}`;
      if (e.isDirectory()) { if (p !== "src/app/dev") walkSrc(p); }
      else if (/\.(?:tsx?|jsx?|mjs|cjs|css|mdx)$/.test(e.name) && p !== "src/styles/v0-tokens.css") srcFiles.push(p);
    }
  };
  walkSrc("src");
  const offsetSites: Array<{ file: string; line: number; what: string }> = [];
  const allowed = OTHER_STICKY.map((o) => ({ ...o, written: 0 }));
  for (const f of srcFiles) {
    code(f).split("\n").forEach((l, i) => {
      for (const o of offsetsIn(l)) {
        const entry = o.arbitrary === undefined ? undefined : allowed.find((a) => a.file === f && a.value === o.arbitrary);
        if (entry) entry.written++;
        else offsetSites.push({ file: f, line: i + 1, what: o.what });
      }
    });
  }
  const offsetNames = (s: string) => offsetsIn(s).map((o) => o.what);
  check("the offset scan sees what it hunts: every numeric scroll-mt-<n> (16 and 40 as much as 24, inside a variant chain), the m and my siblings, an arbitrary one with its value, a scroll-margin property that is not zero in a stylesheet, a style object or an arbitrary property; and not a zero",
    offsetNames('class="lg:[&_[id]]:scroll-mt-24"').length === 1 && offsetNames('class="scroll-mt-16 lg:scroll-mt-40"').length === 2 && offsetNames('class="-scroll-mt-4 scroll-my-2 scroll-m-8"').length === 3 && offsetNames('class="scroll-mt-0 lg:scroll-mt-0 scroll-mt-px"').length === 0
    && offsetsIn('class="md:[&_[id]]:scroll-mt-[43px]"')[0]?.arbitrary === "43px" && offsetNames("scroll-margin-top: 78px;").length === 1 && offsetNames("scroll-margin: 0 0 12px;").length === 1 && offsetNames("scroll-margin-block-start: 6rem").length === 1
    && offsetNames("style={{ scrollMarginTop: 92 }}").length === 1 && offsetNames("style={{ scrollMarginBottom: '2rem' }}").length === 1 && offsetNames('class="[scroll-margin-top:96px]"').length === 1
    && offsetNames("scroll-margin-top: 0;").length === 0 && offsetNames("scroll-margin: 0px 0 0.0rem;").length === 0 && offsetNames("style={{ scrollMarginTop: 0 }}").length === 0 && offsetNames('class="[scroll-margin-top:0]"').length === 0,
    { file: process.argv[1] ?? CHROME, remedy: "keep NUMERIC_CLASS, ARBITRARY_CLASS and MARGIN_PROPERTY naming every scroll-mt-<n> but zero, an arbitrary one, and every scroll-margin property with a value other than zero, whole-word" });
  for (const s of offsetSites) red({ rule: RULE, file: s.file, line: s.line, detail: `${s.what} is a scroll offset the page's scroll-padding-top already supplies (it clears the bar), and not one OTHER_STICKY allows`, remedy: OFFSET_REMEDY });
  check(`no scroll offset in src beyond the second sticky elements' (${srcFiles.length} files read, ${offsetSites.length} sites${offsetSites.length ? ", listed above" : ""}, ${allowed.reduce((t, a) => t + a.written, 0)} allowed)`, srcFiles.length > 500 && offsetSites.length === 0, { file: offsetSites[0]?.file ?? "src", remedy: OFFSET_REMEDY });
  const gone = allowed.filter((a) => a.written === 0);
  check(`every offset OTHER_STICKY allows is still written (${allowed.length - gone.length} of ${allowed.length}${gone.length ? `; gone: ${gone.map((g) => `scroll-mt-[${g.value}] in ${g.file}`).join(", ")}` : ""})`, gone.length === 0, { file: process.argv[1] ?? CHROME, remedy: "delete the entry from OTHER_STICKY: the offset it allowed is no longer written" });

  /* THE TEXT RED IS READ, NEVER WRITTEN (fix round 1, group 2). --terra-text is the one text red (one line in globals.css moves it),
     so no file draws its shade as an rgb of its own: the map marker's focus ring wrote rgba(153,22,0,0.55) and a change of that one
     line would have left the ring behind. The token's hex (#991600) stays in src/lib/design-tokens.ts, the brand ramp's own copy. */
  const redWritten: Array<{ file: string; line: number }> = [];
  for (const f of srcFiles) code(f).split("\n").forEach((l, i) => { if (/rgba?\(\s*153\s*,\s*22\s*,\s*0\b/.test(l)) redWritten.push({ file: f, line: i + 1 }); });
  for (const s of redWritten) red({ rule: RULE, file: s.file, line: s.line, detail: "the text red's shade (153, 22, 0) is written out beside the token that holds it", remedy: "write it from the token: color-mix(in srgb, var(--terra-text) 55%, transparent), so one line in globals.css moves every use" });
  check(`the text red is read from --terra-text and not written as an rgb (${redWritten.length} written)`, redWritten.length === 0, { file: redWritten[0]?.file ?? "src", remedy: "write it from the token: color-mix(in srgb, var(--terra-text) 55%, transparent)" });

  /* ONE NAME FOR THE TRADES' DESTINATION, EVERYWHERE A PAGE SAYS IT (the closing cleanup of plan 2026-10-10, the home reformed to ship,
     item 4). The bar, the sheet and the footer call /industries "Trades" (src/lib/nav.ts), and two breadcrumbs still called it
     "Activities", as did the two on the across-cities page; the region's list of trades says it as its last crumb. No page draws a
     crumb or a link whose words are "Activities". BLIND SPOT: this reads text written in the markup, one word on its own, and cannot
     see a name built from a variable. */
  const activities: Array<{ file: string; line: number }> = [];
  for (const f of srcFiles) if (f.endsWith(".tsx")) code(f).split("\n").forEach((l, i) => { if (/>\s*Activities\s*</.test(l) || /^\s*Activities\s*$/.test(l)) activities.push({ file: f, line: i + 1 }); });
  for (const s of activities) red({ rule: RULE, file: s.file, line: s.line, detail: "a breadcrumb or a link calls the trades' page \"Activities\"; the bar, the sheet and the footer call it \"Trades\"", remedy: "say \"Trades\": one name per destination (src/lib/nav.ts)" });
  check(`no page calls the trades' destination "Activities" (${activities.length} sites${activities.length ? ", listed above" : ""})`, activities.length === 0, { file: activities[0]?.file ?? "src/app", remedy: "say \"Trades\": one name per destination (src/lib/nav.ts)" });

  /* The graph: every file SiteChrome reaches through src/, and each package it names. */
  const seen = new Set<string>();
  const pkgs = new Map<string, string>();
  const resolveLocal = (from: string, spec: string): string | null => {
    /* path.posix throughout: every path in the walk is spelled with forward slashes, whatever the platform (the walk's roots are). */
    const base = spec.startsWith("@/") ? path.posix.join("src", spec.slice(2)) : path.posix.join(path.posix.dirname(from), spec);
    for (const c of [base, `${base}.tsx`, `${base}.ts`, `${base}/index.tsx`, `${base}/index.ts`]) if (existsSync(c) && !c.endsWith("/") && path.posix.extname(c)) return c;
    return null;
  };
  const walk = (file: string) => {
    if (seen.has(file)) return;
    seen.add(file);
    for (const m of code(file).matchAll(/(?:import|export)\s[^"';]*?from\s*["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|^\s*import\s*["']([^"']+)["']/gm)) {
      const spec = m[1] ?? m[2] ?? m[3];
      if (spec.startsWith("@/") || spec.startsWith(".")) { const r = resolveLocal(file, spec); if (r) walk(r); }
      else if (!pkgs.has(spec)) pkgs.set(spec, file.replace(/\\/g, "/"));
    }
  };
  walk(CHROME);
  walk(NOT_FOUND);
  const barrel = [...pkgs].filter(([p]) => p === "@phosphor-icons/react");
  check(`no Phosphor barrel in SiteChrome's or the 404's import graph (${seen.size} files, ${pkgs.size} packages${barrel.length ? `; barrel from ${barrel[0][1]}` : ""})`, seen.size > 10 && barrel.length === 0, { file: barrel[0]?.[1] ?? CHROME, remedy: "import each icon from @phosphor-icons/react/dist/ssr/<Icon>, never the barrel (the 404's header: a barrel import killed the static export)" });
  /* One spelling per file: Windows joins with a backslash and a build server with a slash, and the walk began on a slash-spelled path, so
     a file reached by two routes was counted twice on Windows only (116 files here, 115 on Vercel). */
  const backslashed = [...seen].filter((f) => f.includes(path.win32.sep));
  check(`the import graph names each file once, spelled with forward slashes on every platform (${seen.size} files${backslashed.length ? `; ${backslashed.length} spelled with a backslash, e.g. ${backslashed[0]}` : ""})`, backslashed.length === 0, { file: process.argv[1] ?? CHROME, remedy: "join and split the walk's paths with path.posix in resolveLocal, so Windows and a build server count the same files" });
  const nf = code(NOT_FOUND);
  check("the 404 draws SiteChrome, imports nothing else but next/link, and no <main> of its own", /<SiteChrome>/.test(nf) && !/<main[\s>]/.test(nf) && [...nf.matchAll(/^import .* from "([^"]+)";$/gm)].map((m) => m[1]).sort().join(",") === "@/components/SiteChrome,next/link", { file: NOT_FOUND });

  /* ---------------- 2. THE CHROME, RENDERED (server, switches set per render) ---------------- */
  const React = (await import("react")).default;
  const { renderToStaticMarkup } = await import("react-dom/server");
  /* The site's files are written for Next's automatic JSX runtime and some name no React; this runner compiles JSX to
     React.createElement, so they read the React this file lends them (tests/legal/pro_legal.test.ts). */
  (globalThis as unknown as { React: typeof React }).React = React;
  const { PathnameContext } = await import("next/dist/shared/lib/hooks-client-context.shared-runtime");
  /* The account entry reads the session once through the Supabase browser client (HeaderAuth.tsx), which wants a project address, a key
     and a network. A stand-in goes into the module cache before HeaderAuth first loads, and its read settles when this test says so: no
     network and no secret, as the chain requires, and the moment "the session is being read" can be held still and looked at. The
     stand-in COUNTS what is asked of it (plan Task 7, amendment 8c): the bar's entry and the sheet's share one read, so one client and
     one getUser however many entries are on the page. HeaderAuth loads the client with import() since Task 7, so the stand-in is reached
     a moment after the first entry mounts: `until` waits for it. */
  let settleSession!: () => void;
  const sessionRead = new Promise<void>((resolve) => { settleSession = resolve; });
  const asked = { clients: 0, reads: 0, returned: 0 };
  const until = async (cond: () => boolean, ms = 5000): Promise<boolean> => {
    const t0 = Date.now();
    while (!cond() && Date.now() - t0 < ms) await new Promise((r) => setTimeout(r, 5));
    return cond();
  };
  const clientPath = require.resolve("../../src/lib/supabase/client");
  require.cache[clientPath] = {
    id: clientPath, filename: clientPath, loaded: true, children: [], paths: [],
    exports: {
      createSupabaseBrowserClient: () => {
        asked.clients++;
        return { auth: { getUser: async () => { asked.reads++; await sessionRead; asked.returned++; return { data: { user: null } }; } } };
      },
    },
  } as unknown as NodeJS.Module;
  const { SiteChrome } = await import("../../src/components/SiteChrome");
  const NotFound = (await import("../../src/app/not-found")).default;
  const render = (pathname: string, on: { auth: boolean; paywall: boolean }) => {
    process.env.NEXT_PUBLIC_AUTH_ENABLED = on.auth ? "1" : "";
    process.env.NEXT_PUBLIC_PAYWALL = on.paywall ? "1" : "";
    return renderToStaticMarkup(React.createElement(PathnameContext.Provider, { value: pathname }, React.createElement(SiteChrome, null, React.createElement("p", null, "The page."))));
  };
  const parts = (html: string) => {
    const header = slice(html, /<header\b/, "</header>");
    const sheet = slice(header, /<div id="site-menu"/, "</nav></div>");
    const bar = header.replace(sheet, "");
    return { header, sheet, bar, footer: slice(html, /<footer\b/, "</footer>"), main: /<main\b[^>]*>/.exec(html)?.[0] ?? "" };
  };
  const off = render("/", { auth: false, paywall: false });
  const offBlog = render("/blog/what-a-cafe-makes", { auth: false, paywall: false });
  const authOnly = render("/", { auth: true, paywall: false });
  const allOn = render("/blog/what-a-cafe-makes", { auth: true, paywall: true });
  const country = render("/gb/london/restaurants", { auth: false, paywall: false });
  process.env.NEXT_PUBLIC_AUTH_ENABLED = "";
  process.env.NEXT_PUBLIC_PAYWALL = "";
  const o = parts(off), b = parts(offBlog), a = parts(authOnly), p = parts(allOn), c = parts(country);

  /* The skip link and the landmark. */
  check("a skip link is the first thing in the chrome, to #main", /^<a href="#main"[^>]*>Skip to content<\/a>/.test(off));
  check(`<main> is the skip link's target: id="main", tabindex -1 (${o.main})`, /\bid="main"/.test(o.main) && /\btabindex="-1"/.test(o.main));

  /* The bar. */
  const primary = slice(o.bar, /<nav aria-label="Primary"/, "</nav>");
  const names = anchors(primary);
  check(`the bar's <nav aria-label="Primary"> holds the seven names in order, each a link (${names.map((n) => n.text).join(", ")})`, JSON.stringify(names.map((n) => n.text)) === JSON.stringify(WANT_NAMES) && JSON.stringify(names.map((n) => n.href)) === JSON.stringify(WANT_HREFS));
  check("the home marks no name current", !/aria-current/.test(o.bar));
  const blogLink = anchors(slice(b.bar, /<nav aria-label="Primary"/, "</nav>")).find((n) => n.href === "/blog");
  check("on /blog/x, Blog is the page being read: aria-current=\"page\", ink, a 2px ink underline 6px under", !!blogLink && /aria-current="page"/.test(blogLink.tag) && /decoration-2/.test(blogLink.tag) && /decoration-\[var\(--c-ink\)\]/.test(blogLink.tag) && /underline-offset-\[6px\]/.test(blogLink.tag) && (b.bar.match(/aria-current="page"/g) ?? []).length === 1);
  const countriesLink = anchors(slice(c.bar, /<nav aria-label="Primary"/, "</nav>")).find((n) => n.href === "/countries");
  check("on a country's page (/gb/london/restaurants), Countries is the page being read", !!countriesLink && /aria-current="page"/.test(countriesLink.tag));
  check("a name not current is --c-ink2 with an ink hover and a hairline underline, never terracotta", anchors(primary).every((n) => /text-\[var\(--c-ink2\)\]/.test(n.tag) && /hover:text-\[var\(--c-ink\)\]/.test(n.tag) && /hover:decoration-\[var\(--c-line-strong\)\]/.test(n.tag)));
  const barNoMark = o.bar.replace(/<a [^>]*aria-label="Margin Atlas home"[\s\S]*?<\/a>/, "");
  const pBarNoMark = p.bar.replace(/<a [^>]*aria-label="Margin Atlas home"[\s\S]*?<\/a>/, "");
  check("nothing in the bar is terracotta (the wordmark's red aside)", ![barNoMark, pBarNoMark].some((h) => /(?:text|bg|border|ring|decoration|fill|stroke)-atlas-\d|var\(--terra/.test(h)));
  const search = (h: string) => anchors(h).find((n) => n.href === "/search");
  const homeSearch = search(o.bar), blogSearch = search(b.bar);
  check("Search holds its slot on the home, unseen and out of reach: invisible, aria-hidden, tabindex -1", !!homeSearch && /\binvisible\b/.test(homeSearch.tag) && /aria-hidden="true"/.test(homeSearch.tag) && /tabindex="-1"/.test(homeSearch.tag));
  check("Search shows on every other page, a 44 by 44 target with no box", !!blogSearch && !/\binvisible\b|aria-hidden|tabindex/.test(blogSearch.tag) && /min-h-11/.test(blogSearch.tag) && /min-w-11/.test(blogSearch.tag) && !/\bborder\b/.test(blogSearch.tag));
  check("the bar's row is 8px above and below its controls under 768, 24px from (the 60px phone bar)", /<div class="max-w-content mx-auto px-6 py-2 md:py-6 /.test(o.header));
  /* AIR BETWEEN THE WORDMARK AND THE NAMES (plan 2026-10-10 Task 9). Photographed at 1280 with accounts and Pricing both on, the names at
     24px apart filled the bar's 1072px to the pixel and "Atlas" touched "Countries" (0px measured, 9px with "Sign in"); at 20 the names
     and the group leave 35px at the tightest. A pin on the two classes, not a measurement: this file runs no browser. */
  /* With any switch on the names keep 1280 (the pin the plan's Task 9 added); with both off they show from 1080 (item P2.8: below).
     THE PHONE'S TWO ICONS SIT TOGETHER (critique pass 2, fix round C2, item P2.6): Search and Menu stood 20px apart at 375, so the search
     floated between the wordmark and the menu; the group's gap is 4 under 768 (the two 44px targets together at the edge), 24 from 768
     and 20 from 1280, and the 12px a phone under 360 once took (max-[359px]:gap-3) is gone: 4 is narrower still. */
  check("the names stand 20px apart and the bar's items 20px from 1280, so the wordmark keeps air with accounts and Pricing both on", /<nav aria-label="Primary" class="hidden xl:flex items-center gap-5 /.test(a.bar) && /<div class="flex items-center gap-1 md:gap-6 xl:gap-5">/.test(o.header) && /<div class="flex items-center gap-1 md:gap-6 xl:gap-5">/.test(p.header), { file: "src/components/NavLinks.tsx", remedy: "keep the nav at gap-5 and SiteChrome's group at gap-1 md:gap-6 xl:gap-5: the wordmark, seven names at 24, Search, Account and the Pricing pill fill the bar's 1072px to the pixel" });
  check("the phone's two icons sit together: the bar's group is 4px apart under 768, and no 12px gap is left under 360", /<div class="flex items-center gap-1 md:gap-6 xl:gap-5">/.test(o.header) && !/max-\[359px\]:gap-3/.test(o.header), { file: CHROME, remedy: "SiteChrome's right group takes gap-1 md:gap-6 xl:gap-5 and nothing under 360" });
  /* THE SEVEN NAMES FROM 1080 WHILE BOTH SWITCHES ARE OFF (critique pass 2, fix round C2, item P2.8): between 1080 and 1279 a desktop reader
     met a hamburger. Measured in Chromium with the names forced in and the sheet's toggle out, the bar holds 166px of spare between the
     wordmark and the first name at 1080 (211 at 1280), so the names show from 1080 and the sheet hides from there while accounts and the
     paywall are both off; with either on the account entry and the Pricing pill need the room, so both keep 1280. ONE CONSTANT, read by the
     bar's names and the sheet (src/lib/nav.ts barFrom), as MobileNav's comment demands of the two breakpoints. */
  check("both switches off: the names show from 1080 and the sheet hides from 1080 (one constant, barFrom, says where)", /<nav aria-label="Primary" class="hidden min-\[1080px\]:flex items-center gap-5 /.test(o.bar) && /<div class="min-\[1080px\]:hidden">/.test(o.header) && !/\bxl:hidden\b/.test(o.header) && barFrom?.().px === 1080, { file: NAVFILE, remedy: "export barFrom() from src/lib/nav.ts: 1080 with accounts and the paywall both off, 1280 otherwise, and read it in NavLinks.tsx and MobileNav.tsx" });
  check("either switch on: the names keep 1280 and the sheet hides from 1280", /<nav aria-label="Primary" class="hidden xl:flex /.test(a.bar) && /<div class="xl:hidden">/.test(a.header) && /<nav aria-label="Primary" class="hidden xl:flex /.test(p.bar) && /<div class="xl:hidden">/.test(p.header) && !/min-\[1080px\]/.test(a.header + p.header), { file: NAVFILE });
  check("the bar's names and the sheet read the one constant and write no breakpoint of their own", /import\s*\{[^}]*\bbarFrom\b[^}]*\}\s*from\s*"@\/lib\/nav"/.test(navLinksSrc) && /import\s*\{[^}]*\bbarFrom\b[^}]*\}\s*from\s*"@\/lib\/nav"/.test(code(SHEET)) && !/min-width:\s*1[0-9]{3}px/.test(code(SHEET)) && !/\bxl:/.test(navLinksSrc) && !/\bxl:/.test(code(SHEET)), { file: SHEET, remedy: "NavLinks.tsx and MobileNav.tsx take their breakpoint classes and the sheet's media query from barFrom() in src/lib/nav.ts, and write no xl: or min-width of their own" });

  /* The switches. */
  const noPro = (h: string) => !/Pricing|href="\/pricing"/.test(h);
  const noAuth = (h: string) => !/Sign in|Account|href="\/signin"|href="\/account"/.test(h);
  check("switches off: nothing about Pro anywhere in the chrome (no Pricing in the bar, the sheet or the footer)", noPro(off) && noPro(offBlog));
  check("switches off: nothing about sign-in anywhere in the chrome", noAuth(off) && noAuth(offBlog));
  check("accounts on, paywall off: the account entry in the bar and the sheet, still no Pricing", /Sign in/.test(a.bar) && /Sign in/.test(a.sheet) && noPro(authOnly));
  /* A VISIBLE "SIGN IN" FROM THE FIRST PAINT (critique pass 2, fix round C2, item P2.7). Until the session was read the entry held the width
     of its longer word, "Account", unseen (plan Task 7, amendment 8c), which left about 110px blank between Search and Pricing on launch
     day's first paint, and "Sign in" is the first state for nearly every visitor. The entry now draws "Sign in", a live link to /signin, from
     the first paint and swaps to "Account" when the read says the reader is signed in. It stands in ink at weight 500 (NAV_ENTRY), so it
     does not read as an eighth name beside the seven in ink2. */
  const entry = anchors(a.bar).find((n) => n.href === "/signin");
  check("while the session is read the bar's entry is a visible Sign in link to /signin from 1280, in ink at weight 500, no invisible holder", !!entry && entry.text === "Sign in" && /hidden xl:inline-flex/.test(entry.tag) && /\bfont-medium\b/.test(entry.tag) && /text-\[var\(--c-ink\)\]/.test(entry.tag) && !/text-\[var\(--c-ink2\)\]/.test(entry.tag) && !/\binvisible\b|aria-hidden/.test(entry.tag) && typeof NAV_ENTRY === "string" && /\bfont-medium\b/.test(NAV_ENTRY ?? "") && /text-\[var\(--c-ink\)\]/.test(NAV_ENTRY ?? ""), { file: "src/components/HeaderAuth.tsx", remedy: "draw the entry as the Sign in link from the first paint, NAV_ENTRY (ink, weight 500, hairline underline on hover) from src/lib/nav.ts, and swap it to Account when the session read says signed in; no invisible holder" });
  const pill = anchors(p.bar).find((n) => n.href === "/pricing");
  check("paywall on: Pricing is the bar's ink pill, last, from 1280, ink2 on hover", !!pill && /bg-\[var\(--c-ink\)\]/.test(pill.tag) && /hover:bg-\[var\(--c-ink2\)\]/.test(pill.tag) && /xl:inline-flex/.test(pill.tag) && p.bar.lastIndexOf('href="/pricing"') > p.bar.lastIndexOf('href="/search"'));
  check("paywall on: Pricing in the footer, and the footer's line says each UK chapter opens free", anchors(p.footer).some((n) => n.href === "/pricing" && n.text === "Pricing") && /each UK chapter opens free/.test(p.footer));

  /* The sheet. */
  const toggle = /<button[^>]*aria-controls="site-menu"[^>]*>/.exec(o.header)?.[0] ?? "";
  check(`the sheet's toggle is named "Menu", constant, with aria-expanded (${toggle.slice(0, 90)})`, /aria-label="Menu"/.test(toggle) && /aria-expanded="false"/.test(toggle));
  const panel = /<div id="site-menu"[^>]*>/.exec(o.header)?.[0] ?? "";
  check("the sheet's panel is in the document while shut, hidden", /\bhidden=""/.test(panel));
  check("the panel's height is capped to the viewport less the bar, and it scrolls", /max-h-\[calc\(100dvh_-_var\(--atlas-header-h\)\)\]/.test(panel) && /overflow-y-auto/.test(panel) && /overscroll-contain/.test(panel));
  check("the sheet's rows stand on the bar's column (max-w-content), a labelled navigation", /<nav aria-label="Primary" class="mx-auto max-w-content px-6/.test(o.sheet));
  const rows = (h: string) => anchors(h).map((n) => n.text || (/>Sign in</.test(n.tag) ? "Sign in" : ""));
  const spanRows = (h: string) => [...h.matchAll(/<(?:a|span)\b[^>]*class="[^"]*min-h-12[^"]*"[^>]*>([^<]*)<\/(?:a|span)>/g)].map((m) => m[1].trim());
  const wantOff = ["Search", ...WANT_NAMES, "About the figures", "Who runs this"];
  check(`the sheet's rows, switches off: ${spanRows(o.sheet).join(", ")}`, JSON.stringify(spanRows(o.sheet)) === JSON.stringify(wantOff));
  /* The server's markup is drawn before the session is read, so the account row is the entry's first state, Sign in (critique pass 2,
     fix round C2, item P2.7); the mounted sheet below swaps it to Account if the read says the reader is signed in. */
  check(`the sheet's rows, both switches on: ${spanRows(p.sheet).join(", ")}`, JSON.stringify(spanRows(p.sheet)) === JSON.stringify([...wantOff, "Sign in", "Pricing"]));
  check("every row of the sheet is 48px (min-h-12)", rows(o.sheet).length === wantOff.length && anchors(o.sheet).every((n) => /min-h-12/.test(n.tag)));
  const sheetCountries = anchors(c.sheet).find((n) => n.href === "/countries");
  check("the sheet marks the page being read as the bar does: aria-current, ink, semibold, a 2px ink rule at the left", !!sheetCountries && /aria-current="page"/.test(sheetCountries.tag) && /border-\[var\(--c-ink\)\]/.test(sheetCountries.tag) && /font-semibold/.test(sheetCountries.tag) && /border-l-2/.test(sheetCountries.tag));

  /* The footer. */
  const footNav = slice(o.footer, /<nav aria-label="Footer"/, "</nav>");
  check("the footer's links are a navigation named Footer", footNav.length > 0);
  const footFirst = anchors(slice(footNav, /<div><div class="mb-3 text-sm font-semibold text-white">Browse<\/div>/, "</ul>"));
  check(`the footer's first column is the bar's seven names (${footFirst.map((n) => n.text).join(", ")})`, JSON.stringify(footFirst.map((n) => n.text)) === JSON.stringify(WANT_NAMES) && JSON.stringify(footFirst.map((n) => n.href)) === JSON.stringify(WANT_HREFS));
  check("the footer's heads are sentence case at 14 semibold white, no tracked capitals", !/uppercase|tracking-wide/.test(o.footer) && (o.footer.match(/class="mb-3 text-sm font-semibold text-white"/g) ?? []).length === 4);
  check("every footer row is 44px tall on a phone", anchors(footNav).length > 0 && anchors(footNav).every((n) => /min-h-11/.test(n.tag) && /md:min-h-0/.test(n.tag)));
  check("no version string in the footer", !/\bv\d+\.\d+\.\d+\b/.test(o.footer));
  check(`the year stands beside the publisher (© ${new Date().getFullYear()} Tesseract Research)`, o.footer.includes(`© ${new Date().getFullYear()} Tesseract Research`));
  check("the footer still leads to /about, /corrections and /data (about-page's rule)", ["/about", "/corrections", "/data"].every((h) => anchors(footNav).some((n) => n.href === h)));
  /* ONE NAME FOR THE FREE DATA, FOOTER AND HOME (critique pass 2, fix round C2, item P2.5): /data was "Free UK data" on the home's Where to
     next and "Free data" in the footer. The name lives once in src/lib/nav.ts (FREE_DATA, "Free UK data": the page's own description
     says the downloads are the UK tables), the footer reads it and the home's door reads it, so neither can drift. */
  const { nextDoors } = (await import("../../src/lib/home/next_doors")) as typeof import("../../src/lib/home/next_doors");
  const dataDoor = nextDoors("/").find((d) => d.href === "/data");
  const dataFoot = anchors(footNav).find((n) => n.href === "/data");
  check(`/data has one name, ${FREE_DATA?.label ?? "(none held)"}: the footer says "${dataFoot?.text}", the home's door "${dataDoor?.label}"`, !!FREE_DATA && FREE_DATA.href === "/data" && dataFoot?.text === FREE_DATA.label && dataDoor?.label === FREE_DATA.label && !/>Free data</.test(o.footer), { file: NAVFILE, remedy: "export FREE_DATA from src/lib/nav.ts and read its label in SiteChrome's footer and in nextDoors (src/lib/home/next_doors.ts); COPY.home.next.doors holds no name for /data" });

  /* One name per destination, across the bar, the sheet and the footer, with every switch on. */
  const named = new Map<string, Set<string>>();
  for (const n of anchors(p.header + p.footer)) { if (!n.text || n.href.startsWith("#")) continue; (named.get(n.href) ?? named.set(n.href, new Set()).get(n.href)!).add(n.text); }
  const twice = [...named].filter(([, s]) => s.size > 1).map(([h, s]) => `${h}: ${[...s].join(" / ")}`);
  check(`one name per destination across the bar, the sheet and the footer${twice.length ? `: ${twice.join("; ")}` : ""}`, named.size > 15 && twice.length === 0);

  /* The 404. */
  process.env.NEXT_PUBLIC_AUTH_ENABLED = "";
  process.env.NEXT_PUBLIC_PAYWALL = "";
  const nfHtml = renderToStaticMarkup(React.createElement(PathnameContext.Provider, { value: "/zz" }, React.createElement(NotFound)));
  check("the 404 carries the bar, the footer and one <main id=\"main\">", /<header\b/.test(nfHtml) && /<footer\b/.test(nfHtml) && (nfHtml.match(/<main\b/g) ?? []).length === 1 && /<main id="main"/.test(nfHtml), { file: NOT_FOUND });
  const nfMain = slice(nfHtml, /<main\b/, "</main>");
  check("the 404's doors carry the bar's names and true lines (no world map, no glossary)", ["Countries", "Cities", "Trades", "Compare", "Calculator", "About the figures"].every((t) => anchors(nfMain).some((n) => n.text.startsWith(t))) && !/world map|glossary|knowledge base|activit/i.test(nfMain), { file: NOT_FOUND });
  check("the 404 has one h1", (nfHtml.match(/<h1\b/g) ?? []).length === 1, { file: NOT_FOUND });

  /* ---------------- 3. THE SHEET, PRESSED (jsdom) ---------------- */
  const { JSDOM } = await import("jsdom");
  const dom = new JSDOM("<!doctype html><html><body><p id='outside'>Outside</p><div id='root'></div></body></html>", { pretendToBeVisual: true, url: "https://www.marginatlas.com/blog/x" });
  const g = globalThis as unknown as Record<string, unknown>;
  g.window = dom.window;
  g.document = dom.window.document;
  g.self = dom.window;
  Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
  g.IS_REACT_ACT_ENVIRONMENT = true;
  /* jsdom has no matchMedia: a stand-in whose width the test sets, and whose listeners it fires. */
  const listeners = new Set<() => void>();
  let wide = false;
  const mediaAsked: string[] = [];
  (dom.window as unknown as { matchMedia: (q: string) => unknown }).matchMedia = (q: string) => ({
    media: q,
    get matches() { return q === "(min-width: 1280px)" || q === "(min-width: 1080px)" ? wide : false; },
    addEventListener: (_: string, f: () => void) => { mediaAsked.push(q); listeners.add(f); },
    removeEventListener: (_: string, f: () => void) => listeners.delete(f),
  });
  /* A row's click must not navigate jsdom: the capture listener prevents the default, the row's own onClick still runs. */
  dom.window.document.addEventListener("click", (e) => e.preventDefault(), true);
  const { createRoot } = await import("react-dom/client");
  const { act } = await import("react");
  const { MobileNav } = await import("../../src/components/MobileNav");
  const root = createRoot(dom.window.document.getElementById("root")!);
  process.env.NEXT_PUBLIC_AUTH_ENABLED = "";
  await act(async () => { root.render(React.createElement(PathnameContext.Provider, { value: "/blog/x" }, React.createElement(MobileNav, { pricing: true }))); });
  const doc = dom.window.document;
  const btn = doc.querySelector('button[aria-controls="site-menu"]') as HTMLButtonElement | null;
  const pane = () => doc.getElementById("site-menu");
  const isOpen = () => !!pane() && !pane()!.hasAttribute("hidden") && btn?.getAttribute("aria-expanded") === "true";
  const openIt = async () => { await act(async () => { btn!.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); }); };
  check("mounted, the sheet starts shut, its panel in the document", !!btn && !!pane() && !isOpen(), { file: SHEET });
  if (btn) {
    await openIt();
    check("a press on the toggle opens it (aria-expanded true, the panel shown); its name stays Menu", isOpen() && btn.getAttribute("aria-label") === "Menu", { file: SHEET });
    const rowsShown = [...pane()!.querySelectorAll("a")].map((x) => (x.textContent ?? "").trim());
    check(`open, the rows are the spec's, Pricing last behind its switch (${rowsShown.join(", ")})`, JSON.stringify(rowsShown) === JSON.stringify([...wantOff, "Pricing"]), { file: SHEET });
    (pane()!.querySelector("a") as HTMLAnchorElement).focus();
    await act(async () => { doc.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })); });
    check("Escape shuts it and puts focus back on the toggle", !isOpen() && doc.activeElement === btn, { file: SHEET });
    await openIt();
    await act(async () => { doc.getElementById("outside")!.dispatchEvent(new dom.window.Event("pointerdown", { bubbles: true })); });
    check("a tap outside shuts it", !isOpen(), { file: SHEET });
    await openIt();
    await act(async () => { wide = true; for (const f of [...listeners]) f(); });
    check(`the window reaching the bar's width shuts it: 1080 while both switches are off (it listened for ${mediaAsked.join(", ") || "nothing"})`, !isOpen() && mediaAsked.length > 0 && mediaAsked.every((q) => q === "(min-width: 1080px)"), { file: SHEET, remedy: "MobileNav closes the sheet on the media query barFrom() names (src/lib/nav.ts): 1080 with accounts and the paywall off, 1280 otherwise" });
    wide = false;
    await openIt();
    await act(async () => { (pane()!.querySelectorAll("a")[3] as HTMLAnchorElement).dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, cancelable: true })); });
    check("a row's tap shuts it", !isOpen(), { file: SHEET });
  }
  await act(async () => { root.unmount(); });

  /* ---------------- 3b. THE SHEET WITH ACCOUNTS ON (fix round 1, group 2; the one session read, plan Task 7, amendment 8c) ---------------- */
  /* The first mount had accounts off. With them on the sheet draws the entry in two steps: while the session is read it holds the words'
     width unseen, and once the read settles it is a live /signin row; the order is Sign in, then Pricing last; a tap on it shuts the sheet.
     The bar's entry is mounted beside the sheet, as SiteChrome draws them, so the two ask together: the stand-in counts one client and
     one getUser between them, and both entries turn live on the one answer. */
  process.env.NEXT_PUBLIC_AUTH_ENABLED = "1";
  const { HeaderAuth } = await import("../../src/components/HeaderAuth");
  const root2 = createRoot(doc.getElementById("root")!);
  await act(async () => { root2.render(React.createElement(PathnameContext.Provider, { value: "/blog/x" }, React.createElement(React.Fragment, null, React.createElement(HeaderAuth), React.createElement(MobileNav, { pricing: true })))); });
  const btn2 = doc.querySelector('button[aria-controls="site-menu"]') as HTMLButtonElement | null;
  const isOpen2 = () => !!pane() && !pane()!.hasAttribute("hidden") && btn2?.getAttribute("aria-expanded") === "true";
  check("accounts on, mounted: the sheet starts shut", !!btn2 && !!pane() && !isOpen2(), { file: SHEET });
  if (btn2) {
    await act(async () => { btn2.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
    const linkRows = () => [...pane()!.querySelectorAll("a")].map((x) => (x.textContent ?? "").trim());
    const firstEntry = pane()!.querySelector('a[href="/signin"]');
    check(`accounts on, the session not read yet: the sheet's entry is already the visible Sign in link, no unseen holder and no Account (${linkRows().join(", ")})`, isOpen2() && !!firstEntry && (firstEntry.textContent ?? "").trim() === "Sign in" && !pane()!.querySelector('span[aria-hidden="true"]') && !pane()!.querySelector('a[href="/account"]'), { file: SHEET });
    const barEntry = [...doc.querySelectorAll('a[href="/signin"]')].filter((x) => !pane()!.contains(x));
    const barEntryClass = barEntry[0]?.getAttribute("class") ?? "";
    check(`accounts on, the session not read yet: the bar's entry is the Sign in link too, in ink at weight 500, nothing invisible (${barEntry.length} outside the sheet)`, barEntry.length === 1 && (barEntry[0].textContent ?? "").trim() === "Sign in" && /\bfont-medium\b/.test(barEntryClass) && /text-\[var\(--c-ink\)\]/.test(barEntryClass) && !/\binvisible\b/.test(barEntryClass) && !doc.querySelector('span[aria-hidden="true"].invisible'), { file: "src/components/HeaderAuth.tsx" });
    const reached = await until(() => asked.reads > 0);
    check(`accounts on, the first entry to ask loads the auth client with import() and starts the read (client ${asked.clients}, getUser ${asked.reads})`, reached && asked.clients === 1 && asked.reads === 1, { file: "src/components/HeaderAuth.tsx", remedy: "load @/lib/supabase/client with await import() inside the shared readSession(), once" });
    await act(async () => { settleSession(); await until(() => asked.returned > 0); for (let i = 0; i < 12; i++) await Promise.resolve(); });
    const signIn = pane()!.querySelector('a[href="/signin"]') as HTMLAnchorElement | null;
    check(`accounts on, the session read, signed out: the entry stays the one Sign in row, no second row and no change (${linkRows().join(", ")})`, !!signIn && (signIn.textContent ?? "").trim() === "Sign in" && signIn === firstEntry && !pane()!.querySelector('span[aria-hidden="true"]') && linkRows().filter((t) => t === "Sign in").length === 1, { file: SHEET });
    check(`accounts on, the bar's entry and the sheet's share ONE session read: one client, one getUser, two live /signin links (client ${asked.clients}, getUser ${asked.reads}, links ${doc.querySelectorAll('a[href="/signin"]').length})`, asked.clients === 1 && asked.reads === 1 && doc.querySelectorAll('a[href="/signin"]').length === 2, { file: "src/components/HeaderAuth.tsx", remedy: "read the session once for every entry on the page: a module-level promise that the first entry starts and the rest take (readSession in HeaderAuth.tsx)" });
    check("accounts on, the order is the spec's: Sign in, then Pricing last", JSON.stringify(linkRows()) === JSON.stringify([...wantOff, "Sign in", "Pricing"]), { file: SHEET });
    if (signIn) await act(async () => { signIn.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, cancelable: true })); });
    check("a tap on the Sign in row shuts the sheet", !isOpen2(), { file: SHEET });
  }
  await act(async () => { root2.unmount(); });
  process.env.NEXT_PUBLIC_AUTH_ENABLED = "";

  /* ---------------- 3c. A SIGNED-IN READER (critique pass 2, fix round C2, item P2.7) ---------------- */
  /* The entry's first state is Sign in for everyone (the first paint is server markup and holds nothing of the reader); when the read says
     the reader is signed in it is Account, a link to /account, and Sign in is gone. The session read is a module-level promise, answered
     once per page (3b above answered it signed out), so the signed-in state is drawn the way the chrome render of the owner's photographs
     draws one state of the real component: the entry's own useState(null) answered with true (HeaderAuth.tsx useAuthState). */
  process.env.NEXT_PUBLIC_AUTH_ENABLED = "1";
  const R = require("react") as { useState: unknown };
  const realUseState = R.useState;
  R.useState = ((init: unknown) => (init === null ? [true, () => {}] : (realUseState as (i: unknown) => unknown)(init))) as unknown;
  const signedInHtml = renderToStaticMarkup(React.createElement(HeaderAuth));
  R.useState = realUseState;
  process.env.NEXT_PUBLIC_AUTH_ENABLED = "";
  const accountEntry = anchors(signedInHtml).find((n) => n.href === "/account");
  check("accounts on, the read says signed in: the entry is Account, a link to /account, in ink at weight 500 from 1280, and Sign in is gone", !!accountEntry && accountEntry.text === "Account" && /hidden xl:inline-flex/.test(accountEntry.tag) && /\bfont-medium\b/.test(accountEntry.tag) && /text-\[var\(--c-ink\)\]/.test(accountEntry.tag) && !/Sign in|href="\/signin"/.test(signedInHtml), { file: "src/components/HeaderAuth.tsx", remedy: "AuthLink draws the Account link at state in, with the same NAV_ENTRY class as the Sign in link" });

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("chrome/masthead: all pass");
}

main().catch((e) => {
  red({ rule: RULE, file: CHROME, detail: `the masthead test crashed: ${e instanceof Error ? e.message : String(e)}`, remedy: REMEDY });
  process.exit(1);
});
