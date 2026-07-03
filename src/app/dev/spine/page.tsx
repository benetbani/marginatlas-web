/**
 * Country page , SPINE rebuild (dev surface). Built to the LOCKED spine
 * (docs/superpowers/specs/2026-06-28-country-page-spine.md) on the SHARED kit.
 * Rules: Geist + Space Grotesk (.fig) numbers; soft terracotta (#fb8469) for fills only;
 * never a blank half-row (narrow parts are paired); progressive disclosure (headline shown,
 * detail behind a click); clean numerals; no per-country prose. The local Box/Head/Ico/
 * Movement/Row duplicates were deleted , every primitive now comes from @/components/spine/kit
 * so the shared foundation (two-zone band, premium Box, fixed Movement/Expand) reaches here.
 */
import * as React from "react";
import fs from "node:fs";
import path from "node:path";
import { CountryFlag } from "@/components/CountryFlag";
import { NeighboursTable } from "./NeighboursTable";
import { Conveyor } from "@/components/spine/conveyor";
import { SpineMap, type SpinePoint } from "@/components/spine/SpineMap";
import { CountFig } from "./motion";
import {
  TERRA, TRACK, usd, cap,
  Ico, Fig, MiniBar, Dots, StackBar, Waterfall, type StackSeg,
  Movement, Box, EaseScale, Meter, Head, Chip, KV, Expand, InlineDisclosure, Bullets,
  Even, WideRail, Spectrum, CatRows,
  Rail, Stat, Spark, Timeline, type TLNode, type TLPhase,
} from "@/components/spine/kit";
import { RankBars, LockPill } from "@/components/spine/kit-index";

export const dynamic = "force-static";
const GB: any = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "../page-data/countries/GB.json"), "utf8"));

/* Provenance is stated ONCE near the masthead (below). Per-section confidence is
 * carried by a single quiet dot, never a loud 'sample' pill: solid ink = modeled/held,
 * hollow = still illustrative. Reads as a footnote, not a demo stamp. */
function ConfidenceDot({ level }: { level?: string }) {
  const solid = level === "held" || level === "modeled";
  return (
    <span
      title={solid ? "Modeled from published figures" : "Illustrative, pending research"}
      className="inline-block h-[7px] w-[7px] shrink-0 rounded-full align-middle"
      style={solid ? { background: "#c9c2bc" } : { border: "1px solid #cfc8c3", background: "transparent" }}
      aria-hidden
    />
  );
}

/* read a peer country file (server-only); used for derived "where it sits among peers" sparks */
function peerVals(codes: string[], pick: (j: any) => number | null | undefined): number[] {
  return codes
    .map((code) => { try { return pick(JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "../page-data/countries/" + code + ".json"), "utf8"))); } catch { return null; } })
    .filter((v): v is number => typeof v === "number");
}

/* ================= CHAPTER 1 ================= */
/*
 * Hero , the masthead + the ONE dominant decision figure.
 * verdict: a typical small business keeps about a sixth of its revenue; the rest is context.
 * focal: the margin-kept figure, set at hero scale so the answer lands in the first screen.
 * width: full masthead row; the answer sits left, a compact support grid sits right.
 * terracotta: the kept figure only (support tiles stay ink).
 */
function Hero({ d }: { d: any }) {
  const h = d.headline ?? {};
  const kept = d.margin?.kept_pct ?? 0;
  // Formation time = the company-registration step only (registration, not "operational").
  // The stepper and timeline carry the fuller "bank sets the pace" story, so these read as
  // one narrative: registered in a day, fully operational once the bank clears.
  const steps = d.setup?.steps ?? [];
  const formStep = steps.find((s: any) => /company|regist/i.test(s.name)) ?? steps[0];
  const formDays = Math.max(0, formStep?.time_days ?? 0);
  const formValue = formDays === 1 ? "1 day" : `${formDays} days`;
  // Salary shown as annual (the honest unit). No modeled monthly derivation on the masthead.
  const tiles: Array<[string, string, string?]> = [
    ["Business tax", `${h.smb_tax_pct}%`],
    ["Average salary", usd(h.average_salary_usd), "/yr"],
    ["GDP / capita", usd(h.gdp_per_capita_usd)],
    ["Ease of business", `${h.ease_of_business_score}`, "/100"],
    ["Net wealth / adult", usd(h.net_wealth_per_adult_usd)],
    ["Company registered", formValue],
  ];
  return (
    <section className="overflow-hidden">
      <div className="py-6 md:py-8">
        <a className="mb-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--c-border)] bg-white/70 px-3 py-1 text-xs font-semibold text-[var(--c-ink2)] transition hover:border-[var(--terra-border)] hover:text-[var(--terra-text)]">&#8592; All countries</a>
        <div className="mt-2 grid items-center gap-x-8 gap-y-6 md:grid-cols-[1fr_auto]">
          <div>
            <div className="flex items-center gap-3.5"><CountryFlag iso2="gb" className="w-[52px] rounded-sm shadow-sm" /><h1 className="text-balance text-3xl font-bold tracking-tight text-[var(--c-ink)] md:text-4xl">{d.meta?.name}</h1></div>
            {/* THE answer, in the top 20%: the margin a typical small business keeps. */}
            <div className="mt-4 flex items-end gap-3">
              <CountFig target={kept} prefix="$" className="text-[64px] font-semibold leading-[0.9] text-[var(--terra-text)] md:text-[76px]" />
              <span className="mb-2 max-w-[22ch] text-[13px] leading-snug text-[var(--c-ink2)]">kept of every $100 a typical small business takes in.</span>
            </div>
          </div>
          <div className="grid w-full max-w-[420px] grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--c-border)] sm:grid-cols-3 md:w-[420px]" style={{ background: "var(--c-border)" }}>
            {tiles.map(([label, value, unit]) => (
              <div key={label} className="bg-[var(--c-card)] px-3 py-2.5">
                <div className="text-[9.5px] font-semibold uppercase leading-tight tracking-[0.06em] text-[var(--c-muted)]">{label}</div>
                <div className="mt-0.5 text-[15px] text-[var(--c-ink)]"><Fig>{value}</Fig>{unit ? <span className="text-[10px] text-[var(--c-muted)]">{unit}</span> : null}</div>
              </div>
            ))}
          </div>
        </div>
        {/* provenance, stated ONCE, one quiet line. No two-symbol dot legend: a hollow
            section dot simply flags a figure still being researched. */}
        <p className="mt-5 border-t border-[var(--c-border)] pt-3 text-[11.5px] leading-snug text-[var(--c-muted)]">
          Figures are modeled from published economic data as of 2026, converted to US dollars for like-for-like reading. A hollow dot beside a section marks a figure still being researched.
        </p>
      </div>
    </section>
  );
}

/*
 * MarginReality , the cost base behind the hero's kept figure.
 * verdict: Labour is the heaviest slice; tax and premises follow; margin is what survives.
 * focal: a full-width stacked cost bar, the kept slice terracotta at the end.
 * width: WideRail [1] , the chart beside the six-lens Profile scorecard.
 * terracotta: the kept (margin) slice only.
 */
function MarginReality({ d }: { d: any }) {
  const m = d.margin ?? {};
  const kept = m.kept_pct ?? 0;
  const greys = ["#737373", "#a3a3a3", "#d4d4d4", "#e6e6e6", "#ededed"];
  const parts: StackSeg[] = [
    ...(m.cost_stack ?? []).map((p: any, i: number) => ({ label: p.name, pct: p.pct, color: greys[i % greys.length] })),
    { label: "Margin", pct: kept, color: TERRA },
  ];
  return (
    <Box>
      <div className="mb-3 flex items-center gap-2"><Ico id="owner-keeps" /><span className="text-[15px] font-semibold text-[var(--c-ink)]">Where the other ${100 - kept} goes</span><ConfidenceDot /></div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><span className="text-sm text-[var(--c-ink2)]">Labour is the heaviest slice; the <b className="text-[var(--terra-text)]">${kept}</b> margin is what survives it.</span></div>
      <StackBar h="h-10" className="mt-4" segments={parts} ariaLabel={`Of every 100 in revenue, about ${kept} is kept as margin`} />
      <InlineDisclosure name="margin" summary="See the cost base">
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">{parts.map((s) => <span key={s.label} className="inline-flex items-center gap-1.5 text-[11px] text-[var(--c-ink2)]"><span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />{s.label} <Fig className="text-[var(--c-ink)]">{s.pct}%</Fig></span>)}</div>
      </InlineDisclosure>
    </Box>
  );
}

/*
 * Profile , the country scorecard.
 * verdict: A strong, easy place to do business; the one weak lens is affordability.
 * focal: a single 44px overall-average figure (the one-glance score).
 * width: lives in the MarginReality WideRail as the [2] rail (chart-beside-prose).
 * terracotta: the focal average + the #1-ranked lens bar only.
 */
function Profile({ d }: { d: any }) {
  const ep = d.economic_profile ?? {};
  const lenses: Array<[string, string]> = [["economic_reward", "Demand"], ["ease_of_business", "Ease of entry"], ["talent_pool", "Talent pool"], ["political_stability", "Stability"], ["access_to_financing", "Access to finance"], ["affordability", "Affordability"]];
  const scored = lenses.map(([k, label]) => ({ label, s: Number(ep[k] ?? 0) })).sort((a, b) => b.s - a.s);
  const avg = scored.length ? Math.round((scored.reduce((a, x) => a + x.s, 0) / scored.length) * 10) / 10 : 0;
  const top = scored[0]?.label;
  return (
    <Box>
      <Rail icon="vs-world" kicker="The country, in six lenses" verdict={<>It scores best on <b className="text-[var(--c-ink)]">{top?.toLowerCase()}</b>; the one drag is the bottom lens.</>} />
      <div className="grid items-center gap-5 sm:grid-cols-[34%_1fr]">
        <div className="focal flex flex-col items-center justify-center p-4 text-center">
          <Stat value={<>{avg}<span className="text-[15px] text-[var(--c-muted)]">/10</span></>} size="focal" accent />
          <div className="mt-1 text-[11px] uppercase tracking-wide text-[var(--c-muted)]">across six lenses</div>
        </div>
        <div className="space-y-2">
          {scored.map((r, i) => (
            <div key={r.label} className="grid grid-cols-[112px_1fr_30px] items-center gap-2.5">
              <span className="min-w-0 truncate text-[12px] text-[var(--c-ink2)]">{r.label}</span>
              <Dots score={r.s} max={10} accent={i === 0} />
              <Fig className="text-right text-[12px] text-[var(--c-ink)]">{r.s}</Fig>
            </div>
          ))}
        </div>
      </div>
    </Box>
  );
}

