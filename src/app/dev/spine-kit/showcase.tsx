"use client";
/**
 * Interactive island for the /dev/spine-kit showcase , the stateful primitives
 * (ControlRail sort/search/facets, Pager, CompareTray, LockVeil unlock toggle,
 * DecisionRow click-sort) wired to realistic SAMPLE data. Kept as ONE client
 * component so the page itself stays a server component under SpineShell.
 */
import * as React from "react";
import { Movement, Box, Rail, SampleTag, InfoTip, SpectraTable, ShareStack, StruckLine, IndexBar, TERRA, type ShareSeg } from "@/components/spine/kit";
import {
  DecisionRow, DecisionRowHeader, type DecisionDatum, type SignalDef,
  CompareTable, type CompareEntity, type CompareRow,
  RankBars, type RankDatum,
  SortHeader, type SortState,
  LockVeil, LockPill,
  ControlRail, type Facet,
  Pager,
  CompareTray, type TrayItem,
  WinnerCard,
  Podium, type PodiumDatum,
  KitIndexStyles,
  MarginIndexBadge,
} from "@/components/spine/kit-index";
import { AtlasIcon } from "@/components/brand/icons";

/* ----- SAMPLE DATA (entity-scoped, like-for-like, margin/share only) ----- */
const SIGNALS: SignalDef[] = [
  { key: "ease", label: "Ease", unit: "/100", higherIsBetter: true },
  { key: "cost", label: "Cost", unit: "idx", higherIsBetter: false },
  { key: "demand", label: "Demand", unit: "/100", higherIsBetter: true },
];

type Place = DecisionDatum & { facets: string[] };
const PLACES: Place[] = [
  { id: "blr", name: "Bengaluru", flag: "🇮🇳", keptPct: 31, support: [{ key: "ease", value: 58 }, { key: "cost", value: 42 }, { key: "demand", value: 74 }], facets: ["asia", "metro"], home: false },
  { id: "nbo", name: "Nairobi", flag: "🇰🇪", keptPct: 34, support: [{ key: "ease", value: 51 }, { key: "cost", value: 38 }, { key: "demand", value: 61 }], facets: ["africa", "metro"] },
  { id: "wars", name: "Warsaw", flag: "🇵🇱", keptPct: 27, support: [{ key: "ease", value: 66 }, { key: "cost", value: 55 }, { key: "demand", value: 69 }], facets: ["europe", "metro"] },
  { id: "lon", name: "London", flag: "🇬🇧", keptPct: 18, support: [{ key: "ease", value: 49 }, { key: "cost", value: 88 }, { key: "demand", value: 92 }], facets: ["europe", "metro"], home: true },
  { id: "mty", name: "Monterrey", flag: "🇲🇽", keptPct: 29, support: [{ key: "ease", value: 54 }, { key: "cost", value: 47 }, { key: "demand", value: 63 }], facets: ["americas", "metro"] },
  { id: "hcm", name: "Ho Chi Minh City", flag: "🇻🇳", keptPct: 33, support: [{ key: "ease", value: 47 }, { key: "cost", value: 35 }, { key: "demand", value: 70 }], facets: ["asia", "metro"] },
  { id: "por", name: "Porto", flag: "🇵🇹", keptPct: 24, support: [{ key: "ease", value: 61 }, { key: "cost", value: 58 }, { key: "demand", value: 57 }], facets: ["europe"] },
  { id: "tbs", name: "Tbilisi", flag: "🇬🇪", keptPct: 30, support: [{ key: "ease", value: 72 }, { key: "cost", value: 33 }, { key: "demand", value: 48 }], facets: ["asia"] },
  { id: "med", name: "Medellín", flag: "🇨🇴", keptPct: 28, support: [{ key: "ease", value: 50 }, { key: "cost", value: 41 }, { key: "demand", value: 59 }], facets: ["americas", "metro"] },
];

const FACETS: Facet[] = [
  { key: "asia", label: "Asia" }, { key: "africa", label: "Africa" }, { key: "europe", label: "Europe" }, { key: "americas", label: "Americas" }, { key: "metro", label: "Metro" },
];

