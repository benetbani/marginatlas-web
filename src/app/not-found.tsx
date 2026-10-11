/**
 * The site's 404, inside the site's chrome (plan 2026-10-10, the home reformed to ship, Task 1; the ship audit's 5.5).
 *
 * WHY IT DRAWS SiteChrome. This boundary sits above src/app/(site)/layout.tsx, and since 2026-08-09 the chrome is drawn per page,
 * so a 404 showed no wordmark, no search and no footer: a dead end with no way back but the browser's. Wrapped, it carries the bar,
 * the sheet and the footer every other page carries, and SiteChrome's <main> is its landmark (it drew a <main> of its own, sized
 * for a 3.5rem header that was not there).
 *
 * THE STATIC EXPORT. A previous version of this file (Phosphor barrel imports) triggered an ENOENT on .next/export/500.html during
 * static export, killing every Vercel deploy of commits 4348a23 + 4680afc + 34b9e61. SiteChrome imports no Phosphor barrel: the
 * newsletter bar takes its three icons from `@phosphor-icons/react/dist/ssr/<Icon>`, and tests/chrome/masthead.test.ts walks
 * SiteChrome's whole import graph and reds on a bare `@phosphor-icons/react`. SiteChrome is also already prerendered on every
 * (site) page of every green deploy, so wrapping this page in it adds no module the export has not built. Imports stay at three, the third
 * a leaf (src/lib/spine/door_look.ts: the doors' look, one set of constants read here, by Where to next and by the home's proof doors,
 * and importing nothing itself), and tests/chrome/masthead.test.ts holds both facts.
 */
import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";
import { DOOR_NAME } from "@/lib/spine/door_look";

/**
 * The 404 boundary nominates no canonical, and that is the point.
 *
 * Next injects `<meta name="robots" content="noindex">` on this boundary by
 * itself. What it does NOT do is stop the metadata inheriting down the tree per
 * top-level KEY, so with no `alternates` here every 404 on the site emitted the
 * root layout's `canonical: "/"` alongside that noindex. A noindex page
 * nominating the home page as its true self is the most contradictory pair of
 * instructions available, and it was pointed at the most valuable URL on the
 * domain, on every dead link, every mistyped slug, and every one of the many
 * two-segment place URLs that resolve to nothing.
 *
 * `canonical: null` clears the inherited value and resolves to no tag, leaving
 * one instruction standing. Same reasoning as (site)/saved, (site)/you and the
 * embed route.
 *
 * This file is a not-found boundary, not a page.tsx, so
 * scripts/verify_canonical_urls.ts does not scan it. The repair is here and the
 * limit is named in that gate's header.
 */
export const metadata = {
  title: "Not found | Margin Atlas",
  alternates: { canonical: null },
};

/* No counts in here, deliberately. "245 cities across the atlas" was wrong by seven, and a hardcoded total on the 404 page is the
   least likely number in the codebase to be revisited; each line says what the page holds without a number, so none can go stale.
   EVERY LINE TRUE (the ship audit's 5.5): the world map left the home on 2026-09-25 and the site has no glossary, so "Start from the
   world map on the homepage" and "Methodology, glossary, atlas guides" went. Each door's name is the one the bar, the sheet and the
   footer give the same page (src/lib/nav.ts, SiteChrome.tsx), and each line is its page's own description, shortened. */
const HATCHES = [
  { label: "Countries", desc: "Every country with a page, by continent", href: "/countries" },
  { label: "Cities", desc: "Every city with a page, on one map", href: "/cities" },
  { label: "Trades", desc: "Every trade with a page, by sector", href: "/industries" },
  { label: "Compare", desc: "One trade in up to three cities, side by side", href: "/compare" },
  { label: "Calculator", desc: "The sales you need to break even", href: "/calculator" },
  { label: "About the figures", desc: "How to read a figure, and where each comes from", href: "/about-data#reading" },
];

export default function NotFound() {
  return (
    <SiteChrome>
      <div className="pb-12 pt-10 md:pt-16">
        <p className="text-[length:var(--t-body)] text-[var(--c-muted)]">404</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--c-ink)]">
          Nothing at this address
        </h1>
        <p className="mt-3 text-[length:var(--t-lead)] text-[var(--c-ink2)]">Check the spelling, or start from one of these.</p>
        {/* THE DOORS: ROWS UNDER 640, CARDS FROM IT (critique pass 3, fix round D2, item P2.6). Two-up cards on a phone wrapped their lines to
            three and left 45 to 60px blank under the short ones, so under 640 the six doors are rows as Where to next draws its doors: one
            column, the name at Where to next's own 14 medium over its line (DOOR_NAME: the critique said 16 and the doors measure 14, fix round F1,
            group G7), the arrow at the edge, a hairline between rows and no box. From 640 they are the cards
            they were (two-up, three-up from 1024). At every width each door carries the arrow the home's proof doors carry (HomeProofs.tsx,
            DoorTitle: `&#8594;` at the body rung in ink2, aria-hidden), in the title row beside the name. */}
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {HATCHES.map((h) => (
            <li key={h.href} className="border-t border-[var(--c-border)] first:border-t-0 sm:border-t-0">
              <Link
                href={h.href}
                className="group block py-3 sm:h-full sm:rounded-[12px] sm:border sm:border-[var(--c-border)] sm:bg-white sm:p-5 sm:transition-colors sm:hover:border-[var(--c-ink2)]"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className={`${DOOR_NAME} text-[var(--c-ink)] group-hover:underline sm:text-[length:var(--t-lead)] sm:font-semibold sm:group-hover:no-underline`}>{h.label}</span>
                  <span aria-hidden className="shrink-0 text-[length:var(--t-body)] leading-5 text-[var(--c-ink2)]">&#8594;</span>
                </span>
                <span className="mt-1 block text-balance text-[length:var(--t-body)] text-[var(--c-ink2)]">{h.desc}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SiteChrome>
  );
}
