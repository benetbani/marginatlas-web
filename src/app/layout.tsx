import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Newsreader, Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Organization } from "@/components/StructuredData";
import { HeaderSearch } from "@/components/HeaderSearch";
import { FooterNewsletterBar } from "@/components/newsletter/NewsletterSignupVariants";
import { LogoWordmark } from "@/components/brand/LogoWordmark";

// Plan v30 Phase 3 — typography reset.
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
        <header className="border-b border-ink-200 bg-cream-50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" aria-label="Margin Atlas home" className="inline-flex items-center">
              <LogoWordmark size={26} labeled={false} />
            </a>
            <div className="flex items-center gap-2">
              <nav className="text-sm text-ink-800 hidden md:flex">
                <a href="/browse" className="hover:text-atlas-600 mx-2 transition-colors">Browse</a>
                <a href="/industries" className="hover:text-atlas-600 mx-2 transition-colors">Industries</a>
                <a href="/world" className="hover:text-atlas-600 mx-2 transition-colors">Regions</a>
                <a href="/calculator" className="hover:text-atlas-600 mx-2 transition-colors">Calculator</a>
                <a href="/compare" className="hover:text-atlas-600 mx-2 transition-colors">Compare</a>
                <a href="/coverage" className="hover:text-atlas-600 mx-2 transition-colors">Coverage</a>
                <a href="/pricing" className="hover:text-atlas-600 mx-2 transition-colors">Pricing</a>
              </nav>
              <HeaderSearch />
            </div>
          </div>
        </header>
        {/* Plan v31 starter — top padding reduced from py-10 to py-4 so
            the first frame (navigator + world map) sits higher on the
            page without the wasted gap the founder flagged. */}
        <main className="max-w-7xl mx-auto px-6 pt-4 pb-10">{children}</main>
        {/* Plan v30 Bundle 5 — site-wide newsletter signup bar; calm,
            non-aggressive, slim. Sits above the main footer. */}
        <FooterNewsletterBar />
        <footer className="border-t border-ink-200 bg-ink-100">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-8">
              <LogoWordmark size={22} labeled />
            </div>
            <div className="grid md:grid-cols-5 gap-8 text-sm text-ink-700">
              <div>
                <div className="font-semibold text-ink-900 mb-3 text-xs uppercase tracking-wide">Browse</div>
                <ul className="space-y-2 text-xs">
                  <li><a href="/browse" className="hover:text-atlas-600">The whole world</a></li>
                  <li><a href="/industries" className="hover:text-atlas-600">All industries</a></li>
                  <li><a href="/world" className="hover:text-atlas-600">World map</a></li>
                  <li><a href="/sectors/manufacturing" className="hover:text-atlas-600">Sectors</a></li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-ink-900 mb-3 text-xs uppercase tracking-wide">Use</div>
                <ul className="space-y-2 text-xs">
                  <li><a href="/calculator" className="hover:text-atlas-600">Where do I sit?</a></li>
                  <li><a href="/compare" className="hover:text-atlas-600">Compare snapshots</a></li>
                  <li><a href="/#ask-atlas" className="hover:text-atlas-600">Ask Atlas</a></li>
                  <li><a href="/#newsletter" className="hover:text-atlas-600">Newsletter</a></li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-ink-900 mb-3 text-xs uppercase tracking-wide">Learn</div>
                <ul className="space-y-2 text-xs">
                  <li><a href="/about-data" className="hover:text-atlas-600">About the data</a></li>
                  <li><a href="/blog" className="hover:text-atlas-600">Blog</a></li>
                  <li><a href="/about-data#tax" className="hover:text-atlas-600">Tax overlay guide</a></li>
                  <li><a href="/about-data#glossary" className="hover:text-atlas-600">Glossary</a></li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-ink-900 mb-3 text-xs uppercase tracking-wide">Trust</div>
                <ul className="space-y-2 text-xs">
                  <li><a href="/about-data#quality" className="hover:text-atlas-600">Quality methodology</a></li>
                  <li><a href="/about-data#sources" className="hover:text-atlas-600">Sources</a></li>
                  <li><a href="/coverage" className="hover:text-atlas-600">Coverage report</a></li>
                  <li><a href="/about-data#contact" className="hover:text-atlas-600">Contact</a></li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-ink-900 mb-3 text-xs uppercase tracking-wide">Atlas</div>
                <ul className="space-y-2 text-xs">
                  <li><a href="/pricing" className="hover:text-atlas-600">Pricing</a></li>
                  <li><a href="/status" className="hover:text-atlas-600">Status</a></li>
                  <li><a href="/api" className="hover:text-atlas-600">API</a></li>
                  <li className="text-ink-500">v1.18.0</li>
                </ul>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-ink-200/60 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-600">
              <span>© Tesseract Research · marginatlas.com</span>
              <span>Covering small businesses worldwide · free to browse</span>
            </div>
          </div>
        </footer>
        {/* Plan v26 C.5 — Vercel Speed Insights: real-user LCP / CLS /
           INP captured per route. Free on Hobby. View in Vercel
           dashboard → Speed Insights. */}
        <SpeedInsights />
      </body>
    </html>
  );
}