/*
 * Demand , the size of the market you are selling into.
 * verdict: A deep consumer pool, but most of the money is everyday spend, not premium.
 * focal: the consumer spend pool figure (the pot every business competes for).
 * width: Even , peer to a business-density read, equal class.
 * terracotta: the focal pool figure + the largest spend segment bar only.
 */
function Demand({ d }: { d: any }) {
  const m = d.demand ?? {};
  const segs: any[] = (m.consumer_segments ?? []).slice().sort((a: any, b: any) => b.pct - a.pct);
  const topName = segs[0]?.name?.toLowerCase();
  return (
    <Box className="relative"><div className="absolute right-5 top-5"><ConfidenceDot /></div>
      <Rail icon="spending-power" kicker="The size of the market" verdict={<>A deep consumer pool, but most is <b className="text-[var(--c-ink)]">{topName || "everyday spend"}</b>, not premium.</>} />
      <div className="grid items-stretch gap-4 md:grid-cols-2">
        <div className="focal flex flex-col justify-center p-4">
          {/* Standardized figure: billions >= 1,000 read as trillions (one decimal),
              so the masthead never shows an unpunctuated "$1850B". */}
          {(() => {
            const bn = m.consumer_spend_pool_usd_bn;
            const big = typeof bn === "number" ? (bn >= 1000 ? (bn / 1000).toFixed(2).replace(/\.?0+$/, "") : `${bn}`) : "-";
            const unit = typeof bn === "number" && bn >= 1000 ? "T" : "B";
            return <Stat value={<>${big}<span className="text-[16px] text-[var(--c-muted)]">{unit}</span></>} label="Consumer spend a year" size="focal" accent />;
          })()}
          <div className="mt-2 flex items-baseline gap-2 border-t border-[var(--c-border)] pt-2.5">
            <Fig className="text-[18px] text-[var(--c-ink)]">{(m.businesses_total / 1e6).toFixed(1)}M</Fig>
            <span className="text-[11px] leading-tight text-[var(--c-ink2)]">businesses already trading, about {m.businesses_per_1000_adults} per 1,000 adults</span>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Where that money goes</div>
          <div className="space-y-2">{segs.map((s: any, i: number) => (
            <div key={s.name} className="grid grid-cols-[128px_1fr_34px] items-center gap-2.5">
              <span className="min-w-0 truncate text-[12px] text-[var(--c-ink2)]">{s.name}</span>
              <MiniBar pct={s.pct} />
              <Fig className="text-right text-[12px] text-[var(--c-ink)]">{s.pct}%</Fig>
            </div>))}
          </div>
        </div>
      </div>
    </Box>
  );
}

/*
 * TheCatch , the one honesty band. Fuses the headline myth, the main counterweight and
 * the single top-scored risk into ONE Rail + bullets. Derived from data already present
 * (risk_exit.risks + the affordability lens + locals intel), never a new invented claim.
 * verdict: a flat "what the easy-setup story leaves out" line; the bullets carry the honesty.
 * width: Full , a load-bearing honesty band; never center-floated.
 * terracotta: the honest-take icon tile only (this IS a verdict section, so the accent belongs).
 */
function TheCatch({ d }: { d: any }) {
  const risks = (d.risk_exit?.risks ?? []).slice().sort((a: any, b: any) => (b.score_1_10 ?? 0) - (a.score_1_10 ?? 0));
  const topRisk = risks[0];
  const riskLabel: any = { energy_input_costs: "energy and input costs", rule_tax_changes: "shifting rules and tax", demand_cycle: "the demand cycle", currency_swings: "currency swings", skills_shortages: "skills shortages" };
  const ep = d.economic_profile ?? {};
  const aff = Number(ep.affordability ?? 0);
  const locals = d.character?.locals_intel ?? [];
  const items: string[] = [
    `Easy to set up, yes, but affordability scores just ${aff}/10: high costs eat the margin the easy start promises.`,
    topRisk ? `The biggest standing risk is ${riskLabel[topRisk.name] ?? topRisk.name.replace(/_/g, " ")}, at ${topRisk.score_1_10}/10, well ahead of the rest.` : "",
    locals[0]?.title ? `${locals[0].title} ${locals[0].detail}` : "Local operators price the hidden costs in before they commit.",
  ].filter(Boolean);
  return (
    <Box>
      <Rail icon="honest-take" tone="terra" kicker="The catch" verdict="What the easy-setup story leaves out." />
      <Bullets items={items} />
    </Box>
  );
}

/* ================= CHAPTER 2 ================= */
/*
 * SetupTimeline , the ONE setup timeline for CH2 (merges the old mini-Gantt and the
 * separate First-90-Days axis into a single horizontal time axis, no featured segment).
 * verdict: You can trade from day one; the bank account sets the real pace.
 * focal: one continuous 90-day axis with milestones positioned by real time.
 * width: Full , a time axis must read across the whole column.
 * terracotta: only the "registered and trading" break-even node (never a period fill).
 */
function SetupTimeline({ d }: { d: any }) {
  const steps = d.setup?.steps ?? [];
  const stepDay = (re: RegExp) => { const x = steps.find((it: any) => re.test(it.name)); return x ? x.time_days : null; };
  const reg = Math.max(1, stepDay(/company|regist(?!er for vat)/i) ?? 1);
  const tax = stepDay(/register for tax/i);
  const vat = stepDay(/vat/i);
  const bank = stepDay(/bank/i);
  // The break-even node is centre-anchored by the kit, so a wide label at the far
  // left runs off the plot. Keep the label short ("Registered") and float its
  // position to a small floor (a few days in) so the centred label clears the
  // day-0 edge; the true day is carried in the sub-label, and the "trading from
  // day one" meaning lives in the read line below and the phase band.
  const regNodeAt = Math.max(reg, 5);
  const nodes: TLNode[] = [{ at: regNodeAt, label: "Registered", sub: reg === 1 ? "day 1, trading" : `day ${reg}`, kind: "breakeven" }];
  if (bank) nodes.push({ at: bank, label: "Bank account", sub: "the slow step" });
  if (tax) nodes.push({ at: Math.max(regNodeAt + 4, Math.max(reg, tax) + reg), label: "Tax registered" });
  nodes.push({ at: 28, label: "Payroll ready", sub: "first hire" });
  if (vat) nodes.push({ at: 45, label: "VAT registered", sub: "once sales are high" });
  // Two phase bands only, with short labels that will not collide with the
  // milestone titles sitting just below/above the axis.
  const phases: TLPhase[] = [["setup", 0, 30], ["trading", 30, 90]];
  return (
    <Timeline
      span={90}
      unit="day"
      phases={phases}
      nodes={nodes}
      read={<>You can trade from day one; the bank account is the single slow step. <span className="text-[var(--c-muted)]">Fees are small: {steps.filter((s: any) => (s.cost_usd || 0) > 0).map((s: any) => `${s.name.toLowerCase()} $${Math.round(s.cost_usd)}`).join(", ") || "registration only"}.</span></>}
    />
  );
}

function formationExtra(name: string) {
  const n = (name || "").toLowerCase();
  if (n.includes("sole")) return { paperwork: "Light", raise: "Hard, no shares to sell", setup: "Free, minutes", summary: "You and the business are one in law: simplest to run, you keep all the profit and carry all the risk personally." };
  if (n.includes("partner")) return { paperwork: "Medium", raise: "Shared between partners", setup: "Low", summary: "Two or more owners share the work, the profit and the liability under one agreement; trust between partners matters." };
  return { paperwork: "Medium, annual accounts", raise: "Easy, you can issue shares", setup: "Small one-off fee", summary: "A separate legal person: your liability is limited and it is the default once you hire or raise, but you file accounts every year." };
}
/*
 * Formation , which legal structure to form (KEPT AS IS per founder note #4).
 * verdict: Most growing firms pick a limited company; sole trader suits the very small.
 * focal: the first structure open by default; each expands to liability/tax/paperwork.
 * width: Even , paired peer to Banking.
 * terracotta: none (reference section, ink tile + the VAT chip).
 */
function Formation({ d }: { d: any }) {
  const structures = d.setup?.structures ?? [];
  return (
    <Box><Head icon="methodology">Which legal structure to form</Head>
      <div className="space-y-2">{structures.map((s: any, i: number) => { const x = formationExtra(s.name); return (
        <Expand key={i} name="formation" title={s.name} open={i === 0}>
          <p className="mb-2 text-[12px] leading-snug text-[var(--c-ink2)]">{x.summary}</p>
          <KV k="Liability" v={s.liability} /><KV k="Taxed as" v={s.tax} /><KV k="Paperwork" v={x.paperwork} /><KV k="Raising money" v={x.raise} /><KV k="Setup" v={x.setup} /><KV k="Best for" v={s.best_for} />
        </Expand>); })}
      </div>
      {d.setup?.vat_threshold_usd ? <div className="mt-3 inline-block rounded-full border border-[var(--c-border)] bg-[var(--c-soft)] px-3 py-1.5 text-[12px] text-[var(--c-ink2)]">Register for VAT once sales pass <Fig className="text-[var(--c-ink)]">${Math.round(d.setup.vat_threshold_usd / 1000)}K</Fig></div> : null}
    </Box>
  );
}

