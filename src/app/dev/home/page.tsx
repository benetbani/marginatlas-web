/**
 * Home redesign MOCKUP (preview route /dev/home — not live). A confident
 * editorial entry: big serif promise, a search entry, three "start anywhere"
 * lanes, and a real data taste. No card grid. Screenshot: scripts/shot.mjs.
 */
import * as React from "react";
import { COUNTRIES, INDUSTRY_BY_ID, industryToSlug } from "@/lib/taxonomy";
import { getTopIndustriesForCountry } from "@/lib/cells";
import { PageShell, ContentColumn } from "@/components/ui/page-shell";

export const dynamic = "force-dynamic";

function usd(n: number | null | undefined): string {
  if (n == null) return "–";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return "$" + Math.round(n / 1e3) + "K";
  return "$" + Math.round(n);
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <h2 data-typography="custom" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400 mb-5">{children}</h2>;
}

const COUNTRIES_PICK = [
  ["us", "United States"], ["de", "Germany"], ["ke", "Kenya"], ["jp", "Japan"],
  ["br", "Brazil"], ["in", "India"],
];
const ACTIVITIES_PICK = [
  ["restaurants", "Restaurants"], ["hair-salons-full", "Hair salons"], ["plumbers", "Plumbers"],
  ["grocery-stores", "Grocery stores"], ["software-development", "Software shops"], ["auto-repair-shops", "Auto repair"],
];
const CITIES_PICK = [
  ["new-york", "New York"], ["london", "London"], ["nairobi", "Nairobi"],
  ["tokyo", "Tokyo"], ["sao-paulo", "Sao Paulo"], ["mumbai", "Mumbai"],
];

export default async function HomeMockup() {
  const nCountries = COUNTRIES.length;
  const nActivities = Object.keys(INDUSTRY_BY_ID).length;
  const taste = await getTopIndustriesForCountry("KE", 6);

  return (
    <PageShell tone="paper">
      <ContentColumn width="wide" className="py-16 md:py-24">
        {/* hero */}
        <div className="max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-atlas-700 mb-5">
            Margin Atlas
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.0] tracking-tight text-ink-900">
            How much does a small business actually make?
          </h1>
          <p className="mt-8 text-xl leading-relaxed text-ink-700 max-w-2xl">
            Typical revenue, costs, and take-home pay for{" "}
            <strong className="text-ink-900 tabular-nums">{nActivities}</strong> kinds of small business across{" "}
            <strong className="text-ink-900 tabular-nums">{nCountries}</strong> countries. Free to read, no account.
          </p>
          <div className="mt-10 flex items-center gap-3 max-w-xl rounded-xl border border-ink-200 bg-cream-50 px-4 py-4 text-ink-400">
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden className="shrink-0">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" fill="none" />
              <path d="M14 14l3.5 3.5" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <span className="text-[15px]">Try "restaurants in Kenya" or "plumbers in Germany"</span>
          </div>
        </div>

        {/* start anywhere */}
        <section className="mt-20 md:mt-28 grid md:grid-cols-3 gap-12 lg:gap-20">
          {[
            { label: "By country", note: `${nCountries} countries, big and small`, items: COUNTRIES_PICK, href: (s: string) => `/${s}` },
            { label: "By activity", note: `${nActivities} kinds of business`, items: ACTIVITIES_PICK, href: (s: string) => `/industries/${s}` },
            { label: "By city", note: "From New York to Nairobi", items: CITIES_PICK, href: (s: string) => `/cities/${s}` },
          ].map((lane) => (
            <div key={lane.label}>
              <Eyebrow>{lane.label}</Eyebrow>
              <p className="text-sm text-ink-500 mb-5">{lane.note}</p>
              <ul className="space-y-2.5">
                {lane.items.map(([slug, name]) => (
                  <li key={slug}>
                    <a href={lane.href(slug)} className="text-[15px] text-ink-800 hover:text-atlas-700 transition-colors">
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* a taste */}
        <section className="mt-20 md:mt-28 border-t border-ink-100 pt-12">
          <Eyebrow>A taste, from Kenya</Eyebrow>
          <div className="grid sm:grid-cols-2 gap-x-12 lg:gap-x-20">
            {taste.map((o) => (
              <a
                key={o.industry_id}
                href={`/ke/kenya/${industryToSlug(o.industry_id)}`}
                className="group flex items-baseline justify-between gap-4 border-b border-ink-100 py-3.5"
              >
                <span className="text-[15px] text-ink-800 group-hover:text-atlas-700 transition-colors">{o.industry_name}</span>
                <span className="tabular-nums text-sm text-ink-500 shrink-0">{usd(o.revenue_per_firm)}</span>
              </a>
            ))}
          </div>
          <p className="mt-6 text-base text-ink-600 max-w-xl">
            Every figure is a typical firm's annual revenue, modeled from public data. Pick any country and activity to
            see the full picture: where firms land, what it costs to run, and what the owner keeps.
          </p>
        </section>
      </ContentColumn>
    </PageShell>
  );
}
