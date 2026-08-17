/**
 * OnboardingChecklist
 * ===================
 *
 * Five-step setup shown at the top of /account during a new Pro user's
 * first session. Collapses to a tiny "Setup complete" chip when all five
 * are done. Dismissible via the corner X.
 *
 * State persistence is owned by the caller — pass `initialDone` and
 * `onChange` from the auth layer if you want completions to survive
 * reload.
 *
 * PALETTE, 2026-08-17: six `emerald` classes, a STOCK Tailwind ramp no token
 * file on this site defines, which is why verify_palette_membership had no
 * word for it until 443a938e taught the gate the stock names. Terracotta now,
 * the same favourable step the four success panels and the primary-data badge
 * carry. Nothing is lost: a done step is a FILLED CheckCircle against an empty
 * Circle for an undone one, so the shape already said it and the colour was
 * repeating the icon.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle, Circle, CaretRight, X,
} from "@phosphor-icons/react/dist/ssr";

const STEPS: Array<{ id: StepId; label: string; href: string }> = [
  { id: "industries",  label: "Pick the 3 industries you care about most",   href: "/onboarding/industries" },
  { id: "countries",   label: "Pick the 3 countries you watch",              href: "/onboarding/countries" },
  { id: "alerts",      label: "Set your weekly alert email",                  href: "/onboarding/alerts" },
  { id: "dashboard",   label: "Customize your saved cells dashboard",         href: "/onboarding/dashboard" },
  { id: "methodology", label: "Read the methodology in 5 minutes",            href: "/methodology" },
];
type StepId = "industries" | "countries" | "alerts" | "dashboard" | "methodology";

export type OnboardingChecklistProps = {
  /** Step ids that are already completed. */
  initialDone?: StepId[];
  /** Called when the user toggles a step. */
  onChange?: (done: StepId[]) => void;
  /** Called when the user dismisses the checklist. */
  onDismiss?: () => void;
};

export default function OnboardingChecklist({
  initialDone = [],
  onChange,
  onDismiss,
}: OnboardingChecklistProps) {
  const [done, setDone] = useState<Set<StepId>>(new Set(initialDone));
  const [dismissed, setDismissed] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  if (dismissed) return null;
  const allDone = STEPS.every((s) => done.has(s.id));

  if (allDone && collapsed) {
    return (
      <div className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold bg-atlas-50 text-atlas-700 border border-atlas-200">
        <CheckCircle size={14} weight="fill" aria-hidden="true" className="text-atlas-500" />
        Setup complete · all {STEPS.length} steps done
        <button
          type="button"
          onClick={() => { setDismissed(true); onDismiss?.(); }}
          aria-label="Dismiss"
          className="ml-1 text-atlas-700/70"
        >
          <X size={12} aria-hidden="true" />
        </button>
      </div>
    );
  }

  function toggle(id: StepId) {
    setDone((d) => {
      const next = new Set(d);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      onChange?.([...next]);
      return next;
    });
  }

  return (
    <section
      aria-label="Onboarding checklist"
      // Canonical surface: was "rounded-2xl bg-white border border-parchment".
      className="atlas-card p-5 sm:p-6 mb-8"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">Welcome to Pro</p>
          <h3 className="font-display mt-1 text-xl font-semibold tracking-[-0.012em] text-ink-900">
            Set up your atlas.
          </h3>
          <p className="text-sm mt-1 text-cocoa-700">
            Five quick steps. You can come back to any of these from your settings.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setDismissed(true); onDismiss?.(); }}
          aria-label="Dismiss setup"
          className="w-8 h-8 flex items-center justify-center rounded-md text-cocoa-700/55"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>

      <ul className="mt-5 rounded-lg overflow-hidden border border-parchment">
        {STEPS.map((s, i) => {
          const isDone = done.has(s.id);
          return (
            <li
              key={s.id}
              className={`flex items-center gap-3 px-4 py-3 bg-white ${
                i > 0 ? "border-t border-parchment" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(s.id)}
                aria-pressed={isDone}
                aria-label={isDone ? `Mark "${s.label}" as not done` : `Mark "${s.label}" as done`}
                className="flex-shrink-0"
              >
                {isDone ? (
                  <CheckCircle size={22} weight="fill" aria-hidden="true" className="text-atlas-500" />
                ) : (
                  <Circle size={22} weight="regular" aria-hidden="true" className="text-cocoa-700/35" />
                )}
              </button>
              <Link
                href={s.href}
                className={`flex-1 min-w-0 flex items-center justify-between gap-3 ${
                  isDone ? "text-cocoa-700" : "text-ink-900"
                }`}
              >
                <span
                  className="font-medium"
                  style={{ textDecoration: isDone ? "line-through" : "none" }}
                >
                  {s.label}
                </span>
                <CaretRight size={14} aria-hidden="true" className="text-cocoa-700/50" />
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="tabular-nums text-cocoa-700">
          {done.size} of {STEPS.length} done
        </span>
        {allDone && (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="font-semibold text-atlas-700"
          >
            Collapse setup
          </button>
        )}
      </div>
    </section>
  );
}
