/**
 * THE HOME PAGE, AN INTRODUCTION OF THE CONCEPT (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 10; the spec
 * docs/superpowers/specs/2026-10-09-home-introduction-design.md in the design repo, approved as written on 2026-10-09). His words that
 * led to it: the home "is vastly problematic and not serving as an elegant introduction of the concept but rather: here is what we
 * have". One case runs through, a London restaurant, and the reader's own case follows it.
 *
 * The frame, in the order the page reads:
 *   the hero       his h1 (2026-08-16, "it was just perfect"; still since 2026-10-07, the gate hero-still), "restaurant" first among
 *                  its rotating words, the picker with no heading (his instruction of 2026-10-07), its examples links, and the one
 *                  plain line that says what the site is, at the hero's foot (clause 67); the one full width (section-bands)
 *   the example    the picker's own case in four steps, two halves of one level, even: "Restaurants in London" | "Does it pay?"
 *   Pro            only while the paywall's switch is on, quiet (ruling 23), after the answer
 *   the proofs     three doors, a level of three, even: what the site reads, keeps and works out
 *   the foot       the UK's cities, still, beside where to next: doors, no counts (his ruling of 2026-10-07)
 * then the licence line and its link to the sources (MODEL 10.8c: the home prints UK register figures), then Report a mistake.
 *
 * Gone from the home since the plan, each to the page it belongs on: the UK's three answer cards (the tax became the third proof; the
 * years and the trades stay on /gb, their source); which trades fail most and where new firms last (/gb's chapter 04); the kitchen list
 * (London's page, when the city-page study places it; its builder and feed item kept); new companies and US restaurants
 * (/new-businesses); how figures are made (its join the first proof, its London trade pages a line on About the figures); the notebook
 * (a door of where to next). The retired components are in _archive/2026-10-09-home/. tests/trust/home_shape.test.ts holds the order.
 * Each level is a zone (src/components/spine/zones.tsx); a level with nothing to draw is not listed. One 40 on the page, step 3's.
 *
 * Drawn by the root route's flagged branch (`isHomeReformEnabled()`), the harness surface `home` (page `home-gb`).
 */
import * as React from "react";
import { Zone, zoneTone, type ZoneSplit } from "@/components/spine/zones";
import { Box, Rail } from "@/components/spine/kit";
import { CityCards } from "@/components/spine/archetypes/CityCards";
import { buildCityCards, type CityCards as CityCardsData } from "@/lib/spine/city_cards";
import { isPaywallOn } from "@/lib/feature_flags";
import { ProBand } from "./ProBand";
import { HomePlace, HomePays } from "./HomeExample";
import { ProofJoins, ProofArchive, ProofTax } from "./HomeProofs";
import { buildWorkedExample } from "@/lib/home/worked_example";
import { buildProofs } from "@/lib/home/proofs";
import { WhereNext } from "@/components/spine/WhereNext";
import { nextDoors } from "@/lib/home/next_doors";
import { NavigatorForm } from "@/components/NavigatorForm";
import { RotatingWord } from "@/components/RotatingWord";
import { HERO_BUSINESSES, HERO_CITIES } from "@/lib/hero-words";
import { COPY } from "@/lib/spine/copy";
import { SourcesFoot } from "@/components/spine/SourcesFoot";
import { ReportFoot } from "@/components/spine/ReportFoot";
import type { LoudSeat } from "@/lib/spine/loud_seats";

/**
 * THE THREE LOUD MOMENTS (MODEL.md PART 6; the spec's section 5): the answer, step 3's break-even at 40 (his ruling 3 of 2026-10-04:
 * break-even leads a London trade page), and the decision-relevant proof, the tax at 30 (lit on /gb too). The foot ends quiet: doors and
 * no figure. Two quiet cards (the joins, the archive; Pro when on) stand between the two loud ones, which is why the tax proof stands
 * last. The search's brand-red button is no seat. Literals only, read from source (src/lib/spine/loud_seats.ts says why).
 */
export const LOUD_SEATS = [
  { seat: 1, card: "pays", id: "pays", figure: "the sales a London restaurant needs a year to break even, step 3 of the worked example, at 40", state: "LIT", condition: "plan 2026-10-09, home introduction (the spec's section 5): his ruling 3 of 2026-10-04, break-even leads a London trade page; the figure /gb/london/restaurants' masthead prints (londonTradeHero), `--terra-text` at 40, the page's only 40" },
  { seat: 2, card: "tax", id: "tax", figure: "the UK's total effective tax burden on a sole trader's profit, the third proof, at 30", state: "LIT", condition: "plan 2026-10-09, home introduction (the spec's section 5): the decision-relevant figure of the three proofs, lit on /gb too; the figure /gb's masthead prints (buildHeroBoard), `--terra-text` at 30 through Focal's accent" },
  { seat: 3, card: "foot", figure: "none: the foot holds doors", state: "NO HONEST CANDIDATE", condition: "plan 2026-10-09, home introduction (the spec's section 5): the UK's cities and where to next are doors with no figure lit (his ruling of 2026-10-07: no counts); the page ends quiet" },
] as const satisfies readonly LoudSeat[];

