"use client";

import { useState } from "react";
import { formatTime, type TimetableItem } from "@/lib/api";
import { Reveal } from "./Reveal";

export type TimetablePlace = {
  place: string;
  label: string;
  dateShort: string;
  venue: string;
};

// Color/label system for the schedule dots + legend. `kind` is inferred from the
// item title since the public timetable API carries no explicit category.
const KIND_COLOR: Record<string, string> = {
  arrival: "#B0822B",
  worship: "#5A3E8C",
  talk: "#241B2E",
  meal: "#9A8E7C",
  social: "#C99A3F",
  prayer: "#5A3E8C",
  mass: "#B0822B",
};
const KIND_LABEL: Record<string, string> = {
  arrival: "Arrival",
  worship: "Worship",
  talk: "Session",
  meal: "Meal",
  social: "Gathering",
  prayer: "Prayer",
  mass: "Holy Mass",
};

function inferKind(title: string): string {
  const t = title.toLowerCase();
  if (/\bmass\b/.test(t)) return "mass";
  if (/prayer|adoration|confession|rosary/.test(t)) return "prayer";
  if (/praise|worship/.test(t)) return "worship";
  if (/breakfast|lunch|dinner|meal|\btea\b|snack/.test(t)) return "meal";
  if (/arriv|registration|departure|check-?in/.test(t)) return "arrival";
  if (/session|talk|keynote|address|reflection|workshop|commission|welcome/.test(t)) return "talk";
  return "social";
}

// Group a place's items by `day`, preserving day order and sorting by start time.
function groupByDay(items: TimetableItem[]): { day: number | string; items: TimetableItem[] }[] {
  const map = new Map<string, { day: number | string; items: TimetableItem[] }>();
  for (const item of items) {
    const key = String(item.day);
    if (!map.has(key)) map.set(key, { day: item.day, items: [] });
    map.get(key)!.items.push(item);
  }
  const groups = Array.from(map.values());
  groups.sort((a, b) => String(a.day).localeCompare(String(b.day), undefined, { numeric: true }));
  for (const g of groups) {
    g.items.sort((a, b) => (a.start_time ?? "").localeCompare(b.start_time ?? ""));
  }
  return groups;
}

export function TimetableView({
  places,
  byPlace,
}: {
  places: TimetablePlace[];
  byPlace: Record<string, TimetableItem[]>;
}) {
  const [vi, setVi] = useState(0);
  const active = places[vi] ?? places[0];
  const groups = groupByDay(byPlace[active?.place] ?? []);

  return (
    <>
      {/* Venue switch */}
      <section className="mx-auto max-w-site px-5 sm:px-8 md:px-12">
        <div className="grid overflow-hidden rounded-[14px] border border-line bg-paper sm:grid-cols-3">
          {places.map((v, i) => {
            const on = vi === i;
            return (
              <button
                key={v.place}
                type="button"
                onClick={() => setVi(i)}
                aria-pressed={on}
                className={`px-6 py-5 text-left transition-colors duration-300 ease-lumen ${
                  i === 0 ? "" : "border-t border-line sm:border-l sm:border-t-0"
                } ${on ? "bg-ink text-paper" : "bg-transparent text-ink"}`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-serif text-2xl font-semibold">{v.label}</span>
                  <span
                    className={`font-sans text-[12.5px] font-bold tracking-[0.06em] ${
                      on ? "text-goldSoft" : "text-gold"
                    }`}
                  >
                    {v.dateShort.toUpperCase()}
                  </span>
                </div>
                <div className={`mt-1 font-sans text-[13.5px] ${on ? "text-white/70" : "text-sub"}`}>
                  {v.venue}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Day grid */}
      <section className="mx-auto max-w-site px-5 pb-20 pt-10 sm:px-8 md:px-12">
        {groups.length === 0 ? (
          <p className="py-12 text-center font-serif text-2xl italic text-faint">
            The schedule for {active?.label} will be published soon.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {groups.map((g, di) => (
              <Reveal key={String(g.day)} delay={0.06 * di}>
                <div className="h-full overflow-hidden rounded-2xl border border-line bg-paper">
                  <div className="border-b border-line px-6 pb-4 pt-5">
                    <div className="flex items-baseline justify-between">
                      <span className="font-sans text-[12.5px] font-bold uppercase tracking-[0.14em] text-gold">
                        {typeof g.day === "number" ? `Day ${g.day}` : g.day}
                      </span>
                    </div>
                  </div>
                  <div className="py-2">
                    {g.items.map((b, bi) => {
                      const kind = inferKind(b.title);
                      return (
                        <div
                          key={bi}
                          className="tt-row grid grid-cols-[68px_1fr] items-start gap-3.5 px-6 py-3 transition-colors duration-200 ease-lumen hover:bg-gold/[0.05]"
                        >
                          <span className="pt-0.5 font-sans text-[13px] font-bold tabular-nums text-ink">
                            {formatTime(b.start_time)}
                          </span>
                          <div className="relative pl-4">
                            <span
                              className="absolute left-0 top-1.5 h-[7px] w-[7px] rounded-full"
                              style={{
                                background: KIND_COLOR[kind],
                                boxShadow: `0 0 0 3px ${KIND_COLOR[kind]}1f`,
                              }}
                              aria-hidden="true"
                            />
                            <div className="font-sans text-[15px] font-semibold leading-snug text-ink">
                              {b.title}
                            </div>
                            {(b.location || b.notes) && (
                              <div className="mt-0.5 font-sans text-[13px] text-sub">
                                {[b.location, b.notes].filter(Boolean).join(" · ")}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* Legend */}
        {groups.length > 0 && (
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-line pt-6">
              {Object.keys(KIND_LABEL).map((k) => (
                <div key={k} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: KIND_COLOR[k] }} />
                  <span className="font-sans text-[13px] text-sub">{KIND_LABEL[k]}</span>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </section>
    </>
  );
}
