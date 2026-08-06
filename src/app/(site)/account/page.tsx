/**
 * /account — the signed-in user's home (Milestone 1).
 *
 * Auth OFF (default): renders the existing design preview / "coming soon"
 * (AccountPreview), unchanged, and stays statically prerendered (no cookie read).
 * Auth ON: signed-out visitors are sent to /signin; signed-in visitors see their
 * real saved cells. Only this on-branch reads cookies, so /account is dynamic
 * only once auth is activated.
 */
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { isAuthEnabled } from "@/lib/feature_flags";
import { getSessionUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AccountPreview } from "./AccountPreview";

/**
 * A private surface, so it says so rather than competing for a search result.
 *
 * With no `metadata` of its own this page inherited the root layout's whole
 * set, `alternates: { canonical: "/" }` included, and told a crawler it was the
 * home page. The honest correction is not a better description. Nothing here is
 * a search answer: signed out it is a preview, signed in it is one reader's
 * saved cells. It should not be listed at all.
 *
 * Two details of how Next resolves this, both load-bearing:
 *
 *   `robots` replaces the root's key wholesale rather than deep-merging, so the
 *   root's `googleBot: { index: true }` does not survive alongside this. One
 *   noindex is enough, and a googleBot block restating it would be noise.
 *
 *   `canonical: null` clears the inherited "/" instead of replacing it with
 *   "/account". A page that has said do not list me should not also be
 *   nominating a canonical URL; the two are conflicting instructions. Null
 *   resolves to no tag at all, which is the unambiguous answer.
 */
export const metadata: Metadata = {
  title: "Your account | Margin Atlas",
  description:
    "The signed-in home for a Margin Atlas account: saved cells and the settings attached to them.",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

type SavedRow = { country: string; geo: string; industry: string; label: string | null };

export default async function AccountPage() {
  if (!isAuthEnabled()) {
    return <AccountPreview />;
  }

  const user = await getSessionUser();
  if (!user) {
    redirect("/signin?next=/account");
  }

  let saved: SavedRow[] = [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("saved_cells")
      .select("country, geo, industry, label")
      .order("created_at", { ascending: false });
    saved = (data as SavedRow[] | null) ?? [];
  } catch {
    saved = [];
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-atlas-700">
            Account
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
            {user.email ?? "Your account"}
          </h1>
        </div>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="rounded-full border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-800 transition-colors hover:border-atlas-500"
          >
            Sign out
          </button>
        </form>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-ink-900">Your saved cells</h2>
        {saved.length === 0 ? (
          <p className="mt-3 text-sm text-cocoa-700">Star any cell to save it here.</p>
        ) : (
          <ul className="mt-5 divide-y divide-parchment border-y border-parchment">
            {saved.map((c) => (
              <li key={`${c.country}/${c.geo}/${c.industry}`}>
                <Link
                  href={`/${c.country}/${c.geo}/${c.industry}`}
                  className="group flex items-baseline justify-between gap-3 py-3 transition-colors"
                >
                  <span className="text-sm font-medium text-ink-900 group-hover:text-atlas-700">
                    {c.label || `${c.industry} in ${c.geo}`}
                  </span>
                  <span aria-hidden className="text-cocoa-500 group-hover:text-atlas-600">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