/** The hero he kept: the visitor's own question, its business and its city rotating, then the search, then the one line that says what
 *  the site is. Left-aligned, as every band page's text is. THE QUESTION IS ASKED ONCE (his instruction of 2026-10-07): the h1 asks it,
 *  so the picker draws no heading of its own; the picker's "Try" line is its row of links, and the definition is the hero's one line. */
function HomeSearch() {
  const C = COPY.home;
  return (
    <div data-hero="1">
      <section id="search" className="flex flex-col">
        <h1 className="font-display text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[var(--c-ink)] leading-[1.08]">
          {C.h1.lead}{" "}
          <span className="text-atlas-700">
            <RotatingWord words={HERO_BUSINESSES as unknown as string[]} />
          </span>{" "}
          {C.h1.middle}{" "}
          <span className="text-atlas-700">
            <RotatingWord words={HERO_CITIES as unknown as string[]} />
          </span>
          ?
        </h1>
        {/* The id the header's search reads: while this card is on screen the header keeps its own search hidden. */}
        <div id="home-search-anchor" className="relative z-30 mt-5 w-full">
          <NavigatorForm showHeading={false} />
        </div>
        {/* WHAT THE SITE IS, ONCE, AT THE HERO'S FOOT (the spec's sections 1, 3 and 7; clause 67, the model's seat for a page's one plain line): straight after the form, so the question, the reader's own case and the definition stand in the first screen. */}
        <p data-definition="" className="mt-5 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{C.definition}</p>
      </section>
    </div>
  );
}

/* THE UK'S CITIES, STILL (masterplan step 35; his refusal of carousels and pagination, 2026-09-22): every UK city the covered list gives
   a page (buildCityCards, his field look with the city's photograph), at once, each its name and the figure its own page opens with, a
   door to that page; in the foot's left half, one row each (`stack`), sharing the height the level gives the pair (`fill`), so neither
   half stands a blank foot. Its title an h2, as every section's on the home (one h2 a section). */
function HomeCities({ cards }: { cards: CityCardsData }) {
  return (
    <Box id="cities" className="flex flex-col">
      <Rail icon="best-areas" kicker={COPY.home.citiesLabel} level={2} />
      <CityCards still stack fill cards={cards.cards.map((c) => ({ ...c, region: undefined }))} basis={COPY.cityCards.plain.basis} />
    </Box>
  );
}

export function SpineHomeBody({ data = null }: { data?: { iso2?: string } | null } = {}) {
  const example = buildWorkedExample();
  const proofs = buildProofs();
  const cities = buildCityCards(data?.iso2 ?? "GB");
  /* Each zone one line, so tests/trust/home_shape.test.ts reads its split, its evenness and its body together. The example and the
     proofs draw only where their case and their builders are whole; the foot always draws its doors. */
  const zones: Array<{ key: string; split: ZoneSplit; even?: boolean; label: string; body: React.ReactNode[] }> = [
    { key: "search", split: "wide", label: COPY.home.searchLabel, body: [<HomeSearch key="search" />] },
    ...(example ? [{ key: "example", split: "1-1" as ZoneSplit, even: true, label: COPY.home.example.label, body: [<HomePlace key="place" ex={example} />, <HomePays key="pays" ex={example} />] }] : []),
    ...(isPaywallOn() ? [{ key: "pro", split: "2-1" as ZoneSplit, label: COPY.home.pro.kicker, body: [<ProBand key="pro" />] }] : []),
    ...(proofs ? [{ key: "proofs", split: "1-1-1" as ZoneSplit, even: true, label: COPY.home.proofs.label, body: [<ProofJoins key="joins" p={proofs.joins} />, <ProofArchive key="archive" p={proofs.archive} />, <ProofTax key="tax" p={proofs.tax} />] }] : []),
    { key: "foot", split: "1-1", even: !!cities, label: COPY.home.citiesLabel, body: [...(cities ? [<HomeCities key="cities" cards={cities} />] : []), <WhereNext key="next" title={COPY.home.next.title} doors={nextDoors("/")} />] },
  ];
  return (
    <>
      <div className="-mx-2 md:mx-0" data-spine-body data-composition="zones">
        {zones.map((z, i) => (
          <Zone key={z.key} tone={zoneTone(i)} split={z.split} even={z.even} label={z.label}>
            {z.body}
          </Zone>
        ))}
      </div>
      {/* THE LICENCE LINE AND ITS LINK (MODEL 10.8c: the home prints UK register figures), THEN REPORT A MISTAKE (masterplan step 31). */}
      <SourcesFoot iso2="GB" />
      <ReportFoot path="/" />
    </>
  );
}
