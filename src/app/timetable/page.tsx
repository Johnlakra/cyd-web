import type { Metadata } from "next";
import { getAllTimetables, PLACES, placeLabel, formatTime, dayLabel } from "@/lib/api";

export const metadata: Metadata = { title: "Timetable" };

// Three-column layout — one column per place. The public timetable endpoint
// requires ?place=, so getAllTimetables fetches all three in parallel.
export default async function TimetablePage() {
  let byPlace;
  try {
    byPlace = await getAllTimetables();
  } catch {
    return <main className="mx-auto max-w-5xl px-5 py-12 text-ink/70">Could not load the timetable.</main>;
  }

  const hasAny = PLACES.some((p) => byPlace[p]?.length);

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="font-display text-4xl">Timetable</h1>
      {!hasAny ? (
        <p className="mt-8 text-ink/60">The schedule will be published soon.</p>
      ) : (
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {PLACES.map((place) => {
            const items = byPlace[place] ?? [];
            return (
              <section key={place}>
                <h2 className="font-display text-xl text-primary">{placeLabel(place)}</h2>
                {items.length === 0 ? (
                  <p className="mt-3 text-sm text-ink/50">Coming soon.</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {items.map((e, i) => (
                      <li key={i} className="border-b border-ink/10 pb-2">
                        <div className="text-xs uppercase text-ink/40">{dayLabel(e.day)}</div>
                        <span className="text-sm tabular-nums text-ink/60">
                          {formatTime(e.start_time)}
                          {e.end_time ? ` – ${formatTime(e.end_time)}` : ""}
                        </span>
                        <div className="font-medium">{e.title}</div>
                        {e.location && <div className="text-xs text-ink/50">{e.location}</div>}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
