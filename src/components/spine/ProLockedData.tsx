/**
 * THE LOCKED PARTS, SAID TO SEARCH ENGINES (milestone 2, masterplan step 19; his interview of 2026-09-26, "contradictions
 * reconciled": the closed half carries isAccessibleForFree false, so it is not read as cloaking). Rendered only on a page drawn
 * locked, by the route renderer beside the body; its selector is the class every locked section stamps
 * (src/components/spine/LockedSection.tsx). The site's own JSON-LD idiom (src/components/StructuredData.tsx).
 */
import * as React from "react";

export function ProLockedData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    isAccessibleForFree: false,
    hasPart: [{ "@type": "WebPageElement", isAccessibleForFree: false, cssSelector: ".pro-locked" }],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
