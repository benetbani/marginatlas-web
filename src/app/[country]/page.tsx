import { notFound } from "next/navigation";
import { COUNTRIES, SECTORS_ORDERED, INDUSTRIES_BY_SECTOR, industryToSlug } from "@/lib/taxonomy";

export const revalidate = 86400;

type Params = { country: string };

export async function generateStaticParams(): Promise<Params[]> {
  return COUNTRIES.map((c) => ({ country: c.code.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { country } = await params;
  const c = COUNTRIES.find((x) => x.code.toLowerCase() === country.toLowerCase());
  if (!c) return { title: "Country not found" };
  return {
    title: `Small business benchmarks in ${c.name} | Margin Atlas`,
    description: `Revenue, employment, and wage data for businesses across ${c.name}, organized by industry and region.`,
  };
}

export default async function CountryPage({ params }: { params: Promise<Params> }) {
  const { country } = await params;
  const c = COUNTRIES.find((x) => x.code.toLowerCase() === country.toLowerCase());
  if (!c) notFound();

  const cc = c.code.toLowerCase();
  const isUS = c.code === "US";

  return (
    <div>
      <nav className="text-sm text-ink-700/70 mb-4">
        <a href="/" className="hover:text-atlas-600">Home</a>
        <span className="mx-2">/</span>
        <span>{c.name}</span>
      </nav>

      <header className="py-8">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink-900">
          Small business in {c.name}
        </h1>
        <p className="mt-4 text-lg text-ink-800/80 max-w-3xl">
          {isUS
            ? "Pick a state below, then an industry, to see typical revenue, employment, and wages."
            : "Pick a sector below to see how that part of the economy looks here. Per-state data coming as we expand."}
        </p>
      </header>

      {isUS && (
        <section className="py-6">
          <h2 className="text-xl md:text-2xl font-semibold text-ink-900">By state</h2>
          <div className="mt-4 grid sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {US_STATES_LIST.map((s) => (
              <a
                key={s}
                href={`/${cc}/${s.toLowerCase().replace(/\s+/g, "-")}/restaurants`}
                className="px-3 py-2 rounded-lg border border-slate-200/60 bg-white hover:border-atlas-500 transition text-sm text-ink-900"
              >
                {s}
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="py-10">
        <h2 className="text-xl md:text-2xl font-semibold text-ink-900">By sector</h2>
        <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {SECTORS_ORDERED.map((s) => {
            const inds = INDUSTRIES_BY_SECTOR[s.id] || [];
            const firstIndSlug = inds.length > 0 ? industryToSlug(inds[0].id) : "";
            const href = isUS && firstIndSlug
              ? `/${cc}/california/${firstIndSlug}`
              : `/sectors/${s.id}`;
            return (
              <a
                key={s.id}
                href={href}
                className="card hover:border-atlas-500 transition"
              >
                <div className="font-medium text-ink-900">{s.name}</div>
                <div className="text-xs text-ink-700/60 mt-1">
                  {s.examples.slice(0, 3).join(" · ")}
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}

const US_STATES_LIST = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma",
  "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];
