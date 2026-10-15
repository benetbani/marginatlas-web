/**
 * src/lib/learn/tracks.ts
 *
 * THE KNOWLEDGE BASE'S THREE READING TRACKS, ONE LIST (moved out of src/app/(site)/learn/page.tsx by fix round 1 of plan 2026-10-13
 * home-quiet-editorial, the final review's M1): the learn page draws each track's heading and blurb from here, and the home's reading
 * department names each track by the same title, so a door and the heading it opens never say two things.
 *
 * Each is reframed from a search-intent bucket into a stage of the same argument: see the revenue, then see how little of it the owner
 * keeps, then learn to read the figures honestly. Every blurb names what the number hides, per the voice rule "never quote a figure
 * without saying what can break it".
 */
export type LearnTrack = {
  family: "A" | "B" | "C";
  title: string;
  blurb: string;
  signalLabel: string | null;
};

export const LEARN_TRACKS: LearnTrack[] = [
  {
    family: "A",
    title: "What actually moves through the till",
    blurb:
      "Start with the headline question everyone asks: what does this kind of business take in? These give you the typical revenue and the spread around it, by format. Treat the figure as a sanity check, not a target. The till total is the easy number to find and the easy one to misread, because none of it is yet the owner's to keep.",
    signalLabel: "Typical revenue",
  },
  {
    family: "B",
    title: "What the owner actually keeps",
    blurb:
      "Revenue is not income. After food, wages, rent, and the rest, a busy business can leave its owner thin, and a quiet one can leave its owner comfortable. These pages give the healthy margin band for each trade, what good looks like, and where the margin usually leaks. Read this track before you fall for a big top-line number.",
    signalLabel: "Healthy margin",
  },
  {
    family: "C",
    title: "Reading the numbers without fooling yourself",
    blurb:
      "A benchmark is only useful if you know what it can and cannot claim. This track is the skeptic's toolkit: what a median really says, why the same trade looks different across cities, how to read the percentile spread, and what the line under a figure is telling you. Short, plain, and built to stop a tidy number from leading you somewhere expensive.",
    signalLabel: null,
  },
];
