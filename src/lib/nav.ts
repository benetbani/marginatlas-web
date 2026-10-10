/**
 * src/lib/nav.ts , THE SITE'S NAMES FOR ITS PLACES, HELD ONCE (plan 2026-10-10, the home reformed to ship, Task 1; the spec's
 * decision 5 and section 3, the critique's section 5). The masthead's bar (src/components/NavLinks.tsx), its sheet under 1280
 * (src/components/MobileNav.tsx) and the footer's first column (src/components/SiteChrome.tsx) read this list and no other, so a name
 * changes on one line and every place follows. The sheet used to say it was "kept in sync with layout.tsx" while the bar typed its
 * own list in SiteChrome.tsx (the ship audit's 1.12).
 *
 * The first three run in the picker's order: country, city, business. "Trades" names /industries, whose address is unchanged (no
 * URL is renamed). Pricing is not here: it joins the bar and the sheet only while the paywall is on, and Sign in or Account only
 * while accounts are on (src/lib/feature_flags.ts), so nothing about sign-in or Pro draws while its switch is off.
 *
 * A SERVER-SAFE MODULE, ON PURPOSE: the bar (NavLinks.tsx) and the sheet (MobileNav.tsx) are client files and SiteChrome.tsx is a
 * server file, and all three read from here. The two class strings that dress a name live here too, because a server file that
 * imported a constant from a "use client" file would receive a client reference, not the string.
 */
import { TOP_LEVEL_SEGMENTS } from "@/lib/routing/top_level_segments";

export type NavItem = { href: string; label: string };

/** A name that is not the page being read: --c-ink2, ink with a hairline underline on hover. HeaderAuth.tsx draws its link the same. */
export const NAV_IDLE =
  "text-[var(--c-ink2)] underline-offset-[6px] transition-colors hover:text-[var(--c-ink)] hover:underline hover:decoration-1 hover:decoration-[var(--c-line-strong)]";
/** The page being read: ink, a 2px ink underline 6px under the words. */
export const NAV_CURRENT = "text-[var(--c-ink)] underline decoration-2 decoration-[var(--c-ink)] underline-offset-[6px]";

/** The seven names, in the bar's order. */
export const NAV: readonly NavItem[] = [
  { href: "/countries", label: "Countries" },
  { href: "/cities", label: "Cities" },
  { href: "/industries", label: "Trades" },
  { href: "/compare", label: "Compare" },
  { href: "/tools", label: "Tools" },
  { href: "/extremes", label: "Extremes" },
  { href: "/blog", label: "Blog" },
];

/** The trust pages the sheet carries under the seven names, quieter: under 1280 the sheet is the only navigation, so the pages a
 *  doubting reader looks for first stand one tap away. Their names are the footer's (SiteChrome.tsx). */
export const SHEET_TRUST: readonly NavItem[] = [
  { href: "/about-data#reading", label: "About the figures" },
  { href: "/about", label: "Who runs this" },
];

/**
 * The countries the site holds, by their lowercase two-letter codes: the middleware's own set (HELD_COUNTRIES in
 * src/lib/routing/edge_not_found.ts, built from COUNTRIES in src/lib/taxonomy.ts). A COPY, written out here, because the bar is
 * client code on every page and importing the taxonomy module into it added 94 KB (22 KB gzipped) to that chunk, when measured with
 * esbuild on 2026-10-10; the list is under a kilobyte. tests/chrome/masthead.test.ts holds it equal to COUNTRIES, both ways, so
 * a country the site gains and a code it drops each red there with the remedy.
 */
export const HELD_COUNTRIES: ReadonlySet<string> = new Set(
  (
    "ad ae af ag al am ao ar at au az ba bb bd be bf bg bh bi bj bn bo br bs bt bw by bz ca cd cf cg ch ci cl cm cn " +
    "co cr cu cv cy cz de dj dk dm do dz ec ee eg es et fi fj fm fr ga gb gd ge gh gm gn gq gr gt gw gy hk hn hr ht " +
    "hu id ie il in iq ir is it jm jo jp ke kg kh ki km kn kr kw kz la lb lc li lk lr ls lt lu lv ly ma mc md me mg " +
    "mh mk ml mm mn mo mr mt mu mv mw mx my mz na ne ng ni nl no np nr nz om pa pe pg ph pk pl ps pt pw py qa ro rs " +
    "ru rw sa sb sc sd se sg si sk sl sm sn so sr st sv sy sz td tg th tj tl tm tn to tr tt tv tw tz ua ug us uy uz " +
    "vc ve vn vu ws xk ye za zm zw"
  ).split(" "),
);

/**
 * The address of the NAV item a page belongs to, or null. A page is its item's own address or one under it (/blog/x marks Blog,
 * /cities/london Cities, /industries/restaurants Trades). A country's pages (/gb, /gb/london/restaurants) mark Countries: a first
 * part that is a country the site holds and that no route folder or metadata file holds, the middleware's own test
 * (src/lib/routing/top_level_segments.ts; /og is two letters and is not a country). A code the site does not hold (the 404 at /zz or
 * /uk) marks nothing, and the home marks nothing.
 */
export function currentNav(pathname: string | null | undefined): string | null {
  if (!pathname || pathname === "/") return null;
  for (const item of NAV) if (pathname === item.href || pathname.startsWith(`${item.href}/`)) return item.href;
  const first = pathname.split("/")[1] ?? "";
  if (HELD_COUNTRIES.has(first) && !TOP_LEVEL_SEGMENTS.has(first)) return "/countries";
  return null;
}
