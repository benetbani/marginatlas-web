/**
 * Country page , SPINE rebuild (dev surface). Built to the LOCKED spine
 * (docs/superpowers/specs/2026-06-28-country-page-spine.md) on the real kit.
 * Rules: Geist + Space Grotesk (.fig) numbers; soft terracotta (#fb8469) for fills only;
 * never a blank half-row (narrow parts are paired); progressive disclosure (headline shown,
 * detail behind a click); clean numerals; no per-country prose.
 */
import * as React from "react";
import fs from "node:fs";
import path from "node:path";
import { CountryFlag } from "@/components/CountryFlag";

export const dynamic = "force-static";
const GB: any = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "../page-data/countries/GB.json"), "utf8"));

const TERRA = "#fb8469"; // atlas-300 soft terracotta , the only fill color
const TRACK = "#e7e4df";
const usd = (v: number) => "$" + (v >= 1000 ? Math.round(v / 1000) + "K" : Math.round(v));
const usdMo = (vYr: number) => "$" + (vYr / 12 / 1000).toFixed(1) + "K";
const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : "");

/* ---------- primitives ---------- */
function Fig({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`fig ${className}`}>{children}</span>;
}
function Gauge({ value, sub, endLabels, w = 150 }: { value: number; sub?: string; endLabels?: [string, string]; w?: number }) {
  const v = Math.max(0, Math.min(100, value || 0));
  const th = Math.PI * (1 - v / 100), R = 74, cx = 100, cy = 86;
  const ex = (cx + R * Math.cos(th)).toFixed(1), ey = (cy - R * Math.sin(th)).toFixed(1);
  const nx = (cx + (R - 14) * Math.cos(th)).toFixed(1), ny = (cy - (R - 14) * Math.sin(th)).toFixed(1);
  return (
    <div className="text-center">
      <svg viewBox="0 0 200 126" style={{ width: w }} className="mx-auto">
        <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`} fill="none" stroke={TRACK} strokeWidth={11} strokeLinecap="round" />
        <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${ex} ${ey}`} fill="none" stroke={TERRA} strokeWidth={11} strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#211810" strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={4} fill="#211810" />
        {endLabels ? (<>
          <text x={20} y={101} textAnchor="start" fill="#87745d" fontSize={8.5} style={{ textTransform: "uppercase", letterSpacing: ".04em" }}>{endLabels[0]}</text>
          <text x={180} y={101} textAnchor="end" fill="#87745d" fontSize={8.5} style={{ textTransform: "uppercase", letterSpacing: ".04em" }}>{endLabels[1]}</text>
        </>) : null}
        <text x={cx} y={118} textAnchor="middle" fill="#211810" fontSize={24} style={{ fontFamily: "var(--font-grotesk)", fontWeight: 600 }}>{v}</text>
      </svg>
      {sub ? <div className="-mt-1 text-[11px] uppercase tracking-wide text-cocoa-500">{sub}</div> : null}
    </div>
  );
}
function Donut({ segs, centerBig, centerSub }: { segs: Array<[string, number, string]>; centerBig: string; centerSub: string }) {
  const r = 54, C = 2 * Math.PI * r; let off = 0;
  return (
    <svg viewBox="0 0 160 160" className="w-[150px]">
      {segs.map(([name, pct, color]) => {
        const len = (pct / 100) * C; const el = <circle key={name} cx={80} cy={80} r={r} fill="none" stroke={color} strokeWidth={24} strokeDasharray={`${len.toFixed(2)} ${(C - len).toFixed(2)}`} strokeDashoffset={(-off).toFixed(2)} transform="rotate(-90 80 80)" />; off += len; return el;
      })}
      <text x={80} y={76} textAnchor="middle" fill="#211810" fontSize={30} style={{ fontFamily: "var(--font-grotesk)", fontWeight: 600 }}>{centerBig}</text>
      <text x={80} y={95} textAnchor="middle" fill="#87745d" fontSize={9} style={{ textTransform: "uppercase", letterSpacing: ".05em" }}>{centerSub}</text>
    </svg>
  );
}
function Dots({ score, max = 10 }: { score: number; max?: number }) {
  return <div className="flex gap-[3px]">{Array.from({ length: max }).map((_, i) => <span key={i} className="h-[7px] w-[7px] rounded-full" style={{ background: i < score ? TERRA : TRACK }} />)}</div>;
}
function MiniBar({ pct }: { pct: number }) {
  return <div className="h-[7px] w-full overflow-hidden rounded-full" style={{ background: TRACK }}><div className="h-full rounded-full" style={{ width: `${pct}%`, background: TERRA }} /></div>;
}

