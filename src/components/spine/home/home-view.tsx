/**
 * THE HOME PAGE ON THE BAND PAGE (milestone 3, masterplan step 32; his interview of 2026-09-26: 11, "a place-and-trade search,
 * then the UK's headline answers; the recommender later, ranked by one real figure, never a composite"; 23, "a quiet band after the
 * search and the UK answers: what Pro opens, the price, one button"; milestone 3, the two criticised sections replaced and the page
 * built to the UK page's standard; 2026-08-16, the hero's h1, "it was just perfect"; 2026-10-04, the band page).
 *
 * The frame, in the order the page reads, since his instruction of 2026-10-07 ("reform home drastically"; he called the live home
 * "catastrophically bad"): the h1 he kept, with its rotating words, and the search with no heading of its own (step 33 makes it
 * land on pages that exist, UK first); the UK's three answers, one name, one figure and one line each (step 34); the duel and the
 * kitchens list from the registers (P36.2, P36.2b); Pro said once and quietly while the paywall's switch is on (step 35); then,
 * since his section ideas of 2026-10-08 (plan docs/superpowers/plans/2026-10-08-home-sections/PLAN.md), three levels of two
 * halves: where new firms last beside the UK's city pages, still, every one at once (step 35); where new companies open beside
 * where US restaurants grew and shrank; and how figures are made beside the notebook (step 36), last. The cities stood
 * third and alone across the level until the visual gates' finding of 2026-10-07 (HomeCities says why). Gone that day: the counts
 * of what the atlas holds, the cities' pager and the newsletter band (the footer's bar asks). tests/trust/home_shape.test.ts holds
 * the order. Each level
 * is a zone (src/components/spine/zones.tsx); a level that has nothing to draw is not listed, so no band stands empty. No
 * chapters: a home page is not a reading in chapters. One 40 on the page, at the UK's answer (PART 4).
 *
 * Drawn by the root route's flagged branch (`isHomeReformEnabled()`), the harness surface `home` (page `home-gb`).
 */
import * as React from "react";
import { Zone, zoneTone, type ZoneSplit } from "@/components/spine/zones";
import { Box, Rail } from "@/components/spine/kit";
import { Focal } from "@/components/spine/country/focal";
import { SegmentBar } from "@/components/spine/archetypes/SegmentBar";
import { Ring } from "@/components/spine/archetypes/Ring";
import { WorldRangeRows } from "@/components/spine/charts/WorldRange";
import { usd } from "@/lib/spine/money";
import { provAttrs } from "@/lib/spine/provenance";
import { buildHomeAnswers, type HomeAnswer } from "@/lib/spine/home_answers";
import { CityCards } from "@/components/spine/archetypes/CityCards";
import { buildCityCards, type CityCards as CityCardsData } from "@/lib/spine/city_cards";
import { isPaywallOn } from "@/lib/feature_flags";
import { ProBand } from "./ProBand";
import { HomeDuel } from "./HomeDuel";
import { buildDuel } from "@/lib/home/duel";
import { HomeKitchens } from "./HomeKitchens";
import { buildKitchens } from "@/lib/home/kitchens";
import { buildNotebook, type NotebookCard } from "@/lib/home/notebook";
import { HomeFirmsLast } from "./HomeFirmsLast";
import { buildFirmsLast } from "@/lib/home/firms_last";
import { HomeNewCompanies } from "./HomeNewCompanies";
import { buildNewCompanies } from "@/lib/home/new_companies";
import { HomeUsRestaurants } from "./HomeUsRestaurants";
import { buildUsRestaurants } from "@/lib/home/us_restaurants";
import { HomeHowMade } from "./HomeHowMade";
import { buildHowMade } from "@/lib/home/how_made";
import { NavigatorForm } from "@/components/NavigatorForm";
import { RotatingWord } from "@/components/RotatingWord";
import { HERO_BUSINESSES, HERO_CITIES } from "@/lib/hero-words";
import { COPY } from "@/lib/spine/copy";
import { ReportFoot } from "@/components/spine/ReportFoot";
import type { LoudSeat } from "@/lib/spine/loud_seats";

