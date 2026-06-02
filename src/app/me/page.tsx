import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMyEvent } from "@/lib/auth";
import { placeLabel, formatTime } from "@/lib/api";
import { SITE } from "@/lib/site";
import { Kicker } from "@/components/Kicker";
import { LogoutButton } from "@/components/LogoutButton";
import { MeTabs } from "@/components/MeTabs";

export const metadata: Metadata = { title: "My retreat" };
export const dynamic = "force-dynamic";

// Authenticated. Reads GET /anubhav/my/event with the JWT cookie.
// Roommates expose name + parish ONLY (no phone) — matches the app privacy model.
// Layout is mobile-first: a persistent identity hero + the time-sensitive
// "Happening now / Up next" cards stay visible, while the rest (schedule, room,
// announcements) lives in thumb-reachable tabs (see MeTabs) so an attendee
// isn't forced to scroll past everything to reach one thing.
export default async function MePage() {
  const me = await getMyEvent();
  if (!me) redirect("/login");

  if (me.registered === false) {
    return (
      <Shell>
        <div className="rounded-[18px] border border-line bg-paper p-5 font-sans text-sub sm:p-7">
          You are not registered for Anubhav {SITE.year} yet. Please contact your Parish Youth
          Coordinator.
        </div>
      </Shell>
    );
  }

  const dateRange =
    me.dates.length > 1
      ? `${me.dates[0]} – ${me.dates[me.dates.length - 1]}`
      : me.dates[0] ?? "";
  const live = me.live;

  return (
    <Shell>
      {/* Identity hero — always-visible context for where/when. */}
      <section className="relative overflow-hidden rounded-[20px] bg-violetDeep p-6 text-white sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-[280px] w-[280px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(201,154,63,0.30), transparent 70%)" }}
        />
        <div className="relative">
          <Kicker tone="gold" className="mb-2">
            {placeLabel(me.place)}
          </Kicker>
          {me.venue && (
            <p className="m-0 break-words font-serif text-2xl font-medium leading-tight sm:text-3xl">
              {me.venue}
            </p>
          )}
          {dateRange && <p className="mt-1.5 font-sans text-[15px] text-[#D5C7EB]">{dateRange}</p>}
        </div>
      </section>

      {/* Live now / next — the most time-sensitive info, kept above the tabs. */}
      {live && (live.now || live.next) && (
        <section className="mt-4 grid gap-3 sm:grid-cols-2">
          {live.now && (
            <div className="rounded-[18px] border border-gold/40 bg-gold/[0.06] p-5">
              <div className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.14em] text-gold">
                <span className="h-2 w-2 rounded-full bg-gold animate-pulse-dot" aria-hidden="true" />
                Happening now
              </div>
              <div className="mt-2 break-words font-serif text-lg font-semibold text-ink sm:text-xl">
                {live.now.title}
              </div>
              <div className="mt-1 font-sans text-sm tabular-nums text-sub">
                {formatTime(live.now.start_time)}
                {live.now.end_time ? ` – ${formatTime(live.now.end_time)}` : ""}
              </div>
            </div>
          )}
          {live.next && (
            <div className="rounded-[18px] border border-line bg-paper p-5">
              <div className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-violet">
                Up next
              </div>
              <div className="mt-2 break-words font-serif text-lg font-semibold text-ink sm:text-xl">
                {live.next.title}
              </div>
              <div className="mt-1 font-sans text-sm tabular-nums text-sub">
                {formatTime(live.next.start_time)}
                {live.next.end_time ? ` – ${formatTime(live.next.end_time)}` : ""}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Schedule · Room · Updates */}
      <MeTabs
        timetable={me.timetable}
        room={me.room}
        announcements={me.announcements}
        live={live}
      />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-bg">
      <div
        className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-12"
        style={{ paddingBottom: "max(4rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
          <h1 className="m-0 font-serif text-2xl font-medium tracking-[-0.02em] text-ink sm:text-3xl">
            My retreat
          </h1>
          <LogoutButton />
        </div>
        {children}
      </div>
    </div>
  );
}
