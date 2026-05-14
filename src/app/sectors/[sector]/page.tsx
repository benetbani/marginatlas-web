import { notFound } from "next/navigation";
import { SECTOR_BY_ID, INDUSTRIES_BY_SECTOR, industryToSlug, SECTORS_ORDERED } from "@/lib/taxonomy";

export const revalidate = 86400;

type Params = { sector: string };

export async function generateStaticParams(): Promise<Params[]> {
  return SECTORS_ORDERED.map((s) => ({ sector: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { sector } = await params;
  const s = SECTOR_BY_ID[sector];
  if (!s) return { title: "Sector not found" };
  return {
    title: `${s.name} — industries and benchmarks | Margin Atlas`,
    description: `Revenue, employment, and wage data for every industry inside ${s.name.toLowerCase()}.`,
  };
}

export default async function SectorPage({ params }: { params: Promise<Params> }) {
  const { sector } = await params;
  const s = SECTOR_BY_ID[sector];
  if (!s) notFound();

  const industries = INDUSTRIES_BY_SECTOR[sector] || [];

  return (
    <div>
      <nav className="text-sm text-ink-700/70 mb-4">
        <a href="/" className="hover:text-atlas-600">Home</a>
        <span className="mx-2">/</span>
        <a href="/browse" className="hover:text-atlas-600">Browse</a>
        <span className="mx-2">/</span>
        <span>{s.name}</span>
      </nav>

      <header className="py-8">
        <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
          Sector
        </div>
        <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight text-ink-900">
          {s.name}
        </h1>
        <p className="mt-3 text-sm text-ink-700/60">
          Includes: {s.examples.join(" · ")}
        </p>
        <p className="mt-4 text-lg text-ink-800/80 max-w-3xl">
          {industries.length} industries in this group. Pick one to see how
          businesses in it earn, employ, and pay across the world.
        </p>
      </header>

      <section className="py-6 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {industries.map((ind) => (
          <a
            key={ind.id}
            href={`/us/california/${industryToSlug(ind.id)}`}
            className="card hover:border-atlas-500 transition"
          >
            <div className="font-medium text-ink-900">{ind.name}</div>
            <div className="text-xs text-ink-700/60 mt-1">
              ({ind.examples.slice(0, 3).join(", ")})
            </div>
            <div className="text-xs text-atlas-600 mt-2">View benchmarks →</div>
          </a>
        ))}
      </section>
    </div>
  );
}
