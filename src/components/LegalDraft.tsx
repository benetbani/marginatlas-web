/**
 * src/components/LegalDraft.tsx
 *
 * A legal page drawn from its draft in src/lib/legal/pro_legal.ts (milestone 2, masterplan step 30): the hand-written pages'
 * own shell and sections, each section at its anchor (the terms' #refunds is the pricing page's link), a link written
 * [words](href) drawn as a link, a lead written **words** in bold, and a paragraph held to the visit count's switch drawn only
 * when that switch is on.
 */
import * as React from "react";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import type { LegalDoc } from "@/lib/legal/pro_legal";

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

export function LegalDraft({ doc, webAnalytics = false }: { doc: LegalDoc; webAnalytics?: boolean }) {
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
