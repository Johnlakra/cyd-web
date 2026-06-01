import { z } from "zod";

// Reconciled against cyd_Id_BE @ commit 8f9b01a (routes/anubhavPublic.js +
// controllers/anubhavPublicController.js). Server mounts:
//   app.use('/anubhav/public', anubhavPublicRoutes)  // no auth, rate-limited
//   app.use('/anubhav', anubhavRoutes)               // authenticated
//   app.use('/auth', authRoutes)                      // POST /auth/login
// Every response is the envelope: { success, message, data }.
// Trailing slash is stripped so `${API_BASE}/anubhav/...` never doubles up the
// slash (e.g. a local "http://localhost:3000/" + "/anubhav" would 404).
export const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE ?? "https://cyd-id-be.onrender.com"
).replace(/\/+$/, "");

// The three retreat places (middleware/anubhavRole.js PLACES). Some public
// endpoints (timetable) REQUIRE ?place=, so the frontend iterates these.
export const PLACES = ["phagwara", "abohar", "amritsar"] as const;
export type Place = (typeof PLACES)[number];
export const placeLabel = (p: string) => p.charAt(0).toUpperCase() + p.slice(1);

// "14:30:00" -> "2:30 PM". Tolerates null/empty and missing seconds.
export function formatTime(t?: string | null): string {
  if (!t) return "";
  const [hRaw, m = "00"] = t.split(":");
  const h = Number(hRaw);
  if (Number.isNaN(h)) return t;
  const period = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.padStart(2, "0")} ${period}`;
}

// Timetable `day` arrives as an integer 1..3 (dateToDay) or a date string.
export const dayLabel = (day: number | string): string =>
  typeof day === "number" ? `Day ${day}` : String(day);

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ["2026-06-02","2026-06-03","2026-06-04"] -> "Jun 2–4". Collapses a same-month
// range to one label; falls back gracefully on empty/odd input.
export function formatDateRangeShort(dates: string[]): string {
  const valid = dates
    .map((d) => new Date(d))
    .filter((d) => !Number.isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());
  if (valid.length === 0) return "Dates TBA";
  const first = valid[0];
  const last = valid[valid.length - 1];
  const m1 = MONTHS_SHORT[first.getMonth()];
  if (valid.length === 1) return `${m1} ${first.getDate()}`;
  if (first.getMonth() === last.getMonth()) return `${m1} ${first.getDate()}–${last.getDate()}`;
  return `${m1} ${first.getDate()} – ${MONTHS_SHORT[last.getMonth()]} ${last.getDate()}`;
}

// ISO timestamp -> "28 May 2026".
export function formatPostedDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

// ISO timestamp -> "2 days ago" / "Just now" relative to now.
export function relativeAgo(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.round(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

async function getJson(path: string, revalidate: number): Promise<unknown> {
  const res = await fetch(`${API_BASE}${path}`, { next: { revalidate } });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json();
}

function unwrap<T extends z.ZodTypeAny>(json: unknown, schema: T, path: string): z.infer<T> {
  const env = z.object({ success: z.boolean(), message: z.string().optional(), data: schema });
  const parsed = env.safeParse(json);
  if (!parsed.success) throw new Error(`API ${path} schema mismatch: ${parsed.error.message}`);
  return parsed.data.data;
}

// ---- Schemas (exact field names from the controllers) ----
export const Announcement = z.object({
  title: z.string(),
  body: z.string(),
  place: z.string().nullable(), // null == diocese-wide
  created_at: z.string(),
});
export type Announcement = z.infer<typeof Announcement>;
export const isDioceseWide = (a: Announcement) => a.place === null;

export const Speaker = z.object({
  name: z.string(),
  role: z.string().nullable(),
  bio: z.string().nullable(),
  photo_url: z.string().nullable(),
  place: z.string().nullable(),
});
export type Speaker = z.infer<typeof Speaker>;

export const TimetableItem = z.object({
  day: z.union([z.number(), z.string()]),
  start_time: z.string().nullable(),
  end_time: z.string().nullable(),
  title: z.string(),
  location: z.string().nullable(),
  notes: z.string().nullable(),
});
export type TimetableItem = z.infer<typeof TimetableItem>;

export const EventPlace = z.object({
  place: z.string(),
  venue: z.string(),
  dates: z.array(z.string()),
  deaneries: z.array(z.string()),
});
export type EventPlace = z.infer<typeof EventPlace>;

export const EventSummary = z.object({
  event: z.string(),
  perYouthFee: z.number(),
  places: z.array(EventPlace),
});
export type EventSummary = z.infer<typeof EventSummary>;

export const PlaceStat = z.object({
  place: z.string(),
  registered: z.number(),
  allotted: z.number(),
});
export const Stats = z.object({
  byPlace: z.array(PlaceStat),
  totals: z.object({ registered: z.number(), allotted: z.number() }),
  perYouthFee: z.number(),
});
export type Stats = z.infer<typeof Stats>;

// ---- Typed wrappers (paths verified against routes/anubhavPublic.js) ----
export const getEventSummary = async (): Promise<EventSummary> =>
  unwrap(await getJson("/anubhav/public/event-summary", 300), EventSummary, "event-summary");

export const getLatestAnnouncement = async (): Promise<Announcement | null> =>
  unwrap(
    await getJson("/anubhav/public/announcements/latest", 30),
    z.object({ announcement: Announcement.nullable() }),
    "announcements/latest"
  ).announcement;

export const getAnnouncements = async (place?: string): Promise<Announcement[]> =>
  unwrap(
    await getJson(`/anubhav/public/announcements${place ? `?place=${place}` : ""}`, 30),
    z.object({ place: z.string().nullable(), announcements: z.array(Announcement), count: z.number() }),
    "announcements"
  ).announcements;

// Public timetable REQUIRES ?place=. Fetch all places and tag each item.
export const getTimetableForPlace = async (place: string): Promise<TimetableItem[]> =>
  unwrap(
    await getJson(`/anubhav/public/timetable?place=${place}`, 60),
    z.object({ place: z.string(), items: z.array(TimetableItem), count: z.number() }),
    "timetable"
  ).items;

export const getAllTimetables = async (): Promise<Record<string, TimetableItem[]>> => {
  const results = await Promise.allSettled(PLACES.map((p) => getTimetableForPlace(p)));
  return PLACES.reduce<Record<string, TimetableItem[]>>((acc, place, i) => {
    const r = results[i];
    acc[place] = r.status === "fulfilled" ? r.value : [];
    return acc;
  }, {});
};

export const getStats = async (): Promise<Stats> =>
  unwrap(await getJson("/anubhav/public/stats", 60), Stats, "stats");

export const getSpeakers = async (place?: string): Promise<Speaker[]> =>
  unwrap(
    await getJson(`/anubhav/public/speakers${place ? `?place=${place}` : ""}`, 300),
    z.object({ place: z.string().nullable(), speakers: z.array(Speaker), count: z.number() }),
    "speakers"
  ).speakers;
