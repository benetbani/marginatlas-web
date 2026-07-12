/**
 * Country page , SPINE rebuild (dev surface). Built to the LOCKED spine
 * (docs/superpowers/specs/2026-06-28-country-page-spine.md) on the SHARED kit.
 * Rules: Geist + Space Grotesk (.fig) numbers; soft terracotta (#fb8469) for fills only;
 * never a blank half-row (narrow parts are paired); progressive disclosure (headline shown,
 * detail behind a click); clean numerals; no per-country prose. The local Box/Head/Ico/
 * Movement/Row duplicates were deleted , every primitive now comes from @/components/spine/kit
 * so the shared foundation (two-zone band, premium Box, fixed Movement/Expand) reaches here.
 *
 * FINAL ASCENT P2 refit (2026-07-03, audit key "ctry"): the dot-on-rail monoculture is
 * rebalanced onto the Visual Dictionary (RailDots = the ONE page-local shared-axis dot
 * plot; Character's gradient rails are now neutral spectra tables; Immigration is a
 * single rail; HiringDials' depth row folded into TalentDepth), the opening cost bar
 * carries a visible legend, the seasonality bars became an honest line on a drawn zero
 * axis, NeighboursTable's best-in-column crowns exclude the home row, and per-card
 * confidence dots collapsed into the single masthead provenance line.
 *
 * RULEBOOK v1 refit (2026-07-11, §25 bar rationing + §5 unknowable-metric ban): the
 * MiniBar/Meter monoculture is cut back to the money decompositions and dials (tax
 * Waterfall, wage ladder, payment StackBar, hiring EaseScale); Profile reads as dot
 * scores, TalentDepth as the deep/thinner split list, Immigration as ONE shared rail,
 * EasiestTrades as a plain table (all July-3 approved forms); the three Meters became
 * figure + verdict word; the London take-home ranking is deleted (§5), its down-funnel
 * links surviving as plain cards.
 */
import * as React from "react";
import { SPINE_COUNTRIES } from "@/lib/spine-seeds";
import { CountryFlag } from "@/components/CountryFlag";
import { NeighboursTable } from "./NeighboursTable";
import { Conveyor } from "@/components/spine/conveyor";
import { SpineMap, type SpinePoint } from "@/components/spine/SpineMap";
import { CountFig } from "./motion";
import { buildCityActivities } from "@/lib/scores/city_board";
import { industryToSlug } from "@/lib/taxonomy";
import {
  TERRA, TRACK, usd, usdMo, cap,
  Ico, Fig, Dots, StackBar, Donut, SampleTag,
  Movement, Box, EaseScale, Head, Chip, KV, Expand, InlineDisclosure, Bullets,
  Even, WideRail, CatRows,
  Rail, Stat, InfoTip, SpectraTable,
} from "@/components/spine/kit";
import { LockPill } from "@/components/spine/kit-index";
import { isReviewBuild } from "@/lib/feature_flags";
import { AtlasMark } from "@/components/spine/marks";
import { AtlasIcon } from "@/components/brand/icons";

export const dynamic = "force-static";
const GB: any = SPINE_COUNTRIES.GB;

/* Provenance is stated ONCE in the masthead line. The old per-card ConfidenceDot
 * ceremony is retired (audit copy minor): a page of quiet dots read as noise, and the
 * datum they carried lived only in a native title= (mobile-invisible). */

/* read peer country files (server-only); used for the named "where it sits among peers"
 * dot plot , names come with the values so the peers are never anonymous */
function peerRows(codes: string[], pick: (j: any) => number | null | undefined): Array<{ code: string; name: string; v: number }> {
  return codes
    .map((code) => {
      const j = SPINE_COUNTRIES[code];
      if (!j) return null;
      const v = pick(j);
      return typeof v === "number" ? { code, name: j.meta?.name ?? code, v } : null;
    })
    .filter(Boolean) as Array<{ code: string; name: string; v: number }>;
}

/* The country's trade links reuse the site-wide fixed slate of everyday trades
 * (rulebook v2 §32: restaurant, grocery, pharmacy, salon, gym, auto-repair, plus
 * cafe/bar where modeled). Bars and nightclubs are OUT (founder cut, 2026-07-11: no
 * out-of-context trade forced in); pharmacy is not modeled for London yet, so it
 * cannot render here (an open data need). Each trade shows its canonical rule-32 label
 * (TRADE_NAME below), so sports/fitness reads as "Gym", never the raw taxonomy name.
 * A trade appears only where the London board holds a real modeled figure for it, and
 * each card links DOWN into that page , no figure is shown here. */
const TRADE_LINK_SLATE = [
  "restaurants", "grocery_stores", "hairdressers_beauty", "sports_fitness",
  "auto_repair_shops", "cafes_coffee",
];
async function londonTradeLinks(): Promise<Array<{ name: string; slug: string; href: string }>> {
  const rows = await buildCityActivities({ slug: "london", countryIso2: "GB" });
  const real = new Map(rows.filter((r) => typeof r.takeHome === "number").map((r) => [r.slug, r]));
  const picked: Array<{ name: string; slug: string; href: string }> = [];
  for (const industryId of TRADE_LINK_SLATE) {
    const r = real.get(industryToSlug(industryId));
    if (r) { picked.push({ name: r.name, slug: r.slug, href: r.href }); }
    if (picked.length >= 6) break;
  }
  // Canonical order, NOT a ranking: the old take-home sort asserted a per-trade keep
  // ranking the rulebook bans (v1 §5); links carry no order claim.
  return picked;
}

/* RailDots , the page-local shared-axis dot plot (Visual Dictionary idiom #4): ONE
 * drawn rail, N positioned dots, labels alternating above/below the track so close
 * positions never collide; endpoints named via `endLabels`; optional `refPos` draws an
 * ink reference tick. Dots are ink; `accent` marks the single answer dot terracotta.
 * The caller wraps it with role="img" + aria-label (this shape is aria-hidden). */
