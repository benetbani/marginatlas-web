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
import { Fig, Stat, Movement, Box, Head, Rail, WideRail, Even, TERRA, TRACK, InfoTip, InlineDisclosure, SpectraTable, SampleTag, Bullets, Band } from "@/components/spine/kit";
import { CompareTable, type CompareEntity, type CompareRow, LockVeil } from "@/components/spine/kit-index";
import { AtlasMark } from "@/components/spine/marks";
import { isReviewBuild } from "@/lib/feature_flags";
import { CityHero } from "./masthead";
import { IncomeCurve, OwnerRunway, RentAffordability } from "./chapters";
import { WhereToTrade } from "./where-to-trade";

const k = (v: number) => "$" + Math.round((v || 0) / 1000) + "K";

/* TierBand , the CATEGORICAL read form (FORM-CATALOG PriceTierBand: a discrete N-step
 * band, the active step inked). Replaces a continuous marker for a categorical read
 * (Deep / Fair / Scarce, Riskier / Safer): a marker at a precise position fakes a
 * precision the category does not hold (Meter do-not, rule 6). The word is the value
 * beside the read; the band shows WHICH tier, in whole steps, between two named poles.
 * Ink only , these are conditions, not the box's one answer (rule 37, no accent). */
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
/* CityVerdict , the rent-spread answer card. ONE focal figure (the lightest district
 * rent load, the founder's D1 metric) beside a clean neutral spread strip (lightest /
 * baseline / heaviest). The invented "The catch" prose box and the decorative
 * terracotta frame are DELETED (2026-07-12); the "district keep spread" focal and its
 * derived keep index were retired earlier (§5 + §13). Null-guards on the district set. */
export function CityVerdict({ d }: { d: any }) {
  const list: any[] = d.where_to_trade?.list ?? [];
  if (list.length === 0) return null;
  const byRent = list.slice().sort((a: any, b: any) => a.rent_mult - b.rent_mult);
  const lightest = byRent[0];
  const heaviest = byRent[byRent.length - 1];
  const sample = d.where_to_trade?._meta?.confidence === "placeholder" || d.where_to_trade?._meta?.confidence === "modeled";
  // the rent spread across districts , lightest, the city baseline, heaviest.
  const facts: Array<[string, string, string]> = [
    ["lightest", `x${lightest.rent_mult}`, lightest.name],
    ["city average", "x1", "the baseline"],
    ["heaviest", `x${heaviest.rent_mult}`, heaviest.name],
  ];
  // Neutral card + Head with the modeled tag (the multiples are placeholder, §4). The
  // invented "The catch" prose box and the decorative terracotta frame are DELETED
  // (§14/§19 verdict-in-a-box; §37/§38 accent decorates chrome). The finding lives on
  // the focal figure and the spread strip; terracotta rides ONLY the answer (§37).
  return (
    <Box>
      <Head icon="commercial-rent" sample={sample}>The rent, district by district</Head>
      <div className="grid gap-5 md:grid-cols-[1fr_1.5fr] md:items-center">
        <Stat size="focal" accent value={`x${lightest.rent_mult}`} label="the lightest rent load" sub={`in ${lightest.name}, against the city-average x1`} />
        {/* the spread , a clean neutral three-cell strip, the answer already on the focal */}
        {/* A WRAPPING ROW OF CELLS SIZED BY THEIR CONTENTS, not three fixed
            columns. Photographed at 320: three columns in a phone card leave each
            cell about fifty pixels, so "the baseline" printed as "the bas..."
            with nothing to recover it from, and the middle tag wrapped onto two
            lines while its neighbours did not, dropping that cell's figure and
            name below the other two. A three-cell strip that will not fit three
            across is not a three-cell strip.
            Sized to their contents they wrap exactly when they must, nothing is
            cut, and the hairlines come from the gap rather than from a divider
            rule, which is what stops a wrapped line starting with one. The same
            shape the masthead scorecard now uses, and for the same reason. */}
        <div className="flex flex-wrap gap-px overflow-hidden rounded-lg border border-[var(--c-border)]" style={{ background: "var(--c-border)" }}>
          {facts.map(([tag, fig, name]) => (
            <div key={tag} className="flex-[1_1_auto] whitespace-nowrap bg-[var(--c-card)] px-3 py-2.5">
              <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{tag}</div>
              <Fig className="mt-0.5 block text-[length:var(--t-lead)] text-[var(--c-ink)]">{fig}</Fig>
              <div className="mt-0.5 text-[length:var(--t-micro)] text-[var(--c-ink2)]">{name}</div>
            </div>
          ))}
        </div>
      </div>
    </Box>
  );
}

