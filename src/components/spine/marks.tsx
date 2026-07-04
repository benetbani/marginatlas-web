/**
 * AtlasMark , the functional-mark set for the spine surfaces. Small, flat, single
 * ~1.8px stroke marks that carry ONE meaning at a glance: verdict (above / below /
 * at the city), confidence (measured / modeled / sample), the Free/Pro seam (lock /
 * unlock / tiers), disclosure + trust, wayfinding, state. Designed to the brief, then
 * re-housed here with every brand hex mapped to the spine CSS vars so a mark themes
 * with its scope and carries NO raw hex (mask channels use the white/black keywords,
 * which the no-hardcoded-hex gate ignores). Not a nav icon: these read as status.
 *
 * Pure presentational SVG (no hooks, no "use client"), so it renders in both server and
 * client trees. Mask ids are unique per mark and identical per instance, so repeated
 * marks never collide. Terracotta is used once per mark, only on the meaningful part.
 */
import * as React from "react";

export type AtlasMarkId =
  | "keeps-more" | "keeps-less" | "at-baseline" | "best" | "best-laurel"
  | "measured" | "modeled" | "modeled-hatch" | "sample" | "directional"
  | "pro-lock" | "unlock" | "free-tag" | "pro-badge" | "team-badge" | "upgrade"
  | "proof" | "reconciled" | "reconciled-bracket"
  | "alt-country" | "alt-city" | "alt-district" | "alt-business"
  | "trend-rising" | "trend-falling" | "trend-flat"
  | "bookmark" | "bookmark-saved" | "not-held";

const LABEL: Record<AtlasMarkId, string> = {
  "keeps-more": "Keeps more than the city baseline",
  "keeps-less": "Keeps less than the city baseline",
  "at-baseline": "At the city baseline",
  best: "Best in class",
  "best-laurel": "Best in class",
  measured: "Measured, real and sourced",
  modeled: "Modeled, directional",
  "modeled-hatch": "Modeled, directional",
  sample: "Sample, illustrative",
  directional: "Directional, not exact",
  "pro-lock": "Pro, locked",
  unlock: "Pro, unlocked",
  "free-tag": "Free plan",
  "pro-badge": "Pro plan",
  "team-badge": "Team plan",
  upgrade: "Upgrade plan",
  proof: "Proof behind this",
  reconciled: "Reconciled, cross-checked",
  "reconciled-bracket": "Reconciled, cross-checked",
  "alt-country": "Country level",
  "alt-city": "City level",
  "alt-district": "District level",
  "alt-business": "Business level",
  "trend-rising": "Rising",
  "trend-falling": "Falling",
  "trend-flat": "Flat",
  bookmark: "Shortlisted",
  "bookmark-saved": "Saved",
  "not-held": "Not held here yet",
};

