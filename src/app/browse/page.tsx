import { SECTORS_ORDERED, COUNTRIES, INDUSTRIES_BY_SECTOR } from "@/lib/taxonomy";

export const revalidate = 86400; // 1 day

// Country flag emoji from ISO code
function flag(code: string): string {
  if (code.length !== 2) return "🌐";
  const codePoints = code.toUpperCase().split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...codePoints);
}

export default function BrowsePage() {
  // Show top 16 countries by quality
  const topCountries = COUNTRIES.filter((c) => c.quality === "A" || c.quality === "B").slice(0, 16);
  const allOthers = COUNTRIES.filter((c) => c.quality === "C" || c.quality === "D");

  return (
    <div>
      <header className="py-10">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink-900">
          Browse the data
        </h1>
        <p className="mt-3 text-lg text-ink-800/80 max-w-2xl">
          Pick a country to see what we know about businesses there, or pick a
          sector to compare the same kind of business across the world.
        </p>
      </header>

      {/* By country */}
      <section className="py-6">
        <h2 className="text-xl md:text-2xl font-semibold text-ink-900">By country</h2>
        <p className="text-sm text-ink-700/70 mt-1">
          The 16 countries with the richest data. <span className="text-ink-700/50">{allOthers.length} more available with lighter coverage.</span>
        </p>
        <div className="mt-5 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {topCountries.map((c) => (
            <a
              key={c.code}
              href={`/${c.code.toLowerCase()}`}
              className="card hover:border-atlas-500 transition flex items-center gap-3"
            >
              <span className="text-2xl">{flag(c.code)}</span>
              <div>
                <div className="font-medium text-ink-900">{c.name}</div>
                <div className="text-xs text-ink-700/60">
                  {c.quality === "A" ? "Richest data" : "Good coverage"}
                </div>
              </div>
            </a>
          ))}
        </div>
        {allOthers.length > 0 && (
          <details className="mt-6">
            <summary className="text-sm text-atlas-600 cursor-pointer hover:underline">
              + Show {allOthers.length} more countries
            </summary>
            <div className="mt-3 grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {allOthers.map((c) => (
                <a
                  key={c.code}
                  href={`/${c.code.toLowerCase()}`}
                  className="px-3 py-2 rounded-lg border border-slate-200/60 bg-white hover:border-atlas-500 transition text-sm flex items-center gap-2"
                >
                  <span>{flag(c.code)}</span>
                  <span className="text-ink-900">{c.name}</span>
                </a>
              ))}
            </div>
          </details>
        )}
      </section>

      {/* By sector */}
      <section className="py-12">
        <h2 className="text-xl md:text-2xl font-semibold text-ink-900">By sector</h2>
        <p className="text-sm text-ink-700/70 mt-1">
          Big industry families. Pick one to see the specific industries inside.
        </p>
        <div className="mt-5 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {SECTORS_ORDERED.map((s) => {
            const indCount = (INDUSTRIES_BY_SECTOR[s.id] || []).length;
            return (
              <a
                key={s.id}
                href={`/sectors/${s.id}`}
                className="card hover:border-atlas-500 transition"
              >
                <div className="font-medium text-ink-900">{s.name}</div>
                <div className="text-xs text-ink-700/60 mt-1">
                  {s.examples.slice(0, 3).join(" · ")}
                </div>
                <div className="text-xs text-atlas-600 mt-2">
                  {indCount} industries →
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Popular pages */}
      <section className="py-12">
        <h2 className="text-xl md:text-2xl font-semibold text-ink-900">Popular pages</h2>
        <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            ["/us/california/restaurants", "Restaurants — California"],
            ["/us/texas/auto-repair-shops", "Auto repair — Texas"],
            ["/us/new-york/legal-services", "Legal services — New York"],
            ["/us/florida/hairdressers-beauty", "Hairdressers & beauty — Florida"],
            ["/us/massachusetts/software-development", "Software development — Massachusetts"],
            ["/us/illinois/manufacturing", "Manufacturing — Illinois"],
            ["/us/california/dental-practices", "Dental practices — California"],
            ["/us/texas/construction", "Construction — Texas"],
            ["/us/new-york/banking", "Banking — New York"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="block px-4 py-3 rounded-xl border border-slate-200/60 bg-white hover:border-atlas-500 transition text-sm text-ink-900"
            >
              {label} →
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