/* CityLenses. Null-guards on d.lenses.scales (omitted on real-data promotion , the
 * live adapter never supplies lenses; see adapt_city.ts's omitted-fields list). The
 * hand-authored condition reads carry a SampleTag (§4). Each read is a CATEGORICAL tier
 * chip (TierBand), not a continuous marker (§6 false precision); the banned "Room to
 * enter" crowding read is dropped at the seed (§5), and the verdict prose subtitle and
 * per-row advice sentences are gone (§14/§19). */
function CityLenses({ d }: { d: any }) {
  const o = d.lenses;
  if (!o || !(o.scales?.length)) return null;
  const scales: any[] = o.scales ?? [];
  const days: number | undefined = o.days_to_register;
  const sample = o._meta?.confidence === "placeholder" || o._meta?.confidence === "modeled";
  // Categorical reads on labeled TIER chips, not continuous markers (FORM-CATALOG Meter
  // do-not: a marker at a precise position fakes precision). The word is the value; the
  // banned "Room to enter" crowding read is DELETED at the seed (rule 5). No verdict
  // prose subtitle, no per-row advice sentence (§14/§19); the read lives on the chips.
  return (
    <Box>
      <Head icon="scorecard" sample={sample}>Quick reads</Head>
      {/* 2x2 grid, not four full-width rows: a single 4-step band stretched across the
          whole card left acres of dead track (rule 17, sparse-but-wide, the founder's
          most-named reject on this exact "Quick reads" section). Two columns halve each
          band's width and double the density; the read (word) sits at lead size and the
          pole labels read at body size, not the micro low-contrast gray he rejected
          (rule 34, "text too small"). */}
      <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {scales.map((s: any) => (
          <div key={s.key ?? s.label}>
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">{s.label}</span>
              <span className="text-[length:var(--t-lead)] font-semibold text-[var(--c-ink)]">{s.word}</span>
            </div>
            <TierBand pos={s.pos} word={s.word} leftPole={s.left} rightPole={s.right} />
          </div>
        ))}
      </div>
      {/* HOW FAST YOU CAN OPEN. The knowable half of what the lease-terms card asked
          (§3, design/replacements/lease-terms.md). Shown as itself: no scale, no
          position, nothing to invert (§29A). A long registration is a fact about a
          place, not a judgement of it (§21). */}
      {days != null ? (
        <div className="mt-5 flex flex-wrap items-baseline gap-x-3 border-t border-[var(--c-border)] pt-4">
          <Fig className="text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]">{days}</Fig>
          <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">
            {days === 1 ? "day" : "days"} to register a business here<InfoTip gloss="The typical time to complete the paperwork for a one-person business in this country. It does not include finding a site, fitting it out, or any licence a particular trade needs." />
          </span>
        </div>
      ) : null}
    </Box>
  );
}

/* ================= CH2 , WHAT IT COSTS HERE ================= */
/* CommercialSpace. Null-guards: the whole card omits when no space read; the peer rent
 * STRIP + the lease-terms card each omit when their (omitted) fields are absent, leaving
 * the sanctioned space prose alone. Peer costs read as SIGNED PERCENTAGE-POINT deltas
 * against the home city (founder C3, 2026-07-11), dots on one axis, never bars. The peer
 * set carries no pricier city because none is defensibly pricier than London (C3: "only
 * cheaper exists; fine"). */
