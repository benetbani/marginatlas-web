/**
 * HomepageHero
 * ============
 *
 * Design intent:
 *   - One visual anchor on the page: a calm question with two rotating words.
 *   - Numbers as the second focal point, on a single horizontal strip with
 *     a soft amber spotlight behind them.
 *   - The decorative texture is a dot grid, not a photograph or illustration.
 *
 * The hero is a server component. The rotating words live in a tiny client
 * island (RotatingWords) so the rest of the hero stays static. The map is
 * lazy-loaded via dynamic import to keep First Contentful Paint clean.
 */

import Link from "next/link";
import RotatingWords from "./RotatingWords";

// WorldMapPicker lives in its own homepage section
// (WorldMapSection) rather than nested inside the hero. Removed the
// lazy import to drop dead code.

// Rotator candidates: short, similar widths so the reserved slot stays
// compact. "software studio" was too long (15 chars) and forced the
// reserved slot to consume half the line.
const INDUSTRY_WORDS = ["restaurant", "coffee shop", "law firm", "bakery"];
const CITY_WORDS     = ["Tokyo", "Lagos", "Berlin", "Madrid"];

// Qualitative editorial strip. Replaces the original
// numeric totals strip ("196 countries, 223 industries...") per
// founder direction: never expose a country count, narrative is
// "the whole world".
type EditorialPillar = {
  label: string;
  blurb: string;
};

const PILLARS: EditorialPillar[] = [
  { label: "Whole world",        blurb: "Every country we can verify." },
  { label: "Every SMB industry", blurb: "From cafés to manufacturing." },
  { label: "Major cities",       blurb: "Sub-national depth where it matters." },
  { label: "One reference",      blurb: "Calm numbers, transparent sourcing." },
];

export type HomepageHeroProps = Record<string, never>;

export default function HomepageHero(_props?: HomepageHeroProps) {
  const heroSr =
    "How much does a small business make? Margin Atlas covers the whole world, every SMB industry, and the major cities inside each country.";

  return (
    <section
      aria-labelledby="atlas-hero-h1"
      className="relative atlas-dot-grid-dense overflow-hidden"
    >
      {/* Soft amber spotlight behind the stat strip */}
      <span
        aria-hidden="true"
        className="atlas-spotlight"
        style={{ top: "62%", left: "50%", transform: "translateX(-50%)", width: 880, height: 280 }}
      />

      <div className="mx-auto max-w-6xl px-6 pt-16 sm:pt-20 pb-12 sm:pb-16 relative">
        {/* Sub-tag */}
        <p className="text-xs uppercase tracking-[0.22em] font-semibold text-atlas-700">
          A global atlas of small business
        </p>

        {/* H1: two locked lines.
            - Line 1: "How much does a [INDUSTRY]"
            - Line 2: "make in [CITY]?"
            Each line is display:block + whitespace-nowrap, so the row
            count is exactly 2 regardless of which words are rotating.
            Only the two rotators change; nothing else moves.
            text-balance, overflow-wrap, and hyphens are deliberately
            NOT used here. Those rules were the cause of "coffee shop"
            and "New York" splitting mid-word in the earlier build. */}
        <h1
          id="atlas-hero-h1"
          className="font-display mt-5 sm:mt-6 text-[28px] sm:text-5xl md:text-6xl leading-[1.06] tracking-[-0.02em] font-semibold text-ink-900"
        >
          <span className="sr-only">{heroSr}</span>
          <span
            aria-hidden="true"
            className="block"
            style={{ whiteSpace: "nowrap" }}
          >
            How much does a{" "}
            <RotatingWords words={INDUSTRY_WORDS} cadenceMs={2400} ariaSrText="businesses" />
          </span>
          <span
            aria-hidden="true"
            className="block"
            style={{ whiteSpace: "nowrap" }}
          >
            make in{" "}
            <RotatingWords words={CITY_WORDS} cadenceMs={2400} startOffsetMs={1200} ariaSrText="cities" />
            <span>?</span>
          </span>
        </h1>

        {/* Subtitle, max 18 words */}
        <p className="mt-5 text-base sm:text-lg text-cocoa-700 leading-relaxed max-w-2xl">
          Atlas measures small-business revenue, margins, and operating costs across every country we can verify.
        </p>

        {/* Plan v30 — editorial pillar strip. Qualitative, no numbers
            (founder direction: never expose a country count). */}
        <div
          className="relative mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 sm:gap-x-10"
          role="list"
          aria-label="Margin Atlas at a glance"
        >
          {PILLARS.map((p) => (
            <Pillar key={p.label} label={p.label} blurb={p.blurb} />
          ))}
        </div>

        {/* CTA pair */}
        <div className="mt-10 sm:mt-12 flex flex-wrap items-center gap-3">
          <Link
            href="#country-picker"
            className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold bg-ink-900 text-white hover:bg-cocoa-700 transition-colors"
          >
            Pick a country
          </Link>
          <Link
            href="/sectors"
            className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold border border-cocoa-700/25 text-cocoa-700 hover:bg-parchment transition-colors"
          >
            Browse industries
          </Link>
        </div>
      </div>

    </section>
  );
}

function Pillar({ label, blurb }: { label: string; blurb: string }) {
  return (
    <div role="listitem" className="flex flex-col">
      <span className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-ink-900 leading-tight">
        {label}
      </span>
      <span className="mt-2 text-sm text-cocoa-700 leading-relaxed">
        {blurb}
      </span>
    </div>
  );
}
