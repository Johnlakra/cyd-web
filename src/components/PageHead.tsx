import { Kicker } from "./Kicker";
import { Reveal } from "./Reveal";

// Shared inner-page header — kicker + oversized serif title + optional sub.
export function PageHead({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <section className="mx-auto max-w-site px-5 pb-8 pt-12 sm:px-8 sm:pt-14 md:px-12">
      <Reveal>
        <Kicker className="mb-4">{kicker}</Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <h1
          className="font-serif font-medium leading-[0.95] tracking-[-0.03em] text-ink"
          style={{ fontSize: "clamp(44px, 8vw, 92px)" }}
        >
          {title}
        </h1>
      </Reveal>
      {sub && (
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl font-sans text-[17px] leading-relaxed text-sub sm:text-lg">
            {sub}
          </p>
        </Reveal>
      )}
    </section>
  );
}
