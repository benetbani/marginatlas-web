/**
 * StateComparison -- an honest like-for-like data story: the SAME trade compared
 * across four comparable large US states, with real revenue resolved live (a
 * trusted-local measurement, never a synthesized or cross-geography figure).
 * Self-omits when nothing resolves. Server component, tokens only.
 */
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import type { TradeComparison } from "@/lib/home/state_comparison";

export function StateComparison({ comparisons }: { comparisons: TradeComparison[] }) {
  if (comparisons.length < 1) return null;
  return (
    <section className="py-12 md:py-16">
      <SectionEyebrow tone="backdrop" size="md" className="mb-2">Same business, different place</SectionEyebrow>
      <h2 className="font-display text-lg md:text-xl font-medium tracking-tight text-ink-900 mb-3">
        What a typical business brings in, state by state
      </h2>
      {/* WHY IT SAYS "the one country". This band is four US states on the
          homepage of a world atlas, sitting between the world map and six
          districts picked across three continents, and nothing on it explained
          the jump. It reads as an American site that happens to list other
          places.

          The obvious upgrade, the same trade across four countries, was tried
          and does not resolve. Of eleven world cities probed directly, the
          non-US ones return one shared figure: restaurants come back as the
          same number, to the unit, for London, Paris, Tokyo, Berlin, Madrid,
          Milan and Amsterdam. This section's own distinctness check, which
          drops a trade whose values repeat, would throw all of it away. US
          state data is genuinely trusted-local and genuinely distinct, which is
          why the comparison is possible here and nowhere else yet.

          So the limit is stated rather than hidden. Naming where a thing works
          is the same habit as the ledger naming that two thirds of the
          benchmarks sit in five countries: a reader who learns the shape of the
          coverage from the homepage does not discover it from a thin page
          later. */}
      {/* CUT 39 WORDS TO 21, 2026-08-17, and the honesty is what survived.
          The opening sentence ("The same trade earns very differently
          depending on where it sits") restated the heading directly above it
          and then the cards below it proved the same point with figures, so it
          was said three times on one screen. The clause that stayed is the one
          nothing else on the page carries: that this is the only country the
          atlas resolves below national level. That is the limit, and per the
          note above it is stated rather than hidden. */}
      <p className="max-w-2xl text-sm text-cocoa-700 leading-relaxed mb-6">
        Typical annual revenue for one business, in the only country the atlas
        resolves below national level today.{" "}
        <a href="/coverage" className="text-atlas-700 hover:text-atlas-900 font-medium">
          Where else it reaches
        </a>
        .
      </p>
      <div className="space-y-5">
        {comparisons.map((c) => (
          <div key={c.trade} className="atlas-card px-5 py-4">
            {/* THE SPREAD LEADS, THE LIST FOLLOWS.
                This card was four numbers and a trade name, which left the
                reader to do the subtraction that is the entire point of putting
                them side by side. The founder's rule for a catalog concept is
                that it must not be "slammed like a list of elements": the list
                is the evidence, the sentence is the claim.

                Deliberately NOT extended with what the owner keeps, which was
                the first idea. Measured across all four states: restaurants
                keep 11.3% of revenue in every one of them, and coffee shops the
                same, because the margin comes from the industry model rather
                than the place. A take-home column would be revenue multiplied
                by a constant, presented as though the place had moved it. */}
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <div className="font-display text-base font-medium text-ink-900">{c.trade}</div>
              <div className="text-sm text-graphite">
                <span className="font-semibold text-atlas-700 tabular-nums">
                  {c.spreadPct}% more
                </span>{" "}
                in {c.topState} than {c.bottomState}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {c.rows.map((r) => (
                <a key={r.href} href={r.href} className="group block">
                  <div className="text-xs text-cocoa-700/80">{r.state}</div>
                  <div className="font-display text-lg tabular-nums text-ink-900 group-hover:text-atlas-700 transition-colors">{r.revenue}</div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
