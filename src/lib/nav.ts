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
 */
import { TOP_LEVEL_SEGMENTS } from "@/lib/routing/top_level_segments";

export type NavItem = { href: string; label: string };

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
 * The address of the NAV item a page belongs to, or null. A page is its item's own address or one under it (/blog/x marks Blog,
 * /cities/london Cities, /industries/restaurants Trades). A country's pages (/gb, /gb/london/restaurants) mark Countries: a first
 * part of two letters that no route folder or metadata file holds is a country, the middleware's own test
 * (src/lib/routing/top_level_segments.ts; /og is two letters and is not one). The home marks nothing.
 */
export function currentNav(pathname: string | null | undefined): string | null {
  if (!pathname || pathname === "/") return null;
  for (const item of NAV) if (pathname === item.href || pathname.startsWith(`${item.href}/`)) return item.href;
  const first = pathname.split("/")[1] ?? "";
  if (/^[a-z]{2}$/.test(first) && !TOP_LEVEL_SEGMENTS.has(first)) return "/countries";
  return null;
}
