import Link from "next/link";
import {
  getEventSummary,
  getLatestAnnouncement,
  getStats,
  placeLabel,
  type EventPlace,
} from "@/lib/api";

// Home. The LATEST announcement is the dominant element above the fold.
// Below: event places (venue/dates/deaneries), stats snapshot, CTA to login.
export default async function HomePage() {
  const [summaryR, latestR, statsR] = await Promise.allSettled([
    getEventSummary(),
    getLatestAnnouncement(),
    getStats(),
  ]);

  const summary = summaryR.status === "fulfilled" ? summaryR.value : null;
  const latest = latestR.status === "fulfilled" ? latestR.value : null;
  const stats = statsR.status === "fulfilled" ? statsR.value : null;

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      {/* TODO(designer): huge expressive display type for the title. */}
      <p className="text-sm uppercase tracking-widest text-primary">Catholic Youth Retreat</p>
      <h1 className="mt-2 font-display text-5xl sm:text-7xl">Anubhav 2026</h1>
      {summary && <p className="mt-3 text-ink/60">{summary.event}</p>}

      {/* Latest announcement — pinned as the visual anchor. */}
      <section aria-label="Latest announcement" className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-5">
        {latest ? (
          <>
            <p className="text-xs uppercase tracking-widest text-primary">Latest</p>
            <h2 className="mt-1 font-display text-2xl">{latest.title}</h2>
            <p className="mt-2 text-ink/80">{latest.body}</p>
          </>
        ) : (
          <p className="text-ink/60">Announcements will appear here soon.</p>
        )}
      </section>

      {/* Three places: venue, dates, deaneries. */}
      {summary && (
        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {summary.places.map((p) => (
            <PlaceCard key={p.place} place={p} />
          ))}
        </section>
      )}

      {/* Stats snapshot. */}
      {stats && (
        <section className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Registered" value={stats.totals.registered} />
          {stats.byPlace.map((s) => (
            <Stat key={s.place} label={placeLabel(s.place)} value={s.registered} />
          ))}
        </section>
      )}

      <nav className="mt-12 flex flex-wrap gap-3">
        {[
          ["/timetable", "Timetable"],
          ["/announcements", "Announcements"],
          ["/speakers", "Speakers"],
          ["/stats", "Stats"],
        ].map(([href, label]) => (
          <Link key={href} href={href} className="rounded-full border border-ink/15 px-4 py-2 text-sm">
            {label}
          </Link>
        ))}
        <Link href="/login" className="rounded-full bg-primary px-4 py-2 text-sm text-paper">
          Log in
        </Link>
      </nav>
    </main>
  );
}

function PlaceCard({ place }: { place: EventPlace }) {
  const range =
    place.dates.length > 1
      ? `${place.dates[0]} – ${place.dates[place.dates.length - 1]}`
      : place.dates[0] ?? "Dates TBA";
  return (
    <div className="rounded-xl border border-ink/10 p-5">
      <h3 className="font-display text-xl text-primary">{placeLabel(place.place)}</h3>
      <p className="mt-1 text-sm">{place.venue}</p>
      <p className="mt-1 text-sm text-ink/60">{range}</p>
      {place.deaneries.length > 0 && (
        <p className="mt-3 text-xs text-ink/50">{place.deaneries.join(" · ")}</p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-ink/10 p-4">
      <div className="font-display text-3xl">{value}</div>
      <div className="text-xs uppercase tracking-wide text-ink/60">{label}</div>
    </div>
  );
}
