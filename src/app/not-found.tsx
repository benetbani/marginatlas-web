/**
 * Minimal not-found that avoids the Next.js 15.5
 * post-export rename bug. The previous version (Phosphor barrel imports)
 * triggered an ENOENT on .next/export/500.html during static export,
 * killing every Vercel deploy of commits 4348a23 + 4680afc + 34b9e61.
 *
 * This minimal version uses plain HTML + Tailwind only.
 */
import Link from "next/link";

export const metadata = {
  title: "Not found | Margin Atlas",
};

const HATCHES = [
  { label: "Browse cities",           desc: "245 cities across the atlas",                 href: "/cities" },
  { label: "Browse industries",       desc: "Every activity we cover",                     href: "/industries" },
  { label: "Pick a country",          desc: "Start from the world map on the homepage",    href: "/" },
  { label: "Read the knowledge base", desc: "Methodology, glossary, atlas guides",         href: "/learn" },
  { label: "Compare two places",      desc: "Side-by-side country, city, or sector",       href: "/compare" },
  { label: "Use the calculator",      desc: "Plug your numbers into the typical operator", href: "/calculator" },
];

export default function NotFound() {
  return (
    <main className="w-full bg-cream-50 min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-12 sm:pt-24">
        <div className="text-center">
          <p aria-hidden="true" className="font-display text-6xl sm:text-7xl font-semibold text-atlas-700 leading-none">
            404
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-ink-900 mt-6">
            This page isn&apos;t part of the atlas.
          </h1>
          <p className="text-base text-cocoa-700 mt-4 max-w-xl mx-auto leading-relaxed">
            Atlas might still add this combination, or the URL might be
            misspelled. Either way, six places to go next:
          </p>
        </div>
        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {HATCHES.map((h) => (
            <li key={h.href}>
              <Link href={h.href} className="block rounded-lg border border-parchment bg-white hover:bg-cream-100 hover:border-atlas-500 transition-colors p-5">
                <div className="font-semibold text-ink-900">{h.label}</div>
                <div className="text-sm text-cocoa-700 mt-1 leading-relaxed">{h.desc}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
