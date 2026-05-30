import type { Metadata } from "next";
import { getAnnouncements, isDioceseWide, placeLabel } from "@/lib/api";

export const metadata: Metadata = { title: "Announcements" };

// Full list, newest first; diocese-wide (place === null) visually distinguished.
export default async function AnnouncementsPage() {
  let items;
  try {
    items = await getAnnouncements();
  } catch {
    return (
      <main className="mx-auto max-w-3xl px-5 py-12 text-ink/70">
        Could not load announcements. Please try again shortly.
      </main>
    );
  }

  if (!items.length) {
    return <main className="mx-auto max-w-3xl px-5 py-12 text-ink/60">No announcements yet.</main>;
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-4xl">Announcements</h1>
      <ul className="mt-8 space-y-4">
        {items.map((a, i) => {
          const wide = isDioceseWide(a);
          return (
            <li
              key={`${a.created_at}-${i}`}
              className={`rounded-xl border p-5 ${wide ? "border-accent/50 bg-accent/5" : "border-ink/10"}`}
            >
              <span className="text-xs uppercase tracking-widest text-accent">
                {wide ? "Diocese-wide" : placeLabel(a.place as string)}
              </span>
              <h2 className="mt-1 font-display text-xl">{a.title}</h2>
              <p className="mt-2 text-ink/80">{a.body}</p>
              <time className="mt-3 block text-xs text-ink/50">{a.created_at}</time>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