/*
 * Banking , opening a business bank account.
 * verdict: Open to foreigners, but a UK address and a few weeks of waiting is the catch.
 * focal: a single difficulty meter (where the friction sits) , the one-glance read.
 * width: Even , paired peer to Formation, equal class.
 * terracotta: the difficulty meter fill only.
 */
function Banking({ d }: { d: any }) {
  const b = d.setup?.banking ?? {};
  const fmap: any = { low: 22, medium: 55, high: 82 };
  const fv = fmap[(b.friction || "").toLowerCase()] ?? 50;
  return (
    <Box>
      <Rail icon="owner-keeps" kicker="Opening a bank account" verdict={b.can_foreigner ? "Open to foreign owners; a UK address and a few weeks of checks are the catch." : "Restricted for foreign owners; expect added hurdles."} />
      <div className="focal mb-3 p-3.5">
        <div className="mb-1 flex items-baseline justify-between"><span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">How hard</span><Fig className="text-[18px] capitalize text-[var(--terra-text)]">{b.friction}</Fig></div>
        <Meter value={fv} left="Easy" right="Hard" />
      </div>
      <Bullets items={b.bullets ?? []} />
      <div className="mt-3 divide-y divide-[var(--c-border)]">
        {[["High-street", b.banks_traditional], ["Digital", b.banks_digital]].map(([label, arr]) => (
          <div key={label as string} className="flex gap-3 py-2"><span className="w-20 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{label}</span><span className="text-[12.5px] text-[var(--c-ink)]">{((arr as string[]) ?? []).join("  ·  ")}</span></div>))}
      </div>
    </Box>
  );
}

/*
 * TaxByLevel , what the business actually pays (retired doughnut -> zero-baseline bars).
 * verdict: Corporation tax carries most of the burden; the all-in load lands middling.
 * focal: the all-in load figure, then a ranked share-of-load bar list, corp tax terra.
 * width: Full , the bars beside a plain-English "which tax does what" disclosure.
 * terracotta: the all-in figure + the corporation-tax bar only.
 * NOTE: was a doughnut, but corp tax was only ~a third of the ring (no dominant
 * slice), so it broke the single-dominant rule. Recast to zero-baseline bars.
 */
function TaxByLevel({ d }: { d: any }) {
  const groups = d.tax_detail?.groups ?? [];
  const allIn = d.tax_burden?.total_pct ?? 0;
  const band = allIn >= 42 ? "Heavy" : allIn >= 30 ? "Middling" : "Light";
  const comp = d.tax_burden?.components ?? {};
  // The taxes that make up the burden, with their real statutory rates.
  const raw = ([
    ["Corporation tax", comp.corporation_tax_pct ?? 0, TERRA],
    ["Business rates", comp.business_rates_pct_equiv ?? 0, "#8f8a86"],
    ["Capital gains", comp.capital_gains_pct ?? 0, "#c0b9b3"],
    ["Dividend tax", comp.dividend_tax_pct ?? 0, "#e0d9d3"],
  ] as Array<[string, number, string]>).filter(([, p]) => (p as number) > 0);
  const rateSum = raw.reduce((a, [, p]) => a + (p as number), 0) || 1;
  // Each tax's SHARE of the all-in burden, ranked, corp tax leading. Shown as
  // zero-baseline horizontal bars (no doughnut): with corp tax only ~a third of
  // the ring, no single slice dominated, so the ring broke the single-dominant
  // rule. Bars make "several taxes stack" read at a glance; corp tax is terra.
  const shareRows: Array<[string, number]> = raw.map(([n, p]) => [n as string, Math.round(((p as number) / rateSum) * 100)] as [string, number]);
  const corpShare = shareRows[0]?.[1] ?? 0;
  const waterfallRows: Array<[string, number, boolean?]> = shareRows.map(([n, pct], i) => [n, pct, i === 0]);
  const items = groups.flatMap((g: any) => (g.items ?? []).map((it: any) => ({ ...it, level: g.level })));
  return (
    <Box>
        <Rail icon="taxes" kicker="What the business actually pays" verdict="You keep less than the headline rate suggests: several taxes stack, corporation tax carries most." />
        <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-[13px] text-[var(--c-ink2)]">All-in tax load</span>
          <Fig className="text-[26px] leading-none text-[var(--terra-text)]">{allIn}%</Fig>
          <span className="rounded-full border border-[var(--terra-border)] bg-[var(--terra-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--terra-text)]">{band} for the peer set</span>
        </div>
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Share of the tax load</div>
        <Waterfall rows={waterfallRows} />
        <div className="mt-2.5 border-t border-[var(--c-border)] pt-2 text-[11.5px] text-[var(--c-muted)]">Corporation tax is {corpShare}% of the load. VAT is customer-borne, so it sits outside.</div>
        <InlineDisclosure name="taxdetail" className="group mt-3 border-t border-[var(--c-border)] pt-2.5" summary="Every tax, line by line">
          <div className="mt-2.5 divide-y divide-[var(--c-border)]">{items.map((it: any) => (
            <div key={it.name} className="flex items-baseline gap-3 py-2"><Fig className="w-14 shrink-0 text-[15px] text-[var(--c-ink)]">{it.value}</Fig><span className="text-[12px] leading-tight text-[var(--c-ink2)]"><b className="font-medium text-[var(--c-ink)]">{it.name}</b> <span className="text-[10px] uppercase tracking-wide text-[var(--c-muted)]">{it.level}</span><br />{it.note}</span></div>))}
          </div>
        </InlineDisclosure>
    </Box>
  );
}

/* ================= CHAPTER 3 ================= */
/*
 * PayByLevel , what staff cost to employ, by seniority.
 * verdict: A senior hire costs roughly triple an entry-level one, before on-costs.
 * focal: a clean single-value ranked bar per level (no invented range around the point).
 * width: Full , a wage ladder reads best across the column.
 * terracotta: the top (most expensive) level only, via RankBars.
 */
function PayByLevel({ d }: { d: any }) {
  const o = d.people_pay?.pay_by_level_usd ?? {};
  const levels: Array<[string, string]> = [["junior", "Entry / wage floor"], ["experienced", "Skilled"], ["senior", "Senior"], ["specialist", "Management & specialist"]];
  const rows = levels.map(([k, label]) => ({ id: k, label, value: o[k] || 0, display: `$${Math.round((o[k] || 0) / 1000)}K` }));
  const top = rows.reduce((a, b) => (b.value > a.value ? b : a), rows[0]);
  return (
    <Box><Head icon="wages">What staff cost to employ</Head>
      <RankBars rows={rows} valueUnit="" leaderId={top?.id} />
      <div className="mt-3 rounded-lg bg-[var(--c-soft)] px-3 py-2 text-[12px] text-[var(--c-ink2)]">Gross salary only. On top of every wage add <Fig className="text-[var(--terra-text)]">+{d.tax_burden?.employer_oncost_pct}%</Fig> for pension and social contributions.</div>
    </Box>
  );
}
/*
 * HiringDials , how easy it is to hire, contract and let go.
 * verdict: A flexible labour market; contracts are light and dismissals are lighter than peers.
 * focal: four markers on one shared Harder-to-Easier scale (EaseScale).
 * width: Even , paired peer to TalentDepth.
 * terracotta: the marker dots only.
 */
function HiringDials({ d }: { d: any }) {
  const h = d.people_pay?.hiring ?? {}; const eMap: any = { easy: 84, moderate: 52, hard: 18, deep: 84, fair: 52, thin: 18 };
  const rows: Array<[string, number, string]> = [["Hiring someone", eMap[h.hire_ease] ?? 50, cap(h.hire_ease)], ["Contracts you can use", eMap[h.contract_ease] ?? 50, cap(h.contract_ease)], ["Letting someone go", eMap[h.fire_ease] ?? 50, cap(h.fire_ease)], ["Depth of talent", eMap[h.recruiting_depth] ?? 50, cap(h.recruiting_depth)]];
  return (
    <Box><Head icon="hiring">How easy it is to hire and let go</Head>
      <div className="mb-5 mt-1 flex justify-between text-[10px] uppercase tracking-wide text-[var(--c-muted)]"><span>Harder / rigid</span><span>Easier / flexible</span></div>
      <EaseScale rows={rows} />
    </Box>
  );
}
/*
 * TalentDepth , how deep the talent pool runs by field.
 * verdict: Finance, tech and professional services run deepest; making things runs thinnest.
 * focal: a ranked score bar per field, deepest first.
 * width: Even , paired peer to HiringDials.
 * terracotta: the deepest field bar only.
 */
function TalentDepth({ d }: { d: any }) {
  const map: any = { finance: "Finance", software_tech: "Software & tech", professional_legal: "Professional & legal", creative_media: "Creative & media", life_sciences: "Life sciences", manufacturing_trades: "Manufacturing & trades" };
  const arr = (d.people_pay?.talent_depth ?? []).slice().sort((a: any, b: any) => b.score_1_5 - a.score_1_5);
  return (
    <Box><Head icon="who-for">How deep the talent pool runs, by field</Head>
      <div className="space-y-2.5">{arr.map((t: any, i: number) => (
        <div key={t.field} className="hov -mx-2 grid grid-cols-[160px_1fr_44px] items-center gap-3 rounded-md px-2 py-1"><span className="min-w-0 truncate text-[12.5px] text-[var(--c-ink2)]">{map[t.field] ?? t.field}</span><Dots score={t.score_1_5 * 2} max={10} accent={i === 0} /><Fig className="text-right text-[13px] text-[var(--c-ink)]">{t.score_1_5 * 2}/10</Fig></div>))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--c-border)] pt-3"><span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Languages</span>{(d.people_pay?.languages ?? []).map((l: any) => <Chip key={l.name}>{l.name} {l.pct_speakers}%</Chip>)}</div>
    </Box>
  );
}

/*
 * OperatingCosts , what it costs to run premises.
 * verdict: Rent is the cost that moves the needle; it sits mid-pack among peers.
 * focal: commercial rent + a peer Spark giving the number a "where it sits" shape.
 * width: WideRail [1fr_188px] feel , focal rent beside a thin support list.
 * terracotta: the rent Spark line + marker only.
 */
function OperatingCosts({ d }: { d: any }) {
  const c = d.costs ?? {};
  const p = d.premises ?? {};
  const peers = peerVals(d.meta?.peer_set ?? [], (j) => j?.costs?.commercial_rent_usd_sqm_yr);
  const ladder = [...peers, c.commercial_rent_usd_sqm_yr].filter((v) => typeof v === "number").sort((a, b) => a - b);
  const markerIndex = ladder.indexOf(c.commercial_rent_usd_sqm_yr);
  const rank = markerIndex >= 0 && ladder.length > 1 ? (markerIndex <= 0 ? "the cheapest" : markerIndex >= ladder.length - 1 ? "the priciest" : "mid-pack") : "mid-pack";
  const support: Array<[string, string]> = [
    [`$${Math.round(c.energy_usd_per_kwh * 100) / 100}`, "Electricity, per kWh"],
    [`$${Math.round(c.labour_cost_index_usd / 1000)}K`, "Loaded labour, per worker / yr"],
    [`$${c.license_setup_usd}`, "Licence & setup, one-off"],
  ];
  return (
    <Box>
      <Rail icon="commercial-rent" kicker="What it costs to run premises" verdict={<>Rent moves the needle, and it sits <b className="text-[var(--c-ink)]">{rank}</b> among neighbours.</>} />
      <div className="grid items-stretch gap-4 md:grid-cols-[1fr_200px]">
        <div className="focal flex flex-col justify-center p-4">
          <Stat value={<>${c.commercial_rent_usd_sqm_yr?.toLocaleString("en-US")}</>} label="Commercial rent / sqm a year" size="focal" accent />
          {ladder.length > 1 ? (
            <div className="mt-3 flex items-center gap-2.5">
              <Spark values={ladder} markerIndex={markerIndex} w={110} />
              <span className="text-[11px] leading-tight text-[var(--c-muted)]">vs peers</span>
            </div>
          ) : null}
        </div>
        <div className="divide-y divide-[var(--c-border)]">
          {support.map(([v, l]) => <div key={l} className="py-2.5"><Fig className="text-[18px] text-[var(--c-ink)]">{v}</Fig><div className="mt-0.5 text-[11px] leading-tight text-[var(--c-ink2)]">{l}</div></div>)}
        </div>
      </div>
      {p.lease_years_typical ? (
        <InlineDisclosure name="lease" summary={`The lease behind the rent: ${p.lease_years_typical} years typical`}>
          <div className="mt-2 divide-y divide-[var(--c-border)]">
            <KV k="Term" v={`${p.lease_years_typical} years, ${p.deposit_months} months deposit`} />
            <KV k="Break clause" v={p.break_clause} />
            <KV k="Rent-free" v={`${p.rent_free_months} months at the start`} />
          </div>
        </InlineDisclosure>
      ) : null}
    </Box>
  );
}
/*
 * Financing , where the money to start comes from.
 * verdict: Raising is easier here than in most peers, but banks still want security.
 * focal: the ease-of-raising meter (the one-glance read).
 * width: Even , peer to Grants.
 * terracotta: the ease meter fill only.
 */
function Financing({ d }: { d: any }) {
  const f = d.financing ?? {};
  return (
    <Box><Head icon="calculator">Where the money comes from</Head>
      <div className="mb-4"><div className="flex items-baseline gap-2"><span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Ease of raising money</span><Fig className="text-[var(--terra-text)]">{f.ease_0_100}/100</Fig></div><div className="mt-1.5"><Meter value={f.ease_0_100} left="Hard" right="Easy" /></div></div>
      <div className="divide-y divide-[var(--c-border)]">{(f.sources ?? []).map((s: any) => <div key={s.name} className="py-2"><div className="text-[13px] font-medium text-[var(--c-ink)]">{s.name}</div><div className="text-[11.5px] text-[var(--c-ink2)]">{s.note}</div></div>)}</div>
    </Box>
  );
}
/*
 * Grants , the named incentives worth knowing.
 * verdict: A mix of a rebate, a backed loan and two competitive grants; none are automatic.
 * focal: the amount per scheme; each expands to what it is and how it actually pays out.
 * width: Even , peer to Financing.
 * terracotta: the amount figure per row only.
 */
function Grants({ d }: { d: any }) {
  return (
    <Box><div className="mb-3 flex items-center gap-2"><Ico id="free-zone" /><span className="text-[15px] font-semibold text-[var(--c-ink)]">Grants and incentives</span><ConfidenceDot /></div>
      <div className="space-y-2">{(d.grants?.list ?? []).map((g: any, i: number) => (
        <Expand key={i} name="grants" title={g.name} open={i === 0} right={<Fig className="text-[13px] text-[var(--terra-text)]">{g.value}</Fig>}>
          <div className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1"><span className="rounded-full bg-[var(--c-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{g.kind}</span><span className="text-[11.5px] text-[var(--c-ink2)]">For {(g.who || "").toLowerCase()}</span></div>
          {g.note}
        </Expand>))}
      </div>
    </Box>
  );
}

/* ================= CHAPTER 4 ================= */
/*
 * SpendDonut , where a household's money goes (retired doughnut -> zero-baseline bars).
 * verdict: A big chunk is discretionary, the spend a new business can win.
 * focal: the discretionary share, called out big, then a ranked share-of-spend bar list.
 * width: Even , paired peer to Income.
 * terracotta: the discretionary bar only (one accent per box).
 * NOTE: was a doughnut whose largest wedge was "Other", which broke the single-
 * dominant-slice rule. Recast to ranked horizontal bars from a zero baseline.
 */
function SpendDonut({ d }: { d: any }) {
  const hs: any[] = d.income?.household_spend ?? []; const get = (c: string) => hs.find((x) => x.category === c)?.pct ?? 0;
  const disc = Math.round(get("recreation") + get("dining_out"));
  const rows: Array<[string, number]> = [
    ["Housing & utilities", get("housing_utilities")],
    ["Transport", get("transport")],
    ["Food & drink", get("food_drink")],
    ["Discretionary", disc],
    ["Other", Math.round(get("household_goods") + get("other"))],
  ].sort((a, b) => (b[1] as number) - (a[1] as number)) as Array<[string, number]>;
  const waterfallRows: Array<[string, number, boolean?]> = rows.map(([n, pct]) => [n, pct, n === "Discretionary"]);
  return (
    <Box><Head icon="cost-breakdown">Where a household&apos;s money goes</Head>
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <Fig className="text-[26px] leading-none text-[var(--terra-text)]">{disc}%</Fig>
        <span className="text-[13px] text-[var(--c-ink2)]">is discretionary, the spend a new business can win.</span>
      </div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Share of monthly spend</div>
      <Waterfall rows={waterfallRows} />
      <InlineDisclosure name="spend" className="group mt-3 border-t border-[var(--c-border)] pt-2.5" summary="What counts as discretionary">
        <div className="mt-2 space-y-1">{[["Recreation and culture", get("recreation")], ["Eating out", get("dining_out")]].map(([n, p]: any) => <div key={n} className="flex items-center justify-between text-[11.5px] text-[var(--c-ink2)]"><span>{n}</span><Fig className="text-[var(--c-ink)]">{p}%</Fig></div>)}</div>
      </InlineDisclosure>
    </Box>
  );
}

/*
 * Seasonality , how demand moves across the year.
 * verdict: A clear run-up into the peak month; the quiet stretch is the cash-flow test.
 * focal: a baselined 12-column year (floor below the quietest month, peak picked out terra).
 * width: Even , peer to SectorMix, equal class.
 * terracotta: the single peak column only.
 */
function Seasonality({ d }: { d: any }) {
  const months: number[] = d.seasonality?.months ?? [];
  const labels = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  if (months.length !== 12) return null;
  const min = Math.min(...months), max = Math.max(...months);
  const floor = Math.max(0, min - (max - min) * 0.35); // baseline sits below the quietest month
  const span = max - floor || 1;
  const peakIdx = months.indexOf(max);
  const troughIdx = months.indexOf(min);
  return (
    <Box className="relative"><div className="absolute right-5 top-5"><ConfidenceDot /></div>
      <Rail icon="spending-power" kicker="Demand across the year" verdict={<>Trade builds into a <b className="text-[var(--c-ink)]">{["January","February","March","April","May","June","July","August","September","October","November","December"][peakIdx]}</b> peak; the quiet start is the cash-flow test.</>} />
      <div className="flex h-[120px] items-end gap-1.5" role="img" aria-label={`Monthly demand index, peak in month ${peakIdx + 1}, lowest in month ${troughIdx + 1}`}>
        {months.map((v, i) => {
          const hPct = ((v - floor) / span) * 100;
          const peak = i === peakIdx;
          return (
            <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1.5" style={{ height: "100%" }}>
              <div className="flex w-full flex-1 items-end">
                <div className="w-full rounded-t-[3px]" style={{ height: `${Math.max(4, hPct)}%`, background: peak ? TERRA : "#cfc8c3" }} title={`${labels[i]} ${v}`} />
              </div>
              <span className={`text-[9.5px] ${peak ? "font-semibold text-[var(--terra-text)]" : "text-[var(--c-muted)]"}`}>{labels[i]}</span>
            </div>
          );
        })}
      </div>
    </Box>
  );
}

/*
 * SectorMix , the shape of the economy you are entering.
 * verdict: A services-led economy; making things is a small slice.
 * focal: ranked bars (position/length) so the services dominance reads at a glance.
 * width: Even , peer to Seasonality, equal class. Bars here hold the 2-donut budget.
 * terracotta: the leading (services) bar only, via RankBars.
 */
function SectorMix({ d }: { d: any }) {
  const sectors: any[] = (d.sector_mix?.sectors ?? []).slice().sort((a: any, b: any) => b.pct - a.pct);
  const lead = sectors[0];
  const rows = sectors.map((s: any) => ({ id: s.name, label: s.name, value: s.pct, display: `${s.pct}%` }));
  return (
    <Box className="relative"><div className="absolute right-5 top-5"><ConfidenceDot /></div>
      <Rail icon="cost-breakdown" kicker="The shape of the economy" verdict={<>A <b className="text-[var(--c-ink)]">{lead?.name?.toLowerCase()}</b>-led economy; making things is a small slice of the whole.</>} />
      <RankBars rows={rows} max={100} valueUnit="%" leaderId={lead?.name} />
    </Box>
  );
}

/*
 * RiskRegister , what could go wrong, scored and ranked.
 * verdict: One risk towers over the rest; the rest are ordinary trading risk.
 * focal: the top-scored risk named, leading a Dots leaderboard sorted by score.
 * width: Even , peer to Exit, equal class.
 * terracotta: the top risk's dots only (the rest are neutral via the Dots track).
 */
function RiskRegister({ d }: { d: any }) {
  const risks = (d.risk_exit?.risks ?? []).slice().sort((a: any, b: any) => (b.score_1_10 ?? 0) - (a.score_1_10 ?? 0));
  const label: any = { energy_input_costs: "Energy & input costs", rule_tax_changes: "Rule & tax changes", demand_cycle: "Demand cycle", currency_swings: "Currency swings", skills_shortages: "Skills shortages" };
  const top = risks[0];
  return (
    <Box>
      <Rail icon="watch" kicker="What could go wrong" verdict={top ? <>One risk towers over the rest: <b className="text-[var(--c-ink)]">{(label[top.name] ?? top.name).toLowerCase()}</b>. The rest are ordinary.</> : "Risks are spread evenly."} />
      <div className="space-y-2.5">{risks.map((r: any, i: number) => (
        <div key={r.name} className="hov -mx-2 grid grid-cols-[150px_1fr_auto] items-center gap-3 rounded-md px-2 py-1">
          <span className="min-w-0 truncate text-[12.5px] text-[var(--c-ink2)]">{label[r.name] ?? r.name}{i === 0 ? <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--terra-text)]">highest</span> : null}</span>
          <div className={i === 0 ? "" : "opacity-60"}><Dots score={r.score_1_10} max={10} accent={i === 0} /></div>
          <Fig className="w-9 text-right text-[12.5px] text-[var(--c-ink)]">{r.score_1_10}/10</Fig>
        </div>))}
      </div>
    </Box>
  );
}

/*
 * Income , what customers earn.
 * verdict: A comfortable median customer, but the top of the market pulls far ahead.
 * focal: the median earner figure (the customer who actually walks in).
 * width: Even , peer to SpendDonut, equal class.
 * terracotta: the median focal Stat only (the rungs are neutral lollipop points).
 */
function Income({ d }: { d: any }) {
  const o = d.income ?? {};
  const rungs: Array<[string, number, boolean]> = [["Median earner", o.median_income_usd, true], ["Top 10%", o.top10_income_usd, false], ["Top 1%", o.top1_income_usd, false]];
  const max = Math.max(...rungs.map(([, v]) => v || 0)) || 1;
  const bands = ["very_equal", "fairly_equal", "moderate", "high", "very_high"]; const gi = bands.indexOf(o.gini_band);
  return (
    <Box>
      <Rail icon="spending-power" kicker="What customers earn" verdict="A comfortable median customer, but the top pulls far ahead of the middle." />
      <div className="focal mb-3 flex items-end justify-between p-4">
        <Stat value={<>${Math.round((o.median_income_usd || 0) / 1000)}K</>} label="Median earner" size="focal" accent />
        <div className="text-right text-[11px] leading-tight text-[var(--c-muted)]">the customer<br />who walks in</div>
      </div>
      {/* Lollipop rows: neutral track with a dot at each earner's position, so the
          three rungs read as points on one income axis (not a fourth bar idiom).
          The terra accent stays on the focal median Stat above. */}
      <div className="space-y-2.5">{rungs.map(([l, v]) => {
        const pos = Math.max(2, Math.min(100, ((v || 0) / max) * 100));
        return (
          <div key={l} className="grid grid-cols-[88px_1fr_44px] items-center gap-2.5">
            <span className="min-w-0 truncate text-[12px] text-[var(--c-ink2)]">{l}</span>
            <div className="relative h-2 rounded-full" style={{ background: "#f0f0f0" }}>
              <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${pos}%`, background: "#e0dcd8" }} />
              <span className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${pos}%`, background: "#8f8a86", boxShadow: "0 0 0 1px #e3e3e3" }} />
            </div>
            <Fig className="text-right text-[12px] text-[var(--c-ink)]">${Math.round((v || 0) / 1000)}K</Fig>
          </div>
        );
      })}
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-[var(--c-border)] pt-3"><div className="flex gap-1">{bands.map((b, i) => <span key={b} className="h-1.5 w-6 rounded-sm" style={{ background: i === gi ? "#8f8a86" : "#e3e3e3" }} />)}</div><span className="text-[11.5px] text-[var(--c-ink2)]">{cap((o.gini_band ?? "").replace("_", " "))} spread between earners</span></div>
    </Box>
  );
}
/*
 * Neighbours , how the country compares with its peer set.
 * verdict: Leads its neighbours on some setup costs, trails on others; read the row that matters to you.
 * focal: the compare table; best-in-column bold + terracotta, home row tinted never ranked.
 * width: Full , a compare table reads across the column.
 * terracotta: the best cell per column only. Pro seam: pick your own comparison set.
 */
function Neighbours({ d }: { d: any }) {
  const cols = [
    { key: "tax", label: "Business tax", unit: "%", get: (x: any) => x.tax_burden?.total_pct, cell: (v: number) => "" + Math.round(v), lowGood: true },
    { key: "reg", label: "Cost to register", unit: "$", get: (x: any) => x.costs?.license_setup_usd, cell: (v: number) => Math.round(v).toLocaleString("en-US"), lowGood: true },
    { key: "days", label: "Time to register", unit: "days", get: (x: any) => x.setup?.total_days, cell: (v: number) => "" + v, lowGood: true },
    { key: "vat", label: "VAT", unit: "%", get: (x: any) => x.tax_burden?.vat_rate_pct, cell: (v: number) => "" + v, lowGood: true },
    { key: "energy", label: "Energy", unit: "$/kWh", get: (x: any) => x.costs?.energy_usd_per_kwh, cell: (v: number) => "" + (Math.round(v * 100) / 100), lowGood: true },
  ];
  const codes = ["GB", ...(d.meta?.peer_set ?? [])];
  const raw = codes.map((code) => { let j: any = null; try { j = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "../page-data/countries/" + code + ".json"), "utf8")); } catch (e) { } return j ? { code, home: code === "GB", name: j.meta?.name ?? code, vals: cols.map((c) => c.get(j)) } : null; }).filter(Boolean) as any[];
  const best = cols.map((c, i) => { const xs = raw.map((r) => r.vals[i]).filter((v: any) => v != null); return c.lowGood ? Math.min(...xs) : Math.max(...xs); });
  const home = raw.find((r) => r.home);
  const wins = cols.filter((c, i) => home && home.vals[i] === best[i]).map((c) => c.label.toLowerCase());
  const loses = cols.filter((c, i) => { const xs = raw.map((r) => r.vals[i]).filter((v: any) => v != null); const worst = c.lowGood ? Math.max(...xs) : Math.min(...xs); return home && home.vals[i] === worst; }).map((c) => c.label.toLowerCase());
  const colDefs = cols.map((c) => ({ key: c.key, label: c.label, unit: c.unit }));
  const tableRows = raw.map((r) => ({ name: r.name, home: r.home, cells: r.vals.map((v: number, i: number) => ({ raw: v ?? null, display: v == null ? "-" : cols[i].cell(v), best: v != null && v === best[i] })) }));
  return (
    <Box><Head icon="compare">How it compares, country by country</Head>
      {wins.length || loses.length ? <div className="mb-3 text-[12.5px] text-[var(--c-ink2)]">{d.meta?.name} leads its peers on <b className="text-[var(--terra-text)]">{wins.join(", ") || "none yet"}</b>{loses.length ? <>, and trails on <b className="text-[var(--c-ink)] underline decoration-[var(--c-line-strong)] underline-offset-2">{loses.join(", ")}</b></> : null}.</div> : null}
      <NeighboursTable cols={colDefs} rows={tableRows} />
      <div className="mt-2 text-[11px] text-[var(--c-muted)]">Best in each column is bold. Click a header to sort.</div>
      {/* Pro seam: the fixed peer set is free; choosing your own comparison set is the paid move. */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dashed border-[var(--terra-border)] bg-[var(--terra-soft)] px-3 py-2.5">
        <span className="text-[12px] text-[var(--c-ink2)]">Set {d.meta?.name} against up to three countries you pick. <LockPill /></span>
        <a className="shrink-0 cursor-pointer rounded-full bg-[var(--c-ink)] px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-[var(--terra-text)]">Open Compare &#8594;</a>
      </div>
    </Box>
  );
}

