/**
 * Sectors redesign MOCKUP (preview route /dev/sectors — not live). A generous
 * editorial directory: every sector with its activities listed beneath, scannable.
 * No card grid, no emoji icons. Screenshot: node scripts/shot.mjs /dev/sectors
 */
import * as React from "react";
import { SECTOR_BY_ID, INDUSTRY_BY_ID, industryToSlug } from "@/lib/taxonomy";
import { PageShell, ContentColumn } from "@/components/ui/page-shell";

export const dynamic = "force-dynamic";

type Ind = { id: string; name: string; sector_id: string; audience?: string };

export default async function SectorsMockup() {
  const all = Object.values(INDUSTRY_BY_ID) as unknown as Ind[];
  const sectors = Object.values(SECTOR_BY_ID) as unknown as { id: string; name: string }[];

  const bySector = new Map<string, Ind[]>();
  for (const ind of all) {
    const a = ind.audience;
    if (a && a !== "smb_core" && a !== "smb_friendly") continue;
    if (!bySector.has(ind.sector_id)) bySector.set(ind.sector_id, []);
    bySector.get(ind.sector_id)!.push(ind);
  }
  const ordered = sectors
    .map((s) => ({ s, items: (bySector.get(s.id) ?? []).sort((a, b) => a.name.localeCompare(b.name)) }))
    .filter((x) => x.items.length > 0)
    .sort((a, b) => b.items.length - a.items.length);

  const nActivities = ordered.reduce((n, x) => n + x.items.length, 0);

  return (
    <PageShell tone="paper">
      <ContentColumn width="wide" className="py-10 md:py-16">
        <nav aria-label="Breadcrumb" className="text-[13px] text-ink-500 mb-12">
          <a href="/" className="hover:text-ink-800">Home</a>
          <span className="mx-1.5 text-ink-300">/</span>
          <span className="text-ink-700">Sectors</span>
        </nav>

        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-atlas-700 mb-4">Browse</div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.03] tracking-tight text-ink-900 max-w-3xl">
          Every kind of small business, by sector
        </h1>
        <p className="mt-7 text-lg md:text-xl leading-relaxed text-ink-700 max-w-2xl">
          <strong className="text-ink-900 tabular-nums">{nActivities}</strong> activities across{" "}
          <strong className="text-ink-900 tabular-nums">{ordered.length}</strong> sectors. Pick a trade to see what it
          typically makes, anywhere in the world.
        </p>

        <div className="mt-14 md:mt-20">
          {ordered.map(({ s, items }) => (
            <section key={s.id} className="border-t border-ink-100 py-8 md:py-10 grid md:grid-cols-[200px_1fr] gap-4 md:gap-10">
              <div>
                <h2 className="font-display text-xl md:text-2xl text-ink-900 leading-tight">{s.name}</h2>
                <p className="mt-1 text-[13px] text-ink-400 tabular-nums">{items.length} activities</p>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2.5 self-center">
                {items.map((a) => (
                  <a
                    key={a.id}
                    href={`/industries/${industryToSlug(a.id)}`}
                    className="text-[15px] text-ink-700 hover:text-atlas-700 transition-colors"
                  >
                    {a.name}
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </ContentColumn>
    </PageShell>
  );
}
