/**
 * Cities redesign MOCKUP (preview route /dev/cities — not live). A world-cities
 * directory grouped by tier, editorial links. No card grid. Screenshot:
 * node scripts/shot.mjs /dev/cities
 */
import * as React from "react";
import citiesData from "@/lib/cities/top100.json";
import { PageShell, ContentColumn } from "@/components/ui/page-shell";

export const dynamic = "force-dynamic";

type City = { id: string; name: string; country_name: string; tier: number; slug: string; population?: number };

const TIERS = [
  { t: 1, label: "Global metropolises" },
  { t: 2, label: "Major and capital cities" },
  { t: 3, label: "Secondary cities" },
];

export default async function CitiesMockup() {
  const cities = ((citiesData as { cities: City[] }).cities ?? []).slice();

  return (
    <PageShell tone="paper">
      <ContentColumn width="wide" className="py-10 md:py-16">
        <nav aria-label="Breadcrumb" className="text-[13px] text-ink-500 mb-12">
          <a href="/" className="hover:text-ink-800">Home</a>
          <span className="mx-1.5 text-ink-300">/</span>
          <span className="text-ink-700">Cities</span>
        </nav>

        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-atlas-700 mb-4">Browse</div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.03] tracking-tight text-ink-900 max-w-3xl">
          Small business in the world's cities
        </h1>
        <p className="mt-7 text-lg md:text-xl leading-relaxed text-ink-700 max-w-2xl">
          What a cafe makes in Tokyo, a salon in Lagos, a corner shop in Mumbai. Costs and earnings bend with the
          city: rent, wages, and what people will pay all shift block to block.
        </p>

        <div className="mt-14 md:mt-20">
          {TIERS.map(({ t, label }) => {
            const group = cities.filter((c) => c.tier === t).sort((a, b) => (b.population ?? 0) - (a.population ?? 0));
            if (group.length === 0) return null;
            return (
              <section key={t} className="border-t border-ink-100 py-8 md:py-10">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400 mb-6">{label}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-0.5">
                  {group.map((c) => (
                    <a
                      key={c.id}
                      href={`/cities/${c.slug}`}
                      className="group flex items-baseline justify-between gap-4 border-b border-ink-100 py-3"
                    >
                      <span className="text-[15px] text-ink-800 group-hover:text-atlas-700 transition-colors">{c.name}</span>
                      <span className="text-[13px] text-ink-400 shrink-0">{c.country_name}</span>
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </ContentColumn>
    </PageShell>
  );
}
