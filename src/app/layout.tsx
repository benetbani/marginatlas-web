import "./globals.css";
import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { Organization } from "@/components/StructuredData";
import { HeaderSearch } from "@/components/HeaderSearch";

// Plan v14 6b: editorial display serif for hero headlines + other broadsheet
// moments. Mirrors the wordmark vibe and pushes the homepage hero out of the
// Inter-everywhere SaaS lane. Loaded via next/font so it self-hosts with
// font-display: swap; falls through to Georgia/serif when offline.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Margin Atlas: Small-business benchmarks across 191 countries",
  description:
    "Revenue, payroll, and after-tax owner take-home for every covered country, industry, city, and size combination. Compiled from official business statistics and standardized for cross-country comparison.",
  metadataBase: new URL("https://marginatlas.com"),
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
    <html lang="en" className={cormorant.variable}>
      <body className="min-h-screen bg-cream-50 text-ink-900 font-sans">
        <Organization />
        <header className="border-b border-ink-200 bg-cream-50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#C2410C" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#D97706" opacity="0.7" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#D97706" opacity="0.7" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#F59E0B" opacity="0.45" />
              </svg>
              <span className="text-ink-900">Margin Atlas</span>
            </a>
            <div className="flex items-center gap-2">
              <nav className="text-sm text-ink-800 hidden md:flex">
                <a href="/browse" className="hover:text-atlas-600 mx-2 transition-colors">Browse</a>
                <a href="/industries" className="hover:text-atlas-600 mx-2 transition-colors">Industries</a>
                <a href="/world" className="hover:text-atlas-600 mx-2 transition-colors">World</a>
                <a href="/calculator" className="hover:text-atlas-600 mx-2 transition-colors">Calculator</a>
                <a href="/compare" className="hover:text-atlas-600 mx-2 transition-colors">Compare</a>
                <a href="/coverage" className="hover:text-atlas-600 mx-2 transition-colors">Coverage</a>
                <a href="/pricing" className="hover:text-atlas-600 mx-2 transition-colors">Pricing</a>
              </nav>
              <HeaderSearch />
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-10">{children}</main>
        <footer className="border-t border-ink-200 mt-20 bg-ink-100">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-2 font-semibold text-ink-900 mb-8">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#C2410C" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#D97706" opacity="0.7" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#D97706" opacity="0.7" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#F59E0B" opacity="0.45" />
              </svg>
              Margin Atlas
            </div>
            <div className="grid md:grid-cols-5 gap-8 text-sm text-ink-700">
              <div>
                <div className="font-semibold text-ink-900 mb-3 text-xs uppercase tracking-wide">Browse</div>
                <ul className="space-y-2 text-xs">
                  <li><a href="/browse" className="hover:text-atlas-600">All 191 countries</a></li>
                  <li><a href="/industries" className="hover:text-atlas-600">All industries</a></li>
                  <li><a href="/world" className="hover:text-atlas-600">World map</a></li>
                  <li><a href="/sectors/manufacturing" className="hover:text-atlas-600">Sectors</a></li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-ink-900 mb-3 text-xs uppercase tracking-wide">Use</div>
                <ul className="space-y-2 text-xs">
                  <li><a href="/calculator" className="hover:text-atlas-600">Where do I sit?</a></li>
                  <li><a href="/compare" className="hover:text-atlas-600">Compare cells</a></li>
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
              <span>191 countries · 357k+ cells · free to browse</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
