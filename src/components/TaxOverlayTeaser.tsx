/**
 * TaxOverlayTeaser — home page section advertising the post-tax view.
 *
 * Static — picks a curated sample (cafe in Madrid) and shows the
 * back-of-napkin owner take-home math.
 */

import Link from "next/link";

export function TaxOverlayTeaser() {
  // Hand-picked sample: Madrid cafés. ~€280k revenue × Spain 25% CIT + 30.5% social.
  // Numbers are illustrative; cell page computes the real one per cell.
  const gross = 280_000;
  const payroll = 130_000;
  const employerSocial = Math.round(payroll * 0.305);
  const preTaxProfit = gross - payroll - employerSocial;
  const cit = Math.round(preTaxProfit * 0.25);
  const ownerTake = preTaxProfit - cit;

  function fmt(v: number) {
    return v >= 1000 ? `€${(v / 1000).toFixed(0)}K` : `€${v}`;
  }

  return (
    <section className="my-12">
      <div className="rounded-2xl border border-parchment bg-white p-6 md:p-8 grid md:grid-cols-[1.2fr_1fr] gap-8 items-center">
        <div>
          <div className="text-xs uppercase tracking-wider text-atlas-700 font-semibold">
            New
          </div>
          <h2 className="mt-1 text-2xl md:text-3xl font-semibold text-cocoa-900">
            How much does the owner actually take home?
          </h2>
          <p className="mt-3 text-sm md:text-base text-ink-800/80 leading-relaxed">
            Every cell page now has an after-tax breakdown: gross revenue,
            payroll, employer social contributions, corporate income tax,
            and what's left for the owner. Country-level rates for 64
            jurisdictions, computed live.
          </p>
          <Link
            href="/es/madrid/cafes-coffee"
            className="mt-5 inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-atlas-600 hover:bg-atlas-700 text-white text-sm font-medium transition"
          >
            See the sample cell →
          </Link>
        </div>
        <div className="rounded-xl bg-cream-100 p-5 text-sm border border-cream-300">
          <div className="text-xs uppercase tracking-wider text-ink-700/60 font-medium mb-3">
            Sample · A typical café in Madrid
          </div>
          <div className="space-y-1.5">
            <Row label="Gross revenue" value={fmt(gross)} />
            <Row label="Estimated payroll" value={`− ${fmt(payroll)}`} muted />
            <Row label="Employer social (30.5%)" value={`− ${fmt(employerSocial)}`} muted />
            <div className="border-t border-cream-400 my-2" />
            <Row label="Pre-tax profit" value={fmt(preTaxProfit)} />
            <Row label="Corporate tax (25%)" value={`− ${fmt(cit)}`} muted />
            <div className="border-t border-atlas-400 my-2" />
            <div className="flex items-center justify-between font-semibold">
              <span className="text-cocoa-900">Owner take-home</span>
              <span className="text-atlas-700 text-base">{fmt(ownerTake)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${muted ? "text-ink-700/70" : "text-ink-900"}`}>
      <span className="text-sm">{label}</span>
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  );
}
