/**
 * THE HOME PAGE, AN INTRODUCTION OF THE CONCEPT (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 10; the spec
 * docs/superpowers/specs/2026-10-09-home-introduction-design.md in the design repo, approved as written on 2026-10-09). His words that
 * led to it: the home "is vastly problematic and not serving as an elegant introduction of the concept but rather: here is what we
 * have". One case runs through, a London restaurant, and the reader's own case follows it.
 *
 * The frame, in the order the page reads:
 *   the hero       his h1 (2026-08-16, "it was just perfect"; still since 2026-10-07, the gate hero-still), "restaurant" first among
 *                  its rotating words, the picker with no heading (his instruction of 2026-10-07), its examples links, and the one
 *                  plain line that says what the site is, at the hero's foot (clause 67); one of the page's two full widths, the band the other
 *   the example    the picker's own case in four steps, two halves of one level, even: "Restaurants in London" | "Does it pay?"
 *   Pro            only while the paywall's switch is on, quiet (ruling 23), after the answer
 *   the proofs     three doors, a level of three, even: what the site reads, keeps and works out
 *   the band       "Read from the record" (plan 2026-10-10, the home reformed to ship, Task 5; his request of 2026-10-10): what the UK
 *                  pages draw on, four counts in ink on the terracotta, its own zone and the page's second full width; no country, city
 *                  or trade-list count (src/lib/home/site_counts.ts, HomeRecord.tsx)
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
import { CityRows, CityRowsHead } from "@/components/spine/archetypes/CityRows";
import { buildCityCards, type CityCards as CityCardsData } from "@/lib/spine/city_cards";
import { isPaywallOn } from "@/lib/feature_flags";
import { ProBand } from "./ProBand";
import { HomePlace, HomePays } from "./HomeExample";
import { ProofJoins, ProofArchive, ProofTax } from "./HomeProofs";
import { HomeRecord } from "./HomeRecord";
import { buildWorkedExample } from "@/lib/home/worked_example";
import { buildProofs } from "@/lib/home/proofs";
import { buildSiteCounts } from "@/lib/home/site_counts";
import { WhereNext } from "@/components/spine/WhereNext";
import { nextDoors } from "@/lib/home/next_doors";
import { NavigatorForm } from "@/components/NavigatorForm";
import { HeroWords } from "./HeroWords";
import { homePickerSeed } from "@/lib/home/picker";
import { HERO_BUSINESSES, HERO_CITIES } from "@/lib/hero-words";
import { COPY } from "@/lib/spine/copy";
import { SourcesFoot } from "@/components/spine/SourcesFoot";
import { ReportFoot } from "@/components/spine/ReportFoot";
import { checkedDateForTrade } from "@/lib/spine/checked";
import type { LoudSeat } from "@/lib/spine/loud_seats";

/**
 * THE THREE LOUD MOMENTS (MODEL.md PART 6; plan 2026-10-10, the home reformed to ship, Task 5: the spec's decision 7 and its critique,
 * section 4): the answer, step 3's break-even at 40 (his ruling 3 of 2026-10-04: break-even leads a London trade page); then the band,
 * the site's own counts on the terracotta, a seat lit by its ground (FIELD: the zone is the moment and its figures stand in ink); the
 * foot ends quiet, doors and no figure. Three quiet cards stand between the two loud ones (the joins, the archive and the tax, which went
 * quiet for it; Pro when on). The search's button is no seat. Literals only, read from source (src/lib/spine/loud_seats.ts says why).
 */