export function CommercialSpace({ d }: { d: any }) {
  const s = d.space;
  if (!s || !s.read) return null;
  /* THE GAP IS FROM THE HOME CITY, NOT FROM A HARDCODED 100. Subtracting 100 is a
   * gap from home only while the indices happen to be anchored there. The bundled
   * sample is anchored (London = 100). The live adapter is NOT: it passes a real
   * cost index on which London reads 75. So on every live city page this drew the
   * home city 25 points below ITSELF, put Munich (also 75) on the identical spot,
   * and INVERTED the sign of every city dearer than home, printing Los Angeles as
   * 11 points cheaper than London when the source has it 14 points dearer. The
   * peers TABLE further down this file has always subtracted the home index for
   * this same field; this is that arithmetic, keeping the strip's own sign
   * convention (below zero = cheaper than home). No home row means no anchor, and
   * the strip omits rather than inventing one. */
  const peerRows = (d.peers?.list ?? []).filter((p: any) => p.rent_index != null);
  const homeIndex = peerRows.find((p: any) => p.home)?.rent_index;
  const peers = (homeIndex != null ? peerRows : [])
    .map((p: any) => ({ ...p, delta: Math.round((p.rent_index || 0) - homeIndex) }))
    .sort((a: any, b: any) => a.delta - b.delta);
  const hasPeerStrip = peers.length >= 2;
  const dVals = peers.map((p: any) => p.delta);
  const lo = hasPeerStrip ? Math.min(...dVals) - 6 : 0;
  const hi = hasPeerStrip ? Math.max(...dVals) + 5 : 1;
  const span = Math.max(1, hi - lo);
  /* FOUR LABEL SLOTS, NOT TWO. See the note on the axis below: two sides were
     not enough. Three of London's four peers land within 7.4% of each other,
     which at this card's width is 28px for names 30 to 40px wide, so a label
     pushed to the free side still collided with the one already there. Each
     side gets a near row and a far row, and a label takes whichever of the four
     is furthest from the last label placed in it. */
  const slots: number[] = (() => {
    const xs = peers.map((q: any) => ((q.delta - lo) / span) * 100);
    const order = xs.map((x: number, i: number) => ({ x, i })).sort((a: any, b: any) => a.x - b.x);
    const out: number[] = new Array(xs.length).fill(0);
    const last = [-999, -999, -999, -999];
    for (const { x, i } of order) {
      let best = 0;
      for (let k = 1; k < 4; k++) if (Math.abs(x - last[k]) > Math.abs(x - last[best])) best = k;
      out[i] = best;
      last[best] = x;
    }
    return out;
  })();
  const fmtDelta = (v: number) => (v === 0 ? "0" : `${v > 0 ? "+" : ""}${v}pp`);
  const hasTerms = s.deposit_months != null && s.lease_years_typical != null && s.rent_free_months != null;
  const terms: Array<[string, string]> = hasTerms
    ? [[`${s.deposit_months} mo`, "deposit up front"], [`${s.lease_years_typical}`, "typical lease, years"], [`${s.rent_free_months} mo`, "rent-free fit-out"]]
    : [];
  const peerSample = d.peers?._meta?.confidence === "placeholder" || d.peers?._meta?.confidence === "modeled";
  const spaceSample = s._meta?.confidence === "placeholder" || s._meta?.confidence === "modeled";
  /* RENAMED 2026-08-24. This strip called itself "Rent against peer cities" and it
     is not built on rent. It is built on the same index as the conditions card,
     which describes itself in its own data file as "Cost-of-Living Plus Rent Index
     per city, NYC = 100": what it costs a PERSON to live somewhere, rent included.
     Sitting inside a chapter called "What space costs", a reader takes it for the
     rent on their shop. §13 asks for titles that are descriptive and instantly
     understandable, and this one was neither.

     Second of two. The sibling read in the conditions card carried the same
     mislabel, as "Affordable space", and was renamed one iteration earlier. Both
     came from the same mistake: reading the field's NAME, rent_index, instead of
     the file that fills it.

     THE CHAPTER HEADING IS NOW THE ODD ONE OUT and it is NOT changed here. "What
     space costs" holds exactly one card and that card is about the cost of living.
     The page carries no commercial-space figure at city level at all, which was
     established when the lease terms were replaced. Chapter headings are ratified
     copy, so the mismatch is recorded for the founder rather than rewritten: the
     honest options are to rename the chapter to what it holds, or to fold this card
     into the conditions chapter and let the chapter go.

     The verdict caption (peer_read) and the terms prose (terms_note) stay DELETED
     (§14/§19/§26); the finding lives on the marker strip. */
  return (
    <WideRail>
      <Box>
        <Rail icon="commercial-rent" kicker="Cost of living against peer cities" sample={peerSample} />
        {/* the peer dot strip below (home city = 0) IS the pressure read; no second scale. */}
        {/* peers on ONE axis. Only rendered when at least two peers carry a real rent index. */}
        {hasPeerStrip ? (
          <div className="mt-2 border-t border-[var(--c-border)] pt-3">
            <div className="mb-1 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Against {d.meta?.city}, in percentage points<InfoTip gloss={`What it costs a person to live in each city, rent included, set against ${d.meta?.city}. A percentage point is the plain gap between two percentages: a peer at -22pp sits 22 points below the ${d.meta?.city} level. It is not the rent on a shop.`} /></div>
            <div className="relative h-[116px]" role="img" aria-label={`Rent against ${d.meta?.city} in percentage points: ${peers.map((p: any) => `${p.name} ${fmtDelta(p.delta)}`).join(", ")}`}>
              {/* WHICH SIDE A LABEL SITS ON IS DECIDED BY POSITION, NOT BY LIST
                  ORDER. It used to alternate on the index, so two peers close in
                  value but two apart in the list both landed above the axis and
                  their names overlapped: measured, "Paris" over "Munich" by 13x14px
                  at 1440 and 9x14px at 375, and it got worse when this card moved
                  into a half band. Each label now goes to whichever side is further
                  from the last label placed there. */}
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--c-line-strong)]" />
              {peers.map((p: any, i: number) => {
                const x = ((p.delta - lo) / span) * 100;
                const home = p.home;
                const slot = slots[i];
                return (
                  /* The home marker paints LAST. Two cities can share a cost index (London
                     and Munich both read 75), and the later dot covers the earlier one, so
                     the one dot in terracotta, the whole point of the strip, was being
                     hidden under a grey peer. Paint order only: the sort, and therefore
                     which side each label sits on, is untouched. */
                  <span key={p.name} className={`absolute -translate-x-1/2 ${home ? "z-[1]" : ""}`} style={{ left: `${x}%`, top: "50%" }}>
                    <span className="block h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white" style={{ background: home ? TERRA : "var(--c-line-strong)", boxShadow: "0 0 0 1px var(--c-border)" }} />
                    <span className={`absolute left-1/2 flex -translate-x-1/2 flex-col items-center whitespace-nowrap leading-tight ${["bottom-[14px]", "top-[9px]", "bottom-[34px]", "top-[29px]"][slot]}`}>
                      <span className={`text-[length:var(--t-micro)] ${home ? "font-semibold text-[var(--terra-text)]" : "text-[var(--c-muted)]"}`}>{p.name}</span>
                      <Fig className={`text-[length:var(--t-micro)] ${home ? "text-[var(--terra-text)]" : "text-[var(--c-ink2)]"}`}>{fmtDelta(p.delta)}</Fig>
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        ) : null}
      </Box>
      {hasTerms ? (
        <Box>
          <Rail icon="red-tape" kicker="The lease terms" sample={spaceSample} />
          <div className="divide-y divide-[var(--c-border)]">{terms.map(([v, l]) => (
            <div key={l} className="flex items-baseline justify-between gap-3 py-2"><span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">{l}</span><Fig className="text-[length:var(--t-lead)] text-[var(--c-ink)]">{v}</Fig></div>
          ))}</div>
        </Box>
      ) : null}
    </WideRail>
  );
}

/* ================= CH3 , YOUR CUSTOMERS ================= */
/* DemandSize. Null-guards: the whole card omits when no split AND no magnitude. The
 * per-resident spend is the focal NUMBER (§26, C6); the $196B metro total is CUT (a
 * vague big total, §7). A second box carries the seasonal read as the resident/visitor
 * mix (the ONLY honest seasonal signal, C7); the invented month-by-month prose box is
 * DELETED (§4/§21). Both boxes carry the modeled tag. */
export function DemandSize({ d }: { d: any }) {
  const o = d.demand;
  const hasSplit = o && o.resident_pct != null && o.visitor_pct != null;
  // the decision read is the per-resident figure (§7/§16, founder C6: the $196B metro
  // total is a vague big total, twice corrected, so it is CUT here, not just demoted).
  const hasMagnitude = o && o.spend_per_capita_usd != null;
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
  const hasSize = hasMagnitude || hasMillionaires || !!spreadWord;
  if (!o || (!hasSplit && !hasSize)) return null;
  const growth = o?.growth_pct_yoy;
  const sample = o._meta?.confidence === "placeholder" || o._meta?.confidence === "modeled";
  // residents = the steady base; visitors = the seasonal, tourism-led slice (founder C7:
  // city seasonality reads as the tourism / commuter mix, never an invented month index).
  const segs: Array<[string, number, string, string]> = [
    ["Residents", o.resident_pct, "var(--c-line-strong)", "steady"],
    ["Visitors", o.visitor_pct, "var(--c-border)", "seasonal"],
  ];
  const sizeBox = hasSize ? (
    <Box>
      <Head icon="market-size" sample={sample}>The spending pool</Head>
      {hasMagnitude ? (
        <div className="flex flex-wrap items-baseline gap-x-3">
          <Fig className="text-3xl text-[var(--terra-text)]">${Math.round((o.spend_per_capita_usd || 0) / 1000)}K</Fig>
          <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">
            spent per resident a year
            {growth != null ? <>, {growth >= 0 ? "up" : "down"} <Fig className="text-[var(--c-ink)]">{Math.abs(growth)}%</Fig> on the year</> : null}.
          </span>
        </div>
      ) : null}
      {/* THE WORD IS THE VALUE. No bar and no position: a precise marker on a rough
          measure fakes precision, which FORM-CATALOG names as the meter do-not, and
          §26 permits a lone value to stay a value. It is also a different form from
          the tier bands and the share bar elsewhere on this page (§25, §33). The
          statistic's own name never appears (§40); the gloss explains it plainly. */}
      {spreadWord ? (
        <div className="flex flex-wrap items-baseline gap-x-3">
          <span className="text-[length:var(--t-focal)] font-semibold leading-none text-[var(--c-ink)]">{spreadWord}</span>
          <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">
            how the money is spread here<InfoTip gloss={`Whether earnings in ${d.meta?.city} cluster around a middle or stretch between a wealthy few and everyone else. A place where they cluster suits a volume trade; a place where they stretch suits a premium one.`} />
          </span>
        </div>
      ) : null}
      {/* the millionaire count: how deep the premium ticket runs (the Head tag covers it). */}
      {hasMillionaires ? (
        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 border-t border-[var(--c-border)] pt-3">
          <Fig className="text-[length:var(--t-sub)] text-[var(--c-ink)]">{Math.round((o.millionaires_count || 0) / 1000)}K</Fig>
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
    <Box>
      <Head icon="seasonality" sample={sample}>How seasonal it is</Head>
      <div className="flex h-6 overflow-hidden rounded-lg border border-[var(--c-border)]" role="img" aria-label={`Residents ${o.resident_pct}% steady, visitors ${o.visitor_pct}% seasonal`}>
        {segs.map(([n, pct, bg]) => <div key={n} className="h-full" style={{ width: `${Math.round((pct / splitTotal) * 10000) / 100}%`, background: bg }} />)}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[length:var(--t-micro)] text-[var(--c-ink2)]">
        {segs.map(([n, pct, bg, tag]) => (
          <span key={n} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: bg }} /><span className="fig font-semibold text-[var(--c-ink)]">{n} {pct}%</span>, {tag}</span>
        ))}
      </div>
    </Box>
  ) : null;
  if (sizeBox && tourismBox) return <WideRail>{sizeBox}{tourismBox}</WideRail>;
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
    <Box>
      {/* NOT a restatement of the chapter heading above it (§11, the double-title
          defect): the chapter says what the reader gets, this says what the set IS. */}
      <Head icon="best-areas">Trades with local figures</Head>
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
    <Box>
      <Head icon="startup-cost" sample={sample}>Lowest bar to entry</Head>
      <div className="text-[length:var(--t-lead)] font-semibold text-[var(--c-ink)]">{lead.name}</div>
      <div className="mt-3 flex flex-wrap items-end gap-x-6 gap-y-3 border-t border-[var(--c-border)] pt-3">
        <div>
          <Fig className="text-[32px] leading-none text-[var(--terra-text)]">{k(lead.cost_to_open_usd)}</Fig>
          <div className="mt-1 text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">cost to open the doors</div>
        </div>
        <div>
          <div className="fig text-[length:var(--t-sub)] leading-none text-[var(--c-ink)]">{lead.break_in_0_100}<span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">/100</span></div>
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
      <Box>
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
    <Box>
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

/* CityCharacter. Null-guards on c.texture (omitted on real-data promotion). The spectra
 * render through the kit SpectraTable (the same idiom the country character wears): a
 * NEUTRAL track with a centre tick, both poles equal weight, each row's takeaway beneath. */
function CityCharacter({ d }: { d: any }) {
  const c = d.character;
  if (!c || !(c.texture?.length)) return null;
  const rows: any[] = c.texture ?? [];
  const sample = c._meta?.confidence === "placeholder" || c._meta?.confidence === "modeled";
  // Plain title (§13, "texture" is a metaphor a non-native cannot parse). The per-row
  // advice takeaways are DELETED (§19/§40); the marker position on each spectrum IS the
  // read. The kit SpectraTable renders all four at once (the shared country/city idiom).
  return (
    <Box>
      <Head icon="ease-of-business" sample={sample}>How business runs here</Head>
      <SpectraTable rows={rows} />
    </Box>
  );
}

/* Locals. Null-guards on d.locals_intel (omitted on real-data promotion). */
function Locals({ d }: { d: any }) {
  const items = d.locals_intel ?? [];
  if (items.length === 0) return null;
  // The place-specific bullets move into a disclosure (§18/§19: invented prose out of the
  // first view; these are London-specific and fail the universality test in the open).
  return (
    <Box>
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
/* CityPeers. Null-guards: the whole card omits below two peer rows; each metric row is
 * dropped when NO entity carries it. EVERY row is a home-relative index/delta (§10: no
 * raw cross-geo USD, income and visitors included), oriented so higher = better on all
 * four (§29A: rent is inverted to a cost advantage); one skim rule, no direction flip
 * (§22/G11). The modeled peer set carries a SampleTag (§4). */
function CityPeers({ d }: { d: any }) {
  const rows: any[] = d.peers?.list ?? [];
  if (rows.length < 2) return null;
  const home = rows.find((r) => r.home) ?? rows[0];
  const homeName = home?.name ?? d.meta?.city ?? "the city";
  const sample = d.peers?._meta?.confidence === "placeholder" || d.peers?._meta?.confidence === "modeled";
  const entities: CompareEntity[] = rows.map((r) => ({ id: r.name, name: r.name, home: !!r.home }));
  const has = (key: string) => rows.some((r) => r[key] != null);
  const num = (v: any): v is number => typeof v === "number" && Number.isFinite(v);
  const signed = (v: number) => (v === 0 ? "0" : `${v > 0 ? "+" : ""}${v}`);
  // EVERY row is a like-for-like index/delta against the home city (§10: never raw
  // cross-geo USD), oriented so HIGHER = BETTER on all four (§29A: a cost is inverted;
  // no two rows flip direction, so one skim rule applies). All deltas are home-relative
  // (home = 0), so the table is honest on the seed AND on real data.
  const compareRows: CompareRow[] = [];
  /* THE FIELD NAME, NOT THE ROW'S NAME. `has` asks whether any peer carries a
     field, and every call below passed the row's DISPLAY key instead: "rent" for
     rent_index, "vis" for visitors_m. So the check never found anything, no row
     was ever added, and this table returned null before it drew, for every input
     including the bundled sample. Reproduced in isolation
     (scripts/probe_city_peers_table.mjs): four rows, four measures, and it had
     never once appeared on a page. */
  const row = (key: string, field: string, label: string, valOf: (r: any) => number | null, unit?: string) => {
    if (!has(field)) return;
    const values = Object.fromEntries(rows.map((r) => [r.name, valOf(r)]));
    compareRows.push({
      key, label, unit, higherIsBetter: true,
      values,
      /* A PEER LEVEL WITH HOME READS "same", NOT "0". Zero in a column of signed
         differences reads as a measurement taken and found to be nil. It is not:
         the cost-of-living index carries 65 distinct values across 252 cities, so
         two cities sharing one sit in the same BAND rather than being identical.
         Munich and London share 75, and share a salary figure too, so this table
         was telling a reader that Munich costs exactly what London costs. Home
         keeps 0, because on the home row zero is the anchor, not a finding. */
      display: Object.fromEntries(
        rows.map((r) => {
          const v = values[r.name];
          if (!num(v)) return [r.name, null];
          return [r.name, v === 0 && !r.home ? "same" : signed(v as number)];
        }),
      ),
    });
  };
  /* THE FIELD IS NOT RENT, AND THIS IS THE THIRD PLACE ON THIS PAGE THAT SAID IT
     WAS. The slot is named rent_index and what fills it is the city's
     Cost-of-Living Plus Rent Index, which the adapter states in its own comment.
     The peer strip and the six-reads card were both renamed off "rent" earlier
     today; this row was missed, so the page called one measurement two different
     things two chapters apart. Rulebook v2 §13.

     NO UNIT. CompareRow's own note: index rows carry bare figures and the base is
     named once in the caption. This is an index difference, so "pp" was claiming
     percentage points for something that has none. The two rows below really are
     percentage differences and keep it.

     Still INVERTED, so higher stays better on every row (§29A): a peer at +22 is
     22 index points cheaper to live in than home. */
  if (num(home?.rent_index)) row("rent", "rent_index", "Cheaper to live", (r) => (num(r.rent_index) ? (home.rent_index as number) - r.rent_index : null));
  if (num(home?.spend_index)) row("spend", "spend_index", "Consumer spend", (r) => (num(r.spend_index) ? r.spend_index - (home.spend_index as number) : null), "pp");
  // income + visitors as home-relative INDEX rows, never raw USD or a raw count (§10).
  if (num(home?.median_income_usd) && (home.median_income_usd as number) > 0)
    row("income", "median_income_usd", "Customer income", (r) => (num(r.median_income_usd) ? Math.round((r.median_income_usd / (home.median_income_usd as number)) * 100) - 100 : null), "pp");
  if (num(home?.visitors_m) && (home.visitors_m as number) > 0)
    row("vis", "visitors_m", "Visitors", (r) => (num(r.visitors_m) ? Math.round((r.visitors_m / (home.visitors_m as number)) * 100) - 100 : null), "pp");
  if (compareRows.length === 0) return null;
  return (
    <Box>
      <Rail icon="compare" kicker="Peer cities, side by side" sample={sample} />
      <CompareTable entities={entities} rows={compareRows} caption={`Each shown against ${homeName} at 0; higher is better.`} />
    </Box>
  );
}

/* Close. The pick is the page's held answer after the margin-rank purge (rulebook v1
 * §5): the easiest trade to enter, placed in the lightest-rent district , both figures
 * the seed holds. Null-guards: the whole card omits with no ease-ranked trade AND no
 * district set. The Pro teaser omits when no teaser is held; in review builds the veil
 * renders unlocked (rulebook v1 §45). */
function Close({ d }: { d: any }) {
  /* THE PICK WAS CHOSEN BY A BANNED SCORE, which is worse than displaying one: it
     silently decided what the whole page recommends. It sorted trades by the
     break-in score, and reading the module that produces that score shows it
     blends payback, built on per-city trade take-home, with a term its own
     comment labels "ROOM (crowding)". §5 bans both at city altitude. It also
     surfaced dental practices, which §32 names as the example of an
     out-of-context trade, because dental happened to score highest.

     §41 prescribes the remedy: reframe to the defensible neighbour before
     deleting. The defensible half was always the second one. The lightest-rent
     district is a real measurement from the district engine, it is the question
     the page spent six chapters building toward, and it needs no ranking of
     trades. The trades themselves sit one section above, as a funnel with no
     ranking (§24). */
  const list: any[] = d.where_to_trade?.list ?? [];
  const lightest = list.length > 0 ? list.slice().sort((a, b) => a.rent_mult - b.rent_mult)[0] : null;
  if (!lightest) return null;
  const teaser: string[] = d.where_to_trade?.pro_teaser ?? [];
  const title = lightest.name;
  /* NO SampleTag now, and that is a change a reader sees. The tag was keyed to the
     TRADES block, whose confidence is "mixed", and the trades are gone from this
     card. What is left is the district rent multiple, from the real district
     engine, so §4A does not ask for a tag on it. */
  // ONE accent: terracotta rides ONLY the $60K cost answer (§37). The kicker, the link,
  // and the card frame drop to neutral; the hand-holding prose ("Start there, then...")
  // is DELETED (§19). The two figures + the link carry the pick; the cost is tagged (§4).
  return (
    <Box>
      <Head icon="bookmark">The pick, and where to take it</Head>
      <div className="grid gap-4 md:grid-cols-[1.3fr_1fr] md:items-stretch">
        {/* the decision the whole page built toward */}
        <div className="flex flex-col rounded-[12px] border border-[var(--c-border)] bg-[var(--c-soft)] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Where to start looking in {d.meta?.city}</span>
          </div>
          <div className="mt-1 text-[length:var(--t-sub)] font-semibold text-[var(--c-ink)]">{title}</div>
          <div className="mt-3 flex flex-wrap gap-6 border-t border-[var(--c-border)] pt-3">
            <div><Fig className="text-[length:var(--t-sub)] text-[var(--c-ink)]">x{lightest.rent_mult}</Fig><div className="text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">the lightest district rent</div></div>
            {lightest.character ? <div><div className="text-[length:var(--t-sub)] font-semibold text-[var(--c-ink)]">{lightest.character}</div><div className="text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">the district character</div></div> : null}
          </div>
          {/* The destination is the district set, not a trade page. Hover is INK:
              §37 says the accent never appears on hover, and the link this replaces
              turned terracotta. */}
          <a href={`/cities/${d.meta?.slug}/neighborhoods`} className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[length:var(--t-body)] font-semibold text-[var(--c-ink2)] transition hover:text-[var(--c-ink)]"><AtlasMark id="alt-business" size={14} className="shrink-0" />See every district &#8594;</a>
        </div>
        {/* the Pro / compare hand-off */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-[length:var(--t-body)] text-[var(--c-ink)]">Set {d.meta?.city} beside up to three cities, side by side.</div>
            <a href="/compare" className="mt-2 inline-flex cursor-pointer rounded-full bg-[var(--c-ink)] px-4 py-2 text-[length:var(--t-body)] font-semibold text-white transition hover:bg-[var(--terra-text)]">Open Compare</a>
          </div>
          {/* the workbook preview , a tight SCHEMATIC bullet list, not floating prose
              lines force-spread with min-h/justify-evenly (rule 19 schematic content;
              rule 17 no crater). Bullets is the sanctioned neutral-dot list form. */}
          {teaser.length > 0 ? (
            <LockVeil unlocked={isReviewBuild()} headline={`The full ${d.meta?.city} workbook`} note="Every district by every trade, the real cost stack, and the owner-runway calculator." cta="Unlock with Pro">
              <div className="py-1"><Bullets items={teaser} /></div>
            </LockVeil>
          ) : null}
        </div>
      </div>
    </Box>
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
  const hasCostCh = !!(d.space?.read);
  const hasCustomersCh = !!(d.demand && (d.demand.resident_pct != null || d.demand.spend_per_capita_usd != null)) || !!(d.income?.median_income_usd != null);
  const tradeList = d.trades?.list ?? [];
  // The owner-keeps net-margin block (MarginKept) is DELETED (§5 banned metric + the
  // "fundamentally wrong" horizontal-bar money split, founder C9); the chapter is now
  // the ease + cost-to-open read alone, so it only renders when those figures are held.
  /* The chapter now renders on the FUNNEL, not on a ranking. The old guard asked
     for a break-in score and a cost to open together, and no city has ever carried
     both, so this chapter has been dark since the real-data promotion. */
  const hasTradesCh = (d.trades_here?.list?.length ?? 0) >= 4;
  const hasRunningCh = !!(d.risks?.list?.length) || !!(d.character?.texture?.length) || !!(d.locals_intel?.length) || !!(d.owner_runway?.rent_1bed_usd_mo != null);
  const hasCloseCh = (d.peers?.list?.length ?? 0) >= 2 || tradeList.some((t: any) => t.break_in_0_100 != null) || !!(d.where_to_trade?.list?.length);

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
      <CityHero d={d} />

      {/* THE HERO, AND THE ONLY FULL-WIDTH BAND ON THE PAGE. Founder, 2026-08-25:
          "for every subsection that stretches left to right full width, I think we
          should ban it except hero section." Art direction D1. It declares itself
          with the hero prop, which sets the attribute the gate reads, because
          looking like a hero is how twenty-eight sections got the whole column. */}
      {d.where_to_trade?.list?.length ? <Band hero><CityVerdict d={d} /></Band> : null}

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
          <Band><WhereToTrade d={d} /><CityLenses d={d} /></Band>
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
          <Band split="2-1"><CityPeers d={d} /><IncomeCurve d={d} /></Band>
          {/* THE EARNINGS CHART PAIRS WITH THE DEMAND ROW, NOT WITH THE RENT
              RATIO. Measured across fifteen cities on 2026-08-25, the rent ratio
              renders for NONE of them, and neither do the owner runway, the risk
              list, the character read or the locals note. Five sections that
              never draw. They stay in the code, because they will render the day
              their data arrives, but the page's rhythm cannot be built on them:
              a band whose partner never appears leaves its survivor in a half
              with a hole beside it, which is the one-sided white space the
              splitting exists to prevent. */}
          <Band split="3-2"><DemandSize d={d} /><CommercialSpace d={d} /></Band>
          <RentAffordability d={d} />
        </>
      ) : null}

      {hasRunningCh ? (
        <>
          <Movement index={cn()} eyebrow="Running it" heading="What to watch" icon="watch" />
          <Band><CityRisks d={d} /><CityCharacter d={d} /></Band>
          <Band split="2-1"><OwnerRunway d={d} /><Locals d={d} /></Band>
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
      {(hasTradesCh || (d.where_to_trade?.list?.length ?? 0) > 0) ? (
        <>
          <Movement index={cn()} eyebrow="The close" heading="What you can open, and where to take it" icon="startup-cost" />
          {/* 2-3, NOT 3-2, AND THE REASON IS RHYTHM (D3). The band before this one
              is already 3-2, and two neighbouring bands with the same split is the
              monotony the rule exists to stop. It also suits the content better
              (D4): the chip row is a list of links and the pick card carries a
              figure, a district and two actions. */}
          <Band split="2-3"><TradesHere d={d} /><Close d={d} /></Band>
        </>
      ) : null}
    </main>
  );
}