/*
 * Competition , how crowded the market is.
 * verdict: The cafe trade is the single most crowded; cleaning still has room.
 * focal: the most-crowded trade named, with its saturation as the one big figure.
 * width: Even , peer to AdminLoad, equal class.
 * terracotta: the focal trade's saturation bar only.
 */
function Competition({ d }: { d: any }) {
  const arr = (d.competition?.trades ?? []).slice().sort((a: any, b: any) => b.saturation_0_100 - a.saturation_0_100);
  const top = arr[0];
  const rest = arr.slice(1);
  const word = (s: number) => (s > 70 ? "Crowded" : s > 50 ? "Busy" : "Room");
  return (
    <Box className="relative"><div className="absolute right-5 top-5"><ConfidenceDot /></div><Rail icon="competition" kicker="How crowded the market is" verdict={top ? <>The <b className="text-[var(--c-ink)]">{top.name.toLowerCase()}</b> trade is most crowded; quieter trades still have room.</> : "Crowding varies by trade."} />
      {top ? (
        <div className="focal mb-3 flex items-end justify-between p-4">
          <Stat value={<>{top.saturation_0_100}<span className="text-[16px] text-[var(--c-muted)]">/100</span></>} label={`${top.name} , most crowded`} size="focal" accent />
          <span className="rounded-full border border-[var(--terra-border)] bg-[var(--terra-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--terra-text)]">{word(top.saturation_0_100)}</span>
        </div>
      ) : null}
      <div className="space-y-2">{rest.map((t: any) => (
        <div key={t.name} className="hov -mx-2 grid grid-cols-[130px_1fr_56px] items-center gap-3 rounded-md px-2 py-1"><span className="min-w-0 truncate text-[12.5px] text-[var(--c-ink2)]">{t.name}</span><div className="h-[7px] w-full min-w-0 overflow-hidden rounded-full" style={{ background: TRACK }}><div className="h-full rounded-full" style={{ width: `${t.saturation_0_100}%`, background: "#bdbdbd" }} /></div><span className="text-right text-[11.5px] text-[var(--c-ink2)]">{word(t.saturation_0_100)}</span></div>))}
      </div>
    </Box>
  );
}

