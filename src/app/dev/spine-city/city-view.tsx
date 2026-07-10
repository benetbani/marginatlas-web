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
 * On real-data promotion the surviving spine is a tight decision line: verdict(real) ->
 * where to trade(real) -> what space costs(prose) + who buys(real income curve + split) ->
 * trades + margins(real) -> peers + close(real). The illustrative tail (CityLenses,
 * OwnerRunway, RentAffordability, DemandSize magnitude + Spark, DemandCalendar, CityRisks,
 * CityCharacter, income tiers, locals_intel, the district map) omits for lack of a source.
 * RentAffordability needs the same owner_runway rent figure OwnerRunway does (omitted on
 * promotion), so it never renders on the real page either , a same-tier honest pairing.
 *
 * NO first-year timeline (rulebook v2 S10/D4): a first-year ramp is a TRADE-level concept
 * (how long THIS business takes to break even), and a city page is trade-agnostic, so any
 * such timeline here would necessarily invent a representative trade. There is no honest
 * anchor at city altitude, so the block was deleted rather than replaced (2026-07-10).
 *
 * As-built chart dictionary: unchanged from the pre-split page (see git history); the
 * split adds only the named export + the null-guards, no new visual idiom.
 */
import * as React from "react";
import { spineCitySeed } from "@/lib/spine-seeds";
import { Fig, Stat, Spark, Movement, Box, Head, Rail, EaseScale, Full, WideRail, Even, TERRA, TRACK, InfoTip, InlineDisclosure, SpectraTable, MiniBar } from "@/components/spine/kit";
import { CompareTable, type CompareEntity, type CompareRow, LockVeil, CellScaleBar } from "@/components/spine/kit-index";
import { AtlasIcon, type AtlasIconId } from "@/components/brand/icons";
import { AtlasMark } from "@/components/spine/marks";
import { CityHero } from "./masthead";
import { CityStyles } from "./motion";
import { IncomeCurve, OwnerRunway, MarginKept, RentAffordability } from "./chapters";
import { WhereToTrade } from "./where-to-trade";

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const k = (v: number) => "$" + Math.round((v || 0) / 1000) + "K";

/* ================= CH1 , THE VERDICT ================= */
/* CityVerdict masthead. The dominant figure is the DISTRICT KEEP SPREAD (the page's real
 * verdict: where you trade moves what you keep); the best-trade keep drops to one support
 * fact in the strip. Null-guards on d.verdict (omitted when no real margin leader); with
 * no district rows the trade keep falls back to the focal slot so the box never empties. */
