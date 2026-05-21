"use client";

import { useState } from "react";

type Tier = {
  name: string;
  monthly: number;
  annual: number;
  monthlyPrefix?: string;
  blurb: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlight: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Free",
    monthly: 0,
    annual: 0,
    blurb: "Preview snapshots, get a feel for the data, build a watch-list.",
    features: [
      "50 snapshot previews per month",
      "Typical (median) values only",
      "100-row CSV export (watermarked)",
      "5 saved snapshots",
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
    blurb: "For solo founders, operators, and small-business researchers.",
    features: [
      "Unlimited benchmark views",
      "Bottom 10% to top 10%, plus quartiles",
      "CSV/Excel exports up to 10k rows",
      "20 saved snapshots + email alerts",
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
    blurb: "For consultants, advisors, and serious analysts.",
    features: [
      "Everything in Starter",
      "Large-corporation industries unlocked (banking, oil, pharma, etc.) with firm-size segmentation",
      "Granular SMB sub-niches when data lands",
      "Exports up to 100k rows + Parquet format",
      "Unlimited saved snapshots + email alerts",
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

type BillingMode = "annual" | "monthly";

export default function PricingPage() {
  // Plan v16 Block F — default billing mode is Annual.
  const [billing, setBilling] = useState<BillingMode>("annual");

  return (
    <div>
      <header className="py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink-900">
          Pricing
        </h1>
        <p className="mt-4 text-lg text-ink-800/80 max-w-2xl mx-auto">
          Annual billing saves 33%, the equivalent of four months free.
        </p>
        <div className="mt-6 inline-flex items-center rounded-full border border-parchment bg-cream-100 p-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => setBilling("annual")}
            className={`px-5 py-2 rounded-full transition ${
              billing === "annual"
                ? "bg-atlas-600 text-cream-50 shadow-sm"
                : "text-ink-900 hover:bg-white"
            }`}
            aria-pressed={billing === "annual"}
          >
            Annual <span className="text-[10px] tabular-nums ml-1 opacity-80">(save 33%)</span>
          </button>
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={`px-5 py-2 rounded-full transition ${
              billing === "monthly"
                ? "bg-atlas-600 text-cream-50 shadow-sm"
                : "text-ink-900 hover:bg-white"
            }`}
            aria-pressed={billing === "monthly"}
          >
            Monthly
          </button>
        </div>
      </header>
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {TIERS.map((t) => {
          const showAnnual = billing === "annual";
          const headlinePrice = showAnnual ? t.annual : t.monthly;
          const suffix = showAnnual ? " / year" : " / month";
          return (
            <div
              key={t.name}
              className={`card flex flex-col ${
                t.highlight ? "ring-2 ring-atlas-500 shadow-lg" : ""
              }`}
            >
              <div className="text-xs uppercase tracking-wide text-atlas-700 font-semibold">
                {t.name}
              </div>
              <div className="mt-3">
                <span className="text-4xl font-semibold text-ink-900">
                  {t.monthlyPrefix}${headlinePrice}
                </span>
                <span className="text-ink-700/70 text-sm">{suffix}</span>
              </div>
              {t.annual > 0 && (
                <div className="text-xs text-ink-700/70 mt-1">
                  {showAnnual
                    ? `or $${t.monthly} per month`
                    : `or $${t.annual} per year (four months free)`}
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
                    ? "bg-atlas-500 text-cream-50 hover:bg-atlas-600"
                    : "border border-ink-700/20 hover:border-atlas-500 text-ink-900"
                }`}
              >
                {t.cta}
              </a>
            </div>
          );
        })}
      </section>
    </div>
  );
}