export const LOUD_SEATS = [
  { seat: 1, card: "pays", id: "pays", figure: "the sales a London restaurant needs a year to break even, step 3 of the worked example, at 40", state: "LIT", condition: "plan 2026-10-09, home introduction (the spec's section 5): his ruling 3 of 2026-10-04, break-even leads a London trade page; the figure /gb/london/restaurants' masthead prints (londonTradeHero), `--terra-text` at 40, the page's only 40" },
  { seat: 2, card: "record", id: "record", figure: "the band Read from the record, four counts of what the UK pages draw on, in ink on its terracotta zone", state: "FIELD", condition: "plan 2026-10-10, the home reformed to ship (the spec's decision 7, critique section 4): his request of 2026-10-10 for one section in terracotta; the zone is the seat's moment, its figures in ink and never an accent; the tax proof went quiet so that three quiet cards stand between seat 1 and this one" },
  { seat: 3, card: "foot", figure: "none: the foot holds doors", state: "NO HONEST CANDIDATE", condition: "plan 2026-10-09, home introduction (the spec's section 5): the UK's cities and where to next are doors with no figure lit (his ruling of 2026-10-07: no counts); the page ends quiet" },
] as const satisfies readonly LoudSeat[];

/** The hero he kept: the visitor's own question, its business and its city rotating, then the search, then the one line that says what
 *  the site is. Left-aligned, as every band page's text is. THE QUESTION IS ASKED ONCE (his instruction of 2026-10-07): the h1 asks it,
 *  so the picker draws no heading of its own; the picker's "Try" line is its row of links, and the definition is the hero's one line.
 *  SET AND SPACED (plan 2026-10-10, home reform, Task 2; the spec's decision 3): the h1 on set lines, both words on one timer that
 *  stops (HeroWords); 32px from the h1 to the picker from 1024 and 16 on a phone (critique pass 2, fix round C2, item P2.9: with the picker's card at p-5 on a phone, the 375 first screen holds the definition 13px above the fold, where it held 1); the definition at the lead rung in ink2, at most 60
 *  characters and never past half the page (clause 51), 24px under the picker from 1024 and 16 below. The picker paints its case from
 *  the server's seed and loads its lists on first use (src/lib/home/picker.ts). */
function HomeSearch() {
  const C = COPY.home;
  return (
    <div data-hero="1">
      <section id="search" className="flex flex-col">
        <h1 className="font-display text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[var(--c-ink)] leading-[1.08]">
          <HeroWords lead={C.h1.lead} middle={C.h1.middle} businesses={HERO_BUSINESSES} cities={HERO_CITIES} />
        </h1>
        {/* The picker's wrapper. The id was read by the bar's Search while the bar kept it hidden under this card; the bar shows Search from the first paint now (critique pass 3, item P1.2), and tests/trust/home_shape.test.ts pins the id. */}
        <div id="home-search-anchor" className="relative z-30 mt-4 lg:mt-8 w-full">
          <NavigatorForm showHeading={false} seed={homePickerSeed()} />
        </div>
        {/* WHAT THE SITE IS, ONCE, AT THE HERO'S FOOT (the spec's sections 1, 3 and 7; clause 67, the model's seat for a page's one plain line): straight after the form, so the question, the reader's own case and the definition stand in the first screen. */}
        <p data-definition="" className="mt-4 lg:mt-6 max-w-[min(60ch,var(--measure-half))] text-[length:var(--t-lead)] leading-snug text-[var(--c-ink2)]">{C.definition}</p>
      </section>
    </div>
  );
}

/* THE UK'S CITIES, STILL (masterplan step 35; his refusal of carousels and pagination, 2026-09-22): every UK city the covered list gives
   a page (buildCityCards), at once, each its name and the figure its own page opens with, a door to that page. Since plan 2026-10-10
   (the home reformed to ship, Task 6) drawn by CityRows, a server component: the photographs in grey (the spec's decision 2), small
   copies with their landmark crops; two to a row under 768 with an eighth cell, "All UK cities", to /gb's cities (his ruling of
   2026-08-30); from 768 one row each on the doors' 56px pitch (its eighth slot All UK cities), so the two lists meet row for row. Its title an
   h2, as every section's on the home (one h2 a section). From 768 a column head, "Typical pay", stands over the figures in the title row (critique
   pass 3, fix round D2, item P2.2): the Box is `relative` so the head, which is out of flow, is laid over the title row, and the basis line
   under the rows goes from 768 (CityRows, CityRowsHead). */
