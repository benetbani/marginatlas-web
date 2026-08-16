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
      <SectionEyebrow size="md" className="mb-2">Same business, different place</SectionEyebrow>
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-3">
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
      <p className="max-w-2xl text-base text-cocoa-700 leading-relaxed mb-8">
        The same trade earns very differently depending on where it sits. Typical
        annual revenue for a single business, across four large US states: the
        one country where the atlas resolves this below national level today.{" "}
        <a href="/coverage" className="text-atlas-700 hover:text-atlas-900 font-medium">
          Where else it reaches
        </a>
        .
      </p>
      <div className="space-y-5">
        {comparisons.map((c) => (
          <div key={c.trade} className="atlas-card px-5 py-4">
            <div className="font-display text-base font-medium text-ink-900 mb-3">{c.trade}</div>
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
