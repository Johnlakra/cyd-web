"use client";

import { useMemo, useState } from "react";
import {
  placeLabel,
  formatPostedDate,
  relativeAgo,
  isDioceseWide,
  PLACES,
  type Announcement,
} from "@/lib/api";
import { Reveal } from "./Reveal";

// Full announcements feed with a place filter. Latest first; diocese-wide notices
// get a distinct treatment (deep violet lead card / violet row tag).
export function AnnouncementsFeed({ items }: { items: Announcement[] }) {
  const [filter, setFilter] = useState("All");

  const filters = useMemo(() => {
    const present = PLACES.filter((p) => items.some((a) => a.place === p));
    return ["All", "Diocese-wide", ...present.map(placeLabel)];
  }, [items]);

  const list = items.filter((a) => {
    if (filter === "All") return true;
    if (filter === "Diocese-wide") return isDioceseWide(a);
    return placeLabel(a.place ?? "") === filter;
  });
  const lead = list[0];
  const rest = list.slice(1);

  return (
    <>
      {/* Filters */}
      <section className="mx-auto max-w-site px-5 sm:px-8 md:px-12">
        <div className="flex flex-wrap gap-2.5 border-b border-line pb-8">
          {filters.map((p) => {
            const active = filter === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setFilter(p)}
                aria-pressed={active}
                className={`min-h-[40px] rounded-full border px-4 py-2 font-sans text-sm font-semibold transition-all duration-200 ease-lumen ${
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-sub hover:border-ink/40"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </section>

      {/* Lead */}
      <section className="mx-auto max-w-site px-5 pt-10 sm:px-8 md:px-12">
        {lead && (
          <Reveal>
            <AnnCard a={lead} lead />
          </Reveal>
        )}
      </section>

      {/* Rest */}
      <section className="mx-auto max-w-site px-5 pb-20 pt-9 sm:px-8 md:px-12">
        <div className="flex flex-col">
          {rest.map((a, i) => (
            <Reveal key={`${a.created_at}-${i}`} delay={0.05 * i}>
              <AnnRow a={a} />
            </Reveal>
          ))}
          {!lead && (
            <div className="py-16 text-center font-serif text-2xl italic text-faint">
              No announcements for this filter yet.
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function AnnCard({ a, lead }: { a: Announcement; lead?: boolean }) {
  const wide = isDioceseWide(a);
  return (
    <article
      className={`relative overflow-hidden rounded-[18px] p-8 sm:p-11 ${
        wide ? "bg-violetDeep text-[#F0EAF7]" : "border border-line bg-paper text-ink"
      }`}
    >
      {wide && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold to-goldSoft"
        />
      )}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-sans text-[12.5px] font-bold tracking-[0.04em] ${
            wide
              ? "border-goldSoft/40 bg-goldSoft/20 text-[#E8C88B]"
              : "border-line bg-violet/10 text-violet"
          }`}
        >
          <span className={`h-[5px] w-[5px] rounded-full ${wide ? "bg-goldSoft" : "bg-violet"}`} />
          {wide ? "Diocese-wide" : placeLabel(a.place ?? "")}
        </span>
        <span className={`font-sans text-[13.5px] ${wide ? "text-[#BBA9D6]" : "text-faint"}`}>
          {formatPostedDate(a.created_at)} · {relativeAgo(a.created_at)}
        </span>
      </div>
      <h2
        className="m-0 max-w-[800px] font-serif font-medium leading-[1.08] tracking-[-0.015em]"
        style={{ fontSize: lead ? "clamp(28px, 5vw, 40px)" : "clamp(24px, 4vw, 30px)" }}
      >
        {a.title}
      </h2>
      <p
        className={`m-0 mt-4 max-w-[720px] font-sans text-[17px] leading-relaxed ${
          wide ? "text-[#D5CAE6]" : "text-sub"
        }`}
      >
        {a.body}
      </p>
    </article>
  );
}

function AnnRow({ a }: { a: Announcement }) {
  const wide = isDioceseWide(a);
  return (
    <div className="group grid grid-cols-1 gap-3 border-b border-line py-7 sm:grid-cols-[150px_1fr] sm:gap-8 sm:px-2">
      <div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 font-sans text-xs font-bold ${
            wide ? "border-violet/30 bg-violet/10 text-violet" : "border-line text-sub"
          }`}
        >
          {wide && <span className="h-1 w-1 rounded-full bg-gold" />}
          {wide ? "Diocese-wide" : placeLabel(a.place ?? "")}
        </span>
        <div className="mt-2.5 font-sans text-[13px] text-faint">{formatPostedDate(a.created_at)}</div>
      </div>
      <div>
        <h3 className="m-0 mb-2 font-serif text-[22px] font-medium leading-tight tracking-[-0.01em] text-ink sm:text-[25px]">
          <span className="border-b-[1.5px] border-transparent pb-0.5 transition-colors duration-300 ease-lumen group-hover:border-gold">
            {a.title}
          </span>
        </h3>
        <p className="m-0 max-w-[680px] font-sans text-base leading-relaxed text-sub">{a.body}</p>
      </div>
    </div>
  );
}
