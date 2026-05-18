import Link from "next/link";
import { headers } from "next/headers";
import { SmartImage } from "@/components/SmartImage";
import { suggestForPath } from "@/lib/not_found_suggestions";

export const metadata = {
  title: "Not found | Margin Atlas",
};

export default async function NotFound() {
  const hdrs = await headers();
  const path = hdrs.get("x-pathname") || "";
  const suggestions = suggestForPath(path);

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
      {path ? (
        <p className="mt-3 text-sm text-ink-700/80">
          Tried to reach <code className="px-1.5 py-0.5 rounded bg-parchment-100 text-ink-900">{path}</code>
        </p>
      ) : null}
      <p className="mt-4 text-lg text-ink-800/80 leading-relaxed">
        Either the industry doesn&apos;t exist in our taxonomy, the region
        isn&apos;t covered yet, or you typed something custom. Try one of
        these instead:
      </p>
      <div className="mt-8 grid sm:grid-cols-2 gap-3">
        {suggestions.length > 0
          ? suggestions.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="block px-4 py-3 rounded-xl border border-ink-200 bg-white hover:border-atlas-500 transition text-sm text-ink-900"
              >
                <div className="font-medium">{s.label} →</div>
                <div className="text-xs text-ink-700/70 mt-1">{s.hint}</div>
              </Link>
            ))
          : (
            <>
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
                <div className="font-medium">Restaurants — California →</div>
                <div className="text-xs text-ink-700/70 mt-1">Most-visited cell</div>
              </Link>
              <Link
                href="/compare"
                className="block px-4 py-3 rounded-xl border border-ink-200 bg-white hover:border-atlas-500 transition text-sm text-ink-900"
              >
                <div className="font-medium">Compare cells side-by-side →</div>
                <div className="text-xs text-ink-700/70 mt-1">4 cells, 1 view</div>
              </Link>
            </>
          )}
      </div>
    </div>
  );
}
