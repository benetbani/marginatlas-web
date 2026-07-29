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

export interface LegalPageProps {
  title: string;
  /** One sentence under the title. What this page is for, in the reader's terms. */
  standfirst: string;
  /** ISO date, rendered plainly. Readers of these pages check this first. */
  updated: string;
  children: React.ReactNode;
}

export function LegalPage({ title, standfirst, updated, children }: LegalPageProps) {
  return (
    <article className="max-w-2xl pb-16">
      <SectionEyebrow size="md" className="mb-3">
        Legal
      </SectionEyebrow>
      <h1 className="text-4xl font-semibold tracking-tight text-ink-900">{title}</h1>
      <p className="mt-4 text-lg text-ink-800 leading-relaxed">{standfirst}</p>
      <p className="mt-3 text-sm text-ink-600">Last updated {updated}.</p>

      <div className="mt-10 space-y-8 text-ink-800 leading-relaxed">{children}</div>

      <p className="mt-12 border-t border-parchment pt-6 text-sm text-ink-600 leading-relaxed">
        This page describes what Margin Atlas actually does, checked against the
        code that runs the site. It has not been reviewed by a lawyer. If you
        need a formal assurance for a particular jurisdiction, ask us and we will
        say plainly what we can and cannot confirm.
      </p>
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
