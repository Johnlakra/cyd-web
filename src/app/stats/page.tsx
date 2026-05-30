import type { Metadata } from "next";
import { getStats, placeLabel } from "@/lib/api";

export const metadata: Metadata = { title: "Stats" };

// Big-number cards per place + total. collection = totals.registered × perYouthFee.
export default async function StatsPage() {
  let stats;
  try {
    stats = await getStats();
  } catch {
    return <main className="mx-auto max-w-5xl px-5 py-12 text-ink/70">Could not load stats.</main>;
  }

  const collection = stats.totals.registered * stats.perYouthFee;

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="font-display text-4xl">By the numbers</h1>
      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
        <BigStat label="Total registered" value={stats.totals.registered} />
        <BigStat label="Total allotted" value={stats.totals.allotted} />
        {stats.byPlace.map((s) => (
          <BigStat key={s.place} label={placeLabel(s.place)} value={s.registered} />
        ))}
        <BigStat label={`Collection (₹${stats.perYouthFee}/youth)`} value={collection} prefix="₹" />
      </div>
    </main>
  );
}

function BigStat({ label, value, prefix = "" }: { label: string; value: number; prefix?: string }) {
  // TODO(designer): animated count-up on first view (respect reduced-motion).
  return (
    <div className="rounded-xl border border-ink/10 p-6">
      <div className="font-display text-5xl tabular-nums">
        {prefix}
        {value.toLocaleString()}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wide text-ink/60">{label}</div>
    </div>
  );
}
