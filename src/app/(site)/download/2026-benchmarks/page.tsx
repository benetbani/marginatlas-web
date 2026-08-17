/**
 * /download/2026-benchmarks — the benchmarks PDF, when it exists, in exchange
 * for an email. Nothing is delivered yet; the form captures the address.
 * Server component for the page shell; the form is a small client island.
 */

import { Suspense } from "react";
import LeadMagnetForm from "@/components/newsletter/LeadMagnetForm";
import { colors } from "@/lib/design-tokens";

/* THE PAGE WAS HONEST AND ITS `<head>` WAS NOT. The body says "It is still
   being put together", and the comment below records why "38 pages" was
   deleted rather than adjusted: a page count can only be read as a fact about
   a document somebody has seen. The metadata had never caught up. It said "Get
   the ... PDF", which in a search result is an offer of a file, and stated the
   contents flatly as though describing something finished.

   A reader arriving from that snippet finds a form. The gap between the two is
   small, but this site's entire position is that its numbers can be trusted,
   and the cheapest place to lose that is a promise made before anyone has
   clicked. Title names the document without offering it; the description leads
   with the status. The specific counts are gone for the same reason the page
   count went: nobody has seen this document, so no count is the right one. */
export const metadata = {
  title: "The 2026 small business benchmarks PDF · Margin Atlas",
  description:
    "Still being put together. Leave an email and it comes to you when it is done: median revenue, margin and wages by industry and economy, with the methodology and sourcing trail.",
  alternates: { canonical: "/download/2026-benchmarks" },
};

/* A FABRICATED TESTIMONIAL FROM A PERSON WHO DOES NOT EXIST STOOD HERE, and it
   rendered. "Maria Gonzalez, cafe operator, Lisbon" praising the product, under
   a heading claiming it came from the team behind marginatlas.com. The variable
   was called SAMPLE_TESTIMONIAL and was assigned unconditionally one line into
   the component, so the word "sample" existed only in the source.

   An invented endorsement attributed to a named individual is not a placeholder
   that can wait for real copy. It is the one thing on this site that could not
   be corrected later by filling a number in, so it is deleted rather than
   tagged. When a real operator says something real, quote them. */

export default function LeadMagnetPage() {
  return (
    <article>
      {/* Hero */}
      {/* FOUR SECTION GROUNDS REMOVED. bg-cream-50 is #ffffff and bg-cream-100
          is a solid neutral; both are fully opaque, and AtlasFrame paints a
          fixed photograph behind every route with no centre plate. Four bands
          running end to end made this page a solid sheet. A band is not a
          card. The mx-auto max-w-6xl px-6 wrappers go too: SiteChrome already
          gives this route max-w-content mx-auto px-6, so they were a 1024
          column inside the site's 1072 with a doubled gutter. */}
      <section className="py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="atlas-card lg:col-span-7 px-5 py-6 md:px-7 md:py-7">
            {/* "Free PDF - 38 pages", and there is no PDF. Page counts,
                like the "Three of the 38 pages" below, are the sort of detail
                that can only be read as a fact about a document somebody has
                seen. Removed rather than adjusted, because no number is the
                right number for a document that does not exist. */}
            <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">
              Free, in exchange for an email
            </p>
            <h1 className="font-display mt-3 text-balance text-4xl sm:text-5xl leading-[1.06] tracking-[-0.022em] font-semibold text-ink-900">
              The 2026 small business benchmarks, as a PDF.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-cocoa-700">
              It is still being put together. Leave an email and it comes to you
              when it is done.
            </p>

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
                className="rounded-md aspect-[3/4] flex flex-col p-6 sm:p-8 text-white"
                style={{
                  background: `linear-gradient(160deg, ${colors.atlas[700]} 0%, ${colors.ink[800]} 100%)`,
                  boxShadow: "0 1px 2px rgba(26,26,26,0.1), 0 30px 60px rgba(26,26,26,0.22)",
                  border: "1px solid rgba(254, 251, 246, 0.08)",
                }}
              >
                <p className="text-[10px] uppercase tracking-[0.28em] font-semibold text-white/70">
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
                <div className="mt-auto pt-4 border-t border-white/20">
                  <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-white/70">
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
      <section className="py-14 sm:py-20">
        <div className="atlas-card px-5 py-6 md:px-7 md:py-7">
          <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">
            What it will hold
          </p>
          <h2 className="font-display mt-3 text-2xl sm:text-3xl leading-[1.1] tracking-[-0.02em] font-semibold text-ink-900">
            The shape of it.
          </h2>

          <ul className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <li><SampleChart kind="distribution" title="Revenue distribution"   subtitle="Restaurants across 12 cities" /></li>
            <li><SampleChart kind="waterfall"    title="Smart waterfall"        subtitle="Where each dollar of revenue goes" /></li>
            <li><SampleChart kind="ranges"       title="Wage ranges by role"    subtitle="A typical 4-person restaurant" /></li>
          </ul>
        </div>
      </section>

      {/* Trust + testimonial */}
      <section className="py-14">
        <div className="atlas-card mx-auto max-w-3xl px-6 py-10 text-center">
          <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">
            From the team behind marginatlas.com
          </p>
        </div>
      </section>

      {/* Footer links */}
      <section className="py-10">
        <div className="atlas-card px-6 py-5 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
          <a href="/pricing"     className="font-semibold text-atlas-700 hover:underline">Pricing</a>
          {/* This pointed at the bare /about path, which is not a route. It
              fell through to the [country] wildcard and rendered "Country not
              found" at HTTP 200. The nearest page that exists is About the
              data. A product about-page is real work, tracked as W7. */}
          <a href="/about-data"  className="font-semibold text-atlas-700 hover:underline">About the data</a>
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
    <article className="atlas-card-soft p-5 h-full">
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
  /* Colour jobs: cocoa = structure and costs, and the KEPT row is the one
     accented moment. That row read `colors.moss[600]`, a green, until
     2026-08-17. The founder banned green outright on 2026-08-09 and the
     palette gate could not count this one, because it reads hex literals,
     rgb() literals and the class names moss/amber/orange, and this was a
     property read off the token object. Terracotta now carries it, which is
     also what the profit LABEL two elements down already used
     (text-atlas-700), so the bar and its label finally agree. */
  const lines = [
    { label: "Revenue", w: "100%", c: colors.cocoa[700] },
    { label: "Food",    w: "32%",  c: colors.cocoa[500] },
    { label: "Labor",   w: "30%",  c: colors.cocoa[500] },
    { label: "Rent",    w: "9%",   c: colors.cocoa[300] },
    { label: "Other",   w: "17%",  c: colors.cocoa[300] },
    { label: "Profit",  w: "12%",  c: colors.atlas[500], profit: true },
  ];
  return (
    <ul className="space-y-1.5">
      {lines.map((l) => (
        <li key={l.label} className="grid grid-cols-12 items-center gap-2 text-[11px]">
          <span
            className={`col-span-4 ${l.profit ? "text-atlas-700 font-semibold" : "text-ink-900 font-medium"}`}
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
