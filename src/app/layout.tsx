import "./globals.css";
import type { Metadata } from "next";

// Pin all server-rendered routes to Frankfurt. Supabase
// project lives in eu-west-1 (per the dashboard banner); Vercel default
// is iad1 (US East). Every Supabase query was eating ~80-150ms of
// transatlantic round-trip latency. Pinning Vercel to fra1 (Frankfurt)
// puts the function 10-30ms from the DB. With 4 queries per cell page
// that's roughly 300-600ms shaved off the cold-render time.
//
// Override per-route by re-exporting preferredRegion at the page level.
export const preferredRegion = "fra1";

import Script from "next/script";
import { Newsreader, Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Organization } from "@/components/StructuredData";
import { HeaderSearch } from "@/components/HeaderSearch";
import { FooterNewsletterBar } from "@/components/newsletter/NewsletterSignupVariants";
import { LogoWordmark } from "@/components/brand/LogoWordmark";
import { PaywallModalRoot } from "@/components/monetization";

// Typography reset.
// Newsreader: warm, bookish editorial serif designed for screen reading.
// Used for H1/H2/H3 and the single hero number per page.
// Inter: clean, neutral sans for body text + ALL numbers in tables, stats,
// and waterfall lines (with tabular-nums enabled). Replaces Cormorant
// Garamond which read too thin at large sizes and was unreadable on
// 7-digit dollar numbers.
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-display",
  style: ["normal", "italic"],
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Margin Atlas: Small-business benchmarks worldwide",
  description:
    "Revenue, payroll, and after-tax owner take-home for small businesses worldwide, broken down by industry, city, and size. Compiled from official business statistics and standardized for cross-country comparison.",
  metadataBase: new URL("https://www.marginatlas.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Margin Atlas: Small-business benchmarks worldwide",
    description:
      "Revenue, payroll, and after-tax owner take-home for small businesses worldwide, by industry, city, and size.",
    url: "https://www.marginatlas.com",
    siteName: "Margin Atlas",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Margin Atlas: Small-business benchmarks worldwide",
    description:
      "Small-business revenue, payroll, and owner take-home, by industry, city, and size.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable}`}>
      {/* Plan v31 — site-wide background uses the Atlas paper pattern
          (light gray with tiny four-point compass stars). Cards and
          panels override with bg-white where content needs full
          contrast against the patterned canvas. */}
      <body className="min-h-screen atlas-paper text-ink-900 font-sans">
        {/* Microsoft Clarity — heatmaps + session recordings, free forever.
            The src URL is Clarity's loader; it injects the actual tracking
            script after load. afterInteractive so it never blocks render. */}
        <Script
          id="ms-clarity"
          src="https://www.clarity.ms/tag/wtu315an8b"
          strategy="afterInteractive"
        />
        <Organization />
        {/* Plan v32 hotfix — header 50% taller, logo larger, nav items more
           spread out + larger font. White-reset 2026-06-06: the header is pure
           white and, now that the paper texture that used to separate it from
           the page is gone, carries a thin bottom hairline so the sticky bar
           stays defined as content scrolls beneath it. */}
        <header className="bg-white border-b border-parchment sticky top-0 z-10">
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
                <a href="/decide" className="hover:text-atlas-600 transition-colors">Decide</a>
                <a href="/check" className="hover:text-atlas-600 transition-colors">Check</a>
                <a href="/compare" className="hover:text-atlas-600 transition-colors">Compare</a>
                <a href="/blog" className="hover:text-atlas-600 transition-colors">Blog</a>
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
        {/* Plan v26 C.5 — Vercel Speed Insights: real-user LCP / CLS /
           INP captured per route. Free on Hobby. View in Vercel
           dashboard → Speed Insights. */}
        <SpeedInsights />
        {/* Plan v34 Phase B — paywall modal mounted once at the layout
           level. Listens for the atlas:open-paywall custom event from
           any lock primitive on any page. */}
        <PaywallModalRoot />
      </body>
    </html>
  );
}
