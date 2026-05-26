/**
 * /check — Compare Your Business tool. ATO Phase 7.
 *
 * Server-rendered shell with a header, a one-paragraph description,
 * and a client-side form. The form computes a verdict from the
 * verdict engine and renders the per-ratio comparison inline.
 *
 * Per docs/strategy/2026-05-26-ato-framework-execution-plan.md §3.7.
 */

import { CheckForm } from "./CheckForm";

export const revalidate = 86400;

export const metadata = {
  title: "Compare your business | Margin Atlas",
  description:
    "Type your numbers, see where you sit. Per-ratio benchmark verdict against typical operators in your industry and revenue band.",
};

export default function CheckPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-atlas-700 mb-3">
        Compare your business
      </div>
      <h1 className="font-display text-3xl md:text-5xl tracking-tight text-ink-900 leading-[1.1] mb-4">
        Where do you sit?
      </h1>
      <p className="text-base md:text-lg text-cocoa-700 leading-relaxed mb-8 max-w-2xl">
        Type in your real numbers. We compare them against the typical
        range for your industry and revenue band, and call out the one
        ratio worth your attention.
      </p>

      <CheckForm />

      <p className="mt-10 text-xs text-cocoa-700/60 leading-relaxed max-w-2xl">
        Results are computed in your browser. Nothing is stored or sent
        unless you choose to download the PDF report.
      </p>
    </div>
  );
}
