import "./globals.css";
import type { Metadata } from "next";
import { Organization } from "@/components/StructuredData";
import { GlobalSearch } from "@/components/GlobalSearch";

export const metadata: Metadata = {
  title: "Margin Atlas — Global Small-Business Benchmarking",
  description:
    "The unified database of small-business revenue, employment, and wage data across 40+ countries. Built from US Census, Eurostat, OECD, and national statistical agencies.",
  metadataBase: new URL("https://marginatlas.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink-50 text-ink-900 font-sans">
        <Organization />
        <header className="border-b border-ink-200 bg-ink-50/85 backdrop-blur sticky top-0 z-10">
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
              <nav className="text-sm text-ink-800 hidden sm:flex">
                <a href="/browse" className="hover:text-atlas-600 mx-3 transition-colors">Browse</a>
                <a href="/blog" className="hover:text-atlas-600 mx-3 transition-colors">Blog</a>
                <a href="/pricing" className="hover:text-atlas-600 mx-3 transition-colors">Pricing</a>
                <a href="/methodology" className="hover:text-atlas-600 mx-3 transition-colors">Methodology</a>
              </nav>
              <GlobalSearch />
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-10">{children}</main>
        <footer className="border-t border-ink-200 mt-20 bg-ink-100/40">
          <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8 text-sm text-ink-700">
            <div>
              <div className="font-semibold text-ink-900 mb-3 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#C2410C" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#D97706" opacity="0.7" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#D97706" opacity="0.7" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#F59E0B" opacity="0.45" />
                </svg>
                Margin Atlas
              </div>
              <p className="text-xs text-ink-600 leading-relaxed">
                Small-business benchmarks for 40+ countries.
              </p>
            </div>
            <div>
              <div className="font-semibold text-ink-900 mb-3 text-xs uppercase tracking-wide">Browse</div>
              <ul className="space-y-2 text-xs">
                <li><a href="/browse" className="hover:text-atlas-600">All countries</a></li>
                <li><a href="/us" className="hover:text-atlas-600">United States</a></li>
                <li><a href="/sectors/manufacturing" className="hover:text-atlas-600">Manufacturing</a></li>
                <li><a href="/sectors/hotels_food" className="hover:text-atlas-600">Hotels & food</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-ink-900 mb-3 text-xs uppercase tracking-wide">Resources</div>
              <ul className="space-y-2 text-xs">
                <li><a href="/blog" className="hover:text-atlas-600">Blog</a></li>
                <li><a href="/methodology" className="hover:text-atlas-600">Methodology</a></li>
                <li><a href="/pricing" className="hover:text-atlas-600">Pricing</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-ink-900 mb-3 text-xs uppercase tracking-wide">About</div>
              <ul className="space-y-2 text-xs">
                <li className="text-ink-600">© Tesseract Research</li>
                <li className="text-ink-600">marginatlas.com</li>
                <li className="text-ink-500">v1.17.0</li>
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
