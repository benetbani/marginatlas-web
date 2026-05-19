/**
 * RecentlyAddedStrip — Track BB.2.
 *
 * Surfaces the most recently added countries. Static for now (the Plan v7
 * + Plan v8 additions); switch to dynamic once an `added_at` column lands
 * on the COUNTRIES table.
 */

import { CountryFlag } from "@/components/CountryFlag";

type RecentEntry = {
  iso2: string;
  name: string;
  hint: string;
};

const RECENTLY_ADDED: RecentEntry[] = [
  { iso2: "al", name: "Albania", hint: "6 cities incl. Tirana" },
  { iso2: "ru", name: "Russia", hint: "Moscow, St Petersburg + 8 more" },
  { iso2: "kz", name: "Kazakhstan", hint: "Almaty + Astana" },
  { iso2: "az", name: "Azerbaijan", hint: "Baku" },
  { iso2: "ge", name: "Georgia", hint: "Tbilisi" },
  { iso2: "ch", name: "Switzerland", hint: "Zurich + Geneva" },
  { iso2: "at", name: "Austria", hint: "Vienna" },
  { iso2: "il", name: "Israel", hint: "Tel Aviv" },
  { iso2: "ad", name: "Andorra", hint: "Microstate" },
  { iso2: "mc", name: "Monaco", hint: "Microstate" },
];

export function RecentlyAddedStrip() {
  return (
    <section className="py-8">
      <div className="flex items-baseline justify-between gap-4 flex-wrap mb-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
            Just added
          </div>
          <h2 className="mt-1 text-xl md:text-2xl font-semibold tracking-tight text-ink-900">
            Countries that landed in the last refresh
          </h2>
        </div>
        <a
          href="/coverage"
          className="text-sm text-atlas-700 hover:text-atlas-900 font-medium"
        >
          Coverage report →
        </a>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
        {RECENTLY_ADDED.map((c) => (
          <a
            key={c.iso2}
            href={`/${c.iso2}`}
            className="snap-start shrink-0 min-w-[180px] px-4 py-3 rounded-xl bg-cream-100 border border-parchment hover:border-atlas-500 hover:bg-white transition"
          >
            <div className="flex items-center gap-2">
              <CountryFlag iso2={c.iso2} label={c.name} className="w-7" />
              <span className="text-sm font-semibold text-ink-900">{c.name}</span>
            </div>
            <div className="mt-1 text-xs text-ink-700/70">{c.hint}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
