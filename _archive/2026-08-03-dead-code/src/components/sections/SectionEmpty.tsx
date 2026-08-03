/**
 * SectionEmpty - the canonical "this beat has no data yet" state.
 *
 * Sub-project 1.2 (no dead sections, 2026-05-30). A page section must never
 * render an empty toned band: a heading or a <section> wrapper with nothing
 * inside. When a section's data is genuinely missing, render this instead so
 * the gap becomes navigation, not a void.
 *
 * Three honest states across the site (this covers the third):
 *   1. real data            -> the section renders normally
 *   2. confident estimate   -> the section renders WITH an "estimated" badge
 *                              (see EstimatedBadge; driven by is_synthetic /
 *                               low quality_score)
 *   3. genuinely empty      -> THIS: a compact "not yet, see nearby" card that
 *                              links onward to cells/places that DO have it
 *
 * Thin wrapper over the design-system <EmptyState> primitive (compact size,
 * suggestion chips). Adds nothing visual of its own; its job is to make the
 * honest-empty decision a one-liner at every call site and to keep the copy
 * + onward-link shape consistent.
 *
 * Usage:
 *   if (!hasData) {
 *     return <SectionEmpty title="Distribution not available yet"
 *              body="We don't have a full spread for this cell yet."
 *              suggestions={nearbySuggestions} />;
 *   }
 */
import * as React from "react";
import { EmptyState, type EmptyStateSuggestion } from "@/components/ui/empty-state";

export interface SectionEmptyProps {
  /** Heading for the empty beat. Real heading via EmptyState. */
  title: React.ReactNode;
  /** One honest sentence on why it is not here yet. */
  body?: React.ReactNode;
  /** Onward links so the gap becomes navigation, never a dead end. */
  suggestions?: EmptyStateSuggestion[];
  /** Heading level to keep the page outline correct. Default 3. */
  headingLevel?: 2 | 3 | 4;
  /** Optional wrapper className (e.g. section padding). */
  className?: string;
}

export function SectionEmpty({
  title,
  body,
  suggestions,
  headingLevel = 3,
  className,
}: SectionEmptyProps) {
  return (
    <EmptyState
      size="compact"
      noLeftRule
      title={title}
      body={body}
      suggestions={suggestions}
      headingLevel={headingLevel}
      className={className}
    />
  );
}
