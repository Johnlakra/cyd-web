import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { Reveal } from "@/components/Reveal";
import { Kicker } from "@/components/Kicker";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Info & Guidelines",
  description:
    "Who can attend Anubhav 2026, what to bring, the registration fee, and the participation guidelines from the Youth Commission of the Diocese of Jalandhar.",
};

// Static participant information drawn from the official invitation letter
// (Ref. CYD/02/26). Eligibility, what to bring, and the rules of participation.
const ELIGIBILITY = [
  `Only unmarried Catholic youth between the ages of ${SITE.ageMin} and ${SITE.ageMax} are eligible to participate.`,
  `A maximum of ${SITE.perParishMax} youth from each parish may participate.`,
  "A recommendation letter from the parish priest is mandatory for participation.",
  `A registration fee of ${SITE.fee} per participant must be paid at the time of registration.`,
];

const BRING = [
  { item: "Bible", note: "for prayer and reflection" },
  { item: "Pen & notebook", note: "to carry home what you receive" },
  { item: "Bed sheets", note: "you will be staying overnight" },
  { item: "Personal toilet requisites", note: "soap, towel, brush, and the like" },
];

const GUIDELINES = [
  "Youth should be accompanied by a sister or a catechist to the venue, who is requested to remain with the youth throughout the retreat.",
  "There will be checking of bags at the entrance.",
  `Arrival is at ${SITE.arrival} on the first day; the retreat concludes at ${SITE.departure} on the final day.`,
];

export default function InfoPage() {
  return (
    <div className="bg-bg">
      <PageHead
        kicker="Before you come"
        title="Info & Guidelines"
        sub="Everything a participant needs to know before joining Anubhav 2026 — who can attend, what to carry, and how the retreat runs."
      />

      {/* THEME VERSE — the heart of why the retreat exists. */}
      <section className="mx-auto max-w-site px-5 pb-12 sm:px-8 md:px-12">
        <Reveal>
          <figure className="rounded-2xl border border-line bg-paper px-7 py-10 sm:px-10 sm:py-12">
            <Kicker tone="gold" className="mb-5">
              Our theme
            </Kicker>
            <blockquote className="m-0 max-w-[760px] font-serif text-[clamp(26px,4.4vw,40px)] font-medium leading-[1.15] tracking-[-0.015em] text-ink">
              &ldquo;{SITE.themeVerse}&rdquo;
            </blockquote>
            <figcaption className="mt-5 font-sans text-[15px] font-semibold text-violet">
              — {SITE.themeRef}
            </figcaption>
          </figure>
        </Reveal>
      </section>

      {/* ELIGIBILITY */}
      <InfoBlock kicker="Who can attend" title="Eligibility">
        <ol className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
          {ELIGIBILITY.map((text, i) => (
            <Reveal as="li" key={i} delay={0.05 * i}>
              <div className="flex h-full gap-4 rounded-xl border border-line bg-paper p-5">
                <span className="font-serif text-[26px] font-medium leading-none text-gold">
                  {i + 1}
                </span>
                <p className="m-0 font-sans text-[15.5px] leading-relaxed text-sub">{text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </InfoBlock>

      {/* WHAT TO BRING */}
      <InfoBlock kicker="Pack ahead" title="What to bring">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BRING.map((b, i) => (
            <Reveal key={b.item} delay={0.05 * i}>
              <div className="h-full border-t-2 border-ink pt-4">
                <div className="font-serif text-[22px] font-semibold tracking-[-0.01em] text-ink">
                  {b.item}
                </div>
                <div className="mt-1.5 font-sans text-[14px] leading-relaxed text-faint">
                  {b.note}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </InfoBlock>

      {/* GUIDELINES */}
      <InfoBlock kicker="Good to know" title="During the retreat">
        <ul className="m-0 flex list-none flex-col gap-px overflow-hidden rounded-2xl border border-line bg-paper p-0">
          {GUIDELINES.map((text, i) => (
            <Reveal as="li" key={i} delay={0.04 * i}>
              <div className="flex items-start gap-4 px-6 py-5">
                <span
                  className="mt-2 h-[6px] w-[6px] shrink-0 rounded-full bg-gold"
                  aria-hidden="true"
                />
                <p className="m-0 font-sans text-[15.5px] leading-relaxed text-sub">{text}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        {/* NB — note to the deanery fathers, lifted from the letter. */}
        <Reveal delay={0.1}>
          <div className="mt-5 rounded-xl border border-violet/25 bg-violet/[0.04] px-6 py-5">
            <span className="font-sans text-[12.5px] font-bold uppercase tracking-kicker text-violet">
              A note to the fathers
            </span>
            <p className="mt-2 font-sans text-[15px] leading-relaxed text-sub">
              The fathers of the deaneries are humbly requested to assist with administering the
              sacrament of confession on the second day of the retreat.
            </p>
          </div>
        </Reveal>
      </InfoBlock>

      {/* CONTACT */}
      <section className="mx-auto max-w-site px-5 pb-20 pt-4 sm:px-8 md:px-12">
        <Reveal>
          <div className="flex flex-col gap-6 rounded-2xl bg-violetDeep px-7 py-9 text-[#E9E2F0] sm:flex-row sm:items-end sm:justify-between sm:px-10">
            <div>
              <div className="mb-3 font-sans text-[12.5px] font-semibold uppercase tracking-kicker text-goldSoft">
                Questions?
              </div>
              <p className="m-0 max-w-[420px] font-serif text-xl italic leading-relaxed text-[#CDBFE0]">
                Reach the Youth Commission for anything about registration or the retreat.
              </p>
              <div className="mt-5 font-sans text-[15px] text-[#D9CFE8]">
                {SITE.director} · {SITE.directorTitle}
              </div>
            </div>
            <div className="flex flex-col gap-2 font-sans text-[15px]">
              <a
                href={`tel:${SITE.phoneHref}`}
                className="font-semibold text-white transition-colors hover:text-goldSoft"
              >
                {SITE.phone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="text-[#D9CFE8] transition-colors hover:text-white"
              >
                {SITE.email}
              </a>
              <Link
                href="/login"
                className="mt-3 inline-block w-fit rounded-full bg-paper px-6 py-2.5 font-semibold text-violet transition-transform duration-300 ease-lumen hover:-translate-y-0.5"
              >
                View my details
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function InfoBlock({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-site px-5 pb-14 sm:px-8 md:px-12">
      <div className="mb-7">
        <Reveal>
          <Kicker className="mb-3">{kicker}</Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="m-0 font-serif text-[32px] font-medium tracking-[-0.02em] text-ink sm:text-[40px]">
            {title}
          </h2>
        </Reveal>
      </div>
      {children}
    </section>
  );
}
