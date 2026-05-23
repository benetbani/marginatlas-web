/**
 * UpgradeModal
 * ============
 *
 * Appears when a Free user tries to use a Pro-gated feature. Copy adapts to
 * what they just attempted. Calm dismissal: backdrop click, Escape key,
 * or "Stay on free" text link. Never traps the user.
 */

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Lock, X } from "@phosphor-icons/react/dist/ssr";

export type UpgradeFeature =
  | "save_more_cells"
  | "export_csv"
  | "export_pdf"
  | "set_alerts"
  | "use_calculator"
  | "use_api";

const COPY: Record<UpgradeFeature, { heading: string; body: string }> = {
  save_more_cells: {
    heading: "Saving more cells needs Pro",
    body: "You are at the free 5-cell limit. Pro lifts that to 50 cells, plus a weekly digest of changes in your watchlist and CSV export for each cell.",
  },
  export_csv: {
    heading: "CSV export is a Pro feature",
    body: "Free users can copy any chart as an image. Pro adds a full CSV export of the cell, plus PDF and bulk export across up to 50 saved cells.",
  },
  export_pdf: {
    heading: "PDF export is a Pro feature",
    body: "Pro renders a clean, single-page PDF of any cell. Bulk PDF across your saved cells is part of the same tier.",
  },
  set_alerts: {
    heading: "Cell-level alerts come with Pro",
    body: "Pro lets you watch any cell and get an email when revenue, margin, or wages move past a threshold you set. It also includes the weekly atlas digest.",
  },
  use_calculator: {
    heading: "The Atlas calculator is a Pro feature",
    body: "Plug your own revenue and cost numbers into the typical operator for any cell. The calculator stays available across every cell once you upgrade.",
  },
  use_api: {
    heading: "API access lives on the Team plan",
    body: "Read-only API access, 100K calls a month, and webhook routing are part of the Team tier. Pro is the right plan for individual readers.",
  },
};

export type UpgradeModalProps = {
  open: boolean;
  onClose: () => void;
  feature?: UpgradeFeature;
  /** Where the primary button leads. Default /signup?plan=pro. */
  signupHref?: string;
};

export default function UpgradeModal({
  open,
  onClose,
  feature = "save_more_cells",
  signupHref = "/signup?plan=pro",
}: UpgradeModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  const c = COPY[feature];

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 z-40"
        style={{ background: "rgba(26, 26, 26, 0.32)" }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="atlas-upgrade-modal-heading"
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92vw] max-w-md rounded-2xl p-6 sm:p-7 bg-cream-50 border border-parchment shadow-[0_1px_2px_rgba(26,26,26,0.05),_0_24px_60px_rgba(26,26,26,0.18)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-md text-cocoa-700"
        >
          <X size={16} aria-hidden="true" />
        </button>

        <div className="flex justify-center text-atlas-700">
          <Lock size={32} weight="regular" aria-hidden="true" />
        </div>

        <h2
          id="atlas-upgrade-modal-heading"
          className="font-display mt-3 text-center text-xl sm:text-2xl font-semibold tracking-[-0.012em] text-ink-900"
        >
          {c.heading}
        </h2>

        <p className="font-display italic mt-2 text-center text-[15px] text-cocoa-700 leading-relaxed">
          {c.body}
        </p>

        <div className="mt-5 flex flex-col gap-2">
          <Link
            href={signupHref}
            className="inline-flex w-full justify-center items-center rounded-md py-2.5 text-sm font-semibold bg-atlas-500 text-white hover:opacity-90 transition-opacity"
          >
            Start Pro free for 14 days
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex w-full justify-center items-center rounded-md py-2.5 text-sm font-semibold text-cocoa-700"
          >
            Stay on free
          </button>
        </div>

        <p className="mt-3 text-center text-xs">
          <Link href="/pricing" className="text-cocoa-700/70 underline-offset-4 hover:underline">
            What's in Pro?
          </Link>
        </p>
      </div>
    </>
  );
}