/*
 * AdminLoad , the admin burden.
 * verdict: A light, mostly-online admin load once you are set up.
 * focal: hours-per-year, with the online share and filings count beside it.
 * width: Even , peer to Competition, equal class.
 * terracotta: the focal hours figure only.
 */
function AdminLoad({ d }: { d: any }) {
  const a = d.admin_load ?? {};
  return (
    <Box className="relative"><div className="absolute right-5 top-5"><ConfidenceDot /></div><Rail icon="red-tape" kicker="The admin load" verdict="A light, almost-all-online admin load once the company is set up." />
      <div className="focal mb-3 flex items-end justify-between p-4">
        <Stat value={<>{a.hours_per_year}<span className="text-[16px] text-[var(--c-muted)]">h</span></>} label="A year on admin" sub={`${a.filings_per_year} filings a year`} size="focal" accent />
        <div className="text-right">
          <Fig className="text-[20px] text-[var(--c-ink)]">{a.online_pct}%</Fig>
          <div className="text-[10.5px] uppercase tracking-wide text-[var(--c-muted)]">done online</div>
        </div>
      </div>
      <Bullets items={a.bullets ?? []} />
    </Box>
  );
}

/* ================= CHAPTER 5 ================= */
/*
 * Cities , the main business cities, ranked by market size, with the real map folded in
 * (the old separate CitiesMap band merged here so the places story is ONE band, not two).
 * verdict: The capital dwarfs the rest; the strongest regional markets are the next move.
 * focal: the ranked conveyor, then every city placed on the map below it.
 * width: Full , conveyor over map. terracotta: the per-card index bar + map dots only.
 */
