/**
 * src/components/LegalDraft.tsx
 *
 * A legal page drawn from its draft in src/lib/legal/pro_legal.ts (milestone 2, masterplan step 30): the hand-written pages'
 * own shell and sections, each section at its anchor (the terms' #refunds is the pricing page's link), a link written
 * [words](href) drawn as a link, a lead written **words** in bold, and a paragraph held to the visit count's switch drawn only
 * when that switch is on.
 *
 * A DRAFT WITH A GAP IS NEVER DRAWN (plan 2026-10-10, the home reformed to ship, Task 8; the spec's decision 11, the ship audit's
 * 5.1). The drafts hold [HIS: ...] gaps only he can fill (who runs the site, the address for legal letters, the VAT number), and
 * the page would have printed them verbatim the moment the paywall's switch went on: nothing stopped the flip. While any gap
 * remains this draws `now`, the page's text of today, which every caller must hand it (the prop is required, so no page can
 * forget); scripts/verify_launch_ready.ts fails the launch checklist while the paywall is on and a gap remains.
 */
import * as React from "react";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { draftReady, type LegalDoc } from "@/lib/legal/pro_legal";

const MARK = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;

function marked(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(MARK)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    out.push(
      m[3] != null ? (
        <b key={at}>{m[3]}</b>
      ) : (
        <a key={at} href={m[2]} className="underline underline-offset-2 hover:text-atlas-600">
          {m[1]}
        </a>
      ),
    );
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function LegalDraft({ doc, now, webAnalytics = false }: { doc: LegalDoc; now: React.ReactNode; webAnalytics?: boolean }) {
  if (!draftReady(doc)) return <>{now}</>;
  return (
    <LegalPage title={doc.title} standfirst={doc.standfirst} updated={doc.updated}>
      {doc.blocks.map((b) => (
        <LegalSection key={b.id} id={b.id} heading={b.heading}>
          {b.paragraphs
            .filter((x) => !x.when || (x.when === "web-analytics" && webAnalytics))
            .map((x, i) => (
              <p key={i}>{marked(x.text)}</p>
            ))}
        </LegalSection>
      ))}
    </LegalPage>
  );
}
