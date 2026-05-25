/**
 * DecideActivitySelector — client island for swapping the activity on
 * the /decide/[activity]/[city] wizard without a page reload.
 *
 * Uses next/navigation to navigate when the user picks a different
 * activity from the dropdown. Native HTML <select> styled to match the
 * Atlas form chrome so it works without any client-side state.
 *
 * 2026-05-26: shipped alongside net-margin overlay in the decide wizard.
 */

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Option = { value: string; label: string };

export default function DecideActivitySelector({
  citySlug,
  currentActivity,
  options,
}: {
  citySlug: string;
  currentActivity: string;
  options: Option[];
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="text-cocoa-700/80 font-medium whitespace-nowrap">
        Try a different activity:
      </span>
      <select
        defaultValue={currentActivity}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          if (!next || next === currentActivity) return;
          setPending(true);
          router.push(`/decide/${next}/${citySlug}`);
        }}
        className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 font-medium focus:outline-none focus:border-atlas-700 focus:ring-2 focus:ring-atlas-700/20 disabled:opacity-60 disabled:cursor-wait min-w-[220px]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {pending && (
        <span className="text-xs text-atlas-700 font-medium">Loading...</span>
      )}
    </label>
  );
}