function Cities({ d }: { d: any }) {
  const list = (d.cities?.list ?? []).slice().sort((a: any, b: any) => (b.market_index_vs_capital ?? 0) - (a.market_index_vs_capital ?? 0));
  const cards = list.map((c: any) => (
    <a key={c.slug} href="#" className="cityhov group block w-full cursor-pointer overflow-hidden rounded-lg border border-[var(--c-border)] bg-[var(--c-card)]">
      <div className="flex aspect-[16/8] items-center justify-center bg-[var(--c-soft)] text-[#cfcfcf]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 21h18M5 21V7l5-3v17M19 21V11l-5-3" /></svg></div>
      <div className="px-3 py-2.5">
        <div className="text-[13px] font-semibold text-[var(--c-ink)] group-hover:text-[var(--terra-text)]">{c.name}</div>
        <div className="truncate text-[11px] text-[var(--c-ink2)]">{c.character}</div>
        {typeof c.market_index_vs_capital === "number" ? (
          <div className="mt-2 flex items-center gap-2">
            <MiniBar pct={c.market_index_vs_capital} />
            <Fig className="shrink-0 text-[10.5px] text-[var(--c-muted)]">{c.market_index_vs_capital}</Fig>
          </div>
        ) : null}
      </div>
    </a>
  ));
  const points: SpinePoint[] = list
    .filter((c: any) => typeof c.lat === "number" && typeof c.lng === "number")
    .map((c: any) => ({ name: c.name, slug: c.slug, lat: c.lat, lng: c.lng, signal: c.market_index_vs_capital, sub: c.character, href: c.slug === "london" ? "/dev/spine-city" : undefined }));
  return (
    <Box>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2"><Ico id="neighborhood" /><span className="text-[15px] font-semibold text-[var(--c-ink)]">The main cities, placed</span></div>
        <a href="/countries" className="shrink-0 cursor-pointer rounded-full border border-[var(--c-border)] px-3 py-1 text-[12px] font-semibold text-[var(--terra-text)] transition hover:border-[var(--terra-border)] hover:bg-[var(--terra-soft)]">Open the directory &#8594;</a>
      </div>
      <Conveyor ariaLabel="The main cities" itemMinPx={150} gapPx={12}>{cards}</Conveyor>
      <div className="mt-3"><SpineMap points={points} ariaLabel="Map of the main UK business cities" fitPadding={70} /></div>
      <div className="mt-2.5 text-[11px] text-[var(--c-muted)]">Bar and dot size = market reach against the capital (100). London opens its own page.</div>
    </Box>
  );
}
/*
 * EasiestTrades , which trades are easiest to start and what they cost.
 * verdict: The lightest trades open cheap; the hardest need real capital before day one.
 * focal: ONE ranked ease list (position/length), easiest first, cost as the right figure.
 * width: Even , peer to Insurance/SellingAbroad in CH5.
 * terracotta: the single easiest trade only.
 */
function EasiestTrades({ d }: { d: any }) {
  const list = (d.trades_to_start?.list ?? []).slice().sort((a: any, b: any) => a.hardship_0_100 - b.hardship_0_100);
  // Ordered ease list (a numbered lollipop, not a fourth terracotta bar-tip idiom):
  // the ease value marks a dot on one shared axis, cost sits as the right figure.
  // Terra marks only the single easiest trade (one accent per box).
  const rows = list.map((t: any) => ({ name: t.name, ease: 100 - (t.hardship_0_100 ?? 0), cost: `$${Math.round((t.cost_to_open_usd ?? 0) / 1000)}K` }));
  return (
    <Box><div className="mb-3 flex items-center gap-2"><Ico id="best-areas" /><span className="text-[15px] font-semibold text-[var(--c-ink)]">Easiest trades to start</span><ConfidenceDot /></div>
      <div className="mb-2 flex justify-between text-[10px] uppercase tracking-wide text-[var(--c-muted)]"><span>Further right is easier</span><span>Cost to open</span></div>
      <div className="space-y-2.5">{rows.map((r: any, i: number) => {
        const first = i === 0;
        const pos = Math.max(3, Math.min(97, r.ease));
        return (
          <div key={r.name} className="hov -mx-2 grid grid-cols-[24px_140px_1fr_44px] items-center gap-2.5 rounded-md px-2 py-1">
            <span className="fig text-[11px] text-[var(--c-muted)]">{i + 1}.</span>
            <span className={`min-w-0 truncate text-[12.5px] ${first ? "font-semibold text-[var(--terra-text)]" : "text-[var(--c-ink2)]"}`}>{r.name}</span>
            <div className="relative h-2 rounded-full" role="img" aria-label={`${r.name}: ease ${Math.round(r.ease)} of 100`} style={{ background: "#f0f0f0" }}>
              <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${pos}%`, background: first ? "var(--terra-soft)" : "#e0dcd8" }} />
              <span className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${pos}%`, background: first ? TERRA : "#8f8a86", boxShadow: "0 0 0 1px #e3e3e3" }} />
            </div>
            <Fig className="text-right text-[12px] text-[var(--c-ink)]">{r.cost}</Fig>
          </div>
        );
      })}
      </div>
    </Box>
  );
}
/*
 * Insurance , the covers a business carries and what they run.
 * verdict: Only employers' liability is compulsory; the rest are client or landlord demands.
 * focal: the typical annual cost per cover; each expands to what it covers and who needs it.
 * width: Full , a denser cover list.
 * terracotta: the "required" chip only.
 */
