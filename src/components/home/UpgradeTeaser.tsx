/**
 * UpgradeTeaser: the home page's word on Pro (masterplan step 12; his interview of 2026-09-26: 14, one plan; 17, each UK chapter
 * opens free and Pro opens the rest). Until 2026-10-05 a mini table of Free, Basic $37 and Premium $77 columns; one plan has
 * nothing to compare, so it is now the plan's own list (PRO_OPENS, the pricing page's) and its price through the plan's lines (the
 * year first, then the month to month price, his decision of 2026-10-09), the heading following the paywall's switch so it says
 * today what is true today. Pure presentational server component, tokens only. The link points to /pricing; no checkout from the
 * home page. Step 35 reseats it on the rebuilt home page.
 */
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { PRICING_HREF, PRO_OPENS } from "@/components/monetization";
import { isPaywallOn } from "@/lib/feature_flags";
import { monthToMonthLine, yearlyHeadline } from "@/lib/monetization/plan";

/**
 * Two shapes, same content. "panel" drops the outer section padding and the
 * max-w-3xl so it fills its column in the two-up row it shares with
 * AudienceBand.
 */
export function UpgradeTeaser({ variant = "band" }: { variant?: "band" | "panel" }) {
  const panel = variant === "panel";
  return (
    <section className={panel ? "" : "py-12 md:py-16"}>
      <SectionEyebrow tone="backdrop" size="md" className="mb-2">Free and Pro</SectionEyebrow>
      <h2 className="font-display text-lg md:text-xl font-medium tracking-tight text-ink-900 mb-3">
        {isPaywallOn() ? "Each UK chapter opens free" : "Every benchmark is free to read"}
      </h2>
      <div className={`atlas-card px-5 py-5 ${panel ? "mt-5" : "mt-8 max-w-3xl"}`}>
        <p className="text-sm font-semibold text-ink-900">
          Pro, {yearlyHeadline()}, {monthToMonthLine()}
        </p>
        <ul className="mt-3 space-y-2 text-sm text-ink-800">
          {PRO_OPENS.map((line) => (
            <li key={line} className="flex gap-3">
              <span className="text-atlas-500 shrink-0" aria-hidden>
                ·
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
      <a
        href={PRICING_HREF}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-atlas-700 hover:text-atlas-500 transition-colors"
      >
        See what Pro opens <span aria-hidden>&rarr;</span>
      </a>
    </section>
  );
}
