import Link from "next/link";
import { SmartImage } from "@/components/SmartImage";

export const metadata = {
  title: "Not found | Margin Atlas",
};

// Plan v21 Block 1 — removed `await headers()` from this file. It was
// forcing the entire route segment dynamic at runtime, which collided
// with `export const revalidate = 21600` on the cell page (S-100) and
// turned every benchmark URL into an HTTP 500. The previous version
// used `x-pathname` to pick targeted suggestions; we now show a
// generic set instead, which is the right tradeoff against the
// site-wide outage that issue caused.
export default function NotFound() {
  return (
    <div className="py-16 max-w-3xl">
      <div className="mb-6 max-w-sm">
        <SmartImage
          alt="Off the map illustration"
          glyph="🧭"
          aspectRatio={1.6}
          rounded="2xl"
        />
      </div>
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
        404
      </div>
      <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight text-ink-900">
        We don&apos;t have that one yet.
      </h1>
      <p className="mt-4 text-lg text-ink-800/80 leading-relaxed">
        Either the industry doesn&apos;t exist in our taxonomy, the region
        isn&apos;t covered yet, or you typed something custom. Try one of
        these instead:
      </p>
      <div className="mt-8 grid sm:grid-cols-2 gap-3">
        <Link
          href="/browse"
          className="block px-4 py-3 rounded-xl border border-ink-200 bg-white hover:border-atlas-500 transition text-sm text-ink-900"
        >
          <div className="font-medium">Browse all countries →</div>
          <div className="text-xs text-ink-700/70 mt-1">Pick from 190+ covered countries</div>
        </Link>
        <Link
          href="/"
          className="block px-4 py-3 rounded-xl border border-ink-200 bg-white hover:border-atlas-500 transition text-sm text-ink-900"
        >
          <div className="font-medium">Use the navigator →</div>
          <div className="text-xs text-ink-700/70 mt-1">Cascading country / industry / size picker</div>
        </Link>
        <Link
          href="/us/california/restaurants"
          className="block px-4 py-3 rounded-xl border border-ink-200 bg-white hover:border-atlas-500 transition text-sm text-ink-900"
        >
          <div className="font-medium">Restaurants: California →</div>
          <div className="text-xs text-ink-700/70 mt-1">Most-visited benchmark</div>
        </Link>
        <Link
          href="/compare"
          className="block px-4 py-3 rounded-xl border border-ink-200 bg-white hover:border-atlas-500 transition text-sm text-ink-900"
        >
          <div className="font-medium">Compare snapshots side-by-side →</div>
          <div className="text-xs text-ink-700/70 mt-1">4 benchmarks, 1 view</div>
        </Link>
      </div>
    </div>
  );
}
