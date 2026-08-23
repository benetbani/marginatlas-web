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
import { Fig, Stat, Movement, Box, Head, Rail, WideRail, Even, TERRA, TRACK, InfoTip, InlineDisclosure, SpectraTable, SampleTag, Bullets } from "@/components/spine/kit";
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
  const fmtDelta = (v: number) => (v === 0 ? "0" : `${v > 0 ? "+" : ""}${v}pp`);
  const hasTerms = s.deposit_months != null && s.lease_years_typical != null && s.rent_free_months != null;
  const terms: Array<[string, string]> = hasTerms
    ? [[`${s.deposit_months} mo`, "deposit up front"], [`${s.lease_years_typical}`, "typical lease, years"], [`${s.rent_free_months} mo`, "rent-free fit-out"]]
    : [];
  const peerSample = d.peers?._meta?.confidence === "placeholder" || d.peers?._meta?.confidence === "modeled";
  const spaceSample = s._meta?.confidence === "placeholder" || s._meta?.confidence === "modeled";
  // The left kicker is "Rent against peer cities" , NOT a restatement of the chapter
  // title "What space costs" (§11/§13, the double-title defect). The verdict caption
  // (peer_read) and the terms prose (terms_note) are DELETED (§14/§19/§26); the finding
  // lives on the marker strip. Both boxes carry the modeled tag (§4).
  return (
    <WideRail>
      <Box>
        <Rail icon="commercial-rent" kicker="Rent against peer cities" sample={peerSample} />
        {/* the peer dot strip below (home city = 0) IS the pressure read; no second scale. */}
        {/* peers on ONE axis. Only rendered when at least two peers carry a real rent index. */}
        {hasPeerStrip ? (
          <div className="mt-2 border-t border-[var(--c-border)] pt-3">
            <div className="mb-1 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Against {d.meta?.city}, in percentage points<InfoTip gloss={`A percentage point is the plain gap between two percentages: a peer at -22pp pays 22 points less than the ${d.meta?.city} rent level.`} /></div>
            <div className="relative h-[76px]" role="img" aria-label={`Rent against ${d.meta?.city} in percentage points: ${peers.map((p: any) => `${p.name} ${fmtDelta(p.delta)}`).join(", ")}`}>
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--c-line-strong)]" />
              {peers.map((p: any, i: number) => {
                const x = ((p.delta - lo) / span) * 100;
                const home = p.home;
                const above = i % 2 === 0;
                return (
                  /* The home marker paints LAST. Two cities can share a cost index (London
                     and Munich both read 75), and the later dot covers the earlier one, so
                     the one dot in terracotta, the whole point of the strip, was being
                     hidden under a grey peer. Paint order only: the sort, and therefore
                     which side each label sits on, is untouched. */
                  <span key={p.name} className={`absolute -translate-x-1/2 ${home ? "z-[1]" : ""}`} style={{ left: `${x}%`, top: "50%" }}>
                    <span className="block h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white" style={{ background: home ? TERRA : "var(--c-line-strong)", boxShadow: "0 0 0 1px var(--c-border)" }} />
                    <span className={`absolute left-1/2 flex -translate-x-1/2 flex-col items-center whitespace-nowrap leading-tight ${above ? "bottom-[14px]" : "top-[9px]"}`}>
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
  const hasSize = hasMagnitude || hasMillionaires;
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
  const tourismBox = hasSplit ? (
    <Box>
      <Head icon="seasonality" sample={sample}>How seasonal it is</Head>
      <div className="flex h-6 overflow-hidden rounded-lg border border-[var(--c-border)]" role="img" aria-label={`Residents ${o.resident_pct}% steady, visitors ${o.visitor_pct}% seasonal`}>
        {segs.map(([n, pct, bg]) => <div key={n} className="h-full" style={{ width: `${pct}%`, background: bg }} />)}
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
  const row = (key: string, label: string, valOf: (r: any) => number | null) => {
    if (!has(key)) return;
    const values = Object.fromEntries(rows.map((r) => [r.name, valOf(r)]));
    compareRows.push({
      key, label, unit: "pp", higherIsBetter: true,
      values,
      display: Object.fromEntries(rows.map((r) => [r.name, num(values[r.name]) ? signed(values[r.name] as number) : null])),
    });
  };
  // rent INVERTED to a cost advantage: a peer at +22 pays 22 points less rent than home.
  if (num(home?.rent_index)) row("rent", "Cheaper rent", (r) => (num(r.rent_index) ? (home.rent_index as number) - r.rent_index : null));
  if (num(home?.spend_index)) row("spend", "Consumer spend", (r) => (num(r.spend_index) ? r.spend_index - (home.spend_index as number) : null));
  // income + visitors as home-relative INDEX rows, never raw USD or a raw count (§10).
  if (num(home?.median_income_usd) && (home.median_income_usd as number) > 0)
    row("income", "Customer income", (r) => (num(r.median_income_usd) ? Math.round((r.median_income_usd / (home.median_income_usd as number)) * 100) - 100 : null));
  if (num(home?.visitors_m) && (home.visitors_m as number) > 0)
    row("vis", "Visitors", (r) => (num(r.visitors_m) ? Math.round((r.visitors_m / (home.visitors_m as number)) * 100) - 100 : null));
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
  const list: any[] = d.where_to_trade?.list ?? [];
  const trades: any[] = d.trades?.list ?? [];
  const pick = trades.filter((t: any) => t.break_in_0_100 != null).slice().sort((a: any, b: any) => (b.break_in_0_100 ?? 0) - (a.break_in_0_100 ?? 0))[0];
  const lightest = list.length > 0 ? list.slice().sort((a, b) => a.rent_mult - b.rent_mult)[0] : null;
  // Nothing to hand off: no ease-ranked trade AND no district set.
  if (!pick && !lightest) return null;
  const teaser: string[] = d.where_to_trade?.pro_teaser ?? [];
  const title = [pick?.name, lightest ? `in ${lightest.name}` : null].filter(Boolean).join(", ");
  const sample = ["placeholder", "modeled", "mixed"].includes(d.trades?._meta?.confidence);
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
            <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">The {d.meta?.city} pick</span>
            {sample ? <SampleTag /> : null}
          </div>
          <div className="mt-1 text-[length:var(--t-sub)] font-semibold text-[var(--c-ink)]">{title}</div>
          {(pick?.cost_to_open_usd != null || lightest) ? (
            <div className="mt-3 flex flex-wrap gap-6 border-t border-[var(--c-border)] pt-3">
              {pick?.cost_to_open_usd != null ? <div><Fig className="text-[length:var(--t-sub)] text-[var(--terra-text)]">{k(pick.cost_to_open_usd)}</Fig><div className="text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">cost to open the doors</div></div> : null}
              {lightest ? <div><Fig className="text-[length:var(--t-sub)] text-[var(--c-ink)]">x{lightest.rent_mult}</Fig><div className="text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">the lightest district rent</div></div> : null}
            </div>
          ) : null}
          {pick ? <a href={pick.href} className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[length:var(--t-body)] font-semibold text-[var(--c-ink2)] transition hover:text-[var(--terra-text)]"><AtlasMark id="alt-business" size={14} className="shrink-0" />See the trade's live economics &#8594;</a> : null}
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
  const hasTradesCh = tradeList.some((t: any) => t.break_in_0_100 != null && t.cost_to_open_usd != null);
  const hasRunningCh = !!(d.risks?.list?.length) || !!(d.character?.texture?.length) || !!(d.locals_intel?.length) || !!(d.owner_runway?.rent_1bed_usd_mo != null);
  const hasCloseCh = (d.peers?.list?.length ?? 0) >= 2 || tradeList.some((t: any) => t.break_in_0_100 != null) || !!(d.where_to_trade?.list?.length);

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
      <CityHero d={d} />

      {/* The verdict masthead , shown when the city has a district set to read on. */}
      {d.where_to_trade?.list?.length ? <CityVerdict d={d} /> : null}

      {/* Districts LEAD the numbered chapters (founder C1) , the map + rent-load
          dot plot is the page's signature answer, so it opens as Movement 01 and
          the map's top edge crests into the first frame. */}
      {hasWhereCh ? (
        <>
          <Movement index={cn()} heading="Where to trade" icon="best-areas" />
          <WhereToTrade d={d} />
        </>
      ) : null}

      {/* The five-read lenses follow as their OWN numbered chapter, rendered ONLY when
          the lens scales exist (omitted on real-data promotion , no per-axis source), so
          the "The city's conditions" heading is never an orphan above an empty section. */}
      {d.lenses?.scales?.length ? (
        <>
          <Movement index={cn()} eyebrow="The verdict" heading="The city's conditions" icon="gut-check" />
          <CityLenses d={d} />
        </>
      ) : null}

      {/* What it costs , commercial space + the lease terms (the peer read in
          percentage points). OwnerRunway moved beside the risk material (C4);
          RentAffordability beside "What customers earn here" (C5). */}
      {hasCostCh ? (
        <>
          <Movement index={cn()} eyebrow="What it costs here" heading="What space costs" icon="commercial-rent" />
          <CommercialSpace d={d} />
        </>
      ) : null}

      {/* Your customers , demand size (with the resident/visitor split folded in),
          the seasonal read, then earnings beside the rent-against-income ratio. */}
      {hasCustomersCh ? (
        <>
          <Movement index={cn()} eyebrow="Your customers" heading="Who buys, and when" icon="spending-power" />
          <div className="space-y-4">
            <DemandSize d={d} />
            {/* the income chart is the wide leg; the rent-against-income ratio is a
                schematic KV rail beside it (WideRail, not Even) , the ratio card carried
                too little to fill an equal column and left a crater (rule 17). */}
            <WideRail><IncomeCurve d={d} /><RentAffordability d={d} /></WideRail>
          </div>
        </>
      ) : null}

      {/* Trades , the easiest way in and what it costs to open (no city-level net-margin
          split: that is a banned metric, §5, and the horizontal-bar money split was the
          founder's "fundamentally wrong" C9 call). */}
      {hasTradesCh ? (
        <>
          <Movement index={cn()} eyebrow="Trades and rivals" heading="What to open, and what it costs" icon="startup-cost" />
          <LowestBar d={d} />
        </>
      ) : null}

      {/* Running it , risks, your own living costs, character and locals. No
          first-year timeline: a first-year ramp is a trade-level concept and this
          page is trade-agnostic (rulebook v1 §9); see the file header note. */}
      {hasRunningCh ? (
        <>
          <Movement index={cn()} eyebrow="Running it" heading="What to watch" icon="watch" />
          <div className="space-y-4">
            <CityRisks d={d} />
            <CityCharacter d={d} />
            <Even><OwnerRunway d={d} /><Locals d={d} /></Even>
          </div>
        </>
      ) : null}

      {/* The close , the peer comparison then the real hand-off. */}
      {hasCloseCh ? (
        <>
          <Movement index={cn()} eyebrow="The close" heading="The next move" icon="bookmark" />
          <div className="space-y-4">
            <CityPeers d={d} />
            <Close d={d} />
          </div>
        </>
      ) : null}
    </main>
  );
}
