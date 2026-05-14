export const revalidate = 86400;

export default function PricingPage() {
  const tiers = [
    {
      name: "Free",
      monthly: 0,
      annual: 0,
      blurb: "Preview cells, evaluate methodology, build a watch-list.",
      features: [
        "50 cell previews per month",
        "Median (p50) values only",
        "100-row CSV export (watermarked)",
        "Email signup required",
      ],
      cta: "Get started",
      ctaHref: "/sign-up",
      highlight: false,
    },
    {
      name: "Starter",
      monthly: 38,
      annual: 304,
      blurb: "For solo analysts, founders, and researchers.",
      features: [
        "Unlimited cell views",
        "Full p10/p25/p50/p75/p90 distributions",
        "CSV/Excel exports up to 10k rows",
        "5 saved searches",
        "50 AI queries / month",
        "Email support",
      ],
      cta: "Start 7-day Pro trial",
      ctaHref: "/sign-up?tier=starter",
      highlight: false,
    },
    {
      name: "Pro",
      monthly: 78,
      annual: 624,
      blurb: "For teams, consultants, and serious analysts.",
      features: [
        "Everything in Starter",
        "Exports up to 100k rows + Parquet format",
        "Unlimited saved searches + email alerts",
        "Unlimited AI query layer",
        "Priority email support",
        "Quarterly bulk-data parquet download",
      ],
      cta: "Start 7-day Pro trial",
      ctaHref: "/sign-up?tier=pro",
      highlight: true,
    },
    {
      name: "Enterprise",
      monthly: 150,
      annual: 1200,
      monthlyPrefix: "From ",
      blurb: "For firms, fintechs, and bulk-data licensees.",
      features: [
        "Everything in Pro",
        "API access (negotiated rate limit)",
        "Custom data slices (24h turnaround)",
        "White-label exports",
        "Slack support + SLA",
        "Monthly bulk-data drops via R2",
        "Bespoke pricing on request",
      ],
      cta: "Talk to us",
      ctaHref: "mailto:hello@marginatlas.com",
      highlight: false,
    },
  ];

  return (
    <div>
      <header className="py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink-900">
          Pricing
        </h1>
        <p className="mt-4 text-lg text-ink-800/80 max-w-2xl mx-auto">
          Annual billing saves 33% (4 months free).
        </p>
      </header>
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`card flex flex-col ${
              t.highlight ? "ring-2 ring-atlas-500 shadow-lg" : ""
            }`}
          >
            <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
              {t.name}
            </div>
            <div className="mt-3">
              <span className="text-4xl font-semibold text-ink-900">
                {t.monthlyPrefix}${t.monthly}
              </span>
              <span className="text-ink-700/70 text-sm"> / month</span>
            </div>
            {t.annual > 0 && (
              <div className="text-xs text-ink-700/60 mt-1">
                or ${t.annual} / year (4 months free)
              </div>
            )}
            <p className="mt-4 text-sm text-ink-800/80">{t.blurb}</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-800 flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-atlas-500 shrink-0">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href={t.ctaHref}
              className={`mt-6 block text-center px-4 py-3 rounded-xl font-medium transition ${
                t.highlight
                  ? "bg-atlas-500 text-white hover:bg-atlas-600"
                  : "border border-ink-700/20 hover:border-atlas-500 text-ink-900"
              }`}
            >
              {t.cta}
            </a>
          </div>
        ))}
      </section>
    </div>
  );
}
