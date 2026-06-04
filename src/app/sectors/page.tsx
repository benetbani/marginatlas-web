/**
 * Sectors directory - /sectors.
 *
 * Reformation (bible Section 14, the Industry directory row: "browse sectors"
 * with key modules "sectors, margins, capital, survival", whose stated thing to
 * avoid is an "alphabetical dump only"). The page now leads with a blunt read
 * of what the directory is for, finding where the money is by sector, and
 * groups the sectors by where the money actually lands instead of listing them
 * flat. Each sector row carries the real signal the activity pages already
 * load: what the typical owner keeps, what it takes to start, and the spread
 * between the brightest and weakest activity inside it.
 *
 * The economics come from a pure synthesis module
 * (src/lib/scores/sector_economics) fed only the curated, cross-country-stable
 * margin table the activity pages use. It invents no numbers; a sector with no
 * readable margin structure degrades to a plain row (bible: hide weakness, no
 * apologetic placeholder).
 *
 * URL, metadata, and revalidate are preserved. Every /sectors/{id} and
 * /industries/{slug} link is unchanged.
 */
import {
  visibleSectors,
  visibleIndustriesInSector,
  industryToSlug,
  type Industry,
  type Sector,
} from "@/lib/taxonomy";
import {
  buildSectorEconomics,
  classifySector,
  SECTOR_TIERS,
  SECTOR_TIER_ORDER,
  type SectorEconomics,
  type SectorSignalTone,
  type SectorTier,
} from "@/lib/scores/sector_economics";
import { SectorIcon } from "@/components/icons/SectorIcon";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export const revalidate = 86400;

export const metadata = {
  title: "Browse categories | Margin Atlas",
  description: "All 20 small-business categories, in master-menu order.",
};

/** Tone word color for the qualitative margin / capital bands. */
function toneText(tone: SectorSignalTone): string {
  switch (tone) {
    case "good":
      return "text-moss-700";
    case "bad":
      return "text-clay-700";
    default:
      return "text-atlas-700";
  }
}

/**
 * One sector, rendered as an editorial directory row: the name and count, the
 * qualitative economics read, and the activities themselves as inline links so
 * the row stays a usable index. Each clause self-omits when its data is thin.
 */
