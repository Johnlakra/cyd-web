import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getMyEvent } from "@/lib/auth";
import { placeLabel, formatTime, dayLabel } from "@/lib/api";

export const metadata: Metadata = { title: "My retreat" };
export const dynamic = "force-dynamic";

// Authenticated. Reads GET /anubhav/my/event with the JWT cookie.
// Backend returns { registered: false } or the full self-view (room may be null).
export default async function MePage() {
  const me = await getMyEvent();
  if (!me) redirect("/login");

  if (me.registered === false) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-12">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl">My retreat</h1>
          <Link href="/logout" className="text-sm text-ink/60 underline">Log out</Link>
        </div>
        <p className="mt-6 rounded-xl border border-ink/10 p-5 text-ink/70">
          You are not registered for Anubhav 2026 yet. Please contact your parish LOC.
        </p>
      </main>
    );
  }

  const dateRange =
    me.dates.length > 1 ? `${me.dates[0]} – ${me.dates[me.dates.length - 1]}` : me.dates[0] ?? "";

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">My retreat</h1>
        <Link href="/logout" className="text-sm text-ink/60 underline">Log out</Link>
      </div>

      <section className="mt-6 rounded-xl border border-ink/10 p-5">
        <p className="text-xs uppercase tracking-widest text-primary">{placeLabel(me.place)}</p>
        {me.venue && <p className="mt-1 text-lg">{me.venue}</p>}
        {dateRange && <p className="text-ink/70">{dateRange}</p>}
      </section>

      {me.room ? (
        <section className="mt-5 rounded-xl border border-ink/10 p-5">
          <h2 className="font-display text-xl">Your room</h2>
          <p className="mt-1 text-ink/80">
            {me.room.building}, Floor {me.room.floor}, Room {me.room.room}
          </p>
          {me.room.roommates.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-ink/70">
              {me.room.roommates.map((r, i) => (
                <li key={i}>
                  {r.name} · {r.parish}
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <section className="mt-5 rounded-xl border border-ink/10 p-5 text-sm text-ink/60">
          Your room allocation is not ready yet.
        </section>
      )}

      <section className="mt-5 rounded-xl border border-ink/10 p-5">
        <h2 className="font-display text-xl">Your schedule</h2>
        {me.timetable.length === 0 ? (
          <p className="mt-3 text-sm text-ink/50">The schedule will be published soon.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {me.timetable.map((t, i) => (
              <li key={i} className="border-b border-ink/10 pb-2 text-sm">
                <span className="text-xs uppercase text-ink/40">{dayLabel(t.day)}</span>{" "}
                <span className="tabular-nums text-ink/60">
                  {formatTime(t.start_time)}
                  {t.end_time ? ` – ${formatTime(t.end_time)}` : ""}
                </span>
                <div className="font-medium">{t.title}</div>
                {t.location && <div className="text-xs text-ink/50">{t.location}</div>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {me.announcements.length > 0 && (
        <section className="mt-5 rounded-xl border border-ink/10 p-5">
          <h2 className="font-display text-xl">Announcements</h2>
          <ul className="mt-3 space-y-3">
            {me.announcements.map((a, i) => (
              <li key={`${a.created_at}-${i}`}>
                <h3 className="font-medium">{a.title}</h3>
                <p className="text-sm text-ink/70">{a.body}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
