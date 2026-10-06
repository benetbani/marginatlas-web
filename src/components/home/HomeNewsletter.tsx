/**
 * HomeNewsletter, THE HOME PAGE'S ASK. Since the checkup of 2026-10-06 (finding 5) it is his ruled capture, "notify me when my
 * place reaches this depth" (his interview of 2026-09-26), in place of the free-report offer it carried: a PDF of "the 2026 small
 * business benchmarks, 24 industries, 12 economies" that nobody was writing, whose counts no longer described the site (128 trades,
 * 195 countries), on the live home page and the new one alike. The reader chooses one of the cities whose page the floor census
 * counts under its floor (src/lib/home/depth_places.ts) and leaves an address; the newsletter list keeps the city's own tag, so
 * the promise made is one the list can keep: a letter when that city's page holds what London's does.
 *
 * Server component shell, the form a client island (src/components/spine/interact/DepthNotify.tsx, the thin pages' own form
 * with a city to choose). NO id="newsletter": the global FooterNewsletterBar keeps that anchor. The export keeps its name: the
 * live home page (src/app/page.tsx) and the new one (src/components/spine/home/home-view.tsx) both draw it.
 */
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { DepthNotify } from "@/components/spine/interact/DepthNotify";
import { depthCities } from "@/lib/home/depth_places";
import { COPY } from "@/lib/spine/copy";

export function HomeNewsletter() {
  const N = COPY.home.notify;
  const cities = depthCities();
  if (cities.length === 0) return null;
  return (
    <section data-home-notify="">
      {/* .atlas-card, the card surface with its seating shadow and position: relative, which keeps it above the frame's fixed
          layers. TWO COLUMNS BY ITS OWN WIDTH, NOT THE SCREEN'S (masterplan step 36): in two thirds of the band page's column the
          screen's breakpoint split it into columns too narrow for the form. */}
      <div className="atlas-card px-6 py-8 md:px-10 md:py-10 [container-type:inline-size]">
        <div className="grid gap-6 items-center [@container(min-width:600px)]:grid-cols-2 [@container(min-width:600px)]:gap-10">
          <div>
            <SectionEyebrow size="md" className="mb-2">{N.eyebrow}</SectionEyebrow>
            <h2 className="font-display text-lg md:text-xl font-medium tracking-tight text-ink-900">{N.title}</h2>
            <p className="mt-2 text-sm text-cocoa-700 leading-relaxed">{N.line}</p>
          </div>
          <DepthNotify
            choices={cities}
            words={{ label: N.label, choose: N.choose, pick: N.pick, placeholder: N.placeholder, button: N.button, sent: N.sent, failed: N.failed }}
          />
        </div>
      </div>
    </section>
  );
}