const COMPARE_ENTITIES: CompareEntity[] = [
  { id: "lon", name: "London", flag: "🇬🇧", home: true },
  { id: "blr", name: "Bengaluru", flag: "🇮🇳" },
  { id: "nbo", name: "Nairobi", flag: "🇰🇪" },
];
const COMPARE_ROWS: CompareRow[] = [
  { key: "kept", label: "Owner keeps", unit: "%", higherIsBetter: true, values: { lon: 18, blr: 31, nbo: 34 } },
  { key: "ease", label: "Ease of entry", unit: "/100", higherIsBetter: true, values: { lon: 49, blr: 58, nbo: 51 } },
  { key: "rent", label: "Rent as share of sales", unit: "%", higherIsBetter: false, values: { lon: 14, blr: 8, nbo: 7 } },
  { key: "wages", label: "Wages as share of sales", unit: "%", higherIsBetter: false, values: { lon: 31, blr: 22, nbo: 19 } },
  { key: "demand", label: "Demand pressure", unit: "/100", higherIsBetter: true, values: { lon: 92, blr: 74, nbo: null } },
];

const RANK_ROWS: RankDatum[] = [
  { id: "bak", label: "Bakery", value: 38, display: "38%" },
  { id: "cafe", label: "Café", value: 31, display: "31%" },
  { id: "bar", label: "Wine bar", value: 27, display: "27%" },
  { id: "rest", label: "Restaurant", value: 18, display: "18%" },
  { id: "qsr", label: "Fast food", value: 15, display: "15%" },
];

const PODIUM: [PodiumDatum, PodiumDatum, PodiumDatum] = [
  { id: "shore", name: "Shoreditch", keptPct: 24, sub: "owner keeps" },
  { id: "peck", name: "Peckham", keptPct: 21, sub: "owner keeps" },
  { id: "brix", name: "Brixton", keptPct: 19, sub: "owner keeps" },
];

/* ----- final-form upgrade primitives: ShareStack, StruckLine, IndexBar ----- */
const SHARE_SEGMENTS: ShareSeg[] = [{ label: "Online", pct: 34 }, { label: "In-store", pct: 66 }];
const SHARE_DEGENERATE: ShareSeg[] = [{ label: "Online", pct: 34 }]; // 1 segment: self-omits
const INDEX_ROWS: Array<[string, number]> = [["City centre", 100], ["Inner ring", 64], ["Suburb", 72], ["Outer ring", 58]];
const PCT_ROWS: Array<[string, number]> = [["Bakery", 38], ["Cafe", 31], ["Wine bar", 22]];

function Section({ index, eyebrow, heading, icon, children }: { index: string; eyebrow: string; heading: string; icon: any; children: React.ReactNode }) {
  return (
    <>
      <Movement index={index} eyebrow={eyebrow} heading={heading} icon={icon} sample />
      <div className="space-y-5">{children}</div>
    </>
  );
}

/* a fixed-width framed device demo to PROVE the mobile reflow + no h-scroll at 360px */
function PhoneFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="inline-block align-top">
      <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{label}</div>
      <div className="overflow-x-auto rounded-[20px] border-2 border-[var(--c-line-strong)] bg-[var(--c-card)] p-2" style={{ width: 360 }}>
        {/* the inner viewport is 360px; overflow-x-auto here would EXPOSE a runaway scroller if any child overflowed (it must not) */}
        <div className="overflow-x-hidden" style={{ width: "100%" }}>{children}</div>
      </div>
    </div>
  );
}

/* a tiny host chart proving StruckLine draws INSIDE another component's own
 * <svg>, on the exact same axis as its real curve (the shared-scale contract
 * StruckLine depends on: the phantom's points are projected through the SAME
 * X()/Y() the real curve uses, never a second invented scale). Mirrors the shape
 * of the page-local SurvivalSlope / SurvivalCurve charts (yr1/yr3/yr5, zero
 * baseline) without duplicating either one. */
