/**
 * Specimen , one real answer, shown rather than described.
 *
 * THE CONCEPTUAL GAP IT CLOSES. The founder, on the live page: "conceptually it
 * is still a disaster." The page had five ways of talking about the product,
 * what the atlas holds, what it can see, where it reaches, who it is for, what
 * it costs, and no way of showing one. Every reference it is measured against
 * does the opposite. A rental marketplace opens with real homes at real prices;
 * an airline opens with real routes at real fares. They put the goods in the
 * window. This page put up signage about the goods.
 *
 * So this is the goods. The h1 one band above makes a specific claim, "what a
 * small business earns, and what its owner actually keeps", and this answers it
 * once, in two real numbers, before a reader has typed anything.
 *
 * THE BAR IS THE ARGUMENT. Revenue is the whole width. What the owner keeps is
 * the terracotta sliver at the end of it. Half a million dollars through the
 * door and about a ninth of it reaching the person who owns the place is the
 * entire reason this site exists, and it is more persuasive as one true pair of
 * figures than as any amount of copy about method. The accent sits on the kept
 * share because the rulebook's rule for the accent is that it goes on the
 * answer, and the answer here is the small number, not the big one.
 *
 * Deliberately ONE. Six tiles follow it, and they are a different job: pick
 * another. This one is "here is what an answer is", which a reader can only be
 * shown once before it becomes a list.
 *
 * Self-omits when the specimen does not resolve, because a hedged specimen is
 * worse than none: it is the first number on the page a reader will check.
 */
import { fmtMoney } from "@/lib/format/money";
import type { Specimen as SpecimenData } from "@/lib/home/specimen";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export function Specimen({ specimen }: { specimen: SpecimenData | null }) {
  if (!specimen) return null;
  const { trade, place, href, revenue, takeHome, keptPct, } = specimen;

  return (
    <section className="py-10 md:py-14">
      <SectionEyebrow tone="backdrop" size="md" className="mb-2">
        What an answer looks like
      </SectionEyebrow>

      {/* .atlas-card, which this card was already imitating: it read
          `rounded-xl border border-parchment bg-white ...
          hover:border-atlas-300`. Three of the home page's link cards
          (ExampleTiles, NeighborhoodCards, the audience tiles) use the class;
          this one hand-rolled a flatter, opaque, differently-rounded near-copy
          with a hover of its own.

          The hover goes with it, deliberately. a.atlas-card:hover is the site's
          card gesture, a vermillion top edge with a 1px lift, and this is an
          anchor so it applies. `transition-colors` also had to go: it sets
          transition-property itself and would have replaced the class's own
          transition of box-shadow, border-color and transform, leaving the lift
          to snap. The focus ring is untouched. */}
      <a
        href={href}
        className="group atlas-card block px-5 py-6 md:px-8 md:py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          {/* Canonical section size, stepped down from text-2xl/3xl 2026-08-17.
              The two figures below are 2rem/2.5rem and they are the argument;
              a heading competing with them is the label shouting over the
              answer. Content carries the weight, which is the structure every
              reference page on this brief uses. */}
          <h2 className="font-display text-lg md:text-xl font-medium tracking-tight text-ink-900 group-hover:text-atlas-700 transition-colors">
            {trade} in {place}
          </h2>
          <span className="text-sm font-medium text-atlas-700">
            See the whole page <span aria-hidden>&rarr;</span>
          </span>
        </div>

        {/* The two ends of the headline sentence, side by side. Revenue is
            stated in ink; the kept figure carries the accent because it is the
            half nobody else publishes. */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cocoa-700/70">
              Takes in
            </div>
            <div className="mt-1 font-display text-[2rem] md:text-[2.5rem] leading-none tracking-tight tabular-nums text-ink-900">
              {fmtMoney(revenue)}
            </div>
            <div className="mt-1.5 text-xs text-cocoa-700/70">a year, typical single firm</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cocoa-700/70">
              The owner keeps
            </div>
            <div className="mt-1 font-display text-[2rem] md:text-[2.5rem] leading-none tracking-tight tabular-nums text-atlas-700">
              {fmtMoney(takeHome)}
            </div>
            <div className="mt-1.5 text-xs text-cocoa-700/70">
              after everything the business costs to run
            </div>
          </div>
        </div>

        {/* One bar: the whole is what comes through the door, the lit end is
            what stays. No axis, no legend, no percentage floating beside it.
            The figure is written into the sentence below instead, because a
            number a reader has to match to a colour is a number they skip. */}
        <div
          className="mt-7 h-3 w-full overflow-hidden rounded-full bg-paper-200"
          role="img"
          aria-label={`Of ${fmtMoney(revenue)} taken in, about ${fmtMoney(takeHome)} reaches the owner, ${keptPct} percent`}
        >
          <div
            className="h-full rounded-full bg-atlas-700"
            style={{ width: `${keptPct}%` }}
          />
        </div>

        {/* 35 words to 22, 2026-08-17. The kept-share FIGURE stays and so does
            the sentence that spends it, because that sentence is what the bar
            above means. What went is "That second number is the one this atlas
            exists to publish", which is the page describing its own mission
            underneath a live example of it: the institutional register the
            founder named, sitting directly on top of the one band that is
            already doing the showing. */}
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-graphite">
          <span className="text-ink-900">
            {keptPct}% of what comes through the door reaches the person who owns
            the place.
          </span>{" "}
          The rest is staff, rent, stock and tax.
        </p>
      </a>
    </section>
  );
}