/**
 * THE THREE LOUD MOMENTS (MODEL.md PART 6; masterplan step 32, and plan 2026-10-08, home sections): the UK's answer at 40 (step
 * 34), and two figures that each lead a measured ranking, the reason his featuring rule asks for: the UK city whose new firms last
 * longest, and the US metro that added the most full-service restaurants, each at 30 in the accent (Focal's `accent`). Quiet cards
 * stand between them (the years, the trades, the duel, the kitchens; the city rows, the new companies), PART 6's two at the least.
 * The search's button keeps the brand red his ruling of 2026-08-09 chose over the accent's orange, and the Pro band is quiet by
 * ruling 23 (masterplan step 37): neither is a seat any more. Literals only, read from source (src/lib/spine/loud_seats.ts says why).
 */
export const LOUD_SEATS = [
  { seat: 1, card: "00 answer", figure: "the UK's total effective tax burden on a sole trader's profit, at 40", state: "LIT", condition: "masterplan step 34: the same figure /gb's masthead prints (buildHeroBoard), `--terra-text` at 40, the page's only 40" },
  { seat: 2, card: "firms-last", id: "firms-last", figure: "of 100 firms born in the cohort, those still trading five years on, in the UK city that leads, at 30", state: "LIT", condition: "plan 2026-10-08, home sections, section 1: the city leads a measured ranking of the UK's cities (buildFirmsLast; a tie features nobody and the section is not drawn), `--terra-text` at 30 through Focal's accent" },
  { seat: 3, card: "us-restaurants", id: "us-restaurants", figure: "the full-service restaurants the leading US metro added since the first year on disk, at 30", state: "LIT", condition: "plan 2026-10-08, home sections, section 3: the metro leads a measured ranking of 44 by restaurants added (buildUsRestaurants; a tie features nobody and the section is not drawn), `--terra-text` at 30 through Focal's accent" },
] as const satisfies readonly LoudSeat[];

/** The hero he kept: the visitor's own question, its business and its city rotating, then the search. Left-aligned, as every
 *  band page's text is (the page laws' ALIGNMENT): the words he ruled on are kept, the centring was the old page's. Not a section
 *  card (masterplan step 37): the page's question and a form, no figure, so it stands as the hero band itself, as the country
 *  page's masthead stands on its own band. THE QUESTION IS ASKED ONCE (his instruction of 2026-10-07, "reform home drastically"):
 *  the h1 asks it, so the picker draws no heading of its own and no subtitle stands between them; the picker's "Try" line is the
 *  zone's one supporting line. */
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
      </section>
    </div>
  );
}

/* THE UK'S ANSWERS, EACH A DOOR TO ITS SECTION OF /gb (masterplan step 34): the section's name and figure as /gb prints them
   (src/lib/spine/home_answers.ts), stamped with where the figure came from, the whole card the link (it keeps its box: a door).
   ONE NAME, ONE FIGURE, ONE LINE A CARD (his instruction of 2026-10-07, "reform home drastically"): the rows went, and what
   stands beside each figure is its drawing, which says it again without a word (clause 65, a figure is never alone): the tax
   burden's 40 in the accent over the masthead's own bar, the middle trade's 30 on the range of London's trades, the share still
   trading as a ring with its figure inside. The three end level: the zone stretches them (`even`) and each drawing stands at its
   card's foot, so the height a shorter card is given opens above the drawing and never pools under it. Each card written out
   with its own id and archetypes, so the census and the coverage gate read it. */
const DOOR = "tap-y flex h-full flex-col text-[var(--c-ink)] no-underline";

function TaxAnswer({ a }: { a: HomeAnswer }) {
  return (
    <Box id="answer" keep className="flex flex-col">
      <a href={a.href} data-lands={a.lands} className={DOOR}>
        <Rail icon={a.icon} kicker={a.kicker} />
        <div className="mb-4">
          <div data-hero-figure className="fig text-[length:var(--t-answer)] leading-none text-[var(--terra-text)]" {...provAttrs(a.prov)}>
            {a.figure}
          </div>
          <p data-focal-words="" className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{a.words}</p>
        </div>
        {a.bar ? (
          <div data-answer-bar className="mt-auto max-w-[28ch]">
            <SegmentBar bare label={a.bar.aria} value={a.bar.value} figure={a.figure} unit="" part={a.bar.part} rest={a.bar.rest} />
          </div>
        ) : null}
      </a>
    </Box>
  );
}

