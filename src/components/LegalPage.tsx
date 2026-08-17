/**
 * src/components/LegalPage.tsx
 *
 * The shell for the trust pages: privacy, terms, cookies, and any that follow.
 *
 * They share a shell for one reason. These pages are read by someone who has
 * become suspicious , they are checking whether this is a real thing before
 * giving it an email address or a card. Three pages in three shapes reads as
 * three afterthoughts. One shape reads as a company.
 *
 * It matches `about-data`, the site's other reference page: `max-w-2xl`, the
 * same eyebrow, the same heading scale, the same body colour and rhythm. That
 * is deliberate. A trust page that looks like a different site than the one it
 * is defending is self-defeating.
 *
 * The `reviewNotice` is not decoration and it is not humility theatre. These
 * documents were written from a survey of what the code actually does. They are
 * accurate about practice. They have not been reviewed by a lawyer, and saying
 * so is more honest, and more useful to the reader, than the usual silent
 * implication that they have.
 */
import * as React from "react";

import { SectionEyebrow } from "@/components/ui/section-eyebrow";

/**
 * The closing note. It is the default because it is true of privacy, terms and
 * cookies: each was written from a survey of the code and none has been near a
 * lawyer. "Ask us" used to point at nothing, which was the one soft spot in a
 * set of pages whose whole argument is that they do not bluff. It now points at
 * the contact page, which exists.
 */
const DEFAULT_NOTICE = (
  <>
    This page describes what Margin Atlas actually does, checked against the code
    that runs the site. It has not been reviewed by a lawyer. If you need a
    formal assurance for a particular jurisdiction,{" "}
    <a href="/contact" className="underline underline-offset-2 hover:text-atlas-600">
      ask us
    </a>{" "}
    and we will say plainly what we can and cannot confirm.
  </>
);

export interface LegalPageProps {
  title: string;
  /** One sentence under the title. What this page is for, in the reader's terms. */
  standfirst: string;
  /** ISO date, rendered plainly. Readers of these pages check this first. */
  updated: string;
  /**
   * The small label above the title. Defaults to "Legal", which is right for a
   * document and wrong for a page that is a form.
   */
  eyebrow?: string;
  /**
   * The closing note under the rule. Defaults to the lawyer-review notice.
   * Pass `null` on a page where that notice would not be true.
   */
  notice?: React.ReactNode;
  children: React.ReactNode;
}

export function LegalPage({
  title,
  standfirst,
  updated,
  eyebrow = "Legal",
  notice,
  children,
}: LegalPageProps) {
  /* A SURFACE, added 2026-08-17. This carried none at all: no background, no
     border, nothing. That was invisible while the app ground was a flat colour,
     and became a defect the moment AtlasFrame put a fixed photograph behind
     every route with no centre plate. FIVE routes render through this
     component, /privacy /terms /cookies /contact /faq, so all five were
     long-form prose set directly on a picture.

     .atlas-card is the site's measured surface: --atlas-surface-card at .955,
     whose contrast was computed against the photograph's darkest region rather
     than against white. It is also position:relative, which a static background
     needs here or it sinks behind the fixed layers.

     max-w-2xl stays: that is the reading measure and not the card's business.
     pb-16 became mb-16 so the space sits below the card rather than inside it
     as a long empty tail. */
  return (
    <article className="atlas-card max-w-2xl px-6 py-8 md:px-9 md:py-10 mb-16">
      <SectionEyebrow size="md" className="mb-3">
        {eyebrow}
      </SectionEyebrow>
      <h1 className="text-4xl font-semibold tracking-tight text-ink-900">{title}</h1>
      <p className="mt-4 text-lg text-ink-800 leading-relaxed">{standfirst}</p>
      <p className="mt-3 text-sm text-ink-600">Last updated {updated}.</p>

      <div className="mt-10 space-y-8 text-ink-800 leading-relaxed">{children}</div>

      {notice === null ? null : (
        <p className="mt-12 border-t border-parchment pt-6 text-sm text-ink-600 leading-relaxed">
          {notice ?? DEFAULT_NOTICE}
        </p>
      )}
    </article>
  );
}

/** A titled block. Keeps heading scale and spacing identical across the set. */
export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight text-ink-900">{heading}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
