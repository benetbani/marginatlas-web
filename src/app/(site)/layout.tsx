/**
 * src/app/(site)/layout.tsx
 *
 * Every route inside this group gets the site chrome: masthead, the
 * readable-column <main>, the newsletter bar, the footer and the watch tray.
 *
 * A route group does not appear in the URL, so moving a folder in or out of
 * `(site)` changes what wraps it and never changes its path. That matters here:
 * URL slug renames are a hard constraint on this project and the SEO equity of
 * the existing pages is the whole point.
 *
 * What is NOT in this group is the `[country]` tree. It is one dynamic tree
 * containing both routes that want the chrome and one branch that must not have
 * it, and a group cannot split a dynamic segment. Those pages render
 * <SiteChrome> themselves. See the header of SiteChrome.tsx for why the split
 * has to be expressed this way at all.
 */
import { SiteChrome } from "@/components/SiteChrome";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