function SectorRow({
  sector,
  industries,
  econ,
}: {
  sector: Sector;
  industries: Industry[];
  econ: SectorEconomics | null;
}) {
  return (
    <article className="border-t border-parchment py-8 md:py-9 grid md:grid-cols-[230px_1fr] gap-5 md:gap-10">
      <div className="md:pt-1">
        <div className="flex items-center gap-3">
          <span className="text-atlas-700 shrink-0" aria-hidden>
            <SectorIcon sectorId={sector.id} size={28} weight="duotone" />
          </span>
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-ink-900 leading-tight">
            <a
              href={`/sectors/${sector.id}`}
              className="hover:text-atlas-700 transition-colors"
            >
              {sector.name}
            </a>
          </h3>
        </div>
        <p className="mt-2 text-[13px] text-cocoa-700/80 tabular-nums">
          {industries.length} activities
        </p>

        {/* The economics read: what the typical owner keeps and what it takes
            to start, each as a qualitative word. Self-omits when the sector has
            no readable margin structure. */}
        {econ && (econ.keep || econ.capital) ? (
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
            {econ.keep ? (
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-[0.14em] text-cocoa-500">
                  Owner keeps
                </dt>
                <dd
                  className={`mt-0.5 font-serif text-lg capitalize leading-none ${toneText(
                    econ.keep.tone,
                  )}`}
                >
                  {econ.keep.word}
                </dd>
              </div>
            ) : null}
            {econ.capital ? (
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-[0.14em] text-cocoa-500">
                  Capital to start
                </dt>
                <dd
                  className={`mt-0.5 font-serif text-lg capitalize leading-none ${toneText(
                    econ.capital.tone,
                  )}`}
                >
                  {econ.capital.word}
                </dd>
              </div>
            ) : null}
          </dl>
        ) : null}
      </div>

      <div className="self-start">
        {/* The blunt one-line read of the sector's internal spread. Names the
            brightest and the weakest activity so the reader sees that one
            sector label can hide very different businesses. */}
        {sector.tagline ? (
          <p className="text-sm text-graphite leading-relaxed mb-3">
            {sector.tagline}.
          </p>
        ) : null}

        {econ && econ.best && econ.worst ? (
          <p className="text-sm text-ink-900 leading-relaxed mb-4 max-w-2xl">
            Inside it, the money is not evenly spread:{" "}
            <span className="font-medium text-moss-700">{econ.best.name}</span>{" "}
            keeps the most,{" "}
            <span className="font-medium text-clay-700">{econ.worst.name}</span>{" "}
            the least. The label is a starting point, not the answer.
          </p>
        ) : null}

        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {industries.map((ind) => (
            <a
              key={ind.id}
              href={`/industries/${industryToSlug(ind.id)}`}
              className="text-[15px] text-cocoa-700 hover:text-atlas-700 transition-colors"
            >
              {ind.name}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function SectorsIndex() {
  const sectors = visibleSectors({});

  // Build each sector's visible activity list and its economic profile once,
  // then sort sectors into the three reading groups. Pure compute, no queries.
  const enriched = sectors.map((s) => {
    const industries = visibleIndustriesInSector(s.id, {});
    const econ = buildSectorEconomics(industries);
    return { sector: s, industries, econ, tier: classifySector(econ) };
  });

  const byTier: Record<SectorTier, typeof enriched> = {
    keeps_the_most: [],
    real_but_earned: [],
    thin_or_heavy: [],
  };
  for (const row of enriched) byTier[row.tier].push(row);

  // Within a group, lead with the sectors carrying the most activities: the
  // deepest part of the directory reads first.
  for (const tier of SECTOR_TIER_ORDER) {
    byTier[tier].sort((a, b) => b.industries.length - a.industries.length);
  }

  const totalActivities = enriched.reduce((n, x) => n + x.industries.length, 0);

  return (
    <div>
      <nav aria-label="Breadcrumb" className="text-sm text-cocoa-700/70 mb-6 pt-2">
        <a href="/" className="hover:text-atlas-700">
          Home
        </a>
        <span className="mx-2 text-cocoa-300">/</span>
        <span className="text-ink-900">Sectors</span>
      </nav>

      <header className="max-w-3xl">
        <SectionEyebrow size="md" className="mb-3">
          The directory
        </SectionEyebrow>
        <h1 className="font-display text-4xl md:text-5xl lg:text-[3.3rem] font-semibold tracking-tight text-ink-900 leading-[1.04]">
          Find where the money is, by sector
        </h1>
        <p className="mt-5 text-lg md:text-xl text-graphite leading-relaxed">
          Every kind of small business we cover, grouped by where the money
          actually lands, not by alphabet.{" "}
          <span className="text-ink-900">
            Some sectors keep a real share for the owner on light capital. Others
            run on a few cents per dollar or need serious money on the floor
            before the first sale.
          </span>{" "}
          The read below is the same wherever you operate. Pick a sector to see
          its activities, then open one to see the figures for a place.
        </p>
        <p className="mt-4 text-sm text-cocoa-700/85 tabular-nums">
          <span className="text-ink-900 font-medium">{totalActivities}</span>{" "}
          activities across{" "}
          <span className="text-ink-900 font-medium">{enriched.length}</span>{" "}
          sectors.
        </p>
      </header>

      {/* The three reading groups. Each is a real section with a real heading;
          a group with no sectors self-omits. The grouping is the editorial
          spine that replaces the alphabetical card dump. */}
      <div className="mt-12 md:mt-16 space-y-14 md:space-y-20">
        {SECTOR_TIER_ORDER.map((tier) => {
          const rows = byTier[tier];
          if (rows.length === 0) return null;
          const meta = SECTOR_TIERS[tier];
          return (
            <section key={tier} aria-labelledby={`tier-${tier}`}>
              <div className="max-w-3xl">
                <h2
                  id={`tier-${tier}`}
                  className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink-900 leading-tight"
                >
                  {meta.title}
                </h2>
                <p className="mt-3 text-base text-graphite leading-relaxed">
                  {meta.blurb}
                </p>
              </div>
              <div className="mt-6 md:mt-8">
                {rows.map(({ sector, industries, econ }) => (
                  <SectorRow
                    key={sector.id}
                    sector={sector}
                    industries={industries}
                    econ={econ}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-16 pt-8 border-t border-parchment text-xs text-cocoa-700/70 max-w-2xl leading-relaxed">
        Hidden by default: five sectors dominated by very large firms (banking,
        oil and gas, pharma, telecom carriers, hospitals and universities). The
        small-business read does not apply cleanly to them.
      </p>
    </div>
  );
}