/* ---------- atoms ---------- */
function Movement({ eyebrow, heading, sample }: { eyebrow: string; heading: string; sample?: boolean }) {
  return (
    <div className="mb-3 mt-12">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-atlas-700">{eyebrow}</span>
        {sample ? <span className="rounded-full bg-cream-200 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-cocoa-500">sample data</span> : null}
      </div>
      <h2 className="text-xl font-semibold tracking-tight text-ink-900 md:text-2xl">{heading}</h2>
    </div>
  );
}
function Box({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`atlas-card-hover rounded-xl border border-parchment bg-cream-50 p-5 ${className}`}>{children}</div>;
}
/* one shared left-to-right scale with N labelled markers , the variety-safe replacement for repeated dials */
function EaseScale({ rows }: { rows: Array<[string, number, string]> }) {
  return (
    <div className="space-y-3.5">{rows.map(([label, pos, word]) => (
      <div key={label} className="grid grid-cols-[150px_1fr] items-center gap-3">
        <span className="text-[12.5px] text-ink-700">{label}</span>
        <div className="relative h-1.5 rounded-full" style={{ background: "linear-gradient(90deg,#e7e4df,#fbe4dc)" }}>
          <div className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: `${pos}%` }}>
            <span className="h-3 w-3 rounded-full border-2 border-white" style={{ background: TERRA, boxShadow: "0 0 0 1px #e4e2dd" }} />
          </div>
          <span className="absolute -top-5 -translate-x-1/2 text-[11px] font-medium text-atlas-700" style={{ left: `${pos}%` }}>{word}</span>
        </div>
      </div>))}
    </div>
  );
}
/* a slim labelled meter for a single 0-100 read (NOT a dial) */
function Meter({ value, left, right }: { value: number; left: string; right: string }) {
  return (
    <div>
      <div className="relative h-2 rounded-full" style={{ background: "#e7e4df" }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: TERRA }} />
        <div className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${value}%`, background: "#211810" }} />
      </div>
      <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wide text-cocoa-500"><span>{left}</span><span>{right}</span></div>
    </div>
  );
}
function Head({ children, sample }: { children: React.ReactNode; sample?: boolean }) {
  return <div className="mb-3 flex items-center gap-2"><span className="text-[15px] font-semibold text-ink-900">{children}</span>{sample ? <span className="rounded-full bg-cream-200 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-cocoa-500">sample</span> : null}</div>;
}
function Chip({ children }: { children: React.ReactNode }) {
  return <span className="inline-block rounded-full border border-parchment bg-cream-100 px-2.5 py-0.5 text-[11px] text-ink-700">{children}</span>;
}
function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex gap-3 border-b border-parchment py-2 last:border-0"><span className="w-24 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">{k}</span><span className="text-[13px] text-ink-800">{v}</span></div>;
}
/* single-open expandable row , progressive disclosure */
function Expand({ name, title, right, children, open }: { name: string; title: string; right?: React.ReactNode; children: React.ReactNode; open?: boolean }) {
  return (
    <details name={name} open={open} className="group overflow-hidden rounded-lg border border-parchment open:border-atlas-200">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-cream-100 px-3.5 py-2.5 transition hover:bg-cream-200 group-open:bg-atlas-50">
        <span className="text-[13px] font-semibold text-ink-800 group-open:text-atlas-700">{title}</span>
        <span className="flex items-center gap-3">{right}<span className="text-base text-cream-500 transition group-open:rotate-45 group-open:text-atlas-700">+</span></span>
      </summary>
      <div className="px-3.5 pb-3 pt-1 text-[12.5px] leading-snug text-ink-700">{children}</div>
    </details>
  );
}
function Bullets({ items }: { items: string[] }) {
  return <ul className="space-y-2">{items.map((t, i) => <li key={i} className="relative pl-4 text-[12.5px] leading-snug text-ink-700"><span className="absolute left-0 top-[7px] h-1.5 w-1.5 rounded-full" style={{ background: TERRA }} />{t}</li>)}</ul>;
}
function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 md:flex-row [&>*]:flex-1">{children}</div>;
}

/* ================= CHAPTER 1 ================= */
function Hero({ d }: { d: any }) {
  const h = d.headline ?? {};
  const tiles: Array<[string, string, string?]> = [
    ["Small-business tax", `${h.smb_tax_pct}%`], ["Average salary", usdMo(h.average_salary_usd), "/mo"],
    ["Minimum wage", usdMo(h.min_wage_usd_yr), "/mo"], ["GDP / capita", usd(h.gdp_per_capita_usd)],
    ["Net wealth / adult", usd(h.net_wealth_per_adult_usd)], ["Ease of business", `${h.ease_of_business_score}`, "/100"],
    ["Cost of living", `${h.cost_of_living_index}`, "/100"], ["Days to start", `${d.setup?.total_days}`],
  ];
  return (
    <section className="overflow-hidden rounded-2xl border border-parchment bg-cream-100">
      <div className="grid items-end gap-6 p-6 md:grid-cols-[minmax(260px,360px)_1fr] md:p-8">
        <div>
          <a className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-parchment bg-cream-50/70 px-3 py-1 text-xs font-semibold text-ink-700 transition hover:border-ink-300 hover:text-atlas-700">&#8592; All countries</a>
          <div className="flex items-center gap-3"><CountryFlag iso2="gb" className="w-10" /><h1 className="whitespace-nowrap text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">{d.meta?.name}</h1></div>
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-atlas-200 sm:grid-cols-4" style={{ background: TERRA }}>
          {tiles.map(([label, value, unit]) => (
            <div key={label} className="bg-cream-50 px-3 py-2.5">
              <div className="text-[9px] font-semibold uppercase leading-tight tracking-[0.1em] text-cocoa-500">{label}</div>
              <div className="mt-0.5 text-[17px] text-ink-900"><Fig>{value}</Fig>{unit ? <span className="text-[11px] text-cocoa-500">{unit}</span> : null}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function MarginReality() {
  const parts: Array<[string, number, string]> = [["Labour", 38, "#8d887e"], ["Tax", 16, "#c3bfb7"], ["Premises & energy", 13, "#d8d4cd"], ["Other costs", 18, "#e7e4df"], ["Margin", 15, TERRA]];
  return (
    <Box className="md:flex-[3]">
      <Head sample>What a business keeps here</Head>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><Fig className="text-3xl text-ink-900">~$15</Fig><span className="text-sm text-ink-700">of every $100 of revenue survives as margin for a typical small business.</span></div>
      <div className="mt-4 flex h-10 overflow-hidden rounded-lg border border-parchment">{parts.map(([n, pct, bg]) => <div key={n} className="h-full" style={{ width: `${pct}%`, background: bg }} title={`${n} ${pct}%`} />)}</div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">{parts.map(([n, pct, bg]) => <span key={n} className="inline-flex items-center gap-1.5 text-[11px] text-ink-700"><span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: bg }} />{n} <Fig className="text-ink-900">{pct}%</Fig></span>)}</div>
    </Box>
  );
}
function Profile({ d }: { d: any }) {
  const ep = d.economic_profile ?? {};
  const lenses: Array<[string, string]> = [["economic_reward", "Demand"], ["ease_of_business", "Ease of entry"], ["talent_pool", "Talent pool"], ["political_stability", "Stability"], ["access_to_financing", "Access to finance"], ["affordability", "Affordability"]];
  return (
    <Box className="md:flex-[2]">
      <Head>The country, in six lenses</Head>
      <div className="grid grid-cols-2 gap-2.5">
        {lenses.map(([k, label]) => { const s = Number(ep[k] ?? 0); return (
          <div key={k} className="rounded-lg border border-parchment p-3"><div className="text-[11.5px] font-medium text-ink-700">{label}</div><div className="my-2"><Dots score={s} /></div><Fig className="text-[15px] text-ink-900">{s}<span className="text-[10px] text-cocoa-500">/10</span></Fig></div>
        ); })}
      </div>
    </Box>
  );
}

/* ================= CHAPTER 2 ================= */
function SetupStepper({ d }: { d: any }) {
  const steps = d.setup?.steps ?? []; const max = Math.max(1, ...steps.map((s: any) => s.time_days || 0));
  return (
    <Box><Head>Register and start trading</Head>
      <div className="flex gap-3">{steps.map((s: any, i: number) => { const bot = (s.time_days || 0) === max && max > 1; const w = Math.round(((s.time_days || 0) / max) * 100); return (
        <div key={i} className="flex flex-1 flex-col items-center gap-1 text-center">
          <Fig className="text-lg text-ink-900">{s.cost_usd === 0 ? "Free" : "$" + s.cost_usd}</Fig>
          <div className="min-h-[30px] text-[11px] text-ink-700">{s.name}</div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold" style={bot ? { borderColor: TERRA, background: "#fff1ee", color: "#991600" } : { borderColor: "#e4e2dd", color: "#463726" }}>{i + 1}</div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded" style={{ background: "#efeeeb" }}><div className="h-full rounded" style={{ width: `${w}%`, background: bot ? TERRA : "#c3bfb7" }} /></div>
          <div className="text-[11px] text-ink-600">{s.time_days === 1 ? "1 day" : (s.time_days || 0) + " days"}{bot ? <b className="block text-[9px] uppercase tracking-wide text-atlas-700">bottleneck</b> : null}</div>
          <Chip>{s.how}</Chip>
        </div>); })}
      </div>
    </Box>
  );
}
function Formation({ d }: { d: any }) {
  const structures = d.setup?.structures ?? [];
  return (
    <Box className="md:flex-[2]"><Head>Which legal structure to form</Head>
      <div className="space-y-2">{structures.map((s: any, i: number) => (
        <Expand key={i} name="formation" title={s.name} open={i === 0}>
          <KV k="Liability" v={s.liability} /><KV k="Tax" v={s.tax} /><KV k="Best for" v={s.best_for} />
        </Expand>))}
      </div>
      {d.setup?.vat_threshold_usd ? <div className="mt-3 inline-block rounded-full border border-parchment bg-cream-100 px-3 py-1.5 text-[12px] text-ink-700">Register for VAT once sales pass <Fig className="text-ink-900">${Math.round(d.setup.vat_threshold_usd / 1000)}K</Fig></div> : null}
    </Box>
  );
}
function Banking({ d }: { d: any }) {
  const b = d.setup?.banking ?? {};
  return (
    <Box className="md:flex-[3]"><Head>Opening a business bank account</Head>
      <div className="mb-3 flex flex-wrap items-center gap-2.5"><span className="text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">How hard</span><span className="rounded-full border border-atlas-200 bg-atlas-50 px-3 py-0.5 text-[13px] font-semibold capitalize text-atlas-700">{b.friction}</span><span className="text-[11.5px] text-ink-600">{b.can_foreigner ? "Open to foreign owners" : "Restricted"}</span></div>
      <div className="mb-3"><Bullets items={b.bullets ?? []} /></div>
      {[["High-street", b.banks_traditional], ["Digital", b.banks_digital]].map(([label, arr]) => (
        <div key={label as string} className="flex gap-3 border-t border-parchment py-2"><span className="w-20 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">{label}</span><span className="text-[13px] text-ink-800">{((arr as string[]) ?? []).join("  ·  ")}</span></div>))}
    </Box>
  );
}
function TaxByLevel({ d }: { d: any }) {
  const groups = d.tax_detail?.groups ?? [];
  return (
    <Box><Head>What the business actually pays, by level</Head>
      <div className="grid gap-6 md:grid-cols-3">{groups.map((g: any) => (
        <div key={g.level}><div className="mb-2.5 border-b border-parchment pb-2 text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">{g.level}</div>
          <div className="space-y-3">{(g.items ?? []).map((it: any) => (
            <div key={it.name} className="flex items-baseline gap-3"><Fig className="w-14 shrink-0 text-[17px] text-ink-900">{it.value}</Fig><span className="text-[12px] leading-tight text-ink-700"><b className="font-medium text-ink-900">{it.name}</b><br />{it.note}</span></div>))}
          </div>
        </div>))}
      </div>
    </Box>
  );
}

/* ================= CHAPTER 3 ================= */
function PayByLevel({ d }: { d: any }) {
  const o = d.people_pay?.pay_by_level_usd ?? {}; const levels: Array<[string, string]> = [["junior", "Entry / wage floor"], ["experienced", "Skilled"], ["senior", "Senior"], ["specialist", "Management & specialist"]];
  const max = Math.max(...levels.map(([k]) => o[k] || 0)) * 1.08;
  return (
    <Box className="md:flex-[3]"><Head>What staff cost to employ</Head>
      <div className="space-y-3">{levels.map(([k, label]) => { const v = o[k] || 0; const lo = v * 0.82, hi = v * 1.2; const L = (lo / max) * 100, W = ((hi - lo) / max) * 100, M = (v / max) * 100; return (
        <div key={k} className="grid grid-cols-[150px_1fr_70px] items-center gap-3"><span className="text-[12.5px] text-ink-700">{label}</span>
          <div className="relative h-3.5"><div className="absolute top-1/2 h-0.5 w-full -translate-y-1/2 rounded" style={{ background: "#e4e2dd" }} /><div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded" style={{ left: `${L}%`, width: `${W}%`, background: TERRA }} /><div className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white" style={{ left: `${M}%`, borderColor: TERRA }} /></div>
          <Fig className="text-right text-[17px] text-ink-900">${Math.round(v / 1000)}K</Fig></div>); })}
      </div>
      <div className="mt-3 rounded-lg bg-cream-100 px-3 py-2 text-[12px] text-ink-700">On top of every wage, add <Fig className="text-atlas-700">+{d.tax_burden?.employer_oncost_pct}%</Fig> for pension and social contributions.</div>
    </Box>
  );
}
function HiringDials({ d }: { d: any }) {
  const h = d.people_pay?.hiring ?? {}; const eMap: any = { easy: 84, moderate: 52, hard: 18, deep: 84, fair: 52, thin: 18 };
  const rows: Array<[string, number, string]> = [["Hiring someone", eMap[h.hire_ease] ?? 50, cap(h.hire_ease)], ["Contracts you can use", eMap[h.contract_ease] ?? 50, cap(h.contract_ease)], ["Letting someone go", eMap[h.fire_ease] ?? 50, cap(h.fire_ease)], ["Depth of talent", eMap[h.recruiting_depth] ?? 50, cap(h.recruiting_depth)]];
  return (
    <Box className="md:flex-[2]"><Head>How easy it is to hire and let go</Head>
      <div className="mb-5 mt-1 flex justify-between text-[10px] uppercase tracking-wide text-cocoa-500"><span>Harder / rigid</span><span>Easier / flexible</span></div>
      <EaseScale rows={rows} />
    </Box>
  );
}
function TalentDepth({ d }: { d: any }) {
  const map: any = { finance: "Finance", software_tech: "Software & tech", professional_legal: "Professional & legal", creative_media: "Creative & media", life_sciences: "Life sciences", manufacturing_trades: "Manufacturing & trades" };
  const arr = (d.people_pay?.talent_depth ?? []).slice().sort((a: any, b: any) => b.score_1_5 - a.score_1_5);
  return (
    <Box><Head>How deep the talent pool runs, by field</Head>
      <div className="space-y-2.5">{arr.map((t: any) => (
        <div key={t.field} className="grid grid-cols-[160px_1fr_44px] items-center gap-3"><span className="text-[12.5px] text-ink-700">{map[t.field] ?? t.field}</span><MiniBar pct={(t.score_1_5 / 5) * 100} /><Fig className="text-right text-[13px] text-ink-900">{t.score_1_5 * 2}/10</Fig></div>))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-parchment pt-3"><span className="text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">Languages</span>{(d.people_pay?.languages ?? []).map((l: any) => <Chip key={l.name}>{l.name} {l.pct_speakers}%</Chip>)}</div>
    </Box>
  );
}
function OperatingCosts({ d }: { d: any }) {
  const c = d.costs ?? {}; const cells: Array<[string, string]> = [[`$${(Math.round(c.energy_usd_per_kwh * 100) / 100)}`, "Electricity, per kWh"], [`$${c.commercial_rent_usd_sqm_yr?.toLocaleString("en-US")}`, "Commercial rent, per sqm a year"], [`$${Math.round(c.labour_cost_index_usd / 1000)}K`, "Loaded labour, per worker a year"], [`$${c.license_setup_usd}`, "Licence & setup, one-off"]];
  return (
    <Box><Head>What it costs to run premises</Head>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-parchment" style={{ background: "#efeeeb" }}>
        {cells.map(([v, l]) => <div key={l} className="bg-cream-50 p-3.5"><Fig className="text-[22px] text-ink-900">{v}</Fig><div className="mt-1 text-[11px] leading-tight text-ink-600">{l}</div></div>)}
      </div>
    </Box>
  );
}
function Financing({ d }: { d: any }) {
  const f = d.financing ?? {};
  return (
    <Box><Head sample>Where the money comes from</Head>
      <div className="mb-4"><div className="flex items-baseline gap-2"><span className="text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">Ease of raising money</span><Fig className="text-atlas-700">{f.ease_0_100}/100</Fig></div><div className="mt-1.5"><Meter value={f.ease_0_100} left="Hard" right="Easy" /></div></div>
      <div className="divide-y divide-parchment">{(f.sources ?? []).map((s: any) => <div key={s.name} className="py-2"><div className="text-[13px] font-medium text-ink-900">{s.name}</div><div className="text-[11.5px] text-ink-600">{s.note}</div></div>)}</div>
    </Box>
  );
}
function Grants({ d }: { d: any }) {
  return (
    <Box><Head sample>Grants and incentives</Head>
      <div className="space-y-2">{(d.grants?.list ?? []).map((g: any, i: number) => (
        <Expand key={i} name="grants" title={g.name} right={<Fig className="text-[13px] text-atlas-700">{g.value}</Fig>}>{g.who} can apply. Non-dilutive where it is a grant; loans carry a fixed rate.</Expand>))}
      </div>
    </Box>
  );
}

/* ================= CHAPTER 4 ================= */
function SpendDonut({ d }: { d: any }) {
  const hs: any[] = d.income?.household_spend ?? []; const get = (c: string) => hs.find((x) => x.category === c)?.pct ?? 0;
  const disc = Math.round(get("recreation") + get("dining_out"));
  const segs: Array<[string, number, string]> = [["Housing & utilities", get("housing_utilities"), "#8d887e"], ["Transport", get("transport"), "#b8b3aa"], ["Food & drink", get("food_drink"), "#d8d4cd"], ["Discretionary", disc, TERRA], ["Other", Math.round(get("household_goods") + get("other")), "#ece9e4"]];
  return (
    <Box><Head>Where a household&apos;s money goes</Head>
      <div className="flex items-center gap-5"><Donut segs={segs} centerBig={`${disc}%`} centerSub="to spend out" />
        <div className="flex-1 space-y-1.5">{segs.map(([n, pct, c]) => <div key={n} className="flex items-center gap-2 text-[12px] text-ink-700"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: c }} />{n} <Fig className="ml-auto text-ink-900">{pct}%</Fig></div>)}</div>
      </div>
    </Box>
  );
}
function Income({ d }: { d: any }) {
  const o = d.income ?? {}; const tiles: Array<[string, number]> = [["Median earner", o.median_income_usd], ["Top 10%", o.top10_income_usd], ["Top 1%", o.top1_income_usd]];
  const bands = ["very_equal", "fairly_equal", "moderate", "high", "very_high"]; const gi = bands.indexOf(o.gini_band);
  return (
    <Box><Head>What customers earn</Head>
      <div className="grid grid-cols-3 gap-2.5">{tiles.map(([l, v]) => <div key={l} className="rounded-lg border border-parchment p-3"><div className="text-[10.5px] font-semibold uppercase tracking-wide text-cocoa-500">{l}</div><Fig className="text-[21px] text-ink-900">${Math.round(v / 1000)}K</Fig></div>)}</div>
      <div className="mt-3 flex items-center gap-2"><div className="flex gap-1">{bands.map((b, i) => <span key={b} className="h-1.5 w-6 rounded-sm" style={{ background: i === gi ? TERRA : "#e4e2dd" }} />)}</div><span className="text-[11.5px] text-ink-600">{cap((o.gini_band ?? "").replace("_", " "))} spread between earners</span></div>
    </Box>
  );
}
function Neighbours({ d }: { d: any }) {
  const cols = [
    { key: "tax", label: "Business tax", unit: "%", get: (x: any) => x.tax_burden?.total_pct, cell: (v: number) => "" + Math.round(v), lowGood: true },
    { key: "reg", label: "Cost to register", unit: "$", get: (x: any) => x.costs?.license_setup_usd, cell: (v: number) => Math.round(v).toLocaleString("en-US"), lowGood: true },
    { key: "days", label: "Time to register", unit: "days", get: (x: any) => x.setup?.total_days, cell: (v: number) => "" + v, lowGood: true },
    { key: "vat", label: "VAT", unit: "%", get: (x: any) => x.tax_burden?.vat_rate_pct, cell: (v: number) => "" + v, lowGood: true },
    { key: "energy", label: "Energy", unit: "$/kWh", get: (x: any) => x.costs?.energy_usd_per_kwh, cell: (v: number) => "" + (Math.round(v * 100) / 100), lowGood: true },
  ];
  const codes = ["GB", ...(d.meta?.peer_set ?? [])];
  const rows = codes.map((code) => { let j: any = null; try { j = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "../page-data/countries/" + code + ".json"), "utf8")); } catch (e) { } return j ? { code, home: code === "GB", name: j.meta?.name ?? code, vals: cols.map((c) => c.get(j)) } : null; }).filter(Boolean) as any[];
  const best = cols.map((c, i) => { const xs = rows.map((r) => r.vals[i]).filter((v) => v != null); return c.lowGood ? Math.min(...xs) : Math.max(...xs); });
  const home = rows.find((r) => r.home);
  const wins = cols.filter((c, i) => home && home.vals[i] === best[i]).map((c) => c.label.toLowerCase());
  const loses = cols.filter((c, i) => { const xs = rows.map((r) => r.vals[i]).filter((v) => v != null); const worst = c.lowGood ? Math.max(...xs) : Math.min(...xs); return home && home.vals[i] === worst; }).map((c) => c.label.toLowerCase());
  return (
    <Box><Head>How it compares, country by country</Head>
      {wins.length || loses.length ? <div className="mb-3 text-[12.5px] text-ink-700">{d.meta?.name} leads its peers on <b className="text-atlas-700">{wins.join(", ") || "nothing"}</b>{loses.length ? <>, and trails on <b className="text-ink-900">{loses.join(", ")}</b></> : null}.</div> : null}
      <div className="overflow-x-auto"><table className="w-full text-[13px]"><thead><tr className="border-b border-parchment text-[10.5px] font-semibold uppercase tracking-wide text-cocoa-500"><th className="py-2 pr-3 text-left font-semibold">Country</th>{cols.map((c) => <th key={c.key} className="px-3 py-2 text-right font-semibold">{c.label} <span className="font-normal text-cocoa-400">({c.unit})</span></th>)}</tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r.code} className="border-b border-parchment/60 transition hover:bg-cream-100" style={r.home ? { background: "#fff6f3" } : undefined}><td className="py-2.5 pr-3 font-medium text-ink-900">{r.name}</td>{r.vals.map((v: number, i: number) => (
            <td key={i} className="px-3 py-2.5 text-right"><Fig className={v != null && v === best[i] ? "font-bold text-atlas-700" : "text-ink-900"}>{v == null ? "—" : cols[i].cell(v)}</Fig></td>))}
          </tr>))}
        </tbody></table></div>
      <div className="mt-2 text-[11px] text-cocoa-500">Best in each column is bold. The home country is tinted, never ranked.</div>
    </Box>
  );
}
function Competition({ d }: { d: any }) {
  const arr = (d.competition?.trades ?? []).slice().sort((a: any, b: any) => b.saturation_0_100 - a.saturation_0_100);
  return (
    <Box><Head sample>How crowded the market is</Head>
      <div className="space-y-2.5">{arr.map((t: any) => (
        <div key={t.name} className="grid grid-cols-[130px_1fr_66px] items-center gap-3"><span className="text-[12.5px] text-ink-700">{t.name}</span><MiniBar pct={t.saturation_0_100} /><span className="text-right text-[11.5px] text-ink-600">{t.saturation_0_100 > 70 ? "Crowded" : t.saturation_0_100 > 50 ? "Busy" : "Room"}</span></div>))}
      </div>
    </Box>
  );
}
function AdminLoad({ d }: { d: any }) {
  const a = d.admin_load ?? {};
  return (
    <Box><Head sample>The admin load</Head>
      <div className="mb-3 grid grid-cols-3 gap-2.5 text-center">{[[`${a.hours_per_year}h`, "a year on admin"], [`${a.online_pct}%`, "done online"], [`${a.filings_per_year}`, "filings a year"]].map(([v, l]) => <div key={l} className="rounded-lg border border-parchment p-2.5"><Fig className="text-[20px] text-ink-900">{v}</Fig><div className="text-[10.5px] leading-tight text-ink-600">{l}</div></div>)}</div>
      <Bullets items={a.bullets ?? []} />
    </Box>
  );
}

/* ================= CHAPTER 5 ================= */
function Cities({ d }: { d: any }) {
  const list = d.cities?.list ?? [];
  return (
    <Box><Head>The main cities</Head>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{list.slice(0, 10).map((c: any) => (
        <a key={c.slug} className="atlas-card-hover group block cursor-pointer overflow-hidden rounded-lg border border-parchment">
          <div className="flex aspect-[16/7] items-center justify-center bg-cream-100 text-cream-400"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 21h18M5 21V7l5-3v17M19 21V11l-5-3" /></svg></div>
          <div className="px-2.5 py-2"><div className="text-[12.5px] font-semibold text-ink-900 group-hover:text-atlas-700">{c.name}</div><div className="truncate text-[10.5px] text-ink-600">{c.character}</div></div>
        </a>))}
      </div>
    </Box>
  );
}
function EasiestTrades({ d }: { d: any }) {
  const list = d.trades_to_start?.list ?? [];
  return (
    <Box><Head sample>Easiest trades to start, and what they cost</Head>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{list.map((t: any) => (
        <div key={t.name} className="rounded-lg border border-parchment p-3 text-center"><Gauge value={t.hardship_0_100} endLabels={["Easier", "Harder"]} w={118} /><div className="text-[13px] font-semibold text-ink-900">{t.name}</div><Fig className="text-[16px] text-atlas-700">${Math.round(t.cost_to_open_usd / 1000)}K<span className="text-[11px] font-normal text-cocoa-500"> to open</span></Fig></div>))}
      </div>
    </Box>
  );
}
function Insurance({ d }: { d: any }) {
  const covers = d.insurance?.covers ?? [];
  return (
    <Box><Head sample>Insurance the business carries</Head>
      <div className="space-y-2">{covers.map((c: any, i: number) => (
        <Expand key={i} name="insurance" title={c.name} open={i === 0} right={<span className="flex items-center gap-2">{c.required ? <span className="rounded-full bg-atlas-50 px-2 py-0.5 text-[9px] font-semibold uppercase text-atlas-700">required</span> : null}<Fig className="text-[13px] text-ink-900">${c.typical_usd}<span className="text-[10px] text-cocoa-500">/yr</span></Fig></span>}>
          {c.required ? "Legally required once you employ anyone." : "Optional, but most operators carry it."} Typical premium for a small firm; rises with payroll, turnover and claims history.
        </Expand>))}
      </div>
    </Box>
  );
}
function SellingAbroad({ d }: { d: any }) {
  const e = d.exporting ?? {};
  const verdict = e.openness_0_100 >= 70 ? "Open" : e.openness_0_100 >= 45 ? "Moderate" : "Closed";
  return (
    <Box><Head sample>Selling abroad</Head>
      <div className="mb-3 flex items-baseline gap-2"><span className="text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">Export openness</span><Fig className="text-[18px] text-atlas-700">{e.openness_0_100}</Fig><span className="text-[12px] text-ink-600">/ 100 , {verdict}</span></div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">Top markets</div>
      <div className="mt-1.5 divide-y divide-parchment">{(e.partners ?? []).map((p: any) => <div key={p.name} className="flex items-center justify-between py-1.5"><span className="text-[12.5px] text-ink-800">{p.name}</span><Fig className="text-[12.5px] text-ink-900">{p.pct}%</Fig></div>)}</div>
    </Box>
  );
}
function Spectrum({ rows }: { rows: any[] }) {
  return <div className="space-y-3">{rows.map((r: any, i: number) => (
    <div key={i}><div className="mb-1 flex justify-between text-[11px] text-ink-600"><span>{r.left_label}</span><span>{r.right_label}</span></div>
      <div className="relative h-1.5 rounded-full" style={{ background: "linear-gradient(90deg,#fb8469,#d8d4cd 52%,#8d887e)" }}><div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink-900" style={{ left: `${Math.round((r.position_0_1 || 0) * 100)}%`, boxShadow: "0 0 0 1px #e4e2dd" }} /></div></div>))}</div>;
}
function Character({ d }: { d: any }) {
  return (
    <Row>
      <Box><Head>Government, from a business view</Head><Spectrum rows={d.character?.gov_business ?? []} /></Box>
      <Box><Head>Culture, from an outsider view</Head><Spectrum rows={d.character?.culture_outsider ?? []} /></Box>
    </Row>
  );
}
function Locals({ d }: { d: any }) {
  const items = d.character?.locals_intel ?? [];
  return (
    <Box className="md:flex-[3]"><Head>What locals know</Head>
      <div className="grid gap-x-7 gap-y-3 sm:grid-cols-2">{items.map((it: any, i: number) => (
        <div key={i} className="flex gap-2.5"><span className="mt-0.5 text-atlas-700">&#9656;</span><span className="text-[12.5px] leading-snug text-ink-700"><b className="text-ink-900">{it.title}</b> {it.detail}</span></div>))}
      </div>
    </Box>
  );
}
function Exit({ d }: { d: any }) {
  const e = d.risk_exit?.exit ?? {};
  return (
    <Box className="md:flex-[2]"><Head>How sellable a business is</Head>
      <div className="flex items-center gap-5"><div className="shrink-0"><Gauge value={e.climate_score_0_100} sub="Resale climate" /></div>
        <div className="space-y-2 text-[12.5px]"><div><div className="text-[10.5px] font-semibold uppercase tracking-wide text-cocoa-500">Time to sell</div><Fig className="text-[16px] text-ink-900">{e.time_to_sell_months_low}-{e.time_to_sell_months_high} mo</Fig></div><div><div className="text-[10.5px] font-semibold uppercase tracking-wide text-cocoa-500">Sale price</div><Fig className="text-[16px] text-ink-900">{e.multiple_low}-{e.multiple_high}x</Fig><span className="text-[11px] text-ink-600"> a year&apos;s profit</span></div></div>
      </div>
      <div className="mt-3 border-t border-parchment pt-3"><Bullets items={e.bullets ?? []} /></div>
    </Box>
  );
}
function Employment({ d }: { d: any }) {
  const e = d.employment ?? {};
  return (
    <Box><Head sample>Working here, the rules</Head>
      <div className="mb-3 grid grid-cols-2 gap-2.5">{[[`${e.holiday_days}`, "paid holiday days"], [`${e.union_pct}%`, "in a union"]].map(([v, l]) => <div key={l} className="rounded-lg border border-parchment p-2.5 text-center"><Fig className="text-[20px] text-ink-900">{v}</Fig><div className="text-[10.5px] text-ink-600">{l}</div></div>)}</div>
      <Bullets items={e.bullets ?? []} />
    </Box>
  );
}
function Closing({ d }: { d: any }) {
  const c = d.closing ?? {}; const verdict = c.ease_0_100 >= 65 ? "Manageable" : c.ease_0_100 >= 40 ? "Some friction" : "Hard";
  return (
    <Box><Head sample>If it doesn&apos;t work, getting out</Head>
      <div className="mb-3 grid grid-cols-3 gap-2.5 text-center">{[[verdict, "to wind down"], [`${c.time_months}`, "months, typically"], [`${c.cost_pct}%`, "of assets, cost"]].map(([v, l]) => <div key={l} className="rounded-lg border border-parchment p-2.5"><Fig className="text-[15px] text-ink-900">{v}</Fig><div className="text-[10.5px] leading-tight text-ink-600">{l}</div></div>)}</div>
      <Bullets items={c.bullets ?? []} />
    </Box>
  );
}
function Close({ d }: { d: any }) {
  const city = d.cities?.list?.[0];
  return (
    <Row>
      <Box className="md:flex-[3]"><Head>Where to go next</Head>
        <div className="space-y-2">{[`${city?.name}, the deepest ${d.meta?.name} market`, `Restaurants in ${city?.name}, live take-home`, `Compare ${d.meta?.name} with its neighbours`].map((t, i) => <a key={i} className="block text-[13.5px] font-semibold text-atlas-700 hover:underline">{t} &#8594;</a>)}</div>
      </Box>
      <Box className="flex flex-col items-start justify-center gap-3 md:flex-[2]" ><div className="text-[14px] text-ink-800">Set {d.meta?.name} beside up to three countries, side by side.</div><a className="rounded-full bg-ink-900 px-4 py-2 text-[13px] font-semibold text-cream-50 transition hover:bg-atlas-700">Open Compare</a></Box>
    </Row>
  );
}

export default function SpinePage() {
  const d = GB;
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <Hero d={d} />
      <Movement eyebrow="The verdict" heading="Can I make money here" />
      <Row><MarginReality /><Profile d={d} /></Row>

      <Movement eyebrow="Getting set up" heading="What it costs and takes to start" />
      <div className="space-y-4"><SetupStepper d={d} /><Row><Formation d={d} /><Banking d={d} /></Row><TaxByLevel d={d} /></div>

      <Movement eyebrow="The money and the team" heading="What money and people cost" />
      <div className="space-y-4"><Row><PayByLevel d={d} /><HiringDials d={d} /></Row><Row><TalentDepth d={d} /><OperatingCosts d={d} /></Row><Row><Financing d={d} /><Grants d={d} /></Row></div>

      <Movement eyebrow="The market and the rivals" heading="Who your customers are" />
      <div className="space-y-4"><Row><SpendDonut d={d} /><Income d={d} /></Row><Neighbours d={d} /><Row><Competition d={d} /><AdminLoad d={d} /></Row></div>

      <Movement eyebrow="Places, trades and character" heading="Where, what, and what it feels like" />
      <div className="space-y-4"><Cities d={d} /><EasiestTrades d={d} /><Row><Insurance d={d} /><SellingAbroad d={d} /></Row><Character d={d} /><Row><Locals d={d} /><Exit d={d} /></Row><Row><Employment d={d} /><Closing d={d} /></Row></div>

      <Movement eyebrow="The close" heading="Your next move" />
      <Close d={d} />
    </main>
  );
}
