import Link from "next/link";
import {
  getEventSummary,
  getLatestAnnouncement,
  getStats,
  getSpeakers,
  placeLabel,
  formatDateRangeShort,
  formatPostedDate,
  relativeAgo,
  type EventPlace,
  type Speaker,
} from "@/lib/api";
import { SITE } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { Kicker } from "@/components/Kicker";
import { CountUp } from "@/components/CountUp";
import { GrowBar } from "@/components/GrowBar";
import { DrawUnderline } from "@/components/DrawUnderline";
import { PhotoSlot } from "@/components/PhotoSlot";

// Home. Hierarchy (strict): pinned latest announcement → identity → venues →
// stats preview → speakers preview. Server-rendered for SEO.
export default async function HomePage() {
  const [summaryR, latestR, statsR, speakersR] = await Promise.allSettled([
    getEventSummary(),
    getLatestAnnouncement(),
    getStats(),
    getSpeakers(),
  ]);

  const summary = summaryR.status === "fulfilled" ? summaryR.value : null;
  const latest = latestR.status === "fulfilled" ? latestR.value : null;
  const stats = statsR.status === "fulfilled" ? statsR.value : null;
  const speakers = speakersR.status === "fulfilled" ? speakersR.value.slice(0, 4) : [];

  const countFor = (place: string) =>
    stats?.byPlace.find((s) => s.place === place)?.registered ?? 0;
  const total = stats?.totals.registered ?? 0;

  return (
    <div className="bg-bg">
      {/* PINNED ANNOUNCEMENT — the lead anchor, above the fold. */}
      <section className="mx-auto max-w-site px-5 pb-2 pt-10 sm:px-8 md:px-12">
        <Reveal>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="animate-pulse-dot h-[7px] w-[7px] rounded-full bg-gold" aria-hidden="true" />
            <Kicker tone="gold">Latest announcement</Kicker>
            {latest && (
              <span className="font-sans text-[13px] text-faint">· {relativeAgo(latest.created_at)}</span>
            )}
          </div>
        </Reveal>

        <div className="grid items-end gap-8 border-b border-line pb-10 md:grid-cols-[1fr_280px] md:gap-12">
          <Reveal delay={0.05}>
            {latest ? (
              <Link href="/announcements" className="block">
                <h2
                  className="m-0 max-w-[740px] font-serif font-medium leading-[1.05] tracking-[-0.015em] text-ink"
                  style={{ fontSize: "clamp(30px, 5.2vw, 50px)" }}
                >
                  {latest.title}
                </h2>
                <p className="mt-4 max-w-[620px] font-sans text-[17px] leading-relaxed text-sub sm:text-lg">
                  {latest.body}
                </p>
              </Link>
            ) : (
              <p className="font-serif text-2xl italic text-faint">
                Announcements will appear here soon.
              </p>
            )}
          </Reveal>

          {latest && (
            <Reveal delay={0.12} className="md:text-right">
              <div className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-sans text-[13px] font-semibold text-violet">
                <span className="h-[5px] w-[5px] rounded-full bg-violet" aria-hidden="true" />
                {latest.place ? placeLabel(latest.place) : "Diocese-wide"}
              </div>
              <div className="mt-3.5 font-sans text-sm text-sub">
                Posted {formatPostedDate(latest.created_at)}
              </div>
              <Link href="/announcements" className="mt-5 inline-block">
                <span className="border-b-[1.5px] border-gold pb-0.5 font-sans text-[15px] font-semibold text-ink">
                  All announcements →
                </span>
              </Link>
            </Reveal>
          )}
        </div>
      </section>

      {/* HERO identity. */}
      <section className="mx-auto max-w-site px-5 pb-14 pt-12 text-center sm:px-8 sm:pt-14 md:px-12">
        <Reveal>
          <Kicker className="mb-5">
            {SITE.org} · {SITE.commission}
          </Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          <h1
            className="m-0 font-serif font-medium leading-[0.9] tracking-[-0.03em] text-ink"
            style={{ fontSize: "clamp(56px, 15vw, 176px)" }}
          >
            Anubhav
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <span className="hidden h-px w-20 bg-line sm:block" aria-hidden="true" />
            <span className="whitespace-nowrap font-serif text-2xl italic text-gold sm:text-[32px]">
              {SITE.tagline}
            </span>
            <span className="font-serif text-2xl text-ink sm:text-[32px]">{SITE.year}</span>
            <span className="hidden h-px w-20 bg-line sm:block" aria-hidden="true" />
          </div>
        </Reveal>

        {/* Venues */}
        <Reveal delay={0.16}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-line bg-paper text-left md:grid md:grid-cols-3">
            {summary
              ? summary.places.map((p, i) => (
                  <VenueCell key={p.place} place={p} count={countFor(p.place)} first={i === 0} />
                ))
              : PLACEHOLDER_VENUES.map((p, i) => (
                  <VenueCell key={p.place} place={p} count={0} first={i === 0} />
                ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
            <Link
              href="/login"
              className="cta-primary rounded-full bg-violet px-8 py-3.5 font-sans text-base font-semibold text-paper transition-transform duration-300 ease-lumen hover:-translate-y-0.5"
            >
              View my details
            </Link>
            <span className="font-sans text-[15px] font-medium text-ink sm:text-[15.5px]">
              Arrival <DrawUnderline>{SITE.arrival}</DrawUnderline> · Departure{" "}
              <DrawUnderline>{SITE.departure}</DrawUnderline>
            </span>
          </div>
        </Reveal>
      </section>

      {/* STATS preview. */}
      <section className="border-y border-line bg-paper px-5 py-14 sm:px-8 md:px-12">
        <div className="mx-auto max-w-site">
          <div className="mb-9 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <Reveal>
              <Kicker className="mb-3.5">Youth joining</Kicker>
              <div className="flex items-baseline gap-3.5">
                <CountUp
                  value={total}
                  className="font-serif font-medium leading-[0.85] tracking-[-0.03em] text-ink text-[clamp(72px,11vw,132px)]"
                />
                <span className="font-serif text-2xl italic text-sub sm:text-[28px]">and counting</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="m-0 max-w-[280px] font-sans text-base leading-relaxed text-sub md:text-right">
                Across three venues in Punjab, registered at {SITE.fee} per youth.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {(summary?.places ?? PLACEHOLDER_VENUES).map((v, i) => {
              const count = countFor(v.place);
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <Reveal key={v.place} delay={0.12 + i * 0.06}>
                  <div className="border-t-2 border-ink pt-4">
                    <div className="flex items-baseline justify-between">
                      <span className="font-sans text-base font-semibold text-ink">
                        {placeLabel(v.place)}
                      </span>
                      <span className="font-sans text-sm text-sub">{pct}%</span>
                    </div>
                    <CountUp
                      value={count}
                      className="mt-2 block font-serif text-[54px] font-medium tracking-[-0.02em] text-ink"
                    />
                    <div className="mt-3.5 h-1 overflow-hidden rounded-full bg-line">
                      <GrowBar pct={pct} delay={0.3 + i * 0.1} />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* SPEAKERS preview. */}
      {speakers.length > 0 && (
        <section className="mx-auto max-w-site px-5 pb-16 pt-16 sm:px-8 md:px-12">
          <div className="mb-9 flex items-end justify-between">
            <Reveal>
              <Kicker className="mb-3">Who you&rsquo;ll hear</Kicker>
              <h2 className="m-0 font-serif text-[32px] font-medium tracking-[-0.02em] text-ink sm:text-[44px]">
                Speakers &amp; guides
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link href="/speakers" className="shrink-0">
                <span className="border-b-[1.5px] border-gold pb-0.5 font-sans text-[15px] font-semibold text-ink">
                  Meet everyone →
                </span>
              </Link>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {speakers.map((s, i) => (
              <Reveal key={`${s.name}-${i}`} delay={0.08 * i}>
                <SpeakerPreview speaker={s} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Fallback venue identity used only when the event-summary API is unreachable, so
// the SSR homepage never renders an empty hero. Counts come from the live stats API.
const PLACEHOLDER_VENUES: EventPlace[] = [
  { place: "phagwara", venue: "St. Joseph's Catholic Church", dates: ["2026-06-02", "2026-06-04"], deaneries: [] },
  { place: "abohar", venue: "St. Joseph's Catholic Church", dates: ["2026-06-04", "2026-06-06"], deaneries: [] },
  { place: "amritsar", venue: "St. Francis Church", dates: ["2026-06-06", "2026-06-08"], deaneries: [] },
];

function VenueCell({ place, first }: { place: EventPlace; count: number; first: boolean }) {
  return (
    <Link
      href="/timetable"
      className={`venue-cell block px-7 py-7 transition-colors duration-300 ease-lumen hover:bg-gold/[0.05] ${
        first ? "" : "border-t border-line md:border-l md:border-t-0"
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-serif text-[28px] font-semibold text-ink">{placeLabel(place.place)}</span>
        <span className="font-sans text-[12.5px] font-bold uppercase tracking-[0.08em] text-gold">
          {formatDateRangeShort(place.dates)}
        </span>
      </div>
      <div className="mt-1.5 font-sans text-[14.5px] text-sub">{place.venue}</div>
      {place.deaneries.length > 0 && (
        <div className="mt-4 font-sans text-[13px] leading-relaxed text-faint">
          {place.deaneries.map(placeLabel).join(" · ")}
        </div>
      )}
    </Link>
  );
}

function SpeakerPreview({ speaker }: { speaker: Speaker }) {
  return (
    <Link href="/speakers" className="block">
      <PhotoSlot
        src={speaker.photo_url}
        alt={speaker.name}
        label="Portrait"
        ratio="4 / 5"
        sizes="(max-width: 1024px) 45vw, 260px"
      />
      <div className="mt-3.5 font-serif text-xl font-semibold text-ink">{speaker.name}</div>
      {speaker.role && <div className="mt-0.5 font-sans text-sm font-semibold text-gold">{speaker.role}</div>}
    </Link>
  );
}
