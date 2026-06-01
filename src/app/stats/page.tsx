import type { Metadata } from "next";
import { getStats, getEventSummary, placeLabel, formatDateRangeShort } from "@/lib/api";
import { SITE } from "@/lib/site";
import { PageHead } from "@/components/PageHead";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { GrowBar } from "@/components/GrowBar";

export const metadata: Metadata = {
  title: "Stats",
  description:
    "A living count of the youth registered across the three Punjab venues for Anubhav 2026.",
};

const NUMERAL = ["01", "02", "03", "04", "05"];

export default async function StatsPage() {
  const [statsR, summaryR] = await Promise.allSettled([getStats(), getEventSummary()]);
  const stats = statsR.status === "fulfilled" ? statsR.value : null;
  const summary = summaryR.status === "fulfilled" ? summaryR.value : null;

  if (!stats) {
    return (
      <div className="bg-bg">
        <PageHead kicker="Who is joining" title="By the numbers" />
        <p className="mx-auto max-w-site px-5 pb-20 font-serif text-xl italic text-faint sm:px-8 md:px-12">
          The numbers could not be loaded right now. Please try again shortly.
        </p>
      </div>
    );
  }

  const total = stats.totals.registered;
  const max = Math.max(1, ...stats.byPlace.map((s) => s.registered));
  const metaFor = (place: string) => summary?.places.find((p) => p.place === place);

  return (
    <div className="bg-bg">
      <PageHead
        kicker="Who is joining"
        title="By the numbers"
        sub={`A living count of the youth registered across the three Punjab venues for Anubhav ${SITE.year}.`}
      />

      {/* Hero total */}
      <section className="mx-auto max-w-site px-5 pb-14 pt-1 sm:px-8 md:px-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-[22px] bg-violetDeep p-9 text-white sm:p-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-28 h-[420px] w-[420px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(201,154,63,0.28), transparent 70%)" }}
            />
            <div className="relative flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="mb-4 font-sans text-[13px] font-semibold uppercase tracking-kicker text-goldSoft">
                  Total youth joining
                </div>
                <CountUp
                  value={total}
                  className="block font-serif font-medium leading-[0.82] tracking-[-0.04em] text-white text-[clamp(96px,16vw,200px)]"
                />
              </div>
              <div className="text-right">
                <div className="font-serif text-2xl italic text-[#D5C7EB] sm:text-[28px]">
                  and counting
                </div>
                <div className="mt-2 font-sans text-[15px] text-[#B6A8CC]">
                  Registered at {SITE.fee} per youth
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Per-place bars */}
      <section className="mx-auto max-w-site px-5 pb-14 sm:px-8 md:px-12">
        <div className="flex flex-col">
          {stats.byPlace.map((s, i) => {
            const pct = total > 0 ? Math.round((s.registered / total) * 100) : 0;
            const w = Math.round((s.registered / max) * 100);
            const meta = metaFor(s.place);
            return (
              <Reveal key={s.place} delay={0.06 * i}>
                <div className="stat-row grid grid-cols-1 items-center gap-4 border-b border-line py-7 sm:grid-cols-[210px_1fr_110px] sm:gap-8 sm:px-2">
                  <div>
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-sans text-[13px] font-bold text-gold">{NUMERAL[i]}</span>
                      <span className="font-serif text-[28px] font-semibold text-ink sm:text-[30px]">
                        {placeLabel(s.place)}
                      </span>
                    </div>
                    <div className="mt-1 font-sans text-[13.5px] text-sub">
                      {meta ? `${formatDateRangeShort(meta.dates)} · ` : ""}
                      {meta ? `${meta.deaneries.length} deaneries` : `${s.allotted} allotted`}
                    </div>
                  </div>
                  <div className="h-3.5 overflow-hidden rounded-full border border-lineSoft bg-bgAlt">
                    <GrowBar pct={w} delay={0.2 + i * 0.12} rounded />
                  </div>
                  <div className="sm:text-right">
                    <CountUp
                      value={s.registered}
                      className="font-serif text-[44px] font-medium tracking-[-0.02em] text-ink"
                    />
                    <div className="font-sans text-[13px] text-faint">{pct}% of total</div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Deaneries by venue */}
      {summary && summary.places.some((p) => p.deaneries.length > 0) && (
        <section className="mx-auto max-w-site px-5 pb-20 sm:px-8 md:px-12">
          <Reveal>
            <div className="mb-6 font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-violet">
              Deaneries by venue
            </div>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {summary.places.map((v, i) => (
              <Reveal key={v.place} delay={0.06 * i}>
                <div className="h-full rounded-2xl border border-line bg-paper p-6">
                  <div className="mb-4 font-serif text-[22px] font-semibold text-ink">
                    {placeLabel(v.place)}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {v.deaneries.map((d) => (
                      <span
                        key={d}
                        className="rounded-full border border-lineSoft bg-bgAlt px-3 py-1.5 font-sans text-[13.5px] text-sub"
                      >
                        {placeLabel(d)}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
