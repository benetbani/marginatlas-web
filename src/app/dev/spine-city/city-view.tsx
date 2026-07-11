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
import { Fig, Stat, Movement, Box, Head, Rail, EaseScale, WideRail, Even, TERRA, InfoTip, InlineDisclosure, SpectraTable, SampleTag } from "@/components/spine/kit";
import { CompareTable, type CompareEntity, type CompareRow, LockVeil } from "@/components/spine/kit-index";
import { AtlasIcon } from "@/components/brand/icons";
import { AtlasMark } from "@/components/spine/marks";
import { isReviewBuild } from "@/lib/feature_flags";
import { CityHero } from "./masthead";
import { IncomeCurve, OwnerRunway, MarginKept, RentAffordability } from "./chapters";
import { WhereToTrade } from "./where-to-trade";

const k = (v: number) => "$" + Math.round((v || 0) / 1000) + "K";

/* ================= CH1 , THE VERDICT ================= */
/* CityVerdict masthead , the July-3 composition restored (rulebook v1 §46): plain
 * title, the boxed icon-led "The catch" callout, ONE focal figure, and a 3-fact
 * support strip (grid-cols-3). The old "district keep spread" focal and the derived
 * keep index behind it are DELETED (rulebook v1 §5 + §13: unknowable metric, coined
 * jargon); the held figure is the district RENT LOAD, the founder's D1 rank metric,
 * so the verdict reads on rent. Null-guards on the district set. */
