/**
 * City page , SPINE rebuild BODY (SpineCityBody).
 *
 * Body/route split (Phase B): this file holds the whole page body as the named export
 * SpineCityBody, so the live metropolis route (src/app/cities/[slug]/page.tsx) can mount
 * it with real data (buildSpineCitySeed) while the thin dev route (page.tsx) renders it
 * with the bundled illustrative seed. Next forbids arbitrary named exports + custom props
 * on a route file, so the body lives here (a plain module) and page.tsx re-exports it as
 * the default. The default binding is the bundled spine seed, so the dev route stays
 * byte-identical to the pre-split page.
 *
 * THE ORDER IS MODEL.md 8.3's (plan step 32, 2026-09-18, the first of six
 * dispatches): the opening full width, then the band `01 glance | 02
 * among-cities`; chapter turn one, what it costs to open and to run (the
 * premises strip, then living beside the rent-against-income ratio); turn
 * two, where to open it and what to open (what residents spend beside what
 * customers earn, then rent by district beside the trades with local
 * figures, then the peers table full width); turn three, what the place is
 * like (the character tables, then the season split); the exit full width.
 * The country view's idiom, exactly: the builders built once at the top of
 * the body, a band seated only when a card exists, `Movement` with an index
 * and a heading and nothing else, no chapter title in any rail (the city
 * carries none). Three full widths, R1: the masthead, the peers, the close.
 *
 * THREE BLOCKS RETIRED BY THAT COMPOSITION, and their builders, copy and
 * stories with them: `lenses` (the quick-reads spectra grid; 8.3 has no such
 * block, and a percentile has no poles, R8), `verdict` (the section-level
 * AnswerCard whose basis "{dearest} rent, against {cheapest}" was the rent
 * verdict the composition dissolves into the masthead's answer: "The rent
 * verdict card is dissolved, not cut"), `risks` (not in 8.3; it drew for no
 * real city, the adapter omits the block for all 252), and the old chapter
 * "What to watch" they sat under. `LowestBar`, the July-3 "Lowest bar to
 * entry" card, went with them: it was unmounted dead code whose two Boxes the
 * census still counted as city sections, and it drew the break-in blend
 * ruling 30 bans (8.3's `10 easiest` is seated, blocked and unrendered until
 * that ruling lands; nothing stands in for it).
 *
 * NULL-GUARDS (real-data promotion): every section early-returns null when its data is
 * absent, so an omitted field renders NOTHING (never 0 / undefined / NaN / a broken
 * block). The chapter breaks are fixed "01", "02", "03" (8.3's own numbering); the
 * first two always have content (the premises strip draws on every city, the spend
 * figure is held for 252), and the third is drawn only when a card under it draws.
 *
 * 2026-07-11 reformation (rulebook v1): the derived per-district keep index, the
 * per-trade net-margin rail, the take-home bar list and the crowding column are DELETED
 * (§5, unknowable metrics); districts rank by RENT LOAD, lightest first (founder D1);
 * bars are rationed to three (§25); the seasonality month bars are reframed to the
 * who-is-here read (§7).
 *
 * NO first-year timeline (rulebook v1 §9): a first-year ramp is a TRADE-level concept
 * (how long THIS business takes to break even), and a city page is trade-agnostic, so any
 * such timeline here would necessarily invent a representative trade. There is no honest
 * anchor at city altitude, so the block was deleted rather than replaced (2026-07-10).
 */
import * as React from "react";
import { spineCitySeed } from "@/lib/spine-seeds";
/* SampleTag is imported and not called here, as in the country view: every
   modelled figure on this page is marked through the `sample` prop of Rail
   and Head, which draw the kit's SampleTag (hidden behind the one switch,
   MODEL.md, THE SAMPLE MARK IS BEHIND ONE SWITCH), and scripts/verify_sample_tags.ts
   proves the wiring by the reference, so the mark returns on every modelled
   card the day the switch is flipped. */