const INNER: Record<AtlasMarkId, React.ReactNode> = {
  "keeps-more": (
    <>
      <line x1="14" y1="32.5" x2="34" y2="32.5" stroke="var(--c-muted)" />
      <polyline points="15 29 24 17 33 29" stroke="var(--terra-text)" />
    </>
  ),
  "keeps-less": (
    <>
      <line x1="14" y1="15.5" x2="34" y2="15.5" stroke="var(--c-muted)" />
      <polyline points="15 19 24 31 33 19" stroke="var(--c-ink)" />
    </>
  ),
  "at-baseline": (
    <>
      <line x1="12" y1="24" x2="36" y2="24" stroke="var(--c-muted)" />
      <circle cx="24" cy="24" r="2.6" fill="var(--c-muted)" />
    </>
  ),
  best: (
    <>
      <circle cx="24" cy="19" r="7" stroke="var(--terra-text)" />
      <circle cx="24" cy="19" r="2" fill="var(--terra-text)" />
      <path d="M20.4 25.2 L18 35 L22.2 32.2" stroke="var(--terra-text)" />
      <path d="M27.6 25.2 L30 35 L25.8 32.2" stroke="var(--terra-text)" />
    </>
  ),
  "best-laurel": (
    <>
      <path d="M24 35 C 16.5 33.5 13 27.5 14.2 21 C 14.8 17.5 16.6 15 19 13.5" stroke="var(--terra-text)" />
      <path d="M24 35 C 31.5 33.5 35 27.5 33.8 21 C 33.2 17.5 31.4 15 29 13.5" stroke="var(--terra-text)" />
      <path d="M14.7 25 C 12.7 24.4 11.9 22.6 12.5 20.6" stroke="var(--terra-text)" />
      <path d="M15.5 19.6 C 13.7 18.6 13.3 16.8 14.3 15.2" stroke="var(--terra-text)" />
      <path d="M33.3 25 C 35.3 24.4 36.1 22.6 35.5 20.6" stroke="var(--terra-text)" />
      <path d="M32.5 19.6 C 34.3 18.6 34.7 16.8 33.7 15.2" stroke="var(--terra-text)" />
      <circle cx="24" cy="24.5" r="2.2" fill="var(--terra-text)" />
    </>
  ),
  measured: (
    <>
      <mask id="am-chk05">
        <rect width="48" height="48" fill="white" />
        <path d="M18 24.5 L22.4 29 L31 19.6" fill="none" stroke="black" strokeWidth="3" />
      </mask>
      <circle cx="24" cy="24" r="13" fill="var(--c-ink)" mask="url(#am-chk05)" />
    </>
  ),
  modeled: (
    <>
      <circle cx="24" cy="24" r="13" stroke="var(--c-muted)" />
      <path d="M24 11 A13 13 0 0 0 24 37 Z" fill="var(--c-ink)" />
    </>
  ),
  "modeled-hatch": (
    <>
      <defs>
        <clipPath id="am-hh06">
          <path d="M24 11 A13 13 0 0 1 24 37 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#am-hh06)" stroke="var(--c-muted)" strokeWidth="1.3">
        <line x1="17" y1="37" x2="37" y2="17" />
        <line x1="21" y1="37" x2="37" y2="21" />
        <line x1="25" y1="37" x2="37" y2="25" />
        <line x1="29" y1="37" x2="37" y2="29" />
        <line x1="24" y1="34" x2="34" y2="24" />
        <line x1="24" y1="30" x2="30" y2="24" />
      </g>
      <circle cx="24" cy="24" r="13" stroke="var(--c-ink)" />
    </>
  ),
  sample: <circle cx="24" cy="24" r="13" stroke="var(--c-muted)" strokeDasharray="2.6 3.4" />,
  directional: (
    <>
      <path d="M19 21.6 q 2.5 -3 5 0 q 2.5 3 5 0" stroke="var(--c-muted)" />
      <path d="M19 26.6 q 2.5 -3 5 0 q 2.5 3 5 0" stroke="var(--c-muted)" />
      <path d="M15.5 15 q -3.4 9 0 18" stroke="var(--c-muted)" />
      <path d="M32.5 15 q 3.4 9 0 18" stroke="var(--c-muted)" />
    </>
  ),
  "pro-lock": (
    <>
      <path d="M18.5 23 V19 a5.5 5.5 0 0 1 11 0 V23" stroke="var(--terra-text)" />
      <mask id="am-kh09">
        <rect width="48" height="48" fill="white" />
        <circle cx="24" cy="29.5" r="1.7" fill="black" />
        <rect x="23.2" y="29.5" width="1.6" height="4.4" rx="0.8" fill="black" />
      </mask>
      <rect x="15.5" y="23" width="17" height="15" rx="3" fill="var(--c-ink)" mask="url(#am-kh09)" />
    </>
  ),
  unlock: (
    <>
      <path d="M18.5 23 V18.5 a5.5 5.5 0 0 1 9.7 -3.4" stroke="var(--c-ink)" />
      <mask id="am-kh10">
        <rect width="48" height="48" fill="white" />
        <circle cx="24" cy="29.5" r="1.7" fill="black" />
        <rect x="23.2" y="29.5" width="1.6" height="4.4" rx="0.8" fill="black" />
      </mask>
      <rect x="15.5" y="23" width="17" height="15" rx="3" fill="var(--terra-text)" mask="url(#am-kh10)" />
    </>
  ),
  "free-tag": (
    <>
      <path d="M21 14 H37 a3 3 0 0 1 3 3 V31 a3 3 0 0 1 -3 3 H21 L11.5 24 Z" stroke="var(--c-muted)" />
      <circle cx="18.5" cy="24" r="1.8" stroke="var(--c-muted)" />
    </>
  ),
  "pro-badge": (
    <>
      <path d="M24 13 L33.5 16.5 V24.4 C33.5 30 29.2 33.2 24 35 C18.8 33.2 14.5 30 14.5 24.4 V16.5 Z" fill="var(--terra)" />
      <path d="M24 19.4 L25.5 23 L29.1 24.5 L25.5 26 L24 29.6 L22.5 26 L18.9 24.5 L22.5 23 Z" fill="var(--c-ink)" />
    </>
  ),
  "team-badge": (
    <>
      <mask id="am-tm13">
        <rect width="48" height="48" fill="white" />
        <path d="M28 16.8 L35.6 19.6 V25.2 C35.6 29.5 32.4 31.8 28 33.4 C23.6 31.8 20.4 29.5 20.4 25.2 V19.6 Z" fill="black" />
      </mask>
      <path d="M20 12.4 L27.6 15.2 V20.8 C27.6 25.1 24.4 27.4 20 29 C15.6 27.4 12.4 25.1 12.4 20.8 V15.2 Z" stroke="var(--c-ink)" mask="url(#am-tm13)" />
      <path d="M28 16.8 L35.6 19.6 V25.2 C35.6 29.5 32.4 31.8 28 33.4 C23.6 31.8 20.4 29.5 20.4 25.2 V19.6 Z" stroke="var(--c-ink)" />
      <path d="M28 16.8 L20.4 19.6 V25.2 C20.4 29.5 23.6 31.8 28 33.4" stroke="var(--terra-text)" />
    </>
  ),
  upgrade: (
    <>
      <polyline points="13 33 20 33 20 27 27 27 27 21" stroke="var(--c-ink)" />
      <polyline points="27 21 34 21 34 13" stroke="var(--terra-text)" />
      <polyline points="30.5 16 34 12.5 37.5 16" stroke="var(--terra-text)" />
    </>
  ),
  proof: (
    <>
      <rect x="19" y="13" width="16.5" height="20" rx="2.5" stroke="var(--c-muted)" />
      <path d="M13.5 19.5 a2.5 2.5 0 0 1 2.5 -2.5 H26.5 L31 21.5 V36.5 a2.5 2.5 0 0 1 -2.5 2.5 H16 a2.5 2.5 0 0 1 -2.5 -2.5 Z" fill="var(--c-card)" stroke="var(--c-muted)" />
      <path d="M26.5 17 V19.5 a2.5 2.5 0 0 0 2.5 2.5 H31" stroke="var(--terra-text)" />
    </>
  ),
  reconciled: (
    <>
      <circle cx="19.5" cy="24" r="7.5" stroke="var(--c-ink)" />
      <circle cx="28.5" cy="24" r="7.5" stroke="var(--c-ink)" />
    </>
  ),
  "reconciled-bracket": (
    <>
      <circle cx="15" cy="16.5" r="2" fill="var(--c-ink)" />
      <circle cx="15" cy="31.5" r="2" fill="var(--c-ink)" />
      <path d="M17.5 16.5 H24 a3 3 0 0 1 3 3 V21 a2.5 2.5 0 0 0 2.5 2.5 a2.5 2.5 0 0 0 -2.5 2.5 V27.5 a3 3 0 0 1 -3 3 H17.5" stroke="var(--c-ink)" />
      <line x1="29.5" y1="24" x2="31.5" y2="24" stroke="var(--c-ink)" />
      <circle cx="33.5" cy="24" r="2" fill="var(--c-ink)" />
    </>
  ),
  "alt-country": (
    <>
      <rect x="11" y="11" width="26" height="26" rx="4" stroke="var(--c-ink)" />
      <path d="M13 22.5 C 17 19.5 20.5 24.5 25 22 C 29 19.8 32 21.2 35 20.2" stroke="var(--c-ink)" />
      <circle cx="21.5" cy="28.5" r="1.6" fill="var(--c-ink)" />
    </>
  ),
  "alt-city": (
    <>
      <rect x="11" y="11" width="26" height="26" rx="4" stroke="var(--c-ink)" />
      <rect x="15.5" y="23" width="5" height="6" rx="0.8" stroke="var(--c-ink)" />
      <rect x="21.5" y="19" width="5" height="10" rx="0.8" stroke="var(--c-ink)" />
      <rect x="27.5" y="24.5" width="4.5" height="4.5" rx="0.8" stroke="var(--c-ink)" />
    </>
  ),
  "alt-district": (
    <>
      <rect x="11" y="11" width="26" height="26" rx="4" stroke="var(--c-ink)" />
      <line x1="24" y1="13.5" x2="24" y2="34.5" stroke="var(--c-ink)" />
      <line x1="13.5" y1="24" x2="34.5" y2="24" stroke="var(--c-ink)" />
      <rect x="15.5" y="26.5" width="5.5" height="5.5" rx="1" fill="var(--c-ink)" />
    </>
  ),
  "alt-business": (
    <>
      <rect x="11" y="11" width="26" height="26" rx="4" stroke="var(--c-ink)" />
      <path d="M24 33 C 20 27.5 19 24.5 19 22.5 A5 5 0 1 1 29 22.5 C 29 24.5 28 27.5 24 33 Z" stroke="var(--c-ink)" />
      <circle cx="24" cy="22.5" r="1.9" fill="var(--c-ink)" />
    </>
  ),
  "trend-rising": (
    <>
      <circle cx="14" cy="33" r="2.2" fill="var(--terra-text)" />
      <path d="M15.6 31.4 L32.5 16" stroke="var(--terra-text)" />
      <polyline points="26.5 15 33.5 15 33.5 22" stroke="var(--terra-text)" />
    </>
  ),
  "trend-falling": (
    <>
      <circle cx="14" cy="15" r="2.2" fill="var(--c-muted)" />
      <path d="M15.6 16.6 L32.5 32" stroke="var(--c-muted)" />
      <polyline points="26.5 33 33.5 33 33.5 26" stroke="var(--c-muted)" />
    </>
  ),
  "trend-flat": (
    <>
      <circle cx="14" cy="24" r="2.2" fill="var(--c-muted)" />
      <path d="M16 24 H32.5" stroke="var(--c-muted)" />
      <polyline points="29 20.5 33.5 24 29 27.5" stroke="var(--c-muted)" />
    </>
  ),
  bookmark: <path d="M15 13.5 h18 a1.5 1.5 0 0 1 1.5 1.5 V35.5 L24 29.5 L13.5 35.5 V15 a1.5 1.5 0 0 1 1.5 -1.5 Z" stroke="var(--c-muted)" />,
  "bookmark-saved": (
    <>
      <mask id="am-bm19">
        <rect width="48" height="48" fill="white" />
        <path d="M20 22.5 L23 25.5 L28.5 19.5" fill="none" stroke="black" strokeWidth="2.6" />
      </mask>
      <path d="M15 13.5 h18 a1.5 1.5 0 0 1 1.5 1.5 V35.5 L24 29.5 L13.5 35.5 V15 a1.5 1.5 0 0 1 1.5 -1.5 Z" fill="var(--terra-text)" mask="url(#am-bm19)" />
    </>
  ),
  "not-held": (
    <>
      <rect x="11" y="11" width="26" height="26" rx="4" stroke="var(--c-muted)" strokeDasharray="2.8 3.6" />
      <path d="M24 15 L25.4 22.6 L33 24 L25.4 25.4 L24 33 L22.6 25.4 L15 24 L22.6 22.6 Z" fill="var(--c-border)" />
      <circle cx="24" cy="24" r="1.7" fill="var(--c-muted)" />
      <circle cx="24" cy="15" r="2.2" fill="var(--terra-text)" />
    </>
  ),
};

export function AtlasMark({
  id,
  size = 20,
  className,
  title,
}: {
  id: AtlasMarkId;
  size?: number;
  className?: string;
  title?: string;
}) {
  const label = title ?? LABEL[id];
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      role="img"
      aria-label={label}
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
    >
      <title>{label}</title>
      {INNER[id]}
    </svg>
  );
}