function TradesAnswer({ a }: { a: HomeAnswer }) {
  return (
    <Box id="trades" keep className="flex flex-col">
      <a href={a.href} data-lands={a.lands} className={DOOR}>
        <Rail icon={a.icon} kicker={a.kicker} />
        <Focal figure={a.figure} words={a.words} prov={a.prov} />
        {/* ONE FIGURE ON THE CARD: the middle trade's, at 30 above. The range's two ends ($104K and $1.0M) stood unlabelled beside the
            drawing and read as two more figures, so they are not drawn (`showEnds={false}`); the drawing, the dot among the
            trades, is the card's second reading. */}
        {a.range ? (
          <div className="mt-auto">
            <WorldRangeRows headless showEnds={false} rows={[{ key: "trades", label: a.kicker, display: a.figure, value: a.range.range.median, range: a.range.range, fmt: usd, hairlines: a.range.values, among: COPY.home.tradesAmong }]} />
          </div>
        ) : null}
      </a>
    </Box>
  );
}

function YearsAnswer({ a }: { a: HomeAnswer }) {
  return (
    <Box id="years" keep className="flex flex-col">
      <a href={a.href} data-lands={a.lands} className={DOOR}>
        <Rail icon={a.icon} kicker={a.kicker} />
        {a.ring != null ? (
          <div className="mt-auto">
            <Ring value={a.ring} figure={a.figure} caption={a.words} prov={a.prov} />
          </div>
        ) : (
          <Focal figure={a.figure} words={a.words} prov={a.prov} />
        )}
      </a>
    </Box>
  );
}

/* THE UK'S CITIES, STILL (masterplan step 35; his instruction of 2026-10-07, "reform home drastically"; his refusal of carousels
   and pagination, 2026-09-22): every UK city the covered list gives a page (buildCityCards, his field look with the city's
   photograph), at once, each its name and the figure its own page opens with, a door to that page. No pager, no region line, no
   link to the world's list (so no `allHref`): the list is the UK's cities, all of them. The counts beside it left with it
   (benchmarks, countries, cities, districts, trades): the cities count took in the non-UK city pages, which are not indexed.

   IN A HALF, ONE ROW EACH (`stack`; the visual gates' finding of 2026-10-07 at e0180d6d, section-bands `home` 0 to 1). The section
   first stood alone across the whole level, a row of seven tall cards, and the section-bands gate bars that: its header,
   "for every subsection that stretches left to right full width, I think we should ban it except hero section" (the founder,
   2026-08-25), and the page has one hero, the search, declared with data-hero. The gate recognises no wide form, so marking this
   row a hero would have been a way round the rule and not a declaration under it, and the baseline may only come down. The
   other way is the founder's own pattern (two-up bands, "never one lone section per horizontal band", 2026-06-18): the section
   stands in a half, beside where new firms last (it stood beside the notebook until plan 2026-10-08 moved the notebook to the last
   level), and a half cannot hold a row of seven tall cards (132 a card is the least that holds "Birmingham" at the name's rung,
   and a half is 504 at the widest), so it takes the archetype's own row form, which the tall law exempts, at every width. Since
   plan 2026-10-08 the rows share the height the pair is given (`fill`), as the bars beside them do, so neither half stands a blank
   foot. */
function HomeCities({ cards }: { cards: CityCardsData }) {
  return (
    <Box id="cities" className="flex flex-col">
      <Rail icon="best-areas" kicker={COPY.home.citiesLabel} />
      <CityCards still stack fill cards={cards.cards.map((c) => ({ ...c, region: undefined }))} basis={COPY.cityCards.plain.basis} />
    </Box>
  );
}

