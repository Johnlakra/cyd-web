import { cookies } from "next/headers";
import { z } from "zod";
import { API_BASE } from "./api";

export const AUTH_COOKIE = process.env.AUTH_COOKIE_NAME ?? "anubhav_jwt";

// GET /anubhav/my/event (controllers/anubhavParticipantController.js).
// Returns { registered: false } when the user has no active registration,
// otherwise the full self-view. Roommates expose name + parish only (no phone).
const TimetableRow = z.object({
  day: z.union([z.number(), z.string()]),
  start_time: z.string().nullable().optional(),
  end_time: z.string().nullable().optional(),
  title: z.string(),
  location: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

const MyAnnouncement = z.object({
  title: z.string(),
  body: z.string(),
  place: z.string().nullable(),
  created_at: z.string(),
});

const Room = z.object({
  building: z.string(),
  floor: z.string(),
  room: z.string(),
  roommates: z.array(z.object({ name: z.string(), parish: z.string() })),
});

export const MyEvent = z.union([
  z.object({ registered: z.literal(false) }),
  z.object({
    registered: z.literal(true),
    place: z.string(),
    venue: z.string().nullable(), // currently null from the backend
    dates: z.array(z.string()),
    room: Room.nullable(),
    timetable: z.array(TimetableRow),
    live: z
      .object({ now: TimetableRow.nullable(), next: TimetableRow.nullable() })
      .optional(),
    announcements: z.array(MyAnnouncement),
  }),
]);
export type MyEvent = z.infer<typeof MyEvent>;

/** Server-side: read the httpOnly cookie and fetch the authenticated self-view. */
export async function getMyEvent(): Promise<MyEvent | null> {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) return null;
  const res = await fetch(`${API_BASE}/anubhav/my/event`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`/anubhav/my/event failed: ${res.status}`);
  const json = await res.json();
  const parsed = MyEvent.safeParse(json.data);
  if (!parsed.success) throw new Error(`my/event schema mismatch: ${parsed.error.message}`);
  return parsed.data;
}

export function isAuthenticated(): boolean {
  return Boolean(cookies().get(AUTH_COOKIE)?.value);
}
