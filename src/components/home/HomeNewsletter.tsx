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
import { AtlasIcon } from "@/components/brand/icons";
import type { AtlasIconId } from "@/components/brand/icons";

/**
 * WHAT IS IN THE REPORT, as four marked lines rather than three sentences.
 *
 * DENSITY PASS 2026-08-17. These were three full sentences under a square
 * bullet, 29 words, and each one ended in a clause that only restated the
 * clause before it: "so the numbers hold up", "in each cell". A reader
 * deciding whether to give an email address is scanning a contents list, not
 * reading prose, so they are a contents list now, each with its own mark from
 * the existing icon manifest.
 *
 * THE TWO FIGURES SURVIVED THE CUT. 24 industries and 12 economies were the
 * only checkable things in the old bullets and they are now a line of their
 * own instead of the tail of a longer sentence.
 */
const CONTENTS: { icon: AtlasIconId; label: string }[] = [
  { icon: "benchmark", label: "Median revenue, margin and wages" },
  { icon: "global-spread", label: "24 industries, 12 economies" },
  { icon: "cost-breakdown", label: "Cost structure for the typical operator" },
  { icon: "methodology", label: "Method and sourcing trail" },
];

export function HomeNewsletter() {
  return (
    <section>
      {/* .atlas-card, not `rounded-2xl bg-white border border-parchment`, which
          is the class written out by hand and one token short. rounded-2xl is
          already --radius, so the visible differences are the seating shadow it
          never had and a surface that goes from opaque white to the card
          token's rgba(255,255,255,.955): with no centre plate in the frame, an
          opaque white is a hole punched in the photograph. It also brings
          position: relative, which is what keeps a card above the frame's fixed
          layers rather than behind them. */}
      <div className="atlas-card px-6 py-8 md:px-10 md:py-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div>
            <SectionEyebrow size="md" className="mb-2">Free report</SectionEyebrow>
            <h2 className="font-display text-lg md:text-xl font-medium tracking-tight text-ink-900">
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
            {/* 26 words down to 14. What it said that the heading did not was
                that the PDF is not finished, which is the honest half and
                stays; the rest was "The numbers behind Atlas, collected into
                one PDF", i.e. the heading again in longer form. */}
            <p className="mt-2 text-sm text-cocoa-700 leading-relaxed">
              Still being put together. Leave an email and it comes when it is
              done.
            </p>
            <Suspense>
              <LeadMagnetForm />
            </Suspense>
          </div>
          <ul className="space-y-2.5">
            {CONTENTS.map(({ icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-sm text-ink-900">
                <AtlasIcon id={icon} size={20} className="shrink-0 text-atlas-700" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
