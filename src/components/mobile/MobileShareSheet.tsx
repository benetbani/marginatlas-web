/**
 * MobileShareSheet
 * ================
 *
 * Native-feeling share sheet that slides up from the bottom.
 *   - Row 1: system share sheet via navigator.share (only rendered when
 *     supported, so non-Web-Share browsers see the quick actions only).
 *   - Row 2: Copy link, WhatsApp, X/Twitter, Email (deep links).
 *   - Row 3: Get embed code, which swaps the body to a copy-pasteable
 *     iframe snippet pre-formatted for this cell.
 *
 * Dismiss: drag-handle pull, tap backdrop, or tap close.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import {
  X, ShareNetwork, Link as LinkIcon, WhatsappLogo, TwitterLogo,
  EnvelopeSimple, Code, CaretRight, CheckCircle,

} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhIcon } from "@phosphor-icons/react";

export type MobileShareSheetProps = {
  open: boolean;
  onClose: () => void;
  /** Canonical URL of the cell. The embed src is `${url}/embed`. */
  url: string;
  /** Plain-text page title used for OS share + tweet text. */
  title: string;
  /** Optional override of the embed snippet builder. */
  buildEmbed?: (url: string) => string;
};

export default function MobileShareSheet({
  open,
  onClose,
  url,
  title,
  buildEmbed,
}: MobileShareSheetProps) {
  const [embedOpen, setEmbedOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const startY = useRef<number | null>(null);
  const [dy, setDy] = useState(0);

  useEffect(() => {
    if (!open) { setEmbedOpen(false); setCopied(false); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const onTouchStart = (e: React.TouchEvent) => { startY.current = e.touches[0].clientY; };
  const onTouchMove  = (e: React.TouchEvent) => {
    if (startY.current == null) return;
    const d = e.touches[0].clientY - startY.current;
    if (d > 0) setDy(d);
  };
  const onTouchEnd = () => {
    if (dy > 100) onClose();
    startY.current = null;
    setDy(0);
  };

  async function tryNativeShare() {
    if (typeof navigator === "undefined" || !navigator.share) return;
    try { await navigator.share({ title, url }); onClose(); } catch { /* cancelled */ }
  }
  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1400); }
    catch { /* clipboard blocked */ }
  }

  const embedSnippet = (buildEmbed ?? defaultEmbed)(url);
  const hasNative = typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className="fixed inset-0 z-40 transition-opacity duration-200"
        style={{
          background: "rgba(26, 26, 26, 0.32)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={embedOpen ? "Embed this benchmark" : "Share this benchmark"}
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-parchment bg-cream-50 shadow-[0_-8px_32px_rgba(26,26,26,0.12)]"
        style={{
          height: "55vh",
          transform: open ? `translateY(${dy}px)` : "translateY(100%)",
          transition: "transform 220ms ease-out",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div
          className="pt-2 pb-1 flex justify-center"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <span className="h-1 w-9 rounded-full bg-cocoa-700/25" aria-hidden="true" />
        </div>

        <div className="px-5 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink-900">
              {embedOpen ? "Embed this benchmark" : "Share this benchmark"}
            </h2>
            <button type="button" onClick={onClose} aria-label="Close" className="h-9 w-9 flex items-center justify-center text-cocoa-700">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        {!embedOpen && (
          <div className="px-5 pt-4 flex flex-col gap-5 overflow-y-auto" style={{ height: "calc(100% - 60px)" }}>
            {hasNative && (
              <button
                type="button"
                onClick={tryNativeShare}
                className="w-full flex items-center justify-between h-12 rounded-md px-4 text-sm font-semibold bg-ink-900 text-white"
              >
                <span className="flex items-center gap-2">
                  <ShareNetwork size={16} aria-hidden="true" />
                  Use system share sheet
                </span>
                <CaretRight size={14} aria-hidden="true" />
              </button>
            )}

            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase font-semibold text-cocoa-700/70 mb-2">
                Quick actions
              </p>
              <div className="grid grid-cols-4 gap-2">
                <QuickAction
                  icon={copied ? CheckCircle : LinkIcon}
                  label={copied ? "Copied" : "Copy link"}
                  onClick={() => copy(url)}
                  active={copied}
                />
                <QuickAction
                  icon={WhatsappLogo}
                  label="WhatsApp"
                  href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
                />
                <QuickAction
                  icon={TwitterLogo}
                  label="X / Twitter"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
                />
                <QuickAction
                  icon={EnvelopeSimple}
                  label="Email"
                  href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEmbedOpen(true)}
              className="w-full flex items-center justify-between h-12 rounded-md px-4 text-sm font-semibold border border-cocoa-700/20 text-cocoa-700"
            >
              <span className="flex items-center gap-2">
                <Code size={16} aria-hidden="true" />
                Get embed code
              </span>
              <CaretRight size={14} aria-hidden="true" />
            </button>
          </div>
        )}

        {embedOpen && (
          <div className="px-5 pt-4 flex flex-col gap-3">
            <p className="text-sm text-cocoa-700">
              Paste this on your site. The embed inherits Atlas's coverage chip and updates with each refresh.
            </p>
            <textarea
              readOnly
              value={embedSnippet}
              rows={6}
              aria-label="Embed code"
              className="w-full rounded-md p-3 font-mono text-xs bg-cream-100 border border-parchment text-ink-900"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => copy(embedSnippet)}
                className="flex-1 h-11 rounded-md text-sm font-semibold bg-ink-900 text-white"
              >
                {copied ? "Copied" : "Copy embed"}
              </button>
              <button
                type="button"
                onClick={() => setEmbedOpen(false)}
                className="flex-1 h-11 rounded-md text-sm font-semibold border border-cocoa-700/20 text-cocoa-700"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function defaultEmbed(url: string): string {
  return `<iframe src="${url}/embed" width="100%" height="420" frameborder="0" loading="lazy"></iframe>`;
}

function QuickAction({
  icon: Icon,
  label,
  href,
  onClick,
  active,
}: {
  icon: PhIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  const inner = (
    <span
      className={`flex flex-col items-center justify-center gap-1.5 h-[72px] rounded-md border ${
        active ? "bg-amber-50 border-amber-200 text-atlas-700" : "bg-cream-100 border-parchment text-cocoa-700"
      }`}
    >
      <Icon size={18} aria-hidden="true" />
      <span className="text-[10px] font-semibold tracking-wide">{label}</span>
    </span>
  );
  if (onClick) return <button type="button" onClick={onClick} className="w-full">{inner}</button>;
  return <a href={href} target="_blank" rel="noopener noreferrer" className="w-full">{inner}</a>;
}