import { Fig, Movement, Box, Head, Rail, InlineDisclosure, SampleTag, Band, usd } from "@/components/spine/kit";
import { Terminus } from "@/components/spine/archetypes/Terminus";
import { buildCityCloseDoors } from "@/lib/spine/close_rows";
import { SpectraTable } from "@/components/spine/archetypes/SpectraTable";
import { buildCityCharacterTables } from "@/lib/spine/character_rows";
import { CompareTable } from "@/components/spine/archetypes/CompareTable";
import { buildCityPeerTable } from "@/lib/spine/peer_rows";
import { KvGrid } from "@/components/spine/archetypes/KvGrid";
import { buildCityGlance, type CityGlanceData } from "@/lib/spine/city_glance_rows";
import { buildCitySeat, type CitySeatData } from "@/lib/spine/city_seat_rows";
import { CityHero } from "./masthead";
import { IncomeCurve, OwnerRunway, RentAffordability } from "./chapters";
import { WhereToTrade } from "./where-to-trade";
import { buildCityDistrictBars } from "@/lib/spine/district_rows";
import { RangeStrip } from "@/components/spine/archetypes/RangeStrip";
import { buildCityCustomersStrip, buildCityPremisesStrip, type CityPremisesStrip } from "@/lib/spine/range_rows";
import { COPY } from "@/lib/spine/copy";

/* ================= THE OPENING ================= */
/**
 * At a glance, `01 glance` (MODEL.md 8.3; plan step 32, first dispatch,
 * 2026-09-18), the country's `01 glance` one altitude down (R8, clause 43:
 * the same form, the same cell rule). THE SEAT IS HELD BY KvGrid AS
 * CATALOGUED: the fact card with a focal (a first cell at 30 taking the
 * card's width) is candidate 1 of FORM-CATALOG's CANDIDATES AWAITING HIS
 * CLICK, and a form not in the catalogue is a candidate awaiting his click;
 * so the cells draw at the head rung, nothing at 30, and the FOCAL finding
 * on this card stands until he clicks. The census reads this Box as KvGrid,
 * which is the truth of it today.
 *
 * The rows come from city_glance_rows.ts, pure over the files, every
 * figure's file and field in its header: the visitor count where the city
 * counted it (45 cities; the country's count through a size divisor is
 * withheld with its line, item 20), the human development figure withheld on
 * every city (every row is the country's with a step), the days to clear the
 * city's own permits and the businesses per 10,000 residents off the city
 * shard, each marked with the shard's tag. Three of 8.3's seven print
 * elsewhere and never here (M1): the metro GDP and the cost of living on the
 * card beside, the average pay in the masthead. The withheld line names what
 * the card does not hold, with the count; the foot names the modelled cells
 * in words. The four readers of a city's income still differ (item 24: the
 * masthead's mean off the city list, the strip's 0.88 of it on London, the
 * peers row's mean, the ratio's median); the one-builder income is the
 * fourth dispatch's, with `07 earnings`.
 */
function Glance({ glance }: { glance: CityGlanceData | null }) {
  if (!glance) return null;
  return (
    <Box id="glance">
      <Rail icon="scorecard" kicker={COPY.glance.kicker} sample={glance.confidence !== "measured"} />
      <KvGrid cells={glance.cells} />
      {glance.withheld ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{glance.withheld}</p> : null}
      {glance.basis ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{glance.basis}</p> : null}
      {glance.foot ? <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{glance.foot}</p> : null}
    </Box>
  );
}

/**
 * Among the cities, `02 among-cities` (MODEL.md 8.3; the same dispatch), the
 * country's `02 world-seat` one altitude down. THE SEAT IS HELD BY KvGrid:
 * the composition's card is the placed-figures form, a figure with the
 * sentence "Higher than {n} cities in ten" under it, which is candidate 2 in
 * FORM-CATALOG's CANDIDATES AWAITING HIS CLICK and not clicked; the placement
 * sentences are not drawn, nothing is at 30 (the FOCAL finding is expected),
 * and the foot says the placement is not shown yet. The day he clicks, the
 * sentences come from placement.ts (`placementOf`, noun "cities"), the one
 * builder every page shares (R2), over the 252 rows of the city list. The
 * census reads this Box as KvGrid. The rows come from city_seat_rows.ts: the
 * metro GDP and the cost of living, 252 of 252, the GDP marked modelled on
 * every row (no row carries a source, item 31) and the cost of living
 * measured on the 13 city-level pulls, modelled on the 239 hand anchors.
 */
function AmongCities({ seat }: { seat: CitySeatData | null }) {
  if (!seat) return null;
  return (
    <Box id="among-cities">
      <Rail icon="vs-world" kicker={COPY.citySeat.kicker} sample={seat.confidence !== "measured"} />
      <KvGrid cells={seat.cells} />
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{seat.basis}</p>
      <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{seat.foot}</p>
    </Box>
  );
}

