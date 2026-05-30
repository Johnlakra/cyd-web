import type { Metadata } from "next";
import Image from "next/image";
import { getSpeakers } from "@/lib/api";

export const metadata: Metadata = { title: "Speakers" };

// Grid with photos, names, roles, bios. Designer pass adds bio overlay on hover/tap.
export default async function SpeakersPage() {
  let speakers;
  try {
    speakers = await getSpeakers();
  } catch {
    return <main className="mx-auto max-w-5xl px-5 py-12 text-ink/70">Could not load speakers.</main>;
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="font-display text-4xl">Speakers</h1>
      {speakers.length === 0 ? (
        <p className="mt-8 text-ink/60">Speakers will be announced soon.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
          {speakers.map((s, i) => (
            <li key={`${s.name}-${i}`} className="rounded-xl border border-ink/10 p-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-ink/5">
                {s.photo_url && (
                  <Image src={s.photo_url} alt={s.name} fill className="object-cover" sizes="(max-width:640px) 50vw, 33vw" />
                )}
              </div>
              <h2 className="mt-3 font-display text-lg">{s.name}</h2>
              {s.role && <p className="text-sm text-ink/60">{s.role}</p>}
              {s.bio && <p className="mt-2 line-clamp-3 text-sm text-ink/70">{s.bio}</p>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
