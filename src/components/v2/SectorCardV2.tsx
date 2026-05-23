// Sector tile that the eye can scan in a row: vermillion icon and count anchor the top,
// a Newsreader name sits as the visual headline with a single-line description beneath,
// and a fit-to-width chip row drops example industries into a "+N more" overflow on narrow cards.

import * as React from "react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

interface SectorCardV2Props {
  sectorId: string;
  sectorLabel: string;
  industryCount: number;
  description: string;
  sampleIndustries: string[];
  href: string;
  icon: PhosphorIcon;
}

function FittedChipRow({
  chips,
  extraMore,
}: {
  chips: string[];
  extraMore: number;
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const moreRef = React.useRef<HTMLSpanElement | null>(null);

  React.useLayoutEffect(() => {
    const cont = containerRef.current;
    if (!cont) return;

    const fit = () => {
      const more = moreRef.current;
      const containerW = cont.clientWidth;
      const gap = 6; // gap-1.5 = 6px
      const chipEls = Array.from(
        cont.querySelectorAll<HTMLElement>("[data-chip='1']")
      );

      // Reset for measurement
      chipEls.forEach((c) => (c.style.display = ""));
      if (more) {
        more.style.display = "";
        // Use max plausible count so width is generous
        more.textContent = `+${chipEls.length + extraMore} more`;
      }

      const widths = chipEls.map((c) => c.offsetWidth);
      const moreW = more ? more.offsetWidth : 0;

      // Find largest k such that first k chips + (more chip if any overflow) fit
      let bestK = 0;
      for (let k = chipEls.length; k >= 0; k--) {
        let total = 0;
        for (let i = 0; i < k; i++) total += widths[i];
        if (k > 0) total += (k - 1) * gap;
        const hiddenCount = chipEls.length - k + extraMore;
        if (hiddenCount > 0) total += moreW + (k > 0 ? gap : 0);
        if (total <= containerW) {
          bestK = k;
          break;
        }
      }

      chipEls.forEach((c, i) => {
        c.style.display = i < bestK ? "" : "none";
      });
      const hidden = chipEls.length - bestK + extraMore;
      if (more) {
        if (hidden > 0) {
          more.style.display = "";
          more.textContent = `+${hidden} more`;
        } else {
          more.style.display = "none";
        }
      }
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(cont);
    return () => ro.disconnect();
  }, [chips, extraMore]);

  const chipClass =
    "shrink-0 inline-flex items-center font-sans text-xs leading-none text-[#3A3A3A] bg-[#F5F5F5] rounded-full px-2.5 py-1 whitespace-nowrap";

  return (
    <div
      ref={containerRef}
      className="flex flex-nowrap items-center gap-1.5 overflow-hidden"
    >
      {chips.map((chip) => (
        <span key={chip} data-chip="1" className={chipClass}>
          {chip}
        </span>
      ))}
      <span ref={moreRef} className={chipClass} aria-hidden="true">
        +{extraMore} more
      </span>
    </div>
  );
}

export default function SectorCardV2({
  sectorLabel,
  industryCount,
  description,
  sampleIndustries,
  href,
  icon: Icon,
}: SectorCardV2Props) {
  const visibleChips = sampleIndustries.slice(0, 3);
  const baseExtra =
    Math.max(0, sampleIndustries.length - visibleChips.length) +
    Math.max(0, industryCount - sampleIndustries.length);

  return (
    <a
      href={href}
      className="
        group flex flex-col
        h-[120px] md:h-[140px]
        bg-white
        border border-[#E5E5E5] hover:border-[#3A3A3A]
        px-3.5 py-3
        transition-colors duration-150
        no-underline
      "
    >
      {/* Top row: icon left, count chip right */}
      <div className="flex items-center justify-between">
        <Icon size={16} weight="fill" color="#D73A14" />
        <span
          className="
            inline-flex items-center
            font-sans text-[11px] tabular-nums
            text-[#3A3A3A] group-hover:text-black
            bg-[#F5F5F5] group-hover:bg-[#E5E5E5]
            rounded-full px-2 py-0.5
            transition-colors duration-150
          "
        >
          {industryCount}
        </span>
      </div>

      {/* Category name */}
      <h3
        className="mt-1.5 font-display text-lg font-medium leading-tight text-black truncate"
        style={{ fontFamily: "Newsreader, serif" }}
      >
        {sectorLabel}
      </h3>

      {/* Description */}
      <p className="mt-0.5 font-sans text-sm text-[#3A3A3A] truncate">
        {description}
      </p>

      {/* Hairline + sample-industry chips that fit dynamically */}
      <div className="mt-auto pt-2 border-t border-[#E5E5E5]">
        <FittedChipRow chips={visibleChips} extraMore={baseExtra} />
      </div>
    </a>
  );
}