/* ================= TURN ONE , WHAT IT COSTS TO OPEN, AND TO RUN ================= */
/* CityPremises: WHAT PREMISES COST TO RUN, on the range-strip archetype (the
   build loop's run 13, 2026-09-06; founder ruling 11, premises on city pages
   too). No city holds a rent figure of its own on this strip (0 of 252 on
   2026-09-06). The country profile holds three rents by CITY SIZE (the tier-1,
   tier-2 and tier-3 city averages, as the cost engine and the v29 plan read
   them), so the card draws those three with the city's own size class in the
   accent, and the basis line says whose average it is and where the city sits.
   THIS STRIP KEEPS `04 premises`' SEAT UNTIL THE SECOND DISPATCH BUILDS THE
   BENTO (MODEL.md 8.3: four readings of the city's own shop space off the
   shard's `realestate.*`, the strip of national tiers leaving with it); its
   electricity `extra` stays for now. The strip comes from the body, built
   once, so its band is drawn only when it is. */
function CityPremises({ strip }: { strip: CityPremisesStrip | null }) {
  if (!strip) return null;
  return (
    <Box id="premises">
      <Rail icon="commercial-rent" kicker={COPY.premises.kicker} sample={strip.sample} />
      <RangeStrip marks={strip.marks} scale="log" fmt={usd} basis={strip.basis} extra={strip.extra} />
    </Box>
  );
}

/* ================= TURN TWO , WHERE TO OPEN IT, AND WHAT TO OPEN ================= */
/* DemandSpend, `08 demand`: the per-resident spend is the focal NUMBER (§26, C6);
 * the $196B metro total is CUT (a vague big total, §7). The season split that
 * shared this function until plan step 32 is SeasonSplit below, turn three's,
 * because 8.3 seats the two in different chapters (`08 demand | 07 earnings`,
 * then `14 neighbourhoods | 15 season`). Each carries its own figure's tag.
 *
 * THE SPEND PER RESIDENT IS READ FROM THE CITY FACT BANK SINCE 2026-09-17
 * (CITY-PROGRAMME step 1a, research items 21 and 25; buildCityDemand in
 * src/lib/spine/fact_rows.ts, run in the adapter). The figure existed for 252
 * of 252 cities and rendered for none, so the spending pool was a heading
 * over nothing and the season card stood alone in its band on London.
 *
 * The focal prints through the shared usd (Abidjan's $2,860 would have read
 * "$3K" through the private formatter C29 routed out); the box reads its OWN
 * figure's tag (spend_confidence); and it carries a basis line, since the
 * sample mark is off site-wide and the basis is the only place the word
 * "modelled" can reach a reader. Ink, not terracotta: the demand brief
 * (08-demand) rules this card quiet, the page's accents being named elsewhere
 * (MODEL PART 6). Today's `text-3xl` is the fourth dispatch's to move to the
 * ladder's 30 (F3, the plain figure). */
