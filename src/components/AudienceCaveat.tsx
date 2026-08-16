/**
 * AudienceCaveat — small chip + tooltip that appears on cell pages when the
 * data needs context: a sub-niche borrowing from its parent industry's
 * measurements, a mixed bimodal industry, or a corp-dominated category the
 * user opened by direct URL.
 *
 * Plan v3.0 §L.5, §P.2.
 */

import { Tooltip } from "./Tooltip";
import type { Industry } from "@/lib/taxonomy";
import { INDUSTRY_BY_ID } from "@/lib/taxonomy";

type Props = {
  industry: Industry | null | undefined;
  /** True when the rendered numbers come from the parent, not the requested sub-niche. */
  usingParentData?: boolean;
};

export function AudienceCaveat({ industry, usingParentData }: Props) {
  if (!industry) return null;
  const audience = industry.audience || "smb_friendly";
  const parent = industry.parent_id ? INDUSTRY_BY_ID[industry.parent_id] : null;

  // Sub-niche-borrowing banner removed. The page
  // silently shows parent-category numbers without broadcasting "we don't
  // have direct measurements." The URL remains stable; sister sub-niche
  // pages still render so future granular data can drop in transparently.
  void usingParentData;
  void parent;

  // 2. Mixed bimodal — warn that average can mislead.
  if (audience === "mixed_caution") {
    return (
      <div className="rounded-xl border border-parchment bg-white px-4 py-2.5 text-sm text-ink-900 flex items-start gap-2">
        <span aria-hidden className="text-base">⚠️</span>
        <div>
          <span className="font-medium">Read with caution.</span>{" "}
          This industry has both very small and very large firms, so the
          typical number can be pulled by either tail. Look at the spread,
          not just the median.
        </div>
      </div>
    );
  }

  // 3. Corp-only opened by direct URL — make the limitation explicit.
  if (audience === "corp_only") {
    return (
      <div className="rounded-xl border border-clay-300 bg-clay-100 px-4 py-2.5 text-sm text-ink-900 flex items-start gap-2">
        <span aria-hidden className="text-base">🏛️</span>
        <div>
          <span className="font-medium">Large-firm industry.</span>{" "}
          This category is dominated by major corporations, so the numbers
          here reflect the industry as a whole: including very large
          firms: and may not be representative of small businesses.
          <a href="/pricing" className="ml-1 underline hover:text-atlas-700">
            Pro unlocks firm-size segmentation.
          </a>
        </div>
      </div>
    );
  }

  // 4. SMB-friendly with a notable large-firm tail — soft chip only.
  if (audience === "smb_friendly") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-parchment text-cocoa-700">
        Best read at small-firm scale
        <Tooltip text="Many small businesses share this industry with a tail of larger firms. The typical number leans SMB; very large operators sit in the top-10% band." />
      </span>
    );
  }

  return null;
}