function Insurance({ d }: { d: any }) {
  const covers = d.insurance?.covers ?? [];
  return (
    <Box><div className="mb-3 flex items-center gap-2"><Ico id="watch" /><span className="text-[15px] font-semibold text-[var(--c-ink)]">Insurance the business carries</span><ConfidenceDot /></div>
      <div className="space-y-2">{covers.map((c: any, i: number) => (
        <Expand key={i} name="insurance" title={c.name} open={i === 0} right={<span className="flex items-center gap-2">{c.required ? <span className="rounded-full bg-[var(--terra-soft)] px-2 py-0.5 text-[9px] font-semibold uppercase text-[var(--terra-text)]">required</span> : null}<Fig className="text-[13px] text-[var(--c-ink)]">${c.typical_usd}<span className="text-[10px] text-[var(--c-muted)]">/yr</span></Fig></span>}>
          <div className="grid gap-1.5 sm:grid-cols-2">
            <div><div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Covers</div><div className="text-[12.5px] text-[var(--c-ink2)]">{c.covers}</div></div>
            <div><div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Who needs it</div><div className="text-[12.5px] text-[var(--c-ink2)]">{c.who}</div></div>
          </div>
          <div className="mt-2 border-t border-[var(--c-border)] pt-2 text-[12px] text-[var(--c-ink2)]">{c.note}</div>
        </Expand>))}
      </div>
    </Box>
  );
}
/*
 * SellingAbroad , how open the country is to exporters and where it sells.
 * verdict: An open trading economy; its biggest export markets are a short list of neighbours.
 * focal: the openness verdict word, then the top export markets by share.
 * width: Even , paired peer to EasiestTrades in CH5.
 * terracotta: the openness verdict word only.
 */
function SellingAbroad({ d }: { d: any }) {
  const e = d.exporting ?? {};
  const verdict = e.openness_0_100 >= 70 ? "Open" : e.openness_0_100 >= 45 ? "Moderate" : "Closed";
  return (
    <Box><div className="mb-3 flex items-center gap-2"><Ico id="vs-world" /><span className="text-[15px] font-semibold text-[var(--c-ink)]">Selling abroad</span><ConfidenceDot /></div>
      <div className="mb-3 flex items-baseline gap-2"><span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Export openness</span><Fig className="text-[18px] text-[var(--terra-text)]">{verdict}</Fig><span className="ml-1.5 text-[12px] text-[var(--c-muted)]">{e.openness_0_100} of 100</span></div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Top markets</div>
      <div className="mt-1.5 divide-y divide-[var(--c-border)]">{(e.partners ?? []).map((p: any) => <div key={p.name} className="hov -mx-2 flex items-center justify-between rounded-md px-2 py-1"><span className="text-[12.5px] text-[var(--c-ink)]">{p.name}</span><Fig className="text-[12.5px] text-[var(--c-ink)]">{p.pct}%</Fig></div>)}</div>
    </Box>
  );
}
/*
 * Character , the two colored spectra (gov-business + culture-outsider). KEPT as the two
 * agreed 6-spectra tables per the founder's density note.
 * verdict: A clean, rules-led place to deal with; reserved and direct to work in.
 * focal: the marker position on each spectrum; the eye reads the lean at a glance.
 * width: Full , two spectra columns side by side.
 * terracotta: none (the spectra gradients carry the scale; markers are ink).
 */
function Character({ d }: { d: any }) {
  return (
    <Box>
      <Head icon="corruption">The character of the place</Head>
      <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
        <div>
          <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Government, from a business view</div>
          <Spectrum rows={d.character?.gov_business ?? []} />
        </div>
        <div>
          <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Culture, from an outsider view</div>
          <Spectrum rows={d.character?.culture_outsider ?? []} />
        </div>
      </div>
    </Box>
  );
}
/*
 * Locals , the practical intel an operator learns on the ground (fully free honesty layer).
 * verdict: A handful of things new owners get wrong; locals price them in from the start.
 * focal: each intel item as a titled line; no chart, this is plain operator knowledge.
 * width: Full , a two-column note grid.
 * terracotta: the leading marker glyph only.
 */
