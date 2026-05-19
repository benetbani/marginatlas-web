import { CompareToMeClient } from "./CompareToMeClient";
import { SmartImage } from "@/components/SmartImage";

export const metadata = {
  title: "How do I compare? | Margin Atlas",
  description:
    "Type in your own revenue and headcount and see where you sit against the typical firm in your industry and region.",
};

export const revalidate = 86400;

export default function CompareToMePage() {
  return (
    <div>
      <header className="py-10 lg:grid lg:grid-cols-[1.4fr_1fr] lg:gap-10 lg:items-center">
        <div>
          <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
            Tool
          </div>
          <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight text-ink-900">
            How do I compare?
          </h1>
          <p className="mt-4 text-lg text-ink-800/80 max-w-2xl leading-relaxed">
            Type in your own revenue and headcount and see where you sit
            against the typical firm in your industry and region. We never
            store your numbers: the calculation runs entirely in your browser.
          </p>
        </div>
        <div className="hidden lg:block mt-6 lg:mt-0">
          {/* Image placeholder YOU-1: "you vs typical firm" illustration */}
          <SmartImage
            alt="Illustration of your firm against the industry distribution"
            glyph="📊"
            caption="Your position"
            aspectRatio={1.5}
            intent="hero"
          />
        </div>
      </header>
      <CompareToMeClient />
    </div>
  );
}