function CityVerdict({ d }: { d: any }) {
  const list: any[] = d.where_to_trade?.list ?? [];
  if (list.length === 0) return null;
  const byRent = list.slice().sort((a: any, b: any) => a.rent_mult - b.rent_mult);
  const lightest = byRent[0];
  const heaviest = byRent[byRent.length - 1];
  const facts: Array<[string, string, string]> = [
    [lightest.name, `x${lightest.rent_mult}`, "rent runs lightest"],
    ["City average", "x1", "the baseline"],
    [heaviest.name, `x${heaviest.rent_mult}`, "rent runs heaviest"],
  ];
  return (
    <div className="overflow-hidden rounded-[14px] border border-[var(--terra-border)] bg-[var(--c-card)]">
      <div className="p-5 md:p-6">
        <div className="grid gap-5 md:grid-cols-[1.5fr_1fr] md:items-end">
          <div>
            {/* plain title (rulebook v1 §13); the focal rent figure beside it carries
                the finding, so no thesis paragraph is needed above it. */}
            <h2 data-typography="custom" className="text-[length:var(--t-sub)] font-semibold leading-tight tracking-tight text-[var(--c-ink)] md:text-[2rem]">The rent, district by district</h2>
            {/* the honest caveat in the July-3 boxed, icon-led "The catch" form. */}
            {d.verdict?.catch ? (
              <p className="mt-2.5 flex items-start gap-1.5 rounded-lg border border-[var(--c-border)] bg-[var(--c-soft)] px-3 py-2 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">
                <span className="mt-0.5 shrink-0 text-[var(--terra-text)]"><AtlasIcon id="honest-take" size={14} /></span>
                <span><span className="font-semibold text-[var(--c-ink)]">The catch. </span>{d.verdict.catch}</span>
              </p>
            ) : null}
          </div>
          <div>
            <Stat size="focal" accent value={`x${lightest.rent_mult}`} label="the lightest rent load" sub={`in ${lightest.name}, against the city-average x1`} />
          </div>
        </div>
      </div>
      {/* the 3-fact support strip , the July-3 grid-cols-3 form, on the held rent figures. */}
      <div className="grid grid-cols-3 gap-px border-t border-[var(--terra-border)]" style={{ background: "var(--terra)" }}>
        {facts.map(([name, fig, sub]) => (
          <div key={sub} className="bg-[var(--c-card)] px-3 py-2.5">
            <div className="flex items-baseline gap-1.5"><span className="min-w-0 truncate text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{name}</span><Fig className="shrink-0 text-[length:var(--t-lead)] text-[var(--c-ink)]">{fig}</Fig></div>
            <div className="text-[9px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* CityLenses. Null-guards on d.lenses.scales (omitted on real-data promotion , the
 * live adapter never supplies lenses at all; see adapt_city.ts's omitted-fields list).
 * The five axes are hand-authored reads with no per-axis source, so the block carries
 * a SampleTag (rulebook v1 §4: a modeled figure shown as real is the worst defect),
 * and the shared scale's end labels stay a qualitative lean ("harder"/"easier"), never
 * a precise for-or-against-you verdict the data cannot support. Full-width rows at
 * body size , the half-empty side column is gone (rulebook v1 §17). */
function CityLenses({ d }: { d: any }) {
  const o = d.lenses;
  if (!o || !(o.scales?.length)) return null;
  const rows: Array<[string, number, string, string?]> = (o.scales ?? []).map((s: any) => [s.label, s.pos, s.word, s.sub]);
  const sample = o._meta?.confidence === "placeholder" || o._meta?.confidence === "modeled";
  return (
    <Box>
      <Head sample={sample}>Five quick reads</Head>
      {o.read ? <p className="mb-3 max-w-prose text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{o.read}</p> : null}
      <EaseScale rows={rows} endLabels={["Harder", "Easier"]} />
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
function CommercialSpace({ d }: { d: any }) {
  const s = d.space;
  if (!s || !s.read) return null;
  const peers = (d.peers?.list ?? [])
    .filter((p: any) => p.rent_index != null)
    .map((p: any) => ({ ...p, delta: (p.rent_index || 0) - 100 }))
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
  return (
    <WideRail>
      <Box>
        <Rail icon="commercial-rent" kicker="What commercial space costs" />
        {/* the peer dot strip below (home city = 0) IS the pressure read; no second scale. */}
        {/* peers on ONE axis. Only rendered when at least two peers carry a real rent index. */}
        {hasPeerStrip ? (
          <div className="mt-2 border-t border-[var(--c-border)] pt-3">
            <div className="mb-1 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Rent against {d.meta?.city}, in percentage points</div>
            <div className="relative h-[76px]" role="img" aria-label={`Rent against ${d.meta?.city} in percentage points: ${peers.map((p: any) => `${p.name} ${fmtDelta(p.delta)}`).join(", ")}`}>
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--c-line-strong)]" />
              {peers.map((p: any, i: number) => {
                const x = ((p.delta - lo) / span) * 100;
                const home = p.home;
                const above = i % 2 === 0;
                return (
                  <span key={p.name} className="absolute -translate-x-1/2" style={{ left: `${x}%`, top: "50%" }}>
                    <span className="block h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white" style={{ background: home ? TERRA : "#c8c8c6", boxShadow: "0 0 0 1px #e3e3e3" }} />
                    <span className={`absolute left-1/2 flex -translate-x-1/2 flex-col items-center whitespace-nowrap leading-tight ${above ? "bottom-[14px]" : "top-[9px]"}`}>
                      <span className={`text-[length:var(--t-micro)] ${home ? "font-semibold text-[var(--terra-text)]" : "text-[var(--c-muted)]"}`}>{p.name}</span>
                      <Fig className={`text-[length:var(--t-micro)] ${home ? "text-[var(--terra-text)]" : "text-[var(--c-ink2)]"}`}>{fmtDelta(p.delta)}</Fig>
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
        <Box>
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
/* DemandSize. Null-guards: the whole card omits when no split AND no magnitude. The
 * per-resident spend stays a NUMBER (rulebook v1 §26, founder C6: the trend graph is
 * deleted); the millionaire count joins it as a second held figure, tagged modeled;
 * the resident/visitor split bar stays; the caption sentence under it is gone (C6). */
function DemandSize({ d }: { d: any }) {
  const o = d.demand;
  const hasSplit = o && o.resident_pct != null && o.visitor_pct != null;
  // the focal is the per-resident figure, so the magnitude block needs BOTH the
  // per-capita spend (the focal) and the pool (its ink subline) to be held.
  const hasMagnitude = o && o.consumer_spend_usd_bn != null && o.spend_per_capita_usd != null;
  if (!o || (!hasSplit && !hasMagnitude)) return null;
  const growth = o?.growth_pct_yoy;
  const hasMillionaires = o.millionaires_count != null;
  // magnitude-mapped greys (largest segment darkest) + ink labels (AA on both greys)
  const segs: Array<[string, number, string]> = [["Residents", o.resident_pct, "#aeaeac"], ["Visitors", o.visitor_pct, "#dcdcda"]];
  const hasSeason = !!d.demand_calendar?.read;
  const sizeBox = (
    <Box>
      <Rail icon="market-size" kicker={hasMagnitude ? "How big the spending pool is" : "Where the trade comes from"} />
      {hasMagnitude ? (
        <div className="flex flex-wrap items-baseline gap-x-3">
          {/* the per-resident figure is the decision read (what a customer here spends);
              the pool magnitude and its growth stay numbers in the ink subline. */}
          <Fig className="text-3xl text-[var(--terra-text)]">${Math.round((o.spend_per_capita_usd || 0) / 1000)}K</Fig>
          <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">
            spent per resident a year, a <Fig className="text-[var(--c-ink)]">${o.consumer_spend_usd_bn}B</Fig> metro pool
            {growth != null ? <>, {growth >= 0 ? "up" : "down"} <Fig className="text-[var(--c-ink)]">{Math.abs(growth)}%</Fig> on the year</> : null}.
          </span>
        </div>
      ) : null}
      {/* the millionaire count: how deep the premium ticket runs. Modeled until sourced. */}
      {hasMillionaires ? (
        <div className="mt-3 flex flex-wrap items-baseline gap-x-2">
          <Fig className="text-[length:var(--t-sub)] text-[var(--c-ink)]">{Math.round((o.millionaires_count || 0) / 1000)}K</Fig>
          <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">millionaires live here, net worth $1M and up beyond the main home.</span>
          <SampleTag note="modeled" />
        </div>
      ) : null}
      {/* resident/visitor split, folded in as an inline share bar */}
      {hasSplit ? (
        <div className={hasMagnitude || hasMillionaires ? "mt-4 border-t border-[var(--c-border)] pt-3" : ""}>
          <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Who spends it</div>
          <div className="flex h-6 overflow-hidden rounded-lg border border-[var(--c-border)]" role="img" aria-label={`Residents ${o.resident_pct}%, visitors ${o.visitor_pct}%`}>{segs.map(([n, pct, bg]) => <div key={n} className="flex h-full items-center justify-center" style={{ width: `${pct}%`, background: bg }}><span className="fig text-[length:var(--t-micro)] font-semibold text-[var(--c-ink)]">{n} {pct}%</span></div>)}</div>
        </div>
      ) : null}
    </Box>
  );
  const seasonBox = hasSeason ? (
    <Box>
      <Seasonality d={d} />
    </Box>
  ) : null;
  if (seasonBox) return <WideRail>{sizeBox}{seasonBox}</WideRail>;
  return sizeBox;
}

/* Seasonality , the who-is-here read (founder C7, 2026-07-11; rulebook v1 §7): the
 * demand-by-month bar chart is DELETED , no honest per-month source is held , and the
 * block reads instead as the seasonal slice of the trade (the visitor share) plus the
 * seed's seasonal-peaks sentence, tagged modeled. No commuter figure is held, so none
 * renders. Only reached when the seed carries the read. */
function Seasonality({ d }: { d: any }) {
  const read = d.demand_calendar?.read;
  if (!read) return null;
  const sample = d.demand_calendar?._meta?.confidence === "placeholder" || d.demand_calendar?._meta?.confidence === "modeled";
  const visitor = d.demand?.visitor_pct;
  return (
    <>
      <Head icon="seasonality" sample={sample}>Busy months and quiet months</Head>
      {visitor != null ? (
        <div className="flex flex-wrap items-baseline gap-x-2">
          <Fig className="text-3xl text-[var(--c-ink)]">{visitor}%</Fig>
          <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">of spend arrives with visitors, the seasonal slice of the trade.</span>
        </div>
      ) : null}
      <p className="mt-2 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{read}</p>
    </>
  );
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
  const featured = (
    <Box>
      <Head icon="startup-cost">Lowest bar to entry</Head>
      <p className="text-[length:var(--t-lead)] font-medium leading-snug text-[var(--c-ink)]">An easier door does not always mean a cheaper build.</p>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-3">
        <span className="text-[length:var(--t-lead)] font-semibold text-[var(--c-ink)]">{lead.name}</span>
        <Fig className="text-[26px] text-[var(--terra-text)]">{k(lead.cost_to_open_usd)}</Fig>
        <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">to open, at <Fig className="text-[var(--c-ink)]">{lead.break_in_0_100}</Fig><span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">/100</span> ease, the gentlest way in.</span>
      </div>
      <a href={lead.href ?? "/dev/spine-cell"} className="mt-3 inline-flex items-center gap-1.5 text-[length:var(--t-body)] font-semibold text-[var(--terra-text)] hover:underline"><AtlasMark id="alt-business" size={14} className="shrink-0" />See the trade's live economics &#8594;</a>
    </Box>
  );
  if (rest.length === 0) return featured;
  return (
    <WideRail>
      {featured}
      <Box>
        <Head>Next-easiest, and the cost to open</Head>
        <div className="-mx-2 grid grid-cols-[1fr_64px_64px] items-baseline gap-4 px-2 pb-1 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
          <span>Trade</span><span className="text-right">Ease /100</span><span className="text-right">To open</span>
        </div>
        <div className="divide-y divide-[var(--c-border)]">
          {rest.map((t: any) => (
            <a key={t.slug} href={t.href ?? "/dev/spine-cell"} className="hov -mx-2 grid grid-cols-[1fr_64px_64px] items-baseline gap-4 rounded-md px-2 py-2">
              <span className="min-w-0 truncate text-[length:var(--t-body)] text-[var(--c-ink)]">{t.name}</span>
              <Fig className="text-right text-[length:var(--t-body)] text-[var(--c-ink2)]">{t.break_in_0_100}</Fig>
              <Fig className="text-right text-[length:var(--t-body)] text-[var(--c-ink)]">{k(t.cost_to_open_usd)}</Fig>
            </a>
          ))}
        </div>
        <div className="mt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">Ease out of 100, higher is easier; a rough cost to open the doors. Tap a trade for the full city economics.</div>
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
      <Box>
        <Head icon="watch" sample={sample}>What to watch here</Head>
        <EaseScale rows={rows} endLabels={["Riskier", "Safer"]} plain />
      </Box>
      <Box>
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
    <Box>
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
    <Box>
      <Head icon="locals-know">What locals know</Head>
      <div className="space-y-3">{items.map((it: any, i: number) => (
        <div key={i} className="flex gap-2.5"><span className="mt-0.5 text-[var(--c-muted)]">&#9656;</span><span className="text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]"><b className="text-[var(--c-ink)]">{it.title}</b> {it.detail}</span></div>))}
      </div>
    </Box>
  );
}

/* ================= CH6 , THE CLOSE ================= */
/* CityPeers. Null-guards: the whole card omits below two peer rows; each metric row is
 * dropped when NO entity carries it (so the spend row disappears on real-data
 * promotion), and per-cell missing values render a dash via CompareTable. The index
 * rows read as SIGNED PERCENTAGE-POINT deltas against the home city (founder C10 +
 * G11: one glance, no study); real-unit rows (income, visitors) stay as they are. */
function CityPeers({ d }: { d: any }) {
  const rows: any[] = d.peers?.list ?? [];
  if (rows.length < 2) return null;
  const homeName = rows.find((r) => r.home)?.name ?? d.meta?.city ?? "the city";
  const entities: CompareEntity[] = rows.map((r) => ({ id: r.name, name: r.name, home: !!r.home }));
  // Only build a metric row when at least one entity carries a real value for it.
  const has = (key: string) => rows.some((r) => r[key] != null);
  const signed = (v: number) => (v === 0 ? "0" : `${v > 0 ? "+" : ""}${v}`);
  const compareRows: CompareRow[] = [];
  if (has("rent_index")) {
    compareRows.push({
      key: "rent", label: `Rent vs ${homeName}`, unit: "pp", higherIsBetter: false,
      values: Object.fromEntries(rows.map((r) => [r.name, r.rent_index != null ? r.rent_index - 100 : null])),
      display: Object.fromEntries(rows.map((r) => [r.name, r.rent_index != null ? signed(r.rent_index - 100) : null])),
    });
  }
  if (has("spend_index")) {
    compareRows.push({
      key: "spend", label: `Spend vs ${homeName}`, unit: "pp", higherIsBetter: true,
      values: Object.fromEntries(rows.map((r) => [r.name, r.spend_index != null ? r.spend_index - 100 : null])),
      display: Object.fromEntries(rows.map((r) => [r.name, r.spend_index != null ? signed(r.spend_index - 100) : null])),
    });
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
    <Box>
      <Rail icon="compare" kicker="How it compares, city by city" />
      <CompareTable entities={entities} rows={compareRows} caption="Best in each metric is bold. Compared like for like. The home city is tinted, never ranked." />
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
  return (
    <Box>
      <Head icon="bookmark">The pick, and where to take it</Head>
      <div className="grid gap-4 md:grid-cols-[1.3fr_1fr] md:items-stretch">
        {/* the decision the whole page built toward */}
        <div className="rounded-[12px] border border-[var(--terra-border)] p-4" style={{ background: "linear-gradient(180deg,#ffffff,#fffaf8)" }}>
          <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--terra-text)]">The {d.meta?.city} pick</div>
          <div className="mt-1 text-[length:var(--t-sub)] font-semibold text-[var(--c-ink)]">{title}</div>
          <p className="mt-1.5 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{pick ? "The easiest trade to enter" : "The district with the lightest rent"}{pick && lightest ? ", in the district with the lightest rent" : ""}. Start there, then check the trade's live economics.</p>
          {(pick?.cost_to_open_usd != null || lightest) ? (
            <div className="mt-3 flex flex-wrap gap-4 border-t border-[var(--c-border)] pt-3">
              {pick?.cost_to_open_usd != null ? <div><Fig className="text-[length:var(--t-sub)] text-[var(--terra-text)]">{k(pick.cost_to_open_usd)}</Fig><div className="text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">cost to open the doors</div></div> : null}
              {lightest ? <div><Fig className="text-[length:var(--t-sub)] text-[var(--c-ink)]">x{lightest.rent_mult}</Fig><div className="text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">rent vs the city level</div></div> : null}
            </div>
          ) : null}
          {pick ? <a href={pick.href ?? "/dev/spine-cell"} className="mt-3 inline-flex items-center gap-1.5 text-[length:var(--t-body)] font-semibold text-[var(--terra-text)] hover:underline"><AtlasMark id="alt-business" size={14} className="shrink-0" />See the trade's live economics &#8594;</a> : null}
        </div>
        {/* the Pro / compare hand-off */}
        <div className="flex flex-col justify-between gap-3">
          <div>
            <div className="text-[length:var(--t-body)] text-[var(--c-ink)]">Set {d.meta?.city} beside up to three cities, side by side.</div>
            <a href="/dev/compare" className="mt-2 inline-flex cursor-pointer rounded-full bg-[var(--c-ink)] px-4 py-2 text-[length:var(--t-body)] font-semibold text-white transition hover:bg-[var(--terra-text)]">Open Compare</a>
          </div>
          {teaser.length > 0 ? (
            <LockVeil unlocked={isReviewBuild()} headline={`The full ${d.meta?.city} workbook`} note="Every district by every trade, the real cost stack, and the owner-runway calculator." cta="Unlock with Pro">
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
  const hasCustomersCh = !!(d.demand && (d.demand.resident_pct != null || d.demand.consumer_spend_usd_bn != null)) || !!(d.income?.median_income_usd != null);
  const tradeList = d.trades?.list ?? [];
  const hasTradesCh = tradeList.some((t: any) => t.break_in_0_100 != null && t.cost_to_open_usd != null) || tradeList.some((t: any) => t.local !== false && t.net_margin_pct != null);
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
            <Even><IncomeCurve d={d} /><RentAffordability d={d} /></Even>
          </div>
        </>
      ) : null}

      {/* Trades , the money chapter: the easiest way in, then where the money goes. */}
      {hasTradesCh ? (
        <>
          <Movement index={cn()} eyebrow="Trades and rivals" heading="What to open, and what you keep" icon="owner-keeps" />
          <div className="space-y-4">
            <LowestBar d={d} />
            <MarginKept d={d} />
          </div>
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
            <Even><OwnerRunway d={d} /><Locals d={d} /></Even>
            <CityCharacter d={d} />
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
