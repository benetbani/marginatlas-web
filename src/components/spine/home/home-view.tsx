/**
 * THE HOME PAGE ON THE BAND PAGE (milestone 3, masterplan step 32; his interview of 2026-09-26: 11, "a place-and-trade search,
 * then the UK's headline answers; the recommender later, ranked by one real figure, never a composite"; 23, "a quiet band after the
 * search and the UK answers: what Pro opens, the price, one button"; milestone 3, the two criticised sections replaced and the page
 * built to the UK page's standard; 2026-08-16, the hero's h1, "it was just perfect"; 2026-10-04, the band page).
 *
 * The frame, in the order the page reads: the h1 he kept, with its rotating words, and the search (step 33 makes it land on pages
 * that exist, UK first); then the UK's answers (step 34), the UK's cities and what the atlas holds (step 35), Pro said once and
 * quietly while the paywall's switch is on (step 35), the notebook and the newsletter (step 36). Each level is a zone
 * (src/components/spine/zones.tsx); a level that has nothing to draw is not listed, so no band stands empty. No chapters: a home
 * page is not a reading in chapters. One 40 on the page, at the UK's answer (PART 4), when step 34 seats it.
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
import { HomeNewsletter } from "@/components/home/HomeNewsletter";
import { buildNotebook, type NotebookCard } from "@/lib/home/notebook";
import { NavigatorForm } from "@/components/NavigatorForm";
import { RotatingWord } from "@/components/RotatingWord";
import { HERO_BUSINESSES, HERO_CITIES } from "@/lib/hero-words";
import { COPY } from "@/lib/spine/copy";
import { ReportFoot } from "@/components/spine/ReportFoot";
import type { LoudSeat } from "@/lib/spine/loud_seats";

/**
 * THE THREE LOUD MOMENTS (MODEL.md PART 6; the masterplan's step 32: the UK's answer at 40, the search's button, the Pro band's
 * button), weighed at step 37: the answer is lit (step 34); the search's button keeps the brand red his ruling of 2026-08-09
 * chose over the orange the accent token is, and the Pro band is quiet by ruling 23, so neither is an accent. One loud moment.
 * Literals only, read from source (src/lib/spine/loud_seats.ts says why).
 */
export const LOUD_SEATS = [
  { seat: 1, card: "00 answer", figure: "the UK's total effective tax burden on a sole trader's profit, at 40", state: "LIT", condition: "masterplan step 34: the same figure /gb's masthead prints (buildHeroBoard), `--terra-text` at 40, the page's only 40" },
  { seat: 2, card: "00 search", figure: "the search's button", state: "NO HONEST CANDIDATE", condition: "masterplan step 37: the button keeps the brand red, atlas-700, which his ruling of 2026-08-09 set against the orange that stood there; the accent token is that orange, so the button cannot be lit in it" },
  { seat: 3, card: "pro", figure: "the Pro band's button", state: "NO HONEST CANDIDATE", condition: "masterplan step 37, ruling 23: a quiet band, drawn only while the paywall's switch is on, its button in ink and never the accent" },
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
        {a.range ? (
          <div className="mt-auto">
            <WorldRangeRows headless rows={[{ key: "trades", label: a.kicker, display: a.figure, value: a.range.range.median, range: a.range.range, fmt: usd, hairlines: a.range.values, among: COPY.home.tradesAmong }]} />
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
   photograph), at once and in one row from 1280, each its name and the figure its own page opens with, a door to that page. No
   pager, no region line, no link to the world's list: the row is the UK's cities, all of them. The counts beside it left with
   it (benchmarks, countries, cities, districts, trades): the cities count took in the non-UK city pages, which are not indexed. */
function HomeCities({ cards }: { cards: CityCardsData }) {
  return (
    <Box id="cities" className="flex flex-col">
      <Rail icon="best-areas" kicker={COPY.home.citiesLabel} />
      <CityCards still cards={cards.cards.map((c) => ({ ...c, region: undefined }))} allHref={cards.allHref} basis={COPY.cityCards.plain.basis} />
    </Box>
  );
}

/* THE NOTEBOOK (masterplan step 36): the posts kept for the home page (src/lib/home/notebook.ts), each a link with its own picture
   or the UK's photograph, never the old rail's one skyline under every card. Furniture, not a reading: no figure, so it stands
   outside the section cards, as the newsletter beside it does. */
const dateText = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

function Notebook({ cards }: { cards: NotebookCard[] }) {
  return (
    <section data-notebook="" aria-labelledby="notebook-title" className="flex flex-col">
      <h2 id="notebook-title" data-typography="custom" className="text-[length:var(--t-head)] font-semibold leading-snug tracking-tight text-[var(--c-ink)]">
        {COPY.home.notebook.title}
      </h2>
      {/* TEXT FIRST (the checkup of 2026-10-06): the category, the title, the date, the date at the card's foot so a shorter title
          leaves its air in the middle, never under the last line (the page laws' CARD FOOT BLANK). */}
      <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <li key={c.slug}>
            <a href={c.href} className="tap-y flex h-full flex-col rounded-[12px] border border-[var(--c-border)] bg-[var(--c-card)] px-4 py-4 text-[var(--c-ink)] no-underline transition-colors hover:border-[var(--c-ink2)]">
              <span className="text-[length:var(--t-micro)] font-semibold text-[var(--c-muted)]">{c.category.charAt(0).toUpperCase() + c.category.slice(1)}</span>
              <span className="mt-1 text-[length:var(--t-body)] font-semibold leading-snug">{c.title}</span>
              <time dateTime={c.date} className="mt-auto pt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">
                {dateText(c.date)}
              </time>
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
  const zones: Array<{ key: string; split: ZoneSplit; stack?: "lg"; even?: boolean; label: string; body: React.ReactNode[] }> = [
    { key: "search", split: "wide", label: COPY.home.searchLabel, body: [<HomeSearch key="search" />] },
    /* THE UK'S ANSWERS, A LEVEL OF THREE (PART 10.5; masterplan step 34): the tax burden, what London's trades take, who is still
       trading, each a door to its section of /gb. */
    ...(answers.length ? [{ key: "answers", split: "1-1-1" as ZoneSplit, even: true, label: COPY.home.answersLabel, body: answers.map((a) => <AnswerDoor key={a.key} a={a} />) }] : []),
    /* THE UK'S CITIES, THE WHOLE LEVEL (his instruction of 2026-10-07): the still row of every UK city page, nothing beside it. */
    ...(cities ? [{ key: "cities", split: "wide" as ZoneSplit, label: COPY.home.citiesLabel, body: [<HomeCities key="cities" cards={cities} />] }] : []),
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
    /* THE NOTEBOOK, THEN THE NEWSLETTER (masterplan step 36), each its own level at two thirds (the zones' LONE rule): beside the
       notebook in a half column the newsletter's form and list overlapped; the newsletter band is unchanged in what it asks. */
    ...(notebook.length ? [{ key: "notebook", split: "2-1" as ZoneSplit, label: COPY.home.notebook.title, body: [<Notebook key="notebook" cards={notebook} />] }] : []),
    { key: "newsletter", split: "2-1", label: COPY.home.notebook.newsletter, body: [<HomeNewsletter key="newsletter" />] },
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