/* THE NOTEBOOK (masterplan step 36): the posts kept for the home page (src/lib/home/notebook.ts), the newest of each category,
   each a link. Furniture, not a reading: no figure, so it stands outside the section cards. EACH POST IS ITS TITLE (his
   instruction of 2026-10-07, the home's words cut by half): the category over it was a second label (the eyebrow his rulebook
   bans) and the four dates were one date said four times; the post itself carries both. ONE COLUMN, AN 8 APART, since 2026-10-07:
   it stands in a half beside how figures are made (since plan 2026-10-08; beside the UK's cities until then), and FILLS ITS HALF:
   the level ends level (`even`, the zones' rule; his rulings that blank space is a fault and that cards in a row share a
   height), so the section takes the height the pair is given, the list takes
   what is left under the title (`flex-1`), and the four posts share it in equal rows (`md:auto-rows-fr`), each title at its card's
   top. Stacked under 768 there is no pair to match and the posts keep their own heights. */
function Notebook({ cards }: { cards: NotebookCard[] }) {
  return (
    <section data-notebook="" aria-labelledby="notebook-title" className="flex flex-col">
      <h2 id="notebook-title" data-typography="custom" className="text-[length:var(--t-head)] font-semibold leading-snug tracking-tight text-[var(--c-ink)]">
        {COPY.home.notebook.title}
      </h2>
      <ul className="mt-4 grid flex-1 grid-cols-1 gap-2 md:auto-rows-fr">
        {cards.map((c) => (
          <li key={c.slug}>
            <a href={c.href} className="tap-y flex h-full flex-col rounded-[12px] border border-[var(--c-border)] bg-[var(--c-card)] px-4 py-4 text-[var(--c-ink)] no-underline transition-colors hover:border-[var(--c-ink2)]">
              <span className="text-[length:var(--t-body)] font-semibold leading-snug">{c.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AnswerDoor({ a }: { a: HomeAnswer }) {
  return a.key === "answer" ? <TaxAnswer a={a} /> : a.key === "trades" ? <TradesAnswer a={a} /> : <YearsAnswer a={a} />;
}

export function SpineHomeBody({ data = null }: { data?: { iso2?: string } | null } = {}) {
  const answers = buildHomeAnswers(data?.iso2 ?? "GB");
  const cities = buildCityCards(data?.iso2 ?? "GB");
  const notebook = buildNotebook();
  const duel = buildDuel();
  const kitchens = buildKitchens();
  const last = buildFirmsLast();
  const newCompanies = buildNewCompanies();
  const usRestaurants = buildUsRestaurants();
  const howMade = buildHowMade();
  const zones: Array<{ key: string; split: ZoneSplit; stack?: "lg"; even?: boolean; label: string; body: React.ReactNode[] }> = [
    { key: "search", split: "wide", label: COPY.home.searchLabel, body: [<HomeSearch key="search" />] },
    /* THE UK'S ANSWERS, A LEVEL OF THREE (PART 10.5; masterplan step 34): the tax burden, who is still trading, what London's
       trades take (last, since 2026-10-07: from 768 to 1023 the third takes the whole row, and only the trades' range fills it),
       each a door to its section of /gb. */
    ...(answers.length ? [{ key: "answers", split: "1-1-1" as ZoneSplit, even: true, label: COPY.home.answersLabel, body: answers.map((a) => <AnswerDoor key={a.key} a={a} />) }] : []),
    /* THE DUEL AND THE RANKED LIST, SIDE BY SIDE (his rulings of 2026-10-05 on PARKED P36.2 and P36.2b; HOMEPAGE-EDITORIAL.md's
       order 3): which trades fail most, the set's two highest and two lowest on one scale, and where kitchens score five, the
       boroughs' three highest and three lowest, each from the registers' feed and each only while it is fresh (the 45-day rule).
       Both: one level at halves, even (ruling 7); one alone: two thirds (the zones' LONE rule). */
    ...(duel || kitchens
      ? [{
          key: "registers",
          split: (duel && kitchens ? "1-1" : "2-1") as ZoneSplit,
          even: !!(duel && kitchens),
          label: duel && kitchens ? COPY.home.registersLabel : (duel?.title ?? kitchens?.title ?? ""),
          body: [...(duel ? [<HomeDuel key="duel" duel={duel} />] : []), ...(kitchens ? [<HomeKitchens key="kitchens" kitchens={kitchens} oneColumn />] : [])],
        }]
      : []),
    /* PRO, SAID ONCE AND QUIETLY (ruling 23), only while the paywall's switch is on: the zone is not listed otherwise, so no band
       stands empty and nothing about Pro prints. */
    ...(isPaywallOn() ? [{ key: "pro", split: "2-1" as ZoneSplit, label: COPY.home.pro.kicker, body: [<ProBand key="pro" />] }] : []),
    /* THREE LEVELS OF TWO HALVES (plan 2026-10-08, home sections: his section ideas of that day, the audit's top four; his pattern,
       "never one lone section per horizontal band", 2026-06-18; the section-bands gate bars a full width that is not the hero, and
       the home's baseline is 0). Each is read through the zones' own rules: a level with one of its two to draw is a lone section at
       two thirds (the LONE rule), a level with neither is not listed. Pro, where it draws, still stands after the registers and
       before the first of them. The cities and world levels carry fixed level names (COPY.home.citiesLabel, COPY.home.worldLabel) and
       the last level is named by its first section (a data attribute the checks read, not a word the page prints).

       THE UK'S CITIES, AND WHERE THEIR NEW FIRMS LAST (section 1; HomeCities says why the cities stand in a half): the 2019 cohort's
       five-year survival per UK city, its lead one of the page's three loud moments, beside the UK's city pages held still. It ends
       level while both draw (`even`): the bars and the city rows each fill the height the taller gives the pair (`fill`). */
    ...(last || cities
      ? [{
          key: "cities",
          split: "1-1" as ZoneSplit,
          even: !!(last && cities),
          label: COPY.home.citiesLabel,
          body: [...(last ? [<HomeFirmsLast key="firms-last" last={last} />] : []), ...(cities ? [<HomeCities key="cities" cards={cities} />] : [])],
        }]
      : []),
    /* BEYOND THE UK (sections 2 and 3): where new companies open in Latin America and Africa, beside where US restaurants grew and
       shrank; each a published or counted figure, never the site's estimates. Open sections, each its own height (not `even`: a
       stretched list or table would stand a blank at its foot). */
    ...(newCompanies || usRestaurants
      ? [{
          key: "world",
          split: "1-1" as ZoneSplit,
          label: COPY.home.worldLabel,
          body: [...(newCompanies ? [<HomeNewCompanies key="new-companies" nc={newCompanies} />] : []), ...(usRestaurants ? [<HomeUsRestaurants key="us-restaurants" us={usRestaurants} />] : [])],
        }]
      : []),
    /* THE LAST LEVEL: HOW FIGURES ARE MADE BESIDE THE NOTEBOOK (section 4; masterplan step 36, the notebook last). The page's one
       place to say how its figures are made; quiet, no accent, no count of countries (his ruling of 2026-10-07: the home's 195
       counter is wrong). It ends level while both draw (`even`): the notebook's posts share the height in equal rows, as they did
       beside the cities. NO NEWSLETTER BAND AFTER IT (his instruction of 2026-10-07): the footer's newsletter bar asks once on every
       page. */
    ...(howMade || notebook.length
      ? [{
          key: "method",
          split: "1-1" as ZoneSplit,
          even: !!(howMade && notebook.length),
          label: howMade ? COPY.home.howMade.kicker : COPY.home.notebook.title,
          body: [...(howMade ? [<HomeHowMade key="how-made" how={howMade} />] : []), ...(notebook.length ? [<Notebook key="notebook" cards={notebook} />] : [])],
        }]
      : []),
  ];
  return (
    <>
      <div className="-mx-2 md:mx-0" data-spine-body data-composition="zones">
        {zones.map((z, i) => (
          <Zone key={z.key} tone={zoneTone(i)} split={z.split} stack={z.stack} even={z.even} label={z.label}>
            {z.body}
          </Zone>
        ))}
      </div>
      {/* REPORT A MISTAKE (masterplan step 31), as under every spine page; no date is held for the home page. */}
      <ReportFoot path="/" />
    </>
  );
}
