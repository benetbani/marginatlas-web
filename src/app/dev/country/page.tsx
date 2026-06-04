/**
 * Country-page redesign MOCKUP (preview route /dev/country — not live). Kenya.
 * Same locked system: PageShell, big serif hero, an editorial "what people run"
 * index as the centerpiece, regions, a coverage line. No card grid. Screenshot:
 * node scripts/shot.mjs /dev/country
 */
import * as React from "react";
import { getTopIndustriesForCountry } from "@/lib/cells";
import { COUNTRIES, INDUSTRY_BY_ID, SECTOR_BY_ID, industryToSlug } from "@/lib/taxonomy";
import { PageShell, ContentColumn } from "@/components/ui/page-shell";

export const dynamic = "force-dynamic";

const ISO = "KE";

function usd(n: number | null | undefined): string {
  if (n == null) return "–";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return "$" + Math.round(n / 1e3) + "K";
  return "$" + Math.round(n);
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <h2 data-typography="custom" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400 mb-6">{children}</h2>;
}

export default async function CountryMockup() {
  const meta = COUNTRIES.find((c) => c.code === ISO);
  const name = meta?.name ?? "Kenya";
  const top = await getTopIndustriesForCountry(ISO, 18);

  // group regions as a simple list from admin1, best-effort
  let regions: { name: string; slug: string }[] = [];
  try {
    const mod = await import("@/lib/coverage/admin1");
    const fn = (mod as unknown as { getAdmin1Regions?: (iso: string) => Promise<{ name: string; slug: string }[]> }).getAdmin1Regions;
    if (fn) regions = (await fn(ISO))?.slice(0, 16) ?? [];
  } catch {
    regions = [];
  }

  return (
    <PageShell tone="paper">
      <ContentColumn width="wide" className="py-10 md:py-16">
        <nav aria-label="Breadcrumb" className="text-[13px] text-ink-500 mb-12">
          <a href="/" className="hover:text-ink-800">Home</a>
          <span className="mx-1.5 text-ink-300">/</span>
          <span className="text-ink-700">{name}</span>
        </nav>

        {/* hero */}
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-atlas-700 mb-4">
          {name}
        </div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.03] tracking-tight text-ink-900 max-w-3xl">
          What people run in {name}, and what it pays
        </h1>
        <p className="mt-7 text-lg md:text-xl leading-relaxed text-ink-700 max-w-2xl">
          Kenya runs on micro-enterprise: a duka on the corner, a boda boda rider, a single-chair kinyozi, a kibanda
          serving lunch. We model the typical revenue, costs and size of {top.length} of the most common small
          businesses here.
        </p>

        {/* the index — what people actually run */}
        <section className="mt-16 md:mt-24">
          <Eyebrow>What people actually run</Eyebrow>
          <div className="grid sm:grid-cols-2 gap-x-12 lg:gap-x-20">
            {top.map((o) => {
              const ind = INDUSTRY_BY_ID[o.industry_id];
              const sector = ind ? SECTOR_BY_ID[ind.sector_id] : null;
              return (
                <a
                  key={o.industry_id}
                  href={`/ke/kenya/${industryToSlug(o.industry_id)}`}
                  className="group flex items-baseline justify-between gap-4 border-b border-ink-100 py-3.5"
                >
                  <span className="min-w-0">
                    <span className="text-[15px] text-ink-800 group-hover:text-atlas-700 transition-colors">
                      {o.industry_name}
                    </span>
                    {sector && (
                      <span className="ml-2 text-[11px] uppercase tracking-wide text-ink-400">{sector.name}</span>
                    )}
                  </span>
                  <span className="tabular-nums text-sm text-ink-500 shrink-0">{usd(o.revenue_per_firm)}</span>
                </a>
              );
            })}
          </div>
          <p className="mt-6 text-sm text-ink-500">Figures are a typical firm's annual revenue. Open any for the full breakdown.</p>
        </section>

        {/* regions */}
        {regions.length > 0 && (
          <section className="mt-16 md:mt-24 border-t border-ink-100 pt-12">
            <Eyebrow>Across {name}</Eyebrow>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {regions.map((r) => (
                <a key={r.slug} href={`/ke/${r.slug}`} className="text-[15px] text-ink-700 hover:text-atlas-700 transition-colors">
                  {r.name}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* coverage */}
        <section className="mt-16 md:mt-24 border-t border-ink-100 pt-12">
          <Eyebrow>How we cover {name}</Eyebrow>
          <p className="text-lg leading-relaxed text-ink-700 max-w-2xl">
            Kenya is a modeled, low-confidence read: built from national small-business surveys and sector field
            reports, not a per-firm census. The numbers are honest estimates for a sense of scale, not audited
            accounts. Where a duka and a supermarket are both "grocery," the typical leans to the duka, because that
            is the reality of the street.
          </p>
        </section>
      </ContentColumn>
    </PageShell>
  );
}
