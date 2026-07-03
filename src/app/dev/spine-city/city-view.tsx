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
 * OwnerRunway, DemandSize magnitude + Spark, DemandCalendar, FirstYear, CityRisks,
 * CityCharacter, income tiers, locals_intel, the district map) omits for lack of a source.
 *
 * As-built chart dictionary: unchanged from the pre-split page (see git history); the
 * split adds only the named export + the null-guards, no new visual idiom.
 */
import * as React from "react";
import { spineCitySeed } from "@/lib/spine-seeds";
import { Fig, Ico, Stat, Spark, Movement, Box, Head, Rail, EaseScale, Full, WideRail, Even, TERRA, TRACK } from "@/components/spine/kit";
import { CompareTable, type CompareEntity, type CompareRow, LockVeil, CellScaleBar } from "@/components/spine/kit-index";
import { AtlasIcon } from "@/components/brand/icons";
import { CityHero } from "./masthead";
import { CityStyles } from "./motion";
import { IncomeCurve, OwnerRunway, MarginKept } from "./chapters";
import { WhereToTrade } from "./where-to-trade";
import { FirstYearTimeline } from "./first-year";

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const k = (v: number) => "$" + Math.round((v || 0) / 1000) + "K";

/* ================= CH1 , THE VERDICT ================= */
/* CityVerdict masthead. Null-guards on d.verdict (omitted when no real margin leader). */
function CityVerdict({ d }: { d: any }) {
  const v = d.verdict;
  if (!v || v.keep_pct == null) return null;
  const strip = stripReads(d);
  return (
    <div className="overflow-hidden rounded-[14px] border border-[var(--terra-border)] bg-[var(--c-card)]">
      <div className="p-5 md:p-6">
        <div className="mb-1.5 flex items-center gap-2"><Ico id="verdict" tone="terra" /><span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--terra-text)]">{v.kicker}</span></div>
        <div className="grid gap-5 md:grid-cols-[1.5fr_1fr] md:items-end">
          <div>
            {/* noun-phrase heading (one mood page-set-wide); the sentence-form thesis
                lives in verdict.why below, where prose belongs. */}
            <h2 data-typography="custom" className="text-2xl font-bold leading-tight tracking-tight text-[var(--c-ink)] md:text-[2rem]">The margin, district by district</h2>
            {v.why ? <p className="mt-2 max-w-prose text-[13.5px] leading-snug text-[var(--c-ink2)]">{v.why}</p> : null}
            {v.catch ? (
              <p className="mt-2.5 flex items-start gap-1.5 rounded-lg border border-[var(--c-border)] bg-[var(--c-soft)] px-3 py-2 text-[12.5px] leading-snug text-[var(--c-ink2)]">
                <span className="mt-0.5 shrink-0 text-[var(--terra-text)]"><AtlasIcon id="honest-take" size={14} /></span>
                <span><span className="font-semibold text-[var(--c-ink)]">The catch. </span>{v.catch}</span>
              </p>
            ) : null}
          </div>
          <div>
            <Stat size="focal" accent value={`${v.keep_pct}%`} label="best trade keeps" sub="of sales, the local baseline" />
          </div>
        </div>
      </div>
      {/* grey strip: ONE keep spectrum in three consistent name + index pairs
          (best keeper / city baseline / weakest keeper). Omitted when no district set. */}
      {strip.length > 0 ? (
        <div className="grid grid-cols-3 gap-px border-t border-[var(--terra-border)]" style={{ background: "var(--terra)" }}>
          {strip.map((s) => (
            <div key={s.label} className="bg-[var(--c-card)] px-3 py-2.5">
              <div className="flex items-baseline gap-1.5"><span className="min-w-0 truncate text-[12px] font-medium text-[var(--c-ink)]">{s.name}</span><Fig className="shrink-0 text-[15px] text-[var(--c-ink)]">{s.index}</Fig></div>
              <div className="text-[9px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{s.label}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* the hero's grey strip: the district keep spectrum. Empty when no district list. */
function stripReads(d: any): Array<{ name: string; index: number; label: string }> {
  const list: any[] = d.where_to_trade?.list ?? [];
  if (list.length === 0) return [];
  const withKeep = list.map((x) => ({ ...x, keep: Math.round(((1 + x.rev_vs_city_pct / 100) / x.rent_mult) * 100) })).sort((a, b) => b.keep - a.keep);
  const best = withKeep[0];
  const worst = withKeep[withKeep.length - 1];
  return [
    { name: best?.name ?? "", index: best?.keep ?? 0, label: "keeps the most" },
    { name: "City average", index: 100, label: "the baseline" },
    { name: worst?.name ?? "", index: worst?.keep ?? 0, label: "keeps the least" },
  ];
}

/* CityLenses. Null-guards on d.lenses.scales (omitted on real-data promotion). */
function CityLenses({ d }: { d: any }) {
  const o = d.lenses;
  if (!o || !(o.scales?.length)) return null;
  const rows: Array<[string, number, string, string?]> = (o.scales ?? []).map((s: any) => [s.label, s.pos, s.word, s.sub]);
  return (
    <Box className="citytop">
      <div className="grid gap-5 md:grid-cols-[1fr_1.7fr] md:items-start">
        <div>
          <Rail icon="gut-check" kicker="The city, in five reads" verdict={o.headline} />
          <p className="text-[12.5px] leading-snug text-[var(--c-ink2)]">{o.read}</p>
        </div>
        <EaseScale rows={rows} endLabels={["Against you", "In your favor"]} />
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
        <Rail icon="commercial-rent" kicker="What commercial space costs" verdict={s.read} />
        {s.rent_pressure_0_100 != null ? (
          <div className="mb-1.5 flex items-baseline gap-2"><span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Rent pressure</span><Fig className="text-[20px] text-[var(--c-ink)]">{s.rent_pressure_0_100}<span className="text-[12px] text-[var(--c-muted)]">/100</span></Fig></div>
        ) : null}
        {/* peers on ONE axis. Only rendered when at least two peers carry a real rent index. */}
        {hasPeerStrip ? (
          <div className="mt-2 border-t border-[var(--c-border)] pt-3">
            <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Rent index vs peer cities</div>
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
                      <span className={`text-[9.5px] ${home ? "font-semibold text-[var(--terra-text)]" : "text-[var(--c-muted)]"}`}>{p.name}</span>
                      <Fig className={`text-[11px] ${home ? "text-[var(--terra-text)]" : "text-[var(--c-ink2)]"}`}>{p.rent_index}</Fig>
                    </span>
                  </span>
                );
              })}
            </div>
            {s.peer_read ? <div className="mt-1 text-[11px] text-[var(--c-muted)]">{s.peer_read}</div> : null}
          </div>
        ) : null}
      </Box>
      {hasTerms ? (
        <Box className="citytop">
          <Rail kicker="The lease terms" verdict="Landlords want a long commitment and money down; a short rent-free window softens the fit-out." />
          <div className="divide-y divide-[var(--c-border)]">{terms.map(([v, l]) => (
            <div key={l} className="flex items-baseline justify-between gap-3 py-2"><span className="text-[12px] text-[var(--c-ink2)]">{l}</span><Fig className="text-[15px] text-[var(--c-ink)]">{v}</Fig></div>
          ))}</div>
          {s.terms_note ? <div className="mt-2 text-[11px] text-[var(--c-muted)]">{s.terms_note}</div> : null}
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
  const hasMagnitude = o && o.consumer_spend_usd_bn != null;
  if (!o || (!hasSplit && !hasMagnitude)) return null;
  // magnitude-mapped greys (largest segment darkest) + ink labels (AA on both greys)
  const segs: Array<[string, number, string]> = [["Residents", o.resident_pct, "#aeaeac"], ["Visitors", o.visitor_pct, "#dcdcda"]];
  const years: number[] = o.trend_years ?? [];
  const hasTrend = (o.trend_index?.length ?? 0) >= 2;
  const hasCalendar = (d.demand_calendar?.months?.length ?? 0) > 0;
  const sizeBox = (
    <Box className="citytop">
      <Rail icon="market-size" kicker={hasMagnitude ? "How big the spending pool is" : "Where the trade comes from"} verdict={o.read} />
      {hasMagnitude ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <Fig className="text-3xl text-[var(--terra-text)]">${o.consumer_spend_usd_bn}B</Fig>
            <span className="text-[13px] text-[var(--c-ink2)]">a year, about <Fig className="text-[var(--c-ink)]">${Math.round((o.spend_per_capita_usd || 0) / 1000)}K</Fig> per resident, up <Fig className="text-[var(--c-ink)]">{o.growth_pct_yoy}%</Fig> on the year.</span>
          </div>
          {/* the multi-year trajectory: labelled endpoints so the span is never a guess */}
          {hasTrend ? (
            <div className="flex items-center gap-2">
              <div>
                <Spark values={o.trend_index} />
                {years.length === 2 ? <div aria-hidden className="flex justify-between text-[8.5px] leading-none text-[var(--c-muted)]"><Fig>{years[0]}</Fig><Fig>{years[1]}</Fig></div> : null}
              </div>
              <span className="text-[10.5px] leading-tight text-[var(--c-muted)]">spend<br />trend</span>
            </div>
          ) : null}
        </div>
      ) : null}
      {/* resident/visitor split, folded in as an inline share bar */}
      {hasSplit ? (
        <div className={hasMagnitude ? "mt-4 border-t border-[var(--c-border)] pt-3" : ""}>
          <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Who spends it</div>
          <div className="flex h-6 overflow-hidden rounded-lg border border-[var(--c-border)]" role="img" aria-label={`Residents ${o.resident_pct}%, visitors ${o.visitor_pct}%`}>{segs.map(([n, pct, bg]) => <div key={n} className="flex h-full items-center justify-center" style={{ width: `${pct}%`, background: bg }}><span className="fig text-[11px] font-semibold text-[var(--c-ink)]">{n} {pct}%</span></div>)}</div>
          <div className="mt-1.5 text-[11px] text-[var(--c-muted)]">Resident money is the steady base; visitor money is seasonal and patchy by area.</div>
        </div>
      ) : null}
    </Box>
  );
  const calBox = hasCalendar ? (
    <Box className="citytop">
      <Rail icon="seasonality" kicker="Busy months and quiet months" verdict={d.demand_calendar?.read} />
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
            <span className={`text-[9px] ${i === peak ? "font-semibold text-[var(--terra-text)]" : "text-[var(--c-muted)]"}`}>{MONTHS[i]}</span>
          </div>
        ))}
      </div>
      <div className="mt-1.5 text-[11px] text-[var(--c-muted)]">Indexed demand by month, drawn from zero.</div>
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
  // the page's pick: the LOCAL margin leader (the accent's one carrier here)
  const keepLead = arr.filter((t: any) => t.local !== false && t.net_margin_pct != null).slice().sort((a: any, b: any) => (b.net_margin_pct ?? 0) - (a.net_margin_pct ?? 0))[0] ?? {};
  const cols = hasCrowding ? "grid-cols-[minmax(0,140px)_1fr_84px_52px] sm:grid-cols-[150px_1fr_84px_52px_64px]" : "grid-cols-[minmax(0,140px)_1fr_84px_52px] sm:grid-cols-[150px_1fr_84px_52px]";
  return (
    <Box className="citytop">
      <Rail icon="owner-keeps" kicker="Owner take-home by trade" verdict={d.trades?.read} />
      {/* column headers so every cell is self-labelling */}
      <div className={`-mx-2 grid ${cols} items-center gap-3 px-2 pb-1 text-[9.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]`}>
        <span>Trade</span><span /><span className="text-right">Take-home ($/yr)</span><span className="text-right">Keeps</span>{hasCrowding ? <span className="hidden text-right sm:block">Crowding</span> : null}
      </div>
      <div className="space-y-2.5">{arr.map((t: any) => {
        const isPick = t.slug === keepLead.slug;
        return (
          <a key={t.slug} href="/dev/spine-cell" className={`hov -mx-2 grid ${cols} items-center gap-3 rounded-md px-2 py-1.5`}>
            <span className={`min-w-0 truncate text-[12.5px] ${isPick ? "font-semibold" : ""} text-[var(--c-ink)]`}>{t.name}{t.local === false ? <span className="ml-1.5 text-[9px] uppercase tracking-wide text-[var(--c-muted)]">online</span> : null}</span>
            <div className="h-2.5 min-w-0 overflow-hidden rounded-full" style={{ background: TRACK }}><div className="h-full rounded-full" style={{ width: `${(t.take_home_usd / max) * 100}%`, background: "#c8c8c6" }} /></div>
            <Fig className="text-right text-[14px] text-[var(--c-ink)]">{k(t.take_home_usd)}</Fig>
            <span className="flex items-center justify-end gap-1.5">
              {isPick ? <span aria-hidden className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: TERRA }} /> : null}
              {t.net_margin_pct != null ? <Fig className={`text-right text-[13px] ${isPick ? "font-bold text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{t.net_margin_pct}%</Fig> : <span className="text-right text-[13px] text-[var(--c-muted)]">&mdash;</span>}
            </span>
            {hasCrowding ? <span className="hidden text-right text-[11px] text-[var(--c-ink2)] sm:block">{t.saturation_0_100 != null ? word(t.saturation_0_100) : ""}</span> : null}
          </a>
        );
      })}</div>
      <div className="mt-2 text-[11px] text-[var(--c-muted)]">Ranked by owner take-home a year; the kept share of sales is the read that matters. Tap a trade for the full city economics.</div>
    </Box>
  );
}

/* MarginRail , the per-trade net-margin list beside MarginKept. Null-guards below one
 * trade with a real margin. */
function MarginRail({ d }: { d: any }) {
  const arr = (d.trades?.list ?? []).filter((t: any) => t.net_margin_pct != null).slice();
  if (arr.length === 0) return null;
  const local = arr.filter((x: any) => x.local !== false);
  const lead = local.slice().sort((a: any, b: any) => (b.net_margin_pct ?? 0) - (a.net_margin_pct ?? 0))[0] ?? {};
  const byMargin = arr.slice().sort((a: any, b: any) => (b.net_margin_pct ?? 0) - (a.net_margin_pct ?? 0));
  return (
    <Box className="citytop md:flex-[2]">
      <Rail kicker="Net margin by trade" verdict="A service trade with no stock keeps the most; the food trades keep the least." />
      <div className="divide-y divide-[var(--c-border)]">{byMargin.map((t: any) => {
        const isLead = t.slug === lead.slug;
        const pct = Math.max(0, Number(t.net_margin_pct ?? 0));
        return (
          <div key={t.slug} className="hov -mx-2 grid grid-cols-[minmax(0,110px)_1fr_38px] items-center gap-3 rounded-md px-2 py-1.5">
            <span className={`min-w-0 truncate text-[12px] ${isLead ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink2)]"}`}>{t.name}{t.local === false ? <span className="ml-1 text-[8.5px] uppercase tracking-wide text-[var(--c-muted)]">online</span> : null}</span>
            <span className="-mt-1 block" role="img" aria-label={`${t.name}: ${pct} percent of sales kept`}><CellScaleBar value={pct} domain={[0, 100]} /></span>
            <Fig className={`text-right text-[13px] ${isLead ? "font-bold text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{pct}%</Fig>
          </div>
        );
      })}</div>
      {/* the drawn shared axis , same 0..100 "of sales" scale as the split beside it */}
      <div aria-hidden className="-mx-2 mt-1 grid grid-cols-[minmax(0,110px)_1fr_38px] items-center gap-3 px-2">
        <span /><div className="flex justify-between text-[9px] uppercase tracking-wide text-[var(--c-muted)]"><span>0%</span><span>100% of sales</span></div><span />
      </div>
    </Box>
  );
}

/* EasiestTrades. Null-guards: the whole section omits when no trade carries a real
 * cost_to_open figure (that is the column it plots), so on real-data promotion (cost
 * omitted) it renders nothing rather than a "$0 to open" card. */
function EasiestTrades({ d }: { d: any }) {
  const arr = (d.trades?.list ?? []).slice().filter((x: any) => x.local !== false && x.cost_to_open_usd != null && x.break_in_0_100 != null).sort((a: any, b: any) => b.break_in_0_100 - a.break_in_0_100);
  if (arr.length < 2) return null;
  const lead = arr[0]; const rest = arr.slice(1, 6);
  return (
    <WideRail>
      <Box className="citytop">
        <Rail icon="startup-cost" tone="terra" kicker="Lowest bar to entry" verdict={d.trades?.easiest_read} />
        <div className="flex flex-wrap items-baseline gap-x-3">
          <span className="text-[15px] font-semibold text-[var(--c-ink)]">{lead?.name}</span>
          <Fig className="text-[26px] text-[var(--terra-text)]">{k(lead?.cost_to_open_usd ?? 0)}</Fig>
          <span className="text-[12px] text-[var(--c-ink2)]">to open, at <Fig className="text-[var(--c-ink)]">{lead?.break_in_0_100}</Fig><span className="text-[10px] text-[var(--c-muted)]">/100</span> ease, the gentlest way in.</span>
        </div>
      </Box>
      <Box className="citytop">
        <Head>Next-easiest, and the cost to open</Head>
        {/* figures only (no bars, census law); headers make every column self-labelling */}
        <div className="-mx-2 grid grid-cols-[1fr_64px_64px] items-baseline gap-4 px-2 pb-1 text-[9.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
          <span>Trade</span><span className="text-right">Ease /100</span><span className="text-right">To open</span>
        </div>
        <div className="divide-y divide-[var(--c-border)]">{rest.map((t: any) => (
          <div key={t.slug} className="hov -mx-2 grid grid-cols-[1fr_64px_64px] items-baseline gap-4 rounded-md px-2 py-2">
            <span className="min-w-0 truncate text-[12.5px] text-[var(--c-ink)]">{t.name}</span>
            <Fig className="text-right text-[12px] text-[var(--c-ink2)]">{t.break_in_0_100}</Fig>
            <Fig className="text-right text-[13px] text-[var(--c-ink)]">{k(t.cost_to_open_usd)}</Fig>
          </div>
        ))}</div>
        <div className="mt-2 text-[11px] text-[var(--c-muted)]">Ease of entry out of 100, and the typical cost to open.</div>
      </Box>
    </WideRail>
  );
}

/* ================= CH5 , RUNNING IT ================= */
/* FirstYear. Already null-guards on f.nodes (omitted on real-data promotion). */
function FirstYear({ d }: { d: any }) {
  const f = d.first_year ?? {};
  if (!f.nodes?.length) return null;
  const nodes = f.nodes.map((n: any) => ({ at: n.at, label: n.label, sub: n.sub, kind: n.kind === "breakeven" ? "breakeven" : "normal" }));
  const phases = (f.phases ?? []).map((p: any) => [p[0], p[1], p[2]] as [string, number, number]);
  return (
    <>
      <Rail icon="first-year" kicker="Your first year" verdict={f.read} />
      <FirstYearTimeline span={f.span} unit={f.unit} phases={phases} nodes={nodes} startLabel={f.start_label} />
    </>
  );
}

/* CityRisks. Null-guards on r.list (omitted on real-data promotion). */
function CityRisks({ d }: { d: any }) {
  const r = d.risks;
  if (!r || !(r.list?.length)) return null;
  const rows: Array<[string, number, string, string?]> = (r.list ?? []).map((x: any) => [x.label, Number(x.severity_0_100 ?? 0), x.word, x.who]);
  const top = (r.list ?? []).slice().sort((a: any, b: any) => (b.severity_0_100 ?? 0) - (a.severity_0_100 ?? 0))[0] ?? {};
  return (
    <WideRail>
      <Box className="citytop">
        <Head icon="watch">What to watch here</Head>
        <EaseScale rows={rows} endLabels={["Calm", "Severe"]} />
      </Box>
      <Box className="citytop">
        <Rail icon="honest-take" tone="terra" kicker="The honest read" verdict={<><span className="text-[var(--terra-text)]">{top.label}</span> is the one to plan around; the rest are manageable with the right lease and reliefs.</>} />
        {r.read ? <p className="mb-2 text-[12px] leading-snug text-[var(--c-ink2)]">{r.read}</p> : null}
        <details name="risks" open className="group">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[12px] font-medium text-[var(--terra-text)]"><span className="text-base text-[var(--c-muted)] transition group-open:rotate-45 group-open:text-[var(--terra-text)]">+</span> The counterweight for each</summary>
          <div className="mt-2 space-y-2.5 border-t border-[var(--c-border)] pt-2.5">{(r.list ?? []).map((x: any) => (
            <div key={x.label} className="flex gap-2.5">
              <span className="mt-0.5 text-[var(--c-muted)]">&#9656;</span>
              <span className="text-[12px] leading-snug text-[var(--c-ink2)]"><b className="text-[var(--c-ink)]">{x.label}.</b> {x.counterweight}</span>
            </div>
          ))}</div>
        </details>
      </Box>
    </WideRail>
  );
}

/* CityCharacter. Null-guards on c.texture (omitted on real-data promotion). */
function CityCharacter({ d }: { d: any }) {
  const c = d.character;
  if (!c || !(c.texture?.length)) return null;
  const rows: any[] = c.texture ?? [];
  return (
    <Box className="citytop">
      <Rail icon="honest-take" kicker="The texture of doing business here" verdict={c.read} />
      <div className="divide-y divide-[var(--c-border)]">{rows.map((r: any, i: number) => {
        const rightWins = (r.position_0_1 || 0) >= 0.5;
        const pole = (label: string, wins: boolean) => (
          <span className={wins ? "font-bold text-[var(--c-ink)]" : "text-[var(--c-muted)]"}>{label}</span>
        );
        return (
          <div key={i} className="py-2.5">
            <div className="text-[10.5px] font-semibold uppercase tracking-wide">
              {pole(r.left_label, !rightWins)}<span className="mx-1 text-[var(--c-muted)]">/</span>{pole(r.right_label, rightWins)}
            </div>
            <div className="mt-0.5 text-[11.5px] leading-tight text-[var(--c-ink2)]">{r.takeaway}</div>
          </div>
        );
      })}</div>
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
        <div key={i} className="flex gap-2.5"><span className="mt-0.5 text-[var(--c-muted)]">&#9656;</span><span className="text-[12.5px] leading-snug text-[var(--c-ink2)]"><b className="text-[var(--c-ink)]">{it.title}</b> {it.detail}</span></div>))}
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
      <Rail icon="compare" kicker="How it compares, city by city" verdict={d.peers?.read} />
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
          <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--terra-text)]">The {d.meta?.city} pick</div>
          <div className="mt-1 text-[16px] font-semibold text-[var(--c-ink)]">{v?.winner_trade?.replace(" keeps the most", "")}{bestDistrict ? <>, in {bestDistrict.name}</> : null}</div>
          <p className="mt-1.5 text-[12.5px] leading-snug text-[var(--c-ink2)]">The margin leader{bestDistrict ? " in the district that keeps the most of every pound" : ""}. Start there, then check the trade's live economics.</p>
          {(pickTake != null || bestDistrict) ? (
            <div className="mt-3 flex flex-wrap gap-4 border-t border-[var(--c-border)] pt-3">
              {pickTake != null ? <div><Fig className="text-[18px] text-[var(--terra-text)]">{k(pickTake)}</Fig><div className="text-[10px] uppercase tracking-wide text-[var(--c-muted)]">owner take-home a year</div></div> : null}
              {bestDistrict ? <div><Fig className="text-[18px] text-[var(--c-ink)]">{bestDistrict.keep}</Fig><div className="text-[10px] uppercase tracking-wide text-[var(--c-muted)]">keep index</div></div> : null}
            </div>
          ) : null}
          <a href="/dev/spine-cell" className="mt-3 inline-flex text-[13px] font-semibold text-[var(--terra-text)] hover:underline">See the trade's live economics &#8594;</a>
        </div>
        {/* the Pro / compare hand-off */}
        <div className="flex flex-col justify-between gap-3">
          <div>
            <div className="text-[13.5px] text-[var(--c-ink)]">Set {d.meta?.city} beside up to three cities, side by side.</div>
            <a href="/dev/compare" className="mt-2 inline-flex cursor-pointer rounded-full bg-[var(--c-ink)] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[var(--terra-text)]">Open Compare</a>
          </div>
          {teaser.length > 0 ? (
            <LockVeil headline={`The full ${d.meta?.city} workbook`} note="Every district by every trade, the real cost stack, and the owner-runway calculator." cta="Unlock with Pro">
              <div className="flex min-h-[220px] flex-col justify-evenly py-2">
                {teaser.map((t: string) => (
                  <div key={t} className="text-[12px] text-[var(--c-ink2)]">{t}</div>
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
  const hasCostCh = !!(d.space?.read) || !!(d.owner_runway?.read) || !!(d.income?.median_income_usd != null);
  const hasCustomersCh = !!(d.demand && (d.demand.resident_pct != null || d.demand.consumer_spend_usd_bn != null));
  const tradeRows = (d.trades?.list ?? []).filter((t: any) => t.take_home_usd != null);
  const hasTradesCh = tradeRows.length >= 3 || tradeRows.some((t: any) => t.net_margin_pct != null);
  const hasRunningCh = !!(d.first_year?.nodes?.length) || !!(d.risks?.list?.length) || !!(d.character?.texture?.length) || !!(d.locals_intel?.length);
  const hasCloseCh = (d.peers?.list?.length ?? 0) >= 2 || !!(d.verdict?.winner_trade) || !!(d.where_to_trade?.list?.length);

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
      <CityStyles />
      <CityHero d={d} />

      {/* The verdict masthead , always shown when the city has a real keep figure. */}
      {d.verdict?.keep_pct != null || d.lenses?.scales?.length ? <CityVerdict d={d} /> : null}
      {/* The five-read lenses are their OWN numbered chapter, rendered ONLY when the
          lens scales exist (omitted on real-data promotion , no per-axis source), so the
          "The read on ..." heading is never an orphan above an empty section. */}
      {d.lenses?.scales?.length ? (
        <>
          <Movement index={cn()} eyebrow="The verdict" heading={`The read on ${d.meta?.city ?? "the city"}`} icon="gut-check" />
          <CityLenses d={d} />
        </>
      ) : null}

      {/* Where to trade , the signature map + keep-ranked list, one section. */}
      {hasWhereCh ? (
        <>
          <Movement index={cn()} eyebrow="Where to trade" heading="Where you keep the most" icon="best-areas" />
          <WhereToTrade d={d} trades={trades} />
        </>
      ) : null}

      {/* What it costs , commercial space + the founder runway + the income curve. */}
      {hasCostCh ? (
        <>
          <Movement index={cn()} eyebrow="What it costs here" heading="What space and life cost" icon="commercial-rent" />
          <div className="space-y-4">
            <CommercialSpace d={d} />
            <Even><OwnerRunway d={d} /><IncomeCurve d={d} /></Even>
          </div>
        </>
      ) : null}

      {/* Your customers , demand size (with the resident/visitor split folded in). */}
      {hasCustomersCh ? (
        <>
          <Movement index={cn()} eyebrow="Your customers" heading="Who buys, and when" icon="spending-power" />
          <DemandSize d={d} />
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

      {/* Running it , the first-year timeline, risks, character and locals. */}
      {hasRunningCh ? (
        <>
          <Movement index={cn()} eyebrow="Running it" heading="The first year, and what to watch" icon="first-year" />
          <div className="space-y-4">
            <Full><FirstYear d={d} /></Full>
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
