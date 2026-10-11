/**
 * src/components/SiteChrome.tsx
 *
 * The site masthead, the readable-column <main>, the newsletter bar, the footer
 * and the watch tray , everything that used to sit directly in the root layout
 * and therefore wrapped every route unconditionally.
 *
 * WHY IT MOVED OUT OF THE LAYOUT.
 *
 * The spine-2 trade page carries its own masthead, breadcrumb and footer. Inside
 * the site chrome that produced two brand lockups stacked (206px, 24% of a 390px
 * viewport, before the first rendered word), two unlabelled navigations, four
 * font families of which two never render v2 content, a skyline that cannot be
 * full-bleed because <main> boxes it, and a watch-tray pill that paints over the
 * page's own chapter pill.
 *
 * It could not be fixed with a route group alone, and that is the crux. ONE URL
 * , /[country]/[geo]/[industry] , serves three different renders chosen at
 * REQUEST TIME by data: a spine-2 page when a reconciled cell file exists, a
 * neighborhood overview when the segment matches a known neighborhood, and the
 * legacy cell page otherwise. App Router layouts are keyed by PATH, not by data,
 * so no group, nested layout or parallel route can express that split. Reading
 * the path in the root layout via headers() would work and would make the root
 * layout dynamic, opting every route out of static rendering and destroying the
 * prerender for hundreds of pages.
 *
 * So the chrome stops being a layout and becomes a component a page renders.
 * Routes that want it live under src/app/(site)/, whose layout renders this. The
 * [country] tree stays outside that group and opts in per page, because it is a
 * single dynamic tree holding both the routes that need chrome and the one
 * branch that must not have it.
 *
 * THE MARKUP WAS LIFTED from the previous root layout by a script rather than
 * retyped, because retyping it by hand produced an invented footer on the first
 * attempt. It was changed on purpose once since, when the masthead was reformed
 * to ship (plan 2026-10-10, Task 1; the spec's section 3, the critique's section
 * 5, the ship audit's 1c), and each change says why where it stands: a skip link
 * first; the seven names from one list (src/lib/nav.ts), the page being read
 * marked; Search always shown, the home from its first paint; the account link and the Pricing pill only
 * behind their switches; a 60px bar on a phone; nothing terracotta in the bar;
 * the footer's names, heads and rows matched to the bar's.
 */
import Link from "next/link";
import { FooterNewsletterBar } from "@/components/newsletter/NewsletterSignupVariants";
import { HeaderAuth } from "@/components/HeaderAuth";
import { HeaderSearch } from "@/components/HeaderSearch";
import { NavLinks } from "@/components/NavLinks";
import { AtlasFrame } from "@/components/AtlasFrame";
import { LogoWordmark } from "@/components/brand/LogoWordmark";
import { PhoneLockup } from "@/components/brand/PhoneLockup";
import { MobileNav } from "@/components/MobileNav";
/* THE MODULE THAT HOLDS THE EXPORT, NOT THE KIT'S BARREL (plan 2026-10-10, Task 7, amendment 8a): see the same line in src/app/layout.tsx.
   Through the barrel this file shipped every client module of the kit to every page that draws the chrome, ProfileChip among them,
   and with it (until fix round 7) the taxonomy and industries.json. */
import { WatchTray } from "@/components/kit/WatchTray";
import { isAuthEnabled, isWarmFrameEnabled, isPaywallOn } from "@/lib/feature_flags";
import { FREE_DATA, GUTTER, NAV, PRICING_LOOK } from "@/lib/nav";

/** The skip link: visually hidden until it takes focus, then an ink pill over the bar's corner (the site's focus floor rings it). */
const SKIP =
  "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-2 focus:z-toast focus:rounded-full focus:bg-[var(--c-ink)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white";
/** Pricing while the paywall is on: the bar's one ink pill, last, from 1280; ink2 on hover (7.36:1 with white), never terracotta. Its look is
 *  PRICING_LOOK (src/lib/nav.ts), which the sheet's Pricing row draws too (critique pass 3, fix round D2, item P2.10); only the display is
 *  the bar's own, hidden under 1280 where the sheet takes over. */
