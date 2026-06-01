import type { Metadata } from "next";
import { getSpeakers, placeLabel, type Speaker } from "@/lib/api";
import { PageHead } from "@/components/PageHead";
import { Reveal } from "@/components/Reveal";
import { PhotoSlot } from "@/components/PhotoSlot";

export const metadata: Metadata = {
  title: "Speakers",
  description:
    "Meet the preachers, guides, and worship leaders walking with the youth through Anubhav 2026.",
};

// Portrait + bio cards, two-up on desktop, stacked layout on mobile.
export default async function SpeakersPage() {
  let speakers: Speaker[];
  try {
    speakers = await getSpeakers();
  } catch {
    return (
      <div className="bg-bg">
        <PageHead kicker="Voices of the retreat" title="Speakers & guides" />
        <p className="mx-auto max-w-site px-5 pb-20 font-serif text-xl italic text-faint sm:px-8 md:px-12">
          Speakers could not be loaded right now. Please try again shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg">
      <PageHead
        kicker="Voices of the retreat"
        title="Speakers & guides"
        sub="The preachers, guides, and worship leaders who will walk with you through the three days."
      />
      <section className="mx-auto max-w-site px-5 pb-20 pt-5 sm:px-8 md:px-12">
        {speakers.length === 0 ? (
          <p className="py-12 text-center font-serif text-2xl italic text-faint">
            Speakers will be announced soon.
          </p>
        ) : (
          <div className="grid gap-7 md:grid-cols-2">
            {speakers.map((s, i) => (
              <Reveal key={`${s.name}-${i}`} delay={0.06 * i}>
                <article className="speaker-card grid grid-cols-[110px_1fr] items-start gap-5 rounded-[18px] border border-line bg-paper p-5 transition-[transform,box-shadow] duration-300 ease-lumen hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(36,27,46,0.08)] sm:grid-cols-[180px_1fr] sm:gap-6 sm:p-6">
                  <PhotoSlot
                    src={s.photo_url}
                    alt={s.name}
                    label="Portrait"
                    ratio="4 / 5"
                    sizes="(max-width: 640px) 110px, 180px"
                  />
                  <div className="pt-1 sm:pt-1.5">
                    {s.role && (
                      <div className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.1em] text-gold">
                        {s.role}
                      </div>
                    )}
                    <h2 className="m-0 mb-1.5 font-serif text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-[28px]">
                      {s.name}
                    </h2>
                    {s.place && (
                      <div className="mb-4 font-sans text-sm text-sub">{placeLabel(s.place)}</div>
                    )}
                    {s.bio && (
                      <p className="m-0 font-sans text-[15.5px] leading-relaxed text-sub">{s.bio}</p>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