function Locals({ d }: { d: any }) {
  const items = d.character?.locals_intel ?? [];
  if (!items.length) return null;
  return (
    <Box><Head icon="locals-know">What locals know</Head>
      <div className="grid gap-x-7 gap-y-3 sm:grid-cols-2">{items.map((it: any, i: number) => (
        <div key={i} className="flex gap-2.5"><span className="mt-0.5 text-[var(--terra-text)]">&#9656;</span><span className="text-[12.5px] leading-snug text-[var(--c-ink2)]"><b className="text-[var(--c-ink)]">{it.title}</b> {it.detail}</span></div>))}
      </div>
    </Box>
  );
}
/*
 * Exit , how sellable the business is when you want out.
 * verdict: An active resale market; a clean small firm sells inside a year at a modest multiple.
 * focal: a slim Easy-to-Hard meter (retires the gauge form), with time + multiple beside it.
 * width: Even , peer to RiskRegister.
 * terracotta: the meter fill only.
 */
function Exit({ d }: { d: any }) {
  const e = d.risk_exit?.exit ?? {};
  return (
    <Box><Head icon="compare">How sellable a business is</Head>
      <div className="focal mb-3 p-3.5">
        <div className="mb-1 flex items-baseline justify-between"><span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">How easy to sell</span><Fig className="text-[18px] capitalize text-[var(--terra-text)]">{e.climate}</Fig></div>
        <Meter value={e.climate_score_0_100} left="Hard" right="Easy" />
      </div>
      <div className="grid grid-cols-2 gap-3 border-b border-[var(--c-border)] pb-3">
        <div><div className="text-[10.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Time to sell</div><Fig className="text-[16px] text-[var(--c-ink)]">{e.time_to_sell_months_low}-{e.time_to_sell_months_high} mo</Fig></div>
        <div><div className="text-[10.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Sale price</div><Fig className="text-[16px] text-[var(--c-ink)]">{e.multiple_low}-{e.multiple_high}x</Fig><span className="text-[11px] text-[var(--c-ink2)]"> profit</span></div>
      </div>
      <div className="mt-3"><Bullets items={e.bullets ?? []} /></div>
    </Box>
  );
}

/*
 * Employment , the rules of working here.
 * verdict: Generous holiday and a low-union, flexible-contract regime for employers.
 * focal: the paid-holiday-days figure (the headline employees feel).
 * width: Even , peer to Closing, equal class.
 * terracotta: the focal holiday figure only.
 */
function Employment({ d }: { d: any }) {
  const e = d.employment ?? {};
  return (
    <Box className="relative"><div className="absolute right-5 top-5"><ConfidenceDot /></div><Rail icon="hiring" kicker="Working here, the rules" verdict="Generous statutory holiday, but flexible contracts and a low-union workforce favour employers." />
      <div className="focal mb-3 flex items-end justify-between p-4">
        <Stat value={<>{e.holiday_days}</>} label="Paid holiday days a year" size="focal" accent />
        <div className="text-right"><Fig className="text-[20px] text-[var(--c-ink)]">{e.union_pct}%</Fig><div className="text-[10.5px] uppercase tracking-wide text-[var(--c-muted)]">in a union</div></div>
      </div>
      <CatRows rows={[["Working hours", e.hours], ["Sick pay", e.sick_pay], ["Maternity leave", e.maternity], ["Notice period", e.notice], ["Dismissal", e.dismissal]]} />
      <div className="mt-3 border-t border-[var(--c-border)] pt-3"><Bullets items={e.bullets ?? []} /></div>
    </Box>
  );
}

/*
 * Closing , getting out if it does not work.
 * verdict: Winding down is manageable; a solvent micro-firm just strikes off cheaply.
 * focal: the one-glance ease band (Manageable / Some friction / Hard).
 * width: Even , peer to Employment, equal class.
 * terracotta: the focal ease band only.
 */
function Closing({ d }: { d: any }) {
  const c = d.closing ?? {}; const verdict = c.ease_0_100 >= 65 ? "Manageable" : c.ease_0_100 >= 40 ? "Some friction" : "Hard";
  return (
    <Box className="relative"><div className="absolute right-5 top-5"><ConfidenceDot /></div><Rail icon="honest-take" kicker="If it doesn't work, getting out" verdict="Winding down is manageable: a solvent micro-firm just strikes off cheaply." />
      <div className="focal mb-3 flex items-end justify-between p-4">
        <Stat value={verdict} label="To wind down" size="focal" accent />
        <div className="flex gap-5 text-right">
          <div><Fig className="text-[18px] text-[var(--c-ink)]">{c.time_months}</Fig><div className="text-[10.5px] uppercase tracking-wide text-[var(--c-muted)]">months</div></div>
          <div><Fig className="text-[18px] text-[var(--c-ink)]">{c.cost_pct}%</Fig><div className="text-[10.5px] uppercase tracking-wide text-[var(--c-muted)]">of assets</div></div>
        </div>
      </div>
      <CatRows rows={[["If solvent", c.solvent], ["If insolvent", c.insolvent], ["Your liability", c.liability]]} />
      <div className="mt-3 border-t border-[var(--c-border)] pt-3"><Bullets items={c.bullets ?? []} /></div>
    </Box>
  );
}
/* Close , the deliberate full-width capstone. Points down into the deeper pages
 * (city, then a real trade), the natural next reads. The Compare CTA is dropped
 * here: the Neighbours compare table already carries the "Open Compare" move, so
 * repeating it would be a second identical call to action. */
function Close({ d }: { d: any }) {
  const city = d.cities?.list?.[0];
  const links = [
    { t: `${city?.name}, the deepest ${d.meta?.name} market`, href: city?.slug === "london" ? "/dev/spine-city" : undefined },
    { t: `What a restaurant in ${city?.name} actually keeps`, href: "/dev/spine-cell" },
  ];
  return (
    <Box className="flex flex-col items-start gap-4">
      <Head icon="bookmark">Where to go from here</Head>
      <p className="max-w-[62ch] text-[13.5px] leading-snug text-[var(--c-ink2)]">You have the country picture: the margin, the setup, the costs and the market. The decision gets sharper one level down, in a single city and then a single trade.</p>
      <div className="grid w-full gap-2.5 sm:grid-cols-2">
        {links.map((l, i) => {
          const Tag: any = l.href ? "a" : "div";
          return (
            <Tag key={i} href={l.href} className="cityhov group flex items-center justify-between gap-3 rounded-xl border border-[var(--c-border)] bg-[var(--c-card)] px-4 py-3.5">
              <span className="text-[13.5px] font-semibold text-[var(--c-ink)] group-hover:text-[var(--terra-text)]">{l.t}</span>
              <span className="shrink-0 text-[var(--terra-text)]">&#8594;</span>
            </Tag>
          );
        })}
      </div>
    </Box>
  );
}

/* ---------- new sections (Leg 0) ---------- */
/*
 * DigitalPayments , how customers pay and how ready the plumbing is.
 * verdict: A card-first, fast-settling market on solid infrastructure.
 * focal: the payment-method split bar, then card fee, settlement and connectivity tiles.
 * width: Full , a split bar beside a small tile grid.
 * terracotta: the card slice of the method bar only.
 */
function DigitalPayments({ d }: { d: any }) {
  const p = d.payments ?? {}; const inf = d.infrastructure ?? {};
  const methods: any[] = p.methods ?? [];
  const mcolor: any = { "Card": TERRA, "Bank transfer": "#737373", "Cash": "#a3a3a3", "Digital wallet": "#d4d4d4" };
  const cardShare = methods.find((m: any) => m.name === "Card")?.pct;
  // Only the three tiles that touch margin and cash flow: how long card money takes
  // to settle, the fee it costs, and how much of retail is online. Broadband Mbps and
  // the generic reliability/logistics scores were unrelated trivia and were dropped.
  // settlement_days is free text ("1 to 3 days"), so it must NOT sit in the Fig number
  // slot (fig=false); the other two are real numbers and keep the figure treatment.
  const tiles: Array<[string, string, boolean]> = [
    [`${p.settlement_days ?? "-"}`, "for card money to settle", false],
    [`${p.card_fee_pct}%`, "typical card fee", true],
    [`${inf.ecommerce_pct}%`, "of retail is online", true],
  ];
  return (
    <Box><div className="mb-3 flex items-center gap-2"><Ico id="payments" /><span className="text-[15px] font-semibold text-[var(--c-ink)]">Getting paid, and the cash it costs</span><ConfidenceDot /></div>
      <p className="mb-4 max-w-[62ch] text-[13px] leading-snug text-[var(--c-ink2)]">A card-first market: {typeof cardShare === "number" ? <>about <b className="text-[var(--c-ink)]">{cardShare}%</b> of takings come by card, </> : null}so the <b className="text-[var(--c-ink)]">{p.card_fee_pct}%</b> fee and the wait for money to land are what actually touch your cash flow.</p>
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="md:w-[52%]">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">How customers pay</div>
          <StackBar h="h-9" segments={methods.map((m: any) => ({ label: m.name, pct: m.pct, color: mcolor[m.name] ?? "#ededed" }))} legend legendClassName="mt-2 flex flex-wrap gap-x-3 gap-y-1" ariaLabel={methods.map((m: any) => `${m.name} ${m.pct}%`).join(", ")} />
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-2.5">
            {tiles.map(([v, l, fig]) => <div key={l} className="hov rounded-lg border border-[var(--c-border)] p-3">{fig ? <Fig className="text-[18px] text-[var(--c-ink)]">{v}</Fig> : <div className="text-[14px] font-medium text-[var(--c-ink)]">{v}</div>}<div className="mt-0.5 text-[10.5px] leading-tight text-[var(--c-ink2)]">{l}</div></div>)}
          </div>
        </div>
      </div>
    </Box>
  );
}

/*
 * Licensing , the permits a trade needs before it opens.
 * verdict: Most trades start immediately; food, alcohol and childcare gate the opening.
 * focal: the lead-time chip per trade; a third context line says who inspects and what it gates.
 * width: Full , a denser permit list with three lines per row.
 * terracotta: none (ordinary reference section, ink tile).
 */
function Licensing({ d }: { d: any }) {
  const list = d.licensing?.list ?? [];
  const none = (s: string) => /^none$/i.test((s || "").trim());
  return (
    <Box><div className="mb-3 flex items-center gap-2"><Ico id="register-cost" /><span className="text-[15px] font-semibold text-[var(--c-ink)]">Licences and permits by trade</span><ConfidenceDot /></div>
      <div className="divide-y divide-[var(--c-border)]">{list.map((it: any, i: number) => (
        <div key={i} className="hov -mx-2 rounded-md px-2 py-2.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[13px] font-semibold text-[var(--c-ink)]">{it.trade}</span>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium ${none(it.licence) ? "bg-[var(--c-soft)] text-[var(--c-muted)]" : "border border-[var(--c-border)] text-[var(--c-ink2)]"}`}>{it.lead_time}</span>
          </div>
          <div className="mt-0.5 text-[12px] text-[var(--c-ink2)]">{none(it.licence) ? "No permit needed" : it.licence}</div>
          {it.context ? <div className="mt-1 text-[11.5px] leading-snug text-[var(--c-muted)]">{it.context}</div> : null}
        </div>))}
      </div>
    </Box>
  );
}
/*
 * Immigration , the visa routes a foreign founder can use.
 * verdict: The Skilled Worker route is the most attainable; the Innovator route is hardest.
 * focal: each route's marker on one Harder-to-Easier axis; the word matches the marker.
 * width: Even , paired peer to Licensing.
 * terracotta: the marker dots only (via EaseScale).
 */
function Immigration({ d }: { d: any }) {
  const routes = d.immigration?.routes ?? [];
  // position = ease (100 - difficulty): further RIGHT = easier. The WORD is read off the
  // SAME position so it can never contradict the marker (the old bug read the word off raw
  // difficulty). Rows are ordered easiest-first so the most attainable route leads.
  const word = (pos: number) => (pos >= 55 ? "Easier" : pos >= 35 ? "Moderate" : "Harder");
  const rows: Array<[string, number, string, string?]> = routes
    .map((r: any) => { const pos = Math.max(4, Math.min(96, 100 - (r.difficulty_0_100 ?? 50))); return [r.name, pos, word(pos), r.forwho] as [string, number, string, string?]; })
    .sort((a: [string, number, string, string?], b: [string, number, string, string?]) => b[1] - a[1]);
  return (
    <Box><div className="mb-3 flex items-center gap-2"><Ico id="airport" /><span className="text-[15px] font-semibold text-[var(--c-ink)]">Visa routes for a foreign founder</span><ConfidenceDot /></div>
      <div className="mb-5 mt-1 flex justify-between text-[10px] uppercase tracking-wide text-[var(--c-muted)]"><span>Harder to get</span><span>Easier to get</span></div>
      <EaseScale rows={rows} />
    </Box>
  );
}

export default function SpinePage() {
  const d = GB;
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-8 md:px-6">
      <Hero d={d} />

      {/* CH1 , the verdict. Chapter headings are all noun-phrases (one mood, authored not
          assembled). WideRail: the margin cost-base beside the six-lens scorecard; then the
          demand sizing paired with the ONE honesty band, both Full-class peers on an Even. */}
      <Movement eyebrow="The verdict" heading="The margin here" icon="gut-check" index="01" />
      <div className="space-y-5">
        <WideRail><MarginReality d={d} /><Profile d={d} /></WideRail>
        <Even><Demand d={d} /><TheCatch d={d} /></Even>
      </div>

      {/* CH2 , getting set up. ONE setup timeline (SetupStepper + First-90-Days merged into
          SetupTimeline), so the chapter runs Full timeline -> Even pair -> Full tax bars ->
          Even pair. No duplicate timeline, no fake-Gantt. */}
      <Movement eyebrow="Getting set up" heading="The cost and time to start" icon="register-cost" index="02" />
      <div className="space-y-5">
        <SetupTimeline d={d} />
        <Even><Formation d={d} /><Banking d={d} /></Even>
        <TaxByLevel d={d} />
        <Even><Licensing d={d} /><Immigration d={d} /></Even>
      </div>

      {/* CH3 , money and team. Wage ladder paired with hiring-ease so the chapter opens on a
          peer band, then the cost + financing pairs. No lone Full band here. */}
      <Movement eyebrow="The money and the team" heading="The cost of money and people" icon="wages" index="03" />
      <div className="space-y-5">
        <Even><PayByLevel d={d} /><TalentDepth d={d} /></Even>
        <Even><OperatingCosts d={d} /><HiringDials d={d} /></Even>
        <Even><Financing d={d} /><Grants d={d} /></Even>
      </div>

      {/* CH4 , the market. Even -> Even -> Even -> Full table -> Full payments band. */}
      <Movement eyebrow="The market and the rivals" heading="The customers and the rivals" icon="spending-power" index="04" />
      <div className="space-y-5">
        <Even><SpendDonut d={d} /><Income d={d} /></Even>
        <Even><Seasonality d={d} /><SectorMix d={d} /></Even>
        <Even><Competition d={d} /><AdminLoad d={d} /></Even>
        <Neighbours d={d} />
        <DigitalPayments d={d} />
      </div>

      {/* CH5 , places, trades, character. Cities + map are one hover-linked band (no second
          heading); then alternated forms: Even -> Full spectra -> Even -> Even -> Locals folded
          into the character band. Insurance folded to the SellingAbroad pair to cut a Full run. */}
      <Movement eyebrow="Places, trades and character" heading="The places and the character" icon="best-areas" index="05" />
      <div className="space-y-5">
        <Cities d={d} />
        <Even><EasiestTrades d={d} /><SellingAbroad d={d} /></Even>
        <Insurance d={d} />
        <Even><RiskRegister d={d} /><Exit d={d} /></Even>
        <Character d={d} />
        <Even><Employment d={d} /><Closing d={d} /></Even>
        <Locals d={d} />
      </div>

      {/* CH6 , the close. A deliberate full-width capstone ends the page (no dead
          end-of-page whitespace, no Narrow float). */}
      <Movement eyebrow="The close" heading="The next move" icon="bookmark" index="06" />
      <Close d={d} />
    </main>
  );
}
