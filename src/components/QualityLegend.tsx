/**
 * QualityLegend — explains the 1-10 quality scale used across cell pages.
 * Static, server-renderable. Place in home page footer or about-data page.
 */

const TIERS = [
  { range: "10", label: "Excellent", desc: "Direct primary measurement from a national statistical office", color: "bg-moss-700" },
  { range: "9",  label: "Excellent", desc: "Direct primary, minor gaps", color: "bg-moss-700" },
  { range: "8",  label: "Very High", desc: "Secondary published source (international body)", color: "bg-moss-500" },
  { range: "7",  label: "High", desc: "Modeled from primary with strong fit", color: "bg-atlas-500" },
  { range: "6",  label: "Good", desc: "City overlay from country extrapolation × population share", color: "bg-atlas-500" },
  { range: "5",  label: "Medium", desc: "Proxy country with small scaling", color: "bg-atlas-300" },
  { range: "4",  label: "Low", desc: "Proxy country with moderate scaling", color: "bg-clay-300" },
  { range: "3",  label: "Very Low", desc: "Heavy proxy scaling: interpret carefully", color: "bg-clay-500" },
  { range: "≤2", label: "Hidden", desc: "Too uncertain to surface in default view", color: "bg-clay-700" },
];

export function QualityLegend() {
  return (
    <section className="my-12">
      <div className="rounded-2xl border border-parchment bg-white p-6 md:p-8">
        <div className="text-xs uppercase tracking-wider text-ink-700/60 font-medium mb-2">
          Data quality scale
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-ink-900">
          Every cell carries a 1-10 confidence score
        </h2>
        <p className="mt-2 text-sm text-ink-800/80 max-w-3xl">
          Pulled from direct national statistics where available; extrapolated
          via proxy countries where not. The scale tells you at a glance whether
          to trust the number for decisions or only as a directional signal.
        </p>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
          {TIERS.map((t) => (
            <div key={t.range} className="flex items-start gap-3">
              <div
                className={`mt-0.5 w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-cream-50 shrink-0 ${t.color}`}
              >
                {t.range}
              </div>
              <div>
                <div className="text-sm font-semibold text-ink-900">{t.label}</div>
                <div className="text-xs text-ink-700/80 leading-snug">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
