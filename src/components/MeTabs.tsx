"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { formatTime, dayLabel, relativeAgo } from "@/lib/api";
import { KIND_COLOR, inferKind, groupByDay, type ScheduleRow } from "@/lib/schedule";

type Roommate = { name: string; parish: string };
type Room = { building: string; floor: string; room: string; roommates: Roommate[] };
type Announcement = { title: string; body: string; place: string | null; created_at: string };
type Live = { now: ScheduleRow | null; next: ScheduleRow | null } | undefined;

type TabId = "schedule" | "room" | "updates";

// Tabbed self-view for /me. Splits the long scroll (schedule, room, updates)
// into thumb-reachable tabs with a sticky segmented control, so an attendee on
// a phone finds what they need without scrolling past everything else.
export function MeTabs({
  timetable,
  room,
  announcements,
  live,
}: {
  timetable: ScheduleRow[];
  room: Room | null;
  announcements: Announcement[];
  live: Live;
}) {
  const [active, setActive] = useState<TabId>("schedule");
  const reduce = useReducedMotion();

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: "schedule", label: "Schedule", count: timetable.length },
    { id: "room", label: "Room" },
    { id: "updates", label: "Updates", count: announcements.length },
  ];

  return (
    <div className="mt-5">
      {/* Sticky segmented control — sits just below the global header. */}
      <div className="sticky top-[60px] z-30 -mx-1 mb-5 sm:top-[64px]">
        <div
          role="tablist"
          aria-label="My retreat sections"
          className="flex gap-1 rounded-full border border-line bg-bgAlt/95 p-1 backdrop-blur supports-[backdrop-filter]:bg-bgAlt/80"
        >
          {tabs.map((t) => {
            const on = active === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={on}
                onClick={() => setActive(t.id)}
                className="relative flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full px-3 font-sans text-sm font-semibold transition-colors duration-300 ease-lumen"
              >
                {on && (
                  <motion.span
                    layoutId={reduce ? undefined : "me-tab-pill"}
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    aria-hidden="true"
                  />
                )}
                <span className={`relative z-10 ${on ? "text-paper" : "text-sub"}`}>{t.label}</span>
                {typeof t.count === "number" && t.count > 0 && (
                  <span
                    className={`relative z-10 inline-flex min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5 font-sans text-[11px] font-bold tabular-nums ${
                      on ? "bg-white/20 text-paper" : "bg-ink/[0.07] text-sub"
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panels */}
      {active === "schedule" && <SchedulePanel timetable={timetable} live={live} />}
      {active === "room" && <RoomPanel room={room} />}
      {active === "updates" && <UpdatesPanel announcements={announcements} />}
    </div>
  );
}

// True when a schedule row is the one the backend flagged as happening now.
function isLiveNow(row: ScheduleRow, live: Live): boolean {
  const now = live?.now;
  return Boolean(now && now.title === row.title && (now.start_time ?? "") === (row.start_time ?? ""));
}

function SchedulePanel({ timetable, live }: { timetable: ScheduleRow[]; live: Live }) {
  if (timetable.length === 0) {
    return <EmptyState>The schedule will be published soon.</EmptyState>;
  }
  const groups = groupByDay(timetable);

  return (
    <FadeIn>
      <div className="space-y-6">
        {groups.map((g) => (
          <section
            key={String(g.day)}
            className="overflow-hidden rounded-[18px] border border-line bg-paper"
          >
            <div className="border-b border-line px-5 pb-3 pt-4">
              <span className="font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-gold">
                {dayLabel(g.day)}
              </span>
            </div>
            <ul className="py-1.5">
              {g.items.map((b, i) => {
                const kind = inferKind(b.title);
                const now = isLiveNow(b, live);
                return (
                  <li
                    key={i}
                    className={`grid grid-cols-[64px_1fr] items-start gap-3 px-5 py-3 transition-colors ${
                      now ? "bg-gold/[0.07]" : ""
                    }`}
                  >
                    <span className="pt-0.5 font-sans text-[13px] font-bold tabular-nums text-ink">
                      {formatTime(b.start_time)}
                    </span>
                    <div className="relative pl-4">
                      <span
                        className="absolute left-0 top-1.5 h-[7px] w-[7px] rounded-full"
                        style={{ background: KIND_COLOR[kind], boxShadow: `0 0 0 3px ${KIND_COLOR[kind]}1f` }}
                        aria-hidden="true"
                      />
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="break-words font-sans text-[15px] font-semibold leading-snug text-ink">
                          {b.title}
                        </span>
                        {now && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-paper">
                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-dot" />
                            Now
                          </span>
                        )}
                      </div>
                      {(b.location || b.notes) && (
                        <div className="mt-0.5 break-words font-sans text-[13px] text-sub">
                          {[b.location, b.notes].filter(Boolean).join(" · ")}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </FadeIn>
  );
}

function RoomPanel({ room }: { room: Room | null }) {
  if (!room) {
    return <EmptyState>Your room allocation is not ready yet.</EmptyState>;
  }
  return (
    <FadeIn>
      <section className="rounded-[18px] border border-line bg-paper p-5 sm:p-7">
        <div className="font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-gold">
          Your room
        </div>
        <p className="mt-2 break-words font-serif text-2xl font-medium text-ink">
          Room {room.room}
        </p>
        <p className="mt-1 break-words font-sans text-sub">
          {room.building} · Floor {room.floor}
        </p>

        {room.roommates.length > 0 && (
          <div className="mt-6 border-t border-lineSoft pt-5">
            <div className="mb-3 font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-faint">
              Roommates
            </div>
            <ul className="space-y-2.5">
              {room.roommates.map((r, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-bgAlt font-serif text-sm font-semibold text-violet"
                  >
                    {r.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-0 break-words font-sans text-sm text-sub">
                    <span className="font-semibold text-ink">{r.name}</span> · {r.parish}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </FadeIn>
  );
}

function UpdatesPanel({ announcements }: { announcements: Announcement[] }) {
  if (announcements.length === 0) {
    return <EmptyState>No announcements yet. Check back soon.</EmptyState>;
  }
  return (
    <FadeIn>
      <ul className="space-y-4">
        {announcements.map((a, i) => (
          <li
            key={`${a.created_at}-${i}`}
            className="rounded-[18px] border border-line bg-paper p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="m-0 break-words font-serif text-lg font-semibold text-ink">{a.title}</h3>
              <span className="shrink-0 font-sans text-xs text-faint">{relativeAgo(a.created_at)}</span>
            </div>
            <p className="mt-1.5 break-words font-sans text-sm leading-relaxed text-sub">{a.body}</p>
          </li>
        ))}
      </ul>
    </FadeIn>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <FadeIn>
      <div className="rounded-[18px] border border-dashed border-line bg-paper/60 px-5 py-12 text-center font-serif text-lg italic text-faint">
        {children}
      </div>
    </FadeIn>
  );
}

// Light enter animation for panel switches; respects reduced-motion.
function FadeIn({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
