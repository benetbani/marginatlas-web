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
 * NOTHING HERE IS NEW. This markup was LIFTED from the previous root layout by
 * a script rather than retyped, because retyping it by hand produced an invented
 * footer on the first attempt. Pages that had chrome get byte-identical chrome.
 */
import { FooterNewsletterBar } from "@/components/newsletter/NewsletterSignupVariants";
import { HeaderAuth } from "@/components/HeaderAuth";
import { HeaderSearch } from "@/components/HeaderSearch";
import { LogoWordmark } from "@/components/brand/LogoWordmark";
import { MobileNav } from "@/components/MobileNav";
import { WatchTray } from "@/components/kit";
import { isWarmFrameEnabled } from "@/lib/feature_flags";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  // Warm frame (R6 Phase B): the glass chrome class on the sticky header swaps
  // in only when the frame is on; the gutters render themselves (no-op when
  // off). With the flag off the header keeps its white + parchment-hairline bar.
  const warmFrame = isWarmFrameEnabled();
  const headerClass = warmFrame
    ? "atlas-glass-chrome sticky top-0 z-raised"
    : "bg-white border-b border-parchment sticky top-0 z-raised";
  return (
    <>
        {/* Plan v32 hotfix — header 50% taller, logo larger, nav items more
           spread out + larger font. White-reset 2026-06-06: the header is pure
           white and, now that the paper texture that used to separate it from
           the page is gone, carries a thin bottom hairline so the sticky bar
           stays defined as content scrolls beneath it. */}
        <header className={headerClass}>
          <div className="max-w-7xl mx-auto px-6 py-5 md:py-6 flex items-center justify-between">
            <a href="/" aria-label="Margin Atlas home" className="inline-flex items-center">
              {/* Cities §10: bump 32 to 40 on desktop, 36 on mobile per founder request. */}
              <LogoWordmark size={40} labeled={false} />
            </a>
            <div className="flex items-center gap-5 md:gap-6">
              <nav className="text-base text-ink-800 hidden md:flex items-center gap-5">
                <a href="/countries" className="hover:text-atlas-600 transition-colors">Countries</a>
                <a href="/industries" className="hover:text-atlas-600 transition-colors">Activities</a>
                <a href="/cities" className="hover:text-atlas-600 transition-colors">Cities</a>
                <a href="/extremes" className="hover:text-atlas-600 transition-colors">Extremes</a>
                {/* Tools hub (2026-06-07): the founder folded Decide, Check, and
                   Calculator under one entry. The individual routes are
                   unchanged; /tools points to all three. */}
                <a href="/tools" className="hover:text-atlas-600 transition-colors">Tools</a>
                <a href="/compare" className="hover:text-atlas-600 transition-colors">Compare</a>
                <a href="/blog" className="hover:text-atlas-600 transition-colors">Blog</a>
                <HeaderAuth />
                {/* Plan v32 — pricing promoted to button-style CTA so
                   it's visually distinct from the rest of the nav. */}
                <a
                  href="/pricing"
                  className="ml-1 inline-flex items-center px-3.5 py-1.5 rounded-full bg-ink-900 text-cream-50 text-sm font-semibold hover:bg-atlas-700 transition-colors"
                >
                  Pricing
                </a>
              </nav>
              <HeaderSearch />
              {/* Mobile chrome (R5 Part 8): below md the desktop nav above is
                  hidden, so this hamburger is the only navigation. It toggles a
                  token-styled menu of the same primary links. */}
              <MobileNav />
            </div>
          </div>
        </header>
        {/* Plan v31/v32 — top padding reduced (pt-4) so the first frame sits
            high on the page. Bottom padding removed entirely (was pb-10):
            each terminal section already has its own py-12/py-16, and
            the extra 40px on main was creating a visible dead-zone before
            the FooterNewsletterBar that read as "unfinished." */}
        <main className="max-w-7xl mx-auto px-6 pt-4">{children}</main>
        {/* Plan v30 Bundle 5 — site-wide newsletter signup bar; calm,
            non-aggressive, slim. Sits above the main footer. */}
        <FooterNewsletterBar />
        {/* White-reset 2026-06-06 (founder): the footer is now TRUE BLACK
           (was graphite atlas-paper-dark). It is the single dark anchor at
           the end of an all-white site; the white newsletter strip drops
           straight into pure black for a crisp, intentional close. Text is
           white with bumped muted contrast so every line stays legible on
           pure black. */}
        <footer className="bg-black text-white border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-8">
              <LogoWordmark size={22} labeled tone="dark" />
            </div>
            <div className="grid md:grid-cols-5 gap-8 text-sm text-white/80">
              <div>
                <div className="font-semibold text-white mb-3 text-xs uppercase tracking-wide">Browse</div>
                <ul className="space-y-2 text-xs">
                  <li><a href="/countries" className="hover:text-atlas-500">All countries</a></li>
                  <li><a href="/cities" className="hover:text-atlas-500">All cities</a></li>
                  <li><a href="/industries" className="hover:text-atlas-500">All activities</a></li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-white mb-3 text-xs uppercase tracking-wide">Use</div>
                <ul className="space-y-2 text-xs">
                  <li><a href="/calculator" className="hover:text-atlas-500">Where do I sit?</a></li>
                  <li><a href="/compare" className="hover:text-atlas-500">Compare snapshots</a></li>
                  <li><a href="/#ask-atlas" className="hover:text-atlas-500">Ask Atlas</a></li>
                  <li><a href="/#newsletter" className="hover:text-atlas-500">Newsletter</a></li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-white mb-3 text-xs uppercase tracking-wide">Learn</div>
                <ul className="space-y-2 text-xs">
                  <li><a href="/about-data" className="hover:text-atlas-500">About the data</a></li>
                  <li><a href="/blog" className="hover:text-atlas-500">Blog</a></li>
                  <li><a href="/about-data#tax" className="hover:text-atlas-500">Tax overlay guide</a></li>
                  <li><a href="/about-data#glossary" className="hover:text-atlas-500">Glossary</a></li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-white mb-3 text-xs uppercase tracking-wide">Trust</div>
                <ul className="space-y-2 text-xs">
                  <li><a href="/about-data#quality" className="hover:text-atlas-500">Quality methodology</a></li>
                  <li><a href="/about-data#sources" className="hover:text-atlas-500">Sources</a></li>
                  <li><a href="/coverage" className="hover:text-atlas-500">Coverage report</a></li>
                  <li><a href="/about-data#contact" className="hover:text-atlas-500">Contact</a></li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-white mb-3 text-xs uppercase tracking-wide">Atlas</div>
                <ul className="space-y-2 text-xs">
                  <li><a href="/pricing" className="hover:text-atlas-500">Pricing</a></li>
                  <li><a href="/status" className="hover:text-atlas-500">Status</a></li>
                  <li><a href="/api" className="hover:text-atlas-500">API</a></li>
                  {/* A trust page nobody can reach is not a trust page. These
                      sit in the footer because that is the first place a
                      suspicious reader looks for them. */}
                  <li><a href="/privacy" className="hover:text-atlas-500">Privacy</a></li>
                  <li><a href="/terms" className="hover:text-atlas-500">Terms</a></li>
                  <li><a href="/cookies" className="hover:text-atlas-500">Cookies</a></li>
                  <li className="text-white/55">v1.18.0</li>
                </ul>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs text-white/70">
              <span>© Tesseract Research · marginatlas.com</span>
              <span>Covering small businesses worldwide · free to browse</span>
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