function CityVerdict({ d }: { d: any }) {
  const v = d.verdict;
  if (!v || v.keep_pct == null) return null;
  const list: any[] = d.where_to_trade?.list ?? [];
  const withKeep = list.map((x) => ({ ...x, keep: Math.round(((1 + x.rev_vs_city_pct / 100) / x.rent_mult) * 100) }));
  const best = withKeep.slice().sort((a, b) => b.keep - a.keep)[0];
  const loud = withKeep.slice().sort((a, b) => b.rev_vs_city_pct - a.rev_vs_city_pct)[0];
  const tradeName = String(v.winner_trade ?? "").replace(" keeps the most", "");
  return (
    <div className="overflow-hidden rounded-[14px] border border-[var(--terra-border)] bg-[var(--c-card)]">
      <div className="p-5 md:p-6">
        <div className="grid gap-5 md:grid-cols-[1.5fr_1fr] md:items-end">
          <div>
            {/* plain title (rulebook v2 S16); the focal "X vs 100" Stat beside it
                carries the finding, so no thesis paragraph is needed above it. */}
            <h2 data-typography="custom" className="text-[length:var(--t-sub)] font-bold leading-tight tracking-tight text-[var(--c-ink)] md:text-[2rem]">The margin, district by district</h2>
            {/* at most one short line (rulebook v2 residue pass): the honest caveat,
                no boxed treatment, no icon , the Stat carries the answer. */}
            {v.catch ? <p className="mt-2 max-w-prose text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{v.catch}</p> : null}
          </div>
          <div>
            {/* the district keep spread is the verdict's dominant figure; the best-trade
                keep only holds this slot when no district set is held. */}
            {best ? (
              <Stat size="focal" accent value={`${best.keep} vs 100`} label="the district keep spread" sub={`the best district keeps ${best.keep} of the city-average 100 of each sale; the loudest keeps ${loud?.keep}`} />
            ) : (
              <Stat size="focal" accent value={`${v.keep_pct}%`} label="best trade keeps" sub="of sales, the best keeper here" />
            )}
          </div>
        </div>
      </div>
      {/* grey strip: the best-trade keep, ONE supporting fact under the district spread.
          Omitted when the trade keep already carries the focal slot above. */}
      {best ? (
        <div className="border-t border-[var(--terra-border)] bg-[var(--c-card)] px-5 py-2.5 md:px-6">
          <div className="flex items-baseline gap-1.5"><span className="min-w-0 truncate text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{tradeName} keeps</span><Fig className="shrink-0 text-[length:var(--t-lead)] text-[var(--c-ink)]">{v.keep_pct}%</Fig></div>
          <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">of sales, the best keeper here</div>
        </div>
      ) : null}
    </div>
  );
}

/* CityLenses. Null-guards on d.lenses.scales (omitted on real-data promotion , the
 * live adapter never supplies lenses at all; see adapt_city.ts's omitted-fields list).
 * The five axes are hand-authored reads with no per-axis source, so the block carries
 * a SampleTag (rulebook v2 D4: a modeled figure shown as real is the worst defect),
 * and the shared scale's end labels stay a qualitative lean ("harder"/"easier"), never
 * a precise for-or-against-you verdict the data cannot support. */
function CityLenses({ d }: { d: any }) {
  const o = d.lenses;
  if (!o || !(o.scales?.length)) return null;
  const rows: Array<[string, number, string, string?]> = (o.scales ?? []).map((s: any) => [s.label, s.pos, s.word, s.sub]);
  const sample = o._meta?.confidence === "placeholder" || o._meta?.confidence === "modeled";
  return (
    <Box className="citytop">
      <div className="grid gap-5 md:grid-cols-[1fr_1.7fr] md:items-start">
        <div>
          <Head sample={sample}>Five quick reads</Head>
          <p className="text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{o.read}</p>
        </div>
        <EaseScale rows={rows} endLabels={["Harder", "Easier"]} />
      </div>
    </Box>
  );
}

/* ================= CH2 , WHAT IT COSTS HERE ================= */
/* CommercialSpace. Null-guards: the whole card omits when no space read; the numeric
 * rent-pressure figure + the peer rent STRIP + the lease-terms card each omit when their
 * (omitted) fields are absent, leaving the sanctioned space prose alone. */
function CommercialSpace({ d }: { d: any }) {
  const s = d.space;
  if (!s || !s.read) return null;
  const peers = (d.peers?.list ?? []).filter((p: any) => p.rent_index != null).slice().sort((a: any, b: any) => (a.rent_index || 0) - (b.rent_index || 0));
  const hasPeerStrip = peers.length >= 2;
  const idxVals = peers.map((p: any) => p.rent_index || 0);
  const lo = hasPeerStrip ? Math.min(...idxVals) - 6 : 0;
  const hi = hasPeerStrip ? Math.max(...idxVals) + 5 : 1;
  const span = Math.max(1, hi - lo);
  const hasTerms = s.deposit_months != null && s.lease_years_typical != null && s.rent_free_months != null;
  const terms: Array<[string, string]> = hasTerms
    ? [[`${s.deposit_months} mo`, "deposit up front"], [`${s.lease_years_typical}`, "typical lease, years"], [`${s.rent_free_months} mo`, "rent-free fit-out"]]
    : [];
  return (
    <WideRail>
      <Box className="citytop">
        <Rail icon="commercial-rent" kicker="What commercial space costs" />
        {/* the peer dot strip below (London = 100) IS the pressure read; no second scale. */}
        {/* peers on ONE axis. Only rendered when at least two peers carry a real rent index. */}
        {hasPeerStrip ? (
          <div className="mt-2 border-t border-[var(--c-border)] pt-3">
            <div className="mb-1 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Rent index vs peer cities</div>
            <div className="relative h-[76px]" role="img" aria-label={`Rent index on one axis: ${peers.map((p: any) => `${p.name} ${p.rent_index}`).join(", ")}`}>
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--c-line-strong)]" />
              {peers.map((p: any, i: number) => {
                const x = ((p.rent_index - lo) / span) * 100;
                const home = p.home;
                const above = i % 2 === 0;
                return (
                  <span key={p.name} className="absolute -translate-x-1/2" style={{ left: `${x}%`, top: "50%" }}>
                    <span className="block h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white" style={{ background: home ? TERRA : "#c8c8c6", boxShadow: "0 0 0 1px #e3e3e3" }} />
                    <span className={`absolute left-1/2 flex -translate-x-1/2 flex-col items-center whitespace-nowrap leading-tight ${above ? "bottom-[14px]" : "top-[9px]"}`}>
                      <span className={`text-[length:var(--t-micro)] ${home ? "font-semibold text-[var(--terra-text)]" : "text-[var(--c-muted)]"}`}>{p.name}</span>
                      <Fig className={`text-[length:var(--t-micro)] ${home ? "text-[var(--terra-text)]" : "text-[var(--c-ink2)]"}`}>{p.rent_index}</Fig>
                    </span>
                  </span>
                );
              })}
            </div>
            {s.peer_read ? <div className="mt-1 text-[length:var(--t-micro)] text-[var(--c-muted)]">{s.peer_read}</div> : null}
          </div>
        ) : null}
      </Box>
      {hasTerms ? (
        <Box className="citytop">
          <Rail kicker="The lease terms" />
          <div className="divide-y divide-[var(--c-border)]">{terms.map(([v, l]) => (
            <div key={l} className="flex items-baseline justify-between gap-3 py-2"><span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">{l}</span><Fig className="text-[length:var(--t-lead)] text-[var(--c-ink)]">{v}</Fig></div>
          ))}</div>
          {s.terms_note ? <div className="mt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">{s.terms_note}</div> : null}
        </Box>
      ) : null}
    </WideRail>
  );
}

