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

/**
 * Two shapes, same table. "panel" drops the outer section padding and the
 * max-w-3xl so it fills its column in the two-up row it now shares with
 * AudienceBand. See the note in AudienceBand for why those two were paired.
 */
export function UpgradeTeaser({ variant = "band" }: { variant?: "band" | "panel" }) {
  const panel = variant === "panel";
  const cols = [
    "Free",
    `${TIERS.basic.name} $${TIERS.basic.priceMonthly}`,
    `${TIERS.premium.name} $${TIERS.premium.priceMonthly}`,
  ];
  return (
    <section className={panel ? "" : "py-12 md:py-16"}>
      <SectionEyebrow tone="backdrop" size="md" className="mb-2">Free and paid</SectionEyebrow>
      {/* One size in both shapes, and it is the page's canonical section size.
          The heading used to be two sizes chosen by variant, on top of the page
          already carrying two different section-heading scales. A page cannot
          have two section-heading sizes and this component cannot have two of
          its own on top of that. */}
      <h2 className="font-display text-lg md:text-xl font-medium tracking-tight text-ink-900 mb-3">
        Every benchmark is free to read
      </h2>
      {/* THE LEDE IS GONE, and it was a whole-paragraph restatement of the
          table two lines under it. It read "Paid tiers add deeper quartiles,
          saved cells, comparison, and the data out of the page. Here is the
          short version." The four things it listed are four of the six ROWS:
          "Lower and upper quartile (p25, p75)", "Saved cells", "Side-by-side
          comparison", "CSV export". So the sentence announced the table's
          contents in prose and then announced the table, which is the
          "explains a graphic the reader can see" cut in its purest form.

          Nothing checkable left with it. The prices are in the column heads,
          from the shared TIERS constant; the stance that reading is free is in
          the heading; the deeper detail is behind the link at the foot. 20
          words, zero figures, and the table starts sooner. */}
      {/* .atlas-card, not `rounded-lg border border-parchment bg-white`, which
          was the class by hand at the wrong radius (8px against --radius) with
          no seating shadow and a flat opaque white where the token surface is
          rgba(255,255,255,.955). With no centre plate in the frame, an opaque
          white is a hole punched in the photograph rather than a sheet laid on
          it. It also brings position: relative, which is what keeps a card
          above the frame's fixed layers.

          The hover lift does not apply here: that rule is scoped to
          a.atlas-card, button.atlas-card and .is-hover, and this is a div. */}
      <div className={`atlas-card overflow-x-auto ${panel ? "mt-5" : "mt-8 max-w-3xl"}`}>
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
