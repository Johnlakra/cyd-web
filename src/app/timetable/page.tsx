import type { Metadata } from "next";
import {
  getAllTimetables,
  getEventSummary,
  PLACES,
  placeLabel,
  formatDateRangeShort,
} from "@/lib/api";
import { PageHead } from "@/components/PageHead";
import { TimetableView, type TimetablePlace } from "@/components/TimetableView";

export const metadata: Metadata = {
  title: "Timetable",
  description:
    "The Anubhav 2026 retreat schedule for each of the three Punjab venues — Phagwara, Abohar, and Amritsar.",
};

// Three venues, each with its own day-by-day schedule. The public timetable
// endpoint requires ?place=, so getAllTimetables fetches all three in parallel.
export default async function TimetablePage() {
  const [byPlaceR, summaryR] = await Promise.allSettled([getAllTimetables(), getEventSummary()]);
  const byPlace = byPlaceR.status === "fulfilled" ? byPlaceR.value : null;
  const summary = summaryR.status === "fulfilled" ? summaryR.value : null;

  if (!byPlace) {
    return (
      <div className="bg-bg">
        <PageHead kicker="Three days, one journey" title="Timetable" />
        <p className="mx-auto max-w-site px-5 pb-20 font-serif text-xl italic text-faint sm:px-8 md:px-12">
          The timetable could not be loaded right now. Please try again shortly.
        </p>
      </div>
    );
  }

  // Build venue metadata from the event summary, falling back to the place keys.
  const places: TimetablePlace[] = PLACES.map((place) => {
    const meta = summary?.places.find((p) => p.place === place);
    return {
      place,
      label: placeLabel(place),
      venue: meta?.venue ?? "",
      dateShort: meta ? formatDateRangeShort(meta.dates) : "",
    };
  });

  return (
    <div className="bg-bg">
      <PageHead
        kicker="Three days, one journey"
        title="Timetable"
        sub="Each venue follows the same retreat rhythm — arrival, encounter, and sending forth. Choose a venue to see its schedule."
      />
      <TimetableView places={places} byPlace={byPlace} />
    </div>
  );
}
