/**
 * City page , SPINE rebuild BODY. Leg 1.
 *
 * Body/route split (Phase B): this file holds the whole page body as the named export
 * SpineCityBody, so the live metropolis route (src/app/cities/[slug]/page.tsx) can mount
 * it with real data (buildSpineCitySeed) while the thin dev route (page.tsx) renders it
 * with the bundled illustrative seed. Next forbids arbitrary named exports + custom props
 * on a route file, so the body lives here (a plain module) and page.tsx re-exports it as
 * the default. The default binding is the bundled spine seed, so the dev route stays
 * byte-identical to the pre-split page.
 *
 * NULL-GUARDS (real-data promotion): every section early-returns null when its data is
 * absent, so an omitted field renders NOTHING (never 0 / undefined / NaN / a broken
 * block), and the parent <Movement> chapter wrapper is skipped when its whole chapter is
 * empty. Chapter numbering is DYNAMIC (a cn() counter), so the numbers never gap after a
 * chapter is omitted. The full seed carries every field, so with it these guards never
 * fire and the dev route is unchanged.
 *
 * 2026-07-11 reformation (rulebook v1): the derived per-district keep index, the
 * per-trade net-margin rail, the take-home bar list and the crowding column are DELETED
 * (§5, unknowable metrics); districts rank by RENT LOAD, lightest first (founder D1);
 * the verdict box, the "Lowest bar to entry" featured card and the "Next-easiest" plain
 * table return in their July-3 forms (§46); bars are rationed to three (§25); the
 * seasonality month bars are reframed to the who-is-here read (§7).
 *
 * NO first-year timeline (rulebook v1 §9): a first-year ramp is a TRADE-level concept
 * (how long THIS business takes to break even), and a city page is trade-agnostic, so any
 * such timeline here would necessarily invent a representative trade. There is no honest
 * anchor at city altitude, so the block was deleted rather than replaced (2026-07-10).
 */
import * as React from "react";
import { spineCitySeed } from "@/lib/spine-seeds";
/* TERRA is gone from this import with the peer cost strip (C9): it was the strip's one
   accent, the home city's dot, and nothing else in this file paints with it. */
import { Fig, Movement, Box, Head, Rail, WideRail, Even, TRACK, InfoTip, InlineDisclosure, SampleTag, Band, usd } from "@/components/spine/kit";
import { Terminus } from "@/components/spine/archetypes/Terminus";
import { AnswerCard } from "@/components/spine/archetypes/AnswerCard";
import { cityVerdictFacts } from "@/lib/spine/city_verdict_facts";
import { buildCityCloseDoors } from "@/lib/spine/close_rows";
import { SpectraTable } from "@/components/spine/archetypes/SpectraTable";
import { buildCityCharacterTables } from "@/lib/spine/character_rows";
import { buildCityQuickReads } from "@/lib/spine/reads_rows";
import { CompareTable } from "@/components/spine/archetypes/CompareTable";
import { buildCityPeerTable } from "@/lib/spine/peer_rows";
import { AtlasMark } from "@/components/spine/marks";
import { CityHero } from "./masthead";
import { IncomeCurve, OwnerRunway, RentAffordability } from "./chapters";
import { WhereToTrade } from "./where-to-trade";
import { RangeStrip } from "@/components/spine/archetypes/RangeStrip";
import { buildCityPremisesStrip } from "@/lib/spine/range_rows";
import { COPY } from "@/lib/spine/copy";

/* A FIFTH PRIVATE FORMATTER, GONE (C29, 2026-09-02). It rounded a cost to open to
   the nearest thousand and printed a K whatever the magnitude, which is the same
   defect the kit's own `usd` carried until the founder ratified the money grammar
   on 2026-09-02: a trade costing $8,400 to open read "$8K" and one costing $600
   read "$1K". What survives here is the NULL GUARD and not a grammar, so a card
   whose cost is absent still prints what it printed before rather than "$NaN". */
const k = (v: number) => usd(v || 0);

/* TierBand , the CATEGORICAL read form (FORM-CATALOG PriceTierBand: a discrete N-step
 * band, the active step inked). Replaces a continuous marker for a categorical read
 * (Riskier / Safer): a marker at a precise position fakes a precision the category
 * does not hold (Meter do-not, rule 6). The word is the value beside the read; the
 * band shows WHICH tier, in whole steps, between two named poles.
 * Ink only , these are conditions, not the box's one answer (rule 37, no accent).
 *
 * ONE CALLER LEFT, AND THE OTHER ONE'S REASON DID NOT HOLD (C9, 2026-09-02). The quick
 * reads used this six times in one box, which is the form-variety gate's per-card
 * clause failed, and their positions turned out to be MEASURED percentile ranks rather
 * than categories: see CityLenses below. This survives for the risk severities, which
 * are a placeholder 0-to-100 severity the seed itself calls illustrative, so a
 * quartile is the honest granularity there. That card is dark on every real city page
 * today, so this drawing reaches no reader; the day the risk data lands it is an
 * undeclared drawing and a third horizontal track on a page whose cap is two. */