/* ================= CH3 , YOUR CUSTOMERS ================= */
/* DemandSize. Null-guards: the whole card omits when no split AND no magnitude; the
 * $-magnitude line + the Spark omit when their (omitted) fields are absent, leaving the
 * real resident/visitor split. The DemandCalendar half omits when no monthly index. */
function DemandSize({ d }: { d: any }) {
  const o = d.demand;
  const hasSplit = o && o.resident_pct != null && o.visitor_pct != null;
  // the focal is now the per-resident figure, so the magnitude block needs BOTH the
  // per-capita spend (the focal) and the pool (its ink subline) to be held.
  const hasMagnitude = o && o.consumer_spend_usd_bn != null && o.spend_per_capita_usd != null;
  if (!o || (!hasSplit && !hasMagnitude)) return null;
  const growth = o?.growth_pct_yoy;
  const trendId = growth == null ? null : growth > 0 ? "trend-rising" : growth < 0 ? "trend-falling" : "trend-flat";
  // magnitude-mapped greys (largest segment darkest) + ink labels (AA on both greys)
  const segs: Array<[string, number, string]> = [["Residents", o.resident_pct, "#aeaeac"], ["Visitors", o.visitor_pct, "#dcdcda"]];
  const years: number[] = o.trend_years ?? [];
  const hasTrend = (o.trend_index?.length ?? 0) >= 2;
  const hasCalendar = (d.demand_calendar?.months?.length ?? 0) > 0;
  const sizeBox = (
    <Box className="citytop">
      <Rail icon="market-size" kicker={hasMagnitude ? "How big the spending pool is" : "Where the trade comes from"} />
      {hasMagnitude ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {/* the per-resident figure is the decision read (what a customer here spends);
              the pool magnitude and its growth drop to the ink subline. */}
          <div className="flex flex-wrap items-baseline gap-x-3">
            <Fig className="text-3xl text-[var(--terra-text)]">${Math.round((o.spend_per_capita_usd || 0) / 1000)}K</Fig>
            <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">
              spent per resident a year, a <Fig className="text-[var(--c-ink)]">${o.consumer_spend_usd_bn}B</Fig> metro pool
              {growth != null ? <>, {growth >= 0 ? "up" : "down"} <Fig className="text-[var(--c-ink)]">{Math.abs(growth)}%</Fig> on the year{trendId ? <> <AtlasMark id={trendId} size={14} className="inline-block align-[-2px]" /></> : null}</> : null}.
            </span>
          </div>
          {/* the multi-year trajectory: labelled endpoints so the span is never a guess */}
          {hasTrend ? (
            <div className="flex items-center gap-2">
              <div>
                <Spark values={o.trend_index} />
                {years.length === 2 ? <div aria-hidden className="flex justify-between text-[length:var(--t-micro)] leading-none text-[var(--c-muted)]"><Fig>{years[0]}</Fig><Fig>{years[1]}</Fig></div> : null}
              </div>
              <span className="text-[length:var(--t-micro)] leading-tight text-[var(--c-muted)]">spend<br />trend</span>
            </div>
          ) : null}
        </div>
      ) : null}
      {/* resident/visitor split, folded in as an inline share bar */}
      {hasSplit ? (
        <div className={hasMagnitude ? "mt-4 border-t border-[var(--c-border)] pt-3" : ""}>
          <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Who spends it</div>
          <div className="flex h-6 overflow-hidden rounded-lg border border-[var(--c-border)]" role="img" aria-label={`Residents ${o.resident_pct}%, visitors ${o.visitor_pct}%`}>{segs.map(([n, pct, bg]) => <div key={n} className="flex h-full items-center justify-center" style={{ width: `${pct}%`, background: bg }}><span className="fig text-[length:var(--t-micro)] font-semibold text-[var(--c-ink)]">{n} {pct}%</span></div>)}</div>
          <div className="mt-1.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">Resident money is the steady base; visitor money is seasonal and patchy by area.</div>
        </div>
      ) : null}
    </Box>
  );
  const calBox = hasCalendar ? (
    <Box className="citytop">
      <Rail icon="seasonality" kicker="Busy months and quiet months" />
      <DemandCalendar d={d} />
    </Box>
  ) : null;
  if (calBox) return <WideRail>{sizeBox}{calBox}</WideRail>;
  return sizeBox;
}

