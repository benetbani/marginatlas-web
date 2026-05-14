import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Margin Atlas — Global SMB Benchmarking",
  description:
    "The unified database of small-business margins across 40+ countries. Revenue, employment, and payroll distributions from Eurostat, US Census, OECD, and national statistical offices.",
  metadataBase: new URL("https://marginatlas.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink-50 text-ink-900">
        <header className="border-b border-slate-200/60 bg-white/60 backdrop-blur sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="font-semibold text-lg tracking-tight">
              <span className="gradient-name">Margin Atlas</span>
            </a>
            <nav className="text-sm text-ink-800">
              <a href="/pricing" className="hover:text-atlas-600 mx-3">Pricing</a>
              <a href="/methodology" className="hover:text-atlas-600 mx-3">Methodology</a>
              <a href="/sign-in" className="hover:text-atlas-600 mx-3">Sign in</a>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-10">{children}</main>
        <footer className="border-t border-slate-200/60 mt-20">
          <div className="max-w-7xl mx-auto px-6 py-8 text-xs text-ink-700/70">
            © Tesseract Research · marginatlas.com · v1.15.0
          </div>
        </footer>
      </body>
    </html>
  );
}