const PRICING_PILL = `tap hidden xl:inline-flex ${PRICING_LOOK}`;
/** A footer column's head: sentence case, 14 semibold white (it was 12px tracked capitals, which read as texture). */
const FOOT_HEAD = "mb-3 text-sm font-semibold text-white";
/** A footer column's rows: 44px tall on a phone, the type's own height from 768. */
const FOOT_LIST = "md:space-y-2";
const FOOT_LINK = "flex min-h-11 items-center transition-colors hover:text-white hover:underline md:inline-flex md:min-h-0";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  // Warm frame (R6 Phase B): the glass chrome class on the sticky header swaps
  // in only when the frame is on; the gutters render themselves (no-op when
  // off). With the flag off the header keeps its white bar and its hairline, the
  // spine's --c-border (it was the parchment grey).
  const warmFrame = isWarmFrameEnabled();
  const headerClass = warmFrame
    ? "atlas-glass-chrome sticky top-0 z-raised"
    : "bg-white border-b border-[var(--c-border)] sticky top-0 z-raised";
  const authOn = isAuthEnabled();
  const paywallOn = isPaywallOn();
  return (
    <>
        {/* SKIP TO CONTENT, FIRST IN THE DOCUMENT (the ship audit's 1.4; WCAG 2.4.1): at 1280 a keyboard met the wordmark and
            the seven names before the first word of the page. It lands on <main id="main">, below. */}
        <a href="#main" className={SKIP}>
          Skip to content
        </a>
        {/* THE SITE-WIDE ATMOSPHERE, mounted here because this is the one
            component every page reaches. Founder, 2026-08-16: the background
            "should be totally visible on the edges of the whole site, and on
            the center it should have that sort of opacity", and it was on the
            hero of one page. The treatment already existed inside SpineShell;
            what it lacked was reach, since SpineShell is per page type and
            measuring production found the frame on one live page out of six.
            Fixed layers, so the page scrolls over the photograph. */}
        <AtlasFrame />
        {/* Plan v32 hotfix — header 50% taller, logo larger, nav items more
           spread out + larger font. White-reset 2026-06-06: the header is pure
           white and, now that the paper texture that used to separate it from
           the page is gone, carries a thin bottom hairline so the sticky bar
           stays defined as content scrolls beneath it. */}
        <header className={headerClass}>
          {/* THE SITE'S ONE GUTTER (critique pass 3, fix round D1, item P1.3): 16 under 768 and 24 from, read from src/lib/nav.ts by the bar,
              <main>, the footer, the sheet and the newsletter bar, so the wordmark, the h1 and the foot lines share one left edge on a phone.
              It is also what keeps the bar on the screen at 320 (2026-10-04: at 24 the lockup, the search and the menu ran 11px past it and the
              whole page scrolled sideways; under 360 the bar took 16 as a patch, and every width has it now).
              A 60px BAR ON A PHONE (the spec's decision 6): 8px above and below the 44px controls under 768, so the h1, the picker
              and the definition stand in the first screen at 375; from 768 the bar keeps its 24px and the 40px mark. The height
              token in src/app/layout.tsx follows both. */}
          <div className={`max-w-content mx-auto ${GUTTER} py-2 md:py-6 flex items-center justify-between`}>
            <Link href="/" aria-label="Margin Atlas home" className="inline-flex items-center">
              {/* Cities §10: bump 32 to 40 on desktop, 36 on mobile per founder request. ON A PHONE, 28 AND ONE LINE (2026-10-01, T5):
                  at 40 everywhere the two words wrapped beside the search and the menu at every phone width (the bar 117px tall
                  at 375) and the founder's 36 cannot stand on one line there (251px of lockup in 223); 28 is the size that does
                  at 360. The phone lockup also takes the page's own name once its title has scrolled away (PhoneLockup.tsx). */}
              <span className="inline-flex md:hidden"><PhoneLockup /></span>
              <span className="hidden md:inline-flex"><LogoWordmark size={40} labeled={false} /></span>
            </Link>
            {/* THE GROUP'S GAP (critique pass 2, fix round C2, item P2.6): 4px under 768, so the phone's two 44px targets, Search and Menu, sit together
                at the edge (they stood 20px apart and the search floated between the wordmark and the menu); 24 from 768 and 20 from 1280. */}
            <div className="flex items-center gap-1 md:gap-6 xl:gap-5">
              {/* THE ORDER (the spec's section 3): the seven names, Search, the account link while accounts are on, Pricing while the
                  paywall is on, then the menu under 1280. Nothing in the bar is terracotta; a hover is ink.

                  xl, NOT md, and this was a measured defect rather than a
                  preference. The full nav is seven links plus a search and a
                  pricing button; it switched on at md (768) and there is not
                  room for it there, so the masthead WRAPPED TO TWO ROWS across
                  768 to 1023. Measured on the rendered page: header height
                  84.8px at 360, **124.8px at 753**, 88.8px at 1265. Raising
                  both this and MobileNav's own breakpoint to lg gave the
                  masthead two heights instead of four; AND THEN XL (2026-10-01,
                  T5), for the same measured reason one size up: once the lockup
                  grew to 40, the seven links, the search and the lockup did not
                  fit at 1024 either. The full nav needs 1280; the menu covers
                  768 to 1279. */}
              <NavLinks />
              <HeaderSearch />
              {authOn ? <HeaderAuth /> : null}
              {/* PRICING ONLY WHILE THE PAYWALL IS ON (the spec's decision 4; the ship audit's 1.1): the black pill advertised Pro on
                  every page while the switch was off and the footer's own line said "free to browse". The page stays reachable by its
                  address and listed in the sitemap. */}
              {paywallOn ? (
                <Link href="/pricing" className={PRICING_PILL}>
                  Pricing
                </Link>
              ) : null}
              {/* Mobile chrome (R5 Part 8): under 1280 the names above are
                  hidden, so this menu is the only navigation. It carries the
                  same names, the trust pages, and the account and Pricing rows
                  behind the same switches. */}
              <MobileNav pricing={paywallOn} />
            </div>
          </div>
        </header>
        {/* Plan v31/v32 — top padding reduced (pt-4) so the first frame sits
            high on the page. Bottom padding removed entirely (was pb-10):
            each terminal section already has its own py-12/py-16, and
            the extra 40px on main was creating a visible dead-zone before
            the FooterNewsletterBar that read as "unfinished." */}
        {/* `relative` IS LOAD-BEARING, and its absence was a site-wide paint
            bug rather than a style preference.

            AtlasFrame, four elements above, paints one `position: fixed`
            layer at `z-index: 0`, an OPAQUE white base (a second layer, the
            founder's skyline photograph, was removed 2026-09-08: the ground
            is now the grey the shell paints, not a photograph, and this
            base layer is not it). CSS paints positioned z-index-0
            descendants AFTER in-flow non-positioned ones, backgrounds and
            inline text alike, so anything static inside a static <main> is
            painted over by the frame and is simply not drawn.

            The site got away with it by accident. Every homepage band is
            wrapped in ToneBand, which happens to be `relative`, and every
            .atlas-card is `relative` by rule. Wherever neither applied, the
            content vanished: the country page's sections were static and
            invisible, which is the mechanical reason the founder said that
            page "is not updated". Fixing it card by card treats the symptom
            once per component and leaves the next author to rediscover it.

            One `relative` here lifts the whole content subtree into the same
            paint step as the frame, permanently. It is safe by construction:
            no offsets, so layout is untouched, and `z-index` stays `auto`, so
            <main> forms no stacking context and every descendant z-index goes
            on competing in the root context exactly as before.

            `id="main"` and `tabIndex={-1}` are the skip link's target (the ship audit's 1.4): the link lands here and focus with it,
            so the next Tab starts inside the page. globals.css draws no ring round the whole page for that focus. */}
        <main id="main" tabIndex={-1} className={`relative max-w-content mx-auto ${GUTTER} pt-4`}>{children}</main>
        {/* Plan v30 Bundle 5 — site-wide newsletter signup bar; calm,
            non-aggressive, slim. Sits above the main footer. */}
        <FooterNewsletterBar />
        {/* White-reset 2026-06-06 (founder): the footer is now TRUE BLACK
           (was graphite atlas-paper-dark). It is the single dark anchor at
           the end of an all-white site; the white newsletter strip drops
           straight into pure black for a crisp, intentional close. Text is
           white with bumped muted contrast so every line stays legible on
           pure black. */}
        {/* `relative` for the same reason as <main> above, and here it was
            costing the most visible thing on the site. Measured in a browser
            at 1440x900 scrolled to the end: the footer reported
            `position: static` and `background: rgb(0, 0, 0)`, occupied the
            bottom 400px of the viewport, and the screenshot of that region was
            photograph. Not dimmed, not tinted. The black never painted, and
            neither did any of the four link columns on it.

            This is the single dark anchor at the end of the page and it has
            not been drawn on any page since AtlasFrame was mounted site-wide.
            It took a screenshot to find, which is exactly what the charter
            said was missing. */}
        <footer className="relative bg-black text-white border-t border-white/10">
          <div className={`max-w-content mx-auto ${GUTTER} py-12`}>
            <div className="mb-8">
              <LogoWordmark size={22} labeled tone="dark" />
            </div>
            {/* THE FOOTER, MATCHED TO THE BAR (the critique's section 5 and P2.8, the ship audit's 4.2, 4.5 and 5.6): a named
                navigation; the first column the bar's own seven names (src/lib/nav.ts); heads in sentence case; rows 44px tall on a
                phone, two columns a row there; one name per destination (it held "About the data" and "About the figures" for one
                page, "How a figure is built" and "Where the numbers come from" for another, and a version string, v1.18.0, that no
                build stamps). Pricing heads the Atlas column only while the paywall is on.

                All five about-data anchors in this footer were DEAD on 2026-07-29 (#quality, #sources, #glossary, #tax, #contact):
                the dead-links gate validates routes, not fragments. "About the figures" lands on #reading, which exists (his
                interview of 2026-09-26, milestone 1, M9: how to read a figure, then the sources). "Ask Atlas" (/#ask-atlas), "API"
                (/api, no page; design/loop3/api/DECISION.md) and the glossary and tax links went for the same reason, and the
                "Newsletter" link (/#newsletter) went on 2026-10-10: the bar it pointed at stands directly above this footer on every
                page, and no newsletter is sent (NewsletterSignupVariants.tsx says so). Who runs this, the corrections log and the free
                data pack are his rulings of 2026-10-05 (PARKED P0.2, P31.1, P0.3); the contact link goes to a real form.

                EVERY LINK HERE TAKES prefetch={false} (fix round F1, group G4, the final review's recommendation 5): next/link prefetches a
                link's page when the link scrolls into view, so the footer's twenty links fetched twenty pages the moment the footer appeared.
                The bar's seven names, the wordmark and the Pricing pill keep the default, which is the spec's; these are not asked for. */}
            <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 text-sm text-white/80">
              <div>
                <div className={FOOT_HEAD}>Browse</div>
                <ul className={FOOT_LIST}>
                  {NAV.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} prefetch={false} className={FOOT_LINK}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className={FOOT_HEAD}>Learn</div>
                <ul className={FOOT_LIST}>
                  <li><Link href="/about-data#reading" prefetch={false} className={FOOT_LINK}>About the figures</Link></li>
                  <li><Link href="/methodology/key-benchmarks" prefetch={false} className={FOOT_LINK}>The one ratio to watch</Link></li>
                  <li><Link href="/faq" prefetch={false} className={FOOT_LINK}>Common questions</Link></li>
                  <li><Link href="/coverage" prefetch={false} className={FOOT_LINK}>Coverage report</Link></li>
                  <li><Link href="/calculator" prefetch={false} className={FOOT_LINK}>Calculator</Link></li>
                </ul>
              </div>
              <div>
                <div className={FOOT_HEAD}>Trust</div>
                <ul className={FOOT_LIST}>
                  <li><Link href="/about" prefetch={false} className={FOOT_LINK}>Who runs this</Link></li>
                  <li><Link href="/corrections" prefetch={false} className={FOOT_LINK}>Corrections</Link></li>
                  <li><Link href={FREE_DATA.href} prefetch={false} className={FOOT_LINK}>{FREE_DATA.label}</Link></li>
                  <li><Link href="/contact" prefetch={false} className={FOOT_LINK}>Contact</Link></li>
                </ul>
              </div>
              <div>
                <div className={FOOT_HEAD}>Atlas</div>
                <ul className={FOOT_LIST}>
                  {paywallOn ? <li><Link href="/pricing" prefetch={false} className={FOOT_LINK}>Pricing</Link></li> : null}
                  <li><Link href="/status" prefetch={false} className={FOOT_LINK}>Status</Link></li>
                  <li><Link href="/privacy" prefetch={false} className={FOOT_LINK}>Privacy</Link></li>
                  <li><Link href="/terms" prefetch={false} className={FOOT_LINK}>Terms</Link></li>
                  <li><Link href="/cookies" prefetch={false} className={FOOT_LINK}>Cookies</Link></li>
                </ul>
              </div>
            </nav>
            <div className="mt-10 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs text-white/70">
              {/* The year beside the publisher (the ship audit's 5.7). The publisher is Margin Atlas (his ruling of 2026-10-10); the line ends on the
                  name, because the domain is the page's own address and the wordmark above the columns says the name once more. */}
              <span>© {new Date().getFullYear()} Margin Atlas</span>
              {/* Ruling 17 from launch day (the paywall's switch, masterplan step 12). */}
              <span>Covering small businesses worldwide · {paywallOn ? "each UK chapter opens free" : "free to browse"}</span>
            </div>
          </div>
        </footer>
      {/* Docked bottom-right. Deliberately part of the chrome rather than the
          layout: a route that renders no chrome owns its own corners, which is
          what stops this pill painting over the trade page's own chapter pill. */}
      <WatchTray />
    </>
  );
}