/* DemandCalendar. Only reached when d.demand_calendar.months is non-empty. */
function DemandCalendar({ d }: { d: any }) {
  const m: number[] = d.demand_calendar?.months ?? []; const max = Math.max(1, ...m); const peak = m.indexOf(max);
  return (
    <>
      <div className="flex items-end justify-between gap-1.5" style={{ height: 92 }} role="img" aria-label="Monthly demand across the year, baselined from zero">
        {m.map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1" style={{ height: "100%" }}>
            <div className="w-full rounded-t" style={{ height: `${(v / max) * 100}%`, background: i === peak ? TERRA : "#dcd6d1" }} />
            <span className={`text-[length:var(--t-micro)] ${i === peak ? "font-semibold text-[var(--terra-text)]" : "text-[var(--c-muted)]"}`}>{MONTHS[i]}</span>
          </div>
        ))}
      </div>
      <div className="mt-1.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">Indexed demand by month, drawn from zero.</div>
    </>
  );
}

/* ================= CH4 , TRADES AND RIVALS ================= */
/* TopTrades. Null-guards: the whole card omits below three real trade rows. The Crowding
 * column omits when no saturation figure is held (real-data promotion). */
function TopTrades({ d }: { d: any }) {
  const arr = (d.trades?.list ?? []).filter((t: any) => t.take_home_usd != null).slice().sort((a: any, b: any) => b.take_home_usd - a.take_home_usd);
  if (arr.length < 3) return null;
  const max = Math.max(1, ...arr.map((t: any) => t.take_home_usd));
  const word = (s: number) => (s > 70 ? "Crowded" : s > 50 ? "Busy" : "Room");
  const hasCrowding = arr.some((t: any) => t.saturation_0_100 != null);
  // the page's pick: the margin leader (the terracotta dot's one carrier here)
  const keepLead = arr.filter((t: any) => t.net_margin_pct != null).slice().sort((a: any, b: any) => (b.net_margin_pct ?? 0) - (a.net_margin_pct ?? 0))[0] ?? {};
  // below sm the bar column drops (name / right-aligned take-home / keeps); it returns sm+.
  const cols = hasCrowding ? "grid-cols-[minmax(0,140px)_1fr_52px] sm:grid-cols-[150px_1fr_84px_52px_64px]" : "grid-cols-[minmax(0,140px)_1fr_52px] sm:grid-cols-[150px_1fr_84px_52px]";
  return (
    <Box className="citytop">
      <Rail icon="owner-keeps" kicker="Owner take-home by trade" />
      {/* column headers so every cell is self-labelling */}
      <div className={`-mx-2 grid ${cols} items-center gap-3 px-2 pb-1 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]`}>
        <span>Trade</span><span className="hidden sm:block" /><span className="text-right">Take-home ($/yr)</span><span className="text-right">Keeps</span>{hasCrowding ? <span className="hidden items-baseline justify-end sm:flex">Crowding<InfoTip gloss="How many rivals compete for the same customers." /></span> : null}
      </div>
      <div className="space-y-2.5">{arr.map((t: any) => {
        const isPick = t.slug === keepLead.slug;
        return (
          <a key={t.slug} href={t.href ?? "/dev/spine-cell"} className={`hov -mx-2 grid ${cols} items-center gap-3 rounded-md px-2 py-1.5`}>
            <span className={`min-w-0 truncate text-[length:var(--t-body)] ${isPick ? "font-semibold" : ""} text-[var(--c-ink)]`}>{t.name}</span>
            <div className="hidden h-2.5 min-w-0 overflow-hidden rounded-full sm:block" style={{ background: TRACK }}><div className="h-full rounded-full" style={{ width: `${(t.take_home_usd / max) * 100}%`, background: "#c8c8c6" }} /></div>
            <Fig className="text-right text-[length:var(--t-body)] text-[var(--c-ink)]">{k(t.take_home_usd)}</Fig>
            <span className="flex items-center justify-end gap-1.5">
              {isPick ? <span aria-hidden className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: TERRA }} /> : null}
              {t.net_margin_pct != null ? <Fig className={`text-right text-[length:var(--t-body)] ${isPick ? "font-semibold" : ""} text-[var(--c-ink)]`}>{t.net_margin_pct}%</Fig> : <span className="text-right text-[length:var(--t-body)] text-[var(--c-muted)]">-</span>}
            </span>
            {hasCrowding ? <span className="hidden text-right text-[length:var(--t-micro)] text-[var(--c-ink2)] sm:block">{t.saturation_0_100 != null ? word(t.saturation_0_100) : ""}</span> : null}
          </a>
        );
      })}</div>
      <div className="mt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">Ranked by owner take-home a year; the kept share of sales is the read that matters. Tap a trade for the full city economics.</div>
    </Box>
  );
}

/* MarginRail , the per-trade net-margin list beside MarginKept. Null-guards below one
 * trade with a real margin. */