function TierBand({ steps = 4, pos, word, leftPole, rightPole }: { steps?: number; pos: number; word: string; leftPole: string; rightPole: string }) {
  const active = Math.max(0, Math.min(steps - 1, Math.floor((pos / 100) * steps)));
  return (
    <div role="img" aria-label={`${leftPole} to ${rightPole}: ${word}`}>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${steps}, minmax(0,1fr))` }}>
        {Array.from({ length: steps }).map((_, i) => (
          <span key={i} className="h-[7px] rounded-full" style={{ background: i === active ? "var(--c-ink)" : TRACK }} />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[length:var(--t-body)] tracking-wide text-[var(--c-ink2)]">
        <span>{leftPole}</span><span>{rightPole}</span>
      </div>
    </div>
  );
}

/* ================= CH1 , THE VERDICT ================= */
/* CityVerdict: THE HERO VERDICT CARD on the answer-card archetype at section
   level (the build loop's run 23, 2026-09-07). The lightest rent load among
   the ranked districts is the answer, in the accent: the city blueprint
   reserves the page's one accent for this figure, which is why the masthead
   above it is ink. The city average and the heaviest district are the two
   cells at the card's half, what the answer cannot say (the founder's
   2026-08-25 "you are repeating the front part" is why there is no third
   cell). The multiples are modelled and marked so. The archetype wraps
   itself in the hero band, the page's full-width band; the facts come from
   city_verdict_facts, so the stories draw the same card. Draws nothing for a
   city without two ranked districts. */
export function CityVerdict({ d }: { d: any }) {
  const f = cityVerdictFacts(d);
  if (!f) return null;
  return <AnswerCard id="verdict" level="section" icon={f.icon} name={f.kicker} subtitle={null} answer={f.answer} cells={f.cells} tone="accent" />;
}

/* CityLenses: THE QUICK READS on the spectra-table archetype at body size (the
   build loop's run 16, 2026-09-06). Six ranks among the cities carried, each a
   position between two named poles, the founder's approved metric; his
   correction of 2026-07-11 (rule 34, "text too small", one-sided white space)
   is the reason the archetype has a body scale at all, and this is the card
   that wears it. The kit's table drew this card until run 16 with the same
   correction as an opt-in; the archetype carries it now, and the kit's table
   has no caller left in this view. The registration days sit in the foot as a
   figure with its words, the paperwork alone. */
function CityLenses({ d }: { d: any }) {
  const r = buildCityQuickReads(d);
  if (!r) return null;
  return (
    <Box id="lenses">
      <Head icon="scorecard" sample={r.sample}>{COPY.cityReads.kicker}</Head>
      <SpectraTable rows={r.rows} scale="body" foot={r.foot} />
    </Box>
  );
}

/* ================= CH2 , WHAT IT COSTS HERE ================= */
/* CityPremises: WHAT PREMISES COST TO RUN, on the range-strip archetype (the
   build loop's run 13, 2026-09-06; founder ruling 11, premises on city pages
   too). No city holds a rent figure of its own (0 of 252 on 2026-09-06). The
   country profile holds three rents by CITY SIZE (the tier-1, tier-2 and
   tier-3 city averages, as the cost engine and the v29 plan read them), so the
   card draws those three with the city's own size class in the accent, and the
   basis line says whose average it is and where the city sits. The five
   metrics the founder named (prime and secondary street, in the metropolis and
   in a city, and a fifth) are the street axis the data does not hold: a data
   requirement, not a drawing. This replaced "The lease terms", a card whose
   three figures (deposit, lease length, rent-free months) the adapter omits for
   every city, so it never drew. */
export function CityPremises({ d }: { d: any }) {
  const s = buildCityPremisesStrip(d);
  if (!s) return null;
  return (
    <Box id="premises">
      <Rail icon="commercial-rent" kicker={COPY.premises.kicker} sample={s.sample} />
      <RangeStrip marks={s.marks} scale="log" fmt={usd} basis={s.basis} extra={s.extra} />
    </Box>
  );
}

/* ================= CH3 , YOUR CUSTOMERS ================= */
/* DemandSize. Null-guards: the whole card omits when no split AND no magnitude. The
 * per-resident spend is the focal NUMBER (§26, C6); the $196B metro total is CUT (a
 * vague big total, §7). A second box carries the seasonal read as the resident/visitor
 * mix (the ONLY honest seasonal signal, C7); the invented month-by-month prose box is
 * DELETED (§4/§21). Each box carries its own figure's tag.
 *
 * THE SPEND PER RESIDENT IS READ FROM THE CITY FACT BANK SINCE 2026-09-17
 * (CITY-PROGRAMME step 1a, research items 21 and 25; buildCityDemand in
 * src/lib/spine/fact_rows.ts, run in the adapter). The figure existed for 252
 * of 252 cities and rendered for none, so the spending pool was a heading
 * over nothing and the season card stood alone in its band on London.
 *
 * THREE SMALL THINGS CHANGED IN THE FORM, each the smallest that lets the
 * bank's figure print honestly. The focal used to be a private formatter,
 * "$" + round(v / 1000) + "K", which is the exact shape the money grammar
 * ruling (C29) routed out of five other places: Abidjan's $2,860 would have
 * read "$3K". It prints through the shared usd now. Each box reads its OWN
 * figure's tag (spend_confidence, split_confidence) rather than one tag for
 * both, because a held spend beside a modelled split is two different truths.
 * And each box carries a basis line, since the sample mark is off site-wide
 * and the basis is the only place the word "modelled" can reach a reader: the
 * split is a slope over arrivals for every city (research item 28) and had
 * shipped unmarked on 245 of them (item 27). */
export function DemandSize({ d }: { d: any }) {
  const o = d.demand;
  const hasSplit = o && o.resident_pct != null && o.visitor_pct != null;
  // the decision read is the per-resident figure (§7/§16, founder C6: the $196B metro
  // total is a vague big total, twice corrected, so it is CUT here, not just demoted).
  const hasMagnitude = o && typeof o.spend_per_capita_usd === "number" && Number.isFinite(o.spend_per_capita_usd) && o.spend_per_capita_usd > 0;
  const hasMillionaires = o?.millionaires_count != null;
  /* A HEADING IS NOT CONTENT. Both figures on this card are omitted upstream for a
     real city, neither has a source, and the card was built anyway: a reader got a
     bordered card carrying the words "The spending pool" and nothing at all under
     them. It omits now, the way every other card in this file already does when its
     figures are absent. The guard below gains the millionaire count for the same
     reason, so a city holding only that figure no longer loses it. */
  /* The spending pool's replacement (§3, see design/replacements/spending-pool.md).
     The two figures this card was built for have no source and are dropped
     upstream; this is the knowable neighbour, and it is what keeps the card from
     being a heading over nothing (§2). */
  const spreadWord: string | undefined = o?.spread_word;
  /* THE SPREAD WORD NO LONGER COUNTS TOWARDS THIS CARD EXISTING. It moved to the
     earnings chart, which is the card that shows the spread, so a city holding
     ONLY the spread word would render this card as a naked heading with nothing
     under it. That is exactly what happened on London the moment the word moved,
     measured at 314x28 holding the words "The spending pool" and nothing else. A
     section's guard has to ask for the content the section still draws. */
  const hasSize = hasMagnitude || hasMillionaires;
  if (!o || (!hasSplit && !hasSize)) return null;
  const growth = o?.growth_pct_yoy;
  const notHeld = (t: unknown) => t === "placeholder" || t === "modeled" || t === "extrapolated";
  const spendSample = notHeld(o.spend_confidence ?? o._meta?.confidence);
  const splitSample = notHeld(o.split_confidence ?? o._meta?.confidence);
  // residents = the steady base; visitors = the seasonal, tourism-led slice (founder C7:
  // city seasonality reads as the tourism / commuter mix, never an invented month index).
  /* THE TWO SEGMENTS WERE NEARLY THE SAME COLOUR. A line-strong against a
     border tint differ by so little that a 72 to 28 split had no visible
     boundary: the bar read as one bar. Both are CONTEXT greys, and the
     convention is that a data mark takes ink and grey is for context, so the
     larger share , the one the section is about , now carries ink and the
     other stays quiet. */
  const segs: Array<[string, number, string, string]> = [
    ["Residents", o.resident_pct, "var(--c-ink2)", "steady"],
    ["Visitors", o.visitor_pct, "var(--c-soft2)", "seasonal"],
  ];
  const sizeBox = hasSize ? (
    <Box data-block="demand">
      <Head icon="market-size" sample={spendSample}>{COPY.cityDemand.kicker}</Head>
      {hasMagnitude ? (
        <div className="flex flex-wrap items-baseline gap-x-3">
          {/* INK, NOT TERRACOTTA: the demand brief (08-demand) rules this card quiet,
              the page's three accents being named elsewhere (MODEL PART 6), and
              the page filter counted the terracotta the moment the card drew. */}
          <Fig className="text-3xl text-[var(--c-ink)]">{usd(o.spend_per_capita_usd)}</Fig>
          <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">
            {COPY.cityDemand.focalSub}
            {growth != null ? <>, {growth >= 0 ? "up" : "down"} <Fig className="text-[var(--c-ink)]">{Math.abs(growth)}%</Fig> on the year</> : null}.
          </span>
        </div>
      ) : null}
      {hasMagnitude && o.spend_basis ? <p className="mt-1.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{o.spend_basis}</p> : null}
      {/* THE WORD IS THE VALUE. No bar and no position: a precise marker on a rough
          measure fakes precision, which FORM-CATALOG names as the meter do-not, and
          §26 permits a lone value to stay a value. It is also a different form from
          the tier bands and the share bar elsewhere on this page (§25, §33). The
          statistic's own name never appears (§40); the gloss explains it plainly. */}
      {/* THE SPREAD WORD MOVED TO THE CHART THAT SHOWS THE SPREAD. It used to sit
          here, and on London it was the ONLY thing this card rendered: a 356x147
          card holding one adjective and a caption, no figure and no visual, which
          art direction E5 says is not a section. The earnings chart 650px down the
          page draws the same finding properly, three marks on a log scale, so the
          word joins it. Nothing is lost; the reader gets the word AND the shape in
          one place. This card still renders whenever a city carries a spend figure
          or a millionaire count, which is what it is actually for. */}
      {/* the millionaire count: how deep the premium ticket runs (the Head tag covers it). */}
      {hasMillionaires ? (
        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 border-t border-[var(--c-border)] pt-3">
          <Fig className="text-[length:var(--t-head)] text-[var(--c-ink)]">{Math.round((o.millionaires_count || 0) / 1000)}K</Fig>
          <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">millionaires live here, net worth $1M and up beyond the main home.</span>
        </div>
      ) : null}
    </Box>
  ) : null;
  // the seasonal read , the ONLY honest seasonal signal held (the split), rendered as
  // the graphic; no invented "summer hump, December peak" prose (§4/§21, C7).
  /* A WHOLE BAR IS A CLAIM THAT THE PARTS ACCOUNT FOR EVERYTHING, and nothing was
     checking that they do. The two shares are rounded independently upstream, so
     each carries up to half a point of error and the pair can land on 99 or 101.
     At 99 a strip of bare card shows through the end of the bar; at 101 the last
     segment is squeezed and the drawn widths stop matching the printed figures.
     Reproduced in scripts/probe_split_identity.mjs.

     Two responses, because the two causes are different. Within a point of 100 it
     is rounding, so the WIDTHS are taken as proportions of the real total and the
     bar closes; the printed figures are untouched. Further out than that, a slice
     has gone missing somewhere upstream, the shape no longer means what it claims,
     and the card draws NOTHING rather than draw a bar with a hole in it.

     Today every one of eight real cities lands on exactly 100, so nothing moves.
     That was true by luck and is now true by construction. Rounded to two decimals
     because dividing by a total of exactly 100 does not give back the number you
     started with: 28 came out as 28.000000000000004 and went into the markup. */
  const splitTotal = (o.resident_pct ?? 0) + (o.visitor_pct ?? 0);
  const splitCloses = Math.abs(100 - splitTotal) <= 1 && splitTotal > 0;
  const tourismBox = hasSplit && splitCloses ? (
    <Box id="seasonal">
      <Head icon="seasonality" sample={splitSample}>{COPY.cityDemand.seasonKicker}</Head>
      {/* DECLARED I3, WAVE C ROW C9, 2026-09-02. One bar divided into two named parts
          that sum to a whole is the catalogue's STACKED WHOLE, and this drew it with
          no idea on it. The shape is already right for the information, so this is a
          declaration rather than a replacement; the kit's own StackBar was measured
          against it and refused for a reason worth recording: its on-bar label colour
          is chosen by parsing the segment's colour as hex, and these two segments are
          CSS variables, which it cannot read, so it would set white type on the light
          segment. That is the form's defect and it belongs in the form. The city page
          spends its first I3 of two here. */}
      <div data-idea="I3" className="flex h-6 overflow-hidden rounded-lg border border-[var(--c-border)]" role="img" aria-label={`Residents ${o.resident_pct}% steady, visitors ${o.visitor_pct}% seasonal`}>
        {/* THE FIGURES SIT ON THE BAR, NOT ONLY IN THE KEY. This was the third
            stacked bar in this vertical and the third different way of labelling
            one: the trade page put all five figures in its legend, the
            across-places page put them on the bar, and this one put them in a
            legend too. A reader who learns how to read one of them should be able
            to read all three. On the bar is the version that won, because it puts
            the number inside the length it describes instead of asking the eye to
            carry a colour from a key back to a shape.
            THE LEGEND KEEPS THE NAMES AND LOSES THE FIGURES, so the same number is
            not printed twice on one card. */}
        {segs.map(([n, pct, bg]) => {
          const w = Math.round((pct / splitTotal) * 10000) / 100;
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
  ) : null;
  /* THE TWO BOXES ARE THE BAND'S OWN CHILDREN, not a rail inside it. The band
     around this section declares split="3-2" for exactly these two cards, and
     until the spend figure landed it had only ever held one of them, so the
     declared split never applied. Wrapped in the WideRail they would have
     reached the band as ONE child, taken its lone-child two thirds, and been
     squeezed 3:2 inside that; and the rail sets its cards' heights ragged
     (items-start), which founder ruling 7 of 2026-09-04 overrules for two cards
     on one level. As siblings they take the band's 3-2 at its full width and
     its equal heights. A lone survivor still takes the band's lone-child rule. */
  if (sizeBox && tourismBox) return <>{sizeBox}{tourismBox}</>;
  return sizeBox ?? tourismBox;
}

/* ================= CH4 , TRADES AND RIVALS ================= */
/* TradesHere , the funnel block §24 asks for: "higher pages (country, city) carry a
 * block of real clickable businesses funneling into the cell pages". It replaces the
 * ranked "what to open, and what you keep" chapter, which cannot be restored at this
 * altitude: cost-to-open per city is omitted upstream, per-city trade margin and
 * take-home are banned outright by §5, and the break-in score blends the banned
 * take-home with a term its own module labels "ROOM (crowding)", which §5 also bans.
 * So there is no ranking here, and there is no score. Only which trades this city
 * holds a real local measurement for, each linking to the page where those figures
 * are lawful.
 *
 * Hover is INK, not the accent. §37: the accent marks answers and never appears on
 * hover. The older affordance a few hundred lines above this does use terracotta on
 * hover, and that is one of the open founder decisions; new code does not copy it. */
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

/* LowestBar , the July-3 "Lowest bar to entry" featured trade card + the "Next-easiest,
 * and the cost to open" plain 3-column table (rulebook v1 §46 restored forms; no bars,
 * §25). Replaces the take-home bar list whole: the per-city Keeps and Crowding columns
 * are banned outright (rulebook v1 §5) and the horizontal-bar execution with them
 * (founder C9). Null-guards: omits without at least one trade carrying BOTH a real
 * ease and a real cost to open; rows missing either figure self-omit, never a dash wall. */
function LowestBar({ d }: { d: any }) {
  const arr = (d.trades?.list ?? [])
    .filter((t: any) => t.break_in_0_100 != null && t.cost_to_open_usd != null)
    .slice()
    .sort((a: any, b: any) => b.break_in_0_100 - a.break_in_0_100);
  if (arr.length === 0) return null;
  const lead = arr[0];
  const rest = arr.slice(1);
  // cost-to-open and break-in are illustrative (trades._meta is "mixed"); tag them (§4).
  const sample = ["placeholder", "modeled", "mixed"].includes(d.trades?._meta?.confidence);
  // No prose myth-sentence, no "gentlest way in" caption (§19/§26); the two figures ARE
  // the read. Terracotta rides ONLY the cost focal; the link is a neutral affordance (§37).
  const featured = (
    <Box data-block="easiest">
      <Head icon="startup-cost" sample={sample}>Lowest bar to entry</Head>
      <div className="text-[length:var(--t-lead)] font-semibold text-[var(--c-ink)]">{lead.name}</div>
      <div className="mt-3 flex flex-wrap items-end gap-x-6 gap-y-3 border-t border-[var(--c-border)] pt-3">
        <div>
          <Fig className="text-[32px] leading-none text-[var(--terra-text)]">{k(lead.cost_to_open_usd)}</Fig>
          <div className="mt-1 text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">cost to open the doors</div>
        </div>
        <div>
          <div className="fig text-[length:var(--t-head)] leading-none text-[var(--c-ink)]">{lead.break_in_0_100}<span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">/100</span></div>
          <div className="mt-1 text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">ease to enter</div>
        </div>
      </div>
      {/* href={lead.href}, previously lead.href ?? "/dev/spine-cell". The
              fallback sent a reader into the sandbox these components were
              built in, which renders one hardcoded trade regardless of what was
              clicked, so a missing link became somebody else's data presented
              as this city's. An <a> with an undefined href renders as text, so
              a row with no destination is simply not a link. */}
            <a href={lead.href} className="mt-4 inline-flex items-center gap-1.5 text-[length:var(--t-body)] font-semibold text-[var(--c-ink2)] transition hover:text-[var(--terra-text)]"><AtlasMark id="alt-business" size={14} className="shrink-0" />See the trade's live economics &#8594;</a>
    </Box>
  );
  if (rest.length === 0) return featured;
  return (
    <WideRail>
      {featured}
      <Box data-block="easiest-rest">
        <Head icon="ranking" sample={sample}>Next-easiest, and the cost to open</Head>
        <div className="-mx-2 grid grid-cols-[1fr_64px_64px] items-baseline gap-4 px-2 pb-1 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
          <span>Trade</span><span className="text-right">Ease /100</span><span className="text-right">To open</span>
        </div>
        <div className="divide-y divide-[var(--c-border)]">
          {rest.map((t: any) => (
            <a key={t.slug} href={t.href} className="hov -mx-2 grid grid-cols-[1fr_64px_64px] items-baseline gap-4 rounded-md px-2 py-2">
              <span className="min-w-0 truncate text-[length:var(--t-body)] text-[var(--c-ink)]">{t.name}</span>
              <Fig className="text-right text-[length:var(--t-body)] text-[var(--c-ink2)]">{t.break_in_0_100}</Fig>
              <Fig className="text-right text-[length:var(--t-body)] text-[var(--c-ink)]">{k(t.cost_to_open_usd)}</Fig>
            </a>
          ))}
        </div>
        <div className="mt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">Ease out of 100, higher is easier.</div>
      </Box>
    </WideRail>
  );
}

/* ================= CH5 , RUNNING IT ================= */
/* NO first-year timeline here (rulebook v1 §9): see the file header note. A
 * first-year ramp is a trade-level concept and this page is trade-agnostic, so the
 * block was deleted rather than replaced with a city-altitude substitute. */

/* CityRisks. Null-guards on r.list (omitted on real-data promotion). The scale is
 * SAFETY out of 10 (high = good, the page-set grammar): safety = (100 - severity) / 10,
 * biggest exposure first, neutral track, words keyed to safety. Terracotta rides ONLY
 * the top exposure's label (never a marker). */
function CityRisks({ d }: { d: any }) {
  const r = d.risks;
  if (!r || !(r.list?.length)) return null;
  // Rulebook v1 §4: this seed's severities are illustrative, not measured
  // (risks._meta.confidence is "placeholder" here). Mark the block so the reader
  // never mistakes 82/74/58/46 for researched figures.
  const sample = r._meta?.confidence === "placeholder" || r._meta?.confidence === "modeled";
  const safetyOf = (sev: number) => Math.max(1, Math.min(10, Math.round((100 - sev) / 10)));
  const wordOf = (s: number) => (s <= 3 ? "Exposed" : s <= 5 ? "Uneasy" : s <= 7 ? "Steadier" : "Calm");
  const sorted = (r.list ?? []).slice().sort((a: any, b: any) => (b.severity_0_100 ?? 0) - (a.severity_0_100 ?? 0));
  // ONE full-width box: categorical risk tiers (Riskier..Safer), no continuous marker
  // (§6 false precision), no terracotta on the worst row (§37, accent marks the good end
  // only). The "honest read" verdict box is DELETED (§14). The counterweights move into
  // a disclosure (bullet text out of the first view, §18); no verdict prose in view.
  return (
    <Box data-block="risks">
      <Head icon="watch" sample={sample}>Where the risks sit</Head>
      <div className="divide-y divide-[var(--c-border)]">
        {sorted.map((x: any) => {
          const s = safetyOf(Number(x.severity_0_100 ?? 0));
          return (
            <div key={x.label} className="grid grid-cols-[minmax(140px,1fr)_1.1fr] items-center gap-4 py-2.5">
              <div>
                <div className="text-[length:var(--t-body)] text-[var(--c-ink)]">{x.label}{x.gloss ? <InfoTip gloss={x.gloss} /> : null}</div>
                {x.who ? <div className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{x.who}</div> : null}
              </div>
              <div>
                <div className="mb-1 text-[length:var(--t-micro)] font-semibold text-[var(--c-ink)]">{wordOf(s)}</div>
                <TierBand pos={s * 10} word={wordOf(s)} leftPole="Riskier" rightPole="Safer" />
              </div>
            </div>
          );
        })}
      </div>
      <InlineDisclosure name="risks" summary="The counterweight for each" className="group mt-3 border-t border-[var(--c-border)] pt-2.5">
        <div className="mt-2 space-y-2.5">{sorted.map((x: any) => (
          <div key={x.label} className="flex gap-2.5">
            <span className="mt-0.5 text-[var(--c-muted)]">&#9656;</span>
            <span className="text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]"><b className="text-[var(--c-ink)]">{x.label}.</b> {x.counterweight}</span>
          </div>
        ))}</div>
      </InlineDisclosure>
    </Box>
  );
}

/* CityCharacter: THE CITY'S OWN CHARACTER TABLES on the spectra-table archetype
   (the build loop's run 14, 2026-09-06). Dealing with the state and dealing with
   people, the founder's kept form (ruling 14: named traits, explanatory poles,
   the better end on the right, ink dots for the state and terracotta for people,
   a foot figure under each, side by side on desktop). The reads are the city's
   own, from the per-city signature file, and never the country's under a city
   heading: a city with no reads of its own draws nothing here, and a city with
   one side's reads draws that one table alone. London holds three people reads
   and no state reads on 2026-09-06. The old card drew authored "texture" rows
   the adapter had omitted for every city, so it never drew. */
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
/* Locals. Null-guards on d.locals_intel (omitted on real-data promotion). */
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

/* ================= CH6 , THE CLOSE ================= */
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
   so it no longer stands alone at two thirds. */
function CityPeers({ d }: { d: any }) {
  const t = buildCityPeerTable(d);
  if (!t) return null;
  return <CompareTable id="peers" kicker={COPY.cityPeers.kicker} icon="benchmark" entityHead={t.entityHead} rows={t.rows} columns={t.columns} caveat={t.caveat} />;
}

/* CityClose: THE TERMINUS (city:close, the build loop's run 19, 2026-09-06).
   Up to three doors out of the page on the terminus archetype, the country
   page's own close: the lightest-rent district by name where the districts are
   ranked (the pick the old card named), else every district; the country page;
   and the compare page as the pill, since it puts the same business in up to
   three cities side by side. The old card reprinted the pick's name and its
   character, both already on the page (the verdict card names the district, the
   districts card its character), and hung a workbook veil no city ever filled.
   A closing card names the pick and opens a door; it does not recite the page.
   Every city has doors now, where the old card drew only for a city with
   ranked districts. */
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

/* ---- dynamic chapter numbering ------------------------------------------- */
/* A chapter Movement renders ONLY when at least one of its sections has content, and the
 * index counter advances only for a rendered chapter, so the printed numbers (01, 02, ...)
 * never gap after an omitted chapter. On the full seed every chapter renders, so the
 * numbering is identical to the pre-split page. */
function makeChapterCounter() {
  let n = 0;
  return () => {
    n += 1;
    return String(n).padStart(2, "0");
  };
}

/**
 * The city spine page body. `data` defaults to the bundled illustrative seed so the dev
 * route (page.tsx) renders it unchanged; the live metropolis route passes the real-data
 * seed from buildSpineCitySeed. Every section null-guards its own data, so an omitted
 * field renders nothing and an empty chapter (its Movement wrapper included) is skipped.
 * Order (founder C1, 2026-07-11): hero, the slimmed verdict, then DISTRICTS as the
 * second block so the map crests into the first frame.
 */
export function SpineCityBody({ data = spineCitySeed }: { data?: any } = {}) {
  const d = data ?? spineCitySeed;
  const cn = makeChapterCounter();

  // Per-chapter content presence (drives whether the Movement wrapper renders).
  const hasWhereCh = !!(d.where_to_trade?.list?.length);
  // IncomeCurve + RentAffordability live in the Customers chapter (earnings data
  // belongs under "who buys"); OwnerRunway lives beside the risk material (C4).
  const hasCostCh = !!(d.space?.read) || buildCityPremisesStrip(d) != null;
  const hasCustomersCh = !!(d.demand && (d.demand.resident_pct != null || d.demand.spend_per_capita_usd != null)) || !!(d.income?.median_income_usd != null) || d.rent_ratio != null;
  const tradeList = d.trades?.list ?? [];
  // The owner-keeps net-margin block (MarginKept) is DELETED (§5 banned metric + the
  // "fundamentally wrong" horizontal-bar money split, founder C9); the chapter is now
  // the ease + cost-to-open read alone, so it only renders when those figures are held.
  /* The chapter now renders on the FUNNEL, not on a ranking. The old guard asked
     for a break-in score and a cost to open together, and no city has ever carried
     both, so this chapter has been dark since the real-data promotion. */
  const hasTradesCh = (d.trades_here?.list?.length ?? 0) >= 4;
  const hasRunningCh = !!(d.risks?.list?.length) || buildCityCharacterTables(d?.meta?.slug) != null || !!(d.locals_intel?.length) || !!(d.owner_runway?.rent_1bed_usd_mo != null);
  const hasCloseCh = (d.peers?.list?.length ?? 0) >= 2 || tradeList.some((t: any) => t.break_in_0_100 != null) || !!(d.where_to_trade?.list?.length);

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
      <CityHero d={d} />

      {/* THE HERO, AND THE ONLY FULL-WIDTH BAND ON THE PAGE. Founder, 2026-08-25:
          "for every subsection that stretches left to right full width, I think we
          should ban it except hero section." Art direction D1. The archetype's own
          band declares it with the hero prop, which sets the attribute the gate
          reads, because looking like a hero is how twenty-eight sections got the
          whole column. */}
      <CityVerdict d={d} />

      {/* FOUR CHAPTERS, NOT SIX, AND NOT ONE SECTION WAS CUT TO GET THERE.
          Measured 2026-08-25: four of this page's six chapters held exactly ONE
          section, and a lone section in a chapter has nothing to pair with, so it
          took the full column by default. Merging those chapters is what lets
          every section keep its place AND sit in a band. The headings consolidate;
          the content does not move out.

          The split of each band follows its content (D4) and no band repeats the
          split of the band before it (D3): 1-1, 2-1, 3-2, 2-3, then 1-1, 2-1, then
          3-2. The middle two omit on a city with no risk or character data, and
          the sequence still holds without them. */}
      {hasWhereCh ? (
        <>
          <Movement index={cn()} heading="Where to trade" icon="best-areas" />
          {/* 2-1, NOT EQUAL HALVES, AND BOTH CARDS ARE MEASURED (C9, 2026-09-02).
              Measured on the render at 520: SIX of the district ranking's seven names
              wrap to two lines, "South London" through "City of London", every one at
              63px in a 62px column. That is the number run 4 wrote down while building
              the same ranking one altitude below, "seven columns want 693px for one
              line each", and this band is where it bites. At 693 the columns are 91px
              and every district sits on one line.
              The quick reads gain by the same move rather than paying for it: six
              two-pole tracks at 478px are a dot on a long empty rail, and at 307px the
              same six read as a profile. */}
          <Band split="2-1" stack="lg"><WhereToTrade d={d} /><CityLenses d={d} /></Band>
        </>
      ) : null}

      {(hasCostCh || hasCustomersCh || hasCloseCh) ? (
        <>
          <Movement index={cn()} eyebrow="What it costs here" heading="What it costs, and who buys" icon="commercial-rent" />
          {/* The peer table is a comparison of what it COSTS to be here, so it
              belongs with the cost read rather than at the close. It takes the
              large side because four columns of figures cannot be the small one. */}
          {/* THE TWO PEER COMPARISONS ARE NOT PUT SIDE BY SIDE. The table and the
              one-axis dot plot both set London against Paris, Munich and Los
              Angeles on cost, and the plot is a subset of the table's first row.
              Banding them together printed those three city names twice inside
              the first screen, which is the founder's "repeating the front part"
              measured: front-page repeats went from four to seven the moment they
              were paired. They are separated, and each takes a partner that says
              something it does not. */}
          {/* 3-2, NOT 2-1, AND D3 FORCED IT (C9, 2026-09-02). The band below this one
              lost its second card when the peer cost strip was cut as a duplicate, and
              `Band`'s only-child rule re-templates a lone survivor to two thirds and
              one third, which is the 2-1 geometry. Two neighbouring bands measuring the
              same split is the monotony D3 exists to stop, so one of the two had to
              move and this is the one with a choice. Both cards gain: the earnings plot
              goes 347 to 416, where its three log-scale labels stop crowding, and the
              peers table gives up 69px it was not using, five columns being the widest
              thing in it. */}
          {/* THE PEERS TABLE ALONE, THEN THE TWO STRIPS SIDE BY SIDE, THEN THE
              DEMAND ROW ALONE (the build loop's run 13, 2026-09-06). The premises
              card arrived at 286px of natural height, and the only partner near
              it is the earnings card at 265: two range strips, what customers earn
              beside what premises cost, one form, one height. The peers table
              (277) stood beside the earnings card before and now stands alone in
              the lone-child column, as the demand row already did; the demand
              row's card is 128px tall and beside either strip it would stretch
              over a hole the filter reds. The lease-terms card that used to share
              the demand row's band never drew: its figures are omitted upstream. */}
          {/* THE PEERS TABLE TAKES THE WIDE-TABLE SANCTION (run 22), the same as on
              the country page, so it no longer stands alone at two thirds. The
              demand row and the trades card below still stack until lg (run 20). */}
          <CityPeers d={d} />
          <Band split="1-1"><IncomeCurve d={d} /><CityPremises d={d} /></Band>
          {/* THE SPENDING POOL AND THE SEASON CARD, 3-2, both drawn since the
              bank's spend figure landed (2026-09-17); DemandSize returns them as
              this band's two children so the declared split finally applies. */}
          <Band split="3-2" stack="lg"><DemandSize d={d} /></Band>
          {/* THE RENT RATIO IN A BAND OF ITS OWN. It stood here outside any band,
              which is the full width D1 bans for anything carrying a finding, and
              nobody saw it because the card had never drawn for a real city: it
              read the London-only income spread. It draws for every city now, off
              the fact bank, so it takes a band and the lone-child rule gives it
              the two thirds every other lone card on the page gets. A 2-3 here,
              not the 3-2 above it (D3), though as a lone child the declared
              split never applies; the declaration records the intent for the
              day a partner card lands. THE BAND ONLY WHEN THE CARD DRAWS (run
              14's rule): the builder withholds the ratio for thirty cities, and
              an empty band is a 32px blank the filter cannot see. */}
          {d.rent_ratio != null ? <Band split="2-3" stack="lg"><RentAffordability d={d} /></Band> : null}
        </>
      ) : null}

      {hasRunningCh ? (
        <>
          <Movement index={cn()} eyebrow="Running it" heading="What to watch" icon="watch" />
          {/* EACH BAND ONLY WHEN SOMETHING DRAWS IN IT (run 14): the character
              tables return their own band; the risks and the locals are omitted
              upstream for every city today (the living costs draw since
              2026-09-17), and an empty band is a blank the filter cannot see
              because it is not inside a card. */}
          {d.risks?.list?.length ? <Band><CityRisks d={d} /></Band> : null}
          <CityCharacter d={d} />
          {/* THE LIVING COSTS DRAW FOR EVERY CITY since the fact bank was wired
              (2026-09-17); the locals notes are still omitted upstream for all,
              so the card is this band's lone child and takes its two thirds. */}
          {d.owner_runway?.rent_1bed_usd_mo != null || d.locals_intel?.length ? <Band split="2-1"><OwnerRunway d={d} /><Locals d={d} /></Band> : null}
        </>
      ) : null}

      {/* THE GUARD ASKS WHAT THESE TWO SECTIONS ACTUALLY NEED, not a loose OR.
          It used to lean on hasCloseCh, which is true when the page has peer
          cities, and the peer table used to live in this chapter. Moving that
          table up to the cost read left the guard passing on cities where NEITHER
          of the two sections here can draw: Mumbai, Lagos and Sydney rendered this
          heading with nothing under it. Caught by the blast-radius sweep across
          all fifteen real pages, which is what that sweep is for. Each condition
          below is the section's own. */}
      {hasTradesCh ? (
        <>
          <Movement index={cn()} eyebrow="The close" heading="What you can open" icon="startup-cost" />
          {/* THE TRADES ALONE IN THEIR BAND since run 19: the close left the band for
              the terminus below, the page's last full-width band, as on the country
              page; the chapter draws only when the trades do. */}
          <Band stack="lg"><TradesHere d={d} /></Band>
        </>
      ) : null}
      <CityClose d={d} />
    </main>
  );
}
