import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMyEvent } from "@/lib/auth";
import { placeLabel, formatTime, dayLabel } from "@/lib/api";
import { SITE } from "@/lib/site";
import { Kicker } from "@/components/Kicker";
import { LogoutButton } from "@/components/LogoutButton";

export const metadata: Metadata = { title: "My retreat" };
export const dynamic = "force-dynamic";

// Authenticated. Reads GET /anubhav/my/event with the JWT cookie.
// Roommates expose name + parish ONLY (no phone) — matches the app privacy model.
// Layout is mobile-first: cards use compact padding on phones (p-5) and scale
// up at sm:, headings scale down on small screens, and user-supplied strings
// use break-words so they can't overflow a narrow viewport.
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
      {/* Identity */}
      <section className="rounded-[18px] border border-line bg-paper p-5 sm:p-7">
        <Kicker className="mb-2">{placeLabel(me.place)}</Kicker>
        {me.venue && (
          <p className="m-0 break-words font-serif text-xl font-medium text-ink sm:text-2xl">
            {me.venue}
          </p>
        )}
        {dateRange && <p className="mt-1 font-sans text-sub">{dateRange}</p>}
      </section>

      {/* Live now / next */}
      {live && (live.now || live.next) && (
        <section className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2">
          {live.now && (
            <div className="rounded-[18px] border border-gold/40 bg-gold/[0.06] p-5 sm:p-6">
              <div className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-gold">
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
            <div className="rounded-[18px] border border-line bg-paper p-5 sm:p-6">
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

      {/* Room */}
      {me.room ? (
        <section className="mt-4 rounded-[18px] border border-line bg-paper p-5 sm:mt-5 sm:p-7">
          <h2 className="m-0 font-serif text-lg font-semibold text-ink sm:text-xl">Your room</h2>
          <p className="mt-1.5 break-words font-sans text-ink">
            {me.room.building}, Floor {me.room.floor}, Room {me.room.room}
          </p>
          {me.room.roommates.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.12em] text-faint">
                Roommates
              </div>
              <ul className="space-y-1.5">
                {me.room.roommates.map((r, i) => (
                  <li key={i} className="break-words font-sans text-sm text-sub">
                    <span className="font-medium text-ink">{r.name}</span> · {r.parish}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ) : (
        <section className="mt-4 rounded-[18px] border border-line bg-paper p-5 font-sans text-sm text-sub sm:mt-5 sm:p-7">
          Your room allocation is not ready yet.
        </section>
      )}

      {/* Schedule */}
      <section className="mt-4 rounded-[18px] border border-line bg-paper p-5 sm:mt-5 sm:p-7">
        <h2 className="m-0 font-serif text-lg font-semibold text-ink sm:text-xl">Your schedule</h2>
        {me.timetable.length === 0 ? (
          <p className="mt-3 font-sans text-sm text-faint">The schedule will be published soon.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {me.timetable.map((t, i) => (
              <li key={i} className="border-b border-lineSoft pb-3 last:border-b-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-gold">
                    {dayLabel(t.day)}
                  </span>
                  <span className="font-sans text-sm tabular-nums text-sub">
                    {formatTime(t.start_time)}
                    {t.end_time ? ` – ${formatTime(t.end_time)}` : ""}
                  </span>
                </div>
                <div className="mt-0.5 break-words font-sans font-medium text-ink">{t.title}</div>
                {t.location && (
                  <div className="break-words font-sans text-xs text-faint">{t.location}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Announcements */}
      {me.announcements.length > 0 && (
        <section className="mt-4 rounded-[18px] border border-line bg-paper p-5 sm:mt-5 sm:p-7">
          <h2 className="m-0 font-serif text-lg font-semibold text-ink sm:text-xl">Announcements</h2>
          <ul className="mt-4 space-y-4">
            {me.announcements.map((a, i) => (
              <li key={`${a.created_at}-${i}`}>
                <h3 className="m-0 break-words font-sans font-semibold text-ink">{a.title}</h3>
                <p className="mt-1 break-words font-sans text-sm leading-relaxed text-sub">
                  {a.body}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
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