function HomeCities({ cards }: { cards: CityCardsData }) {
  return (
    <Box id="cities" className="relative flex flex-col">
      <Rail icon="best-areas" kicker={COPY.home.citiesLabel} level={2} />
      <CityRowsHead>{COPY.home.citiesHead}</CityRowsHead>
      <CityRows cards={cards.cards} basis={COPY.cityCards.plain.basis} allHref="/gb#cities" allLabel={COPY.home.citiesAll} unit={COPY.home.citiesUnit} />
    </Box>
  );
}

export function SpineHomeBody({ data = null }: { data?: { iso2?: string } | null } = {}) {
  const example = buildWorkedExample();
  const proofs = buildProofs();
  const record = buildSiteCounts();
  const cities = buildCityCards(data?.iso2 ?? "GB");
  /* Each zone one line, so tests/trust/home_shape.test.ts reads its split, its evenness and its body together. The example and the
     proofs draw only where their case and their builders are whole; the band only where three of its counts build, drawing its own
     zone on the terracotta (HomeRecord); the foot always draws its doors. */
  const zones: Array<{ key: string; split: ZoneSplit; even?: boolean; cards?: boolean; tone?: "terra"; label: string; body: React.ReactNode[] }> = [
    { key: "search", split: "wide", label: COPY.home.searchLabel, body: [<HomeSearch key="search" />] },
    ...(example ? [{ key: "example", split: "1-1" as ZoneSplit, even: true, label: COPY.home.example.label, body: [<HomePlace key="place" ex={example} />, <HomePays key="pays" ex={example} />] }] : []),
    ...(isPaywallOn() ? [{ key: "pro", split: "2-1" as ZoneSplit, label: COPY.home.pro.kicker, body: [<ProBand key="pro" />] }] : []),
    ...(proofs ? [{ key: "proofs", split: "1-1-1" as ZoneSplit, even: true, cards: true, label: COPY.home.proofs.label, body: [<ProofJoins key="joins" p={proofs.joins} />, <ProofArchive key="archive" p={proofs.archive} />, <ProofTax key="tax" p={proofs.tax} />] }] : []),
    ...(record ? [{ key: "record", split: "wide" as ZoneSplit, tone: "terra" as const, label: COPY.home.record.label, body: [<HomeRecord key="record" record={record} />] }] : []),
    { key: "foot", split: "1-1", even: !!cities, label: COPY.home.citiesLabel, body: [...(cities ? [<HomeCities key="cities" cards={cities} />] : []), <WhereNext key="next" pitch title={COPY.home.next.title} doors={nextDoors("/")} />] },
  ];
  /* THE TONES ALTERNATE OVER THE ZONES THAT ARE NOT THE BAND (critique section 7): the band draws its own zone on the terracotta, so
     the zones either side of it keep the tones they had, the foot paper as before. */
  const toned = zones.filter((z) => z.tone !== "terra");
  return (
    <>
      <div data-spine-body data-composition="zones">
        {zones.map((z) =>
          z.tone === "terra" ? (
            <React.Fragment key={z.key}>{z.body}</React.Fragment>
          ) : (
            <Zone key={z.key} tone={zoneTone(toned.indexOf(z))} split={z.split} even={z.even} cards={z.cards} label={z.label}>
              {z.body}
            </Zone>
          ),
        )}
      </div>
      {/* THE LICENCE LINE AND ITS LINK (MODEL 10.8c: the home prints UK register figures), THEN REPORT A MISTAKE (masterplan step 31). */}
      <SourcesFoot iso2="GB" />
      <ReportFoot path="/" checked={example ? checkedDateForTrade("GB", "london", example.trade) : null} />
    </>
  );
}