function MarginRail({ d }: { d: any }) {
  const arr = (d.trades?.list ?? []).filter((t: any) => t.net_margin_pct != null).slice();
  if (arr.length === 0) return null;
  const lead = arr.slice().sort((a: any, b: any) => (b.net_margin_pct ?? 0) - (a.net_margin_pct ?? 0))[0] ?? {};
  const byMargin = arr.slice().sort((a: any, b: any) => (b.net_margin_pct ?? 0) - (a.net_margin_pct ?? 0));
  return (
    <Box className="citytop md:flex-[2]">
      <Rail kicker="Net margin by trade" />
      <div className="divide-y divide-[var(--c-border)]">{byMargin.map((t: any) => {
        const isLead = t.slug === lead.slug;
        const pct = Math.max(0, Number(t.net_margin_pct ?? 0));
        return (
          <div key={t.slug} className="hov -mx-2 grid grid-cols-[minmax(0,110px)_1fr_38px] items-center gap-3 rounded-md px-2 py-1.5">
            <span className={`min-w-0 truncate text-[length:var(--t-body)] ${isLead ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink2)]"}`}>{t.name}</span>
            <span className="-mt-1 block" role="img" aria-label={`${t.name}: ${pct} percent of sales kept`}><CellScaleBar value={pct} domain={[0, 100]} /></span>
            <Fig className={`text-right text-[length:var(--t-body)] ${isLead ? "font-bold text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{pct}%</Fig>
          </div>
        );
      })}</div>
      {/* the drawn shared axis , same 0..100 "of sales" scale as the split beside it */}
      <div aria-hidden className="-mx-2 mt-1 grid grid-cols-[minmax(0,110px)_1fr_38px] items-center gap-3 px-2">
        <span /><div className="flex justify-between text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]"><span>0%</span><span>100% of sales</span></div><span />
      </div>
    </Box>
  );
}

/* EasiestTrades , reframed to mirror the country form: TYPICAL BUSINESSES and what they
 * COST TO START. Unfeatured, the canonical six sorted by capital heaviest-first (never a
 * cheap-first ranking), ease as a /10 support column, no terracotta. Rows missing a held
 * cost or ease show a plain dash rather than a fabricated figure. */
const TRADE_ICON: Record<string, AtlasIconId> = {
  "restaurants": "trade-restaurant", "grocery-stores": "trade-grocery", "dental-practices": "trade-dental",
  "cafes-coffee": "trade-cafe", "sports-fitness": "trade-gym", "auto-repair-shops": "trade-auto",
};
function EasiestTrades({ d }: { d: any }) {
  const arr = (d.trades?.list ?? []).slice().sort((a: any, b: any) => (b.cost_to_open_usd ?? -1) - (a.cost_to_open_usd ?? -1));
  // Null-guard (real-data promotion): cost-to-open has no honest source there, so the
  // whole section omits when NO row carries a cost, never an all-dash cost table.
  if (arr.length < 2 || !arr.some((t: any) => t.cost_to_open_usd != null)) return null;
  const max = Math.max(...arr.map((t: any) => t.cost_to_open_usd ?? 0)) || 1;
  return (
    <Box className="citytop">
      <Head icon="startup-cost">Typical businesses, and what they cost to start</Head>
      <div className="-mx-2 grid grid-cols-[18px_minmax(0,130px)_1fr_52px_56px] items-baseline gap-2.5 px-2 pb-1 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
        <span /><span>Trade</span><span /><span className="text-right">Ease /10</span><span className="text-right">To open</span>
      </div>
      <div className="space-y-2.5">{arr.map((t: any) => (
        <div key={t.slug} className="hov -mx-2 grid grid-cols-[18px_minmax(0,130px)_1fr_52px_56px] items-center gap-2.5 rounded-md px-2 py-1">
          {TRADE_ICON[t.slug] ? <AtlasIcon id={TRADE_ICON[t.slug]} size={16} className="spine-ic shrink-0" style={{ color: "var(--c-ink2)" }} /> : <span />}
          <span className="min-w-0 truncate text-[length:var(--t-body)] text-[var(--c-ink2)]">{t.name}</span>
          {t.cost_to_open_usd != null ? <MiniBar pct={(t.cost_to_open_usd / max) * 100} /> : <span />}
          <Fig className="text-right text-[length:var(--t-body)] text-[var(--c-ink2)]">{t.break_in_0_100 != null ? Math.round(t.break_in_0_100 / 10) : "-"}</Fig>
          <Fig className="text-right text-[length:var(--t-body)] text-[var(--c-ink)]">{t.cost_to_open_usd != null ? k(t.cost_to_open_usd) : "-"}</Fig>
        </div>
      ))}</div>
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">A rough cost to open the doors, ease of entry out of 10. What each keeps once open is the take-home table above.</p>
    </Box>
  );
}

/* ================= CH5 , RUNNING IT ================= */
/* NO first-year timeline here (rulebook v2 S10/D4): see the file header note. A
 * first-year ramp is a trade-level concept and this page is trade-agnostic, so the
 * block was deleted rather than replaced with a city-altitude substitute. */

/* CityRisks. Null-guards on r.list (omitted on real-data promotion). The scale is
 * SAFETY out of 10 (high = good, the page-set grammar): safety = (100 - severity) / 10,
 * biggest exposure first, neutral track, words keyed to safety. Terracotta rides ONLY
 * the top exposure's label (never a marker). */
function CityRisks({ d }: { d: any }) {
  const r = d.risks;
  if (!r || !(r.list?.length)) return null;
  // D4 (rulebook v2): this seed's severities are illustrative, not measured
  // (risks._meta.confidence is "placeholder" here). Mark the block so the reader
  // never mistakes 82/74/58/46 for researched figures.
  const sample = r._meta?.confidence === "placeholder" || r._meta?.confidence === "modeled";
  const safetyOf = (sev: number) => Math.max(1, Math.min(10, Math.round((100 - sev) / 10)));
  const wordOf = (s: number) => (s <= 3 ? "Exposed" : s <= 5 ? "Uneasy" : s <= 7 ? "Steadier" : "Calm");
  const sorted = (r.list ?? []).slice().sort((a: any, b: any) => (b.severity_0_100 ?? 0) - (a.severity_0_100 ?? 0));
  const rows = sorted.map((x: any, i: number) => {
    const s = safetyOf(Number(x.severity_0_100 ?? 0));
    const label = (
      <>
        {i === 0 ? <span className="font-medium text-[var(--terra-text)]">{x.label}</span> : x.label}
        {x.gloss ? <InfoTip gloss={x.gloss} /> : null}
      </>
    );
    return [label, s * 10, wordOf(s), x.who];
  }) as unknown as Array<[string, number, string, string?]>;
  return (
    <WideRail>
      <Box className="citytop">
        <Head icon="watch" sample={sample}>What to watch here</Head>
        <EaseScale rows={rows} endLabels={["Riskier", "Safer"]} plain />
      </Box>
      <Box className="citytop">
        <Rail icon="honest-take" kicker="The honest read" />
        {r.read ? <p className="mb-2 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{r.read}</p> : null}
        <InlineDisclosure name="risks" summary="The counterweight for each" className="group mt-2">
          <div className="mt-2 space-y-2.5 border-t border-[var(--c-border)] pt-2.5">{sorted.map((x: any) => (
            <div key={x.label} className="flex gap-2.5">
              <span className="mt-0.5 text-[var(--c-muted)]">&#9656;</span>
              <span className="text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]"><b className="text-[var(--c-ink)]">{x.label}.</b> {x.counterweight}</span>
            </div>
          ))}</div>
        </InlineDisclosure>
      </Box>
    </WideRail>
  );
}

/* CityCharacter. Null-guards on c.texture (omitted on real-data promotion). The spectra
 * render through the kit SpectraTable (the same idiom the country character wears): a
 * NEUTRAL track with a centre tick, both poles equal weight, each row's takeaway beneath. */
function CityCharacter({ d }: { d: any }) {
  const c = d.character;
  if (!c || !(c.texture?.length)) return null;
  const rows: any[] = c.texture ?? [];
  return (
    <Box className="citytop">
      <Rail icon="ease-of-business" kicker="The texture of doing business here" />
      <div className="divide-y divide-[var(--c-border)]">{rows.map((r: any, i: number) => (
        <div key={i} className="py-1">
          <SpectraTable rows={[r]} />
          <div className="pb-1.5 text-[length:var(--t-micro)] leading-tight text-[var(--c-ink2)]">{r.takeaway}</div>
        </div>
      ))}</div>
    </Box>
  );
}

/* Locals. Null-guards on d.locals_intel (omitted on real-data promotion). */
function Locals({ d }: { d: any }) {
  const items = d.locals_intel ?? [];
  if (items.length === 0) return null;
  return (
    <Box className="citytop">
      <Head icon="locals-know">What locals know</Head>
      <div className="space-y-3">{items.map((it: any, i: number) => (
        <div key={i} className="flex gap-2.5"><span className="mt-0.5 text-[var(--c-muted)]">&#9656;</span><span className="text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]"><b className="text-[var(--c-ink)]">{it.title}</b> {it.detail}</span></div>))}
      </div>
    </Box>
  );
}

/* ================= CH6 , THE CLOSE ================= */
/* CityPeers. Null-guards: the whole card omits below two peer rows; each metric row is
 * dropped when NO entity carries it (so the spend_index row disappears on real-data
 * promotion), and per-cell missing values render a dash via CompareTable. */
function CityPeers({ d }: { d: any }) {
  const rows: any[] = d.peers?.list ?? [];
  if (rows.length < 2) return null;
  const entities: CompareEntity[] = rows.map((r) => ({ id: r.name, name: r.name, home: !!r.home }));
  // Only build a metric row when at least one entity carries a real value for it.
  const has = (key: string) => rows.some((r) => r[key] != null);
  const compareRows: CompareRow[] = [];
  if (has("rent_index")) {
    compareRows.push({ key: "rent", label: "Rent index", higherIsBetter: false, values: Object.fromEntries(rows.map((r) => [r.name, r.rent_index ?? null])) });
  }
  if (has("spend_index")) {
    compareRows.push({ key: "spend", label: "Spend index", higherIsBetter: true, values: Object.fromEntries(rows.map((r) => [r.name, r.spend_index ?? null])) });
  }
  if (has("median_income_usd")) {
    const income = Object.fromEntries(rows.map((r) => [r.name, r.median_income_usd != null ? Math.round(r.median_income_usd / 1000) : null]));
    compareRows.push({ key: "income", label: "Median income", unit: "$K", higherIsBetter: true, values: income, display: Object.fromEntries(rows.map((r) => [r.name, r.median_income_usd != null ? `$${Math.round(r.median_income_usd / 1000)}K` : null])) });
  }
  if (has("visitors_m")) {
    compareRows.push({ key: "vis", label: "Visitors", unit: "M/yr", higherIsBetter: true, values: Object.fromEntries(rows.map((r) => [r.name, r.visitors_m ?? null])), display: Object.fromEntries(rows.map((r) => [r.name, r.visitors_m != null ? `${r.visitors_m}` : null])) });
  }
  if (compareRows.length === 0) return null;
  return (
    <Box className="citytop">
      <Rail icon="compare" kicker="How it compares, city by city" />
      <CompareTable entities={entities} rows={compareRows} caption="Best in each metric is bold. Compared like for like. The home city is tinted, never ranked." />
    </Box>
  );
}

/* Close. Null-guards: the whole card omits when there is no real pick (winner trade) or
 * no district set to place it in. The take-home + keep-index facts each omit when their
 * source figure is absent. The Pro teaser list omits when no teaser is held. */
function Close({ d }: { d: any }) {
  const v = d.verdict;
  const list: any[] = d.where_to_trade?.list ?? [];
  const pick = (d.trades?.list ?? []).find((t: any) => t.slug === v?.winner_slug) ?? {};
  const bestDistrict = list.length > 0
    ? list.map((x) => ({ ...x, keep: Math.round(((1 + x.rev_vs_city_pct / 100) / x.rent_mult) * 100) })).sort((a, b) => b.keep - a.keep)[0]
    : null;
  // Nothing to hand off: no real winner AND no district set.
  if (!v?.winner_trade && !bestDistrict) return null;
  const teaser: string[] = d.where_to_trade?.pro_teaser ?? [];
  const pickTake = pick.take_home_usd;
  return (
    <Box className="citytop">
      <Head icon="bookmark">The pick, and where to take it</Head>
      <div className="grid gap-4 md:grid-cols-[1.3fr_1fr] md:items-stretch">
        {/* the decision the whole page built toward */}
        <div className="rounded-[12px] border border-[var(--terra-border)] p-4" style={{ background: "linear-gradient(180deg,#ffffff,#fffaf8)" }}>
          <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--terra-text)]">The {d.meta?.city} pick</div>
          <div className="mt-1 text-[length:var(--t-sub)] font-semibold text-[var(--c-ink)]">{v?.winner_trade?.replace(" keeps the most", "")}{bestDistrict ? <>, in {bestDistrict.name}</> : null}</div>
          <p className="mt-1.5 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">The margin leader{bestDistrict ? " in the district that keeps the most of every sale" : ""}. Start there, then check the trade's live economics.</p>
          {(pickTake != null || bestDistrict) ? (
            <div className="mt-3 flex flex-wrap gap-4 border-t border-[var(--c-border)] pt-3">
              {pickTake != null ? <div><Fig className="text-[length:var(--t-sub)] text-[var(--terra-text)]">{k(pickTake)}</Fig><div className="text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">owner take-home a year</div></div> : null}
              {bestDistrict ? <div><Fig className="text-[length:var(--t-sub)] text-[var(--c-ink)]">{bestDistrict.keep}</Fig><div className="text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">keep index</div></div> : null}
            </div>
          ) : null}
          <a href={pick.href ?? "/dev/spine-cell"} className="mt-3 inline-flex items-center gap-1.5 text-[length:var(--t-body)] font-semibold text-[var(--terra-text)] hover:underline"><AtlasMark id="alt-business" size={14} className="shrink-0" />See the trade's live economics &#8594;</a>
        </div>
        {/* the Pro / compare hand-off */}
        <div className="flex flex-col justify-between gap-3">
          <div>
            <div className="text-[length:var(--t-body)] text-[var(--c-ink)]">Set {d.meta?.city} beside up to three cities, side by side.</div>
            <a href="/dev/compare" className="mt-2 inline-flex cursor-pointer rounded-full bg-[var(--c-ink)] px-4 py-2 text-[length:var(--t-body)] font-semibold text-white transition hover:bg-[var(--terra-text)]">Open Compare</a>
          </div>
          {teaser.length > 0 ? (
            <LockVeil headline={`The full ${d.meta?.city} workbook`} note="Every district by every trade, the real cost stack, and the owner-runway calculator." cta="Unlock with Pro">
              <div className="flex min-h-[220px] flex-col justify-evenly py-2">
                {teaser.map((t: string) => (
                  <div key={t} className="text-[length:var(--t-body)] text-[var(--c-ink2)]">{t}</div>
                ))}
              </div>
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
 * field renders nothing and an empty chapter (its Movement wrapper included) is skipped,
 * while the full seed stays byte-identical to the pre-split page.
 */
export function SpineCityBody({ data = spineCitySeed }: { data?: any } = {}) {
  const d = data ?? spineCitySeed;
  const trades = d.trades?.list ?? [];
  const cn = makeChapterCounter();

  // Per-chapter content presence (drives whether the Movement wrapper renders).
  const hasVerdictCh = !!(d.verdict && d.verdict.keep_pct != null) || !!(d.lenses?.scales?.length);
  const hasWhereCh = !!(d.where_to_trade?.list?.length);
  // IncomeCurve lives in the Customers chapter now (earnings data belongs under "who
  // buys"), so a real median income no longer counts toward the Costs chapter alone;
  // RentAffordability's own two-figure requirement does instead.
  const hasCostCh = !!(d.space?.read) || !!(d.owner_runway?.read) || !!(d.owner_runway?.rent_1bed_usd_mo != null && d.income?.median_income_usd != null);
  const hasCustomersCh = !!(d.demand && (d.demand.resident_pct != null || d.demand.consumer_spend_usd_bn != null)) || !!(d.income?.median_income_usd != null);
  const tradeRows = (d.trades?.list ?? []).filter((t: any) => t.take_home_usd != null);
  const hasTradesCh = tradeRows.length >= 3 || tradeRows.some((t: any) => t.net_margin_pct != null);
  const hasRunningCh = !!(d.risks?.list?.length) || !!(d.character?.texture?.length) || !!(d.locals_intel?.length);
  const hasCloseCh = (d.peers?.list?.length ?? 0) >= 2 || !!(d.verdict?.winner_trade) || !!(d.where_to_trade?.list?.length);

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
      <CityStyles />
      <CityHero d={d} />

      {/* The verdict masthead , always shown when the city has a real keep figure. */}
      {d.verdict?.keep_pct != null || d.lenses?.scales?.length ? <CityVerdict d={d} /> : null}

      {/* Where to trade LEADS the numbered chapters , the map + keep dot plot is the
          page's signature answer, so it opens as Movement 01. */}
      {hasWhereCh ? (
        <>
          <Movement index={cn()} eyebrow="Where to trade" heading="Districts by keep index" icon="best-areas" />
          <WhereToTrade d={d} trades={trades} />
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

      {/* What it costs , commercial space + the founder runway + rent-against-income
          (IncomeCurve moved to the Customers chapter; earnings data belongs under
          "who buys", not "what it costs"). */}
      {hasCostCh ? (
        <>
          <Movement index={cn()} eyebrow="What it costs here" heading="What space and living cost" icon="commercial-rent" />
          <div className="space-y-4">
            <CommercialSpace d={d} />
            <Even><OwnerRunway d={d} /><RentAffordability d={d} /></Even>
          </div>
        </>
      ) : null}

      {/* Your customers , demand size (with the resident/visitor split folded in). */}
      {hasCustomersCh ? (
        <>
          <Movement index={cn()} eyebrow="Your customers" heading="Who buys, and when" icon="spending-power" />
          <div className="space-y-4">
            <DemandSize d={d} />
            <IncomeCurve d={d} />
          </div>
        </>
      ) : null}

      {/* Trades and rivals , the money chapter. */}
      {hasTradesCh ? (
        <>
          <Movement index={cn()} eyebrow="Trades and rivals" heading="What to open, and what you keep" icon="owner-keeps" />
          <div className="space-y-4">
            <Full><TopTrades d={d} /></Full>
            <WideRail><MarginKept d={d} /><MarginRail d={d} /></WideRail>
            <EasiestTrades d={d} />
          </div>
        </>
      ) : null}

      {/* Running it , risks, character and locals. No first-year timeline: a first-year
          ramp is a trade-level concept and this page is trade-agnostic (rulebook v2
          S10/D4); see the file header note. */}
      {hasRunningCh ? (
        <>
          <Movement index={cn()} eyebrow="Running it" heading="What to watch" icon="watch" />
          <div className="space-y-4">
            <CityRisks d={d} />
            <Even><CityCharacter d={d} /><Locals d={d} /></Even>
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
