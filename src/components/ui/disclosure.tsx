/**
 * src/components/ui/disclosure.tsx
 *
 * Wraps the existing `ui/tooltip` primitive with the Atlas-specific
 * "where does this number come from" pattern. Every data point on
 * the site is the output of a transformation chain (source agency,
 * inflation roll-forward, currency conversion, plausibility floor,
 * sometimes a synthesis step). When the reader hovers a stat, a
 * Disclosure can spell out that chain in a few lines.
 *
 * Two surfaces:
 *   - Disclosure       : explicit trigger + content. Use when the
 *                        underlying element doesn't already invite
 *                        a hover (raw text, no icon)
 *   - DisclosureIcon   : "info" icon trigger that consumers drop
 *                        next to a label. Default rendering for
 *                        labels that need provenance hover
 *
 * Accessibility:
 *   - Radix Tooltip handles keyboard focus + escape automatically
 *   - DisclosureIcon has an aria-label so screen reader users get
 *     announced as "more info, [label]" rather than just "info icon"
 *   - The trigger is a real <button> so it lands in the tab order
 *
 * Design system Phase 3, 2026-05-27.
 */
import * as React from "react";
import { Info } from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface DisclosureProps {
  /** Trigger element. Can be any React node. */
  children: React.ReactNode;
  /** Tooltip content. Multi-line copy supported. */
  content: React.ReactNode;
  /** Tooltip side. Default "top". */
  side?: "top" | "right" | "bottom" | "left";
  /** Tooltip alignment. Default "center". */
  align?: "start" | "center" | "end";
  /** Delay before tooltip opens (ms). Default 200. */
  delayMs?: number;
  className?: string;
}

function Disclosure({
  children,
  content,
  side = "top",
  align = "center",
  delayMs = 200,
  className,
}: DisclosureProps) {
  return (
    <TooltipProvider delayDuration={delayMs}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={cn("max-w-xs text-xs leading-relaxed", className)}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export interface DisclosureIconProps {
  /** Tooltip content (the provenance / explanation). */
  content: React.ReactNode;
  /** Accessible label for the icon button. Defaults to "More info". */
  ariaLabel?: string;
  /** Icon size in px. Default 12. */
  size?: number;
  /** Tooltip side. Default "top". */
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

function DisclosureIcon({
  content,
  ariaLabel = "More info",
  size = 12,
  side = "top",
  className,
}: DisclosureIconProps) {
  return (
    <Disclosure content={content} side={side}>
      <button
        type="button"
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center justify-center text-cocoa-700/60 hover:text-atlas-700 transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-1",
          className,
        )}
      >
        <Info size={size} weight="regular" aria-hidden="true" />
      </button>
    </Disclosure>
  );
}

export { Disclosure, DisclosureIcon };
