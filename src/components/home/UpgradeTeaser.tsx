/**
 * UpgradeTeaser -- the homepage's free-vs-premium mini comparison. A faithful
 * SUBSET of the v34 tier matrix (the authoritative full table lives on
 * /pricing, src/app/pricing/page.tsx); tier names and prices come from the
 * shared TIERS constant so the two surfaces cannot drift. Pure presentational
 * server component, tokens only. The CTA points to /pricing; no checkout from
 * the homepage.
 */
import { Check, Minus } from "@phosphor-icons/react/dist/ssr";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { TIERS, PRICING_HREF } from "@/components/monetization";

// A 6-row subset of the v34 feature matrix. Each tuple is
// [feature, free, basic, premium]; a string renders as-is, a boolean renders a
// check / dash. Kept short on purpose: /pricing carries the full table.
const ROWS: [string, boolean | string, boolean | string, boolean | string][] = [
  ["Median, top and bottom decile", true, true, true],
  ["Lower and upper quartile (p25, p75)", false, true, true],
  ["Year-over-year change", false, true, true],
  ["Saved cells", false, "25", "Unlimited"],
  ["Side-by-side comparison", false, false, true],
  ["CSV export", false, false, true],
];

function MiniCell({ v }: { v: boolean | string }) {
  if (v === true)
    return <Check size={15} weight="regular" aria-label="included" className="inline-block text-atlas-700" />;
  if (v === false)
    return <Minus size={11} weight="regular" aria-label="not included" className="inline-block text-cocoa-700/30" />;
  return <span className="text-sm font-semibold text-ink-900 tabular-nums">{v}</span>;
}

export function UpgradeTeaser() {
  const cols = [
    "Free",
    `${TIERS.basic.name} $${TIERS.basic.priceMonthly}`,
    `${TIERS.premium.name} $${TIERS.premium.priceMonthly}`,
  ];
  return (
    <section className="py-12 md:py-16">
      <SectionEyebrow size="md" className="mb-2">Free and paid</SectionEyebrow>
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-3">
        Every benchmark is free to read
      </h2>
      <p className="max-w-2xl text-base text-cocoa-700 leading-relaxed mb-8">
        Paid tiers add deeper quartiles, saved cells, comparison, and the data
        out of the page. Here is the short version.
      </p>
      <div className="overflow-x-auto rounded-lg border border-parchment bg-white max-w-3xl">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left px-4 py-3 text-[11px] tracking-[0.16em] uppercase font-semibold text-cocoa-700/85">
                Feature
              </th>
              {cols.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="text-center px-4 py-3 text-[11px] tracking-[0.12em] uppercase font-semibold text-cocoa-700/85"
                  style={{ width: "20%" }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([label, f, b, p]) => (
              <tr key={label} className="border-t border-parchment">
                <td className="px-4 py-3 text-ink-900">{label}</td>
                <td className="text-center px-4 py-3"><MiniCell v={f} /></td>
                <td className="text-center px-4 py-3"><MiniCell v={b} /></td>
                <td className="text-center px-4 py-3"><MiniCell v={p} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <a
        href={PRICING_HREF}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-atlas-700 hover:text-atlas-500 transition-colors"
      >
        See everything in each tier <span aria-hidden>&rarr;</span>
      </a>
    </section>
  );
}