function StruckLineDemo() {
  const W = 320, H = 120, padL = 10, padR = 10, padTop = 22, padBot = 26;
  const real = [100, 71, 52]; // the true still-trading curve
  const phantom = [100, 25, 10]; // the "9 in 10 fail" folklore claim
  const X = (i: number) => padL + (i / (real.length - 1)) * (W - padL - padR);
  const Y = (v: number) => padTop + (1 - v / 100) * (H - padTop - padBot);
  const realPts = real.map((v, i) => [X(i), Y(v)] as [number, number]);
  const phantomPts = phantom.map((v, i) => [X(i), Y(v)] as [number, number]);
  const line = "M " + realPts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-sm" style={{ height: H }} role="img" aria-label="Still trading: year one 100 percent, year three 71 percent, year five 52 percent. Folklore claims 9 in 10 fail by year five, struck out on the same chart.">
      <path d={line} fill="none" stroke={TERRA} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {realPts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === realPts.length - 1 ? 4 : 3} fill={i === realPts.length - 1 ? TERRA : "var(--c-ink)"} stroke="var(--c-card)" strokeWidth={1.5} />
      ))}
      <StruckLine points={phantomPts} label="folklore: 9 in 10 fail" />
    </svg>
  );
}

export function KitShowcase() {
  // ControlRail + list state
  const [query, setQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState("kept");
  const [activeFacets, setActiveFacets] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(1);
  const perPage = 5;

  // DecisionRow click-sort state (header arrows)
  const [rowSort, setRowSort] = React.useState<SortState>({ key: "ease", dir: "desc" });

  // CompareTray
  const [tray, setTray] = React.useState<TrayItem[]>([{ id: "lon", name: "London" }, { id: "blr", name: "Bengaluru" }]);

  // LockVeil
  const [unlocked, setUnlocked] = React.useState(false);

  const sortOptions: SignalDef[] = [{ key: "kept", label: "Margin" }, ...SIGNALS.map((s) => ({ key: s.key, label: s.label }))];

  const filtered = React.useMemo(() => {
    let list = PLACES.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    if (activeFacets.length) list = list.filter((p) => activeFacets.every((f) => p.facets.includes(f)));
    const val = (p: Place) => sortKey === "kept" ? p.keptPct : (p.support.find((s) => s.key === sortKey)?.value ?? -1);
    const hib = sortKey === "kept" ? true : (SIGNALS.find((s) => s.key === sortKey)?.higherIsBetter ?? true);
    return [...list].sort((a, b) => (hib ? val(b) - val(a) : val(a) - val(b)));
  }, [query, activeFacets, sortKey]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage);
  React.useEffect(() => { setPage(1); }, [query, activeFacets, sortKey]);

  const rowSorted = React.useMemo(() => {
    const v = (p: Place) => p.support.find((s) => s.key === rowSort.key)?.value ?? -1;
    return [...PLACES].sort((a, b) => (rowSort.dir === "desc" ? v(b) - v(a) : v(a) - v(b)));
  }, [rowSort]);
  const toggleRowSort = (key: string) => setRowSort((s) => s.key === key ? { key, dir: s.dir === "desc" ? "asc" : "desc" } : { key, dir: "desc" });

  return (
    <div className="space-y-10">
      <KitIndexStyles />

      {/* 9. WinnerCard */}
      <Section index="01" eyebrow="Verdict masthead" heading="WinnerCard" icon="verdict">
        <WinnerCard
          kicker="Best place for this trade"
          winner="Open your bakery in Nairobi"
          keptPct={34}
          why="Across comparable metros, a Nairobi bakery hands its owner the largest share of sales, on light rent and wage loads."
          catch="Demand is thinner than London, so you grow into the number rather than starting there. Plan a longer ramp."
          strip={[{ value: "51/100", label: "ease of entry" }, { value: "7%", label: "rent share" }, { value: "~9 mo", label: "to payback" }]}
        />
      </Section>

      {/* 10. Podium */}
      <Section index="02" eyebrow="Top-3 ranked" heading="Podium" icon="ranking">
        <Podium items={PODIUM} />
      </Section>

      {/* 6 + 1 + 3 + 7 : the AtlasIndex stack (ControlRail -> DecisionRow list -> Pager) */}
      <Section index="03" eyebrow="Browse + decide" heading="ControlRail + DecisionRow + Pager" icon="search">
        <ControlRail
          query={query} onQuery={setQuery}
          sortKey={sortKey} sortOptions={sortOptions} onSort={setSortKey}
          facets={FACETS} activeFacets={activeFacets}
          onToggleFacet={(k) => setActiveFacets((a) => a.includes(k) ? a.filter((x) => x !== k) : [...a, k])}
          count={filtered.length} total={PLACES.length} placeholder="Search places…"
        />
        <Box>
          <DecisionRowHeader signals={SIGNALS} />
          <div className="divide-y divide-[var(--c-border)]/60">
            {pageRows.length ? pageRows.map((p) => <DecisionRow key={p.id} d={p} signals={SIGNALS} />) : <div className="py-8 text-center text-[12.5px] text-[var(--c-muted)]">No places match. Loosen a filter.</div>}
          </div>
          <Pager page={page} pages={pages} onPage={setPage} total={filtered.length} perPage={perPage} />
        </Box>
      </Section>

      {/* 3. SortHeader driving a DecisionRow list (click headers to re-rank) */}
      <Section index="04" eyebrow="Click-to-sort" heading="SortHeader" icon="benchmark">
        <Box>
          <DecisionRowHeader signals={SIGNALS} sort={rowSort} onSort={toggleRowSort} />
          <div className="divide-y divide-[var(--c-border)]/60">
            {rowSorted.slice(0, 5).map((p) => <DecisionRow key={p.id} d={p} signals={SIGNALS} />)}
          </div>
          <div className="mt-2 text-[11px] text-[var(--c-muted)]">Click a support header (Ease / Cost / Demand) to re-rank. Arrow shows direction.</div>
        </Box>
      </Section>

      {/* 2. CompareTable */}
      <Section index="05" eyebrow="Side-by-side verdict" heading="CompareTable" icon="compare">
        <Box>
          <Rail icon="compare" kicker="Like for like" verdict="Three metros, the same trade, compared on shares and rates only." />
          <CompareTable entities={COMPARE_ENTITIES} rows={COMPARE_ROWS} />
        </Box>
      </Section>

      {/* 4. RankBars */}
      <Section index="06" eyebrow="Ranked bar list" heading="RankBars" icon="where-it-pays">
        <Box>
          <Rail icon="where-it-pays" kicker="What keeps most here" verdict="In one place, which trade hands the owner the largest share of sales." />
          <RankBars rows={RANK_ROWS} valueUnit="%" />
        </Box>
      </Section>

      {/* 5. LockVeil (locked vs unlocked) */}
      <Section index="07" eyebrow="Free / Pro gate" heading="LockVeil" icon="flag">
        <div className="mb-1 flex items-center gap-3">
          <button type="button" onClick={() => setUnlocked((u) => !u)} className="rounded-full border border-[var(--c-border)] bg-[var(--c-soft)] px-3 py-1 text-[12px] font-semibold text-[var(--c-ink2)] hover:bg-[var(--c-soft2)]">{unlocked ? "Re-lock (show gate)" : "Unlock (show content)"}</button>
          <span className="text-[11.5px] text-[var(--c-muted)]">Free rows can mask a single Pro cell with a <LockPill /> pill.</span>
        </div>
        <Box>
          <Rail icon="owner-keeps" kicker="Pro depth" verdict="The full ranked table is real but masked , value is visible, not hidden." />
          <LockVeil unlocked={unlocked} headline="See every place ranked" note="The full table, dollar take-home, and side-by-side compare." onUnlock={() => setUnlocked(true)}>
            <CompareTable entities={COMPARE_ENTITIES} rows={COMPARE_ROWS} caption="Pro view , masked behind the gate while locked." />
          </LockVeil>
        </Box>
      </Section>

      {/* THE PROOF: 360px framed reflow + no horizontal scroll */}
      <Section index="08" eyebrow="Mobile reflow proof (360px)" heading="No horizontal scroll" icon="confidence">
        <div className="flex flex-wrap gap-5">
          <PhoneFrame label="DecisionRow → stacked mini-card">
            <DecisionRow d={PLACES[3]} signals={SIGNALS} />
            <div className="my-1 border-t border-[var(--c-border)]" />
            <DecisionRow d={PLACES[0]} signals={SIGNALS} />
          </PhoneFrame>
          <PhoneFrame label="CompareTable → per-entity cards">
            <CompareTable entities={COMPARE_ENTITIES} rows={COMPARE_ROWS} />
          </PhoneFrame>
          <PhoneFrame label="LockVeil at 360px">
            <LockVeil unlocked={unlocked} headline="See every place ranked" note="Full table + dollar take-home." onUnlock={() => setUnlocked(true)}>
              <RankBars rows={RANK_ROWS} valueUnit="%" />
            </LockVeil>
          </PhoneFrame>
        </div>
        <p className="text-[11.5px] text-[var(--c-muted)]">Each frame is a hard 360px viewport with overflow-x exposed. If any primitive overflowed, a runaway scrollbar would appear inside the frame. It does not , the support cells drop to a 2-up footer and the table reflows to per-entity cards.</p>
      </Section>

      {/* 8. CompareTray , sticky bottom multi-select hand-off */}
      <Section index="09" eyebrow="Multi-select hand-off" heading="CompareTray" icon="bookmark">
        <Box>
          <Rail icon="bookmark" kicker="Pick a few, compare" verdict="Selected entities collect in a sticky tray that hands off to the compare view." />
          <div className="flex flex-wrap gap-2">
            {PLACES.slice(0, 6).map((p) => {
              const on = tray.some((t) => t.id === p.id);
              return (
                <button key={p.id} type="button" onClick={() => setTray((t) => on ? t.filter((x) => x.id !== p.id) : t.length < 3 ? [...t, { id: p.id, name: p.name }] : t)} aria-pressed={on}
                  className={`rounded-full border px-3 py-1 text-[12px] transition-colors ${on ? "border-[var(--terra-border)] bg-[var(--terra-soft)] text-[var(--terra-text)]" : "border-[var(--c-border)] bg-[var(--c-soft)] text-[var(--c-ink2)] hover:bg-[var(--c-soft2)]"}`}>
                  {p.flag} {p.name}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-[var(--c-muted)]">Pick up to 3. The tray is pinned to the bottom of the page.</p>
        </Box>
        <CompareTray items={tray} onRemove={(id) => setTray((t) => t.filter((x) => x.id !== id))} onClear={() => setTray([])} onCompare={() => undefined} />
      </Section>

      {/* ===== 10. THE PUBLISH SET (2026-07-08): the sample tag, the Margin Index badge,
          the tap-safe gloss, the shared spectra table, the trade icon family ===== */}
      <Section index="10" eyebrow="Publish pieces" heading="SampleTag, MarginIndexBadge, InfoTip, SpectraTable, trade icons" icon="verdict">
        <Box>
          <Rail icon="methodology" kicker="SampleTag" verdict="The per-section marker for fill-with-sample: honest, unmissable, calm." />
          <div className="flex flex-wrap items-center gap-3">
            <SampleTag />
            <SampleTag note="researching this country" />
          </div>
        </Box>
        <Box>
          <Rail icon="scorecard" kicker="MarginIndexBadge" verdict="The signature per-page score mark: the terracotta arc IS the composite, the compass tick points north." />
          <div className="flex flex-wrap items-center gap-8">
            <MarginIndexBadge score={82} />
            <MarginIndexBadge score={54} />
            <MarginIndexBadge score={23} showLabel={false} />
            <MarginIndexBadge score={null} />
          </div>
          <p className="mt-2 text-[11px] text-[var(--c-muted)]">No honest score renders nothing (the null case above), never a fabricated zero.</p>
        </Box>
        <Box>
          <Rail icon="who-for" kicker="InfoTip + SpectraTable" verdict="The tap-safe gloss and the shared two-pole spectra, gradient only where left genuinely means worse." />
          <p className="mb-3 text-[12.5px] text-[var(--c-ink2)]">Business rates<InfoTip gloss="A yearly charge based on the rental value of the premises." /> and the keep index<InfoTip gloss="100 keeps the city-average share of each sale; revenue lift divided by rent load." /> each carry a tap-safe gloss.</p>
          <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Gradient (left = worse for business)</div>
              <SpectraTable gradient rows={[{ left_label: "Rules shift often", right_label: "Rules are stable", position_0_1: 0.78, spectrum: "rules" }, { left_label: "Weak courts", right_label: "Strong courts", position_0_1: 0.82, spectrum: "courts" }]} glossFor={(s) => (s === "rules" ? "How often the rules of doing business change." : "How strong and independent the courts are in a dispute.")} />
            </div>
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Neutral (no better end)</div>
              <SpectraTable rows={[{ left_label: "Reserved", right_label: "Expressive", position_0_1: 0.4, spectrum: "expression" }, { left_label: "Relationship-led", right_label: "Rules-led", position_0_1: 0.75, spectrum: "orientation" }]} />
            </div>
          </div>
        </Box>
        <Box>
          <Rail icon="high-street" kicker="The trade icon family" verdict="One glyph per everyday trade, the same grammar as the rest of the set: one stroke weight, one accent." />
          <div className="flex flex-wrap gap-x-6 gap-y-4">
            {(["trade-restaurant", "trade-grocery", "trade-dental", "trade-cafe", "trade-gym", "trade-auto", "trade-salon", "trade-bar", "trade-childcare", "trade-taxi", "trade-retail", "bank", "sale-tag", "raise-money"] as const).map((id) => (
              <span key={id} className="flex w-[74px] flex-col items-center gap-1.5 text-center">
                <AtlasIcon id={id} size={26} className="spine-ic" style={{ color: "var(--c-ink)" }} />
                <span className="fig text-[9px] leading-tight text-[var(--c-muted)]">{id.replace("trade-", "")}</span>
              </span>
            ))}
          </div>
        </Box>
      </Section>

      {/* ===== 11. FINAL-FORM UPGRADE PRIMITIVES (2026-07-10): a lone percentage that
          should be a chart, a myth busted ON the survival chart instead of in a text
          box, and an index bar that cannot be mistaken for a percentage bar. Additive
          only, no page consumes these yet , this story is the proof they render and
          self-omit before any page wires them in. ===== */}
      <Section index="11" eyebrow="Upgrade primitives" heading="ShareStack, StruckLine, IndexBar" icon="benchmark">
        <Box>
          <Rail icon="district-mix" kicker="ShareStack" verdict="A lone percentage next to prose becomes a compact 2 to 3 segment share bar, the largest slice in terracotta." />
          <div className="max-w-sm">
            <ShareStack segments={SHARE_SEGMENTS} />
          </div>
          <div className="mt-4 max-w-sm border-t border-[var(--c-border)] pt-3">
            <ShareStack segments={SHARE_DEGENERATE} />
            <p className="text-[11px] text-[var(--c-muted)]">A single segment renders nothing above (self-omit): a share bar needs at least two segments to show a split.</p>
          </div>
        </Box>
        <Box>
          <Rail icon="myth-reality" kicker="StruckLine" verdict="The myth-busting device moves onto the real chart: a struck, dashed phantom line for the folklore claim, crossed out on the same axis as the truth." />
          <StruckLineDemo />
          <p className="mt-2 text-[11px] text-[var(--c-muted)]">Fewer than two phantom points (not shown here) self-omits: no line, no strike, nothing drawn , only the real curve remains.</p>
        </Box>
        <Box>
          <Rail icon="catchment" kicker="IndexBar" verdict="An index against a top-group baseline reads differently in form from a true percentage, not just by its suffix." />
          <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Index (baseline tick at 100, no percent sign)</div>
              <div className="space-y-2.5">
                {INDEX_ROWS.map(([label, v]) => (
                  <div key={label} className="grid grid-cols-[90px_1fr] items-center gap-3">
                    <span className="truncate text-[12.5px] text-[var(--c-ink2)]">{label}</span>
                    <IndexBar value={v} kind="index" accent={v === 100} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Percent (true share, rounded track)</div>
              <div className="space-y-2.5">
                {PCT_ROWS.map(([label, v]) => (
                  <div key={label} className="grid grid-cols-[90px_1fr] items-center gap-3">
                    <span className="truncate text-[12.5px] text-[var(--c-ink2)]">{label}</span>
                    <IndexBar value={v} kind="pct" accent={v === 38} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-3 border-t border-[var(--c-border)] pt-2 text-[11px] text-[var(--c-muted)]">A withheld value (not shown here) self-omits: no bar, no figure.</p>
        </Box>
      </Section>
    </div>
  );
}
