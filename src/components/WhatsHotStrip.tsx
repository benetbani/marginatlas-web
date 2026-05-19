/**
 * WhatsHotStrip — Track BB.10.
 *
 * Tight 3-cell grid at the bottom of the home page surfacing high-traffic
 * cells. Static curated picks for now; swap to dynamic analytics signal
 * once Track JJ.6 (top-queries dashboard) lands.
 */
import Link from "next/link";
import { CountryFlag } from "@/components/CountryFlag";

type HotCell = {
  href: string;
  iso2: string;
  title: string;
  region: string;
  blurb: string;
};

const HOT_CELLS: HotCell[] = [
  {
    href: "/us/california/restaurants",
    iso2: "US",
    title: "Restaurants",
    region: "California",
    blurb: "The single most-viewed cell in the atlas: median revenue, payroll, and after-tax owner take-home for every size band.",
  },
  {
    href: "/gb/london/legal-services",
    iso2: "GB",
    title: "Legal services",
    region: "London",
    blurb: "All 33 LADs covered natively. Compare boutique firms in Camden against the City of London.",
  },
  {
    href: "/de/munich/software-development",
    iso2: "DE",
    title: "Software development",
    region: "Munich",
    blurb: "Bayern's tech corridor. Per-firm revenue, payroll, and effective tax burden for 5 size bands.",
  },
];

export function WhatsHotStrip() {
  return (
    <section className="py-10">
      <div className="flex items-baseline justify-between gap-4 flex-wrap mb-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
            What people are reading
          </div>
          <h2 className="mt-1 text-xl md:text-2xl font-semibold tracking-tight text-ink-900">
            Three cells worth a look this week
          </h2>
        </div>
        <a
          href="/browse"
          className="text-sm text-atlas-700 hover:text-atlas-900 font-medium"
        >
          See everything →
        </a>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {HOT_CELLS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="block p-5 rounded-xl bg-cream-100 border border-parchment hover:border-atlas-500 hover:bg-white transition"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <CountryFlag iso2={c.iso2} label={c.region} className="w-6" />
              <span>
                {c.title} <span className="text-ink-700/70">: {c.region}</span>
              </span>
            </div>
            <p className="mt-2 text-sm text-ink-700 leading-relaxed">{c.blurb}</p>
            <div className="mt-3 text-xs text-atlas-700 font-medium">Open cell →</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