const hasDemandSpend = (d: any) => {
  const o = d?.demand;
  const hasMagnitude = !!o && typeof o.spend_per_capita_usd === "number" && Number.isFinite(o.spend_per_capita_usd) && o.spend_per_capita_usd > 0;
  return hasMagnitude || (o?.millionaires_count != null);
};
export function DemandSpend({ d }: { d: any }) {
  if (!hasDemandSpend(d)) return null;
  const o = d.demand;
  const hasMagnitude = typeof o.spend_per_capita_usd === "number" && Number.isFinite(o.spend_per_capita_usd) && o.spend_per_capita_usd > 0;
  const hasMillionaires = o?.millionaires_count != null;
  const growth = o?.growth_pct_yoy;
  const notHeld = (t: unknown) => t === "placeholder" || t === "modeled" || t === "extrapolated";
  const spendSample = notHeld(o.spend_confidence ?? o._meta?.confidence);
  return (
    /* LEAN WHILE IT STANDS ALONE (plan step 32, first dispatch): a card holding
       one figure takes the band's narrow third, not the wide two thirds, so
       the air falls outside its edge (kit.tsx, the lone lean card). Inert the
       day the card has a partner again. */
    <Box data-block="demand" data-lean="1">
      <Head icon="market-size" sample={spendSample}>{COPY.cityDemand.kicker}</Head>
      {hasMagnitude ? (
        <div className="flex flex-wrap items-baseline gap-x-3">
          <Fig className="text-3xl text-[var(--c-ink)]">{usd(o.spend_per_capita_usd)}</Fig>
          <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">
            {COPY.cityDemand.focalSub}
            {growth != null ? <>, {growth >= 0 ? "up" : "down"} <Fig className="text-[var(--c-ink)]">{Math.abs(growth)}%</Fig> on the year</> : null}.
          </span>
        </div>
      ) : null}
      {hasMagnitude && o.spend_basis ? <p className="mt-1.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{o.spend_basis}</p> : null}
      {/* the millionaire count: how deep the premium ticket runs (the Head tag covers it). No field, no source and no method today (item 27); the guard keeps the slot for the day one exists. */}
      {hasMillionaires ? (
        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 border-t border-[var(--c-border)] pt-3">
          <Fig className="text-[length:var(--t-head)] text-[var(--c-ink)]">{Math.round((o.millionaires_count || 0) / 1000)}K</Fig>
          <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">millionaires live here, net worth $1M and up beyond the main home.</span>
        </div>
      ) : null}
    </Box>
  );
}

/* TradesHere , the funnel block §24 asks for: "higher pages (country, city) carry a
 * block of real clickable businesses funneling into the cell pages". It replaces the
 * ranked "what to open, and what you keep" chapter, which cannot be restored at this
 * altitude: cost-to-open per city is omitted upstream, per-city trade margin and
 * take-home are banned outright by §5, and the break-in score blends the banned
 * take-home with a term its own module labels "ROOM (crowding)", which §5 also bans.
 * So there is no ranking here, and there is no score. Only which trades this city
 * holds a real local measurement for, each linking to the page where those figures
 * are lawful. 8.3's `09 trades` (trade rows, a foot in the coverage form) is a later
 * dispatch's; this is today's card in the seat.
 *
 * Hover is INK, not the accent. §37: the accent marks answers and never appears on
 * hover. */
const hasTradesHere = (d: any) => (d?.trades_here?.list?.length ?? 0) >= 4;
function TradesHere({ d }: { d: any }) {
  const list: Array<{ name: string; slug: string; href: string }> = d.trades_here?.list ?? [];
  if (list.length < 4) return null;
  return (
    <Box id="trades">
      {/* NOT a restatement of the chapter heading above it (§11, the double-title
          defect): the chapter says what the reader gets, this says what the set IS. */}
      <Head icon="honest-take">Trades with local figures</Head>
      {/* A WRAPPING ROW, NOT A GRID. These are equal links with no ranking, and a
          two-column grid leaves the odd one out beside a blank half whenever the
          count is odd, which is §17 and is the fault I had just fixed one section
          above. A wrap has no empty cell by construction. It is also a different
          form from the bands and tables either side of it (§25, §33: the rule is
          variety). */}
      <div className="flex flex-wrap gap-2">
        {list.map((t) => (
          <a
            key={t.slug}
            href={t.href}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--c-border)] bg-[var(--c-soft)] px-3 py-2 text-[length:var(--t-body)] text-[var(--c-ink2)] transition hover:border-[var(--c-line-strong)] hover:text-[var(--c-ink)]"
          >
            {t.name}
            <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">&#8594;</span>
          </a>
        ))}
      </div>
      <div className="mt-3 text-[length:var(--t-micro)] text-[var(--c-muted)]">
        Each of these has a real local measurement in {d.meta?.city}.
      </div>
    </Box>
  );
}

/* CityPeers: THE PEERS TABLE ON THE COMPARISON ARCHETYPE (city:peers, the build
   loop's run 22, 2026-09-06). The country page's form, the one the founder
   called one of the best versions he had seen (2026-08-30): the places as rows
   with a flag each, the measures as columns, the home row marked, the phone form
   stacked and never scrolling sideways. The city and up to four peers, three
   columns: cheaper to live (index points, higher is cheaper), customer income
   (percent of the home city's average pay), visitors (a multiple). The old kit
   table had the cities as columns and the measures as rows, and printed "pp", a
   word the doctrine bans, on the income row; the units are now in the caption
   in plain words. Full width by the wide-table sanction, as on the country page,
   so it no longer stands alone at two thirds: 8.3's `11 peers`, the seam of
   turns two and three, the page's second full width (R1). Its kicker and
   heads are the later peers dispatch's. */
function CityPeers({ d }: { d: any }) {
  const t = buildCityPeerTable(d);
  if (!t) return null;
  return <CompareTable id="peers" kicker={COPY.cityPeers.kicker} icon="benchmark" entityHead={t.entityHead} rows={t.rows} columns={t.columns} caveat={t.caveat} />;
}

