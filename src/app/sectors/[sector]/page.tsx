import { notFound } from "next/navigation";
import {
  industryToSlug,
  SECTORS_ORDERED,
  resolveSector,
  visibleIndustriesInSector,
  visibleSectors,
  type Industry,
} from "@/lib/taxonomy";
import { getCellBySlug } from "@/lib/cells";

export const revalidate = 86400;

type Params = { sector: string };

export async function generateStaticParams(): Promise<Params[]> {
  return SECTORS_ORDERED.map((s) => ({ sector: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { sector } = await params;
  const s = resolveSector(sector);
  if (!s) return { title: "Sector not found" };
  return {
    title: `${s.name} — industries and benchmarks | Margin Atlas`,
    description: `Revenue, employment, and wage benchmarks for every small-business industry inside ${s.name.toLowerCase()}.`,
  };
}

function fmtMoney(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "—";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

async function quickStat(ind: Industry): Promise<number | null> {
  // Use California as the snapshot anchor for US-resolvable industries.
  try {
    const c = await getCellBySlug("us", "california", industryToSlug(ind.id));
    return c?.revenue_per_firm ?? null;
  } catch {
    return null;
  }
}

export default async function SectorPage({ params }: { params: Promise<Params> }) {
  const { sector } = await params;
  const s = resolveSector(sector);
  if (!s) notFound();

  const isPro = false; // server-side gate would read cookie here later (Phase R)
  const visible = visibleIndustriesInSector(s.id, { revealCorp: isPro });
  const otherSectors = visibleSectors({ revealCorp: isPro }).filter((x) => x.id !== s.id).slice(0, 8);

  // Fetch a quick stat for the first 6 industries (parallel)
  const previewIndustries = visible.slice(0, 6);
  const previewStats = await Promise.all(previewIndustries.map(quickStat));

  return (
    <div>
      <nav className="text-sm text-cocoa-700/70 mb-4">
        <a href="/" className="hover:text-atlas-700">Home</a>
        <span className="mx-2">/</span>
        <a href="/browse" className="hover:text-atlas-700">Browse</a>
        <span className="mx-2">/</span>
        <span className="text-cocoa-900">{s.name}</span>
      </nav>

      <header className="py-8">
        <div className="flex items-start gap-5">
          <div
            className="text-6xl leading-none shrink-0 hidden md:flex items-center justify-center w-24 h-24 rounded-3xl border border-parchment"
            style={{ backgroundColor: s.header_color || "#F8F2E4" }}
            aria-hidden
          >
            {s.icon}
          </div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider text-atlas-700 font-semibold">
              Category
            </div>
            <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight text-ink-900">
              <span className="md:hidden mr-2" aria-hidden>{s.icon}</span>
              {s.name}
            </h1>
            {s.tagline && (
              <p className="mt-2 text-lg text-cocoa-900/80 max-w-3xl">
                {s.tagline}
              </p>
            )}
            <p className="mt-2 text-sm text-cocoa-700/70">
              {visible.length} small-business industries · Browse below
            </p>
          </div>
        </div>
      </header>

      {/* Preview cells with quick stats */}
      {previewIndustries.length > 0 && (
        <section className="py-4">
          <h2 className="text-lg font-semibold text-ink-900 mb-3">
            Top industries here
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {previewIndustries.map((ind, i) => (
              <a
                key={ind.id}
                href={`/us/california/${industryToSlug(ind.id)}`}
                className="rounded-2xl bg-white border border-parchment p-4 hover:border-atlas-600 hover:shadow-[0_6px_20px_rgba(120,53,15,0.08)] transition-all flex flex-col gap-2"
              >
                <div className="font-semibold text-ink-900">{ind.name}</div>
                <div className="text-xs text-cocoa-700/70 line-clamp-2">
                  {(ind.examples || []).slice(0, 3).join(" · ")}
                </div>
                <div className="mt-auto pt-2 border-t border-cocoa-700/10 flex items-baseline justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-cocoa-700/60">
                    California
                  </span>
                  <span className="text-base font-semibold text-ink-900 tabular-nums">
                    {fmtMoney(previewStats[i])}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Full industry list */}
      <section className="py-8">
        <h2 className="text-lg font-semibold text-ink-900 mb-3">
          All industries in {s.name}
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {visible.map((ind) => (
            <a
              key={ind.id}
              href={`/us/california/${industryToSlug(ind.id)}`}
              className="px-3 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 border border-parchment hover:border-atlas-600 transition text-sm text-ink-900"
            >
              {ind.name}
            </a>
          ))}
        </div>
      </section>

      {/* Other categories */}
      {otherSectors.length > 0 && (
        <section className="py-8 border-t border-parchment">
          <h2 className="text-lg font-semibold text-ink-900 mb-3">
            Other categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherSectors.map((other) => (
              <a
                key={other.id}
                href={`/sectors/${other.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-100 border border-parchment hover:border-atlas-600 text-sm text-cocoa-900 transition"
              >
                <span aria-hidden>{other.icon}</span>
                <span>{other.name}</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
