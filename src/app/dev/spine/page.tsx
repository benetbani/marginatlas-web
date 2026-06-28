/**
 * Country page , SPINE rebuild (dev surface).
 * Built on the real component kit to the LOCKED spine
 * (docs/superpowers/specs/2026-06-28-country-page-spine.md).
 * Reads the curated GB data; promoted to [country]/page.tsx once it is the bar.
 * Design rules: soft terracotta (atlas-300) for fills, NO dark red; no blank cards;
 * hover + click-to-expand; clean numerals; no per-country prose.
 */
import * as React from "react";
import fs from "node:fs";
import path from "node:path";
import { StatCard } from "@/components/ui/stat-card";
import { CountryFlag } from "@/components/CountryFlag";

export const dynamic = "force-static";

const GB = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), "../page-data/countries/GB.json"), "utf8")
);

const usd = (v: number) => "$" + (v >= 1000 ? Math.round(v / 1000) + "K" : Math.round(v));
const usdMo = (vYr: number) => "$" + (vYr / 12 / 1000).toFixed(1) + "K";

/* ---------- Chapter 1 ---------- */

function Hero({ d }: { d: any }) {
  const h = d.headline ?? {};
  const tiles: Array<[string, string, string?]> = [
    ["Small-business tax", `${h.smb_tax_pct ?? "-"}%`],
    ["Average salary", usdMo(h.average_salary_usd ?? 0), "/mo"],
    ["Minimum wage", usdMo(h.min_wage_usd_yr ?? 0), "/mo"],
    ["GDP / capita", usd(h.gdp_per_capita_usd ?? 0)],
    ["Net wealth / adult", usd(h.net_wealth_per_adult_usd ?? 0)],
    ["Ease of business", `${h.ease_of_business_score ?? "-"}`, "/100"],
    ["Cost of living", `${h.cost_of_living_index ?? "-"}`, "/100"],
    ["Days to start", `${d.setup?.total_days ?? "-"}`],
  ];
  return (
    <section id="top" className="relative overflow-hidden rounded-2xl border border-parchment bg-cream-100">
      <div className="grid items-end gap-6 p-6 md:grid-cols-[minmax(280px,380px)_1fr] md:p-8">
        <div>
          <a className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-parchment bg-cream-50/70 px-3 py-1 text-xs font-semibold text-ink-700 transition hover:border-ink-300 hover:text-atlas-700">
            &#8592; All countries
          </a>
          <div className="flex items-center gap-3">
            <CountryFlag iso2="gb" className="w-10" />
            <h1 className="whitespace-nowrap text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl">
              {d.meta?.name ?? "United Kingdom"}
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-atlas-200 bg-atlas-300 sm:grid-cols-4">
          {tiles.map(([label, value, unit]) => (
            <div key={label} className="bg-cream-50 px-3 py-2.5">
              <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-cocoa-500">{label}</div>
              <div className="mt-0.5 fig text-[17px] tabular-nums text-ink-900">
                {value}
                {unit ? <span className="text-[11px] font-normal text-cocoa-500">{unit}</span> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MarginReality() {
  // USP flagship: of $100 of revenue, what the cost base eats and what survives as margin.
  // Country-level + illustrative (no per-business take-home).
  const parts: Array<[string, number, string]> = [
    ["Labour", 38, "bg-cream-500"],
    ["Tax", 16, "bg-cream-400"],
    ["Premises & energy", 13, "bg-cream-300"],
    ["Other costs", 18, "bg-cream-200"],
    ["Margin", 15, "bg-atlas-300"],
  ];
  return (
    <Section eyebrow="The money reality" heading="What a business keeps here" sample>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="fig text-3xl tabular-nums text-atlas-700">~$15</span>
        <span className="text-sm text-ink-700">of every $100 of revenue survives as margin for a typical small business.</span>
      </div>
      <div className="mt-4 flex h-10 overflow-hidden rounded-lg border border-parchment">
        {parts.map(([name, pct, bg]) => (
          <div key={name} className={`${bg} h-full`} style={{ width: `${pct}%` }} title={`${name} ${pct}%`} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {parts.map(([name, pct, bg]) => (
          <span key={name} className="inline-flex items-center gap-1.5 text-[11px] text-ink-700">
            <span className={`inline-block h-2.5 w-2.5 rounded-sm ${bg}`} />
            {name} <b className="font-medium text-ink-900">{pct}%</b>
          </span>
        ))}
      </div>
    </Section>
  );
}

function Profile({ d }: { d: any }) {
  const ep = d.economic_profile ?? {};
  const lenses: Array<[string, string]> = [
    ["economic_reward", "Demand"],
    ["ease_of_business", "Ease of entry"],
    ["talent_pool", "Talent pool"],
    ["political_stability", "Stability"],
    ["access_to_financing", "Access to finance"],
    ["affordability", "Affordability"],
  ];
  return (
    <Section eyebrow="The profile" heading="The country, in six lenses" narrow>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {lenses.map(([k, label]) => {
          const s = Number(ep[k] ?? 0);
          return (
            <div key={k} className="rounded-lg border border-parchment p-3.5">
              <div className="text-xs font-medium text-ink-700">{label}</div>
              <div className="my-2.5 flex gap-[3px]">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className={`h-[7px] w-[7px] rounded-full ${i < s ? "bg-atlas-300" : "bg-cream-300"}`} />
                ))}
              </div>
              <div className="fig text-lg tabular-nums text-ink-900">
                {s}
                <span className="text-[11px] font-normal text-cocoa-500">/10</span>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ---------- shared section wrapper ---------- */
function Section({
  eyebrow,
  heading,
  children,
  narrow,
  sample,
}: {
  eyebrow: string;
  heading: string;
  children: React.ReactNode;
  narrow?: boolean;
  sample?: boolean;
}) {
  return (
    <section className="mt-10">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-atlas-700">{eyebrow}</span>
        {sample ? (
          <span className="rounded-full bg-cream-200 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-cocoa-500">
            illustrative
          </span>
        ) : null}
      </div>
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-ink-900 md:text-2xl">{heading}</h2>
      <div className={`rounded-xl border border-parchment bg-cream-50 p-5 ${narrow ? "md:max-w-[62%]" : ""}`}>
        {children}
      </div>
    </section>
  );
}

/* ---------- shared atoms ---------- */
function Movement({ eyebrow, heading, sample }: { eyebrow: string; heading: string; sample?: boolean }) {
  return (
    <div className="mb-3 mt-10">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-atlas-700">{eyebrow}</span>
        {sample ? <span className="rounded-full bg-cream-200 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-cocoa-500">illustrative</span> : null}
      </div>
      <h2 className="text-xl font-semibold tracking-tight text-ink-900 md:text-2xl">{heading}</h2>
    </div>
  );
}
function Box({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-parchment bg-cream-50 p-5 ${className}`}>{children}</div>;
}
function CardHead({ children }: { children: React.ReactNode }) {
  return <div className="mb-3 text-[15px] font-semibold text-ink-900">{children}</div>;
}
function Chip({ children }: { children: React.ReactNode }) {
  return <span className="inline-block rounded-full border border-parchment bg-cream-100 px-2.5 py-0.5 text-[11px] text-ink-700">{children}</span>;
}

/* ---------- Chapter 2 , getting set up ---------- */
function SetupStepper({ d }: { d: any }) {
  const steps = d.setup?.steps ?? [];
  const max = Math.max(1, ...steps.map((s: any) => s.time_days || 0));
  return (
    <Box>
      <CardHead>Register and start trading</CardHead>
      <div className="flex gap-3">
        {steps.map((s: any, i: number) => {
          const bot = (s.time_days || 0) === max && max > 1;
          const w = Math.round(((s.time_days || 0) / max) * 100);
          const cost = s.cost_usd === 0 ? "Free" : "$" + s.cost_usd;
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1 text-center">
              <div className="fig text-lg text-atlas-700">{cost}</div>
              <div className="min-h-[30px] text-[11px] text-ink-700">{s.name}</div>
              <div className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold ${bot ? "border-atlas-300 bg-atlas-50 text-atlas-700" : "border-parchment text-ink-700"}`}>{i + 1}</div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded bg-cream-200"><div className={`h-full rounded ${bot ? "bg-atlas-300" : "bg-cream-400"}`} style={{ width: `${w}%` }} /></div>
              <div className="text-[11px] text-ink-600">{s.time_days === 1 ? "1 day" : (s.time_days || 0) + " days"}{bot ? <b className="block text-[9px] uppercase tracking-wide text-atlas-700">bottleneck</b> : null}</div>
              <Chip>{s.how}</Chip>
            </div>
          );
        })}
      </div>
    </Box>
  );
}
function Formation({ d }: { d: any }) {
  const structures = d.setup?.structures ?? [];
  return (
    <Box>
      <CardHead>Which legal structure to form</CardHead>
      <div className="space-y-2">
        {structures.map((s: any, i: number) => (
          <details key={i} name="formation" open={i === 0} className="group overflow-hidden rounded-lg border border-parchment open:border-atlas-200">
            <summary className="flex cursor-pointer list-none items-center justify-between bg-cream-100 px-3.5 py-2.5 text-[13px] font-semibold text-ink-800 transition hover:bg-cream-200 group-open:bg-atlas-50 group-open:text-atlas-700">
              {s.name}
              <span className="text-base text-cream-500 transition group-open:rotate-45 group-open:text-atlas-700">+</span>
            </summary>
            <div className="px-3.5 pb-3 pt-1">
              {[["Liability", s.liability], ["Tax", s.tax], ["Best for", s.best_for]].map(([k, v]) => (
                <div key={k as string} className="flex gap-3 border-b border-parchment py-2 last:border-0">
                  <span className="w-20 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">{k}</span>
                  <span className="text-[13px] text-ink-800">{v as string}</span>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
      {d.setup?.vat_threshold_usd ? (
        <div className="mt-3 inline-block rounded-full border border-parchment bg-cream-100 px-3 py-1.5 text-[12px] text-ink-700">
          Register for VAT once sales pass <b className="fig text-atlas-700">${Math.round(d.setup.vat_threshold_usd / 1000)}K</b>
        </div>
      ) : null}
    </Box>
  );
}
function TaxByLevel({ d }: { d: any }) {
  const groups = d.tax_detail?.groups ?? [];
  return (
    <Box className="md:flex-[3]">
      <CardHead>What the business actually pays, by level</CardHead>
      <div className="grid gap-5 md:grid-cols-3">
        {groups.map((g: any) => (
          <div key={g.level}>
            <div className="mb-2.5 border-b border-parchment pb-2 text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">{g.level}</div>
            <div className="space-y-2.5">
              {(g.items ?? []).map((it: any) => (
                <div key={it.name} className="flex items-baseline gap-3">
                  <span className="w-14 shrink-0 fig text-[17px] tabular-nums text-ink-900">{it.value}</span>
                  <span className="text-[12px] leading-tight text-ink-700"><b className="font-medium text-ink-900">{it.name}</b><br />{it.note}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
}
function Banking({ d }: { d: any }) {
  const b = d.setup?.banking ?? {};
  return (
    <Box className="md:flex-[2]">
      <CardHead>Opening a business bank account</CardHead>
      <div className="mb-3 flex items-center gap-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">How hard</span>
        <span className="rounded-full border border-atlas-200 bg-atlas-50 px-3 py-0.5 text-[13px] font-semibold capitalize text-atlas-700">{b.friction}</span>
        <span className="text-[11.5px] text-ink-600">{b.can_foreigner ? "Open to foreign owners" : "Restricted"}</span>
      </div>
      <ul className="mb-3 space-y-2">
        {(b.bullets ?? []).map((t: string, i: number) => (
          <li key={i} className="relative pl-4 text-[12.5px] leading-snug text-ink-700"><span className="absolute left-0 top-[7px] h-1.5 w-1.5 rounded-full bg-atlas-300" />{t}</li>
        ))}
      </ul>
      {[["High-street", b.banks_traditional], ["Digital", b.banks_digital]].map(([label, arr]) => (
        <div key={label as string} className="flex gap-3 border-t border-parchment py-2">
          <span className="w-20 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">{label}</span>
          <span className="text-[13px] text-ink-800">{((arr as string[]) ?? []).join("  ·  ")}</span>
        </div>
      ))}
    </Box>
  );
}

export default function SpinePage() {
  const d = GB;
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <Hero d={d} />
      <MarginReality />
      <Profile d={d} />

      <Movement eyebrow="Getting set up" heading="What it costs and takes to start" />
      <div className="space-y-4">
        <SetupStepper d={d} />
        <Formation d={d} />
        <div className="flex flex-col gap-4 md:flex-row">
          <TaxByLevel d={d} />
          <Banking d={d} />
        </div>
      </div>
    </main>
  );
}