/* ================= TURN THREE , WHAT THE PLACE IS LIKE ================= */
/* CityCharacter: THE CITY'S OWN CHARACTER TABLES on the spectra-table archetype
   (the build loop's run 14, 2026-09-06). Dealing with the state and dealing with
   people, the founder's kept form (ruling 14: named traits, explanatory poles,
   the better end on the right, ink dots for the state and terracotta for people,
   a foot figure under each, side by side on desktop). The reads are the city's
   own, from the per-city signature file, and never the country's under a city
   heading: a city with no reads of its own draws nothing here, and a city with
   one side's reads draws that one table alone. London holds three people reads
   and no state reads on 2026-09-06. 8.3 seats `12 character-people` beside `13
   locals` at 1-1; no city holds authored notes today (item 6), so the table
   stands alone in its band until the locals card ships at its real structure. */
function CityCharacter({ d }: { d: any }) {
  const t = buildCityCharacterTables(d?.meta?.slug);
  if (!t) return null;
  /* ONE TABLE ALONE STACKS UNTIL LG: photographed at 768 on run 14, a lone
     table took one of the two tablet columns and left the other half empty,
     the one-sided white space the splitting exists to prevent; the lone-child
     rule of the band reaches only lg. Two tables keep the tablet halves. */
  const lone = !(t.state && t.people);
  return (
    <Band split="1-1" stack={lone ? "lg" : undefined}>
      {t.state ? (
        <Box id="character">
          <Rail icon="bank" kicker={COPY.character.state.kicker} sample />
          <SpectraTable rows={t.state.rows} dot={t.state.dot} foot={t.state.foot} />
        </Box>
      ) : null}
      {t.people ? (
        /* A section card of its own (MODEL.md 8.3, `12 character-people`),
           unnamed while the first table holds "character": named for BLOCK FLOOR. */
        <Box {...(t.state ? {} : { id: "character" })} data-block="character-people">
          <Rail icon="who-for" kicker={COPY.character.people.kicker} sample />
          <SpectraTable rows={t.people.rows} dot={t.people.dot} foot={t.people.foot} />
        </Box>
      ) : null}
    </Band>
  );
}
/* Locals. Null-guards on d.locals_intel (omitted on real-data promotion for
   every city today: no city holds authored notes, item 6; 8.3's `13 locals`
   ships the card at its real structure with its not-gathered line in a later
   dispatch). */
