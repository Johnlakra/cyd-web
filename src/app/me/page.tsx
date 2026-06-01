import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getMyEvent } from "@/lib/auth";
import { placeLabel, formatTime, dayLabel } from "@/lib/api";
import { SITE } from "@/lib/site";
import { Kicker } from "@/components/Kicker";

export const metadata: Metadata = { title: "My retreat" };
export const dynamic = "force-dynamic";

// Authenticated. Reads GET /anubhav/my/event with the JWT cookie.
// Roommates expose name + parish ONLY (no phone) — matches the app privacy model.
export default async function MePage() {
  const me = await getMyEvent();
  if (!me) redirect("/login");

  if (me.registered === false) {
    return (
      <Shell>
        <div className="rounded-[18px] border border-line bg-paper p-7 font-sans text-sub">
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
      <section className="rounded-[18px] border border-line bg-paper p-7">
        <Kicker className="mb-2">{placeLabel(me.place)}</Kicker>
        {me.venue && <p className="m-0 font-serif text-2xl font-medium text-ink">{me.venue}</p>}
        {dateRange && <p className="mt-1 font-sans text-sub">{dateRange}</p>}
      </section>

      {/* Live now / next */}
      {live && (live.now || live.next) && (
        <section className="mt-5 grid gap-4 sm:grid-cols-2">
          {live.now && (
            <div className="rounded-[18px] border border-gold/40 bg-gold/[0.06] p-6">
              <div className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-gold">
                Happening now
              </div>
              <div className="mt-2 font-serif text-xl font-semibold text-ink">{live.now.title}</div>
              <div className="mt-1 font-sans text-sm tabular-nums text-sub">
                {formatTime(live.now.start_time)}
                {live.now.end_time ? ` – ${formatTime(live.now.end_time)}` : ""}
              </div>
            </div>
          )}
          {live.next && (
            <div className="rounded-[18px] border border-line bg-paper p-6">
              <div className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-violet">
                Up next
              </div>
              <div className="mt-2 font-serif text-xl font-semibold text-ink">{live.next.title}</div>
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
        <section className="mt-5 rounded-[18px] border border-line bg-paper p-7">
          <h2 className="m-0 font-serif text-xl font-semibold text-ink">Your room</h2>
          <p className="mt-1.5 font-sans text-ink">
            {me.room.building}, Floor {me.room.floor}, Room {me.room.room}
          </p>
          {me.room.roommates.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.12em] text-faint">
                Roommates
              </div>
              <ul className="space-y-1.5">
                {me.room.roommates.map((r, i) => (
                  <li key={i} className="font-sans text-sm text-sub">
                    <span className="font-medium text-ink">{r.name}</span> · {r.parish}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ) : (
        <section className="mt-5 rounded-[18px] border border-line bg-paper p-7 font-sans text-sm text-sub">
          Your room allocation is not ready yet.
        </section>
      )}

      {/* Schedule */}
      <section className="mt-5 rounded-[18px] border border-line bg-paper p-7">
        <h2 className="m-0 font-serif text-xl font-semibold text-ink">Your schedule</h2>
        {me.timetable.length === 0 ? (
          <p className="mt-3 font-sans text-sm text-faint">The schedule will be published soon.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {me.timetable.map((t, i) => (
              <li key={i} className="border-b border-lineSoft pb-3 last:border-b-0">
                <div className="flex items-baseline gap-3">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-gold">
                    {dayLabel(t.day)}
                  </span>
                  <span className="font-sans text-sm tabular-nums text-sub">
                    {formatTime(t.start_time)}
                    {t.end_time ? ` – ${formatTime(t.end_time)}` : ""}
                  </span>
                </div>
                <div className="mt-0.5 font-sans font-medium text-ink">{t.title}</div>
                {t.location && <div className="font-sans text-xs text-faint">{t.location}</div>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Announcements */}
      {me.announcements.length > 0 && (
        <section className="mt-5 rounded-[18px] border border-line bg-paper p-7">
          <h2 className="m-0 font-serif text-xl font-semibold text-ink">Announcements</h2>
          <ul className="mt-4 space-y-4">
            {me.announcements.map((a, i) => (
              <li key={`${a.created_at}-${i}`}>
                <h3 className="m-0 font-sans font-semibold text-ink">{a.title}</h3>
                <p className="mt-1 font-sans text-sm leading-relaxed text-sub">{a.body}</p>
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
      <div className="mx-auto max-w-2xl px-5 pb-20 pt-12 sm:px-8">
        <div className="mb-7 flex items-center justify-between">
          <h1 className="m-0 font-serif text-3xl font-medium tracking-[-0.02em] text-ink">
            My retreat
          </h1>
          <Link href="/logout" className="font-sans text-sm font-semibold text-sub underline">
            Log out
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
