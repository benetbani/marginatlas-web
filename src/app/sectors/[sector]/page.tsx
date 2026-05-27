import { notFound } from "next/navigation";
import {
  industryToSlug,
  SECTORS_ORDERED,
  resolveSector,
  visibleIndustriesInSector,
  visibleSectors,
} from "@/lib/taxonomy";
import { SectorIcon } from "@/components/icons/SectorIcon";
import { MoreDepthBanner } from "@/components/monetization";

export const revalidate = 86400;
// Defer cold sectors to on-demand rendering so the build
// doesn't time out. Top sectors pre-render; rest via dynamicParams.
export const dynamicParams = true;

type Params = { sector: string };

const STATIC_SECTOR_IDS = new Set([
  "food_drink",
  "retail_shops",
  "beauty_wellness",
  "professional_services",
  "software_tech",
  "trades_home",
  "hospitality",
]);

export async function generateStaticParams(): Promise<Params[]> {
  return SECTORS_ORDERED
    .filter((s) => STATIC_SECTOR_IDS.has(s.id))
    .map((s) => ({ sector: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { sector } = await params;
  const s = resolveSector(sector);
  if (!s) return { title: "Sector not found" };
  return {
    title: `${s.name}: industries and benchmarks | Margin Atlas`,
    description: `Revenue, employment, and wage benchmarks for every small-business industry inside ${s.name.toLowerCase()}.`,
  };
}

// Country-page rebuild §8 (2026-05-25): the SectorAcrossWorld bar
// chart was removed because the cross-country revenue dispersion is
// dominated by the wrong-aggregation tail (India carpenters showing
// $11.6M alongside Germany at $118K). Global averages are also
// removed from the preview tiles below: a single anchor cell's
// revenue (previously California restaurants) does not generalize
// across countries and reads as authoritative when it is not.

export default async function SectorPage({ params }: { params: Promise<Params> }) {
  const { sector } = await params;
  const s = resolveSector(sector);
  if (!s) notFound();

  const isPro = false; // server-side gate would read cookie here later (Phase R)
  const visible = visibleIndustriesInSector(s.id, { revealCorp: isPro });
  const otherSectors = visibleSectors({ revealCorp: isPro }).filter((x) => x.id !== s.id).slice(0, 8);

  // Top 6 industries to feature at the top of the page. Names + examples
  // only — no global revenue number. The user clicks through to the
  // industry page to see country-specific data.
  const previewIndustries = visible.slice(0, 6);

  return (
    <div>
      <nav className="text-sm text-cocoa-700/70 mb-4">
        <a href="/" className="hover:text-atlas-700">Home</a>
        <span className="mx-2">/</span>
        <a href="/browse" className="hover:text-atlas-700">Browse</a>
        <span className="mx-2">/</span>
        <span className="text-ink-900">{s.name}</span>
      </nav>

      <header className="py-8">
        <div className="flex items-start gap-5">
          <div
            className="shrink-0 hidden md:flex items-center justify-center w-24 h-24 rounded-3xl border border-parchment text-atlas-700"
            style={{ backgroundColor: s.header_color || "#F5F5F5" }}
            aria-hidden
          >
            <SectorIcon sectorId={s.id} size={48} weight="duotone" />
          </div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider text-atlas-700 font-semibold">
              Category
            </div>
            <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight text-ink-900 flex items-center gap-3">
              <span className="md:hidden text-atlas-700" aria-hidden>
                <SectorIcon sectorId={s.id} size={32} weight="duotone" />
              </span>
              {s.name}
            </h1>
            {s.tagline && (
              <p className="mt-2 text-lg text-ink-900/80 max-w-3xl">
                {s.tagline}
              </p>
            )}
            <p className="mt-2 text-sm text-cocoa-700/70">
              {visible.length} small-business activities. Browse below.
            </p>
          </div>
        </div>
      </header>

      {/* Featured activities. Tile shows activity name + a few examples
         and links to the activity page where country-specific data
         lives. No global typical-revenue number — see §8 rebuild note. */}
      {previewIndustries.length > 0 && (
        <section className="py-4">
          <h2 className="text-lg font-semibold text-ink-900 mb-3">
            Featured activities here
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {previewIndustries.map((ind) => (
              <a
                key={ind.id}
                href={`/industries/${industryToSlug(ind.id)}`}
                className="atlas-card p-4 flex flex-col gap-2"
              >
                <div className="font-semibold text-ink-900">{ind.name}</div>
                <div className="text-xs text-cocoa-700/70 line-clamp-2">
                  {(ind.examples || []).slice(0, 4).join(" - ")}
                </div>
                <div className="mt-1 text-[11px] text-atlas-700 font-medium">
                  Open the benchmark &rarr;
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* v34 Phase C sector-page lock: deep comparison across the
         whole sector is a Premium feature (Part 5.1). */}
      <MoreDepthBanner
        headline={`Compare every activity in ${s.name} side by side, with all quartiles.`}
        tier="premium"
        entry="sector_deep_comparison"
      />

      {/* Full industry list */}
      <section className="py-8">
        <h2 className="text-lg font-semibold text-ink-900 mb-3">
          All activities in {s.name}
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {visible.map((ind) => (
            <a
              key={ind.id}
              href={`/industries/${industryToSlug(ind.id)}`}
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-100 border border-parchment hover:border-atlas-600 text-sm text-ink-900 transition"
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
