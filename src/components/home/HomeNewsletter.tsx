/**
 * HomeNewsletter -- the prominent free-report lead magnet that closes the
 * homepage above the global footer bar. Offers the 2026 benchmarks PDF in
 * exchange for an email, reusing the existing LeadMagnetForm client island.
 * Server component shell, tokens only. NO id="newsletter": the global
 * FooterNewsletterBar keeps that anchor; this is a separate, richer offer.
 */
import { Suspense } from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import LeadMagnetForm from "@/components/newsletter/LeadMagnetForm";

const BULLETS = [
  "Median revenue, margin, and wages for 24 industries across 12 economies.",
  "Cost structure for the typical operator in each cell.",
  "Methodology and sourcing trail, so the numbers hold up.",
];

export function HomeNewsletter() {
  return (
    <section className="py-12 md:py-16">
      <div className="rounded-2xl bg-white border border-parchment px-6 py-10 md:px-10 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div>
            <SectionEyebrow size="md" className="mb-2">Free report</SectionEyebrow>
            <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900">
              Get the 2026 small business benchmarks
            </h2>
            {/* "A 38-page PDF of the numbers behind Atlas" was on the HOME
                PAGE, and there is no PDF. No file, no PDF library in
                package.json, nothing that could produce one. 38 is the kind of
                detail that only reads as true, which is what made it worth
                removing rather than rounding.

                The form beneath it posted to /api/lead-magnet/2026-benchmarks,
                a route that does not exist, so every signup from the home page
                errored and nothing was captured. */}
            <p className="mt-3 text-base text-cocoa-700 leading-relaxed">
              The numbers behind Atlas, collected into one PDF. It is still
              being put together. Leave an email and it comes to you when it is
              done.
            </p>
            <Suspense>
              <LeadMagnetForm />
            </Suspense>
          </div>
          <ul className="space-y-3">
            {BULLETS.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2.5 text-sm md:text-base text-ink-900"
              >
                <span
                  aria-hidden
                  className="inline-block rounded-sm shrink-0 bg-atlas-500 mt-1.5 h-2 w-2"
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
