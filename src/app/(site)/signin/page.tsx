/**
 * /signin , magic-link sign-in (Milestone 1).
 *
 * A private surface, so it says so rather than competing for a search result.
 *
 * With no `metadata` of its own this page inherited the root layout's whole
 * set, `alternates: { canonical: "/" }` included, and told a crawler it was the
 * home page. The honest correction is not a better description. A sign-in box
 * answers no question anyone types into a search engine, and it should not be
 * listed at all.
 *
 * WHY THIS FILE IS NOW TWO FILES. A module marked "use client" may not export
 * `metadata`; Next rejects it at the client boundary. The form, which needs
 * state, moved to SignInForm.tsx and this became the server component that
 * holds the metadata. Nothing about the rendered page changed, and the split
 * mirrors AccountPreview.tsx in the account route.
 *
 * Two details of how Next resolves the metadata below, both load-bearing:
 *
 *   `robots` replaces the root's key wholesale rather than deep-merging, so the
 *   root's `googleBot: { index: true }` does not survive alongside this. One
 *   noindex is enough.
 *
 *   `canonical: null` clears the inherited "/" instead of replacing it with
 *   "/signin". A page that has said do not list me should not also be
 *   nominating a canonical URL; the two are conflicting instructions. Null
 *   resolves to no tag at all, which is the unambiguous answer.
 */
import type { Metadata } from "next";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign in | Margin Atlas",
  description:
    "Sign-in for a Margin Atlas account; every figure on the site reads without one.",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function SignInPage() {
  return <SignInForm />;
}