function RailDots({ dots, endLabels, refPos }: { dots: Array<{ pos: number; label: string; accent?: boolean }>; endLabels?: [string, string]; refPos?: number }) {
  const sorted = [...dots].sort((a, b) => a.pos - b.pos);
  return (
    <div aria-hidden>
      <div className="relative my-6 h-[6px] rounded-full" style={{ background: "#ecebe9" }}>
        {refPos != null ? <span className="absolute -bottom-1.5 -top-1.5 w-px" style={{ left: `${refPos}%`, background: "var(--c-line-strong)" }} /> : null}
        {sorted.map((x, i) => {
          const above = i % 2 === 0;
          const shift = x.pos < 8 ? "0" : x.pos > 92 ? "-100%" : "-50%";
          return (
            <React.Fragment key={`${x.label}-${i}`}>
              <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${x.pos}%`, background: x.accent ? TERRA : "var(--c-ink)", boxShadow: "0 0 0 1px #e3e3e3" }} />
              <span className={`absolute whitespace-nowrap text-[length:var(--t-micro)] leading-none ${above ? "-top-4" : "top-4"} ${x.accent ? "font-semibold text-[var(--terra-text)]" : "text-[var(--c-ink2)]"}`} style={{ left: `${x.pos}%`, transform: `translateX(${shift})` }}>{x.label}</span>
            </React.Fragment>
          );
        })}
      </div>
      {endLabels ? <div className="flex justify-between text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]"><span>{endLabels[0]}</span><span>{endLabels[1]}</span></div> : null}
    </div>
  );
}

/* ================= CHAPTER 1 ================= */
/*
 * Hero , the masthead + the ONE dominant decision figure.
 * verdict: at country altitude the answer is the ENVIRONMENT, not a business margin
 * (margin varies by trade, not by country), so the hero leads with what the STATE
 * TAKES: the all-in tax on a standard company's profit, a public-rules figure that
 * differs country to country and survives a skeptic. Principle: altitude.
 * focal: the government-take figure ($X of every $100 in profit), at hero scale.
 * width: full masthead row; the answer sits left, a compact support grid sits right.
 * terracotta: the take figure only (support tiles stay ink).
 */
function Hero({ d }: { d: any }) {
  const h = d.headline ?? {};
  // THE country-altitude answer: the all-in tax load on a standard company's profit
  // (tax_burden.total_pct = corporation tax + business rates + dividend + gains, an
  // identity that sums to the total). Public rules, defensible, and it varies country
  // to country, unlike the net margin the old hero borrowed from the cell altitude.
  const take = d.tax_burden?.total_pct ?? 0;
  // The registration tile is the LIMITED-COMPANY registration time, the comparable
  // standard across jurisdictions (not the fuller days-to-fully-set-up figure, which
  // the bank paces to ~21 days and which the compare table carries under its own name).
  const steps = d.setup?.steps ?? [];
  const formStep = steps.find((s: any) => /company|regist/i.test(s.name)) ?? steps[0];
  const formDays = Math.max(0, formStep?.time_days ?? 0);
  const formValue = formDays === 1 ? "1 day" : `${formDays} days`;
  // Tile labels name their metric TRUTHFULLY: smb_tax_pct is the small-profits
  // CORPORATION TAX rate (19%), the headline rate the hero's all-in take (36%) sits
  // above, so the two read as one story ("you keep less than the headline suggests").
  const tiles: Array<[string, string, string?]> = [
    ["Corporation tax", `${h.smb_tax_pct}%`],
    ["Average salary", usd(h.average_salary_usd), "/yr"],
    ["GDP / capita", usd(h.gdp_per_capita_usd)],
    ["Ease of business", `${h.ease_of_business_score}`, "/100"],
    ["Net wealth / adult", usd(h.net_wealth_per_adult_usd)],
    ["Company registration", formValue],
  ];
  return (
    <section className="overflow-hidden">
      <div className="py-6 md:py-8">
        <a className="mb-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--c-border)] bg-white/70 px-3 py-1 text-xs font-semibold text-[var(--c-ink2)] transition hover:border-[var(--terra-border)] hover:text-[var(--terra-text)]">&#8592; All countries</a>
        <div className="mt-2 grid items-center gap-x-8 gap-y-6 md:grid-cols-[1fr_auto]">
          <div>
            <div className="flex items-center gap-3.5"><CountryFlag iso2={d.meta?.iso2?.toLowerCase()} className="w-[52px] rounded-sm shadow-sm" /><h1 data-typography="custom" className="text-balance text-3xl font-semibold tracking-tight text-[var(--c-ink)] md:text-4xl">{d.meta?.name}</h1></div>
            {/* THE answer, in the top 20%. The unit is FUSED into the figure lockup
                ("$36 / $100") so the hero can never read as a price; the side line
                carries the meaning and NAMES the base (profit), so the figure can
                never misread as a share of revenue. */}
            <div className="mt-4 flex items-end gap-3">
              <span className="flex items-baseline gap-1.5">
                <CountFig target={take} prefix="$" className="text-[64px] font-semibold leading-[0.9] text-[var(--terra-text)] md:text-[76px]" />
                <span className="fig text-[26px] font-medium leading-none text-[var(--terra-text)] opacity-75 md:text-[30px]">/ $100</span>
              </span>
              <span className="mb-2 max-w-[22ch] text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">goes to the state in tax, of every $100 a standard business makes in profit.</span>
            </div>
          </div>
          <div className="grid w-full max-w-[420px] grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--c-border)] sm:grid-cols-3 md:w-[420px]" style={{ background: "var(--c-border)" }}>
            {tiles.map(([label, value, unit]) => (
              <div key={label} className="bg-[var(--c-card)] px-3 py-2.5">
                <div className="text-[length:var(--t-micro)] font-semibold uppercase leading-tight tracking-[0.06em] text-[var(--c-muted)]">{label}</div>
                <div className="mt-0.5 text-[length:var(--t-lead)] text-[var(--c-ink)]"><Fig>{value}</Fig>{unit ? <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{unit}</span> : null}</div>
              </div>
            ))}
          </div>
        </div>
        {/* provenance, stated ONCE, one quiet line , the page's only provenance chrome.
            The "modeled" AtlasMark encodes the exact status the sentence states (wave-2,
            mirroring the hood page's wave-1 provenance seal , never decoration). */}
        <p className="mt-5 flex items-start gap-1.5 border-t border-[var(--c-border)] pt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">
          <AtlasMark id="modeled" size={14} className="mt-px shrink-0" />
          <span>Figures are modeled from published economic data as of 2026, converted to US dollars for like-for-like reading; a few sections still carry early seed figures under research.</span>
        </p>
      </div>
    </section>
  );
}

/* MarginReality , DELETED (founder, 2026-07-05 country redesign). A whole-country net
 * margin / cost-structure split fails credibility: you cannot honestly know the labour /
 * tax / energy shares for a whole country, and margin is a business-altitude metric that
 * barely varies country to country. Its job is now split between the government-take hero
 * (what the state takes, up top) and the real per-trade take-home funnel below (what an
 * owner actually keeps, trade by trade). */

/*
 * Profile , the country in six lenses (a STANDARD scorecard on every country page).
 * verdict: named in the Rail (overall, strongest, weakest); there is no competing focal
 * figure, so the section stays small enough to pair with the honesty band beside it.
 * scale: ONE direction, high = good, and every marker sits at its TRUE fraction of the
 * track (7/10 fills to 70 percent, never pushed further right). The six categories are
 * fixed site-wide: five read straight off the economic profile; the sixth, Tax burden,
 * is the RANKED version of the hero (this country's all-in tax load against its peer
 * set), so it reinforces the hero rather than repeating it. Light load = high score.
 * width: Even , the smaller half, paired with The catch.
 * terracotta: the focal average + the top lens's dots only.
 */
function Profile({ d }: { d: any }) {
  const ep = d.economic_profile ?? {};
  // Tax burden as the RANKED hero: place this country's all-in tax load inside its peer
  // set and invert it onto the page's high = good scale (the lightest load scores 10).
  const peerCodes: string[] = d.meta?.peer_set ?? [];
  const taxVals = [d, ...peerCodes.map((c) => SPINE_COUNTRIES[c]).filter(Boolean)]
    .map((j: any) => j?.tax_burden?.total_pct)
    .filter((v: any): v is number => typeof v === "number");
  const gbTax = d.tax_burden?.total_pct;
  const lo = taxVals.length ? Math.min(...taxVals) : 0;
  const hi = taxVals.length ? Math.max(...taxVals) : 1;
  const taxScore =
    typeof gbTax === "number" && hi > lo
      ? Math.max(1, Math.min(10, Math.round((1 - (gbTax - lo) / (hi - lo)) * 9 + 1)))
      : 5;
  const lenses: Array<{ label: string; s: number }> = [
    { label: "Ease of entry", s: Number(ep.ease_of_business ?? 0) },
    { label: "Talent pool", s: Number(ep.talent_pool ?? 0) },
    { label: "Access to finance", s: Number(ep.access_to_financing ?? 0) },
    { label: "Purchasing power", s: Number(ep.economic_reward ?? 0) },
    { label: "Stability", s: Number(ep.political_stability ?? 0) },
    { label: "Tax burden", s: taxScore },
  ];
  const scored = lenses.slice().sort((a, b) => b.s - a.s);
  const avg = scored.length ? Math.round((scored.reduce((a, x) => a + x.s, 0) / scored.length) * 10) / 10 : 0;
  return (
    <Box>
      <Rail icon="vs-world" kicker="The country, in six lenses" sample />
      {/* The July-3 approved scorecard form (rulebook v1 §25): a focal average beside
          dot-score rows, so the scorecard reads as a scorecard, never one more bar
          list. One accent: the top lens's dots. */}
      <div className="grid items-center gap-5 sm:grid-cols-[34%_1fr]">
        <div className="focal flex flex-col items-center justify-center p-4 text-center">
          <Stat value={<>{avg}<span className="text-[length:var(--t-lead)] text-[var(--c-muted)]">/10</span></>} size="focal" accent />
          <div className="mt-1 text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">across six lenses</div>
        </div>
        <div className="space-y-2">
          {scored.map((r) => (
            <div key={r.label} className="grid grid-cols-[112px_1fr_30px] items-center gap-2.5">
              <span className="min-w-0 truncate text-[length:var(--t-body)] text-[var(--c-ink2)]">{r.label}</span>
              <Dots score={r.s} max={10} />
              <Fig className="text-right text-[length:var(--t-body)] text-[var(--c-ink)]">{r.s}</Fig>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 border-t border-[var(--c-border)] pt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">Higher is better on every lens; a lighter tax load scores higher.</div>
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
  const pop = d.headline?.population ?? 0;
  const segs: any[] = (m.consumer_segments ?? []).slice().sort((a: any, b: any) => b.pct - a.pct);
  // Spend per citizen a MONTH (the annual pool over the population, over twelve). Shown
  // monthly so the figure never collides with the annual median-income figure in the
  // paired box (the two are near-identical annually in this market, which reads as a bug).
  const perCitizenYr = pop > 0 ? ((m.consumer_spend_pool_usd_bn ?? 0) * 1e9) / pop : 0;
  // The winnable slice (going out / leisure) is the ONE terracotta answer: the
  // discretionary spend a new business can actually contest. Every other slice ramps grey
  // by size, so the accent marks the answer, never merely the biggest slice (§37).
  const winnable = segs.find((s: any) => /going out|leisure|dining/i.test(s.name || ""));
  const greys = ["#8f8f8d", "#adadab", "#c9c9c7", "#dcdcda"];
  const nonWin = segs.filter((s: any) => !(winnable && s.name === winnable.name));
  const colorOf = (s: any) => (winnable && s.name === winnable.name ? TERRA : greys[Math.min(greys.length - 1, nonWin.indexOf(s))]);
  const donutSegs: Array<[string, number, string]> = segs.map((s: any) => [s.name, s.pct, colorOf(s)]);
  const centerSlice = winnable ?? segs[0];
  return (
    <Box>
      <Rail icon="spending-power" kicker="The size of the market" sample />
      <div className="grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_auto]">
        <div className="focal flex flex-col justify-center p-4">
          <Stat value={usdMo(perCitizenYr)} label="Consumer spend per citizen, a month" size="focal" accent />
          <div className="mt-1.5 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">What the average resident spends in a month; the pot every business here competes for.</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="mb-1 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Where that money goes</div>
          <Donut segs={donutSegs} centerBig={`${centerSlice?.pct ?? 0}%`} centerSub={winnable ? "going out" : "top slice"} />
          <div className="mt-2 flex max-w-[240px] flex-wrap justify-center gap-x-3 gap-y-1">{segs.map((s: any) => (
            <span key={s.name} className="inline-flex items-center gap-1.5 text-[length:var(--t-micro)] text-[var(--c-ink2)]"><span className="h-2 w-2 rounded-sm" style={{ background: colorOf(s) }} />{s.name} <Fig className="text-[var(--c-ink)]">{s.pct}%</Fig></span>))}</div>
        </div>
      </div>
    </Box>
  );
}

/*
 * TheCatch , the one honesty band. The single biggest catch is the top-scored entry in
 * risk_exit.risks, rendered as a labelled figure; the seed's dedicated
 * character.the_catch line is the ONE supporting line beneath it (never a locals_intel
 * item, so a paying reader never meets the same sentence twice in "What locals know").
 * The old magnitude MiniBar is dropped (rulebook v1 §26: a lone number may stay a
 * number; the S7 bar-manufacturing corollary is repealed), so the honesty band reads
 * distinct from the data sections around it again, the July-3 voice.
 * focal: the top risk's score, labelled.
 * width: Full , a load-bearing honesty band; never center-floated.
 * terracotta: the risk figure only (one accent).
 */
function TheCatch({ d }: { d: any }) {
  const risks = (d.risk_exit?.risks ?? []).slice().sort((a: any, b: any) => (b.score_1_10 ?? 0) - (a.score_1_10 ?? 0));
  const topRisk = risks[0];
  const riskLabel: any = { energy_input_costs: "Energy and input costs", rule_tax_changes: "Shifting rules and tax", demand_cycle: "The demand cycle", currency_swings: "Currency swings", skills_shortages: "Skills shortages" };
  const topLabel: string | null = topRisk ? (riskLabel[topRisk.name] ?? cap(String(topRisk.name).replace(/_/g, " "))) : null;
  // The honesty band NAMES the single biggest standing risk and carries NO severity
  // score, so it never flips direction against the six-lens scorecard beside it (both
  // read one way, rulebook v2 §29A). The full inverted risk register lives in CH5.
  return (
    <Box>
      <Rail icon="honest-take" kicker="The catch" sample />
      {topLabel ? (
        <div className="focal p-4">
          <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">The biggest standing risk</div>
          <div className="mt-1 text-[length:var(--t-sub)] font-semibold text-[var(--c-ink)]">{topLabel}</div>
        </div>
      ) : null}
      <p className="mt-3 border-t border-[var(--c-border)] pt-3 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{d.character?.the_catch ?? "Local operators price the hidden costs in before they commit."}</p>
    </Box>
  );
}

/* ================= CHAPTER 2 ================= */
/*
 * SetupTimeline , the ordered SETUP STEPPER (founder, 2026-07-05: the old horizontal time
 * axis invented day-positions the data did not hold, so it is rebuilt on a more reliable
 * form). A crafted numbered rail of the real universal steps, assuming a limited company,
 * IN ORDER: register the company, register for tax, open the bank account, then the first
 * filings. Each step carries only what the seed actually holds, its time, cost and channel,
 * never a fabricated position on an axis. Signature section: the numbered rail is the craft.
 * verdict: you can trade from day one; the bank account is the single slow step.
 * width: Full. terracotta: the first step's badge only (the "live from day one" moment).
 */
function SetupTimeline({ d }: { d: any }) {
  const steps = d.setup?.steps ?? [];
  if (!steps.length) return null;
  const timeWord = (days: number) => (days <= 0 ? "same day" : days === 1 ? "1 day" : `${days} days`);
  return (
    <Box>
      <Rail icon="register-cost" kicker="The steps to open" />
      {/* Every step badge is neutral: the steps are sequential, so featuring step 1 in
          terracotta asserted a rank among equals (rulebook v2 §37). The slow step reads
          from its own time chip, not a glued verdict sentence (§26). */}
      <ol className="relative ml-3 space-y-4 border-l-2 border-[var(--c-border)] pl-6 pt-1">
        {steps.map((s: any, i: number) => {
          const days = Math.max(0, s.time_days ?? 0);
          const cost = (s.cost_usd || 0) > 0 ? `$${Math.round(s.cost_usd)}` : "No fee";
          return (
            <li key={i} className="relative">
              <span className="fig absolute -left-[37px] grid h-7 w-7 place-items-center rounded-full border-2 border-white text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]" style={{ background: "var(--c-soft2)", boxShadow: "0 0 0 1px #e3e3e3" }}>{i + 1}</span>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1.5">
                <span className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{s.name.replace(/\s*\(.*\)$/, "")}</span>
                <span className="flex flex-wrap items-center gap-1.5"><Chip>{timeWord(days)}</Chip><Chip>{cost}</Chip>{s.how ? <Chip>{s.how}</Chip> : null}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </Box>
  );
}

function formationExtra(name: string) {
  const n = (name || "").toLowerCase();
  if (n.includes("sole")) return { paperwork: "Light", raise: "Hard, no shares to sell", setup: "Free, minutes", summary: "You and the business are one in law: simplest to run, you keep all the profit and carry all the risk personally." };
  if (n.includes("partner")) return { paperwork: "Medium", raise: "Shared between partners", setup: "Low", summary: "Two or more owners share the work, the profit and the liability under one agreement; trust between partners matters." };
  return { paperwork: "Medium, annual accounts", raise: "Easy, you can issue shares", setup: "Small one-off fee", summary: "A separate legal person: your liability is limited and it is the default once you hire or raise, but you file accounts every year." };
}
/*
 * Formation , which legal structure to form. Execution good (the founder kept it); the
 * worked example now opens on the LIMITED COMPANY, the default once you hire or raise, not
 * the sole trader. Limited is sorted to the front and open by default.
 * verdict: Most growing firms pick a limited company; sole trader suits the very small.
 * width: WideRail [1] , the wider card (~60%) beside the narrower bank-account card.
 * terracotta: none (reference section, ink tile + the VAT chip).
 */
function Formation({ d }: { d: any }) {
  // Limited company first + open by default (founder: switch the worked example off the
  // sole trader). A stable sort that lifts the limited-company structure to the front.
  const structures = [...(d.setup?.structures ?? [])].sort(
    (a: any, b: any) => Number(/(limited|ltd|llc)/i.test(b.name)) - Number(/(limited|ltd|llc)/i.test(a.name)),
  );
  return (
    <Box><Head icon="subtype">Which legal structure to form</Head>
      <div className="space-y-2">{structures.map((s: any, i: number) => { const x = formationExtra(s.name); return (
        <Expand key={i} name="formation" title={s.name} open={i === 0}>
          <p className="mb-2 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{x.summary}</p>
          <KV k="Liability" v={s.liability} /><KV k="Taxed as" v={s.tax} /><KV k="Paperwork" v={x.paperwork} /><KV k="Raising money" v={x.raise} /><KV k="Setup" v={x.setup} /><KV k="Best for" v={s.best_for} />
        </Expand>); })}
      </div>
      {d.setup?.vat_threshold_usd ? <div className="mt-3 inline-block rounded-full border border-[var(--c-border)] bg-[var(--c-soft)] px-3 py-1.5 text-[length:var(--t-body)] text-[var(--c-ink2)]">Register for VAT once sales pass <Fig className="text-[var(--c-ink)]">${Math.round(d.setup.vat_threshold_usd / 1000)}K</Fig></div> : null}
    </Box>
  );
}

/*
 * Banking , opening a business bank account.
 * verdict: Open to foreigners, but a UK address and a few weeks of waiting is the catch.
 * focal: the friction verdict word (rulebook v1 §25/§26: the Meter is cut in the bar
 * rationing; a labelled word carries the one-glance read).
 * width: Even , paired peer to Formation, equal class.
 * terracotta: none (the word carries the read).
 */
function Banking({ d }: { d: any }) {
  const b = d.setup?.banking ?? {};
  return (
    <Box>
      <Rail icon="bank" kicker="Opening a bank account" />
      <div className="focal mb-3 flex items-baseline justify-between p-3.5">
        <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">How hard</span>
        <Fig className="text-[length:var(--t-sub)] capitalize text-[var(--c-ink)]">{b.friction}</Fig>
      </div>
      <Bullets items={b.bullets ?? []} />
      <div className="mt-3 divide-y divide-[var(--c-border)]">
        {[["High-street", b.banks_traditional], ["Digital", b.banks_digital]].map(([label, arr]) => (
          <div key={label as string} className="flex gap-3 py-2"><span className="w-20 shrink-0 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{label}</span><span className="text-[length:var(--t-body)] text-[var(--c-ink)]">{((arr as string[]) ?? []).join("  ·  ")}</span></div>))}
      </div>
    </Box>
  );
}

/*
 * TaxByLevel , what the business actually pays (retired doughnut -> zero-baseline bars).
 * verdict: Corporation tax carries most of the burden; the all-in load lands middling.
 * focal: the all-in load figure, then a DESCENDING share-of-load bar list, leader terra.
 * width: Full , the bars beside a plain-English "which tax does what" disclosure.
 * terracotta: the all-in figure + the leading (corporation tax) bar only.
 * honesty: the seed's components are modeled profit-equivalent weights that SUM to the
 * all-in load (19 + 5 + 8 + 4 = 36, identity in tax_burden._meta), so every bar is a
 * coherent share of the load , NOT a normalized pile of statutory rates. The statutory
 * rates live in the line-by-line disclosure below, under their own names.
 * NOTE: was a doughnut, but corp tax was only ~a third of the ring (no dominant
 * slice), so it broke the single-dominant rule. Recast to zero-baseline bars.
 */
// Plain-language glosses (founder: a "?" per tax that explains jargon like "business
// rates"). Educational copy, not a datum, so it may ride a hover tooltip; the rate note
// stays VISIBLE below each line so a touch reader is never starved. Keyed by display name.
const TAX_GLOSS: Record<string, string> = {
  "Tax on profits": "What a company pays on the profit it keeps after costs.",
  VAT: "A sales tax the customer pays; the business collects it and passes it on.",
  "Dividend tax": "Tax on profit an owner takes out of the company for themselves.",
  "Capital gains": "Tax on the gain when the business or its assets are sold.",
  "Business rates": "A yearly charge based on the rental value of the premises.",
  "Company registration": "The one-off fee to register the company.",
  "Trade licence": "A one-off fee, only for trades that need a permit.",
};
// Founder: rename the most relevant tax to "Tax on profits" (for a limited company the
// corporation tax IS the tax on profits) and highlight it.
const taxDisplayName = (n: string) => (/corporation tax/i.test(n) ? "Tax on profits" : n);
/* TaxTip , the tax-line gloss lookup over the kit InfoTip (which is tap-safe at 390px). */
function TaxTip({ term }: { term: string }) {
  const g = TAX_GLOSS[term];
  return g ? <InfoTip gloss={g} /> : null;
}
function TaxByLevel({ d }: { d: any }) {
  const groups = d.tax_detail?.groups ?? [];
  const allIn = d.tax_burden?.total_pct ?? 0;
  const band = allIn >= 42 ? "Heavy" : allIn >= 30 ? "Middling" : "Light";
  const comp = d.tax_burden?.components ?? {};
  // Sorted DESCENDING so the largest share reads first, left to right.
  const raw: Array<[string, number]> = ([
    ["Tax on profits", comp.corporation_tax_pct ?? 0],
    ["Business rates", comp.business_rates_pct_equiv ?? 0],
    ["Dividend tax", comp.dividend_tax_pct ?? 0],
    ["Capital gains", comp.capital_gains_pct ?? 0],
  ] as Array<[string, number]>).filter(([, p]) => p > 0).sort((a, b) => b[1] - a[1]);
  const wSum = raw.reduce((a, [, p]) => a + p, 0) || 1;
  const shareRows: Array<[string, number]> = raw.map(([n, p]) => [n, Math.round((p / wSum) * 100)] as [string, number]);
  // The four shares sum to the whole tax load, so it is ONE whole split into parts: a
  // single stacked share bar, never four separate bars (rulebook v2 §28, a whole reads
  // as one form). The leading tax carries the terracotta; the rest ramp grey by size.
  const taxGreys = ["#8f8f8d", "#adadab", "#c9c9c7"];
  const items = groups.flatMap((g: any) => (g.items ?? []).map((it: any) => ({ ...it, level: g.level })));
  return (
    <Box>
        <Rail icon="taxes" kicker="What the business actually pays" sample />
        <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">All-in tax load</span>
          <Fig className="text-[26px] leading-none text-[var(--terra-text)]">{allIn}%</Fig>
          <Chip>{band} for the peer set</Chip>
        </div>
        <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Share of the tax load for a typical small company</div>
        <StackBar h="h-10" sort={false} legend legendClassName="mt-2 flex flex-wrap gap-x-3 gap-y-1" ariaLabel={shareRows.map(([n, pct]) => `${n} ${pct}%`).join(", ")} segments={shareRows.map(([n, pct], i) => ({ label: n, pct, color: i === 0 ? TERRA : taxGreys[Math.min(taxGreys.length - 1, i - 1)] }))} />
        <div className="mt-2.5 border-t border-[var(--c-border)] pt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">VAT is customer-borne, so it sits outside the load; the rate on each tax is listed below.</div>
        <InlineDisclosure name="taxdetail" className="group mt-3 border-t border-[var(--c-border)] pt-2.5" summary="Every tax, line by line">
          <div className="mt-2.5 divide-y divide-[var(--c-border)]">{items.map((it: any) => { const nm = taxDisplayName(it.name); const lead = nm === "Tax on profits"; return (
            <div key={it.name} className="flex items-baseline gap-3 py-2"><Fig className={`w-14 shrink-0 text-[length:var(--t-lead)] ${lead ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{it.value}</Fig><span className="text-[length:var(--t-body)] leading-tight text-[var(--c-ink2)]"><b className={`font-medium ${lead ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{nm}</b><TaxTip term={nm} /> <span className="text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">{it.level}</span><br />{it.note}</span></div>); })}
          </div>
        </InlineDisclosure>
    </Box>
  );
}

/* ================= CHAPTER 3 ================= */
/*
 * PayByLevel , what staff cost to employ, by seniority.
 * verdict: A senior hire costs roughly triple an entry-level one, and every wage
 * carries an on-cost tip.
 * focal: a wage ladder in seniority order; each bar is gross salary (solid) plus a
 * ghosted +on-cost extension, so the TRUE cost-to-employ reads at a glance instead of
 * hiding in a footnote. Figures show the loaded cost, gross beneath.
 * width: Even , paired with TalentDepth.
 * terracotta: the +% on-cost figure in the legend line only (bars stay neutral , the
 * decision anchor is the ladder itself, not any single tier).
 */
function PayByLevel({ d }: { d: any }) {
  const o = d.people_pay?.pay_by_level_usd ?? {};
  const on = d.tax_burden?.employer_oncost_pct ?? 0;
  // Founder: refocus on the employer ON-COST (investors are sensitive to it) and use
  // "Management" only. The on-cost is the terracotta theme of the box: stated once at top
  // and drawn as the terra tip on every bar (a consistent series, not four rival accents).
  const levels: Array<[string, string]> = [["junior", "Entry"], ["experienced", "Skilled"], ["senior", "Senior"], ["specialist", "Management"]];
  const rows = levels.map(([k, label]) => { const gross = o[k] || 0; const oncost = Math.round((gross * on) / 100); return { k, label, gross, oncost, loaded: gross + oncost }; });
  const max = Math.max(...rows.map((r) => r.loaded)) || 1;
  return (
    <Box><Head icon="wages">What staff cost to employ</Head>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.k} className="hov -mx-2 grid grid-cols-[minmax(0,6rem)_1fr_5.2rem] items-center gap-3 rounded-md px-2 py-1.5">
            <span className="min-w-0 truncate text-[length:var(--t-body)] text-[var(--c-ink2)]">{r.label}</span>
            <span className="relative block h-2.5 overflow-hidden rounded-full" style={{ background: TRACK }} role="img" aria-label={`${r.label}: $${Math.round(r.gross / 1000)}K gross plus $${Math.round(r.oncost / 1000)}K on-cost, $${Math.round(r.loaded / 1000)}K to employ`}>
              <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(r.loaded / max) * 100}%`, background: TERRA }} />
              <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(r.gross / max) * 100}%`, background: "#c8c8c6" }} />
            </span>
            <span className="text-right leading-tight">
              <Fig className="block text-[length:var(--t-body)] text-[var(--c-ink)]">${Math.round(r.loaded / 1000)}K</Fig>
              <span className="fig block text-[length:var(--t-micro)] text-[var(--c-muted)]">${Math.round(r.gross / 1000)}K + ${Math.round(r.oncost / 1000)}K</span>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[length:var(--t-micro)] text-[var(--c-muted)]"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: "#c8c8c6" }} />Gross salary</span><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: TERRA }} />Employer on-cost <span className="font-medium text-[var(--terra-text)]">+{on}%</span></span><span className="ml-auto">Full cost to employ, a year</span></div>
    </Box>
  );
}
/*
 * HiringDials , how easy it is to hire, contract and let go.
 * verdict: A flexible labour market; contracts are light and dismissals are lighter than peers.
 * focal: THREE labour-flexibility dials on one shared Harder-to-Easier scale (the old
 * fourth row, "Depth of talent: Deep", was a mislabeled duplicate of the adjacent
 * TalentDepth card and folded into it). Endpoints named via the kit's endLabels.
 * width: Even , paired peer to OperatingCosts.
 * terracotta: none (neutral markers; the words carry the read).
 */
function HiringDials({ d }: { d: any }) {
  const h = d.people_pay?.hiring ?? {}; const eMap: any = { easy: 84, moderate: 52, hard: 18 };
  // Founder: "let go" -> "firing" (the word people understand). The old single combined
  // reveal read poorly; split into three clearly-clickable rows (hiring / contracts / firing).
  const rows: Array<[string, number, string]> = [["Hiring someone", eMap[h.hire_ease] ?? 50, cap(h.hire_ease)], ["Contracts you can use", eMap[h.contract_ease] ?? 50, cap(h.contract_ease)], ["Firing someone", eMap[h.fire_ease] ?? 50, cap(h.fire_ease)]];
  const notes = h.notes ?? {};
  const detail = ([["Hiring", notes.hire], ["Contracts", notes.contract], ["Firing", notes.fire]] as Array<[string, string]>).filter(([, v]) => v);
  return (
    <Box><Head icon="hiring">How easy it is to hire and fire</Head>
      <div className="mt-6"><EaseScale rows={rows} endLabels={["Harder / rigid", "Easier / flexible"]} /></div>
      {detail.length ? (
        <div className="mt-4 space-y-2">{detail.map(([title, note]) => (
          <Expand key={title} name="hiring" title={title}>
            <p className="text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{note}</p>
          </Expand>
        ))}</div>
      ) : null}
    </Box>
  );
}
/*
 * TalentDepth , how deep the talent pool runs by field.
 * verdict: Finance, tech and professional services run deepest; making things runs thinnest.
 * focal: the July-3 approved deep/thinner SPLIT LIST (rulebook v1 §25): four fields tie
 * at the ceiling, so a bar discriminated nothing; a categorical split is the honest
 * read. Figures ride the page-standard /10 scale (rulebook v1 §29; the seed holds 1-5,
 * doubled). Also absorbs the "Depth of talent" row folded out of HiringDials (the
 * recruiting note below).
 * width: Even , paired peer to PayByLevel.
 * terracotta: none (a reference read; no single answer field).
 */
function TalentDepth({ d }: { d: any }) {
  const map: any = { finance: "Finance", software_tech: "Software & tech", professional_legal: "Professional & legal", creative_media: "Creative & media", life_sciences: "Life sciences", manufacturing_trades: "Manufacturing & trades" };
  const arr = (d.people_pay?.talent_depth ?? []).slice()
    .map((t: any) => ({ ...t, s10: Math.round((t.score_1_5 ?? 0) * 2) }))
    .sort((a: any, b: any) => b.s10 - a.s10);
  // The July-3 split: the ceiling fields (5/5, i.e. 10/10) run deep; the rest thinner.
  const deep = arr.filter((t: any) => t.s10 >= 9);
  const thin = arr.filter((t: any) => t.s10 < 9);
  const fieldRow = (t: any) => (
    <div key={t.field} className="flex items-baseline justify-between gap-3 border-b border-[var(--c-border)] py-1.5 last:border-0">
      <span className="min-w-0 truncate text-[length:var(--t-body)] text-[var(--c-ink2)]">{map[t.field] ?? t.field}</span>
      <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]">{t.s10}<span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">/10</span></Fig>
    </div>
  );
  // Native languages OF THE LAND only (never immigrant languages), shown as the share who
  // can speak each, which a bilingual population can push over 100%.
  const langs = (d.people_pay?.languages ?? []).filter((l: any) => l.native !== false);
  return (
    <Box><Head icon="who-for">How deep the talent pool runs</Head>
      <div className="grid gap-x-7 gap-y-3 sm:grid-cols-2">
        {deep.length ? (
          <div>
            <div className="mb-1 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Runs deep</div>
            {deep.map(fieldRow)}
          </div>
        ) : null}
        {thin.length ? (
          <div>
            <div className="mb-1 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Runs thinner</div>
            {thin.map(fieldRow)}
          </div>
        ) : null}
      </div>
      <div className="mt-3.5 border-t border-[var(--c-border)] pt-3">
        <div className="mb-1.5 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Languages spoken</div>
        <div className="flex flex-wrap items-center gap-2">{langs.map((l: any) => <Chip key={l.name}>{l.name} {l.pct_speakers}%</Chip>)}</div>
        <p className="mt-1.5 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">Share of people who can speak each language of the country; a bilingual population can total over 100%.</p>
      </div>
    </Box>
  );
}

/*
 * OperatingCosts , what it costs to run premises.
 * verdict: Rent is the cost that moves the needle; the named peer rail shows where it sits.
 * focal: commercial rent + a NAMED peer dot plot (every peer a labelled dot on one
 * drawn rail, endpoints valued), replacing the old scale-less "vs peers" spark that
 * asserted a rank a reader could not check.
 * width: WideRail [1fr_200px] feel , focal rent beside a thin support list.
 * terracotta: the home (UK) dot + its label only (the focal Stat stays ink so the box
 * keeps one accent).
 */
function OperatingCosts({ d }: { d: any }) {
  const c = d.costs ?? {};
  const p = d.premises ?? {};
  // Founder: the peer COMPARISON is on ELECTRICITY, not rent, rent is too variable to line
  // up like for like, electricity is a standard unit. Named peer dots on one drawn rail.
  const peers = peerRows(d.meta?.peer_set ?? [], (j) => j?.costs?.energy_usd_per_kwh);
  const all = [...peers, { code: "GB", name: "UK", v: c.energy_usd_per_kwh }]
    .filter((x) => typeof x.v === "number")
    .sort((a, b) => a.v - b.v);
  const idx = all.findIndex((x) => x.code === "GB");
  const n = all.length;
  const rank = n > 1 && idx >= 0 ? (idx === 0 ? "the cheapest" : idx === n - 1 ? "the priciest" : idx >= (n - 1) * 0.66 ? "near the top" : idx <= (n - 1) * 0.34 ? "near the bottom" : "mid-pack") : "unranked";
  const lo = all[0]?.v ?? 0, hi = all[n - 1]?.v ?? 1, span = hi - lo || 1;
  const fmtc = (v: number) => `$${v.toFixed(2)}`;
  // Direction: cheaper electricity is BETTER, so the cheapest sits on the RIGHT and the
  // priciest on the left (rulebook v2 §29A, worse reads left). The UK dot is the answer
  // mark for this box (the subject's position), carried in terracotta with its value.
  const dots = all.map((x) => ({ pos: (1 - (x.v - lo) / span) * 100, label: x.code === "GB" ? `${x.name} ${fmtc(x.v)}` : x.name, accent: x.code === "GB" }));
  return (
    <Box>
      <Head icon="commercial-rent">What it costs to run a place</Head>
      {/* Rent is THE focal (the verdict names it); electricity demoted to a support figure
          beside it , two equal focal Stats competed for the same eye (rule 23). Oil / fuel
          and rent-as-average-of-covered-cities remain open data needs: the seed holds a
          national rent + no fuel price, so neither is claimed here (never fabricated). */}
      <div className="focal flex flex-wrap items-end justify-between gap-x-6 gap-y-2 p-4">
        <Stat value={<>${c.commercial_rent_usd_sqm_yr?.toLocaleString("en-US")}</>} label="Commercial rent / sqm a year" size="focal" />
        <div className="text-right">
          <Fig className="text-[length:var(--t-sub)] text-[var(--c-ink)]">{fmtc(c.energy_usd_per_kwh ?? 0)}</Fig>
          <div className="text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">electricity / kWh</div>
        </div>
      </div>
      {n > 1 ? (
        <div className="mt-3.5" role="img" aria-label={`Electricity cost among peers: ${all.map((x) => `${x.name} ${fmtc(x.v)}`).join(", ")}`}>
          <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Electricity among the peer set, $ / kWh</div>
          <RailDots dots={dots} endLabels={[fmtc(hi), fmtc(lo)]} />
        </div>
      ) : null}
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
 * focal: the ease verdict word + figure (rulebook v1 §25/§26: the Meter is cut in the
 * bar rationing; the SellingAbroad figure-plus-word grammar carries the read).
 * width: Even , peer to Grants.
 * terracotta: none. The old first-card terracotta (the 2026-07-05 pre-selection) is
 * reversed by founder G4 / D8 (2026-07-11, rulebook v1 §37): no data ranks bank loans
 * above the other two sources, so the three cards render equal-weight, ink borders.
 */
function Financing({ d }: { d: any }) {
  const f = d.financing ?? {};
  // Founder: rename to "Raising money"; keep the ease figure but drop its gray subtitle.
  // Three fixed cards on one row, loans + equity ONLY (grants move to the grants section).
  // Non-expandable, fixed height. Each card holds its one real source note today; richer
  // per-source bullets are a flagged data need.
  const wanted = [
    { match: /bank/i, title: "Bank loans" },
    { match: /start ?up|government|gov/i, title: "Startup and government loans" },
    { match: /angel|venture|vc|equity/i, title: "Angel and venture capital" },
  ];
  const sources = f.sources ?? [];
  const cards = wanted.map((w) => { const s = sources.find((x: any) => w.match.test(x.name)); return { title: w.title, note: s?.note as string | undefined }; }).filter((c) => c.note);
  return (
    <Box><Head icon="raise-money" sample>Raising money</Head>
      <div className="mb-4 flex items-baseline gap-2">
        <Fig className="text-[length:var(--t-sub)] text-[var(--c-ink)]">{f.ease_0_100}<span className="text-[length:var(--t-body)] text-[var(--c-muted)]"> / 100</span></Fig>
        <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">ease of raising money here</span>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="rounded-lg border border-[var(--c-border)] bg-[var(--c-card)] p-3.5">
            <div className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{c.title}</div>
            <p className="mt-1.5 text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)]">{c.note}</p>
          </div>
        ))}
      </div>
    </Box>
  );
}
/*
 * Grants , the named incentives worth knowing.
 * verdict: A mix of a rebate, a backed loan and two competitive grants; none are automatic.
 * focal: the amount per scheme; each expands to what it is and how it actually pays out.
 * width: Even , peer to Financing.
 * terracotta: the OPEN row's amount only (closed amounts are ink , four terra amounts
 * at once blew the one-accent budget); non-numeric values ("varies by area") render as
 * plain text, never in the figure slot.
 */
function Grants({ d }: { d: any }) {
  // Founder: do NOT mix with raising money, remove anything that is a LOAN (keep the
  // non-repayable only), MAX 3 cards, number-focused. Three fixed cards, matching the
  // raising-money row so the two read as one vocabulary.
  const list = (d.grants?.list ?? []).filter((g: any) => !/loan/i.test(g.kind || "") && !/loan/i.test(g.name || "")).slice(0, 3);
  return (
    <Box><Head icon="free-zone">Grants and incentives</Head>
      <div className="grid gap-2.5 sm:grid-cols-3">{list.map((g: any) => (
        <div key={g.name} className="flex flex-col rounded-lg border border-[var(--c-border)] bg-[var(--c-card)] p-3.5">
          <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{g.kind}</div>
          <div className="mt-0.5 text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{g.name}</div>
          {g.value ? <Fig className="mt-0.5 text-[length:var(--t-body)] text-[var(--c-ink)]">{g.value}</Fig> : null}
          <p className="mt-1.5 text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)]">{g.note}</p>
          {g.who ? <p className="mt-auto pt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">For {String(g.who).toLowerCase()}</p> : null}
        </div>))}
      </div>
    </Box>
  );
}

/* ================= CHAPTER 4 ================= */
/*
 * SpendDonut , where a household's money goes (retired doughnut -> zero-baseline bars).
 * verdict: A big chunk is discretionary, the spend a new business can win.
 * focal: the discretionary share, called out big, then the NAMED categories as a
 * descending bar list; the residual "Other" bucket is pinned LAST in a muted row ,
 * a residual is not a category and may never win the ranking the story figure sits in.
 * width: Even , paired peer to Income.
 * terracotta: the discretionary bar only (one accent per box).
 * NOTE: was a doughnut whose largest wedge was "Other", which broke the single-
 * dominant-slice rule. Recast to ranked horizontal bars from a zero baseline.
 */
/* SpendDonut , CUT (2026-07-08 skeptic pass). Two donuts in one chapter answered the same
 * "where the money goes" question from two different datasets with different numbers, a
 * same-page self-contradiction; and the founder had already flagged the household split as
 * non-differentiating across countries ("may REPLACE with a more relevant household
 * metric"). Demand's donut carries the one where-the-money-goes read; the winnable-slice
 * insight moved under its legend. A better household metric is an open founder decision. */

/* Seasonality , DELETED (founder "DELETE NOW", 2026-07-05). Demand-across-the-year is
 * unacceptable at country altitude (seasonality is a city/trade read, not a country one).
 * SectorMix , DELETED (founder "DELETE NOW"). "The shape of the economy" is not a
 * country-page-appropriate section; it says little a founder can act on and reads similar
 * across developed economies (fails differentiation). Both cut, not reframed. */

/*
 * RiskRegister , what could go wrong. Founder 2026-07-05: flip onto the page's ONE scale,
 * high = good. The seed holds risk MAGNITUDE (energy 9 = high risk), so it is scored as
 * SAFETY (11 - magnitude, energy -> 2) and the LOWEST score is the biggest exposure. The
 * subtitle now EXPLAINS the scale rather than giving the verdict. A sixth risk category is a
 * flagged data need (the seed holds five). Width smaller, the narrow card beside Exit.
 * terracotta: the biggest-exposure label only (never the dots, which read high = good).
 */
function RiskRegister({ d }: { d: any }) {
  const label: any = { energy_input_costs: "Energy and input costs", rule_tax_changes: "Rule and tax changes", demand_cycle: "Demand cycle", currency_swings: "Currency swings", skills_shortages: "Skills shortages" };
  const risks = (d.risk_exit?.risks ?? [])
    .map((r: any) => ({ ...r, safe: Math.max(1, Math.min(10, 11 - (r.score_1_10 ?? 5))) }))
    .sort((a: any, b: any) => a.safe - b.safe);
  return (
    <Box>
      <Rail icon="watch" kicker="What could go wrong" />
      <div className="space-y-2.5">{risks.map((r: any, i: number) => (
        <div key={r.name} className="hov -mx-2 grid grid-cols-[130px_1fr_auto] items-center gap-2.5 rounded-md px-2 py-1">
          <span className={`min-w-0 truncate text-[length:var(--t-body)] ${i === 0 ? "font-medium text-[var(--terra-text)]" : "text-[var(--c-ink2)]"}`}>{label[r.name] ?? r.name}</span>
          <Dots score={r.safe} max={10} />
          <Fig className="w-9 text-right text-[length:var(--t-body)] text-[var(--c-ink)]">{r.safe}/10</Fig>
        </div>))}
      </div>
      {/* the axis meaning as an END-LABEL on the shared scale (rulebook v2 corrections:
          an axis explainer moves onto the scale, never back into a sentence). The list is
          sorted ascending by safety, so the terracotta row above is already the one to
          watch; these two words are the whole remaining read. */}
      <div aria-hidden className="mt-1.5 grid grid-cols-[130px_1fr_auto] items-center gap-2.5">
        <span />
        <div className="flex justify-between text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]"><span>Riskier</span><span>Safer</span></div>
        <span />
      </div>
    </Box>
  );
}

/*
 * Income , what customers earn.
 * verdict: A comfortable median customer, but the top of the market pulls far ahead.
 * focal: the median earner figure (the customer who actually walks in), then the three
 * rungs as labelled dots on ONE zero-based shared axis with a reference tick at the
 * median (the old three-rail lollipop carried no independent scale).
 * width: Even , peer to SpendDonut, equal class.
 * terracotta: the median focal Stat only (the axis dots are ink).
 */
function Income({ d }: { d: any }) {
  const o = d.income ?? {};
  const med = o.median_income_usd || 0;
  const k$ = (v: number) => `$${Math.round((v || 0) / 1000)}K`;
  // Founder: a bar (H or V) gives the wrong perspective here. The real read is HOW FAR the
  // top pulls ahead of the median, so the top tiers are shown as MULTIPLES of the median
  // (the customer who walks in), not lengths on a shared axis.
  const mult = (v: number) => (med > 0 ? (v || 0) / med : 0);
  const tiers = [
    { label: "Top 10%", v: o.top10_income_usd, m: mult(o.top10_income_usd) },
    { label: "Top 1%", v: o.top1_income_usd, m: mult(o.top1_income_usd) },
  ];
  const bands = ["very_equal", "fairly_equal", "moderate", "high", "very_high"]; const gi = bands.indexOf(o.gini_band);
  return (
    <Box>
      <Rail icon="spending-power" kicker="What customers earn" sample />
      <div className="focal mb-3 flex items-end justify-between p-4">
        <Stat value={k$(med)} label="Median earner" size="focal" accent />
        <div className="text-right text-[length:var(--t-micro)] leading-tight text-[var(--c-muted)]">the customer<br />who walks in</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {tiers.map((t) => (
          <div key={t.label} className="rounded-lg border border-[var(--c-border)] bg-[var(--c-card)] px-4 py-3 text-center">
            <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{t.label}</div>
            <Fig className="mt-0.5 text-[length:var(--t-sub)] leading-none text-[var(--c-ink)]">{t.m.toFixed(1)}x</Fig>
            <div className="mt-1 text-[length:var(--t-micro)] text-[var(--c-ink2)]">the median, at {k$(t.v)}</div>
          </div>
        ))}
      </div>
      {/* the notch strip carries named ends (Equal / Unequal) so it is never an anonymous
          scale , the one unlabeled axis the skeptic pass caught. */}
      <div className="mt-3 flex items-center gap-2 border-t border-[var(--c-border)] pt-3">
        <span className="text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">Equal</span>
        <div className="flex gap-1">{bands.map((b, i) => <span key={b} className="h-1.5 w-6 rounded-sm" style={{ background: i === gi ? "#8f8a86" : "#e3e3e3" }} />)}</div>
        <span className="text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">Unequal</span>
      </div>
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
  // Column names must say what the field actually IS (the B10 trust fix): the tax
  // column reads the blended tax_burden.total_pct, so it is "All-in tax load", never
  // "Business tax" (the hero's 19% is the corporation-tax rate, a different metric);
  // the cost column reads costs.license_setup_usd (registration + typical licence),
  // not the $16 registration fee on the timeline; the days column reads
  // setup.total_days (the day the slowest step, the bank, clears), not the day-1
  // registration the hero tile carries.
  const cols = [
    { key: "tax", label: "All-in tax load", unit: "%", get: (x: any) => x.tax_burden?.total_pct, cell: (v: number) => "" + Math.round(v), lowGood: true },
    { key: "reg", label: "Setup cost", unit: "$", get: (x: any) => x.costs?.license_setup_usd, cell: (v: number) => Math.round(v).toLocaleString("en-US"), lowGood: true },
    { key: "days", label: "Days to set up", unit: "", get: (x: any) => x.setup?.total_days, cell: (v: number) => "" + v, lowGood: true },
    /* VAT column REPLACED with employer on-cost (2026-07-08): the page's own tax section
       states VAT is customer-borne and sits outside the load, so crowning the lowest VAT
       contradicted it; the employer on-cost genuinely hits the owner. */
    { key: "oncost", label: "Employer on-cost", unit: "%", get: (x: any) => x.tax_burden?.employer_oncost_pct, cell: (v: number) => "" + v, lowGood: true },
    { key: "energy", label: "Energy", unit: "$/kWh", get: (x: any) => x.costs?.energy_usd_per_kwh, cell: (v: number) => v.toFixed(2), lowGood: true },
  ];
  const codes = ["GB", ...(d.meta?.peer_set ?? [])];
  const raw = codes.map((code) => { const j: any = SPINE_COUNTRIES[code] ?? null; return j ? { code, home: code === "GB", name: j.meta?.name ?? code, vals: cols.map((c) => c.get(j)) } : null; }).filter(Boolean) as any[];
  // HOME-EXCLUSION (the kit-index bestEntityForRow contract, applied server-side where
  // this table computes its flags): the home row is tinted, NEVER ranked , the best
  // crown goes to the best PEER.
  const peersOnly = raw.filter((r) => !r.home);
  const bestPeer = cols.map((c, i) => { const xs = peersOnly.map((r) => r.vals[i]).filter((v: any) => v != null); return xs.length ? (c.lowGood ? Math.min(...xs) : Math.max(...xs)) : null; });
  const colDefs = cols.map((c) => ({ key: c.key, label: c.label, unit: c.unit }));
  const tableRows = raw.map((r) => ({ name: r.name, home: r.home, cells: r.vals.map((v: number, i: number) => ({ raw: v ?? null, display: v == null ? "-" : cols[i].cell(v), best: !r.home && v != null && v === bestPeer[i] })) }));
  return (
    <Box><Head icon="compare" sample>How it compares, country by country</Head>
      {/* The old auto-verdict sentence ("beats every peer on X, and trails them all on
          Y") is deleted: the two-sided contrast-brag formula is the banned copy pattern
          (rulebook v1 §15, founder G7 2026-07-11); the table's bold-best already
          carries the read. */}
      <NeighboursTable cols={colDefs} rows={tableRows} />
      <div className="mt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">Best among the peers in each column is highlighted; the home row is tinted, never ranked. Click a header to sort.</div>
      {/* Pro seam: the fixed peer set is free; choosing your own comparison set is the
          paid move. Hidden in review builds (rulebook v1 §45: nothing veiled or locked
          in the founder's review copies); the seam returns at monetization. The dead
          no-href "Open Compare" anchor is deleted , never a fake affordance. */}
      {!isReviewBuild() ? (
        <div className="mt-3 rounded-lg border border-dashed border-[var(--c-border)] bg-[var(--c-soft)] px-3 py-2.5">
          <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">Set {d.meta?.name} against up to three countries you pick. <LockPill /></span>
        </div>
      ) : null}
    </Box>
  );
}

/* Competition , CUT (founder, ratified in the 2026-07-07 strategy interview after the
 * 2026-07-05 "reform or cut" flag). "How crowded the market is" reads near-identical for
 * every country (the same everyday trades are the crowded ones everywhere), so it fails
 * differentiate-or-die (rule 2), and its country-level saturation figures had no honest
 * source (rule 1). Crowding is a city/cell-altitude read; those pages carry it. */

/*
 * AdminLoad , the admin burden, restructured to the founder's ratified form (2026-07-05):
 * NON-expandable, no buttons, all visible, the content divided into THREE labelled
 * categories. The old "55 hours / 9 filings a year" focal is DROPPED , the founder called
 * it evasive and hard to source for every country (a universally-calculable metric is an
 * open point of debate); the online share stays as the one defensible figure, rendered
 * as a plain Stat pair (online / offline). Rulebook v1 §26: a lone number may stay a
 * number , the S7 "must become a chart" corollary that made this a ShareStack bar is
 * repealed (2026-07-11).
 * width: WideRail [2] , the narrow card beside DigitalPayments.
 * terracotta: the online figure only (the answer).
 */
function AdminLoad({ d }: { d: any }) {
  const a = d.admin_load ?? {};
  const bullets: string[] = a.bullets ?? [];
  // The seed's three bullets map onto the three fixed categories; a country with fewer
  // simply shows fewer rows (CatRows drops empty values).
  const rows: Array<[string, any]> = [
    ["Tax & VAT", bullets[0]],
    ["Returns", bullets[1]],
    ["Payroll", bullets[2]],
  ];
  const onlinePct = typeof a.online_pct === "number" ? a.online_pct : null;
  return (
    <Box><Rail icon="red-tape" kicker="The admin load" sample />
      {onlinePct != null ? (
        <div className="focal mb-3.5 grid grid-cols-2 gap-4 p-4">
          <Stat value={<>{onlinePct}%</>} label="Done online" size="focal" accent />
          <Stat value={<>{Math.max(0, 100 - onlinePct)}%</>} label="Offline" size="focal" />
        </div>
      ) : null}
      <CatRows rows={rows} />
    </Box>
  );
}

/* ================= CHAPTER 5 ================= */
/*
 * Cities , the FIRST section after the hero (the founder's locked choice, 2026-07-05):
 * the places story is the missing link between the country and a real trade. The map
 * LEADS, shorter than the full-page map, with the cities standing in a row BELOW it. No
 * featured city: every pin is ink and every card reads the same (peers shown equally),
 * the only differentiation is the honest one, dot size = market reach. The capital carries
 * the one live link into its own page (the funnel), because it is the one city that HAS a
 * page, not because it is elevated.
 * width: Full , map over cities. terracotta: none (a calm places band; the accent budget
 * belongs to the hero above).
 */
function Cities({ d }: { d: any }) {
  const list = (d.cities?.list ?? []).slice().sort((a: any, b: any) => (b.market_index_vs_capital ?? 0) - (a.market_index_vs_capital ?? 0));
  // S13 universality: meta carries no capital field yet, so the top-ranked city (the
  // market index's own 100 baseline) stands in as the reference point the map, legend
  // and caption name, never a hardcoded "London".
  const countryName: string = d.meta?.name ?? "the country";
  const topCityName: string = d.meta?.capital ?? list[0]?.name ?? countryName;
  // Cards are the ranked city list below the map: name + character + the index figure.
  // Static (the map carries the interaction) and identical in styling, so no city is
  // visually featured; the map's dot size is the single shape-encoding of the same index.
  const cards = list.map((c: any) => (
    <div key={c.slug} className="w-full overflow-hidden rounded-lg border border-[var(--c-border)] bg-[var(--c-card)]">
      <div className="px-3 py-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <div className="min-w-0 truncate text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{c.name}</div>
          {typeof c.market_index_vs_capital === "number" ? <Fig className="shrink-0 text-[length:var(--t-body)] text-[var(--c-ink)]">{c.market_index_vs_capital}</Fig> : null}
        </div>
        <div className="truncate text-[length:var(--t-micro)] text-[var(--c-ink2)]">{c.character}</div>
      </div>
    </div>
  ));
  // Every pin ink (no featured city); dot size = market reach. The capital keeps the one
  // live link because it is the one city with its own page, the down-funnel step. SpineMap
  // declutters colliding labels at first paint, so the central cluster never overprints.
  const points: SpinePoint[] = list
    .filter((c: any) => typeof c.lat === "number" && typeof c.lng === "number")
    .map((c: any) => ({ name: c.name, slug: c.slug, lat: c.lat, lng: c.lng, signal: c.market_index_vs_capital, signalLabel: `market ${c.market_index_vs_capital} vs ${topCityName} 100`, sub: c.character, tone: "ink", href: c.slug === "london" ? "/dev/spine-city" : undefined }));
  return (
    <Box>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2"><Ico id="neighborhood" /><span className="text-[length:var(--t-lead)] font-semibold text-[var(--c-ink)]">Where the business is, city by city</span><SampleTag /></div>
        <a href="/countries" className="shrink-0 cursor-pointer rounded-full border border-[var(--c-border)] px-3 py-1 text-[length:var(--t-body)] font-semibold text-[var(--c-ink2)] transition hover:border-[var(--terra-border)] hover:text-[var(--terra-text)]">Open the directory &#8594;</a>
      </div>
      {/* map leads, shorter than the full-page map; the cities stand in a row below it. */}
      <SpineMap points={points} ariaLabel={`Map of the main ${countryName} business cities`} fitPadding={60} heightClass="h-[300px] w-full md:h-[360px]" legendLabel={`Dot size = market reach, ${topCityName} = 100`} />
      <div className="mt-3"><Conveyor ariaLabel="The main cities" itemMinPx={150} gapPx={12}>{cards}</Conveyor></div>
    </Box>
  );
}

/*
 * TradeLinks , the down-funnel into the everyday trades. The old SixTradesTakeHome
 * ranked a per-trade after-tax take-home (London figures presented as a country
 * ranking), the unknowable-metric class the rulebook bans (v1 §5, founder G6
 * 2026-07-11: no statistical basis); the ranking is deleted whole. The section's one
 * legitimate job survives (rulebook v1 §24): plain link cards into each trade's own
 * cell page, where the decision and the paid depth live , the Close card grammar.
 * width: Full. terracotta: none (hover-only on real links, the Close card rule).
 */
/* slug -> the business-type icon (the trade family added 2026-07-08). Unknown slugs
 * carry no icon rather than a wrong one. Dental is out of the slate (rulebook v1 §32). */
const TRADE_ICON: Record<string, import("@/components/brand/icons").AtlasIconId> = {
  "restaurants": "trade-restaurant",
  "grocery-stores": "trade-grocery",
  "cafes-coffee": "trade-cafe",
  // industryToSlug derives from the display name, so cafes arrive as the longer slug
  "cafes-coffee-shops": "trade-cafe",
  "sports-fitness": "trade-gym",
  "auto-repair-shops": "trade-auto",
  "hairdressers-beauty": "trade-salon",
  "bars-nightclubs": "trade-bar",
};
/* slug -> canonical rule-32 label, so a link reads "Gym" not "Sports & fitness",
 * "Salon" not "Hairdressers & beauty" (rulebook v2 §32 synonym collapse). */
const TRADE_NAME: Record<string, string> = {
  "restaurants": "Restaurant",
  "grocery-stores": "Grocery",
  "cafes-coffee": "Cafe",
  "cafes-coffee-shops": "Cafe",
  "sports-fitness": "Gym",
  "auto-repair-shops": "Auto repair",
  "hairdressers-beauty": "Salon",
};
function TradeLinks({ trades }: { trades: Array<{ name: string; slug: string; href: string }> }) {
  if (!trades.length) return null;
  return (
    <Box>
      <Rail icon="high-street" kicker="The everyday trades" />
      {/* flex-wrap + grow: rows fill edge to edge for any count, so an odd number of
          cards never leaves a blank grid cell (rulebook v2 §17). */}
      <div className="flex flex-wrap gap-2.5">
        {trades.map((t) => (
          <a key={t.slug} href={t.href} className="group cityhov flex grow basis-[47%] items-center justify-between gap-3 rounded-xl border border-[var(--c-border)] bg-[var(--c-card)] px-4 py-3.5 md:basis-[31%]">
            <span className="flex min-w-0 items-center gap-2.5">
              {TRADE_ICON[t.slug] ? <AtlasIcon id={TRADE_ICON[t.slug]} size={16} className="spine-ic shrink-0" style={{ color: "var(--c-ink2)" }} /> : null}
              <span className="min-w-0 truncate text-[length:var(--t-body)] font-semibold text-[var(--c-ink)] group-hover:text-[var(--terra-text)]">{TRADE_NAME[t.slug] ?? t.name}</span>
            </span>
            <span className="shrink-0 text-[var(--c-muted)] transition group-hover:text-[var(--terra-text)]">&#8594;</span>
          </a>
        ))}
      </div>
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">Open a trade for the full build-up.</p>
    </Box>
  );
}
/*
 * EasiestTrades , reframed (founder 2026-07-05) from "easiest to start" (ease-sorted) to
 * TYPICAL BUSINESSES and what they COST TO START. "Online retail" removed; NOT sorted by
 * cheapness (sorted by capital, heaviest first, so it never reads as a cheap-first ranking).
 * NOTE: these are the seed's illustrative openings; aligning them to the site-wide canonical
 * six + a real cost-to-open is a flagged data need.
 * width: Even. terracotta: none (a plain reference table).
 * D4 fix (2026-07-10): a trade with no real cost_to_open_usd used to fall through the old
 * `?? 0` fallback and render as a real-looking "$0K" bar. The filter below now drops any
 * row without a real, positive cost instead of fabricating a zero.
 */
const isNum = (v: number | null | undefined): v is number =>
  v != null && Number.isFinite(v);
function EasiestTrades({ d }: { d: any }) {
  // ONE vocabulary (rule 22, rulebook v1 §32): the seed's openings map onto the locked
  // canonical six + cafe/bar (Convenience shop reads as Grocery, Hair & beauty as
  // Salon). Dental is OUT (founder G9 2026-07-11: no out-of-context trade forced in);
  // off-slate rows (cleaning, online retail) are dropped rather than spoken in a second
  // vocabulary. Costs for the missing canonical trades (pharmacy, gym, auto repair) are
  // an open data need, added when sourced. Pharmacy has no trade icon yet, so its row
  // carries none rather than a wrong one.
  const canon = (n: string): { name: string; icon: import("@/components/brand/icons").AtlasIconId | null } | null => {
    if (/restaurant/i.test(n)) return { name: "Restaurant", icon: "trade-restaurant" };
    if (/convenience|grocery/i.test(n)) return { name: "Grocery", icon: "trade-grocery" };
    if (/pharmac|chemist/i.test(n)) return { name: "Pharmacy", icon: null };
    if (/hair|beauty|salon/i.test(n)) return { name: "Salon", icon: "trade-salon" };
    if (/cafe/i.test(n)) return { name: "Cafe", icon: "trade-cafe" };
    if (/gym|fitness/i.test(n)) return { name: "Gym", icon: "trade-gym" };
    if (/auto|repair/i.test(n)) return { name: "Auto repair", icon: "trade-auto" };
    if (/\bbar\b|pub|night/i.test(n)) return { name: "Bar", icon: "trade-bar" };
    return null;
  };
  const list = (d.trades_to_start?.list ?? [])
    .map((t: any) => ({ ...t, c: canon(t.name || "") }))
    .filter((t: any) => t.c && isNum(t.cost_to_open_usd) && t.cost_to_open_usd > 0)
    .sort((a: any, b: any) => (b.cost_to_open_usd ?? 0) - (a.cost_to_open_usd ?? 0));
  if (!list.length) return null;
  // Plain 3-column table (the July-3 city-page form; rulebook v1 §25: the per-row cost
  // MiniBars are cut in the bar rationing). Ease = 100 minus the seed's hardship score,
  // the July-3 transform ("ease 82 of 100"); a row without a hardship shows no ease.
  return (
    <Box><Head icon="startup-cost">Typical businesses, and what they cost to start</Head>
      <div className="grid grid-cols-[minmax(0,1fr)_76px_64px] gap-2.5 border-b border-[var(--c-border)] pb-1.5 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
        <span>Trade</span><span className="text-right">Ease /100</span><span className="text-right">To open</span>
      </div>
      <div className="divide-y divide-[var(--c-border)]">{list.map((t: any) => (
        <div key={t.c.name} className="grid grid-cols-[minmax(0,1fr)_76px_64px] items-baseline gap-2.5 py-2">
          <span className="flex min-w-0 items-center gap-2">
            {t.c.icon ? <AtlasIcon id={t.c.icon} size={16} className="spine-ic shrink-0" style={{ color: "var(--c-ink2)" }} /> : null}
            <span className="min-w-0 truncate text-[length:var(--t-body)] text-[var(--c-ink2)]">{t.c.name}</span>
          </span>
          {isNum(t.hardship_0_100) ? <Fig className="text-right text-[length:var(--t-body)] text-[var(--c-ink)]">{Math.max(0, Math.min(100, 100 - t.hardship_0_100))}</Fig> : <span />}
          <Fig className="text-right text-[length:var(--t-body)] text-[var(--c-ink)]">${Math.round((t.cost_to_open_usd ?? 0) / 1000)}K</Fig>
        </div>))}
      </div>
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">A rough cost to open the doors; higher ease means fewer hurdles before trading.</p>
    </Box>
  );
}
/*
 * Insurance , the covers a business carries. Founder 2026-07-05: too sparse , rows WAY
 * bigger, more info per category, clear visual hierarchy, everything visible (the pop-up
 * hid the substance). Each cover is an open row: name + required/optional + cost on the
 * top line, covers / who in two labelled columns beneath, the practical note under them.
 * Even more per-cover detail (excess levels, typical claims) is a flagged data need.
 * width: Full. terracotta: the one "required by law" chip only (the single legal must).
 */
function Insurance({ d }: { d: any }) {
  const covers = d.insurance?.covers ?? [];
  if (!covers.length) return null;
  return (
    <Box><Head icon="safety">Insurance the business carries</Head>
      <div className="divide-y divide-[var(--c-border)]">
        {covers.map((c: any, i: number) => (
          <div key={i} className="py-4 first:pt-1 last:pb-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{c.name}</span>
              <span className="flex items-center gap-2.5">
                {c.required ? <span className="rounded-full bg-[var(--terra-soft)] px-2 py-0.5 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--terra-text)]">required by law</span> : <span className="rounded-full bg-[var(--c-soft)] px-2 py-0.5 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">optional</span>}
                <Fig className="text-[length:var(--t-lead)] text-[var(--c-ink)]">${c.typical_usd}<span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">/yr</span></Fig>
              </span>
            </div>
            <div className="mt-2 grid gap-x-7 gap-y-1.5 sm:grid-cols-2">
              <div className="flex gap-2.5"><span className="w-16 shrink-0 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Covers</span><span className="text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{c.covers}</span></div>
              <div className="flex gap-2.5"><span className="w-16 shrink-0 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Who</span><span className="text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{c.who}</span></div>
            </div>
            <p className="mt-1.5 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{c.note}</p>
          </div>
        ))}
      </div>
    </Box>
  );
}
/*
 * SellingAbroad , how open the country is to exporters and where it sells.
 * verdict: An open trading economy; its biggest export markets are a short list of neighbours.
 * focal: the openness verdict word, then the top export markets as an ORDERED FIGURE
 * LIST (rank number + share). The audit offered ranked bars IF the census allowed;
 * the ranked-bar family is already at its page budget, so the ordered list is the
 * dictionary-clean fallback , the ranks carry the order, the figures carry the spread.
 * width: Even , paired peer to EasiestTrades in CH5.
 * terracotta: the openness verdict word only.
 */
function SellingAbroad({ d }: { d: any }) {
  const e = d.exporting ?? {};
  // Founder: rename "openness" -> "how easy it is to export". The Meter is cut in the
  // bar rationing (rulebook v1 §25/§26); the verdict word + figure carry the read, then
  // the top export markets run full width so no half sits empty (rulebook v1 §17).
  const partners = (e.partners ?? []).slice().sort((a: any, b: any) => b.pct - a.pct);
  return (
    <Box><Head icon="global-spread" sample>How easy it is to export</Head>
      <div className="mb-3 flex items-baseline gap-2"><Fig className="text-[length:var(--t-sub)] text-[var(--c-ink)]">{e.openness_0_100}<span className="text-[length:var(--t-body)] text-[var(--c-muted)]"> / 100</span></Fig><span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">ease of exporting from here</span></div>
      {/* quiet where not sourced: the procedures detail (timings, paperwork, trade
          deals) fills in when researched per country , never a builder note here. */}
      <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Top markets, share of exports</div>
      <div className="mt-1.5 divide-y divide-[var(--c-border)]">{partners.map((p: any, i: number) => (
        <div key={p.name} className="hov -mx-2 flex items-baseline gap-2.5 rounded-md px-2 py-1.5">
          <span className="fig w-4 shrink-0 text-[length:var(--t-micro)] text-[var(--c-muted)]">{i + 1}.</span>
          <span className="min-w-0 flex-1 truncate text-[length:var(--t-body)] text-[var(--c-ink)]">{p.name}</span>
          <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]">{p.pct}%</Fig>
        </div>))}</div>
    </Box>
  );
}
/*
 * Character , the two agreed 6-spectra tables (gov-business + culture-outsider), KEPT
 * per the founder's density note , but the RAIL TREATMENT is refit: the old 12
 * full-width terracotta gradient rails put ~15 accent marks on one screenful (the
 * page's hard budget violation) and the terra-to-grey ramp implied a good-to-bad value
 * scale the qualitative pole labels never claimed. Now: neutral tracks, a centre tick,
 * ink markers, the leaned-toward pole in bold ink, and ONE terracotta marker per table
 * (its strongest lean). ~15 marks -> 2.
 * verdict: A clean, rules-led place to deal with; reserved and direct to work in.
 * width: Full , two spectra columns side by side.
 * terracotta: one marker per table, the strongest lean.
 */
/* Founder Character fixes (2026-07-05): shorter bars so words fit on one line; fixed label
 * colours (LEFT gray, RIGHT black); and, where a spectrum HAS a worse-for-business end (the
 * government table), a gradient track from dark gray (LEFT = worse) to terracotta (RIGHT =
 * better). The culture table has no worse/better end, so it keeps a neutral track with a
 * centre tick (a worse->better gradient there would mislead, principle: form = meaning). The
 * per-category "?" gloss is a flagged follow-up (needs a plain-language line per spectrum). */
/* The plain-language gloss per spectrum (founder: a "?" LEFT of each category, wording an
 * average person understands). Keyed by the seed's spectrum ids; a row without a gloss
 * simply renders no tip, so new spectra degrade gracefully. */
const SPECTRUM_GLOSS: Record<string, string> = {
  dealing: "How often bribes or favours are needed to get things done here.",
  rules: "How often the rules of doing business change.",
  enforcement: "How reliably a signed contract can be enforced.",
  paperwork: "How much form-filling the state demands of a business.",
  tax_clarity: "How easy the tax system is to understand and get right.",
  courts: "How strong and independent the courts are in a dispute.",
  expression: "How openly people show what they think.",
  directness: "How directly people say yes and no.",
  formality: "How formal dress and manners are in business.",
  pace: "How fast daily business moves.",
  orientation: "Whether deals run on personal relationships or on rules.",
  openness: "How quickly strangers get down to real business.",
};
/* SpectraTable now lives in the kit (shared with the city page's character section, rule
 * 22); the culture table renders equal-weight poles there (no implied better end), the
 * government table keeps the worse-gray -> better-terracotta gradient. */
function Character({ d }: { d: any }) {
  const gov = d.character?.gov_business ?? [];
  // Typo fix (founder): casual / formal were the wrong way round. Swap the formality poles
  // (keeping the marker position) so the reserved UK reads as leaning formal.
  const culture = (d.character?.culture_outsider ?? []).map((r: any) =>
    r.spectrum === "formality" || /casual/i.test(r.left_label ?? "")
      ? { ...r, left_label: r.right_label, right_label: r.left_label }
      : r,
  );
  const glossFor = (s: string) => SPECTRUM_GLOSS[s];
  return (
    <Box>
      {/* icon: ease-of-business, not the bribe-envelope corruption glyph, which asserted
          the opposite of the "clean, rules-led" verdict beneath it (form=meaning). */}
      <Rail icon="ease-of-business" kicker="The character of the place" />
      <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
        <div>
          <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Government, from a business view</div>
          <SpectraTable rows={gov} gradient glossFor={glossFor} />
        </div>
        <div>
          <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Culture, from an outsider view</div>
          <SpectraTable rows={culture} glossFor={glossFor} />
        </div>
      </div>
      <div className="mt-2.5 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">In government, the left end is the worse-for-business one (dark) and the right is better (terracotta). The culture spectra have no better end: they are just different places to run a business.</div>
    </Box>
  );
}
/*
 * Locals , the practical intel an operator learns on the ground (fully free honesty layer).
 * verdict: A handful of things new owners get wrong; locals price them in from the start.
 * focal: each intel item as a titled line; no chart, this is plain operator knowledge.
 * width: Full , a two-column note grid.
 * terracotta: none , list markers are never the accent (the kit Bullets law).
 */
function Locals({ d }: { d: any }) {
  const items = d.character?.locals_intel ?? [];
  if (!items.length) return null;
  return (
    <Box><Head icon="locals-know">What locals know</Head>
      <div className="grid gap-x-7 gap-y-3 sm:grid-cols-2">{items.map((it: any, i: number) => (
        <div key={i} className="flex gap-2.5"><span className="mt-0.5 text-[var(--c-muted)]">&#9656;</span><span className="text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]"><b className="text-[var(--c-ink)]">{it.title}</b> {it.detail}</span></div>))}
      </div>
    </Box>
  );
}
/*
 * Exit , how sellable the business is when you want out. Founder 2026-07-05: the single
 * sale-price and the time-to-sell figures are REMOVED (both too business-dependent to state
 * per country); the section becomes a fully-visible table on the selling INFRASTRUCTURE, how
 * present INSTITUTIONAL buyers are (vs the owner-operator norm), and valuation as a profit
 * MULTIPLE, an idea of how businesses are valued without one fake headline figure.
 * width: WideRail [1] , the wider card, beside the narrower risk register.
 * terracotta: none (a reference table; the accent belongs to the risk card beside it).
 */
function Exit({ d }: { d: any }) {
  const e = d.risk_exit?.exit ?? {};
  const buyers: string[] = e.buyers ?? [];
  const institutional = buyers.filter((b) => /equity|strategic|acquir|search fund|institution/i.test(b));
  const rows: Array<[string, any]> = [
    // Bound to e.climate: the label and the score are the country's real reading, never
    // a fixed "mature broker market" clause that would self-contradict on a thin one.
    ["Selling market", e.climate ? <>{cap(e.climate)}{typeof e.climate_score_0_100 === "number" ? <> <Fig className="text-[var(--c-ink)]">{e.climate_score_0_100}</Fig><span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">/100</span></> : null}</> : null],
    ["Who buys", institutional.length ? <>Institutional buyers are present, {institutional.join(", ").toLowerCase()}, alongside the individual owner-operators who buy most small firms.</> : "Mostly individual owner-operators; institutional buyers are thin on the ground."],
    ["What lifts the price", "Clean books and a customer base that transfers without the founder; asset sales suit micro-firms, share sales the larger ones."],
    ["Typical valuation", e.multiple_low ? <>About <Fig className="text-[var(--c-ink)]">{e.multiple_low}x to {e.multiple_high}x</Fig> a year&apos;s profit for a small firm.</> : null],
  ];
  return (
    <Box><Head icon="sale-tag">How sellable a business is</Head>
      <CatRows rows={rows} />
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">Valuation is a profit multiple, not a headline sale price: the real figure turns on the trade and the books.</p>
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
    <Box><Rail icon="min-wage" kicker="Working here, the rules" />
      {/* Founder: give the union figure the SAME weight as paid holiday (equal size), a
          symmetrical pair; holiday keeps the one terracotta accent, the union label sits below. */}
      <div className="focal mb-3 grid grid-cols-2 gap-4 p-4">
        <Stat value={<>{e.holiday_days}</>} label="Paid holiday days a year" size="focal" accent />
        <Stat value={<>{e.union_pct}%</>} label="In a union" size="focal" />
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
  const c = d.closing ?? {};
  // Founder: do NOT grade it. "Manageable" is true for ~90% of countries, so the grade is
  // non-differentiating; lead with the PROCEDURES and how different kinds of firm wind down.
  // The time + cost stay as small supporting facts, not a headline verdict.
  const months = String(c.time_months ?? "").replace(/\s+to\s+/g, "-");
  return (
    <Box><Rail icon="vacancy" kicker="If it doesn't work, getting out" />
      <CatRows rows={[["If solvent", c.solvent], ["If insolvent", c.insolvent], ["Your liability", c.liability]]} />
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--c-border)] pt-3">
        <div><Fig className="text-[length:var(--t-lead)] text-[var(--c-ink)]">{months}</Fig><span className="ml-1.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">months, typical</span></div>
        <div><Fig className="text-[length:var(--t-lead)] text-[var(--c-ink)]">{c.cost_pct}%</Fig><span className="ml-1.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">of assets in cost</span></div>
      </div>
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
  // Wave-2 altitude marks: each down-funnel link carries the mark of the LEVEL it opens
  // (city / business), real wayfinding status, never decoration.
  const links: Array<{ t: string; href?: string; mark: "alt-city" | "alt-business" }> = [
    { t: `${city?.name}, the deepest ${d.meta?.name} market`, href: city?.slug === "london" ? "/dev/spine-city" : undefined, mark: "alt-city" },
    { t: `What a restaurant in ${city?.name} actually keeps`, href: "/dev/spine-cell", mark: "alt-business" },
  ];
  return (
    <Box className="flex flex-col items-start gap-4">
      <Head icon="verdict">Where to go from here</Head>
      <p className="max-w-[62ch] text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">You have the country picture: the tax take, the setup, the costs and the market. The decision gets sharper one level down, in a single city and then a single trade.</p>
      <div className="grid w-full gap-2.5 sm:grid-cols-2">
        {links.map((l, i) => {
          const Tag: any = l.href ? "a" : "div";
          return (
            <Tag key={i} href={l.href} className={`group flex items-center justify-between gap-3 rounded-xl border border-[var(--c-border)] bg-[var(--c-card)] px-4 py-3.5 ${l.href ? "cityhov" : "opacity-75"}`}>
              <span className="flex min-w-0 items-center gap-2.5">
                <AtlasMark id={l.mark} size={20} className="shrink-0 opacity-80" />
                <span className={`text-[length:var(--t-body)] font-semibold text-[var(--c-ink)] ${l.href ? "group-hover:text-[var(--terra-text)]" : ""}`}>{l.t}</span>
              </span>
              {/* chrome is ink; terracotta is hover-only on real links. An unlinked row (the
                  city's page is not held yet) carries the wave-2 "not-held" mark instead of a
                  dead arrow , a real gate in the code, never a fake affordance. */}
              {l.href
                ? <span className="shrink-0 text-[var(--c-muted)] transition group-hover:text-[var(--terra-text)]">&#8594;</span>
                : <AtlasMark id="not-held" size={16} className="shrink-0" />}
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
  // Pre-sorted descending + sort={false}: this is a payment-method MIX whose leader
  // (Card) IS the terracotta answer, not a cost stack with a kept remainder , the kit
  // StackBar's kept-last pin would shuffle the leader to the end and break the
  // monotonic left-to-right read. Greys already track magnitude.
  const methods: any[] = (p.methods ?? []).slice().sort((a: any, b: any) => b.pct - a.pct);
  const mcolor: any = { "Card": TERRA, "Bank transfer": "#737373", "Cash": "#a3a3a3", "Digital wallet": "#d4d4d4" };
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
    <Box><Head icon="payments">Getting paid, and the cash it costs</Head>
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="md:w-[52%]">
          <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">How customers pay</div>
          <StackBar h="h-9" sort={false} segments={methods.map((m: any) => ({ label: m.name, pct: m.pct, color: mcolor[m.name] ?? "#ededed" }))} legend legendClassName="mt-2 flex flex-wrap gap-x-3 gap-y-1" ariaLabel={methods.map((m: any) => `${m.name} ${m.pct}%`).join(", ")} />
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-2.5">
            {tiles.map(([v, l, fig]) => <div key={l} className="hov rounded-lg border border-[var(--c-border)] p-3">{fig ? <Fig className="text-[length:var(--t-sub)] text-[var(--c-ink)]">{v}</Fig> : <div className="text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{v}</div>}<div className="mt-0.5 text-[length:var(--t-micro)] leading-tight text-[var(--c-ink2)]">{l}</div></div>)}
          </div>
        </div>
      </div>
    </Box>
  );
}

/*
 * Licensing , the permits a trade needs before it opens. Upgraded to POP-UPS (Expand, the
 * legal-structure pattern, founder 2026-07-05): each trade opens to a why / when / how
 * schematic. Honesty flag: rich WHERE SOURCED, a cost bullet is shown only where a real
 * fee exists (the seed holds none per trade), never invented. NOTE: the founder also asked
 * for per-trade business-type ICONS, which the AtlasIcon set does not yet carry (no cafe /
 * taxi / childcare glyphs); flagged as an icon-asset need, section icon used meanwhile.
 * width: WideRail [1] , the BIG card (~60%), beside the narrower visa routes.
 * terracotta: none (ordinary reference section, ink tile).
 */
/* licence trade name -> its business-type icon (founder: icons guide the visitor). */
function licenceIcon(trade: string): import("@/components/brand/icons").AtlasIconId | null {
  const t = (trade || "").toLowerCase();
  if (/cafe|takeaway|coffee/.test(t)) return "trade-cafe";
  if (/bar|alcohol|restaurant/.test(t)) return "trade-bar";
  if (/childcare|nursery/.test(t)) return "trade-childcare";
  if (/taxi|private hire/.test(t)) return "trade-taxi";
  if (/retail|online|shop/.test(t)) return "trade-retail";
  return null;
}
function Licensing({ d }: { d: any }) {
  const list = d.licensing?.list ?? [];
  const none = (s: string) => /^none$/i.test((s || "").trim());
  return (
    <Box><Head icon="licence-specific">Licences and permits by trade</Head>
      <p className="mb-3 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">Most trades open the day the company is registered; a few are gated by a permit. Open a trade for what it needs and how long it takes.</p>
      <div className="space-y-2">{list.map((it: any, i: number) => {
        const needsPermit = !none(it.licence);
        const ic = licenceIcon(it.trade);
        return (
          <Expand key={i} name="licensing" title={<span className="flex items-center gap-2">{ic ? <AtlasIcon id={ic} size={15} className="spine-ic shrink-0" style={{ color: "var(--c-ink2)" }} /> : null}{it.trade}</span>} open={i === 0} right={<span className={`shrink-0 rounded-full px-2 py-0.5 text-[length:var(--t-micro)] font-medium ${needsPermit ? "border border-[var(--c-border)] text-[var(--c-ink2)]" : "bg-[var(--c-soft)] text-[var(--c-muted)]"}`}>{it.lead_time}</span>}>
            {needsPermit ? (
              <div className="space-y-1.5">
                <div className="flex gap-2.5"><span className="w-11 shrink-0 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">What</span><span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">{it.licence}</span></div>
                <div className="flex gap-2.5"><span className="w-11 shrink-0 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">When</span><span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">Allow {String(it.lead_time).toLowerCase()} before opening.</span></div>
                {it.context ? <div className="flex gap-2.5"><span className="w-11 shrink-0 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">How</span><span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">{it.context}</span></div> : null}
              </div>
            ) : (
              <p className="text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">No trade permit needed. You can begin trading the day the company is registered.{it.context ? ` ${it.context}` : ""}</p>
            )}
          </Expand>
        );
      })}
      </div>
      {/* wave-2 "proof" mark: the sourced-only rule is real in this section's code (a cost
          bullet renders only where a real fee exists). */}
      <p className="mt-3 flex items-start gap-1.5 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]"><AtlasMark id="proof" size={13} className="mt-px shrink-0" /><span>Shown where the permit route is sourced; trades not listed carry no special permit.</span></p>
    </Box>
  );
}
/*
 * Immigration , the visa routes a foreign FOUNDER can use (founder 2026-07-05 redesign).
 * The Skilled Worker (hire-from-abroad) route is REMOVED for every country: the page
 * speaks to a foreigner opening a business, not an employee. All routes sit as numbered
 * dots on ONE shared Harder-to-Easier rail (the July-3 approved single-rail form,
 * rulebook v1 §25; the per-route MiniBars are cut in the bar rationing), then each
 * route carries two lines, who it is for and how to get it, all visible (no pop-up).
 * HONESTY: the per-route "how" is authored from public UK visa facts for the GB exemplar
 * and belongs in the seed per country (immigration.routes[].how) at promotion. The founder
 * also wants a rich second part, incentives for foreigners, which the seed does not hold;
 * that is flagged as an open per-country data need (pointer to grants below meanwhile).
 * width: WideRail [2] , the narrow card (~40%), beside the big licences card.
 * terracotta: the easiest route's dot only (the July-3 answer mark).
 */
function Immigration({ d }: { d: any }) {
  const routes = (d.immigration?.routes ?? [])
    .filter((r: any) => !/skilled worker/i.test(r.name || ""))
    .map((r: any) => ({ ...r, ease: Math.max(6, Math.min(96, 100 - (r.difficulty_0_100 ?? 50))) }))
    .sort((a: any, b: any) => b.ease - a.ease);
  if (!routes.length) return null;
  const easeWord = (v: number) => (v >= 55 ? "Easier" : v >= 35 ? "Moderate" : "Harder");
  const howMap: Record<string, string> = {
    "Innovator Founder visa": "An endorsing body backs a new, scalable idea; a three-year visa that leads to settlement.",
    "Global Talent visa": "Endorsement as a leader or promising talent, no job offer needed, with fast settlement.",
    "Self-sponsorship": "Set up a UK company that sponsors your own visa; needs a sponsor licence and a genuine role.",
  };
  return (
    <Box><Head icon="visa-permit">Visa routes for a foreign founder</Head>
      {/* ONE shared rail: every route a numbered dot at its ease position; the numbers
          key into the list below. The easiest route's dot is the one answer mark. */}
      <div className="relative mb-2 mt-3 h-[6px] rounded-full" style={{ background: "var(--c-soft2)" }} role="img" aria-label={`Visa routes from harder to easier: ${routes.map((r: any, i: number) => `${i + 1} ${r.name}, ${easeWord(r.ease)}`).join("; ")}`}>
        {routes.map((r: any, i: number) => (
          <span key={r.name} className={`fig absolute top-1/2 grid h-4 w-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-[9px] font-semibold leading-none ${i === 0 ? "border-[var(--terra-border)] text-white" : "border-[var(--c-line-strong)] bg-white text-[var(--c-ink)]"}`} style={{ left: `${r.ease}%`, ...(i === 0 ? { background: TERRA } : {}) }}>{i + 1}</span>
        ))}
      </div>
      <div className="mb-3 flex justify-between text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]"><span>Harder to get</span><span>Easier to get</span></div>
      <div className="space-y-3.5">{routes.map((r: any, i: number) => {
        // Honest fallback (S13): howMap is authored from public UK visa facts, so a
        // route name it does not recognize (any non-GB country) must NEVER borrow the
        // UK's generic filler. Prefer the seed's own r.how (wired per country at
        // promotion, a later data task); with neither, omit the "how" line entirely.
        const how = howMap[r.name] ?? r.how;
        return (
        <div key={r.name} className="border-b border-[var(--c-border)] pb-3 last:border-0 last:pb-0">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-baseline gap-2">
              <span className="fig w-4 shrink-0 text-[length:var(--t-micro)] text-[var(--c-muted)]">{i + 1}.</span>
              <span className="min-w-0 truncate text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{r.name}</span>
            </span>
            <span className="fig shrink-0 text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">{easeWord(r.ease)}</span>
          </div>
          <p className="mt-1.5 text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)]"><b className="font-medium text-[var(--c-ink)]">For</b> {String(r.forwho).toLowerCase()}.</p>
          {how ? <p className="text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)]"><b className="font-medium text-[var(--c-ink)]">How</b> {how}</p> : null}
        </div>
        );
      })}
      </div>
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">Founder routes only; hire-from-abroad visas are for employees, not owners. Fiscal incentives for locating here are covered under grants and incentives below.</p>
    </Box>
  );
}

export default async function SpinePage() {
  const d = GB;
  // The everyday-trade links, gated on the same engine the city page runs: a trade with
  // no modeled cell page is absent, never a dead link. No figures, no ranking (v1 §5).
  const trades = await londonTradeLinks();
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-8 md:px-6">
      <Hero d={d} />

      {/* CH1 , the lay of the land. The hero has already given the country-altitude answer
          (what the state takes), so this chapter orients: WHERE the business is (the map +
          cities, the founder's locked first section), the six-lens profile beside the one
          honesty band, then the plain link cards down into the everyday trades' cell pages
          (the old take-home ranking is deleted, rulebook v1 §5 / founder G6 2026-07-11). */}
      {/* heading trimmed with the funnel: "and what you keep" named the deleted take-home
          ranking (G6); one plain descriptive title per rulebook v1 §12 */}
      <Movement eyebrow="The lay of the land" heading="Where to trade" icon="gut-check" index="01" />
      <div className="space-y-5">
        <Cities d={d} />
        <Even><Profile d={d} /><TheCatch d={d} /></Even>
        <TradeLinks trades={trades} />
      </div>

      {/* CH2 , getting set up. ONE setup timeline (SetupStepper + First-90-Days merged into
          SetupTimeline), so the chapter runs Full timeline -> Even pair -> Full tax bars ->
          Even pair. No duplicate timeline, no fake-Gantt. */}
      <Movement eyebrow="Getting set up" heading="The cost and time to start" icon="register-cost" index="02" />
      <div className="space-y-5">
        <SetupTimeline d={d} />
        <WideRail><Formation d={d} /><Banking d={d} /></WideRail>
        <TaxByLevel d={d} />
        <WideRail><Licensing d={d} /><Immigration d={d} /></WideRail>
      </div>

      {/* CH3 , money and team. Wage ladder paired with hiring-ease so the chapter opens on a
          peer band, then the cost + financing pairs. No lone Full band here: Financing and
          Grants ride one Even pair (their own stated width, rulebook v1 §17). */}
      <Movement eyebrow="The money and the team" heading="The cost of money and people" icon="wages" index="03" />
      <div className="space-y-5">
        <Even><PayByLevel d={d} /><TalentDepth d={d} /></Even>
        <Even><OperatingCosts d={d} /><HiringDials d={d} /></Even>
        <Even><Financing d={d} /><Grants d={d} /></Even>
      </div>

      {/* CH4 , the market. Renamed after Competition's cut (the old "rivals" title promised
          content that no longer exists). Demand pairs with Income (the household-spend donut
          was cut, its dataset contradicted Demand's in the same chapter); then the compare
          table; then payments + admin in one WideRail (no half-row blanks). */}
      <Movement eyebrow="The market" heading="The customers and their money" icon="spending-power" index="04" />
      <div className="space-y-5">
        <Even><Demand d={d} /><Income d={d} /></Even>
        <Neighbours d={d} />
        <WideRail><DigitalPayments d={d} /><AdminLoad d={d} /></WideRail>
      </div>

      {/* CH5 , trades and character. Cities + map moved UP to CH1 (the founder's locked first
          section), so this chapter now opens on the trades and runs alternated forms:
          Even -> Full spectra -> Even -> Even -> Locals folded in after the character band. */}
      <Movement eyebrow="Trades and character" heading="The trades, the culture and the exit" icon="high-street" index="05" />
      <div className="space-y-5">
        <Even><EasiestTrades d={d} /><SellingAbroad d={d} /></Even>
        <Insurance d={d} />
        <WideRail><Exit d={d} /><RiskRegister d={d} /></WideRail>
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
