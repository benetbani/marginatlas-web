/**
 * /download/2026-benchmarks — free PDF in exchange for an email.
 * Server component for the page shell; the form is a small client island.
 */

import { Suspense } from "react";
import LeadMagnetForm from "@/components/newsletter/LeadMagnetForm";
import { colors } from "@/lib/design-tokens";

export const metadata = {
  title: "Get the 2026 small business benchmarks PDF · Margin Atlas",
  description:
    "Median revenue, margin, and wages for 24 industries across 12 economies, with methodology and sourcing.",
};

const SAMPLE_TESTIMONIAL = {
  quote:
    "Atlas is the rare data product that respects the reader. The numbers are honest and the writing is calm.",
  attribution: "María González, café operator, Lisbon",
};

export default function LeadMagnetPage() {
  const testimonial = SAMPLE_TESTIMONIAL;
  return (
    <article>
      {/* Hero */}
      <section className="bg-cream-50 border-b border-parchment">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">
              Free PDF · 38 pages
            </p>
            <h1 className="font-display mt-3 text-balance text-4xl sm:text-5xl leading-[1.06] tracking-[-0.022em] font-semibold text-ink-900">
              Get the 2026 small business benchmarks PDF.
            </h1>

            <ul className="mt-6 space-y-2.5">
              {[
                "Median revenue, margin, and wages for 24 industries across 12 economies.",
                "Cost-structure breakdown for the typical operator in each cell.",
                "Methodology and sourcing trail so the numbers hold up under scrutiny.",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-base text-ink-900">
                  <span
                    aria-hidden="true"
                    className="inline-block rounded-sm shrink-0 bg-atlas-500"
                    style={{ width: 8, height: 8, marginTop: 6 }}
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <Suspense>
              <LeadMagnetForm />
            </Suspense>
          </div>

          {/* PDF cover mock */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm" style={{ transform: "rotate(-1.2deg)" }}>
              <div
                className="rounded-md aspect-[3/4] flex flex-col p-6 sm:p-8 text-cream-50"
                style={{
                  background: `linear-gradient(160deg, ${colors.atlas[700]} 0%, ${colors.ink[800]} 100%)`,
                  boxShadow: "0 1px 2px rgba(26,26,26,0.1), 0 30px 60px rgba(26,26,26,0.22)",
                  border: "1px solid rgba(254, 251, 246, 0.08)",
                }}
              >
                <p className="text-[10px] uppercase tracking-[0.28em] font-semibold text-cream-50/70">
                  Margin Atlas · 2026
                </p>
                <p
                  className="font-display mt-1 font-bold tracking-[-0.022em]"
                  style={{ fontSize: 38, lineHeight: 1.04 }}
                >
                  Small business
                  <br />
                  benchmarks.
                </p>
                <div className="mt-auto pt-4 border-t border-cream-50/20">
                  <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-cream-50/70">
                    Includes
                  </p>
                  <p className="font-display italic mt-1 text-sm">
                    24 industries · 12 economies · methodology trail
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample charts */}
      <section className="bg-cream-100 border-b border-parchment">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
          <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">
            What's in the PDF
          </p>
          <h2 className="font-display mt-3 text-2xl sm:text-3xl leading-[1.1] tracking-[-0.02em] font-semibold text-ink-900">
            Three of the 38 pages.
          </h2>

          <ul className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <li><SampleChart kind="distribution" title="Revenue distribution"   subtitle="Restaurants across 12 cities" /></li>
            <li><SampleChart kind="waterfall"    title="Smart waterfall"        subtitle="Where each dollar of revenue goes" /></li>
            <li><SampleChart kind="ranges"       title="Wage ranges by role"    subtitle="A typical 4-person restaurant" /></li>
          </ul>
        </div>
      </section>

      {/* Trust + testimonial */}
      <section className="bg-cream-50 border-b border-parchment">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">
            From the team behind marginatlas.com
          </p>
          {testimonial && (
            <blockquote className="font-display italic mt-5 text-balance text-xl sm:text-2xl leading-[1.4] font-medium text-ink-900">
              "{testimonial.quote}"
              <footer className="not-italic mt-3 text-sm text-cocoa-700">
                {testimonial.attribution}
              </footer>
            </blockquote>
          )}
        </div>
      </section>

      {/* Footer links */}
      <section className="bg-cream-50">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
          <a href="/pricing"     className="font-semibold text-atlas-700 hover:underline">Pricing</a>
          <a href="/about"       className="font-semibold text-atlas-700 hover:underline">About Atlas</a>
          <a href="/methodology" className="font-semibold text-atlas-700 hover:underline">Methodology</a>
        </div>
      </section>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Sample chart components — render placeholder versions of the real Atlas
// charts so the visitor can see what they're getting.
// ---------------------------------------------------------------------------
function SampleChart({
  kind,
  title,
  subtitle,
}: {
  kind: "distribution" | "waterfall" | "ranges";
  title: string;
  subtitle: string;
}) {
  return (
    <article className="rounded-lg p-5 h-full bg-cream-50 border border-parchment">
      <p className="font-display text-base font-semibold tracking-[-0.012em] text-ink-900">{title}</p>
      <p className="text-xs mt-1 text-cocoa-700">{subtitle}</p>
      <div className="mt-4">
        {kind === "distribution" && <Distribution />}
        {kind === "waterfall"    && <Waterfall />}
        {kind === "ranges"       && <Ranges />}
      </div>
    </article>
  );
}

function Distribution() {
  const bars = [12, 24, 38, 56, 78, 92, 84, 68, 48, 32, 18, 10];
  return (
    <div className="flex items-end gap-1.5" style={{ height: 96 }}>
      {bars.map((b, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="flex-1 rounded-sm"
          style={{
            height: `${b}%`,
            background: i === 5 ? colors.atlas[700] : colors.atlas[500],
            opacity: i === 5 ? 1 : 0.7,
          }}
        />
      ))}
    </div>
  );
}

function Waterfall() {
  // Color jobs per design-system.md 3.2: cocoa = structure and costs,
  // moss = what is kept. The profit row is the page's one moss moment.
  const lines = [
    { label: "Revenue", w: "100%", c: colors.cocoa[700] },
    { label: "Food",    w: "32%",  c: colors.cocoa[500] },
    { label: "Labor",   w: "30%",  c: colors.cocoa[500] },
    { label: "Rent",    w: "9%",   c: colors.cocoa[300] },
    { label: "Other",   w: "17%",  c: colors.cocoa[300] },
    { label: "Profit",  w: "12%",  c: colors.moss[600], profit: true },
  ];
  return (
    <ul className="space-y-1.5">
      {lines.map((l) => (
        <li key={l.label} className="grid grid-cols-12 items-center gap-2 text-[11px]">
          <span
            className={`col-span-4 ${l.profit ? "text-moss-700 font-semibold" : "text-ink-900 font-medium"}`}
          >
            {l.label}
          </span>
          <span
            aria-hidden="true"
            className="col-span-6 block rounded-sm"
            style={{ height: 6, width: l.w, background: l.c, opacity: l.profit ? 1 : 0.85 }}
          />
          <span className="col-span-2 text-right tabular-nums text-cocoa-700">{l.w}</span>
        </li>
      ))}
    </ul>
  );
}

function Ranges() {
  const rows = [
    { role: "Manager",   l: 36, m: 50, h: 78 },
    { role: "Head chef", l: 30, m: 42, h: 62 },
    { role: "Cook",      l: 22, m: 30, h: 44 },
    { role: "Server",    l: 18, m: 26, h: 38 },
  ];
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.role} className="text-[11px]">
          <div className="flex justify-between text-ink-900">
            <span>{r.role}</span>
            <span className="tabular-nums text-cocoa-700">${r.m}K</span>
          </div>
          <div className="relative h-1.5 mt-1 rounded-full bg-cream-100">
            <span
              aria-hidden="true"
              className="absolute inset-y-0 rounded-full"
              style={{ left: `${r.l}%`, width: `${r.h - r.l}%`, background: colors.atlas[500], opacity: 0.7 }}
            />
            <span
              aria-hidden="true"
              className="absolute"
              style={{
                left: `${r.m}%`,
                top: -2,
                bottom: -2,
                width: 2,
                background: colors.atlas[700],
                borderRadius: 2,
                transform: "translateX(-50%)",
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