function Locals({ d }: { d: any }) {
  const items = d.locals_intel ?? [];
  if (items.length === 0) return null;
  // The place-specific bullets move into a disclosure (§18/§19: invented prose out of the
  // first view; these are London-specific and fail the universality test in the open).
  return (
    <Box id="locals">
      <Head icon="locals-know">What locals know</Head>
      <InlineDisclosure name="locals" summary={`${items.length} things worth knowing before you sign`}>
        <div className="mt-2 space-y-3 border-t border-[var(--c-border)] pt-2.5">{items.map((it: any, i: number) => (
          <div key={i} className="flex gap-2.5"><span className="mt-0.5 text-[var(--c-muted)]">&#9656;</span><span className="text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]"><b className="text-[var(--c-ink)]">{it.title}</b> {it.detail}</span></div>))}
        </div>
      </InlineDisclosure>
    </Box>
  );
}

/* SeasonSplit, `15 season`: the resident/visitor mix, the ONLY honest seasonal
 * signal held (founder C7: city seasonality reads as the tourism / commuter mix,
 * never an invented month index); the invented month-by-month prose box is
 * DELETED (§4/§21). Turn three's since plan step 32 (8.3: `14 neighbourhoods |
 * 15 season`, 2-1); the KvGrid pair the composition names for it, and the
 * kicker "Residents and visitors", are the sixth dispatch's. The box reads its
 * own figure's tag (split_confidence) and carries a basis line, because the
 * split is a slope over arrivals for every city (research item 28) and had
 * shipped unmarked on 245 of them (item 27).
 *
 * A WHOLE BAR IS A CLAIM THAT THE PARTS ACCOUNT FOR EVERYTHING, and nothing was
 * checking that they do. The two shares are rounded independently upstream, so
 * each carries up to half a point of error and the pair can land on 99 or 101.
 * At 99 a strip of bare card shows through the end of the bar; at 101 the last
 * segment is squeezed and the drawn widths stop matching the printed figures.
 * Reproduced in scripts/probe_split_identity.mjs. Within a point of 100 it is
 * rounding, so the WIDTHS are taken as proportions of the real total and the bar
 * closes; further out a slice has gone missing upstream and the card draws
 * NOTHING rather than a bar with a hole in it. Rounded to two decimals because
 * dividing by a total of exactly 100 does not give back the number you started
 * with: 28 came out as 28.000000000000004 and went into the markup. */
const seasonSplitOf = (d: any): { resident: number; visitor: number; total: number } | null => {
  const o = d?.demand;
  if (!o || o.resident_pct == null || o.visitor_pct == null) return null;
  const total = (o.resident_pct ?? 0) + (o.visitor_pct ?? 0);
  if (!(Math.abs(100 - total) <= 1 && total > 0)) return null;
  return { resident: o.resident_pct, visitor: o.visitor_pct, total };
};
export function SeasonSplit({ d }: { d: any }) {
  const split = seasonSplitOf(d);
  if (!split) return null;
  const o = d.demand;
  const notHeld = (t: unknown) => t === "placeholder" || t === "modeled" || t === "extrapolated";
  const splitSample = notHeld(o.split_confidence ?? o._meta?.confidence);
  /* THE TWO SEGMENTS WERE NEARLY THE SAME COLOUR. A line-strong against a
     border tint differ by so little that a 72 to 28 split had no visible
     boundary: the bar read as one bar. Both are CONTEXT greys, and the
     convention is that a data mark takes ink and grey is for context, so the
     larger share , the one the section is about , now carries ink and the
     other stays quiet. */
  const segs: Array<[string, number, string, string]> = [
    ["Residents", split.resident, "var(--c-ink2)", "steady"],
    ["Visitors", split.visitor, "var(--c-soft2)", "seasonal"],
  ];
  return (
    <Box id="seasonal">
      <Head icon="seasonality" sample={splitSample}>{COPY.cityDemand.seasonKicker}</Head>
      {/* DECLARED I3, WAVE C ROW C9, 2026-09-02. One bar divided into two named parts
          that sum to a whole is the catalogue's STACKED WHOLE. The kit's own StackBar
          was measured against it and refused: its on-bar label colour is chosen by
          parsing the segment's colour as hex, and these two segments are CSS
          variables, which it cannot read, so it would set white type on the light
          segment. The city page spends its first I3 of two here. 8.3 retires the
          bar for a KvGrid pair (a fourth bar-family card otherwise) in the sixth
          dispatch. */}
      <div data-idea="I3" className="flex h-6 overflow-hidden rounded-lg border border-[var(--c-border)]" role="img" aria-label={`Residents ${split.resident}% steady, visitors ${split.visitor}% seasonal`}>
        {/* THE FIGURES SIT ON THE BAR, NOT ONLY IN THE KEY: the number inside the
            length it describes. THE LEGEND KEEPS THE NAMES AND LOSES THE FIGURES,
            so the same number is not printed twice on one card. */}
        {segs.map(([n, pct, bg]) => {
          const w = Math.round((pct / split.total) * 10000) / 100;
          const onDark = bg === "var(--c-ink2)";
          return (
            <div key={n} className="flex h-full items-center justify-center" style={{ width: `${w}%`, background: bg }}>
              <span className={`fig text-[length:var(--t-micro)] font-semibold ${onDark ? "text-white" : "text-[var(--c-ink)]"}`}>{pct}%</span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[length:var(--t-micro)] text-[var(--c-ink2)]">
        {segs.map(([n, pct, bg, tag]) => (
          <span key={n} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: bg }} /><span className="font-semibold text-[var(--c-ink)]">{n}</span>, {tag}</span>
        ))}
      </div>
      {o.split_basis ? <p className="mt-1.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{o.split_basis}</p> : null}
    </Box>
  );
}

/* ================= THE EXIT ================= */
/* CityClose: THE TERMINUS (city:close, the build loop's run 19, 2026-09-06).
   Up to three doors out of the page on the terminus archetype, the country
   page's own close: the lightest-rent district by name where the districts are
   ranked (the pick the old card named), else every district; the country page;
   and the compare page as the pill, since it puts the same business in up to
   three cities side by side. The old card reprinted the pick's name and its
   character, both already on the page, and hung a workbook veil no city ever
   filled. A closing card names the pick and opens a door; it does not recite
   the page. Every city has doors now, where the old card drew only for a city
   with ranked districts. 8.3's `16 close`, the page's third full width (R1). */
function CityClose({ d }: { d: any }) {
  const doors = buildCityCloseDoors(d);
  if (doors.length === 0) return null;
  return (
    <div data-terminus className="mt-8">
      <Box id="close">
        <Terminus kicker={COPY.close.kicker} doors={doors} />
      </Box>
    </div>
  );
}

/* The living card's and the ratio card's own guards (chapters.tsx), asked
   here so the body can seat their band; the cards ask them again and draw. */
const hasLiving = (d: any) => { const o = d?.owner_runway ?? {}; return o.rent_1bed_usd_mo != null && o.groceries_usd_mo != null && o.transport_usd_mo != null; };
const hasRunway = (d: any) => { const r = d?.rent_ratio; return !!r && Number.isFinite(r.pct) && r.rent?.value != null && r.pay?.value != null; };

/**
 * The city spine page body. `data` defaults to the bundled illustrative seed so the dev
 * route (page.tsx) renders it unchanged; the live metropolis route passes the real-data
 * seed from buildSpineCitySeed. Every section null-guards its own data, so an omitted
 * field renders nothing.
 */
export function SpineCityBody({ data = spineCitySeed }: { data?: any } = {}) {
  const d = data ?? spineCitySeed;
  const slug: string | undefined = typeof d.meta?.slug === "string" ? d.meta.slug : undefined;

  /* WHO IS HOME, ASKED ONCE, FROM THE BUILDERS THE CARDS DRAW FROM (the
     country view's idiom). A band is drawn when either of its cards exists and
     not otherwise, so a card that self-omits never leaves an empty grid with a
     rung of air behind it. The two seats read the city list and the city shard
     by the seed's slug; the strips, the districts, the peers and the character
     tables read the seed the adapter built. */
  const glance = slug ? buildCityGlance(slug) : null;
  const seat = slug ? buildCitySeat(slug) : null;
  const premises = buildCityPremisesStrip(d);
  const living = hasLiving(d);
  const runway = hasRunway(d);
  const demand = hasDemandSpend(d);
  const earnings = buildCityCustomersStrip(d) != null;
  const districts = buildCityDistrictBars(d) != null;
  const trades = hasTradesHere(d);
  const character = buildCityCharacterTables(d?.meta?.slug) != null;
  const locals = (d.locals_intel?.length ?? 0) > 0;
  const season = seasonSplitOf(d) != null;

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
      {/* `00 masthead`, FULL WIDTH, the page's only 40 (8.3, loud 1): the answer
          "Average customer pay" off the city list's mean, the archetype's own hero
          band carrying the attribute the full-width gate reads. */}
      <CityHero d={d} />
      {/* `01 glance | 02 among-cities`, 1-1, the opening's one band (8.3; plan
          step 32, first dispatch): what the city is in figures, and where it
          stands among the cities, both quiet, both on KvGrid while their
          clicked forms wait. Both cards exist for every covered city (the
          permit days, the business count, the metro GDP and the cost of living
          are held for all 252), so the band holds two children; a city missing
          one would show the survivor alone, honestly, as LONE CARD. */}
      {glance || seat ? (
        <Band split="1-1">
          <Glance glance={glance} />
          <AmongCities seat={seat} />
        </Band>
      ) : null}
      {/* CHAPTER TURN ONE (8.3, "What it costs to open, and to run"): the kit's
          Movement, the muted index and one plain heading, no eyebrow and no icon
          (8.4). 48 above and 12 below, the next Band's own 32 absorbing the 12
          by margin collapse. The opening above carries no break (PART 1). */}
      <Movement index="01" heading={COPY.chapters.costs} />
      {/* `04 premises`: today's strip of the country's three rents by city size
          holds the seat alone in its band until the second dispatch builds the
          bento (8.3: the cluster IS the band). The kit's only-child rule gives
          it two thirds; the LONE CARD finding on it is expected and temporary. */}
      {premises ? (
        <Band split="1-1">
          <CityPremises strip={premises} />
        </Band>
      ) : null}
      {/* `05 living | 06 runway`, 1-1 (8.3), today's two kit cards until the
          third dispatch: what living here costs beside a year of one-bed rent
          against a year of typical pay. MEASURED BEFORE IT WAS PAIRED, on
          London with the probe and the page filter: at 1280 the living card
          wants 258 and the ratio card 243 at 520, the band stands at 244 with
          the ratio's two rows anchored to its foot (its own mt-auto), and the
          filter finds no hole; at 768's equal halves 344 by 304 (311 and 303
          of content); at 375 each at its own height, 236 and 304. The
          justify-between rows both cards draw at 520 are PART 5's LABEL GAP
          finding, standing until the third dispatch redraws them as KvGrid
          and the ratio card. The ratio is withheld on the 30 cities whose
          one-bed rent exceeds a year of pay (fact_rows.ts), so the living
          card stands alone there, honestly (LONE CARD, expected). */}
      {living || runway ? (
        <Band split="1-1">
          <OwnerRunway d={d} />
          <RentAffordability d={d} />
        </Band>
      ) : null}
      {/* CHAPTER TURN TWO (8.3, "Where to open it, and what to open"): the market
          sized before the street is picked. */}
      <Movement index="02" heading={COPY.chapters.where} />
      {/* `08 demand | 07 earnings`, demand LEFT and the strip RIGHT (8.3's bar
          ledger: `07` is the dot family, right column), today's DemandSpend and
          IncomeCurve cards until the fourth dispatch. THE PAIR CANNOT BE SEATED
          TODAY, MEASURED on London with the probe, the page filter and the
          art-direction gate: the strip wants 265 of content and the spend card
          155, so at 1-2 (8.4 rule 1, the taller card wide) the spend card at
          347 stretched to 266 carried a 307 by 111 blank, under the filter's
          120 floor, but 50 percent of ink against the art-direction gate's E2
          floor of 60 (its baseline for this page is 0 and never rises); every
          other split stretches the same 155 of content to the same 266 and
          reads the same, and 1-1 crowds the strip's three labels at 520 (C9).
          The country's `07 | 08` stands the same way on the same rule. So each
          stands in its own band, in 8.3's order: the spend card LEAN at the
          narrow third (a card holding one figure, the kit's lean rule, so the
          air falls outside its edge), the strip at the survivor's two thirds;
          LONE CARD fires on both, expected, until the fourth dispatch gives
          `08` its second reading or the composition re-decides the pair. */}
      {demand ? (
        <Band split="1-2">
          <DemandSpend d={d} />
        </Band>
      ) : null}
      {earnings ? (
        <Band split="1-2">
          <IncomeCurve d={d} />
        </Band>
      ) : null}
      {/* `03 districts | 09 trades` (8.3): rent by district, the page's one
          fill-bar card, LEFT; the trades with local figures RIGHT. London holds
          both; 249 cities hold neither and the band is absent together (8.3,
          "the sparse pair"). THE PAIR CANNOT BE SEATED TODAY, MEASURED on
          London with the probe and the page filter (plan step 32, first
          dispatch): alone at two thirds the ranking stands 693 by 437 (content
          436) and the trade chips 693 by 194 (content 193); paired at 2-1 the
          chips at 347 wrap to 381 of content inside a card stretched to 437,
          and the filter reds a 121 by 144 blank in it (WHITE SPACE, against a
          page-holes baseline of 0 that never rises); every wider seat for the
          chips shortens their wrap and deepens the blank, and 1-2 puts the
          ranking at 347, where its district names wrap (C9 measured six of
          seven wrapping at 520 already). So each stands in its own band, in
          8.3's order, the ranking at the survivor's two thirds (the width it
          has held since C9) and the chips likewise, stacked until lg; LONE
          CARD fires on both, expected, until `09` takes its trade-row form
          with a figure per row (a later dispatch) and the pair is re-measured. */}
      {districts ? (
        <Band split="2-1" stack="lg">
          <WhereToTrade d={d} />
        </Band>
      ) : null}
      {trades ? (
        <Band split="2-1" stack="lg">
          <TradesHere d={d} />
        </Band>
      ) : null}
      {/* `11 peers`, FULL WIDTH, the seam of turns two and three (8.3, R1). */}
      <CityPeers d={d} />
      {/* CHAPTER TURN THREE (8.3, "What the place is like"): zero accent from
          here to the exit. Drawn only when a card under it draws (the character
          tables hold reads on 19 of 252 cities; the season split on 241), so a
          city with neither shows no heading over nothing; the index stays "03"
          because the two turns above always draw. */}
      {character || locals || season ? (
        <>
          <Movement index="03" heading={COPY.chapters.place} />
          {/* `12 character-people | 13 locals`, 1-1 (8.3): the character tables
              draw their own band; no city holds authored notes today (item 6),
              so the locals card is absent and the table stands alone, LONE CARD
              expected until the locals card ships at its real structure. */}
          <CityCharacter d={d} />
          {locals ? (
            <Band split="1-1">
              <Locals d={d} />
            </Band>
          ) : null}
          {/* `14 neighbourhoods | 15 season`, 2-1 (8.3): no neighbourhood card
              exists in this view today (the CardPager form is the sixth
              dispatch's), so the season split stands alone in the band, at the
              survivor's two thirds, LONE CARD expected; the band is not seated
              as a pair because one of its cards does not exist. */}
          {season ? (
            <Band split="2-1" stack="lg">
              <SeasonSplit d={d} />
            </Band>
          ) : null}
        </>
      ) : null}
      {/* `16 close`, FULL WIDTH (8.3, R1): the exit carries no break (PART 1). */}
      <CityClose d={d} />
    </main>
  );
}
